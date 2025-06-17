import Feedback from '@site/src/components/Feedback';

# TON 区块链适用于游戏

## 教程内容

In this tutorial, we will explore how to integrate TON Blockchain into a game. As an example, we will use a Flappy Bird clone built with Phaser and gradually add GameFi features. To improve readability, we will use short code snippets and pseudocode. Additionally, we will provide links to real code blocks for better understanding. The complete implementation can be found in the [demo repo](https://github.com/ton-community/flappy-bird).

![没有 GameFi 功能的 Flappy Bird 游戏](/img/tutorials/gamefi-flappy/no-gamefi-yet.png)

我们将实现以下功能：

- Achievements. Let’s reward our users with [SBTs](/v3/concepts/glossary#sbt). The achievement system is a great tool for increasing user engagement.
- Game currency. On the TON blockchain, it’s easy to launch your own token (jetton). The token can be used to create an in-game economy. Our users will be able to earn game coins and spend them later.
- Game shop. 游戏商店。我们将为用户提供使用游戏货币或 TON 代币购买游戏内物品的可能性。

## 准备工作

### 安装 GameFi SDK

首先，我们将设置游戏环境。为此，我们需要安装 `assets-sdk`。该包旨在准备开发者集成区块链到游戏中所需的一切。该库可以从 CLI 或 Node.js 脚本中使用。在本教程中，我们选择 CLI 方法。 This package is designed to provide developers with everything required to integrate blockchain into games. The library can be used either from the CLI or within Node.js scripts. In this tutorial, we will use the CLI approach.

```sh
npm install -g @ton-community/assets-sdk@beta
```

### 创建主钱包

Next, we need to create a master wallet. This wallet will be used to mint jettons, collections, NFTs, and SBTs, as well as to receive payments.

```sh
assets-cli setup-env
```

您将被问及几个问题：

| 字段      | 提示                                                                                                                                                                                                                                                                                                         |
| :------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 网络      | 选择 `testnet`，因为它是测试游戏。                                                                                                                                                                                                                                                                                     |
| 类型      | 选择 `highload-v2` 类型的钱包，因为它是用作主钱包的最佳、最高性能选项。                                                                                                                                                                                                                                                                |
| 存储      | Storage is used to hold `NFT`/`SB`T files. You can choose between `Amazon S3` (centralized) or `Pinata` (decentralized).  用于存储 `NFT`/`SBT` 文件的存储。可以选择 `Amazon S3`（集中式）或 `Pinata`（去中心化）。 对于本教程，让我们使用 `Pinata`，因为去中心化存储对 Web3 游戏更具说明性。 |
| IPFS 网关 | 从中加载资产元数据的服务：`pinata`、`ipfs.io` 或输入其他服务 URL。                                                                                                                                                                                                                                                               |

脚本输出您可以打开的链接，以查看创建的钱包状态。

![新钱包处于 Nonexist 状态](/img/tutorials/gamefi-flappy/wallet-nonexist-status.png)

As you can see, the wallet has not actually been created yet. To finalize the creation, we need to deposit funds into it. In a real-world scenario, you can fund the wallet however you prefer using its address. In our case, we will use the [Testgiver TON Bot](https://t.me/testgiver_ton_bot). Open it to claim 5 test TON coins.

稍后您将看到钱包中有 5 个 TON，并且其状态变为 `Uninit`。钱包准备就绪。首次使用后，其状态会变为 `Active`。 The wallet is now ready. After the first transaction, its status will change to Active.
![充值后的钱包状态](/img/tutorials/gamefi-flappy/wallet-nonexist-status.png)

### 铸造游戏货币

我们打算创建游戏货币，以奖励用户：

```sh
assets-cli deploy-jetton
```

您将被问及几个问题：

| 字段  | 提示                                                                                                                                                                                                                              |
| :-- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 名称  | 代币名称，例如 `Flappy Jetton`。                                                                                                                                                                                                        |
| 描述  | 代币描述，例如：来自 Flappy Bird 宇宙的生动数字代币。                                                                                                                                                                                               |
| 图片  | 下载预备好的 [jetton 标志](https://raw.githubusercontent.com/ton-community/flappy-bird/ca4b6335879312a9b94f0e89384b04cea91246b1/scripts/tokens/flap/image.png) 并指定文件路径。当然，您也可以使用任何图片。 Of course, you can use any image. |
| 符号  | `FLAP` 或输入您想使用的任何缩写。                                                                                                                                                                                                            |
| 小数位 | 货币小数点后将有多少个零。在我们的案例中，让它为 `0`。 Let’ it be `0` in our case.                                                                                                                                                       |

脚本输出您可以打开的链接，以查看创建的 jetton 状态。它将具有 `Active` 状态。钱包状态将从 `Uninit` 变为 `Active`。 It will have an **Active** status. The wallet’s status will change from **Uninit** to **Active**.

![游戏货币 / jetton](/img/tutorials/gamefi-flappy/jetton-active-status.png)

### 为 SBT 创建收藏品

For our demo game, we will reward users after their first and fifth games. 仅作为示例，演示游戏中我们将奖励用户玩第一次和第五次游戏。因此，我们将铸造两个收藏品，以便在用户达到相关条件（第一次和第五次玩游戏）时将 SBT 放入其中：

```sh
assets-cli deploy-nft-collection
```

| 字段 | 第一次游戏                                                                                                                    | 第五次游戏                                                                                                                    |
| :- | :----------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| 类型 | `sbt`                                                                                                                    | `sbt`                                                                                                                    |
| 名称 | Flappy First Flight                                                                                                      | Flappy High Fiver                                                                                                        |
| 描述 | 纪念您在 Flappy Bird 游戏中的首次旅行！                                                                                               | 以 Flappy High Fiver NFT 庆祝您的持续游戏！                                                                                        |
| 图片 | 您可以在此处下载[图片](https://raw.githubusercontent.com/ton-community/flappy-bird/article-v1/scripts/tokens/first-time/image.png) | 您可以在此处下载[图片](https://raw.githubusercontent.com/ton-community/flappy-bird/article-v1/scripts/tokens/five-times/image.png) |

我们已经做好充分准备。接下来，让我们进入逻辑实现。

## 连接钱包

The process begins with the user connecting their wallet. Let's integrate wallet connectivity.

一切从用户连接其钱包开始。因此，让我们添加钱包连接集成。要从客户端操作区块链，我们需要为 Phaser 安装 GameFi SDK：

```sh
npm install --save @ton/phaser-sdk@beta
```

现在，让我们设置 GameFi SDK 并创建它的实例：

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

Next, we are ready to create a **Wallet Connect** button. 现在我们准备创建一个连接钱包按钮。让我们在 Phaser 中创建一个 UI 场景，该场景将包含连接按钮：

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

要监控用户何时连接或断开其钱包，让我们使用以下代码片段：

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

阅读如何实现[游戏 UI 管理](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/index.ts#L50)。

现在我们已经连接了用户钱包，可以继续进行了。

![连接钱包按钮](/img/tutorials/gamefi-flappy/wallet-connect-button.png)
![确认钱包连接](/img/tutorials/gamefi-flappy/wallet-connect-confirmation.png)
![钱包已连接](/img/tutorials/gamefi-flappy/wallet-connected.png)

## 实现成就和奖励

为了实现成就和奖励系统，我们需要准备一个端点，每个用户尝试时都会请求该端点。

### `/played` 端点

我们需要创建一个 `/played` 端点，该端点必须完成以下操作：

- 接收带有用户钱包地址和 Mini App 启动时传递给 Mini App 的 Telegram 初始数据的正文。需要解析初始数据以提取认证数据，并确保用户只代表其自身发送请求。 The initial data must be parsed to extract authentication details and verify that the user is sending the request on their own behalf.
- 该端点必须计算并存储用户玩的游戏数。
- 该端点必须检查是否是用户的第一次或第五次游戏，如果是，便使用相关的 SBT 奖励用户。 If so, it rewards the user with the corresponding SBT.
- 该端点必须为每次游戏奖励用户 1 FLAP。

> 阅读[/played 端点](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L197)的代码。

### 请求 `/played` 端点

每次小鸟撞到管道或掉落时，客户端代码必须调用 `/played` 端点并传递正确的正文：

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

让我们玩第一次，确保我们将获得 FLAP 代币和 SBT 的奖励。点击 Play 按钮，穿过一个或两个管道，然后撞到一个管道上。好的，一切都在工作！ Click the Play button, fly through a pipe or two, then crash into a pipe. Everything works!

![被奖励的代币和 SBT](/img/tutorials/gamefi-flappy/sbt-rewarded.png)

再次玩 4 次以获得第二个 SBT，然后打开您的钱包，TON Space。这里是您的收藏品： ![钱包中的成就 SBT](/img/tutorials/gamefi-flappy/sbts-in-wallet.png)

## 实现游戏商店

To set up an in-game shop, we need two components. The first is an endpoint that provides information about users' purchases. The second is a global loop that monitors user transactions and assigns game properties to item owners.

### `/purchases` 端点

该端点执行以下操作：

- 接收带有 Telegram Mini Apps 初始数据的 `auth` get 参数。
- 该端点获取用户购买的物品并以物品列表的形式做出响应。

> 阅读[/purchases](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L303)端点的代码。

### 购买循环

o track user payments, we need to monitor transactions in the master wallet. Each transaction must include a message in the format `userId`:`itemId`. We will store the last processed transaction, retrieve only new ones, assign purchased properties to users based on `userId` and `itemId`, and update the last transaction hash. This process will run in an infinite loop.

> 阅读[购买循环](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L110)的代码。

### 客户端的商店

在客户端，我们有进入商店的按钮。

![进入商店按钮](/img/tutorials/gamefi-flappy/shop-enter-button.png)

When a user clicks this button, the **Shop Scene** opens. The shop contains a list of items available for purchase. Each item has a price and a Buy button. When a user clicks the Buy button, the purchase is processed.

打开商店会触发购买商品的加载，并每 10 秒更新一次：

```typescript
// inside of fetchPurchases function
await fetch('http://localhost:3000/purchases?auth=' + encodeURIComponent((window as any).Telegram.WebApp.initData))
// watch for purchases
setTimeout(() => { fetchPurchases() }, 10000)
```

> 阅读[showShop 函数](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/ui.ts#L191)的代码。

Now, we need to implement the purchase process. 现在我们需要实现购买本身。为此，我们首先将创建 GameFi SDK 实例，然后使用 `buyWithJetton` 方法：

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

也可以用 TON 代币支付：

```typescript
import { toNano } from '@ton/phaser-sdk'

gameFi.buyWithTon({
    amount: toNano(0.5),
    comment: (window as any).Telegram.WebApp.initDataUnsafe.user.id + ':' + 1
});
```

## Afterword

That’s it for this tutorial! 本教程到此结束！我们考虑了基本的 GameFi 功能，但 SDK 提供了更多功能，如玩家之间的转账、操作 NFT 和收藏品的工具等。将来我们会提供更多功能。 More features will be introduced in the future.

要了解所有可用的 GameFi 功能，请阅读 [ton-org/game-engines-sdk](https://github.com/ton-org/game-engines-sdk) 和 [@ton-community/assets-sdk](https://github.com/ton-community/assets-sdk) 的文档。

所以，请在[讨论区](https://github.com/ton-org/game-engines-sdk/discussions)告诉我们您的想法！

完整的实现可在 [flappy-bird](https://github.com/ton-community/flappy-bird) 库中找到。

<Feedback />

