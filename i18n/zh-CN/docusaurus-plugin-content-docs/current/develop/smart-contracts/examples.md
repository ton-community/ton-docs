# 智能合约示例

在这个页面上，您可以找到为各种程序软件实现的TON智能合约的参考。

:::info
确保在生产环境中使用它们之前彻底测试合约。这是确保您的软件正常运行和安全的关键步骤。
:::

## FunC智能合约

### 生产环境中使用的合约

| 合约                                                                                                                                                                                                                                                                                                          | 描述                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [wallet-contract](https://github.com/ton-blockchain/wallet-contract) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/wallet-contract\&name=wallet-contract)</small>                                                                                         | Wallet v4是提出用于替换v3或更早的钱包的钱包版本                                                            |
| [liquid-staking-contract](https://github.com/ton-blockchain/liquid-staking-contract/) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/liquid-staking-contract/\&name=liquid-staking-contract)</small>                                                       | Liquid Staking (LSt)是一个协议，连接所有水平的TON持有者与硬件节点运营商，通过资产池参与TON区块链验证。      |
| [modern_jetton](https://github.com/EmelyanenkoK/modern_jetton) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/EmelyanenkoK/modern_jetton\&name=modern_jetton)</small>                                                                                | 实现标准jetton，附加withdraw_tons和withdraw_jettons功能。 |
| [governance-contract](https://github.com/ton-blockchain/governance-contract) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/governance-contract\&name=governance-contract)</small>                                                                         | TON区块链核心合约`elector-code.fc`和`config-code.fc`。                                            |
| [bridge-func](https://github.com/ton-blockchain/bridge-func) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/bridge-func\&name=bridge-func)</small>                                                                                                         | TON-EVM Toncoin桥。                                                                        |
| [token-bridge-func](https://github.com/ton-blockchain/token-bridge-func) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/token-bridge-func\&name=token-bridge-func)</small>                                                                                 | TON-EVM代币桥 - FunC智能合约。                                                                   |
| [lockup-wallet-contract/universal](https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/universal) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/universal\&name=lockup-wallet-contract/universal)</small> | Universal lockup wallet是可以存储锁定的和受限的代币的合约。                                                |
| [lockup-wallet-contract/vesting](https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/vesting) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/vesting\&name=lockup-wallet-contract/vesting)</small>         | Vesting钱包智能合约                                                                            |
| [multisig-contract](https://github.com/ton-blockchain/multisig-contract) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/multisig-contract\&name=multisig-contract)</small>                                                                                 | `(n, k)`-多签名钱包是一个拥有`n`个私钥持有者的钱包，如果请求收集到至少`k`个持有者的签名，则接受发送消息的请求。                          |
| [token-contract](https://github.com/ton-blockchain/token-contract) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/token-contract\&name=token-contract)</small>                                                                                             | 可替代、不可替代、半可替代代币智能合约                                                                      |
| [dns-contract](https://github.com/ton-blockchain/dns-contract) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/dns-contract\&name=dns-contract)</small>                                                                                                     | `.ton`区域的智能合约。                                                                           |
| [nominator-pool](https://github.com/ton-blockchain/nominator-pool) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/nominator-pool\&name=nominator-pool)</small>                                                                                             | Nominator池智能合约                                                                           |
| [single-nominator-pool](https://github.com/orbs-network/single-nominator) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/nominator-pool\&name=nominator-pool)</small>                                                                                      | 单一Nominator池智能合约                                                                         |
| [vesting-contract](https://github.com/ton-blockchain/vesting-contract) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/nominator-pool\&name=nominator-pool)</small>                                                                                         | Nominator池智能合约                                                                           |
| [storage](https://github.com/ton-blockchain/ton/tree/master/storage/storage-daemon/smartcont) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/ton/tree/master/storage/storage-daemon/smartcont\&name=storage)</small>                                       | TON存储提供商和制造合约                                                                            |
| [vesting-contract](https://github.com/ton-blockchain/vesting-contract) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/nominator-pool\&name=nominator-pool)</small>                                                                                         | Nominator池智能合约                                                                           |
| [ton-random](https://github.com/ton-blockchain/ton/tree/master/storage/storage-daemon/smartcont) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ton-blockchain/ton/tree/master/storage/storage-daemon/smartcont\&name=storage)</small>                                    | TON存储提供商和制造合约                                                                            |

### 生态系统合约

| 合约                                                                                                                                                                                                                                                                                                                        | 描述                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [telemint](https://github.com/TelegramMessenger/telemint) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/TelegramMessenger/telemint\&name=telemint)</small>                                                                                                                             | Telegram用户名(`nft-item.fc`)和Telegram号码(`nft-item-no-dns.fc`)合约。 |
| [WTON](https://github.com/TonoxDeFi/WTON) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/TonoxDeFi/WTON\&name=WTON)</small>                                                                                                                                                             | 此智能合约提供了称为WTON的wrapped toncoin的实现                                                                    |
| [capped-fungible-token](https://github.com/TonoxDeFi/capped-fungible-token) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/TonoxDeFi/capped-fungible-token\&name=capped-fungible-token)</small>                                                                                         | Jetton钱包和Jetton铸币的基本智能合约实现                                                                           |
| [getgems-io/nft-contracts](https://github.com/getgems-io/nft-contracts/tree/main/packages/contracts/sources) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/getgems-io/nft-contracts/tree/main/packages/contracts/sources\&name=getgems-io/nft-contracts)</small>                       | Getgems NFT合约                                                                                        |
| [lockup-wallet-deployment](https://github.com/ton-defi-org/lockup-wallet-deployment) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ton-defi-org/lockup-wallet-deployment\&name=lockup-wallet-deployment)</small>                                                                       | 部署和运行锁定合约的端到端实现                                                                                      |
| [wton-contract](https://github.com/ton-community/wton-contract) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ton-community/wton-contract\&name=wton-contract)</small>                                                                                                                 | wTON合约                                                                                               |
| [contract-verifier-contracts](https://github.com/ton-community/contract-verifier-contracts) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ton-community/contract-verifier-contracts\&name=contract-verifier-contracts)</small>                                                         | 存储每个代码cell哈希的链上证明的源注册合约。                                                                             |
| [vanity-contract](https://github.com/ton-community/vanity-contract) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ton-community/vanity-contract\&name=vanity-contract)</small>                                                                                                         | 允许为任何合约“挖掘”任何合适地址的智能合约。                                                                              |
| [ton-config-smc](https://github.com/ton-foundation/ton-config-smc) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ton-foundation/ton-config-smc\&name=ton-config-smc)</small>                                                                                                           | 简单的用于在TON区块链中存储版本化数据的合约。                                                                             |
| [ratelance](https://github.com/ProgramCrafter/ratelance/tree/main/contracts/func) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ProgramCrafter/ratelance/tree/main/contracts/func\&name=ratelance)</small>                                                                             | Ratelance是一个自由职业平台，旨在消除潜在雇主和工作者之间的障碍。                                                                |
| [ton-forwarder.fc](https://github.com/TrueCarry/ton-contract-forwarder/blob/main/func/ton-forwarder.fc) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/TrueCarry/ton-contract-forwarder/blob/main/func/ton-forwarder.fc\&name=ton-forwarder.fc)</small>                 | 接受确切金额并将其转发到指定地址的合约。错误金额或后续退款时退还资金。                                                                  |
| [logger.fc](https://github.com/tonwhales/ton-contracts/blob/master/contracts/logger.fc) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/tonwhales/ton-contracts/blob/master/contracts/logger.fc\&name=logger.fc)</small>                                                 | 将数据保存在本地存储中的合约。                                                                                      |
| [ton-nominators](https://github.com/tonwhales/ton-nominators) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/tonwhales/ton-nominators\&name=ton-nominators)</small>                                                                                                                     | Ton Whales Nominator池源代码。                                                                            |
| [ton-link-contract-v3](https://github.com/ton-link/ton-link-contract-v3) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ton-link/ton-link-contract-v3\&name=ton-link-contract-v3)</small>                                                                                               | Ton-link允许智能合约访问区块链外的数据，同时保持数据安全。                                                                    |
| [delab-team/fungible-token](https://github.com/delab-team/contracts/tree/main/fungible-token) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/delab-team/contracts/tree/main/fungible-token\&name=delab-team/fungible-token)</small>                                                     | DeLab TON可替代代币实现                                                                                     |
| [whitelisted-wallet.fc](https://github.com/tonwhales/ton-contracts/blob/master/contracts/whitelisted-wallet.fc) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/tonwhales/ton-contracts/blob/master/contracts/whitelisted-wallet.fc\&name=whitelisted-wallet.fc)</small> | 简单的白名单钱包合约                                                                                           |
| [delab-team/jetton-pool](https://github.com/delab-team/contracts/tree/main/jetton-pool) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/delab-team/contracts/tree/main/jetton-pool\&name=delab-team/jetton-pool)</small>                                                                 | Jetton Pool TON智能合约旨在创建farm pools。                                                                   |
| [ston-fi/contracts](https://github.com/ston-fi/dex-core/tree/main/contracts) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ston-fi/dex-core/tree/main/contracts\&name=ston-fi/contracts)</small>                                                                                       | Stonfi DEX核心合约                                                                                       |
| [onda-ton](https://github.com/0xknstntn/onda-ton) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/0xknstntn/onda-ton\&name=onda-ton)</small>                                                                                                                                             | Onda借贷池 - TON上首个借贷协议的核心智能合约                                                                          |
| [ton-stable-timer](https://github.com/ProgramCrafter/ton-stable-timer) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ProgramCrafter/ton-stable-timer\&name=ton-stable-timer)</small>                                                                                                   | TON稳定计时器合约                                                                                           |
| [HipoFinance/contract](https://github.com/HipoFinance/contract) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/HipoFinance/contract\&name=HipoFinance)</small>                                                                                                                          | hTON是TON区块链上的去中心化、无需许可的开源流动性质押协议                                                                     |

### 学习合约

| 合约                                                                                                                                                                                                                                                                                                                                                                 | 描述                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| [counter.fc](https://github.com/ton-community/blueprint/blob/main/example/contracts/counter.fc) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ton-community/blueprint/blob/main/example/contracts/counter.fc\&name=counter.fc)</small>                                                                          | 带有评论的counter(计数器)智能合约。 |
| [simple-distributor](https://github.com/ton-community/simple-distributor) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/ton-community/simple-distributor\&name=simple-distributor)</small>                                                                                                                                      | 简单的TON分发器。                                |
| [ping-pong.fc](https://github.com/tonwhales/ton-nft/blob/main/packages/nft/ping-pong/ping-pong.fc) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/tonwhales/ton-nft/blob/main/packages/nft/ping-pong/ping-pong.fc\&name=ping-pong.fc)</small>                                                                    | 测试以不同模式发送Toncoin的简单合约。                    |
| [ton-random](https://github.com/puppycats/ton-random) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/puppycats/ton-random\&name=ton-random)</small>                                                                                                                                                                              | 将帮助您在链上生成随机数的两个合约。                        |
| [Blueprint simple contract](https://github.com/liminalAngel/1-func-project/blob/master/contracts/main.fc) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/liminalAngel/1-func-project/blob/master/contracts/main.fc\&name=simple_contract)</small>                                                                                | 示例智能合约                                    |
| [Blueprint jetton_minter.fc](https://github.com/liminalAngel/func-blueprint-tutorial/blob/master/6/contracts/jetton_minter.fc) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/liminalAngel/func-blueprint-tutorial/blob/master/6/contracts/jetton_minter.fc\&name=jetton_minter.fc)</small> | 铸造Jettons的智能合约示例。                         |
| [Simple TON DNS Subdomain manager](https://github.com/Gusarich/simple-subdomain) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/Gusarich/simple-subdomain\&name=Simple_TON_DNS_Subdomain_manager)</small>                                                                                                                        | TON DNS子域名管理器。                            |
| [disintar/sale-dapp](https://github.com/disintar/sale-dapp/tree/master/func) <br /> <small>🪄 [在WebIDE中运行](https://ide.nujan.io/?importURL=https://github.com/disintar/sale-dapp/tree/master/func\&name=disintar/sale-dapp)</small>                                                                                                                                | React + NFT销售DApp与FunC                    |

### TON智能挑战

#### TON智能挑战1

- https://github.com/nns2009/TON-FunC-contest-1/tree/main
- https://github.com/pyAndr3w/func-contest1-solutions
- https://github.com/crazyministr/TonContest-FunC/tree/master/func-contest1

#### TON智能挑战2

- https://github.com/ton-blockchain/func-contest2-solutions
- https://github.com/nns2009/TON-FunC-contest-2
- https://github.com/crazyministr/TonContest-FunC/tree/master/func-contest2

#### TON智能挑战3

- https://github.com/nns2009/TON-FunC-contest-3
- https://github.com/shuva10v/func-contest3-solutions
- https://github.com/crazyministr/TonContest-FunC/tree/master/func-contest3

#### TON智能挑战4

- https://github.com/akifoq/tsc4 (最佳优化)
- https://github.com/Gusarich/tsc4
- https://github.com/Skydev0h/tsc4
- https://github.com/aSpite/tsc4-contracts (FunC解决方案)
- [https://github.com/ProgramCrafter/tsc4](https://github.com/ProgramCrafter/tsc4/tree/c1616e12d1b449b01fdcb787a3aa8442e671371e/contracts) (FunC解决方案)

## Fift智能合约

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

## FunC库和帮助工具

- https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc
- https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/crypto/elliptic-curves
- https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/math
- https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/messages
- https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/slices
- https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/strings
- https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/tuples
- https://github.com/TonoxDeFi/open-contracts/tree/main/contracts/utils
- https://github.com/disintar/sale-dapp/tree/master/func

## 添加参考

如果您想分享新的智能合约示例，请为这个[页面](https://github.com/ton-community/ton-docs/tree/main/docs/develop/smart-contracts/examples.md)提交您的PR。

## 参阅

- [开发智能合约简介](/develop/smart-contracts/)
- [如何使用钱包智能合约](/develop/smart-contracts/tutorials/wallet)
- [[YouTube] Ton Dev 研究 FunC & BluePrint课程](https://www.youtube.com/watch?v=7omBDfSqGfA\&list=PLtUBO1QNEKwtO_zSyLj-axPzc9O9rkmYa)
