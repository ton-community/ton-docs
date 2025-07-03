import Feedback from '@site/src/components/Feedback';

# Overlay subnetworks

Please see the implementation:

* [Overlay](https://github.com/ton-blockchain/ton/tree/master/overlay)

## Overview


The architecture of the TON is designed to support multiple chains that can operate simultaneously and independently, whether they are private or public. Nodes have the flexibility to choose which shards and chains they store and process.

Despite this variability, the communication protocol remains consistent due to its universal nature. Protocols such as DHT (Distributed Hash Table), RLDP (Reliable Layered Datagram Protocol), and overlays facilitate this functionality.

We are already familiar with the first two protocols; in this section, we will focus on overlays.

Overlays are responsible for partitioning a single network into additional subnetworks. These overlays can be public, allowing anyone to connect, or private, requiring specific credentials for access, which are known only to a limited group of individuals. All chains in the TON ecosystem, including the MasterChain, communicate using their respective overlays. To join an overlay, a node must locate other nodes that are already part of it and begin exchanging data with them.

For public overlays, you can discover nodes using the DHT protocol.

## ADNL vs overlay networks

In contrast to ADNL, TON overlay networks typically do not allow the sending of datagrams to arbitrary nodes. Instead, they establish "semi-permanent links" between specific nodes, known as "neighbors," within the overlay network. Messages are usually forwarded along these links, meaning communication happens from one node to one of its neighbors.

Each overlay subnetwork is assigned a 256-bit network identifier, which is usually equivalent to a SHA256 that describes the overlay network as a TL-serialized object.

Overlay subnetworks can either be public or private.

These subnetworks operate using a special [gossip](https://en.wikipedia.org/wiki/Gossip_protocol) protocol.

## Interaction with overlay nodes

We have already analyzed an example of finding overlay nodes in an article about Distributed Hash Tables (DHT). This was discussed in the section titled [Search for nodes that store the state of the blockchain](/v3/documentation/network/protocols/dht/dht-deep-dive#search-for-nodes-that-store-the-state-of-the-blockchain).

In this section, we will focus on how to interact with these nodes.

When querying the DHT, we will retrieve the addresses of the overlay nodes. From these addresses, we can discover the addresses of additional nodes within the overlay by using the [overlay.getRandomPeers](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L237) query.

After connecting to a sufficient number of nodes, we will be able to receive information about all blocks and other chain events from them. Additionally, we can send our transactions to these nodes for processing.

### Find more neighbors

To retrieve nodes in an overlay, send a request `overlay.getRandomPeers` to any known node. 

Make sure to serialize the TL schema:

```tlb
overlay.node id:PublicKey overlay:int256 version:int signature:bytes = overlay.Node;
overlay.nodes nodes:(vector overlay.node) = overlay.Nodes;

overlay.getRandomPeers peers:overlay.nodes = overlay.Nodes;
```

The `peers` array should include the peers we are aware of so that we do not receive messages from them again. Since we currently do not know any peers, `peers.nodes` will initially be an empty array.

If we want to retrieve information, participate in the overlay, and receive broadcasts, we need to include information about our own node in the `peers` array during the request. Once the peers are aware of our presence, they will begin to send us broadcasts using ADNL or RLDP.

Additionally, each request made within the overlay must be prefixed with the TL schema:

```tlb
overlay.query overlay:int256 = True;
```

The `overlay` should be the overlay's ID, specifically the ID of the `tonNode.ShardPublicOverlayId` schema key, which we also used to search the DHT.

To combine two serialized schemas, we should concatenate two serialized byte arrays: `overlay.query` will come first, followed by `overlay.getRandomPeers`.

We then wrap the resulting array in the `adnl.message.query` schema and send it via ADNL. In response, we expect `overlay.nodes`, which will be a list of overlay nodes that we can connect to. If necessary, we can repeat the request to any new nodes until we acquire enough connections.

### Functional requests

Once the connection is established, we can access the overlay nodes using `tonNode.*` via the [requests](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L413). 

We utilize the RLDP protocol for these types of requests. It's crucial to remember that every query in the overlay must begin with the `overlay.query` prefix. 

The requests themselves are quite standard and resemble those we discussed in the article about ADNL TCP found [here](/v3/documentation/network/protocols/adnl/adnl-tcp#getmasterchaininfo).

For example, the `downloadBlockFull` request follows the familiar block ID schema:

```tlb
tonNode.downloadBlockFull block:tonNode.blockIdExt = tonNode.DataFull;
```

By passing this step, we can download complete information about the block, and in response, we will receive:

```tlb
tonNode.dataFull id:tonNode.blockIdExt proof:bytes block:bytes is_link:Bool = tonNode.DataFull;
  or
tonNode.dataFullEmpty = tonNode.DataFull;
```

If the `block` field is present, it will contain data in TL-B format.

This allows us to receive information directly from the nodes.

## References

Here is the [link to the original article](https://github.com/xssnick/ton-deep-doc/blob/master/Overlay-Network.md) - _[Oleg Baranov](https://github.com/xssnick)._

<Feedback />

