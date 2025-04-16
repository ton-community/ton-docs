# Сравнение Tolk и FunC: коротко

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Tolk гораздо больше похож на TypeScript и Kotlin, чем на C и Lisp.
Но он по-прежнему дает вам полный контроль над ассемблером TVM, поскольку внутри него есть ядро ​​FunC.

1. Функции объявляются через `fun`, get-методы через `get`, переменные через `var` (и `val` для неизменяемых), типы указываются справа; типы параметров являются обязательными; возвращаемый тип может быть опущен (автоматически выводится), а также для локальных переменных; спецификаторы `inline` и другие являются атрибутами `@`

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

2. Нет `impure`, это по умолчанию, компилятор не будет отбрасывать вызовы пользовательских функций
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
7. Функцию можно вызывать, даже если она объявлена ​​ниже; предварительные объявления не нужны; компилятор сначала выполняет синтаксический анализ, а затем выполняет разрешение символов; теперь исходный код представлен в формате AST
8. Функции stdlib переименованы в ~~подробные~~ понятные названия в стиле camelCase; теперь они встроены, а не загружены с GitHub; они разделены на несколько файлов; общие функции доступны всегда, более конкретные доступны с помощью `import "@stdlib/tvm-dicts"`, IDE предложит вам; вот [сопоставление](/v3/documentation/smart-contracts/tolk/tolk-vs-func/stdlib)
9. Нет методов тильды `~`; `cs.loadInt(32)` изменяет срез и возвращает целое число; `b.storeInt(x, 32)` изменяет конструктор; `b = b.storeInt()` также работает, так как он не только изменяет, но и возвращает; сцепленные методы работают идентично JS, они возвращают `self`; все работает точно так же, как и ожидалось, похоже на JS; нет накладных расходов во время выполнения, точно такие же инструкции Fift; пользовательские методы создаются легко; тильды `~` вообще нет в Tolk; [подробнее здесь](/v3/documentation/smart-contracts/tolk/tolk-vs-func/mutability)
10. Понятные и читаемые сообщения об ошибках при несоответствии типов
11. Поддержка типа `bool`

#### Инструментарий

- Существует плагин JetBrains
- Расширение VS Code [существует](https://github.com/ton-blockchain/tolk-vscode)
- Обертка WASM для blueprint [существует](https://github.com/ton-blockchain/tolk-js)
- И даже конвертер из FunC в Tolk [существует](https://github.com/ton-blockchain/convert-func-to-tolk)

#### Что делать дальше

[Сравнение Tolk и FunC: в деталях](/v3/documentation/smart-contracts/tolk/tolk-vs-func/in-detail)
