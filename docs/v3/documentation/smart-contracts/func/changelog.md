# History of FunC 

# Initial version
Initial version was done by Telegram and active development was ceased after May 2020. We refer to version of May 2020 as "initial".

# Version 0.1.0
Released in [05.2022 update](https://github.com/ton-blockchain/ton/releases/tag/v2022.05).

In this version were added:
- [Constants](/v3/documentation/smart-contracts/func/docs/literals_identifiers#constants)
- [Extended string literals](/v3/documentation/smart-contracts/func/docs/literals_identifiers#string-literals)
- [Semver pragmas](/v3/documentation/smart-contracts/func/docs/compiler_directives#pragma-version)
- [Includes](/v3/documentation/smart-contracts/func/docs/compiler_directives#pragma-version)

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
- [Multiline asms](/v3/documentation/smart-contracts/func/docs/functions#multiline-asms)
- Duplication of identical definition for constants and asms became allowed
- Bitwise operations for constants for constants became allowed

# Version 0.4.0
Released in [01.2023 update](https://github.com/ton-blockchain/ton/releases/tag/v2023.01).

In this version were added:
- [try/catch statements](/v3/documentation/smart-contracts/func/docs/statements#try-catch-statements)
- [throw_arg functions](/v3/documentation/smart-contracts/func/docs/builtins#throwing-exceptions)
- allowed in-place modification and mass-assignments of global variables: `a~inc()` and `(a, b) = (3, 5)`, where `a` is global

Fixed:
- forbidden ambiguous modification of local variables after it's usage in the same expression: `var x = (ds, ds~load_uint(32), ds~load_unit(64));` are forbidden, while `var x = (ds~load_uint(32), ds~load_unit(64), ds);` are not
- Allowed empty inline functions
- fix rare `while` optimization bug
