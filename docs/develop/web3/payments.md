# TON Payments

On the TON blockchain, block time is about 5 seconds. Even with an increase in network load, that time won’t increase either. In other words, in those 5 seconds, millions of transactions can be processed.

Moreover, the TON blockchain has exceptionally low network fees for transactions.

This is enough to solve almost all possible tasks.

In a regular bank app, sending money also takes only a few seconds, but you probably don’t notice because a pretty animation plays during this time.

We don’t see the point in reducing block times to, say, 500 milliseconds like some other blockchains. Although this is technically possible on TON, this practically won’t be advantageous, while network nodes will have to process and store a very big amount of data on their drives. Competing in nominal figures and indicators to the detriment of common sense seems unreasonable to us.

However, there are a few tasks that require lightning-fast transaction speeds and zero network fees.

One example is payment for internet data via TON Proxy or TON Storage, where the cost to download a kilobyte could be 0.000000001 TON (these numbers are used as an example only). Downloading a file of 1GB would require millions of microtransactions totaling close to 0.01 TON.

To solve this issue, Payment Channels were created.

## Payment Channels

Payment channel technology, or as others call it Lightning Network, comprises the following:

* Two parties decide that they are going to have a large number of transactions between each other.
* They create a special smart contract on the blockchain where they’ll send their initial balances. For example, Alice and Bob create a channel between each other, and Alice deposits 5 TON, while Bob deposits 1 TON.
* Next, Alice and Bob can transact between each other as many times as they want off the blockchain, signing every transaction with a cryptographic algorithm.
* Once Alice and Bob finish transacting, they will sign their respective final balances to close the payments channel and send them to a smart contract that will return each of their Toncoin according to their final balances. After everything is settled, Alice receives 4 TON back, and Bob gets 2 TON.
* All settlements will happen off the blockchain, meaning they’re free and have no speed restrictions.

A network fee must be paid only twice: upon opening and closing the payments channel.

Nevertheless, the smart contract guarantees proper operations. In the event one of the parties starts to cheat or completely disappears, the other channel’s party will be able to independently close the payments channel and collect the deposited funds by showing mathematical proof.

## Tools

A technical description of payments channels can be found in the white paper in chapter 5: https://ton.org/docs/ton.pdf.

* You can find ready-made smart contracts here: https://github.com/ton-blockchain/payment-channels.

To use payments channels, you don’t need deep knowledge of cryptography. You can use prepared SDKs:

* JavaScript SDK: https://github.com/toncenter/tonweb.
* An example of how to use a payments channel: https://github.com/toncenter/payment-channels-example.

## Networks of payments channels

As the technology improves, payments channels will have the capacity to join together in a network off-chain where more than two parties will be able to participate in a channel.

Current smart contracts are already designed to support the functionality of uniting into a single off-chain network.

## Conclusion

The TON blockchain is fast and has cheap transaction fees. If you need lightning-quick speeds and billions of transactions with zero fees, now you have a tool for that.

The technology behind TON Payments can be applied in a lot of different spheres, such as payments for internet data, streaming, games, DeFi, and more!
