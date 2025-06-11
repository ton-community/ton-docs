import Feedback from '@site/src/components/Feedback';

# Drawing conclusions from TON Hack Challenge

10월 23일에 TON 핵 챌린지가 열렸습니다.
TON 메인넷에 배포된 여러 스마트 컨트랙트에서 가상 보안 침해가 발생했습니다. 모든 컨트랙트에는 3000톤 또는 5000톤의 잔액이 있었으며, 참가자는 이를 해킹하여 즉시 보상을 받을 수 있었습니다.

소스 코드와 콘테스트 규칙은 깃허브[여기](https://github.com/ton-blockchain/hack-challenge-1)에서 호스팅되었습니다.

## 계약

### 2. 은행

:::note 보안 규칙
항상 함수에서 [`불순물`](/v3/documentation/smart-contracts/func/docs/functions#impure-specifier) 수정자가 있는지 확인하세요.
:::

첫 번째 작업은 매우 간단했습니다. 공격자는 `authorize` 함수가 `불순한` 함수가 아니라는 것을 알아낼 수 있었습니다. 이 수정자가 없으면 컴파일러는 아무것도 반환하지 않거나 반환값이 사용되지 않는 경우 해당 함수에 대한 호출을 건너뛸 수 있습니다.

```func
() authorize (sender) inline {
  throw_unless(187, equal_slice_bits(sender, addr1) | equal_slice_bits(sender, addr2));
}
```

### 7. 더 나은 은행

:::note 보안 규칙
항상 [수정/비수정](/v3/documentation/스마트-계약/펀크/문서/문서#메소드 호출) 메소드를 확인하세요.
:::

'.`대신`~`로 `udict_delete_get?\\`을 호출했기 때문에 실제 딕셔너리는 그대로 유지되었습니다.

```func
(_, slice old_balance_slice, int found?) = accounts.udict_delete_get?(256, sender);
```

### 3. DAO

:::note 보안 규칙
꼭 필요한 경우 부호 있는 정수를 사용하세요.
:::

투표권은 정수로 메시지에 저장되었습니다. 따라서 공격자는 전력 전송 중에 음수 값을 전송하여 무한대의 투표권을 얻을 수 있었습니다.

```func
(cell,()) transfer_voting_power (cell votes, slice from, slice to, int amount) impure {
  int from_votes = get_voting_power(votes, from);
  int to_votes = get_voting_power(votes, to);

  from_votes -= amount;
  to_votes += amount;

  ;; No need to check that result from_votes is positive: set_voting_power will throw for negative votes
  ;; throw_unless(998, from_votes > 0);

  votes~set_voting_power(from, from_votes);
  votes~set_voting_power(to, to_votes);
  return (votes,());
}
```

### 4. 복권

:::note 보안 규칙
rand()\\`]를 수행하기 전에 항상 시드를 무작위로 생성합니다(/v3/documentation/smart-contacts/func/docs/stdlib#rand).
:::

시드는 트랜잭션의 논리적 시간에서 가져온 것이며, 해커는 현재 블록의 논리적 시간을 무차별 대입하여 승리할 수 있습니다(한 블록의 경계에서 순차적이기 때문에).

```func
int seed = cur_lt();
int seed_size = min(in_msg_body.slice_bits(), 128);

if(in_msg_body.slice_bits() > 0) {
    seed += in_msg_body~load_uint(seed_size);
}
set_seed(seed);
var balance = get_balance().pair_first();
if(balance > 5000 * 1000000000) {
    ;; forbid too large jackpot
    raw_reserve( balance - 5000 * 1000000000, 0);
}
if(rand(10000) == 7777) { ...send reward... }
```

### 5. 월렛

:::note 보안 규칙
모든 것이 블록체인에 저장된다는 점을 기억하세요.
:::

지갑은 비밀번호로 보호되었고, 해시는 컨트랙트 데이터에 저장되었습니다. 그러나 블록체인은 모든 것을 기억합니다. 암호는 거래 내역에 있었습니다.

### 6. Vault

:::note 보안 규칙
반송된](/v3/documentation/smart-contacts/message-management/non-bounceable-messages) 메시지를 항상 확인하세요.
표준](/v3/documentation/smart-contracts/func/docs/stdlib/) 기능으로 인한 오류도 잊지 마세요.
조건을 최대한 엄격하게 설정하세요.
:::

볼트에는 데이터베이스 메시지 핸들러에 다음 코드가 있습니다:

```func
int mode = null();
if (op == op_not_winner) {
    mode = 64; ;; Refund remaining check-TONs
               ;; addr_hash corresponds to check requester
} else {
     mode = 128; ;; Award the prize
                 ;; addr_hash corresponds to the withdrawal address from the winning entry
}
```

사용자가 '확인'을 보내면 Vault는 반송 처리기나 프록시 메시지를 데이터베이스에 보내지 않습니다. 데이터베이스에서 `load_msg_addr_none`을 어워드 주소로 설정할 수 있는데, 이는 `load_msg_address`가 이를 허용하기 때문입니다. 볼트에서 수표를 요청하고, 데이터베이스에서 [`parse_std_addr`](/v3/documentation/smart-contracts/func/docs/stdlib#parse_std_addr)를 사용하여 `msg_addr_none` 구문 분석을 시도하지만 실패합니다. 메시지가 데이터베이스에서 볼트로 반송되고 연산이 `op_not_winner`가 아닙니다.

### 8. Dehasher

:::note 보안 규칙
재미로 계정을 파기하지 마세요.
자신에게 송금하는 대신 [`raw_reserve`](/v3/documentation/smart-contracts/func/docs/stdlib#raw_reserve)를 만드세요.
가능한 경쟁 조건에 대해 생각하세요.
해시맵 가스 소비에 주의하세요.
:::

계약에 경쟁 조건이 있었는데, 돈을 입금한 다음 동시 메시지로 두 번 인출을 시도할 수 있었습니다. 예약된 돈이 있는 메시지가 처리될 것이라는 보장은 없으므로 두 번째 인출 후 은행이 종료될 수 있습니다. 그 후에는 계약이 다시 배포될 수 있으며 누구나 미청구 금액을 인출할 수 있습니다.

### 8. Dehasher

:::note 보안 규칙
계약에서 타사 코드를 실행하지 마세요.
:::

```func
slice try_execute(int image, (int -> slice) dehasher) asm "<{ TRY:<{ EXECUTE DEPTH 2 THROWIFNOT }>CATCH<{ 2DROP NULL }> }>CONT"   "2 1 CALLXARGS";

slice safe_execute(int image, (int -> slice) dehasher) inline {
  cell c4 = get_data();

  slice preimage = try_execute(image, dehasher);

  ;; restore c4 if dehasher spoiled it
  set_data(c4);
  ;; clean actions if dehasher spoiled them
  set_c5(begin_cell().end_cell());

  return preimage;
}
```

아웃 오브 가스`](/v3/documentation/tvm/tvm-exit-codes#standard-exit-codes) 예외는 `CATCH`에서 처리할 수 없기 때문에 컨트랙트에서 타사 코드를 안전하게 실행할 수 있는 방법이 없습니다. 공격자는 단순히 [`COMMIT`](/v3/documentation/tvm/instruction#F80F)를 통해 모든 컨트랙트 상태를 변경하고 `out of gas\\`를 발생시킬 수 있습니다.

## 결론

이 글이 펀씨 개발자에게 명확하지 않은 규칙에 대해 조금이나마 도움이 되었기를 바랍니다.

## 참조

- [dvlkv on GitHub](https://github.com/dvlkv) - _Dan Volkov_
- [Original article](https://dev.to/dvlkv/drawing-conclusions-from-ton-hack-challenge-1aep) - _Dan Volkov_

<Feedback />

