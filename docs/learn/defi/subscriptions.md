# Subscriptions - recurring payments

Due to the fact that transactions in the TON Blockchain are fast and network fees are cheap, you can process recurring payments onchain on smart contracts.

For example, users can subscribe to some digital content (or anything else) and they will be charged a monthly payment of 1 TON.

There is no specific standard for this.

The current common way:

- Users use a v4 wallet (v4R2 is the default wallet smart contract on the TON blockchain), which supports extension functionality by other smart contracts (which can be called plugins).

   User can approve the addresses of trusted smart contracts (plugins) for his wallet, after making sure of their functionality. After that, trusted smart contracts can withdraw Toncoins from the wallet. This is similar to "Infinite Approval" in some other blockchains.

- An intermediate subscription smart contract is used between each user and service as wallet plugin.

   This smart contract guarantees that a specified amount of Toncoins will be debited to a user's wallet not oftener than once a specified period.

- The backend of the service periodically initiates a payment by sending an external message to the smart contracts of subscriptions

[Wallet v4 smart contract source code](https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc)

[Subscription smart contract source code](https://github.com/ton-blockchain/wallet-contract/blob/main/func/simple-subscription-plugin.fc)

A good example of implementation is decentralized subscriptions for Toncoins to private channels in Telegram by the [@donate](https://t.me/donate) bot and the [Tonkeeper wallet](https://tonkeeper.com).