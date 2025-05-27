import Feedback from '@site/src/components/Feedback';

# Overview

This article helps you choose the right tools for application development in TON Ecosystem.

## TMA development

* Use [Mini Apps SDKs](/v3/guidelines/dapps/tma/overview#mini-apps-sdks) for [Telegram Mini Apps](/v3/guidelines/dapps/tma/overview) development.
* Choose [JS/TS-based SDK](/v3/guidelines/dapps/apis-sdks/sdk#typescript--javascript) to interact with TON Blockchain.

## DApps development

* Use Tolk, FunC, or Tact [programming languages](/v3/documentation/smart-contracts/overview#programming-languages) to develop TON Blockchain smart contracts for your [dApp](/v3/guidelines/dapps/overview).
* To interacts with TON Blockchain and process its data, choose one of the listed [SDKs](/v3/guidelines/dapps/apis-sdks/sdk). One of the most popular languages for this purpose include:
    * [JavaScript/TypeScript](/v3/guidelines/dapps/apis-sdks/sdk#typescript--javascript)
    * [Go](/v3/guidelines/dapps/apis-sdks/sdk#go)
    * [Python](/v3/guidelines/dapps/apis-sdks/sdk#python)
* To integrate user authentication and payments processing via with their TON wallets, use [TON Connect](/v3/guidelines/ton-connect/overview).

## TON data analytics

Developers often need to run analytical queries on top of on-chain data—for example, to track historical changes and aggregate data from multiple accounts. 
Since blockchains are not designed for analytical workloads, you need to build an indexing pipeline and run off-chain analytical queries. Creating such pipelines
from scratch can be resource-consuming, so you can use one of these alternatives:
* [Dune analytics](https://dune.com/queries?category=canonical&namespace=ton) provides tables with TON data, including raw transactions and messages, jetton events, and DEX trades. Dune allows building custom charts and dashboards, fetch query results via API and set up alerts. Before writing queries, check [this guide](https://dune.com/ton_foundation/ton-quick-start) for best practices, tips, and tricks.
* Dune integration is runs on the public data lake from the [ton-etl](https://github.com/re-doubt/ton-etl/blob/main/datalake/README.md) project. This parsing and decoding pipeline dumps raw and decoded data into an S3 bucket __s3://ton-blockchain-public-datalake/v1/__ in AVRO format. The bucket is publicly available and everyone can use it with [Amazon Athena](https://aws.amazon.com/athena/) (see [DDLs](https://github.com/re-doubt/ton-etl/blob/main/datalake/athena_ddl.sql)) or Apache Spark. The data updates daily.
* If you need real-time on-chain data tracking, you can run your own [Ton Node](/v3/documentation/infra/nodes/node-types) and launch [ton-etl](https://github.com/re-doubt/ton-etl/blob/main/README.md) or [ton-index-worker](https://github.com/toncenter/ton-index-worker).
* [Chainbase](https://docs.chainbase.com/catalog/Ton/Overview) offers a set of raw and decoded tables with TON data. It allows you to run SQL queries and fetch results via API.

## Infrastructure status

* [status.toncenter](https://status.toncenter.com/) - Displays various node activity statistics from the last hour.
* [Tonstat.us](https://tonstat.us/) - A real-time Grafana dashboard, updated every 5 minutes.


## See also

* [SDKs](/v3/guidelines/dapps/apis-sdks/sdk)
* [TMA tutorials](/v3/guidelines/dapps/tma/tutorials/step-by-step-guide)
* [TON Connect tutorials](/v3/guidelines/ton-connect/guidelines/how-ton-connect-works)
* [Payments processing](/v3/guidelines/dapps/asset-processing/payments-processing)

<Feedback />

