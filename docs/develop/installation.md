# Installation

## Prerequisites

For local development of TON smart contracts you always need to prepare binaries of `func`, `fift` and `lite-client` on your machine.

You can download and setup them below.

## Precompiled binaries

### Download
 
Download the binaries from the table below - make sure to select the correct version according to the operating system you're using and install the additional dependencies:

| OS                     | fift | func                                                                                           | lite-client | Additional dependencies |
|------------------------|------|------------------------------------------------------------------------------------------------|-------------|-------|
| MacOS M1               | [download](https://github.com/ton-defi-org/ton-binaries/releases/download/macos-m1/fift) | [download](https://github.com/ton-defi-org/ton-binaries/releases/download/macos-m1/func)       | [download](https://github.com/ton-defi-org/ton-binaries/releases/download/macos-m1/lite-client) | `brew install openssl` |
| MacOS Intel            | [download](https://github.com/ton-defi-org/ton-binaries/releases/download/macos-intel/fift) | [download](https://github.com/ton-defi-org/ton-binaries/releases/download/macos-intel/func)    | [download](https://github.com/ton-defi-org/ton-binaries/releases/download/macos-intel/lite-client) | `brew install openssl`<br/>`brew reinstall readline` |
| Windows 64             | [download](https://github.com/ton-defi-org/ton-binaries/releases/download/windows-64/fift.exe) | [download](https://github.com/ton-defi-org/ton-binaries/releases/download/windows-64/func.exe) | [download](https://github.com/ton-defi-org/ton-binaries/releases/download/windows-64/lite-client.exe) | Install [OpenSSL 1.1.1](https://slproweb.com/download/Win64OpenSSL_Light-1_1_1q.msi) |
| Ubuntu 18              | [download](https://github.com/ton-defi-org/ton-binaries/releases/download/ubuntu-18/fift) | [download](https://github.com/ton-defi-org/ton-binaries/releases/download/ubuntu-18/func)      | [download](https://github.com/ton-defi-org/ton-binaries/releases/download/ubuntu-18/lite-client) | `sudo apt install libssl-dev` |
| Ubuntu 16              | [download](https://github.com/ton-defi-org/ton-binaries/releases/download/ubuntu-16/fift) | [download](https://github.com/ton-defi-org/ton-binaries/releases/download/ubuntu-16/func)      | [download](https://github.com/ton-defi-org/ton-binaries/releases/download/ubuntu-16/lite-client) | `sudo apt install libssl-dev` |
| Debian 10 | [download](https://github.com/ton-defi-org/ton-binaries/releases/download/debian-10/fift) | [download](https://github.com/ton-defi-org/ton-binaries/releases/download/debian-10/func)      | [lite-client](https://github.com/ton-defi-org/ton-binaries/releases/download/debian-10/lite-client) | `sudo apt install libssl-dev` |

### Setup your binaries

#### Linux / MacOS

1. After download, make sure the downloaded binaries are executable by changing their permissions:
   ```bash
   chmod +x func
   chmod +x fift
   chmod +x lite-client
   ```
   
2. It's also useful to place these binaries in your path (or copy them to `/usr/local/bin`) to make sure you can access them from anywhere.
   ```bash
   cp ./func /usr/local/bin/func
   cp ./fift /usr/local/bin/fift
   cp ./lite-client /usr/local/bin/lite-client
   ```

3. To check that everything was installed correctly, run in terminal
   ```bash
   fift -V && func -V && lite-client -V
   ```

4. If you plan to use `fift`, also download [fiftlib.zip](https://github.com/ton-defi-org/ton-binaries/releases/download/fiftlib/fiftlib.zip), open the zip in some directory on your machine (like `/usr/local/lib/fiftlib`) and set the environment variable `FIFTPATH` to point to this directory.
   ```bash
   unzip fiftlib.zip
   mkdir -p /usr/local/lib/fiftlib
   cp fiftlib/* /usr/local/lib/fiftlib
   ```

:::info Hey, you're almost finished :)
Remember to set the **environment variable** `FIFTPATH` to point to this directory.
:::

## Build from source

If you don't want to rely on pre-compiled binaries and prefer to compile the binaries by yourself, you can follow the [official instructions](https://ton.org/#/compile). The gist instructions provided below:

### Linux (Ubuntu / Debian)

```bash
sudo apt update
sudo apt install git make cmake g++ libssl-dev zlib1g-dev wget
cd ~ && git clone https://github.com/ton-blockchain/ton.git
cd ~/ton && git submodule update --init
mkdir ~/ton/build && cd ~/ton/build && cmake .. -DCMAKE_BUILD_TYPE=Release && make -j 4
```
## Other sources for binaries

The core team provides automatic builds for several operating systems as [GitHub Actions](https://github.com/ton-blockchain/ton/actions).

Click on the link above, choose the workflow on the left relevant to your operating system, click on a recent green passing build and under "Artifacts" download `ton-binaries`.
