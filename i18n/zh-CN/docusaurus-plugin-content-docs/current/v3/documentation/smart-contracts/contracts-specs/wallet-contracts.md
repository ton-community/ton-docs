import Feedback from '@site/src/components/Feedback';

import ConceptImage from '@site/src/components/conceptImage';
import ThemedImage from '@theme/ThemedImage';

# Wallet

You may have heard about different versions of wallets on TON Blockchain. But what do these versions actually mean, and how do they differ?

在本文中，我们将探讨 TON 钱包的各种版本和修改。

:::info
Before we start, there are some terms and concepts that you should be familiar with to fully understand the article:

- [消息管理](/v3/documentation/smart-contracts/message-management/messages-and-transactions)，因为这是钱包的主要功能。
- [FunC语言](/v3/documentation/smart-contracts/func/overview)，因为我们将在很大程度上依赖使用它的实现。
  :::

## 共同概念

To break the tension, we should first understand that wallets are not a specific entity in the TON ecosystem. They are still just smart contracts consisting of code and data, and, in that sense, are equal to any other actor (i.e., smart contract) in TON.

与您自己的定制智能合约或其他任何合约一样，钱包可以接收外部和内部信息，发送内部信息和日志，并提供 "获取 "方法。
那么问题来了：它们提供哪些功能，不同版本之间有何不同？
So the question is: what functionality do they provide and how it differs between versions?

您可以将每个钱包版本视为提供标准外部接口的智能合约实现，允许不同的外部客户端以相同的方式与钱包进行交互。您可以在主 TON monorepo 中找到这些 FunC 和 Fift 语言的实现： You can find these implementations in FunC and Fift languages in the main TON monorepo:

- [ton/crypto/smartcont/](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/)

## 基本钱包

### 钱包合约类型

Here, you can find the current hashes of the wallet contract code versions.\
For detailed specifications of each wallet contract, please refer to the page.
For detailed specifications of each wallet contract, please refer further down the page or check the [ContractSources.md](https://github.com/toncenter/tonweb/blob/update_contracts/src/contract/ContractSources.md).

<details><summary> Show wallet contracts hashes table </summary>

| Contract version                                                                                                     | Hash                                           |
| -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Wallet                                                                                                               | 0xf374484c                                     |
| [walletv1r2](#wallet-v1)                                                                                             | 0xd372158c                                     |
| [walletv1r3](#wallet-v1)                                                                                             | 0xfcf9e58f                                     |
| [walletv2r1](#wallet-v2)                                                                                             | 0x178d4519                                     |
| [walletv2r2](#wallet-v2)                                                                                             | 0xcb862902                                     |
| [walletv3r1](#wallet-v3)                                                                                             | 0xad4eb6f5                                     |
| [walletv3r2](#wallet-v3)                                                                                             | 0xffffffff                                     |
| [walletv4r1](#wallet-v4)                                                                                             | 0x0f8a7ea5                                     |
| [walletv4r2](#wallet-v4)                                                                                             | `/rX/aCDi/w2Ug+fg1iyBfYRniftK5YDIeIZtlZ2r1cA=` |
| V5 钱包标准提供了许多优势，改善了用户和商家的体验。V5 支持无 gas 交易、账户授权和恢复、使用代币和 Toncoin 进行订阅支付以及低成本的多笔转账。除了保留以前的功能（V4）外，新合约允许您一次发送多达 255 条信息。 | 0x642b7d07                                     |

</details>

**Note:** These hashes can also be found in the explorers.

### 钱包 V1

This is the simplest one. 这是最简单的一种。它只允许您一次发送四笔交易，而且除了您的签名和序列号外不检查任何东西。

钱包源代码：

- [ton/crypto/smartcont/wallet-code.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet.fif)

这个版本甚至没有在常规应用程序中使用，因为它存在一些重大问题：

- 没有从合约中获取序列号和公钥的简单方法。
- 没有 `valid_until` 检查，因此无法确保交易不会太晚确认。

The first issue was fixed in `V1R2` and `V1R3`. The `R` stands for **revision**. Usually, revisions are just small updates that only add get methods; you can find all of those in the changes history of `new-wallet.fif`. Hereinafter, we will consider only the latest revisions.

尽管如此，由于每个后续版本都继承了前一个版本的功能，我们仍应坚持使用它，因为这将有助于我们以后版本的开发。

#### Official code hashes

| Contract version | Hash       |
| ---------------- | ---------- |
| 0xfb88e119       | 0x595f07bc |
| 0x21cfe02b       | 0xd53276db |
| 0xa7733acd       | 0xf93bb43f |

#### 持久内存布局

- <b>seqno</b>：32 位长序列号。
- <b>public-key</b>： 256 位长公开密钥。

#### 外部信息正文布局

1. 数据
  - <b>签名</b>：512 位长 ed25519 签名。
  - <b>msg-seqno</b>：32 位长序列号。
  - <b>(0-4)模式</b>：最多四个 8 位长整数，定义每条报文的发送模式。
2. 最多 4 次引用包含信息的 cell 。

As you can see, the main functionality of the wallet is to provide a safe way to communicate with the TON blockchain from the outside world. The `seqno` mechanism protects against replay attacks, and the `Ed25519 signature` provides authorized access to wallet functionality. We will not dwell in detail on each of these mechanisms, as they are described in detail in the [external message](/v3/documentation/smart-contracts/message-management/external-messages) documentation page and are quite common among smart contracts receiving external messages. The payload data consists of up to 4 references to cells and the corresponding number of modes, which will be directly transferred to the [send_raw_message(cell msg, int mode)](/v3/documentation/smart-contracts/func/docs/stdlib#send_raw_message) method.

:::caution
Note that the wallet doesn't provide any validation for internal messages you send through it. It is the programmer's (i.e., the external client’s) responsibility to serialize the data according to the [internal message layout](/v3/documentation/smart-contracts/message-management/sending-messages#message-layout).
:::

#### 退出代码

| 退出代码 | 说明                  |
| ---- | ------------------- |
| 0x21 | `seqno` 检查失败，出现回复保护 |
| 0x22 | `Ed25519签名` 检查失败    |
| 0x0  | 标准成功执行退出代码。         |

:::info
请注意，[TVM](/v3/documentation/tvm/tvm-overview) 有[标准退出代码](/v3/documentation/tvm/tvm-exit-codes) (`0x0`-是其中之一)，因此您也可以得到其中之一，例如，如果您用完了[gas](https://docs.ton.org/develop/smart-contracts/fees)，您将得到`0xD`代码。
:::

#### 获取方法

1. int seqno() 返回当前存储的序列号。
2. int get_public_key 返回当前存储的公钥。

### 钱包 V2

钱包源代码：

- [ton/crypto/smartcont/wallet-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-code.fc)

该版本引入了 `valid_until` 参数，用于设置交易的时间限制，以防过迟确认。该版本也没有在 `V2R2` 中添加的获取公钥的方法。 This version also does not have the get-method for the public key, which was added in `V2R2`.

All differences compared to the previous version are a consequence of adding the `valid_until` functionality. A new exit code was added: `0x23`, marking the failure of the valid_until check. Additionally, a new UNIX-time field has been added to the external message body layout, setting the time limit for the transaction. All get methods remain the same.

#### Official code hashes

| Contract version | Hash       |
| ---------------- | ---------- |
| 0x97d51f2f       | 0xc64370e5 |
| walletv2r2       | 0x4e73744b |

#### 外部信息正文布局

1. 数据
  - <b> signature </b>：512 位长 ed25519 签名。
  - <b>msg-seqno</b>：32 位长序列号。
  - <b>valid-until</b>：32 位长 Unix 时间整数。
  - <b>(0-4)mode</b>：最多四个 8 位长整数，定义每条报文的发送模式。
2. 最多 4 次引用包含信息的 cell 。

### 钱包 V3

该版本引入了 `subwallet_id` 参数，允许使用同一公钥创建多个钱包（因此可以只有一个种子短语和多个钱包）。和以前一样，`V3R2` 只增加了获取公钥的方法。 As before, `V3R2` only adds the get-method for the public key.

钱包源代码：

- [ton/crypto/smartcont/wallet3-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc)

Essentially, `subwallet_id` is just a number added to the contract state when it’s deployed. 本质上，`subwallet_id` 只是在部署时添加到合约状态的一个数字。由于 TON 中的合约地址是其状态和代码的哈希值，因此钱包地址会随着不同的 `subwallet_id` 而改变。该版本是目前使用最广泛的版本。它涵盖了大多数使用情况，并且仍然干净、简单，与之前的版本基本相同。所有获取方法保持不变。 This version is the most widely used right now. It covers most use cases and remains clean, simple, and mostly the same as previous versions. All get methods remain the same.

#### Official code hashes

| Contract version | Hash       |
| ---------------- | ---------- |
| 0xf7733acd       | 0xd55e4686 |
| 0xeed236d3       | 0xb56b9598 |

#### 持久内存布局

- <b>seqno</b>：32 位序列号。
- <b> subwallet </b>：32 位子钱包 ID。
- <b>public-key</b>: 256 位公开密钥。

#### 外部信息布局

1. 数据
  - <b> signature </b>：512 位 ed25519 签名。
  - <b>subwallet-id</b>：32 位子钱包 ID。
  - <b>msg-seqno</b>：32 位序列号。
  - <b>valid-until</b>：32 位 UNIX 时间整数。
  - <b>(0-4)mode</b>：最多 4 个 8 位整数，定义每个报文的发送模式。
2. 最多 4 次引用包含信息的 cell 。

#### 退出代码

| 退出代码 | 说明                          |
| ---- | --------------------------- |
| 0x23 | `valid_until` 检查失败；交易确认尝试太晚 |
| 0x23 | `Ed25519签名` 检查失败            |
| 0x21 | `seqno` 检查失败；已触发回复保护        |
| 0x22 | subwallet-id\\` 与存储的标识不匹配  |
| 0x0  | 标准成功执行退出代码。                 |

### 钱包 V4

该版本保留了之前版本的所有功能，但也引入了一些非常强大的功能："插件"。

钱包源代码：

- [ton-blockchain/wallet-contract](https://github.com/ton-blockchain/wallet-contract)

This feature allows developers to implement complex logic that works in tandem with a user's wallet. For example, a DApp may require a user to pay a small amount of coins every day to use certain features. In this case, the user would need to install the plugin on their wallet by signing a transaction. The plugin would then send coins to the destination address daily when requested by an external message.

#### Official code hashes

| Contract version | Hash                                           |
| ---------------- | ---------------------------------------------- |
| 0xb544f4a4       | 0xe3a0d482                                     |
| 0x2167da4b       | `/rX/aCDi/w2Ug+fg1iyBfYRniftK5YDIeIZtlZ2r1cA=` |
| 0xea06185d       | 0x7258a69b                                     |

#### 插件

Plugins are essentially other smart contracts on TON that developers are free to implement as they wish. In relation to the wallet, they are simply addresses of smart contracts stored in a [dictionary](/v3/documentation/smart-contracts/func/docs/dictionaries) in the wallet's persistent memory. These plugins are allowed to request funds and remove themselves from the "allowed list" by sending internal messages to the wallet.

#### 持久内存布局

- <b>seqno</b>：32 位长序列号。
- <b>subwallet-id</b>：32 位长 subwallet-id。
- <b>public-key</b>： 256 位长公开密钥。
- <b>plugins</b>：包含插件的字典（可能为空）

#### 接收内部信息

All previous versions of wallets had a straightforward implementation for receiving internal messages. They simply accepted incoming funds from any sender, ignoring the internal message body if present, or in other words, they had an empty recv_internal method. However, as mentioned earlier, the fourth version of the wallet introduces two additional available operations. Let's take a look at the internal message body layout:

- <b>op-code?</b>: 32-bit long operation code. : 32 位长操作码。这是一个可选字段；任何信息正文中包含少于 32 位的操作码、错误的操作码或未注册为插件的发件人地址，都将被视为简单转账，与之前的钱包版本类似。
- <b>query-id</b>：64 位长整数。该字段对智能合约的行为没有影响；它用于跟踪合约之间的信息链。 This field has no effect on the smart contract's behavior; it is used to track chains of messages between contracts.

1. op-code = 0x706c7567，申请资金操作代码。
  - <b> TON 币</b>：VARUINT16 申请的 TON 币数量。
  - <b>extra_currencies</b>：包含所请求的额外货币数量的字典（可能为空）。
2. op-code = 0x64737472，请求从 "允许列表" 中删除插件发送方。

#### 外部信息正文布局

- <b> signature </b>：512 位长 ed25519 签名。
- <b>subwallet-id</b>：32 位长的子钱包 ID。
- <b>valid-until</b>：32 位长 Unix 时间整数。
- <b>msg-seqno</b>：32 位长序列整数。
- <b>op-code</b>：32 位长操作码。

1. op-code = 0x0，简单发送。
  - <b>(0-4)mode</b>：最多四个 8 位长整数，定义每条报文的发送模式。
  - <b>(0-4)messages</b>：包含信息的 cell 的最多四个引用。
2. op-code = 0x1，部署并安装插件。
  - <b>workchain</b>：8 位长整数。
  - <b> balance </b>：VARUINT16  Toncoin  初始余额。
  - <b>state-init</b>：包含插件初始状态的 cell 引用。
  - <b>body</b>：包含正文的 cell 引用。
3. op-code = 0x2/0x3，安装插件/删除插件。
  - <b>wc_n_address</b>：8 位长工作链 ID + 256 位长插件地址。
  - <b>balance</b>：VARUINT16  Toncoin  初始余额的金额。
  - <b>query-id</b>：64 位长整数。

As you can see, the fourth version still provides standard functionality through the `0x0` op-code, similar to previous versions. 如您所见，第四个版本仍通过 `0x0` 操作码提供标准功能，与之前的版本类似。`0x2` 和 `0x3` 操作允许对插件字典进行操作。请注意，在使用 `0x2` 的情况下，您需要自行部署具有该地址的插件。相比之下，`0x1` 操作码还可通过 state_init 字段处理部署过程。 Note that in the case of `0x2`, you need to deploy the plugin with that address yourself. In contrast, the `0x1` op-code also handles the deployment process with the state_init field.

:::tip
If `state_init` doesn't make much sense from its name, take a look at the following references:

- [地址- TON -区块链](/v3/documentation/smart-contracts/addresses#workchain-id-and-account-id)
- [发送部署信息](/v3/documentation/smart-contracts/func/cookbook#how-to-send-a-deploy-message-with-stateinit-only-with-stateinit-and-body)
- [internal-message-layout](/v3/documentation/smart-contracts/message-management/sending-messages#message-layout)
  :::

#### 退出代码

| 退出代码 | 说明                                                       |
| ---- | -------------------------------------------------------- |
| 0x24 | `valid_until` 检查失败，交易确认尝试太晚                              |
| 0x23 | `Ed25519签名` 检查失败                                         |
| 0x21 | `seqno` 检查失败，已触发回复保护                                     |
| 0x22 | `subwallet-id` 与存储的标识不匹配                                 |
| 0x27 | 插件字典操作失败（0x1-0x3 recv_external 操作码） |
| 0x50 | 申请资金不足                                                   |
| 0x0  | 标准成功执行退出代码。                                              |

#### Get 方法

1. int seqno() 返回当前存储的序列号。
2. int get_public_key() 返回当前存储的公钥。
3. int get_subwallet_id() 返回当前子钱包 ID。
4. int is_plugin_installed(int wc, int addr_hash) 检查是否已安装定义了工作链 ID 和地址散列的插件。
5. tuple get_plugin_list() 返回插件列表。

### 钱包 V5

它是目前最先进的钱包版本，由 Tonkeeper 团队开发，旨在取代 V4 并允许任意扩展。 <br></br>
<ThemedImage
alt=""
sources={{
light: '/img/docs/wallet-contracts/wallet-contract-V5.png?raw=true',
dark: '/img/docs/wallet-contracts/wallet-contract-V5_dark.png?raw=true',
}}
/> <br></br><br></br><br></br>
The V5 wallet standard offers many benefits that improve the experience for both users and merchants. V5 supports gas-free transactions, account delegation and recovery, subscription payments using tokens and Toncoin, and low-cost multi-transfers. In addition to retaining the previous functionality (V4), the new contract allows you to send up to 255 messages at a time.

钱包源代码：

- [ton-blockchain/wallet-contract-v5](https://github.com/ton-blockchain/wallet-contract-v5)

TL-B 方案：

- [ton-blockchain/wallet-contract-v5/types.tlb](https://github.com/ton-blockchain/wallet-contract-v5/blob/main/types.tlb)

:::caution
与之前的钱包版本规范不同，由于本钱包版本的接口实现相对复杂，我们将依赖 [TL-B](/v3/documentation/data-formats/tlb/tl-b-language) 方案。我们将逐一进行说明。尽管如此，我们仍然需要对其有一个基本的了解，结合钱包源代码就足够了。 We will provide some description for each of those. Nevertheless, a basic understanding is still required, in combination with the wallet source code, it should be enough.
:::

#### Official code hash

| Contract version | Hash       |
| ---------------- | ---------- |
| 0xf258a69b       | 0x7bdd97de |

#### 持久内存布局

```
contract_state$_ 
    is_signature_allowed:(## 1) 
    seqno:# 
    wallet_id:(## 32) 
    public_key:(## 256) 
    extensions_dict:(HashmapE 256 int1) = ContractState;
```

As you can see, the `ContractState`, compared to previous versions, hasn't undergone major changes. 正如你所看到的，"ContractState"（合约状态）与之前的版本相比，并没有发生重大变化。主要区别在于新增了 `is_signature_allowed` 1 位标志，用于限制或允许通过签名和存储的公钥进行访问。我们将在后面的主题中介绍这一变化的重要性。 We will describe the importance of this change in later topics.

#### 认证程序

```
signed_request$_             // 32 (opcode from outer)
  wallet_id:    #            // 32
  valid_until:  #            // 32
  msg_seqno:    #            // 32
  inner:        InnerRequest //
  signature:    bits512      // 512
= SignedRequest;             // Total: 688 .. 976 + ^Cell

internal_signed#73696e74 signed:SignedRequest = InternalMsgBody;

internal_extension#6578746e 
    query_id:(## 64) 
    inner:InnerRequest = InternalMsgBody;

external_signed#7369676e signed:SignedRequest = ExternalMsgBody;
```

Before we get to the actual payload of our messages — `InnerRequest` — let's first look at how version 5 differs from previous versions in the authentication process. The `InternalMsgBody` combinator describes two ways to access wallet actions through internal messages. The first method is one we are already familiar with from version 4: authentication as a previously registered extension, the address of which is stored in `extensions_dict`. The second method is authentication through the stored public key and signature, similar to external requests.

起初，这似乎是一个不必要的功能，但实际上它可以通过外部服务（智能合约）来处理请求，而这些外部服务并不是钱包扩展基础设施的一部分--这正是 V5 的关键功能。Gas-free交易就是依靠这一功能实现的。 Gas-free transactions rely on this functionality.

Note that simply receiving funds is still an option. Practically, any received internal message that doesn't pass the authentication process will be considered as transfer.

#### 行为

The first thing that we should notice is `InnerRequest`, which we have already seen in the authentication process. 我们首先要注意的是 "InnerRequest"，我们已经在身份验证过程中看到过它。与前一版本不同的是，除了更改签名模式（即 "is_signature_allowed "标志）外，外部和内部消息都可以访问相同的功能。

```
out_list_empty$_ = OutList 0;
out_list$_ {n:#} 
    prev:^(OutList n) 
    action:OutAction = OutList (n + 1);

action_send_msg#0ec3c86d mode:(## 8) out_msg:^(MessageRelaxed Any) = OutAction;

// Extended actions in V5:
action_list_basic$_ {n:#} actions:^(OutList n) = ActionList n 0;
action_list_extended$_ {m:#} {n:#} action:ExtendedAction prev:^(ActionList n m) = ActionList n (m+1);

action_add_ext#02 addr:MsgAddressInt = ExtendedAction;
action_delete_ext#03 addr:MsgAddressInt = ExtendedAction;
action_set_signature_auth_allowed#04 allowed:(## 1) = ExtendedAction;

actions$_ out_actions:(Maybe OutList) has_other_actions:(## 1) {m:#} {n:#} other_actions:(ActionList n m) = InnerRequest;
```

We can consider `InnerRequest` as two lists of actions: the first, `OutList`, is an optional chain of cell references, each containing a send message request led by the message mode. The second, `ActionList,` is led by a one-bit flag, `has_other_actions`, which marks the presence of extended actions, starting from the first cell and continuing as a chain of cell references. We are already familiar with the first two extended actions, `action_add_ext` and `action_delete_ext`, followed by the internal address that we want to add or delete from the extensions dictionary. The third, `action_set_signature_auth_allowed`, restricts or allows authentication through the public key, leaving the only way to interact with the wallet through extensions. This functionality might be extremely important in the case of a lost or compromised private key.

:::info
请注意，操作的最大数目是 255；这是通过 [c5](/v3/documentation/tvm/tvm-overview#result-of-tvm-execution) TVM 寄存器实现的结果。从技术上讲，您可以使用空的 `OutAction` 和 `ExtendedAction` 提出申请，但在这种情况下，它将类似于只是接收资金。 Technically, you can make a request with empty `OutAction` and `ExtendedAction`, but in that case, it will be similar to just receiving funds.
:::

#### 退出代码

| 退出代码 | 说明                                  |
| ---- | ----------------------------------- |
| 0x84 | 在签名禁用时尝试通过签名进行身份验证                  |
| 0x85 | `序列号` 检查失败，已获得回复保护                  |
| 0x86 | `wallet-id` 与存储的不一致                 |
| 0x87 | `Ed25519签名` 检查失败                    |
| 0x88 | `valid-until` 检查失败                  |
| 0x89 | 确保 `send_mode` 为外部信息设置了 +2 位（忽略错误）。 |
| 0x8A | `external-signed` 前缀与收到的前缀不一致       |
| 0x8B | 添加扩展名操作不成功                          |
| 0x8C | 删除扩展名操作不成功                          |
| 0x8D | 不支持扩展报文前缀                           |
| 0x8E | 尝试在扩展词典为空的情况下禁用签名验证                 |
| 0x8F | 尝试将签名设置为已设置的状态                      |
| 0x90 | 尝试在禁用签名时移除最后一个扩展名                   |
| 0x91 | 扩展程序有错误的工作链                         |
| 0x92 | 尝试通过外部信息更改签名模式                      |
| 0x93 | `c5` 无效，`action_send_msg` 验证失败      |
| 0x0  | 标准成功执行退出代码。                         |

:::danger
请注意，`0x8E`、`0x90` 和 `0x92` 钱包退出代码是为了防止您无法使用钱包功能而设计的。尽管如此，您仍要记住，钱包不会检查所存储的扩展地址是否确实存在于 TON 中。您也可以部署一个初始数据为空扩展字典和受限签名模式的钱包。在这种情况下，您仍然可以通过公钥访问钱包，直到添加第一个扩展。因此，请小心处理这些情况。 Nevertheless, you should still remember that the wallet doesn't check whether the stored extension addresses actually exist in TON. You can also deploy a wallet with initial data consisting of an empty extensions dictionary and restricted signature mode. In that case, you will still be able to access the wallet through the public key until you add your first extension. So, be careful with these scenarios.
:::

#### Get 方法

1. int is_signature_allowed() 返回存储的 `is_signature_allowed` 标志。
2. int seqno() 返回当前存储的序列号。
3. int get_subwallet_id() 返回当前子钱包 ID。
4. int get_public_key() 返回当前存储的公钥。
5. cell  get_extensions() 返回扩展字典。

#### 为无 gas 交易做准备

As was said, before v5, the wallet smart contract allowed the processing of internal messages signed by the owner. This also allows you to make gasless transactions, e.g., payment of network fees when transferring USDt in USDt itself. The common scheme looks like this:

![image](/img/gasless.jpg)

:::tip
因此，会有一些服务（如 [Tonkeeper's Battery](https://blog.ton.org/tonkeeper-releases-huge-update#tonkeeper-battery)）提供这种功能：它们代表用户以 TON 支付交易费用，但收取代币费用。
:::

#### 流量

1. 在发送美元转账时，用户签署一条包含两笔美元转账的信息：
  1. 美元转账至收件人地址。
  2. 向该处转入少量美元。
2. This signed message is sent off-chain by HTTPS to the Service backend. 签名后的信息通过 HTTPS 发送到服务后台。服务后台将其发送到 TON 区块链，并支付网络费用 Toncoins。

测试版无气后台 API 可在 [tonapi.io/api-v2](https://tonapi.io/api-v2) 上获取。如果您正在开发任何钱包应用程序，并对这些方法有反馈意见，请通过 [@tonapitech](https://t.me/tonapitech) 聊天工具与我们分享。 If you are developing any wallet app and have feedback about these methods please share it ton [@tonapitech](https://t.me/tonapitech) chat.

钱包源代码：

- [ton-blockchain/wallet-contract-v5](https://github.com/ton-blockchain/wallet-contract-v5)

## 特殊钱包

Sometimes the functionality of basic wallets isn't enough. 有时，基本钱包的功能并不足够。这就是为什么有几种类型的专用钱包："高负载"、"锁定 "和 "受限"。

让我们一起来看看。

### 高负载钱包

When working with many messages in a short period, there is a need for special wallet called Highload Wallet. 在短时间内处理大量信息时，需要使用名为 "高负载钱包 "的特殊钱包。请阅读 [文章](/v3/documentation/smart-contracts/contracts-specs/highload-wallet) 了解更多信息。

### 锁定钱包

如果您出于某种原因，需要在一段时间内将钱币锁定在钱包中，而在这段时间过去之前无法提取钱币，那么就来看看锁定钱包吧。

它允许您设置不能从钱包中提取任何东西的时间。您还可以自定义设置解锁时间段，这样您就可以在这些时间段内花费一些金币。 You can also customize it by setting unlock periods so that you will be able to spend some coins during these set periods.

For example: you can create a wallet which will hold 1 million coins with total vesting time of 10 years. Set the cliff duration to one year, so the funds will be locked for the first year after the wallet is created. 例如：您可以创建一个钱包，该钱包将容纳 100 万金币，总归属时间为 10 年。将悬崖期限设置为一年，因此资金将在钱包创建后的第一年被锁定。然后，您可以将解锁期设置为一个月，这样每月就可以解锁 `1'000'000  TON  / 120 个月 = ~8333  TON `。

钱包源代码：

- [ton-blockchain/lockup-wallet-contract](https://github.com/ton-blockchain/lockup-wallet-contract)

### 受限钱包

This wallet's function is to act like a regular wallet, but restrict transfers to only one pre-defined destination address. 该钱包的功能与普通钱包类似，但只能向一个预定义的目标地址转账。您可以在创建此钱包时设置目标地址，然后就只能将资金转入该地址。但请注意，您仍然可以向验证合约转账，因此您可以使用此钱包运行验证器。 But note that you can still transfer funds to validation contracts so you can run a validator with this wallet.

钱包源代码：

- [EmelyanenkoK/nomination-contract/restricted-wallet](https://github.com/EmelyanenkoK/nomination-contract/tree/master/restricted-wallet)

## 结论

您可能听说过 TON 区块链上不同版本的钱包。但这些版本究竟是什么意思，它们之间有什么区别？ But in most cases, you only need `V3R2` or `V4R2`. You can also use one of the special wallets if you want to have some additional functionality like a periodic unlocking of funds.

## 另请参见

- [使用钱包智能合约](/v3/guidelines/smart-contracts/howto/wallet)
- [基本钱包的来源](https://github.com/ton-blockchain/ton/tree/master/crypto/smartcont)
- [更多版本技术说明](https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md)
- [钱包 V4 来源和详细说明](https://github.com/ton-blockchain/wallet-contract)
- [锁定钱包来源和详细说明](https://github.com/ton-blockchain/lockup-wallet-contract)
- [限制钱包来源](https://github.com/EmelyanenkoK/nomination-contract/tree/master/restricted-wallet)
- [ TON 级 免 Gas 交易](https://medium.com/@buidlingmachine/gasless-transactions-on-ton-75469259eff2)

<Feedback />

