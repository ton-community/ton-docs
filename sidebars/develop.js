/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarConfig}
 */
module.exports = [
  'develop/overview',
  'develop/howto/faq',
  {
    'type': 'html',
    'value': '<hr/>',
  },
  {
    'type': 'html',
    'value': '<span class=\'menu__link\'><b><small> Smart Contracts Documentation </small></b></span>',
  },
  'develop/smart-contracts/README',
  {
    type: 'category',
    label: 'Getting Started',
    items: [
      'develop/smart-contracts/sdk/javascript',
      'develop/smart-contracts/environment/ide-plugins',
      'develop/smart-contracts/environment/testnet',
    ],
  },
  {
    type: 'category',
    label: 'Message Management',
    items: [
      'develop/smart-contracts/guidelines/ecosystem-messages-layout',
      'develop/smart-contracts/guidelines/message-delivery-guarantees',
      'develop/smart-contracts/messages',
      'develop/smart-contracts/guidelines/message-modes-cookbook',
      'develop/smart-contracts/guidelines/internal-messages',
      'develop/smart-contracts/guidelines/external-messages',
      'develop/smart-contracts/guidelines/non-bounceable-messages',
    ],
  },
  {
    type: 'category',
    label: 'Transaction Fees',
    items: [
      'develop/smart-contracts/fees',
      'develop/howto/fees-low-level',
      'develop/smart-contracts/guidelines/accept',
      'develop/smart-contracts/guidelines/processing',
    ],
  },
  {
    type: 'category',
    label: 'Contracts Specification',
    items: [
      'participate/wallets/contracts',
      'participate/wallets/highload',
      'participate/network-maintenance/vesting-contract',
      'develop/smart-contracts/governance',
      'participate/network-maintenance/nominator-pool',
      'participate/network-maintenance/single-nominator',
      'develop/smart-contracts/core-contracts/precompiled',
      'develop/research-and-development/minter-flow',
      'develop/smart-contracts/examples',
      {
        type: 'category',
        label: 'Wallets in TON',
        items: [
          'participate/wallets/apps',
        ],
      },
    ],
  },
  {
    type: 'category',
    label: 'FunC language',
    items: [
      {
        type: 'doc',
        id: 'develop/func/overview',
      },
      {
        type: 'doc',
        id: 'develop/func/cookbook',
      },
      {
        type: 'category',
        label: 'Documentation',
        items: [
          'develop/func/types',
          'develop/func/comments',
          'develop/func/literals_identifiers',
          'develop/func/functions',
          'develop/func/global_variables',
          'develop/func/compiler_directives',
          'develop/func/statements',
          'develop/func/builtins',
          'develop/func/dictionaries',
          'develop/func/stdlib',
        ],
      },
      'develop/smart-contracts/libraries',
    ],
  },
  {
    type: 'category',
    label: 'Fift language',
    items: [
      'develop/fift/overview',
      'develop/fift/fift-and-tvm-assembly',
      'develop/fift/fift-deep-dive',
    ],
  },
  {
    'type': 'html',
    'value': '<hr/>',
  },
  {
    'type': 'html',
    'value': '<span class=\'menu__link\'><b><small> DApps Documentation </small></b></span>',
  },
  {
    type: 'category',
    label: 'DeFi Principles',
    items: [
      'develop/dapps/defi/coins',
      'develop/dapps/defi/tokens',
      {
        type: 'doc',
        label: 'NFT Use Cases in TON',
        id: 'develop/dapps/defi/nft',
      },
      'develop/dapps/defi/subscriptions',
      'develop/dapps/defi/ton-payments',
    ],
  },
  {
    type: 'category',
    label: 'Assets',
    items: [
      'develop/dapps/asset-processing/overview',
      'develop/dapps/asset-processing/README', // TODO: divide
      'develop/dapps/asset-processing/jettons', // TODO: divide
      'develop/dapps/asset-processing/mintless-jettons', // TODO: divide
      'develop/dapps/asset-processing/usdt',
      'develop/dapps/asset-processing/nfts', // TODO: divide
    ],
  },
  {
    type: 'category',
    label: 'Oracles',
    items: [
      'develop/oracles/about_blockchain_oracles',

      {
        type: 'category',
        label: 'Oracles in TON',
        items: [
          'develop/oracles/red_stone',
        ],
      },
    ],
  },
  {
    'type': 'html',
    'value': '<hr/>',
  },
  {
    'type': 'html',
    'value': '<span class=\'menu__link\'><b><small> Infrastructure Documentation </small></b></span>',
  },
  'participate/explorers',
  {
    type: 'category',
    label: 'Cross-chain Bridges',
    items: [
      {
        type: 'doc',
        label: 'Overview',
        id: 'participate/crosschain/overview',
      },
      {
        type: 'doc',
        label: 'Bridges Addresses',
        id: 'participate/crosschain/bridge-addresses',
      },
    ],
  },
  {
    type: 'category',
    label: 'Blockchain Nodes',
    items: [
      'participate/nodes/node-types',
      {
        type: 'category',
        label: 'MyTonCtrl',
        items: [
          'participate/run-nodes/mytonctrl',
          'participate/run-nodes/alerting',
          'participate/run-nodes/mytonctrl-status',
        ],
      },
      'participate/run-nodes/node-commands',
      {
        type: 'category',
        label: 'Validation',
        items: [
          {
            type: 'doc',
            label: 'Proof of Stake',
            id: 'participate/network-maintenance/staking-incentives',
          },
          'participate/nodes/collators',
        ],
      },
    ],
  },
  {
    'type': 'html',
    'value': '<hr/>',
  },
  {
    'type': 'html',
    'value': '<span class=\'menu__link\'><b><small> Networking Documentation </small></b></span>',
  },
  {
    type: 'category',
    label: 'Network Configurations',
    items: [
      'develop/howto/network-configs',
      'develop/howto/blockchain-configs',
      'develop/howto/config-params',
    ],
  },
  {
    type: 'category',
    label: 'Network Protocols',
    items: [
      'learn/networking/low-level-adnl', // TODO: MERGE ADNL
      'develop/network/adnl-tcp',
      'develop/network/adnl-udp',
      'develop/network/dht',
      'develop/network/rldp',
      'develop/network/overlay',
    ],
  },
  {
    'type': 'html',
    'value': '<hr/>',
  },
  {
    'type': 'html',
    'value': '<span class=\'menu__link\'><b><small> Data Formats Documentation </small></b></span>',
  },
  {
    type: 'category',
    label: 'TL-B',
    items: [
      'develop/data-formats/cell-boc',
      'develop/data-formats/exotic-cells',
      'develop/data-formats/library-cells',
      'develop/data-formats/proofs',
      'develop/data-formats/tl-b-language',
      'develop/data-formats/tl-b-types',
      'develop/research-and-development/boc',
      'develop/data-formats/msg-tlb',
      'develop/data-formats/block-layout',
      'develop/data-formats/transaction-layout',
      'develop/data-formats/crc32',
      'develop/data-formats/tlb-ide',
      'develop/data-formats/tlb-tools',
    ],
  },
  'develop/data-formats/tl',
  {
    'type': 'html',
    'value': '<hr/>',
  },
  {
    'type': 'html',
    'value': '<span class=\'menu__link\'><b><small> TON Virtual Machine (TVM) Documentation </small></b></span>',
  },
  'learn/tvm-instructions/tvm-overview',
  'learn/tvm-instructions/tvm-initialization',
  'learn/tvm-instructions/tvm-exit-codes',
  {
    type: 'link',
    label: 'TVM Instructions',
    href: '/learn/tvm-instructions/instructions',
  },
  {
    type: 'category',
    label: 'TVM Changelog',
    items: [
      'learn/tvm-instructions/fee-calculation-instructions',
      'learn/tvm-instructions/tvm-upgrade-2023-07',
    ],
  },
  {
    'type': 'html',
    'value': '<hr/>',
  },
  {
    'type': 'html',
    'value': '<span class=\'menu__link\'><b><small> Quality Assurance & Outsource </small></b></span>',
  },
  'develop/companies/auditors',
  'develop/companies/outsource',
  {
    'type': 'html',
    'value': '<hr/>',
  },
  {
    'type': 'html',
    'value': '<span class=\'menu__link\'><b><small> TON Whitepapers </small></b></span>',
  },
  {
    type: 'doc',
    label: 'Overview',
    id: 'learn/docs',
  },
  {
    type: 'link',
    label: 'TON',
    href: 'https://docs.ton.org/ton.pdf',
  },
  {
    type: 'link',
    label: 'TON Virtual Machine',
    href: 'https://docs.ton.org/tvm.pdf',
  },
  {
    type: 'link',
    label: 'TON Blockchain',
    href: 'https://docs.ton.org/tblkch.pdf',
  },
  {
    type: 'link',
    label: 'Catchain Consensus Protocol',
    href: 'https://docs.ton.org/catchain.pdf',
  },
  {
    'type': 'html',
    'value': '<hr/>',
  },
  {
    'type': 'html',
    'value': '<span class=\'menu__link\'><b><small> Archived </small></b></span>',
  },
  {
    type: 'category',
    label: 'Archived',
    link: {
      type: 'generated-index',
      title: 'Archive',
      slug: '/develop/archive',
      keywords: ['archive'],
    },
    items: [
      'develop/archive/pow-givers',
      'develop/archive/mining',
      'develop/archive/tg-bot-integration',
      'develop/archive/tg-bot-integration-py',
      'develop/smart-contracts/compile/README',
      'develop/smart-contracts/environment/installation',
    ]
  }
];
