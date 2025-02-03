# MyTonCtrl Private Alerting Bot

## Overview

MyTonCtrl Private Alerting Bot is a tool that allows you to receive notifications about the status of your node via Telegram Bot. 
It is a part of the MyTonCtrl toolset and is available for both validators and liteservers. It requires to create a separate private bot in Telegram and set it up in MyTonCtrl. One bot can be used to monitor multiple nodes.

## Setup

To set up the MyTonCtrl Alerting Bot, follow these steps:

### Prepare bot

1. Go to https://t.me/BotFather and create bot using command `/newbot`. After that, you will receive a `BotToken`.
2. Go to your bot and press the `Start` button. This will allow you to receive messages from the bot.
3. If you want to receive messages from the bot in a group (chat), add the bot to the group and give it the necessary rights (make group admin).
4. Go to https://t.me/getmyid_bot and press the `Start` button. It will reply you with your `ChatId`, use that if you want to receive messages directly to your Telegram account.
If you want to receive messages in a group, add the bot to the group, and it will reply with the `ChatId` of the group.

### Enable the Alert Bot

1. Enable `alert-bot` via command

    ```bash
    MyTonCtrl> enable_mode alert-bot
    ```
2. Run command

    ```bash
    MyTonCtrl> set BotToken <BotToken>
    ```
3. Run command

    ```bash
    MyTonCtrl> set ChatId <ChatId>
    ```

4. Check that the bot is able to send messages by running the command

    ```bash
    MyTonCtrl> test_alert
    ``` 
    You should receive a message from the bot in your Telegram account or chat.


## Supported Alerts

The MyTonCtrl Alert Bot supports the following alerts:

* Validator's wallet balance is low
* Node's db usage is more than 80%
* Node's db usage is more than 95%
* Validator had low efficiency in the round
* Node is out of sync
* Node is not running (service is down)
* Node is not answering to ADNL connection
* Validator created zero blocks for past 6 hours
* Validator has been slashed in the previous validation round
* Validator's stake has not been accepted
* Validator's stake has been accepted (info alert with no sound)
* Validator's stake has not been returned
* Validator's stake has been returned (info alert with no sound)
* There is an active network proposal that has many votes but is not voted by the validator

## En(dis)bling Alerts

To enable or disable alerts, use the following commands:

* To enable an alert, use the command `enable_alert <alert-name>`.
* To disable an alert, use the command `disable_alert <alert-name>`.
* To check the status of alerts, use the command `list_alerts`.
