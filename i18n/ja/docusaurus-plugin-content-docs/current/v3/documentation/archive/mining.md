import Feedback from '@site/src/components/Feedback';

# TON マイニングガイド

:::warning 非推奨
この情報は古く、関連性がなくなる可能性があります。スキップすることができます。 You can skip it.
:::

## <a id="introduction"></a>はじめに

このドキュメントでは、PoWギバーを使用したToncoinのマイニングプロセスについて紹介します。TONマイニングの最新状況については[ton.org/mining](https://ton.org/mining)をご覧ください。 Please visit [ton.org/mining](https://ton.org/mining) for up-to-date status of TON mining.

## <a id="quick-start"></a>クイックスタート

すぐにマイニングを開始するには:

1. [マイニングに適したコンピューター](#hardware) を入手する。
2. [Ubuntu](https://ubuntu.com) 20.04 デスクトップまたはサーバーディストリビューションをインストールします。
3. [mytonctrl](https://github.com/igroman787/mytonctrl#installation-ubuntu) を `lite` モードでインストールします。
4. `Mytonctrl`内で`emi`コマンドを実行して、ハードウェアと[予想されるマイニング収入](/v3/documentation/archive/mining#income-estimates)をチェックします。
5. まだ持っていない場合は、[wallets](https://www.ton.org/wallets)のいずれかを使って`wallet address`を作成してください。
6. `mytonctrl`で`set minerAddr "..."を実行することで、あなたの`walletアドレスをマイニングターゲットとして定義します。
7. [ton.org/mining](https://ton.org/mining)にあるリストからギバーコントラクトを選択し、`mytonctrl`で`set powAddr "..."`を実行することで、マイナーがそのコントラクトをマイニングするように設定します。
8. `mytonctrl`で`mon`を実行してマイニングを開始します。
9. コンピュータのCPU負荷を確認してください。`pow-miner`と呼ばれるプロセスがCPUの大半を使用する必要があります。
10. ステップ4の出力で、ブロックをマインできる可能性がおおよそわかります。運が向くのを待ちましょう。

## <a id="basics"></a>基礎

Toncoinは、特定の量のToncoinが割り当てられたスマートコントラクトである`PoW Givers`によって配布されます。 現在、TON Networkには10人のPoW利用者がいますが、それぞれの利用者は100トンのブロックでコインを配布しています。 これらのブロックのいずれかを獲得するには、コンピューターが他の鉱夫よりも早く複雑な数学的チャレンジを解決する必要があります。 別の鉱夫が問題を解決した場合、あなたの機械の作業は破棄され、新しいラウンドが始まります。 Currently, there are 10 active PoW givers on the TON Network. Each giver distributes coins in blocks of 100 TON. To earn one of these blocks, your computer must solve a complex mathematical challenge faster than other miners. If another miner solves the problem before you, your machine's work is discarded, and a new round begins.

Mining profits are not gradual; they come in batches of 100 TON for each successfully solved giver challenge. マイニングで得られる利益は、あなたのマシンが作業を行うたびに "ちょろちょろ "と入ってくるのではなく、ギバーチャレンジの解決に成功するたびに100TONずつ入ってくるということを理解しておくことが重要です。つまり、あなたのマシンが24時間以内にブロックを計算する確率が10%である場合（[クイックスタート](#quickStart) のステップ4を参照）、100TONの報酬を得るまでには10日間ほど待つ必要があります。

マイニングのプロセスは `mytonctrl` によってほぼ自動化されています。マイニングプロセスの詳細については、[PoW givers](https://www.ton.org/#/howto/pow-givers)のドキュメントをご参照ください。 Detailed information about the mining process can be found in [PoW givers](https://www.ton.org/#/howto/pow-givers) document.

## <a id="advanced"></a>上級

採掘に真剣に取り組んでいて、複数の機械や鉱山農場を操作したい場合は、TONとマイニングの仕組みについて学ぶことが不可欠です。 詳細については、 [HOWTO](https://ton.org/#/howto/)セクションを参照してください。 Refer to the [HOWTO](https://ton.org/#/howto/) section for detailed information. Here is some general advice:

- 異なるマシン上で独自のノード/liteサーバーを実行してください。これにより、あなたのマイニングファームは、ダウンしたりタイムリーにクエリを処理できない可能性のある外部のライトサーバーに依存しないようになります。
- `get_pow_params`クエリで公開liteサーバーを攻撃しないでください もし高頻度でポーリングを行うカスタムスクリプトがある場合は、必ず自身のliteサーバーを使用してください。 このルールに違反するクライアントは、IPが公開されているliteサーバーのブラックリストに登録されるリスクがあります。 Clients that violate this rule risk having their IPs blacklisted on public lite servers.
- [マイニングプロセス](https://www.ton.org/#/howto/pow-givers)がどのように動作するかを理解するようにしましょう。ほとんどの大規模なマイナーは独自のスクリプトを使用しており、複数のマイニングマシンがある環境では`mytonctrl`よりも多くの利点があります。

## <a id="hardware"></a>マイナーハードウェア

TONマイニングの総ネットワークハッシュレートは非常に高いため、マイナーが成功するには高性能なマシンが必要です。標準的な家庭用コンピュータやノートブックでのマイニングは非常に困難であるため、そのような試みは行わないことをお勧めします。 Mining on standard home computers and notebooks is futile, and we advise against such attempts.

#### CPU

[Intel SHA Extension](https://en.wikipedia.org/wiki/Intel_SHA_extensions)をサポートする最新のCPUは**必須**です。 ほとんどの鉱夫は、少なくとも32コアと64スレッドのAMD EPYCまたはThreadripperマシンを使用しています。 Most miners use AMD EPYC or Threadripper machines with at least 32 cores and 64 threads.

#### GPU

Yes! You can mine TON using GPU. GPUを使ってTONをマイニングすることができます。NvidiaとAMD両方のGPUを使えるバージョンのPoWマイナーもあります。コードと使い方は[POW Miner GPU](https://github.com/tontechio/pow-miner-gpu/blob/main/crypto/util/pow-miner-howto.md)リポジトリにあります。

As for now, one needs to be tech-savvy to use this, but we are working on a more user-friendly solution.

#### メモリ

Almost the entire mining process happens in the L2 cache of the CPU. That means that memory speed and size play no role in mining performance. マイニングプロセスのほぼすべてが、CPUのL2キャッシュで行われます。つまり、メモリの速度やサイズはマイニングのパフォーマンスには関係がありません。1つのメモリチャネルに1枚のDIMMを搭載したデュアルAMD EPYCシステムは、16枚のDIMMがすべてのチャネルを占有するシステムと同じくらい高速にマイニングを行うことができます。

マシンがフルノードや他のプロセスも実行している場合、状況が変わることをご理解ください。しかし、これはこのガイドの範囲外となります。 But this is outside the scope of this guide.

#### ストレージ

Liteモードで動作するマイナーは、最小限のストレージスペースを使用し、データを保存しません。

#### ネットワーク

Plain miner needs the ability to open outgoing connections to the Internet.

#### FPGA / ASIC

[FPGA や ASICs を使用できるか？](/v3/documentation/archive/mining#can-i-use-my-btceth-rig-to-mine-ton)を参照してください。

### <a id="hardware-cloud"></a>クラウドマシン

Many people mine using AWS or Google compute cloud machines. As outlined in the specs above, what really matters is CPU. Therefore, we advise AWS [c5a.24xlarge](https://aws.amazon.com/ec2/instance-types/c5/) or Google [n2d-highcpu-224](https://cloud.google.com/compute/vm-instance-pricing) instances.

### <a id="hardware-estimates"></a>収入の予測

The formula for calculating the income is quite simple: `($total_bleed / $total_hashrate) * $your_hashrate`. This will give you a **current** estimate. 収入を計算する式はとても簡単です。`($total_bleed / $total_hashrate) * $your_hashrate`。 **現在** の見積もりができます。[ton で変数を調べることができます。[ton.org/mining](https://ton.org/mining)または`mytonctrl`の推定採掘収入計算(`emi`コマンド)を使用してください。以下は、2021年8月7日にi5-11400F CPUを使用したサンプル出力です。 Here is sample output made on August 7th, 2021 using i5-11400F CPU:

```
Mining income estimations
-----------------------------------------------------------------
Total network 24h earnings:         171635.79 TON
Average network 24h hashrate:       805276100000 HPS
Your machine hashrate:              68465900 HPS
Est. 24h chance to mine a block:    15%
Est. monthly income:                437.7 TON
```

**重要**：提供される情報は、_実行時のネットワークハッシュレート_に基づいていることに注意してください。時間の経過に伴う実際の収入は、ネットワークハッシュレートの変化、選ばれたギバー、運など、多くの要因に左右されます。 Your actual income over time will depend on many factors, such as changing network hashrate, the chosen giver, and a good portion of luck.

## <a id="faq"></a>よくあるご質問

### <a id="faq-general"></a>一般

#### <a id="faq-general-posorpow"></a>TON はPoSまたはPoWネットワークですか?

TON Blockchainは、プルーフ・オブ・ステーク(PoS)のコンセンサスで動作します。新しいブロックを作成するためにマイニングは必要ありません。 Mining is not required to create new blocks.

#### <a id="faq-general-pow"></a>では、なぜTONがProof-of-Workなのか？

その理由は、最初に発行された50億Toncoinが、アドホックなProof-of-Work ギバースマートコントラクトに譲渡されたからです。
このスマートコントラクトからToncoinを得るためにマイニングが行われます。
Mining is used to obtain Toncoins from this smart contract.

#### <a id="faq-general-supply"></a>マイニング可能なコインは何枚残っていますか？

最も実際的な情報は、[ton.org/mining](https://ton.org/mining) の `bleed` グラフをご覧ください。PoWギバー契約には限界があり、ユーザーが利用可能なToncoinをすべて採掘すると、次第に枯渇します。 PoW Giver contracts have their limits and will dry out once users mine all the available Toncoins.

#### <a id="faq-general-mined"></a>今までにどのくらいのコインがマイニングされましたか？

2021年8月現在、約49億トンコインが採掘されています。

#### <a id="faq-general-whomined"></a>誰がこれらのコインをマイニングしたのか？

コインは70,000以上の財布に採掘されています。これらの財布の所有者は未知のままです。 The owners of these wallets remain unknown.

#### <a id="faq-general-elite"></a>マイニングを始めるのは難しいですか？

Not at all. そんなことはありません。必要なのは[適切なハードウェア](#hardware) と[クイックスタート](#quickStart) のセクションで説明されている手順だけです。

#### <a id="faq-general-pissed"></a>他にマイニングする方法はありますか？

はい、あります。サードパーティアプリの[TON Miner Bot](https://t.me/TonMinerBot)が利用可能です。

#### <a id="faq-general-stats"></a>マイニングの統計はどこで確認できますか?

[ton.org/mining](https://ton.org/mining) をご参照ください。

#### <a id="faq-general-howmany"></a>マイナーは何人いるのか？

We cannot say this. All we know is the total hashrate of all miners on the network. 具体的な数字を言うことはできません。我々が知っているのは、ネットワーク上の全マイナーの合計ハッシュレートだけです。しかし、[ton.org/mining](https://ton.org/mining)には、おおよその総ハッシュレートを提供するために必要な、特定のタイプのマシンの数を推定しようとするグラフがあります。

#### <a id="faq-general-noincome"></a>マイニングを開始するにはToncoinが必要ですか？

No, you do not. いいえ、そんなことはありません。Toncoinを1枚も所有していなくても、誰でもマイニングを始めることができます。

#### <a id="faq-mining-noincome"></a>何時間もマイニングしてもウォレット残高が増えないのはなぜですか?

TONは100ブロック単位でマイニングされ、ブロックを当てて100TONを受け取るか、何も受け取ることができないかのどちらかです。[基礎](#basics) をご参照ください。 Please see [basics](#basics).

#### <a id="faq-mining-noblocks"></a>何日も採掘しているのに、結果が出ません。なぜですか？

Did you check your current [Income estimates](/v3/documentation/archive/mining#income-estimates)? If field `Est. 24h chance to mine a block` is less than 100%, then you need to be patient. Also, please note that a 50% chance to mine a block within 24 hours does not automatically mean that you will mine one within 2 days; 50% applies to each day separately.

#### <a id="faq-mining-pools"></a>マイニングプールはありますか？

いいえ、現時点では、マイニングプールの実装はありません。誰もが自分自身のためにマイニングしています。

#### <a id="faq-mining-giver"></a>どのギバーをマイニングすればいいのか？

It does not really matter which giver you choose. The difficulty tends to fluctuate on each giver, so the current easiest giver on [ton.org/mining](https://ton.org/mining) might become the most complex within an hour. The same applies in the opposite direction.

### <a id="faq-hw"></a>ハードウェア

#### <a id="faq-hw-machine"></a>速いマシンが常に勝つのか？

No, all miners take different roads to find the solution. A faster machine has a higher probability of success, but it doesn't guarantee victory!

#### <a id="faq-hw-machine"></a>私のマシンはどれくらいの収入を生み出しますか？

[収入予測](/v3/documentation/archive/mining#income-estimates)をご確認ください。

#### <a id="faq-hw-asic"></a>BTC/ETHリグを使ってTONをマイニングできますか？

いいえ、TONはBTC、ETHなどとは異なる単一のSHA256ハッシュ方法を使用します。 他の暗号をマイニングするために構築されているアシックスやFPGAは役に立ちません。 ASICS or FPGAs which are built for mining other cryptos will not help.

#### <a id="faq-hw-svsm"></a>より良いのは、単一の高速マシンまたはいくつかの遅いマシンですか?

This is controversial. これは議論の余地があります。マイナーソフトウェアは、システム上の各コアごとにスレッドを起動し、各コアは、処理するために独自のキーのセットを取得します。64スレッドを実行できるマシンが1台と、16スレッドをそれぞれ実行できるマシンが4台あれば、各スレッドの速度が同じであると仮定すれば、両者はまったく同じように成功することと言えます。

しかし、現実の世界ではコア数の少ないCPUの方がクロックが高いのが普通なので、複数のマシンを使った方がうまくいくと考えられます。

#### <a id="faq-hw-mc"></a>多数のマシンを動かせば、それらは協力し合うのか?

No, they will not. Each machine mines on its own, but the solution finding process is random: no machine, not even a single thread (see above) will take the same path. Thus, their hashrates add up in your favor without direct cooperation.

#### <a id="faq-hw-CPU"></a>ARM CPUを使用してマイニングできますか?

CPUにもよるが、AWSのGraviton2インスタンスは実に有能なマイナーであり、AMD EPYCベースのインスタンスと並ぶ価格性能比を維持できます。

### <a id="faq-software"></a>ソフトウェアについて

#### <a id="faq-software-os"></a>Windows/xBSD/その他のOSを使ってマイニングできますか?

もちろんできます。[TON source code](https://github.com/ton-blockchain/ton)はWindowsやxBSDなどのOS上に構築されていることで知られています。 しかし、`mytonctrl`のLinuxのように、快適に自動化されたインストールはありません。したがって、手動でソフトウェアをインストールし、独自のスクリプトを作成する必要があります。 FreeBSDには、 [port](https://github.com/sonofmom/freebsd_ton_port) のソースコードがあります。 However, there is no comfortable automated installation, as under Linux with `mytonctrl`, you will need to install the software manually and create your own scripts. For FreeBSD, there is a [port](https://github.com/sonofmom/freebsd_ton_port) source code that allows quick installation.

#### <a id="faq-software-node1"></a>フルノードモードでmytonctrlを実行するとマイニングが速くなりますか？

それだけで計算処理が速くなるわけではありませんが、フルノード/ライトサーバーを自分で運用することで、ある程度の安定性と、最も重要である柔軟性を得ることができます。

#### <a id="faq-software-node2"></a>フルノードを運用するにはどうしたらいいですか?

これはこのガイドの範囲外ですので、[Full node howto](https://ton.org/#/howto/full-node) や [mytonctrl instructions](https://github.com/igroman787/mytonctrl) を参照してください。

#### <a id="faq-software-build"></a>OS上でソフトウェアを構築するのを手伝ってもらえますか？

これはこのガイドの範囲外ですので、[Full node howto](https://ton.org/#/howto/full-node) や [mytonctrl instructions](https://github.com/igroman787/mytonctrl/blob/master/scripts/toninstaller.sh#L44) を参照してください。

<Feedback />

