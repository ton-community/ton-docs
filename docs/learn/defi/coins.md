# Native Token: Toncoin

Native cryptocurrency of the TON Blockchain is **Toncoin**.

Transaction fees, gas payments (i.e., smart-contract message processing fees) and persistent storage payments are collected in Toncoins.

Toncoin is used to make deposits required to become a blockchain validator.

How to process payments in Toncoins is described in the [corresponding section](/develop/dapps/payment-processing/overview).

You can find out where to buy or exchange Toncoins on the [website](https://ton.org/coin).

## Extra-currencies

TON blockchain supports up to 2^32 built-in extra currencies. 

Extra currencies balances can be stored on each blockchain account, as well as sent to other accounts in a native way (in an internal message from one smart contract to another, you can specify a hashmap of extra currencies amounts in addition to Toncoin amount).

TLB: `extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32)) = ExtraCurrencyCollection;` - hashmap of currency ID and amount.

However, extra currencies can only be stored and transferred (like Toncoin) and do not have their own arbitrary code and functionality.

Note that if there are a large number of extra currencies created, the accounts will "swell" because they need to store them.

Thus, extra currencies are best used for well-known decentralized currencies (for example, wrapped Bitcoin or Ether) and the creation of such an extra currency should be quite expensive.

[Jettons](/learn/defi/tokens#jettons) are suitable for other tasks.

At the moment, no extra currency has been created in the TON blockchain - TON blockchain has full support for extra currencies by accounts and messages, but the minter system contract for their creation has not been made yet.