# 智能合约地址

本节将描述TON区块链上智能合约地址的特点，并解释在TON上，actor与智能合约是如何等同的。

## 一切皆为智能合约

在TON上，智能合约是使用[Actor模型](/learn/overviews/ton-blockchain#single-actor)构建的。实际上，在TON中的actor在技术上是以智能合约的形式表示的。这意味着，即使您的钱包也是一个简单的actor（以及一个智能合约）。

通常，actor处理传入消息，改变其内部状态，并生成传出消息。这就是为什么TON区块链上的每一个actor（即智能合约）都必须有一个地址，以便能够从其他actor接收消息。

:::info 以太坊虚拟机(EVM)
在以太坊虚拟机(EVM)上，地址与智能合约完全分离。欢迎阅读Tal Kol的文章["TON 区块链的六个独特之处，会让 Solidity 开发者感到惊讶"](https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers) 了解更多差异。
:::

## 智能合约的地址

在TON上运行的智能合约地址通常包含两个主要组成部分：

* **(workchain_id)**：代表工作链ID（一个有符号的32位整数）

* **(account_id)** 代表账户的地址（根据工作链不同，为64-512位，）

在本文档的原始地址概述部分，我们将讨论**(workchain_id, account_id)** 是如何呈现。

### 工作链ID和账户ID

#### 工作链ID

[正如我们之前所见](/learn/overviews/ton-blockchain#workchain-blockchain-with-your-own-rules)，在TON区块链上可以创建多达`2^32`个工作链。我们还注意到，32位前缀的智能合约地址用于识别并链接到不同工作链中的智能合约地址。这允许智能合约在TON区块链的不同工作链之间发送和接收消息。

如今，TON区块链中仅运行主链（workchain_id=-1）和不定期地运行基本工作链（workchain_id=0）。

它们都有256位地址，因此，我们假设workchain_id是0或-1，工作链中的地址正好是256位。

#### 账户ID

TON的所有账户ID都在主链和基本链（或基本工作链）上使用256位地址。

实际上，账户ID **(account_id)** 被定义为智能合约对象的哈希函数（专指SHA-256）。每个在TON区块链上运行的智能合约都存储两个主要组件。这些包括：

1. _编译后的代码_。智能合约的逻辑以字节码形式编译。
2. _初始状态_。合约在链上部署时的值。

最后，为了准确地推导出合约的地址，需要计算与**（初始代码，初始状态）** 对象相对应的哈希。目前，我们不会深入研究[TVM](/learn/tvm-instructions/tvm-overview)的工作方式，但重要的是要理解TON上的账户ID是使用这个公式确定的：
:
**account_id = hash（初始代码，初始状态）**

随着本文档的深入，我们将进一步深入技术规格和TVM及TL-B方案的概述。现在我们熟悉了**account_id**的生成以及它们与TON上智能合约地址的交互，接下来让我们解释什么是原始地址和用户友好地址。

## 原始地址和用户友好地址

在简要概述了TON上的智能合约地址是如何利用工作链和账户ID（特别是对于主链和基本链）之后，那重要的是要理解这些地址以下面两种主要格式表示：

* **原始地址**：智能合约地址的原始完整表示。
* **用户友好地址**：用户友好地址是原始地址的增强格式，有更好的安全性和易用性。

以下，我们将更详细地解释这两种地址类型的区别，并深入探讨TON上使用用户友好地址的原因。

### 原始地址

原始智能合约地址由工作链ID和账户ID组成*(workchain_id, account_id)*，并以以下格式显示：

* [十进制workchain_id\]：[64个十六进制数字的account_id\]

以下是一个使用工作链ID和账户ID的原始智能合约地址示例（表示为**workchain_id**和**account_id**）：

`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

注意地址字符串开始的`-1`，表示属于主链的_workchain_id_。

:::note
地址字符串中可以使用大写字母（如 'A'、'B'、'C'、'D'等）替代其小写的对应字母（如 'a'、'b'、'c' 'd'等）。
:::

#### 原始地址的问题

使用原始地址形式存在两个主要问题：

1. 在使用原始地址格式时，无法在发送交易前验证地址以消除错误。
   这意味着，如果您在发送交易前不小心在地址字符串中添加或删除字符，您的交易将被发送到错误的目的地，导致资金损失。
2. 在使用原始地址格式时，无法添加像使用用户友好地址时发送交易所用的特殊标志位。
   为了帮助您更好地理解这个概念，我们将在下面解释可以使用哪些标志位。

### 用户友好地址

用户友好地址是为了保护和简化在互联网上（例如，在公共消息平台上或通过电子邮件服务提供商）以及现实世界中分享地址的TON用户的体验而开发的。

#### 用户友好地址结构

用户友好地址总共由36个字节组成，按顺序生成以下组件：

1. _[标志位 - 1字节]_ — 附加到地址的标志位会改变智能合约对收到的消息的反应。
   使用用户友好地址格式的标志位类型包括：

   - isBounceable。表示可弹回或不可弹回的地址类型。(_0x11_ 表示“可弹回”，_0x51_ 表示“不可弹回”)
   - isTestnetOnly。表示仅用于测试网的地址类型。以_0x80_ 开头的地址不应被生产网络上运行的软件接受
   - isUrlSafe。表示已定义为地址的URL安全的已弃用标志位。所有地址都被认为是URL安全的。
2. _\[workchain_id - 1字节]_ — 工作链ID (_workchain_id_) 由一个有符号的8位整数 _workchain_id_ 定义。  
(_0x00_ 表示基本链，_0xff_ 表示主链)
3. _\[account_id - 32字节]_ — 账户ID由工作链中的256位（[大端序](https://www.freecodecamp.org/news/what-is-endianness-大端-vs-little-endian/)）地址组成。
4. _\[地址验证 - 2字节]_ — 在用户友好地址中，地址验证由前34个字节的CRC16-CCITT签名组成。([示例](https://github.com/andreypfau/ton-kotlin/blob/ce9595ec9e2ad0eb311351c8a270ef1bd2f4363e/ton-kotlin-crypto/common/src/crc32.kt))
   实际上，用户友好地址的验证思想与所有信用卡上使用的[Luhn算法](https://en.wikipedia.org/wiki/Luhn_algorithm)类似，以防止用户错误输入不存在的卡号。

这4个主要组件的总计`1 + 1 + 32 + 2 = 36`字节（每个用户友好地址）。

要生成用户友好地址，开发者必须使用以下方式对所有36个字节进行编码：
- _base64_（即数字、大小写拉丁字母、'/' 和 '+'）
- _base64url_（用 '_' 和 '-' 代替 '/' 和 '+'）

完成这个过程后，会生成一个长度为48个非空格字符的用户友好地址。

:::info DNS地址标志位
在TON上，有时使用诸如mywallet.ton之类的DNS地址，而不是原始和用户友好地址。实际上，DNS地址由用户友好地址组成，并包括所有必需的标志位，允许开发者从TON域中的DNS记录访问所有标志位。
:::

#### 用户友好地址编码示例

例如，“测试赠予者”智能合约（一个特殊的智能合约，位于测试网主链中，向任何请求者发送2个测试代币）使用以下原始地址：

`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

上述“测试赠予者”的原始地址必须转换为用户友好地址形式。这可以通过使用之前介绍的base64或base64url形式来获得，如下所示：

* `kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYIny` (base64)
* `kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny` (base64url)

:::info
注意，_base64_ 和 _base64url_ 两种形式都是有效的，都会被接受！
:::

#### 可弹回与不可弹回地址

可弹回地址标志位背后的核心思想是发件人资金的安全。

例如，如果目标智能合约不存在，或者在交易过程中发生某些问题，消息将被“弹回”给发件人，并包括交易原始价值的剩余部分（减去所有转账和燃料费）。这确保了发件人不会因意外发送到无法接受交易的地址而损失资金。

关于可弹回地址特别说明：

1. **bounceable=false** 标志位通常意味着接收者是一个钱包。
2. **bounceable=true** 标志位通常表示具有自己应用逻辑的自定义智能合约（例如，DEX）。在这个例子中，因为安全原因不应发送非弹回消息。

请阅读我们的文档以更好地了解[不可弹回消息](/develop/smart-contracts/guidelines/non-bouncable-messages)。

#### base64加固型表示

TON区块链相关的附加二进制数据采用类似的"加固型" base64 用户友好地址表示。它们根据字节标签的前4个字符来进行区分。例如，256位Ed25519公钥通过以下顺序创建的36字节序列来表示：

- 使用_0x3E_格式的单字节标签表示公钥
- 使用_0xE6_格式的单字节标签表示Ed25519公钥
- 32字节标签含标准二进制表示的Ed25519公钥
- 2字节标签含大端序表示的前34字节的CRC16-CCITT

获得的36字节序列会转换为标准方式的48字符base64或base64url字符串。例如，Ed25519公钥`E39ECDA0A7B0C60A7107EC43967829DBE8BC356A49B9DFC6186B3EAC74B5477D`（通常由32字节序列表示，例如：`0xE3, 0x9E, ..., 0x7D`）通过“加固型”表示呈现如下：

`Pubjns2gp7DGCnEH7EOWeCnb6Lw1akm538YYaz6sdLVHfRB2`

### 用户友好地址和原始地址的转换

转换用户友好和原始地址的最简单方式是使用几个TON API和其他工具，包括：

* [ton.org/address](https://ton.org/address)
* [toncenter主网的API方法](https://toncenter.com/api/v2/#/accounts/pack_address_packAddress_get)
* [toncenter测试网的API方法](https://testnet.toncenter.com/api/v2/#/accounts/pack_address_packAddress_get)

此外，使用JavaScript为钱包转换用户友好和原始地址有两种方式：

* [使用ton.js转换地址的形式，从/到用户友好或原始形式](https://github.com/ton-org/ton-core/blob/main/src/address/Address.spec.ts)
* [使用tonweb转换地址的形式，从/到用户友好或原始形式](https://github.com/toncenter/tonweb/tree/master/src/utils#address-class)

还可以使用[SDKs](/develop/dapps/apis/sdk)进行类似的转换。
