# Fees calculation

This document describes how to calculate fees to send enough TON coins with message.

## Storage fee

### Overview
:::info
You can find a `storage fee` explanation [here](/develop/howto/fees-low-level#storage-fee).
:::

Saying shortly, storage_fees is the amount you pay for storing a smart contract in the blockchain. In fact, you pay for every second the smart contract is stored on the blockchain.

Use `GETSTORAGEFEE` opcode with following params:

| Param name | Description                                         |
|:-----------|:----------------------------------------------------|
| cells      | Number of message cells                             |
| bits       | Number of message bits                              |
| is_mc      | True if the source or destination is in masterchain |

### Calculation flow

Each contract has its balance. You can calculate how much TONs your contract require to be valid for `seconds` time:
```func
int get_storage_fee(int workchain, int seconds, int bits, int cells) asm(cells bits seconds workchain) "GETSTORAGEFEE";
```

Then you should hardcode that value to the contract and calculate current storage fee using:

```func
int balance_after_fee = balance - get_storage_fee(workchain, seconds, bits, cells)
int 
```

## Gas Fee (computation cost)

Use `GETGASFEE` opcode to calculate computation cost.

```func
int get_compute_fee(int workchain, int gas_used) asm(gas_used workchain) "GETGASFEE";
```

| Param      | Description                                      |
|:-----------|:-------------------------------------------------|
| `gas_used` | gas amount, calculated in tests and hardcoded    |
| `is_mc`    | true if the source or destination is masterchain |

To calculate `gas_used` you should write test for your contract, that:
1. Make transfer.
2. Check if it's success and find that transfer.
3. Check actual amount of gas, used by that transfer for computation.

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
let customPayload  = beginCell().storeUint(0xfedcba0987654321n, 128).endCell();

// Let's use this case for fees calculation
// Put the forward payload into custom payload, to make sure maximum possible gas used during computation
const sendResult = await deployerJettonWallet.sendTransfer(deployer.getSender(), toNano('0.17'), //tons
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
expect(sendResult.transactions).toHaveTransaction({ //notification
    from: notDeployerJettonWallet.address,
    to: notDeployer.address,
    value: forwardAmount,
    body: beginCell().storeUint(Op.transfer_notification, 32).storeUint(0, 64) //default queryId
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

### Examples

