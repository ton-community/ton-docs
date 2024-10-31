# 逐步深入探究

:::caution
本节描述了与TON进行低层级交互的说明和手册。
:::

本文档的目的是提供逐步说明，用于在TON区块链测试网络中使用TON区块链轻客户端及相关软件编译和创建一个简单的智能合约（一个简单的钱包）。

我们在这里假设轻客户端已经正确下载、编译和安装。

> 请注意，本教程适用于测试网，因此您必须使用此配置：https://ton.org/testnet-global.config.json

## 1. 智能合约地址

:::tip 新版本可用
请阅读[智能合约地址](/learn/overviews/addresses)文章的新版本。
:::

TON网络中的智能合约地址由两部分组成：

(a) 工作链ID（有符号的32位整数）和

(b) 工作链内的地址（根据工作链不同，为64-512位）。

目前，只有主链（workchain_id=-1）和偶尔的基本工作链（workchain_id=0）在TON区块链网络中运行。它们都有256位地址，因此我们假设workchain_id为0或-1，并且工作链内的地址正好为256位。

在上述条件下，智能合约地址可以表示为以下形式：

A) "原始"形式：< 十进制workchain_id>:< 64个十六进制数字表示的地址>

B) "用户友好"形式，首先生成：
- 一个标记字节（"可弹回"地址为0x11，"不可弹回"地址为0x51；如果地址不应被生产网络中运行的软件接受，则加上+0x80）
- 一个包含有符号8位整数workchain_id的字节（基本工作链为0x00，主链为0xff）
- 32个字节，包含工作链内智能合约地址的256位（大端序）
- 2个字节，包含前34个字节的CRC16-CCITT

在B)情况下，得到的36个字节然后使用base64（即数字、大小写拉丁字母、'/'和'+'）或base64url（用'_'和'-'代替'/'和'+'）编码，生成48个可打印的非空白字符。

示例：

测试网中的"测试赠送者"（一个特殊的智能合约，位于测试网络的主链中，向任何请求者赠送多达20个测试币）的地址为：

`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

"原始"形式（请注意，大写拉丁字母'A'..'F'可以替代'a'..'f'使用），

和：

`kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny`（base64）

`kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny`（base64url）

"用户友好"形式（用户友好客户端显示）。请注意，base64和base64url两种形式都是有效的，必须被接受。

顺便说一下，与TON区块链相关的其他二进制数据有类似的"加固的"base64表示，不同之处在于它们的第一个字节。例如，普遍存在的256位Ed25519公钥通过首先创建如下的36字节序列来表示：
- 一个标记字节0x3E，表示这是一个公钥
- 一个标记字节0xE6，表示这是一个Ed

25519公钥
- 32个字节，包含Ed25519公钥的标准二进制表示
- 2个字节，包含前34个字节的CRC16-CCITT的大端序表示

得到的36字节序列以标准方式转换为48个字符的base64或base64url字符串。例如，Ed25519公钥`E39ECDA0A7B0C60A7107EC43967829DBE8BC356A49B9DFC6186B3EAC74B5477D`（通常由32个字节`0xE3, 0x9E, ..., 0x7D`表示）的"加固的"表示为：

`Pubjns2gp7DGCnEH7EOWeCnb6Lw1akm538YYaz6sdLVHfRB2`

## 2. 检查智能合约的状态

使用TON轻客户端检查智能合约的状态非常容易。对于上述智能合约，您可以运行轻客户端并输入以下命令：

```func
> last
...
> getaccount -1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260
或
> getaccount kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny
```

您将看到类似这样的内容：

:::info
请注意，在此及以后的代码、注释和/或文档中可能包含“gram”、“nanogram”等参数、方法和定义。这是原始TON代码的遗留问题，由Telegram开发。Gram加密货币从未发行。TON的货币是Toncoin，TON测试网的货币是Test Toncoin。
:::
```cpp
got account state for -1 : FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260 with respect to blocks (-1,8000000000000000,2075):BFE876CE2085274FEDAF1BD80F3ACE50F42B5A027DF230AD66DCED1F09FB39A7:522C027A721FABCB32574E3A809ABFBEE6A71DE929C1FA2B1CD0DDECF3056505
account state is (account
  addr:(addr_std
    anycast:nothing workchain_id:-1 address:xFCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260)
  storage_stat:(storage_info
    used:(storage_used
      cells:(var_uint len:1 value:3)
      bits:(var_uint len:2 value:707)
      public_cells:(var_uint len:0 value:0)) last_paid:1568899526
    due_payment:nothing)
  storage:(account_storage last_trans_lt:2310000003
    balance:(currencies
      grams:(nanograms
        amount:(var_uint len:6 value:9998859500889))
      other:(extra_currencies
        dict:hme_empty))
    state:(account_active
      (
        split_depth:nothing
        special:nothing
        code:(just
          value:(raw@^Cell 
            x{}
             x{FF0020DD2082014C97BA9730ED44D0D70B1FE0A4F260D31F01ED44D0D31FD166BAF2A1F8000120D74A8E11D307D459821804A817C80073FB0201FB00DED1A4C8CB1FC9ED54}
            ))
        data:(just
          value:(raw@^Cell 
            x{}
             x{00009A15}
            ))
        library:hme_empty))))
x{CFFFCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB2923226020680B0C2EC1C0E300000000226BF360D8246029DFF56534_}
 x{FF0020DD2082014C97BA9730ED44D0D70B1FE0A4F260D31F01ED44D0D31FD166BAF2A1F8000120D74A8E11D307D459821804A817C80073FB0201FB00DED1A4C8CB1FC9ED54}
 x{00000003}
last transaction lt = 2310000001 hash = 73F89C6F8910F598AD84504A777E5945C798AC8C847FF861C090109665EAC6BA
```

第一行信息“获取...的账户状态...”显示了账户地址和用于提取账户状态的主链块标识符。请注意，即使账户状态在后续块中发生变化，`getaccount xxx`命令将返回相同的结果，直到参考块通过`last`命令更新为较新的值。通过这种方式，可以研究所有账户的状态并获得一致的结果。

“account state is (account ...”行开始了账户状态的格式化、反序列化视图。它是TL-B数据类型Account的反序列化，用于在TON区块链中表示账户状态，如TON区块链文档所解释的那样。（您可以在源文件`crypto/block/block.tlb`中找到用于反序列化的TL-B方案；请注意，如果方案过时，反序列化可能会出现故障。）

最后，以`x{CFF...`（"原始转储"）开头的最后几行包含以cell树形式显示的相同信息。在这种情况下，我们有一个根cell，包含数据位`CFF...34_`（下划线表示要删除最后一个二进制1及其后的所有二进制0，因此十六进制`4_`对应二进制`0`）和两个是其子节点的cell（显示为一级缩进）。

我们可以看到`x{FF0020DD20...}`是这个智能合约的代码。如果我们查阅TON虚拟机文档的附录A，我们甚至可以反汇编这段代码：`FF00`是`SETCP 0`，`20`是`DUP`，`DD`是`IFNOTRET`，`20`是`DUP`，依此类推。（顺便说一下，您可以在源文件`crypto/block/new-testgiver.fif`中找到这个智能合约的源代码）

我们还可以看到`x{00009A15}`（您实际看到的值可能不同）是这个智能合约的持久数据。实际上，它是一个无符号的32位整数，被智能合约用作迄今为止执行的操作计数器。请注意，这个值是大端序的（即3被编码为`x{00000003}`，而不是`x{03000000}`），如同TON区块链内的所有整数一样。在这种情况下，计数器等于`0x9A15` = `39445`。

智能合约的当前余额可以在输出的格式化部分中轻松看到。在这种情况下，我们看到`... balance:(currencies:(grams:(nanograms:(... value:1000000000000000...))))`，这是账户的（测试） nanoton 余额（这个例子中是一百万测试Toncoin；您实际看到的数字可能更小）。如果您研究`crypto/block/scheme.tlb`中提供的TL-B方案，您也将能够在原始转储部分找到这个数字（10^15）的二进制大端序形式（它位于根cell的数据位的末尾附近）。

## 3. 编译新的智能合约

在将新的智能合约上传到TON区块链之前，您需要确定其代码和数据，并将它们以序列化形式保存到一个文件中（称为“cell包”或BOC文件，通常带有.boc后缀）。让我们考虑一个简单的钱包智能合约的情况，它在其持久数据中存储了一个32位操作计数器和其所有者的256位Ed25519公钥。

显然，您需要一些用于开发智能合约的工具，即TON智能合约编译器。基本上，TON智能合约编译器是一个程序，它读取用专门的高级编程语言编写的智能合约源代码，并从这个源代码创建一个.boc文件。

其中一个工具是Fift解释器，它包含在这个发行版中，可以帮助创建简单的智能合约。更大的智能合约应该使用更复杂的工具开发（例如本发行版中包含的FunC编译器，它从FunC源文件创建Fift汇编文件；您可以在`crypto/smartcont`目录中找到一些FunC智能合约源代码）。然而，Fift对于演示目的来说已经足够了。

考虑文件`new-wallet.fif`（通常位于构建目录相对的`crypto/smartcont/new-wallet.fif`），其中包含一个简单钱包智能合约的源代码：

```cpp
#!/usr/bin/env fift -s
"TonUtil.fif" include
"Asm.fif" include

{ ."usage: " @' $0 type ." <workchain-id> [<filename-base>]" cr
  ."Creates a new wallet in specified workchain, with private key saved to or loaded from <filename-base>.pk" cr
  ."('new-wallet.pk' by default)" cr 1 halt
} : usage
$# 1- -2 and ' usage if

$1 parse-workchain-id =: wc    // 从命令行参数设置工作链ID
def? $2 { @' $2 } { "new-wallet" } cond constant file-base

."Creating new wallet in workchain " wc . cr

// 创建新的简单钱包
<{ SETCP0 DUP IFNOTRET // return if recv_internal
   DUP 85143 INT EQUAL IFJMP:<{ // "seqno" get-method
     DROP c4 PUSHCTR CTOS 32 PLDU  // cnt
   }>
   INC 32 THROWIF  // fail unless recv_external
   512 INT LDSLICEX DUP 32 PLDU   // sign cs cnt
   c4 PUSHCTR CTOS 32 LDU 256 LDU ENDS  // sign cs cnt cnt' pubk
   s1 s2 XCPU            // sign cs cnt pubk cnt' cnt
   EQUAL 33 THROWIFNOT   // ( seqno mismatch? )
   s2 PUSH HASHSU        // sign cs cnt pubk hash
   s0 s4 s4 XC2PU        // pubk cs cnt hash sign pubk
   CHKSIGNU              // pubk cs cnt ?
   34 THROWIFNOT         // signature mismatch
   ACCEPT
   SWAP 32 LDU NIP 
   DUP SREFS IF:<{
     // 3 INT 35 LSHIFT# 3 INT RAWRESERVE    // reserve all but 103 coins from the balance
     8 LDU LDREF         // pubk cnt mode msg cs
     s0 s2 XCHG SENDRAWMSG  // pubk cnt cs ; ( message sent )
   }>
   ENDS
   INC NEWC 32 STU 256 STU ENDC c4 POPCTR
}>c // >libref
// code
<b 0 32 u, 
   file-base +".pk" load-generate-keypair
   constant wallet_pk
   B, 
b> // data
null // no libraries
// Libs{ x{ABACABADABACABA} drop x{AAAA} s>c public_lib x{1234} x{5678} |_ s>c public_lib }Libs
<b b{0011} s, 3 roll ref, rot ref, swap dict, b>  // 创建StateInit
dup ."StateInit: " <s

 csr. cr
dup hash wc swap 2dup 2constant wallet_addr
."new wallet address = " 2dup .addr cr
2dup file-base +".addr" save-address-verbose
."Non-bounceable address (for init): " 2dup 7 .Addr cr
."Bounceable address (for later access): " 6 .Addr cr
<b 0 32 u, b>
dup ."signing message: " <s csr. cr
dup hash wallet_pk ed25519_sign_uint rot
<b b{1000100} s, wallet_addr addr, b{000010} s, swap <s s, b{0} s, swap B, swap <s s, b>
dup ."External message for initialization is " <s csr. cr
2 boc+>B dup Bx. cr
file-base +"-query.boc" tuck B>file
."(Saved wallet creating query to file " type .")" cr
```

（您的发行版中的实际源文件可能略有不同。）本质上，它是一个用于创建这个智能合约新实例的完整Fift脚本，该合约由新生成的密钥对控制。该脚本接受命令行参数，因此您不需要每次创建新钱包时都编辑源文件。

现在，假设您已经编译了Fift二进制文件（通常位于构建目录相对的`crypto/fift`），您可以运行：

```bash
$ crypto/fift -I<source-directory>/crypto/fift/lib -s <source-directory>/crypto/smartcont/new-wallet.fif 0 my_wallet_name
```

其中0是新钱包所在的工作链（0 = 基本工作链，-1 = 主链），`my_wallet_name`是您希望与此钱包关联的任何标识符。新钱包的地址将保存在`my_wallet_name.addr`文件中，新生成的私钥将保存在`my_wallet_name.pk`中（除非该文件已存在；如果已存在，密钥将从该文件加载），外部消息将保存在`my_wallet_name-query.boc`中。如果您未指定钱包名称（上述示例中的`my_wallet_name`），将使用默认名称`new-wallet`。

您可以选择设置环境变量`FIFTPATH`为`<source-directory>/crypto/fift/lib:<source-directory>/crypto/smartcont`，即包含`Fift.fif`和`Asm.fif`库文件以及示例智能合约源代码的目录；然后您可以在命令行中省略`-I`参数。如果您将Fift二进制文件`crypto/fift`安装到包含在您的`PATH`中的目录（例如，`/usr/bin/fift`），您可以简单地调用以下命令：

```bash
$ fift -s new-wallet.fif 0 my_wallet_name
```

而不是在命令行中指示完整的搜索路径。

如果一切顺利，您将看到类似这样的内容：

```cpp
Creating new wallet in workchain 0 
Saved new private key to file my_wallet_name.pk
StateInit: x{34_}
 x{FF0020DD2082014C97BA9730ED44D0D70B1FE0A4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED54}
 x{00000000C59DC52962CC568AC5E72735EABB025C5BDF457D029AEEA6C2FFA5EB2A945446}

new wallet address = 0:2ee9b4fd4f077c9b223280c35763df9edab0b41ac20d36f4009677df95c3afe2 
(Saving address to file my_wallet_name.addr)
Non-bounceable address (for init): 0QAu6bT9Twd8myIygMNXY9-e2rC0GsINNvQAlnfflcOv4uVb
Bounceable address (for later access): kQAu6bT9Twd8myIygMNXY9-e2rC0GsINNvQAlnfflcOv4rie
signing message: x{00000000}

External message for initialization is x{88005DD369FA9E0EF93644650186AEC7BF3DB5616835841A6DE8012CEFBF2B875FC41190260D403E40B2EE8BEB2855D0F4447679D9B9519BE64BE421166ABA2C66BEAAAF4EBAF8E162886430243216DDA10FCE68C07B6D7DDAA3E372478D711E3E1041C00000001_}
 x{FF0020DD2082014C97BA9730ED44D0D70B1FE0A4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED54}
 x{00000000C59DC52962CC568AC5E72735EABB025C5BDF457D029AEEA6C2FFA5EB2A945446}

B5EE9C724104030100000000E50002CF88005DD369FA9E0EF93644650186AEC7BF3DB5616835841A6DE8012CEFBF2B875FC41190260D403E40B2EE8BEB2855D0F4447679D9B9519BE64BE421166ABA2C66BEAAAF4EBAF8E162886430243216DDA10FCE68C07B6D7DDAA3E372478D711E3E1041C000000010010200A2FF0020DD2082014C97BA9730ED44D0D70B1FE0A4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED54004800000000C59DC52962CC568AC5E72735EABB025C5BDF457D029AEEA6C2FFA5EB2A945446BCF59C17
(Saved wallet creating query to file my_wallet_name-query.boc)
```

简而言之，Fift汇编器（由`Asm.fif`包含行加载）用于将智能合约的源代码（包含在`<{ SETCP0 ... c4 POPCTR }>`行中）编译为其内部表示。智能合约的初始数据也被创建（由`<b 0 32 u, ... b>`行生成），包含一个32位序列号（等于零），以及来自新生成的Ed25519密钥对的256位公钥。相应的私钥被保存在`my_wallet_name.pk`文件中，除非它已经存在（如果您在同一目录中运行这段代码两次，私钥将从这个文件中加载）。

智能合约的代码和数据被组合成一个`StateInit`结构（在接下来的行中），计算出新智能合约的地址（等于这个`StateInit`结构的哈希值）并输出，然后创建一个目的地址等于新智能合约地址的外部消息。这个外部消息包含新智能合约的正确`StateInit`和一个非平凡的有效载荷（由正确的私钥签名）。

最后，外部消息被序列化为cell包（由`B5EE...BE63`表示）并保存在文件`my_wallet_name-query.boc`中。本质上，这个文件是您的编译智能合约，包含将其上传到TON区块链所需的所有附加信息。

## 4. 向新的智能合约转移一些资金

您可以尝试通过运行Lite Client并输入以下命令来立即上传新的智能合约：

```
> sendfile new-wallet-query.boc
```

或

```
> sendfile my_wallet_name-query.boc
```

如果您选择将钱包命名为`my_wallet_name`。

不幸的是，这样做不会起作用，因为智能合约必须有正余额才能支付将其数据存储和处理到区块链上的费用。因此，您必须将一些资金转移到您的新智能合约地址，该地址在生成时显示为`-1:60c0...c0d0`（原始形式）和`0f9..EKD`（用户友好形式）。

在现实场景中，您要么从已有的钱包转移一些Toncoin，要么请朋友这样做，或者在加密货币交易所购买一些Toncoin，并指明将新Toncoin转移到`0f9...EKD`账户。

在测试网络中，您还有另一个选择；您可以请求“测试赠予者”给您一些测试Toncoin（最多20个）。让我们解释如何做到这一点。

## 5. 使用测试赠予者智能合约

您需要知道测试赠予者智能合约的地址。我们假设它是`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`，或者等效地，`kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny`，如前面的示例所示。您可以通过在Lite Client中输入以下命令来检查这个智能合约的状态：

```
> last
> getaccount kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny
```

正如上面第2节所解释的。您从输出中需要的唯一数字是存储在智能合约数据中的32位序列号（在上面的示例中是`0x9A15`，但通常会有所不同）。获取这个序列号当前值的更简单方法是输入：

```
> last
> runmethod kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny seqno
```

生成正确的值 39445 = 0x9A15：

```cpp
got account state for -1 : FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260 with respect to blocks (-1,8000000000000000,2240):18E6DA7707191E76C71EABBC5277650666B7E2CFA2AEF2CE607EAFE8657A3820:4EFA2540C5D1E4A1BA2B529EE0B65415DF46BFFBD27A8EB74C4C0E17770D03B1
creating VM
starting VM to run method `seqno` (85143) of smart contract -1:FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260
...
arguments:  [ 85143 ] 
result:  [ 39445 ] 
```

接下来，您创建一个外部消息给测试赠予者，要求它发送另一个消息给您的（未初始化的）智能合约，携带指定数量的测试Toncoin。有一个特殊的Fift脚本用于生成这个外部消息，位于`crypto/smartcont/testgiver.fif`：

```cpp
#!/usr/bin/env fift -s
"TonUtil.fif" include

{ ."usage: " @' $0 type ." <dest-addr> <seqno> <amount> [<savefile>]" cr
  ."Creates a request to TestGiver and saves it into <savefile>.boc" cr
  ."('testgiver-query.boc' by default)" cr 1 halt
} : usage

$# 3 - -2 and ' usage if

// "testgiver.addr" load-address 
Masterchain 0xfcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260
2constant giver_addr
 ."Test giver address = " giver_addr 2dup .addr cr 6 .Addr cr

$1 true parse-load-address =: bounce 2=: dest_addr
$2 parse-int =: seqno
$3 $>GR =: amount
def? $4 { @' $4 } { "testgiver-query" } cond constant savefile

."Requesting " amount .GR ."to account "
dest_addr 2dup bounce 7 + .Addr ." = " .addr
."seqno=0x" seqno x. ."bounce=" bounce . cr

// create a message (NB: 01b00.., b = bounce)
<b b{01} s, bounce 1 i, b{000100} s, dest_addr addr, 
   amount Gram, 0 9 64 32 + + 1+ 1+ u, "GIFT" $, b>
<b seqno 32 u, 1 8 u, swap ref, b>
dup ."enveloping message: " <s csr. cr
<b b{1000100} s, giver_addr addr, 0 Gram, b{00} s,
   swap <s s, b>
dup ."resulting external message: " <s csr. cr
2 boc+>B dup Bx. cr
savefile +".boc" tuck B>file
."(Saved to file " type .")" cr
```

您可以将所需的参数作为命令行参数传递给这个脚本。

```bash
$ crypto/fift -I<include-path> -s <path-to-testgiver-fif> <dest-addr> <testgiver-seqno> <coins-amount> [<savefile>]
```

例如，

```bash
$ crypto/fift -I<source-directory>/crypto/fift/lib:<source-directory>/crypto/smartcont -s testgiver.fif 0QAu6bT9Twd8myIygMNXY9-e2rC0GsINNvQAlnfflcOv4uVb 0x9A15 6.666 wallet-query
```

或简单地：

```bash
$ fift -s testgiver.fif 0QAu6bT9Twd8myIygMNXY9-e2rC0GsINNvQAlnfflcOv4uVb 0x9A15 6.666 wallet-query
```

前提是您已将环境变量`FIFTPATH`设置为`<source-directory>/crypto/fift/lib:<source-directory>/crypto/smartcont`，并将fift二进制文件安装在`/usr/bin/fift`（或您的`PATH`中的任何其他位置）。

新创建的消息必须清除其弹回位，否则转账将被弹回给发送者。这就是为什么我们传递了我们新钱包智能合约的不可弹回地址`0QAu6bT9Twd8myIygMNXY9-e2rC0GsINNvQAlnfflcOv4uVb`。

这段Fift代码创建了一个从测试赠予者智能合约到我们新智能合约地址的内部消息，携带6.666测试TON（您可以在此处输入任何其他金额，最多大约20 TON）。然后，这个消息被包装进一个发送到测试赠予者的外部消息中。当测试赠予者收到这样一个外部消息时，它会检查序列号是否与其持久数据中存储的序列号相匹配，如果是的话，就会发送携带所需测试TON数量的内部消息到目的地（在这种情况下是我们的智能合约）。

外部消息被序列化并保存到文件`wallet-query.boc`中。过程中生成了一些输出：

```cpp
Test giver address = -1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260 
kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny
Requesting GR$6.666 to account 0QAu6bT9Twd8myIygMNXY9-e2rC0GsINNvQAlnfflcOv4uVb = 0:2ee9b4fd4f077c9b223280c35763df9edab0b41ac20d36f4009677df95c3afe2 seqno=0x9a15 bounce=0 
enveloping message: x{00009A1501}
 x{42001774DA7EA783BE4D91194061ABB1EFCF6D585A0D61069B7A004B3BEFCAE1D7F1280C6A98B4000000000000000000000000000047494654}

resulting external message: x{89FF02ACEEB6F264BCBAC5CE85B372D8616CA2B4B9A5E3EC98BB496327807E0E1C1A000004D0A80C_}
 x{42001774DA7EA783BE4D91194061ABB1EFCF6D585A0D61069B7A004B3BEFCAE1D7F1280C6A98B4000000000000000000000000000047494654}

B5EE9C7241040201000000006600014F89FF02ACEEB6F264BCBAC5CE85B372D8616CA2B4B9A5E3EC98BB496327807E0E1C1A000004D0A80C01007242001774DA7EA783BE4D91194061ABB1EFCF6D585A0D61069B7A004B3BEFCAE1D7F1280C6A98B4000000000000000000000000000047494654AFC17FA4
(Saved to file wallet-query.boc)
```

## 6. 将外部消息上传到测试赠予者智能合约

现在我们可以调用Lite Client，检查测试赠予者的状态（如果序列号已更改，我们的外部消息将失败），然后输入：

```bash
> sendfile wallet-query.boc
```

我们将看到输出：

```bash
... external message status is 1
```

这意味着外部消息已被发送到 collator 池。之后，其中一个 collator 可能会选择将这个外部消息包含在一个区块中，为测试赠予者智能合约创建一个处理这个外部消息的交易。我们可以检查测试赠予者的状态是否已更改：

```bash
> last
> getaccount kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny
```

（如果您忘记输入`last`，您可能会看到测试赠予者智能合约的未更改状态。）结果输出将是：

```cpp
got account state for -1 : FCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260 with respect to blocks (-1,8000000000000000,2240):18E6DA7707191E76C71EABBC5277650666B7E2CFA2AEF2CE607EAFE8657A3820:4EFA2540C5D1E4A1BA2B529EE0B65415DF46BFFBD27A8EB74C4C0E17770D03B1
account state is (account
  addr:(addr_std
    anycast:nothing workchain_id:-1 address:xFCB91A3A3816D0F7B8C2C76108B8A9BC5A6B7A55BD79F8AB101C52DB29232260)
  storage_stat:(storage_info
    used:(storage_used
      cells:(var_uint len:1 value:3)
      bits:(var_uint len:2 value:707)
      public_cells:(var_uint len:0 value:0)) last_paid:0
    due_payment:nothing)
  storage:(account_storage last_trans_lt:10697000003
    balance:(currencies
      grams:(nanograms
        amount:(var_uint len:7 value:999993280210000))
      other:(extra_currencies
        dict:hme_empty))
    state:(account_active
      (
        split_depth:nothing
        special:nothing
        code:(just
          value:(raw@^Cell 
            x{}
             x{FF0020DDA4F260D31F01ED44D0D31FD166BAF2A1F80001D307D4D1821804A817C80073FB0201FB00A4C8CB1FC9ED54}
            ))
        data:(just
          value:(raw@^Cell 
            x{}
             x{00009A16}
            ))
        library:hme_empty))))
x{CFF8156775B79325E5D62E742D9B96C30B6515A5CD2F1F64C5DA4B193C03F070E0D2068086C00000000000000009F65D110DC0E35F450FA914134_}
 x{FF0020DDA4F260D31F01ED44D0D31FD166BAF2A1F80001D307D4D1821804A817C80073FB0201FB00A4C8CB1FC9ED54}
 x{00000001}
```

您可能会注意到存储在持久数据中的序列号已更改（在我们的示例中，变为0x9A16 = 39446），并且`last_trans_lt`字段（该账户最后一笔交易的逻辑时间）已增加。

现在我们可以检查我们新智能合约的状态：

```cpp
> getaccount 0QAu6bT9Twd8myIygMNXY9-e2rC0GsINNvQAlnfflcOv4uVb
或
> getaccount 0:2ee9b4fd4f077c9b223280c35763df9edab0b41ac20d36f4009677df95c3afe2
```

现在我们看到：

```cpp
got account state for 0:2EE9B4FD4F077C9B223280C35763DF9EDAB0B41AC20D36F4009677DF95C3AFE2 with respect to blocks (-1,8000000000000000,16481):890F4D549428B2929F5D5E0C5719FBCDA60B308BA4B907797C9E846E644ADF26:22387176928F7BCEF654411CA820D858D57A10BBF1A0E153E1F77DE2EFB2A3FB and (-1,8000000000000000,16481):890F4D549428B2929F5D5E0C5719FBCDA60B308BA4B907797C9E846E644ADF26:22387176928F7BCEF654411CA820D858D57A10BBF1A0E153E1F77DE2EFB2A3FB
account state is (account
  addr:(addr_std
    anycast:nothing workchain_id:0 address:x2EE9B4FD4F077C9B223280C35763DF9EDAB0B41AC20D36F4009677DF95C3AFE2)
  storage_stat:(storage_info
    used:(storage_used
      cells:(var_uint len:1 value:1)
      bits:(var_uint len:1 value:111)
      public_cells:(var_uint len:0 value:0)) last_paid:1553210152
    due_payment:nothing)
  storage:(account_storage last_trans_lt:16413000004
    balance:(currencies
      grams:(nanograms
        amount:(var_uint len:5 value:6666000000))
      other:(extra_currencies
        dict:hme_empty))
    state:account_uninit))
x{CFF60C04141C6A7B96D68615E7A91D265AD0F3A9A922E9AE9C901D4FA83F5D3C0D02025BC2E4A0D9400000000F492A0511406354C5A004_}
```

我们的新智能合约有一些正余额（6.666测试Toncoin），但没有代码或数据（反映为`state:account_uninit`）。

## 7. 上传新智能合约的代码和数据

现在，您终于可以上传包含新智能合约的代码和数据的`StateInit`外部消息了：

```cpp
> sendfile my_wallet_name-query.boc
... external message status is 1
> last
...
> getaccount 0QAu6bT9Twd8myIygMNXY9-e2rC0GsINNvQAlnfflcOv4uVb
...
got account state for 0:2EE9B4FD4F077C9B223280C35763DF9EDAB0B41AC20D36F4009677DF95C3AFE2 with respect to blocks (-1,8000000000000000,16709):D223B25D8D68401B4AA19893C00221CF9AB6B4E5BFECC75FD6048C27E001E0E2:4C184191CE996CF6F91F59CAD9B99B2FD5F3AA6F55B0B6135069AB432264358E and (-1,8000000000000000,16709):D223B25D8D68401B4AA19893C00221CF9AB6B4E5BFECC75FD6048C27E001E0E2:4C184191CE996CF6F91F59CAD9B99B2FD5F3AA6F55B0B6135069AB432264358E
account state is (account
  addr:(addr_std
    anycast:nothing workchain_id:0 address:x2EE9B4FD4F077C9B223280C35763DF9EDAB0B41AC20D36F4009677DF95C3AFE2)
  storage_stat:(storage_info
    used:(storage_used
      cells:(var_uint len:1 value:3)
      bits:(var_uint len:2 value:963)
      public_cells:(var_uint len:0 value:0)) last_paid:1553210725
    due_payment:nothing)
  storage:(account_storage last_trans_lt:16625000002
    balance:(currencies
      grams:(nanograms
        amount:(var_uint len:5 value:5983177000))
      other:(extra_currencies
        dict:hme_empty))
    state:(account_active
      (
        split_depth:nothing
        special:nothing
        code:(just
          value:(raw@^Cell 
            x{}
             x{FF0020DDA4F260810200D71820D70B1FED44D0D7091FD709FFD15112BAF2A122F901541044F910F2A2F80001D7091F3120D74A97D70907D402FB00DED1A4C8CB1FCBFFC9ED54}
            ))
        data:(just
          value:(raw@^Cell 
            x{}
             x{00000001F61CF0BC8E891AD7636E0CD35229D579323AA2DA827EB85D8071407464DC2FA3}
            ))
        library:hme_empty))))
x{CFF60C04141C6A7B96D68615E7A91D265AD0F3A9A922E9AE9C901D4FA83F5D3C0D020680F0C2E4A0EB280000000F7BB57909405928024A134_}
 x{FF0020DDA4F260810200D71820D70B1FED44D0D7091FD709FFD15112BAF2A122F901541044F910F2A2F80001D7091F3120D74A97D70907D402FB00DED1A4C8CB1FCBFFC9ED54}
 x{00000001F61CF0BC8E891AD7636E0CD35229D579323AA2DA827EB85D8071407464DC2FA3}
```

您将看到智能合约已使用外部消息的`StateInit`中的代码和数据进行初始化，其余额因处理费用而略有减少。现在它已启动并运行，您可以通过生成新的外部消息并使用Lite Client的`sendfile`命令将它们上传到TON区块链来激活它。

## 8. 使用简单钱包智能合约

实际上，在这个例子中使用的简单钱包智能合约可以用来向任何其他账户转移测试TON。在这方面，它与上面讨论的测试赠予者智能合约类似，不同之处在于它仅处理由正确私钥（其所有者的）签名的外部消息。在我们的案例中，它是在智能合约编译期间保存到文件`my_wallet_name.pk`中的私钥（见第3节）。

以下是您如何使用这个智能合约的示例，提供在文件`crypto/smartcont/wallet.fif`中：

```cpp
#!/usr/bin/env fift -s
"TonUtil.fif" include

{ ."usage: " @' $0 type ." <filename-base> <dest-addr> <seqno> <amount> [-B <body-boc>] [<savefile>]" cr
  ."Creates a request to simple wallet created by new-wallet.fif, with private key loaded from file <filename-base>.pk "
  ."and address from <filename-base>.addr, and saves it into <savefile>.boc ('wallet-query.boc' by default)" cr 1 halt
} : usage
$# dup 4 < swap 5 > or ' usage if
def? $6 { @' $5 "-B" $= { @' $6 =: body-boc-file [forget] $6 def? $7 { @' $7 =: $5 [forget] $7 } { [forget] $5 } cond
  @' $# 2- =: $# } if } if

true constant bounce

$1 =: file-base
$2 bounce parse-load-address =: bounce 2=: dest_addr
$3 parse-int =: seqno
$4 $>GR =: amount
def? $5 { @' $5 } { "wallet-query" } cond constant savefile

file-base +".addr" load-address
2dup 2constant wallet_addr
."Source wallet address = " 2dup .addr cr 6 .Addr cr
file-base +".pk" load-keypair nip constant wallet_pk

def? body-boc-file { @' body-boc-file file>B B>boc } { <b "TEST" $, b> } cond
constant body-cell

."Transferring " amount .GR ."to account "
dest_addr 2dup bounce 7 + .Addr ." = " .addr 
."seqno=0x" seqno x. ."bounce=" bounce . cr
."Body of transfer message is " body-cell <s csr. cr
  
// create a message
<b b{01} s, bounce 1 i, b{000100} s, dest_addr addr, amount Gram, 0 9 64 32 + + 1+ u, 
  body-cell <s 2dup s-fits? not rot over 1 i, -rot { drop body-cell ref, } { s, } cond
b>
<b seqno 32 u, 1 8 u, swap ref, b>
dup ."signing message: " <s csr. cr
dup hash wallet_pk ed25519_sign_uint
<b b{1000100} s, wallet_addr addr, 0 Gram, b{00} s,
   swap B, swap <s s, b>
dup ."resulting external message: " <s csr. cr
2 boc+>B dup Bx. cr
savefile +".boc" tuck B>file
."(Saved to file " type .")" cr
```

您可以按如下方式调用此脚本：

```bash
$ fift -I<source-directory>/crypto/fift/lib:<source-directory>/crypto/smartcont -s wallet.fif <your-wallet-id> <destination-addr> <your-wallet-seqno> <coins-amount>
```

或简单地：

```bash
$ fift -s wallet.fif <your-wallet-id> <destination-addr> <your-wallet-seqno> <coins-amount>
```

如果您正确设置了`PATH`和`FIFTPATH`。

例如：

```bash
$ fift -s wallet.fif my_wallet_name kf8Ty2EqAKfAksff0upF1gOptUWRukyI9x5wfgCbh58Pss9j 1 .666
```

这里`my_wallet_name`是您之前与`new-wallet.fif`一起使用的钱包标识符。您的测试钱包的地址和私钥将从当前目录中的文件`my_wallet_name.addr`和`my_wallet_name.pk`中加载。

当您运行此代码（通过调用Fift解释器）时，您将创建一个目的地等于您钱包智能合约地址的外部消息，其中包含正确的Ed25519签名、序列号和一个从您的钱包智能合约到`dest_addr`中指示的智能合约的内部消息，附带任意值和任意有效载荷。当您的智能合约接收并处理这个外部消息时，它首先检查签名和序列号。如果它们是正确的，它接受外部消息，从自身发送嵌入的内部消息到预期的目的地，并在其持久数据中增加序列号（这是一种简单的措施，以防止在这个示例钱包智能合约代码被用于真正的钱包应用程序时重放攻击）。

当然，真正的TON区块链钱包应用程序会隐藏上述所有中间步骤。它首先会将新智能合约的地址通知用户，要求他们从另一个钱包或加密货币交易所转移一些资金到指定地址（以不可弹回的、用户友好的形式显示），然后提供一个简单的界面来显示当前余额并向用户想要的任何其他地址转移资金。（本文档的目的是解释如何创建新的非平凡智能合约并在TON区块链测试网络上进行实验，而不是解释如何使用Lite Client代替更用户友好的钱包应用程序。）

最后一点备注：上述示例使用的是基本工作链（工作链 0）中的智能合约。如果将工作链标识符-1而不是0作为`new-wallet.fif`的第一个参数传递，它们在主链（工作链-1）上的功能将完全相同。唯一的区别是基本工作链中的处理和存储费用比主链低100-1000倍。一些智能合约（例如验证者选举智能合约）只接受来自主链智能合约的转账，因此如果您希望代表自己的验证者进行投注并参加选举，您将需要在主链上拥有一个钱包。
