import Feedback from '@site/src/components/Feedback';

# How to contribute

This page explains how to participate in the localization program for TON documentation.

## 사전 준비 사항

Localization contribution is open to everyone. Here are a few steps you need to take before you start contributing:

1. Log in to your [Crowdin](https://crowdin.com) account or sign up.
2. 기여하고 싶은 언어를 선택하세요.
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

## 역할

시스템에서 맡을 수 있는 **역할**은 다음과 같습니다:

- **언어 코디네이터** – 할당된 언어 내 프로젝트 기능을 관리합니다.
- **Developer** – Uploads files, edits translatable text, connects integrations and uses the API.
- **교정자** – 문자열을 번역하고 승인합니다.
- **번역가** (내부 또는 커뮤니티) – 문자열을 번역하고 다른 사람이 추가한 번역에 투표합니다.

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
  2. [**`src/theme/Footer/config.ts`**](https://github.com/TownSquareXYZ/ton-docs/blob/main/src/theme/Footer/config.ts) 파일을 찾으세요.
  3. **`FOOTER_COLUMN_LINKS_EN`** 변수의 값을 **`FOOTER_COLUMN_LINKS_[YOUR_LANG]`** 에 복사하세요.
  4. **`headerLangKey`** 와 **`langKey`** 키의 값을 **`FOOTER_COLUMN_LINKS_CN`** 의 중국어처럼 귀하의 언어로 번역하세요.
  5. **`FOOTER_LINKS_TRANSLATIONS`** 에 새로운 속성을 추가하세요:
    - **키**를 [**ISO 언어 코드**](https://www.andiamo.co.uk/resources/iso-language-codes/)로 설정하세요 (**두 글자**, **소문자**).
    - **The value** should be the new variable you created for your language.
  6. **`yarn start:local [YOUR_IOS_LANG_CODE]`** 명령어를 실행하여 귀하의 언어로 된 새로운 Footer를 미리보기 하세요.\
    (예: **`yarn start:local ru`** 로 **러시아어** Footer 미리보기)
  7. 모든 것이 잘 보인다면, **`i18n_feat`** 브랜치에 풀 리퀘스트를 생성하세요.
- **파일 업로드**
- **번역 가능한 텍스트 편집**
- **통합 연결** (예: GitHub 통합 추가)
  ![GitHub 통합 설치](/img/localizationProgramGuideline/howItWorked/install-github-integration.png)
- **[Crowdin API](https://developer.crowdin.com/api/v2/) 사용**

### Proofreader guidelines

**교정자**로서, **파란색 진행 막대**가 있는 파일에서 작업하게 됩니다.
![교정 단계1](/img/localizationProgramGuideline/proofread-step1.png)
파일을 클릭하여 편집 인터페이스로 들어가세요.

#### Contribution flow

1. [**나란히 보기 모드**](#side-by-side-mode)에 있는지 확인하세요. **승인되지 않음** 번역으로 필터링하여 교정이 필요한 문자열을 확인하세요.
  ![교정 필터](/img/localizationProgramGuideline/proofread-filter.png)

2. 다음 규칙을 따르세요:
  - **파란색 큐브 아이콘**이 있는 문자열을 선택하세요. 각 번역을 확인하세요:
    - **올바르면**, ☑️ 버튼을 클릭하세요.
    - **잘못되면**, 다음 줄로 이동하세요.

![교정 승인됨](/img/localizationProgramGuideline/proofread-approved.png)

:::info
You can also review the approved lines:

1. **승인됨**으로 필터링하세요.

2. 승인된 줄에 문제가 있으면, ☑️ 버튼을 클릭하여 교정이 필요하도록 되돌리세요.
  :::

3. To move to the following file, click the file name at the top, select the new file from the pop-up window, and continue proofreading.
  ![to next](/img/localizationProgramGuideline/redirect-to-next.png)

#### Previewing your work

The preview website displays all approved content within one hour. Check [**our repo**](https://github.com/TownSquareXYZ/ton-docs/pulls) for the **preview** link in the newest PR.
![preview link](/img/localizationProgramGuideline/preview-link.png)

### Translator guidelines

As a translator, you aim to ensure that translations are faithful and expressive, keeping them as close to the original meaning and as understandable as possible. Your mission is to make the blue progress bar reach 100%.

#### Translation flow

성공적인 번역 과정을 위해 다음 단계를 따르세요:

1. 번역이 100%에 도달하지 않은 파일을 선택하세요.
  ![번역가 선택](/img/localizationProgramGuideline/translator-select.png)

2. [**나란히 보기 모드**](#side-by-side-mode)에 있는지 확인하세요. **번역되지 않음** 문자열로 필터링하세요.
  ![번역가 필터](/img/localizationProgramGuideline/translator-filter.png)

3. 작업 공간은 네 부분으로 구성됩니다:
  - **왼쪽 상단:** 소스 문자열을 기반으로 번역을 입력하세요.
  - **왼쪽 하단:** 번역된 파일을 미리보기 합니다. 원본 형식을 유지하세요.
  - **오른쪽 하단:** Crowdin의 번역 제안. 클릭하여 사용할 수 있지만, 특히 링크의 정확성을 확인하세요.

4. 상단의 **저장** 버튼을 클릭하여 번역을 저장하세요.
  ![번역가 저장](/img/localizationProgramGuideline/translator-save.png)

5. 다음 파일로 이동하려면 상단의 파일 이름을 클릭하고 팝업 창에서 새 파일을 선택하세요.
  ![다음으로 이동](/img/localizationProgramGuideline/redirect-to-next.png)

## How to add support for a new language

If you are a community manager, follow these steps:

1. [TownSquareXYZ/ton-docs](https://github.com/TownSquareXYZ/ton-docs)에 `[lang]_localization` (예: 한국어의 경우 `ko_localization`)이라는 새 브랜치를 추가하세요.
2. 이 저장소의 Vercel 소유자에게 연락하여 메뉴에 새 언어를 추가하도록 요청하세요.
3. dev 브랜치에 PR 요청을 생성하세요. **dev로 병합하지 마세요**; 이는 미리보기 용도입니다.

Once you complete these steps, you can see the preview of your language in the PR request.
![ko preview](/img/localizationProgramGuideline/ko_preview.png)

언어가 TON 문서에 준비되면, 문제를 생성하고, 우리가 프로덕션 환경에 언어를 설정하도록 요청하세요.

<Feedback />

