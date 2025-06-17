import Feedback from '@site/src/components/Feedback';

# TON网络

TON Ecosystem uses its peer-to-peer network protocols.

- **TON区块链使用这些协议**来传播新区块，发送和收集候选交易等。

  虽然单区块链项目（如比特币或以太坊）的网络需求相对容易满足（基本上需要构建一个点对点覆盖网络，然后通过[gossip协议](https://en.wikipedia.org/wiki/Gossip_protocol)传播所有新区块和候选交易），但多区块链项目（如TON）的要求更高（例如，必须能够仅订阅某些分片链的更新，而不一定是全部）。

Multi-blockchain projects, such as TON, are much more demanding. For example, one must be able to subscribe to updates for only some shardchains, not necessarily all of them.

- **TON生态系统服务（例如TON代理，TON网站，TON存储）运行在这些协议上。**

  Once the more sophisticated network protocols are in place to support the TON blockchain.
  They can easily be used for purposes not necessarily related to the immediate demands of the blockchain itself, thus providing more possibilities and flexibility for creating new services in TON Ecosystem.

## TON使用自己的点对点网络协议。

- 一旦为支持TON区块链所需的更复杂的网络协议就位，就会发现它们可以轻松地用于不一定与区块链本身的直接相关的需求，从而为在TON生态系统中创造新服务提供了更多的可能性和灵活性。
- [ADNL 协议](/v3/documentation/network/protocols/adnl/overview)
- [覆盖子网](/v3/documentation/network/protocols/overlay)
- [RLDP 协议](/v3/documentation/network/protocols/rldp)
- [TON DHT 服务](/v3/documentation/network/protocols/dht/ton-dht)

## 参阅

- [TON security audits](/v3/concepts/dive-into-ton/ton-blockchain/security-measures/)

<Feedback />

