import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 单一提名池

[单一提名](https://github.com/orbs-network/single-nominator) 是一个简单的防火墙 TON 智能合约，可通过冷钱包对 TON 区块链进行安全验证。该合约专为拥有足够自我权益的 TON 验证者设计，无需依赖第三方提名者权益即可自行验证。该合约为 [Nominator Pool](/v3/documentation/smart-contracts/contracts-specs/nominator-pool)智能合约提供了另一种简化的实现方式，只支持单一提名人。这种实现方式的好处是更安全，因为攻击面大大缩小。这是因为需要支持多个第三方提名者的提名者池的复杂性大大降低。

## 验证器的首选解决方案

该智能合约旨在为拥有足够股份自行验证的 TON 验证者提供最佳解决方案。其他可供选择的方案有

- 使用[热钱包](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc)（不安全，因为如果验证器节点被黑客攻击，需要冷钱包来防止被盗）
- 使用 [restricted-wallet](https://github.com/EmelyanenkoK/nomination-contract/blob/master/restricted-wallet/wallet.fc)（尚未维护，存在尚未解决的攻击向量，如 gas 流失攻击）
- 使用 [Nominator Pool](https://github.com/ton-blockchain/nominator-pool)，max_nominators_count = 1（不必要的复杂性，攻击面更大）。

请参阅下文更详细的 [现有替代品比较](#Comparison-of-Existing-alternatives)。

## 官方代码哈希值

在向真实合约发送资金之前，请在 https://verifier.ton.org 中检查这一点

```
pCrmnqx2/+DkUtPU8T04ehTkbAGlqtul/B2JPmxx9bo=
```

## 架构

其架构与 [Nominator Pool](https://github.com/ton-blockchain/nominator-pool) 合约几乎相同：

![image](/img/nominator-pool/single-nominator-architecture.png)

### 分离为两个角色

- *所有者* - 冷钱包（未连接互联网的私人密钥），拥有用于定级的资金，并充当单一提名人
- *验证器* - 私钥在验证器节点上的钱包（可以签署区块，但不能窃取用于入股的资金）

### 工作流程

1. *所有者*在其安全的冷钱包中持有投注资金 (\$$$)
2. *业主*将资金 (\$$$) 存入*单一分母*合约（本合约）
3. *MyTonCtrl* 开始在连接到互联网的验证器节点上运行
4. *MyTonCtrl* 使用 *Validator* 钱包指示 *SingleNominator* 进入下一个选举周期
5. *SingleNominator* 向 *Elector* 发送一个周期的赌注 (\$$$)。
6. 选举周期已经结束，股权可以收回
7. *MyTonCtrl* 使用 *Validator* 钱包指示 *SingleNominator* 从选举周期中收回赌注
8. *单提名人*从*选举人*处收回上一周期的赌注 (\$$$)
9. 只要 *Owner* 愿意继续验证，就重复步骤 4-8
10. *业主*从*单一分母*合约中提取资金 (\$$$) 并带回家

## 减小攻击向量

- 验证器节点需要一个热钱包来签署新区块。这个钱包本质上是不安全的，因为它的私钥与互联网相连。即使这个密钥被泄露，*验证器*也无法提取用于验证的资金。只有*所有者*才能提取这些资金。

- 即使 *Validator* 钱包被入侵，*Owner* 也可以告诉 *SingleNominator* 更改验证器地址。这将阻止攻击者与 *SingleNominator* 进一步交互。这里不存在竞赛条件，*Owner* 始终优先。

- *SingleNominator* 余额仅持有本金赌注资金 - 其余额不用于支付 gas 费。进入选举周期的 gas 费存放在 *Validator* 钱包中。这可以防止入侵验证器的攻击者通过 gas 支出攻击耗尽本金。

- *SingleNominator* 验证*Validator*给出的所有操作格式，确保不会将无效信息转发给*Elector*。

- 在紧急情况下，例如 *Elector* 合约升级并更改了界面，*Owner* 仍可作为 *SingleNominator* 发送任何原始信息，以从 *Elector* 收回赌注。

- 在极端紧急的情况下，*Owner* 可以设置 *SingleNominator* 的代码，并覆盖其当前逻辑，以应对不可预见的情况。

使用常规的[提名池](https://github.com/ton-blockchain/nominator-pool) 合约无法减少其中一些攻击向量，因为这将允许运行验证器的人从其提名者那里窃取资金。这在 *SingleNominator* 中不是问题，因为 *Owner* 和 *Validator* 是由同一方拥有的。

### 安全审计

完整的安全审计由 Certik 进行，可在此 repo - [Certik Audit](https://github.com/orbs-network/single-nominator/blob/main/certik-audit.pdf) 中获取。

## 现有替代品比较

假设您是一名验证员，有足够的资金自行验证，以下是您可以使用 MyTonCtrl 的其他设置：

---

### 1. 简单的热钱包

这是最简单的设置，MyTonCtrl 与持有资金的同一个 [标准钱包](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc) 相连。由于该钱包连接到互联网，因此被视为热钱包。

![image](/img/nominator-pool/hot-wallet.png)

这是不安全的，因为攻击者可以获取私钥，因为它连接到了互联网。有了私钥，攻击者就可以向任何人发送定金。

---

### 2. 受限钱包

这种设置用[受限钱包](https://github.com/EmelyanenkoK/nomination-contract/blob/master/restricted-wallet/wallet.fc)取代了标准钱包，只允许向受限目的地发送外向交易，如*选举人*和所有者的地址。

![image](/img/nominator-pool/restricted-wallet.png)

受限钱包未经维护（已被提名人池取代），存在尚未解决的攻击向量，如 gas 流失攻击。由于同一个钱包的余额中既有 gas 费也有赌注本金，攻击者如果泄露了私钥，就会产生交易，造成重大本金损失。此外，由于 seqno 碰撞，攻击者和所有者在尝试提款时会出现竞赛条件。

---

### 3. 提名池

[提名池](https://github.com/ton-blockchain/nominator-pool) 首次将赌注所有者（提名人）与连接到互联网的验证器明确分开。这种设置可支持多达 40 个提名人在同一验证机上共同投注。

![image](/img/nominator-pool/nominator-pool.png)

由于同时支持 40 个提名人，提名人库合约过于复杂。此外，合约还必须保护提名者与合约部署者，因为它们是独立的实体。这种设置还算可以，但由于攻击面太大，很难进行全面审核。当验证者没有足够的利益来单独验证，或希望与第三方利益相关者分享利润时，该解决方案就很有意义了。

---

### 4. 单一提名

这是本版本库中实现的设置。这是一个非常简化的提名池版本，只支持一个提名人，不需要保护提名人与合约部署者，因为它们是同一个实体。

![image](/img/nominator-pool/single-nominator-architecture.png)

如果您只有一个提名人持有所有赌注进行验证，这是最安全的设置。除了简单之外，该合约还为所有者提供了多种紧急保障措施，即使在*选举人*升级导致恢复赌金界面被破坏等极端情况下，也能恢复赌金。

### 仅限所有者的信息

提名人所有者可以执行 4 项操作：

#### 1. `撤回`

用于向所有者的钱包提取资金。要提取资金，所有者应发送包含以下内容的消息：操作码=0x1000（32 位）、query_id（64 位）和提取金额（存储为硬币变量）。提名人合约将以 BOUNCEABLE 标志和模式=64 发送资金。 <br/><br/>
如果所有者使用的是**热钱包**（不推荐），可使用 [withdraw-deeplink.ts](https://github.com/orbs-network/single-nominator/blob/main/scripts/ts/withdraw-deeplink.ts) 生成一个深度链接，以启动从 tonkeeper 钱包取款。 <br/>
命令行： `ts-node scripts/ts/withdraw-deeplink.ts single-nominator-addr withdraw-amount` 其中：

- single-nominator-addr 是所有者希望退出的单一提名人地址。
- withdraw-amount 是要提取的金额。提名人合约将在合约中保留 1  TON ，因此发送到所有者地址的实际金额将是请求金额和合约余额之间的最小值 - 1。<br/>
  所有者应使用装有 tonkeeper 钱包的手机运行 deeplink。<br/>

如果所有者使用的是**冷钱包**（推荐），[withdraw.fif](https://github.com/orbs-network/single-nominator/blob/main/scripts/fift/withdraw.fif) 可用于生成包含提款操作码和提款金额的 boc 主体。 <br/>
命令行： `fift -s scripts/fif/withdraw.fif withdraw-amount` 其中 withdraw-amount 是要从提名人合约提取到所有者钱包的金额。如上所述，提名人合约中将至少保留 1  TON 。 <br/>
该脚本将生成一个 boc 正文（名为 withdraw.boc），并在所有者的钱包中签署和发送。 <br/>
所有者应在黑色电脑上运行

- 创建并签署 tx： `fift -s wallet-v3.fif my-wallet single_nominator_address sub_wallet_id seqno amount -B withdraw.boc`，其中 my-wallet 是所有者的 pk 文件（不带扩展名）。1 TON 的金额应足以支付费用（剩余金额将返还给所有者）。withdraw.boc 就是上面生成的 boc。
- 在能上网的电脑上运行`lite-client -C global.config.json -c 'sendfile wallet-query.boc'`发送前一步生成的 boc 文件（wallet-query.boc）。

#### 2. `更改验证器`

用于更改验证器地址。验证人只能向选举人发送 NEW_STAKE 和 RECOVER_STAKE。如果验证人私钥泄露，验证人地址也可以更改。请注意，在这种情况下，资金是安全的，因为只有所有者才能提取资金。<br/>

如果所有者使用的是**热钱包**（不推荐），可使用 [change-validator-deeplink.ts](https://github.com/orbs-network/single-nominator/blob/main/scripts/ts/change-validator-deeplink.ts) 生成一个深层链接来更改验证器地址。 <br/>
命令行： `ts-node scripts/ts/change-validator-deeplink.ts single-nominator-addr new-validator-address` 其中：

- single-nominator-addr 是单一提名人地址。
- new-validator-address（默认为 ZERO 地址）是新验证器的地址。如果您想立即禁用验证器，然后再设置新的验证器，将验证器地址设置为 ZERO 地址可能会比较方便。
  所有者应使用装有 tonkeeper 钱包的手机运行 deeplink。<br/>

如果所有者使用的是**冷钱包**（推荐），[change-validator.fif](https://github.com/orbs-network/single-nominator/blob/main/scripts/fift/change-validator.fif) 可用于生成包含更改验证器操作码和新验证器地址的 boc 主体。 <br/>
命令行： `fift -s scripts/fif/change-validator.fif new-validator-address`。
该脚本将生成一个 boc 正文（名为 change-validator.boc），并在所有者的钱包中签名和发送。 <br/>
所有者应在黑计算机上运行

- 创建并签署 tx： `fift -s wallet-v3.fif my-wallet single_nominator_address sub_wallet_id seqno amount -B change-validator.boc`，其中 my-wallet 是所有者的 pk 文件（不带扩展名）。金额为 1  TON ，足够支付费用（剩余金额将退还所有者）。change-validator.boc 就是上面生成的 boc。
- 在能上网的电脑上运行`lite-client -C global.config.json -c 'sendfile wallet-query.boc'`发送前一步生成的 boc 文件（wallet-query.boc）。

#### 3. 显示原始信息

正常情况下不会使用此操作码。 <br/>
它可用于从提名人合约中发送 \*\* 任何\*\*信息（必须签署并从所有者钱包中发送）。 <br/>
例如，如果选举人合约地址意外更改，而资金仍被锁定在选举人中，则可能需要使用此操作码。在这种情况下，验证器中的 RECOVER_STAKE 将不起作用，所有者必须创建一个特定的消息。 <br/>
报文正文应包括：操作码=0x7702（32 位）、query_id（64 位）、模式（8 位）、作为原始报文发送的 cell  msg 的引用。<br/>

#### 4. 升级

这是一个紧急操作码，可能永远都不应使用。<br/>
它可用于升级提名人合约。 <br/>
报文正文应包括：操作码=0x9903（32 位）、查询码（64 位）、新 cell 代码参考。<br/>

## 另请参见

- [单一提名合约](https://github.com/orbs-network/single-nominator)
- [如何使用单一提名池](/v3/guidelines/smart-contracts/howto/single-nominator-pool)
