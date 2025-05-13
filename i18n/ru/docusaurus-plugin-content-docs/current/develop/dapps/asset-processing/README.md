import Button from '@site/src/components/button'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Обработка платежей

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Эта страница **объясняет, как обрабатывать** (отправлять и принимать) `цифровые активы` на блокчейне TON.
Здесь **в основном** описывается работа с `монетами TON`, но **теоретическая часть** является **важной**, даже если Вы хотите обрабатывать только `джеттоны`.

## Смарт-контракт кошелька

Смарт-контракты кошелька - это контракты в сети TON, которые служат для того, чтобы позволить участникам, находящимся вне блокчейна, взаимодействовать с сущностями блокчейна. В целом, они решают три задачи:

- удостоверяет подлинность владельца: Отказывается обрабатывать и оплачивать запросы лиц, не являющихся владельцами.
- Защита от повторов: Запрещает повторное выполнение одного запроса, например, отправку активов другому смарт-контракту.
- инициирует произвольное взаимодействие с другими смарт-контрактами.

Стандартным решением первой задачи является криптография с открытым ключом: `кошелек` хранит открытый ключ и проверяет, что входящее сообщение с запросом подписано соответствующим закрытым ключом, который известен только его владельцу.

Решение третьей задачи также является общим; обычно запрос содержит полностью сформированное внутреннее сообщение, которое `кошелек` отправляет в сеть. Однако для защиты от воспроизведения существует несколько различных подходов.

### Кошельки на основе Seqno

Кошельки на основе Seqno используют наиболее простой подход к определению последовательности сообщений. Каждое сообщение имеет специальное целое число `seqno`, которое должно совпадать со счетчиком, хранящимся в смарт-контракте `wallet`. `wallet` обновляет свой счетчик при каждом запросе, гарантируя тем самым, что один запрос не будет обработан дважды. Существует несколько версий `wallet`, которые отличаются от общедоступных методов: возможность ограничивать запросы по времени истечения срока действия и возможность иметь несколько кошельков с одним и тем же открытым ключом. Однако неотъемлемым требованием такого подхода является отправка запросов по одному, поскольку любой разрыв в последовательности `seqno` приведет к невозможности обработки всех последующих запросов.

### Кошельки с высокой нагрузкой

Этот тип `кошелька` использует подход, основанный на хранении идентификатора непросроченных обработанных запросов в хранилище смарт-контрактов. При таком подходе любой запрос проверяется на предмет дублирования уже обработанного запроса и, в случае обнаружения повтора, отбрасывается. Из-за истечения срока действия контракт не может хранить все запросы вечно, но он будет удалять те, которые не могут быть обработаны из-за ограничения срока действия. Запросы к этому `кошельку` могут отправляться параллельно, не мешая друг другу; однако такой подход требует более сложного контроля за обработкой запросов.

### Развертывание кошелька

Чтобы развернуть кошелек с помощью TonLib, необходимо:

1. Сгенерируйте пару закрытый/открытый ключ с помощью [createNewKey](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L244) или ее функций-оберток (пример в [tonlib-go](https://github.com/mercuryoio/tonlib-go/tree/master/v2#create-new-private-key)). Обратите внимание, что закрытый ключ генерируется локально и не покидает хост-машину.
2. Сформируйте структуру [InitialAccountWallet](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L62), соответствующую одному из включенных `кошельков`. В настоящее время доступны `wallet.v3`, `wallet.v4`, `wallet.highload.v1`, `wallet.highload.v2`.
3. Вычислите адрес нового смарт-контракта `кошелька` с помощью метода [getAccountAddress](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L283). Мы рекомендуем использовать ревизию по умолчанию `0`, а также развертывать кошельки в базовой цепи `workchain=0` для снижения платы за обработку и хранение данных.
4. Отправьте несколько Toncoin на вычисленный адрес. Обратите внимание, что отправлять их нужно в режиме `non-bounce`, поскольку этот адрес еще не имеет кода и поэтому не может обрабатывать входящие сообщения. Флаг `non-bounce` указывает, что даже если обработка не удалась, деньги не должны быть возвращены с сообщением об отказе. Мы не рекомендуем использовать флаг `non-bounce` для других транзакций, особенно при переводе больших сумм, поскольку механизм отказов обеспечивает некоторую степень защиты от ошибок.
5. Сформируйте желаемое [действие](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L154), например, `actionNoop` только для развертывания. Затем используйте [createQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L292) и [sendQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L300), чтобы инициировать взаимодействие с блокчейном.
6. Проверьте контракт за несколько секунд с помощью метода [getAccountState](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L288).

:::tip
Подробнее читайте в [Учебнике по кошельку] (/develop/smart-contracts/tutorials/wallet#-deploying-a-wallet)
:::

### Проверьте действительность адреса кошелька

Большинство SDK заставляют Вас проверять адрес (большинство проверяет его в процессе создания кошелька или подготовки транзакции), поэтому, как правило, это не требует от Вас никаких дополнительных сложных действий.

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
Полное описание адресов на странице [Адреса смарт-контрактов](/learn/overviews/addresses).
:::

## Работа с переводами

### Проверьте сделки по контракту

Транзакции контракта можно получить с помощью метода [getTransactions](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get). Этот метод позволяет получить 10 транзакций с некоторого `последнего_transaction_id` и более ранних. Чтобы обработать все входящие транзакции, необходимо выполнить следующие шаги:

1. Последний `последний_транзакционный_ид` можно получить с помощью [getAddressInformation](https://toncenter.com/api/v2/#/accounts/get_address_information_getAddressInformation_get)
2. Список из 10 транзакций должен быть загружен с помощью метода `getTransactions`.
3. Обрабатывайте транзакции с непустым источником во входящем сообщении и адресом назначения, равным адресу счета.
4. Следующие 10 транзакций должны быть загружены, и шаги 2,3,4,5 должны повторяться до тех пор, пока Вы не обработаете все входящие транзакции.

### Получение входящих/исходящих транзакций

Можно отслеживать поток сообщений во время обработки транзакций. Поскольку поток сообщений представляет собой DAG, достаточно получить текущую транзакцию с помощью метода [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) и найти входящую транзакцию по `out_msg` с помощью [tryLocateResultTx](https://testnet.toncenter.com/api/v2/#/transactions/get_try_locate_result_tx_tryLocateResultTx_get) или исходящую транзакцию по `in_msg` с помощью [tryLocateSourceTx](https://testnet.toncenter.com/api/v2/#/transactions/get_try_locate_source_tx_tryLocateSourceTx_get).

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

### Отправляйте платежи

1. Сервис должен развернуть `кошелек` и постоянно пополнять его, чтобы предотвратить разрушение контракта из-за платы за хранение. Обратите внимание, что плата за хранение обычно составляет менее 1 Тонкоина в год.
2. Сервис должен получить от пользователя `адрес_назначения` и необязательный `комментарий`. Обратите внимание, что на данный момент мы рекомендуем либо запретить незавершенные исходящие платежи с одинаковым набором (`адрес_назначения`, `значение`, `комментарий`), либо правильно планировать эти платежи; таким образом, следующий платеж будет инициирован только после подтверждения предыдущего.
3. Сформируйте [msg.dataText](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L103) с `comment` в качестве текста.
4. Форма [msg.message](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L113), содержащая `адрес_назначения`, пустой `публичный_ключ`, `сумму` и `msg.dataText`.
5. Форма [Действие](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L154), содержащая набор исходящих сообщений.
6. Используйте запросы [createQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L292) и [sendQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L300) для отправки исходящих платежей.
7. Сервис должен регулярно опрашивать метод [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) для контракта `wallet`. Сопоставление подтвержденных транзакций с исходящими платежами по (`адрес_назначения`, `значение`, `комментарий`) позволяет пометить платежи как завершенные; обнаружить и показать пользователю соответствующий хэш транзакции и lt (логическое время).
8. Запросы к `v3` кошелькам с `высокой нагрузкой` по умолчанию имеют время истечения, равное 60 секундам. По истечении этого времени необработанные запросы могут быть безопасно повторно отправлены в сеть (см. шаги 3-6).

### Получите идентификатор транзакции

Может быть неясно, что для получения дополнительной информации о транзакции пользователь должен просканировать блокчейн с помощью функции [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get).
Невозможно получить идентификатор транзакции сразу после отправки сообщения, поскольку транзакция сначала должна быть подтверждена сетью блокчейн.
Чтобы понять, что требуется для этого, внимательно прочитайте [Send payments](https://docs.ton.org/develop/dapps/asset-processing/#send-payments), особенно 7-й пункт.

## Подход на основе счета-фактуры

Чтобы принимать платежи на основании прикрепленных комментариев, сервис должен

1. Разверните контракт `wallet`.
2. Сгенерируйте уникальный `счет` для каждого пользователя. Строкового представления uuid32 будет достаточно.
3. Пользователям следует дать указание отправить Тонкоин на `кошелек` сервиса с приложенным `счетом-фактурой` в качестве комментария.
4. Сервис должен регулярно опрашивать метод [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) для контракта `wallet`.
5. Для новых транзакций входящее сообщение должно быть извлечено, `комментарий` сопоставлен с базой данных, а **значение входящего сообщения** зачислено на счет пользователя.

Чтобы вычислить **значение входящего сообщения**, которое сообщение приносит контракту, необходимо разобрать транзакцию. Это происходит, когда сообщение попадает в контракт. Транзакцию можно получить с помощью [getTransactions](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L268). Для входящей транзакции кошелька правильные данные состоят из одного входящего сообщения и нуля исходящих сообщений. В противном случае либо в кошелек отправляется внешнее сообщение, и тогда владелец тратит Toncoin, либо кошелек не развернут, и входящая транзакция возвращается обратно.

В любом случае, в общем случае, сумма, которую сообщение приносит контракту, может быть рассчитана как стоимость входящего сообщения минус сумма стоимостей исходящих сообщений минус комиссия: `value_{in_msg} - SUM(value_{out_msg}) - fee`. Технически, представление транзакций содержит три различных поля с `fee` в имени: `fee`, `storage_fee` и `other_fee`, то есть общая плата, часть платы, связанная с расходами на хранение, и часть платы, связанная с обработкой транзакций. Следует использовать только первую.

### Счета-фактуры с помощью TON Connect

Лучше всего подходит для dApp, которым нужно подписывать несколько платежей/транзакций в течение сессии или поддерживать соединение с кошельком в течение некоторого времени.

- ✅ Существует постоянный канал связи с кошельком, информация об адресе пользователя

- ✅ Пользователям нужно сканировать QR-код только один раз

- ✅ Можно узнать, подтвердил ли пользователь транзакцию в кошельке, отследить транзакцию по возвращенному BOC

- ✅ Готовые SDK и наборы пользовательского интерфейса доступны для разных платформ

- ❌ Если Вам нужно отправить только один платеж, пользователю необходимо выполнить два действия: подключить кошелек и подтвердить транзакцию

- ❌ Интеграция сложнее, чем просто ссылка ton://.

```mdx-code-block
<Button href="/develop/dapps/ton-connect/"
colorType="primary" sizeType={'lg'}>
```

Подробнее

```mdx-code-block
</Button>
```

### Счета-фактуры со ссылкой ton://

:::warning
Ссылка Ton устарела, избегайте ее использования
:::

Если Вам нужна простая интеграция для простого потока пользователей, лучше всего использовать ссылку ton://.
Лучше всего подходит для разовых платежей и счетов-фактур.

```bash
ton://transfer/<destination-address>?
    [nft=<nft-address>&]
    [fee-amount=<nanocoins>&]
    [forward-amount=<nanocoins>] 
```

- ✅ Легкая интеграция

- ✅ Нет необходимости подключать кошелек

- ❌ Пользователям необходимо сканировать новый QR-код для каждого платежа

- ❌ Невозможно отследить, подписал ли пользователь транзакцию или нет.

- ❌ Нет информации об адресе пользователя

- ❌ Необходимы обходные пути на платформах, где такие ссылки не кликабельны (например, сообщения от ботов для настольных клиентов Telegram).

[Подробнее о тонких ссылках здесь](https://github.com/tonkeeper/wallet-api#payment-urls)

## Explorers

Исследователь блокчейна - https://tonscan.org.

Чтобы создать ссылку на транзакцию в проводнике, служба должна получить lt (логическое время), хэш транзакции и адрес счета (адрес счета, для которого lt и txhash были получены с помощью метода [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get)). https://tonscan.org и https://explorer.toncoin.org/ могут затем показать страницу для этого tx в следующем формате:

`https://tonviewer.com/transaction/{txhash as base64url}`.

`https://tonscan.org/tx/{lt as int}:{txhash as base64url}:{account address}`

`https://explorer.toncoin.org/transaction?account={account address}&lt={lt as int}&hash={txhash as base64url}`

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

- **xssnick/tonutils-go:**.
  - [Создание кошелька + получение баланса](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#wallet)

</TabItem>

<TabItem value="Python" label="Python">

- **psylopunk/pythonlib:**.
  - [Создание кошелька + получение адреса кошелька](https://github.com/psylopunk/pytonlib/blob/main/examples/generate_wallet.py)
- **yungwine/pytoniq:**.

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

### Депозиты в тонкоинах (Получите тонкоины)

<Tabs groupId="example-toncoin_deposit">
<TabItem value="JS" label="JS">

- **toncenter:**
  - [Обработать депозит в Toncoins](https://github.com/toncenter/examples/blob/main/deposits.js)
  - [Обработка депозита Toncoins на несколько кошельков](https://github.com/toncenter/examples/blob/main/deposits-multi-wallets.js)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**.

<details>
<summary>Депозиты в чеках</summary>

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

- **yungwine/pytoniq:**.

<summary>Депозиты в чеках</summary>

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

### Вывод Тонкоинов (Отправить Тонкоины)

<Tabs groupId="example-toncoin_withdrawals">
<TabItem value="JS" label="JS">

- **toncenter:**
  - [Вывод Тонкоинов из кошелька партиями](https://github.com/toncenter/examples/blob/main/withdrawals-highload-batch.js)
  - [Вывести Тонкоины из кошелька](https://github.com/toncenter/examples/blob/main/withdrawals-highload.js)

- **ton-community/ton:**
  - [Вывести Тонкоины из кошелька](https://github.com/ton-community/ton#usage)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**.
  - [Вывести Тонкоины из кошелька](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#wallet)

</TabItem>

<TabItem value="Python" label="Python">

- **psylopunk/pythonlib:**.
  - [Вывести Тонкоины из кошелька](https://github.com/psylopunk/pytonlib/blob/main/examples/transactions.py)

- **yungwine/pytoniq:**.

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

### Получите транзакции контракта

<Tabs groupId="example-get_transactions">
<TabItem value="JS" label="JS">

- **ton-community/ton:**
  - [Клиент с методом getTransaction](https://github.com/ton-community/ton/blob/master/src/client/TonClient.ts)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**.
  - [Получить транзакции] (https://github.com/xssnick/tonutils-go?tab=readme-ov-file#account-info-and-transactions)

</TabItem>

<TabItem value="Python" label="Python">

- **psylopunk/pythonlib:**.
  - [Получить транзакции] (https://github.com/psylopunk/pytonlib/blob/main/examples/transactions.py)
- **yungwine/pytoniq:**.
  - [Получить транзакции] (https://github.com/yungwine/pytoniq/blob/master/examples/transactions.py)

</TabItem>

</Tabs>

## SDKs

Вы можете найти список SDK для различных языков (JS, Python, Golang, C#, Rust и т.д.) список [здесь](/develop/dapps/apis/sdk).
