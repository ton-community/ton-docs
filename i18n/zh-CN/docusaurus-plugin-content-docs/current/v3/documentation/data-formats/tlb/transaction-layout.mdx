# 交易布局

:::info
为了最大限度地理解这个页面，强烈建议您熟悉[TL-B 语言](/develop/data-formats/cell-boc)。
:::

TON 区块链运作依赖于三个关键部分：账户、消息和交易。本页面描述了交易的结构和布局。

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

| 字段                | 类型                                                                     | 必需 | 描述                                                                                                                                                |
| ----------------- | ---------------------------------------------------------------------- | -- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `account_addr`    | bits256                                                                | 是  | 执行交易的地址的哈希部分。[更多关于地址](https://docs.ton.org/learn/overviews/addresses#address-of-smart-contract)                                                   |
| `lt`              | uint64                                                                 | 是  | 代表 *逻辑时间*。[更多关于逻辑时间](https://docs.ton.org/develop/smart-contracts/guidelines/message-delivery-guarantees#what-is-a-logical-time)                  |
| `prev_trans_hash` | bits256                                                                | 是  | 该账户上一个交易的哈希。                                                                                                                                      |
| `prev_trans_lt`   | uint64                                                                 | 是  | 该账户上一个交易的 `lt`。                                                                                                                                   |
| `now`             | uint32                                                                 | 是  | 执行此交易时设置的 `now` 值。它是以秒为单位的Unix时间戳。                                                                                                                |
| `outmsg_cnt`      | uint15                                                                 | 是  | 执行此交易时创建的输出消息数量。                                                                                                                                  |
| `orig_status`     | [AccountStatus](#accountstatus)                                        | 是  | 执行交易前该账户的状态。                                                                                                                                      |
| `end_status`      | [AccountStatus](#accountstatus)                                        | 是  | 执行交易后该账户的状态。                                                                                                                                      |
| `in_msg`          | (Message Any)                                       | 否  | 触发执行交易的输入消息。存储在一个引用中。                                                                                                                             |
| `out_msgs`        | HashmapE 15 ^(Message Any)                          | 是  | 包含执行此交易时创建的输出消息列表的字典。                                                                                                                             |
| `total_fees`      | [CurrencyCollection](/develop/data-formats/msg-tlb#currencycollection) | 是  | 执行此交易时收集的总费用。它包括_Toncoin_值和可能的一些[额外代币](https://docs.ton.org/develop/dapps/defi/coins#extra-currencies)。 |
| `state_update`    | [HASH_UPDATE](#hash_update) Account               | 是  | `HASH_UPDATE` 结构。存储在一个引用中。                                                                                                                        |
| `description`     | [TransactionDescr](#transactiondescr-types)                            | 是  | 交易执行过程的详细描述。存储在一个引用中。                                                                                                                             |

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

这是最常见的事务类型，能满足大多数开发人员的需求。这种类型的事务只有一条传入信息，并可创建多条传出信息。

```tlb
trans_ord$0000 credit_first:Bool
    storage_ph:(Maybe TrStoragePhase)
    credit_ph:(Maybe TrCreditPhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool bounce:(Maybe TrBouncePhase)
    destroyed:Bool
    = TransactionDescr;
```

| Field          | Type           | Required | Description                                                                                          |
| -------------- | -------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `credit_first` | Bool           | Yes      | 与接收到的信息的`bounce`标志相关的标志。`credit_first = !bounce`                                                     |
| `storage_ph`   | TrStoragePhase | No       | 包含有关事务执行的存储阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                  |
| `credit_ph`    | TrCreditPhase  | No       | 包含有关事务执行信用阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                   |
| `compute_ph`   | TrComputePhase | Yes      | 包含有关事务执行的计算阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                  |
| `action`       | TrActionPhase  | No       | 包含有关事务执行的操作阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)。存储在引用中。          |
| `aborted`      | Bool           | Yes      | 表示事务执行是否被中止。                                                                                         |
| `bounce`       | TrBouncePhase  | No       | 包含有关事务执行弹跳阶段的信息。[更多信息](/v3/documentation/smart-contracts/message-management/non-bounceable-messages) |
| `destroyed`    | Bool           | Yes      | 表示账户是否在执行过程中被销毁。                                                                                     |

## Storage

验证程序可自行决定插入这种类型的事务。它们不处理任何入站信息，也不调用任何代码。它们唯一的作用是从账户中收取存储付款，影响账户的存储统计和余额。如果账户的 *Toncoin* 余额低于一定数额，该账户可能会被冻结，其代码和数据会被其组合哈希值所取代。

```tlb
trans_storage$0001 storage_ph:TrStoragePhase
    = TransactionDescr;
```

| Field        | Type           | Description                                                                         |
| ------------ | -------------- | ----------------------------------------------------------------------------------- |
| `storage_ph` | TrStoragePhase | 包含有关事务执行的存储阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases) |

## Tick-tock

Tick "和 "Tock "交易是为特殊系统智能合约保留的，这些合约需要在每个区块中自动调用。Tick "交易在每个主链区块开始时调用，而 "Tock "交易则在结束时调用。

```tlb
trans_tick_tock$001 is_tock:Bool storage_ph:TrStoragePhase
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool = TransactionDescr;
```

| Field        | Type           | Required | Description                                                                                 |
| ------------ | -------------- | -------- | ------------------------------------------------------------------------------------------- |
| `is_tock`    | Bool           | Yes      | 表示交易类型的标志。用于区分 "Tick "和 "Tock "交易                                                           |
| `storage_ph` | TrStoragePhase | Yes      | 包含有关事务执行的存储阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)         |
| `compute_ph` | TrComputePhase | Yes      | 包含有关事务执行的计算阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)         |
| `action`     | TrActionPhase  | No       | 包含有关事务执行的操作阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)。存储在引用中。 |
| `aborted`    | Bool           | Yes      | 表示事务执行是否被中止。                                                                                |
| `destroyed`  | Bool           | Yes      | 表示账户是否在执行过程中被销毁。                                                                            |

## Split Prepare

:::note
此类交易目前尚未使用。有关该流程的信息有限。
:::

拆分交易在大型智能合约上启动，需要在高负载情况下进行拆分。合约应支持这种交易类型，并管理分割过程以平衡负载。

在需要因高负载而拆分的大型智能合约上启动拆分交易。合约应支持此类型的交易并管理拆分过程以平衡负载。

```tlb
trans_split_prepare$0100 split_info:SplitMergeInfo
    storage_ph:(Maybe TrStoragePhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool
    = TransactionDescr;
```

| Field        | Type           | Required | Description                                                                                 |
| ------------ | -------------- | -------- | ------------------------------------------------------------------------------------------- |
| `split_info` | SplitMergeInfo | Yes      | 有关拆分过程的信息。                                                                                  |
| `storage_ph` | TrStoragePhase | No       | 包含有关事务执行的存储阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)         |
| `compute_ph` | TrComputePhase | Yes      | 包含有关事务执行的计算阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)         |
| `action`     | TrActionPhase  | No       | 包含有关事务执行的操作阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)。存储在引用中。 |
| `aborted`    | Bool           | Yes      | 表示事务执行是否被中止。                                                                                |
| `destroyed`  | Bool           | Yes      | 表示账户是否在执行过程中被销毁。                                                                            |

## Split install

:::note
此类交易目前尚未使用。有关该流程的信息有限。
:::

拆分安装事务用于创建大型智能合约的新实例。新智能合约的状态由 [Split Prepare](#split-prepare) 事务生成。

```tlb
trans_split_install$0101 split_info:SplitMergeInfo
    prepare_transaction:^Transaction
    installed:Bool = TransactionDescr;
```

| Field                 | Type                        | Description                                |
| --------------------- | --------------------------- | ------------------------------------------ |
| `split_info`          | SplitMergeInfo              | 关于拆分过程的信息。                                 |
| `prepare_transaction` | [Transaction](#transaction) | 有关拆分操作的 [事务准备](#split-prepare) 的信息。存储在引用中。 |
| `installed`           | Bool                        | 表示交易是否已安装。                                 |

## Merge prepare

:::note
此类交易目前尚未使用。有关该流程的信息有限。
:::

合并交易是在大型智能合约上启动的，这些合约在因负载过高而被拆分后需要重新合并。合约应支持这种交易类型，并管理合并过程以平衡负载。

在需要因高负载而重新组合的大型智能合约上启动合并交易。合约应支持此类型的交易并管理合并过程以平衡负载。

```tlb
trans_merge_prepare$0110 split_info:SplitMergeInfo
    storage_ph:TrStoragePhase aborted:Bool
    = TransactionDescr;
```

| Field        | Type           | Description                                                                         |
| ------------ | -------------- | ----------------------------------------------------------------------------------- |
| `split_info` | SplitMergeInfo | 有关合并过程的信息。                                                                          |
| `storage_ph` | TrStoragePhase | 包含有关事务执行的存储阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases) |
| `aborted`    | Bool           | 表示事务执行是否被中止。                                                                        |

## Merge install

:::note
此类交易目前尚未使用。有关该流程的信息有限。
:::

合并安装事务用于合并大型智能合约的实例。[合并准备](#merge-prepare) 事务会生成促进合并的特殊信息。

```tlb
trans_merge_install$0111 split_info:SplitMergeInfo
    prepare_transaction:^Transaction
    storage_ph:(Maybe TrStoragePhase)
    credit_ph:(Maybe TrCreditPhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool
    = TransactionDescr;
```

| Field                 | Type                        | Required | Description                                                                                 |
| --------------------- | --------------------------- | -------- | ------------------------------------------------------------------------------------------- |
| `split_info`          | SplitMergeInfo              | Yes      | 有关合并过程的信息。                                                                                  |
| `prepare_transaction` | [Transaction](#transaction) | Yes      | 有关合并操作的 [事务准备](#merge-prepare) 的信息。存储在引用中。                                                  |
| `storage_ph`          | TrStoragePhase              | No       | 包含有关事务执行的存储阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)         |
| `credit_ph`           | TrCreditPhase               | No       | 包含有关事务执行信用阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)          |
| `compute_ph`          | TrComputePhase              | Yes      | 包含有关事务执行的计算阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)         |
| `action`              | TrActionPhase               | No       | 包含有关事务执行的操作阶段的信息。[更多信息](/v3/documentation/tvm/tvm-overview#transactions-and-phases)。存储在引用中。 |
| `aborted`             | Bool                        | Yes      | 表示事务执行是否被中止。                                                                                |
| `destroyed`           | Bool                        | Yes      | 表示账户是否在执行过程中被销毁。                                                                            |

## 另见

- 白皮书中 [交易布局](/tblkch.pdf#page=75\&zoom=100,148,290) 的原始描述
