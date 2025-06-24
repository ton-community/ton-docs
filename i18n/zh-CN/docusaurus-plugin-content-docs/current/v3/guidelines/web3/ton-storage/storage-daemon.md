import Feedback from '@site/src/components/Feedback';

# Storage daemon

_存储守护程序是用于在TON网络中下载和共享文件的程序。`storage-daemon-cli`控制台程序用于管理正在运行的存储守护程序。_ The `storage-daemon-cli` console program manages a running storage daemon.

当前版本的存储守护程序可以在[Testnet](https://github.com/ton-blockchain/ton/tree/testnet)分支中找到。

## 硬件要求

- 至少1GHz和2核CPU
- 至少2 GB RAM
- 至少2 GB SSD（不计算种子文件占用空间）
- 10 Mb/s网络带宽，具有静态IP

## Binaries

您可以从[TON自动构建](https://github.com/ton-blockchain/ton/releases/latest)下载适用于Linux/Windows/MacOS的`storage-daemon`和`storage-daemon-cli`二进制文件。

## 从源代码编译

您可以使用此[说明](/develop/howto/compile#storage-daemon)从源代码编译`storage-daemon`和`storage-daemon-cli`。

## 关键概念

- _文件包_或_包_ - 通过TON存储分发的文件集合

- TON存储的网络部分基于类似于种子的技术，因此术语_种子_、_文件包_和_包_将互换使用。但重要的是要注意一些区别：TON存储通过[ADNL](/learn/networking/adnl)通过[RLDP](/learn/networking/rldp)协议传输数据，每个_包_通过其自己的网络覆盖层分发，merkle结构可以存在两个版本 - 用于高效下载的大块和用于高效所有权证明的小块，以及[TON DHT](/learn/networking/ton-dht)网络用于查找节点。 However, there are some important differences:
  - Data is transferred over [ADNL](/v3/documentation/network/protocols/adnl/overview) using the [RLDP](/v3/documentation/network/protocols/rldp) protocol.
  - Each bag is distributed via its overlay network.
  - The Merkle structure can exist in two formats: one with large chunks for efficient downloading and one with smaller chunks for efficient proof of ownership.
  - The [TON DHT](/v3/documentation/network/protocols/dht/ton-dht) network is used to discover peers.

- A **bag of files** includes:
  - Torrent info.
  - Data block - starts with a torrent header including file names and sizes, followed by the files themselves.

The data block is divided into chunks, with a default size of 128 KB. A merkle tree built from TVM cells is constructed on the SHA256 hashes of these chunks. This structure enables the creation and verification of _merkle proofs_ for individual chunks and allows efficient reconstruction of the _bag_ by exchanging only the proof of the changed chunk.

- _种子信息_包含_merkle根_：
  - 块大小（数据块）
  - 块大小列表
  - Hash _merkle树_
  - 描述 - 种子创建者指定的任何文本

- Torrent info is serialized into a TVM cell. _种子信息_被序列化为TVM cell。此cell的哈希称为_BagID_，它唯一标识_包_。

- _包元数据_是一个包含_种子信息_和_种子头_的文件。\*这是`.torrent`文件的类比。 This file serves the same purpose as a `.torrent` file.

## 启动存储守护程序和storage-daemon-cli

### storage-daemon-cli管理

**Example**

`storage-daemon -v 3 -C global.config.json -I <ip>:3333 -p 5555 -D storage-db`

- `-v` - 详细程度（INFO）
- `-C` - 全局网络配置（[下载全局配置](/develop/howto/compile#download-global-config)）
- `-I` - ADNL的IP地址和端口
- `-p` - 控制台接口的TCP端口
- `-D` - 存储守护程序数据库的目录

### 存储守护程序

它的启动方式如下：

```
storage-daemon-cli -I 127.0.0.1:5555 -k storage-db/cli-keys/client -p storage-db/cli-keys/server.pub
```

- `-I` - 守护程序的IP地址和端口（端口与上面的`-p`参数相同）
- `-k` 和 `-p`- 这是客户端的私钥和服务器的公钥（类似于`validator-engine-console`）。这些密钥在守护程序第一次运行时生成，并放置在`<db>/cli-keys/`中。 These are auto-generated at first daemon startup and stored in `<db>/cli-keys/`.

### 命令列表

`storage-daemon-cli`命令列表可以使用`help`命令获取。

Commands include _positional parameters_ and _flags_.

- Parameters that contain spaces must be enclosed in quotes, using either single `'` or double `"` quotation marks.
- Alternatively, spaces can be escaped.
- Other common escape sequences are also supported.

**Example**

```
create filename\ with\ spaces.txt -d "Description\nSecond line of \"description\"\nBackslash: \\"
```

All parameters following the `--` flag are treated as positional parameters. This allows specifying filenames that begin with a dash:

```
create -d "Description" -- -filename.txt
```

`storage-daemon-cli` 可以通过传递要执行的命令来以非交互模式运行：

```
storage-daemon-cli ... -c "add-by-meta m" -c "list --hashes"
```

## 管理添加的包

要下载 _文件包_，您需要知道其 `BagID` 或拥有一个元文件。以下命令可用于添加下载 _包_： Use the following commands to add a _bag_ for download:

```
add-by-hash <hash> -d directory
add-by-meta <meta-file> -d directory
```

_包_ 将被下载到指定的目录。您可以省略它，然后它将被保存到存储守护程序目录中。 It will be saved to the default storage daemon directory if not specified.

:::info
哈希以十六进制形式指定（长度 - 64个字符）。
:::

When adding a bag via a metafile, information such as size, description, and file list becomes available immediately. When adding by hash, this information may take time to load.

## Managing added bags

- The `list` command shows all added bags.
- `list --hashes` 输出带有完整哈希的列表。

In the following commands, `<BagID>` can be either a bag's hexadecimal hash or its ordinal number in the current session, which is visible in the list output using `list` command. Note that ordinal numbers of bags are not persistent and are unavailable in non-interactive mode.

### 方法

- `get <BagID>` - 输出有关 _包_ 的详细信息：描述，大小，下载速度，文件列表。
- `get-peers <BagID>` - 输出对方节点列表。
- `download-pause <BagID>`、`download-resume <BagID>` - 暂停或恢复下载。
- `upload-pause <BagID>`、`upload-resume <BagID>` - 暂停或恢复上传。
- `remove <BagID>` - 移除 _包_。`remove --remove-files` 还会删除 _包_ 的所有文件。请注意，如果 _包_ 保存在内部存储守护程序目录中，无论如何都会删除文件。
- `remove --remove-files` also removes the bag and its files. Note that if the bag is saved in the internal storage daemon directory, the files will be deleted in any case.

## 部分下载，优先级

:::info
添加 _包_ 时，您可以指定您想从中下载哪些文件：
:::

```
add-by-hash <hash> -d dir --partial file1 file2 file3
add-by-meta <meta-file> -d dir --partial file1 file2 file3
```

### 优先级

Each file in a bag has a priority from 0 to 255. A priority of 0 means the file will not be downloaded. The `--partial` flag sets selected files to priority 1 and all others to 0.

To update priorities after adding a bag:

- `priority-all <BagID> <priority>` - 对所有文件。
- `priority-idx <BagID> <idx> <priority>` - 根据数字为单个文件设置（见 `get` 命令）。
- `priority-name <BagID> <name> <priority>` - 根据名称为单个文件设置。
  即使在文件列表下载之前，也可以设置优先级。

You can set priorities even before the file list is fully available.

## 创建文件包

要创建 _包_ 并开始分发它，请使用 `create` 命令：

```
create <path>
```

`<path>` 可以指向单个文件或目录。创建 _包_ 时，您可以指定描述： Add a description if needed:

```
create <path> -d "Bag of Files description"
```

创建 _包_ 后，控制台将显示有关它的详细信息（包括哈希，即通过该哈希标识 _包_ 的 `BagID`），并且守护程序将开始分发种子。`create` 的额外选项：
Additional options for the `create` command:

- `--no-upload` - daemon will not distribute files to peers. Upload can be started using the `upload-resume` command.
- `--copy` - 文件将被复制到存储守护程序的内部目录中。

To download the bag, other users need to know its hash. You can also save the torrent metafile:

```
get-meta <BagID> <meta-file>
```

<Feedback />

