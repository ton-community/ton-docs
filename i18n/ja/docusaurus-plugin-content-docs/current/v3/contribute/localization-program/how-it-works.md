import Feedback from '@site/src/components/Feedback';

# How it works

![仕組み](/img/localizationProgramGuideline/localization-program.png)

The TownSquare Labs Localization Program comprises several key components. This chapter provides an overview of localization, helping you understand how it works and how to use it effectively.

このシステムでは、統合されたプログラムとしてシームレスに機能するために、複数のアプリケーションを統合します。

- **GitHub**：ドキュメントをホストし、上流のリポジトリからドキュメントを同期し、特定のブランチに翻訳を同期します。
- **Crowdin**: 翻訳、校正、言語設定などの翻訳プロセスを管理します。
- **AI Systems**: 高度な AI を活用して翻訳者を支援し、スムーズなワークフローを確保します。
- **Customized Glossary**: This glossary guides translators and ensures AI generates accurate translations based on the project’s context. Users can also upload their glossaries as needed.

:::info
This guide won't cover the entire process but will highlight the key components that make the TownSquare Labs Localization Program unique. You can explore the program further on your own.
:::

## GitHub synchronization for documentation and translations

Our repository utilizes several branches to manage documentation and translations. Below is a detailed explanation of the purpose and function of each special branch:

### Branches overview

- **`dev`**\
  The `dev` branch runs GitHub Actions to handle synchronization tasks. **`dev`**\
  `dev` ブランチは、GitHub Actionsを実行して同期タスクを処理します。ワークフローの設定は [**`.github/workflows`**](https://github.com/TownSquareXYZ/ton-docs/tree/dev/.github/workflows)ディレクトリにあります：

  - **`sync-fork.yml`**: このワークフローは上流リポジトリからのドキュメントを同期します。毎日00:00に実行されます。 It runs daily at 00:00.
  - **`sync-translations.yml`**: This workflow synchronizes updated translations to the respective language branches for preview purposes on the corresponding websites.

- **`main`**\
  This branch stays in sync with the upstream repository through GitHub Actions, which runs on the `dev` branch. It also updates specific codes we intend to propose to the original repository.

- **`l10n_main`**\
  This branch includes all changes from the `main` branch and translations from Crowdin. All modifications in this branch are periodically committed to the upstream repository using a new sub-branch named `l10n_main_[some data]`.

- **`l10n_feat` or `l10n_feat_[specific functions]`**\
  This branch will include changes to code or documentation related to the translation system. Once you finalize all content, the changes in this branch will be merged into `l10_main`.

- **`[lang]_preview`**\
  これらのブランチは、韓国語用の `ko_localization` や日本語用の `ja_localization` など、特定言語のプレビュー用に指定されています。これらのブランチを使うことで、ウェブサイトをさまざまな言語でプレビューすることができます。 They allow us to preview the website in different languages.

これらのブランチを管理し、GitHub Actionsを使用することで、ドキュメントと翻訳の更新の同期を効率的に管理し、多言語コンテンツを常に最新の状態に保つことができます。

## How to set up a new crowdin project

1. あなたの[**Crowdinアカウント**](https://accounts.crowdin.com/login)にログインしてください。

2. Click `Create new project` in the menu.
  メニューの`Create new project`をクリックする。
  ![新規プロジェクトの作成](/img/localizationProgramGuideline/howItWorked/create-new-project.png)

3. プロジェクト名とターゲット言語を設定します。言語設定は後で変更できます。
  ![プロジェクト設定の作成](/img/localizationProgramGuideline/howItWorked/create-project-setting.png) You can change the languages in the settings later.
  ![Create project setting](/img/localizationProgramGuideline/howItWorked/create-project-setting.png)

4. Go to the project you just created, select the Integrations tab, click the `Add Integration` button, search for `GitHub`, and install it.
  作成したプロジェクトに移動し、`Integrations`タブを選択し、`Add Integration`ボタンをクリックし、`GitHub`を検索し、インストールします。
  ![github Integrationsをインストール](/img/localizationProgramGuideline/howItWorked/install-github-integration.png)

5. CrowdinにGitHubインテグレーションを設定する前に、不要なファイルのアップロードを避けるために、Crowdinにアップロードするファイルを指定します：

  1. **GitHubリポジトリ**のルートに**crowdin.yml**ファイルを作成し、基本的な設定を行います：

      ```yml
      project_id: <Your project id>
      preserve_hierarchy: 1
      files:
        - source: <Path of your original files>
          translation: <Path of your translated files>
      ```

  2. Get the correct configuration values:
    - **project_id**: In your Crowdin project, go to the Tools tab, select API, and find the **project_id** there.
      正しい設定値を取得する：
      \- **project_id**：Crowdin プロジェクトで、ツールタブで API を選択し、**project_id** を見つけます。
      ![select-api-tool](/img/localizationProgramGuideline/howItWorked/select-api-tool.png)
      ![projectId](/img/localizationProgramGuideline/howItWorked/projectId.png)
      \- **preserve_hierarchy**：Crowdin サーバー上の GitHub ディレクトリ構造を維持します。
      \- **source** と **translation**：Crowdin にアップロードするファイルのパスと翻訳ファイルの出力先を指定します。
    - **preserve_hierarchy**: Maintains the GitHub directory structure on the Crowdin server.
    - **source** and **translation**: Specify the paths for the files to upload to Crowdin and where the translated files should be output.

      For an example, refer to the [**config file**](https://github.com/TownSquareXYZ/ton-docs/blob/localization/crowdin.yml).\
      Find more in the [**Crowdin configuration documentation**](https://developer.crowdin.com/configuration-file/).\
      Find more in the [**Crowdin configuration documentation**](https://developer.crowdin.com/configuration-file/).

6. GitHub リポジトリに接続するために Crowdin を設定:
  1. Click `Add Repository` and select `Source and translation files mode`.
    `Add Repository`をクリックし、`Source and translation files mode`を選択します。
    ![select-integration-mode](/img/localizationProgramGuideline/howItWorked/select-integration-mode.png)
  2. Choose the frequency for updating translations to your GitHub branch, then click save to enable the integration.
    ![frequency-save](/img/localizationProgramGuideline/howItWorked/frequency-save.png)
  3. Select the branch on the left to generate a new branch where Crowdin will post the translations.
    ![setting-branch](/img/localizationProgramGuideline/howItWorked/setting-branch.png)
  4. Choose the frequency for updating translations to your GitHub branch, then click save to enable the integration.
    ![frequency-save](/img/localizationProgramGuideline/howItWorked/frequency-save.png)

Find more details in the [**GitHub integration documentation**](https://support.crowdin.com/github-integration/).

7. 最後に、`Sync Now` ボタンをクリックすると、必要なときにいつでもレポと翻訳を同期することができます。

## 用語解説（Glossary）

### What is a glossary?

Sometimes, AI translators can't recognize untranslatable and specific terms. For instance, we don't want "Rust" translated when referring to the programming language. To prevent such mistakes, we use a glossary to guide translations.

A **glossary** allows you to create, store, and manage project-specific terminology in one place, ensuring that terms are translated correctly and consistently.

You can reference our [**ton-i18n-glossary**](https://github.com/TownSquareXYZ/ton-i18n-glossary).
![ton-i18n-glossary](/img/localizationProgramGuideline/howItWorked/ton-i18n-glossary.png)

### How to set up a glossary for a new language?

Most translation platforms support glossaries. In Crowdin, after setting up a glossary, each term appears as an underlined word in the Editor. Hover over the term to see its translation, part of speech, and definition (if provided).
![github-glossary](/img/localizationProgramGuideline/howItWorked/github-glossary.png)
![crowdin-glossary](/img/localizationProgramGuideline/howItWorked/crowdin-glossary.png)

In DeepL, upload your glossary, which will be used automatically during AI translation.

私たちは[**用語集用プログラム**](https://github.com/TownSquareXYZ/ton-i18n-glossary)を作成し、更新を自動アップロードしています。

用語集に用語を追加するには:

1. 用語集にすでに英語の用語がある場合は、翻訳したい言語の該当する行と列を探し、翻訳を入力してアップロードします。
2. 新しい用語集をアップロードするには、プロジェクトをクローンして実行します：

```bash
npm i
```

```bash
npm run generate -- <glossary name you want>
```

ステップ1を繰り返し、新しい用語を追加します。

## How to take advantage of AI translation copilot?

AI翻訳コパイロットは、いくつかの利点で言語の障壁を打破するのに役立ちます：

- **強化された一貫性**：AI 翻訳は最新の情報に基づいており、最新の翻訳を提供します。
- **スピードと効率**：AI翻訳は瞬時に、大量のコンテンツをリアルタイムで処理します。
- **Robust Scalability**: AI systems continuously learn and improve, enhancing translation quality over time.

We use DeepL for AI translation in our Crowdin project:

1. Choose DeepL as the Translation Engine, select the target languages, and select the translated files.
  ![pre-translate-config](/img/localizationProgramGuideline/howItWorked/pre-translate-config.png)
2. DeepL サポートを有効にし、DeepL Translator API キーを入力します。
  > [DeepL Translator APIキーの取得方法](https://www.deepl.com/pro-api?cta=header-pro-api)

![config-crowdin-deepl](/img/localizationProgramGuideline/howItWorked/config-crowdin-deepl.png)

3. Our DeepL setup uses a customized glossary. DeepL セットアップでは、カスタマイズされた用語集を使用しています。用語集のアップロードの詳細は、[**ton-i18n-glossary**](https://github.com/TownSquareXYZ/ton-i18n-glossary) を参照してください。

4. レポで、[翻訳前]をクリックし、機械翻訳経由を選択します。
  ![事前翻訳](/img/localizationProgramGuideline/howItWorked/pre-translation.png)
  ![pre-translation](/img/localizationProgramGuideline/howItWorked/pre-translation.png)

5. Choose DeepL as the Translation Engine, select the target languages, and select the translated files.
  ![pre-translate-config](/img/localizationProgramGuideline/howItWorked/pre-translate-config.png)

That's it! Now, you can take a break and wait for the pre-translation to complete.

<Feedback />

