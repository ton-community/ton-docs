# Statements
This sections briefly discusses FunC statements, constituting the code of ordinary functions bodies.

## Expression statements
The most common type of statements is expression statement. It's an expression followed by `;`. Expressions description would be quite complicated, so only a sketch is presented here.

### Variable declaration
It is not possible to declare a local variable without defining its initial value.

Here are some examples of variables declarations:
```cpp
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

Variable can be "redeclared" in the same scope. For example, this is a correct code:
```cpp
int x = 2;
int y = x + 1;
int x = 3;
```
Actually the second occurrence of `int x` is not a declaration, but just a compile-time insurance that `x` has type `int`. So the third line is essentially equivalent to simple assignment `x = 3;`.

And in nested scopes a variable can be truly redeclared just like in C language. For example, consider the code:
```cpp
int x = 0;
int i = 0;
while (i < 10) {
  (int, int) x = (i, i + 1);
  ;; here x is a variable of type (int, int)
  i += 1;
}
;; here x is a (different) variable of type int
```
But as mentioned in global variables [section](/develop/func/global_variables.md), global variable can't be redeclared.

Note that variable declaration **is** an expression statement, so actually constructions like `int x = 2` are full-fledged expressions. For example, this is a correct code:
```cpp
int y = (int x = 3) + 1;
```
It is a declaration of two variables `x` and `y`, equal to `3` and `4` correspondingly.
#### Underscore
Underscore `_` is used when a value is not needed. For example, suppose a function `foo` has type `int -> (int, int, int)`. We can get the first returned value and ignore the second and third like this:
```cpp
(int fst, _, _) = foo(42);
```
### Function application
A call of a function looks like as such in a conventional language: arguments of the function call are listed after the function name, separated by commas.
```cpp
;; suppose foo has type (int, int, int) -> int
int x = foo(1, 2, 3);
```

But notice that `foo` is actually a function of **one** argument of type `(int, int, int)`. To see the difference, suppose `bar` is a function of type `int -> (int, int, int)`. Unlike in conventional languages, you can compose the functions like that:
```cpp
int x = foo(bar(42));
```
instead of equivalent, but more lengthy form:
```cpp
(int a, int b, int c) = bar(42);
int x = foo(a, b, c);
```

Also Haskell-style calls are possible, but not always (to be fixed later):
```cpp
;; suppose foo has type int -> int -> int -> int
;; i.e. it's carried
(int a, int b, int c) = (1, 2, 3);
int x = foo a b c; ;; ok
;; int y = foo 1 2 3; wouldn't compile
int y = foo (1) (2) (3); ;; ok
```
### Lambda expressions
Lambda expressions are not supported yet.
### Methods calls

#### Non-modifying methods
If a function has at least one argument, it can be called as a non-modifying method. For example, `store_uint` has type `(builder, int, int) -> builder` (the second argument is value to store, and the third is the bit length). `begin_cell` is a function that creates a new builder. The following codes are equivalent:
```cpp
builder b = begin_cell();
b = store_uint(b, 239, 8);
```
```cpp
builder b = begin_cell();
b = b.store_uint(239, 8);
```
So the first argument of a function can be passed to it being located before the function name, if separated by `.`. The code can be further simplified:
```cpp
builder b = begin_cell().store_uint(239, 8);
```
Multiple calls of methods are also possible:
```cpp
builder b = begin_cell().store_uint(239, 8)
                        .store_int(-1, 16)
                        .store_uint(0xff, 10);
```
#### Modifying methods
If the first argument of a function has type `A` and return value of the function has the shape of `(A, B)` where `B` is some arbitrary type, then the function can be called as modifying method. Modifying methods calls may take some arguments and return some values, but they modify their first argument, that is, assign the first component of returned value to the variable from the first argument. For example, suppose `cs` is a cell slice and `load_uint` has type `(slice, int) -> (slice, int)`: it takes a cell slice and number of bits to load and returns the remainder of slice and the loaded value. The following codes are equivalent:
```cpp
(cs, int x) = load_uint(cs, 8);
```
```cpp
(cs, int x) = cs.load_uint(8);
```
```cpp
int x = cs~load_uint(8);
```
In some cases we want to use a function as modifying method that doesn't return any value – only modifies the first argument. It can be done using unit type as following: suppose we want to define function `inc` of type `int -> int`, which increment an integer, and use it as modifying method. Then we should define `inc` as a function of type `int -> (int, ())`:
```cpp
(int, ()) inc(int x) {
  return (x + 1, ());
}
```
When defined like that, it can be used as modifying method:
```cpp
x~inc();
```
will increment `x`.
#### `.` and `~` in function names
Suppose we want to use `inc` as non-modifying method too. We can write something like that:
```cpp
(int y, _) = inc(x);
```
But it is possible to override the definition of `inc` as modifying method:
```cpp
int inc(int x) {
  return x + 1;
}
(int, ()) ~inc(int x) {
  return (x + 1, ());
}
```
and then call it like that:
```cpp
x~inc();
int y = inc(x);
int z = x.inc();
```
The first call will modify x, the second and the third won't.

In summary, when a function with name `foo` is called as non-modifying or modifying method (i.e. with `.foo` or `~foo` syntax), FunC compiler use the definition of `.foo` or `~foo` correspondingly if such definition is presented, and if not, it uses the definition of `foo`.

### Operators
Note that currently all of unary and binary operators are integer operators. Logical operators are represented as bitwise integer operators  (cf. [absene of boolean type](/develop/func/types#absence-of-boolean-type)).
#### Unary operators
There are two unary operators:
- `~` is bitwise not (priority 75).
- `-` is integer negation (priority 20).

They should be separated from the argument.
- `- x` is ok.
- `-x` is not ok (it's a single identifier).

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
- `x + y` is ok.
- `x+y` is not ok (it's a single identifier).

#### Conditional operator
Has the usual syntax:
```cpp
<condition> ? <consequence> : <alternative>
```
For example,
```cpp
x > 0 ? x * fac(x - 1) : 1;
```
It has priority 13.

#### Assignments
Priority 10.

Simple assignment `=` and counterparts of binary operations: `+=`, `-=`, `*=`, `/=`, `~/=`, `^/=`, `%=`, `~%=`, `^%=`, `<<=`, `>>=`, `~>>=`, `^>>=`, `&=`, `|=`, `^=`.

## Loops
FunC supports `repeat`, `while` and `do { ... } until` loops. `for` loop is not supported.
### Repeat loop
The syntax is a `repeat` keyword followed by an expression of type `int`. Repeats the code for specified number of times. Examples:
```cpp
int x = 1;
repeat(10) {
  x *= 2;
}
;; x = 1024
```
```cpp
int x = 1, y = 10;
repeat(y + 6) {
  x *= 2;
}
;; x = 65536
```
```cpp
int x = 1;
repeat(-1) {
  x *= 2;
}
;; x = 1
```
If the number of times is less than `-2^31` or greater than `2^31 - 1`, range check exception is thrown.
### While loop
Has the usual syntax. Example:
```cpp
int x = 2;
while (x < 100) {
  x = x * x;
}
;; x = 256
```
Note that the truth value of condition `x < 100` is of type `int` (cf. [absene of boolean type](/develop/func/types#absence-of-boolean-type)).

### Until loop
Has the following syntax:
```cpp
int x = 0;
do {
  x += 3;
} until (x % 17 == 0);
;; x = 51
```
## If statements
Examples:
```cpp
;; usual if
if (flag) {
  do_something();
}
```
```cpp
;; equivalent to if (~ flag)
ifnot (flag) {
  do_something();
}
```
```cpp
;; usual if-else
if (flag) {
  do_something();
}
else {
  do_alternative();
}
```
```cpp
;; Some specific features
if (flag1) {
  do_something1();
} else {
  do_alternative4();
}
```
The curly brackets are necessary. That code wouldn't be compiled:
```cpp
if (flag1)
  do_something();
```

## Block statements
Block statements are also allowed. They open a new nested scope:
```cpp
int x = 1;
builder b = begin_cell();
{
  builder x = begin_cell().store_uint(0, 8);
  b = x;
}
x += 1;
```
