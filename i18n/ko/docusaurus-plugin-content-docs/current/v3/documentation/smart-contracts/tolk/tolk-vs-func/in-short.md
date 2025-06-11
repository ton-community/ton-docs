import Feedback from '@site/src/components/Feedback';

# Tolk vs FunC: 요약

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
3. `recv_internal`과 `recv_external` 대신 `onInternalMessage`와 `onExternalMessage` 사용
4. `2+2` is 4, not an identifier; identifiers are alpha-numeric; use naming `const OP_INCREASE` instead of `const op::increase`; `cell` and `slice` are valid identifiers (not keywords)
5. 논리 연산자 AND `&&`, OR `||`, NOT `!` 지원
6. 구문 개선:
    - `;; comment` → `// comment`
    - `{- comment -}` → `/* comment */`
    - `#include` → `import`, "사용하는 것을 임포트하세요" 엄격 규칙과 함께
    - `~ found` → `!found` (true/false만 해당) (true는 FunC처럼 -1)
    - `v = null()` → `v = null`
    - `null?(v)` → `v == null`, `builder_null?` 등도 동일
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
7. 함수는 아래에 선언되어 있어도 호출 가능; 전방 선언 불필요; 컴파일러는 먼저 구문 분석 후 심볼 해결; 소스 코드의 AST 표현 존재
8. stdlib 함수들이 ~~장황한~~ 명확한 이름과 camelCase 스타일로 변경; 이제 GitHub에서 다운로드하지 않고 내장됨; 여러 파일로 분할; 일반 함수는 항상 사용 가능, 더 특수한 함수는 `import "@stdlib/tvm-dicts"`로 사용 가능, IDE가 제안; [매핑 보기](/v3/documentation/smart-contracts/tolk/tolk-vs-func/stdlib)
9. No `~` tilda methods; `cs.loadInt(32)` modifies a slice and returns an integer; `b.storeInt(x, 32)` modifies a builder; `b = b.storeInt()` also works since it is not only modifies but returns; chained methods work identically to JS, they return `self`; everything works exactly as expected, similar to JS; no runtime overhead, exactly same Fift instructions; custom methods are created with ease; tilda `~` does not exist in Tolk at all; [more details here](/v3/documentation/smart-contracts/tolk/tolk-vs-func/mutability)
10. 타입 불일치 시 명확하고 읽기 쉬운 오류 메시지
11. `bool` 타입 지원
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

- JetBrains 플러그인 존재
- VS Code 확장 [존재](https://github.com/ton-blockchain/tolk-vscode)
- blueprint용 WASM 래퍼 [존재](https://github.com/ton-blockchain/tolk-js)
- FunC에서 Tolk로의 변환기도 [존재](https://github.com/ton-blockchain/convert-func-to-tolk)

## See also

- [Tolk vs FunC: 상세](/v3/documentation/smart-contracts/tolk/tolk-vs-func/in-detail)

<Feedback />

