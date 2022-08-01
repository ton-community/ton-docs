# Actors chains
## Single actor
*Terms 'smart contract', 'account' and 'actor' are used interchangeably in this document to define a blockchain entity.*

Let's consider one smart contract. In TON it is a _thing_, with properties like `address`, `code`, `data`, `balance` and others. In other words, it is an object which has some _storage_ and _behavior_.
That behavior has the following pattern:
* something happens (the most common situation is that a contract gets a message)
* contract handles that event according to its own properties by executing its `code` in TON Virtual Machine.
* contract modifies its own properties (`code`, `data` and others)
* contract optionally generates outgoing messages
* contract goes to the standby mode till the next event

A combination of these steps is called **transaction**. It is important that events are handled one by one, thus _transactions_ are strictly ordered and cannot interrupt each other.

This behavior pattern is well known and called Actor.

Sequence of _transactions_ `Tx1 -> Tx2 -> Tx3 -> ....` may be called **chain**. And in the considered case it is called **AccountChain** to emphasize that it is _the chain_ of a single account transactions.

Now, since nodes that process transactions need from time to time to coordinate the state of the smart contract (to reach a _consensus_ about the state) those _transactions_ are batched.
`[Tx1 -> Tx2] -> [Tx3 -> Tx4 -> Tx5] -> [] -> [Tx6]`
Batching does not intervene in sequencing, each transaction still has only one prev tx and at most one next tx, but now this sequence is cut into the **blocks**. 

It is also expedient to include queues of incoming and outgoing messages to _blocks_. In that case, _block_ will contain a full set of information that determine and describe what happened to the smart contract during that block.

## Shards
Now let's consider many accounts. We can get a few _AccountChains_ and store them together, such set of _AccountChains_ is called **ShardChain**. In the same way, we can cut **ShardChain** into the **ShardBlocks**, which are an aggregation of individual _AccountBlocks_.


Note that since _ShardChain_ consists of easily distinguished _AccountChains_ we can easily split them. That way if we have 1 _ShardChain_ which describes events that happen with 1 million accounts and there are too many transactions per second for being processed and stored by one node, we just divide (or **split**) that chain into two smaller _ShardChains_ with each chain accounting for half million of accounts and each chain processed on a separate subset of nodes.

Analogously, if some shards became too unoccupied they can be **merged** into one bigger shard.

There are obviously two limiting cases: when the shard contains only one account (and thus can not be split further) and when the shard contains all accounts.

Accounts can interact with each other by sending messages. There is a special mechanism of routing which move messages from outgoing queues to corresponding incoming queues and ensures that 1) all messages will be delivered 2) messages will be delivered consequently (the message sent earlier will reach the destination earlier).

_Side note:_ to make splitting and merging deterministic, aggregation of accountchains into shards is based on bit-representation of account addresses. That way all accounts in shardchain will have exactly the same binary prefix (for instance all addresses will start with `0b00101`).

## Blockchain
Aggregation of all shards which contain all accounts behaving by one set of rules is called a **Blockchain**.

In TON there can be many sets of rules and thus many blockchains which operate simultaneously and can interact with each other by sending messages crosschain the same way how accounts of one chain interact with each other.

### Masterchain
There is a necessity for the synchronization of message routing and transaction execution. In other words, nodes in the network need a way to fix some 'point' in a multichain state and reach a consensus about that state. In TON for that purpose a special chain **MasterChain** is used. Blocks of _masterchain_ contain additional information (latest block hashes) about all other chains in the system, thus any observer unambiguously determines the state of all multichain systems at some masterchain block.
