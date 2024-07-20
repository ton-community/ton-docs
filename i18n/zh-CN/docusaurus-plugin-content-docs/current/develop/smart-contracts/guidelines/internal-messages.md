# 内部消息

## 概览

智能合约通过发送所谓的**内部消息**来相互交互。当内部消息到达其预定目的地时，会代表目的地账户创建一个普通交易，并按照该账户（智能合约）的代码和持久数据的所指定的去处理内部消息。

:::info
特别地，这个处理交易可以创建一个或多个出站内部消息，其中一些可能被发送到正在处理内部消息的来源地址。这可以用于创建简单的“客户端-服务器应用程序”，当查询被封装在一个内部消息中并发送到另一个智能合约，该智能合约处理查询并再次作为内部消息发送响应。
:::

这种方法导致需要区分内部消息是作为“查询”、“响应”，还是不需要任何额外处理的（如“简单的资金转移”）。此外，当收到响应时，必须有办法理解它对应于哪个查询。

为了实现这一目标，可以使用以下方法进行内部消息布局（注意TON区块链不对消息体施加任何限制，因此这些确实只是建议）。

### 内部消息结构

消息体可以嵌入到消息本身中，或者存储在消息引用的单独cell中，如TL-B方案片段所示：

```tlb
message$_ {X:Type} ... body:(Either X ^X) = Message X;
```

接收智能合约应至少接受嵌入消息体的内部消息（只要它们适合包含消息的 cell）。如果它接受单独cell中的消息体（使用`(Either X ^X)`的`right`构造函数），那么入站消息的处理不应依赖于消息体的特定嵌入选项。另一方面，对于更简单的查询和响应来说，完全可以不支持单独cell中的消息体。

### 内部消息体

消息体通常以以下字段开始：

```
* A 32-bit (big-endian) unsigned integer `op`, identifying the `operation` to be performed, or the `method` of the smart contract to be invoked.
* A 64-bit (big-endian) unsigned integer `query_id`, used in all query-response internal messages to indicate that a response is related to a query (the `query_id` of a response must be equal to the `query_id` of the corresponding query). If `op` is not a query-response method (e.g., it invokes a method that is not expected to send an answer), then `query_id` may be omitted.
* The remainder of the message body is specific for each supported value of `op`.
```

### 带评论的简单消息

如果`op`为零，则消息是一个“带评论的简单转移消息”。评论包含在消息体的其余部分中（没有任何`query_id`字段，即从第五个字节开始）。如果它不是以字节`0xff`开头的，则评论是一个文本评论；它可以“原样”显示给钱包的最终用户（在过滤掉无效和控制字符并检查它是一个有效的UTF-8字符串之后）。

当评论足够长，以至于不适合在一个cell中，不适合的行尾被放置在cell的第一个引用中。这个过程递归地继续，来描述不适合在两个或更多cell中的评论：

```
root_cell("0x00000000" - 32 bit, "string" up to 123 bytes)
         ↳1st_ref("string continuation" up to 127 bytes)
                 ↳1st_ref("string continuation" up to 127 bytes)
                         ↳....
```

同样的格式用于NFT和[jetton](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#forward_payload-format)转移的评论。

例如，用户可以在此文本字段中指明从他们的钱包向另一个用户的钱包进行简单转移的目的。另一方面，如果评论以字节`0xff`开头，则其余部分是一个“二进制评论”，不应将其作为文本显示给最终用户（如有必要，只能作为十六进制转储显示）。"二进制评论"的预期用途是，例如，包含商店支付中的购买标识符，由商店的软件自动生成和处理。

大多数智能合约在收到“简单转移消息”时不应执行非平凡的操作或拒绝入站消息。这样，一旦发现`op`为零，用于处理入站内部消息的智能合约函数（通常称为`recv_internal()`）应立即终止，并显示exit code 0，表示成功终止（例如，如果智能合约没有安装自定义异常处理程序，则会抛出异常`0`）。这将导致接收账户被记入消息转移的价，没有任何进一步的影响。

### 带加密评论的消息

如果`op`是`0x2167da4b`，那么消息是一个“带加密评论的转移消息”。此消息的序列化方式如下：

输入：

- `pub_1`和`priv_1` - 发送者的Ed25519公钥和私钥，各32字节。
- `pub_2` - 接收者的Ed25519公钥，32字节。
- `msg` - 要加密的消息，任意字节字符串。`len(msg) <= 960`。

加密算法如下：

1. 使用`priv_1`和`pub_2`计算`shared_secret`。
2. 让`salt`是发送者钱包地址的[bas64url表示](https://docs.ton.org/learn/overviews/addresses#user-friendly-address)，`isBounceable=1`和`isTestnetOnly=0`。
3. 选择长度在16到31之间的字节字符串`prefix`，使得`len(prefix+msg)`可以被16整除。`prefix`的第一个字节等于`len(prefix)`，其它字节是随机的。让`data = prefix + msg`。
4. 让`msg_key`是`hmac_sha512(salt, data)`的前16字节。
5. 计算`x = hmac_sha512(shared_secret, msg_key)`。让`key=x[0:32]`和`iv=x[32:48]`。
6. 使用AES-256在CBC模式下，`key`和`iv`加密`data`。
7. 构造加密评论：
   1. `pub_xor = pub_1 ^ pub_2` - 32字节。这允许每一方在不查询对方公钥的情况下解密消息。
   2. `msg_key` - 16字节。
   3. 加密的`data`。
8. 消息体以4字节标签`0x2167da4b`开始。然后存储这个加密评论：
   1. 字节字符串被分成段，并存储在一系列cell`c_1,...,c_k`中（`c_1`是消息体的根）。每个cell（除了最后一个）都有一个对下一个的引用。
   2. `c_1`包含多达35字节（不包括4字节标签），其他所有cell包含多达127字节。
   3. 这种格式有以下限制：`k <= 16`，最大字符串长度为1024。

同样的格式用于NFT和jetton转移的评论，注意应使用发送者地址和接收者地址（不是jetton-钱包地址）的公钥。

:::info
Learn from examples of the message encryption algorithm:

- [encryption.js](https://github.com/toncenter/ton-wallet/blob/master/src/js/util/encryption.js)
- [SimpleEncryption.cpp](https://github.com/ton-blockchain/ton/blob/master/tonlib/tonlib/keys/SimpleEncryption.cpp)
  :::

### 不带评论的简单转移消息

“不带评论的简单转移消息”具有空的body（甚至没有`op`字段）。上述考虑也适用于此类消息。注意，此类消息应将其body嵌入到消息cell中。

### 区分查询和响应消息

我们期望“查询”消息具有高位清零的`op`，即在范围`1 .. 2^31-1`内，而“响应”消息具有设置了高位的`op`，即在范围`2^31 .. 2^32-1`内。如果方法既不是查询也不是响应（因此相应的消息体不包含`query_id`字段），则应使用“查询”范围内的`op`，即`1 .. 2^31 - 1`。

### 处理标准响应消息

有一些带有`op`等于`0xffffffff`和`0xfffffffe`的“标准”响应消息。一般来说，`op`的值从`0xfffffff0`到`0xffffffff`是为这类标准响应保留的。

```
* `op` = `0xffffffff` means "operation not supported". It is followed by the 64-bit `query_id` extracted from the original query, and the 32-bit `op` of the original query. All but the simplest smart contracts should return this error when they receive a query with an unknown `op` in the range `1 .. 2^31-1`.
* `op` = `0xfffffffe` means "operation not allowed". It is followed by the 64-bit `query_id` of the original query, followed by the 32-bit `op` extracted from the original query.
```

请注意，未知的“响应”（其`op`在范围`2^31 .. 2^32-1`内）应被忽略（特别是，不应生成`op`等于`0xffffffff`的响应来回应它们），就像意外的弹回消息（带有“弹回”标志位设置）一样。
