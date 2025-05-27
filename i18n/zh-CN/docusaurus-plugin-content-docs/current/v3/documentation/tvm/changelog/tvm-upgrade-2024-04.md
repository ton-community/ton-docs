# 新指令介绍，用于计算廉价手续费

## 新指令介绍，用于计算廉价手续费

:::tip
此更新已在测试网激活，预计将于4月在主网激活。此更新的预览版本可在`@ton-community/sandbox@0.16.0-tvmbeta.3`、`@ton-community/func-js@0.6.3-tvmbeta.3`与`@ton-community/func-js-bin@0.4.5-tvmbeta.3`包中找到。
:::

此更新通过Config8 `version` >= 6进行激活。

## c7

**c7** 元组从 14 个元素扩展到 16 个元素：

- **14**：元组，包含一些作为 cell  slice 的配置参数。如果配置中没有该参数，则其值为空。
  - **0**: 来自 `ConfigParam 18` 的 `StoragePrices` 条目。不是整个 dict，而只是与当前时间相对应的一个 StoragePrices 条目。
  - **1**: `ConfigParam 19` (global id).
  - **2**: `ConfigParam 20` (mc gas prices).
  - **3**: `ConfigParam 21` (gas prices).
  - **4**: `ConfigParam 24` (mc fwd fees).
  - **5**: `ConfigParam 25` (fwd fees).
  - **6**: `ConfigParam 43` (size limits).
- **15**: "[due payment](https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L237)" - 当前存储费债务（ nanotons  ）。Asm 操作码：`DUEPAYMENT`。
- **16**: "precompiled gas usage" - 当前合约的 gas 用量（如果是预编译合约，请参阅 ConfigParam 45），否则为空。Asm 操作码：`GETPRECOMPILEDGAS`。

需要到期支付，以便合约能够正确评估存储费用。

需要进行到期支付，合约才能正确评估存储费用：当信息以默认（可跳转）模式发送到智能合约时，存储费用会被扣除（或添加到包含存储费用相关债务的到期支付字段），之前的信息值会添加到余额中。因此，如果合约在处理完信息后，以 mode=64 发送 gas 超量信息，这就意味着如果合约余额为 0，下一笔交易的存储费就会开始在 due_payment 中累积（而不是从收到的信息中扣除）。这样债务就会无声无息地累积，直到账户冻结。`DUEPAYMENT` 允许开发者明确记账/扣留存储佣金，从而防止出现任何问题。

## 用于处理新c7值的操作码

### 操作码与新的 c7 值配合使用

每个操作码使用26 gas，`SENDMSG`除外（因为涉及cell操作）。

| xxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx <br/>说明                                  |
| :--------------------------------- | :--------------- | :----------------------------------------------------------------------------- |
| `UNPACKEDCONFIGTUPLE`              | *`- c`*          | 从 c7 读取配置 slice 的元组                                                            |
| `DUEPAYMENT`                       | *`- i`*          | 从 c7 中读取应付款项的值                                                                 |
| `GLOBALID`                         | *`- i`*          | 现在从c7检索`ConfigParam 19`，而不是直接从配置字典。                                            |
| `SENDMSG`                          | *`msg mode - i`* | 现在从c7检索`ConfigParam 24/25`（消息价格）和`ConfigParam 43`（`max_msg_cells`），而不是直接从配置字典。 |

### 处理配置参数的操作码

每个操作码使用26 gas。

每个操作码使用26 gas。

| xxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxx<br/>堆栈                     | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>说明                                                                                                                                                                                                                                          |
| :--------------------------------- | :----------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `GETGASFEE`                        | *`gas_used is_mc - price`*           | 为消耗_`gas_used`_ gas 的交易计算计算成本（nanotons）。                                                                                                                                                                                                    |
| `GETSTORAGEFEE`                    | *`cells bits seconds is_mc - price`* | 基于当前存储价格为合约计算存储费用（nanotons）。`cells`与`bits`是 [`AccountState`](https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L247) 的大小（包括去重，包含根cell）。                                                                                      |
| `GETFORWARDFEE`                    | *`cells bits is_mc - price`*         | 计算发出报文的转发费用（以 nanotons  为单位）。如果信息源或目的地都在主链中，*`is_mc`* 为 true；如果都在基链中，则为 false。注意，计算报文中的 cell 和比特时应考虑重复数据删除和_root-is-not-counted_规则。                                                                                                         |
| `GETPRECOMPILEDGAS`                | *`- null`*                           | 保留，目前返回 `null`。如果该合约是 *预编译* ，将以 gas 单位返回合约执行成本。                                                                                                                                                                                                                                       |
| `GETORIGINALFWDFEE`                | *`fwd_fee is_mc - orig_fwd_fee`*     | 计算 `fwd_fee * 2^16 / first_frac`。可用于从输入信息中解析出的 `fwd_fee` 中获取信息的原始 `fwd_fee`（作为 [这个](https://github.com/ton-blockchain/token-contract/blob/21e7844fa6dbed34e0f4c70eb5f0824409640a30/ft/jetton-wallet.fc#L224C17-L224C46) 等硬编码值的替代）。如果信息源或目的地在主链中，*`is_mc`*  为 true；如果两者都在基链中，则为 false。 |
| `GETGASFEESIMPLE`                  | *`gas_used is_mc - price`*           | 计算消耗额外 *`gas_used`* 的交易的额外计算成本（以 nanotons  为单位）。换句话说，与 `GETGASFEE` 相同，但没有统一价格（就是 `(gas_used * price) / 2^16`）。                                                                                                                                                                        |
| `GETFORWARDFEESIMPLE`              | *`cells bits is_mc - price`*         | 计算包含额外的 *`cells`* 和 *`bits`* 的消息的额外转发成本 换言之，与`GETFORWARDFEEE` 相同，但没有总价(只是 `(bits*bit_price + cells*cell_price) / 2^16`)。                                                                                                                                           |

`gas_used`, `cells`, `bits`, `time_delta` 是范围为 `0..2^63-1` 的整数。

### cell 级操作

每个操作码使用26 gas。

| xxxxxxxxxxxxxxxxxxxxxx<br/>Fift语法 | xxxxxxxxx<br/>堆栈      | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 |
| :-------------------------------- | :-------------------- | :------------------------------------------- |
| `CLEVEL`                          | *`cell - level`*      | 返回cell的级别                                    |
| `CLEVELMASK`                      | *`cell - level_mask`* | 返回cell的级别掩码                                  |
| `i CHASHI`                        | *`cell - hash`*       | 返回cell的`i`th哈希                               |
| `i CDEPTHI`                       | *`cell - depth`*      | 返回cell的`i`th深度                               |
| `CHASHIX`                         | *`cell i - depth`*    | 返回cell的`i`th哈希                               |
| `CDEPTHIX`                        | *`cell i - depth`*    | 返回cell的`i`th深度                               |

`i`的范围是`0..3`。
