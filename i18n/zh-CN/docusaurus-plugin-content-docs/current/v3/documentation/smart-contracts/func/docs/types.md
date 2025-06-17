import Feedback from '@site/src/components/Feedback';

# 类型

:::info

FunC 文档最初由 [@akifoq](https://github.com/akifoq) 编写。

:::

FunC includes several built-in types that serve as the foundation of the language.

## 原子类型

- `int` 是 257 位有符号整数的类型。默认情况下，启用溢出检查，会导致整数溢出异常。 Overflow checks are enabled by default and trigger an exception if exceeded.

- `cell` 是 TVM cell的类型。TON 区块链中的所有持久数据都存储在cell树中。每个cell最多有 1023 位任意数据和最多四个对其他cell的引用。cell在基于堆栈的 TVM 中用作内存。 Data is organized in trees of cells, with each cell containing up to 1023 bits of arbitrary data and up to four references to other cells. Cells function as memory units in stack-based TVMs.

- `slice` is a read-only view of a cell that allows sequential access to its data and references. A cell can be converted into a slice, extracting stored bits and references without modifying the original cell.

- `builder` 是cell构建器的类型。数据位和对其他cell的引用可以存储在构建器中，然后构建器可以最终化为新cell。

- `tuple` 是 TVM 元组的类型。元组是有序集合，最多包含 255 个组件，这些组件的值类型可能不同。

- `cont` 是 TVM continuation的类型。Continuations 用于控制 TVM 程序执行的流程。从 FunC 的角度来看，它是相当低层级的对象，尽管从概念上讲相当通用。 Although a low-level construct, it provides flexible execution control.

请注意，上述任何类型都只占用 TVM 堆栈中的单个条目。

### 没有布尔类型

FunC does not have a dedicated boolean type.
Instead, booleans are represented as integers:

- `false` is `0`, `true` is `-1` (a 257-bit integer with all bits set to 1).
- Logical operations are performed using bitwise operations.
- In conditional checks, any nonzero integer is treated as `true`.

### Null值

通过 TVM 类型 `Null` 的值 `null`，FunC 表示某些原子类型的值缺失。标准库中的一些原语可能被类型化为返回原子类型，并在某些情况下实际返回 `null`。其他原语可能被类型化为接受原子类型的值，但也可以与 `null` 值一起正常工作。这种行为在原语规范中明确说明。默认情况下，禁止 `null` 值，这会导致运行时异常。 While `null` is generally not allowed, some standard library functions handle it in specific ways:

- Some functions that return an atomic type may return `null` in some instances.
- Others may expect an atomic type as input but can also accept `null` without errors.
- This behavior is explicitly defined in the function specification.
  By default, `null` values are not permitted and will cause a runtime exception.

Additionally, an atomic type `A` can be implicitly transformed into `A^?` (also known as `Maybe A`),
allowing a variable of type `A` to store either a valid value or `null`.
This transformation happens automatically and is not enforced by the type checker.

## Hole类型

FunC 有以下内置类型。 Types `_` and `var` represent type "holes" which can later be filled with some actual type during type checking. For example, `var x = 2;` is a definition of variable `x` equal to `2`. The type checker can infer that `x` has type `int`, because `2` has type `int`, and the left and right sides of the assignment must have equal types.

FunC supports type inference. The hole types `_` and `var` serve as placeholders that are resolved during type checking.
For example, in the declaration:

```func
var x = 2;
```

The type checker determines that `x` is of type `int` since `2` is an `int`,
and both sides of the assignment must have matching types.

## 复合类型

类型可以组合成更复杂的类型。

### 函数类型

A functional type is written in the form `A -> B`, where:

- `A` is the input type, which is called domain.
- `B` is the output type, which is called codomain.

**Example:**
The type `int -> cell` represents a function that:

- Takes an integer as input.
- Returns a TVM cell as output.

在内部，这种类型的值被表示为continuations。

### 元组类型

形式为 `(A, B, ...)` 的类型本质上表示有序的值集合，这些值的类型为 `A`、`B`、`...`，它们一起占用多个 TVM 堆栈条目。
These types occupy multiple TVM stack entries, unlike atomic types, which use a single entry.

**Example:**

例如，如果函数 `foo` 的类型为 `int -> (int, int)`，这意味着该函数接受一个整数并返回一对整数。
调用此函数可能看起来像 `(int a, int b) = foo(42);`。在内部，该函数消耗一个堆栈条目并留下两个。
Internally, the function consumes one stack entry and produces two.

请注意，从低层级角度来看，类型 `(int, (int, int))` 的值 `(2, (3, 9))` 和类型 `(int, int, int)` 的值 `(2, 3, 9)`，在内部以三个堆栈条目 `2`、`3` 和 `9` 的形式表示。对于 FunC 类型检查器，它们是**不同**类型的值。例如，代码 `(int a, int b, int c) = (2, (3, 9));` 将无法编译。
For instance, the following code **will not compile**:

```func
(int a, int b, int c) = (2, (3, 9));
```

Since FunC strictly enforces type consistency, these structures cannot be mixed.

**Special case: unit type`()`**

The unit type `()` is used to indicate that:

- A function does not return a value or
- A function takes no arguments

**Examples**

- `print_int` has the type `int -> ()`, meaning it takes an integer but returns nothing.
- random has the type `() -> int`, meaning it takes no arguments but returns an integer.
- The unit type `()` has a single value, also written as `()`, occupying **zero stack** entries.

类型 `(A)` 被类型检查器视为与 `A` 相同的类型。

这样，原子类型 `A` 可能被隐式转换为类型 `A^?`，也就是 `Maybe A`（类型检查器对这种转换无感知）。

### 张量类型

形式为 `[A, B, ...]` 的类型表示在编译时已知长度和组件类型的 TVM 元组。例如，`[int, cell]` 是一个元组类型，其长度恰好为 2，其中第一个组件是整数，第二个是cell。`[]` 是空元组的类型（具有唯一的inhabitant——空元组）。请注意，与cell类型 `()` 相反，`[]` 的值占用一个堆栈条目。

For example, `[int, cell]` defines a tuple with exactly two elements:

- The first element is an integer.
- The second element is a cell.

The type `[]` represents an empty tuple with a unique value—the empty tuple itself.

**Note:** unlike the unit type `()`, an empty tuple `[]` occupies one stack entry.

## 带有类型变量的多态

FunC拥有支持多态函数的 Miller-Rabin 类型系统。例如，以下是一个函数：
For example, consider the following function:

```func
forall X -> (X, X) duplicate(X value) {
  return (value, value);
}
```

is a polymorphic function which takes a (single stack entry) value and returns two copies of this value. 是一个多态函数，它接受一个（单堆栈条目）值并返回这个值的两个副本。`duplicate(6)` 将产生值 `6 6`，而 `duplicate([])` 将产生两个空元组 `[] []` 的副本。

This **polymorphic function** takes a single stack entry and returns two copies of the input value.

- Calling `duplicate(6)` produces `6 6`.
- Calling `duplicate([])` produces two copies of an empty tuple: `[] []`.

在这个例子中，`X` 是一个类型变量。

有关此主题的更多信息，请参阅[函数](/develop/func/functions#polymorphism-with-forall)部分。

## 用户定义类型

目前，FunC 不支持定义除上述类型构造之外的类型。

## 类型宽度

Every value in FunC occupies a certain number of stack entries.
If this number is consistent for all values of a given type, it is called the **type width**.
At the moment, polymorphic functions can only be defined for types with a fixed and predefined type width.

<Feedback />

