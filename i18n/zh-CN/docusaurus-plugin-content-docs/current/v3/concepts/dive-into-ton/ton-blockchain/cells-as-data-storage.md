import ConceptImage from '@site/src/components/conceptImage';
import ThemedImage from '@theme/ThemedImage';

# 以 Cell 为数据存储

TON 中的所有内容都存储在cell( cell )中。一个cell是一个数据结构，包含：

- 高达 **1023 位** 的数据（不是字节！）
- 高达 **4 个引用** 到其他cell

位和引用不是混合存储的（它们被分开存储）。禁止循环引用：对于任何cell，其后代cell都不能将此原始cell作为引用。

因此，所有cell构成一个有向无环图（DAG）。这里有一个很好的图片来说明：

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/docs/cells-as-data-storage/dag.png?raw=true',
        dark: '/img/docs/cells-as-data-storage/Cells-as-data-storage_1_dark.png?raw=true',
    }}
/>
<br></br>

## Cell 类型

目前，有 5 种类型的cell：*普通* 和 4 种 *另类*。另类类型包括以下内容：

- 裁剪分支cell
- 库引用cell
- Merkle 证明cell
- Merkle 更新cell

:::tip
了解更多有关特殊cell的信息，请参见：[**TVM 白皮书，第 3 节**](https://ton.org/tvm.pdf)。
:::

## Cell 风格

cell是一种为紧凑存储而优化的不透明对象。

特别是，它会去重数据：如果在不同分支中引用了多个等效的子cell，那它们的内容仅存储一次。然而，不透明性意味着无法直接修改或读取cell。因此，还有两种额外的cell风格：

- *Builder* 用于部分构建的cell，可以为其定义用于追加位串、整数、其他cell和引用其他cell的快速操作。
- *Slice* 用于“解剖”cell，表示部分解析的cell的剩余部分或驻留在其中的值（子cell），通过解析指令从中提取。

另一种在 TVM 中使用的特殊cell风格：

- *Continuation* 用于包含 TON 虚拟机的操作码（指令）的cell，请参阅[TVM 概览](/learn/tvm-instructions/tvm-overview)。

## 将数据序列化为 Cell

TON 中的任何对象（消息、消息队列、区块、整个区块链状态、合约代码和数据）都可以序列化为cell。

序列化的过程由 TL-B 方案描述：这是一个正式描述如何将此对象序列化为 *Builder* 或如何从 *Slice* 解析给定类型对象的方案。对于cell的 TL-B 与字节流的 TL 或 ProtoBuf 相同。

如果您想了解有关cell（反）序列化的更多详细信息，可以阅读[ cell (Cell)和 cell 包(Bag of Cells)](/develop/data-formats/cell-boc)文章。

## 参阅

- [TL-B 语言](/develop/data-formats/tl-b-language)
