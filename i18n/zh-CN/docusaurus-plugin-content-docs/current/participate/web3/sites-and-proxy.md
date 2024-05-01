# 运行自己的 TON 代理

本文档旨在简要地介绍TON网站，即通过TON网络访问的网站。TON网站可以方便地作为进入其他TON服务的入口。特别是，从TON网站下载的HTML页面可能包含指向`ton://...` URI的链接，用户点击这些链接后，如果用户设备上安装了TON钱包，就可以执行支付操作。

从技术角度看，TON网站非常类似于标准网站，但它们是通过[TON网络](/learn/networking/overview)（互联网内的一个覆盖网络）而不是互联网访问的。更具体地说，它们拥有一个[ADNL](/learn/networking/adnl)地址（而不是更常见的IPv4或IPv6地址），并通过[RLDP](/learn/networking/rldp)协议（这是建立在ADNL之上的高级RPC协议，ADNL是TON网络的主要协议）接受HTTP查询，而不是常规的TCP/IP。所有加密由ADNL处理，所以如果入口代理托管在用户设备上，就没有必要使用HTTPS（即TLS）。

为了访问现有的网站和创建新的TON网站，需要特殊的网关来连接“普通”互联网和TON网络。本质上，通过在客户端机器上本地运行的HTTP->RLDP代理访问TON网站，并通过在远程Web服务器上运行的RLDP->HTTP代理来创建它们。

[了解更多关于TON网站、WWW和代理的信息](https://blog.ton.org/ton-sites)

## 运行入口代理

为了访问现有的TON网站，你需要在你的电脑上运行一个RLDP-HTTP代理。

1. 从[TON自动构建](https://github.com/ton-blockchain/ton/releases/latest)下载**rldp-http-proxy**。

   或者你可以按照这些[指示](/develop/howto/compile#rldp-http-proxy)自己编译**rldp-http-proxy**。

2. [下载](/develop/howto/compile#download-global-config)TON全局配置。

3. 运行**rldp-http-proxy**

   ```bash
   rldp-http-proxy/rldp-http-proxy -p 8080 -c 3333 -C global.config.json
   ```

在上面的例子中，`8080`是将在本地主机上监听传入HTTP查询的TCP端口，而`3333`是将用于所有出站和入站RLDP和ADNL活动的UDP端口（即通过TON网络连接到TON网站）。`global.config.json`是TON全局配置的文件名。

如果一切正确，入口代理将不会终止，而是会继续在终端运行。现在可以用它来访问TON网站。当你不再需要它时，可以通过按`Ctrl-C`或简单地关闭终端窗口来终止它。

你的入口代理将通过HTTP在`localhost`端口`8080`上可用。

## 在远程计算机上运行入口代理

1. 从[TON自动构建](https://github.com/ton-blockchain/ton/releases/latest)下载**rldp-http-proxy**。

   或者你可以按照这些[指示](/develop/howto/compile#rldp-http-proxy)自己编译**rldp-http-proxy**。

2. [下载](/develop/howto/compile#download-global-config)TON全局配置。

3. 从[TON自动构建](https://github.com/ton-blockchain/ton/releases/latest)下载**generate-random-id**。

   或者你可以按照这些[指示](/develop/howto/compile#generate-random-id)自己编译**generate-random-id**。

4. 为你的入口代理生成一个持久的ANDL地址

   ```bash
   mkdir keyring

   utils/generate-random-id -m adnlid
   ```


   你会看到类似于
   ```
   45061C1D4EC44A937D0318589E13C73D151D1CEF5D3C0E53AFBCF56A6C2FE2BD vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3
   ```

   这是你新生成的持久ADNL地址，以十六进制和用户友好形式显示。相应的私钥保存在当前目录的文件`45061...2DB`中。将密钥移动到keyring目录

   ```bash
   mv 45061C1* keyring/
   ```

5. 运行**rldp-http-proxy**

   ```
   rldp-http-proxy/rldp-http-proxy -p 8080 -a <your_public_ip>:3333 -C global.config.json -A <your_adnl_address>
   ```

   其中`<your_public_ip>`是你的公共IPv4地址，`<your_adnl_address>`是在上一步中生成的ADNL地址。

   示例：
   ```
   rldp-http-proxy/rldp-http-proxy -p 8080 -a 777.777.777.777:3333 -C global.config.json -A vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3
   ```

   在上面的示例中，`8080`是将在本地主机上监听传入HTTP查询的TCP端口，而`3333`是将用于所有出站和入站RLDP和ADNL活动的UDP端口（即通过TON网络连接到TON网站）。`global.config.json`是TON全局配置的文件名。

如果你做得都对，代理不会终止，而是会继续在终端运行。现在可以用它来访问TON网站。当你不再需要它时，可以通过按`Ctrl-C`或简单地关闭终端窗口来终止它。你可以将这个运行为一个unix服务以永久运行。

你的入口代理将通过HTTP在`<your_public_ip>`端口`8080`上可用。

## 访问TON网站

现在假设你在电脑上运行了一个RLDP-HTTP代理的实例，并且正在`localhost:8080`上监听传入的TCP连接，如[上面](#running-entry-proxy)所解释的。

使用诸如`curl`或`wget`之类的程序进行简单测试以确认一切正常运行是可行的。例如，

```
curl -x 127.0.0.1:8080 http://just-for-test.ton
```

尝试使用代理`127.0.0.1:8080`下载(TON)站点`just-for-test.ton`的主页。如果代理正常运行，你将看到类似于

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

你还可以通过使用假域名`<adnl-addr>.adnl`通过它们的ADNL地址访问TON网站

```bash
curl -x 127.0.0.1:8080 http://utoljjye6y4ixazesjofidlkrhyiakiwrmes3m5hthlc6ie2h72gllt.adnl/
```
目前获取的是同一个TON网页。

或者，你可以在浏览器中将`localhost:8080`设置为HTTP代理。例如，如果你使用Firefox，请访问[设置] -> 通用 -> 网络设置 -> 设置 -> 配置代理访问 -> 手动代理配置，并在“HTTP代理”字段中输入“127.0.0.1”，在“端口”字段中输入“8080”。

一旦你在浏览器中设置了`localhost:8080`作为HTTP代理，你就可以在浏览器的导航

栏中输入所需的URI，如`http://just-for-test.ton`或`http://utoljjye6y4ixazesjofidlkrhyiakiwrmes3m5hthlc6ie2h72gllt.adnl/`，并以与通常网站相同的方式与TON网站交互。

## 运行TON网站

:::tip 教程找到了！
嘿！不要从初学者友好的教程[如何运行TON网站？](/develop/dapps/tutorials/how-to-run-ton-site)开始
:::

大多数人只需要访问现有的TON网站，而不是创建新的。然而，如果你想创建一个，你需要在你的服务器上运行RLDP-HTTP代理，以及像Apache或Nginx这样的常规Web服务器软件。

我们假设你已经知道如何设置一个普通的网站，并且你已经在你的服务器上配置了一个，接受TCP端口`<your-server-ip>:80`上的传入HTTP连接，并且已经在你的Web服务器配置中为你的网站定义了所需的TON网络域名（例如`example.ton`）作为主域名或别名。

1. 从[TON自动构建](https://github.com/ton-blockchain/ton/releases/latest)下载**rldp-http-proxy**。

   或者你可以按照这个[指示](/develop/howto/compile#rldp-http-proxy)自己编译**rldp-http-proxy**。

2. [下载](/develop/howto/compile#download-global-config)TON全局配置。

3. 从[TON自动构建](https://github.com/ton-blockchain/ton/releases/latest)下载**generate-random-id**。

   或者你可以按照这些[指示](/develop/howto/compile#generate-random-id)自己编译**generate-random-id**。

4. 为你的服务器生成一个持久的ANDL地址

   ```bash
   mkdir keyring

   utils/generate-random-id -m adnlid
   ```

   你会看到类似于

   ```bash
   45061C1D4EC44A937D0318589E13C73D151D1CEF5D3C0E53AFBCF56A6C2FE2BD vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3
   ```

   这是你新生成的持久ADNL地址，以十六进制和用户友好形式显示。相应的私钥保存在当前目录的文件`45061...2DB`中。将它移动到keyring目录

   ```bash
   mv 45061C1* keyring/
   ```

5. 确保你的Web服务器接受带有`.ton`和`.adnl`域名的HTTP请求。

   例如，如果你使用带有配置`server_name example.com;`的nginx，你需要将其更改为`server_name _;`或`server_name example.com example.ton vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3.adnl;`。

6. 以反向模式运行代理

   ```bash
   rldp-http-proxy/rldp-http-proxy -a <your-server-ip>:3333 -L '*' -C global.config.json -A <your-adnl-address> -d -l <log-file>
   ```

   其中`<your_public_ip>`是你的服务器公共IPv4地址，`<your_adnl_address>`是在上一步中生成的ADNL地址。

如果你想让你的TON网站永久运行，你将不得不使用选项`-d`和`-l <log-file>`。

示例：
 ```bash
 rldp-http-proxy/rldp-http-proxy -a 777.777.777.777:3333 -L '*' -C global.config.json -A vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3 -d -l tonsite.log
 ```

如果一切正常工作，RLDP-HTTP代理将接受来自TON网络的传入HTTP查询，通过运行在UDP端口3333的IPv4地址`<your-server-ip>`（特别是，如果你使用防火墙，请不要忘记允许`rldp-http-proxy`从该端口接收和发送UDP数据包）的RLDP/ADNL，它将把这些HTTP查询转发到所有主机（如果你只想转发特定主机，请将`-L '*'`更改为`-L <your hostname>`）的`127.0.0.1`TCP端口`80`（即你的常规Web服务器）。

你可以在客户端机器上的浏览器中访问TON网站`http://<your-adnl-address>.adnl`（在这个示例中是`http://vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3.adnl`），如“访问TON网站”部分所解释的，并检查你的TON网站是否真的对公众开放。

如果你愿意，你可以[注册](/participate/web3/site-management)一个TON DNS域名，比如'example.ton'，并为这个域名创建一个指向你TON网站的持久ADNL地址的`site`记录。然后，在客户端模式下运行的RLDP-HTTP代理将会解析http://example.ton为指向你的ADNL地址，并访问你的TON网站。

你还可以在一个单独的服务器上运行反向代理，并将你的Web服务器设置为远程地址。在这种情况下，请使用`-R '*'@<YOUR_WEB_SERVER_HTTP_IP>:<YOUR_WEB_SERVER_HTTP_PORT>`替代`-L '*'`。

示例：
```bash
rldp-http-proxy/rldp-http-proxy -a 777.777.777.777:3333 -R '*'@333.333.333.333:80 -C global.config.json -A vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3 -d -l tonsite.log
```

在这种情况下，你的常规Web服务器应该在http://333.333.333.333:80上可用（这个IP不会对外暴露）。

### 建议

由于匿名功能将只在TON Proxy 2.0中可用，如果你不想公开你的Web服务器的IP地址，你可以通过以下两种方式实现：

 * 在单独的服务器上运行反向代理，并使用`-R`标志，如上所述。

 * 制作一个带有你网站副本的重复服务器，并在本地运行反向代理。
