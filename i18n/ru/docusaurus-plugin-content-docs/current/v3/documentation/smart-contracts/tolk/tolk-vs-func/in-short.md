import Feedback from '@site/src/components/Feedback';

# Сравнение Tolk и FunC: коротко

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
3. Не `recv_internal` и `recv_external`, а `onInternalMessage` и `onExternalMessage`
4. `2+2` это 4, а не идентификатор; идентификаторы буквенно-цифровые; используйте обозначение `const OP_INCREASE` вместо `const op::increase`
5. Поддерживаются логические операторы AND `&&`, OR `||`, NOT `!`
6. Улучшения синтаксиса:
    - `;; comment` → `// comment`
    - `{- comment -}` → `/* comment */`
    - `#include` → `import`, со строгим правилом "импортируйте то, что используете"
    - `~ found` → `!found` (только для true/false, очевидно) (true равно -1, как в FunC)
    - `v = null()` → `v = null`
    - `null?(v)` → `v == null`, то же самое для `builder_null?` и других
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
7. Функцию можно вызывать, даже если она объявлена ​​ниже; предварительные объявления не нужны; компилятор сначала выполняет синтаксический анализ, а затем выполняет разрешение символов; теперь исходный код представлен в формате AST
8. Функции stdlib переименованы в ~~подробные~~ понятные названия в стиле camelCase; теперь они встроены, а не загружены с GitHub; они разделены на несколько файлов; общие функции доступны всегда, более конкретные доступны с помощью `import "@stdlib/tvm-dicts"`, IDE предложит вам; вот [сопоставление](/v3/documentation/smart-contracts/tolk/tolk-vs-func/stdlib)
9. No `~` tilda methods; `cs.loadInt(32)` modifies a slice and returns an integer; `b.storeInt(x, 32)` modifies a builder; `b = b.storeInt()` also works since it is not only modifies but returns; chained methods work identically to JS, they return `self`; everything works exactly as expected, similar to JS; no runtime overhead, exactly same Fift instructions; custom methods are created with ease; tilda `~` does not exist in Tolk at all; [more details here](/v3/documentation/smart-contracts/tolk/tolk-vs-func/mutability)
10. Понятные и читаемые сообщения об ошибках при несоответствии типов
11. Поддержка типа `bool`
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

- Существует плагин JetBrains
- Расширение VS Code [существует](https://github.com/ton-blockchain/tolk-vscode)
- Обертка WASM для blueprint [существует](https://github.com/ton-blockchain/tolk-js)
- И даже конвертер из FunC в Tolk [существует](https://github.com/ton-blockchain/convert-func-to-tolk)

## See also

- [Сравнение Tolk и FunC: в деталях](/v3/documentation/smart-contracts/tolk/tolk-vs-func/in-detail)

<Feedback />

