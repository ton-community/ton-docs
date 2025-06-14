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

This error means that the requested account doesn't exist in its current state. That means that this account is simultaneously not deployed AND has zero balance

## 大约 3 小时内节点同步没有进展

尝试执行以下检查：

1. Is the process running without crashes? (Check `systemd` process status)

2. Is there a firewall between the node and the internet? If so, will it pass incoming UDP traffic to the port specified in the field `addrs[0].port` of the `/var/ton-work/db/config.json` file?

3. Is there a NAT between the machine and the internet? If so, ensure that the IP address defined in the `addrs[0].ip` field of the `/var/ton-work/db/config.json` file corresponds to the real public IP of the machine. Note that the value of this field is specified as a signed INT. The `ip2dec` and `dec2ip` scripts located in [ton-tools/node](https://github.com/sonofmom/ton-tools/tree/master/node) can be used to perform conversions.

## 存档节点在同步过程进行了 5 天后仍不同步

查看 [本节中的](/v3/guidelines/nodes/nodes-troubleshooting#about-no-progress-in-node-synchronization-within-3-hours) 检查清单。

## 同步缓慢的潜在原因

The disk is relatively weak, so it’s advisable to check the IOPS, although hosting providers sometimes exaggerate these numbers.

## Cannot apply external message to current state : External message was not accepted

```
Cannot apply external message to current state : External message was not accepted
```

This error indicates that the contract did not accept the external messages. You need to look for the **exitcode** in the trace. An exitcode of -13 means that the account does not have enough TON to accept a message, or it requires more than the available **gas_credit**.

For wallet contracts:

- An exitcode of 33 indicates a wrong **seqno**, which likely means the **seqno** data you are using is outdated.
- An exitcode of 34 indicates a wrong subwallet_id. For older wallet versions (v1/v2), this may mean an incorrect signature.
- An exitcode of 35 means that the message is either expired or the signature is incorrect.

## What does error 651 mean?

`[Error : 651 : no nodes]` 表示您的节点无法在TON区块链中找到另一个节点。

This process can sometimes take up to 24 hours. However, if you've been receiving this error for several days, that means that your node cannot synchronize via a current network connection.

:::tip 解决方案
You need to check the firewall settings, including any NAT settings if they exist.

它应允许一个特定端口的入站连接，以及任意端口的出站连接。
:::

## 验证器控制台未设置

如果遇到 `Validator console is not settings`（验证器控制台未设置）错误，则表明您正在从安装时使用的用户以外的用户运行 "MyTonCtrl"。

:::tip 解决方案
Run `MyTonCtrl` from [the user you've installed](/v3/guidelines/nodes/running-nodes/full-node#switch-to-non-root-user) it (non-root sudo user).

```bash
mytonctrl
```

:::

### Running MyTonCtrl as different user

以不同用户身份运行 MyTonCtrl 可能会引发以下错误：

```bash
Error:  expected  str,  bytes  or  os.PathLike  object,  not  NoneType
```

To resolve this issue, you need to run MyTonCtrl as the user who installed it.

## "block is not applied" 是什么意思？

**Q:** Sometimes we encounter messages like `block is not applied` or `block is not ready` for various requests. Is this normal?

**A:** Yes, this is normal. Typically, it means that you tried to retrieve a block that has not yet reached the node you requested.

**Q:** If comparative frequency appears, does it indicate there is a problem?

**A:** No, it does not. You should check the "Local validator out of sync" value in MyTonCtrl. If it is less than 20 seconds, then everything is functioning normally.

**Keep in mind that the node is continuously synchronizing.** There may be times when you attempt to receive a block that has not yet reached the node you are querying.

In such cases, you should repeat the request after a short delay.

## Out of sync issue with -d flag

如果在使用 `-d` 标志下载 `MyTonCtrl` 后遇到 `out of sync` 等于时间戳的问题，可能是转储没有正确安装（或已经过时）。

:::tip 解决方案
推荐的解决方案是重新安装 `MyTonCtrl` 并使用新的转储。
:::

If synchronization takes an unusually long time, there may be issues with the dump. Please [contact us](https://t.me/SwiftAdviser) for assistance.

Execute the `mytonctrl` command using the user account under which it was installed.

## Error command... 错误命令......3 秒后超时

This error indicates that the local node is not yet synchronized, has been out of sync for less than 20 seconds, and that public nodes are being utilized. Public nodes do not always respond, which can result in a timeout error.

:::tip 解决方案
The solution to the problem is to wait for the local node to synchronize or to execute the same command multiple times before proceeding.
:::

## 状态命令不显示本地节点部分

![](/img/docs/full-node/local-validator-status-absent.png)

If there is no local node section in the node status, typically, this means something went wrong during installation, and the step of creating/assigning a validator wallet was skipped.

Also, check that the validator wallet is specified.

直接检查以下内容：

```bash
MyTonCtrl> get  validatorWalletName
```

If `validatorWalletName` is null then execute the following:

```bash
MyTonCtrl> set  validatorWalletName  validator_wallet_001
```

## Transfer a validator on the new server

:::info
Transfer all keys and configs from the old to the working node and start it. In case something goes wrong on the new one, the source where everything is set up is still available.
:::

最好的方法（虽然暂时不验证的惩罚很小，但可以不间断地进行）：

1. Perform a clean installation on the new server using `mytonctrl` command, and wait until everything is synchronized.

2. Stop the `mytoncore` and validator `services` on both machines, and make backups on the source and on the new one:

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

5. Check the permissions on all replaced files.

6. On the new one, start the `mytoncore` and `validator` services and check that the node synchronizes and then validates.

7. 在新电脑上做一个备份：

```bash
cp  var/ton-work/db/config.json  var/ton-work/db/config.json.backup
```

## MyTonCtrl was installed by another user. Probably you need to launch mtc with ... user

Run MyTonCtrl with the user that used to install it.

For example, the most common case is when someone tries to run MyTonCtrl as a root user, even though it was installed under a different user. In this case, you need to log in to the user who installed MyTonCtrl and run MyTonCtrl from that user.

### MyTonCtrl was installed by another user. Probably you need to launch mtc with `validator` user

Run command `sudo chown <user_name>:<user_name> /var/ton-work/keys/*` where `<user_name>` is user which installed MyTonCtrl.

### MyTonCtrl was installed by another user. Probably you need to launch mtc with `ubuntu` user

Additionally `mytonctrl` command may not work properly with this error. For example, the `status` command may return empty result.

Check `MyTonCtrl` owner:

```bash
ls  -lh  /var/ton-work/keys/
```

If the owner is the `root` user, [uninstall](/v3/guidelines/nodes/running-nodes/full-node#uninstall-mytonctrl) `MyTonCtrl` and [install](/v3/guidelines/nodes/running-nodes/full-node#run-a-node-text) it again **using non-root user**.

Otherwise, log out from the current user and log in as the correct user. If you are using an SSH connection, terminate it to make the message disappear.

## MyTonCtrl 的控制台在显示 "Found new version of mytonctrl! Migrating!"

出现这种错误有两种已知情况：

### Error after updating MytonCtrl

- If MyTonCtrl was installed by the root user: Delete the file `/usr/local/bin/mytonctrl/VERSION.`

- If MyTonCtrl was installed by a non-root user: Delete the file `~/.local/share/mytonctrl/VERSION.`

### Error during MytonCtrl installation

`MytonCtrl` may be running, but the node won't function properly. Remove `MytonCtrl` from your computer and reinstall it, making sure to address any previous errors encountered.

## See also

- [MyTonCtrl FAQ](/v3/guidelines/nodes/faq)
- [MyTonCtrl错误](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-errors)

<Feedback />

