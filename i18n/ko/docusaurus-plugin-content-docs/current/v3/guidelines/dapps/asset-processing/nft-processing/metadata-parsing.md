import Feedback from '@site/src/components/Feedback';

# Metadata parsing

The metadata standard covering NFTs, NFT collections, and jettons, is outlined in TON Enhancement Proposal 64 [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md).

TON에서 엔티티는 세 가지 유형의 메타데이터를 가질 수 있습니다: 온체인, 세미체인, 오프체인.

- **온체인 메타데이터:** 블록체인 내에 저장되며 이름, 속성, 이미지 등을 포함합니다.
- **Off-chain metadata:** stored using a link to a metadata file hosted outside the chain.
- **Semi-chain metadata:** a hybrid approach that allows storing small fields such as names or attributes on the blockchain while hosting the image off-chain and storing only a link to it.

## Snake data encoding

The Snake encoding format allows part of the data to be stored in a standardized cell, while the remaining portion is stored in a child cell recursively. The Snake encoding format must be prefixed using the 0x00 byte. The TL-B scheme:

```tlb
tail#_ {bn:#} b:(bits bn) = SnakeData ~0;
cons#_ {bn:#} {n:#} b:(bits bn) next:^(SnakeData ~n) = SnakeData ~(n + 1);
```

The Snake format stores additional data in a cell when the data exceeds the maximum size that a single cell can store. It does this by placing part of the data in the root cell and the remaining portion in the first child cell, continuing recursively until all data is stored.

아래는 TypeScript로 작성된 Snake 형식 인코딩 및 디코딩의 예시입니다:

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

The 0x00 byte prefix is not always required in the root cell when using the Snake format, such as with off-chain NFT content. Additionally, cells are filled with bytes instead of bits to simplify parsing. To prevent issues when adding a reference in a child cell after it has already been written to its parent cell, the Snake cell is constructed in reverse order.

## Chunked encoding

The chunked encoding format stores data using a dictionary structure, mapping a chunk_index to a chunk. Chunked encoding must be prefixed with the 0x01 byte. The TL-B scheme:

```tlb
chunked_data#_ data:(HashMapE 32 ^(SnakeData ~0)) = ChunkedData;
```

Below is an example of chunked data decoding in TypeScript:

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

## NFT 메타데이터 속성

| 속성            | 유형        | 요구 사항 | 설명                                                                                                                      |
| ------------- | --------- | ----- | ----------------------------------------------------------------------------------------------------------------------- |
| `uri`         | ASCII 문자열 | 선택 사항 | A URI pointing to the JSON document with metadata used by the "Semi-chain content layout."              |
| `name`        | UTF8 문자열  | 선택 사항 | Identifies the asset.                                                                                   |
| `description` | UTF8 문자열  | 선택 사항 | Describes the asset.                                                                                    |
| `image`       | ASCII 문자열 | 선택 사항 | A URI pointing to a resource with a MIME type image.                                                    |
| `image_data`  | binary\*  | 선택 사항 | Either a binary representation of the image for the on-chain layout or base64 for the off-chain layout. |

## Jetton 메타데이터 속성

1. `uri` - 선택 사항. "세미체인 콘텐츠 레이아웃"에서 사용됩니다. ASCII string. ASCII 문자열로, 메타데이터가 포함된 JSON 문서로의 URI를 가리킵니다.
2. `name` - 선택 사항. UTF8 문자열. 자산을 식별합니다.
3. `description` - 선택 사항. UTF8 문자열. 자산에 대해 설명합니다.
4. `image` - Optional. ASCII string. A URI pointing to a resource with a mime type image.
5. `image_data` - Optional. Either a binary representation of the image for onchain layout or base64 for offchain layout.
6. `symbol` - 선택 사항. UTF8 문자열. 토큰의 심볼, 예: "XMPL". "You received 99 XMPL" 형식으로 사용됩니다.
7. `decimals` - Optional. If not specified, 9 is used by default. UTF8 encoded string with number from 0 to 255. The number of decimals the token uses - e.g. 8, means that the token amount must be divided by 100000000 to get its custom representation.
8. `amount_style` - Optional. Necessary for external applications to understand the format of displaying the number of tokens.

- "n" - Displays the number of jettons as-is. For example, if a user has 100 tokens with 0 decimals, it displays "100 tokens".
- "n-of-total" - Displays the number of jettons relative to the total supply. If totalSupply = 1000 and a user holds 100 jettons, it is displayed as "100 of 1000".
- "%" - Displays jettons as a percentage of the total supply. If totalSupply = 1000 and a user holds 100 jettons, it is displayed as "10%".

9. `render_type` - Optional. Required by external applications to understand which group a token belongs to and how to display it.

- "currency" - Displays as a currency (default value).
- "game" - Displays as an NFT while also considering the `amount_style`.

| 속성             | 유형        | 요구 사항 | 설명                                                                                                                                                                                                                                                                                                                                                                    |
| -------------- | --------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `uri`          | ASCII 문자열 | 선택 사항 | A URI pointing to the JSON document with metadata used by the "Semi-chain content layout."                                                                                                                                                                                                                                                            |
| `name`         | UTF8 문자열  | 선택 사항 | Identifies the asset                                                                                                                                                                                                                                                                                                                                                  |
| `description`  | UTF8 문자열  | 선택 사항 | Describes the asset                                                                                                                                                                                                                                                                                                                                                   |
| `image`        | ASCII 문자열 | 선택 사항 | A URI pointing to a resource with a mime type image                                                                                                                                                                                                                                                                                                                   |
| `image_data`   | binary\*  | 선택 사항 | Either a binary representation of the image of an on-chain layout or base64 for off-chain layout                                                                                                                                                                                                                                                                      |
| `symbol`       | UTF8 문자열  | 선택 사항 | Token symbol - for example, "XMPL" and uses the form "You have received 99 XMPL"                                                                                                                                                                                                                                                                                      |
| `decimals`     | UTF8 문자열  | 선택 사항 | The number of decimal places used by the token. If not specified, the default is 9. A UTF8-encoded string with numbers from 0 to 255. - for example, 8 means that the token amount must be divided by 100000000 to get its custom representation.                                                     |
| `amount_style` |           | 선택 사항 | Required by external applications to understand the format of displaying the number of tokens. Defined using _n_, _n-of-total_, _%_.                                                                                                                                                                                                  |
| `render_type`  |           | 선택 사항 | Needed by external applications to understand what group a token belongs to and how to display it. "currency" - displays as currency (default). "game" - display used for games, displays as NFT, but also displays the number of tokens and respects the amount_style value. |

> `amount_style` 매개변수:

- _n_ - Jetton 수 (기본값). 사용자가 소수점 이하 자릿수 0인 100개의 토큰을 보유하고 있으면 100개의 토큰이 있는 것으로 표시됩니다.
- _n-of-total_ - the number of jettons out of the total number of issued jettons. For example, if the totalSupply of jettons is 1000 and the user has 100 jettons in their wallet, it must be displayed in the user's wallet as 100 of 1000 or in another textual or graphical way to demonstrate the ratio of user tokens to the total amount of tokens available.
- _%_ - the percentage of jettons from the total number of jettons issued. For example, if the total number of tokens is 1000 and the user has 100 tokens, the percentage should be displayed as 10% of the user's wallet balance (100 ÷ 1000 = 0.1 or 10%).

> `render_type` 매개변수:

- _currency_ - 통화로 표시 (기본값).
- _game_ - display used for games that appears as an NFT but also displays the number of tokens and takes into account the `amount_style` value.

## Parsing metadata

To parse metadata, NFT data must first be obtained from the blockchain. To better understand this process, consider reading the [retrieving NFT data](/v3/guidelines/dapps/asset-processing/nft-processing/nfts#retrieving-nft-data) section of our TON asset processing documentation section.

온체인 NFT 데이터를 가져온 후에는 이를 파싱해야 합니다. 이 과정은 NFT의 내부 작동을 구성하는 첫 번째 바이트를 읽어 NFT 콘텐츠 유형을 결정하는 것으로 시작합니다.

### Off-chain

f the metadata byte string starts with 0x01, it signifies off-chain NFT content. The remaining portion of the NFT content is decoded using the Snake encoding format as an ASCII string. Once the NFT URL is obtained and the NFT identification data is retrieved, the process is complete. Here is an example of a URL using off-chain NFT content metadata parsing::
`https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/95/meta.json`

URL 내용 (위에서 가져옴):

```json
{
   "name": "TON Smart Challenge #2 Winners Trophy",
   "description": "TON Smart Challenge #2 Winners Trophy 1 place out of 181",
   "image": "https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/images/943e994f91227c3fdbccbc6d8635bfaab256fbb4",
   "content_url": "https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/content/84f7f698b337de3bfd1bc4a8118cdfd8226bbadf",
   "attributes": []
}
```

### On-chain and semi-chain

If the metadata byte string starts with `0x00`, it indicates on-chain or semi-chain NFT metadata.

The metadata is stored in a dictionary where the key is the SHA256 hash of the attribute name, and the value is the data stored using the Snake or Chunked format.

To determine the NFT type, a developer must read known NFT attributes such as `uri`, `name`, `image`, `description`, and `image_data`. If the `uri` field is present within the metadata, it indicates a semi-chain layout, requiring the off-chain content specified in uri to be downloaded and merged with the dictionary values.

Examples:

On-chain NFT: [EQBq5z4N_GeJyBdvNh4tPjMpSkA08p8vWyiAX6LNbr3aLjI0](https://getgems.io/collection/EQAVGhk_3rUA3ypZAZ1SkVGZIaDt7UdvwA4jsSGRKRo-MRDN/EQBq5z4N_GeJyBdvNh4tPjMpSkA08p8vWyiAX6LNbr3aLjI0)

Semi-chain NFT: [EQB2NJFK0H5OxJTgyQbej0fy5zuicZAXk2vFZEDrqbQ_n5YW](https://getgems.io/nft/EQB2NJFK0H5OxJTgyQbej0fy5zuicZAXk2vFZEDrqbQ_n5YW)

On-chain jetton master: [EQA4pCk0yK-JCwFD4Nl5ZE4pmlg4DkK-1Ou4HAUQ6RObZNMi](https://tonscan.org/jetton/EQA4pCk0yK-JCwFD4Nl5ZE4pmlg4DkK-1Ou4HAUQ6RObZNMi)

On-chain NFT parser: [stackblitz/ton-onchain-nft-parser](https://stackblitz.com/edit/ton-onchain-nft-parser?file=src%2Fmain.ts)

## Important notes on NFT metadata

1. NFT 메타데이터의 경우, `name`, `description`, `image`(또는 `image_data`) 필드는 NFT를 표시하는 데 필수적입니다.
2. For jetton metadata, the `name`, `symbol`, `decimals` and `image`(or `image_data`) fields are primary.
3. Anyone can create an NFT or Jetton using any `name`, `description`, or `image`. To prevent scams and confusion, apps should clearly distinguish NFTs from other assets.
4. Some items may include a `video` field linking to video content associated with the NFT or jetton.

## 참조

- [TON Enhancement Proposal 64 (TEP-64)](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md)

## See also

- [TON NFT 처리](/v3/guidelines/dapps/asset-processing/nft-processing/nfts)
- [TON jetton processing](/v3/guidelines/dapps/asset-processing/jettons)
- [Mint your first jetton](/v3/guidelines/dapps/tutorials/mint-your-first-token)

<Feedback />

