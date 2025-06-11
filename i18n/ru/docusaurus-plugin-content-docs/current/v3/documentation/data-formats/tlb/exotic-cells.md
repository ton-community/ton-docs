import Feedback from '@site/src/components/Feedback';

# Exotic cells

Each cell has a type encoded by an integer ranging from -1 to 255. A cell with a type of -1 is considered an `ordinary` cell, while all other cells are classified as `exotic` or `special`.
The type of an exotic cell is stored in the first eight bits of its data. It is considered invalid if an exotic cell contains fewer than eight data bits.
Currently, there are 4 exotic cell types:

```json
{
  Prunned Branch: 1,
  Library Reference: 2,
  Merkle Proof: 3,
  Merkle Update: 4
}
```

### Pruned branch

Pruned branches are cells that represent deleted subtrees of other cells.

They can have a level `1 <= l <= 3` and contain exactly `8 + 8 + 256 * l + 16 * l` bits.

The structure of a pruned branch cell is as follows:

- The first byte is always `01`, indicating the cell type.
- The second byte contains the pruned branch-level mask.
- Next,  `l * 32` bytes represent hashes of the deleted subtrees.
- Then, `l * 2` bytes represent the depths of the deleted subtrees.

The level `l` of a pruned branch cell is also called its De Bruijn index, as it determines the outer Merkle proof or Merkle update during the construction process in which the branch was pruned.

Higher-level hashes of pruned branches are stored within their data and can be obtained as follows:

```cpp
Hash_i = CellData[2 + (i * 32) : 2 + ((i + 1) * 32)]
```

### Library reference

Library reference cells are used to incorporate libraries in smart contracts.

They always have a level of 0 and contain precisely `8 + 256` bits.

The first byte is always `02`, indicating the cell type.
The following 32 bytes represent the referenced library cell's [Representation hash](/v3/documentation/data-formats/tlb/cell-boc#standard-cell-representation-hash-calculation).

### Merkle proof

Merkle proof cells verify that some cell tree data belongs to the full tree. This design allows the verifier to avoid storing the entire tree's content while still being able to verify the content using the root hash.

A Merkle proof cell contains exactly one reference. Its level `0 <= l <= 3` must be `max(Lvl(ref) - 1, 0)`. These cells contain exactly `8 + 256 + 16 = 280` bits.

The first byte is always `03`, indicating the cell type.
The following 32 bytes are `Hash_1(ref)` or `ReprHash(ref)` if the reference level is 0.
The following 2 bytes represent the depth of the deleted subtree that was replaced by the reference.

Higher-level hashes `Hash_i` of a Merkle proof cell are computed similarly to the higher hashes of an ordinary cell but with `Hash_i+1(ref)` used instead of `Hash_i(ref)`.

### Merkle update

Merkle update cells always have two references and behave like a Merkle proof for both.

The level of a Merkle update cell `0 <= l <= 3` is determined by `max(Lvl(ref1) − 1, Lvl(ref2) − 1, 0)`. These cells contain exactly `8 + 256 + 256 + 16 + 16 = 552` bits.

The first byte is always `04`, indicating the cell type.
The following 64 bytes represent `Hash_1(ref1)` and `Hash_2(ref2)`, the old and new hashes, respectively.
Following that, 4 bytes represent the depth of the deleted old and new subtrees.

## Simple proof verifying example

Let's assume there is a cell `c`:

```json
24[000078] -> {
	32[0000000F] -> {
		1[80] -> {
			32[0000000E]
		},
		1[00] -> {
			32[0000000C]
		}
	},
	16[000B] -> {
		4[80] -> {
			267[800DEB78CF30DC0C8612C3B3BE0086724D499B25CB2FBBB154C086C8B58417A2F040],
			512[00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000064]
		}
	}
}
```

We know only the cell's hash: `44efd0fdfffa8f152339a0191de1e1c5901fdcfe13798af443640af99616b977`. We want to prove that cell `a` (`267[800DEB78CF30DC0C8612C3B3BE0086724D499B25CB2FBBB154C086C8B58417A2F040]`) is actually part of `c` without receiving the entire `c`.
To achieve this, we request the prover to generate a Merkle proof, replacing all branches that are not relevant to the proof with pruned branch cells.

The first descendant of `c` from which there is no way to reach `a` is `ref1`:

```json
32[0000000F] -> {
	1[80] -> {
		32[0000000E]
	},
	1[00] -> {
		32[0000000C]
	}
}
```

The prover computes the hash of `ref1` `[ec7c1379618703592804d3a33f7e120cebe946fa78a6775f6ee2e28d80ddb7dc]`, creates a pruned branch `288[0101EC7C1379618703592804D3A33F7E120CEBE946FA78A6775F6EE2E28D80DDB7DC0002]`, and replaces `ref1` with this pruned branch.

The next cell is `512[0000000...00000000064]`.

The prover creates a pruned branch to replace this cell as well:

```json
24[000078] -> {
	288[0101EC7C1379618703592804D3A33F7E120CEBE946FA78A6775F6EE2E28D80DDB7DC0002],
	16[000B] -> {
		4[80] -> {
			267[800DEB78CF30DC0C8612C3B3BE0086724D499B25CB2FBBB154C086C8B58417A2F040],
			288[0101A458B8C0DC516A9B137D99B701BB60FE25F41F5ACFF2A54A2CA4936688880E640000]
		}
	}
}
```

The resulting Merkle proof that the prover sends to the verifier (us, in this example) looks like this:

```json
280[0344EFD0FDFFFA8F152339A0191DE1E1C5901FDCFE13798AF443640AF99616B9770003] -> {
	24[000078] -> {
		288[0101EC7C1379618703592804D3A33F7E120CEBE946FA78A6775F6EE2E28D80DDB7DC0002],
		16[000B] -> {
			4[80] -> {
				267[800DEB78CF30DC0C8612C3B3BE0086724D499B25CB2FBBB154C086C8B58417A2F040],
				288[0101A458B8C0DC516A9B137D99B701BB60FE25F41F5ACFF2A54A2CA4936688880E640000]
			}
		}
	}
}
```

When we receive the proof cell, as the verifier, we first ensure that its data contains the `c` hash. We then compute `Hash_1` from the only reference in the proof: `44efd0fdfffa8f152339a0191de1e1c5901fdcfe13798af443640af99616b977`, and compare it to the hash of `c`.

Once we have verified that the hashes match, we traverse deeper into the cell structure to ensure that the target cell `a`, which we are interested in, is indeed present.

Such proofs significantly reduce computational load and minimize the amount of data that the verifier must transmit or store.

## See also

- [Advanced proofs verifying examples](/v3/documentation/data-formats/tlb/proofs)

<Feedback />

