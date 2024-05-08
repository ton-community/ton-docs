# USDT Processing

## Tether

Stablecoins are a type of cryptocurrency whose value is pegged to another asset, such as a fiat currency or gold, to maintain a stable price. E.g. USD₮ stablecoin is issued by the company [Tether](https://tether.to/en/) in the form of ERC-20 tokens that move across the blockchain just as easily as other digital currencies but that are pegged to real-world currencies on a 1-to-1 basis (e.g., 1 USD₮ = 1 USD) and are backed 100% by Tether’s reserves. This offers traders, merchants and funds a low volatility solution when exiting positions in the market.

In TON Blockchain USD₮ supported as [Jetton](/develop/dapps/asset-processing/jettons) jUSDT.

:::info
To integrate Tether’s USD₮ Token on TON Blockchain use the contract address:
[EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs](https://tonviewer.com/EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs?section=jetton)
:::

## Transfer Fee

Fee consumed by Ethereum USD₮ transfer is calculated dynamically depending on the network load. That's why transaction can cost a lot.

 ```cpp
transaction_fee = gas_used * gas_price
```

* `gas_used` is the amount of gas was used during transaction execution.
* `gas_price` price on 1 unit of gas in Gwei, calculated dynamically

On the other hand average fee for sending any amount of a custom Jettons (e.g., jUSDT) in TON Blockchain is about 0.037 TON nowadays. Even if TON price increases 100 times, transactions will [remain ultra-cheap](/develop/smart-contracts/fees#average-transaction-cost).

## jUSDT vs USDT

Since the company Tether has never issued USDT tokens for TON Blockchain due to it is not directly supporting the ERC-20 standard or for other reasons, there exists its own token in TON Network, called jUSDT. It, in turn, is a Wrapped original USDT token from the Ethereum or BNB network.

To create a Wrapped USDT token in TON Network, there is a special [bridge](bridge.ton.org) through which anyone can send their USDT on the Ethereum or Binance Smart Chain to a special smart contract and receive jUSDT on their TON Wallet. The exchange occurs bidirectionally with a fee of 1 Toncoin, plus gas fees for transferring USDT to the Ethereum smart contract address.

:::warning IMPORTANT
In TON Blockchain jettons can be created with duplicate names, i.e. anyone can also create their own token and name it jUSDT or USDT. Technically, it will not differ in any way from the real jUSDT but it will have no value because such a token has no security. Therefore, you need to be extremely careful when dealing with stablecoins on TON Network. You can check a stablecoin or a wrapped token on TON Network for fraud only by checking Jetton Master address.

See important [recommendations](/develop/dapps/asset-processing/jettons#jetton-wallet-processing).
:::

## See Also

* [Jetton Processing](/develop/dapps/asset-processing/jettons)
* [Payments Processing](/develop/dapps/asset-processing/)
