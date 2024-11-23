# Overview

The purpose of this article is to help you choose the right tools for application development in TON ecosystem.

## TMA development

* Use [Mini Apps SDKs](/v3/guidelines/dapps/tma/overview#mini-apps-sdks) for [Telegram Mini Apps](/v3/guidelines/dapps/tma/overview) development.
* Choose [JS/TS-based SDK](/v3/guidelines/dapps/apis-sdks/sdk#typescript--javascript) for interacting with TON blockchain.

## DApps development

* Use Tolk, FunC or Tact [programming languages](/v3/documentation/smart-contracts/overview#programming-languages) for TON blockchain smart contracts development for your [DApp](/v3/guidelines/dapps/overview) if needed.
* To interacts with TON blockchain and process its data choose listed [SDK](/v3/guidelines/dapps/apis-sdks/sdk). One of the most popular languages for this purpose are:
    * [JS/TS](/v3/guidelines/dapps/apis-sdks/sdk#typescript--javascript)
    * [Go](/v3/guidelines/dapps/apis-sdks/sdk#go)
    * [Python](/v3/guidelines/dapps/apis-sdks/sdk#python)
* To integrate user authentication with their TON Wallets (also payments processing logic) into your DApp use [TON Connect](/v3/guidelines/ton-connect/overview).

## TON Statistics analyzer

You may need fast interaction with TON blockchain or collect and analyze its data. For these purposes it may be helpful to run your own [Ton Node](/v3/documentation/infra/nodes/node-types).

* [Liteserver Node](/v3/guidelines/nodes/running-nodes/liteserver-node) - just for interaction with blockchain.
* [Archive Node](/v3/guidelines/nodes/running-nodes/archive-node) - collecting extended historical data of a blockchain.

Use SDKs with native [ADNL](/v3/documentation/network/protocols/adnl/adnl-tcp) support:
* [Go](https://github.com/xssnick/tonutils-go)
* [Python](https://github.com/yungwine/pytoniq)


## See Also

* [SDKs](/v3/guidelines/dapps/apis-sdks/sdk)
* [TMA Tutorials](/v3/guidelines/dapps/tma/tutorials/step-by-step-guide)
* [TON Connect Tutorials](/v3/guidelines/ton-connect/guidelines/how-ton-connect-works)
* [Payments Processing](/v3/guidelines/dapps/asset-processing/payments-processing)
