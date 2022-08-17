# How to Compile

## Common

The software is likely to compile and work properly on most Linux systems. It should work on macOS and even Windows.

1) Download the newest version of the TON blockchain sources, available at GitHub repository https://github.com/ton-blockchain/ton/ :

    ```
    git clone https://github.com/ton-blockchain/ton.git
    git submodule update --init
    ```

2) Install the newest versions of:
    - `make`
    - `cmake` version 3.0.2 or later
   - `g++` or `clang` (or another C++14-compatible compiler as appropriate for your operating system).
    - OpenSSL (including C header files) version 1.1.1 or later

3) Suppose that you have fetched the source tree to directory `~/ton`, where `~` is your home directory, and that you have created an empty directory `~/liteclient-build`. Then run the following in a terminal on a Linux system:

    ```
    cd ~/liteclient-build
    cmake ~/ton
    ```

## Lite Client

```
cmake --build . --target lite-client
```

Download the newest configuration file from https://ton-blockchain.github.io/global.config.json for mainnet:

```
wget https://ton-blockchain.github.io/global.config.json
```

or from https://ton-blockchain.github.io/testnet-global.config.json for testnet:

```
wget https://ton-blockchain.github.io/testnet-global.config.json
```

Run the Lite Client with config:

```
./lite-client/lite-client -C global.config.json
```

If everything was installed successfully, the Lite Client will connect to a special server (a full node for the TON Blockchain Network) and will send some queries to the server.
If you indicate a writeable "database" directory as an extra argument to the client, it will download and save the block and the state corresponding to the newest masterchain block:

```
./lite-client/lite-client -C global.config.json -D ~/ton-db-dir
```

Basic help info can be obtained by typing `help` into the Lite Client. Type `quit` or press `Ctrl-C` to exit.


## Func

To build FunC compiler from source code do [common part](/develop
/compile.md#Common) described above and then: 

```
cmake --build . --target func
```

To compile FunC smart contract:

```
func -o output.fif -SPA source0.fc source1.fc ...
```

## Fift

To build Fift compiler from source code do [common part](/develop/compile.md#Common) described above and then:

```
cmake --build . --target fift
```

To run Fift script:

```
fift -s script.fif script_param0 script_param1 ..
```
