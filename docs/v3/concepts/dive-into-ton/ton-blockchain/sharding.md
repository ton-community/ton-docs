# Sharding in TON

Sharding in TON refers to dividing the blockchain into smaller, manageable parts shards for scalability. A shard is a smaller piece of a blockchain that operates and is maintained by an independent set of validators.
These shards can handle transactions in parallel, ensuring high throughput even as the network grows. This approach unlocks the execution of a massive number of transactions. 

In TON, sharding is highly dynamic. Unlike other blockchains with a fixed number of shards, TON can create new shards on demand. 
Shards split as the transaction load increases, and as the load decreases, they merge. 
This flexibility ensures the system can adapt to varying workloads while maintaining efficiency.

![](/img/docs/blockchain-fundamentals/scheme.png)

The **MasterChain** is crucial in maintaining the network configuration and the final state of all **WorkChains** and **ShardChains**. 
While the MasterChain is responsible for overall coordination, WorkChains operate under their specific rules, each of which can be split further into shardchains. 
Only one WorkChain - the **BaseChain**, currently operates on TON.

At the heart of TON's efficiency is the **Infinity sharding paradigm**, which treats each account as part of its own AccountChain.
These accountchains are then aggregated into shardchain blocks, facilitating efficient transaction processing.

In addition to dynamically creating shards, TON uses **split merge** functionality, which allows the network to efficiently respond to changing transaction loads. This system enhances scalability and interaction within the blockchain network, exemplifying TON's approach to resolving common blockchain challenges with a focus on efficiency and global consistency.


## See also

* [Blockchain of blockchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains/)
* [Shards dive in](/v3/documentation/smart-contracts/shards/shards-intro/)
* [Infinity sharding paradigm](/v3/documentation/smart-contracts/shards/infinity-sharding-paradigm/)
