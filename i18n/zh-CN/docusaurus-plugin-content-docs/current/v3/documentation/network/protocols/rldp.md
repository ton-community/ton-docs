import Feedback from '@site/src/components/Feedback';

# RLDP

Please see the implementations:

- https://github.com/ton-blockchain/ton/tree/master/rldp
- https://github.com/ton-blockchain/ton/tree/master/rldp2
- https://github.com/ton-blockchain/ton/tree/master/rldp-http-proxy

## Overview

The Reliable Large Datagram Protocol (RLDP) operates on top of the ADNL UDP protocol and is designed for transferring large data blocks. It incorporates Forward Error Correction (FEC) algorithms, which allow it to replace acknowledgment packets typically sent from the receiver back to the sender.

This capability enables more efficient data transfer between network components, although it results in increased traffic consumption.

RLDP plays a crucial role throughout the TON infrastructure. It is used for various purposes, such as downloading blocks from other nodes, transferring data to those nodes, and accessing TON websites and TON Storage.

## 协议

RLDP使用以下TL结构进行通信：

```tlb
fec.raptorQ data_size:int symbol_size:int symbols_count:int = fec.Type;
fec.roundRobin data_size:int symbol_size:int symbols_count:int = fec.Type;
fec.online data_size:int symbol_size:int symbols_count:int = fec.Type;

rldp.messagePart transfer_id:int256 fec_type:fec.Type part:int total_size:long seqno:int data:bytes = rldp.MessagePart;
rldp.confirm transfer_id:int256 part:int seqno:int = rldp.MessagePart;
rldp.complete transfer_id:int256 part:int = rldp.MessagePart;

rldp.message id:int256 data:bytes = rldp.Message;
rldp.query query_id:int256 max_answer_size:long timeout:int data:bytes = rldp.Message;
rldp.answer query_id:int256 data:bytes = rldp.Message;
```

序列化`rldp.messagePart`后，将其包裹在`adnl.message.custom`中并通过ADNL UDP发送。

RLDP transfers are utilized for sending large amounts of data. A random `transfer_id` is generated, and the data is then processed using the FEC algorithm.

当接收方收集到组装完整消息所需的`rldp.messagePart`片段时，它会将它们全部连接起来，使用FEC解码并将结果字节数组反序列化为`rldp.query`或`rldp.answer`结构之一，取决于类型（tl前缀id）。

当接收方收集到组装完整消息所需的`rldp.messagePart`片段时，它会将它们全部连接起来，使用FEC解码并将结果字节数组反序列化为`rldp.query`或`rldp.answer`结构之一，取决于类型（tl前缀id）。

### FEC

有效的正向错误校正算法用于RLDP包括RoundRobin、Online和RaptorQ。
目前用于数据编码的是[RaptorQ](https://www.qualcomm.com/media/documents/files/raptorq-technical-overview.pdf)。

Currently, [RaptorQ](https://www.qualcomm.com/media/documents/files/raptorq-technical-overview.pdf) is used for data encoding.

#### RaptorQ

The core concept of RaptorQ is the division of data into symbols, which are blocks of a fixed, predetermined size.

These blocks are organized into matrices, where discrete mathematical operations are performed. This process enables the creation of an almost limitless number of symbols from the same original data.

All the generated symbols are combined and sent to the recipient, allowing for the recovery of lost packets without the need for additional requests to the server. This method uses fewer packets than would be required if the same pieces of data were sent repeatedly.

The symbols are transmitted to the peer until they confirm that all data has been received and successfully restored (decoded) by applying the same discrete operations.

[[RaptorQ在Golang中的实现示例]](https://github.com/xssnick/tonutils-go/tree/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/rldp/raptorq)

## RLDP-HTTP

To interact with TON Sites, the RLDP (Reverse Lightweight Data Protocol) is used to wrap HTTP requests. The host sets up their site on any standard HTTP web server and runs `rldp-http-proxy` alongside it.

All incoming requests from the TON network are directed to the proxy via the RLDP protocol. The proxy then converts these requests into standard HTTP format and calls the original web server locally.

On the user's side, they launch a proxy, such as [Tonutils Proxy](https://github.com/xssnick/TonUtils-Proxy), to access the .ton sites. 为了与TON Sites互动，使用了封装在RLDP中的HTTP。托管者在任何HTTP网络服务器上运行他的站点，并在旁边启动rldp-http-proxy。TON网络中的所有请求通过RLDP协议发送到代理，代理将请求重新组装为简单的HTTP，并在本地调用原始网络服务器。

RLDP在TON基础设施中广泛使用，例如，从其他节点下载区块并向它们传输数据，访问TON网站和TON存储。

```tlb
http.header name:string value:string = http.Header;
http.payloadPart data:bytes trailer:(vector http.header) last:Bool = http.PayloadPart;
http.response http_version:string status_code:int reason:string headers:(vector http.header) no_payload:Bool = http.Response;

http.request id:int256 method:string url:string http_version:string headers:(vector http.header) = http.Response;
http.getNextPayloadPart id:int256 seqno:int max_chunk_size:int = http.PayloadPart;
```

这不是纯文本形式的HTTP，一切都包裹在二进制TL中，并由代理自己解包以发送给网络服务器或浏览器。

工作方案如下：

- 客户端发送`http.request`
- 服务器在接收请求时检查`Content-Length`头
  - 如果不为0，向客户端发送`http.getNextPayloadPart`请求
  - 接收到请求时，客户端发送`http.payloadPart` - 请求的正文片段，取决于`seqno`和`max_chunk_size`。
  - 服务器重复请求，递增`seqno`，直到从客户端接收到所有块，即直到接收到的最后一个块的`last:Bool`字段为真。
- 处理请求后，服务器发送`http.response`，客户端检查`Content-Length`头
  - 如果不为0，则向服务器发送`http.getNextPayloadPart`请求，并重复这些操作，就像客户端一样，反之亦然

## 请求TON站点

为了了解RLDP的工作原理，让我们看一个从TON站点`foundation.ton`获取数据的示例。
假设我们已经通过调用NFT-DNS合约的Get方法获得了其ADNL地址，[使用DHT确定了RLDP服务的地址和端口](https://github.com/xssnick/ton-deep-doc/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/DHT.md)，并[通过ADNL UDP连接到它](https://github.com/xssnick/ton-deep-doc/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/ADNL-UDP-Internal.md)。

为了了解 RLDP 的工作原理，我们来看一个从 TON 站点 `foundation.ton` 获取数据的示例。
假设我们已经通过调用 NFT-DNS 合约的 Get 方法获得了它的 ADNL 地址，[使用 DHT 确定了 RLDP 服务的地址和端口](https://github.com/xssnick/ton-deep-doc/blob/master/DHT.md)，并[通过 ADNL UDP 与之连接](https://github.com/xssnick/ton-deep-doc/blob/master/ADNL-UDP-Internal.md)。

### 向`foundation.ton`发送GET请求

为此，填写结构：

```tlb
http.request id:int256 method:string url:string http_version:string headers:(vector http.header) = http.Response;
```

通过填写字段序列化`http.request`：

```
e191b161                                                           -- TL ID http.request      
116505dac8a9a3cdb464f9b5dd9af78594f23f1c295099a9b50c8245de471194   -- id           = {random}
03 474554                                                          -- method       = string `GET`
16 687474703a2f2f666f756e646174696f6e2e746f6e2f 00                 -- url          = string `http://foundation.ton/`
08 485454502f312e31 000000                                         -- http_version = string `HTTP/1.1`
01000000                                                           -- headers (1)
   04 486f7374 000000                                              -- name         = Host
   0e 666f756e646174696f6e2e746f6e 00                              -- value        = foundation.ton
```

Now let's wrap our serialized `http.request` into `rldp.query` and serialize it too:

```
694d798a                                                              -- TL ID rldp.query
184c01cb1a1e4dc9322e5cabe8aa2d2a0a4dd82011edaf59eb66f3d4d15b1c5c      -- query_id        = {random}
0004040000000000                                                      -- max_answer_size = 257 KB, can be any sufficient size that we accept as headers
258f9063                                                              -- timeout (unix)  = 1670418213
34 e191b161116505dac8a9a3cdb464f9b5dd9af78594f23f1c295099a9b50c8245   -- data (http.request)
   de4711940347455416687474703a2f2f666f756e646174696f6e2e746f6e2f00
   08485454502f312e310000000100000004486f73740000000e666f756e646174
   696f6e2e746f6e00 000000
```

### 编码和发送数据包

现在我们需要将FEC RaptorQ算法应用到这些数据上。

First, we will create an encoder, which requires us to convert the resulting byte array into symbols of a fixed size. In this case, the symbol size is 768 bytes.

To achieve this, we'll divide the array into segments of 768 bytes each. If the last segment is smaller than 768 bytes, we will pad it with zero bytes to reach the required size.

Our current array is 156 bytes long, which means it will consist of only one segment. To make it 768 bytes, we need to add 612 zero bytes for padding.

Additionally, the constants chosen for the encoder depend on the data size and the symbol size. For more detailed information, you can refer to the RaptorQ documentation. However, to simplify the process and avoid complex mathematical calculations, we recommend using a pre-existing library that implements this encoding.

Please see the examples:

- 此外，编码器也会根据数据和符号的大小选择常量，您可以在RaptorQ的文档中了解更多，但为了不陷入数学丛林，我建议使用已实现此类编码的现成库。[[创建编码器的示例]](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/rldp/raptorq/encoder.go#L15) 和 [[符号编码示例]](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/raptorq/solver.go#L26)。
- 此外，编码器也会根据数据和符号的大小选择常量，您可以在RaptorQ的文档中了解更多，但为了不陷入数学丛林，我建议使用已实现此类编码的现成库。[[创建编码器的示例]](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/rldp/raptorq/encoder.go#L15) 和 [[符号编码示例]](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/raptorq/solver.go#L26)。

Symbols are encoded and transmitted in a round-robin manner. We start with an initial sequence number, `seqno`, set to 0, and increment it by 1 for each subsequent encoded packet. For instance, if we have two symbols, we first encode and send the first symbol, then increase `seqno` by 1. Next, we encode and send the second symbol and again increase `seqno` by 1. After that, we return to the first symbol and increment `seqno` (which is now 2) by another 1.

This process continues until we receive a message indicating that the peer has accepted the data.

现在，当我们创建了编码器，我们准备发送数据，为此我们将填写TL模式： To do this, we will fill in the TL schema:

```tlb
fec.raptorQ data_size:int symbol_size:int symbols_count:int = fec.Type;

rldp.messagePart transfer_id:int256 fec_type:fec.Type part:int total_size:long seqno:int data:bytes = rldp.MessagePart;
```

- `transfer_id` - 随机int256，对于同一数据传输中的所有messageParts相同。
- `fec_type`是`fec.raptorQ`。
  - `data_size` = 156
  - `symbol_size` = 768
  - `symbols_count` = 1
- `part`在我们的案例中始终为0，可用于达到大小限制的传输。
- `total_size` = 156。我们传输数据的大小。 The size of our transfer data.
- `seqno` - 对于第一个数据包将等于0，对于每个后续数据包将递增1，将用作解码和编码符号的参数。
- `data` - 我们编码的符号，大小为768字节。

序列化`rldp.messagePart`后，将其包裹在`adnl.message.custom`中并通过ADNL UDP发送。

We will send packets in a continuous loop, incrementing the `seqno` each time, until we either receive the `rldp.complete` message from the peer or reach a timeout. Once we have sent a number of packets equal to the number of our symbols, we can slow down the transmission and send additional packets, for example, once every 10 milliseconds or even less frequently.

These extra packets are intended for recovery in case of data loss, as UDP is a fast but unreliable protocol.

用户在他的一侧启动代理，例如，[Tonutils Proxy](https://github.com/xssnick/TonUtils-Proxy)，并使用`.ton` sites，所有流量都以相反的顺序包裹，请求发送到本地HTTP代理，它通过RLDP将它们发送到远程TON站点。

### 处理来自`foundation.ton`的响应

During the sending process, we can expect a response from the server. In our case, we are waiting for `rldp.answer` containing `http.response`.

在发送过程中，我们已经可以期待来自服务器的响应，在我们的例子中我们等待带有`http.response`的`rldp.answer`。它将以与请求发送时相同的方式以RLDP传输的形式发送给我们，但`transfer_id`将被反转（每个字节XOR 0xFF）。我们将收到包含`rldp.messagePart`的`adnl.message.custom`消息。

结果将是带有与我们发送的`rldp.query`中相同query_id的`rldp.answer`消息。数据必须包含`http.response`。

First, we need to extract FEC information from the initial message received during the transfer. Specifically, we are looking for the `data_size`, `symbol_size`, and `symbols_count` parameters from the `fec.raptorQ` messagePart structure.

These parameters are essential for initializing the RaptorQ decoder. [[Please see the example]](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/rldp.go#L137).

After initialization, we add the received symbols along with their `seqno` to our decoder. Once we have gathered the minimum required number of symbols, equal to `symbols_count`, we can attempt to decode the full message. If successful, we will send `rldp.complete`. [[Please see the example]](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/rldp.go#L168).

The result will be a `rldp.answer` message containing the same `query_id` as in the sent `rldp.query`. The data must include `http.response`.

```tlb
http.response http_version:string status_code:int reason:string headers:(vector http.header) no_payload:Bool = http.Response;
```

The main fields are generally straightforward, as they function similarly to those in HTTP.

One notable flag is `no_payload`. If this flag is set to true, it indicates that there is no body in the response, meaning `Content-Length` is 0. In this case, the response from the server can be considered received.

If `no_payload` is false, this means there is content in the response, and we need to retrieve it. 如果`no_payload` = false，那么响应中有内容，我们需要获取它。为此，我们需要发送一个TL模式`http.getNextPayloadPart`包裹在`rldp.query`中的请求。

```tlb
http.getNextPayloadPart id:int256 seqno:int max_chunk_size:int = http.PayloadPart;
```

`id` must match the value sent in `http.request`, `seqno` should be 0, and increment by 1 for each subsequent part. The `max_chunk_size` indicates the largest chunk size we can accept, with a typical value of 128 KB (131072 bytes).

作为回应，我们将收到：

```tlb
http.payloadPart data:bytes trailer:(vector http.header) last:Bool = http.PayloadPart;
```

如果`last` = true，那么我们已经到达尾部，我们可以将所有部分放在一起，获得完整的响应正文，例如html。 We can combine all the pieces to create a complete response body, such as HTML.

## 参考资料

_这里是[原文链接](https://github.com/xssnick/ton-deep-doc/blob/master/RLDP.md)，作者是[Oleg Baranov](https://github.com/xssnick)。_

<Feedback />

