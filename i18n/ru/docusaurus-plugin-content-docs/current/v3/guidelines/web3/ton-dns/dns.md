# TON DNS и домены

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

TON DNS - это сервис для перевода понятных человеку доменных имен (например, test.ton или mysite.temp.ton) в адреса смарт-контрактов TON, адреса ADNL, используемые сервисами, работающими в сети TON (например, TON Sites) и т. д.

## Стандарт

[Стандарт TON DNS](https://github.com/ton-blockchain/TIPs/issues/81) описывает формат доменных имен, процесс разрешения домена, интерфейс смарт-контрактов DNS и формат записей DNS.

## SDK

Работа с TON DNS реализована в JavaScript SDK [TonWeb](https://github.com/toncenter/tonweb) и [TonLib](https://ton.org/#/apis/?id=_2-ton-api).

```js
const address: Address = await tonweb.dns.getWalletAddress('test.ton');

// or 

const address: Address = await tonweb.dns.resolve('test.ton', TonWeb.dns.DNS_CATEGORY_WALLET);
```

Также `lite-client` и `tonlib-cli` поддерживаются DNS-запросами.

## Домен первого уровня

В настоящее время только домены, заканчивающиеся на `.ton`, распознаются как допустимые домены DNS TON.

Исходный код смарт-контракта Root DNS - https://github.com/ton-blockchain/dns-contract/blob/main/func/root-dns.fc.

Это может измениться в будущем. Добавление нового домена первого уровня потребует нового смарт-контракта root DNS и общего голосования для изменения [конфигурации сети #4](https://ton.org/#/smart-contracts/governance?id=config).

## \*.ton домены

Домены \*.ton реализованы в форме NFT. Поскольку они реализуют стандарт NFT, они совместимы с обычными службами NFT (например, NFT маркетплейсами) и кошельками, которые могут отображать NFT.

Исходный код \*.ton доменов - https://github.com/ton-blockchain/dns-contract.

Резольвер доменов .ton реализует интерфейс NFT collection, а домен .ton реализует интерфейс NFT item.

Первичная продажа доменов \*.ton происходит через децентрализованный открытый аукцион на https://dns.ton.org. Исходный код - https://github.com/ton-blockchain/dns.

## Поддомены

Владелец домена может создавать поддомены, указав адрес смарт-контракта, отвечающего за разрешение поддоменов, в записи DNS `sha256("dns_next_resolver")`.

Это может быть любой смарт-контракт, реализующий стандарт DNS.
