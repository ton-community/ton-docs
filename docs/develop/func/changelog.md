# History of FunC 

# Initial version
Initial version was done by Telegram and active development was ceased after May 2020. We refer to version of May 2020 as "initial".

# Version 0.1.0
Released in [05.2022 update](https://github.com/ton-blockchain/ton/releases/tag/v2022.05).

In this version were added:
- [Constants](/develop/func/literals_identifiers#constants)
- [Extended string literals](/develop/func/literals_identifiers#string-literals)
- [Semver pragmas](/develop/func/compiler_directives#pragma-version)
- [Includes](/develop/func/compiler_directives#pragma-version)

Fixed:
- Fixed rarely manifested bugs in Asm.fif.


# Version 0.2.0
Released in [08.2022 update](https://github.com/ton-blockchain/ton/releases/tag/v2022.08).

In this version were added:
- Unbalanced if/else branches (when some branches return and some are not)

Fixed:
- [FunC incorrectly handles while(false) loops #377](https://github.com/ton-blockchain/ton/issues/377)
- [FunC incorreclty generate code for ifelse branches #374](https://github.com/ton-blockchain/ton/issues/374)
- [FunC incorrectly return from condition in inline functions #370](https://github.com/ton-blockchain/ton/issues/370)
- [Asm.fif: splitting of large function bodies incorrectly interfere with inlines #375](https://github.com/ton-blockchain/ton/issues/375)

# Version 0.3.0
Released in [10.2022 update](https://github.com/ton-blockchain/ton/releases/tag/v2022.10).

In this version were added:
- [Multiline asms](/develop/func/functions#multiline-asms)
- Duplication of identical definition for constants and asms became allowed
- Bitwise operations for constants became allowed

# Version 0.4.0
Released in [01.2023 update](https://github.com/ton-blockchain/ton/releases/tag/v2023.01).

In this version were added:
- [try/catch statements](/develop/func/statements#try-catch-statements)
- [throw_arg functions](/develop/func/stdlib#throwing-exceptions)
- allowed in-place modification and mass-assignments of global variables: `a~inc()` and `(a, b) = (3, 5)`, where `a` is global

Fixed:
- forbidden ambiguous modification of local variables after it's usage in the same expression: `var x = (ds, ds~load_uint(32), ds~load_unit(64));` are forbidden, while `var x = (ds~load_uint(32), ds~load_unit(64), ds);` are not
- Allowed empty inline functions
- fix rare `while` optimization bug

# Version 0.5.0
Released in June 2024.

This update was focused on syntax changes and additions.
1. Traditional comment syntax `//` and `/*` is now supported (and preferred), block comments are no longer nested
2. All functions are impure by default. Keyword `impure` has become deprecated, but its antonym keyword `pure` is introduced
3. Keyword `method_id` is deprecated, also. It was replaced as too obscure. Now there is `get`, written on the left: `get int seqno() { ... }`
4. Pragmas `compute-asm-ltr` and `allow-post-modification` are deprecated (always on)
5. FunC compiler auto-inlines simple function wrappers, it's a kernel for potential camelCase and stdlib renamings
6. FunC compiler can drop unused functions from Fift output, activated by `#pragma remove-unused-functions`
7. Changed priorities of operators `& | ^` to more intuitive ones
8. Built-in functions are also placed into stdlib
9. Tremendously enhanced internal framework for testing FunC, a basis for future more radical language improvements
10. Some bug fixes, for wasm/Tact in particular
11. IDE plugin for JetBrains has been updated, it supports new syntax and introduces a setting "FunC language level", encoupled with inspections to remove `impure`, replace `method_id` with `get`, etc.
12. IDE plugin for VS Code has also been updated in the same manner: it supports new syntax, has the "FunC language level" setting and related diagnostics/quickfixes

See [migration guide](/develop/func/migration-guide).
