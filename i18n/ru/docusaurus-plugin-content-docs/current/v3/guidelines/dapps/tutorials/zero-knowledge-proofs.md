# Создание простого проекта ZK на TON

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## 👋 Введение

**Доказательства с нулевым разглашением** (ZK) — это фундаментальный криптографический примитив, который позволяет одной стороне (доказывающей) доказать другой стороне (проверяющей), что утверждение истинно, не раскрывая никакой информации, выходящей за рамки действительности самого утверждения. Доказательства с нулевым разглашением — это мощный инструмент для создания систем, сохраняющих конфиденциальность, и использовались в различных приложениях, включая анонимные платежи, анонимные системы обмена сообщениями и не требующие доверия мосты.

:::tip Обновление TVM 2023.07
До июня 2023 года было невозможно проверить криптографические доказательства на TON. Из-за преобладания сложных вычислений за алгоритмом сопряжения потребовалось расширить функциональность TVM, добавив коды операций TVM для проведения проверки доказательств. Эта функциональность была добавлена ​​в [обновлении за июнь 2023 г.](https://docs.ton.org/learn/tvm-instructions/tvm-upgrade#bls12-381) и на момент написания статьи доступна только в тестовой сети.
:::

## 🦄 В этом руководстве будут рассмотрены

1. Основы криптографии с нулевым разглашением и, в частности, zk-SNARK (Краткое неинтерактивное подтверждение знаний с нулевым разглашением - Zero-Knowledge Succinct Non-Interactive Argument of Knowledge)
2. Инициирование церемонии доверенной установки (с использованием возможностей Tau)
3. Написание и компиляция простой схемы ZK (с использованием языка Circom)
4. Создание, развертывание и тестирование контракта FunC для проверки образца ZK-доказательства

## 🟥🟦 Объяснение доказательств ZK на примере с цветовой гаммой

Прежде чем углубиться в детали нулевого разглашения, давайте начнем с простой проблемы. Предположим, вы хотите доказать дальтонику, что можно различать цвета. Мы воспользуемся интерактивным решением для решения этой проблемы. Предположим, дальтоник (проверяющий) находит два одинаковых листка бумаги, один из которых красный 🟥, а другой синий 🟦.

Проверяющий показывает один из листков бумаги вам (доказывающему) и просит запомнить цвет. Затем проверяющий держит этот конкретный листок бумаги за спиной и либо оставляет его прежним, либо меняет его и спрашивает вас, изменился ли цвет или нет. Если вы можете заметить разницу, то вы можете видеть цвета (или вам просто повезло, потому что у вас был 50% шанс угадать правильный цвет).

Теперь, если проверяющий выполнит этот процесс 10 раз, и вы сможете заметить разницу каждый раз, то проверяющий на ~99,90234% (1 - (1/2)^10) уверен, что используются правильные цвета. Таким образом, если верификатор завершит процесс 30 раз, то верификатор будет уверен на 99,99999990686774% (1 - (1/2)^30).

Тем не менее, это интерактивное решение, и неэффективно иметь DApp, которое просит пользователей отправить 30 транзакций для подтверждения определенных данных. Поэтому необходимо неинтерактивное решение; здесь вступают в дело Zk-SNARK и Zk-STARK.

Для целей этого руководства мы рассмотрим только Zk-SNARK. Однако вы можете прочитать больше о том, как работают Zk-STARK, на [сайте StarkWare](https://starkware.co/stark/), а информацию, сравнивающую различия между Zk-SNARK и Zk-STARK, можно найти в этой [записи в блоге Panther Protocol](https://blog.pantherprotocol.io/zk-snarks-vs-zk-starks-differences-in-zero-knowledge-technologies/).\*\*

### 🎯 Zk-SNARK: Zero-Knowledge Succinct Non-Interactive Argument of Knowledge

Zk-SNARK — это неинтерактивная система доказательства, в которой доказывающий может продемонстрировать проверяющему, что утверждение истинно, просто предоставив одно доказательство. А проверяющий может проверить доказательство за очень короткое время. Обычно работа с Zk-SNARK состоит из трех основных этапов:

- Проведение доверенной настройки с использованием протокола [многосторонних вычислений (MPC)](https://en.wikipedia.org/wiki/Secure_multi-party_computation) для генерации ключей подтверждения и проверки (с использованием полномочий TAU)
- Генерация доказательства с использованием ключа подтверждающего, открытого ввода и секретного ввода (свидетеля)
- Проверка доказательства

Давайте настроим нашу среду разработки и начнем кодировать!

## ⚙ Настройка среды разработки

Давайте начнем процесс, выполнив следующие шаги:

1. Создайте новый проект под названием «simple-zk» с помощью [Blueprint](https://github.com/ton-org/blueprint), выполнив следующую команду, после этого введите имя для вашего контракта (например, ZkSimple), а затем выберите первый вариант (используя пустой контракт).

```bash
npm create ton@latest simple-zk
```

2. Далее мы клонируем [репозиторий snarkjs](https://github.com/kroist/snarkjs), настроенный для поддержки контрактов FunC

```bash
git clone https://github.com/kroist/snarkjs.git
cd snarkjs
npm ci
cd ../simple-zk
```

3. Затем мы установим необходимые библиотеки для ZkSNARKs

```bash
npm add --save-dev snarkjs ffjavascript
npm i -g circom
```

4. Далее мы добавим следующий раздел в package.json (обратите внимание, что некоторые из кодов операций, которые мы будем использовать, пока недоступны в выпуске основной сети)

```json
"overrides": {
    "@ton-community/func-js-bin": "0.4.5-tvmbeta.1",
    "@ton-community/func-js": "0.6.3-tvmbeta.1"
}
```

5. Кроме того, нам нужно будет изменить версию @ton-community/sandbox, чтобы иметь возможность использовать [последние обновления TVM](https://t.me/thetontech/56)

```bash
npm i --save-dev @ton-community/sandbox@0.12.0-tvmbeta.1
```

Отлично! Теперь мы готовы начать писать наш первый проект ZK на TON!

В настоящее время у нас есть две основные папки, из которых состоит наш проект ZK:

- Папка `simple-zk`: содержит наш шаблон Blueprint, который позволит нам писать схему, контракты и тесты
- Папка `snarkjs`: содержит репозиторий snarkjs, который мы клонировали на шаге 2

## Схема Circom

Сначала давайте создадим папку `simple-zk/circuits`, а затем создадим в ней файл и добавим в него следующий код:

```circom
template Multiplier() {
   signal private input a;
   signal private input b;
   //private input means that this input is not public and will not be revealed in the proof

   signal output c;

   c <== a*b;
 }

component main = Multiplier();
```

Выше мы добавили простую схему умножения. Используя эту схему, мы можем доказать, что знаем два числа, которые при умножении дают определенное число (c), не раскрывая сами соответствующие числа (a и b).

Чтобы узнать больше о языке circom, посетите [этот сайт](https://docs.circom.io/).

Далее мы создадим папку для наших файлов сборки и переместим туда данные, выполнив следующее (находясь в папке `simple-zk`):

```bash
mkdir -p ./build/circuits
cd ./build/circuits
```

### 💪 Создание доверенной настройки с полномочиями TAU

Теперь пришло время создать доверенную настройку. Для выполнения этого процесса мы воспользуемся методом [Сила Tau](https://a16zcrypto.com/posts/article/on-chain-trusted-setup-ceremony/) (который, вероятно, займет несколько минут). Давайте приступим к делу:

```bash
echo 'prepare phase1'
node ../../../snarkjs/build/cli.cjs powersoftau new bls12-381 14 pot14_0000.ptau -v
echo 'contribute phase1 first'
node ../../../snarkjs/build/cli.cjs powersoftau contribute pot14_0000.ptau pot14_0001.ptau --name="First contribution" -v -e="some random text"
echo 'contribute phase1 second'
node ../../../snarkjs/build/cli.cjs powersoftau contribute pot14_0001.ptau pot14_0002.ptau --name="Second contribution" -v -e="some random text"
echo 'apply a random beacon'
node ../../../snarkjs/build/cli.cjs powersoftau beacon pot14_0002.ptau pot14_beacon.ptau 0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 10 -n="Final Beacon"
echo 'prepare phase2'
node ../../../snarkjs/build/cli.cjs powersoftau prepare phase2 pot14_beacon.ptau pot14_final.ptau -v
echo 'Verify the final ptau'
node ../../../snarkjs/build/cli.cjs powersoftau verify pot14_final.ptau
```

После завершения описанного выше процесса в папке build/circuits будет создан файл pot14_final.ptau, который можно использовать для написания будущих связанных схем.

:::caution Размер ограничений
Если написана более сложная схема с большим количеством ограничений, необходимо сгенерировать настройку PTAU с использованием большего параметра.
:::

Вы можете удалить ненужные файлы:

```bash
rm pot14_0000.ptau pot14_0001.ptau pot14_0002.ptau pot14_beacon.ptau
```

### 📜 Компиляция схемы

Теперь давайте скомпилируем схему, выполнив следующую команду из папки `build/circuits`:

```bash
circom ../../circuits/test.circom --r1cs circuit.r1cs --wasm circuit.wasm --prime bls12381 --sym circuit.sym
```

Теперь наша схема скомпилирована в файлы `build/circuits/circuit.sym`, `build/circuits/circuit.r1cs` и `build/circuits/circuit.wasm`.

:::info кривые altbn-128 и bls12-381
Эллиптические кривые altbn-128 и bls12-381 в настоящее время поддерживаются snarkjs. Кривая [altbn-128](https://eips.ethereum.org/EIPS/eip-197) поддерживается только в Ethereum. Однако в TON поддерживается только кривая bls12-381.
:::

Давайте проверим размер ограничений нашей схемы, введя следующую команду:

```bash
node ../../../snarkjs/build/cli.cjs r1cs info circuit.r1cs 
```

Поэтому правильный результат должен быть:

```bash
[INFO]  snarkJS: Curve: bls12-381
[INFO]  snarkJS: # of Wires: 4
[INFO]  snarkJS: # of Constraints: 1
[INFO]  snarkJS: # of Private Inputs: 2
[INFO]  snarkJS: # of Public Inputs: 0
[INFO]  snarkJS: # of Labels: 4
[INFO]  snarkJS: # of Outputs: 1
```

Теперь мы можем сгенерировать эталонный zkey, выполнив следующее:

```bash
node ../../../snarkjs/build/cli.cjs zkey new circuit.r1cs pot14_final.ptau circuit_0000.zkey
```

Затем мы добавим следующий вклад в zkey:

```bash
echo "some random text" | node ../../../snarkjs/build/cli.cjs zkey contribute circuit_0000.zkey circuit_0001.zkey --name="1st Contributor Name" -v
```

Далее давайте экспортируем окончательный zkey:

```bash
echo "another random text" | node ../../../snarkjs/build/cli.cjs zkey contribute circuit_0001.zkey circuit_final.zkey
```

Теперь у нас есть наш окончательный zkey, присутствующий в файле `build/circuits/circuit_final.zkey`. Затем zkey проверяется, вводя следующее:

```bash
node ../../../snarkjs/build/cli.cjs zkey verify circuit.r1cs pot14_final.ptau circuit_final.zkey
```

Наконец, пришло время сгенерировать ключ проверки:

```bash
node ../../../snarkjs/build/cli.cjs zkey export verificationkey circuit_final.zkey verification_key.json
```

Затем мы удалим ненужные файлы:

```bash
rm circuit_0000.zkey circuit_0001.zkey
```

После выполнения вышеуказанных процессов папка `build/circuits` должна отображаться следующим образом:

```
build
└── circuits
        ├── circuit_final.zkey
        ├── circuit.r1cs
        ├── circuit.sym
        ├── circuit.wasm
        ├── pot14_final.ptau
        └── verification_key.json

```

### ✅ Экспорт контракта верификатора

Последний шаг в этом разделе — сгенерировать контракт верификатора FunC, который мы будем использовать в нашем проекте ZK.

```bash
node ../../../snarkjs/build/cli.cjs zkey export funcverifier circuit_final.zkey ../../contracts/verifier.fc
```

Затем в папке `contracts` генерируется файл `verifier.fc`.

## 🚢 Развертывание контракта верификатора​

Давайте рассмотрим файл `contracts/verifier.fc` пошагово, поскольку он содержит магию ZK-SNARK:

```func
const slice IC0 = "b514a6870a13f33f07bc314cdad5d426c61c50b453316c241852089aada4a73a658d36124c4df0088f2cd8838731b971"s;
const slice IC1 = "8f9fdde28ca907af4acff24f772448a1fa906b1b51ba34f1086c97cd2c3ac7b5e0e143e4161258576d2a996c533d6078"s;

const slice vk_gamma_2 = "93e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8"s;
const slice vk_delta_2 = "97b0fdbc9553a62a79970134577d1b86f7da8937dd9f4d3d5ad33844eafb47096c99ee36d2eab4d58a1f5b8cc46faa3907e3f7b12cf45449278832eb4d902eed1d5f446e5df9f03e3ce70b6aea1d2497fd12ed91bd1d5b443821223dca2d19c7"s;
const slice vk_alpha_1 = "a3fa7b5f78f70fbd1874ffc2104f55e658211db8a938445b4a07bdedd966ec60090400413d81f0b6e7e9afac958abfea"s;
const slice vk_beta_2 = "b17e1924160eff0f027c872bc13ad3b60b2f5076585c8bce3e5ea86e3e46e9507f40c4600401bf5e88c7d6cceb05e8800712029d2eff22cbf071a5eadf166f266df75ad032648e8e421550f9e9b6c497b890a1609a349fbef9e61802fa7d9af5"s;
```

Выше приведены константы, которые контракты верификаторов должны использовать для реализации проверки доказательств. Эти параметры можно найти в файле `build/circuits/verification_key.json`.

```func
slice bls_g1_add(slice x, slice y) asm "BLS_G1_ADD";
slice bls_g1_neg(slice x) asm "BLS_G1_NEG";
slice bls_g1_multiexp(
        slice x1, int y1,
        int n
) asm "BLS_G1_MULTIEXP";
int bls_pairing(slice x1, slice y1, slice x2, slice y2, slice x3, slice y3, slice x4, slice y4, int n) asm "BLS_PAIRING";
```

Приведенные выше строки — это новые [коды операций TVM](/v3/documentation/tvm/changelog/tvm-upgrade-2023-07#bls12-381) (BLS12-381), которые позволяют проводить проверки пар в блокчейне TON.

Функции load_data и save_data просто используются для загрузки и сохранения результатов проверки доказательств (только для целей тестирования).

```func
() load_data() impure {

    var ds = get_data().begin_parse();

    ctx_res = ds~load_uint(32);

    ds.end_parse();
}

() save_data() impure {
    set_data(
            begin_cell()
                    .store_uint(ctx_res, 32)
                    .end_cell()
    );
}
```

Далее следует несколько простых функций утилит, которые используются для загрузки данных доказательства, отправленных в контракт:

```func
(slice, slice) load_p1(slice body) impure {
    ...
}

(slice, slice) load_p2(slice body) impure {
    ...
}

(slice, int) load_newint(slice body) impure {
    ...
}
```

И последняя часть — это функция groth16Verify, которая требуется для проверки действительности доказательства, отправленного в контракт.

```func
() groth16Verify(
        slice pi_a,
        slice pi_b,
        slice pi_c,

        int pubInput0

) impure {

    slice cpub = bls_g1_multiexp(

            IC1, pubInput0,

            1
    );


    cpub = bls_g1_add(cpub, IC0);
    slice pi_a_neg = bls_g1_neg(pi_a);
    int a = bls_pairing(
            cpub, vk_gamma_2,
            pi_a_neg, pi_b,
            pi_c, vk_delta_2,
            vk_alpha_1, vk_beta_2,
            4);
    ;; ctx_res = a;
    if (a == 0) {
        ctx_res = 0;
    } else {
        ctx_res = 1;
    }
    save_data();
}
```

Теперь необходимо отредактировать два файла в папке `wrappers`. Первый файл, требующий нашего внимания, — это файл `ZkSimple.compile.ts` (если на шаге 1 было задано другое имя для контракта, его имя будет другим). Мы поместим файл `verifier.fc` в список контрактов, которые должны быть скомпилированы.

```ts
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
  lang: 'func',
  targets: ['contracts/verifier.fc'], // <-- here we put the path to our contract
};
```

Другой файл, требующий внимания, — это `ZkSimple.ts`. Сначала нам нужно добавить код операции `verify` в перечисление `Opcodes`:

```ts
export const Opcodes = {
  verify: 0x3b3cca17,
};
```

Далее необходимо добавить функцию `sendVerify` в класс `ZkSimple`. Эта функция используется для отправки доказательства в контракт и его проверки и представлена ​​следующим образом:

```ts
async sendVerify(
  provider: ContractProvider,
  via: Sender,
  opts: {
  pi_a: Buffer;
  pi_b: Buffer;
  pi_c: Buffer;
  pubInputs: bigint[];
  value: bigint;
  queryID?: number;
}
) {
  await provider.internal(via, {
    value: opts.value,
    sendMode: SendMode.PAY_GAS_SEPARATELY,
    body: beginCell()
      .storeUint(Opcodes.verify, 32)
      .storeUint(opts.queryID ?? 0, 64)
      .storeRef(
        beginCell()
          .storeBuffer(opts.pi_a)
          .storeRef(
            beginCell()
              .storeBuffer(opts.pi_b)
              .storeRef(
                beginCell()
                  .storeBuffer(opts.pi_c)
                  .storeRef(
                    this.cellFromInputList(opts.pubInputs)
                  )
              )
          )
      )
      .endCell(),
  });
}
```

Далее мы добавим функцию `cellFromInputList` в класс `ZkSimple`. Эта функция используется для создания ячейки из общедоступных входов, которые будут отправлены в контракт.

```ts
 cellFromInputList(list: bigint[]) : Cell {
  var builder = beginCell();
  builder.storeUint(list[0], 256);
  if (list.length > 1) {
    builder.storeRef(
      this.cellFromInputList(list.slice(1))
    );
  }
  return builder.endCell()
}
```

Наконец, последняя функция, которую мы добавим в класс `ZkSimple`, — это функция `getRes`. Эта функция используется для получения результата проверки доказательства.

```ts
 async getRes(provider: ContractProvider) {
  const result = await provider.get('get_res', []);
  return result.stack.readNumber();
}
```

Теперь мы можем запустить требуемые тесты, необходимые для развертывания контракта. Чтобы это стало возможным, контракт должен успешно пройти тест развертывания. Запустите эту команду в корне папки `simple-zk`:

```bash
npx blueprint test
```

## 🧑‍💻 Написание тестов для верификатора

Откроем файл `ZkSimple.spec.ts` в папке `tests` и напишем тест для функции `verify`. Тест проводится следующим образом:

```ts
describe('ZkSimple', () => {
  let code: Cell;

  beforeAll(async () => {
    code = await compile('ZkSimple');
  });

  let blockchain: Blockchain;
  let zkSimple: SandboxContract<ZkSimple>;

  beforeEach(async () => {
    // deploy contract
  });

  it('should deploy', async () => {
    // the check is done inside beforeEach
    // blockchain and zkSimple are ready to use
  });

  it('should verify', async () => {
    // todo write the test
  });
});
```

Сначала нам нужно импортировать несколько пакетов, которые мы будем использовать в тесте:

````ts
import * as snarkjs from "snarkjs";
import path from "path";
import {buildBls12381, utils} from "ffjavascript";
const {unstringifyBigInts} = utils;

* If you run the test, the result will be a TypeScript error, because we don't have a declaration file for the module 'snarkjs' & ffjavascript. This can be addressed by editing the `tsconfig.json` file in the root of the `simple-zk` folder. We'll need to change the _**strict**_ option to **_false_** in that file
* 
We'll also need to import the `circuit.wasm` and `circuit_final.zkey` files which will be used to generate the proof to send to the contract. 
```ts
const wasmPath = path.join(__dirname, "../build/circuits", "circuit.wasm");
const zkeyPath = path.join(__dirname, "../build/circuits", "circuit_final.zkey");
````

Заполним тест `should verify`. Сначала нам нужно будет сгенерировать доказательство.

```ts
it('should verify', async () => {
  // proof generation
  let input = {
    "a": "123",
    "b": "456",
  }
  let {proof, publicSignals} = await snarkjs.groth16.fullProve(input, wasmPath, zkeyPath);
  let curve = await buildBls12381();
  let proofProc = unstringifyBigInts(proof);
  var pi_aS = g1Compressed(curve, proofProc.pi_a);
  var pi_bS = g2Compressed(curve, proofProc.pi_b);
  var pi_cS = g1Compressed(curve, proofProc.pi_c);
  var pi_a = Buffer.from(pi_aS, "hex");
  var pi_b = Buffer.from(pi_bS, "hex");
  var pi_c = Buffer.from(pi_cS, "hex");
  
  // todo send the proof to the contract
});
```

Для выполнения следующего шага необходимо определить функции `g1Compressed`, `g2Compressed` и `toHexString`. Они будут использоваться для преобразования криптографического доказательства в формат, который ожидает контракт.

```ts
function g1Compressed(curve, p1Raw) {
  let p1 = curve.G1.fromObject(p1Raw);

  let buff = new Uint8Array(48);
  curve.G1.toRprCompressed(buff, 0, p1);
  // convert from ffjavascript to blst format
  if (buff[0] & 0x80) {
    buff[0] |= 32;
  }
  buff[0] |= 0x80;
  return toHexString(buff);
}

function g2Compressed(curve, p2Raw) {
  let p2 = curve.G2.fromObject(p2Raw);

  let buff = new Uint8Array(96);
  curve.G2.toRprCompressed(buff, 0, p2);
  // convert from ffjavascript to blst format
  if (buff[0] & 0x80) {
    buff[0] |= 32;
  }
  buff[0] |= 0x80;
  return toHexString(buff);
}

function toHexString(byteArray) {
  return Array.from(byteArray, function (byte: any) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join("");
}
```

Теперь мы можем отправить криптографическое доказательство в контракт. Для этого мы будем использовать функцию sendVerify. Функция `sendVerify` ожидает 5 параметров: `pi_a`, `pi_b`, `pi_c`, `pubInputs` и `value`.

```ts
it('should verify', async () => {
  // proof generation
  
  
  // send the proof to the contract
  const verifier = await blockchain.treasury('verifier');
  const verifyResult = await zkSimple.sendVerify(verifier.getSender(), {
    pi_a: pi_a,
    pi_b: pi_b,
    pi_c: pi_c,
    pubInputs: publicSignals,
    value: toNano('0.15'), // 0.15 TON for fee
  });
  expect(verifyResult.transactions).toHaveTransaction({
    from: verifier.address,
    to: zkSimple.address,
    success: true,
  });

  const res = await zkSimple.getRes();

  expect(res).not.toEqual(0); // check proof result

  return;
  
});
```

Вы готовы проверить свое первое доказательство на блокчейне TON? Чтобы начать этот процесс, давайте запустим тест Blueprint, введя следующее:

```bash
npx blueprint test
```

Результат должен быть следующим:

```bash
 PASS  tests/ZkSimple.spec.ts
  ZkSimple
    ✓ should deploy (857 ms)
    ✓ should verify (1613 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        4.335 s, estimated 5 s
Ran all test suites.
```

Чтобы проверить репозиторий, содержащий код из этого руководства, нажмите на следующую ссылку, доступной [здесь](https://github.com/SaberDoTcodeR/zk-ton-doc).

## 🏁 Заключение

В этом руководстве вы изучили следующие навыки:

- Сложности нулевого разглашения и, в частности, ZK-SNARK
- Написание и компиляция схем Circom
- Более глубокое знакомство с MPC и возможностями TAU, которые использовались для генерации ключей проверки для схемы
- Познакомились с библиотекой Snarkjs для экспорта верификатора FunC для схемы
- Познакомились с Blueprint для развертывания верификатора и написания тестов

Примечание: приведенные выше примеры научили нас, как создать простой вариант использования ZK. Тем не менее, существует широкий спектр очень сложных вариантов использования, ориентированных на ZK, которые можно реализовать в самых разных отраслях. Вот некоторые из них:

- частные системы голосования 🗳
- частные системы лотерей 🎰
- частные системы аукционов 🤝
- частные транзакции💸 (для Toncoin или Жетонов)

Если у вас возникнут вопросы или вы обнаружите какие-либо ошибки в этом руководстве, не стесняйтесь писать автору: [@saber_coder](https://t.me/saber_coder)

## 📌 Ссылки

- [Обновление TVM за июнь 2023 г.](https://docs.ton.org/learn/tvm-instructions/tvm-upgrade)
- [SnarkJs](https://github.com/iden3/snarkjs)
- [Ответвление SnarkJs FunC](https://github.com/kroist/snarkjs)
- [Пример ZK на TON](https://github.com/SaberDoTcodeR/ton-zk-verifier)
- [Blueprint](https://github.com/ton-org/blueprint)

## 📖 Смотрите также

- [EVM-контракты TON с мостом без доверия](https://github.com/ton-blockchain/ton-trustless-bridge-evm-contracts)
- [Tonnel Network: протокол конфиденциальности в TON](http://github.com/saberdotcoder/tonnel-network)
- [TVM Challenge](https://blog.ton.org/tvm-challenge-is-here-with-over-54-000-in-rewards)

## 📬 Об авторе

- Saber в [Telegram](https://t.me/saber_coder) или [GitHub](https://github.com/saberdotcoder) или [LinkedIn](https://www.linkedin.com/in/szafarpoor/)
