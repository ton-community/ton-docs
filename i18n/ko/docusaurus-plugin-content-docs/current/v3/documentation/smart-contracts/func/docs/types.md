import Feedback from '@site/src/components/Feedback';

# 타입

:::info

FunC documentation was initially written by _[@akifoq](https://github.com/akifoq/)_.

:::

FunC includes several built-in types that serve as the foundation of the language.

## 원자적 타입

- `int` is a 257-bit signed integer type. Overflow checks are enabled by default and trigger an exception if exceeded.

- `cell` is a TVM cell type used to store persistent data in the TON Blockchain. Data is organized in trees of cells, with each cell containing up to 1023 bits of arbitrary data and up to four references to other cells. Cells function as memory units in stack-based TVMs.

- `slice` is a read-only view of a cell that allows sequential access to its data and references. A cell can be converted into a slice, extracting stored bits and references without modifying the original cell.

- `builder` is a mutable structure used to construct cells by adding data and references before finalizing them into a new cell.

- `tuple` is an ordered collection of up to 255 elements, each capable of holding a value of any type.

- `cont` is a TVM continuation used to manage execution flow in TVM programs. Although a low-level construct, it provides flexible execution control.

Each of these types occupies a single slot in the TVM stack.

### No boolean type

FunC does not have a dedicated boolean type.
Instead, booleans are represented as integers:

- `false` is `0`, `true` is `-1` (a 257-bit integer with all bits set to 1).
- Logical operations are performed using bitwise operations.
- In conditional checks, any nonzero integer is treated as `true`.

### Null 값

In FunC, the `null` value of the TVM type `Null` represents the absence of a value for a given atomic type. While `null` is generally not allowed, some standard library functions handle it in specific ways:

- Some functions that return an atomic type may return `null` in some instances.
- Others may expect an atomic type as input but can also accept `null` without errors.
- This behavior is explicitly defined in the function specification.
  By default, `null` values are not permitted and will cause a runtime exception.

Additionally, an atomic type `A` can be implicitly transformed into `A^?` (also known as `Maybe A`),
allowing a variable of type `A` to store either a valid value or `null`.
This transformation happens automatically and is not enforced by the type checker.

## 홀 타입

FunC는 타입 추론을 지원합니다. `_`와 `var` 타입은 타입 체크 중에 나중에 실제 타입으로 채워질 수 있는 타입 "홀"을 나타냅니다. 예를 들어, `var x = 2;`는 `2`와 같은 변수 `x`의 정의입니다. `2`가 `int` 타입을 가지고 있고 할당의 왼쪽과 오른쪽은 같은 타입을 가져야 하기 때문에, 타입 체커는 `x`가 `int` 타입을 가진다고 추론할 수 있습니다.

FunC supports type inference. The hole types `_` and `var` serve as placeholders that are resolved during type checking.
For example, in the declaration:

```func
var x = 2;
```

The type checker determines that `x` is of type `int` since `2` is an `int`,
and both sides of the assignment must have matching types.

## 복합 타입

Types can be combined to form more complex structures.

### 함수 타입

A functional type is written in the form `A -> B`, where:

- `A` is the input type, which is called domain.
- `B` is the output type, which is called codomain.

**Example:**
The type `int -> cell` represents a function that:

- Takes an integer as input.
- Returns a TVM cell as output.

Internally, values of functional types are represented as **continuations**.

### 텐서 타입

Tensor types represent ordered collections of values and are written in the form `(A, B, ...)`.
These types occupy multiple TVM stack entries, unlike atomic types, which use a single entry.

**Example:**

If a function `foo` has the type `int -> (int, int)`,
it takes one integer as input and returns a pair of integers as output.
A call to this function may look like: `(int a, int b) = foo(42);`.
Internally, the function consumes one stack entry and produces two.

**Type representation**
Although the values `(2, (3, 9))` of type `(int, (int, int))` and `(2, 3, 9)` of type `(int, int, int)` are stored identically as three stack entries `(2, 3, and 9)`, FunC treats them as distinct types.
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

`(A)` 형태의 타입은 타입 체커에 의해 `A`와 동일한 타입으로 간주됩니다.

**Note:** A type written as `(A)` is treated as identical to `A` by the FunC type checker.

### 튜플 타입

Tuple types in FunC are written in the form `[A, B, ...]` and represent TVM tuples with a fixed length and known component types at compile time.

For example, `[int, cell]` defines a tuple with exactly two elements:

- The first element is an integer.
- The second element is a cell.

The type `[]` represents an empty tuple with a unique value—the empty tuple itself.

**Note:** unlike the unit type `()`, an empty tuple `[]` occupies one stack entry.

## 타입 변수를 사용한 다형성

FunC features a  **Miller-Rabin-type system** with support for polymorphic functions.
For example, consider the following function:

```func
forall X -> (X, X) duplicate(X value) {
  return (value, value);
}
```

는 (단일 스택 항목) 값을 받아 이 값의 두 복사본을 반환하는 다형성 함수입니다. `duplicate(6)`은 값 `6 6`을 생성하고, `duplicate([])`는 빈 튜플의 두 복사본 `[] []`을 생성합니다.

This **polymorphic function** takes a single stack entry and returns two copies of the input value.

- Calling `duplicate(6)` produces `6 6`.
- Calling `duplicate([])` produces two copies of an empty tuple: `[] []`.

In this example, `X` is a type variable that allows the function to operate on values of any type.

For more details, see the [Functions](/v3/documentation/smart-contracts/func/docs/functions#polymorphism-with-forall) section.

## 사용자 정의 타입

Currently, FunC does not support defining custom types beyond the type constructions described above.

## 타입 너비

Every value in FunC occupies a certain number of stack entries.
If this number is consistent for all values of a given type, it is called the **type width**.
At the moment, polymorphic functions can only be defined for types with a fixed and predefined type width.

<Feedback />

