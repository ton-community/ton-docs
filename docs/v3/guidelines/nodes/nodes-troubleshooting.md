import Feedback from '@site/src/components/Feedback';

# Troubleshooting

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

## About no progress in node synchronization within 3 hours

Try to perform the following checks:

1. Is the process running without crashes? (Check `systemd` process status)

2. Is there a firewall between the node and the internet? If so, will it pass incoming UDP traffic to the port specified in the field `addrs[0].port` of the `/var/ton-work/db/config.json` file?

3. Is there a NAT between the machine and the internet? If so, ensure that the IP address defined in the `addrs[0].ip` field of the `/var/ton-work/db/config.json` file corresponds to the real public IP of the machine. Note that the value of this field is specified as a signed INT. The `ip2dec` and `dec2ip` scripts located in [ton-tools/node](https://github.com/sonofmom/ton-tools/tree/master/node) can be used to perform conversions.

## Archive node is out of sync even after 5 days of the syncing process

Go through the checklist [from this section](/v3/guidelines/nodes/nodes-troubleshooting#about-no-progress-in-node-synchronization-within-3-hours).

## Slow sync potential reasons

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

`[Error : 651 : no nodes]` indicates that your node cannot locate another node within the TON Blockchain.

This process can sometimes take up to 24 hours. However, if you've been receiving this error for several days, that means that your node cannot synchronize via a current network connection.

:::tip Solution
You need to check the firewall settings, including any NAT settings if they exist. 

It should allow incoming connections on one specific port and outgoing connections from any port.
:::

## Validator console is not settings

If you encounter the `Validator console is not settings` error, it indicates that you are running `MyTonCtrl` from a user other than the one you used for the installation.

:::tip Solution
Run `MyTonCtrl` from [the user you've installed](/v3/guidelines/nodes/running-nodes/full-node#switch-to-non-root-user) it (non-root sudo user).

```bash
mytonctrl
```
:::

### Running MyTonCtrl as different user

Running MyTonCtrl as a different user may trigger the following error:

```bash
Error:  expected  str,  bytes  or  os.PathLike  object,  not  NoneType
```

To resolve this issue, you need to run MyTonCtrl as the user who installed it.

## What does "block is not applied" mean?

**Q:** Sometimes we encounter messages like `block is not applied` or `block is not ready` for various requests. Is this normal?  

**A:** Yes, this is normal. Typically, it means that you tried to retrieve a block that has not yet reached the node you requested.  

**Q:** If comparative frequency appears, does it indicate there is a problem?  

**A:** No, it does not. You should check the "Local validator out of sync" value in MyTonCtrl. If it is less than 20 seconds, then everything is functioning normally.  

**Keep in mind that the node is continuously synchronizing.** There may be times when you attempt to receive a block that has not yet reached the node you are querying. 

In such cases, you should repeat the request after a short delay.

## Out of sync issue with -d flag

If you encounter an issue where the `out of sync` equals the timestamp after downloading `MyTonCtrl` with the `-d` flag, it's possible that the dump wasn't installed correctly (or it's already outdated).

:::tip Solution
The recommended solution is to reinstall `MyTonCtrl` again with the new dump.
:::

If synchronization takes an unusually long time, there may be issues with the dump. Please [contact us](https://t.me/SwiftAdviser) for assistance.

Execute the `mytonctrl` command using the user account under which it was installed.

## Error command... timed out after 3 seconds

This error indicates that the local node is not yet synchronized, has been out of sync for less than 20 seconds, and that public nodes are being utilized. Public nodes do not always respond, which can result in a timeout error.

:::tip Solution
The solution to the problem is to wait for the local node to synchronize or to execute the same command multiple times before proceeding.
:::

## Status command displays without local node section

![](/img/docs/full-node/local-validator-status-absent.png)

If there is no local node section in the node status, typically, this means something went wrong during installation, and the step of creating/assigning a validator wallet was skipped.

Also, check that the validator wallet is specified.

Check directly the following:

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

The best way (while the penalty for temporary non-validation is small, it can be done without interruption):

1. Perform a clean installation on the new server using `mytonctrl` command, and wait until everything is synchronized.

2. Stop the `mytoncore` and validator `services` on both machines, and make backups on the source and on the new one:
- 2.1 `/usr/local/bin/mytoncore/...`
- 2.2 `/home/${user}/.local/share/mytoncore/...`
- 2.3 `/var/ton-work/db/config.json`
- 2.4 `/var/ton-work/db/config.json.backup`
- 2.5 `/var/ton-work/db/keyring`
- 2.6 `/var/ton-work/keys`

3. Transfer from the source to the new one (replace the contents):
- 3.1 `/usr/local/bin/mytoncore/...`
- 3.2 `/home/${user}/.local/share/mytoncore/...`
- 3.3 `/var/ton-work/db/config.json`
- 3.4 `/var/ton-work/db/keyring`
- 3.5 `/var/ton-work/keys`

4. In `/var/ton-work/db/config.json` edit `addrs[0].ip` to the current one, which was after installation (can be seen in the backup `/ton-work/db/config.json.backup`)

5. Check the permissions on all replaced files.

6. On the new one, start the `mytoncore` and `validator` services and check that the node synchronizes and then validates.

7. On the new one, make a backup:
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

## MyTonCtrl's console launch breaks after message "Found new version of mytonctrl! Migrating!"

There are two known cases when this error appears:

### Error after updating MytonCtrl

* If MyTonCtrl was installed by the root user: Delete the file `/usr/local/bin/mytonctrl/VERSION.`

* If MyTonCtrl was installed by a non-root user: Delete the file `~/.local/share/mytonctrl/VERSION.`

### Error during MytonCtrl installation

`MytonCtrl` may be running, but the node won't function properly. Remove `MytonCtrl` from your computer and reinstall it, making sure to address any previous errors encountered.

## See also

* [MyTonCtrl FAQ](/v3/guidelines/nodes/faq)

* [MyTonCtrl errors](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-errors)

<Feedback />

