# Running an Archive Node

## Overview

An Archive Node is a type of Full Node that stores extended historical data of a blockchain. If you are creating a blockchain explorer or a similar application that requires access to historical data, using an Archive Node as an indexer is recommended.

## Prerequisites

We highly recommend install mytonctrl using the supported operating systems:
* Ubuntu 20.04
* Ubuntu 22.04
* Debian 11

Please, use a **non-root user** with **sudo** privileges to install and run mytonctrl.

## Hardware requirements 

* at least 8 cores CPU 
* at least 64 GB RAM 
* at least 4TB SSD on your server
* 1 Gbit/s network connectivity 
* a public IP address (fixed IP address)

## Installation

In general, you need the following steps to run an Archive Node:

1. Install ZFS
2. Install MyTonCtrl
3. Run a Full Node on your server and stop validator process
4. Download and restore dump data from https://archival-dump.ton.org
5. Run Full Node with Configuring DB specs for Archive Node


### Install ZFS

Dumps come in form of ZFS Snapshots compressed using plzip, you need to install zfs on your host and restore the dump, see [Oracle Documentation](https://docs.oracle.com/cd/E23824_01/html/821-1448/gavvx.html#scrolltoc) for more details. Before restoring we highly recommend to enable compression on parent ZFS filesystem, this will save you a [lot of space](https://www.servethehome.com/the-case-for-using-zfs-compression/).

Usually, it's a good idea to create a separate ZFS pool for your node on a _dedicated SSD drive_, this will allow you to easily manage storage space and backup your node.

1. [Install zfs and create a new pool on your 4TB volume](https://ubuntu.com/tutorials/setup-zfs-storage-pool) (name it `data`).
2. Enable compression for the `data` volume:
```shell
zfs set compression=lz4 data
```
3. Create a volume:
```shell
zfs create data/ton-work
```

### Install MyTonCtrl

Please, use a [Running Full Node](/participate/run-nodes/full-node) to install mytonctrl.

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

3. Request `user` and `password` credentials to gain access for downloading dumps in the [@TONBaseChatEn](https://t.me/TONBaseChatEn) Telegram chat.
4. Here is an example command to download & restore the dump from the ton.org server:

```shell
wget --user <usr> --password <pwd> -c https://archival-dump.ton.org/dumps/latest.zfs.lz | pv | plzip -d -n <cores> | zfs recv data/ton-work
```

Size of the dump is __~1.5TB__, so it will take some time to download and restore it.

Prepare and run the command:
1. Install the tools if necessary (`pv`, `plzip`)
2. Replace `<usr>` and `<pwd>` with your credentials
2. Tell `plzip` to use as many cores as your machine allows to speed up extraction (`-n`)

#### Mount the dump

5. Mount zfs:
```shell
zfs set mountpoint=/var/ton-work data/ton-work && zfs mount data/ton-work
```
6. Restore `db/config.json`, `keys` and `db/keyring` from backup to `/var/ton-work`
```shell
cp /var/ton-work.bak/db/config.json /var/ton-work/db/config.json
cp -r /var/ton-work.bak/keys /var/ton-work/keys
cp -r /var/ton-work.bak/db/keyring /var/ton-work/db/keyring
```
7. Fix permissions for `/var/ton-work`:
```shell
chown -R validator:validator /var/ton-work
```

:::caution Important
If you've installed the `mytonctrl` under a local user (as we did in the full node tutorial), you need to change the owner of the `/var/ton-work/keys` directory to the local user account. Otherwise, the node will not be able to start.
:::

Example of changing the owner to `ubuntu` user:

```shell
chown -R ubuntu:ubuntu /var/ton-work/keys
```

8. Add storage settings for the node to the file `/etc/systemd/system/validator.service` in the `ExecStart` line: 
```shell
--state-ttl 315360000 --archive-ttl 315360000 --block-ttl 315360000
```

:::info
Please be patient once you start the node and observe the logs. Dumps come without DHT caches, so it will take your node some time to find other nodes and then sync with them. Depending on the age of the snapshot, your node might take from a few hours to several days to catch up with the network. This is normal.
:::

#### Start the node

9. Start the validator by running the command: 

```shell
systemctl start validator.service
```

10. Open `mytonctrl` from _local user_ and check the node status using the `status`.


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

1. Stop validator process (Never skip this!)
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


## See Also

* [TON Node Types](/participate/nodes/node-types)
* [Run a Full Node](/participate/run-nodes/full-node)