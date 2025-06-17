import Feedback from '@site/src/components/Feedback';

# Blockchain of blockchains

:::tip
本文档中，“**智能合约**”、“**账户**”和“**Actor**”这几个术语可互换使用，用以描述区块链实体。
:::

## 单一Actor

让我们考虑一个智能合约。

In TON, it is a _thing_ with properties like `address`, `code`, `data`, `balance` and others. In other words, it is an object with some _storage_ and _behavior_.
That behavior has the following pattern:

- 发生某事（最常见的情况是合约收到一条消息）
- 合约根据自身属性通过在TON虚拟机中执行其`代码`来处理该事件。
- 合约修改自身属性（`代码`、`数据`等）
- 合约可选地生成传出消息
- 合约进入待机模式，直到下一个事件发生

这些步骤的组合被称为一次**交易**。重要的是，事件是依次处理的，因此_交易_是严格有序的，不能相互打断。 Since it is essential to handle events one by one, transactions follow a strict order and cannot interrupt each other.

这种行为模式众所周知，被称为“Actor”。

### 最低层级：账户链

一系列的_交易_ `Tx1 -> Tx2 -> Tx3 -> ....` 可以被称为一条**链**。在这个例子下，它被称为**账户链 (AccountChain)**，以强调这是单个账户的_交易链_。 When this transaction sequence pertains to a single account, it is specifically termed an **AccountChain**.

Since nodes processing these transactions periodically need to synchronize the smart contract state to achieve consensus, transactions are grouped into batches called **blocks**. For instance:

```
[Tx1 → Tx2] → [Tx3 → Tx4 → Tx5] → [] → [Tx6]
```

Batching does not alter the underlying sequence. Each transaction still references exactly one preceding transaction (`prev tx`) and at most one succeeding transaction (`next tx`). Batching simply organizes this sequence into manageable blocks for consensus purposes.

Additionally, each block can contain queues of incoming and outgoing messages. Incorporating these queues ensures that a block fully encapsulates all events and state changes relevant to the smart contract within the block period.

## Many AccountChains: Shards

Now let's consider many accounts. We can get a few AccountChains and store them together; such a set of AccountChains is called a **ShardChain**. In the same way, we can cut ShardChain into **ShardBlocks**, which are an aggregation of individual AccountBlocks.

### 分片链的动态拆分与合并

Note that since a ShardChain consists of easily distinguished AccountChains, we can easily split it. 现在让我们考虑有许多账户的情况。我们得到一些_账户链_并将它们存储在一起，这样的一组_账户链_被称为**分片链 (ShardChain)**。同样地，我们可以将**分片链**切割成**分片区块**，这些区块是个别_账户区块_的聚合。

Analogously, if some shards become too unoccupied, they can be **merged** into one more enormous shard.

显然有两个极限情况：分片只包含一个账户（因此无法进一步分割）以及当分片包含所有账户。

Accounts can interact with each other by sending messages.  A unique routing mechanism moves messages from outgoing queues to corresponding incoming queues and ensures:

1. The delivery of all messages
2. Consecutive delivery of messages — a message sent earlier will reach the destination earlier

:::info SIDE NOTE
An aggregation of AccountChains into shards is based on the bit-representation of account addresses to make splitting and merging deterministic. For example, an address looks like `(shard prefix, address)`. That way, all accounts in the ShardChain will have the same binary prefix (for instance, all addresses will start with `0b00101`).
:::

## Blockchain

包含所有账户并按照一套规则运行的所有分片的集合被称为**区块链**。

在TON中，可以有许多套规则，因此允许多个区块链同时运行，并通过发送跨链消息相互交互，就像同链的账户之间的交互一样。

### 工作链：有自己规则的区块链

If you want to customize the rules of the ShardChains group, you could create a **WorkChain**. 如果你想自定义一组分片链的规则，你可以创建一个**工作链 (Workchain)**。一个很好的例子是创建一个基于EVM的工作链，在其上运行Solidity智能合约。

Theoretically, everyone in the community can create their own WorkChain. Building it isn't very easy, and then you have to pay a high price and receive 2/3 of votes from validators to approve it.

TON允许创建多达`2^32`个工作链，每个工作链则可以细分为多达`2^60`个分片。

如今，在TON中只有2个工作链：主链和基本链。

基本链用于日常交易，因为它相对便宜，而主链对于TON具有至关重要的功能，所以让我们来了解它的作用！

### MasterChain: blockchain of blockchains

There is a necessity for the synchronization of message routing and transaction execution. In other words, nodes in the network need a way to fix some 'point' in a multichain state and reach a consensus about that state. In TON, a special chain called **MasterChain** is used for that purpose. Blocks of MasterChain contain additional information, like the latest block hashes, about all other chains in the system, thus any observer unambiguously determines the state of all multichain systems at a single MasterChain block.

## See also

- [Smart contract addresses](/v3/concepts/dive-into-ton/ton-blockchain/smart-contract-addresses)

<Feedback />

