import Feedback from '@site/src/components/Feedback';

# Blockchain of blockchains


:::tip
Terms '**smart contract**', '**account**', and '**actor**' are used interchangeably in this document to describe a blockchain entity.
:::

## Single actor

Let's consider one smart contract.

In TON, it is a _thing_ with properties like `address`, `code`, `data`, `balance` and others. In other words, it is an object with some _storage_ and _behavior_.
That behavior has the following pattern:
* contract receives a message
* contract handles that event according to its properties by executing its `code` in TON Virtual Machine
* contract modifies its properties consisting of `code`, `data`, and others
* contract optionally generates outgoing messages
* contract goes into standby mode until the next event occurs

A combination of these steps is called a **transaction**. Since it is essential to handle events one by one, transactions follow a strict order and cannot interrupt each other.

This behavior pattern is well known and called **actor**.

### The lowest level: AccountChain

A **chain** can be viewed as a sequence of transactions, such as `Tx1 → Tx2 → Tx3 → …`. When this transaction sequence pertains to a single account, it is specifically termed an **AccountChain**.

Since nodes processing these transactions periodically need to synchronize the smart contract state to achieve consensus, transactions are grouped into batches called **blocks**. For instance:

```
[Tx1 → Tx2] → [Tx3 → Tx4 → Tx5] → [] → [Tx6]
```

Batching does not alter the underlying sequence. Each transaction still references exactly one preceding transaction (`prev tx`) and at most one succeeding transaction (`next tx`). Batching simply organizes this sequence into manageable blocks for consensus purposes.

Additionally, each block can contain queues of incoming and outgoing messages. Incorporating these queues ensures that a block fully encapsulates all events and state changes relevant to the smart contract within the block period.


## Many AccountChains: Shards

Now let's consider many accounts. We can get a few AccountChains and store them together; such a set of AccountChains is called a **ShardChain**. In the same way, we can cut ShardChain into **ShardBlocks**, which are an aggregation of individual AccountBlocks.

### Dynamic splitting and merging of ShardChains

Note that since a ShardChain consists of easily distinguished AccountChains, we can easily split it. That way, if we have one ShardChain that describes events that happen with one million accounts and there are too many transactions per second to be processed and stored in one node, so we just **split** that chain into two smaller ShardChains with each chain accounting for half a million accounts and each chain processed on a separate subset of nodes.

Analogously, if some shards become too unoccupied, they can be **merged** into one more enormous shard.

There are two limiting cases: when the shard contains only one account (and thus cannot be split further) and when the shard contains all accounts.

Accounts can interact with each other by sending messages.  A unique routing mechanism moves messages from outgoing queues to corresponding incoming queues and ensures:
1. The delivery of all messages
2. Consecutive delivery of messages — a message sent earlier will reach the destination earlier

:::info SIDE NOTE
An aggregation of AccountChains into shards is based on the bit-representation of account addresses to make splitting and merging deterministic. For example, an address looks like `(shard prefix, address)`. That way, all accounts in the ShardChain will have the same binary prefix (for instance, all addresses will start with `0b00101`).
:::


## Blockchain

An aggregation of all shards, which contains all accounts behaving according to one set of rules, is called a Blockchain.

In TON, there can be many sets of rules, and thus, many blockchains operate simultaneously and can interact with each other by sending messages cross-chain in the same way that accounts of one chain can interact with each other.

### WorkChain: a blockchain with your own rules

If you want to customize the rules of the ShardChains group, you could create a **WorkChain**. A good example is to make a workchain that works on the base of EVM to run Solidity smart contracts on it.


Theoretically, everyone in the community can create their own WorkChain. Building it isn't very easy, and then you have to pay a high price and receive 2/3 of votes from validators to approve it.

TON allows creating up to `2^32` workchains, subdivided into `2^60` shards.

Nowadays, there are only two workchains in TON: MasterChain and BaseChain.

BaseChain is used for everyday transactions between actors because it's cheap, while MasterChain has a crucial function for TON.

### MasterChain: blockchain of blockchains

There is a necessity for the synchronization of message routing and transaction execution. In other words, nodes in the network need a way to fix some 'point' in a multichain state and reach a consensus about that state. In TON, a special chain called **MasterChain** is used for that purpose. Blocks of MasterChain contain additional information, like the latest block hashes, about all other chains in the system, thus any observer unambiguously determines the state of all multichain systems at a single MasterChain block.

## See also
- [Smart contract addresses](/v3/concepts/dive-into-ton/ton-blockchain/smart-contract-addresses/)


<Feedback />

