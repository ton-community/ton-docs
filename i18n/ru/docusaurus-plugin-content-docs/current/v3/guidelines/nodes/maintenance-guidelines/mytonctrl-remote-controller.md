# Удаленное управление MyTonCtrl

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

MyTonCtrl и ноду TON можно использовать на отдельных машинах. Есть некоторые преимущества использования этого:

- Для участия в выборах MyTonCtrl требуется закрытый ключ кошелька валидатора. Если сервер узла скомпрометирован, это может привести к несанкционированному доступу к средствам кошелька. В качестве меры безопасности MyTonCtrl может быть размещен на отдельном сервере.
- MyTonCtrl постоянно расширяет свою функциональность, что может потреблять ресурсы, критически важные для узла.
- Вероятно, в будущем крупные валидаторы смогут размещать несколько экземпляров MyTonCtrl, управляющих несколькими узлами на одном сервере.

## Настройка

Подготовьте 2 сервера: один для запуска узла TON, отвечающего требованиям, и один для запуска MyTonCtrl, который не требует много ресурсов.

1. Узел сервера:

Установите MyTonCtrl в режиме `only-node`:

```
wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
sudo bash install.sh -m validator -l
```

Он установит узел TON и создаст файл резервной копии, который вам необходимо загрузить и перенести на сервер контроллера:

```log
...
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start CreateSymlinks fuction
Local DB path: /home/user/.local/share/mytoncore/mytoncore.db
[info]    01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start ConfigureOnlyNode function
[1/2] Copied files to /tmp/mytoncore/backupv2
[2/2] Backup successfully created in mytonctrl_backup_hostname_timestamp.tar.gz!
If you wish to use archive package to migrate node to different machine please make sure to stop validator and mytoncore on donor (this) host prior to migration.
[info]    01.01.2025, 00:00:00.000 (UTC)  <MainThread>  Backup successfully created. Use this file on the controller server with `--only-mtc` flag on installation.
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  Start/restart mytoncore service
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  sleep 1 sec
[5/5] Mytonctrl installation completed
```

Обратите внимание, что у вас все еще есть доступ к консоли MyTonCtrl на этом сервере, которая вам нужна для обновления узла, просмотра метрик узла и т. д.
Кроме того, он создает службу `mytoncore`, которая используется для отправки телеметрии (если она не была отключена).
Если вы хотите вернуть управление узлом этому серверу, используйте команду

```bash
MyTonCtrl> set onlyNode false
systemctl restart mytoncore
```

2. Контроллер сервера

Установите MyTonCtrl в режиме `only-mtc`:

```
wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
sudo bash install.sh -p /home/user/mytonctrl_backup_hostname_timestamp.tar.gz -o
```

Выполните команду `status`, должно появиться поле `IP-адрес узла`:

```log
MyTonCtrl> status
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start GetValidatorWallet function
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start GetLocalWallet function
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start GetWalletFromFile function
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start WalletVersion2Wallet function
[debug]   01.01.2025, 00:00:00.000 (UTC)  <MainThread>  start GetDbSize function
===[ Node status ]===
Node IP address: 0.0.0.0
Validator index: n/a
...
```

## Примечания

При обновлениях вам необходимо `update` и `upgrade` как сервер узла, так и сервер контроллера
