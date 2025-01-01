# 使用 TON 区块链时应注意的事项

在本文中，我们将回顾和讨论希望开发 TON 应用程序的人员需要考虑的要素。

## 检查清单

### 1.名称碰撞

Func 变量和函数几乎可以包含任何合法字符。例如，`var++`、`~bits`、`foo-bar+baz`（包括逗号）都是有效的变量和函数名。

在编写和检查 Func 代码时，应使用 Linter。

- [集成开发环境插件](/v3/documentation/smart-contracts/getting-started/ide-plugins/)

### 2. 检查抛出值

TVM 的执行每次正常停止时，都会以退出代码 `0` 或 `1` 停止。虽然 TVM 是自动执行的，但如果通过 `throw(0)` 或 `throw(1)` 命令直接抛出退出代码 `0` 和 `1`，TVM 的执行可能会被意外直接中断。

- [如何处理错误](/v3/documentation/smart-contracts/func/docs/builtins#throwing-exceptions)
- [TVM 退出代码](/v3/documentation/tvm/tvm-exit-codes)

### 3. Func 是一种严格类型化的语言，其数据结构存储的正是它们应该存储的内容

跟踪代码的操作和可能返回的结果至关重要。请记住，编译器只关心代码，而且只关心代码的初始状态。在某些操作之后，某些变量的存储值可能会发生变化。

读取意外变量值和调用不应该有此类方法的数据类型的方法（或其返回值未正确存储）都是错误，不会作为 "警告 "或 "通知 "跳过，而是会导致代码无法运行。请记住，存储意外值可能没有问题，但读取意外值可能会导致问题，例如，对于整数变量，可能会抛出错误代码 5（整数超出预期范围）。

### 4.信息具有模式(modes)

必须检查报文模式，特别是它与之前发送的报文和费用之间的相互关系。可能出现的故障是没有考虑存储费用，在这种情况下，合约可能会耗尽 TON，导致发送信息时出现意外故障。您可以查看消息模式 [此处](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes)。

### 5. TON完全实现演员模型

这意味着合约的代码可以更改。既可以使用 [`SETCODE`](/v3/documentation/smart-contracts/func/docs/stdlib#set_code)TVM 指令永久更改代码，也可以在运行时将 TVM 代码注册表设置为新的 cell 值，直到执行结束。

### 6.TON 区块链有几个交易阶段：计算阶段、行动阶段和反弹阶段。

计算阶段会执行智能合约的代码，然后才会执行操作（发送消息、修改代码、更改库等）。因此，与基于以太坊的区块链不同的是，如果你预计发送的消息会失败，就不会看到计算阶段的退出代码，因为它不是在计算阶段执行的，而是在之后的操作阶段执行的。

- [事务和阶段](/v3/documentation/tvm/tvm-overview#transactions-and-phases)

### 7. TON 合约是自治的

区块链中的合约可以驻留在不同的分片中，由其他验证器处理，这意味着开发者无法按需从其他合约中获取数据。因此，任何通信都是异步的，通过发送消息来完成。

- [从智能合约发送信息](/v3/documentation/smart-contracts/message-management/sending-messages)
- [从 DApp 发送信息](/v3/guidelines/ton-connect/guidelines/sending-messages)

### 8. 与其他区块链不同，TON 不包含还原信息，只包含退出代码

在开始编写 TON 智能合约之前，考虑清楚代码流的退出代码路线图（并将其记录在案）是很有帮助的。

### 9. 具有 `method_id` 标识符的 Func 函数具有方法 ID

它们可以显式地设置为 `"method_id(5)"`，也可以由 func 编译器隐式地设置为 "method_id(5)"。在这种情况下，可以在 .fift 汇编文件的方法声明中找到它们。其中两个是预定义的：一个用于接收区块链内部的信息，通常称为 `recv_internal` ；另一个用于接收外部的信息，称为 `recv_external` 。

### 10. TON Crypto 地址可能没有任何代币或代码

TON 区块链中的智能合约地址是确定的，可以预先计算。与地址相关联的 Ton 账户甚至可能不包含任何代码，这意味着如果发送了带有特殊标志的消息，这些账户将被取消初始化（如果未部署）或冻结，同时不再拥有存储空间或 TON coins。

### 11. TON 地址可以有三种表示形式

TON 地址可以有三种表示法。
完整的表示法可以是 "原始"（`workchain:address`）的，也可以是 "用户友好 "的。最后一种是用户最常遇到的。它包含一个标签字节，表示地址是 "可跳转 "还是 "不可跳转"，以及一个工作链 id 字节。应注意这些信息。

- [原始地址和用户友好地址](/v3/documentation/smart-contracts/addresses#raw-and-user-friendly-addresses)

### 12. 跟踪代码执行中的缺陷

与 Solidity 不同，在 Solidity 中，方法的可见性由用户自行设置，而在 Func 中，可见性则通过显示错误或 `if` 语句以更复杂的方式加以限制。

### 13. 在发送被退回的信息之前，请留意 gas 情况

如果智能合约用用户提供的值发送退回的信息，确保从退回的金额中减去相应的 gas 费用。

### 14. 监控回调及其失败

TON 区块链是异步的。这意味着信息不必先后到达。例如，当某个操作的失败通知到达时，应妥善处理。

### 15. 检查退信标志是否在接收内部邮件时发出

您可能会收到退回的信息（错误通知），应及时处理。

- [标准响应信息的处理](/v3/documentation/smart-contracts/message-management/internal-messages#handling-of-standard-response-messages)

### 16. 为外部信息提供重放保护：

钱包（智能合约，存储用户资金）有两种自定义解决方案：`基于序列号(seqno-based)`（检查计数器，不重复处理消息）和 "高负载"（存储进程标识符及其过期时间）。

- [基于序列号的钱包](/v3/guidelines/apps/asset-processing/payments-processing/#seqno-based-wallets)
- [高负载钱包](/v3/guidelines/apps/asset-processing/payments-processing/#high-load-wallets)

## 参考资料

原文作者：0xguard

- [原文](https://0xguard.com/things_to_focus_on_while_working_with_ton_blockchain)
