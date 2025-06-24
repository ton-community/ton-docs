import Feedback from '@site/src/components/Feedback';

# 验证器节点

Network validators confirm all user transactions. If all validators agree that a transaction is valid, it gets added to the blockchain. Invalid transactions are rejected. See more information [here](https://ton.org/validators).

## 最低硬件要求

- 16 核 CPU
- 128 GB 内存
- 1TB NVME 固态硬盘 _或_ 预配置 64+k IOPS 存储器
- 1 Gbit/s 网络连接
- 公共 IP 地址（_固定 IP 地址_）
- 峰值流量为每月 100 TB

> 通常情况下，您需要至少 1 Gbit/s 的连接才能可靠地满足峰值负载（平均负载预计约为 100 Mbit/s）。

> 我们请验证人员特别注意磁盘的 IOPS 要求，这对网络的平稳运行至关重要。

## 端口转发

所有类型的节点都需要一个静态外部 IP 地址，一个 UDP 端口用于转发传入连接，所有传出连接都是开放的 - 节点使用随机端口进行新的传出连接。节点必须通过 NAT 对外可见。 The node must also be visible to the outside world over the NAT.

可以通过网络提供商或 [租用服务器](/v3/guidelines/nodes/running-nodes/full-node#recommended-providers)来运行节点。

:::info
可以使用 `netstat -tulpn` 命令来查找打开的 UDP 端口。
:::

## 先决条件

### 了解惩罚政策：

如果验证者在验证轮次中处理的区块数量少于预期数量的 90%，该验证者将被罚款 **101 TON**。\
详细信息请参阅：[惩罚政策](/v3/documentation/infra/nodes/validation/staking-incentives#decentralized-system-of-penalties)。

了解有关 [slashing policy](/v3/documentation/infra/nodes/validation/staking-incentives#decentralized-system-of-penalties) 的更多信息。

### 运行 Fullnode

在阅读本文之前，请先启动 [Full Node](/v3/guidelines/nodes/running-nodes/full-node)。

Ensure that validator mode is enabled by using the `status_modes` command. 使用 `status_modes` 命令检查验证模式是否启用。如果未启用，请参阅 [mytonctrl enable_mode 命令](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview#enable_mode)。

## 架构

![image](/img/nominator-pool/hot-wallet.png)

## 查看钱包列表

使用 `wl` 命令查看 **MyTonCtrl** 控制台中的可用钱包列表：

```sh
wl
```

在安装 **mytonctrl** 时，会创建 **validator_wallet_001** 钱包：

![wallet list](/img/docs/nodes-validator/manual-ubuntu_mytonctrl-wl_ru.png)

## 激活钱包

1. 向钱包发送必要数量的硬币并激活它。 The minimum stake is approximately **300K TON**, and the maximum is about **1M** TON. 通过 [toncan.com](https://tonscan.com/validation)查看当前质押，了解所需的金币数量。 阅读更多内容[最大和最小质押的计算方法](/v3/documentation/infra/nodes/validation/staking-incentives#values-of-stakes-max-effective-stake)。

2. 使用 `vas` 命令显示传输历史：

```sh
vas [wallet name]
```

3. Use the `aw` command to activate the wallet. 使用 `aw` 命令激活钱包（"钱包名称 "是可选项，如果没有提供参数，将激活所有可用的钱包）

```sh
aw [wallet name]
```

![account history](/img/docs/nodes-validator/manual-ubuntu_mytonctrl-vas-aw_ru.png)

## 您的验证器已准备就绪

**Mytoncore** 将自动参加选举。它会将钱包余额分成两部分，并将其作为参加选举的质押。您也可以手动设置质押大小： These parts are then used as a stake for participation. Additionally, you can manually adjust the stake size:

```sh
set stake 50000
```

The command above sets the stake size to 50k Toncoins. If the bet is accepted and your node becomes a validator, the stake can only be withdrawn in the second election as per the electorate's rules.

![setting stake](/img/docs/nodes-validator/manual-ubuntu_mytonctrl-set_ru.png)

## Adhere to rules

:::caution Slashing policy for underperforming validators
If a validator processes less than 90% of the expected number of blocks during a validation round, that validator will incur a fine of 101 TON. For more information, read about the [slashing policy](/v3/documentation/infra/nodes/validation/staking-incentives#decentralized-system-of-penalties).
:::

作为 TON 验证器，请确保您遵循这些关键步骤，以确保网络的稳定性，并避免将来受到削减处罚。

### Important measures:

1. 关注 [@tonstatus](https://t.me/tonstatus)，打开通知，并准备在必要时应用紧急更新。

2. 确保您的硬件满足或超过 [最低系统要求](/v3/guidelines/nodes/running-nodes/validator-node#minimal-hardware-requirements)。

3. 我们强烈要求您使用 [mytonctrl](https://github.com/ton-blockchain/mytonctrl)。

    - 在 `mytonctrl` 中保持更新通知并启用遥测功能： `set sendTelemetry true`.

4. Set up monitoring dashboards for RAM, disk, network, and CPU usage. For technical assistance, please contact [@mytonctrl_help_bot](https://t.me/mytonctrl_help_bot).

5. 利用仪表板监控验证器的效率。

    - 通过 `check_ef` 与 `mytonctrl` 检查。

    - [使用 API 构建仪表板](/v3/guidelines/nodes/running-nodes/validator-node#validation-and-effectiveness-apis)。

:::info
`MyTonCtrl` enables you to evaluate the performance of validators using the command `check_ef`. This command provides efficiency data for both the last round and the current round. The data is retrieved by calling the `checkloadall` utility. Make sure that your efficiency is above 90% for the entire round period.
:::

:::info
If you encounter low efficiency, take action to resolve the issue. If necessary, contact technical support at [@mytonctrl_help_bot](https://t.me/mytonctrl_help_bot).
:::

## 验证和有效性 API

:::info
请使用这些 API 设置仪表板以监控您的验证器。
:::

### 受罚验证器跟踪器

您可以使用 [@tonstatus_notifications](https://t.me/tonstatus_notifications) 跟踪每轮受罚的验证器。

#### 验证 API

https://elections.toncenter.com/docs - 使用此 API 可获取当前和过去验证轮次（周期）的信息--轮次时间、哪些验证者参与了这些轮次、他们的质押等。 还提供有关当前和以往选举（验证轮）的信息。

#### 效率API

https://toncenter.com/api/qos/index.html#/ - 使用此 API 获取验证器在一段时间内的效率信息。

This API analyzes data from the catchain to provide an estimate of a validator's efficiency. It serves as an alternative to the `checkloadall` utility.

该应用程序接口会分析来自 catchain 的信息，并对验证器的效率做出估计。此 API 不使用 checkloadall 工具，而是其替代工具。
与只在验证轮次上工作的 `checkloadall` 不同，在此 API 中，您可以设置任何时间间隔来分析验证器的效率。

##### 工作流程：

1. 将验证器的 ADNL 地址和时间间隔（`from_ts`, `to_ts`）传递给 API。为了获得准确的结果，需要足够长的时间间隔，例如从 18 小时前到当前时刻。 For accurate results, choose a sufficient interval, such as 18 hours ago to the present moment.

2. Retrieve the result. If your efficiency percentage is below 80%, your validator is malfunctioning.

3. 重要的是，您的验证员必须参与验证，并在指定时间内使用相同的 ADNL 地址。 例如，如果验证员每两轮就参加一次验证，那么您只需要指定他参加验证的时间间隔。否则，您将得到错误的低估结果。 Failing to do so may result in an inaccurate underestimate. 该功能不仅适用于 Masterchain 验证者（索引 < 100），也适用于其他验证者（索引 > 100）。

## 支持

请联系技术支持 [@mytonctrl_help_bot](https://t.me/mytonctrl_help_bot)。该机器人仅适用于验证器，不会帮助解决常规节点的问题。 This bot is for validators only and will not assist with questions for regular nodes.

如果您有一个常规节点，请联系该小组：[@mytonctrl_help](https://t.me/mytonctrl_help).

## 另请参见

- [运行全节点](/v3/guidelines/nodes/running-nodes/full-node)
- [故障排除](/v3/guidelines/nodes/nodes-troubleshooting)
- [激励机制](/v3/documentation/infra/nodes/validation/staking-incentives)
    <Feedback />

