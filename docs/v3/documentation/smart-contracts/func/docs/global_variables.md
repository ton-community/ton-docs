import Feedback from '@site/src/components/Feedback';

# Global variables

A FunC program primarily consists of function declarations/definitions and global variable declarations. 
This section focuses on the latter.

**A global variable** is declared using the `global` keyword, followed by the variable's type and name. For example:

```func
global ((int, int) -> int) op;
```
Here's a simple program demonstrating how to use a global functional variable:

```func
int check_assoc(int a, int b, int c) {
  return op(op(a, b), c) == op(a, op(b, c));
}

int main() {
  op = _+_;
  return check_assoc(2, 3, 9);
}
```

In this example, the global variable `op` is assigned the addition operator `_+_`. The program then verifies the associativity of addition using three sample integers: 2, 3, and 9.

Under the hood, global variables in FunC are stored in the `c7` control register of the TVM.


In FunC, you can _omit the type_ of global variable. 
In this case, the compiler determines the type based on how the variable is used. 
For example, you can rewrite the previous program like this:

```func
global op;

int check_assoc(int a, int b, int c) {
  return op(op(a, b), c) == op(a, op(b, c));
}

int main() {
  op = _+_;
  return check_assoc(2, 3, 9);
}
```

**Declaring multiple global variables**

FunC allows users to declare multiple global variables using a single `global` keyword. 
The following examples are equivalent:

```func
global int A;
global cell B;
global C;
```
```func
global int A, cell B, C;
```

**Restrictions on global and local variable names**

A local variable **cannot** have the same name as a previously declared global variable. The following example is invalid and will not compile:

```func
global cell C;

int main() {
  int C = 3; ;; Error: cannot declare a local variable with the same name as a global variable
  return C;
}
```
However, the following example is valid:

```func
global int C;

int main() {
  int C = 3;
  return C;
}
```

In this case, `int C = 3;` is not declaring a new local variable 
but instead assigning value `3` to the global variable `C`. 
This behavior is explained in more detail in the section on [statements](/v3/documentation/smart-contracts/func/docs/statements#variable-declaration).
<Feedback />

