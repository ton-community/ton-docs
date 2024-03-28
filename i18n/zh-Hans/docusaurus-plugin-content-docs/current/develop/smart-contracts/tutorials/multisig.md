---
description: 本教程结束时，您将在TON区块链上部署了多签合约。
---

# 如何制作一个简单的多签合约

## 💡 概览

本教程将帮助您学习如何部署您的多签合约。回想一下，(n, k)多签合约是一个有n个私钥持有者的多签钱包，如果请求（又称订单、查询）至少收集到持有者的k个签名，则接受发送消息的请求。

基于akifoq对原始多签合约代码的更新：
- [原始TON区块链多签代码.multisig-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/multisig-code.fc)
- [akifoq/multisig](https://github.com/akifoq/multisig)，带有fift库以使用多签。

:::tip 初学者提示
对多签不熟悉的人可以看：[什么是多签技术？(视频)](https://www.youtube.com/watch?v=yeLqe_gg2u0)
:::

## 📖 您将学到什么

- 如何创建和定制一个简单的多签钱包。
- 如何使用轻客户端部署多签钱包。
- 如何签署请求并将其作为消息发送到区块链。

## ⚙ 设置您的环境

在我们开始之前，检查并准备您的环境。

- 从[安装](/develop/smart-contracts/environment/installation)部分中安装`func`、`fift`、`lite-client`二进制文件和`fiftlib`。
- 克隆[库](https://github.com/akifoq/multisig)并在CLI中打开其目录。
```cpp
https://github.com/akifoq/multisig.git
cd ~/multisig
``` 


## 🚀 开始吧！

1. 将代码编译为fift。
2. 准备多签所有者的密钥。
3. 部署您的合约。
4. 与区块链中部署的多签钱包进行交互。

### 编译合约

使用以下命令将合约编译为Fift：

```cpp
func -o multisig-code.fif -SPA stdlib.fc multisig-code.fc
```

### 准备多签所有者密钥
#### 创建参与者密钥

要创建一个密钥，您需要运行：

```cpp
fift -s new-key.fif $KEY_NAME$
```

* 其中`KEY_NAME`是将写入私钥的文件的名称。

例如：

```cpp
fift -s new-key.fif multisig_key
```

我们将收到一个包含私钥的`multisig_key.pk`文件。

#### 收集公钥

此外，脚本还会以以下格式发出一个公钥：

```
Public key = Pub5XqPLwPgP8rtryoUDg2sadfuGjkT4DLRaVeIr08lb8CB5HW
```

在`"Public key = "`之后的任何内容都需要保存在某个地方！

让我们将其存储在`keys.txt`文件中。每行一个公钥，这很重要。

### 部署您的合约

#### 通过轻客户端部署

创建所有密钥后，您需要将公钥收集到文本文件`keys.txt`中。

例如：

```bash
PubExXl3MdwPVuffxRXkhKN1avcGYrm6QgJfsqdf4dUc0an7/IA
PubH821csswh8R1uO9rLYyP1laCpYWxhNkx+epOkqwdWXgzY4
```

之后，您需要运行：


```cpp
fift -s new-multisig.fif 0 $WALLET_ID$ wallet $KEYS_COUNT$ ./keys.txt
```

* `$WALLET_ID$` - 分配给当前密钥的钱包号。对于每个使用相同密钥的新钱包，建议使用唯一的`$WALLET_ID$`。
* `$KEYS_COUNT$` - 确认所需的密钥数量，通常等于公钥数量

:::info wallet_id 解释
使用相同的密钥（Alice密钥，Bob密钥）可以创建许多钱包。如果Alice和Bob已经有treasure怎么办？这就是为什么`$WALLET_ID$`在这里至关重要。
:::

脚本将输出类似于以下的内容：

```bash
new wallet address = 0:4bbb2660097db5c72dd5e9086115010f0f8c8501e0b8fef1fe318d9de5d0e501

(将地址保存到wallet.addr文件中)

不可弹回地址（用于初始化）：0QBLuyZgCX21xy3V6QhhFQEPD4yFAeC4_vH-MY2d5dDlAbel

可弹回地址（用于后续访问）：kQBLuyZgCX21xy3V6QhhFQEPD4yFAeC4_vH-MY2d5dDlAepg

(将创建钱包的查询保存到wallet-create.boc文件中)
```

:::info 
如果您遇到“公钥必须为48个字符长”的错误，请确保您的`keys.txt`具有unix类型的换行符 - LF。例如，可以通过Sublime文本编辑器更改换行符。
:::

:::tip
最好保留可弹回地址 - 这是钱包的地址。
:::

#### 激活您的合约

您需要向我们新生成的_treasure_发送一些TON，例如0.5 TON。

之后，您需要运行轻客户端：

```bash
lite-client -C global.config.json
```

:::info 如何获取`global.config.json`？
您可以为[主网](https://ton.org/global-config.json)或[测试网](https://ton.org/testnet-global.config.json)获取最新的配置文件`global.config.json`。
:::

启动轻客户端后，最好在轻客户端控制台运行`time`命令，以确保连接成功：

```bash
time
```

好的，轻客户端工作正常！

之后，您需要部署钱包。运行命令：

```
sendfile ./wallet-create.boc
```

之后，钱包将在一分钟内准备好可供使用。


### 与多签钱包进行交互

#### 创建请求

首先，您需要创建一个消息请求：

```cpp
fift -s create-msg.fif $ADDRESS$ $AMOUNT$ $MESSAGE$
```

* `$ADDRESS$` - 发送代币的地址
* `$AMOUNT$` - 代币的数量
* `$MESSAGE$` - 被编译消息的文件名。

例如：

```cpp
fift -s create-msg.fif EQApAj3rEnJJSxEjEHVKrH3QZgto_MQMOmk8l72azaXlY1zB 0.1 message
```

:::tip
要为您的交易添加评论，请使用`-C comment`属性。要获取更多信息，请在没有参数的情况下运行_create-msg.fif_文件。
:::

#### 选择钱包

接下来，您需要选择一个要发送代币的钱包：

```
fift -s create-order.fif $WALLET_ID$ $MESSAGE$ -t $AWAIT_TIME$
```
其中
* `$WALLET_ID$` — 是由此多签合约支持的钱包的ID。
* `$AWAIT_TIME$` — 智能合约将等待多签钱包所有者对请求签名的时间（以秒为单位）。
* `$MESSAGE$` — 上一步中创建的消息boc文件的名称。

:::info
如果在请求得到签名之前，时间等于`$AWAIT_TIME$`这样的条件已经过去了，请求将过期。通常，$AWAIT_TIME$等于几个小时（7200秒）
:::

例如：
```
fift -s create-order.fif 0 message -t 7200
```

准备好的文件将保存在`order.boc`中

:::info
`order.boc`需要与密钥持有者共享，他们必须对其进行签名。
:::

#### 签署您的部分

要签名，您需要执行：

```bash
fift -s add-signature.fif $KEY$ $KEY_INDEX$
```

* `$KEY$` - 包含签名私钥的文件的名称，不带扩展名。
* `$KEY_INDEX$` - `keys.txt`中给定密钥的索引（从零开始）

例如，对于我们的`multisig_key.pk`文件：

```
fift -s add-signature.fif multisig_key 0
```

#### 创建消息

在每个人都签署了订单后，需要将其转换为钱包的消息，并再次使用以下命令进行签名：
```
fift -s create-external-message.fif wallet $KEY$ $KEY_INDEX$
```
在这种情况下，只需要钱包所有者的一个签名即可。这样做的想法是，您无法使用无效签名攻击合约。

例如：
```
fift -s create-external-message.fif wallet multisig_key 0
```

#### 将签名发送到TON区块链

之后，您需要再次启动轻客户端：

```bash
lite-client -C global.config.json
```

最后，我们要发送我们的签名！只需运行：

```bash
sendfile wallet-query.boc
```

如果其他人都签署了请求，它将被完成！

您做到了，哈哈！🚀🚀🚀

## 接下来

- [阅读更多关于TON中多签钱包的信息](https://github.com/akifoq/multisig)，来自akifoq。
