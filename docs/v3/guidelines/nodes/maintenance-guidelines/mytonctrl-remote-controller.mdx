import Feedback from '@site/src/components/Feedback';

# MyTonCtrl remote controller

MyTonCtrl and TON Node can be used on separate machines. There are some advantages of using that:

* To participate in elections, the validator wallet's private key is required by MyTonCtrl. If the Node server 
is compromised, it could lead to unauthorized access to the wallet funds. As a security measure, MyTonCtrl can be hosted on a separate server.
* MyTonCtrl continually expands its functionality, which may consume resources crucial for the Node.
* Probably in future big validators will be able to host several instances of MyTonCtrl controlling several nodes on one server.  

## Setting up

Prepare 2 servers: one is for running TON Node that meets the requirements and one is for running MyTonCtrl which does not require a lot of resources.

1. Node server:

Install MyTonCtrl in `only-node` mode:

```
wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
sudo bash install.sh -m validator -l
```

It will install TON Node and create a backup file which you need to download and transfer to the Controller server:

```log
...
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start CreateSymlinks fuction
Local DB path: /home/user/.local/share/mytoncore/mytoncore.db
[info]    01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start ConfigureOnlyNode function
[1/2] Copied files to /tmp/mytoncore/backupv2
[2/2] Backup successfully created in mytonctrl_backup_hostname_timestamp.tar.gz!
If you wish to use archive package to migrate node to different machine please make sure to stop validator and mytoncore on donor (this) host prior to migration.
[info]    01.01.2025, 00:00:00.000 (UTC)  <MainThread>  Backup successfully created. Use this file on the controller server with `--only-mtc` flag on installation.
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  Start/restart mytoncore service
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  sleep 1 sec
[5/5] Mytonctrl installation completed
```

Note, that you still got access to MyTonCtrl console on this server, which you need to update the Node, watch Node metrics, etc.
Also, it creates a `mytoncore` service which is used to send telemetry (if it was not disabled). 
If you want to return control of the node to this server, use command

```bash
MyTonCtrl> set onlyNode false
systemctl restart mytoncore
```

2. Controller server

Install MyTonCtrl in `only-mtc` mode:

```
wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
sudo bash install.sh -p /home/user/mytonctrl_backup_hostname_timestamp.tar.gz -o
```

Check the `status` command, there should appear `Node IP address` field:

```log
MyTonCtrl> status
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start GetValidatorWallet function
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start GetLocalWallet function
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start GetWalletFromFile function
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start WalletVersion2Wallet function
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start GetDbSize function
===[ Node status ]===
Node IP address: 0.0.0.0
Validator index: n/a
...
```

## Notes

On updates, you need to `update` and `upgrade` both Node server and Controller server

<Feedback />

