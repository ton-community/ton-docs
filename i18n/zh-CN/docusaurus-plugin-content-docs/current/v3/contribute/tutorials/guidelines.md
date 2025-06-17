import Feedback from '@site/src/components/Feedback';

# 教程样式指南

:::danger
This page is outdated and will be updated soon.
See the [How to contribute](/v3/contribute/).
:::

所以你决定为 TON 文档写一个教程？

We're excited to have you among our contributors! 我们很高兴你成为我们的贡献者之一！请仔细阅读以下指南，以确保您的教程遵循 TON 文档现有内容的样式和质量。

It is important that you take some time to become familiar with the tutorial structure and how headings should be used. 重要的是，您需要花些时间熟悉教程结构和如何使用标题。在提交自己的教程之前，请阅读我们的一些现有教程，并查看 [以前的拉取请求](https://github.com/ton-community/ton-docs/pulls?q=is%3Apr+is%3Aclosed)。

## 流程

:::info 重要
在你开始写作之前，_请阅读下面的指南_！它们将帮助你确保达到标准化和质量水平，这将使审查过程更加迅速。 They will help you ensure the level of standardization and quality that will make the review process much faster.
:::

另外，请参考我们提供的[**示例教程结构**](/contribute/tutorials/sample-tutorial)。

1. 首先，在 GitHub 上分叉然后克隆 [ton-docs](https://github.com/ton-community/ton-docs/) 的库，并在您的本地代码库中创建一个新分支。
2. 书写您的教程时，请牢记质量和可读性！可以查看现有教程以明确您的目标。 Have a look at the existing tutorials to see what you should aim for.
3. 当准备好提交审查时，[发起一个拉取请求](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)。我们将收到通知，并开始审查过程： We will be notified, and the review process will begin:
  1. **Please make every effort to submit only the final draft of your tutorial**. **请尽一切努力提交您的教程的最终稿**。一些打字错误和语法修正是可以接受的，但如果在我们能够发布教程之前需要进行重大更改，审查和要求您进行必要更改的过程将会花费更多时间。
4. 审查完您的提交后，并且您完成所有必要的更改后，我们将合并拉取请求并在 TON 文档上发布教程。此后不久，我们将与您联系安排付款！ We'll contact you shortly after this to arrange your payment!
5. 发布后，记得在社交媒体上**推广**您的教程！[文档维护者](/contribute/maintainers)可以帮助扩大这种推广，只要您与我们合作。 The [documentation maintainers](/v3/contribute/maintainers) can help to amplify this promotion as long as you cooperate with us.

总而言之，工作流程如下：

1. _**分叉并克隆**_ **`ton-docs`** 代码库
2. _**编写并润色**_ 您的教程
3. _**提交拉取请求**_ 进行审查
4. _**进行其他必要的更改**_
5. 教程 _**合并并发布**_
6. _**在社交媒体上推广您的教程**_！

## Context

在 "TON" 前加上 "THE" 的主要问题是，在开发 TON 文档和政策编辑期间，市场营销、供应商和开发人员等多个部门加入了讨论，以大写 "Blockchain"、"Ecosystem" 等词汇与 "TON" 结合使用，以创建一个单一系统、网络和品牌的强大形象。经过长时间的讨论，我们得出结论，为了推出强大的品牌形象，我们应该创建一个词汇和短语表，可以不使用 "THE" 并大写书写。如果可以大写，就不需要冠词。目前有两个这样的词组：TON Blockchain 和 TON Ecosystem。 After lengthy discussions, we concluded that for a strong brand image, we should create a glossary of words and phrases that can be written without "THE" and capitalized. If it can be capitalized, the article is unnecessary. Currently, there are two such word combinations: TON Blockchain and TON Ecosystem.

对于其他 TON 模块名称，如 TON Connect、TON SDK、TON Grants等，取决于上下文。我们应用大写规则，但对于冠词规则则较为灵活。如果组件名称单独存在，最好不用冠词。然而，如果它与普通名词结合，如 TON Connect protocol，则需要冠词，因为它指的是实体协议。 We apply the capitalization rule but are flexible with the article rule. If the component name stands alone, it is better without the article. However, if it is combined with a common noun, such as the TON Connect protocol, the article is needed because it refers to the entity protocol.

至于其他词组，如 "TON + 名词"（例如，"the TON world"、"the TON community" 等），我们不限制使用冠词，因为我们期望能看到这样的一个结合。

## 一般提示

- **Do not copy and paste pre-existing content**. Plagiarism is a serious issue and will not be tolerated. If the tutorial is inspired by some existing content, reference it and link to it. When linking to other tutorials/resources, use TON Docs resources if possible.
- **在 PR 中包含演示视频或视频内容**，方法是上传到 Google Drive。
- **必须清楚地解释如何从水龙头获得账户资金**，包括哪个账户能拿到资金，从哪里，以及为什么。不要假设学习者可以自行完成这项任务！ Do not assume learners can accomplish this task on their own!
- **显示示例输出**，以终端片段或屏幕截图的形式，以帮助学习者了解预期效果。记得要修剪长输出。 Trim long outputs.
- **Take an error-driven approach** where you bump into errors on purpose to teach learners how to debug them. For example, if you need to fund an account to be able to deploy a contract, first try and deploy without funding, observe the error that is returned, then fix the error (by funding the account) and try again.
- **添加潜在的错误和故障排除**。当然，教程不应列出所有可能的错误，但应努力捕捉重要的或最常见的错误。
- **使用 React 或 Vue** 进行客户端开发。
- **在提交 PR 之前，首先自行运行代码**，以避免其他明显的错误，并确保其按预期工作。
- **避免在教程之间包含对不同来源的外部/交叉链接**。如果您的教程较长，我们可以讨论如何将其变成更长的课程或路径。 If your tutorial is longer, we can discuss how to turn it into a longer course or Pathway.
- **Provide** **pictures or screenshots** to illustrate the complicated processes where needed.
- 将您的图片上传到 learn-tutorials 库的 `static` 目录——**不要** 使用外部网站的热链接，因为这可能导致图片损坏。
- **图片链接必须以 markdown 格式呈现**，您 **只能** 使用库中 `static` 目录的原始 GitHub URL：`![您图片的名称](https://raw.githubusercontent.com/ton-community/ton-docs/main/static/img/tutorials/<您图片的文件名>.png?raw=true)`
  - 记住在 URL 的末尾添加 `?raw=true`。

## 如何构建您的教程

:::info 示例教程结构
您可以随时查看[示例教程结构](/contribute/tutorials/sample-tutorial)进行了解。
:::

- The **Title** should be direct and clear, summarizing the tutorial's goal. Do not add the tutorial title as a heading inside the document; instead, use the markdown document filename.
  - _例如_：如果您的教程标题为"_Step by step guide for writing your first smart contract in FunC_"，文件名应为：\
    `step-by-step-guide-for-writing-your-first-smart-contract-in-func.md`
- 包含一个**简介**部分，用来解释_为什么_这个教程很重要，以及教程的背景是什么。不要假设这是显而易见的。 Don't assume that it is obvious.
- 包含一个**必要条件**部分，用来解释任何要求_预先掌握的知识_或需要首先完成的其他现有教程，其他所需的代币等。
- 包含一个**要求**部分，用来解释在开始教程之前必须安装的任何_技术程序_，以及教程不会涵盖的内容，如 TON 钱包扩展、Node.js 等。不要列出教程中将安装的包。 Do not list packages that will be installed during the tutorial.
- 使用**子标题**（H2: ##）来分构教程正文。使用子标题时要记住目录，并尽量保持重点。 Keep the Table of Contents in mind when using subheadings, and try to keep them on point.
  - 如果子标题下的内容很短（例如，只有一个段落和一个代码块），考虑使用加粗文本而不是子标题。
- 包含一个**结论**部分，总结所学内容，强化关键点，同时也为学习者完成教程表示祝贺。
- （_**可选**_）包含一个**接下来**部分，指向后续教程或其他资源（项目、文章等）。
- (_**Optional**_) Include an **About The** **Author** section at the end. Your bio should include a link to your GitHub profile (which will have your name, website, etc.) and a link to your Telegram profile (so that users can contact/tag you for help and questions).
- 如果您在编写此教程时参考了其他文档、GitHub 库或其他教程，**必须** 存在一个**参考资料**部分。可实现的话，就通过添加他们的名称和文档链接来致谢（如果不是数字文档，请包括 ISBN 或其他参考方式）。 Credit sources by adding their name and a link to the document when possible (if it is not a digital document, include an ISBN or other means of reference).

## 样式指南

- **写作措辞 -** 教程由社区贡献者为他们的同行撰写。
  - Given this, we recommend creating a tone of inclusion and interaction throughout the tutorial. 鉴于此，我们建议在整个教程中创造一种包容和互动的语调。使用“我们”、“我们的”这样的词语。
    - _例如_："我们已经成功部署了我们的合约。"
  - 提供直接指导时，可以自由使用“你”、“你的”等。
    - _例如_："_你的文件应该看起来像这样：_"

- **Use Markdown properly** throughout your tutorial. **在您的教程中正确使用 Markdown**。参考 [GitHub 的 markdown 指南](https://guides.github.com/features/mastering-markdown/) 以及 [示例教程结构](/contribute/tutorials/sample-tutorial)。

- **不要使用预格式化文本进行强调**，_例如_：
  - ❌ "TON 计数器 `智能合约` 名为 `counter.fc`" 是不正确的。
  - ✅ "TON 计数器 **智能合约** 名为 `counter.fc`" 是正确的。

- **不要在节标题中使用任何 markdown 格式**，_例如_：
  - ❌ # **简介** 是不正确的。
  - ✅ # 简介 是正确的。

- **解释你的代码！** 不要只让学习者盲目地复制和粘贴。
  - 函数名称、变量和常量 **必须** 在整个文档中保持一致。
  - 使用代码块开头的注释来显示代码所在的路径和文件名。_例如_： _For example_:

        ```jsx
        // test-application/src/filename.jsx
        
        import { useEffect, useState } from 'react';
        
        ...
        ```

- **选择合适的语言** 用于代码块语法高亮！
  - 所有代码块 _必须_ 有语法高亮。如果您不确定要应用哪种类型的语法高亮，请使用 **\`\`\\\`text**。 Use **\`\`\`text** if you are not sure what kind of syntax highlighting to apply.

- **不要将代码块语法用于预格式化文本**，_例如_：
  - ❌ \`filename.jsx\` 是不正确的。
  - ✅ \`filename.jsx\` 是正确的。

- **Your code blocks should be well commented**. Comments should be short (usually two or three lines at a time) and effective. **您的代码块应该有较好的注释**。注释应该简短（通常是两到三行）且有效。如果您需要更多空间来解释一段代码，请在代码块外进行。

- **记得在所有代码块前后留一个空行**。\
  _例如_：\
  _For example_:

```jsx
  
// test-application/src/filename.jsx  
  
import { useEffect, useState } from 'react';
  
```

- **使用 linter 和 prettifier** 在将代码粘贴到代码块之前。对于 JavaScript/React，我们推荐使用 `eslint`。对于代码格式化，请使用 `prettier`。 We recommend `eslint` for JavaScript/React. Use `prettier` for code formatting.
- **避免过度使用项目符号**、编号列表或复杂的文本格式。使用 **粗体** 或 _斜体_ 强调是允许的，但应保持最少。 The use of **bold** or _italic_ emphasis is allowed but should be kept to a minimum.

# **应用设置**

- Web3 项目通常会包含几个现有的代码库。编写教程时，请考虑到这一点。在可能的情况下，提供一个 GitHub 库作为学习者入门的起点。 Be sure to account for this when writing your tutorial. Where possible, provide a GitHub repository as a starting point to make it easier for learners to get started.
- 如果您_不_使用 GitHub 库来包含教程中使用的代码，请记得向读者解释如何创建文件夹以保持良好的代码组织。
  _例如_：`mkdir example && cd example`
  _For example_: `mkdir example && cd example`
- 如果使用 `npm init` 来初始化项目目录，请解释提示或使用 `-y` 标志。
- 如果使用 `npm install`，请采用 `-save` 标志。

<Feedback />

