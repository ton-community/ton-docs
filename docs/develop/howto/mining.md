## TON mining guide
### Table of contents
1. [Introduction](#introduction)
2. [Quick start](#quick-start)
3. [Basics](#basics)
4. [Advanced](#advanced)
5. [Miner hardware](#hardware)
    * [General](#hardware)
    * [Cloud instances](#hardware-cloud)
    * [Income estimates](#hardware-estimates)
6. [FAQ](#faq)
    * [General](#faq-general)
    * [Hardware](#faq-hw)
    * [Software](#faq-software)

## <a id="introduction"></a>Introduction
This document provides introduction into process of mining TON Coins using PoW givers. Please visit [ton.org/mining](https://ton.org/mining) for up to date status of TON mining.

## <a id="quick-start"></a>Quick start
To start mining right away:

1. Get a [computer suitable for mining](#hardware)
2. Install [Ubuntu](https://ubuntu.com) 20.04 desktop or server distribution
3. Install [mytonctrl](https://github.com/igroman787/mytonctrl#installation-ubuntu) in `lite` mode
4. Check your hardware and [expected mining income](#faq-emi) by running `emi` command within `mytonctrl`
5. If you do not yet have one: create `wallet address` using one of the [wallets](https://www.ton.org/wallets)
6. Define your `wallet address` as mining target by executing `set minerAddr "..."` in `mytonctrl`
7. Chose giver contract from the list available on [ton.org/mining](https://ton.org/mining) and set your miner to mine it by executing `set powAddr "..."` in `mytonctrl`
8. Start mining by executing `mon` in `mytonctrl`
9. Check CPU load on your machine, process called `pow-miner` should use most of your CPU
10. Wait to get lucky, output of step 4 should have told you approximately what are your chances to mine a block.

## <a id="basics"></a>Basics
TON Coins are distributed by so-called `PoW Givers` which are smart contracts with certain amount of TONs assigned to them. Currently, there are 10 active PoW givers on TON network. Givers hand out coins in blocks of 100 TON each. In order to receive such block your computer needs to solve complex mathematical challenge issued by a giver and do that as fast as possible: you compete against other miners for the reward of 100 TON. If someone manages to solve the problem before you, all the work your machine has done is in vain and new round/race begins.

It is important to understand that profits from mining do not "trickle in" as your machine does the works, they come in batches of 100 TON for every successful solution of giver challenge. This means that if your machine has a 10% chance to calculate block within 24h (see step 4 of [Quick start](#quickStart)) then you will probably need to wait for ~10 days before you will get a 100 TON reward.

The process of mining is largely automated by `mytonctrl`, detailed information about the mining process can be found in [PoW givers](https://www.ton.org/docs/#/howto/pow-givers) document.

## <a id="advanced"></a>Advanced
If you are serious about mining and wish to operate more than one machine/mining farm then you really need to learn TON and how mining works, please see [HOWTO](https://ton.org/docs/#/howto/) section for in-depth information. Here is some general advise:

* **DO** run your own node / liteServer on separate machine, this will ensure that your mining farm does not depend on external liteServers that can go down or not process your queries in timely fashion.
* **DO NOT** bombard public liteServers with `get_pow_params` queries, if you have custom scripts that poll givers status in high frequency you **must** use your own liteServer. Clients that violate this rule risk blacklisting of their IPs on public liteServers.
* **DO** try to understand how [mining process](https://www.ton.org/docs/#/howto/pow-givers) works, most larger miners use their own scripts that offer many advantages over `mytonctrl` in environments with multiple mining machines.

## <a id="hardware"></a>Miner hardware
The total network hashrate of TON mining is very high, miners need high-performance machines if they wish to succeed. Mining on standard home computers and notebooks is futile and we advise against such attempts.

#### CPU
Modern CPU that supports [Intel SHA Extension](https://en.wikipedia.org/wiki/Intel_SHA_extensions) is a **must**. Most miners use AMD EPYC or Threadripper based machines with at least 32 cores / 64 threads.

#### GPU
Yes! You can mine TON using GPU, there is a version of pow-miner that is capable to use both Nvidia and AMD GPUs, you can find the code as well as instructions on how to use it in the [POW Miner GPU](https://github.com/tontechio/pow-miner-gpu/blob/main/crypto/util/pow-miner-howto.md) repository.

For now one needs to be tech-savvy to use this but we are working on a more user-friendly solution.

#### Memory
Almost entire mining process happens in L2 cache of the CPU. That means that memory speed and size play no role in mining performance. A dual AMD EPYC system with single DIMM on one memory channel will mine just as fast as one with 16 DIMMs occupying all channels.

Please do note that this applies to plain mining process **only**, if your machine also runs full node or other processes then things change! But this is out of scope of this guide.

#### Storage
Plain miner run in lite mode uses minimal space and does not store any data on storage.

#### Network
Plain miner needs ability to open outgoing connections to internet.

#### FPGA / ASIC
See [can I use FPGA / ASICs?](#faq-hw-asic)

### <a id="hardware-cloud"></a>Cloud machines
Many people mine using AWS or Google compute cloud machines. As outlined in the specs above what really matters is CPU, thus we advise AWS [c5a.24xlarge](https://aws.amazon.com/ec2/instance-types/c5/) or Google [n2d-highcpu-224](https://cloud.google.com/compute/vm-instance-pricing) instances.

### <a id="hardware-estimates"></a>Income estimates
The formula for income calculation is quite simple: `($total_bleed / $total_hashrate) * $your_hashrate`. This will give you **current** estimate. You can find out the variables on [ton.org/mining](https://ton.org/mining) or use estimated mining income calculator (`emi` command) in `mytonctrl`, here is sample output made on 7th of August 2021 using i5-11400F CPU:
```
Mining income estimations
-----------------------------------------------------------------
Total network 24h earnings:         171635.79 TON
Average network 24h hashrate:       805276100000 HPS
Your machine hashrate:              68465900 HPS
Est. 24h chance to mine a block:    15%
Est. monthly income:                437.7 TON
```

**Important**: Please do note that the information provided is based on *network hashrate at the moment of execution* your actual income over time will depend on many factors such as changing network hashrate, chosen giver, and good portion of luck.


## <a id="faq"></a>FAQ
### <a id="faq-general"></a>General
#### <a id="faq-general-posorpow"></a>Is TON PoS or PoW network?
TON Blockchain uses the Proof-of-Stake consensus and mining is not required to generate new blocks.
#### <a id="faq-general-pow"></a>So how come there is Proof-of-Work in TON?
Well, the reason is that the initial issue of 5bn TON Coins was transferred to ad hoc Proof-of-Work Giver smart contracts.
Mining is used to obtain TON Coins from this smart contract.
#### <a id="faq-general-supply"></a>How many coins are left for mining?
The most actual information is available on [ton.org/mining](https://ton.org/mining), see `bleed` graphs. PoW Giver contracts have their limits and will dry out once users mine all available TON Coins.
#### <a id="faq-general-mined"></a>How many coins have been mined already?
As of August 2021, about 4.9BN TON Coins have been mined.
#### <a id="faq-general-whomined"></a>Who has mined those coins?
Coins have been mined to over 70'000 wallets, owners of those wallets are not known.
#### <a id="faq-general-elite"></a>Is it difficult to start mining?
Not at all, all you need is [adequate hardware](#hardware) and to follow steps outlined in [quick start](#quickStart) section.
#### <a id="faq-general-pissed"></a>Is there another way to mine?
Yes, there is a 3rd party app [TON Miner Bot](https://t.me/TonMinerBot)
#### <a id="faq-general-stats"></a>Where can I see mining statistics?
[ton.org/mining](https://ton.org/mining)
#### <a id="faq-general-howmany"></a>How many miners are out there?
We cannot say this, all we know is total hashrate of all miners on the network. There are however graphs on [ton.org/mining](https://ton.org/mining) that attempt to estimate quantity of machines of certan type needed to provide aproximate total hashrate.
#### <a id="faq-general-noincome"></a>Do i need TON coins to start mining?
No, you do not, anyone can start mining without owning a single TON Coin
#### <a id="faq-mining-noincome"></a>I mine for hours, why my wallet total does not increase, not even by 1 TON?
TONs are mined in blocks of 100, you either guess a block and receive 100 TON or receive nothing. please see [basics](#basics)
#### <a id="faq-mining-noblocks"></a>I mine for days and I see no results, why?
Did you check your current [Income estimates](#hardware-estimates)? If field `Est. 24h chance to mine a block` is less than 100% then you need to be patient. Also please do note that a 50% chance to mine a block within 24h does not automatically mean that you will mine one within 2 days, 50% applies to each day individually.
#### <a id="faq-mining-pools"></a>Are there mining pools?
No, As of now there are no implementations of mining pools, everyone mines for himself.
#### <a id="faq-mining-giver"></a>Which giver should I mine?
It does not really matter which giver you choose, difficulty tends to fluctuate on each giver, so current easiest giver on [ton.org/mining](https://ton.org/mining) might become most complex within an hour, same applies in opposite direction.
### <a id="faq-hw"></a>Hardware
#### <a id="faq-hw-machine"></a>Will faster machine always win?
No, all miners take different roads to find solution, the faster machine has higher probability of success but it is not guaranteed a victory!
#### <a id="faq-hw-machine"></a>How much income will my machine generate?
Please see [Income estimates](#hardware-estimates)
#### <a id="faq-hw-asic"></a>Can I use my BTC | ETH rig to mine TON?
No, TON uses single SHA256 hashing method which is different from BTC, ETH and others. ASICS or FPGAs build for mining other cryptos will not help. 
#### <a id="faq-hw-svsm"></a>What is better, single fast machine or several slow ones?
This is controversial, see: miner software launches threads for each core on the system and each core get's its own set of keys to process, so if you have one machine capable to run 64 threads and 4 x machines capable to run 16 threads each then they will be exactly as successful assuming that speed of each thread is the same.

In real-world however CPUs with lower core count are usually clocked higher, so you will probably have better success with multiple machines.
#### <a id="faq-hw-mc"></a>If I run many machines, will they cooperate?
No, they will not. Each machine mines on its own but solution finding process is random, no machine, not even a single thread (see above) will take the same path, thus, their hashrates add up in your favor without direct cooperation.
#### <a id="faq-hw-CPU"></a>Can I mine using ARM CPUs?
Depends on CPU, AWS Graviton2 instances are very capable miners indeed and are able to hold price/performance ratio alongside AMD EPYC based instances.
### <a id="faq-software"></a>Software
#### <a id="faq-software-os"></a>Can I mine using Windows / xBSD / some other OS?
Of course, [TON source code](https://github.com/ton-blockchain/ton) has been known to build on Windows, xBSD and other OSes. However, there is no comfortable automated installation as under Linux with `mytonctrl`, you will need to install the software by hand and create your own scripts. For FreeBSD there is a [port](https://github.com/sonofmom/freebsd_ton_port) source code that allows quick installation.
#### <a id="faq-software-node1"></a>Will my mining become faster if I run mytonctrl in full node mode?
Calculation process by itself will not be faster but you will gain some stability and most importantly flexibility if you operate your own full node / liteServer.
#### <a id="faq-software-node2"></a>What do I need to / how can I operate full node?
This is out of scope of this guide, please consult [Full node howto](https://ton.org/docs/#/howto/full-node) and/or [mytonctrl instructions](https://github.com/igroman787/mytonctrl)
#### <a id="faq-software-build"></a>Can you help me to build software under my OS?
This is out of scope of this guide, please consult [Full node howto](https://ton.org/docs/#/howto/full-node) as well as [Mytonctrl installation scripts](https://github.com/igroman787/mytonctrl/blob/master/scripts/toninstaller.sh#L44) for information about dependencies and process.
