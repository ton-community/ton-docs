# Структура транзакции

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::info
Чтобы максимально полно понять эту страницу, настоятельно рекомендуется ознакомиться с [языком TL-B](/v3/documentation/data-formats/tlb/cell-boc).
:::

Блокчейн TON работает с использованием трех ключевых частей: учетных записей, сообщений и транзакций. На этой странице описывается структура и схема транзакций.

Транзакция — это операция, которая обрабатывает входящие и исходящие сообщения, связанные с конкретным аккаунтом, изменяя его состояние и потенциально генерируя комиссии для валидаторов.

## Транзакция

```tlb
transaction$0111 account_addr:bits256 lt:uint64
    prev_trans_hash:bits256 prev_trans_lt:uint64 now:uint32
    outmsg_cnt:uint15
    orig_status:AccountStatus end_status:AccountStatus
    ^[ in_msg:(Maybe ^(Message Any)) out_msgs:(HashmapE 15 ^(Message Any)) ]
    total_fees:CurrencyCollection state_update:^(HASH_UPDATE Account)
    description:^TransactionDescr = Transaction;
```

| Поле              | Тип                                                                                 | Обязательное | Описание                                                                                                                                                                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `account_addr`    | bits256                                                                             | Да           | Хэш-часть адреса, по которому была выполнена транзакция. [Подробнее об адресах](/v3/documentation/smart-contracts/addresses#address-of-smart-contract)                                                                         |
| `lt`              | uint64                                                                              | Да           | Представляет *Логическое время*. [Подробнее о логическом времени](/v3/documentation/smart-contracts/message-management/messages-and-transactions#what-is-a-logical-time)                                                       |
| `prev_trans_hash` | bits256                                                                             | Да           | Хэш предыдущей транзакции в этой учетной записи.                                                                                                                                                                               |
| `prev_trans_lt`   | uint64                                                                              | Да           | `lt` предыдущей транзакции в этой учетной записи.                                                                                                                                                                              |
| `now`             | uint32                                                                              | Да           | Значение `now`, которое было установлено при выполнении этой транзакции. Это временная метка Unix в секундах.                                                                                                  |
| `outmsg_cnt`      | uint15                                                                              | Да           | Количество исходящих сообщений, созданных при выполнении этой транзакции.                                                                                                                                                      |
| `orig_status`     | [AccountStatus](#accountstatus)                                                     | Да           | Состояние этой учетной записи до выполнения транзакции.                                                                                                                                                                        |
| `end_status`      | [AccountStatus](#accountstatus)                                                     | Да           | Состояние этого аккаунта после выполнения транзакции.                                                                                                                                                                          |
| `in_msg`          | (Любое сообщение)                                                | Нет          | Входящее сообщение, которое инициировало выполнение транзакции. Хранится в ссылке.                                                                                                                             |
| `out_msgs`        | HashmapE 15 ^(Любое сообщение)                                   | Да           | Словарь, содержащий список исходящих сообщений, которые были созданы при выполнении этой транзакции.                                                                                                                           |
| `total_fees`      | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Да           | Общая сумма сборов, которые были собраны при выполнении этой транзакции. Она состоит из значения *Toncoin* и, возможно, некоторых [дополнительных валют](/v3/documentation/dapps/defi/coins#extra-currencies). |
| `state_update`    | [HASH_UPDATE](#hash_update) Аккаунт                            | Да           | Структура `HASH_UPDATE`. Хранится в ссылке.                                                                                                                                                                    |
| `description`     | [TransactionDescr](#transactiondescr-types)                                         | Да           | Подробное описание процесса выполнения транзакции. Хранится в ссылке.                                                                                                                                          |

## AccountStatus

```tlb
acc_state_uninit$00 = AccountStatus;
acc_state_frozen$01 = AccountStatus;
acc_state_active$10 = AccountStatus;
acc_state_nonexist$11 = AccountStatus;
```

- `[00]`: Аккаунт не инициализирован
- `[01]`: Аккаунт заморожен
- `[10]`: Аккаунт активен
- `[11]`: Аккаунт не существует

## HASH_UPDATE

```tlb
update_hashes#72 {X:Type} old_hash:bits256 new_hash:bits256
    = HASH_UPDATE X;
```

| Поле       | Тип     | Описание                                                            |
| ---------- | ------- | ------------------------------------------------------------------- |
| `old_hash` | bits256 | Хэш состояния аккаунта до выполнения транзакции.    |
| `new_hash` | bits256 | Хэш состояния аккаунта после выполнения транзакции. |

## Типы TransactionDescr

- [Ordinary](#ordinary)
- [Storage](#storage)
- [Tick-tock](#tick-tock)
- [Split prepare](#split-prepare)
- [Split install](#split-install)
- [Merge prepare](#merge-prepare)
- [Merge install](#merge-install)

## Обычный

Это наиболее распространенный тип транзакции, и он удовлетворяет потребности большинства разработчиков. Транзакции этого типа имеют ровно одно входящее сообщение и могут создавать несколько исходящих сообщений.

```tlb
trans_ord$0000 credit_first:Bool
    storage_ph:(Maybe TrStoragePhase)
    credit_ph:(Maybe TrCreditPhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool bounce:(Maybe TrBouncePhase)
    destroyed:Bool
    = TransactionDescr;
```

| Поле           | Тип            | Обязательное | Описание                                                                                                                                                                                                   |
| -------------- | -------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `credit_first` | Bool           | Да           | Флаг, который соответствует флагу `bounce` входящего сообщения. `credit_first = !bounce`                                                                                                   |
| `storage_ph`   | TrStoragePhase | Нет          | Содержит информацию о фазе хранения при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                     |
| `credit_ph`    | TrCreditPhase  | Нет          | Содержит информацию о фазе кредита при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                      |
| `compute_ph`   | TrComputePhase | Да           | Содержит информацию о фазе вычисления при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                   |
| `action`       | TrActionPhase  | Нет          | Содержит информацию о фазе действия при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases). Хранится в ссылке. |
| `aborted`      | Bool           | Да           | Указывает, было ли прервано выполнение транзакции.                                                                                                                                         |
| `bounce`       | TrBouncePhase  | Нет          | Содержит информацию о фазе отказа при выполнении транзакции. [Подробнее](/v3/documentation/smart-contracts/message-management/non-bounceable-messages)                                     |
| `destroyed`    | Bool           | Да           | Указывает, была ли уничтожена учетная запись во время выполнения.                                                                                                                          |

## Storage

Транзакции этого типа могут быть введены валидаторами по их усмотрению. Они не обрабатывают входящие сообщения и не вызывают код. Их единственным эффектом является сбор комиссий за хранение с аккаунта, что влияет на статистику и баланс хранения. Если итоговый баланс *Toncoin* счета опустится ниже определенной суммы, аккаунт может быть заморожен, а его код и данные заменены их объединенным хешем.

```tlb
trans_storage$0001 storage_ph:TrStoragePhase
    = TransactionDescr;
```

| Поле         | Тип            | Описание                                                                                                                                               |
| ------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `storage_ph` | TrStoragePhase | Содержит информацию о фазе хранения при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases) |

## Tick-tock

Транзакции `Tick` и `Tock` зарезервированы для специальных системных смарт-контрактов, которые должны автоматически вызываться в каждом блоке. Транзакции `Tick` вызываются в начале каждого блока мастерчейна, а транзакции `Tock` вызываются в конце.

```tlb
trans_tick_tock$001 is_tock:Bool storage_ph:TrStoragePhase
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool = TransactionDescr;
```

| Поле         | Тип            | Обязательное | Описание                                                                                                                                                                                                   |
| ------------ | -------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `is_tock`    | Bool           | Да           | Флаг, указывающий тип транзакции. Используется для разделения транзакций `Tick` и `Tock`                                                                                                   |
| `storage_ph` | TrStoragePhase | Да           | Содержит информацию о фазе хранения при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                     |
| `compute_ph` | TrComputePhase | Да           | Содержит информацию о фазе вычисления при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                   |
| `action`     | TrActionPhase  | Нет          | Содержит информацию о фазе действия при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases). Хранится в ссылке. |
| `aborted`    | Bool           | Да           | Указывает, было ли прервано выполнение транзакции.                                                                                                                                         |
| `destroyed`  | Bool           | Да           | Указывает, была ли уничтожена учетная запись во время выполнения.                                                                                                                          |

## Split Prepare

:::note
Этот тип транзакции в настоящее время не используется. Информация об этом процессе не доступна.
:::

Транзакции Split инициируются в больших смарт-контрактах, которые необходимо разделить при высокой нагрузке. Контракт должен поддерживать этот тип транзакции и управлять процессом разделения для балансировки нагрузки.

Транзакции Split Prepare инициируются, когда смарт-контракт необходимо разделить. Смарт-контракт должен генерировать состояние для нового экземпляра самого себя при развертывании.

```tlb
trans_split_prepare$0100 split_info:SplitMergeInfo
    storage_ph:(Maybe TrStoragePhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool
    = TransactionDescr;
```

| Поле         | Тип            | Обязательное | Описание                                                                                                                                                                                                    |
| ------------ | -------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `split_info` | SplitMergeInfo | Да           | Информация о процессе разделения.                                                                                                                                                           |
| `storage_ph` | TrStoragePhase | Нет          | Содержит информацию о фазе хранения при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                      |
| `compute_ph` | TrComputePhase | Да           | Содержит информацию о фазе вычисления при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                    |
| `action`     | TrActionPhase  | Нет          | Содержит информацию о фазе действия при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases). Сохранено в ссылке. |
| `aborted`    | Bool           | Да           | Указывает, было ли прервано выполнение транзакции.                                                                                                                                          |
| `destroyed`  | Bool           | Да           | Указывает, была ли уничтожена учетная запись во время выполнения.                                                                                                                           |

## Split install

:::note
Этот тип транзакции в настоящее время не используется. Информация об этом процессе не доступна.
:::

Транзакции Split Install используются для создания новых экземпляров больших смарт-контрактов. Состояние для нового смарт-контракта генерируется транзакцией [Split Prepare](#split-prepare).

```tlb
trans_split_install$0101 split_info:SplitMergeInfo
    prepare_transaction:^Transaction
    installed:Bool = TransactionDescr;
```

| Поле                  | Тип                         | Описание                                                                                                                                 |
| --------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `split_info`          | SplitMergeInfo              | Информация о процессе разделения.                                                                                        |
| `prepare_transaction` | [Transaction](#transaction) | Информация о [транзакции, подготовленной](#split-prepare) для операции разделения. Сохраняется в ссылке. |
| `installed`           | Bool                        | Указывает, была ли установлена ​​транзакция.                                                                             |

## Merge prepare

:::note
Этот тип транзакции в настоящее время не используется. Информация об этом процессе не доступна.
:::

Транзакции Merge инициируются в больших смарт-контрактах, которые необходимо объединить после разделения из-за высокой нагрузки. Контракт должен поддерживать этот тип транзакции и управлять процессом слияния для балансировки нагрузки.

Транзакции Merge Prepare инициируются, когда необходимо объединить два смарт-контракта. Смарт-контракт должен генерировать сообщение для другого своего экземпляра, чтобы облегчить слияние.

```tlb
trans_merge_prepare$0110 split_info:SplitMergeInfo
    storage_ph:TrStoragePhase aborted:Bool
    = TransactionDescr;
```

| Поле         | Тип            | Описание                                                                                                                                               |
| ------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `split_info` | SplitMergeInfo | Информация о процессе слияния.                                                                                                         |
| `storage_ph` | TrStoragePhase | Содержит информацию о фазе хранения при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases) |
| `aborted`    | Bool           | Указывает, было ли прервано выполнение транзакции.                                                                                     |

## Merge install

:::note
Этот тип транзакции в настоящее время не используется. Информация об этом процессе не доступна.
:::

Транзакции Merge Install используются для слияния экземпляров больших смарт-контрактов. Специальное сообщение, облегчающее слияние, генерируется транзакцией [Merge Prepare](#merge-prepare).

```tlb
trans_merge_install$0111 split_info:SplitMergeInfo
    prepare_transaction:^Transaction
    storage_ph:(Maybe TrStoragePhase)
    credit_ph:(Maybe TrCreditPhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool
    = TransactionDescr;
```

| Поле                  | Тип                         | Обязательное | Описание                                                                                                                                                                                                   |
| --------------------- | --------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `split_info`          | SplitMergeInfo              | Да           | Информация о процессе слияния.                                                                                                                                                             |
| `prepare_transaction` | [Transaction](#transaction) | Да           | Информация о [транзакции, подготовленной](#merge-prepare) для операции слияния. Хранится в ссылке.                                                                         |
| `storage_ph`          | TrStoragePhase              | Нет          | Содержит информацию о фазе хранения при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                     |
| `credit_ph`           | TrCreditPhase               | Нет          | Содержит информацию о кредитной фазе при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                    |
| `compute_ph`          | TrComputePhase              | Да           | Содержит информацию о фазе вычисления при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases)                                                   |
| `action`              | TrActionPhase               | Нет          | Содержит информацию о фазе действия при выполнении транзакции. [Подробнее](/v3/documentation/tvm/tvm-overview#transactions-and-phases). Хранится в ссылке. |
| `aborted`             | Bool                        | Да           | Указывает, было ли прервано выполнение транзакции.                                                                                                                                         |
| `destroyed`           | Bool                        | Да           | Указывает, была ли уничтожена учетная запись во время выполнения.                                                                                                                          |

## См. также

- Оригинальное описание Структуры транзакции из технического документа
