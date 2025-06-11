import Feedback from '@site/src/components/Feedback';

# Examples of smart contracts

در این صفحه می‌توانید منابعی برای قرارداد‌های هوشمند TON که برای نرم‌افزار‌های مختلف برنامه‌ریزی شده‌اند را پیدا کنید.

:::info
Make sure you have thoroughly tested contracts before using them in a production environment. This is a critical step to ensure the proper functioning and security of your software.
:::

## FunC smart contracts

### Production-used contracts

| قراردادها                                                                                                                                               | توضیحات                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [wallet-contract](https://github.com/ton-blockchain/wallet-contract) <br /> <small>🪄 Run in WebIDE</small>                                             | کیف پول v4 نسخه پیشنهادی از کیف پول است که به جای v3 یا کیف‌های قدیمی‌تر استفاده شود                                                                                                                                |
| [liquid-staking-contract](https://github.com/ton-blockchain/liquid-staking-contract/) <br /> <small>🪄 Run in WebIDE</small>                            | Liquid Staking (LSt) یک پروتکل است که دارندگان TON از تمامی سطوح را با اپراتورهای سخت‌افزاری گره متصل می‌کند تا از طریق استخری از دارایی‌ها در اعتبارسنجی بلاکچین TON شرکت کنند. |
| [modern_jetton](https://github.com/EmelyanenkoK/modern_jetton) <br /> <small>🪄 Run in WebIDE</small>                              | پیاده‌سازی جتتون استاندارد با ویژگی‌های اضافی withdraw_tons و withdraw_jettons.                                                                           |
| [highloadwallet-v3](https://github.com/ton-blockchain/highload-wallet-contract-v3)                                                                      | این کیف پول برای کسانی طراحی شده است که نیاز به ارسال تراکنش‌ها با نرخ‌های بسیار بالا دارند، مانند مبادله‌های رمزنگاری.                                                                             |
| [stablecoin-contract](https://github.com/ton-blockchain/stablecoin-contract)                                                                            | کنتراکت‌های هوشمند FunC با جتتون و دولت، که برای استیبل‌کوین‌هایی مانند USDt استفاده می‌شوند.                                                                                                       |
| [governance-contract](https://github.com/ton-blockchain/governance-contract) <br /> <small>🪄 Run in WebIDE</small>                                     | قراردادهای اصلی TON Blockchain `elector-code.fc` و `config-code.fc`.                                                                                                                                |
| [bridge-func](https://github.com/ton-blockchain/bridge-func) <br /> <small>🪄 Run in WebIDE</small>                                                     | پل تون‌کوین TON-EVM.                                                                                                                                                                                |
| [token-bridge-func](https://github.com/ton-blockchain/token-bridge-func) <br /> <small>🪄 Run in WebIDE</small>                                         | پل توکن همچنان TON-EVM - قراردادهای هوشمند FunC.                                                                                                                                                    |
| [lockup-wallet-contract/universal](https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/universal) <br /> <small>🪄 Run in WebIDE</small> | کیف پول قفل جهانی یک قرارداد است که می‌تواند سکه‌های قفل شده و محدود را ذخیره کند.                                                                                                                  |
| [lockup-wallet-contract/vesting](https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/vesting) <br /> <small>🪄 Run in WebIDE</small>     | قرارداد هوشمند کیف پول اعطای وکالت                                                                                                                                                                                  |
| [multisig-contract](https://github.com/ton-blockchain/multisig-contract) <br /> <small>🪄 Run in WebIDE</small>                                         | کیف پول چند امضایی `(n, k)` وبکیف پول چند مالک با `n` کلید خصوصی است که تنها زمانی که درخواست حداقل `k` امضا از صاحبان کلید‌ها را دارد، درخواست ارسال پیام‌ها را قبول می‌کند.                       |
| [token-contract](https://github.com/ton-blockchain/token-contract) <br /> <small>🪄 Run in WebIDE</small>                                               | قراردادهای هوشمند توکن‌های قابل تعویض، غیر قابل تعویض و نیمه‌قابل تعویض                                                                                                                                             |
| [dns-contract](https://github.com/ton-blockchain/dns-contract) <br /> <small>🪄 Run in WebIDE</small>                                                   | قرارداد‌های هوشمند منطقه `.ton`.                                                                                                                                                                    |
| [nominator-pool](https://github.com/ton-blockchain/nominator-pool) <br /> <small>🪄 Run in WebIDE</small>                                               | قرارداد هوشمند استخر Nominator                                                                                                                                                                                      |
| [single-nominator-pool](https://github.com/orbs-network/single-nominator) <br /> <small>🪄 Run in WebIDE</small>                                        | قرارداد هوشمند ناظر واحد                                                                                                                                                                                            |
| [vesting-contract](https://github.com/ton-blockchain/vesting-contract) <br /> <small>🪄 Run in WebIDE</small>                                           | قرارداد واگذاری به شما امکان می‌دهد یک مقدار مشخص از تون‌کوین را برای مدت زمان مشخصی قفل و به تدریج آن‌ها را باز کنید.                                                                              |
| [storage](https://github.com/ton-blockchain/ton/tree/master/storage/storage-daemon/smartcont) <br /> <small>🪄 Run in WebIDE</small>                    | قراردادهای تأمین‌کننده و تولید کننده ذخیره‌سازی TON                                                                                                                                                                 |

### Ecosystem contracts

| قراردادها                                                                                                                                                              | توضیحات                                                                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [telemint](https://github.com/TelegramMessenger/telemint) <br /> <small>🪄 Run in WebIDE</small>                                                                       | قراردادهای Usenames تلگرام (`nft-item.fc`) و شماره‌های تلگرام (`nft-item-no-dns.fc`).                                 |
| [capped-fungible-token](https://github.com/TonoxDeFi/capped-fungible-token) <br /> <small>🪄 Run in WebIDE</small>                                                     | پیاده‌سازی پایه‌ای از قراردادهای هوشمند برای کیف پول و مینتر جتتون                                                                                                          |
| [gusarich-airdrop](https://github.com/Gusarich/airdrop/tree/main/contracts)                                                                                            | Implementation of a Scalable Airdrop System for the TON blockchain. It can be used to distribute Jettons on-chain to any number of wallets. |
| [getgems-io/nft-contracts](https://github.com/getgems-io/nft-contracts/tree/main/packages/contracts/sources) <br /> <small>🪄 Run in WebIDE</small>                    | قراردادهای NFT Getgems                                                                                                                                                      |
| [lockup-wallet-deployment](https://github.com/ton-defi-org/lockup-wallet-deployment) <br /> <small>🪄 Run in WebIDE</small>                                            | قرارداد Lockup را به‌صورت کامل مستقر و اجرا کنید                                                                                                                            |
| [WTON](https://github.com/TonoxDeFi/WTON) <br /> <small>🪄 Run in WebIDE</small>                                                                                       | این قرارداد هوشمند یک پیاده‌سازی از تون‌کوین بسته‌بندی شده با نام WTON را ارائه می‌دهد                                                                                      |
| [wton-contract](https://github.com/ton-community/wton-contract) <br /> <small>🪄 Run in WebIDE</small>                                                                 | قراردادهای wTON                                                                                                                                                             |
| [contract-verifier-contracts](https://github.com/ton-community/contract-verifier-contracts) <br /> <small>🪄 Run in WebIDE</small>                                     | قراردادهای ثبت منابع که مدرک زنجیره‌ای را برای هر هش Cell کد ذخیره می‌کنند.                                                                                 |
| [vanity-contract](https://github.com/ton-community/vanity-contract) <br /> <small>🪄 Run in WebIDE</small>                                                             | قرارداد هوشمند که به شما اجازه می‌دهد هر آدرس مناسب برای هر قرارداد را "استخراج" کنید.                                                                      |
| [ton-config-smc](https://github.com/ton-foundation/ton-config-smc) <br /> <small>🪄 Run in WebIDE</small>                                                              | قرارداد ساده برای ذخیره‌سازی داده‌های ورژن بندی‌شده در بلاکچین TON.                                                                                         |
| [ratelance](https://github.com/ProgramCrafter/ratelance/tree/main/contracts/func) <br /> <small>🪄 Run in WebIDE</small>                                               | Ratelance یک پلتفرم فریلنسری است که تلاش می‌کند موانع بین کارفرمایان بالقوه و کارگران را حذف کند.                                                           |
| [logger.fc](https://github.com/tonwhales/ton-contracts/blob/master/contracts/logger.fc) <br /> <small>🪄 Run in WebIDE</small>                         | قرارداد که داده‌ها را در storage محلی ذخیره می‌کند.                                                                                                         |
| [ton-nominators](https://github.com/tonwhales/ton-nominators) <br /> <small>🪄 Run in WebIDE</small>                                                                   | کد منبع استخر Nominator Ton Whales.                                                                                                                         |
| [ton-link-contract-v3](https://github.com/ton-link/ton-link-contract-v3) <br /> <small>🪄 Run in WebIDE</small>                                                        | Ton-link به قرارداد‌های هوشمند اجازه می‌دهد تا ضمن حفظ امنیت داده‌ها، به داده‌های خارج از blockchain دسترسی داشته باشند.                                    |
| [delab-team/fungible-token](https://github.com/delab-team/contracts/tree/main/fungible-token) <br /> <small>🪄 Run in WebIDE</small>                                   | پیاده‌سازی توکن قابل تعویض DeLab TON                                                                                                                                        |
| [whitelisted-wallet.fc](https://github.com/tonwhales/ton-contracts/blob/master/contracts/whitelisted-wallet.fc) <br /> <small>🪄 Run in WebIDE</small> | قرارداد کیف پول سفیدلیست شده ساده                                                                                                                                           |
| [delab-team/jetton-pool](https://github.com/delab-team/contracts/tree/main/jetton-pool) <br /> <small>🪄 Run in WebIDE</small>                                         | قرارداد هوشمند Jetton Pool TON برای ایجاد استخرهای فارمی طراحی شده است.                                                                                     |
| [ston-fi/contracts](https://github.com/ston-fi/dex-core/tree/main/contracts) <br /> <small>🪄 Run in WebIDE</small>                                                    | قراردادهای اصلی DEX Stonfi                                                                                                                                                  |
| [onda-ton](https://github.com/0xknstntn/onda-ton) <br /> <small>🪄 Run in WebIDE</small>                                                                               | Onda Lending Pool - قراردادهای هوشمند اصلی اولین پروتکل وام‌دهی در TON                                                                                                      |
| [ton-stable-timer](https://github.com/ProgramCrafter/ton-stable-timer) <br /> <small>🪄 Run in WebIDE</small>                                                          | قرارداد TON Stable Timer                                                                                                                                                    |
| [HipoFinance/contract](https://github.com/HipoFinance/contract) <br /> <small>🪄 Run in WebIDE</small>                                                                 | hTON یک پروتکل استیکینگ liquid غیرمتمرکز، بی‌نیاز از مجوز و open-source بر روی بلاکچین TON است                                                                              |

### Learning contracts

| قراردادها                                                                                                                                                                                                  | توضیحات                                                                                |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [counter.fc](https://github.com/ton-community/blueprint/blob/main/example/contracts/counter.fc) <br /> <small>🪄 Run in WebIDE</small>                                                     | قرارداد هوشمند Counter با توضیحات.                                     |
| [simple-distributor](https://github.com/ton-community/simple-distributor) <br /> <small>🪄 Run in WebIDE</small>                                                                                           | توزیع‌کننده ساده TON.                                                  |
| [ping-pong.fc](https://github.com/tonwhales/ton-nft/blob/main/packages/nft/ping-pong/ping-pong.fc) <br /> <small>🪄 Run in WebIDE</small>                                                  | قرارداد ساده برای آزمایش ارسال Toncoin در حالت‌های مختلف.              |
| [ton-random](https://github.com/puppycats/ton-random) <br /> <small>🪄 Run in WebIDE</small>                                                                                                               | دو قرارداد که به شما کمک می‌کنند اعداد تصادفی را در زنجیره ایجاد کنید. |
| [Blueprint simple contract](https://github.com/liminalAngel/1-func-project/blob/master/contracts/main.fc) <br /> <small>🪄 Run in WebIDE</small>                                                           | مثال قرارداد هوشمند                                                                    |
| [Blueprint jetton_minter.fc](https://github.com/liminalAngel/func-blueprint-tutorial/blob/master/6/contracts/jetton_minter.fc) <br /> <small>🪄 Run in WebIDE</small> | مثال قرارداد هوشمند برای استخراج Jettonها در زنجیره.                   |
| [Simple TON DNS Subdomain manager](https://github.com/Gusarich/simple-subdomain) <br /> <small>🪄 Run in WebIDE</small>                                                                                    | مدیریت زیر دامنه‌های TON DNS.                                          |
| [disintar/sale-dapp](https://github.com/disintar/sale-dapp/tree/master/func) <br /> <small>🪄 Run in WebIDE</small>                                                                                        | فروش DApp با FunC به همراه React + NFT                                                 |

### TON smart challenges

#### چالش هوشمند TON ۱

- https://github.com/nns2009/TON-FunC-contest-1/tree/main
- https://github.com/pyAndr3w/func-contest1-solutions
- https://github.com/crazyministr/TonContest-FunC/tree/master/func-contest1

#### چالش هوشمند TON ۲

- https://github.com/ton-blockchain/func-contest2-solutions
- https://github.com/nns2009/TON-FunC-contest-2
- https://github.com/crazyministr/TonContest-FunC/tree/master/func-contest2

#### چالش هوشمند TON ۳

- https://github.com/nns2009/TON-FunC-contest-3
- https://github.com/shuva10v/func-contest3-solutions
- https://github.com/crazyministr/TonContest-FunC/tree/master/func-contest3

#### چالش هوشمند TON ۴

- https://github.com/akifoq/tsc4 (TOP بهینه‌شده)
- https://github.com/Gusarich/tsc4
- https://github.com/Skydev0h/tsc4
- https://github.com/aSpite/tsc4-contracts (راه‌حل FunC)
- [https://github.com/ProgramCrafter/tsc4](https://github.com/ProgramCrafter/tsc4/tree/c1616e12d1b449b01fdcb787a3aa8442e671371e/contracts) (راه‌حل FunC)

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
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/gen-zerostate-test.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/gen-zerostate.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet-v2-one.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet-v2.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/manual-dns-manage.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-auto-dns.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet-v2.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-manual-dns.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-pinger.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-pow-testgiver.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-restricted-wallet.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-restricted-wallet2.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-restricted-wallet3.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-testgiver.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet-v2.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet-v3.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/show-addr.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/testgiver.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/update-config-smc.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/update-config.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/update-elector-smc.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/validator-elect-req.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/validator-elect-signed.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-v2.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-v3.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet.fif)
- [کیف پول v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-v3-code.fif)

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

اگر می‌خواهید یک مثال جدید از قرارداد هوشمند را به اشتراک بگذارید، درخواست کششی خود را برای این [صفحه](https://github.com/ton-community/ton-docs/tree/main/docs/v3/documentation/smart-contracts/contracts-specs/examples.md) بفرستید.

## See also

- [معرفی توسعه قراردادهای هوشمند](/v3/documentation/smart-contracts/overview)
- [چگونه با قراردادهای هوشمند کیف پول کار کنیم](/v3/guidelines/smart-contracts/howto/wallet)
- [[You Tube] Ton Dev Study FunC & BluePrint lessons](https://www.youtube.com/watch?v=7omBDfSqGfA\u0026list=PLtUBO1QNEKwtO_zSyLj-axPzc9O9rkmYa)

<Feedback />

