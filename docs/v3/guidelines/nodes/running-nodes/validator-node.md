import Feedback from '@site/src/components/Feedback';

# Validator node

Network validators confirm all user transactions. If all validators agree that a transaction is valid, it gets added to the blockchain. Invalid transactions are rejected. See more information [here](https://ton.org/validators).

## Minimal hardware requirements

- 16-core CPU  
- 128 GB RAM  
- 1TB NVMe SSD or provisioned 64+k IOPS storage  
- 1 Gbit/s network connectivity  
- Public IP address (fixed IP address)  
- 100 TB/month traffic at peak load

> Typically you'll need at least a 1 Gbit/s connection to reliably accommodate peak loads (the average load is expected to be approximately 100 Mbit/s).

> We draw special attention of validators to IOPS disk requirements, it is crucially important for smooth network operation.

## Port forwarding

All types of nodes require a static external IP address, one UDP port forwarded for incoming connections, and all outgoing connections to be open—the node uses random ports for new outgoing connections. The node must also be visible to the outside world over the NAT.

You can work with your network provider or [rent a server](/v3/guidelines/nodes/running-nodes/full-node#recommended-providers) to run a node.

:::info
To determine which UDP ports are open, use the `netstat -tulpn` command.
:::

## Prerequisites

### Learn slashing policy

If a validator processes less than 90% of the expected blocks during a validation round, they will be fined by 101 TON.

Learn more about the [slashing policy](/v3/documentation/infra/nodes/validation/staking-incentives#decentralized-system-of-penalties).
  
### Running a fullnode

Launch the [Full Node](/v3/guidelines/nodes/running-nodes/full-node) before follow this article.

Ensure that validator mode is enabled by using the `status_modes` command. If it is not enabled, refer to the [MyTonCtrl enable_mode command](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview#enable_mode).

## Architecture

![image](/img/nominator-pool/hot-wallet.png)

## View the list of wallets

Check out the list of available wallets in the `MyTonCtrl` console using the `wl` command:

```sh
wl
```

During the installation of `MyTonCtrl`, the installer creates a wallet named `validator_wallet_001`.

![wallet list](/img/docs/nodes-validator/manual-ubuntu_mytonctrl-wl_ru.png)

## Activate the wallets

1. Send the necessary number of coins to the wallet and activate it. The minimum stake is approximately __300K TON__, and the maximum is about __1M__ TON. To understand the required amount of coins, please check the current stakes at [tonscan.com](https://tonscan.com/validation). For  more information, see [how maximum and minimum stakes calculated](/v3/documentation/infra/nodes/validation/staking-incentives#values-of-stakes-max-effective-stake).

2. Use the `vas` command to view the history of transfers:

```sh
vas [wallet name]
```

3. Use the `aw` command to activate the wallet. The `wallet name` parameter is optional; if no arguments are provided, all available wallets will be activated.

```sh
aw [wallet name]
```

![account history](/img/docs/nodes-validator/manual-ubuntu_mytonctrl-vas-aw_ru.png)

## Your validator is ready to use

**mytoncore** automatically participates in elections by dividing the wallet balance into two parts. These parts are then used as a stake for participation. Additionally, you can manually adjust the stake size:

```sh
set  stake  50000
```

The command above sets the stake size to 50k Toncoins. If the bet is accepted and your node becomes a validator, the stake can only be withdrawn in the second election as per the electorate's rules.

![setting stake](/img/docs/nodes-validator/manual-ubuntu_mytonctrl-set_ru.png)

## Adhere to rules  

:::caution Slashing policy for underperforming validators
If a validator processes less than 90% of the expected number of blocks during a validation round, that validator will incur a fine of 101 TON. For more information, read about the [slashing policy](/v3/documentation/infra/nodes/validation/staking-incentives#decentralized-system-of-penalties).
:::

As a TON validator, make sure you follow these crucial steps to ensure network stability and avoid slashing penalties in the future.

### Important measures:

1. Follow [@tonstatus](https://t.me/tonstatus), turn on notifications, and be prepared for urgent updates if needed.

2. Make sure that your hardware meets or exceeds the [minimum system requirements](/v3/guidelines/nodes/running-nodes/validator-node#minimal-hardware-requirements).

3. We strongly urge you to utilize [MyTonCtrl](https://github.com/ton-blockchain/mytonctrl).

	- In `MyTonCtrl`, ensure that updates are synchronized with notifications and enable telemetry by setting the option: `set sendTelemetry true`.

4. Set up monitoring dashboards for RAM, disk, network, and CPU usage. For technical assistance, please contact [@mytonctrl_help_bot](https://t.me/mytonctrl_help_bot).

5. Monitor the efficiency of your validator with dashboards.

	- Please verify with `MyTonCtrl` using the `check_ef` command.

	- Check [Build dashboard with APIs](/v3/guidelines/nodes/running-nodes/validator-node#validation-and-effectiveness-apis).

:::info
`MyTonCtrl` enables you to evaluate the performance of validators using the command `check_ef`. This command provides efficiency data for both the last round and the current round. The data is retrieved by calling the `checkloadall` utility. Make sure that your efficiency is above 90% for the entire round period.
:::

:::info
If you encounter low efficiency, take action to resolve the issue. If necessary, contact technical support at [@mytonctrl_help_bot](https://t.me/mytonctrl_help_bot).
:::

## Validation effectiveness APIs

:::info
Please set up dashboards to monitor your validators using the APIs provided below.
:::

### Penalized validators tracker

You can track penalized validators on each round with [@tonstatus_notifications](https://t.me/tonstatus_notifications).

#### Validation API

You can use this [API](https://elections.toncenter.com/docs) to obtain information about current and past validation rounds (cycles) - including the timing of rounds, which validators participated, their stakes, and more. Information regarding current and past elections for each validation round is also available.

#### Efficiency API

You can use this [API](https://toncenter.com/api/qos/index.html#/) to obtain information about the efficiency of validators over time.

This API analyzes data from the catchain to provide an estimate of a validator's efficiency. It serves as an alternative to the `checkloadall` utility.

Unlike `checkloadall`, which only works on validation rounds, this API allows you to set any time interval to analyze a validator's efficiency.

##### Workflow:

1. To the API, provide the ADNL address of your validator along with a time interval (`from_ts`, `to_ts`). For accurate results, choose a sufficient interval, such as 18 hours ago to the present moment.

2. Retrieve the result. If your efficiency percentage is below 80%, your validator is malfunctioning.

3. Your validator must actively participate in validation and use the same ADNL address throughout the specified time period. For example, if a validator contributes to validation every second round, you should only indicate the intervals during which they participated. Failing to do so may result in an inaccurate underestimate. This requirement applies not only to MasterChain validators (with an index < 100) but also to other validators (with an index > 100).

## Support

Contact technical support [@mytonctrl_help_bot](https://t.me/mytonctrl_help_bot). This bot is for validators only and will not assist with questions for regular nodes.

If you run a regular node, then contact the group: [@mytonctrl_help](https://t.me/mytonctrl_help).

## See also

* [Run a full node](/v3/guidelines/nodes/running-nodes/full-node)
* [Troubleshooting](/v3/guidelines/nodes/nodes-troubleshooting)
* [Staking incentives](/v3/documentation/infra/nodes/validation/staking-incentives)
<Feedback />

