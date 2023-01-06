# Overview

## What is Tact?
### Familiar syntax
Tact offers familiar syntax inspired by JavaScript, Rust and Swift. Powerful features such as algebraic data types and compile-time execution look organic and friendly to new developers.


```java
struct Wallet {
val seqno: Int(32)
val pubkey: Int(256)
}

let serialize_wallet = serializer(Wallet);

fn test() -> Builder {
let b = Builder.new();
return serialize_wallet(Wallet{seqno: 0, pubkey: 777}, b);
}'
```


### Strong type system
Tact offers algebraic data types compatible with TL-B scheme. Arithmetic is always safe because integers have precise bounds. Tact compiler helps you perform necessary checks and does not produce silent failures or unexpected truncation.

```java
struct Wallet {
val seqno: Int(32);
val pubkey: PublicKey;
val plugins: List(Plugin);
}
```

### Actor-oriented
Tact is designed specifically for the TON actor model. Strongly typed messages enforce communication contracts between actors.

```java
interface Ping {
fn ping(sender: Pong, msg: PingMessage);
}
```

### Gas control
Blockchain programs have strict execution cost model. Every operation must be paid for in real time and execution may fail mid-way if it runs out of gas.

Tact makes cross-contract messages safe with precise gas commitments and compiler checks of the execution costs. Variable costs are either statically bounded, or checked explicitly in runtime.

### Zero-overhead type composition
Tact runs your program twice. First run is a compile-time execution that allows freely combining types and interfaces to precisely express invariants of the program. Types are then checked by the compiler. The resulting Fift or FunC code does not have any runtime overhead.

This model offers a single unified language with first-class types and avoids pitfall of separate mini-languages for type bounds and macros.

### Tact and FunC
FunC is a lower-level language aimed at developers who are deeply familiar with TON architecture. FunC liberates developers from writing raw Fift code, while providing the same level of control. Unfortunately, the precision of FunC makes it harder to write complex multi-contract systems.

Tact enables developers to go even further: you can write the entire suites of smart contracts with strongly typed interfaces and statically verified execution costs. With Tact you can focus on your problem and worry less about blockchain idiosyncrasies.

### Tact is just getting started
Tact is a very new project. Currently work in progress, check last version [Tact](https://github.com/ton-community/tact).