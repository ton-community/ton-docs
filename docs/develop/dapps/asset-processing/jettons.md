# Jettons processing

We wrote examples of processing jettons using tonweb and ton-http-api (not indexer).


## Examples

### JavaScript

#### Official

Nowadays, we have officially supported examples using _tonweb_ SDK:

1. [Accepting Jetton deposits to single HOT wallet with comments (memo)](https://github.com/toncenter/examples/blob/main/deposits-jettons-single-wallet.js)
2. [Jettons withdrawals example](https://github.com/toncenter/examples/blob/main/jettons-withdrawals.js)

### Python

#### Made by community

- [Transfer NFT & Jettons by creating a transfer message](https://github.com/tonfactory/tonsdk#transfer-nft--jettons-by-creating-a-transfer-message-from-an-owner-wallet)

### Golang

#### Made by community

- [Get info about jetton, get jetton wallet balance, transfer jettons, and burn them](https://github.com/xssnick/tonutils-go#jettons)


## Concepts

To get acquainted with the architecture of jettons, you can read articles:
- [Scalable DeFi in TON](https://telegra.ph/Scalable-DeFi-in-TON-03-30)
- [Studying the anatomy of TON's Jettons](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons)
- [Secure Smart Contract Programming in FunC by CertiK](https://blog.ton.org/secure-smart-contract-programming-in-func) (Contract Sharding paragaph)

We believe that accepting deposits to different deposit wallets of users is the best solution because users forget to set a comment (memo).

## Third-party projects

### TON Payment Processor

We would also like to ask you if you would like to use a ready-made microservice for processing jettons on Golang - https://github.com/gobicycle/bicycle.

It supports deposits to users' multi-wallets without comment. It is supposed to be run locally and closed from external connections, and connects directly to the local node.