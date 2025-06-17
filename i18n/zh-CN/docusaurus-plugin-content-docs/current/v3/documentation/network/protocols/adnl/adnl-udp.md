import Feedback from '@site/src/components/Feedback';

# ADNL UDP - 节点间通信

ADNL over UDP is a low-level protocol used by nodes and TON components to communicate with one another. It serves as the foundation for other higher-level TON protocols, such as DHT (Distributed Hash Table) and RLDP (Reliable Large Datagram Protocol).

ADNL通过UDP用于节点和TON组件之间的通信。它是一个低层级协议，其他更高级的TON协议（如DHT和RLDP）都是在其基础上运行的。在这篇文章中，我们将了解ADNL通过UDP在节点之间进行基本通信的工作方式。

Unlike ADNL over TCP, the UDP implementation involves a different form of handshake and includes an additional layer in the form of channels. However, the underlying principles remain similar: encryption keys are generated based on our private key and the peer's public key, which is either known in advance from the configuration or received from other network nodes.

In the UDP version of ADNL, the connection is established simultaneously with the reception of initial data from the peer. If the initiator sends a **create channel** message, the channel’s key will be calculated, and the channel's creation will be confirmed.

Once the channel is established, further communication continues within it.

## 数据包结构和通信

### 首个数据包

让我们分析与DHT节点建立连接并获取其签名地址列表的初始化，以便了解协议的工作方式。

在[全局配置](https://ton-blockchain.github.io/global.config.json)中找到您喜欢的节点，在`dht.nodes`部分。例如：  For example:

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

我们取其ED25519密钥`fZnkoIAxrTd4xeBgVpZFRm5SvVvSx7eN3Vbe8c83YMk`，并从base64解码。

取其IP地址`1091897261`，并使用[服务](https://www.browserling.com/tools/dec-to-ip)或转换为小端字节，得到`65.21.7.173`。 This will give us the IP address `65.21.7.173`.

与端口结合，得到`65.21.7.173:15813`并建立UDP连接。

We aim to establish a communication channel with the node to obtain specific information, particularly a list of signed addresses. To achieve this, we will generate two messages. 我们想要打开一个通道与节点通信并获取一些信息，主要任务是接收其签名地址列表。为此，我们将生成2个消息，第一个是[创建通道](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L129)：

```tlb
adnl.message.createChannel key:int256 date:int = adnl.Message
```

We have two parameters to consider: a key and a date. The date will be represented by the current Unix timestamp. For the key, we need to generate a new ed25519 private and public key pair specifically for the channel. This key pair will be used to initialize the public encryption key, as outlined in the [link here](/v3/documentation/network/protocols/adnl/adnl-tcp#getting-a-shared-key-using-ecdh). We will use the generated public key as the value for the `key` parameter in the message, while we will store the private key for future use.

作为响应，我们将收到具有类似结构的数据包，但消息不同。它将包括：

```
bbc373e6                                                         -- TL ID adnl.message.createChannel 
d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7 -- key
555c8763                                                         -- date
```

接下来，我们转到我们的主要查询 - [获取地址列表](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L198)。为此，我们首先需要序列化其TL结构：

序列化填充的TL结构，得到：

```tlb
dht.getSignedAddressList = dht.Node
```

它没有参数，因此我们只需序列化它。它将只是它的id - `ed4879a9`。 The result will be just its ID: `ed4879a9`.

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
  rand1:bytes                                     -- random 7 or 15 bytes
  flags:#                                         -- bit flags, used to determine the presence of fields further
  from:flags.0?PublicKey                          -- sender's public key
  from_short:flags.1?adnl.id.short                -- sender's ID
  message:flags.2?adnl.Message                    -- message (used if there is only one message)
  messages:flags.3?(vector adnl.Message)          -- messages (if there are > 1)
  address:flags.4?adnl.addressList                -- list of our addresses
  priority_address:flags.5?adnl.addressList       -- priority list of our addresses
  seqno:flags.6?long                              -- packet sequence number
  confirm_seqno:flags.7?long                      -- sequence number of the last packet received
  recv_addr_list_version:flags.8?int              -- address version 
  recv_priority_addr_list_version:flags.9?int     -- priority address version
  reinit_date:flags.10?int                        -- connection reinitialization date (counter reset)
  dst_reinit_date:flags.10?int                    -- connection reinitialization date from the last received packet
  signature:flags.11?bytes                        -- signature
  rand2:bytes                                     -- random 7 or 15 bytes
        = adnl.PacketContents
        
```

一旦我们序列化了所有想要发送的消息，我们就可以开始构建数据包。发送到通道的数据包与初始化通道之前发送的数据包在内容上有所不同。首先，让我们分析用于初始化的主数据包。

Packets sent to a channel have a different content structure compared to packets sent before the channel is initialized.

First, let’s examine the main packet used for initialization.

在通道外的初始数据交换期间，数据包的序列化内容结构前缀为对方的公钥 - 32字节。我们的公钥为32字节，数据包内容结构的序列化TL的sha256哈希 - 32字节。数据包内容使用从我们的私钥和对方的公钥（不是通道的密钥）获得的[共享密钥](/develop/network/adnl-tcp#getting-a-shared-key-using-ecdh)进行加密。

Our public key is also 32 bytes, and the SHA-256 hash of the serialized TL of the packet's content structure is another 32 bytes.

让我们关注`adnl.message.confirmChannel`，这意味着对方已确认创建通道并发送给我们其公共通道密钥。现在，有了我们的私有通道密钥和对方的公共通道密钥，我们可以计算[共享密钥](/develop/network/adnl-tcp#getting-a-shared-key-using-ecdh)。

序列化我们的数据包内容结构，然后逐字节解析：

```
89cd42d1                                                               -- TL ID adnl.packetContents
0f 4e0e7dd6d0c5646c204573bc47e567                                      -- rand1, 15 (0f) random bytes
d9050000                                                               -- flags (0x05d9) -> 0b0000010111011001
                                                                       -- from (present because flag's zero bit = 1)
c6b41348                                                                  -- TL ID pub.ed25519
   afc46336dd352049b366c7fd3fc1b143a518f0d02d9faef896cb0155488915d6       -- key:int256
                                                                       -- messages (present because flag's third bit = 1)
02000000                                                                  -- vector adnl.Message, size = 2 messages   
   bbc373e6                                                                  -- TL ID adnl.message.createChannel
   d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7          -- key
   555c8763                                                                  -- date (date of creation)
   
   7af98bb4                                                                  -- TL ID [adnl.message.query](/)
   d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875          -- query_id
   04 ed4879a9 000000                                                        -- query (bytes size 4, padding 3)
                                                                       -- address (present because flag's fourth bit = 1), without TL ID since it is specified explicitly
00000000                                                                  -- addrs (empty vector, because we are in client mode and do not have an address on wiretap)
555c8763                                                                  -- version (usually initialization date)
555c8763                                                                  -- reinit_date (usually initialization date)
00000000                                                                  -- priority
00000000                                                                  -- expire_at

0100000000000000                                                       -- seqno (present because flag's sixth bit = 1)
0000000000000000                                                       -- confirm_seqno (present because flag's seventh bit = 1)
555c8763                                                               -- recv_addr_list_version (present because flag's eighth bit = 1, usually initialization date)
555c8763                                                               -- reinit_date (present because flag's tenth bit = 1, usually initialization date)
00000000                                                               -- dst_reinit_date (present because flag's tenth bit = 1)
0f 2b6a8c0509f85da9f3c7e11c86ba22                                      -- rand2, 15 (0f) random bytes
```

序列化后 - 我们需要使用我们之前生成并保存的私有客户端（不是通道的）ED25519密钥对结果字节数组进行签名。
生成签名（大小为64字节）后，我们需要将其添加到数据包中，再次序列化，但现在在标志位中添加第11位，表示存在签名：

Once we have created the signature (which is 64 bytes in size), we must add it to the packet and serialize it again. This time, we will also set the 11th bit in the flag to indicate the presence of the signature:

```
89cd42d1                                                               -- TL ID adnl.packetContents
0f 4e0e7dd6d0c5646c204573bc47e567                                      -- rand1, 15 (0f) random bytes
d90d0000                                                               -- flags (0x0dd9) -> 0b0000110111011001
                                                                       -- from (present because flag's zero bit = 1)
c6b41348                                                                  -- TL ID pub.ed25519
   afc46336dd352049b366c7fd3fc1b143a518f0d02d9faef896cb0155488915d6       -- key:int256
                                                                       -- messages (present because flag's third bit = 1)
02000000                                                                  -- vector adnl.Message, size = 2 message   
   bbc373e6                                                                  -- TL ID adnl.message.createChannel
   d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7          -- key
   555c8763                                                                  -- date (date of creation)
   
   7af98bb4                                                                  -- TL ID adnl.message.query
   d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875          -- query_id
   04 ed4879a9 000000                                                        -- query (bytes size 4, padding 3)
                                                                       -- address (present because flag's fourth bit = 1), without TL ID since it is specified explicitly
00000000                                                                  -- addrs (empty vector, because we are in client mode and do not have an address on wiretap)
555c8763                                                                  -- version (usually initialization date)
555c8763                                                                  -- reinit_date (usually initialization date)
00000000                                                                  -- priority
00000000                                                                  -- expire_at

0100000000000000                                                       -- seqno (present because flag's sixth bit = 1)
0000000000000000                                                       -- confirm_seqno (present because flag's seventh bit = 1)
555c8763                                                               -- recv_addr_list_version (present because flag's eighth bit = 1, usually initialization date)
555c8763                                                               -- reinit_date (present because flag's tenth bit = 1, usually initialization date)
00000000                                                               -- dst_reinit_date (present because flag's tenth bit = 1)
40 b453fbcbd8e884586b464290fe07475ee0da9df0b8d191e41e44f8f42a63a710    -- signature (present because flag's eleventh bit = 1), (bytes size 64, padding 3)
   341eefe8ffdc56de73db50a25989816dda17a4ac6c2f72f49804a97ff41df502    --
   000000                                                              --
0f 2b6a8c0509f85da9f3c7e11c86ba22                                      -- rand2, 15 (0f) random bytes
```

We now have an assembled, signed, and serialized packet, which consists of an array of bytes.

Next, we need to calculate the packet's SHA-256 hash, allowing the recipient to verify its integrity later. For instance, let’s say the hash is `408a2a4ed623b25a2e2ba8bbe92d01a3b5dbd22c97525092ac3203ce4044dcd2`.

现在让我们使用AES-CTR密码对数据包内容进行加密，使用从我们的私钥和对方的公钥（不是通道的密钥）获得的[共享密钥](/develop/network/adnl-tcp#getting-a-shared-key-using-ecdh)。

我们几乎准备好发送了，只剩下计算ED25519对等密钥的[ID](/develop/network/adnl-tcp#getting-key-id)，并将所有内容连接在一起：

```
daa76538d99c79ea097a67086ec05acca12d1fefdbc9c96a76ab5a12e66c7ebb  -- server Key ID
afc46336dd352049b366c7fd3fc1b143a518f0d02d9faef896cb0155488915d6  -- our public key
408a2a4ed623b25a2e2ba8bbe92d01a3b5dbd22c97525092ac3203ce4044dcd2  -- sha256 content hash (before encryption)
...                                                               -- encrypted content of the packet
```

现在我们可以通过UDP发送我们构建的数据包，并等待响应。

In response, we will receive a packet with a similar structure, but containing different messages. It will consist of:

```
68426d4906bafbd5fe25baf9e0608cf24fffa7eca0aece70765d64f61f82f005  -- ID of our key
2d11e4a08031ad3778c5e060569645466e52bd1bd2c7b78ddd56def1cf3760c9  -- server public key, for shared key
f32fa6286d8ae61c0588b5a03873a220a3163cad2293a5dace5f03f06681e88a  -- sha256 content hash (before encryption)
...                                                               -- the encrypted content of the packet
```

从服务器的数据包的反序列化如下：

- 我们检查数据包中的密钥ID，以了解该数据包是为我们准备的。
- 使用数据包中的服务器公钥和我们的私钥，我们计算共享密钥并解密数据包内容
- 比较我们收到的sha256哈希和从解密数据获得的哈希，它们必须匹配
- 使用`adnl.packetContents` TL模式开始反序列化数据包内容

数据包内容将如下所示：

```
89cd42d1                                                               -- TL ID adnl.packetContents
0f 985558683d58c9847b4013ec93ea28                                      -- rand1, 15 (0f) random bytes
ca0d0000                                                               -- flags (0x0dca) -> 0b0000110111001010
daa76538d99c79ea097a67086ec05acca12d1fefdbc9c96a76ab5a12e66c7ebb       -- from_short (because flag's first bit = 1)
02000000                                                               -- messages (present because flag's third bit = 1)
   691ddd60                                                               -- TL ID adnl.message.confirmChannel 
   db19d5f297b2b0d76ef79be91ad3ae01d8d9f80fab8981d8ed0c9d67b92be4e3       -- key (server channel public key)
   d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7       -- peer_key (our public channel key)
   94848863                                                               -- date
   
   1684ac0f                                                               -- TL ID adnl.message.answer 
   d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875       -- query_id
   90 48325384c6b413487d99e4a08031ad3778c5e060569645466e52bd5bd2c7b       -- answer (the answer to our request, we will analyze its content in an article about DHT)
      78ddd56def1cf3760c901000000e7a60d67ad071541c53d0000ee354563ee       --
      35456300000000000000009484886340d46cc50450661a205ad47bacd318c       --
      65c8fd8e8f797a87884c1bad09a11c36669babb88f75eb83781c6957bc976       --
      6a234f65b9f6e7cc9b53500fbe2c44f3b3790f000000                        --
      000000                                                              --
0100000000000000                                                       -- seqno (present because flag's sixth bit = 1)
0100000000000000                                                       -- confirm_seqno (present because flag's seventh bit = 1)
94848863                                                               -- recv_addr_list_version (present because flag's eighth bit = 1, usually initialization date)
ee354563                                                               -- reinit_date (present because flag's tenth bit = 1, usually initialization date)
94848863                                                               -- dst_reinit_date (present because flag's tenth bit = 1)
40 5c26a2a05e584e9d20d11fb17538692137d1f7c0a1a3c97e609ee853ea9360ab6   -- signature (present because flag's eleventh bit = 1), (bytes size 64, padding 3)
   d84263630fe02dfd41efb5cd965ce6496ac57f0e51281ab0fdce06e809c7901     --
   000000                                                              --
0f c3354d35749ffd088411599101deb2                                      -- rand2, 15 (0f) random bytes
```

服务器用两条消息回应我们：`adnl.message.confirmChannel`和`adnl.message.answer`。
对于`adnl.message.answer`，一切都很简单，这是我们请求`dht.getSignedAddressList`的回答，我们将在关于DHT的文章中分析。

我们通过UDP发送数据包，并等待响应。作为回应，我们将收到与我们发送的同类型的数据包（相同字段），但带有我们请求`dht.getSignedAddressList`的回复。

Now, let’s focus on `adnl.message.confirmChannel`. This indicates that the peer has confirmed the creation of the channel and has sent us its public channel key. With our private channel key and the peer's public channel key, we can compute the [shared key](/v3/documentation/network/protocols/adnl/adnl-tcp#getting-a-shared-key-using-ecdh).

现在我们计算出共享通道密钥后，我们需要从中生成2个密钥 - 一个用于加密发出的消息，另一个用于解密传入的消息。
从中生成2个密钥相当简单，第二个密钥等于共享密钥的倒序写法。例如：

Deriving these two keys is quite simple. The second key is simply the shared key written in reverse order. For example:

```
Shared key : AABB2233

First key: AABB2233
Second key: 3322BBAA
```

We need to determine which key to use for specific purposes. 剩下的就是确定哪个密钥用于什么，我们可以通过将我们的公共通道密钥的ID与服务器通道的公钥的ID比较，将它们转换为数值形式 - uint256。这种方法用于确保服务器和客户端都确定哪个密钥用于什么。如果服务器使用第一个密钥进行加密，那么使用这种方法，客户端将始终将其用于解密。

This method ensures that both the server and the client agree on which key is used for what function. If the server uses the first key for encryption, this approach guarantees that the client will always use it for decryption.

使用条款是：

```
The server id is smaller than our id:
Encryption: First Key
Decryption: Second Key

The server id is larger than our id:
Encryption: Second Key
Decryption: First Key

If the ids are equal (nearly impossible):
Encryption: First Key
Decryption: First Key
```

[[实现示例]](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/adnl.go#L502)

### 通道内通信

All future packet exchanges will take place within the channel, and the channel keys will be utilized for encryption.

Let's send the same `dht.getSignedAddressList` request within a newly created channel to observe the differences.

让我们使用相同的`adnl.packetContents`结构为通道构建数据包：

```
89cd42d1                                                               -- TL ID adnl.packetContents
0f c1fbe8c4ab8f8e733de83abac17915                                      -- rand1, 15 (0f) random bytes
c4000000                                                               -- flags (0x00c4) -> 0b0000000011000100
                                                                       -- message (because second bit = 1)
7af98bb4                                                                  -- TL ID adnl.message.query
fe3c0f39a89917b7f393533d1d06b605b673ffae8bbfab210150fe9d29083c35          -- query_id
04 ed4879a9 000000                                                        -- query (our dht.getSignedAddressList packed in bytes with padding 3)
0200000000000000                                                       -- seqno (because flag's sixth bit = 1), 2 because it is our second message
0100000000000000                                                       -- confirm_seqno (flag's seventh bit = 1), 1 because it is the last seqno received from the server
07 e4092842a8ae18                                                      -- rand2, 7 (07) random bytes
```

通道内的数据包非常简单，实质上由序列（seqno）和消息本身组成。

After serialization, as we did last time, we calculate the SHA256 hash of the packet. Next, we encrypt the packet using the designated key for outgoing packets in the channel.

序列化后，像上次一样，我们计算数据包的sha256哈希。然后我们使用用于通道传出数据包的密钥加密数据包。[计算](/develop/network/adnl-tcp#getting-key-id)我们传出消息的加密密钥的`pub.aes` ID，并构建我们的数据包：

```
bcd1cf47b9e657200ba21d94b822052cf553a548f51f539423c8139a83162180 -- ID of encryption key of our outgoing messages 
6185385aeee5faae7992eb350f26ba253e8c7c5fa1e3e1879d9a0666b9bd6080 -- sha256 content hash (before encryption)
...                                                              -- the encrypted content of the packet
```

We send a packet via UDP and wait for a response. In response, we receive a packet of the same type as the one we sent, containing the answer to our request for `dht.getSignedAddressList`.

## 其他消息类型

对于基本通信，使用像`adnl.message.query`和`adnl.message.answer`这样的消息，我们在上面讨论了，但对于某些情况，也使用其他类型的消息，我们将在本节中讨论。 However, there are also other types of messages used for specific situations, which we will cover in this section.

### adnl.message.part

此消息类型是其他可能消息类型的一部分，例如`adnl.message.answer`。当消息太大而无法通过单个UDP数据报传输时，使用此传输数据的方法。 This method of data transfer is used when a message is too large to be sent in a single UDP datagram.

```tlb
adnl.message.part 
hash:int256            -- sha256 hash of the original message
total_size:int         -- original message size
offset:int             -- offset according to the beginning of the original message
data:bytes             -- piece of data of the original message
   = adnl.Message;
```

To reconstruct the original message, we need to gather several parts and concatenate them into a single-byte array based on the specified offsets.

因此，为了组装原始消息，我们需要获取几个部分，并根据偏移量将它们连接成一个字节数组。
然后将其作为消息处理（根据这个字节数组中的ID前缀）。

### adnl.message.custom

```tlb
adnl.message.custom data:bytes = adnl.Message;
```

当更高级别的逻辑与请求-响应格式不符时，使用此类消息，这种消息类型允许将处理完全转移到更高级别，因为消息只携带一个字节数组，没有query_id和其他字段。例如，RLDP使用此类消息，因为对许多请求只有一个响应，这种逻辑由RLDP本身控制。 These messages allow for the complete relocation of processing to a higher level, as they consist solely of an array of bytes without including query IDs or other fields.

For instance, in RLDP, such messages are used since there can be only one response to multiple requests. RLDP itself manages this logic.

此后的通信基于本文描述的逻辑进行，但数据包的内容取决于更高级别的协议，如DHT和RLDP。

## 参考

_这里是[原文链接](https://github.com/xssnick/ton-deep-doc/blob/master/ADNL-UDP-Internal.md)，作者是[Oleg Baranov](https://github.com/xssnick)。_

