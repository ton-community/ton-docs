import Feedback from '@site/src/components/Feedback';

# تولک در مقابل FunC: به اختصار

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
3. نه `recv_internal` و `recv_external`، بلکه `onInternalMessage` و `onExternalMessage`
4. `2+2` is 4, not an identifier; identifiers are alpha-numeric; use naming `const OP_INCREASE` instead of `const op::increase`; `cell` and `slice` are valid identifiers (not keywords)
5. عملگرهای منطقی AND `&&`، OR `||`، NOT `!` پشتیبانی می‌شوند
6. بهبودهای نحوی:
    - `;; comment` → `// comment`
    - `{- comment -}` → `/* comment */`
    - `#include` → `import`، با قانون سختگیرانه "وارد کنید چیزی را که استفاده می‌کنید"
    - `~ found` → `!found` (تنها برای true/false، البته) (در FunC 'true' همان -۱ است)
    - `v = null()` → `v = null`
    - `null?(v)` → `v == null`، مشابه برای `builder_null?` و دیگران
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
    - `"..."c` → `stringCrc32("...")` (and other postfixes also)
7. تابعی حتی می‌تواند فراخوانی شود اگر در پایین تعریف شده باشد؛ اعلام‌های پیشین لازم نیستند؛ کامپایلر ابتدا تجزیه و سپس تعیین نمادها را انجام می‌دهد؛ اکنون نمایندگی AST از کد منبع وجود دارد
8. توابع stdlib به نام‌های ~~verbose~~ واضح، به سبک camelCase تغییر نام داده‌اند؛ اکنون توابع جاسازی شده‌اند و از GitHub دانلود نمی‌شوند؛ به چندین فایل تقسیم شده‌اند؛ توابع عمومی همیشه در دسترس هستند، توابع خاص‌تر با `import "@stdlib/tvm-dicts"` در دسترس هستند، IDE به شما پیشنهاد می‌دهد؛ در اینجا یک [نقشه‌برداری](/v3/documentation/smart-contracts/tolk/tolk-vs-func/stdlib) وجود دارد
9. No `~` tilda methods; `cs.loadInt(32)` modifies a slice and returns an integer; `b.storeInt(x, 32)` modifies a builder; `b = b.storeInt()` also works since it is not only modifies but returns; chained methods work identically to JS, they return `self`; everything works exactly as expected, similar to JS; no runtime overhead, exactly same Fift instructions; custom methods are created with ease; tilda `~` does not exist in Tolk at all; [more details here](/v3/documentation/smart-contracts/tolk/tolk-vs-func/mutability)
10. Clear and readable error messages on type mismatch
11. `bool` type support
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

#### ابزارها در اطراف

- پلاگین JetBrains موجود است
- افزونه VS Code [موجود است](https://github.com/ton-blockchain/tolk-vscode)
- بسته WASM برای بلوپرینت [موجود است](https://github.com/ton-blockchain/tolk-js)
- و حتی یک مبدل از FunC به Tolk [موجود است](https://github.com/ton-blockchain/convert-func-to-tolk)

## See also

- [تولک در برابر FunC: با جزئیات](/v3/documentation/smart-contracts/tolk/tolk-vs-func/in-detail)

<Feedback />

