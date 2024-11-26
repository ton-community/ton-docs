# 工作原理

![工作原理](/img/localizationProgramGuideline/localization-program.png)

**TownSquare Labs 本地化系统**由几个关键部分组成。本章将概述该程序的运行方式，帮助您了解其工作原理以及如何有效地使用它。

在这个系统中，我们整合了多个应用程序，使其作为一个统一的整体无缝运行：

- **GitHub**：托管文档，同步上游版本库中的文档，并将翻译同步到特定分支。
- **Crowdin**：管理翻译流程，包括翻译、校对和设置语言首选项。
- **人工智能系统**：利用先进的人工智能协助翻译员，确保工作流程顺畅。
- **自定义词汇表**：为翻译员提供指导，同时确保人工智能根据项目上下文生成准确的译文。此外用户还可根据需要上传自己的词汇表。

:::info
本指南不会详细介绍整个流程，但会重点介绍使 TownSquare Labs 本地化系统独一无二的关键组成部分。您可以自行进一步了解该计划。
:::

## 通过GitHub实现文档和翻译同步

我们的版本库使用多个分支来管理文件和翻译。下面将详细解释每个特殊分支的目的和功能：

### 分支概览

- **`dev`**\
  `dev` 分支运行 GitHub Actions 来处理同步任务，你可以在 [**`.github/workflows`**](https://github.com/TownSquareXYZ/ton-docs/tree/dev/.github/workflows) 目录中找到工作流配置。

  - **`sync-fork.yml`**：此工作流程从上游版本库同步文档。每天 00:00 运行。
  - **`sync-translations.yml`**：此工作流程将更新的翻译同步到相应的语言分支，以便在相应的语言网站上进行预览。

- **`main`**\
  这个分支通过在 `dev` 分支上运行的 GitHub Actions 与上游仓库保持同步。它也用于更新我们的打算提交给原始仓库的某些代码。

- **`l10n_main`**\
  这个分支包括了来自 `main` 分支的所有更改和 Crowdin 的翻译，这个分支中的所有修改都会定期通过使用名为 `l10n_main_[some data]` 的新子分支提交到上游仓库。

- \*\*`l10n_feat` 或者 `l10n_feat_[特定函数]**  
  这个分支将包含与翻译系统相关的代码或文档的更改。 一旦所有内容完成后，此分支中的更改将合并为`l10_main\`。

- **`[lang]_preview`**\
  这些分支被指定用于特定语言的预览，例如 `ko_preview` 用于韩语`ja_preview` 用于日语。它们允许我们在不同语言中预览网站。

`dev`分支运行 GitHub Actions 来处理同步任务。你可以在 [**`.github/workflows`**](https://github.com/TownSquareXYZ/ton-docs/tree/dev/.github/workflows) 目录中找到工作流配置：

## 如何创建新的 Crowdin 项目

1. 登录您的 [**Crowdin 帐户**](https://accounts.crowdin.com/login)。

2. 点击菜单中的 `Create new project`。
   ![创建新项目](/img/localizationProgramGuideline/howItWorked/create-new-project.png)

3. 设置项目名称和目标语言。您可以稍后在设置中更改语言。
   ![创建项目设置](/img/localizationProgramGuideline/howItWorked/create-project-setting.png)

4. 转到刚刚创建的项目，选择`Integrations`，点击 `Add Integration` 按钮，搜索 `GitHub`，然后安装。
   ![install-github-integration](/img/localizationProgramGuideline/howItWorked/install-github-integration.png)

5. 在 Crowdin 上配置 GitHub 集成之前，请先指定要上传到 Crowdin 的文件，以免上传不必要的文件：

   1. 在**你的 GitHub 仓库**的根目录下创建一个**crowdin.yml**文件，输入以下基本配置：

   ```yml
   project_id: <Your project id>
   preserve_hierarchy: 1
   files:
     - source: <Path of your original files>
       translation: <Path of your translated files>
   ```

   2. 获取正确的配置值：
      - **project_id**：在您的 Crowdin 项目中，转到 `Tools` 选项卡，选择 API，并在其中找到**project_id**。
        ![select-api-tool](/img/localizationProgramGuideline/howItWorked/select-api-tool.png)
        ![projectId](/img/localizationProgramGuideline/howItWorked/projectId.png)
      - **preserve_hierarchy**：是否在 Crowdin 服务器上保持 GitHub 中的目录结构。
      - **source** and **translation**：指定要上传到 Crowdin 的源文件路径(source)和翻译文件(translation)的输出路径。

        请参阅[**我们的官方配置文件**](https://github.com/TownSquareXYZ/ton-docs/blob/localization/crowdin.yml)了解示例。\
        更多详情，请参阅[**Crowdin 配置文件**](https://developer.crowdin.com/configuration-file/)。

6. 配置 Crowdin 以连接到你的 GitHub 仓库：
   1. 单击 `Add Repository` 并选择 `Source and translation files mode`。
      ![选择集成模式](/img/localizationProgramGuideline/howItWorked/select-integration-mode.png)
   2. 连接 GitHub 账户并搜索要翻译的 repo。
      ![search-repo](/img/localizationProgramGuideline/howItWorked/search-repo.png)
   3. 选择左侧的分支，这将生成一个新的分支，Crowdin 将在该分支中发布翻译。
      ![设置分支](/img/localizationProgramGuideline/howItWorked/setting-branch.png)
   4. 选择将翻译更新到 GitHub 分支的频率。其他配置可保留默认设置，然后点击保存启用集成。
      ![频率-保存](/img/localizationProgramGuideline/howItWorked/frequency-save.png)

该分支通过在 `dev` 分支上运行的 GitHub Actions 与上游版本库保持同步。它还用于更新我们打算提交到原始版本库的某些代码。

7. 此外，你可以点击 "立即同步 "按钮，在需要时同步版本库和翻译。

## 术语表

### 4.`[lang]_localization`

这些分支指定用于特定语言的预览，如 "ko_localization "用于韩语，"ja_localization "用于日语。通过它们，我们可以预览不同语言的网站。

通过维护这些分支和使用 GitHub Actions，我们有效地管理了文档和翻译更新的同步，确保我们的多语言内容始终是最新的。

您可以查看我们的 [**ton-i18n-glossary**](https://github.com/TownSquareXYZ/ton-i18n-glossary) 作为参考。
![ton-i18n-glossary](/img/localizationProgramGuideline/howItWorked/ton-i18n-glossary.png)

### 如何为新语言设置词汇表？

详情请参考 [**GitHub 集成文档**](https://support.crowdin.com/github-integration/)。

在 DeepL 中，只需上传您的词汇表，它就会在人工智能翻译过程中自动使用。

我们创建了[**词汇表程序**](https://github.com/TownSquareXYZ/ton-i18n-glossary)，可自动上传更新内容。

在术语表中添加术语：

1. 如果词汇表中已有英文术语，请找到要翻译的语言的相应行和列，输入译文并上传。
2. 要上传新的词汇表，请克隆项目并运行：

   - `npm i`
   - `npm run generate --<glossary name you want>`

通过**术语表**，您可以在一个地方创建、存储和管理项目特定术语，确保术语翻译的正确性和一致性。

您可以查看我们的 [**ton-i18n-glossary**](https://github.com/TownSquareXYZ/ton-i18n-glossary) 作为参考。
![ton-i18n-glossary](/img/localizationProgramGuideline/howItWorked/ton-i18n-glossary.png)

## 如何为新语言设置词汇表？

大多数翻译平台都支持词汇表。在 Crowdin 中，设置词汇表后，每个术语都会在编辑器中显示为下划线词。将鼠标悬停在术语上，即可查看其翻译、语篇和定义（如果已在词汇表中提供）。
![github-glossary](/img/localizationProgramGuideline/howItWorked/github-glossary.png)
![crowdin-glossary](/img/localizationProgramGuideline/howItWorked/crowdin-glossary.png)

- **增强一致性**：人工智能翻译以最新信息为基础，提供最准确和最新的翻译。
- **速度与效率**：人工智能翻译瞬时完成，可实时处理大量内容。
- **强大的可扩展性**：人工智能系统会不断学习和改进，随着时间的推移提高翻译质量。借助所提供的词汇表，人工智能翻译可根据不同资源库的具体需求进行定制。

我们创建了[**词汇表程序**](https://github.com/TownSquareXYZ/ton-i18n-glossary)，可自动上传更新内容。

1. 在 Crowdin 菜单中选择 `Machine Translation` ，然后点击 DeepL 那一行上的`edit`。
   ![select-deepl](/img/localizationProgramGuideline/howItWorked/select-deepl.png)
2. 启用 DeepL 支持并输入 DeepL Translator API 密钥。
   > [如何获取 DeepL Translator API 密钥](https://www.deepl.com/pro-api?cta=header-pro-api)

![config-crowdin-deepl](/img/localizationProgramGuideline/howItWorked/config-crowdin-deepl.png)

3. 我们的 DeepL 设置使用定制的词汇表。有关上传词汇表的详细信息，请查阅 [**ton-i18n-glossary**](https://github.com/TownSquareXYZ/ton-i18n-glossary) 。

4. 在 repo 中，单击 Pre-translation（预翻译）并选择 via Machine Translation（通过机器翻译）。
   ![预翻译](/img/localizationProgramGuideline/howItWorked/pre-translation.png)

5. 选择 DeepL 作为翻译引擎，选择目标语言，并选择要翻译的文件。
   ![预翻译配置](/img/localizationProgramGuideline/howItWorked/pre-translate-config.png)

**只需几步我们便完成了所有操作**
