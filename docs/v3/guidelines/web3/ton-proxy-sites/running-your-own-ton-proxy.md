# Running your TON Proxy

This document briefly introduces TON Sites — websites accessed through the TON Network. TON Sites can serve as convenient entry points to other TON Services. For instance, HTML pages loaded from TON Sites may contain `ton://...` URIs, such as payment links. When clicked, these links can trigger actions like making a payment, provided the user has a TON Wallet installed on their device.

From a technical standpoint, TON Sites function similarly to standard websites. Still, they are accessed via the [TON Network](/v3/concepts/dive-into-ton/ton-blockchain/ton-networking) — an overlay network that operates within the Internet — rather than directly through the Internet itself. Instead of using standard IPv4 or IPv6 addresses, TON Sites are addressed via [ADNL](/v3/documentation/network/protocols/adnl/overview) addresses. They receive HTTP queries over the [RLDP](/v3/documentation/network/protocols/rldp) protocol, a high-level RPC protocol built on top of ADNL, the TON Network's primary protocol, instead of the usual TCP/IP.
Since encryption is handled at the ADNL level, there’s no need for HTTPS (TLS), mainly when the entry proxy is hosted locally on the user's device.

A gateway between the "ordinary" Internet and the TON Network is required to access existing sites or create new TON Sites. In practice, this involves:
- A HTTP → RLDP proxy running locally on the client's machine to access TON Sites. 
- A reverse RLDP → HTTP proxy running on a remote web server to serve your content through the TON Network.

[Read more about TON Sites, WWW, and Proxy](https://blog.ton.org/ton-sites)

## Running an entry proxy

To access existing TON Sites, you need to run an RLDP-HTTP proxy on your local machine.

1. Download the proxy.
    
   You can either:
   - Download the precompiled **rldp-http-proxy** from [TON auto builds](https://github.com/ton-blockchain/ton/releases/latest).
      or 
   - Compile it yourself by following these [instructions](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#rldp-http-proxy).

2. Download the [TON global config](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config).

3. Run **rldp-http-proxy**

   ```bash
   rldp-http-proxy/rldp-http-proxy -p 8080 -c 3333 -C global.config.json
   ```
    Here’s what the parameters mean:
    
    -`p 8080`: TCP port on localhost where the proxy listens for incoming HTTP requests.
    -`c 3333`: UDP port used for outbound and inbound RLDP and ADNL communication — connecting to TON Sites via the TON Network.
    - `C global.config.json`: path to the global TON config file.

The proxy will continue running in your terminal if everything is set up correctly. You can now access TON Sites through: `http://localhost:8080`.

To stop the proxy, press `Ctrl+C` or close the terminal window.

## Running an entry proxy on a remote computer

1. Download **rldp-http-proxy** from [TON Auto Builds](https://github.com/ton-blockchain/ton/releases/latest).

   Or you can compile the **rldp-http-proxy** yourself by following these [instructions](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#rldp-http-proxy).

2. [Download](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config) TON global config.

3. Download **generate-random-id** from [TON Auto Builds](https://github.com/ton-blockchain/ton/releases/latest).

   Or you can compile the **generate-random-id** yourself by following these [instructions](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#generate-random-id).

4. Generate a persistent ANDL Address for your entry proxy

   ```bash
   mkdir keyring

   utils/generate-random-id -m adnlid
   ```

   You will see something like
   ```
   45061C1D4EC44A937D0318589E13C73D151D1CEF5D3C0E53AFBCF56A6C2FE2BD vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3
   ```

   This is your newly-generated persistent ADNL Address, in hexadecimal and user-friendly form. The corresponding private key is saved into file `45061...2DB` in the current directory. Move key into the keyring directory

   ```bash
   mv 45061C1* keyring/
   ```

5. Run **rldp-http-proxy**

   ```
   rldp-http-proxy/rldp-http-proxy -p 8080 -a <your_public_ip>:3333 -C global.config.json -A <your_adnl_address>
   ```

   where `<your_public_ip>` is your public IPv4 address and `<your_adnl_address>` is the ADNL Address generated in the previous step.

   Example:
   ```
   rldp-http-proxy/rldp-http-proxy -p 8080 -a 777.777.777.777:3333 -C global.config.json -A vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3
   ```

   In the above example, `8080` is the TCP port that will be listened to at localhost for incoming HTTP queries, and `3333` is the UDP port that will be used for all outbound and inbound RLDP and ADNL activity (i.e. for connecting to TON Sites via the TON Network). `global.config.json` is the filename of TON global config.

If you have done everything correctly, the Proxy will not terminate, but it will continue running in the terminal. It can be used now for accessing TON Sites. When you don't need it anymore, you can terminate it by pressing `Ctrl-C`, or simply by closing the terminal window. You can run this as a unix service to run permanently.

Your entry proxy will be available by HTTP on `<your_public_ip>` port `8080`.

## Accessing TON Sites

Now suppose that you have a running instance of the RLDP-HTTP Proxy running on your computer and listening on `localhost:8080` for inbound TCP connections, as explained [above](#running-an-entry-proxy-on-a-remote-computer).

A simple test that everything is working properly may be performed using programs such as `curl` or `wget`. For example,

```
curl -x 127.0.0.1:8080 http://just-for-test.ton
```

attempts to download the main page of (TON) Site `just-for-test.ton` using the proxy at `127.0.0.1:8080`. If the proxy is up and running, you'll see something like

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

You can also access TON Sites by means of their ADNL Addresses by using a fake domain `<adnl-addr>.adnl`

```bash
curl -x 127.0.0.1:8080 http://utoljjye6y4ixazesjofidlkrhyiakiwrmes3m5hthlc6ie2h72gllt.adnl/
```
currently fetches the same TON Web page.

Alternatively, you can set up `localhost:8080` as a HTTP proxy in your browser. For example, if you use Firefox, visit [Setup] -> General -> Network Settings -> Settings -> Configure Proxy Access -> Manual Proxy configuration, and type "127.0.0.1" into the field "HTTP Proxy", and "8080" into the field "Port".

Once you have set up `localhost:8080` as the HTTP proxy to be used in your browser, you can simply type the required URI, such as `http://just-for-test.ton` or `http://utoljjye6y4ixazesjofidlkrhyiakiwrmes3m5hthlc6ie2h72gllt.adnl/`, in the navigation bar of your browser, and interact with the TON Site in the same way as with the usual Web Sites.

## Running TON Site

:::tip tutorial found!
Hey! Don't want to start from beginner-friendly tutorial [How to run TON Site?](/v3/guidelines/web3/ton-proxy-sites/how-to-run-ton-site)
:::

Most people will need just to access existing TON Sites, not to create new ones. However, if you want to create one, you'll need to run RLDP-HTTP Proxy on your server, along with the usual web server software such as Apache or Nginx.

We suppose that you know already how to set up an ordinary website, and that you have already configured one on your server, are accepting incoming HTTP connections on TCP port `<your-server-ip>:80`, and have defined the required TON Network domain name (e.g. `example.ton`) as the main domain name or an alias for your website in the configuration of your web server.

1. Download **rldp-http-proxy** from [TON Auto Builds](https://github.com/ton-blockchain/ton/releases/latest).

   Or you can compile the **rldp-http-proxy** yourself by this [instruction](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#rldp-http-proxy).

2. [Download](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config) TON global config.

3. Download **generate-random-id** from [TON Auto Builds](https://github.com/ton-blockchain/ton/releases/latest).

   Or you can compile the **generate-random-id** yourself by following these [instructions](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#generate-random-id).

4. Generate a persistent ANDL Address for your server

   ```bash
   mkdir keyring

   utils/generate-random-id -m adnlid
   ```

   You will see something like

   ```bash
   45061C1D4EC44A937D0318589E13C73D151D1CEF5D3C0E53AFBCF56A6C2FE2BD vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3
   ```

   This is your newly-generated persistent ADNL Address, in hexadecimal and user-friendly form. The corresponding private key is saved into file `45061...2DB` in the current directory. Move it into the keyring directory

   ```bash
   mv 45061C1* keyring/
   ```

5. Make sure your webserver accepts HTTP requests with `.ton` and `.adnl` domains.

   For example if you use nginx with config `server_name example.com;`, you need to change it to `server_name _;` or `server_name example.com example.ton vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3.adnl;`.

6. Run the proxy in reverse mode

   ```bash
   rldp-http-proxy/rldp-http-proxy -a <your-server-ip>:3333 -L '*' -C global.config.json -A <your-adnl-address> -d -l <log-file>
   ```

   where `<your_public_ip>` is your server public IPv4 address and `<your_adnl_address>` is the ADNL Address generated in the previous step.

If you want your TON Site to run permanently, you'll have to use options `-d` and `-l <log-file>`.

Example:
 ```bash
 rldp-http-proxy/rldp-http-proxy -a 777.777.777.777:3333 -L '*' -C global.config.json -A vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3 -d -l tonsite.log
 ```

If all works properly, the RLDP-HTTP proxy will accept incoming HTTP queries from the TON Network via RLDP/ADNL running on UDP port 3333 (of course, you can use any other UDP port if you want to) of IPv4 address `<your-server-ip>` (in particular, if you are using a firewall, don't forget to allow `rldp-http-proxy` to receive and send UDP packets from this port), and it will forward these HTTP queries addressed to all hosts (if you want to forward only specific hosts, change `-L '*'` to `-L <your hostname>`) to TCP port `80` at `127.0.0.1` (i.e. to your ordinary Web server).

You can visit TON Site `http://<your-adnl-address>.adnl` (`http://vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3.adnl` in this example) from a browser running on a client machine as explained in the "Accessing TON Sites" Section and check whether your TON Site is actually available to the public.

If you want to, you can [register](/v3/guidelines/web3/ton-proxy-sites/site-and-domain-management) a TON DNS domain, such as 'example.ton', and create a `site` record for this domain pointing to the persistent ADNL Address of your TON Site. Then the RLDP-HTTP proxies running in client mode would resolve http://example.ton as pointing to your ADNL Address and will access your TON Site.

You can also run a reverse proxy on a separate server and set your webserver as a remote address. In this case use `-R '*'@<YOUR_WEB_SERVER_HTTP_IP>:<YOUR_WEB_SERVER_HTTP_PORT>` instead of `-L '*'`.

Example:
```bash
rldp-http-proxy/rldp-http-proxy -a 777.777.777.777:3333 -R '*'@333.333.333.333:80 -C global.config.json -A vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3 -d -l tonsite.log
```

In this case your regular webserver should be available on `http://333.333.333.333:80` (this IP will not be exposed to the outside).

### Recommendations

Since anonymity will only be available in TON Proxy 2.0, if you do not want to disclose the IP address of your web server, you can do it in two ways:

 * Run a reverse proxy on a separate server with `-R` flag as described above.

 * Make a duplicate server with copy of your website and run reverse proxy locally.

