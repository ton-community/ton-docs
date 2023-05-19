# Block layout

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

This field contains information about the block, such as its version, sequence numbers, identifiers, and other flags. The detailed structure is as follows:

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

-   `version`: The version of the block structure.
-   `not_master`: A flag indicating if this block is a masterchain block.
-   `after_merge`, `before_split`, `after_split`: Flags indicating the state of the block in the shardchain split and merge process.
-   `want_split`, `want_merge`: Flags indicating whether a shardchain split or merge is desired.
-   `key_block`: A flag indicating if this block is a key block.
-   `vert_seqno_incr`: Increment of the vertical sequence number.
-   `flags`: Additional flags for the block.
-   `seq_no`, `vert_seq_no`: Sequence numbers related to the block.
-   `shard`: The identifier of the shard where this block belongs.
-   `gen_utime`: The generation time of the block.
-   `start_lt`, `end_lt`: Logical time ranges associated with the block.
-   `gen_validator_list_hash_short`, `gen_catchain_seqno`: Information related to validators and catchain.
-   `min_ref_mc_seqno`, `prev_key_block_seqno`: Sequence numbers of referenced and previous key blocks.
-   `gen_software`: The version of the software that generated the block.
-   `master_ref`: A reference to the master block info if the block is not a master block.
-   `prev_ref`: A reference to the info of the previous block.
-   `prev_vert_ref`: A reference to the info of the previous block in the vertical sequence.

## value_flow:^ValueFlow

This field represents the flow of currency within the block, including fees collected and other transactions involving currency:

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

-   `from_prev_blk`, `to_next_blk`, `imported`, `exported`: These fields represent the flow of currency between blocks and in imports and exports.
-   `fees_collected`: The total amount of fees collected in the block.
-   `fees_imported`: The amount of fees imported into the block.
-   `recovered`: The amount of currency recovered in the block.
-   `created`: The amount of new currency created in the block.
-   `minted`: The amount of currency minted in the block.

## state_update:^(MERKLE_UPDATE ShardState)

This field represents the update of the shard state. The full scheme is as follows:

```tlb
!merkle_update#02 {X:Type} old_hash:bits256 new_hash:bits256
    old:^X new:^X = MERKLE_UPDATE X;

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

_ ShardStateUnsplit = ShardState;
split_state#5f327da5 left:^ShardStateUnsplit right:^ShardStateUnsplit = ShardState;
```

`ShardState` can contain either information about the shard, or, in case if this shard is splitted, information about left and right splitted parts.

Useful information in `MERKLE_UPDATE`:

-   `old_hash`, `new_hash`: The old and new hash of the shard state.
-   `old`, `new`: The old and new state of the shard.

The state of an unsplitted shard:

-   `global_id`: An ID of the network where this shard belongs. `-239` for mainnet and `-3` for testnet.
-   `shard_id`: The identifier of the shard.
-   `seq_no`, `vert_seq_no`: The latest sequence numbers associated with this shardchain.
-   `gen_utime`, `gen_lt`: The generation time and logical time associated with the creation of the shard.
-   `min_ref_mc_seqno`: Sequence number of the referenced masterchain block.
-   `out_msg_queue_info`: Information about the out message queue of this shard.
-   `before_split`: A flag indicating whether a split happened in the previous block of this shardchain.
-   `accounts`: The state of accounts in the shard.
-   `overload_history`, `underload_history`: History of overload and underload events for the shard.
-   `total_balance`, `total_validator_fees`: Total balance and validator fees for the shard.
-   `libraries`: A hashmap of library descriptions in this shard.
-   `master_ref`: A reference to the master block info.
-   `custom`: Custom extra data for the shard state.

In the case of a split shard, `ShardState` simply contains the states of the `left` and `right` split shards.

## extra:^BlockExtra

This field contains extra information about the block:

```tlb
block_extra in_msg_descr:^InMsgDescr
    out_msg_descr:^OutMsgDescr
    account_blocks:^ShardAccountBlocks
    rand_seed:bits256
    created_by:bits256
    custom:(Maybe ^McBlockExtra) = BlockExtra;
```

-   `in_msg_descr`, `out_msg_descr`: Descriptors of the incoming and outgoing messages in the block.
-   `account_blocks`: The block's associated account blocks.
-   `rand_seed`: The random seed for the block.
-   `created_by`: The entity (usually a validator's public key) that created the block.
-   `custom`: Custom extra data for the block.
