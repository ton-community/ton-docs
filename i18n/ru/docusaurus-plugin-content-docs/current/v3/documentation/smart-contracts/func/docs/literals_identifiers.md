import Feedback from '@site/src/components/Feedback';

# Литералы и идентификаторы

## Числовые литералы

FunC допускает десятичные и шестнадцатеричные целочисленные литералы (разрешены начальные нули).

Например, `0`, `123`, `-17`, `00987`, `0xef`, `0xEF`, `0x0`, `-0xfFAb`, `0x0001`, `-0`, `-0x0` являются допустимыми числовыми литералами.

## String literals

Строки в FunC заключаются в двойные кавычки `"` как `"эта строка"`.
Специальные символы, такие как `\n`, и многострочные строки не поддерживаются.
По желанию, строковые литералы могут указывать тип после себя, например, `"string "u`.

```
;; somewhere inside of a function body

var a = """
   hash me baby one more time
"""h;
var b = a + 42;

b; ;; 623173419
```

Поддерживаются следующие типы строк:

- без типа — используется для определений функций asm и для определения константы среза по строке ASCII
- `s` — определяет необработанную константу среза по ее содержимому (в шестнадцатеричной кодировке и, при необходимости, дополненную битами)
- `a` — создает константу среза, содержащую структуру `MsgAddressInt` из указанного адреса
- `u` — создает константу int, которая соответствует шестнадцатеричным значениям предоставленной строки ASCII
- `h` — создает константу int, которая является первыми 32 битами хэша SHA256 строки
- `H` — создает константу int, которая является все 256 бит хэша SHA256 строки
- `c` — создает константу int, которая является значением crc32 строки

**Examples**
The following string literals produce these corresponding constants:

- `"string"` становится `x{737472696e67}` срез const
- `"abcdef"s` становится `x{abcdef}` срез const
- `"Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF"a` становится `x{9FE66666666666666666666666666666666666666666666666666666666666667_}` срез const (`addr_std$10 anycast:none$0 workchain_id:int8=0xFF address:bits256=0x33...33`)
- `"NstK"u` становится `0x4e73744b` int const
- `"transfer(slice, int)"h` становится `0x7a62e8a8` int const
- `"transfer(slice, int)"H` становится `0x7a62e8a8ebac41bd6de16c65e7be363bc2d2cbc6a0873778dead4795c13db979` int const
- `"transfer(slice, int)"c` становится `2235694568` int const

## Идентификаторы

FunC допускает действительно широкий класс идентификаторов (имена функций и переменных).
А именно, любая (однострочная) строка, которая не содержит специальные символы `;`, `,`, `(`, `)`, ` ` (пробел или табуляция), `~` и `.`, не начинается как комментарий или строковый литерал (с `"`), не является числовым литералом, не является подчеркиванием `_` и не является ключевым словом, является допустимым идентификатором (за исключением того, что если она начинается с `` ` ``, она должна заканчиваться тем же `` ` `` и не может содержать никаких других `` ` ``, кроме этих двух).

- It **does not** contain special symbols: `;`, `,`, `(`, `)`, `[`, `]`, spaces including tabs, `~`, and `.`.
- It **does not** start as a comment or a string literal (i.e., with `"` at the beginning).
- It is **not** a number literal.
- It is **not** an underscore `_`.
- It is **not** a reserved keyword. Exception: if it starts with a backtick `` ` ``, it must also end with a backtick and cannot contain any additional backticks inside.
- It is **not** a name of a [builtin](https://github.com/ton-blockchain/ton/blob/5c392e0f2d946877bb79a09ed35068f7b0bd333a/crypto/func/builtins.cpp#L1133).

Кроме того, имена функций в определениях функций могут начинаться с `.` или `~`.

Например, это допустимые идентификаторы:

- `query`, `query'`, `query''`
- `elem0`, `elem1`, `elem2`
- `CHECK`
- `_internal_value`
- `message_found?`
- `get_pubkeys&signatures`
- `dict::udict_set_builder`
- `_+_` (стандартный оператор сложения типа `(int, int) -> int` в префиксной нотации, хотя он уже определен)
- `fatal!`

**Naming conventions:**

- `'` в конце имени переменной обычно используется, когда вводится некоторая измененная версия старого значения.

  - Например, почти все модифицирующие встроенные примитивы для манипуляции хэш-картой (кроме тех, что с префиксом `~`) берут хэш-карту и возвращают новую версию хэш-карты вместе с некоторыми другими данными, если это необходимо.
    The updated version is typically named with the same identifier, adding a `'` suffix.

- **Question mark (?) at the end:** typically used for boolean variables or functions that return a success flag.
  - Example: `udict_get?` from [stdlib.fc](/v3/documentation/smart-contracts/func/docs/stdlib), which checks if a value exists.

**Invalid identifiers:**

- `take(first)Entry`
- \\\`"not_a_string
- `msg.sender`
- `send_message,then_terminate`
- `_` - just an underscore, which is not valid on its own

**Less common but valid identifiers:**

- `123validname`
- `2+2=2*2`
- `-alsovalidname`
- `0xefefefhahaha`
- `{hehehe}`
- `pa{--}in`aaa\`\`.

**More invalid identifiers:**

- `pa;;in`aaa`` (потому что `;`` запрещено)
- `{-aaa-}` - contains `{}` incorrectly
- `aa(bb` - contains an opening parenthesis without closing it
- `123` (это число)

**Special identifiers in backticks:**

Кроме того, в FunC есть специальный тип идентификаторов, который заключается в обратные кавычки `` ` ``. В кавычках допустимы любые символы, кроме `\n` и самих кавычек.

- `{-aaa-}`
- Backticks `` ` `` themselves except the opening and closing ones.

**Examples of valid backtick-quoted identifiers:**

- `I'm a variable too`
- `any symbols ; ~ () are allowed here...`

## Константы

FunC позволяет определять константы времени компиляции, которые подставляются и предварительно вычисляются во время компиляции.

**Syntax:**

```func
Константы определяются как `const Optional-Type Id = value-or-expression;`
```

- `optional-type` можно использовать для принудительного указания определенного типа константы и для лучшей читаемости.
- `value-or-expression` может быть литералом или предварительно вычисляемым выражением литералов и констант.

**Example usage:**

```func
`const int int240 = ((int1 + int2) * 10) << 3;` определяет константу `int240`, которая равна результату вычисления
```

Поскольку числовые константы подставляются во время компиляции, все оптимизации и предварительные вычисления, выполняемые во время компиляции, успешно выполняются (в отличие от старого метода определения констант с помощью встроенного asm `PUSHINT`s).

<Feedback />
