# 存储守护程序

*存储守护程序是用于在TON网络中下载和共享文件的程序。`storage-daemon-cli`控制台程序用于管理正在运行的存储守护程序。*

当前版本的存储守护程序可以在[Testnet](https://github.com/ton-blockchain/ton/tree/testnet)分支中找到。

## 硬件要求

- 至少1GHz和2核CPU
- 至少2 GB RAM
- 至少2 GB SSD（不计算种子文件占用空间）
- 10 Mb/s网络带宽，具有静态IP

## 二进制文件

您可以从[TON自动构建](https://github.com/ton-blockchain/ton/releases/latest)下载适用于Linux/Windows/MacOS的`storage-daemon`和`storage-daemon-cli`二进制文件。

## 从源代码编译

您可以使用此[说明](/develop/howto/compile#storage-daemon)从源代码编译`storage-daemon`和`storage-daemon-cli`。

## 关键概念

- *文件包*或*包* - 通过TON存储分发的文件集合
- TON存储的网络部分基于类似于种子的技术，因此术语*种子*、*文件包*和*包*将互换使用。但重要的是要注意一些区别：TON存储通过[ADNL](/learn/networking/adnl)通过[RLDP](/learn/networking/rldp)协议传输数据，每个*包*通过其自己的网络覆盖层分发，merkle结构可以存在两个版本 - 用于高效下载的大块和用于高效所有权证明的小块，以及[TON DHT](/learn/networking/ton-dht)网络用于查找节点。
- *文件包*由*种子信息*和数据块组成。
- 数据块以*种子头*开头 - 包含文件列表及其名称和大小的结构。文件本身紧随在数据块中。
- 数据块被划分为块（默认为128 KB），并且在这些块的 SHA256 散列上构建了一个 *merkle 树*（由 TVM cell构成）。这允许构建和验证单个块的 *merkle 证明*，以及通过仅交换修改块的证明来高效重建 *包*。
- *种子信息*包含*merkle根*：
  - 块大小（数据块）
  - 块大小列表
  - Hash *merkle树*
  - 描述 - 种子创建者指定的任何文本
- *种子信息*被序列化为TVM cell。此cell的哈希称为*BagID*，它唯一标识*包*。
- *包元数据*是一个包含*种子信息*和*种子头*的文件。\*这是`.torrent`文件的类比。

## 启动存储守护程序和storage-daemon-cli

### 启动存储守护程序的示例命令：

`storage-daemon -v 3 -C global.config.json -I <ip>:3333 -p 5555 -D storage-db`

- `-v` - 详细程度（INFO）
- `-C` - 全局网络配置（[下载全局配置](/develop/howto/compile#download-global-config)）
- `-I` - ADNL的IP地址和端口
- `-p` - 控制台接口的TCP端口
- `-D` - 存储守护程序数据库的目录

### storage-daemon-cli管理

它的启动方式如下：

```
storage-daemon-cli -I 127.0.0.1:5555 -k storage-db/cli-keys/client -p storage-db/cli-keys/server.pub
```

- `-I` - 守护程序的IP地址和端口（端口与上面的`-p`参数相同）
- `-k` 和 `-p`- 这是客户端的私钥和服务器的公钥（类似于`validator-engine-console`）。这些密钥在守护程序第一次运行时生成，并放置在`<db>/cli-keys/`中。

### 命令列表

`storage-daemon-cli`命令列表可以使用`help`命令获取。

命令有位置参数和标志。带空格的参数应用引号（`'`或`"`）括起来，也可以转义空格。还可以使用其他转义，例如：

```
create filename\ with\ spaces.txt -d "Description\nSecond line of \"description\"\nBackslash: \"
```

`--`后的所有参数都是位置参数。可以用它来指定以破折号开头的文件名：

```
create -d "Description" -- -filename.txt
```

`storage-daemon-cli` 可以通过传递要执行的命令来以非交互模式运行：

```
storage-daemon-cli ... -c "add-by-meta m" -c "list --hashes"
```

## 添加文件包

要下载 *文件包*，您需要知道其 `BagID` 或拥有一个元文件。以下命令可用于添加下载 *包*：

```
add-by-hash <hash> -d directory
add-by-meta <meta-file> -d directory
```

*包* 将被下载到指定的目录。您可以省略它，然后它将被保存到存储守护程序目录中。

:::info
哈希以十六进制形式指定（长度 - 64个字符）。
:::

通过元文件添加 *包* 时，有关 *包* 的信息将立即可用：大小，描述，文件列表。通过哈希添加时，您将必须等待这些信息被加载。

## 管理添加的包

- `list` 命令输出 *包* 列表。
- `list --hashes` 输出带有完整哈希的列表。

在所有后续命令中，`<BagID>` 要么是哈希（十六进制），要么是会话中 *包* 的序号（可以在 `list` 命令中看到的数字）。*包* 的序号不会在 storage-daemon-cli 重启之间保存，并且在非交互模式下不可用。

### 方法

- `get <BagID>` - 输出有关 *包* 的详细信息：描述，大小，下载速度，文件列表。
- `get-peers <BagID>` - 输出对方节点列表。
- `download-pause <BagID>`、`download-resume <BagID>` - 暂停或恢复下载。
- `upload-pause <BagID>`、`upload-resume <BagID>` - 暂停或恢复上传。
- `remove <BagID>` - 移除 *包*。`remove --remove-files` 还会删除 *包* 的所有文件。请注意，如果 *包* 保存在内部存储守护程序目录中，无论如何都会删除文件。

## 部分下载，优先级

:::info
添加 *包* 时，您可以指定您想从中下载哪些文件：
:::

```
add-by-hash <hash> -d dir --partial file1 file2 file3
add-by-meta <meta-file> -d dir --partial file1 file2 file3
```

### 优先级

*包文件* 中的每个文件都有一个优先级，从 0 到 255 的数字。优先级 0 表示文件不会被下载。`--partial` 标志位将指定的文件设置为优先级 1，其余文件设置为 0。

可以使用以下命令更改已添加 *包* 中的优先级：

- `priority-all <BagID> <priority>` - 对所有文件。
- `priority-idx <BagID> <idx> <priority>` - 根据数字为单个文件设置（见 `get` 命令）。
- `priority-name <BagID> <name> <priority>` - 根据名称为单个文件设置。
  即使在文件列表下载之前，也可以设置优先级。

## 创建文件包

要创建 *包* 并开始分发它，请使用 `create` 命令：

```
create <path>
```

`<path>` 可以指向单个文件或目录。创建 *包* 时，您可以指定描述：

```
create <path> -d "Bag of Files description"
```

创建 *包* 后，控制台将显示有关它的详细信息（包括哈希，即通过该哈希标识 *包* 的 `BagID`），并且守护程序将开始分发种子。`create` 的额外选项：

- `--no-upload` - 守护程序不会向对方节点分发文件。可以使用 `upload-resume` 启动上传。
- `--copy` - 文件将被复制到存储守护程序的内部目录中。

要下载 *包*，其他用户只需知道其哈希即可。您还可以保存种子元文件：

```
get-meta <BagID> <meta-file>
```
