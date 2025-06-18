import Feedback from '@site/src/components/Feedback';

# Staking with nominator pools

## Overview

С помощью смарт-контрактов TON вы можете реализовать любые механики стейкинга и депозитов, которые вам нужны.

However, there is native staking in TON Blockchain - you can lend Toncoin to validators for staking and share the reward for validation.

Тот, кто предоставляет средства валидатору, называется **номинатором**.

Смарт-контракт, называемый [**номинатор-пул**](/v3/documentation/smart-contracts/contracts-specs/nominator-pool), предоставляет возможность одному или нескольким номинаторам выдавать Toncoin валидатору для стейкинга и гарантирует, что валидатор сможет использовать эти Toncoin только для подтверждения транзакций. Смарт-контракт также обеспечивает распределение вознаграждений.

Если Вы знакомы с криптовалютами, то наверняка слышали о **валидаторах** и **номинаторах**. Теперь пришло время выяснить, кто они такие – два основных действующих лица, управляющих блокчейном.

## Validator

Валидатор - это сетевой узел, который помогает поддерживать работу блокчейна, проверяя (или валидируя) предлагаемые блоки и записывая их в блокчейн.

Чтобы стать валидатором, вы должны соответствовать двум требованиям: иметь высокопроизводительный сервер и иметь серьезную сумму в TON (600 000), чтобы положить ее в стейк. На момент написания статьи на TON было 227 валидаторов.

## Номинаторы

:::info
New version of [nominator pool](/v3/documentation/smart-contracts/contracts-specs/nominator-pool/) available, read more in the [Single nominator pool](/v3/documentation/smart-contracts/contracts-specs/single-nominator-pool/) and [Vesting contract](/v3/documentation/smart-contracts/contracts-specs/vesting-contract/) pages.
:::

Конечно, не каждый может позволить себе иметь на балансе 100 000 Toncoin - вот тут-то и вступают в игру номинаторы. Проще говоря, номинатор - это пользователь, который одалживает свои TON валидаторам. Каждый раз, когда валидатор зарабатывает вознаграждение за подтверждение блоков, оно распределяется между участниками.

Некоторое время назад компания Ton Whales запустила первый стейкинг-пул на TON с минимальным депозитом в 50 TON. Позже TON Foundation представил первый открытый номинатор-пул. Теперь пользователи могут стейкать Toncoin полностью децентрализованно, начиная с **10 000 TON**.

_Из [сообщения TON Community RUS](https://t.me/toncoin_rus/362)._

На балансе пула всегда должно быть **10 TON** - это минимальный баланс для оплаты сетевого хранения.

## Стоимость в месяц

Так как раунд валидации длится примерно ~18 часов, на каждый раунд требуется около **5 TON**, а один номинатор-пул участвует в четных и нечетных раундах валидации, то для работы пула потребуется примерно **~105 TON в месяц**.

## Как принять участие?

- [Список номинатор-пулов TON](https://tonvalidators.org/)

## Исходный код

- [Исходный код смарт-контракта Номинатор-пул](https://github.com/ton-blockchain/nominator-pool)

:::info
Теория номинаторов описана в [TON Whitepaper](https://docs.ton.org/ton.pdf), главы 2.6.3, 2.6.25.
:::

## See also

- [Running validator node](/v3/guidelines/nodes/running-nodes/validator-node)
- [Nominator pool](/v3/documentation/smart-contracts/contracts-specs/nominator-pool/)
- [Single nominator pool](/v3/documentation/smart-contracts/contracts-specs/single-nominator-pool/)
  <Feedback />

