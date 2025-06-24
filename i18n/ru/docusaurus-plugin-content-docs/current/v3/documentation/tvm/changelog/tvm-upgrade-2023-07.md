import Feedback from '@site/src/components/Feedback';

# Обновление TVM 2023.07

:::tip
Это обновление [запущено](https://t.me/tonblockchain/223) в основной сети с декабря 2023 года.
:::

## c7

**c7** — это регистр, в котором хранится локальная контекстная информация, необходимая для выполнения контракта
(например, время, lt, конфигурации сети и т. д.).

**Changes to `c7` tuple**

**c7** кортеж расширен с 10 до 14 элементов:

- **10**: `cell` с кодом самого смарт-контракта.
- **11**: `[integer, maybe_dict]`: значение ТON входящего сообщения, дополнительные валюты.
- **12**: `integer`, сборы, собранные на этапе хранения.
- **13**: `tuple` с информацией о предыдущих блоках.

**Explanation**

**10** В настоящее время код смарт-контракта представлен на уровне TVM только как исполняемое продолжение
и не может быть преобразован в ячейку. Этот код часто используется для авторизации соседнего контракта
того же типа, например jetton-wallet авторизует jetton-wallet.

На данный момент нам нужно
явно хранить ячейку кода в хранилище, что делает хранилище и init_wrapper более громоздкими, чем они могли бы быть.
Использование **10** для кода совместимо с обновлением Everscale tvm.

**11:** The incoming message value is placed on the stack when the TVM starts. If needed during execution, it must be stored as a global variable or passed as a local variable. At the FunC level, this appears as an additional `msg_value` argument in all functions.

Поместив его в элемент **11**, мы повторим поведение баланса контракта: он представлен как в стеке, так и в c7.

**12:** Currently, the only way to determine storage fees is by:

1. Storing the balance from the previous transaction.
2. Estimating the gas usage in that transaction.
3. Comparing it to the current balance minus the message value.

Между тем, часто требуется учитывать плату за хранение.

**13** В настоящее время нет способа извлечь данные о предыдущих блоках.
Одной из ключевых особенностей TON является то, что каждый структура представляет собой дружественный к доказательству Меркла пакет (дерево) ячеек, более того, TVM также дружественна к ячейкам и доказательсву Меркла. Таким образом, если мы включим информацию о блоках в контекст TVM, станет возможным реализовать множество не требующих доверия сценариев: контракт A может проверять транзакции по контракту B (без сотрудничества с B), можно восстановить разорванные цепочки сообщений (когда recovery-contract получает и проверяет доказательства того, что некоторая транзакция произошла, но была отменена), также требуется знание хэшей блоков мастерчейна для выполнения некоторых функций проверки onchain.

- Cell-based computations.
- Efficient handling of Merkle proofs.

By integrating block information into the TVM context, several trustless mechanisms become possible:

- **Cross-contract verification:** contract _A_ can verify transactions on contract _B_ without B’s cooperation.
- **Broken message chain recovery:** a recovery contract can fetch and validate proofs for transactions that occurred but were later reverted.
- **On-chain validation:** access to MasterChain block hashes enables functions like fisherman validation mechanisms.

Идентификаторы блоков представлены в следующем формате:

```
[ wc:Integer shard:Integer seqno:Integer root_hash:Integer file_hash:Integer ] = BlockId;
[ last_mc_blocks:[BlockId0, BlockId1, ..., BlockId15]
  prev_key_block:BlockId ] : PrevBlocksInfo
```

This includes:

- Включены идентификаторы последних 16 блоков мастерчейна (или меньше, если seqno мастерчейна меньше 16), а также последний ключевой блок.
- The most recent key block.

**Why not include shardblocks data?**

- Включение данных о шардблоках может вызвать некоторые проблемы с доступностью данных (из-за событий слияния/разделения),
  это не обязательно требуется (так как любое событие/данные могут быть подтверждены с помощью блоков мастерчейна), поэтому мы решили не включать их.
- However, this data isn’t strictly necessary, as any event or data can be verified using MasterChain blocks.

## Новые коды операций

When determining the gas cost for new opcodes, follow this rule of thumb:

- The cost should not be lower than the standard value (calculated from opcode length).
- The execution time should not exceed **20 ns per gas unit**.

### Коды операций для работы с новыми значениями c7

26 газа для каждого, за исключением `PREVMCBLOCKS` и `PREVKEYBLOCK` (34 газа).

Стоимость газа равна 10 плюс длина опкода: 26 для большинства кодов операции, +8 для `LSHIFT#`/`RSHIFT#`, +8 для тихого режима.

| <br/>Синтаксис Fift   | Stack   | Description                                                                        |
| :-------------------- | :------ | :--------------------------------------------------------------------------------- |
| `MYCODE`              | _`- c`_ | Извлекает код смарт-контракта из c7                                                |
| `INCOMINGVALUE`       | _`- t`_ | Извлекает значение входящего сообщения из c7                                       |
| `STORAGEFEES`         | _`- i`_ | Извлекает значение платы за фазу хранения из c7                                    |
| `PREVBLOCKSINFOTUPLE` | _`- t`_ | Извлекает PrevBlocksInfo: `[last_mc_blocks, prev_key_block]` из c7 |
| `PREVMCBLOCKS`        | _`- t`_ | Извлекает только `last_mc_blocks`                                                  |
| `PREVKEYBLOCK`        | _`- t`_ | Извлекает только `prev_key_block`                                                  |
| `GLOBALID`            | _`- i`_ | Извлекает `global_id` из 19 конфигурации сети                                      |

## Газ

| <br/>Синтаксис Fift | Stack     | Description                                                                                                                                  |
| :------------------ | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| `GASCONSUMED`       | _`- g_c`_ | Возвращает газ, потребленный виртуальной машиной на данный момент (включая эту инструкцию).<br/>_26 газа_ |

## Arithmetics

Добавлены новые варианты [кода операции деления](/v3/documentation/tvm/instructions) (`A9mscdf`):
`d=0` берет одно дополнительное целое число из стека и добавляет его к промежуточному значению перед делением/rshift.

New `d=0` variant:

- Takes an additional integer from the stack.
- Adds it to the intermediate value before performing division or right shift.
- Returns both the quotient and remainder, just like `d=3`.

**Quiet variants** are also available. Также доступны тихие варианты (например, `QMULADDDIVMOD` или `QUIET MULADDDIVMOD`).

**Error handling**

Non-quiet operations throw an integer overflow exception if:

- The result exceeds `257-bit` integers.
- The divider is **zero**.

Quiet operations handle errors differently:

- If a value doesn't fit, they return `NaN`.
- Операции без прерывания возвращают значение `NaN` вместо значения, которое не помещается (два `NaN`, если делитель равен нулю).

**Gas cost calculation**

Gas cost is determined as 10 plus the opcode length:

- Most opcodes require **26 gas**.
- `LSHIFT#/RSHIFT#` cost an additional **8 gas**.
- Quiet variants also require an extra **8 gas**.

| <br/>Синтаксис Fift   | Stack                                             |
| :-------------------- | :------------------------------------------------ |
| `MULADDDIVMOD`        | _`x y w z - q=floor((xy+w)/z) r=(xy+w)-zq`_       |
| `MULADDDIVMODR`       | _`x y w z - q=round((xy+w)/z) r=(xy+w)-zq`_       |
| `MULADDDIVMODC`       | _`x y w z - q=ceil((xy+w)/z) r=(xy+w)-zq`_        |
| `ADDDIVMOD`           | _`x w z - q=floor((x+w)/z) r=(x+w)-zq`_           |
| `ADDDIVMODR`          | _`x w z - q=round((x+w)/z) r=(x+w)-zq`_           |
| `ADDDIVMODC`          | _`x w y - q=ceil((x+w)/z) r=(x+w)-zq`_            |
| `ADDRSHIFTMOD`        | _`x w z - q=floor((x+w)/2^z) r=(x+w)-q*2^z`_      |
| `ADDRSHIFTMODR`       | _`x w z - q=round((x+w)/2^z) r=(x+w)-q*2^z`_      |
| `ADDRSHIFTMODC`       | _`x w z - q=ceil((x+w)/2^z) r=(x+w)-q*2^z`_       |
| `z ADDRSHIFT#MOD`     | _`x w - q=floor((x+w)/2^z) r=(x+w)-q*2^z`_        |
| `z ADDRSHIFTR#MOD`    | _`x w - q=round((x+w)/2^z) r=(x+w)-q*2^z`_        |
| `z ADDRSHIFTC#MOD`    | _`x w - q=ceil((x+w)/2^z) r=(x+w)-q*2^z`_         |
| `MULADDRSHIFTMOD`     | _`x y w z - q=floor((xy+w)/2^z) r=(xy+w)-q*2^z`_  |
| `MULADDRSHIFTRMOD`    | _`x y w z - q=round((xy+w)/2^z) r=(xy+w)-q*2^z`_  |
| `MULADDRSHIFTCMOD`    | _`x y w z - q=ceil((xy+w)/2^z) r=(xy+w)-q*2^z`_   |
| `z MULADDRSHIFT#MOD`  | _`x y w - q=floor((xy+w)/2^z) r=(xy+w)-q*2^z`_    |
| `z MULADDRSHIFTR#MOD` | _`x y w - q=round((xy+w)/2^z) r=(xy+w)-q*2^z`_    |
| `z MULADDRSHIFTC#MOD` | _`x y w - q=ceil((xy+w)/2^z) r=(xy+w)-q*2^z`_     |
| `LSHIFTADDDIVMOD`     | _`x w z y - q=floor((x*2^y+w)/z) r=(x*2^y+w)-zq`_ |
| `LSHIFTADDDIVMODR`    | _`x w z y - q=round((x*2^y+w)/z) r=(x*2^y+w)-zq`_ |
| `LSHIFTADDDIVMODC`    | _`x w z y - q=ceil((x*2^y+w)/z) r=(x*2^y+w)-zq`_  |
| `y LSHIFT#ADDDIVMOD`  | _`x w z - q=floor((x*2^y+w)/z) r=(x*2^y+w)-zq`_   |
| `y LSHIFT#ADDDIVMODR` | _`x w z - q=round((x*2^y+w)/z) r=(x*2^y+w)-zq`_   |
| `y LSHIFT#ADDDIVMODC` | _`x w z - q=ceil((x*2^y+w)/z) r=(x*2^y+w)-zq`_    |

## Операции со стеком

**Previous limitations**

- В настоящее время аргументы всех операций со стеком ограничены 256.
- Это означает, что если стек становится глубже 256, становится трудно управлять глубокими элементами стека.
- В большинстве случаев нет никаких причин для безопасности для этого ограничения, т. е. аргументы не ограничиваются, чтобы предотвратить слишком дорогие операции.

Для некоторых массовых операций со стеком, таких как `ROLLREV` (где время вычисления линейно зависит от значения аргумента), стоимость газа также линейно зависит от значения аргумента.

**Updated behavior**

The argument limits for the following operations have been removed:

- Аргументы `PICK`, `ROLL`, `ROLLREV`, `BLKSWX`, `REVX`, `DROPX`, `XCHGX`, `CHKDEPTH`, `ONLYTOPX`, `ONLYX` теперь не ограничены.

**Gas cost adjustments for large arguments**

Certain operations now consume additional gas when arguments exceed 255:

- `ROLL`, `ROLLREV`, `REVX`, `ONLYTOPX` потребляют больше газа, когда аргументы большие: дополнительная стоимость газа составляет `max(arg-255,0)` (для аргумента меньше 256 потребление газа постоянно и соответствует текущему режиму) _For arguments ≤ 255, gas consumption remains unchanged_. _For arguments ≤ 255, gas consumption remains unchanged_.

- Для `BLKSWX` дополнительная стоимость составляет `max(arg1+arg2-255,0)` (это не соответствует текущему режиму, так как в настоящее время и `arg1`, и `arg2` ограничены 255). _This differs from previous behavior, where both arguments were limited to 255_.

## Хэши

Previously, TVM supported only two hash operations:

- Computing the representation hash of a `cell` or `slice`.
- В настоящее время в TVM доступны только две операции хэширования: вычисление хэша представления ячейки/среза и sha256 данных, но только до 127 байт (только столько данных помещается в одну ячейку).

**New hash operations (`HASHEXT[A][R]_(HASH)`)**
A new family of hash operations has been introduced to extend TVM's hashing capabilities:

| <br/>Синтаксис Fift | Stack                    | Description                                                                                                   |
| :------------------ | :----------------------- | :------------------------------------------------------------------------------------------------------------ |
| `HASHEXT_(HASH)`    | _`s_1 ... s_n n - h`_    | Вычисляет и возвращает хэш объединения срезов (или сборщиков) `s_1...s_n`. |
| `HASHEXTR_(HASH)`   | _`s_n ... s_1 n - h`_    | Аргументы задаются в обратном порядке, добавляя хэш к строителю.                              |
| `HASHEXTA_(HASH)`   | _`b s_1 ... s_n n - b'`_ | Добавляет полученный хэш к строителю `b` вместо того, чтобы помещать его в стек.              |
| `HASHEXTAR_(HASH)`  | _`b s_n ... s_1 n - b'`_ | То же самое, но аргументы приводятся в обратном порядке.                                      |

**Key behavior and constraints**

- Используются только биты из корневых ячеек `s_i`.
- Каждый фрагмент `s_i` может содержать нецелое число байтов. Однако сумма битов всех фрагментов должна делиться на 8.
- Обратите внимание, что TON использует порядок старших битов, поэтому при объединении двух фрагментов с нецелым числом байтов биты из первого фрагмента становятся старшими битами.

**Gas consumption**

- Расход газа зависит от количества хэшированных байтов и выбранного алгоритма.
- На каждый фрагмент потребляется дополнительно 1 единица газа.
- Использование газа округляется в меньшую сторону.

**Hashing result format**

Если параметр `[A]` не включен, результат хэширования будет возвращен в виде целого числа без знака, если оно соответствует 256 битам, или целого ряда целых чисел в противном случае. Otherwise, it is returned as a tuple of integers.

| **Algorithm**  | **Implementation**                                | **Gas cost (per byte)** | **Hash size** |
| -------------- | ------------------------------------------------- | ------------------------------------------ | ------------- |
| **SHA-256**    | OpenSSL                                           | 1/33                                       | 256 bits      |
| **SHA-512**    | OpenSSL                                           | 1/16                                       | 512 bits      |
| **BLAKE2B**    | OpenSSL                                           | 1/19                                       | 512 bits      |
| **KECCAK-256** | [Ethereum-compatible](http://keccak.noekeon.org/) | 1/11                                       | 256 bits      |
| **KECCAK-512** | [Ethereum-compatible](http://keccak.noekeon.org/) | 1/6                                        | 512 bits      |

## Crypto

В настоящее время доступен только один криптографический алгоритм - `CHKSIGN`: проверьте подпись Ed25519 хеша `h` для открытого ключа `k`.

- Для совместимости с блокчейнами предыдущего поколения, такими как Bitcoin и Ethereum, нам также необходимо проверить подписи `secp256k1`.
- Для современных криптографических алгоритмов абсолютный минимум - это сложение и умножение кривых.
- Для совместимости с Ethereum 2.0 PoS и некоторыми другими современными криптографическими алгоритмами нам нужна схема BLS-подписи на кривой bls12-381.
- Для некоторого защищенного оборудования требуется secp256r1 == P256 == prime256v1.

### secp256k1

Подписи Bitcoin/Ethereum. Использует [реализацию libsecp256k1](https://github.com/bitcoin-core/secp256k1).

| <br/>Синтаксис Fift | Stack                             | Description                                                                                                                                                                                                                                                                                                                                                                                                                          |
| :------------------ | :-------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ECRECOVER`         | _`hash v r s - 0 или h x1 x2 -1`_ | Восстанавливает открытый ключ из подписи, идентично операциям Bitcoin/Ethereum.<br/> Принимает 32-байтовый хэш как uint256 `hash`; 65-байтовая подпись как uint8 `v` и uint256 `r`, `s`.<br/> Возвращает `0` в случае неудачи, открытый ключ и `-1` в случае успеха.<br/> 65-байтовый открытый ключ возвращается как uint8 `h`, uint256 `x1`, `x2`.<br/> _1526 газа_ |

### secp256r1

Использует реализацию OpenSSL. Интерфейс похож на `CHKSIGNS`/`CHKSIGNU`. Совместимо с Apple Secure Enclave.

| <br/>Синтаксис Fift | Stack           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| :------------------ | :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `P256_CHKSIGNS`     | _`d sig k - ?`_ | Проверяет seck256r1-подпись `sig` части данных среза `d` и открытый ключ `k`. Возвращает -1 в случае успеха, 0 в случае неудачи.<br/> Открытый ключ представляет собой 33-байтовый срез (закодированный в соответствии с разделом 2.3.4, пункт 2 [SECG SEC 1](https://www.secg.org/sec1-v2.pdf)).<br/> Подпись `sig` представляет собой 64-байтовый срез (два 256-битных беззнаковых целых числа `r` и `s`).<br/> _3526 газа_ |
| `P256_CHKSIGNU`     | _`h sig k - ?`_ | То же самое, но подписанные данные представляют собой 32-байтовую кодировку 256-битного беззнакового целого числа `h`.<br/> _3526 газа_                                                                                                                                                                                                                                                                                                                                                                                                             |

### Ristretto

Расширенная документация доступна [здесь](https://ristretto.group/). Проще говоря, Curve25519 был разработан с учетом производительности, однако из-за симметрии некоторые элементы группы имеют несколько представлений. Более простые протоколы, такие как подписи Шнорра или Диффи-Хеллмана, применяют приемы на уровне протокола для смягчения некоторых проблем, но нарушают схемы вывода ключей и маскировки ключей. И эти приемы не масштабируются до более сложных протоколов, таких как Bulletproofs.

**Ristretto** solves this problem by providing an arithmetic abstraction over Curve25519, ensuring each group element has a unique representation. Ристретто по сути является протоколом сжатия/распаковки для Curve25519, который предлагает необходимую арифметическую абстракцию. В результате криптопротоколы легко писать правильно, при этом извлекая выгоду из высокой производительности Curve25519. One key advantage of Ristretto is that it allows the seamless performance of Curve25519 operations, though the reverse is not true.

Операции Ристретто позволяют вычислять операции кривой на Curve25519 (в обратном порядке это не так), таким образом мы можем считать, что добавляем как Ристретто, так и операции по кривой Curve25519 за один шаг.

Используется реализация [libsodium](https://github.com/jedisct1/libsodium/).

**Representation in TVM**

- Все точки ristretto-255 представлены в TVM как 256-битные целые числа без знака.
- При некорректных операциях генерируется `range_chk`, если аргументы не являются допустимыми закодированными точками.
- Нулевая точка представлена в виде целого числа `0`.

| <br/>Синтаксис Fift | Stack                  | Description                                                                                                                                                             |
| :------------------ | :--------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RIST255_FROMHASH`  | _`h1 h2 - x`_          | Детерминированно генерирует допустимую точку `x` из 512-битного хеша (заданного как два 256-битных целых числа).<br/>_626 газа_      |
| `RIST255_VALIDATE`  | _`x -`_                | Проверяет, что целое число `x` является допустимым представлением некоторой точки кривой. Выдает `range_chk` при ошибке.<br/>_226 газа_ |
| `RIST255_ADD`       | _`x y - x+y`_          | Вычитание двух точек на кривой.<br/>_626 газа_                                                                                                          |
| `RIST255_SUB`       | _`x y - x-y`_          | Сложение двух точек на кривой.<br/> _626 газа_                                                                                                          |
| `RIST255_MUL`       | _`x n - x*n`_          | Умножает точку `x` на скаляр `n`.<br/>Допустимо любое `n`, включая отрицательное.<br/>_2026 газа_                                       |
| `RIST255_MULBASE`   | _`n - g*n`_            | Умножает точку генератора `g` на скаляр `n`.<br/>Допустимо любое `n`, включая отрицательное.<br/>_776 газа_                             |
| `RIST255_PUSHL`     | _`- l`_                | Выводит целое число `l=2^252+27742317777372353535851937790883648493`, которое соответствует порядку в группе.<br/>_26 газа_                             |
| `RIST255_QVALIDATE` | _`x - 0 или -1`_       | Тихая версия `RIST255_VALIDATE`.<br/>_234 газа_                                                                                                         |
| `RIST255_QADD`      | _`x y - 0 или x+y -1`_ | Тихая версия `RIST255_ADD`. <br/>_634 газа_                                                                                                             |
| `RIST255_QSUB`      | _`x y - 0 или x-y -1`_ | Тихая версия `RIST255_SUB`.<br/>_634 газа_                                                                                                              |
| `RIST255_QMUL`      | _`x n - 0 или x*n -1`_ | Тихая версия `RIST255_MUL`.<br/>_2034 газа_                                                                                                             |
| `RIST255_QMULBASE`  | _`n - 0 или g*n -1`_   | Тихая версия `RIST255_MULBASE`.<br/>_784 газа_                                                                                                          |

### BLS12-381

Операции на кривой BLS12-381, удобной для сопряжения. Используется реализация [BLST](https://github.com/supranational/blst). Также, операции для схемы подписи BLS, которая основана на этой кривой.

Значения BLS представлены в TVM следующим образом:

- G1-точки и открытые ключи: 48-байтовый срез.
- G2-точки и подписи: 96-байтовый срез.
- Элементы поля FP: 48-байтовый срез.
- Элементы поля FP2: 96-байтовый срез.
- Сообщения: срез. Количество бит должно делиться на 8.

**Handling input sizes**

- Когда входное значение является точкой или элементом поля, срез может иметь более 48/96 байт. В этом случае берутся только первые 48/96 байт.
- Если в срезе меньше байтов (или если размер сообщения не делится на 8), выдается исключение переполнения ячейки.

#### Высокоуровневые операции

Это высокоуровневые операции для проверки подписей BLS.

| <br/>Синтаксис Fift        | Stack                                      | Description                                                                                                                                                                                                                                            |
| :------------------------- | :----------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BLS_VERIFY`               | _`pk msg sgn - bool`_                      | Checks a BLS signature. It returns true  if valid, false otherwise.<br/>_61034 газа_                                                                                                                                   |
| `BLS_AGGREGATE`            | _`sig_1 ... sig_n n - sig`_                | Агрегирует подписи. `n>0`. Выдает исключение, если `n=0` или если какой-либо `sig_i` не является допустимой подписью.<br/>_`gas=n*4350-2616`_                                                          |
| `BLS_FASTAGGREGATEVERIFY`- | _`pk_1 ... pk_n n msg sig - bool`_         | Проверяет агрегированную подпись BLS для ключей `pk_1...pk_n` и сообщения `msg`. Возвращает false, если `n=0`.<br/>_`gas=58034+n*3000`_                                                                                |
| `BLS_AGGREGATEVERIFY`      | _`pk_1 msg_1 ... pk_n msg_n n sgn - bool`_ | Проверяет агрегированную подпись BLS для пар ключ-сообщение `pk_1 msg_1...pk_n msg_n`. Возвращает true в случае успеха, в противном случае false. Верните false, если `n=0`.<br/>_`gas=38534+n*22500`_ |

`VERIFY` instructions

- These instructions do not throw exceptions for invalid signatures or public keys.
- The only exceptions occur due to cell underflow errors.
- Возвращает true в случае успеха, в противном случае false.

#### Низкоуровневые операции

Это арифметические операции над элементами группы.

| <br/>Синтаксис Fift | Stack                                           | Description                                                                                                                                                                                                                                                                                               |
| :------------------ | :---------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BLS_G1_ADD`        | _`x y - x+y`_                                   | Вычитание на G1.<br/>_3934 газа_                                                                                                                                                                                                                                                          |
| `BLS_G1_SUB`        | _`x y - x-y`_                                   | Сложение на G1.<br/>_3934 газа_                                                                                                                                                                                                                                                           |
| `BLS_G1_NEG`        | _`x - -x`_                                      | Отрицание на G1.<br/>_784 газа_                                                                                                                                                                                                                                                           |
| `BLS_G1_MUL`        | _`x s - x*s`_                                   | Умножает точку G1 `x` на скаляр `s`.<br/>Допустим любой `s`, включая отрицательный.<br/>_5234 газа_                                                                                                                                                                       |
| `BLS_G1_MULTIEXP`   | _`x_1 s_1 ... x_n s_n n - x_1*s_1+...+x_n*s_n`_ | Вычисляет `x_1*s_1+...+x_n*s_n` для точек G1 `x_i` и скаляров `s_i`. Возвращает нулевую точку, если `n=0`.<br/>Любое `s_i` допустимо, включая отрицательное.<br/>_`gas=11409+n*630+n/floor(max(log2(n),4))*8820`_                                         |
| `BLS_G1_ZERO`       | _`- zero`_                                      | Помещает нулевую точку в G1.<br/>_34 газа_                                                                                                                                                                                                                                                |
| `BLS_MAP_TO_G1`     | _`f - x`_                                       | Преобразует элемент FP `f` в точку G1.<br/>_2384 газа_                                                                                                                                                                                                                                    |
| `BLS_G1_INGROUP`    | _`x - bool`_                                    | Проверяет, что срез `x` представляет допустимый элемент G1.<br/>_2984 газа_                                                                                                                                                                                                               |
| `BLS_G1_ISZERO`     | _`x - bool`_                                    | Проверяет, что точка G1 `x` равна нулю.<br/>_34 газа_                                                                                                                                                                                                                                     |
| `BLS_G2_ADD`        | _`x y - x+y`_                                   | Вычитание на G2.<br/>_6134 газа_                                                                                                                                                                                                                                                          |
| `BLS_G2_SUB`        | _`x y - x-y`_                                   | Сложение на G2.<br/>_6134 газа_                                                                                                                                                                                                                                                           |
| `BLS_G2_NEG`        | _`x - -x`_                                      | Отрицание на G2.<br/>_1584 газа_                                                                                                                                                                                                                                                          |
| `BLS_G2_MUL`        | _`x s - x*s`_                                   | Умножает точку G2 `x` на скаляр `s`.<br/>Любое `s` допустимо, включая отрицательное.<br/>_10584 газа_                                                                                                                                                                     |
| `BLS_G2_MULTIEXP`   | _`x_1 s_1 ... x_n s_n n - x_1*s_1+...+x_n*s_n`_ | Вычисляет `x_1*s_1+...+x_n*s_n` для точек G2 `x_i` и скаляров `s_i`. Возвращает нулевую точку, если `n=0`.<br/>Любое `s_i` допустимо, включая отрицательное.<br/>_`gas=30422+n*1280+n/floor(max(log2(n),4))*22840`_                                       |
| `BLS_G2_ZERO`       | _`- zero`_                                      | Помещает нулевую точку в G2.<br/>_34 газа_                                                                                                                                                                                                                                                |
| `BLS_MAP_TO_G2`     | _`f - x`_                                       | Преобразует элемент FP2 `f` в точку G2.<br/>_7984 газа_                                                                                                                                                                                                                                   |
| `BLS_G2_INGROUP`    | _`x - bool`_                                    | Проверяет, что срез `x` представляет допустимый элемент G2.<br/>_4284 газа_                                                                                                                                                                                                               |
| `BLS_G2_ISZERO`     | _`x - bool`_                                    | Проверяет, что точка G2 `x` равна нулю.<br/>_34 газа_                                                                                                                                                                                                                                     |
| `BLS_PAIRING`       | _`x_1 y_1 ... x_n y_n n - bool`_                | Учитывая точки G1 `x_i` и точки G2 `y_i`, вычисляет и умножает пары `x_i,y_i`. Возвращает true, если результат является мультипликативным тождеством в FP12, в противном случае возвращает false. Возвращает false, если `n=0`.<br/>_`gas=20034+n*11800`_ |
| `BLS_PUSHR`         | _`- r`_                                         | Изменяет порядок G1 и G2 (приблизительно `2^255`).<br/>_34 газа_                                                                                                                                                                                                       |

`INGROUP`, `ISZERO` не выбрасывают исключение на недопустимых точках (кроме исключений переполнения ячеек), вместо этого они возвращают false.

Другие арифметические операции выбрасывают исключение на недопустимых точках кривой. Обратите внимание, что они не проверяют, принадлежат ли заданные точки кривой группе G1/G2. Используйте инструкцию `INGROUP`, чтобы проверить это.

## RUNVM

В настоящее время код в TVM не может вызвать внешний ненадежный код "в изолированной среде". Другими словами, внешний код всегда может необратимо обновить код, данные контракта или задать действия (например, отправку всех денег).

Инструкция `RUNVM` позволяет создать независимый экземпляр виртуальной машины, запустить нужный код и получить необходимые данные (стек, регистры, потребление газа и т. д.) без риска загрязнения состояния вызывающей стороны. This ensures the caller's state remains unaffected. Безопасный запуск произвольного кода может быть полезен для [плагинов в стиле v4](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts#wallet-v4), вычислений субконтрактов в стиле `init` [Tact's](https://docs.tact-lang.org) и т. д.

| <br/>Синтаксис Fift | Stack                                                                                                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| :------------------ | :------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `flags RUNVM`       | _`x_1 ... x_n n code [r] [c4] [c7] [g_l] [g_m] - x'_1 ... x'_m exitcode [data'] [c4'] [c5] [g_c]`_       | Запускает дочернюю виртуальную машину с кодом `code` и стеком `x_1...x_n`. x_n`. Returns the modified stack `x'_1 ... Возвращает результирующий стек `x'_1...x'_m` и код выхода.<br/> Другие аргументы и возвращаемые значения включаются флагами, см. ниже. See details below. |
| `RUNVMX`            | _`x_1 ... x_n n code [r] [c4] [c7] [g_l] [g_m] flags - x'_1 ... x'_m exitcode [data'] [c4'] [c5] [g_c]`_ | То же самое, но извлекает флаги из стека.                                                                                                                                                                                                                                                                                                                                                                                                 |

Флаги похожи на `runvmx` в fift:

- `+1`: присвоить c3 значение кода
- `+2`: вставить неявный 0 перед запуском кода
- `+4`: взять `c4` из стека (постоянные данные), вернуть его конечное значение
- `+8`: взять лимит газа `g_l` из стека, вернуть потребленный газ `g_c`
- `+16`: взять `c7` из стека (контекст смарт-контракта)
- `+32`: вернуть конечное значение `c5` (действия)
- `+64`: вытолкнуть жесткий лимит газа (включено ACCEPT) `g_m` из стека
- `+128`: "изолированное потребление газа". Дочерняя VM будет иметь отдельный набор посещенных ячеек и отдельный счетчик chksgn.
- `+256`: pops an integer `r` and ensures exactly `r` values are returned from the top of the stack:
  - `+256`: вытолкнуть целое число `r`, вернуть ровно `r` значений сверху:\* Если вызов RUNVM успешен и установлено r, он возвращает r элементов. Если r не задано - возвращает все;
  - If `RUNVM` is successful but lacks elements on the stack, meaning the stack depth is less than `r`, it is treated as an exception in the child VM. The `exit_code` is set to `-3`, and `exit_arg` is set to `0`, so `0` is returned as the only stack element.
  - If `RUNVM` fails with an exception, only one element is returned, `exit_arg`, which should not be confused with `exit_code`.
  - In the case of running out of gas, `exit_code` is set to `-14`, and `exit_arg` contains the amount of gas.

Стоимость газа:

- 66 газа
- 1 газ за каждый элемент стека, переданный дочерней виртуальной машине (первые 32 бесплатны)
- 1 газ за каждый элемент стека, возвращенный дочерней виртуальной машиной (первые 32 бесплатны)

## Отправка сообщений

Calculating the cost of sending a message within a contract is difficult. В настоящее время сложно рассчитать стоимость отправки сообщения в контракте (что приводит к некоторым приближениям, как в [жетонах](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc#L94)) и невозможно вернуть запрос, если фаза действия неверна.

- Bounce a request back if the action phase is incorrect.
- Также невозможно точно вычесть из входящего сообщения сумму "постоянной платы за логику контракта" и "расходов на газ".

`SENDMSG`
The `SENDMSG` instruction:

- Takes a `cell` and a `mode` as input.
- Creates an output action and returns the fee for generating a message.

Режим имеет тот же эффект, что и в случае SENDRAWMSG.

- `+1024` – fee estimation only, does not create an action.
- `+64` – uses the entire balance of the incoming message as the outgoing value. This is slightly inaccurate since gas expenses that cannot be precomputed are ignored.
- `+128` – substitutes the value of the contract’s entire balance before the computation phase starts. This is slightly inaccurate since gas expenses are not estimated before computation completion and ignored.

**Additional message handling flags**

A `+16` flag has been added for the following operations:

- `SENDRAWMSG`
- `RAWRESERVE`
- `SETLIBCODE`
- `CHANGELIB`

`SENDRAWMSG`, `RAWRESERVE`, `SETLIBCODE`, `CHANGELIB` - добавлен флаг `+16`, что означает в случае сбоя действия - возврат транзакции.\
Никакого эффекта, если используется `+2`.

## Аудиты безопасности

Обновление виртуальной машины TON (TVM) было проанализировано на предмет безопасности и потенциальных уязвимостей.

[Аудиторский отчет Trail of Bits - Обновление TVM](https://docs.ton.org/audits/TVM_Upgrade_ToB_2023.pdf)

<Feedback />

