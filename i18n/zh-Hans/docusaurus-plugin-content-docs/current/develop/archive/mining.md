# TON 挖矿指南

:::warning deprecated
此信息可能已过时，不再有效。可以忽略它。
:::

## <a id="introduction"></a>简介
本文档提供了使用PoW提供者挖掘Toncoin的过程介绍。请访问[ton.org/mining](https://ton.org/mining)以获取TON挖矿的最新状态。

## <a id="quick-start"></a>快速开始
立即开始挖矿：

1. 获取[适用于挖矿的计算机](#hardware)。
2. 安装[Ubuntu](https://ubuntu.com) 20.04桌面或服务器发行版。
3. 在`lite`模式下安装[mytonctrl](https://github.com/igroman787/mytonctrl#installation-ubuntu)。
4. 运行`mytonctrl`中的`emi`命令，检查您的硬件和[预期挖矿收入](#faq-emi)。
5. 如果您还没有钱包地址，请使用其中一个[钱包](https://www.ton.org/wallets)创建`钱包地址`。
6. 通过在`mytonctrl`中执行`set minerAddr "..."`命令，将您的`钱包地址`定义为挖矿目标。
7. 从[ton.org/mining](https://ton.org/mining)上提供的列表中选择一个giver合约，并通过在`mytonctrl`中执行`set powAddr "..."`命令设置您的miner以挖掘它。
8. 通过在`mytonctrl`中执行`mon`命令开始挖矿。
9. 检查您计算机上的CPU负载；名为`pow-miner`的进程应使用您大部分的CPU。
10. 等待好运；第4步的输出应该告诉您挖到一个区块的大致几率。

## <a id="basics"></a>基础知识
Toncoin通过所谓的`PoW Givers`（工作量证明提供者）进行分发，它们是分配了一定数量TON的智能合约。目前，TON网络上有10个活跃的PoW giver。Giver每次分发100 TON的币。为了接收这样一个块，您的计算机需要解决giver发布的复杂数学挑战，并且要尽可能快地完成；您将与其他矿工竞争100 TON的奖励。如果有人在您之前解决了问题，您的机器所做的所有工作都将作废，新的一轮/竞赛开始。

重要的是要理解，挖矿的收益不是随着机器工作而“逐渐增加”的，而是每成功解决一个giver挑战就以100 TON的批次形式出现。这意味着，如果您的机器有在24小时内计算出一个区块的10%机会（见[快速开始](#quickStart)的第4步），那么您可能需要等待大约10天时间才能获得100 TON的奖励。

挖矿过程在很大程度上由`mytonctrl`自动化。关于挖矿过程的详细信息可以在[PoW givers](https://www.ton.org/#/howto/pow-givers)文档中找到。

## <a id="advanced"></a>高级
如果您认真对待挖矿并希望操作多台机器/矿场，那么您真的需要了解TON以及挖矿的工作原理；请参阅[HOWTO](https://ton.org/#/howto/)部分以获取深入信息。以下是一些通用建议：

* **应该**在单独的机器上运行您自己的节点/轻服务器；这将确保您的矿场不依赖于可能发生故障或无法及时处理您的查询的外部轻服务器。
* **不要**用`get_pow_params`查询轰炸公共轻服务器，如果您有高频率轮询giver状态的自定义脚本，您**必须**使用您自己的轻服务器。违反此规则的客户端可能会导致其IP在公共轻服务器上被列入黑名单。
* **应该**尝试了解[挖矿过程](https://www.ton.org/#/howto/pow-givers)的工作原理；大多数大型矿工使用自己的脚本，在多个挖矿机器的环境中提供比`mytonctrl`更多的优势。

## <a id="hardware"></a>矿工硬件
TON挖矿的总网络哈希率非常高；如果矿工希望成功，他们需要高性能的机器。在标准家用计算机和笔记本电脑上挖矿是徒劳的，我们不建议尝试。

#### CPU
支持[Intel SHA扩展](https://zh.wikipedia.org/wiki/Intel_SHA_extensions)的现代CPU是**必须的**。大多数矿工使用至少32核心和64线程的AMD EPYC或Threadripper系列机器。

#### GPU
是的！您可以使用GPU挖TON。有一个PoW矿工版本能够使用Nvidia和AMD GPU；您可以在[POW Miner GPU](https://github.com/tontechio/pow-miner-gpu/blob/main/crypto/util/pow-miner-howto.md)库中找到代码和使用说明。

目前，需要技术熟练才能使用这个，但我们正在开发更用户友好的解决方案。

#### 内存
几乎整个挖矿过程都发生在CPU的L2缓存中。这意味着内存速度和大小在挖矿性能中没有作用。一个只在一个内存通道上装有单个DIMM的双AMD EPYC系统将与占用所有通道的16个DIMM挖矿一样快地。

请注意，这**只**适用于普通挖矿过程，如果您的机器还运行全节点或其他进程，那么情况会改变！但这超出了本指南的范围。

#### 存储
以lite模式运行的普通矿工使用最少的空间，并且不在存储中存储任何数据。

#### 网络
普通矿工需要能够打开对外的互联网连接。

#### FPGA / ASIC
参见[我可以使用FPGA / ASIC吗？](#faq-hw-asic)

### <a id="hardware-cloud"></a>云机器
许多人使用AWS或Google计算云机器进行挖矿。如上所述，真正重要的是CPU。因此，我们建议AWS [c5a.24xlarge](https://aws.amazon.com/ec2/instance-types/c5/)或Google [n2d-highcpu-224](https://cloud.google.com/compute/vm-instance-pricing)实例。

### <a id="hardware-estimates"></a>收入估算
计算收入的公式非常简单：`($total_bleed / $total_hashrate) * $your_hashrate`。这将给您**当前**的估算。您可以在[ton.org/mining](https://ton.org/mining)上找到这些变量，也可以在`mytonctrl`中使用估算挖矿收入计算器（`emi`命令）。以下是2021年8月7日使用i5-11400F CPU进行的样本输出：
```
Mining income estimations
-----------------------------------------------------------------
Total network 24h earnings:         171635.79 TON
Average network 24h hashrate:       805276100000 HPS
Your machine hashrate:              68465900 HPS
Est. 24h chance to mine a block:    15%
Est. monthly income:                437.7 TON
```

**重要**：请注意，所提供的信息基于*执行时刻的网络哈希率*。您实际的长期收入将取决于许多因素，例如不断变化的网络哈希率、选择的giver以及好运。

## <a id="faq"></a>常见问题解答
### <a id="faq-general"></a>一般
#### <a id="faq-general-posorpow"></a>TON是PoS还是PoW网络？
TON区块链使用权益证明（Proof-of-Stake）共识。挖矿不是生成新块所必需的。
#### <a id="faq-general-pow"></a>那TON为什么是工作量证明（Proof-of-Work）？
原因是最初的50亿Toncoin被转移到临时工作量证明提供者智能合约中。
挖矿用于从这个智能合约中获取Toncoin。
#### <a id="faq-general-supply"></a>还有多少币可以挖？
最新信息可在[ton.org/mining](https://ton.org/mining)上找到，参见`bleed`图表。PoW Giver合约有其限制，一旦用户挖出所有可用的Toncoin，它们就会枯竭。
#### <a id="faq-general-mined"></a>到目前为止已经挖出多少币？
截至2021年8月，约有49亿Toncoin被挖出。
#### <a id="faq-general-whomined"></a>谁挖出了这些币？
这些币被挖到超过70,000个钱包中，这些钱包的所有者是未知的。
#### <a id="faq-general-elite"></a>开始挖矿难吗？
一点也不难。您所需要的是[合适的硬件](#hardware)和按照[快速开始](#quickStart)部分中概述的步骤操作。
#### <a id="faq-general-pissed"></a>还有其他方式挖矿吗？
是的，有一个第三方应用——[TON Miner Bot](https://t.me/TonMinerBot)。
#### <a id="faq-general-stats"></a>我在哪里可以看到挖矿统计？
[ton.org/mining](https://ton.org/mining)
#### <a id="faq-general-howmany"></a>有多少矿工？
我们无法说出这个数字。我们所知道的是网络上所有矿工的总哈希率。然而，在[ton.org/mining](https://ton.org/mining)上有图表试图估算提供近似总哈希率的某种类型机器的数量。
#### <a id="faq-general-noincome"></a>我需要Toncoin才能开始挖矿吗？
不，您不需要。任何人都可以在不拥有任何Toncoin的情况下开始挖矿。
#### <a id="faq-mining-noincome"></a>我挖了几个小时，为什么我的钱包总额没有增加，甚至没有增加1 TON？
TON在区块中是以每100进行开采的，你要么猜中一个区块并获得100 TON，要么一无所获。请参见[基础知识](#basics)。
#### <a id="faq-mining-noblocks"></a>我挖了几天，为什么看不到结果？
您检查了当前的[收入估算](#hardware-estimates)了吗？如果`Est. 24h chance to mine a block`字段小于100%，那么您需要耐心等待。另外，请注意，24小时内挖到一个块的50%几率并不自动意味着您将在2天内挖到一个块；每天分别适用50%。
#### <a id="faq-mining-pools"></a>有挖矿池吗？
截至目前，还没有挖矿池的实现，每个人都为自己挖矿。
#### <a id="faq-mining-giver"></a>我应该挖哪个giver？
您选择哪个giver并不真正重要。难度在每个giver上都会波动，所以[ton.org/mining](https://ton.org/mining)上当前最简单的giver可能在一个小时内变得最复杂。反之亦然。
### <a id="faq-hw"></a>硬件
#### <a id="faq-hw-machine"></a>更快的机器是否总是胜出？
不，所有矿工采取不同的途径来找到解决方案。更快的机器成功的概率更高，但并不保证胜利！
#### <a id="faq-hw-machine"></a>我的机器能产生多少收入？
请参见[收入估算](#hardware-estimates)。
#### <a id="faq-hw-asic"></a>我能用我的BTC/ETH装置来挖TON吗？
不，TON使用单个SHA256散列方法，与BTC、ETH等不同。为挖其他加密货币而构建的ASIC或FPGA将不起作用。
#### <a id="faq-hw-svsm"></a>一台快速机器还是几台慢机器更好？
这是有争议的。见：矿工软件为系统上的每个核心启动线程，每个核心都获得自己要处理的密钥集，所以如果您有一台能运行64线程的机器和4台能各自运行16线程的机器，那么它们将在成功方面完全相同，假设每个线程的速度相同。

然而，在现实世界中，核心数量较少的CPU通常时钟频率更高，所以您可能会用多台机器取得更好的成绩。
#### <a id="faq-hw-mc"></a>如果我运行多台机器，它们会合作吗？
不，它们不会。每台机器各自挖矿，但寻找解决方案的过程是随机的：没有机器，甚至没有单个线程（见上文）会采取相同的路径。因此，它们的哈希率加起来对你有利，而无需直接合作。
#### <a id="faq-hw-CPU"></a>我可以使用ARM CPU挖矿吗？
这取决于CPU，AWS Graviton2实例确实是非常有能力的miner，并能够在性价比方面与基于AMD EPYC的实例相媲美。
### <a id="faq-software"></a>软件
#### <a id="faq-software-os"></a>我可以使用Windows/xBSD/其他操作系统挖矿吗？
当然，[TON源代码](https://github.com/ton-blockchain/ton)已知可以在Windows、xBSD和其他操作系统上构建。然而，没有像Linux下的`mytonctrl`那样舒适的自动安装，您需要手动安装软件并创建自己的脚本。对于FreeBSD，有一个[port](https://github.com/sonofmom/freebsd_ton_port)源代码允许快速安装。
#### <a id="faq-software-node1"></a>如果我以完整节点模式运行mytonctrl，我的挖矿会变得更快吗？
计算过程本身不会变快，但如果您操作自己的完整节点/轻服务器，您将获得一些稳定性和最重要的是灵活性。
#### <a id="faq-software-node2"></a>我需要什么/如何操作一个完整节点？
这超出了本指南的范围，请参阅[完整节点howto](https://ton.org/#/howto/full-node)和/或[mytonctrl说明](https://github.com/igroman787/mytonctrl)。
#### <a id="faq-software-build"></a>你能帮我在我的操作系统上构建软件吗？
这超出了本指南的范围，请参阅[完整节点howto](https://ton.org/#/howto/full-node)以及[Mytonctrl安装脚本](https://github.com/igroman787/mytonctrl/blob/master/scripts/toninstaller.sh#L44)，以获取有关依赖项和过程的信息。
