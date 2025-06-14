import Feedback from '@site/src/components/Feedback';

# Things to focus on while working with TON Blockchain

在本文中，我们将回顾和讨论希望开发 TON 应用程序的人员需要考虑的要素。

## 检查清单

### 2. 检查抛出值

Func variables and functions may contain almost any legit character. I.e. Func 变量和函数几乎可以包含任何合法字符。例如，`var++`、`~bits`、`foo-bar+baz`（包括逗号）都是有效的变量和函数名。

在编写和检查 Func 代码时，应使用 Linter。

- [集成开发环境插件](/v3/documentation/smart-contracts/getting-started/ide-plugins/)

### 2. Check the throw values

Each time the TVM execution stops normally, it stops with exit codes `0` or `1`. TVM 的执行每次正常停止时，都会以退出代码 `0` 或 `1` 停止。虽然 TVM 是自动执行的，但如果通过 `throw(0)` 或 `throw(1)` 命令直接抛出退出代码 `0` 和 `1`，TVM 的执行可能会被意外直接中断。

- [如何处理错误](/v3/documentation/smart-contracts/func/docs/builtins#throwing-exceptions)
- [TVM 退出代码](/v3/documentation/tvm/tvm-exit-codes)

### 3. Func 是一种严格类型化的语言，其数据结构存储的正是它们应该存储的内容

It is crucial to keep track of what the code does and what it may return. Keep in mind that the compiler cares only about the code and only in its initial state. After certain operations stored values of some variables can change.

读取意外变量值和调用不应该有此类方法的数据类型的方法（或其返回值未正确存储）都是错误，不会作为 "警告 "或 "通知 "跳过，而是会导致代码无法运行。请记住，存储意外值可能没有问题，但读取意外值可能会导致问题，例如，对于整数变量，可能会抛出错误代码 5（整数超出预期范围）。 Keep in mind that storing an unexpected value may be okay, however, reading it may cause problems e.g. error code 5 (integer out of expected range) may be thrown for an integer variable.

### 4. Messages have modes

It is essential to check the message mode, in particular its interaction with previous messages sent and fees. A possible failure is not accounting for storage fees, in which case contract may run out of TON leading to unexpected failures when sending outgoing messages. You can view the message modes [here](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes).

### 5. Replay protection {#replay-protection}

There are two custom solutions for wallets (smart contracts that store user funds): `seqno-based` (using a counter to prevent processing the same message twice) and `high-load` (storing processed identifiers and their expiration times).

- [基于序列号的钱包](/v3/guidelines/apps/asset-processing/payments-processing/#seqno-based-wallets)
- [高负载钱包](/v3/guidelines/apps/asset-processing/payments-processing/#high-load-wallets)

For `seqno`, refer to [this section](/v3/documentation/smart-contracts/message-management/sending-messages#mode3) for details on possible replay scenarios.

### 6. TON fully implements the actor model

It means the code of the contract can be changed. 这意味着合约的代码可以更改。既可以使用 [`SETCODE`](/v3/documentation/smart-contracts/func/docs/stdlib#set_code)TVM 指令永久更改代码，也可以在运行时将 TVM 代码注册表设置为新的 cell 值，直到执行结束。

### 7. TON Blockchain has several transaction phases: computational phase, actions phase, and a bounce phase among them

The computational phase executes the code of smart contracts and only then the actions are performed (sending messages, code modification, changing libraries, and others). 计算阶段会执行智能合约的代码，然后才会执行操作（发送消息、修改代码、更改库等）。因此，与基于以太坊的区块链不同的是，如果你预计发送的消息会失败，就不会看到计算阶段的退出代码，因为它不是在计算阶段执行的，而是在之后的操作阶段执行的。

- [事务和阶段](/v3/documentation/tvm/tvm-overview#transactions-and-phases)

### 8. TON contracts are autonomous

区块链中的合约可以驻留在不同的分片中，由其他验证器处理，这意味着开发者无法按需从其他合约中获取数据。因此，任何通信都是异步的，通过发送消息来完成。 Thus, any communication is asynchronous and done by sending messages.

- [从智能合约发送信息](/v3/documentation/smart-contracts/message-management/sending-messages)
- [从 DApp 发送信息](/v3/guidelines/ton-connect/guidelines/sending-messages)

### 9. Unlike other blockchains, TON does not contain revert messages, only exit codes

在开始编写 TON 智能合约之前，考虑清楚代码流的退出代码路线图（并将其记录在案）是很有帮助的。

### 10. Func functions that have method_id identifiers have method IDs

它们可以显式地设置为 `"method_id(5)"`，也可以由 func 编译器隐式地设置为 "method_id(5)"。在这种情况下，可以在 .fift 汇编文件的方法声明中找到它们。其中两个是预定义的：一个用于接收区块链内部的信息，通常称为 `recv_internal` ；另一个用于接收外部的信息，称为 `recv_external` 。 In this case, they can be found among methods declarations in the .fift assembly file. Two of them are predefined: one for receiving messages inside of blockchain `(0)`, commonly named `recv_internal`, and one for receiving messages from outside `(-1)`, `recv_external`.

### 11. TON crypto address may not have any coins or code

Smart contracts addresses in TON blockchain are deterministic and can be precomputed. TON 区块链中的智能合约地址是确定的，可以预先计算。与地址相关联的 Ton 账户甚至可能不包含任何代码，这意味着如果发送了带有特殊标志的消息，这些账户将被取消初始化（如果未部署）或冻结，同时不再拥有存储空间或 TON coins。

### 12. TON addresses may have three representations

TON addresses may have three representations.
A full representation can either be "raw" (`workchain:address`) or "user-friendly". The last one is the one users encounter most often. It contains a tag byte, indicating whether the address is `bounceable` or `not bounceable`, and a workchain id byte. This information should be noted.

- [Raw and user-friendly addresses](/v3/documentation/smart-contracts/addresses#raw-and-user-friendly-addresses)

### 13. Keep track of the flaws in code execution

与 Solidity 不同，在 Solidity 中，方法的可见性由用户自行设置，而在 Func 中，可见性则通过显示错误或 `if` 语句以更复杂的方式加以限制。

### 14. Keep an eye on gas before sending bounced messages

如果智能合约用用户提供的值发送退回的信息，确保从退回的金额中减去相应的 gas 费用。

### 15. Monitor the callbacks and their failures

TON blockchain is asynchronous. That means the messages do not have to arrive successively. e.g. when a fail notification of an action arrives, it should be handled properly.

### 16. Check if the bounced flag was sent receiving internal messages

您可能会收到退回的信息（错误通知），应及时处理。

- [Handling of standard response messages](/v3/documentation/smart-contracts/message-management/internal-messages#handling-of-standard-response-messages)

## 参考资料

- [Original article](https://0xguard.com/things_to_focus_on_while_working_with_ton_blockchain) - _0xguard_

<Feedback />

