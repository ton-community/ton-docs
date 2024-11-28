# 运行归档节点

:::info
阅读本文之前，请先阅读 [全节点](/v3/guidelines/nodes/running-nodes/full-node)
:::

## 概述

存档节点是一种[完整节点](/participate/run-nodes/fullnode)类型，存储区块链的扩展历史数据。 如果您正在创建一个需要访问历史数据的 blockchain 浏览器或类似的应用程序， 建议使用归档节点作为索引器。

## 先决条件

我们强烈建议使用支持的操作系统安装 mytonctrl：

- Ubuntu 20.04
- Ubuntu 22.04
- Debian 11

## 硬件要求

- 16 x 内核 CPU
- 128GB ECC 内存
- 9TB SSD *OR* 配置 64+k IOPS 存储器
- 1 Gbit/s 网络连接
- 峰值流量为每月 16 TB
- 公共 IP 地址（固定 IP 地址）

:::info 数据压缩
未压缩数据需要 9 TB。6TB 是基于使用已启用压缩功能的 ZFS 卷。
数据量每月大约增加 0.5TB 和 0.25TB，最近一次更新是在 2024 年 11 月。
:::

## 安装

### 安装

一般来说，运行存档节点需要以下步骤：

通常，在专用 SSD 驱动器上为节点创建一个单独的 ZFS 池是个好主意，这样可以方便管理存储空间和备份节点。

1. 安装 [zfs](https://ubuntu.com/tutorials/setup-zfs-storage-pool#1-overview)

```shell
sudo apt install zfsutils-linux
```

2. 在专用的 4TB `<disk>` 上 [创建池](https://ubuntu.com/tutorials/setup-zfs-storage-pool#3-creating-a-zfs-pool)，并将其命名为 `data`

```shell
sudo zpool create data <disk>
```

3. 在还原之前，我们强烈建议在父 ZFS 文件系统上启用压缩功能，这将为您节省 [大量空间](https://www.servethehome.com/the-case-for-using-zfs-compression/)。要启用 "数据 "卷的压缩功能，请使用 root 账户输入：

```shell
sudo zfs set compression=lz4 data
```

### 安装 MyTonCtrl

请根据 [运行全节点](/v3/guidelines/nodes/running-nodes/full-node) 来 **安装** 和 **运行** mytonctrl。

### 准备节点

#### 安装 MyTonCtrl

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

1. 备份 `ton-work` 配置文件（我们需要 `/var/ton-work/db/config.json`、`/var/ton-work/keys` 和 `/var/ton-work/db/keyring`）。
2. 下面是一个从 ton.org 服务器下载和恢复 **mainnet** 转储的命令示例：

```shell
wget --user <usr> --password <pwd> -c https://archival-dump.ton.org/dumps/latest.zfs.lz | pv | plzip -d -n <cores> | zfs recv data/ton-work
```

要安装 **testnet** 转储，请使用

```shell
wget --user <usr> --password <pwd> -c https://archival-dump.ton.org/dumps/latest_testnet.zfs.lz | pv | plzip -d -n <cores> | zfs recv data/ton-work
```

转储的大小约为 **4TB**，因此下载和恢复可能需要几天（最多 4 天）。转储大小会随着网络的增长而增加。

转储大小为__~1.5TB__，因此下载和恢复需要一些时间。

1. 必要时安装工具(`pv`, `plzip`)
2. 将 `<usr>` 和 `<pwd>` 替换为您的凭据
3. 告诉 `plzip` 在机器允许的范围内使用尽可能多的内核，以加快提取速度 (`-n`)

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

1. 打开节点配置文件 \`/etc/systemd/system/validator.service

```shell
nano /etc/systemd/system/validator.service
```

2. 在 `ExecStart` 行中添加节点的存储设置：

```shell
--state-ttl 315360000 --archive-ttl 315360000 --block-ttl 315360000
```

:::info
启动节点并观察日志后，请耐心等待。
快照不带 DHT 缓存，因此您的节点需要一些时间才能找到其他节点并与之同步。
根据快照的时间和互联网连接速度，您的节点可能需要**几个小时到几天**才能赶上网络。
**在最低设置条件下，这一过程可能需要 5 天。**
这是正常现象。
:::

:::caution
启动节点并观察日志后，请耐心等待。转储不带 DHT 缓存，因此您的节点需要一些时间才能找到其他节点，然后与它们同步。根据快照的时间，您的节点可能需要几个小时到几天的时间才能赶上网络。这是正常现象。
:::

#### 启动节点

1. 运行命令启动验证器：

```shell
systemctl start validator.service
```

2. 从 *local user* 打开 `mytonctrl` 并使用 `status` 检查节点状态。

## 节点维护

节点数据库需要不时清理（我们建议每周清理一次），为此请以 root 身份执行以下步骤：

1. 停止验证程序（切勿跳过！）。

```shell
sudo -s
systemctl stop validator.service
```

2. 删除旧日志

```shell
find /var/ton-work -name 'LOG.old*' -exec rm {} +
```

4. 删除临时文件

```shell
rm -r /var/ton-work/db/files/packages/temp.archive.*
```

5. 启动验证程序

```shell
systemctl start validator.service
```

## 故障排除和备份

如果由于某种原因，某些程序无法运行或发生故障，你可以随时 [roll back](https://docs.oracle.com/cd/E23824_01/html/821-1448/gbciq.html#gbcxk) 到 ZFS 文件系统上的 @archstate 快照，这是转储的原始状态。

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

如果您的节点运行良好，您可以删除该快照以节省存储空间，但我们确实建议您定期为文件系统拍摄快照，以便回滚，因为验证器节点在某些情况下会损坏数据和 config.json。[zfsnap](https://www.zfsnap.org/docs.html)是一个自动轮换快照的好工具。

:::tip 需要帮助吗？
有问题或需要帮助？请在 [TON dev 聊天室](https://t.me/tondev_eng) 中提问，以获得社区的帮助。MyTonCtrl 开发人员也会在那里交流。
:::

## 参阅

### 强制归档节点不存储数据块

要强制节点不存储归档块，请使用 86400。请查看 [set_node_argument 部分](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview#set_node_argument) 了解更多信息。

```bash
installer set_node_argument --archive-ttl 86400
```

## 支持

通过 [@mytonctrl_help](https://t.me/mytonctrl_help) 联系技术支持。

## 参阅

- [TON 节点类型](/v3/documentation/infra/nodes/node-types)
- [运行全节点](/v3/guidelines/nodes/running-nodes/full-node)
