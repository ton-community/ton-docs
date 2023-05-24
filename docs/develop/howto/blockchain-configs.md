# Blockchain Config

## 👋 Introduction

On this page, you can find a description of the configuration parameters used in the TON blockchain.
TON has a complex configuration with many technical parameters: some are used by the blockchain itself, some by the ecosystem. However, only a few people understand what these parameters mean. This article is necessary to provide users with a simple way to understand the parameters and their purpose.

## 💡 Prerequisites

This material is intended to be read alongside the parameter list.
You can view the parameter values in the [current configuration](https://explorer.toncoin.org/config), and the way they are written into [cells](https://docs.ton.org/learn/overviews/cells) is described in the [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb) file in [TL-B](https://docs.ton.org/develop/data-formats/tl-b-language) format.

:::info
The binary encoding at the end of the TON blockchain parameter is a serialized binary representation of its configuration, enabling efficient storage or transmission of the configuration. The precise details of serialization depend on the specific encoding scheme used by the TON blockchain.
:::

##  🚀 Let's get started!

All parameters are in order, and you won't get lost. For your convenience, use the right sidebar for quick navigation.

## Param 0

This parameter is the address of a special smart contract that stores the blockchain's configuration. The configuration is stored in the contract to simplify its loading and modification during validator voting.

:::info
In the configuration parameter, only the hash portion of the address is recorded, as the contract always resides in the [masterchain](https://docs.ton.org/learn/overviews/ton-blockchain#masterchain-blockchain-of-blockchains) (workchain -1). Therefore, the full address of the contract will be written as `-1:<value of the configuration parameter>`.
:::

## Param 1

This parameter is the address of the [Elector](https://ton.org/docs/develop/smart-contracts/governance#elector) smart contract, responsible for appointing validators, distributing rewards, and voting on changes to blockchain parameters.

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
More detailed information can be found in the [TON DNS & Domains](https://docs.ton.org/participate/web3/dns) article and in a more detailed original description [here](https://github.com/ton-blockchain/TEPs/blob/master/text/0081-dns-standard.md).
This contract is not responsible for selling .ton domains.
:::

## Param 6

This parameter is responsible for minting fees of new currencies.

:::info
Currently, minting additional currency is not implemented and does not work. The implementation and launch of the minter are planned.

You can learn more about the issues and prospects in the [relevant article](https://docs.ton.org/develop/research-and-development/minter-flow).
:::

## Param 7

This parameter stores the volume of each of the additional currencies in circulation. Data is stored in the form of a [dictionary](https://docs.ton.org/develop/data-formats/tl-b-types#hashmap-parsing-example) (binary tree; probably during TON's development this structure was mistakenly named hashmap) `extracurrency_id -> amount`, the amount is presented as `VarUint 32` - an integer from `0` to `2^248`.

## Param 8

This parameter indicates the network version and additional capabilities supported by the validators.

:::info
Validators are nodes in the blockchain network that are responsible for creating new blocks and verifying transactions.
:::

* `version`: This field specifies the version.

* `capabilities`: This field is a set of flags that are used to indicate the presence or absence of certain features or capabilities.

Thus, when updating the network, validators will vote to change parameter 8. This way, the TON network can be updated without downtime.

## Param 9

This parameter contains a list (binary tree) of mandatory parameters. It ensures that certain configuration parameters are always present and cannot be removed by a proposal to change the configuration until parameter 9 changes.

## Param 10

This parameter represents a list (binary tree) of critical TON parameters, the change of which significantly affects the network, so more voting rounds are held.

## Param 11

This parameter indicates under what conditions proposals to change the TON configuration are accepted.

- `min_tot_rounds` - the minimum number of rounds before a proposal can be applied
- `max_tot_rounds` - the maximum number of rounds, upon reaching which the proposal will automatically be rejected
- `min_wins` - the required number of wins (3/4 of validators by the sum of the pledge must vote in favor)
- `max_losses` - the maximum number of losses, upon reaching which the proposal will automatically be rejected
- `min_store_sec` and `max_store_sec` determine the possible time interval during which the proposal will be stored
- `bit_price` and `cell_price` indicate the price of storing one bit or one cell of the proposal

## Param 12

