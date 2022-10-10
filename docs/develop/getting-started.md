# Getting Started

By community efforts there are already several tutorials available for new TON developers. Feel free to focus on the approach that suits the best for you.

## Smart Contracts development

:::tip starter tip
These materials are the best for newcomers to the TON development.
:::

Right now there is 3 great approaches how to start developing TON smart contracts:
* [TON Hello World: Step-by-step guide for writing your first smart contract in FunC](https://society.ton.org/ton-hello-world-step-by-step-guide-for-writing-your-first-smart-contract-in-func)
* [TON Learn FunC Journey: 10 zero-to-hero lessons](https://society.ton.org/func-journey-part-1) ([Ru lessons](https://github.com/romanovichim/TonFunClessons_ru))
* [Introduction in FunC: how to start developing in TON?](https://dev.to/dvlkv/introduction-in-func-how-to-start-developing-in-ton-50hp)


## Web and dApps development

For web developers the best approach is to start from this article:  
* [How TON wallets work and how to access them from JavaScript](https://society.ton.org/how-ton-wallets-work-and-how-to-access-them-from-javascript)

### Learning by Examples

In case you are web or bot developer, you could find useful these repositories:

#### Examples

* [TonCenter API Examples](https://github.com/toncenter/examples) (JavaScript, with comments)
* [Payment Channels Example](https://github.com/toncenter/payment-channels-example) (JavaScript, with comments)
* [TON Bridge front-end](https://github.com/ton-blockchain/bridge) (Vue.js, no comments)
* [Web Wallet source code](https://github.com/toncenter/ton-wallet) (JavaScript, no comments)

#### NFT minters / Non-Fungible Tokens

* [TON Diamonds NFT deployer](https://github.com/tondiamonds/ton-nft-deployer) (TypeScript, no comments)
* [NFT Minter Example](https://github.com/ton-foundation/token-contract/tree/main/nft/web-example) (JavaScript, with comments)
* [NFT Minter using React](https://github.com/tonbuilders/tonbuilders-minter) (React, no comments)

##### Tools to work with NFTs

* [LiberMall/tnt](https://github.com/LiberMall/tnt) — TNT is an all-in-one command line tool to query, edit, and mint new Non-Fungible Tokens on The Open Network.

#### Jetton Deployer / Fungible Tokens

Jettons are custom fungible tokens on TON blockchain. You can create your own token on TON blockchain using Jetton Deployer example below:

* **[Jetton.Live](https://jetton.live/)** — open-source Jetton Deployer dApp
* [Jetton Deployer — Contracts](https://github.com/ton-defi-org/jetton-deployer-contracts) (FunC, TL-B)
* [Jetton Deployer — WebClient](https://github.com/ton-defi-org/jetton-deployer-webclient) (React, TypeScript)

##### Tools to work with Jettons

* [Scaleton](http://scaleton.io) — see your custom token balances.
* [@tegro/ton3-client](https://github.com/TegroTON/ton3-client#jettons-example) — SDK to query information about Jettons.

## Standard smart contracts

:::caution advanced level
This information is **very low level** and could be hard to understand for newcomers.  
So feel free to read about it later.
:::

If you're already familiar with smart contracts, you could try to read the following examples:
- [Fungible (Jettons), Non-Fungible (NFT), Semi-Fungible Tokens Smart Contracts](https://github.com/ton-blockchain/token-contract/tree/main)
- [Standard Smart Contracts Examples](https://github.com/ton-blockchain/ton/tree/master/crypto/smartcont)
- [Wallet V4 Smart Contract Example](https://github.com/ton-blockchain/wallet-contract)

:::info little tip
Feel free to focus on smart contracts written using _FunC_  (***.fc**) instead of low-level *Fift* (***.fif**) language. It would be easier experience.
:::