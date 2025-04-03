# История FunC

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

# Первоначальная версия

Первоначальная версия была создана Telegram, и активная разработка была прекращена после мая 2020 года. Мы называем версию мая 2020 года "начальной".

# Версия 0.1.0

Выпущена в [обновлении 05.2022](https://github.com/ton-blockchain/ton/releases/tag/v2022.05).

В этой версии добавлены:

- [Константы](/v3/documentation/smart-contracts/func/docs/literals_identifiers#constants)
- [Расширенные строковые литералы](/v3/documentation/smart-contracts/func/docs/literals_identifiers#string-literals)
- [Семантическое версионирование](/v3/documentation/smart-contracts/func/docs/compiler_directives#pragma-version)
- [Включения](/v3/documentation/smart-contracts/func/docs/compiler_directives#pragma-version)

Исправлено:

- Исправлены редко проявляющиеся ошибки в Asm.fif.

# Версия 0.2.0

Выпущена в [обновлении 08.2022](https://github.com/ton-blockchain/ton/releases/tag/v2022.08).

В этой версии добавлено:

- Несбалансированные ветви if/else (когда некоторые ветви возвращаются, а некоторые нет)

Исправлено:

- [FunC неправильно обрабатывает циклы while(false) #377](https://github.com/ton-blockchain/ton/issues/377)
- [FunC неправильно генерирует код для ветвей ifelse #374](https://github.com/ton-blockchain/ton/issues/374)
- [FunC неправильно возвращает из условия во встроенных функциях #370](https://github.com/ton-blockchain/ton/issues/370)
- [Asm.fif: разбиение больших функциональных блоков некорректно влияет на встроенные строки #375](https://github.com/ton-blockchain/ton/issues/375)

# Версия 0.3.0

Выпущено в [обновлении 10.2022](https://github.com/ton-blockchain/ton/releases/tag/v2022.10).

В этой версии добавлены:

- [Многострочные asms](/v3/documentation/smart-contracts/func/docs/functions#multiline-asms)
- Разрешено дублирование идентичных определений для констант и asms
- Разрешены побитовые операции с константами для констант

# Версия 0.4.0

Выпущено в [обновлении 01.2023](https://github.com/ton-blockchain/ton/releases/tag/v2023.01).

В этой версии добавлены:

- [Инструкции try/catch](/v3/documentation/smart-contracts/func/docs/statements#try-catch-statements)
- [Функции throw_arg](/v3/documentation/smart-contracts/func/docs/builtins#throwing-exceptions)
- Разрешены модификации и массовое присвоение глобальных переменных: `a~inc()` и `(a, b) = (3, 5)`, где `a` является глобальной

Исправлено:

- Запрещена неоднозначная модификация локальных переменных после их использования в том же выражении: `var x = (ds, ds~load_uint(32), ds~load_unit(64));` запрещены, а `var x = (ds~load_uint(32), ds~load_unit(64), ds);` нет
- Разрешено пустые встроенные функции
- Исправлена ​​редкая ошибка оптимизации `while`
