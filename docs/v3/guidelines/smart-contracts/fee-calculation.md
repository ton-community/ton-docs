# Fees Calculation

When your contract starts processing an incoming message, you should check the amount of TONs attached to the message to ensure they are enough to cover [all types of fees](/v3/documentation/smart-contracts/transaction-fees/fees#elements-of-transaction-fee). To do this, you need to calculate (or predict) the fee for the current transaction.

This document explains how to calculate fees in FunC contracts using the latest TVM opcodes.

:::info More information on opcodes
For a comprehensive list of TVM opcodes, including those mentioned below, check the [TVM instruction page](/v3/documentation/tvm/instructions).
:::

## Storage fee

### Overview

In short, `storage fees` are the costs of storing a smart contract on the blockchain. You pay for every second the smart contract remains stored on the blockchain.

Use the `GETSTORAGEFEE` opcode with the following parameters:

| Param name | Description                                             |
| :--------- | :------------------------------------------------------ |
| cells      | Number of contract cells                                |
| bits       | Number of contract bits                                 |
| is_mc      | True if the source or destination is in the MasterChain |

:::info Only unique hash cells are counted for storage and forward fees. For example, three identical hash cells are counted as one.

This mechanism deduplicates data: if multiple equivalent sub-cells are referenced across different branches, their content is stored only once.

[Read more about deduplication](/v3/documentation/data-formats/tlb/library-cells).
:::

### Calculation flow

Each contract has its balance. You can calculate how many TONs your contract requires to remain valid for a specified `seconds` duration using the function:

```func
int get_storage_fee(int workchain, int seconds, int bits, int cells) asm(cells bits seconds workchain) "GETSTORAGEFEE";
```

You can then hardcode this value into the contract and calculate the current storage fee using:

```func
;; functions from func stdlib (not available on mainnet)
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
int get_storage_fee(int workchain, int seconds, int bits, int cells) asm(cells bits seconds workchain) "GETSTORAGEFEE";
int my_storage_due() asm "DUEPAYMENT";

;; constants from stdlib
;;; Creates an output action which would reserve exactly x nanograms (if y = 0).
const int RESERVE_REGULAR = 0;
;;; Creates an output action which would reserve at most x nanograms (if y = 2).
;;; Bit +2 in y means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved.
const int RESERVE_AT_MOST = 2;
;;; In the case of action failure, the transaction is bounced. No effect if RESERVE_AT_MOST (+2) is used. TVM UPGRADE 2023-07. [v3/documentation/tvm/changelog/tvm-upgrade-2023-07#sending-messages](https://ton.org/docs/#/tvm/changelog/tvm-upgrade-2023-07#sending-messages)
const int RESERVE_BOUNCE_ON_ACTION_FAIL = 16;

() calculate_and_reserve_at_most_storage_fee(int balance, int msg_value, int workchain, int seconds, int bits, int cells) inline {
    int on_balance_before_msg = my_ton_balance - msg_value;
    int min_storage_fee = get_storage_fee(workchain, seconds, bits, cells); ;; can be hardcoded IF CODE OF THE CONTRACT WILL NOT BE UPDATED
    raw_reserve(max(on_balance_before_msg, min_storage_fee + my_storage_due()), RESERVE_AT_MOST);
}
```

If `storage_fee` is hardcoded, **remember to update it** during the contract update process. Not all contracts support updates, so this is an optional requirement.

## Computation fee

### Overview

In most cases, use the `GETGASFEE` opcode with the following parameters:

| Param      | Description                                             |
| :--------- | :------------------------------------------------------ |
| `gas_used` | Gas amount, calculated in tests and hardcoded           |
| `is_mc`    | True if the source or destination is in the masterchain |

### Calculation flow

```func
int get_compute_fee(int workchain, int gas_used) asm(gas_used workchain) "GETGASFEE";
```

But how do you determine `gas_used`? Through testing!

To calculate `gas_used`, you should write a test for your contract that:

1. Executes a transfer.
2. Verifies its success and retrieves the transfer details.
3. Checks the amount of gas the transfer uses for computation.

The contract's computation flow can depend on input data. You should run the contract in a way that maximizes gas usage. Ensure you are using the most computationally expensive path to test the contract.

```ts
// Initialization code
const deployerJettonWallet = await userWallet(deployer.address);
let initialJettonBalance = await deployerJettonWallet.getJettonBalance();
const notDeployerJettonWallet = await userWallet(notDeployer.address);
let initialJettonBalance2 = await notDeployerJettonWallet.getJettonBalance();
let sentAmount = toNano("0.5");
let forwardAmount = toNano("0.05");
let forwardPayload = beginCell().storeUint(0x1234567890abcdefn, 128).endCell();
// Ensure the payload is unique to charge cell loading for each payload.
let customPayload = beginCell().storeUint(0xfedcba0987654321n, 128).endCell();

// Let's use this case for fees calculation
// Put the forward payload into custom payload, to make sure maximum possible gas is used during computation
const sendResult = await deployerJettonWallet.sendTransfer(
  deployer.getSender(),
  toNano("0.17"), // tons
  sentAmount,
  notDeployer.address,
  deployer.address,
  customPayload,
  forwardAmount,
  forwardPayload
);
expect(sendResult.transactions).toHaveTransaction({
  //excesses
  from: notDeployerJettonWallet.address,
  to: deployer.address,
});
/*
transfer_notification#7362d09c query_id:uint64 amount:(VarUInteger 16)
 sender:MsgAddress forward_payload:(Either Cell ^Cell)
 = InternalMsgBody;
*/
expect(sendResult.transactions).toHaveTransaction({
  // notification
  from: notDeployerJettonWallet.address,
  to: notDeployer.address,
  value: forwardAmount,
  body: beginCell()
    .storeUint(Op.transfer_notification, 32)
    .storeUint(0, 64) // default queryId
    .storeCoins(sentAmount)
    .storeAddress(deployer.address)
    .storeUint(1, 1)
    .storeRef(forwardPayload)
    .endCell(),
});
const transferTx = findTransactionRequired(sendResult.transactions, {
  on: deployerJettonWallet.address,
  from: deployer.address,
  op: Op.transfer,
  success: true,
});

let computedGeneric: (transaction: Transaction) => TransactionComputeVm;
computedGeneric = (transaction) => {
  if (transaction.description.type !== "generic")
    throw "Expected generic transactionaction";
  if (transaction.description.computePhase.type !== "vm")
    throw "Compute phase expected";
  return transaction.description.computePhase;
};

let printTxGasStats: (name: string, trans: Transaction) => bigint;
printTxGasStats = (name, transaction) => {
  const txComputed = computedGeneric(transaction);
  console.log(`${name} used ${txComputed.gasUsed} gas`);
  console.log(`${name} gas cost: ${txComputed.gasFees}`);
  return txComputed.gasFees;
};

send_gas_fee = printTxGasStats("Jetton transfer", transferTx);
```

## Forward fee

### Overview

The forward fee is charged for outgoing messages.

Generally, there are three scenarios for forward fee processing:

1. The message structure is deterministic, and you can predict the fee.
2. The message structure depends heavily on the incoming message structure.
3. You cannot predict the outgoing message structure at all.

### Calculation flow

If the message structure is deterministic, use the `GETFORWARDFEE` opcode with the following parameters:

| Param name | Description                                             |
| :--------- | :------------------------------------------------------ |
| cells      | Number of cells                                         |
| bits       | Number of bits                                          |
| is_mc      | True if the source or destination is in the MasterChain |

:::info Only unique hash cells are counted for storage and forward fees. For example, three identical hash cells are counted as one.

This mechanism deduplicates data: if multiple equivalent sub-cells are referenced across different branches, their content is stored only once.

[Read more about deduplication](/v3/documentation/data-formats/tlb/library-cells).
:::

However, if the outgoing message depends significantly on the incoming structure, you may not be able to predict the fee fully. In such cases, try using the `GETORIGINALFWDFEE` opcode with the following parameters:

| Param name | Description                                             |
| :--------- | :------------------------------------------------------ |
| fwd_fee    | Parsed from the incoming message                        |
| is_mc      | True if the source or destination is in the MasterChain |

:::caution Be careful with `SENDMSG` opcode
Next opcode, `SENDMSG`, **is the least optimal way** to calculate fee, but **better than not checking**.

It uses an **unpredictable amount** of gas.

Do not use it unless necessary.
:::

If even `GETORIGINALFWDFEE` cannot be used, one more option exists. Use the `SENDMSG` opcode with the following parameters:

| Param name | Description     |
| :--------- | :-------------- |
| cells      | Number of cells |
| mode       | Message mode    |

Modes affect the fee calculation as follows:

- `+1024` do not create action, only estimate fee. Other modes will send a message in action phase.
- `+128` substitutes the value of the entire balance of the contract before the start of the computation phase (slightly inaccurate, since gas expenses that cannot be estimated before the completion of the computation phase are not taken into account).
- `+64` substitutes the entire balance of the incoming message as an outcoming value (slightly inaccurate, gas expenses that cannot be estimated before the computation is completed are not taken into account).
- Other modes can be found [on message modes page](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes).

It creates an output action and returns the fee for creating a message. However, it uses an unpredictable amount of gas, which cannot be calculated using formulas. To measure gas usage, use `GASCONSUMED`:

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
