# Metadata parsing on TON

Metadata standard, which cover NFT, NFT Collection and Jetton content, is described in [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md).

On TON, entities can have three types of metadata: on-chain, semi-chain, and off-chain.
- **On-chain** metadata means that everything is stored inside the blockchain, including the name, attributes, and image.
- **Off-chain** metadata means that we store a link to a metadata file that is hosted somewhere outside of the chain.
- **Semi-chain** metadata is a hybrid between the two, allowing us to store small fields like name or attributes on the chain, but hosting the image outside and storing only a link to it. We will discuss how to parse each of these metadata types, but first, we need to introduce the snake format and chunked format for content encoding.

## Snake format
From the standard:
> Snake format when we store part of the data in a cell and the rest of the data in the first child cell (and so recursively). Must be prefixed with 0x00 byte. TL-B scheme:
```
tail#_ {bn:#} b:(bits bn) = SnakeData ~0;
cons#_ {bn:#} {n:#} b:(bits bn) next:^(SnakeData ~n) = SnakeData ~(n + 1);
```

The Snake format is used to store data in a cell when the data exceeds the maximum size that can be stored in a single cell. This is achieved by storing part of the data in the root cell and the remaining part in the first child cell, and continuing to do so recursively until all the data has been stored.

Example of Snake format encoding and decoding in TypeScript:
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
It should be noted that the `0x00` byte prefix is not always required in the root cell when using the snake format, as is the case with off-chain NFT content. Additionally, cells are filled with bytes instead of bits to simplify parsing. To avoid the issue of adding a reference to a reference after it has already been written to its parent, the snake cell is constructed in reverse order.

## Chunked format
From the standard:
> hunked format when we store data in dictionary chunk_index -> chunk. Must be prefixed with 0x01 byte. TL-B scheme:
```
chunked_data#_ data:(HashMapE 32 ^(SnakeData ~0)) = ChunkedData;
```

Example of decoding chunked data in TypeScript(in comments, because mdx throws an exception for some reason):
```typescript
// interface ChunkDictValue {
//   content: Buffer;
// }
// export const ChunkDictValueSerializer = {
//   serialize(src: ChunkDictValue, builder: Builder) {},
//   parse(src: Slice): ChunkDictValue {
//     const snake = flattenSnakeCell(src.loadRef());
//     return { content: snake };
//   },
// };

// export function ParseChunkDict(cell: Slice): Buffer {
//   const dict = cell.loadDict(
//     Dictionary.Keys.Uint(32),
//     ChunkDictValueSerializer
//   );

//   let buf = Buffer.alloc(0);
//   for (const [_, v] of dict) {
//     buf = Buffer.concat([buf, v.content]);
//   }
//   return buf;
// }
```

## NFT metadata attributes
1. `uri` - Optional. Used by "Semi-chain content layout". ASCII string. A URI pointing to JSON document with metadata.
2. `name` - Optional. UTF8 string. Identifies the asset.
3. `description` - Optional. UTF8 string. Describes the asset.
4. `image` - Optional. ASCII string. A URI pointing to a resource with mime type image.
5. `image_data` - Optional. Either binary representation of the image for onchain layout or base64 for offchain layout.


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

## Parsing Metadata
To parse metadata, first you should obtain NFT data from blockchain. You can read about it in [Getting NFT Data](/develop/dapps/asset-processing/nfts#getting-nft-data) paragraph.

After you retrived on-chain NFT data, you need to parse it. First we need to detect NFT content type. To do that you need to read first byte of nft content.

### Off-chain
If it's `0x01` - that means we have off-chain NFT content. We decode rest of the NFT content in Snake format as ASCII string. Then we use resulting URL to get NFT content from the network and it's done. Example of off-chain NFT content:
URL: `https://s.getgems.io/nft/b/c/62fba50217c3fe3cbaad9e7f/95/meta.json`

URL content:
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
If the first byte is `0x00`, it indicates that the content is either on-chain or semi-chain. The metadata for our NFT is stored in a dictionary where the key is the SHA256 hash of the attribute name and the value is the data stored in either Snake or Chunked format. You need to read known nft attributes such as `uri`, `name`, `description`, `image`, `image_data`. If the `uri` field is present in the metadata, it indicates a Semi-chain layout. In such cases, the off-chain content specified in the uri field should be downloaded and merged with the dictionary values.

Example of on-chain nft: [EQBq5z4N_GeJyBdvNh4tPjMpSkA08p8vWyiAX6LNbr3aLjI0](https://getgems.io/collection/EQAVGhk_3rUA3ypZAZ1SkVGZIaDt7UdvwA4jsSGRKRo-MRDN/EQBq5z4N_GeJyBdvNh4tPjMpSkA08p8vWyiAX6LNbr3aLjI0)

Example of semi-chain nft: [EQB2NJFK0H5OxJTgyQbej0fy5zuicZAXk2vFZEDrqbQ_n5YW](https://getgems.io/nft/EQB2NJFK0H5OxJTgyQbej0fy5zuicZAXk2vFZEDrqbQ_n5YW)

Example of on-chain Jetton Master: [EQA4pCk0yK-JCwFD4Nl5ZE4pmlg4DkK-1Ou4HAUQ6RObZNMi](https://tonscan.org/jetton/EQA4pCk0yK-JCwFD4Nl5ZE4pmlg4DkK-1Ou4HAUQ6RObZNMi)

Example of on-chain nft parser: [stackblitz/ton-onchain-nft-parser](https://stackblitz.com/edit/ton-onchain-nft-parser?file=src%2Fmain.ts)

## Important notes on Metadata
1. For NFT's `name`, `description`, and `image`(or `image_data`) fields are required to display the NFT.
2. For Jetton's `name`, `symbol`, `decimals` and `image`(or `image_data`) are primary.
3. It's important to be aware that anyone can create an NFT/Jetton with any `name`, `description`, and `image`. To avoid confusion and scams, you should always display them in a way that clearly distinguishes them from the other parts of your app. Malicious NFTs/Jettons can be sent to a user's wallet with misleading or false information.
4. Some items may have a `video` field, which links to video content associated with the NFT/Jetton.
