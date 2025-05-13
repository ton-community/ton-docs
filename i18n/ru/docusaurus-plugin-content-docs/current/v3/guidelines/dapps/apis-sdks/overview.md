# Обзор

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Цель этого статьи - помочь вам выбрать правильные инструменты для разработки приложений в экосистеме TON.

## Разработка TMA

- Используйте [Mini Apps SDKs](/v3/guidelines/dapps/tma/overview#mini-apps-sdks) для разработки [Мини приложений Telegram](/v3/guidelines/dapps/tma/overview).
- Выберите [SDK, базирующийся на JS/TS](/v3/guidelines/dapps/apis-sdks/sdk#typescript--javascript) для взаимодействия с блокчейном TON.

## Разработка DApps

- Используйте Tolk, FunC или Tact [языки программирования](/v3/documentation/smart-contracts/overview#programming-languages), если требуется разработка умных контрактов на блокчейне TON для вашего [DApp](/v3/guidelines/dapps/overview).
- Чтобы взаимодействовать с блокчейном TON и обрабатывать его данные, выберите один из перечисленных [SDK](/v3/guidelines/dapps/apis-sdks/sdk). Одними из самых популярных языков для этого назначения:
    - [JS/TS](/v3/guidelines/dapps/apis-sdks/sdk#typescript--javascript)
    - [Go](/v3/guidelines/dapps/apis-sdks/sdk#go)
    - [Python](/v3/guidelines/dapps/apis-sdks/sdk#python)
- Чтобы интегрировать аутентификацию пользователей с их кошельками TON (включая логику обработки платежей) в ваш DApp, используйте [TON Connect](/v3/guidelines/ton-connect/overview).

## Аналитика данных TON

Довольно часто разработчикам необходимо выполнять аналитические запросы поверх данных on-chain: например, для отслеживания исторических изменений и агрегирования данных из нескольких аккаунтов.
Блокчейны не предназначены для такого рода рабочей нагрузки, и необходимо построить конвейер индексации и запустить аналитические запросы off-chain. Создание таких конвейеров
с нуля может быть ресурсоемким, поэтому можно использовать одну из следующих альтернатив:

- Dune Analytics содержит набор таблиц с данными TON: необработанные транзакции и сообщения, события с жетонами и сделки на DEX. Dune позволяет создавать пользовательские диаграммы и панели мониторинга, получать результаты запросов через API и настраивать оповещения. Перед началом написания запросов, пожалуйста, ознакомьтесь с этим руководством для получения рекомендаций, советов и трюков.
- Интеграция Dune основана на базе общедоступного хранилища данных проекта [ton-etl](https://github.com/re-doubt/ton-etl/blob/main/datalake/README.md). Это конвейер анализа и декодирования, который загружает необработанные и декодированные данные в контейнер S3 **s3://ton-blockchain-public-datalake/v1/** в формате AVRO. Контейнер общедоступный, и каждый может использовать его с такими инструментами, как [Amazon Athena](https://aws.amazon.com/athena/) (см. [DDL](https://github.com/re-doubt/ton-etl/blob/main/datalake/athena_ddl.sql)) или Apache Spark. Данные обновляются ежедневно.
- Если вам необходимо отслеживать данные в цепочке практически в режиме реального времени, вы можете запустить свой собственный [Узел Ton](/v3/documentation/infra/nodes/node-types) и запустить [ton-etl](https://github.com/re-doubt/ton-etl/blob/main/README.md) или [ton-index-worker](https://github.com/toncenter/ton-index-worker).
- [chainbase](https://docs.chainbase.com/catalog/Ton/Overview) поставляется с набором необработанных и декодированных таблиц с данными TON. Позволяет выполнять SQL-запросы и получать результаты через API.

## Состояние инфраструктуры

- [status.toncenter](https://status.toncenter.com/) - различная статистика активности узлов за последний час.
- [Tonstat.us](https://tonstat.us/) - Графана в реальном времени, обновляется каждые 5 минут.

## См. также

- [SDK](/v3/guidelines/dapps/apis-sdks/sdk)
- [Руководства по разработке TMA](/v3/guidelines/dapps/tma/tutorials/step-by-step-guide)
- [Руководства по TON Connect](/v3/guidelines/ton-connect/guidelines/how-ton-connect-works)
- [Обработка платежей](/v3/guidelines/dapps/asset-processing/payments-processing)
