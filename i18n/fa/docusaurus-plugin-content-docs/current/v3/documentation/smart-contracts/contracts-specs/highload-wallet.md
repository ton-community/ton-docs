import Feedback from '@site/src/components/Feedback';

# Highload wallet contracts

When working with many messages in a short period, there is a need for special wallet called Highload wallet. Highload wallet v2 was the main wallet on TON for a long time, but you had to be very careful with it. Otherwise, you could [lock all funds](https://t.me/tonstatus/88).

[With the advent of Highload Wallet V3](https://github.com/ton-blockchain/Highload-wallet-contract-v3), this problem has been solved at the contract architecture level and consumes less gas. This chapter will cover the basics of Highload Wallet V3 and important nuances to remember.

## Highload wallet v3

This wallet is made for who need to send transactions at very high rates. For example, crypto exchanges.

- [کد منبع](https://github.com/ton-blockchain/Highload-wallet-contract-v3)

هر پیام خارجی داده شده (درخواست انتقال) به های لود V3 شامل موارد زیر است:

- یک امضا (۵۱۲ بیت) در cell سطح بالا - سایر پارامترها در ref آن cell قرار دارند
- شناسه کیف‌پول فرعی (۳۲ بیت)
- پیام برای ارسال به عنوان یک ref (پیام داخلی سریالی شده که ارسال خواهد شد)
- حالت ارسال برای پیام (۸ بیت)
- شناسه پرس‌وجوی ترکیبی - ۱۳ بیت برای "شیفت" و ۱۰ بیت برای "شماره بیت"، با این حال ۱۰ بیت شماره بیت تنها تا ۱۰۲۲ می‌تواند برود و نه ۱۰۲۳، و همچنین آخرین شناسه پرس‌وجوی قابل استفاده (۸۳۸۸۶۰۵) برای مواقع اضطراری رزرو شده و نباید به طور عادی استفاده شود
- زمان ایجاد، یا تایم‌استمپ پیام
- تایم‌اوت

Timeout is stored in Highload as a parameter and is checked against the timeout in all requests - so the timeout for all requests is equal. The message should be not older than timeout at the time of arrival to the Highload wallet, or in code it is required that `created_at > now() - timeout`. Query IDs are stored for the purposes of replay protection for at least timeout and possibly up to 2 \* timeout, however one should not expect them to be stored for longer than timeout. Subwallet ID is checked against the one stored in the wallet. Inner ref's hash is checked along with the signature against the public key of the wallet.

کیف‌پول لود بالا v3 تنها می‌تواند ۱ پیام از هر پیام خارجی ارسال کند، هر چند می‌تواند با یک کد عملیاتی خاص این پیام را به خود ارسال کند، که اجازه می‌دهد هر cell عملیاتی را در آن فراخوانی پیام داخلی تنظیم کنید، به طور موثر امکان ارسال تا ۲۵۴ پیام در هر پیام خارجی را فراهم می‌آورد (احتمالاً بیشتر اگر پیام دیگری در میان این ۲۵۴ پیام به کیف‌پول لود بالا ارسال شود).

Highload v3 پس از گذراندن تمامی بررسی‌ها، همیشه شناسه پرس‌وجو (حفاظت در برابر تکرار) را ذخیره می‌کند، اما پیام به دلیل برخی شرایط، از جمله اما نه محدود به موارد زیر، ممکن است ارسال نشود:

- **شامل حالت ایجاد وضعیت** (چنین پیام‌هایی، در صورت لزوم، می‌توانند با استفاده از کد عملیاتی خاصی که برای تنظیم cell عملیاتی پس از یک پیام داخلی از والت لود بالا به خود ارسال می‌شوند)
- موجودی ناکافی
- ساختار پیام نامعتبر (شامل پیام‌های خروجی خارجی - تنها پیام‌های داخلی می‌توانند مستقیماً از پیام خارجی ارسال شوند)

Highload v3 will never execute multiple externals containing the same `query_id` **and** `created_at` - by the time it forgets any given `query_id`, the `created_at` condition will prevent such a message from executing. This effectively makes `query_id` **and** `created_at` together the "primary key" of a transfer request for Highload v3.

When iterating (incrementing) query ID, it is cheaper (in terms of TON spent on fees) to iterate through bit number first, and then the shift, like when incrementing a regular number. After you've reached the last query ID (remember about the emergency query ID - see above), you can reset query ID to 0, but if Highload's timeout period has not passed yet, then the replay protection dictionary will be full and you will have to wait for the timeout period to pass.

## والت لود بالا v2

:::danger
قرارداد قدیمی، پیشنهاد می‌شود از والت لود بالا v3 استفاده کنید.
:::

This wallet is made for those who need to send hundreds of transactions in a short period of time. For example, crypto exchanges.

It allows you to send up to `254` transactions in one smart contract call. It also uses a slightly different approach to solve replay attacks instead of seqno, so you can call this wallet several times at once to send even thousands of transactions in a second.

:::caution محدودیت‌ها
توجه، هنگام کار با والت لود بالا نیاز است که محدودیت‌های زیر بررسی شوند و به آنها توجه شود.
:::

1. **Storage size limit.** Currently, size of contract storage should be less than 65535 cells. If size of
  old_queries will grow above this limit, exception in ActionPhase will be thrown and transaction will fail.
  Failed transaction may be replayed.
2. **Gas limit.** Currently, gas limit is 1'000'000 GAS units, that means that there is a limit of how much
  old queries may be cleaned in one tx. If number of expired queries will be higher, contract will stuck.

That means that it is not recommended to set too high expiration date:
the number of queries during expiration time span should not exceed 1000.

Also, the number of expired queries cleaned in one transaction should be below 100.

## How to

شما می‌توانید مقاله [راهنمای‌های Highload Wallet](/v3/guidelines/smart-contracts/howto/wallet#-high-load-wallet-v3) را نیز مطالعه کنید.

کد منبع Wallet:

- [ton/crypto/smartcont/Highload-wallet-v2-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet-v2.fif)

<Feedback />

