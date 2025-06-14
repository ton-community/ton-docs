import Feedback from '@site/src/components/Feedback';

# Как сделать вклад

This page explains how to participate in the localization program for TON documentation.

## Предварительные условия

Localization contribution is open to everyone. Here are a few steps you need to take before you start contributing:

1. Log in to your [Crowdin](https://crowdin.com) account or sign up.
2. Выберите язык, на котором вы хотите внести свой вклад.
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

## Роли

Вот **роли**, которые вы можете взять на себя в системе:

- **Language Coordinator** - Управляет функциями проекта в рамках назначенных языков.
- **Developer** – Uploads files, edits translatable text, connects integrations and uses the API.
- **Proofreader** - Переводит и утверждает строки.
- **Translator** (собственный или сообщества) - переводит строки и голосует за переводы,.

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
  2. Перейдите к файлу [**`src/theme/Footer/config.ts`**] (https://github.com/TownSquareXYZ/ton-docs/blob/main/src/theme/Footer/config.ts).
  3. Скопируйте значение переменной **`FOOTER_COLUMN_LINKS_EN`** в **`FOOTER_COLUMN_LINKS_[YOUR_LANG]`**.
  4. Переведите значения ключей **`headerLangKey`** и **`langKey`** на ваш язык, как мы это сделали для мандаринского в **`FOOTER_COLUMN_LINKS_CN`**.
  5. Добавьте новое свойство в **`FOOTER_LINKS_TRANSLATIONS`**:
    - Установите **ключ** как ваш [**код языка ISO**](https://www.andiamo.co.uk/resources/iso-language-codes/) (**две буквы**, **нижний регистр**).
    - **The value** should be the new variable you created for your language.
  6. Выполните команду **`yarn start:local [YOUR_IOS_LANG_CODE]`**, чтобы просмотреть новый нижний колонтитул на вашем языке.\
    (например, **`yarn start:local ru`** для предварительного просмотра на **русском** языке)\
    (e.g., **`yarn start:local ru`** for a preview of the **Russian** footer)
  7. Если все выглядит хорошо, создайте pull request в ветку **`i18n_feat`**.
- **Загрузите файлы**
- **Отредактируйте переводимый текст**
- **Подключите интеграции** (например, добавьте интеграцию с GitHub)
  ![install-github-integration](/img/localizationProgramGuideline/howItWorked/install-github-integration.png)
- **Используйте [Crowdin API](https://developer.crowdin.com/api/v2/)**

### Proofreader guidelines

Как **Proofreader**, вы будете работать с файлами с **синим индикатором выполнения**.
![proofread step1](/img/localizationProgramGuideline/proofread-step1.png)
Щелкните на файле, чтобы войти в интерфейс редактирования.

#### Contribution flow

1. Убедитесь, что вы работаете в [**режиме бок о бок**](#side-by-side-mode). Отфильтруйте **неутвержденные** переводы, чтобы увидеть строки, требующие проверки..
  ![proofread](/img/localizationProgramGuideline/proofread-filter.png)

2. Соблюдайте следующие правила:
  - Выберите строки с **синим прямоугольным значком**. Проверьте каждый перевод:
    - Если **правильный**, нажмите кнопку ☑️.
    - Если **неправильный**, перейдите к следующей строке.

![proofread approved](/img/localizationProgramGuideline/proofread-approved.png)

:::info
You can also review the approved lines:

1. Фильтр по **утвержденным**.

2. Если в утвержденной строке есть проблемы, нажмите кнопку ☑️, чтобы вернуть ее к требующей проверки.
  :::

3. To move to the following file, click the file name at the top, select the new file from the pop-up window, and continue proofreading.
  ![to next](/img/localizationProgramGuideline/redirect-to-next.png)

#### Previewing your work

The preview website displays all approved content within one hour. Check [**our repo**](https://github.com/TownSquareXYZ/ton-docs/pulls) for the **preview** link in the newest PR.
![preview link](/img/localizationProgramGuideline/preview-link.png)

### Translator guidelines

As a translator, you aim to ensure that translations are faithful and expressive, keeping them as close to the original meaning and as understandable as possible. Your mission is to make the blue progress bar reach 100%.

#### Translation flow

Для успешного процесса перевода выполните следующие шаги:

1. Выберите файлы, которые не достигли 100% перевода.
  ![translator select](/img/localizationProgramGuideline/translator-select.png)

2. Убедитесь, что вы находитесь в [**режиме бок о бок**](#side-by-side-mode). Фильтр по **непереведенным** строкам.
  ![translator filter](/img/localizationProgramGuideline/translator-filter.png)

3. Ваше рабочее пространство состоит из четырех частей:
  - **Сверху слева:** введите свой перевод на основе исходной строки.
  - **Снизу слева:** предварительный просмотр переведенного файла. Сохраните исходный формат.
  - **Снизу справа:** предлагаемые переводы от Crowdin. Нажмите, чтобы использовать, но проверьте точность, особенно со ссылками.

4. Сохраните свой перевод, нажав кнопку **Сохранить** вверху.
  ![translator save](/img/localizationProgramGuideline/translator-save.png)

5. Чтобы перейти к следующему файлу, щелкните имя файла вверху и выберите новый файл во всплывающем окне.
  ![to next](/img/localizationProgramGuideline/redirect-to-next.png)

## How to add support for a new language

If you are a community manager, follow these steps:

1. Добавьте новую ветку с именем `[lang]_localization` (например, `ko_localization` для корейского языка) в [TownSquareXYZ/ton-docs](https://github.com/TownSquareXYZ/ton-docs).
2. **Свяжитесь с владельцем этого репозитория Vercel**, чтобы добавить новый язык в меню.
3. Создайте PR-запрос в ветку dev. **Не объединяйте с dev**; это нужно только для целей предварительного просмотра.

Once you complete these steps, you can see the preview of your language in the PR request.
![ko preview](/img/localizationProgramGuideline/ko_preview.png)

Когда ваш язык будет готов для документации TON, создайте issue, и мы добавим ваш язык в производственную среду.

<Feedback />

