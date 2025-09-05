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
    to: '/v3/documentation/tvm/tvm-overview',
    from: '/learn/tvm-instructions/tvm_overview',
  },
  {
    to: '/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains',
    from: '/learn/overviews/TON_Blockchain_overview',
  },
  {
    to: '/v3/documentation/network/protocols/adnl/low-level',
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
    to: '/v3/documentation/introduction',
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
  {
    to: '/v3/guidelines/ton-connect/overview',
    from: '/v3/guidelines/ton-connect/how-ton-connect-works',
  },
  {
    to: '/v3/guidelines/ton-connect/overview',
    from: '/v3/guidelines/ton-connect/guidelines/how-ton-connect-works',
  },
  {
    to:  '/v3/guidelines/dapps/apis-sdks/api-types',
    from:'/v3/guidelines/dapps/apis-sdks/ton-http-apis',
  },
  {
    to: '/v3/concepts/dive-into-ton/ton-ecosystem/blockchain-tech',
    from: '/v3/concepts/dive-into-ton/go-from-ethereum/blockchain-services',
  },
  {
    to: '/v3/concepts/dive-into-ton/go-from-ethereum/blockchain-comparison',
    from: '/v3/concepts/dive-into-ton/ton-blockchain/blockchain-comparison',
  },
  {
    to: '/v3/concepts/dive-into-ton/ton-blockchain/overview',
    from: '/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains',
  },
  {
    to: '/v3/concepts/dive-into-ton/ton-blockchain/addresses',
    from: '/v3/concepts/dive-into-ton/ton-blockchain/smart-contract-addresses',
  },
  {
    to: '/v3/concepts/dive-into-ton/ton-blockchain/cells',
    from: '/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage',
  },
  {
    to: '/v3/concepts/dive-into-ton/ton-blockchain/network',
    from: '/v3/concepts/dive-into-ton/ton-blockchain/ton-networking',
  },
  {
    to: '/v3/concepts/dive-into-ton/security-measures',
    from: '/v3/concepts/dive-into-ton/ton-ecosystem/security-measures',
  },
  ...v3Redirects,
];
