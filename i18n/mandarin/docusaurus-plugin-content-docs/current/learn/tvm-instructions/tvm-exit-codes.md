# TVM Exit codes (TVM退出代码)

如果 TVM 以任意的 16 位无符号整数 `exit_code` 退出。如果 `exit_code` 大于 1，则被视为一个 _错误码_，因此以这样的代码退出可能导致交易回滚/反弹。

## 标准退出码

:::info
标准退出码列表包含为 TON 区块链定义的所有通用 TVM 退出码。应在相应合约的源代码中寻找替代退出码。
:::

| Exit code   | TVM Phase       | 描述                                                                                                                                                                                                                     |
|-----------|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `0`       | Compute Phase      | 标准成功执行退出码。                                                                                                                                                                                                      |
| `1`       | Compute Phase      | 备选成功执行退出码。                                                                                                                                                                                                     |
| `2`       | Compute Phase      | 栈下溢。最后一个操作码消耗的元素比栈上有的元素还要多。<sup>1</sup>                                                                                                                                                        |
| `3`       | Compute Phase      | 栈上溢。在此版本的 TVM 中存储的值比允许的多。                                                                                                                                                                           |
| `4`       | Compute Phase      | 整数溢出。整数不适应于 −2<sup>256</sup> ≤ x < 2<sup>256</sup> 或发生了除零操作。                                                                                                                                         |
| `5`       | Compute Phase      | 整数超出预期范围。                                                                                                                                                                                                       |
| `6`       | Compute Phase      | 无效的操作码。在当前 TVM 版本中，指令是未知的。                                                                                                                                                                        |
| `7`       | Compute Phase      | 类型检查错误。原语的参数具有不正确的值类型。<sup>1</sup>                                                                                                                                                                |
| `8`       | Compute Phase      | cell溢出。由于操作后将会有超过 1023 位或 4 个引用，因此无法写入构建器。                                                                                                                                                 |
| `9`       | Compute Phase      | cell下溢。从切片原语读取时，尝试读取比存在的位或引用还要多的位。                                                                                                                                                         |
| `10`      | Compute Phase      | 字典错误。在字典（哈希映射）处理过程中发生错误。                                                                                                                                                                       |
| `11`      | Compute Phase      | 最常见的原因是尝试调用在代码中未找到其 ID 的 get 方法（在调用时未找到 `method_id` 修饰符，或者在尝试调用时指定的 get 方法名不正确）。在[TVM文档](https://ton.org/tvm.pdf)中描述为"未知错误，可能由用户程序抛出"。| 
| `12`      | Compute Phase      | 由于被认为是不可能的情况而由 TVM 抛出。                                                                                                                                                                              |
| `13`      | Compute Phase      | gas用尽错误。当剩余gas变为负数时，TVM 会抛出此错误。                                                                                                                                                                  |
| `-14`     | Compute Phase      | 它表示gas用尽错误，与 `13` 相同。为负，因为它[无法伪造](https://github.com/ton-blockchain/ton/blob/20758d6bdd0c1327091287e8a620f660d1a9f4da/crypto/vm/vm.cpp#L492)。                                           |
| `32`      | Action Phase      | 操作列表无效。在 Action Phase，如果执行后的 c5 寄存器包含无法解析的对象，则设置此值。                                                                                                                                         |
| `-32`     | Action Phase      | （与前面的 32 相同）- 未找到方法 ID。在尝试执行不存在的 get 方法时，TonLib 返回此值。                                                                                                                                       |
| `33`      | Action Phase      | 操作列表太长。                                                                                                                                                                                                           |
| `34`      | Action Phase      | 操作无效或不受支持。在 Action Phase，如果无法应用当前操作，则设置此值。                                                                                                                                                        |
| `35`      | Action Phase      | 出站消息中的源地址无效。                                                                                                                                                                                               |
| `36`      | Action Phase      | 出站消息中的目标地址无效。                                                                                                                                                                                             |
| `37`      | Action Phase      | TON 不足。消息发送了过多的 TON（或在扣除费用后 TON 不足）。                                                                                                                                                             |
| `38`      | Action Phase      | 额外代币不足。                                                                                                                                                                                                         |
| `40`      | Action Phase      | 处理消息的资金不足。当只有足够的gas覆盖消息的一部分时，但不完全覆盖时，会抛出此错误。                                                                                                                                  |
| `43`      | Action Phase      | 超出库中的最大cell数或 Merkle 树的最大深度。                                                                                                                                                                          |

<sup>1</sup> 如果在 func 合约中遇到此类异常，这可能意味着汇编声明中存在类型错误。

:::info
通常，您会看到Exit code `0xffff`（十进制形式为 65535）。这通常意味着合约不认识接收到的操作码。在编写合约时，开发人员自己设置的此代码。
:::
