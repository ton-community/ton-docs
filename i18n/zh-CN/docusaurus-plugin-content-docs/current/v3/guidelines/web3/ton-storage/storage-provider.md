import Feedback from '@site/src/components/Feedback';

# 存储提供商

_存储提供商_是一项服务，用于收费存储文件。

## Binaries

您可以从[TON自动构建](https://github.com/ton-blockchain/ton/releases/latest)下载适用于Linux/Windows/MacOS的`storage-daemon`和`storage-daemon-cli`二进制文件。

## 从源代码编译

您可以使用此[说明](/develop/howto/compile#storage-daemon)从源代码编译`storage-daemon`和`storage-damon-cli`。

## 关键概念

存储提供商是`storage-daemon`的一部分，并由`storage-daemon-cli`管理。需要以`-P`标志启动`storage-daemon`。

- 它由一个智能合约组成，该合约接受存储请求并管理来自客户的支付，以及一个上传和向客户提供文件的应用程序。以下是它的工作原理：
- A daemon application that uploads and serves files to clients.

The process works as follows:

1. 提供商的所有者启动`storage-daemon`，部署主智能合约，并设置参数。合约的地址与潜在客户共享。 The contract address is then shared with potential clients.

2. 使用`storage-daemon`，客户端创建一个包含其文件的包并向提供商的智能合约发送特殊的内部消息。

3. 提供商的智能合约创建一个存储合约来处理这个特定包。

4. 提供商在区块链中找到请求后，下载包并激活存储合约。

5. 客户端可以向存储合约转账支付存储费用。为了接收支付，提供商定期向合约提供证明，证明他们仍在存储该包。 The provider must regularly submit proof that the bag is still being stored to continue receiving payment.

6. If the contract's funds are depleted, it becomes inactive, and the provider is no longer obligated to store the bag. The client can either refill the contract or retrieve their files.

:::info
客户端也可以随时通过向存储合约提供所有权证明来检索其文件。合约随后将文件释放给客户端并停用自身。 Once validated, the contract releases the files and deactivates itself.
:::

## 智能合约

[智能合约源代码](https://github.com/ton-blockchain/ton/tree/master/storage/storage-daemon/smartcont)。

## 客户使用提供商

To use a storage provider, you need to first know the address of its smart contract. 您可以在`storage-daemon-cli`中执行此操作：

```
get-provider-params <address>
```

### 提供商的参数：

- 是否接受新的存储合约。
- 可以使用`close-contract <address>`命令关闭任何存储合约。这也将把资金转移到主合约。当客户端余额耗尽时，也会自动发生这种情况。这种情况下，_包_文件将被删除（除非有其他合约使用相同的_包_）。
- Rate - the cost of storage. Specified in nanoTON per megabyte per day.
- 最大间隔 - 提供商应该多久提交一次包存储证明。

The output includes the following parameters:

- 如果存储合约上的资金用尽，合约将被视为非活动状态，提供商不再需要存储该包。客户端可以重新填充合约或检索其文件。
- 单个包的最小和最大大小（以字节为单位）。
- 价格 - 存储费用。以每天每兆字节nanoTON计。
- 提供商存储的所有_包_都可以通过命令`list`获得，并且可以像往常一样使用。为避免干扰提供商的运营，请不要删除它们或使用此存储守护程序处理任何其他_包_。

### 存储请求

您需要创建一个包并生成以下命令的消息：

```
new-contract-message <BagID> <file> --query-id 0 --provider <address>
```

### Notes

- This command may take some time to execute for large **bags**.
- The generated message body, not the full internal message, is saved to `<file>`.
- Query ID can be any integer from `0` to `2^64 - 1`.
- The generated message includes the provider's current rate and max span parameters. These values are displayed after execution and should be reviewed before sending.
- If the provider updates their parameters before the message is submitted, it will be rejected. This ensures that the storage contract is created under the client's agreed-upon conditions.

The client must then send the generated message body to the provider's smart contract address. If an error occurs, the message bounces back to the sender. 然后，客户端必须将带有此 body 的消息发送到提供商的地址。如果出现错误，消息将返回给发件人（弹回）。否则，将创建一个新的存储合约，客户端将收到来自它的消息，其中包含[`op=0xbf7bd0c1`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/constants.fc#L3)和相同的查询ID。

At this stage, the contract is not yet active. 此时，合约尚未激活。一旦提供商下载了包，它将激活存储合约，客户端将收到来自存储合约的[`op=0xd4caedcd`](https://github.com/SpyCheese/ton/blob/tonstorage/storage/storage-daemon/smartcont/constants.fc#L4)消息。

#### Client balance

The storage contract maintains a client balance, which consists of the funds transferred by the client that have not yet been paid to the provider. This balance gradually reduces over time based on the provider's rate (in nanoTON per megabyte per day).

- The initial balance is the amount sent when creating the storage contract with the request.
- The client can top up the contract anytime by making transfers to the storage contract — this can be done from any wallet address.
- The current balance can be retrieved using the [`get_storage_contract_data`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/storage-contract.fc#L222) getter method. It is returned as the second value: `balance`.

### Contract closure

:::info
如果存储合约关闭，客户端将收到带有剩余余额的消息和[`op=0xb6236d63`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/constants.fc#L6)。
:::

合约可能因以下情况关闭：

- Immediately after creation, before activation, if the provider declines the request, e.g., due to capacity limits or configuration issues.
- 客户端余额降至0。
- Voluntarily by the provider.
- 客户端可以通过从其地址发送带有[`op=0x79f937ea`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/constants.fc#L2)的消息和任何查询ID来自愿关闭合约。

## 运行和配置提供商

The storage provider is a component of the `storage-daemon` and is managed using the `storage-daemon-cli`. To run the provider, launch `storage-daemon` with the `-P` flag.

### 创建主智能合约

要使用存储提供商，您需要知道其智能合约的地址。客户端可以使用`storage-daemon-cli`中的以下命令获取提供商的参数：

```
deploy-provider
```

:::info 重要！
您将被要求向指定地址发送1 TON的不可弹回消息以初始化提供商。您可以使用`get-provider-info`命令检查合约是否已创建。 You can verify successful deployment with the `get-provider-info` command.
:::

By default, the contract does not accept new storage contracts. 默认情况下，合约设置为不接受新的存储合约。在激活它之前，您需要配置提供商。提供商的设置由配置（存储在`storage-daemon`中）和合约参数（存储在区块链中）组成。

### 配置：

The provider configuration includes:

- `max contracts` - 同时可以存在的最大存储合约数量。
- `max total size` - 存储合约中_包_的最大总大小。
  您可以使用`get-provider-info`查看配置值，并使用以下命令更改它们：

To view the current configuration:

```
get-provider-info
```

To update the configuration:

```
set-provider-config --max-contracts 100 --max-total-size 100000000000
```

### 合约参数：

- `accept` - 是否接受新的存储合约。
- `max file size`、`min file size` - 单个_包_的大小限制。
- `rate` - 存储成本（以每天每兆字节nanoTON计）。
- `max span` - 提供商将不得不提交存储证明的频率。

To view the current parameters:

```
get-provider-info
```

To update the parameters:

```
set-provider-params --accept 1 --rate 1000000000 --max-span 86400 --min-file-size 1024 --max-file-size 1000000000
```

**Note:** in the `set-provider-params` command, you may update only a subset of parameters. Any omitted values will retain their current settings. 注意：在`set-provider-params`命令中，您可以仅指定部分参数。其他参数将从当前参数中获取。由于区块链中的数据不是立即更新的，因此连续几个`set-provider-params`命令可能导致意外结果。

It is recommended that the provider’s smart contract be funded with more than 1 TON after deployment to cover future transaction fees. However, avoid transferring large amounts during the initial non-bounceable setup.

在将`accept`参数设置为`1`后，智能合约将开始接受客户端的请求并创建存储合约，同时存储守护程序将自动处理它们：下载和分发_包_，生成存储证明。

- The provider begins accepting client requests once the `accept` parameter is set to `1` and creates storage contracts. The storage daemon will automatically:
- Download and distribute **bags**.
- Generate and submit storage proofs.

## 进一步使用提供商

### 现有存储合约列表

To list all active storage contracts and their balances:

```
get-provider-info --contracts --balances
```

Each contract displays:

- `Client$`: funds provided by the client.
- `Contract$`: total funds in the contract.

The difference between these values represents the provider’s earnings, which can be withdrawn using `withdraw <address>`.

命令`withdraw-all`将从所有至少有`1 TON`可用的合约中提取资金。

To close a specific contract:
`close-contract <address>`

Closing a contract automatically transfers available funds to the main provider contract. The exact process occurs automatically when the client’s balance is depleted. In both cases, the associated bag files will be deleted—unless other active contracts still use them.

### 转账

您可以将资金从主智能合约转移到任何地址（金额以nanoTON指定）：

```
send-coins <address> <amount>
send-coins <address> <amount> --message "Some message"
```

:::info
All _bags_ stored by the provider are available with the command `list` and can be used as usual. To prevent disrupting the provider's operations, do not delete them or use this storage daemon to work with any other _bags_.
:::

<Feedback />

