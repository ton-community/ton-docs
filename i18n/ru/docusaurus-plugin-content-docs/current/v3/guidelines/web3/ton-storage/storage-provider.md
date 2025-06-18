import Feedback from '@site/src/components/Feedback';

# Провайдер хранилища

_Провайдер хранилища_ — это сервис, который хранит файлы за комиссию.

## Binaries

Вы можете загрузить двоичные файлы `storage-daemon` и `storage-daemon-cli` для Linux/Windows/macOS из [TON Auto Builds](https://github.com/ton-blockchain/ton/releases/latest).

## Компилляция из исходного кода

Вы можете скомпилировать `storage-daemon` и `storage-damon-cli` из исходников, используя эту [инструкцию](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#storage-daemon).

## Основные понятия

A storage provider consists of:

- Он состоит из смарт-контракта, который принимает запросы на хранение и управляет платежами от клиентов, а также приложения, которое загружает и обслуживает файлы для клиентов.
- A daemon application that uploads and serves files to clients.

The process works as follows:

1. Владелец провайдера запускает `storage-daemon`, развертывает основной смарт-контракт и настраивает параметры. Адрес контракта передается потенциальным клиентам.

2. Используя `storage-daemon`, клиент создает Bag из своих файлов и отправляет специальное внутреннее сообщение в смарт-контракт провайдера.

3. Смарт-контракт провайдера создает контракт хранения для обработки этого конкретного Bag.

4. Провайдер, обнаружив запрос в блокчейне, загружает Bag и активирует контракт хранения.

5. Затем клиент может перевести оплату за хранение на контракт хранения. Чтобы получить оплату, провайдер регулярно представляет контракт с доказательством того, что он все еще хранит Bag.

6. Если средства на контракте хранения заканчиваются, контракт считается неактивным, и поставщику больше не требуется хранить Bag. Клиент может либо пополнить контракт, либо получить свои файлы.

:::info
Клиент также может получить свои файлы в любое время, предоставив доказательство права собственности на контракт хранения. Затем контракт передаст файлы клиенту и деактивируется.
:::

## Смарт-контракт

[Исходный код смарт-контракта](https://github.com/ton-blockchain/ton/tree/master/storage/storage-daemon/smartcont).

## Использование провайдера клиентами

Чтобы использовать провайдера хранения, вам необходимо знать адрес его смарт-контракта. Клиент может получить параметры провайдера с помощью следующей команды в `storage-daemon-cli`:

```
get-provider-params <address>
```

### Параметры провайдера:

- Принимаются ли новые контракты на хранение.
- Минимальный и максимальный размер _Bag_ (в байтах).
- Ставка — стоимость хранения. Указывается в nanoTON за мегабайт в день.
- Максимальный объем — как часто провайдер должен предоставлять доказательства хранения _Bag_.

The output includes the following parameters:

- Провайдер может добровольно закрыть контракт.
- Двоичные файлы
- Вы можете сделать это из `storage-daemon-cli`:
- Просмотреть параметры можно с помощью `get-provider-info`, а изменить их с помощью:

### Запрос на хранение

Вам необходимо создать _Bag_ и сгенерировать сообщение с помощью следующей команды:

```
new-contract-message <BagID> <file> --query-id 0 --provider <address>
```

### Notes

- Выполнение этой команды может занять некоторое время для больших _Bag_.
- The generated message body, not the full internal message, is saved to `<file>`.
- Query ID can be any integer from `0` to `2^64 - 1`.
- Сообщение содержит параметры провайдера (скорость и максимальный диапазон). These values are displayed after execution and should be reviewed before sending.
- If the provider updates their parameters before the message is submitted, it will be rejected. This ensures that the storage contract is created under the client's agreed-upon conditions.

Затем клиент должен отправить сообщение с этим телом на адрес провайдера. В случае ошибки сообщение вернется к отправителю (возврат). В противном случае будет создан новый контракт на хранение, и клиент получит от него сообщение с [`op=0xbf7bd0c1`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/constants.fc#L3) и тем же идентификатором запроса.

На этом этапе контракт еще не активен. Как только поставщик загрузит _Bag_, он активирует контракт на хранение, и клиент получит сообщение с [`op=0xd4caedcd`](https://github.com/SpyCheese/ton/blob/tonstorage/storage/storage-daemon/smartcont/constants.fc#L4) (также из контракта на хранение).

#### Перевод

Контракт на хранение имеет `клиентский баланс` — это средства, которые клиент перевел на контракт и которые еще не были выплачены поставщику. Средства постепенно списываются с этого баланса (по ставке, равной ставке за мегабайт в день).

- Первоначальный баланс — это то, что клиент перевел с запросом на создание контракта хранения.
- The client can top up the contract anytime by making transfers to the storage contract — this can be done from any wallet address.
- Оставшийся баланс клиента возвращается get методом [`get_storage_contract_data`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/storage-contract.fc#L222) в качестве второго значения (`balance`). It is returned as the second value: `balance`.

### Contract closure

:::info
В случае закрытия контракта хранения клиент получает сообщение с остатком баланса и [`op=0xb6236d63`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/constants.fc#L6).
:::

Контракт может быть закрыт в следующих случаях:

- Сразу после создания, перед активацией, если провайдер отказывается принять контракт (превышен лимит провайдера или другие ошибки).
- Баланс клиента достигает 0.
- Voluntarily by the provider.
- Клиент может добровольно закрыть контракт, отправив сообщение с [`op=0x79f937ea`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/constants.fc#L2) со своего адреса и любого идентификатора запроса.

## Запуск и настройка провайдера

Провайдер хранилища является частью `storage-daemon` и управляется `storage-daemon-cli`. `storage-daemon` необходимо запустить с флагом `-P`.

### Создание основного смарт-контракта

To deploy the provider’s smart contract from `storage-daemon-cli`, run:

```
deploy-provider
```

:::info ВАЖНО!
Для инициализации провайдера вам будет предложено отправить на указанный адрес сообщение с 1 TON, которое не подлежит возврату. Вы можете проверить, что контракт был создан, с помощью команды `get-provider-info`.
:::

По умолчанию контракт настроен на то, чтобы не принимать новые контракты на хранение. Перед его активацией вам необходимо настроить провайдера. Настройки провайдера состоят из конфигурации (хранящейся в `storage-daemon`) и параметров контракта (хранящихся в блокчейне).

### Конфигурация:

The provider configuration includes:

- `max contract` - максимальное количество контрактов на хранение, которые могут существовать одновременно.
- В каждом контракте хранения указаны балансы `Client$` и `Contract$`; разницу между ними можно вывести на основной контракт провайдера с помощью команды `withdraw <address>`.

To view the current configuration:

```
get-provider-info
```

To update the configuration:

```
set-provider-config --max-contracts 100 --max-total-size 100000000000
```

### Параметры контракта:

- `accept` - нужно ли принимать новые контракты на хранение.
- `max file size`, `min file size` - ограничения по размеру для одного _Bag_.
- `rate` - стоимость хранения (указывается в nanoTON за мегабайт в день).
- `max span` - как часто провайдер должен будет предоставлять доказательства хранения.

To view the current parameters:

```
get-provider-info
```

To update the parameters:

```
set-provider-params --accept 1 --rate 1000000000 --max-span 86400 --min-file-size 1024 --max-file-size 1000000000
```

Примечание: в команде `set-provider-params` можно указать только часть параметров. Остальные будут взяты из текущих параметров. Поскольку данные в блокчейне не обновляются мгновенно, несколько последовательных команд `set-provider-params` могут привести к неожиданным результатам.

Рекомендуется изначально положить на баланс провайдера более 1 TON, чтобы было достаточно средств для покрытия комиссий за работу с контрактами хранения. Однако не отправляйте слишком много TON с первым невозвратным сообщением.

После установки параметра `accept` в `1` смарт-контракт начнет принимать запросы от клиентов и создавать контракты хранения, а демон хранения автоматически их обработает: загрузит и распределит _Bag_, сгенерирует доказательства хранения.

- The provider begins accepting client requests once the `accept` parameter is set to `1` and creates storage contracts. The storage daemon will automatically:
- Download and distribute **bags**.
- Generate and submit storage proofs.

## Дальнейшая работа с провайдером

### Список существующих контрактов хранения

To list all active storage contracts and their balances:

```
get-provider-info --contracts --balances
```

Each contract displays:

- `Client$`: funds provided by the client.
- `Contract$`: total funds in the contract.

The difference between these values represents the provider’s earnings, which can be withdrawn using `withdraw <address>`.

Команда `withdraw-all` выведет средства со всех контрактов, у которых доступно не менее `1 TON`.

Любой контракт хранения можно закрыть с помощью команды `close-contract <address>`.

Closing a contract automatically transfers available funds to the main provider contract. То же самое произойдет автоматически, когда баланс клиента закончится. Файлы _Bag_ в этом случае будут удалены (если нет других контрактов, использующих тот же _Bag_).

### Transfer

Вы можете перевести средства с основного смарт-контракта на любой адрес (сумма указывается в nanoTON):

```
send-coins <address> <amount>
send-coins <address> <amount> --message "Some message"
```

:::info
Все _Bag_, хранящиеся у провайдера, доступны с помощью команды `list` и могут использоваться как обычно. Чтобы не нарушать работу провайдера, не удаляйте их и не используйте этот демон хранилища для работы с другими _Bag_.
:::

<Feedback />

