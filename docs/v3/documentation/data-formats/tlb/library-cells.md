import Feedback from '@site/src/components/Feedback';

# Library cells

## Introduction 
One of the native features of how TON stores data in cells is **deduplication:** duplicate cells are stored only once in storage, messages, blocks, transactions, and other elements. This significantly reduces the size of serialized data and enables efficient storage of incrementally updated data.

As a result, many data structures in TON are rich in information and optimized for performance. For example, the block structure may contain the same message in multiple places—such as in the message queue, the list of transactions, and Merkle updates. Since duplication carries no overhead, data can be stored redundantly wherever it is needed without impacting efficiency.

Library cells extend this deduplication mechanism on-chain, enabling the incorporation of the same efficiency into custom smart contracts.

:::info
For instance, If you store the `jetton-wallet` code as a library cell (1 cell with 256 + 8 bits, instead of ~20 cells and ~6000 bits), the forwarding fees for a message that includes `init_code` can be reduced from 0.011 TON to 0.003 TON.
:::


## General info

Let's consider a BaseChain step from block 1'000'000 to block 1'000'001. While each block contains small data (typically fewer than 1,000 transactions), the entire BaseChain state includes millions of accounts. Since the blockchain must maintain data integrity—particularly by committing the Merkle root hash of the entire state into the block—the entire state tree must be updated.

In earlier-generation blockchains, this typically means tracking only the most recent states, as storing separate full states for each block would consume excessive space. However, thanks to deduplication, only new cells are added to storage for each block in the TON blockchain. This accelerates processing and enables efficient historical queries—such as checking balances, inspecting contract states, or running `get` methods at any point in the blockchain's history—with minimal overhead.

In scenarios involving families of similar contracts, e.g., `jetton-wallets`, the node stores duplicated data—such as identical contract codes—only once. Library cells leverage this deduplication mechanism, reducing storage costs and forwarding fees for such contracts.


:::info Highlevel analogy
You can think of a library cell as a C++ pointer: a small cell that references a larger one, which may include many references. The referenced cell must exist and be registered publicly, i.e., _"published"_.
:::

## Library cells structure

A library cell is an [exotic cell](/v3/documentation/data-formats/tlb/exotic-cells) that references another static cell by storing its 256-bit hash.


**Behavior in TVM**
In the TON Virtual Machine (TVM), library cells operate as follows:

When the TVM is instructed to convert a cell into a slice via the `CTOS` instruction or the FunC method `.begin_parse()`, it checks whether the cell is a library cell. If so, the TVM searches for a cell that matches the stored hash in the MasterChain library context. If the referenced cell is found, the TVM opens it and returns its slice.

Opening a library cell incurs the exact computational cost of opening an ordinary cell. Therefore, library cells serve as a transparent, space-efficient substitute for static cells, reducing storage and forwarding fees.

**Nested library cells**

It is possible to create a library cell that references another library cell, which in turn references another, and so on. However, attempting to parse such nested structures directly using `.begin_parse()` will raise an exception. Instead, nested library references can be unwrapped step-by-step using the `XLOAD` opcode.

**Immutability**

Another key characteristic of library cells is immutability. Since the cell stores only the hash of the referenced cell, it refers to static, unchangeable data. Once a library cell is created, it cannot be updated to point to a different Cell.


**Publishing a library cell**

To be usable within the MasterChain library context—i.e., to be found and loaded by a library cell—a source cell must be published. This is done by storing the cell within a MasterChain smart contract using the `public=true` flag. The opcode used for this is `SETLIBCODE`.

## Using library cells in smart contracts

Since a library cell behaves identically to an ordinary cell, it is referenced in all contexts except fee calculation; it can seamlessly replace any static cell in your smart contracts. 

**Example**

For instance, you can store the code of a `jetton-wallet` as a library cell. Usually, the code occupies around 20 Cells (~6000 bits). However, when stored as a library cell, it fits into a single cell with 256 + 8 bits, significantly reducing storage usage and forwarding fees.
In particular, the forwarding fee for an `internal_transfer` message containing `init_code` drops from 0.011 TON to 0.003 TON—an order-of-magnitude reduction.

### Store data in a library cell

Let's walk through the process using the `jetton-wallet` code as an example.

1. First, compile the contract, e.g., jetton-wallet, into a standard cell that contains its code.
2. Next, create a library cell referencing the code by inserting:
   - an 8-bit tag `0x02` indicating it's a library cell,
   - the 256-bit hash of the compiled code cell.


### Using in Fift


You can manually create a library cell in Fift by writing its tag and hash to a builder and closing it as an exotic cell. 

It can be done in Fift-asm construction like [this](https://github.com/ton-blockchain/multisig-contract-v2/blob/master/contracts/auto/order_code.func), example of compilation some contract directly to library cell [here](https://github.com/ton-blockchain/multisig-contract-v2/blob/master/wrappers/Order.compile.ts).

```fift
;; https://docs.ton.org/tvm.pdf, page 30
;; Library reference cell — always has level 0 and contains 8+256 data bits, including its 8-bit type integer 2.  
;; The representation hash Hash(c) of the library cell being referred to. When loaded, a library.
;; If found in the current library context, the reference cell may be transparently replaced by the cell it refers to.

cell order_code() asm "<b 2 8 u, 0x6305a8061c856c2ccf05dcb0df5815c71475870567cab5f049e340bcf59251f3 256 u, b>spec PUSHREF";
```
### Using in @ton/ton
You can construct a library cell entirely in TypeScript using the `@ton/ton` library without Fift. Here’s how to do it in a Blueprint project:

```ts
import { Cell, beginCell } from '@ton/core';

let lib_prep = beginCell().storeUint(2,8).storeBuffer(jwallet_code_raw.hash()).endCell();
jwallet_code = new Cell({ exotic:true, bits: lib_prep.bits, refs:lib_prep.refs});
```

* [View source](https://github.com/ton-blockchain/stablecoin-contract/blob/de08b905214eb253d27009db6a124fd1feadbf72/sandbox_tests/JettonWallet.spec.ts#L104C1-L105C90)

### Publish ordinary cell in masterchain library context
A practical example is available [here](https://github.com/ton-blockchain/multisig-contract-v2/blob/master/contracts/helper/librarian.func). 

The core of this contract is the line: `set_lib_code(lib_to_publish, 2);`. This function call publishes an ordinary cell with the flag set to `2`, which indicates that the library is public and can be used by anyone.


**Note:** the contract that publishes the cell is responsible for paying its and MasterChain's storage fees. Storage costs in the MasterChain are approximately 1000 times higher than in the BaseChain. Therefore, using a library cell is only cost-effective for contracts that thousands of users utilize.

### Testing in the Blueprint

To test how contracts that use library cells work in Blueprint, manually add the referenced cells to the emulator’s library context. This can be done as follows:
1. Create a library context dictionary (a Hashmap) of type `uint256 -> Cell`, where `uint256` is the hash of the corresponding cell. 
2. Set this library context in the emulator’s settings.

An example implementation can be found [here](https://github.com/ton-blockchain/stablecoin-contract/blob/de08b905214eb253d27009db6a124fd1feadbf72/sandbox_tests/JettonWallet.spec.ts#L100C9-L103C32).

:::info
As of version `@ton/blueprint:0.19.0`, Blueprint does not automatically update the library context if a contract publishes a new library during emulation. You must update it manually.
This behavior is current as of April 2024 and is expected to be improved in a future release.
:::

### Get methods for library cell-based contracts



When working with a jetton wallet, where the code is stored in a library cell, you may need to check its balance. To do so, you must execute a get method in the code. This involves the following steps:
* Accessing the library cell 
* Retrieving the hash of the referenced cell 
* Finding the cell with that hash in the MasterChain's library collection 
* Executing the code from there


In Layered Solutions (LS), all these processes happen automatically behind the scenes, and users needn’t be concerned with the specific method of code storage.

However, the process differs when working locally. For example, when using an explorer or wallet, you might examine the account state to determine its type, such as whether it's an NFT, wallet, token, or auction.

You can review regular contracts' available get methods, the contract interface, to understand how they work. Alternatively, you may "steal" the account state to your local pseudonet and execute methods there.

This approach is not feasible for a library cell because it does not store data on its own. Instead, you must manually detect and retrieve the necessary cells from the context. This can be done using LS, though bindings do not yet support this, or via DTon.


#### Retrieving Library Cell with Liteserver
When running get methods with liteserver, the correct library context is automatically set. If you need to detect the contract type using get methods or run them locally, download the corresponding cells via the LS method [liteServer.getLibraries](https://github.com/ton-blockchain/ton/blob/4cfe1d1a96acf956e28e2bbc696a143489e23631/tl/generate/scheme/lite_api.tl#L96).

#### Retrieving Library Cell with DTon
You can also get the library from [dton.io/graphql](https://dton.io/graphql):
```
{
  get_lib(
    lib_hash: "<HASH>"
  )
}
```
as well as a list of libraries for specific MasterChain block:
```
{
  blocks{
    libs_publishers
    libs_hash
  }
}
```

## See also

* [Exotic cells](/v3/documentation/data-formats/tlb/exotic-cells) 
* [TVM instructions](/v3/documentation/tvm/instructions)



<Feedback />

