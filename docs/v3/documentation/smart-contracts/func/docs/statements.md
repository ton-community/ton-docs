import Feedback from '@site/src/components/Feedback';

# Statements

This section briefly overviews FunC statements, which form the core of function bodies.

## Expression statements
The most common type of statement is the expression statement—an expression followed by `;`. As a rule, all sub-expressions are evaluated from left to right, 
except in cases where [asm stack rearrangement](/v3/documentation/smart-contracts/func/docs/functions#rearranging-stack-entries) explicitly defines the order.

### Variable declaration
Local variables must be initialized at the time of declaration. Here are some examples:

```func
int x = 2;
var x = 2;
(int, int) p = (1, 2);
(int, var) p = (1, 2);
(int, int, int) (x, y, z) = (1, 2, 3);
(int x, int y, int z) = (1, 2, 3);
var (x, y, z) = (1, 2, 3);
(int x = 1, int y = 2, int z = 3);
[int, int, int] [x, y, z] = [1, 2, 3];
[int x, int y, int z] = [1, 2, 3];
var [x, y, z] = [1, 2, 3];
```


A variable can be redeclared in the same scope. For example, the following code is valid:

```func
int x = 2;
int y = x + 1;
int x = 3;
```

In this case, 
the second occurrence of `int x` is not a new declaration but a compile-time check ensuring that `x` has type `int`. The third line is equivalent to `x = 3;`.


**Variable redeclaration in nested scopes**

In nested scopes, a new variable with the same name can be declared, just like in C:

```func
int x = 0;
int i = 0;
while (i < 10) {
  (int, int) x = (i, i + 1);
  ;; Here x is a variable of type (int, int)
  i += 1;
}
;; Here, x refers to the original variable of type int declared above
```

However, as mentioned in the [Global variables](/v3/documentation/smart-contracts/func/docs/global_variables/) section, 
global variables **cannot** be redeclared.


Since variable declarations are **expression statements**, constructs like `int x = 2;` are valid expressions. 
For instance:
`int y = (int x = 3) + 1;`
Here, `x` is declared and assigned `3`, and `y` is assigned `4`.


#### Underscore

The underscore `_` is used when a value is not needed. 
For example, if `foo` is a function of type `int -> (int, int, int)`, 
you can retrieve only the first return value while ignoring the rest:
```func
(int fst, _, _) = foo(42);
```



### Function application

A function call in FunC follows a conventional syntax: 
the function name is followed by its arguments, separated by commas.

```func
;; Suppose foo has type (int, int, int) -> int
int x = foo(1, 2, 3);
```

However, unlike many conventional languages, FunC treats functions as taking a single argument. 
In the example above, `foo` is a function that takes one tuple argument of type `(int, int, int)`.

**Function composition**

To illustrate how function arguments work in FunC, consider a function `bar` of type `int -> (int, int, int)`. Since `foo` expects a single tuple argument, you can pass the entire result of `bar(42)` directly into `foo`:

```func
int x = foo(bar(42));
```

This is equivalent to the longer form:

```func
(int a, int b, int c) = bar(42);
int x = foo(a, b, c);
```



Also Haskell-style calls are possible, but not always (to be fixed later):

FunC also supports **Haskell-style** function application, but with some limitations:

```func
;; Suppose foo has type int -> int -> int -> int
;; i.e., it is curried
(int a, int b, int c) = (1, 2, 3);
int x = foo a b c; ;; Valid syntax
```
However, direct application with literals does not compile:

```func
;; int y = foo 1 2 3; ERROR: won't compile
```

Instead, parentheses are required:

```func
int y = foo (1) (2) (3); ;; Valid syntax
```
### Lambda expressions
Lambda expressions are not yet supported in FunC.

### Methods calls

#### Non-modifying methods

In FunC, a function with at least one argument can be called a non-modifying method using the dot `.` syntax.

For example, the function `store_uint` has the type `(builder, int, int)  → builder`, where:
- The first argument is a builder object.
- The second argument is the value to store.
- The third argument is the bit length.

The function `begin_cell()` creates a new builder.
These two ways of calling `store_uint` are equivalent:

```func
builder b = begin_cell();
b = store_uint(b, 239, 8);
```
```func
builder b = begin_cell();
b = b.store_uint(239, 8);
```

The dot `.` syntax allows the first argument of a function to be placed before the function name, 
simplifying the code further:

```func
builder b = begin_cell().store_uint(239, 8);
```
Multiple non-modifying methods can be chained together:

```func
builder b = begin_cell().store_uint(239, 8)
                        .store_int(-1, 16)
                        .store_uint(0xff, 10);
```




#### Modifying methods

If a function’s first argument is of type `A` and its return value follows the structure `(A, B)`, 
where `B` is an arbitrary type, the function can be used as a modifying method. 

A modifying method modifies its first argument by assigning the first component of the returned value to the original variable. These methods may take additional arguments and return extra values, but their primary purpose is to update the first argument.

For example, consider a cell slice `cs` and the function `load_uint`, which has the type: `load_uint(slice, int) → (slice, int)`.

This function takes a cell slice and a number of bits to load, returning the remaining slice and the loaded value. The following three calls are equivalent:


```func
(cs, int x) = load_uint(cs, 8);
(cs, int x) = cs.load_uint(8);
int x = cs~load_uint(8);
```

Without return values
Sometimes, a function can be used as a modifying method even when it doesn’t return a meaningful value—only modifying its first argument. 
This can be achieved using unit types.

For example, consider an increment function `inc` of type `int -> int`. It should be redefined as a function of type `int -> (int, ())` to use it as a modifying method: 

```func
(int, ()) inc(int x) {
  return (x + 1, ());
}
```

Now, the following code increments `x`:

```func
x~inc();
```

#### `.` and `~` in function names

Suppose we want to use `inc` as a non-modifying method. We can write:

```func
(int y, _) = inc(x);
```

However, we can also define `inc` as a modifying method:

```func
int inc(int x) {
  return x + 1;
}
(int, ()) ~inc(int x) {
  return (x + 1, ());
}
```
Now, we can call it in different ways:
```func
x~inc(); ;; Modifies x
int y = inc(x); ;; Doesn't modify x
int z = x.inc(); ;; Also doesn't modify x
```


**How FunC resolves function calls**
- If a function is called with `.` (e.g., `x.foo()`), the compiler looks for a `.foo` definition.
- If a function is called with `~` (e.g., `x~foo()`), the compiler looks for a `~foo` definition.
- If neither `.foo` nor `~foo` is defined, the compiler falls back to the regular `foo` definition.



### Operators
Note that all the unary and binary operators are currently integer operators. Logical operators are bitwise integer operators (cf. [absence of boolean type](/v3/documentation/smart-contracts/func/docs/types#absence-of-boolean-type)).


#### Unary operators

FunC supports two unary operators:
- `~` is bitwise not (priority 75)
- `-` is integer negation (priority 20)

These operators must be separated from the arguments:
- `- x` - Negates x.
- `-x` - Interpreted as a single identifier, not an operation.

#### Binary operators

With priority 30 (left-associative):

- `*` is integer multiplication
- `/` is integer division (floor)
- `~/` is integer division (round)
- `^/` is integer division (ceil)
- `%` is integer reduction by modulo (floor)
- `~%` is integer reduction by modulo (round)
- `^%` is integer reduction by modulo (ceil)
- `/%` returns the quotient and the remainder
- `&` is bitwise AND

With priority 20 (left-associative):
- `+` is integer addition
- `-` is integer subtraction
- `|` is bitwise OR
- `^` is bitwise XOR

With priority 17 (left-associative):
- `<<` is bitwise left shift
- `>>` is bitwise right shift
- `~>>` is bitwise right shift (round)
- `^>>` is bitwise right shift (ceil)

With priority 15 (left-associative):
- `==` is integer equality check
- `!=` is integer inequality check
- `<` is integer comparison
- `<=` is integer comparison
- `>` is integer comparison
- `>=` is integer comparison
- `<=>` is integer comparison (returns -1, 0 or 1)

They also should be separated from the argument:
- `x + y` -  Proper spacing between operands.
- `x+y` - Interpreted as a single identifier, not an operation.

#### Conditional operator

FunC supports the standard conditional (ternary) operator with the following syntax:
```func
<condition> ? <consequence> : <alternative>
```
For example:
```func
x > 0 ? x * fac(x - 1) : 1;
```
Priority 13.

#### Assignments
Priority 10.

Supports simple assignment `=` and compound assignment operators: `+=`, `-=`, `*=`, `/=`, `~/=`, `^/=`, `%=`, `~%=`, `^%=`, `<<=`, `>>=`, `~>>=`, `^>>=`, `&=`, `|=`, `^=`.



## Loops
FunC supports `repeat`, `while`, and `do { ... } until` loops. The `for` loop is not supported.

### Repeat loop
The `repeat` loop uses the `repeat` keyword followed by an `int`  expression. It executes the code a specified number of times.

**Examples:**
```func
int x = 1;
repeat(10) { ;;Repeats the block 10 times
  x *= 2;
}
;; x = 1024
```
```func
int x = 1, y = 10;
repeat(y + 6) { ;;Repeats the block 16 times
  x *= 2;
}
;; x = 65536
```

If the repetition count is negative, the loop does not execute:
```func
int x = 1;
repeat(-1) {
  x *= 2;
}
;; x = 1
```

A range check exception is thrown if the repetition count is less than `-2³¹` or greater than `2³¹ - 1`.

### While loop

The `while` loop follows standard syntax:

```func
int x = 2;
while (x < 100) {
  x = x * x;
}
;; x = 256
```
Note that the truth value of condition `x < 100` is of type `int` (cf. [absence of boolean type](/v3/documentation/smart-contracts/func/docs/types#absence-of-boolean-type)).


### Until loop

The `do { ... } until` loop has the following syntax:

```func
int x = 0;
do {
  x += 3;
} until (x % 17 == 0);
;; x = 51
```




## If statements

**Examples**

Standard `if` statement:
```func
if (flag) {
  do_something();
}
```

Negated condition, which is equivalent to `if` (`~flag`):
```func

ifnot (flag) {
  do_something();
}
```

`If-else` statement:
```func
if (flag) {
  do_something();
} else {
  do_alternative();
}
```

```func
;; Some specific features
if (flag1) {
  do_something1();
} else {
  do_alternative4();
}
```

Curly brackets `{}` are required for `if` statements. The following code will not compile:
```func
if (flag1)
  do_something();
```

## Try-catch statements
*Available in FunC since v0.4.0*

The `try` block executes a section of code. 
If an error occurs, all changes made within the `try` block are completely rolled back, and the `catch` block is executed instead. The `catch` block receives two arguments:
- `x`: the exception parameter, which can be of any type
- `n`: the error code, an integer


Unlike many other languages, in FunC, all changes are **undone** if an error occurs inside the `try` block. These modifications include updates to local and global variables and changes to storage registers (`c4` for storage, `c5`for action/messages, `c7` for context, etc.). 
Any contract storage updates and outgoing messages are also reverted.

However, certain TVM state parameters are not rolled back, such as:
- Codepage settings
- Gas counters
As a result, all gas consumed within the `try` block is still accounted for, and any operations that modify gas limits (e.g., `accept_message` or `set_gas_limit`) will remain in effect.

**Exception parameter handling**

Since the exception parameter can be of any type, which may vary depending on the exception, FunC cannot determine its type at compile time. This requires the developer to manually cast the exception parameter when necessary, as shown in the type-casting example below.


**Examples**

Basic `try-catch` usage:
```func
try {
  do_something();
} catch (x, n) {
  handle_exception();
}
```

Casting the exception parameter:
```func
forall X -> int cast_to_int(X x) asm "NOP";
...
try {
  throw_arg(-1, 100);
} catch (x, n) {
  x.cast_to_int();
  ;; x = -1, n = 100
  return x + 1;
}
```

Variable reset on exception:
```func
int x = 0;
try {
  x += 1;
  throw(100);
} catch (_, _) {
}
```

In this last example, although `x` is incremented inside the `try` block, the modification is **rolled back** due to the exception, so `x` remains `0`.

## Block statements

Block statements are supported as well, creating a new nested scope:
```func
int x = 1;
builder b = begin_cell();
{
  builder x = begin_cell().store_uint(0, 8);
  b = x;
}
x += 1;
```

In this example, the inner block introduces a new `builder` variable named `x`, which exists only within that scope. 
The outer `x` remains unchanged and can be used after the block ends.

<Feedback />

