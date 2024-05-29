# 在 TON 上编译和构建智能合约

以下是构建智能合约的库和库列表。

**简而言之:**

- 在大多数情况下，使用Blueprint SDK就足够了。
- 如果您需要更低级别的方法，可以使用ton-compiler或func-js。

## Blueprint

### 概览

TON区块链的开发环境，用于编写、测试和部署智能合约。在[Blueprint git库](https://github.com/ton-community/blueprint)中了解更多信息。

### 安装

在终端运行以下命令以创建一个新项目，并按照屏幕上的指示操作：

```bash
npm create ton@latest
```

&nbsp;

### 特点

- 构建、测试和部署智能合约的简化工作流程
- 使用您最喜欢的钱包（例如Tonkeeper）轻松部署到主网/测试网
- 在一个独立的区块链中快速测试多个智能合约，该区块链在进程中运行

### 技术栈

1. 使用https://github.com/ton-community/func-js编译FunC（无CLI）
2. 使用https://github.com/ton-community/sandbox测试智能合约
3. 使用[TON Connect 2](https://github.com/ton-connect)、[Tonhub wallet](https://tonhub.com/)或`ton://`深链接部署智能合约

### 要求

- [Node.js](https://nodejs.org)的最新版本，如v18，使用`node -v`验证版本
- 支持TypeScript和FunC的IDE，如[Visual Studio Code](https://code.visualstudio.com/)，配备[FunC插件](https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode)

### 如何使用？

- [观看DoraHacks演示，了解使用blueprint的演示](https://www.youtube.com/watch?v=5ROXVM-Fojo)。
- 在[Blueprint库](https://github.com/ton-community/blueprint#create-a-new-project)中阅读详细的说明。

## ton-compiler

### 概览

打包的FunC编译器，用于TON智能合约：

- GitHub：[ton-community/ton-compiler](https://github.com/ton-community/ton-compiler)
- NPM：[ton-compiler](https://www.npmjs.com/package/ton-compiler)

### 安装

```bash npm2yarn
npm install ton-compiler
```

### 特点

- 多个FunC编译器版本
- 无需安装和编译TON
- 程序化和CLI接口
- 适用于cell测试

### 如何使用

这个包在项目中添加了`ton-compiler`二进制文件。

FunC编译是一个多阶段过程。其中之一是将Func编译为Fift代码，然后将其编译为二进制表示。Fift编译器已经内置了Asm.fif。

FunC标准库已被捆绑，但可以在运行时禁用。

#### 控制台使用

```bash
# Compile to binary form (for contract creation)
ton-compiler --input ./wallet.fc --output ./wallet.cell

# Compile to fift (useful for debuging)
ton-compiler --input ./wallet.fc --output-fift ./wallet.fif

# Compile to binary form and fift
ton-compiler --input ./wallet.fc --output ./wallet.cell --output-fift ./wallet.fif

# Disable stdlib
ton-compiler --no-stdlib --input ./wallet.fc --output ./wallet.cell --output-fift ./wallet.fif

# Pick version
ton-compiler --version "legacy" --input ./wallet.fc --output ./wallet.cell --output-fift ./wallet.fif
```

#### 程序化使用

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

### 概览

_Cross-platform_绑定TON FunC编译器。

它比ton-compiler更低级，所以只有在ton-compiler不适用时才使用它。

- GitHub：[ton-community/func-js](https://github.com/ton-community/func-js)
- NPM：[@ton-community/func-js](https://www.npmjs.com/package/@ton-community/func-js)

### 安装

```bash npm2yarn
npm install @ton-community/func-js
```

### 特点

- 无需编译或下载FunC二进制文件
- 在Node.js和**WEB**中都可工作（需要WASM支持）
- 直接编译为带有代码cell的BOC
- 返回汇编版本用于调试目的
- 不依赖文件系统

### 如何使用

在内部，这个包使用了FunC编译器和Fift解释器组合成单个编译为WASM的库。

简单架构：

```bash
(your code) -> WASM(FunC -> Fift -> BOC)
```

内部库的源代码可以在[这里](https://github.com/ton-blockchain/ton/tree/testnet/crypto/funcfiftlib)找到。

### 使用示例

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

请注意，项目中使用的所有FunC源文件内容都应传递给`sources`，包括：

- 入口点
- stdlib.fc（如果您使用它）
- 所有包含在入口点中的文件

### 经TON社区验证

- [ton-community/ton-compiler](/develop/smart-contracts/sdk/javascript#ton-compiler) — 用于TON智能合约的现成FunC编译器。
- [ton-community/func-js](/develop/smart-contracts/sdk/javascript#func-js) — TON FunC编译器的跨平台绑定。

### 第三方贡献者

- [grozzzny/ton-compiler-groz](https://github.com/grozzzny/ton-compiler-groz) — TON FunC智能合约编译器。
- [Termina1/tonc](https://github.com/Termina1/tonc) — TONC（TON编译器）。使用WASM，非常适合Linux。

## 其他

- [disintar/toncli](https://github.com/disintar/toncli) — 最受欢迎的方法之一。您甚至可以在Docker中使用它。
- [tonthemoon/ton](https://github.com/tonthemoon/ton) — _(封闭测试)_一行TON二进制安装程序。
- [delab-team/tlbcrc](https://github.com/delab-team/tlbcrc) — 包和CLI，根据TL-B方案生成操作码。
