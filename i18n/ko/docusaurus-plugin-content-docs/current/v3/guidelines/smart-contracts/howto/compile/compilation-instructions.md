import Feedback from '@site/src/components/Feedback';

# Compile from sources

[여기](/v3/documentation/archive/precompiled-binaries#1-download)에서 미리 빌드된 바이너리를 다운로드할 수 있습니다.

여전히 직접 소스를 컴파일하고 싶다면, 아래 지침을 따르세요.

:::caution
This is a simplified quick build guide.

가정용이 아닌 프로덕션용으로 빌드하는 경우, [자동 빌드 스크립트](https://github.com/ton-blockchain/ton/tree/master/.github/workflows)를 사용하는 것이 좋습니다.
:::

## 공통

이 소프트웨어는 대부분의 Linux 시스템에서 컴파일되고 제대로 작동할 것입니다. macOS와 Windows에서도 작동해야 합니다.

1. GitHub 저장소 https://github.com/ton-blockchain/ton/에서 사용 가능한 최신 버전의 TON 블록체인 소스를 다운로드하세요:

```bash
git clone --recurse-submodules https://github.com/ton-blockchain/ton.git
```

2. 다음의 최신 버전을 설치하세요:
  - `make`
  - `cmake` 버전 3.0.2 이상
  - `g++` 또는 `clang` (또는 운영 체제에 적합한 다른 C++14 호환 컴파일러)
  - OpenSSL(C 헤더 파일 포함) 버전 1.1.1 이상
  - `build-essential`, `zlib1g-dev`, `gperf`, `libreadline-dev`, `ccache`, `libmicrohttpd-dev`, `pkg-config`, `libsodium-dev`, `libsecp256k1-dev`, `liblz4-dev`

### Ubuntu에서

```bash
apt update
sudo apt install build-essential cmake clang openssl libssl-dev zlib1g-dev gperf libreadline-dev ccache libmicrohttpd-dev pkg-config libsodium-dev libsecp256k1-dev liblz4-dev
```

3. 소스 트리를 홈 디렉토리 `~`의 `~/ton` 디렉토리로 가져왔고, 빈 디렉토리 `~/ton-build`를 만들었다고 가정합니다:

```bash
mkdir ton-build
```

그런 다음 Linux나 MacOS 터미널에서 다음을 실행하세요:

```bash
cd ton-build
export CC=clang
export CXX=clang++
cmake -DCMAKE_BUILD_TYPE=Release ../ton && cmake --build . -j$(nproc)
```

### MacOS에서

필요한 시스템 패키지를 설치하여 시스템 준비

```zsh
brew install ninja libsodium libmicrohttpd pkg-config automake libtool autoconf gnutls
brew install llvm@16
```

새로 설치된 clang 사용

```zsh
  export CC=/opt/homebrew/opt/llvm@16/bin/clang
  export CXX=/opt/homebrew/opt/llvm@16/bin/clang++
```

secp256k1 컴파일

```zsh
  git clone https://github.com/bitcoin-core/secp256k1.git
  cd secp256k1
  secp256k1Path=`pwd`
  git checkout v0.3.2
  ./autogen.sh
  ./configure --enable-module-recovery --enable-static --disable-tests --disable-benchmark
  make -j12
```

그리고 lz4:

```zsh
  git clone https://github.com/lz4/lz4
  cd lz4
  lz4Path=`pwd`
  git checkout v1.9.4
  make -j12
```

그리고 OpenSSL 3.0 다시 링크

```zsh
brew unlink openssl@1.1
brew install openssl@3
brew unlink openssl@3 &&  brew link --overwrite openssl@3
```

이제 TON을 컴파일할 수 있습니다

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

