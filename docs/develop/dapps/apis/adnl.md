# TON ADNL API

:::tip

There are different ways to connect to blockchain:
1. RPC data provider or another API: in most cases, you have to *rely* on its stability and security.
2. **ADNL connection**: you're connecting to a [liteserver](/participate/run-nodes/liteserver). They might be inaccessible, but with a certain level of validation (implemented in the library), cannot lie.
3. Tonlib binary: you're connecting to liteserver as well, so all benefits and downsides apply, but your application also contains a dynamic-loading library compiled outside.
4. Offchain-only. Such SDKs allow to create and serialize cells, which you can then send to APIs.

:::

Clients connect directly to Liteservers (nodes) using a binary protocol.

The client downloads keyblocks, the current state of the account, and their **Merkle proofs**, which guarantees the validity of the received data.

Read operations (like get-method calls) are made by launching a local TVM with a downloaded and verified state. It's worth noting that there is no need to download the full state of the blockchain, the client downloads only what is needed for the operation.

You can connect to public liteservers from the global config ([Mainnet](https://ton.org/global-config.json) or [Testnet](https://ton.org/testnet-global.config.json)) or run your own [Liteserver](/participate/nodes/node-types) and handle this with [ADNL SDKs](/develop/dapps/apis/sdk#adnl-based-sdks).

Read more about [Merkle proofs](/develop/data-formats/proofs) at [TON Whitepaper](https://ton.org/ton.pdf) 2.3.10, 2.3.11.

Public liteservers (from the global config) exist to get you started with TON quickly. It can be used for learning to program in TON, or for applications and scripts that do not require 100% uptime. If you want stable liteserver infrastructure - you can [set up own liteserver](https://docs.ton.org/participate/run-nodes/full-node#enable-liteserver-mode), or buy private lite-channel in [@liteserver_bot](https://t.me/liteserver_bot)

## Pros & Cons

- ✅ Reliable. Uses API with Merkle proof hashes to verify incoming binary data.  
- ✅ Secure. Since it checks Merkle proofs, you can even use untrusted liteservers.  
- ✅ Fast. Connects directly to TON Blockchain nodes, instead of using HTTP middleware. 

- ❌ Complicated. More time is required to figure things out.  
- ❌ Back-end first. Not compatible with web frontends (built for non-HTTP protocol), or requires HTTP-ADNL proxy.

## API reference

Requests and responses to the server are described by the [TL](/develop/data-formats/tl) schema that allows you to generate a typed interface for a certain programming language.

[TonLib TL Schema](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl)
