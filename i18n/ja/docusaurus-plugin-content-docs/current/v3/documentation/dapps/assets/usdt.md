import Feedback from '@site/src/components/Feedback';

import Button from '@ite/src/components/button'

# USDT processing

## Tether

[Apr 18, 2023](https://t.me/toncoin/824), the public launch of native USD₮ token issued by the company <a href="https://tether.to/en/" target="_blank">Tether</a>.

In TON Blockchain USD₮ supported as a [Jetton asset](/v3/guidelines/dapps/asset-processing/jettons).

:::info
Tether の USD₮ トークンを TON ブロックチェーンに統合するには、コントラクトアドレスを使用します：
[EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs](https://tonviewer.com/EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs?section=jetton)
:::

<Button href="https://github.com/ton-community/assets-sdk" colorType="primary" sizeType={'sm'}>Assets SDK</Button>
<Button href="/v3/guidelines/dapps/asset-processing/jettons" colorType={'secondary'} sizeType={'sm'}>Jetton processing</Button>
<Button href="https://github.com/ton-community/tma-usdt-payments-demo?tab=readme-ov-file#tma-usdt-payments-demo" colorType={'secondary'} sizeType={'sm'}>TMA USDT payments demo</Button>

## TON上の USD₮ の利点

### シームレスなTelegramとの統合

[TON上のUSD₮](https://ton.org/borderless)はTelegramにシームレスに統合され、TONをUSDt取引に最も便利なブロックチェーンとして位置づけ、独自のユーザーフレンドリーな体験を提供します。この統合は、TelegramユーザーにとってDeFiを簡素化し、よりアクセスしやすく理解しやすくします。 This integration will simplify DeFi for Telegram users, making it more accessible and understandable.

### 取引手数料の低減

Fees for Ethereum USD₮ transfers are calculated dynamically depending on network load. This is why transactions can become expensive.

 ```cpp
 transaction_fee = gas_used * gas_price
 ```

- `gas_used` は、トランザクション実行中にガスが使用された量です。
- `gas_price` は、Gweiのガス1ユニットの価格です。

On the other hand average fee for sending any amount of USD₮ in TON Blockchain is about 0.0145 TON nowadays. Even if the price of TON increases 100 times, transactions will [remain ultra-cheap](/v3/documentation/smart-contracts/transaction-fees/fees#average-transaction-cost). The core TON development team has optimized Tether’s smart contract to make it three times cheaper than any other Jetton.

### Faster and scalable

TONの高いスループットと迅速な確認時間により、USD₮ 取引はこれまで以上に迅速に処理されます。

## Advanced details

:::caution 重要
In TON Blockchain jettons can be created with duplicate names. Technically, it will not differ in any way from the real USD₮ but it will have no value because of no security. You can verify legitimacy and check for fraud only by confirming the Jetton Master address.

[重要推奨事項](/v3/guidelines/dapps/asset-processing/jettons)をご確認ください。
:::

## See also

- [Payments processing](/v3/guidelines/dapps/asset-processing/payments-processing)

<Feedback />

