import Feedback from '@site/src/components/Feedback';

# How to contribute

This page explains how to participate in the localization program for TON documentation.

## Prerequisites

Localization contribution is open to everyone. Here are a few steps you need to take before you start contributing:

1. Log in to your [Crowdin](https://crowdin.com) account or sign up.
2. Select the language you want to contribute to.
3. Familiarize yourself with the [How to use crowdin](/v3/contribute/localization-program/how-to-contribute/) guide and the [Translation style guide](/v3/contribute/localization-program/translation-style-guide/) for tips and best practices.
4. Use machine translations to aid your work, but do not rely solely on them.
5. Preview all translation results on the website after proofreading.

:::info
Before contributing, read the guidelines below to ensure standardization and quality, speeding up the review process.
:::

## Side-by-side mode

All tasks are performed in **side-by-side** mode in the Crowdin Editor. To enable this, click a file you want to work on. At the top right of the page, click the **Editor view** button and select **side-by-side** mode for a clearer editor view.  
![side-by-side mode](/img/localizationProgramGuideline/side-by-side.png)

## Roles

Here are the **roles** you can assume in the system:

- **Language Coordinator** – Manages project features within assigned languages.
- **Developer** – Uploads files, edits translatable text, connects integrations and uses the API.
- **Proofreader** – Translates and approves strings.
- **Translator** (in-house or community) – Translates strings and votes on translations added by others.

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
  2. Locate the file [**`src/theme/Footer/config.ts`**](https://github.com/TownSquareXYZ/ton-docs/blob/main/src/theme/Footer/config.ts).
  3. Copy the value of the variable **`FOOTER_COLUMN_LINKS_EN`** to **`FOOTER_COLUMN_LINKS_[YOUR_LANG]`**.
  4. Translate the values of the keys **`headerLangKey`** and **`langKey`** to your language, as we did for Mandarin in **`FOOTER_COLUMN_LINKS_CN`**.
  5. Add a new property to **`FOOTER_LINKS_TRANSLATIONS`**:
      - Set **the key** as your [**ISO language code**](https://www.andiamo.co.uk/resources/iso-language-codes/) (**two letters**, **lowercase**).
      - **The value** should be the new variable you created for your language.
  6. Run the command **`yarn start:local [YOUR_IOS_LANG_CODE]`** to preview the new footer in your language.   
        (e.g., **`yarn start:local ru`** for a preview of the **Russian** footer)
  7. If everything looks good, create a pull request to the **`i18n_feat`** branch.
- **Upload files**
- **Edit translatable text**
- **Connect integrations** (e.g., add GitHub integration)
  ![install-github-integration](/img/localizationProgramGuideline/howItWorked/install-github-integration.png)
- **Use the [Crowdin API](https://developer.crowdin.com/api/v2/)**

### Proofreader guidelines

As a **Proofreader**, you'll work on files with a **blue progress bar**.
![proofread step1](/img/localizationProgramGuideline/proofread-step1.png)
Click on a file to enter the editing interface.

#### Contribution flow

1. Make sure you're in [**side-by-side mode**](#side-by-side-mode). Filter by **Not Approved** translations to see strings needing proofreading.
![proofread filter](/img/localizationProgramGuideline/proofread-filter.png)

2. Follow these rules:
   - Select strings with a **blue cube icon**. Check each translation:
      - If **correct**, click the ☑️ button.
      - If **incorrect**, move to the next line.

![proofread approved](/img/localizationProgramGuideline/proofread-approved.png)

:::info
You can also review the approved lines:
  1. Filter by **Approved**.
  2. If an approved line has issues, click the ☑️ button to revert it to needing proofreading.
:::

3. To move to the following file, click the file name at the top, select the new file from the pop-up window, and continue proofreading.
![to next](/img/localizationProgramGuideline/redirect-to-next.png)

#### Previewing your work
The preview website displays all approved content within one hour. Check [**our repo**](https://github.com/TownSquareXYZ/ton-docs/pulls) for the **preview** link in the newest PR.
![preview link](/img/localizationProgramGuideline/preview-link.png)

### Translator guidelines

As a translator, you aim to ensure that translations are faithful and expressive, keeping them as close to the original meaning and as understandable as possible. Your mission is to make the blue progress bar reach 100%.

#### Translation flow

Follow these steps for a successful translation process:

1. Select files that haven't reached 100% translation.
![translator select](/img/localizationProgramGuideline/translator-select.png)

2. Ensure you're in [**side-by-side mode**](#side-by-side-mode). Filter by **Untranslated** strings.
![translator filter](/img/localizationProgramGuideline/translator-filter.png)

3. Your workspace has four parts:
   - **Top left:** Input your translation based on the source string.
   - **Bottom left:** Preview the translated file. Maintain the original format.
   - **Bottom right:** Suggested translations from Crowdin. Click to use, but verify for accuracy, especially with links.
  
4. Save your translation by clicking the **Save** button at the top.
![translator save](/img/localizationProgramGuideline/translator-save.png)

5. To move to the next file, click the file name at the top and select the new file from the pop-up window.
![to next](/img/localizationProgramGuideline/redirect-to-next.png)

## How to add support for a new language

If you are a community manager, follow these steps:

1. Add a new branch named `[lang]_localization` (e.g., `ko_localization` for Korean) on [TownSquareXYZ/ton-docs](https://github.com/TownSquareXYZ/ton-docs).
2. **Contact the Vercel owner of this repo** to add the new language to the menu.
3. Create a PR request to the dev branch. **Do not merge to dev**; this is for preview purposes only.

Once you complete these steps, you can see the preview of your language in the PR request.
![ko preview](/img/localizationProgramGuideline/ko_preview.png)

When your language is ready for the TON docs, create an issue, and we'll set your language into the production environment.

<Feedback />

