import Feedback from '@site/src/components/Feedback';

# Transaction layout

:::info
It's highly recommended that you familiarize yourself with the [TL-B language](/v3/documentation/data-formats/tlb/cell-boc) to better understand this page.
:::

The TON blockchain functions through three main components: accounts, messages, and transactions. This section outlines the structure and organization of transactions.

A transaction is an action that handles incoming and outgoing messages for a particular account, modifying its state and potentially generating fees for validators.

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

| Field             | Type                                                                   | Required | Description                                                                                                                                                                   |
| ----------------- | ---------------------------------------------------------------------- | -------- |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `account_addr`    | bits256                                                                | Yes      | The hash of the address where the transaction was executed. [Learn more about addresses](/v3/documentation/smart-contracts/addresses#address-of-smart-contract)               |
| `lt`              | uint64                                                                 | Yes      | Represents _Logical time_. [Learn more about logical time](/v3/documentation/smart-contracts/message-management/messages-and-transactions#what-is-a-logical-time)             |
| `prev_trans_hash` | bits256                                                                | Yes      | The hash of the previous transaction for this account.                                                                                                                        |
| `prev_trans_lt`   | uint64                                                                 | Yes      | The `lt` of the previous transaction for this account.                                                                                                                        |
| `now`             | uint32                                                                 | Yes      | The `now`  value set during the transaction execution. It is a UNIX timestamp in seconds.                                                                                     |
| `outmsg_cnt`      | uint15                                                                 | Yes      | The count of outgoing messages generated during the transaction execution.                                                                                                    |
| `orig_status`     | [AccountStatus](#accountstatus)                                        | Yes      | The status of this account before the transaction was executed.                                                                                                               |
| `end_status`      | [AccountStatus](#accountstatus)                                        | Yes      | The status of the account after the transaction was executed.                                                                                                                 |
| `in_msg`          | (Message Any)                                                          | No       | The incoming message that triggered the transaction execution. Stored as a reference.                                                                                         |
| `out_msgs`        | HashmapE 15 ^(Message Any)                                             | Yes      | A dictionary containing the outgoing messages created during the transaction execution.                                                                                       |
| `total_fees`      | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Yes      | The total fees collected during the transaction execution, including _TON coin_ and potentially some [extra-currencies](/v3/documentation/dapps/defi/coins#extra-currencies). |
| `state_update`    | [HASH_UPDATE](#hash_update) Account                                    | Yes      | The `HASH_UPDATE` structure represents the state change. Stored as a reference.                                                                                               |
| `description`     | [TransactionDescr](#transactiondescr-types)                            | Yes      | A detailed description of the transaction execution process. Stored as a reference.                                                                                      |

## AccountStatus

```tlb
acc_state_uninit$00 = AccountStatus;
acc_state_frozen$01 = AccountStatus;
acc_state_active$10 = AccountStatus;
acc_state_nonexist$11 = AccountStatus;
```

-   `[00]`: Account is uninitialized
-   `[01]`: Account is frozen
-   `[10]`: Account is active
-   `[11]`: Account does not exist

## HASH_UPDATE

```tlb
update_hashes#72 {X:Type} old_hash:bits256 new_hash:bits256
    = HASH_UPDATE X;
```

| Field      | Type    | Description                                                            |
|------------|---------|------------------------------------------------------------------------|
| `old_hash` | bits256 | The hash represents the account state before transaction execution.    |
| `new_hash` | bits256 | The hash represents the account state following transaction execution. |

## TransactionDescr types

-   [Ordinary](#ordinary)
-   [Storage](#storage)
-   [Tick-tock](#tick-tock)
-   [Split prepare](#split-prepare)
-   [Split install](#split-install)
-   [Merge prepare](#merge-prepare)
-   [Merge install](#merge-install)

## Ordinary

This is the most common transaction type, meeting most developers' requirements. Transactions of this type have a single incoming message and can generate multiple outgoing messages.

```tlb
trans_ord$0000 credit_first:Bool
    storage_ph:(Maybe TrStoragePhase)
    credit_ph:(Maybe TrCreditPhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool bounce:(Maybe TrBouncePhase)
    destroyed:Bool
    = TransactionDescr;
```

| Field          | Type           | Required | Description                                                                                                                                                         |
| -------------- | -------------- | -------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `credit_first` | Bool           | Yes      | A flag related to the `bounce` flag of an incoming message. `credit_first = !bounce`.                                                                               |
| `storage_ph`   | TrStoragePhase | No       | Contains information about the storage phase during the transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)              |
| `credit_ph`    | TrCreditPhase  | No       | Contains information about the credit phase during the transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)               |
| `compute_ph`   | TrComputePhase | Yes      | Contains information about the compute phase during the transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)              |
| `action`       | TrActionPhase  | No       | Contains information about the action phase during the transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases). Stored in a reference. |
| `aborted`      | Bool           | Yes      | Indicates whether the transaction execution was aborted.                                                                     |
| `bounce`       | TrBouncePhase  | No       | Contains information about the bounce phase during the transaction execution. [More info](/v3/documentation/smart-contracts/message-management/non-bounceable-messages)       |
| `destroyed`    | Bool           | Yes      | Indicates whether the account was destroyed during the execution.                                                                        |

## Storage
Validators can add transactions of this type as they see fit. They do not handle incoming messages or trigger codes. Their sole purpose is to collect storage fees from an account, impacting its storage statistics and balance. If the resulting _TON coin_ balance of the account falls below a specified threshold, the account may be frozen, and its code and data will be replaced with their combined hash.

```tlb
trans_storage$0001 storage_ph:TrStoragePhase
    = TransactionDescr;
```

| Field        | Type           | Description                                                                                                                                      |
| ------------ | -------------- |--------------------------------------------------------------------------------------------------------------------------------------------------|
| `storage_ph` | TrStoragePhase | Contains information about the storage phase of a transaction execution. [More Info](/v3/documentation/tvm/tvm-overview#transactions-and-phases) |

## Tick-tock

`Tick` and `Tock` transactions are designated for special system smart contracts that must be automatically invoked in every block. `Tick` transactions are executed at the start of each MasterChain block, while `Tock` transactions are initiated at the end.

```tlb
trans_tick_tock$001 is_tock:Bool storage_ph:TrStoragePhase
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool = TransactionDescr;
```

| Field        | Type           | Required | Description                                                                                                                                                         |
| ------------ | -------------- | -------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `is_tock`    | Bool           | Yes      | A flag that indicates the type of transaction used to distinguish between `Tick` and `Tock` transactions.                                                           |
| `storage_ph` | TrStoragePhase | Yes      | Provides information about the storage phase of the transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                  |
| `compute_ph` | TrComputePhase | Yes      | Provides information about the compute phase of the transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                        |
| `action`     | TrActionPhase  | No       | Provides information about the action phase of the transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases). Stored as a reference. |
| `aborted`    | Bool           | Yes      | Indicates whether the transaction execution was aborted.                                                                       |
| `destroyed`  | Bool           | Yes      | Indicates whether the account was destroyed during execution.                                                                          |

## Split prepare

:::note
This type of transaction is currently not in use, and details about its implementation are limited.
:::

Split transactions are designed for large smart contracts that must be divided due to high load. The contract must support this transaction type and manage the splitting process to distribute the load effectively.

**Split prepare** transactions are triggered when a smart contract needs to be split. The smart contract should generate the state necessary to create a new instance that will be deployed.


```tlb
trans_split_prepare$0100 split_info:SplitMergeInfo
    storage_ph:(Maybe TrStoragePhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool
    = TransactionDescr;
```

| Field        | Type           | Required | Description                                                                                                                                                               |
| ------------ | -------------- | -------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `split_info` | SplitMergeInfo | Yes      | Contains information about the split process.                                                                                                                             |
| `storage_ph` | TrStoragePhase | No       | Provides details about the storage phase during transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                            |
| `compute_ph` | TrComputePhase | Yes      | CContains details about the compute phase during transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                           |
| `action`     | TrActionPhase  | No       | Provides information about the action phase during transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases). Stored as a reference. |
| `aborted`    | Bool           | Yes      | Indicates whether the transaction execution was aborted.                                                                          |
| `destroyed`  | Bool           | Yes      | Indicates whether the account was destroyed during execution.                                                                                 |

## Split install

:::note
This transaction type is currently unavailable, and available information is limited.
:::

**Split install** transactions are used to deploy new instances of large smart contracts. A [split prepare](#split-prepare) transaction generates the state for the new contract.

```tlb
trans_split_install$0101 split_info:SplitMergeInfo
    prepare_transaction:^Transaction
    installed:Bool = TransactionDescr;
```

| Field                 | Type                        | Description                                                                                                  |
| --------------------- | --------------------------- |--------------------------------------------------------------------------------------------------------------|
| `split_info`          | SplitMergeInfo              | Information about the split process.                                                                         |
| `prepare_transaction` | [Transaction](#transaction) | Information about the [transaction prepared](#split-prepare) for the split operation. Stored as a reference. |
| `installed`           | Bool                        | Indicates whether the transaction was installed.                                                             |

## Merge prepare

:::note
This transaction type is currently unavailable, and available information is limited.
:::

Merge transactions are triggered for large smart contracts that need to recombine after being split under high load. The contract must support this transaction type and handle the merging process to help balance system resources.


**Merge prepare** transactions are initiated when two smart contracts are set to merge. The contract should generate a message to the other instance to initiate and facilitate the merge process.

```tlb
trans_merge_prepare$0110 split_info:SplitMergeInfo
    storage_ph:TrStoragePhase aborted:Bool
    = TransactionDescr;
```

| Field        | Type           | Description                                                                                                                                        |
| ------------ | -------------- |----------------------------------------------------------------------------------------------------------------------------------------------------|
| `split_info` | SplitMergeInfo | Information about the merge process.                                                                                                               |
| `storage_ph` | TrStoragePhase | Contains information about the storage phase during transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases) |
| `aborted`    | Bool           | Indicates whether the transaction execution was aborted.                                                                                           |

## Merge install

:::note
This transaction type is currently unavailable, and available information is limited.
:::

**Merge install** transactions are used to merge instances of large smart contracts. A [merge prepare](#merge-prepare) transaction generates a special message that facilitates the merge.

```tlb
trans_merge_install$0111 split_info:SplitMergeInfo
    prepare_transaction:^Transaction
    storage_ph:(Maybe TrStoragePhase)
    credit_ph:(Maybe TrCreditPhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool
    = TransactionDescr;
```

| Field                 | Type                        | Required | Description                                                                                                                                                           |
| --------------------- | --------------------------- | -------- |-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `split_info`          | SplitMergeInfo              | Yes      | Information about the merge process.                                                                                                                                  |
| `prepare_transaction` | [Transaction](#transaction) | Yes      | Information about the [transaction prepared](#merge-prepare) for the merge operation. Stored as a reference.                                                          |
| `storage_ph`          | TrStoragePhase              | No       | Contains information about the storage phase of transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                        |
| `credit_ph`           | TrCreditPhase               | No       | Contains information about the credit phase of transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                         |
| `compute_ph`          | TrComputePhase              | Yes      | Contains information about the compute phase of transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                        |
| `action`              | TrActionPhase               | No       | Contains information about the action phase of transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases). Stored as a reference. |
| `aborted`             | Bool                        | Yes      | Indicates whether the transaction was aborted during execution.                                                                            |
| `destroyed`           | Bool                        | Yes      | Indicates whether the account was destroyed during execution.                                                                             |

## See also

- The initial explanation of the [transaction layout](/tblkch.pdf#page=75&zoom=100,148,290) from the whitepaper.

<Feedback />

