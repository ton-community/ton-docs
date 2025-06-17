import Feedback from '@site/src/components/Feedback';

# ADNL 协议

https://github.com/ton-blockchain/ton/tree/master/adnl

## 概览

TON的基石是抽象数据报网络层（ADNL）。

这是一个基于**UDP**在**IPv4**（将来是IPv6）之上运行的覆盖层、点对点、不可靠（小尺寸）数据报协议，如果UDP不可用，可以选择**TCP备选**。 Additionally, it has an optional **TCP fallback** for instances when UDP is unavailable.

## ADNL 地址

每个参与者都有一个256位的ADNL地址。

ADNL协议允许您仅使用ADNL地址发送（不可靠）和接收数据报。IP地址和端口由ADNL协议隐藏。

ADNL地址本质上等同于一个256位的ECC公钥。这个公钥可以任意生成，从而为节点创建尽可能多的不同网络身份。然而，为了接收（并解密）发给接收地址的消息，必须知道相应的私钥。

However, the corresponding private key must be known to receive and decrypt messages intended for a specific address.

实际上，ADNL地址不是公钥本身；相反，它是一个序列化TL对象的256位SHA256哈希，该对象可以根据其构造器来描述几种类型的公钥和地址。 Depending on its constructor, this TL object can represent various types of public keys and addresses.

## 加密与安全

通常，每个发送的数据报都由发送方签名，并加密，以便只有接收方可以解密消息并通过签名来验证其完整性。

## 邻居表

A TON ADNL node will typically maintain a **neighbor table** that contains information about other known nodes, including their abstract addresses, public keys, IP addresses, and UDP ports. Over time, this table expands with information gathered from these known nodes, which may come from responses to specific queries or by removing outdated records.

ADNL允许您建立点对点的通道和隧道（一系列代理）。

还可以在ADNL之上构建类TCP的流协议。

## What's next?

- 在[低层级ADNL文章](/learn/networking/low-level-adnl)中阅读更多关于ADNL的信息
- [TON白皮书](https://docs.ton.org/ton.pdf)的第3.1章。
  <Feedback />

