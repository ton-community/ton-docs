import Feedback from '@site/src/components/Feedback';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Single Nominator Pool

[Single Nominator](https://github.com/ton-blockchain/single-nominator) – это простой брандмауэрный смарт-контракт TON, который обеспечивает безопасную валидацию блокчейна TON через холодный кошелек. Контракт предназначен для валидаторов TON, которые имеют достаточный объем средств для стейкинга и проведения самостоятельной валидации, не полагаясь на ставки сторонних номинаторов. Контракт предоставляет альтернативную упрощенную реализацию смарт-контракта [Nominator Pool](/v3/documentation/smart-contracts/contracts-specs/nominator-pool), который поддерживает только одного номинатора. Преимущество этой реализации в том, что она более безопасна, поскольку поверхность атаки значительно меньше. Это происходит благодаря значительному снижению сложности смарт-контракта пула номинаторов, который обычно поддерживает несколько сторонних номинаторов.

## Подходящее решение для валидаторов

Этот смарт-контракт предназначен для валидаторов TON, которые имеют достаточный объем средств для стейкинга и самостоятельной валидации. Другими доступными альтернативами являются:

1. использование [горячего кошелька](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc) (небезопасно, поскольку холодный кошелек необходим для предотвращения кражи в случае взлома узла валидатора)

2. использование [restricted-кошелька](https://github.com/EmelyanenkoK/nomination-contract/blob/master/restricted-wallet/wallet.fc) (который не поддерживается и имеет нерешенные векторы атак, например, атаки на слив газа)

3. использование [Пула номинаторов](https://github.com/ton-blockchain/nominator-pool) с max_nominators_count = 1 (излишне сложно при большой площади атаки)

Смотрите более подробное [сравнение существующих альтернатив](#сравнение-существующих-альтернатив).

## Официальный хэш-код

Проверьте смарт-контракт на сайте https://verifier.ton.org, прежде чем отправлять средства на реальный контракт.

Single nominator v1.0:

```
pCrmnqx2/+DkUtPU8T04ehTkbAGlqtul/B2JPmxx9bo=
```

Single nominator v1.1 (с выводом средств через комментарий):

```
zA05WJ6ywM/g/eKEVmV6O909lTlVrj+Y8lZkqzyQT70=
```

## Архитектура

Архитектура практически идентична смарт-контракту [Nominator Pool](https://github.com/ton-blockchain/nominator-pool):

![image](/img/nominator-pool/single-nominator-architecture.png)

### Разделение на две роли

- _Владелец_ – холодный кошелек (приватный ключ, не подключенный к интернету), который владеет средствами, используемыми для стейкинга, и выступает в качестве single nominator
- _Валидатор_ – кошелек, чей приватный ключ находится на узле валидатора (может подписывать блоки, но не может украсть средства, используемые для ставки)

### Рабочий процесс

1. _Владелец_ хранит средства для стейкинга (\\$$$) в своем защищенном холодном кошельке.
2. _Владелец_ вносит депозит (\\$$$) в контракт _Single Nominator_ (этот контракт).
3. _MyTonCtrl_ запускается на узле валидатора, подключенном к интернету.
4. _MyTonCtrl_ использует кошелек _Валидатора_, чтобы дать указание _Single Nominator_ восстановить ставку в следующем избирательном цикле.
5. _Single Nominator_ отправляет ставку (\\$$$) _Избирателю_ на один цикл.
6. Избирательный цикл закончился, ставка может быть восстановлена.
7. _MyTonCtrl_ использует кошелек _Валидатора_, чтобы дать указание _Single Nominator_ восстановить ставку в следующем избирательном цикле.
8. _Single Nominator_ восстанавливает ставку (\\$$$) из предыдущего цикла у _Избирателя_.
9. Steps 4-8 repeat as long as _Owner_ is happy to keep validating
10. _Владелец_ выводит средства (\\$$$) из контракта _Single Nominator_ и забирает их.

## Ослабление векторов атак

- Для подписи новых блоков узлу-валидатору требуется горячий кошелек. Данный кошелек небезопасен по своей сути, поскольку его приватный ключ имеет доступ к интернету. Если этот ключ будет скомпрометирован, _Валидатор_ не сможет извлечь средства, используемые для валидации. Только _Владелец_ может вывести эти средства.

- Даже если кошелек _Валидатора_ скомпрометирован, _Владелец_ может попросить _Single Nominator_ изменить адрес валидатора. Это не позволит злоумышленнику в дальнейшем взаимодействовать с _Single Nominator_. Здесь нет состояния гонки, _Владелец_ всегда будет иметь приоритет.

- На балансе _Single Nominator_ хранятся только основные средства для стейкинга – этот баланс не используется для затрат газа. Деньги на газ для начала избирательного цикла хранятся в кошельке _Валидатора_. Это решение не позволит злоумышленнику, скомпрометировавшему валидатора, слить средства для стейкинга с помощью атаки на трату газа.

- _Single Nominator_ проверяет формат всех операций, выполняемых _Валидатором_, чтобы убедиться, что он не передает недействительные сообщения _Избирателю_.

- В случае необходимости, например, если контракт _Избирателя_ был обновлен и изменил свой интерфейс, _Владелец_ все еще может отправить любое необработанное сообщение как _Single Nominator_, чтобы вернуть ставку от _Избирателя_.

- В случае крайней необходимости, _Владелец_ может установить код _Single Nominator_ и переопределить его текущую логику работы для устранения непредвиденных обстоятельств.

Некоторые из этих векторов атак невозможно ослабить с помощью обычного контракта [Nominator Pool](https://github.com/ton-blockchain/nominator-pool), поскольку это позволит человеку, управляющему валидатором, красть средства у своих номинаторов. Это не проблема с _Single Nominator_ потому, что _Владелец_ и _Валидатор_ принадлежат одной и той же стороне.

### Аудиты безопасности

Полный аудит безопасности, проведенный компанией Certik, доступен в репозитории: [Certik Audit](https://github.com/ton-blockchain/single-nominator/blob/main/certik-audit.pdf).

## Сравнение существующих альтернатив

Предполагая, что вы валидатор с достаточной ставкой для самостоятельной валидации, вот альтернативные настройки, которые вы можете использовать с MyTonCtrl:

### 1. Обычный горячий кошелек

Это простейшая настройка, при которой MyTonCtrl подключен к тому же [standard wallet](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc), на котором хранятся средства. Поскольку этот кошелек подключен к интернету, он считается горячим кошельком.

![image](/img/nominator-pool/hot-wallet.png)

Использование небезопасно, так как злоумышленник может получить приватный ключ, поскольку кошелек подключен к интернету. С помощью приватного ключа злоумышленник может отправить средства в стейкинг кому угодно.

### 2. Restricted-кошелек

Эта настройка заменяет стандартный кошелек на [restricted wallet](https://github.com/EmelyanenkoK/nomination-contract/blob/master/restricted-wallet/wallet.fc), который позволяет отправлять исходящие транзакции только заранее определенным адресам назначения, таким как _Избиратель_ и _Владелец_.

![image](/img/nominator-pool/restricted-wallet.png)

Данный тип кошелька не обслуживается (заменен на Пул номинаторов) и имеет нерешенные векторы атак, например, атаки на трату газа. Поскольку в одном и том же кошельке на одном балансе хранятся и плата за газ и основная сумма ставки, злоумышленник, скомпрометировавший приватный ключ, может генерировать транзакции, что повлечет за собой значительные убытки. Кроме того, при попытке вывода средств злоумышленник и владелец могут столкнуться с состоянием гонки из-за коллизий seqno.

### 3. Пул номинаторов

[Пул номинаторов](https://github.com/ton-blockchain/nominator-pool) первым ввел четкое разграничение между владельцами ставок (номинаторами) и валидатором, подключенным к интернету. Пул номинаторов поддерживает до 40 номинаторов, делающих ставки вместе на одном валидаторе.

![image](/img/nominator-pool/nominator-pool.png)

Смарт-контракт пул номинаторов чрезмерно сложен из-за поддержки 40 одновременно работающих номинаторов. Также, контракт должен защищать номинаторов от диплоера контракта, поскольку это отдельные сущности. Такая схема считается нормальной, но ее очень сложно проверить полностью из-за размера поверхности атаки. Это решение имеет смысл в том случае, если валидатор не имеет достаточно средств на стейкинг для самостоятельной валидации или хочет разделить прибыль со сторонними стейкхолдерами.

### 4. Single nominator

Именно такая настройка реализована в этом репо. It's a very simplified version of the nominator pool that supports a single nominator. There is no need to protect this nominator from the contract deployer, as they are the same entity.

![image](/img/nominator-pool/single-nominator-architecture.png)

Если у вас есть single nominator, который располагает всеми ставками для валидации, это самая надежная схема, которую можно использовать. Помимо простоты, этот смарт-контракт позволяет использовать владельцу различные аварийные защитные функции, например, восстановление ставки при возможном сценарии обновления _Избирателя_, которое может разрушить интерфейс восстановления ставки.

## Сообщения владельца

Владелец номинатора может выполнить 4 операции:

#### 1. `withdraw`

Используется для вывода средств на кошелек владельца. Чтобы вывести средства, владелец должен отправить сообщение, содержащее: opcode=0x1000 (32 бита), query_id (64 бита) и сумму вывода (переменная coin). Смарт-контракт номинатора отправит средства с флагом BOUNCEABLE и mode=64. <br/><br/>
Если владелец использует **горячий кошелек** (не рекомендуется), [withdraw-deeplink.ts](https://github.com/ton-blockchain/single-nominator/blob/main/scripts/ts/withdraw-deeplink.ts) может использоваться для создания deeplink, чтобы инициировать вывод средств с кошелька tonkeeper. <br/>
Командная строка: `ts-node scripts/ts/withdraw-deeplink.ts single-nominator-addr withdraw-amount`, где:

Command line: `ts-node scripts/ts/withdraw-deeplink.ts single-nominator-addr withdraw-amount` where:

- single-nominator-addr – адрес single nominator, с которого владелец хочет вывести средства.
- withdraw-amount is the amount to withdraw. withdraw-amount – сумма вывода. Смарт-контракт номинатора оставит в контракте 1 TON, поэтому фактическая сумма, которая будет отправлена на адрес владельца, будет минимальной между запрошенной суммой и балансом контракта -1.

Владелец должен запустить deeplink с телефона с кошельком tonkeeper.

Если владелец использует **холодный кошелек** (рекомендуется), [withdraw.fif](https://github.com/ton-blockchain/single-nominator/blob/main/scripts/fift/withdraw.fif) может использоваться для создания тела boc, содержащего опкод withdraw и сумму для вывода.

<br/>
Командная строка: `fift -s scripts/fif/withdraw.fif withdraw-amount`, <br/> где withdraw-amount – сумма для вывода средств из контракта номинатора на кошелек владельца. Как указано выше, в контракте номинатора будет оставлено не менее 1 TON.

<br/>
Этот скрипт сгенерирует тело boc (с именем withdraw.boc), которое должно быть подписано и отправлено с кошелька владельца.

From the black computer, the owner should run the following:

- создайте и подпишите tx: `fift -s wallet-v3.fif my-wallet single_nominator_address sub_wallet_id seqno amount -B withdraw.boc`, где my-wallet – это pk-файл владельца (без расширения). Суммы 1 TON должно быть достаточно, чтобы оплатить комиссию (оставшаяся сумма будет возвращена владельцу). Файл withdraw.boc – это boc, сгенерированный выше.
- с компьютера с доступом в интернет выполните следующие действия: `lite-client -C global.config.json -c 'sendfile wallet-query.boc'`, чтобы отправить boc-файл (wallet-query.boc), созданный на предыдущем шаге.

### 2. `change-validator`

Используется для изменения адреса валидатора. Валидатор может отправить избирателю только NEW_STAKE и RECOVER_STAKE. Если приватный ключ валидатора был скомпрометирован, адрес валидатора может быть изменен. Обратите внимание, что в этом случае средства находятся в безопасности, так как только владелец может вывести средства.<br/>

Если владелец использует **горячий кошелек** (не рекомендуется), [change-validator-deeplink.ts](https://github.com/ton-blockchain/single-nominator/blob/main/scripts/ts/change-validator-deeplink.ts) может использоваться для создания deeplink, чтобы изменить адрес валидатора.

<br/>
Командная строка: `ts-node scripts/ts/change-validator-deeplink.ts single-nominator-addr new-validator-address`, где:

- single-nominator-addr – адрес  single nominator.
- new-validator-address (по-умолчанию адрес ZERO) – это адрес нового валидатора. If you want to disable the validator immediately and only later set a new validator, it might be convenient to set the validator address to the ZERO address.

The owner should run the deeplink from a phone with a tonkeeper wallet.

Если владелец использует **холодный кошелек** (рекомендуется), [change-validator.fif](https://github.com/ton-blockchain/single-nominator/blob/main/scripts/fift/change-validator.fif) может использоваться для создания тела boc, содержащего опкод change-validator и новый адрес валидатора.

<br/>
Командная строка: `fift -s scripts/fif/change-validator.fif new-validator-address`.
Этот скрипт сгенерирует тело boc (с именем change-validator.boc), которое должно быть подписано и отправлено из кошелька владельца.

From the black computer, the owner should run the following:

- создайте и подпишите tx: `fift -s wallet-v3.fif my-wallet single_nominator_address sub_wallet_id seqno amount -B change-validator.boc`, где my-wallet – это pk-файл владельца (без расширения). Суммы 1 TON должно быть достаточно, чтобы оплатить комиссию (оставшаяся сумма будет возвращена владельцу). Файл change-validator.boc – это boc, сгенерированный выше.
- с компьютера с доступом в интернет выполните следующие действия: `lite-client -C global.config.json -c 'sendfile wallet-query.boc'`, чтобы отправить boc-файл (wallet-query.boc), созданный на предыдущем шаге.

### 3. `send-raw-msg`

This opcode is not expected to be used under normal conditions.

It can be used to send **any** message from the nominator contract (it must be signed and sent from the owner's wallet).

Use this opcode to recover funds from a changed Elector contract address where standard RECOVER_STAKE fails. The owner must construct a custom message containing the following:

- `opcode=0x7702` (32 bits)
- `query_id` (64 bits)
- `mode` (8 bits)
- The raw message cell reference

### 4. `upgrade`

This emergency opcode (0x9903) should only be used to upgrade the nominator contract in critical situations. The message must include:

- `opcode=0x9903` (32 bits)
- `query_id` (64 bits)
- New contract code cell reference

## См. также

- [Single Nominator Pool](https://github.com/ton-blockchain/single-nominator)
- [Как использовать Single Nominator Pool](/v3/guidelines/smart-contracts/howto/single-nominator-pool)
- [Orbs Single Nominator Pool (legacy)](https://github.com/orbs-network/single-nominator)

<Feedback />

