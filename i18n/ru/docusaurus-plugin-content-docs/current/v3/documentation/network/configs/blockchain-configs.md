import Feedback from '@site/src/components/Feedback';

# Config parameters

:::info
You can view live values by using [Tonviewer](https://tonviewer.com/config).
:::

## Introduction

This page provides a description of the configuration parameters used in the TON Blockchain.

TON features a complex configuration consisting of many technical parameters, some of which are utilized by the blockchain itself, while others serve the ecosystem. However, only a limited number of individuals fully understand the significance of these parameters. This article aims to offer users a straightforward explanation of each parameter and its purpose.

## Prerequisites

This material should be read alongside the parameter list.

You can view the parameter values in the [current configuration](https://explorer.toncoin.org/config), and the method of writing them into [cells](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage) is outlined in the [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb) file in [TL-B](/v3/documentation/data-formats/tlb/tl-b-language) format.

:::info
The binary encoding found at the end of the TON Blockchain parameter represents a serialized binary format of its configuration. This allows for efficient storage and transmission of the configuration data. The specific details of the serialization process vary depending on the encoding scheme utilized by the TON Blockchain.
:::

All parameters are in place, and you won't get lost. For your convenience, please use the right sidebar for quick navigation.

## Param 0

Этот параметр — адрес специального смарт-контракта, в котором хранится конфигурация блокчейна. Конфигурация хранится в контракте для упрощения ее загрузки и изменения во время голосования валидаторов.

:::info
In the configuration parameter, only the hash portion of the address is recorded, as the contract always resides in the [MasterChain](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#masterchain-blockchain-of-blockchains) (WorkChain -1). Therefore, the full address of the contract will be written as `-1:<value of the configuration parameter>`.
:::

## Param 1

This parameter is the address of the [elector smart contract](/v3/documentation/smart-contracts/contracts-specs/governance#elector), responsible for appointing validators, distributing rewards, and voting on changes to blockchain parameters.

## Param 2

This parameter represents the address of the system, on behalf of which new Toncoins are minted and sent as rewards for validating the blockchain.

:::info
If the parameter 2 is missing, the parameter 0 is used instead (newly minted Toncoins come from the configuration smart contract).
:::

## Param 3

Этот параметр — адрес сборщика комиссий за транзакции.

:::info
If the this parameter is missing (for the time being), transaction fees are directed to the elector smart contract (parameter 1).
:::

## Param 4

Этот параметр — адрес корневого DNS-контракта сети TON.

:::info
More detailed information, please see the [TON DNS & Domains](/v3/guidelines/web3/ton-dns/dns) documentation and in a more detailed original description [here](https://github.com/ton-blockchain/TEPs/blob/master/text/0081-dns-standard.md).

This contract is not responsible for selling **.ton** domains.
:::

## Param 6

Этот параметр отвечает за комиссии за выпуск новых валют.

:::info
Currently, the minting of additional currency is not implemented and does not function. The implementation and launch of the minter are planned for the future.

You can learn more about the issues and prospects in the [relevant documentation](/v3/documentation/infra/minter-flow).
:::

## Param 7

This parameter stores the volume of each additional currency in circulation. The data is organized as a dictionary (also referred to as a **hashmap**, although this name may be a typo during the TON Blockchain's development). The structure uses the format `extracurrency_id -> amount`, where the amount is represented as a `VarUint 32`, which is an integer ranging from `0` to `2^248`.

## Param 8

Этот параметр указывает версию сети и дополнительные возможности, поддерживаемые валидаторами.

:::info
Validators are nodes in the TON Blockchain network that are responsible for creating new blocks and verifying transactions.
:::

- `version`: Это поле указывает версию.

- `capabilities`: Это поле представляет собой набор флагов, которые используются для указания наличия или отсутствия определенных функций или возможностей.

Thus, when updating the network, validators will vote to change parameter 8. This way, the TON Blockchain network can be updated without downtime.

## Param 9

Этот параметр содержит список (двоичное дерево) обязательных параметров. Он гарантирует, что определенные параметры конфигурации всегда присутствуют и не могут быть удалены предложением об изменении конфигурации, пока не изменится параметр 9.

## Param 10

This parameter represents a list (binary tree) of critical TON parameters whose change significantly affects the network, so more voting rounds are held.

## Param 11

Этот параметр указывает, при каких условиях принимаются предложения об изменении конфигурации TON.

- `min_tot_rounds`: The minimum number of rounds before a proposal can be applied

- `max_tot_rounds`: The maximum number of rounds, upon reaching which the proposal will automatically be rejected

- `min_wins`: The required number of wins (3/4 of validators by the sum of the pledge must vote in favor)

- `max_losses`: The maximum number of losses, upon reaching which the proposal will automatically be rejected

- `min_store_sec` и `max_store_sec` определяют возможный временной интервал, в течение которого предложение будет храниться

- `bit_price` и `cell_price` указывают цену хранения одного бита или одной ячейки предложения

## Param 12

This parameter represents the configuration of a WorkChain in the TON Blockchain. WorkChains are designed as independent blockchains that can operate in parallel, allowing TON to scale and process a large number of transactions and smart contracts.

### WorkChain configuration parameters

- `enabled_since`: A UNIX timestamp of the moment this WorkChain was enabled.

- `actual_min_split`: The minimum depth of the split (sharding) of this WorkChain, supported by validators.

- `min_split`: The minimum depth of the split of this WorkChain, set by the configuration.

- `max_split`: The maximum depth of the split of this WorkChain.

- `basic`: A boolean flag (1 for true, 0 for false) indicating whether this WorkChain is basic (handles TON coins, smart contracts based on the TON Virtual Machine).

- `active`: A boolean flag indicating whether this WorkChain is active at the moment.

- `accept_msgs`: A boolean flag indicating whether this WorkChain is accepting messages at the moment.

- `flags`: Additional flags for the WorkChain (reserved, currently always 0).

- `zerostate_root_hash` and `zerostate_file_hash`: Hashes of the first block of the WorkChain.

- `version`: Version of the WorkChain.

- `format`: The format of the WorkChain, which includes `vm_version` and `vm_mode` - the virtual machine used there.

## Param 13

This parameter defines the cost of filing complaints about incorrect operation of validators in the [elector smart contract](/v3/documentation/smart-contracts/contracts-specs/governance#elector).

## Param 14

This parameter indicates the reward for creating a block in the TON Blockchain. Nanograms represent nanoToncoins. Therefore, the reward for block creation in the MasterChain is 1.7 Toncoins, while in the basic WorkChain, it is 1.0 Toncoins. In the event of a WorkChain split, the block reward is also divided: if there are two ShardChains within the WorkChain, then the reward for each shard block will be 0.5 Toncoins.

## Param 15

Этот параметр содержит длительность различных этапов выборов и работы валидаторов в блокчейне TON.

For each validation period, there is an `election_id` equal to the UNIX-format time at the start of the validation.

You can get the current `election_id` (if elections are ongoing) or the past one by invoking the elector smart contract's respective get-methods `active_election_id` and `past_election_ids`.

### WorkChain configuration parameters

- `validators_elected_for`: The number of seconds the elected set of validators perform their role (one round).

- `elections_start_before`: The seconds before the end of the current round the election process for the next period will start.

- `elections_end_before`: The seconds before the end of the current round, the validators for the next round will be chosen.

- `stake_held_for`: The period for which a validator's stake is held (for handling complaints) after the round expires.

:::info
Каждое значение в аргументах определяется типом данных `uint32`.
:::

### Примеры

In the TON Blockchain, validation periods are typically divided into **even** and **odd** rounds that alternate. Voting for the next round occurs during the previous one, so a validator must allocate their funds into two separate pools to participate in both rounds.

#### Основная сеть

Текущие значения:

```python
constants = {
    'validators_elected_for': 65536,  # 18.2 hours
    'elections_start_before': 32768,  # 9.1 hours
    'elections_end_before': 8192,     # 2.2 hours
    'stake_held_for': 32768           # 9.1 hours
}
```

Scheme:

![image](/img/docs/blockchain-configs/config15-mainnet.png)

#### Как рассчитать периоды?

Пусть `election_id = validation_start = 1600032768`. Тогда:

```python
election_start = election_id - constants['elections_start_before'] = 1600032768 - 32768 = 1600000000
election_end = delay_start = election_id - constants['elections_end_before'] = 1600032768 - 8192 = 1600024576
hold_start = validation_end = election_id + constants['validators_elected_for'] = 1600032768 + 65536 = 1600098304
hold_end = hold_start + constants['stake_held_for'] = 1600098304 + 32768 = 1600131072
```

Therefore, at this time, the length of one round of one parity is `1600131072 - 1600000000 = 131072 seconds = 36.40888... hours`

#### Тестовая сеть

Текущие значения:

```python
constants = {
    'validators_elected_for': 7200,  # 2 hours
    'elections_start_before': 2400,  # 40 minutes
    'elections_end_before': 180,     # 3 minutes
    'stake_held_for': 900            # 15 minutes
}
```

Scheme:

![image](/img/docs/blockchain-configs/config15-testnet.png)

#### Как рассчитать периоды?

Пусть `election_id = validation_start = 160002400`. Тогда:

```python
election_start = election_id - constants['elections_start_before'] = 160002400 - 2400 = 1600000000
election_end = delay_start = election_id - constants['elections_end_before'] = 160002400 - 180 = 160002220
hold_start = validation_end = election_id + constants['validators_elected_for'] = 160002400 + 7200 = 160009600
hold_end = hold_start + constants['stake_held_for'] = 160009600 + 900 = 160010500
```

Therefore, at this time, the length of one round of one parity is `160010500 - 1600000000 = 10500 seconds = 175 minutes = 2.91666... hours`

## Param 16

This parameter represents the limits on the number of validators in the TON Blockchain. It is directly used by the elector smart contract.

### Configuration parameters for the number of validators for elections

- `max_validators`: этот параметр представляет собой максимальное количество валидаторов, которые могут участвовать в работе сети в любой момент времени.

- `max_main_validators`: этот параметр представляет собой максимальное количество валидаторов мастерчейна.

- `min_validators`: этот параметр представляет собой минимальное количество валидаторов, которые должны поддерживать работу сети.

#### Notes

- The maximum number of validators is greater than or equal to the maximum number of MasterChain validators.

- The maximum number of MasterChain validators must be greater than or equal to the minimum number of validators.

- Минимальное количество валидаторов должно быть не менее 1.

## Param 17

Этот параметр представляет конфигурацию параметров стейка в блокчейне TON. Во многих системах блокчейна, особенно тех, которые используют алгоритм консенсуса Proof-of-Stake или Delegated Proof-of-Stake, владельцы криптовалюты, встроенные в сеть, могут "стейкать" свои токены, чтобы стать валидаторами и получать вознаграждения.

### Configuration parameters

- `min_stake`: This parameter represents the minimum amount of Toncoins that an interested party needs to stake to participate in the validation process.

- `max_stake`: This parameter represents the maximum amount of Toncoins that an interested party can stake.

- `min_total_stake`: This parameter represents the minimum total amount of Toncoins that the chosen set of validators must hold.

- `max_stake_factor`: этот параметр является множителем, указывающим, во сколько раз максимально эффективный стейк (залог) может превышать минимальный стейк, отправленный любым другим валидатором.

:::info
Каждое значение в аргументах определяется типом данных `uint32`.
:::

## Param 18

Этот параметр представляет собой конфигурацию для определения цен на хранение данных в блокчейне TON. Это служит мерой предотвращения спама и поощряет обслуживание сети.

### Dictionary of storage fee parameters

- `utime_since`: этот параметр предоставляет начальную временную метку Unix, с которой применяются указанные цены.

- `bit_price_ps` and `cell_price_ps`: These parameters represent the storage prices for one bit or one cell of information in the main WorkChains of the TON Blockchain for 65536 seconds

- `mc_bit_price_ps` and `mc_cell_price_ps`: These parameters represent the prices for computational resources specifically in the TON MasterChain for 65536 seconds

:::info
`utime_since` accepts values in the `uint32` data type.

Остальные принимают значения в типе данных `uint64`.
:::

## Param 20 и 21

Эти параметры определяют стоимость вычислений в сети TON. Сложность любого вычисления оценивается в единицах газа.

- `flat_gas_limit` и `flat_gas_price`: Определенное начальное количество газа предоставляется по цене `flat_gas_price` (для компенсации затрат на запуск виртуальной машины TON).

- `gas_price`: Этот параметр отражает цену газа в сети в nanoton за 65536 единиц газа.

- `gas_limit`: Этот параметр представляет максимальное количество газа, которое может быть потреблено за одну транзакцию.

- `special_gas_limit`: Этот параметр представляет ограничение на количество газа, которое может быть потреблено за одну транзакцию специального (системного) контракта.

- `gas_credit`: This parameter represents a credit in gas units provided to transactions to check an external message.

- `block_gas_limit`: Этот параметр представляет максимальное количество газа, которое может быть использовано в пределах одного блока.

- `freeze_due_limit` and `delete_due_limit`: Limits of accumulated storage fees (in nanoToncoin) at which a contract is frozen and deleted, respectively.

:::info
You can find more about `gas_credit` and other parameters in the section of external messages [here](/v3/documentation/smart-contracts/transaction-fees/accept-message-effects#external-messages).
:::

## Param 22 и 23

Эти параметры устанавливают ограничения на блок, по достижении которых блок завершается, а обратный вызов оставшихся сообщений (если таковые имеются) переносится в следующий блок.

### Configuration parameters

- `bytes`: Этот раздел устанавливает ограничения на размер блока в байтах.

- `underload`: Недогрузка — это состояние, когда шард понимает, что нагрузки нет, и склоняется к слиянию, если соседний шард готов.

- `soft_limit`: Мягкий предел — при достижении этого предела внутренние сообщения перестают обрабатываться.

- `hard_limit`: Жесткий предел — это абсолютный максимальный размер.

- `gas`: This section sets the limits on the amount of gas that a block can consume. Gas, in the context of blockchain, is an indicator of computational work. The limits on underload, soft and hard limits, work the same as for size in bytes.

- `lt_delta`: This section sets the limits on the difference in logical time between the first and last transaction. Logical time is a concept used in the TON Blockchain for ordering events. The limits on underload, soft and hard limits, work the same as for size in bytes and gas.

:::info
If a shard has insufficient load and there is an intention to merge with a neighboring shard, the `soft_limit` indicates a threshold. When this threshold is exceeded, internal messages will stop being processed, while external messages will still be handled. External messages will continue to be processed until the total reaches a limit that is equal to half the sum of the `soft_limit` and `hard_limit`, or `(soft_limit + hard_limit) / 2`.
:::

## Param 24 и 25

Parameter 24 represents the configuration for the cost of sending messages in the MasterChain of the TON Blockchain.

Параметр 25 представляет собой конфигурацию стоимости отправки сообщений во всех остальных случаях.

### Configuration parameters defining the costs of forwarding

- `lump_price`: этот параметр означает базовую цену пересылки сообщения независимо от его размера или сложности.

- `bit_price`: этот параметр представляет стоимость за бит пересылки сообщения.

- `cell_price`: этот параметр отражает стоимость пересылки сообщения зя ячейку. Ячейка является базовой единицей хранения данных в блокчейне TON.

- `ihr_price_factor`: This is a factor used to calculate the cost of immediate hypercube routing (IHR).

:::info
IHR is a method of message delivery in the TON Blockchain network, where messages are sent directly to the recipient's ShardChain.
:::

- `first_frac`: этот параметр определяет долю оставшегося остатка, которая будет использоваться для первого перехода по маршруту сообщения.

- `next_frac`: этот параметр определяет долю оставшегося остатка, которая будет использоваться для последующих переходов по маршруту сообщения.

## Param 28

This parameter provides the configuration for the `Catchain` protocol in the TON Blockchain. `Catchain` is the lowest-level consensus protocol used in the TON to achieve agreement among validators.

### Configuration parameters

- `flags`: общее поле, которое можно использовать для установки различных двоичных параметров. В этом случае оно равно 0, что означает, что никакие конкретные флаги не установлены.

- `shuffle_mc_validators`: логическое значение, указывающее, следует ли перемешивать валидаторы мастерчейна или нет. Если этот параметр установлен в 1, валидаторы будут перемешиваться; в противном случае — нет.

- `mc_catchain_lifetime`: The lifetime of MasterChain's `Catchain` groups in seconds.

- `shard_catchain_lifetime`: The lifetime of ShardChain's `Catchain` groups in seconds.

- `shard_validators_lifetime`: The lifetime of a ShardChain's validators group in seconds.

- `shard_validators_num`: The number of validators in each ShardChain validation group.

## Param 29

This parameter provides the configuration for the consensus protocol above `Catchain` ([Param 28](#param-28)) in the TON Blockchain. The consensus protocol is a crucial component of a blockchain network, and it ensures that all nodes agree on the state of the distributed ledger.

### Configuration parameters

- `flags`: общее поле, которое можно использовать для установки различных двоичных параметров. В этом случае оно равно 0, что означает, что никакие конкретные флаги не установлены.

- `new_catchain_ids`: A Boolean value indicating whether to generate new `Catchain` identifiers. If this parameter is set to 1, new identifiers will be generated. In this case, it is assigned the value of 1, which means that new identifiers will be generated.

- `round_candidates`: Количество кандидатов, рассматриваемых в каждом раунде протокола консенсуса. Здесь он установлен на 3.

- `next_candidate_delay_ms`: Задержка в миллисекундах перед тем, как право на создание кандидата блока перейдет к следующему валидатору. Здесь он установлен на 2000 мс (2 секунды).

- `consensus_timeout_ms`: Время ожидания консенсуса блока в миллисекундах. Здесь он установлен на 16000 мс (16 секунд).

- `fast_attempts`: Количество "быстрых" попыток достижения консенсуса. Здесь он установлен на 3.

- `attempt_duration`: Длительность каждой попытки достижения соглашения. Здесь он установлен на 8.

- `catchain_max_deps`: Максимальное количество зависимостей блока Catchain. Здесь установлено значение 4.

- `max_block_bytes`: Максимальный размер блока в байтах. Здесь установлено значение 2097152 байта (2 МБ).

- `max_collated_bytes`: Максимальный размер сериализованных доказательств корректности блока в байтах. Здесь установлено значение 2097152 байта (2 МБ).

- `proto_version`: Версия протокола. Здесь установлено значение 2.

- `catchain_max_blocks_coeff`: The coefficient limiting the rate of block generation in `Catchain`, [description](https://github.com/ton-blockchain/ton/blob/master/doc/catchain-dos.md). Here, it is set to 10000.

## Param 31

This parameter represents the configuration of smart contract addresses from which no fees are charged for either gas or storage and where **tick-tok** transactions can be created. The list usually includes governance contracts. The parameter is presented as a binary tree structure — a tree (HashMap 256), where the keys are a 256-bit representation of the address. Only addresses in the MasterChain can be present in this list.

## Param 32, 34 и 36

Списки валидаторов из предыдущего (32), текущего (34) и следующего (36) раундов. Параметр 36 устанавливается с конца выборов до начала раунда.

### Configuration parameters

- `cur_validators`: это текущий список валидаторов. Валидаторы обычно отвечают за проверку транзакций в сети блокчейна.

- `utime_since` и `utime_until`: эти параметры предоставляют период времени, в течение которого эти валидаторы активны.

- `total` and `main`: These parameters provide the total number of validators and the number of validators validating the MasterChain in the network.

- `total_weight`: это суммирует веса валидаторов.

- `list`: A list of validators in the tree format `id->validator-data`: `validator_addr`, `public_key`, `weight`, `adnl_addr`: These parameters provide details about each validator - their 256 addresses in the MasterChain, public key, weight, ADNL address (the address used at the network level of the TON).

## Param 40

This parameter defines the structure of the configuration for punishment for improper behavior (non-validation). In the absence of the parameter, the default fine size is 101 Toncoins.

### Configuration parameters

`MisbehaviourPunishmentConfig`: This data structure defines how improper behavior in the system is punished.

Она содержит несколько полей:

- `default_flat_fine`: Эта часть штрафа не зависит от размера стейка.

- `default_proportional_fine`: Эта часть штрафа пропорциональна размеру стейка валидатора.

- `severity_flat_mult`: Это множитель, применяемый к значению `default_flat_fine` для существенных нарушений валидатором.

- `severity_proportional_mult`: Это множитель, применяемый к значению `default_proportional_fine` для существенных нарушений валидатором.

- `unpunishable_interval`: Этот параметр представляет собой период, в течение которого нарушители не штрафуют для устранения временных сетевых проблем или других аномалий.

- `long_interval`, `long_flat_mult`, `long_proportional_mult`: Эти параметры определяют "длинный" период времени и множители для фиксированных и пропорциональных штрафов за ненадлежащую работу.

- `medium_interval`, `medium_flat_mult`, `medium_proportional_mult`: Аналогично, они определяют "средний" период времени и множители для фиксированных и пропорциональных штрафов за ненадлежащую работу.

## Param 43

This parameter relates to the size limits and other features of accounts and messages.

### Configuration parameters

- `max_msg_bits`: Maximum message size in bits.

- `max_msg_cells`: Maximum number of cells (a form of storage unit) a message can occupy.

- `max_library_cells`: Maximum number of cells that can be used for library cells.

- `max_vm_data_depth`: Maximum cell depth in messages and account state.

- `max_ext_msg_size`: Maximum external message size in bits.

- `max_ext_msg_depth`: Maximum external message depth. This could refer to the depth of the data structure within the message.

- `max_acc_state_cells`: Maximum number of cells that an account state can occupy.

- `max_acc_state_bits`: Maximum account state size in bits.

Если отсутствует, то берутся параметры по умолчанию:

- `max_size` = 65535

- `max_depth` = 512

- `max_msg_bits` = 1 \<\< 21

- `max_msg_cells` = 1 \<\< 13

- `max_library_cells` = 1000

- `max_vm_data_depth` = 512

- `max_acc_state_cells` = 1 \<\< 16

- `max_acc_state_bits` = (1 \<\< 16) \* 1023

:::info
Вы можете просмотреть более подробную информацию о стандартных параметрах [здесь](https://github.com/ton-blockchain/ton/blob/fc9542f5e223140fcca833c189f77b1a5ae2e184/crypto/block/mc-config.h#L379) в исходном коде.
:::

## Param 44

Этот параметр определяет список приостановленных адресов, которые не могут быть инициализированы до `suspended_until`. Он применяется только к еще не инициированным аккаунтам. Это мера стабилизации токеномики (ограничение ранних майнеров). Если не задано - ограничений нет. Каждый адрес представлен как конечный узел в этом дереве, а древовидная структура позволяет эффективно проверять наличие или отсутствие адреса в списке.

:::info
The stabilization of the tokenomics is further described in the [official report](https://t.me/tonblockchain/178) of the **@tonblockchain** Telegram channel.
:::

## Param 45

The list of precompiled contracts is stored in the MasterChain config:

```
precompiled_smc#b0 gas_usage:uint64 = PrecompiledSmc;
precompiled_contracts_config#c0 list:(HashmapE 256 PrecompiledSmc) = PrecompiledContractsConfig;
_ PrecompiledContractsConfig = ConfigParam 45;
```

More details about precompiled contracts are on [this page](/v3/documentation/smart-contracts/contracts-specs/precompiled-contracts).

## Param 71 - 73

This parameter pertains to bridges for wrapping Toncoins in other networks:

- ETH-TON **(71)**

- BSC-TON **(72)**

- Polygon-TON **(73)**

### Configuration parameters

- `bridge_address`: This is the bridge contract address that accepts TON to issue wrapped Toncoins in other networks.

- `oracle_multisig_address`: Это адрес кошелька управления мостом. Кошелек с мультиподписью — это тип цифрового кошелька, который требует подписей от нескольких сторон для авторизации транзакции. Он часто используется для повышения безопасности. Оракулы выступают в качестве сторон.

- `oracles`: List of oracles in the form of a tree `id->address`

- `external_chain_address`: Это адрес контракта моста в соответствующем внешнем блокчейне.

## Param 79, 81 и 82

This parameter relates to bridges for wrapping tokens from other networks into tokens on the TON network:

- ETH-TON **(79)**

- BSC-TON **(81)**

- Polygon-TON **(82)**

### Configuration parameters

- `bridge_address` и `oracles_address`: Это адреса блокчейна моста и контракта управления мостом (мультиподпись оракула) соответственно.

- `oracles`: List of oracles in the form of a tree `id->address`

- `state_flags`: Флаг состояния. Этот параметр отвечает за включение/отключение отдельных функций моста.

- `prices`: этот параметр содержит список или словарь цен на различные операции или комиссии, связанные с мостом, например `bridge_burn_fee`, `bridge_mint_fee`, `wallet_min_tons_for_storage`, `wallet_gas_consumption`, `minter_min_tons_for_storage`, `discover_gas_consumption`.

- `external_chain_address`: адрес контракта моста в другом блокчейне.

## Negative parameters

:::info
The distinction between negative and positive parameters lies in the necessity for validators to verify them; negative parameters typically lack a specific assigned role.
:::

## Next steps

After thoroughly reviewing this article, it is highly recommended that you dedicate time for a more in-depth study of the following documents:

- The original descriptions are present, but they may be limited, in the documents:
    - [The Open Network Whitepaper](https://ton.org/whitepaper.pdf)
    - [Telegram Open Network Blockchain](/tblkch.pdf)

- Source code:
    - [mc-config.h](https://github.com/ton-blockchain/ton/blob/fc9542f5e223140fcca833c189f77b1a5ae2e184/crypto/block/mc-config.h)
    - [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb)
    - [BlockMasterConfig Type](https://docs.evercloud.dev/reference/graphql-api/field_descriptions#blockmasterconfig-type)

## See also

On these pages, you can find active network configurations of the TON Blockchain:

- [Mainnet configuration](https://ton.org/global-config.json)
- [Testnet configuration](https://ton.org/testnet-global.config.json)
- [Russian version](https://github.com/delovoyhomie/description-config-for-TON-Blockchain/blob/main/Russian-version.md)

<Feedback />

