import Feedback from '@site/src/components/Feedback';

# Tolk 的历史

当 Tolk 发布新版本时，我们将在此提及。

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
2. Generics `struct<T>` and `type<T>`
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

1. Under the hood: refactor compiler internals; AST-level semantic analysis kernel
2. Under the hood: rewrite the type system from Hindley-Milner to static typing
3. Clear and readable error messages on type mismatch
4. Generic functions `fun f<T>(...)` and instantiations like `f<int>(...)`
5. The `bool` type; type casting via `value as T`

## v0.6

The first public release. 首次公开发布。以下是关于其起源的一些说明：

## Tolk 是如何诞生的

2024 年 6 月，我创建了一个拉取请求 [FunC v0.5.0](https://github.com/ton-blockchain/ton/pull/1026)。
除了这份 PR 之外，我还写了一份路线图--FunC 在语法和语义上有哪些可以改进的地方。
Besides this PR, I've written a roadmap for what can be enhanced in FunC, syntactically and semantically.

总而言之，与其合并 v0.5.0，继续开发 FunC，我们决定 **fork** 它。
让 FunC 保持原样。一如既往。并开发一种新的语言，由一个全新的名称来驱动。
To leave FunC untouched as it is. As it always was. And to develop a new language driven by a fresh and new name.

For several months, I have worked on Tolk privately. I have implemented a giant list of changes.
And it's not only about the syntax. For instance, Tolk has an internal AST representation that is completely missed in FunC.

在 11 月 1-2 日于迪拜举行的 TON Gateway 上，我发表了演讲，向公众介绍了 Tolk，并在当天发布了视频。
一旦有了视频，我会把它附在这里。
The video is available [on YouTube](https://www.youtube.com/watch?v=Frq-HUYGdbI).

这是第一个拉取请求：["Tolk Language: next-generation FunC"](https://github.com/ton-blockchain/ton/pull/1345)。

Tolk 语言的第一个版本是 v0.6，它是 FunC v0.5 的一个隐喻，错过了出现的机会。

## 名字 "Tolk "的含义

**Tolk** is a wonderful word.

In English, it's consonant with _talk_. Because, generally, what do we need a language for? We need it _to talk_ to computers.

In all Slavic languages, the root _tolk_ and the phrase _"to have tolk"_ means "to make sense"; "to have deep internals".

But actually, **TOLK** is an abbreviation.\
You know, that TON is **The Open Network**.\
By analogy, TOLK is **The Open Language K**.

What is K, will you ask? Probably, "kot" — the nick of Nikolay Durov? Or Kolya? Kitten? Kernel? Kit? Knowledge?\
The right answer — none of this. This letter does not mean anything. It's open.\
_The Open Letter K_

<Feedback />

