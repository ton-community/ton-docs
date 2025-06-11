import Feedback from '@site/src/components/Feedback';

# Compile from sources

ビルド済みバイナリ [here](/v3/documentation/archive/precompiled-binaries#1-download) をダウンロードできます。

それでもソースを自分でコンパイルしたい場合は、以下の手順に従ってください。

:::caution
This is a simplified quick build guide.

ホームではなくプロダクション向けにビルドする場合は、[autobuild scripts](https://github.com/ton-blockchain/ton/tree/master/.github/workflows)を使用することをお勧めします。
:::

## 一般的な

このソフトウェアは、ほとんどのLinuxシステムで適切にコンパイルされ、動作する可能性があります。macOSやWindowsでも動作するはずです。 It should work on macOS and even Windows.

1. GitHubリポジトリhttps://github.com/ton-blockchain/ton/で入手可能なTON Blockchainソースの最新バージョンをダウンロードしてください:

```bash
git clone --recurse-submodules https://github.com/ton-blockchain/ton.git
```

2. 以下の最新バージョンをインストールします。
  - `make`
  - `cmake` バージョン 3.0.2 以降
  - `g++` または `clang` (またはオペレーティングシステムに適した別の C++14 互換コンパイラ)
  - OpenSSL (C ヘッダファイルを含む) バージョン 1.1.1 以降
  - `build-essential`, `zlib1g-dev`, `gperf`, `libreadline-dev`, `ccache`, `libmicrohttpd-dev`, `pkg-config`, `libsodium-dev`, `libsecp256k1-dev`, `liblz4-dev`

### Ubuntu で

```bash
apt update
sudo apt install build-essential cmake clang openssl libssl-dev zlib1g-dev gperf libreadline-dev ccache libmicrohttpd-dev pkg-config libsodium-dev libsecp256k1-dev liblz4-dev
```

3. `~/ton`ディレクトリにソースツリーを取得したとします。 `~`があなたのホームディレクトリで、空のディレクトリ`~/ton-build`を作成しました：

```bash
mkdir ton-build
```

次に、Linux または MacOS の端末で以下を実行します。

```bash
cd ton-build
export CC=clang
export CXX=clang++
cmake -DCMAKE_BUILD_TYPE=Release ../ton && cmake --build . -j$(nproc)
```

### MacOS

必要なシステムパッケージをインストールしてシステムを準備します

```zsh
brew install ninja libsodium libmicrohttpd pkg-config automake libtool autoconf gnutls
brew install llvm@16
```

新しくインストールされたclangを使用してください。

```zsh
  export CC=/opt/homebrew/opt/llvm@16/bin/clang
  export CXX=/opt/homebrew/opt/llvm@16/bin/clang++
```

secp256k1をコンパイル

```zsh
  git clone https://github.com/bitcoin-core/secp256k1.git
  cd secp256k1
  secp256k1Path=`pwd`
  git checkout v0.3.2
  ./autogen.sh
  ./configure --enable-module-recovery --enable-static --disable-tests --disable-benchmark
  make -j12
```

そしてlz4:

```zsh
  git clone https://github.com/lz4/lz4
  cd lz4
  lz4Path=`pwd`
  git checkout v1.9.4
  make -j12
```

そして再リンク OpenSSL 3.0

```zsh
brew unlink openssl@1.1
brew install openssl@3
brew unlink openssl@3 &&  brew link --overwrite openssl@3
```

TON をコンパイルできるようになりました

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

:::tip
If you are compiling on a computer with low memory (e.g., 1 Gb), don't forget to [create a swap partitions](/v3/guidelines/smart-contracts/howto/compile/instructions-low-memory).
:::

## Download global config

For tools like lite client you need to download the global network config.

Download the newest configuration file from https://ton-blockchain.github.io/global.config.json for mainnet:

```bash
wget https://ton-blockchain.github.io/global.config.json
```

or from https://ton-blockchain.github.io/testnet-global.config.json for testnet:

```bash
wget https://ton-blockchain.github.io/testnet-global.config.json
```

## Lite client

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
./crypto/func -o output.fif -SPA source0.fc source1.fc ...
```

## Fift

To build Fift compiler from source code, do [common part](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common) described above and then:

```bash
cmake --build . --target fift
```

To run Fift script:

```bash
./crypto/fift -s script.fif script_param0 script_param1 ..
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
./rldp-http-proxy/rldp-http-proxy
```

## Generate-random-id

To build generate-random-id, do [common part](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common) and then do:

```bash
cmake --build . --target generate-random-id
```

The binary will be located as:

```bash
./utils/generate-random-id
```

## Storage-daemon

To build storage-daemon and storage-daemon-cli, do [common part](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common) and then do:

```bash
cmake --build . --target storage-daemon storage-daemon-cli
```

The binary will be located at:

```bash
./storage/storage-daemon/
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

## Compile old versions on Apple M1

TON supports Apple M1 from 11 Jun 2022 ([Add apple m1 support (#401)](https://github.com/ton-blockchain/ton/commit/c00302ced4bc4bf1ee0efd672e7c91e457652430) commit).

To compile older TON revisions on Apple M1:

1. Update RocksDb submodule to 6.27.3

   ```bash
   cd ton/third-party/rocksdb/
   git checkout fcf3d75f3f022a6a55ff1222d6b06f8518d38c7c
   ```

2. Replace root `CMakeLists.txt` by https://github.com/ton-blockchain/ton/blob/c00302ced4bc4bf1ee0efd672e7c91e457652430/CMakeLists.txt

<Feedback />

