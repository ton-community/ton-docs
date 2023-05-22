# Block layout

:::info
To maximize your comprehension of this page, familiarizing yourself with the [TL-B language](/develop/data-formats/cell-boc) is highly recommended.
:::

## Block

Raw TL-B scheme of a block looks as:

```tlb
block#11ef55aa global_id:int32
    info:^BlockInfo value_flow:^ValueFlow
    state_update:^(MERKLE_UPDATE ShardState)
    extra:^BlockExtra = Block;
```

Let's take a closer look at each field.

## global_id:int32

An ID of the network where this block is created. `-239` for mainnet and `-3` for testnet.

## info:^BlockInfo

This field contains information about the block, such as its version, sequence numbers, identifiers, and other flags.

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

| Field                           | Type                             | Description                                                                                                       |
| ------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `version`                       | uint32                           | The version of the block structure.                                                                               |
| `not_master`                    | (## 1)                           | A flag indicating if this block is a masterchain block.                                                           |
| `after_merge`                   | (## 1)                           | A flag indicating if this block was created right after the merge of two shardchains, so it has two parent blocks |
| `before_split`                  | (## 1)                           | A flag indicating if this block was created right before the split of its shardchain                              |
| `after_split`                   | (## 1)                           | A flag indicating if this block was created right after the split of its shardchain                               |
| `want_split`                    | Bool                             | A flag indicating whether a shardchain split is desired.                                                          |
| `want_merge`                    | Bool                             | A flag indicating whether a shardchain merge is desired.                                                          |
| `key_block`                     | Bool                             | A flag indicating if this block is a key block.                                                                   |
| `vert_seqno_incr`               | (## 1)                           | Increment of the vertical sequence number.                                                                        |
| `flags`                         | (## 8)                           | Additional flags for the block.                                                                                   |
| `seq_no`                        | #                                | Sequence number related to the block.                                                                             |
| `vert_seq_no`                   | #                                | Vertical sequence number related to the block.                                                                    |
| `shard`                         | ShardIdent                       | The identifier of the shard where this block belongs.                                                             |
| `gen_utime`                     | uint32                           | The generation time of the block.                                                                                 |
| `start_lt`                      | uint64                           | Start logical time associated with the block.                                                                     |
| `end_lt`                        | uint64                           | End logical time associated with the block.                                                                       |
| `gen_validator_list_hash_short` | uint32                           | Short hash related to the list of validators at the moment of generation of this block.                           |
| `gen_catchain_seqno`            | uint32                           | [Catchain](/catchain.pdf) sequence number related to this block.                                                  |
| `min_ref_mc_seqno`              | uint32                           | Minimum sequence number of referenced masterchain block.                                                          |
| `prev_key_block_seqno`          | uint32                           | Sequence number of the previous key block.                                                                        |
| `gen_software`                  | flags . 0?GlobalVersion          | The version of the software that generated the block.                                                             |
| `master_ref`                    | not_master?^BlkMasterInfo        | A reference to the master block if the block is not a master block.                                               |
| `prev_ref`                      | ^(BlkPrevInfo after_merge)       | A reference to the previous block.                                                                                |
| `prev_vert_ref`                 | vert_seqno_incr?^(BlkPrevInfo 0) | A reference to the previous block in the vertical sequence.                                                       |

### value_flow:^ValueFlow

This field represents the flow of currency within the block, including fees collected and other transactions involving currency.

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

| Field            | Type               | Description                                                |
| ---------------- | ------------------ | ---------------------------------------------------------- |
| `from_prev_blk`  | CurrencyCollection | Represents the flow of currencies from the previous block. |
| `to_next_blk`    | CurrencyCollection | Represents the flow of currencies to the next block.       |
| `imported`       | CurrencyCollection | Represents the flow of currencies imported to the block.   |
| `exported`       | CurrencyCollection | Represents the flow of currencies exported from the block. |
| `fees_collected` | CurrencyCollection | The total amount of fees collected in the block.           |
| `fees_imported`  | CurrencyCollection | The amount of fees imported into the block.                |
| `recovered`      | CurrencyCollection | The amount of currencies recovered in the block.           |
| `created`        | CurrencyCollection | The amount of new currencies created in the block.         |
| `minted`         | CurrencyCollection | The amount of currencies minted in the block.              |

## state_update:^(MERKLE_UPDATE ShardState)

This field represents the update of the shard state.

```tlb
!merkle_update#02 {X:Type} old_hash:bits256 new_hash:bits256
    old:^X new:^X = MERKLE_UPDATE X;
```

| Field      | Type                       | Description                      |
| ---------- | -------------------------- | -------------------------------- |
| `old_hash` | bits256                    | The old hash of the shard state. |
| `new_hash` | bits256                    | The new hash of the shard state. |
| `old`      | ^[ShardState](#shardstate) | The old state of the shard.      |
| `new`      | ^[ShardState](#shardstate) | The new state of the shard.      |

### ShardState

`ShardState` can contain either information about the shard, or, in case if this shard is splitted, information about left and right splitted parts.

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

| Field                  | Type                    | Description                                                                             |
| ---------------------- | ----------------------- | --------------------------------------------------------------------------------------- |
| `global_id`            | int32                   | An ID of the network where this shard belongs. `-239` for mainnet and `-3` for testnet. |
| `shard_id`             | ShardIdent              | The identifier of the shard.                                                            |
| `seq_no`               | uint32                  | The latest sequence number associated with this shardchain.                             |
| `vert_seq_no`          | #                       | The latest vertical sequence number associated with this shardchain.                    |
| `gen_utime`            | uint32                  | The generation time associated with the creation of the shard.                          |
| `gen_lt`               | uint64                  | The logical time associated with the creation of the shard.                             |
| `min_ref_mc_seqno`     | uint32                  | Sequence number of the latest referenced masterchain block.                             |
| `out_msg_queue_info`   | ^OutMsgQueueInfo        | Information about the out message queue of this shard.                                  |
| `before_split`         | (## 1)                  | A flag indicating whether a split will in the next block of this shardchain.            |
| `accounts`             | ^ShardAccounts          | The state of accounts in the shard.                                                     |
| `overload_history`     | uint64                  | History of overload events for the shard. Used for load balancing through sharding.     |
| `underload_history`    | uint64                  | History of underload events for the shard. Used for load balancing through sharding.    |
| `total_balance`        | CurrencyCollection      | Total balance for the shard.                                                            |
| `total_validator_fees` | CurrencyCollection      | Total validator fees for the shard.                                                     |
| `libraries`            | (HashmapE 256 LibDescr) | A hashmap of library descriptions in this shard.                                        |
| `master_ref`           | (Maybe BlkMasterInfo)   | A reference to the master block info.                                                   |
| `custom`               | (Maybe ^McStateExtra)   | Custom extra data for the shard state.                                                  |

### ShardState Splitted

| Field   | Type                                         | Description                         |
| ------- | -------------------------------------------- | ----------------------------------- |
| `left`  | ^[ShardStateUnsplit](#shardstate-unsplitted) | The state of the left split shard.  |
| `right` | ^[ShardStateUnsplit](#shardstate-unsplitted) | The state of the right split shard. |

## extra:^BlockExtra

This field contains extra information about the block.

```tlb
block_extra in_msg_descr:^InMsgDescr
    out_msg_descr:^OutMsgDescr
    account_blocks:^ShardAccountBlocks
    rand_seed:bits256
    created_by:bits256
    custom:(Maybe ^McBlockExtra) = BlockExtra;
```

| Field            | Type                  | Description                                                           |
| ---------------- | --------------------- | --------------------------------------------------------------------- |
| `in_msg_descr`   | ^InMsgDescr           | Descriptor of the incoming messages in the block.                     |
| `out_msg_descr`  | ^OutMsgDescr          | Descriptor of the outgoing messages in the block.                     |
| `account_blocks` | ^ShardAccountBlocks   | The block's associated account blocks.                                |
| `rand_seed`      | bits256               | The random seed for the block.                                        |
| `created_by`     | bits256               | The entity (usually a validator's public key) that created the block. |
| `custom`         | (Maybe ^McBlockExtra) | Custom extra data for the block.                                      |

## See also

-   Original description of [Block layout](https://docs.ton.org/tblkch.pdf#page=96&zoom=100,148,172) from whitepaper