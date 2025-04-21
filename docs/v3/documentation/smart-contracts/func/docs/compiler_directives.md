import Feedback from '@site/src/components/Feedback';

# Compiler directives
Compiler directives are keywords that begin with `#`, instructing the compiler to perform specific actions, enforce checks, or modify parameters.

These directives can only be used at the outermost level of a source file and cannot be placed inside function definitions.

## #include
The `#include` directive enables the inclusion of another FunC source file parsed in place of the directive.

**Syntax:**

```func
#include "filename.fc";
```

Files are automatically checked for multiple inclusions. By default, the compiler will ignore redundant inclusions if the same file is included more than once. A warning will be issued if the verbosity level is 2 or higher.

If an error occurs while parsing an included file, the compiler displays an inclusion stack, showing the locations of each file in the inclusion chain.

## #pragma
The `#pragma` directive provides additional information to the compiler beyond what the language conveys.


### #pragma version
The `#pragma` version directive enforces using a specific FunC compiler version when compiling the file.

The version is specified in **semantic versioning (semver)** format: _a.b.c_, where:
- _a_ is the major version;
- _b_ is the minor version;
- _c_ is the patch version.

**Supported comparison operators**

Developers can specify version constraints using the following operators:

* _a.b.c_ or _=a.b.c_—Requires **exactly** version _a.b.c_ of the compiler;
* _>a.b.c_—Requires the compiler version to be **greater** than _a.b.c._;
  * _>=a.b.c_—Requires the compiler version to be **greater** than or **equal** to _a.b.c_;
* _\<a.b.c_— Requires the compiler version to be **less** than _a.b.c_;
  * _\<=a.b.c_—Requires the compiler version to be **less** than or **equal** to _a.b.c_;
* _^a.b.c_—Requires the major compiler version to be **equal** to the _a_ part and the minor to be **no lower** than the _b_ part;
  * _^a.b_—Requires the major compiler version to be **equal* to _a_ part and minor be **no lower** than _b_ part;
  * _^a_—Requires the major compiler version to be **no lower** than _a_ part.

For comparison operators (_=_, _>_, _>=_, _\<_, _\<=_) , omitted parts default to zero.
For example:

* _>a.b_ is equivalent to _>a.b.0_ and **does not** match version _a.b.0._;
* _\<=a_ is equivalent to _\<=a.0.0_ and **does not** match version _a.0.1_ version;
* _^a.b.0_ is **not the same** as _^a.b_

**Examples:**
-  _^a.1.2_ matches _a.1.3_ but not _a.2.3_ or _a.1.0_;
- _^a.1_ matches all of them.

The `#pragma` version directive can be used multiple times, and the compiler must satisfy all specified conditions.

### #pragma not-version

The syntax of `#pragma not-version` is identical to `#pragma version`, but it fails if the specified condition is met.

This directive is applicable for blocking specific compiler versions known to have issues.


### #pragma allow-post-modification
_Introduced in FunC v0.4.1_

Using a variable before it is modified within the same expression is prohibited by default.

For example, the following code **will not compile**:

```func
(x, y) = (ds, ds~load_uint(8))
```

However, this version is **valid**:

```func
(x, y) = (ds~load_uint(8), ds)
```
To override this restriction, use `#pragma allow-post-modification`. This allows variables to be modified after usage in mass assignments and function calls while sub-expressions are still computed **left to right**.

In the following example, `x` will contain the initial value of `ds`:
```func
#pragma allow-post-modification
(x, y) = (ds, ds~load_bits(8)); 
```

Here, in `f(ds, ds~load_bits(8));`:
- The first argument of `f` will contain the initial value of `ds`.
- The second argument will contain the 8-bit-modified value of `ds`.

`#pragma allow-post-modification` works only for code after the pragma.

### #pragma compute-asm-ltr
_Introduced in FunC v0.4.1_

`asm` declarations can override the order of argument evaluation. For example, in the following expression:

```func
idict_set_ref(ds~load_dict(), ds~load_uint(8), ds~load_uint(256), ds~load_ref())
```

The execution order is:
1. `load_ref()`
2. `load_uint(256)`
3. `load_dict()`
4. `load_uint(8)`
   
This happens due to the corresponding `asm` declaration:

```func
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
```
Here, the `asm(value index dict key_len)` notation dictates a reordering of arguments.


To ensure strict left-to-right computation order, use `#pragma compute-asm-ltr`. With this directive enabled, the same function call:

```func
#pragma compute-asm-ltr
...
idict_set_ref(ds~load_dict(), ds~load_uint(8), ds~load_uint(256), ds~load_ref());
```

will be evaluated in the following order:
1. `load_dict()`
2. `load_uint(8)`
3. `load_uint(256)`
4. `load_ref()`

All `asm` reordering will occur only after computation.

`#pragma compute-asm-ltr` works only for code after the pragma.


**Note:** `#pragma compute-asm-ltr` applies only to the code after the directive in the file.
<Feedback />

