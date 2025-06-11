import Feedback from '@site/src/components/Feedback';

# Literals and identifiers

## 数値リテラル

FunC supports decimal and hexadecimal integer literals, including those with leading zeros.

Examples of valid literals: `0`, `123`, `-17`, `00987`, `0xef`, `0xEF`, `0x0`, `-0xfFAb`, `0x0001`, `-0`, and `-0x0`.

## 文字列リテラル

In FunC, strings are enclosed in double quotes `"`, like `"this is a string"`.<br />
You can optionally specify a type after the string literal, such as `"string"u`.<br />
Special characters like `\n` are not supported, but you can create multi-line <br />  strings simply by writing the text across multiple lines, like this:

```
;; somewhere inside of a function body

var a = """
   hash me baby one more time
"""h;
var b = a + 42;

b; ;; 623173419
```

FunC supports the following string types:

- without type – Used for `asm` function definitions and defining a slice constant from an ASCII string.
- `s`— Defines a raw slice constant using its contents (hex-encoded and optionally bit-padded).
- `a`— Creates a slice constant containing a `MsgAddressInt` structure from a given address.
- `u`— Converts an ASCII string into an integer constant, representing its hex values.
- `h`— Generates an integer constant from the first 32 bits of the string's SHA-256 hash.
- `H`— Generates an integer constant from the full 256-bit SHA-256 hash of the string.
- `c`— Generates an integer constant from the `crc32` value of the string.

**Examples**
The following string literals produce these corresponding constants:

- `"string"`  &rarr;  `x{737472696e67}` (slice constant)
- `"abcdef"s` &rarr; `x{abcdef}` (slice constant)
- `"Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF"a` &rarr; `x{9FE6666666666666666666666666666666666666666666666666666666666666667_}` (slice constant representing an: `addr_std$10 anycast:none$0 workchain_id:int8=0xFF address:bits256=0x33...33`)
- `"NstK"u` &rarr; `0x4e73744b` (integer constant)
- `"transfer(slice, int)"h` &rarr; `0x7a62e8a8` (integer constant)
- `"transfer(slice, int)"H` &rarr; `0x7a62e8a8ebac41bd6de16c65e7be363bc2d2cbc6a0873778dead4795c13db979` (integer constant)
- `"transfer(slice, int)"c` &rarr; `2235694568` (integer constant)

## Identifiers

FunC allows a broad range of identifiers for functions and variable names.
Any **single-line string** that meets the following conditions qualifies as a valid identifier:

- It **does not** contain special symbols: `;`, `,`, `(`, `)`, `[`, `]`, spaces including tabs, `~`, and `.`.
- It **does not** start as a comment or a string literal (i.e., with `"` at the beginning).
- It is **not** a number literal.
- It is **not** an underscore `_`.
- It is **not** a reserved keyword. Exception: if it starts with a backtick `` ` ``, it must also end with a backtick and cannot contain any additional backticks inside.
- It is **not** a name of a [builtin](https://github.com/ton-blockchain/ton/blob/5c392e0f2d946877bb79a09ed35068f7b0bd333a/crypto/func/builtins.cpp#L1133).

Additionally, **function** names in function definitions can start with `.` or `~`.

Examples of valid identifiers:

- `query`, `query'`, `query''`
- `elem0`, `elem1`, `elem2`
- `CHECK`
- `_internal_value`
- `message_found?`
- `get_pubkeys&signatures`
- `dict::udict_set_builder`
- `_+_` (the standard addition operator for `(int, int) -> int` in prefix notation, although it is already defined).
- `fatal!`

**Naming conventions:**

- **Apostrophe `'` at the end:** used when a variable is a modified version of its original value.

  - Example:
    almost all modifying built-in primitives for hashmap manipulation
    (except those with the prefix `~`) return a new version of the hashmap, often with extra data.
    The updated version is typically named with the same identifier, adding a `'` suffix.

- **Question mark (?) at the end:** typically used for boolean variables or functions that return a success flag.
  - Example: `udict_get?` from [stdlib.fc](/v3/documentation/smart-contracts/func/docs/stdlib), which checks if a value exists.

**Invalid identifiers:**

- `take(first)Entry` - contains parentheses `()`
- `"not_a_string` - starts with a `"` like a string literal
- `msg.sender` - includes a `.` which is not allowed
- `send_message,then_terminate` - contains a `,` which is not allowed
- `_` - just an underscore, which is not valid on its own

**Less common but valid identifiers:**

- `123validname`
- `2+2=2*2`
- `-alsovalidname`
- `0xefefefhahaha`
- `{hehehe}`
- ``pa{--}in"`aaa`"``

**More invalid identifiers:**

- ``pa;;in"`aaa`"`` - contains `;`, which is prohibited
- `{-aaa-}` - contains `{}` incorrectly
- `aa(bb` - contains an opening parenthesis without closing it
- `123` - a number literal, not an identifier

**Special identifiers in backticks:**

FunC allows identifiers enclosed in backticks `` ` ``. These identifiers can contain any characters except:

- Newline characters `\n`
- Backticks `` ` `` themselves except the opening and closing ones.

**Examples of valid backtick-quoted identifiers:**

- `I'm a variable too`
- `any symbols ; ~ () are allowed here...`

## Constants

FunC allows defining **compile-time constants** that are substituted and pre-computed during compilation.

**Syntax:**

```func
const optional-type identifier = value-or-expression;
```

- `optional-type` (e.g., `int` or `slice`) is optional but improves readability and ensures type correctness.
- `value-or-expression`can be a literal or a pre-computable expression involving literals and constants.

**Example usage:**

```func
const int101 = 101;                 // Numeric constant
const str1 = "const1", str2 = "aabbcc"s; // String constants
const int int240 = ((int1 + int2) * 10) << 3; // Computed constant
const slice str2r = str2;           // Constant referencing another constant
```

Since numeric constants are replaced during compilation,
all optimizations and pre-computations apply efficiently—unlike the older approach using inline `PUSHINT` assembly.

<Feedback />
