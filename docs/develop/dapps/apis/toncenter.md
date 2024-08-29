# TON HTTP-based APIs

:::tip

There are different ways to connect to blockchain:
1. **RPC data provider or another API**: in most cases, you have to *rely* on its stability and security.
2. ADNL connection: you're connecting to a [liteserver](/participate/run-nodes/liteserver). They might be inaccessible, but with a certain level of validation (implemented in the library), cannot lie.
3. Tonlib binary: you're connecting to liteserver as well, so all benefits and downsides apply, but your application also contains a dynamic-loading library compiled outside.
4. Offchain-only. Such SDKs allow to create and serialize cells, which you can then send to APIs.

:::

## Pros & Cons

- ✅ Habitual and suitable for a quick start, this is perfect for every newcomer looking to play with TON.
- ✅ Web-oriented. Perfect to load data of TON smart contracts from Web, also allows to send messages there.

- ❌ Simplified. It's not possible to receive information where you need an indexed TON API.
- ❌ HTTP-Middleware. You can't fully trust server responses, unless server augments blockchain data with [Merkle proofs](/develop/data-formats/proofs) to allow validation that it is genuine.

## Monitoring

* [status.toncenter](https://status.toncenter.com/) - shows all full network nodes and validators that were active during the last hour, as well as various statistics on them.
* [Tonstat.us](https://tonstat.us/) - provides a real-time Grafana-based dashboard that shows the status of all TON-related APIs, where data is updated every 5 minutes.
* [tonqueues.vladimirlebe.dev](https://tonqueues.vladimirlebe.dev/) - provides a real-time Grafana-based dashboard showing various statistics (such TPS, etc.).

## RPC Nodes

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

Written in Go, Anton is an open source The Open Network blockchain indexer available under the Apache Licence 2.0. Anton is designed to provide a scalable and flexible solution for developers to access and analyze blockchain data. Our goal is to help developers and users understand how the blockchain is being used, as well as make it possible for developers to add their own contracts with their own message schemas to our explorer.

* [Project GitHub](https://github.com/tonindexer/anton) - to run your own indexer
* [Swagger API documentation](https://github.com/tonindexer/anton), [API Query Examples](https://github.com/tonindexer/anton/blob/main/docs/API.md) - to use, study the documentation and examples
* [Apache Superset](https://github.com/tonindexer/anton) - use to view data

### GraphQL Nodes

GraphQL nodes act as indexers as well.

* [tvmlabs.io](https://ton-testnet.tvmlabs.dev/graphql) (for TON, testnet only at the moment of writing) - has wide variety of transaction/block data, ways to filter it, etc.
* [dton.io](https://dton.io/graphql) - as well as providing contracts data augmented with parsed "is jetton", "is NFT" flags, allows emulating transactions and receiving execution traces.

## Other APIs

* [TonAPI](https://docs.tonconsole.com/tonapi/api-v2) - API that is designed to provide users with a streamlined experience, not worrying about low-level details of smart contracts.
