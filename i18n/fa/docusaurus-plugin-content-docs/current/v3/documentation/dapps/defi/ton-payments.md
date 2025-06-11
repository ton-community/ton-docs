import Feedback from '@site/src/components/Feedback';

# TON Payments

TON Payments پلتفرمی برای کانال‌های پرداخت خرد است.

این امکان را فراهم می‌کند تا پرداخت‌های فوری بدون نیاز به تعهد تمامی تراکنش‌ها به بلاک‌چین، پرداخت هزینه‌های تراکنش (مثلاً، برای گس مصرف شده) و انتظار پنج ثانیه تا زمانی که بلوک حاوی تراکنش‌های مورد نظر تایید شود، انجام پذیرد.

Because the overall expense of such instant payments is so minimal, they can be used for micropayments in games, APIs, and off-chain apps. [See examples](/v3/documentation/dapps/defi/ton-payments#examples).

- [پرداخت‌ها در TON](https://blog.ton.org/ton-payments)

## کانال‌های پرداخت

### قرارداد‌های هوشمند

- [ton-blockchain/payment-channels](https://github.com/ton-blockchain/payment-channels)

### SDK

برای استفاده از کانال‌های پرداخت، نیازی به دانش عمیق از رمزنگاری ندارید.

شما می‌توانید از SDKهای آماده استفاده کنید:

- [toncenter/tonweb](https://github.com/toncenter/tonweb) یک SDK برای JavaScript
- [toncenter/payment-channels-example](https://github.com/toncenter/payment-channels-example)—چگونه یک کانال پرداخت با tonweb استفاده می‌شود.

### مثال‌ها

مثال‌هایی از استفاده کانال‌های پرداخت در برندگان [Hack-a-TON #۱](https://ton.org/hack-a-ton-1) بیابید:

- [grejwood/Hack-a-TON](https://github.com/Grejwood/Hack-a-TON)—پروژه پرداخت OnlyTONs ([وبسایت](https://main.d3puvu1kvbh8ti.amplifyapp.com/)، [ویدئو](https://www.youtube.com/watch?v=38JpX1vRNTk))
- [nns2009/Hack-a-TON-1_Tonario](https://github.com/nns2009/Hack-a-TON-1_Tonario)—پروژه پرداخت OnlyGrams ([وبسایت](https://onlygrams.io/)، [ویدئو](https://www.youtube.com/watch?v=gm5-FPWn1XM))
- [sevenzing/hack-a-ton](https://github.com/sevenzing/hack-a-ton)—استفاده از API پرداخت به ازای درخواست در TON ([ویدئو](https://www.youtube.com/watch?v=7lAnbyJdpOA&feature=youtu.be))
- [illright/diamonds](https://github.com/illright/diamonds)—پلتفرم آموزش پرداخت به ازای دقیقه ([وبسایت](https://diamonds-ton.vercel.app/)، [ویدئو](https://www.youtube.com/watch?v=g9wmdOjAv1s))

## See also

- [Payments processing](/v3/guidelines/dapps/asset-processing/payments-processing)
- [TON Connect](/v3/guidelines/ton-connect/overview)

<Feedback />

