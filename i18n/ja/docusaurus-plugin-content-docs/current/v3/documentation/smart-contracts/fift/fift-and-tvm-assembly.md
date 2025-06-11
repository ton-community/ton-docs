import Feedback from '@site/src/components/Feedback';

# FiftとTVMアセンブリ

Fift is a stack-based programming language with TON-specific features that can work with cells. TVM assembly is another stack-based language designed for TON that also handles cells. What's the difference between them?

## Key differences

Fift executes at **compile-time** - when your compiler builds the smart contract code BOC after processing FunC code. Fift can appear in different forms:

```
// Tuple primitives
x{6F0} @Defop(4u) TUPLE
x{6F00} @Defop NIL
x{6F01} @Defop SINGLE
x{6F02} dup @Defop PAIR @Defop CONS
```

> Asm.fif の TVM opcode 定義

```
"Asm.fif" include
<{ SETCP0 DUP IFNOTRET // Return if recv_internal
   DUP 85143 INT EQUAL OVER 78748 INT EQUAL OR IFJMP:<{ // "seqno" and "get_public_key" get-methods
     1 INT AND c4 PUSHCTR CTOS 32 LDU 32 LDU NIP 256 PLDU CONDSEL  // cnt or pubk
   }>
   INC 32 THROWIF    // Fail unless recv_external
   9 PUSHPOW2 LDSLICEX DUP 32 LDU 32 LDU 32 LDU     // signature in_msg subwallet_id valid_until msg_seqno cs
   NOW s1 s3 XCHG LEQ 35 THROWIF    // signature in_msg subwallet_id cs msg_seqno
   c4 PUSH CTOS 32 LDU 32 LDU 256 LDU ENDS    // signature in_msg subwallet_id cs msg_seqno stored_seqno stored_subwallet public_key
   s3 s2 XCPU EQUAL 33 THROWIFNOT    // signature in_msg subwallet_id cs public_key stored_seqno stored_subwallet
   s4 s4 XCPU EQUAL 34 THROWIFNOT    // signature in_msg stored_subwallet cs public_key stored_seqno
   s0 s4 XCHG HASHSU    // signature stored_seqno stored_subwallet cs public_key msg_hash
   s0 s5 s5 XC2PU    // public_key stored_seqno stored_subwallet cs msg_hash signature public_key
   CHKSIGNU 35 THROWIFNOT    // public_key stored_seqno stored_subwallet cs
   ACCEPT
   WHILE:<{
     DUP SREFS    // public_key stored_seqno stored_subwallet cs _51
   }>DO<{    // public_key stored_seqno stored_subwallet cs
     8 LDU LDREF s0 s2 XCHG    // public_key stored_seqno stored_subwallet cs _56 mode
     SENDRAWMSG
   }>    // public_key stored_seqno stored_subwallet cs
   ENDS SWAP INC    // public_key stored_subwallet seqno'
   NEWC 32 STU 32 STU 256 STU ENDC c4 POP
}>c
```

> wallet_v3_r2.fif

The last code fragment resembles TVM assembly because most of it actually is TVM assembly. Here's why:

Imagine explaining programming concepts to a trainee. Your instructions become part of their program, processed twice - similar to how opcodes in capital letters (SETCP0, DUP, etc.) are processed by both Fift and TVM.

Think of Fift as a teaching language where you can introduce high-level concepts to a learner. Just as a trainee programmer gradually absorbs and applies new concepts, Fift allows you to define custom commands and abstractions. The Asm[Tests].fif file demonstrates this perfectly - it's essentially a collection of TVM opcode definitions.

TVM assembly, in contrast, is like the trainee's final working program. While it operates with fewer built-in features (it can't perform cryptographic signing, for instance), it has direct access to the blockchain environment during contract execution. Where Fift works at compile-time to shape the contract's code, TVM assembly runs that code on the actual blockchain.

## Smart contract usage

### [Fift] including large BoCs in contracts

When using `toncli`, you can include large BoCs by:

1. Editing `project.yaml` to include `fift/blob.fif`:

```yaml
contract:
  fift:
    - fift/blob.fif
  func:
    - func/code.fc
```

2. Adding the BoC to `fift/blob.boc`

3. Including this code in `fift/blob.fif`:

```
<b 8 4 u, 8 4 u, "fift/blob.boc" file>B B>boc ref, b> <s @Defop LDBLOB
```

Now you can access the blob in your contract:

```
cell load_blob() asm "LDBLOB";

() recv_internal() {
    send_raw_message(load_blob(), 160);
}
```

### [TVM assembly] converting integers to strings

Fift primitives can't convert integers to strings at runtime because Fift operates at compile-time. For runtime conversion, use TVM assembly like this solution from TON Smart Challenge 3:

```
tuple digitize_number(int value)
  asm "NIL WHILE:<{ OVER }>DO<{ SWAP TEN DIVMOD s1 s2 XCHG TPUSH }> NIP";

builder store_number(builder msg, tuple t)
  asm "WHILE:<{ DUP TLEN }>DO<{ TPOP 48 ADDCONST ROT 8 STU SWAP }> DROP";

builder store_signed(builder msg, int v) inline_ref {
  if (v < 0) {
    return msg.store_uint(45, 8).store_number(digitize_number(-v));
  } elseif (v == 0) {
    return msg.store_uint(48, 8);
  } else {
    return msg.store_number(digitize_number(v));
  }
}
```

### [TVM assembly] efficient modulo multiplication

Compare these implementations:

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

The `x{A988}` opcode implements an optimized division operation with built-in multiplication (as specified in [section 5.2 Division](/v3/documentation/tvm/instructions#A988)). This specialized instruction directly computes just the modulo remainder of the operation, skipping unnecessary computation steps. The `s,` suffix then handles the result storage - it takes the resulting slice from the stack's top and efficiently writes it into the target builder. Together, this combination delivers substantial gas savings compared to conventional approaches. <Feedback />

