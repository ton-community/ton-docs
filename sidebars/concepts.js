/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarConfig}
 */
module.exports = [
  'learn/introduction', // TODO: Change to
  'v3/concepts/glossary',
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
      'v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains',
      'v3/concepts/dive-into-ton/ton-blockchain/smart-contract-addresses',
      'v3/concepts/dive-into-ton/ton-blockchain/wallet-apps',
      'v3/concepts/dive-into-ton/ton-blockchain/explorers-in-ton',
      'v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage',
      'v3/concepts/dive-into-ton/ton-blockchain/ton-networking',
      'v3/concepts/dive-into-ton/ton-blockchain/nft',
      'v3/concepts/dive-into-ton/ton-blockchain/sharding',
      'v3/concepts/dive-into-ton/ton-blockchain/blockchain-comparison',
    ],
  },
  {
    type: 'category',
    label: 'Go from Ethereum?',
    items: [
      'v3/concepts/dive-into-ton/go-from-ethereum/difference-of-blockchains',
      'v3/concepts/dive-into-ton/go-from-ethereum/tvm-vs-evm',
      'v3/concepts/dive-into-ton/go-from-ethereum/solidity-vs-func',
      'v3/concepts/dive-into-ton/go-from-ethereum/blockchain-services',
    ]
  },
  'v3/concepts/educational-resources',
  {
    'type': 'html',
    'value': '<hr/>',
  },
  {
    'type': 'html',
    'value': '<span class=\'menu__link\'><b><small> Quality Assurance & Outsource </small></b></span>',
  },
  'v3/concepts/qa-outsource/auditors',
  'v3/concepts/qa-outsource/outsource',
];
