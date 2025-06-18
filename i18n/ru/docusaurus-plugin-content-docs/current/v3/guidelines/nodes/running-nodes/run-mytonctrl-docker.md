import Feedback from '@site/src/components/Feedback';

# Запуск MyTonCtrl в Docker

This guide provides a step-by-step process for installing MyTonCtrl using Docker.

## Требования к аппаратному обеспечению:

To ensure an optimal experience while running MyTonCtrl, here are the recommended hardware specifications:

- 16-ядерный процессор
- 128 ГБ оперативной памяти
- 1TB NVME SSD or provisioned 64+k IOPS storage
- Подключение к сети со скоростью 1 Гбит/с
- Общедоступный IP-адрес (фиксированный IP-адрес)
- 16 ТБ/месяц трафика при пиковой нагрузке

:::warning
This setup is primarily intended for testing purposes, so it may not be suitable for production environments. If you’d like to bypass hardware checks for any reason, you can easily do this by setting the variable `IGNORE_MINIMAL_REQS=true`.
:::

## Требования к программному обеспечению:

To get started, please ensure you have the following software installed:

- docker-ce
- docker-ce-cli
- containerd.io
- docker-buildx-plugin
- docker-compose-plugin

_Руководство по установке на официальном сайте [Docker](https://docs.docker.com/engine/install/)_

## Протестированные операционные системы:

We’ve successfully tested MyTonCtrl on these operating systems:

- Ubuntu 20.04
- Ubuntu 22.04
- Ubuntu 24.04
- Debian 11
- Debian 12

## Запустите MyTonCtrl v2 с помощью официального образа docker:

Here’s how you can pull the image and set up your MyTonCtrl node:

```bash
По умолчанию TON и Mytoncore работают и хранятся в каталоге **/var/lib/docker/volumes/**
```

## Installing and starting MyTonCtrl from source

If you prefer to install from source, just follow these easy steps:

1. Clone the repository with the latest version:

````bash
docker run -d --name ton-node -v <YOUR_LOCAL_FOLDER>:/var/ton-work -it ghcr.io/ton-blockchain/ton-docker-ctrl:latest


## Install and start MyTonCtrl from sources:

1. Clone the last version of the repository
```bash
git clone https://github.com/ton-blockchain/ton-docker-ctrl.git
````

2. Change into the project directory:

```bash
cd ./ton-docker-ctrl
```

3. Open the `.env` file and make any necessary updates:

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

## Вы можете изменить его в файле docker-compose.yml, указав требуемый путь в разделе **volumes**

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

In the `.env` file, you can configure the following variables:

- **GLOBAL_CONFIG_URL** - Сетевые настройки блокчейна TON (по умолчанию: [Testnet](https://ton.org/testnet-global.config.json))
- **MYTONCTRL_VERSION** - ветка Git, из которой собран MyTonCtrl
- **TELEMETRY** - Включение/выключение телеметрии
- **MODE** - Установите MyTonCtrl в указанный режим (validator или liteserver)
- **IGNORE_MINIMAL_REQS** - Игнорировать требования к оборудованию

## Остановка и удаление MyTonCtrl:

Перенесите полный узел или валидатор на докеризованную версию MyTonCtrl v2

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

Извлеките образ и запустите узел с помощью MyTonCtrl

```bash
docker compose exec -it ton-node bash -c "mytonctrl"
```

Сразу после подключения можно проверить состояние с помощью команды `status`

```bash
MyTonCtrl> status
```

![](https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/screens/mytonctrl-status.png)

And if you would like to see a list of commands you can use, simply enter:

```bash
MyTonCtrl> help
```

## Просмотр логов MyTonCtrl:

Monitoring the situation is simple, as you can easily view the logs:

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

При подключении к MyTonCtrl выполняется автоматическая проверка на наличие обновлений. Если обновления обнаружены, отображается сообщение "_MyTonCtrl update available. Please update it with `update` command._"  Обновление выполняется с помощью команды update, указав необходимую ветвь

```bash
MyTonCtrl> update mytonctrl2
```

## Изменение пути хранения данных:

TON and MyTonCore data is stored in `/var/lib/docker/volumes/`by default. If you wish to change this storage path, update the required route in the `volumes` section of your `docker-compose.yml` file to fit your needs. <Feedback />

