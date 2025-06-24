# POW 기버(Giver)

:::warning 사용 중지
이 정보는 최신 상태가 아닐 수 있으며 더 이상 유용하지 않을 수 있습니다. 필요 시 생략해도 됩니다.
:::

이 문서의 목적은 Toncoin을 얻기 위해 Proof-of-Work Giver 스마트 컨트랙트와 상호 작용하는 방법을 설명하는 것입니다. 이 문서는 `시작하기`에서 설명된 TON 블록체인 라이트 클라이언트에 대한 이해와 라이트 클라이언트 및 기타 소프트웨어를 컴파일하는 절차에 대한 이해를 전제로 합니다. 검증기를 실행하기 위해 필요한 대량의 Toncoin을 얻기 위해서는 `Full Node` 및 `Validator` 페이지에 대한 이해가 필요합니다. 더 많은 양의 Toncoin을 얻으려면 검증기를 실행할 수 있는 전용 서버가 필요합니다. 적은 양의 Toncoin을 얻는 데는 전용 서버가 필요하지 않으며, 가정용 컴퓨터에서 몇 분 내에 완료할 수 있습니다.

> 현재 채굴자 수가 많기 때문에 채굴에 많은 리소스가 필요하다는 점에 유의하세요.

## 1. 작업 증명 기버(Proof-of-Work Giver) 스마트 컨트랙트

소수의 악의적인 당사자가 모든 Toncoin을 수집하는 것을 방지하기 위해 네트워크의 마스터체인에 특별한 종류의 "Proof-of-Work Giver" 스마트 컨트랙트가 배포되었습니다. 이 스마트 컨트랙트의 주소는 다음과 같습니다:

작은 양을 제공하는 스마트 컨트랙트들 (몇 분마다 10에서 100 Toncoin을 제공):

- kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN
- kf8SYc83pm5JkGt0p3TQRkuiM58O9Cr3waUtR9OoFq716lN-
- kf-FV4QTxLl-7Ct3E6MqOtMt-RGXMxi27g4I645lw6MTWraV
- kf_NSzfDJI1A3rOM0GQm7xsoUXHTgmdhN5-OrGD8uwL2JMvQ
- kf8gf1PQy4u2kURl-Gz4LbS29eaN4sVdrVQkPO-JL80VhOe6
- kf8kO6K6Qh6YM4ddjRYYlvVAK7IgyW8Zet-4ZvNrVsmQ4EOF
- kf-P_TOdwcCh0AXHhBpICDMxStxHenWdLCDLNH5QcNpwMHJ8
- kf91o4NNTryJ-Cw3sDGt9OTiafmETdVFUMvylQdFPoOxIsLm
- kf9iWhwk9GwAXjtwKG-vN7rmXT3hLIT23RBY6KhVaynRrIK7
- kf8JfFUEJhhpRW80_jqD7zzQteH6EBHOzxiOhygRhBdt4z2N

많은 양을 제공하는 스마트 컨트랙트들 (최소 하루에 한 번 10,000 Toncoin을 제공):

- kf8guqdIbY6kpMykR8WFeVGbZcP2iuBagXfnQuq0rGrxgE04
- kf9CxReRyaGj0vpSH0gRZkOAitm_yDHvgiMGtmvG-ZTirrMC
- kf-WXA4CX4lqyVlN4qItlQSWPFIy00NvO2BAydgC4CTeIUme
- kf8yF4oXfIj7BZgkqXM6VsmDEgCqWVSKECO1pC0LXWl399Vx
- kf9nNY69S3_heBBSUtpHRhIzjjqY0ChugeqbWcQGtGj-gQxO
- kf_wUXx-l1Ehw0kfQRgFtWKO07B6WhSqcUQZNyh4Jmj8R4zL
- kf_6keW5RniwNQYeq3DNWGcohKOwI85p-V2MsPk4v23tyO3I
- kf_NSPpF4ZQ7mrPylwk-8XQQ1qFD5evLnx5_oZVNywzOjSfh
- kf-uNWj4JmTJefr7IfjBSYQhFbd3JqtQ6cxuNIsJqDQ8SiEA
- kf8mO4l6ZB_eaMn1OqjLRrrkiBcSt7kYTvJC_dzJLdpEDKxn

> 현재 모든 많은 양을 제공하는 스마트 컨트랙트가 소진된 상태임을 유의하세요.

처음 10 개의 스마트 컨트랙트는 적은 양의 Toncoin을 얻고자 하는 사용자가 많은 컴퓨팅 파워를 소비하지 않고 얻을 수 있게 합니다 (일반적으로 가정용 컴퓨터에서 몇 분의 작업으로 충분합니다). 나머지 스마트 컨트랙트는 네트워크에서 검증자를 실행하는 데 필요한 더 큰 양의 Toncoin을 얻기 위한 것입니다. 일반적으로 검증자를 실행할 수 있는 전용 서버에서 하루 정도 작업하면 필요한 양을 얻을 수 있습니다.

> 현재 많은 수의 채굴자 때문에 적은 양을 제공하는 스마트 컨트랙트를 채굴하는 데 많은 리소스가 필요함을 유의하세요.

이 "proof-of-work giver" 스마트 컨트랙트 중 하나를 (목적에 따라 이 두 목록 중 하나에서) 임의로 선택하고, 채굴과 유사한 절차를 통해 이 스마트 컨트랙트에서 Toncoin을 얻어야 합니다. 본질적으로, "proof-of-work"을 포함하고 지갑 주소를 포함하는 외부 메시지를 선택한 "proof-of-work giver" 스마트 컨트랙트에 제출하면 필요한 양이 전송됩니다.

## 2. 채굴 과정

"proof-of-work"이 포함된 외부 메시지를 생성하려면 GitHub 저장소에 있는 TON 소스에서 컴파일된 특수 마이닝 유틸리티를 실행해야 합니다. 이 유틸리티는 빌드 디렉토리와 관련하여 './crypto/pow-miner' 파일에 있으며, 빌드 디렉토리에서 `make pow-miner`를 입력해 컴파일할 수 있습니다.

그러나 `pow-miner`를 실행하기 전에 선택한 "proof-of-work giver" 스마트 컨트랙트의 `seed` 및 `complicity` 매개 변수의 실제 값을 알아야 합니다. 이는 이 스마트 컨트랙트의 get-method `get_pow_params`를 호출하여 수행할 수 있습니다. 예를 들어, giver 스마트 컨트랙트를 사용할 경우 `kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN`을 입력하기만 하면 됩니다:

```
> runmethod kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN get_pow_params
```

출력은 다음과 같습니다:

```...
    arguments:  [ 101616 ] 
    result:  [ 229760179690128740373110445116482216837 53919893334301279589334030174039261347274288845081144962207220498432 100000000000 256 ] 
    remote result (not to be trusted):  [ 229760179690128740373110445116482216837 53919893334301279589334030174039261347274288845081144962207220498432 100000000000 256 ]
```

"result:" 줄에서 처음 두 개의 큰 숫자는 이 스마트 컨트랙트의 '시드'와 '복잡도'입니다. 이 예시에서 시드는 `229760179690128740373110445116482216837`이고 복잡도는 `53919893334301279589334030174039261347274288845081144962207220498432`입니다.

다음으로, `pow-miner` 유틸리티를 다음과 같이 호출합니다:

```
$ crypto/pow-miner -vv -w<num-threads> -t<timeout-in-sec> <your-wallet-address> <seed> <complexity> <iterations> <pow-giver-address> <boc-filename>
```

여기서:

- `<num-threads>`는 채굴에 사용하려는 CPU 코어 수입니다.
- `<timeout-in-sec>`는 채굴자가 실패를 인정하기 전에 실행할 수 있는 최대 시간(초)입니다.
- `<your-wallet-address>`는 당신의 지갑 주소(아직 초기화되지 않았을 수도 있음) 입니다. 이는 마스터체인이나 워크체인에 있을 수 있습니다(검증자를 제어하려면 마스터체인 지갑이 필요함).
- `<seed>` 및 `<complexity>`은 get-method `get-pow-params`를 실행하여 얻은 가장 최근 값입니다.
- `<pow-giver-address>`는 선택한 proof-of-work giver 스마트 컨트랙트의 주소입니다.
- `<boc-filename>`는 성공 시 작업 증명이 포함된 외부 메시지가 저장되는 출력 파일의 파일명입니다.

예를 들어 지갑 주소가 `kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7`인 경우, 다음과 같이 실행할 수 있습니다:

```
$ crypto/pow-miner -vv -w7 -t100 kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7 229760179690128740373110445116482216837 53919893334301279589334030174039261347274288845081144962207220498432 100000000000 kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN mined.boc
```

프로그램은 일정 시간(이 경우 최대 100초) 동안 실행된 후 성공적으로 종료(종료 코드 0)되고 필요한 작업 증명을 `mined.boc` 파일에 저장하거나, 작업 증명을 찾을 수 없는 경우 종료 코드가 0이 아닌 상태로 종료됩니다.

실패한 경우 다음과 같은 메시지가 표시됩니다:

```
   [ expected required hashes for success: 2147483648 ]
   [ hashes computed: 1192230912 ]
```

그리고 프로그램은 비정상 종료 코드를 반환하며 종료될 것입니다. 그런 다음 `seed`와 `complexity`를 다시 얻어야 합니다(더 성공적인 채굴자들의 요청 처리 결과로 인해 그동안 변경되었을 수 있기 때문입니다). 새로운 파라미터로 `pow-miner`를 다시 실행하고, 성공할 때까지 이 과정을 반복해야 합니다.

성공한 경우 다음과 같은 내용이 표시됩니다:

```
   [ expected required hashes for success: 2147483648 ]
   4D696E65005EFE49705690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1A1F533B3BC4F5664D6C743C1C5C74BB3342F3A7314364B3D0DA698E6C80C1EA4ACDA33755876665780BAE9BE8A4D6385A1F533B3BC4F5664D6C743C1C5C74BB3342F3A7314364B3D0DA698E6C80C1EA4
   Saving 176 bytes of serialized external message into file `mined.boc`
   [ hashes computed: 1122036095 ]
```

그런 다음 라이트 클라이언트를 사용하여 `mined.boc` 파일에서 proof-of-work giver 스마트 컨트랙트로 외부 메시지를 보낼 수 있습니다 (가능한 한 빨리 이 작업을 수행해야 합니다):

```
> sendfile mined.boc
... external message status is 1
```

몇 초간 기다렸다가 지갑 상태를 확인할 수 있습니다:

:::info
여기와 이후에 나오는 코드, 주석 및/또는 문서에는 "gram", "nanogram" 등의 파라미터, 메서드 및 정의가 포함될 수 있음을 유의하시기 바랍니다. 이는 Telegram이 개발한 원래 TON 코드의 유산입니다. Gram 암호화폐는 발행된 적이 없습니다. TON의 통화는 Toncoin이며, TON 테스트넷의 통화는 Test Toncoin입니다.
:::

```
> last
> getaccount kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7
...
account state is (account
  addr:(addr_std
    anycast:nothing workchain_id:0 address:x5690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1)
  storage_stat:(storage_info
    used:(storage_used
      cells:(var_uint len:1 value:1)
      bits:(var_uint len:1 value:111)
      public_cells:(var_uint len:0 value:0)) last_paid:1593722498
    due_payment:nothing)
  storage:(account_storage last_trans_lt:7720869000002
    balance:(currencies
      grams:(nanograms
        amount:(var_uint len:5 value:100000000000))
      other:(extra_currencies
        dict:hme_empty))
    state:account_uninit))
x{C005690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F12025BC2F7F2341000001C169E9DCD0945D21DBA0004_}
last transaction lt = 7720869000001 hash = 83C15CDED025970FEF7521206E82D2396B462AADB962C7E1F4283D88A0FAB7D4
account balance is 100000000000ng
```

만약 아무도 당신보다 먼저 이 `seed`와 `complexity`로 유효한 작업 증명을 보내지 않았다면, proof-of-work giver는 당신의 작업 증명을 받아들이고, 이는 지갑 잔액에 반영될 것입니다(외부 메시지를 보낸 후 10~20초 정도 걸릴 수 있습니다. 지갑 잔액을 확인하기 전에 여러 번 시도하고 `last`를 입력하여 Lite Client 상태를 새로 고치십시오). 성공한 경우, 잔액이 증가한 것을 볼 수 있습니다(지갑이 존재하지 않았다면 초기화되지 않은 상태로 생성된 것도 확인할 수 있습니다). 실패한 경우, 새로운 `seed`와 `complexity`를 얻고 채굴 과정을 처음부터 다시 반복해야 합니다.

만약 운이 좋아서 지갑의 잔액이 증가했다면, 지갑이 이전에 초기화되지 않았다면 초기화하고 싶을 것입니다 (지갑 생성에 대한 자세한 정보는 `Step-by-Step`에서 찾을 수 있습니다):

```
> sendfile new-wallet-query.boc
... external message status is 1
> last
> getaccount kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7
...
account state is (account
  addr:(addr_std
    anycast:nothing workchain_id:0 address:x5690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1)
  storage_stat:(storage_info
    used:(storage_used
      cells:(var_uint len:1 value:3)
      bits:(var_uint len:2 value:1147)
      public_cells:(var_uint len:0 value:0)) last_paid:1593722691
    due_payment:nothing)
  storage:(account_storage last_trans_lt:7720945000002
    balance:(currencies
      grams:(nanograms
        amount:(var_uint len:5 value:99995640998))
      other:(extra_currencies
        dict:hme_empty))
    state:(account_active
      (
        split_depth:nothing
        special:nothing
        code:(just
          value:(raw@^Cell 
            x{}
             x{FF0020DD2082014C97BA218201339CBAB19C71B0ED44D0D31FD70BFFE304E0A4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED54}
            ))
        data:(just
          value:(raw@^Cell 
            x{}
             x{00000001CE6A50A6E9467C32671667F8C00C5086FC8D62E5645652BED7A80DF634487715}
            ))
        library:hme_empty))))
x{C005690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1206811EC2F7F23A1800001C16B0BC790945D20D1929934_}
 x{FF0020DD2082014C97BA218201339CBAB19C71B0ED44D0D31FD70BFFE304E0A4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED54}
 x{00000001CE6A50A6E9467C32671667F8C00C5086FC8D62E5645652BED7A80DF634487715}
last transaction lt = 7720945000001 hash = 73353151859661AB0202EA5D92FF409747F201D10F1E52BD0CBB93E1201676BF
account balance is 99995640998ng
```

이제 100Toncoin의 행복한 소유자가 되셨습니다. 축하드립니다!

## 3. 실패 시 채굴 과정 자동화

오랜 시간 동안 Toncoin을 얻지 못했다면, 이는 너무 많은 사용자가 동일한 proof-of-work giver 스마트 계약에서 동시에 채굴하고 있기 때문일 수 있습니다. 위에 제공된 목록에서 다른 proof-of-work giver 스마트 계약을 선택해 보십시오. 또는, 간단한 스크립트를 작성하여 올바른 파라미터로 `pow-miner`를 성공할 때까지 반복적으로 실행하고(성공 여부는 `pow-miner`의 종료 코드를 확인하여 감지) `-c 'sendfile mined.boc'` 파라미터를 사용하여 외부 메시지가 발견되면 즉시 보내도록 Lite Client를 호출할 수 있습니다.
