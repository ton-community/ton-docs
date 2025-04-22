# Кросс-чейн мосты

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Децентрализованные кросс-чейн мосты работают на блокчейне TON, позволяя вам переводить активы из TON в другие блокчейны и наоборот.

## Мост Toncoin

Мост Toncoin позволяет вам переводить Toncoin между блокчейном TON и блокчейном Ethereum, а также между блокчейном TON и смарт-чейном BNB.

Мост управляется [децентрализованными оракулами](/v3/documentation/infra/crosschain/bridge-addresses).

### Как его использовать:

Фронтенд моста размещен на https://ton.org/bridge.

:::info
[Исходный код фронтенда Bridge](https://github.com/ton-blockchain/bridge)
:::

### Исходные коды смарт-контрактов TON-Ethereum

- [FunC (сторона TON)](https://github.com/ton-blockchain/bridge-func)
- [Solidity (сторона Ethereum)](https://github.com/ton-blockchain/bridge-solidity/tree/eth_mainnet)

### Исходные коды смарт-контрактов TON-BNB Smart Chain

- [FunC (сторона TON)](https://github.com/ton-blockchain/bridge-func/tree/bsc)
- [Solidity (сторона BSC)](https://github.com/ton-blockchain/bridge-solidity/tree/bsc_mainnet)

### Конфигурации блокчейна

Вы можно получить фактические адреса смарт-контрактов моста и адреса оракула, проверив соответствующую конфигурацию:

TON-Ethereum: [#71](https://github.com/ton-blockchain/ton/blob/35d17249e6b54d67a5781ebf26e4ee98e56c1e50/crypto/block/block.tlb#L738).

TON-BSC: [#72](https://github.com/ton-blockchain/ton/blob/35d17249e6b54d67a5781ebf26e4ee98e56c1e50/crypto/block/block.tlb#L739).

TON-Polygon: [#73](https://github.com/ton-blockchain/ton/blob/35d17249e6b54d67a5781ebf26e4ee98e56c1e50/crypto/block/block.tlb#L740).

### Документация

- [Как работает мост](https://github.com/ton-blockchain/TIPs/issues/24)

### Дорожная карта кросс-чейна

- https://t.me/tonblockchain/146
