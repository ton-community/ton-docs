# API Types

**High availability blockchain APIs are the core element of secure, convenient and fast development of useful applications on TON.**

- [TON HTTP API](/v3/guidelines/dapps/apis-sdks/ton-http-apis) — API that allows to work with the _indexed blockchain information_.
- [TON ADNL API](/v3/guidelines/dapps/apis-sdks/ton-adnl-apis) — secure API to communicate with TON, based on ADNL protocol.

## Toncenter APIs
- [TON Index](https://toncenter.com/api/v3/) - TON Index collects data from a full node to PostgreSQL database and provides convenient API to an indexed blockchain.
- [toncenter/v2](https://toncenter.com/) - This API enables HTTP access to TON blockchain - getting accounts and wallets information, looking up blocks and transactions, sending messages to the blockchain, calling get methods of smart contracts, and more.

## Third party APIs
- [TONX API](https://docs.tonxapi.com/reference/build-your-first-dapp) — Your go-to API for accessing data on accounts, transactions, blocks, NFTs, and Jettons with 99.99% uptime—just like TonKey and TonStake did.
- [tonapi.io](https://docs.tonconsole.com/tonapi) — Fast indexed API providing basic data about accounts, transactions, blocks, and application-specific data about NFTs, Auctions, Jettons, TON DNS, and Subscriptions. It also provides annotated data on transaction chains.
- [dton.io](https://dton.io/graphql/) — GraphQL API that can provide data about accounts, transactions, and blocks, as well as application-specific data about NFTs, Auctions, Jettons, and TON DNS.
- [ton-api-v4](https://mainnet-v4.tonhubapi.com) — A lite API focused on speed via aggressive caching in CDN.
- [docs.nftscan.com](https://docs.nftscan.com/reference/ton/model/asset-model) — NFT APIs for the TON blockchain.
- [everspace.center](https://everspace.center/toncoin) — Simple RPC API for accessing the TON blockchain.


## Additional APIs

### Toncoin rate APIs

* https://docs.tonconsole.com/tonapi/rest-api/rates
* https://coinmarketcap.com/api/documentation/v1/ 
* https://apiguide.coingecko.com/getting-started


### Address Convert APIs


:::info
It is preferable to convert address via local algorithm, read more in the [Addresses](/v3/documentation/smart-contracts/addresses) section of documentation.
:::


#### From Friendly to Raw form

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

#### From Friendly to Raw form

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



## See Also
* [TON HTTP API](/v3/guidelines/dapps/apis-sdks/ton-http-apis)
* [List of SDKs](/v3/guidelines/dapps/apis-sdks/sdk)
* [TON Cookbook](/v3/guidelines/dapps/cookbook)
