# CRC32

## 概述

CRC代表循环冗余检查，这是一种常用的方法，用于验证数字数据的完整性。它是一种用于检测在数据传输或存储过程中是否发生错误的算法。CRC生成一个数据的简短校验和或哈希，附加在数据上。当数据被接收或检索时，重新计算CRC并与原始校验和比较。如果两个校验和匹配，则假定数据未被损坏。如果它们不匹配，则表明发生了错误，需要重新发送或再次检索数据。

CRC32 IEEE版本用于TL-B方案。通过查看此[NFT操作码](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#tl-b-schema)示例，可以更清楚地理解各种消息的TL-B计算。

## 工具

### 在线计算器

- [在线计算器示例](https://emn178.github.io/online-tools/crc32.html)
- [Tonwhales Introspection ID 生成器](https://tonwhales.com/tools/introspection-id)

### VS Code扩展

- [crc32-opcode-helper](https://marketplace.visualstudio.com/items?itemName=Gusarich.crc32-opcode-helper)

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
