import Feedback from '@site/src/components/Feedback';

# TVM upgrade Jul 2023

:::tip
This upgrade was [launched](https://t.me/tonblockchain/223) on the Mainnet in Dec 2023.
:::

## `c7`

`c7` is a register that stores important information needed for contract execution, like time, network configurations, and others.

**Changes to `c7` tuple**

The `c7` tuple has been expanded from 10 to 14 elements:
- **10:** `cell` containing the code of the smart contract itself.
- **11:** `[integer, maybe_dict]`: TON value of the incoming message, including any extracurrency.
- **12:** `integer`, representing fees collected during the storage phase.
- **13:** `tuple` containing information about previous blocks.

**Explanation**



**10:** The smart contract code is now stored as executable data in the TVM, not a cell. This allows it to authorize other contracts of the same type—for example, a jetton-wallet authorizing another jetton-wallet. 

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

Block identifiers follow this structure:

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


## New opcodes

When determining the gas cost for new opcodes, follow this rule of thumb:
- The cost should not be lower than the standard value (calculated from opcode length). 
- The execution time should not exceed **20 ns per gas unit**.

### Opcodes to work with new c7 values
26 gas for each, except for `PREVMCBLOCKS` and `PREVKEYBLOCK` (34 gas).

Each opcode consumes 26 gas, except for `PREVMCBLOCKS` and `PREVKEYBLOCK`, which require 34 gas.

| Fift syntax | Stack             | Description                                                               |
|:-|:------------------|:--------------------------------------------------------------------------|
| `MYCODE` | _`- c`_           | Retrieves the smart contract's code from `c7`.                            |
| `INCOMINGVALUE` | _`- t`_           | Retrieves the value of the incoming message from `c7`.                    |
| `STORAGEFEES` | _`- i`_           | Retrieves the storage phase fees from `c7`.                               |
| `PREVBLOCKSINFOTUPLE` | _`- t`_           | Retrieves `PrevBlocksInfo`: `[last_mc_blocks, prev_key_block]` from `c7`. |
| `PREVMCBLOCKS` | _`- t`_           | Retrieves only `last_mc_blocks`.                                          |
| `PREVKEYBLOCK` | _`- t`_           | Retrieves only `prev_key_block`.                                          |
| `GLOBALID` | _`- i`_           | Retrieves `global_id` from network config  **19**.                        |

## Gas

| Fift syntax | Stack            | Description                                                                                 |
|:-|:-----------------|:--------------------------------------------------------------------------------------------|
| `GASCONSUMED` | _`- g_c`_        | Returns the total gas consumed by the VM so far, including this instruction .<br/>_26 gas_. |

## Arithmetics
New variants of [the division opcode](/v3/documentation/tvm/instructions) `A9mscdf` have been introduced.

New `d=0` variant:
- Takes an additional integer from the stack. 
- Adds it to the intermediate value before performing division or right shift.
- Returns both the quotient and remainder, just like `d=3`.

**Quiet variants** are also available. For example, `QMULADDDIVMOD` or `QUIET MULADDDIVMOD`.

**Error handling**

Non-quiet operations throw an integer overflow exception if:
- The result exceeds `257-bit` integers. 
- The divider is **zero**.

Quiet operations handle errors differently:
- If a value doesn't fit, they return `NaN`.
- If the divider is zero, they return `two NaNs`.

**Gas cost calculation**

Gas cost is determined as 10 plus the opcode length:
- Most opcodes require **26 gas**.
- `LSHIFT#/RSHIFT#` cost an additional **8 gas**.
- Quiet variants also require an extra **8 gas**.

| Fift syntax                          | Stack                                                    |
|:-------------------------------------|:---------------------------------------------------------|
| `MULADDDIVMOD`                       | _`x y w z - q=floor((xy+w)/z) r=(xy+w)-zq`_              |
| `MULADDDIVMODR`                      | _`x y w z - q=round((xy+w)/z) r=(xy+w)-zq`_              |
| `MULADDDIVMODC`                      | _`x y w z - q=ceil((xy+w)/z) r=(xy+w)-zq`_               |
| `ADDDIVMOD`                          | _`x w z - q=floor((x+w)/z) r=(x+w)-zq`_                  |
| `ADDDIVMODR`                         | _`x w z - q=round((x+w)/z) r=(x+w)-zq`_                  |
| `ADDDIVMODC`                         | _`x w y - q=ceil((x+w)/z) r=(x+w)-zq`_                   |
| `ADDRSHIFTMOD`                       | _`x w z - q=floor((x+w)/2^z) r=(x+w)-q*2^z`_             |
| `ADDRSHIFTMODR`                      | _`x w z - q=round((x+w)/2^z) r=(x+w)-q*2^z`_             |
| `ADDRSHIFTMODC`                      | _`x w z - q=ceil((x+w)/2^z) r=(x+w)-q*2^z`_              |
| `z ADDRSHIFT#MOD`                    | _`x w - q=floor((x+w)/2^z) r=(x+w)-q*2^z`_               |
| `z ADDRSHIFTR#MOD`                   | _`x w - q=round((x+w)/2^z) r=(x+w)-q*2^z`_               |
| `z ADDRSHIFTC#MOD`                   | _`x w - q=ceil((x+w)/2^z) r=(x+w)-q*2^z`_                |
| `MULADDRSHIFTMOD`                    | _`x y w z - q=floor((xy+w)/2^z) r=(xy+w)-q*2^z`_         |
| `MULADDRSHIFTRMOD`                   | _`x y w z - q=round((xy+w)/2^z) r=(xy+w)-q*2^z`_         |
| `MULADDRSHIFTCMOD`                   | _`x y w z - q=ceil((xy+w)/2^z) r=(xy+w)-q*2^z`_          |
| `z MULADDRSHIFT#MOD`                 | _`x y w - q=floor((xy+w)/2^z) r=(xy+w)-q*2^z`_           |
| `z MULADDRSHIFTR#MOD`                | _`x y w - q=round((xy+w)/2^z) r=(xy+w)-q*2^z`_           |
| `z MULADDRSHIFTC#MOD`                | _`x y w - q=ceil((xy+w)/2^z) r=(xy+w)-q*2^z`_            |
| `LSHIFTADDDIVMOD`                    | _`x w z y - q=floor((x*2^y+w)/z) r=(x*2^y+w)-zq`_        |
| `LSHIFTADDDIVMODR`                   | _`x w z y - q=round((x*2^y+w)/z) r=(x*2^y+w)-zq`_        |
| `LSHIFTADDDIVMODC`                   | _`x w z y - q=ceil((x*2^y+w)/z) r=(x*2^y+w)-zq`_         |
| `y LSHIFT#ADDDIVMOD`                 | _`x w z - q=floor((x*2^y+w)/z) r=(x*2^y+w)-zq`_          |
| `y LSHIFT#ADDDIVMODR`                | _`x w z - q=round((x*2^y+w)/z) r=(x*2^y+w)-zq`_          |
| `y LSHIFT#ADDDIVMODC`                | _`x w z - q=ceil((x*2^y+w)/z) r=(x*2^y+w)-zq`_           |

## Stack operations

**Previous limitations**
- All stack operation arguments are limited to 256. 
- This makes managing deep stack elements difficult when the stack grows beyond 256. 
- In most cases, this limit is not imposed for safety reasons—it's not about preventing excessive computation costs.


For certain mass stack operations, such as `ROLLREV`, computation time scales linearly with the argument value, and as a result, the gas cost also increases linearly.

**Updated behavior**

The argument limits for the following operations have been removed:
- `PICK`, `ROLL`, `ROLLREV`, `BLKSWX`, `REVX`, `DROPX`, `XCHGX`, `CHKDEPTH`, `ONLYTOPX`, `ONLYX`.

**Gas cost adjustments for large arguments**

Certain operations now consume additional gas when arguments exceed 255:
- `ROLL`, `ROLLREV`, `REVX`, `ONLYTOPX`: additional gas cost is calculated as: `max(arg−255,0)`. _For arguments ≤ 255, gas consumption remains unchanged_.

- `BLKSWX`: additional gas cost is determined by: `max(arg1+arg2-255,0)`. _This differs from previous behavior, where both arguments were limited to 255_.




## Hashes

Previously, TVM supported only two hash operations:
- Computing the representation hash of a `cell` or `slice`.
- Calculating the SHA-256 hash of data, but only for inputs up to 127 bytes, as this is the maximum data that fits into a single cell.

**New hash operations (`HASHEXT[A][R]_(HASH)`)**
A new family of hash operations has been introduced to extend TVM's hashing capabilities:

| Fift syntax        | Stack                    | Description                                                                     |
|:-------------------|:-------------------------|:--------------------------------------------------------------------------------|
| `HASHEXT_(HASH)`   | _`s_1 ... s_n n - h`_    | Computes the hash of the concatenation of slices or builders `s_1...s_n`.       |
| `HASHEXTR_(HASH)`  | _`s_n ... s_1 n - h`_    | Same as `HASHEXT_(HASH)`, but the arguments are given in reverse order.         |
| `HASHEXTA_(HASH)`  | _`b s_1 ... s_n n - b'`_ | Appends the resulting hash to a builder `b` instead of pushing it to the stack. |
| `HASHEXTAR_(HASH)` | _`b s_n ... s_1 n - b'`_ | Same as `HASHEXTA_(HASH)`, but with arguments in reverse order.                 |


**Key behavior and constraints**
- Only the bits from the root cells of `s_i` are used for hashing.
- Each chunk `s_i` may contain a non-integer number of bytes, but the total number of bits across all chunks must be divisible by 8.
- TON follows most-significant bit ordering, meaning that bits from the first slice become the most significant when concatenating two slices with non-integer byte lengths.

**Gas consumption**

- Gas cost depends on the number of hashed bytes and the chosen algorithm.
- An additional 1 gas unit is consumed per chunk.
- Gas usage is rounded down.

**Hashing result format**

If `[A]` is not enabled, the result is returned as an unsigned integer if it fits within 256 bits. Otherwise, it is returned as a tuple of integers.


| **Algorithm**  | **Implementation**                                | **Gas cost (per byte)** | **Hash size** |
|----------------|---------------------------------------------------|-------------------------|---------------|
| **SHA-256**    | OpenSSL                                           | 1/33                    | 256 bits      |
| **SHA-512**    | OpenSSL                                           | 1/16                    | 512 bits      |
| **BLAKE2B**    | OpenSSL                                           | 1/19                    | 512 bits      |
| **KECCAK-256** | [Ethereum-compatible](http://keccak.noekeon.org/) | 1/11                    | 256 bits      |
| **KECCAK-512** | [Ethereum-compatible](http://keccak.noekeon.org/) | 1/6                     | 512 bits      |


## Crypto
Currently, the only cryptographic algorithm available is `CHKSIGN`: it checks the `Ed25519`-signature of a hash `h` for a public key `k`.
- For compatibility with previous generation blockchains such as Bitcoin and Ethereum, we must also check `secp256k1` signatures.
- For modern cryptographic algorithms, the bare minimum includes curve addition and multiplication.
- For compatibility with Ethereum 2.0 PoS and some other modern cryptography, we need the BLS-signature scheme on the `bls12-381` curve.
- For some secure hardware, one of `secp256r1`, `P256`, or `prime256v1` is needed.



### secp256k1
Used for Bitcoin/Ethereum signatures. This implementation uses the [libsecp256k1 library](https://github.com/bitcoin-core/secp256k1).

| Fift syntax | Stack | Description                                                                                                                                                                                                                                                                                                                                  |
|:-|:-|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ECRECOVER` | _`hash v r s - 0 or h x1 x2 -1`_ | Recovers the public key from the signature, similar to Bitcoin/Ethereum operations. It takes a 32-byte hash as uint256 `hash`, a 65-byte signature as uint8 `v`, and uint256 `r` and `s`. Returns `0` on failure or the public key and `-1` on success. The 65-byte public key is returned as uint8 `h`, uint256 `x1`, `x2`. <br/>_1526 gas_ |

### secp256r1
Uses OpenSSL implementation. The interface is similar to `CHKSIGNS`/`CHKSIGNU`. It is compatible with Apple Secure Enclave.




| Fift syntax     | Stack           | Description                                                                                                                                                                                                                                                                                                                                                                                     |
|:----------------|:----------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `P256_CHKSIGNS` | _`d sig k - ?`_ | Checks the `secp256r1` signature `sig` of the data portion of slice `d` and the public key `k`. Returns `-1` on success or `0` on failure. <br/> The public key is a 33-byte slice (encoded according to Section 2.3.4, point 2 of [SECG SEC 1](https://www.secg.org/sec1-v2.pdf)). <br/> The signature `sig` is a 64-byte slice (two 256-bit unsigned integers `r` and `s`). <br/> _3526 gas_. |
| `P256_CHKSIGNU` | _`h sig k - ?`_ | It is the same as `P256_CHKSIGNS`, but the signed data is a 32-byte encoding of the 256-bit unsigned integer `h`. <br/> _3526 gas_.                                                                                                                                                                                                                                                             |

### Ristretto
 
Extended documentation is available [here](https://ristretto.group/). Curve25519 is known for its high performance but has a drawback: group elements can have multiple representations. Simple cryptographic protocols like Schnorr signatures and Diffie-Hellman use workarounds to address this issue, but these solutions break key derivation and key blinding schemes. More complex protocols like Bulletproofs cannot rely on these tricks.

**Ristretto** solves this problem by providing an arithmetic abstraction over Curve25519, ensuring each group element has a unique representation. It acts as a compression and decompression layer, maintaining the speed of Curve25519 while making cryptographic protocols easier to implement correctly. One key advantage of Ristretto is that it allows the seamless performance of Curve25519 operations, though the reverse is not true. 

As a result, adding Ristretto support effectively means adding both Ristretto and Curve25519 operations in a single step.


The implementation is based on [libsodium](https://github.com/jedisct1/libsodium/).

**Representation in TVM**
- All ristretto-255 points are represented as 256-bit unsigned integers. 
- Invalid points cause a `range_chk` throw in non-quiet operations.
- The zero point is represented as integer `0`.

| Fift syntax | Stack | Description                                                                                                   |
|:-|:-|:--------------------------------------------------------------------------------------------------------------|
| `RIST255_FROMHASH` | _`h1 h2 - x`_ | Generates a valid point `x` from a 512-bit hash (two 256-bit integers).<br/>_626 gas_.                        |
| `RIST255_VALIDATE` | _`x -`_ | Verifies that `x` is a valid curve point representation. If invalid, throws `range_chk`.<br/>_226 gas_        |
| `RIST255_ADD` | _`x y - x+y`_ | Adds two points on the curve.<br/>_626 gas_                                                                   |
| `RIST255_SUB` | _`x y - x-y`_ | Subtracts one curve point from another. <br/>_626 gas_                                                        |
| `RIST255_MUL` | _`x n - x*n`_ | Multiplies a curve point `x` by a scalar `n`.<br/>Any `n` is valid, including negative.<br/>_2026 gas_.       |
| `RIST255_MULBASE` | _`n - g*n`_ | Multiplies the generator point `g` by a scalar `n`.<br/>Any `n` is valid, including negative.<br/>_776 gas_   |
| `RIST255_PUSHL` | _`- l`_ | Pushes the integer `l=2^252+27742317777372353535851937790883648493`, which is the group`s order.<br/>_26 gas_ |
| `RIST255_QVALIDATE` | _`x - 0 or -1`_ | Quiet version of `RIST255_VALIDATE`.<br/>_234 gas_.                                                           |
| `RIST255_QADD` | _`x y - 0 or x+y -1`_ | Quiet version of `RIST255_ADD`. <br/>_634 gas_.                                                               |
| `RIST255_QSUB` | _`x y - 0 or x-y -1`_ | Quiet version of `RIST255_SUB`.<br/>_634 gas_.                                                                |
| `RIST255_QMUL` | _`x n - 0 or x*n -1`_ | Quiet version of `RIST255_MUL`.<br/>_2034 gas_.                                                               |
| `RIST255_QMULBASE` | _`n - 0 or g*n -1`_ | Quiet version of `RIST255_MULBASE`.<br/>_784 gas_.                                                            |

### BLS12-381
Operations on the pairing-friendly BLS12-381 curve using the [BLST](https://github.com/supranational/blst) implementation. It includes operations for the BLS signature scheme, which is based on this curve.

BLS values are represented in TVM in the following way:
- G1-points and public keys: 48-byte slice.
- G2-points and signatures: 96-byte slice.
- Elements of field FP: 48-byte slice.
- Elements of field FP2: 96-byte slice.
- Messages: slice. Several bits should be divisible by 8.

**Handling input sizes**
- If an input point or field element exceeds 48/96 bytes, only the first 48/96 bytes are considered.
- If an input slice is too short or a message's bit size isn't divisible by 8, a cell underflow exception is thrown.

#### High-level operations
These high-level operations are designed to verify BLS signatures efficiently.

| Fift syntax | Stack                                      | Description                                                                                                                                                                             |
|:-|:-------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `BLS_VERIFY` | _`pk msg sgn - bool`_                      | Checks a BLS signature. It returns true  if valid, false otherwise.<br/>_61034 gas_.                                                                                                    |
| `BLS_AGGREGATE` | _`sig_1 ... sig_n n - sig`_                | Aggregates signatures. `n>0`. Throws an exception if `n=0` or if any `sig_i` is invalid .<br/>_`gas=n*4350-2616`_.                                                                      |
| `BLS_FASTAGGREGATEVERIFY`- | _`pk_1 ... pk_n n msg sig - bool`_         | Checks an aggregated BLS signature for keys `pk_1...pk_n` and a message `msg`. It returns false if `n=0`.<br/>_`gas=58034+n*3000`_.                                                     |
| `BLS_AGGREGATEVERIFY` | _`pk_1 msg_1 ... pk_n msg_n n sgn - bool`_ | Checks an aggregated BLS signature for multiple key-message pairs `pk_1 msg_1...pk_n msg_n`. Returns true if valid, false otherwise. Returns false if `n=0`.<br/>_`gas=38534+n*22500`_ |


`VERIFY` instructions
- These instructions do not throw exceptions for invalid signatures or public keys. 
- The only exceptions occur due to cell underflow errors. 
- If verification fails, it returns false.

#### Low-level operations
These operations perform arithmetic computations on group elements.

| Fift syntax | Stack | Description                                                                                                                                                                                                                      |
|:-|:-|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `BLS_G1_ADD` | _`x y - x+y`_ | Performs addition on G1.<br/>_3934 gas_.                                                                                                                                                                                         |
| `BLS_G1_SUB` | _`x y - x-y`_ | Performs subtraction on G1.<br/>_3934 gas_.                                                                                                                                                                                      |
| `BLS_G1_NEG` | _`x - -x`_ | Performs negation on G1.<br/>_784 gas_.                                                                                                                                                                                          |
| `BLS_G1_MUL` | _`x s - x*s`_ | Multiplies G1 point `x` by scalar `s`.<br/>Any `s` is valid, including negative.<br/>_5234 gas_.                                                                                                                                 |
| `BLS_G1_MULTIEXP` | _`x_1 s_1 ... x_n s_n n - x_1*s_1+...+x_n*s_n`_ | Calculates `x_1*s_1+...+x_n*s_n` for G1 points `x_i` and scalars `s_i`. Returns zero point if `n=0`.<br/>Any `s_i` is valid, including negative.<br/>_`gas=11409+n*630+n/floor(max(log2(n),4))*8820`_.                           |
| `BLS_G1_ZERO` | _`- zero`_ | Pushes zero point in G1.<br/>_34 gas_.                                                                                                                                                                                           |
| `BLS_MAP_TO_G1` | _`f - x`_ | Converts an FP element `f` to a G1 point.<br/>_2384 gas_.                                                                                                                                                                        |
| `BLS_G1_INGROUP` | _`x - bool`_ | Checks whether the slice `x` represents a valid element of G1.<br/>_2984 gas_.                                                                                                                                                   |
| `BLS_G1_ISZERO` | _`x - bool`_ | Checks if G1 point `x` is equal to zero.<br/>_34 gas_.                                                                                                                                                                           |
| `BLS_G2_ADD` | _`x y - x+y`_ | Performs addition on G2.<br/>_6134 gas_.                                                                                                                                                                                         |
| `BLS_G2_SUB` | _`x y - x-y`_ | Performs subtraction on G2.<br/>_6134 gas_.                                                                                                                                                                                      |
| `BLS_G2_NEG` | _`x - -x`_ | Performs negation on G2.<br/>_1584 gas_.                                                                                                                                                                                         |
| `BLS_G2_MUL` | _`x s - x*s`_ | Multiplies G2 point `x` by scalar `s`.<br/>Any `s` is valid, including negative.<br/>_10584 gas_.                                                                                                                                |
| `BLS_G2_MULTIEXP` | _`x_1 s_1 ... x_n s_n n - x_1*s_1+...+x_n*s_n`_ | Calculates `x_1*s_1+...+x_n*s_n` for G2 points `x_i` and scalars `s_i`. Returns zero point if `n=0`.<br/>Any `s_i` is valid, including negative.<br/>_`gas=30422+n*1280+n/floor(max(log2(n),4))*22840`_ .                        |
| `BLS_G2_ZERO` | _`- zero`_ | Pushes zero point in G2.<br/>_34 gas_.                                                                                                                                                                                           |
| `BLS_MAP_TO_G2` | _`f - x`_ | Converts an FP2 element `f` to a G2 point.<br/>_7984 gas_.                                                                                                                                                                       |
| `BLS_G2_INGROUP` | _`x - bool`_ | Checks whether the slice `x` represents a valid element of G2.<br/>_4284 gas_.                                                                                                                                                   |
| `BLS_G2_ISZERO` | _`x - bool`_ | Checks if G2 point `x` is equal to zero.<br/>_34 gas_.                                                                                                                                                                           |
| `BLS_PAIRING` | _`x_1 y_1 ... x_n y_n n - bool`_ | Given G1 points `x_i` and G2 points `y_i`, calculates and multiply pairings of `x_i,y_i`. Returns true if the result is the multiplicative identity in FP12, false otherwise. Returns false if `n=0`.<br/>_`gas=20034+n*11800`_. |
| `BLS_PUSHR` | _`- r`_ | Pushes the order of G1 and G2, approximately `2^255` .<br/>_34 gas_.                                                                                                                                                             |


`INGROUP` and `ISZERO` do not throw exceptions for invalid points except in cases of cell underflow; instead, they return false.

Other arithmetic operations throw an exception if the curve points are invalid. However, they do not verify whether a given point belongs to group G1 or G2. To ensure group membership, use the `INGROUP` instruction.


## RUNVM


Currently, TVM does not provide a mechanism for executing external untrusted code within a secure sandbox environment. In other words, any external code invoked has unrestricted access and can permanently modify the contract's code and data or trigger actions such as transferring all funds.

The `RUNVM` instruction creates an isolated VM instance, allowing code execution while safely retrieving data such as stack state, registers, and gas consumption. This ensures the caller's state remains unaffected. This allows arbitrary code to run safely, which is helpful for [v4-style plugins](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts#wallet-v4), Tact's `init`-style subcontract calculations, and similar use cases.

| Fift syntax | Stack | Description                                                                                                                                                                                                                                                                                                                                                                                                          |
|:-|:-|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `flags RUNVM` | _`x_1 ... x_n n code [r] [c4] [c7] [g_l] [g_m] - x'_1 ... x'_m exitcode [data'] [c4'] [c5] [g_c]`_ | Executes a child VM with the given `code` and stack values `x_1 ... x_n`. Returns the modified stack `x'_1 ... x'_m` along with an exit code. <br/> Flags determine other arguments and return values. See details below.|
| `RUNVMX` | _`x_1 ... x_n n code [r] [c4] [c7] [g_l] [g_m] flags - x'_1 ... x'_m exitcode [data'] [c4'] [c5] [g_c]`_ | It is the same as `RUNVM` but retrieves flags from the stack.                                                                                                                                                                                                                                                                                                                                                        |


Flags operate similarly to `RUNVMX` in Fift:

- `+1`: sets `c3` to code.
- `+2`: pushes an implicit `0` before executing the code.
- `+4`: takes persistent data `c4` from the stack and returns its final value.
- `+8`: takes the gas limit `g_l` from the stack and returns the consumed gas `g_c`.
- `+16`: takes `c7` (smart contract context) from the stack.
- `+32`: returns the final value of `c5` (actions).
- `+64`: pops the hard gas limit `g_m` enabled by `ACCEPT` from the stack.
- `+128`: enables "isolated gas consumption", meaning the child VM maintains a separate set of visited cells and a `chksgn` counter.
- `+256`: pops an integer `r` and ensures exactly `r` values are returned from the top of the stack:
  - If `RUNVM` call succeeds and `r` is set, it returns `r` elements. If `r` is not set, it returns all available elements.
  - If `RUNVM` is successful but lacks elements on the stack, meaning the stack depth is less than `r`, it is treated as an exception in the child VM. The `exit_code` is set to `-3`, and `exit_arg` is set to `0`, so `0` is returned as the only stack element.
  - If `RUNVM` fails with an exception, only one element is returned, `exit_arg`, which should not be confused with `exit_code`.
  - In the case of running out of gas, `exit_code` is set to `-14`, and `exit_arg` contains the amount of gas.

Gas cost:
- 66 gas;
- 1 gas for each stack element passed to the child VM (the first 32 elements are free);
- 1 gas for each stack element returned from the child VM (the first 32 elements are free).



## Sending messages

Calculating the cost of sending a message within a contract is difficult. This leads to **approximations**, for example, as seen in [jettons](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc#L94), and makes it **impossible** to:
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
- `SENDRAWMSG`
- `RAWRESERVE` 
- `SETLIBCODE` 
- `CHANGELIB`

**Effect:** if the action fails, a bounce transaction is triggered.  
**Exception:** the flag has **no effect** if `+2` is used.

## Security audits

The upgrade to the TON Virtual Machine (TVM) was analyzed for security risks and potential vulnerabilities.

**Audit firm**: Trail of Bits  
**Audit report**: [TON Blockchain TVM Upgrade](https://docs.ton.org/audits/TVM_Upgrade_ToB_2023.pdf)

<Feedback />

