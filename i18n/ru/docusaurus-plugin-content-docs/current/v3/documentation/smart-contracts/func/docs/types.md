import Feedback from '@site/src/components/Feedback';

# Типы

:::info

Документация по FunC была изначально написана [@akifoq](https://github.com/akifoq).

:::

FunC имеет следующие встроенные типы.

## Атомарные типы

- `int` — тип 257-битных знаковых целых чисел. По умолчанию проверки переполнения включены и приводят к исключениям переполнения целых чисел.

- `cell` — тип ячеек TVM. Все постоянные данные в блокчейне TON хранятся в деревьях ячеек. Каждая ячейка имеет до 1023 бит произвольных данных и до четырех ссылок на другие ячейки. Ячейки служат памятью в стековых TVM.

- `slice` is a read-only view of a cell that allows sequential access to its data and references. A cell can be converted into a slice, extracting stored bits and references without modifying the original cell.

- `builder` — тип построителей ячеек. Биты данных и ссылки на другие ячейки могут храниться в конструкторе, а затем конструктор может быть завершен для новой ячейки.

- Кортеж - это упорядоченная коллекция, содержащая до 255 компонентов с произвольными типами значений, которые могут отличаться друг от друга.

- `cont` - тип продолжений TVM. Продолжения используются для управления ходом выполнения программы TVM. Although a low-level construct, it provides flexible execution control.

Обратите внимание, что любой из типов выше занимает только одну запись в стеке TVM.

### Отсутствие логического типа

FunC does not have a dedicated boolean type.
Instead, booleans are represented as integers:

- В FunC логические значения представлены как целые числа; `false` представлено как `0`, а `true` представлено как `-1` (257 единиц в двоичной записи).
- Логические операции выполняются как побитовые операции.
- При проверке условия каждое ненулевое целое число считается значением `true`.

### Нулевые значения

Значением `null` типа TVM `Null` FunC представляет отсутствие значения некоторого атомарного типа. While `null` is generally not allowed, some standard library functions handle it in specific ways:

- Некоторые примитивы из стандартной библиотеки могут быть типизированы как возвращающие атомарный тип и фактически возвращающие `null` в некоторых случаях. Другие могут быть типизированы как исключающие значение атомарного типа, но также прекрасно работать со значениями `null`.
- Others may expect an atomic type as input but can also accept `null` without errors.
- Такое поведение явно указано в спецификации примитива.
  По умолчанию значения `null` запрещены и приводят к исключению во время выполнения.

Additionally, an atomic type `A` can be implicitly transformed into `A^?` (also known as `Maybe A`),
allowing a variable of type `A` to store either a valid value or `null`.
This transformation happens automatically and is not enforced by the type checker.

## Составные типы

Функция поддерживает вывод типа. Типы `_` и `var` представляют собой "пробелы" в типах, которые позже могут быть заполнены каким-либо фактическим типом во время проверки типа. Например, `var x = 2;` - это определение переменной `x`, равной `2`. Средство проверки типов может сделать вывод, что `x` имеет тип `int`, потому что `2` имеет тип `int`, а левая и правая части присваивания должны иметь одинаковые типы.

FunC supports type inference. The hole types `_` and `var` serve as placeholders that are resolved during type checking.
For example, in the declaration:

```func
var x = 2;
```

The type checker determines that `x` is of type `int` since `2` is an `int`,
and both sides of the assignment must have matching types.

## Тензорные типы

Типы могут быть объединены в более сложные.

### Функциональный тип

Типы формы `A -> B` представляют функции с указанным доменом и кодовой областью.

- `A` is the input type, which is called domain.
- `B` is the output type, which is called codomain.

Например, `int -> cell` — это тип функции, которая принимает один целочисленный аргумент и возвращает ячейку TVM.

- Takes an integer as input.
- Returns a TVM cell as output.

Внутренне значения таких типов представлены как продолжения.

### Тип отверстия

Типы вида "(A, B, ...)" по сути представляют собой упорядоченные наборы значений типов "A", "B", "...", которые все вместе занимают более одной записи в стеке TVM.
These types occupy multiple TVM stack entries, unlike atomic types, which use a single entry.

**Example:**

Например, если функция `foo` имеет тип `int -> (int, int)`, это означает, что функция принимает одно целое число и возвращает пару из них.
Вызов этой функции может выглядеть как `(int a, int b) = foo(42);`.
Внутри функция потребляет одну запись стека и оставляет две из них.

Обратите внимание, что с точки зрения низкого уровня значение `(2, (3, 9))` типа `(int, (int, int))` и значение `(2, 3, 9)` типа `(int, int, int)` представлены так же, как три записи стека `2`, `3` и `9`. Для проверки типов FunC это значения **разных** типов.
For instance, the following code **will not compile**:

```func
Например, код `(int a, int b, int c) = (2, (3, 9));` не будет скомпилирован.
```

Since FunC strictly enforces type consistency, these structures cannot be mixed.

Частным случаем тензорного типа является тип **unit** `()`.

The unit type `()` is used to indicate that:

- A function does not return a value or
- A function takes no arguments

**Examples**

- `print_int` has the type `int -> ()`, meaning it takes an integer but returns nothing.
- Обычно он используется для обозначения того факта, что функция не возвращает никакого значения или не имеет аргументов. Например, функция `print_int` будет иметь тип `int -> ()`, а функция `random` - тип `() -> int`.
- The unit type `()` has a single value, also written as `()`, occupying **zero stack** entries.

Тип формы `(A)` рассматривается проверкой типов как тот же тип, что и `A`.

Таким образом, атомарный тип `A` может быть неявно преобразован в тип `A^?`, также известный как `Maybe A` (проверка типов не зависит от такого преобразования).

### Типы кортежей

Типы формы `[A, B, ...]` представляют кортежи TVM с определенными длинами и типами компонентов, известными во время компиляции.

For example, `[int, cell]` defines a tuple with exactly two elements:

- The first element is an integer.
- The second element is a cell.

The type `[]` represents an empty tuple with a unique value—the empty tuple itself.

`[]` — это тип пустых кортежей (у которых есть единственный обитатель - пустой кортеж). Обратите внимание, что в отличие от типа объекта `()`, значение `[]` занимает одну запись стека.

## Полиморфизм с переменной типа

FunC имеет систему типов Миллера-Рабина с поддержкой полиморфных функций.
Например, следующая функция:

```func
forall X -> (X, X) duplicate(X value) {
  return (value, value);
}
```

является полиморфной функцией, которая принимает значение (одну запись стека) и возвращает две копии этого значения. `duplicate(6)` создаст значения `6 6`, а `duplicate([])` создаст две копии `[] []` пустого кортежа.

This **polymorphic function** takes a single stack entry and returns two copies of the input value.

- Calling `duplicate(6)` produces `6 6`.
- Calling `duplicate([])` produces two copies of an empty tuple: `[] []`.

В этом примере `X` — это переменная типа.

Подробнее об этой теме смотрите в разделе [функции](/v3/documentation/smart-contracts/func/docs/functions#polymorphism-with-forall).

## Пользовательские типы

В настоящее время FunC не поддерживает определение типов, за исключением конструкций типов, описанных выше.

## Ширина типа

Как вы могли заметить, каждое значение типа занимает некоторое количество записей стека.
Если это одно и то же число для всех значений типа, это число называется **шириной типа**.
Полиморфные функции в настоящее время могут быть определены только для типов с фиксированной и заранее известной шириной типа.

<Feedback />

