# ADNL UDP - 节点间通信

ADNL通过UDP用于节点和TON组件之间的通信。它是一个低层级协议，其他更高级的TON协议（如DHT和RLDP）都是在其基础上运行的。在这篇文章中，我们将了解ADNL通过UDP在节点之间进行基本通信的工作方式。

与ADNL通过TCP不同，在UDP实现中，握手以不同的形式发生，并且使用了通道的额外层，但其他原则相似：
基于我们的私钥和预先从配置或从其他网络节点收到的对方的公钥生成加密密钥。

在ADNL的UDP版本中，连接是在从对方接收初始数据的同时建立的，如果发起方发送了'创建通道'消息，通道的密钥将被计算，并将确认通道的创建。建立通道后，进一步的通信将继续在通道内进行。

## 数据包结构和通信

### 首个数据包
让我们分析与DHT节点建立连接并获取其签名地址列表的初始化，以便了解协议的工作方式。

在[全局配置](https://ton-blockchain.github.io/global.config.json)中找到您喜欢的节点，在`dht.nodes`部分。例如：
```json
{
  "@type": "dht.node",
  "id": {
    "@type": "pub.ed25519",
    "key": "fZnkoIAxrTd4xeBgVpZFRm5SvVvSx7eN3Vbe8c83YMk="
  },
  "addr_list": {
    "@type": "adnl.addressList",
    "addrs": [
      {
        "@type": "adnl.address.udp",
        "ip": 1091897261,
        "port": 15813
      }
    ],
    "version": 0,
    "reinit_date": 0,
    "priority": 0,
    "expire_at": 0
  },
  "version": -1,
  "signature": "cmaMrV/9wuaHOOyXYjoxBnckJktJqrQZ2i+YaY3ehIyiL3LkW81OQ91vm8zzsx1kwwadGZNzgq4hI4PCB/U5Dw=="
}
```

1. 我们取其ED25519密钥`fZnkoIAxrTd4xeBgVpZFRm5SvVvSx7eN3Vbe8c83YMk`，并从base64解码。
2. 取其IP地址`1091897261`，并使用[服务](https://www.browserling.com/tools/dec-to-ip)或转换为小端字节，得到`65.21.7.173`。
3. 与端口结合，得到`65.21.7.173:15813`并建立UDP连接。

我们想要打开一个通道与节点通信并获取一些信息，主要任务是接收其签名地址列表。为此，我们将生成2个消息，第一个是[创建通道](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L129)：
```tlb
adnl.message.createChannel key:int256 date:int = adnl.Message
```
这里有两个参数 - key和date。作为date，我们将指定当前的unix时间戳。对于key，我们需要为通道专门生成一个新的ED25519私钥+公钥对，它们将用于初始化[公共加密密钥](/develop/network/adnl-tcp#getting-a-shared-key-using-ecdh)。我们将在消息的`key`参数中使用生成的公钥，并暂时保存私钥。

序列化填充的TL结构，得到：
```
bbc373e6                                                         -- TL ID adnl.message.createChannel 
d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7 -- key
555c8763                                                         -- date                                                        -- date
```

接下来，我们转到我们的主要查询 - [获取地址列表](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L198)。为此，我们首先需要序列化其TL结构：
```tlb
dht.getSignedAddressList = dht.Node
```
它没有参数，因此我们只需序列化它。它将只是它的id - `ed4879a9`。

接下来，由于这是DHT协议更高级别的请求，我们需要首先将它包裹在`adnl.message.query` TL结构中：
```tlb
adnl.message.query query_id:int256 query:bytes = adnl.Message
```
作为`query_id`，我们生成随机的32字节，作为`query`，我们使用我们的主要请求，[包裹在字节数组中](/develop/data-formats/tl#encoding-bytes-array)。
我们将得到：
```
7af98bb4                                                         -- TL ID adnl.message.query
d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875 -- query_id
04 ed4879a9 000000                                               -- query
```

### 构建数据包

所有通信都是通过数据包进行的，其内容是[TL结构](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L81)：
```tlb
adnl.packetContents 
  rand1:bytes                                     -- 随机的7或15字节
  flags:#                                         -- 标志位，用于确定后面字段的存在
  from:flags.0?PublicKey                          -- 发送者的公钥
  from_short:flags.1?adnl.id.short                -- 发送者的ID
  message:flags.2?adnl.Message                    -- 消息（如果只有一个消息）
  messages:flags.3?(vector adnl.Message)          -- 消息（如果> 1）
  address:flags.4?adnl.addressList                -- 我们的地址列表
  priority_address:flags.5?adnl.addressList       -- 我们的优先地址列表
  seqno:flags.6?long                              -- 数据包序列号
  confirm_seqno:flags.7?long                      -- 收到的最后一个数据包的序列号
  recv_addr_list_version:flags.8?int              -- 地址版本 
  recv_priority_addr_list_version:flags.9?int     -- 优先地址版本
  reinit_date:flags.10?int                        -- 重初始化日期（计数器重置）
  dst_reinit_date:flags.10?int                    -- 上一个收到的数据包的重初始化日期
  signature:flags.11?bytes                        -- 签名
  rand2:bytes                                     -- 随机的7或15字节
        = adnl.PacketContents
        
```

一旦我们序列化了所有想要发送的消息，我们就可以开始构建数据包。发送到通道的数据包与初始化通道之前发送的数据包在内容上有所不同。首先，让我们分析用于初始化的主数据包。

在通道外的初始数据交换期间，数据包的序列化内容结构前缀为对方的公钥 - 32字节。我们的公钥为32字节，数据包内容结构的序列化TL的sha256哈希 - 32字节。数据包内容使用从我们的私钥和对方的公钥（不是通道的密钥）获得的[共享密钥](/develop/network/adnl-tcp#getting-a-shared-key-using-ecdh)进行加密。

序列化我们的数据包内容结构，然后逐字节解析：
```
89cd42d1                                                               -- TL ID adnl.packetContents
0f 4e0e7dd6d0c5646c204573

bc47e567                                      -- rand1, 15 (0f) 随机字节
d9050000                                                               -- flags (0x05d9) -> 0b0000010111011001
                                                                       -- from (存在，因为标志位的零位= 1)
c6b41348                                                                  -- TL ID pub.ed25519
   afc46336dd352049b366c7fd3fc1b143a518f0d02d9faef896cb0155488915d6       -- key:int256
                                                                       -- messages (存在，因为标志位的第三位= 1)
02000000                                                                  -- vector adnl.Message, 大小= 2条消息   
   bbc373e6                                                                  -- TL ID adnl.message.createChannel
   d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7          -- key
   555c8763                                                                  -- date (创建日期)
   
   7af98bb4                                                                  -- TL ID adnl.message.query
   d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875          -- query_id
   04 ed4879a9 000000                                                        -- query (字节大小4，填充3)
                                                                       -- address (存在，因为标志位的第四位= 1)，没有TL ID，因为它是明确指定的
00000000                                                                  -- addrs (空向量，因为我们处于客户端模式，没有线路监听地址)
555c8763                                                                  -- version (通常为初始化日期)
555c8763                                                                  -- reinit_date (通常为初始化日期)
00000000                                                                  -- priority
00000000                                                                  -- expire_at

0100000000000000                                                       -- seqno (存在，因为标志位的第六位= 1)
0000000000000000                                                       -- confirm_seqno (存在，因为标志位的第七位= 1)
555c8763                                                               -- recv_addr_list_version (存在，因为标志位的第八位= 1，通常为初始化日期)
555c8763                                                               -- reinit_date (存在，因为标志位的第十位= 1，通常为初始化日期)
00000000                                                               -- dst_reinit_date (存在，因为标志位的第十位= 1)
0f 2b6a8c0509f85da9f3c7e11c86ba22                                      -- rand2, 15 (0f) 随机字节
```
序列化后 - 我们需要使用我们之前生成并保存的私有客户端（不是通道的）ED25519密钥对结果字节数组进行签名。
生成签名（大小为64字节）后，我们需要将其添加到数据包中，再次序列化，但现在在标志位中添加第11位，表示存在签名：
```
89cd42d1                                                               -- TL ID adnl.packetContents
0f 4e0e7dd6d0c5646c204573bc47e567                                      -- rand1, 15 (0f) 随机字节
d90d0000                                                               -- flags (0x0dd9) -> 0b0000110111011001
                                                                       -- from (存在，因为标志位的零位= 1)
c6b41348                                                                  -- TL ID pub.ed25519
   afc46336dd352049b366c7fd3fc1b143a518f0d02d9faef896cb0155488915d6       -- key:int256
                                                                       -- messages (存在，因为标志位的第三位= 1)
02000000                                                                  -- vector adnl.Message, 大小= 2条消息   
   bbc373e6                                                                  -- TL ID adnl.message.createChannel
   d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7          -- key
   555c8763                                                                  -- date (创建日期)
   
   7af98bb4                                                                  -- TL ID adnl.message.query
   d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875          -- query_id
   04 ed4879a9 000000                                                        -- query (字节大小4，填充3)
                                                                       -- address (存在，因为标志位的第四位= 1)，没有TL ID，因为它是明确指定的
00000000                                                                  -- addrs (空向量，因为我们处于客户端模式，没有线路监听地址)
555c8763                                                                  -- version (通常为初始化日期)
555c8763                                                                  -- reinit_date (通常为初始化日期)
00000000                                                                  -- priority
00000000                                                                  -- expire_at

0100000000000000                                                       -- seqno (存在，因为标志位的第六位= 1)
0000000000000000                                                       -- confirm_seqno (存在，因为标志位的第七位= 1)
555c8763                                                               -- recv_addr_list_version (存在，因为标志位的第八位= 1，通常为初始化日期)
555c8763                                                               -- reinit_date (存在，因为标志位的第十位= 1，通常为初始化日期)
00000000                                                               -- dst_reinit_date (存在，因为标志位的第十位= 1)
40 b453fbcbd8e884586b464290fe07475ee0da9df0b8d191e41e44f8f42a63a710    -- signature (存在，因为标志位的第十一位= 1)，(字节大小64，填充3)
   341eefe8ffdc56de73db50a25989816dda17a4ac6c2f72f49804a97ff41df502    --
   000000                                                              --
0f 2b6a8c0509f85da9f3c7e11c86ba22                                      -- rand2, 15 (0f) 随机字节
```
现在我们有一个组装好的、签名的和序列化的数据包，它是一个字节数组。
为了让接收方随后验证其完整性，我们需要计算数据包的sha256哈希。例如，让这个哈希是`408a2a4ed623b25a2e2ba8bbe92d01a3b5dbd22c97525092ac3203ce4044dcd2`。

现在让我们使用AES-CTR密码对数据包内容进行加密，使用从我们的私钥和对方的公钥（不是通道的密钥）获得的[共享密钥](/develop/network/adnl-tcp#getting-a-shared-key-using-ecdh)。

我们几乎准备好发送了，只剩下计算ED25519对等密钥的[ID](/develop/network/adnl-tcp#getting-key-id)，并将所有内容连接在一起：
```
daa76538d99c79ea097a67086ec05acca12d1fefdbc9c96a76ab5a12e66c7ebb  -- 服务器密钥ID
afc46336dd352049b366c7fd3fc1b143a518f0d02d9faef896cb0155488915d6  -- 我们的公钥
408a2a4ed623b25a2e2ba8bbe92d01a3b5dbd22c97525092ac3203ce4044dcd2  -- sha256内容哈希（加密前）
...                                                               -- 数据包内容加密
```
现在我们可以通过UDP发送我们构建的数据包，并等待响应。

作为响应，我们将收到具有类似结构的数据包，但消息不同。它将包括：
```
68426d4906bafbd5fe25baf9e0608cf24fffa7eca0aece70765d64f61f82f005  -- 我们密钥的ID
2d11e4a08031ad3778c5e060569645466e52bd1bd2c7b78ddd56def1cf3760c9  -- 服务器公钥，用于共享密钥
f32fa6286d8ae61c0588b5a03873a220a3163cad2293a5dace5f03f06681e88a  -- sha256内容哈希（加密前）
...                                                               --

 数据包内容加密
```

从服务器的数据包的反序列化如下：
1. 我们检查数据包中的密钥ID，以了解该数据包是为我们准备的。
2. 使用数据包中的服务器公钥和我们的私钥，我们计算共享密钥并解密数据包内容
3. 比较我们收到的sha256哈希和从解密数据获得的哈希，它们必须匹配
4. 使用`adnl.packetContents` TL模式开始反序列化数据包内容

数据包内容将如下所示：
```
89cd42d1                                                               -- TL ID adnl.packetContents
0f 985558683d58c9847b4013ec93ea28                                      -- rand1, 15 (0f) 随机字节
ca0d0000                                                               -- flags (0x0dca) -> 0b0000110111001010
daa76538d99c79ea097a67086ec05acca12d1fefdbc9c96a76ab5a12e66c7ebb       -- from_short (因为标志位的第一位= 1)
02000000                                                               -- messages (存在，因为标志位的第三位= 1)
   691ddd60                                                               -- TL ID adnl.message.confirmChannel 
   db19d5f297b2b0d76ef79be91ad3ae01d8d9f80fab8981d8ed0c9d67b92be4e3       -- key (服务器通道公钥)
   d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7       -- peer_key (我们的公共通道密钥)
   94848863                                                               -- date
   
   1684ac0f                                                               -- TL ID adnl.message.answer 
   d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875       -- query_id
   90 48325384c6b413487d99e4a08031ad3778c5e060569645466e52bd5bd2c7b       -- answer (回答我们的请求，我们将在关于DHT的文章中分析其内容)
      78ddd56def1cf3760c901000000e7a60d67ad071541c53d0000ee354563ee       --
      35456300000000000000009484886340d46cc50450661a205ad47bacd318c       --
      65c8fd8e8f797a87884c1bad09a11c36669babb88f75eb83781c6957bc976       --
      6a234f65b9f6e7cc9b53500fbe2c44f3b3790f000000                        --
      000000                                                              --
0100000000000000                                                       -- seqno (存在，因为标志位的第六位= 1)
0100000000000000                                                       -- confirm_seqno (存在，因为标志位的第七位= 1)
94848863                                                               -- recv_addr_list_version (存在，因为标志位的第八位= 1，通常为初始化日期)
ee354563                                                               -- reinit_date (存在，因为标志位的第十位= 1，通常为初始化日期)
94848863                                                               -- dst_reinit_date (存在，因为标志位的第十位= 1)
40 5c26a2a05e584e9d20d11fb17538692137d1f7c0a1a3c97e609ee853ea9360ab6   -- signature (存在，因为标志位的第十一位= 1)，(字节大小64，填充3)
   d84263630fe02dfd41efb5cd965ce6496ac57f0e51281ab0fdce06e809c7901     --
   000000                                                              --
0f c3354d35749ffd088411599101deb2                                      -- rand2, 15 (0f) 随机字节
```
服务器用两条消息回应我们：`adnl.message.confirmChannel`和`adnl.message.answer`。
对于`adnl.message.answer`，一切都很简单，这是我们请求`dht.getSignedAddressList`的回答，我们将在关于DHT的文章中分析。

让我们关注`adnl.message.confirmChannel`，这意味着对方已确认创建通道并发送给我们其公共通道密钥。现在，有了我们的私有通道密钥和对方的公共通道密钥，我们可以计算[共享密钥](/develop/network/adnl-tcp#getting-a-shared-key-using-ecdh)。

现在我们计算出共享通道密钥后，我们需要从中生成2个密钥 - 一个用于加密发出的消息，另一个用于解密传入的消息。
从中生成2个密钥相当简单，第二个密钥等于共享密钥的倒序写法。例如：
```
共享密钥：AABB2233

第一个密钥: AABB2233
第二个密钥: 3322BBAA
```
剩下的就是确定哪个密钥用于什么，我们可以通过将我们的公共通道密钥的ID与服务器通道的公钥的ID比较，将它们转换为数值形式 - uint256。这种方法用于确保服务器和客户端都确定哪个密钥用于什么。如果服务器使用第一个密钥进行加密，那么使用这种方法，客户端将始终将其用于解密。

使用条款是：
```
服务器ID小于我们的ID：
加密：第一个密钥
解密：第二个密钥

服务器ID大于我们的ID：
加密：第二个密钥
解密：第一个密钥

如果ID相等（几乎不可能）：
加密：第一个密钥
解密：第一个密钥
```
[[实现示例]](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/adnl.go#L502)

### 通道内通信

所有后续的数据包交换将在通道内发生，通道密钥将用于加密。
让我们在新创建的通道内发送相同的`dht.getSignedAddressList`请求，看看区别。

让我们使用相同的`adnl.packetContents`结构为通道构建数据包：
```
89cd42d1                                                               -- TL ID adnl.packetContents
0f c1fbe8c4ab8f8e733de83abac17915                                      -- rand1, 15 (0f) 随机字节
c4000000                                                               -- flags (0x00c4) -> 0b0000000011000100
                                                                       -- message (因为第二位= 1)
7af98bb4                                                                  -- TL ID adnl.message.query
fe3c0f39a89917b7f393533d1d06b605b673ffae8bbfab210150fe9d29083c35          -- query_id
04 ed4879a9 000000                                                        -- query (我们的dht.getSignedAddressList打包为字节，填充3)
0200000000000000                                                       -- seqno (因为标志位的第六位= 1)，2因为这是我们的第二条消息
0100000000000000                                                       -- confirm_seqno (因为标志位的第七位= 1)，1因为这是我们从服务器收到的最后一个seqno
07 e4092842a8ae18                                                      -- rand2, 7 (07) 随机字节
```
通道内的数据包非常简单，实质上由序列（seqno）和消息本身组成。

序列化后，像上次一样，我们计算数据包的sha256哈希。然后我们使用用于通道传出数据包的密钥加密数据包。[计算](/develop/network/adnl-tcp#getting-key-id)我们传出消息的加密密钥的`pub.aes` ID，并构建我们的数据包：
```
bcd1cf47b9e657200ba21d94b822052cf

553a548f51f539423c8139a83162180 -- 我们传出消息的加密密钥ID
6185385aeee5faae7992eb350f26ba253e8c7c5fa1e3e1879d9a0666b9bd6080 -- sha256内容哈希（加密前）
...                                                              -- 数据包内容加密
```
我们通过UDP发送数据包，并等待响应。作为回应，我们将收到与我们发送的同类型的数据包（相同字段），但带有我们请求`dht.getSignedAddressList`的回复。

## 其他消息类型
对于基本通信，使用像`adnl.message.query`和`adnl.message.answer`这样的消息，我们在上面讨论了，但对于某些情况，也使用其他类型的消息，我们将在本节中讨论。

### adnl.message.part
此消息类型是其他可能消息类型的一部分，例如`adnl.message.answer`。当消息太大而无法通过单个UDP数据报传输时，使用此传输数据的方法。
```tlb
adnl.message.part 
hash:int256            -- 原始消息的sha256哈希
total_size:int         -- 原始消息大小
offset:int             -- 相对于原始消息开始的偏移量
data:bytes             -- 原始消息的数据片段
   = adnl.Message;
```
因此，为了组装原始消息，我们需要获取几个部分，并根据偏移量将它们连接成一个字节数组。
然后将其作为消息处理（根据这个字节数组中的ID前缀）。

### adnl.message.custom
```tlb
adnl.message.custom data:bytes = adnl.Message;
```
当更高级别的逻辑与请求-响应格式不符时，使用此类消息，这种消息类型允许将处理完全转移到更高级别，因为消息只携带一个字节数组，没有query_id和其他字段。例如，RLDP使用此类消息，因为对许多请求只有一个响应，这种逻辑由RLDP本身控制。

### 结论

此后的通信基于本文描述的逻辑进行，但数据包的内容取决于更高级别的协议，如DHT和RLDP。

## 参考

_这里是[原文链接](https://github.com/xssnick/ton-deep-doc/blob/master/ADNL-UDP-Internal.md)，作者是[Oleg Baranov](https://github.com/xssnick)。_
