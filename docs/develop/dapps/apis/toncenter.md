# TON Center API

_Standard HTTP JSON RPC. Similar to other blockchain APIs._

Clients connect to the [ton-http-api](https://github.com/toncenter/ton-http-api) server that proxies requests to the lite server (node) using TonLib.

You can connect to public [toncenter.com](https://toncenter.com) or run your own http-api instance.

## Pros & Cons

- ✅ Habitual and suitable for a quick start, this is perfect for every newcomer looking to play with TON. 
- ✅ Web-oriented. Perfect to interact with TON transactions, smart contracts from Web.

- ❌ Simplified. It's not possible to receive information where you need an indexed TON API.  
- ❌ HTTP-Middleware. You can't fully trust server responses, because they do not contain _Merkle proofs_ to validate that your data is genuine.  

## Get API key

To work with public TonCenter API you need a key:

* Get API key for the Mainnet and the Testnet: [@tonapibot](https://t.me/tonapibot)

## RPC Nodes
* [https://www.orbs.com/ton-access/](https://www.orbs.com/ton-access/) - HTTP API for The Open Network (TON). 
* [https://toncenter.com/api/v2/](https://toncenter.com/api/v2/) — community-hosted project for Quick Start with API.
* [GetBlock Nodes](https://getblock.io/nodes/ton/) — connect and test your dApps using GetBlocks Nodes.
* [toncenter/ton-http-api](https://github.com/toncenter/ton-http-api) — run your own RPC node.
* [nownodes.io](https://nownodes.io/nodes) — NOWNodes full Nodes and blockbook Explorers via API.

## See Also
* [TON ADNL API](/develop/dapps/apis/adnl)
* [SDKs](/develop/dapps/apis/sdk)

