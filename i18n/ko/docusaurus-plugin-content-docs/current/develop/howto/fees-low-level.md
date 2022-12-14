# Low Level Fees Overview

:::caution advanced level
This information is **very low level** and could be hard to understand for newcomers.  
So feel free to read about it later.
:::

This document provides general idea of transaction fees in TON and particularly computation fees for funC code. There is also the [detailed specification in TVM whitepaper](https://ton.org/tvm.pdf).

# Transactions and phases

As was described in [TVM overview](/learn/tvm-instructions/tvm-overview) transaction execution consist of a few phases. During those phases corresponding fees may be deducted.

Generally:
```cpp
transaction_fee = storage_fees
                + in_fwd_fees
                + computation_fees 
                + action_fees 
                + out_fwd_fees
```
where:
   * `storage_fees` - fees corresponding to occupation of some space in chain state by contract
   * `in_fwd_fees` - fees for importing to blockchain incoming message (it is only relevant for messages which were not previously onchain, that is `external` messages. For ordinary messages from contract to contract this fee is not applicable).
   * `computation_fees` - fees corresponding to execution of TVM instructions
   * `action_fees` - fees related to processing of action list (sending messages, setting libraries etc)
   * `out_fwd_fees` - fees related to importing to blockchain of outcoming message

## Computation fees

### Gas
All computation costs are nominated in gas units. Price of gas units is determined by this chain config (Config 20 for masterchain and Config 21 for basechain) and may be changed only by consensus of validator. Note, unlike in other systems, user can not set his own gas price and there is no fee market.

Current settings in basechain are as follows: 1 gas unit costs 1000 of nanoTONs.

## TVM instructions cost
On the lowest-level (TVM instruction execution) the gas price for most primitives
equals the _basic gas price_, computed as `P_b := 10 + b + 5r`,
where `b` is the instruction length in bits and `r` is the
number of cell references included in the instruction.

Apart from that basic fees, the following fees appear:
   * Price of "parsing" cells (i.e., transforming cells into slices). Equal to 100 gas units for cells which is loading for the first time and 25 for subsequent loads during the same tx.
   * Price of cells "creation" (i.e. transforming builders to cells). Equal to 500 gas units.
   * Price of throwing exception - 50 gas units
   * Price of tuple operations - 1 gas unit for every tuple element
   * Price for implicit jumps - 10 gas units. It is price paid when all instructions in current continuation-cell are executed however there are references in that continuation cell and execution flow jumps to the first reference.
   * Price for implicit back jumps - 5 gas units. It is price paid when all instructions in current continuation are executed and execution flow jumps back to the continuation from which just finished continuation was called.
   * Price for moving stack elements between continuations. 1 gas unit per element, however first 32 elements moving is free.

## FunC constructions gas fees

Almost all functions used in funC are defined in [stdlib.func](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc) which maps funC functions to Fift assembler instructions. In turn Fift assembler instructions are mapped to bit-sequence instructions in [asm.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/fift/lib/Asm.fif). So if you want to understand how much exactly instruction call will cost you, you need to find `asm` representation in `stdlib.func`, then find bit-sequence in `asm.fif` and calculate instruction length in bits.

However, generally fees related to bit-lengths are minor in comparisson with fees related to cell parsing and creation, as well as jumps and just number of executed instructions.

So, if you try to optimize your code start with architecture optimization, the decreasing number of cell parsing/creation operations, then with decreasing number of jumps.

### Operations with cells
Just example of how proper cell work may substantially decrease gas costs.

Lets imagine that you want to write some encoded payload to the outgoing message. Straightforward implementation will be as follows:
```cpp
slice payload_encoding(int a, int b, int c) {
  return
    begin_cell().store_uint(a,8)
                .store_uint(b,8)
                .store_uint(c,8)
    end_cell().begin_parse();
}

() send_message(slice destination) impure {
  slice payload = payload_encoding(1, 7, 12);
  var msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(destination)
    .store_coins(0)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; some flags related to message header
    .store_uint(0x33bbff77, 32) ;; op-code (see smart-contract guidelines)
    .store_uint(cur_lt(), 64)  ;; query_id (see smart-contract guidelines)
    .store_slice(payload)
  .end_cell();
  send_raw_message(msg, 64);
}
```

What is the problem with this code? `payload_encoding` to generate slice bit-string first create cell via `end_cell()` (+500 gas units) and then additionally parse it `begin_parse()` (+100 gas units). The same code can be written without those unnecessary operations by changing some used types:

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
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; some flags related to message header
    .store_uint(0x33bbff77, 32) ;; op-code (see smart-contract guidelines)
    .store_uint(cur_lt(), 64)  ;; query_id (see smart-contract guidelines)
    .store_builder(payload)
  .end_cell();
  send_raw_message(msg, 64);
}
```
By passing bit-string in the another form (builder instead of slice) we substantially decrease computation cost by very slight change in code.

### Inline and inline_refs
By default, when you have funC function, it gets it's own `id`, stored in separate leaf of id->function dictionary and when you call it somewhere in program, searching of function in dictionary and subsequent jump occur. Such behavior is justified if your function is used from many places in the code and thus jumps allows to decrease size of the code (by storing function body one time). However if function is only used one or two times it is often much cheaper to declare this function as `inline` or `inline_ref`. `inline` modificator place body of the function right into the code of the parent function, while `inline_ref` place function code into the reference (still jump to the reference is much cheaper than searching and jumping to dictionary entry).

### Dictionaries
Dictionaries in the TON are introduced as trees (DAGs to be precise) of cells. That means that if you search, read or write to dictionary, you need to parse all cells of according branch of the tree. That means that
   * a) dicts operations are not fixed in gas costs (since size and number of nodes in the branch depends on given dictionary and given key)
   * b) it is expedient to optimize dict usage by using special instructions like `replace` instead of `delete` and `add`
   * c) developer should be aware of iteration operations (like next and prev) as well `min_key`/`max_key` operations to avoid unneccessary iteration through whole dict

### Stack operations
Note that funC manipulate stack entries under the hood. That means that code
```cpp
(int a, int b, int c) = some_f();
return (c, b, a);
```
will be translated to a few instructions which change the order of elements on the stack.

When number of stack entries are substantial (10+) and their are actively used in different order stack operations fees may become non-negligible.

## Fee's calculation Formulas

### storage_fees
```cpp
storage_fees = ceil(
                    (account.bits * bit_price
                    + account.cells * cell_price)
               * period / 2 ^ 16)
```
### in_fwd_fees, out_fwd_fees

```cpp
msg_fwd_fees = (lump_price
             + ceil(
                (bit_price * msg.bits + cell_price * msg.cells) / 2^16)
             )
             
ihr_fwd_fees = ceil((msg_fwd_fees * ihr_price_factor) / 2^16)
```
// bits in the root cell of a message are not included in msg.bits (lump_price pays for them)

### action_fees
```cpp
action_fees = sum(out_ext_msg_fwd_fee) + sum(int_msg_mine_fee)
```

### Config file

All fees are nominated in a certain gas amount and may be changed: The config file represents the current fee's cost.

* storage_fees = [p18](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05#configparam18)
* in_fwd_fees = [p24](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05#configparam24), [p25](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05#configparam25)
* computation_fees = [p20](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05#configparam20), [p21](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05#configparam21)
* action_fees = [p24](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05#configparam24), [p25](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05#configparam25)
* out_fwd_fees = [p24](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05#configparam24), [p25](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05#configparam25)

:::info
[A direct link to the mainnet config file](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05)
:::

*Based on @thedailyton [article](https://telegra.ph/Fees-calculation-on-the-TON-Blockchain-07-24) from 24.07*