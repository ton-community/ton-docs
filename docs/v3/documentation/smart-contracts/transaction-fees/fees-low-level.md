# Low-level fees overview

:::caution
This section describes instructions and manuals for interacting with TON at a low level.

Here you will find the **raw formulas** for calculating commissions and fees on TON.

However, most of them are **already implemented through opcodes**! So, you **use them instead of manual calculations**.
:::

This document provides a general idea of transaction fees on TON and particularly computation fees for the FunC code. There is also a [detailed specification in the TVM whitepaper](https://ton.org/tvm.pdf).

## Transactions and phases

As was described in the [TVM overview](/v3/documentation/tvm/tvm-overview), transaction execution consists of a few phases. During those phases, the corresponding fees may be deducted. There is a [high-level fees overview](/v3/documentation/smart-contracts/transaction-fees/fees).

## Storage fee

TON validators collect storage fees from smart contracts.

Storage fees are collected from the smart contract balance at the **Storage phase** of any transaction due storage payments for the account state
(including smart-contract code and data, if present) up to the present time. The smart contract may be frozen as a result.

It’s important to keep in mind that on TON you pay for both the execution of a smart contract and for the **used storage** (check [@thedailyton article](https://telegra.ph/Commissions-on-TON-07-22)). `storage fee` depends on you contract size: number of cells and sum of number of bits from that cells. **Only unique hash cells are counted for storage and fwd fees i.e. 3 identical hash cells are counted as one**. It means you have to pay a storage fee for having TON Wallet (even if it's very-very small).

If you have not used your TON Wallet for a significant period of time (1 year), _you will have to pay a significantly larger commission than usual because the wallet pays commission on sending and receiving transactions_.

### Formula

You can approximately calculate storage fees for smart contracts using this formula:

```cpp
  storage_fee = (cells_count * cell_price + bits_count * bit_price)
  * time_delta / 2^16 
```

Let's examine each value more closely:

* `storage_fee`—price for storage for `time_delta` seconds
* `cells_count`—count of cells used by smart contract
* `bits_count`—count of bits used by smart contract
* `cell_price`—price of single cell
* `bit_price`—price of single bit

Both `cell_price` and `bit_price` could be obtained from Network Config [param 18](/v3/documentation/network/configs/blockchain-configs#param-18).

Current values are:

* Workchain.
    ```cpp
    bit_price_ps:1
    cell_price_ps:500
    ```
* Masterchain.
    ```cpp
    mc_bit_price_ps:1000
    mc_cell_price_ps:500000
    ```

### Calculator Example

You can use this JS script to calculate storage price for 1 MB in the workchain for 1 year

```js live

// Welcome to LIVE editor!
// feel free to change any variables
// Source code uses RoundUp for the fee amount, so does the calculator

function storageFeeCalculator() {
  
  const size = 1024 * 1024 * 8        // 1MB in bits  
  const duration = 60 * 60 * 24 * 365 // 1 Year in secs

  const bit_price_ps = 1
  const cell_price_ps = 500

  const pricePerSec = size * bit_price_ps +
  + Math.ceil(size / 1023) * cell_price_ps

  let fee = Math.ceil(pricePerSec * duration / 2**16) * 10**-9
  let mb = (size / 1024 / 1024 / 8).toFixed(2)
  let days = Math.floor(duration / (3600 * 24))
  
  let str = `Storage Fee: ${fee} TON (${mb} MB for ${days} days)`
  
  return str
}


```

## Computation fees

### Gas

All computation costs are nominated in gas units. The price of gas units is determined by this [chain config](/v3/documentation/network/configs/blockchain-configs#param-20-and-21) (Config 20 for masterchain and Config 21 for basechain) and may be changed only by consensus of validators. Note that unlike in other systems, the user cannot set his own gas price, and there is no fee market.

Current settings in basechain are as follows: 1 unit of gas costs 400 nanotons.

### TVM instructions cost

On the lowest level (TVM instruction execution) the gas price for most primitives
equals the _basic gas price_, computed as `P_b := 10 + b + 5r`,
where `b` is the instruction length in bits and `r` is the
number of cell references included in the instruction.

Apart from those basic fees, the following fees appear:

| Instruction             | GAS  price   | Description                                                                                                                                                                                   | 
|-------------------------|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Creation of cell        | **500**      | Operation of transforming builder to cell.                                                                                                                                                    |
| Parsing cell firstly    | **100**      | Operation of transforming cells into slices first time during current transaction.                                                                                                            | 
| Parsing cell repeatedly | **25**       | Operation of transforming cells into slices, which already has parsed during same transaction.                                                                                                |
| Throwing exception      | **50**       |                                                                                                                                                                                               | 
| Operation with tuple    | **1**        | This price will multiply by the quantity of tuple's elements.                                                                                                                                 | 
| Implicit Jump           | **10**       | It is paid when all instructions in the current continuation cell are executed. However, there are references in that continuation cell, and the execution flow jumps to the first reference. | 
| Implicit Back Jump      | **5**        | It is paid when all instructions in the current continuation are executed and execution flow jumps back to the continuation from which the just finished continuation was called.             |                                                                                      
| Moving stack elements   | **1**        | Price for moving stack elements between continuations. It will charge correspond gas price for every element. However, the first 32 elements moving is free.                                  |                                                                                       


### FunC constructions gas fees

Almost all FunC functions used in this article are defined in [stablecoin stdlib.fc contract](https://github.com/ton-blockchain/stablecoin-contract) (actually, stdlib.fc with new opcodes is currently **under development** and **not yet presented on the mainnet repos**, but you can use `stdlib.fc` from [stablecoin](https://github.com/ton-blockchain/ton) source code as reference) which maps FunC functions to Fift assembler instructions. In turn, Fift assembler instructions are mapped to bit-sequence instructions in [asm.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/fift/lib/Asm.fif). So if you want to understand how much exactly the instruction call will cost you, you need to find `asm` representation in `stdlib.fc`, then find bit-sequence in `asm.fif` and calculate instruction length in bits.

However, generally, fees related to bit-lengths are minor in comparison with fees related to cell parsing and creation, as well as jumps and just number of executed instructions.

So, if you try to optimize your code start with architecture optimization, the decreasing number of cell parsing/creation operations, and then with the decreasing number of jumps.

### Operations with cells

Just an example of how proper cell work may substantially decrease gas costs.

Let's imagine that you want to add some encoded payload to the outgoing message. Straightforward implementation will be as follows:

```cpp
slice payload_encoding(int a, int b, int c) {
  return
    begin_cell().store_uint(a,8)
                .store_uint(b,8)
                .store_uint(c,8)
    .end_cell().begin_parse();
}

() send_message(slice destination) impure {
  slice payload = payload_encoding(1, 7, 12);
  var msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(destination)
    .store_coins(0)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
    .store_uint(0x33bbff77, 32) ;; op-code (see smart-contract guidelines)
    .store_uint(cur_lt(), 64)  ;; query_id (see smart-contract guidelines)
    .store_slice(payload)
  .end_cell();
  send_raw_message(msg, 64);
}
```

What is the problem with this code? `payload_encoding` to generate a slice bit-string, first create a cell via `end_cell()` (+500 gas units). Then parse it `begin_parse()` (+100 gas units). The same code can be written without those unnecessary operations by changing some commonly used types:

```cpp
;; we add asm for function which stores one builder to the another, which is absent from stdlib
builder store_builder(builder to, builder what) asm(what to) "STB";

builder payload_encoding(int a, int b, int c) {
  return
    begin_cell().store_uint(a,8)
                .store_uint(b,8)
                .store_uint(c,8);
}

() send_message(slice destination) impure {
  builder payload = payload_encoding(1, 7, 12);
  var msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(destination)
    .store_coins(0)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
    .store_uint(0x33bbff77, 32) ;; op-code (see smart-contract guidelines)
    .store_uint(cur_lt(), 64)  ;; query_id (see smart-contract guidelines)
    .store_builder(payload)
  .end_cell();
  send_raw_message(msg, 64);
}
```

By passing bit-string in the another form (builder instead of slice) we substantially decrease computation cost by very slight change in code.

### Inline and inline_refs

By default, when you have a FunC function, it gets its own `id`, stored in a separate leaf of id->function dictionary, and when you call it somewhere in the program, a search of the function in dictionary and subsequent jump occur. Such behavior is justified if your function is called from many places in the code and thus jumps allow to decrease the code size (by storing a function body once). However, if the function is only used once or twice, it is often much cheaper to declare this function as `inline` or `inline_ref`. `inline` modificator places the body of the function right into the code of the parent function, while `inline_ref` places the function code into the reference (jumping to the reference is still much cheaper than searching and jumping to the dictionary entry).

### Dictionaries

Dictionaries on TON are introduced as trees (DAGs to be precise) of cells. That means that if you search, read, or write to the dictionary, you need to parse all cells of the corresponding branch of the tree. That means that
   * a) dicts operations are not fixed in gas costs (since the size and number of nodes in the branch depend on the given dictionary and key)
   * b) it is expedient to optimize dict usage by using special instructions like `replace` instead of `delete` and `add`
   * c) developer should be aware of iteration operations (like next and prev) as well `min_key`/`max_key` operations to avoid unnecessary iteration through the whole dict

### Stack operations

Note that FunC manipulates stack entries under the hood. That means that the code:

```cpp
(int a, int b, int c) = some_f();
return (c, b, a);
```

will be translated into a few instructions which changes the order of elements on the stack.

When the number of stack entries is substantial (10+), and they are actively used in different orders, stack operations fees may become non-negligible.


## Forward fees

Internal messages define an `ihr_fee` in Toncoins, which is subtracted from the value attached to the message and awarded to the validators of the destination shardchain if they include the message through the IHR mechanism. The `fwd_fee` is the original total forwarding fee paid for using the HR mechanism; it is automatically computed from the [24 and 25 configuration parameters](/v3/documentation/network/configs/blockchain-configs#param-24-and-25) and the size of the message at the time the message is generated. Note that the total value carried by a newly created internal outbound message equals the sum of the value, `ihr_fee`, and `fwd_fee`. This sum is deducted from the balance of the source account. Of these components, only the value is always credited to the destination account upon message delivery. The `fwd_fee` is collected by the validators on the HR path from the source to the destination, and the `ihr_fee` is either collected by the validators of the destination shardchain (if the message is delivered via IHR) or credited to the destination account.

:::tip

At this moment (November 2024), [IHR](/v3/documentation/smart-contracts/shards/infinity-sharding-paradigm#messages-and-instant-hypercube-routing-instant-hypercube-routing) is not implemented, and if you set the `ihr_fee` to a non-zero value, it will always be added to the message value upon receipt. For now, there are no practical reasons to do this.

:::

```cpp
msg_fwd_fees = (lump_price
             + ceil(
                (bit_price * msg.bits + cell_price * msg.cells) / 2^16)
             );

ihr_fwd_fees = ceil((msg_fwd_fees * ihr_price_factor) / 2^16);

total_fwd_fees = msg_fwd_fees + ihr_fwd_fees; // ihr_fwd_fees - is 0 for external messages
```

## Action fee

The action fee is deducted from the balance of the source account during the processing of the action list, which occurs after the Computing phase. Practically, the only action for which you pay an action fee is `SENDRAWMSG`. Other actions, such as `RAWRESERVE` or `SETCODE`, do not incur any fee during the action phase.

```cpp
action_fee = floor((msg_fwd_fees * first_frac)/ 2^16);  //internal

action_fee = msg_fwd_fees;  //external
```

[`first_frac`](/v3/documentation/network/configs/blockchain-configs#param-24-and-25) is part of the 24 and 25 parameters (for master chain and work chain) of the TON Blockchain. Currently, both are set to a value of 21845, which means that the `action_fee` is approximately a third of the `msg_fwd_fees`. In the case of an external message action, `SENDRAWMSG`, the `action_fee` is equal to the `msg_fwd_fees`.

:::tip
Remember that an action register can contain up to 255 actions, which means that all formulas related to `fwd_fee` and `action_fee` will be computed for each `SENDRAWMSG` action, resulting in the following sum:

```cpp
total_fees = sum(action_fee) + sum(total_fwd_fees);
```
:::

Starting from the fourth [global version](https://github.com/ton-blockchain/ton/blob/master/doc/GlobalVersions.md) of TON, if a "send message" action fails, the account is required to pay for processing the cells of the message, referred to as the `action_fine`.

```cpp
fine_per_cell = floor((cell_price >> 16) / 4)

max_cells = floor(remaining_balance / fine_per_cell)

action_fine = fine_per_cell * min(max_cells, cells_in_msg);
```

## Fee's calculation formulas

### storage_fees

```cpp
storage_fees = ceil(
                    (account.bits * bit_price
                    + account.cells * cell_price)
               * period / 2 ^ 16)
```

:::info
Only unique hash cells are counted for storage and fwd fees i.e. 3 identical hash cells are counted as one.

In particular, it deduplicates data: if there are several equivalent sub-cells referenced in different branches, their content is only stored once.

Read more about [deduplication](/v3/documentation/data-formats/tlb/library-cells).
::: 

// bits in the root cell of a message are not included in msg.bits (lump_price pays for them)

## Fee's config file

All  fees are nominated in nanotons or nanotons multiplied by 2^16 to [maintain accuracy while using integer](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#forward-fees) and may be changed. The config file represents the current fee cost.

* storage_fees = [p18](https://tonviewer.com/config#18)
* in_fwd_fees = [p24](https://tonviewer.com/config#24), [p25](https://tonviewer.com/config#25)
* computation_fees = [p20](https://tonviewer.com/config#20), [p21](https://tonviewer.com/config#21)
* action_fees = [p24](https://tonviewer.com/config#24), [p25](https://tonviewer.com/config#25)
* out_fwd_fees = [p24](https://tonviewer.com/config#24), [p25](https://tonviewer.com/config#25)

:::info
[A direct link to the mainnet live config file](https://tonviewer.com/config)

For educational purposes [example of the old one](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05)
:::

## References

* Based on @thedailyton [article](https://telegra.ph/Fees-calculation-on-the-TON-Blockchain-07-24) from 24.07*

## See Also

* [TON Fees overview](/v3/documentation/smart-contracts/transaction-fees/fees)
* [Transactions and Phases](/v3/documentation/tvm/tvm-overview#transactions-and-phases)
* [Fees calculation](/v3/guidelines/smart-contracts/fee-calculation)