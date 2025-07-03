# Руководство по интеграции с JavaScript SDK

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

В этом руководстве мы создадим пример веб-приложения, поддерживающего аутентификацию TON Connect 2.0. Это позволит выполнить проверку подписи, чтобы исключить возможность мошеннической выдачи себя за другое лицо без необходимости заключения соглашения между сторонами.

## Ссылки на документацию

1. [Документация @tonconnect/sdk](https://www.npmjs.com/package/@tonconnect/sdk)
2. [Протокол обмена сообщениями между кошельком и приложением](https://github.com/ton-connect/docs/blob/main/requests-responses.md)
3. [Реализация Tonkeeper на стороне кошелька](https://github.com/tonkeeper/wallet/tree/main/packages/mobile/src/tonconnect)

## Необходимые компоненты

Для обеспечения бесперебойной связи между приложениями и кошельками веб-приложение должно использовать манифест, доступный через приложения кошелька. Основным требованием к этому является обычный хост для статических файлов. Например, если разработчик хочет использовать GitHub pages или развернуть свой веб-сайт с помощью TON Sites, размещенных на его компьютере. Это означает, что веб-приложение должно быть общедоступно.

## Получение списка поддерживаемых кошельков

Чтобы увеличить общее использование блокчейна TON, необходимо, чтобы TON Connect 2.0 мог облегчать огромное количество интеграций приложений и кошельков. В последнее время и это имеет важное значение, продолжающаяся разработка TON Connect 2.0 позволила подключить Tonkeeper, TonHub, MyTonWallet и другие кошельки к различным приложениям экосистемы TON. Наша миссия — в конечном итоге разрешить обмен данными между приложениями и всеми типами кошельков, созданными на основе TON, через протокол TON Connect. В настоящее время это достигается путем включения TON Connect для загрузки обширного списка доступных кошельков, которые сейчас функционируют в экосистеме TON.

На данный момент наш пример веб-приложения позволяет следующее:

1. загружает TON Connect SDK (библиотеку, предназначенную для упрощения интеграции),
2. создает коннектор (в настоящее время без манифеста приложения),
3. загружает список поддерживаемых кошельков (из [wallets.json на GitHub](https://raw.githubusercontent.com/ton-connect/wallets-list/main/wallets.json)).

Для изучения давайте рассмотрим HTML-страницу, описанную следующим кодом:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <script src="https://unpkg.com/@tonconnect/sdk@latest/dist/tonconnect-sdk.min.js" defer></script>  <!-- (1) -->
  </head>
  <body>
    <script>
      window.onload = async () => {
        const connector = new TonConnectSDK.TonConnect();  // (2)
        const walletsList = await connector.getWallets();  // (3)
        
        console.log(walletsList);
      }
    </script>
  </body>
</html>
```

Если вы загрузите эту страницу в браузере и проверите консоль, вы можете увидеть что-то вроде этого:

```bash
> Array [ {…}, {…} ]

0: Object { name: "Tonkeeper", imageUrl: "https://tonkeeper.com/assets/tonconnect-icon.png", aboutUrl: "https://tonkeeper.com", … }
  aboutUrl: "https://tonkeeper.com"
  bridgeUrl: "https://bridge.tonapi.io/bridge"
  deepLink: undefined
  embedded: false
  imageUrl: "https://tonkeeper.com/assets/tonconnect-icon.png"
  injected: false
  jsBridgeKey: "tonkeeper"
  name: "Tonkeeper"
  tondns: "tonkeeper.ton"
  universalLink: "https://app.tonkeeper.com/ton-connect"
```

Согласно спецификациям TON Connect 2.0, информация о приложении кошелька всегда использует следующий формат:

```js
{
    name: string;
    imageUrl: string;
    tondns?: string;
    aboutUrl: string;
    universalLink?: string;
    deepLink?: string;
    bridgeUrl?: string;
    jsBridgeKey?: string;
    injected?: boolean; // true if this wallet is injected to the webpage
    embedded?: boolean; // true if the DAppis opened inside this wallet's browser
}
```

## Отображение кнопок для различных приложений кошелька

Кнопки могут различаться в зависимости от дизайна вашего веб-приложения. Текущая страница выдает следующий результат:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <script src="https://unpkg.com/@tonconnect/sdk@latest/dist/tonconnect-sdk.min.js" defer></script>

    // highlight-start
    <style>
      body {
        width: 1000px;
        margin: 0 auto;
        font-family: Roboto, sans-serif;
      }
      .section {
        padding: 20px; margin: 20px;
        border: 2px #AEFF6A solid; border-radius: 8px;
      }
      #tonconnect-buttons>button {
        display: block;
        padding: 8px; margin-bottom: 8px;
        font-size: 18px; font-family: inherit;
      }
      .featured {
        font-weight: 800;
      }
    </style>
    // highlight-end
  </head>
  <body>
    // highlight-start
    <div class="section" id="tonconnect-buttons">
    </div>
    // highlight-end
    
    <script>
      const $ = document.querySelector.bind(document);
      
      window.onload = async () => {
        const connector = new TonConnectSDK.TonConnect();
        const walletsList = await connector.getWallets();

        // highlight-start
        let buttonsContainer = $('#tonconnect-buttons');
        
        for (let wallet of walletsList) {
          let connectButton = document.createElement('button');
          connectButton.innerText = 'Connect with ' + wallet.name;
          
          if (wallet.embedded) {
            // `embedded` means we are browsing the app from wallet application
            // we need to mark this sign-in option somehow
            connectButton.classList.add('featured');
          }
          
          if (!wallet.bridgeUrl && !wallet.injected && !wallet.embedded) {
            // no `bridgeUrl` means this wallet app is injecting JS code
            // no `injected` and no `embedded` -> app is inaccessible on this page
            connectButton.disabled = true;
          }
          
          buttonsContainer.appendChild(connectButton);
        }
	// highlight-end
      };
    </script>
  </body>
</html>
```

Обратите внимание на следующее:

1. Если веб-страница отображается через приложение кошелька, она устанавливает свойство параметра `embedded` в значение true. Это означает, что важно подчеркнуть этот вариант входа, поскольку он наиболее распространен.
2. Если конкретный кошелек создан с использованием только JavaScript (у него нет `bridgeUrl`) и он не установил свойство `injected` (или `embedded`, для безопасности), то он явно недоступен, и кнопку следует отключить.

## Соединение без манифеста приложения

В случае соединения без манифеста приложения, скрипт должен быть изменен следующим образом:

```js
      const $ = document.querySelector.bind(document);
      
      window.onload = async () => {
        const connector = new TonConnectSDK.TonConnect();
        const walletsList = await connector.getWallets();
        
        const unsubscribe = connector.onStatusChange(
          walletInfo => {
            console.log('Connection status:', walletInfo);
          }
        );
        
        let buttonsContainer = $('#tonconnect-buttons');

        for (let wallet of walletsList) {
          let connectButton = document.createElement('button');
          connectButton.innerText = 'Connect with ' + wallet.name;
          
          if (wallet.embedded) {
            // `embedded` means we are browsing the app from wallet application
            // we need to mark this sign-in option somehow
            connectButton.classList.add('featured');
          }
          
          // highlight-start
          if (wallet.embedded || wallet.injected) {
            connectButton.onclick = () => {
              connectButton.disabled = true;
              connector.connect({jsBridgeKey: wallet.jsBridgeKey});
            };
          } else if (wallet.bridgeUrl) {
            connectButton.onclick = () => {
              connectButton.disabled = true;
              console.log('Connection link:', connector.connect({
                universalLink: wallet.universalLink,
                bridgeUrl: wallet.bridgeUrl
              }));
            };
          } else {
            // wallet app does not provide any auth method
            connectButton.disabled = true;
          }
	  // highlight-end
          
          buttonsContainer.appendChild(connectButton);
        }
      };
```

Теперь, когда описанный выше процесс выполнен, регистрируются изменения статуса (чтобы увидеть, работает ли TON Connect). Отображение модальных окон с QR-кодами для подключения выходит за рамки данного руководства. Для тестирования можно использовать расширение браузера или отправить ссылку на запрос подключения пользователю любым доступным способом (например, с помощью Telegram).
Примечание: мы пока не создали манифест приложения. В данный момент самым подходящим решением является анализ конечного результата в случае невыполнения этого требования.

### Вход с помощью Tonkeeper

Чтобы войти в Tonkeeper, создается следующая ссылка для аутентификации (см. ниже для справки):

```
https://app.tonkeeper.com/ton-connect?v=2&id=3c12f5311be7e305094ffbf5c9b830e53a4579b40485137f29b0ca0c893c4f31&r=%7B%22manifestUrl%22%3A%22null%2Ftonconnect-manifest.json%22%2C%22items%22%3A%5B%7B%22name%22%3A%22ton_addr%22%7D%5D%7D
```

После декодирования параметра `r` формируется следующий формат JSON:

```js
{"manifestUrl":"null/tonconnect-manifest.json","items":[{"name":"ton_addr"}]}
```

При нажатии на мобильную телефонную ссылку, Tonkeeper автоматически открывается и затем закрывается, отклоняя запрос. Кроме того, в консоли веб-приложения появляется следующая ошибка:
`Error: [TON_CONNECT_SDK_ERROR] Can't get null/tonconnect-manifest.json`.

Это указывает на то, что манифест приложения должен быть доступен для загрузки.

## Соединение с использованием манифеста приложения

Начиная с этого момента, необходимо где-то размещать пользовательские файлы (в основном tonconnect-manifest.json). В этом случае мы будем использовать манифест из другого веб-приложения. Однако это не рекомендуется для производственных сред, но разрешено для тестирования.

Следующий фрагмент кода:

```js
      window.onload = async () => {
        const connector = new TonConnectSDK.TonConnect();
        
        const walletsList = await connector.getWallets();
        
        const unsubscribe = connector.onStatusChange(
          walletInfo => {
            console.log('Connection status:', walletInfo);
          }
        );
```

Должен быть заменен на эту версию:

```js
      window.onload = async () => {
        const connector = new TonConnectSDK.TonConnect({manifestUrl: 'https://ratingers.pythonanywhere.com/ratelance/tonconnect-manifest.json'});
        // highlight-next-line
        window.connector = connector;  // for experimenting in browser console
        
        const walletsList = await connector.getWallets();
        
        const unsubscribe = connector.onStatusChange(
          walletInfo => {
            console.log('Connection status:', walletInfo);
          }
        );
	// highlight-next-line
        connector.restoreConnection();
```

В новой версии выше в `window` была добавлена ​​переменная хранения `connector`, чтобы она была доступна в консоли браузера. Также был добавлен метод `restoreConnection`, чтобы пользователям не приходилось входить в систему на каждой странице веб-приложения.

### Вход с помощью Tonkeeper

Если мы отклоним наш запрос из кошелька, то в консоли появится результат `Error: [TON_CONNECT_SDK_ERROR] Wallet denied the request`.

Таким образом, пользователь может принять тот же запрос на вход, если ссылка сохранена. Это означает, что веб-приложение должно иметь возможность обрабатывать отказ в аутентификации как не окончательный, чтобы работать корректно.

После этого запрос на вход принимается и немедленно отражается в консоли браузера следующим образом:

```bash
22:40:13.887 Connection status:
Object { device: {…}, provider: "http", account: {…} }
  account: Object { address: "0:b2a1ec...", chain: "-239", walletStateInit: "te6cckECFgEAAwQAAgE0ARUBFP8A9..." }
  device: Object {platform: "android", appName: "Tonkeeper", appVersion: "2.8.0.261", …}
  provider: "http"
```

В приведенных выше результатах учитывается следующее:

1. **Account**: информация: содержит адрес (workchain+hash), сеть (mainnet/testnet) и wallet stateInit, который используется для извлечения открытого ключа.
2. **Device**: информация: содержит имя и версию приложения кошелька (имя должно совпадать с запрошенным изначально, но его можно проверить, чтобы убедиться в подлинности), а также имя платформы и список поддерживаемых функций.
3. **Provider**: содержит http -- что позволяет обрабатывать все запросы и ответы между кошельком и веб-приложениями через мост.

## Выход и запрос TonProof

Теперь мы вошли в наше мини-приложение, но... как backend узнает, что это правильная сторона? Чтобы проверить это, мы должны запросить доказательство владения кошельком.

Это можно сделать только с помощью аутентификации, поэтому мы должны выйти из системы. Поэтому мы запускаем следующий код в консоли:

```js
connector.disconnect();
```

После завершения процесса отключения будет отображаться `Connection status: null`.

Перед добавлением TonProof давайте изменим код, чтобы показать, что текущая реализация небезопасна:

```js
let connHandler = connector.statusChangeSubscriptions[0];
connHandler({
  device: {
    appName: "Uber Singlesig Cold Wallet App",
    appVersion: "4.0.1",
    features: [],
    maxProtocolVersion: 3,
    platform: "ios"
  },
  account: {
    /* TON Foundation address */
    address: '0:83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8',
    chain: '-239',
    walletStateInit: 'te6ccsEBAwEAoAAFcSoCATQBAgDe/wAg3SCCAUyXuiGCATOcurGfcbDtRNDTH9MfMdcL/+ME4KTyYIMI1xgg0x/TH9Mf+CMTu/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOjRAaTIyx/LH8v/ye1UAFAAAAAAKamjF3LJ7WtipuLroUqTuQRi56Nnd3vrijj7FbnzOETSLOL/HqR30Q=='
  },
  provider: 'http'
});
```

Результаты строк кода в консоли почти идентичны тем, которые отображались при изначальном установлении соединения. Поэтому, если backend не выполняет аутентификацию пользователя правильно, как ожидалось, требуется способ проверки его корректной работы. Для этого можно действовать как TON Foundation в консоли, поэтому можно проверить легитимность балансов токенов и параметров владения токенами. Естественно, предоставленный код не изменяет никаких переменных в connector, но пользователь может использовать приложение по своему усмотрению, если только этот connector не защищен замыканием. Даже если это так, его несложно извлечь с помощью отладчика и точек останова кодирования.

Теперь, когда аутентификация пользователя была проверена, давайте перейдём к написанию кода.

## Подключение с использованием TonProof

Согласно документации SDK TON Connect, второй аргумент относится к методу `connect()`, который содержит payload, который будет обернут и подписан кошельком. Таким образом, результатом является новый код подключения:

```js
          if (wallet.embedded || wallet.injected) {
            connectButton.onclick = () => {
              connectButton.disabled = true;
              connector.connect({jsBridgeKey: wallet.jsBridgeKey},
                                {tonProof: 'doc-example-<BACKEND_AUTH_ID>'});
            };
          } else if (wallet.bridgeUrl) {
            connectButton.onclick = () => {
              connectButton.disabled = true;
              console.log('Connection link:', connector.connect({
                universalLink: wallet.universalLink,
                bridgeUrl: wallet.bridgeUrl
              }, {tonProof: 'doc-example-<BACKEND_AUTH_ID>'}));
            };
```

Ссылка подключения:

```
https://app.tonkeeper.com/ton-connect?v=2&id=4b0a7e2af3b455e0f0bafe14dcdc93f1e9e73196ae2afaca4d9ba77e94484a44&r=%7B%22manifestUrl%22%3A%22https%3A%2F%2Fratingers.pythonanywhere.com%2Fratelance%2Ftonconnect-manifest.json%22%2C%22items%22%3A%5B%7B%22name%22%3A%22ton_addr%22%7D%2C%7B%22name%22%3A%22ton_proof%22%2C%22payload%22%3A%22doc-example-%3CBACKEND_AUTH_ID%3E%22%7D%5D%7D
```

Расширенный и упрощённый параметр `r`:

```js
{
  "manifestUrl":
    "https://ratingers.pythonanywhere.com/ratelance/tonconnect-manifest.json",
  "items": [
    {"name": "ton_addr"},
    {"name": "ton_proof", "payload": "doc-example-<BACKEND_AUTH_ID>"}
  ]
}
```

Далее ссылка Url-адреса отправляется на мобильное устройство и открывается с помощью Tonkeeper.

После завершения этого процесса получается следующая информация, специфичная для кошелька:

```js
{
  "device": {
    "platform": "android",
    "appName": "Tonkeeper",
    "appVersion": "2.8.0.261",
    "maxProtocolVersion": 2,
    "features": [
      "SendTransaction"
    ]
  },
  "provider": "http",
  "account": {
    "address": "0:b2a1ecf5545e076cd36ae516ea7ebdf32aea008caa2b84af9866becb208895ad",
    "chain": "-239",
    "walletStateInit": "te6cckECFgEAAwQAAgE0ARUBFP8A9KQT9LzyyAsCAgEgAxACAUgEBwLm0AHQ0wMhcbCSXwTgItdJwSCSXwTgAtMfIYIQcGx1Z70ighBkc3RyvbCSXwXgA/pAMCD6RAHIygfL/8nQ7UTQgQFA1yH0BDBcgQEI9ApvoTGzkl8H4AXTP8glghBwbHVnupI4MOMNA4IQZHN0crqSXwbjDQUGAHgB+gD0BDD4J28iMFAKoSG+8uBQghBwbHVngx6xcIAYUATLBSbPFlj6Ahn0AMtpF8sfUmDLPyDJgED7AAYAilAEgQEI9Fkw7UTQgQFA1yDIAc8W9ADJ7VQBcrCOI4IQZHN0coMesXCAGFAFywVQA88WI/oCE8tqyx/LP8mAQPsAkl8D4gIBIAgPAgEgCQ4CAVgKCwA9sp37UTQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYAIBIAwNABmtznaiaEAga5Drhf/AABmvHfaiaEAQa5DrhY/AABG4yX7UTQ1wsfgAWb0kK29qJoQICga5D6AhhHDUCAhHpJN9KZEM5pA+n/mDeBKAG3gQFImHFZ8xhAT48oMI1xgg0x/TH9MfAvgju/Jk7UTQ0x/TH9P/9ATRUUO68qFRUbryogX5AVQQZPkQ8qP4ACSkyMsfUkDLH1Iwy/9SEPQAye1U+A8B0wchwACfbFGTINdKltMH1AL7AOgw4CHAAeMAIcAC4wABwAORMOMNA6TIyx8Syx/L/xESExQAbtIH+gDU1CL5AAXIygcVy//J0Hd0gBjIywXLAiLPFlAF+gIUy2sSzMzJc/sAyEAUgQEI9FHypwIAcIEBCNcY+gDTP8hUIEeBAQj0UfKnghBub3RlcHSAGMjLBcsCUAbPFlAE+gIUy2oSyx/LP8lz+wACAGyBAQjXGPoA0z8wUiSBAQj0WfKnghBkc3RycHSAGMjLBcsCUAXPFlAD+gITy2rLHxLLP8lz+wAACvQAye1UAFEAAAAAKamjFyM60x2mt5eboNyOTE+5RGOe9Ee2rK1Qcb+0ZuiP9vb7QJRlz/c="
  },
  "connectItems": {
    "tonProof": {
      "name": "ton_proof",
      "proof": {
        "timestamp": 1674392728,
        "domain": {
          "lengthBytes": 28,
          "value": "ratingers.pythonanywhere.com"
        },
        "signature": "trCkHit07NZUayjGLxJa6FoPnaGHkqPy2JyNjlUbxzcc3aGvsExCmHXi6XJGuoCu6M2RMXiLzIftEm6PAoy1BQ==",
        "payload": "doc-example-<BACKEND_AUTH_ID>"
      }
    }
  }
}
```

Давайте проверим полученную подпись. Для этого проверка подписи использует Python, поскольку он может легко взаимодействовать с backend. Библиотеки, необходимые для выполнения этого процесса, — это `pytoniq` и `pynacl`.

Далее необходимо получить открытый ключ кошелька. Для этого не используются `tonapi.io` или аналогичные сервисы, поскольку конечный результат не может быть надежно проверен. Вместо этого, это достигается путем анализа `walletStateInit`.

Кроме того, важно убедиться, что `address` и `walletStateInit` совпадают, иначе payload может быть подписан с помощью ключа кошелька, указав собственный кошелек в поле `stateInit` и другой кошелек в поле `address`.

`StateInit` состоит из двух типов ссылок: один для кода и один для данных. В этом контексте цель — извлечь открытый ключ, чтобы загрузить вторую ссылку (ссылку на данные). Затем пропускаются 8 байтов (4 байта используются для поля `seqno` и 4 для `subwallet_id` во всех современных контрактах кошельков), и загружаются следующие 32 байта (256 бит) — открытый ключ.

```python
import nacl.signing
import pytoniq

import hashlib
import base64

received_state_init = 'te6cckECFgEAAwQAAgE0ARUBFP8A9KQT9LzyyAsCAgEgAxACAUgEBwLm0AHQ0wMhcbCSXwTgItdJwSCSXwTgAtMfIYIQcGx1Z70ighBkc3RyvbCSXwXgA/pAMCD6RAHIygfL/8nQ7UTQgQFA1yH0BDBcgQEI9ApvoTGzkl8H4AXTP8glghBwbHVnupI4MOMNA4IQZHN0crqSXwbjDQUGAHgB+gD0BDD4J28iMFAKoSG+8uBQghBwbHVngx6xcIAYUATLBSbPFlj6Ahn0AMtpF8sfUmDLPyDJgED7AAYAilAEgQEI9Fkw7UTQgQFA1yDIAc8W9ADJ7VQBcrCOI4IQZHN0coMesXCAGFAFywVQA88WI/oCE8tqyx/LP8mAQPsAkl8D4gIBIAgPAgEgCQ4CAVgKCwA9sp37UTQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYAIBIAwNABmtznaiaEAga5Drhf/AABmvHfaiaEAQa5DrhY/AABG4yX7UTQ1wsfgAWb0kK29qJoQICga5D6AhhHDUCAhHpJN9KZEM5pA+n/mDeBKAG3gQFImHFZ8xhAT48oMI1xgg0x/TH9MfAvgju/Jk7UTQ0x/TH9P/9ATRUUO68qFRUbryogX5AVQQZPkQ8qP4ACSkyMsfUkDLH1Iwy/9SEPQAye1U+A8B0wchwACfbFGTINdKltMH1AL7AOgw4CHAAeMAIcAC4wABwAORMOMNA6TIyx8Syx/L/xESExQAbtIH+gDU1CL5AAXIygcVy//J0Hd0gBjIywXLAiLPFlAF+gIUy2sSzMzJc/sAyEAUgQEI9FHypwIAcIEBCNcY+gDTP8hUIEeBAQj0UfKnghBub3RlcHSAGMjLBcsCUAbPFlAE+gIUy2oSyx/LP8lz+wACAGyBAQjXGPoA0z8wUiSBAQj0WfKnghBkc3RycHSAGMjLBcsCUAXPFlAD+gITy2rLHxLLP8lz+wAACvQAye1UAFEAAAAAKamjFyM60x2mt5eboNyOTE+5RGOe9Ee2rK1Qcb+0ZuiP9vb7QJRlz/c='
received_address = '0:b2a1ecf5545e076cd36ae516ea7ebdf32aea008caa2b84af9866becb208895ad'

state_init = pytoniq.Cell.one_from_boc(base64.b64decode(received_state_init))

address_hash_part = state_init.hash.hex()
assert received_address.endswith(address_hash_part)

public_key = state_init.refs[1].bits.tobytes()[8:][:32]

# bytearray(b'#:\xd3\x1d\xa6\xb7\x97\x9b\xa0\xdc\x8eLO\xb9Dc\x9e\xf4G\xb6\xac\xadPq\xbf\xb4f\xe8\x8f\xf6\xf6\xfb')

verify_key = nacl.signing.VerifyKey(bytes(public_key))
```

После реализации приведенного выше кода последовательности сверяемся с правильной документацией, чтобы проверить, какие параметры проверяются и подписываются с помощью ключа кошелька:

> ```
> message = utf8_encode("ton-proof-item-v2/") ++  
>           Address ++  
>           AppDomain ++  
>           Timestamp ++  
>           Payload
>
> signature = Ed25519Sign(
>   privkey,
>   sha256(0xffff ++ utf8_encode("ton-connect") ++ sha256(message))
> )
> ```

> При этом:
>
> - `Address` обозначает адрес кошелька, закодированный как последовательность:
>   - `workchain`: 32-битное целое число со знаком big endian;
>   - `hash`: 256-битное целое число без знака big endian;
> - `AppDomain` - это Length ++ EncodedDomainName
>   - `Length` использует 32-битное значение длины доменного имени приложения в кодировке utf-8 в байтах
>   - `EncodedDomainName` id `Length` байт доменное имя приложения в кодировке utf-8
> - `Timestamp` обозначает 64-битное время эпохи unix операции подписи
> - `Payload` обозначает двоичную строку переменной длины
> - `utf8_encode` создает простую байтовую строку без префиксов длины.

Давайте перепишем это на Python. Порядок байтов некоторых целых чисел выше не указан, поэтому необходимо рассмотреть несколько примеров. Пожалуйста, обратитесь к следующей реализации Tonkeeper, в которой подробно описаны некоторые связанные примеры: [ConnectReplyBuilder.ts](https://github.com/tonkeeper/wallet/blob/77992c08c663dceb63ca6a8e918a2150c75cca3a/src/tonconnect/ConnectReplyBuilder.ts#L42).

```python
received_timestamp = 1674392728
signature = 'trCkHit07NZUayjGLxJa6FoPnaGHkqPy2JyNjlUbxzcc3aGvsExCmHXi6XJGuoCu6M2RMXiLzIftEm6PAoy1BQ=='

message = (b'ton-proof-item-v2/'
         + 0 .to_bytes(4, 'big') + si.bytes_hash()
         + 28 .to_bytes(4, 'little') + b'ratingers.pythonanywhere.com'
         + received_timestamp.to_bytes(8, 'little')
         + b'doc-example-<BACKEND_AUTH_ID>')
# b'ton-proof-item-v2/\x00\x00\x00\x00\xb2\xa1\xec\xf5T^\x07l\xd3j\xe5\x16\xea~\xbd\xf3*\xea\x00\x8c\xaa+\x84\xaf\x98f\xbe\xcb \x88\x95\xad\x1c\x00\x00\x00ratingers.pythonanywhere.com\x984\xcdc\x00\x00\x00\x00doc-example-<BACKEND_AUTH_ID>'

signed = b'\xFF\xFF' + b'ton-connect' + hashlib.sha256(message).digest()
# b'\xff\xffton-connectK\x90\r\xae\xf6\xb0 \xaa\xa9\xbd\xd1\xaa\x96\x8b\x1fp\xa9e\xff\xdf\x81\x02\x98\xb0)E\t\xf6\xc0\xdc\xfdx'

verify_key.verify(hashlib.sha256(signed).digest(), base64.b64decode(signature))
# b'\x0eT\xd6\xb5\xd5\xe8HvH\x0b\x10\xdc\x8d\xfc\xd3#n\x93\xa8\xe9\xb9\x00\xaaH%\xb5O\xac:\xbd\xcaM'
```

После реализации вышеуказанных параметров, если злоумышленник попытается выдать себя за пользователя и не предоставит действительную подпись, будет отображена следующая ошибка:

```bash
nacl.exceptions.BadSignatureError: Signature was forged or corrupt.
```

## Следующие шаги

При написании dApp также следует учитывать следующее:

- после успешного завершения соединения (восстановленного или нового подключения) должна отображаться кнопка `Disconnect` вместо нескольких кнопок `Connect`
- после того как пользователь отключается, нужно пересоздавать кнопки `Disconnect`
- данный код кошелька должен быть проверен, так как
  - более новые версии кошелька могут размещать открытые ключи в другом месте и создавать проблемы
  - текущий пользователь может войти, используя другой тип контракта вместо кошелька. Благодаря этому это будет содержать публичный ключ в ожидаемом месте

Удачи и получайте удовольствие от написания dApps!
