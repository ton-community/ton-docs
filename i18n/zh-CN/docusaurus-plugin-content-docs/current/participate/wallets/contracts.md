# 钱包合约类型

您可能在某处听说过TON区块链中不同版本的钱包。但这些版本实际上意味着什么，它们之间有何不同？

在本文中，我们将研究TON钱包的所有版本和修改。

## 钱包有何不同？

在我们开始之前，我们需要理解钱包究竟能有何不同。

如果我们看一下以太坊、Solana或几乎任何其他区块链，都没有不同类型或版本的钱包。但为什么TON中会存在它们呢？这是因为TON中的钱包是通过智能合约制作的。基本上，任何钱包（甚至是您的钱包）都是在TON区块链上运行的智能合约，它可以接受和发送交易到其他也是智能合约的钱包。

这些智能合约可以以不同的方式设置，并且可以具有不同的功能。这就是为什么TON中有几个版本的钱包。

## 基础钱包

### 钱包V1

这是最简单的一个。它只允许您一次发送一笔交易，除了您的签名和序列号(seqno)，它不检查任何东西。

这个版本甚至没有在常规应用中使用，因为它存在一些主要问题：
 - 无法从合约中轻松检索序列号和公钥
 - 没有`valid_until`检查，所以您不能确定交易不会太晚被确认。

第一个问题在`V1R2`和`V1R3`中得到修复。`R`字母代表`修订版本`。通常修订版本只是添加get方法，允许您从合约中检索序列号和公钥。
但这个版本还有第二个问题，这个问题在下一个版本中得到修复。

钱包源代码：
 * [ton/crypto/smartcont/wallet-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-code.fc)

### 钱包V2

这个版本引入了`valid_until`参数，用于设置交易的时间限制，以防您不希望交易太晚被确认。这个版本也没有公钥的get方法，它在`V2R2`中被添加。

它在大多数情况下都可以使用，但它缺少`V3`中添加的一个酷功能。

钱包源代码：
 * [ton/crypto/smartcont/new-wallet-v2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet-v2.fif)

### 钱包V3

这个版本引入了`subwallet_id`参数，允许您使用同一个公钥创建多个钱包（所以您可以只有一个种子短语和很多钱包）。和以前一样，`V3R2`只添加了公钥的get方法。

基本上，`subwallet_id`只是在部署时添加到合约状态的一个数字。由于TON中的合约地址是其状态和代码的哈希，所以不同的`subwallet_id`将会改变钱包地址。

这个版本目前是最常用的。它涵盖了大多数用例，同时保持简洁和简单。

钱包源代码：
 * [ton/crypto/smartcont/wallet-v3-code.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-v3-code.fif)

### 钱包V4

它是目前最现代的钱包版本。它仍然具有之前版本的所有功能，但还引入了一些非常强大的东西——`插件`。

这个功能允许开发者实现与用户钱包并行工作的复杂逻辑。例如，某些DApp可能需要用户每天支付少量币以使用某些功能，因此用户需要通过签署交易在其钱包上安装插件。这个插件将在每天接收外部消息时向目的地址发送币。

这是一个非常可定制的功能，是TON区块链独有的。

钱包源代码：
 * [ton-blockchain/wallet-contract](https://github.com/ton-blockchain/wallet-contract)

## 特殊钱包

有时基础钱包的功能不够。这就是为什么有几种类型的专用钱包：`高负载`、`锁定`和`受限`。

让我们来看看它们。

### 高负载钱包

这种钱包适用于那些需要在短时间内发送数百笔交易的人。例如，加密货币交易所。

它允许您在一次智能合约调用中发送多达`254`笔交易。它还使用了一种与序列号不同的方法来解决重放攻击，因此您可以同时多次调用这个钱包，以在一秒钟内发送成千上万笔交易。

:::caution 限制
注意，在处理高负载钱包时，需要检查并考虑以下限制。
:::

1. **存储大小限制。** 当前，合约存储的大小应小于65535个cell。如果old_queries的大小超过此限制，将在 Action Phase 中抛出异常，交易将失败。
失败的交易可能会重播。
2. **Gas限制。** 当前，Gas限制为1'000'000 GAS单位，这意味着一次交易中可以清理过期查询的数量有限。如果过期查询的数量过多，合约将卡住。

这意味着不建议设置过高的过期时间：
过期时间跨度内的查询数量不应超过1000。

此外，一次交易中清理的过期查询数量应低于100。

钱包源代码：
 * [ton/crypto/smartcont/highload-wallet-v2-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet-v2-code.fc)

### 锁定钱包

如果您出于某种原因需要在一段时间内锁定钱包中的币，而在这段时间过去之前无法取出它们，请看看锁定钱包。

它允许您设置一个时间，直到那时您将无法从钱包中提取任何东西。您还可以通过设置解锁期来定制它，以便在这些设定的期间内您将能够花费一些币。

例如：您可以创建一个钱包，其中持有100万个币，总归属时间为10年。设置悬崖期为一年，这样在创建钱包后的第一年内资金将被锁定。然后，您可以将解锁期设置为一个月，所以`1'000'000 TON / 120个月 = ~8333 TON`将每月解锁。

钱包源代码：
 * [ton-blockchain/lockup-wallet-contract](https://github.com/ton-blockchain/lockup-wallet-contract)

### 受限钱包

这个钱包的功能是像普通钱包一样工作，但将转账限制为只能到一个预先定义的目的地地址。您可以在创建这个钱包时设置目的地，然后您将只能将资金从它转移到那个地址。但请注意，您仍然可以将资金转移到验证合约，因此您可以用这个钱包运行验证者。

钱包源代码：
 * [EmelyanenkoK/nomination-contract/restricted-wallet](https://github.com/EmelyanenkoK/nomination-contract/tree/master/restricted-wallet)

## 结论

如您所见，TON中有许多不同版本的钱包。但在大多数情况下，您只需要`V3R2`或`V4R2`。如果您想拥有一些额外的功能，如资金定期解锁，您也可以使用其中一个特殊钱包。

## 参阅

 - [基础钱包的来源](https://github.com/ton-blockchain/ton/tree/master/crypto/smartcont)
 - [版本的更多技术描述](https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md)
 - [钱包V4源代码和详细描述](https://github.com/ton-blockchain/wallet-contract)
 - [锁定钱包源代码和详细描述](https://github.com/ton-blockchain/lockup-wallet-contract)
 - [受限钱包源代码](https://github.com/EmelyanenkoK/nomination-contract/tree/master/restricted-wallet)
