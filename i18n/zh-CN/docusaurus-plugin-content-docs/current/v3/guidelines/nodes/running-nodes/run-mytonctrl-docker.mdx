# 在 Docker 中运行 MyTonCtrl

## 硬件要求

- 16 核 CPU
- 128 GB 内存
- 1TB NVME SSD 或预置 64+k IOPS 存储器
- 1 Gbit/s 网络连接
- 公共 IP 地址（固定 IP 地址）
- 峰值流量为每月 16 TB

***不建议使用！***  ***仅供测试！***

变量 **IGNORE_MINIMAL_REQS=true** 关闭 CPU/RAM 需求验证。

## 软件要求：

- docker-ce
- docker-ce-cli
- containerd.io
- docker-buildx-plugin
- docker-compose-plugin

  *官方 [Docker](https://docs.docker.com/engine/install/)中的安装指南*

## 测试运行系统：

- Ubuntu 20.04
- Ubuntu 22.04
- Ubuntu 24.04
- Debian 11
- Debian 12

## 使用官方 docker 镜像运行 MyTonCtrl v2：

- 使用 MyTonCtrl 提取镜像并运行节点

````bash
docker run -d --name ton-node -v <YOUR_LOCAL_FOLDER>:/var/ton-work -it ghcr.io/ton-community/ton-docker-ctrl:latest


## Install and start MyTonCtrl from sources:

1. Clone the last version of the repository
```bash
git clone https://github.com/ton-community/ton-docker-ctrl.git
````

2. 转到目录

```bash
cd ./ton-docker-ctrl
```

3. 在 .env 文件中指明必要的值

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

```bash
docker compose exec -it ton-node bash -c "mytonctrl"
```

一旦连接成功，就可以使用命令 `status` 检查状态

```bash
MyTonCtrl> status
```

![](https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/screens/mytonctrl-status.png)

反映可访问的命令列表 `help`

```bash
MyTonCtrl> help
```

## 查看 MyTonCtrl 日志：

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

连接到 MyTonCtrl 时，将自动进行更新验证。如果检测到任何更新，则会显示一条信息"*MyTonCtrl 更新可用。请使用 `update` 命令进行更新。*"

更新可使用更新命令，通过指定必要的分支来完成

```bash
MyTonCtrl> update mytonctrl2
```

## 更改数据存储路径：

默认情况下，TON 和 Mytoncore 作品存储在 **/var/lib/docker/volumes/** 中。

你可以在文件 docker-compose.yml 中进行修改，方法是在 **volumes** 部分指出所需的路由
