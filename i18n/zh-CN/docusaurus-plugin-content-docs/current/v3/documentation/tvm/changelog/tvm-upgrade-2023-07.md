# TVM 升级 2023.07

:::tip
此升级于 2023 年 12 月在主网上启动，详细信息请参考 [run](https://t.me/tonblockchain/223)。
:::

# c7

**c7** 是存储有关合约执行所需的本地 context 信息的寄存器
（如时间、lt、网络配置等）。

**c7** 元组从 10 扩展到 14 个元素：

- **10**: 存储智能合约本身的 `cell`。
- **11**: `[integer, maybe_dict]`：传入消息的 TON 值，额外代币。
- **12**: `integer`，存储阶段收取的费用。
- **13**: `tuple` 包含有关先前区块的信息。

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

| xxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述                                |
| :--------------------------------- | :--------------- | :-------------------------------------------------------------------------- |
| `MYCODE`                           | *`- c`*          | 从 c7 检索智能合约的代码                                                              |
| `INCOMINGVALUE`                    | *`- t`*          | 从 c7 检索传入消息的值                                                               |
| `STORAGEFEES`                      | *`- i`*          | 从 c7 检索存储阶段费用的值                                                             |
| `PREVBLOCKSINFOTUPLE`              | *`- t`*          | 从 c7 中检索 PrevBlocksInfo: `[last_mc_blocks, prev_key_block]` |
| `PREVMCBLOCKS`                     | *`- t`*          | 仅检索 `last_mc_blocks`                                                        |
| `PREVKEYBLOCK`                     | *`- t`*          | 仅检索 `prev_key_block`                                                        |
| `GLOBALID`                         | *`- i`*          | 从网络配置的第 19 项检索 `global_id`                                                  |

## Gas

| xxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>描述 |
| :------------------------- | :-------------- | :-------------------------------------------- |
| `GASCONSUMED`              | *`- g_c`*       | 返回到目前为止 VM 消耗的 gas（包括此指令）。<br/>*26 gas*       |

## 算术

New variants of [the division opcode](https://docs.ton.org/learn/tvm-instructions/instructions#52-division) (`A9mscdf`) are added:
`d=0` takes one additional integer from stack and adds it to the intermediate value before division/rshift. These operations return both the quotient and the remainder (just like `d=3`).

还提供了静默变体（例如 `QMULADDDIVMOD` 或 `QUIET MULADDDIVMOD`）。

如果返回值不适应 257 位整数或除数为零，非静默操作会引发整数溢出异常。静默操作返回 `NaN` 而不是不适应的值（如果除数为零则返回两个 `NaN`）。

Gas 成本等于 10 加上操作码长度：大多数操作码为 26 gas，`LSHIFT#`/`RSHIFT#` 额外加 8，静默额外加 8。

| xxxxxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>堆栈       |
| :--------------------------------- | :------------------------------------------------ |
| `MULADDDIVMOD`                     | *`x y w z - q=floor((xy+w)/z) r=(xy+w)-zq`*       |
| `MULADDDIVMODR`                    | *`x y w z - q=round((xy+w)/z) r=(xy+w)-zq`*       |
| `MULADDDIVMODC`                    | *`x y w z - q=ceil((xy+w)/z) r=(xy+w)-zq`*        |
| `ADDDIVMOD`                        | *`x w z - q=floor((x+w)/z) r=(x+w)-zq`*           |
| `ADDDIVMODR`                       | *`x w z - q=round((x+w)/z) r=(x+w)-zq`*           |
| `ADDDIVMODC`                       | *`x w y - q=ceil((x+w)/z) r=(x+w)-zq`*            |
| `ADDRSHIFTMOD`                     | *`x w z - q=floor((x+w)/2^z) r=(x+w)-q*2^z`*      |
| `ADDRSHIFTMODR`                    | *`x w z - q=round((x+w)/2^z) r=(x+w)-q*2^z`*      |
| `ADDRSHIFTMODC`                    | *`x w z - q=ceil((x+w)/2^z) r=(x+w)-q*2^z`*       |
| `z ADDRSHIFT#MOD`                  | *`x w - q=floor((x+w)/2^z) r=(x+w)-q*2^z`*        |
| `z ADDRSHIFTR#MOD`                 | *`x w - q=round((x+w)/2^z) r=(x+w)-q*2^z`*        |
| `z ADDRSHIFTC#MOD`                 | *`x w - q=ceil((x+w)/2^z) r=(x+w)-q*2^z`*         |
| `MULADDHIFTMOD`                    | *`x y w z - q=floor((xy+w)/2^z) r=(xy+w)-q*2^z`*  |
| `MULADDRSHIFTRMOD`                 | *`x y w z - q=round((xy+w)/2^z) r=(xy+w)-q*2^z`*  |
| `MULADDHIFTCMOD`                   | *`x y w z - q=ceil((xy+w)/2^z) r=(xy+w)-q*2^z`*   |
| `z MULADDRSHIFT#MOD`               | *`x y w - q=floor((xy+w)/2^z) r=(xy+w)-q*2^z`*    |
| `z MULADDRSHIFTR#MOD`              | *`x y w - q=round((xy+w)/2^z) r=(xy+w)-q*2^z`*    |
| `z MULADDRSHIFTC#MOD`              | *`x y w - q=ceil((xy+w)/2^z) r=(xy+w)-q*2^z`*     |
| `LSHIFTADDDIVMOD`                  | *`x w z y - q=floor((x*2^y+w)/z) r=(x*2^y+w)-zq`* |
| `LSHIFTADDDIVMODR`                 | *`x w z y - q=round((x*2^y+w)/z) r=(x*2^y+w)-zq`* |
| `LSHIFTADDDIVMODC`                 | *`x w z y - q=ceil((x*2^y+w)/z) r=(x*2^y+w)-zq`*  |
| `y LSHIFT#ADDDIVMOD`               | *`x w z - q=floor((x*2^y+w)/z) r=(x*2^y+w)-zq`*   |
| `y LSHIFT#ADDDIVMODR`              | *`x w z - q=round((x*2^y+w)/z) r=(x*2^y+w)-zq`*   |
| `y LSHIFT#ADDDIVMODC`              | *`x w z - q=ceil((x*2^y+w)/z) r=(x*2^y+w)-zq`*    |

## 堆栈操作

目前，所有堆栈操作的参数都以 256 为界。
这意味着如果堆栈深度超过 256，就很难管理深堆栈元素。
在大多数情况下，这种限制并没有安全方面的原因，也就是说，限制参数并不是为了防止过于昂贵的操作。
对于某些大规模堆栈操作，如 `ROLLREV`（计算时间与参数值成线性关系），气体成本也与参数值成线性关系。

- 现在，`PICK`、`ROLL`、`ROLLREV`、`BLKSWX`、`REVX`、`DROPX`、`XCHGX`、`CHKDEPTH`、`ONLYTOPX`、`ONLYX` 的参数不受限制。
- 当参数较大时，`ROLL`, `ROLLREV`, `REVX`, `ONLYTOPX` 耗气量更大：额外耗气量为 `max(arg-255,0)`（参数小于 256 时，耗气量不变，与当前行为一致）
- 对于 `BLKSWX`，额外费用为 `max(arg1+arg2-255,0)`（这与当前行为不符，因为当前 `arg1` 和 `arg2` 都限制为 255）。

## 哈希值

目前，TVM 只提供两种散列操作：计算 cell /片的表示散列和数据的 sha256，但最多只能计算 127 字节（一个 cell 只能容纳这么多数据）。

`HASHEXT[A][R]_(HASH)` 系列操作被添加：

| xxxxxxxxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>说明 |
| :------------------------------ | :---------------------------- | :-------------------------------------------- |
| `HASHEXT_(HASH)`                | *`s_1 ... s_n n - h`*         | 计算并返回片段（或构建器）`s_1...s_n`的连接哈希值。               |
| `HASHEXTR_(HASH)`               | *`s_n ... s_1 n - h`*         | 同理，但参数顺序相反。                                   |
| `HASHEXTA_(HASH)`               | *`b s_1 ... s_n n - b'`*      | 将生成的哈希值追加到构造函数 `b` 中，而不是推送到堆栈中。               |
| `HASHEXTAR_(HASH)`              | *`b s_n ... s_1 n - b'`*      | 参数以相反顺序给出，并将哈希值追加到生成器中。                       |

仅使用 `s_i` 的根cell的位。

每个块 `s_i` 可能包含非整数数量的字节。但所有块的位的和应该是 8 的倍数。注意 TON 使用最高位优先顺序，因此当连接两个具有非整数字节的 slice 时，第一个 slice 的位变为最高位。

Gas 消耗取决于哈希字节数和所选算法。每个块额外消耗 1 gas 单位。

如果未启用 `[A]`，则哈希的结果将作为无符号整数返回，如果适应 256 位，否则返回整数的元组。

可用以下算法：

- `SHA256` - openssl 实现，每字节 1/33 gas，哈希为 256 位。
- `SHA512` - openssl 实现，每字节 1/16 gas，哈希为 512 位。
- `BLAKE2B` - openssl 实现，每字节 1/19 gas，哈希为 512 位。
- `KECCAK256` - [以太坊兼容实现](http://keccak.noekeon.org/)，每字节 1/11 gas，哈希为 256 位。
- `KECCAK512` - [以太坊兼容实现](http://keccak.noekeon.org/)，每字节 1/6 gas，哈希为 512 位。

Gas 用量四舍五入。

## 加密货币

目前唯一可用的加密算法是 "CCHKSIGN"：检查哈希 "h "与公钥 "k "的 Ed25519 签名。

- 为了与比特币和以太坊等上一代区块链兼容，我们还需要检查 `secp256k1` 签名。
- 对于现代密码算法，最低要求是曲线的加法和乘法。
- 为了与以太坊 2.0 PoS 和其他现代密码学的兼容性，我们需要在 bls12-381 曲线上进行 BLS 签名方案。
- 对于某些安全硬件，需要 `secp256r1 == P256 == prime256v1`。

### secp256k1

比特币/以太坊签名。使用 [libsecp256k1 实现](https://github.com/bitcoin-core/secp256k1)。

| xxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈         | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>说明                                                                                                        |
| :------------------------ | :------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ECRECOVER`               | *`hash v r s - 0 or h x1 x2 -1`* | 从签名恢复公钥，与比特币/以太坊操作相同。<br/>以 32 字节哈希作为 uint256 `hash`；以 65 字节签名作为 uint8 `v` 和 uint256 `r`、`s`。<br/>失败返回 `0`，成功返回公钥和 `-1`。<br/>以 65 字节公钥返回为 uint8 `h`，uint256 `x1`、`x2`。<br/>*1526 gas* |

### secp256r1

使用 OpenSSL 实现。界面类似于 `CHKSIGNS`/`CHKSIGNU`。与 Apple Secure Enclave 兼容。

| xxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>说明                                                                                                                                                                                                             |
| :------------------------ | :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `P256_CHKSIGNS`           | *`d sig k - ?`*          | 检查片段 `d` 的数据部分和公钥 `k` 的 seck256r1-signature `sig`。成功时返回-1，失败时返回 0。<br/>公钥是一个 33 字节的片段（根据 [SECG SEC 1](https://www.secg.org/sec1-v2.pdf) 第 2.3.4 节第 2 点编码）。<br/>签名 `sig` 是一个 64 字节的片段（两个 256 位无符号整数 `r` 和 `s`）。<br/>*3526 gas* |
| `P256_CHKSIGNU`           | *`h sig k - ?`*          | 相同，但签名的数据是 32 字节对 256 位无符号整数 `h` 的编码。<br/>*3526 gas*                                                                                                                                                                                                          |

### Ristretto

扩展文档 [此处](https://ristretto.group/)。简而言之，Curve25519 在开发时考虑到了性能，但由于组元素有多种表示形式，因此它具有对称性。较简单的协议（如 Schnorr 签名或 Diffie-Hellman 协议）在协议层面采用了一些技巧来缓解某些问题，但却破坏了密钥推导和密钥保密方案。这些技巧无法扩展到更复杂的协议，如防弹协议。Ristretto 是 Curve25519 的算术抽象，每个组元素对应一个唯一的点，这是大多数加密协议的要求。Ristretto 本质上是 Curve25519 的压缩/解压缩协议，提供了所需的算术抽象。因此，加密协议很容易正确编写，同时还能受益于 Curve25519 的高性能。

Ristretto 操作允许在 Curve25519 上计算曲线操作（反之则不行），因此我们可以认为我们在一个步骤中同时添加了 Ristretto 和 Curve25519 曲线操作。

[libsodium](https://github.com/jedisct1/libsodium/) 实现已被使用。

所有 ristretto-255 点都在TVM中表示为 256 位无符号整数。非静默操作在参数无效的情况下引发 `range_chk`。零点表示为整数 `0`。

| xxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>说明                         |
| :------------------------ | :----------------------- | :------------------------------------------------------------------------ |
| `RIST255_FROMHASH`        | *`h1 h2 - x`*            | 从 512 位哈希（由两个 256 位整数给出）确定性生成有效点 `x`。<br/>*626 gas*                       |
| `RIST255_VALIDATE`        | *`x -`*                  | 检查整数 `x` 是否是某个曲线点的有效表示。出错时会抛出 `range_chk`。<br/>*226 gas*                  |
| `RIST255_ADD`             | *`x y - x+y`*            | 在曲线上两个点的相加。<br/>*626 gas*                                                 |
| `RIST255_SUB`             | *`x y - x-y`*            | 在曲线上两个点的相减。<br/>*626 gas*                                                 |
| `RIST255_MUL`             | *`x n - x*n`*            | 将点 `x` 乘以标量 `n`。<br/>任何 `n` 都有效，包括负数。<br/>*2026 gas*                      |
| `RIST255_MULBASE`         | *`n - g*n`*              | 将生成器点 `g` 乘以标量 `n`。<br/>任何 `n` 都有效，包括负数。<br/>*776 gas*                    |
| `RIST255_PUSHL`           | *`- l`*                  | 推送整数 `l=2^252+27742317777372353535851937790883648493`，这是群的阶。<br/>*26 gas* |
| `RIST255_QVALIDATE`       | *`x - 0 或 -1`*           | `RIST255_VALIDATE` 的静默版本。<br/>*234 gas*                                   |
| `RIST255_QADD`            | *`x y - 0 或 x+y -1`*     | `RIST255_ADD` 的静默版本。<br/>*634 gas*                                        |
| `RIST255_QSUB`            | *`x y - 0 或 x-y -1`*     | `RIST255_SUB` 的静默版本。<br/>*634 gas*                                        |
| `RIST255_QMUL`            | *`x n - 0 或 x*n -1`*     | `RIST255_MUL` 的静默版本。<br/>*2034 gas*                                       |
| `RIST255_QMULBASE`        | *`n - 0 或 g*n -1`*       | `RIST255_MULBASE` 的静默版本。<br/>*784 gas*                                    |

### BLS12-381

在配对友好的 BLS12-381 曲线上进行操作。使用 [BLST](https://github.com/supranational/blst) 实现。此外，还对基于该曲线的 BLS 签名方案进行了操作。

BLS 值在 TVM 中的表示方法如下：

- G1点和公钥：48字节 slice 。
- G2点和签名：96字节 slice 。
- 字段FP的元素：48字节 slice 。
- 字段FP2的元素：96字节 slice 。
- 信息： slice 。位数应能被 8 整除。

当输入值是一个点或一个字段元素时，片段的长度可能超过 48/96 字节。在这种情况下，只取前 48/96 字节。如果片段的字节数少于 48/96（或信息大小不能被 8 整除），则会出现 cell 下溢异常。

#### 高级操作

这些是验证 BLS 签名的高级操作。

| xxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈                   | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>说明                                                                 |
| :------------------------ | :----------------------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| `BLS_VERIFY`              | *`pk msg sgn - bool`*                      | 检查 BLS 签名，成功时返回 true，否则返回 false。<br/>*61034 gas*                                                                  |
| `BLS_AGREGATE`            | *`sig_1 ... sig_n n - sig`*                | 聚合签名。`n>0`.如果 `n=0` 或某些 `sig_i` 不是有效签名，则抛出异常。<br/>*`gas=n*4350-2616`*                             |
| `BLS_FASTAGREGATEVERIFY`- | *`pk_1 ... pk_n n msg sig - bool`*         | 检查密钥 `pk_1...pk_n` 和信息 `msg` 的聚合 BLS 签名。成功时返回 true，否则返回 false。如果 `n=0` 则返回 false。<br/>*`gas=58034+n*3000`*        |
| `BLS_AGREGATEVERIFY`      | *`pk_1 msg_1 ... pk_n msg_n n sgn - bool`* | 检查密钥-消息对 `pk_1 msg_1...pk_n msg_n` 的聚合 BLS 签名。成功时返回 true，否则返回 false。如果 `n=0` 则返回 false。<br/>*`gas=38534+n*22500`* |

`VERIFY` 指令不会对无效签名和公钥抛出异常（ cell 下溢异常除外），而是返回 false。

#### 低级操作

这些是对组元素的算术操作。

| xxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈                        | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>说明                                                                                                          |
| :------------------------ | :---------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BLS_G1_ADD`              | *`x y - x+y`*                                   | G1上的加法。<br/>*3934 gas*                                                                                                                                     |
| `BLS_G1_SUB`              | *`x y - x-y`*                                   | G1上的减法。<br/>*3934 gas*                                                                                                                                     |
| `BLS_G1_NEG`              | *`x - -x`*                                      | G1上的取反。<br/>*784 gas*                                                                                                                                      |
| `BLS_G1_MUL`              | *`x s - x*s`*                                   | 将G1点`x`乘以标量`s`。<br/>任何`s`都是有效的，包括负数。<br/>*5234 gas*                                                                                                        |
| `BLS_G1_MULTIEXP`         | *`x_1 s_1 ... x_n s_n n - x_1*s_1+...+x_n*s_n`* | 计算G1点`x_i`和标量`s_i`的`x_1*s_1+...+x_n*s_n`。如果`n=0`，返回零点。&#xA<br/>任何`s_i`都是有效的，包括负数。<br/>`gas=11409+n*630+n/floor(max(log2(n),4))*8820`   |
| `BLS_G1_ZERO`             | *`- zero`*                                      | 推送零点到G1中。<br/>*34 gas*                                                                                                                                     |
| `BLS_MAP_TO_G1`           | *`f - x`*                                       | 将FP元素`f`转换为G1点。<br/>*2384 gas*                                                                                                                             |
| `BLS_G1_INTROUP`          | *`x - bool`*                                    | 检查 slice `x`是否表示有效的G1元素。<br/>*2984 gas*                                                                                                                    |
| `BLS_G1_ISZERO`           | *`x - bool`*                                    | 检查G1点`x`是否等于零。<br/>*34 gas*                                                                                                                                |
| `BLS_G2_ADD`              | *`x y - x+y`*                                   | G2上的加法。<br/>*6134 gas*                                                                                                                                     |
| `BLS_G2_SUB`              | *`x y - x-y`*                                   | G2上的减法。<br/>*6134 gas*                                                                                                                                     |
| `BLS_G2_NEG`              | *`x - -x`*                                      | G2上的取反。<br/>*1584 gas*                                                                                                                                     |
| `BLS_G2_MUL`              | *`x s - x*s`*                                   | 将G2点`x`乘以标量`s`。<br/>任何`s`都是有效的，包括负数。<br/>*10584 gas*                                                                                                       |
| `BLS_G2_MULTIEXP`         | *`x_1 s_1 ... x_n s_n n - x_1*s_1+...+x_n*s_n`* | 计算G2点`x_i`和标量`s_i`的`x_1*s_1+...+x_n*s_n`。如果`n=0`，返回零点。&#xA<br/>任何`s_i`都是有效的，包括负数。<br/>`gas=30422+n*1280+n/floor(max(log2(n),4))*22840` |
| `BLS_G2_ZERO`             | *`- zero`*                                      | 推送零点到G2中。<br/>*34 gas*                                                                                                                                     |
| `BLS_MAP_TO_G2`           | *`f - x`*                                       | 将FP2元素`f`转换为G2点。<br/>*7984 gas*                                                                                                                            |
| `BLS_G2_INTROUP`          | *`x - bool`*                                    | 检查 slice `x`是否表示有效的G2元素。<br/>*4284 gas*                                                                                                                    |
| `BLS_G2_ISZERO`           | *`x - bool`*                                    | 检查G2点`x`是否等于零。<br/>*34 gas*                                                                                                                                |
| `BLS_PAIRING`             | *`x_1 y_1 ... x_n y_n n - bool`*                | 给定 G1 点 `x_i` 和 G2 点 `y_i`，计算并乘以 `x_i,y_i` 的配对。如果结果是 FP12 中的乘法同一性，则返回 true，否则返回 false。如果 `n=0` 则返回 false。<br/>*`gas=20034+n*11800`*                        |
| `BLS_PUSHR`               | *`- r`*                                         | 推送G1和G2的阶（约为`2^255`）。<br/>*34 gas*                                                                                                                         |

`INGROUP`，`ISZERO`在无效的点上（除了cell下溢异常）不会引发异常，而是返回false。

其他算术操作在无效的曲线点上引发异常。请注意，它们不检查给定的曲线点是否属于G1/G2群。使用 `INGROUP` 指令来检查这一点。

## RUNVM

Currently there is no way for code in TVM to call external untrusted code "in sandbox". In other words, external code always can irreversibly update code, data of contract, or set actions (such as sending all money).
`RUNVM` instruction allows to spawn an independent VM instance, run desired code and get needed data (stack, registers, gas consumption etc) without risks of polluting caller's state. Running arbitrary code in a safe way may be useful for [v4-style plugins](/participate/wallets/contracts#wallet-v4), Tact's `init` style subcontract calculation etc.

| xxxxxxxxxxxxx<br/>Fift 语法 | xxxxxxxxxxxxxxxxx<br/>堆栈                                                                                 | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>说明                                          |
| :------------------------ | :------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| `flags RUNVM`             | *`x_1 ... x_n n code [r] [c4] [c7] [g_l] [g_m] - x'_1 ... x'_m exitcode [data'] [c4'] [c5] [g_c]`*       | 以代码 `code` 和堆栈 `x_1...x_n` 运行子虚拟机。返回生成的堆栈 `x'_1...x'_m` 和 exitcode。<br/>其他参数和返回值由标志启用，见下文。 |
| `RUNVMX`                  | *`x_1 ... x_n n code [r] [c4] [c7] [g_l] [g_m] flags - x'_1 ... x'_m exitcode [data'] [c4'] [c5] [g_c]`* | 相同，但会从堆栈中弹出标志。                                                                             |

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

gas成本：

- 66 Gas
- 每向子虚拟机提供一个堆栈元素，就产生 1 个 gas（前 32 个免费）
- 子虚拟机每返回一个堆栈元素，就产生 1 个 gas（前 32 个免费）

## 发送信息

目前在合约中难以计算发送消息的成本（导致了一些近似，比如在[jettons](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc#L94)中）并且如果 Action Phase 不正确，则无法将请求反弹回。精确减去传入消息的“合约逻辑的常量费用”和“gas费用”是不可能的。

- `SENDMSG` 将 cell 和模式作为输入。创建一个输出操作，并返回创建信息的费用。模式的作用与 SENDRAWMSG 相同。此外，`+1024` 表示不创建操作，只估算费用。其他模式对费用计算的影响如下：+64 "替换接收信息的全部余额作为接收值（略微不准确，因为计算完成前无法估算的 gas 费用未被考虑在内），"+128 "替换计算阶段开始前合同的全部余额值（略微不准确，因为计算完成前无法估算的 gas 费用未被考虑在内）。
- `SENDRAWMSG`，`RAWRESERVE`，`SETLIBCODE`，`CHANGELIB` - 添加了`+16`标志位，这意味着在操作失败时反弹交易。如果使用了`+2`，则没有效果。

## 安全审计

对 TON 虚拟机 (TVM) 的升级进行了安全和潜在漏洞分析。

**审计公司**：Trail of Bits\
**审计报告**：

- [Trail of Bits  审计报告 - TVM 升级](https://docs.ton.org/audits/TVM_Upgrade_ToB_2023.pdf)
