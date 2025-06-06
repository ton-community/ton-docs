import Feedback from '@site/src/components/Feedback';

# RLDP

Please see the implementations:

* [RLDP Part 1](https://github.com/ton-blockchain/ton/tree/master/rldp)
* [RLDP Part 2](https://github.com/ton-blockchain/ton/tree/master/rldp2)
* [RLDP HTTP Proxy](https://github.com/ton-blockchain/ton/tree/master/rldp-http-proxy)

## Overview

The Reliable Large Datagram Protocol (RLDP) operates on top of the ADNL UDP protocol and is designed for transferring large data blocks. It incorporates Forward Error Correction (FEC) algorithms, which allow it to replace acknowledgment packets typically sent from the receiver back to the sender.

This capability enables more efficient data transfer between network components, although it results in increased traffic consumption.

RLDP plays a crucial role throughout the TON infrastructure. It is used for various purposes, such as downloading blocks from other nodes, transferring data to those nodes, and accessing TON websites and TON Storage.

## Protocol

RLDP utilizes the following TL structures for communication:

```tlb
fec.raptorQ data_size:int symbol_size:int symbols_count:int = fec.Type;
fec.roundRobin data_size:int symbol_size:int symbols_count:int = fec.Type;
fec.online data_size:int symbol_size:int symbols_count:int = fec.Type;

rldp.messagePart transfer_id:int256 fec_type:fec.Type part:int total_size:long seqno:int data:bytes = rldp.MessagePart;
rldp.confirm transfer_id:int256 part:int seqno:int = rldp.MessagePart;
rldp.complete transfer_id:int256 part:int = rldp.MessagePart;

rldp.message id:int256 data:bytes = rldp.Message;
rldp.query query_id:int256 max_answer_size:long timeout:int data:bytes = rldp.Message;
rldp.answer query_id:int256 data:bytes = rldp.Message;
```

The serialized structure is encapsulated in the `adnl.message.custom` TL schema and transmitted over ADNL UDP.

RLDP transfers are utilized for sending large amounts of data. A random `transfer_id` is generated, and the data is then processed using the FEC algorithm.

The resulting segments are wrapped in a `rldp.messagePart` structure and sent to the peer until the peer responds with `rldp.complete` or a timeout occurs.

Once the receiver has gathered the necessary `rldp.messagePart` pieces to reconstruct the complete message, it concatenates them, decodes them using FEC, and then deserializes the resulting byte array into either an `rldp.query` or `rldp.answer` structure, depending on the type indicated by the `tl prefix id`.

### FEC

Valid Forward Error Correction (FEC) algorithms suitable for RLDP include RoundRobin, Online, and RaptorQ. 

Currently, [RaptorQ](https://www.qualcomm.com/media/documents/files/raptorq-technical-overview.pdf) is used for data encoding.

#### RaptorQ

The core concept of RaptorQ is the division of data into symbols, which are blocks of a fixed, predetermined size.

These blocks are organized into matrices, where discrete mathematical operations are performed. This process enables the creation of an almost limitless number of symbols from the same original data. 

All the generated symbols are combined and sent to the recipient, allowing for the recovery of lost packets without the need for additional requests to the server. This method uses fewer packets than would be required if the same pieces of data were sent repeatedly.

The symbols are transmitted to the peer until they confirm that all data has been received and successfully restored (decoded) by applying the same discrete operations.

[[Please see implementation example of RaptorQ in Golang]](https://github.com/xssnick/tonutils-go/tree/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/rldp/raptorq).

## RLDP-HTTP

To interact with TON Sites, the RLDP (Reverse Lightweight Data Protocol) is used to wrap HTTP requests. The host sets up their site on any standard HTTP web server and runs `rldp-http-proxy` alongside it.

All incoming requests from the TON network are directed to the proxy via the RLDP protocol. The proxy then converts these requests into standard HTTP format and calls the original web server locally.

On the user's side, they launch a proxy, such as [Tonutils Proxy](https://github.com/xssnick/TonUtils-Proxy), to access the .ton sites. All traffic is wrapped in the reverse order: requests are sent to the local HTTP proxy, which then forwards them via RLDP to the remote TON site.

HTTP communication within RLDP is structured using TL formats:

```tlb
http.header name:string value:string = http.Header;
http.payloadPart data:bytes trailer:(vector http.header) last:Bool = http.PayloadPart;
http.response http_version:string status_code:int reason:string headers:(vector http.header) no_payload:Bool = http.Response;

http.request id:int256 method:string url:string http_version:string headers:(vector http.header) = http.Response;
http.getNextPayloadPart id:int256 seqno:int max_chunk_size:int = http.PayloadPart;
```

This is not pure HTTP in text form; everything is wrapped in a binary TL and unwrapped before being sent to the web server or browser by the proxy itself.

The scheme of work is as follows:
* Client sends `http.request`
* The server checks the `Content-Length` header when receiving a request
  * If not 0, sends a `http.getNextPayloadPart` request to the client
  * When receiving a request, the client sends `http.payloadPart` - the requested body piece depending on `seqno` and `max_chunk_size`.
  * The server repeats requests, incrementing `seqno`, until it receives all the chunks from the client, i.e. until the `last:Bool` field of the last chunk received is true.
* After processing the request, the server sends `http.response`, the client checks the `Content-Length` header
  * If it is not 0, then sends a `http.getNextPayloadPart` request to the server, and the operations are repeated, as in the case of the client but vice-versa.

## Request the TON site

To understand how RLDP works, let's look at an example of getting data from the TON site `foundation.ton`. 

Assuming say we have already got its ADNL address by calling the Get method of the NFT-DNS contract, [determined the address and port of the RLDP service using DHT](https://github.com/xssnick/ton-deep-doc/blob/master/DHT.md), and [connected to it over ADNL UDP](https://github.com/xssnick/ton-deep-doc/blob/master/ADNL-UDP-Internal.md).

### Send a GET request to `foundation.ton`

To accomplish this, please complete the following structure:

```tlb
http.request id:int256 method:string url:string http_version:string headers:(vector http.header) = http.Response;
```

Serialize `http.request` by filling in the fields:

```
e191b161                                                           -- TL ID http.request      
116505dac8a9a3cdb464f9b5dd9af78594f23f1c295099a9b50c8245de471194   -- id           = {random}
03 474554                                                          -- method       = string `GET`
16 687474703a2f2f666f756e646174696f6e2e746f6e2f 00                 -- url          = string `http://foundation.ton/`
08 485454502f312e31 000000                                         -- http_version = string `HTTP/1.1`
01000000                                                           -- headers (1)
   04 486f7374 000000                                              -- name         = Host
   0e 666f756e646174696f6e2e746f6e 00                              -- value        = foundation.ton
```

Now let's wrap our serialized `http.request` into `rldp.query` and serialize it too:

```
694d798a                                                              -- TL ID rldp.query
184c01cb1a1e4dc9322e5cabe8aa2d2a0a4dd82011edaf59eb66f3d4d15b1c5c      -- query_id        = {random}
0004040000000000                                                      -- max_answer_size = 257 KB, can be any sufficient size that we accept as headers
258f9063                                                              -- timeout (unix)  = 1670418213
34 e191b161116505dac8a9a3cdb464f9b5dd9af78594f23f1c295099a9b50c8245   -- data (http.request)
   de4711940347455416687474703a2f2f666f756e646174696f6e2e746f6e2f00
   08485454502f312e310000000100000004486f73740000000e666f756e646174
   696f6e2e746f6e00 000000
```

### Encoding and sending packets

We now need to apply the FEC RaptorQ algorithm to our data.

First, we will create an encoder, which requires us to convert the resulting byte array into symbols of a fixed size. In this case, the symbol size is 768 bytes.

To achieve this, we'll divide the array into segments of 768 bytes each. If the last segment is smaller than 768 bytes, we will pad it with zero bytes to reach the required size.

Our current array is 156 bytes long, which means it will consist of only one segment. To make it 768 bytes, we need to add 612 zero bytes for padding.

Additionally, the constants chosen for the encoder depend on the data size and the symbol size. For more detailed information, you can refer to the RaptorQ documentation. However, to simplify the process and avoid complex mathematical calculations, we recommend using a pre-existing library that implements this encoding.

Please see the examples:

* [[Example of creating an encoder]](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/rldp/raptorq/encoder.go#L15)  
* [[Symbol encoding example]](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/raptorq/solver.go#L26)

Symbols are encoded and transmitted in a round-robin manner. We start with an initial sequence number, `seqno`, set to 0, and increment it by 1 for each subsequent encoded packet. For instance, if we have two symbols, we first encode and send the first symbol, then increase `seqno` by 1. Next, we encode and send the second symbol and again increase `seqno` by 1. After that, we return to the first symbol and increment `seqno` (which is now 2) by another 1.

This process continues until we receive a message indicating that the peer has accepted the data.

Having created the encoder, we are now ready to send data. To do this, we will fill in the TL schema:

```tlb
fec.raptorQ data_size:int symbol_size:int symbols_count:int = fec.Type;

rldp.messagePart transfer_id:int256 fec_type:fec.Type part:int total_size:long seqno:int data:bytes = rldp.MessagePart;
```

* `transfer_id` - random int256, the same for all messageParts within the same data transfer.
*  `fec_type` is `fec.raptorQ`.
   * `data_size` = 156
   * `symbol_size` = 768
   * `symbols_count` = 1
*  `part` in our case always 0, can be used for transfers that hit the size limit.
*  `total_size` = 156. The size of our transfer data.
*  `seqno` - for the first packet will be equal to 0, and for each subsequent packet it will increase by 1, will be used as parameter to decode and encode symbol.
*  `data` - our encoded symbol, 768 bytes in size.

After serializing `rldp.messagePart`, wrap it in `adnl.message.custom` and send it over ADNL UDP.

We will send packets in a continuous loop, incrementing the `seqno` each time, until we either receive the `rldp.complete` message from the peer or reach a timeout. Once we have sent a number of packets equal to the number of our symbols, we can slow down the transmission and send additional packets, for example, once every 10 milliseconds or even less frequently.

These extra packets are intended for recovery in case of data loss, as UDP is a fast but unreliable protocol.

[[Please see implementation example]](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/rldp.go#L249).

### Processing the response from `foundation.ton`

During the sending process, we can expect a response from the server. In our case, we are waiting for `rldp.answer` containing `http.response`.

The response will arrive in the same format as it was sent during the request, but the `transfer_id` will be inverted (each byte will undergo an `XOR` operation with `0xFF`).

We will receive `adnl.message.custom` messages that include `rldp.messagePart`.

First, we need to extract FEC information from the initial message received during the transfer. Specifically, we are looking for the `data_size`, `symbol_size`, and `symbols_count` parameters from the `fec.raptorQ` messagePart structure.

These parameters are essential for initializing the RaptorQ decoder. [[Please see the example]](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/rldp.go#L137).

After initialization, we add the received symbols along with their `seqno` to our decoder. Once we have gathered the minimum required number of symbols, equal to `symbols_count`, we can attempt to decode the full message. If successful, we will send `rldp.complete`. [[Please see the example]](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/rldp.go#L168).

The result will be a `rldp.answer` message containing the same `query_id` as in the sent `rldp.query`. The data must include `http.response`.

```tlb
http.response http_version:string status_code:int reason:string headers:(vector http.header) no_payload:Bool = http.Response;
```

The main fields are generally straightforward, as they function similarly to those in HTTP.

One notable flag is `no_payload`. If this flag is set to true, it indicates that there is no body in the response, meaning `Content-Length` is 0. In this case, the response from the server can be considered received.

If `no_payload` is false, this means there is content in the response, and we need to retrieve it. To do this, we should send a request using the TL schema `http.getNextPayloadPart`, which should be wrapped in `rldp.query`.

```tlb
http.getNextPayloadPart id:int256 seqno:int max_chunk_size:int = http.PayloadPart;
```

`id` must match the value sent in `http.request`, `seqno` should be 0, and increment by 1 for each subsequent part. The `max_chunk_size` indicates the largest chunk size we can accept, with a typical value of 128 KB (131072 bytes). 

In response, we will receive the following information:

```tlb
http.payloadPart data:bytes trailer:(vector http.header) last:Bool = http.PayloadPart;
```

If `last` is true, then we have reached the end. We can combine all the pieces to create a complete response body, such as HTML.

## References

Here is the [link to the original article](https://github.com/xssnick/ton-deep-doc/blob/master/RLDP.md) - _[Oleg Baranov](https://github.com/xssnick)._

<Feedback />

