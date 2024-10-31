# NFT Processing

## Overview

In this section of our documentation we’ll provide readers with a better understanding of NFTs. This will teach the reader how to interact with NFTs, and how to accept NFTs via transactions sent on TON Blockchain. 

The information provided below assumes the reader has already taken a deep dive into our previous
[section detailing Toncoin payment processing](/v3/guidelines/dapps/asset-processing/payments-processing), while also assuming that they possess a basic understanding of how to interact with wallet smart contracts programmatically.


## Understanding the Basics of NFTs

NFTs operating on TON Blockchain are represented by the  [TEP-62](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md) and [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md) standards.

The Open Network (TON) Blockchain is designed with high performance in mind and includes a feature that makes use of automatic sharding based on contract addresses on TON (which are used to help provision specific NFT designs). In order to achieve optimal performance, individual NFTs must make use of their own smart contract. This enables the creation of NFT collections of any size (whether large or small in number), while also reducing development costs and performance issues. However, this approach also introduces new considerations for the development of NFT collections.

Because each NFT makes use of its own smart contract, it is not possible to obtain information about each individualized NFT within an NFT collection using a single contract. To retrieve information on an entire collection as a whole, as well as each individual NFT within a collection, it is necessary to query both the collection contract and each individual NFT contract individually. For the same reason, to track NFT transfers, it is necessary to track all transactions for each individualized NFT within a specific collection.

### NFT Collections
NFT Collection is a contract that serves to index and store NFT content and should contain the following interfaces:
#### Get method `get_collection_data`
```
(int next_item_index, cell collection_content, slice owner_address) get_collection_data()
```
Retrieves general information about collection, which represented with the following:
  1. `next_item_index` - if the collection is ordered, this classification indicates the total number of NFTs in the collection, as well as the next index used for minting. For unordered collections, the `next_item_index` value is -1, meaning the collection uses unique mechanisms to keep track of NFTs (e.g., the hash of TON DNS domains).
  2. `collection_content` - a cell that represents the collection content in TEP-64 compatible format.
  3. `owner_address` - a slice that contains the collection owner's address (this value can also be empty).

#### Get method `get_nft_address_by_index`
```
(slice nft_address) get_nft_address_by_index(int index)
```
This method can be used to verify the authenticity of an NFT and confirm whether it truly belongs to a specific collection. It also enables users to retrieve the address of an NFT by providing its index in the collection. The method should return a slice containing the address of the NFT that corresponds to the provided index.

#### Get method `get_nft_content`
```
(cell full_content) get_nft_content(int index, cell individual_content)
```
Since the collection serves as a common data storage for NFTs, this method is necessary to complete the NFT content. To use this method, first, it’s necessary to obtain the NFT’s `individual_content` by calling the corresponding `get_nft_data()` method. After obtaining the `individual_content`, it’s possible to call the `get_nft_content()` method with the NFT index and the `individual_content` cell. The method should return a TEP-64 cell containing the full content of the NFT.

### NFT Items
Basic NFTs should implement:

#### Get method `get_nft_data()`
```
(int init?, int index, slice collection_address, slice owner_address, cell individual_content) get_nft_data()
```

#### Inline message handler for `transfer`
```
transfer#5fcc3d14 query_id:uint64 new_owner:MsgAddress response_destination:MsgAddress custom_payload:(Maybe ^Cell) forward_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell) = InternalMsgBody
```
Let's look at each parameter you need to fill in your message:
1. `OP` - `0x5fcc3d14` - a constant defined by the TEP-62 standard within the transfer message.
2. `queryId` - `uint64` - a uint64 number used to track the message.
3. `newOwnerAddress` - `MsgAddress` - the address of the contract used to transfer the NFT to.
4. `responseAddress` - `MsgAddress` - the address used to transfer excess funds to. Typically, an extra amount of TON (e.g., 1 TON) is sent to the NFT contract to ensure it has enough funds to pay transaction fees and create a new transfer if needed. All unused funds within the transaction are sent to the `responseAddress`.
5. `forwardAmount` - `Coins` - the amount of TON used in conjunction with the forward message (usually set to 0.01 TON). Since TON uses an asynchronous architecture, the new owner of the NFT will not be notified immediately upon successfully receiving the transaction. To notify the new owner, an internal message is sent from the NFT smart contract to the `newOwnerAddress` with a value denoted using the `forwardAmount`. The forward message will begin with the `ownership_assigned` OP (`0x05138d91`), followed by the previous owner's address and the `forwardPayload` (if present).
6. `forwardPayload` - `Slice | Cell` - is sent as a part of `ownership_assigned`  notification message.

This message (as explained above) is the primary way used to interact with an NFT that changes ownership after a notification is received as a result of the above message.

For example, this message type above is often used to send a NFT Item Smart Contract from a Wallet Smart Contract. When an NFT Smart Contract receives this message and executes it, the NFT Contract's storage (inner contract data) is updated along with the Owner's ID. In this way, the NFT Item(contract) changes owners correctly. This process details a standard NFT Transfer

In this case, the forward amount should be set to an appropriate value(0.01 TON for a regular wallet or more if you want to execute a contract by transferring an NFT), to ensure that the new owner receives a notification regarding the ownership transfer. This is important because the new owner won’t be notified that they have received the NFT without this notification.

## Retrieving NFT Data

Most SDKs make use of ready to use handlers for retrieving NFT data, including: [tonweb(js)](https://github.com/toncenter/tonweb/blob/b550969d960235314974008d2c04d3d4e5d1f546/src/contract/token/nft/NftItem.js#L38), [tonutils-go](https://github.com/xssnick/tonutils-go/blob/fb9b3fa7fcd734eee73e1a73ab0b76d2fb69bf04/ton/nft/item.go#L132), [pytonlib](https://github.com/toncenter/pytonlib/blob/d96276ec8a46546638cb939dea23612876a62881/pytonlib/client.py#L771), and others.

To receive NFT data it is necessary to make use of the `get_nft_data()` retrieval mechanism. For example, we must verify the following NFT item address `EQB43-VCmf17O7YMd51fAvOjcMkCw46N_3JMCoegH_ZDo40e`(also known as [foundation.ton](https://tonscan.org/address/EQB43-VCmf17O7YMd51fAvOjcMkCw46N_3JMCoegH_ZDo40e) domain).

First it is necessary to execute the get method by using the toncenter.com API as follows:.
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
The response is generally something similar to the following:
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
Return parameters:
- `init` - `boolean` - -1 means NFT is initialized and can be used
- `index` - `uint256` - index of the NFT in the collection. Can be sequential or derived in some other way. For example, this can denote an NFT doman hash used with TON DNS contracts, while collections should only have only one unique NFT within a given index.
- `collection_address` - `Cell` - a cell containing the NFT collection address (can be empty).
- `owner_address` - `Cell` - a cell containing the current owner’s NFT address (can be empty).
- `content` - `Cell` - a cell containing NFT item content (if parsing is needed it is necessary to consult the TEP-64 standard).

## Retrieving all NFTs within a collection
The process for retrieving all NFTs within a collection differs depending on whether the collection is ordered or not. Let’s outline both processes below.

### Ordered collections
Retrieving all NFTs in an ordered collection is relatively straightforward since the number of NFTs needed for retrieval is already known and their addresses can easily be easily obtained. To complete this process, the following steps should be followed in order:
1. Invoke the `get_collection_data` method using the TonCenter API within the collection contract and retrieve the `next_item_index` value from the response.
2. Use the `get_nft_address_by_index` method, passing in the index value `i` (initially set to 0), to retrieve the address of the first NFT in the collection.
3. Retrieve the NFT Item data using the address obtained in the previous step. Next, verify that the initial NFT Collection smart contract coincides with the NFT Collection smart contract reported by the NFT item itself (to ensure the Collection didn't appropriate another user’s NFT smart contract).
4. Call the `get_nft_content` method with `i` and `individual_content` from the previous step.
5. Increase `i` by 1 and repeat steps 2-5 until `i` is equal to the `next_item_index`.
6. At this point, you will be in possession of the necessary information from the collection and its individual items.


### Unordered collections
Retrieving the list of NFTs in an unordered collection is more difficult because there is no inherent way to obtain the addresses of the NFTs that belong to the collection. Therefore, it is necessary to parse all transactions in the collection contract and check all outgoing messages to identify the ones that correspond to NFTs belonging to the collection.

To do so, the NFT data must be retrieved, and the `get_nft_address_by_index` method is called in the collection with the ID returned by the NFT. If the NFT contract address and the address returned by the `get_nft_address_by_index` method match, it indicates that the NFT belongs to the current collection. However, parsing all messages to the collection can be a lengthy process and may require archive nodes.

##  Working with NFTs outside of TON

### Sending NFTs

To transfer NFT ownership it is necessary to send an internal message from the NFT owner’s wallet to the NFT contract by creating a cell that contains a transfer message. This can be accomplished using libraries (such as [tonweb(js)](https://github.com/toncenter/tonweb/blob/b550969d960235314974008d2c04d3d4e5d1f546/src/contract/token/nft/NftItem.js#L65), [ton(js)](https://github.com/getgems-io/nft-contracts/blob/debcd8516b91320fa9b23bff6636002d639e3f26/packages/contracts/nft-item/NftItem.data.ts#L102), [tonutils-go(go)](https://github.com/xssnick/tonutils-go/blob/fb9b3fa7fcd734eee73e1a73ab0b76d2fb69bf04/ton/nft/item.go#L132)) for the specific language.

Once the transfer message has been created, it must be sent to the NFT item contract address from the owner's wallet contract, with an adequate amount of TON to cover the associated transaction fee.

To transfer an NFT from another user to yourself, it is necessary to use TON Connect 2.0 or a simple QR code that contains a ton:// link. For example:
`ton://transfer/{nft_address}?amount={message_value}&bin={base_64_url(transfer_message)}`

### Receiving NFTs
The process of tracking NFTs sent to a certain smart contract address (i.e. a user's wallet) is similar to the mechanism used to track payments. This is completed by listening to all new transactions in your wallet and parsing them. 

The next steps may vary depending on the specific use case. Let’s examine several different scenarios below.

#### Service waiting for known NFT address transfers:
- Verify new transactions sent from the NFT item smart contract address.
- Read the first 32 bits of the message body as using the `uint` type and verify that it is equal to `op::ownership_assigned()`(`0x05138d91`)
- Read the next 64 bits from the message body as the `query_id`.
- Read the address from the message body as the `prev_owner_address`.
- It is now possible to manage your new NFT.

#### Service listening to all types of NFT transfer:
- Check all new transactions and ignore those with a body length less than 363 bits (OP - 32, QueryID - 64, Address - 267).
- Repeat the steps detailed in the previous list above.
- If the process is working correctly, it is necessary to verify the authenticity of the NFT by parsing it and the collection it belongs to. Next, it is necessary to ensure that the NFT belongs to the specified collection. More information detailing this process can be found in the `Getting all collection NFTs` section. This process can be simplified by using a whitelist of NFTs or collections.
- It is now possible to manage your new NFT.

#### Tying NFT transfers to internal transactions:

When a transaction of this type is received, it's necessary to repeat the steps from the previous list. Once this process is completed, it is possible to retrieve the `RANDOM_ID`  parameter by reading a uint32 from the message body after reading the `prev_owner_address` value.

#### NFTs sent without a notification message:
All of the strategies outlined above rely on the services correctly creating a forward message with the NFT transfer. If they don't do this, we won't know that they transferred the NFT to us. However, there are a few workarounds:

All of the strategies outlined above rely on the service correctly creating a forward message within the NFT transfer. If this process is not carried out, it won’t be clear whether the NFT was transferred to the correct party. However, there are a several workarounds that are possible in this scenario:

- If a small number of NFTs is expected, it is possible to periodically parse them and verify if the owner has changed to the corresponding contract type.
- If a large number of NFTs is expected, it is possible to parse all new blocks and verify if there were any calls sent to the NFT destination using the `op::transfer` method. If a transaction like this is initiated, it is possible to verify the NFT owner and receive the transfer.
- If it's not possible to parse new blocks within the transfer, it is possible for users to trigger NFT ownership verification processes themselves. This way, it is possible to trigger the NFT ownership verification process after transferring an NFT without a notification.

## Interacting with NFTs from smart contracts

Now that we’ve covered the basics of sending and receiving NFTs, let’s explore how to receive and transfer NFTs from smart contracts using the [NFT Sale](https://github.com/ton-blockchain/token-contract/blob/1ad314a98d20b41241d5329e1786fc894ad811de/nft/nft-sale.fc) contract example.

### Sending NFTs

In this example, the NFT transfer message is found on [line 67](https://www.google.com/url?q=https://github.com/ton-blockchain/token-contract/blob/1ad314a98d20b41241d5329e1786fc894ad811de/nft/nft-sale.fc%23L67&sa=D&source=docs&ust=1685436161341866&usg=AOvVaw1yuoIzcbEuvqMS4xQMqfXE):

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
Let's examine each line of code:
- `store_uint(0x18, 6)` - stores message flags.
- `store_slice(nft_address)` - stores message destinations (NFT addresses).
- `store_coins(0)` -  the amount of TON to send with the message is set to 0 because the `128` [message mode](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes) is used to send the message with its remaining balance. To send an amount other than the user’s entire balance, the number must be changed. Note that it should be large enough to pay for gas fees as well as any forwarding amount.
- `store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)`  -  the remaining components that make up the message header are left empty.
- `store_uint(op::transfer(), 32)` - this is the start of the msg_body. Here we start by using the transfer OP code so the receiver understands its transfer ownership message.
- `store_uint(query_id, 64)` - store query_id
- `store_slice(sender_address) ;; new_owner_address` - the first stored address is the address used for transferring NFTs and sending notifications.
- `store_slice(sender_address) ;; response_address` - the second stored address is a response address.
- `store_int(0, 1)` - the custom payload flag is set to 0, indicating there is no custom payload required.
- `store_coins(0)` - amount of TON to be forwarded with the message. In this example it’s set to 0, however, it is recommended to set this value to a higher amount (such as at least 0.01 TON) in order to create a forward message and notify the new owner that they have received the NFT. The amount should be sufficient to cover any associated fees and costs.
- `.store_int(0, 1)` - custom payload flag. It's necessary to set up to `1` if your service should pass payload as a ref.

### Receiving NFTs
Once we've sent the NFT, it is critical to determine when it has been received by the new owner. A good example of how to do this can be found in the same NFT sale smart contract:

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
Let's again examine each line of code:

- `slice cs = in_msg_full.begin_parse();` - used to parse the incoming message.
- `int flags = cs~load_uint(4);` - used to load flags from the first 4 bits of the message.
- `if (flags & 1) { return (); } ;; ignore all bounced messages` - used to verify that the message has not bounced. It’s important to carry out this process for all your incoming messages if there is no reason to do otherwise. Bounced messages are messages that encountered errors while trying to receive a transaction and were returned to the sender.
- `slice sender_address = cs~load_msg_addr();` - next the message sender is loaded. In this case specifically by using an NFT address.
- `throw_unless(500, equal_slices(sender_address, nft_address));` - used to verify that the sender is indeed an NFT that should have been transferred via a contract. It's quite difficult to parse NFT data from smart contracts, so in most cases the NFT address is predefined at contract creation.
- `int op = in_msg_body~load_uint(32);` - loads message OP code.
- `throw_unless(501, op == op::ownership_assigned());` - ensures that the received OP code matches the ownership assigned constant value.
- `slice prev_owner_address = in_msg_body~load_msg_addr();` - previous owner address that is extracted from the incoming message body and loaded into the `prev_owner_address` slice variable. This can be useful if the previous owner chooses to cancel the contract and have the NFT returned to them.

Now that we have successfully parsed and validated the notification message, we can proceed with our business logic which is used to initiate a sale smart contract (which serves to handle NFT Item business sale processes for NFT Auctions, such as getgems.io)
