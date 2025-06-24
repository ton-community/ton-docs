import Feedback from '@site/src/components/Feedback';

# 使用提名者池进行质押

## 概述

使用TON智能合约，您可以实现任何您想要的质押和存款机制。

然而，在TON区块链中存在“原生质押”——您可以将Toncoin借给验证者进行质押，并分享验证的奖励。

The one who lends to validator is called the **nominator**.

一个称为**提名者池**的智能合约，为一个或多个提名者提供了将Toncoin贷给验证者质押的能力，并确保验证者只能用该Toncoin进行验证。此外，智能合约保证了奖励的分配。 This smart contract guarantees the distribution of the reward.

If you are familiar with cryptocurrencies, you must have heard about **validators** and **nominators**. Now, the time has come to find out what they are — the two major actors ruling the blockchain.

## 验证者

首先，让我们谈谈验证者。验证者是网络节点，通过验证（或确认）建议的区块并将其记录在区块链上来帮助维持区块链的运行。

To become a validator, you must meet two requirements: have a high-performance server and obtain at least 300,000 Toncoins, in order to make a stake. At the time of writing, there are up to 400 validators per round on TON.

## Nominator

:::info
New version of [nominator pool](/v3/documentation/smart-contracts/contracts-specs/nominator-pool/) available, read more in the [Single nominator pool](/v3/documentation/smart-contracts/contracts-specs/single-nominator-pool/) and [Vesting contract](/v3/documentation/smart-contracts/contracts-specs/vesting-contract/) pages.
:::

很明显，并不是每个人都能负担得起在余额上拥有100,000s的Toncoin——这就是提名者发挥作用的地方。简单来说，提名者是将其TON借给验证者的用户。每次验证者通过验证区块获得奖励时，奖励就会在参与者之间分配。 Simply put, the nominator is a user who lends his TON to validators. Every time the validator earns a reward by validating blocks, it is distributed between the involved participants.

TON Whales pool allows a minimum deposit of 50 TON. 不久前，Ton Whales在TON上运行了第一个质押池，最低存款为50 TON。后来，TON基金会推出了第一个开放的提名者池。现在，用户可以以**10,000 TON**开始，以完全去中心化的方式质押Toncoin。

_来自[TON社区帖子](https://t.me/toncoin/543)。_

余额池应始终为 \*\*10  TON \*\* - 这是网络存储费的最低余额。

## 每月费用

由于验证轮次持续约 **18 小时**，每轮验证需要大约 **5 TON**，且一个提名池会参与奇数和偶数轮次的验证，因此运行该提名池每月大约需要 **105 TON**。

## 如何参与？

- [TON提名者池列表](https://tonvalidators.org/)

## 源代码

- [提名者池智能合约源代码](https://github.com/ton-blockchain/nominator-pool)

:::info
提名者的理论在[TON白皮书](https://docs.ton.org/ton.pdf)中有描述，章节2.6.3, 2.6.25。
:::

## See also

- [Running validator node](/v3/guidelines/nodes/running-nodes/validator-node)
- [Nominator pool](/v3/documentation/smart-contracts/contracts-specs/nominator-pool/)
- [Single nominator pool](/v3/documentation/smart-contracts/contracts-specs/single-nominator-pool/)
  <Feedback />

