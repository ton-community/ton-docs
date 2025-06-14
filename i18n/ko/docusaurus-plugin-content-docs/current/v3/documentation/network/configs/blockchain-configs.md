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

이 매개변수는 블록체인의 설정을 저장하는 특별한 스마트 컨트랙트의 주소입니다. 설정은 검증자 투표 중 로딩과 수정을 단순화하기 위해 컨트랙트에 저장됩니다.

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

이 매개변수는 트랜잭션 수수료 수집기의 주소입니다.

:::info
If the this parameter is missing (for the time being), transaction fees are directed to the elector smart contract (parameter 1).
:::

## Param 4

이 매개변수는 TON 네트워크의 루트 DNS 컨트랙트의 주소입니다.

:::info
More detailed information, please see the [TON DNS & Domains](/v3/guidelines/web3/ton-dns/dns) documentation and in a more detailed original description [here](https://github.com/ton-blockchain/TEPs/blob/master/text/0081-dns-standard.md).

This contract is not responsible for selling **.ton** domains.
:::

## Param 6

이 매개변수는 새로운 화폐 발행 수수료를 담당합니다.

:::info
Currently, the minting of additional currency is not implemented and does not function. The implementation and launch of the minter are planned for the future.

You can learn more about the issues and prospects in the [relevant documentation](/v3/documentation/infra/minter-flow).
:::

## Param 7

This parameter stores the volume of each additional currency in circulation. The data is organized as a dictionary (also referred to as a **hashmap**, although this name may be a typo during the TON Blockchain's development). The structure uses the format `extracurrency_id -> amount`, where the amount is represented as a `VarUint 32`, which is an integer ranging from `0` to `2^248`.

## Param 8

이 매개변수는 네트워크 버전과 검증자가 지원하는 추가 기능을 나타냅니다.

:::info
Validators are nodes in the TON Blockchain network that are responsible for creating new blocks and verifying transactions.
:::

- `version`: 이 필드는 버전을 지정합니다.

- `capabilities`: 이 필드는 특정 기능이나 성능의 존재 또는 부재를 나타내는 데 사용되는 플래그 세트입니다.

Thus, when updating the network, validators will vote to change parameter 8. This way, the TON Blockchain network can be updated without downtime.

## Param 9

이 매개변수는 필수 매개변수 목록(이진 트리)을 포함합니다. 매개변수 9가 변경될 때까지 설정 변경 제안으로 제거할 수 없는 특정 설정 매개변수가 항상 존재하도록 보장합니다.

## Param 10

This parameter represents a list (binary tree) of critical TON parameters whose change significantly affects the network, so more voting rounds are held.

## Param 11

이 매개변수는 TON 설정 변경 제안이 어떤 조건에서 수락되는지를 나타냅니다.

- `min_tot_rounds`: The minimum number of rounds before a proposal can be applied

- `max_tot_rounds`: The maximum number of rounds, upon reaching which the proposal will automatically be rejected

- `min_wins`: The required number of wins (3/4 of validators by the sum of the pledge must vote in favor)

- `max_losses`: The maximum number of losses, upon reaching which the proposal will automatically be rejected

- `min_store_sec`와 `max_store_sec`는 제안이 저장될 수 있는 가능한 시간 간격을 결정

- `bit_price`와 `cell_price`는 제안의 1비트나 1셀을 저장하는 비용을 나타냄

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

이 매개변수는 TON 블록체인에서 선거와 검증자 작업의 다른 단계의 기간을 포함합니다.

For each validation period, there is an `election_id` equal to the UNIX-format time at the start of the validation.

You can get the current `election_id` (if elections are ongoing) or the past one by invoking the elector smart contract's respective get-methods `active_election_id` and `past_election_ids`.

### WorkChain configuration parameters

- `validators_elected_for`: The number of seconds the elected set of validators perform their role (one round).

- `elections_start_before`: The seconds before the end of the current round the election process for the next period will start.

- `elections_end_before`: The seconds before the end of the current round, the validators for the next round will be chosen.

- `stake_held_for`: The period for which a validator's stake is held (for handling complaints) after the round expires.

:::info
인수의 각 값은 `uint32` 데이터 유형으로 결정됩니다.
:::

### Examples

In the TON Blockchain, validation periods are typically divided into **even** and **odd** rounds that alternate. Voting for the next round occurs during the previous one, so a validator must allocate their funds into two separate pools to participate in both rounds.

#### 메인넷

현재 값:

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

#### 기간은 어떻게 계산하나요?

`election_id = validation_start = 1600032768`이라고 가정해 보겠습니다. 그러면:

```python
election_start = election_id - constants['elections_start_before'] = 1600032768 - 32768 = 1600000000
election_end = delay_start = election_id - constants['elections_end_before'] = 1600032768 - 8192 = 1600024576
hold_start = validation_end = election_id + constants['validators_elected_for'] = 1600032768 + 65536 = 1600098304
hold_end = hold_start + constants['stake_held_for'] = 1600098304 + 32768 = 1600131072
```

Therefore, at this time, the length of one round of one parity is `1600131072 - 1600000000 = 131072 seconds = 36.40888... hours`

#### 테스트넷

현재 값:

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

#### 기간은 어떻게 계산하나요?

`election_id = validation_start = 160002400`이라고 가정해 보겠습니다. 그러면:

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

- `max_validators`: 네트워크 운영에 참여할 수 있는 최대 검증자 수를 나타냅니다.

- `max_main_validators`: 마스터체인 검증자의 최대 수를 나타냅니다.

- `min_validators`: 네트워크 운영을 지원해야 하는 최소 검증자 수를 나타냅니다.

#### Notes

- The maximum number of validators is greater than or equal to the maximum number of MasterChain validators.

- The maximum number of MasterChain validators must be greater than or equal to the minimum number of validators.

- 최소 검증자 수는 1 이상이어야 합니다.

## Param 17

이 매개변수는 TON 블록체인의 스테이크 매개변수 설정을 나타냅니다. 지분증명이나 위임된 지분증명 합의 알고리즘을 사용하는 많은 블록체인 시스템에서, 네트워크 고유의 암호화폐 소유자는 검증자가 되어 보상을 얻기 위해 토큰을 "스테이크"할 수 있습니다.

### Configuration parameters

- `min_stake`: This parameter represents the minimum amount of Toncoins that an interested party needs to stake to participate in the validation process.

- `max_stake`: This parameter represents the maximum amount of Toncoins that an interested party can stake.

- `min_total_stake`: This parameter represents the minimum total amount of Toncoins that the chosen set of validators must hold.

- `max_stake_factor`: 최대 유효 스테이크(담보)가 다른 검증자가 보낸 최소 스테이크를 초과할 수 있는 배수를 나타내는 승수입니다.

:::info
인수의 각 값은 `uint32` 데이터 유형으로 결정됩니다.
:::

## Param 18

이 매개변수는 TON 블록체인의 데이터 저장 비용을 결정하는 설정을 나타냅니다. 이는 스팸을 방지하고 네트워크 유지를 장려하는 수단으로 작용합니다.

### Dictionary of storage fee parameters

- `utime_since`: 지정된 가격이 적용되는 초기 Unix 타임스탬프를 제공합니다.

- `bit_price_ps` and `cell_price_ps`: These parameters represent the storage prices for one bit or one cell of information in the main WorkChains of the TON Blockchain for 65536 seconds

- `mc_bit_price_ps` and `mc_cell_price_ps`: These parameters represent the prices for computational resources specifically in the TON MasterChain for 65536 seconds

:::info
`utime_since` accepts values in the `uint32` data type.

나머지는 `uint64` 데이터 타입으로 값을 받습니다.
:::

## Param 20과 21

이 매개변수들은 TON 네트워크에서 연산 비용을 정의합니다. 모든 연산의 복잡성은 가스 단위로 추정됩니다.

- `flat_gas_limit`와 `flat_gas_price`: `flat_gas_price` 가격으로 제공되는 특정 시작 가스량(TON 가상 머신 실행 비용을 상쇄하기 위함)

- `gas_price`: 이 매개변수는 네트워크의 가스 가격을 반영하며, 65536 가스 단위당 나노톤 단위입니다.

- `gas_limit`: 트랜잭션당 소비할 수 있는 최대 가스량을 나타냅니다.

- `special_gas_limit`: 특별한(시스템) 컨트랙트의 트랜잭션당 소비할 수 있는 가스량 제한을 나타냅니다.

- `gas_credit`: This parameter represents a credit in gas units provided to transactions to check an external message.

- `block_gas_limit`: 단일 블록 내에서 소비할 수 있는 최대 가스량을 나타냅니다.

- `freeze_due_limit` and `delete_due_limit`: Limits of accumulated storage fees (in nanoToncoin) at which a contract is frozen and deleted, respectively.

:::info
You can find more about `gas_credit` and other parameters in the section of external messages [here](/v3/documentation/smart-contracts/transaction-fees/accept-message-effects#external-messages).
:::

## Param 22와 23

이 매개변수들은 블록에 대한 제한을 설정하며, 이 제한에 도달하면 블록이 종료되고 남은 메시지의 콜백(있는 경우)이 다음 블록으로 이월됩니다.

### Configuration parameters

- `bytes`: 바이트 단위로 블록 크기의 제한을 설정합니다.

- `underload`: 언더로드는 샤드가 부하가 없음을 인식하고 이웃 샤드가 기꺼이 받아들일 경우 병합하려는 상태입니다.

- `soft_limit`: 소프트 제한 - 이 제한에 도달하면 내부 메시지 처리가 중단됩니다.

- `hard_limit`: 하드 제한 - 이것은 절대적인 최대 크기입니다.

- `gas`: This section sets the limits on the amount of gas that a block can consume. Gas, in the context of blockchain, is an indicator of computational work. The limits on underload, soft and hard limits, work the same as for size in bytes.

- `lt_delta`: This section sets the limits on the difference in logical time between the first and last transaction. Logical time is a concept used in the TON Blockchain for ordering events. The limits on underload, soft and hard limits, work the same as for size in bytes and gas.

:::info
If a shard has insufficient load and there is an intention to merge with a neighboring shard, the `soft_limit` indicates a threshold. When this threshold is exceeded, internal messages will stop being processed, while external messages will still be handled. External messages will continue to be processed until the total reaches a limit that is equal to half the sum of the `soft_limit` and `hard_limit`, or `(soft_limit + hard_limit) / 2`.
:::

## Param 24와 25

Parameter 24 represents the configuration for the cost of sending messages in the MasterChain of the TON Blockchain.

매개변수 25는 다른 모든 경우의 메시지 전송 비용에 대한 설정을 나타냅니다.

### Configuration parameters defining the costs of forwarding

- `lump_price`: 메시지 크기나 복잡성에 관계없이 메시지를 전달하는 기본 가격을 의미합니다.

- `bit_price`: 메시지 전달의 비트당 비용을 나타냅니다.

- `cell_price`: 셀당 메시지 전달 비용을 반영합니다. 셀은 TON 블록체인의 기본 데이터 저장 단위입니다.

- `ihr_price_factor`: This is a factor used to calculate the cost of immediate hypercube routing (IHR).

:::info
IHR is a method of message delivery in the TON Blockchain network, where messages are sent directly to the recipient's ShardChain.
:::

- `first_frac`: 메시지 경로를 따라 첫 번째 전환에 사용될 남은 잔액의 분율을 정의합니다.

- `next_frac`: 메시지 경로를 따라 후속 전환에 사용될 남은 잔액의 분율을 정의합니다.

## Param 28

This parameter provides the configuration for the `Catchain` protocol in the TON Blockchain. `Catchain` is the lowest-level consensus protocol used in the TON to achieve agreement among validators.

### Configuration parameters

- `flags`: 다양한 이진 매개변수를 설정하는 데 사용할 수 있는 일반 필드. 이 경우 0과 같으며, 특정 플래그가 설정되지 않았음을 의미합니다.

- `shuffle_mc_validators`: 마스터체인 검증자를 섞을지 여부를 나타내는 부울 값. 이 매개변수가 1로 설정되면 검증자가 섞입니다.

- `mc_catchain_lifetime`: The lifetime of MasterChain's `Catchain` groups in seconds.

- `shard_catchain_lifetime`: The lifetime of ShardChain's `Catchain` groups in seconds.

- `shard_validators_lifetime`: The lifetime of a ShardChain's validators group in seconds.

- `shard_validators_num`: The number of validators in each ShardChain validation group.

## Param 29

This parameter provides the configuration for the consensus protocol above `Catchain` ([Param 28](#param-28)) in the TON Blockchain. The consensus protocol is a crucial component of a blockchain network, and it ensures that all nodes agree on the state of the distributed ledger.

### Configuration parameters

- `flags`: 다양한 이진 매개변수를 설정하는 데 사용할 수 있는 일반 필드. 이 경우 0과 같으며, 특정 플래그가 설정되지 않았음을 의미합니다.

- `new_catchain_ids`: A Boolean value indicating whether to generate new `Catchain` identifiers. If this parameter is set to 1, new identifiers will be generated. In this case, it is assigned the value of 1, which means that new identifiers will be generated.

- `round_candidates`: 합의 프로토콜의 각 라운드에서 고려될 후보자 수. 여기서는 3으로 설정됩니다.

- `next_candidate_delay_ms`: 블록 후보 생성 권한이 다음 검증자에게 넘어가기 전의 지연 시간(밀리초). 여기서는 2000ms(2초)로 설정됩니다.

- `consensus_timeout_ms`: 블록 합의에 대한 타임아웃(밀리초). 여기서는 16000ms(16초)로 설정됩니다.

- `fast_attempts`: 합의에 도달하기 위한 "빠른" 시도 횟수. 여기서는 3으로 설정됩니다.

- `attempt_duration`: 각 합의 시도의 지속 시간. 여기서는 8로 설정됩니다.

- `catchain_max_deps`: Catchain 블록의 최대 의존성 수. 여기서는 4로 설정됩니다.

- `max_block_bytes`: 블록의 최대 크기(바이트). 여기서는 2097152바이트(2MB)로 설정됩니다.

- `max_collated_bytes`: 직렬화된 블록 정확성 증명의 최대 크기(바이트). 여기서는 2097152바이트(2MB)로 설정됩니다.

- `proto_version`: 프로토콜 버전. 여기서는 2로 설정됩니다.

- `catchain_max_blocks_coeff`: The coefficient limiting the rate of block generation in `Catchain`, [description](https://github.com/ton-blockchain/ton/blob/master/doc/catchain-dos.md). Here, it is set to 10000.

## Param 31

This parameter represents the configuration of smart contract addresses from which no fees are charged for either gas or storage and where **tick-tok** transactions can be created. The list usually includes governance contracts. The parameter is presented as a binary tree structure — a tree (HashMap 256), where the keys are a 256-bit representation of the address. Only addresses in the MasterChain can be present in this list.

## Param 32, 34 및 36

이전(32), 현재(34) 및 다음(36) 라운드의 검증자 목록입니다. 매개변수 36은 선거 끝부터 라운드 시작까지 설정됩니다.

### Configuration parameters

- `cur_validators`: 현재 검증자 목록입니다. 검증자는 일반적으로 블록체인 네트워크에서 트랜잭션을 검증하는 책임이 있습니다.

- `utime_since`와 `utime_until`: 이 검증자들이 활성화되는 기간을 제공합니다.

- `total` and `main`: These parameters provide the total number of validators and the number of validators validating the MasterChain in the network.

- `total_weight`: 검증자의 가중치를 합산합니다.

- `list`: A list of validators in the tree format `id->validator-data`: `validator_addr`, `public_key`, `weight`, `adnl_addr`: These parameters provide details about each validator - their 256 addresses in the MasterChain, public key, weight, ADNL address (the address used at the network level of the TON).

## Param 40

This parameter defines the structure of the configuration for punishment for improper behavior (non-validation). In the absence of the parameter, the default fine size is 101 Toncoins.

### Configuration parameters

`MisbehaviourPunishmentConfig`: This data structure defines how improper behavior in the system is punished.

다음 필드를 포함합니다:

- `default_flat_fine`: 스테이크 크기와 무관한 벌금 부분입니다.

- `default_proportional_fine`: 검증자의 스테이크 크기에 비례하는 벌금 부분입니다.

- `severity_flat_mult`: 검증자의 심각한 위반에 대해 `default_flat_fine` 값에 적용되는 승수입니다.

- `severity_proportional_mult`: 검증자의 심각한 위반에 대해 `default_proportional_fine` 값에 적용되는 승수입니다.

- `unpunishable_interval`: 임시 네트워크 문제나 다른 이상을 제거하기 위해 위반자가 처벌받지 않는 기간을 나타냅니다.

- `long_interval`, `long_flat_mult`, `long_proportional_mult`: "긴" 기간과 부적절한 행동에 대한 정액 및 비례 벌금의 승수를 정의합니다.

- `medium_interval`, `medium_flat_mult`, `medium_proportional_mult`: 유사하게 "중간" 기간과 부적절한 행동에 대한 정액 및 비례 벌금의 승수를 정의합니다.

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

없는 경우 기본 매개변수가 사용됩니다:

- `max_size` = 65535

- `max_depth` = 512

- `max_msg_bits` = 1 << 21

- `max_msg_cells` = 1 << 13

- `max_library_cells` = 1000

- `max_vm_data_depth` = 512

- `max_acc_state_cells` = 1 << 16

- `max_acc_state_bits` = (1 << 16) \* 1023

:::info
소스 코드에서 [여기](https://github.com/ton-blockchain/ton/blob/fc9542f5e223140fcca833c189f77b1a5ae2e184/crypto/block/mc-config.h#L379)에서 표준 매개변수에 대해 자세히 볼 수 있습니다.
:::

## Param 44

이 매개변수는 `suspended_until`까지 초기화할 수 없는 일시 중단된 주소 목록을 정의합니다. 아직 초기화되지 않은 계정에만 적용됩니다. 이는 토큰노믹스를 안정화하기 위한 조치입니다(초기 마이너 제한). 설정되지 않은 경우 - 제한이 없습니다. 각 주소는 이 트리의 끝 노드로 표현되며, 트리와 같은 구조를 통해 주소의 존재 여부를 효과적으로 확인할 수 있습니다.

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

- `oracle_multisig_address`: 브릿지 관리 지갑 주소입니다. 멀티시그 지갑은 트랜잭션 승인을 위해 여러 당사자의 서명이 필요한 디지털 지갑 유형입니다. 보안을 강화하기 위해 자주 사용됩니다. 오라클이 당사자 역할을 합니다.

- `oracles`: List of oracles in the form of a tree `id->address`

- `external_chain_address`: 해당 외부 블록체인의 브릿지 컨트랙트 주소입니다.

## Param 79, 81 및 82

This parameter relates to bridges for wrapping tokens from other networks into tokens on the TON network:

- ETH-TON **(79)**

- BSC-TON **(81)**

- Polygon-TON **(82)**

### Configuration parameters

- `bridge_address`와 `oracles_address`: 브릿지와 브릿지 관리 컨트랙트(오라클 멀티시그)의 블록체인 주소입니다.

- `oracles`: List of oracles in the form of a tree `id->address`

- `state_flags`: 상태 플래그. 이 매개변수는 개별 브릿지 기능의 활성화/비활성화를 담당합니다.

- `prices`: 이 매개변수는 `bridge_burn_fee`, `bridge_mint_fee`, `wallet_min_tons_for_storage`, `wallet_gas_consumption`, `minter_min_tons_for_storage`, `discover_gas_consumption` 같은 브릿지와 관련된 다양한 작업이나 수수료에 대한 가격 목록이나 딕셔너리를 포함합니다.

- `external_chain_address`: 다른 블록체인의 브릿지 컨트랙트 주소입니다.

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

