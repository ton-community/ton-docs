import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 付款处理

This page **explains how to process** (send and accept) digital assets on TON Blockchain. While it primarily focuses on handling TON coins, the **theoretical concepts** are also relevant for processing `jettons`.

:::tip
建议在阅读本教程之前先熟悉一下 [资产处理概述](/v3/documentation/dapps/assets/overview)。
:::

## 钱包智能合约

TON 网络上的钱包智能合约允许外部参与者与区块链实体互动。 They serve the following purposes:

- 验证所有者身份：拒绝试图代表非所有者处理或支付费用的请求。
- 提供重放保护：防止重复执行同一请求，如向另一个智能合约发送资产。
- 启动与其他智能合约的任意交互。

The standard solution for authentication relies on public-key cryptography. The `wallet` stores the public key and verifies that any incoming request is signed by the corresponding private key, which is known only to the owner.

The solution for replay protection varies. Generally, a request contains a fully formed inner message that the `wallet` sends to the network. However, different approaches exist for preventing replay attacks.

### 基于 Seqno 的钱包

Seqno-based wallets use a simple `seqno` method to process messages. Each message includes a special seqno integer that must match the counter stored in the wallet smart contract. The `wallet` updates this counter with each request, ensuring that no request is processed twice. There are multiple versions of seqno-based wallets, which may differ in publicly available methods. These variations include: the ability to limit requests by expiration time and the ability to operate multiple wallets with the same public key. However, this approach has a limitation: requests must be sent sequentially. Any gap in the `seqno` sequence will prevent the processing of all subsequent requests.

### 高负载钱包

High-load wallets take a different approach by storing the identifiers of non-expired processed requests in the smart contract’s storage. Each new request is checked against previously processed ones, and any detected duplicates are dropped. Since expired requests are removed over time, the contract does not store all requests indefinitely. This method allows multiple requests to be processed in parallel without interference. However, it requires more sophisticated monitoring to track request processing.

### 这种 `钱包` 类型采用的方法是在智能合约存储中存储已处理的未过期请求的标识符。在这种方法中，任何请求都会被检查是否与已处理的请求重复，如果检测到重复请求，就会丢弃。由于过期，合约可能不会永久存储所有请求，但会删除因过期限制而无法处理的请求。向该 `钱包` 发出的请求可以并行发送，不会受到干扰，但这种方法需要对请求处理进行更复杂的监控。

要通过TonLib部署钱包，需要：

1. Generate a private/public key pair using [createNewKey](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L244) or its wrapper functions (example in [tonlib-go](https://github.com/mercuryoio/tonlib-go/tree/master/v2#create-new-private-key)). The private key is generated locally and never leaves the host machine.
2. 形成与已启用的`钱包`之一相对应的 [InitialAccountWallet](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L62) 结构。目前可用的有：`wallet.v3`、`wallet.v4`、`wallet.highload.v1`、`wallet.highload.v2`。 Currently, the supported `wallets` are: `wallet.v3`, `wallet.v4`, `wallet.highload.v1`, `wallet.highload.v2` are available.
3. 通过 [getAccountAddress](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L283) 方法计算新的 `wallet` 智能合约的地址。我们建议使用默认版本`0`，并在基链`workchain=0`中部署钱包，以降低处理和存储费用。 It is recommended to use revision 0 by default. Deploy wallets in the basechain `workchain=0`     to minimize processing and storage fees.
4. Send some Toncoin to the calculated address. The transfer should be made in `non-bounce` mode since the wallet address has no code yet and cannot process incoming messages. The `non-bounce` flag ensures that if processing fails, the funds are not returned via a bounce message. Warning: Avoid using the non-bounce flag for other transactions, especially when transferring large sums, as the bounce mechanism provides protection against mistakes.
5. Form the desired [action](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L154), such as `actionNoop` for deploy only. 形成所需的 [action](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L154)，例如只用于部署的 `actionNoop`。然后使用 [createQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L292) 和 [sendQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L300) 启动与区块链的交互。
6. 使用 [getAccountState](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L288) 方法在几秒钟内检查合约。

:::tip
在[钱包教程](/v3/guidelines/smart-contracts/howto/wallet#-deploying-a-wallet)中阅读更多内容。
:::

### Checking wallet address validity

Most SDKs automatically verify a wallet address during creation or transaction preparation, so additional manual validation is usually unnecessary.

<Tabs groupId="address-examples">

  <TabItem value="Tonweb" label="JS (Tonweb)">

  ```js
    const TonWeb = require("tonweb")
    TonWeb.utils.Address.isValid('...')
  ```

  </TabItem>
  <TabItem value="GO" label="tonutils-go">

  ```python
  package main
  
  import (
    "fmt"
    "github.com/xssnick/tonutils-go/address"
  )
  
  if _, err := address.ParseAddr("EQCD39VS5j...HUn4bpAOg8xqB2N"); err != nil {
    return errors.New("invalid address")
  }
  ```

  </TabItem>
  <TabItem value="Java" label="Ton4j">

  ```javascript
  try {
    Address.of("...");
    } catch (e) {
    // not valid address
  }
  ```

  </TabItem>
  <TabItem value="Kotlin" label="ton-kotlin">

```javascript
  try {
    AddrStd("...")
  } catch(e: IllegalArgumentException) {
      // not valid address
  }
```

  </TabItem>
</Tabs>

:::tip
[智能合约地址](/v3/documentation/smart-contracts/addresses) 页面上的完整地址描述。
:::

## Working with transfers

### 检查合约交易

To retrieve a smart contract's transactions, use the [getTransactions](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get). method. This method fetches up to 10 transactions starting from a specified `last_transaction_id` and earlier. To process all incoming transactions, follow these steps:

1. 可以使用 [getAddressInformation](https://toncenter.com/api/v2/#/accounts/get_address_information_getAddressInformation_get) 获取最新的 `last_transaction_id`。
2. 应通过 `getTransactions` 方法加载10笔交易。
3. 处理输入信息中来源不为空且目的地等于账户地址的交易。
4. Retrieve the next 10 transactions and repeat steps 2 and 3 until all incoming transactions are processed.

### 检索传入/传出交易

It is possible to track message flows during transaction processing. Since the message flow forms a DAG (Directed Acyclic Graph), follow these steps:

1. 可以使用 [getTransactions](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get) 获取合约的交易。该方法允许从某个 `last_transaction_id`和更早的交易中获取 10 个交易。要处理所有收到的交易，应遵循以下步骤：
2. 可以在事务处理过程中跟踪消息流。由于消息流是一个 DAG，因此只需使用 [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) 方法获取当前事务，并使用 [tryLocateResultTx](https://testnet.toncenter.com/api/v2/#/transactions/get_try_locate_result_tx_tryLocateResultTx_get) 通过 `out_msg` 找到传入事务，或使用 [tryLocateSourceTx](https://testnet.toncenter.com/api/v2/#/transactions/get_try_locate_source_tx_tryLocateSourceTx_get) 通过 `in_msg` 找到传出事务。
3. 服务应定期轮询  `wallet` 合约的 [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) 方法。通过（`destination_address`, `value`, `comment`）匹配已确认的交易和已发出的付款，可以将付款标记为已完成；检测并向用户显示相应的交易哈希值和逻辑时间。

<Tabs groupId="example-outgoing-transaction">
<TabItem value="JS" label="JS">

```ts
import { TonClient, Transaction } from '@ton/ton';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { CommonMessageInfoInternal } from '@ton/core';

async function findIncomingTransaction(client: TonClient, transaction: Transaction): Promise<Transaction | null> {
  const inMessage = transaction.inMessage?.info;
  if (inMessage?.type !== 'internal') return null;
  return client.tryLocateSourceTx(inMessage.src, inMessage.dest, inMessage.createdLt.toString());
}

async function findOutgoingTransactions(client: TonClient, transaction: Transaction): Promise<Transaction[]> {
  const outMessagesInfos = transaction.outMessages.values()
    .map(message => message.info)
    .filter((info): info is CommonMessageInfoInternal => info.type === 'internal');
  
  return Promise.all(
    outMessagesInfos.map((info) => client.tryLocateResultTx(info.src, info.dest, info.createdLt.toString())),
  );
}

async function traverseIncomingTransactions(client: TonClient, transaction: Transaction): Promise<void> {
  const inTx = await findIncomingTransaction(client, transaction);
  // now you can traverse this transaction graph backwards
  if (!inTx) return;
  await traverseIncomingTransactions(client, inTx);
}

async function traverseOutgoingTransactions(client: TonClient, transaction: Transaction): Promise<void> {
  const outTxs = await findOutgoingTransactions(client, transaction);
  // do smth with out txs
  for (const out of outTxs) {
    await traverseOutgoingTransactions(client, out);
  }
}

async function main() {
  const endpoint = await getHttpEndpoint({ network: 'testnet' });
  const client = new TonClient({
    endpoint,
    apiKey: '[API-KEY]',
  });
  
  const transaction: Transaction = ...; // Obtain first transaction to start traversing
  await traverseIncomingTransactions(client, transaction);
  await traverseOutgoingTransactions(client, transaction);
}

main();
```

</TabItem>
</Tabs>

### 高负载钱包

:::tip
从 [TMA USDT 支付演示](https://github.com/ton-community/tma-usdt-payments-demo) 了解支付处理的基本示例
:::

1. 服务应部署一个 `钱包`，并保持其资金充足，以防止因存储费用而导致合约毁坏。请注意，存储费一般每年少于 1  Toncoin 。 Storage fees are typically less than 1 Toncoin per year.
2. 服务应从用户处获取 `destination_address` 和可选的 `comment`。请注意，在此期间，我们建议禁止未完成的、具有相同（`destination_address`, `value`, `comment`）设置的外发付款，或适当安排这些付款的时间；这样，只有在上一笔付款得到确认后，才会启动下一笔付款。 To avoid duplicate outgoing payments with the same (`destination_address`, `value`, `comment`), either prohibit unfinished payments with identical parameters or schedule payments so that a new payment starts only after the previous one is confirmed.
3. 用`comment`作为文本形成 [msg.dataText](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L103)。
4. 形成包含 `destination_address`、空`public_key`、`amount`和`msg.dataText`的[msg.message](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L113)。
5. 形成包含一组传出消息的[Action](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L154)。
6. 使用 [createQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L292) 和 [sendQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L300) 查询向外发送付款。
7. The service should regularly poll the [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) method of the `wallet` contract. By matching confirmed transactions with outgoing payments (`destination_address`, `value`, `comment`) the service can mark payments as finished and retrieve and display the transaction hash and logical time (lt) to the user.
8. 对 `v3` 高负载钱包的请求默认有 60 秒的过期时间。在此时间之后，未处理的请求可以安全地重新发送到网络（参见步骤 3-6）。 After expiration, unprocessed requests can be safely resent following steps 3-6.

:::caution
If the attached `value` is too small, the transaction may fail with the error `cskip_no_gas`. n this case, Toncoins will be transferred, but no logic will be executed on the recipient's side (the TVM will not launch). Read more [here](/v3/documentation/network/configs/blockchain-configs#param-20-and-21).
:::

### Get the transaction ID

可以看出，要获取更多的交易信息，用户必须通过 [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) 函数扫描区块链。
发送信息后不可能立即获取交易 ID，因为交易必须首先由区块链网络确认。
要了解所需的流水线，请仔细阅读 [发送付款](/v3/guidelines/dapps/asset-processing/payments-processing/#send-payments)，尤其是第 7 点。
It is not possible to get the transaction ID immediately after sending the message, as the transaction must first be confirmed by the blockchain network.
To understand the required pipeline, carefully read [Send payments](/v3/guidelines/dapps/asset-processing/payments-processing/#send-payments), especially the 7th point.

## Invoice-based approach

要基于附加评论接受支付，服务应：

1. 部署 `wallet` 合约。
2. 为每个用户生成一个唯一的 **`invoice`（发票）**。使用 uuid32 的字符串表示形式即可满足需求。 A uuid32 string is sufficient for invoice identification.
3. 应指示用户向服务的 `wallet`合约发送 Toncoin，并附上 "发票 "作为注释。
4. 服务应定期轮询 `wallet`合约的 [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) 方法。
5. For each new transaction extract the incoming message, match the comment against stored invoice data, and deposit the Toncoin value into the user's account.

To calculate the **incoming message value** that a message brings to a contract, we need to analyze the transaction. This happens when a message enters the contract. The transaction can be retrieved using [getTransactions](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L268). For an incoming wallet transaction, the correct data consists of one incoming message and zero outgoing messages. Otherwise, either an outgoing message is sent to the wallet, in which case the owner spends the Toncoin, or the wallet is not deployed and the incoming transaction is returned.

无论如何，一般来说，消息带给合约的金额可以计算为传入消息的价值减去传出消息的价值总和减去费用：`value_{in_msg} - SUM(value_{out_msg}) - fee`。技术上，交易表示包含三个不同的带有 `fee` 名称的字段：`fee`、 `storage_fee` 和 `other_fee`，即总费用、与存储成本相关的费用部分和与交易处理相关的费用部分。只应使用第一个。 Technically, the transaction view contains three different fields with `fee` in the name: `fee`, `storage_fee` and `other_fee`, i.e. the total fee, the portion of the fee related to storage costs, and the portion of the fee related to processing the transaction. Only the first one should be used.

### 发票 (invoice) 与 TON Connect

最适合需要在一个会话中签署多个付款/交易或需要与钱包保持一段时间连接的应用程序。

**Advantages**

- ✅ 与钱包有永久的通信渠道，用户地址信息
- ✅ 用户只需扫描一次 QR 码
- ✅ 可以了解用户是否在钱包中确认了交易，通过返回的 BOC 跟踪交易。
- ✅ 可为不同平台提供现成的 SDK 和 UI 工具包

**Disadvantages**

- ❌ 如果只需发送一笔付款，用户需要执行两个操作：连接钱包和确认交易。
- ❌ 整合比 ton:// 链接更复杂

<Button href="/v3/guidelines/ton-connect/overview/"
colorType="primary" sizeType={'lg'}>

Learn more

</Button>

### 带有 ton:// 链接的发票

:::warning
Ton 链接已被弃用，请避免使用该链接 Avoid using it.
:::

If you need an easy integration for a simple user flow, it is suitable to use the ton:// link.
It is best suited for one-time payments and invoices.

```bash
ton://transfer/<destination-address>?
    [nft=<nft-address>&]
    [fee-amount=<nanocoins>&]
    [forward-amount=<nanocoins>] 
```

**Advantages**

- ✅ 易于集成
- ✅ 无需连接钱包

**Disadvantages**

- ❌ 用户每次付款都需要扫描新的 QR 码
- ❌ 无法跟踪用户是否已签署交易
- ❌ 没有关于用户地址的信息
- ❌ 在无法点击此类链接的平台上需要采用变通方法（例如，Telegram 桌面客户端的机器人消息）。

[创建钱包，获取余额，进行转账](https://github.com/ton-community/ton#usage)

## 浏览器

区块链浏览器是 https://tonscan.org。

要在资源管理器中生成交易链接，服务需要获取逻辑时间、交易哈希值和账户地址（通过 [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) 方法获取了逻辑时间和交易哈希值的账户地址）。然后，https://tonscan.org 和 https://explorer.toncoin.org/ 可按以下格式显示该交易的页面： Then https://tonscan.org and https://explorer.toncoin.org/ can display the page for this transaction in the following format:

`https://tonviewer.com/transaction/{txhash as base64url}`

`https://tonscan.org/tx/{lt as int}:{txhash as base64url}:{account address}`

`https://explorer.toncoin.org/transaction?account={account address}&lt={lt as int}&hash={txhash as base64url}`

Note: tonviewer and tonscan also support external-in message hashes instead of transaction hashes for explorer links. This is useful when generating an external message and needing an instant transaction link. Learn more about transactions and messages hashes [here](/v3/guidelines/dapps/cookbook#how-to-find-transaction-or-message-hash).

## 最佳实践

### 创建钱包

<Tabs groupId="example-create_wallet">
<TabItem value="JS" label="JS">

- **toncenter:**
  - [创建钱包 + 获取钱包地址](https://github.com/toncenter/examples/blob/main/common.js)

- **ton-community/ton:**
  - [创建钱包 + 获取余额](https://github.com/ton-community/ton#usage)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**
  - [创建钱包 + 获取余额](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#wallet)

</TabItem>

<TabItem value="Python" label="Python">

- **psylopunk/pythonlib:**
  - [创建钱包 + 获取钱包地址](https://github.com/psylopunk/pytonlib/blob/main/examples/generate_wallet.py)
- **yungwine/pytoniq:**

```py
import asyncio

from pytoniq.contract.wallets.wallet import WalletV4R2
from pytoniq.liteclient.balancer import LiteBalancer


async def main():
    provider = LiteBalancer.from_mainnet_config(2)
    await provider.start_up()

    mnemonics, wallet = await WalletV4R2.create(provider)
    print(f"{wallet.address=} and {mnemonics=}")

    await provider.close_all()


if __name__ == "__main__":
    asyncio.run(main())
```

</TabItem>

</Tabs>

### 为不同分片创建钱包

当负载过重时，TON区块链可能会分裂成 [分片](/v3/documentation/smart-contracts/shards/shards-intro)。在 Web3 世界中，分片可以简单地比喻为网段。 A shard is similar to a network segment in Web3.

正如我们在 Web2 世界中分发服务基础设施时尽可能靠近终端用户一样，在 TON 中，我们可以将合约部署在与用户钱包或任何其他与之交互的合约相同的分片中。

例如，一个为未来的空投服务向用户收取费用的 DApp 可能会为每个分片准备单独的钱包，以提高高峰负载日的用户体验。为了达到最高的处理速度，您需要为每个分片部署一个收集器钱包。 To achieve maximum processing speed, you would need to deploy one collector wallet per shard.

The shard prefix `SHARD_INDEX` of a contract is determined by the first 4 bits of its address hash.
To deploy a wallet to a specific shard, you can use logic based on the following code snippet:

```javascript

import { NetworkProvider, sleep } from '@ton/blueprint';
import { Address, toNano } from "@ton/core";
import {mnemonicNew, mnemonicToPrivateKey} from '@ton/crypto';
import { WalletContractV3R2 } from '@ton/ton';

export async function run(provider?: NetworkProvider) {
  if(!process.env.SHARD_INDEX) {
    throw new Error("Shard index is not specified");
  }

    const shardIdx = Number(process.env.SHARD_INDEX);
    let testWallet: WalletContractV3R2;
    let mnemonic:  string[];
    do {
        mnemonic   = await mnemonicNew(24);
        const keyPair = await mnemonicToPrivateKey(mnemonic);
        testWallet = WalletContractV3R2.create({workchain: 0, publicKey: keyPair.publicKey});
    } while(testWallet.address.hash[0] >> 4 !== shardIdx);

    console.log("Mnemonic for shard found:", mnemonic);
    console.log("Wallet address:",testWallet.address.toRawString());
}

if(require.main === module) {
run();
}

```

如果是钱包合约，可以使用 `subwalletId` 代替助记符，但 [钱包应用程序](https://ton.org/wallets) 不支持 `subwalletId`。

部署完成后，您可以使用以下算法进行处理：

1. 用户来到 DApp 页面并请求操作。
2. DApp 挑选离用户最近的钱包（通过 4 位前缀匹配）
3. DApp 为用户提供付费载荷，将其费用发送到所选钱包。

这样，无论当前的网络负载如何，您都能提供最佳的用户体验。

### 向计算出的地址发送一些 Toncoin。请注意，您需要在 `non-bounce` 模式下发送，因为该地址还没有代码，无法处理收到的信息。`non-bounce` 标志表示即使处理失败，也不会通过退回消息返还钱款。我们不建议在其他交易中使用 `non-bounce` 标记，尤其是在携带大额资金时，因为退回机制在一定程度上可以防止错误。

<Tabs groupId="example-toncoin_deposit">
<TabItem value="JS" label="JS">

- **toncenter:**
  - [处理 Toncoin 存款](https://github.com/toncenter/examples/blob/main/deposits.js)
  - [处理 Toncoin 存款多钱包](https://github.com/toncenter/examples/blob/main/deposits-multi-wallets.js)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**

<details><summary>检查存款</summary>

```go
package main 

import (
	"context"
	"encoding/base64"
	"log"

	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/ton"
)

const (
	num = 10
)

func main() {
	client := liteclient.NewConnectionPool()
	err := client.AddConnectionsFromConfigUrl(context.Background(), "https://ton.org/global.config.json")
	if err != nil {
		panic(err)
	}

	api := ton.NewAPIClient(client, ton.ProofCheckPolicyFast).WithRetry()

	accountAddr := address.MustParseAddr("0QA__NJI1SLHyIaG7lQ6OFpAe9kp85fwPr66YwZwFc0p5wIu")

	// we need fresh block info to run get methods
	b, err := api.CurrentMasterchainInfo(context.Background())
	if err != nil {
		log.Fatal(err)
	}

	// we use WaitForBlock to make sure block is ready,
	// it is optional but escapes us from liteserver block not ready errors
	res, err := api.WaitForBlock(b.SeqNo).GetAccount(context.Background(), b, accountAddr)
	if err != nil {
		log.Fatal(err)
	}

	lastTransactionId := res.LastTxHash
	lastTransactionLT := res.LastTxLT

	headSeen := false

	for {
		trxs, err := api.ListTransactions(context.Background(), accountAddr, num, lastTransactionLT, lastTransactionId)
		if err != nil {
			log.Fatal(err)
		}

		for i, tx := range trxs {
			// should include only first time lastTransactionLT
			if !headSeen {
				headSeen = true
			} else if i == 0 {
				continue
			}

			if tx.IO.In == nil || tx.IO.In.Msg.SenderAddr().IsAddrNone() {
				// external message should be omitted
				continue
			}

      if tx.IO.Out != nil {
				// no outgoing messages - this is incoming Toncoins
				continue
			}

			// process trx
			log.Printf("found in transaction hash %s", base64.StdEncoding.EncodeToString(tx.Hash))
		}

		if len(trxs) == 0 || (headSeen && len(trxs) == 1) {
			break
		}

		lastTransactionId = trxs[0].Hash
		lastTransactionLT = trxs[0].LT
	}
}
```

</details>
</TabItem>

<TabItem value="Python" label="Python">

- **yungwine/pytoniq:**

<summary>检查存款</summary>

```python
import asyncio

from pytoniq_core import Transaction

from pytoniq import LiteClient, Address

MY_ADDRESS = Address("kf8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM_BP")


async def main():
    client = LiteClient.from_mainnet_config(ls_i=0, trust_level=2)

    await client.connect()

    last_block = await client.get_trusted_last_mc_block()

    _account, shard_account = await client.raw_get_account_state(MY_ADDRESS, last_block)
    assert shard_account

    last_trans_lt, last_trans_hash = (
        shard_account.last_trans_lt,
        shard_account.last_trans_hash,
    )

    while True:
        print(f"Waiting for{last_block=}")

        transactions = await client.get_transactions(
            MY_ADDRESS, 1024, last_trans_lt, last_trans_hash
        )
        toncoin_deposits = [tx for tx in transactions if filter_toncoin_deposit(tx)]
        print(f"Got {len(transactions)=} with {len(toncoin_deposits)=}")

        for deposit_tx in toncoin_deposits:
            # Process toncoin deposit transaction
            print(deposit_tx.cell.hash.hex())

        last_trans_lt = transactions[0].lt
        last_trans_hash = transactions[0].cell.hash


def filter_toncoin_deposit(tx: Transaction):
    if tx.out_msgs:
        return False

    if tx.in_msg:
        return False

    return True


if __name__ == "__main__":
    asyncio.run(main())
```

</TabItem>
</Tabs>

### 提取 Toncoin （发送 toncoin ）

<Tabs groupId="example-toncoin_withdrawals">
<TabItem value="JS" label="JS">

- **toncenter:**
  - [分批从钱包中提取 Toncoin](https://github.com/toncenter/examples/blob/main/withdrawals-highload-batch.js)
  - [从钱包中提取 Toncoin](https://github.com/toncenter/examples/blob/main/withdrawals-highload.js)

- **ton-community/ton:**
  - [从钱包中提取 Toncoin](https://github.com/ton-community/ton#usage)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**
  - [从钱包中提取 Toncoin](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#wallet)

</TabItem>

<TabItem value="Python" label="Python">

- **yungwine/pytoniq:**

```python
import asyncio

from pytoniq_core import Address
from pytoniq.contract.wallets.wallet import WalletV4R2
from pytoniq.liteclient.balancer import LiteBalancer


MY_MNEMONICS = "one two tree ..."
DESTINATION_WALLET = Address("Destination wallet address")


async def main():
    provider = LiteBalancer.from_mainnet_config()
    await provider.start_up()

    wallet = await WalletV4R2.from_mnemonic(provider, MY_MNEMONICS)

    await wallet.transfer(DESTINATION_WALLET, 5)
    
    await provider.close_all()


if __name__ == "__main__":
    asyncio.run(main())
```

</TabItem>

</Tabs>

### 获取合约交易

<Tabs groupId="example-get_transactions">
<TabItem value="JS" label="JS">

- **ton-community/ton:**
  - [使用 getTransaction 方法的客户端](https://github.com/ton-community/ton/blob/master/src/client/TonClient.ts)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**
  - [获取交易](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#account-info-and-transactions)

</TabItem>

<TabItem value="Python" label="Python">

- **yungwine/pytoniq:**
  - [获取交易](https://github.com/yungwine/pytoniq/blob/master/examples/transactions.py)

</TabItem>

</Tabs>

## SDK

各种编程语言（JS、Python、Golang 等）的 SDK 完整列表 [此处](/v3/guidelines/dapps/apis-sdks/sdk)。 is available [here](/v3/guidelines/dapps/apis-sdks/sdk).

<Feedback />

