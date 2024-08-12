# TVM 初始化

:::info
为了更好理解这一页的内容，强烈建议熟悉 [TL-B 语言](/develop/data-formats/cell-boc)。
:::

TVM 在普通和/或其他交易的 Compute Phase 调用。

## 初始状态

在执行智能合约之前，初始化 TVM 的新实例如下：

- 使用从智能合约的 `code` 部分创建的cell切片初始化原始 **cc**（当前continuation）。如果账户处于冻结或未初始化状态，必须在传入消息的 `init` 字段中提供代码。

- **cp**（当前 TVM codepage）设置为默认值，即 0。如果智能合约想使用另一个 TVM codepage *x*，则必须在其代码的第一条指令中使用 `SETCODEPAGE` *x* 切换到该codepage。

- 按照 Credit Phase 的结果初始化 **gas** 值（_ gas 限制_）。

- 计算 **libraries**（*库 context*）。[下文描述](#library-context)。

- **stack** 初始化过程取决于引发交易的事件，其内容在[下文描述](#stack)。

- 控制寄存器 **c0**（返回 continuation ）由带有参数 0 的特殊 continuation  `ec_quit` 初始化。执行此 continuation 将导致 TVM 以 exit code  0 终止。

- 控制寄存器 **c1**（备用返回 continuation ）由带有参数 1 的特殊 continuation  `ec_quit` 初始化。当调用时，它导致 TVM 以 exit code  1 终止。请注意， exit code  0 和 1 都被视为 TVM 的成功终止。

- 控制寄存器 **c2**（异常处理程序）由特殊 continuation  `ec_quit_exc` 初始化。调用时，它从栈顶获取整数（等于异常编号）并以等于该整数的 exit code 终止 TVM。这样， 默认情况下，所有异常都以等于异常编号的 exit code 终止智能合约执行。

- 控制寄存器 **c3**（代码字典）由类似于上述 **cc**（当前 continuation ）的智能合约代码的cell初始化。

- 控制寄存器 **c4**（持久数据的根）由智能合约的持久数据初始化，存储在其 `data` 部分中。如果账户处于冻结或未初始化状态，必须在传入消息的 `init` 字段中提供数据。请注意，智能合约的持久数据不需要在其全部加载，而是加载根，当引用从根仅在访问时加载时，TVM 可能加载其他cell，从而提供一种虚拟内存形式。

- 控制寄存器 **c5**（动作的根）由空cell初始化。TVM 的“输出动作”原语，如 `SENDMSG`，在此寄存器中累积 *输出动作*（例如，出站消息），以在智能合约成功终止后执行。其序列化的 TL-B 方案如下[下文描述](#control-register-c5)。

- 控制寄存器 **c7**（临时数据的根）初始化为元组，其结构如下[下文描述](#control-register-c7)。

## 库 context

智能合约的 *库 context*（库环境）是将 256 位cell（表示）哈希映射到相应cell本身的哈希映射。在执行智能合约期间访问外部cell引用时，会在库环境中查找所引用的cell，并通过找到的cell透明地替换外部cell引用。

调用智能合约的库环境计算如下：

1. 取当前主链状态的当前工作链的全局库环境。
2. 然后，它由智能合约的本地库环境增强，存储在智能合约状态的 `library` 字段中。仅考虑 256 位密钥等于相应值cell的哈希。如果密钥同时存在于全局和本地库环境中，则本地环境在合并中占优势。
3. 最后，由传入消息的 `init` 字段（如果有）的 `library` 字段增强。请注意，如果账户处于冻结或未初始化状态，则消息的 `library` 字段将覆盖先前步骤中的本地库环境。消息库的优先级低于本地和全局库环境。

为 TVM 创建共享库的最常见方式是在主链中发布对库的根cell的引用。

## 堆栈

TVM 栈的初始化在 TVM 的初始状态形成之后进行，具体取决于引发交易的事件：

- 内部消息
- 外部消息
- tick-tock
- 拆分准备
- 合并安装

始终推送到栈的最后一个项是 *函数选择器*，它是一个用于标识引发交易的事件的 *Integer*。

### 内部消息

在内部消息的情况下，栈通过按以下方式推送到智能合约的 `main()` 函数的参数来初始化：

- 将智能合约的余额 *b*（将入站消息的值记入后的余额）作为 nanotons 的 *Integer* 金额传递。
- 将入站消息 *m* 的余额 *b*<sub>m</sub> 作为 nanotons 的 *Integer* 金额传递。
- 将入站消息 *m* 作为包含类型 *Message X* 的序列化值的cell传递，其中 *X* 是消息体的类型。
- 将入站消息的主体 *m*<sub>b</sub>，等于字段主体 *m* 的值，并作为cell片传递。
- 函数选择器 *s*，通常等于 0。

之后，智能合约的代码，即其初始值 **c3**，将被执行。根据 *s*，它选择正确的函数来处理函数的其余参数，然后终止。

### 外部消息

入站外部消息的处理类似于[上述内部消息](#internal-message)，但有以下修改：

- 函数选择器 *s* 设置为 -1。
- 入站消息的余额 *b*<sub>m</sub> 总是为 0。
- 初始的当前 gas 限制 *g*<sub>l</sub> 总是为 0。但是，初始 gas 信用 *g*<sub>c</sub> > 0。

智能合约必须以 *g*<sub>c</sub> = 0 或 *g*<sub>r</sub> ≥ *g*<sub>c</sub> 终止；否则，交易及其中包含的块将无效。建议块候选人的验证者或 collator 绝不能包含处理无效的外部传入消息的交易。

### Tick 和 Tock

在 tick 和 tock 交易的情况下，栈通过按以下方式推送到智能合约的 `main()` 函数的参数来初始化：

- 将当前账户的余额 *b* 作为 nanotons 的 *Integer* 金额传递。
- 将当前账户在主链内的 256 位地址作为无符号 *Integer* 传递。
- 对于 Tick 交易，传递的整数等于 0；对于 Tock 交易，传递的整数等于 -1。
- 函数选择器 *s*，等于 -2。

### 拆分准备

在拆分准备交易的情况下，栈通过按以下方式推送到智能合约的 `main()` 函数的参数来初始化：

- 将当前账户的余额 *b* 作为 nanotons 的 *Integer* 金额传递。
- 包含 *SplitMergeInfo* 的 *Slice*。
- 当前账户的 256 位地址。
- 兄弟账户的 256 位地址。
- 0 ≤ *d* ≤ 63，表示当前账户和兄弟账户地址不同的唯一位的位置。
- 函数选择器 *s*，等于 -3。

### 合并安装

在合并安装交易的情况下，栈通过按以下方式推送到智能合约的 `main()` 函数的参数来初始化：

- 当前账户的余额 *b*（已与兄弟账户的 nanotons 余额合并）作为 nanotons 的 *Integer* 金额传递。
- 从入站消息 *m* 中获取的兄弟账户的余额 *b'* 作为 nanotons 的 *Integer* 金额传递。
- 由合并准备交易自动生成的兄弟账户的消息 *m*。其 `init` 字段包含兄弟账户的最终状态。将消息作为包含类型 *Message X* 的序列化值的cell传递，其中 *X* 是消息体的类型。
- 由兄弟账户表示的状态，由 *StateInit* 表示。
- 包含 *SplitMergeInfo* 的 *Slice*。
- 当前账户的 256 位地址。
- 兄弟账户的 256 位地址。
- 0 ≤ *d* ≤ 63，表示当前账户和兄弟账户地址不同的唯一位的位置。
- 函数选择器 *s*，等于 -4。

## 控制寄存器 c5

智能合约的 *输出动作* 被累积在存储在控制寄存器  **c5** 中的cell中：cell本身包含列表中的最后一个动作和对先前动作的引用，从而形成一个链接列表。

该列表也可以序列化为类型 *OutList n* 的值，其中 *n* 是列表的长度：

```tlb
out_list_empty$_ = OutList 0;

out_list$_ {n:#}
  prev:^(OutList n)
  action:OutAction
  = OutList (n + 1);

out_list_node$_
  prev:^Cell
  action:OutAction = OutListNode;
```

可能动作的列表包括：

- `action_send_msg` — 用于发送出站消息
- `action_set_code` — 用于设置操作码
- `action_reserve_currency` — 用于存储代币集合
- `action_change_library` — 用于更改库

如下所述，可以从这些操作中得到的 TL-B 方案：

```tlb
action_send_msg#0ec3c86d
  mode:(## 8) 
  out_msg:^(MessageRelaxed Any) = OutAction;
  
action_set_code#ad4de08e
  new_code:^Cell = OutAction;
  
action_reserve_currency#36e6b809
  mode:(## 8)
  currency:CurrencyCollection = OutAction;

libref_hash$0
  lib_hash:bits256 = LibRef;
libref_ref$1
  library:^Cell = LibRef;
action_change_library#26fa1dd4
  mode:(## 7) { mode <= 2 }
  libref:LibRef = OutAction;
```

## 控制寄存器 c7

控制寄存器 **c7** 包含临时数据的根，其形式为元组，由包含一些基本区块链 context 数据的 *SmartContractInfo* 类型组成，例如时间、全局配置等。以下是其 TL-B 方案的描述：

```tlb
smc_info#076ef1ea
  actions:uint16 msgs_sent:uint16
  unixtime:uint32 block_lt:uint64 trans_lt:uint64 
  rand_seed:bits256 balance_remaining:CurrencyCollection
  myself:MsgAddressInt global_config:(Maybe Cell) = SmartContractInfo;
```

此元组的第一个组件是一个 *Integer* 值，始终等于 0x076ef1ea，然后是 9 个命名字段：

| 字段                  | 类型                                                                     | 描述                                                                                                                                         |
| ------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `actions`           | uint16                                                                 | 初始值为0，但每当由非 RAW 输出动作原语安装输出动作时递增一次                                                                                                          |
| `msgs_sent`         | uint16                                                                 | 发送的消息数量                                                                                                                                    |
| `unixtime`          | uint32                                                                 | Unix 时间戳（秒）                                                                                                                                |
| `block_lt`          | uint64                                                                 | 代表此账户上一块的 *逻辑时间*。[更多关于逻辑时间的信息](https://docs.ton.org/develop/smart-contracts/guidelines/message-delivery-guarantees#what-is-a-logical-time) |
| `trans_lt`          | uint64                                                                 | 代表此账户上一笔交易的 *逻辑时间*                                                                                                                         |
| `rand_seed`         | bits256                                                                | 从块的 `rand_seed`、账户地址、正在处理的传入消息的哈希（如果有的话）和交易逻辑时间 `trans_lt` 开始确定性地初始化                                                                       |
| `balance_remaining` | [CurrencyCollection](/develop/data-formats/msg-tlb#currencycollection) | 智能合约的剩余余额                                                                                                                                  |
| `myself`            | [MsgAddressInt](/develop/data-formats/msg-tlb#msgaddressint-tl-b)      | 此智能合约的地址                                                                                                                                   |
| `global_config`     | (Maybe Cell)                                        | 包含有关全局配置的信息                                                                                                                                |

请注意，在即将到

## 参阅

- [TVM 初始化](https://docs.ton.org/tblkch.pdf#page=89\\&zoom=100) 的原始描述，来自白皮书
