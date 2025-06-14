import Feedback from '@site/src/components/Feedback';

# Smart contract addresses

On the TON Blockchain, every actor, including wallets and smart contracts, is represented by an address. These addresses are critical for receiving and sending messages and transactions. There are two main formats for smart contract addresses: **raw addresses** and **user-friendly addresses**.

## Address components

هر آدرس در TON شامل دو جزء اصلی است:

- **شناسه ورک‌چین**: یک عدد صحیح ۳۲ بیتی امضا شده که مشخص می‌کند قرارداد به کدام ورک‌چین تعلق دارد (به عنوان مثال، `-1` برای مسترچین و `0` برای بیس‌چین).
- **شناسه حساب**: یک شناسه منحصر به فرد برای قرارداد، که به طور کلی برای مسترچین و بیس‌چین ۲۵۶ بیت طول دارد.

## Address states

هر آدرس در TON می‌تواند در یکی از وضعیت‌های زیر باشد:

- **عدم وجود**: آدرس داده‌ای ندارد (وضعیت اولیه برای همه آدرس‌ها).
- **غیرفعال**: آدرس دارای موجودی است اما کد قرارداد هوشمند ندارد.
- **فعال**: آدرس با کد قرارداد هوشمند و موجودی فعال است.
- **منجمد**: آدرس به دلیل هزینه‌های ذخیره‌سازی که از موجودی آن فراتر رفته است قفل شده است.

## Address formats

A TON address uniquely identifies a contract in the blockchain, indicating its workchain and original state hash. [Two standard formats](/v3/documentation/smart-contracts/addresses#raw-and-user-friendly-addresses) are used: **raw** (workchain and HEX-encoded hash separated by the ":" character) and **user-friendly** (base64-encoded with certain flags).

```
User-friendly: EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
Raw: 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e
```

## User-friendly address

A **user-friendly address** designed for blockchain users with features:

1. **Flags**: Indicates if the address is bounceable for contracts or non-bounceable for wallets.
2. **Checksum**: A 2-byte error-checking mechanism CRC16 that helps detect errors before sending.
3. **رمزگذاری**: آدرس خام را به یک فرم خوانا و فشرده تبدیل می‌کند که از base64 یا base64url استفاده می‌کند.

Example: `EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF` (base64)

آدرس‌های کاربر پسند تراکنش‌ها را با جلوگیری از خطاها و امکان بازگشت وجوه در صورت شکست تراکنش‌ها ایمن‌تر می‌کنند.

### User-friendly address flags

Two flags are defined: **bounceable**/**non-bounceable** and **testnet**/**any-net**. The first letter of the address reflects address type because it stands for the first 6 bits in address encoding, and flags are located in these 6 bits according to [TEP-2](https://github.com/ton-blockchain/TEPs/blob/master/text/0002-address.md#smart-contract-addresses):

|                   Address beginning                  |        Binary form        | Bounceable | Testnet-only |
| :--------------------------------------------------: | :-----------------------: | :--------: | :----------: |
| E... | 000100.01 |     yes    |      no      |
| U... | 010100.01 |     no     |      no      |
| k... | 100100.01 |     yes    |      yes     |
| 0... | 110100.01 |     no     |      yes     |

:::tip
The Testnet-only flag doesn't have representation in the blockchain at all. The non-bounceable flag makes a difference only when used as the destination address for a transfer: in this case, it [disallows bounce](/v3/documentation/smart-contracts/message-management/non-bounceable-messages) for a message sent; the address in blockchain, again, does not contain this flag.
:::

```
default bounceable: EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
urlSafe: EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff+W72r5gqPrHF
non-bounceable: UQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPuwA
Testnet: kQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPgpP
non-bounceable, Testnet: 0QDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPleK
```

## Raw address

یک **آدرس خام** فقط عناصر اساسی را شامل می‌شود:

- **شناسه ورک‌چین** (به عنوان مثال، `-1` برای مسترچین)
- **شناسه حساب**: یک شناسه ۲۵۶ بیتی منحصر به فرد

مثال:\
`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

با این حال، آدرس‌های خام دو مشکل اصلی دارند:

1. آن‌ها دارای چک‌ نهایی داخلی نیستند، بنابراین یک اشتباه در کپی کردن می‌تواند منجر به از دست دادن وجوه شود.
2. They don't support additional features like bounceable/non-bounceable flags.

## Converting between address formats

Convert raw, user-friendly addresses using [ton.org/address](https://ton.org/address/).

For more details, refer to the refhandling guide in the [Smart contracts addresses documentation](/v3/documentation/smart-contracts/addresses/) section.

## See also

- [Explorers in TON](/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton/)
- [Smart contracts addresses documentation](/v3/documentation/smart-contracts/addresses/)

<Feedback />

