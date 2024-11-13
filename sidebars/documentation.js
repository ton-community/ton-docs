/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarConfig}
 */
module.exports = [
  'v3/documentation/ton-documentation',
  'v3/documentation/faq',
  {
    'type': 'html',
    'value': '<hr/>',
  },
  {
    'type': 'html',
    'value': '<span class=\'menu__link\'><b><small> Smart Contracts Documentation </small></b></span>',
  },
  'v3/documentation/smart-contracts/overview',
  'v3/documentation/smart-contracts/addresses',
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
    label: 'Contracts Specification',
    items: [
      'v3/documentation/smart-contracts/contracts-specs/wallet-contracts',
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
    label: 'Message Management',
    items: [
      'v3/documentation/smart-contracts/message-management/messages-and-transactions',
      'v3/documentation/smart-contracts/message-management/sending-messages',
      'v3/documentation/smart-contracts/message-management/internal-messages',
      'v3/documentation/smart-contracts/message-management/external-messages',
      'v3/documentation/smart-contracts/message-management/non-bounceable-messages',
      'v3/documentation/smart-contracts/message-management/message-modes-cookbook',
      'v3/documentation/smart-contracts/message-management/ecosystem-messages-layout',
    ],
  },
  {
    type: 'category',
    label: 'Transaction Fees',
    items: [
      'v3/documentation/smart-contracts/transaction-fees/fees',
      'v3/documentation/smart-contracts/transaction-fees/fees-low-level',
      'v3/documentation/smart-contracts/transaction-fees/accept-message-effects',
      'v3/documentation/smart-contracts/transaction-fees/forward-fees',
    ],
  },
  {
    type: 'category',
    label: 'Sharding',
    items: [
      'v3/documentation/smart-contracts/shards/shards-intro',
      'v3/documentation/smart-contracts/shards/infinity-sharding-paradigm',
    ],
  },
  {
    type: 'category',
    label: 'FunC Language',
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
      'v3/documentation/smart-contracts/func/changelog',
    ],
  },
  {
    type: 'category',
    label: 'Tolk Language',
    items: [
      'v3/documentation/smart-contracts/tolk/overview',
      'v3/documentation/smart-contracts/tolk/tolk-vs-func/in-short',
      'v3/documentation/smart-contracts/tolk/tolk-vs-func/in-detail',
      'v3/documentation/smart-contracts/tolk/tolk-vs-func/mutability',
      'v3/documentation/smart-contracts/tolk/tolk-vs-func/stdlib',
      'v3/documentation/smart-contracts/tolk/changelog',
    ],
  },
  {
    type: 'category',
    label: 'Fift Language',
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
      // 'v3/guidelines/dapps/asset-processing/jettons', // TODO: divide
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
      'v3/documentation/data-formats/tlb/tl-b-language',
      'v3/documentation/data-formats/tlb/cell-boc',
      'v3/documentation/data-formats/tlb/exotic-cells',
      'v3/documentation/data-formats/tlb/library-cells',
      'v3/documentation/data-formats/tlb/proofs',
      'v3/documentation/data-formats/tlb/tl-b-types',
      'v3/documentation/data-formats/tlb/canonical-cell-serialization',
      'v3/documentation/data-formats/tlb/msg-tlb',
      'v3/documentation/data-formats/tlb/block-layout',
      'v3/documentation/data-formats/tlb/transaction-layout',
      'v3/documentation/data-formats/tlb/crc32',
      'v3/documentation/data-formats/tlb/tlb-ide',
      'v3/documentation/data-formats/tlb/tlb-tools',
    ],
  },
  'v3/documentation/data-formats/tl',
  {
    'type': 'html',
    'value': '<hr/>',
  },
  {
    'type': 'html',
    'value': '<span class=\'menu__link\'><b><small> TON Virtual Machine (TVM) Documentation </small></b></span>',
  },
  'v3/documentation/tvm/tvm-overview',
  'v3/documentation/tvm/tvm-initialization',
  'v3/documentation/tvm/tvm-exit-codes',
  {
    type: 'link',
    label: 'TVM Instructions',
    href: '/v3/documentation/tvm/instructions',
  },
  {
    type: 'category',
    label: 'TVM Specification',
    items: [
      'v3/documentation/tvm/specification/runvm',
    ],
  },
  {
    type: 'category',
    label: 'TVM Changelog',
    items: [
      'v3/documentation/tvm/changelog/tvm-upgrade-2024-04',
      'v3/documentation/tvm/changelog/tvm-upgrade-2023-07',
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
    id: 'v3/documentation/whitepapers/overview',
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
      'v3/documentation/archive/pow-givers',
      'v3/documentation/archive/mining',
      'v3/documentation/archive/tg-bot-integration',
      'v3/documentation/archive/tg-bot-integration-py',
      'v3/documentation/archive/compile',
      'v3/documentation/archive/precompiled-binaries',
      {
        'type': 'category',
        'label': 'Hacktoberfest 2022',
        'items': [
          'v3/documentation/archive/hacktoberfest-2022/README',
          'v3/documentation/archive/hacktoberfest-2022/as-contributor',
          'v3/documentation/archive/hacktoberfest-2022/as-maintainer',
        ],
      },
    ]
  }
];
