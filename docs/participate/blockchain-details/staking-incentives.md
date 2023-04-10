#Staking Incentives

TON is a Proof of Stake network. It means that its security, and stability is maintained by Validators.
In particular Validators propose candidats for new blocks (batches of transactions), while other Validators *validate* and approve them via signature.

Validators are chosen via special [Elector governance contract](/develop/smart-contracts/governance#elector). In short, for each round of validation, validator candidates send application to the election along with stake (Toncoin) and desired *max_factor* (parameter which regulate how much maintenance work the validator is willing to perform). During election, contract chooses next round validators and assigns a *weight* to each validator to maximize total stake, while simultaneously respect stake and *max_factor* : the higher stake and *max_factor* the higher weight and vice versa.

Validators which won the election participate in securing network in next validation round. However, unlike many other networks, to achieve horizontal scalability, each validator validates only part of the network:

For each shardchain as well as masterchain there is a dedicated set of Validators. Set of masterchain validators consist of up to 100 validators with highest weight (that number is Network Parameter `Config16:max_main_validators`). In contrast, each shardchain is validated by set of 23 validators (that number is Network Parameter `Config28:shard_validators_num`). This set is frequently rotated each 1000 seconds (Network Parameter `Config28:shard_validators_lifetime`).

## Positive incentives

Each transction in TON spends some fees for computation (called `gas`), storage and message sending. This fees are accumulated on Elector contract in reward pool. Additionally, Network subsidize block creation by adding subsidy to reward pool equal of 1.7 TON for each masterchain block and 1 TON for each basechain block (Network Parameters `Config14:masterchain_block_fee` and `Config14:basechain_block_fee`). Note, that in the case of splitting basechain to two or many shardchains, subsidy per shardchain block is splitted accordingly. That way subsidy per unit of time is kept near constant.

:::info
It is planned to introduce Deflation mechanism in 2023 Q2. In particular, part of network commision will be burn instead of going to reward pool.
:::

After validation round that lasts 65536 seconds or ~18 hours (Network Parameter `Config15:validators_elected_for`) stakes are not immediately released but are held for additional 32768 seconds or ~9hours (Network Parameter `Config15:stake_held_for`). During that period fines can be deducted (see below). After fund release validators can withdraw their stakes back along with share of reward pool accrued during validation round proportional to their *weight*.

At the moment of writing (April 6 2023), total reward pool per round is ~40'000 Toncoin and average reward per validator is ~120 Toncoin (maximal difference in weight and thus in reward is ~3).

Given 5 billion Toncoins of total supply that gives inflation rate of about 0.3-0.6% annually. This number, however is not constant and may deviate depending on network condition. Eventually it will tend to deflation after Deflation mechanism activation and growth of network utilization.

## Negative incentives

Generally there are two types of validator misbehaving: idle and malicious, both are and prohibited may be fined.

If validator does not participate in block creation and signing for substantial time during the round, it can be fined by *Standard fine*. Currently it is set to be 101 Toncoin (Network Parameter `ConfigParam40:MisbehaviourPunishmentConfig`).

:::info
It is planned to multiply increase fine by the end of 2023.
:::

In contrast, if validator maliciously generate or signs incorrect blocks there is no limitation of fine size. In worst scenario, validator may lose the whole stake. In other words, validator vouches for its correct behavior with the whole stake.


Fines are functioning as follows: anybody can create complaint for validator misbehaving, attach proofs of misbehavior and submit it to Elector. During `stake_held_for` period other validators, check complaints (misbehaving proofs and size of the fine) and vote for it. Upon reaching 66% of approval validators (measured by weight), fine is deducted from the amount that will be withdrawn by reported validator. Routine of checking and voting for complaints is usually done automatically by MyTonCtrl.
