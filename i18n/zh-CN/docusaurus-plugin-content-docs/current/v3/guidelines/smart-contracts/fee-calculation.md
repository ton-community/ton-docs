# 费用计算

当您的合约开始处理收到的报文时，您应该检查报文所附的 TON 数，以确保它们足以支付[所有类型的费用](/v3/documentation/smart-contracts/transaction-fees/fees#elements-of-transaction-fee)。为此，您需要计算（或预测）当前交易的费用。

本文档描述了如何使用新的 TVM 操作码 (opcode) 计算FunC 合约的费用。

:::info 有关操作码的更多信息
有关 TVM 操作码（包括下面提到的操作码）的完整列表，请查看 [TVM 指令页面](/v3/documentation/tvm/instructions)。
:::

## 存储费

### 概述

简而言之，`存储费` 是您为在区块链上存储智能合约而支付的费用。智能合约在区块链上存储的每一秒都需要付费。

使用带有以下参数的 `GETSTORAGEFEE` 操作码：

| 参数名称                       | 说明                  |
| :------------------------- | :------------------ |
| cells                      | 合约 cell 数           |
| bits                       | 合约位数                |
| is_mc | 如果源或目标位于主链中，则为 True |

:::info 存储和转发费用只计算唯一的哈希 cell ，即 3 个相同的哈希 cell 算作一个。

特别是，它可以重复数据：如果在不同分支中引用了多个等效子 cell ，则其内容只需存储一次。

[有关重复数据删除的更多信息](/v3/documentation/data-formats/ltb/library-cells)。
:::

### 计算流程

每份合约都有余额。您可以使用函数计算在指定的 "秒 "时间内，您的合约需要多少 TON 才能继续有效：

```func
int get_storage_fee(int workchain, int seconds, int bits, int cells) asm(cells bits seconds workchain) "GETSTORAGEFEE";
```

然后，您可以将该值硬编码到合约中，并使用该值计算当前的存储费用：

```func
;; functions from func stdlib (not presented on mainnet)
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
int get_storage_fee(int workchain, int seconds, int bits, int cells) asm(cells bits seconds workchain) "GETSTORAGEFEE";
int my_storage_due() asm "DUEPAYMENT";

;; constants from stdlib
;;; Creates an output action which would reserve exactly x nanograms (if y = 0).
const int RESERVE_REGULAR = 0;
;;; Creates an output action which would reserve at most x nanograms (if y = 2).
;;; Bit +2 in y means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved.
const int RESERVE_AT_MOST = 2;
;;; in the case of action fail - bounce transaction. No effect if RESERVE_AT_MOST (+2) is used. TVM UPGRADE 2023-07. v3/documentation/tvm/changelog/tvm-upgrade-2023-07#sending-messages
const int RESERVE_BOUNCE_ON_ACTION_FAIL = 16;

() calculate_and_reserve_at_most_storage_fee(int balance, int msg_value, int workchain, int seconds, int bits, int cells) inline {
    int on_balance_before_msg = my_ton_balance - msg_value;
    int min_storage_fee = get_storage_fee(workchain, seconds, bits, cells); ;; can be hardcoded IF CODE OF THE CONTRACT WILL NOT BE UPDATED
    raw_reserve(max(on_balance_before_msg, min_storage_fee + my_storage_due()), RESERVE_AT_MOST);
}
```

如果 `storage_fee` 是硬编码，**记得在合约更新过程中更新它**。并非所有合约都支持更新，因此这是一个可选要求。

## 计算费

### 概述

在大多数情况下，使用带有以下参数的 `GETGASFEE` 操作码：

| 参数         | 说明                  |
| :--------- | :------------------ |
| `gas_used` | gas 量，在测试中计算并硬编码    |
| `is_mc`    | 如果源或目标位于主链中，则为 True |

### 计算流程

```func
int get_compute_fee(int workchain, int gas_used) asm(gas_used workchain) "GETGASFEE";
```

但如何获取 `gas_used` 呢？通过测试！

要计算 `gas_used`，您应该为合约编写一个测试：

1. 进行转账。
2. 检查是否成功，并检索传输信息。
3. 检查该传输实际使用的 gas 量，以便计算。

合约的计算流程可能取决于输入数据。您应该以这种方式运行合约，以尽可能多地使用 gas 。确保使用最昂贵的计算方式来计算合约

```ts
// Just Init code
const deployerJettonWallet = await userWallet(deployer.address);
let initialJettonBalance = await deployerJettonWallet.getJettonBalance();
const notDeployerJettonWallet = await userWallet(notDeployer.address);
let initialJettonBalance2 = await notDeployerJettonWallet.getJettonBalance();
let sentAmount = toNano('0.5');
let forwardAmount = toNano('0.05');
let forwardPayload = beginCell().storeUint(0x1234567890abcdefn, 128).endCell();
// Make sure payload is different, so cell load is charged for each individual payload.
let customPayload = beginCell().storeUint(0xfedcba0987654321n, 128).endCell();

// Let's use this case for fees calculation
// Put the forward payload into custom payload, to make sure maximum possible gas is used during computation
const sendResult = await deployerJettonWallet.sendTransfer(deployer.getSender(), toNano('0.17'), // tons
    sentAmount, notDeployer.address,
    deployer.address, customPayload, forwardAmount, forwardPayload);
expect(sendResult.transactions).toHaveTransaction({ //excesses
    from: notDeployerJettonWallet.address,
    to: deployer.address,
});
/*
transfer_notification#7362d09c query_id:uint64 amount:(VarUInteger 16)
                              sender:MsgAddress forward_payload:(Either Cell ^Cell)
                              = InternalMsgBody;
*/
expect(sendResult.transactions).toHaveTransaction({ // notification
    from: notDeployerJettonWallet.address,
    to: notDeployer.address,
    value: forwardAmount,
    body: beginCell().storeUint(Op.transfer_notification, 32).storeUint(0, 64) // default queryId
        .storeCoins(sentAmount)
        .storeAddress(deployer.address)
        .storeUint(1, 1)
        .storeRef(forwardPayload)
        .endCell()
});
const transferTx = findTransactionRequired(sendResult.transactions, {
    on: deployerJettonWallet.address,
    from: deployer.address,
    op: Op.transfer,
    success: true
});

let computedGeneric: (transaction: Transaction) => TransactionComputeVm;
computedGeneric = (transaction) => {
  if(transaction.description.type !== "generic")
    throw("Expected generic transactionaction");
  if(transaction.description.computePhase.type !== "vm")
    throw("Compute phase expected")
  return transaction.description.computePhase;
}

let printTxGasStats: (name: string, trans: Transaction) => bigint;
printTxGasStats = (name, transaction) => {
    const txComputed = computedGeneric(transaction);
    console.log(`${name} used ${txComputed.gasUsed} gas`);
    console.log(`${name} gas cost: ${txComputed.gasFees}`);
    return txComputed.gasFees;
}

send_gas_fee = printTxGasStats("Jetton transfer", transferTx);
```

## 预付费

### 概述

转发费是针对发出的信息收取的。

一般来说，预付费处理有三种情况：

1. 信息结构是确定的，您可以预测费用。
2. 报文结构在很大程度上取决于接收到的报文结构。
3. 你根本无法预测传出信息的结构。

### 计算流程

如果报文结构是确定的，则使用带有以下参数的 `GETFORWARDFEE` 操作码：

| 参数名称                       | 说明                  |
| :------------------------- | :------------------ |
| cells                      | cell 数              |
| bits                       | 位数                  |
| is_mc | 如果源或目标位于主链中，则为 True |

:::info 存储和转发费用只计算唯一的哈希 cell ，即 3 个相同的哈希 cell 算作一个。

特别是，它可以重复数据：如果在不同分支中引用了多个等效 sub-cells，则其内容只需存储一次。

[有关重复数据删除的更多信息](/v3/documentation/data-formats/ltb/library-cells)。
:::

但是，有时发出的报文在很大程度上取决于收到的结构，在这种情况下，您无法完全预测费用。请尝试使用带有以下参数的 `GETORIGINALFWDFEE` 操作码：

| 参数名称                         | 说明                  |
| :--------------------------- | :------------------ |
| fwd_fee | 从接收到的信息中解析出来        |
| is_mc   | 如果源或目标位于主链中，则为 True |

:::caution 小心使用 `SENDMSG` 操作码

它使用的 gas 量**无法预测**。

非必要不使用
:::

如果连 `GETORIGINALFWDFEE` 都无法使用，还有一个选择。使用带有以下参数的 `SENDMSG` 操作码：

| 参数名称  | 说明     |
| :---- | :----- |
| cells | cell 数 |
| mode  | 信息模式   |

模式对费用计算的影响如下：

- `+1024` 不创建行动，只估算费用。其他模式将在行动阶段发送信息。
- `+128` 代替了计算阶段开始前合约全部余额的价值（略有不准确，因为在计算阶段结束前无法估算的 gas 费用没有考虑在内）。
- `+64` 将接收信息的全部余额替换为输出值（略有误差，因为计算完成前无法估算的 gas 费用不会计算在内）。
- 其他模式见 [信息模式页面](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes)。

它创建一个输出操作，并返回创建信息的费用。但是，它使用的 gas 量无法预测，无法用公式计算，那么如何计算呢？使用 `GASCONSUMED`：

```func
int send_message(cell msg, int mode) impure asm "SENDMSG";
int gas_consumed() asm "GASCONSUMED";
;; ... some code ...

() calculate_forward_fee(cell msg, int mode) inline {
  int gas_before = gas_consumed();
  int forward_fee = send_message(msg, mode);
  int gas_usage = gas_consumed() - gas_before;
  
  ;; forward fee -- fee value
  ;; gas_usage -- amount of gas, used to send msg
}
```

## 另请参见

- [带费用计算的稳定币合约](https://github.com/ton-blockchain/stablecoin-contract)
