import Feedback from '@site/src/components/Feedback';

# Как это работает

![how it works](/img/localizationProgramGuideline/localization-program.png)

The TownSquare Labs Localization Program comprises several key components. This chapter provides an overview of localization, helping you understand how it works and how to use it effectively.

В этой системе мы интегрируем несколько приложений для бесперебойной работы в качестве единой программы:

- **GitHub**: размещает документацию, синхронизирует документы из репозитория upstream и синхронизирует переводы с определенными ветками.
- **Crowdin**: управляет процессами перевода, включая перевод, корректуру и настройку языковых предпочтений.
- **Системы ИИ**: использует расширенный ИИ для помощи переводчикам, обеспечивая плавный рабочий процесс.
- **Customized Glossary**: This glossary guides translators and ensures AI generates accurate translations based on the project’s context. Users can also upload their glossaries as needed.

:::info
This guide won't cover the entire process but will highlight the key components that make the TownSquare Labs Localization Program unique. You can explore the program further on your own.
:::

## GitHub synchronization for documentation and translations

Our repository utilizes several branches to manage documentation and translations. Below is a detailed explanation of the purpose and function of each special branch:

### Branches overview

- **`dev`**\
  Ветка `dev` запускает GitHub Actions для обработки задач синхронизации. Конфигурации рабочих процессов можно найти в каталоге [**`.github/workflows`**](https://github.com/TownSquareXYZ/ton-docs/tree/dev/.github/workflows):

  - **`sync-fork.yml`**: этот рабочий процесс синхронизирует документацию из вышестоящего репозитория. Он запускается ежедневно в 00:00.
  - **`sync-translations.yml`**: This workflow synchronizes updated translations to the respective language branches for preview purposes on the corresponding websites.

- **`main`**\
  This branch stays in sync with the upstream repository through GitHub Actions, which runs on the `dev` branch. It also updates specific codes we intend to propose to the original repository.

- **`l10n_main`**\
  This branch includes all changes from the `main` branch and translations from Crowdin. All modifications in this branch are periodically committed to the upstream repository using a new sub-branch named `l10n_main_[some data]`.

- **`l10n_feat` or `l10n_feat_[specific functions]`**\
  This branch will include changes to code or documentation related to the translation system. Once you finalize all content, the changes in this branch will be merged into `l10_main`.

- **`[lang]_preview`**\
  Эти ветки предназначены для определенных языковых предварительных просмотров, таких как `ko_preview` для корейского и `ja_preview` для японского. Они позволяют нам предварительно просматривать веб-сайт на разных языках.

Поддерживая эти ветки и используя GitHub Actions, мы эффективно управляем синхронизацией нашей документации и обновлений переводов, гарантируя, что наш многоязычный контент всегда будет актуальным.

## How to set up a new crowdin project

1. Войдите в свою учетную запись [**Crowdin**](https://accounts.crowdin.com/login).

2. Нажмите `Создать проект` в меню.
  ![Create new project](/img/localizationProgramGuideline/howItWorked/create-new-project.png)

3. Укажите название проекта и целевые языки. Вы можете изменить языки в настройках позже.
  ![Create project setting](/img/localizationProgramGuideline/howItWorked/create-project-setting.png)

4. Перейдите к только что созданному проекту, выберите вкладку "Интеграции", нажмите кнопку `Добавить интеграцию`, найдите GitHub и установите его.
  ![install-github-integration](/img/localizationProgramGuideline/howItWorked/install-github-integration.png)

5. Перед настройкой интеграций GitHub на Crowdin укажите, какие файлы следует загрузить на Crowdin, чтобы избежать загрузки ненужных файлов:

  1. Создайте файл **crowdin.yml** в корне **репозитория GitHub** с базовой конфигурацией:

      ```yml
      project_id: <Your project id>
      preserve_hierarchy: 1
      files:
        - source: <Path of your original files>
          translation: <Path of your translated files>
      ```

  2. Get the correct configuration values:
    - Введите правильные значения конфигурации:
      \- **project_id**: В проекте Crowdin перейдите на вкладку "Инструменты", выберите API и найдите там **project_id**.
      ![select-api-tool](/img/localizationProgramGuideline/howItWorked/select-api-tool.png)
      ![projectId](/img/localizationProgramGuideline/howItWorked/projectId.png)
      \- **preserve_hierarchy**: Поддерживает структуру каталогов GitHub на сервере Crowdin.
    - **preserve_hierarchy**: Maintains the GitHub directory structure on the Crowdin server.
    - **source** and **translation**: Specify the paths for the files to upload to Crowdin and where the translated files should be output.

      For an example, refer to the [**config file**](https://github.com/TownSquareXYZ/ton-docs/blob/localization/crowdin.yml).\
      Find more in the [**Crowdin configuration documentation**](https://developer.crowdin.com/configuration-file/).\
      Find more in the [**Crowdin configuration documentation**](https://developer.crowdin.com/configuration-file/).

6. Настройте Crowdin для подключения к вашему репозиторию на GitHub:
  1. Нажмите `Добавить репозиторий` и выберите режим `Исходные файлы и файлы перевода`.
    ![select-integration-mode](/img/localizationProgramGuideline/howItWorked/select-integration-mode.png)
  2. Подключите свою учетную запись GitHub и найдите репозиторий, который нужно перевести.
    ![search-repo](/img/localizationProgramGuideline/howItWorked/search-repo.png)
  3. Select the branch on the left to generate a new branch where Crowdin will post the translations.
    ![setting-branch](/img/localizationProgramGuideline/howItWorked/setting-branch.png)
  4. Choose the frequency for updating translations to your GitHub branch, then click save to enable the integration.
    ![frequency-save](/img/localizationProgramGuideline/howItWorked/frequency-save.png)

Find more details in the [**GitHub integration documentation**](https://support.crowdin.com/github-integration/).

7. Наконец, вы можете нажать кнопку "Синхронизировать сейчас", чтобы синхронизировать репозиторий и переводы при необходимости.

## Glossary

### What is a glossary?

Sometimes, AI translators can't recognize untranslatable and specific terms. For instance, we don't want "Rust" translated when referring to the programming language. To prevent such mistakes, we use a glossary to guide translations.

A **glossary** allows you to create, store, and manage project-specific terminology in one place, ensuring that terms are translated correctly and consistently.

You can reference our [**ton-i18n-glossary**](https://github.com/TownSquareXYZ/ton-i18n-glossary).
![ton-i18n-glossary](/img/localizationProgramGuideline/howItWorked/ton-i18n-glossary.png)

### How to set up a glossary for a new language?

Большинство платформ перевода поддерживают глоссарии. В Crowdin после настройки глоссария каждый термин отображается как подчеркнутое слово в редакторе. Наведите курсор на термин, чтобы увидеть его перевод, часть речи и определение (если указано).
![github-glossary](/img/localizationProgramGuideline/howItWorked/github-glossary.png)
![crowdin-glossary](/img/localizationProgramGuideline/howItWorked/crowdin-glossary.png)

In DeepL, upload your glossary, which will be used automatically during AI translation.

Мы создали [**программу для глоссария**](https://github.com/TownSquareXYZ/ton-i18n-glossary), которая автоматически загружает обновления.

Чтобы добавить термин в глоссарий:

1. Если английский термин уже есть в глоссарии, найдите соответствующую строку и столбец для языка, который вы хотите перевести, введите перевод и загрузите его.
2. Чтобы загрузить новый глоссарий, клонируйте проект и запустите:

```bash
npm i
```

```bash
npm run generate -- <glossary name you want>
```

Повторите шаг 1, чтобы добавить новый термин.

## How to take advantage of AI translation copilot?

AI Translation Copilot помогает сломать языковые барьеры, имея несколько преимуществ:

- **Повышенная согласованность**: переводы AI основаны на актуальной информации, предоставляя самые точные и актуальные переводы.
- **Скорость и эффективность**: перевод AI выполняется мгновенно, обрабатывая большие объемы контента в режиме реального времени.
- **Robust Scalability**: AI systems continuously learn and improve, enhancing translation quality over time.

We use DeepL for AI translation in our Crowdin project:

1. Выберите «Машинный перевод» в меню Crowdin и нажмите "Изменить" в строке DeepL.
  ![select-deepl](/img/localizationProgramGuideline/howItWorked/select-deepl.png)
2. Включите поддержку DeepL и введите ключ API переводчика DeepL.
  > [Как получить ключ API переводчика DeepL](https://www.deepl.com/pro-api?cta=header-pro-api)

![config-crowdin-deepl](/img/localizationProgramGuideline/howItWorked/config-crowdin-deepl.png)

3. В нашей настройке DeepL используется настраиваемый глоссарий. Проверьте [**ton-i18n-glossary**](https://github.com/TownSquareXYZ/ton-i18n-glossary) для получения подробной информации о загрузке глоссария.

4. В репозитории нажмите "Предварительный перевод" и выберите "Машинный перевод".
  ![pre-translation](/img/localizationProgramGuideline/howItWorked/pre-translation.png)

5. Choose DeepL as the Translation Engine, select the target languages, and select the translated files.
  ![pre-translate-config](/img/localizationProgramGuideline/howItWorked/pre-translate-config.png)

That's it! Now, you can take a break and wait for the pre-translation to complete.

<Feedback />

