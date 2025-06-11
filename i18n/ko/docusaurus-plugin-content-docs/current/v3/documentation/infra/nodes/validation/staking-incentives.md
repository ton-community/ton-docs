import Feedback from '@site/src/components/Feedback';

# Staking incentives

## Election and staking

TON Blockchain uses the **Proof-of-stake (PoS)** consensus algorithm, meaning that, like all PoS networks, a set of network validators maintains the network's security and stability. In particular, validators propose candidates for new blocks (made up of transaction batches), while other validators _validate_ and approve them via digital signatures.

Validators are chosen using a special [Elector governance contract](/v3/documentation/smart-contracts/contracts-specs/governance#elector). During each consensus round, validator candidates send an application for election along with their stake and desired _max_factor_ (a parameter that regulates the amount of maintenance the validator performs per consensus round).

During the validator election process, the governance smart contract chooses the next round of validators and assigns a voting weight to each validator to maximize their total stake while also considering the validator’s stake and _max_factor_. In this respect, the higher the stake and _max_factor_, the higher the voting weight of the validator, and vice versa.

Elected validators are selected to secure the network by participating in the next consensus round. However, to achieve horizontal scalability, each validator verifies only a portion of the network, unlike many other blockchains:

Each ShardChain and MasterChain has a dedicated set of validators. Sets of master chain validators consist of up to 100 validators exhibiting the highest voting weight (defined as Network Parameter `Config16:max_main_validators`).

Each ShardChain is validated by 23 validators, as defined by Network Parameter `Config28:shard_validators_num`. These validators are rotated randomly every 1000 seconds according to Network Parameter `Config28:shard_validators_lifetime`.

## Values of stakes: max effective stake

The current `max_factor` in config is **3**, meaning the stake of the _smallest_ validator cannot be more than three times less than the stake of the **largest** one.

설정 매개변수를 사용한 공식:

`max_factor` = [`max_stake_factor`](https://tonviewer.com/config#17) / [`validators_elected_for`](https://tonviewer.com/config#15)

### Selection algorithm review

[선거인 스마트 컨트랙트](/v3/documentation/smart-contracts/contracts-specs/governance#elector)가 실행하는 이 알고리즘은 약정한 스테이크를 기반으로 최적의 검증자 후보를 선택합니다. 작동 방식은 다음과 같습니다:

1. **Initial selection**: Elector considers all candidates who have staked more than a set minimum amount (300K, as specified in the [configuration](https://tonviewer.com/config#17)).

2. **Ordering candidates**: These candidates are then arranged from highest to lowest based on their stake.

3. **Narrowing down**:

- 후보 수가 허용된 최대 검증자 수를 초과하면([설정 참조](https://tonviewer.com/config#16)), 가장 낮은 스테이크를 가진 후보들이 제외됩니다.

- 그런 다음 선거인은 가장 큰 그룹부터 작은 그룹으로 이동하며 각 잠재적 후보 그룹을 평가합니다:

    - 정렬된 목록에서 상위 후보들을 하나씩 늘려가며 검토합니다.

    - For each candidate, Elector calculates their **effective stake**. If a candidate's stake is significantly higher than the minimum, it's adjusted down (e.g., if someone staked 310k and the minimum is 100k, but there's a rule capping at three times the minimum, their effective stake is considered as 300k).

    - 이 그룹의 모든 후보의 유효 스테이크 합계를 계산합니다.

4. **Final selection**: The elector chooses the group of candidates with the highest total effective stake as the validators.

#### Validator selection algorithm

잠재적 검증자의 사용 가능한 스테이크를 기반으로 총 스테이크의 크기를 최대화하는 것을 목표로 최소 및 최대 스테이크의 최적값이 결정됩니다:

1. 선거인은 최소값([설정의 300K](https://tonviewer.com/config#17))보다 높은 스테이크를 가진 모든 지원자를 선택합니다.

2. Elector sorts them in _descending_ order of stake.

3. 참가자가 검증자의 [최대 수](https://tonviewer.com/config#16)보다 많으면 선거인은 목록의 끝부분을 버립니다. 그런 다음 선거인은 다음을 수행합니다:

    - _1부터 N_(남은 참가자 수)까지 각 사이클 __i__에 대해 정렬된 목록에서 처음 __i__개의 신청서를 가져옵니다.

    - `max_factor`를 고려하여 유효 스테이크를 계산합니다. 즉, 어떤 사람이 310k를 넣었지만 `max_factor`가 3이고 목록의 최소 스테이크가 100k Toncoin인 경우, 유효 스테이크는 min(310k, 3\*100k) = 300k가 됩니다. 하나의 검증자 노드는 두 라운드에 최대 600k TON을 사용할 수 있습니다(이 예에서는 홀수 라운드에 절반, 짝수 라운드에 절반). 스테이크를 늘리려면 여러 검증자 노드를 설정해야 합니다.

    - 모든 **i** 참가자의 총 유효 스테이크를 계산합니다.

Once Elector identifies such an **i**, where the total effective stake is maximized, we declare these **i** participants as validators.

## Positive incentives

Similarly to all blockchain networks, each transaction on TON requires a computation fee called [gas](https://blog.ton.org/what-is-blockchain) to store the network and process the transaction on-chain. On TON, these fees are accumulated within the Elector contract in a reward pool.

The network also provides a subsidy for block creation by adding an amount of 1.7 TON to the reward pool for each MasterChain block and an amount equal to 1 TON for each BaseChain block (refer to Network Parameters `Config14:masterchain_block_fee` and `Config14:basechain_block_fee`). It is important to note that when a BaseChain is divided into multiple ShardChains, the subsidy for each ShardChain block is distributed accordingly. This approach helps maintain a consistent subsidy per unit of time.

:::info
2023년 6월, [디플레이션 소각 메커니즘](https://blog.ton.org/ton-holders-and-validators-vote-in-favor-of-implementing-the-toncoin-real-time-burn-mechanism)이 도입되었습니다. 이 메커니즘으로 네트워크가 생성한 TON의 일부가 보상 풀에 할당되는 대신 소각됩니다.
:::

After a validation cycle lasting 65536 seconds, or approximately 18 hours (as determined by the network parameter `Config15:validators_elected_for`), staked TON is not immediately released by each validator. Instead, it is held for an additional 32768 seconds, or about 9 hours (as specified by the network parameter `Config15:stake_held_for`). During this period, slashing penalties can be imposed on the validator as a consequence for any misbehavior. Once the funds are released, validators can withdraw their staked amount along with a share of the rewards accrued during the validation round, proportional to their voting **weight**.

2023년 4월 기준, 네트워크의 모든 검증자에 대한 합의 라운드당 총 보상 풀은 약 40,000 TON이며 검증자당 평균 보상은 약 120 TON입니다(투표 가중치와 발생한 보상의 최대 차이는 약 3 TON).

The total supply of Toncoin (5 billion TON) has an inflation rate of approximately 0.3-0.6% annually.

This inflation rate, however, is not always constant and may deviate depending on the network’s current state. Eventually, it will tend to deflate after the Deflation mechanism is activated and network utilization grows.

:::info
현재 TON 블록체인 통계는 [여기](https://tontech.io/stats/)에서 확인하세요.
:::

## Negative incentives

On TON Blockchain, there are generally two ways validators can be penalized for misbehaving: **idle** and **malicious** misbehaving. Both are prohibited and may result in fines (in a process called slashing) for their actions.

If a validator fails to participate in block creation and transaction signing for a significant period during a validation round, they may incur a fine based on the **Standard fine** parameter. As of April 2023, the Standard fine that can be accrued is 101 TON (Network Parameter `ConfigParam40:MisbehaviorPunishmentConfig`).

On the TON network, slashing penalties—also known as fines imposed on validators—allow any participant to file a complaint if they suspect a validator is misbehaving. When submitting a complaint, the participant must provide cryptographic evidence of the alleged misbehavior for submission to the Electors.

During the `stake_held_for` dispute resolution period, all validators on the network assess the validity of the complaints and vote on whether to pursue each complaint collectively. They also evaluate the legitimacy of the provided evidence and determine the appropriate penalties.

If, based on weighted votes, at least 66% of the validators approve the complaint, the slashing penalty is applied. This penalty is deducted from the offending validator's total stake. Typically, the process of penalization and resolution of complaints is managed automatically using MyTonCtrl.

## Decentralized system of penalties

:::info
The following system of penalizing poorly performing validators was fully operational on September 9, 2024.
:::

### Determination of poor work

The TON is supplied with the [lite-client](https://github.com/newton-blockchain/ton/tree/master/lite-client) utility. In lite-client, there is a `checkloadall` command.

This command analyses the number of blocks the validator should have processed and the number it actually processed in a given period of time.

If the validator processed less than 90% of the expected number of blocks during a validation round, it is considered to be performing poorly and should be penalized.

:::info
Learn more about the technical description of the process [here](https://github.com/ton-blockchain/TIPs/issues/13#issuecomment-786627474)
:::

### Complain workflow

- Anyone can make a complaint and get a reward for the right complaint.

- Validation of complaints maintained by Validators and fully decentralized.

#### Make complaint

After each validation round (~18 hours), the validator stakes of the validators who participated in that round remain on the Elector smart contract for another ~9 hours.

During this time, anyone can send a complaint against a validator who performed poorly in said round. This happens on-chain on the Elector smart contract.

#### Validation of complaint

After each validation round, validators receive a list of complaints from the Elector smart contract. They then double-check these complaints by calling `checkloadall`.

If a complaint is validated, a vote is conducted on-chain in favor of that complaint.

These actions are integrated into MyTonCtrl and occur automatically.

When a complaint receives 66% of the validators' votes (weighted by their stake), the validator's stake is penalized.

No one has the authority to impose a fine on their own.

The list of penalized validators for each round is available at [@tonstatus_notifications](https://t.me/tonstatus_notifications).

### Fine value

벌금 금액은 고정되어 있으며 101 TON(네트워크 매개변수 `ConfigParam40:MisbehaviourPunishmentConfig`)입니다. 이는 대략 라운드당 검증자 수입과 동일합니다.

The value of the fine may change due to the rapidly growing audience and the number of transactions in TON, and it is vital that the quality of work is at its best.

### Fine distribution

The fine is distributed among the validators minus network costs, and a small reward (~8 TON) is given to the first complainer who sends the correct complaint to the Elector.

### Validator guidelines

To prevent your Validator node from being fined, it is advisable to ensure that the hardware, monitoring, and validator operations are set up properly.

Please ensure you comply with the [validator maintain guidelines](/v3/guidelines/nodes/running-nodes/validator-node#maintain-guidelines).

If you don't want to do this please consider [using staking services](https://ton.org/stake).

## See also

- [Running a validator](/v3/guidelines/nodes/running-nodes/validator-node)
- [Transaction fees](/v3/documentation/smart-contracts/transaction-fees/fees)
- [블록체인이란? 스마트 컨트랙트란? 가스란?](https://blog.ton.org/what-is-blockchain)

<Feedback />

