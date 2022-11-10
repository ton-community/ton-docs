# Using toncli

:::tip starter tip
If you didn't use toncli before, try [QUICK START GUIDE](https://github.com/disintar/toncli/blob/master/docs/quick_start_guide.md).
:::

## Testing using toncli

`toncli` uses FunC to test smart contracts. Also, the latest version supports Docker for quick environment setup.

Right now, the best tutorial describing testing using toncli is:
* [How does the FunC test work?](https://github.com/disintar/toncli/blob/master/docs/advanced/func_tests_new.md)
* [How to debug transactions with toncli?](https://github.com/disintar/toncli/blob/master/docs/advanced/transaction_debug.md)

## Examples

Here are repositories with examples of FunC files used for testing in one of the TON Contests:
* [ton-blockchain/func-contest2-solutions](https://github.com/ton-blockchain/func-contest2-solutions)
* [New examples by contributors](/develop/smart-contracts/sdk/toncli#examples)

## Testing using Docker

Docker image should come in handy to run [toncli](https://github.com/disintar/toncli) with the [new tests support](https://github.com/disintar/toncli/blob/master/docs/advanced/func_tests_new.md). Setting it all up manually could be cumbersome otherwise.

Because it was built on Ubuntu 20.04, it should be WSL Docker compatible.

* [Dockerfile for FunC testing GitHub repository](https://github.com/Trinketer22/func_docker)