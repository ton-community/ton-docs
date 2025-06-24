import Feedback from '@site/src/components/Feedback';

# API 类型

**高可用性区块链API是在TON上安全、便捷、快速开发有效应用程序的核心元素。**

- [TON HTTP API](/develop/dapps/apis/toncenter) — 允许处理_索引化区块链信息_的API。
- [TON ADNL API](/develop/dapps/apis/adnl) — 基于ADNL协议的与TON通信的安全API。

:::tip TON Infrastructure Status

- [status.toncenter](https://status.toncenter.com/) - Displays various node activity statistics from the last hour.
- [Tonstat.us](https://tonstat.us/) - A real-time Grafana dashboard, updated every 5 minutes.
  :::

## Toncenter APIs

- [TON Index](https://toncenter.com/api/v3/) - TON Index从全节点收集数据到PostgreSQL数据库，并提供方便的API来访问索引化的区块链。
- [toncenter/v2](https://toncenter.com/) - 此API通过HTTP访问TON区块链 - 获取账户和钱包信息，查询区块和交易，向区块链发送消息，调用智能合约的get方法等。

## 第三方 APIs

- [tonapi.io](https://docs.tonconsole.com/tonapi/api-v2) - 快速索引API，提供关于账户、交易、区块的基本数据，以及NFT、拍卖、Jettons、TON DNS、订阅等应用特定数据。它还提供交易链的注释数据。 It also offers annotated transaction chain data.
- [TONX API](https://docs.tonxapi.com/) - Designed for seamless dApp development, this API provides easy access to various tools and data.
- [dton.io](https://dton.io/graphql/) - GraphQL API，可以提供关于账户、交易和区块的数据，以及关于NFT、拍卖、Jettons和TON DNS的应用特定数据。
- [ton-api-v4](https://mainnet-v4.tonhubapi.com) - 另一个专注于通过CDN的积极缓存以提高速度的轻量级API。
- [docs.nftscan.com](https://docs.nftscan.com/reference/ton/model/asset-model) - TON区块链的NFT API。
- [everspace.center](https://everspace.center/toncoin) - 用于访问TON区块链的简单RPC API。

## 其他 API

### Toncoin 汇率 API

- https://docs.tonconsole.com/tonapi/rest-api/rates
- https://coinmarketcap.com/api/documentation/v1/
- https://apiguide.coingecko.com/getting-started

### 地址转换 APIs

:::info
It is preferable to convert addresses using a local algorithm. See [Addresses](/v3/documentation/smart-contracts/addresses) section of documentation for details.
:::

#### 从友好形式到原始形式

/api/v2/unpackAddress

Curl

```curl
curl -X 'GET' \
'https://toncenter.com/api/v2/unpackAddress?address=EQApAj3rEnJJSxEjEHVKrH3QZgto_MQMOmk8l72azaXlY1zB' \
-H 'accept: application/json'
```

响应正文

```curl
{
"ok": true,
"result": "0:29023deb1272494b112310754aac7dd0660b68fcc40c3a693c97bd9acda5e563"
}
```

#### 从友好形式到原始形式

/api/v2/packAddress

Curl

```curl
curl -X 'GET' \
'https://toncenter.com/api/v2/packAddress?address=0%3A29023deb1272494b112310754aac7dd0660b68fcc40c3a693c97bd9acda5e563' \
-H 'accept: application/json'
```

响应正文

```json
{
  "ok": true,
  "result": "EQApAj3rEnJJSxEjEHVKrH3QZgto/MQMOmk8l72azaXlY1zB"
}
```

## 参阅

- [TON HTTP API](/develop/dapps/apis/toncenter)
- [SDK列表](/develop/dapps/apis/sdk)
- [TON 开发手册](/develop/dapps/cookbook)

<Feedback />

