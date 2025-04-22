import Feedback from '@site/src/components/Feedback';

# Canonical cell serialization

## Cell weight

`Weight` is a property of each cell in the cell tree, defined as follows:
* If the cell is a leaf node: `weight = 1`
* For ordinary (non-leaf) cells: `weight = sum of children’s weights + 1`
* If the cell is _special_ : `weight = 0`

This concept is used to construct a weight-balanced tree structure when serializing cells. The following algorithm outlines how weights are assigned to each cell and how the tree is reordered accordingly.


## Weight reorder algorithm 

Each cell is part of a weight-balanced tree, and the [reorder_cells()](https://github.com/ton-blockchain/ton/blob/15088bb8784eb0555469d223cd8a71b4e2711202/crypto/vm/boc.cpp#L249) method recalculates weights based on the cumulative weight of child cells.
The traversal order for recalculating weights is breadth-first, starting from the roots and moving toward the children. This is _likely_ chosen to preserve cache linearity.
The method also:
* Recalculates hash sizes 
* Reindexes the bag of cells (roots), and each tree 
* Assigns new indexes for empty references

Reindexing is performed in depth-first order, likely due to specific dependencies or optimizations. As stated in the whitepaper, this indexing order is preferred.

To follow the original node’s bag of cells (BoC) serialization format, the following steps should be applied:

- First, if the cell's weights have not been set, this is typically handled during cell import; the weight for each cell is set to `1 + sum_child_weight`, where `sum_child_weight` represents the total weight of its child nodes. The additional 1 ensures that leaf nodes receive a weight of 1.

- Iterate over all root cells. For each root cell:
  * Check whether each of its references has a weight less than `(maximum_possible_weight - 1 + ref_index) / num_references`, where `num_references` is the number of references in the root cell. This ensures that the parent’s weight is distributed uniformly among its children. The `ref_index` adjustment accounts for integer division rounding behavior in some languages (e.g., in C++, 5 / 3 yields 1, but we want 2 in this case).
  * If any reference violates this rule, add it to a list or, for efficiency, use a bitmask as done in the original implementation. Then, iterate over the invalid references and clamp their weight to `weight_left / invalid_ref_count`, where `weight_left` is calculated as `maximum_possible_weight - 1 - sum_of_valid_ref_weights`.
  * This can be implemented in code using a counter initialized to `maximum_possible_weight - 1`, which is then decremented for each valid reference as `counter -= valid_ref_weight`. This effectively redistributes the remaining weight among the invalid references to balance them.

- Iterate over the root cells again. For each root:
  * Ensure that the new sum of its reference weights is less than `maximum_possible_weight`. If this new sum is less than the root cell’s previous weight, clamp the root cell’s weight to the new sum (i.e., if `new_sum < root_cell_weight`, then set `root_cell_weight = new_sum`).
  * If the new sum exceeds the root cell’s weight, the node is considered a special node with a weight of 0. Set the weight to 0 accordingly. At this point, increment the Internal hashes count by the hash count of the node.
  
- Iterate over the root cells once more. For each root:
  * If the node is not special (i.e., weight > 0), increment the Top hashes count by the node’s hash count.

- Recursively reindex tree:
  * Begin by revisiting all root cells. If each node has not been revisited or visited, recursively check all its references for special nodes. If a special node is encountered, it must be revisited and visited before any other node. This ensures that the children of special nodes are added first to the resulting list, giving them the lowest indexes.
  * After handling special nodes, process the remaining children in order from the deepest to the highest in the tree.
  * Root nodes are added at the end of the list, thus receiving the highest indexes.
- The result is a sorted list in which deeper nodes receive lower indexes.

`maximum_possible_weight` is a constant value set to 64.
    
## Notes

* A special cell weights 0. 
* On import, ensure that the weight fits within 8 bits (weight \<= 255). 
* Internal hashes count is the sum of hash counts of all special root nodes. 
* The top hashes count is the sum of hash counts of all non-special (i.e., regular) root nodes.
<Feedback />

