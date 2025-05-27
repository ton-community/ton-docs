import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'

# USDT processing

## Tether

[Apr 18, 2023](https://t.me/toncoin/824), the public launch of native USD₮ token issued by the company <a href="https://tether.to/en/" target="_blank">Tether</a>.

In TON Blockchain USD₮ supported as a [Jetton asset](/v3/guidelines/dapps/asset-processing/jettons).

:::info
To integrate Tether’s USD₮ Token on TON Blockchain use the contract address:
[EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs](https://tonviewer.com/EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs?section=jetton)
:::

<Button href="https://github.com/ton-community/assets-sdk" colorType="primary" sizeType={'sm'}>Assets SDK</Button>
<Button href="/v3/guidelines/dapps/asset-processing/jettons" colorType={'secondary'} sizeType={'sm'}>Jetton processing</Button>
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

## Advanced details

:::caution IMPORTANT
In TON Blockchain jettons can be created with duplicate names. Technically, it will not differ in any way from the real USD₮ but it will have no value because of no security. You can verify legitimacy and check for fraud only by confirming the Jetton Master address.

See important [recommendations](/v3/guidelines/dapps/asset-processing/jettons).
:::

## See also

* [Payments processing](/v3/guidelines/dapps/asset-processing/payments-processing)

<Feedback />

