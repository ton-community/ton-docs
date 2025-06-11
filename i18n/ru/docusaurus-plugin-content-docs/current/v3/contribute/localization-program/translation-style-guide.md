import Feedback from '@site/src/components/Feedback';

# Руководство по стилю перевода

This translation style guide contains essential guidelines, instructions, and tips for translators, helping us localize the website.

This document serves as a general guide and is not specific to any language.

## Передача сути сообщения

При переводе содержимого документов TON избегайте дословных переводов.

The translations must capture the essence of the message. This approach means rephrasing specific phrases or using descriptive translations instead of translating the content word for word.

Different languages have different grammar rules, conventions, and word order. When translating, please be mindful of structuring sentences in the target languages, and avoid word-for-word translation of the English source, as this can lead to poor sentence structure and readability.

Instead of translating the source text word for word, you should read the entire sentence and adapt it to fit the conventions of the target language.

## Официальное и неформальное обращение

Мы используем официальную форму обращения, которая всегда вежлива и подходит всем посетителям.

Using the formal address allows us to avoid sounding unofficial or offensive and works regardless of the reader’s age and gender.

Most Indo-European and Afro-Asiatic languages use gender-specific second-person personal pronouns, distinguishing between males and females. When addressing the user or using possessive pronouns, we can avoid assuming the reader’s gender, as the formal address is generally applicable and consistent, regardless of how they identify.

## Straightforward vocabulary and meaning

Наша цель — сделать контент на сайте понятным как можно большему количеству людей.

In most cases, contributors can achieve this result by using short and simple words that are easily understandable. If multiple possible translations exist for a word in your language with the same meaning, the best option is often the shortest word reflecting the meaning.

## Система письма

All of the content should be translated using the correct writing system for your language and should not include any words written using Latin characters.

При переводе контента вы должны убедиться, что переводы являются единообразными и не включают латинские символы.

**Do not translate proper names defined by glossary**

## Перевод метаданных страницы

Some pages contain metadata, such as 'title', 'lang', 'description', 'sidebar', etc.

When uploading new pages to Crowdin, we hide content that translators should never translate. This feature makes visible to translators in Crowdin only the text that should be translated.

Please be especially careful when translating strings where the source text is 'en'. This represents the language page, which is available and should be translated to the [ISO language code for your language](https://www.andiamo.co.uk/resources/iso-language-codes/). These strings should always be translated using Latin characters, not the writing script, native to the target language.

Несколько примеров языковых кодов для наиболее распространенных языков:

- Английский - en
- Китайский упрощенный - zh-CN
- Русский - ru
- Корейский - ko
- Польский - pl
- Украинский - uk

## Заголовки внешних статей

Some strings contain titles of external articles. Most of our developer documentation pages contain links to external articles for further reading. The strings containing article titles need to be translated, regardless of the article's language, to ensure a more consistent user experience for visitors viewing the page in their language.

## Предупреждения Crowdin

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

## Термины без устоявшихся переводов

Some terms might not have established translations in other languages but are widely known by their original English names. Such terms include newer concepts, like proof-of-work, proof-of-stake, Beacon Chain, staking, etc.

While translating these terms can sound unnatural, since the English version is a basis for other languages, it is highly recommended that they be translated.

Feel free to get creative, use descriptive translations, or translate them literally.

Most terms should be translated instead of leaving some in English, as this new terminology will become more widespread as more people start using TON and related technologies. To onboard more people to TON, we must provide understandable terminology in as many languages as possible, even if we need to create it ourselves.

## Кнопки и призывы к действию (CTA)

Do not translate the website's contents, such as buttons.

You may identify button text by viewing the context screenshots connected with most strings or by checking the context in the editor, which includes the phrase ‘’button’’.

Button translations should be as short as possible to prevent formatting mismatches. Additionally, button translations, i.e., presenting a command or request, should be imperative.

## Translating for inclusivity

TON docs visitors come from all over the world and from different backgrounds. Therefore, the language on the website should be neutral, welcoming to everyone, and not exclusive.

Gender neutrality is an essential aspect of this. Use the formal address form and avoid gender-specific words in the translations.

Another form of inclusivity is trying to translate for a global audience, not specific to any country, race, or region.

Наконец, язык должен подходить для всех аудиторий и возрастов.

## Переводы на разные языки

When translating, it is crucial to follow the grammar rules, conventions, and formatting used in your language instead of copying from the source. The source text follows English grammar rules and conventions, which do not apply to many other languages.

You should be aware of the rules for your language and translate accordingly. If you need help, contact us; we will help you with resources on translating elements for your language.

Некоторые примеры того, на что следует обратить особое внимание:

### Пунктуация, форматирование

#### Заглавные буквы

- Существуют огромные различия в написании заглавных букв в разных языках.
- В английском языке принято писать все слова с заглавной буквы в названиях и именах, месяцах и днях, названиях языков, праздниках и т. д. Во многих других языках это грамматически неправильно, так как у них разные правила написания заглавных букв.
- Some languages also have rules about capitalizing personal pronouns, nouns, and adjectives that you shouldn't capitalize in English.

#### Интервалы

- Правила орфографии определяют использование пробелов для каждого языка. Поскольку пробелы используются везде, эти правила являются одними из самых четких, а пробелы являются одними из самых неправильно переводимых элементов.
- Некоторые общие различия в интервалах между английским и другими языками:
  - Space before units of measure and currencies. Example: USD, EUR, kB, MB
  - Space before degree signs. Example: °C, ℉
  - Space before some punctuation marks, especially the ellipsis. Example: Then… in summary
  - Space before and after slashes. Example: if / else

#### Списки

- Every language has a diverse and complex set of rules for writing lists. These can be significantly different from English.
- In some languages, the first word of each new line needs to be capitalized, while in others, new lines should start with lowercase letters. Many languages also have different rules about capitalization in lists, depending on the length of each line.
- The same applies to the punctuation of line items. The end punctuation in lists can be a period (.), comma (,), or semicolon (;), depending on the language.

#### Quotation marks

- В разных языках используется много разных кавычек. Простое копирование английских кавычек из источника часто неправильно.
- Некоторые из наиболее распространенных типов кавычек:
  - „Пример текста“
  - ‚Пример текста’
  - »Пример текста«
  - “Пример текста”
  - ‘Пример текста’
  - «Пример текста»

#### Дефисы и тире

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

#### Даты

- When translating dates, there are several considerations and differences based on the language. These include the date format, separator, capitalization, and leading zeros. There are also differences between full-length and numerical dates.
  - Некоторые примеры различных форматов дат:
    - Английский (Великобритания) (dd/mm/yyyy) – 1st January, 2022
    - Английский (США) (mm/dd/yyyy) – January 1st, 2022
    - Китайский (yyyy-mm-dd) – 2022 年 1 月 1 日
    - Французский (dd/mm/yyyy) – 1er janvier 2022
    - Итальянский (dd/mm/yyyy) – 1º gennaio 2022
    - Немецкий язык (dd/mm/yyyy) – 1. Januar 2022

#### Валюты

- Translating currencies can be challenging due to the different formats, conventions, and conversions. As a general rule, please keep currencies the same as the source. You can add your local currency and conversion in brackets for the reader's benefit.
- Основные различия в написании валют на разных языках включают размещение символов, десятичные запятые и десятичные точки, интервалы и сокращения и символы.
  - Размещение символов: $100 или 100$
  - Десятичные запятые и десятичные точки: 100,50$ или 100.50$
  - Интервалы: 100$ или 100 $
  - Сокращения и символы: 100 $ или 100 USD

#### Единицы измерения

- As a general rule, please keep the units of measure as per the source. You can include the conversion in brackets if your country uses a different system.
- Aside from the localization of units of measure, it is also important to note the differences in how languages approach these units. The main difference is the spacing between the number and unit, which can differ based on the language. Examples of this include 100kB vs. 100 kB or 50ºF vs. 50 ºF.

## Заключение

При переводе старайтесь не торопиться. Не торопитесь и получайте удовольствие!

Thank you for helping us localize the website and make it accessible to a wider audience. The TON community is global, and we are happy you are a part of it!

<Feedback />

