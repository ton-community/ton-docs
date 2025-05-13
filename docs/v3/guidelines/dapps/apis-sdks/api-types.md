import Feedback from '@site/src/components/Feedback';

# API types

**High availability blockchain APIs are essential for developing secure, efficient, and scalable applications on TON.**

- [TON HTTP API](/v3/guidelines/dapps/apis-sdks/ton-http-apis) — An API that allows working with the _indexed blockchain information_.
- [TON ADNL API](/v3/guidelines/dapps/apis-sdks/ton-adnl-apis) — A secure API for communicating with TON using the ADNL protocol.
  
:::tip TON Infrastructure Status
* [status.toncenter](https://status.toncenter.com/) - Displays various node activity statistics from the last hour.
* [Tonstat.us](https://tonstat.us/) - A real-time Grafana dashboard, updated every 5 minutes.
:::

## TON Center APIs
- [TON Index](https://toncenter.com/api/v3/) - Collects data from a full node into a PostgreSQL database and provides a convenient API for accessing indexed blockchain data.
- [toncenter/v2](https://toncenter.com/) - Enables HTTP access to TON Blockchain, allowing developers to retrieve account and wallet information, look up blocks and transactions, send messages to the blockchain, call smart contract methods, and more.

## Third-party APIs
- [tonapi.io](https://docs.tonconsole.com/tonapi) - A fast indexed API that provides basic data about accounts, transactions, blocks, application-specific data about NFT, auctions, jettons, TON DNS, and subscriptions. It also offers annotated transaction chain data.
- [TONX API](https://docs.tonxapi.com/) - Designed for seamless dApp development, this API provides easy access to various tools and data.
- [dton.io](https://dton.io/graphql/) - A GraphQL API that delivers data on accounts, transactions, and blocks, as well as application-specific data about NFT, auctions, jettons, and TON DNS.
- [ton-api-v4](https://mainnet-v4.tonhubapi.com) - A lightweight API optimized for speed through aggressive CDN caching
- [docs.nftscan.com](https://docs.nftscan.com/reference/ton/model/asset-model) - NFT APIs for TON Blockchain.
- [everspace.center](https://everspace.center/toncoin) - A simple RPC API for accessing TON Blockchain.


## Additional APIs

### Toncoin rate APIs

* https://docs.tonconsole.com/tonapi/rest-api/rates
* https://coinmarketcap.com/api/documentation/v1/ 
* https://apiguide.coingecko.com/getting-started


### Address convert APIs


:::info
It is preferable to convert addresses using a local algorithm. See [Addresses](/v3/documentation/smart-contracts/addresses) section of documentation for details.
:::


#### From friendly to raw form

/api/v2/unpackAddress

Curl
```curl
curl -X 'GET' \
'https://toncenter.com/api/v2/unpackAddress?address=EQApAj3rEnJJSxEjEHVKrH3QZgto_MQMOmk8l72azaXlY1zB' \
-H 'accept: application/json'
```

Response body
```curl
{
"ok": true,
"result": "0:29023deb1272494b112310754aac7dd0660b68fcc40c3a693c97bd9acda5e563"
}
```

#### From friendly to raw form

/api/v2/packAddress

Curl
```curl
curl -X 'GET' \
'https://toncenter.com/api/v2/packAddress?address=0%3A29023deb1272494b112310754aac7dd0660b68fcc40c3a693c97bd9acda5e563' \
-H 'accept: application/json'
```

Response body
```json
{
  "ok": true,
  "result": "EQApAj3rEnJJSxEjEHVKrH3QZgto/MQMOmk8l72azaXlY1zB"
}
```



## See also
* [TON HTTP API](/v3/guidelines/dapps/apis-sdks/ton-http-apis)
* [List of SDKs](/v3/guidelines/dapps/apis-sdks/sdk)
* [TON cookbook](/v3/guidelines/dapps/cookbook)

<Feedback />

