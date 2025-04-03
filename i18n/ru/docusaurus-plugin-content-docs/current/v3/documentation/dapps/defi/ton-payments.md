# TON Payments

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

TON Payments - это платформа для каналов микроплатежей.

Она позволяет совершать мгновенные платежи без необходимости фиксации всех транзакций в блокчейне, оплаты связанных комиссий за транзакции (например, за потребленный газ) и ожидания пяти секунд, пока блок, содержащий рассматриваемые транзакции, не будет подтвержден.

Поскольку общая стоимость таких мгновенных платежей минимальна, их можно использовать для микроплатежей в играх, API и off-chain приложениях. [См. примеры](/v3/documentation/dapps/defi/ton-payments#examples).

- [Payments on TON](https://blog.ton.org/ton-payments)

## Платёжные каналы

### Смарт-контракты

- [ton-blockchain/payment-channels](https://github.com/ton-blockchain/payment-channels)

### SDK

Чтобы использовать платежные каналы, вам не нужны глубокие знания криптографии.

Вы можете использовать готовые SDK:

- [toncenter/tonweb](https://github.com/toncenter/tonweb) JavaScript SDK
- [toncenter/payment-channels-example](https://github.com/toncenter/payment-channels-example)-как использовать платежные каналыв tonweb.

### Примеры

Примеры использования платежных каналов можно найти у победителей [Hack-a-TON #1](https://ton.org/hack-a-ton-1):

- [grejwood/Hack-a-TON](https://github.com/Grejwood/Hack-a-TON)—OnlyTONs payments project ([веб-сайт](https://main.d3puvu1kvbh8ti.amplifyapp.com/), [видео](https://www.youtube.com/watch?v=38JpX1vRNTk))
- [nns2009/Hack-a-TON-1_Tonario](https://github.com/nns2009/Hack-a-TON-1_Tonario)—OnlyGrams payments project ([веб-сайт](https://onlygrams.io/), [видео](https://www.youtube.com/watch?v=gm5-FPWn1XM))
- [sevenzing/hack-a-ton](https://github.com/sevenzing/hack-a-ton)—Pay-per-Request API usage in TON ([видео](https://www.youtube.com/watch?v=7lAnbyJdpOA\&feature=youtu.be))
- [illright/diamonds](https://github.com/illright/diamonds)—Pay-per-Minute learning platform ([веб-сайт](https://diamonds-ton.vercel.app/), [видео](https://www.youtube.com/watch?v=g9wmdOjAv1s))

## См. также

- [Обработка платежей](/v3/guidelines/dapps/asset-processing/payments-processing)
- [TON Connect](/v3/guidelines/ton-connect/overview)
