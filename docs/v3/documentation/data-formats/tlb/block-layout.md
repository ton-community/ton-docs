import Feedback from '@site/src/components/Feedback';

# Block layout

:::info
To maximize comprehension of this page, it is highly recommended that you familiarize yourself with the [TL-B language](/v3/documentation/data-formats/tlb/cell-boc).
:::

A block in the blockchain is a record of new transactions that, once confirmed, is added to the blockchain as a permanent and immutable part of the decentralized ledger. Each block includes transaction data, timestamps, and a reference to the previous block, forming a block chain.

Blocks in TON Blockchain have a relatively complex structure, reflecting the system’s overall design. This page outlines the structure and layout of these blocks.

## Block
The raw TL-B scheme of a block is as follows:

```tlb
block#11ef55aa global_id:int32
    info:^BlockInfo value_flow:^ValueFlow
    state_update:^(MERKLE_UPDATE ShardState)
    extra:^BlockExtra = Block;
```

Let’s take a closer look at each field.

## global_id:int32

The identifier of the network where this block was created. For example, `-239` represents the Mainnet, and `-3` represents the Testnet.

## info:^BlockInfo

This field contains metadata about the block, including its version, sequence numbers, identifiers, and various flags.

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

| Field                           | Type                    | Description                                                                                                            |
| ------------------------------- | ----------------------- |------------------------------------------------------------------------------------------------------------------------|
| `version`                       | uint32                  | Specifies the version of the block structure.                                                                          |
| `not_master`                    | (## 1)                  | Indicates whether the block is a non-MasterChain block.                                                                |
| `after_merge`                   | (## 1)                  | Indicates whether the block was created immediately after merging two ShardChains, i.e., it has two parent blocks.     |
| `before_split`                  | (## 1)                  | Indicates whether the block was created immediately before a ShardChain split.                                         |
| `after_split`                   | (## 1)                  | Indicates whether the block was created immediately after a ShardChain split.                                          |
| `want_split`                    | Bool                    | Specifies whether a ShardChain split is desired.                                                                       |
| `want_merge`                    | Bool                    | Specifies whether a ShardChain merge is desired.                                                                       |
| `key_block`                     | Bool                    | Indicates whether the block is a key block.                                                                            |
| `vert_seqno_incr`               | (## 1)                  | Specifies the increment of the vertical sequence number.                                                               |
| `flags`                         | (## 8)                  | Contains additional flags related to the block.                                                                        |
| `seq_no`                        | #                       | The sequence number is assigned to the block.                                                                          |
| `vert_seq_no`                   | #                       | The vertical sequence number of the block.                                                                             |
| `shard`                         | ShardIdent              | Identifies the shard to which the block belongs.                                                                       |
| `gen_utime`                     | uint32                  | _The block generation time._                                                                                           |
| `start_lt`                      | uint64                  | Logical time at the start of the block’s lifespan.                                                                     |
| `end_lt`                        | uint64                  | Logical time at the end of the block’s lifespan.                                                                       |
| `gen_validator_list_hash_short` | uint32                  | A short hash of the validator list is active during block generation.                                                  |
| `gen_catchain_seqno`            | uint32                  | The [CatChain](/catchain.pdf)sequence number is associated with the block.                                             
| `min_ref_mc_seqno`              | uint32                  | The minimum sequence number of the referenced MasterChain block.                                                       |
| `prev_key_block_seqno`          | uint32                  | The sequence number of the previous key block.                                                                         |
| `gen_software`                  | GlobalVersion           | Specifies the software version that generated the block. Present only if the first bit of the `version` is set to `1`. |
| `master_ref`                    | BlkMasterInfo           | A reference to the MasterChain block if the current block is not a MasterChain block.                                  |
| `prev_ref`                      | BlkPrevInfo after_merge | A reference to the previous block in the chain.                             |
| `prev_vert_ref`                 | BlkPrevInfo 0           | A reference to the last block in the vertical sequence, if applicable.                      |

### value_flow:^ValueFlow

Represents the currency flow within the block, including collected fees and other currency-related transactions.

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

| Field            | Type                                                                   | Description                                                                |
| ---------------- | ---------------------------------------------------------------------- |----------------------------------------------------------------------------|
| `from_prev_blk`  | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Indicates the currency flow from the previous block.                       |
| `to_next_blk`    | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Indicates the currency flow to the next block.                             |
| `imported`       | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Specifies the amount of currency imported into the block.                  |
| `exported`       | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Specifies the amount of currency exported from the block.                  |
| `fees_collected` | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | The total amount of fees collected within the block.                       |
| `fees_imported`  | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | The fees imported into the block. Non-zero only in MasterChain.            |
| `recovered`      | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | The currency recovered in the block Non-zero only in MasterChain.          |
| `created`        | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Amount of new currency created in the block. Non-zero only in MasterChain. |
| `minted`         | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | The currency minted in the block. Non-zero only in MasterChain.            |

## state_update:^(MERKLE_UPDATE ShardState)

Indicates the updated state of the shard after this block.

```tlb
!merkle_update#02 {X:Type} old_hash:bits256 new_hash:bits256
    old:^X new:^X = MERKLE_UPDATE X;
```

| Field      | Type                      | Description                                        |
| ---------- | ------------------------- |----------------------------------------------------|
| `old_hash` | bits256                   | The hash of the previous shard state.              |
| `new_hash` | bits256                   | The hash of the updated shard state.               |
| `old`      | [ShardState](#shardstate) | The previous shard state was stored as a reference.|
| `new`      | [ShardState](#shardstate) | The updated shard state is stored as a reference. |

### ShardState

`ShardState` can contain either information about a single shard or, if the shard has been split, information about its left and right parts.

```tlb
_ ShardStateUnsplit = ShardState;
split_state#5f327da5 left:^ShardStateUnsplit right:^ShardStateUnsplit = ShardState;
```

### ShardState unsplitted

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

| Field                  | Type                                                                   | Required | Description                                                                                                                                                       |
| ---------------------- | ---------------------------------------------------------------------- | -------- |-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `global_id`            | int32                                                                  | Yes      | An ID of the network where this shard resides. `-239` for Mainnet, `-3` for Testnet.                                                                              |
| `shard_id`             | ShardIdent                                                             | Yes      | The unique identifier of the shard.                                                                                                                               |
| `seq_no`               | uint32                                                                 | Yes      | The latest sequence number of this ShardChain.                                                                                                                    |
| `vert_seq_no`          | #                                                                      | Yes      | The latest vertical sequence number of this ShardChain.                                                                                                           |
| `gen_utime`            | uint32                                                                 | Yes      | The generation time associated with the creation of the shard.                                                                                                    |
| `gen_lt`               | uint64                                                                 | Yes      | The logical time at which the shard was generated.                                                                                                                |
| `min_ref_mc_seqno`     | uint32                                                                 | Yes      | The sequence number of the latest referenced MasterChain block.                                                                                                   |
| `out_msg_queue_info`   | OutMsgQueueInfo                                                        | Yes      | Metadata about the shard’s outbound message queue. Stored in a reference.                                                                                         |
| `before_split`         | ## 1                                                                   | Yes      | A flag indicating that the next block of this ShardChain. It initiates a split.                                                                                   |
| `accounts`             | ShardAccounts                                                          | Yes      | A reference to the current state of accounts within the shard.                                                                                                    |
| `overload_history`     | uint64                                                                 | Yes      | A counter tracking shard overload events. Used to inform sharding decisions.                                                                                      |
| `underload_history`    | uint64                                                                 | Yes      | A counter tracking shard underload events. Used to inform sharding decisions.                                                                                     |
| `total_balance`        | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Yes      | The total balance is held across all accounts in the shard.                                                                                                       |
| `total_validator_fees` | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Yes      | The total amount of validator fees accumulated within the shard.                                                                                                  |
| `libraries`            | HashmapE 256 LibDescr                                                  | Yes      | A hashmap of libraries used in the shard. This is usually empty, except in the MasterChain.                                                                       |
| `master_ref`           | BlkMasterInfo                                                          | No       | A reference to the masterchain block info.                                                                                                                        |
| `custom`               | McStateExtra                                                           | No       | MasterChain-specific extra data. Present only in the MasterChain. Stored in a reference.   |

### ShardState splitted

| Field   | Type                                        | Description                                                |
| ------- | ------------------------------------------- | ---------------------------------------------------------- |
| `left`  | [ShardStateUnsplit](#shardstate-unsplitted) | The state of the left shard after the split. Stored in a reference.  |
| `right` | [ShardStateUnsplit](#shardstate-unsplitted) | The state of the right shard after the split. Stored in a reference. |

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

| Field            | Type                          | Required | Description                                                                                                                                              |
| ---------------- | ----------------------------- | -------- |----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `in_msg_descr`   | InMsgDescr                    | Yes      | The descriptor for the incoming messages in the block. Stored in a reference.                                                                            |
| `out_msg_descr`  | OutMsgDescr                   | Yes      | The descriptor for the outgoing messages in the block. Stored in a reference.                                                                            |
| `account_blocks` | ShardAccountBlocks            | Yes      | The collection of all transactions processed in the block, along with updates to the states of accounts assigned to the shard and stored in a reference. |
| `rand_seed`      | bits256                       | Yes      | The random seed for the block.                                                                                                                       |
| `created_by`     | bits256                       | Yes      | The entity, usually a validator's public key, that created the block.                                                                    |
| `custom`         | [McBlockExtra](#mcblockextra) | No       | It contains masterchain-specific data, such as custom extra data for the block. Present only in the MasterChain. Stored in a reference.    |

### McBlockExtra

This field contains extra information about the MasterChain block.

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

| Field                 | Type                            | Required | Description                                                                             |
| --------------------- | ------------------------------- | -------- |-----------------------------------------------------------------------------------------|
| `key_block`           | ## 1                            | Yes      | Flag indicating whether the block is a key block.                                       |
| `shard_hashes`        | ShardHashes                     | Yes      | The hashes of the latest blocks for the corresponding ShardChains.                      |
| `shard_fees`          | ShardFees                       | Yes      | The total fees are collected from all shards in this block.                             |
| `prev_blk_signatures` | HashmapE 16 CryptoSignaturePair | Yes      | Signatures of the previous block.                                                       |
| `recover_create_msg`  | InMsg                           | No       | The message related to recovering extra-currencies, if any. Stored in a reference.      |
| `mint_msg`            | InMsg                           | No       | The message related to minting extra-currencies, if any. Stored in a reference.         |
| `config`              | ConfigParams                    | No       | The actual configuration parameters for this block. Present only if `key_block` is set. |

## See also

- The initial explanation of the [block layout](https://docs.ton.org/tblkch.pdf#page=96&zoom=100,148,172) from the whitepaper.

<Feedback />

