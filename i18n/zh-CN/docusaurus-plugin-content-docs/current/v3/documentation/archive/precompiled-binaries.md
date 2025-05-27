import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Button from '@site/src/components/button'

# 预编译二进制文件

:::caution 重要
您不再需要手动安装Blueprint SDK的二进制文件。
:::

Blueprint SDK已提供所有开发和测试所需的二进制文件。

<Button href="/develop/smart-contracts/sdk/javascript"
colorType="primary" sizeType={'sm'}>

迁移到Blueprint SDK

</Button>

## 预编译二进制文件

如果您不使用Blueprint SDK进行智能合约开发，您可以使用适用于您的操作系统和工具选择的预编译二进制文件。

### 先决条件

对于在本地开发TON智能合约 *无需Javascript*，您需要在您的设备上准备`func`、`fift`和`lite client`的二进制文件。

您可以从下表中下载并设置它们，或阅读TON Society的这篇文章：

- [设置TON开发环境](https://blog.ton.org/setting-up-a-ton-development-environment)

### 1. 下载

从下表中下载二进制文件。请确保选择适合您操作系统的正确版本，并安装任何附加依赖项：

| 操作系统                               | TON二进制文件                                                                                  | fift                                                                                   | func                                                                                   | lite-client                                                                                   | 附加依赖项                                                                                                   |
| ---------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| MacOS x86-64                       | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/ton-mac-x86-64.zip)   | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/fift-mac-x86-64)   | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/func-mac-x86-64)   | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/lite-client-mac-x86-64)   |                                                                                                         |
| MacOS arm64                        | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/ton-mac-arm64.zip)    |                                                                                        |                                                                                        |                                                                                               | `brew install openssl ninja libmicrohttpd pkg-config`                                                   |
| Windows x86-64                     | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/ton-win-x86-64.zip)   | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/fift.exe)          | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/func.exe)          | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/lite-client.exe)          | 安装 [OpenSSL 1.1.1](/ton-binaries/windows/Win64OpenSSL_Light-1_1_1q.msi) |
| Linux  x86_64 | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/ton-linux-x86_64.zip) | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/fift-linux-x86_64) | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/func-linux-x86_64) | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/lite-client-linux-x86_64) |                                                                                                         |
| Linux  arm64                       | [下载](https://github.com/ton-blockchain/ton/releases/latest/download/ton-linux-arm64.zip)  |                                                                                        |                                                                                        |                                                                                               | `sudo apt install libatomic1 libssl-dev`                                                                |

### 2. 设置您的二进制文件

export const Highlight = ({children, color}) => (
<span
style={{
backgroundColor: color,
borderRadius: '2px',
color: '#fff',
padding: '0.2rem',
}}>
{children}
</span>
);

<Tabs groupId="operating-systems">
  <TabItem value="win" label="Windows">

1. 下载后，您需要`创建`一个新文件夹。例如：**`C:/Users/%USERNAME%/ton/bin`**，并将安装的文件移动到那里。

2. 要打开Windows环境变量，请按键盘上的<Highlight color="#1877F2">Win + R</Highlight>按钮，键入`sysdm.cpl`，然后按Enter键。

3. 在“*高级*”选项卡上

4. 在_“用户变量”_部分，选择“*Path*”变量，然后点击<Highlight color="#1877F2">“编辑”</Highlight>（通常需要）。

5. 要在下一个窗口中为系统变量添加新值 `(路径)`，请单击<Highlight color="#1877F2">"新建 "</Highlight>按钮。
   在新字段中，您需要指定存储先前安装的文件的文件夹路径：

```
C:\Users\%USERNAME%\ton\bin\
```

6. 在_“用户变量”_部分，选择“*Path*”变量，然后点击<Highlight color="#1877F2">“编辑”</Highlight>（通常需要）。

```bash
fift -V -and func -V -and lite-client -V
```

7. 要检查是否一切安装正确，请在终端运行（*cmd.exe*）：

   1. 下载 [fiftlib.zip](/ton-binaries/windows/fiftlib.zip)
   2. 在机器上的某个目录（如 **`C:/Users/%USERNAME%/ton/lib/fiftlib`** ）中打开压缩包
   3. 在"*用户变量*"部分创建一个新的环境变量 "FIFTPATH"（点击 "<Highlight color="#1877F2">新建</Highlight>"按钮）。
   4. 在"*变量值*"字段中，指定文件的路径：**`/%USERNAME%/ton/lib/fiftlib`**，然后单击 "<Highlight color="#1877F2">确定</Highlight>"。完成。

:::caution important
您必须插入自己的 "用户名"，而不是 "%USERNAME%" 关键字。
:::

</TabItem>
<TabItem value="mac" label="Linux / MacOS">

1.下载后，通过更改权限确保下载的二进制文件可执行。
```bash
chmod +x func
chmod +x fift
chmod +x lite-client
```

2.将这些二进制文件添加到路径中（或复制到 `/usr/local/bin`）也很有用，这样你就可以在任何地方访问它们。
```bash
cp ./func /usr/local/bin/func
cp ./fift /usr/local/bin/fift
cp ./lite-client /usr/local/bin/lite-client
```

3.要检查一切安装是否正确，请在终端中运行
```bash
fift -V && func -V && lite-client -V
```

4.如果打算 `使用 fift`，还需下载 [fiftlib.zip](/ton-binaries/windows/fiftlib.zip)，在设备上的某个目录（如 `/usr/local/lib/fiftlib`）中打开该压缩包，并设置环境变量 `FIFTPATH` 指向该目录。
```
unzip fiftlib.zip
mkdir -p /usr/local/lib/fiftlib
cp fiftlib/* /usr/local/lib/fiftlib
```

:::info 嘿，你差不多完成了:)
记得设置[环境变量](https://stackoverflow.com/questions/14637979/how-to-permanently-set-path-on-linux-unix) `FIFTPATH`指向此目录。
:::

</TabItem>
</Tabs>

## 从源代码构建

如果不想依赖预编译的二进制文件，而是想自己编译二进制文件，可以按照[官方说明](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions) 进行编译。

下文提供了随时可用的要点说明：

### Linux （Ubuntu / Debian）

```bash
sudo apt update
sudo apt install git make cmake g++ libssl-dev zlib1g-dev wget
cd ~ && git clone https://github.com/ton-blockchain/ton.git
cd ~/ton && git submodule update --init
mkdir ~/ton/build && cd ~/ton/build && cmake .. -DCMAKE_BUILD_TYPE=Release && make -j 4
```

## Linux（Ubuntu / Debian）

核心团队以 [GitHub Actions](https://github.com/ton-blockchain/ton/releases/latest) 的形式为多个操作系统提供自动构建功能。

点击上面的链接，在左侧选择与你的操作系统相关的工作流，点击最近的绿色传递构建，然后在 "工件 "下下载 "ton-binaries"。
