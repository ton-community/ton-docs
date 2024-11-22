# Maintenance and Security

## <a id="introduction"></a>Introduction
This guide provides some basic information on maintaining and securing TON Validator nodes. 

This document assumes that a validator is installed using the configuration and tools **[recommended by TON Foundation](/v3/guidelines/nodes/running-nodes/full-node)**  but general concepts apply to other scenarios as well and can be useful for savvy sysadmins.

## <a id="maintenance"></a>Maintenance
### <a id="database-grooming"></a>Database grooming
TON Node keeps its database within the path specified by `--db` flag of `validator-engine`, usually `/var/ton-work/db`. To reduce the database size, you can decrease the TTL (time-to-live) of some stored data.

Current TTL values can be found in the node service file (default path is `/etc/systemd/system/validator.service`). If you use MyTonCtrl you can use command `installer status`. If some of the values are not set, then the default values are used.

### archive-ttl

`archive-ttl` is a parameter that defines the time-to-live for the blocks. The default value is 604800 seconds (7 days). You can decrease this value to reduce the database size.

```bash
MyTonCtrl> installer set_node_argument --archive-ttl <value>
```

If you don't use MyTonCtrl then you can edit the node service file.

### state-ttl

`state-ttl` is a parameter that defines the time-to-live for the blocks states. The default value is 86400 seconds (24 hours). You can decrease this value to reduce the database size, but for validators it's highly recommended to use the default value (keep the flag unset).
Also, this value should be more than length of the validation period (the value can be found in [15th config param](https://docs.ton.org/v3/documentation/network/configs/blockchain-configs#param-15)).

```bash
MyTonCtrl> installer set_node_argument --state-ttl <value>
```

If you don't use MyTonCtrl then you can edit the node service file.

### <a id="backups"></a>Backups
The easiest and most efficient way to backup the validator is to copy crucial node configuration files, keys and mytonctrl settings:

* Node configuration file: `/var/ton-work/db/config.json`
* Node private keyring: `/var/ton-work/db/keyring`
* Node public keys: `/var/ton-work/keys`
* mytonctrl configuration and wallets: `$HOME/.local/share/myton*` where $HOME is the home directory of the user who started the installation of mytonctrl **OR** `/usr/local/bin/mytoncore` if you installed mytonctrl as root.

This set is everything you need to perform a recovery of your node from scratch.

#### Snapshots
Modern file systems such as ZFS offer snapshot functionality, most cloud providers also allow their customers to make snapshots of their machines during which the entire disk is preserved for future use.

The problem with both methods is that you must stop node before performing a snapshot, failure to do so will most likely result in a corrupt database with unexpected consequences. Many cloud providers also require you power down the machine before performing a snapshot. 

Such stops should not be performed often, if you snapshot your node once a week then in the worst case scenario after recovery you will have a node with a week-old database and it will take your node more time to catch up with the network then to perform a new installation using mytonctrl "install from dump" feature (-d flag added during invocation of `install.sh` script).

### <a id="disaster-recovery"></a>Disaster recovery
To perform recovery of your node on a new machine:

#### Install mytonctrl / node 
For fastest node initialization add `-d` switch to invocation of installation script.

#### Switch to root user
```sh
sudo -s
```
#### Stop mytoncore and validator processes
```sh
systemctl stop validator
systemctl stop mytoncore
```
#### Apply backed up node configuration files
* Node configuration file: `/var/ton-work/db/config.json`
* Node private keyring: `/var/ton-work/db/keyring`
* Node public keys: `/var/ton-work/keys`

#### <a id="set-node-ip"></a> Set node IP address
If your new node has a different IP address then you must edit the node configuration file `/var/ton-work/db/config.json` and set the leaf `.addrs[0].ip` to **decimal** representation of new IP address. You can use **[this](https://github.com/sonofmom/ton-tools/blob/master/node/ip2dec.py)** python script to convert your IP to decimal.

#### Ensure proper database permissions
```sh
chown -R validator:validator /var/ton-work/db
```
#### Apply backed up mytonctrl configuration files
Replace `$HOME/.local/share/myton*` where $HOME is home directory of user who started the installation of mytonctrl with backed-up content, make sure that the user is the owner of all files you copy.

#### Start mytoncore and validator processes
```sh
systemctl start validator
systemctl start mytoncore
```
## <a id="security"></a>Security
### <a id="host-security"></a>Host level security
Host level security is a huge topic which lies outside the scope of this document, we do however advise that you never install mytonctrl under root user, use a service account to ensure privilege separation.

### <a id="network-security"></a>Network level security
TON Validators are high value assets that should be protected against external threats, one of the first steps you should take is to make your node as invisible as possible, this means locking down all network connections. On a validator node, only a UDP Port used for node operations should be exposed to the internet.

#### Tools
We will use a **[ufw](https://help.ubuntu.com/community/UFW)** firewall interface as well as a **[jq](https://github.com/stedolan/jq)** JSON command line processor.

#### Management Networks
As a node operator, you need to retain full control and access to the machine, in order to do this you need at least one fixed IP address or range.

We also advise you to setup a small "jumpstation" VPS with a fixed IP Address that can be used by you to access your locked down machine(s) if you do not have a fixed IP at your home/office or to add an alternative way to access secured machines should you lose your primary IP address.

#### Install ufw and jq1
```sh
sudo apt install -y ufw jq
```
#### Basic lockdown of ufw ruleset
```sh
sudo ufw default deny incoming; sudo ufw default allow outgoing
```
#### Disable automated ICMP echo request accept
```sh
sudo sed -i 's/-A ufw-before-input -p icmp --icmp-type echo-request -j ACCEPT/#-A ufw-before-input -p icmp --icmp-type echo-request -j ACCEPT/g' /etc/ufw/before.rules
```
#### Enable all access from management network(s)
```sh
sudo ufw insert 1 allow from <MANAGEMENT_NETWORK>
```
repeat the above command for each management network / address.

#### Expose node / validator UDP port to public
```sh
sudo ufw allow proto udp from any to any port `sudo jq -r '.addrs[0].port' /var/ton-work/db/config.json`
```
#### Doublecheck your management networks
<mark>Important</mark>: before enabling firewall, please double-check that you added the correct management addresses!

#### Enable ufw firewall
```sh
sudo ufw enable
```
#### Checking status
To check the firewall status use the following command:
```sh
    sudo ufw status numbered
```
Here is an example output of a locked-down node with two management networks / addresses:

```
Status: active

     To                         Action      From
     --                         ------      ----
[ 1] Anywhere                   ALLOW IN    <MANAGEMENT_NETWORK_A>/28
[ 2] Anywhere                   ALLOW IN    <MANAGEMENT_NETWORK_B>/32
[ 3] <NODE_PORT>/udp            ALLOW IN    Anywhere
[ 4] <NODE_PORT>/udp (v6)       ALLOW IN    Anywhere (v6)
```

#### Expose LiteServer port
```sh
sudo ufw allow proto tcp from any to any port `sudo jq -r '.liteservers[0].port' /var/ton-work/db/config.json`
```

Please note that the LiteServer port should not be exposed publicly on a validator.

#### More information on UFW
See this excellent **[ufw tutorial](https://www.digitalocean.com/community/tutorials/ufw-essentials-common-firewall-rules-and-commands)** from Digital Ocean for more ufw magic.

### <a id="ip-switch"></a>IP Switch
If you believe that your node is under attack then you should consider switching IP Address. The way to achieve the switch depends on your hosting provider; you might pre-order a second address, clone your **stopped** VM into another instance or setup a new instance by performing a **[disaster recovery](#disaster-recovery)** process.

In any case, please do make sure that you **[set your new IP Address](/v3/guidelines/nodes/node-maintenance-and-security#-set-node-ip-address)** in the node configuration file!
