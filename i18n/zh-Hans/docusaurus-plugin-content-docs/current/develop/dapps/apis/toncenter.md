# TON HTTP API

_标准HTTP JSON RPC，类似于其他区块链API。_

## RPC 节点

:::tip
[GetBlock节点](https://getblock.io/nodes/ton/) - 🚀 仅需几次点击即可立即安装节点。
:::

* [GetBlock节点](https://getblock.io/nodes/ton/) — 使用GetBlocks节点连接和测试您的dApps
* [TON Access](https://www.orbs.com/ton-access/) - The Open Network (TON)的HTTP API。
* [Toncenter](https://toncenter.com/api/v2/) — 社区托管的项目，用于API快速入门。（获取API密钥 [@tonapibot](https://t.me/tonapibot)）
* [ton-node-docker](https://github.com/fmira21/ton-node-docker) - [⭐新] Docker全节点和Toncenter API。
* [toncenter/ton-http-api](https://github.com/toncenter/ton-http-api) — 运行您自己的RPC节点。
* [nownodes.io](https://nownodes.io/nodes) — 通过API使用NOWNodes全节点和blockbook探索器。
* [Chainbase](https://chainbase.com/chainNetwork/TON) — The Open Network的节点API和数据基础设施。

## 优点和缺点

- ✅ 习惯性且适合快速入门，这对于每个想要尝试TON的新手来说是完美的。
- ✅ 面向Web。非常适合与TON交易、智能合约进行Web交互。

- ❌ 简化。无法接收需要索引TON API的信息。
- ❌ HTTP中间件。您不能完全信任服务器响应，因为它们不包含_Merkle证明_来验证您的数据是真实的。

### Toncenter API


##### Toncenter TON Index
- 使用公共TON Index进行测试和开发，免费版或适用生产环境的高级版 - [toncenter.com/api/v3/](https://toncenter.com/api/v3/)
- 使用[Worker](https://github.com/toncenter/ton-index-worker/tree/36134e7376986c5517ee65e6a1ddd54b1c76cdba)和[TON Index API包装器](https://github.com/toncenter/ton-indexer)运行您自己的TON Index。

#### Toncenter HTTP API
客户端连接到[ton-http-api](https://github.com/toncenter/ton-http-api)服务器，该服务器使用TonLib将请求代理到liteserver（节点）。

您可以连接到公共的[toncenter.com](https://toncenter.com)或运行您自己的http-api实例。


## 获取 API 密钥

要使用公共TonCenter API，您需要一个API密钥：

* 获取Mainnet和Testnet的API密钥：[@tonapibot](https://t.me/tonapibot)

## 参阅
* [TON ADNL API](/develop/dapps/apis/adnl)
* [SDKs](/develop/dapps/apis/sdk)
