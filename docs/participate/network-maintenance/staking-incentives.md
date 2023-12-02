
# Staking Incentives

## Election and Staking

TON Blockchain makes use of the Proof of Stake (PoS) consensus algorithm which means, like all PoS networks, that the network’s security and stability is maintained by a set of network validators. In particular, validators propose candidates for new blocks (made up of transaction batches), while other validators _validate_ and approve them via digital signatures.


Validators are chosen using special [Elector governance contract](/develop/smart-contracts/governance#elector). During each consensus round, validator candidates send an application for election along with their stake and desired _max_factor_ (a parameter which regulates the amount of maintenance the validator performs per consensus round).

During the validator election process, the governance smart contract chooses the next round of validators and assigns a voting weight to each validator to maximize their total stake, while also taking into consideration the validator’s stake and _max_factor_. In this respect, the higher the stake and _max_factor_, the higher the voting weight of the validator and vice versa.

Validators that are elected are chosen to secure the network by participating in the next consensus round. However, unlike many other blockchains, to achieve horizontal scalability, each validator validates only a portion of the network:

For each shardchain and masterchain a dedicated set of validators exists. Sets of masterchain validators consist of up to 100 validators that exhibit the highest voting weight (defined as Network Parameter `Config16:max_main_validators`).

In contrast, each shardchain is validated by a set of 23 validators (defined as Network Parameter `Config28:shard_validators_num`) and rotated randomly every 1000 seconds (Network Parameter `Config28:shard_validators_lifetime`).

## Boundary Values of Stakes

The current max_factor is 3, meaning the stake of the smallest validator cannot be more than three times less than the stake of the largest one.

:::info
Recently, the approximate figures have been a minimum stake of around 340 thousand Toncoins and a maximum of about one million Toncoins.

Learn more about current validation stakes with [tonscan.com](https://tonscan.com/validation).
:::

Based on the available stakes of potential validators, optimal values for the minimum and maximum stake are determined, with the aim of maximizing the magnitude of the total stake.

1. Elector takes all applicants who have a stake higher than the minimum ([300k](https://tonviewer.com/config#17)).
2. Elector sorts them in descending order of stake.
3. If there are more participants than the [maximum number](https://tonviewer.com/config#16) of validators, Elector discards the tail of the list. Then Elector does the following:

   * For each cycle i from 1 to N (the remaining number of participants), it takes the first i applications from the sorted list.
   * It calculates the effective stake, considering the `max_factor`. That is, if a person has put in 310k, but with a `max_factor` of 3, and the minimum stake in the list is 300k Toncoins, then the effective stake will be min(300k, 3*310k) = 300k.
   * It calculates the total effective stake of all i participants.

Once Elector finds such an i, where the total effective stake is maximal, we declare these i participants as validators.

## Positive Incentives

Similarly to all blockchain networks, each transaction on TON requires a computation fee called [gas](https://blog.ton.org/what-is-blockchain) used to conduct network storage and the transaction processing on-chain. On TON, these fees are accumulated within the Elector contract in a reward pool.

The network also subsidizes block creation by adding a subsidy to the reward pool equal to 1.7 TON for each masterchain block and 1 TON for each basechain block (Network Parameters `Config14:masterchain_block_fee` and `Config14:basechain_block_fee`). Note, that when splitting a basechain into more than one shardchain, the subsidy per shardchain block is split accordingly. This process allows the subsidy per unit of time to be kept near constant.

:::info
TON Blockchain is planning to introduce a deflationary mechanism in Q2 of 2023. In particular, a portion of TON generated via network use will be burned instead of going to the rewards pool.
:::

After a validation cycle round lasting 65536 seconds or ~18 hours (Network Parameter `Config15:validators_elected_for`), staked TON is not immediately released by each validator, but instead held for an additional 32768 seconds or ~9 hours (Network Parameter `Config15:stake_held_for`). During this period, slashing (a penalization mechanism for misbehaving validators) penalties can be deducted from the validator. After funds are released, validators can withdraw their stake along with a share of the reward pool accrued during the validation round proportional to their voting _weight_.

As of April 2023, the total reward pool per consensus round for all validators on the network is approximately 40,000 TON, with the average reward per validator being ~ 120 TON (the maximum difference between voting weight and the accrued rewards is ~3 TON).

Given the total supply of Toncoin (5 billion TON) has an inflation rate of approximately 0.3-0.6% annually.

This inflation rate, however, is not always constant, and may deviate depending on the network’s current state. Eventually it will tend to deflation after Deflation mechanism activation and growth of network utilization.

:::info
Learn current TON Blockchain stats [here](https://tontech.io/stats/).
:::


## Negative Incentives

On TON Blockchain, there are generally two ways validators can be penalized for misbehaving: idle and malicious misbehaving; both of which are prohibited and may result in being fined (in a process called slashing) for their actions.

If a validator does not participate in block creation and transaction signing for a significant amount of time during a validation round, it is potentially fined using the _Standard fine_ parameter. As of April 2023, the Standard fine accrued is 101 TON (Network Parameter `ConfigParam40:MisbehaviourPunishmentConfig`).

:::info
TON is planning to increase the _Standard fine_ for validators by the end of 2023.
:::

On TON, slashing penalties (fines given to validators) allow any network participant to file a complaint if they believe a validator is misbehaving. During this process, the participant issuing the complaint must attach cryptographic proofs of misbehavior for Elector submission. During the `stake_held_for` dispute resolution period, all validators operating on the network check the validity of complaints and vote whether they will pursue the complaint collectively (while determining the legitimacy of misbehaving proofs and fine allotment).  

Upon reaching 66% validator approval (measured by an equal voting weight), a slashing penalty is deducted from the validator and withdrawn from the validator’s total stake. The validation process for penalization and complaint resolution is typically conducted automatically using the MyTonCtrl.


## See Also

* [Running a Full Node (Validator)](/participate/run-nodes/full-node)
* [Transaction Fees](/develop/smart-contracts/fees)
* [What is blockchain? What is a smart contract? What is gas?](https://blog.ton.org/what-is-blockchain)