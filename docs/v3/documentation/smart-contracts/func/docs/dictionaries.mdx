import Feedback from '@site/src/components/Feedback';

# Dictionaries in TON

Smart contracts in TON can utilize dictionaries structured as ordered key-value mappings. Internally, these dictionaries are represented as tree-like structures composed of cells.

:::warning
Handling potentially large trees of cells in TON introduces several important considerations:

1. **Gas consumption for updates**
- Every update operation generates many new cells, costing 500 gas, as detailed on the [TVM instructions](/v3/documentation/tvm/instructions#gas-prices) page. 
- Careless updates can lead to excessive gas usage, potentially causing operations to fail due to gas exhaustion.
- Example: This issue occurred with the **Wallet bot** using the **highload-v2 wallet**. Each iteration's unbounded loop and expensive dictionary updates led to gas depletion. As a result, the bot triggered repeated transactions, eventually draining its balance ([see transaction details](https://tonviewer.com/transaction/fd78228f352f582a544ab7ad7eb716610668b23b88dae48e4f4dbd4404b5d7f6)).


2. **Storage limitation**
- A binary tree containing **N** key-value pairs requires **N-1 forks**, resulting in **at least 2N-1 cells**. 
- Since smart contract storage in TON is capped at 65,536 unique cells, the maximum number of dictionary entries is approximately 32,768. This limit may be slightly higher if some cells are reused within the structure.

:::

## Dictionary kinds

### "Hash" map

Hashmaps are the most widely used dictionary type in TON. They have a dedicated set of TVM opcodes for manipulation and are commonly used in smart contracts (see [TVM instructions](/v3/documentation/tvm/instructions#quick-search) - Dictionary manipulation).


Hashmaps map fixed-length keys, which are defined as an argument to all functions, to value slices. Despite the "hash" in its name, entries are ordered and allow efficient access to elements by key and retrieval of the previous or next key-value pair. Since values share space with internal node tags and possibly key fragments within the same cell, they cannot utilize the full 1023 bits. In such cases, the `~udict_set_ref` function often helps.

An empty hashmap is represented as `null` in TVM, meaning it is not stored as a cell. A single bit is first saved to store a dictionary in a cell (0 for empty, 1 otherwise), 
followed by a reference if the hashmap is not empty. This makes `store_maybe_ref` and `store_dict` interchangeable. Some smart contract developers use `load_dict` to load a `Maybe ^Cell` from an incoming message or storage.


**Available hashmap operations:**
- Load from a slice, store to a builder;
- Get/Set/Delete a value by key;
- Replace a value (update an existing key) or add a new value (if the key is absent);
- Move to the next/previous key-value pair (entries are ordered by keys, enabling [iteration](/v3/documentation/smart-contracts/func/cookbook#how-to-iterate-dictionaries) if gas constraints allow);
- Retrieve the minimal or maximal key with its value;
- Fetch and execute a function (continuation) by key.

To prevent gas exhaustion, smart contracts should limit the number of dictionary updates per transaction. If a contract's balance is used to maintain the hashmap under specific conditions, it can send itself a message to continue processing in another transaction.


:::info

TVM provides instructions for retrieving a subdictionary—a subset of entries within a given key range. These operations (`SUBDICTGET` and similar) are currently untested and can only be explored at the TVM assembly level.

:::

#### Hashmap examples

To illustrate, let's examine a hashmap that maps 257-bit integer keys to empty value slices. This type of hashmap serves as a presence indicator, storing only the existence of elements.

You can quickly check this by running the following Python script. If needed, you can use a different SDK instead of `pytoniq`:


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

This structure forms a binary tree, which appears balanced except for the root cell:

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


For further [examples of hashmap parsing](/v3/documentation/data-formats/tlb/tl-b-types#hashmap-parsing-example), refer to the official documentation.

### Augmented maps 
Augmented maps with additional data in each node are used internally by TON validators to calculate the total balance of all contracts in a shard. By storing the total subtree balance in each node, validators can quickly validate updates. There are no TVM primitives for working with these maps.



### Prefix dictionary

:::info
Testing shows that documentation on prefix dictionaries is insufficient. Avoid using them in production contracts unless you fully understand how the relevant opcodes, such as `PFXDICTSET`, work.
:::

<Feedback />

