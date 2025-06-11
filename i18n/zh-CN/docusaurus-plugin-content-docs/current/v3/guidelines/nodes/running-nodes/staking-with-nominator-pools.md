import Feedback from '@site/src/components/Feedback';

# Staking with nominator pools

## 概述

使用TON智能合约，您可以实现任何您想要的质押和存款机制。

However, there is native staking in TON Blockchain - you can lend Toncoin to validators for staking and share the reward for validation.

The one who lends to validator is called the **nominator**.

A smart contract, called a [**nominator pool**](/v3/documentation/smart-contracts/contracts-specs/nominator-pool), provides the ability for one or more nominators to lend Toncoin in a validator stake, and ensures that the validator can use that Toncoin only for validation. This smart contract guarantees the distribution of the reward.

If you are familiar with cryptocurrencies, you must have heard about **validators** and **nominators**. Now, the time has come to find out what they are — the two major actors ruling the blockchain.

## Validator

A validator is a network node that helps keep the blockchain running by verifying (or validating) suggested blocks and recording them on the blockchain.

To become a validator, you must meet two requirements: have a high-performance server and obtain at least 300,000 Toncoins, in order to make a stake. At the time of writing, there are up to 400 validators per round on TON.

## Nominator

:::info
New version of [nominator pool](/v3/documentation/smart-contracts/contracts-specs/nominator-pool/) available, read more in the [Single nominator pool](/v3/documentation/smart-contracts/contracts-specs/single-nominator-pool/) and [Vesting contract](/v3/documentation/smart-contracts/contracts-specs/vesting-contract/) pages.
:::

很明显，并不是每个人都能负担得起在余额上拥有100,000s的Toncoin——这就是提名者发挥作用的地方。简单来说，提名者是将其TON借给验证者的用户。每次验证者通过验证区块获得奖励时，奖励就会在参与者之间分配。 Simply put, the nominator is a user who lends his TON to validators. Every time the validator earns a reward by validating blocks, it is distributed between the involved participants.

TON Whales pool allows a minimum deposit of 50 TON. TON Foundation open nominator pool allows users to stake Toncoin in a fully decentralized way, starting with **10,000 TON**.

_来自[TON社区帖子](https://t.me/toncoin/543)。_

余额池应始终为 \*\*10  TON \*\* - 这是网络存储费的最低余额。

## 每月费用

Since validation round lasts ~18 hours, takes about 5 TON per validation round and 1 nominator pool takes part in even and odd validation rounds it will take **~105 TON per month** to operate the pool.

## 如何参与？

- [TON提名者池列表](https://tonvalidators.org/)

## 源代码

- [Nominator pool smart contract source code](https://github.com/ton-blockchain/nominator-pool)

:::info
提名者的理论在[TON白皮书](https://docs.ton.org/ton.pdf)中有描述，章节2.6.3, 2.6.25。
:::

## See also

- [Running validator node](/v3/guidelines/nodes/running-nodes/validator-node)
- [Nominator pool](/v3/documentation/smart-contracts/contracts-specs/nominator-pool/)
- [Single nominator pool](/v3/documentation/smart-contracts/contracts-specs/single-nominator-pool/) <Feedback />
  <Feedback />

