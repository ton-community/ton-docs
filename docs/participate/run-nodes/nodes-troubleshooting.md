# Troubleshooting

This section contains answers to the most frequently asked questions about running nodes.


## Failed to get account state

```
Failed to get account state
```

This error means that there are issues during search for this account in shard state.
Most probably it means that liteserver node is syncing too slow, in particular the Masterchain synchronisation overtook shardchains (Basechain) synchronisation. In this case node knows the recent Masterchain block but can not check account state in recent shardchain block and returns Failed to get account state.


## Failed to unpack account state

```
Failed to unpack account state
```
This error means that requested account doesn't exist in current state. That means that this account is simultaneously is not deployed AND has zero balance

## Cannot apply external message to current state : External message was not accepted

```
Cannot apply external message to current state : External message was not accepted
```
This error means that contract didn't accepted external message. You need to find exitcode in trace. -13 means that account doesn't have enough TON to accept message (or it requires more than gas_credit). In case of wallet contracts exitcode=33 means wrong seqno (probably seqno data you use is outdatd), exitcode=34 means wrong subwallet_id (for old wallets v1/v2 it means wrong signature), exitcode=35 means that either message is expired or signature is wrong.

## What does Error 651 mean?

`[Error : 651 : no nodes]` indicates that your node cannot locate another node within the TON Blockchain.

Sometimes, this process can take up to 24 hours. However, if you've been receiving this error for several days, that means that your node cannot synchronize via a current network connection.

:::tip Solution
You need to check the firewall settings, including any NAT settings if they exist.

It should allow incoming connections on one specific port and outgoing connections from any port.
:::

## Validator console is not settings

If you encounter the `Validator console is not settings` error, it indicates that you are running `MyTonCtrl` from a user other than the one you used for the installation.

:::tip Solution
Run `MyTonCtrl` from [the user you've installed](/participate/run-nodes/full-node#prerequisites-1) it (non-root sudo user).

```bash
mytonctrl
```
:::

###Running MyTonCtrl as Different User

Running MyTonCtrl as a different user may trigger the following error:

```bash
Error: expected str, bytes or os.PathLike object, not NoneType
```

To resolve this, you should run MyTonCtrl as the user who installed it.

## What does "block is not applied" mean?

__Q:__ Sometimes we get `block is not applied` or `block is not ready` for various requests - is this normal?

__A:__ This is normal, typically this means you tried to retrieve block, which does not reach the node you asked.

__Q:__ If comparative frequency appears, does it mean there is a problem somewhere?

__A:__ No. You need to check "Local validator out of sync" value in mytonctrl. If it's less than 20 seconds, then everything is fine.

But you need to keep in mind that the node is constantly synchronizing. Sometimes, you may try to receive a block that has not reached the node you requested.

You need to repeat the request with a slight delay.

## Out of Sync Issue with -d Flag

If you encounter an issue where the `out of sync` equals the timestamp after downloading `MyTonCtrl` with the `-d` flag, it's possible that the dump wasn't installed correctly (or it's already outdated).

:::tip Solution
The recommended solution is to reinstall `MyTonCtrl` again with the new dump.
:::

If syncing takes an unusually long time, there may have been issues with the dump. Please [contact us](https://t.me/SwiftAdviser) for assistance.

Please, run `mytonctrl` from the user you've installed it.


## Error command<...> timed out after 3 seconds

This error means that the local node is not yet synchronized(out of sync lesser then 20 sec) and public nodes are being used.
Public nodes do not always respond and end up with a timeout error.

:::tip Solution
The solution to the problem is to wait for the local node to synchronize or execute the same command several times before execution.
:::

## Status command displays without local node section

![](\img\docs\full-node\local-validator-status-absent.png)

If there is no local node section in the node status, typically this means, something went wrong during installation and the step of creating/assigning a validator wallet was skipped.
Also check that the validator wallet is specified.

Check directly the following:

```bash
mytonctrl> get validatorWalletName
```

If validatorWalletName is null then execute the following:

```bash
mytonctrl> set validatorWalletName validator_wallet_001
```


## Transfer a Validator on the new Server

:::info
Transfer all keys and configs from the old to the working node and start it. In case something goes wrong on the new one, there is still the source where everything is set up.
:::

The best way (while the penalty for temporary non-validation is small, it can be done without interruption):

1. Perform a clean installation on the new server using `mytonctrl`, and wait until everything is synchronized.

2. Stop the `mytoncore` and validator `services` on both machines, make backups on the source and on the new one:

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

5. Check the permissions on all replaced files

6. On the new one, start the `mytoncore` and `validator` services, check that the node synchronizes and then validates

7. On the new one, make a backup:

```bash
cp var/ton-work/db/config.json var/ton-work/db/config.json.backup
```

## See Also

* [MyTonCtrl FAQ](/participate/run-nodes/faq)