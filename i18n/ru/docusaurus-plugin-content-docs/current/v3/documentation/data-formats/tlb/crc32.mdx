# CRC32

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Обзор

CRC означает Cyclic Redundancy Check (циклическая проверка избыточности), широко используемый метод проверки целостности цифровых данных. Это алгоритм обнаружения ошибок, используемый для проверки того, возникли ли ошибки в цифровых данных во время передачи или хранения. CRC генерирует короткую контрольную сумму или хэш передаваемых или сохраняемых данных, который добавляется к данным. Когда данные принимаются или извлекаются, CRC пересчитывается и сравнивается с исходной контрольной суммой. Если две контрольные суммы совпадают, предполагается, что данные не были повреждены. Если они не совпадают, это означает, что произошла ошибка и данные необходимо повторно отправить или извлечь заново

Версия CRC32 IEEE, используемая для схем TL-B. Просмотр этого примера [NFT op code](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#tl-b-schema) позволяет лучше понять расчет TL-B для различных сообщений.

## Инструменты

### Онлайн-калькулятор

- [Пример онлайн-калькулятора](https://emn178.github.io/online-tools/crc32.html)
- [Tonwhales Introspection ID Generator](https://tonwhales.com/tools/introspection-id)

### Расширение VS Code

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

