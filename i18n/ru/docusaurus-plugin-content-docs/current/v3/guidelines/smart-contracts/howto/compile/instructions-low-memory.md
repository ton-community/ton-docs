# Компиляция TON на компьютерах с ограниченной памятью

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::caution
В этом разделе описываются инструкции и руководства по взаимодействию с TON на низком уровне.
:::

Создайте раздел подкачки для компиляции TON на компьютере с малым объемом памяти (менее 1 ГБ).

## Требования

Во время компиляции C++ в системе Linux возникают следующие ошибки, приводящие к прерыванию компиляции:

```
C++: fatal error: Killed signal terminated program cc1plus compilation terminated.
```

## Решение

Это происходит из-за нехватки памяти и решается путем создания разделов подкачки.

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

Команда для удаления раздела подкачки:

```bash
sudo swapoff /var/cache/swap/swap0
sudo rm /var/cache/swap/swap0
```

Команда освобождения места:

```bash
sudo swapoff -a
#Detailed usage: swapoff --help
#View current memory usage: --swapoff: free -m
```
