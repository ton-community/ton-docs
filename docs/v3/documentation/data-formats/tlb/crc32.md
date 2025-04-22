import Feedback from '@site/src/components/Feedback';

# CRC32 

## Overview

CRC stands for **Cyclic Redundancy Check**, a widely used method for verifying the integrity of digital data. An error-detecting algorithm checks whether data has been altered during transmission or storage. CRC generates a short checksum or hash from the original data, which is appended to it. The checksum is recalculated and compared with the original upon retrieval or receipt. If the values match, the data is considered intact; if not, it indicates corruption and the data must be resent or recovered.

The CRC32 IEEE variant is used in TL-B schemes. You can refer to this [NFT op code](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#tl-b-schema)example to better understand how CRC32 values are calculated for various TL-B messages.

## Tools

### Online calculator

* [Online calculator example](https://emn178.github.io/online-tools/crc32.html)
* [Tonwhales introspection ID generator](https://tonwhales.com/tools/introspection-id)

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


<Feedback />

