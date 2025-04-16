# Блокчейн TON для игр

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Содержание

В этом уроке мы рассмотрим, как добавить блокчейн TON в игру. Для нашего примера мы будем использовать клон Flappy Bird, написанный на Phaser, и шаг за шагом добавлять функции GameFi. В учебнике мы будем использовать короткие фрагменты кода и псевдокод, чтобы было понятнее. Кроме того, мы будем давать ссылки на реальные блоки кода, чтобы помочь Вам лучше понять. Всю реализацию можно найти в [демо-репо](https://github.com/ton-community/flappy-bird).

![Игра Flappy Bird без функций GameFi](/img/tutorials/gamefi-flappy/no-gamefi-yet.png)

Мы собираемся реализовать следующее:

- Достижения. Давайте наградим наших пользователей [SBT](/v3/concepts/glossary#sbt). Система достижений - это отличный инструмент для повышения вовлеченности пользователей.
- Игровая валюта. В блокчейне TON легко запустить свой собственный токен (жетон). Этот токен можно использовать для создания внутриигровой экономики. Наши пользователи смогут зарабатывать игровые монеты, чтобы потом тратить их.
- Игровой магазин. Мы предоставим пользователям возможность приобретать внутриигровые предметы, используя либо внутриигровую валюту, либо сами монеты TON.

## Подготовка

### Установите GameFi SDK

Сначала мы настроим игровое окружение. Для этого нам нужно установить `assets-sdk`. Этот пакет предназначен для подготовки всего, что нужно разработчикам для интеграции блокчейна в игры. lib можно использовать из CLI или из скриптов Node.js. В этом уроке мы будем придерживаться подхода CLI.

```sh
npm install -g @ton-community/assets-sdk@beta
```

### Создайте главный кошелек

Далее нам нужно создать главный кошелек. Главный кошелек - это кошелек, который мы будем использовать для чеканки жетона, коллекций, NFT, SBT и получения платежей.

```sh
assets-cli setup-env
```

Вам будет задано несколько вопросов:

| Поле      | Подсказка                                                                                                                                                                                                                                                                                                                                                 |
| :-------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Сеть      | Выберите `testnet`, пока это тестовая игра.                                                                                                                                                                                                                                                                                               |
| Тип       | Выберите кошелек типа `highload-v2`, поскольку это самый лучший и производительный вариант для использования в качестве главного кошелька.                                                                                                                                                                                                |
| Хранение  | Хранилище будет использоваться для хранения файлов `NFT`/`SBT`. `Amazon S3` (централизованное) или `Pinata` (децентрализованное).  В данном руководстве мы будем использовать `Pinata`, поскольку децентрализованное хранилище будет более наглядным для Web3 игры. |
| Шлюз IPFS | Сервис откуда будут загружаться метаданные активов: `pinata`, `ipfs.io` или введите URL другого сервиса.                                                                                                                                                                                                                  |

Скрипт выводит ссылку, которую Вы можете открыть, чтобы посмотреть состояние созданного кошелька.

![Новый кошелек в статусе Nonexist](/img/tutorials/gamefi-flappy/wallet-nonexist-status.png)

Как Вы можете заметить, кошелек еще не создан. Чтобы кошелек был действительно создан, нам нужно внести в него средства. В реальном сценарии Вы можете пополнить кошелек любым удобным для Вас способом, используя адрес кошелька. В нашем случае мы будем использовать [Testgiver TON Bot](https://t.me/testgiver_ton_bot). Пожалуйста, откройте его, чтобы получить 5 тестовых монет TON.

Немного позже Вы сможете увидеть 5 TON на кошельке, а его статус станет `Uninit`. Кошелек готов. После первого использования он изменит статус на `Active`.

![Состояние кошелька после пополнения](/img/tutorials/gamefi-flappy/wallet-nonexist-status.png)

### Чеканьте внутриигровую валюту

Мы собираемся создать внутриигровую валюту, чтобы вознаграждать ею пользователей:

```sh
assets-cli deploy-jetton
```

Вам будет задано несколько вопросов:

| Поле             | Подсказка                                                                                                                                                                                                                                                                                |
| :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Имя              | Имя токена. Например, `Flappy Jetton`.                                                                                                                                                                                                                   |
| Описание         | Например, описание токена: Яркий цифровой токен из вселенной Flappy Bird.                                                                                                                                                                                |
| Изображение      | Загрузите подготовленный [логотип жетона](https://raw.githubusercontent.com/ton-community/flappy-bird/ca4b6335879312a9b94f0e89384b04cea91246b1/scripts/tokens/flap/image.png) и укажите путь к файлу. Конечно, Вы можете использовать любое изображение. |
| Символ           | `FLAP` или введите любую аббревиатуру, которую Вы хотите использовать.                                                                                                                                                                                                   |
| Десятичные числа | Сколько нулей после точки будет у Вашей валюты. Пусть в нашем случае это будет `0`.                                                                                                                                                                      |

Скрипт выводит ссылку, которую Вы можете открыть, чтобы увидеть состояние созданного жетона. Он будет иметь статус `Active`. Состояние кошелька изменит статус с `Uninit` на `Active`.

![Внутриигровая валюта / жетон](/img/tutorials/gamefi-flappy/jetton-active-status.png)

### Создание коллекций для SBT

Для примера, в демо-игре мы будем награждать пользователей за первую и пятую игру. Таким образом, мы создадим две коллекции, чтобы помещать в них SBT, когда пользователи достигнут соответствующих условий - сыграют первый и пятый раз:

```sh
assets-cli deploy-nft-collection
```

| Поле        | Первая игра                                                                                                                                       | Пятая игра                                                                                                                                        |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| Тип         | `sbt`                                                                                                                                             | `sbt`                                                                                                                                             |
| Имя         | Flappy First Flight                                                                                                                               | Flappy High Fiver                                                                                                                                 |
| Описание    | Отпразднуйте свое первое путешествие в игре Flappy Bird!                                                                                          | Отметьте свою упорную игру с Flappy High Fiver NFT!                                                                                               |
| Изображение | Вы можете скачать [изображение](https://raw.githubusercontent.com/ton-community/flappy-bird/article-v1/scripts/tokens/first-time/image.png) здесь | Вы можете скачать [изображение](https://raw.githubusercontent.com/ton-community/flappy-bird/article-v1/scripts/tokens/five-times/image.png) здесь |

Мы полностью готовы. Итак, давайте перейдем к реализации логики.

## Подключение кошелька

Процесс начинается с того, что пользователь подключает свой кошелек. Итак, давайте добавим интеграцию подключения кошелька. Для работы с блокчейном со стороны клиента нам необходимо установить GameFi SDK для Phaser:

```sh
npm install --save @ton/phaser-sdk@beta
```

Теперь давайте настроим GameFi SDK и создадим его экземпляр:

```typescript
import { GameFi } from '@ton/phaser-sdk'

const gameFi = await GameFi.create({
    network: 'testnet'
    connector: {
        // if tonconnect-manifest.json is placed in the root you can skip this option
        manifestUrl: '/assets/tonconnect-manifest.json',
        actionsConfiguration: {
            // address of your Telegram Mini App to return to after the wallet is connected
            // url you provided to BothFather during the app creation process
            // to read more please read https://github.com/ton-community/flappy-bird#telegram-bot--telegram-web-app
            twaReturnUrl: URL_YOU_ASSIGNED_TO_YOUR_APP
        },
        contentResolver: {
            // some NFT marketplaces don't support CORS, so we need to use a proxy
            // you are able to use any format of the URL, %URL% will be replaced with the actual URL
            urlProxy: `${YOUR_BACKEND_URL}/${PROXY_URL}?url=%URL%`
        },
        // where in-game purchases come to
        merchant: {
            // in-game jetton purchases (FLAP)
            // use address you got running `assets-cli deploy-jetton`
            jettonAddress: FLAP_ADDRESS,
            // in-game TON purchases
            // use master wallet address you got running `assets-cli setup-env`
            tonAddress: MASTER_WALLET_ADDRESS
        }
    },

})
```

> Чтобы узнать больше о параметрах инициализации, прочтите [документацию библиотеки](https://github.com/ton-org/game-engines-sdk).

> Чтобы узнать, что такое `tonconnect-manifest.json`, пожалуйста, проверьте ton-connect [описание манифеста](/v3/guidelines/ton-connect/guidelines/creating-manifest).

Теперь мы готовы создать кнопку подключения кошелька. Давайте создадим сцену пользовательского интерфейса в Phaser, которая будет содержать кнопку подключения:

```typescript
class UiScene extends Phaser.Scene {
    // receive gameFi instance via constructor
    private gameFi: GameFi;

    create() {
        this.button = this.gameFi.createConnectButton({
            scene: this,
            // you can calculate the position for the button in your UI scene
            x: 0,
            y: 0,
            button: {
                onError: (error) => {
                    console.error(error)
                }
                // other options, read the docs
            }
        })
    }
}
```

> Прочитайте, как создать [кнопку подключения](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/connect-wallet-ui.ts#L82) и [сцену пользовательского интерфейса](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/connect-wallet-ui.ts#L45).

Чтобы следить за тем, когда пользователь подключает или отключает свой кошелек, давайте воспользуемся следующим фрагментом кода:

```typescript
function onWalletChange(wallet: Wallet | null) {
    if (wallet) {
        // wallet is ready to use
    } else {
        // wallet is disconnected
    }
}
const unsubscribe = gameFi.onWalletChange(onWalletChange)
```

> Чтобы узнать о более сложных сценариях, ознакомьтесь с полной реализацией [процесса подключения кошелька](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/index.ts#L16).

Прочитайте, как может быть реализовано [управление игровым пользовательским интерфейсом](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/index.ts#L50).

Теперь у нас подключен кошелек пользователя, и мы можем двигаться дальше.

![Кнопка подключения кошелька](/img/tutorials/gamefi-flappy/wallet-connect-button.png)
![Подтверждение подключения кошелька](/img/tutorials/gamefi-flappy/wallet-connect-confirmation.png)
![Кошелек подключен](/img/tutorials/gamefi-flappy/wallet-connected.png)

## Реализация достижений и наград

Для реализации системы достижений и вознаграждений нам необходимо подготовить конечную точку, которая будет запрашиваться при каждой попытке пользователя.

### Конечная точка `/played`

Нам нужно создать конечную точку `/played`, которая должна выполнять следующие действия:

- получите тело запроса с адресом кошелька пользователя и начальными данными Telegram, переданными Mini App во время запуска приложения. Начальные данные необходимо разобрать, чтобы извлечь данные аутентификации и убедиться, что пользователь отправляет запрос только от своего имени.
- конечная точка должна подсчитать и сохранить количество игр, в которые сыграл пользователь.
- конечная точка должна проверить, если это первая или пятая игра для пользователя, и, если да, вознаградить пользователя соответствующим SBT.
- конечная точка должна вознаграждать пользователя 1 FLAP за каждую игру.

> Прочитайте код [конечной точки /played](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L197).

### Запрос конечной точки `/played`

Каждый раз, когда птица ударяется о трубу или падает вниз, клиентский код должен вызывать конечную точку `/played`, передавая правильное тело:

```typescript
async function submitPlayed(endpoint: string, walletAddress: string) {
    return await (await fetch(endpoint + '/played', {
        body: JSON.stringify({
            tg_data: (window as any).Telegram.WebApp.initData,
            wallet: walletAddress
        }),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST'
    })).json()
}

const playedInfo = await submitPlayed('http://localhost:3001', wallet.account.address);
```

> Прочитайте код [submitPlayer function](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/game-scene.ts#L10).

Давайте сыграем в первый раз и убедимся, что будем вознаграждены жетоном FLAP и SBT. Нажмите кнопку Play, пролетите через пару труб, а затем врежьтесь. Отлично, все работает!

![Награжден жетоном и SBT](/img/tutorials/gamefi-flappy/sbt-rewarded.png)

Сыграйте еще 4 раза, чтобы получить второй SBT, а затем откройте свой Кошелек, TON Space. Здесь находятся Ваши коллекционные предметы:

![Достижения как SBT в кошельке](/img/tutorials/gamefi-flappy/sbts-in-wallet.png)

## Реализация игрового магазина

Чтобы иметь внутриигровой магазин, нам необходимо иметь два компонента. Первый - это конечная точка, которая предоставляет информацию о покупках пользователей. Второй - глобальный цикл, который следит за пользовательскими транзакциями и назначает игровые свойства их владельцам.

### Конечная точка `/purchases`

Конечная точка делает следующее:

- получает параметр `auth` с начальными данными Telegram Mini Apps.
- получает товары, которые купил пользователь, и отвечает списком товаров.

> Прочитайте код конечной точки [/purchases](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L303).

### Цикл для покупок

Чтобы узнать, когда пользователи совершают платежи, нам нужно следить за транзакциями главного кошелька. Каждая транзакция должна содержать сообщение `userId`:`itemId`. Мы будем запоминать последнюю обработанную транзакцию, получать только новые, присваивать пользователям свойства, которые они купили, используя `userId` и `itemId`, переписывать хэш последней транзакции. Это будет работать в бесконечном цикле.

> Прочитайте код [цикла покупки](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L110).

### Клиентская часть магазина

На стороне клиента у нас есть кнопка "Shop".

![Кнопка входа в магазин](/img/tutorials/gamefi-flappy/shop-enter-button.png)

Когда пользователь нажимает на кнопку, открывается сцена магазина. Сцена магазина содержит список товаров, которые пользователь может купить. У каждого товара есть цена и кнопка "Buy". Когда пользователь нажимает на кнопку "Buy", совершается покупка.

Открытие магазина вызовет загрузку купленных предметов и будет обновлять его каждые 10 секунд:

```typescript
// inside of fetchPurchases function
await fetch('http://localhost:3000/purchases?auth=' + encodeURIComponent((window as any).Telegram.WebApp.initData))
// watch for purchases
setTimeout(() => { fetchPurchases() }, 10000)
```

> Прочитайте код [функции showShop](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/ui.ts#L191).

Теперь нам нужно реализовать саму покупку. Для этого мы сначала создадим экземпляр GameFi SDK, а затем воспользуемся методом `buyWithJetton`:

```typescript
gameFi.buyWithJetton({
    amount: BigInt(price),
    forwardAmount: BigInt(1),
    forwardPayload: (window as any).Telegram.WebApp.initDataUnsafe.user.id + ':' + itemId
});
```

![Игровой товар для покупки](/img/tutorials/gamefi-flappy/purchase-item.png)
![Подтверждение покупки](/img/tutorials/gamefi-flappy/purchase-confirmation.png)
![Товар готов к использованию](/img/tutorials/gamefi-flappy/purchase-done.png)

Также можно расплатиться монетой TON:

```typescript
import { toNano } from '@ton/phaser-sdk'

gameFi.buyWithTon({
    amount: toNano(0.5),
    comment: (window as any).Telegram.WebApp.initDataUnsafe.user.id + ':' + 1
});
```

## Послесловие

На этом все! Мы рассмотрели основные возможности GameFi, но SDK предоставляет больше функций, таких как трансферы между игроками, утилиты для работы с NFT и коллекциями и т.д. В будущем мы предоставим еще больше возможностей.

Чтобы узнать обо всех возможностях GameFi, которые Вы можете использовать, прочитайте документацию [ton-org/game-engines-sdk](https://github.com/ton-org/game-engines-sdk) и [@ton-community/assets-sdk](https://github.com/ton-community/assets-sdk).

Поделитесь мнением в [Обсуждениях](https://github.com/ton-org/game-engines-sdk/discussions)!

Полная реализация доступна в репозитории [flappy-bird](https://github.com/ton-community/flappy-bird).
