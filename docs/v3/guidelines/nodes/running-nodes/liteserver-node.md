import Feedback from '@site/src/components/Feedback';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Liteserver node

:::info
Before reading this article, please refer to the section on [Full node](/v3/guidelines/nodes/running-nodes/full-node) for more information.
:::

When an endpoint is activated in a full node, that node becomes a **liteserver**. This type of node can handle and respond to requests from the lite-client, facilitating smooth interaction with the TON Blockchain.

## Hardware requirements

Running a liteserver mode requires fewer resources than a [validator](/v3/guidelines/nodes/running-nodes/full-node#hardware-requirements), but it is still recommended that you use a powerful machine:

- minimum of 16-core CPU  
- minimum of 128 GB RAM  
- at least 1 TB NVMe SSD or provisioned storage with 64,000+ IOPS  
- 1 Gbps network connectivity  
- 16 TB of traffic per month during peak load  
- fixed public IP address  

### Recommended providers

Feel free to use the cloud providers listed in the [recommended providers](/v3/guidelines/nodes/running-nodes/full-node#recommended-providers) section.

Hetzner and OVH are not allowed to run a validator, but you can use them to run a liteserver:

- __Hetzner__: EX101, AX102
- __OVH__: RISE-4

## Installation of liteserver

If you don't have `MyTonCtrl`, install it using the `-m liteserver` flag.

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

- `-d`: The `MyTonCtrl` command will download a [dump](https://dump.ton.org/) of the latest blockchain state, significantly reducing synchronization time. 
- `-c <path>`: This option allows you to use private liteservers for synchronization. _(This option is not required.)_
- `-i`: Use this flag to ignore minimum requirements. It should only be used if you want to check the compilation process without utilizing a real node.
- `-m`: This specifies the mode and can be set to either `validator` or `liteserver`.

To use the Testnet, you must provide the `-c` flag with the value `https://ton.org/testnet-global.config.json.` The default value for the `-c` flag is `https://ton-blockchain.github.io/global.config.json`, which refers to the mainnet configuration. 

If you already have `MyTonCtrl` installed, run:

```bash
user@system:~# mytonctrl
MyTonCtrl> enable_mode liteserver
```

## Check the firewall settings

Firstly, check the liteserver port specified in your `/var/ton-work/db/config.json` file. This port may vary with each new installation of `MyTonCtrl` and can be found in the `port` field.

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

If you use a cloud provider, open this port in the firewall settings. For instance, if you are using AWS, you should open the port in the [security group](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html).

Here is an example of how to open a port in the firewall of a bare metal server:

### Opening a port in the firewall

We will use the `ufw` utility (see the [cheatsheet](https://www.cyberciti.biz/faq/ufw-allow-incoming-ssh-connections-from-a-specific-ip-address-subnet-on-ubuntu-debian/)). However, feel free to use any alternative that you prefer.

1. If `ufw` is not already installed, install it:

```bash
sudo apt update
sudo apt install ufw
```

2. Enable SSH connections:

```bash
sudo ufw allow ssh
```

3. Ensure that you allow the port indicated in the `config.json` file:

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

To do this, you can open the port in your server's firewall settings.

## Interaction with liteserver (lite-client)

1. Create a new project directory on your machine and place the `config.json` file in it. You can obtain this configuration by running the following command:

```bash
installer clcf # in mytonctrl
```

It will create a file at `/usr/bin/ton/local.config.json` on your machine where `MyTonCtrl` is installed. Check the [MyTonCtrl documentation for more information](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview#clcf).

2. Install libraries.

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
  go get github.com/xssnick/tonutils-go/lite
  go get github.com/xssnick/tonutils-go/ton
  ```
  </TabItem>
</Tabs>

3. Initialize and request MasterChain information to confirm that the liteserver is running properly.

<Tabs groupId="code-examples">
  <TabItem value="js" label="JavaScript">

Update the project type to `module` in your `package.json` file.

  ```json
  {
      "type": "module"
  }
  ```

Create a file named `index.js` and include the following content:
  ```js
  import { LiteSingleEngine } from 'ton-lite-client/dist/engines/single.js'
  import { LiteRoundRobinEngine } from 'ton-lite-client/dist/engines/roundRobin.js'
  import { Lite } from 'ton-lite-client/dist/.js'
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

4. You can now interact with your own liteserver.

## See also

- [YouTube-Tutorial how to launch a liteserver](https://youtu.be/p5zPMkSZzPc)
<Feedback />

