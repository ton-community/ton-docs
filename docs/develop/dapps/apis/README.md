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


:::info
It is preferable to convert address via local algorithm, read more in the [Addresses](/learn/overviews/addresses) section of documentation.
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


### Retrieve data for the Wallet Smart Contract


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

#### Retrieve all NFT items by owner address

**GET /v2/accounts/{account_id}/nfts**

curl
```curl
curl -X 'GET' \
'https://tonapi.io/v2/accounts/EQCjk1hh952vWaE9bRguFkAhDAL5jj3xj9p0uPWrFBq_GEMS/nfts?limit=1000&offset=0&indirect_ownership=false' \
-H 'accept: application/json'
```

```json
{
  "nft_items": [
    {
      "address": "0:1bfa1550d1031186a8d7c90ea9ddab3d4fecb9f64e80e087d2b9305cbc06314b",
      "index": 163,
      "owner": {
        "address": "0:a3935861f79daf59a13d6d182e1640210c02f98e3df18fda74b8f5ab141abf18",
        "name": "Getgems Marketplace",
        "is_scam": false
      },
      "collection": {
        "address": "0:fc3b095b41ee438d0144e727657a6a3be207b2ff4d95f26874289e82c26fd835",
        "name": ""
      },
      "verified": true,
      "metadata": {
        "name": "Solarbird #163",
        "image": "https://s.getgems.io/nft/b/c/62cd827425200ebb6a9acb47/163/image.png",
        "attributes": [
        ],
        "description": "Cool bird for the cool holder"
      },
      "previews": [
        {
          "resolution": "100x100",
          "url": "https://cache.tonapi.io/imgproxy/2UPH1P-oniVot8ea6nnoz-Foq4JivCHBvhufPJw5QEU/rs:fill:100:100:1/g:no/aHR0cHM6Ly9zLmdldGdlbXMuaW8vbmZ0L2IvYy82MmNkODI3NDI1MjAwZWJiNmE5YWNiNDcvMTYzL2ltYWdlLnBuZw.webp"
        }
      ],
      "approved_by": []
    }
  ]
}
```

### Jetton


#### Retrieve jetton metadata by jetton master address

**GET /v2/jettons/{account_id}**

curl
```curl
curl -X 'GET' \
'https://tonapi.io/v2/jettons/0%3A729c13b6df2c07cbf0a06ab63d34af454f3d320ec1bcd8fb5c6d24d0806a17c2' \
-H 'accept: application/json'
```

```json
{
    "mintable": true,
    "total_supply": "100810730032",
    "metadata": {
        "address": "0:729c13b6df2c07cbf0a06ab63d34af454f3d320ec1bcd8fb5c6d24d0806a17c2",
        "name": "jUSDT",
        "symbol": "jUSDT",
        "decimals": "6",
        "image": "https://bridge.ton.org/token/1/0xdac17f958d2ee523a2206206994597c13d831ec7.png",
        "description": "USDT transferred from Ethereum via bridge.ton.org. Token address in Ethereum: 0xdAC17F958D2ee523a2206206994597C13D831ec7"
    },
    "verification": "whitelist"
}
```

#### Retrieve all Jettons balances by owner's wallet address(account)

**GET /v2/accounts/{account_id}/jettons**

curl
```curl
curl -X 'GET' \
'https://tonapi.io/v2/accounts/0%3A408da3b28b6c065a593e10391269baaa9c5f8caebc0c69d9f0aabbab2a99256b/jettons' \
-H 'accept: application/json'
```

```json
{
  "balances": [
    {
      "balance": "10000000000",
      "wallet_address": {
        "address": "0:83add688b3517ee478dc7defecc76ca24add7a7f008f46ec0e88cc381f37230d",
        "is_scam": false
      },
      "jetton": {
        "address": "0:65aac9b5e380eae928db3c8e238d9bc0d61a9320fdc2bc7a2f6c87d6fedf9208",
        "name": "Scaleton",
        "symbol": "SCALE",
        "decimals": 9,
        "image": "https://cache.tonapi.io/imgproxy/jHx0m3tMBFj9z9vLy1cooH_v8DIi_2Zi43RLxyfga3g/rs:fill:200:200:1/g:no/aXBmczovL1FtU01pWHNaWU1lZndyVFEzUDZIbkRRYUNwZWNTNEVXTHBnS0s1RVgxRzhpQTg.webp",
        "verification": "whitelist"
      }
    }
  ]
}
```