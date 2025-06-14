import Feedback from '@site/src/components/Feedback';

# Compile TON on low-memory machines

:::caution
This section provides low-level instructions for working with TON.
:::

To compile TON on systems with limited memory (< 1 GB), you need to create swap partitions.

## 前提条件

When compiling C++ components on Linux, you may encounter memory-related failures:

```
C++: fatal error: Killed signal terminated program cc1plus
compilation terminated.
```

## 解決策

Follow these steps to create a 4GB swap partition:

```bash
# Create swap partition
sudo mkdir -p /var/cache/swap/

# Allocate 4GB swap space (64MB blocks × 64)
sudo dd if=/dev/zero of=/var/cache/swap/swap0 bs=64M count=64

# Set secure permissions
sudo chmod 0600 /var/cache/swap/swap0

# Initialize swap
sudo mkswap /var/cache/swap/swap0

# Activate swap
sudo swapon /var/cache/swap/swap0

# Verify activation
sudo swapon -s
```

### Swap management commands

**Remove swap partition:**

```bash
sudo swapoff /var/cache/swap/swap0
sudo rm /var/cache/swap/swap0
```

**Free all swap space:**

```bash
sudo swapoff -a
# Check memory: free -m
```

<Feedback />

