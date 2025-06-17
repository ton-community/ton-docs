import Feedback from '@site/src/components/Feedback';

# Частный бот уведомлений MyTonCtrl

## Overview

Частный бот уведомлений MyTonCtrl — это инструмент, который позволяет вам получать уведомления о состоянии вашего узла через бота Telegram.

The bot is designed to send notification messages to Telegram only. It **does not** manage the validator or process any commands.

Он является частью набора инструментов MyTonCtrl и доступен как для валидаторов, так и для liteserver. Для этого требуется создать отдельный частный бот в Telegram и настроить его в MyTonCtrl.

Один бот может использоваться для мониторинга нескольких узлов.

## Настройка

Чтобы настроить бота оповещений MyTonCtrl, выполните следующие действия:

### 1. Подготовка бота

1. Перейдите на https://t.me/BotFather и создайте бота с помощью команды `/newbot`. После этого вы получите `BotToken`.

2. Перейдите к своему боту и нажмите кнопку `Start`. Это позволит вам получать сообщения от бота.

3. The bot can send messages to either private messages or groups. Если вы хотите получать сообщения в группе, добавьте бота в группу, и он ответит с `ChatId` группы.

4. Перейдите по адресу https://t.me/getmyid_bot и нажмите кнопку `Start`. Он ответит вам с вашим `ChatId`, используйте его, если хотите получать сообщения напрямую на свой аккаунт Telegram.

Если вы хотите получать сообщения от бота в группе (чате), добавьте бота в группу и дайте ему необходимые права (сделайте администратором группы).

### Включить бота оповещений

1. Включите `alert-bot` с помощью команды

    ```bash
    MyTonCtrl> enable_mode alert-bot
    ```

2. Включите команду

    ```bash
    Вы должны получить сообщение от бота в своем аккаунте Telegram или чате.
    ```

If you configure everything correctly, you will receive a welcome message listing all available alerts.

## Поддерживаемые оповещения

Бот оповещений MyTonCtrl поддерживает следующие оповещения:

- The validator's wallet balance is less than 10 Toncoins.

- Использование базы данных узла превышает 80%

- Использование базы данных узла превышает 95%

- The validator's efficiency is less than 90% in the validation round.

- The node is out of sync by more than 20 seconds.

- Узел не запущен (служба не работает)

- Узел не отвечает на ADNL-соединение

- За последние 6 часов валидатор не создал ни одного блока

- The validator has been slashed in the previous validation round.

- Стейк валидатора не принят

- Стейк валидатора принят (информационное оповещение без звука)

- Стейк валидатора возвращен (информационное оповещение без звука)

- The validator's stake has not been returned.

- Существует активное предложение в сети, которое набрало много голосов, но не было одобрено валидатором

## Включение(отключение) оповещений

Чтобы включить или отключить оповещения, используйте следующие команды:

- Включите команду
    ```bash
    MyTonCtrl> set ChatId <ChatId>
    ```
- Чтобы отключить оповещение, используйте команду `disable_alert <alert-name>`.
    ```bash
    Чтобы включить оповещение, используйте команду `enable_alert <alert-name>`.
    ```
- Чтобы проверить статус оповещений, используйте команду `list_alerts`.
    ```bash
    MyTonCtrl> list_alerts
    ```
- To send a test message, use the command:
    ```bash
    MyTonCtrl> test_alert
    ```
- Проверьте, может ли бот отправлять сообщения, выполнив команду
    ```bash
    MyTonCtrl> set BotToken <BotToken>
    ```

<Feedback />

