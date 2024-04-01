# TON HTTP API

:::tip

连接到区块链有不同的方式:

1. RPC data provider or another API: 在大多数情况下，你必须*依赖*它的稳定性和安全性。
2. **ADNL connection**: 您正在连接到[liteserver](/participation/run-nodes/liteserver)。它们可能是不可访问的，但通过一定级别的验证(在库中实现)，它们不会说谎。
3. Tonlib binary: 您还连接到 liteserver，因此所有的优点和缺点都适用，但您的应用程序还包含外部编译的动态加载库。
4. Offchain-only。这样的 sdk 允许创建和序列化 cell，然后您可以将其发送给 api。

:::

## 优点和缺点

- ✅ 习惯性且适合快速入门，这对于每个想要尝试TON的新手来说是完美的。
- ✅ 面向Web。非常适合与TON交易、智能合约进行Web交互。

- ❌ 简化。无法接收需要索引TON API的信息。
- ❌ HTTP中间件。您不能完全信任服务器响应，因为它们不包含_Merkle证明_来验证您的数据是真实的。


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


## 索引器（Indexer）

### Toncenter TON Index

索引器允许通过某些过滤器列出jetton钱包，nft，transactions，而不仅仅是检索特定的。

- 使用公共TON Index进行测试和开发，免费版或适用生产环境的高级版 - [toncenter.com/api/v3/](https://toncenter.com/api/v3/)
- 使用[Worker](https://github.com/toncenter/ton-index-worker/tree/36134e7376986c5517ee65e6a1ddd54b1c76cdba)和[TON Index API包装器](https://github.com/toncenter/ton-indexer)运行您自己的TON Index。

### GraphQL 节点

GraphQL节点也充当索引器。


* [tvmlabs.io](https://ton-testnet.tvmlabs.dev/graphql) (对于TON，测试网仅在编写时)-具有各种各样的事务/块数据，过滤它的方法等。
* [dton.io](https://dton.io/graphql) - 除了提供带有解析过的“is jeton”、“is NFT”标志的合约数据外，还允许模拟交易和接收执行跟踪。

## 其他 APIs

* [TonAPI](https://docs.tonconsole.com/tonapi/api-v2) - API旨在为用户提供简化的体验，而不必担心智能合约的底层细节。
