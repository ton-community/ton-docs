import Feedback from '@site/src/components/Feedback';

# 低层级 ADNL

抽象数据报网络层（ADNL）是 TON 的核心协议，它帮助网络节点相互通信。

## 节点身份

Each peer must have at least one identity; while it's possible to use multiple identities, it is not required. Each identity consists of a keypair used for performing the Diffie-Hellman exchange between peers. An abstract network address is derived from the public key in the following way: `address = SHA-256(type_id || public_key)`. Note that the `type_id` must be serialized as a little-endian uint32.

## 公钥加密系统列表

| type_id | 加密系统                |
| ---------------------------- | ------------------- |
| 0x4813b4c6                   | ed25519<sup>1</sup> |

- \*_To perform x25519, the keypair must be generated in "x25519" format. 要执行 x25519，必须以 x25519 格式生成密钥对。然而，公钥通过网络是以 ed25519 格式传输的，因此你必须将公钥从 x25519 转换为 ed25519，可在[此处](https://github.com/tonstack/adnl-rs/blob/master/src/integrations/dalek.rs#L10)找到 Rust 的转换示例，以及在[此处](https://github.com/andreypfau/curve25519-kotlin/blob/f008dbc2c0ebc3ed6ca5d3251ffb7cf48edc91e2/src/commonMain/kotlin/curve25519/MontgomeryPoint.kt#L39)找到 Kotlin 的转换示例。_

## 客户端-服务器协议（ADNL over TCP）

客户端通过 TCP 连接到服务器，并发送一个 ADNL 握手包，其中包含服务器抽象地址、客户端公钥和加密的 AES-CTR 会话参数，这些参数由客户端确定。 This packet contains a server abstract address, a client public key, and encrypted AES-CTR session parameters, which the client determines.

### 握手

首先，客户端必须使用其私钥和服务器公钥执行密钥协议（例如，x25519），同时要考虑服务器密钥的 `type_id`。然后，客户端将获得 `secret`，用于在后续步骤中加密会话密钥。 As a result, the client will gain `secret`, which is used to encrypt session keys in future steps.

再然后，客户端必须生成 AES-CTR 会话参数，一个 16 字节的 nonce 和 32 字节的密钥，分别用于 TX（客户端->服务器）和 RX（服务器->客户端）方向，并将其序列化为一个 160 字节的缓冲区，如下所示：

| 参数                            | 大小       |
| ----------------------------- | -------- |
| rx_key   | 32 字节    |
| tx_key   | 32 字节    |
| rx_nonce | 16 bytes |
| tx_nonce | 16 bytes |
| padding                       | 64 字节    |

The purpose of padding is unknown; it is not used by server implementations. It is recommended that the whole 160-byte buffer be filled with random bytes. Otherwise, an attacker may perform an active MitM attack using compromised AES-CTR session parameters.

The next step is to encrypt the session parameters using the `secret` through the key agreement protocol outlined above. To achieve this, AES-256 needs to be initialized in CTR mode with a 128-bit big-endian counter. This will utilize a (key, nonce) pair that is computed as follows (note that `aes_params` is a 160-byte buffer that was created earlier):

```cpp
hash = SHA-256(aes_params)
key = secret[0..16] || hash[16..32]
nonce = hash[0..4] || secret[20..32]
```

加密 `aes_params` 后，记为 `E(aes_params)`，因为不再需要 AES，所以应该移除 AES。 现在我们准备将所有信息序列化到 256 字节的握手包中，并发送给服务器：

| 参数                                                          | 大小     | 说明              |
| ----------------------------------------------------------- | ------ | --------------- |
| receiver_address                       | 32 字节  | 服务器节点身份，如相应部分所述 |
| sender_public                          | 32 字节  | 客户端公钥           |
| SHA-256(aes_params) | 32 字节  | 会话参数的完整性证明      |
| E(aes_params)       | 160 字节 | 加密的会话参数         |

服务器必须使用从密钥协议中以与客户端相同的方式派生的secret解密会话参数。然后，服务器必须执行以下检查以确认协议的安全性： After decryption, the server must perform the following checks to ensure the security properties of the protocol:

- 服务器必须拥有 `receiver_address` 对应的私钥，否则无法执行密钥协议。 Without this key, it cannot execute the key agreement protocol.

- The condition `SHA-256(aes_params) == SHA-256(D(E(aes_params)))` must hold true. If this condition is not met, it indicates that the key agreement protocol has failed and the `secret` values on both sides are not equal.

If any of these checks fail, the server will immediately drop the connection without responding to the client. 如果这些检查中的任何一个失败，服务器将立即断开连接，不对客户端作出响应。如果所有检查通过，服务器必须向客户端发送一个空数据报（见数据报部分），以证明其拥有指定 `receiver_address` 的私钥。

### 数据报

客户端和服务器都必须分别为 TX 和 RX 方向初始化两个 AES-CTR 实例。必须使用 AES-256 在 CTR 模式下使用 128 位大端计数器。每个 AES 实例使用属于它的(key, nonce)对进行初始化，可以从握手中的 `aes_params` 中获取。 The AES-256 must be used in CTR mode with a 128-bit big-endian counter. Each AES instance is initialized using a (key, nonce) pair, which can be taken from the `aes_params` during the handshake.

发送数据报时，节点（客户端或服务器）必须构建以下结构，加密它并发送给另一方：

| 参数     | 大小               | 说明                                        |
| ------ | ---------------- | ----------------------------------------- |
| length | 4 字节（LE）         | 整个数据报的长度，不包括 `length` 字段                  |
| nonce  | 32 字节            | 随机值                                       |
| buffer | `length - 64` 字节 | 实际要发送给另一方的数据                              |
| hash   | 32 字节            | \\`SHA-256(nonce \\ |

整个结构必须使用相应的 AES 实例加密（客户端 -> 服务器的 TX，服务器 -> 客户端的 RX）。

接收方必须获取前 4 字节，将其解密为 `length` 字段，并准确读取 `length` 字节以获得完整的数据报。接收方可以提前开始解密和处理 `buffer`，但必须考虑到它可能被故意或偶然损坏。必须检查数据报的 `hash` 以确保 `buffer` 的完整性。如果失败，则不能发出新的数据报，连接必须断开。 The receiving peer may start to decrypt and process `buffer` earlier, but it must take into account that it may be corrupted, intentionally or occasionally. Datagram `hash` must be checked to ensure the integrity of the `buffer`. In case of failure, no new datagrams can be issued and the connection must be dropped.

会话中的第一个数据报始终由服务器在成功接受握手包后发送给客户端，其实际缓冲区为空。客户端应该对其进行解密，如果失败，则应与服务器断开连接，因为这意味着服务器没有正确遵循协议，服务器和客户端的实际会话的密钥不同。 The client should decrypt it and disconnect from the server in case of failure because it means that the server has not followed the protocol properly and the actual session keys differ on the server and client side.

### 通信细节

如果你想深入了解通信细节，可以阅读文章 [ADNL TCP - Liteserver](/develop/network/adnl-tcp) 查看一些示例。

### 安全考虑

#### 握手填充

It is unknown why the initial TON team decided to include this field in the handshake. `SHA-256(aes_params) == SHA-256(D(E(aes_params)))`，否则密钥协议失败，双方的 `secret` 不相等。 Probably, it was intended to migrate from AES-CTR at some point. To do this, the specification may be extended to include a special magic value in `aes_params`, which will signal that the peer is ready to use the updated primitives. The response to such a handshake may be decrypted twice, with new and old schemes, to clarify which scheme the other peer is actually using.

#### 会话参数加密密钥派生过程

如果仅从 `secret` 参数派生加密密钥，它将是静态的，因为secret是静态的。为了为每个会话派生新的加密密钥，开发人员还使用了 `SHA-256(aes_params)`，如果 `aes_params` 是随机的，则它也是随机的。然而，使用不同子数组拼接的实际密钥派生算法是被认为有问题的。 To derive a new encryption key for each session, developers also use `SHA-256(aes_params)`, which is random if `aes_params` is random. However, the actual key derivation algorithm with the concatenation of different subarrays is considered harmful.

#### 数据报 nonce

The purpose of the `nonce` field in the datagram may not be immediately clear. Even without it, any two ciphertexts will differ due to the session-bounded keys used in AES and the encryption method in CTR mode. However, if a nonce is absent or predictable, a potential attack can occur.

In CTR encryption mode, block ciphers like AES function as stream ciphers, allowing for bit-flipping attacks. If an attacker knows the plaintext corresponding to an encrypted datagram, they can create an exact key stream and XOR it with their own plaintext, effectively replacing the original message sent by a peer. Although buffer integrity is protected by a hash (referred to here as SHA-256), an attacker can still manipulate it because if they know the entire plaintext, they can also compute its hash.

The nonce field is crucial for preventing such attacks, as it ensures that an attacker cannot replace the SHA-256 without also having access to the nonce.

## P2P 协议（ADNL over UDP）

详细描述可以在文章 [ADNL UDP - Internode](/develop/network/adnl-udp) 中找到。

## 参考

- [开放网络，第 80 页](https://ton.org/ton.pdf)

- [TON 中的 ADNL 实现](https://github.com/ton-blockchain/ton/tree/master/adnl)

_感谢 [hacker-volodya](https://github.com/hacker-volodya) 为社区做出的贡献！_\
_此处是 GitHub 上的[原文链接](https://github.com/tonstack/ton-docs/tree/main/ADNL)。_

