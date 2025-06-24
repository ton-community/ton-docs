import Feedback from '@site/src/components/Feedback';

# 示例教程结构

:::danger
This page is outdated and will be updated soon.
See the [How to contribute](/v3/contribute/).
:::

## 简介

简介的标题 **必须** 为 H2: `## 简介`

这一部分是用来解释这个教程的背景和重要性，我们将在本教程中构建和学习什么。

- 像你对五岁小孩解释一样来阐述这一部分 (**[ELI5](https://www.dictionary.com/e/slang/eli5/)**)
- Explain everything in 5–6 lines maximum.

_例如:_

> 智能合约只是一个在TON区块链上运行的计算机程序，或者更具体地说，在其[TVM](/learn/tvm-instructions/tvm-overview)（_TON虚拟机_）上运行。合约由代码（_编译的TVM指令_）和数据（_持久状态_）组成，这些都存储在TON上的某个地址。 The contract is made of code (_compiled TVM instructions_) and data (_persistent state_) that are stored at some address on TON.

## 必要条件

必要条件标题 **必须** 为 H2: `## 必要条件`

这一部分是用来解释开始本教程前任何需要预先掌握的知识或需要先完成的教程。如果需要任何的代币—要在这里提及。 Any tokens that are needed—mention them here.

_例如:_

> 在这个教程中，我们将在测试网上铸造Jetton。在我们继续之前，请确保你的[测试网](/develop/smart-contracts/environment/testnet)钱包有足够的余额。 Before we continue, make sure that your [testnet](/v3/documentation/smart-contracts/getting-started/testnet) wallet has sufficient balance.

## 要求

要求标题 **必须** 为 H2: `## 要求`

**可选 :** 如果你的教程有任何视频内容，请在这一部分嵌入。

在开始教程之前需要安装的任何技术程序，以及本教程不会涉及的内容（`TON钱包扩展`、`node`等）。请不要将要安装的程序包在教程中列出。 Do not list packages that will be installed during the tutorial.

_例如:_

- 我们需要在本教程中使用TON钱包扩展；可以从[这里](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd)安装。
- 确保已安装NodeJS 12.0.1+。

## 教程正文

- 不要使用“教程正文”作为标题！
  - 如果你想不出别的，使用“开始”也是可以接受的😉
- 添加文本内容来引导读者通过你的教程，并_**记得在提交教程之前校对内容**_，以避免拼写和语法错误。
  - [Grammarly](http://grammarly.com)是一个可以帮助你避免语法错误的免费程序。

### 关键点

- 请不要使用“教程正文”作为标题，请使用与材料相关的自己的标题。

- \*\*保持所有子标题在H3，\*\*不要使用H4或更低。
  - 在Markdown语法中，两个井号用于H2标题: ##
  - 三个井号用于H3标题: ###

- Add only necessary comments to code blocks. 只在代码块中添加必要的注释。_**不要**_在终端输入代码块中添加#样式的注释。

- 添加所有相关的代码块：
  - ## Markdown语法的代码块由代码块开始和结束时的三个反引号组成。同时，请确保在所有代码块的反引号前后都有一个新行。_例如_：  Also, make sure that there is a newline before and after the backticks in all code blocks. _For example_:
    \`js  
    const testVariable = 'some string';  
    someFunctionCall();  
    \`

  - 所有代码块_**必须**_有语法高亮类型。如果不确定，使用\\`\`\\\`text。 Use \`\`\`text if you are not sure.

  - \\`\`\\\`text用于终端输出、终端命令和纯文本。

  - \`javascript *或* `js可用于任何JavaScript代码。

  - \`typescript或`ts可用于任何TypeScript代码。

  - \\`\`\\\`jsx用于ReactJS代码。

  - \\`\`\\\`cpp用于Func代码。

  - 使用\\`\`\\\`graphql突出显示GraphQL语法。

  - Use \\`\`\`json when highlighting valid JSON. 使用\`json突出显示有效的JSON。（对于无效的JSON示例，请使用\`text。）

  - \\`\`\\\`bash应_仅_用于需要#样式注释的代码块。这必须小心进行，因为在许多情况下，#字符将呈现为markdown标题。如果发生这种情况，通常目录会受到影响。 This must be done carefully because in many situations the # character will render as a markdown heading. Typically, the Table of Contents will be affected if this occurs.

- 不要使用`预格式化文本`来强调；而是只使用**粗体**或_斜体_文本。

- 添加图片或代码块以反映预期的终端输出。

- Take an error-driven approach when writing your tutorial. Add common errors and troubleshooting steps. _For example:_

> **由于执行`node deploy:testnet`命令时出错，无法连接到Testnet。**
>
> 让我们看看一些常见原因：

- 确保你在`.env`中生成的测试网钱包有足够的资金。如果没有，请从水龙头赠送处添加一些测试网代币。 If not, please add some testnet coins from the faucet giver.
- 如果你仍然遇到同样的问题，请向[Dev Chat](https://t.me/TonDev_eng/)中的开发者求助。

>

## 结论

结论标题 **必须** 为 H2: `## 结论`

这一部分应总结在教程中学到的内容，强调关键点，并祝贺学习者完成教程。使用最多5-6行。
_例如_: Use a maximum of 5–6 lines.
_For example_:

> We created a simple new FunC contract with counter functionality. We then built and deployed it on-chain, and finally interacted with it by calling a getter and sending a message.

请记住，这段代码不适用于生产；如果你想将其部署到主网，还有一些其他事项需要考虑，例如，如果代币在市场上挂牌，就禁用转移的方法等等。

>

## 参阅

下一步标题 **必须** 为 H2: `## 参阅`

使用这一部分来解释完成本教程后接下来可以做什么以继续学习。可以添加与本教程相关的推荐项目和文章。如果你正在进行任何其他高级教程，可以在这里简要提及。通常，只有来自docs.ton.org的相关页面会放在这里。
Feel free to add recommended projects and articles relating to this tutorial.
If you're working on any other advanced tutorials, you can briefly mention them here.
Typically, only related pages from docs.ton.org are placed here.

## 关于作者 _(可选)_

关于作者标题 **必须** 是 H2: `## 关于作者`

Keep it short. One or two lines at most. You can include a link to your GitHub profile + Telegram profile. Please refrain from adding your LinkedIn or Twitter here.

## 参考资料 _(可选)_

参考资料标题 **必须** 是 H2: `## 参考资料`

如果你在编写本教程时从其他文档、GitHub库或现有教程中获得了任何帮助，则_**必须**_ 有这一部分。

通过添加它们的名称和文档链接来致敬来源。

如果不是数字文档，请添加ISBN或其他形式的参考。 <Feedback />

