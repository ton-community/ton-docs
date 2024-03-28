# 维护与安全

## <a id="introduction"></a>介绍
本指南提供了关于维护和保护TON验证节点的一些基本信息。

本文档假设使用**[TON基金会推荐](/participate/run-nodes/full-node)**的配置和工具安装了验证者，但通用概念也适用于其他场景，并且对于精通的系统管理员也很有用。

## <a id="maintenance"></a>维护
### <a id="database-grooming"></a>数据库整理
TON节点/验证者将其数据库保存在`--db`标志指定的路径下，通常是`/var/ton-work/db`，这个目录由节点创建和管理，但建议每月进行一次数据库整理/清理任务，以移除一些残留物。

**重要**：在执行以下步骤之前，您**必须**停止验证者进程，否则很可能会导致数据库损坏。

这个过程大约需要5分钟完成，不会造成重大服务中断。

#### 切换到root用户
```sh
sudo -s
```
#### 停止验证者服务
```sh
systemctl stop validator
```
#### 验证验证者是否停止运行
```sh
systemctl status validator
```
#### 执行数据库清理
```sh
find /var/ton-work/db -name 'LOG.old*' -exec rm {} +
rm -r /var/ton-work/db/files/packages/temp.archive.*
```
#### 启动验证者服务
```sh
systemctl start validator
```
通过分析进程和日志来验证验证者进程是否运行。验证者应该在几分钟内与网络重新同步。

### <a id="backups"></a>备份
备份验证者的最简单和最有效的方法是复制关键节点配置文件、密钥和mytonctrl设置：

* 节点配置文件：`/var/ton-work/db/config.json`
* 节点私钥环：`/var/ton-work/db/keyring`
* 节点公钥：`/var/ton-work/keys`
* mytonctrl配置和钱包：`$HOME/.local/share/myton*`，其中$HOME是启动mytonctrl安装的用户的主目录 **或者** `/usr/local/bin/mytoncore`，如果您以root用户安装了mytonctrl的话。

这组文件是您从头恢复节点所需的全部内容。

#### 快照
现代文件系统如ZFS提供快照功能，大多数云提供商也允许他们的客户在快照期间保留整个磁盘以备将来使用。

两种方法的问题是，您必须在进行快照之前停止节点，否则很可能导致数据库损坏并带来意想不到的后果。许多云提供商在进行快照之前也要求您关闭机器。

这样的停机不应该频繁进行，如果您每周对节点进行一次快照，那么在最坏的情况下，恢复后您将拥有一个一周旧的数据库，节点赶上网络的时间将比使用mytonctrl的“从转储安装”功能（在调用`install.sh`脚本时添加-d标志）进行新安装更长。

### <a id="disaster-recovery"></a>灾难恢复
要在新机器上恢复您的节点：

#### 安装mytonctrl / 节点
为了快速初始化节点，在安装脚本调用中添加-d开关。

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
* 节点配置文件：`/var/ton-work/db/config.json`
* 节点私钥环：`/var/ton-work/db/keyring`
* 节点公钥：`/var/ton-work/keys`

#### <a id="set-node-ip"></a>设置节点IP地址
如果您的新节点有不同的IP地址，则必须编辑节点配置文件`/var/ton-work/db/config.json`，并将leaf`.addrs[0].ip`设置为新IP地址的**十进制**表示。您可以使用**[这个](https://github.com/sonofmom/ton-tools/blob/master/node/ip2dec.py)** python脚本将您的IP转换为十进制。

#### 确保数据库权限正确
```sh
chown -R validator:validator /var/ton-work/db
```
#### 应用备份的mytonctrl配置文件
用备份的内容替换`$HOME/.local/share/myton*`，其中$HOME是启动mytonctrl安装的用户的主目录，确保您复制的所有文件的所有者是该用户。

#### 启动mytoncore和验证者进程
```sh
systemctl start validator
systemctl start mytoncore
```
## <a id="security"></a>安全
### <a id="host-security"></a>主机级安全
主机级安全是一个庞大的话题，超出了本文档的范围，但我们建议您永远不要在root用户下安装mytonctrl，使用服务账户以确保权限分离。

### <a id="network-security"></a>网络级安全
TON验证者是高价值资产，应该被保护以抵御外部威胁，您应该采取的第一步是尽可能使您的节点不可见，这意味着锁定所有网络连接。在验证者节点上，只有用于节点操作的UDP端口应该对互联网公开。

#### 工具
我们将使用**[ufw](https://help.ubuntu.com/community/UFW)**防火墙界面以及**[jq](https://github.com/stedolan/jq)** JSON命令行处理器。

#### 管理网络
作为节点运营商，您需要保留对机器的完全控制和访问权限，为此，您至少需要一个固定的IP地址或范围。

我们还建议您设置一个带有固定 IP 地址的小型“跳板机”VPS，如果您的家庭/办公室没有固定 IP 或者在您丢失主要 IP 地址时，可以作为访问受保护机器的备用方式供您使用。

#### 安装ufw和jq1
```sh
sudo apt install -y ufw jq
```
#### ufw规则集的基本锁定
```sh
sudo ufw default deny incoming; sudo ufw default allow outgoing
```
#### 禁用自动ICMP回声请求接受
```sh
sudo sed -i 's/-A ufw-before-input -p icmp --icmp-type echo-request -j ACCEPT/#-A ufw-before-input -p icmp --icmp-type echo-request -j ACCEPT/g' /etc/ufw/before.rules
```
#### 从管理网络启用所有访问
```sh
sudo ufw insert 1 allow from <MANAGEMENT_NETWORK>
```
对每个管理网络/地址重复上述命令。

#### 向公众公开节点/验证者UDP端口
```sh
sudo ufw allow proto udp from any to any port `sudo jq -r '.addrs[0].port' /var/ton-work/db/config.json`
```
#### 仔细检查您的管理网络
<mark>重要</mark>：在启用防火墙之前，请仔细检查您是否添加了正确的管理地址！

#### 启用ufw防火墙
```sh
sudo ufw enable
```
#### 检查状态
使用以下命令检查防火墙状态：
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
参见Digital Ocean提供的这篇优秀的**[ufw教程](https://www.digitalocean.com/community/tutorials/ufw-essentials-common-firewall-rules-and-commands)**，了解更多ufw的魔法。

### <a id="ip-switch"></a>IP切换
如果您认为您的节点正在遭受攻击，则应考虑更换IP地址。实现切换的方式取决于您的托管提供商；您可能需要预订第二个地址、将**已停止**的VM克隆到另一个实例，或者通过执行**[灾难恢复](#disaster-recovery)**流程设置新的实例。

无论如何，请确保您在节点配置文件中**[设置新的IP地址](#set-node-ip)**！
