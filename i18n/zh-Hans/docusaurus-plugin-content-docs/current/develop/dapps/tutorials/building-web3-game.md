# TON 区块链适用于游戏

## 教程内容
在本教程中，我们将探讨如何将 TON 区块链添加到游戏中。作为示例，我们将使用 Phaser 编写的 Flappy Bird 克隆游戏，并逐步添加 GameFi 功能。在教程中，我们将使用短代码片段和伪代码来增加可读性。同时，我们还将提供指向真实代码块的链接，以帮助您更好地理解。完整的实现可以在[演示库](https://github.com/ton-community/flappy-bird)中找到。

![没有 GameFi 功能的 Flappy Bird 游戏](/img/tutorials/gamefi-flappy/no-gamefi-yet.png)

我们将实现以下功能：
- 成就奖励。让我们用 [SBTs](https://docs.ton.org/learn/glossary#sbt) 奖励我们的用户。成就系统是增加用户参与度的绝佳工具。
- 游戏货币。在 TON 区块链上，启动自己的代币（jetton）很容易。代币可以用来创建游戏内经济。我们的用户将能够赚取游戏币并在之后消费它们。
- 游戏商店。我们将为用户提供使用游戏货币或 TON 代币购买游戏内物品的可能性。

## 准备工作

### 安装 GameFi SDK
首先，我们将设置游戏环境。为此，我们需要安装 `assets-sdk`。该包旨在准备开发者集成区块链到游戏中所需的一切。该库可以从 CLI 或 Node.js 脚本中使用。在本教程中，我们选择 CLI 方法。
```sh
npm install -g @ton-community/assets-sdk@beta
```

### 创建主钱包
接下来，我们需要创建一个主钱包。主钱包是我们将用来铸造 jetton、收藏品、NFT、SBT 和接收支付的钱包。
```sh
assets-cli setup-env
```
您将被问及几个问题：

字段 | 提示
:----- | :-----
网络 | 选择 `testnet`，因为它是测试游戏。
类型 | 选择 `highload-v2` 类型的钱包，因为它是用作主钱包的最佳、最高性能选项。
存储 | 用于存储 `NFT`/`SBT` 文件的存储。可以选择 `Amazon S3`（集中式）或 `Pinata`（去中心化）。 对于本教程，让我们使用 `Pinata`，因为去中心化存储对 Web3 游戏更具说明性。
IPFS 网关 | 从中加载资产元数据的服务：`pinata`、`ipfs.io` 或输入其他服务 URL。

脚本输出您可以打开的链接，以查看创建的钱包状态。

![新钱包处于 Nonexist 状态](/img/tutorials/gamefi-flappy/wallet-nonexist-status.png)

如您所见，钱包实际上还没有创建。要想钱包真正创建，我们需要往里面存一些资金。在现实世界场景中，您可以使用任何喜欢的方式通过钱包地址存入钱包。在我们的案例中，我们将使用 [Testgiver TON Bot](https://t.me/testgiver_ton_bot)。请打开它领取 5 个测试 TON 代币。

稍后您将看到钱包中有 5 个 TON，并且其状态变为 `Uninit`。钱包准备就绪。首次使用后，其状态会变为 `Active`。

![充值后的钱包状态](/img/tutorials/gamefi-flappy/wallet-nonexist-status.png)

### 铸造游戏货币
我们打算创建游戏货币，以奖励用户：
```sh
assets-cli deploy-jetton
```
您将被问及几个问题：

字段 | 提示
:----- | :-----
名称 | 代币名称，例如 `Flappy Jetton`。
描述 | 代币描述，例如：来自 Flappy Bird 宇宙的生动数字代币。
图片 | 下载预备好的 [jetton 标志](https://raw.githubusercontent.com/ton-community/flappy-bird/ca4b6335879312a9b94f0e89384b04cea91246b1/scripts/tokens/flap/image.png) 并指定文件路径。当然，您也可以使用任何图片。
符号 | `FLAP` 或输入您想使用的任何缩写。
小数位 | 货币小数点后将有多少个零。在我们的案例中，让它为 `0`。

脚本输出您可以打开的链接，以查看创建的 jetton 状态。它将具有 `Active` 状态。钱包状态将从 `Uninit` 变为 `Active`。

![游戏货币 / jetton](/img/tutorials/gamefi-flappy/jetton-active-status.png)

### 为 SBT 创建收藏品
仅作为示例，演示游戏中我们将奖励用户玩第一次和第五次游戏。因此，我们将铸造两个收藏品，以便在用户达到相关条件（第一次和第五次玩游戏）时将 SBT 放入其中：
```sh
assets-cli deploy-nft-collection
```

字段 | 第一次游戏 | 第五次游戏
:----- | :----- | :-----
类型 | `sbt` | `sbt`
名称 | Flappy First Flight | Flappy High Fiver
描述 | 纪念您在 Flappy Bird 游戏中的首次旅行！ | 以 Flappy High Fiver NFT 庆祝您的持续游戏！
图片 | 您可以在此处下载[图片](https://raw.githubusercontent.com/ton-community/flappy-bird/article-v1/scripts/tokens/first-time/image.png) | 您可以在此处下载[图片](https://raw.githubusercontent.com/ton-community/flappy-bird/article-v1/scripts/tokens/five-times/image.png)

我们已经做好充分准备。接下来，让我们进入逻辑实现。

## 连接钱包
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
        // 如果 tonconnect-manifest.json 放在根目录，您可以跳过此选项
        manifestUrl: '/assets/tonconnect-manifest.json',
        actionsConfiguration: {
            // 已连接钱包后返回到您的 Telegram Mini App 的地址
            // 您在创建应用过程中向 BothFather 提供的 URL
            // 了解更多，请阅读 https://github.com/ton-community/flappy-bird#telegram-bot--telegram-web-app
            twaReturnUrl: URL_YOU_ASSIGNED_TO_YOUR_APP
        },
        contentResolver: {
            // 一些 NFT 市场不支持 CORS，因此我们需要使用代理
            // 您可以使用任何 URL 格式，%URL% 将被替换为实际 URL
            urlProxy: `${YOUR_BACKEND_URL}/${PROXY_URL}?url=%URL%`
        },
        // 游戏内购买的去处
        merchant: {
            // 游戏内 jetton 购买（FLAP）
            // 使用运行 `assets-cli deploy-jetton` 获得的地址
            jettonAddress: FLAP_ADDRESS,
            // 游戏内 TON 购买
            // 使用运行 `assets-cli setup-env` 获得的主钱包地址
            tonAddress: MASTER_WALLET_ADDRESS
        }
    },

})
```
> 要了解更多关于初始化选项，请阅读[库文档](https://github.com/ton-org/game-engines-sdk)。

> 要了解什么是 `tonconnect-manifest.json`，请查看 ton-connect [manifest描述](https://docs.ton.org/develop/dapps/ton-connect/manifest)。

现在我们准备创建一个连接钱包按钮。让我们在 Phaser 中创建一个 UI 场景，该场景将包含连接按钮：
```typescript
class UiScene extends Phaser.Scene {
    // 通过构造函数接收 gameFi 实例
    private gameFi: GameFi;

    create() {
        this.button = this.gameFi.createConnectButton({
            scene: this,
            // 您可以为按钮计算 UI 场景中的位置
            x: 0,
            y: 0,
            button: {
                onError: (error) => {
                    console.error(error)
                }
                // 其他选项，请阅读文档
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
        // 钱包已准备就绪
    } else {
        // 钱包已断开连接
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
- 接收带有用户钱包地址和 Mini App 启动时传递给 Mini App 的 Telegram 初始数据的正文。需要解析初始数据以提取认证数据，并确保用户只代表其自身发送请求。
- 该端点必须计算并存储用户玩的游戏数。
- 该端点必须检查是否是用户的第一次或第五次游戏，如果是，便使用相关的 SBT 奖励用户。
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

让我们玩第一次，确保我们将获得 FLAP 代币和 SBT 的奖励。点击 Play 按钮，穿过一个或两个管道，然后撞到一个管道上。好的，一切都在工作！

![被奖励的代币和 SBT](/img/tutorials/gamefi-flappy/sbt-rewarded.png)

再次玩 4 次以获得第二个 SBT，然后打开您的钱包，TON Space。这里是您的收藏品：

![钱包中的成就 SBT](/img/tutorials/gamefi-flappy/sbts-in-wallet.png)

## 实现游戏商店
要拥有游戏内商店，我们需要两个组件。第一个是提供关于用户购买的信息的端点。第二个是全局循环，以监视用户交易并为其所有者分配游戏属性。

### `/purchases` 端点
该端点执行以下操作：
- 接收带有 Telegram Mini Apps 初始数据的 `auth` get 参数。
- 该端点获取用户购买的物品并以物品列表的形式做出响应。

> 阅读[/purchases](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L303)端点的代码。

### 购买循环
要知道用户何时进行支付，我们需要监视主钱包的交易记录。每笔交易都必须包含消息 `userId`：`itemId`。我们将记住最后处理的交易，只获取新的交易，使用 `userId` 和 `itemId` 为用户分配他们购买的属性，重写最后一笔交易的哈希。这将在无限循环中工作。

> 阅读[购买循环](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L110)的代码。

### 客户端的商店

在客户端，我们有进入商店的按钮。

![进入商店按钮](/img/tutorials/gamefi-flappy/shop-enter-button.png)

当用户点击按钮时，将打开商店场景。商店场景包含用户可以购买的物品列表。每个物品都有价格和购买按钮。当用户点击购买按钮时，将进行购买。

打开商店会触发购买商品的加载，并每 10 秒更新一次：
```typescript
// 在 fetchPurchases 函数内部
await fetch('http://localhost:3000/purchases?auth=' + encodeURIComponent((window as any).Telegram.WebApp.initData))
// 监视购买
setTimeout(() => { fetchPurchases() }, 10000)
```

> 阅读[showShop 函数](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/ui.ts#L191)的代码。

现在我们需要实现购买本身。为此，我们首先将创建 GameFi SDK 实例，然后使用 `buyWithJetton` 方法：
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

## 后记

本教程到此结束！我们考虑了基本的 GameFi 功能，但 SDK 提供了更多功能，如玩家之间的转账、操作 NFT 和收藏品的工具等。将来我们会提供更多功能。

要了解所有可用的 GameFi 功能，请阅读 [ton-org/game-engines-sdk](https://github.com/ton-org/game-engines-sdk) 和 [@ton-community/assets-sdk](https://github.com/ton-community/assets-sdk) 的文档。

所以，请在[讨论区](https://github.com/ton-org/game-engines-sdk/discussions)告诉我们您的想法！

完整的实现可在 [flappy-bird](https://github.com/ton-community/flappy-bird) 库中找到。