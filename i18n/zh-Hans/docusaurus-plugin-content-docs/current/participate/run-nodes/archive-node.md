# 运行归档节点

## 概述

归档节点是一种全节点，它存储区块链的扩展历史数据。如果您正在创建一个区块链浏览器或类似需要访问历史数据的应用程序，推荐使用归档节点作为索引器。

## 必要条件

我们强烈建议使用支持的操作系统安装mytonctrl：
* Ubuntu 20.04
* Ubuntu 22.04
* Debian 11

请使用具有**sudo**权限的**非root用户**来安装和运行mytonctrl。

## 硬件要求

* 16 x 核心 CPU
* 128GB ECC内存
* 4TB SSD _或者_ 预置32+k IOPS存储
* 1 Gbit/s 网络连接
* 高峰期每月16 TB流量
* 固定公网IP地址

__注意__：假设使用启用压缩的zfs卷的4TB

## 安装

通常，您需要执行以下步骤来运行归档节点：

1. 安装ZFS并准备卷
2. 安装MyTonCtrl
3. 在您的服务器上运行全节点并停止验证者进程
4. 从https://archival-dump.ton.org下载并恢复转储数据
5. 使用配置归档节点DB规格的方式运行全节点

### 安装ZFS并准备卷

转储以使用plzip压缩的ZFS快照的形式提供，您需要在主机上安装zfs并恢复转储，详见[Oracle文档](https://docs.oracle.com/cd/E23824_01/html/821-1448/gavvx.html#scrolltoc)。

通常，为您的节点在_专用SSD驱动器_上创建一个单独的ZFS池是个好主意，这将使您更容易管理存储空间并备份您的节点。

1. 安装[zfs](https://ubuntu.com/tutorials/setup-zfs-storage-pool#1-overview)
```shell
sudo apt install zfsutils-linux
```
2. 在您的专用4TB `<disk>`上[创建池](https://ubuntu.com/tutorials/setup-zfs-storage-pool#3-creating-a-zfs-pool)，并命名为`data`

```shell
sudo zpool create data <disk>
```
3. 在恢复之前，我们强烈建议在父ZFS文件系统上启用压缩，这将为您[节省大量空间](https://www.servethehome.com/the-case-for-using-zfs-compression/)。要为`data`卷启用压缩，请使用root账户输入：

```shell
sudo zfs set compression=lz4 data
```

### 安装MyTonCtrl

请使用[运行全节点](/participate/run-nodes/full-node)来安装mytonctrl。

### 运行归档节点

#### 准备节点

1. 在执行恢复之前，您必须使用root账户停止验证者：
```shell
sudo -s
systemctl stop validator.service
```
2. 备份`ton-work`配置文件（我们将需要`/var/ton-work/db/config.json`，`/var/ton-work/keys`和`/var/ton-work/db/keyring`）。
```shell
mv /var/ton-work /var/ton-work.bak
```

#### 下载转储

1. 请求`user`和`password`凭证以获得下载转储的权限，可以在[@TONBaseChatEn](https://t.me/TONBaseChatEn) Telegram聊天中请求。
2. 这是从ton.org服务器下载和恢复转储的示例命令：

```shell
wget --user <usr> --password <pwd> -c https://archival-dump.ton.org/dumps/latest.zfs.lz | pv | plzip -d -n <cores> | zfs recv data/ton-work
```

转储的大小约为__1.5TB__，因此下载和恢复它将需要一些时间。

准备并运行命令：
1. 如有必要，安装工具（`pv`，`plzip`）
2. 用您的凭证替换`<usr>`和`<pwd>`
3. 告诉`plzip`使用尽可能多的核心来加速提取（`-n`）

#### 挂载转储

1. 挂载zfs：
```shell
zfs set mountpoint=/var/ton-work data/ton-work && zfs mount data/ton-work
```
2. 从备份恢复`db/config.json`、`keys`和`db/keyring`到`/var/ton-work`
```shell
cp /var/ton-work.bak/db/config.json /var/ton-work/db/config.json
cp -r /var/ton-work.bak/keys /var/ton-work/keys
cp -r /var/ton-work.bak/db/keyring /var/ton-work/db/keyring
```
3. 确保`/var/ton-work`和`/var/ton-work/keys`目录的权限正确设置：

- `/var/ton-work/db`目录的所有者应为`validator`用户：

```shell
chown -R validator:validator /var/ton-work/db
```

- `/var/ton-work/keys`目录的所有者应为`ubuntu`用户：

```shell
chown -R ubuntu:ubuntu /var/ton-work/keys
```

#### 更新配置

更新归档节点的节点配置。

1. 打开节点配置文件`/etc/systemd/system/validator.service`
```shell
nano /etc/systemd/system/validator.service
```

2. 在`ExecStart`行中添加节点的存储设置：
```shell
--state-ttl 315360000 --archive-ttl 315360000 --block-ttl 315360000
```

:::info
启动节点后请耐心等待并观察日志。转储没有DHT缓存，所以您的节点需要一些时间来找到其他节点，然后与它们同步。根据快照的时间，您的节点可能需要从几小时到几天的时间来赶上网络。这是正常的。
:::

#### 启动节点

1. 运行以下命令启动验证者：

```shell
systemctl start validator.service
```

2. 以_本地用户_身份打开`mytonctrl`，使用`status`检查节点状态。

## 节点维护

节点数据库需要不时清理（我们建议每周一次），请以root身份执行以下步骤：


1. 停止验证者进程（切勿跳过此步骤！）
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
5. 启动验证者进程
```shell
systemctl start validator.service
```

## 故障排除和备份
如果出于某种原因某些东西不起作用/出现故障，您始终可以[回滚](https://docs.oracle.com/cd/E23824_01/html/821-1448/gbciq.html#gbcxk)到ZFS文件系统上的@archstate快照，这是转储的原始状态。

1. 停止验证者进程（切勿跳过此步骤！）
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

如果您的节点运行良好，则可以删除此快照以节省存储空间，但我们建议定期对文件系统进行快照，以备份用途，因为验证者节点已知会在某些情况下损坏数据以及config.json。[zfsnap](https://www.zfsnap.org/docs.html)是自动化快照轮换的好工具。

:::tip 需要帮助吗？
有问题或需要帮助？请在[TON开发者聊天](https://t.me/tondev_eng)中询问，以获得社区的帮助。MyTonCtrl开发者也常在那里。
:::


## 参阅

* [TON节点类型](/participate/nodes/node-types)
* [运行全节点](/participate/run-nodes/full-node)
