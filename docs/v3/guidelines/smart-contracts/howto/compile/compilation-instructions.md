# Compile from Sources

You can download prebuilt binaries [here](/v3/documentation/archive/precompiled-binaries#1-download).

If you still want to compile sources yourself, follow the instructions below.

:::caution
This is a simplified quick build guide. 

If you are building for production and not for home use, it's better to use [autobuild scripts](https://github.com/ton-blockchain/ton/tree/master/.github/workflows).
:::

## Common

The software is likely to compile and work properly on most Linux systems. It should work on macOS and even Windows.

1) Download the newest version of TON Blockchain sources available at the GitHub repository https://github.com/ton-blockchain/ton/:

```bash
git clone --recurse-submodules https://github.com/ton-blockchain/ton.git
```

2) Install the newest versions of:
   - `make`
   - `cmake` version 3.0.2 or later
   - `g++` or `clang` (or another C++14-compatible compiler as appropriate for your operating system).
   - OpenSSL (including C header files) version 1.1.1 or later
   - `build-essential`, `zlib1g-dev`, `gperf`, `libreadline-dev`, `ccache`, `libmicrohttpd-dev`, `pkg-config`, `libsodium-dev`, `libsecp256k1-dev`

### On Ubuntu

```bash
apt update
sudo apt install build-essential cmake clang openssl libssl-dev zlib1g-dev gperf libreadline-dev ccache libmicrohttpd-dev pkg-config libsodium-dev libsecp256k1-dev
```


3) Suppose that you have fetched the source tree to directory `~/ton`, where `~` is your home directory, and that you have created an empty directory `~/ton-build`:

```bash
mkdir ton-build
```

Then run the following in a terminal of Linux or MacOS:

```bash
cd ton-build
export CC=clang
export CXX=clang++
cmake -DCMAKE_BUILD_TYPE=Release ../ton && cmake --build . -j$(nproc)
```

### On MacOS

Prepare the system by installing required system packages
```zsh
brew install ninja libsodium libmicrohttpd pkg-config automake libtool autoconf gnutls
brew install llvm@16
```

Use newly installed clang. 
```zsh
  export CC=/opt/homebrew/opt/llvm@16/bin/clang
  export CXX=/opt/homebrew/opt/llvm@16/bin/clang++
```

Compile secp256k1
```zsh
  git clone https://github.com/bitcoin-core/secp256k1.git
  cd secp256k1
  secp256k1Path=`pwd`
  git checkout v0.3.2
  ./autogen.sh
  ./configure --enable-module-recovery --enable-static --disable-tests --disable-benchmark
  make -j12
```
and lz4:

```zsh
  git clone https://github.com/lz4/lz4
  cd lz4
  lz4Path=`pwd`
  git checkout v1.9.4
  make -j12
```
and relink OpenSSL 3.0

```zsh
brew unlink openssl@1.1
brew install openssl@3
brew unlink openssl@3 &&  brew link --overwrite openssl@3
```

Now you can compile TON

```zsh
cmake -GNinja -DCMAKE_BUILD_TYPE=Release .. \
-DCMAKE_CXX_FLAGS="-stdlib=libc++" \
-DSECP256K1_FOUND=1 \
-DSECP256K1_INCLUDE_DIR=$secp256k1Path/include \
-DSECP256K1_LIBRARY=$secp256k1Path/.libs/libsecp256k1.a \
-DLZ4_FOUND=1 \
-DLZ4_LIBRARIES=$lz4Path/lib/liblz4.a \
-DLZ4_INCLUDE_DIRS=$lz4Path/lib
```

:::

:::tip
If you are compiling on a computer with low memory (e.g., 1 Gb), don't forget to [create a swap partitions](/v3/guidelines/smart-contracts/howto/compile/instructions-low-memory).
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

To build a lite client, do [common part](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common), [download the config](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config), and then do:

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

To build FunC compiler from source code, do [common part](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common) described above and then:

```bash
cmake --build . --target func
```

To compile FunC smart contract:

```bash
func -o output.fif -SPA source0.fc source1.fc ...
```

## Fift

To build Fift compiler from source code, do [common part](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common) described above and then:

```bash
cmake --build . --target fift
```

To run Fift script:

```bash
fift -s script.fif script_param0 script_param1 ..
```

## Tonlib-cli

To build tonlib-cli, do [common part](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common), [download the config](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config) and then do:

```bash
cmake --build . --target tonlib-cli
```

Run the tonlib-cli with config:

```bash
./tonlib/tonlib-cli -C global.config.json
```

Basic help info can be obtained by typing `help` into the tonlib-cli. Type `quit` or press `Ctrl-C` to exit.

## RLDP-HTTP-Proxy

To build rldp-http-proxy, do [common part](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common), [download the config](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config) and then do:

```bash
cmake --build . --target rldp-http-proxy
```

The Proxy binary will be located as:

```bash
rldp-http-proxy/rldp-http-proxy
```

## generate-random-id

To build generate-random-id, do [common part](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common) and then do:

```bash
cmake --build . --target generate-random-id
```

The binary will be located as:

```bash
utils/generate-random-id
```

## storage-daemon

To build storage-daemon and storage-daemon-cli, do [common part](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common) and then do:

```bash
cmake --build . --target storage-daemon storage-daemon-cli
```

The binary will be located at:

```bash
storage/storage-daemon/
```

# Compile old TON versions

TON releases: https://github.com/ton-blockchain/ton/tags

```bash
git clone https://github.com/ton-blockchain/ton.git
cd ton
# git checkout <TAG> for example checkout func-0.2.0
git checkout func-0.2.0
git submodule update --init --recursive 
cd ..
mkdir ton-build
cd ton-build
cmake ../ton
# build func 0.2.0
cmake --build . --target func
```

## Compile old versions on Apple M1:

TON supports Apple M1 from 11 Jun 2022 ([Add apple m1 support (#401)](https://github.com/ton-blockchain/ton/commit/c00302ced4bc4bf1ee0efd672e7c91e457652430) commit).

To compile older TON revisions on Apple M1:

1. Update RocksDb submodule to 6.27.3
   ```bash
   cd ton/third-party/rocksdb/
   git checkout fcf3d75f3f022a6a55ff1222d6b06f8518d38c7c
   ```

2. Replace root `CMakeLists.txt` by https://github.com/ton-blockchain/ton/blob/c00302ced4bc4bf1ee0efd672e7c91e457652430/CMakeLists.txt
