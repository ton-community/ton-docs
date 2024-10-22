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
      'v3/documentation/dapps/defi/coins',
      'v3/documentation/dapps/defi/tokens',
      {
        type: 'doc',
        label: 'NFT Use Cases in TON',
        id: 'v3/documentation/dapps/defi/nft',
      },
      'v3/documentation/dapps/defi/subscriptions',
      'v3/documentation/dapps/defi/ton-payments',
    ],
  },
  {
    type: 'category',
    label: 'Assets',
    items: [
      'v3/documentation/dapps/assets/overview',
      // 'develop/dapps/asset-processing/README', // TODO: divide
      // 'develop/dapps/asset-processing/jettons', // TODO: divide
      // 'v3/guidelines/dapps/asset-processing/mintless-jettons', // TODO: divide
      'v3/documentation/dapps/assets/usdt',
      // 'v3/guidelines/dapps/asset-processing/nft-processing/nfts', // TODO: divide
    ],
  },
  {
    type: 'category',
    label: 'Oracles',
    items: [
      'v3/documentation/dapps/oracles/about_blockchain_oracles',
      {
        type: 'category',
        label: 'Oracles in TON',
        items: [
          'v3/documentation/dapps/oracles/red_stone',
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
  'v3/documentation/infra/minter-flow',
  {
    type: 'category',
    label: 'Cross-chain Bridges',
    items: [
      {
        type: 'doc',
        label: 'Overview',
        id: 'v3/documentation/infra/crosschain/overview',
      },
      {
        type: 'doc',
        label: 'Bridges Addresses',
        id: 'v3/documentation/infra/crosschain/bridge-addresses',
      },
    ],
  },
  {
    type: 'category',
    label: 'Blockchain Nodes',
    items: [
      'v3/documentation/infra/nodes/node-types',
      {
        type: 'category',
        label: 'MyTonCtrl',
        items: [
          'v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview',
          'v3/documentation/infra/nodes/mytonctrl/mytonctrl-alerting',
          'v3/documentation/infra/nodes/mytonctrl/mytonctrl-status',
        ],
      },
      'v3/documentation/infra/nodes/node-commands',
      {
        type: 'category',
        label: 'Validation',
        items: [
          {
            type: 'doc',
            label: 'Proof of Stake',
            id: 'v3/documentation/infra/nodes/validation/staking-incentives',
          },
          'v3/documentation/infra/nodes/validation/collators',
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
      'v3/documentation/network/configs/network-configs',
      'v3/documentation/network/configs/blockchain-configs',
      'v3/documentation/network/configs/config-params',
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
            id: 'v3/documentation/network/protocols/adnl/overview',
          },
          'v3/documentation/network/protocols/adnl/low-level-adnl', // TODO: MERGE ADNL
          'v3/documentation/network/protocols/adnl/adnl-tcp',
          'v3/documentation/network/protocols/adnl/adnl-udp',
        ],
      },
      {
        type: 'category',
        label: 'DHT',
        items: [
          {
            type: 'doc',
            label: 'Overview',
            id: 'v3/documentation/network/protocols/dht/ton-dht',
          },
          'v3/documentation/network/protocols/dht/dht-deep-dive',
        ]
      },
      'v3/documentation/network/protocols/rldp',
      'v3/documentation/network/protocols/overlay',
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
