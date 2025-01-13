# History of Tolk

When new versions of Tolk are released, they will be mentioned here.


## v0.7

1. Under the hood: refactor compiler internals; AST-level semantic analysis kernel
2. Under the hood: rewrite the type system from Hindley-Milner to static typing
3. Clear and readable error messages on type mismatch
4. Generic functions `fun f<T>(...)` and instantiations like `f<int>(...)`
5. The `bool` type; type casting via `value as T`

More details [on GitHub](todo).


## v0.6

The first public release. Here are some notes about its origin: 


## How Tolk was born

In June 2024, I created a pull request [FunC v0.5.0](https://github.com/ton-blockchain/ton/pull/1026).
Besides this PR, I've written a roadmap — what can be enhanced in FunC, syntactically and semantically.

All in all, instead of merging v0.5.0 and continuing developing FunC, we decided to **fork** it.
To leave FunC untouched, as it is. As it always was. And to develop a new language, driven by a fresh and new name.

For several months, I have worked on Tolk privately. I have implemented a giant list of changes.
And it's not only about the syntax. For instance, Tolk has an internal AST representation, completely missed in FunC.

On TON Gateway, on 1-2 November in Dubai, I had a speech presenting Tolk to the public, and we released it the same day.
The video is available [on YouTube](https://www.youtube.com/watch?v=Frq-HUYGdbI).

Here is the very first pull request: ["Tolk Language: next-generation FunC"](https://github.com/ton-blockchain/ton/pull/1345).

The first version of the Tolk Language is v0.6, a metaphor of FunC v0.5 that missed a chance to occur.


## Meaning of the name "Tolk"

"Tolk" is a very beautiful word. 

In English, it's consonant with *talk*. Because, generally, what do we need a language for? We need it *to talk* to computers. 

In all slavic languages, the root *tolk* and the phrase *"to have tolk"* means "to make sense"; "to have deep internals".

But actually, **TOLK** is an abbreviation.  
You know, that TON is **The Open Network**.  
By analogy, TOLK is **The Open Language K**.   

What is K, will you ask? Probably, "kot" — the nick of Nikolay Durov? Or Kolya? Kitten? Kernel? Kit? Knowledge?  
The right answer — none of this. This letter does not mean anything. It's open.  
*The Open Letter K*
