import Feedback from '@site/src/components/Feedback';

# TON 分布式哈希表（DHT）服务

Please see the implementations:

- https://github.com/ton-blockchain/ton/tree/master/dht
- https://github.com/ton-blockchain/ton/tree/master/dht-server

## 概览

类 Kademlia 的分布式哈希表（DHT）在 TON 的网络部分扮演着至关重要的角色，用于定位网络中的其他节点。

TON DHT 的键是简单的 256 位整数。在大多数情况下，它们是作为 TL-序列化对象的 SHA256 计算得出。

这些 256 位键所分配的值本质上是长度有限的任意字节串。这样的字节串的解释由相应键的原像决定；
通常情况下，查找键的节点和存储键的节点都知道这一点。 The meaning of these byte strings is determined by the pre-image of the corresponding key; this is typically known by both the node performing the key lookup and the node storing the key.

在最简单的情况下，键代表某个节点的 ADNL 地址，值可以是其 IP 地址和端口。

TON DHT 的键值映射保存在 DHT 节点上。

## DHT 节点

Each DHT node has a 256-bit DHT address. 每个 DHT 节点都有一个 256 位的 DHT 地址。与 ADNL 地址不同，DHT 地址不应该太频繁地更改，否则其他节点将无法定位它们正在寻找的键。

预计键 `K` 的值将存储在与 `K` 最近的 `S` 个 Kademlia 节点上。

Kademlia 距离 = 256 位键 `XOR` 256 位 DHT 节点地址（与地理位置无关）。 This distance does not relate to geographic location.

`S` is a small parameter, for instance, `S = 7`, which helps improve the reliability of the DHT. If the key were stored only on a single node (the nearest one to `K`) the value of that key would be lost if that node were to go offline.

## Kademlia 路由表

任何参与 DHT 的节点通常都会维护一个 Kademlia 路由表。

This table consists of 256 buckets, numbered from 0 to 255. The `i`-th bucket contains information about known nodes that lie within a Kademlia distance from `2^i` to `2^(i+1) − 1` from the node’s address `a`. Each bucket holds a fixed number of the “best” nodes, along with some additional candidate nodes.

这些信息包括它们的 DHT 地址、IP 地址和 UDP 端口，以及一些可用性信息，例如最后一次 ping 的时间和延迟。

When a Kademlia node discovers another Kademlia node through a query, it places that node into the appropriate bucket as a candidate. If some of the “best” nodes in that bucket become unresponsive (for example, if they do not reply to ping queries for an extended period), they can be replaced by some of these candidates. This process ensures that the Kademlia routing table remains populated.

## 键值对

可以在 TON DHT 中添加和更新键值对。 The rules for these updates can vary. In some cases, they allow for the old value to be replaced with a new one as long as the new value is signed by the owner or creator. This signature must be retained as part of the value so that it can be verified later by any other nodes that receive this key's value.

In other cases, the old value impacts the new value in some way. For example, the old value may contain a sequence number, and it can only be overwritten if the new sequence number is larger. This helps prevent replay attacks.

TON DHT 不仅用于存储 ADNL 节点的 IP 地址，还用于其他目的 - 它可以存储特定 TON 存储种子的节点地址列表、包含在覆盖子网络中的节点地址列表、TON 服务的 ADNL 地址或 TON 区块链账户的 ADNL 地址等。 It can store a list of addresses of nodes that are holding a specific torrent in TON Storage, a list of addresses of nodes included in an overlay subnetwork, ADNL addresses of TON services, and ADNL addresses of accounts on the TON Blockchain, among others.

:::info
更多关于 TON DHT 的信息，请参阅 [DHT](/develop/network/dht) 这篇文章，或阅读 [TON 白皮书](https://docs.ton.org/ton.pdf) 的第 3.2 章。 of the [TON Whitepaper](https://docs.ton.org/ton.pdf).
:::

