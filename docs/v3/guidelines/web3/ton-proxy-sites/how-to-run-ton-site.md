import Feedback from '@site/src/components/Feedback';

# How to run TON Sites

## Introduction

[TON Sites](https://blog.ton.org/ton-sites) work similarly to regular websites but require additional steps to start. This guide walks you through the setup process.

## Running TON Site
Install the [Tonutils reverse proxy](https://github.com/tonutils/reverse-proxy) to use TON Proxy for your website.

### Installation on any Linux

##### Download
```bash
wget https://github.com/tonutils/reverse-proxy/releases/latest/download/tonutils-reverse-proxy-linux-amd64
chmod +x tonutils-reverse-proxy-linux-amd64
```

##### Run

Run with domain configuration and follow the following steps:
```
./tonutils-reverse-proxy-linux-amd64 --domain your-domain.ton 
```
Scan the QR code shown in your terminal using Tonkeeper, Tonhub, or any other wallet. Confirm the transaction to link your domain to the site.

###### Run without domain
Alternatively, you can run the proxy in simple mode with an .adnl domain if you do not have a `.ton` or `.t.me` domain:

```
./tonutils-reverse-proxy-linux-amd64
```

##### Use
Your TON Site is now accessible via the ADNL address or the domain.

To change settings such as the proxy pass URL, edit the `config.json` file and restart the proxy. The default proxy pass URL is: `http://127.0.0.1:80/`.


The proxy also adds the following headers:
- `X-Adnl-Ip` – the client's IP address.
- `X-Adnl-Id` – the client's ADNL ID.

### Installation on any other OS

Build it from sources, and run it as in step 2 for linux. Go environment is required to build.

To install it on other systems, build the project from the source and run it as in step 2 for Linux. A `Go` environment is required.

```bash
git clone https://github.com/tonutils/reverse-proxy.git
cd reverse-proxy
make build
```

To build for other operating systems, run `make all`.


## Further steps

### Checking site availability 

After completing the setup, the TON Proxy should be running. If the setup is successful, your site will be available at the ADNL address generated during the configuration.

You can check availability by opening the address with the `.adnl` suffix. Ensure that a TON Proxy is active in your browser, such as via the [MyTonWallet](https://mytonwallet.io/) browser extension.

## References

 * [TON Sites, TON WWW and TON Proxy](https://blog.ton.org/ton-sites)
 * [Tonutils reverse proxy](https://github.com/tonutils/reverse-proxy)
 * Authors: [_Andrew Burnosov_](https://github.com/AndreyBurnosov) (TG: [@AndrewBurnosov](https://t.me/AndreyBurnosov)), [_Daniil Sedov_](https://gusarich.com) (TG: [@sedov](https://t.me/sedov)), [_George Imedashvili_](https://github.com/drforse)


## See also
* [Run C++ implementation](/v3/guidelines/web3/ton-proxy-sites/running-your-own-ton-proxy)

<Feedback />

