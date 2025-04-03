# Запуск MyTonCtrl в Docker

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Требования к аппаратному обеспечению:

- 16-ядерный процессор
- 128 ГБ оперативной памяти
- Твердотельный накопитель объемом 9 ТБ *или* Оборудованное хранилище с более 64 000 операций ввода/вывода в секунду (IOPS)
- Подключение к сети со скоростью 1 Гбит/с
- Общедоступный IP-адрес (фиксированный IP-адрес)
- 16 ТБ/месяц трафика при пиковой нагрузке

***Не рекомендуется!*** ***Только для тестирования!***

Переменная **IGNORE_MINIMAL_REQS=true** отключает проверку требований к процессору/оперативной памяти.

## Требования к программному обеспечению:

- docker-ce
- docker-ce-cli
- containerd.io
- docker-buildx-plugin
- docker-compose-plugin

  *Руководство по установке на официальном сайте [Docker](https://docs.docker.com/engine/install/)*

## Протестированные операционные системы:

- Ubuntu 20.04
- Ubuntu 22.04
- Ubuntu 24.04
- Debian 11
- Debian 12

## Запустите MyTonCtrl v2 с помощью официального образа docker:

- Извлеките образ и запустите узел с помощью MyTonCtrl

````bash
docker run -d --name ton-node -v <YOUR_LOCAL_FOLDER>:/var/ton-work -it ghcr.io/ton-blockchain/ton-docker-ctrl:latest


## Install and start MyTonCtrl from sources:

1. Clone the last version of the repository
```bash
git clone https://github.com/ton-blockchain/ton-docker-ctrl.git
````

2. Перейдите в каталог

```bash
cd ./ton-docker-ctrl
```

3. Укажите необходимые значения в файле .env

```bash
vi .env
```

4. Начните сборку образа docker. Этот шаг включает в себя компиляцию последних версий fift, validator-engine, lite-client и других инструментов, а также установку и первичную настройку MyTonCtrl.

```bash
docker compose build ton-node
```

5. Начало MyTonCtrl

```bash
docker compose up -d
```

## Перенесите полный узел или валидатор на докеризованную версию MyTonCtrl v2

Укажите пути к бинарным файлам и исходному коду TON, а также к рабочему каталогу, но самое главное, к настройкам MyTonCtrl и кошелькам.

```bash
docker run -d --name ton-node --restart always \
-v <EXISTING_TON_WORK_FOLDER>:/var/ton-work \
-v /usr/bin/ton:/usr/bin/ton \
-v /usr/src/ton:/usr/src/ton \
-v /home/<USER>/.local/share:/usr/local/bin \
ghcr.io/ton-blockchain/ton-docker-ctrl:latest
```

## Настройка переменных:

Переменные, указанные в файле .env

- **GLOBAL_CONFIG_URL** - Сетевые настройки блокчейна TON (по умолчанию: [Testnet](https://ton.org/testnet-global.config.json))
- **MYTONCTRL_VERSION** - ветка Git, из которой собран MyTonCtrl
- **TELEMETRY** - Включение/выключение телеметрии
- **MODE** - Установите MyTonCtrl в указанный режим (validator или liteserver)
- **IGNORE_MINIMAL_REQS** - Игнорировать требования к оборудованию

## Остановка и удаление MyTonCtrl:

1. Остановить контейнер

```bash
docker compose stop
```

2. Удалить контейнер

```bash
docker compose down
```

3. Удалить контейнер с данными

```bash
docker compose down --volumes
```

## Подключение к MyTonCtrl:

```bash
docker compose exec -it ton-node bash -c "mytonctrl"
```

Сразу после подключения можно проверить состояние с помощью команды `status`

```bash
MyTonCtrl> status
```

![](https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/screens/mytonctrl-status.png)

Отражает список доступных команд `help`.

```bash
MyTonCtrl> help
```

## Просмотр логов MyTonCtrl:

```bash
docker compose logs
```

## Обновление MyTonCtrl и TON:

Чтобы получить последние версии TON validator и MyTonCtrl, нужно перейти в каталог с файлом docker-compose.yml и выполнить сборку

```bash
cd ./ton-docker-ctrl
docker compose build ton-node
```

После завершения снова запустите Docker Compose

```bash
docker compose up -d
```

При подключении к MyTonCtrl выполняется автоматическая проверка на наличие обновлений. Если обновления обнаружены, отображается сообщение "*MyTonCtrl update available. Please update it with `update` command.*"

Обновление выполняется с помощью команды update, указав необходимую ветвь

```bash
MyTonCtrl> update mytonctrl2
```

## Изменение пути хранения данных:

По умолчанию TON и Mytoncore работают и хранятся в каталоге **/var/lib/docker/volumes/**

Вы можете изменить его в файле docker-compose.yml, указав требуемый путь в разделе **volumes**
