# Overlay Subnetworks

Implementation:
* https://github.com/ton-blockchain/ton/tree/master/overlay

## Overview

In a multi-blockchain system like the TON Blockchain, even full nodes would
normally be interested in obtaining updates (i.e., new blocks) only about
some shardchains. To this end, a special overlay subnetwork are built
inside the TON Network, on top of the ADNL protocol, one
for each shardchain.

Also, overlay subnetworks are used for the operation of TON Storage, TON Proxy, and so on.

## ADNL vs Overlay networks

In contrast to ADNL, the TON overlay networks usually do not support
sending datagrams to arbitrary other nodes. Instead, some “semipermanent
links” are established between some nodes (called “neighbors” with respect to
the overlay network under consideration), and messages are usually forwarded
along these links (i.e., from a node to one of its neighbors).

Each overlay subnetwork has s 256-bit network identifier usually equal
to sha256 of the description of the overlay network—a TL-serialized object.

Overlay subnetworks can be public or private.

Overlay subnetworks work according to a special [gossip](https://en.wikipedia.org/wiki/Gossip_protocol) protocol.

:::info
Read more about ADNL overlay subnetworks in [TON Whitepaper](https://ton.org/docs/ton.pdf) chapter 3.3.
:::

