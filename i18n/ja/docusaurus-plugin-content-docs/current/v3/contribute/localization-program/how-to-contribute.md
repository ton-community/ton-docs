import Feedback from '@site/src/components/Feedback';

# How to contribute

This page explains how to participate in the localization program for TON documentation.

## 必要条件

Localization contribution is open to everyone. Here are a few steps you need to take before you start contributing:

1. Log in to your [Crowdin](https://crowdin.com) account or sign up.
2. 投稿したい言語を選択してください。
3. Familiarize yourself with the [How to use crowdin](/v3/contribute/localization-program/how-to-contribute/) guide and the [Translation style guide](/v3/contribute/localization-program/translation-style-guide/) for tips and best practices.
4. Use machine translations to aid your work, but do not rely solely on them.
5. Preview all translation results on the website after proofreading.

:::info
Before contributing, read the guidelines below to ensure standardization and quality, speeding up the review process.
:::

## Side-by-side mode

All tasks are performed in **side-by-side** mode in the Crowdin Editor. To enable this, click a file you want to work on. At the top right of the page, click the **Editor view** button and select **side-by-side** mode for a clearer editor view.\
![side-by-side mode](/img/localizationProgramGuideline/side-by-side.png)\
![side-by-side mode](/img/localizationProgramGuideline/side-by-side.png)

## 役割

システムで想定できる**役割**は次のとおりです：

- **言語コーディネーター** - 指定された言語内のプロジェクト機能を管理する。
- **Developer** – Uploads files, edits translatable text, connects integrations and uses the API.
- **校正者** – 文字列を翻訳して承認します。
- **翻訳者** (社内またはコミュニティ) - 文字列を翻訳し、他の人が追加した翻訳に投票します。

The localization project is hosted on [Crowdin](https://crowdin.com/project/ton-docs).

### Language coordinator guidelines

- Translate and approve strings
- Pre-translate project content
- Manage project members and join requests
  ![manage-members](/img/localizationProgramGuideline/manage-members.png)
- Generate project reports
  ![generate-reports](/img/localizationProgramGuideline/generate-reports.png)
- Create tasks
  ![create-tasks](/img/localizationProgramGuideline/create-tasks.png)

### Developer guidelines

- **Update footer configuration for your language:**
  1. Fork our [repository](https://github.com/TownSquareXYZ/ton-docs/tree/i18n_feat).
  2. ファイル[**`src/theme/Footer/config.ts`​**](https://github.com/TownSquareXYZ/ton-docs/blob/main/src/theme/Footer/config.ts)を見つけてください。
  3. 変数 **`​FOOTER_COLUMN_LINKS_EN`** の値を **`FOOTER_COLUMN_LINKS_[あなたの言語]`** にコピーします。
  4. **`headerLangKey`** と **`langKey`** の値をあなたの言語に翻訳してください。北京語の場合、 **`FOOTER_COLUMN_LINKS_CN`** となります。
  5. **`FOOTER_LINKS_TRANSLATIONS`** に新しいプロパティを追加する：
    - **キー** をあなたの[**ISO言語コード**](https://www.andiamo.co.uk/resources/iso-language-codes/)(**2文字**、**小文字**)に設定してください。
    - **The value** should be the new variable you created for your language.
  6. **`yarn start:local [あなたのISO言語コード]`** コマンドを実行し、新しいフッターをあなたの言語でプレビューしてください。\
    (例：**`yarn start:local ru`** を実行すると、フッターが**ロシア語**でプレビューされます)\
    (e.g., **`yarn start:local ru`** for a preview of the **Russian** footer)
  7. 問題がなければ、**`i18n_feat`** ブランチにプルリクエストを作成します。
- **ファイルをアップロード**
- **翻訳可能なテキストを編集**
- **連携** (例: GitHub インテグレーションを追加)
  ![install-github-integration](/img/localizationProgramGuideline/howItWorked/install-github-integration.png)
- **[Crowdin API](https://developer.crowdin.com/api/v2/)を使用**

### Proofreader guidelines

As a **Proofreader**, you'll work on files with a **blue progress bar**.
![proofread step1](/img/localizationProgramGuideline/proofread-step1.png)
Click on a file to enter the editing interface.

#### Contribution flow

1. Make sure you're in [**side-by-side mode**](#side-by-side-mode). Filter by **Not Approved** translations to see strings needing proofreading.
  [**サイド-バイ-サイド・モード**](#side-by-side-mode) にいることを確認してください。**未承認** の翻訳でフィルターすると、校正が必要な文字列が表示されます。
  ![proofread filter](/img/localizationProgramGuideline/proofread-filter.png)

2. 以下のルールに従ってください：
  - **青色の立方体**の文字列を選択してください。各翻訳を確認してください： Check each translation:
    - **正しい** 場合は、☑️ ボタンをクリックします。
    - **間違っている**場合は、次の行に移動してください。

![校正済み](/img/localizationProgramGuideline/proofread-approved.png)

:::info
You can also review the approved lines:

1. **承認済み**で絞り込みます。

2. 承認された行に問題がある場合は、☑️ボタンをクリックすると校正が必要になります。
  :::

3. To move to the following file, click the file name at the top, select the new file from the pop-up window, and continue proofreading.
  ![to next](/img/localizationProgramGuideline/redirect-to-next.png)

#### Previewing your work

The preview website displays all approved content within one hour. Check [**our repo**](https://github.com/TownSquareXYZ/ton-docs/pulls) for the **preview** link in the newest PR.
![preview link](/img/localizationProgramGuideline/preview-link.png)

### Translator guidelines

As a translator, you aim to ensure that translations are faithful and expressive, keeping them as close to the original meaning and as understandable as possible. Your mission is to make the blue progress bar reach 100%.

#### Translation flow

翻訳を成功させるために、以下の手順に従ってください：

1. 翻訳が100%に達していないファイルを選択します。
  ![翻訳者セレクト](/img/localizationProgramGuideline/translator-select.png)
  ![translator select](/img/localizationProgramGuideline/translator-select.png)

2. Ensure you're in [**side-by-side mode**](#side-by-side-mode). Filter by **Untranslated** strings.
  [**サイド-バイ-サイド・モード**](#side-by-side-mode) であることを確認してください。**未承認** の翻訳でフィルターすると、校正が必要な文字列が表示されます。
  ![校正フィルター](/img/localizationProgramGuideline/translator-filter.png)

3. ワークスペースには4つの部分がある：
  - **左上:** 翻訳元の文字列に基づいて翻訳を入力してください。
  - **左下：** 翻訳されたファイルをプレビューします。元の形式を維持します。 Maintain the original format.
  - **右下:** Crowdin からの翻訳をお勧めします。クリックして使用しますが、正確性、特にリンクを確認してください。 Click to use, but verify for accuracy, especially with links.

4. Save your translation by clicking the **Save** button at the top.
  上部にある**保存**ボタンをクリックして翻訳を保存しましょう。
  ![翻訳者保存](/img/localizationProgramGuideline/translator-save.png)

5. 次のファイルに移動するには、上部のファイル名をクリックし、ポップアップウィンドウから新しいファイルを選択し、校正を続行します。
  ![次へ](/img/localizationProgramGuideline/redirect-to-next.png)
  ![to next](/img/localizationProgramGuideline/redirect-to-next.png)

## How to add support for a new language

If you are a community manager, follow these steps:

1. [TownSquareXYZ/ton-docs](https://github.com/TownSquareXYZ/ton-docs)に、`[lang]_localization` という名前の新しいブランチを追加します。
2. メニューに新しい言語を追加するには、**このリポジトリのVercelの所有者**に連絡してください。
3. Create a PR request to the dev branch. **Do not merge to dev**; this is for preview purposes only.

Once you complete these steps, you can see the preview of your language in the PR request.
![ko preview](/img/localizationProgramGuideline/ko_preview.png)

あなたの言語が TON ドキュメントの準備ができたら、問題を作成して、あなたの言語を本番環境に設定します。

<Feedback />

