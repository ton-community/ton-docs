# Running your own Full Node/Validator

To install and manage your own node, use the **[mytonctrl](https://github.com/ton-blockchain/mytonctrl)** open source tool developed by TON Foundation.

The majority of TON Nodes are reliable and tested by **mytonctrl**.

## Installation

[Node/Validator setup video](https://raw.githubusercontent.com/ton-blockchain/docs/master/docs/nodes/setup_validator.mp4 ':include controls :type=video width=100% height=400px')

Download and run the installation script.

Ubuntu:
```bash
wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
sudo bash install.sh -m full        
```

Debian:
```bash
wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
su root -c 'bash install.sh -m full'
```

Check the **mytonctrl** installation procedure at:

* [How to become a validator with mytonctrl (v0.2, OS Ubuntu)](https://github.com/ton-blockchain/mytonctrl/blob/master/docs/en/manual-ubuntu.md)


## Become a validator

To use your full node as an endpoint, skip everything about the validator function. There is no need to send coins to your wallet.

To become a validator, send Toncoin to your wallet. 

**mytonctrl** automatically joins validation from the next election round.

Check the manual here:

* [How to become a validator with mytonctrl (v0.2, OS Ubuntu)](https://github.com/ton-blockchain/mytonctrl/blob/master/docs/en/manual-ubuntu.md)
