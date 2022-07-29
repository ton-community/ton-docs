# Compiler directives
Those are keywords that start with `#` and instruct compiler to do some actions, checks or adjust parameters.

Those directives can be used only at the outermost level (not inside any function definition).

## #include
The `#include` directive allows to include another FunC source code file that will be parsed at the place of include.

Syntax is `#include "filename.fc";`. Files are automatically checked against re-inclusion and attempting to include
a file more than once would be silently ignored by default, with warning if verbosity level is no lower than 2.

If an error happens during parsing of included file additionally a stack of inclusions is printed with locations
of each include in chain.

## #pragma
The `#pragma` directive is the method for providing additional information to the compiler, beyond what is conveyed
in the language itself.

### #pragma version
Version pragma is used to enforce specific version of FunC compiler when compiling the file.

Version is specified in semver format, that is `a.b.c`, where `a` is major version, `b` is minor, and `c` is patch.

There are several comparison operators available for the developer:
* `a.b.c` or `=a.b.c` - requires exactly the `a.b.c` version of the compiler,
* `>a.b.c` - requires compiler version to be higher than `a.b.c`,
  * `>=a.b.c` - requires compiler version to be higher or equal to `a.b.c`,
* `<a.b.c` - requires compiler version to be lower than `a.b.c`,
  * `<=a.b.c` - requires compiler version to be lower or equal to `a.b.c`,
* `^a.b.c` - requires the major and minor compiler version to be equal to `a.b` and patch be no lower than `c` part,
  * `^a.b` - requires the major compiler version to be equal to `a` part and minor be no lower than `b` part,
  * `^a` - requires the major compiler version to be no lower than `a` part.

For other comparison operators (`=`, `>`, `>=`, `<`, `<=`) short format assumes zeros in omitted parts, that is:
* `>a.b` is same as `>a.b.0` (and therefore does NOT match `a.b.0` version),
* `<=a` is same as `<=a.0.0` (and therefore does NOT match `a.0.1` version),
* `^a.b.0` is **NOT** the same as `^a.b`.

For example, `^a.1.2` matches `a.1.3` but not `a.2.3` or `a.1.0`, however, `^a.1` matches them all. 

This directive may be used multiple times, the compiler version must satisfy all the provided conditions.

### #pragma not-version
The syntax of this pragma is same as the version pragma, but it fails if the condition is satisfied.

It can be used for blacklisting a specific version known to have problems, for example.