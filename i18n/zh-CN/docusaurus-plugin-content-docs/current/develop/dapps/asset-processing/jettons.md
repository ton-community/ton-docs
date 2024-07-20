import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Button from '@site/src/components/button';

# 处理 TON Jetton

处理 jettons 的最佳实践及注释：

- [接受 jettons 存款的 JS 算法](https://github.com/toncenter/examples/blob/main/deposits-jettons.js)

- [jettons 提款的 JS 算法](https://github.com/toncenter/examples/blob/main/withdrawals-jettons.js)

在大多数情况下，这应该足够你使用，如果不够，你可以在下面找到详细信息。

## 内容列表

本文档依次描述了以下内容：
1. 概览
2. 架构
3. Jetton 主合约（代币铸造）
4. Jetton 钱包合约（用户钱包）
5. 消息布局
6. Jetton 处理（链下）
7. Jetton 处理（链上）
8. 钱包处理
9. 最佳实践

## 概览

:::info
为了清晰理解，读者应该熟悉在[我们的文档的这一部分](/develop/dapps/asset-processing/)描述的资产处理的基本原理。特别重要的是要熟悉[合约](/learn/overviews/addresses#everything-is-a-smart-contract)、[钱包](/develop/smart-contracts/tutorials/wallet)、[消息](/develop/smart-contracts/guidelines/message-delivery-guarantees)和部署过程。
:::

快速跳转到 jetton 处理的核心描述：

````mdx-code-block 
<Button href="/develop/dapps/asset-processing/jettons#accepting-jettons-from-users-through-a-centralized-wallet" colorType={'primary'} sizeType={'sm'}>
````
集中处理
````mdx-code-block 
</Button>
````
````mdx-code-block 
<Button href="/develop/dapps/asset-processing/jettons#accepting-jettons-from-user-deposit-addresses"
        colorType="secondary" sizeType={'sm'}>
````
链上处理
````mdx-code-block 
</Button>
````

<br></br><br></br>


TON 区块链及其底层生态系统将可替代代币（FTs）分类为 jettons。因为 TON 区块链应用了分片，我们对可替代代币的实现在与类似的区块链模型相比时是独特的。

在这项分析中，我们深入探讨了详细规定 jetton [行为](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)和[元数据](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md)的正式标准。
我们还在我们的[分片聚焦的 jetton 架构概述博客文章](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons)中提供了关于 jetton 架构的非正式详情。
我们还讨论了我们的第三方开源 TON 支付处理程序（[bicycle](https://github.com/gobicycle/bicycle)）的特定详情，该处理程序允许用户使用单独的存款地址存取 Toncoin 和 jettons，无需使用文本备注。


## Jetton 架构

TON 上的标准化代币使用一组智能合约来实现，包括：
* [Jetton 主智能合约](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter.fc)
* [Jetton 钱包智能合约](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc)
````mdx-code-block
<p align="center">
  <br />
    <img width="420" src="/img/docs/asset-processing/jetton_contracts.svg" alt="contracts scheme" />
      <br />
</p>
````
## Jetton 主智能合约
Jetton 主智能合约存储了有关 jetton 的常见信息（包括总供应量、元数据链接或元数据本身）。

任何用户都可能创建一个伪造的、与原始 jetton 几乎相同的有价值的 jetton 克隆（使用任意名称、票证、图像等）。幸运的是，伪造的 jettons 可以通过它们的地址轻松识别。

为了消除 TON 用户的欺诈可能性，请查找特定 jetton 类型的原始 jetton 地址（Jetton 主合约），或关注项目的官方社交媒体频道或网站以找到正确信息。检查资产以消除 [Tonkeeper ton-assets list](https://github.com/tonkeeper/ton-assets)的欺诈可能性。

### 检索 Jetton 数据

要检索更具体的 Jetton 数据，使用 `get_jetton_data()` 获取方法。

此方法返回以下数据：

| 名称               | 类型  | 描述 |
|--------------------|-------|-------------------- |
| `total_supply`       | `int`  | 以不可分割的单位衡量的发行的 jettons 总数。 |
| `mintable`          | `int`   | 详情是否可以铸造新的 jettons。此值为 -1（可以铸造）或 0（不能铸造）。 |
| `admin_address`      | `slice` |   |
| `jetton_content`     | `cell` | 根据 [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md) 的数据。 |
| `jetton_wallet_code` | `cell`  |  |



也可以使用 [Toncenter API](https://toncenter.com/api/v3/#/default/get_jetton_masters_api_v3_jetton_masters_get) 中的方法 `/jetton/masters` 来检索已解码的 Jetton 数据和元数据。我们还为 (js) [tonweb](https://github.com/toncenter/tonweb/blob/master/src/contract/token/ft/JettonMinter.js#L85) 和 (js) [ton-core/ton](https://github.com/ton-core/ton/blob/master/src/jetton/JettonMaster.ts#L28)，(go) [tongo](https://github.com/tonkeeper/tongo/blob/master/liteapi/jetton.go#L48) 和 (go) [tonutils-go](https://github.com/xssnick/tonutils-go/blob/33fd62d754d3a01329ed5c904db542ab4a11017b/ton/jetton/jetton.go#L79)，(python) [pytonlib](https://github.com/toncenter/pytonlib/blob/d96276ec8a46546638cb939dea23612876a62881/pytonlib/client.py#L742) 以及许多其他 SDK 开发了方法。

使用 [Tonweb](https://github.com/toncenter/tonweb) 运行 get 方法并获取链下元数据的 url 的示例：

```js
import TonWeb from "tonweb";
const tonweb = new TonWeb();
const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: "<JETTON_MASTER_ADDRESS>"});
const data = await jettonMinter.getJettonData();
console.log('Total supply:', data.totalSupply.toString());
console.log('URI to off-chain metadata:', data.jettonContentUri);
```

#### Jetton 元数据
[这里](/develop/dapps/asset-processing/metadata)提供了有关解析元数据的更多信息。

## Jetton 钱包智能合约
Jetton 钱包合约用于发送、接收和销毁 jettons。每个 _jetton 钱包合约_ 存储特定用户的钱包余额信息。
在特定情况下，jetton 钱包用于每种 jetton 类型的个别 jetton 持有者。

Jetton 钱包不应与仅用于区块链交互和只存储 Toncoin 资产（例如，v3R2 钱包、高负载钱包等）的钱包混淆，它负责支持和管理只有特定 jetton 类型的。

Jetton 钱包使用智能合约，并通过所有者钱包和 jetton 钱包之间的内部消息进行管理。例如，如果 Alice 管理着一个内有 jettons 的钱包，方案如下：Alice 拥有一个专门用于 jetton 使用的钱包（例如钱包版本 v3r2）。当 Alice 启动在她管理的钱包中发送 jettons 时，她向她的钱包发送外部消息，因此，_她的钱包_ 向 _她的 jetton 钱包_ 发送内部消息，然后 jetton 钱包实际执行代币转移。

### 检索给定用户的 Jetton 钱包地址
要使用所有者地址（TON 钱包地址）检索 jetton 钱包地址，
Jetton 主合约提供了 get 方法 `get_wallet_address(slice owner_address)`。

#### 使用 API 检索
应用程序使用 [Toncenter API](https://toncenter.com/api/v3/#/default/run_get_method_api_v3_runGetMethod_post) 的 `/runGetMethod` 方法，通过将所有者的地址序列化到 cell 中。

#### 使用 SDK 检索
也可以通过使用我们各种 SDK 中的现成方法启动此过程，例如，使用 Tonweb SDK，可以通过输入以下字符串启动此过程：

```js
import TonWeb from "tonweb";
const tonweb = new TonWeb();
const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: "<JETTON_MASTER_ADDRESS>"});
const address = await jettonMinter.getJettonWalletAddress(new TonWeb.utils.Address("<OWNER_WALLET_ADDRESS>"));
// 检查钱包是否真的属于所需的 Jetton 主要非常重要：
const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {
  address: jettonWalletAddress
});
const jettonData = await jettonWallet.getData();
if (jettonData.jettonMinterAddress.toString(false) !== new TonWeb.utils.Address(info.address).toString(false)) {
  throw new Error('jetton minter address from jetton wallet doesnt match config');
}

console.log('Jetton 钱包地址:', address.toString(true, true, true));
```
:::tip
要了解更多示例，请阅读 [TON 开发手册](/develop/dapps/cookbook#how-to-calculate-users-jetton-wallet-address)。
:::

### 检索特定 Jetton 钱包的数据

要检索钱包的账户余额、所有者识别信息以及与特定 jetton 钱包合约相关的其他信息，jetton 钱包合约内使用 `get_wallet_data()` get 方法。


此方法返回以下数据：

| 名称               | 类型  |
|--------------------|-------|
| balance            | int   |
| owner              | slice |
| jetton             | slice |
| jetton_wallet_code | cell  |

也可以使用 [Toncenter API](https://toncenter.com/api/v3/#/default/get_jetton_wallets_api_v3_jetton_wallets_get) 的 `/jetton/wallets` get 方法来检索先前解码的 jetton 钱包数据（或 SDK 中的方法）。例如，使用 Tonweb：

```js
import TonWeb from "tonweb";
const tonweb = new TonWeb();
const walletAddress = "EQBYc3DSi36qur7-DLDYd-AmRRb4-zk6VkzX0etv5Pa-Bq4Y";
const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider,{address: walletAddress});
const data = await jettonWallet.getData();
console.log('Jetton 余额:', data.balance.toString());
console.log('Jetton 所有者地址:', data.ownerAddress.toString(true, true, true));
// 检查 Jetton 主是否真的识别钱包非常重要
const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: data.jettonMinterAddress.toString(false)});
const expectedJettonWalletAddress = await jettonMinter.getJettonWalletAddress(data.ownerAddress.toString(false));
if (expectedJettonWalletAddress.toString(false) !== new TonWeb.utils.Address(walletAddress).toString(false)) {
  throw new Error('jetton minter does not recognize the wallet');
}

console.log('Jetton 主地址:', data.jettonMinterAddress.toString(true, true, true));
```

### Jetton 钱包部署
在钱包之间转移 jettons 时，交易（消息）需要一定量的 TON作为网络gas费和根据 Jetton 钱包合约代码执行操作的支付。这意味着接收者在接收 jettons 之前不需要部署 jetton 钱包。只要发送方的钱包中有足够的 TON支付所需的gas费，接收者的 jetton 钱包将自动部署。

## 消息布局

:::tip 消息
阅读更多关于消息的信息[这里](/develop/smart-contracts/guidelines/message-delivery-guarantees)。
:::

Jetton 钱包和 TON 钱包之间的通信是通过以下通信序列进行的：

![](/img/docs/asset-processing/jetton_transfer.svg)


`发件人 -> 发件人' jetton 钱包` 意味着 _转移_ 消息体包含以下数据：


| 名称                 | 类型    |
|----------------------|---------|
| `query_id `            | uint64  |
| `amount  `             | coins   |
| `destination  `        | address |
| `response_destination` | address |
| `custom_payload  `     | cell    |
| `forward_ton_amount`   | coins   |
| `forward_payload`      | cell    |

`收款人' jetton 钱包 -> 收款人`  意味着消息通知体包含以下数据：


| 名称            | 类型    |
|-----------------|---------|
| query_id    `    | uint64  |
| amount   `       | coins   |
| sender  `        | address |
| forward_payload` | cell    |

`收款人' jetton 钱包 -> 发件人` 意味着剩余消息体包含以下数据：


| 名称                 | 类型           |
|----------------------|----------------|
| `query_id`             | uint64         |

有关 jetton 钱包合约字段的详细说明可以在 [TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md) Jetton 标准接口描述中找到。

使用 `Transfer notification` 和 `Excesses` 参数的消息是可选的，取决于附着在 `Transfer` 消息上的 TON 的数量以及 `forward_ton_amount` 字段的值。

`query_id` 标识符允许应用程序将三种消息类型 `Transfer`、 `Transfer notification` 和 `Excesses` 相互关联。为了正确执行此过程，建议始终使用唯一的查询 id。

### 如何发送附带评论和通知的 Jetton 转账

为了进行附带通知的转账（随后在钱包内用于通知目的），必须通过设置非零的 `forward_ton_amount` 值附加足够数量的TON到发送的消息中，并且如有必要，将文本评论附加到 `forward_payload`。文本评论的编码方式与发送Toncoin时的文本评论类似。

[发送Jettons的费用](https://docs.ton.org/develop/smart-contracts/fees#fees-for-sending-jettons)

然而，佣金取决于几个因素，包括Jetton代码详情和为接收者部署新的Jetton钱包的需要。因此，建议附加多一些Toncoin，并且然后将地址设置为 `response_destination` 以检索 `Excesses` 消息。例如，可以在将 `forward_ton_amount` 值设置为0.01 TON的同时，向消息附加0.05 TON（这个TON的数量将被附加到 `Transfer notification` 消息中）。

[使用Tonweb SDK的Jetton带评论转账示例](https://github.com/toncenter/tonweb/blob/b550969d960235314974008d2c04d3d4e5d1f546/src/test-jetton.js#L128):

```js
// 前4个字节是文本评论的标签
const comment = new Uint8Array([... new Uint8Array(4), ... new TextEncoder().encode('text comment')]);

await wallet.methods.transfer({
    secretKey: keyPair.secretKey,
    toAddress: JETTON_WALLET_ADDRESS, // Jetton发送者的Jetton钱包地址
    amount: TonWeb.utils.toNano('0.05'), // 附加到转账消息的TON总量
    seqno: seqno,
    payload: await jettonWallet.createTransferBody({
        jettonAmount: TonWeb.utils.toNano('500'), // Jetton数量（以最基本的不可分割单位计）
        toAddress: new TonWeb.utils.Address(WALLET2_ADDRESS), // 接收用户的钱包地址（非Jetton钱包）
        forwardAmount: TonWeb.utils.toNano('0.01'), // 用于触发Transfer notification消息的一些TONs数量
        forwardPayload: comment, // Transfer notification消息的文本评论
        responseAddress: walletAddress // 扣除手续费后将TON退回给发件人的钱包地址
    }),
    sendMode: 3,
}).send()
```

:::tip
要获得更多示例，请阅读 [TON 开发手册](/develop/dapps/cookbook#how-to-construct-a-message-for-a-jetton-transfer-with-a-comment)。
:::


## Jetton 链下处理

:::info 交易确认
TON交易在仅一次确认后就不可逆转。为了最佳用户体验，建议在TON区块链上的交易一旦完成后，不要等待额外的区块。在 [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3) 中阅读更多信息。
:::

可以有几种允许用户接收Jettons的场景。Jettons可以在一个中心化的热钱包内被接受；同样，它们也可以通过为每个独立用户设置分离地址的钱包来接受。

为了处理Jettons，与处理个体化的TON不同，需要一个热钱包（一个v3R2，高负载钱包）以及一个或多个Jetton钱包。Jetton热钱包的部署在我们的文档[钱包部署](/develop/dapps/asset-processing/#wallet-deployment)中有描述。就是说，不需要根据 [Jetton钱包部署](#jetton-wallet-deployment) 标准部署Jetton钱包。然而，当接收到Jettons时，会自动部署Jetton钱包，这意味着当Jettons被提取时，假定它们已经在用户的资产中。

出于安全原因，最好拥有对不同Jettons持有分开的热钱包（每种资产类型的多个钱包）。

在处理资金时，也建议提供一个冷钱包用于存储不参与自动存款和提款过程的额外资金。

### 添加新的 Jettons 进行资产处理和初步验证

1. 要找到正确的智能合约代币主地址，请参见以下来源：[如何找到正确的Jetton master合约](#jetton-master-smart-contract)
2. 此外，要检索特定Jetton的元数据，请参见以下来源：[如何接收Jetton元数据](#retrieving-jetton-data)。
   为了正确向用户展示新的Jettons，需要正确的 `decimals` 和 `symbol`。
   
为了确保所有用户的安全，至关重要的是避免可能被伪造（假冒）的Jettons。例如，`symbol`==`TON` 的Jettons或那些包含系统通知消息的Jettons，例如：`ERROR`、`SYSTEM` 等。务必确保jettons以这样的方式在你的界面中显示，以便它们不能与TON转账、系统通知等混淆。有时，即使`symbol`、`name`和`image`被设计得几乎与原始的一模一样，也是只是希望误导用户的。

### 在收到转账通知消息时识别未知的 Jetton

1. 如果在你的钱包内收到了关于未知Jetton的转账通知消息，那么你的钱包就被创建为持有特定Jetton的钱包。接下来，进行几个验证过程很重要。
2. 包含 `Transfer notification` 体的内部消息的发送地址是新的Jetton钱包的地址。不要与 `Transfer notification` 体内的 `sender` 字段混淆，Jetton钱包的地址是消息来源的地址。
3. 检索新的Jetton钱包的Jetton master地址：[如何检索Jetton钱包的数据](#retrieving-jetton-data)。
   要执行此过程，需要 `jetton` 参数，即Jetton master合约的地址。
4. 使用Jetton master合约检索你的钱包地址（作为拥有者）的Jetton钱包地址：[如何检索特定用户的Jetton钱包地址](#retrieving-jetton-wallet-addresses-for-a-given-user)
5. 将master合约返回的地址与钱包代币的实际地址进行比较。如果它们匹配，那是理想的。如果不匹配，那么你可能收到了一个假冒的欺诈代币。
6. 检索Jetton元数据：[如何接收Jetton元数据](#retrieving-jetton-data)。 
7. 检查 `symbol` 和 `name` 字段是否为欺诈的迹象。如有必要，警告用户。[为处理和初步检查添加新的Jettons](#adding-new-jettons-for-asset-processing-and-initial-verification)。


### 通过中心化钱包接收用户的 Jettons

在这种情况下，支付服务为每个发送者创建一个唯一的备忘录标识符，公开中心化钱包的地址和发送的金额。发送者将代币发送到指定的中心化地址，并且必须在评论中包含备忘录。

**这种方法的优点：**这种方法非常简单，因为接受代币时没有额外的费用，并且它们直接检索到热钱包中。

**这种方法的缺点：**这种方法要求所有用户在转账时附加评论，这可能导致更多的存款错误（遗忘备忘录、备忘录错误等），意味着更多的支持工作量。

Tonweb示例：

1. [使用评论（备忘录）接受到个人热钱包的Jetton存款](https://github.com/toncenter/examples/blob/main/deposits-jettons-single-wallet.js)
2. [Jettons提款示例](https://github.com/toncenter/examples/blob/main/jettons-withdrawals.js)

#### 准备

1. 准备一个接受的Jettons列表：[添加新的Jettons以进行处理和初步验证](#adding-new-jettons-for-asset-processing-and-initial-verification)。
2. 热钱包部署（如果预期没有Jetton提款，则使用v3R2；如果预期有Jetton提款，则使用高负载v2）[钱包部署](/develop/dapps/asset-processing/#wallet-deployment)。
3. 使用热钱包地址执行测试Jetton转账以初始化钱包。

#### 处理收到的 Jettons
1. 加载接受的Jettons列表
2. 检索你部署的热钱包的Jetton钱包地址：[如何检索特定用户的Jetton钱包地址](#retrieving-jetton-wallet-addresses-for-a-given-user)
3. 为每个Jetton钱包检索Jetton master地址：[如何检索特定Jetton钱包的信息](#retrieving-data-for-a-specific-jetton-wallet)。
   要执行此过程，需要 `jetton` 参数（实际上是Jetton master合约的地址）。
4. 比较步骤1和步骤3（直接上方）中的Jetton master合约地址。如果地址不匹配，则必须报告Jetton地址验证错误。
5. 使用热钱包帐户检索最近未处理的交易列表，并对其进行迭代（逐一排序每个交易）。参见：[检查合约的交易](https://docs.ton.org/develop/dapps/asset-processing/#checking-contracts-transactions)， 
或使用 [Tonweb示例](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-single-wallet.js#L43) 
或使用Toncenter API `/getTransactions` 方法。
6. 检查交易中的输入消息（in_msg）并从输入消息中检索源地址。[Tonweb示例](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L84)
7. 如果源地址与Jetton钱包内的地址匹配，则需要继续处理交易。如果不是，则跳过处理该交易并检查下一个交易。
8. 确保消息体不为空，并且消息的前32位与 `transfer notification` op码 `0x7362d09c` 匹配。[Tonweb示例](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L91)
   如果消息体为空或op码无效 - 跳过交易。
9. 读取消息体的其他数据，包括 `query_id`、`amount`、`sender`、`forward_payload`。[Jetton合约消息布局](#jetton-contract-message-layouts)，[Tonweb示例](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L105)
10. 试图从 `forward_payload` 数据中检索文本评论。前32位必须与文本评论op码 `0x00000000` 匹配，剩余部分 - UTF-8编码文本。[Tonweb示例](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L110)
11. 如果 `forward_payload` 数据为空或op码无效 - 跳过交易。
12. 将接收到的评论与保存的备忘录比较。如果有匹配（始终可以识别用户）- 存入转账。
13. 从步骤5重新开始并重复该过程，直到遍历完所有交易的整个列表。

### 通过用户存款地址接收 Jettons

要从用户存款地址接收Jettons，支付服务需要为发送资金的每位参与者创建其自己的个人地址（存款）。在这种情况下提供的服务涉及执行几个并行过程，包括创建新的存款、扫描区块中的交易、将资金从存款中提到热钱包，等等。

因为一个热钱包可以使用一个Jetton钱包为每种Jetton类型，因此需要为初始化存款创建多个钱包。为了创建大量的钱包，同时用一个种子短语（或私钥）管理它们，创建钱包时需要指定不同的 `subwallet_id`。TON上创建子钱包的功能由v3钱包及更高版本支持。


#### 在 Tonweb 中创建子钱包

```Tonweb
const WalletClass = tonweb.wallet.all['v3R2'];
const wallet = new WalletClass(tonweb.provider, {
    publicKey: keyPair.publicKey,
    wc: 0,
    walletId: <SUBWALLET_ID>,
});
```

#### 准备

1. 准备一个被接受的Jettons列表：[为处理和初步检查添加新的Jettons](#adding-new-jettons-for-asset-processing-and-initial-verification)
2. 热钱包 [钱包部署](/develop/dapps/asset-processing/#wallet-deployment)

#### 创建存款

1. 接受为用户创建新存款的请求。
2. 根据热钱包种子生成一个新的子钱包（v3R2）地址。[在Tonweb中创建子钱包](#creating-a-subwallet-in-tonweb)
3. 接收地址可以给用户当做用于Jetton存款的地址（这是存款Jetton钱包的所有者地址）。钱包初始化不是必需的，这可以在从存款中提取Jettons时完成。
4. 对于此地址，需要通过Jetton master合约计算Jetton钱包的地址。[如何检索特定用户的Jetton钱包地址](#retrieving-jetton-wallet-addresses-for-a-given-user)。 
5. 将Jetton钱包地址添加到交易监控的地址池中，并保存子钱包地址。

#### 处理交易

:::info 交易确认
TON交易在仅一次确认后就不可逆转。为了最佳用户体验，建议在TON区块链上的交易一旦完成后，不要等待额外的区块。在 [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3) 中阅读更多信息。
:::

并不总是能够从消息中确定收到的Jettons的确切数量，因为Jetton钱包可能不会发送 `transfer notification`、`excesses`，而且`internal transfer`消息不是标准化的。这意味着不能保证可以解码 `internal transfer` 消息。

因此，要确定钱包中接收到的金额，需要使用get方法请求余额。在为特定区块链上的账户状态请求余额时，使用区块来检索关键数据。[使用Tonweb准备接收区块](https://github.com/toncenter/tonweb/blob/master/src/test-block-subscribe.js)。

该过程如下进行：

1. 准备接受区块（通过准备系统接受新区块）。
2. 检索新区块并保存前一个区块ID。
3. 从区块中接收交易。
4. 筛选仅使用来自存款Jetton钱包pool地址的交易。
5. 使用`transfer notification`正文解码消息，以接收更多详细数据，包括
   `sender`地址，Jetton `amount` 和评论。 (参见：[处理传入Jettons](#处理传入-jettons))
6. 如果至少有一个交易包含无法解码的外部消息（消息体不包含用于
   `transfer notification`的操作码和用于`excesses`的操作码）或帐户中没有外部消息，则必须使用当前区块的get方法请求Jetton余额，同时使用前一个区块来计算余额差异。现在由于区块内进行的交易，存款总余额变动被揭示出来。
7. 作为未识别Jetton转账的标识符（没有`transfer notification`），如果有这样一个交易或区块数据存在（如果一个区块内有几个存在），则可以使用交易数据。
8. 现在需要检查以确保存款余额是正确的。如果存款余额足够发起热钱包和现有Jetton钱包之间的转账，则需要提取Jettons以确保钱包余额减少。
9. 从第2步重新开始并重复整个过程。

#### 从存款中提款

不应从每次存款充值时都将存款转至热钱包，因为转账操作会收取TON手续费（以网络gas费支付）。
重要的是确定一定数量的Jettons，这些Jettons是必需的，才能使转账变得划算（从而存入）。

默认情况下，Jetton存款钱包的所有者不会初始化。这是因为没有预定的必须支付存储费。在发送带有
`transfer`正文的消息时，可以部署Jetton存款钱包，然后立即销毁它。为此，工程师必须使用发送消息的特殊机制：128 + 32。


1. 检索标记为要提取到热钱包的存款列表
2. 为每个存款检索保存的所有者地址
3. 然后将消息发送到每个所有者地址（通过将几条这样的消息组合成一批），从高负载钱包附加TON Jetton数量。这是通过添加用于v3R2钱包初始化的费用+发送带有`transfer`正文的消息的费用+任意TON数量的`forward_ton_amount`
（如有必要）。附加的TON数量是通过添加用于v3R2钱包初始化的费用（值）+ 发送带有`transfer`正文的消息的费用（值）+ 任意TON数量的
`forward_ton_amount`（值）（如果需要）来确定的。
4. 当地址上的余额变为非零时，帐户状态发生改变。等待几秒钟，然后检查帐户状态，它很快会从`nonexists`状态变为`uninit`。
5. 对于每个所有者地址（处于`uninit`状态），需要发送一条带有v3R2钱包
   init和带有`transfer`消息的正文进行存入Jetton钱包的外部消息= 128 + 32。对于`transfer`，
   用户必须将热钱包地址指定为`destination`和`response destination`。
   可以添加文字评论以简化转账识别。
6. 可以使用存款地址到热钱包地址的Jetton传送进行验证，通过考虑
   [这里找到的处理传入Jettons信息](#处理传入-jettons)。

### Jetton 提款

要提取Jettons，钱包发送带有`transfer`正文的消息到其对应的Jetton钱包。
然后Jetton钱包将Jettons发送给收件人。本着诚信，重要的是要附上一些TON
作为`forward_ton_amount`（并选择性附上评论到`forward_payload`）以触发`transfer notification`。
参见：[Jetton合约消息布局](#jetton-合约消息布局)

#### 准备

1. 准备用于提款的Jettons列表：[为处理和初步验证添加新的Jettons](#为资产处理和初始验证添加新的-jettons)
2. 启动热钱包部署。推荐使用Highload v2。[钱包部署](/develop/dapps/asset-processing/#wallet-deployment)
3. 使用热钱包地址进行Jetton转账，以初始化Jetton钱包并补充其余额。

#### 处理提款

1. 加载已处理的Jettons列表
2. 检索部署的热钱包的Jetton钱包地址：[如何为给定用户检索Jetton钱包地址](#为给定用户检索-jetton-钱包地址)
3. 检索每个Jetton钱包的Jetton主地址：[如何检索Jetton钱包的数据](#检索特定-jetton-钱包的数据)。
   需要`jetton`参数（实际上是Jetton主合约的地址）。
4. 比较第1步和第3步中来自Jetton主合约的地址。如果地址不匹配，则应报告Jetton地址验证错误。
5. 收到提款请求，实际上指明了Jetton的类型，转移的金额，以及收件人钱包地址。
6. 检查Jetton钱包的余额，以确保有足够的资金进行提款。
7. 使用Jetton `transfer`正文生成消息，并填写所需字段，包括：query_id，发出的金额，
   目的地（收件人的非Jetton钱包地址），response_destination（建议指定用户的热钱包），
   forward_ton_amount（建议将其设置为至少0.05 TON以调用`transfer notification`），`forward_payload`
   （可选，如果需要发送评论）。[Jetton合约消息布局](#jetton-合约消息布局)， 
   [Tonweb示例](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/jettons-withdrawals.js#L69)
   为了检查交易的成功验证，每条消息的`query_id`必须分配一个唯一值。
8. 当使用高负载钱包时，建议收集一批消息，并一次性发送一批以优化费用。
9. 保存外部发出消息的过期时间（这是钱包成功
   处理消息的时间，在此之后，钱包将不再接受该消息）
10. 发送单条消息或多条消息（批量消息）。
11. 检索热钱包帐户中最新未处理的交易列表，并迭代它。
    了解更多：[检查合约的交易](/develop/dapps/asset-processing/#checking-contracts-transactions)， 
    [Tonweb示例](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-single-wallet.js#L43) 或
    使用Toncenter API `/getTransactions`方法。
12. 查看帐户中的外部消息。
13. 如果存在带有`transfer`操作码的消息，则应解码以检索`query_id`值。
    检索到的`query_id`需要标记为成功发送。
14. 如果扫描到当前交易的处理时间大于
    过期时间，并且未找到带有给定`query_id`的外部消息，
    则请求应（可选）标记为过期，并且应安全地重新发送。
15. 查找帐户中的传入消息。
16. 如果存在使用`excesses`操作码的消息，应解码该消息并检索`query_id`
    值。找到的`query_id`必须标记为成功传送。
17. 转到第5步。未成功发送的过期请求应重新加入提款列表。

## 在链上处理 Jetton

:::info 交易确认
TON交易在仅一次确认后即不可逆转。为了最佳用户体验，建议一旦交易在TON区块链上最终确定后就不再等待其他区块。在[catchain.pdf](https://docs.ton.org/catchain.pdf#page=3)中阅读更多。
:::

通常，接受和处理jettons时，一个负责内部消息的消息处理程序使用`op=0x7362d09c`操作码。

以下是在进行链上jetton处理时必须考虑的一些建议：

1. 使用它们的钱包类型而不是Jetton主合约来识别传入的jettons。换句话说，您的合约应该与特定的jetton钱包进行交互（与使用特定Jetton主合约的某个未知钱包交互）。
2. 当链接Jetton钱包和Jetton主合约时，检查这种连接是否是双向的，即钱包识别主合约，反之亦然。例如，如果您的合约系统从jetton钱包（将其MySuperJetton视为其主合约）收到通知，其转账信息必须向用户显示，然后显示MySuperJetton合约的`symbol`、`name`和`image`
之前，请检查MySuperJetton钱包是否使用正确的合约系统。反过来，如果您的合约系统由于某种原因需要使用MySuperJetton或MySuperJetton主合约发送jettons，请验证钱包X是否是使用相同合约参数的钱包。
另外，在向X发送`transfer`请求之前，请确保它将MySuperJetton识别为其主合约。
3. 去中心化金融（DeFi）的真正力量基于能够像乐高积木一样将协议叠加在彼此之上的能力。举例来说，假设jetton A被换成jetton B，然后又在借贷协议中用作杠杆（当用户提供流动性时），然后用来购买NFT....以此类推。因此，请考虑合约如何能够服务于非链上用户以及链上实体，方法是通过附加token化的价值到转账通知中，添加可以与转账通知一起发送的自定义有效负载。
4. 请注意，并非所有合约都遵循相同的标准。不幸的是，一些jettons可能是敌对的（使用基于攻击的向量）并且仅为攻击毫无戒心的用户而创建。出于安全考虑，如果协议涉及多个合约，请不要创建大量相同类型的jetton钱包。特别是，不要在协议内部的存款合约、保管库合约或用户帐户合约等之间发送jettons。攻击者可能会通过伪造转账通知、jetton数量或有效负载参数来故意干扰合约逻辑。通过在系统中只使用每个jetton的一个钱包（用于所有存款和提款），来降低潜在的攻击风险。
5. 同样，为了减少地址欺骗的机会（例如，使用为jetton A设计的合约发送给jetton B的转账消息），为每个个别jetton创建子合约通常是个好主意。
6. 强烈建议在合约级别使用不可分割的jetton单位。十进制相关逻辑通常用于增强用户界面（UI）的显示，并与链上数值记录无关。
7. 欲了解更多关于[在FunC中安全智能合约编程 by CertiK](https://blog.ton.org/secure-smart-contract-programming-in-func)，请随时阅读此资源。建议开发者处理所有智能合约异常，以便在应用开发期间永远不会被忽略。

## Jetton 钱包处理
通常，用于链下jetton处理的所有验证程序都适用于钱包。对于Jetton钱包处理，我们最重要的建议如下：

1. 当钱包从未知的jetton钱包收到转账通知时，信任jetton钱包及其主地址至关重要，因为它可能是恶意伪造的。为了保护自己，请检查Jetton主（主合约）使用其提供的地址，以确保您的验证过程将jetton钱包视为合法的。在您信任钱包并验证其为合法后，您可以允许它访问您的帐户余额和其他钱包内数据。如果Jetton主不识别此钱包，建议不启动或公开您的jetton转账，只显示传入的TON转账（即附加到转账通知的Toncoin）。
2. 实际操作中，如果用户想与Jetton而不是jetton钱包互动。换句话说，用户发送wTON/oUSDT/jUSDT, jUSDC, jDAI而不是`EQAjN...`/`EQBLE...`
   等。通常这意味着，当用户启动jetton转账时，钱包会询问相应的jetton主，哪个由用户拥有的jetton钱包应启动转账请求。重要的是永远不要盲目信任来自主合约（主合约）的这些数据。在将转账请求发送至jetton钱包之前，请始终确保jetton钱包确实属于它声称所属的Jetton主。
3. 请注意，敌对的Jetton Masters/jetton钱包可能会随时间更改其钱包/Masters。因此，对与用户进行交互的任何钱包进行尽职调查和验证至关重要，请在每次使用前检查。
4. 始终确保您以不会与TON转账、系统通知等混淆的方式在界面中显示jettons。即使是`symbol`，`name`和`image`
   参数也可以设计用来误导用户，留下受骗的潜在受害者。有几个实例，恶意jettons被用来冒充TON转账、通知错误、奖励收入或资产冻结公告。
5. 始终警惕可能创建假冒jettons的恶意行为者，提供给用户消除主界面中不需要的jettons的功能总是个好主意。


由[kosrk](https://github.com/kosrk)、[krigga](https://github.com/krigga)、[EmelyanenkoK](https://github.com/EmelyanenkoK/) 和 [tolya-yanot](https://github.com/tolya-yanot/)编写。


## 最佳实践
在此我们提供了一些由TON社区成员创建的jetton代码处理的示例：

<Tabs groupId="code-examples">
<TabItem value="tonweb" label="JS (tonweb)">

```js
const transfer = await wallet.methods.transfer({
  secretKey: keyPair.secretKey,
  toAddress: jettonWalletAddress,
  amount: 0,
  seqno: seqno,
  sendMode: 128 + 32, // 模式128用于携带所有剩余余额的消息；模式32表示如果当前账户的结果余额为零，则必须销毁该账户；
  payload: await jettonWallet.createTransferBody({
    queryId: seqno, // 任意数字
    jettonAmount: jettonBalance, // jetton数量（单位）
    toAddress: new TonWeb.utils.Address(MY_HOT_WALLET_ADDRESS),
    responseAddress: new TonWeb.utils.Address(MY_HOT_WALLET_ADDRESS),
  }),
});
await transfer.send();
```

</TabItem>
<TabItem value="tonutils-go" label="Golang">

```go
client := liteclient.NewConnectionPool()

// 连接到测试网lite服务器
err := client.AddConnectionsFromConfigUrl(context.Background(), "https://ton.org/global.config.json")
if err != nil {
   panic(err)
}

ctx := client.StickyContext(context.Background())

// 初始化ton api lite连接包装器
api := ton.NewAPIClient(client)

// 账户的种子词，你可以使用任何钱包或使用wallet.NewSeed()方法生成它们
words := strings.Split("birth pattern then forest walnut then phrase walnut fan pumpkin pattern then cluster blossom verify then forest velvet pond fiction pattern collect then then", " ")

w, err := wallet.FromSeed(api, words, wallet.V3R2)
if err != nil {
   log.Fatalln("FromSeed err:", err.Error())
   return
}

token := jetton.NewJettonMasterClient(api, address.MustParseAddr("EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw"))

// 寻找我们的jetton钱包
tokenWallet, err := token.GetJettonWallet(ctx, w.WalletAddress())
if err != nil {
   log.Fatal(err)
}

amountTokens := tlb.MustFromDecimal("0.1", 9)

comment, err := wallet.CreateCommentCell("Hello from tonutils-go!")
if err != nil {
   log.Fatal(err)
}

// 接收者钱包的地址（非token钱包，只是常规钱包）
to := address.MustParseAddr("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N")
transferPayload, err := tokenWallet.BuildTransferPayload(to, amountTokens, tlb.ZeroCoins, comment)
if err != nil {
   log.Fatal(err)
}

// 你的TON余额必须大于0.05才能发送
msg := wallet.SimpleMessage(tokenWallet.Address(), tlb.MustFromTON("0.05"), transferPayload)

log.Println("发送交易...")
tx, _, err := w.SendWaitTransaction(ctx, msg)
if err != nil {
   panic(err)
}
log.Println("交易确认，哈希：", base64.StdEncoding.EncodeToString(tx.Hash))
```

</TabItem>
<TabItem value="TonTools" label="Python">

```py
my_wallet = Wallet(provider=client, mnemonics=my_wallet_mnemonics, version='v4r2')

# 对于TonCenterClient和LsClient
await my_wallet.transfer_jetton(destination_address='address', jetton_master_address=jetton.address, jettons_amount=1000, fee=0.15) 

# 对于所有客户端
await my_wallet.transfer_jetton_by_jetton_wallet(destination_address='address', jetton_wallet='your jetton wallet address', jettons_amount=1000, fee=0.1)  
```

</TabItem>
</Tabs>



## 参阅

* [支付处理](/develop/dapps/asset-processing/)
* [TON上的NFT处理](/develop/dapps/asset-processing/nfts)
* [TON上的元数据解析](/develop/dapps/asset-processing/metadata)