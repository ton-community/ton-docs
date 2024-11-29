
# Staking Incentives

## Election and Staking

TON Blockchain uses the Proof of Stake (PoS) consensus algorithm, meaning that, like all PoS networks, the network's security and stability are maintained by a set of network validators. In particular, validators propose candidates for new blocks (made up of transaction batches), while other validators _validate_ and approve them via digital signatures.


Validators are chosen using a special [Elector governance contract](/v3/documentation/smart-contracts/contracts-specs/governance#elector). During each consensus round, validator candidates send an application for election along with their stake and desired _max_factor_ (a parameter which regulates the amount of maintenance the validator performs per consensus round).

During the validator election process, the governance smart contract chooses the next round of validators and assigns a voting weight to each validator to maximize their total stake, while also taking into consideration the validator’s stake and _max_factor_. In this respect, the higher the stake and _max_factor_, the higher the voting weight of the validator and vice versa.

Elected validators are chosen to secure the network by participating in the next consensus round. However, unlike many other blockchains, to achieve horizontal scalability, each validator validates only a portion of the network:

A dedicated set of validators exists for each shardchain and masterchain. Sets of masterchain validators consist of up to 100 validators that exhibit the highest voting weight (defined as Network Parameter `Config16:max_main_validators`).

In contrast, each shardchain is validated by a set of 23 validators (defined as Network Parameter `Config28:shard_validators_num`) and rotated randomly every 1000 seconds (Network Parameter `Config28:shard_validators_lifetime`).

## Values of Stakes: Max Effective Stake

The current `max_factor` in config is __3__, meaning the stake of the _smallest_ validator cannot be more than three times less than the stake of the _largest_ one.

The formula with the config parameters:

`max_factor` =  [`max_stake_factor`](https://tonviewer.com/config#17) / [`validators_elected_for`](https://tonviewer.com/config#15)

### (Simplified) Selection Algorithm

This algorithm, run by the [Elector smart contract](/v3/documentation/smart-contracts/contracts-specs/governance#elector), selects the best validator candidates based on the stake they have committed. Here's a breakdown of how it works:

1. **Initial Selection**: Elector considers all candidates who have staked more than a set minimum amount (300K, as specified in the [configuration](https://tonviewer.com/config#17)).

2. **Ordering Candidates**: These candidates are then arranged from highest to lowest based on their stake.

3. **Narrowing Down**:
   - If the number of candidates exceeds the maximum allowed number of validators ([see configuration](https://tonviewer.com/config#16)), those with the lowest stakes are excluded.
   - The Elector then evaluates each potential group of candidates, starting from the largest group and moving to smaller ones:
      - It examines the top candidates in the ordered list, increasing the number one by one.
      - For each candidate, Elector calculates their 'effective stake'. If a candidate's stake is significantly higher than the minimum, it's adjusted down (e.g., if someone staked 310k and the minimum is 100k, but there's a rule capping at three times the minimum, their effective stake is considered as 300k).
      - It sums up the effective stakes of all candidates in this group.

4. **Final Selection**: The group of candidates with the highest total effective stake is chosen as the validators by the Elector.


#### Validator Selection Algorithm

Based on the available stakes of potential validators, optimal values for the minimum and maximum stake are determined, with the aim of maximizing the magnitude of the total stake:

1. Elector takes all applicants who have a stake higher than the minimum ([300K in config](https://tonviewer.com/config#17)).
2. Elector sorts them in _descending_ order of stake.
3. If there are more participants than the [maximum number](https://tonviewer.com/config#16) of validators, Elector discards the tail of the list. Then Elector does the following:

   * For each cycle __i__ from _1 to N_ (the remaining number of participants), it takes the first __i__ applications from the sorted list.
   * It calculates the effective stake, considering the `max_factor`. That is, if a person has put in 310k, but with a `max_factor` of 3, and the minimum stake in the list is 100k Toncoins, then the effective stake will be min(310k, 3*100k) = 300k. One validator node may use up to 600k TON (in this example) in two rounds (half in odd rounds, half in even rounds). To increase the stake, it is necessary to set up multiple validator nodes.
   * It calculates the total effective stake of all __i__ participants.

Once Elector finds such an __i__, where the total effective stake is maximal, we declare these __i__ participants as validators.

## Positive Incentives

Similarly to all blockchain networks, each transaction on TON requires a computation fee called [gas](https://blog.ton.org/what-is-blockchain) used to conduct network storage and the transaction processing on-chain. On TON, these fees are accumulated within the Elector contract in a reward pool.

The network also subsidizes block creation by adding a subsidy to the reward pool equal to 1.7 TON for each masterchain block and 1 TON for each basechain block (Network Parameters `Config14:masterchain_block_fee` and `Config14:basechain_block_fee`). Note, that when splitting a basechain into more than one shardchain, the subsidy per shardchain block is split accordingly. This process allows the subsidy per unit of time to be kept near constant.

:::info
In June 2023, the [Deflationary Burn Mechanism](https://blog.ton.org/ton-holders-and-validators-vote-in-favor-of-implementing-the-toncoin-real-time-burn-mechanism) was introduced. With this mechanism, a portion of the TON generated by the network is burned instead of being allocated to the rewards pool.
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

If a validator does not participate in block creation and transaction signing for a significant amount of time during a validation round, it is potentially fined using the _Standard fine_ parameter. As of April 2023, the Standard fine accrued is 101 TON (Network Parameter `ConfigParam40:MisbehaviorPunishmentConfig`).

On TON, slashing penalties (fines given to validators) allow any network participant to file a complaint if they believe a validator is misbehaving. During this process, the participant issuing the complaint must attach cryptographic proofs of misbehavior for Elector submission. During the `stake_held_for` dispute resolution period, all validators operating on the network check the validity of complaints and vote whether they will pursue the complaint collectively (while determining the legitimacy of misbehaving proofs and fine allotment).  

Upon reaching 66% validator approval (measured by an equal voting weight), a slashing penalty is deducted from the validator and withdrawn from the validator’s total stake. The validation process for penalization and complaint resolution is typically conducted automatically using the MyTonCtrl.


## Decentralized System of Penalties

:::info
The following system of penalising poorly performing validators fully operational September 9, 2024.
:::

### Determination of Poor Work

The TON is supplied with the [lite-client](https://github.com/newton-blockchain/ton/tree/master/lite-client) utility. In lite-client there is a `checkloadall` command.
This command analyses how many blocks the validator should have processed, and how many it actually processed in a given period of time.

If the validator processed less than 90% of the expected number of blocks during a validation round, it is considered to be performing poorly and should be penalised.
:::info
Learn more about technical description of the process [here](https://github.com/ton-blockchain/TIPs/issues/13#issuecomment-786627474)
:::
### Complain Workflow

- Anyone can make complain and get reward on right complain.
- Validation of complain maintain by Validators and fully decentralized.

#### Make Complain

After each validation round (~18 hours), the validator stakes of validators that participated in that round are on the Elector smart contract for another ~9 hours.
During this time, anyone can send a complaint against a validator who performed poorly in said round. This happens on-chain on the Elector smart contract.

#### Validation of Complaint

After each validation round, validators receive a list of complaints from the Elector smart contract and double-check them by calling `checkloadall`.
In case the complaint is validated, they on-chain vote in favour of that complaint.

These actions are built into `mytonctrl` and happen automatically.
If the complaint has 66% of the validators' votes (by their weight), a penalty is taken off from the validator's stake.
There is no way for anyone to single-handedly fine anyone.

[@tonstatus_notifications](https://t.me/tonstatus_notifications) - list of penalised validators each round.


### Fine Value

The amount of the fine is fixed and equals 101 TON(Network Parameter `ConfigParam40:MisbehaviourPunishmentConfig`), which is roughly equal to the validator's income per round.

Value of fine may change, due the audience and the number of transactions in TON is growing rapidly and it is vital that the quality of work is at its best.

### Fine Distribution 

The fine is distributed among the validators minus network costs and a small reward (~8 TON) to the first complainer who sent the correct complaint to the Elector.

### Validator Guidelines

To prevent your Validator node from being fined, it is advisable to ensure that the hardware, monitoring, and validator operations are set up properly.
Please make sure you're complying with the [validator maintain guidelines](/v3/guidelines/nodes/running-nodes/validator-node#maintain-guidelines).
If you don't want to do this please consider using staking services https://ton.org/stake.

## See Also

* [Running a Validator](/v3/guidelines/nodes/running-nodes/validator-node)
* [Transaction Fees](/v3/documentation/smart-contracts/transaction-fees/fees)
* [What is blockchain? What is a smart contract? What is gas?](https://blog.ton.org/what-is-blockchain)
