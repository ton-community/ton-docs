import Feedback from '@site/src/components/Feedback';

# Sharding in TON

TON 区块链采用先进的分片机制来提高可扩展性和性能，使其能够高效处理大量交易。
其核心理念是将区块链分割成较小的、独立的片段，称为**分片**。这些分片可以并行处理交易，即使网络在增长，也能确保高吞吐量。 An independent set of validators operates and maintains a shard as a smaller piece of the blockchain.

Validators in separate shards can handle transactions in parallel, ensuring high throughput even as the network grows. This approach unlocks the execution of a massive number of transactions.

In TON, sharding is highly dynamic. Unlike other blockchains with a fixed number of shards, TON can create new shards on demand.
Shards split as the transaction load increases, and as the load decreases, they merge.
This flexibility ensures the system can adapt to varying workloads while maintaining efficiency.

![](/img/docs/blockchain-fundamentals/scheme.png)

The **MasterChain** is crucial in maintaining the network configuration and the final state of all **WorkChains** and **ShardChains**.
While the MasterChain is responsible for overall coordination, WorkChains operate under their specific rules, each of which can be split further into SharChains.
Only one WorkChain - the **BaseChain**, currently operates on TON.

TON效率的核心是**无限分片范式**，它将每个账户视为其自身 "账户链 "的一部分。
然后，这些账户链被聚合成分片链区块，从而促进高效的交易处理。
These AccountChains are then aggregated into ShardChain blocks, facilitating efficient transaction processing.

除了动态创建分片外，TON 还使用了**拆分合并**功能，使网络能够有效地应对不断变化的交易负载。该系统增强了区块链网络内的可扩展性和互动性，体现了 TON 以效率和全球一致性为重点解决常见区块链难题的方法。 This system enhances scalability and interaction within the blockchain network, exemplifying TON's approach to resolving typical blockchain challenges with a focus on efficiency and global consistency.

## 另请参见

- [Blockchain of blockchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains/)
- [深入分片](/v3/documentation/smart-contracts/shards/shards-intro)
- [#无限分片范式](/v3/documentation/smart-contracts/shards/infinity-sharding-paradigm)

<Feedback />

