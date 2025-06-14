import Feedback from '@site/src/components/Feedback';

# TONでスマートコントラクトをコンパイルしてビルドする

スマートコントラクトを構築するためのライブラリとリポジトリのリストは次のとおりです。

**TLDR:**

- ほとんどの場合、ブループリントSDKを使用するのに十分です。
- 低レベルのアプローチが必要な場合は、ton-コンパイラまたは func-js を使用できます。

## Blueprint

### 概要

スマートコントラクトの書き込み、テスト、デプロイ用のTONブロックチェーンの開発環境。詳細は[Blueprint git repository](https://github.com/ton-community/blueprint)をご覧ください。 Read more in [Blueprint git repository](https://github.com/ton-community/blueprint).

### インストール

ターミナルで以下を実行して、新しいプロジェクトを作成し、画面上の指示に従ってください:

```bash
npm create ton@latest
```

&nbsp;

### 特徴

- スマートコントラクトの構築、テスト、展開のための合理化されたワークフロー
- お気に入りのウォレットを使用してmainnet/testnetへのデッドシンプルなデプロイ（例：Tonkeeper）
- インプロセス実行中の分離されたブロックチェーンで複数のスマートコントラクトを高速にテストする

### Tech stack

1. FunC を https://github.com/ton-community/func-js でコンパイルする (CLIなし)
2. https://github.com/ton-community/sandbox によるスマートコントラクトのテスト
3. [TON Connect 2](https://github.com/ton-connect), [Tonhub wallet](https://tonhub.com/) または `ton://` deeplinkでスマートコントラクトをデプロイします

### 要件

- [Node.js](https://nodejs.org) with a recent version like v18, verify version with `node -v`
- format@@0(https://marketplace.visualstudio.com/) のような TypeScript と FunC のサポートがあります [Visual Studio Code](https://code.visualstudio.com/) と [FunC プラグイン](https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode)

### 使い方は？

- [ブループリントのデモを含むDoraHacksプレゼンテーションを見る](https://www.youtube.com/watch?v=5ROXVM-Fojo).
- [ブループリントレポ](https://github.com/ton-community/blueprint#create-a-new-project) で詳細な説明を読んでください。

## ton-compiler

### 概要

TON スマートコントラクト用のパッケージ化された FunC コンパイラ:

- GitHub: [ton-community/ton-compiler](https://github.com/ton-community/ton-compiler)
- NPM: [ton-compiler](https://www.npmjs.com/package/ton-compiler)

### インストール

```bash npm2yarn
npm install ton-compiler
```

### 特徴

- 複数のFunCコンパイラバージョン
- TON をインストールしてコンパイルする必要はありません
- プログラムインターフェイスとCLI
- ユニットテストで使用する準備ができました

### 使い方

このパッケージは `ton-compiler` バイナリをプロジェクトに追加します。

FunC compilation is a multi-stage process. FunCコンパイルは多段プロセスであり、1つはFuncをFiftコードにコンパイルしてからバイナリ表現にコンパイルされます。 Fiftコンパイラは既にAsm.fifバンドルされています。 Fift compiler already has Asm.fif bundled.

FunC stdlibはバンドルされていますが、実行時に無効にすることができます。

#### コンソールの使用

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

#### プログラムによる使用

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

## func-js

### 概要

_クロスプラットフォーム_ bindings for TON FunC compiler.

ton-compiler よりも低いレベルなので、ton-compiler が動作しない場合にのみ使用します。

- GitHub: [ton-community/func-js](https://github.com/ton-community/func-js)
- NPM: [@ton-community/func-js](https://www.npmjs.com/package/@ton-community/func-js)

### インストール

```bash npm2yarn
npm install @ton-community/func-js
```

### 特徴

- FunCバイナリをダウンロードする必要はありません
- Node.js と **WEB** の両方で動作します (WASM のサポートが必要です)
- コードセルでBOCに直接コンパイルします
- 組立機はデバッグ目的で返却されます
- ファイルシステムに依存しません

### 使い方

内部的に、このパッケージはFunCコンパイラとFiftインタプリタの両方をWASMにコンパイルされたシングルリブに組み合わせて使用します。

簡単なスキーマ:

```bash
(your code) -> WASM(FunC -> Fift -> BOC)
```

内部libのソースは [here](https://github.com/ton-blockchain/ton/tree/testnet/crypto/funcfiftlib)で見つけることができます。

### 使用例

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

プロジェクトで使用されているすべての FunC ソースファイルの内容は `sources` に渡されることに注意してください。

- エントリ ポイント
- stdlib.fc (もしそれを使うなら)
- エントリポイントに含まれるすべてのファイル

### TON コミュニティによって検証されました

- [ton-community/ton-compiler](https://github.com/ton-community/ton-compiler) — TONスマートコントラクトのためのすぐ使えるFuncCコンパイラ
- [ton-community/func-js](https://github.com/ton-community/func-js) — TON FunC コンパイラのためのクロスプラットフォームバインディング

### サードパーティの貢献者

- [grozzzny/ton-compiler-groz](https://github.com/grozzzny/ton-compiler-groz) — TON FunC スマートコントラクトコンパイラ。
- [Termina1/tonc](https://github.com/Termina1/tonc) — TONC (TON Compiler) WASMを使用します。 Uses WASM, so perfect for Linux.

## その他

- [disintar/toncli](https://github.com/disintar/toncli) — 最も人気のあるアプローチの1つです。Dockerでも使用できます。 You even can use it with Docker.
- [tonthemoon/ton](https://github.com/tonthemoon/ton) — _(closed beta)_ ワンライン TON バイナリインストーラー。
- [delab-team/tlbcrc](https://github.com/delab-team/tlbcrc) -- TL-B スキームによるオペコードを生成する Package & CLI

<Feedback />

