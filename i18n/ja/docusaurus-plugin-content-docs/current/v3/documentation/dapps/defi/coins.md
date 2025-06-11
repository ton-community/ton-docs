import Feedback from '@site/src/components/Feedback';

# ネイティブトークン: Toncoin

TONブロックチェーンのネイティブ暗号通貨は**Toncoin**です。

取引手数料、ガス支払い（スマートコントラクトのメッセージ処理手数料など）、永続的ストレージの支払いはToncoinでよって収集されます。

Toncoinはブロックチェーンのバリデーターになるために必要な預金を行うために使用されます。

Toncoin支払いのプロセスは[対応するセクション](/v3/guidelines/dapps/asset-processing/payments-processing)に記載されています。

[ウェブサイト](https://ton.org/coin)でToncoinの購入先や両替先を調べることができます。

## 追加の通貨

TONブロックチェーンは、最大2^32の追加通貨をサポートしています。

余分な通貨残高は各ブロックチェーンアカウントに保存でき、他のアカウントにネイティブに転送できます（あるスマートコントラクトから別のスマートコントラクトへの内部メッセージで、トンコイン量に加えて余分な通貨量のハッシュマップを指定できます）。

TLB: `extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32)) = ExtraCurrencyCollection;` - 通貨IDと金額のハッシュマップ。

ただし、余分な通貨は、(Toncoinのような) 保管および転送することができ、独自の任意のコードや機能を持っていません。

余分な通貨が大量に作られると、それを保管する必要があるため、口座が「膨れ上がる」ことに注意してください。

したがって、追加の通貨は有名な分散型通貨（例えば、Wrapped Bitcoin　やEther）に使うのがベストで、そのような追加通貨を作るにはかなりのコストがかかります。

[Jettons](/develop/dapps/defi/tokens#jettons) は他のタスクに適しています。

At the moment, no extra currency has been created on TON Blockchain. 現時点では、TONブロックチェーン上に追加通貨は作成されていません。TON ブロックチェーンは、アカウントとメッセージによる追加通貨を完全にサポートしていますが、その作成のためのマイナーシステムコントラクトはまだ作成されていません。

<Feedback />

