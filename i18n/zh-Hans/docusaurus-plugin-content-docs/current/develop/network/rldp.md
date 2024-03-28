# RLDP

RLDP（可靠的大数据报协议）是基于ADNL UDP之上的协议，用于传输大数据块，并包括正向错误校正（FEC）算法来替代另一端的确认包。这使得在网络组件之间更高效地传输数据成为可能，但会消耗更多的流量。

RLDP在TON基础设施中广泛使用，例如，从其他节点下载区块并向它们传输数据，访问TON网站和TON存储。

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
序列化结构被包裹在`adnl.message.custom` TL模式中，并通过ADNL UDP发送。RLDP传输用于传输大数据，随机生成`transfer_id`，数据本身由FEC算法处理。生成的片段被包裹在`rldp.messagePart`结构中并发送给对方，直到对方向我们发送`rldp.complete`或超时为止。

当接收方收集到组装完整消息所需的`rldp.messagePart`片段时，它会将它们全部连接起来，使用FEC解码并将结果字节数组反序列化为`rldp.query`或`rldp.answer`结构之一，取决于类型（tl前缀id）。

### FEC

有效的正向错误校正算法用于RLDP包括RoundRobin、Online和RaptorQ。
目前用于数据编码的是[RaptorQ](https://www.qualcomm.com/media/documents/files/raptorq-technical-overview.pdf)。

#### RaptorQ
RaptorQ的本质是将数据分割成所谓的符号 - 同一预定大小的块。

从块创建矩阵，并对其应用离散数学运算。这使我们能够从相同的数据创建几乎无限数量的符号。
所有符号都混合在一起，可以在不向服务器请求额外数据的情况下恢复丢失的数据包，同时使用的数据包比我们循环发送相同片段时少。

生成的符号被发送给对方，直到他报告所有数据已收到并通过应用相同的离散运算恢复（解码）。

[[RaptorQ在Golang中的实现示例]](https://github.com/xssnick/tonutils-go/tree/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/rldp/raptorq)

## RLDP-HTTP

为了与TON Sites互动，使用了封装在RLDP中的HTTP。托管者在任何HTTP网络服务器上运行他的站点，并在旁边启动rldp-http-proxy。TON网络中的所有请求通过RLDP协议发送到代理，代理将请求重新组装为简单的HTTP，并在本地调用原始网络服务器。

用户在他的一侧启动代理，例如，[Tonutils Proxy](https://github.com/xssnick/TonUtils-Proxy)，并使用`.ton` sites，所有流量都以相反的顺序包裹，请求发送到本地HTTP代理，它通过RLDP将它们发送到远程TON站点。

RLDP中的HTTP使用TL结构实现：
```tlb
http.header name:string value:string = http.Header;
http.payloadPart data:bytes trailer:(vector http.header) last:Bool = http.PayloadPart;
http.response http_version:string status_code:int reason:string headers:(vector http.header) no_payload:Bool = http.Response;

http.request id:int256 method:string url:string http_version:string headers:(vector http.header) = http.Response;
http.getNextPayloadPart id:int256 seqno:int max_chunk_size:int = http.PayloadPart;
```
这不是纯文本形式的HTTP，一切都包裹在二进制TL中，并由代理自己解包以发送给网络服务器或浏览器。

工作方案如下：
* 客户端发送`http.request`
* 服务器在接收请求时检查`Content-Length`头
* * 如果不为0，向客户端发送`http.getNextPayloadPart`请求
* * 接收到请求时，客户端发送`http.payloadPart` - 请求的正文片段，取决于`seqno`和`max_chunk_size`。
* * 服务器重复请求，递增`seqno`，直到从客户端接收到所有块，即直到接收到的最后一个块的`last:Bool`字段为真。
* 处理请求后，服务器发送`http.response`，客户端检查`Content-Length`头
* * 如果不为0，则向服务器发送`http.getNextPayloadPart`请求，并重复这些操作，就像客户端一样，反之亦然

## 请求TON站点

为了了解RLDP的工作原理，让我们看一个从TON站点`foundation.ton`获取数据的示例。
假设我们已经通过调用NFT-DNS合约的Get方法获得了其ADNL地址，[使用DHT确定了RLDP服务的地址和端口](https://github.com/xssnick/ton-deep-doc/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/DHT.md)，并[通过ADNL UDP连接到它](https://github.com/xssnick/ton-deep-doc/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/ADNL-UDP-Internal.md)。

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

现在让我们将序列化的`http.request`包装进`rldp.query`并且也序列化它：
```
694d798a                                                              -- TL ID rldp.query
184c01cb1a1e4dc9322e5cabe8aa2d2a0a4dd82011edaf59eb66f3d4d15b1c5c      -- query_id        = {random}
0004040000000000                                                      -- max_answer_size = 257 KB, 可以是任何我们接受的足够大的大小
258f9063                                                              -- timeout (unix)  = 1670418213
34 e191b161116505dac8a9a3cdb464f9b5dd9af78594f23f1c295099a9b50c8245   -- data (http.request)
   de4711940347455416687474703a2f2f666f

756e646174696f6e2e746f6e2f00
   08485454502f312e310000000100000004486f73740000000e666f756e646174
   696f6e2e746f6e00 000000
```

### 编码和发送数据包

现在我们需要将FEC RaptorQ算法应用到这些数据上。

我们创建一个编码器，为此我们需要将结果字节数组转换为固定大小的符号。在TON中，符号大小为768字节。为此，我们将数组分割为768字节的片段。在最后一个片段中，如果它小于768字节，需要用零字节填充到所需大小。

我们的数组大小为156字节，这意味着只有1个片段，我们需要用612个零字节填充到768的大小。

此外，编码器也会根据数据和符号的大小选择常量，您可以在RaptorQ的文档中了解更多，但为了不陷入数学丛林，我建议使用已实现此类编码的现成库。[[创建编码器的示例]](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/rldp/raptorq/encoder.go#L15) 和 [[符号编码示例]](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/raptorq/solver.go#L26)。

符号按循环方式编码和发送：我们最初定义`seqno`为0，并为每个后续编码的数据包增加1。例如，如果我们有2个符号，那么我们编码并发送第一个，增加seqno 1，然后第二个并增加seqno 1，然后再次第一个并增加seqno，此时已经等于2，再增加1。如此直到我们收到对方已接受数据的消息。

现在，当我们创建了编码器，我们准备发送数据，为此我们将填写TL模式：
```tlb
fec.raptorQ data_size:int symbol_size:int symbols_count:int = fec.Type;

rldp.messagePart transfer_id:int256 fec_type:fec.Type part:int total_size:long seqno:int data:bytes = rldp.MessagePart;
```
* `transfer_id` - 随机int256，对于同一数据传输中的所有messageParts相同。
*  `fec_type`是`fec.raptorQ`。
*  * `data_size` = 156
*  * `symbol_size` = 768
*  * `symbols_count` = 1
*  `part`在我们的案例中始终为0，可用于达到大小限制的传输。
*  `total_size` = 156。我们传输数据的大小。
*  `seqno` - 对于第一个数据包将等于0，对于每个后续数据包将递增1，将用作解码和编码符号的参数。
*  `data` - 我们编码的符号，大小为768字节。

序列化`rldp.messagePart`后，将其包裹在`adnl.message.custom`中并通过ADNL UDP发送。

我们循环发送数据包，不断增加seqno，直到等待来自对方的`rldp.complete`消息，或我们在超时时停止。在我们发送了与我们的符号数量相等的数据包之后，我们可以放慢速度，例如，每10毫秒或更少发送一个附加数据包。额外的数据包用于在数据丢失的情况下恢复，因为UDP是快速但不可靠的协议。

[[实现示例]](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/rldp.go#L249)

### 处理来自`foundation.ton`的响应

在发送过程中，我们已经可以期待来自服务器的响应，在我们的例子中我们等待带有`http.response`的`rldp.answer`。它将以与请求发送时相同的方式以RLDP传输的形式发送给我们，但`transfer_id`将被反转（每个字节XOR 0xFF）。我们将收到包含`rldp.messagePart`的`adnl.message.custom`消息。

首先，我们需要从传输的第一个接收消息中获取FEC信息，特别是从`fec.raptorQ`消息部分结构中获取`data_size`，`symbol_size`和`symbols_count`参数。我们需要它们来初始化RaptorQ解码器。[[示例]](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/rldp.go#L137)

初始化后，我们将收到的符号及其`seqno`添加到解码器中，一旦我们积累了等于`symbols_count`的最小所需数量，我们就可以尝试解码完整消息。成功后，我们将发送`rldp.complete`。[[示例]](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/rldp.go#L168)

结果将是带有与我们发送的`rldp.query`中相同query_id的`rldp.answer`消息。数据必须包含`http.response`。
```tlb
http.response http_version:string status_code:int reason:string headers:(vector http.header) no_payload:Bool = http.Response;
```
对于主要字段，我认为一切都很清楚，实质与HTTP相同。这里有趣的标志位是`no_payload`，如果它为真，则响应中没有正文，（`Content-Length` = 0）。可以认为服务器的响应已经接收。

如果`no_payload` = false，那么响应中有内容，我们需要获取它。为此，我们需要发送一个TL模式`http.getNextPayloadPart`包裹在`rldp.query`中的请求。
```tlb
http.getNextPayloadPart id:int256 seqno:int max_chunk_size:int = http.PayloadPart;
```
`id`应与我们在`http.request`中发送的相同，`seqno` - 0，对于每个下一个部分+1。`max_chunk_size`是我们准备接受的最大块大小，通常使用128 KB（131072字节）。

作为回应，我们将收到：
```tlb
http.payloadPart data:bytes trailer:(vector http.header) last:Bool = http.PayloadPart;
```
如果`last` = true，那么我们已经到达尾部，我们可以将所有部分放在一起，获得完整的响应正文，例如html。

## 参考

_这里是[原文链接](https://github.com/xssnick/ton-deep-doc/blob/master/RLDP.md)，作者是[Oleg Baranov](https://github.com/xssnick)。_
