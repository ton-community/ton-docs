import Feedback from '@site/src/components/Feedback';

# Translation style guide

This translation style guide contains essential guidelines, instructions, and tips for translators, helping us localize the website.

This document serves as a general guide and is not specific to any language.

## 메시지의 핵심 포착

TON 문서를 번역할 때, 문자 그대로의 번역을 피하십시오.

The translations must capture the essence of the message. This approach means rephrasing specific phrases or using descriptive translations instead of translating the content word for word.

Different languages have different grammar rules, conventions, and word order. When translating, please be mindful of structuring sentences in the target languages, and avoid word-for-word translation of the English source, as this can lead to poor sentence structure and readability.

Instead of translating the source text word for word, you should read the entire sentence and adapt it to fit the conventions of the target language.

## Formal vs. informal

우리는 방문자 모두에게 항상 정중하고 적절한 격식적인 대화 방식을 사용합니다.

Using the formal address allows us to avoid sounding unofficial or offensive and works regardless of the reader’s age and gender.

Most Indo-European and Afro-Asiatic languages use gender-specific second-person personal pronouns, distinguishing between males and females. When addressing the user or using possessive pronouns, we can avoid assuming the reader’s gender, as the formal address is generally applicable and consistent, regardless of how they identify.

## Straightforward vocabulary and meaning

우리의 목표는 웹사이트의 내용을 가능한 한 많은 사람들이 이해할 수 있도록 하는 것입니다.

In most cases, contributors can achieve this result by using short and simple words that are easily understandable. If multiple possible translations exist for a word in your language with the same meaning, the best option is often the shortest word reflecting the meaning.

## 문자 체계

All of the content should be translated using the correct writing system for your language and should not include any words written using Latin characters.

번역할 때는 번역이 일관되고 라틴 문자를 포함하지 않도록 해야 합니다.

**Do not translate proper names defined by glossary**

## 페이지 메타데이터 번역

Some pages contain metadata, such as 'title', 'lang', 'description', 'sidebar', etc.

When uploading new pages to Crowdin, we hide content that translators should never translate. This feature makes visible to translators in Crowdin only the text that should be translated.

Please be especially careful when translating strings where the source text is 'en'. This represents the language page, which is available and should be translated to the [ISO language code for your language](https://www.andiamo.co.uk/resources/iso-language-codes/). These strings should always be translated using Latin characters, not the writing script, native to the target language.

가장 많이 사용되는 언어의 언어 코드 예시:

- 영어 - en
- 중국어 간체 - zh-CN
- 러시아어 - ru
- 한국어 - ko
- 폴란드어 - pl
- 우크라이나어 - uk

## 외부 기사 제목

Some strings contain titles of external articles. Most of our developer documentation pages contain links to external articles for further reading. The strings containing article titles need to be translated, regardless of the article's language, to ensure a more consistent user experience for visitors viewing the page in their language.

## Crowdin 경고

Crowdin has a built-in feature that warns translators when they are about to make a mistake. Crowdin will automatically alert you before saving your translation if you forget to include a tag from the source, translate elements that should not be translated, add several consecutive spaces, forget end punctuation, etc. If you see a warning like this, please double-check the suggested translation.

:::warning
Never ignore these warnings, as they usually mean something is wrong or the translation lacks a key part of the source text.
:::

## Short vs. complete forms and abbreviations

The website uses many abbreviations, such as apps, DApps, NFT, DAO, DeFi, etc. These abbreviations are standard in English, and most visitors are familiar with them.

Since they usually don’t have established translations in other languages, the best approach to these and similar terms is to provide a descriptive translation of the entire form and add the English abbreviation in brackets.

Do not translate these abbreviations since most people are unfamiliar with them, and the localized versions would not make much sense to most visitors.

Example of how to translate DApps:

- Decentralized applications (DApps) → Translated in complete form (English abbreviation in brackets)

## 정립된 번역이 없는 용어

Some terms might not have established translations in other languages but are widely known by their original English names. Such terms include newer concepts, like proof-of-work, proof-of-stake, Beacon Chain, staking, etc.

While translating these terms can sound unnatural, since the English version is a basis for other languages, it is highly recommended that they be translated.

Feel free to get creative, use descriptive translations, or translate them literally.

Most terms should be translated instead of leaving some in English, as this new terminology will become more widespread as more people start using TON and related technologies. To onboard more people to TON, we must provide understandable terminology in as many languages as possible, even if we need to create it ourselves.

## 버튼 및 CTA

Do not translate the website's contents, such as buttons.

You may identify button text by viewing the context screenshots connected with most strings or by checking the context in the editor, which includes the phrase ‘’button’’.

Button translations should be as short as possible to prevent formatting mismatches. Additionally, button translations, i.e., presenting a command or request, should be imperative.

## 포용성을 위한 번역

TON docs visitors come from all over the world and from different backgrounds. Therefore, the language on the website should be neutral, welcoming to everyone, and not exclusive.

Gender neutrality is an essential aspect of this. Use the formal address form and avoid gender-specific words in the translations.

Another form of inclusivity is trying to translate for a global audience, not specific to any country, race, or region.

마지막으로, 언어는 모든 연령대와 청중에게 적합해야 합니다.

## 언어별 번역

When translating, it is crucial to follow the grammar rules, conventions, and formatting used in your language instead of copying from the source. The source text follows English grammar rules and conventions, which do not apply to many other languages.

You should be aware of the rules for your language and translate accordingly. If you need help, contact us; we will help you with resources on translating elements for your language.

특히 주의해야 할 몇 가지 예시:

### 구두점, 형식

#### 대문자 사용

- 다른 언어에서는 대문자 사용에 큰 차이가 있습니다.
- 영어에서는 제목 및 이름, 월 및 요일, 언어 이름, 휴일 등을 모두 대문자로 쓰는 것이 일반적입니다. 그러나 많은 다른 언어에서는 이러한 대문자 사용이 문법적으로 틀립니다.
- Some languages also have rules about capitalizing personal pronouns, nouns, and adjectives that you shouldn't capitalize in English.

#### 공백

- 철자 규칙은 각 언어의 공백 사용을 정의합니다. 공백은 어디에나 사용되기 때문에 이러한 규칙은 가장 두드러지며, 공백은 가장 오역된 요소 중 하나입니다.
- 영어와 다른 언어 간의 공백 사용의 일반적인 차이점:
  - Space before units of measure and currencies. Example: USD, EUR, kB, MB
  - Space before degree signs. Example: °C, ℉
  - Space before some punctuation marks, especially the ellipsis. Example: Then… in summary
  - Space before and after slashes. Example: if / else

#### 목록

- Every language has a diverse and complex set of rules for writing lists. These can be significantly different from English.
- In some languages, the first word of each new line needs to be capitalized, while in others, new lines should start with lowercase letters. Many languages also have different rules about capitalization in lists, depending on the length of each line.
- The same applies to the punctuation of line items. The end punctuation in lists can be a period (.), comma (,), or semicolon (;), depending on the language.

#### 인용 부호

- 언어는 다양한 인용 부호를 사용합니다. 소스에서 영어 인용 부호를 복사하는 것은 종종 잘못된 것입니다.
- 가장 일반적인 인용 부호 유형:
  - „예문“
  - ‚예문’
  - »예문«
  - “예문”
  - ‘예문’
  - «예문»

#### 하이픈과 대시

- In English, a hyphen `-` is used to join words or different parts of a word, while a dash `—` indicates a range or a pause.
  - Example: TON — is ... proof-of-stake.
- Many languages have different rules for using hyphens and dashes that should be observed.

### Formats

#### Numbers

- The main difference in writing numbers in different languages is the separator for decimals and thousands. For thousands, this can be a period, comma, or space. Similarly, some languages use a decimal point, while others use a decimal comma.
  - Example:
    - English – **1,000.50**
    - Spanish – **1.000,50**
    - French – **1 000,50**
- The percent sign is another critical consideration when translating numbers. Write numbers in the typical format for the corresponding language.
  - Example: **100%**, **100 %**, or **%100**.
- Finally, negative numbers can be displayed differently, depending on the language
  - Example: -100, 100-, (100) or [100].

#### 날짜

- When translating dates, there are several considerations and differences based on the language. These include the date format, separator, capitalization, and leading zeros. There are also differences between full-length and numerical dates.
  - 다양한 날짜 형식 예시:
    - 영국 영어 (dd/mm/yyyy) – 2022년 1월 1일
    - 미국 영어 (mm/dd/yyyy) – 2022년 1월 1일
    - 중국어 (yyyy-mm-dd) – 2022 年 1 月 1 日
    - 프랑스어 (dd/mm/yyyy) – 1er janvier 2022
    - 이탈리아어 (dd/mm/yyyy) – 1º gennaio 2022
    - 독일어 (dd/mm/yyyy) – 1. Januar 2022

#### 통화

- Translating currencies can be challenging due to the different formats, conventions, and conversions. As a general rule, please keep currencies the same as the source. You can add your local currency and conversion in brackets for the reader's benefit.
- 다양한 언어에서 통화를 작성하는 주요 차이점은 기호 위치, 소수점과 소수점의 사용, 공백 및 약어 대 기호입니다.
  - 기호 위치: $100 또는 100$
  - 소수점 대 소수점: 100,50$ 또는 100.50$
  - 공백: 100$ 또는 100 $
  - 약어 대 기호: 100 $ 또는 100 USD

#### 단위

- As a general rule, please keep the units of measure as per the source. You can include the conversion in brackets if your country uses a different system.
- Aside from the localization of units of measure, it is also important to note the differences in how languages approach these units. The main difference is the spacing between the number and unit, which can differ based on the language. Examples of this include 100kB vs. 100 kB or 50ºF vs. 50 ºF.

## 결론

번역할 때 서두르지 마십시오. 천천히 하며 즐기십시오!

Thank you for helping us localize the website and make it accessible to a wider audience. The TON community is global, and we are happy you are a part of it!

<Feedback />

