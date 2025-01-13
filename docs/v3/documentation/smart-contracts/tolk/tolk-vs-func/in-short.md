# Tolk vs FunC: in short

Tolk is much more similar to TypeScript and Kotlin than to C and Lisp. 
But it still gives you full control over TVM assembler, since it has a FunC kernel inside.

1. Functions are declared via `fun`, get methods via `get`, variables via `var` (and `val` for immutable), putting types on the right; parameter types are mandatory; return type can be omitted (auto inferred), as well as for locals; specifiers `inline` and others are `@` attributes
```tolk
global storedV: int;

fun parseData(cs: slice): cell {
    var flags: int = cs.loadMessageFlags();
    ...
}

@inline
fun sum(a: int, b: int) {   // auto inferred int
    val both = a + b;       // same
    return both;
}

get currentCounter(): int { ... }
```
2. No `impure`, it's by default, compiler won't drop user function calls
3. Not `recv_internal` and `recv_external`, but `onInternalMessage` and `onExternalMessage`
4. `2+2` is 4, not an identifier; identifiers are alpha-numeric; use naming `const OP_INCREASE` instead of `const op::increase`
5. Logical operators AND `&&`, OR `||`, NOT `!` are supported
6. Syntax improvements:
    - `;; comment` → `// comment`
    - `{- comment -}` → `/* comment */`
    - `#include` → `import`, with a strict rule "import what you use"
    - `~ found` → `!found` (for true/false only, obviously) (true is -1, like in FunC)
    - `v = null()` → `v = null`
    - `null?(v)` → `v == null`, same for `builder_null?` and others
    - `~ null?(v)` → `c != null`
    - `throw(excNo)` → `throw excNo`
    - `catch(_, _)` → `catch`
    - `catch(_, excNo)` → `catch(excNo)`
    - `throw_unless(excNo, cond)` → `assert(cond, excNo)`
    - `throw_if(excNo, cond)` → `assert(!cond, excNo)`
    - `return ()` → `return`
    - `do ... until (cond)` → `do ... while (!cond)`
    - `elseif` → `else if`
    - `ifnot (cond)` → `if (!cond)`
7. A function can be called even if declared below; forward declarations not needed; the compiler at first does parsing, and then it does symbol resolving; there is now an AST representation of source code
8. stdlib functions renamed to ~~verbose~~ clear names, camelCase style; it's now embedded, not downloaded from GitHub; it's split into several files; common functions available always, more specific available with `import "@stdlib/tvm-dicts"`, IDE will suggest you; here is [a mapping](/v3/documentation/smart-contracts/tolk/tolk-vs-func/stdlib)
9. No `~` tilda methods; `cs.loadInt(32)` modifies a slice and returns an integer; `b.storeInt(x, 32)` modifies a builder; `b = b.storeInt()` also works, since it not only modifies, but returns; chained methods work identically to JS, they return `self`; everything works exactly as expected, similar to JS; no runtime overhead, exactly same Fift instructions; custom methods are created with ease; tilda `~` does not exist in Tolk at all; [more details here](/v3/documentation/smart-contracts/tolk/tolk-vs-func/mutability)
10. Clear and readable error messages on type mismatch
11. `bool` type support

#### Tooling around
- JetBrains plugin exists
- VS Code extension [exists](https://github.com/ton-blockchain/tolk-vscode)
- WASM wrapper for blueprint [exists](https://github.com/ton-blockchain/tolk-js)
- And even a converter from FunC to Tolk [exists](https://github.com/ton-blockchain/convert-func-to-tolk)

#### Where to go next

[Tolk vs FunC: in detail](/v3/documentation/smart-contracts/tolk/tolk-vs-func/in-detail)
