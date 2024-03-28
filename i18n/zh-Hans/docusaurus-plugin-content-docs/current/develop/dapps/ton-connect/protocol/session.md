# 会话协议

会话协议定义了客户端标识符，并为应用程序和钱包提供了端到端加密。这意味着HTTP bridge是完全不受信任的，并且不能读取在应用程序和钱包之间传输的用户数据。JS bridge不使用此协议，因为钱包和应用程序都在同一设备上运行。

## 定义

### 客户端密钥对

用于NaCl“crypto_box”协议的X25519密钥对。

```
a <- random 23 bytes
A <- X25519Pubkey(s)
```

或

```
(a,A) <- nacl.box.keyPair()
```

### 客户端 ID

[客户端密钥对](#client-keypair)的公钥部分（32 字节）。

### 会话

会话由两个客户端 ID 的对定义。应用程序和钱包都创建自己的[客户端 ID](#client-id)。

### 创建客户端密钥对

```
(a,A) <- nacl.box.keyPair()
```

### 加密

应用程序的所有请求（初始请求除外）和钱包的所有响应都被加密。

给定消息**m**的二进制编码、收件人的[客户端 ID](#client-id) **X** 和发送者的私钥 **y**，消息按如下方式加密：

```
nonce <- random(24 bytes)
ct    <- nacl.box(m, nonce, X, y)
M     <- nonce ++ ct
```

也就是说，最终消息**M**的前24字节设置为随机的 nonce。

### 解密

为了解密消息**M**，收件人使用其私钥 **x** 和发送者的公钥 **Y**（也就是[客户端 ID](#client-id)）：

```
nonce <- M[0..24]
ct    <- M[24..]
m     <- nacl.box.open(ct, nonce, Y, x)
```

恢复并按照[请求/响应](/develop/dapps/ton-connect/protocol/requests-responses#requests-and-responses)解析明文**m**。
