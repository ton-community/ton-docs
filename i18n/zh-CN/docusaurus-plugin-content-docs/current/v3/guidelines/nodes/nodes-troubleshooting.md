import Feedback from '@site/src/components/Feedback';

# 故障排除

This section provides answers to the most common questions regarding how to run nodes.

## Failed to get account state

```
Failed to get account state
```

This error suggests that there are problems when trying to search for the account in the shard state. It likely means that the liteserver node is syncing too slowly, causing the MasterChain synchronization to advance faster than the ShardChain (BaseChain) synchronization. As a result, while the node is aware of the latest MasterChain block, it is unable to verify the account state in the most recent ShardChain block, leading to the error.

## Failed to unpack account state

```
Failed to unpack account state
```

该错误表示请求的账户在当前状态下不存在。这意味着该账户同时未部署且余额为零 That means that this account is simultaneously not deployed AND has zero balance

## 大约 3 小时内节点同步没有进展

尝试执行以下检查：

1. 进程是否正在运行而没有崩溃？ (Check `systemd` process status)

2. Is there a firewall between the node and the internet? 节点和互联网之间有防火墙吗？如果有，它会将传入的 UDP 流量传输到 `/var/ton-work/db/config.json` 文件中的 `addrs[0].port` 字段指定的端口吗？

3. Is there a NAT between the machine and the internet? If so, ensure that the IP address defined in the `addrs[0].ip` field of the `/var/ton-work/db/config.json` file corresponds to the real public IP of the machine. Note that the value of this field is specified as a signed INT. The `ip2dec` and `dec2ip` scripts located in [ton-tools/node](https://github.com/sonofmom/ton-tools/tree/master/node) can be used to perform conversions.

## 存档节点在同步过程进行了 5 天后仍不同步

查看 [本节中的](/v3/guidelines/nodes/nodes-troubleshooting#about-no-progress-in-node-synchronization-within-3-hours) 检查清单。

## 同步缓慢的潜在原因

磁盘相对较弱。建议检查磁盘的 IOPS（尽管有时托管服务提供商会夸大这些数字）。

## Cannot apply external message to current state : External message was not accepted

```
Cannot apply external message to current state : External message was not accepted
```

This error indicates that the contract did not accept the external messages. You need to look for the **exitcode** in the trace. An exitcode of -13 means that the account does not have enough TON to accept a message, or it requires more than the available **gas_credit**.

For wallet contracts:

- An exitcode of 33 indicates a wrong **seqno**, which likely means the **seqno** data you are using is outdated.
- An exitcode of 34 indicates a wrong subwallet_id. For older wallet versions (v1/v2), this may mean an incorrect signature.
- An exitcode of 35 means that the message is either expired or the signature is incorrect.

## 错误 651 是什么意思？

`[Error : 651 : no nodes]` 表示您的节点无法在TON区块链中找到另一个节点。

This process can sometimes take up to 24 hours. 有时，这一过程可能需要 24 小时。但是，如果您连续几天都收到这个错误，那就意味着您的节点无法通过当前网络连接进行同步。

:::tip 解决方案
You need to check the firewall settings, including any NAT settings if they exist.

它应允许一个特定端口的入站连接，以及任意端口的出站连接。
:::

## 验证器控制台未设置

如果遇到 `Validator console is not settings`（验证器控制台未设置）错误，则表明您正在从安装时使用的用户以外的用户运行 "MyTonCtrl"。

:::tip 解决方案
例如，最常见的情况是，尽管 MyTonCtrl 是以不同用户的身份安装的，但用户却试图以 root 用户身份运行 MyTonCtrl。在这种情况下，您需要登录安装 MyTonCtrl 的用户，并从该用户运行 MyTonCtrl。

```bash
mytonctrl
```

:::

### \###以不同用户身份运行 MyTonCtrl

以不同用户身份运行 MyTonCtrl 可能会引发以下错误：

```bash
Error: expected str, bytes or os.PathLike object, not NoneType
```

要解决这个问题，应该以安装 MyTonCtrl 的用户身份运行 MyTonCtrl。

## "block is not applied" 是什么意思？

**问：** 有时我们收到各种请求的 `block is not applied` 或 `block is not ready`，这正常吗？ Is this normal?

**A:** Yes, this is normal. **答：** 这是正常现象，通常这意味着您试图检索的数据块没有到达您要求的节点。

**问：** 如果出现比较频繁，是否意味着某个地方出现了问题？

**A:** No, it does not. 你需要检查 mytonctrl 中的 "Local validator out of sync" 值。如果少于 20 秒，则一切正常。 If it is less than 20 seconds, then everything is functioning normally.

但需要注意的是，节点是在不断同步的。有时，您可能会尝试接收一个尚未到达您请求的节点的数据块。

您需要略微延迟后重复请求。

## Out of sync issue with -d flag

如果在使用 `-d` 标志下载 `MyTonCtrl` 后遇到 `out of sync` 等于时间戳的问题，可能是转储没有正确安装（或已经过时）。

:::tip 解决方案
推荐的解决方案是重新安装 `MyTonCtrl` 并使用新的转储。
:::

If synchronization takes an unusually long time, there may be issues with the dump. Please [contact us](https://t.me/SwiftAdviser) for assistance.

请从安装它的用户运行 `mytonctrl`。

## Error command... 错误命令......3 秒后超时

该错误表示本地节点尚未同步（同步时间少于 20 秒），正在使用公共节点。
公共节点并不总是响应，最终会出现超时错误。 Public nodes do not always respond, which can result in a timeout error.

:::tip 解决方案
解决问题的办法是等待本地节点同步或多次执行同一命令后再执行。
:::

## 状态命令不显示本地节点部分

![](/img/docs/full-node/local-validator-status-absent.png)

如果节点状态中没有本地节点部分，通常意味着安装过程中出了问题，跳过了创建/指定验证器钱包的步骤。
请同时检查是否指定了验证器钱包。

Also, check that the validator wallet is specified.

直接检查以下内容：

```bash
mytonctrl> get validatorWalletName
```

如果 validatorWalletName 为空，则执行以下操作：

```bash
mytonctrl> set validatorWalletName validator_wallet_001
```

## 在新服务器上转移验证器

:::info
将旧节点上的所有密钥和配置转移到工作节点上，然后启动它。万一在新节点上出了问题，还有一切都已设置好的源节点。 In case something goes wrong on the new one, the source where everything is set up is still available.
:::

最好的方法（虽然暂时不验证的惩罚很小，但可以不间断地进行）：

1. 使用 `mytonctrl` 在新服务器上进行简洁安装，并等待一切同步。

2. 停止两台机器上的 `mytoncore` 和验证器 `services`，备份源程序和新程序：

- 2.1 `/usr/local/bin/mytoncore/...`
- 2.2 `/home/${user}/.local/share/mytoncore/...`
- 2.3 `/var/ton-work/db/config.json`
- 2.4 `/var/ton-work/db/config.json.backup`
- 2.5 `/var/ton-work/db/keyring`
- 2.6 `/var/ton-work/keys`

3. 从源文件转移到新文件（替换内容）：

- 3.1 `/usr/local/bin/mytoncore/...`
- 3.2 `/home/${user}/.local/share/mytoncore/...`
- 3.3 `/var/ton-work/db/config.json`
- 3.4 `/var/ton-work/db/keyring`
- 3.5 `/var/ton-work/keys`

4. 在 `/var/ton-work/db/config.json`中编辑 `addrs[0].ip` 为安装后的当前值（可在备份 `/ton-work/db/config.json.backup` 中查看）。

5. 检查所有被替换文件的权限

6. 在新节点上，启动 `mytoncore` 和 `validator` 服务，检查节点是否同步，然后验证

7. 在新电脑上做一个备份：

```bash
cp var/ton-work/db/config.json var/ton-work/db/config.json.backup
```

## MyTonCtrl was installed by another user. Probably you need to launch mtc with ... user

使用安装用户运行 MyTonCtrl。

For example, the most common case is when someone tries to run MyTonCtrl as a root user, even though it was installed under a different user. In this case, you need to log in to the user who installed MyTonCtrl and run MyTonCtrl from that user.

### MyTonCtrl was installed by another user. Mytonctrl 由其他用户安装。您可能需要使用 `validator` 用户启动 mtc

运行命令 `sudo chown<user_name>:<user_name> /var/ton-work/keys/*` 其中 `<user_name>` 是安装了 mytonctrl 的用户。

### MyTonCtrl was installed by another user. Mytonctrl 是由其他用户安装的。您可能需要用 `ubuntu` 用户启动 mtc

此外，如果出现此错误，`mytonctrl` 可能无法正常工作。例如，`status` 命令可能返回空结果。 For example, the `status` command may return empty result.

检查 `mytonctrl` 所有者：

```bash
ls -lh /var/ton-work/keys/
```

如果所有者是 `root` 用户，请先 [卸载](/v3/guidelines/nodes/running-nodes/full-node#uninstall-mytonctrl) `mytonctrl`，然后以 **非 root 用户** [重新安装](/v3/guidelines/nodes/running-nodes/full-node#run-a-node-text)。

Otherwise, log out from the current user and log in as the correct user. If you are using an SSH connection, terminate it to make the message disappear.

## MyTonCtrl 的控制台在显示 "Found new version of mytonctrl! Migrating!"

出现这种错误有两种已知情况：

### 更新 MytonCtrl 后出现错误

- 如果 MyTonCtrl 是由 root 用户安装的：删除文件 `/usr/local/bin/mytonctrl/VERSION`。

- 如果 MyTonCtrl 是由非 root 用户安装的：删除文件 `~/.local/share/mytonctrl/VERSION`.

### MytonCtrl 安装过程中出现错误

`MytonCtrl` may be running, but the node won't function properly. `MytonCtrl` 可以打开，但节点无法正常工作。请从计算机中删除 `MytonCtrl`，然后重新安装，确保解决以前遇到的任何错误。

## 另请参见

- [MyTonCtrl FAQ](/v3/guidelines/nodes/faq)
- [MyTonCtrl错误](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-errors)

<Feedback />

