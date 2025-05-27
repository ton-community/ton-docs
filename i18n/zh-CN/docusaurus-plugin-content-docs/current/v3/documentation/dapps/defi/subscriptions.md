# 内容订阅

由于 TON 区块链中的交易快速，网络费用低廉，您可以通过智能合约在链上处理定期支付。

例如，用户可以订阅数字内容（或其他任何东西）并被收取每月 1 TON 的费用。

:::tip
此内容是版本v4的钱包的特定内容。旧钱包没有此功能；它也可以在未来版本中更改。
:::

:::warning
Subscription contract requires authorization exactly once, on installation; then it can withdraw TON as it pleases. Do your own research before attaching unknown subscriptions.

另一方面，用户不能在不知情的情况下安装订阅程序。
:::

## 示例流程

- 用户使用 v4 钱包。它允许额外的智能合约，称为插件，扩展它的功能。

  在确保其功能后，用户可以批准他钱包的可信智能合约(插件)的地址。 此后，可信的智能合约可以从钱包中提取Tonco币。这类似于其他区块链中的“无限审批”。

- 每个用户和服务之间使用中间订阅智能合约作为钱包插件。

  该智能合约保证在指定周期内，用户钱包中的指定数量的 Toncoin 不会被扣除超过一次。

- 服务的后端通过向订阅智能合约发送外部消息，定期发起支付。

- 用户或服务可以决定他们不再需要订阅并终止订阅。

## 智能合约示例

- [钱包 v4 智能合约源代码](https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc)
- [订阅智能合约源代码](https://github.com/ton-blockchain/wallet-contract/blob/main/func/simple-subscription-plugin.fc)

## 实现

一个良好的实现案例是通过 [@donate](https://t.me/donate) 机器人和 [Tonkeeper 钱包](https://tonkeeper.com) 对 Telegram 中私人频道的 Toncoin 进行去中心化订阅。
