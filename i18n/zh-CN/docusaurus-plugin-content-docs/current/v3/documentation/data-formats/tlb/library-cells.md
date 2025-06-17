import Feedback from '@site/src/components/Feedback';

# Library Cells

## Introduction

One of the native features of how TON stores data in cells is **deduplication:** duplicate cells are stored only once in storage, messages, blocks, transactions, and other elements. This significantly reduces the size of serialized data and enables efficient storage of incrementally updated data.

As a result, many data structures in TON are rich in information and optimized for performance. For example, the block structure may contain the same message in multiple places—such as in the message queue, the list of transactions, and Merkle updates. Since duplication carries no overhead, data can be stored redundantly wherever it is needed without impacting efficiency.

Library cells extend this deduplication mechanism on-chain, enabling the incorporation of the same efficiency into custom smart contracts.

:::info
For instance, If you store the `jetton-wallet` code as a library cell (1 cell with 256 + 8 bits, instead of ~20 cells and ~6000 bits), the forwarding fees for a message that includes `init_code` can be reduced from 0.011 TON to 0.003 TON.
:::

## 一般信息

Let's consider a BaseChain step from block 1'000'000 to block 1'000'001. While each block contains small data (typically fewer than 1,000 transactions), the entire BaseChain state includes millions of accounts. Since the blockchain must maintain data integrity—particularly by committing the Merkle root hash of the entire state into the block—the entire state tree must be updated.

In earlier-generation blockchains, this typically means tracking only the most recent states, as storing separate full states for each block would consume excessive space. However, thanks to deduplication, only new cells are added to storage for each block in the TON blockchain. This accelerates processing and enables efficient historical queries—such as checking balances, inspecting contract states, or running `get` methods at any point in the blockchain's history—with minimal overhead.

In scenarios involving families of similar contracts, e.g., `jetton-wallets`, the node stores duplicated data—such as identical contract codes—only once. Library cells leverage this deduplication mechanism, reducing storage costs and forwarding fees for such contracts.

:::info 高级类比
You can think of a library cell as a C++ pointer: a small cell that references a larger one, which may include many references. The referenced cell must exist and be registered publicly, i.e., _"published"_.
:::

## Library Cell的结构

library cell 是 [exotic cell](/v3/documentation/data-formats/tlb/exotic-cells)，包含对其他静态 cell 的引用。特别是，它包含引用 cell 的 256 位哈希值。

**Behavior in TVM**
In the TON Virtual Machine (TVM), library cells operate as follows:

对于 TVM 而言，library cell 的工作原理如下：每当 TVM 接收到打开 cell 到片段的命令时（TVM 指令：`CTOS`，funcC 方法：`.begin_parse()`），它就会从 Masterchain 库上下文中的 library cell 中搜索具有相应哈希值的 cell 。如果找到，则打开引用的 cell 并返回其 slice 。 If so, the TVM searches for a cell that matches the stored hash in the MasterChain library context. If the referenced cell is found, the TVM opens it and returns its slice.

打开 library cell 的费用与打开普通 cell 的费用相同，因此它可以作为静态 cell 的透明替代品，但占用的空间要小得多（因此存储和发送费用也较低）。 Therefore, library cells serve as a transparent, space-efficient substitute for static cells, reducing storage and forwarding fees.

然后，您需要创建引用普通 cell 的 library cell 。library cell 包含 library 的 8 位标签 `0x02` 和 256 位引用 cell 哈希值。

It is possible to create a library cell that references another library cell, which in turn references another, and so on. However, attempting to parse such nested structures directly using `.begin_parse()` will raise an exception. Instead, nested library references can be unwrapped step-by-step using the `XLOAD` opcode.

**Immutability**

Another key characteristic of library cells is immutability. library cell 的另一个重要特性是，由于它包含被引用 cell 的哈希值，因此最终是对某些静态数据的引用。您不能更改该 library cell 所引用的数据。 Once a library cell is created, it cannot be updated to point to a different Cell.

您可以将 library cell  视为 C++ 指针：一个小 cell 指向具有（可能）多个引用的大 cell 。被引用的 cell （library cell 指向的 cell ）应该存在并在公共上下文中注册（_"已发布"_）。

To be usable within the MasterChain library context—i.e., to be found and loaded by a library cell—a source cell must be published. This is done by storing the cell within a MasterChain smart contract using the `public=true` flag. The opcode used for this is `SETLIBCODE`.

## 在智能合约中使用

Since a library cell behaves identically to an ordinary cell, it is referenced in all contexts except fee calculation; it can seamlessly replace any static cell in your smart contracts.

**Example**

让我们来看看将 jetton-wallet 代码存储为 library cell 以减少费用的例子。首先，我们需要将 jetton-wallet 编译成包含其代码的普通 cell 。 Usually, the code occupies around 20 Cells (~6000 bits). However, when stored as a library cell, it fits into a single cell with 256 + 8 bits, significantly reducing storage usage and forwarding fees.
In particular, the forwarding fee for an `internal_transfer` message containing `init_code` drops from 0.011 TON to 0.003 TON—an order-of-magnitude reduction.

### 在 library cell 中存储数据

Let's walk through the process using the `jetton-wallet` code as an example.

1. First, compile the contract, e.g., jetton-wallet, into a standard cell that contains its code.
2. Next, create a library cell referencing the code by inserting:
  - an 8-bit tag `0x02` indicating it's a library cell,
  - the 256-bit hash of the compiled code cell.

### 在 Fift 中使用

You can manually create a library cell in Fift by writing its tag and hash to a builder and closing it as an exotic cell.

它可以在 Fift-asm 结构中完成，如 [this](https://github.com/ton-blockchain/multisig-contract-v2/blob/master/contracts/auto/order_code.func), 将一些合约直接编译到 library cell   [here](https://github.com/ton-blockchain/multisig-contract-v2/blob/master/wrappers/Order.compile.ts) 的例子。

```fift
;; https://docs.ton.org/tvm.pdf, page 30
;; Library reference cell — Always has level 0, and contains 8+256 data bits, including its 8-bit type integer 2 
;; and the representation hash Hash(c) of the library cell being referred to. When loaded, a library
;; reference cell may be transparently replaced by the cell it refers to, if found in the current library context.

cell order_code() asm "<b 2 8 u, 0x6305a8061c856c2ccf05dcb0df5815c71475870567cab5f049e340bcf59251f3 256 u, b>spec PUSHREF";
```

### 在 @ton/ton 中使用

或者，您可以在 Blueprint 中完全通过 TypeScript 层级使用 `@ton/ton` 库构建 Library Cell ： Here’s how to do it in a Blueprint project:

```ts
import { Cell, beginCell } from '@ton/core';

let lib_prep = beginCell().storeUint(2,8).storeBuffer(jwallet_code_raw.hash()).endCell();
jwallet_code = new Cell({ exotic:true, bits: lib_prep.bits, refs:lib_prep.refs});
```

- 了解资料来源 [此处](https://github.com/ton-blockchain/stablecoin-contract/blob/de08b905214eb253d27009db6a124fd1feadbf72/sandbox_tests/JettonWallet.spec.ts#L104C1-L105C90)。

### 在主链库上下文中发布普通 cell

实际示例 [此处](https://github.com/ton-blockchain/multisig-contract-v2/blob/master/contracts/helper/librarian.func)。该合约的核心是 `set_lib_code(lib_too_publish, 2);` - 它接受需要发布的普通 cell 作为输入，并接受 flag=2（表示每个人都可以使用）。

The core of this contract is the line: `set_lib_code(lib_to_publish, 2);`. This function call publishes an ordinary cell with the flag set to `2`, which indicates that the library is public and can be used by anyone.

**Note:** the contract that publishes the cell is responsible for paying its and MasterChain's storage fees. Storage costs in the MasterChain are approximately 1000 times higher than in the BaseChain. 请注意，发布 cell 的合约在主链中的存储费用是在基链中的 1000 倍。因此，只有成千上万用户使用的合约才能有效使用  library cell。

### 在 Blueprint 中测试

要测试使用 library cell 的合约如何在 blueprint 中运行，需要手动将引用的 cell 添加到 blueprint 模拟器的库上下文中。具体方法如下 This can be done as follows:

1. 您需要创建库上下文字典（Hashmap）"uint256->Cell"，其中 "uint256 "是相应 Cell 的哈希值。
2. 将库上下文安装到模拟器设置中。

示例 [此处](https://github.com/ton-blockchain/stablecoin-contract/blob/de08b905214eb253d27009db6a124fd1feadbf72/sandbox_tests/JettonWallet.spec.ts#L100C9-L103C32)。

:::info
请注意，当前的 blueprint 版本（`@ton/blueprint:0.19.0`）不会自动更新库上下文，如果在仿真过程中某些合约发布了新库，则需要手动更新。
这是 04.2024 版的实际问题，估计不久的将来会得到改进。 You must update it manually.
This behavior is current as of April 2024 and is expected to be improved in a future release.
:::

### 获取 library cell 合约的方法

您在 library cell 中存储了 jetton-wallet 及其代码，并希望检查余额。 To do so, you must execute a get method in the code. This involves the following steps:

- 访问 library cell
- 检索引用 cell 的哈希值
- 在主链的库集合中找到有该哈希值的 cell
- 从这里开始执行代码。

在分层解决方案（LS）中，所有这些过程都在幕后进行，用户无需了解具体的代码存储方法。

However, the process differs when working locally. 但是，在本地工作时，情况就不同了。例如，如果您使用资源管理器或钱包，您可能会获取账户状态并尝试确定其类型--是 NFT、钱包、代币还是拍卖。

You can review regular contracts' available get methods, the contract interface, to understand how they work. Alternatively, you may "steal" the account state to your local pseudonet and execute methods there.

This approach is not feasible for a library cell because it does not store data on its own. Instead, you must manually detect and retrieve the necessary cells from the context. This can be done using LS, though bindings do not yet support this, or via DTon.

#### 使用 Liteserver 检索 library cell

When running get methods with liteserver, the correct library context is automatically set. Liteserver 在运行 get 方法时会自动设置正确的库上下文。如果想通过获取方法检测合约类型或在本地运行获取方法，则需要通过 LS 方法 [liteServer.getLibraries](https://github.com/ton-blockchain/ton/blob/4cfe1d1a96acf956e28e2bbc696a143489e23631/tl/generate/scheme/lite_api.tl#L96) 下载相应的 cell 。

#### 使用 DTon 检索 library cell

您也可以从 [dton.io/graphql](https://dton.io/graphql) 获取库：

```
{
  get_lib(
    lib_hash: "<HASH>"
  )
}
```

以及特定主链区块的库列表：

```
{
  blocks{
    libs_publishers
    libs_hash
  }
}
```

## 另请参见

- [外来 cell ](/v3/documentation/data-formats/tlb/exotic-cells)
- [TVM Instructions](/v3/documentation/tvm/instructions)

<Feedback />

