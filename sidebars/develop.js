/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarConfig}
 */
module.exports = [
  'develop/overview',
  'v3/documentation/faq',
  {
    'type': 'html',
    'value': '<hr/>',
  },
  {
    'type': 'html',
    'value': '<span class=\'menu__link\'><b><small> Smart Contracts Documentation </small></b></span>',
  },
  'develop/smart-contracts/README',
  'learn/overviews/addresses',
  'v3/documentation/smart-contracts/shards',
  'v3/documentation/smart-contracts/infinity-sharding-paradigm',
  {
    type: 'category',
    label: 'Getting Started',
    items: [
      'v3/documentation/smart-contracts/getting-started/javascript',
      'v3/documentation/smart-contracts/getting-started/ide-plugins',
      'v3/documentation/smart-contracts/getting-started/testnet',
    ],
  },
  {
    type: 'category',
    label: 'Message Management',
    items: [
      'v3/documentation/smart-contracts/message-management/ecosystem-messages-layout',
      'v3/documentation/smart-contracts/message-management/messages-and-transactions',
      'v3/documentation/smart-contracts/message-management/sending-messages',
      'v3/documentation/smart-contracts/message-management/message-modes-cookbook',
      'v3/documentation/smart-contracts/message-management/internal-messages',
      'v3/documentation/smart-contracts/message-management/external-messages',
      'v3/documentation/smart-contracts/message-management/non-bounceable-messages',
    ],
  },
  {
    type: 'category',
    label: 'Transaction Fees',
    items: [
      'develop/smart-contracts/fees',
      'v3/documentation/smart-contracts/transaction-fees/fees-low-level',
      'v3/documentation/smart-contracts/transaction-fees/accept-message-effects',
      'v3/documentation/smart-contracts/transaction-fees/forward-fees',
    ],
  },
  {
    type: 'category',
    label: 'Contracts Specification',
    items: [
      'participate/wallets/contracts',
      'v3/documentation/smart-contracts/contracts-specs/highload-wallet',
      'v3/documentation/smart-contracts/contracts-specs/vesting-contract',
      'v3/documentation/smart-contracts/contracts-specs/governance',
      'v3/documentation/smart-contracts/contracts-specs/nominator-pool',
      'v3/documentation/smart-contracts/contracts-specs/single-nominator-pool',
      'v3/documentation/smart-contracts/contracts-specs/precompiled-contracts',
      'v3/documentation/smart-contracts/contracts-specs/examples',
    ],
  },
  {
    type: 'category',
    label: 'FunC language',
    items: [
      {
        type: 'doc',
        id: 'v3/documentation/smart-contracts/func/overview',
      },
      {
        type: 'doc',
        id: 'v3/documentation/smart-contracts/func/cookbook',
      },
      {
        type: 'category',
        label: 'Documentation',
        items: [
          'v3/documentation/smart-contracts/func/docs/types',
          'v3/documentation/smart-contracts/func/docs/comments',
          'v3/documentation/smart-contracts/func/docs/literals_identifiers',
          'v3/documentation/smart-contracts/func/docs/functions',
          'v3/documentation/smart-contracts/func/docs/global_variables',
          'v3/documentation/smart-contracts/func/docs/compiler_directives',
          'v3/documentation/smart-contracts/func/docs/statements',
          'v3/documentation/smart-contracts/func/docs/builtins',
          'v3/documentation/smart-contracts/func/docs/dictionaries',
          'v3/documentation/smart-contracts/func/docs/stdlib',
        ],
      },
      'v3/documentation/smart-contracts/func/libraries',
    ],
  },
  {
    type: 'category',
    label: 'Fift language',
    items: [
      'v3/documentation/smart-contracts/fift/overview',
      'v3/documentation/smart-contracts/fift/fift-and-tvm-assembly',
      'v3/documentation/smart-contracts/fift/fift-deep-dive',
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
      // 'develop/dapps/asset-processing/README', // TODO: divide
      // 'develop/dapps/asset-processing/jettons', // TODO: divide
      // 'v3/guidelines/dapps/asset-processing/mintless-jettons', // TODO: divide
      'develop/dapps/asset-processing/usdt',
      // 'v3/guidelines/dapps/asset-processing/nft-processing/nfts', // TODO: divide
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
    type: 'link',
    label: 'Open-Source and Decentralization in TON',
    href: 'https://defi.org/ton/',
  },
  {
    'type': 'html',
    'value': '<hr/>',
  },
  {
    'type': 'html',
    'value': '<span class=\'menu__link\'><b><small> Infrastructure Documentation </small></b></span>',
  },
  'develop/research-and-development/minter-flow',
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
      {
        type: 'category',
        label: 'ADNL',
        items: [
          {
            type: 'doc',
            label: 'Overview',
            id: 'learn/networking/adnl',
          },
          'learn/networking/low-level-adnl', // TODO: MERGE ADNL
          'develop/network/adnl-tcp',
          'develop/network/adnl-udp',
        ],
      },
      {
        type: 'category',
        label: 'DHT',
        items: [
          {
            type: 'doc',
            label: 'Overview',
            id: 'learn/networking/ton-dht',
          },
          'develop/network/dht',
        ]
      },
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
