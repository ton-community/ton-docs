import Feedback from '@site/src/components/Feedback';

# TON Blockchain for games

## 教程内容

In this tutorial, we will explore how to integrate TON Blockchain into a game. As an example, we will use a Flappy Bird clone built with Phaser and gradually add GameFi features. To improve readability, we will use short code snippets and pseudocode. Additionally, we will provide links to real code blocks for better understanding. The complete implementation can be found in the [demo repo](https://github.com/ton-community/flappy-bird).

![没有 GameFi 功能的 Flappy Bird 游戏](/img/tutorials/gamefi-flappy/no-gamefi-yet.png)

We will implement the following:

- Achievements. Let’s reward our users with [SBTs](/v3/concepts/glossary#sbt). The achievement system is a great tool for increasing user engagement.
- Game currency. On the TON blockchain, it’s easy to launch your own token (jetton). The token can be used to create an in-game economy. Our users will be able to earn game coins and spend them later.
- Game shop. We will allow users to purchase in-game items using either in-game currency or TON coins.

## 准备工作

### 安装 GameFi SDK

First, we need to set up the game environment by installing `assets-sdk`. This package is designed to provide developers with everything required to integrate blockchain into games. The library can be used either from the CLI or within Node.js scripts. In this tutorial, we will use the CLI approach.

```sh
npm install -g @ton-community/assets-sdk@beta
```

### 创建主钱包

Next, we need to create a master wallet. This wallet will be used to mint jettons, collections, NFTs, and SBTs, as well as to receive payments.

```sh
assets-cli setup-env
```

You will be asked a few questions during the setup.

| 字段      | 提示                                                                                                                                                                                                                                                                                                                    |
| :------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 网络      | Select `testnet` since this is a test game.                                                                                                                                                                                                                                                           |
| 类型      | Select `highload-v2`wallet type, as it offers the best performance for use as a master wallet.                                                                                                                                                                                                        |
| 存储      | Storage is used to hold `NFT`/`SB`T files. You can choose between `Amazon S3` (centralized) or `Pinata` (decentralized).  For this tutorial, we'll use Pinata since decentralized storage is more illustrative for a Web3 game. |
| IPFS 网关 | This service loads asset metadata from  `pinata`, \\`ipfs.io,  or a custom service URL.                                                                                                                                                                                              |

The script will output a link where you can view the created wallet's state.

![新钱包处于 Nonexist 状态](/img/tutorials/gamefi-flappy/wallet-nonexist-status.png)

As you can see, the wallet has not actually been created yet. To finalize the creation, we need to deposit funds into it. In a real-world scenario, you can fund the wallet however you prefer using its address. In our case, we will use the [Testgiver TON Bot](https://t.me/testgiver_ton_bot). Open it to claim 5 test TON coins.

A little later, you should see 5 TON in the wallet, and its status will change to Uninit. The wallet is now ready. After the first transaction, its status will change to Active.
![Wallet status after top-up](/img/tutorials/gamefi-flappy/wallet-nonexist-status.png)

### 铸造游戏货币

We are going to create an in-game currency to reward users.

```sh
assets-cli deploy-jetton
```

You will be asked a few questions during the setup:

| 字段  | 提示                                                                                                                                                                                                                              |
| :-- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 名称  | 代币名称，例如 `Flappy Jetton`。                                                                                                                                                                                                        |
| 描述  | 代币描述，例如：来自 Flappy Bird 宇宙的生动数字代币。                                                                                                                                                                                               |
| 图片  | 下载预备好的 [jetton 标志](https://raw.githubusercontent.com/ton-community/flappy-bird/ca4b6335879312a9b94f0e89384b04cea91246b1/scripts/tokens/flap/image.png) 并指定文件路径。当然，您也可以使用任何图片。 Of course, you can use any image. |
| 符号  | `FLAP` 或输入您想使用的任何缩写。                                                                                                                                                                                                            |
| 小数位 | 货币小数点后将有多少个零。在我们的案例中，让它为 `0`。 Let’ it be `0` in our case.                                                                                                                                                       |

The script will output a link where you can view the created jetton's state. It will have an **Active** status. The wallet’s status will change from **Uninit** to **Active**.

![游戏货币 / jetton](/img/tutorials/gamefi-flappy/jetton-active-status.png)

### 为 SBT 创建收藏品

For our demo game, we will reward users after their first and fifth games. To do this, we will mint two collections, where SBTs will be assigned when users meet the required conditions—playing for the first and fifth time:

```sh
assets-cli deploy-nft-collection
```

| 字段 | 第一次游戏                                                                                                                    | 第五次游戏                                                                                                                    |
| :- | :----------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| 类型 | `sbt`                                                                                                                    | `sbt`                                                                                                                    |
| 名称 | Flappy First Flight                                                                                                      | Flappy High Fiver                                                                                                        |
| 描述 | 纪念您在 Flappy Bird 游戏中的首次旅行！                                                                                               | 以 Flappy High Fiver NFT 庆祝您的持续游戏！                                                                                        |
| 图片 | 您可以在此处下载[图片](https://raw.githubusercontent.com/ton-community/flappy-bird/article-v1/scripts/tokens/first-time/image.png) | 您可以在此处下载[图片](https://raw.githubusercontent.com/ton-community/flappy-bird/article-v1/scripts/tokens/five-times/image.png) |

Now that we are fully prepared, let's proceed to implementing the game logic.

## 连接钱包

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

> 要了解更多关于初始化选项，请阅读[库文档](https://github.com/ton-org/game-engines-sdk)。

> 要了解什么是 `tonconnect-manifest.json`，请查看 ton-connect [manifest描述](https://docs.ton.org/develop/dapps/ton-connect/manifest)。

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

> 阅读如何创建[连接按钮](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/connect-wallet-ui.ts#L82)和 [UI 场景](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/connect-wallet-ui.ts#L45)。

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

> 要了解更多复杂场景，请查看[钱包连接流程](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/index.ts#L16)的完整实现。

Read how [game UI managing](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/index.ts#L50) can be implemented.

Now that we have the user's wallet connected, we can move forward.

![连接钱包按钮](/img/tutorials/gamefi-flappy/wallet-connect-button.png)
![确认钱包连接](/img/tutorials/gamefi-flappy/wallet-connect-confirmation.png)
![钱包已连接](/img/tutorials/gamefi-flappy/wallet-connected.png)

## 实现成就和奖励

To implement the achievements and reward system, we need to set up an endpoint that will be triggered each time a user plays.

### `/played` 端点

We need to create an endpoint `/played ` which does the following:

- receives a request body containing the user’s wallet address and Telegram initial data, which is passed to the Mini App during launch. The initial data must be parsed to extract authentication details and verify that the user is sending the request on their own behalf.
- tracks and stores the number of games a user has played.
- checks whether this is the user’s first or fifth game. If so, it rewards the user with the corresponding SBT.
- rewards the user with 1 FLAP for each game played.

> 阅读[/played 端点](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L197)的代码。

### 请求 `/played` 端点

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

> 阅读[submitPlayer 函数](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/game-scene.ts#L10)的代码。

Let’s play for the first time and ensure we receive a FLAP token and an SBT. Click the Play button, fly through a pipe or two, then crash into a pipe. Everything works!

![被奖励的代币和 SBT](/img/tutorials/gamefi-flappy/sbt-rewarded.png)

Play four more times to earn the second SBT, then open your TON Space Wallet. Here are your collectibles:
![Achievements as SBT in Wallet](/img/tutorials/gamefi-flappy/sbts-in-wallet.png)

## Implementing the game shop

To set up an in-game shop, we need two components. The first is an endpoint that provides information about users' purchases. The second is a global loop that monitors user transactions and assigns game properties to item owners.

### `/purchases` 端点

该端点执行以下操作：

- receive `auth` query parameter containing Telegram Mini App initial data.
- retrieves the items a user has purchased and responds with a list of those items.

> 阅读[/purchases](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L303)端点的代码。

### 购买循环

o track user payments, we need to monitor transactions in the master wallet. Each transaction must include a message in the format `userId`:`itemId`. We will store the last processed transaction, retrieve only new ones, assign purchased properties to users based on `userId` and `itemId`, and update the last transaction hash. This process will run in an infinite loop.

> Read the [purchase loop](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L110) code.

### 客户端的商店

On the client side, we have a **Shop** button.

![进入商店按钮](/img/tutorials/gamefi-flappy/shop-enter-button.png)

When a user clicks this button, the **Shop Scene** opens. The shop contains a list of items available for purchase. Each item has a price and a Buy button. When a user clicks the Buy button, the purchase is processed.

Opening the **Shop Scene** will trigger the loading of purchased items and refresh the list every 10 seconds.

```typescript
// inside of fetchPurchases function
await fetch('http://localhost:3000/purchases?auth=' + encodeURIComponent((window as any).Telegram.WebApp.initData))
// watch for purchases
setTimeout(() => { fetchPurchases() }, 10000)
```

> 阅读[showShop 函数](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/ui.ts#L191)的代码。

Now, we need to implement the purchase process. To do this, we will first create a GameFi SDK instance and then use the `buyWithJetton` method:

```typescript
gameFi.buyWithJetton({
    amount: BigInt(price),
    forwardAmount: BigInt(1),
    forwardPayload: (window as any).Telegram.WebApp.initDataUnsafe.user.id + ':' + itemId
});
```

![要购买的游戏道具](/img/tutorials/gamefi-flappy/purchase-item.png)
![购买确认](/img/tutorials/gamefi-flappy/purchase-confirmation.png)
![道具准备使用](/img/tutorials/gamefi-flappy/purchase-done.png)

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

