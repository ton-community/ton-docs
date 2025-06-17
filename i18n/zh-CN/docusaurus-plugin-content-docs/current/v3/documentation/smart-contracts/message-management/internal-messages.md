import Feedback from '@site/src/components/Feedback';

# 内部消息

## 概览

智能合约通过发送所谓的**内部消息**来相互交互。当内部消息到达其预定目的地时，会代表目的地账户创建一个普通交易，并按照该账户（智能合约）的代码和持久数据的所指定的去处理内部消息。 When an internal message reaches its intended destination, an ordinary transaction is created on behalf of the destination account, and the internal message is processed as specified by the code and the persistent data of this account (smart contract).

:::info
In particular, the processing transaction can create one or several outbound internal messages, some of which may be addressed to the source address of the internal message being processed. 特别地，这个处理交易可以创建一个或多个出站内部消息，其中一些可能被发送到正在处理内部消息的来源地址。这可以用于创建简单的“客户端-服务器应用程序”，当查询被封装在一个内部消息中并发送到另一个智能合约，该智能合约处理查询并再次作为内部消息发送响应。
:::

This approach requires distinguishing whether an internal message is a:

1. **Query** - initiating an action/request
2. **Response** - replying to a query
3. **Simple transfer** - requiring no processing (like basic value transfers)

Additionally, when receiving responses, there must be a clear way to match them to their original queries.

为了实现这一目标，可以使用以下方法进行内部消息布局（注意TON区块链不对消息体施加任何限制，因此这些确实只是建议）。

### 内部消息结构

消息体可以嵌入到消息本身中，或者存储在消息引用的单独cell中，如TL-B方案片段所示：

```tlb
message$_ {X:Type} ... body:(Either X ^X) = Message X;
```

The receiving smart contract should accept at least internal messages with embedded message bodies (whenever they fit into the cell containing the message). Suppose it accepts message bodies in separate cells (using the `right` constructor of `(Either X ^X)`). In that case, the processing of the inbound message should not depend on the specific embedding option chosen for the message body. On the other hand, it is perfectly valid not to support message bodies in separate cells for simpler queries and responses.

### 内部消息体

消息体通常以以下字段开始：

- - A 32-bit (big-endian) unsigned integer `op`, identifying the `operation` to be performed, or the `method` of the smart contract to be invoked.
  - A 64-bit (big-endian) unsigned integer `query_id`, used in all query-response internal messages to indicate that a response is related to a query (the `query_id` of a response must be equal to the `query_id` of the corresponding query). If `op` is not a query-response method (e.g., it invokes a method that is not expected to send an answer), then `query_id` may be omitted.
  - The remainder of the message body is specific for each supported value of `op`.
- A 64-bit (big-endian) unsigned integer `query_id`, used in all query-response internal messages to indicate that a response is related to a query (the `query_id` of a response must be equal to the `query_id` of the corresponding query). If `op` is not a query-response method (e.g., it invokes a method that is not expected to send an answer), then `query_id` may be omitted.
- The remainder of the message body is specific for each supported value of `op`.

### 带评论的简单消息

If `op` is zero, the message is a "simple transfer message with the comment". The comment is contained in the remainder of the message body (without any `query_id` field, i.e., starting from the fifth byte). 如果`op`为零，则消息是一个“带评论的简单转移消息”。评论包含在消息体的其余部分中（没有任何`query_id`字段，即从第五个字节开始）。如果它不是以字节`0xff`开头的，则评论是一个文本评论；它可以“原样”显示给钱包的最终用户（在过滤掉无效和控制字符并检查它是一个有效的UTF-8字符串之后）。

当评论足够长，以至于不适合在一个cell中，不适合的行尾被放置在cell的第一个引用中。这个过程递归地继续，来描述不适合在两个或更多cell中的评论： This process continues recursively to describe comments that don’t fit in two or more cells:

```
root_cell("0x00000000" - 32 bit, "string" up to 123 bytes)
         ↳1st_ref("string continuation" up to 127 bytes)
                 ↳1st_ref("string continuation" up to 127 bytes)
                         ↳....
```

同样的格式用于NFT和[jetton](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#forward_payload-format)转移的评论。

For instance, users may indicate the purpose of a simple transfer from their wallet to another user’s wallet in this text field. On the other hand, if the comment begins with the byte `0xff`, the remainder is a "binary comment", which should not be displayed to the end user as text (only as a hex dump if necessary). The intended use of "binary comments" is, e.g., to contain a purchase identifier for payments in a store, to be automatically generated and processed by the store’s software.

Most smart contracts should not perform non-trivial actions or reject the inbound message on receiving a simple transfer message. 大多数智能合约在收到“简单转移消息”时不应执行非平凡的操作或拒绝入站消息。这样，一旦发现`op`为零，用于处理入站内部消息的智能合约函数（通常称为`recv_internal()`）应立即终止，并显示exit code 0，表示成功终止（例如，如果智能合约没有安装自定义异常处理程序，则会抛出异常`0`）。这将导致接收账户被记入消息转移的价，没有任何进一步的影响。 This will lead to the receiving account being credited with the value transferred by the message without any further effect.

### 带加密评论的消息

如果`op`是`0x2167da4b`，那么消息是一个“带加密评论的转移消息”。此消息的序列化方式如下： This message is serialized as follows:

输入：

- `pub_1`和`priv_1` - 发送者的Ed25519公钥和私钥，各32字节。
- `pub_2` - 接收者的Ed25519公钥，32字节。
- `msg` - 要加密的消息，任意字节字符串。`len(msg) <= 960`。 `len(msg) <= 960`.

#### 加密算法如下：

1. 使用`priv_1`和`pub_2`计算`shared_secret`。
2. 让`salt`是发送者钱包地址的[bas64url表示](https://docs.ton.org/learn/overviews/addresses#user-friendly-address)，`isBounceable=1`和`isTestnetOnly=0`。
3. 选择长度在16到31之间的字节字符串`prefix`，使得`len(prefix+msg)`可以被16整除。`prefix`的第一个字节等于`len(prefix)`，其它字节是随机的。让`data = prefix + msg`。 The first byte of `prefix` equals `len(prefix)`, and the other bytes are random. Let `data = prefix + msg`.
4. 让`msg_key`是`hmac_sha512(salt, data)`的前16字节。
5. 计算`x = hmac_sha512(shared_secret, msg_key)`。让`key=x[0:32]`和`iv=x[32:48]`。 Let `key=x[0:32]` and `iv=x[32:48]`.
6. 使用AES-256在CBC模式下，`key`和`iv`加密`data`。
7. 构造加密评论：
  1. `pub_xor = pub_1 ^ pub_2` - 32 bytes. This allows each party to decrypt the message without looking up the other’s public key.
  2. `msg_key` - 16字节。
  3. 加密的`data`。
8. The body of the message starts with the 4-byte tag `0x2167da4b`. Then, this encrypted comment is stored:
  1. 字节字符串被分成段，并存储在一系列cell`c_1,...,c_k`中（`c_1`是消息体的根）。每个cell（除了最后一个）都有一个对下一个的引用。 Each cell (except for the last one) has a reference to the next.
  2. `c_1`包含多达35字节（不包括4字节标签），其他所有cell包含多达127字节。
  3. 这种格式有以下限制：`k <= 16`，最大字符串长度为1024。

同样的格式用于NFT和jetton转移的评论，注意应使用发送者地址和接收者地址（不是jetton-钱包地址）的公钥。 Note that the public key of the sender and receiver addresses (not jetton-wallet addresses) should be used.

:::info
Learn from examples of the message encryption algorithm:

- [encryption.js](https://github.com/toncenter/ton-wallet/blob/master/src/js/util/encryption.js)
- [SimpleEncryption.cpp](https://github.com/ton-blockchain/ton/blob/master/tonlib/tonlib/keys/SimpleEncryption.cpp)
  :::

### 不带评论的简单转移消息

“不带评论的简单转移消息”具有空的body（甚至没有`op`字段）。上述考虑也适用于此类消息。注意，此类消息应将其body嵌入到消息cell中。
The above considerations apply to such messages as well. Note that such messages should have their bodies embedded into the message cell.

### 区分查询和响应消息

我们期望“查询”消息具有高位清零的`op`，即在范围`1 .. 2^31-1`内，而“响应”消息具有设置了高位的`op`，即在范围`2^31 .. 2^32-1`. 2^32-1`内。如果方法既不是查询也不是响应（因此相应的消息体不包含`query_id`字段），则应使用“查询”范围内的`op`，即`1 .. 2^31 - 1\`。

### 处理标准响应消息

有一些带有`op`等于`0xffffffff`和`0xfffffffe`的“标准”响应消息。一般来说，`op`的值从`0xfffffff0`到`0xffffffff`是为这类标准响应保留的。 In general, the values of `op` from `0xfffffff0` to `0xffffffff` are reserved for such standard responses.

- `op` = `0xffffffff` means "operation not supported". It is followed by the 64-bit `query_id` extracted from the original query and the 32-bit `op` of the original query. All but the simplest smart contracts should return this error when they receive a query with an unknown `op` in the range `1 .. 2^31-1`.
- `op` = `0xfffffffe` means "operation not allowed". It is followed by the 64-bit `query_id` of the original query, followed by the 32-bit `op` extracted from the original query.

请注意，未知的“响应”（其`op`在范围`2^31 .. 2^32-1`内）应被忽略（特别是，不应生成`op`等于`0xffffffff`的响应来回应它们），就像意外的弹回消息（带有“弹回”标志位设置）一样。

## Known op codes

:::info
Also op-code, op::code and operational code
:::

| Contract type | Hex code   | OP::code                                                                                               |
| ------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Global        | 0x00000000 | Text comment                                                                                                                           |
| Global        | 0xffffffff | Bounce                                                                                                                                 |
| Global        | 0x2167da4b | [Encrypted comment](/v3/documentation/smart-contracts/message-management/internal-messages#messages-with-encrypted-comments)           |
| Global        | 0xd53276db | Excesses                                                                                                                               |
| Elector       | 0x4e73744b | New stake                                                                                                                              |
| Elector       | 0xf374484c | New stake confirmation                                                                                                                 |
| Elector       | 0x47657424 | Recover stake request                                                                                                                  |
| Elector       | 0x47657424 | Recover stake response                                                                                                                 |
| Wallet        | 0x0f8a7ea5 | Jetton transfer                                                                                                                        |
| Wallet        | 0x235caf52 | [Jetton call to](https://testnet.tonviewer.com/transaction/1567b14ad43be6416e37de56af198ced5b1201bb652f02bc302911174e826ef7)           |
| Jetton        | 0x178d4519 | Jetton internal transfer                                                                                                               |
| Jetton        | 0x7362d09c | Jetton notify                                                                                                                          |
| Jetton        | 0x595f07bc | Jetton burn                                                                                                                            |
| Jetton        | 0x7bdd97de | Jetton burn notification                                                                                                               |
| Jetton        | 0xeed236d3 | Jetton set status                                                                                                                      |
| Jetton-Minter | 0x642b7d07 | Jetton mint                                                                                                                            |
| Jetton-Minter | 0x6501f354 | Jetton change admin                                                                                                                    |
| Jetton-Minter | 0xfb88e119 | Jetton claim admin                                                                                                                     |
| Jetton-Minter | 0x7431f221 | Jetton drop admin                                                                                                                      |
| Jetton-Minter | 0xcb862902 | Jetton change metadata                                                                                                                 |
| Jetton-Minter | 0x2508d66a | Jetton upgrade                                                                                                                         |
| Vesting       | 0xd372158c | [Top up](https://github.com/ton-blockchain/liquid-staking-contract/blob/be2ee6d1e746bd2bb0f13f7b21537fb30ef0bc3b/PoolConstants.ts#L28) |
| Vesting       | 0x7258a69b | Add whitelist                                                                                                                          |
| Vesting       | 0xf258a69b | Add whitelist response                                                                                                                 |
| Vesting       | 0xa7733acd | Send                                                                                                                                   |
| Vesting       | 0xf7733acd | 这种方法导致需要区分内部消息是作为“查询”、“响应”，还是不需要任何额外处理的（如“简单的资金转移”）。此外，当收到响应时，必须有办法理解它对应于哪个查询。                                                         |
| Dedust        | 0x9c610de3 | Dedust swap extout                                                                                                                     |
| Dedust        | 0xe3a0d482 | Dedust swap jetton                                                                                                                     |
| Dedust        | 0xea06185d | Dedust swap internal                                                                                                                   |
| Dedust        | 0x61ee542d | Swap external                                                                                                                          |
| Dedust        | 0x72aca8aa | Swap peer                                                                                                                              |
| Dedust        | 0xd55e4686 | Deposit liquidity internal                                                                                                             |
| Dedust        | 0x40e108d6 | Deposit liquidity jetton                                                                                                               |
| Dedust        | 0xb56b9598 | Deposit liquidity all                                                                                                                  |
| Dedust        | 0xad4eb6f5 | Pay out from pool                                                                                                                      |
| Dedust        | 0x474а86са | Payout                                                                                                                                 |
| Dedust        | 0xb544f4a4 | Deposit                                                                                                                                |
| Dedust        | 0x3aa870a6 | Withdrawal                                                                                                                             |
| Dedust        | 0x21cfe02b | Create vault                                                                                                                           |
| Dedust        | 0x97d51f2f | Create volatile Pool                                                                                                                   |
| Dedust        | 0x166cedee | Cancel deposit                                                                                                                         |
| StonFi        | 0x25938561 | Swap internal                                                                                                                          |
| StonFi        | 0xf93bb43f | Payment request                                                                                                                        |
| StonFi        | 0xfcf9e58f | Provide liquidity                                                                                                                      |
| StonFi        | 0xc64370e5 | Swap success                                                                                                                           |
| StonFi        | 0x45078540 | Swap success ref                                                                                                                       |

:::info
[DeDust docs](https://docs.dedust.io/docs/swaps)

[StonFi docs](https://docs.ston.fi/docs/developer-section/architecture#calls-descriptions)
:::

<Feedback />

