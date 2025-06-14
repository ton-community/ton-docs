import Feedback from '@site/src/components/Feedback';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Button from '@site/src/components/button'

# プリコンパイルされたバイナリ

:::caution 重要
ブループリントSDKを使用してバイナリを手動でインストールする必要がなくなりました。
:::

開発およびテスト用のバイナリはすべてブループリントSDKで提供されています。

<Button href="/v3/documentation/smart-contracts/getting-started/javascript"
colorType="primary" sizeType={'sm'}>

ブループリントSDKに移行

</Button>

## プリコンパイルされたバイナリ

スマートコントラクト開発にBlueprint SDKを使用しない場合は、コンパイル済みのバイナリをオペレーティングシステムや選択ツールに使用できます。

### 前提条件

TONスマートコントラクト_without Javascript_のローカル開発では、お使いのデバイス上で`func`、`fift`、`liteクライアント`のバイナリを準備する必要があります。

以下でダウンロードして設定するか、TON Societyからこの記事を読むことができます:

- format@@0(https://blog.ton.org/setting-up-a-ton-development-environment)

### 1. ダウンロード

Download the binaries from the table below.  Make sure to select the correct version for your operating system and to install any additional dependencies:

| OS                                 | TON バイナリ                                                                                        | fift                                                                                         | func                                                                                         | lite-client                                                                                         | 追加の依存関係                                                                                                   |
| ---------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| MacOS x86-64                       | [download](https://github.com/ton-blockchain/ton/releases/latest/download/ton-mac-x86-64.zip)   | [download](https://github.com/ton-blockchain/ton/releases/latest/download/fift-mac-x86-64)   | [download](https://github.com/ton-blockchain/ton/releases/latest/download/func-mac-x86-64)   | [download](https://github.com/ton-blockchain/ton/releases/latest/download/lite-client-mac-x86-64)   |                                                                                                           |
| MacOS arm64                        | [download](https://github.com/ton-blockchain/ton/releases/latest/download/ton-mac-arm64.zip)    |                                                                                              |                                                                                              |                                                                                                     | `brew install openssl ninja libmicrohttpd pkg-config`                                                     |
| Windows x86-64                     | [download](https://github.com/ton-blockchain/ton/releases/latest/download/ton-win-x86-64.zip)   | [download](https://github.com/ton-blockchain/ton/releases/latest/download/fift.exe)          | [download](https://github.com/ton-blockchain/ton/releases/latest/download/func.exe)          | [download](https://github.com/ton-blockchain/ton/releases/latest/download/lite-client.exe)          | インストール [OpenSSL 1.1.1](/ton-binaries/windows/Win64OpenSSL_Light-1_1q.msi) |
| Linux  x86_64 | [download](https://github.com/ton-blockchain/ton/releases/latest/download/ton-linux-x86_64.zip) | [download](https://github.com/ton-blockchain/ton/releases/latest/download/fift-linux-x86_64) | [download](https://github.com/ton-blockchain/ton/releases/latest/download/func-linux-x86_64) | [download](https://github.com/ton-blockchain/ton/releases/latest/download/lite-client-linux-x86_64) |                                                                                                           |
| Linux arm64                        | [download](https://github.com/ton-blockchain/ton/releases/latest/download/ton-linux-arm64.zip)  |                                                                                              |                                                                                              |                                                                                                     | `sudo apt install libatomic1 libssl-dev`                                                                  |

### 2. バイナリをセットアップ

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

1. ダウンロード後、新しいフォルダを作成する必要があります。例: **`C:/Users/%USERNAME%/ton/bin`** インストールされたファイルを移動します。 For example: **`C:/Users/%USERNAME%/ton/bin`** and move the installed files there.

2. Windows 環境変数を開くには、キーボードの <Highlight color="#1877F2">Win + R</Highlight> ボタンを押して、`sysdm.cpl` と入力して Enter キーを押します。

3. "_Advanced_"タブで、 <Highlight color="#1877F2">"環境変数..."</Highlight> ボタンをクリックします。

4. _"User variables"_ section, select the "_Path_" variable and click <Highlight color="#1877F2">"Edit"</Highlight> (これは通常必要です).

5. 次のウィンドウでシステム変数に新しい値`(path)`を追加するには、<Highlight color="#1877F2">「New」</Highlight>ボタンをクリックします。
  新しいフィールドには、以前にインストールしたファイルが保存されているフォルダへのパスを指定する必要があります：
  In the new field, you need to specify the path to the folder where the previously installed files are stored:

  ```
  C:\Users\%USERNAME%\ton\bin\
  ```

6. すべてが正しくインストールされているかどうかを確認するには、ターミナルで実行してください (_cmd.exe_):

  ```bash
  fift -V -and func -V -and lite-client -V
  ```

7. fiftを使用する場合は、必要なインポートを含む環境変数`FIFTPATH`が必要です。

  1. ダウンロード [fiftlib.zip](/ton-binaries/windows/fiftlib.zip)
  2. zipをあなたのマシンのディレクトリで開きます（\*\*`C:/Users/%USERNAME%/ton/lib/fiftlib`\*\*のように）
  3. 新しい環境変数 `FIFTPATH` を "_User variables_" セクションに作成します (ボタン <Highlight color="#1877F2">"新規"</Highlight>)。
  4. "_Variable value_"フィールドで、ファイルへのパスを指定します: **`/%USERNAME%/ton/lib/fiftlib`** そして、 <Highlight color="#1877F2">OK</Highlight>をクリックします。 完了しました。 Done.

:::caution 重要
Instead of the `%USERNAME%` keyword, you must insert your own `username`.\
:::</TabItem> <TabItem value="mac" label="Linux / MacOS">1.\
:::</TabItem>
<TabItem value="mac" label="Linux / MacOS">1. After downloading, make sure the downloaded binaries are executable by changing their permissions.```bash
chmod +x func
chmod +x fift
chmod +x lite-client
```2. It's also useful to add these binaries to your path (or copy them to `/usr/local/bin`) so you can access them from anywhere.
  It's also useful to add these binaries to your path (or copy them to `/usr/local/bin`) so you can access them from anywhere.`bash
  cp ./func /usr/local/bin/func
  cp ./fift /usr/local/bin/fift
  cp ./lite-client /usr/local/bin/lite-client
  `3. To check that everything was installed correctly, run in terminal.\`\`\`bash
  fift -V && func -V && lite-client -V````4.
   ```bash
   fift -V && func -V && lite-client -V
````4. If you plan to `use fift`, also download [fiftlib.zip](/ton-binaries/windows/fiftlib.zip), open the zip in some directory on your device (like `/usr/local/lib/fiftlib`), and set the environment variable `FIFTPATH` to point to this directory.\`\`\`
  unzip fiftlib.zip
  mkdir -p /usr/local/lib/fiftlib
  cp fiftlib/\* /usr/local/lib/fiftlib```
unzip fiftlib.zip
mkdir -p /usr/local/lib/fiftlib
cp fiftlib/* /usr/local/lib/fiftlib
```:::info Hey, you're almost finished :)
Remember to set the [environment variable](https://stackoverflow.com/questions/14637979/how-to-permanently-set-path-on-linux-unix) `FIFTPATH` to point to this directory.
:::

</TabItem>
<TabItem value="mac" label="Linux / MacOS">

1. After downloading, make sure the downloaded binaries are executable by changing their permissions.\`\`\`bash
  chmod +x func
  chmod +x fift
  chmod +x lite-client```2.
  ```

   ```bash
   chmod +x func
   chmod +x fift
   chmod +x lite-client
   ```

2. これらのバイナリをパスに追加する(または `/usr/local/bin`にコピーする)ことで、どこからでもアクセスできるようにすることもできます。

   ```bash
   cp ./func /usr/local/bin/func
   cp ./fift /usr/local/bin/fift
   cp ./lite-client /usr/local/bin/lite-client
   ```

3. すべてが正しくインストールされていることを確認するには、ターミナルで実行してください。

   ```bash
   fift -V && func -V && lite-client -V
   ```

4. `use fift` を使用する予定の場合は、 [fiftlib.zip](/ton-binaries/windows/fiftlib) もダウンロードしてください。 (ip) zipをデバイス上のいくつかのディレクトリ(例えば、`/usr/local/lib/fiftlib`)で開き、環境変数`FIFTPATH`をこのディレクトリを指すように設定します。

   ```
   unzip fiftlib.zip
   mkdir -p /usr/local/lib/fiftlib
   cp fiftlib/* /usr/local/lib/fiftlib
   ```

Remember to set the [environment variable](https://stackoverflow.com/questions/14637979/how-to-permanently-set-path-on-linux-unix) `FIFTPATH` to point to this directory.
:::

  </TabItem>
</Tabs>

## ソースからビルド

コンパイル済みのバイナリに依存したくない場合は、[公式手順](/v3/guidelines/smart-contrits/howto/compile/compile-instructions) に従ってください。

The ready-to-use gist instructions are provided below:

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install git make cmake g++ libssl-dev zlib1g-dev wget
cd ~ && git clone https://github.com/ton-blockchain/ton.git
cd ~/ton && git submodule update --init
mkdir ~/ton/build && cd ~/ton/build && cmake .. -DCMAKE_BUILD_TYPE=Release && make -j 4
```

## バイナリの他のソース

コアチームは、[GitHub Actions](https://github.com/ton-blockchain/ton/releases/latest)として、いくつかのオペレーティングシステム用の自動ビルドを提供します。

上記のリンクをクリックし、お使いのオペレーティングシステムに関連する左側のワークフローを選択します 最近の緑色のパスビルドをクリックし、"Artifacts"の下にある`ton-binaries`をダウンロードします。

<Feedback />

