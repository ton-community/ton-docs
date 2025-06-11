import Feedback from '@site/src/components/Feedback';

# Staking with nominator pools

## 개요

TON 스마트 컨트랙트를 사용하면 원하는 모든 스테이킹 및 예치 방식을 구현할 수 있습니다.

However, there is native staking in TON Blockchain - you can lend Toncoin to validators for staking and share the reward for validation.

검증자에게 빌려주는 사람을 **지명자**라고 합니다.

A smart contract, called a [**nominator pool**](/v3/documentation/smart-contracts/contracts-specs/nominator-pool), provides the ability for one or more nominators to lend Toncoin in a validator stake, and ensures that the validator can use that Toncoin only for validation. This smart contract guarantees the distribution of the reward.

If you are familiar with cryptocurrencies, you must have heard about **validators** and **nominators**. Now, the time has come to find out what they are — the two major actors ruling the blockchain.

## Validator

A validator is a network node that helps keep the blockchain running by verifying (or validating) suggested blocks and recording them on the blockchain.

To become a validator, you must meet two requirements: have a high-performance server and obtain at least 300,000 Toncoins, in order to make a stake. At the time of writing, there are up to 400 validators per round on TON.

## Nominator

:::info
New version of [nominator pool](/v3/documentation/smart-contracts/contracts-specs/nominator-pool/) available, read more in the [Single nominator pool](/v3/documentation/smart-contracts/contracts-specs/single-nominator-pool/) and [Vesting contract](/v3/documentation/smart-contracts/contracts-specs/vesting-contract/) pages.
:::

모든 사람이 수십만 Toncoin을 보유할 여유가 없다는 것은 분명합니다 - 여기서 지명자가 등장합니다. 간단히 말해서, 지명자는 자신의 TON을 검증자에게 빌려주는 사용자입니다. 검증자가 블록을 검증하여 보상을 얻을 때마다 이는 참여자들 사이에 분배됩니다.

TON Whales pool allows a minimum deposit of 50 TON. TON Foundation open nominator pool allows users to stake Toncoin in a fully decentralized way, starting with **10,000 TON**.

_[TON Community 게시물](https://t.me/toncoin/543)에서 발췌._

네트워크 저장 수수료를 위한 최소 잔액인 **10 TON**이 항상 풀 잔액에 있어야 합니다.

## 월 비용

Since validation round lasts ~18 hours, takes about 5 TON per validation round and 1 nominator pool takes part in even and odd validation rounds it will take **~105 TON per month** to operate the pool.

## 참여 방법

- [TON 지명자 풀 목록](https://tonvalidators.org/)

## 소스 코드

- [Nominator pool smart contract source code](https://github.com/ton-blockchain/nominator-pool)

:::info
지명자 이론은 [TON 백서](https://docs.ton.org/ton.pdf)의 2.6.3, 2.6.25 장에서 설명됩니다.
:::

## See also

- [Running validator node](/v3/guidelines/nodes/running-nodes/validator-node)
- [Nominator pool](/v3/documentation/smart-contracts/contracts-specs/nominator-pool/)
- [Single nominator pool](/v3/documentation/smart-contracts/contracts-specs/single-nominator-pool/) <Feedback />
  <Feedback />

