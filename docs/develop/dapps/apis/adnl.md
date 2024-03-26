# TON ADNL API

Clients connect directly to Liteservers (nodes) using a binary protocol.

The client downloads keyblocks, the current state of the account, and their **Merkle proofs**, which guarantees the validity of the received data.

Read operations (like get-method calls) are made by launching a local TVM with a downloaded and verified state.

There is no need to download the full state of the blockchain, the client downloads only what is needed for the operation. Calling the local TVM is also ineffective.

You can connect to public liteservers from the global config ([Mainnet](https://ton.org/global-config.json) or [Testnet](https://ton.org/testnet-global.config.json)) or run your own [Liteserver](/participate/nodes/node-types) and handle this with [ADNL SDKs](/develop/dapps/apis/sdk#adnl-based-sdks).

Read more about Merkle proofs at [TON Whitepaper](https://ton.org/ton.pdf) 2.3.10, 2.3.11.

Public liteservers (from the global config) exist to get you started with TON quickly. It can be used for learning to program in TON, or for applications and scripts that do not require 100% uptime. If you want stable liteserver infrastructure - you can [set up own liteserver](https://docs.ton.org/participate/run-nodes/full-node#enable-liteserver-mode), or buy private lite-channel in [@liteserver_bot](https://t.me/liteserver_bot)

## Pros & Cons

- ✅ Reliable. Uses API with Merkle proof hashes to verify incoming binary data.  
- ✅ Secure. Since it checks Merkle proofs, you can even use untrusted liteservers.  
- ✅ Fast. Connects directly to TON Blockchain nodes, instead of using HTTP middleware. 

- ❌ Complicated. More time is required to figure things out.  
- ❌ Back-end first. Not compatible with web frontends (built for non-HTTP protocol).

## API reference

Requests and responses to the server are described by the TL schema that allows you to generate a typed interface for a certain programming language.

[TonLib TL Schema](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl)


## See Also
* [TON Center API](/develop/dapps/apis/toncenter)
* [SDKs](/develop/dapps/apis/sdk)

