import Feedback from '@site/src/components/Feedback';

# 交易布局

:::info
为了最大限度地理解这个页面，强烈建议您熟悉[TL-B 语言](/develop/data-formats/cell-boc)。
:::

TON 区块链运作依赖于三个关键部分：账户、消息和交易。本页面描述了交易的结构和布局。 This section outlines the structure and organization of transactions.

交易是一种操作，处理与特定账户相关的进出消息，改变其状态，并可能为验证者生成费用。

## 交易

```tlb
transaction$0111 account_addr:bits256 lt:uint64
    prev_trans_hash:bits256 prev_trans_lt:uint64 now:uint32
    outmsg_cnt:uint15
    orig_status:AccountStatus end_status:AccountStatus
    ^[ in_msg:(Maybe ^(Message Any)) out_msgs:(HashmapE 15 ^(Message Any)) ]
    total_fees:CurrencyCollection state_update:^(HASH_UPDATE Account)
    description:^TransactionDescr = Transaction;
```

| Field             | Type                                                                   | Required | Description                                                                                                                                                                                   |
| ----------------- | ---------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `account_addr`    | bits256                                                                | Yes      | The hash of the address where the transaction was executed. 执行交易的地址的哈希部分。[更多关于地址](https://docs.ton.org/learn/overviews/addresses#address-of-smart-contract)                   |
| `lt`              | uint64                                                                 | Yes      | Represents _Logical time_. [Learn more about logical time](/v3/documentation/smart-contracts/message-management/messages-and-transactions#what-is-a-logical-time)             |
| `prev_trans_hash` | bits256                                                                | Yes      | 该账户上一个交易的哈希。                                                                                                                                                                                  |
| `prev_trans_lt`   | uint64                                                                 | Yes      | 该账户上一个交易的 `lt`。                                                                                                                                                                               |
| `now`             | uint32                                                                 | Yes      | The `now` value set during the transaction execution. It is a UNIX timestamp in seconds.                                                                      |
| `outmsg_cnt`      | uint15                                                                 | Yes      | 执行此交易时创建的输出消息数量。                                                                                                                                                                              |
| `orig_status`     | [AccountStatus](#accountstatus)                                        | Yes      | 执行交易前该账户的状态。                                                                                                                                                                                  |
| `end_status`      | [AccountStatus](#accountstatus)                                        | Yes      | 执行交易后该账户的状态。                                                                                                                                                                                  |
| `in_msg`          | (Message Any)                                       | No       | The incoming message that triggered the transaction execution. Stored as a reference.                                                                         |
| `out_msgs`        | HashmapE 15 ^(Message Any)                          | Yes      | 包含执行此交易时创建的输出消息列表的字典。                                                                                                                                                                         |
| `total_fees`      | [CurrencyCollection](/develop/data-formats/msg-tlb#currencycollection) | Yes      | The total fees collected during the transaction execution, including _TON coin_ and potentially some [extra-currencies](/v3/documentation/dapps/defi/coins#extra-currencies). |
| `state_update`    | [HASH_UPDATE](#hash_update) Account               | Yes      | The `HASH_UPDATE` structure represents the state change. Stored as a reference.                                                                               |
| `description`     | [TransactionDescr](#transactiondescr-types)                            | Yes      | 交易执行过程的详细描述。存储在一个引用中。 Stored as a reference.                                                                                                                                  |

## AccountStatus

```tlb
acc_state_uninit$00 = AccountStatus;
acc_state_frozen$01 = AccountStatus;
acc_state_active$10 = AccountStatus;
acc_state_nonexist$11 = AccountStatus;
```

- `[00]`：账户未初始化
- `[01]`：账户被冻结
- `[10]`：账户活跃
- `[11]`：账户不存在

## HASH_UPDATE

```tlb
update_hashes#72 {X:Type} old_hash:bits256 new_hash:bits256
    = HASH_UPDATE X;
```

| Field      | Type    | Description    |
| ---------- | ------- | -------------- |
| `old_hash` | bits256 | 执行交易前账户状态的哈希值。 |
| `new_hash` | bits256 | 执行交易后账户状态的哈希值。 |

## 交易说明类型

- [Ordinary](#ordinary)
- [Storage](#storage)
- [Tick-tock](#tick-tock)
- [Split prepare](#split-prepare)
- [Split install](#split-install)
- [Merge prepare](#merge-prepare)
- [Merge install](#merge-install)

## Ordinary

这是最常见的事务类型，能满足大多数开发人员的需求。这种类型的事务只有一条传入信息，并可创建多条传出信息。 Transactions of this type have a single incoming message and can generate multiple outgoing messages.

```tlb
trans_ord$0000 credit_first:Bool
    storage_ph:(Maybe TrStoragePhase)
    credit_ph:(Maybe TrCreditPhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool bounce:(Maybe TrBouncePhase)
    destroyed:Bool
    = TransactionDescr;
```

| Field          | Type           | Required | Description                                                                                                                                                                                                                   |
| -------------- | -------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `credit_first` | Bool           | Yes      | A flag related to the `bounce` flag of an incoming message. 与接收到的信息的`bounce`标志相关的标志。`credit_first = !bounce`                                                                                                  |
| `storage_ph`   | TrStoragePhase | No       | Contains information about the storage phase during the transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                        |
| `credit_ph`    | TrCreditPhase  | No       | Contains information about the credit phase during the transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                         |
| `compute_ph`   | TrComputePhase | Yes      | Contains information about the compute phase during the transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                        |
| `action`       | TrActionPhase  | No       | Contains information about the action phase during the transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases). Stored in a reference. |
| `aborted`      | Bool           | Yes      | 表示事务执行是否被中止。                                                                                                                                                                                                                  |
| `bounce`       | TrBouncePhase  | No       | Contains information about the bounce phase during the transaction execution. 包含有关事务执行弹跳阶段的信息。[更多信息](/v3/documentation/smart-contracts/message-management/non-bounceable-messages)                            |
| `destroyed`    | Bool           | Yes      | 表示账户是否在执行过程中被销毁。                                                                                                                                                                                                              |

## Storage

Validators can add transactions of this type as they see fit. They do not handle incoming messages or trigger codes. Their sole purpose is to collect storage fees from an account, impacting its storage statistics and balance. If the resulting _TON coin_ balance of the account falls below a specified threshold, the account may be frozen, and its code and data will be replaced with their combined hash.

```tlb
trans_storage$0001 storage_ph:TrStoragePhase
    = TransactionDescr;
```

| Field        | Type           | Description                                                                                                                                                                 |
| ------------ | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `storage_ph` | TrStoragePhase | Contains information about the storage phase of a transaction execution. 包含有关事务执行信用阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases) |

## Tick-tock

`Tick` and `Tock` transactions are designated for special system smart contracts that must be automatically invoked in every block. `Tick` transactions are executed at the start of each MasterChain block, while `Tock` transactions are initiated at the end.

```tlb
trans_tick_tock$001 is_tock:Bool storage_ph:TrStoragePhase
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool = TransactionDescr;
```

| Field        | Type           | Required | Description                                                                                                                                                                                                               |
| ------------ | -------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `is_tock`    | Bool           | Yes      | 表示交易类型的标志。用于区分 "Tick "和 "Tock "交易                                                                                                                                                                                         |
| `storage_ph` | TrStoragePhase | Yes      | Provides information about the storage phase of the transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                        |
| `compute_ph` | TrComputePhase | Yes      | Provides information about the compute phase of the transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                        |
| `action`     | TrActionPhase  | No       | Provides information about the action phase of the transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases). Stored as a reference. |
| `aborted`    | Bool           | Yes      | 表示事务执行是否被中止。                                                                                                                                                                                                              |
| `destroyed`  | Bool           | Yes      | 表示账户是否在执行过程中被销毁。                                                                                                                                                                                                          |

## Split Prepare

:::note
此类交易目前尚未使用。有关该流程的信息有限。
:::

拆分交易在大型智能合约上启动，需要在高负载情况下进行拆分。合约应支持这种交易类型，并管理分割过程以平衡负载。 The contract must support this transaction type and manage the splitting process to distribute the load effectively.

**Split prepare** transactions are triggered when a smart contract needs to be split. The smart contract should generate the state necessary to create a new instance that will be deployed.

```tlb
trans_split_prepare$0100 split_info:SplitMergeInfo
    storage_ph:(Maybe TrStoragePhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool
    = TransactionDescr;
```

| Field        | Type           | Required | Description                                                                                                                                                                                                               |
| ------------ | -------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `split_info` | SplitMergeInfo | Yes      | 有关拆分过程的信息。                                                                                                                                                                                                                |
| `storage_ph` | TrStoragePhase | No       | Provides details about the storage phase during transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                            |
| `compute_ph` | TrComputePhase | Yes      | Contains details about the compute phase during transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                            |
| `action`     | TrActionPhase  | No       | Provides information about the action phase during transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases). Stored as a reference. |
| `aborted`    | Bool           | Yes      | 表示事务执行是否被中止。                                                                                                                                                                                                              |
| `destroyed`  | Bool           | Yes      | 表示账户是否在执行过程中被销毁。                                                                                                                                                                                                          |

## Split install

:::note
此类交易目前尚未使用。有关该流程的信息有限。
:::

拆分安装事务用于创建大型智能合约的新实例。新智能合约的状态由 [Split Prepare](#split-prepare) 事务生成。 A [split prepare](#split-prepare) transaction generates the state for the new contract.

```tlb
trans_split_install$0101 split_info:SplitMergeInfo
    prepare_transaction:^Transaction
    installed:Bool = TransactionDescr;
```

| Field                 | Type                        | Description                                                                       |
| --------------------- | --------------------------- | --------------------------------------------------------------------------------- |
| `split_info`          | SplitMergeInfo              | 关于拆分过程的信息。                                                                        |
| `prepare_transaction` | [Transaction](#transaction) | 有关拆分操作的 [事务准备](#split-prepare) 的信息。存储在引用中。 Stored as a reference. |
| `installed`           | Bool                        | 表示交易是否已安装。                                                                        |

## Merge prepare

:::note
此类交易目前尚未使用。有关该流程的信息有限。
:::

在需要因高负载而重新组合的大型智能合约上启动合并交易。合约应支持此类型的交易并管理合并过程以平衡负载。 The contract must support this transaction type and handle the merging process to help balance system resources.

**Merge prepare** transactions are initiated when two smart contracts are set to merge. The contract should generate a message to the other instance to initiate and facilitate the merge process.

```tlb
trans_merge_prepare$0110 split_info:SplitMergeInfo
    storage_ph:TrStoragePhase aborted:Bool
    = TransactionDescr;
```

| Field        | Type           | Description                                                                                                                                                        |
| ------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `split_info` | SplitMergeInfo | 有关合并过程的信息。                                                                                                                                                         |
| `storage_ph` | TrStoragePhase | Contains information about the storage phase during transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases) |
| `aborted`    | Bool           | 表示事务执行是否被中止。                                                                                                                                                       |

## Merge install

:::note
此类交易目前尚未使用。有关该流程的信息有限。
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

| Field                 | Type                        | Required | Description                                                                                                                                                                                                           |
| --------------------- | --------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `split_info`          | SplitMergeInfo              | Yes      | 有关合并过程的信息。                                                                                                                                                                                                            |
| `prepare_transaction` | [Transaction](#transaction) | Yes      | 有关合并操作的 [事务准备](#merge-prepare) 的信息。存储在引用中。 Stored as a reference.                                                                                                                                     |
| `storage_ph`          | TrStoragePhase              | No       | Contains information about the storage phase of transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                        |
| `credit_ph`           | TrCreditPhase               | No       | Contains information about the credit phase of transaction execution. 包含有关事务执行信用阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                              |
| `compute_ph`          | TrComputePhase              | Yes      | Contains information about the compute phase of transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                        |
| `action`              | TrActionPhase               | No       | Contains information about the action phase of transaction execution. [More info](/v3/documentation/tvm/tvm-overview#transactions-and-phases). Stored as a reference. |
| `aborted`             | Bool                        | Yes      | 表示事务执行是否被中止。                                                                                                                                                                                                          |
| `destroyed`           | Bool                        | Yes      | 表示账户是否在执行过程中被销毁。                                                                                                                                                                                                      |

## 另见

- 白皮书中 交易布局 的原始描述

<Feedback />

