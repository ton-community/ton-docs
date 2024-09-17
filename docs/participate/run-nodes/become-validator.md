# Validator Node


## Minimal Hardware Requirements

- 16 cores CPU
- 128 GB RAM
- 1TB NVME SSD _OR_ Provisioned 64+k IOPS storage
- 1 Gbit/s network connectivity
- public IP address (_fixed IP address_)
- 16 TB/month traffic on peak load

> Typically you'll need at least a 1 Gbit/s connection to reliably accommodate peak loads (the average load is expected to be approximately 100 Mbit/s).

> We draw special attention of validators to IOPS disk requirements, it is crucially important for smooth network operation.

## Port Forwarding

All types of nodes require a static external IP address, one UDP port to be forwarded for incoming connections and all outgoing connections to be open - the node uses random ports for new outgoing connections. It's necessarily for the node to be visible to the outside world over the NAT.

It can be done with your network provider or [rent a server](/participate/run-nodes/full-node#recommended-providers) to run a node.

:::info
It's possible to find out which UDP port is opened from the `netstat -tulpn` command.
:::


## Prerequisite

### Learn Slashing Policy

If the validator processed less than 90% of the expected number of blocks during a validation round, this Validator will be fined by 101 TON.
Read more about [slashing policy](/participate/network-maintenance/staking-incentives#decentralized-system-of-penalties).


### Run a Fullnode
Launch [Full Node](/participate/run-nodes/full-node) before follow this article.



Check that validator mode is enabled using `status_modes` command. If it's not, refer [mytonctrl enable_mode command](/participate/run-nodes/mytonctrl#enable_mode).

## View the List of Wallets

Check out the list of available wallets in the **MyTonCtrl** console using the `wl` command:

```sh
wl
```

During the installation of **mytonctrl**, the **validator_wallet_001** wallet is created:

![wallet list](/img/docs/nodes-validator/manual-ubuntu_mytonctrl-wl_ru.png)


## Activate the Wallets

1. Send the necessary number of coins to the wallet and activate it.

   Recently (_at the end of 2023_), the approximate figures have been a minimum stake of around __340K TON__ and a maximum of about __1M TON__.

   Check current stakes with [tonscan.com](https://tonscan.com/validation) to understand necessary amount of coins.

   Read more [how maximum and minimum stakes calculated](/participate/network-maintenance/staking-incentives#values-of-stakes-max-effective-stake).

2. Use the `vas` command to display the history of transfers:

    ```sh
    vas [wallet name]
    ```

3. Activate the wallet using the `aw` command (`wallet name` is optional, if no arguments provided it will activate all available)

    ```sh
    aw [wallet name]
    ```

![account history](/img/docs/nodes-validator/manual-ubuntu_mytonctrl-vas-aw_ru.png)

## Your Validator is Now Ready

**mytoncore** will automatically join the elections. It divides the wallet balance into two parts and uses them as a stake to participate in the elections. You can also manually set the stake size:

```sh
set stake 50000
```

`set stake 50000` — this sets the stake size to 50k coins. If the bet is accepted and our node becomes a validator, the bet can only be withdrawn in the second election (according to the rules of the electorate).

![setting stake](/img/docs/nodes-validator/manual-ubuntu_mytonctrl-set_ru.png)

## Maintain Guidelines

:::caution Slashing of Poor Validators
If the validator processed less than 90% of the expected number of blocks during a validation round, this Validator will be fined by 101 TON.

Read more about [slashing policy](/participate/network-maintenance/staking-incentives#decentralized-system-of-penalties).
:::


As a TON Validators, make sure you are follow these crucial steps to ensure network stability and to avoid slashing penalties in the future.

Essential Actions:

1. Follow the @tonstatus turn on notifications and be ready to apply urgent updates if necessary.
2. Ensure your hardware meets or exceeds [system requirements](/participate/run-nodes/become-validator#minimal-hardware-requirements).
3. We imperatively request you to use [mytonctrl](https://github.com/ton-blockchain/mytonctrl).
In `mytonctrl` keep update due the notification and enable telemetry: `set sendTelemetry true`
4. Set up monitoring dashboards for RAM, Disk, Network, and CPU usage. For technical assistance, contact @mytonctrl_help_bot.
5. Monitor the efficiency of your validator with dashboards. 
- Check with `mytonctrl` via `check_ef`.
- [Build dashboard with APIs](/participate/run-nodes/become-validator#validation-and-effectiveness-apis).

:::info
`mytonctrl` allows to check effectiveness of validators via command `check_ef` which outputs your validator efficiency data for the last round and for current round.
This command retrieves data by calling `checkloadall` utility.
Ensure, that your efficiency is greater than 90% (for the full round period).
:::

:::info
In case of low efficiency - take action to fix the problem. Contact technical support [@mytonctrl_help_bot](https://t.me/mytonctrl_help_bot) if necessary.
:::


## Validation and Effectiveness APIs

1. https://elections.toncenter.com/docs - use this API to get information about current and past validation rounds (cycles) - time of rounds, which validators participated in them, their stakes, etc.

Information on current and past elections (for the validation round) is also available.

3. https://toncenter.com/api/qos/index.html#/ - use this API to get information on the efficiency of validators over time.

This API analyses the information from the catchain and builds an estimate of the validator's efficiency. This API does not use the checkloadall utility, but is its alternative.
Unlike `checkloadall` which works only on validation rounds, in this API you can set any time interval to analyse the validator's efficiency.

How to use:

- pass ADNL address of your validator and time interval (from_ts, to_ts) to API. For accurate result it makes sense to take a sufficient interval, for example from  18 hours ago the current moment.

- get the result. If your efficiency percentage field is less than 80%, your validator is not working properly.

- It is important that your validator participates in validation and has the same ADNL address throughout the specified time period.

For example, if a validator participates in validation every second round - then you need to specify only those intervals when he participated in validation. Otherwise, you will get an incorrect underestimate.

- this works not only for masterchain validators (with index < 100) but also for other validators (with index > 100).

 Please set up dashboards to monitor your validators using these APIs.


## Support 

Contact technical support [@mytonctrl_help_bot](https://t.me/mytonctrl_help_bot).
This  bot for validators only. If you have a regular node, then contact the group: [@mytonctrl_help](https://t.me/mytonctrl_help).

