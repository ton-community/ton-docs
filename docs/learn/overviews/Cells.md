# Cells

Everything in TON is stored in cells. Cell is a data structure containing:

- up to **1023 bits**  of data (not bytes!)
- up to **4 references** to other cells

Bits and references are not intermixed (stored separately). Circular references are forbidden: for any cell none of its descendant cell can have this cell as reference.

Thus, all cells constitute a directed acyclic graph (DAG). A good picture of it:

![Directed Acylic Graph](/img/docs/dag.png)

## Cell types

Currently, there are 5 types of cells: _ordinary_ and 4 _exotic_.
Exotic types are the following:
* Pruned branch cell
* Library reference cell
* Merkle proof cell
* Merkle update cell

More on exotic cells: [TVM Whitepaper, section 3](https://ton.org/tvm.pdf).

## Cell flavors

Cell is an opaque object optimized for compact storage.

In particular, it deduplicates data: if there are several eqivalent sub-cells referenced in different branches, their content is only stored once. However, opaqueness means that a cell can not be modified or read directly. Thus, there are 2 additional flavors of the cells:
* _Builder_ for partially constructed cells, for which fast operations for appending bitstrings, integers, other cells, and references to other cells can be defined.
* _Slice_ for 'dissected' cells representing either the remainder of a partially parsed cell, or a value (subcell) residing inside such a cell and extracted from it by a parsing instruction.

Another special cell flavor is used in TVM:

* _Continuation_  for cells containing op-codes (instructions) for Ton Virtual Machine, see [TVM Bird's-eye overview](/smart-contracts/tvm_overview.md).

## Serialization of data to cells

Any object in TON (message, message queue, block, whole blockchain state, contract code and data) serializes to a cell.

The process of serialization is described by TL-B scheme: a formal description of how this object can be serialized to Builder or how to parse object of given type from the Slice.
TL-B for cells is the same as TL or ProtoBuf for byte-streams.
Navigate [here](/overviews/TL-B.md) for more info in TL-B.
