import Feedback from '@site/src/components/Feedback';

# 运行自己的 TON 代理

This document briefly introduces TON Sites — websites accessed through the TON Network. TON Sites can serve as convenient entry points to other TON Services. 本文档旨在简要地介绍TON网站，即通过TON网络访问的网站。TON网站可以方便地作为进入其他TON服务的入口。特别是，从TON网站下载的HTML页面可能包含指向`ton://...` URI的链接，用户点击这些链接后，如果用户设备上安装了TON钱包，就可以执行支付操作。 When clicked, these links can trigger actions like making a payment, provided the user has a TON Wallet installed on their device.

From a technical standpoint, TON Sites function similarly to standard websites. Still, they are accessed via the [TON Network](/v3/concepts/dive-into-ton/ton-blockchain/ton-networking) — an overlay network that operates within the Internet — rather than directly through the Internet itself. Instead of using standard IPv4 or IPv6 addresses, TON Sites are addressed via [ADNL](/v3/documentation/network/protocols/adnl/overview) addresses. They receive HTTP queries over the [RLDP](/v3/documentation/network/protocols/rldp) protocol, a high-level RPC protocol built on top of ADNL, the TON Network's primary protocol, instead of the usual TCP/IP.
Since encryption is handled at the ADNL level, there’s no need for HTTPS (TLS), mainly when the entry proxy is hosted locally on the user's device.

A gateway between the "ordinary" Internet and the TON Network is required to access existing sites or create new TON Sites. In practice, this involves:

- A HTTP → RLDP proxy running locally on the client's machine to access TON Sites.
- A reverse RLDP → HTTP proxy running on a remote web server to serve your content through the TON Network.

[了解更多关于TON网站、WWW和代理的信息](https://blog.ton.org/ton-sites)

## 运行入口代理

为了访问现有的TON网站，你需要在你的电脑上运行一个RLDP-HTTP代理。

1. Download the proxy.

  You can either:

  - 从 [TON Auto Builds](https://github.com/ton-blockchain/ton/releases/latest) 下载 **rldp-http-proxy** 。

  or

  - 或者你可以按照这个[指示](/develop/howto/compile#rldp-http-proxy)自己编译**rldp-http-proxy**。

2. [下载](/develop/howto/compile#download-global-config)TON全局配置。

  运行**rldp-http-proxy**

   ```bash
   rldp-http-proxy/rldp-http-proxy -p 8080 -c 3333 -C global.config.json
   ```

  Here’s what the parameters mean:

- `8080`: TCP port on localhost where the proxy listens for incoming HTTP requests.
- `3333`: UDP port used for outbound and inbound RLDP and ADNL communication — connecting to TON Sites via the TON Network.
- `global.config.json`: path to the global TON config file.

The proxy will continue running in your terminal if everything is set up correctly. You can now access TON Sites through: `http://localhost:8080`.

To stop the proxy, press `Ctrl+C` or close the terminal window.

## 在远程计算机上运行入口代理

1. Download the proxy.

You can either:

- 从[TON自动构建](https://github.com/ton-blockchain/ton/releases/latest)下载**rldp-http-proxy**。

  or
- 或者你可以按照这些[指示](/develop/howto/compile#rldp-http-proxy)自己编译**rldp-http-proxy**。

2. [下载](/develop/howto/compile#download-global-config)TON全局配置。

3. 从[TON自动构建](https://github.com/ton-blockchain/ton/releases/latest)下载**generate-random-id**。
  或者你可以按照这些[指示](/develop/howto/compile#generate-random-id)自己编译**generate-random-id**。

4. 为你的入口代理生成一个持久的ANDL地址

   ```bash
   mkdir keyring
   utils/generate-random-id -m adnlid
   ```

  This outputs something like:

   ```
   45061C1D4EC44A937D0318589E13C73D151D1CEF5D3C0E53AFBCF56A6C2FE2BD vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3
   ```

  This is your newly generated persistent ADNL address in hexadecimal and user-friendly form. The corresponding private key is saved into file `45061...2DB` in the current directory. Move the key into the keyring directory.

   ```bash
   mv 45061C1* keyring/
   ```

5. 运行**rldp-http-proxy**

   ```
   rldp-http-proxy/rldp-http-proxy -p 8080 -a <your_public_ip>:3333 -C global.config.json -A <your_adnl_address>
   ```

  其中`<your_public_ip>`是你的公共IPv4地址，`<your_adnl_address>`是在上一步中生成的ADNL地址。

  **Example**

   ```
   rldp-http-proxy/rldp-http-proxy -p 8080 -a 777.777.777.777:3333 -C global.config.json -A vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3
   ```

  - `8080`: TCP port to listen for incoming HTTP queries on localhost.
  - `3333`: UDP port used for RLDP/ADNL activity — connecting to TON Sites via the TON Network.
  - `global.config.json`: Path to the global TON configuration file.

The proxy will stay running in the terminal if everything is configured correctly. You can now access TON Sites through: `http://<your_public_ip>:8080`.

To stop the proxy, press `Ctrl+C` or close the terminal window.

## 访问TON网站

现在假设你在电脑上运行了一个RLDP-HTTP代理的实例，并且正在`localhost:8080`上监听传入的TCP连接，如[上面](#running-entry-proxy)所解释的。

使用诸如`curl`或`wget`之类的程序进行简单测试以确认一切正常运行是可行的。例如， For example,

```
curl -x 127.0.0.1:8080 http://just-for-test.ton
```

尝试使用代理`127.0.0.1:8080`下载(TON)站点`just-for-test.ton`的主页。如果代理正常运行，你将看到类似于 If the proxy is running correctly, you'll see output similar to the following:

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

你还可以通过使用假域名`<adnl-addr>.adnl`通过它们的ADNL地址访问TON网站 For example:

```bash
curl -x 127.0.0.1:8080 http://utoljjye6y4ixazesjofidlkrhyiakiwrmes3m5hthlc6ie2h72gllt.adnl/
```

目前获取的是同一个TON网页。

Alternatively, you can configure your browser to use `localhost:8080` as an HTTP proxy. For example, in Firefox:

1. Go to **Settings → General → Network Settings → Settings → Configure Proxy Access → Manual Proxy configuration**.
2. Enter the following:
  - 或者，你可以在浏览器中将`localhost:8080`设置为HTTP代理。例如，如果你使用Firefox，请访问[设置] -> 通用 -> 网络设置 -> 设置 -> 配置代理访问 -> 手动代理配置，并在“HTTP代理”字段中输入“127.0.0.1”，在“端口”字段中输入“8080”。
  - **Port:** 8080

Once the proxy is configured, you can visit TON Sites directly by entering their URLs in the browser's address bar. For example:

- `http://just-for-test.ton`
- `http://utoljjye6y4ixazesjofidlkrhyiakiwrmes3m5hthlc6ie2h72gllt.adnl/`

You can interact with these TON Sites just like regular websites.

## 运行TON网站

:::tip 教程找到了！
Want to create your own TON Site? This is a [beginner-friendly guide](/v3/guidelines/web3/ton-proxy-sites/how-to-run-ton-site).
:::

大多数人只需要访问现有的TON网站，而不是创建新的。然而，如果你想创建一个，你需要在你的服务器上运行RLDP-HTTP代理，以及像Apache或Nginx这样的常规Web服务器软件。
However, if you want to host your TON Site, you need to:

- 如果一切正常工作，RLDP-HTTP代理将接受来自TON网络的传入HTTP查询，通过运行在UDP端口3333的IPv4地址`<your-server-ip>`（特别是，如果你使用防火墙，请不要忘记允许`rldp-http-proxy`从该端口接收和发送UDP数据包）的RLDP/ADNL，它将把这些HTTP查询转发到所有主机（如果你只想转发特定主机，请将`-L '*'`更改为`-L <your hostname>`）的`127.0.0.1`TCP端口`80`（即你的常规Web服务器）。
- Use standard web server software such as Apache or Nginx.

We assume that you already know how to set up a regular website and that:

- 你的入口代理将通过HTTP在`<your_public_ip>`端口`8080`上可用。
- 你的入口代理将通过HTTP在`localhost`端口`8080`上可用。
- 我们假设您已经知道如何建立一个普通网站，并且已经在服务器上配置了一个网站，接受 TCP 端口 `<your-server-ip>:80` 的 HTTP 连接，并在网络服务器配置中定义了所需的 TON 网络域名（例如 `example.ton`）作为网站的主域名或别名。

1. Download the proxy.

You can either:

- 从[TON自动构建](https://github.com/ton-blockchain/ton/releases/latest)下载**rldp-http-proxy**。

  or
- 或者你可以按照这些[指示](/develop/howto/compile#rldp-http-proxy)自己编译**rldp-http-proxy**。

2. [下载](/develop/howto/compile#download-global-config)TON全局配置。

3. 从[TON自动构建](https://github.com/ton-blockchain/ton/releases/latest)下载**generate-random-id**。
  或者你可以按照这些[指示](/develop/howto/compile#generate-random-id)自己编译**generate-random-id**。

4. 你还可以在一个单独的服务器上运行反向代理，并将你的Web服务器设置为远程地址。在这种情况下，请使用`-R '*'@<YOUR_WEB_SERVER_HTTP_IP>:<YOUR_WEB_SERVER_HTTP_PORT>`替代`-L '*'`。

   ```bash
   mkdir keyring
   
   utils/generate-random-id -m adnlid
   ```

  This outputs something like:

   ```bash
   45061C1D4EC44A937D0318589E13C73D151D1CEF5D3C0E53AFBCF56A6C2FE2BD vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3
   ```

  This is your newly generated persistent ADNL address in hexadecimal and user-friendly form. The corresponding private key is saved into file `45061...2DB` in the current directory. Move the key into the keyring directory.

   ```bash
   mv 45061C1* keyring/
   ```

5. 确保你的Web服务器接受带有`.ton`和`.adnl`域名的HTTP请求。

  **Example for Nginx:**

  一旦你在浏览器中设置了`localhost:8080`作为HTTP代理，你就可以在浏览器的导航

  例如，如果你使用带有配置`server_name example.com;`的nginx，你需要将其更改为`server_name _;`或`server_name example.com example.ton vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3.adnl;`。

6. 以反向模式运行代理

   ```bash
   rldp-http-proxy/rldp-http-proxy -a <your-server-ip>:3333 -L '*' -C global.config.json -A <your-adnl-address> -d -l <log-file>
   ```

  where:

  - 其中`<your_public_ip>`是你的服务器公共IPv4地址，`<your_adnl_address>`是在上一步中生成的ADNL地址。
  - `<your-adnl-address>` is the ADNL address you generated earlier.

如果你想让你的TON网站永久运行，你将不得不使用选项`-d`和`-l <log-file>`。

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

You can now access your site from a browser with a proxy set up as [described earlier](/v3/guidelines/web3/ton-proxy-sites/running-your-own-ton-proxy#accessing-ton-sites) using `http://<your-adnl-address>.adnl`.

**Example**

```
http://vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3.adnl
```

This lets you verify whether your TON Site is publicly accessible.

**Optional: register a TON DNS domain**

If you’d like to make your TON Site accessible via a human-readable domain like `example.ton`, you can:

- 如果你愿意，你可以[注册](/participate/web3/site-management)一个TON DNS域名，比如'example.ton'，并为这个域名创建一个指向你TON网站的持久ADNL地址的`site`记录。然后，在客户端模式下运行的RLDP-HTTP代理将会解析http://example.ton为指向你的ADNL地址，并访问你的TON网站。
- 为你的服务器生成一个持久的ANDL地址

Once set up, RLDP-HTTP proxies running in client mode will resolve `http://example.ton` to your ADNL address and display your TON Site like a regular website.

**Optional: run a reverse proxy on a separate server**

You can also host your RLDP-HTTP proxy on a machine different from your web server. In this case, use the `-R` instead of `-L '*'`:

```
-R '*'@<YOUR_WEB_SERVER_HTTP_IP>:<YOUR_WEB_SERVER_HTTP_PORT>
```

**Example**

```bash
rldp-http-proxy/rldp-http-proxy -a 777.777.777.777:3333 -R '*'@333.333.333.333:80 -C global.config.json -A vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3 -d -l tonsite.log
```

在这种情况下，你的常规Web服务器应该在 `http://333.333.333.333:80` 上可用（这个IP不会对外暴露）。

### 建议

由于匿名功能将只在TON Proxy 2.0中可用，如果你不想公开你的Web服务器的IP地址，你可以通过以下两种方式实现：

- 在单独的服务器上运行反向代理，并使用`-R`标志，如上所述。
- 制作一个带有你网站副本的重复服务器，并在本地运行反向代理。

<Feedback />

