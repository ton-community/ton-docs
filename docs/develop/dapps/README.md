# Overview

## Prerequisites

Here you can see links to the most important resources for you to get started with TON:

- [Wallets](https://ton.org/wallets)—a list of popular wallets for TON.
- [Explorers](https://ton.app/explorers)—to track transactions in the blockchain.
- [Testnet](/develop/smart-contracts/environment/testnet)—info about the testnet and how to use it.

## Examples

If you are a web or bot developer, you may find the following repositories useful:

### JavaScript

* Payment processing using JavaScript:
  * [Create a key pair and a wallet](https://github.com/toncenter/examples/blob/main/common.js) (tonweb)
  * [Accepting deposits to a single wallet](https://github.com/toncenter/examples/blob/main/deposits-single-wallet.js) (tonweb)
  * [Accepting deposits to multiple wallets](https://github.com/toncenter/examples/blob/main/deposits-multi-wallet.js) (tonweb)
  * [Withdrawal process](https://github.com/toncenter/examples/blob/main/withdrawals.js) (tonweb)
  * [Payment channel example](https://github.com/toncenter/payment-channels-example/blob/main/index.js) (tonweb)
* [TON Bridge front-end](https://github.com/ton-blockchain/bridge) (Vue.js, no comments)
* [Web Wallet source code](https://github.com/toncenter/ton-wallet) (tonweb, no comments)


### Python

- [psylopank/pytonlib examples](https://github.com/psylopunk/pytonlib/tree/main/examples)
- [Transfer NFT & Jettons by creating a transfer message from the owner wallet](https://github.com/tonfactory/tonsdk#transfer-nft--jettons-by-creating-a-transfer-message-from-an-owner-wallet)
- [Create mnemonic, init wallet class, create an external message to deploy the wallet](https://github.com/tonfactory/tonsdk#create-mnemonic-init-wallet-class-create-external-message-to-deploy-the-wallet)
- [Accept payments using a Telegram bot](../dapps/payment-processing/accept-payments-in-a-telegram-bot.md) (Python with Aiogram)

### Go

- [10+ examples from xssnick/tonutils-go](https://github.com/xssnick/tonutils-go/tree/master/example)

## SDK

Here is a list of modern SDKs that are constantly supported and improved:

### JavaScript SDK

* [ton-community/ton-js](https://github.com/ton-community/ton) — Cross-platform client for the TON Blockchain by the TON Community
* [toncenter/tonweb](https://github.com/toncenter/tonweb) — Cross-platform client for TON Blockchain by TON Center
* [@tegro/ton3-client](https://github.com/TegroTON/ton3-client) — JS ton3-client for tonhold API by TonHold
* [nns2009/ton-payment-tracker](https://github.com/nns2009/ton-payment-tracker) — TON payment tracker

### Python SDK

- [psylopunk/pytonlib](https://github.com/psylopunk/pytonlib) — Python SDK
- [toncenter/pytonlib](https://github.com/toncenter/pytonlib) — Python SDK
- [tonfactory/tonsdk](https://github.com/tonfactory/tonsdk) — Analogue of the tonweb js library

### Go SDK

- [tonutils-go](https://github.com/xssnick/tonutils-go) — Go utils for the TON Blockchain

### Kotlin / Java SDK

- [ton-kotlin](https://github.com/andreypfau/ton-kotlin) — Kotlin SDK for the TON Blockchain

## Telegram WebApps (TWA)

- [Telegram WebApps Documentation](https://core.telegram.org/bots/webapps) — full description on Telegram website.

### SDK

- [ton-defi-org/tonstarter-twa](https://github.com/ton-defi-org/tonstarter-twa) — template for new TWA interaction with TON
- [twa-dev/boilerplate](https://github.com/twa-dev/Boilerplate) — another boilerplate for a new TWA.
- [twa-dev/sdk](https://github.com/twa-dev/sdk) — npm package for TWA SDK
- [twa-dev/Mark42](https://github.com/twa-dev/Mark42) — Mark42 is a simple lightweight tree-shakable UI library for TWA

:::info Community
Join a special Telegram [Community Chat](https://t.me/+1mQMqTopB1FkNjIy) for TWA developers if you're interested.
:::

## Authorization SDK

To add login button to your website or web app use the following:

- [ton-connect/sdk](https://github.com/ton-connect/sdk) — unified standard for the TON ecosystem
- [tonkeeper/ton-connect](https://github.com/tonkeeper/ton-connect/blob/main/TonConnectSpecification.md) — SDK by Tonkeeper
- [tonhub/tonhub-connect](https://developers.tonhub.com/docs/apps) — SDK by Tonhub

## TonLib SDK

:::caution low-level
These technologies contains very low-level stack, so please use it if any other SDKs don't work for you. It will save a lot of your time.
:::

TonLib was one of the first libraries for working with the TON Blockchain.

- [C++ TonLib](https://github.com/ton-blockchain/ton/tree/master/example/cpp)
- [Python TonLib wrapper](https://github.com/toncenter/pytonlib)
- [Golang TonLib wrapper](https://github.com/ton-blockchain/tonlib-go)
- [Java TonLib wrapper (JNI)](https://github.com/ton-blockchain/tonlib-java)
- [tonlib-xcframework](https://github.com/labraburn/tonlib-xcframework)—builder for Apple that generates .xcramework for all architectures
- [labraburn/SwiftyTON](https://github.com/labraburn/SwiftyTON)—native Swift wrapper for tonlib with async/await
- [labraburn/node-tonlib](https://github.com/labraburn/node-tonlib)—C++ addon for NodeJS to work with tonlibjson

### Usage examples

- [Desktop standard wallet (C++ and Qt)](https://github.com/ton-blockchain/wallet-desktop)
- [Android standard wallet (Java)](https://github.com/ton-blockchain/wallet-android)
- [iOS standard wallet (Swift)](https://github.com/ton-blockchain/wallet-ios)
- [TonLib CLI (C++)](https://github.com/ton-blockchain/ton/blob/master/tonlib/tonlib/tonlib-cli.cpp)

## APIs

- [TeN Cnter](https://toncenter.com/) — fast and reliable HTTP API for The Open Network
- [TonApi.io](https://tonapi.io/) — API that allows to work with the indexed blockchain information.

### End-points

- [GetBlock Nodes](https://getblock.io/nodes/ton/) — connect and test your dApp to TON using GetBlocks Nodes
