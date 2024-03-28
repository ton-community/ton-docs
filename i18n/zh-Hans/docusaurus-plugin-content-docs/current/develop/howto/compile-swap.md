# 在低内存机器上编译TON

:::caution
本节描述了与TON进行低层级交互的说明和手册。
:::

在内存较小（小于1GB）的计算机上创建交换分区以编译TON。

## 必要条件

在Linux系统中进行C++编译时出现以下错误，导致编译中止：

```
C++: fatal error: Killed signal terminated program cc1plus compilation terminated.
```

## 解决方案

这是由于内存不足引起的，通过创建交换分区来解决。

```bash
# 创建分区路径
sudo mkdir -p /var/cache/swap/
# 设置分区大小
# bs=64M是块大小，count=64是块数，所以交换空间大小为bs*count=4096MB=4GB
sudo dd if=/dev/zero of=/var/cache/swap/swap0 bs=64M count=64
# 为此目录设置权限
sudo chmod 0600 /var/cache/swap/swap0
# 创建SWAP文件
sudo mkswap /var/cache/swap/swap0
# 激活SWAP文件
sudo swapon /var/cache/swap/swap0
# 检查SWAP信息是否正确
sudo swapon -s
```

删除交换分区的命令：

```bash
sudo swapoff /var/cache/swap/swap0
sudo rm /var/cache/swap/swap0
```

释放空间命令：

```bash
sudo swapoff -a
#详细使用方法：swapoff --help
#查看当前内存使用情况：--swapoff: free -m
```
