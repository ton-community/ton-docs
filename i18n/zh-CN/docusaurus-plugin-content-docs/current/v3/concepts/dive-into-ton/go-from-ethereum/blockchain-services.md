import Feedback from '@site/src/components/Feedback';

# 区块链服务

## 域名系统

In Ethereum, users use the **Ethereum Name Service (ENS)**, a decentralized naming system built on top of the Ethereum blockchain.

TON 区块链包含一个被称为 TON DNS 的嵌入式域名系统。这是一种去中心化服务，允许用户为其智能合约、网站或任何其他在线内容注册人类可读的域名。这种设备有助于与 TON 区块链上的去中心化应用程序（dApps）和其他资源进行交互。TON 中的 DNS 系统与传统的互联网 DNS 系统功能类似，但其去中心化的性质消除了中心化机构控制和管理域名的需要，从而降低了审查、欺诈和域名劫持的风险。 This service allows users to register human-readable domain names for smart contracts, websites, or other online content. Such a device facilitates interaction with **decentralized applications (DApps)** and other resources on the TON blockchain.

The DNS system in TON functions similarly to traditional Internet DNS systems, but its decentralized nature eliminates the need for a centralized authority to control and manage domain names, thereby reducing the risks of censorship, fraud, and domain name hijacking.

One key feature of TON DNS is the ability to bind crypto wallets to domain names directly. This feature allows users to send cryptocurrency to addresses like `alice.place.ton` without additional details. This feature simplifies the process of donations and payments, making it more intuitive and convenient.

## Proxy

TON Proxy 是一款基于 TON 协议的工具，具有高度的安全性和匿名性。通过 TON Proxy 传输的所有数据都经过加密，从而保护用户的机密信息。 All data transmitted through TON Proxy is encrypted, thus protecting users' confidential information.

TON Proxy 的主要优势之一是能够绕过互联网服务提供商或政府机构实施的封锁。这使它成为需要自由访问互联网信息而不受限制的用户的重要工具。 This property makes it an essential tool for users who need free access to information on the Internet without restrictions.

此外，TON Proxy 还有助于加快互联网连接速度。它会自动选择负载最低的服务器，从而提高连接质量和上网速度。 It automatically selects the servers with the lowest load, improving the quality of connection and Internet access speed.

## 分散式存储

Ethereum is not suitable for storing large amounts of data. Therefore, decentralized storage on Ethereum typically involves using distributed file systems to store and retrieve data in a decentralized and secure manner. One popular approach to decentralized storage on Ethereum is the **InterPlanetary File System (IPFS)**, a peer-to-peer file system that allows users to store and retrieve files from a distributed network.

TON 网络拥有自己的去中心化存储服务，由 TON 区块链用于存储区块和状态数据（快照）的存档副本，也可用于存储用户文件或平台上运行的其他服务，采用类似洪流的访问技术。最流行的使用案例是直接在 TON 存储上存储 NFT 元数据，而不使用额外的分布式文件存储服务（如 IPFS）。 The service can also store users’ files or other services running on the platform with torrent-like access technology. The most popular use case is to store NFT metadata directly on TON storage, not using additional distributed file storage services like IPFS.

## 支付服务

TON Payments 是在 TON 区块链上以零网络费用进行闪电般快速交易的解决方案。虽然 TON 区块链足以完成大多数任务，但某些应用（如 TON 代理、TON 存储或某些去中心化应用）需要更快、更低成本的小额交易。支付通道（也称为闪电网络）就是为了解决这个问题而创建的。支付通道允许双方通过在区块链上创建一个特殊的智能合约，用各自的初始余额在链外进行交易。然后，他们之间可以进行任意数量的交易，没有任何速度限制或费用。网络费用只在通道打开和关闭时收取。该技术还允许一方在另一方作弊或消失时自行关闭通道，从而保证正常运行。 While the TON blockchain is sufficient for most tasks, some applications, such as TON Proxy, TON Storage, or a particular decentralized application, require micro-transactions with much higher speed and lower costs. In TON, Payment channels solve this problem.

Payment channels allow two parties to make transactions off-chain by creating a special smart contract on the blockchain with their initial balances. They can then perform as many transactions between them as they want without any speed limits or fees. The network charges fees only when opening and closing the channel. The technology guarantees proper operation by allowing a party to close the channel if the other party cheats or disappears.

<Feedback />

