# 覆盖子网络

TON的架构构建方式使得许多链可以同时且独立地存在于其中 - 它们可以是私有的或公共的。
节点能够选择它们存储和处理的分片和链。
同时，由于其通用性，通信协议保持不变。像DHT、RLDP和Overlays这样的协议使这成为可能。
我们已经熟悉前两者，在本节中我们将了解Overlay是什么。

Overlay负责将单个网络划分为额外的子网络。Overlay既可以是公共的，任何人都可以连接，也可以是私有的，需要额外的凭证才能进入，这些凭证只为少数人所知。

TON中的所有链，包括主链，都使用它们自己的overlay进行通信。要加入它，你需要找到已经在其中的节点，并开始与它们交换数据。对于公共overlay，你可以使用DHT找到节点。

## 与overlay节点的互动

我们已经在关于DHT的文章中分析了一个查找overlay节点的例子，在[搜索存储区块链状态的节点](/develop/network/dht#search-for-nodes-that-store-the-state-of-the-blockchain)一节中。在这一节中，我们将专注于与它们的互动。

当查询DHT时，我们将获得overlay节点的地址，从中我们可以使用[overlay.getRandomPeers](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L237)查询找出这个overlay的其他节点的地址。一旦我们连接了足够数量的节点，我们就可以从它们那里接收所有区块信息和其他链事件，以及向它们发送我们的交易以供处理。

### 寻找更多邻居节点(neighbors)

让我们看一个在overlay中获取节点的例子。

为此，向任何已知的overlay节点发送`overlay.getRandomPeers`请求，序列化TL模式：

```tlb
overlay.node id:PublicKey overlay:int256 version:int signature:bytes = overlay.Node;
overlay.nodes nodes:(vector overlay.node) = overlay.Nodes;

overlay.getRandomPeers peers:overlay.nodes = overlay.Nodes;
```

`peers` - 应包含我们已知的节点，这样我们就不会再次得到它们，但由于我们还不知道任何节点，`peers.nodes`将是一个空数组。

如果我们不只是想获取一些信息，而是想参与overlay并获取广播，我们还应该在`peers`中添加我们节点的信息，从中我们发出请求。当对方获取到我们的信息 - 他们将开始使用ADNL或RLDP向我们发送广播。

overlay内的每个请求都必须以TL模式为前缀：

```tlb
overlay.query overlay:int256 = True;
```

`overlay`应该是overlay的id - `tonNode.ShardPublicOverlayId`模式键的id - 与我们用于搜索DHT时使用的相同。

我们需要通过简单地连接2个序列化的字节数组来连接2个序列化的模式，`overlay.query`将首先出现，其次是`overlay.getRandomPeers`。

我们将结果数组包裹在`adnl.message.query`模式中并通过ADNL发送。作为回应，我们等待`overlay.nodes` - 这将是我们可以连接的overlay节点的列表，并且如果需要，重复向新的节点发送相同的请求，直到我们获得足够的连接。

### 功能请求

一旦建立了连接，我们可以使用[请求](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L413) `tonNode.*`访问overlay节点。

对于此类请求，使用的是 RLDP 协议。重要的是，不要忘记 `overlay.query` 前缀--overlay中的每个查询都必须使用它。

请求本身并无异常，与我们[在有关 ADNL TCP 的文章中所做的](/develop/network/adnl-tcp#getmasterchaininfo)非常相似。

例如，"downloadBlockFull "请求使用的是我们已经熟悉的区块 ID 模式：

```tlb
tonNode.downloadBlockFull block:tonNode.blockIdExt = tonNode.DataFull;
```

通过传递它，我们将能够下载关于区块的完整信息，作为回应我们将收到：

```tlb
tonNode.dataFull id:tonNode.blockIdExt proof:bytes block:bytes is_link:Bool = tonNode.DataFull;
  or
tonNode.dataFullEmpty = tonNode.DataFull;
```

如果存在，`block`字段将包含TL-B格式的数据。

因此，我们可以直接从节点获得信息。

## 参考资料

*这里是[原文链接](https://github.com/xssnick/ton-deep-doc/blob/master/Overlay-Network.md)，作者是[Oleg Baranov](https://github.com/xssnick)。*
