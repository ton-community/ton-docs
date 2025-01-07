# 区块布局

:::info
为了最大限度地理解本页内容，强烈建议您熟悉 [TL-B 语言](/develop/data-formats/cell-boc)。
:::

区块链中的一个区块是一条新交易记录，一旦完成，就会作为这个去中心化账本的永久且不可更改的一部分被添加到区块链上。每个区块包含交易数据、时间以及对前一个区块的引用等信息，从而形成一个区块链。

TON 区块链中的区块由于系统的整体复杂性而具有相当复杂的结构。本页描述了这些区块的结构和布局。

## 区块

一个区块的原始 TL-B 方案如下：

```tlb
block#11ef55aa global_id:int32
    info:^BlockInfo value_flow:^ValueFlow
    state_update:^(MERKLE_UPDATE ShardState)
    extra:^BlockExtra = Block;
```

让我们仔细看看每个字段。

## global_id:int32

创建此区块的网络的 ID。主网为 `-239`，测试网为 `-3`。

## info:^BlockInfo

此字段包含关于区块的信息，如其版本、序列号、标识符和其他标志位。

```tlb
block_info#9bc7a987 version:uint32
    not_master:(## 1)
    after_merge:(## 1) before_split:(## 1)
    after_split:(## 1)
    want_split:Bool want_merge:Bool
    key_block:Bool vert_seqno_incr:(## 1)
    flags:(## 8) { flags <= 1 }
    seq_no:# vert_seq_no:# { vert_seq_no >= vert_seqno_incr }
    { prev_seq_no:# } { ~prev_seq_no + 1 = seq_no }
    shard:ShardIdent gen_utime:uint32
    start_lt:uint64 end_lt:uint64
    gen_validator_list_hash_short:uint32
    gen_catchain_seqno:uint32
    min_ref_mc_seqno:uint32
    prev_key_block_seqno:uint32
    gen_software:flags . 0?GlobalVersion
    master_ref:not_master?^BlkMasterInfo
    prev_ref:^(BlkPrevInfo after_merge)
    prev_vert_ref:vert_seqno_incr?^(BlkPrevInfo 0)
    = BlockInfo;
```

| 字段                              | 类型                                           | 描述                                    |
| ------------------------------- | -------------------------------------------- | ------------------------------------- |
| `version`                       | uint32                                       | 区块结构的版本。                              |
| `not_master`                    | (## 1)                    | 标志位，表示此区块是否为主链区块。                     |
| `after_merge`                   | (## 1)                    | 标志位，表示此区块是否在两个分片链合并后创建，因此它有两个父区块。     |
| `before_split`                  | (## 1)                    | 标志位，表示此区块是否在其分片链分裂前创建。                |
| `after_split`                   | (## 1)                    | 标志位，表示此区块是否在其分片链分裂后创建。                |
| `want_split`                    | Bool                                         | 标志位，表示是否希望分片链分裂。                      |
| `want_merge`                    | Bool                                         | 标志位，表示是否希望分片链合并。                      |
| `key_block`                     | Bool                                         | 标志位，表示此区块是否为关键区块。                     |
| `vert_seqno_incr`               | (## 1)                    | 垂直序列号的增量。                             |
| `flags`                         | (## 8)                    | 区块的附加标志位。                             |
| `seq_no`                        | #                                            | 与区块相关的序列号。                            |
| `vert_seq_no`                   | #                                            | 与区块相关的垂直序列号。                          |
| `shard`                         | ShardIdent                                   | 该块所属分片的标识符。                           |
| `gen_utime`                     | uint32                                       | 区块的生成时间。                              |
| `start_lt`                      | uint64                                       | 与区块相关的起始逻辑时间。                         |
| `end_lt`                        | uint64                                       | 与区块相关的逻辑结束时间。                         |
| `gen_validator_list_hash_short` | uint32                                       | 在生成此区块时，与验证器列表相关的简短哈希值。               |
| `gen_catchain_seqno`            | uint32                                       | [Catchain](/catchain.pdf)与此区块相关的序列号。  |
| `min_ref_mc_seqno`              | uint32                                       | 引用的主链区块的最小序列号。                        |
| `prev_key_block_seqno`          | uint32                                       | 上一个密钥块的序列号。                           |
| `gen_software`                  | GlobalVersion                                | 生成区块的软件版本。只有当 "版本 "的第一位设置为 "1 "时才会显示。 |
| `master_ref`                    | BlkMasterInfo                                | 如果区块不是主区块，则是主区块的引用。存储在引用区块中。          |
| `prev_ref`                      | BlkPrevInfo after_merge | 上一个区块的引用。存储在引用中。                      |
| `prev_vert_ref`                 | BlkPrevInfo 0                                | 垂直序列中前一个区块的引用（如果存在）。存储在引用中。           |

### value_flow:^ValueFlow

该字段表示区块内的货币流量，包括收取的费用和其他涉及货币的交易。

```tlb
value_flow#b8e48dfb ^[ from_prev_blk:CurrencyCollection
    to_next_blk:CurrencyCollection
    imported:CurrencyCollection
    exported:CurrencyCollection ]
    fees_collected:CurrencyCollection
    ^[
    fees_imported:CurrencyCollection
    recovered:CurrencyCollection
    created:CurrencyCollection
    minted:CurrencyCollection
    ] = ValueFlow;
```

| Field            | Type                                                                                | Description           |
| ---------------- | ----------------------------------------------------------------------------------- | --------------------- |
| `from_prev_blk`  | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | 代表上一个区块的货币流量。         |
| `to_next_blk`    | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | 代表货币流向下一个区块。          |
| `imported`       | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | 代表输入区块的货币流量。          |
| `exported`       | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | 代表从区块输出的货币流量。         |
| `fees_collected` | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | 该区块收取的费用总额。           |
| `fees_imported`  | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | 输入区块的费用。仅在主链中为非零。     |
| `recovered`      | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | 区块中回收的货币数量。仅在主链中为非零。  |
| `created`        | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | 区块中创建的新货币数量。仅在主链中不为零。 |
| `minted`         | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | 区块中铸造的货币数量。仅在主链中为非零。  |

## state_update:^(MERKLE_UPDATE ShardState)

该字段表示分片状态的更新。

```tlb
!merkle_update#02 {X:Type} old_hash:bits256 new_hash:bits256
    old:^X new:^X = MERKLE_UPDATE X;
```

| Field      | Type                      | Description    |
| ---------- | ------------------------- | -------------- |
| `old_hash` | bits256                   | 分片状态的旧散列值。     |
| `new_hash` | bits256                   | 分片状态的新散列值。     |
| `old`      | [ShardState](#shardstate) | 分片的旧状态。存储在引用中。 |
| `new`      | [ShardState](#shardstate) | 分片的新状态。存储在引用中。 |

### ShardState

`ShardState` 可以包含分片的相关信息，或者在分片被分割的情况下，也可以包含左右分割部分的相关信息。

```tlb
_ ShardStateUnsplit = ShardState;
split_state#5f327da5 left:^ShardStateUnsplit right:^ShardStateUnsplit = ShardState;
```

### ShardState Unsplitted

```tlb
shard_state#9023afe2 global_id:int32
    shard_id:ShardIdent
    seq_no:uint32 vert_seq_no:#
    gen_utime:uint32 gen_lt:uint64
    min_ref_mc_seqno:uint32
    out_msg_queue_info:^OutMsgQueueInfo
    before_split:(## 1)
    accounts:^ShardAccounts
    ^[ overload_history:uint64 underload_history:uint64
    total_balance:CurrencyCollection
    total_validator_fees:CurrencyCollection
    libraries:(HashmapE 256 LibDescr)
    master_ref:(Maybe BlkMasterInfo) ]
    custom:(Maybe ^McStateExtra)
    = ShardStateUnsplit;
```

| Field                  | Type                                                                                | Required | Description                                   |
| ---------------------- | ----------------------------------------------------------------------------------- | -------- | --------------------------------------------- |
| `global_id`            | int32                                                                               | Yes      | 分片所属网络的 ID。`-239` 代表 mainnet，`-3` 代表 testnet。 |
| `shard_id`             | ShardIdent                                                                          | Yes      | 分片的标识符。                                       |
| `seq_no`               | uint32                                                                              | Yes      | 与此分片链相关的最新序列号。                                |
| `vert_seq_no`          | #                                                                                   | Yes      | 与此分片链相关的最新垂直序列号。                              |
| `gen_utime`            | uint32                                                                              | Yes      | 与创建分片相关的生成时间。                                 |
| `gen_lt`               | uint64                                                                              | Yes      | 与创建分片相关的逻辑时间。                                 |
| `min_ref_mc_seqno`     | uint32                                                                              | Yes      | 最新引用的主链区块的序列号。                                |
| `out_msg_queue_info`   | OutMsgQueueInfo                                                                     | Yes      | 有关此分片的输出消息队列的信息。存储在引用中。                       |
| `before_split`         | ## 1                                                                                | Yes      | 表示是否会在该分片链的下一个区块中进行拆分的标志。                     |
| `accounts`             | ShardAccounts                                                                       | Yes      | 分片中账户的状态。存储在引用中。                              |
| `overload_history`     | uint64                                                                              | Yes      | 分片过载事件的历史记录。通过分片实现负载平衡。                       |
| `underload_history`    | uint64                                                                              | Yes      | 分片负载不足事件的历史记录。用于通过分片实现负载平衡。                   |
| `total_balance`        | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Yes      | 分片的总余额。                                       |
| `total_validator_fees` | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Yes      | 分片的验证器总费用。                                    |
| `libraries`            | HashmapE 256 LibDescr                                                               | Yes      | 该分片中库描述的哈希表。目前仅在主链中为非空。                       |
| `master_ref`           | BlkMasterInfo                                                                       | No       | 主数据块信息的引用。                                    |
| `custom`               | McStateExtra                                                                        | No       | 分片状态的自定义额外数据。该字段仅在主链中存在，包含所有特定于主链的数据。存储在引用中。  |

### ShardState Splitted

| Field   | Type                                        | Description     |
| ------- | ------------------------------------------- | --------------- |
| `left`  | [ShardStateUnsplit](#shardstate-unsplitted) | 左侧分片的状态。存储在引用中。 |
| `right` | [ShardStateUnsplit](#shardstate-unsplitted) | 右侧分片的状态。存储在引用中。 |

## extra:^BlockExtra

该字段包含有关区块的额外信息。

```tlb
block_extra in_msg_descr:^InMsgDescr
    out_msg_descr:^OutMsgDescr
    account_blocks:^ShardAccountBlocks
    rand_seed:bits256
    created_by:bits256
    custom:(Maybe ^McBlockExtra) = BlockExtra;
```

| Field            | Type                          | Required | Description                              |
| ---------------- | ----------------------------- | -------- | ---------------------------------------- |
| `in_msg_descr`   | InMsgDescr                    | Yes      | 区块中传入信息的描述符。以引用形式存储。                     |
| `out_msg_descr`  | OutMsgDescr                   | Yes      | 区块中发出报文的描述符。存储在引用中。                      |
| `account_blocks` | ShardAccountBlocks            | Yes      | 区块中处理的所有交易的集合，以及分配给分片的账户状态的所有更新。以引用形式存储。 |
| `rand_seed`      | bits256                       | Yes      | 区块的随机种子。                                 |
| `created_by`     | bits256                       | Yes      | 创建区块的实体（通常是验证器的公钥）。                      |
| `custom`         | [McBlockExtra](#mcblockextra) | No       | 该字段仅出现在主链中，包含所有主链特定数据。区块的自定义额外数据。存储在引用中。 |

### McBlockExtra

该字段包含有关主链区块的额外信息。

```tlb
masterchain_block_extra#cca5
    key_block:(## 1)
    shard_hashes:ShardHashes
    shard_fees:ShardFees
    ^[ prev_blk_signatures:(HashmapE 16 CryptoSignaturePair)
    recover_create_msg:(Maybe ^InMsg)
    mint_msg:(Maybe ^InMsg) ]
    config:key_block?ConfigParams
    = McBlockExtra;
```

| Field                 | Type                            | Required | Description                            |
| --------------------- | ------------------------------- | -------- | -------------------------------------- |
| `key_block`           | ## 1                            | Yes      | 指示区块是否为关键区块的标志。                        |
| `shard_hashes`        | ShardHashes                     | Yes      | 相应分片链最新区块的哈希值。                         |
| `shard_fees`          | ShardFees                       | Yes      | 从该区块所有分片收取的费用总额。                       |
| `prev_blk_signatures` | HashmapE 16 CryptoSignaturePair | Yes      | 上一个街区的签名。                              |
| `recover_create_msg`  | InMsg                           | No       | 与收回额外货币有关的信息（如果有）。存储在引用中。              |
| `mint_msg`            | InMsg                           | No       | 与铸造额外货币有关的信息（如果有）。存储在引用中。              |
| `config`              | ConfigParams                    | No       | 此块的实际配置参数。只有设置了 `key_block` 时，该字段才会出现。 |

## 另见

- 白皮书中对 [区块布局](https://docs.ton.org/tblkch.pdf#page=96\&zoom=100,148,172)的原始描述
