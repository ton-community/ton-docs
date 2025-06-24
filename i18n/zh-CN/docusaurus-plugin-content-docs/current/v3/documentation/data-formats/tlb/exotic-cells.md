import Feedback from '@site/src/components/Feedback';

# 特殊cell

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

### 裁剪分支

Pruned branches are cells that represent deleted subtrees of other cells.

它们可以有 `1 <= l <= 3` 的级别，并且包含恰好 `8 + 8 + 256 * l + 16 * l` 位。

The structure of a pruned branch cell is as follows:

- The first byte is always `01`, indicating the cell type.
- The second byte contains the pruned branch-level mask.
- Next,  `l * 32` bytes represent hashes of the deleted subtrees.
- Then, `l * 2` bytes represent the depths of the deleted subtrees.

裁剪分支cell的级别 `l` 可能被称为其德布鲁因指数(De Bruijn index)，因为它决定了裁剪分支是在构造哪个外部默克尔证明或默克尔更新时被修剪的。

裁剪分支的更高哈希存储在其数据中，可以这样获得：

```cpp
Hash_i = CellData[2 + (i * 32) : 2 + ((i + 1) * 32)]
```

### 库引用

库引用cell用于在智能合约中使用库。

它们始终具有 0 级，并包含 `8 + 256` 位。

The first byte is always `02`, indicating the cell type.
第一个字节始终是 `02` - cell类型。接下来的 32 字节是被引用的库cell的[ representation hash ](/develop/data-formats/cell-boc#standard-cell-representation-hash-calculation)。

### Merkle proof

默克尔证明cell用于验证cell树数据的一部分属于完整树。这种设计允许验证者不存储树的全部内容，同时仍能通过根哈希验证内容。 This design allows the verifier to avoid storing the entire tree's content while still being able to verify the content using the root hash.

A Merkle proof cell contains exactly one reference. 默克尔证明恰好有一个引用，其级别 `0 <= l <= 3` 必须是 `max(Lvl(ref) - 1, 0)`。这些cell恰好包含 `8 + 256 + 16 = 280` 位。 These cells contain exactly `8 + 256 + 16 = 280` bits.

The first byte is always `03`, indicating the cell type.
The following 32 bytes are `Hash_1(ref)` or `ReprHash(ref)` if the reference level is 0.
The following 2 bytes represent the depth of the deleted subtree that was replaced by the reference.

默克尔证明cell的更高哈希 `Hash_i` 的计算方式类似于普通cell，但使用 `Hash_i+1(ref)` 代替 `Hash_i(ref)`。

### 默克尔更新

默克尔更新cell始终有 2 个引用，并且行为类似于两者的默克尔证明。

默克尔更新的级别 `0 <= l <= 3` 是 `max(Lvl(ref1) − 1, Lvl(ref2) − 1, 0)`。它们恰好包含 `8 + 256 + 256 + 16 + 16 = 552` 位。 These cells contain exactly `8 + 256 + 256 + 16 + 16 = 552` bits.

The first byte is always `04`, indicating the cell type.
第一个字节始终是 `04` - cell类型。接下来的 64 字节是 `Hash_1(ref1)` 和 `Hash_2(ref2)` - 被称为旧哈希和新哈希。然后是 4 字节，表示已删除的旧子树和新子树的实际深度。
Following that, 4 bytes represent the depth of the deleted old and new subtrees.

## 简单证明验证示例

假设有一个cell `c`：

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

从 `c` 中无法到达 `a` 的第一个后代是 `ref1`：

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

第二个是 `512[0000000...00000000064]`，因此提供者也为此cell创建一个裁剪分支：

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

提供者发送给验证者（在此示例中是我们）的结果默克尔证明看起来是这样的：

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

When we receive the proof cell, as the verifier, we first ensure that its data contains the `c` hash. 当我们（验证者）得到证明cell时，我们确保其数据包含 `c` 的哈希，然后从唯一的证明引用计算 `Hash_1`：`44efd0fdfffa8f152339a0191de1e1c5901fdcfe13798af443640af99616b977`，并将其与 `c` 的哈希进行比较。

现在，当我们检查哈希是否匹配后，我们需要深入cell并验证是否存在我们感兴趣的cell `a`。

这种证明反复减少了计算负载和需要发送给或存储在验证者中的数据量。

## 参阅

- [高级证明验证示例](/develop/data-formats/proofs)

<Feedback />

