import Feedback from '@site/src/components/Feedback';

# Archive node

:::info
Before this article, read about [Full node](/v3/guidelines/nodes/running-nodes/full-node).
:::

## Overview

An archive node is a type of full node that stores extended historical data from a blockchain. If you are creating a blockchain explorer or a similar application that requires access to historical data, it is recommended that you use an archive node as an indexer.

## OS requirements

We highly recommend installing mytonctrl using the supported operating systems:

- Ubuntu 20.04
- Ubuntu 22.04
- Debian 11

## Minimal hardware requirements

- 16-core CPU
- 128 GB ECC Memory
- 12 TB SSD _OR_ Provisioned 64+k IOPS storage
- 1 Gbit/s network connectivity, both inbound and outbound
- 16 TB/month traffic on peak load
- Linux OS with open files limit above 400k
- A public IP address (fixed IP address)

:::info Data compression
Uncompressed data requires 12 TB of storage. A ZFS volume with compression reduces this to 11 TB. As of February 2025, the data volume is growing by approximately 0.1 to 1 TB per month, depending on the load.
:::

## Installation

### Install ZFS and prepare volume

Dumps come in the form of ZFS snapshots compressed using plzip. You need to install ZFS on your host and restore the dump. See [Oracle Documentation](https://docs.oracle.com/cd/E23824_01/html/821-1448/gavvx.html#scrolltoc) for more details.

Usually, it's a good idea to create a separate ZFS pool for your node on a _dedicated SSD drive_. This will allow you to manage storage space and back up your node easily.

1. Install [ZFS](https://ubuntu.com/tutorials/setup-zfs-storage-pool#1-overview):

```shell
sudo apt install zfsutils-linux
```

2. [Create a pool](https://ubuntu.com/tutorials/setup-zfs-storage-pool#3-creating-a-zfs-pool) on your dedicated 4 TB `<disk>` and name it `data`:

```shell
sudo zpool create data <disk>
```

3. We recommend enabling compression on the parent ZFS filesystem before restoring. This will save you a [significant amount of space](https://www.servethehome.com/the-case-for-using-zfs-compression/). To enable compression for the `data` volume, use the root account to enter the following:

```shell
sudo zfs set compression=lz4 data
```

### Install MyTonCtrl

Please use the [Running Full Node](/v3/guidelines/nodes/running-nodes/full-node) guide to **install** and **run** mytonctrl.

### Run an archive node

#### Prepare the node

1. Before performing a restore, you must stop the validator using the root account:

```shell
sudo -s
systemctl stop validator.service
```

2. Make a backup of `ton-work` config files (we will need `/var/ton-work/db/config.json`, `/var/ton-work/keys`, and `/var/ton-work/db/keyring`):

```shell
mv /var/ton-work /var/ton-work.bak
```

#### Download the dump

Here is an example command to download & restore the **mainnet** dump from the ton.org server:

```shell
curl -L -s https://archival-dump.ton.org/dumps/mainnet_full_44888096.zfs.zstd | pv | zstd -d -T16 | zfs recv mypool/ton-db
```

To install the **testnet** dump, use:

```shell
wget -c https://dump.ton.org/dumps/latest_testnet_archival.zfs.lz | pv | plzip -d -n <cores> | zfs recv data/ton-work
```

The mainnet dump size is approximately 9 TB, so it may take several days to download and restore. The dump size will increase as the network grows.

Prepare and run the command:

1. Install the necessary tools (`pv`, `plzip`, `zstd`).
2. Tell `plzip` to use as many cores as your machine allows to speed up extraction (`-n`).

#### Mount the dump

1. Mount ZFS:

```shell
zfs set mountpoint=/var/ton-work data/ton-work && zfs mount data/ton-work
```

2. Restore `db/config.json`, `keys`, and `db/keyring` from the backup to `/var/ton-work`:

```shell
cp /var/ton-work.bak/db/config.json /var/ton-work/db/config.json
cp -r /var/ton-work.bak/keys /var/ton-work/keys
cp -r /var/ton-work.bak/db/keyring /var/ton-work/db/keyring
```

3. Set the permissions for the `/var/ton-work` and `/var/ton-work/keys` directories correctly:

- The owner of the `/var/ton-work/db` directory should be the `validator` user:

```shell
chown -R validator:validator /var/ton-work/db
```

- The owner of the `/var/ton-work/keys` directory should be the `ubuntu` user:

```shell
chown -R ubuntu:ubuntu /var/ton-work/keys
```

#### Update configuration

Update the node configuration for the archive node.

1. Open the node config file `/etc/systemd/system/validator.service`:

```shell
nano /etc/systemd/system/validator.service
```

2. Add storage settings for the node in the `ExecStart` line:

```shell
--state-ttl 3153600000 --archive-ttl 3153600000
```

:::info
Please remain patient after starting the node and monitor the logs closely.
The dump files lack DHT caches, requiring your node to discover other nodes and synchronize with them.
Depending on the snapshot's age and your network bandwidth,
your node might need **anywhere from several hours to multiple days** to synchronize with the network.
**The synchronization process typically takes up to 5 days when using minimum hardware specifications.**
This is expected behavior.
:::

:::caution
If the node sync process has already taken 5 days, but the node is still out of sync, you should check the
[troubleshooting section](/v3/guidelines/nodes/nodes-troubleshooting#archive-node-is-out-of-sync-even-after-5-days-of-the-syncing-process).
:::

#### Start the node

1. Start the validator by running the command:

```shell
systemctl start validator.service
```

2. Open `mytonctrl` from the _local user_ and check the node status using the `status` command.

## Node maintenance

The node database requires cleansing from time to time (we advise doing this once a week). To do so, please perform the following steps as root:

1. Stop the validator process (Never skip this!):

```shell
sudo -s
systemctl stop validator.service
```

2. Remove old logs:

```shell
find /var/ton-work -name 'LOG.old*' -exec rm {} +
```

3. Remove temporary files:

```shell
rm -r /var/ton-work/db/files/packages/temp.archive.*
```

4. Start the validator process:

```shell
systemctl start validator.service
```

## Troubleshooting and backups

If, for some reason, something does not work or breaks, you can always [roll back](https://docs.oracle.com/cd/E23824_01/html/821-1448/gbciq.html#gbcxk) to the `@archstate` snapshot on your ZFS filesystem. This is the original state from the dump.

1. Stop the validator process (**Never skip this!**):

```shell
sudo -s
systemctl stop validator.service
```

2. Check the snapshot name:

```shell
zfs list -t snapshot
```

3. Roll back to the snapshot:

```shell
zfs rollback data/ton-work@dumpstate
```

If your node operates properly, you may remove this snapshot to reclaim storage space. However, we recommend creating regular filesystem snapshots for rollback capability since the validator node may occasionally corrupt data and `config.json`. For automated snapshot management, [zfsnap](https://www.zfsnap.org/docs.html) handles rotation effectively.

:::tip Need help?
Have a question or need help? Please ask in the [TON dev chat](https://t.me/tondev_eng) to get help from the community. MyTonCtrl developers also hang out there.
:::

## Tips & tricks

:::info
Basic info about archival dumps is present at https://archival-dump.ton.org/
:::

### Remove dump snapshot

1. Find the correct snapshot

```bash
zfs list -t snapshot
```

2. Delete it

```bash
zfs destroy <snapshot>
```

### Force the archive node not to store blocks

To force the node not to store archive blocks, use the value `86400`. Check the [set_node_argument section](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview#set_node_argument) for more details.

```bash
installer set_node_argument --archive-ttl 86400
```

## Support

Contact technical support at [@ton_node_help](https://t.me/ton_node_help).

## See also

- [TON node types](/v3/documentation/infra/nodes/node-types)
- [Run a full node](/v3/guidelines/nodes/running-nodes/full-node)

<Feedback />

