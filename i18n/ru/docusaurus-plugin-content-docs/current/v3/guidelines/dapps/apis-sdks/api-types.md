# Типы API

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

**Высокодоступные API для блокчейна - это основной элемент безопасной, удобной и быстрой разработки полезных приложений на TON.**

- [TON HTTP API](/v3/guidelines/dapps/apis-sdks/ton-http-apis) - API, позволяющий работать с *индексированной информацией блокчейна*.
- [TON ADNL API](/v3/guidelines/dapps/apis-sdks/ton-adnl-apis) - безопасный API для взаимодействия с TON, основанный на протоколе ADNL.

:::tip Состояние инфраструктуры TON

- [status.toncenter](https://status.toncenter.com/) - различная статистика активности узлов за последний час.
- [Tonstat.us](https://tonstat.us/) - Графана в реальном времени, обновляется каждые 5 минут.
  :::

## API-интерфейсы Toncenter

- [TON Index](https://toncenter.com/api/v3/) - TON Index собирает данные с полного узла в базу данных PostgreSQL и предоставляет удобный API к индексированному блокчейну.
- [toncenter/v2](https://toncenter.com/) - Этот API обеспечивает HTTP-доступ к блокчейну TON - получение информации об учетных записях и кошельках, поиск блоков и транзакций, отправка сообщений в блокчейн, вызов get методов умных контрактов и многое другое.

## Сторонние API

- [tonapi.io](https://docs.tonconsole.com/tonapi) - быстрый индексированный API, предоставляющий базовую информацию об аккаунтах, транзакциях, блоках, данные для конкретных приложений о NFT, аукционах, Jetton, TON DNS и подписках. Он также предоставляет аннотированные данные о цепочках транзакций.
- [TONX API](https://docs.tonxapi.com/) - API, специально разработанный для бесперебойной разработки DApps, обеспечивая легкий доступ к различным инструментам и данным.
- [dton.io](https://dton.io/graphql/) - GraphQL API, который может предоставлять данные об аккаунтах, транзакциях и блоках, а также специфические для приложения данные о NFT, аукционах, Jetton и TON DNS.
- [ton-api-v4](https://mainnet-v4.tonhubapi.com) - еще один lite-api, сосредоточенный на скорости через агрессивное кэширование в CDN.
- [docs.nftscan.com](https://docs.nftscan.com/reference/ton/model/asset-model) - API для работы с NFT на блокчейне TON.
- [everspace.center](https://everspace.center/toncoin) - Простой RPC API для доступа к блокчейну TON.

## Дополнительные API

### API для получения курса Toncoin

- https://docs.tonconsole.com/tonapi/rest-api/rates
- https://coinmarketcap.com/api/documentation/v1/
- https://apiguide.coingecko.com/getting-started

### API для преобразования адресов

:::info
Предпочтительнее преобразовывать адрес с помощью локального алгоритма, дополнительную информацию ознакомьтесь в разделе документации [Адреса](/v3/documentation/smart-contracts/addresses).
:::

#### От удобной к Raw формату

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

#### От удобной к Raw формату

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

## См. также

- [TON HTTP API](/v3/guidelines/dapps/apis-sdks/ton-http-apis)
- [Список SDK](/v3/guidelines/dapps/apis-sdks/sdk)
- [TON Cookbook](/v3/guidelines/dapps/cookbook)
