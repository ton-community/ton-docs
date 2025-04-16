# Межцепочечные мостики

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Децентрализованные межцепочечные мосты работают на блокчейне TON Blockchain, позволяя Вам переводить активы с блокчейна TON Blockchain на другие блокчейны и наоборот.

## Тонкоинский мост

Мост Toncoin позволяет Вам переводить Toncoin между блокчейном TON и блокчейном Ethereum, а также между блокчейном TON и смарт-цепочкой BNB.

Мост управляется [децентрализованными оракулами](/participate/crosschain/bridge-addresses).

### Как его использовать?

Фронтенд Bridge размещен на сайте https://ton.org/bridge.

:::info
[Исходный код фронтенда Bridge](https://github.com/ton-blockchain/bridge)
:::

### Исходные коды смарт-контрактов TON-Ethereum

- [FunC (сторона TON)](https://github.com/ton-blockchain/bridge-func)
- [Solidity (сторона Ethereum)](https://github.com/ton-blockchain/bridge-solidity/tree/eth_mainnet)

### Исходные коды смарт-контрактов TON-BNB Smart Chain

- [FunC (сторона TON)](https://github.com/ton-blockchain/bridge-func/tree/bsc)
- [Solidity (BSC side)](https://github.com/ton-blockchain/bridge-solidity/tree/bsc_mainnet)

### Конфиги блокчейна

Вы можете получить фактические адреса смарт-контрактов моста и адреса оракулов, просмотрев соответствующий конфиг:

TON-Ethereum: [#71](https://github.com/ton-blockchain/ton/blob/35d17249e6b54d67a5781ebf26e4ee98e56c1e50/crypto/block/block.tlb#L738).

TON-BSC: [#72](https://github.com/ton-blockchain/ton/blob/35d17249e6b54d67a5781ebf26e4ee98e56c1e50/crypto/block/block.tlb#L739).

TON-Polygon: [#73](https://github.com/ton-blockchain/ton/blob/35d17249e6b54d67a5781ebf26e4ee98e56c1e50/crypto/block/block.tlb#L740).

### Документация

- [Как работает мост](https://github.com/ton-blockchain/TIPs/issues/24)

### Дорожная карта межцепочечного взаимодействия

- https://t.me/tonblockchain/146

## Мост Тонана

### Как принять участие?

:::caution проект\
Это концептуальная статья. Мы все еще ищем кого-то опытного для ее написания.
:::

Вы можете найти фронт-энд здесь: https://tonana.org/.

Исходный код находится здесь: https://github.com/tonanadao
