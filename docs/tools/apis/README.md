# APIs

```
// TODO split on 2 different files
```

At the moment, two API options are available to interact with TON:

## 1. HTTP API

Standard HTTP JSON RPC similar to many blockchains.

Clients connect to the [ton-http-api](https://github.com/toncenter/ton-http-api) server that proxies requests to the lite server (node) using TonLib.

You can connect to public [toncenter.com](https://toncenter.com) or run your own http-api instance.

👍 - Habitual. Suitable for a quick start.

👎 - Like in most blockchains, you cannot fully trust server responses, because its responses do not contain proofs.

**API reference**

[https://toncenter.com/api/v2/](https://toncenter.com/api/v2/)

**SDK**:

- [JavaScript TonWeb](https://github.com/toncenter/tonweb)

**Usage examples:**

- [Standard web wallet](https://github.com/toncenter/ton-wallet) (Plain JS)

- [Bridge frontend](https://github.com/ton-blockchain/bridge) (Vue.js)


## 2. TON API

   Clients connect directly to lite servers (nodes) using a binary protocol.

   The client downloads keyblocks, the current state of the account and their **Merkle proofs**, which guarantees validity of the received data.

   Read operations (like get-method calls) are made by launching a local TVM with a downloaded and verified state.

   There is no need to download the full state of blockchain, the client only downloads what is needed for the operation. Calling local TVM is also lightweight.

   You can connect to public lite servers from the global config ([mainnet](https://ton.org/global-config.json) or [testnet](https://ton-blockchain.github.io/testnet-global.config.json)) or run your own lite server.

   Since it checks Merkle proofs, you can even use untrusted lite servers.

   Read more about Merkle proofs at [TON Whitepaper](https://ton-blockchain.github.io/docs/ton.pdf) 2.3.10, 2.3.11.

   👍 - Ultra secure API with Merkle proofs. 

   👎 - Need more time to figure it out. Not compatible with web frontends (non-HTTP protocol).

  **API reference**

  Requests and responses to the server are described by a TL schema that allows you to generate a typed interface for a specific programming language.

  [TonLib TL Schema](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl)

   **SDK:**
   
   - [C++ TonLib](https://github.com/ton-blockchain/ton/tree/master/example/cpp)

   - [Python TonLib wrapper](https://github.com/toncenter/pytonlib)

   - [Golang TonLib wrapper](https://github.com/ton-blockchain/tonlib-go)
   
   - [Java TonLib wrapper (JNI)](https://github.com/ton-blockchain/tonlib-java)
   
   **Usage example:**

   - [Desktop standard wallet](https://github.com/newton-blockchain/wallet-desktop) (C++ and Qt)

   - [Android standard wallet](https://github.com/trm-dev/wallet-android) (Java)  

   - [iOS standard wallet](https://github.com/trm-dev/wallet-ios) (Swift)

   - [TonLib CLI](https://github.com/ton-blockchain/ton/blob/master/tonlib/tonlib/tonlib-cli.cpp) (C++)
