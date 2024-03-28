# 更改参数

本文档旨在简要解释TON区块链的配置参数，并提供通过大多数验证者共识更改这些参数的逐步指南。

我们假设读者已经熟悉[Fift](/develop/fift/overview)和[轻客户端](/participate/nodes/lite-client)，如[FullNode-HOWTO (低级)](/participate/nodes/full-node)和[Validator-HOWTO (低级)](/participate/nodes/validator)中所述，其中描述了验证者为配置提案投票的部分。

## 1. 配置参数
**配置参数**是影响验证者和/或TON区块链基本智能合约行为的某些值。所有配置参数的当前值存储为主链状态的特殊部分，并在需要时从当前主链状态中提取。因此，讲到配置参数的值时要考虑到某个特定的主链区块。每个分片链区块都包含对最新已知主链区块的引用；假定相应主链状态中的值对此分片链区块是有效的，并在其生成和验证过程中使用。对于主链区块，使用上一个主链区块的状态来提取有效的配置参数。因此，即使有人试图在主链区块中更改某些配置参数，这些更改也只会在下一个主链区块中生效。

每个配置参数由一个有符号的32位整数索引标识，称为**配置参数索引**或简称**索引**。配置参数的值始终是一个cell。某些配置参数可能会缺失；那时有时假定此参数的值为`Null`。还有一个**强制性**配置参数列表必须始终存在；此列表存储在配置参数`#10`中。

所有配置参数组合成一个**配置字典** - 一个带有有符号32位键（配置参数索引）和值（由一个cell引用组成）的哈希映射。换句话说，配置字典是TL-B类型的值（`HashmapE 32 ^Cell`）。实际上，所有配置参数的集合作为TL-B类型`ConfigParams`的值存储在主链状态中：

    _ config_addr:bits256 config:^(Hashmap 32 ^Cell) = ConfigParams;

我们看到，除了配置字典外，`ConfigParams`还包含`config_addr` - 主链上配置智能合约的256位地址。稍后将提供有关配置智能合约的更多细节。

通过特殊的TVM寄存器`c7`，所有智能合约在其交易代码执行时都可以访问包含所有配置参数有效值的配置字典。更准确地说，当执行智能合约时，`c7`被初始化为一个元组，其唯一元素是一个包含几个执行智能合约时有用的“context”值的元组，例如当前Unix时间（如块头中所注册）。此元组的第十个条目（即，以零为基索引的索引9）包含代表配置字典的cell。因此，可以通过TVM指令`PUSH c7; FIRST; INDEX 9`或等效指令`CONFIGROOT`来访问它。事实上，特殊的TVM指令`CONFIGPARAM`和`CONFIGOPTPARAM`将前述操作与字典查找结合起来，通过其索引返回任何配置参数。我们推荐参考TVM文档以获取更多关于这些指令的详细信息。这里相关的是所有配置参数都可以从所有智能合约（主链或分片链）中轻松访问，并且智能合约可以检查并使用它们来执行特定检查。例如，智能合约可能会从配置参数中提取工作链数据存储价格，以计算存储用户提供数据的价格。

配置参数的值不是任意的。实际上，如果配置参数索引`i`为非负，则此参数的值必须是TL-B类型（`ConfigParam i`）的有效值。验证者强制执行此限制，不会接受对非负索引的配置参数的更改，除非它们是相应TL-B类型的有效值。

因此，此类参数的结构在源文件`crypto/block/block.tlb`中定义，其中为不同的`i`值定义了（`ConfigParam i`）。例如，

    _ config_addr:bits256 = ConfigParam 0;
    _ elector_addr:bits256 = ConfigParam 1;
    _ dns_root_addr:bits256 = ConfigParam 4;  // root TON DNS resolver

    capabilities#c4 version:uint32 capabilities:uint64 = GlobalVersion;
    _ GlobalVersion = ConfigParam 8;  // all zero if absent

我们看到配置参数`#8`包含一个没有引用且恰好有104个数据位的cell。前四位必须是`11000100`，然后存储32位当前启用的“全局版本”，随后是对应当前启用能力的64位整数标志。所有配置参数的更详细描述将在TON区块链文档的附录中提供；目前，可以检查`crypto/block/block.tlb`中的TL-B方案并检查验证者源代码中不同参数的使用方式。

与具有非负索引的配置参数相反，具有负索引的配置参数可以包含任意值。至少，验证者不会对其值强加任何限制。因此，它们可用于存储重要信息（例如，某些智能合约必须开始操作的Unix时间），该信息对于块生成不是关键，但被一些基本智能合约使用。

## 2. 更改配置参数

我们已经解释了当前配置参数的值是如何存储在主链状态的特殊部分中的。它们是如何更改的？

事实上，主链中有一个特殊的智能合约称为**配置智能合约**。其地址由`ConfigParams`中的`config_addr`字段确定，我们之前已经描述过了。其数据中的第一个cell引用必须包含所有配置参数的最新副本。当生成新的主链区块时，会通过其地址`config_addr`查找配置智能合约，并从其数据的第一个cell引用中提取新的配置字典。在进行一些有效性检查后（例如，验证具有非负32位索引`i`的任何值确实是TL-B类型（`ConfigParam i`）的有效值），验证者将此新配置字典复制到包含ConfigParams的主链部分。在创建所有交易之后执行此操作，因此只检查配置智能合约中的新配置字典的最终版本。如果有效性检查失败，则“真实”的配置字典保持不变。通过这种方式，配置智能合约无法安装无效的配置参数值。如果新配置字典与当前配置字典一致，则不执行检查也不做更改。

通过这种方式，所有配置参数的更改都由配置智能合约执行，其代码决定更改配置参数的规则。当前，配置智能合约支持两种更改配置参数的模式：

1) 通过由特定私钥签名的外部消息，该私钥对应于存储在配置智能合约数据中的公钥。这是公共测试网和可能由一个实体控制的较小私有测试网络所采用的方法，因为它使运营商能够轻松更改任何配置参数的值。请注意，这个公钥可以通过一个由旧密钥签名的特殊外部消息更改，如果它被更改为零，则此机制被禁用。因此，可以在启动后立即进行微调，然后永久禁用它。
2) 通过创建“配置提案(configuration proposals)”，然后由验证者对其投票或反对。通常，配置提案必须在一个轮次中收集超过3/4的所有验证者（按权重）的投票，并且不仅在一个轮次中，而且在几个轮次中（即，连续几组验证者必须确认提议的参数更改）。这是TON区块链主网将采用的分布式治理机制。

我们希望更详细地描述第二种更改配置参数的方式。

## 3. 创建配置提案

新的**配置提案**包含以下数据：
- 要更改的配置参数的索引
- 配置参数的新值（或Null，如果要删除）
- 提案的过期Unix时间
- 标志位提案是**关键**还是非关键
- 可选的**旧值哈希**，带有当前值的cell哈希（仅当当前值具有指定哈希时，提案才能被激活）

任何在主链上拥有钱包的人都可以创建新的配置提案，前提是他支付足够的费用。但是，只有验证者可以对现有的配置提案投票或反对。

请注意，有**关键**和**普通**配置提案。关键配置提案可以更改任何配置参数，包括所谓的关键配置参数之一（关键配置参数列表存储在配置参数`#10`中，它本身是关键的）。然而，创建关键配置提案的成本更高，通常需要在更多轮次中收集更多验证者的投票（普通和关键配置提案的确切投票要求存储在关键配置参数`#11`中）。另一方面，普通配置提案更便宜，但它们不能更改关键配置参数。

为了创建新的配置提案，首先必须生成一个包含提议的新值的BoC（cell包）文件。这样做的确切方式取决于要更改的配置参数。例如，如果我们想创建包含UTF-8字符串"TEST"（即`0x54455354`）的参数`-239`，我们可以如下创建`config-param-239.boc`：调用Fift，然后输入

    <b "TEST" $, b> 2 boc+>B "config-param-239.boc" B>file
    bye

结果，将创建一个21字节的文件`config-param-239.boc`，包含所需值的序列化。

对于更复杂的情况，尤其是对于具有非负索引的配置参数，这种简单的方法不容易适用。我们建议使用`create-state`（在构建目录中作为`crypto/create-state`可用）而不是`fift`，并复制和编辑源文件`crypto/smartcont/gen-zerostate.fif`和`crypto/smartcont/CreateState.fif`的适当部分，通常用于创建TON区块链的零状态（对应于其他区块链架构的“创世块”）。

例如，考虑配置参数`#8`，其中包含当前启用的全局区块链版本和能力：

    capabilities#c4 version:uint32 capabilities:uint64 = GlobalVersion;
    _ GlobalVersion = ConfigParam 8;

我们可以通过运行轻客户端并输入`getconfig 8`来检查其当前值：

```
> getconfig 8
...
ConfigParam(8) = (
  (capabilities version:1 capabilities:6))

x{C4000000010000000000000006}
```

现在假设我们想要启用位`#3`（`+8`）表示的能力，即`capReportVersion`（启用时，此能力会迫使所有 collator 在其生成的块头中报告其支持的版本和能力）。因此，我们想要`version=1`和`capabilities=14`。在这个例子中，我们仍然可以猜测正确的序列化并直接通过Fift创建BoC文件。

    x{C400000001000000000000000E} s>c 2 boc+>B "config-param8.boc" B>file

（结果创建了一个包含所需值的30字节文件`config-param8.boc`。）

然而，在更复杂的情况下，这可能不是一个选项，所以让我们以不同的方式做这个例子。也就是说，我们可以检查源文件`crypto/smartcont/gen-zerostate.fif`和`crypto/smartcont/CreateState.fif`中的相关部分。

    // version capabilities --
    { <b x{c4} s, rot 32 u, swap 64 u, b> 8 config! } : config.version!
    1 constant capIhr
    2 constant capCreateStats
    4 constant capBounceMsgBody
    8 constant capReportVersion
    16 constant capSplitMergeTransactions

和

    // version capabilities
    1 capCreateStats capBounceMsgBody or capReportVersion or config.version!

我们看到，`config.version!`没有最后的`8 config!`实际上就是我们需要的，所以我们可以创建一个临时Fift脚本，例如，`create-param8.fif`：
```
#!/usr/bin/fift -s
"TonUtil.fif" include

1 constant capIhr
2 constant capCreateStats
4 constant capBounceMsgBody
8 constant capReportVersion
16 constant capSplitMergeTransactions
{ <b x{c4} s, rot 32 u, swap 64 u, b> } : prepare-param8

// 为配置参数#8创建新值
1 capCreateStats capBounceMsgBody or capReportVersion or prepare-param8
// 检查此值的有效性
dup 8 is-valid-config? not abort"not a valid value for chosen configuration parameter"
// 打印
dup ."Serialized value = " <s csr.
// 保存到提供的第一个命令行参数作为文件
2 boc+>B $1 tuck B>file
."(Saved into file " type .")" cr
```

现在，如果我们运行`fift -s create-param8.fif config-param8.boc`或者更好地从构建目录运行`crypto/create-state -s create-param8.fif config-param8.boc`，我们看到以下输出：

    Serialized value = x{C400000001000000000000000E}
    (Saved into file config-param8.boc)

我们获得与之前相同内容的30字节文件`config-param8.boc`。

一旦我们有了一个包含配置参数所需值的文件，我们就调用目录`crypto/smartcont`中找到的脚本`create-config-proposal.fif`，带有适当的参数。同样，我们建议使用`create-state`（在构建目录中作为`crypto/create-state`可用）而不是`fift`，因为它是Fift的一个特殊扩展版本，能够进行更多与区块链相关的有效性检查：

```
$ crypto/create-state -s create-config-proposal.fif 8 config-param8.boc -x 1100000


Loading new value of configuration parameter 8 from file config-param8.boc
x{C400000001000000000000000E}

Non-critical configuration proposal will expire at 1586779536 (in 1100000 seconds)
Query id is 6810441749056454664 
resulting internal message body: x{6E5650525E838CB0000000085E9455904_}
 x{F300000008A_}
  x{C400000001000000000000000E}

B5EE9C7241010301002C0001216E5650525E838CB0000000085E9455904001010BF300000008A002001AC400000001000000000000000ECD441C3C
(a total of 104 data bits, 0 cell references -> 59 BoC data bytes)
(Saved to file config-msg-body.boc)
```

我们获得了一个要从主链上任何（钱包）智能合约以适量的Toncoin发送到配置智能合约的内部消息的正文。配置智能合约的地址可以通过在轻客户端中输入`getconfig 0`获得：
```
> getconfig 0
ConfigParam(0) = ( config_addr:x5555555555555555555555555555555555555555555555555555555555555555)
x{5555555555555555555555555555555555555555555555555555555555555555}
```
我们看到配置智能合约的地址是`-1:5555...5555`。通过运行此智能合约的适当get方法，我们可以找出创建此配置提案所需的付款金额：

```
> runmethod -1:5555555555555555555555555555555555555555555555555555555555555555 proposal_storage_price 0 1100000 104 0

arguments:  [ 0 1100000 104 0 75077 ] 
result:  [ 2340800000 ] 
remote result (not to be trusted):  [ 2340800000 ] 
```

get方法`proposal_storage_price`的参数是关键标志位（本例中为0），此提案将处于活动状态的时间间隔（1.1百万秒），数据中的位总数（104）和cell引用（0）。后两个数量可以在`create-config-proposal.fif`的输出中看到。

我们看到，创建此提案需要支付2.3408 Toncoin。最好添加至少1.5 Tonoin到消息中以支付处理费，所以我们打算发送4 Toncoin连同请求（所有多余的Toncoin将退回）。现在我们使用`wallet.fif`（或我们正在使用的钱包对应的Fift脚本）从我们的钱包向配置智能合约创建一个携带4 Toncoin和`config-msg-body.boc`中的正文的转账。这通常看起来像：

```
$ fift -s wallet.fif my-wallet -1:5555555555555555555555555555555555555555555555555555555555555555 31 4. -B config-msg-body.boc

Transferring GR$4. to account kf9VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQft = -1:5555555555555555555555555555555555555555555555555555555555555555 seqno=0x1c bounce=-1 
Body of transfer message is x{6E5650525E835154000000085E9293944_}
 x{F300000008A_}
  x{C400000001000000000000000E}

signing message: x{0000001C03}
 x{627FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA773594000000000000000000000000000006E5650525E835154000000085E9293944_}
  x{F300000008A_}
   x{C400000001000000000000000E}

resulting external message: x{89FE000000000000000000000000000000000000000000000000000000000000000007F0BAA08B4161640FF1F5AA5A748E480AFD16871E0A089F0F017826CDC368C118653B6B0CEBF7D3FA610A798D66522AD0F756DAEECE37394617E876EFB64E9800000000E01C_}
 x{627FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA773594000000000000000000000000000006E5650525E835154000000085E9293944_}
  x{F300000008A_}
   x{C400000001000000000000000E}

B5EE9C724101040100CB0001CF89FE000000000000000000000000000000000000000000000000000000000000000007F0BAA08B4161640FF1F5AA5A748E480AFD16871E0A089F0F017826CDC368C118653B6B0CEBF7D3FA610A798D66522AD0F756DAEECE37394617E876EFB64E9800000000E01C010189627FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA773594000000000000000000000000000006E5650525E835154000000085E9293944002010BF300000008A003001AC400000001000000000000000EE1F80CD3
(Saved to file wallet-query.boc)
```

现在我们通过轻客户端发送外部消息`wallet-query.boc`。

    > sendfile wallet-query.boc
    ....
    external message status is 1

等待一段时间后，我们可以检查我们钱包的传入消息以检查来自配置智能合约的响应消息，

或者如果我们感到幸运，简单地通过配置智能合约的方法`list_proposals`检查所有活跃配置提案的列表。

```
> runmethod -1:5555555555555555555555555555555555555555555555555555555555555555 list_proposals
...
arguments:  [ 107394 ] 
result:  [ ([64654898543692093106630260209820256598623953458404398631153796624848083036321 [1586779536 0 [8 C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} -1] 112474791597373109254579258586921297140142226044620228506108869216416853782998 () 864691128455135209 3 0 0]]) ] 
remote result (not to be trusted):  [ ([64654898543692093106630260209820256598623953458404398631153796624848083036321 [1586779536 0 [8 C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} -1] 112474791597373109254579258586921297140142226044620228506108869216416853782998 () 864691128455135209 3 0 0]]) ] 
... caching cell FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC
```

我们看到所有活跃配置提案的列表只由一个条目组成，由一对表示。
```
[6465...6321 [1586779536 0 [8 C{FDCD...} -1] 1124...2998 () 8646...209 3 0 0]]
```
第一个数字`6465..6321`是配置提案的唯一标识符，等于其256位哈希。这对的第二个组成部分是一个元组，描述了此配置提案的状态。此元组的第一个组成部分是配置提案的过期Unix时间（`1586779546`）。第二个组成部分（`0`）是关键性标志。接下来是配置提案本身，由三元组`[8 C{FDCD...} -1]`描述，其中`8`是要修改的配置参数索引，`C{FDCD...}`是带有新值的cell（由此cell的哈希表示），`-1`是此参数旧值的可选哈希（`-1`表示未指定此哈希）。接下来我们看到一个大数字`1124...2998`，表示当前验证者集的标识符，然后是一个空列表`()`，表示到目前为止已经投票支持此提案的所有当前活跃验证者的集合，然后是`weight_remaining`等于`8646...209` - 一个正数，如果提案在本轮中还没有收集到足够的验证者投票，则为负数。然后我们看到三个数字：`3 0 0`。这些数字分别是`rounds_remaining`（此提案最多在三轮中存活，即，当前验证者集更换次数），`wins`（提案在一轮中收集到超过3/4所有验证者的投票次数）和`losses`（提案未能在一轮中收集到3/4所有验证者的投票次数）。

我们可以通过让轻客户端展开cell`C{FDCD...}`来检查配置参数 `#8` 的建议值，使用它的哈希值`FDCD... `或这个哈希值的足够长的前缀来唯一标识所讨论的cell：
```
> dumpcell FDC
C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} =
  x{C400000001000000000000000E}
```
我们看到值为`x{C400000001000000000000000E}`，这确实是我们嵌入到配置提案中的值。我们甚至可以要求轻客户端将此cell显示为TL-B类型（`ConfigParam 8`）的值。
```
> dumpcellas ConfigParam8 FDC
dumping cells as values of TLB type (ConfigParam 8)
C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} =
  x{C400000001000000000000000E}
(
    (capabilities version:1 capabilities:14))
```
当我们考虑由其他人创建的配置提案时，这特别有用。

请注意，从现在起，配置提案由其256位哈希标识 - 巨大的十进制数字`6465...6321`。我们可以通过运行配置智能合约的get方法`get_proposal`来检查特定配置提案的当前状态，参数只需等于配置提案的标识符：
```
> runmethod -1:5555555555555555555555555555555555555555555555555555555555555555 get_proposal 64654898543692093106630260209820256598623953458404398631153796624848083036321
...
arguments:  [ 64654898543692093106630260209820256598623953458404398631153796624848083036321 94347 ] 
result:  [ [1586779536 0 [8 C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} -1] 112474791597373109254579258586921297140142226044620228506108869216416853782998 () 864691128455135209 3 0 0] ] 
```
我们获得与之前相同的结果，但仅针对一个配置提案，开头没有配置提案的标识符。

## 4. 为配置提案投票

一旦创建了配置提案，它就应该在当前轮次中收集到超过3/4的当前验证者（按权重，即按股权）的投票，可能还要在几个后续轮次（选举的验证者集）中。通过这种方式，更改配置参数的决定必须得到不仅是当前验证者集，而且是几个后续验证者集的显著多数的批准。

为配置提案投票仅适用于当前验证者，其永久公钥列在配置参数`#34`中。过程大致如下：

- 验证者的运营商查找他的验证者在配置参数`#34`中存储的当前验证者集中的（0-based）索引`val-idx`。
- 运营商调用目录`crypto/smartcont`中找到的特殊Fift脚本`config-proposal-vote-req.fif`，指出`val-idx`和`config-proposal-id`作为其参数：
```
    $ fift -s config-proposal-vote-req.fif -i 0 64654898543692093106630260209820256598623953458404398631153796624848083036321
    Creating a request to vote for configuration proposal 0x8ef1603180dad5b599fa854806991a7aa9f280dbdb81d67ce1bedff9d66128a1 on behalf of validator with index 0 
    566F744500008EF1603180DAD5B599FA854806991A7AA9F280DBDB81D67CE1BEDFF9D66128A1
    Vm90RQAAjvFgMYDa1bWZ-oVIBpkaeqnygNvbgdZ84b7f-dZhKKE=
    Saved to file validator-to-sign.req
```
- 在此之后，必须使用`sign <validator-key-id> 566F744...28A1` 命令通过连接到验证者的 `validator-engine-console` ，用当前验证者的私钥对投票请求进行签名。这个过程类似于[验证者操作指南](/participate/nodes/validator)中描述的参与验证者选举的过程，但这次必须使用当前活跃的密钥。
- 接下来，必须调用另一个脚本 `config-proposal-signed.fif`。它的参数与 `config-proposal-req.fif` 类似，但它需要两个额外的参数：用于签名投票请求的公钥的 base64 表示，以及签名本身的 base64 表示。这与[验证者操作指南](/participate/nodes/validator)中描述的过程非常类似。
- 通过这种方式，创建了包含签名投票的配置提案的内部消息体的文件 `vote-msg-body.boc`。
- 在此之后，`vote-msg-body.boc` 必须通过任何驻留在主链中的智能合约（通常使用验证者的控制智能合约）携带一小笔 Toncoin 进行处理（通常，1.5 Toncoin 应该就足够）被发送出去。这再次与验证者选举期间采用的程序完全相似。这通常通过运行以下命令来实现：
```
$ fift -s wallet.fif my_wallet_id -1:5555555555555555555555555555555555555555555555555555555555555555 1 1.5 -B vote-msg-body.boc
```
（如果使用简单钱包来控制验证者），然后从轻客户端发送生成的文件 `wallet-query.boc`：

```
> sendfile wallet-query.boc
```

你可以监控配置智能合约到控制智能合约的答复消息，以了解你的投票查询的状态。或者，你可以通过配置智能合约的 get-method `show_proposal` 来检查配置提案的状态：
```
> runmethod -1:5555555555555555555555555555555555555555555555555555555555555555 get_proposal 64654898543692093106630260209820256598623953458404398631153796624848083036321
...
arguments:  [ 64654898543692093106630260209820256598623953458404398631153796624848083036321 94347 ] 
result:  [ [1586779536 0 [8 C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} -1] 112474791597373109254579258586921297140142226044620228506108869216416853782998 (0) 864691128455135209 3 0 0] ]
```
这一次，已经为此配置提案投票的验证者的索引列表应该是非空的，并且应该包含你的验证者的索引。在这个例子中，这个列表是 (`0`)，意味着在配置参数 `#34` 中索引为 `0` 的验证者已经投票。如果列表变得足够大，提案状态中的倒数第二个整数（`3 0 0` 中的第一个零）会增加一，表明这个提案新获得了胜利。如果胜利次数变得大于或等于在配置参数 `#11` 中指示的值，那么配置提案被自动接受，并且所提议的更改立即生效。另一方面，当验证者集合发生变化时，已经投票的验证者的列表会变为空，`rounds_remaining` 的值（在 `3 0 0` 中为三）会减少一个，如果它变成负数，则配置提案被销毁。如果提案没有被销毁，并且这一轮没有获胜，那么损失次数（`3 0 0` 中的第二个零）会增加。如果它变得大于配置参数 `#11` 中指定的值，那么配置提案会被丢弃。 因此，所有没有在一轮中投票的验证者隐式地投了反对票。

## 5. 自动投票配置提案的方法

类似于命令`createelectionBid`的`validator-engine-console`为参与验证者选举提供的自动化，`validator-engine` 和 `validator-engine-console` 提供了一个自动完成上一节中解释的大部分步骤的方法，生成一个准备用于控制钱包的 `vote-msg-body.boc`。为了使用这个方法，你必须将 Fift 脚本 `config-proposal-vote-req.fif` 和 `config-proposal-vote-signed.fif` 安装到与查找 `validator-elect-req.fif` 和 `validator-elect-signed.fif` 同一个目录中，如[验证者操作指南](/participate/nodes/validator)的第5节中所述。然后，你只需运行
```
    createproposalvote 64654898543692093106630260209820256598623953458404398631153796624848083036321 vote-msg-body.boc
```
在 validator-engine-console 中来创建带有要发送给配置智能合约的内部消息体的 `vote-msg-body.boc`。

## 6. 升级配置智能合约和选举智能合约的代码

可能会发生配置智能合约本身或选举智能合约的代码需要升级的情况。为此，使用上述相同的机制。新代码需存储在值cell的唯一引用中，并且这个值cell必须被提议作为配置参数 `-1000`（用于升级配置智能合约）或 `-1001`（用于升级选举智能合约）的新值。这些参数被视为关键，因此需要很多验证者的票来更改配置智能合约（这类似于采纳新宪法）。我们期望这样的更改首先在测试网中进行测试，并在每个验证者操作员决定投票赞成或反对所提议的更改之前，在公共论坛中讨论所提议的更改。

或者，关键配置参数 `0`（配置智能合约的地址）或 `1`（选举智能合约的地址）可以更改为其他值，这些值必须对应于已经存在且正确初始化的智能合约。特别是，新的配置智能合约必须在其持久数据的第一个引用中包含一个有效的配置字典。由于正确转移更改数据（例如活跃配置提案的列表，或验证者选举的前后参与者列表）在不同的智能合约之间并不容易，所以在多数情况下，升级现有智能合约的代码而不是更改配置智能合约地址更为合适。

有两个辅助脚本用于创建升级配置或选举智能合约代码的配置提案。即 `create-config-upgrade-proposal.fif` 加载一个 Fift 汇编源文件（默认为 `auto/config-code.fif`，对应于 FunC 编译器从 `crypto/smartcont/config-code.fc` 自动生成的代码）并创建相应的配置提案（用于配置参数 `-1000`）。类似地，`create-elector-upgrade-proposal.fif` 加载一个 Fift 汇编源文件（默认为 `auto/elector-code.fif`）并使用它来创建配置参数 `-1001` 的配置提案。通过这种方式，创建升级这两个智能合约之一的配置提案应该非常简单。但是，人们也应该发布智能合约修改后的 FunC 源代码，用于编译它的 FunC 编译器的确切版本，以便所有验证者（或者他们的操作员）能够复现配置提案中的代码（并比较哈希值）并在决定投票赞成或反对所提议的更改之前研究和讨论源代码及其更改。