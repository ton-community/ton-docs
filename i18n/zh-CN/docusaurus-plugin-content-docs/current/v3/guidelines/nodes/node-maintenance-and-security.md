import Feedback from '@site/src/components/Feedback';

# 维护与安全

## Introduction

本指南提供了关于维护和保护TON验证节点的一些基本信息。

It assumes that you install a validator using the configuration and tools **[recommended by the TON Foundation](/v3/guidelines/nodes/running-nodes/full-node)**. However, the general concepts discussed here can be applied to other scenarios, making them useful for experienced system administrators.

## <a id="maintenance"></a>维护

### <a id="database-grooming"></a>数据库整理

The TON node maintains its database at the location specified by the `--db` flag in the `validator-engine`, which is usually `/var/ton-work/db`. To reduce the database size, you can decrease the time-to-live (TTL) for some of the stored data.

The current TTL values are in the node's service file, which is typically located at `/etc/systemd/system/validator.service`. If you use MyTonCtrl, you can check the status by running the command `installer status`. The system will use the default values if any of the TTL values are not set.

### archive-ttl

`archive-ttl` 是一个参数，用于定义数据块的存活时间。默认值为 604800 秒（7 天）。可以通过减少该值来缩小数据库大小。 The default value is 604800 seconds (7 days). You can decrease this value to reduce the database size.

```bash
MyTonCtrl> installer set_node_argument --archive-ttl <value>
```

如果不使用 MyTonCtrl，则可以编辑节点服务文件。

### state-ttl

`state-ttl` is a parameter defining the block states' TTL. The default value is 86400 seconds (24 hours). You can decrease this value to reduce the database size, but for validators, it's highly recommended that the default value be used (keep the flag unset).

Also, this value should be more than the length of the validation period (check the value in [15th config param](/v3/documentation/network/configs/blockchain-configs#param-15)).

```bash
MyTonCtrl> installer set_node_argument --state-ttl <value>
```

如果不使用 MyTonCtrl，则可以编辑节点服务文件。

### Backups

备份验证者的最简单和最有效的方法是复制关键节点配置文件、密钥和mytonctrl设置： Here are the important files to back up:

1. 节点配置文件：`/var/ton-work/db/config.json`

2. 节点私钥环：`/var/ton-work/db/keyring`

3. 节点公钥：`/var/ton-work/keys`

4. **MyTonCtrl configuration and wallets**:
   - mytonctrl配置和钱包：`$HOME/.local/share/myton*`，其中$HOME是启动mytonctrl安装的用户的主目录 **或者** `/usr/local/bin/mytoncore`，如果您以root用户安装了mytonctrl的话。
   - 安装mytonctrl / 节点

这组文件是您从头恢复节点所需的全部内容。

#### 快照

现代文件系统如ZFS提供快照功能，大多数云提供商也允许他们的客户在快照期间保留整个磁盘以备将来使用。 Most cloud providers also allow their customers to make snapshots of their machines, during which the entire disk is preserved for future use.

The problem with both methods is that you must stop the node before performing a snapshot. Failure to do so will most likely result in a corrupt database with unexpected consequences. Many cloud providers also require you to power down the machine before performing a snapshot.

Such stops should not be performed often. 这样的停机不应该频繁进行，如果您每周对节点进行一次快照，那么在最坏的情况下，恢复后您将拥有一个一周旧的数据库，节点赶上网络的时间将比使用mytonctrl的“从转储安装”功能（在调用`install.sh`脚本时添加-d标志）进行新安装更长。

### Disaster recovery

To recover your node on a new machine, follow these steps:

#### 安装mytonctrl / 节点

For the fastest node initialization, add the `-d` switch to the invocation of the installation script.

#### 切换到root用户

```sh
sudo -s
```

#### 停止mytoncore和验证者进程

```sh
systemctl stop validator
systemctl stop mytoncore
```

#### 应用备份的节点配置文件

- 节点配置文件：`/var/ton-work/db/config.json`

- 节点私钥环：`/var/ton-work/db/keyring`

- 节点公钥：`/var/ton-work/keys`

#### <a id="set-node-ip"></a>设置节点IP地址

如果您的新节点有不同的IP地址，则必须编辑节点配置文件`/var/ton-work/db/config.json`，并将leaf`.addrs[0].ip`设置为新IP地址的**十进制**表示。您可以使用\*\*[这个](https://github.com/sonofmom/ton-tools/blob/master/node/ip2dec.py)\*\* python脚本将您的IP转换为十进制。 Change the value of `leaf.addrs[0].ip` to reflect the new IP address in decimal format. 如果您的新节点有不同的IP地址，则必须编辑节点配置文件`/var/ton-work/db/config.json`，并将leaf`.addrs[0].ip`设置为新IP地址的**十进制**表示。您可以使用\*\*[这个](https://github.com/sonofmom/ton-tools/blob/master/node/ip2dec.py)\*\* python脚本将您的IP转换为十进制。

#### 确保数据库权限正确

```sh
chown -R validator:validator /var/ton-work/db
```

#### 应用备份的mytonctrl配置文件

Replace `$HOME/.local/share/myton*` with `$ HOME/.local/share/myton*`, where $HOME is the home directory of the user who started the installation of MyTonCtrl with backed-up content. Make sure that the user is the owner of all files you copy.

#### 通过分析进程和日志来验证验证者进程是否运行。验证者应该在几分钟内与网络重新同步。

```sh
systemctl start validator
systemctl start mytoncore
```

## <a id="network-security"></a>网络级安全

### Host-level security

主机级安全是一个庞大的话题，超出了本文档的范围，但我们建议您永远不要在root用户下安装mytonctrl，使用服务账户以确保权限分离。

### Network-level security

TON validators are high-value assets that should be protected against external threats. One of the first steps is to make your node as invisible as possible, which means locking down all network connections. On a validator node, only a UDP Port used for node operations should be exposed to the internet.

#### Tools

We will utilize the **[ufw](https://help.ubuntu.com/community/UFW)** firewall interface along with the **[jq](https://github.com/stedolan/jq)** JSON command-line processor.

#### Management networks

As a node operator, you need to retain full control and access to the machine. To do this, you need at least one fixed IP address or range.

我们还建议您设置一个带有固定 IP 地址的小型“跳板机”VPS，如果您的家庭/办公室没有固定 IP 或者在您丢失主要 IP 地址时，可以作为访问受保护机器的备用方式供您使用。

#### 安装ufw和jq1

```sh
sudo ufw default deny incoming; sudo ufw default allow outgoing
```

#### ufw规则集的基本锁定

```sh
sudo sed -i 's/-A ufw-before-input -p icmp --icmp-type echo-request -j ACCEPT/#-A ufw-before-input -p icmp --icmp-type echo-request -j ACCEPT/g' /etc/ufw/before.rules
```

#### Disable automated ICMP echo request accept

```sh
sudo  sed  -i  's/-A ufw-before-input -p icmp --icmp-type echo-request -j ACCEPT/#-A ufw-before-input -p icmp --icmp-type echo-request -j ACCEPT/g'  /etc/ufw/before.rules
```

#### Enable all access from management network(s)

```sh
sudo ufw insert 1 allow from <MANAGEMENT_NETWORK>
```

对每个管理网络/地址重复上述命令。

#### 向公众公开节点/验证者UDP端口

```sh
sudo ufw allow proto udp from any to any port `sudo jq -r '.addrs[0].port' /var/ton-work/db/config.json`
```

#### 仔细检查您的管理网络

:::caution important <mark>重要</mark>：在启用防火墙之前，请仔细检查您是否添加了正确的管理地址！
:::

#### sudo apt install -y ufw jq

```sh
sudo ufw enable
```

#### Checking status

To check the firewall status use the following command:

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

请注意，验证者上不应公开LiteServer端口。

#### 更多关于UFW的信息

参见Digital Ocean提供的这篇优秀的\*\*[ufw教程](https://www.digitalocean.com/community/tutorials/ufw-essentials-common-firewall-rules-and-commands)\*\*，了解更多ufw的魔法。

### <a id="ip-switch"></a>IP切换

If you suspect that your node is under attack, consider changing your IP address. The method for switching will depend on your hosting provider. You may need to pre-order a second IP address, clone your **stopped** virtual machine (VM) to create a new instance or set up a fresh instance through a [disaster recovery](#disaster-recovery) process.

:::warning
无论如何，请确保在节点配置文件中 **[设置新 IP 地址](/v3/guidelines/nodes/node-maintenance-and-security#-set-node-ip-address)**！
:::

<Feedback />

