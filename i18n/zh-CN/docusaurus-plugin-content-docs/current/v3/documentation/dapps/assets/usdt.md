import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'

# USDT 处理

## Tether

[Apr 18, 2023](https://t.me/toncoin/824), the public launch of native USD₮ token issued by the company <a href="https://tether.to/en/" target="_blank">Tether</a>.

在 TON 区块链中，美元作为[Jetton 资产](/v3/guidelines/dapps/asset-processing/jettons) 得到支持。

:::info
要在 TON 区块链上集成 Tether 的 USD₮ 代币，请使用合约地址：
[EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs](https://tonviewer.com/EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs?section=jetton)
:::

<Button href="https://github.com/ton-community/assets-sdk" colorType="primary" sizeType={'sm'}>Assets SDK</Button>
<Button href="/v3/guidelines/dapps/asset-processing/jettons" colorType={'secondary'} sizeType={'sm'}>Jetton Processing</Button>
<Button href="https://github.com/ton-community/tma-usdt-payments-demo?tab=readme-ov-file#tma-usdt-payments-demo" colorType={'secondary'} sizeType={'sm'}>TMA USDT 支付演示</Button>

## 在 TON 上使用 USD₮ 的优势

### 无缝集成 Telegram

[TON 上的 USD₮](https://ton.org/borderless) 将无缝集成到 Telegram 中，提供独特的用户友好体验，使 TON 成为进行 USDt 交易最方便的区块链。这一整合将简化 Telegram 用户的 DeFi，使其更易于使用和理解。 This integration will simplify DeFi for Telegram users, making it more accessible and understandable.

### 降低交易费用

Fees for Ethereum USD₮ transfers are calculated dynamically depending on network load. This is why transactions can become expensive.

 ```cpp
 transaction_fee = gas_used * gas_price
 ```

- `gas_used` 是事务执行过程中使用的 gas 量。
- 以 Gwei 为单位的 `gas_price`  gas 价格，动态计算

On the other hand average fee for sending any amount of USD₮ in TON Blockchain is about 0.0145 TON nowadays. Even if the price of TON increases 100 times, transactions will [remain ultra-cheap](/v3/documentation/smart-contracts/transaction-fees/fees#average-transaction-cost). 另一方面，如今在 TON 区块链上发送任意金额的美元的平均费用约为 0.0145 TON。即使 TON 价格上涨 100 倍，交易也将 [保持超低价](/v3/documentation/smart-contracts/transaction-fees/fees#average-transaction-cost)。TON 的核心开发团队对 Tether 的智能合约进行了优化，使其比其他任何 Jetton 便宜三倍。

### 更快、可扩展

TON 的高吞吐量和快速确认时间使美元交易的处理速度比以往任何时候都快。

## 高级详细信息

:::caution 重要事项
In TON Blockchain jettons can be created with duplicate names. Technically, it will not differ in any way from the real USD₮ but it will have no value because of no security. You can verify legitimacy and check for fraud only by confirming the Jetton Master address.

参见重要 [建议](/v3/guidelines/dapps/asset-processing/jettons)。
:::

## 另请参见

- [支付处理](/v3/guidelines/dapps/asset-processing/payments-processing)

<Feedback />

