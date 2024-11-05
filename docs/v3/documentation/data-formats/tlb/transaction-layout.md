# Transaction layout

:::info
To maximize your comprehension of this page, familiarizing yourself with the [TL-B language](/v3/documentation/data-formats/tlb/cell-boc) is highly recommended.
:::

The TON Blockchain operates using three key parts: accounts, messages, and transactions. This page describes the structure and layout of transactions.

A transaction is an operation that processes inbound and outbound messages related to a specific account, altering its state and potentially generating fees for validators.

## Transaction

```tlb
transaction$0111 account_addr:bits256 lt:uint64
    prev_trans_hash:bits256 prev_trans_lt:uint64 now:uint32
    outmsg_cnt:uint15
    orig_status:AccountStatus end_status:AccountStatus
    ^[ in_msg:(Maybe ^(Message Any)) out_msgs:(HashmapE 15 ^(Message Any)) ]
    total_fees:CurrencyCollection state_update:^(HASH_UPDATE Account)
    description:^TransactionDescr = Transaction;
```

| Field             | Type                                                                   | Required | Description                                                                                                                                                                                                           |
| ----------------- | ---------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `account_addr`    | bits256                                                                | Yes      | The hash part of the address on which the transaction was executed. [More about addresses](/v3/documentation/smart-contracts/addresses#address-of-smart-contract)                                                  |
| `lt`              | uint64                                                                 | Yes      | Represents _Logical time_. [More about logical time](/v3/documentation/smart-contracts/message-management/messages-and-transactions#what-is-a-logical-time)                                                      |
| `prev_trans_hash` | bits256                                                                | Yes      | The hash of the previous transaction on this account.                                                                                                                                                                 |
| `prev_trans_lt`   | uint64                                                                 | Yes      | The `lt` of the previous transaction on this account.                                                                                                                                                                 |
| `now`             | uint32                                                                 | Yes      | The `now` value that was set when executing this transaction. It's a Unix timestamp in seconds.                                                                                                                       |
| `outmsg_cnt`      | uint15                                                                 | Yes      | The number of outgoing messages created while executing this transaction.                                                                                                                                             |
| `orig_status`     | [AccountStatus](#accountstatus)                                        | Yes      | The status of this account before the transaction was executed.                                                                                                                                                       |
| `end_status`      | [AccountStatus](#accountstatus)                                        | Yes      | The status of this account after executing the transaction.                                                                                                                                                           |
| `in_msg`          | (Message Any)                                                          | No       | The incoming message that triggered the execution of the transaction. Stored in a reference.                                                                                                                          |
| `out_msgs`        | HashmapE 15 ^(Message Any)                                             | Yes      | The dictionary that contains the list of outgoing messages that were created while executing this transaction.                                                                                                        |
| `total_fees`      | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Yes      | The total amount of fees that were collected while executing this transaction. It consists of a _Toncoin_ value and possibly some [Extra-currencies](/v3/documentation/dapps/defi/coins#extra-currencies). |
| `state_update`    | [HASH_UPDATE](#hash_update) Account                                    | Yes      | The `HASH_UPDATE` structure. Stored in a reference.                                                                                                                                                                   |
| `description`     | [TransactionDescr](#transactiondescr-types)                            | Yes      | A detailed description of the transaction execution process. Stored in a reference.                                                                                                                                   |

## AccountStatus

```tlb
acc_state_uninit$00 = AccountStatus;
acc_state_frozen$01 = AccountStatus;
acc_state_active$10 = AccountStatus;
acc_state_nonexist$11 = AccountStatus;
```

-   `[00]`: Account is not initialized
-   `[01]`: Account is frozen
-   `[10]`: Account is active
-   `[11]`: Account does not exist

## HASH_UPDATE

```tlb
update_hashes#72 {X:Type} old_hash:bits256 new_hash:bits256
    = HASH_UPDATE X;
```

| Field      | Type    | Description                                                     |
| ---------- | ------- | --------------------------------------------------------------- |
| `old_hash` | bits256 | The hash of the account state before executing the transaction. |
| `new_hash` | bits256 | The hash of the account state after executing the transaction.  |

## TransactionDescr Types

-   [Ordinary](#ordinary)
-   [Storage](#storage)
-   [Tick-tock](#tick-tock)
-   [Split prepare](#split-prepare)
-   [Split install](#split-install)
-   [Merge prepare](#merge-prepare)
-   [Merge install](#merge-install)

## Ordinary

This is the most common type of transaction and it fulfills most developers' needs. Transactions of this type have exactly one incoming message and can create several outgoing messages.

```tlb
trans_ord$0000 credit_first:Bool
    storage_ph:(Maybe TrStoragePhase)
    credit_ph:(Maybe TrCreditPhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool bounce:(Maybe TrBouncePhase)
    destroyed:Bool
    = TransactionDescr;
```

| Field          | Type           | Required | Description                                                                                                                                                                               |
| -------------- | -------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `credit_first` | Bool           | Yes      | A flag that correlates with `bounce` flag of an incoming message. `credit_first = !bounce`                                                                                                |
| `storage_ph`   | TrStoragePhase | No       | Contains information about storage phase of a transaction execution. [More Info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                        |
| `credit_ph`    | TrCreditPhase  | No       | Contains information about credit phase of a transaction execution. [More Info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                         |
| `compute_ph`   | TrComputePhase | Yes      | Contains information about compute phase of a transaction execution. [More Info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                        |
| `action`       | TrActionPhase  | No       | Contains information about action phase of a transaction execution. [More Info](/v3/documentation/tvm/tvm-overview#transactions-and-phases). Stored in a reference. |
| `aborted`      | Bool           | Yes      | Indicates whether the transaction execution was aborted.                                                                                                                                  |
| `bounce`       | TrBouncePhase  | No       | Contains information about bounce phase of a transaction execution. [More Info](/v3/documentation/smart-contracts/message-management/non-bounceable-messages)                           |
| `destroyed`    | Bool           | Yes      | Indicates whether the account was destroyed during the execution.                                                                                                                         |

## Storage

Transactions of this type can be inserted by validators at their discretion. They do not process any inbound messages and do not invoke any code. Their only effect is to collect storage payments from an account, affecting its storage statistics and balance. If the resulting _Toncoin_ balance of the account drops below a certain amount, the account may be frozen, and its code and data replaced by their combined hash.

```tlb
trans_storage$0001 storage_ph:TrStoragePhase
    = TransactionDescr;
```

| Field        | Type           | Description                                                                                                                                                        |
| ------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `storage_ph` | TrStoragePhase | Contains information about storage phase of a transaction execution. [More Info](/v3/documentation/tvm/tvm-overview#transactions-and-phases) |

## Tick-tock

`Tick` and `Tock` transactions are reserved for special system smart contracts that are required to be automatically invoked in each block. `Tick` transactions are invoked at the beginning of each masterchain block, and `Tock` transactions are invoked at the end.

```tlb
trans_tick_tock$001 is_tock:Bool storage_ph:TrStoragePhase
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool = TransactionDescr;
```

| Field        | Type           | Required | Description                                                                                                                                                                               |
| ------------ | -------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `is_tock`    | Bool           | Yes      | A flag indicating the type of transaction. Used to separate `Tick` and `Tock` transactions                                                                                                |
| `storage_ph` | TrStoragePhase | Yes      | Contains information about storage phase of a transaction execution. [More Info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                        |
| `compute_ph` | TrComputePhase | Yes      | Contains information about compute phase of a transaction execution. [More Info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                        |
| `action`     | TrActionPhase  | No       | Contains information about action phase of a transaction execution. [More Info](/v3/documentation/tvm/tvm-overview#transactions-and-phases). Stored in a reference. |
| `aborted`    | Bool           | Yes      | Indicates whether the transaction execution was aborted.                                                                                                                                  |
| `destroyed`  | Bool           | Yes      | Indicates whether the account was destroyed during the execution.                                                                                                                         |

## Split Prepare

:::note
This type of transaction is currently not in use. Information about this process is limited.
:::

Split transactions are initiated on large smart contracts that need to be divided under high load. The contract should support this transaction type and manage the splitting process to balance the load.

Split Prepare transactions are initiated when a smart contract needs to be split. The smart contract should generate the state for a new instance of itself to be deployed.

```tlb
trans_split_prepare$0100 split_info:SplitMergeInfo
    storage_ph:(Maybe TrStoragePhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool
    = TransactionDescr;
```

| Field        | Type           | Required | Description                                                                                                                                                                               |
| ------------ | -------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `split_info` | SplitMergeInfo | Yes      | Information about split process.                                                                                                                                                          |
| `storage_ph` | TrStoragePhase | No       | Contains information about storage phase of a transaction execution. [More Info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                        |
| `compute_ph` | TrComputePhase | Yes      | Contains information about compute phase of a transaction execution. [More Info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                        |
| `action`     | TrActionPhase  | No       | Contains information about action phase of a transaction execution. [More Info](/v3/documentation/tvm/tvm-overview#transactions-and-phases). Stored in a reference. |
| `aborted`    | Bool           | Yes      | Indicates whether the transaction execution was aborted.                                                                                                                                  |
| `destroyed`  | Bool           | Yes      | Indicates whether the account was destroyed during the execution.                                                                                                                         |

## Split install

:::note
This type of transaction is currently not in use. Information about this process is limited.
:::

Split Install transactions are used for creating new instances of large smart contracts. The state for the new smart contract is generated by a [Split Prepare](#split-prepare) transaction.

```tlb
trans_split_install$0101 split_info:SplitMergeInfo
    prepare_transaction:^Transaction
    installed:Bool = TransactionDescr;
```

| Field                 | Type                        | Description                                                                                                  |
| --------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `split_info`          | SplitMergeInfo              | Information about split process.                                                                             |
| `prepare_transaction` | [Transaction](#transaction) | Information about the [transaction prepared](#split-prepare) for the split operation. Stored in a reference. |
| `installed`           | Bool                        | Indicates whether the transaction was installed.                                                             |

## Merge prepare

:::note
This type of transaction is currently not in use. Information about this process is limited.
:::

Merge transactions are initiated on large smart contracts that need to recombine after being split due to high load. The contract should support this transaction type and manage the merging process to balance the load.

Merge Prepare transactions are initiated when two smart contracts need to be merged. The smart contract should generate a message for another instance of itself to facilitate the merge.

```tlb
trans_merge_prepare$0110 split_info:SplitMergeInfo
    storage_ph:TrStoragePhase aborted:Bool
    = TransactionDescr;
```

| Field        | Type           | Description                                                                                                                                                        |
| ------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `split_info` | SplitMergeInfo | Information about merge process.                                                                                                                                   |
| `storage_ph` | TrStoragePhase | Contains information about storage phase of a transaction execution. [More Info](/v3/documentation/tvm/tvm-overview#transactions-and-phases) |
| `aborted`    | Bool           | Indicates whether the transaction execution was aborted.                                                                                                           |

## Merge install

:::note
This type of transaction is currently not in use. Information about this process is limited.
:::

Merge Install transactions are used for merging instances of large smart contracts. The special message facilitating the merge is generated by a [Merge Prepare](#merge-prepare) transaction.

```tlb
trans_merge_install$0111 split_info:SplitMergeInfo
    prepare_transaction:^Transaction
    storage_ph:(Maybe TrStoragePhase)
    credit_ph:(Maybe TrCreditPhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool
    = TransactionDescr;
```

| Field                 | Type                        | Required | Description                                                                                                                                                                               |
| --------------------- | --------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `split_info`          | SplitMergeInfo              | Yes      | Information about merge process.                                                                                                                                                          |
| `prepare_transaction` | [Transaction](#transaction) | Yes      | Information about the [transaction prepared](#merge-prepare) for the merge operation. Stored in a reference.                                                                              |
| `storage_ph`          | TrStoragePhase              | No       | Contains information about storage phase of a transaction execution. [More Info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                        |
| `credit_ph`           | TrCreditPhase               | No       | Contains information about credit phase of a transaction execution. [More Info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                         |
| `compute_ph`          | TrComputePhase              | Yes      | Contains information about compute phase of a transaction execution. [More Info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                        |
| `action`              | TrActionPhase               | No       | Contains information about action phase of a transaction execution. [More Info](/v3/documentation/tvm/tvm-overview#transactions-and-phases). Stored in a reference. |
| `aborted`             | Bool                        | Yes      | Indicates whether the transaction execution was aborted.                                                                                                                                  |
| `destroyed`           | Bool                        | Yes      | Indicates whether the account was destroyed during the execution.                                                                                                                         |

## See also

-   Original description of [Transaction layout](/tblkch.pdf#page=75&zoom=100,148,290) from whitepaper
