import Feedback from '@site/src/components/Feedback';

# 智能合约的地址

本节将描述TON区块链上智能合约地址的特点，并解释在TON上，actor与智能合约是如何等同的。 It also explains how actors are synonymous with smart contracts on TON.

## 一切皆为智能合约

在TON上，智能合约是使用[Actor模型](/learn/overviews/ton-blockchain#single-actor)构建的。实际上，在TON中的actor在技术上是以智能合约的形式表示的。这意味着，即使您的钱包也是一个简单的actor（以及一个智能合约）。 In fact, actors on TON are technically represented as smart contracts. This means that even your wallet is a simple actor (and a smart contract).

Typically, actors process incoming messages, change their internal states, and generate outbound messages as a result. 通常，actor处理传入消息，改变其内部状态，并生成传出消息。这就是为什么TON区块链上的每一个actor（即智能合约）都必须有一个地址，以便能够从其他actor接收消息。

:::info EVM EXPERIENCE
On the Ethereum Virtual Machine (EVM), addresses are completely separate from smart contracts. 在以太坊虚拟机(EVM)上，地址与智能合约完全分离。欢迎阅读Tal Kol的文章["TON 区块链的六个独特之处，会让 Solidity 开发者感到惊讶"](https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers) 了解更多差异。
:::

## 智能合约地址

在TON上运行的智能合约地址通常包含两个主要组成部分：

- **(workchain_id)**：代表工作链ID（一个有符号的32位整数）

- **(account_id)** 代表账户的地址（根据工作链不同，为64-512位，）

在本文档的原始地址概述部分，我们将讨论\*\*(workchain_id, account_id)\*\* 是如何呈现。

### 工作链ID

#### 工作链ID和账户ID

[正如我们之前所见](/learn/overviews/ton-blockchain#workchain-blockchain-with-your-own-rules)，在TON区块链上可以创建多达`2^32`个工作链。我们还注意到，32位前缀的智能合约地址用于识别并链接到不同工作链中的智能合约地址。这允许智能合约在TON区块链的不同工作链之间发送和接收消息。 We also noted how 32-bit prefix smart contract addresses identify and are linked to smart contract addresses within different workchains. This allows smart contracts to send and receive messages to and from different workchains on TON Blockchain.

如今，TON区块链中仅运行主链（workchain_id=-1）和不定期地运行基本工作链（workchain_id=0）。

它们都有256位地址，因此，我们假设workchain_id是0或-1，工作链中的地址正好是256位。

#### 账户ID

TON的所有账户ID都在主链和基本链（或基本工作链）上使用256位地址。

In fact, an Account ID (**account_id**) is defined as the result of applying a hash function (specifically SHA-256) to a smart contract object. Every smart contract operating on the TON Blockchain stores two main components:

1. _Compiled code_. _编译后的代码_。智能合约的逻辑以字节码形式编译。
2. _Initial state_. The contract's values at the moment it is deployed on-chain.

To derive the contract's address, you calculate the hash of the **(Initial code, Initial state)** pair. We won’t explore how the [TVM](/v3/documentation/tvm/tvm-overview) works at this time, but it is important to understand that account IDs on TON follow this formula:

实际上，账户ID **(account_id)** 被定义为智能合约对象的哈希函数（专指SHA-256）。每个在TON区块链上运行的智能合约都存储两个主要组件。这些包括：

Later in this documentation, we will dive deeper into the technical specifications of the TVM and TL-B scheme. 随着本文档的深入，我们将进一步深入技术规格和TVM及TL-B方案的概述。现在我们熟悉了**account_id**的生成以及它们与TON上智能合约地址的交互，接下来让我们解释什么是原始地址和用户友好地址。

## 用户友好地址

Each address can be in one of possible states:

- `nonexist` - there were no accepted transactions on this address, so it doesn't have any data (or the contract was deleted). We can say that initially all 2<sup>256</sup> address are in this state.
- `uninit` - address has some data, which contains balance and meta info. At this state address doesn't have any smart contract code/persistent data yet. An address enters this state, for example, when it was in a nonexist state, and another address sent tokens to it.
- `active` - address has smart contract code, persistent data and balance. At this state it can perform some logic during the transaction and change its persistent data. An address enters this state when it was `uninit` and there was an incoming message with state_init param (note, that to be able to deploy this address, hash of `state_init` and `code` must be equal to address).
- `frozen` - address cannot perform any operations, this state contains only two hashes of the previous state (code and state cells respectively). When an address's storage charge exceeds its balance, it goes into this state. To unfreeze it, you can send an internal message with `state_init` and `code` which store the hashes described earlier and some Toncoin. It can be difficult to recover it, so you should not allow this situation. There is a project to unfreeze the address, which you can find [here](https://unfreezer.ton.org/).

## 原始地址和用户友好地址

在简要概述了TON上的智能合约地址是如何利用工作链和账户ID（特别是对于主链和基本链）之后，那重要的是要理解这些地址以下面两种主要格式表示：

- **原始地址**：智能合约地址的原始完整表示。
- **用户友好地址**：用户友好地址是一种原始地址的增强格式，具有更好的安全性和易用性。

下面，我们将详细介绍这两种地址类型的区别，并深入探讨 TON 使用用户友好地址的原因。

### 原始地址

以下是一个使用工作链ID和账户ID的原始智能合约地址示例（表示为**workchain_id**和**account_id**）：

- [十进制workchain_id\]：[64个十六进制数字的account_id\]

在简要介绍了 TON 上的智能合约地址如何利用工作链和账户 ID（具体针对主链和底层链）之后，我们有必要了解这些地址主要有两种格式：

`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

Notice the `-1` at the start of the address string, which denotes a _workchain_id_ that belongs to the Masterchain.

:::note
Uppercase letters (such as 'A', 'B', 'C', 'D' etc.) 地址字符串中可以使用大写字母（如 'A'、'B'、'C'、'D'等）替代其小写的对应字母（如 'a'、'b'、'c' 'd'等）。
:::

#### Issues with raw addresses

使用原始地址形式存在两个主要问题：

1. 在使用原始地址格式时，无法在发送交易前验证地址以消除错误。
   这意味着，如果您在发送交易前不小心在地址字符串中添加或删除字符，您的交易将被发送到错误的目的地，导致资金损失。
   This means that if you accidentally add or remove characters in the address string prior to sending the transaction, your transaction will be sent to the wrong destination, resulting in loss of funds.
2. 在使用原始地址格式时，无法添加像使用用户友好地址时发送交易所用的特殊标志位。
   为了帮助您更好地理解这个概念，我们将在下面解释可以使用哪些标志位。
   To help you better understand this concept, we’ll explain which flags can be used below.

### 用户友好地址结构

用户友好地址是为了保护和简化在互联网上（例如，在公共消息平台上或通过电子邮件服务提供商）以及现实世界中分享地址的TON用户的体验而开发的。

#### 简单易用的地址

要生成用户友好地址，开发者必须使用以下方式对所有36个字节进行编码：

1. _[flags - 1 byte]_ — Flags that are pinned to addresses change the way smart contracts react to the received message.
   Flags types that employ the user-friendly address format include:

   - isBounceable. Denotes a bounceable or non-bounceable address type. (_0x11_ for "bounceable", _0x51_ for "non-bounceable")
   - isTestnetOnly. isTestnetOnly。表示仅用于测试网的地址类型。以_0x80_ 开头的地址不应被生产网络上运行的软件接受 Addresses beginning with _0x80_ should not be accepted by software running on the production network
   - isUrlSafe. isUrlSafe。表示已定义为地址的URL安全的已弃用标志位。所有地址都被认为是URL安全的。 All addresses are then considered URL-safe.
2. _\[workchain_id - 1 byte]_ — The workchain ID (_workchain_id_) is defined by a signed 8-bit integer _workchain_id_.\
   (_0x00_ for the BaseChain, _0xff_ for the MasterChain)
3. _\[account_id - 32字节]_ — 账户ID由工作链中的256位（[大端序](https://www.freecodecamp.org/news/what-is-endianness-大端-vs-little-endian/)）地址组成。
4. _\[address verification - 2 bytes]_ —  In user-friendly addresses, address verification is composed of a CRC16-CCITT signature from the previous 34 bytes. _\[地址验证 - 2字节]_ — 在用户友好地址中，地址验证由前34个字节的CRC16-CCITT签名组成。([示例](https://github.com/andreypfau/ton-kotlin/blob/ce9595ec9e2ad0eb311351c8a270ef1bd2f4363e/ton-kotlin-crypto/common/src/crc32.kt))
   实际上，用户友好地址的验证思想与所有信用卡上使用的[Luhn算法](https://en.wikipedia.org/wiki/Luhn_algorithm)类似，以防止用户错误输入不存在的卡号。

The addition of these 4 main components means that: `1 + 1 + 32 + 2 = 36` bytes in total (per user-friendly address).

要生成用户友好地址，开发者必须使用以下方式对所有36个字节进行编码：

- _base64_（即数字、大小写拉丁字母、'/' 和 '+'）
- _base64url_（用 '_' 和 '-' 代替 '/' 和 '+'）

完成这个过程后，会生成一个长度为48个非空格字符的用户友好地址。

:::info DNS地址标志位
在TON上，有时使用诸如mywallet.ton之类的DNS地址，而不是原始和用户友好地址。实际上，DNS地址由用户友好地址组成，并包括所有必需的标志位，允许开发者从TON域中的DNS记录访问所有标志位。 DNS addresses are made up of user-friendly addresses and include all the required flags that allow developers to access all the flags from the DNS record within the TON domain.
:::

#### 用户友好地址编码示例

例如，“测试赠予者”智能合约（一个特殊的智能合约，位于测试网主链中，向任何请求者发送2个测试代币）使用以下原始地址：

`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

The above "test giver" raw address must be converted into the user-friendly address form. 上述“测试赠予者”的原始地址必须转换为用户友好地址形式。这可以通过使用之前介绍的base64或base64url形式来获得，如下所示：

- `kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYIny` (base64)
- `kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny` (base64url)

:::info
注意，_base64_ 和 _base64url_ 两种形式都是有效的，都会被接受！
:::

#### 可弹回与不可弹回地址

可弹回地址标志位背后的核心思想是发件人资金的安全。

For example, if the destination smart contract does not exist, or if an issue happens during the transaction, the message will be "bounced" back to the sender and constitute the remainder of the original value of the transaction (minus all transfer and gas fees).
In relation to bounceable addresses specifically:

1. **bounceable=false** 标志位通常意味着接收者是一个钱包。
2. **bounceable=true** 标志位通常表示具有自己应用逻辑的自定义智能合约（例如，DEX）。在这个例子中，因为安全原因不应发送非弹回消息。 In this example, non-bounceable messages should not be sent because of security reasons.

请阅读我们的文档以更好地了解[不可弹回消息](/develop/smart-contracts/guidelines/non-bouncable-messages)。

#### base64加固型表示

Additional binary data related to TON Blockchain employs similar "armored" base64 user-friendly address representations. These differentiate from one another depending on the first 4 characters of their byte tag. For example, 256-bit Ed25519 public keys are represented by first creating a 36-byte sequence using the below process in order:

- 使用_0x3E_格式的单字节标签表示公钥
- 使用_0xE6_格式的单字节标签表示Ed25519公钥
- 32字节标签含标准二进制表示的Ed25519公钥
- 2字节标签含大端序表示的前34字节的CRC16-CCITT

获得的36字节序列会转换为标准方式的48字符base64或base64url字符串。例如，Ed25519公钥`E39ECDA0A7B0C60A7107EC43967829DBE8BC356A49B9DFC6186B3EAC74B5477D`（通常由32字节序列表示，例如：`0xE3, 0x9E, ..., 0x7D`）通过“加固型”表示呈现如下： For example, the Ed25519 public key `E39ECDA0A7B0C60A7107EC43967829DBE8BC356A49B9DFC6186B3EAC74B5477D` (usually represented by a sequence of 32 bytes such as:  `0xE3, 0x9E, ..., 0x7D`) presents itself through the "armored" representation as follows:

`Pubjns2gp7DGCnEH7EOWeCnb6Lw1akm538YYaz6sdLVHfRB2`

### 用户友好地址和原始地址的转换

转换用户友好和原始地址的最简单方式是使用几个TON API和其他工具，包括：

- [使用ton.js转换地址的形式，从/到用户友好或原始形式](https://github.com/ton-org/ton-core/blob/main/src/address/Address.spec.ts)
- [使用tonweb转换地址的形式，从/到用户友好或原始形式](https://github.com/toncenter/tonweb/tree/master/src/utils#address-class)
- [toncenter主网的API方法](https://toncenter.com/api/v2/#/accounts/pack_address_packAddress_get)
- [toncenter测试网的API方法](https://testnet.toncenter.com/api/v2/#/accounts/pack_address_packAddress_get)

此外，使用JavaScript为钱包转换用户友好和原始地址有两种方式：

- [使用ton.js转换地址的形式，从/到用户友好或原始形式](https://github.com/ton-org/ton-core/blob/main/src/address/Address.spec.ts)
- [使用tonweb转换地址的形式，从/到用户友好或原始形式](https://github.com/toncenter/tonweb/tree/master/src/utils#address-class)

还可以使用[SDKs](/develop/dapps/apis/sdk)进行类似的转换。

### 地址示例

在 [TON Cookbook](/v3/guidelines/dapps/cookbook#working-with-contracts-addresses) 中了解有关 TON 地址的更多示例。

## 可能出现的问题

在与 TON 区块链交互时，了解将 TON 币转移到 "未激活 "钱包地址的影响至关重要。本节概述了各种情况及其结果，以明确如何处理此类交易。 This section outlines the various scenarios and their outcomes to provide clarity on how such transactions are handled.

### 将 Toncoin 转移到未登录地址时会发生什么？

#### 包含 `state_init` 的事务

如果您在交易中包含 `state_init`（由钱包或智能合约的代码和数据组成）。智能合约会首先使用所提供的 `state_init` 进行部署。部署完成后，将对收到的信息进行处理，类似于向已初始化的账户发送信息。 The smart contract is deployed first using the provided `state_init`. After deployment, the incoming message is processed, similar to sending to an already initialized account.

#### 未设置 `state_init` 和 `bounce` 标志的事务

信息无法传递到 `uninit` 智能合约，将被退回给发件人。在扣除消耗的 gas 费用后，剩余金额将返回发件人地址。 After deducting the consumed gas fees, the remaining amount is returned to the sender's address.

#### 未设置 `state_init` 和 `bounce` 标志的事务

The message cannot be delivered, but it will not bounce back to the sender. Instead, the sent amount will be credited to the receiving address, increasing its balance even though the wallet is not yet initialized. They will be stored there until the address holder deploys a smart wallet contract and then they can access the balance.

#### 如何正确操作

部署钱包的最佳方法是向其地址（尚未初始化）发送一些 TON，并清除 `bounce` 标志。完成这一步后，所有者就可以使用当前未初始化地址的资金部署和初始化钱包。这一步通常发生在第一次钱包操作中。 After this step, the owner can deploy and initialize the wallet using funds at the current uninitialized address. This step usually occurs on the first wallet operation.

### TON 区块链可防止错误交易

在 TON 区块链中，标准钱包和应用程序通过使用可反弹地址和不可反弹地址自动管理向未初始化地址进行交易的复杂性，[此处](#bounceable-vs-non-bounceable-addresses) 对这两种地址进行了描述。钱包在向非初始化地址发送硬币时，通常会同时向可反弹地址和不可反弹地址发送硬币而不返回。 It is common practice for wallets, when sending coins to non-initialized addresses, to send coins to both bounceable and non-bounceable addresses without return.

如果需要快速获取可跳转/不可跳转形式的地址，可以 [在此](https://ton.org/address/) 进行操作。

### 定制产品的责任

如果您要在 TON 区块链上开发定制产品，就必须实施类似的检查和逻辑：

确保您的应用程序在发送资金前验证收件人地址是否已初始化。
根据地址状态，为用户智能合约使用可反弹地址，并使用自定义应用逻辑确保资金退回。钱包使用不可反弹地址。
Based on the address state, use bounceable addresses for user smart contracts with custom application logic to ensure funds are returned. Use non-bounceable addresses for wallets.

<Feedback />

