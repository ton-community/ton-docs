import Feedback from '@site/src/components/Feedback';

# TL
TL (Type Language) is a language used to describe data structures.

[TL schemas](https://github.com/ton-blockchain/ton/tree/master/tl/generate/scheme) are used to structure data when communicating. 

TL operates on 32-bit blocks, meaning the data size in TL must always be a multiple of 4 bytes. If the object's size is not a multiple of 4, zero padding must be added to make it align with a 4-byte boundary.

Numbers are always encoded in Little Endian order.

For more details on TL, refer to the [Telegram documentation](https://core.telegram.org/mtproto/TL).


## Encoding bytes array
To encode a byte array, we first determine its size. If the array is less than 254 bytes, the size is encoded using a single byte. If the array size exceeds 254 bytes, the first byte is set to `0xFE` to indicate an oversized array, followed by a 3-byte size field.

For example, to encode the array `[0xAA, 0xBB]` with size 2, we use 1 byte for the size, followed by the data itself, resulting in `[0x02, 0xAA, 0xBB]`. However, the total size is 3 bytes, which is not a multiple of 4. Therefore, we add 1 byte of padding to align it to 4 bytes, resulting in `[0x02, 0xAA, 0xBB, 0x00]`.

If we need to encode an array with a size of, for example, 396 bytes, we use 3 bytes for the size encoding and 1 byte for the oversize indicator. The encoding would be: `[0xFE, 0x8C, 0x01, 0x00, array bytes]`. The total size becomes `396+4 = 400` bytes, a multiple of 4, so no additional alignment is needed.

## Non-obvious serialization rules

A 4-byte prefix is often added before the schema itself—its ID. The schema ID is a CRC32 hash derived from the schema text using an IEEE table, with symbols like `;` and `()` removed beforehand. The serialization of a schema with an ID prefix is called **boxed**, which enables the parser to determine which schema is being used when multiple options exist.

If a schema is part of another schema, the decision to serialize it with or without a prefix depends on the specified field type. The schema is serialized without a prefix if the type is explicitly defined. If the type is not explicitly defined (which applies to many types), the schema should be serialized with the ID prefix (boxed). For example:

```tlb
pub.unenc data:bytes = PublicKey;
pub.ed25519 key:int256 = PublicKey;
pub.aes key:int256 = PublicKey;
pub.overlay name:bytes = PublicKey;
```

Consider the following scenario: if `PublicKey` is specified within the schema like this:

```
adnl.node id:PublicKey addr_list:adnl.addressList = adnl.Node;
```

Since the type is not explicitly defined, it needs to be serialized with an ID prefix (boxed). However, if the schema is specified as follows:

```
adnl.node id:pub.ed25519 addr_list:adnl.addressList = adnl.Node;
```

The type is explicitly specified, so the prefix is not needed.

## Reference

[Link to the original article](https://github.com/xssnick/ton-deep-doc/blob/master/TL.md) - _[Oleg Baranov](https://github.com/xssnick)_.
<Feedback />

