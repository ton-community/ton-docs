import Button from '@site/src/components/button'

# USDT Processing

## Tether

Stablecoins are a type of cryptocurrency whose value is 1:1 pegged to another asset, such as a fiat currency or gold, to maintain a stable price. Until recently, there was a jUSDT token, which is a wrapped ERC-20 Ethereum token bridged with <a href="https://bridge.ton.org" target="_blank">bridge.ton.org</a>. But on [18.04.2023](https://t.me/toncoin/824) the public launch of **native** USD₮ token issued by the company <a href="https://tether.to/en/" target="_blank">Tether</a> was happened. After the launch of USD₮, jUSDT moved to second-priority status but remains in use as an alternative or addition to USD₮ in various services.

In TON Blockchain USD₮ supported as a [Jetton Asset](/v3/guidelines/dapps/asset-processing/jettons).

:::info
To integrate Tether’s USD₮ Token on TON Blockchain use the contract address:
[EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs](https://tonviewer.com/EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs?section=jetton)
:::

<Button href="https://github.com/ton-community/assets-sdk" colorType="primary" sizeType={'sm'}>Assets SDK</Button>
<Button href="/v3/guidelines/dapps/asset-processing/jettons" colorType={'secondary'} sizeType={'sm'}>Jetton Processing</Button>
<Button href="https://github.com/ton-community/tma-usdt-payments-demo?tab=readme-ov-file#tma-usdt-payments-demo" colorType={'secondary'} sizeType={'sm'}>TMA USDT payments demo</Button>


## Advantages of USD₮ on TON

### Seamless Telegram integration

[USD₮ on TON](https://ton.org/borderless) will be seamlessly integrated into Telegram, offering a uniquely user-friendly experience that positions TON as the most convenient blockchain for USDt transactions. This integration will simplify DeFi for Telegram users, making it more accessible and understandable.

### Lower transaction fees

Fees for Ethereum USD₮ transfers are calculated dynamically depending on network load. This is why transactions can become expensive.

 ```cpp
transaction_fee = gas_used * gas_price
```

* `gas_used` is the amount of gas used during transaction execution.
* `gas_price` is the cost of one unit of gas in Gwei, calculated dynamically.

On the other hand average fee for sending any amount of USD₮ in TON Blockchain is about 0.0145 TON nowadays. Even if the price of TON increases 100 times, transactions will [remain ultra-cheap](/v3/documentation/smart-contracts/transaction-fees/fees#average-transaction-cost). The core TON development team has optimized Tether’s smart contract to make it three times cheaper than any other Jetton.

### Faster and scalable

TON’s high throughput and rapid confirmation times enable USD₮ transactions to be processed more quickly than ever before.

## Advanced Details

:::caution IMPORTANT
In TON Blockchain Jettons can be created with duplicate names. Technically, it will not differ in any way from the real USD₮ but it will have no value because of no security. You can verify legitimacy and check for fraud only by confirming the Jetton Master address.

See important [recommendations](/v3/guidelines/dapps/asset-processing/jettons).
:::

## See Also

* [Payments Processing](/v3/guidelines/dapps/asset-processing/payments-processing)
