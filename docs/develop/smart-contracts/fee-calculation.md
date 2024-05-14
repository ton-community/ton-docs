# Fees Calculation

:::caution
Read [theoretical `storage fee` explanation](/develop/howto/fees-low-level#storage-fee) before proceeding.
:::

When your contract starts processing an incoming message, you should check the amount of TONs attached to the message to ensure they are enough to cover the fees. To do this, you need to calculate (or predict) the fee for the current transaction.

This document describes how to calculate fees in FunC contracts using the new TVM opcodes.

:::info More information on opcodes
If you don't know what a FunC opcode is, check the [function doc page](/develop/func/functions).

For a comprehensive list of TVM opcodes, including those mentioned below, check the [TVM instruction page](/learn/tvm-instructions/instructions).
:::

:::info
All functions with the opcodes described below are presented in the [stdlib](/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc) library.
:::

## Storage Fee

### Overview

In brief, `storage fees` are the amounts you pay for storing a smart contract on the blockchain. You pay for every second the smart contract is stored on the blockchain.

Use the `GETSTORAGEFEE` opcode with the following parameters:

| Param name | Description                                         |
|:-----------|:----------------------------------------------------|
| cells      | Number of message cells                             |
| bits       | Number of message bits                              |
| is_mc      | True if the source or destination is in the masterchain |

### Calculation Flow

Each contract has its balance. You can calculate how many TONs your contract requires to remain valid for a specified `seconds` time using the function **presented in the [stdlib](/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc) library**:

```func
int get_storage_fee(int workchain, int seconds, int bits, int cells) asm(cells bits seconds workchain) "GETSTORAGEFEE";
```

You can then hardcode that value into the contract and calculate the current storage fee using:

```func
int calculate_storage_fee(int balance, int msg_value, int workchain, int seconds, int bits, int cells) inline {
    int balance_before_message = balance - msg_value;
    int storage_fee_for_whole_period = get_storage_fee(workchain, seconds, bits, cells);
    int storage_fee = storage_fee_for_whole_period - min(balance_before_message, storage_fee_for_whole_period);
}
```

This way, you can check if the contract has enough balance to be stored for the `seconds` time before the next message arrives.

## Gas Fee (Computation Cost)

### Overview

Generally, there are two cases of gas fee processing:
- **If it's impossible to predict gas usage** (similar to the third case of [forward fee calculation](/develop/smart-contracts/fee-calculation#forward-fee), which you should read if you want to use this opcode), there is the `GASCONSUMED` opcode. Use it with `SENDMSG` as described below in the forward fee calculation section. **Please, do not use `GASCONSUMED` unless necessary**.

- Otherwise (in most cases), use the `GETGASFEE` opcode with the following parameters:

  | Param      | Description                                      |
      |:-----------|:-------------------------------------------------|
  | `gas_used` | Gas amount, calculated in tests and hardcoded    |
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

let printTxGasStats: (name: string, trans: Transaction) => bigint;
printTxGasStats = (name, transaction) => {
    const txComputed = computedGeneric(transaction);
    console.log(`${name} used ${txComputed.gasUsed} gas`);
    console.log(`${name} gas cost: ${txComputed.gasFees}`);
    return txComputed.gasFees;
}

send_gas_fee = printTxGasStats("Jetton transfer", transferTx);
send_gas_fee = computeGasFee(gasPrices, 9255n);
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

| Param name | Description                                                                               |
|:-----------|:------------------------------------------------------------------------------------------|
| cells      | Number of cells, read more [here](/develop/howto/fees-low-level#in_fwd_fees-out_fwd_fees) |
| bits       | Number of bits, read more [here](/develop/howto/fees-low-level#in_fwd_fees-out_fwd_fees)  |
| is_mc      | True if the source or destination is in the masterchain                                   |

However, sometimes the outgoing message depends significantly on the incoming structure, and in that case, you can't fully predict the fee. Try to use the `GETORIGINALFWDFEE` opcode with the following parameters:

| Param name | Description                                         |
|:-----------|:----------------------------------------------------|
| fwd_fee    | Parsed from the incoming message                    |
| is_mc      | True if the source or destination is in the masterchain |

If even `GETORIGINALFWDFEE` can't be used, there is one more option. **It is the least optimal way but better than not checking**. Use the `SENDMSG` opcode with the following parameters:

| Param name | Description  |
|:-----------|:-------------|
| cells      | Number of cells |
| mode       | Message mode |

It creates an output action and returns a fee for creating a message.

## See Also
- [Stablecoin contract with fees calculation](https://github.com/ton-blockchain/stablecoin-contract)