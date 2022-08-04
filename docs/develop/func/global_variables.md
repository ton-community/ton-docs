# Global variables
FunC program is essentially a list of function declarations/definitions and global variable declarations. This section covers the second topic.

Global variable can be declared with `global` keyword followed by variable type and variable name. For example,
```
global ((int, int) -> int) op;

int check_assoc(int a, int b, int c) {
  return op(op(a, b), c) == op(a, op(b, c));
}

int main() {
  op = _+_;
  return check_assoc(2, 3, 9);
}
```
is a simple program that writes to a global functional variable `op` the addition operator `_+_` and checks the associativity of addition on three sample integers 2, 3 and 9.

Internally global variables are stored in the c7 control register of TVM.

Type of a global variable can be omitted. If so, it will be inferred by the usage of the variable. For example, we can rewrite the program as:
```
global op;

int check_assoc(int a, int b, int c) {
  return op(op(a, b), c) == op(a, op(b, c));
}

int main() {
  op = _+_;
  return check_assoc(2, 3, 9);
}
```

It is possible to declare several variables after the same `global` keyword. The following codes are equivalent:
```
global int A;
global cell B;
global C;
```
```
global int A, cell B, C;
```

It is not allowed to declare some local variable with the same name as an already declared global variable. For example, this code wouldn't compile:
```
global cell C;

int main() {
  int C = 3;
  return C;
}
```
Note that this code is correct:
```
global int C;

int main() {
  int C = 3;
  return C;
}
```
but here `int C = 3;` is equivalent to `C = 3;`, i.e. that is an assignment to global variable `C`, not a declaration of local variable `C` (you can find some explanation of this effect in [statements](/develop/func/statements.md?id=variable-declaration)).
