# Using toncli

:::tip starter tip
If you didn't use toncli before, try [QUICK START GUIDE](https://github.com/disintar/toncli/blob/master/docs/quick_start_guide.md).
:::

## Testing using toncli

toncli uses FunC to test smart contracts.

Right now the best tutorial describing testing using toncli is:
* [How FunC test works?](https://github.com/disintar/toncli/blob/master/docs/advanced/func_tests_new.md)
* [How to debug transactions with toncli?](https://github.com/disintar/toncli/blob/master/docs/advanced/transaction_debug.md)

## Testing using Docker

Docker image should come in handy to run [toncli](https://github.com/disintar/toncli) with the [new tests support](https://github.com/disintar/toncli/blob/master/docs/advanced/func_tests_new.md). Setting it all up manually could be cumbersome otherwise.

Built on Ubuntu 20.04 so should be WSL docker compatible.

* [Dockerfile for FunC testing GitHub repository](https://github.com/Trinketer22/func_docker)