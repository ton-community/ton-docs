# 使用TypeScript（不推荐）

## Blueprint

测试工具包（通常是沙盒）已经包含在名为Blueprint的TypeScript SDK中。

- [了解更多关于Blueprint](/develop/smart-contracts/sdk/javascript)

使用以下命令一行运行测试：

```bash npm2yarn
npm test
```

## 低级别库

### sandbox

此软件包允许您模拟任意TON智能合约，向它们发送消息并运行它们的get方法，就好像它们部署在真实网络上一样。

这个包与ton-contract-executor的主要区别在于，后者只模拟合约的 Compute Phase  - 它不知道任何其他阶段，因此不知道任何关于费用和余额的信息（在某种意义上，它不知道合约的余额是否足以处理它产生的所有出站消息）。

另一方面，这个包模拟了合约的所有阶段，因此，模拟更接近于真实网络中会发生的情况。

- https://github.com/ton-community/sandbox

### ton-contract-executor

:::info 不推荐
这个库已经不推荐使用。TON社区不再开发它。
:::

这个库允许您在本地运行TON虚拟机并执行合约。这使您能够在将合约发布到网络之前编写、调试和完全测试您的合约。

- https://github.com/ton-community/ton-contract-executor

## 教程

首先阅读这篇文章，了解在TON上进行测试的所有方法：

* [TON Hello World第4部分：逐步指导测试您的第一个智能合约](https://ton-community.github.io/tutorials/04-testing/)
