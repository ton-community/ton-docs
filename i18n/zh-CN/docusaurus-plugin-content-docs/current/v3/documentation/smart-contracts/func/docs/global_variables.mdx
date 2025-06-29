# 全局变量

FunC 程序本质上是函数声明/定义和全局变量声明的列表。本节涵盖了第二个主题。

可以使用 `global` 关键字，后跟变量类型和变量名来声明全局变量。例如，

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

是一个简单的程序，它将加法运算符 `_+_` 写入全局函数变量 `op`，并检查三个样本整数的加法关联性；2、3和9。。

在内部，全局变量存储在 TVM 的 c7 控制寄存器中。

可以省略全局变量的类型。如果省略，将根据变量的使用推断类型。例如，我们可以重写程序如下：

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

可以在同一个 `global` 关键字后声明多个变量。以下代码等效：

```func
global int A;
global cell B;
global C;
```

```func
global int A, cell B, C;
```

不允许声明与已声明的全局变量同名的局部变量。例如，此代码将无法编译：

```func
global cell C;

int main() {
  int C = 3;
  return C;
}
```

请注意，以下代码是正确的：

```func
global int C;

int main() {
  int C = 3;
  return C;
}
```

但这里的 `int C = 3;` 等同于 `C = 3;`，即这是对全局变量 `C` 的赋值，而不是局部变量 `C` 的声明（您可以在[声明](/develop/func/statements#variable-declaration)中找到此效果的解释）。
