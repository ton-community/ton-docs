# TON ADNL API

客户端使用二进制协议直接连接到Liteservers（节点）。

客户端下载关键区块、账户的当前状态及其**Merkle证明**，这保证了接收数据的有效性。

读操作（如调用get-method）是通过下载并验证状态后启动本地TVM（TON虚拟机）来完成的。

无需下载区块链的完整状态，客户端只下载执行操作所需的数据。调用本地TVM也是低效的。

您可以从全局配置（[Mainnet](https://ton.org/global-config.json)或[Testnet](https://ton.org/testnet-global.config.json)）连接到公共liteservers，或运行您自己的[Liteserver](/participate/nodes/node-types)，并使用[ADNL SDKs](/develop/dapps/apis/sdk#adnl-based-sdks)来处理这些操作。

更多关于Merkle证明的信息，请参阅[TON白皮书](https://ton.org/ton.pdf) 2.3.10, 2.3.11。

## 优点和缺点

- ✅ 可靠。使用带有Merkle证明哈希的API来验证传入的二进制数据。
- ✅ 安全。由于它检查Merkle证明，即使使用不受信任的liteservers也可以。
- ✅ 快速。直接连接到TON区块链节点，而不是使用HTTP中间件。

- ❌ 复杂。需要更多时间来弄清楚事情。
- ❌ 以后端为主。不兼容Web前端（为非HTTP协议构建）。

## API 参考

对服务器的请求和响应由TL模式描述，允许您为某种编程语言生成类型化接口。

[TonLib TL模式](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl)

## 参阅
* [TON Center API](/develop/dapps/apis/toncenter)
* [SDKs](/develop/dapps/apis/sdk)
