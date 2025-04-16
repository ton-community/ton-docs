# Компиляция из исходного кода

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Вы можете скачать предварительно скомпилированные двоичные файлы [здесь](/v3/documentation/archive/precompiled-binaries#1-download).

Если вы все же хотите скомпилировать исходники самостоятельно, следуйте инструкциям ниже.

:::caution
This is a simplified quick build guide.

Если ваша сборка предназначена не для домашнего использования, лучше использовать [скрипты автосборки](https://github.com/ton-blockchain/ton/tree/master/.github/workflows).
:::

## Общее

Программное обеспечение, скорее всего, будет компилироваться и правильно работать на большинстве систем Linux. Оно должно работать на macOS и даже на Windows.

1. Загрузите последнюю версию исходников TON Blockchain, доступную в репозитории GitHub https://github.com/ton-blockchain/ton/:

```bash
git clone --recurse-submodules https://github.com/ton-blockchain/ton.git
```

2. Установите последние версии:
  - `make`
  - `cmake` 3.0.2 или более поздней версии
  - `g++` или `clang` (или другой C++14-совместимый компилятор, подходящий для вашей операционной системы)
  - `OpenSSL` 1.1.1 (включая заголовочные файлы на языке C) версии 1.1.1 или более поздней
  - `build-essential`, `zlib1g-dev`, `gperf`, `libreadline-dev`, `ccache`, `libmicrohttpd-dev`, `pkg-config`, `libsodium-dev`, `libsecp256k1-dev`, `liblz4-dev`.

### Ubuntu

```bash
apt update
sudo apt install build-essential cmake clang openssl libssl-dev zlib1g-dev gperf libreadline-dev ccache libmicrohttpd-dev pkg-config libsodium-dev libsecp256k1-dev liblz4-dev
```

3. Предположим, что вы загрузили дерево исходного кода в каталог `~/ton`, где `~` - ваш домашний каталог, и создали пустой каталог `~/ton-build`:

```bash
mkdir ton-build
```

Затем выполните следующие действия в терминале Linux или MacOS:

```bash
cd ton-build
export CC=clang
export CXX=clang++
cmake -DCMAKE_BUILD_TYPE=Release ../ton && cmake --build . -j$(nproc)
```

### MacOS

Подготовьте систему, установив необходимые системные пакеты:

```zsh
brew install ninja libsodium libmicrohttpd pkg-config automake libtool autoconf gnutls
brew install llvm@16
```

Используйте только что установленный clang:

```zsh
  export CC=/opt/homebrew/opt/llvm@16/bin/clang
  export CXX=/opt/homebrew/opt/llvm@16/bin/clang++
```

Скомпилируйте secp256k1:

```zsh
  git clone https://github.com/bitcoin-core/secp256k1.git
  cd secp256k1
  secp256k1Path=`pwd`
  git checkout v0.3.2
  ./autogen.sh
  ./configure --enable-module-recovery --enable-static --disable-tests --disable-benchmark
  make -j12
```

И lz4:

```zsh
  git clone https://github.com/lz4/lz4
  cd lz4
  lz4Path=`pwd`
  git checkout v1.9.4
  make -j12
```

Установите и выберите OpenSSL 3.0:

```zsh
brew unlink openssl@1.1
brew install openssl@3
brew unlink openssl@3 &&  brew link --overwrite openssl@3
```

Теперь вы можете скомпилировать TON:

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
Если вы компилируете на компьютере с небольшим объемом памяти (например, 1 Гб), не забудьте [создать раздел подкачки] (/v3/guidelines/smart-contracts/howto/compile/instructions-low-memory).
:::

## Загрузка Global Config

Для таких инструментов, как Lite Client, вам необходимо загрузить сетевой Global Config.

Загрузите актуальный файл конфигурации https://ton-blockchain.github.io/global.config.json для mainnet:

```bash
wget https://ton-blockchain.github.io/global.config.json
```

или https://ton-blockchain.github.io/testnet-global.config.json для testnet:

```bash
wget https://ton-blockchain.github.io/testnet-global.config.json
```

## Lite Client

Чтобы собрать Lite Client, выполните шаги выше: [общее](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common), [загрузка config](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config), а затем запустите сборку:

```bash
cmake --build . --target lite-client
```

Запустите Lite Client с Global Config:

```bash
./lite-client/lite-client -C global.config.json
```

Если все установлено успешно, Lite Client подключится к специальному серверу (полноценному узлу сети TON Blockchain) и отправит на него несколько запросов.
Если вы укажете в качестве дополнительного аргумента доступный для записи каталог "database", Lite Client загрузит и сохранит блок и состояние, соответствующие самому новому мастерчейн-блоку:

```bash
./lite-client/lite-client -C global.config.json -D ~/ton-db-dir
```

Основную справочную информацию можно получить, набрав `help` в Lite Client. Для выхода введите `quit` или нажмите `Ctrl-C`.

## FunC

Чтобы собрать компилятор FunC из исходного кода, выполните [общее](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common) выше, и запустите сборку:

```bash
cmake --build . --target func
```

Скомпилируйте смарт-контракт FunC:

```bash
./crypto/func -o output.fif -SPA source0.fc source1.fc ...
```

## Fift

Чтобы собрать компилятор Fift из исходного кода, выполните [общее](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common) выше, и запустите сборку:

```bash
cmake --build . --target fift
```

Запустите скрипт Fift:

```bash
./crypto/fift -s script.fif script_param0 script_param1 ..
```

## Tonlib-cli

Чтобы собрать tonlib-cli, выполните [общее](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common), [загрузка config](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config), а затем запустите сборку:

```bash
cmake --build . --target tonlib-cli
```

Запустите tonlib-cli с Global Config:

```bash
./tonlib/tonlib-cli -C global.config.json
```

Основную справочную информацию можно получить, набрав `help` в tonlib-cli. Для выхода введите `quit` или нажмите `Ctrl-C`.

## RLDP-HTTP-Proxy

Чтобы собрать rldp-http-proxy, выполните [общее](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common), [загрузка config](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config), а затем запустите сборку:

```bash
cmake --build . --target rldp-http-proxy
```

Двоичный файл rldp-http-proxy будет иметь расположение:

```bash
./rldp-http-proxy/rldp-http-proxy
```

## generate-random-id

Чтобы собрать generate-random-id, выполните [общее](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common) и запустите сборку:

```bash
cmake --build . --target generate-random-id
```

Двоичный файл generate-random-id будет иметь расположение:

```bash
./utils/generate-random-id
```

## storage-daemon

Чтобы собрать storage-daemon и storage-daemon-cli, выполните [общее](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#common) и запустите сборку:

```bash
cmake --build . --target storage-daemon storage-daemon-cli
```

Двоичные файлы будут иметь расположение:

```bash
./storage/storage-daemon/
```

# Компиляция старых версий TON

Выпуски TON: https://github.com/ton-blockchain/ton/tags

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

## Компиляция старых версий на Apple M1:

TON поддерживает Apple M1 с 11 июня 2022 года ([Добавить поддержку Apple M1 (#401)](https://github.com/ton-blockchain/ton/commit/c00302ced4bc4bf1ee0efd672e7c91e457652430)).

Для компиляции старых ревизий TON на Apple M1:

1. Обновите субмодуль RocksDb до версии 6.27.3
  ```bash
  cd ton/third-party/rocksdb/
  git checkout fcf3d75f3f022a6a55ff1222d6b06f8518d38c7c
  ```

2. Замените `CMakeLists.txt` в корневом каталоге на https://github.com/ton-blockchain/ton/blob/c00302ced4bc4bf1ee0efd672e7c91e457652430/CMakeLists.txt
