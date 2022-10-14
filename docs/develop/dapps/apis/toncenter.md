# TonCenter API

Standard HTTP JSON RPC similar to many blockchains.

Clients connect to the [ton-http-api](https://github.com/toncenter/ton-http-api) server that proxies requests to the lite server (node) using TonLib.

You can connect to public [toncenter.com](https://toncenter.com) or run your own http-api instance.

## Pros & Cons

👍 — Habitual. Suitable for a quick start.  
👍 — Perfect to interact with blockchain transactions, smart-contracts, etc.

👎 — It's not possible to receive information where you need indexed blockchain API.  
👎 — Like in most blockchains, you cannot fully trust server responses, because its responses do not contain proofs.

## API reference

[https://toncenter.com/api/v2/](https://toncenter.com/api/v2/)

### SDK

- [JavaScript TonWeb](https://github.com/toncenter/tonweb)

### Usage examples:

- [Standard web wallet](https://github.com/toncenter/ton-wallet) (Plain JS)
- [Bridge frontend](https://github.com/ton-blockchain/bridge) (Vue.js)
- [An example of accepting payments in a telegram bot](./Accept-payments-in-a-telegram-bot.md) (Python with Aiogram)
