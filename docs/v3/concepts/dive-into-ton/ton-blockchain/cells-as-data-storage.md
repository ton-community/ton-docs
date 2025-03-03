import ConceptImage from '@site/src/components/conceptImage';
import ThemedImage from '@theme/ThemedImage';

# Cells as data storage

Everything in TON is stored in cells. A cell is a data structure containing:

- up to **1023 bits**  of data
- up to **4 references** to other cells

Bits and references aren't intermixed they're stored separately. Circular references are forbidden: for any cell, none of its descendant cells can have this original cell as a reference.

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
For more see: [**Exotic cells**](https://ton.org/tvm.pdf).
:::

## Cell flavors

A cell is an opaque object optimized for compact storage.

In particular, it deduplicates data: if there are several  equivalent sub-cells referenced in different branches, their content is only stored once. However, opaqueness means that a cell cannot be modified or read directly. Thus, there are 2 additional flavors of the cells:
* _Builder_ for partially constructed cells, for which fast operations for appending bitstrings, integers, other cells and, references to other cells can be defined.
* _Slice_ for 'dissected' cells representing either the remainder of a partially parsed cell or a value (subcell) residing inside such a cell and extracted from it via a parsing instruction.

Another special cell flavor is used in TVM:

* _Continuation_  for cells containing opcodes instructions for TON Virtual Machine, see [TVM bird's-eye overview](/v3/documentation/tvm/tvm-overview).

## Serialization of data to cells

Any object in TON like message, block or whole blockchain state serializes to a cell.

The process of serialization is described by a TL-B scheme: a formal description of how this object can be serialized into _builder_ or how to parse an object of a given type from the _Slice_.
TL-B for cells is the same as TL or ProtoBuf for byte-streams.

If you want to know more details about cell serialization and deserialization, read [Cell & Bag of Cells](/v3/documentation/data-formats/tlb/cell-boc) article.

## See also

* [TL-B Language](/v3/documentation/data-formats/tlb/tl-b-language)
