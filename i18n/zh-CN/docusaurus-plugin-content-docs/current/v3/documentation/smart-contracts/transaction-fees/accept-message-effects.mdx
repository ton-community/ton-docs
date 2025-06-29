# 接受消息的影响

`accept_message` 和 `set_gas_limit` 在执行[stdlib参考](/develop/func/stdlib#accept_message)中所说的操作时，可能会产生一些不那么直接的影响。

## 外部消息

外部消息的处理流程如下：

- `gas_limit`被设置为`gas_credit`（ConfigParam 20和ConfigParam 21），等于10k gas。
- 在使用这些信用额度期间，合约应该调用`accept_message`来`set_gas_limit`，表明它准备支付消息处理费用。
- 如果`gas_credit`被消耗完或计算结束，并且没有调用`accept_message`，消息将被完全丢弃（就好像它从未存在过一样）。
- 否则，将设置一个新的gas限制，等于`contract_balance/gas_price`（在`accept_message`的情况下）或自定义数字（在`set_gas_limit`的情况下）；在交易结束后，将从合约余额中扣除完整的计算费用（这样，`gas_credit`实际上是**信用**，而不是免费gas）。

请注意，如果在`accept_message`之后抛出某些错误（无论是在Compute Phase还是Action Phase），交易将被写入区块链，并且费用将从合约余额中扣除。然而，存储不会被更新，操作不会被应用，就像任何带有错误退出代码的交易一样。

因此，如果合约接受外部消息然后由于消息数据中的错误或发送错误序列化的消息而抛出异常，它将支付处理费用，但无法阻止消息重放。**同一消息将被合约反复接受，直到消耗完整个余额。**

## 内部消息

默认情况下，当合约接收到内部消息时，gas限制被设置为`message_balance`/`gas_price`。换句话说，消息为其处理支付。通过使用`accept_message`/`set_gas_limit`，合约可以在执行期间更改gas限制。

请注意，手动设置的gas限制不会干扰弹回行为；如果消息以可弹回模式发送，并且包含足够的钱来支付其处理和创建弹回消息的费用，消息将被弹回。

:::info 示例

如果在同一示例中，计算成本为0.5（而不是0.005），则不会发生弹回（消息余额将是`0.1 - 0.5 - 0.001 = -0.401`，因此没有弹回），合约余额将是`1 + 0.1 - 0.5` = `0.6` TON。
:::
