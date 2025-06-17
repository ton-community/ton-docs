import Feedback from '@site/src/components/Feedback';

# 覆盖子网络

Please see the implementation:

- https://github.com/ton-blockchain/ton/tree/master/overlay

## 概述

The architecture of the TON is designed to support multiple chains that can operate simultaneously and independently, whether they are private or public. Nodes have the flexibility to choose which shards and chains they store and process.

Despite this variability, the communication protocol remains consistent due to its universal nature. Protocols such as DHT (Distributed Hash Table), RLDP (Reliable Layered Datagram Protocol), and overlays facilitate this functionality.

We are already familiar with the first two protocols; in this section, we will focus on overlays.

Overlays are responsible for partitioning a single network into additional subnetworks. These overlays can be public, allowing anyone to connect, or private, requiring specific credentials for access, which are known only to a limited group of individuals. All chains in the TON ecosystem, including the MasterChain, communicate using their respective overlays. To join an overlay, a node must locate other nodes that are already part of it and begin exchanging data with them.

For public overlays, you can discover nodes using the DHT protocol.

## ADNL vs overlay networks

In contrast to ADNL, TON overlay networks typically do not allow the sending of datagrams to arbitrary nodes. Instead, they establish "semi-permanent links" between specific nodes, known as "neighbors," within the overlay network. Messages are usually forwarded along these links, meaning communication happens from one node to one of its neighbors.

Each overlay subnetwork is assigned a 256-bit network identifier, which is usually equivalent to a SHA256 that describes the overlay network as a TL-serialized object.

重叠子网可以是公共的，也可以是私有的。

These subnetworks operate using a special [gossip](https://en.wikipedia.org/wiki/Gossip_protocol) protocol.

## 与overlay节点的互动

We have already analyzed an example of finding overlay nodes in an article about Distributed Hash Tables (DHT). 我们已经在关于DHT的文章中分析了一个查找overlay节点的例子，在[搜索存储区块链状态的节点](/develop/network/dht#search-for-nodes-that-store-the-state-of-the-blockchain)一节中。在这一节中，我们将专注于与它们的互动。

In this section, we will focus on how to interact with these nodes.

When querying the DHT, we will retrieve the addresses of the overlay nodes. 当查询DHT时，我们将获得overlay节点的地址，从中我们可以使用[overlay.getRandomPeers](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L237)查询找出这个overlay的其他节点的地址。一旦我们连接了足够数量的节点，我们就可以从它们那里接收所有区块信息和其他链事件，以及向它们发送我们的交易以供处理。

After connecting to a sufficient number of nodes, we will be able to receive information about all blocks and other chain events from them. Additionally, we can send our transactions to these nodes for processing.

### 寻找更多邻居节点(neighbors)

为此，向任何已知的overlay节点发送`overlay.getRandomPeers`请求，序列化TL模式：

Make sure to serialize the TL schema:

```tlb
overlay.node id:PublicKey overlay:int256 version:int signature:bytes = overlay.Node;
overlay.nodes nodes:(vector overlay.node) = overlay.Nodes;

overlay.getRandomPeers peers:overlay.nodes = overlay.Nodes;
```

`peers` - 应包含我们已知的节点，这样我们就不会再次得到它们，但由于我们还不知道任何节点，`peers.nodes`将是一个空数组。 Since we currently do not know any peers, `peers.nodes` will initially be an empty array.

If we want to retrieve information, participate in the overlay, and receive broadcasts, we need to include information about our own node in the `peers` array during the request. Once the peers are aware of our presence, they will begin to send us broadcasts using ADNL or RLDP.

overlay内的每个请求都必须以TL模式为前缀：

```tlb
overlay.query overlay:int256 = True;
```

`overlay`应该是overlay的id - `tonNode.ShardPublicOverlayId`模式键的id - 与我们用于搜索DHT时使用的相同。

我们需要通过简单地连接2个序列化的字节数组来连接2个序列化的模式，`overlay.query`将首先出现，其次是`overlay.getRandomPeers`。

We then wrap the resulting array in the `adnl.message.query` schema and send it via ADNL. In response, we expect `overlay.nodes`, which will be a list of overlay nodes that we can connect to. If necessary, we can repeat the request to any new nodes until we acquire enough connections.

### 功能请求

一旦建立了连接，我们可以使用[请求](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L413) `tonNode.*`访问overlay节点。

We utilize the RLDP protocol for these types of requests. It's crucial to remember that every query in the overlay must begin with the `overlay.query` prefix.

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

_这里是[原文链接](https://github.com/xssnick/ton-deep-doc/blob/master/Overlay-Network.md)，作者是[Oleg Baranov](https://github.com/xssnick)。_

<Feedback />

