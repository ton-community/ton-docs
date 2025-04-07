import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Узел Liteserver

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::info
Прочитайте о [Полном узле](/v3/guidelines/nodes/running-nodes/full-node) перед этой статьей
:::

Когда конечная точка активирована в полном узле, узел принимает на себя роль **Liteserver**. Этот тип узла может отправлять запросы от Легких клиентов и отвечать на них, обеспечивая бесперебойное взаимодействие с блокчейном TON.

## Требования к оборудованию

По сравнению с [validator](/v3/guidelines/nodes/running-nodes/full-node#hardware-requirements), режим liteserver требует меньше ресурсов. Тем не менее, для запуска liteserver по-прежнему рекомендуется использовать мощный компьютер.

- не менее 16 ядер процессора
- не менее 128 ГБ оперативной памяти
- твердотельный накопитель объемом 1 ТБ *или* Оборудованное хранилище с более 64 000 операций ввода/вывода в секунду (IOPS)
- Подключение к сети со скоростью 1 Гбит/с
- 16 ТБ/месяц трафика при пиковой нагрузке
- общедоступный IP-адрес (*фиксированный IP-адрес*)

### Рекомендованные провайдеры

Не стесняйтесь использовать облачных провайдеров, перечисленных в разделе [Рекомендуемые провайдеры](/v3/guidelines/nodes/running-nodes/full-node#recommended-providers).

На Hetzner и OVH запрещено запускать валидатора, но Вы можете использовать их для запуска liteserver:

- **Hetzner**: EX101, AX102
- **OVH**: RISE-4

## Установка liteserver

Если у Вас нет mytonctrl, установите его с флагом `-m liteserver`:

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

- `-d` - **mytonctrl** загрузит [дамп](https://dump.ton.org/) последнего состояния блокчейна.
  Это сократит время синхронизации в несколько раз.
- `-c <path>` - если вы хотите использовать не общедоступные liteservers для синхронизации. *(не обязательно)*
- `-i` - Игнорировать минимальные требования. Используйте только для проверки процесса компиляции без реального использования узла.
- `-m` - Режим, может быть `validator` или `liteserver`.

**Чтобы использовать testnet**, флагу `-c` должно быть присвоено значение `https://ton.org/testnet-global.config.json`.

Значение по умолчанию для флага `-c` равно `https://ton-blockchain.github.io/global.config.json`, что является конфигурацией по умолчанию для основной сети (mainnet).

Если у вас уже установлен mytonctrl, запустите:

```bash
user@system:~# mytonctrl
MyTonCtrl> enable_mode liteserver
```

## Проверьте настройки брандмауэра

Сначала убедитесь, что указан правильный порт Liteserver в файле`/var/ton-work/db/config.json`. Этот порт меняется при каждой новой установке `MyTonCtrl`. Он находится в поле `port`:

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

Если вы используете облачный провайдер, вам нужно открыть этот порт в настройках брандмауэра. Например, если вы используете AWS, вам нужно открыть порт в [группе безопасности](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html).

Вот пример открытия порта в брандмауэре сервера без виртуальной машины.

### Открытие порта в брандмауэре

Мы будем использовать утилиту `ufw` ([cheatsheet](https://www.cyberciti.biz/faq/ufw-allow-incoming-ssh-connections-from-a-specific-ip-address-subnet-on-ubuntu-debian/)). Вы можете использовать ту, которая вам больше нравится.

1. Установите `ufw`, если он не установлен:

```bash
sudo apt update
sudo apt install ufw
```

2. Разрешите ssh-соединение:

```bash
sudo ufw allow ssh
```

3. Разрешите порт, указанный в файле `config.json`:

```bash
sudo ufw allow <port>
```

4. Включите брандмауэр:

```bash
sudo ufw enable
```

5. Проверьте состояние брандмауэра:

```bash
sudo ufw status
```

Таким образом, вы можете открыть порт в настройках брандмауэра вашего сервера.

## Взаимодействие с Liteserver (lite-client)

0. Создайте пустой проект на своем компьютере и вставьте `config.json` в каталог проекта. Эту конфигурацию можно получить, выполнив команду:

```bash
installer clcf # in mytonctrl
```

Это создаст `/usr/bin/ton/local.config.json` на вашем компьютере, где установлен mytonctrl. Проверьте [документацию по mytonctrl для получения дополнительной информации] (/v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview#clcf).

1. Установите библиотеки.

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

2. Инициализируйте и запросите информацию о masterchain, чтобы убедиться, что liteserver работает.

<Tabs groupId="code-examples">
  <TabItem value="js" label="JavaScript">

Измените тип проекта на `module` в файле `package.json`:

```json
{
    "type": "module"
}
```

Создайте файл `index.js` со следующим содержимым:

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

3. Теперь вы можете взаимодействовать со своим собственным liteserver.

## См. также

- [[YouTube]инструкция по запуску liteserver]] (https://youtu.be/p5zPMkSZzPc)
