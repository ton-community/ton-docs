import Feedback from '@site/src/components/Feedback';

# Staking with nominator pools

## Overview

С помощью смарт-контрактов TON вы можете реализовать любые механики стейкинга и депозитов, которые вам нужны.

However, there is native staking in TON Blockchain - you can lend Toncoin to validators for staking and share the reward for validation.

Тот, кто предоставляет средства валидатору, называется **номинатором**.

A smart contract, called a [**nominator pool**](/v3/documentation/smart-contracts/contracts-specs/nominator-pool), provides the ability for one or more nominators to lend Toncoin in a validator stake, and ensures that the validator can use that Toncoin only for validation. This smart contract guarantees the distribution of the reward.

If you are familiar with cryptocurrencies, you must have heard about **validators** and **nominators**. Now, the time has come to find out what they are — the two major actors ruling the blockchain.

## Validator

A validator is a network node that helps keep the blockchain running by verifying (or validating) suggested blocks and recording them on the blockchain.

To become a validator, you must meet two requirements: have a high-performance server and obtain at least 300,000 Toncoins, in order to make a stake. At the time of writing, there are up to 400 validators per round on TON.

## Nominator

:::info
New version of [nominator pool](/v3/documentation/smart-contracts/contracts-specs/nominator-pool/) available, read more in the [Single nominator pool](/v3/documentation/smart-contracts/contracts-specs/single-nominator-pool/) and [Vesting contract](/v3/documentation/smart-contracts/contracts-specs/vesting-contract/) pages.
:::

Конечно, не каждый может позволить себе иметь на балансе 100 000 Toncoin - вот тут-то и вступают в игру номинаторы. Проще говоря, номинатор - это пользователь, который одалживает свои TON валидаторам. Каждый раз, когда валидатор зарабатывает вознаграждение за подтверждение блоков, оно распределяется между участниками.

TON Whales pool allows a minimum deposit of 50 TON. TON Foundation open nominator pool allows users to stake Toncoin in a fully decentralized way, starting with **10,000 TON**.

_Из [сообщения TON Community RUS](https://t.me/toncoin_rus/362)._

На балансе пула всегда должно быть **10 TON** - это минимальный баланс для оплаты сетевого хранения.

## Стоимость в месяц

Since validation round lasts ~18 hours, takes about 5 TON per validation round and 1 nominator pool takes part in even and odd validation rounds it will take **~105 TON per month** to operate the pool.

## Как принять участие?

- [Список номинатор-пулов TON](https://tonvalidators.org/)

## Исходный код

- [Nominator pool smart contract source code](https://github.com/ton-blockchain/nominator-pool)

:::info
Теория номинаторов описана в [TON Whitepaper](https://docs.ton.org/ton.pdf), главы 2.6.3, 2.6.25.
:::

## See also

- [Running validator node](/v3/guidelines/nodes/running-nodes/validator-node)
- [Nominator pool](/v3/documentation/smart-contracts/contracts-specs/nominator-pool/)
- [Single nominator pool](/v3/documentation/smart-contracts/contracts-specs/single-nominator-pool/) <Feedback />
  <Feedback />

