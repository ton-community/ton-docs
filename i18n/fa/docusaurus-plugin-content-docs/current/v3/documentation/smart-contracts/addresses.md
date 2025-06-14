import Feedback from '@site/src/components/Feedback';

# Smart contract addresses

This section describes the specifics of smart contract addresses on the TON Blockchain. It also explains how actors are synonymous with smart contracts on TON.

## Everything is a smart contract

On TON, smart contracts are built using the [Actor model](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#single-actor). In fact, actors on TON are technically represented as smart contracts. This means that even your wallet is a simple actor (and a smart contract).

Typically, actors process incoming messages, change their internal states, and generate outbound messages as a result. That's why every actor (i.e., smart contract) on TON Blockchain must have an address, so it can receive messages from other actors.

:::info تجربه EVM
On the Ethereum Virtual Machine (EVM), addresses are completely separate from smart contracts. Feel free to learn more about the differences by reading our article ["Six unique aspects of TON Blockchain that will surprise Solidity developers"](https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers) - _Tal Kol_.
:::

## Address of smart contract

آدرس‌های قرارداد هوشمند در TON شامل دو جزء اصلی هستند:

- **(workchain_id)**: نشان‌دهندهٔ ID کار پوشه (یک عدد صحیح ۳۲ بیتی امضا شده)

- **(account_id)** آدرس حساب را نشان می‌دهد (۶۴-۵۱۲ بیت، بسته به کار پوشه)

در بخش مرور آدرس خام این مستندات، بحث خواهیم کرد که جفت‌های **(workchain_id, account_id)** چگونه ارائه می‌شوند.

### WorkChain ID and Account ID

#### شناسه کار پوشه

[As we've seen before](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#workchain-blockchain-with-your-own-rules), it is possible to create as many as `2^32` workchains operating on TON Blockchain. We also noted how 32-bit prefix smart contract addresses identify and are linked to smart contract addresses within different workchains. This allows smart contracts to send and receive messages to and from different workchains on TON Blockchain.

امروزه تنها مسترچین (workchain_id=-1) و گاهی اوقات کار پوشه پایه (workchain_id=0) در بلاکچین TON در حال اجرا هستند.

هر دوی آن‌ها دارای آدرس‌های ۲۵۶ بیتی هستند، بنابراین فرض می‌کنیم که workchain_id برابر با ۰ یا -۱ باشد و آدرس در کار پوشه دقیقاً ۲۵۶ بیت است.

#### شناسه حساب

All account IDs on TON use 256-bit addresses on the Masterchain and Basechain (also referred to as the basic workchain).

In fact, an Account ID (**account_id**) is defined as the result of applying a hash function (specifically SHA-256) to a smart contract object. Every smart contract operating on the TON Blockchain stores two main components:

1. _Compiled code_. The logic of the smart contract, compiled into bytecode.
2. _Initial state_. The contract's values at the moment it is deployed on-chain.

To derive the contract's address, you calculate the hash of the **(Initial code, Initial state)** pair. We won’t explore how the [TVM](/v3/documentation/tvm/tvm-overview) works at this time, but it is important to understand that account IDs on TON follow this formula:

**account_id = hash(initial code, initial state)**

Later in this documentation, we will dive deeper into the technical specifications of the TVM and TL-B scheme. Now that we are familiar with how the **account_id** is generated and how it interacts with smart contract addresses on TON, let’s discuss Raw and User-Friendly addresses.

## وضعیت‌های آدرس

هر آدرس می‌تواند در یکی از وضعیت‌های ممکن باشد:

- `nonexist` - there were no accepted transactions on this address, so it doesn't have any data (or the contract was deleted). We can say that initially all 2<sup>256</sup> address are in this state.
- `uninit` - address has some data, which contains balance and meta info. At this state address doesn't have any smart contract code/persistent data yet. An address enters this state, for example, when it was in a nonexist state, and another address sent tokens to it.
- `active` - address has smart contract code, persistent data and balance. At this state it can perform some logic during the transaction and change its persistent data. An address enters this state when it was `uninit` and there was an incoming message with state_init param (note, that to be able to deploy this address, hash of `state_init` and `code` must be equal to address).
- `frozen` - address cannot perform any operations, this state contains only two hashes of the previous state (code and state cells respectively). When an address's storage charge exceeds its balance, it goes into this state. To unfreeze it, you can send an internal message with `state_init` and `code` which store the hashes described earlier and some Toncoin. It can be difficult to recover it, so you should not allow this situation. There is a project to unfreeze the address, which you can find [here](https://unfreezer.ton.org/).

## Raw and user-friendly addresses

پس از ارائه یک نمای کلی از نحوه استفاده آدرس‌های قرارداد هوشمند در TON از شناسه‌های کار پوشه و حساب (به طور خاص برای مسترچین و بیسچین)، درک این که این آدرس‌ها در دو قالب اصلی بیان می‌شوند مهم است:

- **آدرس‌های خام**: نمایه کامل اصلی از آدرس‌های قرارداد هوشمند.
- **آدرس‌های کاربر پسند**: آدرس‌های کاربر پسند، یک قالب بهبود یافته از آدرس خام هستند که امنیت و سهولت استفاده بهتری دارند.

در زیر، بیشتر در مورد تفاوت‌های بین این دو نوع آدرس توضیح خواهیم داد و بیشتر به این موضوع می‌پردازیم که چرا آدرس‌های کاربر پسند در TON استفاده می‌شوند.

### آدرس خام

آدرس‌های خام قرارداد هوشمند از یک شناسه کار پوشه و شناسه حساب _(workchain_id, account_id)_ تشکیل شده و به شکل زیر نمایش داده می‌شود:

- [workchain_id دهدهی\]:[۶۴ رقم شانزده‌شانزدهی با account_id\]

در زیر مثالی از آدرس خام قرارداد هوشمند که از شناسه کار پوشه و شناسه حساب به‌طور همزمان استفاده می‌کند (با عنوان **workchain_id** و **account_id** بیان شده) ارائه شده است:

`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

توجه کنید به `-1` در ابتدای رشته آدرس، که نشان‌دهنده‌ی _workchain_id_ متعلق به مسترچین است.

:::note
Uppercase letters (such as 'A', 'B', 'C', 'D' etc.) may be used in address strings instead of their lowercase counterparts (such as 'a', 'b', 'c', 'd' etc.).
:::

#### Issues with raw addresses

استفاده از فرم آدرس خام دو مشکل اصلی ایجاد می‌کند:

1. When using the raw address format, it's not possible to verify addresses to eliminate errors prior to sending a transaction.
   This means that if you accidentally add or remove characters in the address string prior to sending the transaction, your transaction will be sent to the wrong destination, resulting in loss of funds.
2. When using the raw address format, it's impossible to add special flags like those used when sending transactions that employ user-friendly addresses.
   To help you better understand this concept, we’ll explain which flags can be used below.

### User-friendly address

آدرس‌های کاربر پسند برای ایمن‌سازی و ساده‌سازی تجربه کاربران TON که آدرس‌ها را در اینترنت (برای مثال، بر روی پلتفرم‌های پیام‌رسان عمومی یا از طریق ارائه‌دهندگان خدمات ایمیل) و همین‌طور در دنیای واقعی به اشتراک می‌گذارند، توسعه داده شده‌اند.

#### User-friendly address structure

آدرس‌های کاربر پسند در مجموع از ۳۶ بایت تشکیل شده‌اند و با تولید مؤلفه‌های زیر به ترتیب به دست می‌آیند:

1. _[flags - 1 byte]_ — Flags that are pinned to addresses change the way smart contracts react to the received message.
   Flags types that employ the user-friendly address format include:

   - isBounceable. Denotes a bounceable or non-bounceable address type. (_0x11_ for "bounceable", _0x51_ for "non-bounceable")
   - isTestnetOnly. Denotes an address type used for testnet purposes only. Addresses beginning with _0x80_ should not be accepted by software running on the production network
   - isUrlSafe. Denotes a deprecated flag that is defined as URL-safe for an address. All addresses are then considered URL-safe.
2. _\[workchain_id - 1 byte]_ — The workchain ID (_workchain_id_) is defined by a signed 8-bit integer _workchain_id_.\
   (_0x00_ for the BaseChain, _0xff_ for the MasterChain)
3. _\[شناسه حساب - ۳۲ بایت]_ — شناسه حساب از یک آدرس ۲۵۶ بیتی ([بزرگ-اندی در](https://www.freecodecamp.org/news/what-is-endianness-big-endian-vs-little-endian/)) در کارchain ساخته شده است.
4. _\[address verification - 2 bytes]_ —  In user-friendly addresses, address verification is composed of a CRC16-CCITT signature from the previous 34 bytes. ([Example](https://github.com/andreypfau/ton-kotlin/blob/ce9595ec9e2ad0eb311351c8a270ef1bd2f4363e/ton-kotlin-crypto/common/src/crc32.kt))
   In fact, the idea pertaining to verification for user-friendly addresses is quite similar to the [Luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm), which is used on all credit cards to prevent users from entering non-existing card numbers by mistake.

اضافه شدن این ۴ مؤلفه اصلی بدین معناست که: `1 + 1 + 32 + 2 = 36` بایت در مجموع (برای هر آدرس کاربر پسند)

برای تولید یک آدرس کاربر پسند، توسعه‌دهنده باید همه ۳۶ بایت را با استفاده از یکی از موارد زیر کدگذاری کند:

- _base64_ (یعنی، شامل اعداد، حروف لاتین بزرگ و کوچک، '/' و '+')
- _base64url_ (با '_' و '-' به جای '/' و '+')

پس از اتمام این فرآیند، تولید آدرس کاربر پسند با طول ۴۸ کاراکتر بدون فاصله کامل می‌شود.

:::info نشانگر‌های آدرس DNS
On TON, DNS addresses such as mywallet.ton are sometimes used instead of raw and user-friendly addresses. DNS addresses are made up of user-friendly addresses and include all the required flags that allow developers to access all the flags from the DNS record within the TON domain.
:::

#### User-friendly address encoding examples

برای مثال، قرارداد هوشمند "test giver" (یک قرارداد هوشمند ویژه که در زنجیره اصلی شبکه آزمایشی مستقر است و ۲ توکن آزمایشی را به هر کسی که درخواست کند ارسال می‌کند) از آدرس خام زیر استفاده می‌کند:

`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

The above "test giver" raw address must be converted into the user-friendly address form. This is obtained using either the base64 or base64url forms (that we introduced previously) as follows:

- `kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYIny` (base64)
- `kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny` (base64url)

:::info
توجه داشته باشید که هر دو فرم (_base64_ و _base64url_) معتبر هستند و باید پذیرفته شوند!
:::

#### Bounceable vs non-bounceable addresses

ایده اصلی پشت نشانگر آدرس قابل برگشت، امنیت وجوه ارسال کننده است.

For example, if the destination smart contract does not exist, or if an issue happens during the transaction, the message will be "bounced" back to the sender and constitute the remainder of the original value of the transaction (minus all transfer and gas fees).
In relation to bounceable addresses specifically:

1. نشانگر **bounceable=false** به طور کلی به این معنا است که گیرنده یک کیف پول است.
2. The **bounceable=true** flag typically denotes a custom smart contract with its own application logic (for example, a DEX). In this example, non-bounceable messages should not be sent because of security reasons.

برای درک بهتر، می‌توانید اطلاعات بیشتری درباره این موضوع را در مستندات ما بخوانید تا [پیام‌های غیرقابل برگشت](/v3/documentation/smart-contracts/message-management/non-bounceable-messages) را بهتر بشناسید.

#### Armored base64 representations

Additional binary data related to TON Blockchain employs similar "armored" base64 user-friendly address representations. These differentiate from one another depending on the first 4 characters of their byte tag. For example, 256-bit Ed25519 public keys are represented by first creating a 36-byte sequence using the below process in order:

- یک برچسب بایت واحد با استفاده از فرمت _0x3E_ یک کلید عمومی را نشان می‌دهد
- یک برچسب بایت واحد با استفاده از فرمت _0xE6_ یک کلید عمومی Ed25519 را نشان می‌دهد
- ۳۲ byte شامل نمایش دودویی استاندارد کلید عمومی Ed25519
- ۲ byte شامل نمایش big-endian از CRC16-CCITT از ۳۴ byte قبلی

The resulting 36-byte sequence is converted into a 48-character base64 or base64url string in the standard fashion. For example, the Ed25519 public key `E39ECDA0A7B0C60A7107EC43967829DBE8BC356A49B9DFC6186B3EAC74B5477D` (usually represented by a sequence of 32 bytes such as:  `0xE3, 0x9E, ..., 0x7D`) presents itself through the "armored" representation as follows:

`Pubjns2gp7DGCnEH7EOWeCnb6Lw1akm538YYaz6sdLVHfRB2`

### Converting user-friendly addresses and raw addresses

ساده‌ترین راه برای تبدیل آدرس‌های کاربرپسند و خام، استفاده از یکی از چندین API TON و ابزارهای دیگر از جمله:

- [ton.org/address](https://ton.org/address)
- [روش API dton.io](https://dton.io/api/address/0:867ac2b47d1955de6c8e23f57994fad507ea3bcfe2a7d76ff38f29ec46729627)
- [روش‌های API toncenter در mainnet](https://toncenter.com/api/v2/#/accounts/pack_address_packAddress_get)
- [روش‌های API toncenter در testnet](https://testnet.toncenter.com/api/v2/#/accounts/pack_address_packAddress_get)

علاوه بر این، دو روش برای تبدیل آدرس‌های کاربرپسند و خام برای کیف پول‌ها با استفاده از JavaScript وجود دارد:

- [تبدیل آدرس از/به فرم کاربرپسند یا خام با استفاده از ton.js](https://github.com/ton-org/ton-core/blob/main/src/address/Address.spec.ts)
- [تبدیل آدرس از/به فرم کاربرپسند یا خام با استفاده از tonweb](https://github.com/toncenter/tonweb/tree/master/src/utils#address-class)

همچنین، می‌توان از مکانیزم‌های مشابه با استفاده از [SDKها](/v3/guidelines/dapps/apis-sdks/sdk) استفاده کرد.

### Address examples

برای نمونه‌های بیشتر درباره آدرس‌های TON، به [TON Cookbook](/v3/guidelines/dapps/cookbook#working-with-contracts-addresses) مراجعه کنید.

## مشکلات ممکن

When interacting with the TON blockchain, it's crucial to understand the implications of transferring TON coins to `uninit` wallet addresses. This section outlines the various scenarios and their outcomes to provide clarity on how such transactions are handled.

### وقتی که Toncoin را به یک آدرس uninit انتقال می‌دهید چه اتفاقی می‌افتد؟

#### تراکنش با `state_init` شامل شده

If you include the `state_init` (which consists of the wallet or smart contract's code and data) with your transaction. The smart contract is deployed first using the provided `state_init`. After deployment, the incoming message is processed, similar to sending to an already initialized account.

#### تراکنش بدون مشخص کردن `state_init` و تنظیم نشانگر `bounce`

The message cannot be delivered to the `uninit` smart contract, and it will be bounced back to the sender. After deducting the consumed gas fees, the remaining amount is returned to the sender's address.

#### تراکنش بدون مشخص کردن `state_init` و مشخص نکردن نشانگر `bounce`

The message cannot be delivered, but it will not bounce back to the sender. Instead, the sent amount will be credited to the receiving address, increasing its balance even though the wallet is not yet initialized. They will be stored there until the address holder deploys a smart wallet contract and then they can access the balance.

#### چگونه آن را به درستی انجام دهیم

The best way to deploy a wallet is to send some TON to its address (which is not yet initialized) with the `bounce` flag cleared. After this step, the owner can deploy and initialize the wallet using funds at the current uninitialized address. This step usually occurs on the first wallet operation.

### بلاک‌چین ton حفاظت در برابر تراکنش‌های اشتباه را پیاده‌سازی می‌کند

In the TON blockchain, standard wallets and apps automatically manage the complexities of transactions to uninitialized addresses by using bounceable and non-bounceable address, which are described [here](#bounceable-vs-non-bounceable-addresses). It is common practice for wallets, when sending coins to non-initialized addresses, to send coins to both bounceable and non-bounceable addresses without return.

اگر نیاز به گرفتن سریع یک آدرس در فرم قابل انشعاب/غیرقابل انشعاب دارید، این کار را می‌توانید [اینجا](https://ton.org/address/) انجام دهید.

### مسئولیت محصولات سفارشی

اگر شما یک محصول سفارشی در بلاک‌چین ton توسعه می‌دهید، لازم است که چک‌ها و منطق مشابهی را پیاده‌سازی کنید:

Ensure your application verifies whether the recipient address is initialized before sending funds.
Based on the address state, use bounceable addresses for user smart contracts with custom application logic to ensure funds are returned. Use non-bounceable addresses for wallets.

<Feedback />

