import Feedback from '@site/src/components/Feedback';

# Глубокое погружение в Fift

Высокоуровневый стековый язык Fift используется для локальной манипуляции ячейками и другими примитивами TVM, в основном для преобразования ассемблерного кода TVM в код контракта bag-of-cells. Its primary purpose is to compile TVM assembly code into contract code as a bag-of-cells (BoC).

:::caution
В этом разделе описывается взаимодействие с специфичными для TON функциями на **очень** низком уровне. Before proceeding, ensure you have:

- Solid experience with stack-based programming paradigms
- Understanding of virtual machine architectures
- Familiarity with low-level data structures
  :::

## Простая арифметика

Вы можете использовать интерпретатор Fift как калькулятор, записывая выражения в [обратной польской нотации](https://en.wikipedia.org/wiki/Reverse_Polish_notation).

```
6 17 17 * * 289 + .
2023 ok
```

This example calculates:

1. `17 * 17 = 289`
2. `6 * 289 = 1734`
3. `1734 + 289 = 2023`

## Стандартный выход

```
27 emit ."[30;1mgrey text" 27 emit ."[37m"
grey text ok
```

- `emit` берет число с вершины стека и выводит символ Unicode с указанным кодом в stdout.
- `."..."` выводит строку-константу.

## Определение функций (Fift-слов)

To define a word, follow these steps:

1. **Enclose the word's effects** in curly braces `{}`.
2. **Add a colon `:`** after the closing brace.
3. **Specify the word's name** after the colon.

First line defines a word `increment` that increases `x` by `1`.

**Examples:**

```
{ minmax drop } : min
{ minmax nip } : max
```

> Fift.fif

Хотя есть несколько "определяющих слов", а не только ":". Они отличаются в смысле слов, определяемых некоторыми из них, **активные** (работают внутри фигурных скобок), а некоторые **префиксные** (не требуют пробела после них):

- **Active words** – Operate inside curly braces `{}`.
- **Prefix words** – Do not require a trailing space .

```
{ bl word 1 2 ' (create) } "::" 1 (create)
{ bl word 0 2 ' (create) } :: :
{ bl word 2 2 ' (create) } :: :_
{ bl word 3 2 ' (create) } :: ::_
{ bl word 0 (create) } : create
```

> Fift.fif

## Условное выполнение

Execute code blocks conditionally using `cond`:

```
{ { ."true " } { ."false " } cond } : ?.   4 5 = ?.  4 5 < ?.
false true  ok
{ ."hello " } execute ."world"
hello world ok
```

## Циклы

Use loop primitives for repetitive operations:

```
// ( l c -- l')  deletes first c elements from list l
{ ' safe-cdr swap times } : list-delete-first
```

> GetOpt.fif

Слово цикла `times` принимает два аргумента — назовем их `cont` и `n` — и выполняет `cont` `n` раз.
Здесь `list-delete-first` берет продолжение `safe-cdr` (команда удаления заголовка из списка в стиле Lisp), помещает его под `c`, а затем `c` times удаляет заголовок из списка, присутствующего в стеке.
`while`/`until` provide conditional looping.

## Комментарии

Комментарии определены в `Fift.fif`.

1. **Single-line comments**: Start with `//` and continue to the end of the line
2. Однострочный комментарий начинается с `//` и продолжается до конца строки; многострочный комментарий начинается с `/*` и заканчивается `*/`.

```
{ 0 word drop 0 'nop } :: //
{ char " word 1 { swap { abort } if drop } } ::_ abort"
{ { bl word dup "" $= abort"comment extends after end of file" "*/" $= } until 0 'nop } :: /*
```

> Fift.fif

#### `drop`: верхний элемент (данные комментария) удаляется из стека.

Программа Fift по сути является последовательностью слов, каждое из которых каким-либо образом преобразует стек или определяет новые слова. Комментарии должны работать даже при определении новых слов, поэтому они должны работать во вложенной среде. Вот почему они определены как **активные** слова с помощью `::`.

Breaking down the `//` definition:

1. `0`: ноль помещается в стек
2. `word`: эта команда считывает символы до тех пор, пока не будет достигнут один, равный вершине стека, и помещает считанные данные в стек как строку. Ноль — это особый случай: здесь `word` пропускает начальные пробелы и затем читает до конца текущей входной строки.
3. `drop` - Removes the comment text from the stack
4. `0`: ноль снова помещается в стек — число результатов, использованное потому, что слово определено как `::`.
5. `nop` помещает токен выполнения, ничего не делая при вызове. Это практически эквивалентно `{ nop }`.

## Использование Fift для определения кодов сборки TVM

```fift
x{00} @Defop NOP
{ 1 ' @addop does create } : @Defop
{ tuck sbitrefs @ensurebitrefs swap s, } : @addop
{ @havebitrefs ' @| ifnot } : @ensurebitrefs
{ 2 pick brembitrefs 1- 2x<= } : @havebitrefs
{ rot >= -rot <= and } : 2x<=
...
```

> Asm.fif (порядок строк обратный)

### How @Defop works

`@Defop` checks available space for the opcode using `@havebitrefs`. If space is insufficient, it writes to another builder via `@|` (implicit jump).

**Important:** Always use `x{A988} @addop` instead of `x{A988} s,` to avoid compilation failures when space is limited.

### Including cells in contracts

Вы можете использовать Fift для включения большого bag-of-cells в контракт:

```fift
<b 8 4 u, 8 4 u, "fift/blob.boc" file>B B>boc ref, b> <s @Defop LDBLOB
```

This defines an opcode that:

1. Writes `x{88}` (`PUSHREF`) when included in the program
2. Adds a reference to the specified bag-of-cells
3. Поэтому, когда запускается инструкция `LDBLOB`, она помещает ячейку в стек TVM.

## Специальные возможности

### Шифрование Ed25519

Fift provides built-in support for Ed25519 cryptographic operations:

- newkeypair - генерирует пару закрытый-открытый ключ
- priv>pub - генерирует открытый ключ из закрытого
- ed25519_sign[_uint] - генерирует подпись по заданным данным и закрытому ключу
- ed25519_chksign - проверяет подпись Ed25519

### Взаимодействие с TVM

- runvmcode и подобное - вызывает TVM с фрагментом кода, взятым из стека

### File operations

- **Save BoC to file**:
  ```fift
  Запись BOC в файлы:
  `boc>B ".../contract.boc" B>file`
  ```

## Продолжаем изучение

- [Fift: Краткое введение](https://docs.ton.org/fiftbase.pdf) Николая Дурова

<Feedback />

