
# CRC32 

## Overview

CRC stands for Cyclic Redundancy Check, a commonly used method for verifying the integrity of digital data. It is an error-detecting algorithm used to check if errors have occurred in digital data during transmission or storage. A CRC generates a short checksum or hash of the data being transmitted or stored, which is appended to the data. When the data is received or retrieved, the CRC is recalculated and compared to the original checksum. If the two checksums match, it is assumed that the data has not been corrupted. If they do not match, it indicates that an error has occurred and the data needs to be resent or retrieved again

The CRC32 IEEE version used for TL-B schemes. By viewing this [NFT op code](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#tl-b-schema) example a clearer understanding of calculation TL-B for various messages is achieved.

## Tools

### Online calculator

* [Online calculator example](https://emn178.github.io/online-tools/crc32.html)
* [Tonwhales Introspection ID Generator](https://tonwhales.com/tools/introspection-id)

### VS Code extension

* [crc32-opcode-helper](https://marketplace.visualstudio.com/items?itemName=Gusarich.crc32-opcode-helper)

### Python

```python
import zlib
print(zlib.crc32(b'<TL-B>') & 0x7FFFFFFF)
```

### Go

```python
func main() {

	var schema = "some"

	schema = strings.ReplaceAll(schema, "(", "")
	schema = strings.ReplaceAll(schema, ")", "")
	data := []byte(schema)
	var crc = crc32.Checksum(data, crc32.MakeTable(crc32.IEEE))

	var b_data = make([]byte, 4)
	binary.BigEndian.PutUint32(b_data, crc)
	var res = hex.EncodeToString(b_data)
	fmt.Println(res)
}
```

### TypeScript
```typescript
import * as crc32 from 'crc-32';

function calculateRequestOpcode_1(str: string): string {
    return (BigInt(crc32.str(str)) & BigInt(0x7fffffff)).toString(16);
}

function calculateResponseOpcode_2(str: string): string {
    const a = BigInt(crc32.str(str));
    const b = BigInt(0x80000000);
    return ((a | b) < 0 ? (a | b) + BigInt('4294967296') : a | b).toString(16);
}
```

