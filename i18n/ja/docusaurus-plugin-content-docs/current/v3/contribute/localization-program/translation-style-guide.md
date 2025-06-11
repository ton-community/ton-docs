import Feedback from '@site/src/components/Feedback';

# Translation style guide

This translation style guide contains essential guidelines, instructions, and tips for translators, helping us localize the website.

This document serves as a general guide and is not specific to any language.

## メッセージの本質を捉える

TONドキュメントのコンテンツを翻訳するときは、直訳を避けてください。

The translations must capture the essence of the message. This approach means rephrasing specific phrases or using descriptive translations instead of translating the content word for word.

Different languages have different grammar rules, conventions, and word order. When translating, please be mindful of structuring sentences in the target languages, and avoid word-for-word translation of the English source, as this can lead to poor sentence structure and readability.

Instead of translating the source text word for word, you should read the entire sentence and adapt it to fit the conventions of the target language.

## フォーマル vs インフォーマル

常にすべての訪問者に対して、丁寧かつ適切でフォーマルな形式を使います。

Using the formal address allows us to avoid sounding unofficial or offensive and works regardless of the reader’s age and gender.

Most Indo-European and Afro-Asiatic languages use gender-specific second-person personal pronouns, distinguishing between males and females. When addressing the user or using possessive pronouns, we can avoid assuming the reader’s gender, as the formal address is generally applicable and consistent, regardless of how they identify.

## Straightforward vocabulary and meaning

私たちの目標は、ウェブサイトのコンテンツをできるだけ多くの人に理解してもらうことです。

In most cases, contributors can achieve this result by using short and simple words that are easily understandable. If multiple possible translations exist for a word in your language with the same meaning, the best option is often the shortest word reflecting the meaning.

## 記述システム

All of the content should be translated using the correct writing system for your language and should not include any words written using Latin characters.

コンテンツを翻訳する際には、翻訳に一貫性があり、ラテン文字が含まれていないことを確認する必要があります。

**Do not translate proper names defined by glossary**

## ページのメタデータの翻訳

Some pages contain metadata, such as 'title', 'lang', 'description', 'sidebar', etc.

When uploading new pages to Crowdin, we hide content that translators should never translate. This feature makes visible to translators in Crowdin only the text that should be translated.

Please be especially careful when translating strings where the source text is 'en'. This represents the language page, which is available and should be translated to the [ISO language code for your language](https://www.andiamo.co.uk/resources/iso-language-codes/). These strings should always be translated using Latin characters, not the writing script, native to the target language.

最も広く使われている言語コードの例:

- 英語 - en
- 中国語 (簡体字) - zh-CN
- ロシア語 - ru
- 韓国語 - ko
- ポーランド語 - pl
- ウクライナ語 - uk

## 外部記事のタイトル

Some strings contain titles of external articles. Most of our developer documentation pages contain links to external articles for further reading. The strings containing article titles need to be translated, regardless of the article's language, to ensure a more consistent user experience for visitors viewing the page in their language.

## Crowdinの警告

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

## 翻訳が確立されていない用語

Some terms might not have established translations in other languages but are widely known by their original English names. Such terms include newer concepts, like proof-of-work, proof-of-stake, Beacon Chain, staking, etc.

While translating these terms can sound unnatural, since the English version is a basis for other languages, it is highly recommended that they be translated.

Feel free to get creative, use descriptive translations, or translate them literally.

Most terms should be translated instead of leaving some in English, as this new terminology will become more widespread as more people start using TON and related technologies. To onboard more people to TON, we must provide understandable terminology in as many languages as possible, even if we need to create it ourselves.

## ボタン & CTA

Do not translate the website's contents, such as buttons.

You may identify button text by viewing the context screenshots connected with most strings or by checking the context in the editor, which includes the phrase ‘’button’’.

Button translations should be as short as possible to prevent formatting mismatches. Additionally, button translations, i.e., presenting a command or request, should be imperative.

## 包括性を踏まえた翻訳

TON docs visitors come from all over the world and from different backgrounds. Therefore, the language on the website should be neutral, welcoming to everyone, and not exclusive.

Gender neutrality is an essential aspect of this. Use the formal address form and avoid gender-specific words in the translations.

Another form of inclusivity is trying to translate for a global audience, not specific to any country, race, or region.

Finally, the language should be suitable for all audiences and ages.

## 言語特有の翻訳

When translating, it is crucial to follow the grammar rules, conventions, and formatting used in your language instead of copying from the source. The source text follows English grammar rules and conventions, which do not apply to many other languages.

You should be aware of the rules for your language and translate accordingly. If you need help, contact us; we will help you with resources on translating elements for your language.

特に留意すべき事例:

### 句読点、書式設定

#### 大文字表記

- 言語によって大文字と小文字には大きな違いがある。
- 英語では、タイトルや名前、月や日、言語名、祝日など、すべての単語を大文字にするのが一般的です。他の多くの言語では、これは文法的に正しくないとされています。 In many other languages, this is grammatically incorrect, as they have different capitalization rules.
- Some languages also have rules about capitalizing personal pronouns, nouns, and adjectives that you shouldn't capitalize in English.

#### 間隔

- Orthography rules define the use of spaces for each language. 正書法の規則では、各言語のスペースの使い方が定義されています。スペースはあらゆる場所で使用されるため、これらの規則は最も明確なもののひとつであり、スペースは最も誤訳されやすい要素のひとつでもあります。
- 英語と他言語でよく見られるスペーシングの違い：
  - Space before units of measure and currencies. Example: USD, EUR, kB, MB
  - Space before degree signs. Example: °C, ℉
  - Space before some punctuation marks, especially the ellipsis. Example: Then… in summary
  - Space before and after slashes. Example: if / else

#### リスト

- Every language has a diverse and complex set of rules for writing lists. These can be significantly different from English.
- In some languages, the first word of each new line needs to be capitalized, while in others, new lines should start with lowercase letters. Many languages also have different rules about capitalization in lists, depending on the length of each line.
- The same applies to the punctuation of line items. The end punctuation in lists can be a period (.), comma (,), or semicolon (;), depending on the language.

#### 引用符

- Languages use many different quotation marks. 言語によって引用符の使い方は様々です。原文から英語の引用符をそのままコピーしても、正しくないことがよくあります。
- 最も一般的な種類の引用符には以下のものがあります:
  - „サンプルテキスト“
  - ‚サンプルテキスト’
  - »サンプルテキスト«
  - “サンプルテキスト”
  - ‘サンプルテキスト’
  - «サンプルテキスト»

#### ハイフンとダッシュ

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

#### 日付

- When translating dates, there are several considerations and differences based on the language. These include the date format, separator, capitalization, and leading zeros. There are also differences between full-length and numerical dates.
  - 異なる日付フォーマットの例:
    - イギリス英語(dd/mm/yyyy) - 1st January, 2022
    - アメリカ英語(mm/dd/yyyy) - January 1st, 2022
    - 中国語(yyyy-mm-dd) - 2022 年 1 月 1 日
    - フランス語(dd/mm/yyyy) - 1er janvier 2022
    - イタリア語(dd/mm/yyyy) - 1o gennaio 2022
    - ドイツ語 (dd/mm/yyyy) – 1. Januar 2022

#### 通貨

- Translating currencies can be challenging due to the different formats, conventions, and conversions. As a general rule, please keep currencies the same as the source. You can add your local currency and conversion in brackets for the reader's benefit.
- 通貨の表記に関する言語間の主な違いは、記号の位置、小数点または小数点にコンマを使用、スペース、および記号または略語での表記があります。
  - 記号の位置: $100または100$
  - 小数点にコンマを使用、または小数点: 100,50$または100.50$
  - スペース: 100$または100 $
  - 記号または略語: 100 $または100 USD

#### 測定単位

- As a general rule, please keep the units of measure as per the source. You can include the conversion in brackets if your country uses a different system.
- Aside from the localization of units of measure, it is also important to note the differences in how languages approach these units. The main difference is the spacing between the number and unit, which can differ based on the language. Examples of this include 100kB vs. 100 kB or 50ºF vs. 50 ºF.

## まとめ

When translating, try not to rush. Take it easy and have fun!

Thank you for helping us localize the website and make it accessible to a wider audience. The TON community is global, and we are happy you are a part of it!

<Feedback />

