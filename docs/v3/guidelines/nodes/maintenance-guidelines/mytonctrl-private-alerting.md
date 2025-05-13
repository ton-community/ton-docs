import Feedback from '@site/src/components/Feedback';

# MyTonCtrl private alerting bot

## Overview

**MyTonCtrl Private Alerting Bot** is a tool for receiving notifications about your node's status via Telegram Bot.

The bot is designed to send notification messages to Telegram only. It **does not** manage the validator or process any commands.

This bot is part of the MyTonCtrl toolset and is compatible with both validators and liteservers. To utilize it, you must create a separate private bot in Telegram and configure it within MyTonCtrl.

You can use one bot to monitor multiple nodes.

## Setup

To set up the MyTonCtrl Alerting Bot, follow these steps:

### 1. Prepare your bot

1. Visit [@BotFather](https://t.me/BotFather) and create a bot by using the command `/newbot`. After completing this step, you will receive a `BotToken`.

2. Go to your bot and press the `Start` button. This action will enable you to receive messages from the bot.

3. The bot can send messages to either private messages or groups. If you want to receive messages from the bot in a group chat, make sure to add the bot to that group.

4. Visit [@getmyid_bot]([https://t.me/getmyid_bot](https://t.me/getmyid_bot)) and press the **Start** button. The bot will reply with your `ChatId`; you can use this ID if you wish to receive messages directly to your Telegram account.

If you want to receive messages in a group, add the bot to the group, and it will provide you with the group's `ChatId`.

### Activating the alert bot on MyTonCtrl

1. Enable the `alert-bot` using the following command:

	```bash
	MyTonCtrl> enable_mode alert-bot
	```

2. Execute the command:

	```bash
	MyTonCtrl> setup_alert_bot <bot_token> <chat_id>
	```

If you configure everything correctly, you will receive a welcome message listing all available alerts.

## Supported Alerts

The MyTonCtrl Alert Bot supports the following alerts:

- The validator's wallet balance is less than 10 Toncoins.
  
- The node's database usage exceeds 80%.

- The node's database usage exceeds 95%.

- The validator's efficiency is less than 90% in the validation round.

- The node is out of sync by more than 20 seconds.

- The node is not running (service is down).

- The node is unresponsive to ADNL connections.

- The validator has not created any blocks in the past 6 hours.

- The validator has been slashed in the previous validation round.

- The validator's stake has not been accepted.

- The validator's stake has been accepted (info alert with no sound).

- The validator's stake has been returned (info alert with no sound).

- The validator's stake has not been returned.

- There is an active network proposal that has received more than 50% of the required votes, but the validator has not voted on it.
 
## Enabling and disabling alerts

To enable or disable alerts, use the following commands:

*  To enable an alert, use the command 
	```bash
	MyTonCtrl> enable_alert <alert-name>
	```
*  To disable an alert, use the command :
	```bash
	MyTonCtrl> disable_alert <alert-name>
	```
*  To check the status of alerts, use the command:
 	```bash
	MyTonCtrl> list_alerts
	```
* To send a test message, use the command:
	```bash
	MyTonCtrl> test_alert
	```
* To disable the Alert Bot, use the command: 
	```bash
	MyTonCtrl> disable_mode  alert-bot
	```
<Feedback />

