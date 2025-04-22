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
      'v3/concepts/dive-into-ton/ton-ecosystem/nft',
    ],
  },
  {
    type: 'category',
    label: 'TON Blockchain',
    items: [
      'v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains',
      'v3/concepts/dive-into-ton/ton-blockchain/smart-contract-addresses',
      'v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage',
      'v3/concepts/dive-into-ton/ton-blockchain/ton-networking',
      'v3/concepts/dive-into-ton/ton-blockchain/sharding',
      'v3/concepts/dive-into-ton/ton-blockchain/blockchain-comparison',
      'v3/concepts/dive-into-ton/ton-blockchain/security-measures',
    ],
  },
  {
    type: 'category',
    label: 'Newcomers from Ethereum',
    items: [
      'v3/concepts/dive-into-ton/go-from-ethereum/blockchain-services',
      'v3/concepts/dive-into-ton/go-from-ethereum/difference-of-blockchains',
      'v3/concepts/dive-into-ton/go-from-ethereum/solidity-vs-func',
      'v3/concepts/dive-into-ton/go-from-ethereum/tvm-vs-evm',
    ],
  },
  'v3/concepts/educational-resources',
  'v3/concepts/glossary',
  //'v3/concepts/qa-outsource/auditors'
];
