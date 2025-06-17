import Feedback from '@site/src/components/Feedback';

# About oracles

Blockchain oracles are entities that connect the blockchain to external systems, allowing smart contracts to be executed based on real-world inputs.

## How blockchain oracles work

Blockchain oracles are specialized services that act as bridges between the real world and blockchain technology. They provide smart contracts with relevant and necessary information from the outside world, such as exchange rates, payment statuses or even weather conditions. This data helps to automate and fulfill the terms of contracts without direct human intervention.

The basic principle behind oracles is their ability to function outside of the blockchain by connecting to various online sources to collect data. Although oracles are not part of the blockchain itself, they play a key role in making it functional by acting as a trusted intermediary that reliably feeds external data into the system.

Most oracles tend to be decentralized, avoiding the risks associated with dependence on a single source of data. This provides greater security and reliability to the system as data is verified and validated through a network of nodes before it is used in smart contracts. This approach minimizes the risk of manipulation and errors, ensuring that the information provided is accurate and up-to-date.

## 区块链规则的多样性

Blockchain oracles are categorized according to various aspects: mechanism of operation, data sources, data direction, and governance structure. Let's take a look at the most common types of oracles.

### 软件和硬件预言机

Software oracles work with online data that is stored in various digital sources such as databases, servers, cloud storage. 软件与演处理存储在数据库、服务器、云存储等各种数字源中的在线数据。硬件预言机将物理世界与数字世界连接起来，使用传感器和扫描仪将现实世界事件的数据传输到区块链上。

### Incoming and outgoing oracles

Inbound oracles feed information into the blockchain, such as weather data for insurance contracts. Outbound oracles, in turn, send data from the blockchain to the outside world, such as transaction notifications. Using both types of oracles improves the overall reliability of the system by ensuring a continuous and accurate flow of data in both directions. It also reduces the likelihood of a single point of failure problem by diversifying the sources and destinations of critical data, reducing the risk that a failure in one component could jeopardize the entire system.

### 集中式和去中心化预言机

Centralized oracles are controlled by a single party, which creates security and reliability risks. Decentralized oracles use multiple nodes to verify data, making them more secure and reliable.

### Oracles for specific smart-contracts

These oracles are developed individually for certain smart contracts and may not be as popular due to their specificity and high development costs.

### Crosschain oracles

These oracles are used to transfer data between different blockchains and are a critical component of bridges. 这些用于在不同的区块链之间传输数据。当网络不兼容时使用。 有助于使用跨链交易的分散应用程序，例如将加密资产从一个网络转移到另一个网络。

## 区块链预言机的应用

Blockchain oracles build bridges between the digital world of blockchains and real life, opening up a wide range of applications. Let's take a look at some of the most popular uses of oracles.

### DeFi（去中心化金融）

Oracles play a critical role in the DeFi ecosystem by providing market price and cryptocurrency data. Price oracles allow DeFi platforms to link token values to real assets, which is essential for controlling liquidity and securing users' positions. Additionally, oracles are vital for lending platforms, where accurate price data ensures proper collateral valuation and risk management, safeguarding both lenders and borrowers. This makes transactions more transparent and secure, contributing to the stability and reliability of financial transactions.

### 保险

Oracles can automatically read and analyze data from a variety of sources to determine the occurrence of insurance events. This allows insurance contracts to pay claims automatically, reducing the need to manually process each case and speeding up response times to insurance events.

### 物流

在物流中使用oracles，可以让智能合约根据从车辆上的条形码扫描仪或传感器接收到的数据自动执行支付和其他操作。这可以最大限度地减少错误和延误，从而提高交付的准确性和效率。 This improves delivery accuracy and efficiency by minimizing errors and delays.

### 随机号码生成

在智能合约中很难生成随机数，因为所有操作都必须是可复制和可预测的，这与随机性的概念相矛盾。预言机通过将外部世界的数据引入合约来解决这个问题。它们可以为游戏和彩票生成可验证的随机数，确保结果的公平性和透明度。 Computational oracles solve this problem by bringing data from the outside world into contracts. They can generate verifiable random numbers for games and lotteries, ensuring fairness and transparency of results.

## TON 中的预言机列表

- [RedStone Oracles](/v3/documentation/dapps/oracles/red_stone)
- [RedStone Oracles](/develop/oracles/red_stone)

<Feedback />

