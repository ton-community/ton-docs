
import Button from '@site/src/components/button'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 付款处理

本页面包含了关于在TON区块链上处理（发送和接收）数字资产的概览和具体细节。

:::tip
建议在阅读本教程之前先熟悉一下 [资产处理概述](/v3/documentation/dapps/assets/overview)。
:::

## 钱包智能合约

TON 网络上的钱包智能合约允许外部参与者与区块链实体互动。

- 验证所有者身份：拒绝试图代表非所有者处理或支付费用的请求。
- 提供重放保护：防止重复执行同一请求，如向另一个智能合约发送资产。
- 启动与其他智能合约的任意交互。

第一个挑战的标准解决方案是公钥加密法：`钱包` 存储公钥，并检查传入的请求信息是否由相应的私钥签名，而该私钥只有所有者知道。

第三个挑战的解决方案也很常见；一般来说，请求包含一个完整的内部信息，由 `钱包` 发送到网络。不过，对于重放保护，有几种不同的方法。

### 自托管服务

基于 Seqno 的钱包使用最简单的方法对消息进行排序。每条信息都有一个特殊的 "seqno "整数，必须与存储在 `wallet`智能合约中的计数器一致。`钱包` 会在每次请求时更新计数器，从而确保一个请求不会被处理两次。有几个 `钱包` 版本在公开可用的方法上有所不同：可以通过过期时间限制请求，也可以使用相同的公钥拥有多个钱包。不过，这种方法的一个固有要求是逐个发送请求，因为 `seqno` 序列中的任何间隙都会导致无法处理所有后续请求。

### 高负载钱包

这种 `钱包` 类型采用的方法是在智能合约存储中存储已处理的未过期请求的标识符。在这种方法中，任何请求都会被检查是否与已处理的请求重复，如果检测到重复请求，就会丢弃。由于过期，合约可能不会永久存储所有请求，但会删除因过期限制而无法处理的请求。向该 `钱包` 发出的请求可以并行发送，不会受到干扰，但这种方法需要对请求处理进行更复杂的监控。

### 社区制作

要通过 TonLib 部署钱包，您需要

1. [创建钱包，获取余额，进行转账](https://github.com/ton-community/ton#usage)
2. 形成与已启用的`钱包`之一相对应的 [InitialAccountWallet](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L62) 结构。目前可用的有：`wallet.v3`、`wallet.v4`、`wallet.highload.v1`、`wallet.highload.v2`。
3. 通过 [getAccountAddress](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L283) 方法计算新的 `wallet` 智能合约的地址。我们建议使用默认版本`0`，并在基链`workchain=0`中部署钱包，以降低处理和存储费用。
4. 向计算出的地址发送一些 Toncoin。请注意，您需要在 `non-bounce` 模式下发送，因为该地址还没有代码，无法处理收到的信息。`non-bounce` 标志表示即使处理失败，也不会通过退回消息返还钱款。我们不建议在其他交易中使用 `non-bounce` 标记，尤其是在携带大额资金时，因为退回机制在一定程度上可以防止错误。
5. 形成所需的 [action](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L154)，例如只用于部署的 `actionNoop`。然后使用 [createQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L292) 和 [sendQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L300) 启动与区块链的交互。
6. 使用 [getAccountState](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L288) 方法在几秒钟内检查合约。

:::tip
在[钱包教程](/v3/guidelines/smart-contracts/howto/wallet#-deploying-a-wallet)中阅读更多内容。
:::

### 社区制作

使用psylopunk/pytonlib（The Open Network的简单Python客户端）：

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

## TON 上的数字资产

### 检查合约交易

可以使用 [getTransactions](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get) 获取合约的交易。该方法允许从某个 `last_transaction_id`和更早的交易中获取 10 个交易。要处理所有收到的交易，应遵循以下步骤：

1. 可以使用 [getAddressInformation](https://toncenter.com/api/v2/#/accounts/get_address_information_getAddressInformation_get) 获取最新的 `last_transaction_id`。
2. 应通过 `getTransactions` 方法加载10笔交易。
3. 处理输入信息中来源不为空且目的地等于账户地址的交易。
4. 应加载接下来的 10 笔交易，然后重复步骤 2、3、4、5，直到处理完所有收到的交易。

### 检索传入/传出交易

可以在事务处理过程中跟踪消息流。由于消息流是一个 DAG，因此只需使用 [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) 方法获取当前事务，并使用 [tryLocateResultTx](https://testnet.toncenter.com/api/v2/#/transactions/get_try_locate_result_tx_tryLocateResultTx_get) 通过 `out_msg` 找到传入事务，或使用 [tryLocateSourceTx](https://testnet.toncenter.com/api/v2/#/transactions/get_try_locate_source_tx_tryLocateSourceTx_get) 通过 `in_msg` 找到传出事务。

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

### 基于 Seqno 的钱包

:::tip
从 [TMA USDT 支付演示](https://github.com/ton-community/tma-usdt-payments-demo) 了解支付处理的基本示例
:::

1. 服务应部署一个 `钱包`，并保持其资金充足，以防止因存储费用而导致合约毁坏。请注意，存储费一般每年少于 1  Toncoin 。
2. 服务应从用户处获取 `destination_address` 和可选的 `comment`。请注意，在此期间，我们建议禁止未完成的、具有相同（`destination_address`, `value`, `comment`）设置的外发付款，或适当安排这些付款的时间；这样，只有在上一笔付款得到确认后，才会启动下一笔付款。
3. 用`comment`作为文本形成 [msg.dataText](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L103)。
4. 形成包含 `destination_address`、空`public_key`、`amount`和`msg.dataText`的[msg.message](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L113)。
5. 形成包含一组传出消息的[Action](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L154)。
6. 使用 [createQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L292) 和 [sendQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L300) 查询向外发送付款。
7. 服务应定期轮询  `wallet` 合约的 [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) 方法。通过（`destination_address`, `value`, `comment`）匹配已确认的交易和已发出的付款，可以将付款标记为已完成；检测并向用户显示相应的交易哈希值和逻辑时间。
8. 对 `v3` 高负载钱包的请求默认有 60 秒的过期时间。在此时间之后，未处理的请求可以安全地重新发送到网络（参见步骤 3-6）。

:::caution
如果附加的 `value` 太小，交易会因错误 `cskip_no_gas` 而中止。在这种情况下， Toncoin 将被成功转移，但另一方的逻辑不会被执行（TVM 甚至不会启动）。关于 gas 限制，您可以在 [此处](/v3/documentation/network/configs/blockchain-configs#param-20and-21) 阅读更多信息。
:::

### 高负载钱包

可以看出，要获取更多的交易信息，用户必须通过 [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) 函数扫描区块链。
发送信息后不可能立即获取交易 ID，因为交易必须首先由区块链网络确认。
要了解所需的流水线，请仔细阅读 [发送付款](/v3/guidelines/dapps/asset-processing/payments-processing/#send-payments)，尤其是第 7 点。

## 与区块链的互动

可以通过TonLib在TON区块链上进行基本操作。TonLib是一个共享库，可以与TON节点一起编译，并通过所谓的lite服务器（轻客户端服务器）公开API以与区块链互动。TonLib通过检查所有传入数据的证明采取无信任方法；因此，不需要可信数据提供者。TonLib的可用方法列在[TL方案中](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L234)。它们可以通过像[pyTON](https://github.com/EmelyanenkoK/pyTON)或[tonlib-go](https://github.com/mercuryoio/tonlib-go/tree/master/v2)（技术上这些是`tonlibjson`的包装器）这样的包装器或通过`tonlib-cli`使用共享库。

1. 部署 `wallet` 合约。
2. 为每个用户生成一个唯一的 **`invoice`（发票）**。使用 uuid32 的字符串表示形式即可满足需求。
3. 应指示用户向服务的 `wallet`合约发送 Toncoin，并附上 "发票 "作为注释。
4. 服务应定期轮询 `wallet`合约的 [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) 方法。
5. 对于新交易，应提取收到的信息，将 `comment` 与数据库匹配，并将 **收到的信息值** 存入用户账户。

要通过TonLib部署钱包，需要：

无论如何，一般来说，消息带给合约的金额可以计算为传入消息的价值减去传出消息的价值总和减去费用：`value_{in_msg} - SUM(value_{out_msg}) - fee`。技术上，交易表示包含三个不同的带有 `fee` 名称的字段：`fee`、 `storage_fee` 和 `other_fee`，即总费用、与存储成本相关的费用部分和与交易处理相关的费用部分。只应使用第一个。

### 发票 (invoice) 与 TON Connect

最适合需要在一个会话中签署多个付款/交易或需要与钱包保持一段时间连接的应用程序。

- ✅ 与钱包有永久的通信渠道，用户地址信息

- ✅ 用户只需扫描一次 QR 码

- ✅ 可以了解用户是否在钱包中确认了交易，通过返回的 BOC 跟踪交易。

- ✅ 可为不同平台提供现成的 SDK 和 UI 工具包

- ❌ 如果只需发送一笔付款，用户需要执行两个操作：连接钱包和确认交易。

- ❌ 整合比 ton:// 链接更复杂

<Button href="/v3/guidelines/ton-connect/overview/"
colorType="primary" sizeType={'lg'}>

无论如何，一般来说，消息带给合约的金额可以计算为传入消息的价值减去传出消息的价值总和减去费用：`value_{in_msg} - SUM(value_{out_msg}) - fee`。技术上，交易表示包含三个不同的带有`费用`名称的字段：`费用`、`存储费用`和`其他费用`，即总费用、与存储成本相关的费用部分和与交易处理相关的费用部分。只应使用第一个。

</Button>

### 带有 ton:// 链接的发票

:::warning
Ton 链接已被弃用，请避免使用该链接
:::

如果您需要轻松集成简单的用户流程，则适合使用 ton:// 链接。
最适合一次性付款和发票。

```bash
ton://transfer/<destination-address>?
    [nft=<nft-address>&]
    [fee-amount=<nanocoins>&]
    [forward-amount=<nanocoins>] 
```

- ✅ 易于集成

- ✅ 无需连接钱包

- ❌ 用户每次付款都需要扫描新的 QR 码

- ❌ 无法跟踪用户是否已签署交易

- ❌ 没有关于用户地址的信息

- ❌ 在无法点击此类链接的平台上需要采用变通方法（例如，Telegram 桌面客户端的机器人消息）。

要基于附加评论接受支付，服务应：

## 浏览器

区块链浏览器是 https://tonscan.org。

要在资源管理器中生成交易链接，服务需要获取逻辑时间、交易哈希值和账户地址（通过 [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) 方法获取了逻辑时间和交易哈希值的账户地址）。然后，https://tonscan.org 和 https://explorer.toncoin.org/ 可按以下格式显示该交易的页面：

如果您需要为简单用户流程进行简便集成，使用ton://链接是合适的。
最适合一次性支付和发票。

`https://tonscan.org/tx/{lt as int}:{txhash as base64url}:{account address}`

`https://explorer.toncoin.org/transaction?account={account address}&lt={lt as int}&hash={txhash as base64url}`

请注意，tonviewer 和 tonscan 支持外部信息哈希值，而不是资源管理器中链接的事务哈希值。
当您生成外部信息并希望即时生成链接时，这将非常有用。
有关事务和消息哈希值的更多信息 [此处](/v3/guidelines/dapps/cookbook#how-to-find-transaction-or-message-hash)

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

当负载过重时，TON区块链可能会分裂成 [分片](/v3/documentation/smart-contracts/shards/shards-intro)。在 Web3 世界中，分片可以简单地比喻为网段。

正如我们在 Web2 世界中分发服务基础设施时尽可能靠近终端用户一样，在 TON 中，我们可以将合约部署在与用户钱包或任何其他与之交互的合约相同的分片中。

例如，一个为未来的空投服务向用户收取费用的 DApp 可能会为每个分片准备单独的钱包，以提高高峰负载日的用户体验。为了达到最高的处理速度，您需要为每个分片部署一个收集器钱包。

合约的分片前缀 `SHARD_INDEX` 由其地址哈希值的前 4 位定义。
为了将钱包部署到特定的分片，可以使用基于以下代码片段的逻辑：

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

### 浏览器

<Tabs groupId="example-toncoin_deposit">
<TabItem value="JS" label="JS">

- **toncenter:**
  - [处理 Toncoin 存款](https://github.com/toncenter/examples/blob/main/deposits.js)
  - [处理 Toncoin 存款多钱包](https://github.com/toncenter/examples/blob/main/deposits-multi-wallets.js)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**

<details>
<summary>检查存款</summary>

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

各种编程语言（JS、Python、Golang 等）的 SDK 完整列表 [此处](/v3/guidelines/dapps/apis-sdks/sdk)。
