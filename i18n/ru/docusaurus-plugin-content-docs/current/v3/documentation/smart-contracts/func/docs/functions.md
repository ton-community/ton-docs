import Feedback from '@site/src/components/Feedback';

# Функции

Программа FunC по сути является списком объявлений/определений функций и объявлений глобальных переменных. В этом разделе рассматривается первая тема.

Любое объявление или определение функции начинается с общего шаблона, а затем следует одно из трех:

- одиночный `;`, что означает, что функция объявлена, но еще не определена. Она может быть определена позже в том же файле или в каком-либо другом файле, который передается компилятору FunC перед текущим. Например,
  ```func
  int add(int x, int y);
  ```
  это простое объявление функции с именем `add` типа `(int, int) -> int`.

- определение тела функции ассемблера. Это способ определения функций с помощью примитивов TVM низкого уровня для последующего использования в программе FunC. Например,
  ```func
  int add(int x, int y) asm "ADD";
  ```
  это ассемблерное определение той же функции `add` типа `(int, int) -> int`, которое будет транслироваться в код операции TVM `ADD`.

- Объявление неиспользуемого аргумента: только тип. Например,
  ```func
  int add(int x, int y) {
    return x + y;
  }
  ```
  это обычное определение функции `add`.

## Объявление функции

Как уже было сказано, любое объявление или определение функции начинается с общего шаблона. Ниже приведен:

```func
[<forall declarator>] <return_type> <function_name>(<comma_separated_function_args>) <specifiers>
```

где `[ ... ]` соответствует необязательной записи.

### Имя функции

Имя функции может быть любым [идентификатором](/v3/documentation/smart-contracts/func/docs/literals_identifiers#identifiers), а также может начинаться с символов `.` или `~`. Значение этих символов [объясняется](/v3/documentation/smart-contracts/func/docs/statements#methods-calls) в разделе операторов.

Например, `udict_add_builder?`, `dict_set` и `~dict_set` являются допустимыми и разными именами функций. (Они определены в [stdlib.fc](/v3/documentation/smart-contracts/func/docs/stdlib).)

#### Специальные имена функций

FunC (фактически ассемблер Fift) имеет несколько зарезервированных имен функций с предопределенными [идентификаторами](/v3/documentation/smart-contracts/func/docs/functions#method_id).

- `main` и `recv_internal` имеют id = 0
- `recv_external` имеет id = -1
- `run_ticktock` имеет id = -2

Каждая программа должна иметь функцию с id 0, то есть функцию `main` или `recv_internal`. `run_ticktock` вызывается в транзакциях ticktock специальных смарт-контрактов.

#### Внутренние получения

`recv_internal` вызывается, когда смарт-контракт получает входящее внутреннее сообщение. При запуске [TVM](/v3/documentation/tvm/tvm-overview#initialization-of-tvm) в стеке есть несколько переменных, задавая аргументы в `recv_internal`, мы даем коду смарт-контракта информацию о некоторых из них. By specifying arguments in `recv_internal`, the smart contract can access some of these values. Any values not explicitly referenced in the function parameters will remain unused at the bottom of the stack.

The following `recv_internal` function declarations are all valid. Functions with fewer parameters consume slightly less gas, as each unused argument results in an additional `DROP` instruction:

```func

() recv_internal(int balance, int msg_value, cell in_msg_cell, slice in_msg) {}
() recv_internal(int msg_value, cell in_msg_cell, slice in_msg) {}
() recv_internal(cell in_msg_cell, slice in_msg) {}
() recv_internal(slice in_msg) {}
```

#### Внешние получения

`recv_external` предназначено для входящих внешних сообщений.

### Тип возврата

Тип возврата может быть любым атомарным или составным типом, как описано в разделе [типы](/v3/documentation/smart-contracts/func/docs/types). Например,

```func
int foo();
(int, int) foo'();
[int, int] foo''();
(int -> int) foo'''();
() foo''''();
```

Вывод типа также допускается. Например,

```func
_ pyth(int m, int n) {
  return (m * m - n * n, 2 * m * n, m * m + n * n);
}
```

это допустимое определение функции типа `int -> int`.
It computes Pythagorean triples based on the given input values.

### Аргументы функции

Аргументы функции разделяются запятыми. Допустимые объявления аргумента следующие:

- Обычное объявление: тип + имя. Например, `int x` — это объявление аргумента типа `int` и имени `x` в объявлении функции `() foo(int x);`

- Аргумент с выведенным объявлением типа: только имя. Например,
  ```func
  int first(int x, int) {
    return x;
  }
  ```
  это допустимое определение функции типа `(int, int) -> int`

- Argument with inferred type declaration: If an argument's type is not explicitly declared, it is inferred by the type-checker.
  For example,
  ```func
  int inc(x) {
    return x + 1;
  }
  ```
  является допустимым определением функции `pyth` типа `(int, int) -> (int, int, int)`, которая вычисляет пифагоровы тройки.

**Argument tensor representation**

Обратите внимание, что хотя функция может выглядеть как функция нескольких аргументов, на самом деле это функция одного аргумента [тензорного типа](/v3/documentation/smart-contracts/func/docs/types#tensor-types). Чтобы увидеть разницу, обратитесь к [применению функции](/v3/documentation/smart-contracts/func/docs/statements#function-application).
Тем не менее, компоненты тензора аргумента традиционно называются аргументами функции.

### Вызовы функций

#### Немодифицирующие методы

:::info
Немодифицирующая функция поддерживает короткую форму вызова функции с `.`
:::

```func
example(a);
a.example();
```

Если у функции есть хотя бы один аргумент, ее можно вызвать как немодифицирующий метод. Например, `store_uint` имеет тип `(builder, int, int) -> builder` (второй аргумент — это значение для сохранения, а третий — длина в битах).

- The second argument is the value to store.
- The third argument is the bit length.

`begin_cell` — это функция, которая создает новый builder. Следующие коды эквивалентны:

```func
builder b = begin_cell();
b = store_uint(b, 239, 8);
```

```func
builder b = begin_cell();
b = b.store_uint(239, 8);
```

Таким образом, первый аргумент функции может быть передан ей, будучи расположенным перед именем функции, если он разделен `.`. Код можно упростить еще больше:

The function's first argument is passed before the function name, separated by `.`. The syntax can be further condensed into a single statement:

```func
builder b = begin_cell().store_uint(239, 8);
```

Также возможны множественные вызовы методов:

```func
builder b = begin_cell().store_uint(239, 8)
                        .store_int(-1, 16)
                        .store_uint(0xff, 10);
```

#### Модифицирующие функции

:::info
Модифицирующая функция поддерживает краткую форму с операторами `~` и `.`.
:::

If:

- Модифицирующие вызовы функций могут принимать некоторые аргументы и возвращать некоторые значения, но они изменяют свой первый аргумент, то есть присваивают первый компонент возвращаемого значения переменной из первого аргумента.
- Если первый аргумент функции имеет тип `A`, а возвращаемое значение функции имеет вид `(A, B)`, где `B` — некоторый произвольный тип, то функцию можно вызвать как модифицирующий метод.

Then, the function can be called a modifying method.

Modifying functions change their first argument. They assign the first component of the returned value to the variable initially passed as the first argument.
The following calls are equivalent:

```func
a~example();
a = example(a);
```

**Example:** `load_uint`

Например, предположим, что `cs` — это срез ячейки, а `load_uint` имеет тип `(slice, int) -> (slice, int)`: он принимает срез ячейки и количество бит для загрузки и возвращает остаток среза и загруженное значение. It means:

- `load_uint` takes a cell slice and several bits to load.
- It returns the remaining slice and the loaded value.

The following calls are equivalent:

```func
(cs, int x) = load_uint(cs, 8);
```

```func
(cs, int x) = cs.load_uint(8);
```

```func
int x = cs~load_uint(8);
```

**Modifying methods with no return value**

В некоторых случаях мы хотим использовать функцию в качестве модифицирующего метода, который не возвращает никакого значения и изменяет только первый аргумент. To enable modifying method syntax, such functions should return a unit type () as the second component.

Это можно сделать, используя типы единиц измерения, следующим образом: предположим, мы хотим определить функцию `inc` типа `int -> int`, которая увеличивает целое число, и использовать ее в качестве метода модификации. При таком определении его можно использовать как модифицирующий метод.

```func
(int, ()) inc(int x) {
  return (x + 1, ());
}
```

Now, the function can be used in modifying method syntax:

```func
x~inc();
```

This will increment `x` in place.

#### `.` и `~` в именах функций

Предположим, мы хотим использовать `inc` как немодифицирующий метод. Мы можем написать что-то вроде этого:

```func
(int y, _) = inc(x);
```

Однако можно переопределить определение `inc`, используя модифицирующий метод.

```func
int inc(int x) {
  return x + 1;
}
(int, ()) ~inc(int x) {
  return (x + 1, ());
}
```

Now, we can call it in different ways:

```func
x~inc();
int y = inc(x);
int z = x.inc();
```

**How FunC resolves function calls**

- Если `impure` не указан и результат вызова функции не используется, то компилятор FunC может и удалить этот вызов функции.
- Подводя итог, когда функция с именем `foo` вызывается как немодифицирующий или модифицирующий метод (т. е. с синтаксисом `.foo` или `~foo`), компилятор FunC использует определение `.foo` или `~foo` соответственно, если такое определение представлено, а если нет, то использует определение `foo`.
- Итак, каждое из следующих объявлений `recv_internal` является правильным, но те, у которых меньше переменных, будут тратить немного меньше газа (каждый неиспользованный аргумент добавляет дополнительные инструкции `DROP`)

### Спецификаторы

In FunC, function specifiers modify the behavior of functions. There are three types:

1. `impure`
2. `inline`/ `inline_ref`
3. `method_id`

One, multiple, or none can be used in a function declaration. However, they must appear in a specific order (e.g., `impure` must come before `inline`).

#### Impure specifier

Спецификатор `impure` означает, что функция может иметь некоторые побочные эффекты, которые нельзя игнорировать. Например, мы должны указать спецификатор `impure`, если функция может изменять хранилище контракта, отправлять сообщения или выдавать исключение, когда некоторые данные недействительны, и функция предназначена для проверки этих данных.
If a function is not marked as `impure` and its result is unused, the FunC compiler may delete the function call for optimization.

Например, в функции [stdlib.fc](/v3/documentation/smart-contracts/func/docs/stdlib)

```func
int random() impure asm "RANDU256";
```

`impure` используется, потому что `RANDU256` изменяет внутреннее состояние генератора случайных чисел. The `impure` keyword prevents the compiler from removing this function call.

#### Встроенный спецификатор

Если функция имеет спецификатор `inline`, ее код фактически подставляется в каждом месте, где вызывается функция.
Само собой разумеется, что рекурсивные вызовы встроенных функций невозможны.

**Example**

```func
(int) add(int a, int b) inline {
    return a + b;
}
```

поскольку функция `add` отмечена спецификатором `inline`. Компилятор попытается заменить вызовы `add` фактическим кодом `a + b`, избегая накладных расходов на вызов функции.

Вот еще один пример того, как можно использовать встроенный спецификатор, взятый из [ICO-Minter.fc](https://github.com/ton-blockchain/token-contract/blob/f2253cb0f0e1ae0974d7dc0cef3a62cb6e19f806/ft/jetton-minter-ICO.fc#L16):

```func
() save_data(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) impure inline {
  set_data(begin_cell()
            .store_coins(total_supply)
            .store_slice(admin_address)
            .store_ref(content)
            .store_ref(jetton_wallet_code)
           .end_cell()
          );
}
```

#### Спецификатор Inline_ref

Код функции со спецификатором `inline_ref` помещается в отдельную ячейку, и каждый раз, когда вызывается функция, TVM выполняет команду `CALLREF`. Each time the function is called, TVM executes a `CALLREF` command. Таким образом, это похоже на `inline`, но поскольку ячейку можно повторно использовать в нескольких местах, не дублируя ее, почти всегда более эффективно с точки зрения размера кода использовать спецификатор `inline_ref` вместо `inline`, если только функция не вызывается ровно один раз. The only case where `inline` might be preferable is if the function is called just once. Рекурсивные вызовы встроенных функций по-прежнему невозможны, поскольку в ячейках TVM нет циклических ссылок.

#### method_id

Каждая функция в программе TVM имеет внутренний целочисленный идентификатор, по которому она может быть вызвана.
Обычные функции нумеруются последующими целыми числами, начиная с 1, но get методы контракта нумеруются хэшами crc16 их имен.
спецификатор `method_id(<some_number>)` позволяет присвоить идентификатору функции указанное значение, а `method_id` использует значение по умолчанию `(crc16(<function_name>) & 0xffff) | 0x10000`.
If no ID is specified, the default is calculated as `(crc16(<function_name>) & 0xffff) | 0x10000`.
Если функция имеет спецификатор `method_id`, то она может быть вызвана в lite-client или ton-explorer как get-метод по своему имени.

:::warning Important limitations and recommendations
**19-bit limitation**: Method IDs are limited to 19 bits by the TVM assembler, meaning the valid range is **0 to 524,287** (2^19 - 1).

**Reserved ranges**:

- **0-999**: Reserved for system functions (approximate range)
- **Special functions**: `main`/`recv_internal` (id=0), `recv_external` (id=-1), `run_ticktock` (id=-2)
- **65536+**: Default range for user functions when using automatic generation `(crc16() & 0xffff) | 0x10000`

**Best practice**: It's recommended to **avoid setting method IDs manually** and rely on automatic generation instead. Manual assignment can lead to conflicts and unexpected behavior.
:::

<details><summary><b>Technical details about method_id parsing</b></summary>

While the FunC compiler can initially accept larger hex values during parsing, the actual limitation comes from the TVM assembler which restricts method IDs to 19 bits (`@procdictkeylen = 19` in Asm.fif).

The parsing of the hexadecimal string for `method_id` is handled by functions in `crypto/common/bigint.hpp` (specifically `AnyIntView::parse_hex_any` called via `td::string_to_int256` and `BigInt<257>::parse_hex`).

`AnyIntView::parse_hex_any` first performs a basic check on the length of the hex string:

```cpp
if ((j - i - (p > 0)) * 4 > (max_size() - 1) * word_shift + word_bits - 2) {
  return 0; // Invalid if too long
}
```

For `BigInt<257>` (which is `td::BigIntG<257, td::BigIntInfo>`):

- `Tr` is `BigIntInfo`.
- `word_bits` (bits in a word) is 64.
- `word_shift` (effective bits used per word in normalization) is 52. (Source: `crypto/common/bigint.hpp`)
- `max_size()` (maximum words for `BigInt<257>`) is `(257 + 52 - 1) / 52 + 1 = 6` words.

Let's plug these values into the length check formula:
`(max_size() - 1) * word_shift + word_bits - 2`
`(6 - 1) * 52 + 64 - 2 = 5 * 52 + 62 = 260 + 62 = 322` bits.

A 65-character hex string represents \( 65 times 4 = 260 \) bits.
The calculated bit limit for the quick check is 322 bits. Since `260` is not greater than `322`, such a number (65 hex digits) can _pass_ this initial length check. This check is designed to quickly reject inputs that are grossly too large. The `-2` offers a slight margin.

After this initial parsing into internal `digits_`, `parse_hex_any` calls `normalize_bool_any()`. This function converts the internal representation into a canonical signed form.
If `normalize_bool_any()` returns `false`, it indicates an overflow during this canonicalization. This can happen even if the number passed the initial length check, for example, if a carry propagates such that it requires more than `max_size()` words to represent in the specific signed format, or if the most significant word itself overflows. In such a case, `parse_hex_any` invalidates the `BigInt` and returns `0`, leading to `td::string_to_int256` returning a `null RefInt256` and FunC reporting an "invalid integer constant".

</details>

**Example**

```func
int get_counter() method_id {
  load_data();
  return ctx_counter;
}
```

### Полиморфизм с forall

Перед объявлением или определением любой функции может быть указатель переменных типа `forall`. Он имеет следующий синтаксис:

A function definition can include a `forall` type variable declaration before its declaration or implementation. The syntax is:

```func
forall <comma_separated_type_variables_names> ->
```

где имя переменной типа может быть любым [идентификатором](/v3/documentation/smart-contracts/func/docs/literals_identifiers#identifiers).

Например,

```func
forall X, Y -> [Y, X] pair_swap([X, Y] pair) {
  [X p1, Y p2] = pair;
  return [p2, p1];
}
```

This function takes a tuple of exactly two elements, where each component can be of any type that fits in a single stack entry. It swaps the two values. For instance:

- Первый вызов изменит x; второй и третий — нет.
- `pair_swap([2, 3])` вернет `[3, 2]`, а `pair_swap([1, [2, 3, 4]])` вернет `[[2, 3, 4], 1]`.

В этом примере `X` и `Y` являются [переменными типа](/v3/documentation/smart-contracts/func/docs/types#polymorphism-with-type-variables). При вызове функции переменные типа заменяются фактическими типами, и выполняется код функции. Обратите внимание, что хотя функция является полиморфной, фактический код ассемблера для нее одинаков для каждой подстановки типа. Это достигается по сути полиморфизмом примитивов манипуляции стеком. В настоящее время другие формы полиморфизма (например, ad-hoc полиморфизм с классами типов) не поддерживаются.

Также стоит отметить, что ширина типа `X` и `Y` должна быть равна 1; то есть значения `X` или `Y` должны занимать одну запись в стеке. Так что вы на самом деле не можете вызвать функцию `pair_swap` для кортежа типа `[(int, int), int]`, потому что тип `(int, int)` имеет ширину 2, то есть занимает 2 записи в стеке.

## Определение тела функции ассемблера

Как упоминалось выше, функция может быть определена кодом ассемблера. Синтаксис представляет собой ключевое слово `asm`, за которым следует одна или несколько команд ассемблера, представленных в виде строк.
Например, можно определить:

```func
int inc_then_negate(int x) asm "INC" "NEGATE";
```

– функция, которая увеличивает целое число, а затем инвертирует его. Вызовы этой функции будут транслироваться в 2 команды ассемблера `INC` и `NEGATE`. Альтернативный способ определения функции:

When called, this function is directly translated into the two assembler commands, `INC` and `NEGATE`.
Alternatively, the function can be written as:

```func
int inc_then_negate'(int x) asm "INC NEGATE";
```

`INC NEGATE` будет рассматриваться FunC как одна команда ассемблера, но это нормально, поскольку ассемблер Fift знает, что это 2 отдельные команды.

:::info
Список команд ассемблера можно найти здесь: [инструкции TVM](/v3/documentation/tvm/instructions).
:::

### Rearranging stack entries

Sometimes, the order in which function arguments are passed may not match the expected order of an assembler command. Similarly, the returned values may need to be arranged differently. Мы могли бы вручную переставить стек, добавив соответствующие примитивы стека, но FunC может сделать это автоматически.

:::info
Обратите внимание, что в случае ручной перестановки аргументы будут вычисляться в переставленном порядке. Чтобы переопределить это поведение, используйте `#pragma compute-asm-ltr`: [compute-asm-ltr](/v3/documentation/smart-contracts/func/docs/compiler_directives#pragma-compute-asm-ltr)
:::

Например, предположим, что команда на ассемблере STUXQ принимает целое число, builder и integer; затем она возвращает значение builder вместе с флагом integer, указывающим на успех или неудачу операции. It then returns the builder and an integer flag indicating whether the operation succeeded. Мы можем определить функцию:

```func
(builder, int) store_uint_quite(int x, builder b, int len) asm "STUXQ";
```

Однако предположим, что мы хотим изменить порядок аргументов. Тогда мы можем определить:

```func
(builder, int) store_uint_quite(builder b, int x, int len) asm(x b len) "STUXQ";
```

Таким образом, вы можете указать требуемый порядок аргументов после ключевого слова `asm`.

This allows us to control the order in which arguments are passed to the assembler command.

Кроме того, мы можем изменить возвращаемые значения следующим образом:

```func
(int, builder) store_uint_quite(int x, builder b, int len) asm( -> 1 0) "STUXQ";
```

Числа соответствуют индексам возвращаемых значений (0 — самая глубокая запись стека среди возвращаемых значений).

Также возможно объединение этих методов.

```func
(int, builder) store_uint_quite(builder b, int x, int len) asm(x b len -> 1 0) "STUXQ";
```

### Многострочные asm

Многострочные команды ассемблера или даже фрагменты Fift-кода можно определить с помощью многострочных строк, которые начинаются и заканчиваются `"""`.

```func
slice hello_world() asm """
  "Hello"
  " "
  "World"
  $+ $+ $>s
  PUSHSLICE
""";
```

<Feedback />

