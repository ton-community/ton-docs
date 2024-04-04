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

| 字段                | 类型                                                                   | 必需   | 描述                                                                                                                                                                                                              |
| ------------------- | ---------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `account_addr`      | bits256                                                                | 是     | 执行交易的地址的哈希部分。[更多关于地址](https://docs.ton.org/learn/overviews/addresses#address-of-smart-contract)                                                                                             |
| `lt`                | uint64                                                                 | 是     | 代表 _逻辑时间_。[更多关于逻辑时间](https://docs.ton.org/develop/smart-contracts/guidelines/message-delivery-guarantees#what-is-a-logical-time)                                                                |
| `prev_trans_hash`   | bits256                                                                | 是     | 该账户上一个交易的哈希。                                                                                                                                                                                        |
| `prev_trans_lt`     | uint64                                                                 | 是     | 该账户上一个交易的 `lt`。                                                                                                                                                                                       |
| `now`               | uint32                                                                 | 是     | 执行此交易时设置的 `now` 值。它是以秒为单位的Unix时间戳。                                                                                                                                                      |
| `outmsg_cnt`        | uint15                                                                 | 是     | 执行此交易时创建的输出消息数量。                                                                                                                                                                                |
| `orig_status`       | [AccountStatus](#accountstatus)                                        | 是     | 执行交易前该账户的状态。                                                                                                                                                                                        |
| `end_status`        | [AccountStatus](#accountstatus)                                        | 是     | 执行交易后该账户的状态。                                                                                                                                                                                        |
| `in_msg`            | (Message Any)                                                          | 否     | 触发执行交易的输入消息。存储在一个引用中。                                                                                                                                                                     |
| `out_msgs`          | HashmapE 15 ^(Message Any)                                             | 是     | 包含执行此交易时创建的输出消息列表的字典。                                                                                                                                                                      |
| `total_fees`        | [CurrencyCollection](/develop/data-formats/msg-tlb#currencycollection) | 是     | 执行此交易时收集的总费用。它包括_Toncoin_值和可能的一些[额外代币](https://docs.ton.org/develop/dapps/defi/coins#extra-currencies)。                                                                           |
| `state_update`      | [HASH_UPDATE](#hash_update) Account                                    | 是     | `HASH_UPDATE` 结构。存储在一个引用中。                                                                                                                                                                          |
| `description`       | [TransactionDescr](#transactiondescr-types)                            | 是     | 交易执行过程的详细描述。存储在一个引用中。                                                                                                                                                                      |

## AccountStatus

```tlb
acc_state_uninit$00 = AccountStatus;
acc_state_frozen$01 = AccountStatus;
acc_state_active$10 = AccountStatus;
acc_state_nonexist$11 = AccountStatus;
```

-   `[00]`：账户未初始化
-   `[01]`：账户被冻结
-   `[10]`：账户活跃
-   `[11]`：账户不存在

## HASH_UPDATE

```tlb
update_hashes#72 {X:Type} old_hash:bits256 new_hash:bits256
    = HASH_UPDATE X;
```

| 字段        | 类型    | 描述                                              |
| ----------- | -------

 | ------------------------------------------------- |
| `old_hash`  | bits256 | 执行交易前账户状态的哈希。                        |
| `new_hash`  | bits256 | 执行交易后账户状态的哈希。                        |

## TransactionDescr 类型

-   [普通](#ordinary)
-   [存储](#storage)
-   [Tick-tock](#tick-tock)
-   [拆分准备](#split-prepare)
-   [拆分安装](#split-install)
-   [合并准备](#merge-prepare)
-   [合并安装](#merge-install)

## 普通

这是最常见的交易类型，满足大多数开发人员的需求。此类交易恰好有一个输入消息，并且可以创建多个输出消息。

```tlb
trans_ord$0000 credit_first:Bool
    storage_ph:(Maybe TrStoragePhase)
    credit_ph:(Maybe TrCreditPhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool bounce:(Maybe TrBouncePhase)
    destroyed:Bool
    = TransactionDescr;
```

| 字段            | 类型           | 必需   | 描述                                                                                                                                                                                 |
| --------------- | -------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `credit_first`  | Bool           | 是     | 与输入消息的 `bounce` 标志相关的标志位。`credit_first = !bounce`                                                                                                                      |
| `storage_ph`    | TrStoragePhase | 否     | 包含有关交易执行的 Storage Phase 的信息。[更多信息](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases)                                                      |
| `credit_ph`     | TrCreditPhase  | 否     | 包含有关交易执行的 Credit Phase 的信息。[更多信息](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases)                                                       |
| `compute_ph`    | TrComputePhase | 是     | 包含有关交易执行的 Compute Phase 的信息。[更多信息](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases)                                                       |
| `action`        | TrActionPhase  | 否     | 包含有关交易执行的 Action Phase 的信息。[更多信息](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases)。存储在一个引用中。                                 |
| `aborted`       | Bool           | 是     | 表明交易执行是否被中止。                                                                                                                                                             |
| `bounce`        | TrBouncePhase  | 否     | 包含有关交易执行的 Bounce Phase 的信息。[更多信息](https://docs.ton.org/develop/smart-contracts/guidelines/non-bouncable-messages)                                                         |
| `destroyed`     | Bool           | 是     | 表明在执行期间账户是否被销毁。                                                                                                                                                       |

## 存储

此类交易可由验证者酌情插入。它们不处理任何输入消息，也不调用任何代码。它们唯一的效果是从一个账户收集存储支付，影响其存储统计和余额。如果账户的结果 _Toncoin_ 余额低于某个数量，账户可能被冻结，其代码和数据被它们的组合哈希所替代。

```tlb
trans_storage$0001 storage_ph:TrStoragePhase
    = TransactionDescr;
```

| 字段          | 类型           | 描述                                                                                                                                                        |
| ------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `storage_ph`  | TrStoragePhase | 包含有关交易执行的存储阶段的信息。[更多信息](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases)                             |

## Tick-tock

`Tick` 和 `Tock` 交易保留给特殊的系统智能合约，这些合约需要在每个区块中自动调用。`Tick` 交易在每个主链区块的开始时调用，而 `Tock` 交易在结束时调用。

```tlb
trans_tick_tock$001 is_tock:Bool storage_ph:TrStoragePhase
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool = TransactionDescr;
```

| 字段          | 类型           | 必需   | 描述                                                                                                                                                                                 |
| ------------- | -------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `is_tock`     | Bool           | 是     | 表明交易类型的标志。用于区分 `Tick` 和 `Tock` 交易                                                                                                                                  |
| `storage_ph`  | TrStoragePhase | 是     | 包含有关交易执行的 Storage Phase 的信息。[更多信息](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases)                                                      |
| `compute_ph`  | TrComputePhase | 是     | 包含有关交易执行的 Compute Phase 的信息。[更多信息](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases)                                                      |
| `action`      | TrActionPhase  | 否     | 包含有关交易执行的 Action Phase 的信息。[更多信息](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases)。存储在一个引用中。                                 |
| `aborted`     | Bool           | 是     | 表明交易执行是否被中止。                                                                                                                                                             |
| `destroyed`   | Bool           | 是     | 表明在执行期间账户是否被销毁。                                                                                                                                                       |

## 拆分准备

:::note
目前此类型的交易未被使用。关于此过程的信息有限。
:::

在需要因高负载而拆分的大型智能合约上启动拆分交易。合约应支持此类型的交易并管理拆分过程以平衡负载。

当需要拆分智能合约时，将启动拆分准备交易。智能合约应生成一个新实例的状态，以便部署。

```tlb
trans_split_prepare$0100 split_info:SplitMergeInfo
    storage_ph:(Maybe TrStoragePhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool
    = TransactionDescr;
```

| 字段          | 类型           | 必需   | 描述                                                                                                                                                                                   |
| ------------- | -------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `split_info`  | SplitMergeInfo | 是     | 拆分过程的信息。                                                                                                                                                                      |
| `storage_ph`  | TrStoragePhase | 否     | 包含有关交易执行的 Storage Phase 的信息。[更多信息](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases)                                                         |
| `compute_ph`  | TrComputePhase | 是     | 包含有关交易执行的 Compute Phase 的信息。[更多信息](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases)                                                         |
| `action`      | TrActionPhase  | 否     | 包含有关交易执行的 Action Phase 的信息。[更多信息](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases)。存储在一个引用中。                                    |
| `aborted`     | Bool           | 是     | 表明交易执行是否被中止。                                                                                                                                                               |
| `destroyed`   | Bool           | 是     | 表明在执行期间账户是否被销毁。                                                                                                                                                         |

## 拆分安装

:::note
目前此类型的交易未被使用。关于此过程的信息有限。
:::

拆分安装交易用于创建大型智能合约的新实例。新智能合约的状态由[拆分准备](#split-prepare)交易生成。

```tlb
trans_split_install$0101 split_info:SplitMergeInfo
    prepare_transaction:^Transaction
    installed:Bool = TransactionDescr;
```

| 字段                  | 类型                        | 描述                                                                                                |
| --------------------- | --------------------------- | --------------------------------------------------------------------------------------------------- |
| `split_info`          | SplitMergeInfo              | 拆分过程的信息。                                                                                   |
| `prepare_transaction` | [Transaction](#transaction) | 有关为拆分操作准备的[交易](#split-prepare)的信息。存储在一个引用中。                               |
| `installed`           | Bool                        | 表明交易是否已安装。                                                                                |

## 合并准备

:::note
目前此类型的交易未被使用。关于此过程的信息有限。
:::

在需要因高负载而重新组合的大型智能合约上启动合并交易。合约应支持此类型的交易并管理合并过程以平衡负载。

当两个智能合约需要合并时，将启动合并准备交易。智能合约应生成一个信息，以便与另一个实例合并。

```tlb
trans_merge_prepare$0110 split_info:SplitMergeInfo
    storage_ph:TrStoragePhase aborted:Bool
    = TransactionDescr;
```

| 字段          | 类型           | 描述                                                                                                                                                        |
| ------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `split_info`  | SplitMergeInfo | 合并过程的信息。                                                                                                                                           |
| `storage_ph`  | TrStoragePhase | 包含有关交易执行的 Storage Phase 的信息。[更多信息](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases)                            

 |
| `aborted`     | Bool           | 表明交易执行是否被中止。                                                                                                                                   |

## 合并安装

:::note
目前此类型的交易未被使用。关于此过程的信息有限。
:::

合并安装交易用于合并大型智能合约的实例。促进合并的特殊信息由[合并准备](#merge-prepare)交易生成。

```tlb
trans_merge_install$0111 split_info:SplitMergeInfo
    prepare_transaction:^Transaction
    storage_ph:(Maybe TrStoragePhase)
    credit_ph:(Maybe TrCreditPhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool
    = TransactionDescr;
```

| 字段                  | 类型                        | 必需   | 描述                                                                                                                                                                                   |
| --------------------- | --------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `split_info`          | SplitMergeInfo              | 是     | 合并过程的信息。                                                                                                                                                                      |
| `prepare_transaction` | [Transaction](#transaction) | 是     | 有关为合并操作准备的[交易](#merge-prepare)的信息。存储在一个引用中。                                                                                                                  |
| `storage_ph`          | TrStoragePhase              | 否     | 包含有关交易执行的 Storage Phase 的信息。[更多信息](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases)                                                         |
| `credit_ph`           | TrCreditPhase               | 否     | 包含有关交易执行的 Credit Phase 的信息。[更多信息](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases)                                                         |
| `compute_ph`          | TrComputePhase              | 是     | 包含有关交易执行的 Compute Phase 的信息。[更多信息](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases)                                                         |
| `action`              | TrActionPhase               | 否     | 包含有关交易执行的 Action Phase 的信息。[更多信息](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases)。存储在一个引用中。                                    |
| `aborted`             | Bool                        | 是     | 表明交易执行是否被中止。                                                                                                                                                               |
| `destroyed`           | Bool                        | 是     | 表明在执行期间账户是否被销毁。                                                                                                                                                         |

## 参阅

-   原始描述 [交易布局](https://ton.org/docs/tblkch.pdf#page=75&zoom=100,148,290) 来自白皮书
