import Feedback from '@site/src/components/Feedback';

# FAQ

This section answers the most popular questions about the TON Blockchain.

## مرور کلی

### آیا می‌توانید یک مرور کلی از TON ارائه دهید؟

- [مقدمه‌ای بر شبکه باز](/v3/concepts/dive-into-ton/introduction)
- [بلاکچین TON بر اساس توافق PoS طراحی شده است](https://blog.ton.org/the-ton-blockchain-is-based-on-pos-consensus)
- [مقاله‌های سفید تون](/v3/documentation/whitepapers/overview)

### چه شباهت‌ها و تفاوت‌های اصلی با بلاک‌چین‌های EVM دارد؟

- [اتریوم به TON](/v3/concepts/dive-into-ton/go-from-ethereum/tvm-vs-evm)
- [مقایسه TON، Solana و Ethereum ۲٫۰](https://ton.org/comparison_of_blockchains.pdf)

### آیا TON یک محیط آزمایشی دارد؟

- [Testnet](/v3/documentation/smart-contracts/getting-started/testnet)

## TON و L2

### Why are workchains better than L1 → L2?

Workchains in TON offer several advantages over traditional L1 and L2 layer architecture:

1. **Instantaneous transactions**

One of blockchain's key advantages is the instantaneous processing of transactions. In traditional L2 solutions, there can be delays in moving assets between layers. WorkChains eliminate this problem by providing seamless and instantaneous transactions across the network. This is especially important for applications requiring high speed and low latency.

2. **Cross-shard activity**

WorkChains support cross-shard activity, allowing users to interact between different ShardChains or WorkChains within the same network. In current L2 solutions, cross-shard operations are complex and often require additional bridges or interoperability solutions. In TON, users can easily exchange tokens or perform other transactions between different ShardChains without complicated procedures.

3. **Scalability**

Scalability is a significant challenge for modern blockchain systems. In traditional L2 solutions, scalability is limited by the capacity of the sequencer. If the transactions per second (TPS) on L2 exceed the sequencer's capacity, it can cause problems. In TON, WorkChains solve this problem by dividing a shard when the load exceeds its capacity. This allows the system to scale almost without limits.

### آیا نیازی به L2 در TON وجود دارد؟

While the TON platform offers highly optimized transaction fees and low latency, some applications may require lower transaction costs or further reduced latency. L2 solutions may be needed to meet specific application requirements in such cases. Thus, the need for L2 on TON could arise.

## MEV (Maximum Extractable Value)

### Is front-running possible in TON?

In the TON Blockchain, deterministic transaction ordering is critical to prevent front-running. Once transactions enter the pool, their order is predetermined and cannot be altered by any participant. This system ensures that no one can manipulate the order of transactions for profit.
Unlike blockchains such as Ethereum, where validators can change the order of transactions within a block, creating opportunities for MEV, TON’s architecture eliminates this possibility.

Additionally, TON does not rely on a market-based mechanism to determine transaction fees. Commissions are fixed and do not fluctuate based on transaction priority. This lack of fee variability further reduces the incentive and feasibility of front-running.
Due to the combination of fixed fees and deterministic transaction ordering,front-running in TON is not a trivial task.

## بلاک

### روش RPC مورد استفاده برای دریافت اطلاعات بلاک چیست؟

Validators produce blocks, and existing blocks can be accessed via liteservers, which are available through lite clients. Additionally, third-party tools like wallets, explorers, and dApps are built on top of lite clients.

To access the core lite client, visit our GitHub repository:

[ton-blockchain/tonlib](https://github.com/ton-blockchain/ton/tree/master/tonlib)

Here are three popular third-party block explorers:

- [TON Explorer](https://explorer.toncoin.org/last)
- [TON Center](https://toncenter.com/)
- [TON Whales Explorer](https://tonwhales.com/explorer)

For more information, refer to our documentation's [Explorers in TON](/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton) section.

### **زمان بلاک**

_Block time: 2-5 seconds_

:::info
You can compare TON's on-chain metrics, including block time and time-to-finality, with Solana and Ethereum by reading our analysis at:

- [مستند مقایسه بلاکچین‌ها](https://ton.org/comparison_of_blockchains.pdf)
- [جدول مقایسه بلاکچین‌ها (کمتر آموزنده از مستند، اما بیشتر بصری)](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-comparison)
  :::

### زمان تا نهایی شدن

_Time-to-finality: under 6 seconds_
:::info
Compare TON's on-chain metrics, including block time and time-to-finality, with Solana and Ethereum by reading our analysis at:

- [مستند مقایسه بلاکچین‌ها](https://ton.org/comparison_of_blockchains.pdf)
- [جدول مقایسه بلاکچین‌ها (کمتر آموزنده از مستند، اما بیشتر بصری)](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-comparison)
  :::

### میانگین اندازه بلاک

```bash
max block size param 29
max_block_bytes:2097152
```

:::info
For more up-to-date parameters, refer to the [Network configs](/v3/documentation/network/configs/network-configs) section.
:::

### طرح‌بندی بلاک‌ها در TON چگونه است؟

For detailed explanations of each field in the block layout, visit the [Block layout](/v3/documentation/data-formats/tlb/block-layout).

## تراکنش‌ها

### روش RPC برای گرفتن داده‌های تراکنش

For details, please refer to the previous answer:

- [See answer above](/v3/documentation/faq#are-there-any-standardized-protocols-for-minting-burning-and-transferring-fungible-and-non-fungible-tokens-in-transactions)

### Is the TON transaction asynchronous or synchronous? Can I access documentation that shows how this system works?

TON Blockchain messages are **asynchronous**:

- The sender prepares the transaction body (message BoC) and broadcasts it via the lite client (or a higher-level tool).
- The lite client returns the status of the broadcast, not the result of executing the transaction.
- To check the desired result, the sender must monitor the state of the target account (address) or the overall blockchain state.

An explanation of how TON asynchronous messaging works is provided in the context of **wallet smart contracts**:

- [کیف‌پول‌های TON چگونه کار می‌کنند و چگونه با استفاده از JavaScript به آن‌ها دسترسی یابید](https://blog.ton.org/how-ton-wallets-work-and-how-to-access-them-from-javascript#1b-sending-a-transfer)

Example for wallet contract transfer (low-level):

- [Wallet transfer example](https://github.com/xssnick/tonutils-go/blob/master/example/wallet/main.go)

### Can a transaction be determined to be 100% finalized? Is querying the transaction-level data sufficient to obtain this information?

**Short answer:**
The receiver's account must be checked to ensure a transaction is finalized.
For more details on transaction verification, refer to the following examples:

- Go: [نمونه کیف پول](https://github.com/xssnick/tonutils-go/blob/master/example/wallet/main.go)
- پایتون: [ربات فروشگاه با پرداخت‌ها در تون](/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot)
- جاوااسکریپت: [رباتی که برای فروش دامپلینگ‌ها استفاده می‌شود](/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-js)

### طرح‌بندی یک تراکنش در TON چگونه است؟

Detailed explanations of each field in the transaction layout can be found here:

- [طرح تراکنش](/v3/documentation/data-formats/tlb/transaction-layout)

### آیا پردازش انبوه تراکنش‌ها ممکن است؟

Yes, transaction batching is possible in TON and can be achieved in two ways:

1. **Asynchronous transactions:** by sending independent transactions to the network.
2. **Using smart contracts:** smart contracts can receive tasks and execute them in batches.

نمونه‌ای از استفاده از یک قرارداد با ویژگی دسته‌بندی (کیف پول با بار زیاد):

- [High-load wallet API example](https://github.com/tonuniverse/highload-wallet-api)

Default wallets (v3/v4) also support sending multiple messages (up to 4) in a single transaction.

## استانداردها

### What currency accuracy is available for TON?

_۹ رقم_

:::info
Mainnet supports a 9-digit accuracy for currencies.
:::

### آیا پروتکل‌های استانداردی برای ضرب، سوزاندن و انتقال توکن‌های قابل تعویض و غیرقابل تعویض در تراکنش‌ها وجود دارد؟

توکن‌های غیرقابل تعویض (NFTs):

- [TEP-62: استاندارد NFT](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md)
- [مستندات NFT](/v3/documentation/dapps/defi/tokens#nft)

جتون‌ها (توکن‌ها):

- [TEP-74: استاندارد جتون‌ها](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)
- [مروری بر توکن‌های توزیع‌شده](https://telegra.ph/Scalable-DeFi-in-TON-03-30)
- [Fungible token documentation (Jettons)](/v3/documentation/dapps/defi/tokens#jettons-fungible-tokens)

Other standards:

- [TON TEPs repository](https://github.com/ton-blockchain/TEPs)

### Are there examples of parsing events with Jettons (Tokens) and NFTs?

On TON, all data is transmitted as BOC (Binary Object Container) messages. Using NFTs in transactions is treated as a regular message, similar to a transaction involving a standard wallet.

Certain indexed APIs allow you to view all messages sent to or from a contract and filter them based on your needs.

- [TON API (REST)](https://docs.tonconsole.com/tonapi/rest-api)

To understand this process better, refer to the [Payments processing](/v3/guidelines/dapps/asset-processing/payments-processing) section.

## ساختار حساب

### قالب آدرس چیست؟

- [Smart contract address](/v3/documentation/smart-contracts/addresses)

### آیا امکان داشتن حساب نام‌گذاری‌شده مشابه با ENS وجود دارد

بله، از TON DNS استفاده کنید:

- [TON DNS & domains](/v3/guidelines/web3/ton-dns/dns)

### چگونه می‌توان بین یک حساب عادی و یک قرارداد هوشمند تمایز قائل شد؟

- [همه چیز یک قرارداد هوشمند است](/v3/documentation/smart-contracts/addresses#everything-is-a-smart-contract)

### How to tell if an address is a token contract?

To identify a **Jetton** contract:

- It must implement the [Jetton standard interface (TEP-74)](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)
- It should respond to:
  - `get_wallet_data()` — for Jetton wallet contracts
  - `get_jetton_data()` —  for the main Jetton master contract

### آیا حساب‌های خاصی (مثل حساب‌های متعلق به شبکه) وجود دارند که قوانین یا روش‌های متفاوتی نسبت به بقیه دارند؟

Yes. TON includes a special master blockchain called the **MasterChain**, which holds contracts critical for network operations, including network-wide contracts with network configuration, validator-related contracts, etc.

:::info
Read more about MasterChain, WorkChains and ShardChains in TON Blockchain overview article: [Blockchain of blockchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains).
:::

A good example is a smart governance contract, which is a part of MasterChain:

- [قراردادهای مدیریت](/v3/documentation/smart-contracts/contracts-specs/governance)

## Smart contracts

### آیا امکان تشخیص رویدادهای استقرار قرارداد در TON وجود دارد؟

در TON همه چیز یک قرارداد هوشمند است [اینجا](/v3/documentation/smart-contracts/addresses#everything-is-a-smart-contract).

An account address in TON is deterministically derived from its _initial state_, consisting of the _initial code_  and _initial data_. For wallets, the initial data typically includes a public key and other parameters.
If any part of the initial state changes, the resulting address will also change.

A smart contract can exist in an _uninitialized state_, meaning it is not yet deployed on the blockchain but may still hold a non-zero balance. The initial state can be submitted to the network later via internal or external messages—these messages can be monitored to detect when a contract is deployed.

To prevent message chains from getting stuck due to missing contracts, TON uses a "bounce" feature. You can read more about it in the following articles:

- [استقرار کیف پول از طریق TonLib](/v3/guidelines/dapps/asset-processing/payments-processing#wallet-deployment)
- [پرداخت برای پردازش کوئری‌ها و ارسال پاسخ‌ها](/v3/documentation/smart-contracts/transaction-fees/forward-fees)

### آیا امکان ارتقاء قرارداد هوشمند برای کاربران آن تهدیدی محسوب می‌شود؟

The ability to upgrade smart contracts is currently a common practice and widely adopted across modern protocols. Upgradability allows developers to fix bugs, add new features, and enhance security over time.

چگونه خطرات را کاهش دهیم:

1. Choose projects with strong reputations and well-known development teams.
2. Reputable projects typically undergo independent code audits to ensure the smart contract is secure and reliable. Look for multiple completed audits from trusted auditing firms.
3. An active community and positive user feedback can serve as additional indicators of a project’s trustworthiness.
4. Review how the project handles updates. The more transparent and decentralized the upgrade process is, the lower the risk for users.

### How can users be sure that the contract owner will not change certain conditions via an update?

The contract must be verified, which means its source code is publicly available for inspection. This allows users to confirm whether any upgrade logic is present. If the contract contains no mechanisms for modification, its behavior and terms are guaranteed to remain unchanged after deployment.

In some cases, upgrade logic may exist, but control over it can be transferred to an "empty" or null address. This effectively removes the ability to make future changes.

### Is it possible to redeploy code to an existing address, or must it be deployed as a new contract?

Yes, updating a contract's code at the same address is possible if the smart contract includes logic—typically through the `set_code()` instruction.

However, if a contract is not designed to execute `set_code()` internally or via external code, it is immutable. In this case, the contract's code cannot be changed, and it is impossible to redeploy a different contract to the same address.

### آیا قرارداد هوشمند را می‌توان حذف کرد?

Yes. A smart contract can be deleted in one of two ways:

- Through storage fee accumulation—if the contract’s balance drops to -1 TON, it will be automatically deleted.
- By sending a message with [mode 160](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes).

### Are smart contract addresses case-sensitive?

Yes, smart contract addresses are case-sensitive because they are encoded using the [base64 algorithm](https://en.wikipedia.org/wiki/Base64). You can learn more about how smart contract addresses work [here](/v3/documentation/smart-contracts/addresses).

### آیا ماشین مجازی تون (TVM) با EVM سازگار است?

No, the TON Virtual Machine (TVM) is incompatible with the Ethereum Virtual Machine (EVM).
TON uses an entirely different architecture: **asynchronous**, while Ethereum operates synchronously.

[زمان آن رسیده است که چیزی جدید را امتحان کنید: قراردادهای هوشمند ناهمزمان](https://telegra.ph/Its-time-to-try-something-new-Asynchronous-smart-contracts-03-25).

### Can smart contracts be written in Solidity on TON?

Relatedly, the TON ecosystem doesn't support development using Ethereum's Solidity language.

However, extending Solidity with asynchronous messaging and low-level data access would end up with something like FunC.

FunC is TON's native smart contract language. It features a syntax similar to many modern programming languages and was explicitly built for TON's architecture.

## فراخوانی رویه‌های راه دور (RPCs)

### Recommended node providers for data extraction

انواع API:

Learn more about the different [API Types](/v3/guidelines/dapps/apis-sdks/api-types) available in TON, including Indexed, HTTP, and ADNL.

شرکای ارائه‌دهنده گره:

- [TON Center API (v2)](https://toncenter.com/api/v2/)
- [GetBlock](https://getblock.io/)
- [TON Access by Orbs](https://www.orbs.com/ton-access/)
- [TON API by TON Center](https://github.com/toncenter/ton-http-api)
- [NOWNodes](https://nownodes.io/nodes)
- [DTON GraphQL API](https://dton.io/graphql)

**TON Directory**
Explore a wide range of TON-related projects and tools curated by the community:

- [ton.app](https://ton.app/)

### Below are two primary resources for accessing information about public node endpoints on the TON Blockchain, including both Mainnet and Testnet.

- [Network configs](/v3/documentation/network/configs/network-configs)
- [مثال‌ها و آموزش‌ها](/v3/guidelines/dapps/overview#tutorials-and-examples)

<Feedback />

