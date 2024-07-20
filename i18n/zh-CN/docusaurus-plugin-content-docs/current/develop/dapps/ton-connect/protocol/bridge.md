# Bridge API

Bridge 是一种传输机制，用于从应用程序到钱包，以及反向传达消息。

- **Bridge 由钱包提供商维护**。应用开发者不需要选择或构建 bridge。每个钱包的 bridge 都列在 [wallets-list](https://github.com/ton-blockchain/wallets-list) 配置中。
- **消息是端到端加密的。** Bridge 无法看到应用或钱包的内容或长期标识符。
- **通讯是对称的。** Bridge 不区分应用和钱包：两者都仅是客户端。
- Bridge 为每个接收者的 **客户端 ID** 保持不同的消息队列。

Bridge 有两种形式：

- [HTTP Bridge](#http-bridge)：用于外部应用和服务。
- [JS Bridge](#js-bridge)：用于在钱包中打开的应用；或钱包是浏览器扩展时。

## HTTP Bridge

客户端 ID 为 **A** 的客户端连接到 bridge 以监听传入请求。

\*\*客户端 ID 是半私有的：\*\*应用和钱包不应与其他实体共享他们的 ID，以避免他们的消息被意外删除。

**客户端可以订阅多个客户端 ID** - 在这种情况下，它应该用逗号分隔ID进行枚举。例如：`?client_id=<A1>,<A2>,<A3>`

```tsx
request
    GET /events?client_id=<to_hex_str(A)>

    Accept: text/event-stream
```

**第二次（或其他任何时间）订阅 bridge**

```tsx
request
    GET /events?client_id=<to_hex_str(A)>&last_event_id=<lastEventId>

    Accept: text/event-stream
```

**lastEventId** – 钱包通过 bridge 获得的最后一个 SSE 事件的 eventId。在这种情况下，钱包将获取所有在上次连接后发生的事件。

从客户端 A 发送消息到客户端 B。如果 ttl 太高，bridge 返回错误。

```tsx
request
    POST /message?client_id=<to_hex_str(A)>?to=<to_hex_str(B)>&ttl=300&topic=<sendTransaction|signData>

    body: <base64_encoded_message>
```

`topic` [可选] 查询参数可以被 bridge 用来将推送通知发送到钱包。如果给出参数，它必须对应于加密的 `message` 内部调用的 RPC 方法。

Bridge 将消息缓冲至 TTL（秒），但一旦接收者收到消息就会将其删除。

如果 TTL 超出 bridge 服务器的硬限制，它应该响应 HTTP 400。Bridges 应该支持至少 300 秒 TTL。

当 bridge 从客户端 `A` 接收到致客户端 `B` 的消息 `base64_encoded_message` 时，它生成一个消息 `BridgeMessage`：

```js
{
  "from": <to_hex_str(A)>,
  "message": <base64_encoded_message>
}
```

并通过 SSE 连接发送给客户端 B

```js
resB.write(BridgeMessage)
```

### 检测信号

为了保持连接，bridge 服务器应定期向 SSE 频道发送“heartbeat”消息。客户端应忽略此类消息。因此，bridge 的 heartbeat 消息是一个包含单词 `heartbeat` 的字符串。

## 通用链接

当应用初始化连接时，它直接通过二维码或通用链接发送给钱包。

```bash
https://<wallet-universal-url>?
                               v=2&
                               id=<to_hex_str(A)>&
                               r=<urlsafe(json.stringify(ConnectRequest))>&
                               ret=back
```

参数 **v** 指定协议版本。不受支持的版本不会被钱包接受。

参数 **id** 指定应用的客户端 ID，以十六进制编码（不带 '0x' 前缀）。

参数 **r** 指定 URL 安全的 json [ConnectRequest](/develop/dapps/ton-connect/protocol/requests-responses#initiating-connection)。

参数 **ret** （可选）指定用户签名/拒绝请求后深链接的返回策略。

- 'back'（默认）意味着返回到初始化深链接跳转的应用（例如，浏览器，本地应用等），
- 'none' 意味着用户操作后不跳转；
- 一个 URL：完成用户操作后钱包将打开此 URL。请注意，如果您的应用是网页，您不应传递您的应用的 URL。此选项应用于本地应用，以解决可能的操作系统特定问题与 `'back'` 选项。

`ret` 参数应该支持空的深链接 -- 它可能用于指定完成其他操作确认后（发送交易，签名原始数据等）的钱包行为。

```bash
https://<wallet-universal-url>?ret=back
```

链接可以嵌入在二维码中或直接点击。

初始请求是未加密的，因为 (1) 尚未传递个人数据，(2) 应用甚至不知道钱包的身份。

### 统一深链接 `tc`

除了其自己的通用链接外，钱包还必须支持统一深链接。

这允许应用创建一个单一的二维码，可以用来连接到任何钱包。

更具体地说，钱包必须支持 `tc://` 深链接以及它自己的 `<wallet-universal-url>`。

因此，钱包必须处理以下 `连接请求`：

```bash
tc://?
       v=2&
       id=<to_hex_str(A)>&
       r=<urlsafe(json.stringify(ConnectRequest))>&
       ret=back
```

## JS bridge

通过注入的绑定 `window.<wallet-js-bridge-key>.tonconnect` 供嵌入式应用使用。

`wallet-js-bridge-key` 可以在 [wallets list](https://github.com/ton-blockchain/wallets-list) 中指定

JS bridge 在与钱包和应用相同的设备上运行，因此通信未加密。

应用直接处理明文请求和响应，无需会话密钥和加密。

```tsx
interface TonConnectBridge {
    deviceInfo: DeviceInfo; // see Requests/Responses spec
    walletInfo?: WalletInfo;
    protocolVersion: number; // max supported Ton Connect version (e.g. 2)
    isWalletBrowser: boolean; // if the page is opened into wallet's browser
    connect(protocolVersion: number, message: ConnectRequest): Promise<ConnectEvent>;
    restoreConnection(): Promise<ConnectEvent>;
    send(message: AppRequest): Promise<WalletResponse>;
    listen(callback: (event: WalletEvent) => void): () => void;
}
```

就像 HTTP bridge 一样，bridge 的钱包端在用户确认会话之前不接收应用请求，除了 [ConnectRequest](/develop/dapps/ton-connect/protocol/requests-responses#initiating-connection) 外。技术上，消息是从 webview 发送到 bridge 控制器的，但它们被静默忽略了。

SDK 在实现中支持 **autoconnect()** 和 **connect()** 作为尝试建立连接的静默和非静默尝试。

### walletInfo (可选)

代表钱包元数据。即使钱包未列在 [wallets-list.json](https://github.com/ton-blockchain/wallets-list) 中，也可以定义它，使注入式钱包能够与 TonConnect 一起工作。

钱包元数据格式：

```ts
interface WalletInfo {
    name: string;
    image: <png image url>;
    tondns?:  string;
    about_url: <about page url>;
}
```

详细属性描述：https://github.com/ton-blockchain/wallets-list#entry-format。

如果定义了 `TonConnectBridge.walletInfo` 并且钱包列在 [wallets-list.json](https://github.com/ton-blockchain/wallets-list) 中，`TonConnectBridge.walletInfo` 的属性将覆盖 wallets-list.json 中相应钱包的属性。

### connect()

发起连接请求，这类似于使用HTTP时的QR/link

如果应用先前已针对当前账户获得批准 - 使用 ConnectEvent 静默连接。否则向用户显示确认对话框。

您不应在没有明确用户操作（例如，连接按钮点击）的情况下使用 `connect` 方法。如果您想自动尝试恢复先前的连接，您应该使用 `restoreConnection` 方法。

### restoreConnection()

尝试恢复先前的连接。

如果应用先前已针对当前账户获得批准 - 使用新的 `ConnectEvent` 静默连接，其中只有 `ton_addr` 数据项。

否则返回 `ConnectEventError`，错误代码为 100（未知的应用）。

### send()

发送 [消息](/develop/dapps/ton-connect/protocol/requests-responses#messages) 到 bridge，不包括ConnectRequest（使用HTTP网桥时进入QR码，使用JS Bridge时进入连接）。
直接与 WalletResponse一起返回promise，因此您不需要等待 `listen` 的响应；

### listen()

为来自钱包的事件注册监听器。

返回取消订阅函数。

目前，只有 `disconnect` 事件可用。后续将有切换账户事件和其他钱包事件。
