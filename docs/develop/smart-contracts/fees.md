# Transaction Fees

Every TON user should keep in mind that _commission depends on many factors_.

## Basic Formula

According to the docs, commissions on TON are calculated by this formula:

```cpp
transaction_fee = storage_fees
                + in_fwd_fees
                + computation_fees
                + action_fees
                + out_fwd_fees
```

## Elements of transaction fee

* `storage_fees` is an amount you pay for storing a smart-contract in the blockchain. In fact, you pay for every second the smart-contract is stored in the blockchain. Your TON wallet is also a smart-contract, and it charges the rent every time you receive or send a transaction.
* `in_fwd_fees` is a charge for importing messages from outside the blockchain. Every time you make a transaction it must be delivered to those validators who will process it. For example, each transaction you make with your wallet app (like Tonkeeper) requires first to be spread among validation nodes.
* `computation_fees` is an amount you pay for executing code in the virtual machine. The larger the code, the more fees must be paid. For example, each time you send any transaction with your wallet (which is a smart-contract) you execute the code of your wallet contract.
* `action_fees` is a charge for sending outgoing messages made by a smart-contract.
* `out_fwd_fees` – stand for a charge for sending messages outside the TON Blockchain to interact with off-chain services (e.g., logs) and external blockchains. Not used since not implemented.

## Gas calculation

All commissions are nominated and fixed in a certain gas amount, but the gas price itself is not fixed (currently, **1 gas unit costs 1000 nanoTONs**).

The gas fee, as many other parameters on TON, _is configurable_* and _may be changed by a special vote_ made in the mainnet. Changing any parameter requires getting two-thirds of the validator votes.

### Could gas cost more?

> *Does it mean that one day gas may become 1000 times higher or even more?*


Technically, yes, but in fact, no.

Validators receive a small fee for processing transactions, and making higher commissions will lead to a decrease in the number of transactions which will make the validating process less beneficial. That’s why there is no point in increasing the fees.

:::info
Commissions on TON are difficult to calculate in advance, as their amount depends on transaction run time, account status, message content and size, blockchain's network setting – and also on many variables that cannot be calculated until the transaction is sent.  That is why even NFT marketplaces usually take an extra amount of TON just in case and return it later.
:::

### Renting fee

It’s important to keep in mind that on TON you pay for both the execution of the smart-contract, and for the **used storage (bytes*second)**. It means you have to pay _the rent for having the TON wallet_ (usually it is very-very small).

However, if you have not used your TON wallet for a significant time, _you will have to pay a significantly larger commission than usual_.

The average number of TON transactions per second, according to tonmon.xyz, is currently 1.4, but fees, unlike on other blockchains, **will stay the same** if this value increases significantly.

**According to** [**the official TON website**](http://ton.org/), blockchain is capable of performing millions and, if it becomes necessary, tens of millions of transactions per second, thanks to sharding support.

### Average transaction cost

Today, every transaction costs about **0.005 TON**.

Even if TON’s price increases 100 times, _transactions will remain ultra-cheap_, less than $0.01. And do not forget that validators _may lower this value_ if they see commissions have become expensive.

The current gas amount is written in [the config file](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05#configparam20).

:::info DEEP DIVE
You can read more about the formulas for calculating commissions and their sizes [in the "Low Level Fees Overview" article](/develop/howto/fees_low_level#fees-calculation-formulas).
:::

*Based on [article from @thedailyton](https://telegra.ph/Commissions-on-TON-07-22), originally written by [menschee](https://github.com/menschee)*