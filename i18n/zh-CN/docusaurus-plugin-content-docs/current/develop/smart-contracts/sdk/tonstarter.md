# 使用TypeScript

## Blueprint

测试工具包（通常是沙盒）已包含在名为Blueprint的TypeScript SDK中。

- [了解有关 Blueprint 的更多信息](/develop/smart-contracts/sdk/javascript)

使用以下命令一行运行测试：

```bash npm2yarn
npm test
```

## 低级库

### 沙盒

这个包允许您模拟任意TON智能合约，向它们发送消息并运行get方法，就像它们部署在真实网络上一样。

这个包与ton-contract-executor的关键区别在于，后者只模拟合约的 Compute Phase  - 它不了解任何其他阶段，因此不了解费用和余额（在某种意义上，它不知道合约的余额是否足以处理它产生的所有输出消息）。

另一方面，这个包模拟了合约的所有阶段，因此，模拟更接近于在真实网络中发生的情况。

- https://github.com/ton-community/sandbox

### ton-contract-executor

:::info 已弃用
这个库已被弃用。TON社区不再开发它。
:::

这个库允许您在本地运行TON虚拟机并执行合约。这使您能够在将它们发布到网络之前编写、调试和完全测试您的合约。

- https://github.com/ton-community/ton-contract-executor

## 教程

首先阅读这篇文章，以了解TON上所有测试方法：

- [TON Hello World第4部分：测试您的第一个智能合约的逐步指南](https://ton-community.github.io/tutorials/04-testing/)
