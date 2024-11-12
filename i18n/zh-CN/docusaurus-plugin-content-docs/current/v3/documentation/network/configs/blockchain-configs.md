# 配置参数

:::info
通过 [tonviewer](https://tonviewer.com/config) 读取实时值
:::

## 👋 介绍

在这个页面上，你可以找到在TON区块链中使用的配置参数的描述。TON有一个复杂的配置，包含许多技术参数：一些被区块链本身使用，一些被生态系统使用。然而，只有少数人理解这些参数的含义。这篇文章是为了提供给用户一种简单的方式来理解这些参数及其目的。

## 💡 必要条件

本材料旨在与参数列表一起阅读。你可以在 [当前配置](https://explorer.toncoin.org/config) 中查看参数值，并且它们是如何被写入 [cells](/learn/overviews/cells) 的，在 [TL-B](/develop/data-formats/tl-b-language) 格式的 [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb) 文件中有描述。

:::info
TON区块链参数末尾的二进制编码是其配置的序列化二进制表示，使得配置的存储或传输更为高效。序列化的确切细节取决于TON区块链使用的特定编码方案。
:::

## 🚀 开始吧！

所有参数都有序排列，你不会迷路。为方便起见，请使用右侧边栏进行快速导航。

## 参数 0

此参数是一个特殊智能合约的地址，该合约存储区块链的配置。配置存储在合约中，以简化其在验证者投票期间的加载和修改。

:::info
在配置参数中，只记录了地址的哈希部分，因为合约始终位于 [masterchain](/learn/overviews/ton-blockchain#masterchain-blockchain-of-blockchains)（工作链 -1）。因此，合约的完整地址将被写为 `-1:<配置参数的值>`。
:::

## 参数 1

此参数是 [Elector](/develop/smart-contracts/governance#elector) 智能合约的地址，负责任命验证者、分发奖励和对区块链参数的变更进行投票。

## 参数 2

此参数代表系统的地址，代表系统铸造新的TON并作为奖励发放给验证区块链的验证者。

:::info
如果参数 2 缺失，将使用参数 0 替代（新铸造的TON来自于配置智能合约）。
:::

## 参数 3

此参数是交易费收集者的地址。

:::info
如果参数 3 缺失（截至撰写时的情况），交易费将发送至Elector智能合约（参数 1）。
:::

## 参数 4

此参数是TON网络的根DNS合约地址。

:::info
更多详细信息可以在 [TON DNS & Domains](/participate/web3/dns) 文章中找到，并且在 [这里](https://github.com/ton-blockchain/TEPs/blob/master/text/0081-dns-standard.md) 有更详细的原始描述。该合约不负责销售 .ton 域名。
:::

## 参数 6

此参数负责新代币的铸造费用。

:::info
Currently, minting additional currency is not implemented and does not work. The implementation and launch of the minter are planned.

你可以在 [相关文章](/develop/research-and-development/minter-flow) 中了解更多关于问题和前景。
:::

## 参数 7

此参数存储流通中的每种额外代币的数量。数据以 [字典](/develop/data-formats/tl-b-types#hashmap-parsing-example)（二叉树；可能在TON开发过程中这种结构被错误地命名为哈希映射）`extracurrency_id -> amount` 的形式存储，数量以 `VarUint 32` - 从 `0` 到 `2^248` 的整数表示。

## 参数 8

此参数指示网络版本和验证者支持的额外功能。

:::info
验证者是区块链网络中负责创建新块和验证交易的节点。
:::

- `version`：此字段指定版本。

- `capabilities`：此字段是一组标志，用于指示某些功能或能力的存在或缺失。

因此，在更新网络时，验证者将投票改变参数 8。这样，TON网络可以在不停机的情况下进行更新。

## 参数 9

此参数包含一个强制性参数的列表（二叉树）。它确保某些配置参数始终存在，并且在参数 9 变更之前，不能通过提案被删除。

## 参数 10

此参数代表一份重要TON参数的列表（二叉树），其变更会显著影响网络，因此会举行更多的投票轮次。

## 参数 11

此参数指出更改TON配置的提案在何种条件下被接受。

- `min_tot_rounds` - 提案可应用前的最小轮次数
- `max_tot_rounds` - 达到此轮次数时提案将自动被拒绝
- `min_wins` - 所需的胜利次数（3/4的验证者按质押总和计算必须赞成）
- `max_losses` - 达到此失败次数时提案将自动被拒绝
- `min_store_sec` 和 `max_store_sec` 确定提案被存储的可能的时间间隔
- `bit_price` 和 `cell_price` 指出存储提案的一个位或一个cell的价格

## 参数 12

此参数代表TON区块链中工作链的配置。TON区块链中的工作链被设计为独立的区块链，可以并行运行，使TON能够扩展并处理大量的交易和智能合约。

## 工作链配置参数

- `enabled_since`：启用此工作链的时刻的UNIX时间戳；

- `actual_min_split`：验证者支持的此工作链的最小拆分（分片）深度；

- `min_split`：由配置设置的此工作链的最小拆分深度；

- `max_split`：此工作链的最大拆分深度；

- `basic`：一个布尔标志位（1表示真，0表示假），指示此工作链是否基础（处理TON币，基于TON虚拟机的智能合约）；

- `active`：一个布尔标志位，指示此工作链当前是否活跃；

- `accept_msgs`：一个布尔标志位，指示此工作链目前是否接受消息；

- `flags`：工作链的附加标志位（保留，当前始终为0）；

- `zerostate_root_hash` 和 `zerostate_file_hash`：工作链第一个区块的哈希；

- `version`：工作链的版本；

- `format`：工作链的格式，包括 vm_version 和 vm_mode - 那里使用的虚拟机。

## 参数 13

此参数定义了在 [Elector](/develop/smart-contracts/governance#elector) 合约中对验证者不正确操作提出投诉的成本。

## 参数 14

此参数代表TON区块链中区块创建的奖励。Nanograms是nanoTON，因此，masterchain中的区块创建奖励等于1.7 TON，而基本工作链中的区块创建奖励为1.0 TON（同时，如果工作链发生拆分，区块奖励也会拆分：如果工作链中有两个分片链，那么分片区块的奖励将是0.5 TON）。

## 参数 15

此参数包含TON区块链中不同选举阶段和验证者工作的持续时间。

对于每个验证期，都有一个等于验证开始时UNIX格式时间的 `election_id`。
你可以通过调用Elector合约的相应get方法 `active_election_id` 和 `past_election_ids` 获得当前的 `election_id`（如果选举正在进行中）或过去的一个。

## 工作链配置参数

- `validators_elected_for`：选举出的验证者集合执行其角色的秒数（一轮）。

- `elections_start_before`：当前轮次结束前多少秒将开始下一时期的选举过程。

- `elections_end_before`：当前轮次结束前多少秒将选择下一轮的验证者。

- `stake_held_for`：在轮次过期后，为处理投诉而持有验证者质押的时期。

:::info
参数中的每个值都由 `uint32` 数据类型确定。
:::

### 示例

在TON区块链中，通常将验证周期分为偶数和奇数。这些轮次相互跟随。由于下一轮的投票在前一轮进行，因此验证者需要将资金分为两个池，以有机会参与两轮。

#### 主网

当前值：

```python
constants = {
    'validators_elected_for': 65536,  # 18.2 hours
    'elections_start_before': 32768,  # 9.1 hours
    'elections_end_before': 8192,     # 2.2 hours
    'stake_held_for': 32768           # 9.1 hours
}
```

方案：

![image](/img/docs/blockchain-configs/config15-mainnet.png)

#### 如何计算周期？

假设 `election_id = validation_start = 1600032768`。那么：

```python
election_start = election_id - constants['elections_start_before'] = 1600032768 - 32768 = 1600000000
election_end = delay_start = election_id - constants['elections_end_before'] = 1600032768 - 8192 = 1600024576
hold_start = validation_end = election_id + constants['validators_elected_for'] = 1600032768 + 65536 = 1600098304
hold_end = hold_start + constants['stake_held_for'] = 1600098304 + 32768 = 1600131072
```

因此，目前，一个奇偶性轮次的长度为 `1600131072 - 1600000000 = 131072秒 = 36.40888...小时`

#### 测试网

##### 当前值：

```python
constants = {
    'validators_elected_for': 7200,  # 2 hours
    'elections_start_before': 2400,  # 40 minutes
    'elections_end_before': 180,     # 3 minutes
    'stake_held_for': 900            # 15 minutes
}
```

##### 方案

![image](/img/docs/blockchain-configs/config15-testnet.png)

###### 如何计算周期？

假设 `election_id = validation_start = 160002400`。那么：

```python
election_start = election_id - constants['elections_start_before'] = 160002400 - 2400 = 1600000000
election_end = delay_start = election_id - constants['elections_end_before'] = 160002400 - 180 = 160002220
hold_start = validation_end = election_id + constants['validators_elected_for'] = 160002400 + 7200 = 160009600
hold_end = hold_start + constants['stake_held_for'] = 160009600 + 900 = 160010500
```

因此，目前，一个奇偶性轮次的长度为 `160010500 - 1600000000 = 10500秒 = 175分钟 = 2.91666...小时`

## 参数 16

此参数代表TON区块链中验证者数量的限制。它直接被Elector智能合约使用。

### 选举中验证者数量的配置参数：

- `max_validators`：此参数代表任何给定时间可以参与网络运营的验证者的最大数量。

- `max_main_validators`：此参数代表主链验证者的最大数量。

- `min_validators`：此参数代表必须支持网络运营的最小验证者数量。

1. 验证者的最大数量应大于或等于主链验证者的最大数量。
2. 主链验证者的最大数量必须大于或等于验证者的最小数量。
3. 验证者的最小数量不得少于1。

## 参数 17

此参数代表TON区块链中的质押参数配置。在许多区块链系统中，特别是使用权益证明或委托权益证明共识算法的系统中，网络原生加密货币的所有者可以“质押”他们的代币成为验证者并获得奖励。

## 配置参数：

- `min_stake`：此参数代表有兴趣参与验证过程的一方需要质押的TON的最小金额。

- `max_stake`：此参数代表有兴趣参与验证过程的一方可以质押的TON的最大金额。

- `min_total_stake`：此参数代表被选中的验证者集合必须持有的TON的最小总金额。

- `max_stake_factor`：此参数是一个乘数，指示最大有效质押（抵押）可以超过任何其他验证者发送的最小质押的多少倍。

:::info
参数中的每个值都由 `uint32` 数据类型确定。
:::

## 参数 18

此参数代表确定TON区块链中数据存储价格的配置。这作为一种防止垃圾信息的措施，并鼓励网络维护。

### 存储费用参数的字典：

- `utime_since`：此参数提供指定价格适用的初始Unix时间戳。

- `bit_price_ps` 和 `cell_price_ps`：这些参数代表TON区块链主工作链上存储一个位或一个cell的信息65536秒的存储价格

- `mc_bit_price_ps` 和 `mc_cell_price_ps`：这些参数特别代表在TON主链上计算资源的价格，同样为65536秒

:::info

`utime_since` 接受 `uint32` 数据类型的值。

其余接受 `uint64` 数据类型的值。
:::

## 参数 20 和 21

这些参数定义了TON网络中计算的成本。任何计算的复杂性都以gas单位估计。

- `flat_gas_limit` 和 `flat_gas_price`：提供了一定数量的起始gas，价格为 `flat_gas_price`（用于抵消启动TON虚拟机的成本）。

- `gas_price`：此参数反映了网络中gas的价格，单位是每65536gas单位的nanotons。

- `gas_limit`：此参数代表每笔交易可消耗的最大gas量。

- `special_gas_limit`：此参数代表特殊（系统）合约每笔交易可消耗的gas量限制。

- `gas_credit`：此参数代表提供给交易的gas单位信用额，用于检查外部消息。

- `block_gas_limit`：此参数代表单个区块内可消耗的最大gas量。

- `freeze_due_limit` 和 `delete_due_limit`：合约被冻结和删除的累积存储费用（nanotons）的限制。

:::info
更多关于 `gas_credit` 和外部消息的其他参数的信息在 [这里](/develop/smart-contracts/guidelines/accept#external-messages) 。
:::

## 参数 22 和 23

这些参数设置了区块的限制，达到这些限制时，区块将被完成，剩余消息的回调（如果有的话）将延续到下一个区块。

### 配置参数：

- `bytes`：此部分设置了区块大小的字节限制。

- `underload`：负载不足是指分片意识到没有负载，并倾向于合并（如果相邻的分片愿意的话）。

- `soft_limit`：软限制 - 达到此限制时，内部消息停止处理。

- `hard_limit`：硬限制 - 这是绝对最大大小。

- `gas`：此部分设置了区块可以消耗的gas量限制。在区块链中，gas是计算工作的指标。对于大小（字节），负载不足、软限制和硬限制的限制方式相同。

- `lt_delta`：此部分设置了第一个交易和最后一个交易之间逻辑时间差的限制。逻辑时间是TON区块链用于事件排序的概念。对于大小（字节）和gas，负载不足、软限制和硬限制的限制方式相同。

:::info
在分片上负载不足，相应地，希望与neighbor合并的情况下，`soft_limit` 定义了一种状态，即超过此状态后内部消息停止处理，但外部消息继续处理。外部消息处理直到达到 `(soft_limit + hard_limit)/2` 的限制。
:::

## 参数 24 和 25

参数 24 代表了TON区块链主链中发送消息的成本配置。

参数 25 代表了所有其他情况下发送消息的成本配置。

### 定义转发成本的配置参数：

- `lump_price`：此参数表示转发消息的基础价格，无论其大小或复杂性如何。

- `bit_price`：此参数代表每位消息转发的成本。

- `cell_price`：此参数反映了每个cell消息转发的成本。cell是TON区块链上数据存储的基本单位。

- `ihr_price_factor`：用于计算即时超立方路由（IHR）成本的因子。
  :::info
  IHR是TON区块链网络中的一种消息传递方法，消息直接发送到接收方的分片链。
  :::

- `first_frac`：此参数定义了沿消息路线的第一次转换将使用的剩余的remainder的部分。

- `next_frac`：此参数定义了沿消息路线的后续转换将使用的剩余的remainder的部分。

## 参数 28

此参数提供了TON区块链中Catchain协议的配置。Catchain是TON中用于在验证者之间达成一致的最低层层共识协议。

### 配置参数：

- `flags`：一个通用字段，可用于设置各种二进制参数。在这种情况下，它等于0，这意味着没有设置特定的标志。

- `shuffle_mc_validators`：一个布尔值，指示是否打乱主链验证者。如果此参数设置为1，则验证者将被打乱；否则，他们不会。

- `mc_catchain_lifetime`：主链catchain组的寿命（秒）。

- `shard_catchain_lifetime`：分片链catchain组的寿命（秒）。

- `shard_validators_lifetime`：分片链验证者组的寿命（秒）。

- `shard_validators_num`：每个分片链验证组的验证者数量。

## 参数 29

此参数提供了TON区块链中catchain（[参数 28](#param-28)）上层共识协议的配置。共识协议是区块链网络的关键组成部分，确保所有节点在分布式账本的状态上达成一致。

### 配置参数：

- `flags`：一个通用字段，可用于设置各种二进制参数。在这种情况下，它等于0，这意味着没有设置特定的标志。

- `new_catchain_ids`：一个布尔值，指示是否生成新的Catchain标识符。如果此参数设置为1，则将生成新的标识符。在这种情况下，它被赋值为1，这意味着将生成新的标识符。

- `round_candidates`：共识协议每轮考虑的候选人数量。这里设置为3。

- `next_candidate_delay_ms`：在生成区块候选权转移到下一个验证者之前的延迟（毫秒）。这里设置为2000毫秒（2秒）。

- `consensus_timeout_ms`：区块共识的超时时间（毫秒）。这里设置为16000毫秒（16秒）。

- `fast_attempts`：达成共识的“快速”尝试次数。这里设置为3。

- `attempt_duration`：每次达成一致的尝试持续时间。这里设置为8。

- `catchain_max_deps`：Catchain区块的最大依赖数量。这里设置为4。

- `max_block_bytes`：区块的最大大小（字节）。这里设置为2097152字节（2MB）。

- `max_collated_bytes`：序列化的区块正确性证明的最大大小（字节）。这里设置为2097152字节（2MB）。

- `proto_version`：协议版本。这里设置为2。

- `catchain_max_blocks_coeff`：Catchain中区块生成速率的限制系数，[描述](https://github.com/ton-blockchain/ton/blob/master/doc/catchain-dos.md)。这里设置为10000。

## 参数 31

此参数代表来自以下智能合约地址的配置，这些地址不收取gas或存储费用，可以创建tick-tok交易。这个列表通常包括治理合约。该参数以二叉树结构呈现——一个树（HashMap 256），其中键是地址的256位表示。此列表中只能出现主链中的地址。

## 参数 32、34 和 36

来自上一轮（32）、当前轮（34）和下一轮（36）的验证者列表。参数 36 负责从选举结束到轮次开始时设置。

### 配置参数：

- `cur_validators`：这是当前的验证者列表。验证者通常负责在区块链网络中验证交易。

- `utime_since` 和 `utime_until`：这些参数提供了这些验证者活跃的时间段。

- `total` 和 `main`：这些参数提供了网络中验证者的总数和验证主链的验证者数量。

- `total_weight`：这将验证者的权重加起来。

- `list`：一个验证者的树状列表 `id->validator-data`：`validator_addr`、`public_key`、`weight`、`adnl_addr`：这些参数提供了每个验证者的详细信息 - 他们在主链中的256地址、公钥、权重、ADNL地址（TON网络层使用的地址）。

## 参数 40

此参数定义了对不当行为（非验证）的惩罚结构的配置。在没有此参数的情况下，默认罚款大小为101 TON。

## 配置参数：

**`MisbehaviourPunishmentConfig`**：此数据结构定义了如何惩罚系统中的不当行为。

它包含几个字段：

- `default_flat_fine`：这部分罚款与质押大小无关。

- `default_proportional_fine`：这部分罚款与验证者的质押大小成比例。

- `severity_flat_mult`：这是应用于验证者重大违规行为的 `default_flat_fine` 值的乘数。

- `severity_proportional_mult`：这是应用于验证者重大违规行为的 `default_proportional_fine` 值的乘数。

- `unpunishable_interval`：此参数代表违规者不受惩罚的期间，以消除临时网络问题或其他异常。

- `long_interval`、`long_flat_mult`、`long_proportional_mult`：这些参数定义了一个“长”时间段及其对不当行为的持平和比例罚款的乘数。

- `medium_interval`、`medium_flat_mult`、`medium_proportional_mult`：同样，它们定义了一个“中等”时间段及其对不当行为的持平和比例罚款的乘数。

## 参数 43

此参数涉及帐户和消息的各种大小限制和其他特性。

### 配置参数：

- `max_msg_bits`：消息的最大大小（位）。

- `max_msg_cells`：消息可以占用的最大cell数（存储单位的一种形式）。

- `max_library_cells`：用于库cell的最大cell数。

- `max_vm_data_depth`：消息和账户状态中的最大cell深度。

- `max_ext_msg_size`：外部消息的最大大小（位）。

- `max_ext_msg_depth`：外部消息的最大深度。这可能是指消息内部数据结构的深度。

- `max_acc_state_cells`：帐户状态可以占用的最大cell数。

- `max_acc_state_bits`：帐户状态的最大大小（位）。

如果缺失，默认参数为：

- `max_size` = 65535
- `max_depth` = 512
- `max_msg_bits` = 1 \<\< 21
- `max_msg_cells` = 1 \<\< 13
- `max_library_cells` = 1000
- `max_vm_data_depth` = 512
- `max_acc_state_cells` = 1 \<\< 16
- `max_acc_state_bits` = (1 \<\< 16) \* 1023

:::info
您可以在源代码[这里](https://github.com/ton-blockchain/ton/blob/fc9542f5e223140fcca833c189f77b1a5ae2e184/crypto/block/mc-config.h#L379)查看有关标准参数的更多详情。
:::

## 参数 44

此参数定义了被暂停的地址列表，这些地址在`suspended_until`之前不能被初始化。它仅适用于尚未启动的账户。这是稳定代币经济学的一种措施（限制早期矿工）。如果未设置 - 则没有限制。每个地址都表示为此树的一个终端节点，树状结构允许有效地检查地址在列表中的存在与否。

:::info
代币经济学的稳定进一步在“The Open Network” Telegram 频道的[官方报告](https://t.me/tonblockchain/178)中描述。
:::

## 参数 71 - 73

此参数涉及在其他网络中包装TON的桥：

```
precompiled_smc#b0 gas_usage:uint64 = PrecompiledSmc;
precompiled_contracts_config#c0 list:(HashmapE 256 PrecompiledSmc) = PrecompiledContractsConfig;
_ PrecompiledContractsConfig = ConfigParam 45;
```

预编译合约的更多详情请查看[本页面](/develop/smart-contracts/core-contracts/precompil)。

## 参数 71 - 73

此参数涉及在其他网络中封装TON的桥：

- ETH-TON \*\* (71)\*\*
- BSC-TON \*\* (72) \*\*
- Polygon-TON \*\* (73) \*\*

### 配置参数:

- `bridge_address`：这是接受TON以在其他网络中发行包装的TON的桥合约地址。

- `oracle_multisig_address`: 这是 bridge 管理钱包地址。 多重钱包是一种数字钱包类型，需要多方签名授权交易。 它常常被用来加强安全，Oracle充当这些方面的角色。

- `oracles`：以树形结构 `id->address` 的形式列出的预言机

- `external_chain_address`：对应外部区块链中的桥合约地址。

## 参数 79, 81 和 82

此参数涉及从其他网络中包装代币到TON网络上的代币的桥：

- ETH-TON \*\* (79) \*\*
- BSC-TON \*\* (81) \*\*
- Polygon-TON \*\* (82) \*\*

### 配置参数:

- `bridge_address` 和 `oracles_address`：这些是桥和桥管理合约（预言机多签）的区块链地址。

- `oracles`：以树形结构 `id->address` 的形式列出的预言机

- `state_flags`：状态标志。该参数负责启用/禁用不同的 bridge 功能。

- `prices`：此参数包含用于桥的不同操作或费用的价格列表或字典，例如 `bridge_burn_fee`、`bridge_mint_fee`、`wallet_min_tons_for_storage`、`wallet_gas_consumption`、`minter_min_tons_for_storage`、`discover_gas_consumption`。

- `external_chain_address`：另一区块链中的桥合约地址。

## 负参数

:::info
负参数与正参数的区别在于需要验证者的验证；它们通常没有特定分配的角色。
:::

## 下一步

在深入研究本文后，强烈建议您花时间详细研究以下文档：

- [whitepaper.pdf](https://ton.org/whitepaper.pdf) 和 [tblkch.pdf](/tblkch.pdf) 中的原始但有限的描述。

- [mc-config.h](https://github.com/ton-blockchain/ton/blob/fc9542f5e223140fcca833c189f77b1a5ae2e184/crypto/block/mc-config.h)，[block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb) 和 [BlockMasterConfig 类型](https://docs.evercloud.dev/reference/graphql-api/field_descriptions#blockmasterconfig-type)。

## 📖 参阅

在此页面上，您可以找到TON区块链的活动网络配置：

- 主网：https://ton.org/global-config.json
- 测试网：https://ton.org/testnet-global.config.json
- [俄语版本](https://github.com/delovoyhomie/description-config-for-TON-Blockchain/blob/main/Russian-version.md)。
