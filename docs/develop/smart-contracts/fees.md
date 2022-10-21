# Transaction Fees

Every TON user should keep in mind that _commission depends on many factors_.

## Gas

All fees are calculated in Gas. It's a special currency for fees in TON.

All fees are nominated and fixed in a certain gas amount, but the gas price itself is not fixed. Today the price for gas is:

```cpp
1 gas = 1000 nanoTON = 0,000 001 TON
```

### Average transaction cost

> **TLDR:** Today, every transaction costs about **~0.005 TON**

Even if TON’s price increases 100 times, transactions will remain ultra-cheap less than $0.01. Moreover, validators may lower this value if they see commissions have become expensive, [read why they're interested](#gas-changing-voting-process).

:::info
The current gas amount is written in the Network Config [param 20](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05#configparam20).
:::

### Gas changing voting process

The gas fee, as many other parameters on TON, is configurable and may be changed by a special vote made in the mainnet.

Changing any parameter requires getting 66% of the validator votes.

#### Could gas cost more?

> *Does it mean that one day gas may become 1000 times higher or even more?*

Technically, yes, but in fact, no.

Validators receive a small fee for processing transactions, and making higher commissions will lead to a decrease in the number of transactions which will make the validating process less beneficial.

### How to calculate fees?

Fees on TON are difficult to calculate in advance, as their amount depends on transaction run time, account status, message content and size, blockchain's network setting – and also on many variables that cannot be calculated until the transaction is sent. Read about [computation fees](https://www.tonspace.co/develop/howto/fees_low_level#computation-fees) in low-level article overview.

That is why even NFT marketplaces usually take an extra amount of TON (_~1 TON_) and return (_`1 - transaction_fee`_) later.

But let's read more how fees conceptually work in TON.

## Basic Fees Formula

According to the [low level fees overview](/develop/howto/fees_low_level), fees on TON are calculated by this formula:

```cpp
transaction_fee = storage_fees
                + in_fwd_fees
                + computation_fees
                + action_fees
                + out_fwd_fees
```

## Elements of transaction fee

* `storage_fees` is an amount you pay for storing a smart-contract in the blockchain. In fact, you pay for every second the smart-contract is stored in the blockchain.
  * _Example_: your TON wallet is also a smart-contract, and it pays storage fee every time you receive or send a transaction. Read more [how storage fees calculate](/develop/smart-contracts/fees#storage-fee).
* `in_fwd_fees` is a charge for importing messages from outside the blockchain. Every time you make a transaction it must be delivered to those validators who will process it.
  * _Example_: each transaction you make with your wallet app (like Tonkeeper) requires first to be spread among validation nodes.
* `computation_fees` is an amount you pay for executing code in the virtual machine. The larger the code, the more fees must be paid.
  * _Example_: each time you send any transaction with your wallet (which is a smart-contract) you execute the code of your wallet contract and pay for it.
* `action_fees` is a charge for sending outgoing messages made by a smart-contract.
* `out_fwd_fees` stand for a charge for sending messages outside the TON Blockchain to interact with off-chain services (e.g., logs) and external blockchains.
  * Not used since not been implemented. So today is equal to 0.

## Storage fee

In TON validators collect storage fees from smart contracts.

Storage fees are collected from smart-contract balance at **Storage phase** of any transaction. Read more about phases and how TVM works [here](/learn/tvm-instructions/tvm_overview#transactions-and-phases).

It’s important to keep in mind that on TON you pay for both the execution of the smart-contract, and for the **used storage**:

```cpp
bytes * second
```

It means you have to pay storage fee for having the TON wallet (even it's very-very small).

If you have not used your TON wallet for a significant time (1 year), _you will have to pay a significantly larger commission than usual, because wallet pays commission on sending and receiving transactions_.

### Formula

You can approximately calculate storage fees for smart contract using this formula:


```cpp
  storage_fee = (cells_count * cell_price + bits_count * bit_price)
  / 2^16 * time_delta
```

Let's go deeper to every value:

* `price` - price for storage for `time_delta` seconds
* `cells_count` - count of cells used by smart contract
* `bits_count` - count of bits used by smart contract
* `cell_price` - price of single cell
* `bit_price` - price of single bit

Both `cell_price` and `bit_price` could be obtained from Network Config [param 18](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05#configparam18).

Current values are:

* Workchain:
    ```cpp
    bit_price_ps:1
    cell_price_ps:500
    ```
* Masterchain:
    ```cpp
    mc_bit_price_ps:1000
    mc_cell_price_ps:500000
    ```

### Calculator Example

You can use this JS script to calculate storage price for 1MB in workchain for 1 year

```js live

// Welcome to LIVE editor!
// feel free to change any variables
  
function storageFeeCalculator() {
  
  const size = 1024 * 1024 * 8		    // 1MB in bits  
  const duration = 60 * 60 * 24 * 365	// 1 Year in secs

  const bit_price_ps = 1
  const cell_price_ps = 500

  const pricePerSec = size * bit_price_ps +
  + Math.round(bit_price_ps / 1023) * cell_price_ps

  let fee = (pricePerSec * duration / 2**16 * 10**-9)
  let mb = (size / 1024 / 1024 / 8).toFixed(2)
  let days = Math.floor(duration / (3600 * 24))
  
  let str = `Storage Fee: ${fee} TON (${mb} MB for ${days} days)`
  
  return str
}


```

## FAQ

Here are the most common question of every user who come to TON:

### Fees for sending 1-1000 TON?

TBD.

### Fees for sending 1-1000 Jettons?

TBD.

### Cost of minting 1-1000 NFTs?

TBD.

### Cost of saving data in TON?

TBD.

### How to calculate fees in FunC?

* [Smart Contract function to calculate forward fee in FunC](https://github.com/ton-blockchain/token-contract/blob/main/misc/forward-fee-calc.fc)

## References

* ["Low Level Fees Overview"](/develop/howto/fees_low_level#fees-calculation-formulas) — read about the formulas for calculating commissions.
* *Based on [article from @thedailyton](https://telegra.ph/Commissions-on-TON-07-22), originally written by [menschee](https://github.com/menschee)*