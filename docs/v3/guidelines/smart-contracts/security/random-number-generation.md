# Random number generation

Generating random numbers is a common task that you may need in many different projects. You might have already seen the `random()` function in FunC docs, but note that its result can be easily predicted unless you employ some additional tricks.

## How can someone predict a random number?

Computers are terrible at generating random information because all they do is follow the instructions of users. However, since people frequently need random numbers, they've devised various methods for generating _pseudo-random_ numbers.

These algorithms typically require you to provide a _seed_ value that will be used to generate a sequence of _pseudo-random_ numbers. So, if you run the same program with the same _seed_ multiple times, you'll consistently get the same result. In TON, the _seed_ is different for each block.

-   [Generation of block random seed](/v3/guidelines/smart-contracts/security/random)

Therefore, to predict the result of the `random()` function in a smart contract, you just need to know the current `seed` of the block, which isn't possible if you're not a validator.

## Simply use `randomize_lt()`

To make the random number generation unpredictable, you can add the current [Logical Time](/v3/documentation/smart-contracts/message-management/messages-and-transactions#what-is-a-logical-time) to the seed, so different transactions will have different seeds and results.

Just add the `randomize_lt()` call before generating random numbers, and your random numbers will become unpredictable:

```func
randomize_lt();
int x = random(); ;; users can't predict this number
```

However, you should note that validators or collators may still affect the result of the random number, as they determine the seed of the current block.

## Is there a way to protect against manipulation by validators?

To prevent (or at least complicate) the substitution of the seed by validators, you can use more complex schemes. For instance, you could skip one block before generating a random number. If we skip a block, the seed will change in a less predictable manner.

Skipping blocks isn't a complex task. You can do it by simply sending a message to the Masterchain and back to the workchain of your contract. Let's examine a simple example!

:::caution
Do not use this example contract in real projects, write your own instead.
:::

### Main contract in any workchain

Let's write a simple lottery contract as an example. A user will send 1 TON to it, and with a 50% chance, will get 2 TON back.

```func
;; set the echo-contract address
const echo_address = "Ef8Nb7157K5bVxNKAvIWreRcF0RcUlzcCA7lwmewWVNtqM3s"a;

() recv_internal (int msg_value, cell in_msg_full, slice in_msg_body) impure {
    var cs = in_msg_full.begin_parse();
    var flags = cs~load_uint(4);
    if (flags & 1) { ;; ignore bounced messages
        return ();
    }
    slice sender = cs~load_msg_addr();

    int op = in_msg_body~load_uint(32);
    if ((op == 0) & equal_slice_bits(in_msg_body, "bet")) { ;; bet from user
        throw_unless(501, msg_value == 1000000000); ;; 1 TON

        send_raw_message(
            begin_cell()
                .store_uint(0x18, 6)
                .store_slice(echo_address)
                .store_coins(0)
                .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
                .store_uint(1, 32) ;; let 1 be echo opcode in our contract
                .store_slice(sender) ;; forward user address
            .end_cell(),
            64 ;; send the remaining value of an incoming msg
        );
    }
    elseif (op == 1) { ;; echo
        throw_unless(502, equal_slice_bits(sender, echo_address)); ;; only accept echoes from our echo-contract

        slice user = in_msg_body~load_msg_addr();

        {-
            at this point we have skipped 1+ blocks
            so let's just generate the random number
        -}
        randomize_lt();
        int x = rand(2); ;; generate a random number (either 0 or 1)
        if (x == 1) { ;; user won
            send_raw_message(
                begin_cell()
                    .store_uint(0x18, 6)
                    .store_slice(user)
                    .store_coins(2000000000) ;; 2 TON
                    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
                .end_cell(),
                3 ;; ignore errors & pay fees separately
            );
        }
    }
}
```

Deploy this contract in any workchain you need (probably Basechain) and you're done!

## Is this method 100% secure?

While it certainly helps, there's still a chance of manipulation if an intruder has control over several validators simultaneously. In this case, they might, with some probability, [affect](/v3/guidelines/smart-contracts/security/random#conclusion) the _seed_, which the random number depends on. Even if this probability is extremely small, it's still worth considering.

With the latest TVM upgrade, the introduction of new values to the `c7` register can further boost the security of random number generation. Specifically, the upgrade adds information about the last 16 masterchain blocks to the `c7` register.

The masterchain block information, due to its constantly changing nature, can serve as an additional source of entropy for random number generation. By incorporating this data into your randomness algorithm, you can create numbers that are even harder for potential adversaries to predict.

For more detailed information on this TVM upgrade, please refer to [TVM Upgrade](/v3/documentation/tvm/changelog/tvm-upgrade-2023-07).
