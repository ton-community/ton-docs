import Feedback from '@site/src/components/Feedback';

# کامپایل و ساخت قراردادهای هوشمند بر روی TON

در اینجا لیستی از کتابخانه‌ها و مخازن برای ساخت قرارداد هوشمند شما آورده شده است.

**خلاصه:**

- در بیشتر موارد، استفاده از Blueprint SDK کافی است.
- اگر به رویکردی در سطح پایین‌تر نیاز دارید، می‌توانید از ton-compiler یا func-js استفاده کنید.

## "طرح"

### مرور کلی

A development environment for TON blockchain for writing, testing, and deploying smart contracts. Read more in [Blueprint git repository](https://github.com/ton-community/blueprint).

### نصب

برای ایجاد یک پروژه جدید، دستور زیر را در ترمینال اجرا کرده و دستورالعمل‌های روی صفحه را دنبال کنید:

```bash
npm create ton@latest
```

&nbsp;

### ویژگی‌ها

- روال کاری ساده برای ساخت، آزمایش و استقرار قراردادهای هوشمند
- استقرار بسیار ساده در mainnet/testnet با استفاده از کیف پول محبوب شما (مانند Tonkeeper)
- آزمایش بسیار سریع چندین قرارداد هوشمند در یک بلاکچین مجزا که به صورت درون فرآیندی اجرا می‌شود

### پشته فناوری

1. کامپایل FunC با استفاده از https://github.com/ton-community/func-js (بدون CLI)
2. آزمایش قراردادهای هوشمند با استفاده از https://github.com/ton-community/sandbox
3. استقرار قراردادهای هوشمند با استفاده از [TON Connect 2](https://github.com/ton-connect)، [کیف پول Tonhub](https://tonhub.com/) یا لینک عمیق `ton://`

### نیازمندی‌ها

- [Node.js](https://nodejs.org) با نسخه‌ای جدید مثل v18، نسخه را با دستور `node -v` بررسی کنید
- IDE با پشتیبانی از TypeScript و FunC مانند [Visual Studio Code](https://code.visualstudio.com/) با [افزونه FunC](https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode)

### چگونه استفاده کنیم?

- [پیشنهاد DoraHacks با نمایشی از کار با blueprint را مشاهده کنید](https://www.youtube.com/watch?v=5ROXVM-Fojo).
- توضیحات مفصل را در [مخزن Blueprint](https://github.com/ton-community/blueprint#create-a-new-project) بخوانید.

## "ton-compiler"

### مرور کلی

کامپایلر FunC بسته‌بندی شده برای قراردادهای هوشمند TON:

- GitHub: [ton-community/ton-compiler](https://github.com/ton-community/ton-compiler)
- NPM: [ton-compiler](https://www.npmjs.com/package/ton-compiler)

### نصب

```bash npm2yarn
npm install ton-compiler
```

### ویژگی‌ها

- نسخه‌های متعدد از کامپایلر FunC
- نیازی به نصب و کامپایل TON ندارد
- رابط‌های برنامه‌نویسی و CLI
- آماده برای استفاده در تست‌های واحد

### چگونه استفاده کنیم

این بسته `ton-compiler` دودویی را به یک پروژه اضافه می‌کند.

FunC compilation is a multi-stage process. One is compiling Func to Fift code that is then compiled to a binary representation. Fift compiler already has Asm.fif bundled.

کتابخانه استاندارد FunC بسته‌بندی شده است اما می‌تواند در زمان اجرا غیرفعال شود.

#### استفاده در کنسول

```bash
# Compile to binary form (for contract creation)
ton-compiler --input ./wallet.fc --output ./wallet.cell

# Compile to fift (useful for debugging)
ton-compiler --input ./wallet.fc --output-fift ./wallet.fif

# Compile to binary form and fift
ton-compiler --input ./wallet.fc --output ./wallet.cell --output-fift ./wallet.fif

# Disable stdlib
ton-compiler --no-stdlib --input ./wallet.fc --output ./wallet.cell --output-fift ./wallet.fif

# Pick version
ton-compiler --version "legacy" --input ./wallet.fc --output ./wallet.cell --output-fift ./wallet.fif
```

#### استفاده برنامه‌نویسی

```javascript
import { compileContract } from "ton-compiler";
let result = await compileContract({ code: 'source code', stdlib: true, version: 'latest' });
if (result.ok) {
  console.log(result.fift); // Compiled Fift assembler
  console.log(result.cell); // Compiled cell Buffer
} else {
  console.warn(result.logs); // Output logs
}
```

## "func-js"

### مرور کلی

اتصال‌های _پلتفرم‌متقابل_ برای کامپایلر TON FunC.

این از ton-compiler پایین‌تر است، بنابراین فقط در صورتی استفاده کنید که ton-compiler برای شما کار نکند.

- GitHub: [ton-community/func-js](https://github.com/ton-community/func-js)
- NPM: [@ton-community/func-js](https://www.npmjs.com/package/@ton-community/func-js)

### نصب

```bash npm2yarn
npm install @ton-community/func-js
```

### ویژگی‌ها

- نیازی به کامپایل یا دانلود باینری‌های FunC نیست
- هم در Node.js و هم در **وب** کار می‌کند (پشتیبانی از WASM الزامی است)
- مستقیم به BOC با Cell کد کامپایل می‌شود
- اسمبلی برای اهداف دیباگینگ بازگردانده می‌شود
- به سیستم فایل وابسته نیست

### چگونه استفاده کنیم

درونی، این بسته از هر دو کامپایلر FunC و مفسر Fift که به صورت یک کتابخانه به WASM کامپایل شده‌اند، استفاده می‌کند.

طرح ساده:

```bash
(your code) -> WASM(FunC -> Fift -> BOC)
```

کدهای منبع برای کتابخانه داخلی را می‌توانید [اینجا](https://github.com/ton-blockchain/ton/tree/testnet/crypto/funcfiftlib) بیابید.

### مثال استفاده

```javascript
import {compileFunc, compilerVersion} from '@ton-community/func-js';
import {Cell} from 'ton';

async function main() {
    // You can get compiler version 
    let version = await compilerVersion();
    
    let result = await compileFunc({
        // Entry points of your project
        entryPoints: ['main.fc'],
        // Sources
        sources: {
            "stdlib.fc": "<stdlibCode>",
            "main.fc": "<contractCode>",
            // Rest of the files which are included in main.fc if some
        }
    });

    if (result.status === 'error') {
        console.error(result.message)
        return;
    }

    // result.codeBoc contains base64 encoded BOC with code cell 
    let codeCell = Cell.fromBoc(Buffer.from(result.codeBoc, "base64"))[0];
    
    // result.fiftCode contains assembly version of your code (for debug purposes)
    console.log(result.fiftCode)
}
```

توجه داشته باشید که همه محتوای فایل‌های منبع FunC که در پروژه شما استفاده می‌شوند باید به `resources` منتقل شوند، از جمله:

- نقاط ورودی
- stdlib.fc (اگر از آن استفاده می‌کنید)
- همه فایل‌های شامل شده در نقاط ورودی

### تایید شده توسط جامعه TON

- [ton-community/ton-compiler](https://github.com/ton-community/ton-compiler) — کامپایلر FunC آماده به کار برای قراردادهای هوشمند TON.
- [ton-community/func-js](https://github.com/ton-community/func-js) — متاکی‌های کراس‌پلتفورم برای کامپایلر FunC در TON.

### مشارکت‌کنندگان شخص ثالث

- [grozzzny/ton-compiler-groz](https://github.com/grozzzny/ton-compiler-groz) — کامپایلر قرارداد هوشمند FunC برای TON.
- [Termina1/tonc](https://github.com/Termina1/tonc) — TONC (TON Compiler). Uses WASM, so perfect for Linux.

## دیگر

- [disintar/toncli](https://github.com/disintar/toncli) — one of the most popular approaches. You even can use it with Docker.
- [tonthemoon/ton](https://github.com/tonthemoon/ton) — _(نسخه بتای بسته)_ نصب‌کننده یک‌خطی باینری TON.
- [delab-team/tlbcrc](https://github.com/delab-team/tlbcrc) — بسته و CLI برای تولید کدهای عملیات به کمک Scheme TL-B

<Feedback />

