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

This parameter is the address of a special smart contract that stores the blockchain's configuration. The configuration is stored in the contract to simplify its loading and modification during validator voting.

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

このパラメータは取引手数料収集者のアドレスです。

:::info
If the this parameter is missing (for the time being), transaction fees are directed to the elector smart contract (parameter 1).
:::

## Param 4

このパラメータはTONネットワークのルートDNSコントラクトのアドレスです。

:::info
More detailed information, please see the [TON DNS & Domains](/v3/guidelines/web3/ton-dns/dns) documentation and in a more detailed original description [here](https://github.com/ton-blockchain/TEPs/blob/master/text/0081-dns-standard.md).

This contract is not responsible for selling **.ton** domains.
:::

## Param 6

このパラメータは、新しい通貨の手数料を発行する責任があります。

:::info
Currently, the minting of additional currency is not implemented and does not function. The implementation and launch of the minter are planned for the future.

You can learn more about the issues and prospects in the [relevant documentation](/v3/documentation/infra/minter-flow).
:::

## Param 7

This parameter stores the volume of each additional currency in circulation. The data is organized as a dictionary (also referred to as a **hashmap**, although this name may be a typo during the TON Blockchain's development). The structure uses the format `extracurrency_id -> amount`, where the amount is represented as a `VarUint 32`, which is an integer ranging from `0` to `2^248`.

## Param 8

このパラメータは、ネットワークのバージョンとバリデータがサポートする追加機能を示します。

:::info
Validators are nodes in the TON Blockchain network that are responsible for creating new blocks and verifying transactions.
:::

- `version` : このフィールドはバージョンを指定します。

- `capabilities`: このフィールドは、特定の機能や機能の有無を示すために使用されるフラグのセットです。

Thus, when updating the network, validators will vote to change parameter 8. This way, the TON Blockchain network can be updated without downtime.

## Param 9

このパラメータには必須パラメータのリスト(バイナリツリー)が含まれます。 これにより、特定の構成パラメータが常に存在し、パラメータ9が変更されるまで構成を変更する提案によって削除できなくなります。 It ensures that certain configuration parameters are always present and cannot be removed by a proposal to change the configuration until parameter 9 changes.

## Param 10

This parameter represents a list (binary tree) of critical TON parameters whose change significantly affects the network, so more voting rounds are held.

## Param 11

このパラメータは、TON設定を変更するための提案を受け入れる条件の下で示します。

- `min_tot_rounds`: The minimum number of rounds before a proposal can be applied

- `max_tot_rounds`: The maximum number of rounds, upon reaching which the proposal will automatically be rejected

- `min_wins`: The required number of wins (3/4 of validators by the sum of the pledge must vote in favor)

- `max_losses`: The maximum number of losses, upon reaching which the proposal will automatically be rejected

- `min_store_sec` と `max_store_sec` は、提案が保存される間隔を指定します。

- `bit_price` と `cell_price` は、提案の1ビットまたは1つのセルを格納する価格を示します

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

このパラメータには、TON Blockchainにおける異なる選挙とバリデータの作業の期間が含まれます。

For each validation period, there is an `election_id` equal to the UNIX-format time at the start of the validation.

You can get the current `election_id` (if elections are ongoing) or the past one by invoking the elector smart contract's respective get-methods `active_election_id` and `past_election_ids`.

### WorkChain configuration parameters

- `validators_elected_for`: The number of seconds the elected set of validators perform their role (one round).

- `elections_start_before`: The seconds before the end of the current round the election process for the next period will start.

- `elections_end_before`: The seconds before the end of the current round, the validators for the next round will be chosen.

- `stake_held_for`: The period for which a validator's stake is held (for handling complaints) after the round expires.

:::info
引数の各値は `uint32` データ型によって決定されます。
:::

### 例

In the TON Blockchain, validation periods are typically divided into **even** and **odd** rounds that alternate. Voting for the next round occurs during the previous one, so a validator must allocate their funds into two separate pools to participate in both rounds.

#### メインネット

現在の値:

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

#### 期間を計算するには?

let `election_id = validation_start = 1600032768` then: Then:

```python
election_start = election_id - constants['elections_start_before'] = 1600032768 - 32768 = 1600000000
election_end = delay_start = election_id - constants['elections_end_before'] = 1600032768 - 8192 = 1600024576
hold_start = validation_end = election_id + constants['validators_elected_for'] = 1600032768 + 65536 = 1600098304
hold_end = hold_start + constants['stake_held_for'] = 1600098304 + 32768 = 1600131072
```

Therefore, at this time, the length of one round of one parity is `1600131072 - 1600000000 = 131072 seconds = 36.40888... hours`

#### Testnet

現在の値:

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

#### 期間を計算するには?

let `election_id = validation_start = 160002400` then: Then:

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

- `max_validators`: このパラメータは、任意の時点でネットワーク操作に参加できるバリデータの最大数を表します。

- `max_main_validators`: このパラメータは、masterchainバリデータの最大数を表します。

- `min_validators`: このパラメータは、ネットワーク操作をサポートする必要があるバリデータの最小数を表します。

#### Notes

- The maximum number of validators is greater than or equal to the maximum number of MasterChain validators.

- The maximum number of MasterChain validators must be greater than or equal to the minimum number of validators.

- バリデータの最小数は 1 以上でなければなりません。

## Param 17

This parameter provides the configuration for the `Catchain` protocol in the TON Blockchain. `Catchain` is the lowest-level consensus protocol used in the TON to achieve agreement among validators.

### Configuration parameters

- `min_stake`: This parameter represents the minimum amount of Toncoins that an interested party needs to stake to participate in the validation process.

- `max_stake`: This parameter represents the maximum amount of Toncoins that an interested party can stake.

- `min_total_stake`: This parameter represents the minimum total amount of Toncoins that the chosen set of validators must hold.

- `max_stake_factor`: このパラメータは、最大実効ステーク数(プレッジ)が他のバリデータによって送られる最小ステーク数を超えることができるかを示す乗数です。

:::info
引数の各値は `uint32` データ型によって決定されます。
:::

## Param 18

このパラメータは、TONブロックチェーン上のデータストレージの価格を決定するための構成を表します。 これはスパムを防ぎ、ネットワークメンテナンスを促進するための手段となります。 This serves as a measure to prevent spam and encourages network maintenance.

### Dictionary of storage fee parameters

- `utime_since`: このパラメータは、指定された価格が適用される初期Unixタイムスタンプを提供します。

- `bit_price_ps` and `cell_price_ps`: These parameters represent the storage prices for one bit or one cell of information in the main WorkChains of the TON Blockchain for 65536 seconds

- `mc_bit_price_ps` and `mc_cell_price_ps`: These parameters represent the prices for computational resources specifically in the TON MasterChain for 65536 seconds

:::info
`utime_since` accepts values in the `uint32` data type.

残りの部分は `uint64` データ型の値を受け付けます。
:::

## Param 20 and 21

これらのパラメータは、TON ネットワーク内の計算コストを定義します。任意の計算の複雑さは、ガス単位で推定されます。 The complexity of any computation is estimated in gas units.

- `flat_gas_limit` と `flat_gas_price`: `flat_gas_price`の価格で、一定の開始量のガスが提供されます (TON仮想マシンの起動コストを相殺するため)。

- `gas_price`: このパラメータは、ネットワーク内のガスの価格を、65536のガス単位あたりのナノトン単位で反映します。

- `gas_limit`: このパラメータは、トランザクションごとに消費できるガスの最大量を表します。

- `special_gas_limit`: このパラメータは、特別な(システム)契約のトランザクションごとに消費できるガス量の制限を表します。

- `gas_credit`: This parameter represents a credit in gas units provided to transactions to check an external message.

- `block_gas_limit`: このパラメータは、1つのブロック内で消費できるガスの最大量を表します。

- `freeze_due_limit` and `delete_due_limit`: Limits of accumulated storage fees (in nanoToncoin) at which a contract is frozen and deleted, respectively.

:::info
You can find more about `gas_credit` and other parameters in the section of external messages [here](/v3/documentation/smart-contracts/transaction-fees/accept-message-effects#external-messages).
:::

## Param 22 and 23

これらのパラメータはブロックに制限を設定します。 ブロックが確定され、残りのメッセージ(もしあれば)のコールバックが次のブロックに送られます。

### Configuration parameters

- `bytes`: このセクションでは、ブロックサイズの制限をバイト単位で設定します。

- `underload`: アンダーロードは、シャードが負荷がないことを認識し、隣接するシャードが喜んでいる場合にマージする傾向がある状態です。

- `soft_limit`: ソフト制限 - この制限に達すると、内部メッセージの処理が停止します。

- `hard_limit`: ハード制限 - これは絶対最大サイズです。

- `gas`: This section sets the limits on the amount of gas that a block can consume. Gas, in the context of blockchain, is an indicator of computational work. The limits on underload, soft and hard limits, work the same as for size in bytes.

- `lt_delta`: This section sets the limits on the difference in logical time between the first and last transaction. Logical time is a concept used in the TON Blockchain for ordering events. The limits on underload, soft and hard limits, work the same as for size in bytes and gas.

:::info
If a shard has insufficient load and there is an intention to merge with a neighboring shard, the `soft_limit` indicates a threshold. When this threshold is exceeded, internal messages will stop being processed, while external messages will still be handled. External messages will continue to be processed until the total reaches a limit that is equal to half the sum of the `soft_limit` and `hard_limit`, or `(soft_limit + hard_limit) / 2`.
:::

## Param 24 and 25

Parameter 24 represents the configuration for the cost of sending messages in the MasterChain of the TON Blockchain.

パラメータ 25 は、他のすべての場合にメッセージを送信するコストの構成を表します。

### Configuration parameters defining the costs of forwarding

- `lump_price`: このパラメータは、メッセージのサイズや複雑さに関係なく、メッセージを転送するための基本価格を意味します。

- `bit_price`: このパラメータは、メッセージ転送のビット毎のコストを表します。

- `cell_price`: このパラメータは、セルごとのメッセージ転送のコストを反映しています。セルは、TONブロックチェーン上のデータ保存の基本単位です。 A cell is the basic unit of data storage on the TON Blockchain.

- `ihr_price_factor`: This is a factor used to calculate the cost of immediate hypercube routing (IHR).

:::info
IHR is a method of message delivery in the TON Blockchain network, where messages are sent directly to the recipient's ShardChain.
:::

- `first_frac`: このパラメータは、メッセージ経路に沿った最初の遷移に使用される残りの部分を定義します。

- `next_frac`: このパラメータは、メッセージ経路に沿った後続のトランジションに使用される残りの部分を定義します。

## Param 28

This parameter provides the configuration for the consensus protocol above `Catchain` ([Param 28](#param-28)) in the TON Blockchain. The consensus protocol is a crucial component of a blockchain network, and it ensures that all nodes agree on the state of the distributed ledger.

### Configuration parameters

- `flags`: さまざまなバイナリパラメータを設定するために使用できる一般的なフィールド。 この場合は 0 になります。これは特定のフラグが設定されていないことを意味します。 In this case, it equals 0, which means that no specific flags are set.

- `shuffle_mc_validators`: マスターチェーンのバリデータをシャッフルするかどうかを示すブール値。 このパラメータが 1 に設定されている場合、バリデータはシャッフルされます。そうでなければ、バリデータはシャッフルされません。 If this parameter is set to 1, the validators will be shuffled; otherwise, they will not.

- `mc_catchain_lifetime`: The lifetime of MasterChain's `Catchain` groups in seconds.

- `shard_catchain_lifetime`: The lifetime of ShardChain's `Catchain` groups in seconds.

- `shard_validators_lifetime`: The lifetime of a ShardChain's validators group in seconds.

- `shard_validators_num`: The number of validators in each ShardChain validation group.

## Param 29

This parameter provides the configuration for the consensus protocol above `Catchain` ([Param 28](#param-28)) in the TON Blockchain. The consensus protocol is a crucial component of a blockchain network, and it ensures that all nodes agree on the state of the distributed ledger.

### Configuration parameters

- `flags`: さまざまなバイナリパラメータを設定するために使用できる一般的なフィールド。 この場合は 0 になります。これは特定のフラグが設定されていないことを意味します。 In this case, it equals 0, which means that no specific flags are set.

- `new_catchain_ids`: A Boolean value indicating whether to generate new `Catchain` identifiers. If this parameter is set to 1, new identifiers will be generated. In this case, it is assigned the value of 1, which means that new identifiers will be generated.

- `fast_attempts`: "fast" attempts to reach consensus. ここでは、3に設定されています。

- `next_candidate_delay_ms`: ブロック候補を生成する権利の前のミリ秒単位の遅延が次のバリデータに渡されます。 ここでは2000ミリ秒(2秒)に設定します。 Here, it is set to 2000 ms (2 seconds).

- `consensus_timeout_ms`: ミリ秒単位のブロックコンセンサスのタイムアウト。ここでは16000ミリ秒（16秒）に設定されています。 Here, it is set to 16000 ms (16 seconds).

- `fast_attempts`: The number of "fast" attempts to reach consensus. Here, it is set to 3.

- `attempt_duration`: 合意での各試行の継続時間。ここでは8に設定されます。 Here, it is set to 8.

- `catchain_max_blocks_coeff`: The coefficient limiting the rate of block generation in `Catchain`, [description](https://github.com/ton-blockchain/ton/blob/master/doc/catchain-dos.md). Here, it is set to 10000.

- `max_block_bytes`: バイト単位のブロックの最大サイズ。ここでは、2097152 bytes (2 MB)に設定されています。 Here, it is set to 2097152 bytes (2 MB).

- `max_collated_bytes`: シリアル化されたブロックの正確性証明の最大サイズをバイト単位で指定します。ここでは、2097152 bytes (2 MB)に設定します。 Here, it is set to 2097152 bytes (2 MB).

- `proto_version`: プロトコルのバージョン。ここでは2に設定されています。 Here, it is set to 2.

- `catchain_max_deps`: Catchain ブロックの依存関係の最大数。ここでは、4 に設定します。 Here, it is set to 10000.

## Param 31

This parameter represents the configuration of smart contract addresses from which no fees are charged for either gas or storage and where **tick-tok** transactions can be created. The list usually includes governance contracts. The parameter is presented as a binary tree structure — a tree (HashMap 256), where the keys are a 256-bit representation of the address. Only addresses in the MasterChain can be present in this list.

## Param 32, 34, 36

Lists of validators from the previous (32), current (34), and next (36) rounds. 前回(32)、現在(34)、次回(36)ラウンドのバリデータのリストです。 パラメータ36は選挙終了からラウンドの開始まで設定されます。

### Configuration parameters

- `cur_validators`: これは現在のバリデータのリストです。バリデータはブロックチェーンネットワーク内のトランザクションを検証する責任があります。 Validators are typically responsible for verifying transactions in a blockchain network.

- `utime_since` と `utime_until`: これらのパラメータは、これらのバリデータがアクティブな期間を提供します。

- `total` and `main`: These parameters provide the total number of validators and the number of validators validating the MasterChain in the network.

- `total_weight`: バリデータの重みを加算します。

- `list`: A list of validators in the tree format `id->validator-data`: `validator_addr`, `public_key`, `weight`, `adnl_addr`: These parameters provide details about each validator - their 256 addresses in the MasterChain, public key, weight, ADNL address (the address used at the network level of the TON).

## Param 40

This parameter defines the structure of the configuration for punishment for improper behavior (non-validation). In the absence of the parameter, the default fine size is 101 Toncoins.

### Configuration parameters

`MisbehaviourPunishmentConfig`: This data structure defines how improper behavior in the system is punished.

いくつかのフィールドが含まれています:

- `default_flat_fine`: 罰金のこの部分はステークサイズに依存しません。

- `default_proportional_fine`: この微分部分はバリデータのステークサイズに比例します。

- `severity_flat_multi`: バリデータによる重大な違反に対して、 `default_flat_fine` に適用される乗数です。

- `severity_proportional_mult`: バリデータによる重大な違反に対して、 `default_proportional_fine` 値に適用される乗数です。

- `unpinable_interval`: 一時的なネットワークの問題やその他の異常を除去するために犯罪者が処罰されない期間を表します。

- `long_interval`, `long_flat_mult`, `long_proportional_multi`: これらのパラメータは、不適切な動作に対するフラットおよび比例罰金に対する「長い」期間と乗算器を定義します。

- `medium_interval` 、 `medium_flat_mult`、 `medium_proportional_multi`: 同様に、不適切な動作に対するフラット罰金と比例罰金の「中」期間と乗数を定義します。

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

存在しない場合、デフォルトのパラメータが取られます。

- `max_size` = 65535

- `max_depth` = 512

- `max_msg_bits` = 1 \<\< 21

- `max_msg_cells` = 1 \<\< 13

- `max_library_cells` = 1000

- `max_vm_data_depth` = 512

- `max_acc_state_cells` = 1 \<\< 16

- `max_acc_state_bits` = (1 \<\< 16) \* 1023

:::info
標準パラメータ [here](https://github.com/ton-blockchain/ton/blob/fc9542f5e223140fcca833c189f77b1a5ae2e184/crypto/block/mc-config.h#L379) の詳細をソースコードで確認できます。
:::

## Param 44

This parameter defines the list of suspended addresses, which cannot be initialized until `suspended_until`. It only applies to yet uninitiated accounts. This is a measure for stabilizing the tokenomics (limiting early miners). If not set - there are no limitations. Each address is represented as an end node in this tree, and the tree-like structure allows to effectively check the presence or absence of an address in the list.

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

- `oracle_multisig_address`: これがブリッジ管理ウォレットアドレスです。 マルチシグウォレットは、トランザクションを承認するために複数の当事者からの署名を必要とする一種のデジタルウォレットです。 これは、セキュリティを向上させるために頻繁に使用されます. A multisig wallet is a type of digital wallet that requires signatures from multiple parties to authorize a transaction. It is often used to increase security. The oracles act as the parties.

- `oracles`: List of oracles in the form of a tree `id->address`

- `external_chain_address`: これは対応する外部ブロックチェーンのブリッジコントラクトアドレスです。

## Param 79, 81, 82

This parameter relates to bridges for wrapping tokens from other networks into tokens on the TON network:

- ETH-TON **(79)**

- BSC-TON **(81)**

- Polygon-TON **(82)**

### Configuration parameters

- `bridge_address` と `oracles_address`: ブリッジのブロックチェーンアドレスとブリッジ管理契約 (oracles multisig) です。

- `oracles`: List of oracles in the form of a tree `id->address`

- `state_flags`: 状態フラグ. このパラメータは、個別のブリッジ関数の有効化/無効化を行います。

- `prices`: このパラメータは、`bridge_burn_fee`のように、ブリッジに関連するさまざまな操作または手数料の価格のリストまたは辞書を含みます。 `bridge_mint_fee` 、 `wallet_min_tons_for_storage` 、 `wallet_gas_consumption` 、 `minter_min_tons_for_storage` 、 `discover_gas_consumption` 。

- `external_chain_address`: 別のブロックチェーンのブリッジコントラクトアドレス。

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

