
import Button from '@site/src/components/button'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Payments processing

This page **explains how to process** (send and accept) `digital assets` on the TON blockchain.
It **mostly** describes how to work with `TON coins`, but **theoretical part** is **important** even if you want to process only `jettons`.

## Wallet smart contract

Wallet smart contracts are contracts on the TON Network which serve the task of allowing actors outside the blockchain to interact with blockchain entities. Generally, it solves three challenges:
* authenticates owner: Rejects to process and pay fees for non-owners' requests.
* replays protection: Prohibits the repetitive execution of one request, for instance sending assets to some other smart contract.
* initiates arbitrary interaction with other smart contracts.

Standard solution for the first challenge is public-key cryptography: `wallet` stores the public key and checks that an incoming message with a request is signed by the corresponding private key which is known only by the owner.

The solution to the third challenge is common as well; generally, a request contains a fully formed inner message `wallet` sends to the network. However, for replay protection, there are a few different approaches.

### Seqno-based wallets
Seqno-based wallets follow the most simple approach to sequencing messages. Each message has a special `seqno` integer that must coincide with the counter stored in the `wallet` smart contract. `wallet` updates its counter on each request, thus ensuring that one request will not be processed twice. There are a few `wallet` versions that differ in publicly available methods: the ability to limit requests by expiration time, and the ability to have multiple wallets with the same public key. However, an inherent requirement of that approach is to send requests one by one, since any gap in `seqno` sequence will result in the inability to process all subsequent requests.

### High-load wallets
This `wallet` type follows an approach based on storing the identifier of the non-expired processed requests in smart-contract storage. In this approach, any request is checked for being a duplicate of an already processed request and, if a replay is detected, dropped. Due to expiration, the contract may not store all requests forever, but it will remove those that cannot be processed due to the expiration limit. Requests to this `wallet` may be sent in parallel without interfering with each other; however, this approach requires more sophisticated monitoring of request processing.

### Wallet deployment
To deploy a wallet via TonLib one needs to:
1. Generate a private/public key pair via [createNewKey](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L244) or its wrapper functions (example in [tonlib-go](https://github.com/mercuryoio/tonlib-go/tree/master/v2#create-new-private-key)). Note that the private key is generated locally and does not leave the host machine.
2. Form [InitialAccountWallet](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L62) structure corresponding to one of the enabled `wallets`. Currently `wallet.v3`, `wallet.v4`, `wallet.highload.v1`, `wallet.highload.v2` are available.
3. Calculate the address of a new `wallet` smart contract via the [getAccountAddress](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L283) method. We recommend using a default revision `0` and also deploying wallets in the basechain `workchain=0` for lower processing and storage fees.
4. Send some Toncoin to the calculated address. Note that you need to send them in `non-bounce` mode since this address has no code yet and thus cannot process incoming messages. `non-bounce` flag indicates that even if processing fails, money should not be returned with a bounce message. We do not recommend using the `non-bounce` flag for other transactions, especially when carrying large sums, since the bounce mechanism provides some degree of protection against mistakes.
5. Form the desired [action](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L154), for instance `actionNoop` for deploy only. Then use [createQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L292) and [sendQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L300) to initiate interactions with the blockchain.
6. Check the contract in a few seconds with [getAccountState](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L288) method.

:::tip
Read more in the [Wallet Tutorial](/develop/smart-contracts/tutorials/wallet#-deploying-a-wallet)
:::

### Check the validity of wallet address

Most SDKs force you to verify address (most verify it during wallet creation or transaction preparation process), so, usually, it's not require any additional complex steps from you.

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
Full Address description on the [Smart Contract Addresses](/learn/overviews/addresses) page.
:::


## Work with transfers

### Check contract's transactions
A contract's transactions can be obtained using [getTransactions](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get). This method allows to get 10 transactions from some `last_transaction_id` and earlier. To process all incoming transactions, the following steps should be followed:
1. The latest `last_transaction_id` can be obtained using [getAddressInformation](https://toncenter.com/api/v2/#/accounts/get_address_information_getAddressInformation_get)
2. List of 10 transactions should be loaded via the `getTransactions` method.
3. Process transactions with not empty source in incoming message and destination equals to account address.
4. The next 10 transactions should be loaded and steps 2,3,4,5 should be repeated until you processed all incoming transactions.

### Get incoming/outgoing transactions
It's possible to track messages flow during transaction processing. Since the message flow is a DAG it's enough to get current transaction using [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) method and find incoming transaction by `out_msg` with [tryLocateResultTx](https://testnet.toncenter.com/api/v2/#/transactions/get_try_locate_result_tx_tryLocateResultTx_get) or outgoing transactions by `in_msg` with [tryLocateSourceTx](https://testnet.toncenter.com/api/v2/#/transactions/get_try_locate_source_tx_tryLocateSourceTx_get).

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

### Send payments

1. Service should deploy a `wallet` and keep it funded to prevent contract destruction due to storage fees. Note that storage fees are generally less than 1 Toncoin per year.
2. Service should get from the user `destination_address` and optional `comment`. Note that for the meantime, we recommend either prohibiting unfinished outgoing payments with the same (`destination_address`, `value`, `comment`) set or proper scheduling of those payments; that way, the next payment is initiated only after the previous one is confirmed.
3. Form [msg.dataText](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L103) with `comment` as text.
4. Form [msg.message](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L113) which contains `destination_address`, empty `public_key`, `amount` and `msg.dataText`.
5. Form [Action](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L154) which contains a set of outgoing messages.
6. Use [createQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L292) and [sendQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L300) queries to send outgoing payments.
7. Service should regularly poll the [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) method for the `wallet` contract. Matching confirmed transactions with the outgoing payments by (`destination_address`, `value`, `comment`) allows to mark payments as finished; detect and show the user the corresponding transaction hash and lt (logical time).
8. Requests to `v3` of `high-load` wallets have an expiration time equal to 60 seconds by default. After that time unprocessed requests can be safely resent to the network (see steps 3-6).

:::caution
If `value` attached is too small transaction can get aborted with error `cskip_no_gas`. In this case Toncoins will be transferred successfully but no logic on other side will be executed (TVM won't even launch). About gas limits you can read more [here](/develop/howto/blockchain-configs#param-20-and-21). 
:::

### Get transaction id

It can be unclear that to get more information on transaction user must scan blockchain through [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) function.
It is impossible to retrieve the transaction ID immediately after sending a message, as the transaction must first be confirmed by the blockchain network.
To understand required pipeline read [Send payments](https://docs.ton.org/develop/dapps/asset-processing/#send-payments) carefully, especially 7th point.

## Invoice-based approach
To accept payments based on attached comments, the service should
1. Deploy the `wallet` contract.
2. Generate a unique `invoice` for each user. String representation of uuid32 will be enough.
3. Users should be instructed to send Toncoin to the service's `wallet` contract with an attached `invoice` as a comment.
4. Service should regularly poll the [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) method for the `wallet` contract.
5. For new transactions, the incoming message should be extracted, `comment` matched against the database, and the **incoming message value** deposited to the user's account.

To calculate the **incoming message value** that the message brings to the contract, one needs to parse the transaction. It happens when the message hits the contract. A transaction can be obtained using [getTransactions](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L268). For an incoming wallet transaction, the correct data consists of one incoming message and zero outgoing messages. Otherwise, either an external message is sent to the wallet, in which case the owner spends Toncoin, or the wallet is not deployed and the incoming transaction bounces back.

Anyway, in general, the amount that a message brings to the contract can be calculated as the value of the incoming message minus the sum of the values of the outgoing messages minus the fee: `value_{in_msg} - SUM(value_{out_msg}) - fee`. Technically, transaction representation contains three different fields with `fee` in name: `fee`, `storage_fee`, and `other_fee`, that is, a total fee, a part of the fee related to storage costs, and a part of the fee related to transaction processing. Only the first one should be used.

### Invoices with TON Connect

Best suited for dApps that need to sign multiple payments/transactions within a session or need to maintain a connection to the wallet for some time.

- ✅ There's a permanent communication channel with the wallet, information about the user's address
- ✅ Users only need to scan a QR code once
- ✅ It's possible to find out whether the user confirmed the transaction in the wallet, track the transaction by the returned BOC
- ✅ Ready-made SDKs and UI kits are available for different platforms

- ❌ If you only need to send one payment, the user needs to take two actions: connect the wallet and confirm the transaction
- ❌ Integration is more complex than the ton:// link

````mdx-code-block
<Button href="/develop/dapps/ton-connect/"
colorType="primary" sizeType={'lg'}>
````
Learn More
````mdx-code-block
</Button>
````

### Invoices with ton:// link

:::warning
Ton link is deprecated, avoid using this
:::

If you need an easy integration for a simple user flow, it is suitable to use the ton:// link.
Best suited for one-time payments and invoices.

```bash
ton://transfer/<destination-address>?
    [nft=<nft-address>&]
    [fee-amount=<nanocoins>&]
    [forward-amount=<nanocoins>] 
```

- ✅ Easy integration
- ✅ No need to connect a wallet

- ❌ Users need to scan a new QR code for each payment
- ❌ It's not possible to track whether the user has signed the transaction or not
- ❌ No information about the user's address
- ❌ Workarounds are needed on platforms where such links are not clickable (e.g. messages from bots for Telegram desktop clients )


[Learn more about ton links here](https://github.com/tonkeeper/wallet-api#payment-urls)

## Explorers

The blockchain explorer is https://tonscan.org.

To generate a transaction link in the explorer, the service needs to get the lt (logic time), transaction hash, and account address (account address for which lt and txhash were retrieved via the [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) method). https://tonscan.org and https://explorer.toncoin.org/ may then show the page for that tx in the following format:

`https://tonviewer.com/transaction/{txhash as base64url}`

`https://tonscan.org/tx/{lt as int}:{txhash as base64url}:{account address}`

`https://explorer.toncoin.org/transaction?account={account address}&lt={lt as int}&hash={txhash as base64url}`

Note that tonviewer and tonscan supports external-in msg hash instead of transaction hash for link in explorer. 
That can become useful when you generate external message and want instant link generation.
More about transactions and messages hashes [here](/develop/dapps/cookbook#how-to-find-transaction-or-message-hash)
 
## Best Practices

### Wallet creation

<Tabs groupId="example-create_wallet">
<TabItem value="JS" label="JS">

- **toncenter:**
  - [Wallet creation + get wallet address](https://github.com/toncenter/examples/blob/main/common.js)

- **ton-community/ton:**
  - [Wallet creation + get balance](https://github.com/ton-community/ton#usage)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**
  - [Wallet creation + get balance](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#wallet)

</TabItem>

<TabItem value="Python" label="Python">

- **psylopunk/pythonlib:**
  - [Wallet creation + get wallet address](https://github.com/psylopunk/pytonlib/blob/main/examples/generate_wallet.py)
  
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

### Toncoin Deposits (Get toncoins)

<Tabs groupId="example-toncoin_deposit">
<TabItem value="JS" label="JS">

- **toncenter:**
  - [Process Toncoins deposit](https://github.com/toncenter/examples/blob/main/deposits.js)
  - [Process Toncoins deposit multi wallets](https://github.com/toncenter/examples/blob/main/deposits-multi-wallets.js)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**

<details>
<summary>Checking deposits</summary>

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

<summary>Checking deposits</summary>

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

### Toncoin Withdrawals (Send toncoins)

<Tabs groupId="example-toncoin_withdrawals">
<TabItem value="JS" label="JS">

- **toncenter:**
  - [Withdraw Toncoins from a wallet in batches](https://github.com/toncenter/examples/blob/main/withdrawals-highload-batch.js)
  - [Withdraw Toncoins from a wallet](https://github.com/toncenter/examples/blob/main/withdrawals-highload.js)

- **ton-community/ton:**
  - [Withdraw Toncoins from a wallet](https://github.com/ton-community/ton#usage)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**
  - [Withdraw Toncoins from a wallet](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#wallet)

</TabItem>

<TabItem value="Python" label="Python">

- **psylopunk/pythonlib:**
  - [Withdraw Toncoins from a wallet](https://github.com/psylopunk/pytonlib/blob/main/examples/transactions.py)

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

### Get contract's transactions

<Tabs groupId="example-get_transactions">
<TabItem value="JS" label="JS">

- **ton-community/ton:**
  - [Client with getTransaction method](https://github.com/ton-community/ton/blob/master/src/client/TonClient.ts)

</TabItem>

<TabItem value="Go" label="Go">

- **xssnick/tonutils-go:**
  - [Get transactions](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#account-info-and-transactions)

</TabItem>

<TabItem value="Python" label="Python">

- **psylopunk/pythonlib:**
  - [Get transactions](https://github.com/psylopunk/pytonlib/blob/main/examples/transactions.py)
  
- **yungwine/pytoniq:**
  - [Get transactions](https://github.com/yungwine/pytoniq/blob/master/examples/transactions.py)

</TabItem>

</Tabs>

## SDKs

You can find a list of SDKs for various languages (JS, Python, Golang, C#, Rust, etc.) list [here](/develop/dapps/apis/sdk).
