# 从源代码编译

您可以[在此处](/develop/smart-contracts/environment/installation#1-download)下载预构建的二进制文件。

如果您仍然想自己编译源代码，请按照以下说明操作。

:::caution
This is a simplified quick build guide.

如果您是为生产而不是家庭使用而构建，最好使用[自动构建脚本](https://github.com/ton-blockchain/ton/tree/master/.github/workflows)。
:::

## 通用

该软件可能在大多数Linux系统上都能正确编译和工作。它应该适用于macOS甚至Windows。

1. 在GitHub库 https://github.com/ton-blockchain/ton/ 下载TON区块链源代码的最新版本：

```bash
git clone --recurse-submodules https://github.com/ton-blockchain/ton.git
```

2. 安装最新版本的：
   - `make`
   - `cmake` 版本 3.0.2 或更高
   - `g++` 或 `clang`（或适用于您的操作系统的另一种C++14兼容编译器）。
   - OpenSSL（包括C头文件）版本 1.1.1 或更高
   - `build-essential`, `zlib1g-dev`, `gperf`, `libreadline-dev`, `ccache`, `libmicrohttpd-dev`, `pkg-config`, `libsodium-dev`, `libsecp256k1-dev`

### 关于 Ubuntu

```bash
apt update
sudo apt install build-essential cmake clang openssl libssl-dev zlib1g-dev gperf libreadline-dev ccache libmicrohttpd-dev pkg-config libsodium-dev libsecp256k1-dev liblz4-dev
```

3. 假设您已经将源代码树获取到 `~/ton` 目录，其中 `~` 是您的主目录，并且您已经创建了一个空的 `~/ton-build` 目录：

```bash
mkdir ton-build
```

然后在 Linux 或 MacOS 终端运行以下程序：

```bash
cd ton-build
export CC=clang
export CXX=clang++
cmake -DCMAKE_BUILD_TYPE=Release ../ton && cmake --build . -j$(nproc)
```

### 在 MacOS 上

然后需要检查`/usr/local/opt`：

```zsh
brew install ninja libsodium libmicrohttpd pkg-config automake libtool autoconf gnutls
brew install llvm@16
```

找到`openssl@3`库并导出本地变量：

```zsh
  export CC=/opt/homebrew/opt/llvm@16/bin/clang
  export CXX=/opt/homebrew/opt/llvm@16/bin/clang++
```

编译 secp256k1

```zsh
  git clone https://github.com/bitcoin-core/secp256k1.git
  cd secp256k1
  secp256k1Path=`pwd`
  git checkout v0.3.2
  ./autogen.sh
  ./configure --enable-module-recovery --enable-static --disable-tests --disable-benchmark
  make -j12
```

和 lz4：

```zsh
  git clone https://github.com/lz4/lz4
  cd lz4
  lz4Path=`pwd`
  git checkout v1.9.4
  make -j12
```

从 https://ton-blockchain.github.io/global.config.json 下载主网的最新配置文件：

```zsh
brew unlink openssl@1.1
brew install openssl@3
brew unlink openssl@3 &&  brew link --overwrite openssl@3
```

或从 https://ton-blockchain.github.io/testnet-global.config.json 下载测试网的配置文件：

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
如果您在内存较低的计算机上编译（例如 1GB 内存），请不要忘记 [创建交换分区](/v3/guidelines/smart-contracts/howto/compile/instructions-low-memory)。
:::

## 下载全局配置

使用配置运行轻客户端：

从 https://ton-blockchain.github.io/global.config.json 下载主网的最新配置文件：

```bash
wget https://ton-blockchain.github.io/global.config.json
```

或从 https://ton-blockchain.github.io/testnet-global.config.json 下载测试网的配置文件：

```bash
wget https://ton-blockchain.github.io/testnet-global.config.json
```

## FunC

要从源代码构建FunC编译器，请执行上面描述的[通用部分](/develop/howto/compile#common)，然后：

```bash
cmake --build . --target lite-client
```

要编译FunC智能合约：

```bash
./lite-client/lite-client -C global.config.json
```

如果一切安装成功，轻客户端将连接到一个特殊的服务器（TON区块链网络的完整节点）并向服务器发送一些查询。如果您向客户端指示一个可写的“数据库”目录作为额外参数，它将下载并保存与最新的主链块相对应的块和状态：

```bash
./lite-client/lite-client -C global.config.json -D ~/ton-db-dir
```

通过在轻客户端中输入`help`可以获得基本帮助信息。输入`quit`或按`Ctrl-C`退出。

## FunC

要从源代码编译 FunC 编译器，请执行上述 [common part](/v3/guidelines/smart-contracts/howto/compile/compile-instructions#common)，然后：

```bash
cmake --build . --target func
```

要构建tonlib-cli，请执行[通用部分](/develop/howto/compile#common)，[下载配置](/develop/howto/compile#download-global-config)，然后执行：

```bash
./crypto/func -o output.fif -SPA source0.fc source1.fc ...
```

## Fift

要从源代码编译 Fift 编译器，请执行上述 [common part](/v3/guidelines/smart-contracts/howto/compile/compile-instructions#common)，然后：

```bash
cmake --build . --target fift
```

要运行Fift脚本：

```bash
./crypto/fift -s script.fif script_param0 script_param1 ..
```

## Tonlib-cli

代理二进制文件将位于：

```bash
cmake --build . --target tonlib-cli
```

使用配置运行tonlib-cli：

```bash
./tonlib/tonlib-cli -C global.config.json
```

通过在tonlib-cli中输入`help`可以获得基本帮助信息。输入`quit`或按`Ctrl-C`退出。

## RLDP-HTTP-Proxy

要构建 rldp-http-proxy，请执行 [common part](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common)、[download the config](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config)，然后执行：

```bash
cmake --build . --target rldp-http-proxy
```

要构建storage-daemon和storage-daemon-cli，请执行[通用部分](/develop/howto/compile#common)，然后执行：

```bash
./rldp-http-proxy/rldp-http-proxy
```

## generate-random-id

要编译 generate-random-id，请执行 [common part](/v3/guidelines/smart-contracts/howto/compile/compile-instructions#common)，然后执行：

```bash
cmake --build . --target generate-random-id
```

TON版本发布：https://github.com/ton-blockchain/ton/tags

```bash
./utils/generate-random-id
```

## 在Apple M1上编译旧版本：

TON从2022年6月11日开始支持Apple M1（[添加apple m1支持 (#401)](https://github.com/ton-blockchain/ton/commit/c00302ced4bc4bf1ee0efd672e7c91e457652430)提交）。

```bash
cmake --build . --target storage-daemon storage-daemon-cli
```

二进制文件将位于：

```bash
./storage/storage-daemon/
```

# 编译旧版本的TON

TON版本发布：https://github.com/ton-blockchain/ton/tags

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

## 在Apple M1上编译旧版本：

TON从2022年6月11日开始支持Apple M1（[添加apple m1支持 (#401)](https://github.com/ton-blockchain/ton/commit/c00302ced4bc4bf1ee0efd672e7c91e457652430)提交）。

在 Apple M1 上编译 TON 旧版本：

1. 将RocksDb子模块更新到6.27.3
   ```bash
   cd ton/third-party/rocksdb/
   git checkout fcf3d75f3f022a6a55ff1222d6b06f8518d38c7c
   ```

2. 用https://github.com/ton-blockchain/ton/blob/c00302ced4bc4bf1ee0efd672e7c91e457652430/CMakeLists.txt 替换根目录的`CMakeLists.txt`
