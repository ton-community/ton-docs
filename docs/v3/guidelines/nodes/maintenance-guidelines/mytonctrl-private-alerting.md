# MyTonCtrl Private Alerting Bot

## Overview

MyTonCtrl Private Alerting Bot is a tool that allows you to receive notifications about the status of your node via Telegram Bot. 
The bot can only send notification messages to Telegram, the bot does NOT manage the validator and does not process any commands sent to it.
It is a part of the MyTonCtrl toolset and is available for both validators and liteservers. It requires to create a separate private bot in Telegram and set it up in MyTonCtrl. 
One bot can be used to monitor multiple nodes.

## Setup

To set up the MyTonCtrl Alerting Bot, follow these steps:

### Prepare bot

1. Go to https://t.me/BotFather and create bot using command `/newbot`. After that, you will receive a `BotToken`.
2. Go to your bot and press the `Start` button. This will allow you to receive messages from the bot.
3. Bot can send messages to either private messages or group. If you want to receive messages from the bot in a group (chat) - add the bot to the group.
4. Go to https://t.me/getmyid_bot and press the `Start` button. It will reply you with your `ChatId`, use that if you want to receive messages directly to your Telegram account.
If you want to receive messages in a group, add the bot to the group, and it will reply with the `ChatId` of the group.

### Enable the Alert Bot

1. Enable `alert-bot` via command

    ```bash
    MyTonCtrl> enable_mode alert-bot
    ```
2. Run command

    ```bash
    MyTonCtrl> setup_alert_bot <bot_token> <chat_id>
    ```

If everything is fine you will receive a welcome messages with all possible alerts listed. 


## Supported alerts

The MyTonCtrl Alert Bot supports the following alerts:

- Validator's wallet balance is less than 10 TON
- Node's db usage is more than 80%
- Node's db usage is more than 95%
- Validator had efficiency less than 90% in the validation round
- Node is out of sync on more than 20 sec
- Node is not running (service is down)
- Node is not answering to ADNL connection
- Validator has not created any blocks in the 6 hours
- Validator has been slashed in the previous validation round
- Validator's stake has not been accepted
- Validator's stake has been accepted (info alert with no sound)
- Validator's stake has been returned (info alert with no sound)
- Validator's stake has not been returned
- There is an active network proposal that has many votes (more than 50% of required) but is not voted by the validator

## Enabling and disabling alerts

To enable or disable alerts, use the following commands:

* To enable an alert, use command `enable_alert <alert-name>`.
* To disable an alert, use command `disable_alert <alert-name>`.
* To check the status of alerts, use command `list_alerts`.
* To send test message, use command `test_alert`.

## Disabling the Alert Bot

To disable the Alert Bot, use command

```bash
MyTonCtrl> disable_mode alert-bot
```
