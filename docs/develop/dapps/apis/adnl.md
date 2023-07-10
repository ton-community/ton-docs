# TON ADNL API

Clients connect directly to Liteservers (nodes) using a binary protocol.

The client downloads keyblocks, the current state of the account, and their **Merkle proofs**, which guarantees the validity of the received data.

Read operations (like get-method calls) are made by launching a local TVM with a downloaded and verified state.

There is no need to download the full state of the blockchain, the client downloads only what is needed for the operation. Calling the local TVM is also ineffective.

You can connect to public lite servers from the global config ([Mainnet](https://ton.org/global-config.json) or [Testnet](https://ton.org/testnet-global.config.json)) or run your own [Liteserver](/participate/nodes/node-types) and handle this with [ADNL SDKs](/develop/dapps/apis/sdk#adnl-based-sdks).

Read more about Merkle proofs at [TON Whitepaper](https://ton.org/ton.pdf) 2.3.10, 2.3.11.

## Pros & Cons

- ✅ Reliable. Uses API with Merkle proof hashes to verify incoming binary data.  
- ✅ Secure. Since it checks Merkle proofs, you can even use untrusted lite servers.  
- ✅ Fast. Instead of HTTP-middleware directly connects to TON Blockchain nodes. 

- ❌ Complicated. More time is required to figure things out.  
- ❌ Back-end first. Not compatible with web frontends (built for non-HTTP protocol).

## API reference

Requests and responses to the server are described by a TL schema that allows you to generate a typed interface for a certain programming language.

[TonLib TL Schema](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl)


## See Also
* [TON Center API](/develop/dapps/apis/toncenter)
* [SDKs](/develop/dapps/apis/sdk)

