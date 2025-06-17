import Feedback from '@site/src/components/Feedback';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 单一提名池

The [single nominator](https://github.com/ton-blockchain/single-nominator) contract is a security-focused smart contract that lets validators securely stake Toncoins without needing other participants. Designed for validators with sufficient self-stake, it keeps signing keys separate from staked funds using a cold wallet for maximum security. The contract provides an alternative simplified implementation for the [nominator pool](/v3/documentation/smart-contracts/contracts-specs/nominator-pool) smart contract that supports a single nominator only. The benefit of this implementation is that it's more secure since the attack surface is considerably smaller. This is due to a massive reduction in the complexity of the nominator pool that has to support multiple third-party nominators.

## 验证器的首选解决方案

该智能合约旨在为拥有足够股份自行验证的 TON 验证者提供最佳解决方案。其他可供选择的方案有 Other options include:

1. 使用[热钱包](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc)（不安全，因为如果验证器节点被黑客攻击，需要冷钱包来防止被盗）

2. 使用 [restricted-wallet](https://github.com/EmelyanenkoK/nomination-contract/blob/master/restricted-wallet/wallet.fc)（尚未维护，存在尚未解决的攻击向量，如 gas 流失攻击）

3. 使用常规的[提名池](https://github.com/ton-blockchain/nominator-pool) 合约无法减少其中一些攻击向量，因为这将允许运行验证器的人从其提名者那里窃取资金。这在 _SingleNominator_ 中不是问题，因为 _Owner_ 和 _Validator_ 是由同一方拥有的。

请参阅下文更详细的 [现有替代品比较](#Comparison-of-Existing-alternatives)。

## 官方代码哈希值

在向真实合约发送资金之前，请在 https://verifier.ton.org 中检查这一点

Single nominator v1.0

```
pCrmnqx2/+DkUtPU8T04ehTkbAGlqtul/B2JPmxx9bo=
```

Single nominator v1.1 (with withdrawals by comment)

```
zA05WJ6ywM/g/eKEVmV6O909lTlVrj+Y8lZkqzyQT70=
```

## 架构

其架构与 [Nominator Pool](https://github.com/ton-blockchain/nominator-pool) 合约几乎相同：

![image](/img/nominator-pool/single-nominator-architecture.png)

### 分离为两个角色

- _所有者_ - 冷钱包（未连接互联网的私人密钥），拥有用于定级的资金，并充当单一提名人
- _验证器_ - 私钥在验证器节点上的钱包（可以签署区块，但不能窃取用于入股的资金）

### 工作流程

1. _所有者_在其安全的冷钱包中持有投注资金 (\\$$$)
2. _业主_将资金 (\\$$$) 存入_单一分母_合约（本合约）
3. _MyTonCtrl_ 开始在连接到互联网的验证器节点上运行
4. _MyTonCtrl_ 使用 _Validator_ 钱包指示 _SingleNominator_ 进入下一个选举周期
5. _SingleNominator_ 向 _Elector_ 发送一个周期的质押 (\\$$$)。
6. 选举周期已经结束，股权可以收回
7. _MyTonCtrl_ 使用 _Validator_ 钱包指示 _SingleNominator_ 从选举周期中收回质押
8. _SingleNominator_ recovers the stake (\$$$) of the previous cycle from the _Elector_
9. 只要 _Owner_ 愿意继续验证，就重复步骤 4-8
10. _业主_从_单一分母_合约中提取资金 (\\$$$) 并带回家

## 减小攻击向量

- The validator node requires a hot wallet to sign new blocks. This wallet is inherently insecure because its private key is connected to the Internet. Even if this key is compromised, the _Validator_ cannot extract the funds used for validation. Only _Owner_ can withdraw these funds.

- 即使 _Validator_ 钱包被入侵，_Owner_ 也可以告诉 _SingleNominator_ 更改验证器地址。这将阻止攻击者与 _SingleNominator_ 进一步交互。这里不存在竞赛条件，_Owner_ 始终优先。 This will prevent the attacker from interacting with _SingleNominator_ further. There is no race condition here; _Owner_ will always take precedence.

- The _SingleNominator_ balance holds the principal staking funds only—its balance is not used for gas fees. Gas money for entering election cycles is held in the _Validator_ wallet. This prevents an attacker who compromised the validator from draining the principal via a gas spending attack.

- _SingleNominator_ 验证_Validator_给出的所有操作格式，确保不会将无效信息转发给_Elector_。

- 在紧急情况下，例如 _Elector_ 合约升级并更改了界面，_Owner_ 仍可作为 _SingleNominator_ 发送任何原始信息，以从 _Elector_ 收回质押。

- 在极端紧急的情况下，_Owner_ 可以设置 _SingleNominator_ 的代码，并覆盖其当前逻辑，以应对不可预见的情况。

The standard [nominator pool](https://github.com/ton-blockchain/nominator-pool) can't prevent all attack scenarios - a malicious validator operator could potentially steal from nominators. This risk doesn't exist with _SingleNominator_ since both the _Owner_ and _Validator_  are controlled by the same entity.

### 安全审计

完整的安全审计由 Certik 进行，可在此 repo - [Certik Audit](https://github.com/orbs-network/single-nominator/blob/main/certik-audit.pdf) 中获取。

## 现有替代品比较

假设您是一名验证员，有足够的资金自行验证，以下是您可以使用 MyTonCtrl 的其他设置：

### 1. 简单的热钱包

这是最简单的设置，MyTonCtrl 与持有资金的同一个 [标准钱包](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc) 相连。由于该钱包连接到互联网，因此被视为热钱包。 Because this wallet remains internet-connected, it operates as a hot wallet.

![image](/img/nominator-pool/hot-wallet.png)

这是不安全的，因为攻击者可以获取私钥，因为它连接到了互联网。有了私钥，攻击者就可以向任何人发送定金。 With the private key, the attacker can send the staking funds to anyone.

### 2. 受限钱包

这种设置用[受限钱包](https://github.com/EmelyanenkoK/nomination-contract/blob/master/restricted-wallet/wallet.fc)取代了标准钱包，只允许向受限目的地发送外向交易，如_选举人_和所有者的地址。

![image](/img/nominator-pool/restricted-wallet.png)

The restricted wallet is unmaintained (replaced by nominator-pool) and has unresolved attack vectors like gas drainage attacks. Since the same wallet holds gas fees and the stake principal in the same balance, an attacker who compromises the private key can generate transactions that will cause significant principal losses. In addition, there's a race condition between the attacker and the owner when trying to withdraw due to seqno collisions.

### 3. 提名池

[提名池](https://github.com/ton-blockchain/nominator-pool) 首次将质押所有者（提名人）与连接到互联网的验证器明确分开。这种设置可支持多达 40 个提名人在同一验证机上共同投注。 This setup supports up to 40 nominators staking together on the same validator.

![image](/img/nominator-pool/nominator-pool.png)

The nominator pool contract is overly complex due to the support of 40 concurrent nominators. In addition, the contract has to protect the nominators from the contract deployer because those are separate entities. This setup is considered ok but is very difficult to audit in full due to the size of the attack surface. The solution makes sense mostly when the validator does not have enough stake to validate alone or wants to do a rev-share with third-party stakeholders.

### 4. 单一提名

This is the setup implemented in this repo. It's a very simplified version of the nominator pool that supports a single nominator. There is no need to protect this nominator from the contract deployer, as they are the same entity.

![image](/img/nominator-pool/single-nominator-architecture.png)

If you have a single nominator who holds all stakes for validation, this is the most secure setup you can use. In addition to its simplicity, this contract provides the owner multiple emergency safeguards to recover stakes even in extreme scenarios like _Elector_ upgrades that break the recover stake interface.

## 仅限所有者的信息

提名人所有者可以执行 4 项操作：

#### 1. `撤回`

Used to withdraw funds to the owner's wallet. To withdraw the funds the owner should send a message with a body that includes: opcode=0x1000 (32 bits), query_id (64 bits) and withdraw amount (stored as coin variable). The nominator contract will send the funds with BOUNCEABLE flag and mode=64. <br/><br/>
In case the owner is using a **hot wallet** (not recommended), [withdraw-deeplink.ts](https://github.com/ton-blockchain/single-nominator/blob/main/scripts/ts/withdraw-deeplink.ts) can be used to generate a deeplink to initiate a withdrawal from tonkeeper wallet. <br/>

Command line: `ts-node scripts/ts/withdraw-deeplink.ts single-nominator-addr withdraw-amount` where:

- single-nominator-addr 是所有者希望退出的单一提名人地址。
- withdraw-amount is the amount to withdraw. The nominator contract will leave 1 TON in the contract, so the amount sent to the owner's address will be the minimum between the requested amount and the contract balance - 1.

The owner should run the deeplink from a phone with the tonkeeper wallet.

如果所有者使用的是**冷钱包**（推荐），[withdraw.fif](https://github.com/orbs-network/single-nominator/blob/main/scripts/fift/withdraw.fif) 可用于生成包含提款操作码和提款金额的 boc 主体。 <br/>
命令行： `fift -s scripts/fif/withdraw.fif withdraw-amount` 其中 withdraw-amount 是要从提名人合约提取到所有者钱包的金额。如上所述，提名人合约中将至少保留 1  TON 。 <br/>
该脚本将生成一个 boc 正文（名为 withdraw.boc），并在所有者的钱包中签署和发送。 <br/>
所有者应在黑色电脑上运行

Command line: `fift -s scripts/fif/withdraw.fif withdraw-amount` where withdraw-amount is the amount to withdraw from the nominator contract to the owner's wallet. As described above, the nominator contract will leave at least 1 TON in the contract.

This script will generate a boc body (named withdraw.boc) that should be signed and sent from the owner's wallet.

From the black computer, the owner should run the following:

- 创建并签署 tx： `fift -s wallet-v3.fif my-wallet single_nominator_address sub_wallet_id seqno amount -B withdraw.boc`，其中 my-wallet 是所有者的 pk 文件（不带扩展名）。1 TON 的金额应足以支付费用（剩余金额将返还给所有者）。withdraw.boc 就是上面生成的 boc。 The amount of 1 TON should be enough to pay fees (the remaining amount will be returned to the owner). The withdraw.boc is the boc generated above.
- 在能上网的电脑上运行`lite-client -C global.config.json -c 'sendfile wallet-query.boc'`发送前一步生成的 boc 文件（wallet-query.boc）。

### 2. `更改验证器`

Used to change the validator address. The validator can only send NEW_STAKE and RECOVER_STAKE to the elector. If the validator's private key is compromised, the validator's address can be changed. The funds are safe in this case, as only the owner can withdraw them.

如果所有者使用的是**热钱包**（不推荐），可使用 [change-validator-deeplink.ts](https://github.com/orbs-network/single-nominator/blob/main/scripts/ts/change-validator-deeplink.ts) 生成一个深层链接来更改验证器地址。 <br/>
命令行： `ts-node scripts/ts/change-validator-deeplink.ts single-nominator-addr new-validator-address` 其中：

new-validator-address（默认为 ZERO 地址）是新验证器的地址。如果您想立即禁用验证器，然后再设置新的验证器，将验证器地址设置为 ZERO 地址可能会比较方便。
所有者应使用装有 tonkeeper 钱包的手机运行 deeplink。<br/>

- single-nominator-addr 是单一提名人地址。
- new-validator-address (defaults to ZERO address) is the address of the new validator. If you want to disable the validator immediately and only later set a new validator, it might be convenient to set the validator address to the ZERO address.

The owner should run the deeplink from a phone with a tonkeeper wallet.

如果所有者使用的是**冷钱包**（推荐），[change-validator.fif](https://github.com/orbs-network/single-nominator/blob/main/scripts/fift/change-validator.fif) 可用于生成包含更改验证器操作码和新验证器地址的 boc 主体。 <br/>
命令行： `fift -s scripts/fif/change-validator.fif new-validator-address`。
该脚本将生成一个 boc 正文（名为 change-validator.boc），并在所有者的钱包中签名和发送。 <br/>
所有者应在黑计算机上运行

Command line: `fift -s scripts/fif/change-validator.fif new-validator-address`.
This script will generate a boc body (change-validator.boc) that should be signed and sent from the owner's wallet.

From the black computer, the owner should run the following:

- 创建并签署 tx： `fift -s wallet-v3.fif my-wallet single_nominator_address sub_wallet_id seqno amount -B change-validator.boc`，其中 my-wallet 是所有者的 pk 文件（不带扩展名）。金额为 1  TON ，足够支付费用（剩余金额将退还所有者）。change-validator.boc 就是上面生成的 boc。 The amount of 1 TON should be enough to pay fees (the remaining amount will be returned to the owner). The change-validator.boc is the boc generated above.
- 在能上网的电脑上运行`lite-client -C global.config.json -c 'sendfile wallet-query.boc'`发送前一步生成的 boc 文件（wallet-query.boc）。

### 3. 显示原始信息

This opcode is not expected to be used under normal conditions.

It can be used to send **any** message from the nominator contract (it must be signed and sent from the owner's wallet).

Use this opcode to recover funds from a changed Elector contract address where standard RECOVER_STAKE fails. The owner must construct a custom message containing the following:

- `opcode=0x7702` (32 bits)
- `query_id` (64 bits)
- `mode` (8 bits)
- The raw message cell reference

### 4. 升级

This emergency opcode (0x9903) should only be used to upgrade the nominator contract in critical situations. The message must include:

- `opcode=0x9903` (32 bits)
- `query_id` (64 bits)
- New contract code cell reference

## 另请参见

- 使用 [Nominator Pool](https://github.com/ton-blockchain/nominator-pool)，max_nominators_count = 1（不必要的复杂性，攻击面更大）。
- [如何使用单一提名池](/v3/guidelines/smart-contracts/howto/single-nominator-pool)
- [单一提名合约](https://github.com/orbs-network/single-nominator)

<Feedback />

