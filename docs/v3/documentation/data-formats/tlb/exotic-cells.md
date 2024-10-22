# Exotic Cells

Every Cell has its own type encoded by an integer from -1 to 255.
Cell with type -1 is an `ordinary` Cell, and all others Cells called `exotic` or `special`.
The type of an exotic cell is stored as the first eight bits of its data. If an exotic cell has less than eight data bits, it is invalid.
Currently, there are 4 exotic Cell types:

```json
{
  Prunned Branch: 1,
  Library Reference: 2,
  Merkle Proof: 3,
  Merkle Update: 4
}
```
### Pruned Branch

Pruned branches are Cells that represent deleted subtrees of Cells.

They can have level `1 <= l <= 3` and contain exactly `8 + 8 + 256 * l + 16 * l` bits.

First byte is always `01` - Cell type. The second one is the Pruned Branch level mask. Then goes `l * 32` bytes hashes of deleted subtrees and after that `l * 2` bytes depths of deleted subtrees.

The level `l` of a Pruned branch Cell may be called its De Bruijn index, because it determines the outer Merkle proof or Merkle update during the construction of which the branch has been pruned.

Higher hashes of Pruned branches are stored in their data and can be obtained like this: 
```cpp
Hash_i = CellData[2 + (i * 32) : 2 + ((i + 1) * 32)]
``` 

### Library Reference

Library reference cells are used for using libraries in smart contracts. 

They always have level 0, and contain `8 + 256` bits.

First byte is always `02` - Cell type. Next 32 bytes are [Representation hash](/v3/documentation/data-formats/tlb/cell-boc#standard-cell-representation-hash-calculation) of the library cell being referred to.

### Merkle Proof

Merkle Proof cells are used to verify that a portion of the Cell tree data belongs to the full tree. This design allows the verifier to not store the whole content of the tree, while still being able to verify the content by root hash.

Merkle Proof has exactly one reference and its level `0 <= l <= 3` must be `max(Lvl(ref) - 1, 0)`. These cells contain exactly `8 + 256 + 16 = 280` bits.

First byte is always `03` - Cell type. Next 32 bytes are `Hash_1(ref)` (or `ReprHash(ref)` if reference level is 0). The next 2 bytes are depth of the deleted subtree, which was replaced by the reference.

The higher hashes `Hash_i` of Merkle Proof Cell are computed similarly to the higher hashes of an ordinary cell, but with `Hash_i+1(ref)` used instead of `Hash_i(ref)`.

### Merkle Update

Merkle update cells are always have 2 refs and behave like a Merkle proof for both of them.

Merkle Update level `0 <= l <= 3` is `max(Lvl(ref1) − 1, Lvl(ref2) − 1, 0)`. They contain exactly `8 + 256 + 256 + 16 + 16 = 552` bits.

First byte is always `04` - Cell type. Next 64 bytes are `Hash_1(ref1)` and `Hash_2(ref2)` - called old hash and new hash. Then goes 4 bytes with actual depth of deleted old subtree and deleted new subtree.


## Simple Proof verifying example
Let's assume there is a Cell `c`:

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

But we know only its hash `44efd0fdfffa8f152339a0191de1e1c5901fdcfe13798af443640af99616b977`, and we want to prove that cell `a` `267[800DEB78CF30DC0C8612C3B3BE0086724D499B25CB2FBBB154C086C8B58417A2F040]` is actually a part of the `c`, without receiving the whole `c`.
So we ask the prover to create a Merkle Proof, replacing all branches that we are not interested in with Pruned branch cells.

The first `c` descendant from which there is no way to get to `a` is `ref1`:
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
So the prover computes its hash (`ec7c1379618703592804d3a33f7e120cebe946fa78a6775f6ee2e28d80ddb7dc`), creates a Pruned Branch `288[0101EC7C1379618703592804D3A33F7E120CEBE946FA78A6775F6EE2E28D80DDB7DC0002]` and replaces `ref1` with this Pruned Branch.

The second one is `512[0000000...00000000064]`, so the prover creates Pruned branch to replace this Cell as well:
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
The result Merkle Proof which prover sends to verifier (us in this example) looks like this:

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

When we (verifier) get the Proof Cell we make sure that its data contains the `c` hash and then compute `Hash_1` from the only Proof reference: `44efd0fdfffa8f152339a0191de1e1c5901fdcfe13798af443640af99616b977`, and compare it to the `c` hash.

Now, when we've checked that hashes are match, we need to go deep in the Cell and verify that there is a Cell `a` (we were interested in).

Such proofs repeatedly reduce the computational load and the amount of data that needs to be sent to or stored in the verifier.

## See Also

* [Advanced Proofs verifying examples](/v3/documentation/data-formats/tlb/proofs)
