import Feedback from '@site/src/components/Feedback';

# History of FunC 

## Initial version
The initial version of FunC was developed by Telegram, but active development stopped after May 2020.
We refer to the May 2020 release as the "initial" version.

## Version 0.1.0
Released in [May 2022](https://github.com/ton-blockchain/ton/releases/tag/v2022.05/).

**New features:**
- [Constants](/v3/documentation/smart-contracts/func/docs/literals_identifiers#constants/)
- [Extended string literals](/v3/documentation/smart-contracts/func/docs/literals_identifiers#string-literals/)
- [Semver pragmas](/v3/documentation/smart-contracts/func/docs/compiler_directives#pragma-version/)
- [Includes](/v3/documentation/smart-contracts/func/docs/compiler_directives#pragma-version/)

**Fixes:**
- Resolved rare bugs in `Asm.fif`.


## Version 0.2.0
Released in [Aug 2022](https://github.com/ton-blockchain/ton/releases/tag/v2022.08/).

**New features:**
- Unbalanced `if/else` branches, where some branches return a value while others do not.

**Fixes:**
- FunC incorrectly handles `while(false)` loops [(#377)](https://github.com/ton-blockchain/ton/issues/377/).
- FunC generates incorrect code for `if/else` branches [(#374)](https://github.com/ton-blockchain/ton/issues/374/).
- FunC incorrectly returns from conditions in inline functions [(#370)](https://github.com/ton-blockchain/ton/issues/370/).
- `Asm.fif`: splitting large function bodies incorrectly interferes with inline [(#375)](https://github.com/ton-blockchain/ton/issues/375/).



## Version 0.3.0
Released in [Oct 2022](https://github.com/ton-blockchain/ton/releases/tag/v2022.10/).

**New features:**
- Support for [multiline `asm` statements](/v3/documentation/smart-contracts/func/docs/functions#multiline-asms).
- Allow duplicate definitions of identical constants and `asm` statements.
- Enable bitwise operations for constants.

## Version 0.4.0
Released in [Jan 2023](https://github.com/ton-blockchain/ton/releases/tag/v2023.01/).

**New features:**
- [`try/catch` statements](/v3/documentation/smart-contracts/func/docs/statements#try-catch-statements)
- [`throw_arg` functions](/v3/documentation/smart-contracts/func/docs/builtins#throwing-exceptions)
- Support for in-place modification and mass assignment of global variables, e.g., `a~inc()` and `(a, b) = (3, 5)`, where `a` is global.


**Fixes:**
- Disallowed ambiguous modification of local variables after their usage in the same expression. For example, `var x = (ds, ds~load_uint(32), ds~load_unit(64));` is forbidden, while `var x = (ds~load_uint(32), ds~load_unit(64), ds);` is allowed. 
- Allowed empty inline functions.
- Fixed a rare optimization bug in `while` loops.


<Feedback />

