# 存储提供商

*存储提供商*是一项服务，用于收费存储文件。

## 二进制文件

您可以从[TON自动构建](https://github.com/ton-blockchain/ton/releases/latest)下载适用于Linux/Windows/MacOS的`storage-daemon`和`storage-daemon-cli`二进制文件。

## 从源代码编译

您可以使用此[说明](/develop/howto/compile#storage-daemon)从源代码编译`storage-daemon`和`storage-damon-cli`。

## 关键概念

它由一个智能合约组成，该合约接受存储请求并管理来自客户的支付，以及一个上传和向客户提供文件的应用程序。以下是它的工作原理：

1. 提供商的所有者启动`storage-daemon`，部署主智能合约，并设置参数。合约的地址与潜在客户共享。
2. 使用`storage-daemon`，客户端创建一个包含其文件的包并向提供商的智能合约发送特殊的内部消息。
3. 提供商的智能合约创建一个存储合约来处理这个特定包。
4. 提供商在区块链中找到请求后，下载包并激活存储合约。
5. 客户端可以向存储合约转账支付存储费用。为了接收支付，提供商定期向合约提供证明，证明他们仍在存储该包。
6. 如果存储合约上的资金用尽，合约将被视为非活动状态，提供商不再需要存储该包。客户端可以重新填充合约或检索其文件。

:::info
客户端也可以随时通过向存储合约提供所有权证明来检索其文件。合约随后将文件释放给客户端并停用自身。
:::

## 智能合约

[智能合约源代码](https://github.com/ton-blockchain/ton/tree/master/storage/storage-daemon/smartcont)。

## 客户使用提供商

要使用存储提供商，您需要知道其智能合约的地址。客户端可以使用`storage-daemon-cli`中的以下命令获取提供商的参数：

```
get-provider-params <address>
```

### 提供商的参数：

- 是否接受新的存储合约。
- 单个包的最小和最大大小（以字节为单位）。
- 价格 - 存储费用。以每天每兆字节nanoTON计。
- 最大间隔 - 提供商应该多久提交一次包存储证明。

### 存储请求

您需要创建一个包并生成以下命令的消息：

```
new-contract-message <BagID> <file> --query-id 0 --provider <address>
```

### 信息：

执行此命令可能需要一些时间来处理大型包。消息正文将保存到`<file>`（不是整个内部消息）。查询ID可以是0到`2^64-1`的任何数字。消息包含提供商的参数（价格和最大间隔）。这些参数将在执行命令后打印出来，因此应在发送前进行双重检查。如果提供商的所有者更改参数，消息将被拒绝，因此新存储合约的条件将完全符合客户的预期。

然后，客户端必须将带有此 body 的消息发送到提供商的地址。如果出现错误，消息将返回给发件人（弹回）。否则，将创建一个新的存储合约，客户端将收到来自它的消息，其中包含[`op=0xbf7bd0c1`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/constants.fc#L3)和相同的查询ID。

此时，合约尚未激活。一旦提供商下载了包，它将激活存储合约，客户端将收到来自存储合约的[`op=0xd4caedcd`](https://github.com/SpyCheese/ton/blob/tonstorage/storage/storage-daemon/smartcont/constants.fc#L4)消息。

存储合约有一个“客户端余额” - 这是客户端转移给合约的资金，尚未支付给提供商。资金以每天每兆字节的速率逐渐从此余额中扣除。初始余额是客户端随创建存储合约的请求一起转移的金额。然后，客户端可以通过对存储合约进行简单转账来补充余额（可以从任何地址进行）。剩余客户端余额可通过[`get_storage_contract_data`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/storage-contract.fc#L222) get方法返回，作为第二个值（`balance`）。

### 合约可能因以下情况关闭：

:::info
如果存储合约关闭，客户端将收到带有剩余余额的消息和[`op=0xb6236d63`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/constants.fc#L6)。
:::

- 在创建后立即，激活前，如果提供商拒绝接受合约（提供商的限额超出或其他错误）。
- 客户端余额降至0。
- 提供商可以自愿关闭合约。
- 客户端可以通过从其地址发送带有[`op=0x79f937ea`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/constants.fc#L2)的消息和任何查询ID来自愿关闭合约。

## 运行和配置提供商

存储提供商是`storage-daemon`的一部分，并由`storage-daemon-cli`管理。需要以`-P`标志启动`storage-daemon`。

### 创建主智能合约

您可以在`storage-daemon-cli`中执行此操作：

```
deploy-provider
```

:::info 重要！
您将被要求向指定地址发送1 TON的不可弹回消息以初始化提供商。您可以使用`get-provider-info`命令检查合约是否已创建。
:::

默认情况下，合约设置为不接受新的存储合约。在激活它之前，您需要配置提供商。提供商的设置由配置（存储在`storage-daemon`中）和合约参数（存储在区块链中）组成。

### 配置：

- `max contracts` - 同时可以存在的最大存储合约数量。
- `max total size` - 存储合约中*包*的最大总大小。
  您可以使用`get-provider-info`查看配置值，并使用以下命令更改它们：

```
set-provider-config --max-contracts 100 --max-total-size 100000000000
```

### 合约参数：

- `accept` - 是否接受新的存储合约。
- `max file size`、`min file size` - 单个*包*的大小限制。
- `rate` - 存储成本（以每天每兆字节nanoTON计）。
- `max span` - 提供商将不得不提交存储证明的频率。

您可以使用`get-provider-info`查看参数，并使用以下命令更改它们：

```
set-provider-params --accept 1 --rate 1000000000 --max-span 86400 --min-file-size 1024 --max-file-size 1000000000
```

### 值得注意的是

注意：在`set-provider-params`命令中，您可以仅指定部分参数。其他参数将从当前参数中获取。由于区块链中的数据不是立即更新的，因此连续几个`set-provider-params`命令可能导致意外结果。

建议最初在提供商的余额上放置超过1 TON，以便有足够的资金支付与存储合约相关的手续费。但不要在第一个不可反弹消息中发送太多TON。

在将`accept`参数设置为`1`后，智能合约将开始接受客户端的请求并创建存储合约，同时存储守护程序将自动处理它们：下载和分发*包*，生成存储证明。

## 进一步使用提供商

### 现有存储合约列表

```
get-provider-info --contracts --balances
```

每个存储合约的`Client$`和`Contract$`余额都列出来了；差额可以通过`withdraw <address>`命令提取到主提供商合约。

命令`withdraw-all`将从所有至少有`1 TON`可用的合约中提取资金。

可以使用`close-contract <address>`命令关闭任何存储合约。这也将把资金转移到主合约。当客户端余额耗尽时，也会自动发生这种情况。这种情况下，*包*文件将被删除（除非有其他合约使用相同的*包*）。

### 转账

您可以将资金从主智能合约转移到任何地址（金额以nanoTON指定）：

```
send-coins <address> <amount>
send-coins <address> <amount> --message "Some message"
```

:::info
提供商存储的所有*包*都可以通过命令`list`获得，并且可以像往常一样使用。为避免干扰提供商的运营，请不要删除它们或使用此存储守护程序处理任何其他*包*。
:::
