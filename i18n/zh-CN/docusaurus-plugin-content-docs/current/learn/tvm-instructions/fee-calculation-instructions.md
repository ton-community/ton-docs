# 新指令介绍，用于计算廉价手续费

:::tip
此更新已在测试网激活，预计将于4月在主网激活。此更新的预览版本可在`@ton-community/sandbox@0.16.0-tvmbeta.3`、`@ton-community/func-js@0.6.3-tvmbeta.3`与`@ton-community/func-js-bin@0.4.5-tvmbeta.3`包中找到。
:::

此更新通过Config8 `version` >= 6进行激活。

# c7

**c7** 元组从14扩展到16个元素：
* **14**：包含一些配置参数（作为cell切片）的元组。如果配置中缺少参数，则该值为null。
  * **0**：`ConfigParam 18`中的`StoragePrices`。不是整个字典，而只是与当前时间对应的一个StoragePrices条目。
  * **1**：`ConfigParam 19`（全局id）。
  * **2**：`ConfigParam 20`（mc gas价格）。
  * **3**：`ConfigParam 21`（gas价格）。
  * **4**：`ConfigParam 24`（mc 转发费用）。
  * **5**：`ConfigParam 25`（转发费用）。
  * **6**：`ConfigParam 43`（大小限制）。
* **15**："[到期支付](https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L237)" - 当前储存费用的债务（nanotons）。汇编操作码：`DUEPAYMENT`。

扩展c7以包含未打包配置参数的背后思想如下：这些数据将由交易执行器从全局配置中检索，因此它已经呈现在执行器的内存中。然而（扩展之前）智能合约需要一个接一个地从配置字典中获取所有这些参数，这既昂贵且可能因 gas（由于成本取决于参数数量）而不可预测。

需要到期支付，以便合约能够正确评估存储费用。


# 新操作码

## 用于处理新c7值的操作码
每个操作码使用26 gas，`SENDMSG`除外（因为涉及cell操作）。

| xxxxxxxxxxxxxxxxxxxxxx<br/>Fift语法 | xxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述                                                                            |
|:-|:--------------------|:-------------------------------------------------------------------------------------------------------------------------|
| `UNPACKEDCONFIGTUPLE` | _`- c`_             | 从c7检索配置切片的元组                                                                                           |
| `DUEPAYMENT` | _`- i`_             | 从c7检索到期支付的值                                                                                              |
| `GLOBALID` | _`- i`_             | 现在从c7检索`ConfigParam 19`，而不是直接从配置字典。                                                 |
| `SENDMSG` | _`msg mode - i`_    | 现在从c7检索`ConfigParam 24/25`（消息价格）和`ConfigParam 43`（`max_msg_cells`），而不是直接从配置字典。 |

## 处理配置参数的操作码

在TON交易执行器中引入配置参数切片元组，使解析费用参数更加经济高效。然而，由于未来可能会引入新的配置参数构造器，智能合约可能需要更新以解释这些新参数。为解决此问题，引入了专门的操作码来进行费用计算。这些操作码从c7读取参数，并以与执行器相同的方式计算费用。随着新参数构造器的引入，这些操作码将更新以适应变化。这允许智能合约依靠这些指令进行费用计算，而无需解释所有类型的构造器。

每个操作码使用26 gas。

| xxxxxxxxxxxxxxxxxxxxxx<br/>Fift语法 | xxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述                                                                                                                                                                                                                                                               |
|:-|:-|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GETGASFEE` | _`gas_used is_mc - price`_ | 为消耗_`gas_used`_ gas 的交易计算计算成本（nanotons）。                                                                                                                                                                                                                                       |
| `GETSTORAGEFEE` | _`cells bits seconds is_mc - price`_ | 基于当前存储价格为合约计算存储费用（nanotons）。`cells`与`bits`是[`AccountState`](https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L247)的大小（包括去重，包含根cell）。 |
| `GETFORWARDFEE` | _`cells bits is_mc - price`_ | 为出站消息计算转发费用（nanotons）。_`is_mc`_如果源或目的地在主链上则为true，如果两者都在基本链上则为false。注意，应该按照去重和_root-is-not-counted_规则计算消息中的cell和位。                                                                       |
| `GETPRECOMPILEDGAS` | _`- null`_ | 保留，当前返回`null`。如果此合约是_预编译_的，则将返回合约执行的成本（以 gas cell计）。                                                                                                                                                                            |
| `GETORIGINALFWDFEE` | _`fwd_fee is_mc - orig_fwd_fee`_ | 计算`fwd_fee * 2^16 / first_frac`。可用于获取消息的原始`fwd_fee`。_`is_mc`_如果源或目的地在主链上则为true，如果两者都在基本链上则为false。 |
| `GETGASFEESIMPLE` | _`gas_used is_mc - price`_ | 为消耗额外_`gas_used`_的交易计算额外计算成本（nanotons）。换句话说，与`GETGASFEE`相同，但没有固定价格（仅`（gas_used * price）/ 2^16`）。                                                                                                |
| `GETFORWARDFEESIMPLE` | _`cells bits is_mc - price`_ | 为包含额外_`cells`_和_`bits`_的消息计算额外转发成本（nanotons）。换句话说，与`GETFORWARDFEE`相同，但没有固定价格（仅`（bits*bit_price + cells*cell_price）/ 2^16`）。                                                                         |

`gas_used`、`cells`、`bits`、`time_delta`是范围`0..2^63-1`内的整数。

## cell层级操作
用于处理Merkle证明的操作，其中cell可以具有非零层级和多个哈希。

每个操作码使用26 gas。

| xxxxxxxxxxxxxxxxxxxxxx<br/>Fift语法 | xxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述                      |
|:-|:-|:----------------------------------------------------------------------------|
| `CLEVEL` | _`cell - level`_ | 返回cell的级别 |
| `CLEVELMASK` | _`cell - level_mask`_ | 返回cell的级别掩码 |
| `i CHASHI` | _`cell - hash`_ | 返回cell的`i`th哈希|
| `i CDEPTHI` | _`cell - depth`_ | 返回cell的`i`th深度|
| `CHASHIX` | _`cell i - depth`_ | 返回cell的`i`th哈希|
| `CDEPTHIX` | _`cell i - depth`_ | 返回cell的`i`th深度|

`i`的范围是`0..3`。