# 覆盖子网络

实现：

- https://github.com/ton-blockchain/ton/tree/master/overlay

## 概览

在像TON这样的多区块链系统中，即使是完整节点通常也只对获取某些分片链的更新（即新区块）感兴趣。为此，在TON网络内部，基于ADNL协议，为每个分片链构建了一个特殊的覆盖子网络 (Overlay Subnetwork)。

此外，覆盖子网络还用于TON存储、TON代理等的运行。

## ADNL 与覆盖网络

与ADNL不同的是，TON的覆盖网络 (Overlay Network) 通常不支持向其他任意节点发送数据报。相反，某些“半永久链接”在特定节点（相对于正在讨论的的覆盖网络，这被称为“邻居节点(neighbors)”）之间建立，消息通常沿着这些链接转发（即从一个节点到它的一个邻居节点(neighbors)）。

每个覆盖子网络都有一个通常等于覆盖网络描述的SHA256的256位网络标识符——一个TL序列化对象。

覆盖子网络可以是公开的或私有的。

覆盖子网络根据一种特殊的[gossip协议](https://en.wikipedia.org/wiki/Gossip_protocol)工作。

:::info
在[覆盖子网络](/develop/network/overlay)文章中阅读更多关于覆盖的信息，或者在[TON白皮书](https://ton.org/docs/ton.pdf)的第3.3章中查看。
:::
