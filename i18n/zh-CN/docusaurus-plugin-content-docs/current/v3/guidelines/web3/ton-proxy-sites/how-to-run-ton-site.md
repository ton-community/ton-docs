# 如何运行 TON 网站

## 👋 引言

[TON 网站](https://blog.ton.org/ton-sites)的工作方式几乎与普通网站相同，除了它们的安装。需要执行一些额外的操作来启动它们。在这篇教程中，我将向您展示如何做到这一点。

## 🖥 运行 TON 网站

安装 [Tonutils 反向代理](https://github.com/tonutils/reverse-proxy) 来使用 TON 代理为您的网站服务。

### 在任何 Linux 上的安装

##### 下载

```bash
wget https://github.com/ton-utils/reverse-proxy/releases/latest/download/tonutils-reverse-proxy-linux-amd64
chmod +x tonutils-reverse-proxy-linux-amd64
```

##### 运行

用域配置运行，并按步骤操作：

```
./tonutils-reverse-proxy-linux-amd64 --domain your-domain.ton 
```

使用 Tonkeeper、Tonhub 或任何其他钱包扫描你的终端中的 QR 码，执行交易。您的域将会链接到您的网站上。

###### 无域运行

作为替代，如果你没有 .ton 或 .t.me 域，你可以以简单模式运行，使用 .adnl 域：

```
./tonutils-reverse-proxy-linux-amd64
```

##### 使用

现在任何人都可以访问您的 TON 网站了！使用 ADNL 地址或域名。

如果您想更改一些设置，如代理pass url - 打开 `config.json` 文件，编辑后重启代理。默认的代理pass url是 `http://127.0.0.1:80/`

代理添加了额外的头部：
`X-Adnl-Ip` - 客户端的 IP 和 `X-Adnl-Id` - 客户端的 ADNL ID

### 在任何其他操作系统上的安装

使用 `./build.sh` 从源代码构建，然后如第 2 步中的 Linux 一样运行。构建需要 Go 环境。

```bash
git clone https://github.com/tonutils/reverse-proxy.git
cd reverse-proxy
make build
```

要为其他操作系统构建程序，请运行 `make all` 。

## 👀 进一步的步骤

### 🔍 检查网站的可用性

完成所选方法的所有步骤后，TON 代理服务器应已启动。如果一切顺利，您的网站将在相应步骤中收到的 ADNL 地址上可用。

您可以使用域名 `.adnl`打开该地址，查看网站是否可用。另外请注意，为了打开该网站，您必须在浏览器中运行 TON 代理，例如通过扩展 [MyTonWallet](https://mytonwallet.io/)。

## 📌 参考资料

- [TON 站点、TON WWW 和 TON 代理](https://blog.ton.org/ton-sites)
- [Tonutils反向代理](https://github.com/tonutils/reverse-proxy)
- 作者：[Andrew Burnosov](https://github.com/AndreyBurnosov) (TG: [@AndrewBurnosov](https://t.me/AndreyBurnosov)), [Daniil Sedov](https://gusarich.com) (TG: [@sedov](https://t.me/sedov)), [George Imedashvili](https://github.com/drforse)

## 参阅

- [运行 C++ 实现](/v3/guidelines/web3/ton-proxy-sites/running-your-your-ton-proxy)
