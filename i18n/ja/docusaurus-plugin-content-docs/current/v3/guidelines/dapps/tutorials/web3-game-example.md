import Feedback from '@site/src/components/Feedback';

# TON Blockchain for games

## チュートリアルの内容

In this tutorial, we will explore how to integrate TON Blockchain into a game. As an example, we will use a Flappy Bird clone built with Phaser and gradually add GameFi features. To improve readability, we will use short code snippets and pseudocode. Additionally, we will provide links to real code blocks for better understanding. The complete implementation can be found in the [demo repo](https://github.com/ton-community/flappy-bird).

[GameFiの機能を使わないFlappy Birdゲーム](/img/tutorials/gamefi-flappy/no-gamefi-yet.png)

We will implement the following:

- Achievements. Let’s reward our users with [SBTs](/v3/concepts/glossary#sbt). The achievement system is a great tool for increasing user engagement.
- Game currency. On the TON blockchain, it’s easy to launch your own token (jetton). The token can be used to create an in-game economy. Our users will be able to earn game coins and spend them later.
- Game shop. We will allow users to purchase in-game items using either in-game currency or TON coins.

## 準備

### GameFi SDKのインストール

First, we need to set up the game environment by installing `assets-sdk`. This package is designed to provide developers with everything required to integrate blockchain into games. The library can be used either from the CLI or within Node.js scripts. In this tutorial, we will use the CLI approach.

```sh
npm install -g @ton-community/assets-sdk@beta
```

### マスターウォレットの作成

Next, we need to create a master wallet. This wallet will be used to mint jettons, collections, NFTs, and SBTs, as well as to receive payments.

```sh
assets-cli setup-env
```

You will be asked a few questions during the setup.

| フィールド      | ヒント                                                                                                                                                                                                                                                                                                                   |
| :--------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ネットワーク     | Select `testnet` since this is a test game.                                                                                                                                                                                                                                                           |
| タイプ        | Select `highload-v2`wallet type, as it offers the best performance for use as a master wallet.                                                                                                                                                                                                        |
| ストレージ      | Storage is used to hold `NFT`/`SB`T files. You can choose between `Amazon S3` (centralized) or `Pinata` (decentralized).  For this tutorial, we'll use Pinata since decentralized storage is more illustrative for a Web3 game. |
| IPFSゲートウェイ | This service loads asset metadata from  `pinata`, \\`ipfs.io,  or a custom service URL.                                                                                                                                                                                              |

The script will output a link where you can view the created wallet's state.

![存在しない状態の新しい財布](/img/tutorials/gamefi-flappy/wallet-nonexist-status.png)

As you can see, the wallet has not actually been created yet. To finalize the creation, we need to deposit funds into it. In a real-world scenario, you can fund the wallet however you prefer using its address. In our case, we will use the [Testgiver TON Bot](https://t.me/testgiver_ton_bot). Open it to claim 5 test TON coins.

A little later, you should see 5 TON in the wallet, and its status will change to Uninit. The wallet is now ready. After the first transaction, its status will change to Active.
![Wallet status after top-up](/img/tutorials/gamefi-flappy/wallet-nonexist-status.png)

### ゲーム内通貨のミント

We are going to create an in-game currency to reward users.

```sh
assets-cli deploy-jetton
```

You will be asked a few questions during the setup:

| フィールド | ヒント                                                                                                                                                                                                                                            |
| :---- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 名称    | トークン名、例えば `Flappy Jetton`.                                                                                                                                                                                                     |
| 説明    | トークンの説明フラッピーバードの世界からの活気に満ちたデジタルトークン                                                                                                                                                                                                            |
| 画像    | 用意した[jettonロゴ](https://raw.githubusercontent.com/ton-community/flappy-bird/ca4b6335879312a9b94f0e89384b04cea91246b1/scripts/tokens/flap/image.png)をダウンロードし、ファイルパスを指定してください。もちろん、どんな画像でもOKです。 Of course, you can use any image. |
| シンボル  | FLAP\\`または任意の略語を入力してください。                                                                                                                                                                                                                     |
| 小数    | ドットの後にいくつゼロが付くか。ここでは「0」とします。 Let’ it be `0` in our case.                                                                                                                                                                       |

The script will output a link where you can view the created jetton's state. It will have an **Active** status. The wallet’s status will change from **Uninit** to **Active**.

![ゲーム内通貨/Jetton](/img/tutorials/gamefi-flappy/jetton-active-status.png)

### SBTのコレクションを作成

For our demo game, we will reward users after their first and fifth games. To do this, we will mint two collections, where SBTs will be assigned when users meet the required conditions—playing for the first and fifth time:

```sh
assets-cli deploy-nft-collection
```

| フィールド | First game                                                                                                                        | 5回目                                                                                                                               |
| :---- | :-------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| タイプ   | `sbt`                                                                                                                             | `sbt`                                                                                                                             |
| 名称    | フラッピー初飛行                                                                                                                          | Flappy High Fiver                                                                                                                 |
| 説明    | フラッピーバードのゲームでの就任を記念!                                                                                                              | Celebrate your persistent play with the Flappy High Fiver NFT!                                                                    |
| 画像    | [画像](https://raw.githubusercontent.com/ton-community/flappy-bird/article-v1/scripts/tokens/first-time/image.png)はこちらからダウンロードできます。 | [画像](https://raw.githubusercontent.com/ton-community/flappy-bird/article-v1/scripts/tokens/five-times/image.png)はこちらからダウンロードできます。 |

Now that we are fully prepared, let's proceed to implementing the game logic.

## ウォレットを接続

The process begins with the user connecting their wallet. Let's integrate wallet connectivity.

To interact with the blockchain from the client side, we need to install the GameFi SDK for Phaser:

```sh
npm install --save @ton/phaser-sdk@beta
```

Now, let's set up GameFi SDK and create an instance of it:

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

> 初期化オプションの詳細については、[library documentation](https://github.com/ton-org/game-engines-sdk)をお読みください。

> `tonconnect-manifest.json` の内容については、[manifestion](/v3/guidelines/ton-connect/guidelines/creating-manifest)を確認してください。

Next, we are ready to create a **Wallet Connect** button. Let’s create a UI scene in Phaser that will contain the **Connect** button:

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

> [接続ボタン](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/connect-wallet-ui.ts#L82)と[UIシーン](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/connect-wallet-ui.ts#L45)の作り方を読みます。

To monitor when a user connects or disconnects their wallet, use the following code snippet:

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

> より複雑なシナリオについては、[wallet connect flow](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/index.ts#L16)の完全な実装をご覧ください。

Read how [game UI managing](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/index.ts#L50) can be implemented.

Now that we have the user's wallet connected, we can move forward.

![ウォレット接続ボタン](/img/tutorialss/gamefi-flappy/wallet-connect-button.png)
![ウォレット接続確認](/img/tutorialss/gamefi-flappy/wallet-connect-confirmation.png)
![ウォレット接続済み](/img/tutorialss/gamefi-flappy/wallet-connected.png)

## 実績と報酬の導入

To implement the achievements and reward system, we need to set up an endpoint that will be triggered each time a user plays.

### エンドポイント

We need to create an endpoint `/played ` which does the following:

- receives a request body containing the user’s wallet address and Telegram initial data, which is passed to the Mini App during launch. The initial data must be parsed to extract authentication details and verify that the user is sending the request on their own behalf.
- tracks and stores the number of games a user has played.
- checks whether this is the user’s first or fifth game. If so, it rewards the user with the corresponding SBT.
- rewards the user with 1 FLAP for each game played.

> [再生されたエンドポイント](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L197)のコードを読みます。

### `/played`エンドポイントをリクエスト

Every time the bird hits a pipe or falls, the client code must call the `/played` endpoint, passing the correct request body:

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

> [submitPlayer関数](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/game-scene.ts#L10)のコードを読みます。

Let’s play for the first time and ensure we receive a FLAP token and an SBT. Click the Play button, fly through a pipe or two, then crash into a pipe. Everything works!

![トークンとSBTの報酬](/img/tutorials/gamefi-flappy/sbt-rewarded.png)

Play four more times to earn the second SBT, then open your TON Space Wallet. Here are your collectibles:
![Achievements as SBT in Wallet](/img/tutorials/gamefi-flappy/sbts-in-wallet.png)

## Implementing the game shop

To set up an in-game shop, we need two components. The first is an endpoint that provides information about users' purchases. The second is a global loop that monitors user transactions and assigns game properties to item owners.

### `/purchases`エンドポイント

このエンドポイントは以下のことを行います：

- receive `auth` query parameter containing Telegram Mini App initial data.
- retrieves the items a user has purchased and responds with a list of those items.

> [purchases](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L303)のエンドポイント・コードを読みます。

### 購入ループ

o track user payments, we need to monitor transactions in the master wallet. Each transaction must include a message in the format `userId`:`itemId`. We will store the last processed transaction, retrieve only new ones, assign purchased properties to users based on `userId` and `itemId`, and update the last transaction hash. This process will run in an infinite loop.

> Read the [purchase loop](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L110) code.

### ショップのクライアント側

On the client side, we have a **Shop** button.

![ショップに入るボタン](/img/tutorials/gamefi-flappy/shop-enter-button.png)

When a user clicks this button, the **Shop Scene** opens. The shop contains a list of items available for purchase. Each item has a price and a Buy button. When a user clicks the Buy button, the purchase is processed.

Opening the **Shop Scene** will trigger the loading of purchased items and refresh the list every 10 seconds.

```typescript
// inside of fetchPurchases function
await fetch('http://localhost:3000/purchases?auth=' + encodeURIComponent((window as any).Telegram.WebApp.initData))
// watch for purchases
setTimeout(() => { fetchPurchases() }, 10000)
```

> [showShop関数](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/ui.ts#L191)のコードを読みます。

Now, we need to implement the purchase process. To do this, we will first create a GameFi SDK instance and then use the `buyWithJetton` method:

```typescript
gameFi.buyWithJetton({
    amount: BigInt(price),
    forwardAmount: BigInt(1),
    forwardPayload: (window as any).Telegram.WebApp.initDataUnsafe.user.id + ':' + itemId
});
```

![Game prop to purchase](/img/tutorialss/gamefi-flappy/purchase-item.png)
![Purchase confirmation](/img/tutorialss/gamefi-flappy/purchase-confirmation.png)
![Property is ready to use](/img/tutorialss/gamefi-flappy/purchase-done.png)

It is also possible to pay with TON coins:

```typescript
import { toNano } from '@ton/phaser-sdk'

gameFi.buyWithTon({
    amount: toNano(0.5),
    comment: (window as any).Telegram.WebApp.initDataUnsafe.user.id + ':' + 1
});
```

## Afterword

That’s it for this tutorial! We explored the basic GameFi features, but the SDK offers additional functionality, such as player-to-player transfers and utilities for working with NFTs and collections. More features will be introduced in the future.

To learn about all available GameFi features, read the documentation for [ton-org/game-engines-sdk](https://github.com/ton-org/game-engines-sdk) and [@ton-community/assets-sdk](https://github.com/ton-community/assets-sdk).

Let us know your thoughts in [Discussions](https://github.com/ton-org/game-engines-sdk/discussions)!

The complete implementation is available in the [flappy-bird](https://github.com/ton-community/flappy-bird) repository.

<Feedback />

