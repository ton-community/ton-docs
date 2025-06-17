import Feedback from '@site/src/components/Feedback';

# 概览

本文旨在帮助您在 TON 生态系统中选择合适的应用程序开发工具。

## TMA 开发

- 使用 [Mini Apps SDKs](/v3/guidelines/dapps/tma/overview#mini-apps-sdks) 进行 [Telegram Mini Apps](/v3/guidelines/dapps/tma/overview) 开发。
- 选择 [基于 JS/TS 的 SDK](/v3/guidelines/dapps/apis-sdks/sdk#typescript--javascript) 与 TON 区块链进行交互。

## DApps 开发

- 如果需要，使用 Tolk、FunC 或 Tact [编程语言](/v3/documentation/smart-contracts/overview#programming-languages) 为您的 [DApp](/v3/guidelines/dapps/overview) 开发 TON 区块链智能合约。
- 要与 TON 区块链交互并处理其数据，请选择列出的 [SDK](/v3/guidelines/dapps/apis-sdks/sdk)。为此目的，最常用的语言之一是 One of the most popular languages for this purpose include:
    - [JS/TS](/v3/guidelines/dapps/apis-sdks/sdk#typescript--javascript)
    - [Go](/v3/guidelines/dapps/apis-sdks/sdk#go)
    - [Python](/v3/guidelines/dapps/apis-sdks/sdk#python)
- 要将用户身份验证与其 TON 钱包（以及支付处理逻辑）整合到您的 DApp 中，请使用 [TON Connect](/v3/guidelines/ton-connect/overview) 。

## TON 统计分析仪

Developers often need to run analytical queries on top of on-chain data—for example, to track historical changes and aggregate data from multiple accounts.
Since blockchains are not designed for analytical workloads, you need to build an indexing pipeline and run off-chain analytical queries. Creating such pipelines
from scratch can be resource-consuming, so you can use one of these alternatives:

- Dune analytics provides tables with TON data, including raw transactions and messages, jetton events, and DEX trades. Dune allows building custom charts and dashboards, fetch query results via API and set up alerts. Before writing queries, check this guide for best practices, tips, and tricks.
- Dune integration is runs on the public data lake from the [ton-etl](https://github.com/re-doubt/ton-etl/blob/main/datalake/README.md) project. This parsing and decoding pipeline dumps raw and decoded data into an S3 bucket **s3://ton-blockchain-public-datalake/v1/** in AVRO format. The bucket is publicly available and everyone can use it with [Amazon Athena](https://aws.amazon.com/athena/) (see [DDLs](https://github.com/re-doubt/ton-etl/blob/main/datalake/athena_ddl.sql)) or Apache Spark. The data updates daily.
- If you need real-time on-chain data tracking, you can run your own [TON node](/v3/documentation/infra/nodes/node-types) and launch [ton-etl](https://github.com/re-doubt/ton-etl/blob/main/README.md) or [ton-index-worker](https://github.com/toncenter/ton-index-worker).
- [Chainbase](https://docs.chainbase.com/catalog/Ton/Overview) offers a set of raw and decoded tables with TON data. It allows you to run SQL queries and fetch results via API.

## Infrastructure status

- [status.toncenter](https://status.toncenter.com/) - Displays various node activity statistics from the last hour.
- [Tonstat.us](https://tonstat.us/) - A real-time Grafana dashboard, updated every 5 minutes.

## 另请参见

- [SDKs](/v3/guidelines/dapps/apis-sdks/sdk)
- [TMA教程](/v3/guidelines/dapps/tma/tutorials/step-by-step-guide)
- [TON Connect 教程](/v3/guidelines/ton-connect/guidelines/how-ton-connect-works)
- [支付处理](/v3/guidelines/dapps/asset-processing/payments-processing)

<Feedback />

