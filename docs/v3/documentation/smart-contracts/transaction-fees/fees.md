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


```jsx live

// Welcome to LIVE editor!
// feel free to change any variables
// Check https://retracer.ton.org/?tx=b5e14a9c4a4e982fda42d6079c3f84fa48e76497a8f3fca872f9a3737f1f6262

function FeeCalculator() {
  // https://tonviewer.com/config#25
  const lump_price = 400000;
  const bit_price = 26214400;
  const cell_price = 2621440000;
  const ihr_price_factor = 98304;
  const first_frac = 21845;
  const nano = 10 ** -9;
  const bit16 = 2 ** 16;

  const ihr_disabled = 0; // First of all define is ihr gonna be counted

  let fwd_fee =
    (lump_price + Math.ceil((bit_price * 0 + cell_price * 0) / bit16)) * nano;

  if (ihr_disabled) {
    var ihr_fee = 0;
  } else {
    var ihr_fee = Math.ceil((fwd_fee * ihr_price_factor) / bit16) * nano;
  }

  let total_fwd_fees = fwd_fee + ihr_fee;
  let gas_fees = 0.0011976; // Gas fees out of scope here
  let storage_fees = 0.000000003; // And storage fees as well
  let total_action_fees = +((fwd_fee * first_frac) / bit16).toFixed(9);
  let import_fee =
    (lump_price + Math.ceil((bit_price * 528 + cell_price * 1) / bit16)) * nano;
  let total_fee = +(
    gas_fees +
    storage_fees +
    total_action_fees +
    import_fee
  ).toFixed(9);

  return (
    <div>
      <p> Total fee: {total_fee} TON</p>
      <p> Action fee: {total_action_fees} TON </p>
      <p> Fwd fee: {fwd_fee} TON </p>
      <p> Import fee: {import_fee} TON </p>
    </div>
  );
}

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

In TON, gasless transactions are possible using [wallet v5](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts#preparing-for-gasless-transactions) a relayer that pays the gas fee for transaction. 

### How to calculation?

There is an article about [fee calculation](/v3/guidelines/smart-contracts/fee-calculation) in TON Blockchain.

## References

* Based on the [@thedailyton article](https://telegra.ph/Commissions-on-TON-07-22) originally written by [menschee](https://github.com/menschee)*

## See Also

* ["Low-level fees overview"](/v3/documentation/smart-contracts/transaction-fees/fees-low-level)—read about the formulas for calculating commissions.
* [Smart contract function to calculate forward fees in FunC](https://github.com/ton-blockchain/token-contract/blob/main/misc/forward-fee-calc.fc)
