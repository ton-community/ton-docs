import Feedback from '@site/src/components/Feedback';

# راهنمای استخراج TON

:::warning منسوخ شده
This information may be outdated and no longer relevant. You can skip it.
:::

## <a id="introduction"></a>معرفی

This document provides an introduction to the process of mining Toncoin using PoW givers. Please visit [ton.org/mining](https://ton.org/mining) for up-to-date status of TON mining.

## <a id="quick-start"></a>شروع سریع

برای شروع به استخراج بلافاصله:

1. [کامپیوتر مناسب برای استخراج](#hardware) را به‌دست آورید.
2. توزیع نسخه دسکتاپ یا سرور [اوبونتو](https://ubuntu.com) ۲۰٫۰۴ را نصب کنید.
3. [mytonctrl](https://github.com/igroman787/mytonctrl#installation-ubuntu) را در حالت `lite` نصب کنید.
4. سخت‌افزار خود را بررسی کرده و [درآمد تخمینی استخراج](/v3/documentation/archive/mining#income-estimates) خود را با اجرای دستور `emi` در `mytonctrl` چک کنید.
5. اگر هنوز ندارید، یک `wallet address` با استفاده از یکی از [کیف‌پول‌ها](https://www.ton.org/wallets) ایجاد کنید.
6. `wallet address` خود را به‌عنوان هدف استخراج با اجرای `set minerAddr "..."` در `mytonctrl` تعریف کنید.
7. یک قرارداد ارائه‌دهنده از لیست موجود در [ton.org/mining](https://ton.org/mining) انتخاب کنید و با اجرای `set powAddr "..."` در `mytonctrl`، ماینر خود را برای استخراج آن تنظیم کنید.
8. با اجرای `mon` در `mytonctrl` استخراج را شروع کنید
9. بارگذاری CPU در کامپیوتر خود را بررسی کنید؛ فرآیندی به‌نام `pow-miner` باید تقریباً بیشتر CPU شما را استفاده کند.
10. منتظر بمانید تا خوش‌شانس شوید؛ خروجی مرحله ۴ باید به شما نشان دهد که به‌طور تقریبی چقدر احتمال دارد که یک بلاک را استخراج کنید.

## <a id="basics"></a>اصول اولیه

Toncoin is distributed by `PoW Givers`, which are smart contracts with specific amounts of Toncoin assigned to them. Currently, there are 10 active PoW givers on the TON Network. Each giver distributes coins in blocks of 100 TON. To earn one of these blocks, your computer must solve a complex mathematical challenge faster than other miners. If another miner solves the problem before you, your machine's work is discarded, and a new round begins.

Mining profits are not gradual; they come in batches of 100 TON for each successfully solved giver challenge. This means that if your machine has a 10% chance to calculate a block within 24 hours (see step 4 of [Quick start](/v3/documentation/archive/mining#quick-start)) then you will probably need to wait for ~10 days before you will get a 100 TON reward.

The process of mining is largely automated by `mytonctrl`. Detailed information about the mining process can be found in [PoW givers](https://www.ton.org/#/howto/pow-givers) document.

## <a id="advanced"></a>پیشرفته

If you're serious about mining and want to operate multiple machines or a mining farm, it's essential to learn about TON and how mining works. Refer to the [HOWTO](https://ton.org/#/howto/) section for detailed information. Here is some general advice:

- **حتماً** نود/لایت سرور خود را روی ماشینی جداگانه اجرا کنید؛ این امر اطمینان حاصل می‌کند که مزرعه استخراج شما به لایت سرورهای خارجی که ممکن است قطع شوند یا نتوانند به سرعت به درخواست‌های شما پاسخ دهند، وابسته نباشد.
- **DO NOT** bombard public lite servers with `get_pow_params` queries, if you have custom scripts that poll givers status in high frequency you **must** use your own lite server. Clients that violate this rule risk having their IPs blacklisted on public lite servers.
- **حتماً** سعی کنید بفهمید که [فرآیند استخراج](https://www.ton.org/#/howto/pow-givers) چگونه کار می‌کند؛ اکثر ماینرهای بزرگ از اسکریپت‌های خود استفاده می‌کنند که در محیط‌هایی با چندین ماشین استخراج مزایای بسیاری نسبت به `mytonctrl` ارائه می‌دهد.

## <a id="hardware"></a>سخت‌افزار ماینر

The total network hashrate of TON mining is very high; miners need high-performance machines if they wish to succeed. Mining on standard home computers and notebooks is futile, and we advise against such attempts.

#### CPU

A modern CPU with [Intel SHA Extension](https://en.wikipedia.org/wiki/Intel_SHA_extensions) support is **essential**. Most miners use AMD EPYC or Threadripper machines with at least 32 cores and 64 threads.

#### GPU

Yes! You can mine TON using GPU. There is a version of a PoW miner that is capable to use both Nvidia and AMD GPUs; you can find the code and instructions on how to use it in the [POW Miner GPU](https://github.com/tontechio/pow-miner-gpu/blob/main/crypto/util/pow-miner-howto.md) repository.

در حال حاضر، برای استفاده از این، نیاز به دانش فنی بالایی است، اما ما در حال کار بر روی یک راه‌حل کاربر پسندتر هستیم.

#### حافظه

Almost the entire mining process happens in the L2 cache of the CPU. That means that memory speed and size play no role in mining performance. A dual AMD EPYC system with a single DIMM on one memory channel will mine just as fast as one with 16 DIMMs occupying all channels.

Please do note that this applies to the plain mining process **only**, if your machine also runs full node or other processes, then things change! But this is outside the scope of this guide.

#### حافظه

ماینری که در حالت سبک اجرا می‌شود، فضای ذخیره‌سازی حداقلی استفاده کرده و داده‌ها را ذخیره نمی‌کند.

#### شبکه

ماینر ساده نیاز دارد که بتواند اتصالات خروجی به اینترنت را باز کند.

#### FPGA / ASIC

ببینید [می‌توانم از FPGA / ASIC استفاده کنم؟](/v3/documentation/archive/mining#can-i-use-my-btceth-rig-to-mine-ton)

### <a id="hardware-cloud"></a>ماشین‌های ابری

Many people mine using AWS or Google compute cloud machines. As outlined in the specs above, what really matters is CPU. Therefore, we advise AWS [c5a.24xlarge](https://aws.amazon.com/ec2/instance-types/c5/) or Google [n2d-highcpu-224](https://cloud.google.com/compute/vm-instance-pricing) instances.

### <a id="hardware-estimates"></a>برآورد درآمد

The formula for calculating the income is quite simple: `($total_bleed / $total_hashrate) * $your_hashrate`. This will give you a **current** estimate. You can find out the variables on [ton.org/mining](https://ton.org/mining) or use the estimated mining income calculator (`emi` command) in `mytonctrl`. Here is sample output made on August 7th, 2021 using i5-11400F CPU:

```
Mining income estimations
-----------------------------------------------------------------
Total network 24h earnings:         171635.79 TON
Average network 24h hashrate:       805276100000 HPS
Your machine hashrate:              68465900 HPS
Est. 24h chance to mine a block:    15%
Est. monthly income:                437.7 TON
```

**Important**: Please do note that the information provided is based on _network hashrate at the moment of execution_. Your actual income over time will depend on many factors, such as changing network hashrate, the chosen giver, and a good portion of luck.

## <a id="faq"></a>پرسش‌های متداول

### <a id="faq-general"></a>عمومی

#### <a id="faq-general-posorpow"></a>آیا TON شبکه‌ی PoS است یا PoW؟

TON Blockchain operates on a Proof-of-Stake (PoS) consensus. Mining is not required to create new blocks.

#### <a id="faq-general-pow"></a>چطور شد که TON اثبات کار است؟

Well, the reason is that the initial issue of 5 billion Toncoins were transferred to ad hoc Proof-of-Work Giver smart contracts.
Mining is used to obtain Toncoins from this smart contract.

#### <a id="faq-general-supply"></a>چند سکه برای ماینینگ باقی‌مانده است؟

The most actual information is available on [ton.org/mining](https://ton.org/mining), see `bleed` graphs. PoW Giver contracts have their limits and will dry out once users mine all the available Toncoins.

#### <a id="faq-general-mined"></a>تا کنون چند سکه ماین شده است؟

تا آگوست ۲۰۲۱، حدود ۴.۹ میلیارد تون‌کوین ماین شده است.

#### <a id="faq-general-whomined"></a>چه کسی این سکه‌ها را ماین کرده است؟

Coins have been mined to over 70,000 wallets. The owners of these wallets remain unknown.

#### <a id="faq-general-elite"></a>آیا شروع به ماینینگ دشوار است؟

Not at all. All you need is [adequate hardware](#hardware) and to follow the steps outlined in the [quick start](#quick-start) section.

#### <a id="faq-general-pissed"></a>آیا راه دیگری برای ماینینگ وجود دارد؟

بله، یک اپلیکیشن شخص ثالث به نام [TON Miner Bot](https://t.me/TonMinerBot) وجود دارد.

#### <a id="faq-general-stats"></a>کجا می‌توانم آمار استخراج را ببینم؟

[ton.org/mining](https://ton.org/mining)

#### <a id="faq-general-howmany"></a>چند ماینر وجود دارد؟

We cannot say this. All we know is the total hashrate of all miners on the network. However, there are graphs on [ton.org/mining](https://ton.org/mining) that attempt to estimate quantity of machines of certain type needed to provide approximate total hashrate.

#### <a id="faq-general-noincome"></a>آیا برای شروع ماینینگ به تون‌کوین نیاز دارم؟

No, you do not. Anyone can start mining without owning a single Toncoin.

#### <a id="faq-mining-noincome"></a>چرا حتی بعد از چند ساعت استخراج، تراز کیف پول من افزایش نمی‌یابد؟

TON are mined in blocks of 100, you either guess a block and receive 100 TON or receive nothing. Please see [basics](#basics).

#### <a id="faq-mining-noblocks"></a>من برای چند روز ماین کرده‌ام و هیچ نتیجه‌ای نمی‌بینم، چرا؟

Did you check your current [Income estimates](/v3/documentation/archive/mining#income-estimates)? If field `Est. 24h chance to mine a block` is less than 100%, then you need to be patient. Also, please note that a 50% chance to mine a block within 24 hours does not automatically mean that you will mine one within 2 days; 50% applies to each day separately.

#### <a id="faq-mining-pools"></a>آیا استخر‌های ماینینگ وجود دارد؟

نه، تا کنون هیچ پیاده‌سازی از استخر‌های ماینینگ وجود ندارد، همه برای خودشان ماین می‌کنند.

#### <a id="faq-mining-giver"></a>کدام اعطا کننده را باید ماین کنم؟

It does not really matter which giver you choose. The difficulty tends to fluctuate on each giver, so the current easiest giver on [ton.org/mining](https://ton.org/mining) might become the most complex within an hour. The same applies in the opposite direction.

### <a id="faq-hw"></a>سخت‌افزار

#### <a id="faq-hw-machine"></a>آیا همیشه یک ماشین سریع‌تر برنده می‌شود؟

No, all miners take different roads to find the solution. A faster machine has a higher probability of success, but it doesn't guarantee victory!

#### <a id="faq-hw-machine"></a>ماشین من چقدر درآمد تولید خواهد کرد؟

لطفاً به [تخمین‌های درآمد](/v3/documentation/archive/mining#income-estimates) مراجعه کنید.

#### <a id="faq-hw-asic"></a>آیا می‌توانم از ریگ BTC/ETH خود برای ماین TON استفاده کنم؟

No, TON uses a single SHA256 hashing method which is different from BTC, ETH, and others. ASICS or FPGAs which are built for mining other cryptos will not help.

#### <a id="faq-hw-svsm"></a>یک ماشین سریع تنها یا چند ماشین کند کدام بهتر است؟

This is controversial. See: miner software launches threads for each core on the system, and each core gets its own set of keys to process, so if you have one machine capable to run 64 threads and 4 x machines capable to run 16 threads each, then they will be exactly as successful assuming that the speed of each thread is the same.

با این حال، در دنیای واقعی، پردازنده‌هایی با تعداد هسته کمتر معمولاً با کلاک سریع‌تری عمل می‌کنند، بنابراین ممکن است با چندین ماشین موفق‌تر باشید.

#### <a id="faq-hw-mc"></a>اگر ماشین‌های زیادی را اجرا کنم، آیا آن‌ها با هم همکاری می‌کنند؟

No, they will not. Each machine mines on its own, but the solution finding process is random: no machine, not even a single thread (see above) will take the same path. Thus, their hashrates add up in your favor without direct cooperation.

#### <a id="faq-hw-CPU"></a>آیا می‌توانم با استفاده از CPUهای ARM ماین کنم؟

بسته به CPU، نمونه‌های AWS Graviton2 واقعاً ماینرهای بسیار توانمندی هستند و می‌توانند نسبت قیمت/عملکرد را در کنار نمونه‌های مبتنی بر AMD EPYC حفظ کنند.

### <a id="faq-software"></a>نرم‌افزار

#### <a id="faq-software-os"></a>آیا می‌توانم با استفاده از Windows/xBSD/برخی دیگر از سیستم‌عامل‌ها ماین کنم؟

Of course, [TON source code](https://github.com/ton-blockchain/ton) has been known to be built on Windows, xBSD and other OSes. However, there is no comfortable automated installation, as under Linux with `mytonctrl`, you will need to install the software manually and create your own scripts. For FreeBSD, there is a [port](https://github.com/sonofmom/freebsd_ton_port) source code that allows quick installation.

#### <a id="faq-software-node1"></a>آیا ماینینگ سریع‌تر خواهد بود اگر mytonctrl را در حالت نود کامل اجرا کنم؟

خود فرآیند محاسبه سریع‌تر نخواهد شد، اما اگر نود کامل یا لایت سرور خود را اداره کنید، پایداری و مهم‌تر از همه، انعطاف‌پذیری به دست خواهید آورد.

#### <a id="faq-software-node2"></a>برای اداره یک نود کامل به چه چیزی نیاز دارم و چگونه می‌توانم آن را اجرا کنم؟

این خارج از محدوده این راهنما است، لطفاً به [راهنمای نود کامل](https://ton.org/#/howto/full-node) و/یا [دستورالعمل‌های mytonctrl](https://github.com/igroman787/mytonctrl) مراجعه کنید.

#### <a id="faq-software-build"></a>آیا می‌توانید به من در ساخت نرم‌افزار بر روی سیستم‌عامل من کمک کنید؟

این خارج از محدوده این راهنما است، لطفاً به [راهنمای نصب نود کامل](https://ton.org/#/howto/full-node) و همچنین [اسکریپت‌های نصب Mytonctrl](https://github.com/igroman787/mytonctrl/blob/master/scripts/toninstaller.sh#L44) مراجعه کنید تا اطلاعاتی درباره وابستگی‌ها و فرآیند کسب کنید.

<Feedback />

