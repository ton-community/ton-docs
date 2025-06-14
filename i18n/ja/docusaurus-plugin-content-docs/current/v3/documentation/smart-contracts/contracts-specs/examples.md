import Feedback from '@site/src/components/Feedback';

# Examples of smart contracts

このページでは、様々なプログラム・ソフトウェア用に実装されたTONスマート・コントラクトのリファレンスを見つけることができます。

:::info
Make sure you have thoroughly tested contracts before using them in a production environment. This is a critical step to ensure the proper functioning and security of your software.
:::

## FunC smart contracts

### Production-used contracts

| 契約                                                                                                                                                      | 説明                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [wallet-contract](https://github.com/ton-blockchain/wallet-contract) <br /> <small>🪄 Run in WebIDE</small>                                             | ウォレットv4は、v3または古いウォレットを置き換えるために提案されたウォレットのバージョンです。                                              |
| [liquid-staking-contract](https://github.com/ton-blockchain/liquid-staking-contract/) <br /> <small>🪄 Run in WebIDE</small>                            | リキッド・ステーキング（LSt）は、あらゆる口径のTONホルダーとハードウェア・ノード・オペレーターを接続し、資産プーリングを通じてTONブロックチェーンの検証に参加させるプロトコルです。 |
| [modern_jetton](https://github.com/EmelyanenkoK/modern_jetton) <br /> <small>🪄 Run in WebIDE</small>                              | withdraw_tonsとwithdraw_jettonsを追加した標準的なjettonの実装。    |
| [高負荷ウォレット-v3](https://github.com/ton-blockchain/highload-wallet-contract-v3)                                                                            | このウォレットは、暗号取引所など、非常に高いレートでトランザクションを送信する必要がある人のために設計されています。                                     |
| [安定コイン契約](https://github.com/ton-blockchain/stablecoin-contract)                                                                                        | Jetton-with-governanceのFunCスマートコントラクトは、USDtなどのステーブルコインに使用されます。                                 |
| [governance-contract](https://github.com/ton-blockchain/governance-contract) <br /> <small>🪄 Run in WebIDE</small>                                     | TONブロックチェーンのコアコントラクト `elector-code.fc` と `config-code.fc`.                     |
| [bridge-func](https://github.com/ton-blockchain/bridge-func) <br /> <small>🪄 Run in WebIDE</small>                                                     | TON-EVM トンコインブリッジ。                                                                             |
| [token-bridge-func](https://github.com/ton-blockchain/token-bridge-func) <br /> <small>🪄 Run in WebIDE</small>                                         | TON-EVMトークンブリッジ - FunCスマートコントラクト。                                                              |
| [lockup-wallet-contract/universal](https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/universal) <br /> <small>🪄 Run in WebIDE</small> | ユニバーサルロックアップウォレットは、ロックされ制限されたコインを保管することができる契約です。                                               |
| [lockup-wallet-contract/vesting](https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/vesting) <br /> <small>🪄 Run in WebIDE</small>     | ベスティング・ウォレット・スマートコントラクト                                                                        |
| [multisig-contract](https://github.com/ton-blockchain/multisig-contract) <br /> <small>🪄 Run in WebIDE</small>                                         | `(n, k)`-マルチシグウォレットは `n` 個の秘密鍵保有者を持つウォレットであり、少なくとも `k` 個の秘密鍵保有者の署名があればメッセージ送信のリクエストを受け付けます。    |
| [token-contract](https://github.com/ton-blockchain/token-contract) <br /> <small>🪄 Run in WebIDE</small>                                               | Fungible, Non-Fungible, Semi-Fungible Tokens Smart Contracts                                   |
| [dns-contract](https://github.com/ton-blockchain/dns-contract) <br /> <small>🪄 Run in WebIDE</small>                                                   | `.ton`ゾーンのスマートコントラクト                                                                           |
| [nominator-pool](https://github.com/ton-blockchain/nominator-pool) <br /> <small>🪄 Run in WebIDE</small>                                               | ノミネーター・プールのスマート・コントラクト                                                                         |
| [single-nominator-pool](https://github.com/orbs-network/single-nominator) <br /> <small>🪄 Run in WebIDE</small>                                        | 単一指名者プール・スマートコントラクト                                                                            |
| [vesting-contract](https://github.com/ton-blockchain/vesting-contract) <br /> <small>🪄 Run in WebIDE</small>                                           | 権利確定契約では、一定量のトンコインを一定期間ロックし、徐々にロックを解除することができます。                                                |
| [storage](https://github.com/ton-blockchain/ton/tree/master/storage/storage-daemon/smartcont) <br /> <small>🪄 Run in WebIDE</small>                    | TON ストレージ・プロバイダとファブリックコントラクト                                                                   |

### Ecosystem contracts

| 契約                                                                                                                                                                     | 説明                                                                                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [telemint](https://github.com/TelegramMessenger/telemint) <br /> <small>🪄 Run in WebIDE</small>                                                                       | Telegram Usenames(`nft-item.fc`)とTelegram Numbers(`nft-item-no-dns.fc`)の契約                                                |
| [capped-fungible-token](https://github.com/TonoxDeFi/capped-fungible-token) <br /> <small>🪄 Run in WebIDE</small>                                                     | Jetton WalletとJetton Minterのスマートコントラクトの基本実装                                                                                                                     |
| [グサリッチ・エアドロップ](https://github.com/Gusarich/airdrop/tree/main/contracts)                                                                                                | TONブロックチェーン用のスケーラブルなエアドロップシステムの実装。ジェトンをオンチェーンで任意の数のウォレットに配布するために使用できます。 It can be used to distribute Jettons on-chain to any number of wallets. |
| [getgems-io/nft-contracts](https://github.com/getgems-io/nft-contracts/tree/main/packages/contracts/sources) <br /> <small>🪄 Run in WebIDE</small>                    | ゲッツジェムズNFT契約                                                                                                                                                    |
| [lockup-wallet-deployment](https://github.com/ton-defi-org/lockup-wallet-deployment) <br /> <small>🪄 Run in WebIDE</small>                                            | ロックアップ・コントラクトをエンド・トゥ・エンドで展開・実行する                                                                                                                                |
| [WTON](https://github.com/TonoxDeFi/WTON) <br /> <small>🪄 Run in WebIDE</small>                                                                                       | このスマートコントラクトは、WTONと呼ばれるラップトンコインの実装を提供します。                                                                                                                       |
| [wton-contract](https://github.com/ton-community/wton-contract) <br /> <small>🪄 Run in WebIDE</small>                                                                 | WTON契約                                                                                                                                                          |
| [contract-verifier-contracts](https://github.com/ton-community/contract-verifier-contracts) <br /> <small>🪄 Run in WebIDE</small>                                     | ソース・レジストリ・コントラクトは、コード・セル・ハッシュごとにオンチェーン証明を格納します。                                                                                                                 |
| [vanity-contract](https://github.com/ton-community/vanity-contract) <br /> <small>🪄 Run in WebIDE</small>                                                             | Smart contract that allows to "mine" any suitable address for any contract.                                                                     |
| [ton-config-smc](https://github.com/ton-foundation/ton-config-smc) <br /> <small>🪄 Run in WebIDE</small>                                                              | バージョン管理されたデータをTONブロックチェーンに保存するためのシンプルな契約                                                                                                                        |
| [ratelance](https://github.com/ProgramCrafter/ratelance/tree/main/contracts/func) <br /> <small>🪄 Run in WebIDE</small>                                               | Ratelanceは、潜在的な雇用者と労働者の間の障壁を取り除こうとするフリーランスのプラットフォームです。                                                                                                          |
| [logger.fc](https://github.com/tonwhales/ton-contracts/blob/master/contracts/logger.fc) <br /> <small>🪄 Run in WebIDE</small>                         | ローカル・ストレージにデータを保存するコントラクト                                                                                                                                       |
| [ton-nominators](https://github.com/tonwhales/ton-nominators) <br /> <small>🪄 Run in WebIDE</small>                                                                   | トンクジラ指名プールのソースコード。                                                                                                                                              |
| [ton-link-contract-v3](https://github.com/ton-link/ton-link-contract-v3) <br /> <small>🪄 Run in WebIDE</small>                                                        | Ton-linkによって、スマートコントラクトはデータのセキュリティを維持しながら、ブロックチェーン外のデータにアクセスできるようになる。                                                                                           |
| [delab-team/fungible-token](https://github.com/delab-team/contracts/tree/main/fungible-token) <br /> <small>🪄 Run in WebIDE</small>                                   | DeLab TON ファンジブル・トークンの実装                                                                                                                                        |
| [whitelisted-wallet.fc](https://github.com/tonwhales/ton-contracts/blob/master/contracts/whitelisted-wallet.fc) <br /> <small>🪄 Run in WebIDE</small> | シンプル・ホワイトリスト・ウォレットコントラクト                                                                                                                                        |
| [delab-team/jetton-pool](https://github.com/delab-team/contracts/tree/main/jetton-pool) <br /> <small>🪄 Run in WebIDE</small>                                         | Jetton Pool TONスマートコントラクトは、農業プールを作るために設計されています。                                                                                                                 |
| [ston-fi/contracts](https://github.com/ston-fi/dex-core/tree/main/contracts) <br /> <small>🪄 Run in WebIDE</small>                                                    | ストンフィDEXコアコントラクト                                                                                                                                                |
| [onda-ton](https://github.com/0xknstntn/onda-ton) <br /> <small>🪄 Run in WebIDE</small>                                                                               | Onda Lending Pool - TON初の貸出プロトコルのコアスマートコントラクト                                                                                                                   |
| [ton-stable-timer](https://github.com/ProgramCrafter/ton-stable-timer) <br /> <small>🪄 Run in WebIDE</small>                                                          | TON Stable Timer contract                                                                                                                                       |
| [HipoFinance/contract](https://github.com/HipoFinance/contract) <br /> <small>🪄 Run in WebIDE</small>                                                                 | hTONは、TONブロックチェーン上の分散型、パーミッションレス、オープンソースのリキッドステーキングプロトコルです。                                                                                                     |

### Learning contracts

| 契約                                                                                                                                                                                                         | 説明                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| [counter.fc](https://github.com/ton-community/blueprint/blob/main/example/contracts/counter.fc) <br /> <small>🪄 Run in WebIDE</small>                                                     | スマート・コントラクトにコメントで対抗                 |
| [simple-distributor](https://github.com/ton-community/simple-distributor) <br /> <small>🪄 Run in WebIDE</small>                                                                                           | シンプルなTONディストリビューター                  |
| [ping-pong.fc](https://github.com/tonwhales/ton-nft/blob/main/packages/nft/ping-pong/ping-pong.fc) <br /> <small>🪄 Run in WebIDE</small>                                                  | 様々なモードでToncoinを送信するテスト用のシンプルなコントラクト |
| [ton-random](https://github.com/puppycats/ton-random) <br /> <small>🪄 Run in WebIDE</small>                                                                                                               | オンチェーンでの乱数生成に役立つ2つのコントラクト           |
| [Blueprint simple contract](https://github.com/liminalAngel/1-func-project/blob/master/contracts/main.fc) <br /> <small>🪄 Run in WebIDE</small>                                                           | スマート・コントラクトの例                       |
| [Blueprint jetton_minter.fc](https://github.com/liminalAngel/func-blueprint-tutorial/blob/master/6/contracts/jetton_minter.fc) <br /> <small>🪄 Run in WebIDE</small> | ジェトンをオンチェーンで鋳造するスマート・コントラクトの例       |
| [Simple TON DNS Subdomain manager](https://github.com/Gusarich/simple-subdomain) <br /> <small>🪄 Run in WebIDE</small>                                                                                    | TON DNSサブドメインマネージャー                 |
| [disintar/sale-dapp](https://github.com/disintar/sale-dapp/tree/master/func) <br /> <small>🪄 Run in WebIDE</small>                                                                                        | React + FunCによるNFTセールDApp           |

### TON smart challenges

#### TONスマートチャレンジ1

- https://github.com/nns2009/TON-FunC-contest-1/tree/main
- https://github.com/pyAndr3w/func-contest1-solutions
- https://github.com/crazyministr/TonContest-FunC/tree/master/func-contest1

#### TONスマートチャレンジ2

- https://github.com/ton-blockchain/func-contest2-solutions
- https://github.com/nns2009/TON-FunC-contest-2
- https://github.com/crazyministr/TonContest-FunC/tree/master/func-contest2

#### TONスマートチャレンジ3

- https://github.com/nns2009/TON-FunC-contest-3
- https://github.com/shuva10v/func-contest3-solutions
- https://github.com/crazyministr/TonContest-FunC/tree/master/func-contest3

#### TONスマートチャレンジ4

- https://github.com/akifoq/tsc4（TOP最適化）
- https://github.com/Gusarich/tsc4
- https://github.com/Skydev0h/tsc4
- https://github.com/aSpite/tsc4-contracts（Funcソリューション）
- [https://github.com/ProgramCrafter/tsc4](https://github.com/ProgramCrafter/tsc4/tree/c1616e12d1b449b01fdcb787a3aa8442e671371e/contracts) (Funcソリューション)

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

新しいスマートコントラクトの例を共有したい場合は、この[ページ](https://github.com/ton-community/ton-docs/tree/main/docs/v3/documentation/smart-contracts/contracts-specs/examples.md)にPRしてください。

## See also

- [スマートコントラクト入門の開発](/v3/documentation/smart-contracts/overview)
- [ウォレットスマートコントラクトを機能させる方法](/v3/guidelines/smart-contracts/howto/wallet)
- [[ユーチューブ] Ton Dev Study FunC & BluePrint レッスン](https://www.youtube.com/watch?v=7omBDfSqGfA\\&list=PLtUBO1QNEKwtO_zSyLj-axPzc9O9rkmYa)

<Feedback />

