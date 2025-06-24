import Feedback from '@site/src/components/Feedback';

# Запустите собственный TON-прокси

Цель этого документа - дать краткое представление о TON Sites, которые представляют собой веб-сайты, доступные через TON Network. TON Sites могут использоваться как удобная точка входа в другие TON Services. В частности, HTML-страницы, загружаемые с TON Sites, могут содержать ссылки на URI `ton://...`, представляющие платежи, которые пользователь может выполнить, нажав на ссылку, при условии, что на устройстве пользователя установлен кошелек TON. When clicked, these links can trigger actions like making a payment, provided the user has a TON Wallet installed on their device.

From a technical standpoint, TON Sites function similarly to standard websites. С технической точки зрения TON Sites очень похожи на стандартные веб-сайты, но доступ к ним осуществляется не через Интернет, а через [TON Network](/v3/concepts/dive-into-ton/ton-blockchain/ton-networking) (это оверлейная сеть внутри Интернета). Instead of using standard IPv4 or IPv6 addresses, TON Sites are addressed via [ADNL](/v3/documentation/network/protocols/adnl/overview) addresses. Более конкретно, они используют [ADNL](/v3/documentation/network/protocols/adnl/overview) адрес (вместо более привычных адресов IPv4 или IPv6), и принимают HTTP-запросы через протокол [RLDP](/v3/documentation/network/protocols/rldp) (высокоуровневый протокол, построенный на основе ADNL, основного протокола TON Network) вместо обычного TCP/IP.
Все шифрование обрабатывается ADNL, поэтому нет необходимости использовать HTTPS (т.е. TLS), если прокси-вход размещен локально на устройстве пользователя.

Для доступа к существующим сайтам и создания новых TON Sites необходимы специальные шлюзы между "обычным" интернетом и TON Network. In practice, this involves:

- Скачайте **generate-random-id** с [TON Auto Builds](https://github.com/ton-blockchain/ton/releases/latest).
- По сути, доступ к TON Sites осуществляется с помощью HTTP->RLDP прокси, работающего локально на устройстве клиента, а их создание происходит с помощью обратного RLDP->HTTP-прокси, работающего на удаленном веб-сервере.

[Подробнее о TON Sites, WWW и прокси](https://blog.ton.org/ton-sites)

## Запуск прокси-входа

Чтобы получить доступ к существующим TON Sites, вам нужно запустить на своем компьютере RLDP-HTTP Proxy.

1. Download the proxy.

  You can either:

  - Загрузите **rldp-http-proxy** с [TON Auto Builds](https://github.com/ton-blockchain/ton/releases/latest).

  or

  - Или Вы можете скомпилировать **rldp-http-proxy** самостоятельно, следуя этим [инструкциям](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#rldp-http-proxy).

2. [Скачать](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config) глобальную конфигурацию TON.

  Запустите **rldp-http-proxy**

   ```bash
   rldp-http-proxy/rldp-http-proxy -p 8080 -c 3333 -C global.config.json
   ```

  Here’s what the parameters mean:

- Ваш прокси-вход будет доступен по HTTP на `localhost`, порт `8080`.
- `3333`: UDP port used for outbound and inbound RLDP and ADNL communication — connecting to TON Sites via the TON Network.
- `global.config.json` — это имя файла глобальной конфигурации TON.

Если вы все сделали правильно, прокси не завершит свою работу и будет продолжать работать в терминале. Теперь его можно использовать для доступа к TON Sites.

Когда он больше не нужен, вы можете завершить его работу, нажав `Ctrl-C`, или просто закрыв окно терминала.

## Запуск прокси-входа на удаленном компьютере

1. Download the proxy.

You can either:

- Загрузите **rldp-http-proxy** с [TON Auto Builds](https://github.com/ton-blockchain/ton/releases/latest).

  or
- Или вы можете скомпилировать **rldp-http-proxy** самостоятельно, следуя этим [инструкциям](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#rldp-http-proxy).

2. [Скачать](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config) глобальную конфигурацию TON.

3. Download **generate-random-id** from [TON auto builds](https://github.com/ton-blockchain/ton/releases/latest).
  Or you can compile the **generate-random-id** yourself by following these [instructions](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#generate-random-id).

4. Создайте постоянный ANDL-адрес для вашего сервера

   ```bash
   mkdir keyring
   utils/generate-random-id -m adnlid
   ```

  This outputs something like:

   ```
   45061C1D4EC44A937D0318589E13C73D151D1CEF5D3C0E53AFBCF56A6C2FE2BD vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3
   ```

  Это ваш недавно сгенерированный постоянный ADNL-адрес в шестнадцатеричном и удобном для пользователя формате. Соответствующий приватный ключ сохранен в файл `45061...2DB` в текущей директории. Переместите ключ в директорию keyring

   ```bash
   mv 45061C1* keyring/
   ```

5. Запустите **rldp-http-proxy**

   ```
   rldp-http-proxy/rldp-http-proxy -p 8080 -a <your_public_ip>:3333 -C global.config.json -A <your_adnl_address>
   ```

  где `<your_public_ip>` - это ваш публичный IPv4-адрес, а `<your_adnl_address>` - это ADNL-адрес, сгенерированный в предыдущем шаге.

  **Example**

   ```
   rldp-http-proxy/rldp-http-proxy -p 8080 -a 777.777.777.777:3333 -C global.config.json -A vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3
   ```

  - В приведенном выше примере `8080` — это TCP-порт, который будет слушать localhost для входящих HTTP-запросов, а `3333` — это UDP-порт, который будет использоваться для всех исходящих и входящих действий RLDP и ADNL (т.е. для подключения к TON Sites через TON Network).
  - `3333`: UDP port used for RLDP/ADNL activity — connecting to TON Sites via the TON Network.
  - `global.config.json` — это имя файла глобальной конфигурации TON.

The proxy will stay running in the terminal if everything is configured correctly. Теперь его можно использовать для доступа к TON Sites.

Когда он больше не нужен, вы можете завершить его работу, нажав `Ctrl-C`, или просто закрыв окно терминала.

## Запуск TON Site

Теперь предположим, что у вас на компьютере запущен экземпляр RLDP-HTTP Proxy, который слушает `localhost:8080` для входящих TCP-соединений, как объяснялось [выше] (#running-an-entry-proxy-on-a-remote-computer).

Простой тест, чтобы убедиться, что все работает правильно, можно выполнить с помощью таких программ, как `curl` или `wget`. Например,

```
curl -x 127.0.0.1:8080 http://just-for-test.ton
```

пытается загрузить главную страницу (TON) Site `just-for-test.ton`, используя прокси на `127.0.0.1:8080`. Если прокси запущен и работает, вы увидите что-то похожее

```html

<html>
<head>
<title>TON Site</title>
</head>
<body>
<h1>TON Proxy Works!</h1>
</body>
</html>

```

You can also use the ADNL address directly with a fake `.adnl` domain. For example:

```bash
curl -x 127.0.0.1:8080 http://utoljjye6y4ixazesjofidlkrhyiakiwrmes3m5hthlc6ie2h72gllt.adnl/
```

в настоящее время загружает ту же веб-страницу TON.

В качестве альтернативы вы можете настроить `localhost:8080` в качестве HTTP-прокси в вашем браузере. Например, если вы используете Firefox, перейдите в [Настройки] -> Общие -> Настройки сети -> Настройки -> Настроить доступ через прокси -> Ручная настройка прокси, и введите "127.0.0.1" в поле "HTTP-прокси" и "8080" в поле "Порт".

1. Go to **Settings → General → Network Settings → Settings → Configure Proxy Access → Manual Proxy configuration**.
2. Enter the following:
  - Или вы можете скомпилировать **generate-random-id** самостоятельно, следуя этим [инструкциям](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#generate-random-id).
  - **Port:** 8080

Once the proxy is configured, you can visit TON Sites directly by entering their URLs in the browser's address bar. For example:

- `http://just-for-test.ton`
- `http://utoljjye6y4ixazesjofidlkrhyiakiwrmes3m5hthlc6ie2h72gllt.adnl/`

You can interact with these TON Sites just like regular websites.

## Доступ к TON Sites

:::tip Туториал найден!
Want to create your own TON Site? (/v3/guidelines/web3/ton-proxy-sites/how-to-run-ton-site)
:::

Большинству людей нужно просто получить доступ к существующим TON Sites, а не создавать новые.
Однако если вы хотите создать такой сайт, вам нужно запустить RLDP-HTTP Proxy на своем сервере вместе с обычным программным обеспечением веб-сервера, таким как Apache или Nginx.

- Если все работает правильно, RLDP-HTTP прокси будет принимать входящие HTTP-запросы из TON Network через RLDP/ADNL, работающий на UDP-порту 3333 (конечно, вы можете использовать любой другой UDP-порт, если хотите) по IPv4-адресу `<your-server-ip>` (в частности, если вы используете брандмауэр, не забудьте разрешить `rldp-http-proxy` получать и отправлять UDP-пакеты с этого порта), и он будет пересылать эти HTTP-запросы, адресованные всем хостам (если вы хотите пересылать только определенным хостам, измените `-L '*'` на `-L <your hostname>`), на TCP-порт `80` по адресу `127.0.0.1` (т.е. на ваш обычный веб-сервер).
- Use standard web server software such as Apache or Nginx.

We assume that you already know how to set up a regular website and that:

- После того, как вы настроили `localhost:8080` в качестве HTTP-прокси, который будет использоваться в вашем браузере, вы можете просто ввести нужный URI, например, `http://just-for-test.ton` или `http://utoljjye6y4ixazesjofidlkrhyiakiwrmes3m5hthlc6ie2h72gllt.adnl/`, в адресной строке вашего браузера и взаимодействовать с TON Site так же, как и с обычными веб-сайтами.
- Ваш прокси-вход будет доступен по HTTP на `<your_public_ip>`, порт `8080`.
- Мы предполагаем, что вы уже знаете, как создать обычный веб-сайт и что вы уже настроили его на своем сервере, принимающем входящие HTTP-соединения на TCP-порт `<your-server-ip>:80`, а также указали требуемое доменное имя TON Network (например, `example.ton`) как основное доменное имя или алиас для вашего веб-сайта в конфигурации веб-сервера.

1. Download the proxy.

You can either:

- Загрузите **rldp-http-proxy** с [TON Auto Builds](https://github.com/ton-blockchain/ton/releases/latest).

  or
- Или вы можете скомпилировать **rldp-http-proxy** самостоятельно, следуя этим [инструкциям](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#rldp-http-proxy).

2. [Скачать](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config) глобальную конфигурацию TON.

3. Download **generate-random-id** from [TON auto builds](https://github.com/ton-blockchain/ton/releases/latest).
  Or you can compile the **generate-random-id** yourself by following these [instructions](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#generate-random-id).

4. Создайте постоянный ANDL-адрес для вашего прокси-входа

   ```bash
   mkdir keyring
   
   utils/generate-random-id -m adnlid
   ```

  This outputs something like:

   ```bash
   45061C1D4EC44A937D0318589E13C73D151D1CEF5D3C0E53AFBCF56A6C2FE2BD vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3
   ```

  Это ваш недавно сгенерированный постоянный ADNL-адрес в шестнадцатеричном и удобном для пользователя формате. Соответствующий приватный ключ сохранен в файл `45061...2DB` в текущей директории. Переместите ключ в директорию keyring

   ```bash
   mv 45061C1* keyring/
   ```

5. Убедитесь, что ваш веб-сервер принимает HTTP-запросы с доменами `.ton` и `.adnl`.

  **Example for Nginx:**

  Пример:

  Например, если вы используете nginx с конфигурацией `server_name example.com;`, вам нужно изменить ее на `server_name _;` или `server_name example.com example.ton vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3.adnl;`.

6. Запустите прокси в обратном режиме

   ```bash
   rldp-http-proxy/rldp-http-proxy -a <your-server-ip>:3333 -L '*' -C global.config.json -A <your-adnl-address> -d -l <log-file>
   ```

  where:

  - где `<your_public_ip>` - это публичный IPv4-адрес вашего сервера, а `<your_adnl_address>` - это ADNL-адрес, сгенерированный в предыдущем шаге.
  - Или вы можете скомпилировать **generate-random-id** самостоятельно, следуя этим [инструкциям](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#generate-random-id).

Если вы хотите, чтобы ваш TON Site работал постоянно, вам нужно использовать параметры `-d` и `-l <log-file>`.

**Example**

 ```bash
 rldp-http-proxy/rldp-http-proxy -a 777.777.777.777:3333 -L '*' -C global.config.json -A vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3 -d -l tonsite.log
 ```

If everything is configured correctly, the RLDP-HTTP proxy will:

- Accept incoming HTTP queries from the TON Network via RLDP/ADNL.
- Run on UDP port 3333 of your server’s IPv4 address `<your-server-ip>`.
- Forward these HTTP queries to `127.0.0.1:80`, which is your local web server.

You can use a different UDP port. Just make sure to allow `rldp-http-proxy` to receive and send UDP packets through your firewall on that port.
If you want to forward queries only for specific hosts, replace `-L '*'` with `-L <your-hostname>`.

Вы также можете получить доступ к TON Sites через их ADNL-адреса, используя поддельный домен `<adnl-addr>.adnl`

**Example**

```
http://vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3.adnl
```

Вы можете посетить TON Site `http://<your-adnl-address>.adnl` (`http://vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3.adnl` в данном примере) из браузера, запущенного на клиентской машине, как описано в разделе "Доступ к TON Sites", и проверить, действительно ли ваш TON Site доступен для публики.

**Optional: register a TON DNS domain**

If you’d like to make your TON Site accessible via a human-readable domain like `example.ton`, you can:

- Если хотите, вы можете [зарегистрировать](/v3/guidelines/web3/ton-proxy-sites/site-and-domain-management) домен TON DNS, например, 'example.ton', и создать для этого домена запись `site`, указывающую на постоянный ADNL-адрес вашего TON Site.
- Скачайте **generate-random-id** с [TON Auto Builds](https://github.com/ton-blockchain/ton/releases/latest).

Тогда RLDP-HTTP прокси, работающие в режиме клиента, будут распознавать http://example.ton, как указывающий на ваш ADNL-адрес, и предоставлять доступ к вашему TON Site.

**Optional: run a reverse proxy on a separate server**

Вы также можете запустить обратный прокси на отдельном сервере и установить ваш веб-сервер в качестве удаленного адреса. В этом случае используйте `-R '*'@<YOUR_WEB_SERVER_HTTP_IP>:<YOUR_WEB_SERVER_HTTP_PORT>` вместо `-L '*'`.

```
-R '*'@<YOUR_WEB_SERVER_HTTP_IP>:<YOUR_WEB_SERVER_HTTP_PORT>
```

**Example**

```bash
rldp-http-proxy/rldp-http-proxy -a 777.777.777.777:3333 -R '*'@333.333.333.333:80 -C global.config.json -A vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3 -d -l tonsite.log
```

В этом случае ваш обычный веб-сервер должен быть доступен на `http://333.333.333.333:80` (этот IP не будет открыт для внешнего доступа).

### Рекомендации

Поскольку анонимность будет доступна только в TON Proxy 2.0, если вы не хотите раскрывать IP-адрес своего веб-сервера, вы можете сделать это двумя способами:

- Запустите обратный прокси на отдельном сервере с флагом `-R`, как описано выше.
- Создайте дублирующий сервер с копией вашего сайта и запустите обратный прокси локально.

<Feedback />

