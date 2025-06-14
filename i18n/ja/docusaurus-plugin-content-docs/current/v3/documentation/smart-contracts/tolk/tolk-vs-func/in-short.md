import Feedback from '@site/src/components/Feedback';

# Tolk vs FunC: 短いと

Tolk is much more similar to TypeScript and Kotlin than C and Lisp.
But it still gives you complete control over the TVM assembler since it has a FunC kernel inside.

1. Functions are declared via `fun`, get methods via `get`, variables via `var`, immutable variables via `val`, putting types on the right; parameter types are mandatory; return type can be omitted (auto inferred), as well as for locals; specifiers `inline` and others are `@` attributes

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

2. No `impure`, it's by default, the Tolk compiler won't drop user function calls
3. `recv_internal` と `recv_external` ではなく、 `onInternalMessage` と `onExternalMessage`
4. `2+2` is 4, not an identifier; identifiers are alpha-numeric; use naming `const OP_INCREASE` instead of `const op::increase`; `cell` and `slice` are valid identifiers (not keywords)
5. 論理演算子と `&&`, または `||`, NOT `!`がサポートされています
6. 構文の改善:
    - `;; コメント` → `// コメント`
    - `{- comment -}` → `/* コメント */`
    - `#include` → `import`、厳格なルール「使用するものをインポート」を使用しています。
    - `~ found` → `!found` (true/false のみ、明らかに) (true は -1、Func のように)
    - `v = null()` → `v = null`
    - `null?(v)` → `v == null`、`builder_null?` などと同じ
    - `~ null?(v)` → `c != null`
    - `throw(excNo)` → `excNoを投げる`
    - `catch(_, _)` → `catch`
    - `catch(_, excNo)` → `catch(excNo)`
    - `throw_unless(excNo, cond)` → `assert(cond, excNo)`
    - `throw_if(excNo, cond)` → `assert(!cond, excNo)`
    - `return ()` → `return`
    - `do ... until (cond)` → `do ... while (!cond)`
    - `elseif` → `else if`
    - `ifnot (cond)` → `if (!cond)`
    - `"..."c` → `stringCrc32("...")` (and other postfixes also)
7. 関数は、以下の宣言をした場合でも呼び出すことができます。前方宣言は必要ありません。 コンパイラは最初に構文解析を行い、次にシンボル解消を行います。現在、ソースコードの AST 表現があります。
8. stdlib 関数は ~~verbose~~ に改名されました。明確な名前、camelCase スタイルです。現在は埋め込まれており、GitHub からダウンロードされていません。いくつかのファイルに分割されています。 一般的な関数は、常に \\`import "@stdlib/tvm-dicts" でより具体的に利用できるようになります。IDEは、[マッピング](/v3/documentation/smart-contracts/tolk/tolk-vs-func/stdlib) を示唆します。
9. No `~` tilda methods; `cs.loadInt(32)` modifies a slice and returns an integer; `b.storeInt(x, 32)` modifies a builder; `b = b.storeInt()` also works since it is not only modifies but returns; chained methods work identically to JS, they return `self`; everything works exactly as expected, similar to JS; no runtime overhead, exactly same Fift instructions; custom methods are created with ease; tilda `~` does not exist in Tolk at all; [more details here](/v3/documentation/smart-contracts/tolk/tolk-vs-func/mutability)
10. 型の不一致に関する明確で読みやすいエラー メッセージ
11. `bool` 型のサポート
12. Indexed access `tensorVar.0` and `tupleVar.0` support
13. Nullable types `T?`, null safety, smart casts, operator `!`
14. Union types and pattern matching (for types and for expressions, switch-like behavior)
15. Type aliases are supported
16. Structures are supported
17. Generics are supported
18. Methods (as extension functions) are supported
19. Trailing comma is supported
20. Semicolon after the last statement in a block is optional
21. Fift output contains original .tolk lines as comments
22. [Auto-packing](/v3/documentation/smart-contracts/tolk/tolk-vs-func/pack-to-from-cells) to/from cells — for any types

#### Tooling around

- JetBrainsプラグインが存在します
- VS Code extension [exists](https://github.com/ton-blockchain/tolk-vscode)
- ブループリント用の WASM ラッパー [存在しています](https://github.com/ton-blockchain/tolk-js)
- そして、FunC から Tolk へのコンバータさえも [存在しています](https://github.com/ton-blockchain/convert-func-to-tolk)

## See also

- [Tolk vs FunC: 詳細(/v3/documentation/smart-contracts/tolk/tolk-vs-func/in-detail)

<Feedback />

