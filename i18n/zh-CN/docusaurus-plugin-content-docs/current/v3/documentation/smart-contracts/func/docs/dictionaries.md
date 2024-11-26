# TON 字典

智能合约可以使用字典--有序的键值映射。它们在内部由 cell 树表示。

:::warning
Working with potentially large trees of cells creates a couple of considerations:

1. 每次更新操作都会构建相当数量的 cell （每个构建的 cell 需要消耗 500 gas，详情请查看 [TVM 说明](/v3/documentation/tvm/instructions#gas-prices) 页面），这意味着如果不小心使用，这些操作可能会耗尽 gas。
   - 特别是，钱包机器人在使用 highload-v2 钱包时遇到过一次这样的问题。无限制循环加上每次迭代时昂贵的字典更新导致 gas 耗尽，最终导致重复交易，如 [fd78228f352f582a544ab7ad7eb716610668b23b88dae48e4f4dbd4404b5d7f6](https://tonviewer.com/transaction/fd78228f352f582a544ab7ad7eb716610668b23b88dae48e4f4dbd4404b5d7f6)，耗尽了余额。
2. N 个键值对的二叉树包含 N-1 个分叉，因此总共至少有 2N-1 个 cell 。智能合约的存储空间仅限于 65536 个唯一 cell ，因此字典中的最大条目数为 32768，如果有重复 cell ，条目数会稍多一些。
   :::

## 词典种类

### "Hash"map

显而易见，TON 中最著名、使用最多的字典是 hashmap。它有一整节的 TVM 操作码（[TVM Instructions](/v3/documentation/tvm/instructions#quick-search) - Dictionary Manipulation），通常用于智能合约。

这些字典是同长度键（所述长度作为参数提供给所有函数）与值片段的映射。与名称中的 "散列 "不同，字典中的条目是有序的，可以通过键、上一个或下一个键值对方便地提取元素。值与内部节点标记以及可能的关键部分放置在同一 cell 中，因此不能使用全部 1023 位；`~udict_set_ref` 通常用于这种情况。

空 hashmap 在 TVM 中表示为 "空"，因此不是 cell 。要在 cell 中存储字典，首先要保存一个比特（空为 0，否则为 1），然后在 hashmap 不为空的情况下添加引用。因此，`store_maybe_ref` 和 `store_dict` 是可以互换的，一些智能合约作者使用 `load_dict` 从传入的消息或存储中加载 `Maybe ^Cell`。

hashmaps的可能操作

- 从 slice 加载，存储到构建器
- 按key 获取/设置/删除 value
- 替换值（如果键已存在，则设置新值）/添加一个值（如果键未存在）
- 按键的顺序移动到下一个/上一个键值对（如果不考虑 gas 限制，可用于[遍历字典](/v3/documentation/smart-contracts/func/cookbook#how-to-iterate-dictionaries)
- 检索最小/最大键及其值
- 按 键 获取函数（延续）并立即执行

为了使合约不会因 gas 超限而中断，在处理一个事务时，只能进行有限次数的字典更新。如果合约的余额被用于根据开发者的条件维护地图，合约可以向自己发送继续清理的消息。

:::info
有检索子字典的说明：给定键范围内条目子集。这些指令尚未经过测试，因此只能以 TVM 汇编形式查看：`SUBDICTGET` 和类似的指令。
:::

#### Hashmap 示例

让我们看看 Hashmap 是什么样的，特别是 257 位整数键与空值片段的映射（这样的映射只表示元素的存在或不存在）。

快速检查的方法是在 Python 中运行以下脚本（可酌情用其他 SDK 替换 `pytoniq`）：

```python
import pytoniq
k = pytoniq.HashMap(257)
em = pytoniq.begin_cell().to_slice()
k.set(5, em)
k.set(7, em)
k.set(5 - 2**256, em)
k.set(6 - 2**256, em)
print(str(pytoniq.begin_cell().store_maybe_ref(k.serialize()).end_cell()))
```

该结构是二叉树，如果我们忽略根 cell ，它甚至是一棵平衡的树。

```
1[80] -> {
	2[00] -> {
		265[9FC00000000000000000000000000000000000000000000000000000000000000080] -> {
			4[50],
			4[50]
		},
		266[9FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF40] -> {
			2[00],
			2[00]
		}
	}
}
```

文档中有 [更多关于 hashmap 解析的示例](/v3/documentation/data-formats/tlb/tl-b-types#hashmap-parsing-example)。

### 增强地图（每个节点都有附加数据）

TON 验证器内部使用这些映射来计算分块中所有合约的总余额（使用每个节点的总子树余额映射可以让它们快速验证更新）。目前还没有 TVM 原语来处理这些映射。

### 前缀字典

:::info
测试表明，创建前缀字典的文档不足。除非完全了解相关操作码 `PFXDICTSET` 和类似代码的工作原理，否则不应在生产合约中使用它们。
:::
