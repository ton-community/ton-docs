import Feedback from '@site/src/components/Feedback';

# Fift deep dive

Fift is a high-level stack-based language used for local manipulation of cells and other TVM primitives. Its primary purpose is to compile TVM assembly code into contract code as a bag-of-cells (BoC).

:::caution
**Advanced topic notice**
This section covers low-level interactions with TON's implementation details. Before proceeding, ensure you have:

- Solid experience with stack-based programming paradigms
- Understanding of virtual machine architectures
- Familiarity with low-level data structures
:::

## Simple arithmetic

Use the Fift interpreter as a calculator with reverse Polish notation:

```
6 17 17 * * 289 + .
2023 ok
```

This example calculates:

1. `17 * 17 = 289`
2. `6 * 289 = 1734`
3. `1734 + 289 = 2023`

## Standard output

```
27 emit ."[30;1mgrey text" 27 emit ."[37m"
grey text ok
```

- `emit` prints the Unicode character corresponding to the number on top of the stack
- `."..."` outputs a constant string  

## Defining functions (Fift words)

To define a word, follow these steps:  

1. **Enclose the word's effects** in curly braces `{}`.  
2. **Add a colon `:`** after the closing brace.  
3. **Specify the word's name** after the colon.

First line defines a word `increment` that increases `x` by `1`.

**Examples:**  
```  
{ x 1 + } : increment
{ minmax drop } : min
{ minmax nip } : max
```  
> Fift.fif

In TON, multiple **defining words** exist, not just `:`. They differ in behavior:  

- **Active words** – Operate inside curly braces `{}`.
- **Prefix words** – Do not require a trailing space .

```  
{ bl word 1 2 ' (create) } "::" 1 (create)  
{ bl word 0 2 ' (create) } :: :  
{ bl word 2 2 ' (create) } :: :_  
{ bl word 3 2 ' (create) } :: ::_  
{ bl word 0 (create) } : create  
``` 

> Fift.fif

## Conditional execution

Execute code blocks conditionally using `cond`:

```
{ { ."true " } { ."false " } cond } : ?.   4 5 = ?.  4 5 < ?.
false true  ok
{ ."hello " } execute ."world"
hello world ok
```

## Loops

Use loop primitives for repetitive operations:

```
// ( l c -- l') Removes first c elements from list l
{ ' safe-cdr swap times } : list-delete-first
```

> GetOpt.fif

Loop word `times` takes two arguments - let's call them `cont` and `n` - and executes `cont` `n` times.
Here `list-delete-first` takes continuation of `safe-cdr` (command deleting head from Lisp-style list), places it under `c` and then `c` times removes head from list present on stack.
`while`/`until` provide conditional looping.

## Comments

Comments in Fift are defined in `Fift.fif` and come in two forms:
1. **Single-line comments**: Start with `//` and continue to the end of the line
2. **Multiline comments**: Start with `/*` and end with `*/`

```
{ 0 word drop 0 'nop } :: //
{ char " word 1 { swap { abort } if drop } } ::_ abort"
{ { bl word dup "" $= abort"comment extends after end of file" "*/" $= } until 0 'nop } :: /*
```
> Fift.fif

#### How comments work

Fift programs are sequences of words that transform the stack or define new words. Comments must work even during word definitions, requiring them to be **active words** (defined with `::`).

Breaking down the `//` definition:
1. `0` - Pushes zero onto the stack
2. `word` - Reads characters until reaching one matching the top stack value (zero is special - skips leading spaces then reads to end of line)
3. `drop` - Removes the comment text from the stack
4. `0` - Pushes zero again (number of results for `::` definition)
5. `'nop` - Pushes an execution token that does nothing (equivalent to `{ nop }`)


## Using Fift for defining TVM assembly codes

```fift
x{00} @Defop NOP
{ 1 ' @addop does create } : @Defop
{ tuck sbitrefs @ensurebitrefs swap s, } : @addop
{ @havebitrefs ' @| ifnot } : @ensurebitrefs
{ 2 pick brembitrefs 1- 2x<= } : @havebitrefs
{ rot >= -rot <= and } : 2x<=
...
```
> Asm.fif (lines order reversed)

### How @Defop works
`@Defop` checks available space for the opcode using `@havebitrefs`. If space is insufficient, it writes to another builder via `@|` (implicit jump). 

**Important:** Always use `x{A988} @addop` instead of `x{A988} s,` to avoid compilation failures when space is limited.

### Including cells in contracts
You can embed large bag-of-cells into contracts:
```fift
<b 8 4 u, 8 4 u, "fift/blob.boc" file>B B>boc ref, b> <s @Defop LDBLOB
```

This defines an opcode that:
1. Writes `x{88}` (`PUSHREF`) when included in the program
2. Adds a reference to the specified bag-of-cells
3. Pushes the cell to TVM stack when executing `LDBLOB`

## Special features

### Ed25519 cryptography
Fift provides built-in support for Ed25519 cryptographic operations:
- **`newkeypair`** - Generates a private-public key pair  
- **`priv>pub`** - Derives a public key from a private key  
- **`ed25519_sign[_uint]`** - Creates a signature for given data using a private key  
- **`ed25519_chksign`** - Verifies an Ed25519 signature  

### TVM interaction
- **`runvmcode` and similar commands** - Executes TVM with a code slice taken from the stack  

### File operations
- **Save BoC to file**:  
  ```fift
  boc>B ".../contract.boc" B>file
  ```

## Continue learning  
- [Fift: A Brief Introduction](https://docs.ton.org/fiftbase.pdf) - _Nikolai Durov_  

<Feedback />

