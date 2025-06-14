import Feedback from '@site/src/components/Feedback';

# Maintenance and security

## Introduction

This guide provides essential information for maintaining and securing TON validator nodes.

It assumes that you install a validator using the configuration and tools **[recommended by the TON Foundation](/v3/guidelines/nodes/running-nodes/full-node)**. However, the general concepts discussed here can be applied to other scenarios, making them useful for experienced system administrators.

## Maintenance

### Database grooming

The TON node maintains its database at the location specified by the `--db` flag in the `validator-engine`, which is usually `/var/ton-work/db`. To reduce the database size, you can decrease the time-to-live (TTL) for some of the stored data.

The current TTL values are in the node's service file, which is typically located at `/etc/systemd/system/validator.service`. If you use MyTonCtrl, you can check the status by running the command `installer status`. The system will use the default values if any of the TTL values are not set.

### `archive-ttl`

`archive-ttl` is a parameter that defines the TTL for the blocks. The default value is 604800 seconds (7 days). You can decrease this value to reduce the database size.

```bash
MyTonCtrl> installer  set_node_argument  --archive-ttl <value>
```

If you don't use MyTonCtrl, you can edit the node service file.

### `state-ttl`

`state-ttl` is a parameter defining the block states' TTL. The default value is 86400 seconds (24 hours). You can decrease this value to reduce the database size, but for validators, it's highly recommended that the default value be used (keep the flag unset).

Also, this value should be more than the length of the validation period (check the value in [15th config param](/v3/documentation/network/configs/blockchain-configs#param-15)).

```bash
MyTonCtrl> installer  set_node_argument  --state-ttl <value>
```

If you don't use MyTonCtrl, you can edit the node service file.

### Backups

To efficiently back up your validator, it is essential to copy the key node configuration files, keys, and MyTonCtrl settings. Here are the important files to back up:

1. **Node configuration file**:  `/var/ton-work/db/config.json`

2. **Node private keyring**:  `/var/ton-work/db/keyring`

3. **Node public keys**:  `/var/ton-work/keys`

4. **MyTonCtrl configuration and wallets**:
   - If you installed MyTonCtrl as a regular user: `$HOME/.local/share/myton*` (where `$HOME` is your home directory)
   - If you installed MyTonCtrl as root: `/usr/local/bin/mytoncore`

Backing up this set of files will provide everything you need to recover your node from scratch.

#### スナップショット

Modern file systems such as ZFS offer snapshot functionality. Most cloud providers also allow their customers to make snapshots of their machines, during which the entire disk is preserved for future use.

The problem with both methods is that you must stop the node before performing a snapshot. Failure to do so will most likely result in a corrupt database with unexpected consequences. Many cloud providers also require you to power down the machine before performing a snapshot.

Such stops should not be performed often. If you snapshot your node once a week, then in the worst case scenario after recovery, you will have a node with a week-old database, and it will take your node more time to catch up with the network than to perform a new installation using the MyTonCtrl **install from dump** feature (`-d` flag added during invocation of `install.sh` script).

### Disaster recovery

To recover your node on a new machine, follow these steps:

#### Install MyTonCtrl/node

For the fastest node initialization, add the `-d` switch to the invocation of the installation script.

#### rootユーザーに切り替える

```sh
sudo  -s
```

#### Mytoncore とバリデータープロセスを停止します

```sh
systemctl  stop  validator
systemctl  stop  mytoncore
```

#### バックアップされたノード設定ファイルを適用

- ノード設定ファイル: `/var/ton-work/db/config.json`

- Node private keyring: `/var/ton-work/db/keyring`

- ノードの公開鍵: `/var/ton-work/keys`

#### Set node IP address

If your new node has a different IP address, you need to update the node configuration file located at `/var/ton-work/db/config.json`. Change the value of `leaf.addrs[0].ip` to reflect the new IP address in decimal format. You can use **[this](https://github.com/sonofmom/ton-tools/blob/master/node/ip2dec.py)** Python script to convert your IP address to decimal.

#### 適切なデータベースのアクセス許可を確認する

```sh
chown  -R  validator:validator  /var/ton-work/db
```

#### Apply backed-up MyTonCtrl configuration files

Replace `$HOME/.local/share/myton*` with `$ HOME/.local/share/myton*`, where $HOME is the home directory of the user who started the installation of MyTonCtrl with backed-up content. Make sure that the user is the owner of all files you copy.

#### Mytoncore とバリデータープロセスを開始します。

```sh
systemctl  start  validator
systemctl  start  mytoncore
```

## Security

### Host-level security

Host-level security is a huge topic that is outside the scope of this document; however, we advise that you never install MyTonCtrl under the root user and use a service account to ensure privilege separation.

### Network-level security

TON validators are high-value assets that should be protected against external threats. One of the first steps is to make your node as invisible as possible, which means locking down all network connections. On a validator node, only a UDP Port used for node operations should be exposed to the internet.

#### ツール

We will utilize the **[ufw](https://help.ubuntu.com/community/UFW)** firewall interface along with the **[jq](https://github.com/stedolan/jq)** JSON command-line processor.

#### Management networks

As a node operator, you need to retain full control and access to the machine. To do this, you need at least one fixed IP address or range.

We also advise you to set up a small **jumpstation** VPS with a fixed IP Address that can be used to access your locked-down machine(s) if you do not have a fixed IP at your home or office or to add an alternative way to access secured machines should you lose your primary IP address.

#### Install ufw and jq

```sh
sudo  apt  install  -y  ufw  jq
```

#### UFWルールセットの基本的なロック

```sh
sudo  ufw  default  deny  incoming; sudo  ufw  default  allow  outgoing
```

#### 自動化された ICMP エコーリクエストの承認を無効にする

```sh
sudo  sed  -i  's/-A ufw-before-input -p icmp --icmp-type echo-request -j ACCEPT/#-A ufw-before-input -p icmp --icmp-type echo-request -j ACCEPT/g'  /etc/ufw/before.rules
```

#### 管理ネットワークからのすべてのアクセスを有効にする

```sh
sudo  ufw  insert  1  allow  from <MANAGEMENT_NETWORK>
```

Repeat the above command for each management network/address.

#### Expose node/validator UDP port to public

```sh
sudo  ufw  allow  proto  udp  from  any  to  any  port  `sudo jq -r '.addrs[0].port' /var/ton-work/db/config.json`
```

#### 管理ネットワークを二重チェック

:::caution important
**Before enabling a firewall,  double-check that you added the correct management addresses!**
:::

#### ufwファイアウォールを有効にする

```sh
sudo  ufw  enable
```

#### ステータスを確認中

ファイアウォールの状態を確認するには、次のコマンドを使用します。

```sh
sudo  ufw  status  numbered
```

Here is an example output of a locked-down node with two management networks/addresses:

```
Status: active

     To                         Action      From
     --                         ------      ----
[ 1] Anywhere                   ALLOW IN    <MANAGEMENT_NETWORK_A>/28
[ 2] Anywhere                   ALLOW IN    <MANAGEMENT_NETWORK_B>/32
[ 3] <NODE_PORT>/udp            ALLOW IN    Anywhere
[ 4] <NODE_PORT>/udp (v6)       ALLOW IN    Anywhere (v6)
```

#### Expose liteserver port

```sh
sudo  ufw  allow  proto  tcp  from  any  to  any  port  `sudo jq -r '.liteservers[0].port' /var/ton-work/db/config.json`
```

Note that the liteserver port should not be exposed publicly on a validator.

#### UFWの詳細情報

See this excellent **[ufw tutorial](https://www.digitalocean.com/community/tutorials/ufw-essentials-common-firewall-rules-and-commands)** from the Digital Ocean for more ufw magic.

### IP switch

If you suspect that your node is under attack, consider changing your IP address. The method for switching will depend on your hosting provider. You may need to pre-order a second IP address, clone your **stopped** virtual machine (VM) to create a new instance or set up a fresh instance through a [disaster recovery](#disaster-recovery) process.

:::warning
Regardless of the approach you choose, be sure to [update your new IP address](#set-node-ip-address) in the node configuration file!
:::

<Feedback />

