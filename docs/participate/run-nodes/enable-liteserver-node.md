import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Liteserver Node

:::info
Read about [Full Node](/participate/run-nodes/full-node) before this article
:::

When an endpoint is activated in a full node, the node assumes the role of a **Liteserver**. This node type can field and respond to requests from Lite Clients, allowing for seamless interaction with the TON Blockchain.

## Hardware requirements

Compared to a [validator](/participate/run-nodes/full-node#hardware-requirements), a liteserver mode requires less resources. However, it is still recommended to use a powerful machine to run a liteserver.

- at least 16 cores CPU
- at least 128 GB RAM
- at least 1TB GB NVMe SSD _OR_ Provisioned 32+k IOPS storage
- 1 Gbit/s network connectivity
- 16 TB/month traffic on peak load
- public IP address (_fixed IP address_)

### Recommended Providers

Feel free to use cloud providers listed in the [Recommended Providers](/participate/run-nodes/full-node#recommended-providers) section.

Hetzner and OVH are forbidden to run a validator, but you can use them to run a liteserver:

- __Hetzner__: EX101, AX102
- __OVH__: RISE-4

## Installation of liteserver

1. Complete the previous steps to install [MyTonCtrl](/participate/run-nodes/full-node#run-a-node-text).

2. Create a config file

```bash
MyTonCtrl> installer
MyTonInstaller> clcf

Local config file created: /usr/bin/ton/local.config.json
```

3. This file will help you to connect to your liteserver. Copy the config file located on the specified path to your home to save it.

```bash
cp /usr/bin/ton/local.config.json ~/config.json
```

4. Create an empty `config.json` file on your local machine.

5. Copy the content from the console to your local machine `config.json` file.

```bash
cat ~/config.json
```

## Check the firewall settings

First, verify the Liteserver port specified in your `config.json` file. This port changes with each new installation of `MyTonCtrl`. It is located in the `port` field:

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

If you are using a cloud provider, you need to open this port in the firewall settings. For example, if you are using AWS, you need to open the port in the [security group](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html).

Below is an example of opening a port in the bare metal server firewall.

### Opening a port in the firewall

We will use the `ufw` utility ([cheatsheet](https://www.cyberciti.biz/faq/ufw-allow-incoming-ssh-connections-from-a-specific-ip-address-subnet-on-ubuntu-debian/)). You can use the one you prefer.

1. Install `ufw` if it is not installed:

```bash
sudo apt update
sudo apt install ufw
```

2. Allow ssh connections:

```bash
sudo ufw allow ssh
```

3. Allow the port specified in the `config.json` file:

```bash
sudo ufw allow <port>
```

4. Enable the firewall:

```bash
sudo ufw enable
```

5. Check the firewall status:

```bash
sudo ufw status
```

This way, you can open the port in the firewall settings of your server.

## Interaction with Liteserver (Lightclient)

0. Create an empty project on your machine and paste `config.js` in the project directory.

1. Install libraries.

<Tabs groupId="code-examples">
  <TabItem value="js" label="JavaScript">

  ```bash
  npm i --save ton-core ton-lite-client
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
  go get github.com/xssnick/tonutils-go/liteclient
  go get github.com/xssnick/tonutils-go/ton
  ```
  </TabItem>
</Tabs>

2. Initialize a client and request masterchain info to ensure the liteserver is running.

<Tabs groupId="code-examples">
  <TabItem value="js" label="JavaScript">

Change project type to `module` in your `package.json` file:

  ```json
  {
      "type": "module"
  }
  ```

Create `index.js` file with the following content:
  ```js
  import { LiteSingleEngine } from 'ton-lite-client/dist/engines/single.js'
  import { LiteRoundRobinEngine } from 'ton-lite-client/dist/engines/roundRobin.js'
  import { LiteClient } from 'ton-lite-client/dist/client.js'
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
      const client = new LiteClient({ engine });
      const master = await client.getMasterchainInfo()
      console.log('master', master)

  }

  main()

  ```

  </TabItem>
  <TabItem value="python" label="Python">

  ```python
    import asyncio
    from pytonlib import TonlibClient
    from pathlib import Path
    import json


    async def get_client() -> TonlibClient:
    with open('config.json', 'r') as f:
    config = json.loads(f.read())

    keystore_dir = '/tmp/ton_keystore'
    Path(keystore_dir).mkdir(parents=True, exist_ok=True)

    client = TonlibClient(ls_index=0, config=config, keystore=keystore_dir, tonlib_timeout=10)
    await client.init()

    return client


    async def test_client():
    client = await get_client()

    print(await client.get_masterchain_info())

    await client.close()


    if __name__ == '__main__':
    asyncio.run(test_client())
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

3. Now you can interact with your own liteserver.

## See also

* [[YouTube]Tutorial how to launch liteserver](https://youtu.be/p5zPMkSZzPc)