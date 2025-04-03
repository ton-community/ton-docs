import ThemedImage from '@theme/ThemedImage';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Button from '@site/src/components/button';

# Обработка жетонов

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Лучшие практики обработки жетонов

Жетоны - это токены в блокчейне TON - их можно рассматривать аналогично токенам ERC-20 в сети Ethereum.

:::info Подтверждение транзакции
Транзакции в TON становятся необратимыми уже после одного подтверждения. Для лучшего пользовательского опыта (UX/UI) рекомендуется избегать дополнительного ожидания.
:::

#### Вывод средств

[Highload Wallet v3](/v3/documentation/smart-contracts/contracts-specs/highload-wallet#highload-wallet-v3) - это новейшее решение блокчейна TON, которое является золотым стандартом для вывода жетонов. Он позволяет вам воспользоваться преимуществами пакетной отправки средств.

[Пакетное снятие средств](https://github.com/toncenter/examples/blob/main/withdrawals-jettons-highload-batch.js) - означает, что несколько переводов отправляются пакетами, что обеспечивает быстрый и дешевый вывод средств.

#### Зачисления

:::info
Рекомендуется настроить несколько кошельков пополнения MEMO для улучшения производительности.
:::

[Пополнения с Memo](https://github.com/toncenter/examples/blob/main/deposits-jettons.js) - позволяет вам иметь один кошелек пополнения, и пользователи добавляют Memo, чтобы быть идентифицированными вашей системой. Это означает, что вам не нужно сканировать весь блокчейн, но это немного менее удобно для пользователей.

[Пополнения без Memo](https://github.com/gobicycle/bicycle) - Это решение также существует, но его интеграция более сложна. Однако мы можем помочь вам с этим, если вы предпочтете выбрать этот путь. Пожалуйста, уведомите нас до того, как решите реализовать этот подход.

### Дополнительная информация

:::caution Уведомление о транзакции
Ожидается, что каждый сервис в Экосистеме установит `forward_ton_amount` равный 0,000000001 TON (1 нанотон), когда будет производиться вывод жетонов, чтобы отправить Jetton Notify при [успешном переводе](https://testnet.tonviewer.com/transaction/a0eede398d554318326b6e13081c2441f8b9a814bf9704e2e2f44f24adb3d407), иначе перевод не будет соответствовать стандарту и не сможет быть обработан другими CEX и сервисами.
:::

- Пожалуйста, найдите пример JS lib - [tonweb](https://github.com/toncenter/tonweb) - это официальная JS библиотека от TON Foundation.

- Если Вы хотите использовать Java, Вы можете заглянуть в [ton4j](https://github.com/neodix42/ton4j/tree/main).

- Для Go следует рассмотреть [tonutils-go](https://github.com/xssnick/tonutils-go). На данный момент мы рекомендуем JS lib.

## Оглавление

:::tip
В следующих документах представлены подробные сведения об архитектуре жетонов в целом, а также основные концепции TON, которые могут отличаться от EVM-подобных и других блокчейнов. Это крайне важно, чтобы получить хорошее понимание TON, и оно значительно поможет вам.
:::

В этом документе описано следующее по порядку:

1. Общие сведения
2. Архитектура
3. Контракт Jetton Master (Выпуск токенов)
4. Контракт Jetton Wallet (кошелек пользователя)
5. Макеты сообщений
6. Обработка жетонов (off-chain)
7. Обработка жетонов (on-chain)
8. Обработка кошелька
9. Лучшие практики

## Общие сведения

:::info
Транзакции TON необратимы после одного подтверждения.
Для ясного понимания читатель должен быть знаком с основными принципами обработки активов, описанными в [этом разделе нашей документации](/v3/documentation/dapps/assets/overview). В частности, важно знать [контракты](/v3/documentation/smart-contracts/addresses#everything-is-a-smart-contract), [кошельки](/v3/guidelines/smart-contracts/howto/wallet), [сообщения](/v3/documentation/smart-contracts/message-management/messages-and-transactions) и процесс развертывания.
:::

:::info
Для лучшего пользовательского опыта рекомендуется избегать ожидания дополнительных блоков после того, как транзакции будут завершены в блокчейне TON. Подробнее можно прочитать в [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3).
:::

Быстрый переход к основному описанию обработки Jetton:

<Button href="/v3/guidelines/dapps/asset-processing/jettons#accepting-jettons-from-users-through-a-centralized-wallet" colorType={'primary'} sizeType={'sm'}>
Централизованная обработка 
</Button>

<Button href="/v3/guidelines/dapps/asset-processing/jettons#accepting-jettons-from-user-deposit-addresses"
colorType="secondary" sizeType={'sm'}>
On-Chain обработка 
</Button>

<br></br><br></br>

Блокчейн TON и лежащая в его основе экосистема классифицируют взаимозаменяемые токены (FT) как жетоны. Поскольку в блокчейне применяется шардинг, наша реализация взаимозаменяемых токенов уникальна по сравнению с аналогичными моделями блокчейнов.

В этом анализе мы более подробно рассмотрим формальные стандарты, описывающи [поведение](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md) и [метаданные](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md) жетонов.
Менее формальный обзор архитектуры жетонов, ориентированный на шардинг, можно найти в нашем блоге ["anatomy of jettons"](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons).

Мы также предоставили конкретные подробности, обсуждая наш процессор платежей TON с открытым исходным кодом ([bicycle](https://github.com/gobicycle/bicycle)), который позволяет пользователям вносить и выводить как Toncoin, так и жетоны, используя отдельный адрес депозита без использования текстового поля memo.

## Архитектура Jetton

Стандартизированные токены в TON реализованы с использованием набора смарт-контрактов, включая:

- Смарт-контракт [Jetton master](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter.fc)
- Смарт-контракт [Jetton wallet](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc)

<br></br>
<ThemedImage
alt=""
sources={{
light: '/img/docs/asset-processing/jetton_contracts.png?raw=true',
dark: '/img/docs/asset-processing/jetton_contracts_dark.png?raw=true',
}}
/> <br></br>

## Смарт-контракт Jetton master

Смарт-контракт jetton master хранит общую информацию о жетоне (включая общее предложение, ссылку на метаданные или сами метаданные).

:::warning Остерегайтесь мошенничества с жетонами

Jetton с `symbol` ==`TON` или те, которые содержат системные уведомления, такие как: ERROR, SYSTEM и другие. Обязательно проверьте, отображаются ли жетоны в вашем интерфейсе таким образом, чтобы их нельзя было смешивать с переводами TON, системными уведомлениями и т. д. Иногда даже `symbol`, `name` и `image` созданы таким образом, чтобы выглядеть почти одинаково с оригиналом с целью обмана пользователей.

Чтобы исключить возможность мошенничества для пользователей TON, пожалуйста, найдите **оригинальный адрес жетона** (Смарт-контракт Jetton master) для определенных типов жетонов или **перейдите на официальный канал или веб-сайт проекта в социальных сетях** для получения **правильной информации**. Проверяйте активы, чтобы исключить возможность мошенничества с помощью списка [Tonkeeper ton-assets](https://github.com/tonkeeper/ton-assets).
:::

### Получение данных о жетоне

Для извлечения более конкретных данных жетона используйте *get* метод контракта `get_jetton_data()`.

Этот метод возвращает следующие данные:

| Имя                  | Тип     | Описание                                                                                                                                                                                                                                                                                                        |
| -------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `total_supply`       | `int`   | общее количество выпущенных жетонов, измеренное в неделимых единицах.                                                                                                                                                                                                                           |
| `mintable`           | `int`   | информация о возможности чеканки новых жетонов. Это значение равно -1 (можно чеканить) или 0 (нельзя чеканить).                                                                                                                           |
| `admin_address`      | `slice` |                                                                                                                                                                                                                                                                                                                 |
| `jetton_content`     | `cell`  | данные в соответствии с [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md), см. [страницу анализа метаданных жетона](/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing) для получения дополнительной информации. |
| `jetton_wallet_code` | `cell`  |                                                                                                                                                                                                                                                                                                                 |

Также можно использовать метод `/jetton/masters` из [Toncenter API](https://toncenter.com/api/v3/#/default/get_jetton_masters_api_v3_jetton_masters_get) для получения уже декодированных данных и метаданных жетона. Мы также разработали методы для (js) [tonweb](https://github.com/toncenter/tonweb/blob/master/src/contract/token/ft/JettonMinter.js#L85) и (js) [ton-core/ton](https://github.com/ton-core/ton/blob/master/src/jetton/JettonMaster.ts#L28), (go) [tongo](https://github.com/tonkeeper/tongo/blob/master/liteapi/jetton.go#L48) и (go) [tonutils-go](https://github.com/xssnick/tonutils-go/blob/33fd62d754d3a01329ed5c904db542ab4a11017b/ton/jetton/jetton.go#L79), (python) [pytonlib](https://github.com/toncenter/pytonlib/blob/d96276ec8a46546638cb939dea23612876a62881/pytonlib/client.py#L742) и многих других [SDK](/v3/guidelines/dapps/apis-sdks/sdk).

Пример использования [Tonweb](https://github.com/toncenter/tonweb) для запуска метода get и получения url для метаданных off-chain:

```js
import TonWeb from "tonweb";
const tonweb = new TonWeb();
const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: "<JETTON_MASTER_ADDRESS>"});
const data = await jettonMinter.getJettonData();
console.log('Total supply:', data.totalSupply.toString());
console.log('URI to off-chain metadata:', data.jettonContentUri);
```

### Jetton minter

Как упоминалось ранее, жетоны могут быть либо выпускаемыми `mintable`, либо не выпускаемыми `non-mintable`.

Если они не выпускаемые, логика становится простой — нет способа чеканить дополнительные токены. Чтобы чеканить жетоны в первый раз, обратитесь к странице [выпуск своего первого жетона](/v3/guidelines/dapps/tutorials/mint-your-first-token).

Если жетоны выпускаемые, в [minter contract](https://github.com/ton-blockchain/minter-contract/blob/main/contracts/jetton-minter.fc) есть специальная функция для чеканки дополнительных жетонов. Эту функцию можно вызвать, отправив внутреннее сообщение со специальным opcode с адреса администратора.

Если администратор жетона хочет ограничить их выпуск, есть три способа сделать это:

1. Если вы не можете или не хотите обновлять код контракта, администратор должен передать право собственности с текущего администратора на нулевой адрес. Это оставит контракт без действующего администратора, таким образом, не давая никому возможности чеканить жетоны. Однако это также предотвратит любые изменения метаданных жетона.
2. Если у вас есть доступ к исходному коду и вы можете его изменить, вы можете создать метод в контракте, который устанавливает флаг для прерывания любого процесса чеканки после его вызова, и добавит инструкцию для проверки этого флага в функции выпуска.
3. Если вы можете обновлять код контракта, вы можете добавить ограничения, обновив код уже развернутого контракта.

## Смарт-контракт Jetton wallet

Контракты `Jetton wallet` используются для **отправки**, **получения** и **сжигания** жетонов. Каждый *контракт jetton wallet* хранит информацию о балансе кошелька для определенных пользователей.
В некоторых случаях jetton wallet используются отдельно для каждого владельца жетона для каждого его типа.

`Jetton wallets` **не следует путать с кошельками**, предназначенными для взаимодействия с блокчейном и хранящих только актива Toncoin (например, кошельки v3R2, highload кошельки и т.д.), которые отвечают за поддержку и управление только определенным типом жетонов.

### Развертывание Jetton Wallet

При `передаче жетонов` между кошельками транзакции (сообщения) требуют определенного количества TON в качестве оплаты сетевых комиссий за **газ** и выполнения действий согласно коду контракта Jetton wallet.
Это означает, что получателю не нужно развертывать Jetton wallet перед получением жетонов. Jetton wallet получателя будет развернут автоматически, если отправитель имеет достаточно TON в кошельке для оплаты необходимых комиссий за газ.

### Получение адреса Jetton wallet для конкретного пользователя

Для получения `jetton wallet` `address` с помощью `owner address`(адрес кошелька TON), `Jetton master contract` предоставляет get метод `get_wallet_address(slice owner_address)`.

<Tabs groupId="retrieve-wallet-address">
<TabItem value="api" label="API">

> Запустите `get_wallet_address(slice owner_address)` через метод `/runGetMethod` из [Toncenter API](https://toncenter.com/api/v3/#/default/run_get_method_api_v3_runGetMethod_post). В реальных случаях (не в тестовых) важно всегда проверять, что кошелек действительно принадлежит нужному Jetton Master. Подроднее смотрите пример кода.

</TabItem>
<TabItem value="js" label="js">

```js
import TonWeb from 'tonweb';
const tonweb = new TonWeb();
const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, { address: '<JETTON_MASTER_ADDRESS>' });
const jettonWalletAddress = await jettonMinter.getJettonWalletAddress(new TonWeb.utils.Address('<OWNER_WALLET_ADDRESS>'));

// It is important to always check that wallet indeed is attributed to desired Jetton Master:
const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {
  address: jettonWalletAddress
});
const jettonData = await jettonWallet.getData();
if (jettonData.jettonMinterAddress.toString(false) !== jettonMinter.address.toString(false)) {
  throw new Error('jetton minter address from jetton wallet doesnt match config');
}

console.log('Jetton wallet address:', jettonWalletAddress.toString(true, true, true));
```

</TabItem>
</Tabs>

:::tip
Дополнительные примеры можно найти в [TON Cookbook](/v3/guidelines/dapps/cookbook#tep-74-jettons-standard).
:::

### Получение данных для определенного Jetton wallet

Чтобы получить баланс кошелька, данные об владельце и другую информацию, связанную с конкретным контрактом jetton wallet, используйте get метод `get_wallet_data()` в контракте jetton wallet.

Этот метод возвращает следующие данные:

| Имя                  | Тип   |
| -------------------- | ----- |
| `balance`            | int   |
| `owner`              | slice |
| `jetton`             | slice |
| `jetton_wallet_code` | cell  |

<Tabs groupId="retrieve-jetton-wallet-data">
<TabItem value="api" label="API">

> Используйте get метод `/jetton/wallets` из [API Toncenter](https://toncenter.com/api/v3/#/default/get_jetton_wallets_api_v3_jetton_wallets_get) для получения ранее декодированных данных jetton wallet.

</TabItem>

<TabItem value="js" label="js">

```js
import TonWeb from "tonweb";
const tonweb = new TonWeb();
const walletAddress = "EQBYc3DSi36qur7-DLDYd-AmRRb4-zk6VkzX0etv5Pa-Bq4Y";
const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider,{address: walletAddress});
const data = await jettonWallet.getData();
console.log('Jetton balance:', data.balance.toString());
console.log('Jetton owner address:', data.ownerAddress.toString(true, true, true));
// It is important to always check that Jetton Master indeed recognize wallet
const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: data.jettonMinterAddress.toString(false)});
const expectedJettonWalletAddress = await jettonMinter.getJettonWalletAddress(data.ownerAddress.toString(false));
if (expectedJettonWalletAddress.toString(false) !== new TonWeb.utils.Address(walletAddress).toString(false)) {
  throw new Error('jetton minter does not recognize the wallet');
}

console.log('Jetton master address:', data.jettonMinterAddress.toString(true, true, true));
```

</TabItem>
</Tabs>

## Макеты сообщений

:::tip Сообщения
Подробнее о сообщениях читайте [здесь](/v3/documentation/smart-contracts/message-management/messages-and-transactions).
:::

Обмен между Jetton wallet и кошельками TON происходит через следующую последовательность сообщений:

<br></br>
<ThemedImage
alt=""
sources={{
light: '/img/docs/asset-processing/jetton_transfer.png?raw=true',
dark: '/img/docs/asset-processing/jetton_transfer_dark.png?raw=true',
}}
/> <br></br>

#### Сообщение 0

`Sender -> sender's jetton wallet`. Сообщение о *передаче* содержит следующие данные:

| Имя                    | Тип        | Описание                                                                                                                                                                                                                                                        |
| ---------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `query_id`             | uint64     | Позволяет приложениям связывать три типа сообщений `Transfer`, `Transfer notification` и `Excesses` друг с другом. Для корректного выполнения этого процесса рекомендуется **всегда использовать уникальный query id запроса**. |
| `amount`               | coins      | Общая сумма `ton coin`, которая будет отправлена ​​с сообщением.                                                                                                                                                                                |
| `destination`          | address    | Адрес нового владельца жетона                                                                                                                                                                                                                                   |
| `response_destination` | address    | Адрес кошелька, используемый для возврата оставшихся ton coin с сообщением об излишках.                                                                                                                                                         |
| `custom_payload`       | maybe cell | Размер всегда >= 1 бит. Пользовательские данные (которые используются как отправителем, так и получателем jetton wallet для внутренней логики).                                                              |
| `forward_ton_amount`   | coins      | Должно быть > 0, если вы хотите отправить ` transfer notification` с `forward payload`. Это **часть значения `amount` и должно быть меньше чем `amount`**                                                                                       |
| `forward_payload`      | maybe cell | Размер всегда >= 1 бит. Если первые 32 бита = 0x0, это простое сообщение.                                                                                                                                                       |

#### Сообщение 2'

`payee's jetton wallet -> payee`. Сообщение с уведомлением о переводе. **Отправляется только если** `forward_ton_amount` **не равен нулю**. Содержит следующие данные:

| Имя               | Тип     |
| ----------------- | ------- |
| `query_id`        | uint64  |
| `amount`          | coins   |
| `sender`          | address |
| `forward_payload` | cell    |

Здесь адрес `sender` - это адрес `Jetton wallet` Алисы.

#### Сообщение 2''

`payee's jetton wallet -> Sender`. Тело сообщения. **Отправляется только в том случае, если после уплаты комиссий остались какие-либо монеты ton**. Содержит следующие данные:

| Имя        | Тип    |
| ---------- | ------ |
| `query_id` | uint64 |

:::tip Стандарт жетонов
Подробное описание полей контракта jetton wallet можно найти в интерфейсе описании `стандарта жетона` [TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md).
:::

## Как отправлять переводы жетонов с комментариями и уведомлениями

Для отправки транзакции требуется определенное количество ton coins для оплаты **комиссии** и **сообщения об уведомлении**.

Чтобы отправить **комментарий**, вам нужно настроить `forward payload`. Установите **первые 32 бита на 0x0** и добавьте **свой текст**, `forward payload` отправляется во внутреннем сообщении `jetton notify 0x7362d09c`. Оно будет сгенерировано только в том случае, если `forward_ton_amount` > 0.
:::info
Рекомендуемое `forward_ton_amount` для перевода жетонов с комментарием составляет 1 nanoton.
:::

В конце концов, чтобы получить `Excess 0xd53276db` сообщение, необходимо настроить `response destination`.

Иногда при отправке жетонов может возникнуть ошибка `709`. Эта ошибка указывает на то, что количество Toncoin, прикрепленное к сообщению, недостаточно для его отправки. Убедитесь, что `Toncoin > to_nano(TRANSFER_CONSUMPTION) + forward_ton_amount`, что обычно >0,04, если только forward payload не очень большая. Комиссия зависит от различных факторов, включая детали Jetton code и необходимость развертывания нового Jetton wallet для получателя.
Рекомендуется добавить к сообщению запас Toncoin и указать свой адрес в качестве `response_destination` для извлечения сообщения `Excess 0xd53276db`. Например, вы можете добавить 0,05 TON к сообщению, установив `forward_ton_amount` в размере 1 nanoton (это количество TON будет прикреплено к сообщению `jetton notify` 0x7362d09c).

Вы также можете столкнуться с ошибкой [`cskip_no_gas`](/v3/documentation/tvm/tvm-overview#compute-phase-skipped), которая указывает на то, что жетоны были успешно переведены, но никаких других вычислений не было выполнено. Это распространенная ситуация, когда значение `forward_ton_amount` равно 1 nanoton.

:::tip
Проверьте [лучшие практики](/v3/guidelines/dapps/asset-processing/jettons#best-practices) на примере *"отправки жетонов с комментариями"*.
:::

## Обработка жетонов off-chain

:::info Подтверждение транзакции
Транзакции TON необратимы после одного подтверждения. Для лучшего пользовательского опыта рекомендуется избегать ожидания дополнительных блоков после завершения транзакций в блокчейне TON. Подробнее читайте в [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3).
:::

Есть два способа получить жетоны:

- в **централизованном горячем кошельке**.
- используя кошелек с **отдельным адресом** для **каждого отдельного пользователя**.

В целях безопасности предпочтительнее иметь **отдельные горячие кошельки** для **отдельных жетонов** (несколько кошельков для каждого типа актива).

При обработке средств также рекомендуется иметь холодный кошелек для хранения избыточных средств, которые не участвуют в процессах автоматического депозита и вывода.

### Добавление новых жетонов для обработки активов и первичной проверки

1. Найдите правильный адрес [смарт-контракта](/v3/guidelines/dapps/asset-processing/jettons#jetton-master-smart-contract).
2. Получите [метаданные](/v3/guidelines/dapps/asset-processing/jettons#retrieving-jetton-data).
3. Проверьте на [мошенничество](/v3/guidelines/dapps/asset-processing/jettons#jetton-master-smart-contract).

### Идентификация неизвестного жетона при получении уведомления о переводе

Если в вашем кошельке получено уведомление о переводе неизвестного жетона, то ваш кошелек был создан для хранения определенного жетона.

Адрес отправителя внутреннего сообщения, содержащего тело `Transfer notification`, является адресом Jetton wallet. Его не следует путать с полем `sender` в [теле](/v3/guidelines/dapps/asset-processing/jettons#message-2) `Transfer notification`.

1. Получите адрес Jetton master для нового Jetton wallet, [получив данные кошелька](/v3/guidelines/dapps/asset-processing/jettons#retrieving-data-for-a-specific-jetton-wallet).
2. Получите адрес Jetton wallet для вашего адреса кошелька (как владельца), используя контракт Jetton master: [Как получить адрес Jetton wallet для данного пользователя](#retrieving-jetton-wallet-addresses-for-a-given-user)
3. Сравните адрес, возвращенный master контрактом, и фактический адрес токена кошелька.
  Если они совпадают, это идеальный вариант. Если нет, то вы, вероятно, получили мошеннический токен, который является поддельным.
4. Получите метаданные жетона: [Как получить метаданные жетона](#retrieving-jetton-data).
5. Проверьте поля `symbol` и `name` на наличие признаков мошенничества. При необходимости предупредите пользователя. [Добавление нового жетона для обработки и первичных проверок.](#adding-new-jettons-for-asset-processing-and-initial-verification).

### Прием жетонов от пользователей через централизованный кошелек

:::info
Чтобы предотвратить затор во входящих транзакциях на один кошелек, предлагается принимать депозиты через несколько кошельков и расширять количество этих кошельков по мере необходимости.
:::

:::caution Уведомление о транзакции
Ожидается, что каждый сервис в экосистеме установит `forward_ton_amount` на 0,000000001 TON (1 nanoton) при выводе жетона, чтобы отправить Jetton Notify при [успешном переводе](https://testnet.tonviewer.com/transaction/a0eede398d554318326b6e13081c2441f8b9a814bf9704e2e2f44f24adb3d407), в противном случае перевод не будет соответствовать стандарту и не сможет быть обработан другими CEX и сервисами.
:::

В этом сценарии платежный сервис создает уникальный идентификатор memo для каждого отправителя, раскрывая адрес централизованного кошелька и отправляемые суммы. Отправитель отправляет токены на указанный централизованный адрес с обязательным memo в комментарии.

**Преимущества этого метода:** Этот метод очень прост, поскольку при получении токенов не взимается никаких дополнительных комиссий, и они поступают непосредственно в горячий кошелек.

**Недостатки этого метода:** этот метод требует, чтобы все пользователи добавляли комментарий к переводу, что может привести к большему количеству ошибок при депозите (забытые memo, неправильные memo и т. д.), что означает большую нагрузку на службу поддержки.

Примеры с использованием Tonweb:

1. [Прием депозитов жетонов на отдельный горячий кошелек с комментариями (memo)](https://github.com/toncenter/examples/blob/main/deposits-jettons.js)
2. [Пример выводы жетонов](https://github.com/toncenter/examples/blob/main/withdrawals-jettons.js)

#### Подготовка

1. [Составьте список принимаемых жетонов](/v3/guidelines/dapps/asset-processing/jettons#adding-new-jettons-for-asset-processing-and-initial-verification) (адреса Jetton master).
2. Разверните горячий кошелек (используя v3R2, если не ожидается вывод жетонов; highload v3 - если ожидается вывод). [Разверните кошелек](/v3/guidelines/dapps/asset-processing/payments-processing#wallet-deployment).
3. Выполните тестовый перевод жетонов, используя адрес горячего кошелька для его инициализации.

#### Обработка входящих жетонов

1. Загрузите список принимаемых жетонов.
2. [Извлеките адрес Jetton wallet](#retrieving-jetton-wallet-addresses-for-a-given-user) для развернутого горячего кошелька.
3. Извлеките адрес Jetton master для каждого Jetton wallet, используя [полученные данные кошелька](/v3/guidelines/dapps/asset-processing/jettons#retrieving-data-for-a-specific-jetton-wallet).
4. Сравните адреса контракта Jetton master из шага 1 и шага 3 (непосредственно выше). Если адреса не совпадают, необходимо сообщить об ошибке проверки адреса жетона.
5. Извлеките список последних необработанных транзакций, с помощью учетной записи горячего кошелька и пройдитесь по нему (проверив каждую транзакцию отдельно). См:  [Проверка транзакций контракта](/v3/guidelines/dapps/asset-processing/payments-processing#check-contracts-transactions).
6. Проверьте входящее сообщение (in_msg) на предмет транзакций и извлеките исходный адрес из входящего сообщения. [Пример Tonweb](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L84)
7. Если исходный адрес совпадает с адресом Jetton wallet, то необходимо продолжить обработку транзакции. Если нет, то пропустите обработку и проверьте следующую транзакцию.
8. Убедитесь, что тело сообщения не пусто и первые 32 бита сообщения совпадают с op code `transfer notification` `0x7362d09c`.
  [Пример с использованием Tonweb](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L91).
  Если тело сообщения пустое или op code недействителен - пропустите транзакцию.
9. Прочитайте другие данные тела сообщения, включая `query_id`, `amount`, `sender`, `forward_payload`.
  [Макеты сообщений контрактов жетона](/v3/guidelines/dapps/asset-processing/jettons#message-layouts), [Пример с использованием Tonweb](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L105)
10. Попытайтесь извлечь текстовые комментарии из данных `forward_payload`. Первые 32 бита должны совпадать с op code `0x000000`, а остальные - с текстом в UTF-8 кодировке.
  [Пример с использованием Tonweb](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L110)
11. Если данные `forward_payload` пусты или op code недействителен - пропустите транзакцию.
12. Сравните полученный комментарий с сохраненными memo. Если есть совпадение (идентификация пользователя всегда возможна) - отправьте депозит.
13. Начните заново с шага 5 и повторяйте процесс, пока не пройдете весь список транзакций.

### Прием жетонов с адресов депозитов пользователей

Чтобы принимать жетоны с адресов депозитов пользователей, необходимо, чтобы платежный сервис создавал свой собственный индивидуальный адрес (депозит) для каждого участника, отправляющего средства. В этом случае требуется выполнение нескольких параллельных процессов, включая создание новых депозитов, сканирование блоков на наличие транзакций, вывод средств с депозитов на горячий кошелек и т. д.

Поскольку горячий кошелек может использовать один Jetton wallet для каждого типа жетона, необходимо создать несколько кошельков для инициирования депозитов. Чтобы создать большое количество кошельков, но при этом управлять ими с помощью одной seed-фразы (или закрытого ключа), необходимо указать другой `subwallet_id` при их создании. В TON поддерживается функциональность для создания субкошельков версий v3 и выше.

#### Создание субкошелька в Tonweb

```js
const WalletClass = tonweb.wallet.all['v3R2'];
const wallet = new WalletClass(tonweb.provider, {
    publicKey: keyPair.publicKey,
    wc: 0,
    walletId: <SUBWALLET_ID>,
});
```

#### Подготовка

1. [Подготовьте список принимаемых жетонов](#adding-new-jettons-for-asset-processing-and-initial-verification).
2. Разверните горячий кошелек (используя v3R2, если не ожидается вывод жетонов; highload v3 - если ожидается вывод жетонов). [Разверните кошелек](/v3/guidelines/dapps/asset-processing/payments-processing#wallet-deployment).

#### Создание депозитов

1. Примите запрос на создание нового депозита для пользователя.
2. Сгенерируйте новый адрес субкошелька (/v3R2) на основе seed-фразы горячего кошелька. [Создание субкошелька в Tonweb](#creating-a-subwallet-in-tonweb)
3. Принимающий адрес может быть предоставлен пользователю как адрес, используемый для депозитов жетонов (это адрес владельца депозитного Jetton wallet). Инициализация кошелька не требуется, это можно сделать при выводе жетонов из депозита.
4. Для этого адреса необходимо рассчитать адрес кошелька Jetton через контракт Jetton master.
  [Как получить адрес Jetton wallet для определенного пользователя](#retrieving-jetton-wallet-addresses-for-a-given-user).
5. Добавьте адрес Jetton wallet в пул адресов для отслеживания транзакций и сохраните адрес субкошелька.

#### Обработка транзакций

:::info Подтверждение транзакции
Транзакции TON необратимы после одного подтверждения. Для лучшего пользовательского опыта рекомендуется избегать ожидания дополнительных блоков после завершения транзакций в блокчейне TON. Подробнее читайте в [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3).
:::

Не всегда возможно определить точное количество жетонов, полученных из сообщения, поскольку Jetton wallet не может отправлять сообщения `transfer notification`, `excesses` и `internal transfer`. Они не стандартизированы. Это означает, что нет гарантии, что `internal transfer` можно будет декодировать.

Поэтому для определения суммы, полученной в кошельке, необходимо запросить балансы с помощью get метода. Для получения ключевых данных при запросе балансов, блоки используются в соответствии с состоянием учетной записи для конкретного on-chain блока. [Подготовка к принятию блока с помощью Tonweb](https://github.com/toncenter/tonweb/blob/master/src/test-block-subscribe.js).

Этот процесс выполняется следующим образом:

1. Подготовьте прием блока (путем подготовки системы к принятию новых блоков).
2. Получите новый блок и сохраните ID предыдущего блока.
3. Получите транзакции из блоков.
4. Отфильтруйте транзакции, используемые только с адресами из пула депозитного Jetton wallet.
5. Декодируйте сообщения, используя тело `transfer notification`для получения более подробных данных, включая адрес `sender`, `amount` жетонов и комментарий. (См.: [Обработка входящих жетонов](#processing-incoming-jettons))
6. Если есть хотя бы одна транзакция с недекодируемыми исходящими сообщениями (тело сообщения не содержит op code для `transfer notification` и op code для `excesses`) или без исходящих сообщений в учетной записи, то баланс жетонов должен быть запрошен с использованием get метода для текущего блока, в то время как предыдущий блок используется для расчета разницы в балансах. Теперь полный баланс депозита изменяется из-за транзакций, проведенных в рамках блока.
7. В качестве идентификатора для неопознанного перевода жетонов (без уведомления о переводе) могут использоваться данные транзакции, если присутствует одна такая транзакция или данные блока (если в блоке их присутствует несколько).
8. Теперь необходимо проверить баланс депозита, чтобы убедиться, что он правильный. Если баланс депозита достаточен для инициирования перевода между горячим кошельком и существующем Jetton wallet, жетоны нужно вывести, чтобы гарантировать, что баланс кошелька уменьшился.
9. Перезапустите с шага 2 и повторите весь процесс.

#### Вывод средств с депозитов

Переводы с депозита на горячий кошелек не следует делать с каждым пополнением депозита, поскольку за операцию перевода взимается комиссия в TON (оплачивается в виде сетевых сборов за газ). Важно определить ограниченную минимальную сумму жетонов, которое требуется для того, чтобы перевод (и, следовательно, депозит) был выгодным.

По умолчанию владельцы депозитных Jetton wallet не инициализируются. Это связано с тем, что нет  предварительно установленного требования к оплате комиссии за хранение. Депозитные Jetton wallet могут быть развернуты при `transfer` сообщений с телом перевода, которое затем может быть немедленно уничтожено. Для этого инженер должен использовать специальный механизм отправки сообщений: [128 + 32](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes).

1. Получите список депозитов, отмеченных для вывода на горячий кошелек
2. Получите сохраненные адреса владельцев для каждого депозита
3. Затем отправьте сообщения на каждый адрес владельца (путем объединения нескольких таких сообщений в пакет) из highload кошелька с прикрепленной суммой TON Jetton. Это определяется путем сложения комиссий, используемых для инициализации кошелька v3R2 + комиссий за отправку сообщения с телом  `transfer` + произвольной суммы TON, связанной с `forward_ton_amount` (если необходимо). Присоединенная сумма TON определяется путем сложения комиссий за инициализацию кошелька v3R2 (значение) + комиссий за отправку сообщения с телом `transfer` (значение) + произвольной суммы TON для `forward_ton_amount` (значение) (если необходимо).
4. Когда баланс на адресе станет ненулевым, статус аккаунта изменится. Подождите несколько секунд и проверьте статус аккаунта, он вскоре изменится с состояния `nonexists` на `uninit`.
5. Для каждого адреса владельца (со статусом `uninit`) необходимо отправить внешнее сообщение с v3R2 кошелька  init и body с сообщением `transfer` для зачисления в Jetton wallet = 128 + 32. Для `transfer` пользователь должен указать адрес горячего кошелька в качестве `destination` и `response destination`. Можно добавить текстовый комментарий, чтобы упростить идентификацию перевода.
6. Проверьте доставку жетонов, используя адрес депозита на адрес горячего кошелька, учитывая [обработку входящей информации о жетонах, которая представлена здесь](#processing-incoming-jettons).

### Вывод жетонов

:::info Важно

Ниже вы найдете пошаговое руководство по обработке вывода жетонов
:::

Для вывода жетонов кошелек отправляет сообщения с телом `transfer` на соответствующий Jetton wallet. Затем Jetton wallet отправляет жетоны получателю. Важно прикрепить некоторое количество TON (минимум 1 nanoTON) в качестве `forward_ton_amount` (и необязательный комментарий к `forward_payload`), чтобы вызвать `transfer notification`. См.: [Макеты сообщений контрактов жетонов](/v3/guidelines/dapps/asset-processing/jettons#message-layouts)

#### Подготовка

1. Подготовьте список жетонов для вывода: [Добавление новых жетонов для обработки и первичной проверки](#adding-new-jettons-for-asset-processing-and-initial-verification)
2. Инициируйте развертывание горячего кошелька. Рекомендуется использовать Highload v3. [Развертывание кошелька](/v3/guidelines/dapps/asset-processing/payments-processing#wallet-deployment)
3. Выполните перевод жетонов с использованием адреса горячего кошелька, чтобы инициализировать Jetton wallet и пополнить его баланс.

#### Обработка вывода средств

1. Загрузите список обработанных жетонов
2. Получите адреса Jetton wallet для развернутого горячего кошелька: [Как извлечь адреса Jetton wallet для заданного пользователя](#retrieving-jetton-wallet-addresses-for-a-given-user)
3. Получите адреса Jetton master для каждого Jetton wallet: [Как получить данные для Jetton wallet](#retrieving-data-for-a-specific-jetton-wallet).
  Требуется параметр `jetton` (который на самом деле является адресом контракта Jetton master).
4. Сравните адреса из контракта Jetton master из шага 1 и шага 3. Если адреса не совпадают, следует сообщить об ошибке проверки адреса жетона.
5. Получите запрос на вывод, в которых фактически указывается тип жетона, переводимая сумма и адрес кошелька получателя.
6. Проверьте баланс Jetton wallet, чтобы убедиться, что есть достаточно средств для выполнения вывода.
7. Создайте [сообщение](/v3/guidelines/dapps/asset-processing/jettons#message-0).
8. При использовании highload кошелька рекомендуется собирать пакет сообщений и отправлять по одному пакету за раз для оптимизации комиссий.
9. Сохраните время истечения срока для исходящих внешних сообщений (это время, пока кошелек успешно не обработает сообщение, после этого кошелек больше не будет принимать сообщение)
10. Отправьте одно сообщение или несколько сообщений (пакет сообщений).
11. Получите список последних необработанных транзакций в учетной записи горячего кошелька и выполните его итерацию. Узнайте больше здесь: [Проверка транзакций контракта](/v3/guidelines/dapps/asset-processing/payments-processing#check-contracts-transactions), [Пример Tonweb](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-single-wallet.js#L43) или используйте метод Toncenter API `/getTransactions`.
12. Просмотрите исходящие сообщения в аккаунте.
13. Если существует сообщение с op code `transfer`, то его следует декодировать для получения значения `query_id`. Полученные `query_id` необходимо пометить как успешно отправленные.
14. Если время, необходимое для обработки текущей сканированной транзакции, превышает время истечения срока действия, а исходящее сообщение с заданным `query_id` не найдено, то запрос следует (это необязательно) пометить как просроченный и безопасно отправить повторно.
15. Просмотрите входящие сообщения в аккаунте.
16. Если существует сообщение, которое использует op code `Excess 0xd53276db`, сообщение должно быть декодировано, а значение `query_id` должно быть извлечено. Найденный `query_id` должен быть помечен как успешно доставленный.
17. Перейдите к шагу 5. Просроченные запросы, которые не были успешно отправлены, должны быть возвращены в список вывода.

## Обработка жетонов on-chain

Обычно для приема и обработки жетонов обработчик сообщений, отвечающий за внутренние сообщения, использует op code `op=0x7362d09c`.

:::info Подтверждение транзакции
Транзакции TON необратимы после всего лишь одного подтверждения. Для лучшего пользовательского опыта рекомендуется избегать ожидания дополнительных блоков после завершения транзакций в блокчейне TON. Подробнее в [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3).
:::

### Рекомендации по обработке on-chain

Ниже приведен `список рекомендаций`, которые **необходимо учитывать при обработке жетонов on-chain**:

1. **Идентифицируйте входящие жетоны** по типу их кошелька, а не по их контракту Jetton master. Другими словами, ваш контракт должен взаимодействовать (получать и отправлять сообщения) с конкретным jetton wallet (не с каким-то незнакомым кошельком, использующим определенный Jetton master).
2. При связывании Jetton Wallet и контракта Jetton Master **проверьте**, что это **соединение является двунаправленным**, когда кошелек распознает master контракт и наоборот. Например, если ваша система контрактов получает уведомление от jetton wallet (который считает свой MySuperJetton своим master контрактом), его информация о переводе должна быть отображена пользователю, прежде чем показывать `symbol`, `name` и `image` контракта MySuperJetton, проверьте, что кошелек MySuperJetton использует правильную систему контрактов. В свою очередь, если вашей системе контрактов по какой-то причине необходимо отправлять жетоны с использованием MySuperJetton или контракта MySuperJetton master, проверьте, что кошелек X, как и кошелек, использует те же параметры контракта. Кроме того, перед отправкой запроса `transfer` в X убедитесь, что он распознает MySuperJetton как master.
3. Истинная сила децентрализованных финансов (DeFi) основана на возможности накладывать протоколы друг на друга, как блоки Lego. Например, скажем, жетон A обменивается на жетон B, который, в свою очередь, затем используется в качестве кредитного плеча в протоколе кредитования (когда пользователь предоставляет ликвидность), который используется для покупки NFT ... и так далее. Поэтому подумайте, как контракт может обслуживать не только пользователей off-chain, но и субъектов on-chain, прикрепляя токенизированное значение к уведомлению о переводе, добавляя custom payload, которую можно отправить с уведомлением о переводе.
4. **Помните**, что не все контракты следуют одним и тем же стандартам. К сожалению, некоторые жетоны могут быть враждебными (использующими векторы атак) и созданы исключительно для атак на ничего не подозревающих пользователей. В целях безопасности, если рассматриваемый протокол состоит из множества контрактов, не создавайте большое количество jetton wallet одного типа. В частности, не отправляйте жетоны внутри протокола между контрактом депозита, контрактом хранилища или контрактом аккаунта пользователя и т. д. Злоумышленники могут намеренно вмешиваться в логику контракта, подделывая уведомления о переводе, суммы жетонов или параметры payload. Уменьшите потенциальный потенциал атаки, используя только один кошелек в системе на жетон (для всех депозитов и снятий).
5. Также часто *бывает хорошей идеей* создать субконтракты для каждого индивидуального жетона, чтобы снизить вероятность подмены адреса (например, когда сообщение о переводе отправляется на жетон B с использованием контракта, предназначенного для жетона A).
6. **Настоятельно рекомендуется** работать с неделимыми единицами жетонов на уровне контракта. Логика с плавающей запятой обычно используется для улучшения пользовательского интерфейса (UI), и это не связано с численным учетом on-chain.

Чтобы узнать больше о [безопасном программировании смарт-контрактов в FunC от CertiK](https://blog.ton.org/secure-smart-contract-programming-in-func), не стесняйтесь читать этот ресурс. Разработчикам рекомендуется **обрабатывать все исключения смарт-контрактов**, чтобы они никогда не пропускались во время разработки приложений.

## Рекомендации по обработке Jetton wallet

Как правило, все процедуры проверки, используемые для обработки жетонов off-chain, подходят и для кошельков. Для обработки Jetton wallet наши самые важные рекомендации следующие:

1. Когда кошелек получает уведомление о переводе от неизвестного jetton wallet, **жизненно важно** доверять jetton wallet и его master адресу, поскольку это может быть вредоносная подделка. Чтобы защитить себя, проверьте Jetton Master (главный контракт), используя предоставленный им адрес, чтобы убедиться, что ваши процессы проверки распознают jetton wallet как легитимный. После того, как вы доверяете кошельку и он будет проверен как легитимный, вы можете разрешить ему доступ к остаткам на вашем аккаунте и другим данным в кошельке. Если Jetton Master не распознает этот кошелек, рекомендуется вообще не инициировать и не раскрывать ваши переводы жетонов и показывать только входящие переводы TON (Toncoin, прикрепленные к уведомлениям о переводах).
2. На практике, если пользователь хочет взаимодействовать с жетоном, а не с jetton wallet. Другими словами, пользователи отправляют wTON/oUSDT/jUSDT, jUSDC, jDAI вместо EQAjN.../EQBLE... и т. д. Часто это означает, что когда пользователь инициирует перевод жетонов, кошелек спрашивает у соответствующего jetton master, какой jetton wallet (принадлежащий пользователю) должен инициировать запрос на перевод. Важно **никогда не доверять слепо этим данным** от Master (главного контракта) контракта. Перед отправкой запроса на перевод в jetton wallet всегда проверяйте, действительно ли jetton wallet принадлежит Jetton Master, которому он, как он утверждает, принадлежит.
3. **Помните**, что недружественные Jetton Masters/jetton wallets **могут со временем менять** свои wallets/Masters. Поэтому крайне важно, чтобы пользователи проявляли должную осмотрительность и проверяли легитимность любых кошельков, с которыми они взаимодействуют, перед каждым использованием.
4. **Всегда проверяйте**, что вы отображаете жетоны в своем интерфейсе таким образом, чтобы **они не смешивались с переводами TON**, системными уведомлениями и т. д. Даже параметры `symbol`,`name` и `image` могут быть созданы, чтобы вводить пользователей в заблуждение, делая пострадавших потенциальными жертвами мошенничества. Было несколько случаев, когда вредоносные жетоны использовались для имитации переводов TON, ошибок уведомлений, вознаграждений или объявлений о заморозке активов.
5. **Всегда будьте начеку в отношении потенциальных злоумышленников**, которые создают поддельные жетоны, хорошей идеей будет предоставить пользователям функциональные возможности, необходимые для исключения нежелательных жетонов в их основном пользовательском интерфейсе.

Авторы: [kosrk](https://github.com/kosrk), [krigga](https://github.com/krigga), [EmelyanenkoK](https://github.com/EmelyanenkoK/) и [tolya-yanot](https://github.com/tolya-yanot/).

## Лучшие практики

Если вы хотите готовые тестовые примеры, проверьте [SDKs](/v3/guidelines/dapps/asset-processing/jettons#sdks) и попробуйте их запустить. Ниже приведены фрагменты кода, которые помогут вам понять обработку жетонов с помощью примеров кода.

### Отправить жетоны с комментарием

<Tabs groupId="code-examples">
<TabItem value="tonweb" label="JS (tonweb)">

<details>
<summary>
Исходный код
</summary>

```js
// first 4 bytes are tag of text comment
const comment = new Uint8Array([... new Uint8Array(4), ... new TextEncoder().encode('text comment')]);

await wallet.methods.transfer({
  secretKey: keyPair.secretKey,
  toAddress: JETTON_WALLET_ADDRESS, // address of Jetton wallet of Jetton sender
  amount: TonWeb.utils.toNano('0.05'), // total amount of TONs attached to the transfer message
  seqno: seqno,
  payload: await jettonWallet.createTransferBody({
    jettonAmount: TonWeb.utils.toNano('500'), // Jetton amount (in basic indivisible units)
    toAddress: new TonWeb.utils.Address(WALLET2_ADDRESS), // recepient user's wallet address (not Jetton wallet)
    forwardAmount: TonWeb.utils.toNano('0.01'), // some amount of TONs to invoke Transfer notification message
    forwardPayload: comment, // text comment for Transfer notification message
    responseAddress: walletAddress // return the TONs after deducting commissions back to the sender's wallet address
  }),
  sendMode: 3,
}).send()
```

</details>

</TabItem>
<TabItem value="tonutils-go" label="Golang">

<details>
<summary>
Исходный код
</summary>

```go
client := liteclient.NewConnectionPool()

// connect to testnet lite server
err := client.AddConnectionsFromConfigUrl(context.Background(), "https://ton.org/global.config.json")
if err != nil {
   panic(err)
}

ctx := client.StickyContext(context.Background())

// initialize ton api lite connection wrapper
api := ton.NewAPIClient(client)

// seed words of account, you can generate them with any wallet or using wallet.NewSeed() method
words := strings.Split("birth pattern then forest walnut then phrase walnut fan pumpkin pattern then cluster blossom verify then forest velvet pond fiction pattern collect then then", " ")

w, err := wallet.FromSeed(api, words, wallet.V3R2)
if err != nil {
   log.Fatalln("FromSeed err:", err.Error())
   return
}

token := jetton.NewJettonMasterClient(api, address.MustParseAddr("EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw"))

// find our jetton wallet
tokenWallet, err := token.GetJettonWallet(ctx, w.WalletAddress())
if err != nil {
   log.Fatal(err)
}

amountTokens := tlb.MustFromDecimal("0.1", 9)

comment, err := wallet.CreateCommentCell("Hello from tonutils-go!")
if err != nil {
   log.Fatal(err)
}

// address of receiver's wallet (not token wallet, just usual)
to := address.MustParseAddr("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N")
transferPayload, err := tokenWallet.BuildTransferPayload(to, amountTokens, tlb.ZeroCoins, comment)
if err != nil {
   log.Fatal(err)
}

// your TON balance must be > 0.05 to send
msg := wallet.SimpleMessage(tokenWallet.Address(), tlb.MustFromTON("0.05"), transferPayload)

log.Println("sending transaction...")
tx, _, err := w.SendWaitTransaction(ctx, msg)
if err != nil {
   panic(err)
}
log.Println("transaction confirmed, hash:", base64.StdEncoding.EncodeToString(tx.Hash))
```

</details>

</TabItem>
<TabItem value="TonTools" label="Python">

<details>
<summary>
Исходный код
</summary>

```py
my_wallet = Wallet(provider=client, mnemonics=my_wallet_mnemonics, version='v4r2')

# for TonCenterClient and LsClient
await my_wallet.transfer_jetton(destination_address='address', jetton_master_address=jetton.address, jettons_amount=1000, fee=0.15) 

# for all clients
await my_wallet.transfer_jetton_by_jetton_wallet(destination_address='address', jetton_wallet='your jetton wallet address', jettons_amount=1000, fee=0.1)  
```

</details>

</TabItem>

<TabItem value="pytoniq" label="Python">

<details>
<summary>
Исходный код
</summary>

```py
from pytoniq import LiteBalancer, WalletV4R2, begin_cell
import asyncio

mnemonics = ["your", "mnemonics", "here"]

async def main():
    provider = LiteBalancer.from_mainnet_config(1)
    await provider.start_up()

    wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=mnemonics)
    USER_ADDRESS = wallet.address
    JETTON_MASTER_ADDRESS = "EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE"
    DESTINATION_ADDRESS = "EQAsl59qOy9C2XL5452lGbHU9bI3l4lhRaopeNZ82NRK8nlA"

    USER_JETTON_WALLET = (await provider.run_get_method(address=JETTON_MASTER_ADDRESS,
                                                        method="get_wallet_address",
                                                        stack=[begin_cell().store_address(USER_ADDRESS).end_cell().begin_parse()]))[0].load_address()
    forward_payload = (begin_cell()
                      .store_uint(0, 32) # TextComment op-code
                      .store_snake_string("Comment")
                      .end_cell())
    transfer_cell = (begin_cell()
                    .store_uint(0xf8a7ea5, 32)          # Jetton Transfer op-code
                    .store_uint(0, 64)                  # query_id
                    .store_coins(1 * 10**9)             # Jetton amount to transfer in nanojetton
                    .store_address(DESTINATION_ADDRESS) # Destination address
                    .store_address(USER_ADDRESS)        # Response address
                    .store_bit(0)                       # Custom payload is None
                    .store_coins(1)                     # Ton forward amount in nanoton
                    .store_bit(1)                       # Store forward_payload as a reference
                    .store_ref(forward_payload)         # Forward payload
                    .end_cell())

    await wallet.transfer(destination=USER_JETTON_WALLET, amount=int(0.05*1e9), body=transfer_cell)
    await provider.close_all()

asyncio.run(main())
```

</details>

</TabItem>
</Tabs>

### Принять Jetton Transfer с разбором комментариев

<Tabs groupId="parse-code-examples">
<TabItem value="tonweb" label="JS (tonweb)">

<details>
<summary>
Исходный код
</summary>

```ts
import {
    Address,
    TonClient,
    Cell,
    beginCell,
    storeMessage,
    JettonMaster,
    OpenedContract,
    JettonWallet,
    Transaction
} from '@ton/ton';


export async function retry<T>(fn: () => Promise<T>, options: { retries: number, delay: number }): Promise<T> {
    let lastError: Error | undefined;
    for (let i = 0; i < options.retries; i++) {
        try {
            return await fn();
        } catch (e) {
            if (e instanceof Error) {
                lastError = e;
            }
            await new Promise(resolve => setTimeout(resolve, options.delay));
        }
    }
    throw lastError;
}

export async function tryProcessJetton(orderId: string) : Promise<string> {

    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: 'TONCENTER-API-KEY', // https://t.me/tonapibot
    });

    interface JettonInfo {
        address: string;
        decimals: number;
    }

    interface Jettons {
        jettonMinter : OpenedContract<JettonMaster>,
        jettonWalletAddress: Address,
        jettonWallet: OpenedContract<JettonWallet>
    }

    const MY_WALLET_ADDRESS = 'INSERT-YOUR-HOT-WALLET-ADDRESS'; // your HOT wallet

    const JETTONS_INFO : Record<string, JettonInfo> = {
        'jUSDC': {
            address: 'EQB-MPwrd1G6WKNkLz_VnV6WqBDd142KMQv-g1O-8QUA3728', //
            decimals: 6
        },
        'jUSDT': {
            address: 'EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA',
            decimals: 6
        },
    }
    const jettons: Record<string, Jettons> = {};

    const prepare = async () => {
        for (const name in JETTONS_INFO) {
            const info = JETTONS_INFO[name];
            const jettonMaster = client.open(JettonMaster.create(Address.parse(info.address)));
            const userAddress = Address.parse(MY_WALLET_ADDRESS);

            const jettonUserAddress =  await jettonMaster.getWalletAddress(userAddress);
          
            console.log('My jetton wallet for ' + name + ' is ' + jettonUserAddress.toString());

            const jettonWallet = client.open(JettonWallet.create(jettonUserAddress));

            //const jettonData = await jettonWallet;
            const jettonData = await client.runMethod(jettonUserAddress, "get_wallet_data")

            jettonData.stack.pop(); //skip balance
            jettonData.stack.pop(); //skip owneer address
            const adminAddress = jettonData.stack.readAddress();


            if (adminAddress.toString() !== (Address.parse(info.address)).toString()) {
                throw new Error('jetton minter address from jetton wallet doesnt match config');
            }

            jettons[name] = {
                jettonMinter: jettonMaster,
                jettonWalletAddress: jettonUserAddress,
                jettonWallet: jettonWallet
            };
        }
    }

    const jettonWalletAddressToJettonName = (jettonWalletAddress : Address) => {
        const jettonWalletAddressString = jettonWalletAddress.toString();
        for (const name in jettons) {
            const jetton = jettons[name];

            if (jetton.jettonWallet.address.toString() === jettonWalletAddressString) {
                return name;
            }
        }
        return null;
    }

    // Subscribe
    const Subscription = async ():Promise<Transaction[]> =>{

      const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: 'TONCENTER-API-KEY', // https://t.me/tonapibot
      });

        const myAddress = Address.parse('INSERT-YOUR-HOT-WALLET'); // Address of receiver TON wallet
        const transactions = await client.getTransactions(myAddress, {
            limit: 5,
        });
        return transactions;
    }

    return retry(async () => {

        await prepare();
        const Transactions = await Subscription();

        for (const tx of Transactions) {

            const sourceAddress = tx.inMessage?.info.src;
            if (!sourceAddress) {
                // external message - not related to jettons
                continue;
            }

            if (!(sourceAddress instanceof Address)) {
                continue;
            }

            const in_msg = tx.inMessage;

            if (in_msg?.info.type !== 'internal') {
                // external message - not related to jettons
                continue;
            }

            // jetton master contract address check
            const jettonName = jettonWalletAddressToJettonName(sourceAddress);
            if (!jettonName) {
                // unknown or fake jetton transfer
                continue;
            }

            if (tx.inMessage === undefined || tx.inMessage?.body.hash().equals(new Cell().hash())) {
                // no in_msg or in_msg body
                continue;
            }

            const msgBody = tx.inMessage;
            const sender = tx.inMessage?.info.src;
            const originalBody = tx.inMessage?.body.beginParse();
            let body = originalBody?.clone();
            const op = body?.loadUint(32);
            if (!(op == 0x7362d09c)) {
                continue; // op != transfer_notification
            }

            console.log('op code check passed', tx.hash().toString('hex'));

            const queryId = body?.loadUint(64);
            const amount = body?.loadCoins();
            const from = body?.loadAddress();
            const maybeRef = body?.loadBit();
            const payload = maybeRef ? body?.loadRef().beginParse() : body;
            const payloadOp = payload?.loadUint(32);
            if (!(payloadOp == 0)) {
                console.log('no text comment in transfer_notification');
                continue;
            }

            const comment = payload?.loadStringTail();
            if (!(comment == orderId)) {
                continue;
            }
            
            console.log('Got ' + jettonName + ' jetton deposit ' + amount?.toString() + ' units with text comment "' + comment + '"');
            const txHash = tx.hash().toString('hex');
            return (txHash);
        }
        throw new Error('Transaction not found');
    }, {retries: 30, delay: 1000});
}
```

</details>

</TabItem>
<TabItem value="tonutils-go" label="Golang">

<details>
<summary>
Исходный код
</summary>

```go
import (
	"context"
	"fmt"
	"log"

	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/tlb"
	"github.com/xssnick/tonutils-go/ton"
	"github.com/xssnick/tonutils-go/ton/jetton"
	"github.com/xssnick/tonutils-go/tvm/cell"
)

const (
	MainnetConfig   = "https://ton.org/global.config.json"
	TestnetConfig   = "https://ton.org/global.config.json"
	MyWalletAddress = "INSERT-YOUR-HOT-WALLET-ADDRESS"
)

type JettonInfo struct {
	address  string
	decimals int
}

type Jettons struct {
	jettonMinter        *jetton.Client
	jettonWalletAddress string
	jettonWallet        *jetton.WalletClient
}

func prepare(api ton.APIClientWrapped, jettonsInfo map[string]JettonInfo) (map[string]Jettons, error) {
	userAddress := address.MustParseAddr(MyWalletAddress)
	block, err := api.CurrentMasterchainInfo(context.Background())
	if err != nil {
		return nil, err
	}

	jettons := make(map[string]Jettons)

	for name, info := range jettonsInfo {
		jettonMaster := jetton.NewJettonMasterClient(api, address.MustParseAddr(info.address))
		jettonWallet, err := jettonMaster.GetJettonWallet(context.Background(), userAddress)
		if err != nil {
			return nil, err
		}

		jettonUserAddress := jettonWallet.Address()

		jettonData, err := api.RunGetMethod(context.Background(), block, jettonUserAddress, "get_wallet_data")
		if err != nil {
			return nil, err
		}

		slice := jettonData.MustCell(0).BeginParse()
		slice.MustLoadCoins() // skip balance
		slice.MustLoadAddr()  // skip owneer address
		adminAddress := slice.MustLoadAddr()

		if adminAddress.String() != info.address {
			return nil, fmt.Errorf("jetton minter address from jetton wallet doesnt match config")
		}

		jettons[name] = Jettons{
			jettonMinter:        jettonMaster,
			jettonWalletAddress: jettonUserAddress.String(),
			jettonWallet:        jettonWallet,
		}
	}

	return jettons, nil
}

func jettonWalletAddressToJettonName(jettons map[string]Jettons, jettonWalletAddress string) string {
	for name, info := range jettons {
		if info.jettonWallet.Address().String() == jettonWalletAddress {
			return name
		}
	}
	return ""
}

func GetTransferTransactions(orderId string, foundTransfer chan<- *tlb.Transaction) {
	jettonsInfo := map[string]JettonInfo{
		"jUSDC": {address: "EQB-MPwrd1G6WKNkLz_VnV6WqBDd142KMQv-g1O-8QUA3728", decimals: 6},
		"jUSDT": {address: "EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA", decimals: 6},
	}

	client := liteclient.NewConnectionPool()

	cfg, err := liteclient.GetConfigFromUrl(context.Background(), MainnetConfig)
	if err != nil {
		log.Fatalln("get config err: ", err.Error())
	}

	// connect to lite servers
	err = client.AddConnectionsFromConfig(context.Background(), cfg)
	if err != nil {
		log.Fatalln("connection err: ", err.Error())
	}

	// initialize ton api lite connection wrapper
	api := ton.NewAPIClient(client, ton.ProofCheckPolicySecure).WithRetry()
	master, err := api.CurrentMasterchainInfo(context.Background())
	if err != nil {
		log.Fatalln("get masterchain info err: ", err.Error())
	}

	// address on which we are accepting payments
	treasuryAddress := address.MustParseAddr("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N")

	acc, err := api.GetAccount(context.Background(), master, treasuryAddress)
	if err != nil {
		log.Fatalln("get masterchain info err: ", err.Error())
	}

	jettons, err := prepare(api, jettonsInfo)
	if err != nil {
		log.Fatalln("can't prepare jettons data: ", err.Error())
	}

	lastProcessedLT := acc.LastTxLT

	transactions := make(chan *tlb.Transaction)

	go api.SubscribeOnTransactions(context.Background(), treasuryAddress, lastProcessedLT, transactions)

	log.Println("waiting for transfers...")

	// listen for new transactions from channel
	for tx := range transactions {
		if tx.IO.In == nil || tx.IO.In.MsgType != tlb.MsgTypeInternal {
			// external message - not related to jettons
			continue
		}

		msg := tx.IO.In.Msg
		sourceAddress := msg.SenderAddr()

		// jetton master contract address check
		jettonName := jettonWalletAddressToJettonName(jettons, sourceAddress.String())
		if len(jettonName) == 0 {
			// unknown or fake jetton transfer
			continue
		}

		if msg.Payload() == nil || msg.Payload() == cell.BeginCell().EndCell() {
			// no in_msg body
			continue
		}

		msgBodySlice := msg.Payload().BeginParse()

		op := msgBodySlice.MustLoadUInt(32)
		if op != 0x7362d09c {
			continue // op != transfer_notification
		}

		// just skip bits
		msgBodySlice.MustLoadUInt(64)
		amount := msgBodySlice.MustLoadCoins()
		msgBodySlice.MustLoadAddr()

		payload := msgBodySlice.MustLoadMaybeRef()
		payloadOp := payload.MustLoadUInt(32)
		if payloadOp == 0 {
			log.Println("no text comment in transfer_notification")
			continue
		}

		comment := payload.MustLoadStringSnake()
		if comment != orderId {
			continue
		}

		// process transaction
		log.Printf("Got %s jetton deposit %d units with text comment %s\n", jettonName, amount, comment)
		foundTransfer <- tx
	}
}
```

</details>
</TabItem>

<TabItem value="pythoniq" label="Python">

<details>
<summary>
Исходный код
</summary>

```py
import asyncio

from pytoniq import LiteBalancer, begin_cell

MY_WALLET_ADDRESS = "EQAsl59qOy9C2XL5452lGbHU9bI3l4lhRaopeNZ82NRK8nlA"


async def parse_transactions(provider: LiteBalancer, transactions):
    for transaction in transactions:
        if not transaction.in_msg.is_internal:
            continue
        if transaction.in_msg.info.dest.to_str(1, 1, 1) != MY_WALLET_ADDRESS:
            continue

        sender = transaction.in_msg.info.src.to_str(1, 1, 1)
        value = transaction.in_msg.info.value_coins
        if value != 0:
            value = value / 1e9

        if len(transaction.in_msg.body.bits) < 32:
            print(f"TON transfer from {sender} with value {value} TON")
            continue

        body_slice = transaction.in_msg.body.begin_parse()
        op_code = body_slice.load_uint(32)
        if op_code != 0x7362D09C:
            continue

        body_slice.load_bits(64)  # skip query_id
        jetton_amount = body_slice.load_coins() / 1e9
        jetton_sender = body_slice.load_address().to_str(1, 1, 1)
        if body_slice.load_bit():
            forward_payload = body_slice.load_ref().begin_parse()
        else:
            forward_payload = body_slice

        jetton_master = (
            await provider.run_get_method(
                address=sender, method="get_wallet_data", stack=[]
            )
        )[2].load_address()
        jetton_wallet = (
            (
                await provider.run_get_method(
                    address=jetton_master,
                    method="get_wallet_address",
                    stack=[
                        begin_cell()
                        .store_address(MY_WALLET_ADDRESS)
                        .end_cell()
                        .begin_parse()
                    ],
                )
            )[0]
            .load_address()
            .to_str(1, 1, 1)
        )

        if jetton_wallet != sender:
            print("FAKE Jetton Transfer")
            continue

        if len(forward_payload.bits) < 32:
            print(
                f"Jetton transfer from {jetton_sender} with value {jetton_amount} Jetton"
            )
        else:
            forward_payload_op_code = forward_payload.load_uint(32)
            if forward_payload_op_code == 0:
                print(
                    f"Jetton transfer from {jetton_sender} with value {jetton_amount} Jetton and comment: {forward_payload.load_snake_string()}"
                )
            else:
                print(
                    f"Jetton transfer from {jetton_sender} with value {jetton_amount} Jetton and unknown payload: {forward_payload} "
                )

        print(f"Transaction hash: {transaction.cell.hash.hex()}")
        print(f"Transaction lt: {transaction.lt}")


async def main():
    provider = LiteBalancer.from_mainnet_config(1)
    await provider.start_up()
    transactions = await provider.get_transactions(address=MY_WALLET_ADDRESS, count=5)
    await parse_transactions(provider, transactions)
    await provider.close_all()


if __name__ == "__main__":
    asyncio.run(main())
```

</details>
</TabItem>
</Tabs>

## SDK

Список SDK для различных языков (js, python, golang, C#, Rust и т. д.) можно найти [здесь](/v3/guidelines/dapps/apis-sdks/sdk).

## См. также

- [Обработка платежей](/v3/guidelines/dapps/asset-processing/payments-processing)
- [Обработка TON NFT](/v3/guidelines/dapps/asset-processing/nft-processing/nfts)
- [Разбор метаданных на TON](/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing)
