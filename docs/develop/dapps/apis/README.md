# Overview

**High availability blockchain APIs is the core element of secure, convenient and fast development of useful applications in TON.**

## API Types

- [TON Center API](/develop/dapps/apis/toncenter) — fast and reliable HTTP API for The Open Network. Based on tonlib allows to get all information about accounts, transactions and blocks.
- [TON HTTP API](https://tonapi.io/) — API that allows to work with the _indexed blockchain information_.
- [TON ADNL API](/develop/dapps/apis/adnl) — secure API to communicate TON, based on ADNL protocol.

## Third party APIs
- [ton-api-v4](https://mainnet-v4.tonhubapi.com) - another lite-api based focused on speed via aggressive cashing in CDN.
- [tonapi.io](https://tonapi.io/docs) - fast and indexed API which provides basic data on accounts, transactions, blocks, application specific data on NFT, Auctions, Jettons, DNS, Subsriptions. Also provides annotated data on transaction chains.
- [dton.io](https://dton.io/graphql/) - GraphQL API with data on accounts, transactions and blocks, as well as application specific data on NFT, Auctions, Jettons and DNS.
- [evercloud.dev](https://ton-mainnet.evercloud.dev/graphql) - GraphQL API for basic queries in TON.
- [everspace.center](https://everspace.center/toncoin) - Simple RPC API for TON.


## Examples 


### API for current Toncoin value 

* https://coinmarketcap.com/api/documentation/v1/ 
* https://apiguide.coingecko.com/getting-started


### Convert Address into Raw and Friendly forms


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

### Get data for Wallet Smart Contract

#### Toncenter

curl
```curl
curl -X 'GET' \
'https://toncenter.com/api/v2/getWalletInformation?address=EQApAj3rEnJJSxEjEHVKrH3QZgto%2FMQMOmk8l72azaXlY1zB' \
-H 'accept: application/json'
```
Response Body

```json
{
"ok": true,
"result": {
"wallet": true,
"balance": "2220156241",
"account_state": "active",
"wallet_type": "wallet v4 r2",
"seqno": 3,
"last_transaction_id": {
"@type": "internal.transactionId",
"lt": "35169513000005",
"hash": "3XPXsQ+3WGE+HlhNQYqglMR6ushMEycJJPpV0zn1NIY="
},
"wallet_id": 698983191
}
}
```


#### Tonapi

curl
```curl
curl -X 'GET' \
'https://tonapi.io/v2/accounts/0%3A29023deb1272494b112310754aac7dd0660b68fcc40c3a693c97bd9acda5e563' \
-H 'accept: application/json'
```

Response Body

```json
{
"address": "0:29023deb1272494b112310754aac7dd0660b68fcc40c3a693c97bd9acda5e563",
"balance": 2220156241,
"last_activity": 1675978478,
"status": "active",
"interfaces": [
"wallet_v4r2",
"wallet_v4",
"wallet"
],
"name": "nft-recycle.ton",
"is_scam": false,
"memo_required": false,
"get_methods": []
}
```


### NFT

### Jetton