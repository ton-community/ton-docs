# Отправка сообщений

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

TON Connect 2.0 предоставляет гораздо больше возможностей, чем просто аутентификация пользователей в DApp: вы можете отправлять исходящие сообщения через подключенные кошельки!

Вы узнаете:

- как отправлять сообщения из DApp в блокчейн
- как отправить несколько сообщений в одной транзакции
- как развернуть контракт с помощью TON Connect

## Страница для экспериментов

Мы будем использовать низкоуровневый [TON Connect SDK](https://github.com/ton-connect/sdk/tree/main/packages/sdk) на JavaScript. Мы поэкспериментируем в консоли браузера на странице, где кошелек уже подключен. Вот пример страницы:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <script src="https://unpkg.com/@tonconnect/sdk@latest/dist/tonconnect-sdk.min.js"></script>
    <script src="https://unpkg.com/tonweb@0.0.41/dist/tonweb.js"></script>
  </head>
  <body>
    <script>
      window.onload = async () => {
        window.connector = new TonConnectSDK.TonConnect({
          manifestUrl: 'https://ratingers.pythonanywhere.com/ratelance/tonconnect-manifest.json'
        });
        connector.restoreConnection();
      }
    </script>
  </body>
</html>
```

Не стесняйтесь скопировать и вставить этот код в консоль вашего браузера и выполнить его.

## Отправка нескольких сообщений

### 1. Понимание задачи

Мы отправим два отдельных сообщения в одной транзакции: одно на ваш собственный адрес с 0,2 TON и одно на другой адрес кошелька с 0,1 TON.

Обратите внимание, что есть ограничение по количеству сообщений, которые можно отправить в одной транзакции:

- стандартные ([v3](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts#wallet-v3)/[v4](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts#wallet-v4)) кошельки: 4 исходящих сообщения;
- highload кошельки: 255 исходящих сообщений (близко к ограничениям блокчейна).

### 2. Отправка сообщений

Запустите следующий код:

```js
console.log(await connector.sendTransaction({
  validUntil: Math.floor(new Date() / 1000) + 360,
  messages: [
    {
      address: connector.wallet.account.address,
      amount: "200000000"
    },
    {
      address: "0:b2a1ecf5545e076cd36ae516ea7ebdf32aea008caa2b84af9866becb208895ad",
      amount: "100000000"
    }
  ]
}));
```

Вы заметите, что эта команда ничего не выводит в консоль, `null` или `undefined`, так как функции, которые ничего не возвращают, не выходят. Это означает, что `connector.sendTransaction` не завершается немедленно.

Откройте приложение кошелька, и посмотрите, почему. Там будет запрос, показывающий, что вы отправляете и куда будут отправлены монеты. Пожалуйста, одобрите его.

### 3. Получение результата

Функция завершит работу, и будет выведен результат из блокчейна:

```json
{
  boc: "te6cckEBAwEA4QAC44gBZUPZ6qi8Dtmm1cot1P175lXUARlUVwlfMM19lkERK1oCUB3RqDxAFnPpeo191X/jiimn9Bwnq3zwcU/MMjHRNN5sC5tyymBV3SJ1rjyyscAjrDDFAIV/iE+WBySEPP9wCU1NGLsfcvVgAAACSAAYHAECAGhCAFlQ9nqqLwO2abVyi3U/XvmVdQBGVRXCV8wzX2WQRErWoAmJaAAAAAAAAAAAAAAAAAAAAGZCAFlQ9nqqLwO2abVyi3U/XvmVdQBGVRXCV8wzX2WQRErWnMS0AAAAAAAAAAAAAAAAAAADkk4U"
}
```

BOC - это [Bag of Cells](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage), способ хранения данных в TON. Теперь мы можем его расшифровать.

Расшифруйте этот BOC в инструменте по вашему выбору, и вы получите следующее дерево ячеек:

```bash
x{88016543D9EAA8BC0ED9A6D5CA2DD4FD7BE655D401195457095F30CD7D9641112B5A02501DD1A83C401673E97A8D7DD57FE38A29A7F41C27AB7CF0714FCC3231D134DE6C0B9B72CA6055DD2275AE3CB2B1C023AC30C500857F884F960724843CFF70094D4D18BB1F72F5600000024800181C_}
 x{42005950F67AAA2F03B669B5728B753F5EF9957500465515C257CC335F6590444AD6A00989680000000000000000000000000000}
 x{42005950F67AAA2F03B669B5728B753F5EF9957500465515C257CC335F6590444AD69CC4B40000000000000000000000000000}
```

Это сериализованное внешнее сообщение, а две ссылки — это представления исходящих сообщений.

```bash
x{88016543D9EAA8BC0ED9A6D5CA2DD4FD7BE655D401195457095F30CD7D964111...
  $10       ext_in_msg_info
  $00       src:MsgAddressExt (null address)
  "EQ..."a  dest:MsgAddressInt (your wallet)
  0         import_fee:Grams
  $0        (no state_init)
  $0        (body starts in this cell)
  ...
```

Цель возврата BOC отправленной транзакции — отследить ее.

## Отправка сложных транзакций

### Сериализация ячеек

Прежде чем продолжить, давайте поговорим о формате сообщений, которые мы собираемся отправлять.

- **payload** (строка base64, необязательно): необработанный BoC из одной ячейки, закодированный в Base64.
 - мы будем использовать его для хранения текстового комментария при передаче
- **stateInit** (строка base64, необязательно): необработанный BoC из одной ячейки, закодированный в Base64.
 - мы будем использовать его для развертывания смарт-контракта

После создания сообщения вы можете сериализовать его в BOC.

```js
TonWeb.utils.bytesToBase64(await payloadCell.toBoc())
```

### Перевод с комментарием

Вы можете использовать [toncenter/tonweb](https://github.com/toncenter/tonweb) JS SDK или ваш любимый инструмент для сериализации ячеек в BOC.

Текстовый комментарий к передаче кодируется как опкод 0 (32 нулевых бита) + UTF-8 байт комментария. Вот пример того, как преобразовать его в пакет ячеек.

```js
let a = new TonWeb.boc.Cell();
a.bits.writeUint(0, 32);
a.bits.writeString("TON Connect 2 tutorial!");
let payload = TonWeb.utils.bytesToBase64(await a.toBoc());

console.log(payload);
// te6ccsEBAQEAHQAAADYAAAAAVE9OIENvbm5lY3QgMiB0dXRvcmlhbCFdy+mw
```

### Развертывание смарт-контракта

Теперь мы развернем экземпляр простого [чатбота Doge](https://github.com/LaDoger/doge.fc), упомянутого как один из [примеров смарт-контрактов](/v3/documentation/smart-contracts/overview#examples-of-smart-contracts). Прежде всего, мы загружаем его код и сохраняем что-то уникальное в данных, чтобы получить наш собственный экземпляр, который не был развернут кем-то другим. Затем мы объединяем код и данные в stateInit.

```js
let code = TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes('te6cckEBAgEARAABFP8A9KQT9LzyyAsBAGrTMAGCCGlJILmRMODQ0wMx+kAwi0ZG9nZYcCCAGMjLBVAEzxaARfoCE8tqEssfAc8WyXP7AN4uuM8='));
let data = new TonWeb.boc.Cell();
data.bits.writeUint(Math.floor(new Date()), 64);

let state_init = new TonWeb.boc.Cell();
state_init.bits.writeUint(6, 5);
state_init.refs.push(code);
state_init.refs.push(data);

let state_init_boc = TonWeb.utils.bytesToBase64(await state_init.toBoc());
console.log(state_init_boc);
//  te6ccsEBBAEAUwAABRJJAgE0AQMBFP8A9KQT9LzyyAsCAGrTMAGCCGlJILmRMODQ0wMx+kAwi0ZG9nZYcCCAGMjLBVAEzxaARfoCE8tqEssfAc8WyXP7AAAQAAABhltsPJ+MirEd

let doge_address = '0:' + TonWeb.utils.bytesToHex(await state_init.hash());
console.log(doge_address);
//  0:1c7c35ed634e8fa796e02bbbe8a2605df0e2ab59d7ccb24ca42b1d5205c735ca
```

И теперь пора отправить нашу транзакцию!

```js
console.log(await connector.sendTransaction({
  validUntil: Math.floor(new Date() / 1000) + 360,
  messages: [
    {
      address: "0:1c7c35ed634e8fa796e02bbbe8a2605df0e2ab59d7ccb24ca42b1d5205c735ca",
      amount: "69000000",
      payload: "te6ccsEBAQEAHQAAADYAAAAAVE9OIENvbm5lY3QgMiB0dXRvcmlhbCFdy+mw",
      stateInit: "te6ccsEBBAEAUwAABRJJAgE0AQMBFP8A9KQT9LzyyAsCAGrTMAGCCGlJILmRMODQ0wMx+kAwi0ZG9nZYcCCAGMjLBVAEzxaARfoCE8tqEssfAc8WyXP7AAAQAAABhltsPJ+MirEd"
    }
  ]
}));
```

:::info
Получите больше примеров на странице [Подготовка сообщений](/v3/guidelines/ton-connect/guidelines/preparing-messages) для отпраки NFT и жетонов.
:::

После подтверждения мы можем увидеть нашу транзакцию завершенной на сайте [tonscan.org](https://tonscan.org/tx/pCA8LzWlCRTBc33E2y-MYC7rhUiXkhODIobrZVVGORg=).

## Что произойдет, если пользователь отклонит запрос транзакции?

Обработать отклонение запроса довольно просто, но когда вы разрабатываете какой-то проект, лучше знать заранее, что произойдет.

Когда пользователь нажимает «Cancel» во всплывающем окне в приложении кошелька, выдается исключение: `Error: [TON_CONNECT_SDK_ERROR] Wallet declined the request`. Эту ошибку можно считать окончательной (в отличие от отмены соединения) — если она была вызвана, то запрошенная транзакция точно не произойдет до следующего запроса.

## См. также

- [Подготовка сообщений](/v3/guidelines/ton-connect/guidelines/preparing-messages)
