/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarConfig}
 */
module.exports = [
  'v3/documentation/introduction',
  {
    type: 'category',
    label: 'Smart contracts',
    items: [
      'v3/documentation/smart-contracts/overview',
      {
        type: 'category',
        label: 'Development environment',
        items: [
          'v3/documentation/smart-contracts/getting-started/javascript',
          'v3/documentation/smart-contracts/getting-started/ide-plugins',
          'v3/documentation/smart-contracts/getting-started/testnet',
        ],
      },
      {
        type: 'category',
        label: 'Addresses',
        items: [
          'v3/documentation/smart-contracts/addresses/address',
          'v3/documentation/smart-contracts/addresses/address-formats',
          'v3/documentation/smart-contracts/addresses/address-states',
        ],
      },
      {
        type: 'category',
        label: 'Message management',
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
        label: 'Transaction fees',
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
      'v3/documentation/smart-contracts/limits',
      {
        type: 'category',
        label: 'Contracts specification',
        items: [
          'v3/documentation/smart-contracts/contracts-specs/wallet-contracts',
          'v3/documentation/smart-contracts/contracts-specs/highload-wallet',
          'v3/documentation/smart-contracts/contracts-specs/vesting-contract',
          'v3/documentation/smart-contracts/contracts-specs/governance',
          'v3/documentation/smart-contracts/contracts-specs/nominator-pool',
          'v3/documentation/smart-contracts/contracts-specs/single-nominator-pool',
          'v3/documentation/smart-contracts/contracts-specs/precompiled-contracts',
          'v3/documentation/smart-contracts/contracts-specs/examples',

          {
            type: 'link',
            label: 'TON enhancement proposals (TEPs)',
            href: 'https://github.com/ton-blockchain/TEPs/tree/master',
          },

        ],
      },
      {
        type: 'category',
        label: 'Tolk language',
        items: [
          'v3/documentation/smart-contracts/tolk/overview',
          'v3/documentation/smart-contracts/tolk/environment-setup',
          'v3/documentation/smart-contracts/tolk/counter-smart-contract',
          'v3/documentation/smart-contracts/tolk/language-guide',
          'v3/documentation/smart-contracts/tolk/tolk-vs-func/in-short',
          'v3/documentation/smart-contracts/tolk/tolk-vs-func/in-detail',
          'v3/documentation/smart-contracts/tolk/tolk-vs-func/mutability',
          'v3/documentation/smart-contracts/tolk/tolk-vs-func/stdlib',
          'v3/documentation/smart-contracts/tolk/tolk-vs-func/pack-to-from-cells',
          'v3/documentation/smart-contracts/tolk/tolk-vs-func/create-message',
          'v3/documentation/smart-contracts/tolk/tolk-vs-func/lazy-loading',
          'v3/documentation/smart-contracts/tolk/changelog',
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
          'v3/documentation/smart-contracts/func/changelog',
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
      'v3/documentation/smart-contracts/tact',
    ],
  },
  {
    type: 'category',
    label: 'DApps',
    items: [
      'v3/documentation/dapps/dapps-overview',
      {
        type: 'category',
        label: 'Assets',
        items: [
          'v3/documentation/dapps/assets/toncoin',
          'v3/documentation/dapps/assets/jetton',
          'v3/documentation/dapps/assets/nft',
          'v3/documentation/dapps/assets/nft-2.0',
          'v3/documentation/dapps/assets/usdt',
          'v3/documentation/dapps/assets/extra-currencies',
        ],
      },
      {
        type: 'category',
        label: 'DeFi principles',
        items: [
          'v3/documentation/dapps/assets/overview',
          {
            type: 'doc',
            label: 'NFT use cases in TON',
            id: 'v3/documentation/dapps/defi/nft',
          },
          'v3/documentation/dapps/defi/subscriptions',
          'v3/documentation/dapps/defi/ton-payments',
        ],
      },
      {
        type: 'category',
        label: 'Oracles',
        items: [
          'v3/documentation/infra/oracles/overview',
          {
            type: 'category',
            label: 'Providers',
            items: [
              'v3/documentation/infra/oracles/pyth',
              'v3/documentation/infra/oracles/redstone',
            ],
          },
        ],
      },
    ],
  },
  {
    type: 'category',
    label: 'Nodes',
    items: [
      'v3/documentation/nodes/overview',
      {
        type: 'category',
        label: 'Validation',
        items: [
          'v3/documentation/nodes/validation/collators',
          {
            type: 'doc',
            label: 'Proof-of-stake',
            id: 'v3/documentation/nodes/validation/staking-incentives',
          },
          'v3/documentation/dapps/proofs',
          'v3/documentation/dapps/basic-proofing-concepts',
        ],
      },
      {
        type: 'category',
        label: 'MyTonCtrl',
        items: [
          'v3/documentation/nodes/mytonctrl/overview',
          'v3/documentation/nodes/mytonctrl/commands',
          'v3/documentation/nodes/mytonctrl/status',
          'v3/documentation/nodes/mytonctrl/errors',
        ],
      },
    ],
  },
  {
    type: 'category',
    label: 'Infrastructure',
    items: [
      {
        type: 'category',
        label: 'Bridges',
        items: [
          'v3/documentation/infra/bridges/toncoin',
          'v3/documentation/infra/bridges/toncoin-addresses',
        ],
      },
    ]
  },
  {
    type: 'category',
    label: 'Network',
    items: [
      'v3/documentation/network/global-config',
      {
        type: 'category',
        label: 'Config params',
        items: [
          'v3/documentation/network/config-params/overview',
          'v3/documentation/network/config-params/update',
          'v3/documentation/network/config-params/extra-currency',
        ],
      },
      {
        type: 'category',
        label: 'Protocols',
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
              'v3/documentation/network/protocols/adnl/low-level', // TODO: MERGE ADNL
              'v3/documentation/network/protocols/adnl/tcp',
              'v3/documentation/network/protocols/adnl/udp',
            ],
          },
          {
            type: 'category',
            label: 'DHT',
            items: [
              {
                type: 'doc',
                label: 'Overview',
                id: 'v3/documentation/network/protocols/dht/overview',
              },
              'v3/documentation/network/protocols/dht/deep-dive',
            ]
          },
          'v3/documentation/network/protocols/rldp',
          'v3/documentation/network/protocols/overlay',
        ],
      },
    ],
  },
  {
    type: 'category',
    label: 'Data formats',
    items: [
      {
        type: 'category',
        label: 'TL-B language',
        items: [
          'v3/documentation/data-formats/tlb/overview',
          'v3/documentation/data-formats/tlb/types',
          'v3/documentation/data-formats/tlb/crc32',
          'v3/documentation/data-formats/tlb/tools',
        ],
      },
      {
        type: 'category',
        label: 'Layouts',
        items: [
          'v3/documentation/data-formats/layout/messages',
          'v3/documentation/data-formats/layout/transactions',
          'v3/documentation/data-formats/layout/blocks',
        ]
      },
      {
        type: 'category',
        label: 'Cells',
        items: [
          'v3/documentation/data-formats/cells/overview',
          'v3/documentation/data-formats/cells/exotic',
          'v3/documentation/data-formats/cells/library',
          'v3/documentation/data-formats/cells/serialization',
        ]
      },
      'v3/documentation/data-formats/tl',
    ],
  },
  {
    type: 'category',
    label: 'Virtual machine',
    items: [
      'v3/documentation/tvm/overview',
      'v3/documentation/tvm/initialization',
      'v3/documentation/tvm/exit-codes',
      {
        type: 'link',
        label: 'Instructions',
        href: '/v3/documentation/tvm/instructions',
      },
      {
        type: 'category',
        label: 'Specification',
        items: [
          'v3/documentation/tvm/specification/runvm',
        ],
      },
      {
        type: 'category',
        label: 'Changelog',
        items: [
          'v3/documentation/tvm/changelog/tvm-upgrade-2025-02',
          'v3/documentation/tvm/changelog/tvm-upgrade-2024-04',
          'v3/documentation/tvm/changelog/tvm-upgrade-2023-07',

        ],
      },
    ]
  },
  {
    type: 'category',
    label: 'Whitepapers',
    items: [
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
        label: 'Catchain consensus protocol',
        href: 'https://docs.ton.org/catchain.pdf',
      },
    ],
  },
  'v3/documentation/faq',
];
