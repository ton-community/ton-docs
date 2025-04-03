# Расположение блоков

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::info
Чтобы максимально полно понять эту страницу, настоятельно рекомендуется ознакомиться с [языком TL-B](/v3/documentation/data-formats/tlb/cell-boc).
:::

Блок в блокчейне — это запись новых транзакций, которая после завершения добавляется в блокчейн как постоянная и неизменяемая часть этого децентрализованного реестра. Каждый блок содержит такую ​​информацию, как данные транзакции, время и ссылку на предыдущий блок, тем самым образуя цепочку блоков.

Блоки в блокчейне TON обладают довольно сложной структурой из-за общей сложности системы. На этой странице описывается структура и схема этих блоков.

## Блок

Исходная схема TL-B блока выглядит следующим образом:

```tlb
block#11ef55aa global_id:int32
    info:^BlockInfo value_flow:^ValueFlow
    state_update:^(MERKLE_UPDATE ShardState)
    extra:^BlockExtra = Block;
```

Давайте подробнее рассмотрим каждое поле.

## global_id:int32

Идентификатор сети, в которой создан этот блок. `-239` для основной сети и `-3` для тестовой сети.

## info:^BlockInfo

Это поле содержит информацию о блоке, такую ​​как его версия, порядковые номера, идентификаторы и другие флаги.

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

| Поле                            | Тип                                          | Описание                                                                                                                                                              |
| ------------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `version`                       | uint32                                       | Версия структуры блока.                                                                                                                               |
| `not_master`                    | (## 1)                    | Флаг, указывающий, является ли этот блок блоком мастерчейна.                                                                                          |
| `after_merge`                   | (## 1)                    | Флаг, указывающий, был ли этот блок создан сразу после слияния двух шардчейнов, поэтому у него два родительских блока                                                 |
| `before_split`                  | (## 1)                    | Флаг, указывающий, был ли этот блок создан сразу перед разделением его шардчейна                                                                                      |
| `after_split`                   | (## 1)                    | Флаг, указывающий, был ли этот блок создан сразу после разделения его шардчейна                                                                                       |
| `want_split`                    | Bool                                         | Флаг, указывающий, требуется ли разделение шардчейна.                                                                                                 |
| `want_merge`                    | Bool                                         | Флаг, указывающий, требуется ли слияние шардчейна.                                                                                                    |
| `key_block`                     | Bool                                         | Флаг, указывающий, является ли этот блок ключевым блоком.                                                                                             |
| `vert_seqno_incr`               | (## 1)                    | Увеличение вертикального порядкового номера.                                                                                                          |
| `флаги`                         | (## 8)                    | Дополнительные флаги для блока.                                                                                                                       |
| `seq_no`                        | #                                            | Порядковый номер, связанный с блоком.                                                                                                                 |
| `vert_seq_no`                   | #                                            | Вертикальный порядковый номер, связанный с блоком.                                                                                                    |
| `shard`                         | ShardIdent                                   | Идентификатор шарда, к которому принадлежит этот блок.                                                                                                |
| `gen_utime`                     | uint32                                       | Время генерации блока.                                                                                                                                |
| `start_lt`                      | uint64                                       | Начальное логическое время, связанное с блоком.                                                                                                       |
| `end_lt`                        | uint64                                       | Конечное логическое время, связанное с блоком.                                                                                                        |
| `gen_validator_list_hash_short` | uint32                                       | Короткий хэш, связанный со списком валидаторов на момент генерации этого блока.                                                                       |
| `gen_catchain_seqno`            | uint32                                       | [Catchain](/catchain.pdf) порядковый номер, связанный с этим блоком.                                                                                  |
| `min_ref_mc_seqno`              | uint32                                       | Минимальный порядковый номер указанного блока мастерчейна.                                                                                            |
| `prev_key_block_seqno`          | uint32                                       | Порядковый номер предыдущего ключевого блока.                                                                                                         |
| `gen_software`                  | GlobalVersion                                | Версия программного обеспечения, сгенерировавшего блок. Представлено только в том случае, если первый бит `version` установлен в `1`. |
| `master_ref`                    | BlkMasterInfo                                | Ссылка на главный блок, если блок не является главным. Сохраняется в ссылочном блоке.                                                 |
| `prev_ref`                      | BlkPrevInfo after_merge | Ссылка на предыдущий блок. Сохраняется в ссылочном блоке.                                                                             |
| `prev_vert_ref`                 | BlkPrevInfo 0                                | Ссылка на предыдущий блок в вертикальной последовательности, если он существует. Сохраняется в ссылочном блоке.                       |

### value_flow:^ValueFlow

В этом поле отображается поток валюты внутри блока, включая собранные комиссии и другие транзакции с валютой.

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

| Поле             | Тип                                                                                 | Описание                                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `from_prev_blk`  | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Представляет поток валют из предыдущего блока.                                                 |
| `to_next_blk`    | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Представляет поток валют в следующий блок.                                                     |
| `imported`       | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Представляет собой поток валют, импортируемых в блок.                                          |
| `exported`       | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Представляет поток валют, экспортированных из блока.                                           |
| `fees_collected` | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Общая сумма сборов, собранных в блоке.                                                         |
| `fees_imported`  | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Сумма сборов, импортированных в блок. Ненулевое значение только в мастерчейне. |
| `recovered`      | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Сумма валют, восстановленных в блоке. Ненулевое значение только в мастерчейне. |
| `created`        | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Сумма новых валют, созданных в блоке. Ненулевое значение только в мастерчейне. |
| `minted`         | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Сумма валют, отчеканенных в блоке. Ненулевое значение только в мастерчейне.    |

## state_update:^(MERKLE_UPDATE ShardState)

Это поле представляет собой обновление состояния шарда.

```tlb
!merkle_update#02 {X:Type} old_hash:bits256 new_hash:bits256
    old:^X new:^X = MERKLE_UPDATE X;
```

| Поле       | Тип                       | Описание                                                                    |
| ---------- | ------------------------- | --------------------------------------------------------------------------- |
| `old_hash` | bits256                   | Старый хэш состояния шарда.                                 |
| `new_hash` | bits256                   | Новый хэш состояния шарда.                                  |
| `old`      | [ShardState](#shardstate) | Старое состояние шарда. Сохранено в ссылке. |
| `new`      | [ShardState](#shardstate) | Новое состояние шарда. Сохранено в ссылке.  |

### ShardState

`ShardState` может содержать либо информацию о шарде, либо, в случае если этот шард разделен, информацию о левой и правой разделенных частях.

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

| Поле                   | Тип                                                                                 | Обязательное | Описание                                                                                                                                                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `global_id`            | int32                                                                               | Да           | Идентификатор сети, к которой принадлежит этот шард. `-239` для mainnet и `-3` для testnet.                                                                                                   |
| `shard_id`             | ShardIdent                                                                          | Да           | Идентификатор шарда.                                                                                                                                                                                          |
| `seq_no`               | uint32                                                                              | Да           | Последний порядковый номер, связанный с этим шардом.                                                                                                                                                          |
| `vert_seq_no`          | #                                                                                   | Да           | Последний вертикальный порядковый номер, связанный с этим шардом.                                                                                                                                             |
| `gen_utime`            | uint32                                                                              | Да           | Время генерации, связанное с созданием шарда.                                                                                                                                                                 |
| `gen_lt`               | uint64                                                                              | Да           | Логическое время, связанное с созданием шарда.                                                                                                                                                                |
| `min_ref_mc_seqno`     | uint32                                                                              | Да           | Порядковый номер последнего упомянутого блока мастерчейна.                                                                                                                                                    |
| `out_msg_queue_info`   | OutMsgQueueInfo                                                                     | Да           | Информация об очереди исходящих сообщений этого шарда. Хранится в ссылке.                                                                                                                     |
| `before_split`         | ## 1                                                                                | Да           | Флаг, указывающий, будет ли разделение в следующем блоке этого шарда.                                                                                                                                         |
| `accounts`             | ShardAccounts                                                                       | Да           | Состояние учетных записей в шарде. Хранится в ссылке.                                                                                                                                         |
| `overload_history`     | uint64                                                                              | Да           | История событий перегрузки для шарда. Используется для балансировки нагрузки посредством шардинга.                                                                                            |
| `underload_history`    | uint64                                                                              | Да           | История событий недогрузки для шарда. Используется для балансировки нагрузки посредством шардинга.                                                                                            |
| `total_balance`        | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Да           | Общий баланс для шарда.                                                                                                                                                                                       |
| `total_validator_fees` | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | Да           | Общая сумма сборов валидатора для шарда.                                                                                                                                                                      |
| `libraries`            | HashmapE 256 LibDescr                                                               | Да           | Хэш-карта описаний библиотек в этом шарде. В настоящее время непустая только в мастерчейне.                                                                                                   |
| `master_ref`           | BlkMasterInfo                                                                       | Нет          | Ссылка на информацию о главном блоке.                                                                                                                                                                         |
| `custom`               | McStateExtra                                                                        | Нет          | Дополнительные пользовательские данные для состояния шарда. Это поле присутствует только в мастерчейне и содержит все данные, специфичные для мастерчейна. Хранится в ссылке. |

### ShardState Splitted

| Поле    | Тип                                         | Описание                                                                                  |
| ------- | ------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `left`  | [ShardStateUnsplit](#shardstate-unsplitted) | Состояние левого разделенного шарда. Сохранено в ссылке.  |
| `right` | [ShardStateUnsplit](#shardstate-unsplitted) | Состояние правого разделенного шарда. Сохранено в ссылке. |

## extra:^BlockExtra

Это поле содержит дополнительную информацию о блоке.

```tlb
block_extra in_msg_descr:^InMsgDescr
    out_msg_descr:^OutMsgDescr
    account_blocks:^ShardAccountBlocks
    rand_seed:bits256
    created_by:bits256
    custom:(Maybe ^McBlockExtra) = BlockExtra;
```

| Поле             | Тип                           | Обязательное | Описание                                                                                                                                                                                                            |
| ---------------- | ----------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `in_msg_descr`   | InMsgDescr                    | Да           | Дескриптор входящих сообщений в блоке. Хранится в ссылке.                                                                                                                           |
| `out_msg_descr`  | OutMsgDescr                   | Да           | Дескриптор исходящих сообщений в блоке. Хранится в ссылке.                                                                                                                          |
| `account_blocks` | ShardAccountBlocks            | Да           | Коллекция всех транзакций, обработанных в блоке, вместе со всеми обновлениями состояний учетных записей, назначенных шарду. Хранится в ссылке.                                      |
| `rand_seed`      | bits256                       | Да           | Случайное начальное число для блока.                                                                                                                                                                |
| `created_by`     | bits256                       | Да           | Сущность (обычно открытый ключ валидатора), которая создала блок.                                                                                                                |
| `custom`         | [McBlockExtra](#mcblockextra) | Нет          | Это поле присутствует только в мастерчейне и содержит все данные, специфичные для мастерчейна. Пользовательские дополнительные данные для блока. Хранится в ссылке. |

### McBlockExtra

Это поле содержит дополнительную информацию о блоке мастерчейн.

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

| Поле                  | Тип                             | Обязательное | Описание                                                                                                                                                |
| --------------------- | ------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key_block`           | ## 1                            | Да           | Флаг, указывающий, является ли блок ключевым.                                                                                           |
| `shard_hashes`        | ShardHashes                     | Да           | Хеши последних блоков соответствующих шардчейнов.                                                                                       |
| `shard_fees`          | ShardFees                       | Да           | Общая сумма сборов, собранных со всех шардов в этом блоке.                                                                              |
| `prev_blk_signatures` | HashmapE 16 CryptoSignaturePair | Да           | Подписи предыдущих блоков.                                                                                                              |
| `recover_create_msg`  | InMsg                           | Нет          | Сообщение, относящееся к восстановлению дополнительных валют, если таковые имеются. Хранится в ссылке.                  |
| `mint_msg`            | InMsg                           | Нет          | Сообщение, относящееся к чеканке дополнительных валют, если таковые имеются. Хранится в ссылке.                         |
| `config`              | ConfigParams                    | Нет          | Фактические параметры конфигурации для этого блока. Это поле присутствует только в том случае, если задано `key_block`. |

## См. также

- Оригинальное описание разметки блока из ​​технического документа
