# Sharding in TON

Sharding in TON refers to a method of dividing the blockchain into smaller, manageable parts - shards to improve scalability and performance. A shard is a smaller, independent piece of a blockchain that operates maintained by independent set of validators.
These shards can handle transactions in parallel, ensuring high throughput even as the network grows. This approach unlocks executing of a massive number of transactions. 

In TON, sharding is highly dynamic. Unlike other blockchains, which have a fixed number of shards, TON can create new shards on demand. 
As the transaction load increases, shards split, and as the load decreases, they merge. 
This flexibility ensures that the system can adapt to varying workloads while maintaining efficiency.

The **MasterChain** plays a crucial role, maintaining the network configuration and the final state of all **WorkChains** and **ShardChains**. 
While the masterchain is responsible for overall coordination, **WorkChains** operate under their specific rules, each of which can be split further into shardchains. 
Currently, only one workchain - the **BaseChain**, operates on TON.

At the heart of TON's efficiency is the **Infinity sharding paradigm**, which treats each account as part of its own AccountChain.
These accountchains are then aggregated into shardchain blocks, facilitating efficient transaction processing.

In addition to the dynamic creation of shards, TON uses **split merge** functionality, which allows the network to efficiently respond to changing transaction loads. This system enhances scalability and interaction within the blockchain network, exemplifying TON's approach to resolving common blockchain challenges with a focus on efficiency and global consistency.


## See also

* [Blockchain of blockchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains/)
* [Shards Dive In](/v3/documentation/smart-contracts/shards/shards-intro)
* [# Infinity Sharding Paradigm](/v3/documentation/smart-contracts/shards/infinity-sharding-paradigm)
