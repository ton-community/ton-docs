import Feedback from '@site/src/components/Feedback';

# 如何参与贡献

This page explains how to participate in the localization program for TON documentation.

## Prerequisites

Localization contribution is open to everyone. Here are a few steps you need to take before you start contributing:

1. 登录或注册您的 [**Crowdin**](https://crowdin.com) 账户。
2. 选择您要贡献的语言。
3. 请熟悉[**如何使用 Crowdin**](/contribute/localization-program/how-to-contribute)指南和[**翻译风格指南**](/contribute/localization-program/translation-style-guide)，了解使用技巧和最佳实践。
4. 使用机器翻译辅助工作，但不要完全依赖机器翻译。
5. 所有翻译结果均可在校对一小时后在网站上预览。

:::info
Before you start contributing, **read the guidelines below** to ensure standardization and quality, making the review process much faster.
:::

## Side-by-Side Mode

All tasks are performed in **side-by-side** mode in the Crowdin Editor. To enable this, click a file you want to work on. At the top right of the page, click the **Editor view** button and select **side-by-side** mode for a clearer editor view.\
![side-by-side mode](/img/localizationProgramGuideline/side-by-side.png)

## 角色

以下是您在系统中可以担任的**角色**：

- **语言协调员(Language Coordinator)** - 管理指定语言的项目功能。
- **开发人员(Developer)** - 上传文件、编辑可翻译文本、连接集成和使用API。
- **校对员(Proofreader)** - 翻译和批准字符串。
- **翻译员(Translator)** - 翻译字符串并对他人添加的翻译进行投票。

我们的本地化项目托管在 [Crowdin](https://crowdin.com/project/ton-docs) 上。

### 语言协调员(Language Coordinator)

- **翻译和批准字符串**
- **预翻译项目内容**
- **管理项目成员和加入请求**
  ![manage-members](/img/localizationProgramGuideline/manage-members.png)
- **生成项目报告**
  ![generate-reports](/img/localizationProgramGuideline/generate-reports.png)
- **创建任务**
  ![create-tasks](/img/localizationProgramGuideline/create-tasks.png)

### 开发人员(Developer)

- **Update footer configuration for your language:**
  1. 请复制我们的 [**仓库**](https://github.com/TownSquareXYZ/ton-docs/tree/i18n_feat)
  2. 来到以下文件 [**`src/theme/Footer/config.ts`**](https://github.com/TownSquareXYZ/ton-docs/blob/main/src/theme/Footer/config.s).
  3. 将变量\*\*`FOOTER_COLUMN_LINKS_EN`\*\* 的值复制到\*\*`FOOTER_COLUMN_LINKS_[YOUR_LANG]`\*\*。
  4. 就如我们在 \*\*`FOTER_COLUMN_LINKS_CN`\*\*中对Mandarin 所做的那样，您也可以将 **`headerLangKey`** 和 **`langKey`** 的键值翻译成您的语言，
  5. 向\*\*`FOOTER_LINKS_TRANSLATIONS`\*\*添加一个新属性：
    - 将 **the key** 设置为您的 [**国际标准组的语言代码**](https://www.andiamo.co.uk/resources/iso-language-codes/) (注意使用**两个英语字母**, **小写**，eg：zh)。
    - **The value** 是您刚刚为您的语言创建的新变量。
  6. 您可以运行命令 **`yarn start:local [YOUR_IOS_LANG_CODE]`** 来预览您的语言的新页脚。\
    (例如\*\*`yarn start:local zh`\*\* 用于预览**汉语** 页脚)\
    (e.g., **`yarn start:local ru`** for a preview of the **Russian** footer)
  7. 如果一切看起来都没问题，请在 **`i18n_feat`** 分支上创建一个拉取请求。
- **上传文件**
- **编辑可翻译文本**
- **连接集成**（例如，添加 GitHub 集成）
  ![install-github-integration](/img/localizationProgramGuideline/howItWorked/install-github-integration.png)
- **使用 [Crowdin API](https://developer.crowdin.com/api/v2/)**

### Proofreader guidelines

As a **Proofreader**, you'll work on files with a **blue progress bar**.
![proofread step1](/img/localizationProgramGuideline/proofread-step1.png)
Click on a file to enter the editing interface.

#### Contribution flow

1. Make sure you're in [**side-by-side mode**](#side-by-side-mode). Filter by **Not Approved** translations to see strings needing proofreading.
  确保您处于 [**side-by-side 模式**](#side-by-side-mode)。启用**Not Approved**过滤，查看需要校对的字符串。
  ![校对过滤器](/img/localizationProgramGuideline/proofread-filter.png)

2. 请遵守这些规则：
  - 选择带有**蓝色立方体图标**的字符串。检查每个翻译： Check each translation:
    - 如果**正确**，请单击 ☑️ 按钮。
    - 如果**不正确**，请移至下一行。

![校对通过](/img/localizationProgramGuideline/proofread-approved.png)

:::info
You can also review approved lines:

1. 使用**Approved**过滤选项。

2. 如果已批准的翻译有问题，请单击 ☑️ 按钮将其还原为需要校对的状态。
  :::

3. To move to the following file, click the file name at the top, select the new file from the pop-up window, and continue proofreading.
  ![to next](/img/localizationProgramGuideline/redirect-to-next.png)

#### 预览你的成果

The preview website displays all approved content within one hour. 所有通过审核的内容都将在一小时内部署到预览网站上。请查看[**我们的仓库**](https://github.com/TownSquareXYZ/ton-docs/pulls)，查看最新 PR 中的**preview**链接。
![预览链接](/img/localizationProgramGuideline/preview-link.png)
![preview link](/img/localizationProgramGuideline/preview-link.png)

### 翻译员(Translator)

As a translator, you aim to ensure that translations are faithful and expressive, keeping them as close to the original meaning and as understandable as possible. Your mission is to make the blue progress bar reach 100%.

#### Translation flow

请按照以下步骤成功完成翻译过程：

1. 选择尚未达到 100% 翻译的文件。
  ![翻译选择](/img/localizationProgramGuideline/translator-select.png)
  ![translator select](/img/localizationProgramGuideline/translator-select.png)

2. Ensure you're in [**side-by-side mode**](#side-by-side-mode). Filter by **Untranslated** strings.
  确保您处于 [**side-by-side 模式**](#side-by-side-mode)。通过**Untranslated**字符串进行过滤。
  ![翻译过滤器](/img/localizationProgramGuideline/translator-filter.png)

3. 您的工作区有四个部分：
  - **左上：** 根据源字符串输入您的翻译。
  - **左下：** 预览翻译文件。保持原始格式。 Maintain the original format.
  - **右下：** Crowdin 建议的翻译。点击使用，但请核实准确性，尤其是链接。 Click to use, but verify for accuracy, especially with links.

4. 点击顶部的**Save**按钮保存翻译。
  ![translator save](/img/localizationProgramGuideline/translator-save.png)
  ![translator save](/img/localizationProgramGuideline/translator-save.png)

5. To move to the next file, click the file name at the top and select the new file from the pop-up window.
  要移动到下一个文件，请单击顶部的文件名，然后从弹出窗口中选择新文件。
  ![转到下一个](/img/localizationProgramGuideline/redirect-to-next.png)

## 如何添加对新语言的支持

If you are a community manager, follow these steps:

1. 在 [TownSquareXYZ/ton-docs](https://github.com/TownSquareXYZ/ton-docs) 上添加一个名为 `[lang]_localization`（例如，韩语为 `ko_localization`）的新分支。
2. **请联系此仓库的 Vercel 所有者**，将新语言添加到菜单中。
3. Create a PR request to the dev branch. **Do not merge to dev**; this is for preview purposes only.

完成这些步骤后，您就可以在 PR 请求中看到语言的预览。
![ko preview](/img/localizationProgramGuideline/ko_preview.png)
![ko preview](/img/localizationProgramGuideline/ko_preview.png)

当您的语言准备好在 TON 文档中展示时，请创建一个issue，我们会将您的语言设置到生产环境中。

<Feedback />

