import Feedback from '@site/src/components/Feedback';

# 在 Docker 中运行 MyTonCtrl

This guide provides a step-by-step process for installing MyTonCtrl using Docker.

## 硬件要求

To ensure an optimal experience while running MyTonCtrl, here are the recommended hardware specifications:

- 16 核 CPU
- 128 GB 内存
- 1TB NVME SSD 或预置 64+k IOPS 存储器
- 1 Gbit/s 网络连接
- 公共 IP 地址（固定 IP 地址）
- 峰值流量为每月 16 TB

:::warning
This setup is primarily intended for testing purposes, so it may not be suitable for production environments. If you’d like to bypass hardware checks for any reason, you can easily do this by setting the variable `IGNORE_MINIMAL_REQS=true`.
:::

## 软件要求：

To get started, please ensure you have the following software installed:

- docker-ce
- docker-ce-cli
- containerd.io
- docker-buildx-plugin
- docker-compose-plugin

_官方 [Docker](https://docs.docker.com/engine/install/)中的安装指南_

## 测试运行系统：

We’ve successfully tested MyTonCtrl on these operating systems:

- Ubuntu 20.04
- Ubuntu 22.04
- Ubuntu 24.04
- Debian 11
- Debian 12

## 使用官方 docker 镜像运行 MyTonCtrl v2：

Here’s how you can pull the image and set up your MyTonCtrl node:

```bash
默认情况下，TON 和 Mytoncore 作品存储在 **/var/lib/docker/volumes/** 中。
```

## 使用 MyTonCtrl 提取镜像并运行节点

If you prefer to install from source, just follow these easy steps:

1. Clone the repository with the latest version:

````bash
docker run -d --name ton-node -v <YOUR_LOCAL_FOLDER>:/var/ton-work -it ghcr.io/ton-community/ton-docker-ctrl:latest


## Install and start MyTonCtrl from sources:

1. Clone the last version of the repository
```bash
git clone https://github.com/ton-community/ton-docker-ctrl.git
````

2. Change into the project directory:

```bash
cd ./ton-docker-ctrl
```

3. Open the `.env` file and make any necessary updates:

```bash
vi .env
```

4. 开始组装 docker 镜像。这一步包括编译最新版本的 fift、validator-engine、lite-client 等，以及安装和初始设置 MyTonCtrl。

```bash
docker compose build ton-node
```

5. MyTonCtrl 的开始

```bash
docker compose up -d
```

## 将非 docker fullnode 或验证器迁移到 docker 化的 MyTonCtrl v2

指定 TON 二进制文件和源代码的路径，以及 TON 工作目录的路径，但最重要的是 MyTonCtrl 设置和钱包的路径。

```bash
docker run -d --name ton-node --restart always \
-v <EXISTING_TON_WORK_FOLDER>:/var/ton-work \
-v /usr/bin/ton:/usr/bin/ton \
-v /usr/src/ton:/usr/src/ton \
-v /home/<USER>/.local/share:/usr/local/bin \
ghcr.io/ton-community/ton-docker-ctrl:latest
```

## 变量设置：

.env 文件中的变量

- **GLOBAL_CONFIG_URL** - TON 区块链的网络配置（默认值：[Testnet](https://ton.org/testnet-global.config.json)）
- **MYTONCTRL_VERSION** - 编译 MyTonCtrl 时的 Git 分支
- **TELEMETRY** - 启用/禁用遥测功能
- **MODE** - 将 MyTonCtrl 设置为指定模式（验证器(validator) 或 liteserver ）
- **IGNORE_MINIMAL_REQS** - 忽略硬件要求

## 停止并删除 MyTonCtrl：

连接到 MyTonCtrl 时，将自动进行更新验证。如果检测到任何更新，则会显示一条信息"_MyTonCtrl 更新可用。请使用 `update` 命令进行更新。_"

1. 停止容器

```bash
docker compose stop
```

2. 删除容器

```bash
docker compose down
```

3. 删除包含数据的容器

```bash
docker compose down --volumes
```

## 连接到 MyTonCtrl：

反映可访问的命令列表 `help`

```bash
docker compose exec -it ton-node bash -c "mytonctrl"
```

一旦连接成功，就可以使用命令 `status` 检查状态

```bash
MyTonCtrl> status
```

![](https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/screens/mytonctrl-status.png)

And if you would like to see a list of commands you can use, simply enter:

```bash
MyTonCtrl> help
```

## 查看 MyTonCtrl 日志：

Monitoring the situation is simple, as you can easily view the logs:

```bash
docker compose logs
```

## 更新 MyTonCtrl 和 TON：

要获得最新版本的 TON 验证器和 MyTonCtrl，需要使用 docker-compose.yml 进入目录，然后进行编译。

```bash
cd ./ton-docker-ctrl
docker compose build ton-node
```

完成后，再次启动 Docker Compose

```bash
docker compose up -d
```

When you’re connected to MyTonCtrl, it will automatically check for updates. If any are available, you’ll see a message saying, “``MyTonCtrl update available. Please update it with the `update` command``”.  更新可使用更新命令，通过指定必要的分支来完成

```bash
MyTonCtrl> update mytonctrl2
```

## 更改数据存储路径：

TON and MyTonCore data is stored in `/var/lib/docker/volumes/`by default. 你可以在文件 docker-compose.yml 中进行修改，方法是在 **volumes** 部分指出所需的路由 <Feedback />

