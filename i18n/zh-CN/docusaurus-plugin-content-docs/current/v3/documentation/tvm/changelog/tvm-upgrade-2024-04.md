import Feedback from '@site/src/components/Feedback';

# TVM upgrade Apr 2024

## 新指令介绍，用于计算廉价手续费

:::tip
This upgrade is active on the Mainnet since Mar 16, 2024. See the details [here](https://t.me/tonstatus/101). 此更新已在测试网激活，预计将于4月在主网激活。此更新的预览版本可在`@ton-community/sandbox@0.16.0-tvmbeta.3`、`@ton-community/func-js@0.6.3-tvmbeta.3`与`@ton-community/func-js-bin@0.4.5-tvmbeta.3`包中找到。
:::

此更新通过Config8 `version` >= 6进行激活。

## c7

**c7** 元组从 14 个元素扩展到 16 个元素：

- **14**：元组，包含一些作为 cell  slice 的配置参数。如果配置中没有该参数，则其值为空。 If a parameter is absent from the config, its value is null.
  - **0**: `StoragePrices` from `ConfigParam 18`. **0**: 来自 `ConfigParam 18` 的 `StoragePrices` 条目。不是整个 dict，而只是与当前时间相对应的一个 StoragePrices 条目。
  - **1**: `ConfigParam 19` (global id).
  - **2**: `ConfigParam 20` (mc gas prices).
  - **3**: `ConfigParam 21` (gas prices).
  - **4**: `ConfigParam 24` (mc fwd fees).
  - **5**: `ConfigParam 25` (fwd fees).
  - **6**: `ConfigParam 43` (size limits).
- **15**: "[due payment](https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L237)" - 当前存储费债务（ nanotons  ）。Asm 操作码：`DUEPAYMENT`。 `asm` opcode: `DUEPAYMENT`.
- **16**: "precompiled gas usage" - 当前合约的 gas 用量（如果是预编译合约，请参阅 ConfigParam 45），否则为空。Asm 操作码：`GETPRECOMPILEDGAS`。
  `asm` opcode: `GETPRECOMPILEDGAS`.

The extension of `c7` with unpacked config parameters aims to improve efficiency. Now, this data is retrieved from the global configuration by the transaction executor, making it readily available in the executor's memory. Previously, the smart contract had to fetch each parameter one by one from the configuration dictionary. This method was costly and gas-inefficient, as the cost depended on the number of parameters.

**Due payment field**

The due payment field is crucial for accurately managing storage fees. Here's how it works:

- When a message is sent in the default (bounceable) mode to a smart contract, storage fees are either:
  - **Deducted**, or
  - **Added** to the `due_payment` field, which stores the storage fee-related debt.
- These adjustments happen **before** the message value is added to the contract's balance.
- If the contract processes the message and sends back excess gas with `mode=64`, the following occurs:
  - If the contract's balance reaches 0, storage fees will accumulate in the `due_payment` field on subsequent transactions instead of being deducted from incoming messages.
  - This results in the debt silently accumulating until the account is frozen.

The `DUEPAYMENT` opcode allows developers to explicitly account for or withhold storage fees, preventing potential issues.

## New opcodes

### 用于处理新c7值的操作码

每个操作码使用26 gas。

| Fift syntax           | Stack            | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>说明                                   |
| :-------------------- | :--------------- | :----------------------------------------------------------------------------- |
| `UNPACKEDCONFIGTUPLE` | _`- c`_          | 从 c7 读取配置 slice 的元组                                                            |
| `DUEPAYMENT`          | _`- i`_          | 从 c7 中读取应付款项的值                                                                 |
| `GLOBALID`            | _`- i`_          | 现在从c7检索`ConfigParam 19`，而不是直接从配置字典。                                            |
| `SENDMSG`             | _`msg mode - i`_ | 现在从c7检索`ConfigParam 24/25`（消息价格）和`ConfigParam 43`（`max_msg_cells`），而不是直接从配置字典。 |

### 处理配置参数的操作码

Introducing the configuration tuple in the TON transaction executor makes parsing fee parameters more cost-effective. However, smart contracts may require updates to interpret new configuration parameter constructors as they are introduced.

To address this, special opcodes for fee calculation are introduced. These opcodes:

- Retrieve parameters from `c7`.
- Calculate fees in the same way as the executor.

As new parameter constructors are introduced, these opcodes are updated accordingly. This ensures that smart contracts can rely on these instructions for fee calculation without needing to interpret each new constructor.

每个操作码使用26 gas。

| Fift syntax           | Stack                                | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx <br/>说明                                                                                                                                                                                                                                                                                                                                                                                                                              |
| :-------------------- | :----------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GETGASFEE`           | _`gas_used is_mc - price`_           | 为消耗_`gas_used`_ gas 的交易计算计算成本（nanotons）。                                                                                                                                                                                                                                                                                                                                                                                         |
| `GETSTORAGEFEE`       | _`cells bits seconds is_mc - price`_ | 基于当前存储价格为合约计算存储费用（nanotons）。`cells`与`bits`是 [`AccountState`](https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L247) 的大小（包括去重，包含根cell）。                                                                                                                                                                                                                                                                           |
| `GETFORWARDFEE`       | _`cells bits is_mc - price`_         | Calculates forward fees in nanotons for an outgoing message.`is_mc` is true if the source or the destination is in the MasterChain and false if both are in the basechain. **Note:** `cells` and `bits` in the message should be counted with deduplication and the _root-not-counted_ rules.                                                                                                              |
| `GETPRECOMPILEDGAS`   | _`- null`_                           | Reserved; currently returns null. 保留，目前返回 `null`。如果该合约是 _预编译_ ，将以 gas 单位返回合约执行成本。                                                                                                                                                                                                                                                                                                                                                                          |
| `GETORIGINALFWDFEE`   | _`fwd_fee is_mc - orig_fwd_fee`_     | Calculates `fwd_fee * 2^16 / first_frac`. 计算 `fwd_fee * 2^16 / first_frac`。可用于从输入信息中解析出的 `fwd_fee` 中获取信息的原始 `fwd_fee`（作为 [这个](https://github.com/ton-blockchain/token-contract/blob/21e7844fa6dbed34e0f4c70eb5f0824409640a30/ft/jetton-wallet.fc#L224C17-L224C46) 等硬编码值的替代）。如果信息源或目的地在主链中，_`is_mc`_  为 true；如果两者都在基链中，则为 false。 `is_mc` is true if the source or destination is in the MasterChain and false if both are in the basechain. |
| `GETGASFEESIMPLE`     | _`gas_used is_mc - price`_           | 计算消耗额外 _`gas_used`_ 的交易的额外计算成本（以 nanotons  为单位）。换句话说，与 `GETGASFEE` 相同，但没有统一价格（就是 `(gas_used * price) / 2^16`）。 This is the same as `GETGASFEE`, but without the flat price calculated as `(gas_used * price) / 2^16.`                                                                                                                                                                                                                                                      |
| `GETFORWARDFEESIMPLE` | _`cells bits is_mc - price`_         | Calculates the additional forward cost in nanotons for a message containing additional `cells` and `bits`. 计算包含额外的 _`cells`_ 和 _`bits`_ 的消息的额外转发成本 换言之，与`GETFORWARDFEEE` 相同，但没有总价(只是 `(bits*bit_price + cells*cell_price) / 2^16`)。                                                                                                                                                                                                     |

`gas_used`, `cells`, `bits`, `time_delta` 是范围为 `0..2^63-1` 的整数。

### cell 级操作

These operations work with Merkle proofs, where cells can have a non-zero level and multiple hashes. 每个操作码使用26 gas。

| Fift syntax  | Stack                 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 |
| :----------- | :-------------------- | :------------------------------------------- |
| `CLEVEL`     | _`cell - level`_      | 返回cell的级别                                    |
| `CLEVELMASK` | _`cell - level_mask`_ | 返回cell的级别掩码                                  |
| `i CHASHI`   | _`cell - hash`_       | 返回cell的`i`th哈希                               |
| `i CDEPTHI`  | _`cell - depth`_      | 返回cell的`i`th深度                               |
| `CHASHIX`    | _`cell i - depth`_    | 返回cell的`i`th哈希                               |
| `CDEPTHIX`   | _`cell i - depth`_    | 返回cell的`i`th深度                               |

`i`的范围是`0..3`。

<Feedback />

