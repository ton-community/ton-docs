/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarConfig}
 */
module.exports = [
  'learn/introduction', // TODO: Change to
  'learn/glossary',
  {
    'type': 'html',
    'value': '<hr/>',
  },
  {
    'type': 'html',
    'value': '<span class=\'menu__link\'><b><small> Dive into TON </small></b></span>',
  },
  'learn/introduction',
  {
    type: 'category',
    label: 'TON Blockchain',
    items: [
      'learn/overviews/ton-blockchain',
      'v3/concepts/ton-blockchain/smart-contract-addresses',
      'learn/overviews/cells',
      'learn/networking/overview',

      'learn/overviews/blockchain-comparison',
    ],
  },
  {
    type: 'category',
    label: 'Go from Ethereum?',
    items: [
      'develop/ethereum-to-ton/difference-of-blockchains',
      'develop/ethereum-to-ton/tvm-vs-evm',
      'develop/ethereum-to-ton/solidity-vs-func',
      'develop/ethereum-to-ton/blockchain-services',
    ]
  },
  'learn/academy/academy-overview',
];
