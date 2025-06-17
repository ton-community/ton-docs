import Feedback from '@site/src/components/Feedback';

# TVM 升级 2023.07

:::tip
此升级于 2023 年 12 月在主网上启动，详细信息请参考 [run](https://t.me/tonblockchain/223)。
:::

## c7

`c7` is a register that stores important information needed for contract execution, like time, network configurations, and others.

**Changes to `c7` tuple**

**c7** 元组从 10 扩展到 14 个元素：

- **10**: 存储智能合约本身的 `cell`。
- **11**: `[integer, maybe_dict]`：传入消息的 TON 值，额外代币。
- **12**: `integer`，存储阶段收取的费用。
- **13**: `tuple` 包含有关先前区块的信息。

**Explanation**

**10** 当前智能合约的代码仅以可执行继续的形式在 TVM 级别呈现，无法转换为cell。这段代码通常用于授权相同类型的 neighbor 合约，例如 Jetton 钱包授权 Jetton 钱包。目前我们需要显式地代码cell存储在存储器中，这使得存储和 init_wrapper 变得更加麻烦。
使用 **10** 作为代码对于 tvm 的 Everscale 更新兼容。 This allows it to authorize other contracts of the same type—for example, a jetton-wallet authorizing another jetton-wallet.

Currently, the code cell must be explicitly stored in storage, making storage and `init_wrapper` more complex than they could be.
Using **10** for code aligns with the Everscale TVM update.

**11:** The incoming message value is placed on the stack when the TVM starts. If needed during execution, it must be stored as a global variable or passed as a local variable. At the FunC level, this appears as an additional `msg_value` argument in all functions.

By storing it in **11**, we mirror the behavior of the contract balance, which is available both on the stack and in `c7`.

**12:** Currently, the only way to determine storage fees is by:

1. Storing the balance from the previous transaction.
2. Estimating the gas usage in that transaction.
3. Comparing it to the current balance minus the message value.

However, a more direct method to account for storage fees is often needed.

**13:** There is no built-in way to retrieve data from previous blocks.
One of TON’s key features is that every structure is a Merkle-proof-friendly tree of cells. Additionally, TVM is optimized for:

- Cell-based computations.
- Efficient handling of Merkle proofs.

By integrating block information into the TVM context, several trustless mechanisms become possible:

- **Cross-contract verification:** contract _A_ can verify transactions on contract _B_ without B’s cooperation.
- **Broken message chain recovery:** a recovery contract can fetch and validate proofs for transactions that occurred but were later reverted.
- **On-chain validation:** access to MasterChain block hashes enables functions like fisherman validation mechanisms.

区块 id 的表示如下：

```
[ wc:Integer shard:Integer seqno:Integer root_hash:Integer file_hash:Integer ] = BlockId;
[ last_mc_blocks:[BlockId0, BlockId1, ..., BlockId15]
  prev_key_block:BlockId ] : PrevBlocksInfo
```

This includes:

- The last 16 MasterChain block IDs, or fewer if the masterchain sequence number is below 16.
- The most recent key block.

**Why not include shardblocks data?**

- Including shardblocks data could cause data availability issues due to merge/split events.
- However, this data isn’t strictly necessary, as any event or data can be verified using MasterChain blocks.

## 新的操作码

When determining the gas cost for new opcodes, follow this rule of thumb:

- The cost should not be lower than the standard value (calculated from opcode length).
- The execution time should not exceed **20 ns per gas unit**.

### 用于处理新 c7 值的操作码

检查G1点`x`是否等于零。<br/>_34 gas_

每个操作码消耗 26 gas，除了 `PREVMCBLOCKS` 和 `PREVKEYBLOCK`（34 gas）。

| Fift syntax           | Stack   | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>说明                               |
| :-------------------- | :------ | :-------------------------------------------------------------------------- |
| `MYCODE`              | _`- c`_ | 从 c7 检索智能合约的代码                                                              |
| `INCOMINGVALUE`       | _`- t`_ | 从 c7 检索传入消息的值                                                               |
| `STORAGEFEES`         | _`- i`_ | 从 c7 检索存储阶段费用的值                                                             |
| `PREVBLOCKSINFOTUPLE` | _`- t`_ | 从 c7 中检索 PrevBlocksInfo: `[last_mc_blocks, prev_key_block]` |
| `PREVMCBLOCKS`        | _`- t`_ | 仅检索 `last_mc_blocks`                                                        |
| `PREVKEYBLOCK`        | _`- t`_ | 仅检索 `prev_key_block`                                                        |
| `GLOBALID`            | _`- i`_ | 从网络配置的第 19 项检索 `global_id`                                                  |

## Gas

| Fift syntax   | Stack     | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>说明                |
| :------------ | :-------- | :--------------------------------------------------------------- |
| `GASCONSUMED` | _`- g_c`_ | 返回到目前为止 VM 消耗的 gas（包括此指令）。<br/>_26 gas__26 gas_. |

## 算术

New variants of [the division opcode](/v3/documentation/tvm/instructions) `A9mscdf` have been introduced.

New `d=0` variant:

- Takes an additional integer from the stack.
- Adds it to the intermediate value before performing division or right shift.
- These operations return both the quotient and the remainder (just like `d=3`).

**Quiet variants** are also available. 还提供了静默变体（例如 `QMULADDDIVMOD` 或 `QUIET MULADDDIVMOD`）。

**Error handling**

Non-quiet operations throw an integer overflow exception if:

- The result exceeds `257-bit` integers.
- The divider is **zero**.

Quiet operations handle errors differently:

- If a value doesn't fit, they return `NaN`.
- If the divider is zero, they return `two NaNs`.

**Gas cost calculation**

Gas 成本等于 10 加上操作码长度：大多数操作码为 26 gas，`LSHIFT#`/`RSHIFT#` 额外加 8，静默额外加 8。

- Most opcodes require **26 gas**.
- `LSHIFT#/RSHIFT#` cost an additional **8 gas**.
- Quiet variants also require an extra **8 gas**.

| Fift syntax           | Stack                                             |
| :-------------------- | :------------------------------------------------ |
| `MULADDDIVMOD`        | _`x y w z - q=floor((xy+w)/z) r=(xy+w)-zq`_       |
| `MULADDDIVMODR`       | _`x y w z - q=round((xy+w)/z) r=(xy+w)-zq`_       |
| `MULADDDIVMODC`       | _`x y w z - q=ceil((xy+w)/z) r=(xy+w)-zq`_        |
| `ADDDIVMOD`           | _`x w z - q=floor((x+w)/z) r=(x+w)-zq`_           |
| `ADDDIVMODR`          | _`x w z - q=round((x+w)/z) r=(x+w)-zq`_           |
| `ADDDIVMODC`          | _`x w y - q=ceil((x+w)/z) r=(x+w)-zq`_            |
| `ADDRSHIFTMOD`        | _`x w z - q=floor((x+w)/2^z) r=(x+w)-q*2^z`_      |
| `ADDRSHIFTMODR`       | _`x w z - q=round((x+w)/2^z) r=(x+w)-q*2^z`_      |
| `ADDRSHIFTMODC`       | _`x w z - q=ceil((x+w)/2^z) r=(x+w)-q*2^z`_       |
| `z ADDRSHIFT#MOD`     | _`x w - q=floor((x+w)/2^z) r=(x+w)-q*2^z`_        |
| `z ADDRSHIFTR#MOD`    | _`x w - q=round((x+w)/2^z) r=(x+w)-q*2^z`_        |
| `z ADDRSHIFTC#MOD`    | _`x w - q=ceil((x+w)/2^z) r=(x+w)-q*2^z`_         |
| `MULADDHIFTMOD`       | _`x y w z - q=floor((xy+w)/2^z) r=(xy+w)-q*2^z`_  |
| `MULADDRSHIFTRMOD`    | _`x y w z - q=round((xy+w)/2^z) r=(xy+w)-q*2^z`_  |
| `MULADDHIFTCMOD`      | _`x y w z - q=ceil((xy+w)/2^z) r=(xy+w)-q*2^z`_   |
| `z MULADDRSHIFT#MOD`  | _`x y w - q=floor((xy+w)/2^z) r=(xy+w)-q*2^z`_    |
| `z MULADDRSHIFTR#MOD` | _`x y w - q=round((xy+w)/2^z) r=(xy+w)-q*2^z`_    |
| `z MULADDRSHIFTC#MOD` | _`x y w - q=ceil((xy+w)/2^z) r=(xy+w)-q*2^z`_     |
| `LSHIFTADDDIVMOD`     | _`x w z y - q=floor((x*2^y+w)/z) r=(x*2^y+w)-zq`_ |
| `LSHIFTADDDIVMODR`    | _`x w z y - q=round((x*2^y+w)/z) r=(x*2^y+w)-zq`_ |
| `LSHIFTADDDIVMODC`    | _`x w z y - q=ceil((x*2^y+w)/z) r=(x*2^y+w)-zq`_  |
| `y LSHIFT#ADDDIVMOD`  | _`x w z - q=floor((x*2^y+w)/z) r=(x*2^y+w)-zq`_   |
| `y LSHIFT#ADDDIVMODR` | _`x w z - q=round((x*2^y+w)/z) r=(x*2^y+w)-zq`_   |
| `y LSHIFT#ADDDIVMODC` | _`x w z - q=ceil((x*2^y+w)/z) r=(x*2^y+w)-zq`_    |

## 堆栈操作

**Previous limitations**

- All stack operation arguments are limited to 256.
- This makes managing deep stack elements difficult when the stack grows beyond 256.
- In most cases, this limit is not imposed for safety reasons—it's not about preventing excessive computation costs.

For certain mass stack operations, such as `ROLLREV`, computation time scales linearly with the argument value, and as a result, the gas cost also increases linearly.

**Updated behavior**

The argument limits for the following operations have been removed:

- 现在，`PICK`、`ROLL`、`ROLLREV`、`BLKSWX`、`REVX`、`DROPX`、`XCHGX`、`CHKDEPTH`、`ONLYTOPX`、`ONLYX` 的参数不受限制。

**Gas cost adjustments for large arguments**

Certain operations now consume additional gas when arguments exceed 255:

- 当参数较大时，`ROLL`, `ROLLREV`, `REVX`, `ONLYTOPX` 耗气量更大：额外耗气量为 `max(arg-255,0)`（参数小于 256 时，耗气量不变，与当前行为一致） _For arguments ≤ 255, gas consumption remains unchanged_.

- 对于 `BLKSWX`，额外费用为 `max(arg1+arg2-255,0)`（这与当前行为不符，因为当前 `arg1` 和 `arg2` 都限制为 255）。 _This differs from previous behavior, where both arguments were limited to 255_.

## 哈希值

Previously, TVM supported only two hash operations:

- Computing the representation hash of a `cell` or `slice`.
- Calculating the SHA-256 hash of data, but only for inputs up to 127 bytes, as this is the maximum data that fits into a single cell.

**New hash operations (`HASHEXT[A][R]_(HASH)`)**
A new family of hash operations has been introduced to extend TVM's hashing capabilities:

| Fift syntax        | Stack                    | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>说明                                       |
| :----------------- | :----------------------- | :-------------------------------------------------------------------------------------- |
| `HASHEXT_(HASH)`   | _`s_1 ... s_n n - h`_    | 计算并返回片段（或构建器）`s_1...s_n`的连接哈希值。                                                         |
| `HASHEXTR_(HASH)`  | _`s_n ... s_1 n - h`_    | Same as `HASHEXT_(HASH)`, but the arguments are given in reverse order. |
| `HASHEXTA_(HASH)`  | _`b s_1 ... s_n n - b'`_ | 将生成的哈希值追加到构造函数 `b` 中，而不是推送到堆栈中。                                                         |
| `HASHEXTAR_(HASH)` | _`b s_n ... s_1 n - b'`_ | Same as `HASHEXTA_(HASH)`, but with arguments in reverse order.         |

**Key behavior and constraints**

- 仅使用 `s_i` 的根cell的位。
- Each chunk `s_i` may contain a non-integer number of bytes, but the total number of bits across all chunks must be divisible by 8.
- TON follows most-significant bit ordering, meaning that bits from the first slice become the most significant when concatenating two slices with non-integer byte lengths.

**Gas consumption**

- Gas cost depends on the number of hashed bytes and the chosen algorithm.
- An additional 1 gas unit is consumed per chunk.
- Gas usage is rounded down.

**Hashing result format**

如果未启用 `[A]`，则哈希的结果将作为无符号整数返回，如果适应 256 位，否则返回整数的元组。 Otherwise, it is returned as a tuple of integers.

| **Algorithm**  | **Implementation**                                | **Gas cost (per byte)** | **Hash size** |
| -------------- | ------------------------------------------------- | ------------------------------------------ | ------------- |
| **SHA-256**    | OpenSSL                                           | 1/33                                       | 256 bits      |
| **SHA-512**    | OpenSSL                                           | 1/16                                       | 512 bits      |
| **BLAKE2B**    | OpenSSL                                           | 1/19                                       | 512 bits      |
| **KECCAK-256** | [Ethereum-compatible](http://keccak.noekeon.org/) | 1/11                                       | 256 bits      |
| **KECCAK-512** | [Ethereum-compatible](http://keccak.noekeon.org/) | 1/6                                        | 512 bits      |

## 加密货币

目前唯一可用的加密算法是 "CCHKSIGN"：检查哈希 "h "与公钥 "k "的 Ed25519 签名。

- 为了与比特币和以太坊等上一代区块链兼容，我们还需要检查 `secp256k1` 签名。
- 对于现代密码算法，最低要求是曲线的加法和乘法。
- 为了与以太坊 2.0 PoS 和其他现代密码学的兼容性，我们需要在 bls12-381 曲线上进行 BLS 签名方案。
- 对于某些安全硬件，需要 `secp256r1 == P256 == prime256v1`。

### secp256k1

Used for Bitcoin/Ethereum signatures. 比特币/以太坊签名。使用 [libsecp256k1 实现](https://github.com/bitcoin-core/secp256k1)。

| Fift syntax | Stack                            | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>说明                                                                                                                                                                                                                                                                                                                                                            |
| :---------- | :------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ECRECOVER` | _`hash v r s - 0 or h x1 x2 -1`_ | Recovers the public key from the signature, similar to Bitcoin/Ethereum operations. It takes a 32-byte hash as uint256 `hash`, a 65-byte signature as uint8 `v`, and uint256 `r` and `s`. Returns `0` on failure or the public key and `-1` on success. The 65-byte public key is returned as uint8 `h`, uint256 `x1`, `x2`. <br/>_1526 gas_ |

### secp256r1

Uses OpenSSL implementation. The interface is similar to `CHKSIGNS`/`CHKSIGNU`. It is compatible with Apple Secure Enclave.

| Fift syntax     | Stack           | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| :-------------- | :-------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `P256_CHKSIGNS` | _`d sig k - ?`_ | Checks the `secp256r1` signature `sig` of the data portion of slice `d` and the public key `k`. Returns `-1` on success or `0` on failure. <br/> The public key is a 33-byte slice (encoded according to Section 2.3.4, point 2 of [SECG SEC 1](https://www.secg.org/sec1-v2.pdf)). <br/> The signature `sig` is a 64-byte slice (two 256-bit unsigned integers `r` and `s`). <br/> _3526 gas_. |
| `P256_CHKSIGNU` | _`h sig k - ?`_ | 相同，但签名的数据是 32 字节对 256 位无符号整数 `h` 的编码。<br/>_3526 gas_ <br/> _3526 gas_.                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

### Ristretto

Extended documentation is available [here](https://ristretto.group/). Curve25519 is known for its high performance but has a drawback: group elements can have multiple representations. Simple cryptographic protocols like Schnorr signatures and Diffie-Hellman use workarounds to address this issue, but these solutions break key derivation and key blinding schemes. More complex protocols like Bulletproofs cannot rely on these tricks.

**Ristretto** solves this problem by providing an arithmetic abstraction over Curve25519, ensuring each group element has a unique representation. It acts as a compression and decompression layer, maintaining the speed of Curve25519 while making cryptographic protocols easier to implement correctly. One key advantage of Ristretto is that it allows the seamless performance of Curve25519 operations, though the reverse is not true.

As a result, adding Ristretto support effectively means adding both Ristretto and Curve25519 operations in a single step.

[libsodium](https://github.com/jedisct1/libsodium/) 实现已被使用。

**Representation in TVM**

- All ristretto-255 points are represented as 256-bit unsigned integers.
- Invalid points cause a `range_chk` throw in non-quiet operations.
- The zero point is represented as integer `0`.

| Fift syntax         | Stack                | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>说明                                                                                                       |
| :------------------ | :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `RIST255_FROMHASH`  | _`h1 h2 - x`_        | 从 512 位哈希（由两个 256 位整数给出）确定性生成有效点 `x`。<br/>_626 gas__626 gas_.                                                                           |
| `RIST255_VALIDATE`  | _`x -`_              | Verifies that `x` is a valid curve point representation. If invalid, throws `range_chk`.<br/>_226 gas_                  |
| `RIST255_ADD`       | _`x y - x+y`_        | Adds two points on the curve.<br/>_626 gas_                                                                                             |
| `RIST255_SUB`       | _`x y - x-y`_        | Subtracts one curve point from another. 在曲线上两个点的相加。<br/>_626 gas_                                                                       |
| `RIST255_MUL`       | _`x n - x*n`_        | Multiplies a curve point `x` by a scalar `n`.<br/>Any `n` is valid, including negative.<br/>_2026 gas_. |
| `RIST255_MULBASE`   | _`n - g*n`_          | 将生成器点 `g` 乘以标量 `n`。<br/>任何 `n` 都有效，包括负数。<br/>_776 gas_Any `n` is valid, including negative.<br/>_776 gas_                               |
| `RIST255_PUSHL`     | _`- l`_              | 推送整数 `l=2^252+27742317777372353535851937790883648493`，这是群的阶。<br/>_26 gas__26 gas_                                                                       |
| `RIST255_QVALIDATE` | _`x - 0 或 -1`_       | `RIST255_VALIDATE` 的静默版本。<br/>_234 gas__234 gas_.                                                                                       |
| `RIST255_QADD`      | _`x y - 0 或 x+y -1`_ | `RIST255_ADD` 的静默版本。<br/>_634 gas_ <br/>_634 gas_.                                                                                      |
| `RIST255_QSUB`      | _`x y - 0 或 x-y -1`_ | `RIST255_SUB` 的静默版本。<br/>_634 gas__634 gas_.                                                                                            |
| `RIST255_QMUL`      | _`x n - 0 或 x*n -1`_ | `RIST255_MUL` 的静默版本。<br/>_2034 gas__2034 gas_.                                                                                          |
| `RIST255_QMULBASE`  | _`n - 0 或 g*n -1`_   | `RIST255_MULBASE` 的静默版本。<br/>_784 gas__784 gas_.                                                                                        |

### BLS12-381

在配对友好的 BLS12-381 曲线上进行操作。使用 [BLST](https://github.com/supranational/blst) 实现。此外，还对基于该曲线的 BLS 签名方案进行了操作。 It includes operations for the BLS signature scheme, which is based on this curve.

BLS 值在 TVM 中的表示方法如下：

- G1点和公钥：48字节 slice 。
- G2点和签名：96字节 slice 。
- 字段FP的元素：48字节 slice 。
- 字段FP2的元素：96字节 slice 。
- Messages: slice. Several bits should be divisible by 8.

**Handling input sizes**

- If an input point or field element exceeds 48/96 bytes, only the first 48/96 bytes are considered.
- If an input slice is too short or a message's bit size isn't divisible by 8, a cell underflow exception is thrown.

#### 高级操作

这些是验证 BLS 签名的高级操作。

| Fift syntax               | Stack                                      | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>说明                                                                                                                                                                                      |
| :------------------------ | :----------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BLS_VERIFY`              | _`pk msg sgn - bool`_                      | Checks a BLS signature. It returns true  if valid, false otherwise.<br/>_61034 gas_.                                                                                                   |
| `BLS_AGREGATE`            | _`sig_1 ... sig_n n - sig`_                | Aggregates signatures. `n>0`. Throws an exception if `n=0` or if any `sig_i` is invalid .<br/>_`gas=n*4350-2616`_.                                                     |
| `BLS_FASTAGREGATEVERIFY`- | _`pk_1 ... pk_n n msg sig - bool`_         | Checks an aggregated BLS signature for keys `pk_1...pk_n` and a message `msg`. It returns false if `n=0`.<br/>_`gas=58034+n*3000`_.                                                    |
| `BLS_AGREGATEVERIFY`      | _`pk_1 msg_1 ... pk_n msg_n n sgn - bool`_ | Checks an aggregated BLS signature for multiple key-message pairs `pk_1 msg_1...pk_n msg_n`. Returns true if valid, false otherwise. Returns false if `n=0`.<br/>_`gas=38534+n*22500`_ |

`VERIFY` instructions

- These instructions do not throw exceptions for invalid signatures or public keys.
- The only exceptions occur due to cell underflow errors.
- If verification fails, it returns false.

#### 低级操作

这些是对组元素的算术操作。

| Fift syntax       | Stack                                           | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述                                                                                                                                                                                                                                                                                                                   |
| :---------------- | :---------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BLS_G1_ADD`      | _`x y - x+y`_                                   | G1上的加法。<br/>_3934 gas__3934 gas_.                                                                                                                                                                                                                                                                                                               |
| `BLS_G1_SUB`      | _`x y - x-y`_                                   | Performs subtraction on G1.<br/>_3934 gas_.                                                                                                                                                                                                                                                                                     |
| `BLS_G1_NEG`      | _`x - -x`_                                      | Performs negation on G1.<br/>_784 gas_.                                                                                                                                                                                                                                                                                         |
| `BLS_G1_MUL`      | _`x s - x*s`_                                   | Multiplies G1 point `x` by scalar `s`.<br/>Any `s` is valid, including negative.<br/>_5234 gas_.                                                                                                                                                                                                                |
| `BLS_G1_MULTIEXP` | _`x_1 s_1 ... x_n s_n n - x_1*s_1+...+x_n*s_n`_ | Calculates `x_1*s_1+...+x_n*s_n` for G1 points `x_i` and scalars `s_i`. Returns zero point if `n=0`.<br/>Any `s_i` is valid, including negative.<br/>计算G1点`x_i`和标量`s_i`的`x_1*s_1+...+x_n*s_n`。如果`n=0`，返回零点。&#xA<br/>任何`s_i`都是有效的，包括负数。<br/>`gas=11409+n*630+n/floor(max(log2(n),4))*8820`   |
| `BLS_G1_ZERO`     | _`- zero`_                                      | 推送零点到G1中。<br/>_34 gas__34 gas_.                                                                                                                                                                                                                                                                                                                 |
| `BLS_MAP_TO_G1`   | _`f - x`_                                       | 将FP元素`f`转换为G1点。<br/>_2384 gas__2384 gas_.                                                                                                                                                                                                                                                                                                       |
| `BLS_G1_INTROUP`  | _`x - bool`_                                    | 检查 slice `x`是否表示有效的G1元素。<br/>_2984 gas__2984 gas_.                                                                                                                                                                                                                                                                                              |
| `BLS_G1_ISZERO`   | _`x - bool`_                                    | Checks if G1 point `x` is equal to zero.<br/>_34 gas_.                                                                                                                                                                                                                                                                          |
| `BLS_G2_ADD`      | _`x y - x+y`_                                   | G2上的加法。<br/>_6134 gas__6134 gas_.                                                                                                                                                                                                                                                                                                               |
| `BLS_G2_SUB`      | _`x y - x-y`_                                   | G2上的减法。<br/>_6134 gas__6134 gas_.                                                                                                                                                                                                                                                                                                               |
| `BLS_G2_NEG`      | _`x - -x`_                                      | G2上的取反。<br/>_1584 gas__1584 gas_.                                                                                                                                                                                                                                                                                                               |
| `BLS_G2_MUL`      | _`x s - x*s`_                                   | Multiplies G2 point `x` by scalar `s`.<br/>Any `s` is valid, including negative.<br/>_10584 gas_.                                                                                                                                                                                                               |
| `BLS_G2_MULTIEXP` | _`x_1 s_1 ... x_n s_n n - x_1*s_1+...+x_n*s_n`_ | Calculates `x_1*s_1+...+x_n*s_n` for G2 points `x_i` and scalars `s_i`. Returns zero point if `n=0`.<br/>Any `s_i` is valid, including negative.<br/>计算G2点`x_i`和标量`s_i`的`x_1*s_1+...+x_n*s_n`。如果`n=0`，返回零点。&#xA<br/>任何`s_i`都是有效的，包括负数。<br/>`gas=30422+n*1280+n/floor(max(log2(n),4))*22840` |
| `BLS_G2_ZERO`     | _`- zero`_                                      | 推送零点到G2中。<br/>_34 gas__34 gas_.                                                                                                                                                                                                                                                                                                                 |
| `BLS_MAP_TO_G2`   | _`f - x`_                                       | 将FP2元素`f`转换为G2点。<br/>_7984 gas__7984 gas_.                                                                                                                                                                                                                                                                                                      |
| `BLS_G2_INTROUP`  | _`x - bool`_                                    | 检查 slice `x`是否表示有效的G2元素。<br/>_4284 gas__4284 gas_.                                                                                                                                                                                                                                                                                              |
| `BLS_G2_ISZERO`   | _`x - bool`_                                    | 检查G2点`x`是否等于零。<br/>_34 gas__34 gas_.                                                                                                                                                                                                                                                                                                            |
| `BLS_PAIRING`     | _`x_1 y_1 ... x_n y_n n - bool`_                | Given G1 points `x_i` and G2 points `y_i`, calculates and multiply pairings of `x_i,y_i`. Returns true if the result is the multiplicative identity in FP12, false otherwise. Returns false if `n=0`.<br/>_`gas=20034+n*11800`_.                                                                |
| `BLS_PUSHR`       | _`- r`_                                         | 推送G1和G2的阶（约为`2^255`）。<br/>_34 gas__34 gas_.                                                                                                                                                                                                                                                                                                     |

`INGROUP`，`ISZERO`在无效的点上（除了cell下溢异常）不会引发异常，而是返回false。

Other arithmetic operations throw an exception if the curve points are invalid. However, they do not verify whether a given point belongs to group G1 or G2. To ensure group membership, use the `INGROUP` instruction.

## RUNVM

Currently there is no way for code in TVM to call external untrusted code "in sandbox". In other words, external code always can irreversibly update code, data of contract, or set actions (such as sending all money).

`RUNVM` instruction allows to spawn an independent VM instance, run desired code and get needed data (stack, registers, gas consumption etc) without risks of polluting caller's state. This ensures the caller's state remains unaffected. Running arbitrary code in a safe way may be useful for [v4-style plugins](/participate/wallets/contracts#wallet-v4), Tact's `init` style subcontract calculation etc.

| Fift syntax   | Stack                                                                                                    | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述                                                                                                                                                                                                                                              |
| :------------ | :------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `flags RUNVM` | _`x_1 ... x_n n code [r] [c4] [c7] [g_l] [g_m] - x'_1 ... x'_m exitcode [data'] [c4'] [c5] [g_c]`_       | Executes a child VM with the given `code` and stack values `x_1 ... x_n`. Returns the modified stack `x'_1 ... x'_m` along with an exit code. <br/> Flags determine other arguments and return values. See details below. |
| `RUNVMX`      | _`x_1 ... x_n n code [r] [c4] [c7] [g_l] [g_m] flags - x'_1 ... x'_m exitcode [data'] [c4'] [c5] [g_c]`_ | It is the same as `RUNVM` but retrieves flags from the stack.                                                                                                                                                                                                             |

标志类似于 fift 中的 `runvmx`：

- `+1`：将c3设置为代码
- `+2`：在运行代码之前推送一个隐式的0
- `+4`：从堆栈中取`c4`（持久性数据），返回其最终值
- `+8`：从堆栈中取gas限制`g_l`，返回消耗的gas `g_c`
- `+16`: 从堆栈中取出 `c7` （智能合约上下文）
- `+32`：返回`c5`的最终值（操作）
- `+64`：从堆栈中弹出硬gas限制（由ACCEPT启用）`g_m`
- `+128`:"孤立的 gas 消耗"。子虚拟机将有一组单独的访问 cell 和一个单独的 chksgn 计数器。
- `+256`: pop integer `r`, return exactly `r` values from the top of the stack (only if `exitcode=0 or 1`; if not enough then `exitcode=stk_und`)
  - If `RUNVM` call succeeds and `r` is set, it returns `r` elements. If `r` is not set, it returns all available elements.
  - If `RUNVM` is successful but lacks elements on the stack, meaning the stack depth is less than `r`, it is treated as an exception in the child VM. The `exit_code` is set to `-3`, and `exit_arg` is set to `0`, so `0` is returned as the only stack element.
  - If `RUNVM` fails with an exception, only one element is returned, `exit_arg`, which should not be confused with `exit_code`.
  - In the case of running out of gas, `exit_code` is set to `-14`, and `exit_arg` contains the amount of gas.

gas成本：

- 66 Gas
- 每向子虚拟机提供一个堆栈元素，就产生 1 个 gas（前 32 个免费）
- 子虚拟机每返回一个堆栈元素，就产生 1 个 gas（前 32 个免费）

## 发送信息

Calculating the cost of sending a message within a contract is difficult. 目前在合约中难以计算发送消息的成本（导致了一些近似，比如在[jettons](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc#L94)中）并且如果 Action Phase 不正确，则无法将请求反弹回。精确减去传入消息的“合约逻辑的常量费用”和“gas费用”是不可能的。

- Bounce a request back if the action phase is incorrect.
- Accurately subtract the sum of a message’s constant contract logic fee and gas expenses from the incoming message.

`SENDMSG`
The `SENDMSG` instruction:

- Takes a `cell` and a `mode` as input.
- Creates an output action and returns the fee for generating a message.

The **mode** behaves similarly to `SENDRAWMSG`, with additional effects:

- `+1024` – fee estimation only, does not create an action.
- `+64` – uses the entire balance of the incoming message as the outgoing value. This is slightly inaccurate since gas expenses that cannot be precomputed are ignored.
- `+128` – substitutes the value of the contract’s entire balance before the computation phase starts. This is slightly inaccurate since gas expenses are not estimated before computation completion and ignored.

**Additional message handling flags**

A `+16` flag has been added for the following operations:

- `SENDRAWMSG`，`RAWRESERVE`，`SETLIBCODE`，`CHANGELIB` - 添加了`+16`标志位，这意味着在操作失败时反弹交易。如果使用了`+2`，则没有效果。
- `RAWRESERVE`
- `SETLIBCODE`
- `CHANGELIB`

**Effect:** if the action fails, a bounce transaction is triggered.\
**Exception:** the flag has **no effect** if `+2` is used.

## 安全审计

对 TON 虚拟机 (TVM) 的升级进行了安全和潜在漏洞分析。

[Trail of Bits  审计报告 - TVM 升级](https://docs.ton.org/audits/TVM_Upgrade_ToB_2023.pdf)

<Feedback />

