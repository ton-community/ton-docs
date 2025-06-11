import Feedback from '@site/src/components/Feedback';

# Examples of smart contracts

На этой странице вы можете найти ссылки на смарт-контракты TON, реализованные для различного программного обеспечения.

:::info
Убедитесь, что вы тщательно протестировали контракты перед их использованием в производственной среде. Это критически важный шаг для обеспечения надлежащего функционирования и безопасности вашего программного обеспечения.
:::

## FunC smart contracts

### Production-used contracts

| Контракты                                                                                                                                               | Описание                                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [wallet-contract](https://github.com/ton-blockchain/wallet-contract) <br /> <small>🪄 Run in WebIDE</small>                                             | Wallet v4 — это предлагаемая версия кошелька для замены v3 или более старых кошельков                                                                                                                                       |
| [liquid-staking-contract](https://github.com/ton-blockchain/liquid-staking-contract/) <br /> <small>🪄 Run in WebIDE</small>                            | Liquid Staking (LSt) — это протокол, который связывает держателей TON всех уровней с операторами аппаратных узлов для участия в валидации блокчейна TON посредством объединения активов. |
| [modern_jetton](https://github.com/EmelyanenkoK/modern_jetton) <br /> <small>🪄 Run in WebIDE</small>                              | Реализация стандартного жетона с дополнительными withdraw_tons и withdraw_jettons.                                                                                |
| [highloadwallet-v3](https://github.com/ton-blockchain/highload-wallet-contract-v3)                                                                      | Этот кошелек предназначен для тех, кому необходимо отправлять транзакции на очень высоких скоростях, например, на криптовалютных биржах.                                                                    |
| [stablecoin-contract](https://github.com/ton-blockchain/stablecoin-contract)                                                                            | Смарт-контракты жетона с функцией управления, используемые для стейблкоинов, таких как USDt.                                                                                                                |
| [governance-contract](https://github.com/ton-blockchain/governance-contract) <br /> <small>🪄 Run in WebIDE</small>                                     | Основные контракты блокчейна TON `elector-code.fc` и `config-code.fc`.                                                                                                                                      |
| [bridge-func](https://github.com/ton-blockchain/bridge-func) <br /> <small>🪄 Run in WebIDE</small>                                                     | Мост Toncoin TON-EVM.                                                                                                                                                                                       |
| [token-bridge-func](https://github.com/ton-blockchain/token-bridge-func) <br /> <small>🪄 Run in WebIDE</small>                                         | Мост токена TON-EVM - смарт-контракты FunC.                                                                                                                                                                 |
| [lockup-wallet-contract/universal](https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/universal) <br /> <small>🪄 Run in WebIDE</small> | Универсальный кошелек с блокировкой - это контракт, который может хранить монеты с блокировкой и ограничениями.                                                                                             |
| [lockup-wallet-contract/vesting](https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/vesting) <br /> <small>🪄 Run in WebIDE</small>     | Смарт-контракт кошелька для вестинга                                                                                                                                                                                        |
| [multisig-contract](https://github.com/ton-blockchain/multisig-contract) <br /> <small>🪄 Run in WebIDE</small>                                         | `(n, k)`-мультиподписной кошелек - это кошелек с `n` держателями закрытых ключей, который принимает запросы на отправку сообщений, если запрос собирает не менее `k` подписей держателей.                   |
| [token-contract](https://github.com/ton-blockchain/token-contract) <br /> <small>🪄 Run in WebIDE</small>                                               | Смарт-контракты взаимозаменяемых, невзаимозаменяемых и полувзаимозаменяемых токенов                                                                                                                                         |
| [dns-contract](https://github.com/ton-blockchain/dns-contract) <br /> <small>🪄 Run in WebIDE</small>                                                   | Смарт-контракты доменной зоны `.ton`.                                                                                                                                                                       |
| [nominator-pool](https://github.com/ton-blockchain/nominator-pool) <br /> <small>🪄 Run in WebIDE</small>                                               | Смарт-контракт пула номинаторов                                                                                                                                                                                             |
| [single-nominator-pool](https://github.com/orbs-network/single-nominator) <br /> <small>🪄 Run in WebIDE</small>                                        | Смарт-контракт Единый пул номинаторов                                                                                                                                                                                       |
| [vesting-contract](https://github.com/ton-blockchain/vesting-contract) <br /> <small>🪄 Run in WebIDE</small>                                           | Контракт Вестинга позволяет вам заблокировать определенное количество Toncoin на указанное время и постепенно разблокировать их.                                                                            |
| [storage](https://github.com/ton-blockchain/ton/tree/master/storage/storage-daemon/smartcont) <br /> <small>🪄 Run in WebIDE</small>                    | Поставщик услуг хранения данных TON и контракты структуры                                                                                                                                                                   |

### Ecosystem contracts

| Контракты                                                                                                                                                              | Описание                                                                                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [telemint](https://github.com/TelegramMessenger/telemint) <br /> <small>🪄 Run in WebIDE</small>                                                                       | Контракты на имена пользователей Telegram (`nft-item.fc`) и номера Telegram (`nft-item-no-dns.fc`).                                  |
| [capped-fungible-token](https://github.com/TonoxDeFi/capped-fungible-token) <br /> <small>🪄 Run in WebIDE</small>                                                     | Базовая реализация смарт-контрактов для кошелька жетонов и минтера жетонов                                                                                                                 |
| [gusarich-airdrop](https://github.com/Gusarich/airdrop/tree/main/contracts)                                                                                            | Реализация масштабируемой системы эирдропов для блокчейна TON. Она может использоваться для распределения жетонов в цепочке на любое количество кошельков. |
| [getgems-io/nft-contracts](https://github.com/getgems-io/nft-contracts/tree/main/packages/contracts/sources) <br /> <small>🪄 Run in WebIDE</small>                    | Контракты Getgems NFT                                                                                                                                                                      |
| [lockup-wallet-deployment](https://github.com/ton-defi-org/lockup-wallet-deployment) <br /> <small>🪄 Run in WebIDE</small>                                            | Развертывание и выполнение контракта блокировки от начала до конца                                                                                                                         |
| [WTON](https://github.com/TonoxDeFi/WTON) <br /> <small>🪄 Run in WebIDE</small>                                                                                       | Этот смарт-контракт обеспечивает реализацию обернутого Toncoin, называемого WTON.                                                                                          |
| [wton-contract](https://github.com/ton-community/wton-contract) <br /> <small>🪄 Run in WebIDE</small>                                                                 | контракты wTON                                                                                                                                                                             |
| [contract-verifier-contracts](https://github.com/ton-community/contract-verifier-contracts) <br /> <small>🪄 Run in WebIDE</small>                                     | Контракты реестра источников, в которых хранится доказательство on-chain для каждого хэша ячейки кода.                                                                     |
| [vanity-contract](https://github.com/ton-community/vanity-contract) <br /> <small>🪄 Run in WebIDE</small>                                                             | Смарт-контракт, который позволяет "майнить" любой подходящий адрес для любого контракта.                                                                                   |
| [ton-config-smc](https://github.com/ton-foundation/ton-config-smc) <br /> <small>🪄 Run in WebIDE</small>                                                              | Простой контракт для хранения версионных данных в блокчейне TON.                                                                                                           |
| [ratelance](https://github.com/ProgramCrafter/ratelance/tree/main/contracts/func) <br /> <small>🪄 Run in WebIDE</small>                                               | Ratelance — это фриланс-платформа, которая стремится устранить барьеры между потенциальными работодателями и работниками.                                                  |
| [logger.fc](https://github.com/tonwhales/ton-contracts/blob/master/contracts/logger.fc) <br /> <small>🪄 Run in WebIDE</small>                         | Контракт, сохраняющий данные в локальном хранилище.                                                                                                                        |
| [ton-nominators](https://github.com/tonwhales/ton-nominators) <br /> <small>🪄 Run in WebIDE</small>                                                                   | Исходный код пула номинаторов Ton Whales.                                                                                                                                  |
| [ton-link-contract-v3](https://github.com/ton-link/ton-link-contract-v3) <br /> <small>🪄 Run in WebIDE</small>                                                        | Ton-link позволяет смарт-контрактам получать доступ к данным за пределами блокчейна, сохраняя при этом безопасность данных.                                                |
| [delab-team/fungible-token](https://github.com/delab-team/contracts/tree/main/fungible-token) <br /> <small>🪄 Run in WebIDE</small>                                   | Реализация взаимозаменяемого токена DeLab TON                                                                                                                                              |
| [whitelisted-wallet.fc](https://github.com/tonwhales/ton-contracts/blob/master/contracts/whitelisted-wallet.fc) <br /> <small>🪄 Run in WebIDE</small> | Простой контракт с белым списком кошельков                                                                                                                                                 |
| [delab-team/jetton-pool](https://github.com/delab-team/contracts/tree/main/jetton-pool) <br /> <small>🪄 Run in WebIDE</small>                                         | Смарт-контракт жетона PoolTON предназначен для создания фагминг пулов.                                                                                                     |
| [ston-fi/contracts](https://github.com/ston-fi/dex-core/tree/main/contracts) <br /> <small>🪄 Run in WebIDE</small>                                                    | Основные контракты Stonfi DEX                                                                                                                                                              |
| [onda-ton](https://github.com/0xknstntn/onda-ton) <br /> <small>🪄 Run in WebIDE</small>                                                                               | Onda Lending Pool — основные смарт-контракты первого кредитного протокола на TON                                                                                                           |
| [ton-stable-timer](https://github.com/ProgramCrafter/ton-stable-timer) <br /> <small>🪄 Run in WebIDE</small>                                                          | Контракт TON Стабильный таймер                                                                                                                                                             |
| [HipoFinance/contract](https://github.com/HipoFinance/contract) <br /> <small>🪄 Run in WebIDE</small>                                                                 | hTON — это децентрализованный, не требующий разрешений, открытый протокол ликвидного стейкинга на блокчейне TON                                                                            |

### Learning contracts

| Контракты                                                                                                                                                                                                  | Описание                                                                                |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [counter.fc](https://github.com/ton-community/blueprint/blob/main/example/contracts/counter.fc) <br /> <small>🪄 Run in WebIDE</small>                                                     | Смарт-контракт счетчика с комментариями.                                |
| [simple-distributor](https://github.com/ton-community/simple-distributor) <br /> <small>🪄 Run in WebIDE</small>                                                                                           | Простое распределение TON.                                              |
| [ping-pong.fc](https://github.com/tonwhales/ton-nft/blob/main/packages/nft/ping-pong/ping-pong.fc) <br /> <small>🪄 Run in WebIDE</small>                                                  | Простой контракт для тестирования отправки Toncoin в разных режимах.    |
| [ton-random](https://github.com/puppycats/ton-random) <br /> <small>🪄 Run in WebIDE</small>                                                                                                               | Два контракта, которые помогут вам генерировать случайные числа в сети. |
| [Blueprint simple contract](https://github.com/liminalAngel/1-func-project/blob/master/contracts/main.fc) <br /> <small>🪄 Run in WebIDE</small>                                                           | Пример смарт-контракта                                                                  |
| [Blueprint jetton_minter.fc](https://github.com/liminalAngel/func-blueprint-tutorial/blob/master/6/contracts/jetton_minter.fc) <br /> <small>🪄 Run in WebIDE</small> | Smart contract example to mint Jettons on-chain.                        |
| [Simple TON DNS Subdomain manager](https://github.com/Gusarich/simple-subdomain) <br /> <small>🪄 Run in WebIDE</small>                                                                                    | Менеджер поддоменов DNS TON.                                            |
| [disintar/sale-dapp](https://github.com/disintar/sale-dapp/tree/master/func) <br /> <small>🪄 Run in WebIDE</small>                                                                                        | DApp приложение React + NFT для продажи с FunC                                          |

### TON smart challenges

#### Умные задачи TON 1

- https://github.com/nns2009/TON-FunC-contest-1/tree/main
- https://github.com/pyAndr3w/func-contest1-solutions
- https://github.com/crazyministr/TonContest-FunC/tree/master/func-contest1

#### Умные задачи TON 2

- https://github.com/ton-blockchain/func-contest2-solutions
- https://github.com/nns2009/TON-FunC-contest-2
- https://github.com/crazyministr/TonContest-FunC/tree/master/func-contest2

#### Умные задачи TON 3

- https://github.com/nns2009/TON-FunC-contest-3
- https://github.com/shuva10v/func-contest3-solutions
- https://github.com/crazyministr/TonContest-FunC/tree/master/func-contest3

#### Умные задачи TON 4

- https://github.com/akifoq/tsc4 (TOP оптимизирован)
- https://github.com/Gusarich/tsc4
- https://github.com/Skydev0h/tsc4
- https://github.com/aSpite/tsc4-contracts (решение FunC)
- [https://github.com/ProgramCrafter/tsc4](https://github.com/ProgramCrafter/tsc4/tree/c1616e12d1b449b01fdcb787a3aa8442e671371e/contracts) (решение FunC)

## Fift smart contracts

- [CreateState.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/CreateState.fif)
- [asm-to-cpp.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/asm-to-cpp.fif)
- [auto-dns.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/auto-dns.fif)
- [complaint-vote-req.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/complaint-vote-req.fif)
- [complaint-vote-signed.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/complaint-vote-signed.fif)
- [config-proposal-vote-req.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/config-proposal-vote-req.fif)
- [config-proposal-vote-signed.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/config-proposal-vote-signed.fif)
- [create-config-proposal.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/create-config-proposal.fif)
- [create-config-upgrade-proposal.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/create-config-upgrade-proposal.fif)
- [create-elector-upgrade-proposal.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/create-elector-upgrade-proposal.fif)
- [envelope-complaint.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/envelope-complaint.fif)
- [gen-zerostate-test.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/gen-zerostate-test.fif)
- [gen-zerostate.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/gen-zerostate.fif)
- [highload-wallet-v2-one.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet-v2-one.fif)
- [highload-wallet-v2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet-v2.fif)
- [highload-wallet.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet.fif)
- [manual-dns-manage.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/manual-dns-manage.fif)
- [new-auto-dns.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-auto-dns.fif)
- [new-highload-wallet-v2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet-v2.fif)
- [new-highload-wallet.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet.fif)
- [new-manual-dns.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-manual-dns.fif)
- [new-pinger.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-pinger.fif)
- [new-pow-testgiver.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-pow-testgiver.fif)
- [new-restricted-wallet.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-restricted-wallet.fif)
- [new-restricted-wallet2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-restricted-wallet2.fif)
- [new-restricted-wallet3.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-restricted-wallet3.fif)
- [new-testgiver.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-testgiver.fif)
- [new-wallet-v2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet-v2.fif)
- [new-wallet-v3.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet-v3.fif)
- [new-wallet.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet.fif)
- [show-addr.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/show-addr.fif)
- [testgiver.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/testgiver.fif)
- [update-config-smc.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/update-config-smc.fif)
- [update-config.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/update-config.fif)
- [update-elector-smc.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/update-elector-smc.fif)
- [validator-elect-req.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/validator-elect-req.fif)
- [validator-elect-signed.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/validator-elect-signed.fif)
- [wallet-v2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-v2.fif)
- [wallet-v3.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-v3.fif)
- [wallet.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet.fif)
- [wallet-v3-code.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-v3-code.fif)

## FunC libraries and helpers

- https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc
- https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/crypto/elliptic-curves
- https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/math
- https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/messages
- https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/slices
- https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/strings
- https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/tuples
- https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/utils
- https://github.com/disintar/sale-dapp/tree/master/func

## Add reference

Если вы хотите поделиться новым примером смарт-контракта, создайте PR для этой [страницы](https://github.com/ton-community/ton-docs/tree/main/docs/v3/documentation/smart-contracts/contracts-specs/examples.md).

## See also

- [Введение в разработку смарт-контрактов](/v3/documentation/smart-contracts/overview)
- [Как работать со смарт-контрактами кошелька](/v3/guidelines/smart-contracts/howto/wallet)
- [[You Tube] Ton Dev Study FunC и уроки BluePrint](https://www.youtube.com/watch?v=7omBDfSqGfA\\\&list=PLtUBO1QNEKwtO_zSyLj-axPzc9O9rkmYa)

<Feedback />

