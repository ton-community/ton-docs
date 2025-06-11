import Feedback from '@site/src/components/Feedback';

# About oracles

Blockchain oracles are entities that connect the blockchain to external systems, allowing smart contracts to be executed based on real-world inputs.

## How blockchain oracles work

Blockchain oracles are specialized services that act as bridges between the real world and blockchain technology. They provide smart contracts with relevant and necessary information from the outside world, such as exchange rates, payment statuses or even weather conditions. This data helps to automate and fulfill the terms of contracts without direct human intervention.

The basic principle behind oracles is their ability to function outside of the blockchain by connecting to various online sources to collect data. Although oracles are not part of the blockchain itself, they play a key role in making it functional by acting as a trusted intermediary that reliably feeds external data into the system.

Most oracles tend to be decentralized, avoiding the risks associated with dependence on a single source of data. This provides greater security and reliability to the system as data is verified and validated through a network of nodes before it is used in smart contracts. This approach minimizes the risk of manipulation and errors, ensuring that the information provided is accurate and up-to-date.

## Varieties of blockchain oracles

Blockchain oracles are categorized according to various aspects: mechanism of operation, data sources, data direction, and governance structure. Let's take a look at the most common types of oracles.

### Software and hardware oracles

Software oracles work with online data that is stored in various digital sources such as databases, servers, cloud storage. Hardware oracles connect the physical world to the digital world, using sensors and scanners to transfer data about real-world events to the blockchain.

### Incoming and outgoing oracles

Inbound oracles feed information into the blockchain, such as weather data for insurance contracts. Outbound oracles, in turn, send data from the blockchain to the outside world, such as transaction notifications. Using both types of oracles improves the overall reliability of the system by ensuring a continuous and accurate flow of data in both directions. It also reduces the likelihood of a single point of failure problem by diversifying the sources and destinations of critical data, reducing the risk that a failure in one component could jeopardize the entire system.

### Centralized and decentralized oracles

Centralized oracles are controlled by a single party, which creates security and reliability risks. Decentralized oracles use multiple nodes to verify data, making them more secure and reliable.

### Oracles for specific smart-contracts

These oracles are developed individually for certain smart contracts and may not be as popular due to their specificity and high development costs.

### Crosschain oracles

These oracles are used to transfer data between different blockchains and are a critical component of bridges. They are used for decentralized applications that use cross-chain transactions, such as cross-chain transfer of crypto assets from one network to another.

## Application of blockchain oracles

Blockchain oracles build bridges between the digital world of blockchains and real life, opening up a wide range of applications. Let's take a look at some of the most popular uses of oracles.

### DeFi (decentralized finance)

Oracles play a critical role in the DeFi ecosystem by providing market price and cryptocurrency data. Price oracles allow DeFi platforms to link token values to real assets, which is essential for controlling liquidity and securing users' positions. Additionally, oracles are vital for lending platforms, where accurate price data ensures proper collateral valuation and risk management, safeguarding both lenders and borrowers. This makes transactions more transparent and secure, contributing to the stability and reliability of financial transactions.

### Insurance

Oracles can automatically read and analyze data from a variety of sources to determine the occurrence of insurance events. This allows insurance contracts to pay claims automatically, reducing the need to manually process each case and speeding up response times to insurance events.

### Logistics

The use of oracles in logistics allows smart contracts to automatically perform payments and other actions based on data received from barcode scanners or sensors on vehicles. This improves delivery accuracy and efficiency by minimizing errors and delays.

### Random number generation

It is difficult to generate random numbers in smart contracts because all operations must be reproducible and predictable, which contradicts the concept of randomness. Computational oracles solve this problem by bringing data from the outside world into contracts. They can generate verifiable random numbers for games and lotteries, ensuring fairness and transparency of results.

## List of oracles in TON

- [Pyth oracles](/v3/documentation/dapps/oracles/pyth)
- [RedStone oracles](/v3/documentation/dapps/oracles/red_stone)

<Feedback />

