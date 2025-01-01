# Library Cells

## 导言

TON 在 cell 中存储数据的原生特性之一是重复数据删除：在存储过程中，信息、块、事务等重复的 cell 只存储一次。这大大减少了序列化数据的大小，并允许高效存储逐步更新的数据。

出于同样的原因，TON 中的许多结构都同时具有丰富、便捷和高效的特点：块结构在许多地方都包含了每条消息的相同副本：消息队列、事务列表、Merkle更新等：由于复制没有开销，我们可以在需要的地方多次存储数据，而不必担心效率问题。

Library cells 在链上采用重复数据删除机制，允许将该技术集成到自定义智能合约中。
:::info
如果将 jetton-wallet 代码存储为 library cell  （1 个 cell 和 256+8 位，而不是 ~20 个 cell 和 6000 位），例如，包含 `init_code` 的消息的转发费用将从 0.011 TON 降至 0.003 TON。
:::

## 一般信息

让我们考虑一下从区块 1'000'000 到区块 1'000'001 的基础链步骤。虽然每个区块包含少量数据（通常少于 1000 笔交易），但整个基础链状态包含数百万个账户，由于区块链需要保持数据的完整性（特别是将整个状态的 merkle 根散列提交到区块中），因此需要更新整个状态树。

对于前几代区块链来说，这意味着通常只需跟踪最近的状态，因为为每个区块存储单独的链状态需要太多空间。但在 TON 区块链中，由于采用了重复数据删除技术，您只需为每个区块添加新的存储 cell 。这不仅能加快处理速度，还能让您高效地处理历史记录：检查余额、状态，甚至在历史记录中的任意点运行获取方法，而无需太多开销！

当我们有一系列类似的合约（例如，jetton-wallet）时，节点只需存储一次重复数据（每个 jetton-wallet 的相同代码）。Library cell 允许利用重复数据删除机制来减少存储和转发费用。

:::info 高级类比
您可以将 library cell  视为 C++ 指针：一个小 cell 指向具有（可能）多个引用的大 cell 。被引用的 cell （library cell 指向的 cell ）应该存在并在公共上下文中注册（*"已发布"*）。
:::

## Library Cell的结构

library cell 是 [exotic cell](/v3/documentation/data-formats/tlb/exotic-cells)，包含对其他静态 cell 的引用。特别是，它包含引用 cell 的 256 位哈希值。

对于 TVM 而言，library cell 的工作原理如下：每当 TVM 接收到打开 cell 到片段的命令时（TVM 指令：`CTOS`，funcC 方法：`.begin_parse()`），它就会从 Masterchain 库上下文中的 library cell 中搜索具有相应哈希值的 cell 。如果找到，则打开引用的 cell 并返回其 slice 。

打开 library cell 的费用与打开普通 cell 的费用相同，因此它可以作为静态 cell 的透明替代品，但占用的空间要小得多（因此存储和发送费用也较低）。

请注意，创建的 library cell 有可能引用另一个 library cell ，而另一个 library cell 又引用另一个 library cell ，依此类推。在这种情况下，`.begin_parse()` 将引发异常。不过，可以使用 `XLOAD` 操作码逐步解包此类库。

library cell 的另一个重要特性是，由于它包含被引用 cell 的哈希值，因此最终是对某些静态数据的引用。您不能更改该 library cell 所引用的数据。

要在主链库上下文中找到 library cell ，并因此被 library cell 引用，源 cell 需要在主链中发布。  这意味着，存在于主链中的智能合约需要将该 cell 添加到其状态中，并标记 "public=true"。这可以使用 `SETLIBCODE` 操作码来实现。

## 在智能合约中使用

由于 library cell 在除费用计算之外的所有情况下都与普通 cell 具有相同的行为，因此您可以用它来代替任何具有静态数据的 cell 。例如，您可以将 jetton-wallet 代码存储为 library cell （因此是 1 个 cell 和 256+8 位，而不是通常的 ~20 个 cell 和 6000 位），这将大大减少存储和转发费用。特别是，包含 "init_code "的 "internal_transfer "信息的转发费将从 0.011 TON 降至 0.003 TON。

### 在 library cell 中存储数据

让我们来看看将 jetton-wallet 代码存储为 library cell 以减少费用的例子。首先，我们需要将 jetton-wallet 编译成包含其代码的普通 cell 。

然后，您需要创建引用普通 cell 的 library cell 。library cell 包含 library 的 8 位标签 `0x02` 和 256 位引用 cell 哈希值。

### 在 Fift 中使用

基本上，您需要在生成器中添加标记和哈希值，然后 "将生成器作为异域 cell 关闭"。

它可以在 Fift-asm 结构中完成，如 [this](https://github.com/ton-blockchain/multisig-contract-v2/blob/master/contracts/auto/order_code.func), 将一些合约直接编译到 library cell   [here](https://github.com/ton-blockchain/multisig-contract-v2/blob/master/wrappers/Order.compile.ts) 的例子。

```fift
;; https://docs.ton.org/tvm.pdf, page 30
;; Library reference cell — Always has level 0, and contains 8+256 data bits, including its 8-bit type integer 2 
;; and the representation hash Hash(c) of the library cell being referred to. When loaded, a library
;; reference cell may be transparently replaced by the cell it refers to, if found in the current library context.

cell order_code() asm "<b 2 8 u, 0x6305a8061c856c2ccf05dcb0df5815c71475870567cab5f049e340bcf59251f3 256 u, b>spec PUSHREF";
```

### 在 @ton/ton 中使用

或者，您可以在 Blueprint 中完全通过 TypeScript 层级使用 `@ton/ton` 库构建 Library Cell ：

```ts
import { Cell, beginCell } from '@ton/core';

let lib_prep = beginCell().storeUint(2,8).storeBuffer(jwallet_code_raw.hash()).endCell();
jwallet_code = new Cell({ exotic:true, bits: lib_prep.bits, refs:lib_prep.refs});
```

- 了解资料来源 [此处](https://github.com/ton-blockchain/stablecoin-contract/blob/de08b905214eb253d27009db6a124fd1feadbf72/sandbox_tests/JettonWallet.spec.ts#L104C1-L105C90)。

### 在主链库上下文中发布普通 cell

实际示例 [此处](https://github.com/ton-blockchain/multisig-contract-v2/blob/master/contracts/helper/librarian.func)。该合约的核心是 `set_lib_code(lib_too_publish, 2);` - 它接受需要发布的普通 cell 作为输入，并接受 flag=2（表示每个人都可以使用）。

请注意，发布 cell 的合约在主链中的存储费用是在基链中的 1000 倍。因此，只有成千上万用户使用的合约才能有效使用  library cell。

### 在 Blueprint 中测试

要测试使用 library cell 的合约如何在 blueprint 中运行，需要手动将引用的 cell 添加到 blueprint 模拟器的库上下文中。具体方法如下

1. 您需要创建库上下文字典（Hashmap）"uint256->Cell"，其中 "uint256 "是相应 Cell 的哈希值。
2. 将库上下文安装到模拟器设置中。

示例 [此处](https://github.com/ton-blockchain/stablecoin-contract/blob/de08b905214eb253d27009db6a124fd1feadbf72/sandbox_tests/JettonWallet.spec.ts#L100C9-L103C32)。

:::info
请注意，当前的 blueprint 版本（`@ton/blueprint:0.19.0`）不会自动更新库上下文，如果在仿真过程中某些合约发布了新库，则需要手动更新。
这是 04.2024 版的实际问题，估计不久的将来会得到改进。
:::

### 获取 library cell 合约的方法

您在 library cell 中存储了 jetton-wallet 及其代码，并希望检查余额。

要检查余额，需要执行代码中的 get 方法。这包括

- 访问 library cell
- 检索引用 cell 的哈希值
- 在主链的库集合中找到有该哈希值的 cell
- 从这里开始执行代码。

在分层解决方案（LS）中，所有这些过程都在幕后进行，用户无需了解具体的代码存储方法。

但是，在本地工作时，情况就不同了。例如，如果您使用资源管理器或钱包，您可能会获取账户状态并尝试确定其类型--是 NFT、钱包、代币还是拍卖。

对于普通合约，您可以查看可用的获取方法，即接口，以了解它。或者，你可以 "窃取 "一个账户状态到我的本地伪网，并在那里执行方法。

对于 library cell  ，这是不可能的，因为它本身不包含数据。您必须手动检测并从上下文中检索必要的 cell 。这可以通过 LS（尽管绑定还不支持）或 DTon 来实现。

#### 使用 Liteserver 检索 library cell

Liteserver 在运行 get 方法时会自动设置正确的库上下文。如果想通过获取方法检测合约类型或在本地运行获取方法，则需要通过 LS 方法 [liteServer.getLibraries](https://github.com/ton-blockchain/ton/blob/4cfe1d1a96acf956e28e2bbc696a143489e23631/tl/generate/scheme/lite_api.tl#L96) 下载相应的 cell 。

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
