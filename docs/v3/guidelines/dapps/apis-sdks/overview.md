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

## TON data analytics

Quite often developers need to perform analytical queries on top of on-chain data: for example to track historical changes and aggregate data from multiple accounts. 
Blockchains are not designed for this kind of workload and one need to build indexing pipeline and run analytical queries off-chain. Building such pipelines
from scratch could be resource-consuming so one can use one of the following alternatives:
* [Dune Analytics](https://dune.com/queries?category=canonical&namespace=ton) has a set of tables with TON data: raw transactions and messages, jetton events and DEX trades. Dune allows to build custom charts and dashboard, fetch query results via API and configure alerts. Before starting with writting queries please check [this guide](https://dune.com/ton_foundation/ton-quick-start) for best practices, tips and tricks.
* Dune integration is powered by the Public Data Lake from the [ton-etl](https://github.com/re-doubt/ton-etl/blob/main/datalake/README.md) project. It is a parsing and decoding pipeline
which dumps raw and decode data into S3 bucket __s3://ton-blockchain-public-datalake/v1/__ in AVRO format. The bucket is publicly available and everyone can use it with tools like [Amazon Athena](https://aws.amazon.com/athena/) (see [DDLs](https://github.com/re-doubt/ton-etl/blob/main/datalake/athena_ddl.sql)) or Apache Spark. The data is updated on the daily basis.
* If you need to track on-chain data in near real-time you can run your own [Ton Node](/v3/documentation/infra/nodes/node-types) and launch [ton-etl](https://github.com/re-doubt/ton-etl/blob/main/README.md) or [ton-index-worker](https://github.com/toncenter/ton-index-worker).
* [chainbase](https://docs.chainbase.com/catalog/Ton/Overview) comes with a set of raw and decoded tables with TON data. It allows to run SQL queries and fetch results via API.

## Infrastructure Status

* [status.toncenter](https://status.toncenter.com/) - various statistics of nodes activity during the last hour.
* [Tonstat.us](https://tonstat.us/) - a real-time Grafana, updated every 5 minutes.


## See Also

* [SDKs](/v3/guidelines/dapps/apis-sdks/sdk)
* [TMA Tutorials](/v3/guidelines/dapps/tma/tutorials/step-by-step-guide)
* [TON Connect Tutorials](/v3/guidelines/ton-connect/guidelines/how-ton-connect-works)
* [Payments Processing](/v3/guidelines/dapps/asset-processing/payments-processing)
