# Random number generation

Generating random numbers is a common task in many projects. While you may have seen the `random()` function in FunC documentation, note that its result can be easily predicted unless you use additional techniques.

## How can someone predict a random number?

Computers struggle to generate truly random information because they strictly follow user instructions. To address this, developers have created methods for generating pseudo-random numbers.

These algorithms typically require a _seed_ value to produce a sequence of _pseudo-random_ numbers. You will always get the same result if you run the same program with the same _seed_ multiple times. In TON, the _seed_ varies for each block.

- [Generation of block random seed](/v3/guidelines/smart-contracts/security/random)

To predict the result of the `random()` function in a smart contract, one would need to know the current `seed` of the block, which is impossible unless you are a validator.

## Simply use `randomize_lt()`

To make random number generation unpredictable, you can add the current [Logical Time](/v3/documentation/smart-contracts/message-management/messages-and-transactions#what-is-a-logical-time) to the seed. This ensures that different transactions produce different seeds and results.

Add the `randomize_lt()` call before generating random numbers to make them unpredictable:

```func
randomize_lt();
int x = random(); ;; users can't predict this number
```

However, validators or collators can still influence the result as they determine the seed of the current block.

## Is there a way to protect against manipulation by validators?

You can use more complex schemes to reduce the risk of validators manipulating the seed. For example, you can skip one block before generating a random number, which changes the seed less predictably.

Skipping blocks is straightforward. You can achieve this by sending a message to the Masterchain and back to your contract's workchain. Let's explore a simple example!

:::caution  
Do not use this example contract in real projects. Write your own instead.  
:::

### Main contract in any workchain

Let's create a simple lottery contract. A user sends 1 TON and, with a 50% chance, receives 2 TON back.

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
 at this point, we have skipped 1+ blocks
 so, let's generate the random number
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

Deploy this contract in any workchain (likely Basechain), and you're done!

## Is this method 100% secure?

While this method improves security, there is still a tiny chance of manipulation if an attacker controls multiple validators. In such cases, they might influence the _seed_, which affects the random number. Even though the probability is extremely low, it is worth considering.

With the latest TVM upgrade, introducing new values to the `c7` register enhances the security of random number generation. Specifically, the upgrade adds information about the last 16 masterchain blocks to the `c7` register.

The masterchain block information, due to its dynamic nature, serves as an additional source of entropy for random number generation. By incorporating this data into your randomness algorithm, you can create even harder numbers for potential adversaries to predict.

For more details on this TVM upgrade, refer to [TVM Upgrade](/v3/documentation/tvm/changelog/tvm-upgrade-2023-07).
