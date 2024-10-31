# Lite Client

## Overview

Lite Client is a native software that allows you to read information from TON Blockchain.
Clients, such as wallets, do not store the full state of the blockchain but instead request only the necessary information from full nodes.

Lite Client is a standalone utility that can run without any dependencies. It can be downloaded from [precompiled binaries](/v3/documentation/archive/precompiled-binaries#1-download) or [compiled from sources](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#lite-client).

## Hardware requirements

Recommendations to run a Lite Client:

- 32MB RAM 
- 1 core CPU 
- 64 MB disk space
- an internet connection

:::info
Lite Client's memory and disk usage can vary depending on how it is used. It caches blocks during the session, and if the session is prolonged and requires multiple requests to different blocks, then it will store all the results on the disk. This may lead to an increase in memory and disk space usage.
:::
