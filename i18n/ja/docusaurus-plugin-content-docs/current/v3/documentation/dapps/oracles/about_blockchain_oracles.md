import Feedback from '@site/src/components/Feedback';

# About oracles

Blockchain oracles are entities that connect the blockchain to external systems, allowing smart contracts to be executed based on real-world inputs.

## ブロックチェーンオラクルの仕組み

Blockchain oracles are specialized services that act as bridges between the real world and blockchain technology. They provide smart contracts with relevant and necessary information from the outside world, such as exchange rates, payment statuses or even weather conditions. This data helps to automate and fulfill the terms of contracts without direct human intervention.

The basic principle behind oracles is their ability to function outside of the blockchain by connecting to various online sources to collect data. Although oracles are not part of the blockchain itself, they play a key role in making it functional by acting as a trusted intermediary that reliably feeds external data into the system.

Most oracles tend to be decentralized, avoiding the risks associated with dependence on a single source of data. This provides greater security and reliability to the system as data is verified and validated through a network of nodes before it is used in smart contracts. This approach minimizes the risk of manipulation and errors, ensuring that the information provided is accurate and up-to-date.

## ブロックチェーンオラクルの種類

Blockchain oracles are categorized according to various aspects: mechanism of operation, data sources, data direction, and governance structure. Let's take a look at the most common types of oracles.

### ソフトウェアとハードウェアの託宣者

Software oracles work with online data that is stored in various digital sources such as databases, servers, cloud storage. Hardware oracles connect the physical world to the digital world, using sensors and scanners to transfer data about real-world events to the blockchain.

### Incoming and outgoing oracles

Inbound oracles feed information into the blockchain, such as weather data for insurance contracts. Outbound oracles, in turn, send data from the blockchain to the outside world, such as transaction notifications. Using both types of oracles improves the overall reliability of the system by ensuring a continuous and accurate flow of data in both directions. It also reduces the likelihood of a single point of failure problem by diversifying the sources and destinations of critical data, reducing the risk that a failure in one component could jeopardize the entire system.

### 集中型および分散型<unk>

Centralized oracles are controlled by a single party, which creates security and reliability risks. Decentralized oracles use multiple nodes to verify data, making them more secure and reliable.

### 特定のスマートコントラクト用Oracles

These oracles are developed individually for certain smart contracts and may not be as popular due to their specificity and high development costs.

### Crosschain oracles

これらのオラクルは、異なるブロックチェーン間でデータを転送するために使用され、ブリッジの重要なコンポーネントです。 これらは、あるネットワークから別のネットワークへの暗号資産のクロスチェーン転送など、クロスチェーントランザクションを使用する分散アプリケーションに使用されます。 They are used for decentralized applications that use cross-chain transactions, such as cross-chain transfer of crypto assets from one network to another.

## ブロックチェーンオラクルの適用

ブロックチェーンオラクルは、ブロックチェーンと実生活のデジタル世界との間の橋渡しを構築し、幅広いアプリケーションを開きます。 託宣の最も一般的な使用法のいくつかを見てみましょう。 Let's take a look at some of the most popular uses of oracles.

### DeFi (分散ファイナンス)

Oracles play a critical role in the DeFi ecosystem by providing market price and cryptocurrency data. Price oracles allow DeFi platforms to link token values to real assets, which is essential for controlling liquidity and securing users' positions. Additionally, oracles are vital for lending platforms, where accurate price data ensures proper collateral valuation and risk management, safeguarding both lenders and borrowers. This makes transactions more transparent and secure, contributing to the stability and reliability of financial transactions.

### 保険

オラクルは、さまざまな情報源から自動的にデータを読み取って分析し、保険イベントの発生を判断できます。 これにより、保険契約は自動的に請求を支払うことができ、各ケースを手動で処理する必要がなくなり、保険イベントに対する応答時間を短縮できます。 This allows insurance contracts to pay claims automatically, reducing the need to manually process each case and speeding up response times to insurance events.

### ロジスティクス

The use of oracles in logistics allows smart contracts to automatically perform payments and other actions based on data received from barcode scanners or sensors on vehicles. This improves delivery accuracy and efficiency by minimizing errors and delays.

### 乱数生成

すべての操作が再現可能で予測可能でなければならないため、スマートコントラクトで乱数を生成することは困難です。 計算神託は、外部のデータを契約に取り込むことで、この問題を解決します。 ゲームや宝くじのために検証可能な乱数を生成することができ、結果の公平性と透明性を保証します。 Computational oracles solve this problem by bringing data from the outside world into contracts. They can generate verifiable random numbers for games and lotteries, ensuring fairness and transparency of results.

## OraclesのTONの一覧

- [Pyth oracles](/v3/documentation/dapps/oracles/pyth)
- [RedStone oracles](/v3/documentation/dapps/oracles/red_stone)

<Feedback />

