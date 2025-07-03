import Button from '@site/src/components/button'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Обработка платежей

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

На этой странице **объясняется, как обрабатывать** (отправлять и принимать) `цифровые активы` в блокчейне TON. В **основном** она описывает, как работать с `TON coins`, но **теоретическая часть важна**, даже если вы хотите обрабатывать только `жетоны`.

:::tip
Рекомендуется ознакомиться с [Обзором обработки активов](/v3/documentation/dapps/assets/overview) перед прочтением этого руководства.
:::

## Смарт-контракт кошелька

Смарт-контракты кошелька в сети TON позволяют внешним акторам взаимодействовать с сущностями блокчейна.

- Аутентифицирует владельца: отклоняет запросы, которые пытаются обработать или оплатить комиссии от имени лиц, не являющихся владельцами.
- Обеспечивает защиту от повторного использования: предотвращает повторное выполнение одного и того же запроса, например отправку активов в другой смарт-контракт.
- Инициирует произвольные взаимодействия с другими смарт-контрактами.

Стандартное решение для первой проблемы — криптография с открытым ключом: `wallet` хранит открытый ключ и проверяет, что входящее сообщение с запросом подписано соответствующим закрытым ключом, который известен только владельцу.

Решение третьей проблемы также распространено; Как правило, запрос содержит полностью сформированное внутреннее сообщение, которое `wallet` отправляет в сеть. Однако для защиты от повторного использования существует несколько различных подходов.

### Кошельки на основе Seqno

Кошельки на основе Seqno используют простейший подход к упорядочиванию сообщений. Каждое сообщение имеет специальное целое число `seqno`, которое должно совпадать со счетчиком, хранящимся в смарт-контракте `wallet`. `wallet` обновляет свой счетчик при каждом запросе, тем самым гарантируя, что один запрос не будет обработан дважды. Существует несколько версий `wallet`, которые отличаются открытыми методами: возможностью ограничивать запросы по времени истечения срока действия и возможностью иметь несколько кошельков с одним и тем же открытым ключом. Однако неотъемлемым требованием этого подхода является отправка запросов по одному, поскольку любой пропуск в последовательности `seqno` приведет к невозможности обработки всех последующих запросов.

### Высоконагруженные кошельки

Этот тип `wallet` следует подходу, основанному на хранении идентификатора непросроченных обработанных запросов в хранилище смарт-контракта. При этом подходе любой запрос проверяется на предмет дубликата уже обработанного запроса и, если обнаруживается повтор, отклоняется. Из-за истечения срока действия контракт может не хранить все запросы вечно, но он удалит те, которые не могут быть обработаны из-за ограничения срока действия. Запросы в этот `wallet` можно отправлять параллельно без помех, но этот подход требует более сложного отслеживания обработки запросов.

### Развертывание кошелька

Чтобы развернуть кошелек через TonLib, необходимо:

1. Сгенерировать пару закрытый/открытый ключ с помощью [createNewKey](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L244) или его функций-оберток (пример в [tonlib-go](https://github.com/mercuryoio/tonlib-go/tree/master/v2#create-new-private-key)). Обратите внимание, что закрытый ключ генерируется локально и не покидает хост-машину.
2. Сформировать структуру [InitialAccountWallet](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L62), соответствующую одному из включенных `wallet`. В настоящее время доступны `wallet.v3`, `wallet.v4`, `wallet.highload.v1` и `wallet.highload.v2`.
3. Рассчитать адрес нового смарт-контракта кошелька с помощью метода [getAccountAddress](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L283). Мы рекомендуем использовать ревизию по умолчанию `0`, а также развернуть кошельки в basechain `workchain=0` для более низких комиссий за обработку и хранение.
4. Отправить немного Toncoin на рассчитанный адрес. Обратите внимание, что вам нужно отправлять их в режиме `non-bounce`, так как этот адрес пока не имеет кода и не может обрабатывать входящие сообщения. Флаг `non-bounce` указывает, что даже если обработка не удалась, деньги не должны быть возвращены с сообщением о недоставке. Мы не рекомендуем использовать флаг `non-bounce` для других транзакций, особенно при переносе больших сумм, так как механизм возврата обеспечивает некоторую степень защиты от ошибок.
5. Сформируйте желаемое [действие](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L154), например `actionNoop` только для развертывания. Затем используйте [createQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L292) и [sendQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L300), чтобы инициировать взаимодействие с блокчейном.
6. Проверьте контракт за несколько секунд с помощью метода [getAccountState](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L288).

:::tip
Подробнее в [руководстве по кошельку](/v3/guidelines/smart-contracts/howto/wallet#-deploying-a-wallet)
:::

### Проверьте правильность адреса кошелька

Большинство SDK принудительно проверяют адреса (большинство проверяют их во время создания кошелька или процесса подготовки транзакции), поэтому, как правило, от вас не требуется никаких дополнительных сложных шагов.

<Tabs groupId="address-examples">

  <TabItem value="Tonweb" label="JS (Tonweb)">

```js
  const TonWeb = require("tonweb")
  TonWeb.utils.Address.isValid('...')
```

  </TabItem>
  <TabItem value="GO" label="tonutils-go">

```python
package main

import (
  "fmt"
  "github.com/xssnick/tonutils-go/address"
)

if _, err := address.ParseAddr("EQCD39VS5j...HUn4bpAOg8xqB2N"); err != nil {
  return errors.New("invalid address")
}
```

  </TabItem>
  <TabItem value="Java" label="Ton4j">

```javascript
try {
  Address.of("...");
  } catch (e) {
  // not valid address
}
```

  </TabItem>
  <TabItem value="Kotlin" label="ton-kotlin">

```javascript
  try {
    AddrStd("...")
  } catch(e: IllegalArgumentException) {
      // not valid address
  }
```

  </TabItem>
</Tabs>

:::tip
Полное описание адреса на странице [адресов смарт-контракта](/v3/documentation/smart-contracts/addresses).
:::

## Работа с переводами

### Проверка транзакций контракта

Транзакции контракта можно получить с помощью [getTransactions](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get). Этот метод позволяет получить 10 транзакций из некоторого `last_transaction_id` и более ранних. Для обработки всех входящих транзакций необходимо выполнить следующие шаги:

1. Последний `last_transaction_id` можно получить с помощью [getAddressInformation](https://toncenter.com/api/v2/#/accounts/get_address_information_getAddressInformation_get)
2. Список из 10 транзакций необходимо загрузить с помощью метода `getTransactions`.
3. Обрабатывайте транзакции с непустым источником во входящем сообщении и назначением, равным адресу аккаунта.
4. Следующие 10 транзакций должны быть загружены, и шаги 2,3,4,5 должны быть повторены, пока не будут обработаны все входящие транзакции.

### Отслеживание входящих/исходящих транзакций

Во время обработки транзакций можно отслеживать поток сообщений. Поскольку поток сообщений представляет собой DAG, достаточно получить текущую транзакцию с помощью метода [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) и найти входящую транзакцию по `out_msg` с помощью [tryLocateResultTx](https://testnet.toncenter.com/api/v2/#/transactions/get_try_locate_result_tx_tryLocateResultTx_get) или исходящие транзакции по `in_msg` с помощью [tryLocateSourceTx](https://testnet.toncenter.com/api/v2/#/transactions/get_try_locate_source_tx_tryLocateSourceTx_get).

<Tabs groupId="example-outgoing-transaction">
<TabItem value="JS" label="JS">

```ts
import { TonClient, Transaction } from '@ton/ton';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { CommonMessageInfoInternal } from '@ton/core';

async function findIncomingTransaction(client: TonClient, transaction: Transaction): Promise<Transaction | null> {
  const inMessage = transaction.inMessage?.info;
  if (inMessage?.type !== 'internal') return null;
  return client.tryLocateSourceTx(inMessage.src, inMessage.dest, inMessage.createdLt.toString());
}

async function findOutgoingTransactions(client: TonClient, transaction: Transaction): Promise<Transaction[]> {
  const outMessagesInfos = transaction.outMessages.values()
    .map(message => message.info)
    .filter((info): info is CommonMessageInfoInternal => info.type === 'internal');
  
  return Promise.all(
    outMessagesInfos.map((info) => client.tryLocateResultTx(info.src, info.dest, info.createdLt.toString())),
  );
}

async function traverseIncomingTransactions(client: TonClient, transaction: Transaction): Promise<void> {
  const inTx = await findIncomingTransaction(client, transaction);
  // now you can traverse this transaction graph backwards
  if (!inTx) return;
  await traverseIncomingTransactions(client, inTx);
}

async function traverseOutgoingTransactions(client: TonClient, transaction: Transaction): Promise<void> {
  const outTxs = await findOutgoingTransactions(client, transaction);
  // do smth with out txs
  for (const out of outTxs) {
    await traverseOutgoingTransactions(client, out);
  }
}

async function main() {
  const endpoint = await getHttpEndpoint({ network: 'testnet' });
  const client = new TonClient({
    endpoint,
    apiKey: '[API-KEY]',
  });
  
  const transaction: Transaction = ...; // Obtain first transaction to start traversing
  await traverseIncomingTransactions(client, transaction);
  await traverseOutgoingTransactions(client, transaction);
}

main();
```

</TabItem>
</Tabs>

### Отправка платежей

:::tip
Изучите базовый пример обработки платежей из [TMA USDT Payments demo](https://github.com/ton-community/tma-usdt-payments-demo)
:::

1. Сервис должен развернуть `wallet` и поддерживать его финансирование, чтобы предотвратить уничтожение контракта из-за платы за хранение. Обратите внимание, что плата за хранение обычно составляет менее 1 Toncoin в год.
2. Сервис должен получить от пользователя `destination_address` и необязательный `comment`. Обратите внимание, что на данный момент мы рекомендуем либо запретить незавершенные исходящие платежи с тем же набором (`destination_address`, `value`, `comment`), либо правильно запланировать эти платежи; таким образом, следующий платеж будет инициирован только после подтверждения предыдущего.
3. Форма [msg.dataText](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L103) с `comment` в виде текста.
4. Форма [msg.message](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L113), которая содержит `destination_address`, пустой `public_key`, `amount` и `msg.dataText`.
5. Форма [Action](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L154), которая содержит набор исходящих сообщений.
6. Используйте запросы [createQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L292) и [sendQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L300) для отправки исходящих платежей.
7. Сервис должен регулярно опрашивать метод [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) для контракта `wallet`. Сопоставление подтвержденных транзакций с исходящими платежами по (`destination_address`, `value`, `comment`) позволяет отмечать платежи как завершенные; обнаруживать и показывать пользователю соответствующий хэш транзакции и lt (логическое время).
8. Запросы к `v3` `высоконагруженных` кошельков имеют срок действия, равный по умолчанию 60 секундам. По истечении этого времени необработанные запросы можно безопасно повторно отправлять в сеть (см. шаги 3-6).

:::caution
Если прикрепленное `value` слишком мало, транзакция может быть прервана с ошибкой `cskip_no_gas`. В этом случае Toncoins будут успешно переведены, но логика на другой стороне не будет выполнена (TVM даже не запустится). Подробнее об ограничениях газа можно прочитать [здесь](/v3/documentation/network/configs/blockchain-configs#param-20-and-21).
:::

### Получение идентификатора транзакции

Может быть непонятно, что для получения дополнительной информации о транзакции пользователь должен сканировать блокчейн с помощью функции [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get). Невозможно получить идентификатор транзакции сразу после отправки сообщения, так как транзакция должна быть сначала подтверждена сетью блокчейна. Чтобы понять требуемый конвейер, внимательно прочтите [Отправка платежей](/v3/guidelines/dapps/asset-processing/payments-processing/#send-payments), особенно 7-й пункт.

## Подход на основе счета-фактуры

Чтобы принимать платежи на основании прикрепленных комментариев, сервис должен

1. Развернуть контракт `wallet`.
2. Сгенерировать уникальный `invoice` для каждого пользователя. Достаточно будет строкового представления uuid32.
3. Пользователям следует дать указание отправить Тонкоин на `кошелек` сервиса с приложенным `счетом-фактурой` в качестве комментария.
4. Сервис должен регулярно опрашивать метод [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) для контракта `wallet`.
5. Для новых транзакций входящее сообщение должно быть извлечено, `комментарий` сопоставлен с базой данных, а **значение входящего сообщения** зачислено на счет пользователя.

Чтобы вычислить **значение входящего сообщения**, которое сообщение приносит в контракт, необходимо проанализировать транзакцию. Это происходит, когда сообщение попадает в контракт. Транзакция может быть получена с помощью [getTransactions](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L268). Для входящей транзакции кошелька правильные данные состоят из одного входящего сообщения и нуля исходящих сообщений. В противном случае либо внешнее сообщение отправляется в кошелек, и в этом случае владелец тратит Toncoin, либо кошелек не развертывается, и входящая транзакция возвращается обратно.

В любом случае, в общем случае сумма, которую сообщение приносит контракту, может быть рассчитана как стоимость входящего сообщения минус сумма значений исходящих сообщений за вычетом комиссии: `value_{in_msg} - SUM(value_{out_msg}) - fee`. Технически представление транзакции содержит три разных поля с комиссией в названии: `fee`, `storage_fee` и `other_fee`, то есть общая комиссия, часть комиссии, связанная с расходами на хранение, и часть комиссии, связанная с обработкой транзакции. Следует использовать только первое из них.

### Счета с TON Connect

Лучше всего подходят для dApps, которым необходимо подписывать несколько платежей/транзакций в течение сеанса или необходимо поддерживать соединение с кошельком в течение некоторого времени.

- ✅ Постоянный канал связи с кошельком, информация об адресе пользователя

- ✅ Пользователям нужно только один раз отсканировать QR-код

- ✅ Можно узнать, подтвердил ли пользователь транзакцию в кошельке, отследить транзакцию по возвращенному BOC

- ✅ Готовые SDK и UI-компоненты доступны для разных платформ

- ❌ Если вам нужно отправить только один платеж, пользователю нужно выполнить два действия: подключить кошелек и подтвердить транзакцию

- ❌ Интеграция сложнее, чем ссылка ton://

<Button href="/v3/guidelines/ton-connect/overview/"
colorType="primary" sizeType={'lg'}>

Узнать больше

</Button>

### Счета со ссылкой ton://

:::warning
Ссылка Ton устарела, не используйте ее
:::

Если вам нужна простая интеграция для простого пользовательского потока, подойдет ссылка ton://. Лучше всего подходит для разовых платежей и счетов.

```bash
ton://transfer/<destination-address>?
    [nft=<nft-address>&]
    [fee-amount=<nanocoins>&]
    [forward-amount=<nanocoins>] 
```

- ✅ Простая интеграция

- ✅ Не нужно подключать кошелек

- ❌ Пользователям нужно сканировать новый QR-код для каждого платежа

- ❌ Невозможно отследить, подписал ли пользователь транзакцию или нет

- ❌ Нет информации об адресе пользователя

- ❌ Необходимы обходные пути на платформах, где такие ссылки не кликабельны (например, сообщения от ботов для клиентов Telegram на настольных ПК)

[Узнайте больше о ссылках ton здесь](https://github.com/tonkeeper/wallet-api#payment-urls)

## Обозреватели

Обозреватель блокчейна - https://tonscan.org.

Чтобы сгенерировать ссылку на транзакцию в обозревателе, сервису необходимо получить lt (логическое время), хэш транзакции и адрес учетной записи (адрес учетной записи, для которой lt и txhash были получены с помощью метода [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get)). https://tonscan.org и https://explorer.toncoin.org/ могут затем показать страницу для этой транзакции в следующем формате:

`https://tonviewer.com/transaction/{txhash as base64url}`

`https://tonscan.org/tx/{lt as int}:{txhash as base64url}:{account address}`

`https://explorer.toncoin.org/transaction?account={account address}&lt={lt as int}&hash={txhash as base64url}`

Обратите внимание, что tonviewer и tonscan поддерживают внешний хэш сообщения вместо хэша транзакции для ссылки в проводнике. Это может быть полезно, когда вы генерируете внешнее сообщение и хотите мгновенно сгенерировать ссылку. Подробнее о транзакциях и хэшах сообщений [здесь](/v3/guidelines/dapps/cookbook#how-to-find-transaction-or-message-hash)

## Лучшие практики

### Создание кошелька

<Tabs groupId="example-create_wallet">
<TabItem value="JS" label="JS">

- **toncenter:**
  - [Создание кошелька + получение адреса кошелька](https://github.com/toncenter/examples/blob/main/common.js)

- **ton-community/ton:**
  - [Создание кошелька + получение баланса](https://github.com/ton-community/ton#usage)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**
  - [Создание кошелька + получение баланса](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#wallet)

</TabItem>

<TabItem value="Python" label="Python">

- **psylopunk/pythonlib:**
  - [Создание кошелька + получение адреса кошелька](https://github.com/psylopunk/pytonlib/blob/main/examples/generate_wallet.py)
- **yungwine/pytoniq:**

```py
import asyncio

from pytoniq.contract.wallets.wallet import WalletV4R2
from pytoniq.liteclient.balancer import LiteBalancer


async def main():
    provider = LiteBalancer.from_mainnet_config(2)
    await provider.start_up()

    mnemonics, wallet = await WalletV4R2.create(provider)
    print(f"{wallet.address=} and {mnemonics=}")

    await provider.close_all()


if __name__ == "__main__":
    asyncio.run(main())
```

</TabItem>

</Tabs>

### Создание кошелька для разных шардов

При большой нагрузке блокчейн TON может разделиться на [шарды] (/v3/documentation/smart-contracts/shards/shards-intro). Простая аналогия шарда в мире Web3 — это сегмент сети.

Точно так же, как мы распределяем инфраструктуру услуг в мире Web2, чтобы она была как можно ближе к конечному пользователю, в TON мы можем развертывать контракты, которые будут находиться в том же шарде, что и кошелек пользователя или любой другой контракт, который взаимодействует с ним.

Например, DApp, который собирает плату с пользователей за будущий эирдроп, может подготовить отдельные кошельки для каждого шарда, чтобы улучшить пользовательский опыт в дни пиковой нагрузки. Чтобы достичь максимальной скорости обработки, вам нужно будет развернуть один кошелек collector на шард.

Префикс шарда `SHARD_INDEX` контракта определяется первыми 4 битами его хэша адреса. Чтобы развернуть кошелек в определенном шарде, можно использовать логику, основанную на следующем фрагменте кода:

```javascript

import { NetworkProvider, sleep } from '@ton/blueprint';
import { Address, toNano } from "@ton/core";
import {mnemonicNew, mnemonicToPrivateKey} from '@ton/crypto';
import { WalletContractV3R2 } from '@ton/ton';

export async function run(provider?: NetworkProvider) {
  if(!process.env.SHARD_INDEX) {
    throw new Error("Shard index is not specified");
  }

    const shardIdx = Number(process.env.SHARD_INDEX);
    let testWallet: WalletContractV3R2;
    let mnemonic:  string[];
    do {
        mnemonic   = await mnemonicNew(24);
        const keyPair = await mnemonicToPrivateKey(mnemonic);
        testWallet = WalletContractV3R2.create({workchain: 0, publicKey: keyPair.publicKey});
    } while(testWallet.address.hash[0] >> 4 !== shardIdx);

    console.log("Mnemonic for shard found:", mnemonic);
    console.log("Wallet address:",testWallet.address.toRawString());
}

if(require.main === module) {
run();
}

```

В случае контракта кошелька можно использовать `subwalletId` вместо мнемоники, однако `subwalletId` не поддерживается приложениями кошелька.

После завершения развертывания вы можете выполнить обработку по следующему алгоритму:

1. Пользователь заходит на страницу DApp и запрашивает действие.
2. DApp выбирает ближайший к пользователю кошелек (соответствует 4-битному префиксу)
3. DApp предоставляет пользователю payload, отправляя его плату в выбранный кошелек.

Таким образом, вы сможете обеспечить наилучший возможный пользовательский опыт независимо от текущей загрузки сети.

### Депозиты Toncoin (получение toncoins)

<Tabs groupId="example-toncoin_deposit">
<TabItem value="JS" label="JS">

- **toncenter:**
  - [Обработка депозита Toncoins](https://github.com/toncenter/examples/blob/main/deposits.js)
  - [Обработка депозита Toncoins на несколько кошельков](https://github.com/toncenter/examples/blob/main/deposits-multi-wallets.js)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**

<details>
<summary>Проверка депозитов</summary>

```go
package main 

import (
	"context"
	"encoding/base64"
	"log"

	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/ton"
)

const (
	num = 10
)

func main() {
	client := liteclient.NewConnectionPool()
	err := client.AddConnectionsFromConfigUrl(context.Background(), "https://ton.org/global.config.json")
	if err != nil {
		panic(err)
	}

	api := ton.NewAPIClient(client, ton.ProofCheckPolicyFast).WithRetry()

	accountAddr := address.MustParseAddr("0QA__NJI1SLHyIaG7lQ6OFpAe9kp85fwPr66YwZwFc0p5wIu")

	// we need fresh block info to run get methods
	b, err := api.CurrentMasterchainInfo(context.Background())
	if err != nil {
		log.Fatal(err)
	}

	// we use WaitForBlock to make sure block is ready,
	// it is optional but escapes us from liteserver block not ready errors
	res, err := api.WaitForBlock(b.SeqNo).GetAccount(context.Background(), b, accountAddr)
	if err != nil {
		log.Fatal(err)
	}

	lastTransactionId := res.LastTxHash
	lastTransactionLT := res.LastTxLT

	headSeen := false

	for {
		trxs, err := api.ListTransactions(context.Background(), accountAddr, num, lastTransactionLT, lastTransactionId)
		if err != nil {
			log.Fatal(err)
		}

		for i, tx := range trxs {
			// should include only first time lastTransactionLT
			if !headSeen {
				headSeen = true
			} else if i == 0 {
				continue
			}

			if tx.IO.In == nil || tx.IO.In.Msg.SenderAddr().IsAddrNone() {
				// external message should be omitted
				continue
			}

      if tx.IO.Out != nil {
				// no outgoing messages - this is incoming Toncoins
				continue
			}

			// process trx
			log.Printf("found in transaction hash %s", base64.StdEncoding.EncodeToString(tx.Hash))
		}

		if len(trxs) == 0 || (headSeen && len(trxs) == 1) {
			break
		}

		lastTransactionId = trxs[0].Hash
		lastTransactionLT = trxs[0].LT
	}
}
```

</details>
</TabItem>

<TabItem value="Python" label="Python">

- **yungwine/pytoniq:**

<summary>Проверка депозитов</summary>

```python
import asyncio

from pytoniq_core import Transaction

from pytoniq import LiteClient, Address

MY_ADDRESS = Address("kf8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM_BP")


async def main():
    client = LiteClient.from_mainnet_config(ls_i=0, trust_level=2)

    await client.connect()

    last_block = await client.get_trusted_last_mc_block()

    _account, shard_account = await client.raw_get_account_state(MY_ADDRESS, last_block)
    assert shard_account

    last_trans_lt, last_trans_hash = (
        shard_account.last_trans_lt,
        shard_account.last_trans_hash,
    )

    while True:
        print(f"Waiting for{last_block=}")

        transactions = await client.get_transactions(
            MY_ADDRESS, 1024, last_trans_lt, last_trans_hash
        )
        toncoin_deposits = [tx for tx in transactions if filter_toncoin_deposit(tx)]
        print(f"Got {len(transactions)=} with {len(toncoin_deposits)=}")

        for deposit_tx in toncoin_deposits:
            # Process toncoin deposit transaction
            print(deposit_tx.cell.hash.hex())

        last_trans_lt = transactions[0].lt
        last_trans_hash = transactions[0].cell.hash


def filter_toncoin_deposit(tx: Transaction):
    if tx.out_msgs:
        return False

    if tx.in_msg:
        return False

    return True


if __name__ == "__main__":
    asyncio.run(main())
```

</TabItem>
</Tabs>

### Вывод Toncoin (отправка toncoins)

<Tabs groupId="example-toncoin_withdrawals">
<TabItem value="JS" label="JS">

- **toncenter:**
  - [Вывод Toncoins из кошелька партиями](https://github.com/toncenter/examples/blob/main/withdrawals-highload-batch.js)
  - [Вывод Toncoins из кошелька](https://github.com/toncenter/examples/blob/main/withdrawals-highload.js)

- **ton-community/ton:**
  - [Вывод Toncoins из кошелька](https://github.com/ton-community/ton#usage)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**
  - [Вывод Toncoins из кошелька](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#wallet)

</TabItem>

<TabItem value="Python" label="Python">

- **yungwine/pytoniq:**

```python
import asyncio

from pytoniq_core import Address
from pytoniq.contract.wallets.wallet import WalletV4R2
from pytoniq.liteclient.balancer import LiteBalancer


MY_MNEMONICS = "one two tree ..."
DESTINATION_WALLET = Address("Destination wallet address")


async def main():
    provider = LiteBalancer.from_mainnet_config()
    await provider.start_up()

    wallet = await WalletV4R2.from_mnemonic(provider, MY_MNEMONICS)

    await wallet.transfer(DESTINATION_WALLET, 5)
    
    await provider.close_all()


if __name__ == "__main__":
    asyncio.run(main())
```

</TabItem>

</Tabs>

### Получение транзакций контракта

<Tabs groupId="example-get_transactions">
<TabItem value="JS" label="JS">

- **ton-community/ton:**
  - [Клиент с методом getTransaction](https://github.com/ton-community/ton/blob/master/src/client/TonClient.ts)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**
  - [Получение транзакций](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#account-info-and-transactions)

</TabItem>

<TabItem value="Python" label="Python">

- **yungwine/pytoniq:**
  - [Получение транзакций](https://github.com/yungwine/pytoniq/blob/master/examples/transactions.py)

</TabItem>

</Tabs>

## SDK

Полный список SDK для различных языков программирования (JS, Python, Golang и т. д.) доступен [здесь](/v3/guidelines/dapps/apis-sdks/sdk).
