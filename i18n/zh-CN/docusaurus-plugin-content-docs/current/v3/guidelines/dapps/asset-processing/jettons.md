import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Button from '@site/src/components/button';

# 处理 TON Jetton

## Jetton实践最佳做法

Jettons 是 TON 区块链上的代币--可以将其视为类似于以太坊上的 ERC-20 代币。

:::info 交易确认
TON 交易只需确认一次就不可逆转。为获得最佳用户体验/用户界面，请避免额外等待。
:::

#### 提款

[Highload Wallet v3](/v3/documentation/smart-contracts/contracts-specs/highload-wallet#highload-wallet-v3) - 这是 TON 区块链的最新解决方案，是 jetton 提款的黄金标准。它允许您利用分批提款的优势。

[分批提款](https://github.com/toncenter/examples/blob/main/withdrawals-jettons-highload-batch.js) - 指分批发送多笔提款，从而实现快速、廉价的提款。

#### 存款

:::info
建议设置多个 MEMO 存款钱包，以提高性能。
:::

[Memo Deposits](https://github.com/toncenter/examples/blob/main/deposits-jettons.js) - 这可以让你保留一个存款钱包，用户添加 memo 以便被你的系统识别。这意味着您不需要扫描整个区块链，但对用户来说稍显不便。

[Memo-less deposits](https://github.com/gobicycle/bicycle) - 这种解决方案也存在，但整合起来比较困难。不过，如果您希望采用这种方法，我们可以提供协助。请在决定采用这种方法之前通知我们。

### 其他信息

:::caution 交易通知
在进行 jetton 提取时，生态系统中的每项服务都应将 `forward_ton_amount` 设置为 0.000000001  TON （1  nanotons  ），以便在[成功转账](https://testnet.tonviewer.com/transaction/a0eede398d554318326b6e13081c2441f8b9a814bf9704e2e2f44f24adb3d407) 时发送 Jetton 通知，否则转账将不符合标准，其他 CEX 和服务将无法处理。
:::

- 请参见 JS 库示例 - [tonweb](https://github.com/toncenter/tonweb)  - 这是 TON 基金会的官方 JS 库。

- 如果您想使用 Java，可以参考 [ton4j](https://github.com/neodix42/ton4j/tree/main)。

- 对于 Go，应考虑 [tonutils-go](https://github.com/xssnick/tonutils-go)。目前，我们推荐使用 JS lib.

## 内容列表

:::tip
以下文档详细介绍了 Jettons 架构的总体情况，以及 TON 的核心概念，这些概念可能与 EVM 类区块链和其他区块链不同。要想很好地理解 TON，阅读这些文档至关重要，会对你有很大帮助。
:::

本文件依次介绍了以下内容：

1. 概述
2. 架构
3. Jetton 主合约 (Token Minter)
4. Jetton 钱包合约 (User Wallet)
5. 信息布局
6. Jetton 处理（链下）
7. Jetton 处理（链上）
8. 钱包处理
9. 最佳做法

## 概述

:::info
TON 交易只需确认一次就不可逆转。
为了清楚理解，读者应熟悉[本节文档](/v3/documentation/dapps/assets/overview) 中描述的资产处理基本原则。尤其要熟悉[合约](/v3/documentation/smart-contracts/addresses#everything-is-a-smart-contract)、[钱包](/v3/guidelines/smart-contracts/howto/wallet)、[消息](/v3/documentation/smart-contracts/message-management/messages-and-transactions) 和部署流程。
:::

:::info
为获得最佳用户体验，建议在 TON 区块链上完成交易后避免等待其他区块。更多信息请参阅 [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3)。
:::

快速跳转到 jetton 处理的核心描述：

<Button href="/v3/guidelines/dapps/asset-processing/jettons#accepting-jettons-from-users-through-a-centralized-wallet" colorType={'primary'} sizeType={'sm'}>集中处理</Button>
<Button href="/v3/guidelines/dapps/asset-processing/jettons#accepting-jettons-from-user-deposit-addresses"
colorType="secondary" sizeType={'sm'}>
链上处理 </Button>

<br></br><br></br>

TON 区块链及其底层生态系统将可替代代币（FT）归类为 jetton 。由于分片应用于 TON 区块链，与类似的区块链模型相比，我们对可替代代币的实现是独一无二的。

在本分析中，我们将深入探讨详细说明 jetton [行为](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md) 和 [元数据](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md) 的正式标准。
关于 jetton 架构不那么正式的分片概述，请参阅我们的
[anatomy of jettons 博客文章](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons)。

我们还提供了讨论我们的第三方开源 TON 支付处理器（[bicycle](https://github.com/gobicycle/bicycle)）的具体细节，该处理器允许用户使用单独的存款地址存取 Toncoin 和 Jettons，而无需使用文本 memo 。

## Jetton 架构

TON 上的标准化代币是通过一套智能合约实现的，其中包括

- [Jetton master](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter.fc) 智能合约
- [Jetton wallet](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc) 智能合约

<p align="center">
  <br />
    <img width="420" src="/img/docs/asset-processing/jetton_contracts.svg" alt="contracts scheme" />
      <br />
</p>

## Jetton 主智能合约

jetton 主智能合约存储有关 jetton 的一般信息（包括总供应量、元数据链接或元数据本身）。

:::warning 谨防 Jetton 骗局

具有 `symbol` 等于 `TON` 的 Jetton，或者包含系统通知消息（如 `ERROR`、`SYSTEM` 等）的 Jetton，务必确保这些 Jetton 在界面中以明确的方式显示，以避免它们与 TON 转账、系统通知等混淆。有时，甚至 `symbol`、`name` 和 `image` 都会被设计得与原版极为相似，试图误导用户。

为了消除 TON 用户被骗的可能性，请查询特定 Jetton 类型的**原始 Jetton 地址**（Jetton 主合约地址），或者**关注项目的官方社交媒体渠道或网站**以获取**正确信息**。您还可以通过 [Tonkeeper ton-assets 列表](https://github.com/tonkeeper/ton-assets) 检查资产，进一步降低被骗的风险。
:::

### 检索 Jetton 数据

要检索更具体的 Jetton 数据，请使用合约的 *get* 方法 `get_jetton_data()`。

该方法返回以下数据：

| 名称                   | 类型      | 说明                                                                                                                                                                                                     |
| -------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `total_supply`       | `int`   | 以不可分割单位计量的已发行净 TON 总数。                                                                                                                                                                                 |
| `mintable`           | `int`   | 详细说明是否可以铸造新 jetton。该值为-1（可以铸造）或 0（不能铸造）。                                                                                                                                                               |
| `admin_address`      | `slice` |                                                                                                                                                                                                        |
| `jetton_content`     | `cell`  | 根据 [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md)，您可以查看 [jetton 元数据解析页面](/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing) 获取更多信息。 |
| `jetton_wallet_code` | `cell`  |                                                                                                                                                                                                        |

还可以使用  [Toncenter API](https://toncenter.com/api/v3/#/default/get_jetton_masters_api_v3_jetton_masters_get) 中的 `/jetton/masters` 方法来检索已解码的 Jetton 数据和元数据。我们还为 (js) [tonweb](https://github.com/toncenter/tonweb/blob/master/src/contract/token/ft/JettonMinter.js#L85) 和 (js) [ton-core/ton](https://github.com/ton-core/ton/blob/master/src/jetton/JettonMaster.ts#L28), (go) [tongo](https://github.com/tonkeeper/tongo/blob/master/liteapi/jetton.go#L48) 还有 (go) [tonutils-go](https://github.com/xssnick/tonutils-go/blob/33fd62d754d3a01329ed5c904db542ab4a11017b/ton/jetton/jetton.go#L79), (python) [pytonlib](https://github.com/toncenter/pytonlib/blob/d96276ec8a46546638cb939dea23612876a62881/pytonlib/client.py#L742) 以及许多其他  [SDKs](/v3/guidelines/dapps/apis-sdks/sdk) 开发了方法。

使用 [Tonweb](https://github.com/toncenter/tonweb) 运行获取方法和获取链外元数据的 URL 的示例：

```js
import TonWeb from "tonweb";
const tonweb = new TonWeb();
const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: "<JETTON_MASTER_ADDRESS>"});
const data = await jettonMinter.getJettonData();
console.log('Total supply:', data.totalSupply.toString());
console.log('URI to off-chain metadata:', data.jettonContentUri);
```

### Jetton minter

如前所述，jettons 既可以是 `可铸 (minable)` 也可以是 `不可铸 (non-mintable)` 。

如果它们是不可铸币的，逻辑就变得很简单--没有办法铸入更多代币。要首次铸造代币，请参阅[铸造第一个代币](/v3/guidelines/dapps/tutorials/mint-your-first-token) 页面。

如果是可铸币，[铸币者合约](https://github.com/ton-blockchain/minter-contract/blob/main/contracts/jetton-minter.fc) 中会有一个特殊函数来铸造额外的铸币。可以通过从管理员地址发送带有指定操作码的 "内部信息 "来调用该函数。

如果 jetton 管理员希望限制 jetton 的创建，有三种方法：

1. 如果您不能或不想更新合约代码，则需要将当前管理员的所有权转移到零地址。这将使合约失去一个有效的管理员，从而阻止任何人铸币。不过，这也会阻止对 jetton 元数据的任何更改。
2. 如果您可以访问源代码并对其进行修改，您可以在合约中创建一个方法，设置一个标志，在调用该方法后中止任何造币过程，并在造币函数中添加一条语句来检查该标志。
3. 如果可以更新合约的代码，就可以通过更新已部署合约的代码来添加限制。

## Jetton 钱包智能合约

`Jetton wallet` 合约用于**发送**、**接收** 和 **销毁** jetton 。每个 `Jetton wallet` 合约都存储了特定用户的钱包余额信息。
在特定情况下， jetton  TON 钱包用于每种 jetton  TON 类型的单个 jetton  TON 持有者。

`Jetton wallets` **不应该与钱包**混淆，钱包是为了区块链交互和存储
Toncoin 资产（例如，v3R2钱包，高负载钱包和其他），它只负责支持和管理**特定的 jetton 类型**。

### 部署 Jetton 钱包

在钱包之间 `传输 jettons` 时，交易（消息）需要一定数量的 TON
作为网络 **gas fees** 和根据 jetton 钱包合约代码执行操作的付款。
这意味着**接收方在接收 jetton 之前无需部署 jetton 钱包**。
只要发送方的 Jetton 钱包中持有足够的 TON
来支付所需的 gas 费，接收方的 Jetton 钱包就会自动部署。

### 检索指定用户的 Jetton 钱包地址

要使用 "所有者地址"（TON 钱包地址）检索 "jetton 钱包 "的 "地址"，
，`Jetton master contract` 提供了获取方法 `get_wallet_address(slice owner_address)`。

<Tabs groupId="retrieve-wallet-address">
<TabItem value="api" label="API">

> 通过 [Toncenter API](https://toncenter.com/api/v3/#/default/run_get_method_api_v3_runGetMethod_post) 中的 `/runGetMethod` 方法运行 `get_wallet_address(slice owner_address)`。在实际情况下（而非测试情况下），必须始终检查钱包是否确实归属于所需的 Jetton Master。请查看代码示例了解更多信息。

</TabItem>
<TabItem value="js" label="js">

```js
import TonWeb from 'tonweb';
const tonweb = new TonWeb();
const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, { address: '<JETTON_MASTER_ADDRESS>' });
const jettonWalletAddress = await jettonMinter.getJettonWalletAddress(new TonWeb.utils.Address('<OWNER_WALLET_ADDRESS>'));

// It is important to always check that wallet indeed is attributed to desired Jetton Master:
const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {
  address: jettonWalletAddress
});
const jettonData = await jettonWallet.getData();
if (jettonData.jettonMinterAddress.toString(false) !== jettonMinter.address.toString(false)) {
  throw new Error('jetton minter address from jetton wallet doesnt match config');
}

console.log('Jetton wallet address:', jettonWalletAddress.toString(true, true, true));
```

</TabItem>
</Tabs>

:::tip
更多示例请阅读 [TON Cookbook](/v3/guidelines/dapps/cookbook#tep-74-jettons-standard)。
:::

### 检索特定 Jetton 钱包的数据

要检索钱包的账户余额、所有者身份信息以及与特定 jetton 钱包合约相关的其他信息，请使用 jetton 钱包合约中的 `get_wallet_data()` 获取方法。

该方法返回以下数据：

| 名称                   | 类型    |
| -------------------- | ----- |
| `balance`            | int   |
| `owner`              | slice |
| `jetton`             | slice |
| `jetton_wallet_code` | cell  |

<Tabs groupId="retrieve-jetton-wallet-data">
<TabItem value="api" label="API">

> 使用 [Toncenter API](https://toncenter.com/api/v3/#/default/get_jetton_wallets_api_v3_jetton_wallets_get) 中的 `/jetton/wallets` 获取方法，检索先前解码的 jetton 钱包数据。

</TabItem>

<TabItem value="js" label="js">

```js
import TonWeb from "tonweb";
const tonweb = new TonWeb();
const walletAddress = "EQBYc3DSi36qur7-DLDYd-AmRRb4-zk6VkzX0etv5Pa-Bq4Y";
const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider,{address: walletAddress});
const data = await jettonWallet.getData();
console.log('Jetton balance:', data.balance.toString());
console.log('Jetton owner address:', data.ownerAddress.toString(true, true, true));
// It is important to always check that Jetton Master indeed recognize wallet
const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: data.jettonMinterAddress.toString(false)});
const expectedJettonWalletAddress = await jettonMinter.getJettonWalletAddress(data.ownerAddress.toString(false));
if (expectedJettonWalletAddress.toString(false) !== new TonWeb.utils.Address(walletAddress).toString(false)) {
  throw new Error('jetton minter does not recognize the wallet');
}

console.log('Jetton master address:', data.jettonMinterAddress.toString(true, true, true));
```

</TabItem>
</Tabs>

## 信息布局

:::tip 信息
[点击此处](/v3/documentation/smart-contracts/message-management/messages-and-transactions) 阅读更多信息。
:::

Jetton 钱包和 TON 钱包之间通过以下通信顺序进行通信：

![](/img/docs/asset-processing/jetton_transfer.svg)

#### Message 0

`发件人 -> 发件人' jetton 钱包` 意味着 *转移* 消息体包含以下数据：

| 名称                     | 类型         | 说明                                                                                                           |
| ---------------------- | ---------- | ------------------------------------------------------------------------------------------------------------ |
| `query_id`             | uint64     | 允许应用程序链接三种消息类型 `Transfer`, `Transfer notification` 和 `Excesses` 。 为了正确执行此进程，建议**总是使用唯一的查询id**。               |
| `amount`               | coins      | 将与信息一起发送的 " TON coin "总量。                                                                                    |
| `destination`          | address    | 新所有者的地址                                                                                                      |
| `response_destination` | address    | 钱包地址，用于返还带有超额信息的剩余 TON 币。                                                                                    |
| `custom_payload`       | maybe cell | 大小始终 >= 1 bit。自定义数据（用于发送方或接收方 jetton 钱包的内部逻辑）。                                                               |
| `forward_ton_amount`   | coins      | 如果您想要发送 `transfer notification message` 与 `forward payload` ，则必须大于0。 它是 **一部分`amount`值** 和 **必须小于 `amount`** |
| `forward_payload`      | maybe cell | 大小总是 >= 1 位。如果前 32 位 = 0x0，这只是一条简单的信息。                                                                       |

#### Message 2'

`收款人的 jetton 钱包 -> 收款人`。  转账通知信息 (Transfer notification message)。**仅在**`forward_ton_amount`**不为零**时发送。包含以下数据：

| 名称                | 类型      |
| ----------------- | ------- |
| `query_id`        | uint64  |
| `amount`          | coins   |
| `sender`          | address |
| `forward_payload` | cell    |

这里的 `发送者` 地址是Alice的`Jeton wallet`的地址。

#### Message 2''

`收款人的 jetton 钱包 -> 发件人`。多余信息正文 (Excess message body)。**仅在支付费用后剩余 TON 币时发送**。包含以下数据：

| 名称         | 类型     |
| ---------- | ------ |
| `query_id` | uint64 |

:::tip Jettons 标准
关于 jetton 钱包合约字段的详细说明，请参阅 [TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md) `Jetton 标准`接口说明。
:::

## 如何发送附带评论和通知的 Jetton 转账

这次转账需要一些 TON 币作为 **费用** 和 **转账通知信息**。

要发送**评论**，您需要设置 "转发有效载荷"。将 **前 32 位设置为 0x0**，并附加 **您的文本**，"前向有效载荷 "将在 `jetton notify 0x7362d09c` 内部信息中发送。只有当 `forward_ton_amount` > 0 时才会生成。
:::info
建议带注释的 jetton 传输的 `forward_ton_amount` 为 1  nanotons  。
:::

最后，要获取 `Excess 0xd53276db` 信息，必须设置 `response destination`。

有时，您在发送 jetton 时可能会遇到 `709` 错误。该错误表示信息所附的 Toncoin 数量不足以发送信息。请确保 `Toncoin > to_nano(TRANSFER_CONSUMPTION) + forward_ton_amount`，这通常>0.04，除非转发的有效载荷非常大。佣金取决于多种因素，包括 Jetton 代码详情以及是否需要为收款人部署新的 Jetton 钱包。
建议在消息中添加一定数量的 Toncoin 作为余量，并将您的地址设置为 `response_destination`，以便接收 `Excess 0xd53276db` 消息。例如，您可以向消息中添加 0.05 TON，同时将 `forward_ton_amount` 设置为 1 nanoton（此 TON 数量将附加到 `jetton notify 0x7362d09c` 消息中）。

你也可能会遇到 [`cskip_no_gas`](/v3/documentation/tvm/tvm-overview#compute-phase-skipped) 错误，它表示成功转移了 jetton，但没有执行其他计算。当 `forward_ton_amount` 的值等于 1  nanotons  时，这种情况很常见。

:::tip
查看 [最佳实践](/v3/guidelines/dapps/asset-processing/jettons#best-practices) 中的 *"发送带注释的 jettons"* 示例。
:::

## Jetton 链下处理

:::info 交易确认
TON 交易只需确认一次就不可逆转。为获得最佳用户体验，建议在 TON 区块链上完成交易后避免等待其他区块。更多信息请参见 [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3)。
:::

接受 jetton 有两种方式：

- 在**集中式热钱包**内。
- 使用为每个用户**独立地址**的钱包。

出于安全考虑，最好为**个独立的 jetton **拥有**个独立的热钱包**（每种资产都有许多钱包）。

在处理资金时，还建议提供一个冷钱包，用于存储不参与自动存取款流程的多余资金。

### 为资产处理和初步核实添加新的 jetton

1. 查找正确的 [智能合约地址](/v3/guidelines/dapps/asset-processing/jettons#jetton-master-smart-contract)。
2. 获取 [元数据](/v3/guidelines/dapps/asset-processing/jettons#retrieving-jetton-data)。
3. 检查是否存在 [骗局](/v3/guidelines/dapps/asset-processing/jettons#jetton-master-smart-contract)。

### 接收转账通知信息时识别未知 Jetton

如果您的钱包中收到有关未知 Jetton 的转账通知消息，则表示您的钱包
已创建用于保存特定 Jetton。

包含 "转账通知" 正文的内部信息的发件人地址是新 Jetton 钱包的地址。
它不应与 "转账通知"[正文](/v3/guidelines/dapps/asset-processing/jettons#message-2) 中的 "发件人 "字段混淆。

1. 通过 [获取钱包数据](/v3/guidelines/dapps/asset-processing/jettons#retrieving-data-for-a-specific-jetton-wallet)，读取新 Jetton 钱包的 Jetton 主地址。
2. 使用 Jetton 主合约为您的钱包地址（作为所有者）找回 Jetton 钱包地址：[如何为指定用户找回 Jetton 钱包地址](#retrieving-jetton-wallet-addresses-for-a-given-user)
3. 比较主合约返回的地址和钱包令牌的实际地址。
   如果它们匹配，那就很理想。如果不匹配，则很可能收到的是伪造的诈骗令牌。
4. 检索 Jetton 元数据：[如何接收 Jetton 元数据](#retrieving-jetton-data)。
5. 检查 `symbol` 和 `name` 字段是否有欺诈迹象。必要时警告用户。[添加新的 jetton 进行处理和初始检查](#adding-new-jettons-for-asset-processing-and-initial-verification)。

### 通过中央钱包接收用户的 jetton

:::info
为防止单个钱包的入账交易出现瓶颈，建议通过多个钱包接受存款，并根据需要扩大这些钱包的数量。
:::

:::caution 交易通知
在进行 jetton 提取时，生态系统中的每项服务都应将 `forward_ton_amount` 设置为 0.000000001  TON （1  nanotons  ），以便在[成功转账](https://testnet.tonviewer.com/transaction/a0eede398d554318326b6e13081c2441f8b9a814bf9704e2e2f44f24adb3d407) 时发送 Jetton 通知，否则转账将不符合标准，其他 CEX 和服务将无法处理。
:::

在这种情况下，支付服务会为每个发件人创建一个唯一的 memo 标识符，披露集中钱包的地址和发送的金额。发送方将代币
发送到指定的集中地址，并在注释中附上必须的 memo 。

**这种方法的优点：** 这种方法非常简单，因为在接受代币时无需支付额外费用，而且代币可以直接在热钱包中找回。

**这种方法的缺点：** 这种方法要求所有用户在转账时附上注释，这可能会导致更多的存款错误（忘记 memo 、 memo 错误等），意味着支持人员的工作量增加。

Tonweb 示例：

1. [接受 Jetton 存款至个人 HOT 钱包并附评论（ memo ）](https://github.com/toncenter/examples/blob/main/deposits-jettons.js)
2. [ jetton 提款实例](https://github.com/toncenter/examples/blob/main/withdrawals-jettons.js)

#### 准备工作

1. [准备已接受的 jetton 列表](/v3/guidelines/dapps/asset-processing/jettons#adding-new-jettons-for-asset-processing-and-initial-verification) （ jetton 主地址）。
2. 部署热钱包（如果不需要 Jetton 取款，则使用 v3R2；如果需要 Jetton 取款，则使用高负载 v3）。[钱包部署](/v3/guidelines/dapps/asset-processing/payments-processing#wallet-deployment)。
3. 使用热钱包地址执行 Jetton 传输测试，初始化钱包。

#### 处理收到的 Jettons

1. 加载已接受的 jetton 列表。
2. [为已部署的热钱包获取 Jetton 钱包地址](#retrieving-jetton-wallet-addresses-for-a-given-user)。
3. 使用 [获取钱包数据](/v3/guidelines/dapps/asset-processing/jettons#retrieving-data-for-a-specific-jetton-wallet)，为每个 Jetton 钱包读取 Jetton 主地址。
4. 比较步骤 1 和步骤 3（正上方）中的 Jetton 主合约地址。
   如果地址不匹配，必须报告 Jetton 地址验证错误。
5. 读取使用热钱包账户的最新未处理交易列表，并
   进行迭代（对每笔交易逐一排序）。参见：  [检查合约交易](/v3/guidelines/dapps/asset-processing/payments-processing#check-contracts-transactions)。
6. 检查输入信息 (in_msg) 中的事务，并从输入信息中检索源地址。[Tonweb示例](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L84)
7. 如果源地址与 Jetton 钱包内的地址一致，则需要继续处理交易。
   如果不匹配，则跳过该交易，检查下一笔交易。
8. 确保报文正文不是空的，且报文的前 32 位与 "转移通知 "操作码 "0x7362d09c "匹配。
   [Tonweb示例](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L91)
   如果报文体为空或操作码无效，则跳过该事务。
9. 读取报文正文的其他数据，包括`query_id`、`amount`、`sender`、`forward_payload`。
   [Jetton合约消息布局](/v3/guidelines/dapps/asset-processing/jettons#message-layouts)，[Tonweb示例](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L105)
10. 尝试从 `forward_payload` 数据中检索文本注释。前 32 位必须与
    文本注释操作码 `0x00000000` 匹配，其余为 UTF-8 编码文本。
    [Tonweb示例](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L110)
11. 如果 `forward_payload` 数据为空或操作码无效，则跳过该事务。
12. 将收到的注释与保存的 memo 进行比较。如果匹配（始终可以识别用户），则存入转账。
13. 从第 5 步重新开始，重复该过程，直到完成整个交易列表。

### 从用户存款地址接收 jetton

为了接受来自用户存款地址的 Jettons，支付服务必须为每个发送资金的参与者创建
自己的独立地址（存款）。在这种情况下，服务提供涉及
多个并行流程的执行，包括创建新存款、扫描交易区块、
从存款中提取资金到热钱包等。

由于热钱包可以为每种 Jetton 类型使用一个 Jetton 钱包，因此有必要创建多个
钱包来启动存款。为了创建大量钱包，同时用
一个种子短语（或私钥）来管理它们，有必要在创建钱包时指定不同的 `subwallet_id `。
在 TON 上，v3 及更高版本的钱包支持创建子钱包所需的功能。

#### 在 Tonweb 中创建子钱包

```js
const WalletClass = tonweb.wallet.all['v3R2'];
const wallet = new WalletClass(tonweb.provider, {
    publicKey: keyPair.publicKey,
    wc: 0,
    walletId: <SUBWALLET_ID>,
});
```

#### 准备工作

1. [准备一份已接受的 jetton 清单](#adding-new-jettons-for-asset-processing-and-initial-verification)。
2. 部署热钱包（如果不需要 Jetton 取款，则使用 v3R2；如果需要 Jetton 取款，则使用高负载 v3）。[钱包部署](/v3/guidelines/dapps/asset-processing/payments-processing#wallet-deployment)。

#### 创建存款

1. 接受为用户创建新存款的请求。
2. 根据热钱包种子生成新的子钱包 (/v3R2) 地址。[在 Tonweb 中创建子钱包](#creating-a-subwallet-in-tonweb)
3. 接收地址可作为 Jetton 存款使用的地址提供给用户（这是存款 Jetton 钱包所有者
   的地址）。无需进行钱包初始化，这一步可以在从存款中提取 jetton  时完成
   。
4. 要获取该地址，必须通过 Jetton 主合约计算 Jetton 钱包的地址。
   [如何获取指定用户的 Jetton 钱包地址](#retrieving-jetton-wallet-addresses-for-a-given-user)。
5. 将 Jetton 钱包地址添加到地址池，用于交易监控，并保存子钱包地址。

#### 处理交易

:::info 交易确认
TON 交易只需确认一次就不可逆转。为获得最佳用户体验，建议在 TON 区块链上完成交易后避免等待其他区块。更多信息请参见 [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3)。
:::

由于 Jetton
钱包可能不会发送 `transfer notification`、`excesses` 和 `internal transfer` 消息，因此并非总能确定从消息中收到的 Jettons 的确切数量。它们没有标准化。这意味着
无法保证 `internal transfer` 消息可以被解码。

因此，要确定钱包中收到的金额，需要使用 get 方法请求余额。
请求余额时，根据账户在链上特定区块的状态，使用区块来检索关键数据。
[使用 Tonweb 接受区块的准备工作](https://github.com/toncenter/tonweb/blob/master/src/test-block-subscribe.js)。

这一过程如下：

1. 准备接受区块（使系统做好接受新区块的准备）。
2. 读取新区块并保存前一个区块 ID。
3. 接收来自区块的交易。
4. 过滤仅用于 Jetton 钱包存款池地址的交易。
5. 使用 `transfer notification` 正文对信息进行解码，以接收更详细的数据，包括
   `sender` 地址、Jetton `amount` 和注释。(请参阅：[处理收到的 jetton ](#processing-incoming-jettons))
6. 如果在
   账户内至少有一笔交易有不可解码的转出信息（信息体不包含
   `transfer notification` 的操作码和`excesses`的操作码）或没有转出信息，则必须使用当前区块的 get 方法请求 Jetton 余额，同时使用上一个
   区块计算余额差额。现在，由于
   区块内正在进行的交易，总余额存款的变化就会显现出来。
7. 作为未识别Jetton转账的标识符（没有`transfer notification`），如果有这样一个交易或区块数据存在（如果一个区块内有几个存在），则可以使用交易数据。
8. 现在需要检查以确保存款余额是正确的。如果存款余额足够发起热钱包和现有Jetton钱包之间的转账，则需要提取Jettons以确保钱包余额减少。
9. 从步骤 2 重新启动，重复整个过程。

#### 存款提款

不应从每次存款充值时都将存款转至热钱包，因为转账操作会收取TON手续费（以网络gas费支付）。
重要的是确定一定数量的Jettons，这些Jettons是必需的，才能使转账变得划算（从而存入）。

默认情况下，Jetton 存款钱包的钱包所有者不会被初始化。这是因为
没有支付存储费用的预定要求。Jetton 存款钱包可以在发送带有
`transfer` 主体的消息时部署，然后立即销毁。为此，工程师必须使用一种特殊的
机制来发送信息：[128 + 32](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes)。

1. 检索标记为将提取到热钱包的存款清单
2. 检索已保存的每笔存款的所有者地址
3. 然后，从高负载
   钱包向每个所有者地址发送信息（通过将若干此类信息合并为一个批次），并附加 TON Jetton 金额。这由以下因素决定：v3R2 钱包
   初始化的费用 + 发送带有 `transfer` 主体的信息的费用 + 与 `forward_ton_amount`
   相关的任意 TON 金额（如有必要）。所附的 TON 金额由 v3R2 钱包初始化费用（值） +
   与 `transfer` 主体一起发送信息的费用（值） + 与 `forward_ton_amount` 相关的任意 TON 金额
   （如有必要）相加得出。
4. 当地址上的余额变为非零时，账户状态就会改变。等待几秒钟并查看账户的状态
   ，它很快就会从 "不存在 "状态变为 "未启动 "状态。
5. 对于每个所有者地址（具有 `uninit` 状态），必须发送外部消息，其中包含 v3R2 钱包
   init 和 `transfer` 消息正文，以便存入 Jetton 钱包 = 128 + 32。对于 `transfer`，用户必须指定热钱包地址作为 `destination` 和 `response destination`。
   可添加文本注释，以便更简单地识别转账。
6. 可以通过
   验证使用存款地址向热钱包地址发送的 Jetton，同时考虑到[在此处找到的接收 Jettons 信息处理](#processing-incoming-jettons)。

### jetton 提款

:::info 重要

以下是处理 Jetton 提现的分步指南。
:::

要提取 Jettons，钱包会向相应的 Jetton 钱包发送带有 `transfer` 主体的信息。
然后，Jetton 钱包会将 Jettons 发送给收件人。必须附加一些 TON （至少 1  nanotons  ）
作为`forward_ton_amount`（以及`forward_payload`的可选注释），以触发`transfer notification`（转账通知）。
请参阅：[Jetton 合约信息布局](/v3/guidelines/dapps/asset-processing/jettons#message-layouts)

#### 准备工作

1. 准备一份供提取的 jetton 清单：[添加新 jetton 供处理和初步核实](#adding-new-jettons-for-asset-processing-and-initial-verification)。
2. 启动热钱包部署。建议使用高负载 v3。[钱包部署](/v3/guidelines/dapps/asset-processing/payments-processing#wallet-deployment)
3. 使用热钱包地址进行 Jetton 转账，以初始化 Jetton 钱包并补充其余额。

#### 处理提款

1. 加载已处理的 jetton 列表
2. 检索部署的热钱包的Jetton钱包地址：[如何为给定用户检索Jetton钱包地址](#为给定用户检索-jetton-钱包地址)
3. 检索每个 Jetton 钱包的 Jetton 主地址：[如何检索 Jetton 钱包的数据](#retrieving-data-for-a-specific-jetton-wallet)。
   需要一个 `jetton` 参数（实际上是 Jetton 主合约的地址）。
4. 比较步骤 1 和步骤 3 中 Jetton 主合约的地址。如果地址不匹配，则应报告 Jetton 地址验证错误。
5. 收到的取款请求会显示 Jetton 类型、转账金额和收款人钱包地址。
6. 检查 Jetton 钱包的余额，确保有足够的资金进行提款。
7. 生成 [信息](/v3/guidelines/dapps/asset-processing/jettons#message-0)。
8. 使用高负载钱包时，建议收集一批信息，一次发送一批，以优化费用。
9. 保存外发外部信息的过期时间（这是钱包成功
   处理信息之前的时间，处理完毕后，钱包将不再接受信息）
10. 发送单条信息或多条信息（批量发送信息）。
11. 读取热钱包账户中最新的未处理交易列表并进行迭代。
    点击此处了解更多：[检查合约的交易](/v3/guidelines/dapps/asset-processing/payments-processing#check-contracts-transactions)，
    [Tonweb 示例](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-single-wallet.js#L43) 或
    使用 Toncenter API `/getTransactions`方法。
12. 查看账户中发出的信息。
13. 如果存在带有 `transfer` 操作码的报文，则应对其进行解码，以获取 `query_id` 值。
    检索到的 `query_id` 需要标记为发送成功。
14. 如果当前扫描事务的处理时间大于
    过期时间，且未找到带有给定 `query_id`
    的传出消息，则应将该请求（可选）标记为过期，并安全地重新发送。
15. 在账户中查找收到的信息。
16. 如果存在使用 `Excess 0xd53276db` 操作码的报文，则应解码该报文并检索 `query_id`
    值。找到的 `query_id` 必须标记为成功传送。
17. 转至步骤 5。未成功发送的过期申请应推回到撤回列表中。

## Jetton 链上处理

一般来说，为了接受和处理 jettons，负责内部消息的消息处理程序会使用 `op=0x7362d09c` 操作码。

:::info 交易确认
TON 交易只需确认一次就不可逆转。为获得最佳用户体验，建议在 TON 区块链上完成交易后避免等待其他区块。更多信息请参见 [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3)。
:::

### 链上处理建议

下面是一个“建议列表”，**在链上处理 jetton 时**必须考虑：

1. 使用钱包类型，而不是 Jetton 主合约，**识别进入的 jetton**。换句话说，您的合约应该与特定的 jetton 钱包（而不是使用特定 Jetton 主合约的未知钱包）交互（接收和发送信息）。
2. 连接 Jetton 钱包和 Jetton 主合约时，**检查**此**连接是否双向**，即钱包识别主合约，反之亦然。例如，如果您的合约系统收到 jetton 钱包的通知（该钱包将 MySuperJetton 视为其主合约），则必须向用户显示其转移信息，在显示 MySuperJetton 合约的 `symbol`、`name` 和 `image`
   之前，请检查 MySuperJetton 钱包是否使用了正确的合约系统。反过来，如果您的合约系统由于某种原因需要使用 MySuperJetton 或 MySuperJetton 主合约发送捷径，请确认 X 钱包与使用相同合约参数的钱包一样。
   此外，在向 X 发送 `transfer` 请求之前，请确保它将 MySuperJetton 识别为主合约。
3. 去中心化金融（DeFi）的**真正力量**在于它能够像乐高积木一样将协议堆叠在一起。例如，将 jetton A 交换为 jetton B，然后将 jetton B 用作借贷协议中的杠杆（当用户提供流动性时），再将 jetton B 用于购买 NFT .... 等等。因此，考虑一下合约如何通过将标记化价值附加到转账通知上，添加一个可与转账通知一起发送的自定义有效载荷，不仅为链下用户提供服务，也为链上实体提供服务。
4. **请注意**，并非所有合约都遵循相同的标准。不幸的是，有些 jetton 可能是敌对的（使用基于攻击的载体），其创建的唯一目的就是攻击毫无戒心的用户。为了安全起见，如果相关协议由许多合约组成，请勿创建大量相同类型的 jetton 钱包。特别是，不要在协议内部的存款合约、金库合约或用户账户合约等之间发送 jetton。攻击者可能会通过伪造转账通知、jetton 金额或有效载荷参数来故意干扰合约逻辑。每个 jetton（用于所有存款和取款）在系统中只使用一个钱包，从而降低潜在的攻击可能性。
5. 为每个个性化的 jetton 创建分包合约也是一个**好的办法**，这样可以减少地址欺骗的机会（例如，当使用针对 jetton A 的合约向 jetton B 发送传输信息时）。
6. **强烈建议**在合约层面使用不可分割的 jetton 单位。与小数有关的逻辑通常用于增强用户界面 (UI)，与链上的数字记录保存无关。

要了解有关[Secure Smart Contract Programming in FunC by CertiK](https://blog.ton.org/secure-smart-contract-programming-in-func)的**更多**信息，请随时阅读本资源。建议开发人员\*\*处理所有智能合约异常，\*\*这样在应用程序开发过程中就不会跳过这些异常。

## Jetton 钱包处理建议

一般来说，用于链外 Jetton 处理的所有验证程序也适用于钱包。对于 Jetton 钱包处理，我们最重要的建议如下：

1. 当钱包收到来自未知 Jetton 钱包的转账通知时，**信任**该 Jetton 钱包及其主合约地址是至关重要的，因为它可能是一个恶意伪造的钱包。为了保护自己，请通过提供的地址检查 Jetton Master（主合约），以确保您的验证流程能够确认该 Jetton 钱包的合法性。在确认钱包可信且合法后，您可以允许其访问您的账户余额及其他钱包内的数据。如果 Jetton Master 无法识别该钱包，建议完全避免发起或披露您的 Jetton 转账，并仅显示附加在转账通知中的 TON 转账（Toncoin）信息。
2. 在实践中，如果用户想与 Jetton 而不是 jetton 钱包进行交互。换句话说，用户发送 wTON/oUSDT/jUSDT, jUSDC, jDAI 而不是 `EQAjN...`/`EQBLE...`
   等。通常情况下，这意味着当用户发起 jetton 转账时，钱包会询问相应的 jetton 主钱包（用户拥有）哪个 jetton 钱包应该发起转账请求。**切勿盲目相信**管理员（主合约）提供的数据，这一点**非常重要**。在向 jetton 钱包发送转账请求之前，请务必确保 jetton 钱包确实属于其声称的 Jetton Master。
3. **请注意**，恶意的 Jetton Masters/jetton 钱包**可能会随着时间的推移而改变**他们的钱包/Masters。因此，用户必须尽职尽责，并在每次使用前检查与之互动的任何钱包的合法性。
4. **始终确保**在界面中以明确的方式显示 Jetton，避免与 TON 转账、系统通知等混淆。即使是 `symbol`、`name` 和 `image` 参数，也可能被伪造来误导用户，使其成为潜在的诈骗受害者。曾经发生多起案例，恶意 Jetton 被用来冒充 TON 转账、错误通知、奖励收益或资产冻结公告。
5. **始终警惕可能的恶意行为者**创建伪造的 Jetton，为用户提供功能以在主界面中移除不需要的 Jetton 是一个明智的选择。

作者：[kosrk](https://github.com/kosrk)、[krigga](https://github.com/krigga)、[EmelyanenkoK](https://github.com/EmelyanenkoK/)和[tolya-yanot](https://github.com/tolya-yanot/)。

## 最佳实践

如果您想要测试示例，请查看 [SDKs](/v3/guidelines/dapps/asset-processing/jettons#sdks)并尝试运行它们。以下代码片段将通过代码示例帮助您了解 jetton 处理。

### 发送带有评论的 Jettons

<Tabs groupId="code-examples">
<TabItem value="tonweb" label="JS (tonweb)">

<details>
<summary>
源代码
</summary>

```js
// first 4 bytes are tag of text comment
const comment = new Uint8Array([... new Uint8Array(4), ... new TextEncoder().encode('text comment')]);

await wallet.methods.transfer({
  secretKey: keyPair.secretKey,
  toAddress: JETTON_WALLET_ADDRESS, // address of Jetton wallet of Jetton sender
  amount: TonWeb.utils.toNano('0.05'), // total amount of TONs attached to the transfer message
  seqno: seqno,
  payload: await jettonWallet.createTransferBody({
    jettonAmount: TonWeb.utils.toNano('500'), // Jetton amount (in basic indivisible units)
    toAddress: new TonWeb.utils.Address(WALLET2_ADDRESS), // recepient user's wallet address (not Jetton wallet)
    forwardAmount: TonWeb.utils.toNano('0.01'), // some amount of TONs to invoke Transfer notification message
    forwardPayload: comment, // text comment for Transfer notification message
    responseAddress: walletAddress // return the TONs after deducting commissions back to the sender's wallet address
  }),
  sendMode: 3,
}).send()
```

</details>

</TabItem>
<TabItem value="tonutils-go" label="Golang">

<details>
<summary>
源代码
</summary>

```go
client := liteclient.NewConnectionPool()

// connect to testnet lite server
err := client.AddConnectionsFromConfigUrl(context.Background(), "https://ton.org/global.config.json")
if err != nil {
   panic(err)
}

ctx := client.StickyContext(context.Background())

// initialize ton api lite connection wrapper
api := ton.NewAPIClient(client)

// seed words of account, you can generate them with any wallet or using wallet.NewSeed() method
words := strings.Split("birth pattern then forest walnut then phrase walnut fan pumpkin pattern then cluster blossom verify then forest velvet pond fiction pattern collect then then", " ")

w, err := wallet.FromSeed(api, words, wallet.V3R2)
if err != nil {
   log.Fatalln("FromSeed err:", err.Error())
   return
}

token := jetton.NewJettonMasterClient(api, address.MustParseAddr("EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw"))

// find our jetton wallet
tokenWallet, err := token.GetJettonWallet(ctx, w.WalletAddress())
if err != nil {
   log.Fatal(err)
}

amountTokens := tlb.MustFromDecimal("0.1", 9)

comment, err := wallet.CreateCommentCell("Hello from tonutils-go!")
if err != nil {
   log.Fatal(err)
}

// address of receiver's wallet (not token wallet, just usual)
to := address.MustParseAddr("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N")
transferPayload, err := tokenWallet.BuildTransferPayload(to, amountTokens, tlb.ZeroCoins, comment)
if err != nil {
   log.Fatal(err)
}

// your TON balance must be > 0.05 to send
msg := wallet.SimpleMessage(tokenWallet.Address(), tlb.MustFromTON("0.05"), transferPayload)

log.Println("sending transaction...")
tx, _, err := w.SendWaitTransaction(ctx, msg)
if err != nil {
   panic(err)
}
log.Println("transaction confirmed, hash:", base64.StdEncoding.EncodeToString(tx.Hash))
```

</details>

</TabItem>
<TabItem value="TonTools" label="Python">

<details>
<summary>
源代码
</summary>

```py
my_wallet = Wallet(provider=client, mnemonics=my_wallet_mnemonics, version='v4r2')

# for TonCenterClient and LsClient
await my_wallet.transfer_jetton(destination_address='address', jetton_master_address=jetton.address, jettons_amount=1000, fee=0.15) 

# for all clients
await my_wallet.transfer_jetton_by_jetton_wallet(destination_address='address', jetton_wallet='your jetton wallet address', jettons_amount=1000, fee=0.1)  
```

</details>

</TabItem>

<TabItem value="pytoniq" label="Python">

<details>
<summary>
源代码
</summary>

```py
from pytoniq import LiteBalancer, WalletV4R2, begin_cell
import asyncio

mnemonics = ["your", "mnemonics", "here"]

async def main():
    provider = LiteBalancer.from_mainnet_config(1)
    await provider.start_up()

    wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=mnemonics)
    USER_ADDRESS = wallet.address
    JETTON_MASTER_ADDRESS = "EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE"
    DESTINATION_ADDRESS = "EQAsl59qOy9C2XL5452lGbHU9bI3l4lhRaopeNZ82NRK8nlA"

    USER_JETTON_WALLET = (await provider.run_get_method(address=JETTON_MASTER_ADDRESS,
                                                        method="get_wallet_address",
                                                        stack=[begin_cell().store_address(USER_ADDRESS).end_cell().begin_parse()]))[0].load_address()
    forward_payload = (begin_cell()
                      .store_uint(0, 32) # TextComment op-code
                      .store_snake_string("Comment")
                      .end_cell())
    transfer_cell = (begin_cell()
                    .store_uint(0xf8a7ea5, 32)          # Jetton Transfer op-code
                    .store_uint(0, 64)                  # query_id
                    .store_coins(1 * 10**9)             # Jetton amount to transfer in nanojetton
                    .store_address(DESTINATION_ADDRESS) # Destination address
                    .store_address(USER_ADDRESS)        # Response address
                    .store_bit(0)                       # Custom payload is None
                    .store_coins(1)                     # Ton forward amount in nanoton
                    .store_bit(1)                       # Store forward_payload as a reference
                    .store_ref(forward_payload)         # Forward payload
                    .end_cell())

    await wallet.transfer(destination=USER_JETTON_WALLET, amount=int(0.05*1e9), body=transfer_cell)
    await provider.close_all()

asyncio.run(main())
```

</details>

</TabItem>
</Tabs>

### 接受带注释解析的 Jetton 交易

<Tabs groupId="parse-code-examples">
<TabItem value="tonweb" label="JS (tonweb)">

<details>
<summary>
源代码
</summary>

```ts
import {
    Address,
    TonClient,
    Cell,
    beginCell,
    storeMessage,
    JettonMaster,
    OpenedContract,
    JettonWallet,
    Transaction
} from '@ton/ton';


export async function retry<T>(fn: () => Promise<T>, options: { retries: number, delay: number }): Promise<T> {
    let lastError: Error | undefined;
    for (let i = 0; i < options.retries; i++) {
        try {
            return await fn();
        } catch (e) {
            if (e instanceof Error) {
                lastError = e;
            }
            await new Promise(resolve => setTimeout(resolve, options.delay));
        }
    }
    throw lastError;
}

export async function tryProcessJetton(orderId: string) : Promise<string> {

    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: 'TONCENTER-API-KEY', // https://t.me/tonapibot
    });

    interface JettonInfo {
        address: string;
        decimals: number;
    }

    interface Jettons {
        jettonMinter : OpenedContract<JettonMaster>,
        jettonWalletAddress: Address,
        jettonWallet: OpenedContract<JettonWallet>
    }

    const MY_WALLET_ADDRESS = 'INSERT-YOUR-HOT-WALLET-ADDRESS'; // your HOT wallet

    const JETTONS_INFO : Record<string, JettonInfo> = {
        'jUSDC': {
            address: 'EQB-MPwrd1G6WKNkLz_VnV6WqBDd142KMQv-g1O-8QUA3728', //
            decimals: 6
        },
        'jUSDT': {
            address: 'EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA',
            decimals: 6
        },
    }
    const jettons: Record<string, Jettons> = {};

    const prepare = async () => {
        for (const name in JETTONS_INFO) {
            const info = JETTONS_INFO[name];
            const jettonMaster = client.open(JettonMaster.create(Address.parse(info.address)));
            const userAddress = Address.parse(MY_WALLET_ADDRESS);

            const jettonUserAddress =  await jettonMaster.getWalletAddress(userAddress);
          
            console.log('My jetton wallet for ' + name + ' is ' + jettonUserAddress.toString());

            const jettonWallet = client.open(JettonWallet.create(jettonUserAddress));

            //const jettonData = await jettonWallet;
            const jettonData = await client.runMethod(jettonUserAddress, "get_wallet_data")

            jettonData.stack.pop(); //skip balance
            jettonData.stack.pop(); //skip owneer address
            const adminAddress = jettonData.stack.readAddress();


            if (adminAddress.toString() !== (Address.parse(info.address)).toString()) {
                throw new Error('jetton minter address from jetton wallet doesnt match config');
            }

            jettons[name] = {
                jettonMinter: jettonMaster,
                jettonWalletAddress: jettonUserAddress,
                jettonWallet: jettonWallet
            };
        }
    }

    const jettonWalletAddressToJettonName = (jettonWalletAddress : Address) => {
        const jettonWalletAddressString = jettonWalletAddress.toString();
        for (const name in jettons) {
            const jetton = jettons[name];

            if (jetton.jettonWallet.address.toString() === jettonWalletAddressString) {
                return name;
            }
        }
        return null;
    }

    // Subscribe
    const Subscription = async ():Promise<Transaction[]> =>{

      const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: 'TONCENTER-API-KEY', // https://t.me/tonapibot
      });

        const myAddress = Address.parse('INSERT-YOUR-HOT-WALLET'); // Address of receiver TON wallet
        const transactions = await client.getTransactions(myAddress, {
            limit: 5,
        });
        return transactions;
    }

    return retry(async () => {

        await prepare();
        const Transactions = await Subscription();

        for (const tx of Transactions) {

            const sourceAddress = tx.inMessage?.info.src;
            if (!sourceAddress) {
                // external message - not related to jettons
                continue;
            }

            if (!(sourceAddress instanceof Address)) {
                continue;
            }

            const in_msg = tx.inMessage;

            if (in_msg?.info.type !== 'internal') {
                // external message - not related to jettons
                continue;
            }

            // jetton master contract address check
            const jettonName = jettonWalletAddressToJettonName(sourceAddress);
            if (!jettonName) {
                // unknown or fake jetton transfer
                continue;
            }

            if (tx.inMessage === undefined || tx.inMessage?.body.hash().equals(new Cell().hash())) {
                // no in_msg or in_msg body
                continue;
            }

            const msgBody = tx.inMessage;
            const sender = tx.inMessage?.info.src;
            const originalBody = tx.inMessage?.body.beginParse();
            let body = originalBody?.clone();
            const op = body?.loadUint(32);
            if (!(op == 0x7362d09c)) {
                continue; // op != transfer_notification
            }

            console.log('op code check passed', tx.hash().toString('hex'));

            const queryId = body?.loadUint(64);
            const amount = body?.loadCoins();
            const from = body?.loadAddress();
            const maybeRef = body?.loadBit();
            const payload = maybeRef ? body?.loadRef().beginParse() : body;
            const payloadOp = payload?.loadUint(32);
            if (!(payloadOp == 0)) {
                console.log('no text comment in transfer_notification');
                continue;
            }

            const comment = payload?.loadStringTail();
            if (!(comment == orderId)) {
                continue;
            }
            
            console.log('Got ' + jettonName + ' jetton deposit ' + amount?.toString() + ' units with text comment "' + comment + '"');
            const txHash = tx.hash().toString('hex');
            return (txHash);
        }
        throw new Error('Transaction not found');
    }, {retries: 30, delay: 1000});
}
```

</details>

</TabItem>
<TabItem value="tonutils-go" label="Golang">

<details>
<summary>
源代码
</summary>

```go
import (
	"context"
	"fmt"
	"log"

	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/tlb"
	"github.com/xssnick/tonutils-go/ton"
	"github.com/xssnick/tonutils-go/ton/jetton"
	"github.com/xssnick/tonutils-go/tvm/cell"
)

const (
	MainnetConfig   = "https://ton.org/global.config.json"
	TestnetConfig   = "https://ton.org/global.config.json"
	MyWalletAddress = "INSERT-YOUR-HOT-WALLET-ADDRESS"
)

type JettonInfo struct {
	address  string
	decimals int
}

type Jettons struct {
	jettonMinter        *jetton.Client
	jettonWalletAddress string
	jettonWallet        *jetton.WalletClient
}

func prepare(api ton.APIClientWrapped, jettonsInfo map[string]JettonInfo) (map[string]Jettons, error) {
	userAddress := address.MustParseAddr(MyWalletAddress)
	block, err := api.CurrentMasterchainInfo(context.Background())
	if err != nil {
		return nil, err
	}

	jettons := make(map[string]Jettons)

	for name, info := range jettonsInfo {
		jettonMaster := jetton.NewJettonMasterClient(api, address.MustParseAddr(info.address))
		jettonWallet, err := jettonMaster.GetJettonWallet(context.Background(), userAddress)
		if err != nil {
			return nil, err
		}

		jettonUserAddress := jettonWallet.Address()

		jettonData, err := api.RunGetMethod(context.Background(), block, jettonUserAddress, "get_wallet_data")
		if err != nil {
			return nil, err
		}

		slice := jettonData.MustCell(0).BeginParse()
		slice.MustLoadCoins() // skip balance
		slice.MustLoadAddr()  // skip owneer address
		adminAddress := slice.MustLoadAddr()

		if adminAddress.String() != info.address {
			return nil, fmt.Errorf("jetton minter address from jetton wallet doesnt match config")
		}

		jettons[name] = Jettons{
			jettonMinter:        jettonMaster,
			jettonWalletAddress: jettonUserAddress.String(),
			jettonWallet:        jettonWallet,
		}
	}

	return jettons, nil
}

func jettonWalletAddressToJettonName(jettons map[string]Jettons, jettonWalletAddress string) string {
	for name, info := range jettons {
		if info.jettonWallet.Address().String() == jettonWalletAddress {
			return name
		}
	}
	return ""
}

func GetTransferTransactions(orderId string, foundTransfer chan<- *tlb.Transaction) {
	jettonsInfo := map[string]JettonInfo{
		"jUSDC": {address: "EQB-MPwrd1G6WKNkLz_VnV6WqBDd142KMQv-g1O-8QUA3728", decimals: 6},
		"jUSDT": {address: "EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA", decimals: 6},
	}

	client := liteclient.NewConnectionPool()

	cfg, err := liteclient.GetConfigFromUrl(context.Background(), MainnetConfig)
	if err != nil {
		log.Fatalln("get config err: ", err.Error())
	}

	// connect to lite servers
	err = client.AddConnectionsFromConfig(context.Background(), cfg)
	if err != nil {
		log.Fatalln("connection err: ", err.Error())
	}

	// initialize ton api lite connection wrapper
	api := ton.NewAPIClient(client, ton.ProofCheckPolicySecure).WithRetry()
	master, err := api.CurrentMasterchainInfo(context.Background())
	if err != nil {
		log.Fatalln("get masterchain info err: ", err.Error())
	}

	// address on which we are accepting payments
	treasuryAddress := address.MustParseAddr("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N")

	acc, err := api.GetAccount(context.Background(), master, treasuryAddress)
	if err != nil {
		log.Fatalln("get masterchain info err: ", err.Error())
	}

	jettons, err := prepare(api, jettonsInfo)
	if err != nil {
		log.Fatalln("can't prepare jettons data: ", err.Error())
	}

	lastProcessedLT := acc.LastTxLT

	transactions := make(chan *tlb.Transaction)

	go api.SubscribeOnTransactions(context.Background(), treasuryAddress, lastProcessedLT, transactions)

	log.Println("waiting for transfers...")

	// listen for new transactions from channel
	for tx := range transactions {
		if tx.IO.In == nil || tx.IO.In.MsgType != tlb.MsgTypeInternal {
			// external message - not related to jettons
			continue
		}

		msg := tx.IO.In.Msg
		sourceAddress := msg.SenderAddr()

		// jetton master contract address check
		jettonName := jettonWalletAddressToJettonName(jettons, sourceAddress.String())
		if len(jettonName) == 0 {
			// unknown or fake jetton transfer
			continue
		}

		if msg.Payload() == nil || msg.Payload() == cell.BeginCell().EndCell() {
			// no in_msg body
			continue
		}

		msgBodySlice := msg.Payload().BeginParse()

		op := msgBodySlice.MustLoadUInt(32)
		if op != 0x7362d09c {
			continue // op != transfer_notification
		}

		// just skip bits
		msgBodySlice.MustLoadUInt(64)
		amount := msgBodySlice.MustLoadCoins()
		msgBodySlice.MustLoadAddr()

		payload := msgBodySlice.MustLoadMaybeRef()
		payloadOp := payload.MustLoadUInt(32)
		if payloadOp == 0 {
			log.Println("no text comment in transfer_notification")
			continue
		}

		comment := payload.MustLoadStringSnake()
		if comment != orderId {
			continue
		}

		// process transaction
		log.Printf("Got %s jetton deposit %d units with text comment %s\n", jettonName, amount, comment)
		foundTransfer <- tx
	}
}
```

</details>
</TabItem>

<TabItem value="pythoniq" label="Python">

<details>
<summary>
源代码
</summary>

```py
import asyncio

from pytoniq import LiteBalancer, begin_cell

MY_WALLET_ADDRESS = "EQAsl59qOy9C2XL5452lGbHU9bI3l4lhRaopeNZ82NRK8nlA"


async def parse_transactions(provider: LiteBalancer, transactions):
    for transaction in transactions:
        if not transaction.in_msg.is_internal:
            continue
        if transaction.in_msg.info.dest.to_str(1, 1, 1) != MY_WALLET_ADDRESS:
            continue

        sender = transaction.in_msg.info.src.to_str(1, 1, 1)
        value = transaction.in_msg.info.value_coins
        if value != 0:
            value = value / 1e9

        if len(transaction.in_msg.body.bits) < 32:
            print(f"TON transfer from {sender} with value {value} TON")
            continue

        body_slice = transaction.in_msg.body.begin_parse()
        op_code = body_slice.load_uint(32)
        if op_code != 0x7362D09C:
            continue

        body_slice.load_bits(64)  # skip query_id
        jetton_amount = body_slice.load_coins() / 1e9
        jetton_sender = body_slice.load_address().to_str(1, 1, 1)
        if body_slice.load_bit():
            forward_payload = body_slice.load_ref().begin_parse()
        else:
            forward_payload = body_slice

        jetton_master = (
            await provider.run_get_method(
                address=sender, method="get_wallet_data", stack=[]
            )
        )[2].load_address()
        jetton_wallet = (
            (
                await provider.run_get_method(
                    address=jetton_master,
                    method="get_wallet_address",
                    stack=[
                        begin_cell()
                        .store_address(MY_WALLET_ADDRESS)
                        .end_cell()
                        .begin_parse()
                    ],
                )
            )[0]
            .load_address()
            .to_str(1, 1, 1)
        )

        if jetton_wallet != sender:
            print("FAKE Jetton Transfer")
            continue

        if len(forward_payload.bits) < 32:
            print(
                f"Jetton transfer from {jetton_sender} with value {jetton_amount} Jetton"
            )
        else:
            forward_payload_op_code = forward_payload.load_uint(32)
            if forward_payload_op_code == 0:
                print(
                    f"Jetton transfer from {jetton_sender} with value {jetton_amount} Jetton and comment: {forward_payload.load_snake_string()}"
                )
            else:
                print(
                    f"Jetton transfer from {jetton_sender} with value {jetton_amount} Jetton and unknown payload: {forward_payload} "
                )

        print(f"Transaction hash: {transaction.cell.hash.hex()}")
        print(f"Transaction lt: {transaction.lt}")


async def main():
    provider = LiteBalancer.from_mainnet_config(1)
    await provider.start_up()
    transactions = await provider.get_transactions(address=MY_WALLET_ADDRESS, count=5)
    await parse_transactions(provider, transactions)
    await provider.close_all()


if __name__ == "__main__":
    asyncio.run(main())
```

</details>
</TabItem>
</Tabs>

## SDK

您可以在 [此处](/v3/guidelines/dapps/apis-sdks/sdk) 找到各种语言（js、python、golang、C#、Rust 等）的 SDK 列表。

## 另请参见

- [支付处理](/v3/guidelines/dapps/asset-processing/payments-processing)
- [TON 上的 NFT 处理](/v3/guidelines/dapps/asset-processing/nft-processing/nfts)
- [在 TON 上解析元数据](/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing)
