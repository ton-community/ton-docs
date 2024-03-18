# 使用toncli

_toncli—The Open Network跨平台智能合约命令行界面。_

易于部署和与TON智能合约交互。

对于**Python**堆栈开发者来说是个不错的解决方案。

* [GitHub库](https://github.com/disintar/toncli)

## 快速开始 📌

以下是使用toncli库制作的教程：
* [快速开始指南](https://github.com/disintar/toncli/blob/master/docs/quick_start_guide.md) — 部署示例智能合约到TON的简单步骤。
* [TON Learn: FunC旅程概览。第1部分](https://blog.ton.org/func-journey)
* [TON Learn: FunC旅程概览。第2部分](https://blog.ton.org/func-journey-2)
* [TON Learn: FunC旅程概览。第3部分](https://blog.ton.org/func-journey-3)
* [TON Learn: 10个从零到英雄的课程](https://github.com/romanovichim/TonFunClessons_Eng) ([俄语版本](https://github.com/romanovichim/TonFunClessons_ru))

## 安装 💾

### Docker：Linux / macOS（支持m1）

* Docker镜像预构建可在[此处](https://hub.docker.com/r/trinketer22/func_docker/)找到
* 带有说明的Docker文件可在[此处](https://github.com/Trinketer22/func_docker)找到

### Linux / macOS（英特尔）

1) 下载必要的特殊预构建（使用最新构建）
* 对于Linux：[此处](https://github.com/SpyCheese/ton/actions/workflows/ubuntu-compile.yml?query=branch%3Atoncli-local++)
* 对于Mac：[此处](https://github.com/SpyCheese/ton/actions/workflows/macos-10.15-compile.yml?query=branch%3Atoncli-local)

:::info 下载特殊预构建提示
要下载必要的文件，您必须登录您的账户
:::

2) 安装[Python3.9](https://www.python.org/downloads/)或更高版本

3) 在终端运行`pip install toncli`或`pip3 install toncli`

:::tip 可能的错误
如果您看到`WARNING: The script toncli is installed in '/Python/3.9/bin' which is not on PATH`，则将bin的完整路径添加到PATH环境变量中
:::

4) 运行`toncli`并传递第一步中的`func/fift/lite-client`的绝对路径


### Windows

1) 从[此处](https://github.com/SpyCheese/ton/actions/workflows/win-2019-compile.yml?query=branch%3Atoncli-local)下载必要的特殊预构建（使用最新构建）

:::info 下载特殊预构建提示
要下载必要的文件，您必须登录您的账户
:::

2) 安装[Python3.9](https://www.python.org/downloads/)或更高版本

:::info 非常重要！
在安装过程中，在第一个屏幕上，您需要点击`Add Python to PATH`复选框
:::

3) 以管理员身份打开终端并通过安装`toncli`来`pip install toncli`

4) 解压下载的存档并将[libcrypto-1_1-x64.dll](https://disk.yandex.ru/d/BJk7WPwr_JT0fw)添加到解压文件中

5) 为Windows用户打开文件夹：

**Windows 11**:
* 右键单击，打开终端

**Windows 10**:
* 在资源管理器中复制路径，然后在终端运行`cd 全路径`

## 创建项目 ✏️ 

这些是在TON中部署示例智能合约的简单步骤。
您可以在[此处](https://github.com

/disintar/toncli/blob/master/docs/quick_start_guide.md)阅读官方文档
### 分步指南

1) 以管理员身份打开终端并进入您的项目文件夹

2) 要创建项目，请运行`toncli start YOUR-PROJECT-NAME`

3) 进入项目文件夹`cd YOUR-PROJECT-NAME`

:::info 结果
Toncli创建了一个简单的钱包项目，您可以在其中看到4个文件夹：
* build
* func
* fift
* test
:::

4) 您可以将其部署到testnet或mainnet：`toncli deploy -n testnet`

## 示例

贡献者已经准备了很好的示例项目，并覆盖了新的测试。例如，现在可以使用两个命令部署NFT集合或Jetton。

```bash
toncli start nft_colletion/jetton_minter/nft_item/jetton_wallet
```

所有这些项目都有许多有趣的toncli和区块链交互示例，以及极其有用的测试，这将帮助开发定制智能合约。

## 要使用toncli测试智能合约，请前往[测试](/develop/smart-contracts/testing/toncli)


## 实用文章

其他关于在开发中使用toncli的有用文章：

1. [所有cli命令](https://github.com/disintar/toncli/blob/master/docs/advanced/commands.md)
2. [运行get方法](https://github.com/disintar/toncli/blob/master/docs/advanced/get_methods.md)
3. [多合约](https://github.com/disintar/toncli/blob/master/docs/advanced/multiple_contracts.md)
4. [使用fift发送boc](https://github.com/disintar/toncli/blob/master/docs/advanced/send_boc_with_fift.md)
5. [项目结构](https://github.com/disintar/toncli/blob/master/docs/advanced/project_structure.md)
6. [有趣的特性](https://github.com/disintar/toncli/blob/master/docs/advanced/intresting_features.md)
7. [发送内部fift消息](https://github.com/disintar/toncli/blob/master/docs/advanced/send_fift_internal.md)
8. [FunC测试如何工作？](https://github.com/disintar/toncli/blob/master/docs/advanced/func_tests_new.md)
9. [如何用toncli调试交易？](https://github.com/disintar/toncli/blob/master/docs/advanced/transaction_debug.md)
10. [用于FunC测试的Dockerfile GitHub库](https://github.com/Trinketer22/func_docker)
