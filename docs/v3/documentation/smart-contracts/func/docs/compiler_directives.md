# Compiler directives
These are keywords that start with `#` and instruct the compiler to do some actions, checks, or change parameters.

Those directives can be used only at the outermost level (not inside any function definition).

## #include
The `#include` directive allows to include another FunC source code file that will be parsed in place of include.

Syntax is `#include "filename.fc";`. Files are automatically checked for re-inclusion, and attempts to include
a file more than once will be ignored by default, with a warning if the verbosity level is no lower than 2.

If an error happens during the parsing of an included file, additionally, a stack of inclusions is printed with the locations
of each included file in the chain.

## #pragma
The `#pragma` directive is used to provide additional information to the compiler beyond what the language itself conveys.

### #pragma version
Version pragma is used to enforce a specific version of FunC compiler when compiling the file.

The version is specified in a semver format, that is, _a.b.c_, where _a_ is the major version, _b_ is the minor, and _c_ is the patch.

There are several comparison operators available to a developer:
* _a.b.c_ or _=a.b.c_—requires exactly the _a.b.c_ version of the compiler
* _>a.b.c_—requires the compiler version to be higher than _a.b.c_,
  * _>=a.b.c_—requires the compiler version to be higher or equal to _a.b.c_
* _\<a.b.c_—requires the compiler version to be lower than _a.b.c_,
  * _\<=a.b.c_—requires the compiler version to be lower or equal to _a.b.c_
* _^a.b.c_—requires the major compiler version to be equal to the 'a' part and the minor to be no lower than the 'b' part,
  * _^a.b_—requires the major compiler version to be equal to _a_ part and minor be no lower than _b_ part
  * _^a_—requires the major compiler version to be no lower than _a_ part

For other comparison operators (_=_, _>_, _>=_, _\<_, _\<=_) short format assumes zeros in omitted parts, that is:
* _>a.b_ is the same as _>a.b.0_ (and therefore does NOT match thd _a.b.0_ version)
* _\<=a_ is the same as _\<=a.0.0_ (and therefore does NOT match the _a.0.1_ version)
* _^a.b.0_ is **NOT** the same as _^a.b_

For example, _^a.1.2_ matches _a.1.3_ but not _a.2.3_ or _a.1.0_, however, _^a.1_ matches them all. 

This directive may be used multiple times; the compiler version must satisfy all provided conditions.

### #pragma not-version
The syntax of this pragma is the same as the version pragma but it fails if the condition is satisfied.

It can be used for blacklisting a specific version known to have problems, for example.

### #pragma allow-post-modification
_funC v0.4.1_

By default it is prohibited to use variable prior to its modification in the same expression. In other words, expression `(x, y) = (ds, ds~load_uint(8))` won't compile, while `(x, y) = (ds~load_uint(8), ds)` is valid.

This rule can be overwritten, by `#pragma allow-post-modification`, which allow to modify variable after usage in mass assignments and function invocation; as usual sub-expressions will be computed left to right: `(x, y) = (ds, ds~load_bits(8))` will result in `x` containing initial `ds`; `f(ds, ds~load_bits(8))` first argument of `f` will contain initial `ds`, and second - 8 bits of `ds`.

`#pragma allow-post-modification` works only for code after the pragma.

### #pragma compute-asm-ltr
_funC v0.4.1_

Asm declarations can overwrite order of arguments, for instance in the following expression 

```func
idict_set_ref(ds~load_dict(), ds~load_uint(8), ds~load_uint(256), ds~load_ref())
```

order of parsing will be: `load_ref()`, `load_uint(256)`, `load_dict()` and `load_uint(8)` due to following asm declaration (note `asm(value index dict key_len)`):

```func
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
```

This behavior can be changed to strict left-to-right order of computation via `#pragma compute-asm-ltr`

As a result in
```func
#pragma compute-asm-ltr
...
idict_set_ref(ds~load_dict(), ds~load_uint(8), ds~load_uint(256), ds~load_ref());
```
order of parsing will be `load_dict()`, `load_uint(8)`, `load_uint(256)`, `load_ref()` and all asm permutation will happen after computation.

`#pragma compute-asm-ltr` works only for code after the pragma.
