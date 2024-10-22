# Config Parameters

:::info
Read live values via [tonviewer](https://tonviewer.com/config)
:::

## 👋 Introduction

On this page, you can find a description of the configuration parameters used in the TON Blockchain.
TON has a complex configuration with many technical parameters: some are used by the blockchain itself, some by the ecosystem. However, only a few people understand what these parameters mean. This article is necessary to provide users with a simple way to understand the parameters and their purpose.

## 💡 Prerequisites

This material is intended to be read alongside the parameter list.
You can view the parameter values in the [current configuration](https://explorer.toncoin.org/config), and the way they are written into [cells](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage) is described in the [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb) file in [TL-B](/v3/documentation/data-formats/tlb/tl-b-language) format.

:::info
The binary encoding at the end of the TON Blockchain parameter is a serialized binary representation of its configuration, enabling efficient storage or transmission of the configuration. The precise details of serialization depend on the specific encoding scheme used by the TON Blockchain.
:::

## 🚀 Let's get started!

All parameters are in order, and you won't get lost. For your convenience, use the right sidebar for quick navigation.

## Param 0

This parameter is the address of a special smart contract that stores the blockchain's configuration. The configuration is stored in the contract to simplify its loading and modification during validator voting.

:::info
In the configuration parameter, only the hash portion of the address is recorded, as the contract always resides in the [masterchain](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#masterchain-blockchain-of-blockchains) (workchain -1). Therefore, the full address of the contract will be written as `-1:<value of the configuration parameter>`.
:::

## Param 1

This parameter is the address of the [Elector](/v3/documentation/smart-contracts/contracts-specs/governance#elector) smart contract, responsible for appointing validators, distributing rewards, and voting on changes to blockchain parameters.

## Param 2

This parameter represents the address of the System, on behalf of which new TONs are minted and sent as rewards for validating the blockchain.

:::info
If parameter 2 is missing, parameter 0 is used instead (newly minted TONs come from the configuration smart contract).
:::

## Param 3

This parameter is the address of the transaction fee collector.

:::info
If parameter 3 is missing (as is the case at the time of writing), transaction fees are sent to the Elector smart contract (parameter 1).
:::

## Param 4

This parameter is the address of the root DNS contract of the TON network.

:::info
More detailed information can be found in the [TON DNS & Domains](/v3/guidelines/web3/ton-dns/dns) article and in a more detailed original description [here](https://github.com/ton-blockchain/TEPs/blob/master/text/0081-dns-standard.md).
This contract is not responsible for selling .ton domains.
:::

## Param 6

This parameter is responsible for minting fees of new currencies.

:::info
Currently, minting additional currency is not implemented and does not work. The implementation and launch of the minter are planned.

You can learn more about the issues and prospects in the [relevant article](/v3/documentation/infra/minter-flow).
:::

## Param 7

This parameter stores the volume of each of the additional currencies in circulation. Data is stored in the form of a [dictionary](/v3/documentation/data-formats/tlb/tl-b-types#hashmap-parsing-example) (binary tree; probably during TON's development this structure was mistakenly named hashmap) `extracurrency_id -> amount`, the amount is presented as `VarUint 32` - an integer from `0` to `2^248`.

## Param 8

This parameter indicates the network version and additional capabilities supported by the validators.

:::info
Validators are nodes in the blockchain network that are responsible for creating new blocks and verifying transactions.
:::

-   `version`: This field specifies the version.

-   `capabilities`: This field is a set of flags that are used to indicate the presence or absence of certain features or capabilities.

Thus, when updating the network, validators will vote to change parameter 8. This way, the TON network can be updated without downtime.

## Param 9

This parameter contains a list (binary tree) of mandatory parameters. It ensures that certain configuration parameters are always present and cannot be removed by a proposal to change the configuration until parameter 9 changes.

## Param 10

This parameter represents a list (binary tree) of critical TON parameters, the change of which significantly affects the network, so more voting rounds are held.

## Param 11

This parameter indicates under what conditions proposals to change the TON configuration are accepted.

-   `min_tot_rounds` - the minimum number of rounds before a proposal can be applied
-   `max_tot_rounds` - the maximum number of rounds, upon reaching which the proposal will automatically be rejected
-   `min_wins` - the required number of wins (3/4 of validators by the sum of the pledge must vote in favor)
-   `max_losses` - the maximum number of losses, upon reaching which the proposal will automatically be rejected
-   `min_store_sec` and `max_store_sec` determine the possible time interval during which the proposal will be stored
-   `bit_price` and `cell_price` indicate the price of storing one bit or one cell of the proposal

## Param 12

This parameter represents the configuration of a workchain in the TON Blockchain. Workchains in the TON Blockchain are designed as independent blockchains that can operate in parallel, allowing TON to scale and process a very large number of transactions and smart contracts.

## Workchain configuration parameters

-   `enabled_since`: a UNIX timestamp of the moment this workchain was enabled;

-   `actual_min_split`: the minimum depth of the split (sharding) of this workchain, supported by validators;

-   `min_split`: the minimum depth of the split of this workchain, set by the configuration;

-   `max_split`: the maximum depth of the split of this workchain;

-   `basic`: a boolean flag (1 for true, 0 for false) indicating whether this workchain is basic (handles TON coins, smart contracts based on the TON Virtual Machine);

-   `active`: a boolean flag indicating whether this workchain is active at the moment;

-   `accept_msgs`: a boolean flag indicating whether this workchain is accepting messages at the moment;

-   `flags`: additional flags for the workchain (reserved, currently always 0);

-   `zerostate_root_hash` and `zerostate_file_hash`: hashes of the first block of the workchain;

-   `version`: version of the workchain;

-   `format`: the format of the workchain, which includes vm_version and vm_mode - the virtual machine used there.

## Param 13

This parameter defines the cost of filing complaints about incorrect operation of validators in the [Elector](/v3/documentation/smart-contracts/contracts-specs/governance#elector) contract.

## Param 14

This parameter represents the reward for block creation in the TON Blockchain. Nanograms are nanoTON, thus, the reward for block creation in the masterchain equals 1.7 TON, and in the basic workchain - 1.0 TON (meanwhile, in the event of a workchain split, the block reward also splits: if there are two shardchains in the workchain, then the shard block reward will be 0.5 TON).

## Param 15

This parameter contains the duration of different stages of elections and validators' work in the TON Blockchain.

For each validation period, there is an `election_id` equal to the UNIX-format time at the start of the validation.
You can get the current `election_id` (if elections are ongoing) or the past one by invoking the Elector contract's respective get-methods `active_election_id` and `past_election_ids`.

## Workchain configuration parameters

-   `validators_elected_for`: the number of seconds the elected set of validators perform their role (one round).

-   `elections_start_before`: how many seconds before the end of the current round the election process for the next period will start.

-   `elections_end_before`: how many seconds before the end of the current round the validators for the next round will be chosen.

-   `stake_held_for`: the period for which a validator's stake is held (for handling complaints) after the round expires.

:::info
Each value in the arguments is determined by the `uint32` data type.
:::

### Examples

In the TON Blockchain, it is customary to conventionally divide validation periods into even and odd ones. These rounds follow one another. Since voting for the next round takes place during the previous one, a validator needs to divide funds into two pools to have the opportunity to participate in both rounds.

#### Mainnet

Current values:

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

#### How to calculate periods?

Let `election_id = validation_start = 1600032768`. Then:

```python
election_start = election_id - constants['elections_start_before'] = 1600032768 - 32768 = 1600000000
election_end = delay_start = election_id - constants['elections_end_before'] = 1600032768 - 8192 = 1600024576
hold_start = validation_end = election_id + constants['validators_elected_for'] = 1600032768 + 65536 = 1600098304
hold_end = hold_start + constants['stake_held_for'] = 1600098304 + 32768 = 1600131072
```

Thus, at the moment, the length of one round of one parity is `1600131072 - 1600000000 = 131072 seconds = 36.40888... hours`

#### Testnet

##### Current values:

```python
constants = {
    'validators_elected_for': 7200,  # 2 hours
    'elections_start_before': 2400,  # 40 minutes
    'elections_end_before': 180,     # 3 minutes
    'stake_held_for': 900            # 15 minutes
}
```

##### Scheme

![image](/img/docs/blockchain-configs/config15-testnet.png)

###### How to calculate periods?

Let `election_id = validation_start = 160002400`. Then:

```python
election_start = election_id - constants['elections_start_before'] = 160002400 - 2400 = 1600000000
election_end = delay_start = election_id - constants['elections_end_before'] = 160002400 - 180 = 160002220
hold_start = validation_end = election_id + constants['validators_elected_for'] = 160002400 + 7200 = 160009600
hold_end = hold_start + constants['stake_held_for'] = 160009600 + 900 = 160010500
```

Thus, at the moment, the length of one round of one parity is `160010500 - 1600000000 = 10500 seconds = 175 minutes = 2.91666... hours`

## Param 16

This parameter represents the limits on the number of validators in the TON Blockchain. It is directly used by the Elector smart contract.

### Configuration parameters for the number of validators for elections:

-   `max_validators`: This parameter represents the maximum number of validators that can participate in the network operation at any given time.

-   `max_main_validators`: This parameter represents the maximum number of masterchain validators.

-   `min_validators`: This parameter represents the minimum number of validators that must support the network operation.

1. The maximum number of validators is greater than or equal to the maximum number of masterchain validators.
2. The maximum number of masterchain validators must be greater than or equal to the minimum number of validators.
3. The minimum number of validators must be no less than 1.

## Param 17

This parameter represents the stake parameters configuration in the TON Blockchain. In many blockchain systems, especially those using the Proof-of-Stake or Delegated Proof-of-Stake consensus algorithm, cryptocurrency owners native to the network can "stake" their tokens to become validators and earn rewards.

## Configuration parameters:

-   `min_stake`: This parameter represents the minimum amount of TONs that an interested party needs to stake to participate in the validation process.

-   `max_stake`: This parameter represents the maximum amount of TONs that an interested party can stake.

-   `min_total_stake`: This parameter represents the minimum total amount of TONs that must be held by the chosen set of validators.

-   `max_stake_factor`: This parameter is a multiplier indicating how many times the maximum effective stake (pledge) can exceed the minimum stake sent by any other validator.

:::info
Each value in the arguments is determined by the `uint32` data type.
:::

## Param 18

This parameter represents the configuration for determining the prices for data storage on the TON Blockchain. This serves as a measure to prevent spam and encourages network maintenance.

### Dictionary of storage fee parameters:

-   `utime_since`: This parameter provides the initial Unix timestamp from which the specified prices apply.

-   `bit_price_ps` and `cell_price_ps`: These parameters represent the storage prices for one bit or one cell of information in the main workchains of the TON Blockchain for 65536 seconds

-   `mc_bit_price_ps` and `mc_cell_price_ps`: These parameters represent the prices for computational resources specifically in the TON masterchain for 65536 seconds

:::info

`utime_since` accepts values in the `uint32` data type.

The rest accept values in the `uint64` data type.
:::

## Param 20 and 21

These parameters define the cost of computations in the TON network. The complexity of any computation is estimated in gas units.

-   `flat_gas_limit` and `flat_gas_price`: A certain starting amount of gas is provided at a price of `flat_gas_price` (to offset the costs of launching the TON Virtual Machine).

-   `gas_price`: This parameter reflects the price of gas in the network, in nanotons per 65536 gas units.

-   `gas_limit`: This parameter represents the maximum amount of gas that can be consumed per transaction.

-   `special_gas_limit`: This parameter represents the limit on the amount of gas that can be consumed per transaction of a special (system) contract.

-   `gas_credit`: This parameter represents a credit in gas units that is provided to transactions for the purpose of checking an external message.

-   `block_gas_limit`: This parameter represents the maximum amount of gas that can be consumed within a single block.

-   `freeze_due_limit` and `delete_due_limit`: Limits of accumulated storage fees (in nanoTON) at which a contract is frozen and deleted, respectively.

:::info
More about `gas_credit` and other parameters in the section with external messages [here](/v3/documentation/smart-contracts/transaction-fees/accept-message-effects#external-messages).
:::

## Param 22 and 23

These parameters set limits on the block, upon reaching which the block is finalized and the callback of the remaining messages (if any) is carried over to the next block.

### Configuration parameters:

-   `bytes`: This section sets the limits on the block size in bytes.

-   `underload`: Underload is a state when the shard realizes that there is no load and is inclined to merge if a neighboring shard is willing.

-   `soft_limit`: Soft limit - when this limit is reached, internal messages stop being processed.

-   `hard_limit`: Hard limit - this is the absolute maximum size.

-   `gas`: This section sets the limits on the amount of gas that a block can consume. Gas in the context of blockchain is an indicator of computational work. The limits on underload, soft and hard limit work the same as for size in bytes.

-   `lt_delta`: This section sets the limits on the difference in logical time between the first and the last transaction. Logical time is a concept used in the TON Blockchain for ordering events. The limits on underload, soft and hard limit work the same as for size in bytes and gas.

:::info
In case of insufficient load on the shard and, accordingly, the desire to merge with a neighbor, `soft_limit` defines a state above which internal (internal) messages stop being processed, but external (external) ones continue. External (external) messages are processed until a limit equal to `(soft_limit + hard_limit)/2 is reached`.
:::

## Param 24 and 25

Parameter 24 represents the configuration for the cost of sending messages in the masterchain of the TON Blockchain.

Parameter 25 represents the configuration for the cost of sending messages in all other cases.

### Configuration parameters defining the costs of forwarding:

-   `lump_price`: This parameter means the base price for forwarding a message, regardless of its size or complexity.

-   `bit_price`: This parameter represents the cost per bit of message forwarding.

-   `cell_price`: This parameter reflects the cost of forwarding a message per cell. A cell is the basic unit of data storage on the TON Blockchain.

-   `ihr_price_factor`: This is a factor used to calculate the cost of immediate hypercube routing (IHR).
    :::info
    IHR is a method of message delivery in the TON Blockchain network, where messages are sent directly to the recipient's shard chain.
    :::

-   `first_frac`: This parameter defines the fraction of the remaining remainder that will be used for the first transition along the message route.

-   `next_frac`: This parameter defines the fraction of the remaining remainder that will be used for subsequent transitions along the message route.

## Param 28

This parameter provides the configuration for the Catchain protocol in the TON Blockchain. Catchain is the lowest level consensus protocol used in TON to achieve agreement among validators.

### Configuration parameters:

-   `flags`: A general field that can be used to set various binary parameters. In this case, it equals 0, which means that no specific flags are set.

-   `shuffle_mc_validators`: A Boolean value indicating whether to shuffle the masterchain validators or not. If this parameter is set to 1, the validators will be shuffled; otherwise, they will not.

-   `mc_catchain_lifetime`: The lifetime of masterchain catchain groups in seconds.

-   `shard_catchain_lifetime`: The lifetime of shardchain catchain groups in seconds.

-   `shard_validators_lifetime`: The lifetime of a shardchain validators group in seconds.

-   `shard_validators_num`: The number of validators in each shardchain validation group.

## Param 29

This parameter provides the configuration for the consensus protocol above catchain ([Param 28](#param-28)) in the TON Blockchain. The consensus protocol is a crucial component of a blockchain network, and it ensures that all nodes agree on the state of the distributed ledger.

### Configuration parameters:

-   `flags`: A general field that can be used to set various binary parameters. In this case, it equals 0, which means that no specific flags are set.

-   `new_catchain_ids`: A Boolean value indicating whether to generate new Catchain identifiers. If this parameter is set to 1, new identifiers will be generated. In this case, it is assigned the value of 1, which means that new identifiers will be generated.

-   `round_candidates`: The number of candidates to be considered in each round of the consensus protocol. Here, it is set to 3.

-   `next_candidate_delay_ms`: The delay in milliseconds before the right to generate a block candidate passes to the next validator. Here, it is set to 2000 ms (2 seconds).

-   `consensus_timeout_ms`: The timeout for block consensus in milliseconds. Here, it is set to 16000 ms (16 seconds).

-   `fast_attempts`: The number of "fast" attempts to reach consensus. Here, it is set to 3.

-   `attempt_duration`: The duration of each attempt at agreement. Here, it is set to 8.

-   `catchain_max_deps`: The maximum number of dependencies of a Catchain block. Here, it is set to 4.

-   `max_block_bytes`: The maximum size of a block in bytes. Here, it is set to 2097152 bytes (2 MB).

-   `max_collated_bytes`: The maximum size of serialized block correctness proofs in bytes. Here, it is set to 2097152 bytes (2 MB).

-   `proto_version`: The protocol version. Here, it is set to 2.

-   `catchain_max_blocks_coeff`: The coefficient limiting the rate of block generation in Catchain, [description](https://github.com/ton-blockchain/ton/blob/master/doc/catchain-dos.md). Here, it is set to 10000.

## Param 31

This parameter represents the configuration of smart contract addresses from which no fees are charged for either gas or storage, and where tick-tok transactions can be created. The list usually includes governance contracts. The parameter is presented as a binary tree structure — a tree (HashMap 256), where the keys are a 256-bit representation of the address. Only addresses in the masterchain can be present in this list.

## Param 32, 34 and 36

Lists of validators from the previous (32), current (34), and next (36) rounds. Parameter 36 is set from the end of the elections until the start of the round.

### Configuration parameters:

-   `cur_validators`: This is the current list of validators. Validators are typically responsible for verifying transactions in a blockchain network.

-   `utime_since` and `utime_until`: These parameters provide the time period during which these validators are active.

-   `total` and `main`: These parameters provide the total number of validators and the number of validators validating the masterchain in the network.

-   `total_weight`: This adds up the weights of the validators.

-   `list`: A list of validators in the tree format `id->validator-data`: `validator_addr`, `public_key`, `weight`, `adnl_addr`: These parameters provide details about each validator - their 256 addresses in the masterchain, public key, weight, ADNL address (the address used at the network level of TON).

## Param 40

This parameter defines the structure of the configuration for punishment for improper behavior (non-validation). In the absence of the parameter, the default fine size is 101 TON.

## Configuration parameters:

** `MisbehaviourPunishmentConfig` **: This data structure defines how improper behavior in the system is punished.

It contains several fields:

-   `default_flat_fine`: This part of the fine does not depend on the stake size.

-   `default_proportional_fine`: This part of the fine is proportional to the validator's stake size.

-   `severity_flat_mult`: This is the multiplier applied to the `default_flat_fine` value for significant violations by the validator.

-   `severity_proportional_mult`: This is the multiplier applied to the `default_proportional_fine` value for significant violations by the validator.

-   `unpunishable_interval`: This parameter represents the period during which offenders are not punished to eliminate temporary network problems or other anomalies.

-   `long_interval`, `long_flat_mult`, `long_proportional_mult`: These parameters define a "long" period of time and multipliers for flat and proportional fines for improper behavior.

-   `medium_interval`, `medium_flat_mult`, `medium_proportional_mult`: Similarly, they define a "medium" period of time and multipliers for flat and proportional fines for improper behavior.

## Param 43

This parameter pertains to various size limits and other characteristics of accounts and messages.

### Configuration parameters:

-   `max_msg_bits`: maximum message size in bits.

-   `max_msg_cells`: maximum number of cells (a form of storage unit) a message can occupy.

-   `max_library_cells`: maximum number of cells that can be used for library cells.

-   `max_vm_data_depth`: maximum cell depth in messages and account state.

-   `max_ext_msg_size`: maximum external message size in bits.

-   `max_ext_msg_depth`: maximum external message depth. This could refer to the depth of the data structure within the message.

-   `max_acc_state_cells`: maximum number of cells that an account state can occupy.

-   `max_acc_state_bits`: maximum account state size in bits.

If absent, the default parameters are taken:

-   `max_size` = 65535
-   `max_depth` = 512
-   `max_msg_bits` = 1 \<\< 21
-   `max_msg_cells` = 1 \<\< 13
-   `max_library_cells` = 1000
-   `max_vm_data_depth` = 512
-   `max_acc_state_cells` = 1 \<\< 16
-   `max_acc_state_bits` = (1 \<\< 16) \* 1023

:::info
You can view more details about the standard parameters [here](https://github.com/ton-blockchain/ton/blob/fc9542f5e223140fcca833c189f77b1a5ae2e184/crypto/block/mc-config.h#L379) in the source code.
:::

## Param 44

This parameter defines the list of suspended addresses, which cannot be initialized until `suspended_until`. It only applies to yet uninitiated accounts. This is a measure for stabilizing the tokenomics (limiting early miners). If not set - there are no limitations. Each address is represented as an end node in this tree, and the tree-like structure allows to effectively check the presence or absence of an address in the list.

:::info
The stabilization of the tokenomics is further described in the [official report](https://t.me/tonblockchain/178) of the "The Open Network" Telegram channel.
:::

## Param 45

The list of precompiled contracts is stored in the masterchain config:

```
precompiled_smc#b0 gas_usage:uint64 = PrecompiledSmc;
precompiled_contracts_config#c0 list:(HashmapE 256 PrecompiledSmc) = PrecompiledContractsConfig;
_ PrecompiledContractsConfig = ConfigParam 45;
```

More details about precompiled contracts on [this page](/v3/documentation/smart-contracts/contracts-specs/precompiled-contracts).

## Param 71 - 73

This parameter pertains to bridges for wrapping TON in other networks:

-   ETH-TON ** (71)**
-   BSC-TON ** (72) **
-   Polygon-TON ** (73) **

### Configuration parameters:

-   `bridge_address`: This is the bridge contract address that accepts TON to issue wrapped TON in other networks.

-   `oracle_multisig_address`: This is the bridge management wallet address. A multisig wallet is a type of digital wallet that requires signatures from multiple parties to authorize a transaction. It is often used to increase security. The oracles act as the parties.

-   `oracles`: list of oracles in the form of a tree `id->address`

-   `external_chain_address`: This is the bridge contract address in the corresponding external blockchain.

## Param 79, 81 and 82

This parameter pertains to bridges for wrapping tokens from other networks into tokens on the TON network:

-   ETH-TON ** (79) **
-   BSC-TON ** (81) **
-   Polygon-TON ** (82) **

### Configuration parameters:

-   `bridge_address` and `oracles_address`: These are the blockchain addresses of the bridge and the bridge management contract (oracles multisig), respectively.

-   `oracles`: list of oracles in the form of a tree `id->address`

-   `state_flags`: State flag. This parameter is responsible for enabling/disabling separate bridge functions.

-   `prices`: This parameter contains a list or dictionary of prices for different operations or fees associated with the bridge, such as `bridge_burn_fee`, `bridge_mint_fee`, `wallet_min_tons_for_storage`, `wallet_gas_consumption`, `minter_min_tons_for_storage`, `discover_gas_consumption`.

-   `external_chain_address`: The bridge contract address in another blockchain.

## Negative Parameters

:::info
The difference between negative parameters and positive ones is the need for validators' verification; they usually do not have a specific assigned role.
:::

## Next Steps

After a deep dive into this article, it is strongly recommended that you take the time for a more detailed study of the following documents:

-   Original, but limited descriptions in [whitepaper.pdf](https://ton.org/whitepaper.pdf) and [tblkch.pdf](/tblkch.pdf).

-   [mc-config.h](https://github.com/ton-blockchain/ton/blob/fc9542f5e223140fcca833c189f77b1a5ae2e184/crypto/block/mc-config.h), [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb) and [BlockMasterConfig Type](https://docs.evercloud.dev/reference/graphql-api/field_descriptions#blockmasterconfig-type).

## 📖 See Also

On this page, you can find active network configurations of the TON Blockchain:

-   Mainnet: https://ton.org/global-config.json
-   Testnet: https://ton.org/testnet-global.config.json
-   [Russian Version](https://github.com/delovoyhomie/description-config-for-TON-Blockchain/blob/main/Russian-version.md).
