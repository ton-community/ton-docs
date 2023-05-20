# Transaction layout

```tlb
transaction$0111 account_addr:bits256 lt:uint64
    prev_trans_hash:bits256 prev_trans_lt:uint64 now:uint32
    outmsg_cnt:uint15
    orig_status:AccountStatus end_status:AccountStatus
    ^[ in_msg:(Maybe ^(Message Any)) out_msgs:(HashmapE 15 ^(Message Any)) ]
    total_fees:CurrencyCollection state_update:^(HASH_UPDATE Account)
    description:^TransactionDescr = Transaction;
```

| Field             | Type                                          | Description                                                                                                                                                                                                           |
| ----------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `account_addr`    | bits256                                       | The hash part of the address on which the transaction was executed. [More about addresses](https://docs.ton.org/learn/overviews/addresses#address-of-smart-contract)                                                  |
| `lt`              | uint64                                        | Represents _Logical time_. [More about logical time](https://docs.ton.org/develop/smart-contracts/guidelines/message-delivery-guarantees#what-is-a-logical-time)                                                      |
| `prev_trans_hash` | bits256                                       | The hash of the previous transaction on this account.                                                                                                                                                                 |
| `prev_trans_lt`   | uint64                                        | The `lt` of the previous transaction on this account.                                                                                                                                                                 |
| `now`             | uint32                                        | The `now` value that was set when executing this transaction. It's a Unix timestamp in seconds.                                                                                                                       |
| `outmsg_cnt`      | uint15                                        | The number of outgoing messages created while executing this transaction.                                                                                                                                             |
| `orig_status`     | [AccountStatus](#accountstatus)               | The status of this account before the transaction was executed.                                                                                                                                                       |
| `end_status`      | [AccountStatus](#accountstatus)               | The status of this account after executing the transaction.                                                                                                                                                           |
| `in_msg`          | Maybe ^(Message Any)                          | The incoming message that triggered the execution of the transaction.                                                                                                                                                 |
| `out_msgs`        | HashmapE 15 ^(Message Any)                    | The dictionary that contains the list of outgoing messages that were created while executing this transaction.                                                                                                        |
| `total_fees`      | CurrencyCollection                            | The total amount of fees that were collected while executing this transaction. It consists of a _Toncoin_ value and possibly some [Extra-currencies](https://docs.ton.org/develop/dapps/defi/coins#extra-currencies). |
| `state_update`    | ^([HASH_UPDATE](#hash_update) Account)        | The `HASH_UPDATE` structure                                                                                                                                                                                           |
| `description`     | \^[TransactionDescr](#transactiondescr-types) | A detailed description of the transaction execution process.                                                                                                                                                          |

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

| Field          | Type                 | Description                                                                                                                                                        |
| -------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `credit_first` | Bool                 | A flag that correlates with `bounce` flag of an incoming message. `credit_first = !bounce`                                                                         |
| `storage_ph`   | Maybe TrStoragePhase | Contains information about storage phase of a transaction execution. [More Info](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases) |
| `credit_ph`    | Maybe TrCreditPhase  | Contains information about credit phase of a transaction execution. [More Info](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases)  |
| `compute_ph`   | TrComputePhase       | Contains information about compute phase of a transaction execution. [More Info](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases) |
| `action`       | Maybe ^TrActionPhase | Contains information about action phase of a transaction execution. [More Info](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases)  |
| `aborted`      | Bool                 | Indicates whether the transaction execution was aborted.                                                                                                           |
| `bounce`       | Maybe TrBouncePhase  | Contains information about bounce phase of a transaction execution. [More Info](https://docs.ton.org/develop/smart-contracts/guidelines/non-bouncable-messages)    |
| `destroyed`    | Bool                 | Indicates whether the account was destroyed during the execution.                                                                                                  |

## Storage

Transactions of this type can be inserted by validators at their discretion. They do not process any inbound messages and do not invoke any code. Their only effect is to collect storage payments from an account, affecting its storage statistics and balance. If the resulting _Toncoin_ balance of the account drops below a certain amount, the account may be frozen, and its code and data replaced by their combined hash.

```tlb
trans_storage$0001 storage_ph:TrStoragePhase
    = TransactionDescr;
```

| Field        | Type           | Description                                                                                                                                                        |
| ------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `storage_ph` | TrStoragePhase | Contains information about storage phase of a transaction execution. [More Info](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases) |

## Tick-tock

`Tick` and `Tock` transactions are reserved for special system smart contracts that are required to be automatically invoked in each block. `Tick` transactions are invoked at the beginning of each masterchain block, and `Tock` transactions are invoked at the end.

```tlb
trans_tick_tock$001 is_tock:Bool storage_ph:TrStoragePhase
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool = TransactionDescr;
```

| Field        | Type                 | Description                                                                                                                                                        |
| ------------ | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `is_tock`    | Bool                 | A flag indicating the type of transaction. Used to separate `Tick` and `Tock` transactions                                                                         |
| `storage_ph` | TrStoragePhase       | Contains information about storage phase of a transaction execution. [More Info](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases) |
| `compute_ph` | TrComputePhase       | Contains information about compute phase of a transaction execution. [More Info](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases) |
| `action`     | Maybe ^TrActionPhase | Contains information about action phase of a transaction execution. [More Info](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases)  |
| `aborted`    | Bool                 | Indicates whether the transaction execution was aborted.                                                                                                           |
| `destroyed`  | Bool                 | Indicates whether the account was destroyed during the execution.                                                                                                  |

## Split prepare

:::warning
This type of transaction is not currently in use.
:::

Split transactions are triggered on large smart contracts that need to split under high load. The contract should support this type of transaction and manage the splitting process to balance the load. More information on this process is currently limited.

```tlb
trans_split_prepare$0100 split_info:SplitMergeInfo
    storage_ph:(Maybe TrStoragePhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool
    = TransactionDescr;
```

| Field        | Type                 | Description                                                                                                                                                        |
| ------------ | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `split_info` | SplitMergeInfo       | Information about split process.                                                                                                                                   |
| `storage_ph` | Maybe TrStoragePhase | Contains information about storage phase of a transaction execution. [More Info](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases) |
| `compute_ph` | TrComputePhase       | Contains information about compute phase of a transaction execution. [More Info](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases) |
| `action`     | Maybe ^TrActionPhase | Contains information about action phase of a transaction execution. [More Info](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases)  |
| `aborted`    | Bool                 | Indicates whether the transaction execution was aborted.                                                                                                           |
| `destroyed`  | Bool                 | Indicates whether the account was destroyed during the execution.                                                                                                  |

## Split install

:::warning
This type of transaction is not currently in use.
:::

Split transactions are triggered on large smart contracts that need to split under high load. The contract should support this type of transaction and manage the splitting process to balance the load. More information on this process is currently limited.

```tlb
trans_split_install$0101 split_info:SplitMergeInfo
    prepare_transaction:^Transaction
    installed:Bool = TransactionDescr;
```

| Field                 | Type           | Description                                                         |
| --------------------- | -------------- | ------------------------------------------------------------------- |
| `split_info`          | SplitMergeInfo | Information about split process.                                    |
| `prepare_transaction` | ^Transaction   | Information about the transaction prepared for the split operation. |
| `installed`           | Bool           | Indicates whether the transaction was installed.                    |

## Merge prepare

:::warning
This type of transaction is not currently in use.
:::

Merge transactions are triggered on large smart contracts that need to merge again after being split due to high load. The contract should support this type of transaction and manage the merging process to balance the load. More information on this process is currently limited.

```tlb
trans_merge_prepare$0110 split_info:SplitMergeInfo
    storage_ph:TrStoragePhase aborted:Bool
    = TransactionDescr;
```

| Field        | Type           | Description                                                                                                                                                        |
| ------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `split_info` | SplitMergeInfo | Information about merge process.                                                                                                                                   |
| `storage_ph` | TrStoragePhase | Contains information about storage phase of a transaction execution. [More Info](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases) |
| `aborted`    | Bool           | Indicates whether the transaction execution was aborted.                                                                                                           |

## Merge install

:::warning
This type of transaction is not currently in use.
:::

Merge transactions are triggered on large smart contracts that need to merge again after being split due to high load. The contract should support this type of transaction and manage the merging process to balance the load. More information on this process is currently limited.

```tlb
trans_merge_install$0111 split_info:SplitMergeInfo
    prepare_transaction:^Transaction
    storage_ph:(Maybe TrStoragePhase)
    credit_ph:(Maybe TrCreditPhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool
    = TransactionDescr;
```

| Field                 | Type                 | Description                                                                                                                                                        |
| --------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `split_info`          | SplitMergeInfo       | Information about merge process.                                                                                                                                   |
| `prepare_transaction` | ^Transaction         | Information about the transaction prepared for the merge operation.                                                                                                |
| `storage_ph`          | Maybe TrStoragePhase | Contains information about storage phase of a transaction execution. [More Info](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases) |
| `credit_ph`           | Maybe TrCreditPhase  | Contains information about credit phase of a transaction execution. [More Info](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases)  |
| `compute_ph`          | TrComputePhase       | Contains information about compute phase of a transaction execution. [More Info](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases) |
| `action`              | Maybe ^TrActionPhase | Contains information about action phase of a transaction execution. [More Info](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases)  |
| `aborted`             | Bool                 | Indicates whether the transaction execution was aborted.                                                                                                           |
| `destroyed`           | Bool                 | Indicates whether the account was destroyed during the execution.                                                                                                  |
