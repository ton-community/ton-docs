import Feedback from '@site/src/components/Feedback';

# Встроенные функции

В этом разделе описываются некоторые конструкции языка, которые менее фундаментальны, чем те, что описаны в предыдущих статьях.
Их можно было бы определить в [stdlib.fc](/v3/documentation/smart-contracts/func/docs/stdlib), но это оставило бы меньше места для оптимизатора FunC.

## Выброс исключений

FunC provides several built-in primitives for throwing exceptions:

- **Conditional exceptions:** `throw_if` and `throw_unless`
- **Unconditional exception:** `throw`

Исключения могут быть выброшены с помощью условных примитивов `throw_if`, `throw_unless` и безусловного `throw`. Первый аргумент — это код ошибки; второй — это условие (`throw` имеет только один аргумент).
Meanwhile, the `throw` function takes only one argument—the error code—since it always triggers an exception.

FunC also includes parameterized versions of these primitives:

- **Conditional exceptions with parameters:** `throw_arg_if` and `throw_arg_unless`
- **Unconditional exception with a parameter:** `throw_arg`

Первый аргумент — это параметр исключения любого типа; второй — это код ошибки; третий — это условие (`throw_arg` имеет только два аргумента).

## Booleans

- `true` является псевдонимом для `-1`
- `false` является псевдонимом для `0`

## Dumping a variable

Переменная может быть выгружена в журнал отладки с помощью функции `~dump`.

## Dumping a string

Строка может быть выгружена в журнал отладки с помощью функции `~strdump`.

## Операции с целыми числами

- `muldiv` — это операция умножения, а затем деления.
  Промежуточный результат сохраняется в 513-битном целом числе, поэтому он не будет переполне, если фактический результат поместится в 257-битное целое число.
- `divmod` - это операция, которая принимает два числа в качестве параметров и возвращает частное и остаток от их деления.

## Другие примитивы

- `null?` проверяет, является ли аргумент `null`. По значению `null` типа TVM, `Null` FunC представляет отсутствие значения некоторого атомарного типа; смотрите [значения null](/v3/documentation/smart-contracts/func/docs/types#null-values). See [null values](/v3/documentation/smart-contracts/func/docs/types#null-values) for details.
- `touch` и `~touch` перемещают переменную на вершину стека
- `at` получает значение компонента кортежа в указанной позиции
  <Feedback />

