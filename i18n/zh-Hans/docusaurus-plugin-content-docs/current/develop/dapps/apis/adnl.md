# TON ADNL API

:::tip

连接到区块链有不同的方式:
1. RPC data provider or another API: 在大多数情况下，你必须*依赖*它的稳定性和安全性。
2. **ADNL connection**: 您正在连接到[liteserver](/participation/run-nodes/liteserver)。它们可能是不可访问的，但通过一定级别的验证(在库中实现)，它们不会说谎。
3. Tonlib binary: 您还连接到liteserver，因此所有的优点和缺点都适用，但您的应用程序还包含外部编译的动态加载库。
4. Offchain-only。这样的sdk允许创建和序列化cell，然后您可以将其发送给api。

:::

客户端使用二进制协议直接连接到Liteservers（节点）。

客户端下载关键区块、账户的当前状态及其**Merkle证明**，这保证了接收数据的有效性。

读操作（如调用get-method）是通过下载并验证状态后启动本地TVM（TON虚拟机）来完成的。

无需下载区块链的完整状态，客户端只下载执行操作所需的数据。调用本地TVM也是低效的。

您可以从全局配置（[Mainnet](https://ton.org/global-config.json)或[Testnet](https://ton.org/testnet-global.config.json)）连接到公共liteservers，或运行您自己的[Liteserver](/participate/nodes/node-types)，并使用[ADNL SDKs](/develop/dapps/apis/sdk#adnl-based-sdks)来处理这些操作。

更多关于Merkle证明的信息，请参阅[TON白皮书](https://ton.org/ton.pdf) 2.3.10, 2.3.11。

公共的litesserver(来自全局配置)的存在是为了让你快速开始使用TON。它可以用于学习在TON中编程，或者用于不需要100%正常运行时间的应用程序和脚本。

对于构建生产基础设施-建议使用准备良好的基础设施:
- [建立自己的liteserver](https://docs.ton.org/participate/run-nodes/full-node#enable-liteserver-mode), 
- 使用Liteserver高级提供商 [@liteserver_bot](https://t.me/liteserver_bot)

## 优点和缺点

- ✅ 可靠。使用带有Merkle证明哈希的API来验证传入的二进制数据。
- ✅ 安全。由于它检查Merkle证明，即使使用不受信任的liteservers也可以。
- ✅ 快速。直接连接到TON区块链节点，而不是使用HTTP中间件。

- ❌ 复杂。需要更多时间来弄清楚事情。
- ❌ 以后端为主。不兼容Web前端（为非HTTP协议构建）,或需要HTTP-ADNL代理。

## API 参考

对服务器的请求和响应由[TL](/develop/data-formats/tl)模式描述，允许您为某种编程语言生成类型化接口。

[TonLib TL模式](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl)
