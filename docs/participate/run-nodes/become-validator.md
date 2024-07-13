# Validator Node

:::info
Read about [Full Node](/participate/run-nodes/full-node) before this article
:::

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