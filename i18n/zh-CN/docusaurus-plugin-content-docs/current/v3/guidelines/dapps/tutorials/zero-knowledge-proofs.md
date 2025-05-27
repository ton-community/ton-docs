# 在 TON 上构建一个简单的 ZK 项目

## 👋 介绍

**零知识**（ZK）证明是一种基本的密码学原语，它允许一方（证明者）向另一方（验证者）证明一个陈述是真实的，而不泄露除了该陈述本身的有效性之外的任何信息。零知识证明是构建隐私保护系统的强大工具，已在多种应用中使用，包括匿名支付、匿名消息系统和无信任桥接。

:::tip TVM 升级 2023.07
在 2023 年 6 月之前，不能在 TON 上验证加密证明。由于配对算法背后复杂计算的普遍性，有必要通过添加 TVM 操作码来增加 TVM 的功能以执行证明验证。该功能已在 [2023 年 6 月更新](https://docs.ton.org/learn/tvm-instructions/tvm-upgrade#bls12-381)中添加，截至本文撰写时仅在测试网上可用。
:::

## 🦄 本教程将覆盖

1. 零知识密码学的基础知识，特别是 zk-SNARKs（零知识简洁非互动式知识论证）
2. 启动受信任设置仪式（使用 Tau 力量）
3. 编写和编译一个简单的 ZK 电路（使用 Circom 语言）
4. 生成、部署和测试一个 FunC 合约来验证样本 ZK 证明

## 🟥🟦 以颜色为重点的 ZK 证明解释

在我们深入了解零知识之前，让我们从一个简单的问题开始。假设你想向一个色盲人证明，可以区分不同颜色是可能的。我们将使用一种互动解决方案来解决这个问题。假设色盲人（验证者）找到两张相同的纸，一张为红色 🟥 一张为蓝色 🟦。

验证者向你（证明者）展示其中一张纸并要求你记住颜色。然后验证者将那张特定的纸放在背后，保持不变或更换它，并询问你颜色是否有变化。如果你能够分辨出颜色的区别，那么你可以看到颜色（或者你只是幸运地猜对了正确的颜色）。

现在，如果验证者完成这个过程 10 次，而你每次都能分辨出颜色的区别，那么验证者对正确颜色的使用有 ~99.90234% 的把握（1 - (1/2)^10）。因此，如果验证者完成这个过程 30 次，那么验证者将有 99.99999990686774% 的把握（1 - (1/2)^30）。

尽管如此，这是一个互动式解决方案，让 DApp 要求用户发送 30 笔交易来证明特定数据是不高效的。因此，需要一个非互动式解决方案；这就是 Zk-SNARKs 和 Zk-STARKs 的用武之地。

出于本教程的目的，我们只会涵盖 Zk-SNARKs。然而，你可以在 [StarkWare 网站](https://starkware.co/stark/) 上阅读更多关于 Zk-STARKs 如何工作的信息，而关于 Zk-SNARKs 和 Zk-STARKs 之间差异的信息可以在这篇 [Panther Protocol 博客文章](https://blog.pantherprotocol.io/zk-snarks-vs-zk-starks-differences-in-zero-knowledge-technologies/) 上找到。

### 🎯 Zk-SNARK: 零知识简洁非互动式知识论证

Zk-SNARK 是一个非互动式证明系统，其中证明者可以向验证者展示一个证明，以证明一个陈述是真实的。同时，验证者能够在非常短的时间内验证证明。通常，处理 Zk-SNARK 包括三个主要阶段：

- 使用 [多方计算（MPC）](https://en.wikipedia.org/wiki/Secure_multi-party_computation) 协议进行受信任设置，以生成证明和验证密钥（使用 Tau 力量）
- 使用证明者密钥、公开输入和私密输入（见证）生成证明
- 验证证明

让我们设置我们的开发环境并开始编码！

## ⚙ 开发环境设置

我们开始这个过程的步骤如下：

1. 使用 [Blueprint](https://github.com/ton-org/blueprint) 创建一个名为 "simple-zk" 的新项目，执行以下命令后，输入你的合约名称（例如 ZkSimple），然后选择第一个选项（使用一个空合约）。

```bash
npm create ton@latest simple-zk
```

2. 接下来我们会克隆被调整以支持 FunC 合约的 [snarkjs 库](https://github.com/kroist/snarkjs)

```bash
git clone https://github.com/kroist/snarkjs.git
cd snarkjs
npm ci
cd ../simple-zk
```

3. 然后我们将安装 ZkSNARKs 所需的库

```bash
npm add --save-dev snarkjs ffjavascript
npm i -g circom
```

4. 接下来我们将下面的部分添加到 package.json 中（请注意，我们将使用的一些操作码在主网版本中尚未可用）

```json
"overrides": {
    "@ton-community/func-js-bin": "0.4.5-tvmbeta.1",
    "@ton-community/func-js": "0.6.3-tvmbeta.1"
}
```

5. 另外，我们需要更改 @ton-community/sandbox 的版本，以便使用[最新的 TVM 更新](https://t.me/thetontech/56)

```bash
npm i --save-dev @ton-community/sandbox@0.12.0-tvmbeta.1
```

太好了！现在我们准备好开始在 TON 上编写我们的第一个 ZK 项目了！

我们当前有两个主要文件夹构成了我们的 ZK 项目：

- `simple-zk` 文件夹：包含我们的 Blueprint 模板，这将使我们能够编写我们的电路和合约以及测试
- `snarkjs` 文件夹：包含我们在第 2 步中克隆的 snarkjs 库

## Circom 电路

首先让我们创建一个文件夹 `simple-zk/circuits` 并在其中创建一个文件并添加以下代码：

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

上面我们添加了一个简单的乘法器电路。通过使用这个电路，我们可以证明我们知道两个数字相乘的结果是特定的数字（c）而不泄露这些对应的数字（a 和 b）本身。

要了解更多关于 circom 语言的信息，请考虑查看[这个网站](https://docs.circom.io/)。

接下来我们将创建一个文件夹来存放我们的构建文件，并通过执行以下操作将数据移动到那里（在 `simple-zk` 文件夹中）：

```bash
mkdir -p ./build/circuits
cd ./build/circuits
```

### 💪 使用 Powers of TAU 创建受信任设置

现在是时候进行受信任设置了。要完成这个过程，我们将使用 [Powers of Tau](https://a16zcrypto.com/posts/article/on-chain-trusted-setup-ceremony/) 方法（可能需要几分钟时间来完成）。让我们开始吧：

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

完成上述过程后，它将在 build/circuits 文件夹中创建 pot14_final.ptau 文件，该文件可用于编写未来相关电路。

:::caution 约束大小
如果编写了具有更多约束的更复杂电路，则需要使用更大参数生成您的 PTAU 设置。
:::

你可以删除不必要的文件：

```bash
rm pot14_0000.ptau pot14_0001.ptau pot14_0002.ptau pot14_beacon.ptau
```

### 📜 电路编译

现在让我们通过在 `build/circuits` 文件夹下运行以下命令来编译电路：

```bash
circom ../../circuits/test.circom --r1cs circuit.r1cs --wasm circuit.wasm --prime bls12381 --sym circuit.sym
```

现在我们的电路被编译到了 `build/circuits/circuit.sym`、`build/circuits/circuit.r1cs` 和 `build/circuits/circuit.wasm` 文件中。

:::info altbn-128 和 bls12-381 曲线
altbn-128 和 bls12-381 椭圆曲线目前被 snarkjs 支持。[altbn-128](https://eips.ethereum.org/EIPS/eip-197) 曲线仅在 Ethereum 上支持。然而，在 TON 上只支持 bls12-381 曲线。
:::

让我们通过输入以下命令来检查我们电路的约束大小：

```bash
node ../../../snarkjs/build/cli.cjs r1cs info circuit.r1cs 
```

因此，正确的结果应该是：

```bash
[INFO]  snarkJS: Curve: bls12-381
[INFO]  snarkJS: # of Wires: 4
[INFO]  snarkJS: # of Constraints: 1
[INFO]  snarkJS: # of Private Inputs: 2
[INFO]  snarkJS: # of Public Inputs: 0
[INFO]  snarkJS: # of Labels: 4
[INFO]  snarkJS: # of Outputs: 1
```

现在我们可以通过执行以下操作来生成参考 zkey：

```bash
node ../../../snarkjs/build/cli.cjs zkey new circuit.r1cs pot14_final.ptau circuit_0000.zkey
```

然后我们将以下贡献添加到 zkey 中：

```bash
echo "some random text" | node ../../../snarkjs/build/cli.cjs zkey contribute circuit_0000.zkey circuit_0001.zkey --name="1st Contributor Name" -v
```

接下来，让我们导出最终的 zkey：

```bash
echo "another random text" | node ../../../snarkjs/build/cli.cjs zkey contribute circuit_0001.zkey circuit_final.zkey
```

现在我们的最终 zkey 存在于 `build/circuits/circuit_final.zkey` 文件中。然后通过输入以下内容来验证 zkey：

```bash
node ../../../snarkjs/build/cli.cjs zkey verify circuit.r1cs pot14_final.ptau circuit_final.zkey
```

最后，是时候生成验证密钥了：

```bash
node ../../../snarkjs/build/cli.cjs zkey export verificationkey circuit_final.zkey verification_key.json
```

然后我们将删除不必要的文件：

```bash
rm circuit_0000.zkey circuit_0001.zkey
```

在完成上述过程后，`build/circuits` 文件夹应如下显示：

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

### ✅ 导出验证器合约

本节的最后一步是生成 FunC 验证器合约，我们将在我们的 ZK 项目中使用它。

```bash
node ../../../snarkjs/build/cli.cjs zkey export funcverifier circuit_final.zkey ../../contracts/verifier.fc
```

然后在 `contracts` 文件夹中生成了 `verifier.fc` 文件。

## 🚢 验证器合约部署

让我们逐步回顾 `contracts/verifier.fc` 文件，因为它包含了 ZK-SNARKs 的魔法：

```func
const slice IC0 = "b514a6870a13f33f07bc314cdad5d426c61c50b453316c241852089aada4a73a658d36124c4df0088f2cd8838731b971"s;
const slice IC1 = "8f9fdde28ca907af4acff24f772448a1fa906b1b51ba34f1086c97cd2c3ac7b5e0e143e4161258576d2a996c533d6078"s;

const slice vk_gamma_2 = "93e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8"s;
const slice vk_delta_2 = "97b0fdbc9553a62a79970134577d1b86f7da8937dd9f4d3d5ad33844eafb47096c99ee36d2eab4d58a1f5b8cc46faa3907e3f7b12cf45449278832eb4d902eed1d5f446e5df9f03e3ce70b6aea1d2497fd12ed91bd1d5b443821223dca2d19c7"s;
const slice vk_alpha_1 = "a3fa7b5f78f70fbd1874ffc2104f55e658211db8a938445b4a07bdedd966ec60090400413d81f0b6e7e9afac958abfea"s;
const slice vk_beta_2 = "b17e1924160eff0f027c872bc13ad3b60b2f5076585c8bce3e5ea86e3e46e9507f40c4600401bf5e88c7d6cceb05e8800712029d2eff22cbf071a5eadf166f266df75ad032648e8e421550f9e9b6c497b890a1609a349fbef9e61802fa7d9af5"s;
```

以上是验证器合约必须使用的常量，以实现证明验证。这些参数可以在 `build/circuits/verification_key.json` 文件中找到。

```func
slice bls_g1_add(slice x, slice y) asm "BLS_G1_ADD";
slice bls_g1_neg(slice x) asm "BLS_G1_NEG";
slice bls_g1_multiexp(
        slice x1, int y1,
        int n
) asm "BLS_G1_MULTIEXP";
int bls_pairing(slice x1, slice y1, slice x2, slice y2, slice x3, slice y3, slice x4, slice y4, int n) asm "BLS_PAIRING";
```

以上行是新的 [TVM 操作码](https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#bls12-381)（BLS12-381），使得可以在 TON 区块链上进行配对检查。

load_data 和 save_data 函数仅用于加载和保存证明验证结果（仅用于测试目的）。

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

接下来，有几个简单的实用函数，用于加载发送到合约的证明数据：

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

最后一部分是 groth16Verify 函数，该函数需要检查发送到合约的证明的有效性。

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

现在需要编辑 `wrappers` 文件夹中的两个文件。需要注意的第一个文件是 `ZkSimple.compile.ts` 文件（如果在第 1 步中为合约设置了其他名称，其名称将不同）。我们将 `verifier.fc` 文件放入必须编译的合约列表中。

```ts
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
  lang: 'func',
  targets: ['contracts/verifier.fc'], // <-- here we put the path to our contract
};
```

需要注意的另一个文件是 `ZkSimple.ts`。我们首先需要将 `verify` 操作码添加到 `Opcodes` 枚举中：

```ts
export const Opcodes = {
  verify: 0x3b3cca17,
};
```

接下来，需要向 `ZkSimple` 类中添加 `sendVerify` 函数。此函数用于将证明发送到合约并进行测试，如下所示：

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

接下来，我们将 `cellFromInputList` 函数添加到 `ZkSimple` 类中。此函数用于从公开输入创建一个cell，它将被发送到合约。

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

最后，我们将添加到 `ZkSimple` 类中的最后一个函数是 `getRes` 函数。此函数用于接收证明验证结果。

```ts
 async getRes(provider: ContractProvider) {
  const result = await provider.get('get_res', []);
  return result.stack.readNumber();
}
```

现在我们可以运行所需的测试来部署合约。为了实现这一点，合约应该能够成功通过部署测试。在 `simple-zk` 文件夹的根目录下运行此命令：

```bash
npx blueprint test
```

## 🧑‍💻 编写验证器的测试

让我们打开 `tests` 文件夹中的 `ZkSimple.spec.ts` 文件，并为 `verify` 函数编写一个测试。测试按如下方式进行：

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

首先，我们需要导入我们将在测试中使用的几个包：

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

让我们填写 `should verify` 测试。我们首先需要生成证明。

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

为了进行下一个步骤，需要定义 `g1Compressed`、`g2Compressed` 和 `toHexString` 函数。它们将用于将密码学证明转换为合约期望的格式。

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

现在我们可以将密码学证明发送到合约。我们将使用 sendVerify 函数来完成这个操作。`sendVerify` 函数需要 5 个参数：`pi_a`、`pi_b`、`pi_c`、`pubInputs` 和 `value`。

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

准备好在 TON 区块链上验证您的第一个证明了吗？开始此过程，请输入以下命令运行 Blueprint 测试：

```bash
npx blueprint test
```

结果应如下所示：

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

要查看包含本教程代码的库，请点击[此处](https://github.com/SaberDoTcodeR/zk-ton-doc)找到的链接。

## 🏁 结论

在本教程中，您学习了以下技能：

- 零知识的复杂性，特别是 ZK-SNARKs
- 编写和编译 Circom 电路
- 对多方计算和 Tau 力量的熟悉度增加，这些被用于为电路生成验证密钥
- 熟悉了Snarkjs 库用于导出电路 FunC 验证器
- 熟悉了Blueprint用于验证器部署和测试编写

注意：上述示例教我们如何构建一个简单的 ZK 用例。尽管如此，可以在各种行业中实现一系列高度复杂的以 ZK 为中心的用例。这些包括：

- 隐私投票系统 🗳
- 隐私彩票系统 🎰
- 隐私拍卖系统 🤝
- 隐私交易💸（对于 Toncoin 或 Jettons）

如果您有任何问题或发现错误 - 请随时写信给作者 - [@saber_coder](https://t.me/saber_coder)

## 📌 参考资料

- 隐私投票系统 🗳
- 隐私彩票系统 🎰
- 隐私拍卖系统 🤝
- 隐私交易💸（对于 Toncoin 或 Jettons）
- [Blueprint](https://github.com/ton-org/blueprint)

## 📖 参阅

- [TON 无信任桥接 EVM 合约](https://github.com/ton-blockchain/ton-trustless-bridge-evm-contracts)
- [Tonnel Network：TON 上的隐私协议](http://github.com/saberdotcoder/tonnel-network)
- [TVM 挑战](https://blog.ton.org/tvm-challenge-is-here-with-over-54-000-in-rewards)

## 📬 关于作者

- Saber的链接: [Telegram](https://t.me/saber_coder), [Github](https://github.com/saberdotcoder) 和 [LinkedIn](https://www.linkedin.com/in/szafarpoor/)
