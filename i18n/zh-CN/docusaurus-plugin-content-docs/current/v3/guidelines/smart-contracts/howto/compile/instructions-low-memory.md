# 在低内存机器上编译TON

:::caution
本节描述了与TON进行低层级交互的说明和手册。
:::

在内存较小（小于1GB）的计算机上创建交换分片以编译TON。

## 必要条件

在Linux系统中进行C++编译时出现以下错误，导致编译中止：

```
C++: fatal error: Killed signal terminated program cc1plus compilation terminated.
```

## 解决方案

这是由于内存不足引起的，通过创建交换分片来解决。

```bash
# Create the partition path
sudo mkdir -p /var/cache/swap/
# Set the size of the partition
# bs=64M is the block size, count=64 is the number of blocks, so the swap space size is bs*count=4096MB=4GB
sudo dd if=/dev/zero of=/var/cache/swap/swap0 bs=64M count=64
# Set permissions for this directory
sudo chmod 0600 /var/cache/swap/swap0
# Create the SWAP file
sudo mkswap /var/cache/swap/swap0
# Activate the SWAP file
sudo swapon /var/cache/swap/swap0
# Check if SWAP information is correct
sudo swapon -s
```

删除交换分片的命令：

```bash
sudo swapoff /var/cache/swap/swap0
sudo rm /var/cache/swap/swap0
```

释放空间命令：

```bash
sudo swapoff -a
#Detailed usage: swapoff --help
#View current memory usage: --swapoff: free -m
```
