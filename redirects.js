const fs = require("node:fs");

const v3Redirects = JSON.parse(fs.readFileSync(require.resolve('./redirects/redirects.json'), 'utf8'));

/**
 * @type {Array<{from: string, to: string}>}
 */
module.exports = [
  // CamelCase to kebab-case
  {
    to: '/v3/documentation/tvm/tvm-exit-codes',
    from: '/learn/tvm-instructions/tvm_exit_codes',
  },
  {
    to: '/develop/dapps/telegram-apps',
    from: '/develop/dapps/twa',
  },
  {
    to: '/v3/documentation/tvm/tvm-overview',
    from: '/learn/tvm-instructions/tvm_overview',
  },
  {
    to: '/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains',
    from: '/learn/overviews/TON_Blockchain_overview',
  },
  {
    to: '/v3/documentation/network/protocols/adnl/low-level-adnl',
    from: '/learn/overviews/adnl',
  },
  {
    to: '/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot',
    from: '/develop/dapps/payment-processing/accept-payments-in-a-telegram-bot',
  },
  {
    to: '/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-2',
    from: '/develop/dapps/payment-processing/accept-payments-in-a-telegram-bot-2',
  },
  {
    to: '/v3/guidelines/get-started-with-ton',
    from: '/develop/onboarding-challenge',
  },
  {
    to: '/v3/documentation/ton-documentation',
    from: '/develop/getting-started',
  },
  {
    to: '/v3/documentation/data-formats/tlb/tl-b-language',
    from: '/v3/documentation/data-formats/tl-b',
  },
  {
    to: '/v3/documentation/tvm/changelog/tvm-upgrade-2023-07',
    from: '/learn/tvm-instructions/tvm-upgrade',
  },
  {
    to: '/v3/guidelines/smart-contracts/testing/overview',
    from: '/v3/guidelines/smart-contracts/testing/tonstarter',
  },
  ...v3Redirects,
];
