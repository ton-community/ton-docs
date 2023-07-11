# Running an Archive Node

## Overview
An Archive Node is a type of Full Node that stores extended historical data of a blockchain. If you are creating a blockchain explorer or a similar application that requires access to historical data, using an Archive Node as an indexer is recommended.

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

1. Install zfs, [create new pool](https://ubuntu.com/tutorials/setup-zfs-storage-pool) (`data`).
2. Enable compression: `zfs set compression=lz4 data`
3. Create volume: `zfs create data/ton-work`


### Install mytonctrl

Download the installation script. We recommend to install the tool under your local user account, not as Root. In our example a local user account is used:

```sh
wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
```

### Run a Full Node
Run the installation script as administrator:

```sh
sudo bash install.sh -m full
```

See more detailed guide in [Running Full Node](/participate/run-nodes/full-node) section.


### Run an Archive Node

1. Before performing a restore, you must stop the validator by running the command:
```sh
systemctl stop validator.service
```
2. Make a backup of config files `/var/ton-work/db/config.json` and `/var/ton-work/db/keyring` (they will be erased after the recovery process).
```sh
mv /var/ton-work /var/ton-work.bak
```
3. Request `user` and `password` credentials to gain access for downloading dumps in the [@TONBaseChatEn](https://t.me/TONBaseChatEn) Telegram chat.
4. Tell plzip to use as many cores as your machine allows to speed up extraction process (-n parameter). Another handy tool to use is pipe viewer utility. Here is example command to restore the dump directly from this server via curl:

```sh
wget --user <usr> --password <pwd> -c https://archival-dump.ton.org/dumps/latest.zfs.lz | pv | plzip -d | zfs recv ton-pool/db
```

5. Mount zfs: `zfs set mountpoint=/var/ton-work data/ton-work && zfs mount data/ton-work`
6. Restore config.json, keys and db/keyring from backup to `/var/ton-work`
7. Fix permissions: `chown -R validator:validator /var/ton-work`
8. Add storage settings for the node to the file `/etc/systemd/system/validator.service` in the `ExecStart` line: 
```sh
--state-ttl 315360000 --archive-ttl 315360000 --block-ttl 315360000
```

:::info
Please be patient once you start the node and observe the logs. Dumps come without DHT caches, so it will take your node some time to find other nodes and then sync with them. Depending on the age of the snapshot, your node might take from a few hours to several days to catch up with the network. This is normal.
:::
9. Start the validator by running the command: 
```sh
systemctl start validator.service
```
10. Open `mytonctrl` and check the node status using the status command.


## Node maintenance

Node database requires cleansing from time to time (we advise once a week), to do so please perform following steps as root:


1. Stop validator process (Never skip this!)
2. Run
```sh
find /var/ton-work -name 'LOG.old*' -exec rm {} +
```
4. Run
```sh
rm -r /var/ton-work/db/files/packages/temp.archive.*
```
5. Start validator process

## Troubleshooting and backups
If for some reason something does not work / breaks you can always [roll back](https://docs.oracle.com/cd/E23824_01/html/821-1448/gbciq.html#gbcxk) to @archstate snapshot on your ZFS filesystem, this is the original state from dump. 

If your Node works well then you can remove this snapshot to save storage space, but we do recommend to regularly snapshot your filesystem for rollback purposes because validator node has been known to corrupt data as well as config.json in some cases. [zfsnap](https://www.zfsnap.org/docs.html) is a nice tool to automate snapshot rotation.

:::caution
Have question or problem? Ask in the [TON dev chat](https://t.me/tondev_eng).
:::


## See Also

* [TON Node Types](/participate/nodes/node-types)
* [Run a Full Node(Validator)](/participate/run-nodes/full-node)
* [Full-node (low-level)](/participate/nodes/full-node)