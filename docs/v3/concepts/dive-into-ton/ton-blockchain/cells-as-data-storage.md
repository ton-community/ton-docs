# Cells as Data Storage

Everything in TON is stored in cells. A cell is a data structure containing:

- up to **1023 bits**  of data (not bytes!)
- up to **4 references** to other cells

Bits and references are not intermixed (they are stored separately). Circular references are forbidden: for any cell, none of its descendant cells can have this original cell as a reference.

Thus, all cells constitute a directed acyclic graph (DAG). Here is a good picture to illustrate:

![Directed Acyclic Graph](/img/docs/dag.png)

## Cell types

Currently, there are 5 types of cells: _ordinary_ and 4 _exotic_.
The exotic types are the following:
* Pruned branch cell
* Library reference cell
* Merkle proof cell
* Merkle update cell

:::tip
For more on exotic cells, see: [**TVM Whitepaper, Section 3**](https://ton.org/tvm.pdf).
:::

## Cell flavors

A cell is an opaque object optimized for compact storage.

In particular, it deduplicates data: if there are several  equivalent sub-cells referenced in different branches, their content is only stored once. However, opaqueness means that a cell cannot be modified or read directly. Thus, there are 2 additional flavors of the cells:
* _Builder_ for partially constructed cells, for which fast operations for appending bitstrings, integers, other cells and, references to other cells can be defined.
* _Slice_ for 'dissected' cells representing either the remainder of a partially parsed cell or a value (subcell) residing inside such a cell and extracted from it via a parsing instruction.

Another special cell flavor is used in TVM:

* _Continuation_  for cells containing opcodes (instructions) for TON Virtual Machine, see [TVM bird's-eye overview](/v3/documentation/tvm/tvm-overview).

## Serialization of data to cells

Any object in TON (message, message queue, block, whole blockchain state, contract code and data) serializes to a cell.

The process of serialization is described by a TL-B scheme: a formal description of how this object can be serialized into _Builder_ or how to parse an object of a given type from the _Slice_.
TL-B for cells is the same as TL or ProtoBuf for byte-streams.

If you want to know more details about cell (de)serialization, you could read [Cell & Bag of Cells](/v3/documentation/data-formats/tlb/cell-boc) article.

## See Also

* [TL-B Language](/v3/documentation/data-formats/tlb/tl-b-language)
