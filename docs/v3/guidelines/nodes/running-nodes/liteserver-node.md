import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Liteserver Node

:::info
Read about [Full Node](/v3/guidelines/nodes/running-nodes/full-node) before this article
:::

When an endpoint is activated in a full node, the node assumes the role of a **Liteserver**. This node type can field and respond to requests from Lite Clients, allowing for seamless interaction with the TON Blockchain.

## Hardware requirements

Compared to a [validator](/v3/guidelines/nodes/running-nodes/full-node#hardware-requirements), a liteserver mode requires less resources. However, it is still recommended to use a powerful machine to run a liteserver.

- at least 16 cores CPU
- at least 128 GB RAM
- at least 1TB GB NVMe SSD _OR_ Provisioned 64+k IOPS storage
- 1 Gbit/s network connectivity
- 16 TB/month traffic on peak load
- public IP address (_fixed IP address_)

### Recommended Providers

Feel free to use cloud providers listed in the [Recommended Providers](/v3/guidelines/nodes/running-nodes/full-node#recommended-providers) section.

Hetzner and OVH are forbidden to run a validator, but you can use them to run a liteserver:

- __Hetzner__: EX101, AX102
- __OVH__: RISE-4

## Installation of liteserver

If you don't have mytonctrl, install it with `-m liteserver` flag:

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

* `-d` - **mytonctrl** will download a [dump](https://dump.ton.org/) of the latest blockchain state.
  This will reduce synchronization time by several times.
* `-c <path>` - If you want to use not public liteservers for synchronization. _(not required)_
* `-i` - Ignore minimum requirements, use it only if you want to check compilation process without real node usage.
* `-m` - Mode, can be `validator` or `liteserver`.

**To use testnet**, `-c` flag should be provided with `https://ton.org/testnet-global.config.json` value.

Default `-c` flag value is `https://ton-blockchain.github.io/global.config.json`, which is default mainnet config.

If you already have mytonctrl installed, run:

```bash
user@system:~# mytonctrl
MyTonCtrl> enable_mode liteserver
```

## Check the firewall settings

First, verify the Liteserver port specified in your `/var/ton-work/db/config.json` file. This port changes with each new installation of `MyTonCtrl`. It is located in the `port` field:

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

## Interaction with Liteserver (lite-client)

0. Create an empty project on your machine and paste `config.json` in the project directory. This config can be obtained by following command:

```bash
installer clcf # in mytonctrl
```

It will create `/usr/bin/ton/local.config.json` on your machine where mytonctrl is installed. Check [mytonctrl documentation for more](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview#clcf).

1. Install libraries.

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

2. Initialize a  and request masterchain info to ensure the liteserver is running.

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

3. Now you can interact with your own liteserver.

## See also

* [[YouTube]Tutorial how to launch liteserver](https://youtu.be/p5zPMkSZzPc)
