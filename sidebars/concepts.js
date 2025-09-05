/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarConfig}
 */
module.exports = [
  'v3/concepts/dive-into-ton/introduction',
  {
    type: 'category',
    label: 'TON Ecosystem',
    items: [
      'v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps',
      'v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton',
      'v3/concepts/dive-into-ton/ton-ecosystem/blockchain-tech',
    ],
  },
  {
    type: 'category',
    label: 'TON Blockchain',
    items: [
      'v3/concepts/dive-into-ton/ton-blockchain/overview',
      'v3/concepts/dive-into-ton/ton-blockchain/asynchrony',
      'v3/concepts/dive-into-ton/ton-blockchain/sharding',
      'v3/concepts/dive-into-ton/ton-blockchain/accounts',
      'v3/concepts/dive-into-ton/ton-blockchain/addresses',
      'v3/concepts/dive-into-ton/ton-blockchain/smart-contracts',
      'v3/concepts/dive-into-ton/ton-blockchain/cells',
      'v3/concepts/dive-into-ton/ton-blockchain/nodes',
      'v3/concepts/dive-into-ton/ton-blockchain/network',
      {
        type: 'category',
        label: 'TON vs Ethereum',
        items: [
          'v3/concepts/dive-into-ton/go-from-ethereum/difference-of-blockchains',
          'v3/concepts/dive-into-ton/go-from-ethereum/solidity-vs-func',
          'v3/concepts/dive-into-ton/go-from-ethereum/tvm-vs-evm',
          'v3/concepts/dive-into-ton/go-from-ethereum/blockchain-comparison',
        ],
      },
    ],
  },
  'v3/concepts/security-measures',
  'v3/concepts/educational-resources',
  'v3/concepts/glossary',
];
