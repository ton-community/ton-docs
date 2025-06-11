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

Формула с конфигурационными параметрами:

`max_factor` = [`max_stake_factor`](https://tonviewer.com/config#17) / [`validators_elected_for`](https://tonviewer.com/config#15)

### Selection algorithm review

Этот алгоритм, запущенный [смарт-контрактом Elector](/v3/documentation/smart-contracts/contracts-specs/governance#elector), выбирает лучших кандидатов-валидаторов на основе их стейка. Вот как это работает:

1. **Initial selection**: Elector considers all candidates who have staked more than a set minimum amount (300K, as specified in the [configuration](https://tonviewer.com/config#17)).

2. **Ordering candidates**: These candidates are then arranged from highest to lowest based on their stake.

3. **Narrowing down**:

- Если количество кандидатов превышает максимально допустимое количество валидаторов ([см. конфигурацию](https://tonviewer.com/config#16)), то исключаются кандидаты с самым низким стейком.

- Затем Elector оценивает каждую потенциальную группу кандидатов, начиная с самой большой группы и переходя к меньшим:

    - Он проверяет лучших кандидатов в упорядоченном списке, увеличивая число на единицу.

    - For each candidate, Elector calculates their **effective stake**. If a candidate's stake is significantly higher than the minimum, it's adjusted down (e.g., if someone staked 310k and the minimum is 100k, but there's a rule capping at three times the minimum, their effective stake is considered as 300k).

    - Он суммирует эффективные стейки всех кандидатов в этой группе.

4. **Final selection**: The elector chooses the group of candidates with the highest total effective stake as the validators.

#### Validator selection algorithm

На основе доступных стейков потенциальных валидаторов определяются оптимальные значения минимального и максимального стейка с целью максимизации величины общего стейка:

1. Elector выбирает всех кандидатов, у которых сумма стейка превышает минимальную ([300 тысяч в конфигурации](https://tonviewer.com/config#17)).

2. Elector sorts them in _descending_ order of stake.

3. Если участников больше, чем [максимальное число](https://tonviewer.com/config#16) валидаторов, Elector удаляет последнюю часть списка. Затем Elector делает следующее:

    - Для каждого цикла **i** от _1 до N_ (оставшееся число участников) он берет первые **i** заявок из отсортированного списка.

    - Он вычисляет эффективный стейк, учитывая `max_factor`. То есть, если человек вложил 310 тыс., но с `max_factor` 3, а минимальный стейк в списке составляет 100 тыс. Toncoin, то эффективный стейк будет минимум (310 тыс., 3\*100 тыс.) Один узел валидатора может использовать до 600 тыс. TON (в этом примере) в двух раундах (половина в нечетных раундах, половина в четных раундах). Чтобы увеличить стейк, необходимо настроить несколько узлов валидатора.

    - Он вычисляет общий эффективнуый стейк всех **i** участников.

Once Elector identifies such an **i**, where the total effective stake is maximized, we declare these **i** participants as validators.

## Positive incentives

Similarly to all blockchain networks, each transaction on TON requires a computation fee called [gas](https://blog.ton.org/what-is-blockchain) to store the network and process the transaction on-chain. On TON, these fees are accumulated within the Elector contract in a reward pool.

The network also provides a subsidy for block creation by adding an amount of 1.7 TON to the reward pool for each MasterChain block and an amount equal to 1 TON for each BaseChain block (refer to Network Parameters `Config14:masterchain_block_fee` and `Config14:basechain_block_fee`). It is important to note that when a BaseChain is divided into multiple ShardChains, the subsidy for each ShardChain block is distributed accordingly. This approach helps maintain a consistent subsidy per unit of time.

:::info
В июне 2023 года был представлен [механизм дефляционного сжигания](https://blog.ton.org/ton-holders-and-validators-vote-in-favor-of-implementing-the-toncoin-real-time-burn-mechanism). С помощью этого механизма часть TON, сгенерированного сетью, сжигается вместо того, чтобы быть выделенной в пул вознаграждений.
:::

After a validation cycle lasting 65536 seconds, or approximately 18 hours (as determined by the network parameter `Config15:validators_elected_for`), staked TON is not immediately released by each validator. Instead, it is held for an additional 32768 seconds, or about 9 hours (as specified by the network parameter `Config15:stake_held_for`). During this period, slashing penalties can be imposed on the validator as a consequence for any misbehavior. Once the funds are released, validators can withdraw their staked amount along with a share of the rewards accrued during the validation round, proportional to their voting **weight**.

По состоянию на апрель 2023 года общий пул вознаграждений за раунд консенсуса для всех валидаторов в сети составляет приблизительно 40 000 TON, при этом среднее вознаграждение на валидатора составляет ~ 120 TON (максимальная разница между весом голоса и накопленными вознаграждениями составляет ~ 3 TON).

The total supply of Toncoin (5 billion TON) has an inflation rate of approximately 0.3-0.6% annually.

This inflation rate, however, is not always constant and may deviate depending on the network’s current state. Eventually, it will tend to deflate after the Deflation mechanism is activated and network utilization grows.

:::info
Узнайте текущую статистику блокчейна TON [здесь](https://tontech.io/stats/).
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

Размер штрафа фиксирован и равен 101 TON (сетевой параметр `ConfigParam40:MisbehaviourPunishmentConfig`), что примерно равно доходу валидатора за раунд.

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
- [Что такое блокчейн? Что такое смарт-контракт? Что такое газ?](https://blog.ton.org/what-is-blockchain)

<Feedback />

