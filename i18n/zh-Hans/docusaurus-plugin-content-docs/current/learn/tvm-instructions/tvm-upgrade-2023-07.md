# TVM 升级 2023.07

:::tip
此升级于 2023 年 12 月在主网上启动，详细信息请参考 [run](https://t.me/tonblockchain/223)。
:::

# c7

**c7** 是存储有关合约执行所需的本地 context 信息的寄存器
（如时间、lt、网络配置等）。

**c7** 元组从 10 扩展到 14 个元素：
* **10**: 存储智能合约本身的 `cell`。
* **11**: `[integer, maybe_dict]`：传入消息的 TON 值，额外代币。
* **12**: `integer`，存储阶段收取的费用。
* **13**: `tuple` 包含有关先前区块的信息。

**10** 当前智能合约的代码仅以可执行继续的形式在 TVM 级别呈现，无法转换为cell。这段代码通常用于授权相同类型的 neighbor 合约，例如 Jetton 钱包授权 Jetton 钱包。目前我们需要显式地代码cell存储在存储器中，这使得存储和 init_wrapper 变得更加麻烦。
使用 **10** 作为代码对于 tvm 的 Everscale 更新兼容。

**11** 当前，传入消息的值在 TVM 初始化后以堆栈形式呈现，因此如果在执行过程中需要，
则需要将其存储到全局变量或通过本地变量传递（在 funC 级别看起来像所有函数中的额外 `msg_value` 参数）。通过将其放在 **11** 元素中，我们将重复合约余额的行为：它既出现在堆栈中，也出现在 c7 中。

**12** 目前计算存储费用的唯一方法是在先前的交易中存储余额，以某种方式计算 prev 交易中的 gas 用量，然后与当前余额减去消息值进行比较。与此同时，经常希望考虑存储费用。

**13** 目前没有办法检索先前区块的数据。TON 的一个关键特性是每个结构都是 Merkle 证明友好的cell（树），此外，TVM 也是cell和 Merkle 证明友好的。通过在 TVM context中包含区块信息，将能够实现许多不信任的情景：合约 A 可以检查合约 B 上的交易（无需 B 的合作），可以恢复中断的消息链（当恢复合约获取并检查某些事务发生但被还原的证明时），还需要了解主链区块哈希以在链上进行某些验证 fisherman 函数功能。

区块 id 的表示如下：
```
[ wc:Integer shard:Integer seqno:Integer root_hash:Integer file_hash:Integer ] = BlockId;
[ last_mc_blocks:[BlockId0, BlockId1, ..., BlockId15]
  prev_key_block:BlockId ] : PrevBlocksInfo
```  
包括主链的最后 16 个区块的 id（如果主链 seqno 小于 16，则为少于 16 个），以及最后的关键区块。包含有关分片区块的数据可能会导致一些数据可用性问题（由于合并/拆分事件），这并非必需（因为可以使用主链区块来证明任何事件/数据），因此我们决定不包含。

# 新的操作码
在选择新操作码的 gas 成本时的经验法则是它不应少于正常成本（从操作码长度计算）且不应超过每个 gas 单位 20 ns。

## 用于处理新 c7 值的操作码
每个操作码消耗 26 gas，除了 `PREVMCBLOCKS` 和 `PREVKEYBLOCK`（34 gas）。

| xxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述               |
|:-|:-|:--------------------------------------------------------------------|
| `MYCODE` | _`- c`_ | 从 c7 检索智能合约的代码                            |
| `INCOMINGVALUE` | _`- t`_ | 从 c7 检索传入消息的值                         |
| `STORAGEFEES` | _`- i`_ | 从 c7 检索存储阶段费用的值                       |
| `PREVBLOCKSINFOTUPLE` | _`- t`_ | 从 c7 中检索 PrevBlocksInfo: `[last_mc_blocks, prev_key_block]` |
| `PREVMCBLOCKS` | _`- t`_ | 仅检索 `last_mc_blocks`                                     |
| `PREVKEYBLOCK` | _`- t`_ | 仅检索 `prev_key_block`                                     |
| `GLOBALID` | _`- i`_ | 从网络配置的第 19 项检索 `global_id`                        |

## Gas

| xxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述                       |
|:-|:-|:-----------------------------------------------------------------------------|
| `GASCONSUMED` | _`- g_c`_ | 返回到目前为止 VM 消耗的 gas（包括此指令）。<br/>_26 gas_ |

## 算术
添加了 [除法操作码](https://docs.ton.org/learn/tvm-instructions/instructions#52-division)（`A9mscdf`）的新变体：
`d=0` 从堆栈中获取一个额外的整数，并将其添加到除法/右移之前的中间值。这些操作返回商和余数（与 `d=3` 类似）。

还提供了静默变体（例如 `QMULADDDIVMOD` 或 `QUIET MULADDDIVMOD`）。

如果返回值

不适应 257 位整数或除数为零，非静默操作会引发整数溢出异常。静默操作返回 `NaN` 而不是不适应的值（如果除数为零则返回两个 `NaN`）。

gas 成本等于 10 加上操作码长度：大多数操作码为 26 gas，`LSHIFT#`/`RSHIFT#` 额外加 8，静默额外加 8。

| xxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>堆栈 |
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

## Stack 操作
目前所有 stack 操作的参数都限制在 256 内。这意味着如果 stack 变得比 256 深，就会变得难以管理深层 stack 元素。在大多数情况下，没有为此限制的安全原因，即参数没有限制是为了防止过于昂贵的操作。对于一些大规模 stack 操作，比如 `ROLLREV`（其中计算时间线性依赖于参数值），gas 成本也线性依赖于参数值。
- `PICK`、`ROLL`、`ROLLREV`、`BLKSWX`、`REVX`、`DROPX`、`XCHGX`、`CHKDEPTH`、`ONLYTOPX`、`ONLYX` 的参数现在是不受限制的。
- `ROLL`、`ROLLREV`、`REVX`、`ONLYTOPX` 的参数越大，消耗的 gas 越多：额外的 gas 成本是 `max(arg-255,0)`（对于小于 256 的参数，gas 消耗是恒定的，对应于当前行为）。
- 对于 `BLKSWX`，额外成本是 `max(arg1+arg2-255,0)`（这不符合当前行为，因为当前 `arg1` 和 `arg2` 都限制为 255）。

## Hashes
目前 TVM 中只有两个哈希操作：计算cell/切片的 representation hash ，以及对数据进行 sha256，但只支持最多 127 字节（只有这么多数据适应一个cell）。

添加了 `HASHEXT[A][R]_(HASH)` 系列操作：

| xxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述               |
|:-|:-|:--------------------------------------------------------------------|
| `HASHEXT_(HASH)` | _`s_1 ... s_n n - h`_            | 计算并返回切片（或构建器）`s_1...s_n` 的连接的哈希。            |
| `HASHEXTR_(HASH)` | _`s_n ... s_1 n - h`_            | 同样，但参数以相反的顺序给出。                                     |
| `HASHEXTA_(HASH)` | _`b s_1 ... s_n n - b'`_         | 将结果的哈希附加到构建器 `b` 而不是将其推送到堆栈。              |
| `HASHEXTAR_(HASH)` | _`b s_n ... s_1 n - b'`_         | 参数以相反的顺序给出，将哈希附加到构建器。                      |

仅使用 `s_i` 的根cell的位。

每个块 `s_i` 可能包含非整数数量的字节。但所有块的位的和应该是 8 的倍数。注意 TON 使用最高位优先顺序，因此当连接两个具有非整数字节的切片时，第一个切片的位变为最高位。

gas 消耗取决于哈希字节数和所选算法。每个块额外消耗 1 gas 单位。

如果未启用 `[A]`，则哈希的结果将作为无符号整数返回，如果适应 256 位，否则返回整数的元组。

可用以下算法：
- `SHA256` - openssl 实现，每字节 1/33 gas，哈希为 256 位。
- `SHA512` - openssl 实现，每字节 1/16 gas，哈希为 512 位。
- `BLAKE2B` - openssl 实现，每字节 1/19 gas，哈希为 512 位。
- `KECCAK256` - [以太坊兼容实现](http://keccak.noekeon.org/)，每字节 1/11 gas，哈希为 256 位。
- `KECCAK512` - [以太坊兼容实现](http://keccak.noekeon.org/)，每字节 1/6 gas，哈希为 512 位。

Gas 使用会四舍五入。

## Crypto
目前唯一可用的密码算法是 `CHKSIGN`：检查哈希 `h` 的 Ed25519 签名是否与公钥 `k` 匹配。

- 为了与以前的区块链（如比特币和以太坊）兼容，我们还需要检查 `secp256k1` 签名。
- 对于现代密码算法，最低要求是曲线的加法和乘法。
- 为了与以太坊 2.0 PoS 和其他现代密码学的兼容性，我们需要在 bls12-381 曲线上进行 BLS 签名方案。
- 对于某些安全硬件，需要 `secp256r1 == P256 == prime256v1`。

### secp256k1
Bitcoin/Ethereum签名。使用 [libsecp256k1 实现](https://github.com/bitcoin-core/secp256k1)。

| xxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 |
|:-|:-|:-|
| `ECRECOVER` | _`hash v r s - 0 or h x1 x2 -1`_ | 从签名恢复公钥，与比特币/以太坊操作相同。<br/>以 32 字节哈希作为 uint256 `hash`；以 65 字节签名作为 uint8 `v` 和 uint256 `r`、`s`。<br/>失败返回 `0`，成功返回公钥和 `-1`。<br/>以 65 字节公钥返回为 uint8 `h`，uint256 `x1`、`x2`。<br/>_1526 gas_ |

### secp256r1
使用 OpenSSL 实现。接口类似于 `CHKSIGNS`/`CHKSIGNU`。与 Apple Secure Enclave 兼容。

| xxx

xxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 |
|:-|:-|:-|
| `P256_CHKSIGNS` | _`d sig k - ?`_ | 检查 secp256r1 签名 `sig` 是否与切片 `d` 的数据部分和公钥 `k` 匹配。成功返回 -1，失败返回 0。<br/>公钥是一个 33 字节切片（按照 [SECG SEC 1](https://www.secg.org/sec1-v2.pdf) 第 2.3.4 节第 2 点编码）。<br/>签名 `sig` 是一个 64 字节切片（两个 256 位无符号整数 `r` 和 `s`）。<br/>_3526 gas_ |
| `P256_CHKSIGNU` | _`h sig k - ?`_ | 相同，但签名的数据是 32 字节对 256 位无符号整数 `h` 的编码。<br/>_3526 gas_ |

### Ristretto
更详细的文档在[这里](https://ristretto.group/)。简而言之，Curve25519 是为了性能而开发的，但由于对称性而表现出多重表示的问题，使得群元素具有多个表示。简单的协议，如Schnorr签名或Diffie-Hellman，在协议级别应用一些技巧以减轻一些问题，但破坏了密钥推导和密钥遮蔽方案。而这些技巧在更复杂的协议，如Bulletproofs上无法扩展。Ristretto是对Curve25519的算术抽象，使得每个群元素对应于唯一的点，这是大多数密码协议的要求。Ristretto实质上是Curve25519的压缩/解压缩协议，提供所需的算术抽象。因此，可以认为我们在一步中添加了Ristretto和Curve25519曲线操作。

[libsodium 实现](https://github.com/jedisct1/libsodium/)。

所有 ristretto-255 点都在TVM中表示为 256 位无符号整数。非静默操作在参数无效的情况下引发 `range_chk`。零点表示为整数 `0`。

| xxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 |
|:-|:-|:------------------------------------------------------------------------------------------------------------------|
| `RIST255_FROMHASH` | _`h1 h2 - x`_ | 从 512 位哈希（由两个 256 位整数给出）确定性生成有效点 `x`。<br/>_626 gas_  |
| `RIST255_VALIDATE` | _`x -`_ | 检查整数 `x` 是否是某个曲线点的有效表示。出错时引发 `range_chk`。<br/>_226 gas_ |
| `RIST255_ADD` | _`x y - x+y`_ | 在曲线上两个点的相加。<br/>_626 gas_                                                                  |
| `RIST255_SUB` | _`x y - x-y`_ | 在曲线上两个点的相减。<br/>_626 gas_                                                                 |
| `RIST255_MUL` | _`x n - x*n`_ | 将点 `x` 乘以标量 `n`。<br/>任何 `n` 都有效，包括负数。<br/>_2026 gas_                    |
| `RIST255_MULBASE` | _`n - g*n`_ | 将生成器点 `g` 乘以标量 `n`。<br/>任何 `n` 都有效，包括负数。<br/>_776 gas_       |
| `RIST255_PUSHL` | _`- l`_ | 推送整数 `l=2^252+27742317777372353535851937790883648493`，这是群的阶。<br/>_26 gas_    |
| `RIST255_QVALIDATE` | _`x - 0 or -1`_ | `RIST255_VALIDATE` 的静默版本。<br/>_234 gas_                                                                |
| `RIST255_QADD` | _`x y - 0 or x+y -1`_ | `RIST255_ADD` 的静默版本。 <br/>_634 gas_                                                                    |
| `RIST255_QSUB` | _`x y - 0 or x-y -1`_ | `RIST255_SUB` 的静默版本。<br/>_634 gas_                                                                     |
| `RIST255_QMUL` | _`x n - 0 or x*n -1`_ | `RIST255_MUL` 的静默版本。<br/>_2034 gas_                                                                    |
| `RIST255_QMULBASE` | _`n - 0 or g*n -1`_ | `RIST255_MULBASE` 的静默版本。<br/>_784 gas_                                                                 |

### BLS12-381
在配对友好的 BLS12-381 曲线上进行操作。使用[BLST](https://github.com/supranational/blst)实现。此外，还有基于该曲线的 BLS 签名方案的操作。

在TVM中，BLS值以以下方式表示：
- G1点和公钥：48字节切片。
- G2点和签名：96字节切片。
- 字段FP的元素：48字节切片。
- 字段FP2的元素：96字节切片。
- 消息：切片。位数应该是8的倍数。

当输入值是点或字段元素时，切片可能具有超过48/96字节。在这种情况下，只采用前48/96字节。如果切片字节数较少（或消息大小不是8的倍数），则引发cell下溢异常。

#### 高级操作
这些是用于验证BLS签名的高级操作。

| xxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述                                                                                                                 |
|:-|:-|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `BLS_VERIFY` | _`pk msg sgn - bool`_ | 检查BLS签名，成功时返回true，否则返回false。<br/>_61034 gas_                                                                                             |
| `BLS_AGGREGATE` | _`sig_1 ... sig_n n - sig`_ | 聚合签名。`n>0`。如果`n=0`或某个`sig_i`不是有效签名，则引发异常。<br/>_`gas=n*4350-2616`_                                                |
| `BLS_FASTAGGREGATEVERIFY`- | _`pk_1 ... pk_n n msg sig - bool`_ | 检查聚合的BLS签名，对于密钥`pk_1...pk_n`和消息`msg`返回true，否则返回false。如果`n=0`，返回false。<br/>_`gas=58034+n*3000`_         |
| `BLS_AGGREGATEVERIFY` | _`pk_1 msg_1 ... pk_n msg_n n sgn - bool`_ | 检查密钥-消息对`pk_1 msg_1...pk_n msg_n`的聚合BLS签名。如果成功，返回true，否则返回false。如果`n=0`，返回false。<br/>_`gas=38534+n*22500`_ |

`VERIFY`指令在无效的签名和公钥上（除了cell下溢异常）不会引发异常，而是返回false。

#### 低层级操作
这些是群元素上的算术操作。

| xxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述                                                                                                                                                                      |
|:-|:-|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `BLS_G1_ADD` | _`x y - x+y`_ | G1上的加法。<br/>_3934 gas_                                                                                                                                                                                                  |
| `BLS_G1_SUB` | _`x y - x-y`_ | G1上的减法。<br/>_3934 gas_                                                                                                                                                                                               |
| `BLS_G1_NEG` | _`x - -x`_ | G1上的取反。<br/>_784 gas_                                                                                                                                                                                                   |
| `BLS_G1_MUL` | _`x s - x*s`_ | 将G1点`x`乘以标量`s`。<br/>任何`s`都是有效的，包括负数。<br/>_5234 gas_                                                                                                                                 |
| `BLS_G1_MULTIEXP` | _`x_1 s_1 ... x_n s_n n - x_1*s_1+...+x_n*s_n`_ | 计算G1点`x_i`和标量`s_i`的`x_1*s_1+...+x_n*s_n`。如果`n=0`，返回零点。<br/>任何`s_i`都是有效的，包括负数。<br/>_`gas=11409+n*630+n/floor(max(log2(n),4))*8820`_                           |
| `BLS_G1_ZERO` | _`- zero`_ | 推送零点到G1中。<br/>_34 gas_                                                                                                                                                                                           |
| `BLS_MAP_TO_G1` | _`f - x`_ | 将FP元素`f`转换为G1点。<br/>_2384 gas_                                                                                                                                                                           |
| `BLS_G1_INGROUP` | _`x - bool`_ | 检查切片`x`是否表示有效的G1元素。<br/>_2984 gas_                                                                                                                                                          |
| `BLS_G1_ISZERO` | _`x - bool`_ | 检查G1点`x`是否等于零。<br/>_34 gas_                                                                                                                                                                         |
| `BLS_G2_ADD` | _`x y - x+y`_ | G2上的加法。<br/>_6134 gas_                                                                                                                                                                                                  |
| `BLS_G2_SUB` | _`x y - x-y`_ | G2上的减法。<br/>_6134 gas_                                                                                                                                                                                               |
| `BLS_G2_NEG` | _`x - -x`_ | G2上的取反。<br/>_1584 gas_                                                                                                                                                                                                  |
| `BLS_G2_MUL` | _`x s - x*s`_ | 将G2点`x`乘以标量`s`。<br/>任何`s`都是有效的，包括负数。<br/>_10584 gas_                                                                                                                                |
| `BLS_G2_MULTIEXP` | _`x_1 s_1 ... x_n s_n n - x_1*s_1+...+x_n*s_n`_ | 计算G2点`x_i`和标量`s_i`的`x_1*s_1+...+x_n*s_n`。如果`n=0`，返回零点。<br/>任何`s_i`都是有效的，包括负数。<br/>_`gas=30422+n*1280+n/floor(max(log2(n),4))*22840`_                         |
| `BLS_G2_ZERO` | _`- zero`_ | 推送零点到G2中。<br/>_34 gas_                                                                                                                                                                                           |
| `BLS_MAP_TO_G2` | _`f - x`_ | 将FP2元素`f`转换为G2点。<br/>_7984 gas_                                                                                                                                                                          |
| `BLS_G2_INGROUP` | _`x - bool`_ | 检查切片`x`是否表示有效的G2元素。<br/>_4284 gas_                                                                                                                                                          |
| `BLS_G2_ISZERO` | _`x - bool`_ | 检查G2点`x`是否等于零。<br/>_34 gas_                                                                                                                                                                         |
| `BLS_PAIRING` | _`x_1 y_1 ... x_n y_n n - bool`_ | 给定G1点`x_i`和G2点`y_i`，计算并乘积`x_i,y_i`的配对。如果结果是FP12的乘法单位元素，则返回true，否则返回false。如果`n=0`，返回false。<br/>_`gas=20034+n*11800`_ |
| `BLS_PUSHR` | _`- r`_ | 推送G1和G2的阶（约为`2^255`）。<br/>_34 gas_                                                                                                                                                                   |

`INGROUP`，`ISZERO`在无效的点上（除了cell下溢异常）不会引发异常，而是返回false。

其他算术操作在无效的曲线点上引发异常。请注意，它们不检查给定的曲线点是否属于G1/G2群。使用`INGROUP`指令来检查这一点。

## RUNVM
目前在TVM中无法以“沙盒”中的方式调用外部不受信任的代码。换句话说，外部代码始终可以不可逆地更新合约的代码、数据，或设置操作（例如发送所有资金）。`RUNVM`指令允许生成独立的VM实例，运行所需的代码，并在不污染调用者状态的情况下获取所需的数据（堆栈、寄存器、气体消耗等）。以安全的方式运行任意代码可能对[v4样式的插件](/participate/wallets/contracts#wallet-v4)、Tact的`init`样式子合约计算等非常有用。

| xxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述                                                                                                                           |
|:-|:-|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `flags RUNVM` | _`x_1 ... x_n n code [r] [c4] [c7] [g_l] [g_m] - x'_1 ... x'_m exitcode [data'] [c4'] [c5] [g_c]`_ | 以代码`code`和栈`x_1...x_n`运行子VM。返回结果堆栈`x'_1...x'_m`和exit code。<br/>其他标志位启用了其他参数和返回值，见下文。 |
| `RUNVMX` | _`x_1 ... x_n n code [r] [c4] [c7] [g_l] [g_m] flags - x'_1 ... x'_m exitcode [data'] [c4'] [c5] [g_c]`_ | 同样的事情，但从堆栈弹出标志位。                                                                                                                                               |

标志位类似于fift中的`runvmx`：
- `+1`：将c3设置为代码
- `+2`：在运行代码之前推送一个隐式的0
- `+4`：从堆栈中取`c4`（持久性数据），返回其最终值
- `+8`：从堆栈中取gas限制`g_l`，返回消耗的gas `g_c`
- `+16`：从堆栈中取`c7`（智能合约 context）
- `+32`：返回`c5`的最终值（操作）
- `+64`：从堆栈中弹出硬gas限制（由ACCEPT启用）`g_m`
- `+128`： “隔离的gas消耗”。子VM将具有一个单独的访问cell集合和一个单独的chksgn计数器。
- `+256`：弹出整数`r`，从堆栈顶部返回确切的`r`个值（仅当`exitcode=0或1`时；如果不够，则`exitcode=stk_und`）

gas成本：
- 66 gas
- 为提供给子VM的每个堆栈元素支付1 gas（前32个是免费的）
- 为从子VM返回的每个堆栈元素支付1 gas（前32个是免费的）

## 发送消息
目前在合约中难以计算发送消息的成本（导致了一些近似，比如在[jettons](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc#L94)中）并且如果 Action Phase 不正确，则无法将请求反弹回。精确减去传入消息的“合约逻辑的常量费用”和“gas费用”是不可能的。

- `SENDMSG`以cell和模式为输入。创建一个输出操作并返回创建消息的费用。模式在SENDRAWMSG的情况下具有与SENDRAWMSG相同的效果。此外，`+1024`表示- 不要创建操作，只估算费用。其他模式影响费用计算如下：`+64`将传入消息的整个余额替换为传出值（略微不准确，不能在计算完成之前估算的gas费用不考虑在内），`+128`将合约在 Compute Phase 开始之前的整个余额的值替换为传出值（略微不准确，因为在 Compute Phase 完成之前不能估算的gas费用不考虑在内）。
- `SENDRAWMSG`，`RAWRESERVE`，`SETLIBCODE`，`CHANGELIB` - 添加了`+16`标志位，这意味着在操作失败时反弹交易。如果使用了`+2`，则没有效果。
