# Сборка Fift и TVM

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Fift — это язык программирования на основе стека, который имеет специфичные для TON функции и, следовательно, может работать с ячейками. Сборка TVM — это также язык программирования на основе стека, также специфичный для TON, и он также может работать с ячейками. Так в чем же разница между ними?

## В чем разница

Fift выполняется **во время компиляции** — когда ваш компилятор создает код смарт-контракта BOC, после обработки кода FunC. Fift может выглядеть по-разному:

```
// tuple primitives
x{6F0} @Defop(4u) TUPLE
x{6F00} @Defop NIL
x{6F01} @Defop SINGLE
x{6F02} dup @Defop PAIR @Defop CONS
```

> Определения кодов операций TVM в Asm.fif

```
"Asm.fif" include
<{ SETCP0 DUP IFNOTRET // return if recv_internal
   DUP 85143 INT EQUAL OVER 78748 INT EQUAL OR IFJMP:<{ // "seqno" and "get_public_key" get-methods
     1 INT AND c4 PUSHCTR CTOS 32 LDU 32 LDU NIP 256 PLDU CONDSEL  // cnt or pubk
   }>
   INC 32 THROWIF	// fail unless recv_external
   9 PUSHPOW2 LDSLICEX DUP 32 LDU 32 LDU 32 LDU 	//  signature in_msg subwallet_id valid_until msg_seqno cs
   NOW s1 s3 XCHG LEQ 35 THROWIF	//  signature in_msg subwallet_id cs msg_seqno
   c4 PUSH CTOS 32 LDU 32 LDU 256 LDU ENDS	//  signature in_msg subwallet_id cs msg_seqno stored_seqno stored_subwallet public_key
   s3 s2 XCPU EQUAL 33 THROWIFNOT	//  signature in_msg subwallet_id cs public_key stored_seqno stored_subwallet
   s4 s4 XCPU EQUAL 34 THROWIFNOT	//  signature in_msg stored_subwallet cs public_key stored_seqno
   s0 s4 XCHG HASHSU	//  signature stored_seqno stored_subwallet cs public_key msg_hash
   s0 s5 s5 XC2PU	//  public_key stored_seqno stored_subwallet cs msg_hash signature public_key
   CHKSIGNU 35 THROWIFNOT	//  public_key stored_seqno stored_subwallet cs
   ACCEPT
   WHILE:<{
     DUP SREFS	//  public_key stored_seqno stored_subwallet cs _51
   }>DO<{	//  public_key stored_seqno stored_subwallet cs
     8 LDU LDREF s0 s2 XCHG	//  public_key stored_seqno stored_subwallet cs _56 mode
     SENDRAWMSG
   }>	//  public_key stored_seqno stored_subwallet cs
   ENDS SWAP INC	//  public_key stored_subwallet seqno'
   NEWC 32 STU 32 STU 256 STU ENDC c4 POP
}>c
```

> wallet_v3_r2.fif

Последний фрагмент кода выглядит как сборка TVM, и большая его часть на самом деле таковой и является Как это может произойти?

Представьте, что вы разговариваете с программистом-стажером и говорите ему: "А теперь добавьте команды, выполняющие это, это и то, в конец функции". Ваши команды оказываются в программе стажера. Они обрабатываются дважды — как и здесь, коды операций написанные заглавными буквами (SETCP0, DUP и т. д.) обрабатываются как Fift, так и TVM.

Вы можете объяснить высокоуровневые абстракции своему стажеру, в конечном итоге он поймет и сможет их использовать. Fift также расширяем — вы можете определять свои собственные команды. Фактически, Asm[Tests].fif полностью посвящен определению кодов операций TVM.

Коды операций TVM, с другой стороны, выполняются **во время выполнения** — это код смарт-контрактов. Их можно рассматривать как программу вашего стажера — сборка TVM может делать меньше вещей (например, у нее нет встроенных примитивов для подписи данных — потому что все, что TVM делает в блокчейне, является публичным), но она действительно может взаимодействовать со своей средой.

## Использование в смарт-контрактах

### [Fift] — Помещение большого BOC в контракт

Это возможно, если вы используете `toncli`. Если вы используете другие компиляторы для сборки контракта, возможно, есть другие способы включить большой BOC.
Отредактируйте `project.yaml` так, чтобы `fift/blob.fif` был включен при сборке кода смарт-контракта:

```
contract:
  fift:
    - fift/blob.fif
  func:
    - func/code.fc
```

Поместите BOC в `fift/blob.boc`, затем добавьте следующий код в `fift/blob.fif`:

```
<b 8 4 u, 8 4 u, "fift/blob.boc" file>B B>boc ref, b> <s @Defop LDBLOB
```

Теперь вы можете извлечь этот blob из смарт-контракта:

```
cell load_blob() asm "LDBLOB";

() recv_internal() {
    send_raw_message(load_blob(), 160);
}
```

### [Сборка TVM] - Преобразование целого числа в строку

К сожалению, попытка преобразования int в строку с использованием примитивов Fift завершилась неудачей.

```
slice int_to_string(int x) asm "(.) $>s PUSHSLICE";
```

Причина очевидна: Fift выполняет вычисления во время компиляции, где еще нет `x`, доступного для преобразования. Чтобы преобразовать непостоянное целое число в фрагмент строки, вам нужна сборка TVM. Например, это код одного из участников TON Smart Challenge 3:

```
tuple digitize_number(int value)
  asm "NIL WHILE:<{ OVER }>DO<{ SWAP TEN DIVMOD s1 s2 XCHG TPUSH }> NIP";

builder store_number(builder msg, tuple t)
  asm "WHILE:<{ DUP TLEN }>DO<{ TPOP 48 ADDCONST ROT 8 STU SWAP }> DROP";

builder store_signed(builder msg, int v) inline_ref {
  if (v < 0) {
    return msg.store_uint(45, 8).store_number(digitize_number(- v));
  } elseif (v == 0) {
    return msg.store_uint(48, 8);
  } else {
    return msg.store_number(digitize_number(v));
  }
}
```

### [Сборка TVM] - Дешевое умножение по модулю

```
int mul_mod(int a, int b, int m) inline_ref {               ;; 1232 gas units
  (_, int r) = muldivmod(a % m, b % m, m);
  return r;
}
int mul_mod_better(int a, int b, int m) inline_ref {        ;; 1110 gas units
  (_, int r) = muldivmod(a, b, m);
  return r;
}
int mul_mod_best(int a, int b, int m) asm "x{A988} s,";     ;; 65 gas units
```

`x{A988}` - это код операции, отформатированный в соответствии с [5.2 Деление](/v3/documentation/tvm/instructions#A988): деление с предварительным умножением, где единственным возвращаемым результатом является остаток по модулю третьего аргумента. Но код операции должен попасть в код смарт-контракта - именно это и делает `s,`: он сохраняет фрагмент поверх стека в сборщике немного ниже.
