import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'

# USDT processing

## Tether

[Apr 18, 2023](https://t.me/toncoin/824), the public launch of native USD₮ token issued by the company <a href="https://tether.to/en/" target="_blank">Tether</a>.

In TON Blockchain USD₮ supported as a [Jetton asset](/v3/guidelines/dapps/asset-processing/jettons).

:::info
Чтобы интегрировать токен Tether USD₮ в блокчейне TON, используйте адрес контракта: [EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs](https://tonviewer.com/EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs?section=jetton)
:::

<Button href="https://github.com/ton-community/assets-sdk" colorType="primary" sizeType={'sm'}>Assets SDK</Button>
<Button href="/v3/guidelines/dapps/asset-processing/jettons" colorType={'secondary'} sizeType={'sm'}>Jetton processing</Button>
<Button href="https://github.com/ton-community/tma-usdt-payments-demo?tab=readme-ov-file#tma-usdt-payments-demo" colorType={'secondary'} sizeType={'sm'}>TMA USDT payments demo</Button>

## Преимущества USD₮ на TON

### Бесшовная интеграция Telegram

[USD₮ на TON](https://ton.org/borderless) будет бесшовно интегрирован в Telegram, предлагая уникальный удобный интерфейс, который позиционирует TON как самый удобный блокчейн для транзакций USDt. Эта интеграция упростит DeFi для пользователей Telegram, сделав его более доступным и понятным.

### Низкие комиссии за транзакции

Комиссии за переводы Ethereum USD₮ рассчитываются динамически в зависимости от нагрузки на сеть. Вот почему транзакции могут стать дорогими.

 ```cpp
 transaction_fee = gas_used * gas_price
 ```

- `gas_used` это количество газа, используемого при выполнении транзакции.
- `gas_price` - это стоимость одной единицы газа в Gwei, рассчитываемая динамически.

С другой стороны, средняя комиссия за отправку любой суммы USD₮ в блокчейне TON в настоящее время составляет около 0,0145 TON. Даже если цена TON увеличится в 100 раз, транзакции [останутся сверхдешевыми](/v3/documentation/smart-contracts/transaction-fees/fees#average-transaction-cost). Основная команда разработчиков TON оптимизировала смарт-контракт Tether, сделав его в три раза дешевле любого другого жетона.

### Более быстрый и масштабируемый

Высокая пропускная способность TON и быстрое время подтверждения позволяют обрабатывать транзакции USD₮ быстрее, чем когда-либо прежде.

## Advanced details

:::caution ВАЖНО
In TON Blockchain jettons can be created with duplicate names. Technically, it will not differ in any way from the real USD₮ but it will have no value because of no security. You can verify legitimacy and check for fraud only by confirming the Jetton Master address.

См. важные [рекомендации](/v3/guidelines/dapps/asset-processing/jettons).
:::

## See also

- [Payments processing](/v3/guidelines/dapps/asset-processing/payments-processing)

<Feedback />

