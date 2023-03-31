# NFT processing on TON
In this page we will take a look at NFTs. What they are, how to interact with them and how to accept them. Content on this page assumes you have already read [previous part](/develop/dapps/asset-processing) on working with Toncoin and have basic understanding of working with wallets.

## Basic NFT Knowledge
NFTs on TON Blockchain are represented by [TEP-62](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md) and [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md).

TON Blockchain is designed with high prefomance in mind. It includes a feature for automatic sharding based on contract address, which can be fully leveraged by designing NFTs in a specific manner. In order to achieve optimal performance, each individual NFT is required to have its own smart contract. This enables the creation of NFT collections of any size, with linear costs and no concerns about performance. However, this approach also introduces new concepts and considerations for working with NFT collections.

As each NFT has its own smart contract, it is not possible to obtain information about every NFT item from a single contract. In order to retrieve information on the entire collection, as well as each individual NFT, it is necessary to query both the collection contract and each individual NFT contract separately. For the same reason, if you want to track NFT transfers, you'll need to track all transactions on all NFTs.

### NFT Collection
NFT Collection is a contract that serves as index and common content storage for NFTs. It should contain following interfaces:
#### Get method `get_collection_data`
```
(int next_item_index, cell collection_content, slice owner_address) get_collection_data()
```
Contains general informaion about collection.
  1. `next_item_index` - If the collection is ordered, `next_item_index` indicates the total number of NFTs in the collection as well as the next index to use for minting. For unordered collections, this value will be -1, which means the collection uses some other mechanism to keep track of NFTs. For example, the hash of the domain for TON DNS
  2. `collection_content` - a cell that represents the collection content in TEP-64 compatible format
  3. `owner_address` - a slice that contains the collection owner's address. This value can be empty.

#### Get method `get_nft_address_by_index`
```
(slice nft_address) get_nft_address_by_index(int index)
```
This method can be used to verify the authenticity of an NFT and confirm whether it truly belongs to the collection. It also enables users to retrieve the address of an NFT by providing its index in the collection. The method should return a slice containing the address of the NFT that corresponds to the provided index.

#### Get method `get_nft_content`
```
(cell full_content) get_nft_content(int index, cell individual_content)
```
Since the collection serves as a common data storage for NFTs, this method is necessary to complete the NFT content. To use this method, first, you should obtain the NFT `individual_content` by calling the corresponding `get_nft_data()` method. After obtaining the `individual_content`, you can call `get_nft_content` with the NFT index and the `individual_content` cell. The method should return a TEP-64 cell containing the full content of the NFT.

### NFT Item
Basic NFT should implement:

#### Get method `get_nft_data()`
```
(int init?, int index, slice collection_address, slice owner_address, cell individual_content) get_nft_data()
```

#### Inline message handler for `transfer`
```
transfer#5fcc3d14 query_id:uint64 new_owner:MsgAddress response_destination:MsgAddress custom_payload:(Maybe ^Cell) forward_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell) = InternalMsgBody
```
Let's look at each parameter you need:
1. `OP` - `0x5fcc3d14` - a constant defined by TEP-62 for the transfer message.
2. `queryId` - `uint64` - any uint64 number, you can use it to track your message.
3. `newOwnerAddress` - `MsgAddress` - the address of the contract to transfer the NFT to.
4. `responseAddress` - `MsgAddress` - the address to transfer excess funds to. Typically, an extra amount of TON (e.g., 1 TON) is sent to the NFT contract to ensure it has enough funds to create a new transfer and pay transaction fees. Any unused funds in the transaction will be sent to `responseAddress`.
6. `forwardAmount` - `Coins` - the amount of TON to use for the forward message. Usually, this is set to 0.01 TON. Since TON uses an asynchronous architecture, the new owner of the NFT will not be notified immediately upon receiving ownership. To notify the new owner, an internal message is sent from the NFT to `newOwnerAddress` with a value of `forwardAmount`. The forward message will begin with the `ownership_assigned` OP (`0x05138d91`), followed by the previous owner's address and the forwardPayload (if present).
7. `forwardPayload` - `Slice | Cell` - will be sent as a part of `ownership_assigned` notification message.

This message is your primary way to interact with NFT. You send it to change the owner. And you receive notifications about receiving NFT as a result of this message. The forward amount should be set to an appropriate value(0.01 TON for regular wallet or more if you wan't to execute contract by transfering NFT), to ensure that the new owner receives a notification about the ownership transfer. This is important because the new owner will not know that they have received the NFT without this notification.

## Getting NFT Data
To get NFT data you should use `get_nft_data()` getter. For example let's check NFT `EQB43-VCmf17O7YMd51fAvOjcMkCw46N_3JMCoegH_ZDo40e`(also known as `foundation.ton` domain).

First you need to execute get method. We will use toncenter.com API for that.
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
We will get something like this in response:
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
- `index` - `uint256` - index of the NFT in the collection. Can be sequential or derived in some other way. For example it's a hash of the NFT domain for TON DNS contracts. Collections should have only one unique nft with given index.
- `collection_address` - `Cell` - Cell contaning address of the NFT collection. Could be empty.
- `owner_address` - `Cell` - Cell contaning address of the current nft owner. Could be empty.
- `content` - `Cell` - Cell contaning NFT item content. If you need to parse it, you can consult TEP-64.

## Getting all collection NFTs
The process for retrieving all NFTs in a collection differs depending on whether the collection is ordered or not.

### Ordered collection
Retrieving all NFTs in an ordered collection is relatively straightforward since we already know the number of NFTs we need to retrieve and can easily obtain their addresses. Here are the steps:
1. Invoke the `get_collection_data` method via the TonCenter API on the collection contract and retrieve the `next_item_index` value from the response.
2. Use the `get_nft_address_by_index` method, passing in the index value `i` (initially set to 0), to retrieve the address of the first NFT in the collection.
3. Retrieve the NFT data using the address obtained in the previous step.
4. Call method `get_nft_content` with `i` and `individual_content` from previous step.
5. Increase `i` by 1 and repeat items 2-5 until `i` is equal to `next_item_index`.
6. At this point, you will have all the necessary information about the collection and its individual items.

### Unordered collection
Retrieving the list of all NFTs in an unordered collection is a more challenging task because there is no inherent way to obtain the addresses of the NFTs that belong to the collection. Therefore, it is necessary to parse all transactions on the collection contract and check every outgoing message to identify the ones that correspond to NFTs belonging to the collection. To do so, the NFT data must be retrieved, and the `get_nft_address_by_index` method is called on the collection with the `ID` returned by the NFT. If the NFT contract address and the address returned by the `get_nft_address_by_index` method match, it indicates that the NFT belongs to the current collection. However, parsing all messages to the collection can be a lengthy process and may require archive nodes.

##  Working with NFTs from outside of the chain

### Send NFT

To transfer NFT ownership you need to send internal message from NFT Owner wallet to NFT contract. You need to create cell with transfer message. This can be done by using libraries for your language. For example [tonweb(js)](https://github.com/toncenter/tonweb/blob/b550969d960235314974008d2c04d3d4e5d1f546/src/contract/token/nft/NftItem.js#L65), [ton(js)](https://github.com/getgems-io/nft-contracts/blob/debcd8516b91320fa9b23bff6636002d639e3f26/packages/contracts/nft-item/NftItem.data.ts#L102), [tonutils-go(go)](https://github.com/xssnick/tonutils-go/blob/fb9b3fa7fcd734eee73e1a73ab0b76d2fb69bf04/ton/nft/item.go#L132)

Once the transfer message has been created, it must be sent to the NFT contract address from the owner's wallet, with an adequate amount of TON included to cover associated transaction fees.

To transfer an NFT from a user to yourself, you can utilize TonConnectV2 or a simple QR code that contains a ton:// link. An example of the ton:// link is as follows:
`ton://transfer/{nft_address}?amount={message_value}&bin={base_64_url(transfer_message)}`

### Receive NFT

The process of tracking NFTs sent to your address is similar to tracking payments. You begin by listening to all new transactions on your wallet and parsing them. The next steps may vary depending on your use case.

#### If know address of NFT you're waiting for:
- Check for new transactions from the NFT address.
- Read first 32 bits of the message body as uint and verify that it equals `op::ownership_assigned()`(`0x05138d91`)
- Read the next 64 bits from the body as the query_id.
- Read the address from the body as `prev_owner_address`.
- You can now handle your new NFT.

#### If you want to listen to all NFT transfers:
- Check all new transactions and ignore any with a body length less than 363 bits (OP - 32, QueryID - 64, Address - 267).
- Repeat the steps from the previous list.
- If everything is OK, verify the authenticity of the NFT by parsing it and the collection it belongs to. Ensure that the NFT belongs to the specified collection. More information on this can be found in the `Getting all collection NFTs` section. This process can be simplified if you have a whitelist of NFTs or collections.
- You can now handle your new NFT.

#### If you want to tie an NFT transfer to your internal transaction:
Note that this is uncommon, since you already know who sent the NFT to you. However, if you want to make an NFT transfer uniquely identifiable, you can add a forward payload to the NFT transfer transaction that you give to the user. To do this add `store_uint(RANDOM_ID, 32)` at the end of the transfer message. When you'll receive such transaction, repeat steps from the previous list, and then you can then retrieve `RANDOM_ID` by reading a uint32 from message body after reading `prev_owner_address`.

#### If user sent NFT, but without notification message:
All of the strategies outlined above rely on the user correctly creating a forward message with the NFT transfer. If they don't do this, we won't know that they transferred the NFT to us. However, there are a few workarounds:
- If you're only expecting a small number of NFTs, you can periodically parse them and check if the owner has changed to your contract.
- If you're expecting a large number of NFTs, you can parse all new blocks and check if there were any calls to your NFTs with `op::transfer` that succeeded. If you find a transaction like this, you can check the NFT owner and handle the transfer.
- If you can't afford to parse all new blocks, you can allow users to trigger an NFT ownership check themselves. This way, they can trigger it after transferring an NFT without a notification.


## Working with NFTs from smart contracts

Now that we covered basics of working with NFTs, let us now explore how to receive and transfer NFTs from smart contracts using the [Nft Sale](https://github.com/ton-blockchain/token-contract/blob/1ad314a98d20b41241d5329e1786fc894ad811de/nft/nft-sale.fc) contract as an example.

### Send NFT

We can find NFT transfer message at line 67:

```
var nft_msg = begin_cell()
  .store_uint(0x18, 6)
  .store_slice(nft_address)
  .store_coins(0)
  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
  .store_uint(op::transfer(), 32)
  .store_uint(query_id, 64)
  .store_slice(sender_address) ;; new_owner_address
  .store_slice(sender_address) ;; response_address
  .store_int(0, 1) ;; empty custom_payload
  .store_coins(0) ;; forward amount to new_owner_address
  .store_int(0, 1); ;; empty forward_payload


send_raw_message(nft_msg.end_cell(), 128 + 32);
```
Lest go line by line:
- `store_uint(0x18, 6)` - Store message flags.
- `store_slice(nft_address)` - Store message destination, NFT address in our case.
- `store_coins(0)` - The amount of TON to send with the message is set to 0 because we will use mode `128` to send the message with all the remaining balance. If you want to send an amount other than your entire balance, you should change this number. Note that it should be large enough to pay for gas fees as well as any forwarding amount.
- `store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)` - The remaining parts of the message header are left empty.
- `store_uint(op::transfer(), 32)` - this is start of msg_body, we start it with transfer OP code, so receiver can understand it's trasnfer ownership message.
- `store_uint(query_id, 64)` - store query_id
- `store_slice(sender_address) ;; new_owner_address` - first stored address is the adress to transfer nft to and send notification.
- `store_slice(sender_address) ;; response_address` - second stored address is response address.
- `store_int(0, 1)` - The custom payload flag is set to 0, indicating that there is no custom payload.
- `store_coins(0)` - Amount of TON to be forwarded with the message. In this example it is set to 0, however, it is recommended to set this value to a higher amount (such as at least 0.01 TON) in order to create a forward message and notify the new owner that they have received the NFT. The amount should be sufficient to cover any associated fees and costs.
- `.store_int(0, 1)` - custom payload flag. Set to 1 if you want to pass it as ref.

### Receive NFT
Once we've sent the NFT, we need to detect when it has been received by the new owner. A good example of how to do this can be found in the same sale contract:
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
Let's again look line by line and examine what are they for:
- `slice cs = in_msg_full.begin_parse();` - starts parsing incoming message
- `int flags = cs~load_uint(4);` - we load flags from first 4 bits of the message.
- `if (flags & 1) { return (); } ;; ignore all bounced messages` - check that message is not bounced. It's good practice to do that for all your incoming messages, if you do not have a good reason to do otherwise. Bounces message are messages that encountered error and were returned to sender.
- `slice sender_address = cs~load_msg_addr();` - Now we load message sender. In our case it should be NFT address.
- `throw_unless(500, equal_slices(sender_address, nft_address));` - Check that sender is indeed NFT that should've been transferred to our contract. It's very hard to parse NFT data from smart contract, so in most cases we predefine allowed nft address at the moment of contract creation.
- `int op = in_msg_body~load_uint(32);` - load message OP code.
- `throw_unless(501, op == op::ownership_assigned());` - make sure that received OP code matches ownership assigned constant.
- `slice prev_owner_address = in_msg_body~load_msg_addr();` - The previous owner address is extracted from the incoming message body and loaded into the `prev_owner_address` slice variable. This can be useful if the previous owner wants to cancel the contract and have the NFT returned to them.

Now that we have successfully parsed and validated the notification message, we can proceed with our business logic, such as starting a sale.