
# CRC32 

## Overview

A cyclic redundancy check (CRC) is an error-detecting algorithm commonly used in digital networks and storage devices to detect accidental changes to digital data. Blocks of data entering these systems are typically attached with a short check value based on the remainder of a polynomial division of their contents.

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

