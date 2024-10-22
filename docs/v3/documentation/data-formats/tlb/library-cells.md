# Library Cells

## Introduction 
One of the native feature of how TON stores data in Cells is deduplication: in storage, messages, blocks, transactions and so on duplicate cells are stored only once. This tremendously decrease size of serialized data, and allows efficient storage of step-wise updated data.

For the same reason many structures in TON are simultaneously rich, convenient and efficient: block structure contains the same copy of each message in many places: in Message queue, in list of Transaction, in Merkle updates and so on: since duplication has no overhead we can store data multiple times where we need it without warring about efficiency.

Library cells employ a deduplication mechanism on-chain, allowing the integration of this technology into custom smart contracts.
:::info
If you store jetton-wallet code as library cell (1 cell and 256+8 bits, instead of ~20 cells and 6000 bits) for instance, forward fees for a message that contains `init_code` will be decreased from 0.011 to 0.003 TON.
:::

## General Info

Lets consider basechain step from block 1'000'000 to block 1'000'001. While each block contains small amount of data (usually less than 1000 transactions), the whole Basechain state contains millions of accounts and since blockchain need to keep integrity of the data (in particular to commit merkle root hash of whole state to the block) whole tree of the state need to be updated. 

For the blockchains of previous generations this means that generally you keep track of only recent states because storing separate chain states for each block will require too much space. But in TON Blockchain due to deduplication, for each block you only add to storage new cells. This not only make processing faster but also allows you to efficiently work with history: check balances, states and even run get methods for any point in history without much overhead!

For the case when we have a family of similar contracts (for instance jetton-wallets), node stores duplicating data (the same code of each jetton-wallet) only once. Library Cells allows to utilize deduplication mechanism for such contracts to decrease storage and forward fees. 

:::info Highlevel analogy
You can consider library cell as C++ pointer: one small cell that points to larger Cell with (possibly) many refs. The referenced cell (cell to which library cell points) should exist and registered in public context (_"published"_).
:::

## Structure of Library Cells

Library cell is [exotic cell](/v3/documentation/data-formats/tlb/exotic-cells) that contains a reference to some other static cell. In particular it contains 256 bit of hash of referenced cell. 

For TVM, library cells works as follows: whenever TVM receives a command to open a cell to a slice (TVM Instruction: `CTOS`, funC method: `.begin_parse()`), it searches cell with the corresponding hash from library cell in the Masterchain library context. If found it, it opens referenced cell and returns its slice. 

Opening library cell costs the same as opening ordinary cell, so it can be used as transparent replacement for static cells that however occupy much less space (and thus costs less fees for storage and sending).

Note that it is possible to create a library cell that references another library cell, which in turn references another, and so on. For such case `.begin_parse()` will raise exception. Such library however can be unwrapped step-wise with `XLOAD` opcode.

Another important peculiarities of Library Cell is that since it contains hash of referenced cell it is ultimately reference to some static data. You can not change data to which this library cell is referenced.

To be found in the Masterchain library context and thus referenced by a Library Cell, a source Cell needs to be published in the Masterchain.  This means that a smart contract existing in the Masterchain needs to add this cell to its state with the `public=true` flag. This can be accomplished using the `SETLIBCODE` opcode. 

## Using in Smart Contracts

Since library cell behaves the same way as ordinary cell it referenced to in all contexts except fee calculation you can just use it instead of any cell with static data. For instance, you can store jetton-wallet code as library cell (so 1 cell and 256+8 bits, instead of usually ~20 cells and 6000 bits) which will result is order magnitude less storage and forward fees. In particular, forward fees for `internal_transfer` message that contains `init_code` will be decreased from 0.011 to 0.003 TON.

### Store Data in the Library Cell
Lets consider example of storing jetton-wallet code as library cell to decrease fees. First we need to compile jetton-wallet to ordinary cell that contains it's code.

Than you need to create library cell with reference to ordinary cell. Library cell contains 8-bit tag of library `0x02` followed by 256-bit of referenced cell hash.

### Using in Fift
Basically you need to put tag and hash to the builder and then "close builder as exotic cell".

It can be done in Fift-asm construction like [this](https://github.com/ton-blockchain/multisig-contract-v2/blob/master/contracts/auto/order_code.func), example of compilation some contract directly to library cell [here](https://github.com/ton-blockchain/multisig-contract-v2/blob/master/wrappers/Order.compile.ts).

```fift
;; https://docs.ton.org/tvm.pdf, page 30
;; Library reference cell — Always has level 0, and contains 8+256 data bits, including its 8-bit type integer 2 
;; and the representation hash Hash(c) of the library cell being referred to. When loaded, a library
;; reference cell may be transparently replaced by the cell it refers to, if found in the current library context.

cell order_code() asm "<b 2 8 u, 0x6305a8061c856c2ccf05dcb0df5815c71475870567cab5f049e340bcf59251f3 256 u, b>spec PUSHREF";
```
### Using in @ton/ton
Alternatively, you can form Library Cell entirely on ts-level in Blueprint with the `@ton/ton` library:  

```ts
import { Cell, beginCell } from '@ton/core';

let lib_prep = beginCell().storeUint(2,8).storeBuffer(jwallet_code_raw.hash()).endCell();
jwallet_code = new Cell({ exotic:true, bits: lib_prep.bits, refs:lib_prep.refs});
```

* Learn source [here](https://github.com/ton-blockchain/stablecoin-contract/blob/de08b905214eb253d27009db6a124fd1feadbf72/sandbox_tests/JettonWallet.spec.ts#L104C1-L105C90).

### Publish ordinary cell in masterchain library context
Practical example is available [here](https://github.com/ton-blockchain/multisig-contract-v2/blob/master/contracts/helper/librarian.func). The core of this contract is `set_lib_code(lib_to_publish, 2);` - it accepts as input ordinary cell that need to be published and flag=2 (means that everybody can use it).

Note, that contract that publish cell pays for it's storage and storage in masterchain 1000x higher than in basechain. So library cell usage is only efficient for contracts used by thousands users.

### Testing in the Blueprint

To test how contract that use Library Cells work in blueprint you need to manually add referenced cells to library context of blueprint emulator. It can be done this way:
1) you need to create library context dictionary (Hashmap) `uint256->Cell` where `uint256` is hash of the corresponding Cell.
2) install library context to the emulator settings.

Example how it can be done is shown [here](https://github.com/ton-blockchain/stablecoin-contract/blob/de08b905214eb253d27009db6a124fd1feadbf72/sandbox_tests/JettonWallet.spec.ts#L100C9-L103C32).

:::info
Note, that current blueprint version (`@ton/blueprint:0.19.0`) doesn't automatically update library context if some contract during emulation publish new library, you need do it manually.
Actual for 04.2024 and suppose to be enhanced in the near future.
:::

### Get Methods for Library Cell Based Contracts

You have jetton-wallet with its code stored in a library cell and desire to check balance. 

To check its balance, you need to execute a get method in the code. This involves:
- accessing the library cell
- retrieving the hash of the referenced cell
- finding the cell with that hash in the masterchain's library collection
- executing the code from there. 

In Layered Solutions (LS), all these processes happen behind the scenes without the user needing to know about the specific code storage method.

However, when working locally, things are different. For example, if you use an explorer or wallet, you may take an account state and try to determine its type—whether it's an NFT, wallet, token, or auction. 

For regular contracts, you can look at the available get methods, i.e., the interface, to understand it. Or, you may "steal" an account state to my local pseudonet and execute methods there. 

For the a library cell, this isn't possible because it doesn't contain data on its own. You must manually detect and retrieve the necessary cells from the context. This can be done through LS (though bindings do not yet support this) or via DTon.


#### Retrieving Library Cell with Liteserver
Liteserver when running get methods automatically set correct library context. If you want to detect type of contract by get methods or run getmethods locally you need to download corresponding cells via LS method [liteServer.getLibraries](https://github.com/ton-blockchain/ton/blob/4cfe1d1a96acf956e28e2bbc696a143489e23631/tl/generate/scheme/lite_api.tl#L96).

#### Retrieving Library Cell with DTon
You can also get library from [dton.io/graphql](https://dton.io/graphql):
```
{
  get_lib(
    lib_hash: "<HASH>"
  )
}
```
as well as list of libraries for specific masterchain block:
```
{
  blocks{
    libs_publishers
    libs_hash
  }
}
```

## See Also

* [Exotic Cells](/v3/documentation/data-formats/tlb/exotic-cells) 
* [TVM Instructions](/v3/documentation/tvm/instructions)


