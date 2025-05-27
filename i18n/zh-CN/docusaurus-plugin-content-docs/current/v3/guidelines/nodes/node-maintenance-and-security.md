# 维护与安全

## <a id="introduction"></a>介绍

本指南提供了关于维护和保护TON验证节点的一些基本信息。

本文档假设使用\*\*[TON基金会推荐](/participate/run-nodes/full-node)\*\*的配置和工具安装了验证者，但通用概念也适用于其他场景，并且对于精通的系统管理员也很有用。

## <a id="maintenance"></a>维护

### <a id="database-grooming"></a>数据库整理

TON节点/验证者将其数据库保存在`--db`标志指定的路径下，通常是`/var/ton-work/db`，这个目录由节点创建和管理，但建议每月进行一次数据库整理/清理任务，以移除一些残留物。

**重要**：在执行以下步骤之前，您**必须**停止验证者进程，否则很可能会导致数据库损坏。

### archive-ttl

`archive-ttl` 是一个参数，用于定义数据块的存活时间。默认值为 604800 秒（7 天）。可以通过减少该值来缩小数据库大小。

```bash
MyTonCtrl> installer set_node_argument --archive-ttl <value>
```

如果不使用 MyTonCtrl，则可以编辑节点服务文件。

### state-ttl

`state-ttl` 是一个参数，用于定义块状态的生存时间。默认值为 86400 秒（24 小时）。您可以减少该值以减小数据库大小，但强烈建议验证器使用默认值（保持标记未设置）。
此外，该值应大于验证周期的长度（该值可在 [15th config param](https://docs.ton.org/v3/documentation/network/configs/blockchain-configs#param-15) 中找到）。

```bash
MyTonCtrl> installer set_node_argument --state-ttl <value>
```

如果不使用 MyTonCtrl，则可以编辑节点服务文件。

### <a id="backups"></a>备份

备份验证者的最简单和最有效的方法是复制关键节点配置文件、密钥和mytonctrl设置：

- 节点配置文件：`/var/ton-work/db/config.json`
- 节点私钥环：`/var/ton-work/db/keyring`
- 节点公钥：`/var/ton-work/keys`
- mytonctrl配置和钱包：`$HOME/.local/share/myton*`，其中$HOME是启动mytonctrl安装的用户的主目录 **或者** `/usr/local/bin/mytoncore`，如果您以root用户安装了mytonctrl的话。

通过分析进程和日志来验证验证者进程是否运行。验证者应该在几分钟内与网络重新同步。

#### <a id="backups"></a>备份

备份验证者的最简单和最有效的方法是复制关键节点配置文件、密钥和mytonctrl设置：

两种方法的问题是，您必须在进行快照之前停止节点，否则很可能导致数据库损坏并带来意想不到的后果。许多云提供商在进行快照之前也要求您关闭机器。

这组文件是您从头恢复节点所需的全部内容。

### 快照

现代文件系统如ZFS提供快照功能，大多数云提供商也允许他们的客户在快照期间保留整个磁盘以备将来使用。

#### 安装mytonctrl / 节点

这样的停机不应该频繁进行，如果您每周对节点进行一次快照，那么在最坏的情况下，恢复后您将拥有一个一周旧的数据库，节点赶上网络的时间将比使用mytonctrl的“从转储安装”功能（在调用`install.sh`脚本时添加-d标志）进行新安装更长。

#### <a id="disaster-recovery"></a>灾难恢复

```sh
sudo -s
```

#### 安装mytonctrl / 节点

```sh
systemctl stop validator
systemctl stop mytoncore
```

#### 切换到root用户

- 节点配置文件：`/var/ton-work/db/config.json`
- 节点私钥环：`/var/ton-work/db/keyring`
- 节点公钥：`/var/ton-work/keys`

#### 停止mytoncore和验证者进程

如果您的新节点有不同的IP地址，则必须编辑节点配置文件`/var/ton-work/db/config.json`，并将leaf`.addrs[0].ip`设置为新IP地址的**十进制**表示。您可以使用\*\*[这个](https://github.com/sonofmom/ton-tools/blob/master/node/ip2dec.py)\*\* python脚本将您的IP转换为十进制。

#### 应用备份的节点配置文件

```sh
chown -R validator:validator /var/ton-work/db
```

#### <a id="set-node-ip"></a>设置节点IP地址

如果您的新节点有不同的IP地址，则必须编辑节点配置文件`/var/ton-work/db/config.json`，并将leaf`.addrs[0].ip`设置为新IP地址的**十进制**表示。您可以使用\*\*[这个](https://github.com/sonofmom/ton-tools/blob/master/node/ip2dec.py)\*\* python脚本将您的IP转换为十进制。

#### 确保数据库权限正确

```sh
systemctl start validator
systemctl start mytoncore
```

## 应用备份的mytonctrl配置文件

### <a id="host-security"></a>主机级安全

主机级安全是一个庞大的话题，超出了本文档的范围，但我们建议您永远不要在root用户下安装mytonctrl，使用服务账户以确保权限分离。

### <a id="network-security"></a>网络级安全

TON验证者是高价值资产，应该被保护以抵御外部威胁，您应该采取的第一步是尽可能使您的节点不可见，这意味着锁定所有网络连接。在验证者节点上，只有用于节点操作的UDP端口应该对互联网公开。

#### <a id="host-security"></a>主机级安全

主机级安全是一个庞大的话题，超出了本文档的范围，但我们建议您永远不要在root用户下安装mytonctrl，使用服务账户以确保权限分离。

#### <a id="network-security"></a>网络级安全

TON验证者是高价值资产，应该被保护以抵御外部威胁，您应该采取的第一步是尽可能使您的节点不可见，这意味着锁定所有网络连接。在验证者节点上，只有用于节点操作的UDP端口应该对互联网公开。

我们还建议您设置一个带有固定 IP 地址的小型“跳板机”VPS，如果您的家庭/办公室没有固定 IP 或者在您丢失主要 IP 地址时，可以作为访问受保护机器的备用方式供您使用。

#### 安装ufw和jq1

```sh
sudo apt install -y ufw jq
```

#### ufw规则集的基本锁定

```sh
sudo ufw default deny incoming; sudo ufw default allow outgoing
```

#### 安装ufw和jq1

```sh
sudo sed -i 's/-A ufw-before-input -p icmp --icmp-type echo-request -j ACCEPT/#-A ufw-before-input -p icmp --icmp-type echo-request -j ACCEPT/g' /etc/ufw/before.rules
```

#### ufw规则集的基本锁定

```sh
sudo ufw insert 1 allow from <MANAGEMENT_NETWORK>
```

对每个管理网络/地址重复上述命令。

#### 向公众公开节点/验证者UDP端口

```sh
sudo ufw allow proto udp from any to any port `sudo jq -r '.addrs[0].port' /var/ton-work/db/config.json`
```

#### 仔细检查您的管理网络

对每个管理网络/地址重复上述命令。

#### 向公众公开节点/验证者UDP端口

```sh
sudo ufw enable
```

#### 仔细检查您的管理网络

<mark>重要</mark>：在启用防火墙之前，请仔细检查您是否添加了正确的管理地址！

```sh
    sudo ufw status numbered
```

以下是具有两个管理网络/地址的锁定节点的示例输出：

```
Status: active

     To                         Action      From
     --                         ------      ----
[ 1] Anywhere                   ALLOW IN    <MANAGEMENT_NETWORK_A>/28
[ 2] Anywhere                   ALLOW IN    <MANAGEMENT_NETWORK_B>/32
[ 3] <NODE_PORT>/udp            ALLOW IN    Anywhere
[ 4] <NODE_PORT>/udp (v6)       ALLOW IN    Anywhere (v6)
```

#### 公开LiteServer端口

```sh
sudo ufw allow proto tcp from any to any port `sudo jq -r '.liteservers[0].port' /var/ton-work/db/config.json`
```

以下是具有两个管理网络/地址的锁定节点的示例输出：

#### 更多关于UFW的信息

参见Digital Ocean提供的这篇优秀的\*\*[ufw教程](https://www.digitalocean.com/community/tutorials/ufw-essentials-common-firewall-rules-and-commands)\*\*，了解更多ufw的魔法。

### <a id="ip-switch"></a>IP切换

请注意，验证者上不应公开LiteServer端口。

无论如何，请确保在节点配置文件中 **[设置新 IP 地址](/v3/guidelines/nodes/node-maintenance-and-security#-set-node-ip-address)**！
