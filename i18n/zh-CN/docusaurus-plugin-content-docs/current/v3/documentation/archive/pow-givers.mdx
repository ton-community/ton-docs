# POW Givers

:::warning 已弃用
此信息可能已过时，不再有用。您可以随意忽略它。
:::

本文旨在描述如何与POW Giver智能合约互动，以获得Toncoin。我们假设您已熟悉TON区块链轻客户端，如`入门`中所述，并熟悉编译轻客户端和其他软件的程序。为了获得运行验证者所需的更多Toncoin，我们还假设您熟悉`完整节点`和`验证者`页面。为了获得更多的Toncoin，您还需要一台足够强大的专用服务器来运行完整节点。获取少量的Toncoin不需要专用服务器，在家用电脑上几分钟内即可完成。

> 请注意，目前由于矿工数量众多，任何挖矿都需要大量资源。

## 1. Proof-of-Work Giver智能合约

为了防止少数恶意方收集所有Toncoin，网络的主链上部署了一种特殊的“工作量证明赠予者”智能合约。这些智能合约的地址如下：

小额赠予者（每几分钟提供10至100 Toncoin）：

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

大额赠予者（每天至少提供10,000 Toncoin）：

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

> 请注意，目前所有大额赠予者已被耗尽。

前十个智能合约使愿意获取少量Toncoin的用户能够在不花费太多计算功率的情况下获得一些（通常情况下，家用电脑上几分钟的工作应该就足够了）。其余智能合约用于获取网络中运行验证者所需的更多Toncoin；通常，一天在足够强大的专用服务器上的工作应该足以获得所需金额。

> 请注意，目前由于矿工数量众多，挖掘小额赠予者也需要大量资源。

您应该随机选择这些“proof-of-work giver”智能合约中的一个（根据您的目的从这两个列表中选择），并通过类似于挖矿的程序从该智能合约中获得Toncoin。基本上，您需要呈现一个包含工作量证明和您钱包地址的外部消息给所选的“proof-of-work giver”智能合约，然后金额将被发送给您。

## 2. 挖矿过程

为了创建一个包含“工作量证明(proof-of-work)”的外部消息，您应该运行一个特殊的挖矿实用程序，从GitHub库中的TON源代码编译而成。该实用程序位于构建目录的`./crypto/pow-miner`文件中，可以通过在构建目录中输入`make pow-miner`来编译。

然而，在运行`pow-miner`之前，您需要知道所选“proof-of-work giver”智能合约的`seed`和`complexity`参数的实际值。这可以通过调用该智能合约的get方法`get_pow_params`来完成。例如，如果您使用 giver 智能合约，`kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN`，您可以简单地键入：

```
> runmethod kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN get_pow_params
```

在轻客户端控制台中，并获得像这样的输出：

```...
    arguments:  [ 101616 ] 
    result:  [ 229760179690128740373110445116482216837 53919893334301279589334030174039261347274288845081144962207220498432 100000000000 256 ] 
    remote result (not to be trusted):  [ 229760179690128740373110445116482216837 53919893334301279589334030174039261347274288845081144962207220498432 100000000000 256 ]
```

“result:”行中的前两个大数字分别是这个智能合约的`seed`和`complexity`。在此例中，seed是`229760179690128740373110445116482216837`，而复杂度是`53919893334301279589334030174039261347274288845081144962207220498432`。

接下来，您按如下方式调用`pow-miner`实用程序：

```
$ crypto/pow-miner -vv -w<num-threads> -t<timeout-in-sec> <your-wallet-address> <seed> <complexity> <iterations> <pow-giver-address> <boc-filename>
```

这里：

- `<num-threads>`是您希望用于挖矿的CPU核心数量。
- `<timeout-in-sec>`是矿工运行失败前的最长秒数。
- `<your-wallet-address>`是您的钱包地址（可能尚未初始化）。它要么在主链上，要么在工作链上（请注意，您需要一个主链钱包来控制验证者）。
- `<seed>`和`<complexity>`是通过运行get方法`get-pow-params`获得的最新值。
- `<pow-giver-address>`是所选proof-of-work giver智能合约的地址。
- `<boc-filename>`是成功时保存工作量证明的外部消息的输出文件的文件名。

例如，如果您的钱包地址是`kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7`，您可能会运行：

```
$ crypto/pow-miner -vv -w7 -t100 kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7 229760179690128740373110445116482216837 53919893334301279589334030174039261347274288845081144962207220498432 100000000000 kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN mined.boc
```

程序将运行一段时间（在这种情况下最多100秒），并且要么成功终止（zero exit code）并将所需的工作量证明保存在文件`mined.boc`中，要么以非零 exit code 终止，如果没有找到工作量证明。

在失败的情况下，您会看到像这样的内容：

```
   [ expected required hashes for success: 2147483648 ]
   [ hashes computed: 1192230912 ]
```

程序将以非零 exit code 终止。然后您必须再次获取`seed`和`complexity`（因为它们可能已经在此期间改变，因为更成功的矿工的请求已经被处理），并重新运行`pow-miner`，使用新参数重复过程，直到成功。

在成功的情况下，您会看到类似于：

```
   [ expected required hashes for success: 2147483648 ]
   4D696E65005EFE49705690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1A1F533B3BC4F5664D6C743C1C5C74BB3342F3A7314364B3D0DA698E6C80C1EA4ACDA33755876665780BAE9BE8A4D6385A1F533B3BC4F5664D6C743C1C5C74BB3342F3A7314364B3D0DA698E6C80C1EA4
   Saving 176 bytes of serialized external message into file `mined.boc`
   [ hashes computed: 1122036095 ]
```

然后，您可以使用轻客户端将外部消息从文件`mined.boc`发送到 proof-of-work giver 智能合约（您必须尽快这样做）：

```
> sendfile mined.boc
... external message status is 1
```

您可以等待几秒钟，然后检查您的钱包状态：

:::info
请注意，在此处和以下的代码、注释和/或文档中可能包含“gram”、“nanogram”等参数、方法和定义。这是原始TON代码的遗产，由Telegram开发。Gram加密货币从未发行。TON的货币是Toncoin，TON测试网的代币是Test Toncoin。
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

如果在您之前没有人发送具有此`seed`和`complexity`的有效工作量证明，proof-of-work giver 将接受您的工作量证明，这将反映在您钱包的余额中（发送外部消息后可能需要10或20秒钟才会发生；请确保多次尝试并在每次检查钱包余额之前输入`last`以刷新轻客户端状态）。如果成功，您会看到余额增加（如果之前不存在，甚至您的钱包也会以未初始化的状态被创建）。如果失败，您将不得不获得新的`seed`和`complexity`，并从头开始重复挖矿过程。

如果您幸运并且钱包的余额增加了，如果之前没有初始化，您可能想初始化钱包（有关创建钱包的更多信息可以在`逐步操作`中找到）：

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

现在您是100 Toncoin的幸运拥有者。祝贺您！

## 3. 在失败的情况下自动化挖矿过程

如果您长时间无法获得Toncoin，这可能是因为太多其他用户同时从同一个 proof-of-work giver 智能合约进行挖矿。也许您应该从上面给出的列表中选择另一个 proof-of-work giver 智能合约。或者，您可以编写一个简单的脚本，自动运行`pow-miner`，使用正确的参数一遍又一遍地运行，直到成功（通过检查`pow-miner`的 exit code 来检测），并调用带有参数`-c 'sendfile mined.boc'`的轻客户端，以便在找到后立即给他发送外部消息。
