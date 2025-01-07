# TVM Exit codes (TVM退出代码)

If TVM exits with an arbitrary 16-bit unsigned integer `exit_code`. `exit_code` higher than 1, it is considered to be an *error code*, therefore an exit with such a code may cause the transaction to revert/bounce.

## 标准退出码

:::info
The list of standard exit codes contains all universal TVM exit codes defined for TON Blockchain. Alternative exit codes should be sought in the source code of corresponded contract.
:::

| Exit code | TVM Phase     | 描述                                                                                                                                                                                                         |
| --------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `0`       | Compute Phase | 标准成功执行退出码。                                                                                                                                                                                                 |
| `1`       | Compute Phase | 备选成功执行退出码。                                                                                                                                                                                                 |
| `2`       | Compute Phase | Stack underflow. Last op-code consumed more elements than there are on the stacks. <sup>1</sup>                                                                            |
| `3`       | Compute Phase | Stack overflow. More values have been stored on a stack than allowed by this version of TVM.                                                                               |
| `4`       | Compute Phase | 整数溢出。整数不适应于 −2<sup>256</sup> ≤ x < 2<sup>256</sup> 或发生了除零操作。                                                                                                                      |
| `5`       | Compute Phase | Integer out of expected range.                                                                                                                                                             |
| `6`       | Compute Phase | Invalid opcode. Instruction is unknown in the current TVM version.                                                                                                         |
| `7`       | Compute Phase | Type check error. An argument to a primitive is of an incorrect value type. <sup>1</sup>                                                                                   |
| `8`       | Compute Phase | Cell overflow. Writing to builder is not possible since after operation there would be more than 1023 bits or 4 references.                                                |
| `9`       | Compute Phase | Cell underflow. Read from slice primitive tried to read more bits or references than there are.                                                                            |
| `10`      | Compute Phase | Dictionary error. Error during manipulation with dictionary (hashmaps).                                                                                 |
| `11`      | Compute Phase | 最常见的原因是尝试调用在代码中未找到其 ID 的 get 方法（在调用时未找到 `method_id` 修饰符，或者在尝试调用时指定的 get 方法名不正确）。在[TVM文档](https://ton.org/tvm.pdf)中描述为"未知错误，可能由用户程序抛出"。                                                                     |
| `12`      | Compute Phase | Thrown by TVM in situations deemed impossible.                                                                                                                                             |
| `13`      | Compute Phase | Out of gas error. Thrown by TVM when the remaining gas becomes negative.                                                                                                   |
| `-14`     | Compute Phase | It means out of gas error, same as `13`. Negative, because it [cannot be faked](https://github.com/ton-blockchain/ton/blob/20758d6bdd0c1327091287e8a620f660d1a9f4da/crypto/vm/vm.cpp#L492) |
| `32`      | Action Phase  | Action list is invalid. Set during action phase if c5 register after execution contains unparsable object.                                                                 |
| `-32`     | Action Phase  | （与前面的 32 相同）- 未找到方法 ID。在尝试执行不存在的 get 方法时，TonLib 返回此值。                                                                                                                                                      |
| `33`      | Action Phase  | Action list is too long.                                                                                                                                                                   |
| `34`      | Action Phase  | Action is invalid or not supported. Set during action phase if current action cannot be applied.                                                                           |
| `35`      | Action Phase  | Invalid Source address in outbound message.                                                                                                                                                |
| `36`      | Action Phase  | Invalid Destination address in outbound message.                                                                                                                                           |
| `37`      | Action Phase  | Not enough TON. Message sends too much TON (or there is not enough TON after deducting fees).                                                           |
| `38`      | Action Phase  | 额外代币不足。                                                                                                                                                                                                    |
| `40`      | Action Phase  | Not enough funds to process a message. This error is thrown when there is only enough gas to cover part of the message, but does not cover it completely.                  |
| `43`      | Action Phase  | The maximum number of cells in the library is exceeded or the maximum depth of the Merkle tree is exceeded.                                                                                |

<sup>1</sup> 如果在 func 合约中遇到此类异常，这可能意味着汇编声明中存在类型错误。

:::info
通常，您会看到Exit code `0xffff`（十进制形式为 65535）。这通常意味着合约不认识接收到的操作码。在编写合约时，开发人员自己设置的此代码。
:::
