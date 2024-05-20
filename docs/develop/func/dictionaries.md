# Dictionaries in TON

Smart contracts can make use of dictionaries - ordered key-value mappings. They are represented by trees of cells internally.

:::warning
Working with potentially large trees of cells creates a couple of considerations:

1. Every update operation builds a notable amount of cells (and each built cell costs 500 gas, as may be found on [TVM Instructions](/learn/tvm-instructions/instructions#gas-prices) page), meaning that those operations may run out of gas if used without care.
    - In particular, Wallet bot has run into such a problem once, when using highload-v2 wallet. The failure led to repeated transactions like [fd78228f352f582a544ab7ad7eb716610668b23b88dae48e4f4dbd4404b5d7f6](https://tonviewer.com/transaction/fd78228f352f582a544ab7ad7eb716610668b23b88dae48e4f4dbd4404b5d7f6) draining its balance.
2. The binary tree for N key-value pairs contains N-1 forks, and thus at least 2N-1 cells in total. Smart contract storage is limited to 65536 cells, so maximum number of entries in dictionary is 32768.
:::

## Dictionary kinds

### "Hash"map

Evidently, the most known and used kind of dictionaries in TON is hashmap. It has a whole section worth of TVM opcodes ([TVM Instructions](/learn/tvm-instructions/instructions#quick-search) - Dictionary Manipulation) and is commonly used in smart contracts.

Those dictionaries are mappings of same-length keys (said length is provided as argument to all functions) to value slices. Contrary to "hash" in name, entries there are ordered and offer cheap extraction of element by key, previous or next key-value pair. Values are placed in the same cell as internal node tags and possibly key parts, so they can't use all 1023 bits; `~udict_set_ref` is commonly used in such a situation.

Empty hashmap is represented as `null` by TVM; thus, it is not a cell. To store dictionary in a cell, one first saves one bit (0 for empty, 1 otherwise), and then adds reference if hashmap is not empty. Thus, `store_maybe_ref` and `store_dict` are interchangeable, and some smart contract authors use `load_dict` to load a `Maybe ^Cell` from incoming message or storage.

Possible operations for hashmaps:
- load from slice, store to builder
- get/set/delete value by key
- replace value (set new value if key was already present) / add one (if key was not present)
- move to next/previous key-value pair, in order of keys (this can be used to [iterate over dictionaries](https://docs.ton.org/develop/func/cookbook#how-to-iterate-dictionaries) if gas limit is not a concern)
- retrieve minimal/maximal key with its value
- get function (continuation) by key and immediately execute it

In order for contract not to break of gas limit exceeding, only a limited number of dictionary updates should take place while processing one transaction. If contract's balance is used to maintain the map according to developer's conditions, the contract can send itself a message to continue cleanup.

:::info
There are instructions for retrieving a subdictionary: subset of entries within a given key range. Those have not been tested, so you can check them out only in TVM assembly form: `SUBDICTGET` and similar.
:::

### Augmented maps (with additional data in each node)

Those maps are used internally by TON validators in order to calculate total balance of all contracts in a shard (using maps with total subtree balance with each node allows them to validate updates very quickly). There are no TVM primitives for working with these.

### Prefix dictionary

:::info
Testing reveals that insufficient documentation is there to create prefix dictionaries. You shouldn't use them in production contracts unless you have the full knowledge how the relevant opcodes, `PFXDICTSET` and similar, work.
:::
