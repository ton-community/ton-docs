# Fees Calculation

When your contract starts processing an incoming message, you should check the amount of TONs attached to the message to ensure they are enough to cover [all types of fees](/v3/documentation/smart-contracts/transaction-fees/fees#elements-of-transaction-fee). To do this, you need to calculate (or predict) the fee for the current transaction.

This document describes how to calculate fees in FunC contracts using the new TVM opcodes.

:::info More information on opcodes
For a comprehensive list of TVM opcodes, including those mentioned below, check the [TVM instruction page](/v3/documentation/tvm/instructions).
:::

## Storage Fee

### Overview

In brief, `storage fees` are the amounts you pay for storing a smart contract on the blockchain. You pay for every second the smart contract is stored on the blockchain.

Use the `GETSTORAGEFEE` opcode with the following parameters:

| Param name | Description                                             |
|:-----------|:--------------------------------------------------------|
| cells      | Number of contract cells                                |
| bits       | Number of contract bits                                 |
| is_mc      | True if the source or destination is in the masterchain |

:::info Only unique hash cells are counted for storage and fwd fees i.e. 3 identical hash cells are counted as one.

In particular, it deduplicates data: if there are several equivalent sub-cells referenced in different branches, their content is only stored once.

[Read more about deduplication](/v3/documentation/data-formats/tlb/library-cells).
:::

### Calculation Flow

Each contract has its balance. You can calculate how many TONs your contract requires to remain valid for a specified `seconds` time using the function:

```func
int get_storage_fee(int workchain, int seconds, int bits, int cells) asm(cells bits seconds workchain) "GETSTORAGEFEE";
```

You can then hardcode that value into the contract and calculate the current storage fee using:

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

If `storage_fee` is hardcoded, **remember to update it** during contract update process. Not all contracts support updating, so this is an optional requirement.

## Computation Fee

### Overview

In most cases use the `GETGASFEE` opcode with the following parameters:

| Param      | Description                                             |
|:-----------|:--------------------------------------------------------|
| `gas_used` | Gas amount, calculated in tests and hardcoded           |
| `is_mc`    | True if the source or destination is in the masterchain |

### Calculation Flow

```func
int get_compute_fee(int workchain, int gas_used) asm(gas_used workchain) "GETGASFEE";
```

But how do you get `gas_used`? Through tests!

To calculate `gas_used`, you should write a test for your contract that:

1. Makes a transfer.
2. Checks if it's successful and retrieves the transfer info.
3. Checks the actual amount of gas used by that transfer for computation.

Contract computation flow can depend on input data. You should run contract in that way to use as much gas as possible. Make sure that you are using the most expensive compute way to compute contract

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

## Forward Fee

### Overview

The forward fee is taken for outgoing messages.

Generally, there are three cases of forward fee processing:

1. The message structure is deterministic and you can predict the fee.
2. The message structure depends a lot on the incoming message structure.
3. You can't predict the outgoing message structure at all.

### Calculation Flow

If the message structure is deterministic, use the `GETFORWARDFEE` opcode with the following parameters:

| Param name | Description                                                                            |
|:-----------|:---------------------------------------------------------------------------------------|
| cells      | Number of cells                                                                        |
| bits       | Number of bits                                                                         |
| is_mc      | True if the source or destination is in the masterchain                                |

:::info Only unique hash cells are counted for storage and fwd fees i.e. 3 identical hash cells are counted as one.

In particular, it deduplicates data: if there are several equivalent sub-cells referenced in different branches, their content is only stored once.

[Read more about deduplication](/v3/documentation/data-formats/tlb/library-cells).
:::

However, sometimes the outgoing message depends significantly on the incoming structure, and in that case, you can't fully predict the fee. Try to use the `GETORIGINALFWDFEE` opcode with the following parameters:

| Param name | Description                                         |
|:-----------|:----------------------------------------------------|
| fwd_fee    | Parsed from the incoming message                    |
| is_mc      | True if the source or destination is in the masterchain |

:::caution Be careful with `SENDMSG` opcode
Next opcode, `SENDMSG`, **is the least optimal way** to calculate fee, but **better than not checking**.

It uses an **unpredictable amount** of gas.

Do not use it unless necessary.
:::

If even `GETORIGINALFWDFEE` can't be used, there is one more option. Use the `SENDMSG` opcode with the following parameters:

| Param name | Description  |
|:-----------|:-------------|
| cells      | Number of cells |
| mode       | Message mode |

Modes affect the fee calculation as follows:
- `+1024` do not create action, only estimate fee. Other modes will send a message in action phase.
- `+128` substitutes the value of the entire balance of the contract before the start of the computation phase (slightly inaccurate, since gas expenses that cannot be estimated before the completion of the computation phase are not taken into account).
- `+64` substitutes the entire balance of the incoming message as an outcoming value (slightly inaccurate, gas expenses that cannot be estimated before the computation is completed are not taken into account).
- Other modes can be found [on message modes page](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes).

It creates an output action and returns a fee for creating a message. However, it uses an unpredictable amount of gas, which can't be calculated using formulas, so how can it be calculated? Use `GASCONSUMED`:

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

## See Also
- [Stablecoin contract with fees calculation](https://github.com/ton-blockchain/stablecoin-contract)
