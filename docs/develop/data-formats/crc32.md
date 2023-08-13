
# CRC32 

## Overview

CRC stands for Cyclic Redundancy Check, a commonly used method for verifying the integrity of digital data. It is an error-detecting algorithm used to check if errors have occurred in digital data during transmission or storage. A CRC generates a short checksum or hash of the data being transmitted or stored, which is appended to the data. When the data is received or retrieved, the CRC is recalculated and compared to the original checksum. If the two checksums match, it is assumed that the data has not been corrupted. If they do not match, it indicates that an error has occurred and the data needs to be resent or retrieved again

The CRC32 IEEE version used for TL-B schemes. By viewing this [NFT op code](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#tl-b-schema) example a clearer understanding of calculation TL-B for various messages is achieved.

## Tools

### Online calculator

* [Online calculator example](https://emn178.github.io/online-tools/crc32.html)
* [Tonwhales Introspection ID Generator](https://tonwhales.com/tools/introspection-id)

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
``` typescript
const POLYNOMIAL = -306674912;

let crc32_table: Int32Array | undefined = undefined;

##### Here is the main Funcion you can use #####
export function crc32(str: string, crc = 0xFFFFFFFF) {
    let bytes = Buffer.from(str);
    if (crc32_table === undefined) {
        calcTable();
    }
    for (let i = 0; i < bytes.length; ++i)
        crc = crc32_table![(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    return (crc ^ -1) >>> 0;
}

function calcTable() {
    crc32_table = new Int32Array(256);
    for (let i = 0; i < 256; i++) {
        let r = i;
        for (let bit = 8; bit > 0; --bit)
            r = ((r & 1) ? ((r >>> 1) ^ POLYNOMIAL) : (r >>> 1));
        crc32_table[i] = r;
    }
}
```
