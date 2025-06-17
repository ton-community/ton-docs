import Feedback from '@site/src/components/Feedback';

# TON 字典

智能合约可以使用字典--有序的键值映射。它们在内部由 cell 树表示。 Internally, these dictionaries are represented as tree-like structures composed of cells.

:::warning
Working with potentially large trees of cells creates a couple of considerations:

1. **Gas consumption for updates**

- 每次更新操作都会构建相当数量的 cell （每个构建的 cell 需要消耗 500 gas，详情请查看 [TVM 说明](/v3/documentation/tvm/instructions#gas-prices) 页面），这意味着如果不小心使用，这些操作可能会耗尽 gas。
- Careless updates can lead to excessive gas usage, potentially causing operations to fail due to gas exhaustion.
- Example: This issue occurred with the **Wallet bot** using the **highload-v2 wallet**. Each iteration's unbounded loop and expensive dictionary updates led to gas depletion. As a result, the bot triggered repeated transactions, eventually draining its balance ([see transaction details](https://tonviewer.com/transaction/fd78228f352f582a544ab7ad7eb716610668b23b88dae48e4f4dbd4404b5d7f6)).

2. **Storage limitation**

- A binary tree containing **N** key-value pairs requires **N-1 forks**, resulting in **at least 2N-1 cells**.
- Since smart contract storage in TON is capped at 65,536 unique cells, the maximum number of dictionary entries is approximately 32,768. This limit may be slightly higher if some cells are reused within the structure.

:::

## 词典种类

### "Hash"map

Hashmaps are the most widely used dictionary type in TON. 显而易见，TON 中最著名、使用最多的字典是 hashmap。它有一整节的 TVM 操作码（[TVM Instructions](/v3/documentation/tvm/instructions#quick-search) - Dictionary Manipulation），通常用于智能合约。

Hashmaps map fixed-length keys, which are defined as an argument to all functions, to value slices. Despite the "hash" in its name, entries are ordered and allow efficient access to elements by key and retrieval of the previous or next key-value pair. Since values share space with internal node tags and possibly key fragments within the same cell, they cannot utilize the full 1023 bits. In such cases, the `~udict_set_ref` function often helps.

空 hashmap 在 TVM 中表示为 "空"，因此不是 cell 。要在 cell 中存储字典，首先要保存一个比特（空为 0，否则为 1），然后在 hashmap 不为空的情况下添加引用。因此，`store_maybe_ref` 和 `store_dict` 是可以互换的，一些智能合约作者使用 `load_dict` 从传入的消息或存储中加载 `Maybe ^Cell`。 A single bit is first saved to store a dictionary in a cell (0 for empty, 1 otherwise),
followed by a reference if the hashmap is not empty. This makes `store_maybe_ref` and `store_dict` interchangeable. Some smart contract developers use `load_dict` to load a `Maybe ^Cell` from an incoming message or storage.

**Available hashmap operations:**

- 从 slice 加载，存储到构建器
- 按key 获取/设置/删除 value
- 替换值（如果键已存在，则设置新值）/添加一个值（如果键未存在）
- 按键的顺序移动到下一个/上一个键值对（如果不考虑 gas 限制，可用于[遍历字典](/v3/documentation/smart-contracts/func/cookbook#how-to-iterate-dictionaries)
- 检索最小/最大键及其值
- 按 键 获取函数（延续）并立即执行

To prevent gas exhaustion, smart contracts should limit the number of dictionary updates per transaction. If a contract's balance is used to maintain the hashmap under specific conditions, it can send itself a message to continue processing in another transaction.

:::info

TVM provides instructions for retrieving a subdictionary—a subset of entries within a given key range. These operations (`SUBDICTGET` and similar) are currently untested and can only be explored at the TVM assembly level.

:::

#### Hashmap 示例

让我们看看 Hashmap 是什么样的，特别是 257 位整数键与空值片段的映射（这样的映射只表示元素的存在或不存在）。 This type of hashmap serves as a presence indicator, storing only the existence of elements.

快速检查的方法是在 Python 中运行以下脚本（可酌情用其他 SDK 替换 `pytoniq`）： If needed, you can use a different SDK instead of `pytoniq`:

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

### Augmented maps

Augmented maps with additional data in each node are used internally by TON validators to calculate the total balance of all contracts in a shard. By storing the total subtree balance in each node, validators can quickly validate updates. There are no TVM primitives for working with these maps.

### 前缀字典

:::info
Testing shows that documentation on prefix dictionaries is insufficient. Avoid using them in production contracts unless you fully understand how the relevant opcodes, such as `PFXDICTSET`, work.
:::

<Feedback />

