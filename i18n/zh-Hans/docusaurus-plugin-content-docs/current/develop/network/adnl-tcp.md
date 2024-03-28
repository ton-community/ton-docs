# ADNL TCP - 轻服务器

这是构建TON网络中所有交互的底层协议，它可以在任何协议之上运行，但最常用于TCP和UDP之上。UDP用于节点间通信，而TCP用于与轻服务器的通信。

现在我们将分析基于TCP的ADNL，并学习如何直接与轻服务器进行交互。

在ADNL的TCP版本中，网络节点使用ed25519公钥作为地址，并使用通过椭圆曲线Diffie-Hellman过程 - ECDH获得的共享密钥建立连接。

## 数据包结构
除握手外，每个ADNL TCP数据包具有以下结构：
* 小端模式下的4字节标签大小 (N)
* 32字节随机数 [[?]](## "随机字节用于防止校验和攻击")
* (N - 64) 字节的有效载荷
* 32字节SHA256校验和，来自随机数和有效载荷

整个数据包，包括大小，均为**AES-CTR**加密。解密后，需要检查校验和是否与数据匹配，要检查，只需自己计算校验和并将结果与我们在数据包中拥有的进行比较。

握手数据包是一个例外，它以部分未加密的形式传输，并在下一章中描述。

## 建立连接
要建立连接，我们需要知道服务器的ip、端口和公钥，并生成自己的ed25519私钥和公钥。

服务器的公共数据如ip、端口和密钥可以从[全局配置](https://ton-blockchain.github.io/global.config.json)中获得。配置中的IP以数字形式出现，可以使用例如[此工具](https://www.browserling.com/tools/dec-to-ip)转换为常规形式。配置中的公钥为base64格式。

客户端生成160个随机字节，其中一些将被双方用作AES加密的基础。

由此，创建了2个永久的AES-CTR密码，握手后将被双方用来加密/解密消息。
* 密码A - 密钥为0 - 31字节，iv为64 - 79字节
* 密码B - 密钥为32 - 63字节，iv为80 - 95字节

密码应用的顺序如下：
* 服务器使用密码A加密它发送的消息。
* 客户端使用密码A解密收到的消息。
* 客户端使用密码B加密它发送的消息。
* 服务器使用密码B解密收到的消息。

要建立连接，客户端必须发送一个包含以下内容的握手数据包：
* [32字节] **服务器密钥ID** [[详情]](#获取密钥ID)
* [32字节] **我们的ed25519公钥**
* [32字节] **我们160字节的SHA256哈希**
* [160字节] **我们加密的160字节** [[详情]](#handshake-packet-data-encryption)

收到握手数据包后，服务器将执行相同的操作，接收ECDH密钥，解密160字节并创建2个永久密钥。如果一切顺利，服务器将用一个没有有效载荷的空ADNL数据包作为回应，为了解密该数据包（以及后续的数据包），我们需要使用其中一个永久密码。

从这一点开始，连接可以被视为已建立。

在建立了连接后，我们可以开始接收信息；TL语言用于序列化数据。

[更多关于TL的信息](/develop/data-formats/tl)

## Ping&Pong
最佳做法是每5秒发送一次ping数据包。这是在没有数据传输时保持连接的必要条件，否则服务器可能终止连接。

ping数据包与其他所有数据包一样，根据[上文](#packet-structure)描述的标准模式构建，并作为有效载荷携带请求ID和ping ID。

让我们找到ping请求的所需模式[此处](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L35)，并计算模式id为
`crc32_IEEE("tcp.ping random_id:long = tcp.Pong")`。转换为小端模式字节后，我们得到**9a2b084d**。

因此，我们的ADNL ping数据包将如下所示：
* 小端模式下的4字节标签大小 -> 64 + (4+8) = **76**
* 32字节随机数 -> 随机的32字节
* 4字节的ID TL模式 -> **9a2b084d**
* 8字节的请求id -> 随机的uint64数字
* 32字节的SHA256校验和，来自随机数和有效载荷

我们发送我们的数据包并等待[tcp.pong](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L23)，`random_id`将与我们在ping数据包中发送的相同。

## 从轻服务器接收信息
旨在从区块链获取信息的所有请求都包裹在[Liteserver Query](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L83)模式中，该模式又被包裹在[ADNL Query](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L22)模式中。

LiteQuery:
`liteServer.query data:bytes = Object`, id **df068c79**

ADNLQuery:
`adnl.message.query query_id:int256 query:bytes = adnl.Message`, id **7af98bb4**

LiteQuery作为`query:bytes`传递给ADNLQuery内部，最终查询作为`data:bytes`传递给LiteQuery内部。

[解析TL中的编码字节](/develop/data-formats/tl)

### getMasterchainInfo
现在，由于我们已经知道如何为Lite API生成TL数据包，我们可以请求有关当前TON masterchain块的信息。
masterchain区块在许多后续请求中用作输入参数，以指示我们需要信息的状态（时刻）。

我们正在寻找[我们需要的TL模式](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L60)，计算其ID并构建数据包：

* 小端模式下的4字节标签大小 -> 64 + (4+32+(1+4+(1+4+3)+3)) = **116**
* 32字节随机数 -> 随机的32字节
* 4字节的ID ADNLQuery模式 -> **7af98bb4**
* 32字节`query_id:int256` -> 随机的32字节
* * 1字节数组大小 -> **12**
* * 4字节的ID LiteQuery模式 -> **df068c79**
* * * 1字节数组大小 -> **4**
* * * 4字节的ID getMasterchainInfo模式 -> **2ee6b589**
* * * 3字节填充（对齐至8）
* * 3字节填充（对齐至16）
* 32字节的校验和SHA256，来自随机数和有效载荷

数据包示例（十六进制）:
```
74000000                                                             -> 包大小 (116)
5fb13

e11977cb5cff0fbf7f23f674d734cb7c4bf01322c5e6b928c5d8ea09cfd     -> 随机数
  7af98bb4                                                           -> ADNLQuery
  77c1545b96fa136b8e01cc08338bec47e8a43215492dda6d4d7e286382bb00c4   -> query_id
    0c                                                               -> 数组大小
    df068c79                                                         -> LiteQuery
      04                                                             -> 数组大小
      2ee6b589                                                       -> getMasterchainInfo
      000000                                                         -> 3字节填充
    000000                                                           -> 3字节填充
ac2253594c86bd308ed631d57a63db4ab21279e9382e416128b58ee95897e164     -> sha256
```

我们预期收到的响应为[liteServer.masterchainInfo](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L30)，包括last:[ton.blockIdExt](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/tonlib_api.tl#L51) state_root_hash:int256 和 init:[tonNode.zeroStateIdExt](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L359)。

收到的数据包与发送的数据包同样方式进行反序列化 - 具有相同算法，但方向相反，除了响应仅被[ADNLAnswer](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L23)包裹。

解码响应后，我们得到如下形式的数据包：
```
20010000                                                                  -> 包大小 (288)
5558b3227092e39782bd4ff9ef74bee875ab2b0661cf17efdfcd4da4e53e78e6          -> 随机数
  1684ac0f                                                                -> ADNLAnswer
  77c1545b96fa136b8e01cc08338bec47e8a43215492dda6d4d7e286382bb00c4        -> query_id (与请求相同)
    b8                                                                    -> 数组大小
    81288385                                                              -> liteServer.masterchainInfo
                                                                          last:tonNode.blockIdExt
        ffffffff                                                          -> workchain:int
        0000000000000080                                                  -> shard:long
        27405801                                                          -> seqno:int   
        e585a47bd5978f6a4fb2b56aa2082ec9deac33aaae19e78241b97522e1fb43d4  -> root_hash:int256
        876851b60521311853f59c002d46b0bd80054af4bce340787a00bd04e0123517  -> file_hash:int256
      8b4d3b38b06bb484015faf9821c3ba1c609a25b74f30e1e585b8c8e820ef0976    -> state_root_hash:int256
                                                                          init:tonNode.zeroStateIdExt 
        ffffffff                                                          -> workchain:int
        17a3a92992aabea785a7a090985a265cd31f323d849da51239737e321fb05569  -> root_hash:int256      
        5e994fcf4d425c0a6ce6a792594b7173205f740a39cd56f537defd28b48a0f6e  -> file_hash:int256
    000000                                                                -> 3字节填充
520c46d1ea4daccdf27ae21750ff4982d59a30672b3ce8674195e8a23e270d21          -> sha256
```

### runSmcMethod
我们已经知道如何获取masterchain区块，所以现在我们可以调用任何轻服务器方法。
让我们分析**runSmcMethod** - 这是一个调用智能合约中的函数并返回结果的方法。在这里，我们需要了解一些新的数据类型，如[TL-B](/develop/data-formats/tl-b)、[Cell](/develop/data-formats/cell-boc#cell)和[BoC](/develop/data-formats/cell-boc#bag-of-cells)。

要执行智能合约方法，我们需要构建并发送使用TL模式的请求：
```tlb
liteServer.runSmcMethod mode:# id:tonNode.blockIdExt account:liteServer.accountId method_id:long params:bytes = liteServer.RunMethodResult
```

并等待带有模式的响应：
```tlb
liteServer.runMethodResult mode:# id:tonNode.blockIdExt shardblk:tonNode.blockIdExt shard_proof:mode.0?bytes proof:mode.0?bytes state_proof:mode.1?bytes init_c7:mode.3?bytes lib_extras:mode.4?bytes exit_code:int result:mode.2?bytes = liteServer.RunMethodResult;
```

在请求中，我们看到以下字段：
1. mode:# - uint32位掩码，指示我们希望在响应中看到的内容，例如，`result:mode.2?bytes`只有在索引为2的位设置为一时才会出现在响应中。
2. id:tonNode.blockIdExt - 我们在前一章中获得的主区块状态。
3. account:[liteServer.accountId](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L27) - 工作链和智能合约地址数据。
4. method_id:long - 8字节，其中写入了调用方法名称的crc16与XMODEM表+设置了第17位 [[计算]](https://github.com/xssnick/tonutils-go/blob/88f83bc3554ca78453dd1a42e9e9ea82554e3dd2/ton/runmethod.go#L16)
5. params:bytes - [Stack](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/crypto/block/block.tlb#L783)以[BoC](/develop/data-formats/cell-boc#bag-of-cells)序列化，其中包含调用方法的参数。[[实现示例]](https://github.com/xssnick/tonutils-go/blob/88f83bc3554ca78453dd1a42e9e9ea82554e3dd2/tlb/stack.go)

例如，我们只需要`result:mode.2?bytes`，那么我们的 mode 将等于0b100，即4。在响应中，我们将获得：
1. mode:# -> 发送的内容 - 4。
2. id:tonNode.blockIdExt -> 我们的主区块，针对该区块执行了方法
3. shardblk:tonNode.blockIdExt -> 托管合约账户的分片区块
4. exit_code:int -> 4字节，是执行方法时的退出代码。如果一切顺利，则为0，如果不是，则等于异常代码。
5. result:mode.2?bytes -> [Stack](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/crypto/block/block.tlb#L783)以[BoC](/develop/data-formats/cell-boc#bag-of-cells)序列化，其中包含方法返回的值。

让我们分析调用合约`EQBL2_3lMiyywU17g-or8N7v9hDmPCpttzBPE2isF2GTzpK4`的`a2`方法并获取结果：

FunC中的方法代码：
```func
(cell, cell) a2() method_id {
  cell a = begin_cell().store_uint(0xAABBCC8, 32).end_cell();
  cell b = begin_cell().store_uint(0xCCFFCC1, 32).end_cell();
  return (a, b);
}


```

填写我们的请求：
* `mode` = 4，我们只需要结果 -> `04000000`
* `id` = 执行getMasterchainInfo的结果
* `account` = 工作链 0 (4字节 `00000000`)，和int256 [从我们的合约地址获得](/develop/data-formats/tl-b#addresses)，即32字节 `4bdbfde5322cb2c14d7b83ea2bf0deeff610e63c2a6db7304f1368ac176193ce`
* `method_id` = 从`a2`[计算](https://github.com/xssnick/tonutils-go/blob/88f83bc3554ca78453dd1a42e9e9ea82554e3dd2/ton/runmethod.go#L16)得出的id -> `0a2e010000000000`
* `params:bytes` = 我们的方法不接受输入参数，因此我们需要传递一个空栈（`000000`，cell3字节 - 栈深度0）以[BoC](/develop/data-formats/cell-boc#bag-of-cells)序列化 -> `b5ee9c72010101010005000006000000` -> 序列化为字节并得到 `10b5ee9c72410101010005000006000000000000` 0x10 - 大小，在末尾的 3 字节是填充。

我们得到的响应是：
* `mode:#` -> 不感兴趣
* `id:tonNode.blockIdExt` -> 不感兴趣
* `shardblk:tonNode.blockIdExt` -> 不感兴趣
* `exit_code:int` -> 如果执行成功则为0
* `result:mode.2?bytes` -> [Stack](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/crypto/block/block.tlb#L783)包含方法返回的数据，以[BoC](/develop/data-formats/cell-boc#bag-of-cells)格式提供，我们将对其进行解包。

在`result`中我们收到`b5ee9c7201010501001b000208000002030102020203030400080ccffcc1000000080aabbcc8`，这是包含数据的[BoC](/develop/data-formats/cell-boc#bag-of-cells)。当我们反序列化它时，我们得到一个cell：
```json
32[00000203] -> {
  8[03] -> {
    0[],
    32[0AABBCC8]
  },
  32[0CCFFCC1]
}
```
如果我们解析它，我们将得到2个cell类型的值，这是我们的FunC方法返回的。根cell的前3字节`000002` - 是栈的深度，即2。这意味着该方法返回了2个值。

我们继续解析，接下来的8位（1字节）是当前堆栈级别的值类型。对于某些类型，它可能需要2个字节。可能的选项可以在[schema](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/crypto/block/block.tlb#L766)中看到。
在我们的案例中，我们有`03`，这意味着：
```tlb
vm_stk_cell#03 cell:^Cell = VmStackValue;
```
所以我们的值类型是 - cell，并且根据模式，它将值本身作为引用存储。但是，如果我们看看栈元素存储模式：
```tlb
vm_stk_cons#_ {n:#} rest:^(VmStackList n) tos:VmStackValue = VmStackList (n + 1);
```
我们将看到第一个链接`rest:^(VmStackList n)` - 是栈中下一个值的cell，而我们的值`tos:VmStackValue`排在第二位，所以要获得我们需要的值，我们需要读取第二个链接，即`32[0CCFFCC1]` - 这是合约返回的第一个cell。

现在我们可以深入并获取栈中的第二个元素，我们通过第一个链接，现在我们有：
```json
8[03] -> {
    0[],
    32[0AABBCC8]
  }
```
我们重复相同的过程。第一个8位 = `03` - 即又是一个cell。第二个引用是值`32[0AABBCC8]`，由于我们的栈深度为2，我们完成了遍历。总体上，我们有2个值由合约返回 - `32[0CCFFCC1]`和`32[0AABBCC8]`。

请注意，它们的顺序是相反的。调用函数时也需要以相反的顺序传递参数，与我们在FunC代码中看到的顺序相反。

[实现示例](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/ton/runmethod.go#L24)

### getAccountState
要获取账户状态数据，如余额、代码和合约数据，我们可以使用[getAccountState](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L68)。请求需要一个[最新的主链块](#getmasterchaininfo)和账户地址。响应中，我们将接收到TL结构[AccountState](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/lite_api.tl#L38)。

让我们分析AccountState TL模式：
```tlb
liteServer.accountState id:tonNode.blockIdExt shardblk:tonNode.blockIdExt shard_proof:bytes proof:bytes state:bytes = liteServer.AccountState;
```
1. `id` - 我们的主链区块，我们从中获取了数据。
2. `shardblk` - 我们账户所在的工作链分片区块，我们从中接收数据。
3. `shard_proof` - 分片区块的Merkle证明。
4. `proof` - 账户状态的Merkle证明。
5. `state` - [BoC](/develop/data-formats/cell-boc#bag-of-cells) TL-B [账户状态模式](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/crypto/block/block.tlb#L232)。

我们需要的所有数据都在state中，我们将对其进行分析。

例如，让我们获取账户`EQAhE3sLxHZpsyZ_HecMuwzvXHKLjYx4kEUehhOy2JmCcHCT`的状态，响应中的`state`将是（撰写本文时）：
```hex
b5ee9c720102350100051e000277c0021137b0bc47669b3267f1de70cbb0cef5c728b8d8c7890451e8613b2d899827026a886043179d3f6000006e233be8722201d7d239dba7d818134001020114ff00f4a413f4bcf2c80b0d021d0000000105036248628d00000000e003040201cb05060013a03128bb16000000002002012007080043d218d748bc4d4f4ff93481fd41c39945d5587b8e2aa2d8a35eaf99eee92d9ba96004020120090a0201200b0c00432c915453c736b7692b5b4c76f3a90e6aeec7a02de9876c8a5eee589c104723a18020004307776cd691fbe13e891ed6dbd15461c098b1b95c822af605be8dc331e7d45571002000433817dc8de305734b0c8a3ad05264e9765a04a39dbe03dd9973aa612a61f766d7c02000431f8c67147ceba1700d3503e54c0820f965f4f82e5210e9a3224a776c8f3fad1840200201200e0f020148101104daf220c7008e8330db3ce08308d71820f90101d307db3c22c00013a1537178f40e6fa1f29fdb3c541abaf910f2a006f40420f90101d31f5118baf2aad33f705301f00a01c20801830abcb1f26853158040f40e6fa120980ea420c20af2670edff823aa1f5340b9f2615423a3534e2a2d2b2c0202cc12130201201819020120141502016616170003d1840223f2980bc7a0737d0986d9e52ed9e013c7a21c2b2f002d00a908b5d244a824c8b5d2a5c0b5007404fc02ba1b04a0004f085ba44c78081ba44c3800740835d2b0c026b500bc02f21633c5b332781c75c8f20073c5bd0032600201201a1b02012020210115bbed96d5034705520db3c8340201481c1d0201201e1f0173b11d7420c235c6083e404074c1e08075313b50f614c81e3d039be87ca7f5c2ffd78c7e443ca82b807d01085ba4d6dc4cb83e405636cf0069006031003daeda80e800e800fa02017a0211fc8080fc80dd794ff805e47a0000e78b64c00015ae19574100d56676a1ec40020120222302014824250151b7255b678626466a4610081e81cdf431c24d845a4000331a61e62e005ae0261c0b6fee1c0b77746e102d0185b5599b6786abe06fedb1c68a2270081e8f8df4a411c4605a400031c34410021ae424bae064f613990039e2ca840090081e886052261c52261c52265c4036625ccd88302d02012026270203993828290111ac1a6d9e2f81b609402d0015adf94100cc9576a1ec1840010da936cf0557c1602d0015addc2ce0806ab33b50f6200220db3c02f265f8005043714313db3ced542d34000ad3ffd3073004a0db3c2fae5320b0f26212b102a425b3531cb9b0258100e1aa23a028bcb0f269820186a0f8010597021110023e3e308e8d11101fdb3c40d778f44310bd05e254165b5473e7561053dcdb3c54710a547abc2e2f32300020ed44d0d31fd307d307d33ff404f404d10048018e1a30d20001f2a3d307d3075003d70120f90105f90115baf2a45003e06c2170542013000c01c8cbffcb0704d6db3ced54f80f70256e5389beb198106e102d50c75f078f1b30542403504ddb3c5055a046501049103a4b0953b9db3c5054167fe2f800078325a18e2c268040f4966fa52094305303b9de208e1638393908d2000197d3073016f007059130e27f080705926c31e2b3e63006343132330060708e2903d08308d718d307f40430531678f40e6fa1f2a5d70bff544544f910f2a6ae5220b15203bd14a1236ee66c2232007e5230be8e205f03f8009322d74a9802d307d402fb0002e83270c8ca0040148040f44302f0078e1771c8cb0014cb0712cb0758cf0158cf1640138040f44301e201208e8a104510344300db3ced54925f06e234001cc8cb1fcb07cb07cb3ff400f400c9
```

[解析此BoC](/develop/data-formats/cell-boc#bag-of-cells)并获取

<details>
  <summary>large cell</summary>

  ```json
473[C0021137B0BC47669B3267F1DE70CBB0CEF5C728B8D8C7890451E8613B2D899827026A886043179D3F6000006E233BE8722201D7D239DBA7D818130_] -> {
  80[FF00F4A413F4BCF2C80B] -> {
    2[0_] -> {
      4[4_] -> {
        8[CC] -> {
          2[0_] -> {
            13[D180],
            141[F2980BC7A0737D0986D9E52ED9E013C7A218] -> {
              40[D3FFD30730],
              48[01C8CBFFCB07]
            }
          },
          6[64] -> {
            178[00A908B5D244A824C8B5D2A5C0B5007404FC02BA1B048_],
            314[085BA44C78081BA44C3800740835D2B0C026B500BC02F21633C5B332781C75C8F20073C5BD00324_]
          }
        },
        2[0_] -> {
          2[0_] -> {
            84[BBED96D5034705520DB3C_] -> {
              112[C8CB1FCB07CB07CB3FF400F400C9]
            },
            4[4_] -> {
              2[0_] -> {
                241[AEDA80E800E800FA02017A0211FC8080FC80DD794FF805E47A0000E78B648_],
                81[AE19574100D56676A1EC0_]
              },
              458[B11D7420C235C6083E404074C1E08075313B50F614C81E3D039BE87CA7F5C2FFD78C7E443CA82B807D01085BA4D6DC4CB83E405636CF0069004_] -> {
                384[708E2903D08308D718D307F40430531678F40E6FA1F2A5D70BFF544544F910F2A6AE5220B15203BD14A1236EE66C2232]
              }
            }
          },
          2[0_] -> {
            2[0_] -> {
              323[B7255B678626466A4610081E81CDF431C24D845A4000331A61E62E005AE0261C0B6FEE1C0B77746E0_] -> {
                128[ED44D0D31FD307D307D33FF404F404D1]
              },
              531[B5599B6786ABE06FEDB1C68A2270081E8F8DF4A411C4605A400031C34410021AE424BAE064F613990039E2CA840090081E886052261C52261C52265C4036625CCD882_] -> {
                128[ED44D0D31FD307D307D33FF404F404D1]
              }
            },
            4[4_] -> {
              2[0_] -> {
                65[AC1A6D9E2F81B6090_] -> {
                  128[ED44D0D31FD307D307D33FF404F404D1]
                },
                81[ADF94100CC9576A1EC180_]
              },
              12[993_] -> {
                50[A936CF0557C14_] -> {
                  128[ED44D0D31FD307D307D33FF404F404D1]
                },
                82[ADDC2CE0806AB33B50F60_]
              }
            }
          }
        }
      },
      872[F220C7008E8330DB3CE08308D71820F90101D307DB3C22C00013A1537178F40E6FA1F29FDB3C541ABAF910F2A006F40420F90101D31F5118BAF2AAD33F705301F00A01C20801830ABCB1F26853158040F40E6FA120980EA420C20AF2670EDFF823AA1F5340B9F2615423A3534E] -> {
        128[DB3C02F265F8005043714313DB3CED54] -> {
          128[ED44D0D31FD307D307D33FF404F404D1],
          112[C8CB1FCB07CB07CB3FF400F400C9]
        },
        128[ED44D0D31FD307D307D33FF404F404D1],
        40[D3FFD30730],
        640[DB3C2FAE5320B0F26212B102A425B3531CB9B0258100E1AA23A028BCB0F269820186A0F8010597021110023E3E308E8D11101FDB3C40D778F44310BD05E254165B5473E7561053DCDB3C54710A547ABC] -> {
          288[018E1A30D20001F2A3D307D3075003D70120F90105F90115BAF2A45003E06C2170542013],
          48[01C8CBFFCB07],
          504[5230BE8E205F03F8009322D74A9802D307D402FB0002E83270C8CA0040148040F44302F0078E1771C8CB0014CB0712CB0758CF0158CF1640138040F44301E2],
          856[DB3CED54F80F70256E5389BEB198106E102D50C75F078F1B30542403504DDB3C5055A046501049103A4B0953B9DB3C5054167FE2F800078325A18E2C268040F4966FA52094305303B9DE208E1638393908D2000197D3073016F007059130E27F080705926C31E2B3E63006] -> {
            112[C8CB1FCB07CB07CB3FF400F400C9],
            384[708E2903D08308D718D307F40430531678F40E6FA1F2A5D70BFF544544F910F2A6AE5220B15203BD14A1236EE66C2232],
            504[5230BE8E205F03F8009322D74A9802D307D402FB0002E83270C8CA0040148040F44302F0078E1771C8CB0014CB0712CB0758CF0158CF1640138040F44301E2],
            128[8E8A104510344300DB3CED54925F06E2] -> {
              112[C8CB1FCB07CB07CB3FF400F400C9]
            }
          }
        }
      }
    }
  },
  114[0000000105036248628D00000000C_] -> {
    7[CA] -> {
      2[0_] -> {
        2[0_] -> {
          266[2C915453C736B7692B5B4C76F3A90E6AEEC7A02DE9876C8A5EEE589C104723A1800_],
          266[07776CD691FBE13E891ED6DBD15461C098B1B95C822AF605BE8DC331E7D45571000_]
        },
        2[0_] -> {
          266[3817DC8DE305734B0C8A3AD05264E9765A04A39DBE03DD9973AA612A61F766D7C00_],
          266[1F8C67147CEBA1700D3503E54C0820F965F4F82E5210E9A3224A776C8F3FAD18400_]
        }
      },
      269[D218D748BC4D4F4FF93481FD41C39945D5587B8E2AA2D8A35EAF99EEE92D9BA96000]
    },
    74[A03128BB16000000000_]
  }
}
  ```

</details>

现在我们需要根据TL-B结构解析cell：
```tlb
account_none$0 = Account;

account$1 addr:MsgAddressInt storage_stat:StorageInfo
          storage:AccountStorage = Account;
```
我们的结构引用了其他结构，例如：
```tlb
anycast_info$_ depth:(#<= 30) { depth >= 1 } rewrite_pfx:(bits depth) = Anycast;
addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt;
addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9) workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
   
storage_info$_ used:StorageUsed last_paid:uint32 due_payment:(Maybe Grams) = StorageInfo;
storage_used$_ cells:(VarUInteger 7) bits:(VarUInteger 7) public_cells:(VarUInteger 7) = StorageUsed;
  
account_storage$_ last_trans_lt:uint64 balance:CurrencyCollection state:AccountState = AccountStorage;

currencies$_ grams:Grams other:ExtraCurrencyCollection = CurrencyCollection;
           
var_uint$_ {n:#} len:(#< n) value:(uint (len * 8)) = VarUInteger n;
var_int$_ {n:#} len:(#< n) value:(int (len * 8)) = VarInteger n;
nanograms$_ amount:(VarUInteger 16) = Grams;  
           
account_uninit$00 = AccountState;
account_active$1 _:StateInit = AccountState;
account_frozen$01 state_hash:bits256 = AccountState;
```

我们可以看到，cell包含很多数据，但我们将分析主要情况并获取余额。其余的可以以类似的方式进行分析。

让我们开始解析。在根cell数据中，我们有：
```
C0021137B0BC47669B3267F1DE70CBB0CEF5C728B8D8C7890451E8613B2D899827026A886043179D3F6000006E233BE8722201D7D239DBA7D818130_
```
转换为二进制形式并获取：
```
11000000000000100001000100110111101100001011110001000111011001101001101100110010011001111111000111011110011100001100101110110000110011101111010111000111001010001011100011011000110001111000100100000100010100011110100001100001001110110010110110001001100110000010011100000010011010101000100001100000010000110001011110011101001111110110000000000000000000000110111000100011001110111110100001110010001000100000000111010111110100100011100111011011101001111101100000011000000100110
```
让我们看看我们的主要TL-B结构，我们看到我们有两个可能的选项 - `account_none$0`或`account$1`。我们可以通过读取符号$后声明的前缀来理解我们拥有哪个选项，在我们的例子中，它是1位。如果是0，则我们拥有`account_none`，如果是1，则`account`。

我们上面的数据中的第一个bit=1，所以我们正在处理`account$1`，将使用模式：
```tlb
account$1 addr:MsgAddressInt storage_stat:StorageInfo
          storage:AccountStorage = Account;
```
接下来我们有`addr:MsgAddressInt`，我们看到MsgAddressInt也有几个选项：
```tlb
addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt;
addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9) workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
```
要理解应该使用哪一个，我们像上次一样，读取前缀位，这次我们读取2个位。我们去掉已读的位，“1000000...”剩下，我们读取前2个位得到“10”，这意味着我们正在处理`addr_std$10`。

接下来我们需要解析`anycast:(Maybe Anycast)`，Maybe意味着我们应该读取1位，如果是1，则读取Anycast，否则跳过。我们剩余的位是“00000...”，读取1位，它是0，所以我们跳过Anycast。

接下来，我们有`workchain_id:int8`，这里很简单，我们读取8个位，这将是工作链ID。我们读取接下来的8个位，全部为零，所以工作链为0。

接下来，我们读取`address:bits256`，这是地址的256个位，与`workchain_id`一样。在读取时，我们得到`21137B0BC47669B3267F1DE70CBB0CEF5C728B8D8C7890451E8613B2D8998270`的十六进制表示。

我们读取了地址`addr:MsgAddressInt`，然后我们有`storage_stat:StorageInfo`来自主结构，它的模式是：
```tlb
storage_info$_ used:StorageUsed last_paid:uint32 due_payment:(Maybe Grams) = StorageInfo;
```
首先是`used:StorageUsed`，它的模式是：
```tlb
storage_used$_ cells:(VarUInteger 7) bits:(VarUInteger 7) public_cells:(VarUInteger 7) = StorageUsed;
```
这是用于存储账户数据的cell和位的数量。每个字段都定义为`VarUInteger 7`，这意味着动态大小的uint，但最多为7位。你可以根据模式了解它是如何排列的：
```tlb
var_uint$_ {n:#} len:(#< n) value:(uint (len * 8)) = VarUInteger n;
```
在我们的案例中，n将等于7。在len中，我们将有`(#< 7)`，这意味着可以容纳最多7的数字的位数。你可以通过将7-1=6转换为二进制形式 - `110`，我们得到3个位，所以长度len = 3个位。而value是`(uint (len * 8))`。要确定它，我们需要读取3个位的长度，得到一个数字并乘以8，这将是`value`的大小，也就是需要读取的位数以获取VarUInteger的值。

读取`cells:(VarUInteger 7)`，取我们根cell的下一个位，看接下来的16个位以理解，这是`0010011010101000`。我们读取前3个位，这是`001`，即1，我们得到大小(uint (1 * 8))，我们得到uint 8，我们读取8个位，它将是`cells`，`00110101`，即十进制中的53。对于 `bits` 和 `public_cells`，我们做同样的操作。

我们成功读取了`used:StorageUsed`，接下来我们有`last_paid:uint32`，我们读取32个位。`due_payment:(Maybe Grams)`在这里也很简单，Maybe将是0，所以我们跳过Grams。但是，如果Maybe是1，我们可以看看Grams的`amount:(VarUInteger 16) = Grams`模式并立即理解我们已经知道如何处理这个。像上次一样，只是我们有16而不是7。

接下来我们有`storage:AccountStorage`，它的模式是：
```tlb
account_storage$_ last_trans_lt:uint64 balance:CurrencyCollection state:AccountState = AccountStorage;
```
我们读取`last_trans_lt:uint64`，这是64个位，存储最后一次账户交易的lt。最后是余额，由模式表示：
```tlb
currencies$_ grams:Grams other:ExtraCurrencyCollection = CurrencyCollection;
```
从这里我们将读取`grams:Grams`，这将是以 nanotones 计的账户余额。
`grams:Grams`是`VarUInteger 16`，要存储16（二进制形式`10000`，减去1得到`1111`），那么我们读取前4个位，并将得到的值乘以8，然后读取接收到的位数，它是我们的余额。

让我们根据我们的数据分析剩余的位：
```
100000000111010111110100100011100111011011101001111101100000011000000100110
```
读取前4个位 - `1000`，这是8。8*8=64，读取接下来的64个位 = `0000011101011111010010001110011101101110100111110110000001100000`，去掉额外的零位，我们得到`11101011111010010001110011101101110100111110110000001100000`，即等于`531223439883591776`，将 nano 转换为TON，我们得到`531223439.883591776`。

我们将在这里停止，因为我们已经分析了所有主要情况，其余的可以以与我们已分析的类似的方式获得。此外，关于解析TL-B的更多信息可以在[官方文档](/develop/data-formats/tl-b-language)中找到。

### 其他方法
现在，学习了所有信息，您也可以调用并处理其他轻服务器方法的响应。同样的原理 :)

## 握手的其他技术细节

### 获取密钥ID
密钥ID是序列化TL模式的SHA256哈希。

最常用的TL模式密钥是：
```tlb
pub.ed25519 key:int256 = PublicKey -- ID c6b41348
pub.aes key:int256 = PublicKey     -- ID d4adbc2d
pub.overlay name:bytes = PublicKey -- ID cb45ba34
pub.unenc data:bytes = PublicKey   -- ID 0a451fb6
pk.aes key:int256 = PrivateKey     -- ID 3751e8a5
```

例如，对于握手中使用的ED25519类型密钥，密钥ID将是
**[0xC6, 0xB4, 0x13, 0x48]** 和 **公钥**的SHA256哈希（36字节数组，前缀+密钥）

[代码示例](https://github.com/xssnick/tonutils-go/blob/2b5e5a0e6ceaf3f28309b0833cb45de81c580acc/liteclient/crypto.go#L16)

### 握手数据包数据加密
握手数据包以半开放形式发送，只有160字节被加密，包含有关永久密码的信息。

要加密它们，我们需要一个AES-CTR密码，我们需要160字节的SHA256哈希和[ECDH共享密钥](#使用ECDH获取共享密钥)

密码构建如下：
* key = （公钥的0 - 15字节）+（哈希的16 - 31字节）
* iv = （哈希的0 - 3字节）+（公钥的20 - 31字节）

密码组装后，我们用它加密我们的160字节。

[代码示例](https://github.com/xssnick/tonutils-go/blob/2b5e5a0e6ceaf3f28309b0833cb45de81c580acc/liteclient/connection.go#L361)

### 使用ECDH获取共享密钥
要计算共享密钥，我们需要我们的私钥和服务器的公钥。

DH的本质是获取共享的密钥，而不暴露私人信息。我将给出一个这是如何发生的示例，以最简化的形式。假设我们需要生成我们和服务器之间的共享密钥，过程将如下：
1. 我们生成secret和公共数字，如**6**和**7**
2. 服务器生成secret和公共数字，如**5**和**15**
3. 我们与服务器交换公共数字，发送**7**给服务器，它发送给我们**15**。
4. 我们计算：**7^6 mod 15 = 4**
5. 服务器计算：**7^5 mod 15 = 7**
6. 我们交换收到的数字，我们给服务器**4**，它给我们**7**
7. 我们计算**7^6 mod 15 = 4**
8. 服务器计算：**4^5 mod 15 = 4**
9. 共享密钥 = **4**

为了简洁起见，将省略ECDH本身的细节。它是通过在曲线上找到一个共同点，使用两个密钥，私钥和公钥来计算的。如果感兴趣，最好单独阅读。

[代码示例](https://github.com/xssnick/tonutils-go/blob/2b5e5a0e6

ceaf3f28309b0833cb45de81c580acc/liteclient/crypto.go#L32)

## 参考资料

_这里是[Oleg Baranov](https://github.com/xssnick)撰写的原始文章的[链接](https://github.com/xssnick/ton-deep-doc/blob/master/ADNL-TCP-Liteserver.md)。_
