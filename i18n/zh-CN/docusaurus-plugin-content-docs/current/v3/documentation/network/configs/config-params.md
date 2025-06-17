import Feedback from '@site/src/components/Feedback';

# 更改参数

本文档旨在简要解释TON区块链的配置参数，并提供通过大多数验证者共识更改这些参数的逐步指南。

我们假设读者已经熟悉[Fift](/develop/fift/overview)和[轻客户端](/participate/nodes/lite-client)，如[FullNode-HOWTO (低级)](/participate/nodes/full-node)和[Validator-HOWTO (低级)](/participate/nodes/validator)中所述，其中描述了验证者为配置提案投票的部分。

## 配置参数的值不是任意的。实际上，如果配置参数索引`i`为非负，则此参数的值必须是TL-B类型（`ConfigParam i`）的有效值。验证者强制执行此限制，不会接受对非负索引的配置参数的更改，除非它们是相应TL-B类型的有效值。

The **configuration parameters** are specific values that influence the behavior of validators and fundamental smart contracts on the TON Blockchain. The current values of all configuration parameters are stored as a distinct part of the MasterChain state and are retrieved whenever necessary. Consequently, we can refer to the values of the configuration parameters concerning a particular MasterChain block. Each ShardChain block includes a reference to the most recently known MasterChain block; the values from the corresponding MasterChain state are considered active for this ShardChain block and are used during its generation and validation.

For MasterChain blocks, the state of the previous MasterChain block is used to extract the active configuration parameters. Therefore, even if certain configuration parameters are attempted to be modified within a MasterChain block, any changes will only take effect in the subsequent MasterChain block.

Each configuration parameter is identified by a signed 32-bit integer known as the **configuration parameter index**, or simply the **index**. The value of a configuration parameter is always a `Cell`. In some cases, certain configuration parameters may be absent, and it is generally assumed that the value of these missing parameters is `Null`. Additionally, there is a list of **mandatory** configuration parameters that must always be present. This list is stored in the configuration parameter `#10`.

所有配置参数组合成一个**配置字典** - 一个带有有符号32位键（配置参数索引）和值（由一个cell引用组成）的哈希映射。换句话说，配置字典是TL-B类型的值（`HashmapE 32 ^Cell`）。实际上，所有配置参数的集合作为TL-B类型`ConfigParams`的值存储在主链状态中： In other words, a configuration dictionary is a value of the TL-B type `HashmapE 32 ^Cell`. The collection of all configuration parameters is retained in the MasterChain state as a value of the TL-B type `ConfigParams`:

_ config_addr:bits256 config:^(Hashmap 32 ^Cell) = ConfigParams;

In addition to the configuration dictionary, `ConfigParams` contains `config_addr`—the 256-bit address of the configuration smart contract within the MasterChain. Further details on the configuration smart contract will be provided later.

The configuration dictionary, which contains the active values of all configuration parameters, is accessible to all smart contracts through a special TVM register called `c7` during the execution of a transaction. Specifically, when a smart contract is executed, `c7` is initialized as a tuple. This tuple consists of a single element, which is another tuple containing several "context" values that are useful for executing the smart contract, such as the current Unix time (as recorded in the block header).

The tenth entry of this inner tuple (i.e., the one indexed with zero-based index 9) contains a `Cell` representing the configuration dictionary. This configuration dictionary can be accessed by using the TVM instructions `PUSH c7; FIRST; INDEX 9` or the equivalent instruction `CONFIGROOT`. Furthermore, special TVM instructions like `CONFIGPARAM` and `CONFIGOPTPARAM` streamline this process by combining the previous actions with a dictionary lookup, allowing smart contracts to retrieve any configuration parameter by its index.

It is important to note that all configuration parameters are readily accessible to all smart contracts, whether they operate on the MasterChain or ShardChain. As a result, smart contracts can inspect these parameters and utilize them for specific checks. For instance, a smart contract might extract data storage prices for different WorkChains from a configuration parameter in order to calculate the cost of storing a piece of user-provided data.

配置参数 Specifically, if the configuration parameter index `i` is non-negative, then its value must correspond to a valid value of the TL-B type `ConfigParam i`. Validators enforce this restriction and do not accept changes to configuration parameters with non-negative indices unless the values are valid for the corresponding TL-B type.

因此，此类参数的结构在源文件`crypto/block/block.tlb`中定义，其中为不同的`i`值定义了（`ConfigParam i`）。例如， For example:

- 我们看到，除了配置字典外，`ConfigParams`还包含`config_addr` - 主链上配置智能合约的256位地址。稍后将提供有关配置智能合约的更多细节。
- 或者，关键配置参数 `0`（配置智能合约的地址）或 `1`（选举智能合约的地址）可以更改为其他值，这些值必须对应于已经存在且正确初始化的智能合约。特别是，新的配置智能合约必须在其持久数据的第一个引用中包含一个有效的配置字典。由于正确转移更改数据（例如活跃配置提案的列表，或验证者选举的前后参与者列表）在不同的智能合约之间并不容易，所以在多数情况下，升级现有智能合约的代码而不是更改配置智能合约地址更为合适。
- _ config_addr:bits256 = ConfigParam 0;
  _ elector_addr:bits256 = ConfigParam 1;
  _ dns_root_addr:bits256 = ConfigParam 4;  // root TON DNS resolvercapabilities#c4 version:uint32 capabilities:uint64 = GlobalVersion;
  _ GlobalVersion = ConfigParam 8;  // all zero if absent
- `capabilities#c4 version:uint32 capabilities:uint64 = GlobalVersion;`
- `_GlobalVersion = ConfigParam 8; // all zero if absent`

These entries illustrate how configuration parameters are structured and defined within the specified file.

The configuration parameter `#8` includes a `Cell` that has no references and contains exactly 104 data bits. The first four bits are allocated for `11000100`, followed by 32 bits that represent the currently enabled "global version." This is followed by a 64-bit integer with flags that correspond to the currently enabled capabilities. A more detailed description of all configuration parameters will be provided in an appendix to the TON Blockchain documentation. In the meantime, you can review the TL-B scheme in `crypto/block/block.tlb` to see how different parameters are utilized in the validator sources.

Unlike configuration parameters with non-negative indices, those with negative indices can hold arbitrary values. Validators do not enforce any restrictions on these values. As a result, they can be used to store essential information, such as the Unix time when specific smart contracts are set to begin operating. This information is not critical for block generation but is necessary for some fundamental smart contracts.

## 通过这种方式，所有配置参数的更改都由配置智能合约执行，其代码决定更改配置参数的规则。当前，配置智能合约支持两种更改配置参数的模式：

我们已经解释了当前配置参数的值是如何存储在主链状态的特殊部分中的。它们是如何更改的？ But how are they changed?

There is a special smart contract known as the **configuration smart contract** that resides in the MasterChain. Its address is specified by the `config_addr` field in `ConfigParams`. The first cell reference in its data must contain an up-to-date copy of all configuration parameters. When a new MasterChain block is generated, the configuration smart contract is accessed using its address (`config_addr`), and the new configuration dictionary is extracted from the first cell reference of its data.

Following some validity checks—like ensuring that any value with a non-negative 32-bit index `i` is indeed a valid TL-B type (`ConfigParam i`)—the validator copies this new configuration dictionary into the portion of the MasterChain that contains `ConfigParams`. This operation occurs after all transactions have been created, meaning only the final version of the new configuration dictionary stored in the smart contract is evaluated.

If the validity checks fail, the existing configuration dictionary remains unchanged, ensuring that the configuration smart contract cannot install invalid parameter values. If the new configuration dictionary is identical to the current one, no checks are performed, and no changes are made.

All changes to configuration parameters are executed by the configuration smart contract, which defines the rules for modifying these parameters. Currently, the configuration smart contract supports two methods for changing configuration parameters:

- **External message**: This method involves an external message signed by a specific private key, which corresponds to a public key stored in the configuration smart contract's data. This approach is typically used in public testnets and possibly in smaller private test networks controlled by a single entity, as it allows the operator to easily modify any configuration parameter values.

  It is important to note that this public key can be changed through a special external message signed by the previous key, and if changed to zero, this mechanism becomes disabled. This means the method can be used for fine-tuning right after launch and then permanently disabled.

- **Configuration proposals**: This method involves creating "configuration proposals" that validators vote on. 一旦创建了一个配置提案，它就应该在当前一轮以及随后的几轮（选出的验证者集）中获得当前所有验证者中 3/4 以上的投票（按权重，即按质押）。这样，更改配置参数的决定不仅必须获得当前验证者组的绝大多数同意，还必须获得随后几组验证者的绝大多数同意。 This serves as the distributed governance mechanism for the TON Blockchain Mainnet.

我们希望更详细地描述第二种更改配置参数的方式。

## 当我们考虑其他人创建的配置建议时，这一点尤其有用。

新的**配置提案**包含以下数据：

- 要更改的配置参数的索引

- 配置参数的新值（或Null，如果要删除）

- 提案的过期Unix时间

- 标志位提案是**关键**还是非关键

- 可选的**旧值哈希**，带有当前值的cell哈希（仅当当前值具有指定哈希时，提案才能被激活）

任何在主链上拥有钱包的人都可以创建新的配置提案，前提是他支付足够的费用。但是，只有验证者可以对现有的配置提案投票或反对。 However, only validators have the authority to vote for or against existing configuration proposals.

It is important to note that there are **critical** and **ordinary** configuration proposals. A critical configuration proposal can modify any configuration parameter, including those classified as critical. The list of critical configuration parameters is stored in configuration parameter `#10`, which is itself considered critical. Creating critical configuration proposals is more costly, and they typically require gathering more validator votes across multiple rounds. The specific voting requirements for both ordinary and critical configuration proposals are detailed in the critical configuration parameter `#11`. Conversely, ordinary configuration proposals are less expensive to create but cannot alter critical configuration parameters.

To create a new configuration proposal, one must first generate a BoC (bag-of-cells) file that contains the proposed new value. The method for doing this varies depending on the configuration parameter being modified. For example, if we want to create a parameter `-239` containing the UTF-8 string "TEST" (i.e., `0x54455354`), we would generate `config-param-239.boc` by invoking Fift and then typing:

```
<b "TEST" $, b> 2 boc+>B "config-param-239.boc" B>file
bye
```

结果，将创建一个21字节的文件`config-param-239.boc`，包含所需值的序列化。

For more complex cases, especially for configuration parameters with non-negative indices, this straightforward approach may not be easily applicable. 一旦我们有了一个包含配置参数所需值的文件，我们就调用目录`crypto/smartcont`中找到的脚本`create-config-proposal.fif`，带有适当的参数。同样，我们建议使用`create-state`（在构建目录中作为`crypto/create-state`可用）而不是`fift`，因为它是Fift的一个特殊扩展版本，能够进行更多与区块链相关的有效性检查： You should also consider copying and modifying relevant portions of the source files `crypto/smartcont/gen-zerostate.fif` and `crypto/smartcont/CreateState.fif`. These files are typically used to create the zero state, corresponding to the "genesis block" found in other blockchain architectures, for the TON Blockchain.

例如，考虑配置参数`#8`，其中包含当前启用的全局区块链版本和能力：

```
capabilities#c4 version:uint32 capabilities:uint64 = GlobalVersion;
_ GlobalVersion = ConfigParam 8;
```

我们可以通过运行轻客户端并输入`getconfig 8`来检查其当前值：

```
> getconfig 8
...
ConfigParam(8) = (
  (capabilities version:1 capabilities:6))

x{C4000000010000000000000006}
```

现在假设我们想要启用位`#3`（`+8`）表示的能力，即`capReportVersion`（启用时，此能力会迫使所有 collator 在其生成的块头中报告其支持的版本和能力）。因此，我们想要`version=1`和`capabilities=14`。在这个例子中，我们仍然可以猜测正确的序列化并直接通过Fift创建BoC文件。 When this capability is enabled, it requires all collators to include their supported versions and capabilities in the block headers of the blocks they generate. Therefore, we need to set `version=1` and `capabilities=14`. In this case, we can accurately guess the correct serialization and create the BoC file directly by entering commands in Fift.

```
x{C400000001000000000000000E} s>c 2 boc+>B "config-param8.boc" B>file
```

（结果创建了一个包含所需值的30字节文件`config-param8.boc`。）

In more complicated cases, this may not be an option. Therefore, let's approach this example differently. 然而，在更复杂的情况下，这可能不是一个选项，所以让我们以不同的方式做这个例子。也就是说，我们可以检查源文件`crypto/smartcont/gen-zerostate.fif`和`crypto/smartcont/CreateState.fif`中的相关部分。

```
// version capabilities --
{ <b x{c4} s, rot 32 u, swap 64 u, b> 8 config! } : config.version!
1 constant capIhr
2 constant capCreateStats
4 constant capBounceMsgBody
8 constant capReportVersion
16 constant capSplitMergeTransactions
```

和

```
// version capabilities
1 capCreateStats capBounceMsgBody or capReportVersion or config.version!
```

We observe that `config.version!`, excluding the last `8 config!`, effectively accomplishes our goal. 我们看到，`config.version!`没有最后的`8 config!`实际上就是我们需要的，所以我们可以创建一个临时Fift脚本，例如，`create-param8.fif`：

```
#!/usr/bin/fift -s
"TonUtil.fif" include

1 constant capIhr
2 constant capCreateStats
4 constant capBounceMsgBody
8 constant capReportVersion
16 constant capSplitMergeTransactions
{ <b x{c4} s, rot 32 u, swap 64 u, b> } : prepare-param8

// create new value for config param #8
1 capCreateStats capBounceMsgBody or capReportVersion or prepare-param8
// check the validity of this value
dup 8 is-valid-config? not abort"not a valid value for chosen configuration parameter"
// print
dup ."Serialized value = " <s csr.
// save into file provided as first command line argument
2 boc+>B $1 tuck B>file
."(Saved into file " type .")" cr
```

现在，如果我们运行`fift -s create-param8.fif config-param8.boc`或者更好地从构建目录运行`crypto/create-state -s create-param8.fif config-param8.boc`，我们看到以下输出：

```
Serialized value = x{C400000001000000000000000E}
(Saved into file config-param8.boc)
```

我们获得与之前相同内容的30字节文件`config-param8.boc`。

To create a configuration proposal, we first need a file containing the desired value for the configuration parameter. Next, we execute the script `create-config-proposal.fif`, which is located in the `crypto/smartcont` directory of the source tree, using appropriate arguments. We recommend using `create-state` (found as `crypto/create-state` in the build directory) instead of `fift`. This is because `create-state` is a specialized version of Fift that performs additional blockchain related validity checks:

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

我们获得了一个要从主链上任何（钱包）智能合约以适量的Toncoin发送到配置智能合约的内部消息的正文。配置智能合约的地址可以通过在轻客户端中输入`getconfig 0`获得： To find the address of the configuration smart contract, you can enter the \`get config 0' command in the lite client:

```
> getconfig 0
ConfigParam(0) = ( config_addr:x5555555555555555555555555555555555555555555555555555555555555555)
x{5555555555555555555555555555555555555555555555555555555555555555}
```

We have the address of the configuration smart contract as `-1:5555...5555`. 我们看到配置智能合约的地址是`-1:5555...5555`。通过运行此智能合约的适当get方法，我们可以找出创建此配置提案所需的付款金额：

```
> runmethod -1:5555555555555555555555555555555555555555555555555555555555555555 proposal_storage_price 0 1100000 104 0

arguments:  [ 0 1100000 104 0 75077 ] 
result:  [ 2340800000 ] 
remote result (not to be trusted):  [ 2340800000 ] 
```

get方法`proposal_storage_price`的参数是关键标志位（本例中为0），此提案将处于活动状态的时间间隔（1.1百万秒），数据中的位总数（104）和cell引用（0）。后两个数量可以在`create-config-proposal.fif`的输出中看到。 The latter two quantities can be found in the output of `create-config-proposal.fif`.

To create this proposal, we need to pay 2.3408 Toncoins. It's advisable to add at least 1.5 Toncoins to cover the processing fees. Therefore, we will send a total of 4 Toncoins with the request (any excess Toncoins will be returned). 我们看到，创建此提案需要支付2.3408 Toncoin。最好添加至少1.5 Tonoin到消息中以支付处理费，所以我们打算发送4 Toncoin连同请求（所有多余的Toncoin将退回）。现在我们使用`wallet.fif`（或我们正在使用的钱包对应的Fift脚本）从我们的钱包向配置智能合约创建一个携带4 Toncoin和`config-msg-body.boc`中的正文的转账。这通常看起来像： This process typically looks like:

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

等待一段时间后，我们可以检查我们钱包的传入消息以检查来自配置智能合约的响应消息， Alternatively, if we are feeling lucky, we can directly inspect the list of all active configuration proposals by using the `list_proposals` method of the configuration smart contract.

```
> runmethod -1:5555555555555555555555555555555555555555555555555555555555555555 list_proposals
...
arguments:  [ 107394 ] 
result:  [ ([64654898543692093106630260209820256598623953458404398631153796624848083036321 [1586779536 0 [8 C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} -1] 112474791597373109254579258586921297140142226044620228506108869216416853782998 () 864691128455135209 3 0 0]]) ] 
remote result (not to be trusted):  [ ([64654898543692093106630260209820256598623953458404398631153796624848083036321 [1586779536 0 [8 C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} -1] 112474791597373109254579258586921297140142226044620228506108869216416853782998 () 864691128455135209 3 0 0]]) ] 
... caching cell FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC
```

我们可以看到，在所有活动配置建议列表中，正好有一个条目是由配对代表的。

```
[6465...6321 [1586779536 0 [8 C{FDCD...} -1] 1124...2998 () 8646...209 3 0 0]]
```

第一个数字`6465..6321`是配置提案的唯一标识符，等于其256位哈希。这对的第二个组成部分是一个元组，描述了此配置提案的状态。此元组的第一个组成部分是配置提案的过期Unix时间（`1586779546`）。第二个组成部分（`0`）是关键性标志。接下来是配置提案本身，由三元组`[8 C{FDCD...} The second component of this pair is a tuple that describes the status of the configuration proposal. The first part of this tuple indicates the expiration Unix time of the proposal (`1586779546`), while the second part (`0\`) acts as a criticality flag.

Next, we find the configuration proposal itself, which is expressed by the triple `[8 C{FDCD...} -1]`. In this notation, `8` represents the index of the configuration parameter to be modified, `C{FDCD...}` denotes the cell containing the new value (its hash is represented by the value that follows), and `-1` indicates the optional hash of the old value for this parameter (where `-1` means the old hash is not specified).

Following that, we encounter a large number, `1124...2998`, which identifies the current validator set. An empty list `()` is included to signify the set of all currently active validators who have voted for this proposal so far. Next is `weight_remaining`, equal to `8646...209`. This value is positive if the proposal has not yet garnered enough validator votes in this round, and negative otherwise.

Lastly, we see three numbers: `3 0 0`. These represent `rounds_remaining` (the proposal can survive at most three rounds, meaning changes to the current validator set), `wins` (the count of rounds in which the proposal received votes exceeding 3/4 of all validators by weight), and `losses` (the count of rounds where the proposal failed to secure 3/4 of all validator votes).

To inspect the proposed value for configuration parameter `#8`, you can ask the lite client to expand cell `C{FDCD...}` using its hash `FDCD...` or a sufficiently long prefix of this hash to uniquely identify the specific cell in question:

```
> dumpcell FDC
C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} =
  x{C400000001000000000000000E}
```

We observe that the value is `x{C400000001000000000000000E}`, which is the value we have incorporated into our configuration proposal. 我们看到该值为 `x{C400000001000000000000000E}`，这确实是我们嵌入到配置建议中的值。我们甚至可以要求精简版客户端将 Cell 显示为 TL-B 类型的值（`ConfigParam 8`）。

```
> dumpcellas ConfigParam8 FDC
dumping cells as values of TLB type (ConfigParam 8)
C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} =
  x{C400000001000000000000000E}
(
    (capabilities version:1 capabilities:14))
```

当我们考虑由其他人创建的配置提案时，这特别有用。

Each configuration proposal is identified by its unique 256-bit hash, represented by the large decimal number `6465...6321`. To check the current status of a specific configuration proposal, you can use the `get_proposal` method, providing the identifier of the configuration proposal as the only argument:

```
> runmethod -1:5555555555555555555555555555555555555555555555555555555555555555 get_proposal 64654898543692093106630260209820256598623953458404398631153796624848083036321
...
arguments:  [ 64654898543692093106630260209820256598623953458404398631153796624848083036321 94347 ] 
result:  [ [1586779536 0 [8 C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} -1] 112474791597373109254579258586921297140142226044620228506108869216416853782998 () 864691128455135209 3 0 0] ] 
```

我们得到了与之前基本相同的结果，但只针对一个配置方案，而且在开始时没有配置方案的标识符。

## 4.对配置提案进行表决

一旦创建了配置提案，它就应该在当前轮次中收集到超过3/4的当前验证者（按权重，即按股权）的投票，可能还要在几个后续轮次（选举的验证者集）中。通过这种方式，更改配置参数的决定必须得到不仅是当前验证者集，而且是几个后续验证者集的显著多数的批准。 This ensures that the decision to change a configuration parameter is approved by a significant majority, not only of the current set of validators but also of several future sets.

Voting for a configuration proposal is limited to the current validators listed (with their permanent public keys) in configuration parameter `#34`. The process is outlined below:

- 一个验证器的操作员会查找 "val-idx"，即其验证器在当前验证器集合中的索引（基于 0），该索引存储在配置参数 "#34 "中。

- 操作符会调用源代码树中目录 `crypto/smartcont` 中的特殊 Fift 脚本 `config-proposal-vote-req.fif` ，并将 `val-idx` 和 `config-proposal-id` 作为参数： They must indicate both `val-idx` and `config-proposal-id` as arguments:

  ```
      $ fift -s config-proposal-vote-req.fif -i 0 64654898543692093106630260209820256598623953458404398631153796624848083036321
      Creating a request to vote for configuration proposal 0x8ef1603180dad5b599fa854806991a7aa9f280dbdb81d67ce1bedff9d66128a1 on behalf of validator with index 0 
      566F744500008EF1603180DAD5B599FA854806991A7AA9F280DBDB81D67CE1BEDFF9D66128A1
      Vm90RQAAjvFgMYDa1bWZ-oVIBpkaeqnygNvbgdZ84b7f-dZhKKE=
      Saved to file validator-to-sign.req
  ```

- 之后，投票请求必须由当前验证器的私钥签名，使用与验证器连接的`validator-engine-console`中的`sign<validator-key-id> 566F744...28A1`。这一过程与 [Validator-HOWTO](/v3/guidelines/nodes/running-nodes/validator-node) 中描述的参与验证器选举的过程类似，但这次必须使用当前激活的密钥。 This process is similar to the steps described in the [Validator-HOWTO](/v3/guidelines/nodes/running-nodes/validator-node) for participating in validator elections; however, the currently active key must be used.

- Next, the `config-proposal-signed.fif` script is invoked. 接下来，需要调用另一个脚本 `config-proposal-signed.fif`。它的参数与 `config-proposal-req.fif` 类似，但它需要两个额外的参数：用于签署投票请求的公钥的 base64 表示和签名本身的 base64 表示。同样，这与 [Validator-HOWTO](/v3/guidelines/nodes/running-nodes/validator-node) 中描述的过程非常相似。 The process is again akin to what is described in the [Validator-HOWTO](/v3/guidelines/nodes/running-nodes/validator-node).

- 这样，就创建了包含内部信息正文的`vote-msg-body.boc`文件，其中包含对该配置提案的签名投票。

- 之后，`vote-msg-body.boc` 必须从驻留在主链上的任何智能合约（通常，将使用验证者的控制智能合约）的内部消息中携带，以及少量的 Toncoin 用于处理（通常，1.5  Toncoin 就足够了）。这与验证器选举过程中使用的程序完全类似。这通常是通过运行来实现的： This step follows the same procedure used during validator elections. The command is typically structured as follows:

  ```
  $ fift -s wallet.fif my_wallet_id -1:5555555555555555555555555555555555555555555555555555555555555555 1 1.5 -B vote-msg-body.boc
  ```

  (如果使用简单钱包来控制验证器），然后从精简版客户端发送生成的文件 `wallet-query.boc`：

    ```
    > sendfile wallet-query.boc
    ```

- 您可以监控从配置智能合约到控制智能合约的应答消息，以了解投票查询的状态。另外，您还可以通过配置智能合约的 get-method `show_proposal` 来查看配置建议的状态： Alternatively, you can inspect the status of the configuration proposal by using the `get-method` `show_proposal` of the configuration smart contract:

  ```
  > runmethod -1:5555555555555555555555555555555555555555555555555555555555555555 get_proposal 64654898543692093106630260209820256598623953458404398631153796624848083036321
  ...
  arguments:  [ 64654898543692093106630260209820256598623953458404398631153796624848083036321 94347 ] 
  result:  [ [1586779536 0 [8 C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} -1] 112474791597373109254579258586921297140142226044620228506108869216416853782998 (0) 864691128455135209 3 0 0] ]
  ```

  In this output, the list of indices for validators that voted for this configuration proposal should not be empty and must include the index of your validator. For example, if the list contains (`0`), it indicates that only the validator with index `0` in configuration parameter `#34` has voted. If this list grows, the second-to-last integer (the first zero in `3 0 0`) in the proposal status will increase, reflecting another win for this proposal. If the number of wins reaches or exceeds the value indicated in configuration parameter `#11`, the configuration proposal is automatically accepted, and the proposed changes take effect immediately.

  Conversely, when the validator set changes, the list of validators that have already voted will become empty, the `rounds_remaining` value (currently three in `3 0 0`) will decrease by one, and if it becomes negative, the configuration proposal will be destroyed. If the proposal is not destroyed and has not won in the current round, the number of losses (the second zero in `3 0 0`) will increase. If this number exceeds the value specified in configuration parameter `#11`, the configuration proposal will be rejected.

## 5.对配置提案进行表决的自动方式

The automation provided by the command `createelectionbid` in `validator-engine-console` facilitates participation in validator elections. Similarly, both `validator-engine` and `validator-engine-console` automate most of the steps mentioned in the previous section, allowing you to generate a `vote-msg-body.boc` that can be used with the controlling wallet.

与 `validator-engine-console` 的 `createelectionbid` 命令提供的参与验证选举的自动化类似，`validator-engine` 和 `validator-engine-console` 提供了一种自动化的方法来执行上一节中解释的大部分步骤，生成一个 `vote-msg-body.boc` 以供控制钱包使用。为了使用这种方法，你必须将 Fift 脚本 `config-proposal-vote-req.fif` 和 `config-proposal-vote-signed.fif` 安装到验证引擎用来查找 `validator-elect-req.fif` 和 `validator-elect-signed.fif` 的同一目录下（如 [Validator-HOWTO](/v3/guidelines/nodes/running-nodes/validator-node) 第 5 节所解释）。之后，只需运行 Once you have those files set up, you can create the `vote-msg-body.boc` by executing the following command in the validator-engine-console:

```
    createproposalvote 64654898543692093106630260209820256598623953458404398631153796624848083036321 vote-msg-body.boc
```

在 validator-engine-console 中创建包含内部信息正文的 `vote-msg-body.boc` 以发送给配置智能合约。

## 6.升级配置智能合约和选举人智能合约的代码

It may be necessary to upgrade the code of either the configuration smart contract or the elector smart contract. To do this, we will use the same mechanism described previously. The new code must be stored in a reference of a value cell, and this value cell should be proposed as the new value for the configuration parameter `-1000` (for upgrading the configuration smart contract) or `-1001` (for upgrading the elector smart contract). These parameters are considered critical, so a significant number of validator votes will be required to make changes to the configuration smart contract, similar to adopting a new constitution. We anticipate that such changes will first be tested in a test network and discussed in public forums before each validator operator makes their decision to vote for or against the proposed changes.

Alternatively, critical configuration parameters `0` (which indicates the address of the configuration smart contract) or `1` (which indicates the address of the elector smart contract) can be changed to other values, provided that these values match existing and correctly initialized smart contracts. Specifically, the new configuration smart contract must contain a valid configuration dictionary in the first reference of its persistent data. Since transferring changing data—such as the list of active configuration proposals or the previous and current participant lists of validator elections—between different smart contracts can be complicated, it is generally more beneficial to upgrade the code of an existing smart contract rather than change the address of the configuration smart contract.

There are two auxiliary scripts designed to create configuration proposals for upgrading the code of the configuration or elector smart contract. The script `create-config-upgrade-proposal.fif` loads a Fift assembler source file (`auto/config-code.fif` by default), which corresponds to the code automatically generated by the FunC compiler from `crypto/smartcont/config-code.fc`, and creates the corresponding configuration proposal for the configuration parameter `-1000`. Similarly, the script `create-elector-upgrade-proposal.fif` loads a Fift assembler source file (`auto/elector-code.fif` by default) and uses it to create a configuration proposal for configuration parameter `-1001`. This makes it simple to create configuration proposals to upgrade either of these two smart contracts.

However, it is also essential to publish the modified FunC source code of the smart contract and specify the exact version of the FunC compiler used for compilation. This way, all validators (or their operators) will be able to reproduce the code in the configuration proposal, compare the hashes, and examine the source code and changes before deciding how to vote on the proposed changes. <Feedback />

