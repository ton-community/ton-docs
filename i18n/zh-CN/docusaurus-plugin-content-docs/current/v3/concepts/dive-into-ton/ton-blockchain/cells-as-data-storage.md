import Feedback from '@site/src/components/Feedback';

import ConceptImage from '@site/src/components/conceptImage';
import ThemedImage from '@theme/ThemedImage';

# 以 Cell 为数据存储

In TON, a **cell** is a built material for the entire blockchain. TON 中的所有内容都存储在cell( cell )中。一个cell是一个数据结构，包含：

- up to **1023 bits** of data
- 高达 **4 个引用** 到其他cell
- cell stores bits and references separately
- cell forbids circular references: for any cell, none of its descendant cells can reference this original cell.

因此，所有cell构成一个有向无环图（DAG）。这里有一个很好的图片来说明： Here's a good picture to illustrate:

<br></br>
<ThemedImage
alt=""
sources={{
light: '/img/docs/cells-as-data-storage/dag.png?raw=true',
dark: '/img/docs/cells-as-data-storage/Cells-as-data-storage_1_dark.png?raw=true',
}}
/> <br></br>

## Cell 类型

目前，有 5 种类型的cell：_普通_ 和 4 种 _另类_。另类类型包括以下内容：
The exotic types are the following:

- 裁剪分支cell
- 库引用cell
- Merkle 证明cell
- Merkle 更新cell

:::tip
了解更多有关特殊cell的信息，请参见：[**TVM 白皮书，第 3 节**](https://ton.org/tvm.pdf)。
:::

## Cell flavors

cell是一种为紧凑存储而优化的不透明对象。

It deduplicates data: it only stores the content of several equivalent sub-cells referenced in different branches once. However, one cannot modify or read a cell directly because of its opacity. Thus, there are two additional flavors of the cells:

- _Builder_ 用于部分构建的cell，可以为其定义用于追加位串、整数、其他cell和引用其他cell的快速操作。
- **Slice** for a flavor for reading cells

另一种在 TVM 中使用的特殊cell风格：

- _Continuation_ 用于包含 TON 虚拟机的操作码（指令）的cell，请参阅[TVM 概览](/learn/tvm-instructions/tvm-overview)。

## 将数据序列化为 Cell

TON 中的任何对象（消息、消息队列、区块、整个区块链状态、合约代码和数据）都可以序列化为cell。

序列化的过程由 TL-B 方案描述：这是一个正式描述如何将此对象序列化为 _Builder_ 或如何从 _Slice_ 解析给定类型对象的方案。对于cell的 TL-B 与字节流的 TL 或 ProtoBuf 相同。
TL-B for cells is the same as TL or ProtoBuf for byte-streams.

如果您想了解有关cell（反）序列化的更多详细信息，可以阅读[ cell (Cell)和 cell 包(Bag of Cells)](/develop/data-formats/cell-boc)文章。

## 参阅

- [Blockchain of blockchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains)
- [TL-B 语言](/develop/data-formats/tl-b-language)

<Feedback />

