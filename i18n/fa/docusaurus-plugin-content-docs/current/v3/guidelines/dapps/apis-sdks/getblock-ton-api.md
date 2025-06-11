import Feedback from '@site/src/components/Feedback';

# HTTP API by GetBlock

:::tip TON infrastructure status

- [status.toncenter](https://status.toncenter.com/) - Provides various statistics of node activity in the last hour.
- [Tonstat.us](https://tonstat.us/) - A real-time Grafana dashboard that updates every 5 minutes.
  :::

This guide covers essential steps in acquiring and using private RPC endpoints by GetBlock to access TON Blockchain.

:::info
[GetBlock](https://getblock.io/) is a Web3 infrastructure provider that offers HTTP-based API endpoints for clients to interact with multiple blockchain networks, including TON.
:::

## How to access TON Blockchain endpoints

To start using GetBlock’s endpoints, users need to log in to their accounts, and retrieve a TON endpoint URL. Follow these instructions:

### 1. Create a GetBlock account

Visit the GetBlock website and click on the "Get Started for Free" button. Sign up using your email address or by connecting your MetaMask wallet.

![GetBlock.io_main_page](/img/docs/getblock-img/unnamed-2.png?=RAW)

### 2. Select TON Blockchain

After signing in, go to the "My Endpoints" section. Choose TON from the "Protocols" dropdown menu and select the desired network and API type (JSON-RPC or JSON-RPC(v2)).

![GetBlock_account__dashboard](/img/docs/getblock-img/unnamed-4.png)

### 3. Generate your endpoint URL

Click the **Get** button to generate your TON Blockchain endpoint URL. The structure of the endpoint will be: `https://go.getblock.io/[ACCESS TOKEN]/`.

Access tokens act as unique identifiers for your requests, eliminating the need for separate API keys or authorization headers.

کاربران می‌توانند به راحتی چندین نقطه پایانی ایجاد کنند، توکن‌های خود را در صورت افشا شدن تغییر دهند یا نقاط پایانی غیر استفاده را حذف کنند.

![GetBlock_account_endpoints](/img/docs/getblock-img/unnamed-3.png)

Now, you can use these URLs to interact with TON Blockchain, query data, send transactions, and build decentralized applications without the hassle of infrastructure setup and maintenance.

### Free requests and user limits

Each registered user receives 40,000 free requests per day, with a cap of 60 requests per second (RPS). This balance is renewed daily and can be used for any supported blockchain.

### Shared nodes

- فرصتی ابتدایی که در آن نود‌ها به طور همزمان توسط چندین مشتری استفاده می‌شوند؛
- محدودیت نرخ به ۲۰۰ RPS افزایش یافته است؛
- بسیار مناسب برای استفاده فردی یا برای برنامه‌هایی که حجم تراکنش و نیازهای منابع کمتری نسبت به برنامه‌های تولید کاملاً مقیاس‌پذیر دارند؛
- گزینه‌ای مقرون به صرفه‌تر برای توسعه‌دهندگان فردی یا تیم‌های کوچک با بودجه محدود.

Shared nodes provide a cost-effective solution for accessing TON Blockchain infrastructure without the need for significant upfront investment or commitment.

همانطور که توسعه‌دهندگان برنامه‌های خود را گسترده می‌کند و به منابع بیشتری نیاز پیدا می‌کنند، می‌توانند به راحتی طرح‌های اشتراک خود را ارتقاء دهند یا در صورت نیاز به نود‌های اختصاصی تغییر دهند.

### Dedicated nodes

- One node is exclusively allocated to a single client;
- No request limits;
- دسترسی به نود‌های آرشیوی، مکان‌های سرور مختلف، و تنظیمات سفارشی را فراهم می‌کند؛
- خدمات و پشتیبانی سطح برتر را به مشتریان تضمین می‌کند.

این یک راه‌حل درجه بعدی برای توسعه‌دهندگان و برنامه‌های غیرمتمرکز (dApps) است که همسو با توسعه، به حجم بالاتر، سرعت بالاتر اتصال نود و منابع تضمین شده نیاز دارند.

## چگونه از TON HTTP API توسط GetBlock استفاده کنیم

In this section, we delve into the practical usage of the TON HTTP API provided by GetBlock. We explore the examples to showcase how to effectively utilize the generated endpoints for your blockchain interactions.

### مثال‌هایی از تماس‌های متداول API

You can use the `/getAddressBalance` method to get the balance for a specific TON address:

```
curl --location --request GET 'https://go.getblock.io/[ACCESS-TOKEN]/getAddressBalance?address=EQDXZ2c5LnA12Eum-DlguTmfYkMOvNeFCh4rBD0tgmwjcFI-' \    
--header 'Content-Type: application/json' 
```

اطمینان حاصل کنید که `ACCESS-TOKEN` را با توکن دسترسی واقعی خود که توسط GetBlock ارائه شده است جایگزین کنید.

این موجودی را در واحد nanotons نمایش می‌دهد.

![getAddressBalance_response_on_TON_Blockchain](/img/docs/getblock-img/unnamed-2.png)

برخی دیگر از روش‌های موجود برای پرس‌وجوی بلاکچین TON:

| # | متد  | نقطه پایانی        | توضیحات                                                                                                                 |
| - | ---- | ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| ۱ | GET  | getAddressState    | Returns the current state of a specified address (uninitialized, active, or frozen). |
| ۲ | GET  | getMasterchainInfo | Fetches the state of the masterchain.                                                                   |
| ۳ | GET  | getTokenData       | Retrieves details about an NFT or jetton associated with the address.                                   |
| ۴ | GET  | packAddress        | Converts a TON address from raw format to human-readable format.                                        |
| ۵ | POST | sendBoc            | Sends serialized BOC files with external messages for blockchain execution.                             |

For a comprehensive list of methods and detailed API documentation, please refer to GetBlock's [documentation](https://getblock.io/docs/ton/json-rpc/ton_jsonrpc/).

### استقرار قراردادهای هوشمند

Developers can utilize the TON library to deploy and interact with contracts. The library will initialize a client to connect to the network via the GetBlock HTTP API endpoints.

![تصویر از TON Blueprint IDE](/img/docs/getblock-img/unnamed-6.png)

By following this guide, developers can easily access TON Blockchain using GetBlock's infrastructure. Whether you're working on decentralized applications (dApps) or simply querying data, GetBlock simplifies the process by offering ready-to-use HTTP API endpoints with various features.

Feel free to learn more at the website or drop a line to GetBlock’s support via live chat, Telegram, or a website form.

<Feedback />

