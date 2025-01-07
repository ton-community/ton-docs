# 概览

本文旨在帮助您在 TON 生态系统中选择合适的应用程序开发工具。

## TMA 开发

- 使用 [Mini Apps SDKs](/v3/guidelines/dapps/tma/overview#mini-apps-sdks) 进行 [Telegram Mini Apps](/v3/guidelines/dapps/tma/overview) 开发。
- 选择 [基于 JS/TS 的 SDK](/v3/guidelines/dapps/apis-sdks/sdk#typescript--javascript) 与 TON 区块链进行交互。

## DApps 开发

- 如果需要，使用 Tolk、FunC 或 Tact [编程语言](/v3/documentation/smart-contracts/overview#programming-languages) 为您的 [DApp](/v3/guidelines/dapps/overview) 开发 TON 区块链智能合约。
- 要与 TON 区块链交互并处理其数据，请选择列出的 [SDK](/v3/guidelines/dapps/apis-sdks/sdk)。为此目的，最常用的语言之一是
  - [JS/TS](/v3/guidelines/dapps/apis-sdks/sdk#typescript--javascript)
  - [Go](/v3/guidelines/dapps/apis-sdks/sdk#go)
  - [Python](/v3/guidelines/dapps/apis-sdks/sdk#python)
- 要将用户身份验证与其 TON 钱包（以及支付处理逻辑）整合到您的 DApp 中，请使用 [TON Connect](/v3/guidelines/ton-connect/overview) 。

## TON 统计分析仪

您可能需要与 TON 区块链进行快速交互，或收集和分析其数据。为此，运行自己的 [Ton Node](/v3/documentation/infra/nodes/node-types) 可能会有所帮助。

- [Liteserver 节点](/v3/guidelines/nodes/running-nodes/liteserver-node) - 仅用于与区块链交互。
- [存档节点](/v3/guidelines/nodes/running-nodes/archive-node) - 收集区块链的扩展历史数据。

使用支持本地 [ADNL](/v3/documentation/network/protocols/adnl/adnl-tcp)的 SDK：

- [Go](https://github.com/xssnick/tonutils-go)
- [Python](https://github.com/yungwine/pytoniq)

## 另请参见

- [SDKs](/v3/guidelines/dapps/apis-sdks/sdk)
- [TMA教程](/v3/guidelines/dapps/tma/tutorials/step-by-step-guide)
- [TON Connect 教程](/v3/guidelines/ton-connect/guidelines/how-ton-connect-works)
- [支付处理](/v3/guidelines/dapps/asset-processing/payments-processing)
