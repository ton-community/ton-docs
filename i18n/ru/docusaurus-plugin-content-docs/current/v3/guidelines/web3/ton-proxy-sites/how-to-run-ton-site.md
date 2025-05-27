# Как создавать TON Sites

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## 👋 Введение

[TON-сайты](https://blog.ton.org/ton-sites) работают почти как обычные сайты, за исключением их установки. Для их запуска требуется несколько дополнительных действий. В этом уроке я покажу вам, как это сделать.

## 🖥 Запуск TON-сайта

Установите [Tonutils Reverse Proxy](https://github.com/tonutils/reverse-proxy), чтобы использовать TON Proxy для вашего сайта.

### Установка на любой дистрибутив Linux

##### Скачивание

```bash
wget https://github.com/ton-utils/reverse-proxy/releases/latest/download/tonutils-reverse-proxy-linux-amd64
chmod +x tonutils-reverse-proxy-linux-amd64
```

##### Запуск

Запустите конфигурацию домена и выполните следующие действия:

```
./tonutils-reverse-proxy-linux-amd64 --domain your-domain.ton 
```

Отсканируйте QR-код из вашего терминала с помощью Tonkeeper, Tonhub или любого другого кошелька, выполните транзакцию. Ваш домен будет привязан к вашему сайту.

###### Запуск без домена

Кроме того, вы можете запускать сайт в простом режиме с доменом .adnl, если у вас нет домена .ton или .t.me:

```
./tonutils-reverse-proxy-linux-amd64
```

##### Использование

Теперь любой может открыть ваш TON-сайт, используя ADNL-адрес или домен.

Если вы хотите изменить некоторые настройки, например, URL прокси-пасса, откройте файл `config.json`, отредактируйте его и перезапустите прокси. По умолчанию URL прокси-пасса – `http://127.0.0.1:80/`

Прокси добавляет дополнительные заголовки:
`X-Adnl-Ip` – ip клиента, и `X-Adnl-Id` – adnl id клиента

### Установка на любую другую ОС

Соберите проект из исходников и запустите так же, как в шаге 2 для Linux. Для сборки требуется среда языка Go.

```bash
git clone https://github.com/tonutils/reverse-proxy.git
cd reverse-proxy
make build
```

Сборка для других операционных систем выполняется командой `make all`

## 👀 Дальнейшие шаги

### 🔍 Проверка доступности сайта

После выполнения всех шагов выбранного вами метода TON Proxy должен был запуститься. Если все прошло успешно, ваш сайт будет доступен по адресу ADNL, полученному на соответствующем шаге.

Вы можете проверить доступность сайта, открыв этот адрес с доменом `.adnl`. Также обратите внимание, что для того, чтобы сайт открылся, в вашем браузере должен быть запущен TON Proxy, например, через расширение [MyTonWallet](https://mytonwallet.io/).

## 📌 Материалы

- [Сайты TON, TON WWW и TON Proxy](https://blog.ton.org/ton-sites)
- [Tonutils Reverse Proxy](https://github.com/tonutils/reverse-proxy)
- Авторы: [Андрей Бурносов](https://github.com/AndreyBurnosov) (TG: [@AndrewBurnosov](https://t.me/AndreyBurnosov)), [Даниил Седов](https://gusarich.com) (TG: [@sedov](https://t.me/sedov)), [Георгий Имедашвили](https://github.com/drforse)

## См. также

- [Запустить реализацию на C++](/v3/guidelines/web3/ton-proxy-sites/running-your-own-ton-proxy)
