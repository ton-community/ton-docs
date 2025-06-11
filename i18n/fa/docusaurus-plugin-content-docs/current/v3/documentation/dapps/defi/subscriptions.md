import Feedback from '@site/src/components/Feedback';

# Content subscriptions

به دلیل این که تراکنش‌ها در بلاکچین TON سریع هستند و هزینه‌های شبکه کم است، می‌توانید پرداخت‌های دوره‌ای را از طریق قراردادهای هوشمند به صورت زنجیره‌ای پردازش کنید.

برای مثال، کاربران می‌توانند برای محتوای دیجیتال (یا هر چیز دیگر) اشتراک بگیرند و به ازای آن هزینه ماهانه ۱ تون پرداخت کنند.

:::tip
This content is specific for wallets of version v4. Older wallets don't have this functionality; it is eligible to change in future versions as well.
:::

:::warning
Subscription contract requires authorization exactly once, on installation; then it can withdraw TON as it pleases. Do your own research before attaching unknown subscriptions.

از طرف دیگر، کاربر نمی‌تواند بدون اطلاع خود اشتراک نصب کند.
:::

## مثال روند

- Users use a v4 wallet. It allows additional smart contracts, known as plugins, to extend its functionality.

   After ensuring their functionality, the user can approve the addresses of trusted smart contracts (plugins) for his wallet. Following that, the trusted smart contracts can withdraw Toncoin from the wallet. This is similar to "Infinite Approval" in some other blockchains.

- یک قرارداد هوشمند اشتراک واسطه، به عنوان افزونه کیف‌پول بین هر کاربر و سرویس استفاده می‌شود.

   این قرارداد هوشمند تضمین می‌کند که مقدار مشخص شده‌ای از تونکوین بیش از یک بار در دوره معین از کیف‌پول کاربر برداشت نخواهد شد.

- بک‌اند این سرویس، با ارسال پیام خارجی به قراردادهای هوشمند اشتراک، پرداخت‌ها را به طور منظم شروع می‌کند.

- کاربر یا سرویس می‌توانند تصمیم بگیرند که دیگر نیازی به اشتراک ندارند و آن را لغو کنند.

## نمونه‌های قرارداد هوشمند

- [سورس کد قرارداد هوشمند Wallet v4](https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc)
- [سورس کد قرارداد هوشمند اشتراک](https://github.com/ton-blockchain/wallet-contract/blob/main/func/simple-subscription-plugin.fc)

## پیاده‌سازی

A good example of implementation is decentralized subscriptions for Toncoin to private channels in Telegram by the [@donate](https://t.me/donate) bot and the [Tonkeeper wallet](https://tonkeeper.com). <Feedback />

