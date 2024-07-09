# 请求与响应

应用向钱包发送请求。钱包向应用发送响应和事件。

```tsx
type AppMessage = ConnectRequest | AppRequest;

type WalletMessage = WalletResponse | WalletEvent;
```

### 应用清单

应用需要有自己的清单，以向钱包传递元信息。清单是一个命名为 `tonconnect-manifest.json` 的 JSON 文件，遵循以下格式：

```json
{
  "url": "<app-url>",                        // required
  "name": "<app-name>",                      // required
  "iconUrl": "<app-icon-url>",               // required
  "termsOfUseUrl": "<terms-of-use-url>",     // optional
  "privacyPolicyUrl": "<privacy-policy-url>" // optional
}
```

最佳实践是将清单放置在应用的根目录中，例如 `https://myapp.com/tonconnect-manifest.json`。这允许钱包更好地处理您的应用，并改善与您的应用相关联的用户体验。
确保清单可以通过其 URL 被 GET 访问。

#### 字段描述

- `url` -- 应用 URL。将用作 DApp 标识符。点击钱包中的图标后将用来打开 DApp。建议传递不带结尾斜杠的 url，例如 'https://mydapp.com' 而不是 'https://mydapp.com/'。
- `name` -- 应用名称。可以简单，不会用作标识符。
- `iconUrl` -- 应用图标的 Url。必须是 PNG、ICO 等格式。不支持 SVG 图标。最好传递一个 180x180px 的 PNG 图标的 url。
- `termsOfUseUrl` --（可选）使用条款文档的 url。对于普通应用是可选的，但对于放置在 Tonkeeper 推荐应用列表中的应用是必需的。
- `privacyPolicyUrl` --（可选）隐私政策文档的 url。对于普通应用是可选的，但对于放置在 Tonkeeper 推荐应用列表中的应用是必需的。

### 初始化连接

应用的请求消息是 **InitialRequest**。

```tsx
type ConnectRequest = {
  manifestUrl: string;
  items: ConnectItem[], // data items to share with the app
}

// In the future we may add other personal items.
// Or, instead of the wallet address we may ask for per-service ID.
type ConnectItem = TonAddressItem | TonProofItem | ...;

type TonAddressItem = {
  name: "ton_addr";
}
type TonProofItem = {
  name: "ton_proof";
  payload: string; // arbitrary payload, e.g. nonce + expiration timestamp.
}
```

ConnectRequest 描述：

- `manifestUrl`：应用的 tonconnect-manifest.json 的链接
- `items`：与应用共享的数据项。

如果用户批准请求，钱包将以 **ConnectEvent** 消息作出响应。

```tsx
type ConnectEvent = ConnectEventSuccess | ConnectEventError;

type ConnectEventSuccess = {
  event: "connect";
  id: number; // increasing event counter
  payload: {
      items: ConnectItemReply[];
      device: DeviceInfo;   
  }
}
type ConnectEventError = {
  event: "connect_error",
  id: number; // increasing event counter
  payload: {
      code: number;
      message: string;
  }
}

type DeviceInfo = {
  platform: "iphone" | "ipad" | "android" | "windows" | "mac" | "linux";
  appName:      string; // e.g. "Tonkeeper"  
  appVersion:  string; // e.g. "2.3.367"
  maxProtocolVersion: number;
  features: Feature[]; // list of supported features and methods in RPC
                                // Currently there is only one feature -- 'SendTransaction'; 
}

type Feature = { name: 'SendTransaction', maxMessages: number } | // `maxMessages` is maximum number of messages in one `SendTransaction` that the wallet supports
        { name: 'SignData' };

type ConnectItemReply = TonAddressItemReply | TonProofItemReply ...;

// Untrusted data returned by the wallet. 
// If you need a guarantee that the user owns this address and public key, you need to additionally request a ton_proof.
type TonAddressItemReply = {
  name: "ton_addr";
  address: string; // TON address raw (`0:<hex>`)
  network: NETWORK; // network global_id
  publicKey: string; // HEX string without 0x
  walletStateInit: string; // Base64 (not url safe) encoded stateinit cell for the wallet contract
}

type TonProofItemReply = TonProofItemReplySuccess | TonProofItemReplyError;

type TonProofItemReplySuccess = {
  name: "ton_proof";
  proof: {
    timestamp: string; // 64-bit unix epoch time of the signing operation (seconds)
    domain: {
      lengthBytes: number; // AppDomain Length
      value: string;  // app domain name (as url part, without encoding) 
    };
    signature: string; // base64-encoded signature
    payload: string; // payload from the request
  }
}

type TonProofItemReplyError = {
  name: "ton_addr";
  error: {
      code: ConnectItemErrorCode;
      message?: string;
  }
}

enum NETWORK {
  MAINNET = '-239',
  TESTNET = '-3'
}
```

**连接事件错误代码：**

| code | 描述       |
| ---- | -------- |
| 0    | 未知错误     |
| 1    | 错误请求     |
| 2    | 未找到应用清单  |
| 3    | 应用清单内容错误 |
| 100  | 未知应用     |
| 300  | 用户拒绝连接   |

**连接项目错误代码：**

| code | 描述     |
| ---- | ------ |
| 0    | 未知错误   |
| 400  | 方法不被支持 |

如果钱包不支持所请求的 `ConnectItem`（例如 "ton_proof"），它必须发送对应于所请求项目的以下 ConnectItemReply 回复。
结构如下：

```ts
type ConnectItemReplyError = {
  name: "<requested-connect-item-name>";
  error: {
      code: 400;
      message?: string;
  }
}
```

### 地址证明签名（`ton_proof`）

如果请求了 `TonProofItem`，钱包证明其拥有选定账户的密钥。签名消息绑定到：

- 唯一前缀，以将消息与链上消息分开。（`ton-connect`）
- 钱包地址。
- 应用域
- 签名时间戳
- 应用的自定义载荷（其中服务器可能会放置其 nonce、cookie id、过期时间）。

```
message = utf8_encode("ton-proof-item-v2/") ++ 
          Address ++
          AppDomain ++
          Timestamp ++  
          Payload 
signature = Ed25519Sign(privkey, sha256(0xffff ++ utf8_encode("ton-connect") ++ sha256(message)))
```

其中：

- `Address` 是作为序列编码的钱包地址：
  - `workchain`：32 位有符号整数大端序；
  - `hash`：256 位无符号整数大端序；
- `AppDomain` 是 Length ++ EncodedDomainName
  - `Length` 是 utf-8 编码的应用域名长度的 32 位值（字节）
  - `EncodedDomainName` 是 `Length` 字节的 utf-8 编码应用域名
- `Timestamp` 是签名操作的 64 位 unix epoch 时间
- `Payload` 是变长的二进制字符串。

注意：载荷是变长的不受信任数据。为了避免使用不必要的长度前缀，我们简单地将其放在消息的末尾。

必须通过公钥验证签名：

1. 首先，尝试通过在 `Address` 处部署的智能合约上的 `get_public_key` get 方法获取公钥。

2. 如果智能合约还未部署，或者缺少 get 方法，您需要：

   1. 解析 `TonAddressItemReply.walletStateInit` 并从 stateInit 获取公钥。您可以将 `walletStateInit.code` 与标准钱包合约的代码进行比较，并根据找到的钱包版本解析数据。

   2. 检查 `TonAddressItemReply.publicKey` 是否等于获取到的公钥

   3. 检查 `TonAddressItemReply.walletStateInit.hash()` 是否等于 `TonAddressItemReply.address`。`.hash()` 意味着 BoC 哈希。

## 消息

- 应用发给钱包的所有消息都是操作请求。
- 钱包发给应用的消息可以是对应用请求的响应，也可以是钱包一侧用户操作触发的事件。

**可用操作：**

- sendTransaction
- signData
- disconnect

**可用事件：**

- connect
- connect_error
- disconnect

### 结构

**所有应用请求都具有以下结构（如 json-rpc 2.0）**

```tsx
interface AppRequest {
	method: string;
	params: string[];
	id: string;
}
```

其中

- `method`：操作名称（'sendTransaction', 'signMessage', ...）
- `params`：操作特定参数的数组
- `id`：递增的标识符，允许匹配请求和响应

**钱包消息是响应或事件。**

响应是格式化为 json-rpc 2.0 响应的对象。响应的 `id` 必须与请求的 id 匹配。

钱包不接受任何 id 未大于该会话的最后处理请求 id 的请求。

```tsx
type WalletResponse = WalletResponseSuccess | WalletResponseError;

interface WalletResponseSuccess {
    result: string;
    id: string;
}

interface WalletResponseError {
    error: { code: number; message: string; data?: unknown };
    id: string;
}
```

事件是一个带有 `event` 属性的对象，`event` 等于事件名称，`id` 是递增的事件计数器（**不** 关联 `request.id` 因为事件没有请求），以及包含事件附加数据的 `payload`。

```tsx
interface WalletEvent {
    event: WalletEventName;
    id: number; // increasing event counter
    payload: <event-payload>; // specific payload for each event
}

type WalletEventName = 'connect' | 'connect_error' | 'disconnect';
```

钱包在生成新事件时必须增加 `id`。（每个接下来的事件必须有的 `id` > 前一个事件的 `id`）

DApp 不接受任何 id 未大于该会话的最后处理事件 id 的事件。

### 方法

#### 签署并发送交易

应用发送 **SendTransactionRequest**：

```tsx
interface SendTransactionRequest {
	method: 'sendTransaction';
	params: [<transaction-payload>];
	id: string;
}
```

其中 `<transaction-payload>` 是具有以下属性的 JSON：

- `valid_until`（整数，可选）：unix 时间戳。该时刻之后交易将无效。
- `network`（NETWORK，可选）：DApp打算发送交易的网络（主网或测试网）。如果未设置，交易将发送到钱包当前设置的网络，但这不安全，DApp 应始终努力设置网络。如果设置了 `network` 参数，但钱包设置了不同的网络，钱包应显示警告并不允许发送此交易。
- `from`（以 `<wc>:<hex>` 格式的字符串，可选）- DApp打算从中发送交易的发送者地址。如果未设置，钱包允许用户在交易批准时选择发送者的地址。如果设置了 `from` 参数，钱包不应允许用户选择发送者的地址；如果从指定地址发送不可能，钱包应显示警告并不允许发送此交易。
- `messages`（信息数组）：1-4 条从钱包合约到其他账户的输出消息。所有消息按顺序发送出去，但 **钱包无法保证消息会按相同顺序被传递和执行**。

消息结构：

- `address`（字符串）：消息目的地
- `amount`（小数字符串）：要发送的纳币数量。
- `payload`（base64 编码的字符串，可选）：以 Base64 编码的原始cell BoC。
- `stateInit`（base64 编码的字符串，可选）：以 Base64 编码的原始cell BoC。

#### 常见情况

1. 无 payload，无 stateInit：简单转账，无消息。
2. payload 前缀为 32 个零位，无 stateInit：带文本消息的简单转账。
3. 无 payload 或前缀为 32 个零位；存在 stateInit：合约部署。

<details>
<summary>示例</summary>

```json5
{
  "valid_until": 1658253458,
  "network": "-239", // enum NETWORK { MAINNET = '-239', TESTNET = '-3'}
  "from": "0:348bcf827469c5fc38541c77fdd91d4e347eac200f6f2d9fd62dc08885f0415f",
  "messages": [
    {
      "address": "0:412410771DA82CBA306A55FA9E0D43C9D245E38133CB58F1457DFB8D5CD8892F",
      "amount": "20000000",
      "stateInit": "base64bocblahblahblah==" //deploy contract
    },{
      "address": "0:E69F10CC84877ABF539F83F879291E5CA169451BA7BCE91A37A5CED3AB8080D3",
      "amount": "60000000",
      "payload": "base64bocblahblahblah==" //transfer nft to new deployed account 0:412410771DA82CBA306A55FA9E0D43C9D245E38133CB58F1457DFB8D5CD8892F
    }
  ]
}
```

</details>

钱包以 **SendTransactionResponse** 回复：

```tsx
type SendTransactionResponse = SendTransactionResponseSuccess | SendTransactionResponseError; 

interface SendTransactionResponseSuccess {
    result: <boc>;
    id: string;
	
}

interface SendTransactionResponseError {
   error: { code: number; message: string };
   id: string;
}
```

**错误代码：**

| code | 描述      |
| ---- | ------- |
| 0    | 未知错误    |
| 1    | 错误请求    |
| 100  | 未知应用    |
| 300  | 用户拒绝了交易 |
| 400  | 方法不支持   |

#### 签署数据（实验性）

> 警告：这目前是一个实验性方法，其签名未来可能会变化

应用发送 **SignDataRequest**：

```tsx
interface SignDataRequest {
	method: 'signData';
	params: [<sign-data-payload>];
	id: string;
}
```

其中 `<sign-data-payload>` 是具有以下属性的 JSON：

- `schema_crc`（整数）：指示payload cell的布局，进而定义域分割。
- `cell`（字符串，base64 编码cell）：根据其 TL-B 定义包含任意数据。
- `publicKey`（HEX 字符串，不含0x，可选）：DApp打算用来签署数据的密钥对的公钥。如果未设置，钱包在签名时不受限制使用哪个密钥对。如果设置了 `publicKey` 参数，钱包应使用与此公钥对应的密钥对签名；如果使用指定的密钥对签名不可能，钱包应显示警告并不允许签署此数据。

签名将以以下方式计算：
`ed25519(uint32be(schema_crc) ++ uint64be(timestamp) ++ cell_hash(X), privkey)`

[查看详情](https://github.com/oleganza/TEPs/blob/datasig/text/0000-data-signatures.md)

钱包应根据 schema_crc 解码cell，并向用户显示相应数据。
如果钱包不知道 schema_crc，钱包应向用户显示危险通知/UI。

钱包以 **SignDataResponse** 回复：

```tsx
type SignDataResponse = SignDataResponseSuccess | SignDataResponseError; 

interface SignDataResponseSuccess {
    result: {
      signature: string; // base64 encoded signature 
      timestamp: string; // UNIX timestamp in seconds (UTC) at the moment on creating the signature.
    };
    id: string;
}

interface SignDataResponseError {
   error: { code: number; message: string };
   id: string;
}
```

**错误代码：**

| code | 描述      |
| ---- | ------- |
| 0    | 未知错误    |
| 1    | 错误请求    |
| 100  | 未知应用    |
| 300  | 用户拒绝了请求 |
| 400  | 方法不支持   |

#### 断开连接操作

当用户在 dApp 中断开钱包的连接时，DApp 应通知钱包以帮助钱包节省资源并删除不必要的会话。
允许钱包更新其界面到断开连接状态。

```tsx
interface DisconnectRequest {
	method: 'disconnect';
	params: [];
	id: string;
}
```

钱包以 **DisconnectResponse** 回复：

```ts
type DisconnectResponse = DisconnectResponseSuccess | DisconnectResponseError; 

interface DisconnectResponseSuccess {
    id: string;
    result: { };
}

interface DisconnectResponseError {
   error: { code: number; message: string };
   id: string;
}
```

如果断开是由 dApp 初始化的，钱包 **不应** 发出 'Disconnect' 事件。

**错误代码：**

| code | 描述    |
| ---- | ----- |
| 0    | 未知错误  |
| 1    | 错误请求  |
| 100  | 未知应用  |
| 400  | 方法不支持 |

### 钱包事件

<ins>断开连接</ins>

当用户在钱包中删除应用时触发该事件。应用必须对该事件做出反应并删除保存的会话。如果用户在应用端断开钱包连接，那么事件不会触发，会话信息仍保留在本地存储中

```tsx
interface DisconnectEvent {
	type: "disconnect",
	id: number; // increasing event counter
	payload: { }
}
```

<ins>Connect</ins>

```tsx
type ConnectEventSuccess = {
    event: "connect",
    id: number; // increasing event counter
    payload: {
        items: ConnectItemReply[];
        device: DeviceInfo;
    }
}
type ConnectEventError = {
    event: "connect_error",
    id: number; // increasing event counter
    payload: {
        code: number;
        message: string;
    }
}
```
