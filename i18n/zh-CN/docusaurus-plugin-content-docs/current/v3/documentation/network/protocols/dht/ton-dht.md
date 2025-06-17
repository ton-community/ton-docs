import Feedback from '@site/src/components/Feedback';

# TON DHT service

Please see the implementations:

- [DHT](https://github.com/ton-blockchain/ton/tree/master/dht)
- [DHT Server](https://github.com/ton-blockchain/ton/tree/master/dht-server)

## Overview

The Kademlia-like Distributed Hash Table (DHT) plays a crucial role in the networking aspect of the TON project, enabling the discovery of other nodes within the network.

The keys used in the TON DHT are 256-bit integers, often derived from a SHA256 of a TL-serialized object.

The values associated with these 256-bit keys are essentially arbitrary byte strings of limited length. The meaning of these byte strings is determined by the pre-image of the corresponding key; this is typically known by both the node performing the key lookup and the node storing the key.

In its simplest form, the key represents an ADNL address of a node, while the value could be its IP address and port.

The key-value mappings of the TON DHT are maintained on the DHT nodes.

## DHT nodes

Each DHT node has a 256-bit DHT address. Unlike an ADNL address, a DHT address should not change too frequently; otherwise, other nodes will be unable to locate the keys they are searching for.

The value of key `K` is expected to be stored on the `S` Kademlia-nearest nodes to `K`.

Kademlia distance is calculated by performing a 256-bit `XOR` operation between the key `X` and the 256-bit DHT node address. This distance does not relate to geographic location.

`S` is a small parameter, for instance, `S = 7`, which helps improve the reliability of the DHT. If the key were stored only on a single node (the nearest one to `K`) the value of that key would be lost if that node were to go offline.

## Kademlia routing table

A node participating in a DHT typically maintains a Kademlia routing table.

This table consists of 256 buckets, numbered from 0 to 255. The `i`-th bucket contains information about known nodes that lie within a Kademlia distance from `2^i` to `2^(i+1) − 1` from the node’s address `a`. Each bucket holds a fixed number of the “best” nodes, along with some additional candidate nodes.

The information stored in these buckets includes the DHT addresses, IP addresses, UDP ports, and availability details, such as the time and delay of the last ping.

When a Kademlia node discovers another Kademlia node through a query, it places that node into the appropriate bucket as a candidate. If some of the “best” nodes in that bucket become unresponsive (for example, if they do not reply to ping queries for an extended period), they can be replaced by some of these candidates. This process ensures that the Kademlia routing table remains populated.

## Key-value pairs

Key-value pairs can be added and updated in the TON DHT. The rules for these updates can vary. In some cases, they allow for the old value to be replaced with a new one as long as the new value is signed by the owner or creator. This signature must be retained as part of the value so that it can be verified later by any other nodes that receive this key's value.

In other cases, the old value impacts the new value in some way. For example, the old value may contain a sequence number, and it can only be overwritten if the new sequence number is larger. This helps prevent replay attacks.

The TON DHT is not only used to store the IP addresses of ADNL nodes; it also serves other purposes. It can store a list of addresses of nodes that are holding a specific torrent in TON Storage, a list of addresses of nodes included in an overlay subnetwork, ADNL addresses of TON services, and ADNL addresses of accounts on the TON Blockchain, among others.

:::info
Learn more about TON DHT in [DHT](/v3/documentation/network/protocols/dht/dht-deep-dive) documentation, or in Chapter 3.2. of the [TON Whitepaper](https://docs.ton.org/ton.pdf).
:::

