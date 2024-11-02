---
title: "Tolk vs FunC: mutability"
---

# Mutability in Tolk vs tilda functions in FunC

:::tip TLDR
- no `~` tilda methods
- `cs.loadInt(32)` modifies a slice and returns an integer
- `b.storeInt(x, 32)` modifies a builder
- `b = b.storeInt()` also works, since it not only modifies, but returns
- chained methods work identically to JS, they return `self`
- everything works exactly as expected, similar to JS
- no runtime overhead, exactly same Fift instructions
- custom methods are created with ease
- tilda `~` does not exist in Tolk at all
:::

This is a drastic change. If FunC has `.methods()` and `~methods()`, Tolk has only dot, one and only way to call a `.method()`. A method may *mutate* an object, or may not. Unlike the list "in short", it's a behavioral and semantic difference from FunC.

The goal is to have calls identical to JS and other languages:

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'int flags = cs~load_uint(32);'}</code></td>
    <td><code>{'var flags = cs.loadUint(32);'}</code></td>
  </tr>
  <tr>
    <td><code>{'(cs, int flags) = cs.load_uint(32);'}</code></td>
    <td><code>{'var flags = cs.loadUint(32);'}</code></td>
  </tr>
  <tr>
    <td><code>{'(slice cs2, int flags) = cs.load_uint(32);'}</code></td>
    <td><code dangerouslySetInnerHTML={{__html: 'var cs2 = cs;<br>var flags = cs2.loadUint(32);'}}></code></td>
  </tr>
  <tr>
    <td><code dangerouslySetInnerHTML={{__html: 'slice data = get_data()<br>             .begin_parse();<br>int flag = data~load_uint(32);'}}></code></td>
    <td><code dangerouslySetInnerHTML={{__html: 'val flag = getContractData()<br>           .beginParse()<br>           .loadUint(32);'}}></code></td>
  </tr>
  <tr>
    <td><code>{'dict~udict_set(...);'}</code></td>
    <td><code>{'dict.uDictSet(...);'}</code></td>
  </tr>
  <tr>
    <td><code>{'b~store_uint(x, 32);'}</code></td>
    <td><code>{'b.storeInt(x, 32);'}</code></td>
  </tr>
  <tr>
    <td><code>{'b = b.store_int(x, 32);'}</code></td>
    <td><code dangerouslySetInnerHTML={{__html: 'b.storeInt(x, 32);<br><br>// also works<br>b = b.storeUint(32);'}}></code></td>
  </tr>
  <tr>
    <td><code dangerouslySetInnerHTML={{__html: 'b = b.store_int(x, 32)<br>     .store_int(y, 32);'}}></code></td>
    <td><code dangerouslySetInnerHTML={{__html: 'b.storeInt(x, 32)<br> .storeInt(y, 32);<br><br>// b = ...; also works'}}></code></td>
  </tr>
  </tbody>
</table>

In order to make this available, Tolk offers a mutability conception, which is a generalization of what a tilda means in FunC.

<h3 className="cmp-func-tolk-header">
  By default, all arguments are copied by value (identical to FunC)
</h3>

```tolk
fun someFn(x: int) {
    x += 1;
}

var origX = 0;
someFn(origX);  // origX remains 0
someFn(10);     // ok, just int
origX.someFn(); // still allowed (but not recommended), origX remains 0
```

Same goes for cells, slices, whatever:
```tolk
fun readFlags(cs: slice) {
    return cs.loadInt(32);
}

var flags = readFlags(msgBody);  // msgBody is not modified
// msgBody.loadInt(32) will read the same flags
```

It means, that when you call a function, you are sure that original data is not modified.

<h3 className="cmp-func-tolk-header">
  `mutate` keyword and mutating functions
</h3>

But if you add `mutate` keyword to a parameter, a passed argument will be mutated. To avoid unexpected mutations, you must specify `mutate` when calling it, also:
```tolk
fun increment(mutate x: int) {
    x += 1;
}

// it's correct, simple and straightforward
var origX = 0;
increment(mutate origX);  // origX becomes 1

// these are compiler errors
increment(origX);         // error, unexpected mutation
increment(10);            // error, not lvalue
origX.increment();        // error, not a method, unexpected mutation
val constX = getSome();
increment(mutate constX); // error, it's immutable, since `val`
```

Same for slices and any other types:
```tolk
fun readFlags(mutate cs: slice) {
    return cs.loadInt(32);
}

val flags = readFlags(mutate msgBody);
// msgBody.loadInt(32) will read the next integer
```

It's a generalization. A function may have several mutate parameters:
```tolk
fun incrementXY(mutate x: int, mutate y: int, byValue: int) {
    x += byValue;
    y += byValue;
}

incrementXY(mutate origX, mutate origY, 10);   // both += 10
```

*You may ask — is it just passing by reference? It effectively is, but since "ref" is an overloaded term in TON (cells and slices have refs), a keyword `mutate` was chosen.*

<h3 className="cmp-func-tolk-header">
  `self` parameter turning a function into a method
</h3>

When a first parameter is named `self`, it emphasizes that a function (still a global one) is a method and should be called via dot.
```tolk
fun assertNotEq(self: int, throwIfEq: int) {
    if (self == throwIfEq) {
        throw 100;
    }
}

someN.assertNotEq(10);
10.assertNotEq(10);      // also ok, since self is not mutating
assertNotEq(someN, 10);  // still allowed (but not recommended)
```

`self`, without `mutate`, is **immutable** (unlike all other parameters). Think of it like "read-only method".
```tolk
fun readFlags(self: slice) {
    return self.loadInt(32);  // error, modifying immutable variable
}

fun preloadInt32(self: slice) {
    return self.preloadInt(32);  // ok, it's a read-only method
}
```

Combining `mutate` and `self`, we get mutating methods.

<h3 className="cmp-func-tolk-header">
  `mutate self` is a method, called via dot, mutating an object
</h3>

As follows:
```tolk
fun readFlags(mutate self: slice) {
    return self.loadInt(32);
}

val flags = msgBody.readFlags(); // pretty obvious

fun increment(mutate self: int) {
    self += 1;
}

var origX = 10;
origX.increment();    // 11
10.increment();       // error, not lvalue

// even this is possible
fun incrementWithY(mutate self: int, mutate y: int, byValue: int) {
    self += byValue;
    y += byValue;
}

origX.incrementWithY(mutate origY, 10);   // both += 10
```

If you take a look into stdlib, you'll notice, that lots of functions are actually `mutate self`, meaning they are methods, modifying an object. Tuples, dictionaries, and so on. In FunC, they were usually called via tilda.
```tolk
@pure
fun tuplePush<X>(mutate self: tuple, value: X): void
    asm "TPUSH";

t.tuplePush(1);
```

<h3 className="cmp-func-tolk-header">
  `return self` makes a method chainable
</h3>

Exactly like `return self` in Python or `return this` in JavaScript. That's what makes methods like `storeInt()` and others chainable.
```tolk
fun storeInt32(mutate self: builder, x: int): self {
    self.storeInt(x, 32);
    return self;

    // this would also work as expected (the same Fift code)
    // return self.storeInt(x, 32);
}

var b = beginCell().storeInt(1, 32).storeInt32(2).storeInt(3, 32);
b.storeInt32(4);     // works without assignment, since mutates b
b = b.storeInt32(5); // and works with assignment, since also returns
```

Pay attention to the return type, it's `self`. Currently, you should specify it. Being left empty, compilation will fail. Probably, in the future it would be correct.

<h3 className="cmp-func-tolk-header">
  `mutate self` and asm functions
</h3>

While it's obvious for user-defined functions, one could be interested, how to make an `asm` function with such behavior? To answer this question, we should look under the hood, how mutation works inside the compiler.

When a function has `mutate` parameters, it actually implicitly returns them, and they are implicitly assigned to arguments. It's better by example:
```tolk
// actually returns (int, void)
fun increment(mutate x: int): void { ... }

// actually does: (x', _) = increment(x); x = x'
increment(mutate x);

// actually returns (int, int, (slice, cell))
fun f2(mutate x: int, mutate y: int): (slice, cell) { ... }

// actually does: (x', y', r) = f2(x, y); x = x'; y = y'; someF(r)
someF(f2(mutate x, mutate y));

// when `self`, it's exactly the same
// actually does: (cs', r) = loadInt(cs, 32); cs = cs'; flags = r
flags = cs.loadInt(32);
```

So, an `asm` function should place `self'` onto a stack before its return value:
```tolk
// "TPUSH" pops (tuple) and pushes (tuple')
// so, self' = tuple', and return an empty tensor
// `void` is a synonym for an empty tensor
fun tuplePush<X>(mutate self: tuple, value: X): void
    asm "TPUSH";

// "LDU" pops (slice) and pushes (int, slice')
// with asm(-> 1 0), we make it (slice', int)
// so, self' = slice', and return int
fun loadMessageFlags(mutate self: slice): int
    asm(-> 1 0) "4 LDU";
```

Note, that to return self, you don't have to do anything special, just specify a return type. Compiler will do the rest.
```tolk
// "STU" pops (int, builder) and pushes (builder')
// with asm(op self), we put arguments to correct order
// so, self' = builder', and return an empty tensor
// but to make it chainable, `self` instead of `void`
fun storeMessageOp(mutate self: builder, op: int): self
    asm(op self) "32 STU";
```

It's very unlikely you'll have to do such tricks. Most likely, you'll just write wrappers around existing functions:
```tolk
// just do like this, without asm, it's the same effective

@inline
fun myLoadMessageFlags(mutate self: slice): int {
    return self.loadUint(4);
}

@inline
fun myStoreMessageOp(mutate self: builder, flags: int): self {
    return self.storeUint(32, flags);
}
```

<h3 className="cmp-func-tolk-header">
  Do I need `@inline` for simple functions/methods?
</h3>

For now, better do it, yes. In most examples above, `@inline` was omitted for clarity. Currently, without `@inline`, it will be a separate TVM continuation with jumps in/out. With `@inline`, a function will be generated, but inlined by Fift (like `inline` specifer in FunC).

In the future, Tolk will automatically detect simple functions and perform a true inlining by itself, on AST level. Such functions won't be even codegenerated to Fift. The compiler would decide, better than a human, whether to inline, to make a ref, etc. But it will take some time for Tolk to become so smart :) For now, please specify the `@inline` attribute.

<h3 className="cmp-func-tolk-header">
  But `self` is not a method, it's still a function! I feel like I've been cheated
</h3>

Absolutely. Like FunC, Tolk has only global functions (as of v0.6). There are no classes / structures with methods. There are no methods `hash()` for `slice` and `hash()` for `cell`. Instead, there are functions `sliceHash()` and `cellHash()`, which can be called either like functions or by dot (preferred):
```tolk
fun f(s: slice, c: cell) {
    // not like this
    s.hash();
    c.hash();
    // but like this
    s.sliceHash();
    c.cellHash();
    // since it's the same as
    sliceHash(s);
    cellHash(s);
}
```

In the future, after a giant work on the type system, having fully refactored FunC kernel inside, Tolk might have an ability of declaring structures with real methods, generalized enough for covering built-in types. But it will take a long journey to follow.

