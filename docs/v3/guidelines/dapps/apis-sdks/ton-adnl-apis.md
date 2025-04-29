import Feedback from '@site/src/components/Feedback';

# TON ADNL API

There are several ways to connect to blockchain:
1. RPC data provider or another API - In most cases, you must *rely* on its stability and security.
2. **ADNL connection** - You connect to a [liteserver](/v3/guidelines/nodes/running-nodes/liteserver-node). While it may sometimes be inaccessible, a built-in validation mechanism (implemented in the library) ensures it cannot provide false data.
3. Tonlib binary - Like ADNL, you connect to a liteserver and face the same benefits and downsides. However, your application also includes a dynamically loaded library compiled externally.
4. Offchain-only – Some SDKs allow you to create and serialize cells, which you can then send to APIs.

Clients connect directly to liteservers (nodes) using a binary protocol.

The client downloads keyblocks, the current state of an account, and their **Merkle proofs**, ensuring the validity of received data.

For read operations (such as get-method calls), the client launches a local TVM with a downloaded and verified state. There's no need to download the full blockchain state—the client only retrieves what’s required for the operation.

You can connect to public liteservers from the global config ([Mainnet](https://ton.org/global-config.json) or [Testnet](https://ton.org/testnet-global.config.json)) or run your own [liteserver](/v3/documentation/infra/nodes/node-types) and manage it with [ADNL SDKs](/v3/guidelines/dapps/apis-sdks/sdk#overview).

Read more about [Merkle proofs](/v3/documentation/data-formats/tlb/proofs) at [TON whitepaper](https://ton.org/ton.pdf) 2.3.10, 2.3.11.

Public liteservers (from the global config) help you quickly get started with TON. You can use them to learn TON programming or for applications and scripts that do not require 100% uptime. 

For production infrastructure, consider using a well-prepared setup:
- [Run your own liteserver](/v3/guidelines/nodes/running-nodes/liteserver-node), 
- Use Liteserver premium providers via [@liteserver_bot](https://t.me/liteserver_bot)

## Pros & cons

- ✅ Reliable - Uses an API with Merkle proof hashes to verify incoming binary data.  
- ✅ Secure - Since it checks Merkle proofs, you can even use untrusted liteservers.  
- ✅ Fast - Connects directly to TON Blockchain nodes instead of relying on HTTP middleware. 

- ❌ Complex - Requires time to set up and understand. 
- ❌ Back-end first - Not compatible with web frontends (built for a non-HTTP protocol) unless you use an HTTP-ADNL proxy.

## API reference

Requests and responses follow the [TL](/v3/documentation/data-formats/tl) schema, which allows you to generate a typed interface for a specific programming language.

[TonLib TL schema](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl)

<Feedback />

