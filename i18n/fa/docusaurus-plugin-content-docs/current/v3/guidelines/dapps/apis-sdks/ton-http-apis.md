import Feedback from '@site/src/components/Feedback';

# APIهای TON مبتنی بر HTTP

There are different ways to connect to TON Blockchain:

1. **RPC data provider or another API** - You must rely on its stability and security.
2. ADNL connection - Connect to a [liteserver](/v3/guidelines/nodes/running-nodes/liteserver-node). While it may be inaccessible at times, it cannot provide false data due to library-implemented validation.
3. Tonlib binary - Also connects to a liteserver, so it shares the same advantages and limitations. However, your application includes a dynamically loaded library compiled externally.
4. Offchain-only - These SDKs allow you to create and serialize cells, which you can then send to APIs.

## Pros & Cons

- ✅ Easy-to-use - Ideal for newcomers exploring TON.

- ✅ Web-oriented - Suitable for loading data from TON smart contracts via the web and sending messages.

- ❌ Simplified - Does not provide indexed TON API data.

- ❌ HTTP-middleware dependency - Server responses cannot be fully trusted unless augmented with [merkle proofs](/v3/documentation/data-formats/tlb/proofs) to verify authenticity.

## RPC nodes

:::tip TON infrastructure status

- [status.toncenter](https://status.toncenter.com/) - Displays various node activity statistics from the last hour.

- [Tonstat.us](https://tonstat.us/) - A real-time Grafana dashboard, updated every 5 minutes.
  :::

- [QuickNode](https://www.quicknode.com/chains/ton?utm_source=ton-docs) - A top-tier blockchain node provider, offering fast access, smart DNS routing, and load-balanced scalability.

- [Chainstack](https://chainstack.com/build-better-with-ton/) — Provides RPC nodes and indexers in multiple regions with geo and load balancing.

- [Tatum](https://docs.tatum.io/reference/rpc-ton) — Offers TON RPC node access and developer tools in a simple interface.

- [GetBlock nodes](https://getblock.io/nodes/ton/) — Enables developers to connect and test DApps using GetBlock’s nodes.

- [TON access](https://www.orbs.com/ton-access/) - A public HTTP API for The Open Network (TON).

- [TON Center](https://toncenter.com/api/v2/) — A community-hosted project for quick API access. (Get an API key [@tonapibot](https://t.me/tonapibot))

- [ton-node-docker](https://github.com/fmira21/ton-node-docker) - A Docker Full Node and TON Center API.

- [toncenter/ton-http-api](https://github.com/toncenter/ton-http-api) — Allows you to run your own RPC node.

- [nownodes.io](https://nownodes.io/nodes) — Provides full nodes and blockbook explorers via API.

- [Chainbase](https://chainbase.com/chainNetwork/TON) — A node API and data infrastructure for TON.

## Indexer

### TON Center TON index

Indexers allow you to list jetton wallets, NFTs, and transactions using filters, rather than retrieving only specific ones.

- Public TON index can be used for free tests and development; [premium](https://t.me/tonapibot) plans are available for production at [toncenter.com/api/v3/](https://toncenter.com/api/v3/).
- Run your own TON index with [Worker](https://github.com/toncenter/ton-index-worker/tree/36134e7376986c5517ee65e6a1ddd54b1c76cdba) and [TON index API wrapper](https://github.com/toncenter/ton-indexer).

### Anton

Anton is an open-source TON Blockchain indexer written in Go and licensed under Apache 2.0. It offers a scalable, flexible way for developers to access and analyze blockchain data. Developers can also add custom smart contracts with custom message schemas.

- [Project GitHub](https://github.com/tonindexer/anton) - Run your own indexer.
- [Swagger API documentation](https://github.com/tonindexer/anton), [API query examples](https://github.com/tonindexer/anton/blob/main/docs/API.md) - Learn how to use Anton.
- [Apache superset](https://github.com/tonindexer/anton) - Visualize blockchain data.

### GraphQL nodes

GraphQL nodes also function as indexers.

- [dton.io](https://dton.io/graphql) - Provides contract data according to contract type. It also supports transaction emulation and execution trace retrieval.

## Other APIs

- [TonAPI](https://docs.tonconsole.com/tonapi) - A user-friendly API that abstracts low-level smart contract details for a streamlined experience.

<Feedback />

