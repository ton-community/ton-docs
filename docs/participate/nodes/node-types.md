import Button from '@site/src/components/button'

# TON Node Types

When diving into the world of The Open Network (TON), understanding the distinct node types and their functionalities is crucial. This article breaks down each node type to provide clarity for developers wishing to engage with the TON blockchain.

## Full Node

A **Full Node** in TON is a node that maintains synchronization with the blockchain.

It retains the _current state_ of the blockchain and can house either the entire block history or parts of it. This makes it the backbone of the TON blockchain, facilitating the network's decentralization and security.

````mdx-code-block 
<Button href="/participate/run-nodes/full-node"
colorType="primary" sizeType={'sm'}>
````
Running a Full Node
````mdx-code-block 
</Button>
````

## Validator Node

A **Validator Node** is activated when it holds a necessary amount of Toncoin as a stake. Validator nodes are vital for the network's operability, participating in the validation of new network blocks.

TON operates on a Proof-of-Stake mechanism, where validators are pivotal in maintaining network functionality. Validators are [rewarded in Toncoin](/participate/network-maintenance/staking-incentives) for their contributions, incentivizing network participation and ensuring network security.

[Running a Full Node as a Validator](/participate/run-nodes/full-node#become-a-validator)


## Full Node + Liteserver

When an endpoint is activated on a full node, the node assumes the role of a **Liteserver**. This node type can field and respond to requests from Lite Clients, allowing to seamlessly interract with the TON Blockchain.

### Lite Clients: the SDKs to interact with TON

Liteservers enable swift communication with Lite Clients, facilitating tasks like retrieving balance or submitting transactions without necessitating the full block history.

Each SDK which supports ADNL protocol can be used as a Lite Client with `config.json` file. The `config.json` file contains a list of endpoints that can be used to connect to the TON Blockchain.

[Choose a TON SDK](/develop/dapps/apis/sdk)

Each SDK without ADNL support usually uses HTTP middleware to connect to the TON Blockchain. It's less secure and slower than ADNL, but it's easier to use.

### Interaction with TON: Public Liteservers (endpoints)

The TON Foundation provides several public Liteservers, integrated into the global config, which are accessible for universal use. These endpoints, such as those used by standard wallets, ensure that even without setting up a personal liteserver, interaction with the TON Blockchain remains possible.

- [Public Liteserver Configurations - mainnet](https://ton.org/global-config.json)
- [Public Liteserver Configurations - testnet](https://ton.org/testnet-global.config.json)

Use the downloaded `config.json` file in your application with [TON SDK](/participate/nodes/node-types#lite-clients-the-sdks-to-interact-with-ton).

#### Troubleshooting

##### Timed out after 3 seconds

If you see this error this means that the liteserver you are trying to connect to is not available. The correct way to solve this issue for public liteservers is as follows:

1. Download the config.json file from the tontech link:

```bash
wget https://api.tontech.io/ton/wallet-mainnet.autoconf.json -O /usr/bin/ton/global.config.json
```

It removes slow liteservers from the configuration file.

2. Use the downloaded config.json file in your application with [TON SDK](/participate/nodes/node-types#lite-clients-the-sdks-to-interact-with-ton).


### Running a Full Node as a Liteserver

If your project requires a high level of _security_, you can run your own Liteserver. To run a full node as a Liteserver, simply enable the Liteserver mode in your node's configuration file:

[Enable Liteserver in your Node](/participate/run-nodes/full-node#enable-liteserver-mode)


## Archive Node

An **Archive Node** is essentially a full node that archives the entire block history.

Such nodes are indispensable for creating blockchain explorers or other tools that necessitate a full blockchain history.

  [Running an Archive Node](/participate/run-nodes/archive-node)

