# MyTonCtrl 警报机器人

## 概述

MyTonCtrl Alert Bot 是一款允许您通过 Telegram Bot 接收节点状态通知的工具。
它是 MyTonCtrl 工具集的一部分，适用于验证器和点对点服务器。

## 设置

要设置 MyTonCtrl Alerting Bot，请按照以下步骤操作：

### 准备机器人

1. 访问 https://t.me/BotFather，使用 `/newbot`命令创建机器人。之后，你将收到一个 `BotToken`。
2. 访问您的机器人并按下 `Start` 按钮。这样您就可以从机器人接收信息了。
3. 如果想在群组（聊天）中接收机器人的消息，请将机器人添加到群组，并赋予其必要的权限（设置群组管理员）。
4. 访问 https://t.me/getmyid_bot 并按下 "Start"（开始）按钮。它会用你的 `ChatId` 回复你，如果你想直接通过你的 Telegram 账户接收消息，就用这个 `ChatId`。
   如果你想在群组中接收消息，将机器人添加到群组，它就会用群组的 `ChatId` 回复你。

### 启用警报机器人

1. 通过命令启用 `警报机器人`

   ```bash
   MyTonCtrl> enable_mode alert-bot
   ```

2. 运行命令

   ```bash
   MyTonCtrl> set BotToken <BotToken>
   ```

3. 运行命令

   ```bash
   MyTonCtrl> set ChatId <ChatId>
   ```

4. 运行命令检查机器人是否能发送信息

   ```bash
   MyTonCtrl> test_alert
   ```

   你的 Telegram 账户或聊天工具中应该会收到一条来自机器人的信息。

## 支持的警报

MyTonCtrl Alert Bot 支持以下警报：

- 验证器钱包余额不足
- 节点的数据库使用率超过 80
- 节点的数据库使用率超过 95
- 验证器在本轮中效率较低
- 节点不同步
- 节点不运行（服务中断）
- 节点未应答 ADNL 连接
- 验证器在过去 6 小时内创建了 0 个区块
- 验证器在上一轮验证中被削减

## 环境（破坏）警报

要启用或禁用警报，请使用以下命令：

- 要启用警报，请使用命令 `enable_alert<alert-name>`。
- 要禁用警报，请使用 `disable_alert<alert-name>` 命令。
- 要查看警报状态，请使用命令 `list_alerts`。
