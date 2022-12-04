# Compile from Sources

## Common

The software is likely to compile and work properly on most Linux systems. It should work on macOS and even Windows.

1) Download the newest version of the TON Blockchain sources available at the GitHub repository https://github.com/ton-blockchain/ton/ :

```bash
git clone --recurse-submodules https://github.com/ton-blockchain/ton.git
```

2) Install the newest versions of:
   - `make`
   - `cmake` version 3.0.2 or later
   - `g++` or `clang` (or another C++14-compatible compiler as appropriate for your operating system).
   - OpenSSL (including C header files) version 1.1.1 or later

   On Ubuntu:

```bash
apt update
apt install cmake g++ zlib1g-dev libssl-dev
```


3) Suppose that you have fetched the source tree to directory `~/ton`, where `~` is your home directory, and that you have created an empty directory `~/ton-build`:

```bash
mkdir ton-build
```

   Then run the following in a terminal of Linux:

```bash
cd ton-build
cmake ../ton
```

:::tip
If you are compiling on a computer with low memory (e.g., 1 Gb), don't forget to [create a swap partitions](/develop/howto/compile-swap).
:::

## Download Global Config

For tools like lite client you need to download the global network config.

Download the newest configuration file from https://ton-blockchain.github.io/global.config.json for mainnet:

```bash
wget https://ton-blockchain.github.io/global.config.json
```

or from https://ton-blockchain.github.io/testnet-global.config.json for testnet:

```bash
wget https://ton-blockchain.github.io/testnet-global.config.json
```

## Lite Client

To build a lite client, do [common part](/develop/howto/compile#common), [download the config](/develop/howto/compile#download-global-config), and then do:

```bash
cmake --build . --target lite-client
```

Run the Lite Client with config:

```bash
./lite-client/lite-client -C global.config.json
```

If everything was installed successfully, the Lite Client will connect to a special server (a full node for the TON Blockchain Network) and will send some queries to the server.
If you indicate a writeable "database" directory as an extra argument to the client, it will download and save the block and the state corresponding to the newest masterchain block:

```bash
./lite-client/lite-client -C global.config.json -D ~/ton-db-dir
```

Basic help info can be obtained by typing `help` into the Lite Client. Type `quit` or press `Ctrl-C` to exit.


## FunC

To build FunC compiler from source code, do [common part](/develop/howto/compile#common) described above and then:

```bash
cmake --build . --target func
```

To compile FunC smart contract:

```bash
./crypto/func -o output.fif -SPA source0.fc source1.fc ...
```

## Fift

To build Fift compiler from source code, do [common part](/develop/howto/compile#common) described above and then:

```bash
cmake --build . --target fift
```

To run Fift script:

```bash
./crypto/fift -s script.fif script_param0 script_param1 ..
```

## Tonlib-cli

To build tonlib-cli, do [common part](/develop/howto/compile#common), [download the config](/develop/howto/compile#download-global-config) and then do:

```bash
cmake --build . --target tonlib-cli
```

Run the tonlib-cli with config:

```bash
./tonlib/tonlib-cli -C global.config.json
```

Basic help info can be obtained by typing `help` into the tonlib-cli. Type `quit` or press `Ctrl-C` to exit.

## RLDP-HTTP-Proxy

To build rldp-http-proxy, do [common part](/develop/howto/compile#common), [download the config](/develop/howto/compile#download-global-config) and then do:

```bash
cmake --build . --target rldp-http-proxy
```

The Proxy binary will be located as:

```bash
rldp-http-proxy/rldp-http-proxy
```

## generate-random-id

To build generate-random-id, do [common part](/develop/howto/compile#common) and then do:

```bash
cmake --build . --target generate-random-id
```

The binary will be located as:

```bash
utils/generate-random-id
```
