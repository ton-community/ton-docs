import Feedback from '@site/src/components/Feedback';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Button from '@site/src/components/button'

# باینری‌های از پیش کامپایل شده

:::caution مهم
دیگر نیازی به نصب دستی باینری‌ها با Blueprint SDK ندارید.
:::

همه باینری‌های لازم برای توسعه و تست همراه با SDK Blueprint ارائه می‌شوند.

<Button href="/v3/documentation/smart-contracts/getting-started/javascript"
colorType="primary" sizeType={'sm'}>

به Blueprint SDK مهاجرت کنید

</Button>

## باینری‌های از پیش کامپایل شده

اگر از Blueprint SDK برای توسعه قراردادهای هوشمند استفاده نمی‌کنید، می‌توانید از باینری‌های از پیش کامپایل شده برای سیستم‌عامل و ابزار انتخابی خود استفاده کنید.

### پیش‌نیازها

برای توسعه محلی قراردادهای هوشمند TON _بدون جاوااسکریپت_، باید باینری‌های `func`, `fift`, و `lite client` را روی دستگاه خود آماده کنید.

می‌توانید آنها را از زیر دانلود و راه‌اندازی کنید یا این مقاله از جامعه TON را بخوانید:

- [راه‌اندازی محیط توسعه TON](https://blog.ton.org/setting-up-a-ton-development-environment)

### 1. Download

Download the binaries from the table below.  Make sure to select the correct version for your operating system and to install any additional dependencies:

| سیستم‌عامل                        | باینری‌های TON                                                                                | fift                                                                                       | func                                                                                       | lite-client                                                                                       | وابستگی‌های اضافی                                                                                        |
| --------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| MacOS x86-64                      | [دانلود](https://github.com/ton-blockchain/ton/releases/latest/download/ton-mac-x86-64.zip)   | [دانلود](https://github.com/ton-blockchain/ton/releases/latest/download/fift-mac-x86-64)   | [دانلود](https://github.com/ton-blockchain/ton/releases/latest/download/func-mac-x86-64)   | [دانلود](https://github.com/ton-blockchain/ton/releases/latest/download/lite-client-mac-x86-64)   |                                                                                                          |
| MacOS arm64                       | [دانلود](https://github.com/ton-blockchain/ton/releases/latest/download/ton-mac-arm64.zip)    |                                                                                            |                                                                                            |                                                                                                   | `brew install openssl ninja libmicrohttpd pkg-config`                                                    |
| Windows x86-64                    | [دانلود](https://github.com/ton-blockchain/ton/releases/latest/download/ton-win-x86-64.zip)   | [دانلود](https://github.com/ton-blockchain/ton/releases/latest/download/fift.exe)          | [دانلود](https://github.com/ton-blockchain/ton/releases/latest/download/func.exe)          | [دانلود](https://github.com/ton-blockchain/ton/releases/latest/download/lite-client.exe)          | نصب [OpenSSL 1.1.1](/ton-binaries/windows/Win64OpenSSL_Light-1_1_1q.msi) |
| Linux x86_64 | [دانلود](https://github.com/ton-blockchain/ton/releases/latest/download/ton-linux-x86_64.zip) | [دانلود](https://github.com/ton-blockchain/ton/releases/latest/download/fift-linux-x86_64) | [دانلود](https://github.com/ton-blockchain/ton/releases/latest/download/func-linux-x86_64) | [دانلود](https://github.com/ton-blockchain/ton/releases/latest/download/lite-client-linux-x86_64) |                                                                                                          |
| Linux arm64                       | [دانلود](https://github.com/ton-blockchain/ton/releases/latest/download/ton-linux-arm64.zip)  |                                                                                            |                                                                                            |                                                                                                   | `sudo apt install libatomic1 libssl-dev`                                                                 |

### 2. Setup your binaries

export const Highlight = ({children, color}) => (
<span
style={{
backgroundColor: color,
borderRadius: '2px',
color: '#fff',
padding: '0.2rem',
}}>
{children} </span>
);

<Tabs groupId="operating-systems">
  <TabItem value="win" label="Windows">

1. After downloading, you need to `create` a new folder. For example: **`C:/Users/%USERNAME%/ton/bin`** and move the installed files there.

2. برای باز کردن متغیرهای محیطی Windows، دکمه‌های <Highlight color="#1877F2">Win + R</Highlight> روی صفحه کلید را فشار دهید، `sysdm.cpl` را تایپ کنید و Enter را بزنید.

3. در زبانه "_پیشرفته_"، دکمه <Highlight color="#1877F2">"متغیرهای محیطی..."</Highlight> را کلیک کنید.

4. در بخش _"متغیرهای کاربر"_، متغیر "_Path_" را انتخاب کرده و <Highlight color="#1877F2">"ویرایش"</Highlight> را کلیک کنید (این معمولاً لازم است).

5. To add a new value `(path)` to the system variable in the next window, click the  button <Highlight color="#1877F2">"New"</Highlight>.
  In the new field, you need to specify the path to the folder where the previously installed files are stored:

  ```
  C:\Users\%USERNAME%\ton\bin\
  ```

6. برای بررسی این که آیا همه چیز به درستی نصب شده است، در ترمینال (_cmd.exe_) اجرا کنید:

  ```bash
  fift -V -and func -V -and lite-client -V
  ```

7. اگر قصد دارید از fift استفاده کنید، به متغیر محیطی `FIFTPATH` با واردات لازم نیاز دارید:

  1. Download [fiftlib.zip](/ton-binaries/windows/fiftlib.zip)
  2. Open the zip in some directory on your machine (like **`C:/Users/%USERNAME%/ton/lib/fiftlib`**)
  3. Create a new (click button <Highlight color="#1877F2">"New"</Highlight>) environment variable `FIFTPATH` in "_User variables_" section.
  4. In the "_Variable value_" field, specify the path to the files: **`/%USERNAME%/ton/lib/fiftlib`** and click <Highlight color="#1877F2">OK</Highlight>. Done.

:::caution مهم
Instead of the `%USERNAME%` keyword, you must insert your own `username`.\
:::</TabItem>
<TabItem value="mac" label="Linux / MacOS">1. After downloading, make sure the downloaded binaries are executable by changing their permissions.```bash
chmod +x func
chmod +x fift
chmod +x lite-client
```2. It's also useful to add these binaries to your path (or copy them to `/usr/local/bin`) so you can access them from anywhere.```bash
cp ./func /usr/local/bin/func
cp ./fift /usr/local/bin/fift
cp ./lite-client /usr/local/bin/lite-client
```3. To check that everything was installed correctly, run in terminal.```bash
fift -V && func -V && lite-client -V
```4. If you plan to `use fift`, also download [fiftlib.zip](/ton-binaries/windows/fiftlib.zip), open the zip in some directory on your device (like `/usr/local/lib/fiftlib`), and set the environment variable `FIFTPATH` to point to this directory.```
unzip fiftlib.zip
mkdir -p /usr/local/lib/fiftlib
cp fiftlib/* /usr/local/lib/fiftlib
```:::info Hey, you're almost finished :)
Remember to set the [environment variable](https://stackoverflow.com/questions/14637979/how-to-permanently-set-path-on-linux-unix) `FIFTPATH` to point to this directory.
:::

</TabItem>
<TabItem value="mac" label="Linux / MacOS">

1. همچنین مفید است که این فایل‌های دودویی را به مسیر خود اضافه کنید (یا آنها را به `/usr/local/bin` کپی کنید) تا از هر جایی به آنها دسترسی داشته باشید.

   ```bash
   chmod +x func
   chmod +x fift
   chmod +x lite-client
   ```

2. برای بررسی اینکه همه چیز به درستی نصب شده است، در ترمینال اجرا کنید.

   ```bash
   cp ./func /usr/local/bin/func
   cp ./fift /usr/local/bin/fift
   cp ./lite-client /usr/local/bin/lite-client
   ```

3. اگر قصد `استفاده از fift` دارید، همچنین [fiftlib.zip](/ton-binaries/windows/fiftlib.zip) را دانلود کنید، در یک دایرکتوری روی دستگاه خود باز کنید (مانند `/usr/local/lib/fiftlib`)، و متغیر محیطی `FIFTPATH` را تنظیم کنید تا به این دایرکتوری اشاره کند.

   ```bash
   fift -V && func -V && lite-client -V
   ```

4. If you plan to `use fift`, also download [fiftlib.zip](/ton-binaries/windows/fiftlib.zip), open the zip in some directory on your device (like `/usr/local/lib/fiftlib`), and set the environment variable `FIFTPATH` to point to this directory.

   ```
   unzip fiftlib.zip
   mkdir -p /usr/local/lib/fiftlib
   cp fiftlib/* /usr/local/lib/fiftlib
   ```

:::info Hey, you're almost finished :)
Remember to set the [environment variable](https://stackoverflow.com/questions/14637979/how-to-permanently-set-path-on-linux-unix) `FIFTPATH` to point to this directory.
:::

  </TabItem>
</Tabs>

## Build from source

If you don't want to rely on pre-compiled binaries and prefer to compile the binaries yourself, you can follow the [official instructions](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions).

The ready-to-use gist instructions are provided below:

### سایر منابع برای باینری‌ها

```bash
sudo apt update
sudo apt install git make cmake g++ libssl-dev zlib1g-dev wget
cd ~ && git clone https://github.com/ton-blockchain/ton.git
cd ~/ton && git submodule update --init
mkdir ~/ton/build && cd ~/ton/build && cmake .. -DCMAKE_BUILD_TYPE=Release && make -j 4
```

## Other sources for binaries

The core team provides automatic builds for several operating systems as [GitHub Actions](https://github.com/ton-blockchain/ton/releases/latest).

Click on the link above, choose the workflow on the left relevant to your operating system, click on a recent green passing build, and download `ton-binaries` under "Artifacts".

<Feedback />

