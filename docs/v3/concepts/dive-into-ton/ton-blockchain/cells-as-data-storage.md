import Feedback from '@site/src/components/Feedback';

import ConceptImage from '@site/src/components/conceptImage';
import ThemedImage from '@theme/ThemedImage';

# Cells as data storage

In TON, a **cell** is a built material for the entire blockchain. The cell is a data structure containing:

- up to **1023 bits** of data
- up to **4 references** to other cells
- cell stores bits and references separately
- cell forbids circular references: for any cell, none of its descendant cells can reference this original cell.

Thus, all cells constitute a directed acyclic graph (DAG). Here's a good picture to illustrate:

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/docs/cells-as-data-storage/dag.png?raw=true',
        dark: '/img/docs/cells-as-data-storage/Cells-as-data-storage_1_dark.png?raw=true',
    }}
/>
<br></br>

## Cell types
Currently, there are five types of cells: one ordinary cell and four exotic cells.
The exotic types are the following:
* Pruned branch cell
* Library reference cell
* Merkle proof cell
* Merkle update cell

:::tip
See [**Exotic cells**](https://ton.org/tvm.pdf).
:::

## Cell flavors

A cell is an opaque object optimized for compact storage.

It deduplicates data: it only stores the content of several equivalent sub-cells referenced in different branches once. However, one cannot modify or read a cell directly because of its opacity. Thus, there are two additional flavors of the cells:
* **Builder** is a flavor for constructing cells
* **Slice** for a flavor for reading cells 

Another unique cell flavor in TVM:

* **Continuation**  for cells containing opcodes instructions for TON Virtual Machine, see [TVM bird's-eye overview](/v3/documentation/tvm/tvm-overview).

## Serialization of data to cells

Any object in TON, like the message, block, or whole blockchain state, serializes to a cell.

A TL-B scheme describes the serialization process: a formal description of how this object can be serialized into _builder_ or how to parse an object of a given type from the _Slice_.
TL-B for cells is the same as TL or ProtoBuf for byte-streams.

If you want more details about cell serialization and deserialization, read [Cell & bag of cells](/v3/documentation/data-formats/tlb/cell-boc) article.


## See also

- [Blockchain of blockchains](docs/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains/)
- [TL-B language](/v3/documentation/data-formats/tlb/tl-b-language)

<Feedback />

