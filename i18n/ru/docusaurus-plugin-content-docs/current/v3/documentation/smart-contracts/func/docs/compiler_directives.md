import Feedback from '@site/src/components/Feedback';

# Директивы компилятора

Это ключевые слова, которые начинаются с `#` и предписывают компилятору выполнить некоторые действия, проверки или изменить параметры.

Эти директивы можно использовать только на самом внешнем уровне (не внутри определения какой-либо функции).

## #include

Директива `#include` позволяет включить другой файл исходного кода FunC, который будет проанализирован вместо include.

**Syntax:**

```func
Синтаксис: `#include "filename.fc";`.
```

Files are automatically checked for multiple inclusions. By default, the compiler will ignore redundant inclusions if the same file is included more than once. A warning will be issued if the verbosity level is 2 or higher.

Если во время анализа включенного файла происходит ошибка, дополнительно выводится стек включений с расположением
каждого включенного файла в цепочке.

## #pragma

Директива `#pragma` используется для предоставления компилятору дополнительной информации, выходящей за рамки того, что передает сам язык.

### #pragma version

Pragma Version используется для принудительного применения определенной версии компилятора FunC при компиляции файла.

Версия указывается в формате semver, то есть _a.b.c_, где _a_ — основная версия, _b_ — дополнительная, а _c_ — патч.

- _a_ is the major version;
- _b_ is the minor version;
- _c_ is the patch version.

**Supported comparison operators**

Developers can specify version constraints using the following operators:

- _a.b.c_ или _=a.b.c_ — требует именно _a.b.c_ версию компилятора
- _>a.b.c_ — требует, чтобы версия компилятора была выше _a.b.c_,
  - _>=a.b.c_ — требует, чтобы версия компилятора была выше или равна _a.b.c_
- _\<a.b.c_ — требует, чтобы версия компилятора была ниже _a.b.c_,
  - _\<=a.b.c_ — требует, чтобы версия компилятора была ниже или равна _a.b.c_
- _^a.b.c_ — требует, чтобы основная версия компилятора была равна части `a`, а второстепенная — не ниже части `b`,
  - _^a.b_ — требует, чтобы основная версия компилятора была равна части _a_, а второстепенная — не ниже части _b_
  - _^a_ — требует, чтобы основная версия компилятора была не ниже части _a_

For comparison operators (_=_, _>_, _>=_, _\<_, _\<=_) , omitted parts default to zero.
For example:

- _>a.b_ совпадает с _>a.b.0_ (и поэтому НЕ соответствует версии _a.b.0_)
- _\<=a_ совпадает с _\<=a.0.0_ (и поэтому НЕ соответствует версии _a.0.1_)
- _^a.b.0_ **НЕ** совпадает с _^a.b_

**Examples:**

- Например, _^a.1.2_ совпадает с _a.1.3_ но не _a.2.3_ или _a.1.0_, однако _^a.1_ соответствует им всем.
- _^a.1_ matches all of them.

Эту директиву можно использовать несколько раз; версия компилятора должна удовлетворять всем предоставленным условиям.

### #pragma not-version

The syntax of `#pragma not-version` is identical to `#pragma version`, but it fails if the specified condition is met.

This directive is applicable for blocking specific compiler versions known to have issues.

### #pragma allow-post-modification

_funC v0.4.1_

По умолчанию запрещено использовать переменную до ее изменения в том же выражении.

For example, the following code **will not compile**:

```func
(x, y) = (ds, ds~load_uint(8))
```

However, this version is **valid**:

```func
Другими словами, выражение `(x, y) = (ds, ds~load_uint(8))` не будет скомпилировано, в то время как `(x, y) = (ds~load_uint(8), ds)` допустимо.
```

To override this restriction, use `#pragma allow-post-modification`. This allows variables to be modified after usage in mass assignments and function calls while sub-expressions are still computed **left to right**.

In the following example, `x` will contain the initial value of `ds`:

```func
Это правило может быть заменено `#pragma allow-post-modification`, которое позволяет изменять переменную после использования в массовых назначениях и вызовах функций; как обычно, вложенные выражения будут вычисляться слева направо: `(x, y) = (ds, ds~load_bits(8))` приведет к `x`, содержащему начальную `ds`; `f(ds, ds~load_bits(8))` первый аргумент `f` будет содержать начальную `ds`, а второй - 8 бит `ds`.
```

Here, in `f(ds, ds~load_bits(8));`:

- The first argument of `f` will contain the initial value of `ds`.
- The second argument will contain the 8-bit-modified value of `ds`.

`#pragma allow-post-modification` работает только для кода после директивы.

### #pragma compute-asm-ltr

_funC v0.4.1_

`asm` declarations can override the order of argument evaluation. For example, in the following expression:

```func
idict_set_ref(ds~load_dict(), ds~load_uint(8), ds~load_uint(256), ds~load_ref())
```

The execution order is:

1. `load_ref()`
2. `load_uint(256)`
3. `load_dict()`
4. `load_uint(8)`

This happens due to the corresponding `asm` declaration:

```func
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
```

Here, the `asm(value index dict key_len)` notation dictates a reordering of arguments.

Это поведение можно изменить на строгий порядок вычислений слева направо с помощью `#pragma compute-asm-ltr` With this directive enabled, the same function call:

```func
#pragma compute-asm-ltr
...
idict_set_ref(ds~load_dict(), ds~load_uint(8), ds~load_uint(256), ds~load_ref());
```

will be evaluated in the following order:

1. `load_dict()`
2. `load_uint(8)`
3. `load_uint(256)`
4. `load_ref()`

порядок разбора будет `load_dict()`, `load_uint(8)`, `load_uint(256)`, `load_ref()` и все перестановки asm будут происходить после вычислений.

`#pragma compute-asm-ltr` работает только для кода после директивы.

**Note:** `#pragma compute-asm-ltr` applies only to the code after the directive in the file. <Feedback />

