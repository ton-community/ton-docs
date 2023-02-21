# Messages TL-B schemes

In this section detailed explanation of TL-B schemes for messages.


## Message TL-B
### TL-B
Main message TL-B scheme declared as a combination of several nested structures

```tlb
message$_ {X:Type} info:CommonMsgInfo
init:(Maybe (Either StateInit ^StateInit))
body:(Either X ^X) = Message X;

message$_ {X:Type} info:CommonMsgInfoRelaxed
init:(Maybe (Either StateInit ^StateInit))
body:(Either X ^X) = MessageRelaxed X;

_ (Message Any) = MessageAny;
```

Here `Message X` - is common message structure, `MessageRelaxed X` additional type with CommonMsgInfoRelaxed body and `Message Any` is a union of both.
Message structure unified with X:Type, that in other words is a Cell.
According to TL-B we can combine all data in one cell(if it will be fit to 1023 bits) or use references declared with caret `^`.

Serialized `Message X` placed to action list with FunC method send_raw_message(), than smart contract execute this action and message send.


### Definition of atomic data
For building valid binary data according TL-B structure we should do serilization, which defined for each type recurrently. It means, that for serialization of Message X we need to know how to serialize
`StateInit`, `CommonMsgInfo`.

Every structure we should get from another TL-B scheme will be marked `Nested`, for others `Atomic`.

From the top, we have such structure:

| Structure     | Type   | Required | Description                                                                                                  |
|---------------|--------|----------|--------------------------------------------------------------------------------------------------------------|
| message$_     | Atomic | -        | It defined according the constructor ruler. Empty tag `$_` means we will not add any bits in the beginning   |
| CommonMsgInfo | Nested | Required | Detailed Message properties define destination and its value. Always placed in message root cell.            |
| StateInit     | Nested | Optional | General structure using in TON for initilizing new contracts. Could be write in cell reference or root cell. |
| X             | Nested | Required | Message Payload. Could be write in cell reference or root cell.                                              |                                                                                            |


```tlb
nothing$0 {X:Type} = Maybe X;
just$1 {X:Type} value:X = Maybe X;
left$0 {X:Type} {Y:Type} value:X = Either X Y;
right$1 {X:Type} {Y:Type} value:Y = Either X Y;

message$_ {X:Type} info:CommonMsgInfo
init:(Maybe (Either StateInit ^StateInit))
body:(Either X ^X) = Message X;
```

Recall how `Maybe` and `Either` works, we can serialize different cases:

* `[CommonMsgInfo][11][^StateInit][1][^X]` - `Message X` with references

  ![TL-B example](/img/docs/data-formats/tl-b-docs-8.png?raw=true)

* `[CommonMsgInfo][10][StateInit][0][X]` - `Message X` in the one cell

![TL-B example](/img/docs/data-formats/tl-b-docs-9.png?raw=true)

## CommonMsgInfo TL-B

`CommonMsgInfo` is a list of parameters, that defines how message will be delivered in TON blockchain.


```tlb
//internal message
int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
  src:MsgAddressInt dest:MsgAddressInt 
  value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
  created_lt:uint64 created_at:uint32 = CommonMsgInfo;
  
//external incoming message  
ext_in_msg_info$10 src:MsgAddressExt dest:MsgAddressInt 
  import_fee:Grams = CommonMsgInfo;
  
//external outgoing message
ext_out_msg_info$11 src:MsgAddressInt dest:MsgAddressExt
  created_lt:uint64 created_at:uint32 = CommonMsgInfo;
```



| Structure     | Type   | Required | Description                                                                                                  |
|---------------|--------|----------|--------------------------------------------------------------------------------------------------------------|
| message$_     | Atomic | -        | It defined according the constructor ruler. Empty tag `$_` means we will not add any bits in the beginning   |
| CommonMsgInfo | Nested | Required | Detailed Message properties define destination and its value. Always placed in message root cell.            |
| StateInit     | Nested | Optional | General structure using in TON for initilizing new contracts. Could be write in cell reference or root cell. |
| X             | Nested | Required | Message Payload. Could be write in cell reference or root cell.                                              |                                                                                            |
