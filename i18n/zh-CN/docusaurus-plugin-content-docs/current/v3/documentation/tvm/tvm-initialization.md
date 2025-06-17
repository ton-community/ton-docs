import Feedback from '@site/src/components/Feedback';

# TVM 初始化

:::info
To maximize your comprehension of this page, familiarizing yourself with the [TL-B language](/v3/documentation/data-formats/tlb/cell-boc) is highly recommended.

- [TVM Retracer](https://retracer.ton.org/)
  :::

TVM 在普通和/或其他事务的计算阶段被调用。

## 初始状态

在执行智能合约之前，TVM 的新实例会按如下方式初始化：

- The original **cc**, current continuation, is initialized using the cell slice created from the `code` section of the smart contract. If the account is frozen or uninitialized, the code must be provided in the `init` field of the incoming message.

- **cp**（当前 TVM codepage）设置为默认值，即 0。如果智能合约想使用另一个 TVM codepage _x_，则必须在其代码的第一条指令中使用 `SETCODEPAGE` _x_ 切换到该codepage。 If the smart contract needs to use another TVM codepage _x_, it must switch to it by using `SETCODEPAGE` _x_ as the first instruction in its code.

- 按照 Credit Phase 的结果初始化 **gas** 值（_gas 限制_）。

- 计算 **libraries**（_库 context_）。[下文描述](#library-context)。

- **stack** 初始化过程取决于引发交易的事件，其内容在[下文描述](#stack)。

- Control register **c0** is initialized with the extraordinary continuation `ec_quit` with parameter 0. When executed, this continuation terminates TVM with exit code 0.

- Control register **c1** is initialized with the extraordinary continuation `ec_quit` with parameter 1. When invoked, it terminates TVM with exit code 1. Both exit codes 0 and 1 are considered successful terminations of TVM.

- Control register **c2** is initialized with the extraordinary continuation `ec_quit_exc`. When invoked, it takes the top integer from the stack equal to the exception number and terminates TVM with that exit code. By default, all exceptions terminate the smart contract execution with the exception number as the exit code.

- 控制寄存器 **c3**（代码字典）由类似于上述 **cc**（当前 continuation ）的智能合约代码的cell初始化。

- Control register **c4** is initialized with the smart contract's persistent data from its `data` section. If the account is frozen or uninitialized, this data must be provided in the `init` field of the incoming message. Only the root of the data is loaded initially; TVM loads additional cells by their references when accessed, enabling a virtual memory mechanism.

- Control register **c5** is initialized with an empty cell. The "output action" primitives of TVM, such as `SENDMSG`, accumulate output actions (for example, outbound messages) in this register, which are performed upon successful termination of the smart contract. The TL-B scheme for its serialization is [described below](#control-register-c5).

- 控制寄存器 **c7**（临时数据的根）初始化为元组，其结构如下  [下文描述](#control-register-c7)。

## 库 context

智能合约的 _库 context_（库环境）是将 256 位cell（表示）哈希映射到相应cell本身的哈希映射。在执行智能合约期间访问外部cell引用时，会在库环境中查找所引用的cell，并通过找到的cell透明地替换外部cell引用。 When an external cell reference is accessed during the smart contract's execution, the cell is looked up in the library environment, and the external cell reference is transparently replaced by the found cell.

调用智能合约的库环境计算如下：

1. 取当前主链状态的当前工作链的全局库环境。
2. It's augmented by the local library environment of the smart contract, stored in the `library` field of the smart contract's state. Only 256-bit keys equal to the hashes of the corresponding value cells are considered. The local environment takes precedence if a key is present in both the global and local library environments.
3. 最后，由传入消息的 `init` 字段（如果有）的 `library` 字段增强。请注意，如果账户处于冻结或未初始化状态，则消息的 `library` 字段将覆盖先前步骤中的本地库环境。消息库的优先级低于本地和全局库环境。 If the account is frozen or uninitialized, the `library` field of the message is used instead of the local library environment. The message library has lower precedence than local and global library environments.

为 TVM 创建共享库的最常见方式是在主链中发布对库的根cell的引用。

## 堆栈

TVM 栈的初始化在 TVM 的初始状态形成之后进行，具体取决于引发交易的事件： The contents of the stack depend on the event that triggered the transaction:

- 内部消息
- 外部消息
- tick-tock
- 拆分准备
- 合并安装

推送到堆栈的最后一项总是 _function selector_（函数选择器），它是一个 _Integer_（整数），用于标识引起事务的事件。

### 内部消息

在内部消息的情况下，栈通过按以下方式推送到智能合约的 `main()` 函数的参数来初始化：

- 将智能合约的余额 _b_（将入站消息的值记入后的余额）作为 nanotons 的 _Integer_ 金额传递。
- 将入站消息 _m_ 的余额 _b_<sub>m</sub> 作为 nanotons 的 _Integer_ 金额传递。
- 将入站消息 _m_ 作为包含类型 _Message X_ 的序列化值的cell传递，其中 _X_ 是消息体的类型。
- 将入站消息的主体 _m_<sub>b</sub>，等于字段主体 _m_ 的值，并作为cell slice传递。
- 函数选择器 _s_，通常等于 0。

之后，智能合约的代码，即其初始值 **c3**，将被执行。根据 _s_，它选择正确的函数来处理函数的其余参数，然后终止。 It selects the correct function based on _s_, which is expected to process the remaining arguments and terminate.

### 外部消息

入站外部消息的处理类似于[上述内部消息](#internal-message)，但有以下修改：

- 函数选择器 _s_ 设置为 -1。
- 入站消息的余额 _b_<sub>m</sub> 总是为 0。
- 初始的当前 gas 限制 _g_<sub>l</sub> 总是为 0。但是，初始 gas 信用 _g_<sub>c</sub> > 0。 However, the initial gas credit _g_<sub>c</sub> > 0.

The smart contract must terminate with either _g_<sub>c</sub> = 0 or _g_<sub>r</sub> ≥ _g_<sub>c</sub>. If this condition isn't met, the transaction and the block containing it are considered invalid. Validators or collators proposing a block candidate must ensure that transactions processing inbound external messages are valid and exclude invalid ones.

### Tick 和 Tock

在 tick 和 tock 交易的情况下，栈通过按以下方式推送到智能合约的 `main()` 函数的参数来初始化：

- 将当前账户的余额 _b_ 作为 nanotons 的 _Integer_ 金额传递。
- 将当前账户在主链内的 256 位地址作为无符号 _Integer_ 传递。
- 对于 Tick 交易，传递的整数等于 0；对于 Tock 交易，传递的整数等于 -1。
- 函数选择器 _s_，等于 -2。

### 拆分准备

在拆分准备交易的情况下，栈通过按以下方式推送到智能合约的 `main()` 函数的参数来初始化：

- 将当前账户的余额 _b_ 作为 nanotons 的 _Integer_ 金额传递。
- 包含 _SplitMergeInfo_ 的 _Slice_。
- 当前账户的 256 位地址。
- 兄弟账户的 256 位地址。
- 0 ≤ _d_ ≤ 63 的整数，等于当前账户和同级账户地址唯一不同位的位置。
- 函数选择器 _s_，等于 -3。

### 合并安装

在合并安装交易的情况下，栈通过按以下方式推送到智能合约的 `main()` 函数的参数来初始化：

- 当前账户的余额 _b_（已与兄弟账户的 nanotons 余额合并）作为 nanotons 的 _Integer_ 金额传递。
- 从入站消息 _m_ 中获取的兄弟账户的余额 _b'_ 作为 nanotons 的 _Integer_ 金额传递。
- 由合并准备交易自动生成的兄弟账户的消息 _m_。其 `init` 字段包含兄弟账户的最终状态。将消息作为包含类型 _Message X_ 的序列化值的cell传递，其中 _X_ 是消息体的类型。 Its `init` field contains the final state of the sibling account. The message is passed as a cell, which contains a serialized value of type _Message X_, where _X_ is the message body type.
- 由兄弟账户表示的状态，由 _StateInit_ 表示。
- 包含 _SplitMergeInfo_ 的 _Slice_。
- 当前账户的 256 位地址。
- 兄弟账户的 256 位地址。
- 0 ≤ _d_ ≤ 63 的整数，表示当前账户和兄弟账户地址不同的唯一位的位置。
- 函数选择器 _s_，等于 -4。

## 控制寄存器 c5

智能合约的 _输出动作_ 被累积在存储在控制寄存器  **c5** 中的cell中：cell本身包含列表中的最后一个动作和对先前动作的引用，从而形成一个链接列表。

该列表也可以序列化为类型 _OutList n_ 的值，其中 _n_ 是列表的长度：

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

控制寄存器 **c7** 包含临时数据的根，其形式为元组，由包含一些基本区块链 context 数据的 _SmartContractInfo_ 类型组成，例如时间、全局配置等。以下是其 TL-B 方案的描述： The following TL-B scheme describes it:

```tlb
smc_info#076ef1ea
  actions:uint16 msgs_sent:uint16
  unixtime:uint32 block_lt:uint64 trans_lt:uint64 
  rand_seed:bits256 balance_remaining:CurrencyCollection
  myself:MsgAddressInt global_config:(Maybe Cell) = SmartContractInfo;
```

此元组的第一个组件是一个 _Integer_ 值，始终等于 0x076ef1ea，然后是 9 个命名字段：

| 字段                  | 类型                                                                                  | 描述                                                                                                                                                                                                                         |
| ------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `actions`           | uint16                                                                              | 初始值为0，但每当由非 RAW 输出动作原语安装输出动作时递增一次                                                                                                                                                                                          |
| `msgs_sent`         | uint16                                                                              | 发送的消息数量                                                                                                                                                                                                                    |
| `unixtime`          | uint32                                                                              | Unix 时间戳（秒）                                                                                                                                                                                                                |
| `block_lt`          | uint64                                                                              | Represents the logical time of the previous block of this account. 代表该账户上一个区块的 _逻辑时间_。[关于逻辑时间的更多信息](/v3/documentation/smart-contracts/message-management/messages-and-transactions#what-is-a-logical-time) |
| `trans_lt`          | uint64                                                                              | 代表该账户上次交易的逻辑时间                                                                                                                                                                                                             |
| `rand_seed`c        | bits256                                                                             | 从块的 `rand_seed`、账户地址、正在处理的传入消息的哈希（如果有的话）和交易逻辑时间 `trans_lt` 开始确定性地初始化                                                                                                                                                       |
| `balance_remaining` | [CurrencyCollection](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection) | 智能合约余额                                                                                                                                                                                                                     |
| `myself`            | [MsgAddressInt](/v3/documentation/data-formats/tlb/msg-tlb#msgaddressint-tl-b)      | 该智能合约的地址                                                                                                                                                                                                                   |
| `global_config`     | (Maybe Cell)                                                     | 包含有关全局配置的信息                                                                                                                                                                                                                |

请注意，在即将到来的 TVM 升级中，**c7** 元组已从 10 个元素扩展到 14 个元素。请点击 [此处](/v3/documentation/tvm/changelog/tvm-upgrade-2023-07) 阅读更多相关信息。 Read more about it [here](/v3/documentation/tvm/changelog/tvm-upgrade-2023-07).

## 另见

- 白皮书中 TVM 初始化 的原始描述
  <Feedback />

