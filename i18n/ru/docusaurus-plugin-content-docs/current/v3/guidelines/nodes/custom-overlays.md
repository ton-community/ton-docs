import Feedback from '@site/src/components/Feedback';

# Custom overlays

Узлы TON взаимодействуют друг с другом, формируя подсети, называемые _оверлеями_. A few common overlay nodes participate, such as public overlays for each shard. Validators also participate in general validator overlays and overlays for specific validator sets.

Nodes can also be configured to join custom overlays for two primary purposes: broadcasting external messages and broadcasting block candidates.

Участие в пользовательских оверлеях позволяет избежать неопределенности публичных оверлеев и повысить надежность доставки и сократить задержки.

Каждый пользовательский оверлей имеет строго определенный список участников с заранее заданными правами, в частности право на отправку внешних сообщений и блоков. Конфигурация оверлея должна быть одинаковой на всех участвующих узлах.

Если у вас под контролем несколько узлов, целесообразно объединить их в пользовательский оверлей, где все валидаторы смогут отправлять кандидатов на блок, а все LS смогут отправлять внешние сообщения. Таким образом, LS будет синхронизироваться быстрее, в то время как скорость доставки внешних сообщений будет выше (и доставка в целом более надежной). Обратите внимание, что дополнительный оверлей вызывает дополнительную нагрузку на трафик сети.

## Пользовательские оверлеи по умолчанию

Mytonctrl использует пользовательские оверлеи по умолчанию, доступные по адресу https://ton-blockchain.github.io/fallback_custom_overlays.json. Этот оверлей используется нечасто и предназначен для экстренной ситуации при проблемах с подключением к публичному оверлею.

If you wish to stop participating in default custom overlays, please run the following commands:

```bash
MyTonCtrl> set useDefaultCustomOverlays false
MyTonCtrl> delete_custom_overlay default
```

## Creating a custom overlay

### Сборка adnl адреса

Чтобы добавить валидаторы в пользовательский оверлей, вы можете использовать либо их `fullnode adnl id`, доступный с помощью `validator-console -c getconfig`, либо `validator adnl id`, который можно найти в статусе mytonctrl.

Чтобы добавить liteservers в пользовательский оверлей, вы должны использовать их `fullnode adnl id`.

### Создание файла конфигурации

Создайте файл конфигурации в формате:

```json
{
    "adnl_address_hex_1": {
        "msg_sender": true,
        "msg_sender_priority": 1
    },
    "adnl_address_hex_2": {
        "msg_sender": false
    },

    "adnl_address_hex_2": {
        "block_sender": true
    },
  ...
}
```

`msg_sender_priority` определяет порядок включения внешних сообщений в блоки: сначала обрабатываются сообщения из источников более высокого приоритета. Сообщения из публичного оверлея и локального LS имеют приоритет 0.

:::caution
**Обратите внимание, что все узлы, перечисленные в конфигурации, должны участвовать в оверлее (другими словами, им нужно добавить оверлей с точно такой же конфигурацией), в противном случае связь будет плохой, а трансляции прекратятся**
:::

Существует специальное слово `@validators` для создания динамического пользовательского оверлея, который mytonctrl будет автоматически генерировать в каждом раунде, добавляя всех текущих валидаторов.

### Добавление пользовательского оверлея

Используйте команду mytonctrl для добавления пользовательского оверлея:

```bash
MyTonCtrl> add_custom_overlay <name> <path_to_config>
```

:::caution
Обратите внимание, что имя и файл конфигурации должны быть одинаковыми для всех участников оверлея. Проверьте, что оверлей был создан с помощью команды mytonctrl `list_custom_overlays`.
:::

### Debug

Вы можете установить уровень детализации узла равным 4 и отфильтровать логи с помощью ключевого слова "CustomOverlay".

## Deleting a custom overlay

Удаление пользовательского оверлея

Если оверлей является динамическим (т. е. в конфигурации есть слово `@validators`), он будет удален через минуту, иначе удаление произойдет немедленно.

Чтобы убедиться, что узел удалил пользовательский оверлей, выполните команды `list_custom_overlays` mytonctrl и `showcustomoverlays` validator-console.

## Low level

Список команд validator-console для работы с пользовательскими оверлеями:

- `addcustomoverlay <path_to_config>` - добавить пользовательский оверлей на локальный узел. Обратите внимание, что эта конфигурация должна быть в формате отличном от конфигурации для mytonctrl:

    ```json
    {
      "name": "OverlayName",
      "nodes": [
        {
          "adnl_id": "adnl_address_b64_1",
          "msg_sender": true,
          "msg_sender_priority": 1
        },
        {
          "adnl_id": "adnl_address_b64_2",
          "msg_sender": false
        }, ...
      ]
    }
    ```

- `delcustomoverlay <name>` - удалить пользовательский оверлей из узла.

- `showcustomoverlays` - показать список пользовательских оверлеев, о которых знает узел.

<Feedback />

