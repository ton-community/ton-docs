import Feedback from '@site/src/components/Feedback';

# TON 元数据解析

元数据标准涵盖了 NFT、NFT 集合和 Jettons，在 TON 增强提案 64 [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md) 中有所描述。

在 TON 上，实体可以有三种类型的元数据：链上、半链上和链下。

- **链上元数据：** 存储在区块链内部，包括名称、属性和图像。
- **链下元数据：** 使用链接存储到链外托管的元数据文件。
- **半链上元数据：** 两者之间的混合体，允许在区块链上存储小字段，如名称或属性，而将图像托管在链外，并仅存储指向它的链接。

## 蛇形数据编码

The Snake encoding format allows part of the data to be stored in a standardized cell, while the remaining portion is stored in a child cell recursively. The Snake encoding format must be prefixed using the 0x00 byte. The TL-B scheme:

```tlb
tail#_ {bn:#} b:(bits bn) = SnakeData ~0;
cons#_ {bn:#} {n:#} b:(bits bn) next:^(SnakeData ~n) = SnakeData ~(n + 1);
```

当单个cell无法存储的数据超过最大大小时，使用 蛇形格式存储额外数据。这是通过在根cell中存储部分数据，其余部分存储在第一个子cell中，并继续递归进行，直到所有数据都被存储。 It does this by placing part of the data in the root cell and the remaining portion in the first child cell, continuing recursively until all data is stored.

以下是 TypeScript 中 蛇形格式编码和解码的示例：

```typescript
export function makeSnakeCell(data: Buffer): Cell {
  const chunks = bufferToChunks(data, 127)

  if (chunks.length === 0) {
    return beginCell().endCell()
  }

  if (chunks.length === 1) {
    return beginCell().storeBuffer(chunks[0]).endCell()
  }

  let curCell = beginCell()

  for (let i = chunks.length - 1; i >= 0; i--) {
    const chunk = chunks[i]

    curCell.storeBuffer(chunk)

    if (i - 1 >= 0) {
      const nextCell = beginCell()
      nextCell.storeRef(curCell)
      curCell = nextCell
    }
  }

  return curCell.endCell()
}

export function flattenSnakeCell(cell: Cell): Buffer {
  let c: Cell | null = cell;

  const bitResult = new BitBuilder();
  while (c) {
    const cs = c.beginParse();
    if (cs.remainingBits === 0) {
      break;
    }

    const data = cs.loadBits(cs.remainingBits);
    bitResult.writeBits(data);
    c = c.refs && c.refs[0];
  }

  const endBits = bitResult.build();
  const reader = new BitReader(endBits);

  return reader.loadBuffer(reader.remaining / 8);
}
```

应该注意，使用 蛇形格式时在根cell中并不总是需要 `0x00` 字节前缀，就像链下 NFT 内容的情况一样。此外，cell中以字节而非位填充，以简化解析。为了避免在其父cell已经写入后再向下一个子cell添加引用的问题，snake cell是以反向顺序构造的。 Additionally, cells are filled with bytes instead of bits to simplify parsing. To prevent issues when adding a reference in a child cell after it has already been written to its parent cell, the Snake cell is constructed in reverse order.

## 分片编码

The chunked encoding format stores data using a dictionary structure, mapping a chunk_index to a chunk. Chunked encoding must be prefixed with the 0x01 byte. The TL-B scheme:

```tlb
chunked_data#_ data:(HashMapE 32 ^(SnakeData ~0)) = ChunkedData;
```

以下是使用 TypeScript 解码分片数据的示例：

```typescript
interface ChunkDictValue {
  content: Buffer;
}
export const ChunkDictValueSerializer = {
  serialize(src: ChunkDictValue, builder: Builder) {},
  parse(src: Slice): ChunkDictValue {
    const snake = flattenSnakeCell(src.loadRef());
    return { content: snake };
  },
};

export function ParseChunkDict(cell: Slice): Buffer {
  const dict = cell.loadDict(
    Dictionary.Keys.Uint(32),
    ChunkDictValueSerializer
  );

  let buf = Buffer.alloc(0);
  for (const [_, v] of dict) {
    buf = Buffer.concat([buf, v.content]);
  }
  return buf;
}
```

## NFT 元数据属性

| 属性            | 类型        | 要求 | 描述                                    |
| ------------- | --------- | -- | ------------------------------------- |
| `uri`         | ASCII 字符串 | 可选 | 指向由 "半链上内容布局" 使用的带有元数据的 JSON 文档的 URI。 |
| `name`        | UTF8 字符串  | 可选 | 标识资产。                                 |
| `description` | UTF8 字符串  | 可选 | 描述资产。                                 |
| `image`       | ASCII 字符串 | 可选 | 指向带有图像 mime 类型的资源的 URI。               |
| `image_data`  | 二进制\*     | 可选 | 链上布局的图像的二进制表示，或链外布局的 base64。          |

## Jetton 元数据属性

1. `uri` - Optional. Used by "Semi-chain content layout". ASCII string. `uri` - 可选。由 "半链上内容布局" 使用。ASCII 字符串。指向带有元数据的 JSON 文档的 URI。
2. `name` - Optional. UTF8 string. Identifies the asset.
3. `description` - Optional. UTF8 string. Describes the asset.
4. `image` - Optional. ASCII string. `image` - 可选。ASCII 字符串。指向带有图像 mime 类型的资源的 URI。
5. `image_data` - Optional. Either a binary representation of the image for onchain layout or base64 for offchain layout.
6. `symbol` - Optional. UTF8 string. The symbol of the token - e.g. "XMPL". Used in the form "You received 99 XMPL".
7. `decimals` - Optional. If not specified, 9 is used by default. UTF8 encoded string with number from 0 to 255. The number of decimals the token uses - e.g. 8, means that the token amount must be divided by 100000000 to get its custom representation.
8. `amount_style` - Optional. Necessary for external applications to understand the format of displaying the number of tokens.

- "n" - Displays the number of jettons as-is. For example, if a user has 100 tokens with 0 decimals, it displays "100 tokens".
- "n-of-total" - Displays the number of jettons relative to the total supply. "n" - jettons数量（默认值）。如果用户拥有 0 小数的 100 个代币，则显示用户拥有 100 个代币
- "%" - Displays jettons as a percentage of the total supply. "%" - 从总发行jettons数量中的百分比。例如，totalSupply Jetton = 1000。用户在jettons钱包中有 100 个jettons。例如，应该在用户的钱包中显示为 10%。

9. `render_type` - Optional. Required by external applications to understand which group a token belongs to and how to display it.

- "currency" - 作为代币显示（默认值）。
- "game" - 游戏显示。应该显示为 NFT，但同时显示jettons的数量，考虑到 `amount_style`。

| 属性             | 类型        | 要求 | 描述                                                                                                                                                                                                                                                                                                                                                                    |
| -------------- | --------- | -- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `uri`          | ASCII 字符串 | 可选 | 指向用于“半链上内容布局”的元数据的 JSON 文档的 URI。                                                                                                                                                                                                                                                                                                                                      |
| `name`         | UTF8 字符串  | 可选 | 标识资产。                                                                                                                                                                                                                                                                                                                                                                 |
| `description`  | UTF8 字符串  | 可选 | 描述资产。                                                                                                                                                                                                                                                                                                                                                                 |
| `image`        | ASCII 字符串 | 可选 | 指向资源的 URI，该资源具有图像的 mime 类型。                                                                                                                                                                                                                                                                                                                                           |
| `image_data`   | 二进制\*     | 可选 | 链上布局的图像的二进制表示，或链下布局的 base64。                                                                                                                                                                                                                                                                                                                                          |
| `symbol`       | UTF8 字符串  | 可选 | 代币的符号 - 例如 "XMPL"，使用形式 "您收到了 99 XMPL"。                                                                                                                                                                                                                                                                                                                                |
| `decimals`     | UTF8 字符串  | 可选 | The number of decimal places used by the token. If not specified, the default is 9. A UTF8-encoded string with numbers from 0 to 255. - for example, 8 means that the token amount must be divided by 100000000 to get its custom representation.                                                     |
| `amount_style` |           | 可选 | Required by external applications to understand the format of displaying the number of tokens. Defined using _n_, _n-of-total_, _%_.                                                                                                                                                                                                  |
| `render_type`  |           | 可选 | Needed by external applications to understand what group a token belongs to and how to display it. "currency" - displays as currency (default). "game" - display used for games, displays as NFT, but also displays the number of tokens and respects the amount_style value. |

> `amount_style` 参数:

- _n_ - number of jettons (default value). If the user has 100 tokens with 0 decimals, then it displays that the user has 100 tokens.
- _n-of-total_ - the number of jettons out of the total number of issued jettons. "n-of-total" - 总发行jettons数量中的jettons数量。例如，totalSupply Jetton = 1000。用户在jettons钱包中有 100 个jettons。例如，必须在用户的钱包中显示为 100 of 1000 或以任何其他文本或图形方式来表现从整体中的特定部分。
- _%_ - the percentage of jettons from the total number of jettons issued. For example, if the total number of tokens is 1000 and the user has 100 tokens, the percentage should be displayed as 10% of the user's wallet balance (100 ÷ 1000 = 0.1 or 10%).

> `render_type` 参数:

- _currency_ - 作为货币显示（默认值）。
- _game_ - 用于游戏的显示，显示为 NFT，但同时显示 jettons 的数量并考虑 `amount_style` 值。

## 解析元数据

在获得链上 NFT 数据后，必须对其进行解析。要执行此过程，必须通过读取构成 NFT 内部结构的第一个字节来确定 NFT 的内容类型。 要解析元数据，首先必须从区块链获取 NFT 数据。为了更好地理解这个过程，请考虑阅读我们的 TON 资产处理文档章节中的[获取 NFT 数据](/develop/dapps/asset-processing/nfts#getting-nft-data)部分。

After on-chain NFT data is retrieved, it must be parsed. To carry out this process, the NFT content type must be determined by reading the first byte that makes up the inner workings of the NFT.

### 链下

如果元数据字节字符串以 `0x01` 开始，它表示链外 NFT 内容类型。NFT 内容的其余部分使用Snake编码格式解码为 ASCII 字符串。在正确的 NFT URL 被实现，并且检索到 NFT 标识数据后，过程即完成。以下是使用链下 NFT 内容元数据解析的 URL 示例：
`https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/95/meta.json` The remaining portion of the NFT content is decoded using the Snake encoding format as an ASCII string. Once the NFT URL is obtained and the NFT identification data is retrieved, the process is complete. Here is an example of a URL using off-chain NFT content metadata parsing::
`https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/95/meta.json`

URL 内容（从上面直接引用）:

```json
{
   "name": "TON Smart Challenge #2 Winners Trophy",
   "description": "TON Smart Challenge #2 Winners Trophy 1 place out of 181",
   "image": "https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/images/943e994f91227c3fdbccbc6d8635bfaab256fbb4",
   "content_url": "https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/content/84f7f698b337de3bfd1bc4a8118cdfd8226bbadf",
   "attributes": []
}
```

### 链上和半链上

如果元数据字节字符串以 `0x00` 开始，它表示 NFT 使用链上或半链上格式。

The metadata is stored in a dictionary where the key is the SHA256 hash of the attribute name, and the value is the data stored using the Snake or Chunked format.

To determine the NFT type, a developer must read known NFT attributes such as `uri`, `name`, `image`, `description`, and `image_data`. If the `uri` field is present within the metadata, it indicates a semi-chain layout, requiring the off-chain content specified in uri to be downloaded and merged with the dictionary values.

Examples:

链上 NFT 的示例：[EQBq5z4N_GeJyBdvNh4tPjMpSkA08p8vWyiAX6LNbr3aLjI0](https://getgems.io/collection/EQAVGhk_3rUA3ypZAZ1SkVGZIaDt7UdvwA4jsSGRKRo-MRDN/EQBq5z4N_GeJyBdvNh4tPjMpSkA08p8vWyiAX6LNbr3aLjI0)

半链上 NFT 的示例： [EQB2NJFK0H5OxJTgyQbej0fy5zuicZAXk2vFZEDrqbQ_n5YW](https://getgems.io/nft/EQB2NJFK0H5OxJTgyQbej0fy5zuicZAXk2vFZEDrqbQ_n5YW)

链上 Jetton Master 的示例：[EQA4pCk0yK-JCwFD4Nl5ZE4pmlg4DkK-1Ou4HAUQ6RObZNMi](https://tonscan.org/jetton/EQA4pCk0yK-JCwFD4Nl5ZE4pmlg4DkK-1Ou4HAUQ6RObZNMi)

链上 NFT 解析器的示例：[stackblitz/ton-onchain-nft-parser](https://stackblitz.com/edit/ton-onchain-nft-parser?file=src%2Fmain.ts)

## NFT 元数据的重要说明

1. 对于 NFT 元数据，`name`、`description` 和 `image`（或 `image_data`）字段是显示 NFT 所必需的。
2. 对于 Jetton 元数据，`name`、`symbol`、`decimals` 和 `image`（或 `image_data`）是主要的。
3. 重要的是要意识到，任何人都可以使用任何 `name`、`description` 或 `image` 创建 NFT 或 Jetton。为避免混淆和潜在的骗局，用户应始终以一种清晰区分于其应用其他部分的方式显示他们的 NFT。恶意 NFT 和 Jettons 可以带有误导性或虚假信息被发送到用户的钱包。 To prevent scams and confusion, apps should clearly distinguish NFTs from other assets.
4. 一些项目可能有一个 `video` 字段，链接到与 NFT 或 Jetton 相关联的视频内容。

## 参考文献

- [TON 增强提案 64（TEP-64）](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md)

## 参阅

- [TON NFT 处理](/develop/dapps/asset-processing/nfts)
- [TON Jetton 处理](/develop/dapps/asset-processing/jettons)
- [首次打造你的 Jetton](/develop/dapps/tutorials/jetton-minter)

<Feedback />

