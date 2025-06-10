---
title: "Auto packing to/from cells"
---

import Feedback from '@site/src/components/Feedback';

# Auto-packing to/from cells/slices/builders

A short demo of how it looks:
```tolk
struct Point {
    x: int8;
    y: int8;
}

var value: Point = { x: 10, y: 20 };

// makes a cell containing "0A14"
var c = value.toCell();   
// back to { x: 10, y: 20 }   
var p = Point.fromCell(c);
```


## Key features of auto-serialization


* Supports all types: unions, tensors, nullables, generics, atomics, ...
* Allows you to specify serialization prefixes (particularly, opcodes)
* Allows you to manage cell references and when to load them
* Lets you control error codes and other behavior
* Unpacks data from a cell or a slice, mutate it or not
* Packs data to a cell or a builder
* Warns if data potentially exceeds 1023 bits
* More efficient than manual serialization



## List of supported types and how they are serialized

A small reminder: Tolk has `intN` types (`int8`, `uint64`, etc.). Of course, they can be nested, like nullable `int32?` or a tensor `(uint5, int128)`. 
They are just integers at the TVM level, they can hold any value at runtime: **overflow only happens at serialization**. 
For example, if you assign 256 to uint8, asm command "8 STU" will fail with code 5 (integer out of range).


| Type                      | TL-B equivalent                          | Serialization notes                 |
|---------------------------|------------------------------------------|-------------------------------------|
| `int8`, `uint55`, etc.    | same as TL-B                             | `N STI` / `N STU`                   |
| `coins`                   | TL-B varint16                            | `STGRAMS`                           |
| `bytes8`, `bits123`, etc. | just N bits                              | runtime check + `STSLICE` (1)       |
| `address`                 | MsgAddress (internal/external/none)      | `STSLICE` (2)                       |
| `bool`                    | one bit                                  | `1 STI`                             |
| `cell`                    | untyped reference, TL-B `^Cell`          | `STREF`                             |
| `cell?`                   | maybe reference, TL-B `(Maybe ^Cell)`    | `STOPTREF`                          |
| `Cell<T>`                 | typed reference, TL-B `^T`               | `STREF`                             |
| `Cell<T>?`                | maybe typed reference, TL-B `(Maybe ^T)` | `STOPTREF`                          |
| `RemainingBitsAndRefs`    | rest of slice                            | `STSLICE`                           |
| `builder`                 | only for writing, not for reading        | `STBR`                              |
| `T?`                      | TL-B `(Maybe T)`                         | `1 STI` + IF ...                    |
| `T1 \| T2`                | TL-B `(Either T1 T2)`                    | `1 STI` + IF ... + ELSE ... (3)     |
| `T1 \| T2 \| ...`         | TL-B multiple constructors               | IF ... + ELSE IF ... + ELSE ... (4) |
| `(T1, T2)`                | TL-B `(Pair T1 T2)` = one by one         | pack T1 + pack T2                   |
| `(T1, T2, ...)`           | nested pairs = one by one                | pack T1 + pack T2 + ...             |
| `SomeStruct`              | fields one by one                        | like a tensor                       |


* (1) By analogy with `intN`, there is are `bytesN` types. It's just a `slice` under the hood: the type shows how to serialize this slice. 
By default, before `STSLICE`, the compiler inserts runtime checks (get bits/refs count + compare with N + compare with 0). 
These checks ensure that serialized binary data will be correct, but they cost gas. 
However, if you guarantee that a slice is valid (for example, it comes from trusted sources), pass an option `skipBitsNFieldsValidation` to disable runtime checks.

* (2) In TVM, all addresses are also plain slices. Type `address` indicates that it's a slice containing *some* valid address (internal/external/none). 
It's packed with `STSLICE` (no runtime checks) and loaded with `LDMSGADDR`. 

Don't confuse `address none` with null! `None` is a valid address (two zero bits), whereas `address?` is `maybe address` (bit "0" OR bit "1" + address).

* (3) TL-B Either is expressed with a union `T1 | T2`. For example, `int32 | int64` is packed as ("0" + 32-bit int OR "1" + 64-bit int). 

However, if T1 and T2 are both structures with manual serialization prefixes, those prefixes are used instead of a 0/1 bit.

* (4) To (un)pack a union, say, `Msg1 | Msg2 | Msg3`, we need serialization prefixes. For structures, you can specify them manually 
(or the compiler will generate them right here). For primitives, like `int32 | int64 | int128 | int256`, the compiler generates a prefix tree 
(00/01/10/11 in this case). Read **auto-generating serialization prefixes** below.



## Some examples of valid types

```tolk
struct A {
    f1: int8;      // just int8
    f2: int8?;     // maybe int8
    f3: address;   // internal/external/none
    f4: bool;      // TRUE (-1) serialized as bit '1'
    f5: B;         // embed fields of struct B
    f6: B?;        // maybe B
    f7: coins;     // used for money amounts

    r1: cell;         // always-existing untyped ref
    r2: Cell<B>;      // typed ref
    r3: Cell<int32>?; // optional ref that stores int32

    u1: int32 | int64;  // Either
    u2: B | C;          // also Either
    u3: B | C | D;      // manual or autogenerated prefixes
    u4: bits4 | bits8?; // autogenerated prefix tree

    // even this works
    e: Point | Cell<Point>;

    // rest of slice
    rest: RemainingBitsAndRefs;  
}
```


## Serialization prefixes and opcodes

Declaring a struct, there is a special syntax to provide pack prefixes. 

Typically, you'll use 32-bit prefixes for messages opcodes, or arbitrary prefixes is case you'd like to express TL-B multiple constructors.


```tolk
struct (0x7362d09c) TransferNotification {
    queryId: uint64;
    ...
}
```

Prefixes **can be of any width**, they are not restricted to be 32 bit.
* `0x000F` — 16-bit prefix
* `0x0F` — 8-bit prefix
* `0b010` — 3-bit prefix
* `0b00001111` — 8-bit prefix


Declaring messages with 32-bit opcodes does not differ from declaring any other structs. Say, you the following TL-B scheme:


```tl-b
asset_simple$001 workchain:int8 ptr:bits32 = Asset;
asset_booking$1000 order_id:uint64 = Asset;
...
```

You can express the same with structures and union types:
```tolk
struct (0b001) AssetSimple {
    workchain: int8;
    ptr: bits32;
}

struct (0b1000) AssetBooking {
    orderId: uint64;
}

type Asset = AssetSimple | AssetBooking | ...;

struct ProvideAssetMessage {
    ...
    asset: Asset;
}
```

When deserializing, `Asset` will follow manually provided prefixes:
```tolk
// msg.asset is parsed as '001' + int8 + bits32 OR ...
val msg = ProvideAssetMessage.fromSlice(s);

// now, msg.asset is just a union
// you can match it
match (msg.asset) {
    AssetSimple => {   // smart cast
        msg.asset.workchain
        msg.asset.ptr
    }
    ...
}
// or test with `is` operator
if (msg.asset is AssetBooking) {
    ...
}
// or do any other things with a union:
// prefixes play their role only in deserialization process
```

When serializing, everything also works as expected:
```tolk
val out: ProvideAssetMessage = {
    ...,
    asset: AssetSimple {   // will be serialized as
        workchain: ...,    // '001' + int8 + bits32
        ptr: ...
    }
}
```

Note that if a struct has a manual pack prefix, it does not matter whether this struct is inside any union or not.
```tolk
struct (0x1234) MyData {
    ...
}

MyData.fromSlice(s)  // expected to be "1234..." (hex)
data.toCell()        // "1234..."
```

That's why, when you declare outgoing messages with 32-bit opcodes and just serialize them, that opcodes are included in binary data.


## What can NOT be serialized

* `int` can't be serialized, it does not define binary width; use `int32`, `uint64`, etc.
* `slice`, for the same reason; use `address` or `bitsN`
* tuples, not implemented
* `A | B` (and `A|B|C|...` in general) if A has manual serialization prefix, B not (because it seems like a bug in your code)
* `int32 | A` (and `primitives|...|structs` in general) if A has manual serialization prefix (because it's not definite what prefixes to use for primitives)

Example of invalid:
```tolk
struct (0xFF) A {}
struct B {}   // forgot prefix

fun invalidDemo(obj: A | B) {
    // (it's better to fire an error than to generate '0'+'FF'+dataA OR '1'+dataB)
    obj.toCell();   // error: A has prefix, B not
}
```


## Error messages if serialization unavailable

If you, by mistake, use unsupported types, Tolk compiler will fire a meaningful error. Example:
```tolk
struct ExtraData {
    owner: address;
    lastTime: int;
}

struct Storage {
    ...
    more: Cell<ExtraData>;
}

Storage.fromSlice("");
```

fires an error:
```
auto-serialization via fromSlice() is not available for type `Storage`
because field `Storage.more` of type `Cell<ExtraData>` can't be serialized
because type `ExtraData` can't be serialized
because field `ExtraData.lastTime` of type `int` can't be serialized
because type `int` is not serializable, it doesn't define binary width
hint: replace `int` with `int32` / `uint64` / `coins` / etc.
```


## Controlling cell references. Typed cells

Tolk gives you full control over how your data is placed in cells and how cells reference each other. 
When you declare fields in a struct, there is no compiler magic of reordering fields, making any implicit references, etc. 
As follows, whenever you need to place data in a ref, you do it manually. As well as you manually control, when contents of that ref is loaded.

There are two types of references: typed and untyped.

```tolk
struct NftCollectionStorage {
    ownerAddress: address;
    nextItemIndex: uint64;
    content: cell;                       // untyped
    nftItemCode: cell;                   // untyped
    royaltyParams: Cell<RoyaltyParams>;  // typed
}

struct RoyaltyParams {
    numerator: uint16;
    denominator: uint16;
    royaltyAddress: address;
}
```

When you call `NftCollectionStorage.fromSlice` (or fromCell), the process is as follows:
1) read address (slice.loadAddress)
2) read uint64 (slice.loadUint 64)
3) read three refs (slice.loadRef); do not unpack them: we just have pointers to cells

Note, that `royaltyParams` is `Cell<T>`, not `T` itself. You can NOT access `numerator`, etc. To load those fields, you should manually unpack that ref:
```tolk
// error: field does not exist in type `Cell<RoyaltyParams>`
st.royaltyParams.numerator

// that's the way
val rp = st.royaltyParams.load();   // Cell<T> -> T
rp.numerator

// alternatively
val rp = RoyaltyParams.fromCell(st.royaltyParams);
```

And vice versa: when composing such a struct, you should assign a typed cell to a field:
```tolk
val st: NftCollectionStorage = {
    ...
    // error
    royaltyParams: RoyaltyParams{ ... }
    // correct
    royaltyParams: RoyaltyParams{ ... }.toCell()
}
```

Probably, you've guessed that `T.toCell()` makes `Cell<T>`, actually. That's true:
```tolk
val c = p.toCell();  // Point to Cell<Point>
val p2 = c.load();   // Cell<Point> to Point
```

With types cells, you can express snake data:
```tolk
struct Snake {
    data: bits1023;
    next: Cell<Snake>?;
}
```

So, typed cells are a powerful mechanism to express the contents of referenced cells. 
Note that `Cell<address>` or even `Cell<int32 | int64>` is also okay, you are not restricted to structures.

When it comes to untyped cells — just `cell` — they also denote references, but don't denote their inner contents, don't have the `.load()` method. 

It's just _some cell_, like code/data of a contract or an untyped nft content.



## Remaining data after reading

Suppose you have struct Point (x int8, y int8), and read from a slice with contents "0102FF". 
Byte "01" for x, byte "02" for y, and the remaining "FF" — is it correct?

**By default, this is incorrect**. By default, functions `fromCell` and `fromSlice` ensure the slice end after reading. 
In this case, exception 9 ("cell underflow") is thrown.

But you can override this behavior with an option:
```tolk
Point.fromSlice(s, {
    assertEndAfterReading: false
})
```


## UnpackOptions and PackOptions

They allow you to control behavior of `fromCell`, `toCell`, and similar functions:
```tolk
MyMsg.fromSlice(s, {
    throwIfOpcodeDoesNotMatch: 0xFFFF
})
```

Serialization functions have the second optional parameter, actually:
```tolk
fun T.fromSlice(rawSlice: slice, options: UnpackOptions = {}): T;
```

When you don't pass it, default options are used. But you can overload some of the options.

For deserialization (`fromCell` and similar), there are now two available options:

| Field of UnpackOptions      | Description                                                                                                                                                                                                                                                                                                 |
|-----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `assertEndAfterReading`     | after finished reading all fields from a cell/slice, call `slice.assertEnd` to ensure no remaining data left; it's the default behavior, it ensures that you've fully described data you're reading with a struct; for struct `Point`, input "0102" is ok, "0102FF" will throw excno 9; **default: true**   |
| `throwIfOpcodeDoesNotMatch` | this excNo is thrown if opcode doesn't match, e.g. for `struct (0x01) A` given input "88..."; similarly, for a union type, this is thrown when none of the opcodes match; **default: 63**                                                                                                                   |

For serialization (`toCell` and similar), there is now one option:

| Field of PackOptions        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `skipBitsNFieldsValidation` | when a struct has a field of type `bits128` and similar (it's a slice under the hood), by default, compiler inserts runtime checks (get bits/refs count + compare with 128 + compare with 0); these checks ensure that serialized binary data will be correct, but they cost gas; however, if you guarantee that a slice is valid (for example, it comes from trusted sources), set this option to true to disable runtime checks; *note: `int32` and other are always validated for overflow without any extra gas, so this flag controls only rarely used `bytesN` / `bitsN` types;* **default: false**  |


## Full list of serialization functions

Each of them can be controlled by `PackOptions` described above.

1) `T.toCell()` — convert anything to a cell. Example:
```tolk
contract.setData(storage.toCell());
```
Internally, a builder is created, all fields are serialized one by one, and a builder is flushed (beginCell() + serialize fields + endCell()).

2) `builder.storeAny<T>(v)` — similar to `builder.storeUint()` and others, but allows storing structures. Example:
```tolk
var b = beginCell()
       .storeUint(32)
       .storeAny(msgBody)  // T=MyMsg here
       .endCell();
```


## Full list of deserialization functions

Each of them can be controlled by `UnpackOptions` described above.

1) `T.fromCell(c)` — parse anything from a cell. Example:
```tolk
var st = MyStorage.fromCell(contract.getData());
```
Internally, a cell is unpacked to a slice, and that slice is parsed (c.beginParse() + read from slice).

2) `T.fromSlice(s)` — parse anything from a slice. Example:
```tolk
var msg = CounterIncrement.fromSlice(cs);
```
All fields are read from a slice immediately. If a slice is corrupted, an exception is thrown (most likely, excode 9 "cell underflow"). Note, that a passed slice is NOT mutated, its internal pointer is NOT shifted. If you need to mutate it, like `cs.loadInt()`, consider calling `cs.loadAny<Increment>()`.

3) `slice.loadAny<T>` — parse anything from a slice, shifting its internal pointer. Similar to `slice.loadUint()` and others, but allows loading structures. Example:
```tolk
var st: MyStorage = cs.loadAny();     // or cs.loadAny<MyStorage>()
cs.loadAny<int32>();                  // = cs.loadInt(32)
```
Similar to `MyStorage.fromSlice(cs)`, but called as a method and mutates the slice. Note: `options.assertEndAfterReading` is ignored by this function, because it's actually intended to read data from the middle.

4) `slice.skipAny<T>` — skip anything in a slice, shifting its internal pointer. Similar to `slice.skipBits()` and others, but allows skipping structures. Example:
```tolk
struct TwoInts { a: int32; b: int32; }
cs.skipAny<TwoInts>();    // skips 64 bits
cs.skipAny<int32>();      // = cs.skipBits(32)
```


## Special type RemainingBitsAndRefs

It's a built-in type to get "all the rest" slice tail on reading. Example:
```tolk
struct JettonMessage {
     // ... some fields
     forwardPayload: RemainingBitsAndRefs;
}
```

When you deserialize JettonMessage, forwardPayload contains _everything left after reading fields above_. Essentially, it's an alias to a slice which is handled specially while unpacking:


```
type RemainingBitsAndRefs = slice;
```


## Auto-generating prefixes for unions


We've mentioned multiple times, that `T1 | T2` is encoded as TL-B Either: bit '0' + T1 OR bit '1' + T2. But what about wider unions? Say,

```tolk
struct WithUnion {
    f: int8 | int16 | int32;
}
```

In this case, **the compiler auto-generates a prefix tree**. This field will be packed as: '00' + int8 OR '01' + int16 OR '10' + int32. 
On deserialization, the same format is expected (prefix '11' will throw an exception).

Same for structs without a manually specified prefix:
```tolk
struct A { ... }    // 0x... prefixes not specified
struct B { ... }
struct C { ... }

struct WithUnion {
    // simple either ('0' + A OR '1' + B)
    e: A | B;
    // auto-generated prefix tree
    f: A | B | C;
    // even this works, why not
    g: A | int32 | C | bits128;
}
```

When declaring a struct, you can manually specify serialization prefix (32-bit prefixes for messages are called opcodes, but prefixes in general can be of any length):
```tolk
struct (0x01) WithPrefixLen8 { ... }
struct (0x00FF) WithPrefixLen16 { ... }
struct (0b1100) WithPrefixLen4 { ... }

struct WithUnion {
    // manual prefixes will be used, not 0/1
    e: WithPrefixLen8 | WithPrefixLen16;
    // also, no auto-generation
    f: WithPrefixLen8 | WithPrefixLen16 | WithPrefixLen4;
}
```

**If you specify prefixes manually, they will be used in (de)serialization**. 
Moreover: since a prefix exists for a struct, when deserializing a struct itself (not inside a union), a prefix is expected to be contained in binary data:
```tolk
// s should be "00FF..."
WithPrefixLen16.fromSlice(s)
// c will be "00FF..."
WithPrefixLen16{...}.toCell()
```

So, the rules are quite simple:
* if you specify prefixes manually, they will be used (no matter within a union or not)
* if you don't specify any prefixes, the compiler auto-generates a prefix tree
* if you specify prefix for A, but forgot prefix for B, `A | B` can't be serialized
* either (0/1) is just a prefix tree for two cases

**How can I specify a serialization prefix for non-struct?** Currently, there is no way to write something like `Prefixed<int32, 0b0011>`. 
But you can just create a struct with a single field:
```tolk
struct (0b0011) MyPrefixedInt {
    value: int32;
}
```
It will have no overhead against just `int32`, the same slot on a stack, just adding a prefix for (de)serialization.


## What if data exceeds 1023 bits

Struct fields are serialized one-by-one. So, if you have a large structure, its content may not fit into a cell. 
Tolk compiler calculates the maximum size of every serialized struct, and if it potentially exceeds 1023 bits, fires an error. Your choice is
1) either to suppress the error by placing an annotation above a struct; it means "okay, I understand"
2) or repack your data by splitting into multiple cells

Why do we say "potentially"? Because for many types, their size can vary:
* `int8?` is either one or nine bits
* `coins` is variadic: from 4 bits (small values) up to 124 bits
* `address` is internal (267 bits), or external (up to 521 bits), or none (2 bits); but since external addresses are very rare, estimation is "from 2 to 267 bits"

So, suppose you have:
```tolk
struct MoneyInfo {
    fixed: bits800;
    wallet1: coins;
    wallet2: coins;
}
```

When you try to (de)serialize it, the compiler calculates its size, and prints an error:
```
struct `MoneyInfo` can exceed 1023 bits in serialization (estimated size: 808..1048 bits)
... (and some instructions, what you should do)
```

Actually, you have two choices:

1) you definitely know, that `coins` fields will be relatively small, and this struct will 100% fit in reality; then, suppress the error using an annotation:
```tolk
@overflow1023_policy("suppress")
struct MoneyInfo {
    ...
}
```

2) or you really expect billions of billions in `coins`, so data really can exceed; in this case, you should extract some fields into a separate cell; for example, store 800 bits as a ref; or extract other 2 fields and ref them:
```tolk
// you can extract the first field
struct MoneyInfo {
    fixed: Cell<bits800>;
    wallet1: coins;
    wallet2: coins;
}

// or extract other 2 fields
struct WalletsBalances {
    wallet1: coins;
    wallet2: coins;
}
struct MoneyInfo {
    fixed: bits800;
    balances: Cell<WalletsBalances>;
}
```

Generally, you leave more frequently used fields directly and place less-frequent fields to another ref. 
All in all, the compiler indicates on potential cell overflow, and it's your choice how to overcome this.

Probably, in the future, there will be more policies (besides "suppress") — for example, to auto-repack fields. For now, it's absolutely straightforward.


## Write builder, read slice

Since Tolk remains low-level whenever you need, it allows doing tricky things. Suppose you manually create an address from bits:
```tolk
var addrB = beginCell()
           .storeUint(0b01)   // addr_extern
           ...;
```
And you want to use this `addrB` (it's `builder`! not `address`) to write into a storage:
```tolk
struct MyStorage {
    ...
    addr: address;
}

var st: MyStorage;
st.addr = addrB;   // error, can not assign `builder` to `address`
```
Of course, you can do `addrB.endCell().beginParse() as address`, but creating a cell is expensive. How can you write `addrB` directly?

The solution is: if you want `builder` for writing, and `address` for reading... Do exactly what you want!
```tolk
struct MyStorageData<T> {
    ...
    addr: T;
}

type MyStorage = MyStorageData<address>;
type MyStorageForWrite = MyStorageData<builder>;
```

The same technique can be combined with `RemainingBitsAndRefs` and some more cases. 
Moreover, for performance optimizations, you can create different "views" over the same data. Don't underestimate generics and the type system in general.


### Integration with message sending and receiving

Tolk v0.13 doesn't provide any helpers for composing and sending messages. It's the task for future releases.

So, for now, you can declare outgoing messages with structures, but you still manually create a message cell. 
Thanks to `builder.storeAny`, you can prepare message body and write it automatically:
```tolk
struct (0x...) SomeOutgoingMessage {
    ...
}

val outBody: SomeOutgoingMessage = { 
    ... 
};

// the same as you do now
val out = beginCell()
         .storeUint(0x18, 6)    // bounceable
         ...                    // all the header
         // but auto-serialize body (inline)
         .storeAny(outBody)
         // or — embed body as a ref
         .storeRef(outBody.toCell());

// same as before, but with auto-serialized body
sendRawMessage(out.endCell(), mode);
```


<Feedback />

