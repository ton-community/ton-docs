import Button from '@site/src/components/button'

# TON Node Types

In *simplified terms*, a blockchain `node` is **one of the computers** that **collectively run the blockchain's software**. It enables the blockchain to search and optionally validate transactions and keep the network secure ensuring that the network remains **decentralized**.

When diving into the world of The Open Network (TON), understanding the distinct node types and their functionalities is crucial. This article breaks down each node type to provide clarity for developers wishing to engage with the TON blockchain.

## Full Node

A `Full Node` in TON is a node that **maintains synchronization** with the blockchain.

It retains the _current state_ of the blockchain and can house either the entire block history or parts of it. This makes it the backbone of the TON blockchain, facilitating the network's decentralization and security.

````mdx-code-block 
<Button href="/participate/run-nodes/full-node"
colorType="primary" sizeType={'sm'}>
````
Running a Full Node
````mdx-code-block 
</Button>
````

## Archive Node

If `Full node` archives the **entire block history** it's called `Archive Node`.

Such nodes are indispensable for creating blockchain explorers or other tools that necessitate a full blockchain history.

<Button href="/participate/run-nodes/archive-node"
colorType="primary" sizeType={'sm'}>
Running an Archive Node
</Button>

## Validator Node

TON operates on a **Proof-of-Stake** mechanism, where `validators` are pivotal in maintaining network functionality. `Validators` are [rewarded in Toncoin](/participate/network-maintenance/staking-incentives) for their contributions, incentivizing network participation and ensuring network security.

If `full node` holds a **necessary amount of Toncoin** as a **stake**, it can be used as `Validator Node`.

<Button href="/participate/run-nodes/enable-liteserver-node"
colorType="primary" sizeType={'sm'}>
Running a Validator Node
</Button>

## Liteserver

`Full Node` can be used as `Liteserver`. This node type can field and respond to requests from `Lite Clients`, allowing to seamlessly interact with the TON Blockchain.

`Liteservers` enable swift communication with Lite Clients, facilitating tasks like retrieving balance or submitting transactions without necessitating the full block history.

Actually, there are two public `Liteservers` configs both for mainnet and testnet, that already have been provided by the TON Foundation. They are accessible for universal use. But it's not recommended to use public `Liteservers` in production since they are not stable because of permanent high load.

- [Public Liteserver Configurations - mainnet](https://ton.org/global-config.json)
- [Public Liteserver Configurations - testnet](https://ton.org/testnet-global.config.json)

These endpoints, such as those used by standard wallets, ensure that even without setting up a personal liteserver, interaction with the TON Blockchain remains possible.

If you want to have more stable _connection_, you can run your own `Liteserver`. To run a `full node` as a `Liteserver`, simply enable the `Liteserver` mode in your node's configuration file.

<Button href="/participate/run-nodes/full-node#enable-liteserver-mode"
colorType="primary" sizeType={'sm'}>
Enable Liteserver in your Node
</Button>

## Lite Clients: the SDKs to interact with TON

Each SDK which supports ADNL protocol can be used as a `Lite Client` with `config.json` file (find how to download it [here](/participate/nodes/node-types#troubleshooting)). The `config.json` file contains a list of endpoints that can be used to connect to the TON Blockchain.

Each SDK without ADNL support usually uses HTTP middleware to connect to the TON Blockchain. It's less secure and slower than ADNL, but it's easier to use.

<Button href="/develop/dapps/apis/sdk"
colorType="primary" sizeType={'sm'}>
Choose a TON SDK
</Button>

### Troubleshooting

Below you can find approaches how to fix common nowed issues with `light clients`

### Timed out after 3 seconds

If you see this error this means that the liteserver you are trying to connect to is not available. The correct way to solve this issue for public liteservers is as follows:

1. Download the config.json file from the tontech link:

```bash
wget https://api.tontech.io/ton/wallet-mainnet.autoconf.json -O /usr/bin/ton/global.config.json
```

It removes slow liteservers from the configuration file.

2. Use the downloaded config.json file in your application with [TON SDK](/develop/dapps/apis/sdk).
