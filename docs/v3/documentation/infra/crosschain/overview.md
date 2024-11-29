# Cross-chain bridges

Decentralized cross-chain bridges operate on TON Blockchain, allowing you to transfer assets from TON Blockchain to other blockchains and vice versa.

## Toncoin Bridge

The Toncoin bridge allows you to transfer Toncoin between TON Blockchain and the Ethereum blockchain, as well as between TON Blockchain and the BNB Smart Chain.

The bridge is managed by [decentralized oracles](/v3/documentation/infra/crosschain/bridge-addresses).

### How to use it:

The bridge frontend is hosted on https://ton.org/bridge.

:::info
[Bridge frontend source code](https://github.com/ton-blockchain/bridge)
:::

### TON-Ethereum smart contracts source codes

* [FunC (TON side)](https://github.com/ton-blockchain/bridge-func)
* [Solidity (Ethereum side)](https://github.com/ton-blockchain/bridge-solidity/tree/eth_mainnet)


### TON-BNB Smart Chain smart contracts source codes

* [FunC (TON side)](https://github.com/ton-blockchain/bridge-func/tree/bsc)
* [Solidity (BSC side)](https://github.com/ton-blockchain/bridge-solidity/tree/bsc_mainnet)


### Blockchain Configs

You can get the actual bridge smart contract addresses and oracle addresses by inspecting the corresponding config:

TON-Ethereum: [#71](https://github.com/ton-blockchain/ton/blob/35d17249e6b54d67a5781ebf26e4ee98e56c1e50/crypto/block/block.tlb#L738).

TON-BSC: [#72](https://github.com/ton-blockchain/ton/blob/35d17249e6b54d67a5781ebf26e4ee98e56c1e50/crypto/block/block.tlb#L739).

TON-Polygon: [#73](https://github.com/ton-blockchain/ton/blob/35d17249e6b54d67a5781ebf26e4ee98e56c1e50/crypto/block/block.tlb#L740).


### Documentation

* [How the bridge works](https://github.com/ton-blockchain/TIPs/issues/24)

### Cross-chain roadmap

* https://t.me/tonblockchain/146
