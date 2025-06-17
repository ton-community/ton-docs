import Feedback from '@site/src/components/Feedback';

# Archive node

:::info
阅读本文之前，请先阅读 [全节点](/v3/guidelines/nodes/running-nodes/full-node)
:::

## 概述

存档节点是一种[完整节点](/participate/run-nodes/fullnode)类型，存储区块链的扩展历史数据。 如果您正在创建一个需要访问历史数据的 blockchain 浏览器或类似的应用程序， 建议使用归档节点作为索引器。 If you are creating a blockchain explorer or a similar application that requires access to historical data, it is recommended that you use an archive node as an indexer.

## 先决条件

我们强烈建议使用支持的操作系统安装 mytonctrl：

- Ubuntu 20.04
- Ubuntu 22.04
- Debian 11

## 硬件要求

- 16 x 内核 CPU
- 128GB ECC 内存
- 9TB SSD _OR_ 配置 64+k IOPS 存储器
- 1 Gbit/s 网络连接
- 峰值流量为每月 16 TB
- Linux OS with open files limit above 400k
- 公共 IP 地址（固定 IP 地址）

:::info 数据压缩
Uncompressed data requires 12 TB of storage. A ZFS volume with compression reduces this to 11 TB. As of February 2025, the data volume is growing by approximately 0.1 to 1 TB per month, depending on the load.
:::

## 安装

### Install ZFS and prepare volume

Dumps come in the form of ZFS snapshots compressed using plzip. You need to install ZFS on your host and restore the dump. See [Oracle Documentation](https://docs.oracle.com/cd/E23824_01/html/821-1448/gavvx.html#scrolltoc) for more details.

通常，在专用 SSD 驱动器上为节点创建一个单独的 ZFS 池是个好主意，这样可以方便管理存储空间和备份节点。 This will allow you to manage storage space and back up your node easily.

1. 安装 [zfs](https://ubuntu.com/tutorials/setup-zfs-storage-pool#1-overview)

```shell
sudo apt install zfsutils-linux
```

2. 在专用的 4TB `<disk>` 上 [创建池](https://ubuntu.com/tutorials/setup-zfs-storage-pool#3-creating-a-zfs-pool)，并将其命名为 `data`

```shell
sudo zpool create data <disk>
```

3. We recommend enabling compression on the parent ZFS filesystem before restoring. This will save you a [significant amount of space](https://www.servethehome.com/the-case-for-using-zfs-compression/). To enable compression for the `data` volume, use the root account to enter the following:

```shell
sudo zfs set compression=lz4 data
```

### 安装 MyTonCtrl

请根据 [运行全节点](/v3/guidelines/nodes/running-nodes/full-node) 来 **安装** 和 **运行** mytonctrl。

### 运行归档节点

#### 准备节点

1. 执行还原之前，必须使用 root 账户停止验证器：

```shell
sudo -s
systemctl stop validator.service
```

2. 备份 `ton-work` 配置文件（我们需要 `/var/ton-work/db/config.json`、`/var/ton-work/keys` 和 `/var/ton-work/db/keyring`）。

```shell
mv /var/ton-work /var/ton-work.bak
```

#### 下载转储

下面是一个从 ton.org 服务器下载和恢复 **mainnet** 转储的命令示例：

```shell
curl -L -s https://archival-dump.ton.org/dumps/mainnet_full_44888096.zfs.zstd | pv | zstd -d -T16 | zfs recv mypool/ton-db
```

要安装 **testnet** 转储，请使用

```shell
wget --user <usr> --password <pwd> -c https://archival-dump.ton.org/dumps/latest_testnet.zfs.lz | pv | plzip -d -n <cores> | zfs recv data/ton-work
```

转储的大小约为 **4TB**，因此下载和恢复可能需要几天（最多 4 天）。转储大小会随着网络的增长而增加。 The dump size will increase as the network grows.

Prepare and run the command:

1. 必要时安装工具(`pv`, `plzip`)
2. 告诉 `plzip` 在机器允许的范围内使用尽可能多的内核，以加快提取速度 (`-n`)

#### 安装转储

1. 挂载 zfs：

```shell
zfs set mountpoint=/var/ton-work data/ton-work && zfs mount data/ton-work
```

2. 将`db/config.json`、`keys`和`db/keyring`从备份恢复到`/var/ton-work`。

```shell
cp /var/ton-work.bak/db/config.json /var/ton-work/db/config.json
cp -r /var/ton-work.bak/keys /var/ton-work/keys
cp -r /var/ton-work.bak/db/keyring /var/ton-work/db/keyring
```

3. 请确保`/var/ton-work`和`/var/ton-work/keys`目录的权限提升正确：

- 请确保`/var/ton-work`和`/var/ton-work/keys`目录的权限提升正确：

```shell
chown -R validator:validator /var/ton-work/db
```

- /var/ton-work/keys "目录的所有者应为 "ubuntu "用户：

```shell
chown -R ubuntu:ubuntu /var/ton-work/keys
```

#### 更新配置

更新存档节点的节点配置。

1. 打开节点配置文件 \\`/etc/systemd/system/validator.service

```shell
nano /etc/systemd/system/validator.service
```

2. 在 `ExecStart` 行中添加节点的存储设置：

```shell
--state-ttl 315360000 --archive-ttl 315360000 --block-ttl 315360000
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

#### 启动节点

1. 运行命令启动验证器：

```shell
systemctl start validator.service
```

2. 从 _local user_ 打开 `mytonctrl` 并使用 `status` 检查节点状态。

## 节点维护

节点数据库需要不时清理（我们建议每周清理一次），为此请以 root 身份执行以下步骤： To do so, please perform the following steps as root:

1. 停止验证程序（切勿跳过！）。

```shell
sudo -s
systemctl stop validator.service
```

2. 删除旧日志

```shell
find /var/ton-work -name 'LOG.old*' -exec rm {} +
```

3. 删除临时文件

```shell
rm -r /var/ton-work/db/files/packages/temp.archive.*
```

4. 启动验证程序

```shell
systemctl start validator.service
```

## 故障排除和备份

如果由于某种原因，某些程序无法运行或发生故障，你可以随时 [roll back](https://docs.oracle.com/cd/E23824_01/html/821-1448/gbciq.html#gbcxk) 到 ZFS 文件系统上的 @archstate 快照，这是转储的原始状态。 This is the original state from the dump.

1. 停止验证程序（切勿跳过！）。

```shell
sudo -s
systemctl stop validator.service
```

2. 检查快照名称

```shell
zfs list -t snapshot
```

3. 回滚到快照

```shell
zfs rollback data/ton-work@dumpstate
```

If your node operates properly, you may remove this snapshot to reclaim storage space. However, we recommend creating regular filesystem snapshots for rollback capability since the validator node may occasionally corrupt data and `config.json`. For automated snapshot management, [zfsnap](https://www.zfsnap.org/docs.html) handles rotation effectively.

:::tip 需要帮助吗？
Have a question or need help? 有问题或需要帮助？请在 [TON dev 聊天室](https://t.me/tondev_eng) 中提问，以获得社区的帮助。MyTonCtrl 开发人员也会在那里交流。 MyTonCtrl developers also hang out there.
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
在还原之前，我们强烈建议在父 ZFS 文件系统上启用压缩功能，这将为您节省 [大量空间](https://www.servethehome.com/the-case-for-using-zfs-compression/)。要启用 "数据 "卷的压缩功能，请使用 root 账户输入：
```

### 强制归档节点不存储数据块

To force the node not to store archive blocks, use the value `86400`. 要强制节点不存储归档块，请使用 86400。请查看 [set_node_argument 部分](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview#set_node_argument) 了解更多信息。

```bash
installer set_node_argument --archive-ttl 86400
```

## 支持

通过 [@mytonctrl_help](https://t.me/mytonctrl_help) 联系技术支持。

## 参阅

- [TON 节点类型](/v3/documentation/infra/nodes/node-types)
- [运行全节点](/v3/guidelines/nodes/running-nodes/full-node)

<Feedback />

