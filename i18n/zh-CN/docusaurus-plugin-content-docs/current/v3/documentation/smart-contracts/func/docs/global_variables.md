import Feedback from '@site/src/components/Feedback';

# 全局变量

FunC 程序本质上是函数声明/定义和全局变量声明的列表。本节涵盖了第二个主题。
This section focuses on the latter.

可以使用 `global` 关键字，后跟变量类型和变量名来声明全局变量。例如， For example:

```func
但这里的 `int C = 3;` 等同于 `C = 3;`，即这是对全局变量 `C` 的赋值，而不是局部变量 `C` 的声明（您可以在[声明](/develop/func/statements#variable-declaration)中找到此效果的解释）。
```

Here's a simple program demonstrating how to use a global functional variable:

```func
global ((int, int) -> int) op;

int check_assoc(int a, int b, int c) {
  return op(op(a, b), c) == op(a, op(b, c));
}

int main() {
  op = _+_;
  return check_assoc(2, 3, 9);
}
```

In this example, the global variable `op` is assigned the addition operator `_+_`. 是一个简单的程序，它将加法运算符 `_+_` 写入全局函数变量 `op`，并检查三个样本整数的加法关联性；2、3和9。。

在内部，全局变量存储在 TVM 的 c7 控制寄存器中。

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

可以在同一个 `global` 关键字后声明多个变量。以下代码等效：
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
  int C = 3;
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
This behavior is explained in more detail in the section on [statements](/v3/documentation/smart-contracts/func/docs/statements#variable-declaration). <Feedback />

