import Button from '@site/src/components/button'

# Обработка USDT

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Tether

Стейблкоины — это тип криптовалюты, стоимость которой привязана 1:1 к другому активу, например, фиатной валюте или золоту, для поддержания стабильной цены. До недавнего времени существовал токен jUSDT, представляющий собой обернутый токен ERC-20 Ethereum, связанный с <a href="https://bridge.ton.org" target="_blank">bridge.ton.org</a>. Но 18.04.2023 состоялся публичный запуск **встроенного** токена USD₮, выпущенного компанией <a href="https://tether.to/en/" target="_blank">Tether</a>. После запуска USD₮, jUSDT перешел в статус второго приоритета, но по-прежнему используется в качестве альтернативы или дополнения к USD₮ в различных сервисах.

В блокчейне TON USD₮ поддерживается как [жетон](/v3/guidelines/dapps/asset-processing/jettons).

:::info
Чтобы интегрировать токен Tether USD₮ в блокчейне TON, используйте адрес контракта: [EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs](https://tonviewer.com/EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs?section=jetton)
:::

<Button href="https://github.com/ton-community/assets-sdk" colorType="primary" sizeType={'sm'}>Assets SDK</Button>
<Button href="/v3/guidelines/dapps/asset-processing/jettons" colorType={'secondary'} sizeType={'sm'}>Jetton Processing</Button>
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

## Дополнительные сведения

:::caution ВАЖНО

См. важные [рекомендации](/v3/guidelines/dapps/asset-processing/jettons).
:::

## См. также

- [Обработка платежей](/v3/guidelines/dapps/asset-processing/payments-processing)
