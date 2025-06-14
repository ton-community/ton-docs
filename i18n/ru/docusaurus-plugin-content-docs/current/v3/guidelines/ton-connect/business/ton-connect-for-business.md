import Feedback from '@site/src/components/Feedback';

# TON Connect for business

TON Connect создан для настройки под потребности бизнеса, предлагая мощные функции, которые привлекают трафик и увеличивают удержание пользователей.

## Особенности продукта

- Безопасная и конфиденциальная аутентификация с контролируемым раскрытием персональных данных
- Произвольное подписание транзакций на TON в рамках одной пользовательской сессии
- Мгновенное соединение между приложениями и кошельками пользователей
- Автоматическая доступность приложений непосредственно в кошельках

## Внедрение TON Connect

### Основные шаги

Для интеграции TON Connect в свои приложения разработчики используют специализированный TON Connect SDK. Этот процесс довольно прост и при необходимости может быть выполнен с использованием соответствующей документации.

TON Connect позволяет пользователям подключать свои приложения к различным кошелькам с помощью QR-кода или универсальной ссылки для подключения. Приложения также можно открывать в кошельке с помощью встроенного расширения для браузера и очень важно следить за обновлениями и новыми функциями TON Connect, которые будут добавлены в будущем.

### Общие примеры внедрения

By using the [TON Connect SDK](https://github.com/ton-connect/sdk), detailed instructions to integrate TON Connect allows developers to:

- Подключать свои приложения к различным типам кошельков TON
- Авторизоваться через соответствующий адрес кошелька
- Отправлять запросы на транзакции и подписывать их в кошельке (принимать запросы)

Чтобы лучше понять возможности этого решения, ознакомьтесь с нашим демо-приложением, доступным на GitHub: [https://github.com/ton-connect/](https://github.com/ton-connect/demo-dapp)

### Текущий поддерживаемый технологический стек:

- Все веб-приложения - бессерверные и серверные
- Мобильные приложения на React-Native
- SDK for mobile applications in Swift, Java, Kotlin

TON Connect is an open protocol and can be used to develop DApps with any programming language or development environment.

For JavaScript (JS) applications, the TON developer community created a JavaScript SDK that allows developers to integrate TON Connect seamlessly in minutes. SDKs designed to operate with additional programming languages will be available in the future.

<Feedback />

