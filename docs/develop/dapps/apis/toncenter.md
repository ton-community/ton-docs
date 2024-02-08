# TON HTTP API

_Standard HTTP JSON RPC similar to other blockchain APIs._

## RPC Nodes

:::tip
[GetBlock Nodes](https://getblock.io/nodes/ton/) - 🚀 Instant Node installation with just a few clicks.
:::

* [GetBlock Nodes](https://getblock.io/nodes/ton/) — connect and test your dApps using GetBlocks Nodes
* [TON Access](https://www.orbs.com/ton-access/) - HTTP API for The Open Network (TON).
* [Toncenter](https://toncenter.com/api/v2/) — community-hosted project for Quick Start with API. (Get an API key [@tonapibot](https://t.me/tonapibot))
* [ton-node-docker](https://github.com/fmira21/ton-node-docker) - [⭐NEW] Docker Full Node and Toncenter API.
* [toncenter/ton-http-api](https://github.com/toncenter/ton-http-api) — run your own RPC node. 
* [nownodes.io](https://nownodes.io/nodes) — NOWNodes full Nodes and blockbook Explorers via API.
* [Chainbase](https://chainbase.com/chainNetwork/TON) — Node API and data infrastructure for The Open Network.

## Pros & Cons

- ✅ Habitual and suitable for a quick start, this is perfect for every newcomer looking to play with TON.
- ✅ Web-oriented. Perfect to interact with TON transactions, smart contracts from Web.

- ❌ Simplified. It's not possible to receive information where you need an indexed TON API.
- ❌ HTTP-Middleware. You can't fully trust server responses, because they do not contain _Merkle proofs_ to validate that your data is genuine.


### Toncenter API


##### Toncenter TON Index
- Using for test and development Public TON Index for free or premium for production - [toncenter.com/api/v3/](https://toncenter.com/api/v3/)
- Run your own TON Index with [Worker](https://github.com/toncenter/ton-index-worker/tree/36134e7376986c5517ee65e6a1ddd54b1c76cdba) and [TON Index API wrapper](https://github.com/toncenter/ton-indexer).

#### Toncenter HTTP API
Clients connect to the [ton-http-api](https://github.com/toncenter/ton-http-api) server that proxies requests to the liteserver (node) using TonLib.

You can connect to public [toncenter.com](https://toncenter.com) or run your own http-api instance.


## Get API key

To work with public TonCenter API you need an API key:

* Get an API key for Mainnet and Testnet: [@tonapibot](https://t.me/tonapibot)

## See Also
* [TON ADNL API](/develop/dapps/apis/adnl)
* [SDKs](/develop/dapps/apis/sdk)

