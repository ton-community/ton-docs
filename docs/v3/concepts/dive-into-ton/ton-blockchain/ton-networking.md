import Feedback from '@site/src/components/Feedback';

# TON networking

TON Ecosystem uses its peer-to-peer network protocols.

- **TON Blockchain** uses these protocols to propagate new blocks, send and collect transaction candidates, etc.

  While the networking demands of single-blockchain projects, such as Bitcoin or Ethereum, can be met quite easily: one essentially needs to construct a peer-to-peer overlay network and then propagate all new blocks and transaction candidates via a [gossip](https://en.wikipedia.org/wiki/Gossip_protocol) protocol.

Multi-blockchain projects, such as TON, are much more demanding. For example, one must be able to subscribe to updates for only some shardchains, not necessarily all of them.


- **TON Ecosystem services** like TON Proxy, TON Sites, TON Storage, and dApps run on these protocols.

  Once the more sophisticated network protocols are in place to support the TON blockchain. 
  They can easily be used for purposes not necessarily related to the immediate demands of the blockchain itself, thus providing more possibilities and flexibility for creating new services in TON Ecosystem.

## TON network protocols

* [TON Connect](/v3/guidelines/ton-connect/overview/)
* [ADNL Protocol](/v3/documentation/network/protocols/adnl/overview/)
* [Overlay Subnetworks](/v3/documentation/network/protocols/overlay/)
* [RLDP Protocol](/v3/documentation/network/protocols/rldp/)
* [TON DHT Service](/v3/documentation/network/protocols/dht/ton-dht/)

## See also
- [TON security audits](/v3/concepts/dive-into-ton/ton-blockchain/security-measures/)

<Feedback />

