/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarConfig}
 */
module.exports = [
  'learn/introduction',
  'learn/glossary',
  {
    'type': 'html',
    'value': '<hr/>',
  },
  {
    'type': 'html',
    'value': '<span class=\'menu__link\'><b><small> Introduction </small></b></span>',
  },
  {
    type: 'category',
    label: 'What is Blockchain?',
    items: [
      {
        type: 'category',
        label: 'TON Blockchain',
        items: [
          'learn/overviews/ton-blockchain',
          'learn/overviews/addresses',
          'learn/overviews/cells',
          {
            type: 'category',
            label: 'TON Networking',
            items: [
              {
                type: 'doc',
                label: 'Overview',
                id: 'learn/networking/overview',
              },
              {
                type: 'category',
                label: 'ADNL Protocol',
                items: [
                  {
                    type: 'doc',
                    label: 'Overview',
                    id: 'learn/networking/adnl',
                  },
                  'learn/networking/low-level-adnl',
                ],
              },
              'learn/networking/overlay-subnetworks',
              'learn/networking/rldp',
              'learn/networking/ton-dht',
            ],
          },
          'learn/overviews/blockchain-comparison',
          {
            type: 'link',
            label: 'Open-Source and Decentralization in TON',
            href: 'https://defi.org/ton/',
          },
        ],
      },
    ]
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
  {
    'type': 'html',
    'value': '<hr/>',
  },
  {
    'type': 'html',
    'value': '<span class=\'menu__link\'><b><small> Dive into TON </small></b></span>',
  },
  {
    type: 'category',
    label: 'Blockchain Fundamentals',
    items: [
      'develop/blockchain/shards',
      'develop/blockchain/sharding-lifecycle',
    ],
  },
  'learn/academy/academy-overview',
];
