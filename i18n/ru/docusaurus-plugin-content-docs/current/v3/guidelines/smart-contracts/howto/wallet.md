---
description: Как работать с кошельками, сообщениями и смарт-контрактами.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Работа со смарт-контрактами кошелька

## 👋 Введение

Прежде чем приступать к разработке смарт-контрактов, важно изучить как работают кошельки и транзакции на TON. Это поможет разработчикам понять принцип взаимодействия между кошельками, сообщениями и смарт-контрактами для выполнения конкретных задач разработки.

:::tip
Перед чтением руководства рекомендуется ознакомиться со статьей [Типы контрактов кошелька](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts).
:::

Мы научимся создавать операции без использования предварительно настроенных функций, это полезно для лучшего понимания процесса разработки. Дополнительные ссылки на материалы для изучения находятся в конце каждого раздела.

## 💡 Перед началом работы

Изучение данного руководства потребует базовых знаний JavaScript и TypeScript или Golang. На балансе кошелька должно быть как минимум 3 TON (это может быть биржевой счет, некастодиальный кошелек или бот Кошелек от Telegram). Также необходимо иметь представление об [адресах в TON](/v3/documentation/smart-contracts/addresses), [ячейке](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage), [блокчейне блокчейнов](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains).

:::info РАЗВИТИЕ MAINNET НЕОБХОДИМО
Работа с TON Testnet часто приводит к ошибкам при развертывании, сложностям с отслеживанием транзакций и нестабильной работе сети. Большую часть разработки лучше реализовать в TON Mainnet, чтобы избежать проблем, которые могут возникнуть при попытках уменьшить количество транзакций, и понизить сборы, соответственно.
:::

## 💿 Исходный код

Все примеры кода, используемые в руководстве, можно найти в [репозитории GitHub](https://github.com/aSpite/wallet-tutorial).

## ✍️ Что нужно для начала работы

- Установленный NodeJS
- Специальные библиотеки TON: @ton/ton 13.5.1+, @ton/core 0.49.2+ и @ton/crypto 3.2.0+

**ОПЦИОНАЛЬНО**: Если вы предпочитаете использовать Go, а не JS, то для разработки на TON необходимо установить GoLand IDE и библиотеку [tonutils-go](https://github.com/xssnick/tonutils-go). Эта библиотека будет использоваться в данном руководстве для версии Go.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```bash
npm i --save @ton/ton @ton/core @ton/crypto
```

</TabItem>
<TabItem value="go" label="Golang">

```bash
go get github.com/xssnick/tonutils-go
go get github.com/xssnick/tonutils-go/adnl
go get github.com/xssnick/tonutils-go/address
```

</TabItem>
</Tabs>

## ⚙ Настройте свое окружение

Для создания проекта TypeScript выполните следующие шаги:

1. Создайте пустую папку (мы назовем ее WalletsTutorial).
2. Откройте папку проекта с помощью CLI.
3. Используйте следующие команды для настройки проекта:

```bash
npm init -y
npm install typescript @types/node ts-node nodemon --save-dev
npx tsc --init --rootDir src --outDir build \ --esModuleInterop --target es2020 --resolveJsonModule --lib es6 \ --module commonjs --allowJs true --noImplicitAny false --allowSyntheticDefaultImports true --strict false
```

:::info
Процесс `ts-node` запускает выполнение кода TypeScript без предварительной компиляции, а `nodemon` используется для автоматического перезапуска приложения node при обнаружении изменений файлов в директории.
:::

```json
  "files": [
    "\\",
    "\\"
  ]
```

5. Затем создайте конфигурацию `nodemon.json` в корне проекта со следующим содержанием:

```json
{
  "watch": ["src"],
  "ext": ".ts,.js",
  "ignore": [],
  "exec": "npx ts-node ./src/index.ts"
}
```

6. Добавьте этот скрипт в `package.json` вместо "test", который добавляется при создании проекта:

```json
"start:dev": "npx nodemon"
```

7. Создайте папку `src` в корне проекта и файл `index.ts` в этой папке.
8. Далее добавьте следующий код:

```ts
async function main() {
  console.log("Hello, TON!");
}

main().finally(() => console.log("Exiting..."));
```

9. Запустите код в терминале:

```bash
npm run start:dev
```

10. В итоге в консоли появится следующий вывод:

![](/img/docs/how-to-wallet/wallet_1.png)

:::tip Blueprint
TON Community создали отличный инструмент для автоматизации всех процессов разработки (развертывание, написание контрактов, тестирование) под названием [Blueprint](https://github.com/ton-org/blueprint). Однако нам не понадобится такой мощный инструмент, поэтому следует держаться приведенных выше инструкций.
:::

**ОПЦИОНАЛЬНО:** При использовании Golang выполните следующие шаги:

1. Установите GoLand IDE.
2. Создайте папку проекта и файл `go.mod` со следующим содержанием (для выполнения этого процесса может потребоваться изменить **версию Go**, если текущая используемая версия устарела):

```
module main

go 1.20
```

3. Введите следующую команду в терминал:

```bash
go get github.com/xssnick/tonutils-go
```

4. Создайте файл `main.go` в корне проекта со следующим содержанием:

```go
package main

import (
	"log"
)

func main() {
	log.Println("Hello, TON!")
}
```

5. Измените наименование модуля в файле `go.mod` на `main`.
6. Запустите код выше до появления вывода в терминале.

:::info
Также можно использовать другую IDE, поскольку GoLand не бесплатна, но она предпочтительнее.
:::

:::warning ВАЖНО

В каждом последующем разделе руководства будут указаны только те импорты, которые необходимы для конкретного раздела кода, новые импорты нужно будет добавлять и объединять со старыми.
:::

## 🚀 Давайте начнем!

В этом разделе мы узнаем, какие кошельки (V3 и V4) чаще всего используются на блокчейне TON, и как работают их смарт-контракты. Это позволит разработчикам лучше понять различные типы сообщений на платформе TON, упростить их создание и отправку в блокчейн, научиться разворачивать кошельки и, в конечном итоге, работать с highload-кошельками.

Наша основная задача – научиться создавать сообщения, используя различные объекты и функции: @ton/ton, @ton/core, @ton/crypto (ExternalMessage, InternalMessage, Signing и т.д.), чтобы понять, как выглядят сообщения в более широких масштабах. Для этого мы будем использовать две основные версии кошелька (V3 и V4), поскольку биржи, некастодиальные кошельки и большинство пользователей используют именно эти версии.

:::note
There may be occasions in this tutorial when there is no explanation for particular details. In these cases, more details will be provided in later stages of this tutorial.

**ВАЖНО:** В данном руководстве используется [код кошелька V3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc). Следует отметить, что версия 3 имеет две ревизии: R1 и R2. В настоящее время используется только вторая ревизия, поэтому, когда мы по тексту ссылаемся на V3, это означает V3R2.
:::

## 💎 Кошельки TON Blockchain

Все кошельки, работающие на блокчейне TON, являются смарт-контрактами, и все, что работает на TON функционирует как смарт-контракт. Как и в большинстве блокчейнов TON позволяет разворачивать смарт-контракты и модифицировать их для различных целей, предоставляя возможность **полной кастомизация кошелька**. В TON смарт-контракты кошелька облегчают взаимодействие между платформой и другими типами смарт-контрактов. Однако важно понимать, как происходит данное взаимодействие.

### Взаимодействие с кошельком

В блокчейне TON существует два типа сообщений: `internal` (внутренние) и `external` (внешние). Внешние сообщения позволяют отправлять сообщения в блокчейн из внешнего мира, тем самым обеспечивая связь со смарт-контрактами, которые принимают такие сообщения. Функция, отвечающая за выполнение этого процесса, выглядит следующим образом:

```func
() recv_external(slice in_msg) impure {
    ;; some code
}
```

Перед более подробным изучением кошельков давайте рассмотрим, как они принимают внешние сообщения. На TON каждый кошелек хранит `public key`, `seqno` и `subwallet_id` владельца. При получении внешнего сообщения кошелек использует метод `get_data()` для извлечения данных из хранилища. Затем проводится несколько процедур верификации и определяется, принимать сообщение или нет. Это происходит следующим образом:

```func
() recv_external(slice in_msg) impure {
  var signature = in_msg~load_bits(512); ;; get signature from the message body
  var cs = in_msg;
  var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32));  ;; get rest values from the message body
  throw_if(35, valid_until <= now()); ;; check the relevance of the message
  var ds = get_data().begin_parse(); ;; get data from storage and convert it into a slice to be able to read values
  var (stored_seqno, stored_subwallet, public_key) = (ds~load_uint(32), ds~load_uint(32), ds~load_uint(256)); ;; read values from storage
  ds.end_parse(); ;; make sure we do not have anything in ds variable
  throw_unless(33, msg_seqno == stored_seqno);
  throw_unless(34, subwallet_id == stored_subwallet);
  throw_unless(35, check_signature(slice_hash(in_msg), signature, public_key));
  accept_message();
```

> 💡 Полезные ссылки:
>
> ["load_bits()" в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#load_bits)
>
> ["get_data()" в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#get_data)
>
> ["begin_parse()" в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#begin_parse)
>
> ["end_parse()" в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#end_parse)
>
> ["load_int()" в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#load_int)
>
> ["load_uint()" в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#load_uint)
>
> ["check_signature()" в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#check_signature)
>
> ["slice_hash()" в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_hash)
>
> ["accept_message()" в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#accept_message)

Теперь давайте рассмотрим подробнее.

### Защита от повторения – Seqno

Защита от повторения сообщений в смарт-контракте кошелька основана на `seqno` (Sequence Number) – порядковом номере, который отслеживает порядок отправляемых сообщений. Предотвращение повторения сообщений очень важно, так как дубликаты могут поставить под угрозу целостность системы. Если изучить код смарт-контракта кошелька, то `seqno` обычно обрабатывается следующим образом:

```func
throw_unless(33, msg_seqno == stored_seqno);
```

Код выше сравнивает `seqno`, пришедшее во входящем сообщении с `seqno`, которое хранится в смарт-контракте. Если значения не совпадают, то контракт возвращает ошибку с кодом завершения `33`. Таким образом, предоставление отправителем недействительного `seqno` указывает на ошибку в последовательности сообщений, смарт-контракт предотвращает дальнейшую обработку и гарантирует защиту от таких случаев.

:::note
Также важно учитывать, что внешние сообщения могут быть отправлены кем угодно. Это означает, что, если вы отправите кому-то 1 TON, кто-то другой сможет повторить это сообщение. Однако, когда seqno увеличивается, предыдущее внешнее сообщение становится недействительным, а значит никто не сможет его повторить, что предотвращает возможность кражи ваших средств.
:::

### Подпись

Как уже упоминалось ранее, смарт-контракты кошелька принимают внешние сообщения. Однако, поскольку эти сообщения приходят из внешнего мира, таким данным нельзя полностью доверять. Поэтому в каждом кошельке хранится публичный ключ владельца. Когда кошелек получает внешнее сообщение, подписанное приватным ключом владельца, смарт-контракт использует публичный ключ для проверки подписи сообщения. Это гарантирует, что сообщение пришло именно от владельца контракта.

Чтобы выполнить эту проверку кошелек сначала извлекает подпись из входящего сообщения, затем загружает публичный ключ из хранилища, и проверяет подпись с помощью следующих процедур:

```func
var signature = in_msg~load_bits(512);
var ds = get_data().begin_parse();
var (stored_seqno, stored_subwallet, public_key) = (ds~load_uint(32), ds~load_uint(32), ds~load_uint(256));
throw_unless(35, check_signature(slice_hash(in_msg), signature, public_key));
```

Если все процедуры верификации завершены корректно, смарт-контракт принимает сообщение и обрабатывает сообщение:

```func
accept_message();
```

:::info accept_message()
Поскольку внешние сообщения не содержат Toncoin, необходимых для оплаты комиссии за транзакцию, функция `accept_message()` применяет параметр `gas_credit` (в настоящее время его значение составляет 10 000 единиц газа). Это позволяет контракту производить необходимые расчеты бесплатно, если газ не превышает значение `gas_credit`. После вызова функции `accept_message()` смарт-контракт вычитает все затраты на газ (в TON) из своего баланса. Подробнее об этом процессе можно прочитать [здесь](/v3/documentation/smart-contracts/transaction-fees/accept-message-effects).
:::

### Срок действия транзакции

Еще одним шагом, используемым для проверки действительности внешних сообщений, является поле `valid_until`. Как видно из наименования переменной, это время в UNIX до которого сообщение будет действительным. Если процесс проверки завершился неудачей, контракт завершает обработку транзакции и возвращает код завершения `35`:

```func
var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32));
throw_if(35, valid_until <= now());
```

Этот алгоритм защищает от потенциальных ошибок, например, когда сообщение уже недействительно, но по-прежнему отправляется в блокчейн по неизвестной причине.

### Различия кошелька V3 и V4

Ключевое различие между V3 и V4 кошелька заключается в поддержке кошельком V4 `плагинов`, пользователи могут устанавливать или удалять данные плагины, которые представляют собой специализированные смарт-контракты, способные запрашивать в назначенное время определенное количество TON из смарт-контракта кошелька.

Смарт-контракты кошелька, в свою очередь, на запросы плагинов автоматически отправляют в ответ нужное количество TON без необходимости участия владельца. Эта функция отражает **модель подписки**, которая является основным назначением плагинов. Мы не будем углубляться в детали далее, поскольку это выходит за рамки данного руководства.

### Как кошельки облегчают взаимодействие со смарт-контрактами

Как мы уже говорили, смарт-контракт кошелька принимает внешние сообщения, проверяет их и обрабатывает, если все проверки пройдены. Затем контракт запускает цикл извлечения сообщений из тела внешнего сообщения, после чего создает внутренние сообщения и отправляет их в блокчейн:

```func
cs~touch();
while (cs.slice_refs()) {
    var mode = cs~load_uint(8); ;; load message mode
    send_raw_message(cs~load_ref(), mode); ;; get each new internal message as a cell with the help of load_ref() and send it
}
```

:::tip `touch()`
На TON все смарт-контракты выполняются в виртуальной машине TON (TVM), основанной на стековой процессорной архитектуре. `~ touch()` помещает переменную `cs` на вершину стека, чтобы оптимизировать выполнение кода для меньшего расхода газа.
:::

Поскольку в одной ячейке может храниться **максимум 4 ссылки**, то на одно внешнее сообщение можно отправить максимум 4 внутренних сообщения.

> 💡 Полезные ссылки:
>
> ["slice_refs()" в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_refs)
>
> ["send_raw_message() и message modes" в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#send_raw_message)
>
> ["load_ref()" в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#load_ref)

## 📬 Внешние и внутренние сообщения

В этом разделе мы узнаем чуть больше о внутренних `internal` и внешних `external` сообщениях. Мы создадим и отправим сообщения в сеть, при этом постараемся свести к минимуму зависимость от заранее созданных функций.

Для упрощения задачи воспользуемся готовым кошельком. Для этого:

1. Установите [приложение кошелька](/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps) (например, автор использует Tonkeeper).
2. В настройках приложения кошелька перейдите на версию V3R2.
3. Внесите 1 TON на кошелек.
4. Отправьте сообщение на другой адрес (можно отправить его себе на этот же кошелек).

В результате приложение Tonkeeper развернет смарт-контракт кошелька, который мы сможем использовать для следующих шагов.

:::note
На момент написания руководства большинство приложений-кошельков на TON по умолчанию используют кошелек V4. В этом разделе плагины не требуются, а значит будет достаточно функциональности кошелька V3. Tonkeeper позволяет пользователям выбрать нужную им версию кошелька, поэтому рекомендуется развернуть кошелек V3.
:::

### TL-B

Как упоминалось ранее, все в блокчейне TON – это смарт-контракт, состоящий из ячеек. Чтобы правильно сериализовать и десериализовать данные, нам нужны стандарты. Для этой цели был разработан `TL-B` – универсальный инструмент для описания различных типов данных, структур и последовательностей внутри ячеек.

В этом разделе мы будем работать со схемой данных [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb). Этот файл будет незаменим при дальнейшей разработке, поскольку в нем описывается, как собираются различные типы ячеек. В нашем конкретном случае там представлена подробная информация о структуре и поведении внутренних и внешних сообщений.

:::info
В данном руководстве представлена общая информация. Для получения более подробной информации изучите [документацию по TL-B](/v3/documentation/data-formats/tlb/tl-b-language).
:::

### CommonMsgInfo

Изначально каждое сообщение должно хранить `CommonMsgInfo` ([TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L123-L130)) или `CommonMsgInfoRelaxed` ([TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L132-L137)). Эти данные позволяют определить технические детали, относящиеся к типу и времени сообщения, адресу получателя, техническим флагам и сборам.

Читая файл `block.tlb`, можно заметить три типа CommonMsgInfo: `int_msg_info$0`, `ext_in_msg_info$10`, `ext_out_msg_info$11`. Если не углубляться в детали, то конструктор `ext_out_msg_info` – это внешнее сообщение, которое может отправляться смарт-контрактом в качестве внешнего лога. Как пример подобного формата изучите смарт-контракт [Избирателя](https://tonscan.org/address/Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF).

В схеме [TL-B указано](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L127-L128), что **при использовании типа ext_in_msg_info доступен только CommonMsgInfo**. Это происходит потому, что такие поля сообщения, как `src`, `created_lt`, `created_at` и другие, перезаписываются валидаторами во время обработки транзакций. В данном случае поле `src` наиболее важно, поскольку при отправке сообщения адрес отправителя неизвестен, и валидаторы заполняют данное поле во время верификации. Это гарантирует, что адрес `src` достоверен и не может быть изменен.

Структура `CommonMsgInfo` поддерживает спецификацию `MsgAddress`, но так как адрес отправителя обычно неизвестен, то записывается `addr_none$00`(`00`– два нулевых бита), и в этом случае используется структура `CommonMsgInfoRelaxed`, которая поддерживает `addr_none`. Для `ext_in_msg_info` (входящие внешние сообщения) используется структура `CommonMsgInfo`, поскольку эти типы сообщений используют данные не отправителя, а [MsgAddressExt](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L100), что означает отсутствие необходимости перезаписывать данные.

:::note
Числа после символа `$` – это биты, которые необходимо хранить в начале определенной структуры, для дальнейшей идентификации этих структур при чтении (десериализации).
:::

### Создание внутреннего сообщения

Внутренние сообщения используются для передачи сообщений между смарт-контрактами. При анализе контрактов, которые отправляют сообщения, включающие написание контрактов (таких как [NFT](https://github.com/ton-blockchain/token-contract/blob/f2253cb0f0e1ae0974d7dc0cef3a62cb6e19f806/nft/nft-item.fc#L51-L56) и [Jetons](https://github.com/ton-blockchain/token-contract/blob/f2253cb0f0e1ae0974d7dc0cef3a62cb6e19f806/ft/jetton-wallet.fc#L139-L144)), часто используются следующие строки кода:

```func
var msg = begin_cell()
  .store_uint(0x18, 6) ;; or 0x10 for non-bounce
  .store_slice(to_address)
  .store_coins(amount)
  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
  ;; store something as a body
```

Рассмотрим `0x18` и `0x10`, которые представляют собой шестнадцатеричные числа, расположенные следующим образом (с учетом, что нужно выделить 6 бит): `011000` и `010000`. Это означает, что приведенный выше код можно переписать следующим образом:

```func
var msg = begin_cell()
  .store_uint(0, 1) ;; this bit indicates that we send an internal message according to int_msg_info$0  
  .store_uint(1, 1) ;; IHR Disabled
  .store_uint(1, 1) ;; or .store_uint(0, 1) for 0x10 | bounce
  .store_uint(0, 1) ;; bounced
  .store_uint(0, 2) ;; src -> two zero bits for addr_none
  .store_slice(to_address)
  .store_coins(amount)
  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
  ;; store something as a body
```

Давайте рассмотрим подробно каждый параметр:

|   Параметр   |                                                                                                                                                                                                                                                                                            Описание                                                                                                                                                                                                                                                                                           |
| :----------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| IHR Disabled |              В настоящее время отключена (это означает, что мы храним значение `1`), поскольку Мгновенная Маршрутизация Гиперкуба (Instant Hypercube Routing) реализована не полностью. Опция будет необходима, когда в сети появится большое количество [шардчейнов](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#множество-accountchains-шарды). Подробнее об IHR Disabled можно прочитать в [tblkch.pdf](https://ton.org/tblkch.pdf) (глава 2)             |
|    Bounce    | При отправке сообщений в процессе обработки смарт-контракта могут возникать различные ошибки. Чтобы избежать потери TON, необходимо установить `Bounce` значение `1` (true). В этом случае, если во время обработки транзакции возникнут ошибки в контракте, то сообщение и отправленное количество TON (за вычетом комиссии) будут возвращены отправителю. Подробнее о невозвращаемых сообщениях можно прочитать [здесь](/v3/documentation/smart-contracts/message-management/non-bounceable-messages) |
|    Bounced   |                                                                                                                                                         Возвращаемые сообщения (Bounced) – это сообщения, которые возвращаются отправителю из-за ошибки, возникшей при обработке транзакции с помощью смарт-контракта. Этот параметр сообщает о том, является ли полученное сообщение *вернувшимся*                                                                                                                                                        |
|      Src     |                                                                                                                                                                                                                                        Адрес отправителя. В этом случае записываются два нулевых бита, чтобы указать адрес `addr_none`                                                                                                                                                                                                                                        |

Следующие две строки кода:

```func
...
.store_slice(to_address)
.store_coins(amount)
...
```

- указываем получателя и количество TON для отправки.

Посмотрим на оставшиеся строки кода:

```func
...
  .store_uint(0, 1) ;; Extra currency
  .store_uint(0, 4) ;; IHR fee
  .store_uint(0, 4) ;; Forwarding fee
  .store_uint(0, 64) ;; Logical time of creation
  .store_uint(0, 32) ;; UNIX time of creation
  .store_uint(0, 1) ;; State Init
  .store_uint(0, 1) ;; Message body
  ;; store something as a body
```

|         Параметр         |                                                                                                                                                                                                                 Описание                                                                                                                                                                                                                 |
| :----------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|      Extra currency      |                                                                                                                                                       Дополнительная валюта. Это первичная реализация существующих жетонов, и в настоящее время она не используется                                                                                                                                                      |
|          IHR fee         |                                                                Комиссия IHR. Как уже говорилось, IHR в настоящее время не используется, поэтому данная комиссия всегда равна нулю. Подробнее об этом можно прочитать в [tblkch.pdf](https://ton.org/tblkch.pdf) (3.1.8)                                                               |
|      Forwarding fee      |                                                                                                                             Комиссия за пересылку сообщения. Подробнее об этом можно прочитать [здесь](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#плата-за-пересылку)                                                                                                                             |
| Logical time of creation |                                                                                                                                                                                        Время, затраченное на создание корректной очереди сообщений                                                                                                                                                                                       |
|   UNIX time of creation  |                                                                                                                                                                                                      Время создания сообщения в UNIX                                                                                                                                                                                                     |
|        State Init        |                                  Код и исходные данные для развертывания смарт-контракта. Если бит установлен в `0`, это означает, что у нас нет State Init. Но если он установлен в `1`, то необходимо записать еще один бит, который будет указывать, хранится ли State Init в той же ячейке (`0`) или записан как ссылка (`1`)                                  |
|       Message body       | Тело сообщения. Параметр определяет, как хранится тело сообщения. Иногда тело сообщения слишком велико, чтобы поместиться в само сообщение. В этом случае его следует хранить как **ссылку**, при этом бит устанавливается в `1`, чтобы показать, что тело сообщения используется в качестве ссылки. Если бит равен `0`, тело находится в той же ячейке, что и сообщение |

Значения, описанные выше (включая `src`), за исключением битов `State Init` и `Message Body`, перезаписываются валидаторами.

:::note
Если значение числа умещается в меньшее количество бит, чем установлено, то недостающие нули добавляются к левой части значения. Например, 0x18 умещается в 5 бит -> `11000`. Однако, как было сказано выше, требуется 6 бит, тогда конечный результат принимается `011000`.
:::

Приступим к формированию сообщения, которое будет отправлено с некоторым количеством Toncoin на другой кошелек V3.
Для начала, допустим, пользователь хочет отправить 0.5 TON самому себе с текстом **Hello, TON!**. Чтобы узнать как отправить сообщение с комментарием обратитесь к [этому разделу документации](/v3/documentation/smart-contracts/func/cookbook#как-отправить-простое-сообщение).

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { beginCell } from '@ton/core';

let internalMessageBody = beginCell()
  .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
  .storeStringTail("Hello, TON!") // write our text comment
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
	"github.com/xssnick/tonutils-go/tvm/cell"
)

internalMessageBody := cell.BeginCell().
  MustStoreUInt(0, 32). // write 32 zero bits to indicate that a text comment will follow
  MustStoreStringSnake("Hello, TON!"). // write our text comment
  EndCell()
```

</TabItem>
</Tabs>

Выше мы создали ячейку `InternalMessageBody`, в которой хранится тело нашего сообщения. Обратите внимание, что при хранении текста, который не помещается в одну ячейку (1023 бита), необходимо **разбить данные на несколько ячеек** в соответствии со [следующей документацией](/v3/documentation/smart-contracts/message-management/internal-messages). Однако, в нашем случае высокоуровневые библиотеки создают ячейки в соответствии с требованиями, поэтому на данном этапе об этом не стоит беспокоиться.

Затем, в соответствии с ранее изученной информацией, создается `InternalMessage`:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { toNano, Address } from '@ton/ton';

const walletAddress = Address.parse('put your wallet address');

let internalMessage = beginCell()
  .storeUint(0, 1) // indicate that it is an internal message -> int_msg_info$0
  .storeBit(1) // IHR Disabled
  .storeBit(1) // bounce
  .storeBit(0) // bounced
  .storeUint(0, 2) // src -> addr_none
  .storeAddress(walletAddress)
  .storeCoins(toNano("0.2")) // amount
  .storeBit(0) // Extra currency
  .storeCoins(0) // IHR Fee
  .storeCoins(0) // Forwarding Fee
  .storeUint(0, 64) // Logical time of creation
  .storeUint(0, 32) // UNIX time of creation
  .storeBit(0) // No State Init
  .storeBit(1) // We store Message Body as a reference
  .storeRef(internalMessageBody) // Store Message Body as a reference
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/tlb"
)

walletAddress := address.MustParseAddr("put your address")

internalMessage := cell.BeginCell().
  MustStoreUInt(0, 1). // indicate that it is an internal message -> int_msg_info$0
  MustStoreBoolBit(true). // IHR Disabled
  MustStoreBoolBit(true). // bounce
  MustStoreBoolBit(false). // bounced
  MustStoreUInt(0, 2). // src -> addr_none
  MustStoreAddr(walletAddress).
  MustStoreCoins(tlb.MustFromTON("0.2").NanoTON().Uint64()).   // amount
  MustStoreBoolBit(false). // Extra currency
  MustStoreCoins(0). // IHR Fee
  MustStoreCoins(0). // Forwarding Fee
  MustStoreUInt(0, 64). // Logical time of creation
  MustStoreUInt(0, 32). // UNIX time of creation
  MustStoreBoolBit(false). // No State Init
  MustStoreBoolBit(true). // We store Message Body as a reference
  MustStoreRef(internalMessageBody). // Store Message Body as a reference
  EndCell()
```

</TabItem>
</Tabs>

### Создание сообщения

Для начала необходимо извлечь `seqno` (порядковый номер) смарт-контракта нашего кошелька. Для этого создается `Client`, который будет использоваться для отправки запроса на выполнение GET-метода `seqno`. Также необходимо добавить seed-фразу (которую вы сохранили при создании кошелька [здесь](#-внешние-и-внутренние-сообщения)), чтобы подписать наше сообщение, выполнив следующие действия:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from '@ton/ton';
import { mnemonicToWalletKey } from '@ton/crypto';

const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC", // you can replace it on https://testnet.toncenter.com/api/v2/jsonRPC for testnet
  apiKey: "put your api key" // you can get an api key from @tonapibot bot in Telegram
});

const mnemonic = 'put your mnemonic'; // word1 word2 word3
let getMethodResult = await client.runMethod(walletAddress, "seqno"); // run "seqno" GET method from your wallet contract
let seqno = getMethodResult.stack.readNumber(); // get seqno from response

const mnemonicArray = mnemonic.split(' '); // get array from string
const keyPair = await mnemonicToWalletKey(mnemonicArray); // get Secret and Public keys from mnemonic 
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "context"
  "crypto/ed25519"
  "crypto/hmac"
  "crypto/sha512"
  "github.com/xssnick/tonutils-go/liteclient"
  "github.com/xssnick/tonutils-go/ton"
  "golang.org/x/crypto/pbkdf2"
  "log"
  "strings"
)

mnemonic := strings.Split("put your mnemonic", " ") // get our mnemonic as array

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection) // create client

block, err := client.CurrentMasterchainInfo(context.Background()) // get current block, we will need it in requests to LiteServer
if err != nil {
  log.Fatalln("CurrentMasterchainInfo err:", err.Error())
  return
}

getMethodResult, err := client.RunGetMethod(context.Background(), block, walletAddress, "seqno") // run "seqno" GET method from your wallet contract
if err != nil {
  log.Fatalln("RunGetMethod err:", err.Error())
  return
}
seqno := getMethodResult.MustInt(0) // get seqno from response

// The next three lines will extract the private key using the mnemonic phrase. We will not go into cryptographic details. With the tonutils-go library, this is all implemented, but we’re doing it again to get a full understanding.
mac := hmac.New(sha512.New, []byte(strings.Join(mnemonic, " ")))
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries "TON default seed" is used as salt when getting keys

privateKey := ed25519.NewKeyFromSeed(k)
```

</TabItem>
</Tabs>

Итак, необходимо отправить `seqno`, `keys` и `internal message`. Теперь нам нужно создать [сообщение](/v3/documentation/smart-contracts/message-management/sending-messages) для нашего кошелька и сохранить данные в этом сообщении в той последовательности, которая использовалась в начале руководства. Это делается следующим образом:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { sign } from '@ton/crypto';

let toSign = beginCell()
  .storeUint(698983191, 32) // subwallet_id | We consider this further
  .storeUint(Math.floor(Date.now() / 1e3) + 60, 32) // Message expiration time, +60 = 1 minute
  .storeUint(seqno, 32) // store seqno
  .storeUint(3, 8) // store mode of our internal message
  .storeRef(internalMessage); // store our internalMessage as a reference

let signature = sign(toSign.endCell().hash(), keyPair.secretKey); // get the hash of our message to wallet smart contract and sign it to get signature

let body = beginCell()
  .storeBuffer(signature) // store signature
  .storeBuilder(toSign) // store our message
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "time"
)

toSign := cell.BeginCell().
  MustStoreUInt(698983191, 32). // subwallet_id | We consider this further
  MustStoreUInt(uint64(time.Now().UTC().Unix()+60), 32). // Message expiration time, +60 = 1 minute
  MustStoreUInt(seqno.Uint64(), 32). // store seqno
  MustStoreUInt(uint64(3), 8). // store mode of our internal message
  MustStoreRef(internalMessage) // store our internalMessage as a reference

signature := ed25519.Sign(privateKey, toSign.EndCell().Hash()) // get the hash of our message to wallet smart contract and sign it to get signature

body := cell.BeginCell().
  MustStoreSlice(signature, 512). // store signature
  MustStoreBuilder(toSign). // store our message
  EndCell()
```

</TabItem>
</Tabs>

Обратите внимание, что здесь в `toSign` не было использовано `.endCell()`. Дело в том, что в данном случае необходимо **передать содержимое toSign непосредственно в тело сообщения**. Если бы потребовалась запись ячейки, ее пришлось бы хранить в виде ссылки.

:::tip Кошелек V4
В дополнение к базовому процессу верификации, который мы изучили для смарт-контрактов кошелька V3, смарт-контракт кошелька V4 [извлекает опкод, чтобы определить, требуется простой перевод или сообщение, связанное с плагином](https://github.com/ton-blockchain/wallet-contract/blob/4111fd9e3313ec17d99ca9b5b1656445b5b49d8f/func/wallet-v4-code.fc#L94-L100). Чтобы соответствовать этой версии, необходимо добавить функции `storeUint(0, 8)` (JS/TS), `MustStoreUInt(0, 8)` (Golang) после записи seqno и перед указанием режима транзакции.
:::

### Создание внешнего сообщения

Чтобы доставить любое внутреннее сообщение в блокчейн из внешнего мира, необходимо отправить его во внешнем сообщении. Как мы уже рассмотрели ранее, необходимо использовать только структуру `ext_in_msg_info$10`, поскольку цель в том, чтобы отправить внешнее сообщение нашему контракту. Давайте создадим внешнее сообщение, которое будет отправлено в наш кошелек:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
let externalMessage = beginCell()
  .storeUint(0b10, 2) // 0b10 -> 10 in binary
  .storeUint(0, 2) // src -> addr_none
  .storeAddress(walletAddress) // Destination address
  .storeCoins(0) // Import Fee
  .storeBit(0) // No State Init
  .storeBit(1) // We store Message Body as a reference
  .storeRef(body) // Store Message Body as a reference
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
externalMessage := cell.BeginCell().
  MustStoreUInt(0b10, 2). // 0b10 -> 10 in binary
  MustStoreUInt(0, 2). // src -> addr_none
  MustStoreAddr(walletAddress). // Destination address
  MustStoreCoins(0). // Import Fee
  MustStoreBoolBit(false). // No State Init
  MustStoreBoolBit(true). // We store Message Body as a reference
  MustStoreRef(body). // Store Message Body as a reference
  EndCell()
```

</TabItem>
</Tabs>

|   Параметр   |                                                                                                                                               Описание                                                                                                                                               |
| :----------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|      Src     |    Адрес отправителя. Поскольку входящее внешнее сообщение не может иметь отправителя, в нем всегда будет 2 нулевых бита (`addr_none` [TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L100))    |
|  Import Fee  |                                                                                                                        Комиссия для оплаты импорта входящих внешних сообщений                                                                                                                        |
|  State Init  | Начальное состояние. В отличие от внутреннего сообщения, `State Init` внутри внешнего сообщения необходимо **для развертывания контракта из внешнего мира**. `State Init`, используемый вместе с внутренним сообщением, позволяет одному контракту развернуть другой |
| Message Body |                                                                                                   Тело сообщения. Сообщение, которое должно быть отправлено в контракт на обработку                                                                                                  |

:::tip 0b10
0b10 (b – двоичный) обозначает двоичную запись. В этом процессе хранятся два бита: `1` и `0`. Таким образом, мы указываем, что это `ext_in_msg_info$10`.
:::

Теперь у нас есть готовое сообщение, которое можно отправить нашему контракту. Для этого его нужно сначала сериализовать в `BOC` ([Bag of Cells](/v3/documentation/data-formats/tlb/cell-boc#bag-of-cells)), а затем отправить с помощью следующего кода:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
console.log(externalMessage.toBoc().toString("base64"))

client.sendFile(externalMessage.toBoc());
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "encoding/base64"
  "github.com/xssnick/tonutils-go/tl"
)

log.Println(base64.StdEncoding.EncodeToString(externalMessage.ToBOCWithFlags(false)))

var resp tl.Serializable
err = client.Client().QueryLiteserver(context.Background(), ton.SendMessage{Body: externalMessage.ToBOCWithFlags(false)}, &resp)

if err != nil {
  log.Fatalln(err.Error())
  return
}
```

</TabItem>
</Tabs>

> 💡 Полезная ссылка:
>
> [Подробнее о Bag of Cells](/v3/documentation/data-formats/tlb/cell-boc#bag-of-cells)

В результате мы получили вывод нашего BOC в консоли и сообщение, отправленное на наш кошелек. Скопировав строку в кодировке base64, можно [вручную отправить наше сообщение и получить хэш с помощью toncenter](https://toncenter.com/api/v2/#/send/send_boc_return_hash_sendBocReturnHash_post).

## 👛 Развертывание кошелька

Мы изучили основы создания сообщений, которые теперь пригодятся нам для развертывания кошелька. Ранее мы разворачивали кошелек с помощью приложения кошелька, но теперь сделаем это вручную.

В этом разделе мы рассмотрим, как создать кошелек (V3) с нуля. Вы узнаете, как скомпилировать код смарт-контракта кошелька, сгенерировать мнемоническую фразу, получить адрес кошелька и развернуть кошелек с помощью внешних сообщений и State Init (инициализация состояния).

### Создание мнемоники

Первое, что необходимо для корректного создания кошелька – это получение `приватного` и `публичного` ключей. Чтобы выполнить эту задачу, необходимо сгенерировать мнемоническую seed-фразу, а затем извлечь приватный и публичный ключи с помощью криптографических библиотек.

Это делается следующим образом:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { mnemonicToWalletKey, mnemonicNew } from '@ton/crypto';

// const mnemonicArray = 'put your mnemonic'.split(' ') // get our mnemonic as array
const mnemonicArray = await mnemonicNew(24); // 24 is the number of words in a seed phrase
const keyPair = await mnemonicToWalletKey(mnemonicArray); // extract private and public keys from mnemonic
console.log(mnemonicArray) // if we want, we can print our mnemonic
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
	"crypto/ed25519"
	"crypto/hmac"
	"crypto/sha512"
	"log"
	"github.com/xssnick/tonutils-go/ton/wallet"
	"golang.org/x/crypto/pbkdf2"
	"strings"
)

// mnemonic := strings.Split("put your mnemonic", " ") // get our mnemonic as array
mnemonic := wallet.NewSeed() // get new mnemonic

// The following three lines will extract the private key using the mnemonic phrase. We will not go into cryptographic details. It has all been implemented in the tonutils-go library, but it immediately returns the finished object of the wallet with the address and ready methods. So we’ll have to write the lines to get the key separately. Goland IDE will automatically import all required libraries (crypto, pbkdf2 and others).
mac := hmac.New(sha512.New, []byte(strings.Join(mnemonic, " "))) 
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries "TON default seed" is used as salt when getting keys
// 32 is a key len 

privateKey := ed25519.NewKeyFromSeed(k) // get private key
publicKey := privateKey.Public().(ed25519.PublicKey) // get public key from private key
log.Println(publicKey) // print publicKey so that at this stage the compiler does not complain that we do not use our variable
log.Println(mnemonic) // if we want, we can print our mnemonic
```

</TabItem>
</Tabs>

Приватный ключ необходим для подписания сообщений, а публичный ключ хранится в смарт-контракте кошелька.

:::danger ВАЖНО
Необходимо вывести сгенерированную мнемоническую seed-фразу в консоль, сохранить и использовать одну и ту же пару ключей при каждом запуске кода кошелька (как использовать подробно описано в предыдущем разделе).
:::

### Идентификаторы subwallet

Одно из наиболее заметных преимуществ того, что кошельки являются смарт-контрактами – это возможность создавать **огромное количество кошельков**, используя всего один приватный ключ. Это происходит потому, что адреса смарт-контрактов в блокчейне TON вычисляются с помощью нескольких факторов, включая `stateInit`. StateInit содержит `code` и `initial data` (первичные данные), которые хранятся в хранилище смарт-контрактов блокчейна.

Изменив всего один бит в `stateInit`, можно сгенерировать другой адрес. Именно поэтому изначально был создан `subwallet_id`. `subwallet_id` хранится в хранилище контрактов и может быть использован для создания множества различных кошельков (с различными идентификаторами subwallet) с помощью одного приватного ключа. Эта функциональность может быть очень полезна при интеграции различных типов кошельков с централизованными сервисами, такими как биржи.

Значение `subwallet_id` по умолчанию равно `698983191`, согласно [строке кода](https://github.com/ton-blockchain/ton/blob/4b940f8bad9c2d3bf44f196f6995963c7cee9cc3/tonlib/tonlib/TonlibClient.cpp#L2420) ниже, взятой из исходного кода TON Blockchain:

```cpp
res.wallet_id = td::as<td::uint32>(res.config.zero_state_id.root_hash.as_slice().data());
```

Информацию о блоке genesis (`zero_state`) можно получить из [файла конфигурации](https://ton.org/global-config.json). Разбираться детально в этом не обязательно, но важно помнить, что по умолчанию значение `subwallet_id` равно `698983191`.

Контракт каждого кошелька проверяет поле `subwallet_id` для внешних сообщений, чтобы избежать случаев, когда запросы были отправлены на кошелек с другим идентификатором:

```func
var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32));
var (stored_seqno, stored_subwallet, public_key) = (ds~load_uint(32), ds~load_uint(32), ds~load_uint(256));
throw_unless(34, subwallet_id == stored_subwallet);
```

Нужно будет добавить вышеуказанное значение в `initial data` (первичные данные) контракта, поэтому переменную нужно сохранить следующим образом:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const subWallet = 698983191;
```

</TabItem>
<TabItem value="go" label="Golang">

```go
var subWallet uint64 = 698983191
```

</TabItem>
</Tabs>

### Компиляция кода кошелька

Теперь, когда у нас четко определены приватный и публичный ключи, а также subwallet_id, нужно скомпилировать код кошелька. Для этого воспользуемся кодом [wallet V3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc) из официального репозитория.

Чтобы скомпилировать код кошелька необходимо использовать библиотеку [@ton-community/func-js](https://github.com/ton-community/func-js).
С помощью этой библиотеки можно скомпилировать код FunC и получить ячейку, содержащую этот код. Чтобы начать работу, необходимо установить библиотеку и сохранить ее в `package.json` следующим образом:

```bash
npm i --save @ton-community/func-js
```

Для компиляции кода мы будем использовать только JavaScript, поскольку библиотеки для компиляции кода основаны на JavaScript.
Однако после завершения компиляции, пока у нас есть **base64-вывод** нашей ячейки, можно использовать этот скомпилированный код в таких языках, как Go и других.

Для начала нам нужно создать два файла: `wallet_v3.fc` и `stdlib.fc`. Компилятор работает с библиотекой `stdlib.fc`. Все необходимые и базовые функции, которые соответствуют инструкциям `asm`, есть в этой библиотеке. Файл `stdlib.fc` можно скачать [здесь](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc). В файл `wallet_v3.fc` необходимо скопировать приведенный выше код.

Теперь у нас есть следующая структура для создаваемого проекта:

```
.
├── src/
│   ├── main.ts
│   ├── wallet_v3.fc
│   └── stdlib.fc
├── nodemon.json
├── package-lock.json
├── package.json
└── tsconfig.json
```

:::info
Ничего страшного, если IDE-плагин конфликтует с `() set_seed(int) impure asm "SETRAND";` в файле `stdlib.fc`.
:::

Не забудьте добавить следующую строку в начало файла `wallet_v3.fc`, чтобы указать, что ниже будут использоваться функции из `stdlib`:

```func
#include "stdlib.fc";
```

Теперь давайте напишем код для компиляции смарт-контракта и запустим его с помощью команды `npm run start:dev`:

```js
import { compileFunc } from '@ton-community/func-js';
import fs from 'fs'; // we use fs for reading content of files
import { Cell } from '@ton/core';

const result = await compileFunc({
targets: ['wallet_v3.fc'], // targets of your project
sources: {
    "stdlib.fc": fs.readFileSync('./src/stdlib.fc', { encoding: 'utf-8' }),
    "wallet_v3.fc": fs.readFileSync('./src/wallet_v3.fc', { encoding: 'utf-8' }),
}
});

if (result.status === 'error') {
console.error(result.message)
return;
}

const codeCell = Cell.fromBoc(Buffer.from(result.codeBoc, "base64"))[0]; // get buffer from base64 encoded BOC and get cell from this buffer

// now we have base64 encoded BOC with compiled code in result.codeBoc
console.log('Code BOC: ' + result.codeBoc);
console.log('\nHash: ' + codeCell.hash().toString('base64')); // get the hash of cell and convert in to base64 encoded string. We will need it further
```

В результате в терминале появится следующий вывод:

```text
Code BOC: te6ccgEBCAEAhgABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQCW8oMI1xgg0x/TH9MfAvgju/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOgwAaTIyx/LH8v/ye1UAATQMAIBSAYHABe7Oc7UTQ0z8x1wv/gAEbjJftRNDXCx+A==

Hash: idlku00WfSC36ujyK2JVT92sMBEpCNRUXOGO4sJVBPA=
```

После этого можно получить ту же самую ячейку (используя вывод в кодировке base64) с помощью кода кошелька, используя другие библиотеки и языки:

<Tabs groupId="code-examples">
<TabItem value="go" label="Golang">

```go
import (
  "encoding/base64"
  "github.com/xssnick/tonutils-go/tvm/cell"
)

base64BOC := "te6ccgEBCAEAhgABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQCW8oMI1xgg0x/TH9MfAvgju/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOgwAaTIyx/LH8v/ye1UAATQMAIBSAYHABe7Oc7UTQ0z8x1wv/gAEbjJftRNDXCx+A==" // save our base64 encoded output from compiler to variable
codeCellBytes, _ := base64.StdEncoding.DecodeString(base64BOC) // decode base64 in order to get byte array
codeCell, err := cell.FromBOC(codeCellBytes) // get cell with code from byte array
if err != nil { // check if there are any error
  panic(err) 
}

log.Println("Hash:", base64.StdEncoding.EncodeToString(codeCell.Hash())) // get the hash of our cell, encode it to base64 because it has []byte type and output to the terminal
```

</TabItem>
</Tabs>

В результате в терминале появится следующий вывод:

```text
idlku00WfSC36ujyK2JVT92sMBEpCNRUXOGO4sJVBPA=
```

После завершения этих процессов подтверждается, что в нашей ячейке используется корректный код, поскольку хэши совпадают.

### Создание State Init для развертывания

Прежде чем создавать сообщение, важно понять, что такое State Init. Для начала пройдемся по [схеме TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L141-L143):

|             Параметр             |                                                                                                                                                                                                                                                               Описание                                                                                                                                                                                                                                                              |
| :------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| split_depth | Этот параметр предназначен для высоконагруженных смарт-контрактов, которые могут быть разделены и располагаться на нескольких [шардчейнах](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#множество-accountchains-шарды).  Более подробную информацию можно найти в [tblkch.pdf](https://ton.org/tblkch.pdf) (4.1.6).  Хранится только бит `0`, поскольку он используется в рамках смарт-контракта кошелька |
|              special             |       Используется для TicTok. Эти смарт-контракты автоматически вызываются для каждого блока и не требуются для обычных смарт-контрактов. Информацию об этом можно найти в [этом разделе](/v3/documentation/data-formats/tlb/transaction-layout#tick-tock) или в [tblkch.pdf](https://ton.org/tblkch.pdf) (4.1.6). В данной спецификации хранится только бит `0`, поскольку такая функция нам не требуется      |
|               code               |                                                                                                                                                                                                                                   Бит `1` означает наличие кода смарт-контракта в качестве ссылки                                                                                                                                                                                                                                   |
|               data               |                                                                                                                                                                                                                                  Бит `1` означает наличие данных смарт-контракта в качестве ссылки                                                                                                                                                                                                                                  |
|              library             |                                Библиотека, которая работает с [мастерчейном](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#мастерчейн-блокчейн-блокчейнов) и может быть использована различными смарт-контрактами. Она не будет использоваться для кошелька, поэтому бит установлен в `0`. Информацию об этом можно найти в [tblkch.pdf](https://ton.org/tblkch.pdf) (1.8.4)                               |

Далее подготовим `initial data` (первичные данные), которые будут представлены в хранилище нашего контракта сразу после развертывания:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { beginCell } from '@ton/core';

const dataCell = beginCell()
  .storeUint(0, 32) // Seqno
  .storeUint(698983191, 32) // Subwallet ID
  .storeBuffer(keyPair.publicKey) // Public Key
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
dataCell := cell.BeginCell().
  MustStoreUInt(0, 32). // Seqno
  MustStoreUInt(698983191, 32). // Subwallet ID
  MustStoreSlice(publicKey, 256). // Public Key
  EndCell()
```

</TabItem>
</Tabs>

На этом этапе присутствует как `code` контракта, так и `initial data`. С помощью этих данных мы можем создать наш **адрес кошелька**. Адрес кошелька зависит от `State Init`, которое включает в себя код и первичные данные.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address } from '@ton/core';

const stateInit = beginCell()
  .storeBit(0) // No split_depth
  .storeBit(0) // No special
  .storeBit(1) // We have code
  .storeRef(codeCell)
  .storeBit(1) // We have data
  .storeRef(dataCell)
  .storeBit(0) // No library
  .endCell();

const contractAddress = new Address(0, stateInit.hash()); // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
console.log(`Contract address: ${contractAddress.toString()}`); // Output contract address to console
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/address"
)

stateInit := cell.BeginCell().
  MustStoreBoolBit(false). // No split_depth
  MustStoreBoolBit(false). // No special
  MustStoreBoolBit(true). // We have code
  MustStoreRef(codeCell).
  MustStoreBoolBit(true). // We have data
  MustStoreRef(dataCell).
  MustStoreBoolBit(false). // No library
  EndCell()

contractAddress := address.NewAddress(0, 0, stateInit.Hash()) // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
log.Println("Contract address:", contractAddress.String()) // Output contract address to console
```

</TabItem>
</Tabs>

Используя `State Init`, мы можем создать сообщение и отправить его в блокчейн.

:::warning
To carry out this process, **a minimum wallet balance of 0.1 TON** is required (the balance can be less, but this amount is guaranteed to be sufficient). To accomplish this, we’ll need to run the code mentioned earlier in the tutorial, obtain the correct wallet address, and send 0.1 TON to this address. Alternatively, you can send this sum manually via your wallet app before sending the deployment message itself.

Развертывание с помощью внешних сообщений представлено здесь в основном в образовательных целях, на практике гораздо удобнее [разворачивать смарт-контракты через кошельки](#развертывание-контракта-через-кошелек), что будет описано позже.
:::

Давайте начнем с создания сообщения, аналогичного тому, которое мы создали **в предыдущем разделе**:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { sign } from '@ton/crypto';
import { toNano } from '@ton/core';

const internalMessageBody = beginCell()
  .storeUint(0, 32)
  .storeStringTail("Hello, TON!")
  .endCell();

const internalMessage = beginCell()
  .storeUint(0x10, 6) // no bounce
  .storeAddress(Address.parse("put your first wallet address from were you sent 0.1 TON"))
  .storeCoins(toNano("0.03"))
  .storeUint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1) // We store 1 that means we have body as a reference
  .storeRef(internalMessageBody)
  .endCell();

// message for our wallet
const toSign = beginCell()
  .storeUint(subWallet, 32)
  .storeUint(Math.floor(Date.now() / 1e3) + 60, 32)
  .storeUint(0, 32) // We put seqno = 0, because after deploying wallet will store 0 as seqno
  .storeUint(3, 8)
  .storeRef(internalMessage);

const signature = sign(toSign.endCell().hash(), keyPair.secretKey);
const body = beginCell()
  .storeBuffer(signature)
  .storeBuilder(toSign)
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/tlb"
  "time"
)

internalMessageBody := cell.BeginCell().
  MustStoreUInt(0, 32).
  MustStoreStringSnake("Hello, TON!").
  EndCell()

internalMessage := cell.BeginCell().
  MustStoreUInt(0x10, 6). // no bounce
  MustStoreAddr(address.MustParseAddr("put your first wallet address from were you sent 0.1 TON")).
  MustStoreBigCoins(tlb.MustFromTON("0.03").NanoTON()).
  MustStoreUInt(1, 1 + 4 + 4 + 64 + 32 + 1 + 1). // We store 1 that means we have body as a reference
  MustStoreRef(internalMessageBody).
  EndCell()

// message for our wallet
toSign := cell.BeginCell().
  MustStoreUInt(subWallet, 32).
  MustStoreUInt(uint64(time.Now().UTC().Unix()+60), 32).
  MustStoreUInt(0, 32). // We put seqno = 0, because after deploying wallet will store 0 as seqno
  MustStoreUInt(3, 8).
  MustStoreRef(internalMessage)

signature := ed25519.Sign(privateKey, toSign.EndCell().Hash())
body := cell.BeginCell().
  MustStoreSlice(signature, 512).
  MustStoreBuilder(toSign).
	EndCell()
```

</TabItem>
</Tabs>

После этого вы получите корректный `State Init` и `Message Body`.

### Отправка внешнего сообщения

**Основное отличие** будет заключаться в наличии внешнего сообщения, поскольку State Init хранится для того, чтобы помочь выполнить корректное развертывание контракта. Поскольку у контракта еще нет собственного кода, он не может обрабатывать никакие внутренние сообщения. Поэтому мы отправим его код и первичные данные **после того, как контракт будет успешно развернут, чтобы он смог обработать наше сообщение** с комментарием "Hello, TON!":

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const externalMessage = beginCell()
  .storeUint(0b10, 2) // indicate that it is an incoming external message
  .storeUint(0, 2) // src -> addr_none
  .storeAddress(contractAddress)
  .storeCoins(0) // Import fee
  .storeBit(1) // We have State Init
  .storeBit(1) // We store State Init as a reference
  .storeRef(stateInit) // Store State Init as a reference
  .storeBit(1) // We store Message Body as a reference
  .storeRef(body) // Store Message Body as a reference
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
externalMessage := cell.BeginCell().
  MustStoreUInt(0b10, 2). // indicate that it is an incoming external message
  MustStoreUInt(0, 2). // src -> addr_none
  MustStoreAddr(contractAddress).
  MustStoreCoins(0). // Import fee
  MustStoreBoolBit(true). // We have State Init
  MustStoreBoolBit(true).  // We store State Init as a reference
  MustStoreRef(stateInit). // Store State Init as a reference
  MustStoreBoolBit(true). // We store Message Body as a reference
  MustStoreRef(body). // Store Message Body as a reference
  EndCell()
```

</TabItem>
</Tabs>

Наконец-то, мы можем отправить сообщение в блокчейн, чтобы развернуть кошелек и использовать его.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from '@ton/ton';

const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC",
  apiKey: "put your api key" // you can get an api key from @tonapibot bot in Telegram
});

client.sendFile(externalMessage.toBoc());
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "context"
  "github.com/xssnick/tonutils-go/liteclient"
  "github.com/xssnick/tonutils-go/tl"
  "github.com/xssnick/tonutils-go/ton"
)

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection)

var resp tl.Serializable
err = client.Client().QueryLiteserver(context.Background(), ton.SendMessage{Body: externalMessage.ToBOCWithFlags(false)}, &resp)
if err != nil {
  log.Fatalln(err.Error())
  return
}
```

</TabItem>
</Tabs>

Обратите внимание, что мы отправили внутреннее сообщение, используя режим `3`. Если необходимо повторить развертывание одного и того же кошелька, **смарт-контракт можно уничтожить**. Для этого установите нужный режим, добавив 128 (забрать весь баланс смарт-контракта) + 32 (уничтожить смарт-контракт), что составит = `160` для извлечения оставшегося баланса TON и повторного развертывания кошелька.

Важно отметить, что для каждой новой транзакции **seqno нужно будет увеличить на единицу**.

:::info
Код контракта, который мы использовали – [верифицирован](https://tonscan.org/tx/BL9T1i5DjX1JRLUn4z9JOgOWRKWQ80pSNevis26hGvc=), пример можно посмотреть [здесь](https://tonscan.org/address/EQDBjzo_iQCZh3bZSxFnK9ue4hLTOKgsCNKfC8LOUM4SlSCX#source).
:::

## 💸 Работа со смарт-контрактами кошелька

Теперь мы гораздо лучше знакомы со смарт-контрактами кошелька, с тем как они разрабатываются и используются. Мы научились разворачивать и уничтожать смарт-контракты, а также отправлять сообщения без использования предварительно настроенных библиотечных функций. В следующем разделе мы сосредоточимся на создании и отправке более сложных сообщений, чтобы применить то, что мы узнали выше.

### Отправка нескольких сообщений одновременно

Как вы, возможно, уже знаете, [одна ячейка может хранить до 1023 бит данных и до 4 ссылок](/v3/documentation/data-formats/tlb/cell-boc#cell) на другие ячейки. Ранее мы подробно описали, как внутренние сообщения извлекаются в "полном" цикле в виде ссылки, после чего отправляются в виде сообщения. Это означает, что внутри внешнего сообщения можно **хранить до 4 внутренних сообщений**. Это позволяет отправлять четыре сообщения одновременно.

Для этого необходимо создать 4 разных внутренних сообщения. Мы можем сделать это вручную или с помощью цикла – `loop`. Сначала нужно определить 3 массива: массив количества TON, массив комментариев, массив сообщений. Для сообщений нужно подготовить еще один массив – internalMessages.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Cell } from '@ton/core';

const internalMessagesAmount = ["0.01", "0.02", "0.03", "0.04"];
const internalMessagesComment = [
  "Hello, TON! #1",
  "Hello, TON! #2",
  "", // Let's leave the third message without comment
  "Hello, TON! #4" 
]
const destinationAddresses = [
  "Put any address that belongs to you",
  "Put any address that belongs to you",
  "Put any address that belongs to you",
  "Put any address that belongs to you"
] // All 4 addresses can be the same

let internalMessages:Cell[] = []; // array for our internal messages
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/tvm/cell"
)

internalMessagesAmount := [4]string{"0.01", "0.02", "0.03", "0.04"}
internalMessagesComment := [4]string{
  "Hello, TON! #1",
  "Hello, TON! #2",
  "", // Let's leave the third message without comment
  "Hello, TON! #4",
}
destinationAddresses := [4]string{
  "Put any address that belongs to you",
  "Put any address that belongs to you",
  "Put any address that belongs to you",
  "Put any address that belongs to you",
} // All 4 addresses can be the same

var internalMessages [len(internalMessagesAmount)]*cell.Cell // array for our internal messages
```

</TabItem>
</Tabs>

[Режим отправки](/v3/documentation/smart-contracts/message-management/sending-messages#режимы-сообщений) для всех сообщений установлен на `mode 3`.  Однако, если требуются разные режимы, можно создать массив для выполнения различных целей.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address, beginCell, toNano } from '@ton/core';

for (let index = 0; index < internalMessagesAmount.length; index++) {
  const amount = internalMessagesAmount[index];
  
  let internalMessage = beginCell()
      .storeUint(0x18, 6) // bounce
      .storeAddress(Address.parse(destinationAddresses[index]))
      .storeCoins(toNano(amount))
      .storeUint(0, 1 + 4 + 4 + 64 + 32 + 1);
      
  /*
      At this stage, it is not clear if we will have a message body. 
      So put a bit only for stateInit, and if we have a comment, in means 
      we have a body message. In that case, set the bit to 1 and store the 
      body as a reference.
  */

  if(internalMessagesComment[index] != "") {
    internalMessage.storeBit(1) // we store Message Body as a reference

    let internalMessageBody = beginCell()
      .storeUint(0, 32)
      .storeStringTail(internalMessagesComment[index])
      .endCell();

    internalMessage.storeRef(internalMessageBody);
  } 
  else 
    /*
        Since we do not have a message body, we indicate that 
        the message body is in this message, but do not write it, 
        which means it is absent. In that case, just set the bit to 0.
    */
    internalMessage.storeBit(0);
  
  internalMessages.push(internalMessage.endCell());
}
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/tlb"
)

for i := 0; i < len(internalMessagesAmount); i++ {
  amount := internalMessagesAmount[i]

  internalMessage := cell.BeginCell().
    MustStoreUInt(0x18, 6). // bounce
    MustStoreAddr(address.MustParseAddr(destinationAddresses[i])).
    MustStoreBigCoins(tlb.MustFromTON(amount).NanoTON()).
    MustStoreUInt(0, 1+4+4+64+32+1)

  /*
      At this stage, it is not clear if we will have a message body. 
      So put a bit only for stateInit, and if we have a comment, in means 
      we have a body message. In that case, set the bit to 1 and store the 
      body as a reference.
  */

  if internalMessagesComment[i] != "" {
    internalMessage.MustStoreBoolBit(true) // we store Message Body as a reference

    internalMessageBody := cell.BeginCell().
      MustStoreUInt(0, 32).
      MustStoreStringSnake(internalMessagesComment[i]).
      EndCell()

    internalMessage.MustStoreRef(internalMessageBody)
  } else {
    /*
        Since we do not have a message body, we indicate that
        the message body is in this message, but do not write it,
        which means it is absent. In that case, just set the bit to 0.
    */
    internalMessage.MustStoreBoolBit(false)
  }
  internalMessages[i] = internalMessage.EndCell()
}
```

</TabItem>
</Tabs>

Теперь давайте воспользуемся знаниями из [предыдущего раздела](#-развертывание-кошелька), чтобы создать сообщение для кошелька, которое может отправлять 4 сообщения одновременно:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from '@ton/ton';
import { mnemonicToWalletKey } from '@ton/crypto';

const walletAddress = Address.parse('put your wallet address');
const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC",
  apiKey: "put your api key" // you can get an api key from @tonapibot bot in Telegram
});

const mnemonic = 'put your mnemonic'; // word1 word2 word3
let getMethodResult = await client.runMethod(walletAddress, "seqno"); // run "seqno" GET method from your wallet contract
let seqno = getMethodResult.stack.readNumber(); // get seqno from response

const mnemonicArray = mnemonic.split(' '); // get array from string
const keyPair = await mnemonicToWalletKey(mnemonicArray); // get Secret and Public keys from mnemonic 

let toSign = beginCell()
  .storeUint(698983191, 32) // subwallet_id
  .storeUint(Math.floor(Date.now() / 1e3) + 60, 32) // Message expiration time, +60 = 1 minute
  .storeUint(seqno, 32); // store seqno
  // Do not forget that if we use Wallet V4, we need to add .storeUint(0, 8) 
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
	"context"
	"crypto/ed25519"
	"crypto/hmac"
	"crypto/sha512"
	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/ton"
	"golang.org/x/crypto/pbkdf2"
	"log"
	"strings"
	"time"
)

walletAddress := address.MustParseAddr("put your wallet address")

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection)

mnemonic := strings.Split("put your mnemonic", " ") // word1 word2 word3
// The following three lines will extract the private key using the mnemonic phrase.
// We will not go into cryptographic details. In the library tonutils-go, it is all implemented,
// but it immediately returns the finished object of the wallet with the address and ready-made methods.
// So we’ll have to write the lines to get the key separately. Goland IDE will automatically import
// all required libraries (crypto, pbkdf2 and others).
mac := hmac.New(sha512.New, []byte(strings.Join(mnemonic, " ")))
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries "TON default seed" is used as salt when getting keys
// 32 is a key len
privateKey := ed25519.NewKeyFromSeed(k)              // get private key

block, err := client.CurrentMasterchainInfo(context.Background()) // get current block, we will need it in requests to LiteServer
if err != nil {
  log.Fatalln("CurrentMasterchainInfo err:", err.Error())
  return
}

getMethodResult, err := client.RunGetMethod(context.Background(), block, walletAddress, "seqno") // run "seqno" GET method from your wallet contract
if err != nil {
  log.Fatalln("RunGetMethod err:", err.Error())
  return
}
seqno := getMethodResult.MustInt(0) // get seqno from response

toSign := cell.BeginCell().
  MustStoreUInt(698983191, 32). // subwallet_id | We consider this further
  MustStoreUInt(uint64(time.Now().UTC().Unix()+60), 32). // message expiration time, +60 = 1 minute
  MustStoreUInt(seqno.Uint64(), 32) // store seqno
  // Do not forget that if we use Wallet V4, we need to add MustStoreUInt(0, 8). 
```

</TabItem>
</Tabs>

Далее добавим сообщения, которые мы создали ранее в цикле:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
for (let index = 0; index < internalMessages.length; index++) {
  const internalMessage = internalMessages[index];
  toSign.storeUint(3, 8) // store mode of our internal message
  toSign.storeRef(internalMessage) // store our internalMessage as a reference
}
```

</TabItem>
<TabItem value="go" label="Golang">

```go
for i := 0; i < len(internalMessages); i++ {
		internalMessage := internalMessages[i]
		toSign.MustStoreUInt(3, 8) // store mode of our internal message
		toSign.MustStoreRef(internalMessage) // store our internalMessage as a reference
}
```

</TabItem>
</Tabs>

Теперь, когда все вышеперечисленные процессы завершены, давайте **подпишем** наше сообщение, **создадим внешнее сообщение** (как описано в предыдущих разделах этого руководства) и **отправим его** в блокчейн:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { sign } from '@ton/crypto';

let signature = sign(toSign.endCell().hash(), keyPair.secretKey); // get the hash of our message to wallet smart contract and sign it to get signature

let body = beginCell()
    .storeBuffer(signature) // store signature
    .storeBuilder(toSign) // store our message
    .endCell();

let externalMessage = beginCell()
    .storeUint(0b10, 2) // ext_in_msg_info$10
    .storeUint(0, 2) // src -> addr_none
    .storeAddress(walletAddress) // Destination address
    .storeCoins(0) // Import Fee
    .storeBit(0) // No State Init
    .storeBit(1) // We store Message Body as a reference
    .storeRef(body) // Store Message Body as a reference
    .endCell();

client.sendFile(externalMessage.toBoc());
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/tl"
)

signature := ed25519.Sign(privateKey, toSign.EndCell().Hash()) // get the hash of our message to wallet smart contract and sign it to get signature

body := cell.BeginCell().
  MustStoreSlice(signature, 512). // store signature
  MustStoreBuilder(toSign). // store our message
  EndCell()

externalMessage := cell.BeginCell().
  MustStoreUInt(0b10, 2). // ext_in_msg_info$10
  MustStoreUInt(0, 2). // src -> addr_none
  MustStoreAddr(walletAddress). // Destination address
  MustStoreCoins(0). // Import Fee
  MustStoreBoolBit(false). // No State Init
  MustStoreBoolBit(true). // We store Message Body as a reference
  MustStoreRef(body). // Store Message Body as a reference
  EndCell()

var resp tl.Serializable
err = client.Client().QueryLiteserver(context.Background(), ton.SendMessage{Body: externalMessage.ToBOCWithFlags(false)}, &resp)

if err != nil {
  log.Fatalln(err.Error())
  return
}
```

</TabItem>
</Tabs>

:::info Ошибка соединения
Если возникает ошибка, связанная с подключением к lite-серверу (Golang), код должен выполняться до тех пор, пока сообщение не будет отправлено. Это происходит потому, что библиотека tonutils-go использует несколько различных lite-серверов через глобальную конфигурацию, которая была указана в коде. Однако не все lite-серверы могут принять наше соединение.
:::

После завершения данного процесса можно воспользоваться обозревателем блокчейна TON, чтобы убедиться, что кошелек отправил четыре сообщения на указанные ранее адреса.

### Передача NFT

Помимо обычных сообщений, пользователи часто отправляют друг другу NFT. К сожалению, не все библиотеки содержат методы, адаптированные для работы с этим типом смарт-контрактов. Поэтому необходимо создать код, который позволит нам выстроить сообщение для отправки NFT. Для начала давайте познакомимся с [NFT-стандартом](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md) TON.

Давайте детально рассмотрим схему TL-B для [NFT Transfers](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#1-transfer):

- `query_id` – Идентификатор запроса не имеет никакого значения с точки зрения обработки сообщения. Контракт NFT не подтверждает его, а только считывает. Значение идентификатора может быть полезно, когда сервис хочет присвоить каждому своему сообщению определённый ID запроса для идентификации. Поэтому мы установим его в 0.

- `response_destination` – После обработки сообщения о смене владельца появятся дополнительные TON. Они будут отправлены по этому адресу, если он указан, в противном случае останутся на балансе NFT.

- `custom_payload` – Необходимо для выполнения специфических задач и не используется с обычными NFT.

- `forward_amount` – Если значение forward_amount не равно нулю, указанное количество TON будет отправлено новому владельцу. Таким образом, новый владелец будет уведомлен о том, что он что-то получил.

- `forward_payload` – Дополнительные данные, которые могут быть отправлены новому владельцу вместе с `forward_amount`. Например, использование `forward_payload` позволяет пользователям [добавить комментарий во время передачи NFT](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#forward_payload-format), как было отмечено в руководстве ранее. Однако, несмотря на то, что `forward_payload` написан в рамках стандарта TON для NFT, блокчейн-обозреватели не полностью поддерживают отображение различных деталей. Такая же проблема существует и при отображении жетонов.

Теперь давайте создадим само сообщение:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address, beginCell, toNano } from '@ton/core';

const destinationAddress = Address.parse("put your wallet where you want to send NFT");
const walletAddress = Address.parse("put your wallet which is the owner of NFT")
const nftAddress = Address.parse("put your nft address");

// We can add a comment, but it will not be displayed in the explorers, 
// as it is not supported by them at the time of writing the tutorial.
const forwardPayload = beginCell()
  .storeUint(0, 32)
  .storeStringTail("Hello, TON!")
  .endCell();

const transferNftBody = beginCell()
  .storeUint(0x5fcc3d14, 32) // Opcode for NFT transfer
  .storeUint(0, 64) // query_id
  .storeAddress(destinationAddress) // new_owner
  .storeAddress(walletAddress) // response_destination for excesses
  .storeBit(0) // we do not have custom_payload
  .storeCoins(toNano("0.01")) // forward_amount
  .storeBit(1) // we store forward_payload as a reference
  .storeRef(forwardPayload) // store forward_payload as a .reference
  .endCell();

const internalMessage = beginCell().
  storeUint(0x18, 6). // bounce
  storeAddress(nftAddress).
  storeCoins(toNano("0.05")).
  storeUint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1). // We store 1 that means we have body as a reference
  storeRef(transferNftBody).
  endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/tlb"
  "github.com/xssnick/tonutils-go/tvm/cell"
)

destinationAddress := address.MustParseAddr("put your wallet where you want to send NFT")
walletAddress := address.MustParseAddr("put your wallet which is the owner of NFT")
nftAddress := address.MustParseAddr("put your nft address")

// We can add a comment, but it will not be displayed in the explorers,
// as it is not supported by them at the time of writing the tutorial.
forwardPayload := cell.BeginCell().
  MustStoreUInt(0, 32).
  MustStoreStringSnake("Hello, TON!").
  EndCell()

transferNftBody := cell.BeginCell().
  MustStoreUInt(0x5fcc3d14, 32). // Opcode for NFT transfer
  MustStoreUInt(0, 64). // query_id
  MustStoreAddr(destinationAddress). // new_owner
  MustStoreAddr(walletAddress). // response_destination for excesses
  MustStoreBoolBit(false). // we do not have custom_payload
  MustStoreBigCoins(tlb.MustFromTON("0.01").NanoTON()). // forward_amount
  MustStoreBoolBit(true). // we store forward_payload as a reference
  MustStoreRef(forwardPayload). // store forward_payload as a reference
  EndCell()

internalMessage := cell.BeginCell().
  MustStoreUInt(0x18, 6). // bounce
  MustStoreAddr(nftAddress).
  MustStoreBigCoins(tlb.MustFromTON("0.05").NanoTON()).
  MustStoreUInt(1, 1 + 4 + 4 + 64 + 32 + 1 + 1). // We store 1 that means we have body as a reference
  MustStoreRef(transferNftBody).
  EndCell()
```

</TabItem>
</Tabs>

Опкод передачи NFT взят из [того же самого стандарта](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#tl-b-schema).
Теперь давайте завершим сообщение, как было изложено в предыдущих разделах этого руководства. Корректный код, необходимый для завершения сообщения, находится в [репозитории GitHub](/v3/guidelines/smart-contracts/howto/wallet#-исходный-код).

Такую же процедуру можно выполнить и с жетонами. Подробнее читайте в TL-B-стандарте о переводе жетонов [jetton-standart](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md). На данный момент существует небольшая разница между передачей NFT и жетонов.

### GET-методы кошелька V3 и V4

Смарт-контракты часто используют [GET-методы](/v3/guidelines/smart-contracts/get-methods), однако они работают на стороне клиента, а не внутри блокчейна. GET-методы имеют множество применений и обеспечивают смарт-контрактам доступ к различным типам данных. Например, метод [get_nft_data() в смарт-контрактах NFT](https://github.com/ton-blockchain/token-contract/blob/991bdb4925653c51b0b53ab212c53143f71f5476/nft/nft-item.fc#L142-L145) позволяет пользователям получать информацию о владельце, коллекции NFT, содержимом `content`.

Ниже мы познакомимся с основными GET-методами, используемыми в [V3](https://github.com/ton-blockchain/ton/blob/e37583e5e6e8cd0aebf5142ef7d8db282f10692b/crypto/smartcont/wallet3-code.fc#L31-L41) и [V4](https://github.com/ton-blockchain/wallet-contract/blob/4111fd9e3313ec17d99ca9b5b1656445b5b49d8f/func/wallet-v4-code.fc#L164-L198). Начнем с методов, которые одинаковы для обеих версий кошелька:

|                                       Метод                                       |                                                                                                                                                                      Описание                                                                                                                                                                      |
| :-------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                           int seqno()                          |                                                                             Необходим для получения текущего seqno и отправки сообщений с корректным значением. Этот метод вызывался довольно часто в предыдущих разделах руководства.                                                                             |
| int get_public_key() | Используется для получения публичного ключа. Метод get_public_key() не имеет широкого применения и может использоваться различными сервисами. Например, некоторые API-сервисы позволяют получить множество кошельков с одним и тем же открытым ключом |

Теперь давайте перейдем к методам, которые использует только кошелек V4:

|                                                               Метод                                                              |                                                                                                                                    Описание                                                                                                                                   |
| :------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                        int get_subwallet_id()                       |                                                                     Этот метод мы уже рассматривали ранее в руководстве, он позволяет получить subwallet_id – идентификатор subwallet                                                                    |
| int is_plugin_installed(int wc, int addr_hash) | Нужен для передачи в блокчейн данных об установке плагина. Для вызова этого метода необходимо передать [воркчейн](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#воркчейн-блокчейн-с-вашими-собственными-правилами) и хэш адреса плагина |
|                       tuple get_plugin_list()                       |                                                                                                                    Возвращает адрес установленных плагинов                                                                                                                    |

Давайте рассмотрим методы `get_public_key` и `is_plugin_installed`. Эти два метода были выбраны потому, что сначала нужно извлечь публичный ключ из данных длиной 256 бит, а затем научиться передавать *slice* – срез полученных данных, а также различные типы данных в GET-методы. Это очень удобно и должно помочь в правильном использовании данных методов.

Сначала нам нужен клиент, способный отправлять запросы. Поэтому в качестве примера мы будем использовать адрес конкретного кошелька ([EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF](https://tonscan.org/address/EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF)):

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from '@ton/ton';
import { Address } from '@ton/core';

const client = new TonClient({
    endpoint: "https://toncenter.com/api/v2/jsonRPC",
    apiKey: "put your api key" // you can get an api key from @tonapibot bot in Telegram
});

const walletAddress = Address.parse("EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF"); // my wallet address as an example
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "context"
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/liteclient"
  "github.com/xssnick/tonutils-go/ton"
  "log"
)

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection)

block, err := client.CurrentMasterchainInfo(context.Background()) // get current block, we will need it in requests to LiteServer
if err != nil {
  log.Fatalln("CurrentMasterchainInfo err:", err.Error())
  return
}

walletAddress := address.MustParseAddr("EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF") // my wallet address as an example
```

</TabItem>
</Tabs>

Теперь нам нужно вызвать GET-метода кошелька.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
// I always call runMethodWithError instead of runMethod to be able to check the exit_code of the called method. 
let getResult = await client.runMethodWithError(walletAddress, "get_public_key"); // run get_public_key GET Method
const publicKeyUInt = getResult.stack.readBigNumber(); // read answer that contains uint256
const publicKey = publicKeyUInt.toString(16); // get hex string from bigint (uint256)
console.log(publicKey)
```

</TabItem>
<TabItem value="go" label="Golang">

```go
getResult, err := client.RunGetMethod(context.Background(), block, walletAddress, "get_public_key") // run get_public_key GET Method
if err != nil {
	log.Fatalln("RunGetMethod err:", err.Error())
	return
}

// We have a response as an array with values and should specify the index when reading it
// In the case of get_public_key, we have only one returned value that is stored at 0 index
publicKeyUInt := getResult.MustInt(0) // read answer that contains uint256
publicKey := publicKeyUInt.Text(16)   // get hex string from bigint (uint256)
log.Println(publicKey)
```

</TabItem>
</Tabs>

Успешным завершением вызова будет очень большое 256-битное число, которое необходимо перевести в строку шестнадцатеричного формата. Результирующая строка для адреса кошелька, который мы указали выше, выглядит следующим образом: `430db39b13cf3cb76bfa818b6b13417b82be2c6c389170fbe06795c71996b1f8`.
Далее используем [TonAPI](https://docs.tonconsole.com/tonapi/rest-api) (метод /v1/wallet/findByPubkey), вводя полученную шестнадцатеричную строку в систему, и сразу становится ясно, что первый элемент массива в ответе будет идентифицировать наш кошелек.

Затем переходим к методу `is_plugin_installed`. В качестве примера мы будем снова использовать кошелек, который использовали ранее ([EQAM7M--HGyfxlErAIUODrxBA3yj5roBeYiTuy6BHgJ3Sx8k](https://tonscan.org/address/EQAM7M--HGyfxlErAIUODrxBA3yj5roBeYiTuy6BHgJ3Sx8k)) и плагин ([EQBTKTis-SWYdupy99ozeOvnEBu8LRrQP_N9qwOTSAy3sQSZ](https://tonscan.org/address/EQBTKTis-SWYdupy99ozeOvnEBu8LRrQP_N9qwOTSAy3sQSZ)):

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const oldWalletAddress = Address.parse("EQAM7M--HGyfxlErAIUODrxBA3yj5roBeYiTuy6BHgJ3Sx8k"); // my old wallet address
const subscriptionAddress = Address.parseFriendly("EQBTKTis-SWYdupy99ozeOvnEBu8LRrQP_N9qwOTSAy3sQSZ"); // subscription plugin address which is already installed on the wallet
```

</TabItem>
<TabItem value="go" label="Golang">

```go
oldWalletAddress := address.MustParseAddr("EQAM7M--HGyfxlErAIUODrxBA3yj5roBeYiTuy6BHgJ3Sx8k")
subscriptionAddress := address.MustParseAddr("EQBTKTis-SWYdupy99ozeOvnEBu8LRrQP_N9qwOTSAy3sQSZ") // subscription plugin address which is already installed on the wallet
```

</TabItem>
</Tabs>

Теперь нужно получить хэш-адрес плагина, чтобы перевести его в число и отправить в GET-метод.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const hash = BigInt(`0x${subscriptionAddress.address.hash.toString("hex")}`) ;

getResult = await client.runMethodWithError(oldWalletAddress, "is_plugin_installed", 
[
    {type: "int", value: BigInt("0")}, // pass workchain as int
    {type: "int", value: hash} // pass plugin address hash as int
]);
console.log(getResult.stack.readNumber()); // -1
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "math/big"
)

hash := big.NewInt(0).SetBytes(subscriptionAddress.Data())
// runGetMethod will automatically identify types of passed values
getResult, err = client.RunGetMethod(context.Background(), block, oldWalletAddress,
  "is_plugin_installed",
  0,    // pass workchain
  hash) // pass plugin address
if err != nil {
  log.Fatalln("RunGetMethod err:", err.Error())
  return
}

log.Println(getResult.MustInt(0)) // -1
```

</TabItem>
</Tabs>

Ответ должен быть `-1`, что будет означать, что результат истина. При необходимости можно также передать только срез и ячейку. Для этого достаточно создать `Slice` или `Cell` и передать их вместо использования BigInt, указав соответствующий тип.

### Развертывание контракта через кошелек

В предыдущей главе мы развернули кошелек: для этого мы отправили несколько TON, а затем сообщение из кошелька – для развертывания смарт-контракта. Однако этот процесс не очень широко используется с внешними сообщениями и часто применяется только для кошельков. При разработке контрактов процесс развертывания инициализируется путем отправки внутренних сообщений.

Для этого мы воспользуемся смарт-контрактом кошелька V3R2, который использовался в [предыдущей главе](/v3/guidelines/smart-contracts/howto/wallet#компиляция-кода-кошелька).
В этом случае для `subwallet_id` нужно установить значение `3` или любое другое число, необходимое для получения другого адреса при использовании того же приватного ключа (его можно менять):

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { beginCell, Cell } from '@ton/core';
import { mnemonicToWalletKey } from '@ton/crypto';

const mnemonicArray = 'put your mnemonic'.split(" ");
const keyPair = await mnemonicToWalletKey(mnemonicArray); // extract private and public keys from mnemonic

const codeCell = Cell.fromBase64('te6ccgEBCAEAhgABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQCW8oMI1xgg0x/TH9MfAvgju/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOgwAaTIyx/LH8v/ye1UAATQMAIBSAYHABe7Oc7UTQ0z8x1wv/gAEbjJftRNDXCx+A==');
const dataCell = beginCell()
    .storeUint(0, 32) // Seqno
    .storeUint(3, 32) // Subwallet ID
    .storeBuffer(keyPair.publicKey) // Public Key
    .endCell();

const stateInit = beginCell()
    .storeBit(0) // No split_depth
    .storeBit(0) // No special
    .storeBit(1) // We have code
    .storeRef(codeCell)
    .storeBit(1) // We have data
    .storeRef(dataCell)
    .storeBit(0) // No library
    .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "crypto/ed25519"
  "crypto/hmac"
  "crypto/sha512"
  "encoding/base64"
  "github.com/xssnick/tonutils-go/tvm/cell"
  "golang.org/x/crypto/pbkdf2"
  "strings"
)

mnemonicArray := strings.Split("put your mnemonic", " ")
// The following three lines will extract the private key using the mnemonic phrase.
// We will not go into cryptographic details. In the library tonutils-go, it is all implemented,
// but it immediately returns the finished object of the wallet with the address and ready-made methods.
// So we’ll have to write the lines to get the key separately. Goland IDE will automatically import
// all required libraries (crypto, pbkdf2 and others).
mac := hmac.New(sha512.New, []byte(strings.Join(mnemonicArray, " ")))
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries "TON default seed" is used as salt when getting keys
// 32 is a key len
privateKey := ed25519.NewKeyFromSeed(k)              // get private key
publicKey := privateKey.Public().(ed25519.PublicKey) // get public key from private key

BOCBytes, _ := base64.StdEncoding.DecodeString("te6ccgEBCAEAhgABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQCW8oMI1xgg0x/TH9MfAvgju/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOgwAaTIyx/LH8v/ye1UAATQMAIBSAYHABe7Oc7UTQ0z8x1wv/gAEbjJftRNDXCx+A==")
codeCell, _ := cell.FromBOC(BOCBytes)
dataCell := cell.BeginCell().
  MustStoreUInt(0, 32).           // Seqno
  MustStoreUInt(3, 32).           // Subwallet ID
  MustStoreSlice(publicKey, 256). // Public Key
  EndCell()

stateInit := cell.BeginCell().
  MustStoreBoolBit(false). // No split_depth
  MustStoreBoolBit(false). // No special
  MustStoreBoolBit(true).  // We have code
  MustStoreRef(codeCell).
  MustStoreBoolBit(true). // We have data
  MustStoreRef(dataCell).
  MustStoreBoolBit(false). // No library
  EndCell()
```

</TabItem>
</Tabs>

Далее мы получим адрес из нашего контракта и создадим InternalMessage. Также добавим комментарий "Deploying..." к нашему сообщению.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address, toNano } from '@ton/core';

const contractAddress = new Address(0, stateInit.hash()); // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
console.log(`Contract address: ${contractAddress.toString()}`); // Output contract address to console

const internalMessageBody = beginCell()
    .storeUint(0, 32)
    .storeStringTail('Deploying...')
    .endCell();

const internalMessage = beginCell()
    .storeUint(0x10, 6) // no bounce
    .storeAddress(contractAddress)
    .storeCoins(toNano('0.01'))
    .storeUint(0, 1 + 4 + 4 + 64 + 32)
    .storeBit(1) // We have State Init
    .storeBit(1) // We store State Init as a reference
    .storeRef(stateInit) // Store State Init as a reference
    .storeBit(1) // We store Message Body as a reference
    .storeRef(internalMessageBody) // Store Message Body Init as a reference
    .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/tlb"
  "log"
)

contractAddress := address.NewAddress(0, 0, stateInit.Hash()) // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
log.Println("Contract address:", contractAddress.String())   // Output contract address to console

internalMessageBody := cell.BeginCell().
  MustStoreUInt(0, 32).
  MustStoreStringSnake("Deploying...").
  EndCell()

internalMessage := cell.BeginCell().
  MustStoreUInt(0x10, 6). // no bounce
  MustStoreAddr(contractAddress).
  MustStoreBigCoins(tlb.MustFromTON("0.01").NanoTON()).
  MustStoreUInt(0, 1+4+4+64+32).
  MustStoreBoolBit(true).            // We have State Init
  MustStoreBoolBit(true).            // We store State Init as a reference
  MustStoreRef(stateInit).           // Store State Init as a reference
  MustStoreBoolBit(true).            // We store Message Body as a reference
  MustStoreRef(internalMessageBody). // Store Message Body Init as a reference
  EndCell()
```

</TabItem>
</Tabs>

:::info
Обратите внимание, что выше были указаны биты, а `stateInit` и `internalMessageBody` были сохранены как ссылки. Поскольку ссылки хранятся отдельно, мы можем написать `4 (0b100) + 2 (0b10) + 1 (0b1) -> (4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1)`, что означает `(0b111, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)`, а затем сохранить две ссылки.
:::

Далее подготовим сообщение для нашего кошелька и отправим его:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from '@ton/ton';
import { sign } from '@ton/crypto';

const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    apiKey: 'put your api key' // you can get an api key from @tonapibot bot in Telegram
});

const walletMnemonicArray = 'put your mnemonic'.split(' ');
const walletKeyPair = await mnemonicToWalletKey(walletMnemonicArray); // extract private and public keys from mnemonic
const walletAddress = Address.parse('put your wallet address with which you will deploy');
const getMethodResult = await client.runMethod(walletAddress, 'seqno'); // run "seqno" GET method from your wallet contract
const seqno = getMethodResult.stack.readNumber(); // get seqno from response

// message for our wallet
const toSign = beginCell()
    .storeUint(698983191, 32) // subwallet_id
    .storeUint(Math.floor(Date.now() / 1e3) + 60, 32) // Message expiration time, +60 = 1 minute
    .storeUint(seqno, 32) // store seqno
    // Do not forget that if we use Wallet V4, we need to add .storeUint(0, 8) 
    .storeUint(3, 8)
    .storeRef(internalMessage);

const signature = sign(toSign.endCell().hash(), walletKeyPair.secretKey); // get the hash of our message to wallet smart contract and sign it to get signature
const body = beginCell()
    .storeBuffer(signature) // store signature
    .storeBuilder(toSign) // store our message
    .endCell();

const external = beginCell()
    .storeUint(0b10, 2) // indicate that it is an incoming external message
    .storeUint(0, 2) // src -> addr_none
    .storeAddress(walletAddress)
    .storeCoins(0) // Import fee
    .storeBit(0) // We do not have State Init
    .storeBit(1) // We store Message Body as a reference
    .storeRef(body) // Store Message Body as a reference
    .endCell();

console.log(external.toBoc().toString('base64'));
client.sendFile(external.toBoc());
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "context"
  "github.com/xssnick/tonutils-go/liteclient"
  "github.com/xssnick/tonutils-go/tl"
  "github.com/xssnick/tonutils-go/ton"
  "time"
)

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection)

block, err := client.CurrentMasterchainInfo(context.Background()) // get current block, we will need it in requests to LiteServer
if err != nil {
  log.Fatalln("CurrentMasterchainInfo err:", err.Error())
  return
}

walletMnemonicArray := strings.Split("put your mnemonic", " ")
mac = hmac.New(sha512.New, []byte(strings.Join(walletMnemonicArray, " ")))
hash = mac.Sum(nil)
k = pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries "TON default seed" is used as salt when getting keys
// 32 is a key len
walletPrivateKey := ed25519.NewKeyFromSeed(k) // get private key
walletAddress := address.MustParseAddr("put your wallet address with which you will deploy")

getMethodResult, err := client.RunGetMethod(context.Background(), block, walletAddress, "seqno") // run "seqno" GET method from your wallet contract
if err != nil {
  log.Fatalln("RunGetMethod err:", err.Error())
  return
}
seqno := getMethodResult.MustInt(0) // get seqno from response

toSign := cell.BeginCell().
  MustStoreUInt(698983191, 32).                          // subwallet_id | We consider this further
  MustStoreUInt(uint64(time.Now().UTC().Unix()+60), 32). // message expiration time, +60 = 1 minute
  MustStoreUInt(seqno.Uint64(), 32).                     // store seqno
  // Do not forget that if we use Wallet V4, we need to add MustStoreUInt(0, 8).
  MustStoreUInt(3, 8).          // store mode of our internal message
  MustStoreRef(internalMessage) // store our internalMessage as a reference

signature := ed25519.Sign(walletPrivateKey, toSign.EndCell().Hash()) // get the hash of our message to wallet smart contract and sign it to get signature

body := cell.BeginCell().
  MustStoreSlice(signature, 512). // store signature
  MustStoreBuilder(toSign).       // store our message
  EndCell()

externalMessage := cell.BeginCell().
  MustStoreUInt(0b10, 2).       // ext_in_msg_info$10
  MustStoreUInt(0, 2).          // src -> addr_none
  MustStoreAddr(walletAddress). // Destination address
  MustStoreCoins(0).            // Import Fee
  MustStoreBoolBit(false).      // No State Init
  MustStoreBoolBit(true).       // We store Message Body as a reference
  MustStoreRef(body).           // Store Message Body as a reference
  EndCell()

var resp tl.Serializable
err = client.Client().QueryLiteserver(context.Background(), ton.SendMessage{Body: externalMessage.ToBOCWithFlags(false)}, &resp)

if err != nil {
  log.Fatalln(err.Error())
  return
}
```

</TabItem>
</Tabs>

На этом мы завершаем работу с обычными кошельками. На данном этапе вы должны хорошо понимать, как взаимодействовать со смарт-контрактами кошелька, отправлять сообщения и уметь использовать различные типы библиотек.

## 🔥 Highload Wallet V3

При работе с большим количеством сообщений за короткий промежуток времени возникает необходимость в специальном кошельке, который называется Highload Wallet (highload-кошелек). Highload-кошелек V2 долгое время был основным кошельком на TON, но его использование требует осторожности, так как вы можете [заблокировать все средства](https://t.me/tonstatus/88).

[С появлением highload-кошелька V3](https://github.com/ton-blockchain/highload-wallet-contract-v3) этот вопрос был решен на уровне архитектуры, было снижено потребление газа. В этом разделе мы рассмотрим основы highload-кошелька V3 и важные нюансы, о которых следует помнить.

:::note
Мы будем работать [с немного измененной версией обертки](https://github.com/aSpite/highload-wallet-contract-v3/blob/main/wrappers/HighloadWalletV3.ts) для контракта, поскольку в ней есть защита от некоторых неочевидных ошибок.
:::

### Структура хранения

Прежде всего, [схема TL-B](https://github.com/ton-blockchain/highload-wallet-contract-v3/blob/d58c31e82315c34b4db55942851dd8d4153975c5/contracts/scheme.tlb#L1C1-L3C21) поможет нам в изучении структуры хранилища контрактов:

```
storage$_ public_key:bits256 subwallet_id:uint32 old_queries:(HashmapE 14 ^Cell)
          queries:(HashmapE 14 ^Cell) last_clean_time:uint64 timeout:uint22
          = Storage;
```

:::tip TL-B
Подробнее о TL-B вы можете прочитать [здесь](/v3/documentation/data-formats/tlb/tl-b-language).
:::

Хранилище контрактов содержит следующие поля:

|                            Поле                           |                                                                                                               Описание                                                                                                               |
| :-------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|              public_key              |                                                                                                       Публичный ключ контракта                                                                                                       |
|             subwallet_id             |                                               [Идентификатор subwallet](#subwallet-ids). Позволяет создать множество кошельков, используя один и тот же публичный ключ                                               |
|              old_queries             |                                                         Старые запросы, которые уже были обработаны и устарели. Они перемещаются сюда после каждого таймаута                                                         |
|                          queries                          |                                                                                         Запросы, которые были обработаны, но еще не устарели                                                                                         |
| last_clean_time | Время последней очистки. Если `last_clean_time < (now()-timeout)`, старые запросы перемещаются в `old_queries`. Если `last_clean_time < (now()-2*timeout)`, то очищаются и `old_queries` и `queries` |
|                          timeout                          |                                                                                   Время, по истечении которого запросы перемещаются в `old_queries`                                                                                  |

Как работать с обработанными запросами мы рассмотрим более подробно в разделе [Защита от повторения](#защита-от-повторения).

### Количество сдвигов и битов в Query ID

Query ID (идентификатор запроса) – это число, состоящее из двух частей: `shift` и `bit_number`:

```func.
int shift = msg_inner_slice~load_uint(KEY_SIZE);
int bit_number = msg_inner_slice~load_uint(BIT_NUMBER_SIZE);
```

Основная идея заключается в том, что теперь каждый Query ID занимает в словаре всего 1 бит, при этом расход газа в большинстве случаев не увеличивается.

Для начала контракт, используя shift, пытается получить ячейку с таким индексом в словаре `old_queries`:

```func
(cell value, int found) = old_queries.udict_get_ref?(KEY_SIZE, shift);
```

Если такая ячейка найдена, она пропускает `bit_number` битов, чтобы добраться до бита с индексом `bit_number` (важно различать bit_number как количество и bit_number как индекс). Если бит установлен, это означает, что запрос с таким Query ID уже был обработан, и контракт выдает ошибку:

```func
if (found) {
    slice value_slice = value.begin_parse();
    value_slice~skip_bits(bit_number);
    throw_if(error::already_executed, value_slice.preload_int(1));
}
```

Следующим шагом будет поиск в словаре `queries`:

```func
(cell value, int found) = queries.udict_get_ref?(KEY_SIZE, shift);
```

Если такая ячейка найдена, контракт разделяет ее на 2 части: `0...bit_number-1` (head) и `bit_number...1023` (tail). Затем с начала tail считывается один бит (этот бит соответствует переменной `bit_number`, если начать отсчет с 0, т.е. это индекс нужного бита). Если бит установлен на `1`, то запрос с этим Query ID уже был обработан, и контракт выдаст ошибку. В противном случае контракт устанавливает бит на `1`, объединяет все фрагменты снова в одну ячейку и записывает их обратно в словарь `queries`:

```func
builder new_value = null();
if (found) {
    slice value_slice = value.begin_parse();
    (slice tail, slice head) = value_slice.load_bits(bit_number);
    throw_if(error::already_executed, tail~load_int(1));
    new_value = begin_cell().store_slice(head).store_true().store_slice(tail);
} else {
    new_value = begin_cell().store_zeroes(bit_number).store_true().store_zeroes(CELL_BITS_SIZE - bit_number - 1);
}
```

:::note
If you [familiarize yourself](/v3/documentation/tvm/instructions) with the operation of the `LDSLICEX` opcode (the load\_bits function uses this opcode), you will notice that the read data is returned first (head) and only then the remaining data (tail), but they are in reverse order in the contract code.

Если вы [ознакомитесь](https://docs.ton.org/v3/documentation/tvm/instructions) с работой опкода `LDSLICEX` (используется функцией `load_bits`), то заметите, что считанные данные возвращаются первыми (head), а затем уже оставшиеся данные (tail), Однако в коде контракта они указаны в обратном порядке. Это происходит потому, что в `stdlib` в сигнатуре функции возвращаемые данные [идут в обратном порядке](https://github.com/ton-blockchain/highload-wallet-contract-v3/blob/d58c31e82315c34b4db55942851dd8d4153975c5/contracts/imports/stdlib.fc#L321): `(slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";`. Здесь `-> 1 0` означает, что сначала возвращается аргумент с индексом `1` (tail), а затем `0` (head).
:::

На практике мы работаем с матрицей, где `shift` – это индекс строки, а `bit_number` – индекс столбца. Эта структура позволяет нам хранить до 1023 запросов в одной ячейке, то есть расход газа будет увеличиваться только каждые 1023 запроса, когда новая ячейка будет добавлена в словарь. Данное решение эффективно, если значения будут расти последовательно, а не случайно, поэтому крайне важно корректно увеличивать Query ID, [используя для этого специальный класс](https://github.com/aSpite/highload-wallet-contract-v3/blob/main/wrappers/HighloadQueryId.ts).

Этот подход позволяет хранить массивные запросы за один таймаут (1023 \* 8192 = 8 380 416), но как можно заметить [класс HighloadQueryId поддерживает 8 380 415](https://github.com/ton-blockchain/highload-wallet-contract-v3/blob/d58c31e82315c34b4db55942851dd8d4153975c5/wrappers/HighloadQueryId.ts#L32). Это сделано для того, чтобы всегда оставался 1 бит для одного экстренного запроса на таймаут, если весь лимит будет исчерпан. Это значение установлено из-за [ограничения на максимально возможное количество ячеек в стеке аккаунта](https://github.com/ton-blockchain/ton/blob/5c392e0f2d946877bb79a09ed35068f7b0bd333a/crypto/block/mc-config.h#L395) в блокчейне (на момент написания статьи).

На каждую ячейку, которая может вместить 1023 запроса, тратится 2 ячейки в словаре (одна для хранения ключа, другая – для значения). Если мы возьмем текущее максимальное значение `shift`, то теоретический максимум составит 8192 \* 2 \* 2 (у нас два словаря: `queries` и `old_queries`) = 32 768 ячеек. Если вы увеличите размер ключа на бит, он уже не будет вписываться в существующие лимиты.

:::info
В highload-кошельке V2, каждый Quiery ID (64-битный) хранился в отдельной ячейке словаря и представлял собой объединение двух 32-битных полей `expire_at` и `query_id`. Этот подход приводил к очень быстрому росту потребления газа после очистки старых запросов.
:::

### Защита от повторения

Поскольку мы знаем, что внешние сообщения в TON [не имеют отправителя и могут быть отправлены любым человеком в сети](#защита-от-повторения--seqno), необходимо иметь список обработанных запросов во избежание повторной обработки. Для этой цели highload-кошелек V3 использует словари `queries` и `old_queries`, а также значения `last_clean_time` и `timeout`.

После того как контракт полностью извлек все необходимые ему данные из хранилища, он проверяет, когда произошла последняя очистка словаря запросов. Если это было более чем `timeout` времени назад, контракт перемещает все запросы из `queries` в `old_queries`. Если последняя очистка была произведена более чем `timeout * 2` времени назад, контракт дополнительно очищает `old_queries`:

```func
if (last_clean_time < (now() - timeout)) {
    (old_queries, queries) = (queries, null());
    if (last_clean_time < (now() - (timeout * 2))) {
        old_queries = null();
    }
    last_clean_time = now();
}
```

Это происходит потому, что контракт не отслеживает точное время выполнения каждого запроса.
Предположим, что таймаут установлен на 3 часа, но последний запрос был выполнен за минуту до истечения таймаута. В этом случае запрос будет считаться устаревшим всего через одну минуту, даже если не прошел весь трехчасовой период. Чтобы решить эту проблему, во втором словаре хранятся те же самые запросы как минимум еще столько же времени.

Теоретически, срок жизни запроса составляет от `timeout` до `timeout * 2`, это значит, что при отслеживании устаревших запросов рекомендуется подождать не менее `timeout * 2`, чтобы убедиться, что запрос устарел.

### Гарантированная безошибочная action phase (фаза действий)

Когда все проверки и очистки завершены, контракт может принять сообщение, обновить свое хранилище и вызвать функцию `commit`. Это гарантирует, что фаза вычисления будет считаться успешной, даже если в последствии произойдет ошибка:

```func
accept_message();

queries~udict_set_ref(KEY_SIZE, shift, new_value.end_cell());

set_data(begin_cell()
    .store_uint(public_key, PUBLIC_KEY_SIZE)
    .store_uint(subwallet_id, SUBWALLET_ID_SIZE)
    .store_dict(old_queries)
    .store_dict(queries)
    .store_uint(last_clean_time, TIMESTAMP_SIZE)
    .store_uint(timeout, TIMEOUT_SIZE)
    .end_cell());


commit();
```

Это сделано для того, чтобы при выполнении дальнейшего кода контракт не возвращался в свое предыдущее состояние в случае ошибки в сообщении, отправленном пользователем. В противном случае внешнее сообщение останется в силе и может быть принято несколько раз, что приведет к напрасной трате баланса.

Однако необходимо решить еще одну проблему: потенциальные ошибки во время **фазы действий**. Хотя у нас есть флаг, позволяющий игнорировать ошибки (2) при отправке сообщения, он не охыватывает все случаи. Поэтому мы должны убедиться, что во время этой фазы не возникнет ошибок, которые могут привести к откату состояния и сделать `commit()` бессмысленным.

По этой причине вместо того, чтобы отправлять все сообщения напрямую, контракт посылает сам себе сообщение с опкодом `internal_transfer`. Это сообщение подробно разбирается контрактом, чтобы гарантировать отсутствие ошибок в фазе действий:

```func
throw_if(error::invalid_message_to_send, message_slice~load_uint(1)); ;; int_msg_info$0
int msg_flags = message_slice~load_uint(3); ;; ihr_disabled:Bool bounce:Bool bounced:Bool
if (is_bounced(msg_flags)) {
    return ();
}
slice message_source_adrress = message_slice~load_msg_addr(); ;; src
throw_unless(error::invalid_message_to_send, is_address_none(message_source_adrress));
message_slice~load_msg_addr(); ;; dest
message_slice~load_coins(); ;; value.coins
message_slice = message_slice.skip_dict(); ;; value.other extra-currencies
message_slice~load_coins(); ;; ihr_fee
message_slice~load_coins(); ;; fwd_fee
message_slice~skip_bits(64 + 32); ;; created_lt:uint64 created_at:uint32
int maybe_state_init = message_slice~load_uint(1);
throw_if(error::invalid_message_to_send, maybe_state_init); ;; throw if state-init included (state-init not supported)
int either_body = message_slice~load_int(1);
if (either_body) {
    message_slice~load_ref();
    message_slice.end_parse();
}
```

Если при чтении данных возникнет какая-либо проблема, она будет возникать и во время фазы вычислений. Однако благодаря наличию `commit()` это не является проблемой, и транзакция все равно будет считаться успешной. Если все данные прочитаны успешно, это гарантия того, что Фаза действий пройдет без ошибок, поскольку эти проверки охватывают все случаи, когда флаг `IGNORE_ERRORS` (2) не срабатывает. После этого контракт может завершить свою работу, отправив сообщение:

```func
;; send message with IGNORE_ERRORS flag to ignore errors in the action phase

send_raw_message(message_to_send, send_mode | SEND_MODE_IGNORE_ERRORS);
```

### Внутренний перевод

После того, как `internal_transfer` достигает контракта, он загружает список действий, устанавливает их в `c5` регистре, а затем применяет `set_code` для защиты от случайных изменений кода, который также является действием. Из-за этого количество сообщений, которые можно отправить, составляет 254, а не 255, что является ограничением блокчейна. Однако контракт может вызывать сам себя, чтобы отправить больше сообщений, о чем мы поговорим позже:

```func
if (op == op::internal_transfer) {
    in_msg_body~skip_query_id();
    cell actions = in_msg_body.preload_ref();
    cell old_code = my_code();
    set_actions(actions);
    set_code(old_code); ;; prevent to change smart contract code
    return ();
}
```

При работе с `internal_transfer` есть один важный нюанс. Как упоминалось ранее, контракт отправляет сообщение самому себе, но это сообщение полностью собирается на стороне пользователя. Проблема заключается в подсчете точного количества TON, которое должно быть прикреплено к сообщению.

В wrapper в официальном репозитории это поле необязательно, и если пользователь не указывает его, [mode будет равным 128](https://github.com/ton-blockchain/highload-wallet-contract-v3/blob/d58c31e82315c34b4db55942851dd8d4153975c5/wrappers/HighloadWalletV3.ts#L115), что означает, что отправляется весь баланс. Проблема в том, что тогда это будет **пограничный случай**.

Представим, что мы хотим отправить большое количество токенов. После отправки оставшиеся TON возвращаются на наш кошелек, поскольку мы указали наш адрес в поле `response_destination`. Если мы начнем отправлять несколько внешних сообщений одновременно, может возникнуть следующая ситуация:

1. Внешнее сообщение A принимается, обрабатывается и отправляет весь баланс контракта через `internal_transfer`.
2. До поступления внешнего сообщения B часть комиссии от уже завершенной отправки токенов достигает контракта. Это пополняет баланс контракта, позволяя снова отправить весь баланс во внутреннем сообщении B, но на этот раз с небольшим количеством TON.
3. Внутреннее сообщение A получено и обработано. Сообщения об переводе токенов отправлены.
4. Прежде чем поступит внутреннее сообщение B, внешнее сообщение C достигает контракта и снова отправляет весь баланс.
5. При получении внутреннего сообщения B, контракт имеет так мало TON, что даже если будет получено некоторое количество дополнительных TON от отправки токенов, запрос будет считаться неуспешным с кодом завершения = `37` в фазе действий (недостаточно средств).

Таким образом, контракт отмечает запрос как обработанный, хотя на самом деле это не так. Чтобы избежать этого сценария, **рекомендуется всегда класть 1 TON** на `internal_transfer`. Поэтому [мы работаем с модифицированной оберткой](#-highload-wallet-v3), которая требует от пользователя указывать количество TON. Этого значения будет достаточно для всех случаев, поскольку размер внешнего сообщения ограничен 64 КБ, и сообщение, близкое к этому пределу, потратит меньше 1 TON.

Highload-кошелек V3 может отправлять более 254 сообщений, [помещая оставшиеся сообщения в 254-е сообщение](https://github.com/aSpite/highload-wallet-contract-v3/blob/d4c1752d00b5303782f121a87eb0620d403d9544/wrappers/HighloadWalletV3.ts#L169-L176). Таким образом, `internal_transfer` будет обработан несколько раз. Обертка делает это автоматически, и нам не придется об этом беспокоиться, но **рекомендуется принимать не более 150 сообщений за раз**, чтобы гарантировать, что даже сложные сообщения поместятся во внешнее сообщение.

:::info
Хотя лимит внешнего сообщения составляет 64 КБ, чем больше внешнее сообщение, тем больше вероятность его потери при доставке, поэтому 150 сообщений является оптимальным решением.
:::

### GET-методы

Highload-кошелек V3 поддерживает 5 GET-методов:

|                                                    Метод                                                    |                                                                                                                                     Описание                                                                                                                                     |
| :---------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|              int get_public_key()              |                                                                                                                        Возвращает публичный ключ контракта                                                                                                                       |
|             int get_subwallet_id()             |                                                                                                                        Возвращает идентификатор subwallet                                                                                                                        |
| int get_last_clean_time() |                                                                                                                        Возвращает время последней очистки                                                                                                                        |
|                          int get_timeout()                          |                                                                                                                           Возвращает значение таймаута                                                                                                                           |
|  int processed?(int query_id, int need_clean)  | Возвращает, был ли обработан query_id. Если значение `need_clean` равно `1`, то сначала будет произведена очистка на основе `last_clean_time` и `timeout`, а затем будет проверен query_id в `old_queries` и `queries` |

:::tip
Рекомендуется передавать `true` для `need_clean`, если ситуация не требует иного. Это гарантирует, что будут возвращены самые актуальные состояния словаря.
:::

Благодаря структуре Query ID в Highload-кошельке V3, мы можем отправить сообщение с тем же Query ID еще раз, если оно не пришло, не опасаясь, что запрос будет задублирован.

Однако необходимо учитывать, что с момента первой попытки отправки должно было пройти не более `timeout` времени. В противном случае запрос может быть обработан, но уже удален из словарей. Поэтому рекомендуется устанавливать `timeout` не менее одного часа и не более 24 часов.

### Развертывание highload-кошелька V3

Чтобы развернуть контракт, нам нужны 2 ячейки: `code` и `data`. Для `code` мы будем использовать следующую ячейку:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Cell } from "@ton/core";

const HIGHLOAD_V3_CODE = Cell.fromBoc(Buffer.from('b5ee9c7241021001000228000114ff00f4a413f4bcf2c80b01020120020d02014803040078d020d74bc00101c060b0915be101d0d3030171b0915be0fa4030f828c705b39130e0d31f018210ae42e5a4ba9d8040d721d74cf82a01ed55fb04e030020120050a02027306070011adce76a2686b85ffc00201200809001aabb6ed44d0810122d721d70b3f0018aa3bed44d08307d721d70b1f0201200b0c001bb9a6eed44d0810162d721d70b15800e5b8bf2eda2edfb21ab09028409b0ed44d0810120d721f404f404d33fd315d1058e1bf82325a15210b99f326df82305aa0015a112b992306dde923033e2923033e25230800df40f6fa19ed021d721d70a00955f037fdb31e09130e259800df40f6fa19cd001d721d70a00937fdb31e0915be270801f6f2d48308d718d121f900ed44d0d3ffd31ff404f404d33fd315d1f82321a15220b98e12336df82324aa00a112b9926d32de58f82301de541675f910f2a106d0d31fd4d307d30cd309d33fd315d15168baf2a2515abaf2a6f8232aa15250bcf2a304f823bbf2a35304800df40f6fa199d024d721d70a00f2649130e20e01fe5309800df40f6fa18e13d05004d718d20001f264c858cf16cf8301cf168e1030c824cf40cf8384095005a1a514cf40e2f800c94039800df41704c8cbff13cb1ff40012f40012cb3f12cb15c9ed54f80f21d0d30001f265d3020171b0925f03e0fa4001d70b01c000f2a5fa4031fa0031f401fa0031fa00318060d721d300010f0020f265d2000193d431d19130e272b1fb00b585bf03', 'hex'))[0];
```

</TabItem>
</Tabs> 

В отличие от других примеров, здесь мы будем работать [с готовой оберткой](https://github.com/aSpite/highload-wallet-contract-v3/blob/main/wrappers/HighloadWalletV3.ts), поскольку создавать каждое сообщение вручную будет довольно сложно и трудоемко. Чтобы создать экземпляр класса `HighloadWalletV3`, мы передаем `publicKey`, `subwalletId` и `timeout`, а также код:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from "@ton/ton";
import { HighloadWalletV3 } from "./wrappers/HighloadWalletV3"; 
import { mnemonicToWalletKey } from "@ton/crypto";

const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    apiKey: 'put your api key' // you can get an api key from @tonapibot bot in Telegram
});

const walletMnemonicArray = 'put your mnemonic'.split(' ');
const walletKeyPair = await mnemonicToWalletKey(walletMnemonicArray); // extract private and public keys from mnemonic
const wallet = client.open(HighloadWalletV3.createFromConfig({
    publicKey: walletKeyPair.publicKey,
    subwalletId: 0x10ad,
    timeout: 60 * 60, // 1 hour
}, HIGHLOAD_V3_CODE));

console.log(`Wallet address: ${wallet.address.toString()}`);
```

</TabItem>
</Tabs> 

Теперь нам нужен обычный кошелек, с которого мы будем разворачивать контракт:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { WalletContractV3R2 } from "@ton/ton";

const deployerWalletMnemonicArray = 'put your mnemonic'.split(' ');
const deployerWalletKeyPair = await mnemonicToWalletKey(deployerWalletMnemonicArray); // extract private and public keys from mnemonic
const deployerWallet = client.open(WalletContractV3R2.create({
    publicKey: deployerWalletKeyPair.publicKey,
    workchain: 0
}));
console.log(`Deployer wallet address: ${deployerWallet.address.toString()}`);
```

</TabItem>
</Tabs> 

Если у вас кошелек версии V4, то можно использовать класс `WalletContractV4`. Теперь осталось только развернуть контракт:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
await wallet.sendDeploy(deployerWallet.sender(deployerWalletKeyPair.secretKey), toNano(0.05));
```

</TabItem>
</Tabs> 

Можно убедиться, что наш кошелек развернут, проверив адрес, выведенный в консоли, в блокчейн-обозревателе.

### Отправка сообщений highload-кошельком V3

Отправка сообщений также осуществляется через обертку, но в этом случае нам нужно будет дополнительно поддерживать Query ID в актуальном состоянии. Для начала давайте создадим экземпляр нашего класса кошелька:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address } from "@ton/core";
import { TonClient } from "@ton/ton";
import { HighloadWalletV3 } from "./wrappers/HighloadWalletV3";
import { mnemonicToWalletKey } from "@ton/crypto";

const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    apiKey: 'put your api key' // you can get an api key from @tonapibot bot in Telegram
});

const walletMnemonicArray = 'put your mnemonic'.split(' ');
const walletKeyPair = await mnemonicToWalletKey(walletMnemonicArray); // extract private and public keys from mnemonic
const wallet = client.open(HighloadWalletV3.createFromAddress(Address.parse('put your high-load wallet address')));
console.log(`Wallet address: ${wallet.address.toString()}`);
```

</TabItem>
</Tabs> 

Теперь нам нужно создать экземпляр класса `HighloadQueryId`. Этот класс упрощает работу с `shift` и `bit_number`. Для его создания используется метод `fromShiftAndBitNumber`:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { HighloadQueryId } from "./wrappers/HighloadQueryId";

const queryHandler = HighloadQueryId.fromShiftAndBitNumber(0n, 0n);
```

</TabItem>
</Tabs> 

Мы поставили здесь нули, поскольку это первый запрос. Однако если вы уже отправляли какие-либо сообщения ранее, тогда нужно будет взять неиспользуемую комбинацию значений. Теперь давайте создадим массив, в котором мы будем хранить все наши действия, и добавим в него одно действие, чтобы получить наши TON обратно:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { beginCell, internal, OutActionSendMsg, SendMode, toNano } from "@ton/core";

const actions: OutActionSendMsg[] = [];
actions.push({
    type: 'sendMsg',
    mode: SendMode.CARRY_ALL_REMAINING_BALANCE,
    outMsg: internal({
        to: Address.parse('put address of deployer wallet'),
        value: toNano(0),
        body: beginCell()
            .storeUint(0, 32)
            .storeStringTail('Hello, TON!')
            .endCell()
    })
});
```

</TabItem>
</Tabs> 

Далее для отправки сообщения нужно заполнить поля `subwalletId`, `timeout`, `internalMessageValue` и `createdAt`:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const subwalletId = 0x10ad;
const timeout = 60 * 60; // must be same as in the contract
const internalMessageValue = toNano(0.01); // in real case it is recommended to set the value to 1 TON
const createdAt = Math.floor(Date.now() / 1000) - 60; // LiteServers have some delay in time
await wallet.sendBatch(
    walletKeyPair.secretKey,
    actions,
    subwalletId,
    queryHandler,
    timeout,
    internalMessageValue,
    SendMode.PAY_GAS_SEPARATELY,
    createdAt
);
```

</TabItem>
</Tabs> 

После отправки мы должны использовать метод `getNext` в `queryHandler` и сохранить текущее значение. В реальном случае это значение должно храниться в базе данных и сбрасываться через время `timeout * 2`.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
queryHandler.getNext();
```

</TabItem>
</Tabs> 

## Highload Wallet V2 (устаревшее)

В некоторых ситуациях может потребоваться отправка большого количества сообщений за одну транзакцию. Как уже говорилось ранее, обычные кошельки поддерживают отправку до 4 сообщений за раз, храня [максимум 4 ссылки](/v3/documentation/data-formats/tlb/cell-boc#cell) в одной ячейке. Highload-кошельки позволяют отправлять одновременно только 255 сообщений. Это ограничение существует потому, что максимальное количество исходящих сообщений (действий) в настройках конфигурации блокчейна установлено на 255.

Биржи, вероятно, являются лучшим примером крупномасштабного использования highload-кошельков. Такие известные биржи, как Binance и другие, имеют очень большие пользовательские базы, а это значит, что в короткие промежутки времени обрабатывается большое количество сообщений о выводе средств. Highload-кошельки помогают удовлетворить эти запросы на вывод средств.

### Код FunC highload-кошелька

Давайте рассмотрим [структуру кода смарт-контракта highload-кошелька](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet-v2.fif):

```func
() recv_external(slice in_msg) impure {
  var signature = in_msg~load_bits(512); ;; get signature from the message body
  var cs = in_msg;
  var (subwallet_id, query_id) = (cs~load_uint(32), cs~load_uint(64)); ;; get rest values from the message body
  var bound = (now() << 32); ;; bitwise left shift operation
  throw_if(35, query_id < bound); ;; throw an error if message has expired
  var ds = get_data().begin_parse();
  var (stored_subwallet, last_cleaned, public_key, old_queries) = (ds~load_uint(32), ds~load_uint(64), ds~load_uint(256), ds~load_dict()); ;; read values from storage
  ds.end_parse(); ;; make sure we do not have anything in ds
  (_, var found?) = old_queries.udict_get?(64, query_id); ;; check if we have already had such a request
  throw_if(32, found?); ;; if yes throw an error
  throw_unless(34, subwallet_id == stored_subwallet);
  throw_unless(35, check_signature(slice_hash(in_msg), signature, public_key));
  var dict = cs~load_dict(); ;; get dictionary with messages
  cs.end_parse(); ;; make sure we do not have anything in cs
  accept_message();
```

> 💡 Полезные ссылки:
>
> ["Побитовые операции" в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_get)
>
> [`load_dict()` в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#load_dict)
>
> [`udict_get?()` в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_get)

Вы заметили некоторые отличия от обычных кошельков. Теперь давайте рассмотрим более подробно, как работают highload-кошельки на TON (за исключением subwallet, поскольку мы уже говорили об этом ранее).

### Использование Query ID вместо Seqno

Как уже упоминалось, обычные кошельки увеличивают свой `seqno` после каждой транзакции на `1`. При использовании последовательности кошельков нам приходилось ждать, пока это значение обновится, затем извлекать его с помощью GET-метода и отправлять новое сообщение.
Этот процесс занимает значительное время, на которое highload-кошельки не рассчитаны (как говорилось выше, они предназначены для быстрой отправки большого количества сообщений). Поэтому highload-кошельки на TON используют `query_id`.

Если такой же запрос на сообщение уже существует, контракт не примет его, поскольку он уже был обработан:

```func
var (stored_subwallet, last_cleaned, public_key, old_queries) = (ds~load_uint(32), ds~load_uint(64), ds~load_uint(256), ds~load_dict()); ;; read values from storage
ds.end_parse(); ;; make sure we do not have anything in ds
(_, var found?) = old_queries.udict_get?(64, query_id); ;; check if we have already had such a request
throw_if(32, found?); ;; if yes throw an error
```

Таким образом, мы **защищаемся от повтора сообщений**, что было ролью seqno в обычных кошельках.

### Отправка сообщений

Как только контракт принимает внешнее сообщение, он инициирует цикл. Во время этого цикла контракт извлекает из словаря срезы – `slices`, содержащие режимы сообщений и сами сообщения. Контракт продолжает отправку новых сообщений до тех пор, пока словарь не опустеет.

```func
int i = -1; ;; we write -1 because it will be the smallest value among all dictionary keys
do {
  (i, var cs, var f) = dict.idict_get_next?(16, i); ;; get the key and its corresponding value with the smallest key, which is greater than i
  if (f) { ;; check if any value was found
    var mode = cs~load_uint(8); ;; load message mode
    send_raw_message(cs~load_ref(), mode); ;; load message itself and send it
  }
} until (~ f); ;; if any value was found continue
```

> 💡 Полезная ссылка:
>
> [`idict_get_next()` в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_get_next)

Обратите внимание, что если значение найдено, `f` всегда равно -1 (true). Операция `~ -1` (побитовое "не") всегда будет возвращать значение 0, что означает, что цикл следует продолжить. Однако, когда словарь заполнен сообщениями, необходимо начинать вычисление тех из них, которые **имеют значение больше -1** (например, 0), и продолжать увеличивать это значение на 1 с каждым последующим сообщением. Такая структура гарантирует, что сообщения отправляются в правильной последовательности.

### Удаление просроченных запросов

Как правило, [смарт-контракты на TON сами оплачивают свое хранение](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#плата-за-хранение). Это ограничивает объем данных, которые могут храниться в смарт-контрактах, для предотвращения высокой сетевой нагрузки. Сообщения старше 64 секунд автоматически удаляются из хранилища для повышения эффективности системы. Это происходит следующим образом:

```func
bound -= (64 << 32);   ;; clean up records that have expired more than 64 seconds ago
old_queries~udict_set_builder(64, query_id, begin_cell()); ;; add current query to dictionary
var queries = old_queries; ;; copy dictionary to another variable
do {
  var (old_queries', i, _, f) = old_queries.udict_delete_get_min(64);
  f~touch();
  if (f) { ;; check if any value was found
    f = (i < bound); ;; check if more than 64 seconds have elapsed after expiration
  }
  if (f) { 
    old_queries = old_queries'; ;; if yes save changes in our dictionary
    last_cleaned = i; ;; save last removed query
  }
} until (~ f);
```

> 💡 Полезная ссылка:
>
> [`udict_delete_get_min()` в docs](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_delete_get_min)

Обратите внимание, что с переменной `f` необходимо взаимодействовать несколько раз. Поскольку [TVM – это стековая машина](/v3/documentation/tvm/tvm-overview#tvm---это-стековая-машина), то во время каждого взаимодействия с переменной `f` необходимо перебрать все значения, чтобы получить нужную переменную. Операция `f~touch()` помещает переменную `f` на вершину стека, чтобы оптимизировать выполнение кода.

### Побитовые операции

Этот раздел может показаться немного сложным для тех, кто ранее не сталкивался с побитовыми операциями. Следующую строку кода можно увидеть в коде смарт-контракта:

```func
var bound = (now() << 32); ;; bitwise left shift operation
```

В результате к числу справа добавляется 32 бита. Это означает, что **существующие значения смещены на 32 бита влево**. Например, давайте возьмем число `3` и переведем его в двоичную форму, получив `11`. Применение операции `3 << 2`, сдвигает `11` на два разряда влево. Это означает, что справа добавляется два `0`. В итоге мы получаем `1100`, что равно `12`.

В этом процессе необходимо запомнить, что функция `now()` возвращает результат uint32, что означает, что полученное значение будет состоять из 32 битов. Сдвинув 32 бита влево, мы освобождаем место для еще одного uint32, в результате чего получаем правильный `query_id`. Таким образом, **timestamp и query_id могут быть объединены** в одной переменной для оптимизации.

Далее давайте рассмотрим следующую строку кода:

```func
bound -= (64 << 32); ;; clean up the records that have expired more than 64 seconds ago
```

Выше мы выполнили операцию побитового сдвига числа 64 на 32 бита, чтобы **вычесть 64 секунды** из нашего `timestamp`. Таким образом, мы можем сравнить прошлые `query_id` и определить, являются ли они меньше расчетного значения. Если значение меньше, то срок их действия истек более 64 секунд назад:

```func
if (f) { ;; check if any value has been found
  f = (i < bound); ;; check if more than 64 seconds have elapsed after expiration
}
```

Чтобы лучше понять это, давайте воспользуемся числом `1625918400` в качестве примера `timestamp`. Его двоичное представление (с добавлением нулей слева на 32 бита) – 01100000111010011000101111000000. Выполнив 32-битный сдвиг влево, вы получите 32 нуля в конце двоичного представления нашего числа.

После этого **можно добавить любой query_id (uint32)**. Затем, вычитая `64 << 32`, мы получим `timestamp`, который 64 секунды назад имел тот же самый `query_id`. Это можно проверить, выполнив следующие вычисления `((1625918400 << 32) - (64 << 32)) >> 32`. Таким образом, мы можем сравнить необходимые части нашего числа (timestamp), и query_id не будет мешать.

### Обновление хранилища

После завершения всех операций остается только сохранить новые значения в хранилище:

```func
  set_data(begin_cell()
    .store_uint(stored_subwallet, 32)
    .store_uint(last_cleaned, 64)
    .store_uint(public_key, 256)
    .store_dict(old_queries)
    .end_cell());
}
```

### GET-методы

Последнее, что нужно рассмотреть, прежде чем мы погрузимся в развертывание кошелька и создание сообщений – это GET-методы highload-кошелька:

|                                       Метод                                       |                                                                                                                                         Описание                                                                                                                                        |
| :-------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|        int processed?(int query_id)       | Уведомляет пользователя, если запрос был обработан. Это означает, что метод возвращает `-1`, если запрос был обработан, и `0`, если нет. Также метод может вернуть `1`, если ответ неизвестен, поскольку запрос старый и больше не хранится в контракте |
| int get_public_key() |                                                                                                     Извлекает публичный ключ. Мы уже рассматривали этот метод ранее                                                                                                     |

Давайте рассмотрим метод `int processed?(int query_id)`, чтобы понять, почему нужно использовать last_cleaned:

```func
int processed?(int query_id) method_id {
  var ds = get_data().begin_parse();
  var (_, last_cleaned, _, old_queries) = (ds~load_uint(32), ds~load_uint(64), ds~load_uint(256), ds~load_dict());
  ds.end_parse();
  (_, var found) = old_queries.udict_get?(64, query_id);
  return found ? true : - (query_id <= last_cleaned);
}
```

Значение `last_cleaned` извлекается из хранилища контракта и словаря старых запросов. Если запрос найден, то возвращается `true`, а если нет, то выражение `- (query_id <= last_cleaned)`. Значение `last_cleaned` содержит последний удаленный запрос **с наибольшим timestamp**, поскольку при удалении запросов мы начинали с наименьшего timestamp.

Если `query_id`, переданный в метод, меньше последнего значения `last_cleaned`, то невозможно определить, был ли он когда-либо в контракте или нет. Поэтому выражение `query_id <= last_cleaned` возвращает `-1`, а минус перед этим выражением меняет ответ на `1`. Если `query_id` больше, чем `last_cleaned`, то метод подтверждает, что он еще не обработан.

### Развертывание highload-кошелька V2

Для того чтобы развернуть highload-кошелек, необходимо заранее сгенерировать мнемонический ключ, который будет применяться пользователем. Можно повторно использовать тот же ключ из предыдущих разделов этого руководства.

Чтобы приступить к развертыванию highload-кошелька, необходимо скопировать [код смарт-контракта](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet-v2.fif) в ту же директорию, где находятся stdlib.fc и wallet_v3, и не забыть добавить `#include "stdlib.fc";` в начало кода. Далее скомпилируем код highload-кошелька, как мы это делали в [этом разделе](#компиляция-кода-кошелька):

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { compileFunc } from '@ton-community/func-js';
import fs from 'fs'
import { Cell } from '@ton/core';

const result = await compileFunc({
    targets: ['highload_wallet.fc'], // targets of your project
    sources: {
        'stdlib.fc': fs.readFileSync('./src/stdlib.fc', { encoding: 'utf-8' }),
        'highload_wallet.fc': fs.readFileSync('./src/highload_wallet.fc', { encoding: 'utf-8' }),
    }
});

if (result.status === 'error') {
console.error(result.message)
return;
}

const codeCell = Cell.fromBoc(Buffer.from(result.codeBoc, 'base64'))[0];

// now we have base64 encoded BOC with compiled code in result.codeBoc
console.log('Code BOC: ' + result.codeBoc);
console.log('\nHash: ' + codeCell.hash().toString('base64')); // get the hash of cell and convert in to base64 encoded string

```

</TabItem>
</Tabs>

В результате в терминале появится следующий вывод:

```text
Code BOC: te6ccgEBCQEA5QABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQHq8oMI1xgg0x/TP/gjqh9TILnyY+1E0NMf0z/T//QE0VNggED0Dm+hMfJgUXO68qIH+QFUEIf5EPKjAvQE0fgAf44WIYAQ9HhvpSCYAtMH1DAB+wCRMuIBs+ZbgyWhyEA0gED0Q4rmMQHIyx8Tyz/L//QAye1UCAAE0DACASAGBwAXvZznaiaGmvmOuF/8AEG+X5dqJoaY+Y6Z/p/5j6AmipEEAgegc30JjJLb/JXdHxQANCCAQPSWb6VsEiCUMFMDud4gkzM2AZJsIeKz

Hash: lJTRzI7fEvBWcaGpugmSEJbrUIEeGSTsZcPGKfu4CBI=
```

Результат вывода можно использовать в кодировке base64 для извлечения ячейки с кодом нашего кошелька в других библиотеках и языках следующим образом:

<Tabs groupId="code-examples">
<TabItem value="go" label="Golang">

```go
import (
  "encoding/base64"
  "github.com/xssnick/tonutils-go/tvm/cell"
  "log"
)

base64BOC := "te6ccgEBCQEA5QABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQHq8oMI1xgg0x/TP/gjqh9TILnyY+1E0NMf0z/T//QE0VNggED0Dm+hMfJgUXO68qIH+QFUEIf5EPKjAvQE0fgAf44WIYAQ9HhvpSCYAtMH1DAB+wCRMuIBs+ZbgyWhyEA0gED0Q4rmMQHIyx8Tyz/L//QAye1UCAAE0DACASAGBwAXvZznaiaGmvmOuF/8AEG+X5dqJoaY+Y6Z/p/5j6AmipEEAgegc30JjJLb/JXdHxQANCCAQPSWb6VsEiCUMFMDud4gkzM2AZJsIeKz" // save our base64 encoded output from compiler to variable
codeCellBytes, _ := base64.StdEncoding.DecodeString(base64BOC) // decode base64 in order to get byte array
codeCell, err := cell.FromBOC(codeCellBytes) // get cell with code from byte array
if err != nil { // check if there is any error
  panic(err) 
}

log.Println("Hash:", base64.StdEncoding.EncodeToString(codeCell.Hash())) // get the hash of our cell, encode it to base64 because it has []byte type and output to the terminal
```

</TabItem>
</Tabs>

Теперь нужно получить ячейку, содержащую `initial data` (первичные данные), создать State Init и вычислить адрес highload-кошелька. После изучения кода смарт-контракта становится понятно, что `subwallet_id`, `last_cleaned`, `public_key` и `old_queries` последовательно сохраняются в хранилище:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address, beginCell } from '@ton/core';
import { mnemonicToWalletKey } from '@ton/crypto';

const highloadMnemonicArray = 'put your mnemonic that you have generated and saved before'.split(' ');
const highloadKeyPair = await mnemonicToWalletKey(highloadMnemonicArray); // extract private and public keys from mnemonic

const dataCell = beginCell()
    .storeUint(698983191, 32) // Subwallet ID
    .storeUint(0, 64) // Last cleaned
    .storeBuffer(highloadKeyPair.publicKey) // Public Key
    .storeBit(0) // indicate that the dictionary is empty
    .endCell();

const stateInit = beginCell()
    .storeBit(0) // No split_depth
    .storeBit(0) // No special
    .storeBit(1) // We have code
    .storeRef(codeCell)
    .storeBit(1) // We have data
    .storeRef(dataCell)
    .storeBit(0) // No library
    .endCell();

const contractAddress = new Address(0, stateInit.hash()); // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
console.log(`Contract address: ${contractAddress.toString()}`); // Output contract address to console
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "crypto/ed25519"
  "crypto/hmac"
  "crypto/sha512"
  "github.com/xssnick/tonutils-go/address"
  "golang.org/x/crypto/pbkdf2"
  "strings"
)

highloadMnemonicArray := strings.Split("put your mnemonic that you have generated and saved before", " ") // word1 word2 word3
mac := hmac.New(sha512.New, []byte(strings.Join(highloadMnemonicArray, " ")))
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries "TON default seed" is used as salt when getting keys
// 32 is a key len
highloadPrivateKey := ed25519.NewKeyFromSeed(k)                      // get private key
highloadPublicKey := highloadPrivateKey.Public().(ed25519.PublicKey) // get public key from private key

dataCell := cell.BeginCell().
  MustStoreUInt(698983191, 32).           // Subwallet ID
  MustStoreUInt(0, 64).                   // Last cleaned
  MustStoreSlice(highloadPublicKey, 256). // Public Key
  MustStoreBoolBit(false).                // indicate that the dictionary is empty
  EndCell()

stateInit := cell.BeginCell().
  MustStoreBoolBit(false). // No split_depth
  MustStoreBoolBit(false). // No special
  MustStoreBoolBit(true).  // We have code
  MustStoreRef(codeCell).
  MustStoreBoolBit(true). // We have data
  MustStoreRef(dataCell).
  MustStoreBoolBit(false). // No library
  EndCell()

contractAddress := address.NewAddress(0, 0, stateInit.Hash()) // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
log.Println("Contract address:", contractAddress.String())    // Output contract address to console
```

</TabItem>
</Tabs> 

:::caution
Все, что мы описали выше, соответствует тем же шагам, что и в разделе [развертывание контракта через кошелек](#развертывание-контракта-через-кошелек). Для лучшего понимания ознакомьтесь с полной версией [исходного кода на GitHub](https://github.com/aSpite/wallet-tutorial).
:::

### Отправка сообщений highload-кошельком V2

Теперь давайте запрограммируем highload-кошелек на отправку нескольких сообщений одновременно. Например, возьмем 12 сообщений на одну транзакцию, чтобы плата за газ была небольшой.

:::info highload-баланс
Для завершения транзакции баланс контракта должен составлять не менее 0.5 TON.
:::

Каждое сообщение содержит свой комментарий с кодом, а адресом назначения будет кошелек, с которого мы производили развертывание:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address, beginCell, Cell, toNano } from '@ton/core';

let internalMessages:Cell[] = [];
const walletAddress = Address.parse('put your wallet address from which you deployed high-load wallet');

for (let i = 0; i < 12; i++) {
    const internalMessageBody = beginCell()
        .storeUint(0, 32)
        .storeStringTail(`Hello, TON! #${i}`)
        .endCell();

    const internalMessage = beginCell()
        .storeUint(0x18, 6) // bounce
        .storeAddress(walletAddress)
        .storeCoins(toNano('0.01'))
        .storeUint(0, 1 + 4 + 4 + 64 + 32)
        .storeBit(0) // We do not have State Init
        .storeBit(1) // We store Message Body as a reference
        .storeRef(internalMessageBody) // Store Message Body Init as a reference
        .endCell();

    internalMessages.push(internalMessage);
}
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "fmt"
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/tlb"
  "github.com/xssnick/tonutils-go/tvm/cell"
)

var internalMessages []*cell.Cell
walletAddress := address.MustParseAddr("put your wallet address from which you deployed high-load wallet")

for i := 0; i < 12; i++ {
  comment := fmt.Sprintf("Hello, TON! #%d", i)
  internalMessageBody := cell.BeginCell().
    MustStoreUInt(0, 32).
    MustStoreBinarySnake([]byte(comment)).
    EndCell()

  internalMessage := cell.BeginCell().
    MustStoreUInt(0x18, 6). // bounce
    MustStoreAddr(walletAddress).
    MustStoreBigCoins(tlb.MustFromTON("0.001").NanoTON()).
    MustStoreUInt(0, 1+4+4+64+32).
    MustStoreBoolBit(false). // We do not have State Init
    MustStoreBoolBit(true). // We store Message Body as a reference
    MustStoreRef(internalMessageBody). // Store Message Body Init as a reference
    EndCell()

  messageData := cell.BeginCell().
    MustStoreUInt(3, 8). // transaction mode
    MustStoreRef(internalMessage).
    EndCell()

	internalMessages = append(internalMessages, messageData)
}
```

</TabItem>
</Tabs>

Результатом процесса выше будет массив внутренних сообщений. Далее необходимо создать словарь для хранения сообщений, а также подготовить и подписать тело сообщения. Это выполняется следующим образом:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Dictionary } from '@ton/core';
import { mnemonicToWalletKey, sign } from '@ton/crypto';
import * as crypto from 'crypto';

const dictionary = Dictionary.empty<number, Cell>(); // create an empty dictionary with the key as a number and the value as a cell
for (let i = 0; i < internalMessages.length; i++) {
    const internalMessage = internalMessages[i]; // get our message from an array
    dictionary.set(i, internalMessage); // save the message in the dictionary
}

const queryID = crypto.randomBytes(4).readUint32BE(); // create a random uint32 number, 4 bytes = 32 bits
const now = Math.floor(Date.now() / 1000); // get current timestamp
const timeout = 120; // timeout for message expiration, 120 seconds = 2 minutes
const finalQueryID = (BigInt(now + timeout) << 32n) + BigInt(queryID); // get our final query_id
console.log(finalQueryID); // print query_id. With this query_id we can call GET method to check if our request has been processed

const toSign = beginCell()
    .storeUint(698983191, 32) // subwallet_id
    .storeUint(finalQueryID, 64)
    // Here we create our own method that will save the 
    // message mode and a reference to the message
    .storeDict(dictionary, Dictionary.Keys.Int(16), {
        serialize: (src, buidler) => {
            buidler.storeUint(3, 8); // save message mode, mode = 3
            buidler.storeRef(src); // save message as reference
        },
        // We won't actually use this, but this method 
        // will help to read our dictionary that we saved
        parse: (src) => {
            let cell = beginCell()
                .storeUint(src.loadUint(8), 8)
                .storeRef(src.loadRef())
                .endCell();
            return cell;
        }
    }
);

const highloadMnemonicArray = 'put your high-load wallet mnemonic'.split(' ');
const highloadKeyPair = await mnemonicToWalletKey(highloadMnemonicArray); // extract private and public keys from mnemonic
const highloadWalletAddress = Address.parse('put your high-load wallet address');

const signature = sign(toSign.endCell().hash(), highloadKeyPair.secretKey); // get the hash of our message to wallet smart contract and sign it to get signature
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "crypto/ed25519"
  "crypto/hmac"
  "crypto/sha512"
  "golang.org/x/crypto/pbkdf2"
  "log"
  "math/big"
  "math/rand"
  "strings"
  "time"
)

dictionary := cell.NewDict(16) // create an empty dictionary with the key as a number and the value as a cell
for i := 0; i < len(internalMessages); i++ {
  internalMessage := internalMessages[i]                             // get our message from an array
  err := dictionary.SetIntKey(big.NewInt(int64(i)), internalMessage) // save the message in the dictionary
  if err != nil {
    return
  }
}

queryID := rand.Uint32()
timeout := 120                                                               // timeout for message expiration, 120 seconds = 2 minutes
now := time.Now().Add(time.Duration(timeout)*time.Second).UTC().Unix() << 32 // get current timestamp + timeout
finalQueryID := uint64(now) + uint64(queryID)                                // get our final query_id
log.Println(finalQueryID)                                                    // print query_id. With this query_id we can call GET method to check if our request has been processed

toSign := cell.BeginCell().
  MustStoreUInt(698983191, 32). // subwallet_id
  MustStoreUInt(finalQueryID, 64).
  MustStoreDict(dictionary)

highloadMnemonicArray := strings.Split("put your high-load wallet mnemonic", " ") // word1 word2 word3
mac := hmac.New(sha512.New, []byte(strings.Join(highloadMnemonicArray, " ")))
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries "TON default seed" is used as salt when getting keys
// 32 is a key len
highloadPrivateKey := ed25519.NewKeyFromSeed(k) // get private key
highloadWalletAddress := address.MustParseAddr("put your high-load wallet address")

signature := ed25519.Sign(highloadPrivateKey, toSign.EndCell().Hash())
```

</TabItem>
</Tabs>

:::note ВАЖНО
Обратите внимание, что при использовании JavaScript и TypeScript наши сообщения сохраняются в массив без использования режима отправки. Так происходит потому, что при использовании библиотеки @ton/ton предполагается, что разработчик будет выполнять процесс сериализации и десериализации собственноручно. Поэтому метод сначала сохраняет режим сообщения, а затем само сообщение. Если мы используем спецификацию `Dictionary.Values.Cell()` для метода value, то в таком случае сообщение сохраняется целиком в виде ссылки на ячейку, не сохраняя отдельно режим сообщения.
:::

Далее мы создадим внешнее сообщение и отправим его в блокчейн с помощью следующего кода:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from '@ton/ton';

const body = beginCell()
    .storeBuffer(signature) // store signature
    .storeBuilder(toSign) // store our message
    .endCell();

const externalMessage = beginCell()
    .storeUint(0b10, 2) // indicate that it is an incoming external message
    .storeUint(0, 2) // src -> addr_none
    .storeAddress(highloadWalletAddress)
    .storeCoins(0) // Import fee
    .storeBit(0) // We do not have State Init
    .storeBit(1) // We store Message Body as a reference
    .storeRef(body) // Store Message Body as a reference
    .endCell();

// We do not need a key here as we will be sending 1 request per second
const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    // apiKey: 'put your api key' // you can get an api key from @tonapibot bot in Telegram
});

client.sendFile(externalMessage.toBoc());
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "context"
  "github.com/xssnick/tonutils-go/liteclient"
  "github.com/xssnick/tonutils-go/tl"
  "github.com/xssnick/tonutils-go/ton"
)

body := cell.BeginCell().
  MustStoreSlice(signature, 512). // store signature
  MustStoreBuilder(toSign). // store our message
  EndCell()

externalMessage := cell.BeginCell().
  MustStoreUInt(0b10, 2). // ext_in_msg_info$10
  MustStoreUInt(0, 2). // src -> addr_none
  MustStoreAddr(highloadWalletAddress). // Destination address
  MustStoreCoins(0). // Import Fee
  MustStoreBoolBit(false). // No State Init
  MustStoreBoolBit(true). // We store Message Body as a reference
  MustStoreRef(body). // Store Message Body as a reference
  EndCell()

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection)

var resp tl.Serializable
err = client.Client().QueryLiteserver(context.Background(), ton.SendMessage{Body: externalMessage.ToBOCWithFlags(false)}, &resp)

if err != nil {
  log.Fatalln(err.Error())
  return
}
```

</TabItem>
</Tabs>

После завершения можно посмотреть на наш кошелек и убедиться, что на него было отправлено 12 исходящих сообщений. Также можно вызвать GET-метод `processed?`, используя query_id, который мы первоначально использовали в консоли. Если запрос обрабатывается правильно, он возвращает `-1` (true).

## 🏁 Заключение

Это руководство позволило нам лучше понять, как работают различные типы кошельков на блокчейне TON. Мы изучили как создавать внешние и внутренние сообщения без использования предустановленных библиотечных методов.

Все это помогает нам не зависеть от использования библиотек и глубже понимать структуру блокчейна TON. Мы также научились использовать highload-кошельки и проанализировали множество деталей, связанных с различными типами данных и всевозможными операциями.

## 🧩 Следующие шаги

Чтение приведенной выше документации – сложное занятие, и понять всю платформу TON довольно трудно. Тем не менее, это хорошее упражнение для тех, кто увлечен разработкой на TON. Еще одно предложение – начать изучать, как писать смарт-контракты на TON, обратившись к следующим ресурсам: [Общие сведения по FunC](/v3/documentation/smart-contracts/func/overview), [Лучшие практики](/v3/guidelines/smart-contracts/guidelines), [Примеры смарт-контрактов](/v3/documentation/smart-contracts/contracts-specs/examples), [FunC Cookbook](/v3/documentation/smart-contracts/func/cookbook).

Кроме того, читателям рекомендуется более подробно ознакомиться со следующими документами: [ton.pdf](https://docs.ton.org/ton.pdf) и [tblkch.pdf](https://ton.org/tblkch.pdf).

## 📬 Об авторе

Если у вас есть каие-либо вопросы, комментарии или предложения, пожалуйста, свяжитесь с автором этого раздела документации в [Telegram](https://t.me/aspite) (@aSpite или @SpiteMoriarty) или [GitHub](https://github.com/aSpite).

## 📖 См. также

- Исходный код кошелька: [V3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc), [V4](https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc), [Highload](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet-v2.fif)

- Полезные документы (могут содержать устаревшую информацию): [ton.pdf](https://docs.ton.org/ton.pdf), [tblkch.pdf](https://ton.org/tblkch.pdf), [tvm.pdf](https://ton.org/tvm.pdf)

Основные источники исходного кода:

- [@ton/ton (JS/TS)](https://github.com/ton-org/ton)
- [@ton/core (JS/TS)](https://github.com/ton-org/ton-core)
- [@ton/crypto (JS/TS)](https://github.com/ton-org/ton-crypto)
- [tonutils-go (GO)](https://github.com/xssnick/tonutils-go)

Официальная документация:

- [Внутренние сообщения](/v3/documentation/smart-contracts/message-management/internal-messages)

- [Внешние сообщения](/v3/documentation/smart-contracts/message-management/external-messages)

- [Типы контрактов кошелька](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts#кошелек-v4)

- [TL-B](/v3/documentation/data-formats/tlb/tl-b-language)

- [Блокчейн блокчейнов](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains)

Внешние ссылки:

- [Ton Deep](https://github.com/xssnick/ton-deep-doc)

- [Block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb)

- [Предложения по улучшению TON](https://github.com/ton-blockchain/TEPs)
