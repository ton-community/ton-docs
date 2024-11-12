# Metadata Parsing

The metadata standard, which covers NFTs, NFT Collections, and Jettons, is outlined in TON Enhancement Proposal 64 [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md).

On TON, entities can have three types of metadata: on-chain, semi-chain, and off-chain.
- **On-chain metadata:** stored inside the blockchain, including the name, attributes, and image.
- **Off-chain metadata:** stored using a link to a metadata file hosted outside of the chain.
- **Semi-chain metadata:** a hybrid between the two which allows for the storage of small fields such as names or attributes on the blockchain, while hosting the image off-chain and storing only a link to it.

## Snake Data Encoding
The Snake encoding format allows part of the data to be stored in a standardized cell, while  the remaining portion is stored in a child cell (in a recursive manner). The Snake encoding format must be prefixed using the 0x00 byte. TL-B scheme:

```
tail#_ {bn:#} b:(bits bn) = SnakeData ~0;
cons#_ {bn:#} {n:#} b:(bits bn) next:^(SnakeData ~n) = SnakeData ~(n + 1);
```

The Snake format is used to store additional data in a cell when the data exceeds the maximum size that can be stored in a single cell. This is achieved by storing part of the data in the root cell and the remaining part in the first child cell, and continuing to do so recursively until all the data has been stored.

Below is an example of Snake format encoding and decoding in TypeScript:
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

It should be noted that the `0x00` byte prefix is not always required in the root cell when using the snake format, as is the case with off-chain NFT content. Additionally, cells are filled with bytes instead of bits to simplify parsing. To avoid the issue of adding a reference (within the next child cell)  to a reference after it has already been written to its parent cell, the snake cell is constructed in reverse order.

## Chunked Encoding

The chunked encoding format is used to store data using a dictionary data structure as from the chunk_index to the chunk. Chunked encoding must be prefixed using the `0x01` byte. TL-B scheme:

```
chunked_data#_ data:(HashMapE 32 ^(SnakeData ~0)) = ChunkedData;
```

Below is an example of chunked data decoding using TypeScript:

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

## NFT metadata attributes

| Attribute     | Type         | Requirement | Description                                                                                                                                                        |
|---------------|--------------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `uri`         | ASCII string       | optional    | a URI pointing to the JSON document with metadata that is used by the "Semi-chain content layout." |
| `name`        | UTF8 string  | optional    | identifies the asset                                                                              |
| `description` | UTF8 string  | optional    | describes the asset                                                                               |
| `image`       | ASCII string | optional   | a URI pointing to a resource with a mime type image                                               |
| `image_data`  | binary*      | optional | either a binary representation of the image for on-chain layout or base64 for off-chain layout  |   


## Jetton metadata attributes
1. `uri` - Optional. Used by "Semi-chain content layout". ASCII string. A URI pointing to JSON document with metadata.
2. `name` - Optional. UTF8 string. Identifies the asset.
3. `description` - Optional. UTF8 string. Describes the asset.
4. `image` - Optional. ASCII string. A URI pointing to a resource with mime type image.
5. `image_data` - Optional. Either binary representation of the image for onchain layout or base64 for offchain layout.
6. `symbol` - Optional. UTF8 string. The symbol of the token - e.g. "XMPL". Used in the form "You received 99 XMPL".
7. `decimals` - Optional. If not specified, 9 is used by default. UTF8 encoded string with number from 0 to 255. The number of decimals the token uses - e.g. 8, means to divide the token amount by 100000000 to get its user representation.
8. `amount_style` - Optional. Needed by external applications to understand which format for displaying the number of jettons. 
 - "n" - number of jettons (default value). If the user has 100 tokens with decimals 0, then display that user has 100 tokens
 - "n-of-total" - the number of jettons out of the total number of issued jettons. For example, totalSupply Jetton = 1000. A user has 100 jettons in the jetton wallet. For example must be displayed in the user's wallet as 100 of 1000 or in any other textual or graphical way to demonstrate the particular from the general.
 - "%" - percentage of jettons from the total number of issued jettons. For example, totalSupply Jetton = 1000. A user has 100 jettons in the jetton wallet. For example it should be displayed in the user's wallet as 10%.
9. `render_type` - Optional. Needed by external applications to understand which group the jetton belongs to and how to display it.  
 - "currency" - display as currency (default value). 
 - "game" - display for games. It should be displayed as NFT, but at the same time display the number of jettons considering the `amount_style`




| Attribute     | Type             | Requirement                                                                                                                                                                                                                                                                                             | Description |
|---------------|------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
|`uri`| ASCII string     | optional                                                                                                                                                                                                                                                                                                | a URI pointing to the JSON document with metadata that is used by the "Semi-chain content layout."            |
|`name`| UTF8 string      | optional                                                                                                                                                                                                                                                                                                |identifies the asset|
|`description`| UTF8 string      | optional                                                                                                                                                                                                                                                                                                |describes the asset|
|`image`| ASCII string | optional                                                                                                                                                                                                                                                                                                |a URI pointing to a resource with a mime type image|
|`image_data`| binary*                 | optional                                                                                                                                                                                                                                                                                                |either a binary representation of the image for on-chain layout or base64 for off-chain layout|
|`symbol` |UTF8 string| optional                                                                                                                                                                                                                                                                                                | the symbol of the token - e.g. "XMPL" and uses the form "You received 99 XMPL"|
|`decimals`|UTF8 string| optional                                                                                                                                                                                                                                                                                                |the number of decimals the token uses. If not specified, 9 is used by default. The UTF8 encoded string with the numbers between 0 to 255. - e.g. 8, means the token amount must be divided by 100000000 to get its user representation.|
|`amount_style`||optional| needed by external applications to understand which format for displaying the number of jettons. Defines with _n_, _n-of-total_, _%_.                                                                                                                                                                   |
|`render_type`||optional| Needed by external applications to understand which group the jetton belongs to and how to display it.  "currency" - displayed as a currency (default value)."game" - display used for games that is displayed as an NFT, but also displays the number of jettons and considers the amount_style value. |


> `amount_style` parameters:
* _n_ - number of jettons (default value). If the user has 100 tokens with 0 decimals, then it displays that the user has 100 tokens.
* _n-of-total_ - the number of jettons out of the total number of issued jettons. For example, if the totalSupply of Jettons is 1000 and a user has 100 jettons in their wallet, it must be displayed in the user's wallet as 100 of 1000 or in another textual or graphical way to demonstrate the ratio of user tokens to the total amount of tokens available.
* _%_ - the percentage of jettons from the total number of jettons issued. For example, if the totalSupply of Jettons is 1000, if a user holds 100 jettons, the percentage should be displayed as 10% of the user’s wallet balance (100 ÷ 1000 = 0.1 or 10%).

> `render_type` parameters:
* _currency_ - displayed as a currency (default value).
* _game_ - display used for games that is displayed as an NFT, but also displays the number of jettons and considers the `amount_style value`.

## Parsing Metadata
To parse metadata, NFT data must first be obtained from the blockchain. To better understand this process, consider reading the [Retrieving NFT Data](/v3/guidelines/dapps/asset-processing/nft-processing/nfts#retrieving-nft-data) section of our TON asset processing documentation section.

After on-chain NFT data is retrieved, it must be parsed. To carry out this process, the NFT content type must be determined by reading the first byte that makes up the inner workings of the NFT.

### Off-chain
If the metadata byte string starts with `0x01` it signifies an off-chain NFT content type. The remaining portion of the NFT content is decoded using a Snake encoding format as an ASCII string. After the correct NFT URL is realized, and the NFT identification data is retrieved, the process is complete. Below is an example of a URL that makes use of off-chain NFT content metadata parsing: 
`https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/95/meta.json`

URL contents (from directly above):
```json
{
   "name": "TON Smart Challenge #2 Winners Trophy",
   "description": "TON Smart Challenge #2 Winners Trophy 1 place out of 181",
   "image": "https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/images/943e994f91227c3fdbccbc6d8635bfaab256fbb4",
   "content_url": "https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/content/84f7f698b337de3bfd1bc4a8118cdfd8226bbadf",
   "attributes": []
}
```

### On-chain and Semi-chain
If the metadata byte string starts with `0x00`, it indicates that the NFT either makes use of an on-chain or semi-chain format. 

The metadata for our NFT is stored in a dictionary where the key is the SHA256 hash of the attribute name and the value is the data stored in either the Snake or Chunked format.

To determine what type of NFT is being used it is necessary for the developer to read known NFT attributes such as the `uri`, `name`, `image`, `description`, and `image_data`. If the `uri` field is present within the metadata, it indicates a semi-chain layout. In such cases, the off-chain content specified in the uri field should be downloaded and merged with the dictionary values.

Example of an on-chain NFT: [EQBq5z4N_GeJyBdvNh4tPjMpSkA08p8vWyiAX6LNbr3aLjI0](https://getgems.io/collection/EQAVGhk_3rUA3ypZAZ1SkVGZIaDt7UdvwA4jsSGRKRo-MRDN/EQBq5z4N_GeJyBdvNh4tPjMpSkA08p8vWyiAX6LNbr3aLjI0)

Example of a semi-chain NFT:  [EQB2NJFK0H5OxJTgyQbej0fy5zuicZAXk2vFZEDrqbQ_n5YW](https://getgems.io/nft/EQB2NJFK0H5OxJTgyQbej0fy5zuicZAXk2vFZEDrqbQ_n5YW)

Example of an on-chain Jetton Master: [EQA4pCk0yK-JCwFD4Nl5ZE4pmlg4DkK-1Ou4HAUQ6RObZNMi](https://tonscan.org/jetton/EQA4pCk0yK-JCwFD4Nl5ZE4pmlg4DkK-1Ou4HAUQ6RObZNMi)

Example of an on-chain NFT parser: [stackblitz/ton-onchain-nft-parser](https://stackblitz.com/edit/ton-onchain-nft-parser?file=src%2Fmain.ts)

## Important NFT Metadata Notes
1. For NFT metadata, the `name`, `description`, and `image`(or `image_data`) fields are required to display the NFT.
2. For Jetton metadata, the `name`, `symbol`, `decimals` and `image`(or `image_data`) are primary.
3. It's important to be aware that anyone can create an NFT or Jetton using any `name`, `description`, or `image`.  To avoid confusion and potential scams, users should always display their NFTs in a way that clearly distinguishes them from the other parts of their app. Malicious NFTs and Jettons can be sent to a user's wallet with misleading or false information.
4. Some items may have a `video`  field, which links to video content associated with the NFT or Jetton.


## References
* [TON Enhancement Proposal 64 (TEP-64)](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md)

## See Also
* [TON NFT processing](/v3/guidelines/dapps/asset-processing/nft-processing/nfts)
* [TON Jetton processing](/v3/guidelines/dapps/asset-processing/jettons)
* [Mint your first Jetton](/v3/guidelines/dapps/tutorials/mint-your-first-token)