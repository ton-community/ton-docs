import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Liteserver 节点

:::info
阅读本文之前，请先阅读 [全节点](/v3/guidelines/nodes/running-nodes/full-node)
:::

当在全节点上激活端点时，节点将承担 **Liteserver** 的角色。这种节点类型可以处理并响应来自轻客户端的请求，允许与TON区块链无缝互动。

## 硬件要求

与 [validator](/v3/guidelines/nodes/running-nodes/full-node#hardware-requirements) 相比，liteserver 模式所需的资源较少。不过，我们仍然建议使用功能强大的机器来运行 liteserver。

- 至少 16 核 CPU
- 至少 128GB 内存
- 至少 1TB GB NVMe SSD *或* Provisioned 64+k IOPS storage
- 1 Gbit/s 网络连接
- 峰值流量为每月 16 TB
- 公共 IP 地址（*固定 IP 地址*）

### 推荐供应商

请使用 [推荐提供商](/v3/guidelines/nodes/running-nodes/full-node#recommended-providers) 部分中列出的云提供商。

Hetzner 和 OVH 被禁止运行验证器，但您可以使用它们运行点服务器：

- **Hetzner**: EX101, AX102
- **OVH**: RISE-4

## 安装 liteserver

如果没有 mytonctrl，请使用 `-m liteserver` 标志安装：

<Tabs groupId="operating-systems">
  <TabItem value="ubuntu" label="Ubuntu">

```bash
wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
sudo bash ./install.sh -m liteserver
```

  </TabItem>
  <TabItem value={'debian'} label={'Debian'}>

```bash
wget https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/scripts/install.sh
su root -c 'bash ./install.sh -m liteserver'
```

  </TabItem>
</Tabs>

- `-d` - **mytonctrl**将下载最新区块链状态的[dump](https://dump.ton.org/)。
  这将使同步时间缩短数倍。
- `-c<path>` - 如果要使用非公共 liteservers 进行同步。*（非必填）*
- `-i` - 忽略最低要求，只有在不使用实际节点的情况下检查编译过程时才使用。
- `-m` - 模式，可以是 `validator` 或 `liteserver`。

**要使用 testnet**，应在 `-c` 标志中加入 `https://ton.org/testnet-global.config.json` 值。

默认的 `-c` 标志值为 `https://ton-blockchain.github.io/global.config.json`，这是默认的主网配置。

如果已经安装了 mytonctrl，请运行

```bash
user@system:~# mytonctrl
MyTonCtrl> enable_mode liteserver
```

## 检查防火墙设置

首先，确认在 `/var/ton-work/db/config.json` 文件中指定的 Liteserver 端口。每次新安装 `MyTonCtrl` 时，该端口都会改变。它位于 `port` 字段：

```json
{
  ...
  "liteservers": [
    {
      "ip": 1605600994,
      "port": LITESERVER_PORT
      ...
    }
  ]
}
```

如果使用的是云提供商，则需要在防火墙设置中打开该端口。例如，如果使用 AWS，则需要在[安全组](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html)中打开该端口。

以下是在裸机服务器防火墙中打开端口的示例。

### 在防火墙中打开一个端口

我们将使用 `ufw` 工具（[cheatsheet](https://www.cyberciti.biz/faq/ufw-allow-incoming-ssh-connections-from-a-specific-ip-address-subnet-on-ubuntu-debian/)）。您可以使用自己喜欢的工具。

1. 如果未安装 `ufw` 则安装：

```bash
sudo apt update
sudo apt install ufw
```

2. 允许 ssh 连接：

```bash
sudo ufw allow ssh
```

3. 允许使用 `config.json` 文件中指定的端口：

```bash
sudo ufw allow <port>
```

4. 启用防火墙：

```bash
sudo ufw enable
```

5. 检查防火墙状态：

```bash
sudo ufw status
```

这样，您就可以在服务器的防火墙设置中打开端口。

## 与 Lites 服务器（lite-client）交互

0. 在机器上创建一个空项目，并在项目目录中粘贴 `config.json`。该配置可通过以下命令获取：

```bash
installer clcf # in mytonctrl
```

它将在安装了 mytonctrl 的机器上创建 `/usr/bin/ton/local.config.json`。查看 [mytonctrl 文档了解更多信息](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview#clcf)。

1. 安装库。

<Tabs groupId="code-examples">
  <TabItem value="js" label="JavaScript">

```bash
npm i --save ton-core ton-lite-
```

  </TabItem>
  <TabItem value="python" label="Python">

```bash
pip install pytonlib
```

  </TabItem>
  <TabItem value="go" label="Golang">

```bash
go get github.com/xssnick/tonutils-go
go get github.com/xssnick/tonutils-go/lite
go get github.com/xssnick/tonutils-go/ton
```

  </TabItem>
</Tabs>

2. 初始化主链并请求主链信息，以确保 liteserver 正在运行。

<Tabs groupId="code-examples">
  <TabItem value="js" label="JavaScript">

在 `package.json` 文件中将项目类型更改为 `module`：

```json
{
    "type": "module"
}
```

创建包含以下内容的 `index.js` 文件：

```js
import { LiteSingleEngine } from 'ton-lite-/dist/engines/single.js'
import { LiteRoundRobinEngine } from 'ton-lite-/dist/engines/roundRobin.js'
import { Lite } from 'ton-lite-/dist/.js'
import config from './config.json' assert {type: 'json'};


function intToIP(int ) {
    var part1 = int & 255;
    var part2 = ((int >> 8) & 255);
    var part3 = ((int >> 16) & 255);
    var part4 = ((int >> 24) & 255);

    return part4 + "." + part3 + "." + part2 + "." + part1;
}

let server = config.liteservers[0];

async function main() {
    const engines = [];
    engines.push(new LiteSingleEngine({
        host: `tcp://${intToIP(server.ip)}:${server.port}`,
        publicKey: Buffer.from(server.id.key, 'base64'),
    }));

    const engine = new LiteRoundRobinEngine(engines);
    const  = new Lite({ engine });
    const master = await .getMasterchainInfo()
    console.log('master', master)

}

main()

```

  </TabItem>
  <TabItem value="python" label="Python">

```python
  from pytoniq import LiteClient

  async def main():
      client = LiteClient.from_mainnet_config(  # choose mainnet, testnet or custom config dict
          ls_i=0,  # index of liteserver from config
          trust_level=2,  # trust level to liteserver
          timeout=15  # timeout not includes key blocks synchronization as it works in pytonlib
      )
  
      await client.connect()
  
      await client.get_masterchain_info()
  
      await client.reconnect()  # can reconnect to an exising object if had any errors
  
      await client.close()
  
      """ or use it with context manager: """
      async with LiteClient.from_mainnet_config(ls_i=0, trust_level=2, timeout=15) as client:
          await client.get_masterchain_info()

```

  </TabItem>
  <TabItem value="go" label="Golang">

```go
package main

import (
    "context"
    "encoding/json"
    "io/ioutil"
    "log"
    "github.com/xssnick/tonutils-go/liteclient"
    "github.com/xssnick/tonutils-go/ton"
)

func main() {
    client := liteclient.NewConnectionPool()

    content, err := ioutil.ReadFile("./config.json")
    if err != nil {
        log.Fatal("Error when opening file: ", err)
    }

    config := liteclient.GlobalConfig{}
    err = json.Unmarshal(content, &config)
    if err != nil {
        log.Fatal("Error during Unmarshal(): ", err)
    }

    err = client.AddConnectionsFromConfig(context.Background(), &config)
    if err != nil {
        log.Fatalln("connection err: ", err.Error())
        return
    }

    // initialize ton API lite connection wrapper
    api := ton.NewAPIClient(client)

    master, err := api.GetMasterchainInfo(context.Background())
    if err != nil {
        log.Fatalln("get masterchain info err: ", err.Error())
        return
    }

    log.Println(master)
}

```

  </TabItem>
</Tabs>

3. 现在，你可以与自己的 liteserver 交互了。

## 另见

- [[YouTube]教程如何启动liteserver](https://youtu.be/p5zPMkSZzPc)
