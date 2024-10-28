# Transaction Fees

Every TON user should keep in mind that _commission depends on many factors_.

## Gas

All [computation costs](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#computation-fees) are nominated in gas units and fixed in a certain gas amount.

The price of gas units is determined by the [chain configuration](https://tonviewer.com/config#20) and may be changed only by consensus of validators. Note that unlike in other systems, the user cannot set his own gas price, and there is no fee market.

Current settings in basechain are as follows: 1 unit of gas costs 400 nanotons.

```cpp
1 gas = 26214400 / 2^16 nanotons = 0,000 000 4 TON
```

Current settings in masterchain are as follows: 1 unit of gas costs 10000 nanotons.

```cpp
1 gas = 655360000 / 2^16 nanotons = 0,000 01 TON
```

### Average transaction cost

> **TLDR:** Today, every transaction costs around **~0.005 TON**

Even if TON price increases 100 times, transactions will remain ultra-cheap; less than $0.01. Moreover, validators may lower this value if they see commissions have become expensive [read why they're interested](#gas-changing-voting-process).

:::info
The current gas amount is written in the Network Config [param 20](https://tonviewer.com/config#20) and [param 21](https://tonviewer.com/config#21) for masterchain and basechain respectively.
:::

### Gas changing voting process

The gas fee, like many other parameters of TON, is configurable and may be changed by a special vote made in the mainnet.

Changing any parameter requires getting 66% of the validator votes.

#### Could gas cost more?

> *Does it mean that one day gas prices could rise by 1,000 times or even more?*

Technically, yes; but in fact, no.

Validators receive a small fee for processing transactions, and charging higher commissions would lead to a decrease in the number of transactions, making the validating process less beneficial.

### How are fees calculated?

Fees on TON are difficult to calculate in advance, as their amount depends on transaction run time, account status, message content and size, blockchain network settings, and a number of other variables that cannot be calculated until the transaction is sent.

That is why even NFT marketplaces usually take an extra amount of TON (_~1 TON_) and return (_`1 - transaction_fee`_) later.

:::info
Each contract should check incoming messages for the amount of TON attached to ensure it is enough to cover the fees.

Check the [low-level fees overview](/v3/documentation/smart-contracts/transaction-fees/fees-low-level) to learn more about the formulas for calculating commissions and [fees calculation](/v3/guidelines/smart-contracts/fee-calculation) to learn how to calculate fees in FunC contracts using the new TVM opcodes.
:::

However, let's read more about how fees are supposed to function on TON.

## Basic Fees Formula

Fees on TON are calculated by this formula:

```cpp
transaction_fee = storage_fees
                + in_fwd_fees
                + computation_fees
                + action_fees
                + out_fwd_fees
```

## Elements of transaction fee

* `storage_fees` is the amount you pay for storing a smart contract in the blockchain. In fact, you pay for every second the smart contract is stored on the blockchain.
  * _Example_: your TON wallet is also a smart contract, and it pays a storage fee every time you receive or send a transaction. Read more about [how storage fees are calculated](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#storage-fee).
* `in_fwd_fees` is a charge for importing messages only from outside the blockchain, e.g. `external` messages. Every time you make a transaction, it must be delivered to the validators who will process it. For ordinary messages from contract to contract this fee is not applicable. Read [the TON Blockchain paper](https://docs.ton.org/tblkch.pdf) to learn more about inbound messages.
  * _Example_: each transaction you make with your wallet app (like Tonkeeper) requires first to be distributed among validation nodes.
* `computation_fees` is the amount you pay for executing code in the virtual machine. The larger the code, the more fees must be paid.
  * _Example_: each time you send a transaction with your wallet (which is a smart contract), you execute the code of your wallet contract and pay for it.
* `action_fees` is a charge for sending outgoing messages made by a smart contract, updating the smart contract code, updating the libraries, etc.
* `out_fwd_fees` stands for a charge for sending messages outside the TON Blockchain to interact with off-chain services (e.g., logs) and external blockchains.

## FAQ

Here are the most frequently asked questions by visitors of TON:

### Fees for sending TON?

The average fee for sending any amount of TON is 0.0055 TON.

### Fees for sending Jettons?

The average fee for sending any amount of a custom Jettons is 0.037 TON.

### Cost of minting NFTs?

The average fee for minting one NFT is 0.08 TON.

### Cost of saving data in TON?

Saving 1 MB of data for one year on TON will cost 6.01 TON. Note that you usually don’t need to store large amounts of data on-chain. Consider using [TON Storage](/v3/guidelines/web3/ton-storage/storage-daemon) if you need decentralized storage.

### Is it possible to send a gasless transaction?

At present, this opportunity is not available. We are actively working on its development. Please stay tuned for updates.

### How to calculation?

There is an article about [fee calculation](/v3/guidelines/smart-contracts/fee-calculation) in TON Blockchain.

## References

* Based on the [@thedailyton article](https://telegra.ph/Commissions-on-TON-07-22) originally written by [menschee](https://github.com/menschee)*

## See Also

* ["Low-level fees overview"](/v3/documentation/smart-contracts/transaction-fees/fees-low-level)—read about the formulas for calculating commissions.
* [Smart contract function to calculate forward fees in FunC](https://github.com/ton-blockchain/token-contract/blob/main/misc/forward-fee-calc.fc)
