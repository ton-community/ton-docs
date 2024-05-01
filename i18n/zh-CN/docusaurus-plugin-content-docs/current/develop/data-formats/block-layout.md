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

| 字段                               | 类型                    | 描述                                                                                                           |
| ---------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| `version`                          | uint32                  | 区块结构的版本。                                                                                               |
| `not_master`                       | (## 1)                  | 标志位，表示此区块是否为主链区块。                                                                               |
| `after_merge`                      | (## 1)                  | 标志位，表示此区块是否在两个分片链合并后创建，因此它有两个父区块。                                                |
| `before_split`                     | (## 1)                  | 标志位，表示此区块是否在其分片链分裂前创建。                                                                      |
| `after_split`                      | (## 1)                  | 标志位，表示此区块是否在其分片链分裂后创建。                                                                      |
| `want_split`                       | Bool                    | 标志位，表示是否希望分片链分裂。                                                                                  |
| `want_merge`                       | Bool                    | 标志位，表示是否希望分片链合并。                                                                                  |
| `key_block`                        | Bool                    | 标志位，表示此区块是否为关键区块。                                                                                |
| `vert_seqno_incr`                  | (## 1)                  | 垂直序列号的增量。                                                                                             |
| `flags`                            | (## 8)                  | 区块的附加标志位。                                                                                               |
| `seq_no`                           | #                       | 与区块相关的序列号。                                                                                           |
| `vert_seq_no`                      | #                       | 与区块相关的垂直序列号。                                                                                       |
| `shard`                            | ShardIdent              |

 此区块所属的分片的标识符。                                                                                     |
| `gen_utime`                        | uint32                  | 区块的生成时间。                                                                                               |
| `start_lt`                         | uint64                  | 与区块相关的开始逻辑时间。                                                                                     |
| `end_lt`                           | uint64                  | 与区块相关的结束逻辑时间。                                                                                     |
| `gen_validator_list_hash_short`    | uint32                  | 生成此区块时验证者列表的短哈希。                                                                               |
| `gen_catchain_seqno`               | uint32                  | 与此区块相关的 [Catchain](/catchain.pdf) 序列号。                                                              |
| `min_ref_mc_seqno`                 | uint32                  | 引用的主链区块的最小序列号。                                                                                   |
| `prev_key_block_seqno`             | uint32                  | 上一个关键区块的序列号。                                                                                       |
| `gen_software`                     | GlobalVersion           | 生成区块的软件版本。仅当 `version` 的第一位设置为 `1` 时呈现。                                                  |
| `master_ref`                       | BlkMasterInfo           | 如果区块不是主区块，则引用主区块。存储在引用块中。                                                              |
| `prev_ref`                         | BlkPrevInfo after_merge | 引用前一个区块。存储在引用中。                                                                                  |
| `prev_vert_ref`                    | BlkPrevInfo 0           | 如果存在，则引用垂直序列中的前一个区块。存储在引用中。                                                          |

### value_flow:^ValueFlow

此字段代表区块内的货币流动，包括收集的费用和其他涉及货币的交易。

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

| 字段              | 类型                                                                   | 描述                                                                          |
| ----------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `from_prev_blk`   | [CurrencyCollection](/develop/data-formats/msg-tlb#currencycollection) | 表示从前一个区块流入的货币。                                                   |
| `to_next_blk`     | [CurrencyCollection](/develop/data-formats/msg-tlb#currencycollection) | 表示流向下一个区块的货币。                                                     |
| `imported`        | [CurrencyCollection](/develop/data-formats/msg-tlb#currencycollection) | 表示导入到区块的货币。                                                         |
| `exported`        | [CurrencyCollection](/develop/data-formats/msg-tlb#currencycollection) | 表示从区块导出的货币。                                                         |
| `fees_collected`  | [CurrencyCollection](/develop/data-formats/msg-tlb#currencycollection) | 区块中收集的费用总额。                                                         |
| `fees_imported`   | [CurrencyCollection](/develop/data-formats/msg-tlb#currencycollection) | 导入到区块的费用金额。仅在主链中非零。                                         |
| `recovered`       | [CurrencyCollection](/develop/data-formats/msg-tlb#currencycollection) | 区块中恢复的货币金额。仅在主链中非零。                                         |
| `created`         | [CurrencyCollection](/develop/data-formats/msg-tlb#currencycollection) | 区块中创建的新货币金额。仅在主链中非零。                                       |
| `minted`          | [CurrencyCollection](/develop/data-formats/msg-tlb#currencycollection) | 区块中铸造的货币金额。仅在主链中非零。                                         |

## state_update:^(MERKLE_UPDATE ShardState)

此字段代表分片状态的更新。

```tlb
!merkle_update#02 {X:Type} old_hash:bits256 new_hash:bits256
    old:^X new:^X = MERKLE_UPDATE X;
```

| 字段         | 类型                      | 描述                                                  |
| ------------ | ------------------------- | ----------------------------------------------------- |
| `old_hash`   | bits256                   | 分片状态的旧哈希值。                                   |
| `new_hash`   | bits256                   | 分片状态的新哈希值。                                   |
| `old`        | [ShardState](#shardstate) | 分片的旧状态。存储为引用。                             |
| `new`        | [ShardState](#shardstate) | 分片的新状态。存储为引用。                             |

### ShardState

`ShardState` 可以包含关于分片的信息，或者在该分片被拆分的情况下，包含关于左右两个拆分部分的信息。

```tlb
_ ShardStateUnsplit = ShardState;
split_state#5f327da5 left:^ShardStateUnsplit right:^ShardStateUnsplit = ShardState;
```

### ShardState 未拆分

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

| 字段                        | 类型                                                                   | 是否必需 | 描述                                                                                                 |
| --------------------------- | ---------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `global_id`                 | int32                                                                  | 是       | 此分片所属网络的 ID。主网为 `-239`，测试网为 `-3`。                                                   |
| `shard_id`                  | ShardIdent                                                             | 是       | 分片的标识符。                                                                                       |
| `seq_no`                    | uint32                                                                 | 是       | 此分片链的最新序列号。                                                                               |
| `vert_seq_no`               | #                                                                      | 是       | 此分片链的最新垂直序列号。                                                                           |
| `gen_utime`                 | uint32                                                                 | 是       | 创建分片的生成时间。                                                                                 |
| `gen_lt`                    | uint64                                                                 | 是       | 创建分片的逻辑时间。                                                                                 |
| `min_ref_mc_seqno`          | uint32                                                                 | 是       | 最新引用的主链区块的序列号。                                                                         |
| `out_msg_queue_info`        | OutMsgQueueInfo                                                        | 是       | 此分片的出消息队列信息。存储为引用。                                                                 |
| `before_split`              | ## 1                                                                   | 是       | 标志位，表示此分片链的下一个区块是否将发生拆分。                                                       |
| `accounts`                  | ShardAccounts                                                          | 是       | 分片中账户的状态。存储为引用。                                                                       |
| `overload_history`          | uint64                                                                 | 是       | 分片的超载事件历史。用于通过分片进行负载均衡。                                                       |
| `underload_history`         | uint64                                                                 | 是       | 分片的欠载事件历史。用于通过分片进行负载均衡。                                                       |
| `total_balance`             | [CurrencyCollection](/develop/data-formats/msg-tlb#currencycollection) | 是       | 分片的总余额。                                                                                       |
| `total_validator_fees`      | [CurrencyCollection](/develop/data-formats/msg-tlb#currencycollection) | 是       | 分片的总验证者费用。                                                                                 |
| `libraries`                 | HashmapE 256 LibDescr                                                  | 是       | 此分片中的库描述哈希映射。目前仅在主链中非空。

                                                         |
| `master_ref`                | BlkMasterInfo                                                          | 否       | 主块信息的引用。                                                                                     |
| `custom`                    | McStateExtra                                                           | 否       | 分片状态的自定义额外数据。此字段仅在主链中存在，包含所有主链特有的数据。存储为引用。                   |

### ShardState 拆分

| 字段       | 类型                                         | 描述                                                      |
| ---------- | -------------------------------------------- | --------------------------------------------------------- |
| `left`     | [ShardStateUnsplit](#shardstate-unsplitted)  | 拆分后左侧分片的状态。存储为引用。                         |
| `right`    | [ShardStateUnsplit](#shardstate-unsplitted)  | 拆分后右侧分片的状态。存储为引用。                         |

## extra:^BlockExtra

此字段包含有关区块的额外信息。

```tlb
block_extra in_msg_descr:^InMsgDescr
    out_msg_descr:^OutMsgDescr
    account_blocks:^ShardAccountBlocks
    rand_seed:bits256
    created_by:bits256
    custom:(Maybe ^McBlockExtra) = BlockExtra;
```

| 字段              | 类型                           | 是否必需 | 描述                                                                                                 |
| ----------------- | ------------------------------ | -------- | ---------------------------------------------------------------------------------------------------- |
| `in_msg_descr`    | InMsgDescr                     | 是       | 区块中传入消息的描述符。存储为引用。                                                                 |
| `out_msg_descr`   | OutMsgDescr                    | 是       | 区块中传出消息的描述符。存储为引用。                                                                 |
| `account_blocks`  | ShardAccountBlocks             | 是       | 区块中处理的所有交易及分片分配账户状态的更新集合。存储为引用。                                       |
| `rand_seed`       | bits256                        | 是       | 区块的随机种子。                                                                                     |
| `created_by`      | bits256                        | 是       | 创建区块的实体（通常是验证者的公钥）。                                                               |
| `custom`          | [McBlockExtra](#mcblockextra)  | 否       | 此字段仅在主链中存在，包含所有主链特有的数据。区块的自定义额外数据。存储为引用。                      |

### McBlockExtra

此字段包含有关主链区块的额外信息。

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

| 字段                   | 类型                              | 是否必需 | 描述                                                                           |
| ---------------------- | --------------------------------- | -------- | ------------------------------------------------------------------------------ |
| `key_block`            | ## 1                              | 是       | 标志位，表示区块是否为关键区块。                                                 |
| `shard_hashes`         | ShardHashes                       | 是       | 相应分片链的最新区块的哈希。                                                   |
| `shard_fees`           | ShardFees                         | 是       | 此区块中所有分片收集的总费用。                                                 |
| `prev_blk_signatures`  | HashmapE 16 CryptoSignaturePair   | 是       | 前一区块的签名。                                                               |
| `recover_create_msg`   | InMsg                             | 否       | 与恢复额外代币相关的消息（如果有）。存储为引用。                               |
| `mint_msg`             | InMsg                             | 否       | 与铸造额外代币相关的消息（如果有）。存储为引用。                               |
| `config`               | ConfigParams                      | 否       | 此区块的实际配置参数。当设置了 `key_block` 时此字段存在。                       |

## 参阅

-   [白皮书](https://docs.ton.org/tblkch.pdf#page=96&zoom=100,148,172)中原始的[区块布局](#)描述
