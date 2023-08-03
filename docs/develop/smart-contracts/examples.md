# Examples of Smart Contracts 

On this page, you can find TON smart contract references implemented for various program software.

:::info
Make sure you have thoroughly tested contracts before using them in a production environment. This is a critical step to ensure the proper functioning and security of your software.
:::

## FunC Smart Contracts

### TON Production used Smart Contracts

| Contracts                                                                                              | Description                                                                                                                                                                 |
|--------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [wallet-contract](https://github.com/ton-blockchain/wallet-contract)                                   | Wallet v4 is proposed version of wallet to replace v3 or older wallets                                                                                                      |
| [governance-contract](https://github.com/ton-blockchain/governance-contract)                           | Core TON Blockchain contracts `elector-code.fc` and `config-code.fc`.                                                                                                       |
| [bridge-func](https://github.com/ton-blockchain/bridge-func)                                           | TON-EVM Toncoin Bridge.                                                                                                                                                     |
| [token-bridge-func](https://github.com/ton-blockchain/token-bridge-func)                               | TON-EVM token bridge - FunC smart contracts.                                                                                                                                |
| [lockup-wallet-contract/universal](https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/universal) | Universal lockup wallet is contract that can store locked and restricted coins.                                                                                             |
| [lockup-wallet-contract/vesting](https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/vesting) | Vesting wallet smart-contract                                                                                                                                               |
| [multisig-contract](https://github.com/ton-blockchain/multisig-contract)                               | `(n, k)`-multisig wallet is a wallet with `n` private keys holders, which accepts requests to send messages if the request collects at least `k` signatures of the holders. |
| [token-contract](https://github.com/ton-blockchain/token-contract)                                     | Fungible, Non-Fungible, Semi-Fungible Tokens Smart Contracts                                                                                                                |
| [dns-contract](https://github.com/ton-blockchain/dns-contract)                                         | Smart contracts of `.ton` zone.                                                                                                                                             |
| [nominator-pool](https://github.com/ton-blockchain/nominator-pool)                                     | Nominator pool smart contract                                                                                                                                               |
| [storage](https://github.com/ton-blockchain/ton/tree/master/storage/storage-daemon/smartcont)          | TON Storage provider and fabric contracts                                                                                                                                   |

### TON Ecosystem Smart Contracts

| Contracts                                                                                                       | Description                                                                                                        |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| [telemint](https://github.com/TelegramMessenger/telemint)                                                       | Telegram Usenames(`nft-item.fc`) and Telegram Numbers(`nft-item-no-dns.fc`) contracts.                             |
| [WTON](https://github.com/TonoxDeFi/WTON)                                                                       | This smart contract provides an implementation of wrapped toncoin, called WTON                                     |
| [capped-fungible-token](https://github.com/TonoxDeFi/capped-fungible-token)                                     | Basic implementation of smart contracts for Jetton wallet and Jetton minter                                        |
| [getgems-io/nft-contracts](https://github.com/getgems-io/nft-contracts/tree/main/packages/contracts/sources)    | Getgems NFT Contracts                                                                                              |
| [lockup-wallet-deployment](https://github.com/ton-defi-org/lockup-wallet-deployment)                            | Deploy and run lockup Contract end to end                                                                          |
| [wton-contract](https://github.com/ton-community/wton-contract)                                                 | wTON contracts                                                                                                     |
| [contract-verifier-contracts](https://github.com/ton-community/contract-verifier-contracts)                     | Sources registry contracts which stores an on-chain proof per code cell hash.                                      |
| [vanity-contract](https://github.com/ton-community/vanity-contract)                                             | Smart contract that allows to "mine" any suitable address for any contract.                                        |
| [ton-config-smc](https://github.com/ton-foundation/ton-config-smc)                                              | Simple contract for storing versioned data in TON Blockchain.                                                      |
| [ratelance](https://github.com/ProgramCrafter/ratelance/tree/main/contracts/func)                               | Ratelance is freelance platform that seeks to remove barriers between potential employers and workers.             |
| [ton-forwarder.fc](https://github.com/TrueCarry/ton-contract-forwarder/blob/main/func/ton-forwarder.fc)         | Contract that accepts exact sum and forwards it to specified address. On wrong amount or subsequent returns money. |
| [logger.fc](https://github.com/tonwhales/ton-contracts/blob/master/contracts/logger.fc)                         | Contract that saves data in the local storage.                                                                     |
| [ton-nominators](https://github.com/tonwhales/ton-nominators)                                                   | Ton Whales Nominator pool source code.                                                                             |
| [ton-link-contract-v3](https://github.com/ton-link/ton-link-contract-v3)                                        | Ton-link allows smart contracts to access data outside of the blockchain while maintaining data security.          |
| [delab-team/fungible-token](https://github.com/delab-team/contracts/tree/main/fungible-token)                   | DeLab TON fungible-token implementation                                                                            |
| [whitelisted-wallet.fc](https://github.com/tonwhales/ton-contracts/blob/master/contracts/whitelisted-wallet.fc) | Simple Whitelisted Wallet Contract                                                                                 |
| [delab-team/jetton-pool](https://github.com/delab-team/contracts/tree/main/jetton-pool)                         | The Jetton Pool TON smart contract is designed to create farm pools.                                               |     |     |
| [ston-fi/contracts](https://github.com/ston-fi/dex-core/tree/main/contracts)                                    | Stonfi DEX core contracts                                                                                          |
| [onda-ton](https://github.com/0xknstntn/onda-ton)                                                               | Onda Lending Pool - Core smart contracts of the first lending protocol on TON                                      |
| [ton-stable-timer](https://github.com/ProgramCrafter/ton-stable-timer)                                          | TON Stable Timer contract                                                                                          |

### Learning Contracts

* [counter.fc](https://github.com/ton-community/blueprint/blob/main/example/contracts/counter.fc)
* [simple-distributor](https://github.com/ton-community/simple-distributor)
* [ping-pong.fc](https://github.com/tonwhales/ton-nft/blob/main/packages/nft/ping-pong/ping-pong.fc)
* [disintar/sale-dapp](https://github.com/disintar/sale-dapp/tree/master/func)
* [ton-random](https://github.com/puppycats/ton-random)
* [TonFunClessons_Eng](https://github.com/romanovichim/TonFunClessons_Eng)
* [Blueprint simple contract](https://github.com/liminalAngel/1-func-project/blob/master/contracts/main.fc)
* [Blueprint jetton_minter.fc](https://github.com/liminalAngel/func-blueprint-tutorial/blob/master/6/contracts/jetton_minter.fc)
* [Simple TON DNS Subdomain manager](https://github.com/Gusarich/simple-subdomain)

### Ton Smart Challenge Solutions

#### Ton Smart Challenge 1
* https://github.com/nns2009/TON-FunC-contest-1/tree/main
* https://github.com/pyAndr3w/func-contest1-solutions
* https://github.com/crazyministr/TonContest-FunC/tree/master/func-contest1

#### Ton Smart Challenge 2
* https://github.com/ton-blockchain/func-contest2-solutions
* https://github.com/nns2009/TON-FunC-contest-2
* https://github.com/crazyministr/TonContest-FunC/tree/master/func-contest2

#### Ton Smart Challenge 3
* https://github.com/nns2009/TON-FunC-contest-3
* https://github.com/shuva10v/func-contest3-solutions
* https://github.com/crazyministr/TonContest-FunC/tree/master/func-contest3

## Fift Smart Contracts

* [CreateState.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/CreateState.fif)
* [asm-to-cpp.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/asm-to-cpp.fif)
* [auto-dns.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/auto-dns.fif)
* [complaint-vote-req.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/complaint-vote-req.fif)
* [complaint-vote-signed.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/complaint-vote-signed.fif)
* [config-proposal-vote-req.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/config-proposal-vote-req.fif)
* [config-proposal-vote-signed.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/config-proposal-vote-signed.fif)
* [create-config-proposal.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/create-config-proposal.fif)
* [create-config-upgrade-proposal.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/create-config-upgrade-proposal.fif)
* [create-elector-upgrade-proposal.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/create-elector-upgrade-proposal.fif)
* [envelope-complaint.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/envelope-complaint.fif)
* [gen-zerostate-test.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/gen-zerostate-test.fif)
* [gen-zerostate.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/gen-zerostate.fif)
* [highload-wallet-v2-one.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet-v2-one.fif)
* [highload-wallet-v2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet-v2.fif)
* [highload-wallet.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet.fif)
* [manual-dns-manage.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/manual-dns-manage.fif)
* [new-auto-dns.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-auto-dns.fif)
* [new-highload-wallet-v2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet-v2.fif)
* [new-highload-wallet.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet.fif)
* [new-manual-dns.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-manual-dns.fif)
* [new-pinger.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-pinger.fif)
* [new-pow-testgiver.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-pow-testgiver.fif)
* [new-restricted-wallet.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-restricted-wallet.fif)
* [new-restricted-wallet2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-restricted-wallet2.fif)
* [new-restricted-wallet3.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-restricted-wallet3.fif)
* [new-testgiver.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-testgiver.fif)
* [new-wallet-v2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet-v2.fif)
* [new-wallet-v3.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet-v3.fif)
* [new-wallet.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet.fif)
* [show-addr.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/show-addr.fif)
* [testgiver.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/testgiver.fif)
* [update-config-smc.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/update-config-smc.fif)
* [update-config.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/update-config.fif)
* [update-elector-smc.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/update-elector-smc.fif)
* [validator-elect-req.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/validator-elect-req.fif)
* [validator-elect-signed.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/validator-elect-signed.fif)
* [wallet-v2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-v2.fif)
* [wallet-v3.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-v3.fif)
* [wallet.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet.fif)
* [wallet-v3-code.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-v3-code.fif)

## Examples of Tests for Smart Contracts  

* [governance_tests](https://github.com/Trinketer22/governance_tests/blob/master/config_tests/tests/)
* [governance_tests](https://github.com/Trinketer22/governance_tests/blob/master/elector_tests/tests/complaint-test.fc)
* [MassSender.spec.ts](https://github.com/Gusarich/ton-mass-sender/blob/main/tests/MassSender.spec.ts)
* [TonForwarder.spec.ts](https://github.com/TrueCarry/ton-contract-forwarder/blob/main/src/contracts/ton-forwarder/TonForwarder.spec.ts)
* [ton-tvm-bus](https://github.com/ton-defi-org/ton-tvm-bus)
* [wTON-contract tests](https://github.com/ton-community/wton-contract/tree/main/tests) 
* [getgems tests](https://github.com/ton-community/nft-sdk/tree/main/sandbox-examples/getgems) 
* [Distributor.spec.ts](https://github.com/ton-community/simple-distributor/blob/main/tests/Distributor.spec.ts)
* [Migration.spec.ts](https://github.com/Gusarich/jetton-migration/blob/main/tests/Migration.spec.ts)
* [SubdomainManager.spec.ts](https://github.com/Gusarich/simple-subdomain/blob/main/tests/SubdomainManager.spec.ts)
* [Token.spec.ts](https://github.com/Gusarich/ton-single-token/blob/main/tests/Token.spec.ts)
* [Scheduler.spec.ts](https://github.com/Gusarich/external-scheduler/blob/master/tests/Scheduler.spec.ts)

## FunC Libraries and Helpers

* https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc
* https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/crypto/elliptic-curves
* https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/math
* https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/messages
* https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/slices
* https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/strings
* https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/tuples
* https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/utils
* https://github.com/disintar/sale-dapp/tree/master/func

## Add Reference

If you want share new example smart contract, make your PR for this [page](https://github.com/ton-community/ton-docs/tree/main/docs/develop/smart-contracts/examples.md).

## See Also

* [Develop Smart Contracts Introduction](/develop/smart-contracts/)
* [How to work with wallet smart contracts](/develop/smart-contracts/tutorials/wallet)
* [[You Tube] Ton Dev Study FunC & BluePrint lessons](https://www.youtube.com/playlist?list=PLyDBPwv9EPsDjIMAF3XqNI2XGNwdcB3sg)

