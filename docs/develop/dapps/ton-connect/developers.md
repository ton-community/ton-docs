# TON Connect for Developers

:::info
Before commencing the implementation of TON Connect in your application or service, we recommend reading the following [documentation](https://github.com/ton-connect/docs) which details more on the TON Connect protocol. It is also recommended that developers go over some of our TON Connect dApp integration examples in our [GitHub](https://github.com/ton-connect/demo-dapp).
:::

The TON Connect repository contains three main packages:

- [@tonconnect/sdk](https://www.npmjs.com/package/@tonconnect/sdk)  - TON Connect SDK
- [@tonconnect/protocol](https://www.npmjs.com/package/@tonconnect/protocol) - TON Connect protocol specifications
- @tonconnect/ui - TON Connect User Interface (UI)

## TON Connect SDK

The first of the three frameworks that helps developers integrate TON Connect into their applications is the TON Connect SDK. It is primarily used to connect apps to TON Wallets via the TON Connect protocol.

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/sdk)
- [NPM](https://www.npmjs.com/package/@tonconnect/sdk)

## TON Connect protocol models

This package contains protocol requests, protocol responses, event models and encoding and decoding functions. It can be used to integrate TON Connect to wallet apps written in TypeScript. In order to integrate TON Connect into a dApp the [@tonconnect/sdk](https://www.npmjs.com/package/@tonconnect/sdk) should be used.

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/protocol)
- [NPM](https://www.npmjs.com/package/@tonconnect/protocol)


## TON Connect UI

The TON Connect User Interface (UI) is a framework that allows developers to improve the user experience (UX) for application users. TON Connect can easily be integrated with apps using simple UI elements such as the "connect wallet button", "select wallet dialog" and confirmation modals. Here are three main examples of how TON Connect improves UX in apps:

* Example of app functionality in the dApp browser: [GitHub](https://ton-connect.github.io/demo-dapp/)

* Example of a backend partition of the dApp above: [GitHub](https://github.com/ton-connect/demo-dapp-backend)

* Bridge server using Go: [GitHub](https://github.com/ton-connect/bridge)


The TON Connect UI includes:

* modal wallet selection window
* connect button
* interfaces for connecting and signing transactions, etc.

This kit will simplify the implementation of TON Connect in apps built for TON Blockchain. Standard frontend frameworks are supported, as well as applications that don’t use predetermined frameworks

## TON Connect Python

Example of checking proof from Ton Connect on Python

https://github.com/disintar/ton-connect-python-proof/blob/master/check_proof.ipynb

## General Questions and Concerns

If any of our developers or community members encounter any additional issues during the implementation of TON Connect 2.0, please contact the [Tonkeeper developer](https://t.me/tonkeeperdev) channel.

If you experience any additional issues, or would like to present a proposal on how to improve TON Connect 2.0, please contact us directly through the appropriate [GitHub directory](https://github.com/ton-connect/).
