import Feedback from '@site/src/components/Feedback';

# История Tolk

Когда будут выпущены новые версии Tolk, они будут упомянуты здесь.

## v0.99

1. Universal `createMessage`
2. Universal `createExternalLogMessage`
3. Sharding — calculate addresses "close to another contract"

## v0.13

1. Auto-packing to/from cells/builders/slices
2. Type `address`
3. Lateinit variables
4. Defaults for parameters

## v0.12

1. Structures `struct A { ... }`
2. Под капотом: переписываем систему типов с Хиндли-Милнера на статическую типизацию
3. Methods `fun Point.getX(self)`
4. Rename stdlib functions to short methods

## v0.11

1. Type aliases `type NewName = <existing type>`
2. Union types `T1 | T2 | ...`
3. Pattern matching for types
4. Operators `is` and `!is`
5. Pattern matching for expressions
6. Semicolon for the last statement in a block can be omitted

## v0.10

1. Fixed-width integers: `int32`, `uint64`, etc. [Details](https://github.com/ton-blockchain/ton/pull/1559)
2. Type `coins` and function `ton("0.05")`
3. `bytesN` and `bitsN` types (backed by slices at TVM level)
4. Replace `"..."c` postfixes with `stringCrc32("...")` functions
5. Support `0b...` number literals along with `0x...`
6. Trailing comma support

## v0.9

1. Nullable types `int?`, `cell?`, etc.; null safety
2. Standard library (asm definitions) updated to reflect nullability
3. Smart casts, like in TypeScript in Kotlin
4. Operator `!` (non-null assertion)
5. Code after `throw` is treated as unreachable
6. The `never` type

## v0.8

1. Syntax `tensorVar.0` and `tupleVar.0` (both for reading and writing)
2. Allow `cell`, `slice`, etc. to be valid identifiers (not keywords)

## v0.7

1. Под капотом: рефакторинг внутренних компонентов компилятора; ядро ​​семантического анализа на уровне AST
2. Под капотом: переписываем систему типов с Хиндли-Милнера на статическую типизацию
3. Понятные и читаемые сообщения об ошибках при несоответствии типов
4. Универсальные функции `fun f<T>(...)` и их экземпляры, такие как `f<int>(...)`
5. Тип `bool`; приведение типа через `value as T`

## v0.6

Первый публичный релиз. Вот некоторые заметки о его происхождении:

## Как появился Tolk

In June 2024, I created a pull request [FunC v0.5.0](https://github.com/ton-blockchain/ton/pull/1026).
Besides this PR, I've written a roadmap for what can be enhanced in FunC, syntactically and semantically.

В общем, вместо того, чтобы объединить v0.5.0 и продолжить разработку FunC, мы решили **разветвить** его.
Чтобы оставить FunC нетронутым, как есть. Как всегда. И разработать новый язык, движимый свежим и новым именем.

Несколько месяцев я работал над Tolk в частном порядке. Я реализовал огромный список изменений.
И дело не только в синтаксисе. Например, у Tolk есть внутреннее представление AST, полностью отсутствующее в FunC.

На TON Gateway 1-2 ноября в Дубае я выступил с речью, в которой представил Tolk публике, и мы опубликовали ее в тот же день.
Видео доступно [на YouTube](https://www.youtube.com/watch?v=Frq-HUYGdbI).

Вот самый первый pull request: ["Язык Tolk: следующее поколение FunC"](https://github.com/ton-blockchain/ton/pull/1345).

Первая версия языка Tolk — v0.6, метафора FunC v0.5, которая упустила шанс появиться.

## Значение названия "Tolk"

**Tolk** is a wonderful word.

В английском языке это созвучно с _talk_. Потому что, вообще, зачем нам нужен язык? Он нам нужен, чтобы _разговаривать_ с компьютерами.

Во всех славянских языках корень _толк_ и фраза _иметь толк_ означают "иметь смысл", "иметь глубокие внутренние чувства".

Но на самом деле **TOLK** — это аббревиатура.\
Вы знаете, что TON — это **The Open Network**.\
По аналогии, TOLK — это **The Open Language K**.

Что такое К, спросите вы? Наверное, "кот" — ник Николая Дурова? Или Коля? Котенок? Ядро (Kernel)? Кит? Знание (Knowledge)?\
Правильный ответ — ничего из этого. Эта буква ничего не значит. Она открытая.\
_The Open Letter K_

<Feedback />

