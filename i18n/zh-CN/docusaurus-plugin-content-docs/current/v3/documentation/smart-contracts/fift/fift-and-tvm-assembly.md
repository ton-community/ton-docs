# Fift 和 TVM 汇编

Fift 是一种基于堆栈的汇编编程语言，它具有 TON 特有的功能，因此可以处理cell。TVM 汇编同样是一种基于堆栈的、特定于 TON 的编程语言，它也可以处理cell。那么它们之间的区别是什么呢？

## 区别

Fift 在**编译时**执行 - FunC 代码被处理后，您的编译器构建智能合约代码 BOC 。Fift 可以有不同的形式：

```
// tuple primitives
x{6F0} @Defop(4u) TUPLE
x{6F00} @Defop NIL
x{6F01} @Defop SINGLE
x{6F02} dup @Defop PAIR @Defop CONS
```

> Asm.fif 中的 TVM 操作码定义

```
"Asm.fif" include
<{ SETCP0 DUP IFNOTRET // return if recv_internal
   DUP 85143 INT EQUAL OVER 78748 INT EQUAL OR IFJMP:<{ // "seqno" and "get_public_key" get-methods
     1 INT AND c4 PUSHCTR CTOS 32 LDU 32 LDU NIP 256 PLDU CONDSEL  // cnt or pubk
   }>
   INC 32 THROWIF	// fail unless recv_external
   9 PUSHPOW2 LDSLICEX DUP 32 LDU 32 LDU 32 LDU 	//  signature in_msg subwallet_id valid_until msg_seqno cs
   NOW s1 s3 XCHG LEQ 35 THROWIF	//  signature in_msg subwallet_id cs msg_seqno
   c4 PUSH CTOS 32 LDU 32 LDU 256 LDU ENDS	//  signature in_msg subwallet_id cs msg_seqno stored_seqno stored_subwallet public_key
   s3 s2 XCPU EQUAL 33 THROWIFNOT	//  signature in_msg subwallet_id cs public_key stored_seqno stored_subwallet
   s4 s4 XCPU EQUAL 34 THROWIFNOT	//  signature in_msg stored_subwallet cs public_key stored_seqno
   s0 s4 XCHG HASHSU	//  signature stored_seqno stored_subwallet cs public_key msg_hash
   s0 s5 s5 XC2PU	//  public_key stored_seqno stored_subwallet cs msg_hash signature public_key
   CHKSIGNU 35 THROWIFNOT	//  public_key stored_seqno stored_subwallet cs
   ACCEPT
   WHILE:<{
     DUP SREFS	//  public_key stored_seqno stored_subwallet cs _51
   }>DO<{	//  public_key stored_seqno stored_subwallet cs
     8 LDU LDREF s0 s2 XCHG	//  public_key stored_seqno stored_subwallet cs _56 mode
     SENDRAWMSG
   }>	//  public_key stored_seqno stored_subwallet cs
   ENDS SWAP INC	//  public_key stored_subwallet seqno'
   NEWC 32 STU 32 STU 256 STU ENDC c4 POP
}>c
```

> wallet_v3_r2.fif

最后一段代码看起来像是 TVM 汇编，而且大部分确实是！这是怎么发生的？

想象一下你正在对一位实习程序员说：“现在在函数末尾添加执行这个、这个和那个的命令”。你的命令最终会出现在实习生的程序中。它们被处理了两次 - 就像这里，大写字母的操作码（SETCP0、DUP 等）同时被 Fift 和 TVM 处理。

你可以向实习生解释高级抽象，最终他会理解并能够使用它们。Fift 也是可扩展的 - 你可以定义自己的命令。事实上，Asm[Tests].fif 就是关于定义 TVM 操作码的。

另一方面，TVM 操作码在**运行时**执行 - 它们是智能合约的代码。可以把它们看作是你实习生的程序 - TVM 汇编可以做的事情较少（例如，它没有内置的数据签名原语 - 因为 TVM 在区块链中做的一切都是公开的），但它可以真正与其环境互动。

## 在智能合约中的使用

### [Fift] - 将大型 BOC 放入合约

如果你使用的是 `toncli`，这是可能的。如果你使用其他编译器构建合约，可能还有其他方法来包含大型 BOC。
编辑 `project.yaml`，使得构建智能合约代码时包含 `fift/blob.fif`：

```
contract:
  fift:
    - fift/blob.fif
  func:
    - func/code.fc
```

将 BOC 放入 `fift/blob.boc`，然后将以下代码添加到 `fift/blob.fif`：

```
<b 8 4 u, 8 4 u, "fift/blob.boc" file>B B>boc ref, b> <s @Defop LDBLOB
```

现在，你可以从智能合约中提取这个 blob：

```
cell load_blob() asm "LDBLOB";

() recv_internal() {
    send_raw_message(load_blob(), 160);
}
```

### [TVM 汇编] - 将整数转换为字符串

遗憾的是，尝试使用 Fift 原语进行 int-to-string 转换失败。

```
slice int_to_string(int x) asm "(.) $>s PUSHSLICE";
```

原因很明显：Fift 在编译时进行计算，那时还没有 `x` 可供转换。要将非常量整数转换为字符串 slice ，你需要 TVM 汇编。例如，这是 TON 智能挑战 3位 参赛者之一的代码：

```
tuple digitize_number(int value)
  asm "NIL WHILE:<{ OVER }>DO<{ SWAP TEN DIVMOD s1 s2 XCHG TPUSH }> NIP";

builder store_number(builder msg, tuple t)
  asm "WHILE:<{ DUP TLEN }>DO<{ TPOP 48 ADDCONST ROT 8 STU SWAP }> DROP";

builder store_signed(builder msg, int v) inline_ref {
  if (v < 0) {
    return msg.store_uint(45, 8).store_number(digitize_number(- v));
  } elseif (v == 0) {
    return msg.store_uint(48, 8);
  } else {
    return msg.store_number(digitize_number(v));
  }
}
```

### [TVM 汇编] - 低成本的模乘

```
int mul_mod(int a, int b, int m) inline_ref {               ;; 1232 gas units
  (_, int r) = muldivmod(a % m, b % m, m);
  return r;
}
int mul_mod_better(int a, int b, int m) inline_ref {        ;; 1110 gas units
  (_, int r) = muldivmod(a, b, m);
  return r;
}
int mul_mod_best(int a, int b, int m) asm "x{A988} s,";     ;; 65 gas units
```

`x{A988}` 是根据 [5.2 Division](/learn/tvm-instructions/instructions#52-division) 格式化的操作码：带有预乘法的除法，唯一返回的结果是第三个参数的余数。但操作码需要进入智能合约代码 - 这就是 `s,` 的作用：它将栈顶的 slice 存储到稍低的构建器中。
