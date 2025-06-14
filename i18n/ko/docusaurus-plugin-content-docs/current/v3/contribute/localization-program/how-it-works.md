import Feedback from '@site/src/components/Feedback';

# How it works

![작동 방식](/img/localizationProgramGuideline/localization-program.png)

The TownSquare Labs Localization Program comprises several key components. This chapter provides an overview of localization, helping you understand how it works and how to use it effectively.

이 시스템 내에서는 여러 애플리케이션을 통합하여 하나의 통합된 프로그램으로 원활하게 작동하도록 합니다:

- **GitHub**: 문서를 호스팅하고, 업스트림 리포지토리에서 문서를 동기화하고, 특정 브랜치에 번역을 동기화합니다.
- **Crowdin**: 번역, 교정, 언어 기본 설정 등 번역 프로세스를 관리합니다.
- **AI 시스템**: 번역자들을 지원하기 위해 고급 AI를 활용하여 원활한 워크플로우를 보장합니다.
- **Customized Glossary**: This glossary guides translators and ensures AI generates accurate translations based on the project’s context. Users can also upload their glossaries as needed.

:::info
This guide won't cover the entire process but will highlight the key components that make the TownSquare Labs Localization Program unique. You can explore the program further on your own.
:::

## GitHub synchronization for documentation and translations

Our repository utilizes several branches to manage documentation and translations. Below is a detailed explanation of the purpose and function of each special branch:

### Branches overview

- **`dev`** `dev` 브랜치는 동기화 작업을 처리하기 위해 GitHub Actions를 실행합니다. 워크플로우 설정은 [**`.github/workflows`**](https://github.com/TownSquareXYZ/ton-docs/tree/dev/.github/workflows) 디렉토리에서 찾을 수 있습니다:

  - **`sync-fork.yml`**: 이 워크플로우는 업스트림 리포지토리로부터 문서를 동기화합니다. 매일 00:00에 실행됩니다.
  - **`sync-translations.yml`**: This workflow synchronizes updated translations to the respective language branches for preview purposes on the corresponding websites.

- **`main`**\
  This branch stays in sync with the upstream repository through GitHub Actions, which runs on the `dev` branch. It also updates specific codes we intend to propose to the original repository.

- **`l10n_main`**\
  This branch includes all changes from the `main` branch and translations from Crowdin. All modifications in this branch are periodically committed to the upstream repository using a new sub-branch named `l10n_main_[some data]`.

- **`l10n_feat` or `l10n_feat_[specific functions]`**\
  This branch will include changes to code or documentation related to the translation system. Once you finalize all content, the changes in this branch will be merged into `l10_main`.

- **`[lang]_preview`** 이 브랜치들은 한국어의 경우 `ko_preview`, 일본어의 경우 `ja_preview`와 같이 특정 언어 미리보기를 위해 지정되어 있습니다. 이를 통해 다양한 언어로 웹사이트를 미리볼 수 있습니다.

이 브랜치들을 유지하고 GitHub Actions를 사용함으로써, 우리는 문서와 번역 업데이트의 동기화를 효율적으로 관리하여 다국어 콘텐츠가 항상 최신 상태를 유지하도록 합니다.

## How to set up a new crowdin project

1. [**Crowdin 계정**](https://accounts.crowdin.com/login) 에 로그인하세요.

2. 메뉴에서 `새 프로젝트 만들기`를 클릭하세요.
  ![새 프로젝트 만들기](/img/localizationProgramGuideline/howItWorked/create-new-project.png)

3. 프로젝트 이름과 대상 언어를 설정하세요. 언어는 나중에 설정에서 변경할 수 있습니다.
  ![프로젝트 설정 만들기](/img/localizationProgramGuideline/howItWorked/create-project-setting.png)

4. 방금 만든 프로젝트로 이동하여, 통합 탭을 선택하고 `통합 추가` 버튼을 클릭한 다음, `GitHub`를 검색하여 설치하세요.
  ![GitHub 통합 설치](/img/localizationProgramGuideline/howItWorked/install-github-integration.png)

5. Crowdin에서 GitHub 통합을 구성하기 전에, 불필요한 파일 업로드를 방지하기 위해 Crowdin에 업로드할 파일을 지정하세요:

  1. **GitHub 리포지토리 루트**에 **crowdin.yml** 파일을 기본 설정으로 만드세요:

      ```yml
      project_id: <Your project id>
      preserve_hierarchy: 1
      files:
        - source: <Path of your original files>
          translation: <Path of your translated files>
      ```

  2. Get the correct configuration values:
    - 올바른 구성 값을 가져옵니다:
      \- **project_id**: Crowdin 프로젝트에서 도구 탭으로 이동하여 API를 선택하고, **project_id**를 찾으세요.
      ![select-api-tool](/img/localizationProgramGuideline/howItWorked/select-api-tool.png)
      ![projectId](/img/localizationProgramGuideline/howItWorked/projectId.png)
    - ![API 도구 선택](/img/localizationProgramGuideline/howItWorked/select-api-tool.png)
      ![project_id](/img/localizationProgramGuideline/howItWorked/projectId.png)
      \- **preserve_hierarchy**: Crowdin 서버에서 GitHub 디렉토리 구조를 유지합니다.
    - - **source**와 **translation**: Crowdin에 업로드할 파일 경로와 번역된 파일이 출력될 경로를 지정합니다.

      For an example, refer to the [**config file**](https://github.com/TownSquareXYZ/ton-docs/blob/localization/crowdin.yml).\
      Find more in the [**Crowdin configuration documentation**](https://developer.crowdin.com/configuration-file/).\
      Find more in the [**Crowdin configuration documentation**](https://developer.crowdin.com/configuration-file/).

6. Crowdin을 구성하여 GitHub 리포지토리에 연결합니다:
  1. `리포지토리 추가`를 클릭하고 `소스 및 번역 파일 모드`를 선택합니다.
    ![통합 모드 선택](/img/localizationProgramGuideline/howItWorked/select-integration-mode.png)
  2. GitHub 계정을 연결하고 번역할 리포지토리를 검색하세요.
    ![리포지토리 검색](/img/localizationProgramGuideline/howItWorked/search-repo.png)
  3. Select the branch on the left to generate a new branch where Crowdin will post the translations.
    ![setting-branch](/img/localizationProgramGuideline/howItWorked/setting-branch.png)
  4. Choose the frequency for updating translations to your GitHub branch, then click save to enable the integration.
    ![frequency-save](/img/localizationProgramGuideline/howItWorked/frequency-save.png)

Find more details in the [**GitHub integration documentation**](https://support.crowdin.com/github-integration/).

7. 마지막으로, 필요할 때마다 `지금 동기화` 버튼을 클릭하여 리포지토리와 번역을 동기화할 수 있습니다.

## 용어집

### What is a glossary?

Sometimes, AI translators can't recognize untranslatable and specific terms. For instance, we don't want "Rust" translated when referring to the programming language. To prevent such mistakes, we use a glossary to guide translations.

A **glossary** allows you to create, store, and manage project-specific terminology in one place, ensuring that terms are translated correctly and consistently.

You can reference our [**ton-i18n-glossary**](https://github.com/TownSquareXYZ/ton-i18n-glossary).
![ton-i18n-glossary](/img/localizationProgramGuideline/howItWorked/ton-i18n-glossary.png)

### How to set up a glossary for a new language?

대부분의 번역 플랫폼은 용어집을 지원합니다. Crowdin에서는 용어집을 설정한 후, 각 용어가 편집기에서 밑줄이 그어진 단어로 나타납니다. 용어 위에 마우스를 올리면 번역, 품사, 정의(제공된 경우)를 볼 수 있습니다.
![github-glossary](/img/localizationProgramGuideline/howItWorked/github-glossary.png)
![crowdin-glossary](/img/localizationProgramGuideline/howItWorked/crowdin-glossary.png)

In DeepL, upload your glossary, which will be used automatically during AI translation.

우리는 업데이트를 자동으로 업로드하는 [**용어집 프로그램**](https://github.com/TownSquareXYZ/ton-i18n-glossary)을 만들었습니다.

용어집에 용어를 추가하려면:

1. 영어 용어가 이미 용어집에 있는 경우, 해당 언어의 번역을 입력하고 업로드합니다.
2. 새 용어집을 업로드하려면, 프로젝트를 클론하고 다음을 실행합니다:

```bash
npm i
```

```bash
npm run generate -- <glossary name you want>
```

새 용어를 추가하려면 1단계를 반복합니다.

## How to take advantage of AI translation copilot?

AI 번역 코파일럿은 여러 가지 이점으로 언어 장벽을 허물어줍니다:

- **향상된 일관성**: AI 번역은 최신 정보를 기반으로 하여 가장 정확하고 최신의 번역을 제공합니다.
- **속도와 효율성**: AI 번역은 실시간으로 대량의 콘텐츠를 즉시 처리합니다.
- **Robust Scalability**: AI systems continuously learn and improve, enhancing translation quality over time.

We use DeepL for AI translation in our Crowdin project:

1. Crowdin 메뉴에서 기계 번역을 선택하고 DeepL 라인에서 편집을 클릭하세요.
  ![select-deepl](/img/localizationProgramGuideline/howItWorked/select-deepl.png)
2. DeepL 지원을 활성화하고 DeepL 번역기 API 키를 입력하세요.
  > [DeepL 번역기 API 키 받기 방법](https://www.deepl.com/pro-api?cta=header-pro-api)

![config-crowdin-deepl](/img/localizationProgramGuideline/howItWorked/config-crowdin-deepl.png)

3. 우리의 DeepL 설정은 맞춤형 용어집을 사용합니다. 용어집 업로드에 대한 자세한 내용은 [**ton-i18n-glossary**](https://github.com/TownSquareXYZ/ton-i18n-glossary)를 확인하세요.

4. 리포지토리에서 사전 번역을 클릭하고 기계 번역을 통해 선택하세요.
  ![pre-translation](/img/localizationProgramGuideline/howItWorked/pre-translation.png)

5. Choose DeepL as the Translation Engine, select the target languages, and select the translated files.
  ![pre-translate-config](/img/localizationProgramGuideline/howItWorked/pre-translate-config.png)

That's it! Now, you can take a break and wait for the pre-translation to complete.

<Feedback />

