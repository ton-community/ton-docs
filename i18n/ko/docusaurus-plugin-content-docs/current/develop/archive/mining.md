# TON 마이닝 가이드

:::warning 사용 중지
이 정보는 오래되어 더 이상 유용하지 않을 수 있습니다. 생략해도 됩니다.
:::

## <a id="introduction"></a>소개

이 문서는 작업 증명을 사용하여 톤코인을 채굴하는 과정을 소개합니다. TON 마이닝의 최신 현황은 [ton.org/mining](https://ton.org/mining)을 참조하세요.

## <a id="quick-start"></a>빠른 시작

지금 채굴을 시작하려면:

1. [채굴에 적합한 컴퓨터](#hardware) 를 구합니다.
2. [Ubuntu](https://ubuntu.com) 20.04 데스크톱 또는 서버 배포판을 설치합니다.
3. `라이트` 모드에서 [mytonctrl](https://github.com/igroman787/mytonctrl#installation-ubuntu) 을 설치합니다.
4. `mytonctrl` 내에서 `emi` 명령을 실행하여 하드웨어와 [예상 채굴 수입](#faq-emi) 을 확인하세요.
5. 아직 지갑이 없는 경우 [지갑](https://www.ton.org/wallets) 중 하나를 사용하여 `지갑 주소`를 생성하세요.
6. `mytonctrl`에서 `set minerAddr "..."`을 실행하여 `지갑 주소`를 채굴 대상으로 정의합니다.
7. [ton.org/mining](https://ton.org/mining) 에서 제공되는 목록에서 기버 컨트랙트를 선택하고, `mytonctrl`에서 `set powAddr "..."`을 실행하여 마이너를 채굴하도록 설정합니다.
8. `mytonctrl`에서 `mon`을 실행하여 채굴을 시작합니다.
9. 컴퓨터의 CPU 부하를 확인하세요. 'pow-miner'라는 프로세스는 대부분의 CPU를 사용해야 합니다.
10. 행운을 기다리세요; 4단계의 결과를 통해 블록을 채굴할 확률이 어느 정도인지 대략적으로 알 수 있을 것입니다.

## <a id="basics"></a>기본 사항

Toncoin은 특정 양의 TON이 할당된 스마트 계약인 이른바 `PoW 기버`에 의해 분배됩니다. 현재 TON 네트워크에는 10개의 활성 PoW 기버가 있습니다. Givers는 100 TON씩 블록으로 코인을 나누어줍니다. 이러한 블록을 받으려면 컴퓨터가 기버가 발행한 복잡한 수학적 문제를 가능한 빨리 해결해야 합니다. 다른 채굴자들과 100 TON의 보상을 놓고 경쟁하게 됩니다. 누군가가 먼저 문제를 해결하면, 컴퓨터가 수행한 모든 작업은 무효가 되며, 새로운 라운드/경주가 시작됩니다.

채굴로 인한 수익은 기계가 작업을 수행하는 동안 `조금씩` 들어오는 것이 아니라, giver 문제를 성공적으로 해결할 때마다 100 TON 단위로 들어옵니다. 따라서 기계가 24시간 내에 블록을 계산할 확률이 10%라면 ([빠른 시작](#quickStart) 4단계 참조) 100 TON 보상을 받기까지 최대 10일을 기다려야 할 수도 있습니다.

채굴 과정은 대부분 `mytonctrl`에 의해 자동화되어 있습니다. 채굴 과정에 대한 자세한 정보는 [PoW Giver](https://www.ton.org/#/howto/pow-givers) 문서에서 확인할 수 있습니다.

## <a id="advanced"></a>고급

채굴에 진지하게 관심이 있고 두 대 이상의 기계/채굴장을 운영하고자 하는 경우, TON과 채굴 작동 방식을 배워야 하며 자세한 내용은 [HOWTO](https://ton.org/#/howto/) 섹션에서 심도 있는 정보를 확인하세요. 여기 몇 가지 일반적인 조언이 있습니다:

- 자체 노드/라이트 서버를 별도의 컴퓨터에서 **실행하세요.** 이렇게 하면 마이닝 팜이 다운되거나 쿼리를 적시에 처리하지 못할 수 있는 외부 라이트 서버에 의존하지 않도록 할 수 있습니다.
- 퍼블릭 라이트 서버에 `get_pow_params` 쿼리를 **퍼붓지 마세요.** 제공자 상태를 자주 폴링하는 사용자 지정 스크립트가 있는 경우 반드시 자체 라이트 서버를 사용해야 합니다. 이 규칙을 위반하는 클라이언트는 퍼블릭 라이트 서버에서 IP가 블랙리스트에 오를 위험이 있습니다.
- [마이닝 프로세스](https://www.ton.org/#/howto/pow-givers)가 어떻게 작동하는지 이해하려고 노력하세요. 대부분의 대규모 마이너는 여러 대의 마이닝 머신이 있는 환경에서 `mytonctrl`보다 많은 이점을 제공하는 자체 스크립트를 사용합니다.

## <a id="hardware"></a>채굴 하드웨어

TON 채굴의 전체 네트워크 해시레이트는 매우 높기 때문에 채굴자가 채굴에 성공하려면 고성능 컴퓨터가 필요합니다. 일반 가정용 컴퓨터나 노트북으로 채굴하는 것은 무의미하며, 이러한 시도는 권장하지 않습니다.

#### CPU

[Intel SHA Extension](https://en.wikipedia.org/wiki/Intel_SHA_extensions)을 지원하는 최신 CPU는 **필수**입니다. 대부분의 채굴자는 최소 32개의 코어와 64개의 스레드를 갖춘 AMD EPYC 또는 Threadripper 기반 컴퓨터를 사용합니다.

#### GPU

네, GPU를 사용하여 TON을 채굴할 수 있습니다. Nvidia와 AMD GPU를 모두 사용할 수 있는 PoW 채굴기 버전이 있으며, 코드와 사용 방법에 대한 지침은 [POW 마이너 GPU](https://github.com/tontechio/pow-miner-gpu/blob/main/crypto/util/pow-miner-howto.md) 리포지토리에서 찾을 수 있습니다.

현재로서는 이를 사용하려면 기술적인 지식이 필요하지만, 보다 사용자 친화적인 솔루션을 개발 중입니다.

#### 메모리

거의 모든 채굴 과정은 CPU의 L2 캐시에서 발생합니다. 즉, 메모리 속도와 크기는 채굴 성능에 영향을 미치지 않습니다. 단일 메모리 채널에 단일 DIMM이 있는 듀얼 AMD EPYC 시스템은 16개의 DIMM이 모든 채널을 차지하는 시스템과 동일한 속도로 채굴합니다.

이것은 **단순한 채굴 과정에만** 해당되며, 기계가 풀 노드나 다른 프로세스를 실행하는 경우 상황이 달라집니다! 그러나 이는 이 가이드의 범위를 벗어납니다.

#### 스토리지

라이트 모드에서 실행되는 일반 채굴기는 최소한의 공간을 사용하며 스토리지에 데이터를 저장하지 않습니다.

#### 네트워크

단순 채굴기는 인터넷으로의 아웃바운드 연결을 열 수 있어야 합니다.

#### FPGA / ASIC

[FPGA / ASIC을 사용할 수 있는지 확인](#faq-hw-asic) 하세요.

### <a id="hardware-cloud"></a>클라우드 머신

많은 사람들이 AWS 또는 Google Compute Cloud 머신을 사용하여 채굴합니다. 위의 사양에서 설명한 것처럼, 실제로 중요한 것은 CPU입니다. 따라서 AWS [c5a.24xlarge](https://aws.amazon.com/ec2/instance-types/c5/) 또는 Google [n2d-highcpu-224](https://cloud.google.com/compute/vm-instance-pricing) 인스턴스를 권장합니다.

### <a id="hardware-estimates"></a>수익 예측

소득을 계산하는 공식은 매우 간단합니다: `($total_bleed / $total_hashrate) * $your_hashrate`. 이렇게 하면 **현재** 추정치가 나옵니다. 변수는 [ton.org/mining](https://ton.org/mining)에서 확인하거나 `mytonctrl`에서 예상 채굴 소득 계산기(`emi` 명령어)를 사용할 수 있습니다. 다음은 2021년 8월 7일에 i5-11400F CPU를 사용하여 계산한 샘플 출력입니다:

```
Mining income estimations
-----------------------------------------------------------------
Total network 24h earnings:         171635.79 TON
Average network 24h hashrate:       805276100000 HPS
Your machine hashrate:              68465900 HPS
Est. 24h chance to mine a block:    15%
Est. monthly income:                437.7 TON
```

**중요**: 제공된 정보는 *실행 시점의 네트워크 해시레이트*를 기준으로 한다는 점에 유의하시기 바랍니다. 실제 수익은 네트워크 해시레이트 변화, 선택한 기버, 운 등의 여러 요인에 따라 달라질 수 있습니다.

## <a id="faq"></a>자주 묻는 질문

### <a id="faq-general"></a>일반

#### <a id="faq-general-posorpow"></a>TON은 PoS 네트워크인가요, PoW 네트워크인가요?

TON 블록체인은 지분 증명 합의를 사용합니다. 새로운 블록을 생성하기 위해 채굴은 필요하지 않습니다.

#### <a id="faq-general-pow"></a>그러면 왜 TON은 작업 증명을 사용하는 건가요?

초기 50억 Toncoin 발행량이 임시 PoW Giver 스마트 컨트랙트로 이전되었기 때문입니다. 이 스마트 컨트랙트에서 Toncoin을 얻기 위해 채굴을 사용합니다.

#### <a id="faq-general-supply"></a>채굴할 수 있는 코인은 얼마나 남았나요?

가장 최신 정보는 [ton.org/mining](https://ton.org/mining) 에서 확인할 수 있으며 `bleed` 그래프를 참조하세요. PoW 기버 컨트랙트에는 한계가 있으며 사용자가 모든 Toncoin을 채굴하면 고갈됩니다.

#### <a id="faq-general-mined"></a>이미 채굴된 코인은 얼마나 되나요?

2021년 8월 기준으로 약 49억 Toncoin이 채굴되었습니다.

#### <a id="faq-general-whomined"></a>그 코인을 누가 채굴했나요?

코인은 70,000개 이상의 지갑으로 채굴되었으며, 해당 지갑의 소유자는 알려지지 않았습니다.

#### <a id="faq-general-elite"></a>채굴을 시작하는 것이 어렵나요?

전혀 어렵지 않습니다. 필요한 것은 [적절한 하드웨어](#hardware) 와 [빠른 시작](#quickStart) 섹션에 설명된 단계를 따르기만 하면 됩니다.

#### <a id="faq-general-pissed"></a>다른 방법으로 채굴할 수 있나요?

네, 서드파티 앱인 [TON Miner Bot](https://t.me/TonMinerBot)이 있습니다.

#### <a id="faq-general-stats"></a>채굴 통계를 어디서 볼 수 있나요?

[ton.org/mining](https://ton.org/mining)

#### <a id="faq-general-howmany"></a>채굴자는 몇 명이나 되나요?

정확히 알 수 없습니다. 네트워크의 전체 해시레이트만 알고 있습니다. 하지만, 대략적인 총 해시레이트를 제공하기 위해 필요한 특정 유형의 머신의 수량을 추정하는 그래프가 [ton.org/mining](https://ton.org/mining)에 있습니다.

#### <a id="faq-general-noincome"></a>채굴을 시작하려면 톤코인이 필요한가요?

아니요, 필요하지 않습니다. 단 한 개의 Toncoin 없이도 채굴을 시작할 수 있습니다.

#### <a id="faq-mining-noincome"></a>몇 시간 동안 채굴을 했는데 왜 지갑 총액이 1 TON도 늘지 않나요?

TON은 100개의 블록 단위로 채굴됩니다. 블록을 추측하여 100 TON을 받거나 아무것도 받지 못합니다. [기본 사항](#basics) 을 참조하세요.

#### <a id="faq-mining-noblocks"></a>며칠 동안 채굴했지만 결과가 보이지 않는 이유는 무엇인가요?

현재 [수익 예상치](#hardware-estimates) 을 확인하셨나요? `24시간 내 블록 채굴 확률` 추정 필드가 100% 미만이면 인내심을 가져야 합니다. 또한 24시간 내 블록을 채굴할 확률이 50%라고 해서 자동으로 2일 내에 블록을 채굴할 수 있는 것은 아닙니다. 50%는 각 날마다 별도로 적용됩니다.

#### <a id="faq-mining-pools"></a>채굴 풀이 있나요?

아니요, 현재로서는 마이닝 풀이 구현되어 있지 않으며 모두가 스스로 마이닝을 합니다.

#### <a id="faq-mining-giver"></a>어떤 기버를 채굴해야 하나요?

기버를 선택하는 것은 크게 중요하지 않습니다. 각 기버의 난이도는 변동하므로, 현재 [ton.org/mining](https://ton.org/mining) 에서 가장 쉬운 기버가 한 시간 내에 가장 복잡해질 수 있습니다. 반대의 경우도 마찬가지입니다.

### <a id="faq-hw"></a>하드웨어

#### <a id="faq-hw-machine"></a>더 빠른 기계가 항상 승리하나요?

아니요, 모든 채굴자는 해결책을 찾기 위해 서로 다른 길을 택합니다. 더 빠른 기계일수록 성공 확률이 높지만 승리를 보장하지는 않습니다!

#### <a id="faq-hw-machine"></a>내 기계가 얼마나 많은 수익을 창출하나요?

[수익 예측](#hardware-estimates) 을 참조하세요.

#### <a id="faq-hw-asic"></a>BTC/ETH 장비를 사용해 TON을 채굴할 수 있나요?

아니요, TON은 BTC, ETH 및 기타 암호화폐와 다른 단일 SHA256 해싱 방식을 사용합니다. 다른 암호화폐를 채굴하기 위해 제작된 ASIC 또는 FPGA는 도움이 되지 않습니다.

#### <a id="faq-hw-svsm"></a>더 빠른 기계 하나가 더 좋은가요, 아니면 여러 대의 느린 기계가 더 좋은가요?

이는 논란의 여지가 있습니다. 채굴 소프트웨어는 시스템의 각 코어에 스레드를 실행하며, 각 코어는 처리할 자체 키 세트를 받습니다. 따라서 64개의 스레드를 실행할 수 있는 기계 하나와 각각 16개의 스레드를 실행할 수 있는 기계 4대는 스레드 속도가 동일하다고 가정할 때 동일한 성공률을 가집니다.

현실에서는 낮은 코어 수를 가진 CPU는 보통 클럭 속도가 더 높기 때문에 여러 대의 기계를 사용하는 것이 더 나은 성공률을 가질 가능성이 높습니다.

#### <a id="faq-hw-mc"></a>여러 대의 기계를 실행하면 협력하나요?

아니요, 협력하지 않습니다. 각 기계는 자체적으로 채굴하지만, 솔루션을 찾는 과정은 무작위입니다. 어떤 기계도, 심지어 단일 스레드도 동일한 경로를 취하지 않습니다. 따라서 직접적인 협력 없이 해시레이트가 유리하게 합산됩니다.

#### <a id="faq-hw-CPU"></a>ARM CPU를 사용하여 채굴할 수 있나요?

CPU에 따라 다릅니다. AWS Graviton2 인스턴스는 매우 강력한 채굴기이며 AMD EPYC 기반 인스턴스와 가격/성능 비율을 유지할 수 있습니다.

### <a id="faq-software"></a>소프트웨어

#### <a id="faq-software-os"></a>Windows/xBSD/기타 다른 OS를 사용하여 채굴할 수 있나요?

물론입니다. [TON 소스코드](https://github.com/ton-blockchain/ton) 는 Windows, xBSD 및 다른 OS에서 빌드된 것으로 알려져 있습니다. 그러나 Linux에서 `mytonctrl`을 사용하는 것처럼 편리한 자동 설치는 없으며, 소프트웨어를 수동으로 설치하고 자체 스크립트를 작성해야 합니다. FreeBSD의 경우 빠른 설치를 가능하게 하는 [port](https://github.com/sonofmom/freebsd_ton_port)소스 코드 가 있습니다.

#### <a id="faq-software-node1"></a>mytonctrl을 풀 노드 모드에서 실행하면 채굴 속도가 빨라지나요?

계산 과정 자체는 빨라지지 않지만, 자신의 풀 노드/라이트 서버를 운영하면 안정성과 유연성을 얻을 수 있습니다.

#### <a id="faq-software-node2"></a>풀 노드를 운영하려면 무엇이 필요하며, 어떻게 운영하나요?

이는 이 가이드의 범위를 벗어납니다. [풀 노드 사용법](https://ton.org/#/howto/full-node) 및 [mytonctrl 지침](https://github.com/igroman787/mytonctrl) 을 참조하세요.

#### <a id="faq-software-build"></a>내 OS에서 소프트웨어를 빌드하는 데 도움을 줄 수 있나요?

이는 이 가이드의 범위를 벗어납니다. [풀 노드 가이드](https://ton.org/#/howto/full-node) 및 [Mytonctrl 설치 스크립트](https://github.com/igroman787/mytonctrl/blob/master/scripts/toninstaller.sh#L44) 를 참조하여 종속성 및 프로세스에 대한 정보를 확인하세요.
