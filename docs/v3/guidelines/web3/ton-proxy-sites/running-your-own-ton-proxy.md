import Feedback from '@site/src/components/Feedback';

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

    Run **rldp-http-proxy**.

   ```bash
   rldp-http-proxy/rldp-http-proxy -p 8080 -c 3333 -C global.config.json
   ```
    Here’s what the parameters mean:
    
  - `8080`: TCP port on localhost where the proxy listens for incoming HTTP requests.
  - `3333`: UDP port used for outbound and inbound RLDP and ADNL communication — connecting to TON Sites via the TON Network.
  - `global.config.json`: path to the global TON config file.

The proxy will continue running in your terminal if everything is set up correctly. You can now access TON Sites through: `http://localhost:8080`.

To stop the proxy, press `Ctrl+C` or close the terminal window.

## Running an entry proxy on a remote computer

1. Download the proxy.

You can either:
- Download **rldp-http-proxy** from [TON auto builds](https://github.com/ton-blockchain/ton/releases/latest).
  
  or
- Compile it yourself by following these [instructions](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#rldp-http-proxy).

2. Download the [TON global config](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config).

3. Download **generate-random-id** from [TON auto builds](https://github.com/ton-blockchain/ton/releases/latest).
   Or you can compile the **generate-random-id** yourself by following these [instructions](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#generate-random-id).

4. Generate a persistent ANDL address for your entry proxy.

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

5. Run **rldp-http-proxy**.

   ```
   rldp-http-proxy/rldp-http-proxy -p 8080 -a <your_public_ip>:3333 -C global.config.json -A <your_adnl_address>
   ```

   where `<your_public_ip>` is your public IPv4 address and `<your_adnl_address>` is the ADNL address generated in the previous step.

   **Example**
   ```
   rldp-http-proxy/rldp-http-proxy -p 8080 -a 777.777.777.777:3333 -C global.config.json -A vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3
   ```

   - `8080`: TCP port to listen for incoming HTTP queries on localhost. 
   - `3333`: UDP port used for RLDP/ADNL activity — connecting to TON Sites via the TON Network. 
   - `global.config.json`: Path to the global TON configuration file. 

The proxy will stay running in the terminal if everything is configured correctly. You can now access TON Sites through: `http://<your_public_ip>:8080`.

To stop the proxy, press `Ctrl+C` or close the terminal window.

## Accessing TON Sites


Once your RLDP-HTTP proxy is up and running on `localhost:8080` for inbound TCP connections, as explained [above](#running-an-entry-proxy-on-a-remote-computer).

You can verify your setup with a simple test using `curl` or `wget`. For example,

```
curl -x 127.0.0.1:8080 http://just-for-test.ton
```

This command attempts to download the main page of the TON Site `just-for-test.ton` using the proxy at `127.0.0.1:8080`. If the proxy is running correctly, you'll see output similar to the following:

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
This fetches the same TON Web page.

Alternatively, you can configure your browser to use `localhost:8080` as an HTTP proxy. For example, in Firefox:

1. Go to **Settings → General → Network Settings → Settings → Configure Proxy Access → Manual Proxy configuration**.
2. Enter the following:
   - **HTTP Proxy:** 127.0.0.1
   - **Port:** 8080

Once the proxy is configured, you can visit TON Sites directly by entering their URLs in the browser's address bar. For example:
- `http://just-for-test.ton`
- `http://utoljjye6y4ixazesjofidlkrhyiakiwrmes3m5hthlc6ie2h72gllt.adnl/`

You can interact with these TON Sites just like regular websites. 

## Running TON Site

:::tip tutorial found!
Want to create your own TON Site? This is a [beginner-friendly guide](/v3/guidelines/web3/ton-proxy-sites/how-to-run-ton-site). 
:::


Most users only need to access existing TON Sites, not create new ones.
However, if you want to host your TON Site, you need to:
- Run the RLDP-HTTP proxy on your server.
- Use standard web server software such as Apache or Nginx.

We assume that you already know how to set up a regular website and that:
- You have a working web server running on `http://<your-server-ip>:80`. 
- You are accepting incoming HTTP connections on TCP port `80`. 
- You have defined a TON Network domain name (e.g., `example.ton`) as the main domain or an alias in your web server configuration.

1. Download the proxy.

You can either:
- Download **rldp-http-proxy** from [TON auto builds](https://github.com/ton-blockchain/ton/releases/latest).

  or
- Compile it yourself by following these [instructions](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#rldp-http-proxy).

2. Download the [TON global config](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config).

3. Download **generate-random-id** from [TON auto builds](https://github.com/ton-blockchain/ton/releases/latest).
   Or you can compile the **generate-random-id** yourself by following these [instructions](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#generate-random-id).

4. Generate a persistent ANDL address for your entry proxy.

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
5. Ensure your web server accepts HTTP requests with `.ton` and `.adnl` domain names.

    **Example for Nginx:**
    
    If your config includes: `server_name example.com;`,
    
    Change it to: `server_name example.com example.ton vcqmha5j3ceve35ammfrhqty46rkhi455otydstv66pk2tmf7rl25f3.adnl;` or `server_name _;`.


6. Run the proxy in reverse mode.

   ```bash
   rldp-http-proxy/rldp-http-proxy -a <your-server-ip>:3333 -L '*' -C global.config.json -A <your-adnl-address> -d -l <log-file>
   ```

   where:
   - `<your-server-ip>` is your public IPv4 address.
   - `<your-adnl-address>` is the ADNL address you generated earlier.

If you want your TON Site to run permanently, you need to use options `-d` and `-l <log-file>`.

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
- [Register](/v3/guidelines/web3/ton-proxy-sites/site-and-domain-management) a TON DNS domain.
- Create a `site` record pointing to your server’s persistent ADNL address.

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

In this case, your regular web server must be accessible at `http://333.333.333.333:80`, although this IP address will remain hidden from external access.


### Recommendations
Since anonymity features will only be introduced in TON Proxy 2.0, if you'd prefer to keep your web server's IP address private, you have two options:
- Set up a reverse proxy on a different server using the `-R` flag. 
- Create a duplicate server containing a copy of your website and run the reverse proxy locally.

<Feedback />

