# TVM Upgrade 2023.07

:::tip
This upgrade launched [run](https://t.me/tonblockchain/223) on the Mainnet from December 2023.
:::


# c7

**c7** is the register in which local context information needed for contract execution
(such as time, lt, network configs, etc) is stored.

**c7** tuple extended from 10 to 14 elements:
* **10**: `cell` with code of the smart contract itself.
* **11**: `[integer, maybe_dict]`: TON value of the incoming message, extracurrency.
* **12**: `integer`, fees collected in the storage phase.
* **13**: `tuple` with information about previous blocks.

**10** Currently code of the smart contract is presented on TVM level only as executable continuation
and can not be transformed to cell. This code is often used to authorize a neighbor contract
of the same kind, for instance jetton-wallet authorizes jetton-wallet. For now we need
to explicitly store code cell in storage which make storage and init_wrapper more cumbersome than it could be.
Using **10** for code is compatible to Everscale update of tvm.

**11** Currently value of the incoming message is presented on stack after TVM initiation, so if needed during execution,
one either need to store it to global variable or pass through local variables
(at funC level it looks like additional `msg_value` argument in all functions).
By putting it to **11** element we will repeat behavior of contract balance: it is presented both on stack and in c7.

**12** Currently the only way to calculate storage fees is to store balance in the previous transaction,
somehow calculate gas usage in prev transaction and then compare to current balance minus message value.
Meanwhile, is often desired to account storage fees.

**13** Currently there is no way to retrieve data on previous blocks. One of the kill features of TON is that every structure
is a Merkle-proof friendly bag (tree) of cells, moreover TVM is cell and merkle-proof friendly as well.
That way, if we include information on the blocks to TVM context it will be possible to make many trustless scenarios: contract A may check transactions on contract B (without B's cooperation), it is possible to recover broken chains of messages (when recover-contract gets and checks proofs that some transaction occurred but reverted), knowing masterchain block hashes is also required to make some validation fisherman functions onchain.

Block ids are presented in the following format:
```
[ wc:Integer shard:Integer seqno:Integer root_hash:Integer file_hash:Integer ] = BlockId;
[ last_mc_blocks:[BlockId0, BlockId1, ..., BlockId15]
  prev_key_block:BlockId ] : PrevBlocksInfo
```  
Ids of the last 16 blocks of masterchain are included  (or less if masterchain seqno is less than 16), as well as the last key block.
Inclusion of data on shardblocks may cause some data availability issues (due to merge/split events),
it is not necessarily required (since any event/data can by proven using masterchain blocks) and thus we decided not to include it.

# New opcodes
Rule of thumb when choosing gas cost on new opcodes is that it should not be less than normal (calculated from opcode length) and should take no more than 20 ns per gas unit.

## Opcodes to work with new c7 values
26 gas for each, except for `PREVMCBLOCKS` and `PREVKEYBLOCK` (34 gas).

| xxxxxxxxxxxxxxxxxxxxxx<br/>Fift syntax | xxxxxxxxx<br/>Stack | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Description               |
|:-|:-|:--------------------------------------------------------------------|
| `MYCODE` | _`- c`_ | Retrieves code of smart-contract from c7                            |
| `INCOMINGVALUE` | _`- t`_ | Retrieves value of incoming message from c7                         |
| `STORAGEFEES` | _`- i`_ | Retrieves value of storage phase fees from c7                       |
| `PREVBLOCKSINFOTUPLE` | _`- t`_ | Retrieves PrevBlocksInfo: `[last_mc_blocks, prev_key_block]` from c7 |
| `PREVMCBLOCKS` | _`- t`_ | Retrieves only `last_mc_blocks`                                     |
| `PREVKEYBLOCK` | _`- t`_ | Retrieves only `prev_key_block`                                     |
| `GLOBALID` | _`- i`_ | Retrieves `global_id` from 19 network config                        |

## Gas

| xxxxxxxxxxxxxx<br/>Fift syntax | xxxxxxxx<br/>Stack | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Description                       |
|:-|:-|:-----------------------------------------------------------------------------|
| `GASCONSUMED` | _`- g_c`_ | Returns gas consumed by VM so far (including this instruction).<br/>_26 gas_ |

## Arithmetics
New variants of [the division opcode](/v3/documentation/tvm/instructions) (`A9mscdf`) are added:
`d=0` takes one additional integer from stack and adds it to the intermediate value before division/rshift. These operations return both the quotient and the remainder (just like `d=3`).

Quiet variants are also available (e.g. `QMULADDDIVMOD` or `QUIET MULADDDIVMOD`).

If return values don't fit into 257-bit integers or the divider is zero, non-quiet operation throws an integer overflow exception. Quiet operations return `NaN` instead of the value that doesn't fit (two `NaN`s if the divider is zero).

Gas cost is equal to 10 plus opcode length: 26 for most opcodes, +8 for `LSHIFT#`/`RSHIFT#`, +8 for quiet.

| xxxxxxxxxxxxxxxxxxxxxx<br/>Fift syntax | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Stack |
|:-|:-|
| `MULADDDIVMOD` | _`x y w z - q=floor((xy+w)/z) r=(xy+w)-zq`_              |
| `MULADDDIVMODR` | _`x y w z - q=round((xy+w)/z) r=(xy+w)-zq`_              |
| `MULADDDIVMODC` | _`x y w z - q=ceil((xy+w)/z) r=(xy+w)-zq`_               |
| `ADDDIVMOD` | _`x w z - q=floor((x+w)/z) r=(x+w)-zq`_                  |
| `ADDDIVMODR` | _`x w z - q=round((x+w)/z) r=(x+w)-zq`_                  |
| `ADDDIVMODC` | _`x w y - q=ceil((x+w)/z) r=(x+w)-zq`_                   |
| `ADDRSHIFTMOD` | _`x w z - q=floor((x+w)/2^z) r=(x+w)-q*2^z`_             |
| `ADDRSHIFTMODR` | _`x w z - q=round((x+w)/2^z) r=(x+w)-q*2^z`_             |
| `ADDRSHIFTMODC` | _`x w z - q=ceil((x+w)/2^z) r=(x+w)-q*2^z`_              |
| `z ADDRSHIFT#MOD` | _`x w - q=floor((x+w)/2^z) r=(x+w)-q*2^z`_               |
| `z ADDRSHIFTR#MOD` | _`x w - q=round((x+w)/2^z) r=(x+w)-q*2^z`_               |
| `z ADDRSHIFTC#MOD` | _`x w - q=ceil((x+w)/2^z) r=(x+w)-q*2^z`_                |
| `MULADDRSHIFTMOD` | _`x y w z - q=floor((xy+w)/2^z) r=(xy+w)-q*2^z`_         |
| `MULADDRSHIFTRMOD` | _`x y w z - q=round((xy+w)/2^z) r=(xy+w)-q*2^z`_         |
| `MULADDRSHIFTCMOD` | _`x y w z - q=ceil((xy+w)/2^z) r=(xy+w)-q*2^z`_          |
| `z MULADDRSHIFT#MOD` | _`x y w - q=floor((xy+w)/2^z) r=(xy+w)-q*2^z`_           |
| `z MULADDRSHIFTR#MOD` | _`x y w - q=round((xy+w)/2^z) r=(xy+w)-q*2^z`_           |
| `z MULADDRSHIFTC#MOD` | _`x y w - q=ceil((xy+w)/2^z) r=(xy+w)-q*2^z`_            |
| `LSHIFTADDDIVMOD` | _`x w z y - q=floor((x*2^y+w)/z) r=(x*2^y+w)-zq`_        |
| `LSHIFTADDDIVMODR` | _`x w z y - q=round((x*2^y+w)/z) r=(x*2^y+w)-zq`_        |
| `LSHIFTADDDIVMODC` | _`x w z y - q=ceil((x*2^y+w)/z) r=(x*2^y+w)-zq`_         |
| `y LSHIFT#ADDDIVMOD` | _`x w z - q=floor((x*2^y+w)/z) r=(x*2^y+w)-zq`_          |
| `y LSHIFT#ADDDIVMODR` | _`x w z - q=round((x*2^y+w)/z) r=(x*2^y+w)-zq`_          |
| `y LSHIFT#ADDDIVMODC` | _`x w z - q=ceil((x*2^y+w)/z) r=(x*2^y+w)-zq`_           |

## Stack operations
Currently arguments of all stack operations are bounded by 256.
That means that if stack become deeper than 256 it becomes difficult to manage deep stack elements.
In most cases there are no safety reasons for that limit, i.e. arguments are not limited to prevent too expensive operations.
For some mass stack operations, such as `ROLLREV` (where computation time linearly depends on argument value) gas cost also linearly depends on argument value.
- Arguments of `PICK`, `ROLL`, `ROLLREV`, `BLKSWX`, `REVX`, `DROPX`, `XCHGX`, `CHKDEPTH`, `ONLYTOPX`, `ONLYX` are now unlimited.
- `ROLL`, `ROLLREV`, `REVX`, `ONLYTOPX` consume more gas when arguments are big: additional gas cost is `max(arg-255,0)` (for argument less than 256 the gas consumption is constant and corresponds to the current behavior)
- For `BLKSWX`, additional cost is `max(arg1+arg2-255,0)` (this does not correspond to the current behavior, since currently both `arg1` and `arg2` are limited to 255).

## Hashes
Currently only two hash operations are available in TVM: calculation of representation hash of cell/slice, and sha256 of data, but only up to 127 bytes (only that much data fits into one cell).

`HASHEXT[A][R]_(HASH)` family of operations is added:

| xxxxxxxxxxxxxxxxxxx<br/>Fift syntax | xxxxxxxxxxxxxxxxxxxxxx<br/>Stack | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Description                                |
|:-|:-|:--------------------------------------------------------------------------------------|
| `HASHEXT_(HASH)` | _`s_1 ... s_n n - h`_            | Calculates and returns hash of the concatenation of slices (or builders) `s_1...s_n`. |
| `HASHEXTR_(HASH)` | _`s_n ... s_1 n - h`_            | Same thing, but arguments are given in reverse order.                                 |
| `HASHEXTA_(HASH)` | _`b s_1 ... s_n n - b'`_         | Appends the resulting hash to a builder `b` instead of pushing it to the stack.       |
| `HASHEXTAR_(HASH)` | _`b s_n ... s_1 n - b'`_         | Arguments are given in reverse order, appends hash to builder.                        |

Only the bits from root cells of `s_i` are used.

Each chunk `s_i` may contain non-integer number of bytes. However, the sum of bits of all chunks should be divisible by 8.
Note that TON uses most-significant bit ordering, so when two slices with non-integer number of bytes are concatenated, bits from the first slice become most-significant bits.

Gas consumption depends on the number of hashed bytes and the chosen algorithm. Additional 1 gas unit is consumed per chunk.

If `[A]` is not enabled, the result of hashing will be returned as an unsigned integer if fits 256 bits or tuple of ints otherwise.

The following algorithms are available:
- `SHA256` - openssl implementation, 1/33 gas per byte, hash is 256 bits.
- `SHA512` - openssl implementation, 1/16 gas per byte, hash is 512 bits.
- `BLAKE2B` - openssl implementation, 1/19 gas per byte, hash is 512 bits.
- `KECCAK256` - [ethereum compatible implementation](http://keccak.noekeon.org/), 1/11 gas per byte, hash is 256 bits.
- `KECCAK512` - [ethereum compatible implementation](http://keccak.noekeon.org/), 1/6 gas per byte, hash is 512 bits.

Gas usage is rounded down.

## Crypto
Currently the only cryptographic algorithm available is `CHKSIGN`: check the Ed25519-signature of a hash `h` for a public key `k`.

- For compatibility with prev generation blockchains such as Bitcoin and Ethereum we also need checking `secp256k1` signatures.
- For modern cryptographic algorithms the bare minimum is curve addition and multiplication.
- For compatibility with Ethereum 2.0 PoS and some other modern cryptography we need BLS-signature scheme on bls12-381 curve.
- For some secure hardware secp256r1 == P256 == prime256v1 is needed.

### secp256k1
Bitcoin/ethereum signatures. Uses [libsecp256k1 implementation](https://github.com/bitcoin-core/secp256k1).

| xxxxxxxxxxxxx<br/>Fift syntax | xxxxxxxxxxxxxxxxx<br/>Stack | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Description |
|:-|:-|:-|
| `ECRECOVER` | _`hash v r s - 0 or h x1 x2 -1`_ | Recovers public key from signature, identical to Bitcoin/Ethereum operations.<br/>Takes 32-byte hash as uint256 `hash`; 65-byte signature as uint8 `v` and uint256 `r`, `s`.<br/>Returns `0` on failure, public key and `-1` on success.<br/>65-byte public key is returned as uint8 `h`, uint256 `x1`, `x2`.<br/>_1526 gas_ |

### secp256r1
Uses OpenSSL implementation. Interface is similar to `CHKSIGNS`/`CHKSIGNU`. Compatible with Apple Secure Enclave.


| xxxxxxxxxxxxx<br/>Fift syntax | xxxxxxxxxxxxxxxxx<br/>Stack | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Description |
|:-|:-|:-|
| `P256_CHKSIGNS` | _`d sig k - ?`_ | Checks seck256r1-signature `sig` of data portion of slice `d` and public key `k`. Returns -1 on success, 0 on failure.<br/>Public key is a 33-byte slice (encoded according to Sec. 2.3.4 point 2 of [SECG SEC 1](https://www.secg.org/sec1-v2.pdf)).<br/>Signature `sig` is a 64-byte slice (two 256-bit unsigned integers `r` and `s`).<br/>_3526 gas_ |
| `P256_CHKSIGNU` | _`h sig k - ?`_ | Same thing, but the signed data is 32-byte encoding of 256-bit unsigned integer `h`.<br/>_3526 gas_ |

### Ristretto
Extended docs are [here](https://ristretto.group/). In short, Curve25519 was developed with performance in mind, however it exhibits symmetry due to which group elements have multiple representations. Simpler protocols such as Schnorr signatures or Diffie-Hellman apply tricks at the protocol level to mitigate some issues, but break key derivation and key blinding schemes. And those tricks do not scale to more complex protocols such as Bulletproofs. Ristretto is an arithmetic abstraction over Curve25519 such that each group element corresponds to a unique point, which is the requirement for most cryptographic protocols. Ristretto is essentially a compression/decompression protocol for Curve25519 that offers the required arithmetic abstraction. As a result, crypto protocols are easy to write correctly, while benefiting from the high performance of Curve25519.

Ristretto operations allow calculating curve operations on Curve25519 (the reverse is not true), thus we can consider that we add both Ristretto and Curve25519 curve operation in one step. 

[libsodium](https://github.com/jedisct1/libsodium/) implementation is used.

All ristretto-255 points are represented in TVM as 256-bit unsigned integers.
Non-quiet operations throw `range_chk` if arguments are not valid encoded points.
Zero point is represented as integer `0`.

| xxxxxxxxxxxxx<br/>Fift syntax | xxxxxxxxxxxxxxxxx<br/>Stack | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Description                                                        |
|:-|:-|:------------------------------------------------------------------------------------------------------------------|
| `RIST255_FROMHASH` | _`h1 h2 - x`_ | Deterministically generates a valid point `x` from a 512-bit hash (given as two 256-bit integers).<br/>_626 gas_  |
| `RIST255_VALIDATE` | _`x -`_ | Checks that integer `x` is a valid representation of some curve point. Throws `range_chk` on error.<br/>_226 gas_ |
| `RIST255_ADD` | _`x y - x+y`_ | Addition of two points on a curve.<br/>_626 gas_                                                                  |
| `RIST255_SUB` | _`x y - x-y`_ | Subtraction of two points on curve.<br/>_626 gas_                                                                 |
| `RIST255_MUL` | _`x n - x*n`_ | Multiplies point `x` by a scalar `n`.<br/>Any `n` is valid, including negative.<br/>_2026 gas_                    |
| `RIST255_MULBASE` | _`n - g*n`_ | Multiplies the generator point `g` by a scalar `n`.<br/>Any `n` is valid, including negative.<br/>_776 gas_       |
| `RIST255_PUSHL` | _`- l`_ | Pushes integer `l=2^252+27742317777372353535851937790883648493`, which is the order of the group.<br/>_26 gas_    |
| `RIST255_QVALIDATE` | _`x - 0 or -1`_ | Quiet version of `RIST255_VALIDATE`.<br/>_234 gas_                                                                |
| `RIST255_QADD` | _`x y - 0 or x+y -1`_ | Quiet version of `RIST255_ADD`. <br/>_634 gas_                                                                    |
| `RIST255_QSUB` | _`x y - 0 or x-y -1`_ | Quiet version of `RIST255_SUB`.<br/>_634 gas_                                                                     |
| `RIST255_QMUL` | _`x n - 0 or x*n -1`_ | Quiet version of `RIST255_MUL`.<br/>_2034 gas_                                                                    |
| `RIST255_QMULBASE` | _`n - 0 or g*n -1`_ | Quiet version of `RIST255_MULBASE`.<br/>_784 gas_                                                                 |

### BLS12-381
Operations on a pairing friendly BLS12-381 curve. [BLST](https://github.com/supranational/blst) implementation is used. Also, ops for BLS signature scheme which is based on this curve.

BLS values are represented in TVM in the following way:
- G1-points and public keys: 48-byte slice.
- G2-points and signatures: 96-byte slice.
- Elements of field FP: 48-byte slice.
- Elements of field FP2: 96-byte slice.
- Messages: slice. Number of bits should be divisible by 8.

When input value is a point or a field element, the slice may have more than 48/96 bytes. In this case only the first 48/96 bytes are taken. If the slice has less bytes (or if message size is not divisible by 8), cell underflow exception is thrown.

#### High-level operations
These are high-level operations for verifying BLS signatures.

| xxxxxxxxxxxxx<br/>Fift syntax | xxxxxxxxxxxxxxxxx<br/>Stack | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Description                                                                                                                 |
|:-|:-|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `BLS_VERIFY` | _`pk msg sgn - bool`_ | Checks BLS signature, return true on success, false otherwise.<br/>_61034 gas_                                                                                             |
| `BLS_AGGREGATE` | _`sig_1 ... sig_n n - sig`_ | Aggregates signatures. `n>0`. Throw exception if `n=0` or if some `sig_i` is not a valid signature.<br/>_`gas=n*4350-2616`_                                                |
| `BLS_FASTAGGREGATEVERIFY`- | _`pk_1 ... pk_n n msg sig - bool`_ | Checks aggregated BLS signature for keys `pk_1...pk_n` and message `msg`. Return true on success, false otherwise. Return false if `n=0`.<br/>_`gas=58034+n*3000`_         |
| `BLS_AGGREGATEVERIFY` | _`pk_1 msg_1 ... pk_n msg_n n sgn - bool`_ | Checks aggregated BLS signature for key-message pairs `pk_1 msg_1...pk_n msg_n`. Return true on success, false otherwise. Return false if `n=0`.<br/>_`gas=38534+n*22500`_ |

`VERIFY` instructions don't throw exception on invalid signatures and public keys (except for cell underflow exceptions), they return false instead.

#### Low-level operations
These are arithmetic operations on group elements.

| xxxxxxxxxxxxx<br/>Fift syntax | xxxxxxxxxxxxxxxxx<br/>Stack | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Description                                                                                                                                                                      |
|:-|:-|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `BLS_G1_ADD` | _`x y - x+y`_ | Addition on G1.<br/>_3934 gas_                                                                                                                                                                                                  |
| `BLS_G1_SUB` | _`x y - x-y`_ | Subtraction on G1.<br/>_3934 gas_                                                                                                                                                                                               |
| `BLS_G1_NEG` | _`x - -x`_ | Negation on G1.<br/>_784 gas_                                                                                                                                                                                                   |
| `BLS_G1_MUL` | _`x s - x*s`_ | Multiplies G1 point `x` by scalar `s`.<br/>Any `s` is valid, including negative.<br/>_5234 gas_                                                                                                                                 |
| `BLS_G1_MULTIEXP` | _`x_1 s_1 ... x_n s_n n - x_1*s_1+...+x_n*s_n`_ | Calculates `x_1*s_1+...+x_n*s_n` for G1 points `x_i` and scalars `s_i`. Returns zero point if `n=0`.<br/>Any `s_i` is valid, including negative.<br/>_`gas=11409+n*630+n/floor(max(log2(n),4))*8820`_                           |
| `BLS_G1_ZERO` | _`- zero`_ | Pushes zero point in G1.<br/>_34 gas_                                                                                                                                                                                           |
| `BLS_MAP_TO_G1` | _`f - x`_ | Converts FP element `f` to a G1 point.<br/>_2384 gas_                                                                                                                                                                           |
| `BLS_G1_INGROUP` | _`x - bool`_ | Checks that slice `x` represents a valid element of G1.<br/>_2984 gas_                                                                                                                                                          |
| `BLS_G1_ISZERO` | _`x - bool`_ | Checks that G1 point `x` is equal to zero.<br/>_34 gas_                                                                                                                                                                         |
| `BLS_G2_ADD` | _`x y - x+y`_ | Addition on G2.<br/>_6134 gas_                                                                                                                                                                                                  |
| `BLS_G2_SUB` | _`x y - x-y`_ | Subtraction on G2.<br/>_6134 gas_                                                                                                                                                                                               |
| `BLS_G2_NEG` | _`x - -x`_ | Negation on G2.<br/>_1584 gas_                                                                                                                                                                                                  |
| `BLS_G2_MUL` | _`x s - x*s`_ | Multiplies G2 point `x` by scalar `s`.<br/>Any `s` is valid, including negative.<br/>_10584 gas_                                                                                                                                |
| `BLS_G2_MULTIEXP` | _`x_1 s_1 ... x_n s_n n - x_1*s_1+...+x_n*s_n`_ | Calculates `x_1*s_1+...+x_n*s_n` for G2 points `x_i` and scalars `s_i`. Returns zero point if `n=0`.<br/>Any `s_i` is valid, including negative.<br/>_`gas=30422+n*1280+n/floor(max(log2(n),4))*22840`_                         |
| `BLS_G2_ZERO` | _`- zero`_ | Pushes zero point in G2.<br/>_34 gas_                                                                                                                                                                                           |
| `BLS_MAP_TO_G2` | _`f - x`_ | Converts FP2 element `f` to a G2 point.<br/>_7984 gas_                                                                                                                                                                          |
| `BLS_G2_INGROUP` | _`x - bool`_ | Checks that slice `x` represents a valid element of G2.<br/>_4284 gas_                                                                                                                                                          |
| `BLS_G2_ISZERO` | _`x - bool`_ | Checks that G2 point `x` is equal to zero.<br/>_34 gas_                                                                                                                                                                         |
| `BLS_PAIRING` | _`x_1 y_1 ... x_n y_n n - bool`_ | Given G1 points `x_i` and G2 points `y_i`, calculates and multiply pairings of `x_i,y_i`. Returns true if the result is the multiplicative identity in FP12, false otherwise. Returns false if `n=0`.<br/>_`gas=20034+n*11800`_ |
| `BLS_PUSHR` | _`- r`_ | Pushes the order of G1 and G2 (approx. `2^255`).<br/>_34 gas_                                                                                                                                                                   |

`INGROUP`, `ISZERO` don't throw exception on invalid points (except for cell underflow exceptions), they return false instead.

Other arithmetic operations throw exception on invalid curve points. Note that they don't check whether given curve points belong to group G1/G2. Use `INGROUP` instruction to check this.

## RUNVM
Currently there is no way for code in TVM to call external untrusted code "in sandbox". In other words, external code always can irreversibly update code, data of contract, or set actions (such as sending all money).
`RUNVM` instruction allows to spawn an independent VM instance, run desired code and get needed data (stack, registers, gas consumption etc) without risks of polluting caller's state. Running arbitrary code in a safe way may be useful for [v4-style plugins](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts#wallet-v4), Tact's `init` style subcontract calculation etc.

| xxxxxxxxxxxxx<br/>Fift syntax | xxxxxxxxxxxxxxxxx<br/>Stack | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>Description                                                                                                                           |
|:-|:-|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `flags RUNVM` | _`x_1 ... x_n n code [r] [c4] [c7] [g_l] [g_m] - x'_1 ... x'_m exitcode [data'] [c4'] [c5] [g_c]`_ | Runs child VM with code `code` and stack `x_1...x_n`. Returns the resulting stack `x'_1...x'_m` and exitcode.<br/>Other arguments and return values are enabled by flags, see below. |
| `RUNVMX` | _`x_1 ... x_n n code [r] [c4] [c7] [g_l] [g_m] flags - x'_1 ... x'_m exitcode [data'] [c4'] [c5] [g_c]`_ | Same thing, but pops flags from stack.                                                                                                                                               |

Flags are similar to `runvmx` in fift:
- `+1`: set c3 to code
- `+2`: push an implicit 0 before running the code
- `+4`: take `c4` from stack (persistent data), return its final value
- `+8`: take gas limit `g_l` from stack, return consumed gas `g_c`
- `+16`: take `c7` from stack (smart-contract context)
- `+32`: return final value of `c5` (actions)
- `+64`: pop hard gas limit (enabled by ACCEPT) `g_m` from stack
- `+128`: "isolated gas consumption". Child VM will have a separate set of visited cells and a separate chksgn counter.
- `+256`: pop integer `r`, return exactly `r` values from the top:
      - If RUNVM call successful and r is set, it returns r elements. If r not set - returns all;
      - if RUNVM successful but there is not enough elements on stack (stack depth less than r) it is considered as exception in child VM, with exit_code=-3 and exit_arg=0 (so 0 is returned as only stack element);
      - if RUNVM fails with exception - only one element is returned - exit arg (not to be mistaken with exit_code);
      - in case of OOG, exit_code = -14 and exit_arg is amount of gas.

Gas cost:
- 66 gas
- 1 gas for every stack element given to the child VM (first 32 are free)
- 1 gas for every stack element returned from the child VM (first 32 are free)

## Sending messages
Currently it is difficult to calculate cost of sending message in contract (which leads to some approximations like in [jettons](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc#L94)) and impossible to bounce request back if action phase is incorrect. It is also impossible to accurately subtract from incoming message sum of "constant fee for contract logic" and "gas expenses".

- `SENDMSG` takes a cell and mode as input. Creates an output action and returns a fee for creating a message. Mode has the same effect as in the case of SENDRAWMSG. Additionally `+1024` means - do not create an action, only estimate fee. Other modes affect the fee calculation as follows: `+64` substitutes the entire balance of the incoming message as an outgoing value (slightly inaccurate, gas expenses that cannot be estimated before the computation is completed are not taken into account), `+128` substitutes the value of the entire balance of the contract before the start of the computation phase (slightly inaccurate, since gas expenses that cannot be estimated before the completion of the computation phase are not taken into account).
- `SENDRAWMSG`, `RAWRESERVE`, `SETLIBCODE`, `CHANGELIB` - `+16` flag is added, that means in the case of action fail - bounce transaction. No effect if `+2` is used.
