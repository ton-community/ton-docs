# 基于 TON HTTP 的APIs

:::tip

有不同的方式连接到区块链：

1. **RPC 数据提供商或其他方 API**：在大多数情况下，您不得不*依赖*其稳定性和安全性。
2. ADNL 连接：您需要连接到一个 [轻服务器](/participate/run-nodes/liteserver)。它们可能有些难懂，但其中的内容经过了一定程度的验证 (已在库实现)，可以保证其真实性。
3. Tonlib 库: 同样是连接到轻服务器，因此所有优点和缺点都存在，此外您的应用程序还包含一个外部编译的动态加载库。
4. 仅链下。此类 SDK 可以创建cells并将其序列化，然后发送给 API。

:::

## 优点和缺点

- ✅ 习惯性且适合快速入门，这对于每个想要尝试TON的新手来说是完美的。

- ✅ 面向Web。非常适合与TON交易、智能合约进行Web交互。

- ❌ 简化。无法接收需要索引TON API的信息。

- ❌ HTTP中间件。您不能完全信任服务器响应，因为它们不包含_Merkle证明_来验证您的数据是真实的。

## RPC 节点

- [GetBlock节点](https://getblock.io/nodes/ton/) — 使用GetBlocks节点连接和测试您的dApps。
- [TON Access](https://www.orbs.com/ton-access/) - 开放网络(TON)的 HTTP API。

## Indexer

- [QuickNode](https://www.quicknode.com/chains/ton?utm_source=ton-docs) -- 领先的区块链节点提供商，通过智能 DNS 路由提供最快的访问速度，实现优化的全球覆盖和负载平衡的可扩展性。
- [Chainstack](https://chainstack.com/build-better-with-ton/) -- 多个地区的 RPC 节点和索引器，具有地理和负载平衡功能。
- [Tatum](https://docs.tatum.io/reference/rpc-ton) — 一个简单易用的平台访问 TON RPC 节点，上面拥有强大的开发者工具。
- [GetBlock节点](https://getblock.io/nodes/ton/) — 使用GetBlocks节点连接和测试您的dApps。
- [TON Access](https://www.orbs.com/ton-access/) - 开放网络(TON)的 HTTP API。
- [Toncenter](https://toncenter.com/api/v2/) - 由社区主办的关于API的快速启动项目(获得一个API密钥 [@tonapibot](https://t.me/tonapibot))。
- [ton-node-docker](https://github.com/fmira21/ton-node-docker) - 使用了Docker全节点和Toncenter API。
- [toncenter/ton-http-api](https://github.com/toncenter/ton-http-api) — 运行您自己的RPC节点。
- [nownodes.io](https://nownodes.io/nodes) — 通过API使用NOWNodes全节点和blockbook Explorers。
- [Chainbase](https://chainbase.com/chainNetwork/TON) — 为TON设计开发了对应的节点API和数据基础设施。

## Indexer

### Toncenter TON Index

索引器允许列出jetton钱包、NFT、某些过滤器的交易，而不仅仅是检索特定的交易。

- 使用公共TON Index: 用其进行开发和测试完全免费，[高级版](https://t.me/tonapibot)可用于生产环境 - [toncenter.com/api/v3/](https://toncenter.com/api/v3/)。
- 使用[Worker](https://github.com/toncenter/ton-index-worker/tree/36134e7376986c5517ee65e6a1ddd54b1c76cdba)和[TON Index API wrapper](https://github.com/toncenter/ton-indexer)运行您自己的TON Index。

### Anton

Anton 采用 Go 语言编写，是一款开源的开放网络区块链索引器，采用 Apache License 2.0 许可。Anton 旨在为开发人员访问和分析区块链数据提供可扩展的灵活解决方案。我们的目标是帮助开发者和用户了解区块链是如何被使用的，并让开发者可以在我们的索引器中添加他们自己的合约和自定义消息模式。

- [TonAPI](https://docs.tonconsole.com/tonapi/api-v2)--旨在为用户提供简化体验的应用程序接口，无需担心智能合约的低层级细节。
- [Swagger API 文档](https://github.com/tonindexer/anton)，[API 查询示例](https://github.com/tonindexer/anton/blob/main/docs/API.md) - 要使用，请学习文档和示例
- [Apache Superset](https://github.com/tonindexer/anton) - 用于查看数据

### GraphQL Nodes

GraphQL 节点也可充当索引器。

- [dton.io](https://dton.io/graphql) - 不仅为合约数据提供了一系列诸如"is jetton"、"is NFT"的标记参数，还可以模拟交易和对接收执行进行追踪。

## 其他APIs

- [TonAPI](https://docs.tonconsole.com/tonapi) -- 旨在为用户提供简化体验的应用程序接口，无需担心智能合约的低级细节。
