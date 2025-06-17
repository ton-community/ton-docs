import Feedback from '@site/src/components/Feedback';

# Statements

В этом разделе кратко рассматриваются операторы FunC, составляющие код обычных тел функций.

## Операторы выражений

Наиболее распространенным типом оператора является оператор выражения. Это выражение, за которым следует `;`. Как правило, все вложенные выражения вычисляются слева направо, за исключением [перестановки стека asm](/v3/documentation/smart-contracts/func/docs/functions#rearranging-stack-entries), которая может определять порядок вручную.

### Объявление переменной

Local variables must be initialized at the time of declaration. Here are some examples:

```func
int x = 2;
var x = 2;
(int, int) p = (1, 2);
(int, var) p = (1, 2);
(int, int, int) (x, y, z) = (1, 2, 3);
(int x, int y, int z) = (1, 2, 3);
var (x, y, z) = (1, 2, 3);
(int x = 1, int y = 2, int z = 3);
[int, int, int] [x, y, z] = [1, 2, 3];
[int x, int y, int z] = [1, 2, 3];
var [x, y, z] = [1, 2, 3];
```

Во вложенных областях переменная может быть действительно объявлена заново, как и в языке С. Для примера, вот правильный код:

```func
int x = 2;
int y = x + 1;
int x = 3;
```

На самом деле, второе появление `int x` - это не объявление, а просто проверка во время компиляции того, что `x` имеет тип `int`. Таким образом, третья строка, по сути, эквивалентна простому присваиванию `x = 3;`.

**Variable redeclaration in nested scopes**

In nested scopes, a new variable with the same name can be declared, just like in C:

```func
int x = 0;
int i = 0;
while (i < 10) {
  (int, int) x = (i, i + 1);
  ;; here x is a variable of type (int, int)
  i += 1;
}
;; here x is a (different) variable of type int
```

Но как упоминалось в [разделе глобальных переменных](/v3/documentation/smart-contracts/func/docs/global_variables), глобальная переменная не может быть переопределена.

Обратите внимание, что объявление переменной — **это** оператор выражения, поэтому на самом деле конструкции вроде `int x = 2` являются полноценными выражениями.
Для примера, вот правильный код:

#### Подчеркивание

Подчеркивание `_` используется, когда значение не требуется.
For example, if `foo` is a function of type `int -> (int, int, int)`,
you can retrieve only the first return value while ignoring the rest:

```func
(int fst, _, _) = foo(42);
```

### Применение функции

Вызов функции выглядит так в общепринятом языке. Аргументы вызова функции перечислены после имени функции и разделены запятыми.

```func
;; suppose foo has type (int, int, int) -> int
int x = foo(1, 2, 3);
```

However, unlike many conventional languages, FunC treats functions as taking a single argument.
In the example above, `foo` is a function that takes one tuple argument of type `(int, int, int)`.

**Function composition**

Но обратите внимание, что `foo` на самом деле является функцией одного аргумента типа `(int, int, int)`. Чтобы увидеть разницу, предположим, что `bar` — это функция типа `int -> (int, int, int)`. Since `foo` expects a single tuple argument, you can pass the entire result of `bar(42)` directly into `foo`:

```func
int x = foo(bar(42));
```

вместо похожей, но более длинной формы:

```func
(int a, int b, int c) = bar(42);
int x = foo(a, b, c);
```

Также возможны вызовы в стиле Haskell, но не всегда (будут исправлены позже):

FunC also supports **Haskell-style** function application, but with some limitations:

```func
;; suppose foo has type int -> int -> int -> int
;; i.e. it's carried
(int a, int b, int c) = (1, 2, 3);
int x = foo a b c; ;; ok
;; int y = foo 1 2 3; wouldn't compile
int y = foo (1) (2) (3); ;; ok
```

However, direct application with literals does not compile:

```func
int x = cs~load_uint(8);
```

Instead, parentheses are required:

```func
int y = (int x = 3) + 1;
```

### Лямбда-выражения

Лямбда-выражения пока не поддерживаются.

### Вызовы методов

#### Немодифицирующие методы

In FunC, a function with at least one argument can be called a non-modifying method using the dot `.` syntax.

For example, the function `store_uint` has the type `(builder, int, int)  → builder`, where:

- The first argument is a builder object.
- The second argument is the value to store.
- The third argument is the bit length.

`begin_cell` — это функция, которая создает новый builder.
These two ways of calling `store_uint` are equivalent:

```func
builder b = begin_cell();
b = store_uint(b, 239, 8);
```

```func
builder b = begin_cell();
b = b.store_uint(239, 8);
```

Таким образом, первый аргумент функции может быть передан ей, будучи расположенным перед именем функции, если они разделены `.`. Код можно еще больше упростить:

```func
builder b = begin_cell().store_uint(239, 8);
```

Multiple non-modifying methods can be chained together:

```func
builder b = begin_cell().store_uint(239, 8)
                        .store_int(-1, 16)
                        .store_uint(0xff, 10);
```

#### Модифицирующие методы

Если первый аргумент функции имеет тип `A`, а возвращаемое значение функции имеет форму `(A, B)`, где `B` — некоторый произвольный тип, то функцию можно вызвать как модифицирующий метод.

Модифицирующие вызовы методов могут принимать некоторые аргументы и возвращать некоторые значения, но они изменяют свой первый аргумент, то есть присваивают первый компонент возвращаемого значения переменной из первого аргумента. These methods may take additional arguments and return extra values, but their primary purpose is to update the first argument.

Например, предположим, что `cs` — это срез ячейки, а `load_uint` имеет тип `(slice, int) -> (slice, int)`: он принимает срез ячейки и количество бит для загрузки и возвращает остаток среза и загруженное значение.

This function takes a cell slice and a number of bits to load, returning the remaining slice and the loaded value. The following three calls are equivalent:

```func
(cs, int x) = load_uint(cs, 8);
```

В некоторых случаях мы хотим использовать функцию как модифицирующий метод, который не возвращает никакого значения, а только изменяет первый аргумент.
This can be achieved using unit types.

Например, предположим, что функция `foo` имеет тип `int -> (int, int, int)`. Тогда мы должны определить `inc` как функцию типа `int -> (int, ())`:

```func
(int, ()) inc(int x) {
  return (x + 1, ());
}
```

Следующее будет увеличивать `x`.

```func
x~inc();
```

#### `.` и `~` в именах функций

Предположим, мы хотим использовать `inc` также как немодифицирующий метод. Мы можем написать что-то вроде этого:

```func
(int y, _) = inc(x);
```

Но можно переопределить определение `inc` как модифицирующего метода.

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

- Подводя итог, можно сказать, что когда функция с именем `foo` вызывается как немодифицирующий или модифицирующий метод (т. е. с синтаксисом `.foo` или `~foo`), компилятор FunC использует определение `.foo` или `~foo` соответственно, если такое определение представлено, а если нет, то он использует определение `foo`.
- (cs, int x) = cs.load_uint(8);
- If neither `.foo` nor `~foo` is defined, the compiler falls back to the regular `foo` definition.

### Операторы

Обратите внимание, что в настоящее время все унарные и бинарные операторы являются целочисленными операторами. Логические операторы представлены как побитовые целочисленные операторы [(ср. отсутствие булевого типа)](/v3/documentation/smart-contracts/func/docs/types#absence-of-boolean-type)).

#### Унарные операторы

Существует два унарных оператора:

- `~` - побитовое Не (приоритет 75)
- `-` - целочисленное отрицание (приоритет 20)

Их следует отделять от аргумента:

- `- x` - допустимо.
- `-x` не подходит (это одиночный идентификатор)

#### Бинарные операторы

С приоритетом 30 (левоассоциативный):

- `*` - целочисленное умножение
- `/` - целочисленное деление (floor)
- `~/` - целочисленное деление (round)
- `^/` - целочисленное деление (ceil)
- `%` - это уменьшение целого числа по модулю (floor)
- `~%` - уменьшение целого числа по модулю (round)
- `^%` - это уменьшение целого числа по модулю (ceil)
- `/%` возвращает частное и остаток
- `&` - побитовое И

С приоритетом 20 (левоассоциативный):

- `+` - целочисленное сложение
- `-` - целочисленное вычитание
- `|` is bitwise OR
- `^` is bitwise XOR

С приоритетом 17 (левоассоциативный):

- `<<` - побитовый сдвиг влево
- `>>` - побитовый сдвиг вправо
- `~>>` - побитовый сдвиг вправо (round)
- `^>>` - побитовый сдвиг вправо (ceil)

С приоритетом 15 (левоассоциативный):

- `==` проверка равенства целых чисел
- `!=` проверка неравенства целых чисел
- `<` сравнение целых чисел
- `<=` сравнение целых чисел
- `>` сравнение целых чисел
- `>=` сравнение целых чисел
- `<=>` сравнение целых чисел (возвращает -1, 0 или 1)

Их также следует отделить от аргумента:

- `x + y` -  Proper spacing between operands.
- `x+y` недопустимо (это один идентификатор)

#### Условный оператор

FunC supports the standard conditional (ternary) operator with the following syntax:

```func
<condition> ? <consequence> : <alternative>
```

Например:

```func
x > 0 ? x * fac(x - 1) : 1;
```

Имеет приоритет 13.

#### Присваивания

Приоритет 10.

Простое присваивание `=` и аналоги бинарных операций: `+=`, `-=`, `*=`, `/=`, `~/=`, `^/=`, `%=`, `~%=`, `^%=`, `<<=`, `>>=`, `~>>=`, `^>>=`, `&=`, `|=`, `^=`.

## Циклы

FunC поддерживает циклы `repeat`, `while` и `do { ... } until`. Цикл `for` не поддерживается.

### Цикл повтора

Синтаксис представляет собой ключевое слово `repeat`, за которым следует выражение типа `int`. Повторяет код указанное количество раз.

**Examples:**

```func
int x = 1;
repeat(10) {
  x *= 2;
}
;; x = 1024
```

```func
int x = 1, y = 10;
repeat(y + 6) {
  x *= 2;
}
;; x = 65536
```

If the repetition count is negative, the loop does not execute:

```func
int x = 1;
repeat(-1) {
  x *= 2;
}
;; x = 1
```

Если количество раз меньше, `-2^31` или больше, `2^31 - 1`, выдается исключение проверки диапазона.

### Цикл с условием

The `while` loop follows standard syntax:

```func
int x = 2;
while (x < 100) {
  x = x * x;
}
;; x = 256
```

Обратите внимание, что истинностное значение условия `x < 100` имеет тип `int` (ср. [ср. отсутствие типа boolean](/v3/documentation/smart-contracts/func/docs/types#absence-of-boolean-type)).

### Цикл до

The `do { ... } until` loop has the following syntax:

```func
int x = 0;
do {
  x += 3;
} until (x % 17 == 0);
;; x = 51
```

## If statements

**Examples**

Standard `if` statement:

```func
;; usual if
if (flag) {
  do_something();
}
```

`^` - побитовое исключение ИЛИ

```func
;; equivalent to if (~ flag)
ifnot (flag) {
  do_something();
}
```

`If-else` statement:

```func
;; usual if-else
if (flag) {
  do_something();
}
else {
  do_alternative();
}
```

```func
;; Some specific features
if (flag1) {
  do_something1();
} else {
  do_alternative4();
}
```

Фигурные скобки необходимы. Такой код не будет скомпилирован:

```func
if (flag1)
  do_something();
```

## Try-catch statements

_Доступно в func с v0.4.0_.

Выполняет код в блоке `try`.
If an error occurs, all changes made within the `try` block are completely rolled back, and the `catch` block is executed instead. The `catch` block receives two arguments:

- `x`: the exception parameter, which can be of any type
- `n`: the error code, an integer

Unlike many other languages, in FunC, all changes are **undone** if an error occurs inside the `try` block. These modifications include updates to local and global variables and changes to storage registers (`c4` for storage, `c5`for action/messages, `c7` for context, etc.).
Any contract storage updates and outgoing messages are also reverted.

However, certain TVM state parameters are not rolled back, such as:

- Codepage settings
- Это означает, в частности, что весь газ, потраченный в блоке try, будет учтен, а эффекты OP, которые изменяют лимит газа (`accept_message` и `set_gas_limit`), будут сохранены.

**Exception parameter handling**

Обратите внимание, что параметр исключения может быть любого типа (возможно, разного в случае разных исключений), и поэтому funC не может предсказать его во время компиляции. Это означает, что разработчику нужно "помочь" компилятору, приведя параметр исключения к некоторому типу (см. пример 2 ниже):

**Examples**

Basic `try-catch` usage:

```func
try {
  do_something();
} catch (x, n) {
  handle_exception();
}
```

Casting the exception parameter:

```func
forall X -> int cast_to_int(X x) asm "NOP";
...
try {
  throw_arg(-1, 100);
} catch (x, n) {
  x.cast_to_int();
  ;; x = -1, n = 100
  return x + 1;
}
```

Variable reset on exception:

```func
int x = 0;
try {
  x += 1;
  throw(100);
} catch (_, _) {
}
;; x = 0 (not 1)
```

In this last example, although `x` is incremented inside the `try` block, the modification is **rolled back** due to the exception, so `x` remains `0`.

## Block statements

Операторы блока также разрешены. Они открывают новую вложенную область:

```func
int x = 1;
builder b = begin_cell();
{
  builder x = begin_cell().store_uint(0, 8);
  b = x;
}
x += 1;
```

In this example, the inner block introduces a new `builder` variable named `x`, which exists only within that scope.
The outer `x` remains unchanged and can be used after the block ends.

<Feedback />

