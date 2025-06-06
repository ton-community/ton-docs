import Feedback from '@site/src/components/Feedback';

# ADNL UDP - internode

ADNL over UDP is a low-level protocol used by nodes and TON components to communicate with one another. It serves as the foundation for other higher-level TON protocols, such as DHT (Distributed Hash Table) and RLDP (Reliable Large Datagram Protocol).

This article will explain how ADNL over UDP facilitates basic communication between nodes.

Unlike ADNL over TCP, the UDP implementation involves a different form of handshake and includes an additional layer in the form of channels. However, the underlying principles remain similar: encryption keys are generated based on our private key and the peer's public key, which is either known in advance from the configuration or received from other network nodes.

In the UDP version of ADNL, the connection is established simultaneously with the reception of initial data from the peer. If the initiator sends a **create channel** message, the channel’s key will be calculated, and the channel's creation will be confirmed.

Once the channel is established, further communication continues within it.

## Packet structure and communication

### First packets

Let's analyze the connection initialization with the DHT node and obtain a signed list of its addresses to understand how the protocol functions. 

Find a node you prefer in the [global config](https://ton-blockchain.github.io/global.config.json), specifically in the `dht.nodes` section.  For example:

```json
{
  "@type": "dht.node",
  "id": {
    "@type": "pub.ed25519",
    "key": "fZnkoIAxrTd4xeBgVpZFRm5SvVvSx7eN3Vbe8c83YMk="
  },
  "addr_list": {
    "@type": "adnl.addressList",
    "addrs": [
      {
        "@type": "adnl.address.udp",
        "ip": 1091897261,
        "port": 15813
      }
    ],
    "version": 0,
    "reinit_date": 0,
    "priority": 0,
    "expire_at": 0
  },
  "version": -1,
  "signature": "cmaMrV/9wuaHOOyXYjoxBnckJktJqrQZ2i+YaY3ehIyiL3LkW81OQ91vm8zzsx1kwwadGZNzgq4hI4PCB/U5Dw=="
}
```

Let's take the ed25519 key, `fZnkoIAxrTd4xeBgVpZFRm5SvVvSx7eN3Vbe8c83YMk`, and decode it from base64.

Next, we will take its IP address, 1091897261, and convert it into a readable format using [this service](https://www.browserling.com/tools/dec-to-ip) or by converting it to little-endian bytes. This will give us the IP address `65.21.7.173`.

Finally, we will combine this IP address with the port to obtain `65.21.7.173:15813` and establish a UDP connection.

We aim to establish a communication channel with the node to obtain specific information, particularly a list of signed addresses. To achieve this, we will generate two messages. The first message will be to create the channel [(see the code)](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L129):

```tlb
adnl.message.createChannel key:int256 date:int = adnl.Message
```

We have two parameters to consider: a key and a date. The date will be represented by the current Unix timestamp. For the key, we need to generate a new ed25519 private and public key pair specifically for the channel. This key pair will be used to initialize the public encryption key, as outlined in the [link here](/v3/documentation/network/protocols/adnl/adnl-tcp#getting-a-shared-key-using-ecdh). We will use the generated public key as the value for the `key` parameter in the message, while we will store the private key for future use.

Next, we will serialize the populated TL structure to get the final result:

```
bbc373e6                                                         -- TL ID adnl.message.createChannel 
d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7 -- key
555c8763                                                         -- date
```

Next, let's proceed to our main query - [retrieve a list of addresses](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L198). 

To execute it, we first need to serialize its TL structure:

```tlb
dht.getSignedAddressList = dht.Node
```

There are no parameters to consider, so we will simply serialize it. The result will be just its ID: `ed4879a9`.

Next, since this is a higher-level request within the DHT protocol, we must first wrap it in an `adnl.message.query` TL structure:

```tlb
adnl.message.query query_id:int256 query:bytes = adnl.Message
```

We generate a random 32 bytes for `query_id`, and the `query` represents our main request, [wrapped as an array of bytes](/v3/documentation/data-formats/tl#encoding-bytes-array):

```
7af98bb4                                                         -- TL ID adnl.message.query
d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875 -- query_id
04 ed4879a9 000000                                               -- query
```

### Building the packet

All communication is conducted using packets, which contain the following structure: [TL structure](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L81):

```tlb
adnl.packetContents 
  rand1:bytes                                     -- random 7 or 15 bytes
  flags:#                                         -- bit flags, used to determine the presence of fields further
  from:flags.0?PublicKey                          -- sender's public key
  from_short:flags.1?adnl.id.short                -- sender's ID
  message:flags.2?adnl.Message                    -- message (used if there is only one message)
  messages:flags.3?(vector adnl.Message)          -- messages (if there are > 1)
  address:flags.4?adnl.addressList                -- list of our addresses
  priority_address:flags.5?adnl.addressList       -- priority list of our addresses
  seqno:flags.6?long                              -- packet sequence number
  confirm_seqno:flags.7?long                      -- sequence number of the last packet received
  recv_addr_list_version:flags.8?int              -- address version 
  recv_priority_addr_list_version:flags.9?int     -- priority address version
  reinit_date:flags.10?int                        -- connection reinitialization date (counter reset)
  dst_reinit_date:flags.10?int                    -- connection reinitialization date from the last received packet
  signature:flags.11?bytes                        -- signature
  rand2:bytes                                     -- random 7 or 15 bytes
        = adnl.PacketContents
        
```

Once we have serialized all the messages we wish to send, we can begin building the packet.

Packets sent to a channel have a different content structure compared to packets sent before the channel is initialized.

First, let’s examine the main packet used for initialization.

During the initial data exchange, before the channel is established, the packet's serialized content structure is prefixed with the peer's public key, which is 32 bytes.

Our public key is also 32 bytes, and the SHA-256 hash of the serialized TL of the packet's content structure is another 32 bytes.

The content of the packet is encrypted using the [shared key](/v3/documentation/network/protocols/adnl/adnl-tcp#getting-a-shared-key-using-ecdh), which is derived from our private key and the public key of the server.

Let's serialize the structure of our packet content and parse it byte by byte:

```
89cd42d1                                                               -- TL ID adnl.packetContents
0f 4e0e7dd6d0c5646c204573bc47e567                                      -- rand1, 15 (0f) random bytes
d9050000                                                               -- flags (0x05d9) -> 0b0000010111011001
                                                                       -- from (present because flag's zero bit = 1)
c6b41348                                                                  -- TL ID pub.ed25519
   afc46336dd352049b366c7fd3fc1b143a518f0d02d9faef896cb0155488915d6       -- key:int256
                                                                       -- messages (present because flag's third bit = 1)
02000000                                                                  -- vector adnl.Message, size = 2 messages   
   bbc373e6                                                                  -- TL ID adnl.message.createChannel
   d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7          -- key
   555c8763                                                                  -- date (date of creation)
   
   7af98bb4                                                                  -- TL ID [adnl.message.query](/)
   d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875          -- query_id
   04 ed4879a9 000000                                                        -- query (bytes size 4, padding 3)
                                                                       -- address (present because flag's fourth bit = 1), without TL ID since it is specified explicitly
00000000                                                                  -- addrs (empty vector, because we are in client mode and do not have an address on wiretap)
555c8763                                                                  -- version (usually initialization date)
555c8763                                                                  -- reinit_date (usually initialization date)
00000000                                                                  -- priority
00000000                                                                  -- expire_at

0100000000000000                                                       -- seqno (present because flag's sixth bit = 1)
0000000000000000                                                       -- confirm_seqno (present because flag's seventh bit = 1)
555c8763                                                               -- recv_addr_list_version (present because flag's eighth bit = 1, usually initialization date)
555c8763                                                               -- reinit_date (present because flag's tenth bit = 1, usually initialization date)
00000000                                                               -- dst_reinit_date (present because flag's tenth bit = 1)
0f 2b6a8c0509f85da9f3c7e11c86ba22                                      -- rand2, 15 (0f) random bytes
```

After serialization, we need to sign the resulting byte array using our private client's key, specifically ed25519, which we generated and saved earlier. 

Once we have created the signature (which is 64 bytes in size), we must add it to the packet and serialize it again. This time, we will also set the 11th bit in the flag to indicate the presence of the signature:

```
89cd42d1                                                               -- TL ID adnl.packetContents
0f 4e0e7dd6d0c5646c204573bc47e567                                      -- rand1, 15 (0f) random bytes
d90d0000                                                               -- flags (0x0dd9) -> 0b0000110111011001
                                                                       -- from (present because flag's zero bit = 1)
c6b41348                                                                  -- TL ID pub.ed25519
   afc46336dd352049b366c7fd3fc1b143a518f0d02d9faef896cb0155488915d6       -- key:int256
                                                                       -- messages (present because flag's third bit = 1)
02000000                                                                  -- vector adnl.Message, size = 2 message   
   bbc373e6                                                                  -- TL ID adnl.message.createChannel
   d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7          -- key
   555c8763                                                                  -- date (date of creation)
   
   7af98bb4                                                                  -- TL ID adnl.message.query
   d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875          -- query_id
   04 ed4879a9 000000                                                        -- query (bytes size 4, padding 3)
                                                                       -- address (present because flag's fourth bit = 1), without TL ID since it is specified explicitly
00000000                                                                  -- addrs (empty vector, because we are in client mode and do not have an address on wiretap)
555c8763                                                                  -- version (usually initialization date)
555c8763                                                                  -- reinit_date (usually initialization date)
00000000                                                                  -- priority
00000000                                                                  -- expire_at

0100000000000000                                                       -- seqno (present because flag's sixth bit = 1)
0000000000000000                                                       -- confirm_seqno (present because flag's seventh bit = 1)
555c8763                                                               -- recv_addr_list_version (present because flag's eighth bit = 1, usually initialization date)
555c8763                                                               -- reinit_date (present because flag's tenth bit = 1, usually initialization date)
00000000                                                               -- dst_reinit_date (present because flag's tenth bit = 1)
40 b453fbcbd8e884586b464290fe07475ee0da9df0b8d191e41e44f8f42a63a710    -- signature (present because flag's eleventh bit = 1), (bytes size 64, padding 3)
   341eefe8ffdc56de73db50a25989816dda17a4ac6c2f72f49804a97ff41df502    --
   000000                                                              --
0f 2b6a8c0509f85da9f3c7e11c86ba22                                      -- rand2, 15 (0f) random bytes
```

We now have an assembled, signed, and serialized packet, which consists of an array of bytes.

Next, we need to calculate the packet's SHA-256 hash, allowing the recipient to verify its integrity later. For instance, let’s say the hash is `408a2a4ed623b25a2e2ba8bbe92d01a3b5dbd22c97525092ac3203ce4044dcd2`.

Now, we will encrypt the contents of our packet using the AES-CTR cipher, utilizing the [shared key](/v3/documentation/network/protocols/adnl/adnl-tcp#getting-a-shared-key-using-ecdh) that is derived from our private key and the peer’s public key (not the channel's key).

We are almost ready to send the packet; we just need to [calculate the ID](/v3/documentation/network/protocols/adnl/adnl-tcp#getting-key-id) of the ed25519 peer key and concatenate everything together:


```
daa76538d99c79ea097a67086ec05acca12d1fefdbc9c96a76ab5a12e66c7ebb  -- server Key ID
afc46336dd352049b366c7fd3fc1b143a518f0d02d9faef896cb0155488915d6  -- our public key
408a2a4ed623b25a2e2ba8bbe92d01a3b5dbd22c97525092ac3203ce4044dcd2  -- sha256 content hash (before encryption)
...                                                               -- encrypted content of the packet
```

We can now send our constructed packet to the peer via UDP and await a response. 

In response, we will receive a packet with a similar structure, but containing different messages. It will consist of:

```
68426d4906bafbd5fe25baf9e0608cf24fffa7eca0aece70765d64f61f82f005  -- ID of our key
2d11e4a08031ad3778c5e060569645466e52bd1bd2c7b78ddd56def1cf3760c9  -- server public key, for shared key
f32fa6286d8ae61c0588b5a03873a220a3163cad2293a5dace5f03f06681e88a  -- sha256 content hash (before encryption)
...                                                               -- the encrypted content of the packet
```

The process of deserializing the packet from the server is as follows:

* We first check the ID of the key within the packet to confirm that the packet is intended for us.
* Using the server's public key found in the packet along with our private key, we calculate a shared key to decrypt the packet's content.
* We then compare the SHA-256 hash provided to us with the hash obtained from the decrypted data; they must match.
* Finally, we begin deserializing the packet content using the `adnl.packetContents` TL schema.

The content of the packet will look like this:

```
89cd42d1                                                               -- TL ID adnl.packetContents
0f 985558683d58c9847b4013ec93ea28                                      -- rand1, 15 (0f) random bytes
ca0d0000                                                               -- flags (0x0dca) -> 0b0000110111001010
daa76538d99c79ea097a67086ec05acca12d1fefdbc9c96a76ab5a12e66c7ebb       -- from_short (because flag's first bit = 1)
02000000                                                               -- messages (present because flag's third bit = 1)
   691ddd60                                                               -- TL ID adnl.message.confirmChannel 
   db19d5f297b2b0d76ef79be91ad3ae01d8d9f80fab8981d8ed0c9d67b92be4e3       -- key (server channel public key)
   d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7       -- peer_key (our public channel key)
   94848863                                                               -- date
   
   1684ac0f                                                               -- TL ID adnl.message.answer 
   d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875       -- query_id
   90 48325384c6b413487d99e4a08031ad3778c5e060569645466e52bd5bd2c7b       -- answer (the answer to our request, we will analyze its content in an article about DHT)
      78ddd56def1cf3760c901000000e7a60d67ad071541c53d0000ee354563ee       --
      35456300000000000000009484886340d46cc50450661a205ad47bacd318c       --
      65c8fd8e8f797a87884c1bad09a11c36669babb88f75eb83781c6957bc976       --
      6a234f65b9f6e7cc9b53500fbe2c44f3b3790f000000                        --
      000000                                                              --
0100000000000000                                                       -- seqno (present because flag's sixth bit = 1)
0100000000000000                                                       -- confirm_seqno (present because flag's seventh bit = 1)
94848863                                                               -- recv_addr_list_version (present because flag's eighth bit = 1, usually initialization date)
ee354563                                                               -- reinit_date (present because flag's tenth bit = 1, usually initialization date)
94848863                                                               -- dst_reinit_date (present because flag's tenth bit = 1)
40 5c26a2a05e584e9d20d11fb17538692137d1f7c0a1a3c97e609ee853ea9360ab6   -- signature (present because flag's eleventh bit = 1), (bytes size 64, padding 3)
   d84263630fe02dfd41efb5cd965ce6496ac57f0e51281ab0fdce06e809c7901     --
   000000                                                              --
0f c3354d35749ffd088411599101deb2                                      -- rand2, 15 (0f) random bytes
```

The server responded with two messages: `adnl.message.confirmChannel` and `adnl.message.answer`.

The `adnl.message.answer` is straightforward; it is the response to our request for `dht.getSignedAddressList`, which we will explore further in the article about DHT.

Now, let’s focus on `adnl.message.confirmChannel`. This indicates that the peer has confirmed the creation of the channel and has sent us its public channel key. With our private channel key and the peer's public channel key, we can compute the [shared key](/v3/documentation/network/protocols/adnl/adnl-tcp#getting-a-shared-key-using-ecdh).

Once we have calculated the shared channel key, we need to derive two keys from it: one for encrypting outgoing messages and another for decrypting incoming messages.

Deriving these two keys is quite simple. The second key is simply the shared key written in reverse order. For example:

```
Shared key : AABB2233

First key: AABB2233
Second key: 3322BBAA
```

We need to determine which key to use for specific purposes. To do this, we can compare the ID of our public key with the ID of the server's public key, converting both to a numerical format (uint256). 

This method ensures that both the server and the client agree on which key is used for what function. If the server uses the first key for encryption, this approach guarantees that the client will always use it for decryption. 

The terms of use are:

```
The server id is smaller than our id:
Encryption: First Key
Decryption: Second Key

The server id is larger than our id:
Encryption: Second Key
Decryption: First Key

If the ids are equal (nearly impossible):
Encryption: First Key
Decryption: First Key
```

[[Please see implementation example]](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/adnl.go#L502).

### Communication in a channel

All future packet exchanges will take place within the channel, and the channel keys will be utilized for encryption.

Let's send the same `dht.getSignedAddressList` request within a newly created channel to observe the differences.

We will construct the packet for the channel using the same `adnl.packetContents` structure:

```
89cd42d1                                                               -- TL ID adnl.packetContents
0f c1fbe8c4ab8f8e733de83abac17915                                      -- rand1, 15 (0f) random bytes
c4000000                                                               -- flags (0x00c4) -> 0b0000000011000100
                                                                       -- message (because second bit = 1)
7af98bb4                                                                  -- TL ID adnl.message.query
fe3c0f39a89917b7f393533d1d06b605b673ffae8bbfab210150fe9d29083c35          -- query_id
04 ed4879a9 000000                                                        -- query (our dht.getSignedAddressList packed in bytes with padding 3)
0200000000000000                                                       -- seqno (because flag's sixth bit = 1), 2 because it is our second message
0100000000000000                                                       -- confirm_seqno (flag's seventh bit = 1), 1 because it is the last seqno received from the server
07 e4092842a8ae18                                                      -- rand2, 7 (07) random bytes
```

The packets in a channel are quite straightforward and essentially consist of a sequence number (seqno) and the messages themselves. 

After serialization, as we did last time, we calculate the SHA256 hash of the packet. Next, we encrypt the packet using the designated key for outgoing packets in the channel.

To do this we [calculate](/v3/documentation/network/protocols/adnl/adnl-tcp#getting-key-id) `pub.aes` - ID of the encryption key for our outgoing messages and then build our packet:

```
bcd1cf47b9e657200ba21d94b822052cf553a548f51f539423c8139a83162180 -- ID of encryption key of our outgoing messages 
6185385aeee5faae7992eb350f26ba253e8c7c5fa1e3e1879d9a0666b9bd6080 -- sha256 content hash (before encryption)
...                                                              -- the encrypted content of the packet
```

We send a packet via UDP and wait for a response. In response, we receive a packet of the same type as the one we sent, containing the answer to our request for `dht.getSignedAddressList`.

## Other message types

For basic communication, messages such as `adnl.message.query` and `adnl.message.answer` are utilized, which we discussed earlier. However, there are also other types of messages used for specific situations, which we will cover in this section.

### adnl.message.part

This message type is part of another possible message type, such as `adnl.message.answer`. This method of data transfer is used when a message is too large to be sent in a single UDP datagram.

```tlb
adnl.message.part 
hash:int256            -- sha256 hash of the original message
total_size:int         -- original message size
offset:int             -- offset according to the beginning of the original message
data:bytes             -- piece of data of the original message
   = adnl.Message;
```

To reconstruct the original message, we need to gather several parts and concatenate them into a single-byte array based on the specified offsets.

 We will then process this array as a message using the ID prefix contained within it.
  

### adnl.message.custom

```tlb
adnl.message.custom data:bytes = adnl.Message;
```

Messages of this type are utilized when the logic at a higher level does not align with the typical request-response format. These messages allow for the complete relocation of processing to a higher level, as they consist solely of an array of bytes without including query IDs or other fields.

For instance, in RLDP, such messages are used since there can be only one response to multiple requests. RLDP itself manages this logic.

Further communication occurs based on the logic outlined in this article, though the content of the packets relies on higher-level protocols like DHT and RLDP.

## References

Here is the [link to the original article](https://github.com/xssnick/ton-deep-doc/blob/master/ADNL-UDP-Internal.md) - _[Oleg Baranov](https://github.com/xssnick)._
<Feedback />

