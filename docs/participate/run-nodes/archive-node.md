# Archive Node

:::info
Read about [Full Node](/participate/run-nodes/full-node) before this article
:::

## Overview

An Archive Node is a type of Full Node that stores extended historical data of a blockchain. If you are creating a blockchain explorer or a similar application that requires access to historical data, using an Archive Node as an indexer is recommended.

## OS requirements

We highly recommend install mytonctrl using the supported operating systems:
* Ubuntu 20.04
* Ubuntu 22.04
* Debian 11

## Hardware requirements 

* 16 x Cores CPU 
* 128GB ECC Memory 
* 8TB SSD _OR_ Provisioned 64+k IOPS storage
* 1 Gbit/s network connectivity
* 16 TB/month traffic on peak load
* a public IP address (fixed IP address)


__Note__: 4TB assumes usage of zfs volume with compression enabled

## Installation

### Install ZFS and Prepare Volume

Dumps come in form of ZFS Snapshots compressed using plzip, you need to install zfs on your host and restore the dump, see [Oracle Documentation](https://docs.oracle.com/cd/E23824_01/html/821-1448/gavvx.html#scrolltoc) for more details. 

Usually, it's a good idea to create a separate ZFS pool for your node on a _dedicated SSD drive_, this will allow you to easily manage storage space and backup your node.

1. Install [zfs](https://ubuntu.com/tutorials/setup-zfs-storage-pool#1-overview)
```shell
sudo apt install zfsutils-linux
```
2. [Create pool](https://ubuntu.com/tutorials/setup-zfs-storage-pool#3-creating-a-zfs-pool) on your dedicated 4TB `<disk>` and name it `data`

```shell
sudo zpool create data <disk>
```
3. Before restoring we highly recommend to enable compression on parent ZFS filesystem, this will save you a [lot of space](https://www.servethehome.com/the-case-for-using-zfs-compression/). To enable compression for the `data` volume enter using root account:

```shell
sudo zfs set compression=lz4 data
```

### Install MyTonCtrl

Please, use a [Running Full Node](/participate/run-nodes/full-node) to **install** and **run** mytonctrl.

### Run an Archive Node

#### Prepare the node

1. Before performing a restore, you must stop the validator using root account:
```shell
sudo -s
systemctl stop validator.service
```
2. Make a backup of `ton-work` config files (we will need the `/var/ton-work/db/config.json`, `/var/ton-work/keys`, and `/var/ton-work/db/keyring`).
```shell
mv /var/ton-work /var/ton-work.bak
```

#### Download the dump

1. Request `user` and `password` credentials to gain access for downloading dumps in the [@TONBaseChatEn](https://t.me/TONBaseChatEn) Telegram chat.
2. Here is an example command to download & restore the **mainnet** dump from the ton.org server:

```shell
wget --user <usr> --password <pwd> -c https://archival-dump.ton.org/dumps/latest.zfs.lz | pv | plzip -d -n <cores> | zfs recv data/ton-work
```

To install **testnet** dump use:

```shell
wget --user <usr> --password <pwd> -c https://archival-dump.ton.org/dumps/latest_testnet.zfs.lz | pv | plzip -d -n <cores> | zfs recv data/ton-work
```

The size of the dump is approximately __4TB__, so it may take several days (up to 4 days) to download and restore. The dump size can increase as the network grows.

Prepare and run the command:
1. Install the tools if necessary (`pv`, `plzip`)
2. Replace `<usr>` and `<pwd>` with your credentials
2. Tell `plzip` to use as many cores as your machine allows to speed up extraction (`-n`)

#### Mount the dump

1. Mount zfs:
```shell
zfs set mountpoint=/var/ton-work data/ton-work && zfs mount data/ton-work
```
2. Restore `db/config.json`, `keys` and `db/keyring` from backup to `/var/ton-work`
```shell
cp /var/ton-work.bak/db/config.json /var/ton-work/db/config.json
cp -r /var/ton-work.bak/keys /var/ton-work/keys
cp -r /var/ton-work.bak/db/keyring /var/ton-work/db/keyring
```
3. Make sure that permissions for `/var/ton-work` and `/var/ton-work/keys` dirs promoted correctly:

- The owner for the `/var/ton-work/db` dir should be `validator` user:

```shell
chown -R validator:validator /var/ton-work/db
```

- The owner for the `/var/ton-work/keys` dir should be `ubuntu` user:

```shell
chown -R ubuntu:ubuntu /var/ton-work/keys
```

#### Update Configuration

Update node configuration for the archive node.

1. Open the node config file `/etc/systemd/system/validator.service`
```shell
nano /etc/systemd/system/validator.service
```

2. Add storage settings for the node in the `ExecStart` line:
```shell
--state-ttl 315360000 --archive-ttl 315360000 --block-ttl 315360000
```

:::info
Please be patient once you start the node and observe the logs.
Dumps come without DHT caches, so it will take some time for your node to find other nodes and sync with them.
Depending on the age of the snapshot and your internet connection speed,
it might take your node anywhere **from a few hours to several days** to catch up with the network.
**On a minimum setup, this process can take up to 5 days.**
This is normal.
:::

:::caution
If the node sync process has already taken 5 days, but the node is still out of sync, you should check the
[troubleshooting section](/participate/run-nodes/nodes-troubleshooting#archive-node-is-out-of-sync-even-after-5-days-of-the-syncing-process).
:::

#### Start the node

1. Start the validator by running the command: 

```shell
systemctl start validator.service
```

2. Open `mytonctrl` from _local user_ and check the node status using the `status`.


## Node maintenance

Node database requires cleansing from time to time (we advise once a week), to do so please perform following steps as root:


1. Stop validator process (Never skip this!)
```shell
sudo -s
systemctl stop validator.service
```
2. Remove old logs
```shell
find /var/ton-work -name 'LOG.old*' -exec rm {} +
```
4. Remove temp files
```shell
rm -r /var/ton-work/db/files/packages/temp.archive.*
```
5. Start validator process
```shell
systemctl start validator.service
```

## Troubleshooting and backups
If for some reason something does not work / breaks you can always [roll back](https://docs.oracle.com/cd/E23824_01/html/821-1448/gbciq.html#gbcxk) to @archstate snapshot on your ZFS filesystem, this is the original state from dump. 

1. Stop validator process (**Never skip this!**)
```shell
sudo -s
systemctl stop validator.service
```
2. Check the snapshot name
```shell
zfs list -t snapshot
```
3. Rollback to the snapshot
```shell
zfs rollback data/ton-work@dumpstate
```

If your Node works well then you can remove this snapshot to save storage space, but we do recommend to regularly snapshot your filesystem for rollback purposes because validator node has been known to corrupt data as well as config.json in some cases. [zfsnap](https://www.zfsnap.org/docs.html) is a nice tool to automate snapshot rotation.

:::tip Need help?
Have question or need help? Please ask in the [TON dev chat](https://t.me/tondev_eng) to get help from the community. MyTonCtrl developers also hang out there.
:::


## Tips & Tricks

### Force archive node not to store blocks

To force node not to store archive blocks use the value 86400. Check [set_node_argument section](/participate/run-nodes/mytonctrl#set_node_argument) for more.

```bash
installer set_node_argument --archive-ttl 86400
```

## See Also

* [TON Node Types](/participate/nodes/node-types)
* [Run a Full Node](/participate/run-nodes/full-node)
