# How to run TON Sites

## 👋 Introduction

[TON Sites](https://blog.ton.org/ton-sites) work almost like regular sites except for their installation. Several additional actions are required to launch them. In this tutorial, I will show you how to do it.

## 🖥 Running TON Site
Install [Tonutils Reverse Proxy](https://github.com/tonutils/reverse-proxy) to use TON Proxy for your website.


### Installation on any Linux

##### Download
```bash
wget https://github.com/ton-utils/reverse-proxy/releases/latest/download/tonutils-reverse-proxy-linux-amd64
chmod +x tonutils-reverse-proxy-linux-amd64
```

##### Run

Run with domain configuration and follow the steps:
```
./tonutils-reverse-proxy-linux-amd64 --domain your-domain.ton 
```
Scan QR code from your terminal using Tonkeeper, Tonhub or any other wallet, execute transaction. Your domain will be linked to your site.

###### Run without domain
Alternatively, you can run in simple mode with an .adnl domain, if you don't have a .ton or .t.me domain:
```
./tonutils-reverse-proxy-linux-amd64
```

##### Use
Now anyone can access your TON Site using the ADNL address or domain.

If you want to change some settings, like the proxy pass URL, open the `config.json` file, edit and restart the proxy. Default proxy pass url is `http://127.0.0.1:80/`

The proxy adds additional headers:
`X-Adnl-Ip` - ip of the client, and `X-Adnl-Id` - adnl id of the client

### Installation on any other OS

Build it from sources using `./build.sh`, and run it as in step 2 for linux. Go environment is required to build.

## 👀 Further steps

### 🔍 Checking availability of the site

After completing all the steps of the method you selected, the TON Proxy should have started. If everything was successful, your site will be available at the ADNL address received at the corresponding step. 

You can check the availability of the site by opening this address with the domain `.adnl`. Also note that in order for the site to open, you must have a TON Proxy running in your browser, for example through an extension [MyTonWallet](https://mytonwallet.io/).

## 📌 References

 * [TON Sites, TON WWW and TON Proxy](https://blog.ton.org/ton-sites)
 * [Tonutils Reverse Proxy](https://github.com/tonutils/reverse-proxy)
 * Authors: [Andrew Burnosov](https://github.com/AndreyBurnosov) (TG: [@AndrewBurnosov](https://t.me/AndreyBurnosov)), [Daniil Sedov](https://gusarich.com) (TG: [@sedov](https://t.me/sedov)), [George Imedashvili](https://github.com/drforse)


## See Also
* [Run C++ Implementation](/v3/guidelines/web3/ton-proxy-sites/running-your-own-ton-proxy)
