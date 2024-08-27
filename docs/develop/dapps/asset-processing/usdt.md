import Button from '@site/src/components/button'

# USDT Processing

## Tether

Stablecoins are a type of cryptocurrency whose value is 1:1 pegged to another asset, such as a fiat currency or gold, to maintain a stable price. Until recently, there was a jUSDT token, which is a wrapped ERC-20 from the Ethereum token bridged with [bridge.ton.org](bridge.ton.org). But on [18.04.2023](https://t.me/toncoin/824) the public launch of **native** USD₮ token issued by the company [Tether](https://tether.to/en/) was happened. After launching USD₮, the jUSDT has moved to the second priority token but is still used in services as an alternative or addition to USD₮.

In TON Blockchain USD₮ supported as a [Jetton Asset](/develop/dapps/asset-processing/jettons).

:::info
To integrate Tether’s USD₮ Token on TON Blockchain use the contract address:
[EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs](https://tonviewer.com/EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs?section=jetton)
:::

<Button href="https://github.com/ton-community/assets-sdk" colorType="primary" sizeType={'sm'}>Assets SDK</Button>
<Button href="https://docs.ton.org/develop/dapps/asset-processing/jettons" colorType={'secondary'} sizeType={'sm'}>Jetton Processing</Button>
<Button href="https://github.com/ton-community/tma-usdt-payments-demo?tab=readme-ov-file#tma-usdt-payments-demo" colorType={'secondary'} sizeType={'sm'}>TMA USDT payments demo</Button>


## Advantages of USD₮ on TON

### Seamless Telegram integration

[USD₮ on TON](https://ton.org/borderless) will be seamlessly integrated into Telegram, offering a uniquely user-friendly experience that positions TON as the most convenient blockchain for USDt transactions. This integration will simplify DeFi for Telegram users, making it more accessible and understandable.

### Lower transaction fees

Fee consumed by Ethereum USD₮ transfer is calculated dynamically depending on the network load. That's why transaction can cost a lot.

 ```cpp
transaction_fee = gas_used * gas_price
```

* `gas_used` is the amount of gas was used during transaction execution.
* `gas_price` price on 1 unit of gas in Gwei, calculated dynamically

On the other hand average fee for sending any amount of USD₮ in TON Blockchain is about 0.0145 TON nowadays. Even if TON price increases 100 times, transactions will [remain ultra-cheap](/develop/smart-contracts/fees#average-transaction-cost). The core TON development team has optimized Tether’s smart contract to make it three times cheaper than any other Jetton.

### Faster and scalable

TON’s high throughput and rapid confirmation times enable USD₮ transactions to be processed more quickly than ever before.

## Advanced Details

:::caution IMPORTANT
In TON Blockchain Jettons can be created with duplicate names. Technically, it will not differ in any way from the real USD₮ but it will have no value because of no security. You can check it for fraud only by checking Jetton Master address.

See important [recommendations](/develop/dapps/asset-processing/jettons#jetton-wallet-processing).
:::

## See Also

* [Payments Processing](/develop/dapps/asset-processing/)
