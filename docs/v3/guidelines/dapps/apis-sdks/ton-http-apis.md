# TON HTTP-based APIs

:::tip

There are different ways to connect to blockchain:
1. **RPC data provider or another API**: in most cases, you have to *rely* on its stability and security.
2. ADNL connection: you're connecting to a [liteserver](/v3/guidelines/nodes/running-nodes/liteserver-node). It may be inaccessible, but with a certain level of validation (implemented in the library), it cannot lie.
3. Tonlib binary: you're also connecting to a liteserver, so all benefits and downsides apply, but your application includes a dynamically-loaded library compiled externally.
4. Offchain-only. Such SDKs allow the creation and serialization of cells, which can then be sent to APIs.

:::

## Pros & Cons

- ✅ Habitual and suitable for a quick start, this is perfect for every newcomer looking to play with TON.
- ✅ Web-oriented. Perfect for loading data from TON smart contracts via the Web, and also allows sending messages.

- ❌ Simplified. It's not possible to receive information where you need an indexed TON API.
- ❌ HTTP-Middleware.  You can't fully trust server responses unless the server augments blockchain data with [Merkle proofs](/v3/documentation/data-formats/tlb/proofs) to validate its authenticity.

## Monitoring

* [status.toncenter](https://status.toncenter.com/) - shows all full network nodes and validators active during the last hour, along with various statistics.
* [Tonstat.us](https://tonstat.us/) - provides a real-time Grafana-based dashboard displaying the status of all TON-related APIs, with data updated every 5 minutes.

## RPC Nodes

* [QuickNode](https://www.quicknode.com/chains/ton?utm_source=ton-docs) - Leading blockchain node provider offering the fastest access with smart DNS routing for optimized global reach and load-balanced scalability.
* [Chainstack](https://chainstack.com/build-better-with-ton/) — RPC nodes and indexer in multiple regions with geo and load balancing.
* [Tatum](https://docs.tatum.io/reference/rpc-ton) — Access TON RPC nodes and powerful developer tools in one simple-to-use platform.
* [GetBlock Nodes](https://getblock.io/nodes/ton/) — connect and test your dApps using GetBlocks Nodes
* [TON Access](https://www.orbs.com/ton-access/) - HTTP API for The Open Network (TON).
* [Toncenter](https://toncenter.com/api/v2/) — community-hosted project for Quick Start with API. (Get an API key [@tonapibot](https://t.me/tonapibot))
* [ton-node-docker](https://github.com/fmira21/ton-node-docker) - Docker Full Node and Toncenter API.
* [toncenter/ton-http-api](https://github.com/toncenter/ton-http-api) — run your own RPC node. 
* [nownodes.io](https://nownodes.io/nodes) — NOWNodes full Nodes and blockbook Explorers via API.
* [Chainbase](https://chainbase.com/chainNetwork/TON) — Node API and data infrastructure for The Open Network.

## Indexer

### Toncenter TON Index

Indexers allow to list jetton wallets, NFTs, transactions by certain filters, not only retrieve specific ones.

- Public TON Index can be used: tests and development are for free, [premium](https://t.me/tonapibot) for production - [toncenter.com/api/v3/](https://toncenter.com/api/v3/).
- Run your own TON Index with [Worker](https://github.com/toncenter/ton-index-worker/tree/36134e7376986c5517ee65e6a1ddd54b1c76cdba) and [TON Index API wrapper](https://github.com/toncenter/ton-indexer).

### Anton

Written in Go, Anton is an open source The Open Network blockchain indexer available under the Apache License 2.0. Anton is designed to provide a scalable, flexible solution for developers to access and analyze blockchain data. Our goal is to help developers and users understand how the blockchain is being used, and to make it possible for developers to add their own contracts with custom message schemas to our explorer.

* [Project GitHub](https://github.com/tonindexer/anton) - to run your own indexer
* [Swagger API documentation](https://github.com/tonindexer/anton), [API Query Examples](https://github.com/tonindexer/anton/blob/main/docs/API.md) - to use, study the documentation and examples
* [Apache Superset](https://github.com/tonindexer/anton) - use to view data

### GraphQL Nodes

GraphQL nodes act as indexers as well.

* [dton.io](https://dton.io/graphql) - as well as providing contracts data augmented with parsed "is jetton", "is NFT" flags, allows emulating transactions and receiving execution traces.

## Other APIs

* [TonAPI](https://docs.tonconsole.com/tonapi) - API that is designed to provide users with a streamlined experience, not worrying about low-level details of smart contracts.
