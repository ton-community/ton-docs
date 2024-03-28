# 使用toncli

:::tip 初学者提示
如果您之前没有使用过toncli，请尝试[快速入门指南](https://github.com/disintar/toncli/blob/master/docs/quick_start_guide.md)。
:::

## 使用toncli进行测试

`toncli`使用FunC来测试智能合约。此外，最新版本支持Docker，用于快速环境设置。

本教程将帮助您测试智能合约的功能，以确保项目正常工作。

描述使用toncli进行测试的最佳教程是：
* [FunC测试如何工作？](https://github.com/disintar/toncli/blob/master/docs/advanced/func_tests_new.md)
* [如何用toncli调试交易？](https://github.com/disintar/toncli/blob/master/docs/advanced/transaction_debug.md)

## 在toncli下的FunC测试结构

为了测试我们的智能合约，我们需要编写2个函数。其中一个接受值，包含期望的结果，并在被测试的函数不正确工作时给出错误。

### 让我们创建一个包含测试的文件

在`tests`文件夹中创建名为`example.func`的文件，在其中编写我们的测试。

### 数据函数

通常，测试函数不接受参数，但必须返回它们。

* **函数选择器** - 测试合约中被调用函数的id；
* **元组** - （栈）我们将传递给执行测试的函数的值；
* **c4 cell** - 控制寄存器c4中的"永久数据"；
* **c7元组** - 控制寄存器c7中的"临时数据"；
* ** gas 限制整数** -  gas 限制（要理解 gas 的概念，我建议您首先阅读以太坊中的相关内容）；

:::info 关于 gas 
 gas 是一个值，显示智能合约在执行时花费了多少资源。因此，它越小越好。

您可以详细阅读[这里](https://ton-blockchain.github.io/docs/#/smart-contracts/fees)。完整细节在[附录A](https://ton-blockchain.github.io/docs/tvm.pdf)。

关于寄存器c4和c7的更多信息[这里](https://ton-blockchain.github.io/docs/tvm.pdf)在1.3.1
:::

## 让我们开始为我们的智能合约编写测试

### 介绍

在新测试中，测试是通过两个函数进行的，这些函数允许调用智能合约方法：

* `invoke_method`，假设不会抛出异常
* `invoke_method_expect_fail`，假设会抛出异常

这些是测试函数内的函数，可以返回任意数量的值，所有这些值都将在运行测试时显示在报告中。

:::info 重要！
值得注意的是，每个测试函数名称必须以`_test`开头。
:::

### 创建测试函数

让我们称我们的测试函数为`__test_example()`，它将返回消耗的 gas 量，因此它是`int`。

```js
int __test_example() {

}
```

### 更新寄存器c4

由于我们将进行大量测试，需要频繁更新`c4`寄存器，因此我们将创建一个辅助函数，它将将`c4`写为零

```js
() set_default_initial_data() impure {
  set_data(begin_cell().store_uint(0, 64).end_cell());
}
```

* `begin_cell()` - 将为未来的 cell创建一个构造器
* `store_uint()` - 写入总量的值
* `end_cell()`- 创建cell
* `set_data()` - 将cell写入寄存器c4

`impure`是一个关键词，表示该函数更改了智能合约数据。

我们得

到一个将在测试函数主体中使用的函数

**结果：**

```js
int __test_example() {
	set_default_initial_data();

}
```

### 测试方法

值得注意的是，在新版本的测试中，我们有能力在测试函数中调用几个智能合约方法。

在我们的测试中，我们将调用`recv_internal()`方法和Get方法，所以我们将通过消息增加c4中的值，并立即检查该值是否已更改为发送的值。

要调用`recv_internal()`方法，我们需要创建一个带有消息的cell。

```js
int __test_example() {
	set_default_initial_data();
	cell message = begin_cell().store_uint(10, 32).end_cell();
}
```

此后，我们将使用`invoke_method`方法。

这个方法接受两个参数：
* 方法名称
* 作为`tuple`的测试参数

返回两个值：使用的 gas 和方法返回的值（作为元组）。

:::info 值得注意
返回两个值：使用的 gas 和方法返回的值（作为元组）。
:::

在第一次调用中，参数将是`recv_internal`和一个元组，其中包含通过`begin_parse()`转换成切片的消息

```js 
var (int gas_used1, _) = invoke_method(recv_internal, [message.begin_parse()]);
```

为了记录，让我们将使用的 gas 量存储在`int gas_used1`中。

在第二次调用中，参数将是Get方法`get_total()`和一个空元组。

```js
var (int gas_used2, stack) = invoke_method(get_total, []);
```

为了报告，我们还将使用的 gas 量存储在`int gas_used2`中，以及方法返回的值，以便稍后检查一切是否正确。

我们得到：

```js
int __test_example() {
	set_default_initial_data();

	cell message = begin_cell().store_uint(10, 32).end_cell();
	var (int gas_used1, _) = invoke_method(recv_internal, [message.begin_parse()]);
	var (int gas_used2, stack) = invoke_method(get_total, []);

}
```

现在，最后，最重要的步骤。我们必须检查我们的智能合约是否正常工作。

也就是说，如果它返回**正确的结果**，我们返回`success`或`failure`和使用的 gas 。

``` js
[int total] = stack; 
throw_if(101, total != 10); 
```
**解释：**
* 传递元组
* 在第一个参数中，错误的编号（101），如果智能合约工作不正常，我们将接收到该错误
* 在第二个参数中是正确的答案

``` js
int __test_example() {
	set_data(begin_cell().store_uint(0, 64).end_cell());
	cell message = begin_cell().store_uint(10, 32).end_cell();
	var (int gas_used1, _) = invoke_method(recv_internal, [message.begin_parse()]);
	var (int gas_used2, stack) = invoke_method(get_total, []);
	[int total] = stack;
	throw_if(101, total != 10);
	return gas_used1 + gas_used2;
}
```

这就是整个测试，非常方便。
