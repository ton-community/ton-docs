import Feedback from '@site/src/components/Feedback';

# ساختار نمونه آموزش

:::danger
This page is outdated and will be updated soon.
See the [How to contribute](/v3/contribute/).
:::

## معرفی

عنوان معرفی **باید** H2 باشد: `## معرفی`

این بخش برای توضیح زمینه این آموزش و چرایی اهمیت آن است، اینکه در این آموزش چه چیزی خواهیم ساخت و چه چیزی یاد میگیریم.

- این بخش را طوری توضیح دهید که انگار برای یک کودک ۵ ساله توضیح می‌دهید (**[ELI5](https://www.dictionary.com/e/slang/eli5/)**)
- همه چیز را حداکثر در ۵-۶ خط توضیح دهید.

_برای مثال:_

> A smart contract is just a computer program that runs on TON Blockchain, or more specifically on its [TVM](/v3/documentation/tvm/tvm-overview) (_TON Virtual Machine_). The contract is made of code (_compiled TVM instructions_) and data (_persistent state_) that are stored at some address on TON.

## پیش‌نیازها

عنوان پیش‌نیازها **باید** H2 باشد: `## پیش‌نیازها`

This section is for you to explain any prior knowledge needed or any existing tutorials that need to be completed first. Any tokens that are needed—mention them here.

_برای مثال:_

> In this tutorial, we're going to mint Jetton on testnet. Before we continue, make sure that your [testnet](/v3/documentation/smart-contracts/getting-started/testnet) wallet has sufficient balance.

## الزامات

عنوان الزامات **باید** H2 باشد: `## الزامات`

**اختیاری:** اگر آموزش شما دارای محتوای ویدیویی است، آن را در این بخش جاسازی کنید.

Any technology that needs to be installed **prior** to starting the tutorial and that the tutorial will not cover (`TON Wallet Extension`, `node`, etc.). Do not list packages that will be installed during the tutorial.

_برای مثال:_

- ما به افزونه TON Wallet در این آموزش نیاز داریم؛ آن را از [اینجا](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd) نصب کنید.
- مطمئن شوید NodeJS 12.0.1+ نصب شده است.

## بدنه آموزش

- لطفاً از "بدنه آموزش" برای عنوان استفاده نکنید، عنوانی که مرتبط با مطالب است انتخاب کنید.
  - اگر چیزی دیگری به ذهنتان نمی‌رسد، "شروع کار" قابل قبول است 😉
- هر محتوای متنی که لازم است برای راهنمایی خوانندگان در آموزش خود اضافه کنید، و قبل از ارسال آموزش، _**محتوای خود را برای املاء و دستور زبان بازبینی کنید**_.
  - [Grammarly](http://grammarly.com) یک برنامه رایگان خوب است که می‌تواند به شما در جلوگیری از اشتباهات گرامری کمک کند.

### نکات کلیدی

- از "بدنه آموزش" برای عنوان استفاده نکنید!

- **همه زیرعنوان‌ها را در H3 نگه دارید،** با H4 یا پایین‌تر نروید.
  - در سینتکس Markdown، برای عنوان‌های H2 از دو هشتگ استفاده می‌شود: ##
  - برای عنوان‌های H3 از سه هشتگ استفاده می‌شود: ###

- Add only necessary comments to code blocks. _**Do not**_ add # style comments to terminal input code blocks.

- همه بلوک‌های کد مرتبط را اضافه کنید:
  - ## Markdown syntax for code blocks consists of three backticks at the beginning and end of the code block.  Also, make sure that there is a newline before and after the backticks in all code blocks. _For example_:
    \`js  
    const testVariable = 'some string';  
    someFunctionCall();  
    \`

  - ALL code blocks _**must**_ have a syntax highlight type. Use \`\`\`text if you are not sure.

  - \\`\`\\`text باید برای خروجی ترمینال، دستورهای ترمینال و متن ساده استفاده شود.

  - \`javascript *یا* `js می‌تواند برای هر کد JavaScript استفاده شود.

  - \`typescript یا `ts می‌تواند برای هر کد TypeScript استفاده شود.

  - \\`\`\\`jsx برای کد ReactJS است.

  - \\`\`\\`cpp برای کد Func است.

  - از \\`\`\\`graphql هنگام برجسته‌سازی سینتکس GraphQL استفاده کنید.

  - Use \`json when highlighting valid JSON. (For invalid JSON examples use \`text instead.)

  - \\`\`\`bash should _only_ be used in code blocks where you need to have # style comments. This must be done carefully because in many situations the # character will render as a markdown heading. Typically, the Table of Contents will be affected if this occurs.

- از `متن پیش‌فرمت‌شده` برای تأکید استفاده نکنید؛ در عوض، فقط از متن‌های **بولد** یا _ایتالیک_ استفاده کنید.

- تصاویر یا بلوک‌های کد را اضافه کنید تا خروجی مورد انتظار ترمینال را منعکس کنند.

- Take an error-driven approach when writing your tutorial. Add common errors and troubleshooting steps. _For example:_

> **به دلیل خطا در اجرای دستور
> `node deploy:testnet` نمی‌توانید به Testnet متصل شوید.**
>
> بیایید نگاهی به برخی از علل شایع بیندازیم:

- Make sure you have enough funds in your generated testnet wallet in `.env`. If not, please add some testnet coins from the faucet giver.
- اگر همچنان با همان مشکل مواجه هستید، به توسعه‌دهندگان در [Dev Chat](https://t.me/TonDev_eng/) مراجعه کنید تا کمک بگیرید.

>

## نتیجه‌گیری

عنوان نتیجه‌گیری **باید** H2 باشد: `## نتیجه‌گیری`

This section should summarize what was learned in the tutorial, reinforce key points, and congratulate the learner on completing the tutorial. Use a maximum of 5–6 lines.
_For example_:

> We created a simple new FunC contract with counter functionality. We then built and deployed it on-chain, and finally interacted with it by calling a getter and sending a message.

لطفاً به خاطر داشته باشید که این کد برای محیط تولیدی طراحی نشده است؛ اگر بخواهید آن را در mainnet مستقر کنید، هنوز چندیدن نکته دیگر وجود دارد که باید در نظر بگیرید، مانند غیرفعال کردن روش انتقال اگر توکن در بازار لیست شد و غیره.

>

## همچنین ببینید

عنوان مراحل بعدی **باید** H2 باشد: `## همچنین ببینید`

Use this section to explain what can be done next after this tutorial to continue learning.
Feel free to add recommended projects and articles relating to this tutorial.
If you're working on any other advanced tutorials, you can briefly mention them here.
Typically, only related pages from docs.ton.org are placed here.

## درباره نویسنده _(اختیاری)_

عنوان درباره نویسنده **باید** H2 باشد: `## درباره نویسنده`

Keep it short. One or two lines at most. You can include a link to your GitHub profile + Telegram profile. Please refrain from adding your LinkedIn or Twitter here.

## مراجع _(اختیاری)_

عنوان مراجع **باید** H2 باشد: `## مراجع`

اگر در نگارش این آموزش از دیگر اسناد، مخازن GitHub یا آموزش‌های از پیش موجود کمکی دریافت کرده‌اید، این بخش _**باید**_ وجود داشته باشد.

در صورت امکان منابع را با افزودن نام و لینک به سند اعتبار دهید.

If it is not a digital document, include an ISBN or other form of reference. <Feedback />

