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

The version is specified in a semver format, that is, `a.b.c`, where `a` is the major version, `b` is the minor, and `c` is the patch.

There are several comparison operators available to a developer:
* `a.b.c` or `=a.b.c`—requires exactly the `a.b.c` version of the compiler
* `>a.b.c`—requires the compiler version to be higher than `a.b.c`,
  * `>=a.b.c`—requires the compiler version to be higher or equal to `a.b.c`
* `<a.b.c`—requires the compiler version to be lower than `a.b.c`,
  * `<=a.b.c`—requires the compiler version to be lower or equal to `a.b.c`
* `^a.b.c`—requires the major compiler version to be equal to the 'a' part and the minor to be no lower than the 'b' part,
  * `^a.b`—requires the major compiler version to be equal to `a` part and minor be no lower than `b` part
  * `^a`—requires the major compiler version to be no lower than `a` part

For other comparison operators (`=`, `>`, `>=`, `<`, `<=`) short format assumes zeros in omitted parts, that is:
* `>a.b` is the same as `>a.b.0` (and therefore does NOT match thd `a.b.0` version)
* `<=a` is the same as `<=a.0.0` (and therefore does NOT match the `a.0.1` version)
* `^a.b.0` is **NOT** the same as `^a.b`

For example, `^a.1.2` matches `a.1.3` but not `a.2.3` or `a.1.0`, however, `^a.1` matches them all. 

This directive may be used multiple times; the compiler version must satisfy all provided conditions.

### #pragma not-version
The syntax of this pragma is the same as the version pragma but it fails if the condition is satisfied.

It can be used for blacklisting a specific version known to have problems, for example.