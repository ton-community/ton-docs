---
description: 在本教程中，您将学习如何完全使用钱包、交易和智能合约进行工作。
---

import Tabs from'@theme/Tabs';
import TabItem from'@theme/TabItem';

# 使用钱包智能合约的工作

## 👋 介绍

在开始智能合约开发之前，学习 TON 上的钱包和交易如何工作是必不可少的。这些知识将帮助开发者了解钱包、交易和智能合约之间的交互，以实现特定的开发任务。

:::tip
建议在阅读本教程之前先熟悉一下 [钱包合约类型](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts) 一文。
:::

在本节中，我们将学习如何创建操作，而不使用预配置的函数，以了解开发工作流程。本教程的所有必要参考资料都位于参考章节。

## 💡 必要条件

本教程要求掌握 JavaScript 和 TypeScript 或 Golang 的基本知识。此外，还需要持有至少 3 TON（可以存储在交易所账户、非托管钱包或使用 Telegram 机器人钱包）。要理解本教程，需要对 [cell](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage)、[address in TON](/v3/documentation/smart-contracts/addresses)、[blockchain of blockchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains)有基本了解。

:::info 主网开发至关重要
在 TON 测试网上工作往往会导致部署错误、难以跟踪交易以及不稳定的网络功能。因此，完成大部分开发工作时间可能好处是建议在 TON Mainnet 上完成，以避免这些问题，这可能需要减少交易数量，从而可能减小费用。
:::

## 源代码

本教程中使用的所有代码示例都可以在以下 [GitHub 存储库](https://github.com/aSpite/wallet-tutorial) 中找到。

## ✍️ 您开始所需的内容

- 确保 NodeJS 已安装。
- 需要特定的 Ton 库，包括：@ton/ton 13.5.1+、@ton/core 0.49.2+ 和 @ton/crypto 3.2.0+。

\*\* 可选\*\*：如果您喜欢使用 Go 而不是 JS，则必须安装 [tonutils-go](https://github.com/xssnick/tonutils-go) 库和 GoLand IDE 才能在 TON 上进行开发。本教程将在 GO 版本中使用该库。

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```bash
npm i --save @ton/ton @ton/core @ton/crypto
```

</TabItem>
<TabItem value="go" label="Golang">

```bash
go get github.com/xssnick/tonutils-go
go get github.com/xssnick/tonutils-go/adnl
go get github.com/xssnick/tonutils-go/address
```

</TabItem>
</Tabs>

## ⚙ 设置您的环境

为了创建一个 TypeScript 项目，必须按照以下步骤进行操作：

1. 创建一个空文件夹（我们将其命名为 WalletsTutorial）。
2. 使用 CLI 打开项目文件夹。
3. 使用以下命令来设置项目：

```bash
npm init -y
npm install typescript @types/node ts-node nodemon --save-dev
npx tsc --init --rootDir src --outDir build \ --esModuleInterop --target es2020 --resolveJsonModule --lib es6 \ --module commonjs --allowJs true --noImplicitAny false --allowSyntheticDefaultImports true --strict false
```

:::info
为了帮助我们完成下一个流程，我们使用了 `ts-node` 来直接执行 TypeScript 代码，而无需预编译。当检测到目录中的文件更改时，`nodemon` 会自动重新启动节点应用程序。
:::

```json
  "files": [
    "\\",
    "\\"
  ]
```

5. 然后，在项目根目录中创建 `nodemon.json` 配置文件，内容如下：

```json
{
  "watch": ["src"],
  "ext": ".ts,.js",
  "ignore": [],
  "exec": "npx ts-node ./src/index.ts"
}
```

6. 在 `package.json` 中添加以下脚本到 "test" 脚本的位置：

```json
"start:dev": "npx nodemon"
```

7. 在项目根目录中创建 `src` 文件夹，然后在该文件夹中创建 `index.ts` 文件。
8. 接下来，添加以下代码：

```ts
async function main() {
  console.log("Hello, TON!");
}

main().finally(() => console.log("Exiting..."));
```

9. 使用终端运行以下代码：

```bash
npm run start:dev
```

10. 最后，控制台将输出以下内容。

![](/img/docs/how-to-wallet/wallet_1.png)

:::tip Blueprint
TON 社区创建了一个优秀的工具来自动化所有开发过程（部署、合约编写、测试）称为 [Blueprint](https://github.com/ton-org/blueprint)。然而，我们在本教程中不需要这么强大的工具，所以建议遵循上述说明。
:::

**可选:** 当使用 Golang 时，请按照以下说明进行操作：

1. 安装 GoLand IDE。
2. 使用以下内容创建项目文件夹和 `go.mod` 文件（如果使用的当前版本已过时，则可能需要更改 Go 版本）：

```
module main

go 1.20
```

3. 在终端中输入以下命令：

```bash
go get github.com/xssnick/tonutils-go
```

4. 在项目根目录中创建 `main.go` 文件，内容如下：

```go
package main

import (
	"log"
)

func main() {
	log.Println("Hello, TON!")
}
```

5. 将 `go.mod` 中的模块名称更改为 `main`。
6. 运行上述代码，直到在终端中显示输出。

:::info
也可以使用其他 IDE，因为 GoLand 不是免费的，但建议使用 GoLand。
:::

:::warning 注意

另外，下面的每个新部分将指定每个新部分所需的特定代码部分，并且需要将新的导入与旧导入合并起来。\
:::

## 🚀 让我们开始！

我们的主要任务是使用 @ton/ton、@ton/core、@ton/crypto 的各种对象和函数构建交易，以了解大规模交易是怎样的。为了完成这个过程，我们将使用两个主要的钱包版本（v3 和 v4），因为交易所、非托管钱包和大多数用户仅使用这些特定版本。

我们的主要任务是使用 @ton/ton、@ton/core、@ton/crypto（ExternalMessage、InternalMessage、Signing 等）的各种对象和函数构建消息，以了解消息在更大范围内的样子。为了完成这一过程，我们将使用两个主要的钱包版本（v3 和 v4），因为事实上交易所、非托管钱包和大多数用户都只使用这些特定版本。

:::note
There may be occasions in this tutorial when there is no explanation for particular details. In these cases, more details will be provided in later stages of this tutorial.

**重要:** 在本教程中，我们使用了 [wallet v3 代码](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc) 来更好地理解钱包开发过程。需要注意的是，v3 版本有两个子版本：r1 和 r2。目前，只使用第二个版本，这意味着当我们在本文档中提到 v3 时，它指的是 v3r2。
:::

## 💎 TON 区块链钱包

在 TON 区块链上运行的所有钱包实际上都是智能合约，与 TON 上的一切都是智能合约的方式相同。与大多数区块链一样，可以在网络上部署智能合约并根据不同的用途自定义它们。由于这个特性，**完全自定义的钱包是可能的**。
在 TON 上，钱包智能合约帮助平台与其他智能合约类型进行通信。然而，重要的是要考虑钱包通信是如何进行的。

### 钱包通信

一般来说，TON区块链上有两种消息类型： `internal` 和  `external` 。外部消息允许从外部世界向区块链发送消息，从而允许与接受此类消息的智能合约进行通信。负责执行这一过程的功能如下：

```func
() recv_external(slice in_msg) impure {
    ;; some code
}
```

在深入了解有关钱包的更多细节之前，我们先来看看钱包是如何接受外部信息的。在 TON 上，所有钱包都持有所有者的 "公钥 (public key)"、"序列号 (seqno)"和 "子钱包 ID (subwallet_id)"。收到外部信息时，钱包会使用 `get_data()` 方法从钱包的存储部分检索数据。然后，它会执行几个验证程序，并决定是否接受信息。这个过程如下：

```func
() recv_external(slice in_msg) impure {
  var signature = in_msg~load_bits(512); ;; get signature from the message body
  var cs = in_msg;
  var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32));  ;; get rest values from the message body
  throw_if(35, valid_until <= now()); ;; check the relevance of the message
  var ds = get_data().begin_parse(); ;; get data from storage and convert it into a slice to be able to read values
  var (stored_seqno, stored_subwallet, public_key) = (ds~load_uint(32), ds~load_uint(32), ds~load_uint(256)); ;; read values from storage
  ds.end_parse(); ;; make sure we do not have anything in ds variable
  throw_unless(33, msg_seqno == stored_seqno);
  throw_unless(34, subwallet_id == stored_subwallet);
  throw_unless(35, check_signature(slice_hash(in_msg), signature, public_key));
  accept_message();
```

> 💡 有用的链接:
>
> [文档中的"load_bits()"](/v3/documentation/smart-contracts/func/docs/stdlib/#load_bits)
>
> [文档中的"get_data()"](/v3/documentation/smart-contracts/func/docs/stdlib/#load_bits)
>
> [文档中的"begin_parse()"](/v3/documentation/smart-contracts/func/docs/stdlib/#load_bits)
>
> [文档中的"end_parse()"](/v3/documentation/smart-contracts/func/docs/stdlib/#end_parse)
>
> [文档中的"load_int()"](/v3/documentation/smart-contracts/func/docs/stdlib/#load_int)
>
> [文档中的"load_uint()"](/v3/documentation/smart-contracts/func/docs/stdlib/#load_int)
>
> [文档中的"check_signature()"](/v3/documentation/smart-contracts/func/docs/stdlib/#check_signature)
>
> [文档中的"slice_hash()"](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_hash)
>
> [文档中的"accept_message()"](/v3/documentation/smart-contracts/transaction-fees/accept-message-effects)

接下来，我们来详细看一下。

### 重放保护 - Seqno

钱包智能合约中的消息重放保护与消息序列号（seqno，Sequence Number）直接相关，该序列号可追踪消息的发送顺序。钱包中的单条信息不能重复发送，这一点非常重要，因为这会完全破坏系统的完整性。如果我们进一步检查钱包内的智能合约代码，`seqno` 通常会按以下方式处理：

```func
throw_unless(33, msg_seqno == stored_seqno);
```

上面这行代码检查消息中的 `seqno` 并与存储在智能合约中的 `seqno` 进行核对。如果两者不匹配，合约就会返回一个带有 `33 exit code` 的错误。因此，如果发送者传递了无效的 seqno，这意味着他在信息序列中犯了某些错误，而合约可以防止这种情况发生。

:::note
还需要确认外部消息可以由任何人发送。这意味着如果您向某人发送 1 TON，其他人也可以重复该消息。但是，当 seqno 增加时，以前的外部消息失效，并且没有人可以重复该消息，从而防止窃取您的资金。
:::

### 签名

要执行此过程，首先钱包需要从传入消息中获取签名，从存储中加载公钥，并使用以下过程验证签名：

要执行此过程，首先钱包需要从传入消息中获取签名，从存储中加载公钥，并使用以下过程验证签名：

```func
var signature = in_msg~load_bits(512);
var ds = get_data().begin_parse();
var (stored_seqno, stored_subwallet, public_key) = (ds~load_uint(32), ds~load_uint(32), ds~load_uint(256));
throw_unless(35, check_signature(slice_hash(in_msg), signature, public_key));
```

如果所有验证流程都顺利完成，智能合约接受消息并对其进行处理：

```func
accept_message();
```

:::info accept_message()
由于消息来自外部世界，它不包含支付交易费用所需的 Toncoin。在使用 accept_message() 函数发送 TON 时，应用gas_credit（在写入时其值为10,000 gas单位），并且只要gas不超过 gas_credit 值，就允许免费进行必要的计算。使用 accept_message() 函数后，从智能合约的账户余额中收取所有已花费的gas（以 TON 计）。可以在[此处](/v3/documentation/smart-contracts/transaction-fees/accept-message-effects)了解有关此过程的更多信息。
:::

### 交易过期

用于检查外部报文有效性的另一个步骤是 `valid_until` 字段。从变量名可以看出，在 UNIX 中，这是报文生效前的时间。如果验证过程失败，合约将完成事务处理，并返回如下的 35 退出码：

```func
var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32));
throw_if(35, valid_until <= now());
```

当信息不再有效，但由于不明原因仍被发送到区块链上时，这种算法可以防止出现各种错误。

### 钱包 v3 和钱包 v4 的区别

钱包 v3 和钱包 v4 之间的唯一区别是钱包 v4 使用可以安装和删除的 `插件`。插件是特殊的智能合约，可以从钱包智能合约请求在特定时间从指定数量的 TON 中。钱包智能合约将相应地发送所需数量的 TON，而无需所有者参与。这类似于为插件创建的 **订阅模型**。我们不会在本教程中详细介绍这些细节，因为这超出了本教程的范围。

正如我们之前讨论的那样，钱包智能合约接受外部交易，验证它们，如果通过了所有检查，则接受它们。然后，合约开始从外部消息的主体中检索消息，然后创建内部消息并将其发送到区块链，如下所示：

### 钱包如何促进与智能合约的通信

正如我们前面所讨论的，钱包智能合约会接受外部信息，对其进行验证，并在所有检查都通过的情况下接受它们。然后，合约开始从外部信息正文中检索信息的循环，然后创建内部信息并将其发送到区块链，如下所示：

```func
cs~touch();
while (cs.slice_refs()) {
    var mode = cs~load_uint(8); ;; load message mode
    send_raw_message(cs~load_ref(), mode); ;; get each new internal message as a cell with the help of load_ref() and send it
}
```

:::tip touch()
在 TON 上，所有智能合约都在基于堆栈的 TON 虚拟机（TVM）上运行。~ touch() 将变量 `cs` 放在栈顶，以优化代码运行，减少 gas 。
:::

由于一个 cell 中 **最多可存储 4 个引用**，因此每个外部信息最多可发送 4 个内部信息。

> 💡 Useful links:
>
> [文档中的 "slice_refs()"](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_refs)
>
> [文档中的 "send_raw_message() 和消息模式"](/v3/documentation/smart-contracts/func/docs/stdlib/#send_raw_message)
>
> [文档中的 "load_ref()"](/v3/documentation/smart-contracts/func/docs/stdlib/#load_ref)

## 📬 外部和内部信息

在本节中，我们将进一步了解  `internal` 和  `external` 消息，并创建消息和将其发送到网络，以尽量减少使用预制函数。

这样，Tonkeeper 钱包应用程序将部署钱包合约，我们可以在以下步骤中使用它。

1. 安装 [钱包应用程序](/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps) （例如，作者使用的是 Tonkeeper）
2. 将钱包应用程序切换到 v3r2 地址版本
3. 向钱包存入 1  TON
4. 将信息发送到另一个地址（可以发送给自己，发送到同一个钱包）。

这样，Tonkeeper 钱包应用程序就会部署钱包合约，我们就可以在下面的步骤中使用它了。

:::note
在编写本教程时，TON 上的大多数钱包应用程序默认使用钱包 v4 版本。本教程不需要插件，我们将使用钱包 v3 提供的功能。在使用过程中，Tonkeeper 允许用户选择所需的钱包版本。因此，建议部署钱包版本 3（钱包 v3）。
:::

### TL-B

在本节中，我们将详细研究 [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb)。在将来的开发中，此文件将非常有用，因为它描述了不同cell的组装方式。在我们的情况下，它详细描述了内部和外部交易的复杂性。

在本节中，我们将研究 [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb)。该文件将在未来的开发过程中非常有用，因为它描述了不同 cell 应如何组装。具体到我们的例子，它详细说明了内部和外部信息的复杂性。

:::info
本指南将提供基本信息。如需了解更多详情，请参阅我们的 TL-B [文档](/v3/documentation/data-formats/tlb/tl-b-language)，了解有关 TL-B 的更多信息。
:::

### CommonMsgInfo

您可以从 [TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L127-L128) 中看到，**仅在与 ext_in_msg_info 类型一起使用时才可以使用 CommonMsgInfo**。因为交易类型字段，如 `src`、`created_lt`、`created_at` 等，由验证者在交易处理期间进行重写。在这种情况下，`src` 交易类型最重要，因为当发送交易时，发送者是未知的，验证者在验证期间对其在 `src` 字段中的地址进行重写。这样确保 `src` 字段中的地址是正确的，并且不能被操纵。

但是，`CommonMsgInfo` 结构仅支持 `MsgAddress` 规格，但通常情况下发送方的地址是未知的，并且需要写入 `addr_none`（两个零位 `00`）。在这种情况下，使用 `CommonMsgInfoRelaxed` 结构，该结构支持 `addr_none` 地址。对于 `ext_in_msg_info`（用于传入的外部消息），使用 `CommonMsgInfo` 结构，因为这些消息类型不使用sender，始终使用 [MsgAddressExt](https://hub.com/ton/ton.blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L100) 结构（`addr_none$00` 表示两个零位），因此无需覆盖数据。

[查看 TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L127-L128)，您会注意到**当与 ext_in_msg_info 类型**一起使用时，只有 CommonMsgInfo 可用。这是因为诸如 `src`、`created_lt`、`created_at` 等消息字段会在事务处理过程中被验证器重写。在这种情况下，消息中的 `src` 字段最为重要，因为在发送消息时，发件人是未知的，验证程序在验证时会写入该字段。这样可以确保 `src` 字段中的地址是正确的，不会被篡改。

但是，`CommonMsgInfo` 结构只支持 `MsgAddress` 规格，但发件人地址通常是未知的，因此需要写入 "addr_none"（两个零位 "00"）。在这种情况下，使用支持 `addr_none` 地址的 `CommonMsgInfoRelaxed` 结构。对于 `ext_in_msg_info`（用于传入的外部报文），则使用 `CommonMsgInfo` 结构，因为这些消息类型不使用 sender，始终使用[MsgAddressExt](https://hub.com/ton/ton.blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L100) 结构（`addr_none$00` 表示两个零位），这意味着无需覆盖数据。

:::note
`$`符号后面的数字是在某个结构的开始处所要求存储的位，以便在读取时（反序列化）可进一步识别这些结构。
:::

### 创建内部信息

让我们首先考虑 `0x18` 和 `0x10`（x - 16 进制），这些十六进制数是按以下方式排列的（考虑到我们分配了 6 个位）：`011000` 和 `010000`。这意味着，可以将上述代码重写为以下内容：

```func
var msg = begin_cell()
  .store_uint(0x18, 6) ;; or 0x10 for non-bounce
  .store_slice(to_address)
  .store_coins(amount)
  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
  ;; store something as a body
```

现在我们来详细解释每个选项：

```func
var msg = begin_cell()
  .store_uint(0, 1) ;; this bit indicates that we send an internal message according to int_msg_info$0  
  .store_uint(1, 1) ;; IHR Disabled
  .store_uint(1, 1) ;; or .store_uint(0, 1) for 0x10 | bounce
  .store_uint(0, 1) ;; bounced
  .store_uint(0, 2) ;; src -> two zero bits for addr_none
  .store_slice(to_address)
  .store_coins(amount)
  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
  ;; store something as a body
```

现在，让我们详细了解每个选项：

|      选项      |                                                                                                                                           说明                                                                                                                                           |
| :----------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| IHR Disabled | 目前，由于即时超立方路由（Instant Hypercube Routing）尚未完全实现，因此该选项被禁用（即存储 1）。此外，当网络上有大量 [Shardchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#many-accountchains-shards) 时，也需要使用该选项。有关禁用 IHR 选项的更多信息，请参阅 [tblkch.pdf](https://ton.org/tblkch.pdf)（第 2 章）。 |
|    Bounce    |                              在发送信息时，智能合约处理过程中可能会出现各种错误。为避免损失 TON，有必要将 Bounce 选项设置为 1（true）。在这种情况下，如果在交易处理过程中出现任何合约错误，信息将被退回给发送方，同时会收到扣除费用后的相同数量的 TON。关于不可反弹报文的更多信息，请参阅 [此处](/v3/documentation/smart-contracts/message-management/non-bounceable-messages)。                             |
|    Bounced   |                                                                                                                   退回信息是指由于智能合约处理交易时发生错误而退回给发件人的信息。该选项会告诉你收到的信息是否被退回。                                                                                                                   |
|      Src     |                                                                                                                     Src 是发件人地址。在这种情况下，会写入两个 0 位来表示 `addr_none` 地址。                                                                                                                     |

最后，我们来看剩下的代码行：

```func
...
.store_slice(to_address)
.store_coins(amount)
...
```

- 我们指定收件人和要发送的 TON 数。

上述值（包括 Src）具有以下特征，但不包括 State Init 和 Message Body 位，由验证者重写。

```func
...
  .store_uint(0, 1) ;; Extra currency
  .store_uint(0, 4) ;; IHR fee
  .store_uint(0, 4) ;; Forwarding fee
  .store_uint(0, 64) ;; Logical time of creation
  .store_uint(0, 32) ;; UNIX time of creation
  .store_uint(0, 1) ;; State Init
  .store_uint(0, 1) ;; Message body
  ;; store something as a body
```

|            选项            |                                                                       说明                                                                      |
| :----------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------: |
|      Extra currency      |                                                           这是现有 jetton 的本机实现，目前尚未使用。                                                           |
|          IHR fee         | 如前所述，目前 IHR 尚未启用，因此该费用始终为零。您可以在 [tblkch.pdf](https://ton.org/tblkch.pdf)（第 3.1.8 节）中了解更多相关信息。 |
|      Forwarding fee      |                转发信息费用。更多信息请参阅[费用文档](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#transactions-and-phases)。               |
| Logical time of creation |                                                                 用于创建正确信息队列的时间。                                                                |
|   UNIX time of creation  |                                                                信息在 UNIX 中创建的时间。                                                               |
|        State Init        |               部署智能合约的代码和源代码。如果该位被设置为 `0`，则表示我们没有 State Init。但如果该位被设置为 `1`，则需要写入另一位，该位表示 State Init 是存储在同一 cell 中（0）还是作为引用写入（1）。               |
|       Message body       |                   这部分定义了如何存储报文正文。有时，信息正文太大，无法放入信息本身。在这种情况下，应将其存储为 **引用**，将该位设置为 `1` ，表示正文被用作引用。如果该位为 `0`，则正文与信息存放在同一 cell 中。                  |

接下来，我们将开始准备一个交易，该交易将向另一个钱包 v3 发送 Toncoins。首先，假设用户想要向自己发送 0.5 TON，并附带文本“**你好，TON！**”，请参阅本文档的这一部分来了解[如何发送带有评论的消息](/develop/func/cookbook#how-to-send-a-simple-message)。

:::note
如果数字值适合的比特数少于指定的比特数，那么缺失的零将被添加到数值的左边。例如，0x18 适合 5 位 -> `11000`。但是，由于指定的是 6 位，最终结果就变成了 `011000`。
:::

接下来，我们开始准备一条消息，将 Toncoin 发送到另一个钱包 v3。
首先，假设用户想给自己发送 0.5 TON，并附上文字  "**Hello, TON!**"，请参考我们文档中的这部分内容（[如何发送带注释的消息](/v3/documentation/smart-contracts/func/cookbook#how-to-send-a-simple-message)）。

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { beginCell } from '@ton/core';

let internalMessageBody = beginCell()
  .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
  .storeStringTail("Hello, TON!") // write our text comment
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
	"github.com/xssnick/tonutils-go/tvm/cell"
)

internalMessageBody := cell.BeginCell().
  MustStoreUInt(0, 32). // write 32 zero bits to indicate that a text comment will follow
  MustStoreStringSnake("Hello, TON!"). // write our text comment
  EndCell()
```

</TabItem>
</Tabs>

上面我们创建了一个 `InternalMessageBody`（内部消息体），消息的正文就存储在其中。请注意，当存储的文本不适合单个 cell （1023 位）时，有必要**根据 [以下文档](/v3/documentation/smart-contracts/message-management/internal-messages) 将数据分割成多个 cell**。不过，在这种情况下，高级库会根据要求创建 cell ，因此现阶段无需担心这个问题。

接下来，我们将根据之前研究的信息创建 `内部消息`（InternalMessage），具体如下：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { toNano, Address } from '@ton/ton';

const walletAddress = Address.parse('put your wallet address');

let internalMessage = beginCell()
  .storeUint(0, 1) // indicate that it is an internal message -> int_msg_info$0
  .storeBit(1) // IHR Disabled
  .storeBit(1) // bounce
  .storeBit(0) // bounced
  .storeUint(0, 2) // src -> addr_none
  .storeAddress(walletAddress)
  .storeCoins(toNano("0.2")) // amount
  .storeBit(0) // Extra currency
  .storeCoins(0) // IHR Fee
  .storeCoins(0) // Forwarding Fee
  .storeUint(0, 64) // Logical time of creation
  .storeUint(0, 32) // UNIX time of creation
  .storeBit(0) // No State Init
  .storeBit(1) // We store Message Body as a reference
  .storeRef(internalMessageBody) // Store Message Body as a reference
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/tlb"
)

walletAddress := address.MustParseAddr("put your address")

internalMessage := cell.BeginCell().
  MustStoreUInt(0, 1). // indicate that it is an internal message -> int_msg_info$0
  MustStoreBoolBit(true). // IHR Disabled
  MustStoreBoolBit(true). // bounce
  MustStoreBoolBit(false). // bounced
  MustStoreUInt(0, 2). // src -> addr_none
  MustStoreAddr(walletAddress).
  MustStoreCoins(tlb.MustFromTON("0.2").NanoTON().Uint64()).   // amount
  MustStoreBoolBit(false). // Extra currency
  MustStoreCoins(0). // IHR Fee
  MustStoreCoins(0). // Forwarding Fee
  MustStoreUInt(0, 64). // Logical time of creation
  MustStoreUInt(0, 32). // UNIX time of creation
  MustStoreBoolBit(false). // No State Init
  MustStoreBoolBit(true). // We store Message Body as a reference
  MustStoreRef(internalMessageBody). // Store Message Body as a reference
  EndCell()
```

</TabItem>
</Tabs>

### 创建信息

有必要检索我们钱包智能合约的 `seqno`（序列号）。为此，需要创建一个 `Client`，用来发送请求，运行钱包的获取方法 `seqno`。此外，还需要添加一个种子短语（在创建钱包 [此处](#--external-and-internal-messages) 时保存），以便通过以下步骤签署我们的信息：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from '@ton/ton';
import { mnemonicToWalletKey } from '@ton/crypto';

const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC", // you can replace it on https://testnet.toncenter.com/api/v2/jsonRPC for testnet
  apiKey: "put your api key" // you can get an api key from @tonapibot bot in Telegram
});

const mnemonic = 'put your mnemonic'; // word1 word2 word3
let getMethodResult = await client.runMethod(walletAddress, "seqno"); // run "seqno" GET method from your wallet contract
let seqno = getMethodResult.stack.readNumber(); // get seqno from response

const mnemonicArray = mnemonic.split(' '); // get array from string
const keyPair = await mnemonicToWalletKey(mnemonicArray); // get Secret and Public keys from mnemonic 
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "context"
  "crypto/ed25519"
  "crypto/hmac"
  "crypto/sha512"
  "github.com/xssnick/tonutils-go/liteclient"
  "github.com/xssnick/tonutils-go/ton"
  "golang.org/x/crypto/pbkdf2"
  "log"
  "strings"
)

mnemonic := strings.Split("put your mnemonic", " ") // get our mnemonic as array

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection) // create client

block, err := client.CurrentMasterchainInfo(context.Background()) // get current block, we will need it in requests to LiteServer
if err != nil {
  log.Fatalln("CurrentMasterchainInfo err:", err.Error())
  return
}

getMethodResult, err := client.RunGetMethod(context.Background(), block, walletAddress, "seqno") // run "seqno" GET method from your wallet contract
if err != nil {
  log.Fatalln("RunGetMethod err:", err.Error())
  return
}
seqno := getMethodResult.MustInt(0) // get seqno from response

// The next three lines will extract the private key using the mnemonic phrase. We will not go into cryptographic details. With the tonutils-go library, this is all implemented, but we’re doing it again to get a full understanding.
mac := hmac.New(sha512.New, []byte(strings.Join(mnemonic, " ")))
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries "TON default seed" is used as salt when getting keys

privateKey := ed25519.NewKeyFromSeed(k)
```

</TabItem>
</Tabs>

因此，需要发送 `seqno`、`keys` 和 `internal message`。现在，我们需要为钱包创建一个 [消息](/v3/documentation/smart-contracts/message-management/sending-messages)，并按照教程开头使用的序列将数据存储在该消息中。具体步骤如下

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { sign } from '@ton/crypto';

let toSign = beginCell()
  .storeUint(698983191, 32) // subwallet_id | We consider this further
  .storeUint(Math.floor(Date.now() / 1e3) + 60, 32) // Message expiration time, +60 = 1 minute
  .storeUint(seqno, 32) // store seqno
  .storeUint(3, 8) // store mode of our internal message
  .storeRef(internalMessage); // store our internalMessage as a reference

let signature = sign(toSign.endCell().hash(), keyPair.secretKey); // get the hash of our message to wallet smart contract and sign it to get signature

let body = beginCell()
  .storeBuffer(signature) // store signature
  .storeBuilder(toSign) // store our message
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "time"
)

toSign := cell.BeginCell().
  MustStoreUInt(698983191, 32). // subwallet_id | We consider this further
  MustStoreUInt(uint64(time.Now().UTC().Unix()+60), 32). // Message expiration time, +60 = 1 minute
  MustStoreUInt(seqno.Uint64(), 32). // store seqno
  MustStoreUInt(uint64(3), 8). // store mode of our internal message
  MustStoreRef(internalMessage) // store our internalMessage as a reference

signature := ed25519.Sign(privateKey, toSign.EndCell().Hash()) // get the hash of our message to wallet smart contract and sign it to get signature

body := cell.BeginCell().
  MustStoreSlice(signature, 512). // store signature
  MustStoreBuilder(toSign). // store our message
  EndCell()
```

</TabItem>
</Tabs>

要从外部世界将任何内部消息传递到区块链中，需要将其包含在外部交易中发送。正如我们之前讨论的那样，仅需要使用 `ext_in_msg_info$10` 结构，因为目标是将外部消息发送到我们的合约中。现在，我们创建一个外部消息，将发送到我们的钱包：

:::tip Wallet V4
除了基本的验证过程外，我们还了解到 Wallet V3、Wallet V4 智能合约 [提取操作码以确定是简单翻译还是与插件相关的消息](https://github.com/ton-blockchain/wallet-contract/blob/4111fd9e3313ec17d99ca9b5b1656445b5b49d8f/func/wallet-v4-code.fc#L94-L100) 是必需的。为了与该版本相匹配，有必要在写入 seqno（序列号）之后和指定交易模式之前添加 `storeUint(0, 8).` (JS/TS), `MustStoreUInt(0, 8).` (Golang)函数。
:::

### 创建外部信息

要从外部世界向区块链传递任何内部消息，都必须在外部消息中发送。正如我们之前所考虑的，只需使用 `ext_in_msg_info$10` 结构即可，因为我们的目标是向我们的合约发送外部消息。现在，让我们创建一条将发送到钱包的外部消息：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
let externalMessage = beginCell()
  .storeUint(0b10, 2) // 0b10 -> 10 in binary
  .storeUint(0, 2) // src -> addr_none
  .storeAddress(walletAddress) // Destination address
  .storeCoins(0) // Import Fee
  .storeBit(0) // No State Init
  .storeBit(1) // We store Message Body as a reference
  .storeRef(body) // Store Message Body as a reference
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
externalMessage := cell.BeginCell().
  MustStoreUInt(0b10, 2). // 0b10 -> 10 in binary
  MustStoreUInt(0, 2). // src -> addr_none
  MustStoreAddr(walletAddress). // Destination address
  MustStoreCoins(0). // Import Fee
  MustStoreBoolBit(false). // No State Init
  MustStoreBoolBit(true). // We store Message Body as a reference
  MustStoreRef(body). // Store Message Body as a reference
  EndCell()
```

</TabItem>
</Tabs>

|      选项      |                                                                                              说明                                                                                             |
| :----------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|      Src     | 发件人地址。由于收到的外部报文不可能有发件人，因此总是有 2 个零位（addr_none [TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L100)）。 |
|  Import Fee  |                                                                                        用于支付导入外部信息的费用。                                                                                       |
|  State Init  |                                                         与内部信息不同，外部信息中的 State Init 是 **从外部世界** 部署合约所必需的。状态初始与内部报文结合使用，可以让一个合约部署另一个合约。                                                        |
| Message Body |                                                                                       必须发送给合约进行处理的信息。                                                                                       |

:::tip 0b10
0b10（b - 二进制）表示二进制记录。在此过程中，会存储两个比特：`1` 和 `0`。因此，我们指定为 `ext_in_msg_info$10`。
:::

现在，我们有了一条已完成的消息，可以发送给我们的合约了。要做到这一点，首先应将其序列化为`BOC`（[Bag of Cells](/v3/documentation/data-formats/tlb/cell-boc#bag-of-cells)），然后使用以下代码发送：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
console.log(externalMessage.toBoc().toString("base64"))

client.sendFile(externalMessage.toBoc());
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "encoding/base64"
  "github.com/xssnick/tonutils-go/tl"
)

log.Println(base64.StdEncoding.EncodeToString(externalMessage.ToBOCWithFlags(false)))

var resp tl.Serializable
err = client.Client().QueryLiteserver(context.Background(), ton.SendMessage{Body: externalMessage.ToBOCWithFlags(false)}, &resp)

if err != nil {
  log.Fatalln(err.Error())
  return
}
```

</TabItem>
</Tabs>

> 💡 Useful link:
>
> [Bag of Cells 的更多信息](/v3/documentation/data-formats/tlb/cell-boc#bag-of-cells)

在本节中，我们将介绍如何从头开始创建钱包（钱包v3）。您将学习如何为钱包智能合约编译代码，生成助记词短语，获得钱包地址，并使用外部交易和State Init部署钱包。

## 生成助记词

正确定义钱包所需的第一件事是检索`private`和`public`密钥。为了完成这个任务，需要生成助记词种子短语，然后使用加密库提取私钥和公钥。

通过以下方式实现：

### 生成助记符

要正确创建钱包，首先需要获取 "私钥 "和 "公钥"。要完成这项任务，需要生成一个助记种子短语，然后使用加密库提取私钥和公钥。

具体做法如下

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { mnemonicToWalletKey, mnemonicNew } from '@ton/crypto';

// const mnemonicArray = 'put your mnemonic'.split(' ') // get our mnemonic as array
const mnemonicArray = await mnemonicNew(24); // 24 is the number of words in a seed phrase
const keyPair = await mnemonicToWalletKey(mnemonicArray); // extract private and public keys from mnemonic
console.log(mnemonicArray) // if we want, we can print our mnemonic
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
	"crypto/ed25519"
	"crypto/hmac"
	"crypto/sha512"
	"log"
	"github.com/xssnick/tonutils-go/ton/wallet"
	"golang.org/x/crypto/pbkdf2"
	"strings"
)

// mnemonic := strings.Split("put your mnemonic", " ") // get our mnemonic as array
mnemonic := wallet.NewSeed() // get new mnemonic

// The following three lines will extract the private key using the mnemonic phrase. We will not go into cryptographic details. It has all been implemented in the tonutils-go library, but it immediately returns the finished object of the wallet with the address and ready methods. So we’ll have to write the lines to get the key separately. Goland IDE will automatically import all required libraries (crypto, pbkdf2 and others).
mac := hmac.New(sha512.New, []byte(strings.Join(mnemonic, " "))) 
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries "TON default seed" is used as salt when getting keys
// 32 is a key len 

privateKey := ed25519.NewKeyFromSeed(k) // get private key
publicKey := privateKey.Public().(ed25519.PublicKey) // get public key from private key
log.Println(publicKey) // print publicKey so that at this stage the compiler does not complain that we do not use our variable
log.Println(mnemonic) // if we want, we can print our mnemonic
```

</TabItem>
</Tabs>

钱包作为智能合约的最显着优势之一是能够仅使用一个私钥创建**大量的钱包**。这是因为TON区块链上的智能合约地址是使用多个因素计算出来的，其中包括`stateInit`。stateInit包含了`代码`和`初始数据`，这些数据存储在区块链的智能合约存储中。

:::danger 重要事项
有必要将生成的助记符种子短语输出到控制台，然后保存并使用（如上一节所述），以便每次运行钱包代码时使用相同的配对密钥。
:::

### 子钱包 ID

根据TON区块链的源代码中的[代码行](https://github.com/ton-blockchain/ton/blob/4b940f8bad9c2d3bf44f196f6995963c7cee9cc3/tonlib/tonlib/TonlibClient.cpp#L2420)，默认的`subwallet_id`值为`698983191`：

可以从[配置文件](https://ton.org/global-config.json)中获取创世块信息（zero_state）。了解其复杂性和细节并非必要，但重要的是要记住`subwallet_id`的默认值为`698983191`。

每个钱包合约都会检查外部交易的subwallet_id字段，以避免将请求发送到具有不同ID的钱包的情况：

```cpp
res.wallet_id = td::as<td::uint32>(res.config.zero_state_id.root_hash.as_slice().data());
```

我们需要将以上的值添加到合约的初始数据中，所以变量需要保存如下：

每个钱包合约都会检查外部信息的 subwallet_id 字段，以避免请求被发送到另一个 ID 的钱包：

```func
var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32));
var (stored_seqno, stored_subwallet, public_key) = (ds~load_uint(32), ds~load_uint(32), ds~load_uint(256));
throw_unless(34, subwallet_id == stored_subwallet);
```

我们需要将上述值添加到合约的初始数据中，因此需要按如下方式保存变量：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const subWallet = 698983191;
```

</TabItem>
<TabItem value="go" label="Golang">

```go
var subWallet uint64 = 698983191
```

</TabItem>
</Tabs>

### 编译钱包代码

我们将仅使用JavaScript来编译代码，因为用于编译代码的库基于JavaScript。
但是，一旦编译完成，只要我们拥有编译后的cell的**base64输出**，就可以在其他编程语言（如Go等）中使用这些编译后的代码。

首先，我们需要创建两个文件：`wallet_v3.fc`和`stdlib.fc`。编译器和stdlib.fc库一起使用。库中创建了所有必需的基本函数，这些函数对应于`asm`指令。可以从[这里](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc)下载stdlib.fc文件。在`wallet_v3.fc`文件中，需要复制上面的代码。

```bash
npm i --save @ton-community/func-js
```

现在，我们为我们正在创建的项目有了以下结构：

首先，我们需要创建两个文件：`wallet_v3.fc` 和 `stdlib.fc`。编译器使用 stdlib.fc 库。库中创建了与 `asm` 指令相对应的所有必要的基本函数。可下载 stdlib.fc 文件 [此处](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc)。在 `wallet_v3.fc` 文件中，需要复制上述代码。

请记住，在`wallet_v3.fc`文件的开头添加以下行，以指示将在下面使用stdlib中的函数：

```
.
├── src/
│   ├── main.ts
│   ├── wallet_v3.fc
│   └── stdlib.fc
├── nodemon.json
├── package-lock.json
├── package.json
└── tsconfig.json
```

:::info
如果您的 IDE 插件与 `stdlib.fc` 文件中的 `() set_seed(int) impure asm "SETRAND";`冲突，也没关系。
:::

现在，让我们编写代码来编译我们的智能合约并使用`npm run start:dev`来运行它：

```func
#include "stdlib.fc";
```

终端的输出结果如下：

```js
import { compileFunc } from '@ton-community/func-js';
import fs from 'fs'; // we use fs for reading content of files
import { Cell } from '@ton/core';

const result = await compileFunc({
targets: ['wallet_v3.fc'], // targets of your project
sources: {
    "stdlib.fc": fs.readFileSync('./src/stdlib.fc', { encoding: 'utf-8' }),
    "wallet_v3.fc": fs.readFileSync('./src/wallet_v3.fc', { encoding: 'utf-8' }),
}
});

if (result.status === 'error') {
console.error(result.message)
return;
}

const codeCell = Cell.fromBoc(Buffer.from(result.codeBoc, "base64"))[0]; // get buffer from base64 encoded BOC and get cell from this buffer

// now we have base64 encoded BOC with compiled code in result.codeBoc
console.log('Code BOC: ' + result.codeBoc);
console.log('\nHash: ' + codeCell.hash().toString('base64')); // get the hash of cell and convert in to base64 encoded string. We will need it further
```

完成后，可以使用其他库和语言使用我们的钱包代码检索相同的cell（使用base64编码的输出）：

```text
Code BOC: te6ccgEBCAEAhgABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQCW8oMI1xgg0x/TH9MfAvgju/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOgwAaTIyx/LH8v/ye1UAATQMAIBSAYHABe7Oc7UTQ0z8x1wv/gAEbjJftRNDXCx+A==

Hash: idlku00WfSC36ujyK2JVT92sMBEpCNRUXOGO4sJVBPA=
```

一旦完成，就可以使用其他库和语言，用我们的钱包代码检索相同的 cell （使用 base64 编码输出）：

<Tabs groupId="code-examples">
<TabItem value="go" label="Golang">

```go
import (
  "encoding/base64"
  "github.com/xssnick/tonutils-go/tvm/cell"
)

base64BOC := "te6ccgEBCAEAhgABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQCW8oMI1xgg0x/TH9MfAvgju/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOgwAaTIyx/LH8v/ye1UAATQMAIBSAYHABe7Oc7UTQ0z8x1wv/gAEbjJftRNDXCx+A==" // save our base64 encoded output from compiler to variable
codeCellBytes, _ := base64.StdEncoding.DecodeString(base64BOC) // decode base64 in order to get byte array
codeCell, err := cell.FromBOC(codeCellBytes) // get cell with code from byte array
if err != nil { // check if there are any error
  panic(err) 
}

log.Println("Hash:", base64.StdEncoding.EncodeToString(codeCell.Hash())) // get the hash of our cell, encode it to base64 because it has []byte type and output to the terminal
```

</TabItem>
</Tabs>

完成上述过程后，确认我们的cell中正在使用正确的代码，因为哈希值相匹配。

```text
idlku00WfSC36ujyK2JVT92sMBEpCNRUXOGO4sJVBPA=
```

在构建交易之前，了解State Init非常重要。首先让我们了解[TL-B方案](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L141-L143)：

### 为部署创建状态初始

在创建信息之前，了解什么是 State Init 是非常重要的。首先让我们来了解一下 [TL-B 方案](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L141-L143)：

|                选项                |                                                                                                                                                     说明                                                                                                                                                     |
| :------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| split_depth | 该选项适用于高负载智能合约，这些合约可以拆分并位于多个 [shardchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#many-accountchains-shards)。  有关其工作原理的详细信息，请参阅 [tblkch.pdf](https://ton.org/tblkch.pdf) (4.1.6)。  由于只在钱包智能合约中使用，因此只存储`0`位。 |
|              special             |                   用于 TicTok。每个区块都会自动调用这些智能合约，普通智能合约不需要。相关信息可参见 [此章节](/v3/documentation/data-formats/tlb/transaction-layout#tick-tock) 或 [tblkch.pdf](https://ton.org/tblkch.pdf) (4.1.6)。本规范中只存储了 `0` 位，因为我们不需要这样的函数。                   |
|               code               |                                                                                                                                            `1` 位表示存在智能合约代码作为参考。                                                                                                                                            |
|               data               |                                                                                                                                            `1` 位表示存在智能合约数据作为参考。                                                                                                                                            |
|              library             |             在 [主链](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#masterchain-blockchain-of-blockchains) 上运行的库，可用于不同的智能合约。它不会用于钱包，因此其位设置为 `0`。相关信息可参见 [tblkch.pdf](https://ton.org/tblkch.pdf) (1.8.4)。            |

接下来，我们将准备 `initial data`，这些数据将在部署后立即出现在我们的合约存储中：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { beginCell } from '@ton/core';

const dataCell = beginCell()
  .storeUint(0, 32) // Seqno
  .storeUint(698983191, 32) // Subwallet ID
  .storeBuffer(keyPair.publicKey) // Public Key
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
dataCell := cell.BeginCell().
  MustStoreUInt(0, 32). // Seqno
  MustStoreUInt(698983191, 32). // Subwallet ID
  MustStoreSlice(publicKey, 256). // Public Key
  EndCell()
```

</TabItem>
</Tabs>

在这个阶段，合约的 `code` 和 `initial data` 都已存在。有了这些数据，我们就可以生成**钱包地址**。钱包地址取决于 State Init，其中包括代码和初始数据。

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address } from '@ton/core';

const stateInit = beginCell()
  .storeBit(0) // No split_depth
  .storeBit(0) // No special
  .storeBit(1) // We have code
  .storeRef(codeCell)
  .storeBit(1) // We have data
  .storeRef(dataCell)
  .storeBit(0) // No library
  .endCell();

const contractAddress = new Address(0, stateInit.hash()); // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
console.log(`Contract address: ${contractAddress.toString()}`); // Output contract address to console
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/address"
)

stateInit := cell.BeginCell().
  MustStoreBoolBit(false). // No split_depth
  MustStoreBoolBit(false). // No special
  MustStoreBoolBit(true). // We have code
  MustStoreRef(codeCell).
  MustStoreBoolBit(true). // We have data
  MustStoreRef(dataCell).
  MustStoreBoolBit(false). // No library
  EndCell()

contractAddress := address.NewAddress(0, 0, stateInit.Hash()) // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
log.Println("Contract address:", contractAddress.String()) // Output contract address to console
```

</TabItem>
</Tabs>

现在，我们可以使用 State Init 创建信息并将其发送到区块链上。

:::warning
To carry out this process, **a minimum wallet balance of 0.1 TON** is required (the balance can be less, but this amount is guaranteed to be sufficient). To accomplish this, we’ll need to run the code mentioned earlier in the tutorial, obtain the correct wallet address, and send 0.1 TON to this address. Alternatively, you can send this sum manually via your wallet app before sending the deployment message itself.

这里介绍的通过外部消息部署主要是出于教育目的；实际上，[通过钱包部署智能合约](/v3/guidelines/smart-contracts/howto/wallet#contract-deployment-via-wallet) 要方便得多，这将在后面介绍。
:::

首先，让我们创建一个与 **上一节** 中类似的信息：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { sign } from '@ton/crypto';
import { toNano } from '@ton/core';

const internalMessageBody = beginCell()
  .storeUint(0, 32)
  .storeStringTail("Hello, TON!")
  .endCell();

const internalMessage = beginCell()
  .storeUint(0x10, 6) // no bounce
  .storeAddress(Address.parse("put your first wallet address from were you sent 0.1 TON"))
  .storeCoins(toNano("0.03"))
  .storeUint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1) // We store 1 that means we have body as a reference
  .storeRef(internalMessageBody)
  .endCell();

// message for our wallet
const toSign = beginCell()
  .storeUint(subWallet, 32)
  .storeUint(Math.floor(Date.now() / 1e3) + 60, 32)
  .storeUint(0, 32) // We put seqno = 0, because after deploying wallet will store 0 as seqno
  .storeUint(3, 8)
  .storeRef(internalMessage);

const signature = sign(toSign.endCell().hash(), keyPair.secretKey);
const body = beginCell()
  .storeBuffer(signature)
  .storeBuilder(toSign)
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/tlb"
  "time"
)

internalMessageBody := cell.BeginCell().
  MustStoreUInt(0, 32).
  MustStoreStringSnake("Hello, TON!").
  EndCell()

internalMessage := cell.BeginCell().
  MustStoreUInt(0x10, 6). // no bounce
  MustStoreAddr(address.MustParseAddr("put your first wallet address from were you sent 0.1 TON")).
  MustStoreBigCoins(tlb.MustFromTON("0.03").NanoTON()).
  MustStoreUInt(1, 1 + 4 + 4 + 64 + 32 + 1 + 1). // We store 1 that means we have body as a reference
  MustStoreRef(internalMessageBody).
  EndCell()

// message for our wallet
toSign := cell.BeginCell().
  MustStoreUInt(subWallet, 32).
  MustStoreUInt(uint64(time.Now().UTC().Unix()+60), 32).
  MustStoreUInt(0, 32). // We put seqno = 0, because after deploying wallet will store 0 as seqno
  MustStoreUInt(3, 8).
  MustStoreRef(internalMessage)

signature := ed25519.Sign(privateKey, toSign.EndCell().Hash())
body := cell.BeginCell().
  MustStoreSlice(signature, 512).
  MustStoreBuilder(toSign).
	EndCell()
```

</TabItem>
</Tabs>

主要的区别将在外部消息的存在上，因为State Init被存储用于正确的合约部署。由于合约尚无自己的代码，因此无法处理任何内部消息。因此，接下来，我们将在成功部署后发送其代码和初始数据，以便可处理我们带有“Hello, TON！”评论的消息：

### 发送外部信息

**主要区别**在于外部信息的存在，因为 state Init 的存储是为了帮助正确部署合约。由于合约还没有自己的代码，因此无法处理任何内部信息。因此，接下来我们将在它成功部署后**发送它的代码和初始数据，以便它能处理我们的消息**，并注释为 "Hello, TON!"：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const externalMessage = beginCell()
  .storeUint(0b10, 2) // indicate that it is an incoming external message
  .storeUint(0, 2) // src -> addr_none
  .storeAddress(contractAddress)
  .storeCoins(0) // Import fee
  .storeBit(1) // We have State Init
  .storeBit(1) // We store State Init as a reference
  .storeRef(stateInit) // Store State Init as a reference
  .storeBit(1) // We store Message Body as a reference
  .storeRef(body) // Store Message Body as a reference
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
externalMessage := cell.BeginCell().
  MustStoreUInt(0b10, 2). // indicate that it is an incoming external message
  MustStoreUInt(0, 2). // src -> addr_none
  MustStoreAddr(contractAddress).
  MustStoreCoins(0). // Import fee
  MustStoreBoolBit(true). // We have State Init
  MustStoreBoolBit(true).  // We store State Init as a reference
  MustStoreRef(stateInit). // Store State Init as a reference
  MustStoreBoolBit(true). // We store Message Body as a reference
  MustStoreRef(body). // Store Message Body as a reference
  EndCell()
```

</TabItem>
</Tabs>

最后，我们可以向区块链发送信息，部署我们的钱包并使用它。

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from '@ton/ton';

const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC",
  apiKey: "put your api key" // you can get an api key from @tonapibot bot in Telegram
});

client.sendFile(externalMessage.toBoc());
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "context"
  "github.com/xssnick/tonutils-go/liteclient"
  "github.com/xssnick/tonutils-go/tl"
  "github.com/xssnick/tonutils-go/ton"
)

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection)

var resp tl.Serializable
err = client.Client().QueryLiteserver(context.Background(), ton.SendMessage{Body: externalMessage.ToBOCWithFlags(false)}, &resp)
if err != nil {
  log.Fatalln(err.Error())
  return
}
```

</TabItem>
</Tabs>

请注意，我们使用 `3` 模式发送了内部信息。如果需要重复部署同一个钱包，**可以销毁智能合约**。为此，请正确设置模式，添加 128（取走智能合约的全部余额）+ 32（销毁智能合约），即 = `160`，以取回剩余的 TON 余额并再次部署钱包。

正如您可能已经知道的，[一个cell可以存储最多1023位的数据和最多4个指向其他cells的引用](/develop/data-formats/cell-boc#cell)。在本教程的第一部分中，我们详细介绍了内部消息是如何以“整体”循环作为链接发送的。这意味着可以**在外部消息内存储多达4条内部消息**。这允许同时发送四笔交易。

:::info
我们使用的合约代码是 [已验证](https://tonscan.org/tx/BL9T1i5DjX1JRLUn4z9JOgOWRKWQ80pSNevis26hGvc=)，因此您可以在 [这里](https://tonscan.org/address/EQDBjzo_iQCZh3bZSxFnK9ue4hLTOKgsCNKfC8LOUM4SlSCX#source) 看到一个示例。
:::

## 同时发送多条消息

正如您可能已经知道的，[一个cell可以存储最多1023位的数据和最多4个指向其他cells的引用](/develop/data-formats/cell-boc#cell)。在本教程的第一部分中，我们详细介绍了内部消息是如何以“整体”循环作为链接发送的。这意味着可以**在外部消息内存储多达4条内部消息**。这允许同时发送四笔交易。

### 同时发送多条信息

您可能已经知道，[一个 cell 最多可存储 1023 位数据和 4 个引用](/v3/documentation/data-formats/tlb/cell-boc#cell) 到其他 cell 。在本教程的第一部分，我们详细介绍了内部信息如何作为链接在 `整体` 循环中传递和发送。这意味着可以在外部**信息中**存储多达 4 条内部信息。这样就可以同时发送四条信息。

为此，有必要创建 4 条不同的内部信息。我们可以手动创建，也可以通过 "循环 "创建。我们需要定义 3 个数组：TON 数量数组、注释数组、消息数组。对于消息，我们需要准备另一个数组 - internalMessages。

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Cell } from '@ton/core';

const internalMessagesAmount = ["0.01", "0.02", "0.03", "0.04"];
const internalMessagesComment = [
  "Hello, TON! #1",
  "Hello, TON! #2",
  "", // Let's leave the third message without comment
  "Hello, TON! #4" 
]
const destinationAddresses = [
  "Put any address that belongs to you",
  "Put any address that belongs to you",
  "Put any address that belongs to you",
  "Put any address that belongs to you"
] // All 4 addresses can be the same

let internalMessages:Cell[] = []; // array for our internal messages
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/tvm/cell"
)

internalMessagesAmount := [4]string{"0.01", "0.02", "0.03", "0.04"}
internalMessagesComment := [4]string{
  "Hello, TON! #1",
  "Hello, TON! #2",
  "", // Let's leave the third message without comment
  "Hello, TON! #4",
}
destinationAddresses := [4]string{
  "Put any address that belongs to you",
  "Put any address that belongs to you",
  "Put any address that belongs to you",
  "Put any address that belongs to you",
} // All 4 addresses can be the same

var internalMessages [len(internalMessagesAmount)]*cell.Cell // array for our internal messages
```

</TabItem>
</Tabs>

所有信息的[发送模式](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes)都设置为 `mode 3`。  不过，如果需要不同的模式，可以创建一个数组来实现不同的目的。

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address, beginCell, toNano } from '@ton/core';

for (let index = 0; index < internalMessagesAmount.length; index++) {
  const amount = internalMessagesAmount[index];
  
  let internalMessage = beginCell()
      .storeUint(0x18, 6) // bounce
      .storeAddress(Address.parse(destinationAddresses[index]))
      .storeCoins(toNano(amount))
      .storeUint(0, 1 + 4 + 4 + 64 + 32 + 1);
      
  /*
      At this stage, it is not clear if we will have a message body. 
      So put a bit only for stateInit, and if we have a comment, in means 
      we have a body message. In that case, set the bit to 1 and store the 
      body as a reference.
  */

  if(internalMessagesComment[index] != "") {
    internalMessage.storeBit(1) // we store Message Body as a reference

    let internalMessageBody = beginCell()
      .storeUint(0, 32)
      .storeStringTail(internalMessagesComment[index])
      .endCell();

    internalMessage.storeRef(internalMessageBody);
  } 
  else 
    /*
        Since we do not have a message body, we indicate that 
        the message body is in this message, but do not write it, 
        which means it is absent. In that case, just set the bit to 0.
    */
    internalMessage.storeBit(0);
  
  internalMessages.push(internalMessage.endCell());
}
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/tlb"
)

for i := 0; i < len(internalMessagesAmount); i++ {
  amount := internalMessagesAmount[i]

  internalMessage := cell.BeginCell().
    MustStoreUInt(0x18, 6). // bounce
    MustStoreAddr(address.MustParseAddr(destinationAddresses[i])).
    MustStoreBigCoins(tlb.MustFromTON(amount).NanoTON()).
    MustStoreUInt(0, 1+4+4+64+32+1)

  /*
      At this stage, it is not clear if we will have a message body. 
      So put a bit only for stateInit, and if we have a comment, in means 
      we have a body message. In that case, set the bit to 1 and store the 
      body as a reference.
  */

  if internalMessagesComment[i] != "" {
    internalMessage.MustStoreBoolBit(true) // we store Message Body as a reference

    internalMessageBody := cell.BeginCell().
      MustStoreUInt(0, 32).
      MustStoreStringSnake(internalMessagesComment[i]).
      EndCell()

    internalMessage.MustStoreRef(internalMessageBody)
  } else {
    /*
        Since we do not have a message body, we indicate that
        the message body is in this message, but do not write it,
        which means it is absent. In that case, just set the bit to 0.
    */
    internalMessage.MustStoreBoolBit(false)
  }
  internalMessages[i] = internalMessage.EndCell()
}
```

</TabItem>
</Tabs>

现在，让我们利用 [第二章](/v3/guidelines/smart-contracts/howto/wallet#-deploying-a-wallet) 中的知识，为我们的钱包创建一个可以同时发送 4 条信息的钱包：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from '@ton/ton';
import { mnemonicToWalletKey } from '@ton/crypto';

const walletAddress = Address.parse('put your wallet address');
const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC",
  apiKey: "put your api key" // you can get an api key from @tonapibot bot in Telegram
});

const mnemonic = 'put your mnemonic'; // word1 word2 word3
let getMethodResult = await client.runMethod(walletAddress, "seqno"); // run "seqno" GET method from your wallet contract
let seqno = getMethodResult.stack.readNumber(); // get seqno from response

const mnemonicArray = mnemonic.split(' '); // get array from string
const keyPair = await mnemonicToWalletKey(mnemonicArray); // get Secret and Public keys from mnemonic 

let toSign = beginCell()
  .storeUint(698983191, 32) // subwallet_id
  .storeUint(Math.floor(Date.now() / 1e3) + 60, 32) // Message expiration time, +60 = 1 minute
  .storeUint(seqno, 32); // store seqno
  // Do not forget that if we use Wallet V4, we need to add .storeUint(0, 8) 
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
	"context"
	"crypto/ed25519"
	"crypto/hmac"
	"crypto/sha512"
	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/ton"
	"golang.org/x/crypto/pbkdf2"
	"log"
	"strings"
	"time"
)

walletAddress := address.MustParseAddr("put your wallet address")

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection)

mnemonic := strings.Split("put your mnemonic", " ") // word1 word2 word3
// The following three lines will extract the private key using the mnemonic phrase.
// We will not go into cryptographic details. In the library tonutils-go, it is all implemented,
// but it immediately returns the finished object of the wallet with the address and ready-made methods.
// So we’ll have to write the lines to get the key separately. Goland IDE will automatically import
// all required libraries (crypto, pbkdf2 and others).
mac := hmac.New(sha512.New, []byte(strings.Join(mnemonic, " ")))
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries "TON default seed" is used as salt when getting keys
// 32 is a key len
privateKey := ed25519.NewKeyFromSeed(k)              // get private key

block, err := client.CurrentMasterchainInfo(context.Background()) // get current block, we will need it in requests to LiteServer
if err != nil {
  log.Fatalln("CurrentMasterchainInfo err:", err.Error())
  return
}

getMethodResult, err := client.RunGetMethod(context.Background(), block, walletAddress, "seqno") // run "seqno" GET method from your wallet contract
if err != nil {
  log.Fatalln("RunGetMethod err:", err.Error())
  return
}
seqno := getMethodResult.MustInt(0) // get seqno from response

toSign := cell.BeginCell().
  MustStoreUInt(698983191, 32). // subwallet_id | We consider this further
  MustStoreUInt(uint64(time.Now().UTC().Unix()+60), 32). // message expiration time, +60 = 1 minute
  MustStoreUInt(seqno.Uint64(), 32) // store seqno
  // Do not forget that if we use Wallet V4, we need to add MustStoreUInt(0, 8). 
```

</TabItem>
</Tabs>

接下来，我们将在循环中添加之前创建的信息：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
for (let index = 0; index < internalMessages.length; index++) {
  const internalMessage = internalMessages[index];
  toSign.storeUint(3, 8) // store mode of our internal message
  toSign.storeRef(internalMessage) // store our internalMessage as a reference
}
```

</TabItem>
<TabItem value="go" label="Golang">

```go
for i := 0; i < len(internalMessages); i++ {
		internalMessage := internalMessages[i]
		toSign.MustStoreUInt(3, 8) // store mode of our internal message
		toSign.MustStoreRef(internalMessage) // store our internalMessage as a reference
}
```

</TabItem>
</Tabs>

现在，上述过程已经完成，让我们 **签署** 我们的信息，**构建外部信息**（如本教程前几节所述），然后 **发送** 到区块链：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { sign } from '@ton/crypto';

let signature = sign(toSign.endCell().hash(), keyPair.secretKey); // get the hash of our message to wallet smart contract and sign it to get signature

let body = beginCell()
    .storeBuffer(signature) // store signature
    .storeBuilder(toSign) // store our message
    .endCell();

let externalMessage = beginCell()
    .storeUint(0b10, 2) // ext_in_msg_info$10
    .storeUint(0, 2) // src -> addr_none
    .storeAddress(walletAddress) // Destination address
    .storeCoins(0) // Import Fee
    .storeBit(0) // No State Init
    .storeBit(1) // We store Message Body as a reference
    .storeRef(body) // Store Message Body as a reference
    .endCell();

client.sendFile(externalMessage.toBoc());
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/tl"
)

signature := ed25519.Sign(privateKey, toSign.EndCell().Hash()) // get the hash of our message to wallet smart contract and sign it to get signature

body := cell.BeginCell().
  MustStoreSlice(signature, 512). // store signature
  MustStoreBuilder(toSign). // store our message
  EndCell()

externalMessage := cell.BeginCell().
  MustStoreUInt(0b10, 2). // ext_in_msg_info$10
  MustStoreUInt(0, 2). // src -> addr_none
  MustStoreAddr(walletAddress). // Destination address
  MustStoreCoins(0). // Import Fee
  MustStoreBoolBit(false). // No State Init
  MustStoreBoolBit(true). // We store Message Body as a reference
  MustStoreRef(body). // Store Message Body as a reference
  EndCell()

var resp tl.Serializable
err = client.Client().QueryLiteserver(context.Background(), ton.SendMessage{Body: externalMessage.ToBOCWithFlags(false)}, &resp)

if err != nil {
  log.Fatalln(err.Error())
  return
}
```

</TabItem>
</Tabs>

:::info 连接错误
如果出现与 lite-server 连接（Golang）相关的错误，则必须运行代码，直到信息可以发送为止。这是因为 tonutils-go 库通过代码中指定的全局配置使用了多个不同的 lite-server。然而，并非所有 Lite 服务器都能接受我们的连接。
:::

现在让我们构建交易本身：

### NFT 转账

除了普通信息，用户之间还经常发送 NFT。遗憾的是，并非所有的库都包含专门用于这种智能合约的方法。因此，有必要创建代码，让我们能够构建用于发送 NFT 的消息。首先，让我们进一步熟悉 TON NFT [标准](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md)。

现在让我们构建交易本身：

- `query_id`：Query ID 在消息处理方面没有价值。NFT 合约不会验证它，只会读取它。当服务希望为其每条报文分配一个特定的查询 ID 以供识别时，这个值可能会很有用。因此，我们将其设置为 0。

- `response_destination`：处理所有权变更信息后，将产生额外的 TON。如果指定了该地址，它们将被发送到该地址，否则将保留在 NFT 余额中。

- `custom_payload`：custom_payload 用于执行特定任务，不与普通 NFT 一起使用。

- `forward_amount`：如果 forward_amount 不为零，指定的 TON 数将发送给新的所有者。这样，新的所有者就会知道他们收到了一些东西。

- `forward_payload`：forward_payload 是附加数据，可与 forward_amount 一起发送给新的所有者。例如，使用 forward_payload，用户可以[在 NFT 转移过程中添加注释](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#forward_payload-format)，如前面的教程所示。不过，虽然 forward_payload 是在 TON 的 NFT 标准中编写的，但区块链探索者并不完全支持显示各种详细信息。在显示 Jettons 时也存在同样的问题。

现在，让我们来构建信息本身：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address, beginCell, toNano } from '@ton/core';

const destinationAddress = Address.parse("put your wallet where you want to send NFT");
const walletAddress = Address.parse("put your wallet which is the owner of NFT")
const nftAddress = Address.parse("put your nft address");

// We can add a comment, but it will not be displayed in the explorers, 
// as it is not supported by them at the time of writing the tutorial.
const forwardPayload = beginCell()
  .storeUint(0, 32)
  .storeStringTail("Hello, TON!")
  .endCell();

const transferNftBody = beginCell()
  .storeUint(0x5fcc3d14, 32) // Opcode for NFT transfer
  .storeUint(0, 64) // query_id
  .storeAddress(destinationAddress) // new_owner
  .storeAddress(walletAddress) // response_destination for excesses
  .storeBit(0) // we do not have custom_payload
  .storeCoins(toNano("0.01")) // forward_amount
  .storeBit(1) // we store forward_payload as a reference
  .storeRef(forwardPayload) // store forward_payload as a .reference
  .endCell();

const internalMessage = beginCell().
  storeUint(0x18, 6). // bounce
  storeAddress(nftAddress).
  storeCoins(toNano("0.05")).
  storeUint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1). // We store 1 that means we have body as a reference
  storeRef(transferNftBody).
  endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/tlb"
  "github.com/xssnick/tonutils-go/tvm/cell"
)

destinationAddress := address.MustParseAddr("put your wallet where you want to send NFT")
walletAddress := address.MustParseAddr("put your wallet which is the owner of NFT")
nftAddress := address.MustParseAddr("put your nft address")

// We can add a comment, but it will not be displayed in the explorers,
// as it is not supported by them at the time of writing the tutorial.
forwardPayload := cell.BeginCell().
  MustStoreUInt(0, 32).
  MustStoreStringSnake("Hello, TON!").
  EndCell()

transferNftBody := cell.BeginCell().
  MustStoreUInt(0x5fcc3d14, 32). // Opcode for NFT transfer
  MustStoreUInt(0, 64). // query_id
  MustStoreAddr(destinationAddress). // new_owner
  MustStoreAddr(walletAddress). // response_destination for excesses
  MustStoreBoolBit(false). // we do not have custom_payload
  MustStoreBigCoins(tlb.MustFromTON("0.01").NanoTON()). // forward_amount
  MustStoreBoolBit(true). // we store forward_payload as a reference
  MustStoreRef(forwardPayload). // store forward_payload as a reference
  EndCell()

internalMessage := cell.BeginCell().
  MustStoreUInt(0x18, 6). // bounce
  MustStoreAddr(nftAddress).
  MustStoreBigCoins(tlb.MustFromTON("0.05").NanoTON()).
  MustStoreUInt(1, 1 + 4 + 4 + 64 + 32 + 1 + 1). // We store 1 that means we have body as a reference
  MustStoreRef(transferNftBody).
  EndCell()
```

</TabItem>
</Tabs>

NFT 传输操作码来自 [同一标准](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#tl-b-schema)。
现在，让我们按照本教程前几节的内容完成报文。完成信息所需的正确代码可在 [GitHub 代码库](/v3/guidelines/smart-contracts/howto/wallet#-source-code) 中找到。

现在，我们转向只有 V4 钱包使用的方法：

### Wallet v3 和 Wallet v4 获取方法

让我们考虑 `get_public_key` 和 `is_plugin_installed` 方法。选择这两种方法是因为，首先我们需要从 256 位数据中获取公钥，然后我们需要学习如何向 GET 方法传递 slice 和不同类型的数据。这对于我们正确使用这些方法非常有用。

首先，我们需要一个能够发送请求的客户端。因此，我们将使用特定的钱包地址（[EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF](https://tonscan.org/address/EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF)）作为例子：

|                                                                方法                                                                |                                                         说明                                                        |
| :------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------: |
|                        int get_subwallet_id()                       |                                 需要使用该方法接收当前的 seqno，并以正确的值发送信息。在本教程的前几节中，该方法经常被调用。                                 |
| int is_plugin_installed(int wc, int addr_hash) | 让我们知道插件是否已安装。调用此方法时，需要传递 [工作链](/learn/overviews/ton-blockchain#workchain-blockchain-with-your-own-rules) 和插件地址哈希。 |

让我们考虑 `get_public_key` 和 `is_plugin_installed` 方法。选择这两种方法是因为，首先我们需要从 256 位数据中获取公钥，然后我们需要学习如何向 GET 方法传递 slice 和不同类型的数据。这对于我们正确使用这些方法非常有用。

|                                                                方法                                                                |                                                                              说明                                                                              |
| :------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                        int get_subwallet_id()                       |                                             在本教程的前面部分，我们已经讨论过这个问题。通过这种方法可以重新获取 subwallet_id。                                            |
| int is_plugin_installed(int wc, int addr_hash) | 让我们知道插件是否已安装。要调用此方法，必须传递 [workchain](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#workchain-blockchain-with-your-own-rules) 和插件地址哈希值。 |
|                       tuple get_plugin_list()                       |                                                                        此方法返回已安装插件的地址。                                                                        |

让我们来看看 `get_public_key` 和 `is_plugin_installed` 方法。之所以选择这两个方法，是因为一开始我们必须从 256 位数据中获取公钥，之后我们必须学习如何向 GET 方法传递 slice 和不同类型的数据。这对我们学习如何正确使用这些方法非常有用。

首先，我们需要一个能够发送请求的客户端。因此，我们将以一个特定的钱包地址（[EQDKbjIcfM6ezt8KjKJLshZJSqX7XOA4ff-W72r5gqPrHF](https://tonscan.org/address/EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF) ）为例：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from '@ton/ton';
import { Address } from '@ton/core';

const client = new TonClient({
    endpoint: "https://toncenter.com/api/v2/jsonRPC",
    apiKey: "put your api key" // you can get an api key from @tonapibot bot in Telegram
});

const walletAddress = Address.parse("EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF"); // my wallet address as an example
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "context"
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/liteclient"
  "github.com/xssnick/tonutils-go/ton"
  "log"
)

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection)

block, err := client.CurrentMasterchainInfo(context.Background()) // get current block, we will need it in requests to LiteServer
if err != nil {
  log.Fatalln("CurrentMasterchainInfo err:", err.Error())
  return
}

walletAddress := address.MustParseAddr("EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF") // my wallet address as an example
```

</TabItem>
</Tabs>

现在，我们需要调用 GET 方法钱包。

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
// I always call runMethodWithError instead of runMethod to be able to check the exit_code of the called method. 
let getResult = await client.runMethodWithError(walletAddress, "get_public_key"); // run get_public_key GET Method
const publicKeyUInt = getResult.stack.readBigNumber(); // read answer that contains uint256
const publicKey = publicKeyUInt.toString(16); // get hex string from bigint (uint256)
console.log(publicKey)
```

</TabItem>
<TabItem value="go" label="Golang">

```go
getResult, err := client.RunGetMethod(context.Background(), block, walletAddress, "get_public_key") // run get_public_key GET Method
if err != nil {
	log.Fatalln("RunGetMethod err:", err.Error())
	return
}

// We have a response as an array with values and should specify the index when reading it
// In the case of get_public_key, we have only one returned value that is stored at 0 index
publicKeyUInt := getResult.MustInt(0) // read answer that contains uint256
publicKey := publicKeyUInt.Text(16)   // get hex string from bigint (uint256)
log.Println(publicKey)
```

</TabItem>
</Tabs>

调用成功后，最终结果是一个极大的 256 位数字，必须将其转换为十六进制字符串。上面提供的钱包地址的十六进制字符串如下：`430db39b13cf3cb76bfa818b6b13417b82be2c6c389170fbe06795c71996b1f8`.
接下来，我们利用 [TonAPI](https://docs.tonconsole.com/tonapi/rest-api) (/v1/wallet/findByPubkey 方法)，将获得的十六进制字符串输入系统，答案中数组的第一个元素将立即识别我的钱包。

然后切换到 `is_plugin_installed` 方法。例如，我们将再次使用之前使用过的钱包（[EQAM7M--HGyfxlErAIUODrxBA3yj5roBeYiTuy6BHgJ3Sx8k](https://tonscan.org/address/EQAM7M--HGyfxlErAIUODrxBA3yj5roBeYiTuy6BHgJ3Sx8k) 和插件（[EQBTKTis-SWYdupy99ozeOvnEBu8LRrQP_N9qwOTSAy3sQSZ](https://tonscan.org/address/EQBTKTis-SWYdupy99ozeOvnEBu8LRrQP_N9qwOTSAy3sQSZ)）：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const oldWalletAddress = Address.parse("EQAM7M--HGyfxlErAIUODrxBA3yj5roBeYiTuy6BHgJ3Sx8k"); // my old wallet address
const subscriptionAddress = Address.parseFriendly("EQBTKTis-SWYdupy99ozeOvnEBu8LRrQP_N9qwOTSAy3sQSZ"); // subscription plugin address which is already installed on the wallet
```

</TabItem>
<TabItem value="go" label="Golang">

```go
oldWalletAddress := address.MustParseAddr("EQAM7M--HGyfxlErAIUODrxBA3yj5roBeYiTuy6BHgJ3Sx8k")
subscriptionAddress := address.MustParseAddr("EQBTKTis-SWYdupy99ozeOvnEBu8LRrQP_N9qwOTSAy3sQSZ") // subscription plugin address which is already installed on the wallet
```

</TabItem>
</Tabs>

现在，我们需要获取插件的哈希地址，以便将地址转换为数字并发送到 GET 方法。

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const hash = BigInt(`0x${subscriptionAddress.address.hash.toString("hex")}`) ;

getResult = await client.runMethodWithError(oldWalletAddress, "is_plugin_installed", 
[
    {type: "int", value: BigInt("0")}, // pass workchain as int
    {type: "int", value: hash} // pass plugin address hash as int
]);
console.log(getResult.stack.readNumber()); // -1
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "math/big"
)

hash := big.NewInt(0).SetBytes(subscriptionAddress.Data())
// runGetMethod will automatically identify types of passed values
getResult, err = client.RunGetMethod(context.Background(), block, oldWalletAddress,
  "is_plugin_installed",
  0,    // pass workchain
  hash) // pass plugin address
if err != nil {
  log.Fatalln("RunGetMethod err:", err.Error())
  return
}

log.Println(getResult.MustInt(0)) // -1
```

</TabItem>
</Tabs>

在第三章中，我们部署了一个钱包。为此，我们最初发送了一些TON，然后从钱包发送了一笔交易以部署一个智能合约。然而，这个过程并不常用于外部交易，通常主要用于钱包。在开发合约时，部署过程是通过发送内部消息来初始化的。

### 通过钱包部署合约

在第三章中，我们部署了一个钱包。为此，我们首先发送了一些 TON，然后从钱包中发送了一条部署智能合约的消息。不过，这个过程并不广泛用于外部消息，通常只主要用于钱包。在开发合约时，部署流程是通过发送内部消息来初始化的。

为此，我们将使用 [第三章](/v3/guidelines/smart-contracts/howto/wallet#compiling-wallet-code) 中使用的 V3R2 钱包智能合约。
在这种情况下，我们将把 `subwallet_id` 设置为 `3` 或其他任何需要的数字，以便在使用相同私钥（可更改）时检索另一个地址：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { beginCell, Cell } from '@ton/core';
import { mnemonicToWalletKey } from '@ton/crypto';

const mnemonicArray = 'put your mnemonic'.split(" ");
const keyPair = await mnemonicToWalletKey(mnemonicArray); // extract private and public keys from mnemonic

const codeCell = Cell.fromBase64('te6ccgEBCAEAhgABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQCW8oMI1xgg0x/TH9MfAvgju/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOgwAaTIyx/LH8v/ye1UAATQMAIBSAYHABe7Oc7UTQ0z8x1wv/gAEbjJftRNDXCx+A==');
const dataCell = beginCell()
    .storeUint(0, 32) // Seqno
    .storeUint(3, 32) // Subwallet ID
    .storeBuffer(keyPair.publicKey) // Public Key
    .endCell();

const stateInit = beginCell()
    .storeBit(0) // No split_depth
    .storeBit(0) // No special
    .storeBit(1) // We have code
    .storeRef(codeCell)
    .storeBit(1) // We have data
    .storeRef(dataCell)
    .storeBit(0) // No library
    .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "crypto/ed25519"
  "crypto/hmac"
  "crypto/sha512"
  "encoding/base64"
  "github.com/xssnick/tonutils-go/tvm/cell"
  "golang.org/x/crypto/pbkdf2"
  "strings"
)

mnemonicArray := strings.Split("put your mnemonic", " ")
// The following three lines will extract the private key using the mnemonic phrase.
// We will not go into cryptographic details. In the library tonutils-go, it is all implemented,
// but it immediately returns the finished object of the wallet with the address and ready-made methods.
// So we’ll have to write the lines to get the key separately. Goland IDE will automatically import
// all required libraries (crypto, pbkdf2 and others).
mac := hmac.New(sha512.New, []byte(strings.Join(mnemonicArray, " ")))
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries "TON default seed" is used as salt when getting keys
// 32 is a key len
privateKey := ed25519.NewKeyFromSeed(k)              // get private key
publicKey := privateKey.Public().(ed25519.PublicKey) // get public key from private key

BOCBytes, _ := base64.StdEncoding.DecodeString("te6ccgEBCAEAhgABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQCW8oMI1xgg0x/TH9MfAvgju/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOgwAaTIyx/LH8v/ye1UAATQMAIBSAYHABe7Oc7UTQ0z8x1wv/gAEbjJftRNDXCx+A==")
codeCell, _ := cell.FromBOC(BOCBytes)
dataCell := cell.BeginCell().
  MustStoreUInt(0, 32).           // Seqno
  MustStoreUInt(3, 32).           // Subwallet ID
  MustStoreSlice(publicKey, 256). // Public Key
  EndCell()

stateInit := cell.BeginCell().
  MustStoreBoolBit(false). // No split_depth
  MustStoreBoolBit(false). // No special
  MustStoreBoolBit(true).  // We have code
  MustStoreRef(codeCell).
  MustStoreBoolBit(true). // We have data
  MustStoreRef(dataCell).
  MustStoreBoolBit(false). // No library
  EndCell()
```

</TabItem>
</Tabs>

接下来，我们将从合约中获取地址，并创建 InternalMessage。此外，我们还要在消息中添加 "Deploying..." 注释。

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address, toNano } from '@ton/core';

const contractAddress = new Address(0, stateInit.hash()); // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
console.log(`Contract address: ${contractAddress.toString()}`); // Output contract address to console

const internalMessageBody = beginCell()
    .storeUint(0, 32)
    .storeStringTail('Deploying...')
    .endCell();

const internalMessage = beginCell()
    .storeUint(0x10, 6) // no bounce
    .storeAddress(contractAddress)
    .storeCoins(toNano('0.01'))
    .storeUint(0, 1 + 4 + 4 + 64 + 32)
    .storeBit(1) // We have State Init
    .storeBit(1) // We store State Init as a reference
    .storeRef(stateInit) // Store State Init as a reference
    .storeBit(1) // We store Message Body as a reference
    .storeRef(internalMessageBody) // Store Message Body Init as a reference
    .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/tlb"
  "log"
)

contractAddress := address.NewAddress(0, 0, stateInit.Hash()) // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
log.Println("Contract address:", contractAddress.String())   // Output contract address to console

internalMessageBody := cell.BeginCell().
  MustStoreUInt(0, 32).
  MustStoreStringSnake("Deploying...").
  EndCell()

internalMessage := cell.BeginCell().
  MustStoreUInt(0x10, 6). // no bounce
  MustStoreAddr(contractAddress).
  MustStoreBigCoins(tlb.MustFromTON("0.01").NanoTON()).
  MustStoreUInt(0, 1+4+4+64+32).
  MustStoreBoolBit(true).            // We have State Init
  MustStoreBoolBit(true).            // We store State Init as a reference
  MustStoreRef(stateInit).           // Store State Init as a reference
  MustStoreBoolBit(true).            // We store Message Body as a reference
  MustStoreRef(internalMessageBody). // Store Message Body Init as a reference
  EndCell()
```

</TabItem>
</Tabs>

:::info
请注意，上面已经指定了位，stateInit 和 internalMessageBody 已作为引用保存。由于链接是单独保存的，我们可以写 4 (0b100) + 2 (0b10) + 1 (0b1) -> (4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1) 即 (0b111, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)，然后保存两个引用。
:::

接下来，我们将为钱包准备一条信息并发送：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from '@ton/ton';
import { sign } from '@ton/crypto';

const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    apiKey: 'put your api key' // you can get an api key from @tonapibot bot in Telegram
});

const walletMnemonicArray = 'put your mnemonic'.split(' ');
const walletKeyPair = await mnemonicToWalletKey(walletMnemonicArray); // extract private and public keys from mnemonic
const walletAddress = Address.parse('put your wallet address with which you will deploy');
const getMethodResult = await client.runMethod(walletAddress, 'seqno'); // run "seqno" GET method from your wallet contract
const seqno = getMethodResult.stack.readNumber(); // get seqno from response

// message for our wallet
const toSign = beginCell()
    .storeUint(698983191, 32) // subwallet_id
    .storeUint(Math.floor(Date.now() / 1e3) + 60, 32) // Message expiration time, +60 = 1 minute
    .storeUint(seqno, 32) // store seqno
    // Do not forget that if we use Wallet V4, we need to add .storeUint(0, 8) 
    .storeUint(3, 8)
    .storeRef(internalMessage);

const signature = sign(toSign.endCell().hash(), walletKeyPair.secretKey); // get the hash of our message to wallet smart contract and sign it to get signature
const body = beginCell()
    .storeBuffer(signature) // store signature
    .storeBuilder(toSign) // store our message
    .endCell();

const external = beginCell()
    .storeUint(0b10, 2) // indicate that it is an incoming external message
    .storeUint(0, 2) // src -> addr_none
    .storeAddress(walletAddress)
    .storeCoins(0) // Import fee
    .storeBit(0) // We do not have State Init
    .storeBit(1) // We store Message Body as a reference
    .storeRef(body) // Store Message Body as a reference
    .endCell();

console.log(external.toBoc().toString('base64'));
client.sendFile(external.toBoc());
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "context"
  "github.com/xssnick/tonutils-go/liteclient"
  "github.com/xssnick/tonutils-go/tl"
  "github.com/xssnick/tonutils-go/ton"
  "time"
)

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection)

block, err := client.CurrentMasterchainInfo(context.Background()) // get current block, we will need it in requests to LiteServer
if err != nil {
  log.Fatalln("CurrentMasterchainInfo err:", err.Error())
  return
}

walletMnemonicArray := strings.Split("put your mnemonic", " ")
mac = hmac.New(sha512.New, []byte(strings.Join(walletMnemonicArray, " ")))
hash = mac.Sum(nil)
k = pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries "TON default seed" is used as salt when getting keys
// 32 is a key len
walletPrivateKey := ed25519.NewKeyFromSeed(k) // get private key
walletAddress := address.MustParseAddr("put your wallet address with which you will deploy")

getMethodResult, err := client.RunGetMethod(context.Background(), block, walletAddress, "seqno") // run "seqno" GET method from your wallet contract
if err != nil {
  log.Fatalln("RunGetMethod err:", err.Error())
  return
}
seqno := getMethodResult.MustInt(0) // get seqno from response

toSign := cell.BeginCell().
  MustStoreUInt(698983191, 32).                          // subwallet_id | We consider this further
  MustStoreUInt(uint64(time.Now().UTC().Unix()+60), 32). // message expiration time, +60 = 1 minute
  MustStoreUInt(seqno.Uint64(), 32).                     // store seqno
  // Do not forget that if we use Wallet V4, we need to add MustStoreUInt(0, 8).
  MustStoreUInt(3, 8).          // store mode of our internal message
  MustStoreRef(internalMessage) // store our internalMessage as a reference

signature := ed25519.Sign(walletPrivateKey, toSign.EndCell().Hash()) // get the hash of our message to wallet smart contract and sign it to get signature

body := cell.BeginCell().
  MustStoreSlice(signature, 512). // store signature
  MustStoreBuilder(toSign).       // store our message
  EndCell()

externalMessage := cell.BeginCell().
  MustStoreUInt(0b10, 2).       // ext_in_msg_info$10
  MustStoreUInt(0, 2).          // src -> addr_none
  MustStoreAddr(walletAddress). // Destination address
  MustStoreCoins(0).            // Import Fee
  MustStoreBoolBit(false).      // No State Init
  MustStoreBoolBit(true).       // We store Message Body as a reference
  MustStoreRef(body).           // Store Message Body as a reference
  EndCell()

var resp tl.Serializable
err = client.Client().QueryLiteserver(context.Background(), ton.SendMessage{Body: externalMessage.ToBOCWithFlags(false)}, &resp)

if err != nil {
  log.Fatalln(err.Error())
  return
}
```

</TabItem>
</Tabs>

首先，让我们查看[高负载钱包智能合约的代码结构](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet-v2-code.fc)：

## 🔥 高负载钱包 V3

在短时间内处理大量信息时，需要使用名为 "高负载钱包 "的特殊钱包。在很长一段时间里，高负载钱包 V2 是 TON 的主要钱包，但使用时必须非常小心。否则，您可能会被 [锁定所有资金](https://t.me/tonstatus/88)。

您会发现与普通钱包有些不同。现在让我们更详细地看看高负载钱包在TON上的工作原理（除了子钱包，因为我们之前已经讨论过了）。

:::note
我们将[使用稍作修改的 Wrapper 版本](https://github.com/aSpite/highload-wallet-contract-v3/blob/main/wrappers/HighloadWalletV3.ts)来签订合约，因为它可以防止一些不明显的错误。
:::

### 存储结构

如果相同的交易请求已经存在，合约将不会接受它，因为它已经被处理过了：

```
storage$_ public_key:bits256 subwallet_id:uint32 old_queries:(HashmapE 14 ^Cell)
          queries:(HashmapE 14 ^Cell) last_clean_time:uint64 timeout:uint22
          = Storage;
```

:::tip TL-B
您可以 [在此](/v3/documentation/data-formats/tlb/tl-b-language) 阅读有关 TL-B 的更多信息。
:::

在合约存储中，我们可以找到以下字段：

|                           Field                           |                                                                          说明                                                                          |
| :-------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------: |
|              public_key              |                                                                       合约的公开密钥。                                                                       |
|             subwallet_id             |                                                       [钱包 ID](#subwallet-ids)。它允许你使用同一公钥创建多个钱包。                                                      |
|              old_queries             |                                                              已经处理过的过时查询。每次超时后，它们都会被移至此处。                                                             |
|                          queries                          |                                                                     已处理但尚未过时的查询。                                                                     |
| last_clean_time | 上次清理的时间。如果 `last_clean_time < (now() - timeout)`，旧查询将被移至 `old_queries`。如果 `last_clean_time < (now() - 2 * timeout)`，则同时清除 `old_queries` 和 `queries`。 |
|                          timeout                          |                                                                查询转到 `old_queries` 的时间。                                                               |

我们将在 [重放保护](#replay-protection) 中进一步讨论如何处理已处理的查询。

### Shifts 和 Bits 数字作为 Query ID

请注意，如果找到一个值，`f` 永远等于 -1（真）。`~ -1` 操作（位非）将始终返回 0 的值，意味着应该继续循环。与此同时，当字典填充了交易时，需要开始计算那些**大于 -1** 的值（例如，0），并且每次交易都将值递增 1。这个结构允许以正确的顺序发送交易。

```func.
int shift = msg_inner_slice~load_uint(KEY_SIZE);
int bit_number = msg_inner_slice~load_uint(BIT_NUMBER_SIZE);
```

通常情况下，[TON上的智能合约需要为自己的存储付费](/develop/smart-contracts/fees#storage-fee)。这意味着智能合约可以存储的数据量是有限的，以防止高网络交易费用。为了让系统更高效，超过 64 秒的交易将从存储中移除。按照以下方式进行：

首先，合约会使用 shift 命令，尝试从  `old_queries` 字典中获取位于该索引处的 cell ：

```func
(cell value, int found) = old_queries.udict_get_ref?(KEY_SIZE, shift);
```

请注意，必须多次与 `f` 变量进行交互。由于 [TVM 是一个堆栈机器](/learn/tvm-instructions/tvm-overview#tvm-is-a-stack-machine)，在每次与 `f` 变量交互时，必须弹出所有值以获得所需的变量。`f~touch()` 操作将 f 变量放在堆栈顶部，以优化代码执行。

```func
if (found) {
    slice value_slice = value.begin_parse();
    value_slice~skip_bits(bit_number);
    throw_if(error::already_executed, value_slice.preload_int(1));
}
```

如果您之前没有使用过位运算，那么这个部分可能会显得有些复杂。在智能合约代码中可以看到以下代码行：

```func
(cell value, int found) = queries.udict_get_ref?(KEY_SIZE, shift);
```

结果，在右侧的数字上添加了 32 位。这意味着 **现有值向左移动 32 位**。举例来说，让我们考虑数字 3 并将其翻译成二进制形式，结果是 11。应用 `3 << 2` 操作，11 移动了 2 位。这意味着在字符串的右侧添加了两位。最后，我们得到了 1100，即 12。

```func
builder new_value = null();
if (found) {
    slice value_slice = value.begin_parse();
    (slice tail, slice head) = value_slice.load_bits(bit_number);
    throw_if(error::already_executed, tail~load_int(1));
    new_value = begin_cell().store_slice(head).store_true().store_slice(tail);
} else {
    new_value = begin_cell().store_zeroes(bit_number).store_true().store_zeroes(CELL_BITS_SIZE - bit_number - 1);
}
```

:::note
If you [familiarize yourself](/v3/documentation/tvm/instructions) with the operation of the `LDSLICEX` opcode (the load\_bits function uses this opcode), you will notice that the read data is returned first (head) and only then the remaining data (tail), but they are in reverse order in the contract code.

事实上，它们的顺序是相反的，因为在 stdlib 的函数签名中，返回的数据[顺序相反](https://github.com/ton-blockchain/highload-wallet-contract-v3/blob/d58c31e82315c34b4db55942851dd8d4153975c5/contracts/imports/stdlib.fc#L321)：`(slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";`。这里 `-> 1 0` 表示先返回索引为 1（尾部）的参数，然后返回索引为 0（头部）的参数。
:::

在上面，我们执行了一个操作，将数字 64 向左移动 32 位，以**减去 64 秒**的时间戳。这样我们就可以比较过去的 query_ids，看看它们是否小于接收到的值。如果是这样，它们就超过了 64 秒：

这种方法允许每次超时存储大量请求（1023 \* 8192 = 8,380,416），但你可能会注意到[类 HighloadQueryId 支持 8,380,415](https://github.com/ton-blockchain/highload-wallet-contract-v3/blob/d58c31e82315c34b4db55942851dd8d4153975c5/wrappers/HighloadQueryId.ts#L32)。这是为了确保在整个限制耗尽的情况下，总有 1 个比特可用于一个紧急超时请求。之所以设置这个值，是因为区块链上有[账户堆栈中可能存在的最大 cell 数限制](https://github.com/ton-blockchain/ton/blob/5c392e0f2d946877bb79a09ed35068f7b0bd333a/crypto/block/mc-config.h#L395)（截至本文撰写时）。

为了更好地理解，让我们使用 `1625918400` 作为时间戳的示例。它的二进制表示（左侧添加零以得到 32 位）是 01100000111010011000101111000000。执行 32 位位左移操作后，我们数字的二进制表示末尾会出现 32 个零。

:::info
在高负载 V2 的早期版本中，每个 Query ID（64 位）都存储在字典中的单独 cell 中，并且是 32 位字段 `expire_at` 和 `query_id` 的组合。这导致在清除旧查询时， gas 消耗量增长非常快。
:::

### 存储更新

所有操作完成后，剩下的唯一任务就是将新的值保存在存储中：

当合约从其存储空间中完全检索到所需的所有数据后，它会检查上次查询字典清理的时间。如果超过了 `timeout` 时间，合约会将所有查询从 queries 移到 old_queries。如果上次清理时间超过 `timeout * 2` 次，合约会额外清理 old_queries：

```func
if (last_clean_time < (now() - timeout)) {
    (old_queries, queries) = (queries, null());
    if (last_clean_time < (now() - (timeout * 2))) {
        old_queries = null();
    }
    last_clean_time = now();
}
```

在我们深入了解钱包部署和交易创建之前，我们必须考虑的最后一件事是高负载钱包的 GET 方法：

理论上，查询的生命周期从 `timeout` 到 `timeout * 2`，这意味着在跟踪哪些查询过时时，最好至少等待 `timeout * 2` 次，以确定查询是否过时。

### 保证无差错行动阶段

一旦完成所有检查和清理工作，合约就可以接受信息，对其存储空间进行更改，并调用提交函数，即使接下来出现错误，也会认为计算阶段已经成功：

```func
accept_message();

queries~udict_set_ref(KEY_SIZE, shift, new_value.end_cell());

set_data(begin_cell()
    .store_uint(public_key, PUBLIC_KEY_SIZE)
    .store_uint(subwallet_id, SUBWALLET_ID_SIZE)
    .store_dict(old_queries)
    .store_dict(queries)
    .store_uint(last_clean_time, TIMESTAMP_SIZE)
    .store_uint(timeout, TIMEOUT_SIZE)
    .end_cell());


commit();
```

这意味着，如果传递给方法的 query_id 小于 last_cleaned 值，就无法确定它是否曾在合约中。因此 `query_id <= last_cleaned` 返回 -1，而表达式前面的减号将答案改为 1。如果 query_id 大于 last_cleaned 方法，则表示它尚未被处理。

不过，还有一个问题必须解决，那就是在 **行动阶段** 可能出现的错误。虽然我们在发送消息时有一个忽略错误（2）的标记，但它并不是在所有情况下都有效，因此我们需要确保在这个阶段不会发生错误，因为错误可能会导致状态回滚，使 `commit()` 失去意义。

为了部署高负载钱包，必须提前生成一个助记词密钥，用户将使用此密钥。可以使用在本教程之前部分中使用的相同密钥。

```func
throw_if(error::invalid_message_to_send, message_slice~load_uint(1)); ;; int_msg_info$0
int msg_flags = message_slice~load_uint(3); ;; ihr_disabled:Bool bounce:Bool bounced:Bool
if (is_bounced(msg_flags)) {
    return ();
}
slice message_source_adrress = message_slice~load_msg_addr(); ;; src
throw_unless(error::invalid_message_to_send, is_address_none(message_source_adrress));
message_slice~load_msg_addr(); ;; dest
message_slice~load_coins(); ;; value.coins
message_slice = message_slice.skip_dict(); ;; value.other extra-currencies
message_slice~load_coins(); ;; ihr_fee
message_slice~load_coins(); ;; fwd_fee
message_slice~skip_bits(64 + 32); ;; created_lt:uint64 created_at:uint32
int maybe_state_init = message_slice~load_uint(1);
throw_if(error::invalid_message_to_send, maybe_state_init); ;; throw if state-init included (state-init not supported)
int either_body = message_slice~load_int(1);
if (either_body) {
    message_slice~load_ref();
    message_slice.end_parse();
}
```

如果在读取数据时出现任何问题，仍将处于计算阶段。不过，由于存在 `commit()` 这不是问题，事务仍将被视为成功。如果所有数据都已成功读取，这就保证了操作阶段将无差错地通过，因为这些检查涵盖了 `IGNORE_ERRORS` (2) 标志失败的所有情况。然后，合约就可以通过发送消息来完成工作：

```func
;; send message with IGNORE_ERRORS flag to ignore errors in the action phase

send_raw_message(message_to_send, send_mode | SEND_MODE_IGNORE_ERRORS);
```

### 内部转账

在终端中的输出将如下所示：

```func
if (op == op::internal_transfer) {
    in_msg_body~skip_query_id();
    cell actions = in_msg_body.preload_ref();
    cell old_code = my_code();
    set_actions(actions);
    set_code(old_code); ;; prevent to change smart contract code
    return ();
}
```

在上述结果的基础上，我们可以使用base64编码的输出，在其他库和语言中检索包含我们钱包代码的cell，具体操作如下：

在官方版本库的包装器中，这个字段是可选的，如果用户不指定，[mode就会变成 128](https://github.com/ton-blockchain/highload-wallet-contract-v3/blob/d58c31e82315c34b4db55942851dd8d4153975c5/wrappers/HighloadWalletV3.ts#L115)，这意味着会发送全部余额。问题是，在这种情况下存在**边缘情况**。

假设我们要发送大量代币。由于我们在 `response_destination` 字段中设置了我们的地址，所以在发送后，剩余的 TON 会返回到我们的钱包。我们开始同时发送多个外部代币，就会出现以下情况：

1. 接收并处理外部信息 A，并通过 `response_destination` 发送全部合约余额。
2. 在外部信息 B 到达之前，已发送完毕的代币的部分佣金已经到达。因此，非空合约余额允许再次向内部报文 B 发送全部余额，但这次发送的代币数量很少。
3. 接收并处理内部报文 A。发送 token 信息。
4. 在内部信息 B 到达之前，外部信息 C 成功到达，并再次发送了整个余额。
5. 当收到内部信息 B 时，即使从发送代币中得到一些额外的 TON，合约的 TON 也很少，因此请求失败，行动阶段的退出代码 = 37（资金不足）。

现在我们需要检索由其初始数据组成的cell，构建一个State Init，并计算一个高负载钱包地址。经过研究智能合约代码后，我们发现subwallet_id、last_cleaned、public_key和old_queries是顺序存储在存储中的：

高负载钱包 V3 可以发送超过 254 条信息，[将剩余信息放入第 254 条信息中](https://github.com/aSpite/highload-wallet-contract-v3/blob/d4c1752d00b5303782f121a87eb0620d403d9544/wrappers/HighloadWalletV3.ts#L169-L176)。这样，`internal_transfer` 将被处理多次。封装程序会自动执行此操作，我们无需担心，但**建议每次接收不超过 150 条信息**，以确保即使是复杂的信息也能放入外部信息中。

:::info
虽然外部信息限制为 64KB，但外部信息越大，在发送过程中丢失的可能性就越大，因此 150 条信息是最佳解决方案。
:::

### GET 方法

高负载钱包 V3 支持 5 种 GET 方法：

|                                                      方法                                                     |                                                                                              说明                                                                                              |
| :---------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|              int get_public_key()              |                                                                                           返回合约的公钥。                                                                                           |
|             int get_subwallet_id()             |                                                                                           返回子钱包 ID。                                                                                          |
| int get_last_clean_time() |                                                                                          返回上次清理的时间。                                                                                          |
|                          int get_timeout()                          |                                                                                            返回超时值。                                                                                            |
|  int processed?(int query_id, int need_clean)  | 返回 query_id 是否已被处理。如果 need_clean 设置为 1，那么将首先根据 `last_clean_time` 和 `timeout` 进行清理，然后检查 `old_queries` 和 `queries` 中的 query_id。 |

:::tip
除非情况另有要求，否则建议为 `need_clean` 传递 `true`，因为这样会返回最新的字典状态。
:::

由于高负载钱包 V3 采用了查询 ID 的组织方式，因此如果查询 ID 没有到达，我们可以再次发送具有相同查询 ID 的信息，而不必担心请求会被处理两次。

现在，让我们编程高负载钱包同时发送多条消息。例如，让我们每条消息发送12笔交易，这样gas费用就很小。

### 部署高负载钱包 V3

每条消息携带其自己的含代码的评论，目的地址将是我们部署的钱包：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Cell } from "@ton/core";

const HIGHLOAD_V3_CODE = Cell.fromBoc(Buffer.from('b5ee9c7241021001000228000114ff00f4a413f4bcf2c80b01020120020d02014803040078d020d74bc00101c060b0915be101d0d3030171b0915be0fa4030f828c705b39130e0d31f018210ae42e5a4ba9d8040d721d74cf82a01ed55fb04e030020120050a02027306070011adce76a2686b85ffc00201200809001aabb6ed44d0810122d721d70b3f0018aa3bed44d08307d721d70b1f0201200b0c001bb9a6eed44d0810162d721d70b15800e5b8bf2eda2edfb21ab09028409b0ed44d0810120d721f404f404d33fd315d1058e1bf82325a15210b99f326df82305aa0015a112b992306dde923033e2923033e25230800df40f6fa19ed021d721d70a00955f037fdb31e09130e259800df40f6fa19cd001d721d70a00937fdb31e0915be270801f6f2d48308d718d121f900ed44d0d3ffd31ff404f404d33fd315d1f82321a15220b98e12336df82324aa00a112b9926d32de58f82301de541675f910f2a106d0d31fd4d307d30cd309d33fd315d15168baf2a2515abaf2a6f8232aa15250bcf2a304f823bbf2a35304800df40f6fa199d024d721d70a00f2649130e20e01fe5309800df40f6fa18e13d05004d718d20001f264c858cf16cf8301cf168e1030c824cf40cf8384095005a1a514cf40e2f800c94039800df41704c8cbff13cb1ff40012f40012cb3f12cb15c9ed54f80f21d0d30001f265d3020171b0925f03e0fa4001d70b01c000f2a5fa4031fa0031f401fa0031fa00318060d721d300010f0020f265d2000193d431d19130e272b1fb00b585bf03', 'hex'))[0];
```

</TabItem>
</Tabs> 

与其他示例不同的是，这里我们将[使用现成的封装器](https://github.com/aSpite/highload-wallet-contract-v3/blob/main/wrappers/HighloadWalletV3.ts)，因为手动创建每条信息将相当困难和耗时。要创建 HighloadWalletV3 类的实例，我们需要传递 `publicKey`、`subwalletId` 和 `timeout` 以及代码：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from "@ton/ton";
import { HighloadWalletV3 } from "./wrappers/HighloadWalletV3"; 
import { mnemonicToWalletKey } from "@ton/crypto";

const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    apiKey: 'put your api key' // you can get an api key from @tonapibot bot in Telegram
});

const walletMnemonicArray = 'put your mnemonic'.split(' ');
const walletKeyPair = await mnemonicToWalletKey(walletMnemonicArray); // extract private and public keys from mnemonic
const wallet = client.open(HighloadWalletV3.createFromConfig({
    publicKey: walletKeyPair.publicKey,
    subwalletId: 0x10ad,
    timeout: 60 * 60, // 1 hour
}, HIGHLOAD_V3_CODE));

console.log(`Wallet address: ${wallet.address.toString()}`);
```

</TabItem>
</Tabs> 

现在我们需要一个普通钱包，我们将从这个钱包中部署合约：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { WalletContractV3R2 } from "@ton/ton";

const deployerWalletMnemonicArray = 'put your mnemonic'.split(' ');
const deployerWalletKeyPair = await mnemonicToWalletKey(deployerWalletMnemonicArray); // extract private and public keys from mnemonic
const deployerWallet = client.open(WalletContractV3R2.create({
    publicKey: deployerWalletKeyPair.publicKey,
    workchain: 0
}));
console.log(`Deployer wallet address: ${deployerWallet.address.toString()}`);
```

</TabItem>
</Tabs> 

如果你有一个 V4 版本的钱包，你可以使用 `WalletContractV4` 类。现在，我们要做的就是部署合约：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
await wallet.sendDeploy(deployerWallet.sender(deployerWalletKeyPair.secretKey), toNano(0.05));
```

</TabItem>
</Tabs> 

通过在资源管理器中查看输出到控制台的地址，我们可以验证钱包是否已部署。

### 发送高负载钱包 V3 信息

发送信息也是通过包装器完成的，但在这种情况下，我们需要额外保持查询 ID 的最新状态。首先，让我们获取一个钱包类的实例：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address } from "@ton/core";
import { TonClient } from "@ton/ton";
import { HighloadWalletV3 } from "./wrappers/HighloadWalletV3";
import { mnemonicToWalletKey } from "@ton/crypto";

const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    apiKey: 'put your api key' // you can get an api key from @tonapibot bot in Telegram
});

const walletMnemonicArray = 'put your mnemonic'.split(' ');
const walletKeyPair = await mnemonicToWalletKey(walletMnemonicArray); // extract private and public keys from mnemonic
const wallet = client.open(HighloadWalletV3.createFromAddress(Address.parse('put your high-load wallet address')));
console.log(`Wallet address: ${wallet.address.toString()}`);
```

</TabItem>
</Tabs> 

这有助于我们独立于使用库，并以更深入的方式理解TON区块链的结构。我们还学习了如何使用高负载钱包，并分析了许多与不同数据类型和各种操作相关的细节。

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { HighloadQueryId } from "./wrappers/HighloadQueryId";

const queryHandler = HighloadQueryId.fromShiftAndBitNumber(0n, 0n);
```

</TabItem>
</Tabs> 

由于这是第一次请求，所以我们在这里输入零。但是，如果您之前发送过任何信息，则需要选择这些值中未使用的组合。现在，让我们创建一个数组来存储所有操作，并在其中添加一个操作来获取 TONs 返回值：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { beginCell, internal, OutActionSendMsg, SendMode, toNano } from "@ton/core";

const actions: OutActionSendMsg[] = [];
actions.push({
    type: 'sendMsg',
    mode: SendMode.CARRY_ALL_REMAINING_BALANCE,
    outMsg: internal({
        to: Address.parse('put address of deployer wallet'),
        value: toNano(0),
        body: beginCell()
            .storeUint(0, 32)
            .storeStringTail('Hello, TON!')
            .endCell()
    })
});
```

</TabItem>
</Tabs> 

代码的主要来源：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const subwalletId = 0x10ad;
const timeout = 60 * 60; // must be same as in the contract
const internalMessageValue = toNano(0.01); // in real case it is recommended to set the value to 1 TON
const createdAt = Math.floor(Date.now() / 1000) - 60; // LiteServers have some delay in time
await wallet.sendBatch(
    walletKeyPair.secretKey,
    actions,
    subwalletId,
    queryHandler,
    timeout,
    internalMessageValue,
    SendMode.PAY_GAS_SEPARATELY,
    createdAt
);
```

</TabItem>
</Tabs> 

外部参考：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
queryHandler.getNext();
```

</TabItem>
</Tabs> 

## 🔥 高负载钱包 V2（已过时）

在某些情况下，每笔交易可能需要发送大量信息。如前所述，普通钱包通过在单个 cell 中存储 [最多 4 个引用](/v3/documentation/data-formats/tlb/cell-boc#cell)，一次最多支持发送 4 条信息。高负载钱包只允许同时发送 255 条信息。之所以存在这一限制，是因为区块链配置设置中的最大发送消息（操作）数被设置为 255。

交易所可能是大规模使用高负载钱包的最佳例子。像 Binance 这样的老牌交易所拥有极其庞大的用户群，这意味着需要在短时间内处理大量的取款信息。高负载钱包有助于处理这些取款请求。

### 高负载钱包 FunC 代码

首先，我们来看看 [高负载钱包智能合约的代码结构](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet-v2.fif)：

```func
() recv_external(slice in_msg) impure {
  var signature = in_msg~load_bits(512); ;; get signature from the message body
  var cs = in_msg;
  var (subwallet_id, query_id) = (cs~load_uint(32), cs~load_uint(64)); ;; get rest values from the message body
  var bound = (now() << 32); ;; bitwise left shift operation
  throw_if(35, query_id < bound); ;; throw an error if message has expired
  var ds = get_data().begin_parse();
  var (stored_subwallet, last_cleaned, public_key, old_queries) = (ds~load_uint(32), ds~load_uint(64), ds~load_uint(256), ds~load_dict()); ;; read values from storage
  ds.end_parse(); ;; make sure we do not have anything in ds
  (_, var found?) = old_queries.udict_get?(64, query_id); ;; check if we have already had such a request
  throw_if(32, found?); ;; if yes throw an error
  throw_unless(34, subwallet_id == stored_subwallet);
  throw_unless(35, check_signature(slice_hash(in_msg), signature, public_key));
  var dict = cs~load_dict(); ;; get dictionary with messages
  cs.end_parse(); ;; make sure we do not have anything in cs
  accept_message();
```

> 💡 Useful links:
>
> [文档中的 "位运算"](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_get)
>
> [文档中的"load_dict()"](/v3/documentation/smart-contracts/func/docs/stdlib/#load_dict)
>
> [文档中的"udict_get?()"](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_get)

如我们之前讨论的，普通钱包在每次交易后 seqno 增加 `1`。在使用钱包序列时，我们必须等待这个值更新，然后使用 GET 方法检索它并发送新的交易。
这个过程需要很长时间，高负载钱包不是为此设计的（如上所述，它们旨在快速发送大量交易）。因此，TON上的高负载钱包使用了 `query_id`。

### 使用 Query ID 代替 Seqno

正如我们之前讨论过的，普通钱包 seqno 在每次交易后都会增加 `1`。在使用钱包序列时，我们必须等待该值更新，然后使用 GET 方法检索该值并发送新消息。
这个过程需要花费大量时间，而高负载钱包的设计并不适合这个过程（如上所述，它们的目的是快速发送大量信息）。因此，TON 上的高负载钱包使用了 `query_id`。

如果同一信息请求已经存在，合约将不会接受它，因为它已经被处理过了：

```func
var (stored_subwallet, last_cleaned, public_key, old_queries) = (ds~load_uint(32), ds~load_uint(64), ds~load_uint(256), ds~load_dict()); ;; read values from storage
ds.end_parse(); ;; make sure we do not have anything in ds
(_, var found?) = old_queries.udict_get?(64, query_id); ;; check if we have already had such a request
throw_if(32, found?); ;; if yes throw an error
```

这样，我们就能**防止重复信息**，而这正是 seqno 在普通钱包中的作用。

### 发送信息

合约接受外部报文后，就会开始一个循环，在循环中提取字典中存储的 `slices`。这些片段存储消息的模式和消息本身。发送新信息直到字典清空为止。

```func
int i = -1; ;; we write -1 because it will be the smallest value among all dictionary keys
do {
  (i, var cs, var f) = dict.idict_get_next?(16, i); ;; get the key and its corresponding value with the smallest key, which is greater than i
  if (f) { ;; check if any value was found
    var mode = cs~load_uint(8); ;; load message mode
    send_raw_message(cs~load_ref(), mode); ;; load message itself and send it
  }
} until (~ f); ;; if any value was found continue
```

> 💡 Useful link:
>
> [文档中的"idict_get_next()"](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_get_next)

请注意，如果找到一个值，`f` 总是等于-1（true）。`~ -1` 操作（比特非 (bitwise not)）总是返回值为 0，这意味着循环应该继续。同时，当字典中充满了信息时，有必要开始计算那些 **值大于-1**（例如 0）的信息，并随着每条信息继续增加 1。这种结构可以使报文按照正确的顺序发送。

### 删除过期查询

通常情况下，[TON 上的智能合约为自己的存储付费](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#storage-fee)。这意味着智能合约可存储的数据量是有限的，以防止出现高网络负载。为了提高系统效率，存储时间超过 64 秒的信息会被删除。具体操作如下

```func
bound -= (64 << 32);   ;; clean up records that have expired more than 64 seconds ago
old_queries~udict_set_builder(64, query_id, begin_cell()); ;; add current query to dictionary
var queries = old_queries; ;; copy dictionary to another variable
do {
  var (old_queries', i, _, f) = old_queries.udict_delete_get_min(64);
  f~touch();
  if (f) { ;; check if any value was found
    f = (i < bound); ;; check if more than 64 seconds have elapsed after expiration
  }
  if (f) { 
    old_queries = old_queries'; ;; if yes save changes in our dictionary
    last_cleaned = i; ;; save last removed query
  }
} until (~ f);
```

> 💡 Useful link:
>
> [文档中的"udict_delete_get_min()"](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_delete_get_min)

请注意，有必要多次与 `f` 变量交互。由于 [TVM 是堆栈机器](/v3/documentation/tvm/tvm-overview#tvm-is-a-stack-machine)，在每次与 `f` 变量交互时，都需要弹出所有值以获得所需的变量。f~touch()\` 操作将 f 变量置于栈顶，以优化代码执行。

### 位操作

结果，在右侧的数字上添加了 32 位。这意味着 **现有值向左移动 32 位**。举例来说，让我们考虑数字 3 并将其翻译成二进制形式，结果是 11。应用 `3 << 2` 操作，11 移动了 2 位。这意味着在字符串的右侧添加了两位。最后，我们得到了 1100，即 12。

```func
var bound = (now() << 32); ;; bitwise left shift operation
```

接下来，让我们考虑以下代码行：

要了解这一过程，首先要记住 `now()` 函数返回的结果是 uint32，这意味着结果值将是 32 位。通过向左移动 32 位，可以为另一个 uint32 打开空间，从而得到正确的 query_id。这样，**timestamp 和 query_id 就可以合并**到一个变量中进行优化。

在上面，我们执行了一个操作，将数字 64 向左移动 32 位，以**减去 64 秒**的时间戳。这样我们就可以比较过去的 query_ids，看看它们是否小于接收到的值。如果是这样，它们就超过了 64 秒：

```func
bound -= (64 << 32); ;; clean up the records that have expired more than 64 seconds ago
```

为了更好地理解，让我们使用 `1625918400` 作为时间戳的示例。它的二进制表示（左侧添加零以得到 32 位）是 01100000111010011000101111000000。执行 32 位位左移操作后，我们数字的二进制表示末尾会出现 32 个零。

```func
if (f) { ;; check if any value has been found
  f = (i < bound); ;; check if more than 64 seconds have elapsed after expiration
}
```

为了更好地理解这一点，我们以数字 `1625918400` 为例来说明时间戳。它的二进制表示法（32 位左移加零）是 011000001110100110001111000000。通过执行 32 位左移，我们的数字二进制表示法的末尾是 32 个零。

所有操作完成后，剩下的唯一任务就是将新的值保存在存储中：

### 存储更新

所有操作完成后，剩下的任务就是将新值保存到存储器中：

```func
  set_data(begin_cell()
    .store_uint(stored_subwallet, 32)
    .store_uint(last_cleaned, 64)
    .store_uint(public_key, 256)
    .store_dict(old_queries)
    .end_cell());
}
```

### GET 方法

在深入研究钱包部署和信息创建之前，我们必须考虑的最后一件事是高负载钱包 GET 方法：

|                                         方法                                        |                                               说明                                               |
| :-------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------: |
|        int processed?(int query_id)       | 通知用户某个请求是否已处理。也就是说，如果请求已处理，则返回 `-1`；如果未处理，则返回 `0`。此外，如果由于请求是旧请求且不再存储在合约中，因此答案未知，则此方法可能会返回 `1`。 |
| int get_public_key() |                                       重获公钥我们之前已经考虑过这种方法。                                       |

`last_cleaned` 从合约的存储和旧查询字典中检索。如果找到了查询，它应返回 true；如果没有，则表达式 `- (query_id <= last_cleaned)`。last_cleaned 包含最后一个被删除的、**时间戳最高**的请求，因为我们开始时从最小时间戳删除请求。

```func
int processed?(int query_id) method_id {
  var ds = get_data().begin_parse();
  var (_, last_cleaned, _, old_queries) = (ds~load_uint(32), ds~load_uint(64), ds~load_uint(256), ds~load_dict());
  ds.end_parse();
  (_, var found) = old_queries.udict_get?(64, query_id);
  return found ? true : - (query_id <= last_cleaned);
}
```

`最后一次清理` 是从合约存储和旧查询字典中获取的。如果找到查询，则返回 true；如果找不到，则返回表达式 `- (query_id <= last_cleaned)`。last_cleaned 包含最后删除的**个时间戳最高**的请求，因为我们在删除请求时是从最小时间戳开始的。

为了部署高负载钱包，必须提前生成一个助记词密钥，用户将使用此密钥。可以使用在本教程之前部分中使用的相同密钥。

### 部署高负载钱包 V2

为了部署高负载钱包，有必要提前生成一个记忆密钥，供用户使用。可以使用本教程前几节中使用的相同密钥。

要开始部署高负载钱包所需的过程，需要将[智能合约代码](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet-v2.fif)复制到stdlib.fc和wallet_v3所在的同一目录，并记住在代码开头添加 `#include "stdlib.fc";`。接下来，我们将按照 [section three](/v3/guidelines/smart-contracts/howto/wallet#compiling-wallet-code) 中的方法编译高负载钱包代码：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { compileFunc } from '@ton-community/func-js';
import fs from 'fs'
import { Cell } from '@ton/core';

const result = await compileFunc({
    targets: ['highload_wallet.fc'], // targets of your project
    sources: {
        'stdlib.fc': fs.readFileSync('./src/stdlib.fc', { encoding: 'utf-8' }),
        'highload_wallet.fc': fs.readFileSync('./src/highload_wallet.fc', { encoding: 'utf-8' }),
    }
});

if (result.status === 'error') {
console.error(result.message)
return;
}

const codeCell = Cell.fromBoc(Buffer.from(result.codeBoc, 'base64'))[0];

// now we have base64 encoded BOC with compiled code in result.codeBoc
console.log('Code BOC: ' + result.codeBoc);
console.log('\nHash: ' + codeCell.hash().toString('base64')); // get the hash of cell and convert in to base64 encoded string

```

</TabItem>
</Tabs>

在上述结果的基础上，我们可以使用base64编码的输出，在其他库和语言中检索包含我们钱包代码的cell，具体操作如下：

```text
Code BOC: te6ccgEBCQEA5QABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQHq8oMI1xgg0x/TP/gjqh9TILnyY+1E0NMf0z/T//QE0VNggED0Dm+hMfJgUXO68qIH+QFUEIf5EPKjAvQE0fgAf44WIYAQ9HhvpSCYAtMH1DAB+wCRMuIBs+ZbgyWhyEA0gED0Q4rmMQHIyx8Tyz/L//QAye1UCAAE0DACASAGBwAXvZznaiaGmvmOuF/8AEG+X5dqJoaY+Y6Z/p/5j6AmipEEAgegc30JjJLb/JXdHxQANCCAQPSWb6VsEiCUMFMDud4gkzM2AZJsIeKz

Hash: lJTRzI7fEvBWcaGpugmSEJbrUIEeGSTsZcPGKfu4CBI=
```

有了上述结果，我们就可以使用 base64 编码输出，在其他库和语言中用我们的钱包代码检索 cell ，如下所示：

<Tabs groupId="code-examples">
<TabItem value="go" label="Golang">

```go
import (
  "encoding/base64"
  "github.com/xssnick/tonutils-go/tvm/cell"
  "log"
)

base64BOC := "te6ccgEBCQEA5QABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQHq8oMI1xgg0x/TP/gjqh9TILnyY+1E0NMf0z/T//QE0VNggED0Dm+hMfJgUXO68qIH+QFUEIf5EPKjAvQE0fgAf44WIYAQ9HhvpSCYAtMH1DAB+wCRMuIBs+ZbgyWhyEA0gED0Q4rmMQHIyx8Tyz/L//QAye1UCAAE0DACASAGBwAXvZznaiaGmvmOuF/8AEG+X5dqJoaY+Y6Z/p/5j6AmipEEAgegc30JjJLb/JXdHxQANCCAQPSWb6VsEiCUMFMDud4gkzM2AZJsIeKz" // save our base64 encoded output from compiler to variable
codeCellBytes, _ := base64.StdEncoding.DecodeString(base64BOC) // decode base64 in order to get byte array
codeCell, err := cell.FromBOC(codeCellBytes) // get cell with code from byte array
if err != nil { // check if there is any error
  panic(err) 
}

log.Println("Hash:", base64.StdEncoding.EncodeToString(codeCell.Hash())) // get the hash of our cell, encode it to base64 because it has []byte type and output to the terminal
```

</TabItem>
</Tabs>

现在，我们需要检索一个由其初始数据组成的 cell ，建立一个状态初始，并计算出一个高负载钱包地址。在研究了智能合约代码后，我们发现 subwallet_id、last_cleaned、public_key 和 old_queries 是按顺序存储在存储器中的：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address, beginCell } from '@ton/core';
import { mnemonicToWalletKey } from '@ton/crypto';

const highloadMnemonicArray = 'put your mnemonic that you have generated and saved before'.split(' ');
const highloadKeyPair = await mnemonicToWalletKey(highloadMnemonicArray); // extract private and public keys from mnemonic

const dataCell = beginCell()
    .storeUint(698983191, 32) // Subwallet ID
    .storeUint(0, 64) // Last cleaned
    .storeBuffer(highloadKeyPair.publicKey) // Public Key
    .storeBit(0) // indicate that the dictionary is empty
    .endCell();

const stateInit = beginCell()
    .storeBit(0) // No split_depth
    .storeBit(0) // No special
    .storeBit(1) // We have code
    .storeRef(codeCell)
    .storeBit(1) // We have data
    .storeRef(dataCell)
    .storeBit(0) // No library
    .endCell();

const contractAddress = new Address(0, stateInit.hash()); // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
console.log(`Contract address: ${contractAddress.toString()}`); // Output contract address to console
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "crypto/ed25519"
  "crypto/hmac"
  "crypto/sha512"
  "github.com/xssnick/tonutils-go/address"
  "golang.org/x/crypto/pbkdf2"
  "strings"
)

highloadMnemonicArray := strings.Split("put your mnemonic that you have generated and saved before", " ") // word1 word2 word3
mac := hmac.New(sha512.New, []byte(strings.Join(highloadMnemonicArray, " ")))
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries "TON default seed" is used as salt when getting keys
// 32 is a key len
highloadPrivateKey := ed25519.NewKeyFromSeed(k)                      // get private key
highloadPublicKey := highloadPrivateKey.Public().(ed25519.PublicKey) // get public key from private key

dataCell := cell.BeginCell().
  MustStoreUInt(698983191, 32).           // Subwallet ID
  MustStoreUInt(0, 64).                   // Last cleaned
  MustStoreSlice(highloadPublicKey, 256). // Public Key
  MustStoreBoolBit(false).                // indicate that the dictionary is empty
  EndCell()

stateInit := cell.BeginCell().
  MustStoreBoolBit(false). // No split_depth
  MustStoreBoolBit(false). // No special
  MustStoreBoolBit(true).  // We have code
  MustStoreRef(codeCell).
  MustStoreBoolBit(true). // We have data
  MustStoreRef(dataCell).
  MustStoreBoolBit(false). // No library
  EndCell()

contractAddress := address.NewAddress(0, 0, stateInit.Hash()) // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
log.Println("Contract address:", contractAddress.String())    // Output contract address to console
```

</TabItem>
</Tabs> 

:::caution
上文详述的所有内容都与合约 [通过钱包部署](/v3/guidelines/smart-contracts/howto/wallet#contract-deployment-via-wallet) 部分的步骤相同。为了更好地理解，请阅读整个 [GitHub 源代码](https://github.com/aSpite/wallet-tutorial)。
:::

### 发送高负载钱包 V2 信息

现在，让我们给高负载钱包编程，让它同时发送多条信息。例如，每笔交易发送 12 条信息，这样 gas 费就不会太高。

:::info 高负荷平衡
要完成交易，合约余额必须至少达到 0.5  TON 。
:::

每条信息都有自己的注释和代码，目标地址将是我们部署的钱包：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address, beginCell, Cell, toNano } from '@ton/core';

let internalMessages:Cell[] = [];
const walletAddress = Address.parse('put your wallet address from which you deployed high-load wallet');

for (let i = 0; i < 12; i++) {
    const internalMessageBody = beginCell()
        .storeUint(0, 32)
        .storeStringTail(`Hello, TON! #${i}`)
        .endCell();

    const internalMessage = beginCell()
        .storeUint(0x18, 6) // bounce
        .storeAddress(walletAddress)
        .storeCoins(toNano('0.01'))
        .storeUint(0, 1 + 4 + 4 + 64 + 32)
        .storeBit(0) // We do not have State Init
        .storeBit(1) // We store Message Body as a reference
        .storeRef(internalMessageBody) // Store Message Body Init as a reference
        .endCell();

    internalMessages.push(internalMessage);
}
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "fmt"
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/tlb"
  "github.com/xssnick/tonutils-go/tvm/cell"
)

var internalMessages []*cell.Cell
walletAddress := address.MustParseAddr("put your wallet address from which you deployed high-load wallet")

for i := 0; i < 12; i++ {
  comment := fmt.Sprintf("Hello, TON! #%d", i)
  internalMessageBody := cell.BeginCell().
    MustStoreUInt(0, 32).
    MustStoreBinarySnake([]byte(comment)).
    EndCell()

  internalMessage := cell.BeginCell().
    MustStoreUInt(0x18, 6). // bounce
    MustStoreAddr(walletAddress).
    MustStoreBigCoins(tlb.MustFromTON("0.001").NanoTON()).
    MustStoreUInt(0, 1+4+4+64+32).
    MustStoreBoolBit(false). // We do not have State Init
    MustStoreBoolBit(true). // We store Message Body as a reference
    MustStoreRef(internalMessageBody). // Store Message Body Init as a reference
    EndCell()

  messageData := cell.BeginCell().
    MustStoreUInt(3, 8). // transaction mode
    MustStoreRef(internalMessage).
    EndCell()

	internalMessages = append(internalMessages, messageData)
}
```

</TabItem>
</Tabs>

完成上述过程后，结果就是一个内部报文数组。接下来，需要创建一个用于存储消息的字典，并准备和签署消息正文。具体步骤如下

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Dictionary } from '@ton/core';
import { mnemonicToWalletKey, sign } from '@ton/crypto';
import * as crypto from 'crypto';

const dictionary = Dictionary.empty<number, Cell>(); // create an empty dictionary with the key as a number and the value as a cell
for (let i = 0; i < internalMessages.length; i++) {
    const internalMessage = internalMessages[i]; // get our message from an array
    dictionary.set(i, internalMessage); // save the message in the dictionary
}

const queryID = crypto.randomBytes(4).readUint32BE(); // create a random uint32 number, 4 bytes = 32 bits
const now = Math.floor(Date.now() / 1000); // get current timestamp
const timeout = 120; // timeout for message expiration, 120 seconds = 2 minutes
const finalQueryID = (BigInt(now + timeout) << 32n) + BigInt(queryID); // get our final query_id
console.log(finalQueryID); // print query_id. With this query_id we can call GET method to check if our request has been processed

const toSign = beginCell()
    .storeUint(698983191, 32) // subwallet_id
    .storeUint(finalQueryID, 64)
    // Here we create our own method that will save the 
    // message mode and a reference to the message
    .storeDict(dictionary, Dictionary.Keys.Int(16), {
        serialize: (src, buidler) => {
            buidler.storeUint(3, 8); // save message mode, mode = 3
            buidler.storeRef(src); // save message as reference
        },
        // We won't actually use this, but this method 
        // will help to read our dictionary that we saved
        parse: (src) => {
            let cell = beginCell()
                .storeUint(src.loadUint(8), 8)
                .storeRef(src.loadRef())
                .endCell();
            return cell;
        }
    }
);

const highloadMnemonicArray = 'put your high-load wallet mnemonic'.split(' ');
const highloadKeyPair = await mnemonicToWalletKey(highloadMnemonicArray); // extract private and public keys from mnemonic
const highloadWalletAddress = Address.parse('put your high-load wallet address');

const signature = sign(toSign.endCell().hash(), highloadKeyPair.secretKey); // get the hash of our message to wallet smart contract and sign it to get signature
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "crypto/ed25519"
  "crypto/hmac"
  "crypto/sha512"
  "golang.org/x/crypto/pbkdf2"
  "log"
  "math/big"
  "math/rand"
  "strings"
  "time"
)

dictionary := cell.NewDict(16) // create an empty dictionary with the key as a number and the value as a cell
for i := 0; i < len(internalMessages); i++ {
  internalMessage := internalMessages[i]                             // get our message from an array
  err := dictionary.SetIntKey(big.NewInt(int64(i)), internalMessage) // save the message in the dictionary
  if err != nil {
    return
  }
}

queryID := rand.Uint32()
timeout := 120                                                               // timeout for message expiration, 120 seconds = 2 minutes
now := time.Now().Add(time.Duration(timeout)*time.Second).UTC().Unix() << 32 // get current timestamp + timeout
finalQueryID := uint64(now) + uint64(queryID)                                // get our final query_id
log.Println(finalQueryID)                                                    // print query_id. With this query_id we can call GET method to check if our request has been processed

toSign := cell.BeginCell().
  MustStoreUInt(698983191, 32). // subwallet_id
  MustStoreUInt(finalQueryID, 64).
  MustStoreDict(dictionary)

highloadMnemonicArray := strings.Split("put your high-load wallet mnemonic", " ") // word1 word2 word3
mac := hmac.New(sha512.New, []byte(strings.Join(highloadMnemonicArray, " ")))
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries "TON default seed" is used as salt when getting keys
// 32 is a key len
highloadPrivateKey := ed25519.NewKeyFromSeed(k) // get private key
highloadWalletAddress := address.MustParseAddr("put your high-load wallet address")

signature := ed25519.Sign(highloadPrivateKey, toSign.EndCell().Hash())
```

</TabItem>
</Tabs>

:::note 重要事项
请注意，在使用 JavaScript 和 TypeScript 时，我们的信息被保存到了一个数组中，而没有使用发送模式。出现这种情况的原因是，在使用 @ton/ton 库时，预计开发人员将自行实现序列化和反序列化过程。因此，在保存消息本身后，会传递一个先保存消息模式的方法。如果我们使用 subwallet_id 规范的值方法，它就会将整个消息保存为 cell 引用，而不会单独保存模式。
:::

接下来，我们将创建一条外部消息，并使用以下代码将其发送到区块链：

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from '@ton/ton';

const body = beginCell()
    .storeBuffer(signature) // store signature
    .storeBuilder(toSign) // store our message
    .endCell();

const externalMessage = beginCell()
    .storeUint(0b10, 2) // indicate that it is an incoming external message
    .storeUint(0, 2) // src -> addr_none
    .storeAddress(highloadWalletAddress)
    .storeCoins(0) // Import fee
    .storeBit(0) // We do not have State Init
    .storeBit(1) // We store Message Body as a reference
    .storeRef(body) // Store Message Body as a reference
    .endCell();

// We do not need a key here as we will be sending 1 request per second
const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    // apiKey: 'put your api key' // you can get an api key from @tonapibot bot in Telegram
});

client.sendFile(externalMessage.toBoc());
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "context"
  "github.com/xssnick/tonutils-go/liteclient"
  "github.com/xssnick/tonutils-go/tl"
  "github.com/xssnick/tonutils-go/ton"
)

body := cell.BeginCell().
  MustStoreSlice(signature, 512). // store signature
  MustStoreBuilder(toSign). // store our message
  EndCell()

externalMessage := cell.BeginCell().
  MustStoreUInt(0b10, 2). // ext_in_msg_info$10
  MustStoreUInt(0, 2). // src -> addr_none
  MustStoreAddr(highloadWalletAddress). // Destination address
  MustStoreCoins(0). // Import Fee
  MustStoreBoolBit(false). // No State Init
  MustStoreBoolBit(true). // We store Message Body as a reference
  MustStoreRef(body). // Store Message Body as a reference
  EndCell()

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection)

var resp tl.Serializable
err = client.Client().QueryLiteserver(context.Background(), ton.SendMessage{Body: externalMessage.ToBOCWithFlags(false)}, &resp)

if err != nil {
  log.Fatalln(err.Error())
  return
}
```

</TabItem>
</Tabs>

这个过程完成后，就可以查询我们的钱包，并验证我们的钱包是否发送了 12 条外发消息。是否还可以使用我们最初在控制台中使用的 query_id 调用 `processed?` GET 方法。如果该请求已被正确处理，则结果为 `-1` (true)。

## 🏁 结论

本教程让我们更好地了解了不同类型的钱包如何在 TON 区块链上运行。它还让我们学会了如何在不使用预定义库方法的情况下创建外部和内部消息。

阅读上述文档是一项复杂的任务，人们难以完全理解TON平台的全部内容。然而，这对于那些热衷于在TON上建设的人来说是一个很好的练习。另一个建议是开始学习如何在TON上编写智能合约，可以参考以下资源：[FunC概览](https://docs.ton.org/develop/func/overview)，[最佳实践](https://docs.ton.org/develop/smart-contracts/guidelines)，[智能合约示例](https://docs.ton.org/develop/smart-contracts/examples)，[FunC开发手册](https://docs.ton.org/develop/func/cookbook)

## 接下来的步骤

阅读上述文档是一项复杂的工作，很难理解 TON 平台的全部内容。不过，对于那些热衷于在 TON 上构建的人来说，这是一个很好的练习。另一个建议是参考以下资源，开始学习如何在 TON 上编写智能合约：[FunC 概述](/v3/documentation/smart-contracts/func/overview)、[最佳实践](/v3/guidelines/smart-contracts/guidelines)、[智能合约示例](/v3/documentation/smart-contracts/contracts-specs/examples)、[FunC Cookbook](/v3/documentation/smart-contracts/func/cookbook)

如果您有任何问题、评论或建议，请通过 [Telegram](https://t.me/aspite) (@aSpite 或 @SpiteMoriarty) 或 [GitHub](https://github.com/aSpite) 联系本文档部分的作者。

## 📖 参阅

如果您有任何问题、意见或建议，请通过 [Telegram](https://t.me/aspite) (@aSpite 或 @SpiteMoriarty) 或 [GitHub](https://github.com/aSpite) 联系本文档的作者。

## 📖 另请参见

- 钱包源代码：[V3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc), [V4](https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc), [High-load](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet-v2.fif)

- [@ton/core (JS/TS)](https://github.com/ton-org/ton-core)

官方文档：

- [内部消息](/develop/smart-contracts/guidelines/internal-messages)
- [外部消息](/develop/smart-contracts/guidelines/external-messages)
- [钱包合约类型](/participate/wallets/contracts#wallet-v4)
- [TL-B](/develop/data-formats/tl-b-language)

外部参考：

- [内部信息](/v3/documentation/smart-contracts/message-management/internal-messages)

- [外部信息](/v3/documentation/smart-contracts/message-management/external-messages)

- [钱包合约类型](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts#wallet-v4)

- [TL-B](/v3/documentation/data-formats/tlb/tl-b-language)

- [区块链中的区块链](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains)

外部参考资料：

- [Ton Deep](https://github.com/xssnick/ton-deep-doc)

- [Block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb)

- [ TON 标准](https://github.com/ton-blockchain/TEPs)
