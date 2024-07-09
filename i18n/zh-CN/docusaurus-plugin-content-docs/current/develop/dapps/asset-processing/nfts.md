# TON NFT 处理

## 概述

在本文档部分中，我们将向读者提供对 NFT 的更深刻理解。这将教导读者如何与 NFT 交互，并如何通过在 TON 区块链上发送的交易接收 NFT。

下面提供的信息假定读者已经深入了解了我们之前的[有关 Toncoin 支付处理的部分](/develop/dapps/asset-processing)，同时也假设他们具备通过编程与钱包智能合约交互的基本知识。

## 理解 NFT 的基础

在 TON 区块链上运行的 NFT 由 [TEP-62](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md) 和 [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md) 标准表示。

Open Network (TON) 区块链设计考虑了高性能，并包括了一个功能，该功能基于 TON 上的合约地址使用自动分片（用于帮助配置特定 NFT 设计）。为了实现最佳性能，单个 NFT 必须使用自己的智能合约。这使得可以创建任意大小（数量大或小）的 NFT 集合，同时也降低了开发成本和性能问题。然而，这种方法也为 NFT 集合的开发引入了新的考虑因素。

因为每个 NFT 都使用自己的智能合约，所以使用单个合约无法获取 NFT 集合中每个个体化 NFT 的信息。为了检索整个集合以及集合中每个 NFT 的信息，需要分别查询集合合约和每个个体 NFT 合约。出于同样的原因，要跟踪 NFT 转移，需要跟踪特定集合中每个个体化 NFT 的所有交易。

### NFT 集合

NFT 集合是一个用于索引和存储 NFT 内容的合约，并应包含以下接口：

#### 获取方法 `get_collection_data`

```
(int next_item_index, cell collection_content, slice owner_address) get_collection_data()
```

获取关于集合的一般信息，表示如下：

1. `next_item_index` - 如果集合是有序的，此分类指示集合中 NFT 的总数，以及用于铸造的下一个索引。对于无序的集合，`next_item_index` 的值是 -1，意味着集合使用独特机制来跟踪 NFT（例如，TON DNS 域的哈希）。
2. `collection_content` - 一个以 TEP-64 兼容格式表示集合内容的 cell。
3. `owner_address` - 包含集合所有者地址的 slice（此值也可以为空）。

#### 获取方法 `get_nft_address_by_index`

```
(slice nft_address) get_nft_address_by_index(int index)
```

此方法可用于验证 NFT 的真实性，并确认它是否确实属于特定集合。它还使用户能够通过提供其在集合中的索引来检索 NFT 地址。该方法应返回包含与提供的索引对应的 NFT 地址的 slice。

#### 获取方法 `get_nft_content`

```
(cell full_content) get_nft_content(int index, cell individual_content)
```

由于集合充当 NFT 的公共数据存储，因此需要此方法来完善 NFT 内容。要使用此方法，首先需要通过调用相应的 `get_nft_data()` 方法获取 NFT 的 `individual_content`。获取 `individual_content` 后，可以使用 NFT 索引和 `individual_content` cell 调用 `get_nft_content()` 方法。该方法应返回一个包含 NFT 全部内容的 TEP-64 cell。

### NFT 项

基本 NFT 应实现：

#### 获取方法 `get_nft_data()`

```
(int init?, int index, slice collection_address, slice owner_address, cell individual_content) get_nft_data()
```

#### 内联消息处理器 `transfer`

```
transfer#5fcc3d14 query_id:uint64 new_owner:MsgAddress response_destination:MsgAddress custom_payload:(Maybe ^Cell) forward_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell) = InternalMsgBody
```

让我们看一下您需要在消息中填充的每个参数：

1. `OP` - `0x5fcc3d14` - 由 TEP-62 标准在转移消息中定义的常量。
2. `queryId` - `uint64` - 用于跟踪消息的 uint64 数字。
3. `newOwnerAddress` - `MsgAddress` - 用于将 NFT 转移至的合约地址。
4. `responseAddress` - `MsgAddress` - 用于转移余额的地址。通常，额外的 TON 数量（例如，1 TON）被发送到 NFT 合约以确保它有足够的资金支付交易费用并创建新的转移（如果需要）。交易中的所有未使用资金都发送到 `responseAddress`。
5. `forwardAmount` - `Coins` - 与转发消息一起使用的 TON 金额（通常设置为 0.01 TON）。由于 TON 使用异步架构，新所有者在成功接收交易后不会立即收到通知。为了通知新所有者，一个内部消息从 NFT 智能合约发送到 `newOwnerAddress`，使用 `forwardAmount` 表示的值。转发消息将以 `ownership_assigned` OP（`0x05138d91`）开始，紧随其后的是之前所有者的地址和 `forwardPayload`（如果存在）。
6. `forwardPayload` - `Slice | Cell` - 作为 `ownership_assigned` 通知消息的一部分发送。

如上所述，这个消息是与 NFT 交互的主要方式，用于在收到上述消息的通知后改变所有权。

例如，这种消息类型通常用于将 NFT Item 智能合约从 Wallet 智能合约发送。当 NFT 智能合约接收到此消息并执行它时，NFT 合约的存储（内部合约数据）将随着所有者 ID 的更新而更新。通过这种方式，NFT Item（合约）正确地更换所有者。此过程详细说明了标准 NFT 转移

在这种情况下，转发金额应设置为适当的值（对于常规钱包为 0.01 TON 或在您希望通过转移 NFT 来执行合约时更多），以确保新所有者接收到关于所有权转移的通知。除了以上述方式通知新所有者，如果不采取这一步骤，新所有者将不会知道他们已收到 NFT。

## 检索 NFT 数据

大多数 SDK 使用现成的处理器来检索 NFT 数据，包括：[tonweb(js)](https://github.com/toncenter/tonweb/blob/b550969d960235314974008d2c04d3d4e5d1f546/src/contract/token/nft/NftItem.js#L38)、[tonutils-go](https://github.com/xssnick/tonutils-go/blob/fb9b3fa7fcd734eee73e1a73ab0b76d2fb69bf04/ton/nft/item.go#L132)、[pytonlib](https://github.com/toncenter/pytonlib/blob/d96276ec8a46546638cb939dea23612876a62881/pytonlib/client.py#L771)等。

要接收 NFT 数据，需要使用 `get_nft_data()` 检索机制。例如，我们必须验证以下 NFT 项地址 `EQB43-VCmf17O7YMd51fAvOjcMkCw46N_3JMCoegH_ZDo40e`(也称为 [foundation.ton](https://tonscan.org/address/EQB43-VCmf17O7YMd51fAvOjcMkCw46N_3JMCoegH_ZDo40e) 域)。

首先需要按照如下方式使用 toncenter.com API 执行 get 方法。:

```
curl -X 'POST' \
  'https://toncenter.com/api/v2/runGetMethod' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "address": "EQB43-VCmf17O7YMd51fAvOjcMkCw46N_3JMCoegH_ZDo40e",
  "method": "get_nft_data",
  "stack": []
}'
```

响应通常类似于如下内容：

```json
{
  "ok": true,
  "result": {
    "@type": "smc.runResult",
    "gas_used": 1581,
    "stack": [
      // init
      [ "num", "-0x1" ],
      // index
      [ "num", "0x9c7d56cc115e7cf6c25e126bea77cbc3cb15d55106f2e397562591059963faa3" ],
      // collection_address
      [ "cell", { "bytes": "te6cckEBAQEAJAAAQ4AW7psr1kCofjDYDWbjVxFa4J78SsJhlfLDEm0U+hltmfDtDcL7" } ],
      // owner_address
      [ "cell", { "bytes": "te6cckEBAQEAJAAAQ4ATtS415xpeB1e+YRq/IsbVL8tFYPTNhzrjr5dcdgZdu5BlgvLe" } ],
      // content
      [ "cell", { "bytes": "te6cckEBCQEA7AABAwDAAQIBIAIDAUO/5NEvz/d9f/ZWh+aYYobkmY5/xar2cp73sULgTwvzeuvABAIBbgUGAER0c3/qevIyXwpbaQiTnJ1y+S20wMpSzKjOLEi7Jwi/GIVBAUG/I1EBQhz26hlqnwXCrTM5k2Qg5o03P1s9x0U4CBUQ7G4HAUG/LrgQbAsQe0P2KTvsDm8eA3Wr0ofDEIPQlYa5wXdpD/oIAEmf04AQe/qqXMblNo5fl5kYi9eYzSLgSrFtHY6k/DdIB0HmNQAQAEatAVFmGM9svpAE9og+dCyaLjylPtAuPjb0zvYqmO4eRJF0AIDBvlU=" } ]
    ],
    "exit_code": 0,
    "@extra": "1679535187.3836682:8:0.06118075068995321"
  }
}
```

返回参数：

- `init` - `boolean` - -1 表示 NFT 已初始化并可使用
- `index` - `uint256` - 集合中 NFT 的索引。可以是顺序的或以其他方式派生。例如，这可以表示使用 TON DNS 合约的 NFT 域哈希，而集合应该只在给定索引内拥有唯一的 NFT。
- `collection_address` - `Cell` - 包含 NFT 集合地址的 cell（可以为空）。
- `owner_address` - `Cell` - 包含当前所有者 NFT 地址的 cell（可以为空）。
- `content` - `Cell` - 包含 NFT 项内容的 cell（如果需要解析，需要参考 TEP-64 标准）。

## 检索集合内的所有 NFT

检索集合内所有 NFT 的过程取决于集合是否有序。我们在下面概述了两种过程。

### 有序集合

检索有序集合中的所有 NFT 相对简单，因为已经知道了检索所需的 NFT 数量，且可以轻松获取它们的地址。为了完成这一过程，应按顺序执行以下步骤：

1. 使用 TonCenter API 调用集合合约中的 `get_collection_data` 方法，并从响应中检索 `next_item_index` 值。
2. 使用 `get_nft_address_by_index` 方法，传入索引值 `i`（最初设置为 0），以检索集合中第一个 NFT 的地址。
3. 使用上一步获得的地址检索 NFT 项数据。接下来，验证初始 NFT Collection 智能合约是否与 NFT 项本身报告的 NFT Collection 智能合约一致（以确保集合没有挪用其他用户的 NFT 智能合约）。
4. 使用来自上一步的 `i` 和 `individual_content` 调用 `get_nft_content` 方法。
5. `i` 增加 1 并重复步骤 2-5，直到 `i` 等于 `next_item_index`。
6. 此时，您将拥有来自集合及其各个项目所需的信息。

### 无序集合

检索无序集合中的 NFT 列表更为困难，因为没有固有的方式来获取属于集合的 NFT 的地址。因此，需要解析集合合约中的所有交易并检查所有发出的消息以识别属于集合的 NFT 对应的消息。

为此，必须检索 NFT 数据，并在集合中使用 NFT 返回的 ID 调用 `get_nft_address_by_index` 方法。如果 NFT 合约地址与 `get_nft_address_by_index` 方法返回的地址匹配，这表明该 NFT 属于当前集合。但是，解析集合到所有消息可能是一个漫长的过程，并且可能需要归档节点。

## 在 TON 之外的 NFT 处理

### 发送 NFT

要转移 NFT 所有权，需要从 NFT 所有者的钱包向 NFT 合约发送一条包含转移消息的 cell。这可以通过使用特定语言的库（例如 [tonweb(js)](https://github.com/toncenter/tonweb/blob/b550969d960235314974008d2c04d3d4e5d1f546/src/contract/token/nft/NftItem.js#L65)、[ton(js)](https://github.com/getgems-io/nft-contracts/blob/debcd8516b91320fa9b23bff6636002d639e3f26/packages/contracts/nft-item/NftItem.data.ts#L102)、[tonutils-go(go)](https://github.com/xssnick/tonutils-go/blob/fb9b3fa7fcd734eee73e1a73ab0b76d2fb69bf04/ton/nft/item.go#L132)）来完成。

一旦创建了转移消息，就必须从所有者的钱包合约地址发送到 NFT 项合约地址，并附带足够的 TON 以支付关联的交易费用。

要将 NFT 从另一个用户转移到您自己，需要使用 TON Connect 2.0 或包含 ton:// 链接的简单二维码。例如：
`ton://transfer/{nft_address}?amount={message_value}&bin={base_64_url(transfer_message)}`

### 接收 NFTs

跟踪发送到某个智能合约地址（即用户的钱包）的 NFT 的过程类似于跟踪支付的机制。这是通过监听钱包中的所有新交易并解析它们来完成的。

下一步可能会根据具体情况而有所不同。让我们下面看几个不同的场景。

#### 等待已知 NFT 地址转移的服务:

- 验证从 NFT 项目智能合约地址发送的新交易。
- 读取消息体的前 32 位作为使用 `uint` 类型，并验证它是否等于 `op::ownership_assigned()`(`0x05138d91`)
- 从消息体中读取接下来的 64 位作为 `query_id`。
- 将消息体中的地址读作 `prev_owner_address`。
- 现在可以管理您的新 NFT 了。

#### 监听所有类型的 NFT 转移的服务:

- 检查所有新交易，忽略那些消息体长度小于 363 位（OP - 32，QueryID - 64，地址 - 267）的交易。
- 重复上面列表中详细介绍的步骤。
- 如果流程工作正常，则需要通过解析 NFT 及其所属的集合来验证 NFT 的真实性。接下来，需要确保 NFT 属于指定的集合。有关此过程的更多信息可以在 `获取所有集合 NFTs` 部分找到。可以通过使用 NFT 或集合的白名单来简化此过程。
- 现在可以管理您的新 NFT 了。

#### 将 NFT 转移绑定到内部交易:

当接收到这种类型的交易时，需要重复前面列表中的步骤。完成此过程后，可以通过在读取 `prev_owner_address` 值之后从消息体中读取一个 uint32 来检索 `RANDOM_ID` 参数。

#### 未发送通知信息的 NFT 发送:

以上概述的所有策略都依赖于服务在 NFT 转移时正确创建转发消息。如果他们不这样做，我们不会知道他们是否已经将 NFT 转移到我们这边。但是，有一些可能的解决方法：

以上概述的所有策略都依赖于服务正确在 NFT 转移中创建转发消息。如果不执行此过程，就无法清楚 NFT 是否已转移到正确的一方。但是，在这种情况下有几种可能的解决方案：

- 如果预计 NFT 数量较少，可以定期解析它们并验证所有者是否已更改为相应的合约类型。
- 如果预计 NFT 数量较多，可以解析所有新块并验证是否有任何调用发送到使用 `op::transfer` 方法的 NFT 目的地。如果启动了这样的交易，可以验证 NFT 的所有者并接收转移。
- 如果在转移过程中无法解析新块，用户可以自行触发 NFT 所有权验证过程。这样，在转移没有通知的 NFT 之后，就可以触发 NFT 所有权验证过程。

## 从智能合约与 NFTs 交互

既然我们已经涵盖了发送和接收 NFTs 的基础，现在让我们探讨如何使用 [NFT Sale](https://github.com/ton-blockchain/token-contract/blob/1ad314a98d20b41241d5329e1786fc894ad811de/nft/nft-sale.fc) 合约示例从智能合约接收和转移 NFTs。

### 发送 NFTs

在这个例子中，NFT 转移信息位于 [第 67 行](https://www.google.com/url?q=https://github.com/ton-blockchain/token-contract/blob/1ad314a98d20b41241d5329e1786fc894ad811de/nft/nft-sale.fc%23L67\&sa=D\&source=docs\&ust=1685436161341866\&usg=AOvVaw1yuoIzcbEuvqMS4xQMqfXE):

```
var nft_msg = begin_cell()
  .store_uint(0x18, 6)
  .store_slice(nft_address)
  .store_coins(0)
  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
  .store_uint(op::transfer(), 32)
  .store_uint(query_id, 64)
  .store_slice(sender_address) ;; new_owner_address
  .store_slice(sender_address) ;; response_address
  .store_int(0, 1) ;; empty custom_payload
  .store_coins(0) ;; forward amount to new_owner_address
  .store_int(0, 1); ;; empty forward_payload


send_raw_message(nft_msg.end_cell(), 128 + 32);
```

让我们仔细检查每行代码：

- `store_uint(0x18, 6)` - 存储消息标志。
- `store_slice(nft_address)` - 存储消息目标（NFT 地址）。
- `store_coins(0)` - 发送随消息发送的 TON 数量设置为 0，因为使用 `128` [消息模式](/develop/smart-contracts/messages#message-modes) 以其余余额发送消息。要发送非用户全部余额的金额，必须更改此数字。请注意，它应足够大以支付gas费以及任何转发金额。
- `store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)` - 剩余构成消息头的部分被留空。
- `store_uint(op::transfer(), 32)` - 这是 msg_body 的开始。在这里，我们首先使用 transfer OP 代码，以便接收者理解其转移所有权消息。
- `store_uint(query_id, 64)` - 存储查询 ID。
- `store_slice(sender_address) ;; new_owner_address` - 第一个存储的地址是用于转移 NFTs 和发送通知的地址。
- `store_slice(sender_address) ;; response_address` - 第二个存储的地址是响应地址。
- `store_int(0, 1)` - 自定义有效载荷标志设置为 0，表示不需要自定义有效载荷。
- `store_coins(0)` - 随消息转发的 TON 数量。在这个例子中设置为 0，但是，建议将此值设置为更高的金额（如至少 0.01 TON），以便创建转发消息并通知新所有者他们已经收到了 NFT。金额应足以覆盖任何相关费用和成本。
- `.store_int(0, 1)` - 自定义有效载荷标志。如果您的服务应该作为 ref 传递有效载荷，则必须将其设置为 `1`。

### 接收 NFTs

一旦我们发送了 NFT，就至关重要的是确定新所有者何时收到了它。一个好的例子可以在同一个 NFT 销售智能合约中找到：

```
slice cs = in_msg_full.begin_parse();
int flags = cs~load_uint(4);

if (flags & 1) {  ;; ignore all bounced messages
    return ();
}
slice sender_address = cs~load_msg_addr();
throw_unless(500, equal_slices(sender_address, nft_address));
int op = in_msg_body~load_uint(32);
throw_unless(501, op == op::ownership_assigned());
int query_id = in_msg_body~load_uint(64);
slice prev_owner_address = in_msg_body~load_msg_addr();
```

让我们再次检查每行代码：

- `slice cs = in_msg_full.begin_parse();` - 用于解析传入消息。
- `int flags = cs~load_uint(4);` - 用于从消息的前 4 位加载标志。
- `if (flags & 1) { return (); } ;; 忽略所有弹回消息` - 用于验证消息是否没有被弹回。对于所有您的传入消息，如果没有理由反之，就很重要进行此过程。弹回的消息是那些在尝试接收交易时遇到错误并被退回给发件人的消息。
- `slice sender_address = cs~load_msg_addr();` - 接下来加载消息发送者。在这种特殊情况下，通过使用 NFT 地址完成。
- `throw_unless(500, equal_slices(sender_address, nft_address));` - 用于验证发送者确实是应该通过合约转移的 NFT。从智能合约解析 NFT 数据相当困难，因此在大多数情况下，NFT 地址在合约创建时预定义。
- `int op = in_msg_body~load_uint(32);` - 加载消息 OP 代码。
- `throw_unless(501, op == op::ownership_assigned());` - 确保接收的 OP 代码与所有权分配的常量值匹配。
- `slice prev_owner_address = in_msg_body~load_msg_addr();` - 从传入消息体中提取的前所有者地址，并加载到 `prev_owner_address` 切片变量中。如果前所有者选择取消合约并将 NFT 归还给他们，这一点可能很有用。

现在我们已经成功地解析并验证了通知消息，我们可以继续我们的业务逻辑，这用于启动销售智能合约（它旨在处理 NFT 物品业务销售过程，例如 NFT 拍卖，如 getgems.io）
