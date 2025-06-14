import Feedback from '@site/src/components/Feedback';

# トラブルシューティング

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

## 3時間以内にノードの同期が完了していません

以下のチェックを行ってみてください：

1. Is the process running without crashes? (Check `systemd` process status)

2. Is there a firewall between the node and the internet? If so, will it pass incoming UDP traffic to the port specified in the field `addrs[0].port` of the `/var/ton-work/db/config.json` file?

3. Is there a NAT between the machine and the internet? If so, ensure that the IP address defined in the `addrs[0].ip` field of the `/var/ton-work/db/config.json` file corresponds to the real public IP of the machine. Note that the value of this field is specified as a signed INT. The `ip2dec` and `dec2ip` scripts located in [ton-tools/node](https://github.com/sonofmom/ton-tools/tree/master/node) can be used to perform conversions.

## 5日間の同期プロセスでもアーカイブノードは同期されていません

チェックリスト[from this section](/v3/guidelines/nodes/nodes-troubleshooting#about-node-progress-in-node-synchronization-within-3時間)を参照してください。

## 遅い同期の潜在的な理由

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

`[Error : 651 : no nodes]` は、あなたのノードが TON ブロックチェーン内の別のノードを見つけることができないことを示します。

This process can sometimes take up to 24 hours. However, if you've been receiving this error for several days, that means that your node cannot synchronize via a current network connection.

:::tip 解決策
You need to check the firewall settings, including any NAT settings if they exist.

It should allow incoming connections on one specific port and outgoing connections from any port.
:::

## バリデータコンソールは設定されていません

`Validator console is not settings` error インストールに使用したユーザー以外のユーザーから `MyTonCtrl` を実行していることを示します。

:::tip 解決策
Run `MyTonCtrl` from [the user you've installed](/v3/guidelines/nodes/running-nodes/full-node#switch-to-non-root-user) it (non-root sudo user).

```bash
mytonctrl
```

:::

### Running MyTonCtrl as different user

別のユーザーとしてMyTonCtrlを実行すると、次のエラーが発生する可能性があります:

```bash
Error:  expected  str,  bytes  or  os.PathLike  object,  not  NoneType
```

To resolve this issue, you need to run MyTonCtrl as the user who installed it.

## 「ブロックが適用されません」とは何を意味しますか?

**Q:** Sometimes we encounter messages like `block is not applied` or `block is not ready` for various requests. Is this normal?

**A:** Yes, this is normal. Typically, it means that you tried to retrieve a block that has not yet reached the node you requested.

**Q:** If comparative frequency appears, does it indicate there is a problem?

**A:** No, it does not. You should check the "Local validator out of sync" value in MyTonCtrl. If it is less than 20 seconds, then everything is functioning normally.

**Keep in mind that the node is continuously synchronizing.** There may be times when you attempt to receive a block that has not yet reached the node you are querying.

In such cases, you should repeat the request after a short delay.

## Out of sync issue with -d flag

`-d`フラグを使用して`MyTonCtrl`をダウンロードした後、`同期が切れない`がタイムスタンプに等しい問題が発生した場合。 ダンプが正しくインストールされていなかった可能性があります(あるいは既に古くなっています)。

:::tip 解決策
推奨される解決策は、新しいダンプで `MyTonCtrl` を再インストールすることです。
:::

If synchronization takes an unusually long time, there may be issues with the dump. Please [contact us](https://t.me/SwiftAdviser) for assistance.

Execute the `mytonctrl` command using the user account under which it was installed.

## エラーコマンド...3秒後にタイムアウトしました timed out after 3 seconds

This error indicates that the local node is not yet synchronized, has been out of sync for less than 20 seconds, and that public nodes are being utilized. Public nodes do not always respond, which can result in a timeout error.

:::tip 解決策
The solution to the problem is to wait for the local node to synchronize or to execute the same command multiple times before proceeding.
:::

## Status コマンドはローカル ノード セクションなしで表示されます。

![](/img/docs/full-node/local-validator-status-absent.png)

If there is no local node section in the node status, typically, this means something went wrong during installation, and the step of creating/assigning a validator wallet was skipped.

Also, check that the validator wallet is specified.

以下を直接確認してください:

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

最善の方法(一時的な検証でない場合のペナルティは小さいですが、中断することなく行うことができます):

1. Perform a clean installation on the new server using `mytonctrl` command, and wait until everything is synchronized.

2. Stop the `mytoncore` and validator `services` on both machines, and make backups on the source and on the new one:

- 2.1 `/usr/local/bin/mytoncore/...`
- 2.2 `/home/${user}/.local/share/mytoncore/...`
- 2.3 `/var/ton-work/db/config.json`
- 2.4 `/var/ton-work/db/config.json.backup`
- 2.5 `/var/ton-work/db/keyring`
- 2.6 `/var/ton-work/keys`

3. ソースから新しいものに転送（内容を置き換えてください）

- 3.1 `/usr/local/bin/mytoncore/...`
- 3.2 `/home/${user}/.local/share/mytoncore/...`
- 3.3 `/var/ton-work/db/config.json`
- 3.4 `/var/ton-work/db/keyring`
- 3.5 `/var/ton-work/keys`

4. `/var/ton-work/db/config.json` で、インストール後に作成された `addrs[0].ip` を編集します (バックアップの `/ton-work/db/config.json.backup` で確認できます)

5. Check the permissions on all replaced files.

6. On the new one, start the `mytoncore` and `validator` services and check that the node synchronizes and then validates.

7. 新しいものでは、バックアップを作成します。

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

## MyTonCtrlのコンソール起動は、メッセージ「Mytonctrlの新しいバージョンを見つけました！移行中！」の後に中断します。 Migrating!"

このエラーが表示された場合には、次の2つのケースがあります:

### Error after updating MytonCtrl

- If MyTonCtrl was installed by the root user: Delete the file `/usr/local/bin/mytonctrl/VERSION.`

- If MyTonCtrl was installed by a non-root user: Delete the file `~/.local/share/mytonctrl/VERSION.`

### Error during MytonCtrl installation

`MytonCtrl` may be running, but the node won't function properly. Remove `MytonCtrl` from your computer and reinstall it, making sure to address any previous errors encountered.

## See also

- [MyTonCtrl FAQ](/v3/guidelines/nodes/faq)
- [MyTonCtrl errors](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-errors)

<Feedback />

