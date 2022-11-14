# TON Center API

_Standard HTTP JSON RPC. Similar to other blockchain APIs._

Clients connect to the [ton-http-api](https://github.com/toncenter/ton-http-api) server that proxies requests to the lite server (node) using TonLib.

You can connect to public [toncenter.com](https://toncenter.com) or run your own http-api instance.

## Pros & Cons

👍 — Habitual. Suitable for a quick start.  
👍 — Perfect to interact with blockchain transactions, smart contracts, etc.

👎 — It's not possible to receive information where you need an indexed blockchain API.  
👎 — You can't fully trust server responses, because they do not contain _Merkle proofs_.

## RPC Nodes

* [https://toncenter.com/api/v2/](https://toncenter.com/api/v2/) — community-hosted project for Quick Start with API.
* [GetBlock Nodes](https://getblock.io/nodes/ton/) — connect and test your dApps using GetBlocks Nodes.
* [toncenter/ton-http-api](https://github.com/toncenter/ton-http-api) — run your own RPC node.

## SDK

### JavaScript SDK

* [ton-community/ton-js](https://github.com/ton-community/ton) — _Modern_ cross-platform client for TON by the TON Community
* [toncenter/tonweb](https://github.com/toncenter/tonweb) — Cross-platform client for TON by TON Center
* [@tegro/ton3-client](https://github.com/TegroTON/ton3-client) — JS ton3-client by TonHold
* [nns2009/ton-payment-tracker](https://github.com/nns2009/ton-payment-tracker) — TON payment tracker based on TON Center API

## Usage examples

- [A standard web wallet](https://github.com/toncenter/ton-wallet) (Plain JS)
- [Bridge frontend](https://github.com/ton-blockchain/bridge) (Vue.js)
- [Accepting payments in a Telegram bot](../payment-processing/accept-payments-in-a-telegram-bot.md) (Python with Aiogram)
