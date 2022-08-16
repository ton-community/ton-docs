# Sending messages

Composition, parsing and sending messages lie on the intersection of [TL-B schemas](/develop/smart-contracts/overviews/TL-B), [transaction phases and TVM](/develop/smart-contracts/tvm_overview.md).

Indeed, funC expose [send_raw_message](/develop/func/stdlib?id=send_raw_message) function which expects serialized message as argument.

Since TON is a comprehensive system with wide functionality, messages which need to be able to support all of this functionality may look quite complicated. Still, most of that functionality is not used in common scenarios and message serialization in most cases may be reduced to 
```cpp
  var msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_slice(message_body)
  .end_cell();
```

Therefore, the developer should not be afraid, and if something in this document seems incomprehensible on first reading, it's okay. Just grasp the general idea.

Let's dive in!

## Types of messages
There are three types of messages:
 * external - messages which are sent from outside of blockchain to some smart-contract inside. Such messages should be explicitly accepted by smart-contract during so called `credit_gas`. If message is not accepted, node should not accept it into block or relay it to other nodes.
 * internal - messages which are sent from one blockchain entity to another. Such messages (in contrast to external) may carry some TONs and pay for themselves. Thus smart-contract which receive such message may not accept it: in this case gas will be deducted from message value.
 * logs - messages which are sent from blockchain entity to outer world. Generally speaking there is no mechanism of sending such messages out of blockchain: indeed, while all nodes in the network have consensus on whether message was created or not, there are no rules on how process them. Logs may be directly sent to `/dev/null`, logged to disk, saved to indexed database or even sent by non-blockchain means (email/telegram/sms), all of this is in the sole discretion of the given node.

## Message layout

We will start with internal messages layout

TL-B scheme which describes message which can be sent by smart-contract is as follows:
```cpp
message$_ {X:Type} info:CommonMsgInfoRelaxed 
  init:(Maybe (Either StateInit ^StateInit))
  body:(Either X ^X) = MessageRelaxed X;
```

Lets put it into words. Serialization of any message consist of three fields: info (header of some sort, which describe source, destination and other metadata), init (field which is only required for initialisation of messages) and body (message payload).

`Maybe` and `Either` and other type expressions mean as following: 
* when we have field `info:CommonMsgInfoRelaxed` it means that serialization of `CommonMsgInfoRelaxed` is injected directly to the serialization cell
* when we have field `body:(Either X ^X)` it means that when we (de)serialize some type `X` we first put one `either` bit which is `0` if `X` is serialized to the same cell or `1` if it is serialized to the separate cell.
* when we have field `init:(Maybe (Either StateInit ^StateInit))` it means that we first put `0` or `1` depending on whether this field empty or not; and if it is not empty we serialize `Either StateInit ^StateInit` (again put one `either` bit which is `0` if `StateInit` is serialized to the same cell or `1` if it is serialized to the separate cell).

`CommonMsgInfoRelaxed` layout is as follows: 

```cpp
int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
  src:MsgAddress dest:MsgAddressInt 
  value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
  created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;

ext_out_msg_info$11 src:MsgAddress dest:MsgAddressExt
  created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
```

Let's focus on `int_msg_info` for now.
It starts with 1bit prefix `0`, then there are three 1-bit flags, namely whether Instant Hypercube Routing disabled (currently always true), whether message should be bounced if there are errors during it's processing, whether message itself is result of bounce. Then source and destination address is serialized, then value of the message and four integers related to message forwarding fees and time.

If message is sent from the smart-contract, some of those fields will be rewritten to correct values. In particular, validator will rewrite `bounced`, `src`, `ihr_fee`, `fwd_fee`, `created_lt` and `created_at`. That means two things: first, another smart-contract during handling message may trust those fields (sender may not forge source address, `bounced` flag, etc); and second, that during serialization we may put to those fields any valid values (anyway those values will be overwritten).


Straight-forward serialization of the message would be as follows:
```cpp
  var msg = begin_cell()
    .store_uint(0, 1) ;; tag
    .store_uint(1, 1) ;; ihr_disabled
    .store_uint(1, 1) ;; allow bounces
    .store_uint(0, 1) ;; not bounced itself
    .store_slice(source)
    .store_slice(destination)
    ;; serialize CurrencyCollection (see below)
    .store_coins(amount)
    .store_dict(extra_currencies)
    .store_coins(0) ;; ihr_fee
    .store_coins(fwd_value) ;; fwd_fee 
    .store_uint(cur_lt(), 64) ;; lt of transaction
    .store_uint(now(), 32) ;; unixtime of transaction
    .store_uint(0,  1) ;; no init-field flag (Maybe)
    .store_uint(0,  1) ;; inplace message body flag (Either)
    .store_slice(msg_body)
  .end_cell();
```

However, instead of step by step serialization of all fields, usually developers use short-cuts. Thus lets consider how message can be sent from the smart-contract on example from [elector-code](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/elector-code.fc#L153)
```cpp
() send_message_back(addr, ans_tag, query_id, body, grams, mode) impure inline_ref {
  ;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
  var msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(grams)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_uint(ans_tag, 32)
    .store_uint(query_id, 64);
  if (body >= 0) {
    msg~store_uint(body, 32);
  }
  send_raw_message(msg.end_cell(), mode);
}
```

First it put `0x18` value into 6 bits, that is put `0b011000`. What is it? 

* First bit is `0` -  1bit prefix which indicates that it is `int_msg_info`. 

* Then there are 3 bits `1`, `1` and `0`, meaning Instant Hypercube Routing is disabled, message can be bounced and that message is not result of bouncing itself. 
* Then there should be sender address, however since it anyway will be rewritten with the same effect any valid address may be stored there. The shortest valid address serialization is serialization of `addr_none` and it serializes as two-bit string `00`.

Thus `.store_uint(0x18, 6)` is the optimized way of serializing tag and first 4 fields.

Next line serializes destination address.

Then we should serialize value. Generally message value is a `CurrencyCollection` object with the following scheme:
```cpp
nanograms$_ amount:(VarUInteger 16) = Grams;

extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32)) 
                 = ExtraCurrencyCollection;

currencies$_ grams:Grams other:ExtraCurrencyCollection 
           = CurrencyCollection;
```

This scheme means that in addtion to TON value, message may carry the dictionary of additional _extra-currencies_. However currently we may neglect it and just assume that message value is serialized as "number of nanotons as variable integer" and "`0` - empty dictionary bit".

Indeed, in elector code above we serialize coins amount via `.store_coins(grams)` but then just put string of zeroes with length equal to `1 + 4 + 4 + 64 + 32 + 1 + 1`. What is it? 
* First bit stands for empty extra-currencies dictionary.
* Then we have two 4bit long fields. They encode 0 as `VarUInteger 16`. Indeed since `ihr_fee` and `fwd_fee` will be overwritten  we may as well put there zeroes.
* Then we put zero to `created_lt` and `created_at` fields. Those fields will be overwritten as well, however in contrast to fees, these fields have fixed length and thus are encoded as 64 and 32 bit long strings.
* _(at that moment we alredy serialized message header and pass to init/body)_
* next zero-bit means that there is no `init` field
* and last zero-bit means that msg_body will be serialized in-place
* after that message body (with arbitrary layout) is encoded.

That way instead of individual serialization of 14 parameters, we execute 4 serialization primitives.

## Full scheme
Full scheme of messages layout as well as layout of all constituting fields (as well as scheme of ALL objects in TON) is presented in [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb).

## Message size
Note that any Cell may contain up to 1023 bits. If you need to store more data you should split it into chunks and store in reference cells.

That means that if, for instance, your message body size is 900 bits long you can not to store it in the same cell with the message header.
Indeed, in addition to message header fields, total size of the cell will be more than 1023 bits and during serialization there will be `cell overflow` exception. In this case, instead of `0` that stands for "inplace message body flag (Either)" there should be `1` and message body should be stored in reference cell.

Those things should be handled carefully due to the fact that some fields have variable size.

For instance `MsgAddress` may be represented by 4 constructors `addr_none`, `addr_std`, `addr_extern`, `addr_var` with length from 2 bits ( for `addr_none`) to 586 bits (for `addr_var` in the largest form). The same stands for nanoTON amounts which is serialized as `VarUInteger 16`, that means 4 bits indicating the byte-length of the integer and then indicated earlier bytes for integer itself: that way 0 nanoTONs will be serialized as `0b0000` (4 bits which encode zero-length byte string and then zero bytes), while 100.000.000 TON (or 100000000000000000 nanoTONs) will be serialized as `0b10000000000101100011010001010111100001011101100010100000000000000000` (`0b1000` stands for 8 bytes and then 8 bytes themselves).
