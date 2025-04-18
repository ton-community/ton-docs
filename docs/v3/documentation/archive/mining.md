# TON mining guide

:::warning deprecated
This information may be outdated and no longer relevant. You can skip it.
:::


## <a id="introduction"></a>Introduction
This document provides an introduction to the process of mining Toncoin using PoW givers. Please visit [ton.org/mining](https://ton.org/mining) for up-to-date status of TON mining.

## <a id="quick-start"></a>Quick start
To start mining right away:

1. Get a [computer suitable for mining](#hardware).
2. Install [Ubuntu](https://ubuntu.com) 20.04 desktop or server distribution.
3. Install [mytonctrl](https://github.com/igroman787/mytonctrl#installation-ubuntu) in `lite` mode.
4. Check your hardware and [expected mining income](/v3/documentation/archive/mining#income-estimates) by running `emi` command within `mytonctrl`.
5. If you do not yet have one, create `wallet address` using one of the [wallets](https://www.ton.org/wallets).
6. Define your `wallet address` as a mining target by executing `set minerAddr "..."` in `mytonctrl`.
7. Chose a giver contract from the list available on [ton.org/mining](https://ton.org/mining) and set your miner to mine it by executing `set powAddr "..."` in `mytonctrl`.
8. Start mining by executing `mon` in `mytonctrl`
9. Check the CPU load on your computer; the process called `pow-miner` should use most of your CPU.
10. Wait to get lucky; the output of step 4 should have told you approximately what your chances are to mine a block.

## <a id="basics"></a>Basics
Toncoin is distributed by `PoW Givers`, which are smart contracts with specific amounts of Toncoin assigned to them. Currently, there are 10 active PoW givers on the TON Network. Each giver distributes coins in blocks of 100 TON. To earn one of these blocks, your computer must solve a complex mathematical challenge faster than other miners. If another miner solves the problem before you, your machine's work is discarded, and a new round begins.

Mining profits are not gradual; they come in batches of 100 TON for each successfully solved giver challenge. This means that if your machine has a 10% chance to calculate a block within 24 hours (see step 4 of [Quick start](/v3/documentation/archive/mining#quick-start)) then you will probably need to wait for ~10 days before you will get a 100 TON reward.

The process of mining is largely automated by `mytonctrl`. Detailed information about the mining process can be found in [PoW givers](https://www.ton.org/#/howto/pow-givers) document.

## <a id="advanced"></a>Advanced
If you're serious about mining and want to operate multiple machines or a mining farm, it's essential to learn about TON and how mining works. Refer to the [HOWTO](https://ton.org/#/howto/) section for detailed information. Here is some general advice:

* **DO** run your own node / lite server on a separate machine; this will ensure that your mining farm does not depend on external lite servers that can go down or not process your queries in a timely fashion.
* **DO NOT** bombard public lite servers with `get_pow_params` queries, if you have custom scripts that poll givers status in high frequency you **must** use your own lite server. Clients that violate this rule risk having their IPs blacklisted on public lite servers.
* **DO** try to understand how [mining process](https://www.ton.org/#/howto/pow-givers) works; most larger miners use their own scripts that offer many advantages over `mytonctrl` in environments with multiple mining machines.

## <a id="hardware"></a>Miner hardware
The total network hashrate of TON mining is very high; miners need high-performance machines if they wish to succeed. Mining on standard home computers and notebooks is futile, and we advise against such attempts.

#### CPU
A modern CPU with [Intel SHA Extension](https://en.wikipedia.org/wiki/Intel_SHA_extensions) support is **essential**. Most miners use AMD EPYC or Threadripper machines with at least 32 cores and 64 threads.

#### GPU
Yes! You can mine TON using GPU. There is a version of a PoW miner that is capable to use both Nvidia and AMD GPUs; you can find the code and instructions on how to use it in the [POW Miner GPU](https://github.com/tontechio/pow-miner-gpu/blob/main/crypto/util/pow-miner-howto.md) repository.

As for now, one needs to be tech-savvy to use this, but we are working on a more user-friendly solution.

#### Memory
Almost the entire mining process happens in the L2 cache of the CPU. That means that memory speed and size play no role in mining performance. A dual AMD EPYC system with a single DIMM on one memory channel will mine just as fast as one with 16 DIMMs occupying all channels.

Please do note that this applies to the plain mining process **only**, if your machine also runs full node or other processes, then things change! But this is outside the scope of this guide.

#### Storage
A miner running in lite mode uses minimal storage space and does not store data.

#### Network
Plain miner needs the ability to open outgoing connections to the Internet.

#### FPGA / ASIC
See [can I use FPGA / ASICs?](/v3/documentation/archive/mining#can-i-use-my-btceth-rig-to-mine-ton)

### <a id="hardware-cloud"></a>Cloud machines
Many people mine using AWS or Google compute cloud machines. As outlined in the specs above, what really matters is CPU. Therefore, we advise AWS [c5a.24xlarge](https://aws.amazon.com/ec2/instance-types/c5/) or Google [n2d-highcpu-224](https://cloud.google.com/compute/vm-instance-pricing) instances.

### <a id="hardware-estimates"></a>Income estimates
The formula for calculating the income is quite simple: `($total_bleed / $total_hashrate) * $your_hashrate`. This will give you a **current** estimate. You can find out the variables on [ton.org/mining](https://ton.org/mining) or use the estimated mining income calculator (`emi` command) in `mytonctrl`. Here is sample output made on August 7th, 2021 using i5-11400F CPU:
```
Mining income estimations
-----------------------------------------------------------------
Total network 24h earnings:         171635.79 TON
Average network 24h hashrate:       805276100000 HPS
Your machine hashrate:              68465900 HPS
Est. 24h chance to mine a block:    15%
Est. monthly income:                437.7 TON
```

**Important**: Please do note that the information provided is based on *network hashrate at the moment of execution*. Your actual income over time will depend on many factors, such as changing network hashrate, the chosen giver, and a good portion of luck.


## <a id="faq"></a>FAQ
### <a id="faq-general"></a>General
#### <a id="faq-general-posorpow"></a>Is TON PoS or PoW network?
TON Blockchain operates on a Proof-of-Stake (PoS) consensus. Mining is not required to create new blocks.
#### <a id="faq-general-pow"></a>So how come TON is Proof-of-Work?
Well, the reason is that the initial issue of 5 billion Toncoins were transferred to ad hoc Proof-of-Work Giver smart contracts.
Mining is used to obtain Toncoins from this smart contract.
#### <a id="faq-general-supply"></a>How many coins are left for mining?
The most actual information is available on [ton.org/mining](https://ton.org/mining), see `bleed` graphs. PoW Giver contracts have their limits and will dry out once users mine all the available Toncoins.
#### <a id="faq-general-mined"></a>How many coins have been mined already?
As of August 2021, about 4.9BN Toncoins have been mined.
#### <a id="faq-general-whomined"></a>Who has mined those coins?
Coins have been mined to over 70,000 wallets. The owners of these wallets remain unknown.
#### <a id="faq-general-elite"></a>Is it difficult to start mining?
Not at all. All you need is [adequate hardware](#hardware) and to follow the steps outlined in the [quick start](#quick-start) section.
#### <a id="faq-general-pissed"></a>Is there another way to mine?
Yes, there is a third-party app—[TON Miner Bot](https://t.me/TonMinerBot).
#### <a id="faq-general-stats"></a>Where can I see mining statistics?
[ton.org/mining](https://ton.org/mining)
#### <a id="faq-general-howmany"></a>How many miners are out there?
We cannot say this. All we know is the total hashrate of all miners on the network. However, there are graphs on [ton.org/mining](https://ton.org/mining) that attempt to estimate quantity of machines of certain type needed to provide approximate total hashrate.
#### <a id="faq-general-noincome"></a>Do I need Toncoin to start mining?
No, you do not. Anyone can start mining without owning a single Toncoin.
#### <a id="faq-mining-noincome"></a>Why does my wallet balance not increase, even after hours of mining?
TON are mined in blocks of 100, you either guess a block and receive 100 TON or receive nothing. Please see [basics](#basics).
#### <a id="faq-mining-noblocks"></a>I've been mining for days and I see no results, why?
Did you check your current [Income estimates](/v3/documentation/archive/mining#income-estimates)? If field `Est. 24h chance to mine a block` is less than 100%, then you need to be patient. Also, please note that a 50% chance to mine a block within 24 hours does not automatically mean that you will mine one within 2 days; 50% applies to each day separately.
#### <a id="faq-mining-pools"></a>Are there mining pools?
No, as of now there are no implementations of mining pools, everyone mines for themselves.
#### <a id="faq-mining-giver"></a>Which giver should I mine?
It does not really matter which giver you choose. The difficulty tends to fluctuate on each giver, so the current easiest giver on [ton.org/mining](https://ton.org/mining) might become the most complex within an hour. The same applies in the opposite direction.
### <a id="faq-hw"></a>Hardware
#### <a id="faq-hw-machine"></a>Will a faster machine always win?
No, all miners take different roads to find the solution. A faster machine has a higher probability of success, but it doesn't guarantee victory!
#### <a id="faq-hw-machine"></a>How much income will my machine generate?
Please see [Income estimates](/v3/documentation/archive/mining#income-estimates).
#### <a id="faq-hw-asic"></a>Can I use my BTC/ETH rig to mine TON?
No, TON uses a single SHA256 hashing method which is different from BTC, ETH, and others. ASICS or FPGAs which are built for mining other cryptos will not help. 
#### <a id="faq-hw-svsm"></a>What is better, a single fast machine or several slow ones?
This is controversial. See: miner software launches threads for each core on the system, and each core gets its own set of keys to process, so if you have one machine capable to run 64 threads and 4 x machines capable to run 16 threads each, then they will be exactly as successful assuming that the speed of each thread is the same.

In the real world, however, CPUs with lower core count are usually clocked higher, so you will probably have better success with multiple machines.
#### <a id="faq-hw-mc"></a>If I run many machines, will they cooperate?
No, they will not. Each machine mines on its own, but the solution finding process is random: no machine, not even a single thread (see above) will take the same path. Thus, their hashrates add up in your favor without direct cooperation.
#### <a id="faq-hw-CPU"></a>Can I mine using ARM CPUs?
Depending on the CPU, AWS Graviton2 instances are indeed very capable miners and are able to hold price/performance ratio alongside AMD EPYC-based instances.
### <a id="faq-software"></a>Software
#### <a id="faq-software-os"></a>Can I mine using Windows/xBSD/some other OS?
Of course, [TON source code](https://github.com/ton-blockchain/ton) has been known to be built on Windows, xBSD and other OSes. However, there is no comfortable automated installation, as under Linux with `mytonctrl`, you will need to install the software manually and create your own scripts. For FreeBSD, there is a [port](https://github.com/sonofmom/freebsd_ton_port) source code that allows quick installation.
#### <a id="faq-software-node1"></a>Will my mining become faster if I run mytonctrl in full node mode?
Calculation process by itself will not be faster, but you will gain some stability and, most importantly, flexibility if you operate your own full node/lite server.
#### <a id="faq-software-node2"></a>What do I need to / how can I operate a full node?
This is out of scope of this guide, please consult [Full node howto](https://ton.org/#/howto/full-node) and/or [mytonctrl instructions](https://github.com/igroman787/mytonctrl).
#### <a id="faq-software-build"></a>Can you help me to build software on my OS?
This is out of scope of this guide, please consult [Full node howto](https://ton.org/#/howto/full-node) as well as [Mytonctrl installation scripts](https://github.com/igroman787/mytonctrl/blob/master/scripts/toninstaller.sh#L44) for information about dependencies and process.
