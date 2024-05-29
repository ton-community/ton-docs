# TON ADNL API

:::tip

有不同的方式连接到区块链：

1. RPC 数据提供商或另一个 API: 在大多数情况下，您必须依赖它的稳定性和安全性。
2. **ADNL连接**：您正在连接一个[liteserver](/participate/run-nodes/liteserver)。它们可能无法访问，但通过一定程度的验证（在库中实现），它们无法作恶。
3. Tonlib 二进制: 您也在连接到liteserver，因此所有的好处和不足都适用，但您的应用程序还包含了一个在外部编译的动态加载库。
4. 链下解决。这种SDK允许创建和序列化单元格，然后您可以发送到 API。

:::

客户端使用二进制协议直接连接到 Liteservers（节点）。

客户端下载密钥块、帐户的当前状态以及他们的 **Merkle 证明**，保证收到数据的有效性。

读取操作 (如get-methods 调用) 是通过启动本地TVM 并下载和验证状态进行的。 值得注意的是，无需下载区块链的完整状态， 客户端只下载操作所需的内容。

您可以从全局配置（[Mainnet](https://ton.org/global-config.json) 或 [Testnet](https://ton.org/testnet-global.config.json) ）连接到公共 Liteservers，也可以运行自己的 [Liteserver](/participate/nodes/node-types) 并使用 [ADNL SDKs](/develop/dapps/apis/sdk#adnl-based-sdks) 进行处理。

阅读更多关于 [Merkle 证明](/develop/data-formuls/proofs)的信息[TON白皮书](https://ton.org/ton.pdf) 2.3.10, 2.3.11。

公共 liteservers（来自全局配置）的存在是为了让你快速开始使用 TON。它可用于学习 TON 编程，或用于不需要 100% 正常运行时间的应用程序和脚本。

建设生产基础设施――建议使用准备完善的基础设施：

- [设置自己的 liteserver](https://docs.ton.org/participate/run-nodes/fullnode#enable-liteserver-mode),
- 使用 Liteserver 高级提供商 [@liteserver_bot](https://t.me/liteserver_bot)

## 优缺点

- ✅ 可靠。使用带有Merkle证明哈希的API来验证传入的二进制数据。

- ✅ 安全。由于它检查Merkle证明，即使使用不受信任的轻节点也可以。

- ✅ 快速。直接连接到TON区块链节点，而不是使用HTTP中间件。

- ❌ 重复。需要更多时间才能找出问题。

- ❌ 后端优先。与 web 前端不兼容（为非 HTTP 协议构建），或需要 HTTP-ADNL 代理。

## API 参考

请求和对服务器的响应在 [TL](/develop/data-forms/tl) schema 中描述，它允许您为某个编程语言生成一个输入的接口。

[TonLib TL Schema](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl)
