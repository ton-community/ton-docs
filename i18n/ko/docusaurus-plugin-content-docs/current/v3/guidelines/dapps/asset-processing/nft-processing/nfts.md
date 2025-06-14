import Feedback from '@site/src/components/Feedback';

# NFT processing

## 개요

This section provides a comprehensive understanding of NFTs on TON Blockchain. Readers will learn how to interact with NFTs and accept them through transactions.
The following information assumes familiarity with our previous [section on Toncoin payment processing](/v3/guidelines/dapps/asset-processing/payments-processing) and a basic understanding of programmatic interactions with wallet smart contracts.

## Understanding the basics of NFTs

TON 블록체인에서 운영되는 NFT는 [TEP-62](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md) 및 [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md) 표준으로 표현됩니다.

TON is designed for high performance, incorporating automatic sharding based on contract addresses to optimize NFT provisioning. To maintain efficiency, each NFT operates under its own smart contract. This enables collections of any size while minimizing development costs and performance bottlenecks. However, this structure introduces new considerations for NFT collection development.

Since each NFT has its own smart contract, it is not possible to retrieve details of all NFTs in a collection through a single contract. Instead, querying both the collection contract and each individual NFT contract is required to gather complete collection data. Similarly, tracking NFT transfers necessitates monitoring all transactions related to each NFT within a collection.

### NFT collections

An NFT Collection contract serves as an index and storage for NFT content. It should implement the following interfaces:

#### Get 메서드 `get_collection_data`

```
(int next_item_index, cell collection_content, slice owner_address) get_collection_data()
```

General collection information retrieval, including:

1. `next_item_index` – Indicates the total number of NFTs in an ordered collection and the next available index for minting. For unordered collections, this value is -1, meaning a unique tracking mechanism (e.g., a TON DNS domain hash) is used.
2. `collection_content` – A cell storing collection content in a TEP-64-compatible format.
3. `owner_address` - A slice containing the collection owner’s address (can be empty).

#### Get 메서드 `get_nft_address_by_index`

```
(slice nft_address) get_nft_address_by_index(int index)
```

This method can be used to verify an NFT’s authenticity and confirm its membership in a specific collection. Additionally, it allows users to retrieve an NFT’s address by providing its collection index.

#### Get 메서드 `get_nft_content`

```
(cell full_content) get_nft_content(int index, cell individual_content)
```

Retrieving full NFT content

1. First, obtain the individual_content using the `get_nft_data()` method.
2. Then, call `get_nft_content()` with the NFT index and `individual_content`.
3. The method returns a TEP-64 cell containing the NFT’s full content.

### NFT 아이템

기본 NFT는 다음을 구현해야 합니다:

#### Get 메서드 `get_nft_data()`

```
(int init?, int index, slice collection_address, slice owner_address, cell individual_content) get_nft_data()
```

#### `transfer`를 위한 인라인 메시지 핸들러

```
transfer#5fcc3d14 query_id:uint64 new_owner:MsgAddress response_destination:MsgAddress custom_payload:(Maybe ^Cell) forward_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell) = InternalMsgBody
```

To facilitate an NFT transfer, a transfer message containing specific parameters is required:

1. `OP` - `0x5fcc3d14` - A constant defined in the TEP-62 standard.
2. `queryId` - `uint64` - A unique identifier to track the message.
3. `newOwnerAddress` - `MsgAddress` - The recipient’s smart contract address.
4. `responseAddress` - `MsgAddress` - Address for returning unused funds (e.g., when sending extra TON to cover fees).
5. `forwardAmount` - `Coins` - The amount of TON forwarded with the message (typically 0.01 TON). This funds an internal notification message to the `newOwnerAddress` upon successful receipt of the NFT.
6. `forwardPayload` - `Slice | Cell` - Optional data included in the ownership_assigned notification message.

This message (as explained above) is the primary way to interact with an NFT that changes ownership after receiving a notification as a result of the above message.

For example, this type of message above is often used to send an NFT Item smart contract from a wallet smart contract. When the NFT smart contract receives this message and executes it, the NFT contract storage (internal contract data) is updated along with the owner ID. In this way, the NFT item (contract) changes owners correctly. This process details a standard NFT transfer.

In this case, the transfer amount should be set to an appropriate value (0.01 TON for a regular wallet, or more if you want to execute the contract by transferring the NFT) to ensure that the new owner receives a notice of the ownership transfer. This is important because the new owner will not be notified that they have received the NFT without this notice.

## Retrieving NFT data

Most SDKs provide built-in methods to retrieve NFT data, including: [tonweb(js)](https://github.com/toncenter/tonweb/blob/b550969d960235314974008d2c04d3d4e5d1f546/src/contract/token/nft/NftItem.js#L38), [tonutils-go](https://github.com/xssnick/tonutils-go/blob/fb9b3fa7fcd734eee73e1a73ab0b76d2fb69bf04/ton/nft/item.go#L132), [pytonlib](https://github.com/toncenter/pytonlib/blob/d96276ec8a46546638cb939dea23612876a62881/pytonlib/client.py#L771), and more.

To fetch NFT details, the `get_nft_data()` method is used. For example, to verify the NFT at `EQB43-VCmf17O7YMd51fAvOjcMkCw46N_3JMCoegH_ZDo40e`(also known as [foundation.ton](https://tonscan.org/address/EQB43-VCmf17O7YMd51fAvOjcMkCw46N_3JMCoegH_ZDo40e) domain).

First, it is necessary to execute the get method by using the toncenter.com API:

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

응답은 일반적으로 다음과 유사합니다:

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

반환 매개변수:

- `init` - `boolean` - -1 if the NFT is initialized.
- `index` - `uint256` - NFT’s position in the collection.
- `collection_address` - `Cell` - Address of the collection contract.
- `owner_address` - `Cell` - Current NFT owner’s address.
- `content` - `Cell` - NFT content (parsed according to TEP-64).

## 컬렉션 내의 모든 NFT 조회

The process varies based on whether the collection is ordered or unordered.

### 정렬된 컬렉션

Retrieving all NFTs in an ordered collection is relatively simple, since the number of NFTs to retrieve is already known and their addresses are easy to obtain. To complete this process, you need to perform the following steps in this order:

1. Call the `get_collection_data` method using the Ton Center API on the collection contract and retrieve the `next_item_index` value from the response.
2. Use the `get_nft_address_by_index` method, passing in the `i` index value (initially set to 0) to retrieve the address of the first NFT in the collection.
3. Retrieve the NFT item data using the address obtained in the previous step. Then check that the initial NFT collection smart contract matches the NFT collection smart contract reported by the NFT item itself (to ensure that the collection has not appropriated another user's NFT smart contract).
4. `get_nft_content` 메서드를 `i`와 이전 단계에서 얻은 `individual_content`와 함께 호출합니다.
5. Increment `i` by 1 and repeat steps 2-5 until `i` equals `next_item_index`.
6. At this point, you will have the information you need from the collection and its individual items.

### 비정렬된 컬렉션

Retrieving a list of NFTs in an unordered collection is more difficult because there is no built-in way to retrieve the addresses of NFTs that belong to the collection. Therefore, it is necessary to parse all the transactions in the collection contract and inspect all the outgoing messages to determine which ones correspond to NFTs that belong to the collection.

To do this, it is necessary to extract the NFT data and call the `get_nft_address_by_index` method on the collection with the ID returned by the NFT. If the NFT contract address and the address returned by the `get_nft_address_by_index` method match, it means that the NFT belongs to the current collection. However, parsing all the messages in the collection can be a lengthy process and may require archive nodes.

## TON 외부에서 NFT 작업

### NFT 전송

To transfer an NFT ownership, it is necessary to send an internal message from the NFT owner’s wallet to the NFT contract by creating a cell that contains a transfer message. This can be accomplished using libraries (such as [tonweb(js)](https://github.com/toncenter/tonweb/blob/b550969d960235314974008d2c04d3d4e5d1f546/src/contract/token/nft/NftItem.js#L65), [ton(js)](https://github.com/getgems-io/nft-contracts/blob/debcd8516b91320fa9b23bff6636002d639e3f26/packages/contracts/nft-item/NftItem.data.ts#L102), [tonutils-go(go)](https://github.com/xssnick/tonutils-go/blob/fb9b3fa7fcd734eee73e1a73ab0b76d2fb69bf04/ton/nft/item.go#L132)) for the specific language.

Once a transfer message has been created, it must be sent to the NFT item's contract address from the owner's wallet contract, specifying a sufficient amount of TON to cover the corresponding transaction fee.

다른 사용자로부터 NFT를 자신에게 전송하려면 TON Connect 2.0이나 단순한 QR 코드를 사용하여 ton:// 링크를 포함해야 합니다. 예를 들어:
`ton://transfer/{nft_address}?amount={message_value}&bin={base_64_url(transfer_message)}`

### NFT 수신

특정 스마트 컨트랙트 주소(즉, 사용자의 지갑)에 전송된 NFT를 추적하는 과정은 결제를 추적하는 메커니즘과 유사합니다. 이는 지갑의 모든 새로운 트랜잭션을 감시하고 이를 파싱하는 방식으로 이루어집니다.

다음 단계는 특정 사용 사례에 따라 다를 수 있습니다. 몇 가지 다른 시나리오를 살펴보겠습니다.

#### 알려진 NFT 주소 전송을 기다리는 서비스:

- Check for new transactions sent from the NFT item's smart contract address.
- Read the first 32 bits of the message body using the `uint` type and check that it is equal to `op::ownership_assigned()`(`0x05138d91`)
- Read the next 64 bits from the message body as `query_id`.
- Read the address from the message body as `prev_owner_address`.
- Now you can manage your new NFT.

#### 모든 유형의 NFT 전송을 감시하는 서비스:

- Verify all new transactions and ignore those with a body length less than 363 bits (OP - 32, QueryID - 64, Address - 267).
- 위 목록에 상세히 설명된 단계를 반복합니다.
- If the process works correctly, you need to verify the authenticity of the NFT by analyzing it and the collection it belongs to. Next, you need to verify that the NFT belongs to the specified collection. More information on this process can be found in the section "Getting All NFTs of a Collection". This process can be simplified by using a whitelist of NFTs or collections.
- Now you can manage your new NFT.

#### NFT 전송을 내부 트랜잭션과 연결하기:

When receiving a transaction of this type, you must repeat the steps in the previous list. Once this process is complete, you can extract the `RANDOM_ID` parameter by reading the uint32 from the message body after reading the `prev_owner_address` value.

#### 알림 메시지 없이 전송된 NFT:

위의 모든 전략은 서비스가 올바르게 NFT 전송 내에서 전달 메시지를 생성하는지에 의존합니다. 이 작업이 수행되지 않으면 우리가 NFT를 수신했는지 알 수 없습니다. 그러나 다음과 같은 몇 가지 해결 방법이 있습니다:

위에서 설명한 모든 전략은 서비스가 NFT 전송 내에서 전달 메시지를 올바르게 생성하는 것을 전제로 합니다. 이 프로세스가 수행되지 않으면 NFT가 올바른 당사자에게 전송되었는지 여부가 명확하지 않습니다. 하지만 이 시나리오에서 가능한 몇 가지 해결 방법이 있습니다:

- 적은 수의 NFT가 예상되는 경우, 이를 주기적으로 파싱하여 소유자가 해당 계약 유형으로 변경되었는지 확인할 수 있습니다.
- 많은 수의 NFT가 예상되는 경우, 모든 새로운 블록을 파싱하여 `op::transfer` 메서드를 사용하여 NFT 목적지로 보낸 호출이 있었는지 확인할 수 있습니다. 이와 같은 트랜잭션이 시작되면 NFT 소유자를 확인하고 전송을 받을 수 있습니다.
- 전송 내에서 새로운 블록을 파싱할 수 없는 경우, 사용자가 스스로 NFT 소유권 확인 프로세스를 트리거할 수 있습니다. 이렇게 하면 알림 메시지 없이 NFT를 전송한 후에도 NFT 소유권 확인 프로세스를 트리거할 수 있습니다.

## 스마트 컨트랙트에서 NFT와 상호작용

이제 NFT를 보내고 받는 기본 사항을 다뤘으므로, [NFT Sale](https://github.com/ton-blockchain/token-contract/blob/1ad314a98d20b41241d5329e1786fc894ad811de/nft/nft-sale.fc) 컨트랙트 예제를 사용하여 스마트 컨트랙트에서 NFT를 받고 전송하는 방법을 살펴보겠습니다.

### NFT 전송

이 예제에서 NFT 전송 메시지는 67번째 줄에 있습니다:

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

각 코드 줄을 살펴 보겠습니다:

- `store_uint(0x18, 6)` - Stores message flags.
- `store_slice(nft_address)` - Stores the message destinations (NFT addresses).
- `store_coins(0)` -  Sets the amount of TON to send with the message to 0. The 128 [message mode](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes) is used to send the message with its remaining balance. To send a specific amount instead of the user’s entire balance, this value must be adjusted. It should be large enough to cover gas fees and any forwarding amounts.
- `store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)`  -  Leaves the remaining components of the message header empty..
- `store_uint(op::transfer(), 32)` - Marks the start of the msg_body. The transfer OP code is used to signal to the receiver that this is a transfer ownership message.
- `store_uint(query_id, 64)` - Stores query_id
- `store_slice(sender_address) ;; new_owner_address` - The first stored address is used for transferring NFTs and sending notifications.
- `store_slice(sender_address) ;; response_address` - The second stored address serves as the response address.
- `store_int(0, 1)` - Sets the custom payload flag to 0, indicating that no custom payload is required.
- `store_coins(0)` - Specifies the amount of TON to be forwarded with the message. While it is set to 0 in this example, it is recommended to set it to a higher amount (at least 0.01 TON) to create a forward message and notify the new owner that they have received the NFT. The amount should be sufficient to cover any associated fees and costs.
- `.store_int(0, 1)` - Custom payload flag. This should be set to 1 if your service needs to pass the payload as a reference.

### NFT 수신

NFT를 보낸 후에는 새로운 소유자가 NFT를 수신했는지 확인하는 것이 중요합니다. 이에 대한 좋은 예는 동일한 NFT 판매 스마트 컨트랙트에서 찾을 수 있습니다:

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

다시 각 코드 줄을 살펴보겠습니다:

- `slice cs = in_msg_full.begin_parse();` - Parses the incoming message.
- `int flags = cs~load_uint(4);` - Loads flags from the first 4 bits of the message.
- `if (flags & 1) { return (); } ;; ignore all bounced messages` - Ignores all bounced messages. This step ensures that messages encountering errors during transaction receipt and being returned to the sender are disregarded. It’s essential to apply this check to all incoming messages unless there's a specific reason not to.
- `slice sender_address = cs~load_msg_addr();` - Loads the sender's address from the message. In this case, it is an NFT address.
- `throw_unless(500, equal_slices(sender_address, nft_address));` - Verifies that the sender is indeed the expected NFT that should have been transferred via the contract. Parsing NFT data from smart contracts can be challenging, so in most cases, the NFT address is predefined at contract creation.
- `int op = in_msg_body~load_uint(32);` - Loads the message OP code.
- `throw_unless(501, op == op::ownership_assigned());` - Ensures that the received OP code matches the ownership assigned constant value.
- `slice prev_owner_address = in_msg_body~load_msg_addr();` - Extracts the previous owner’s address from the incoming message body and loads it into the `prev_owner_address` variable. This can be useful if the previous owner decides to cancel the contract and have the NFT returned to them.

Now that we have successfully parsed and validated the notification message, we can proceed with the business logic that initiates a sale smart contract. This contract manages NFT item sales, including auctions on platforms such as getgems.io.

<Feedback />

