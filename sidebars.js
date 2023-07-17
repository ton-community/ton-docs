/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {

  learn: [
    'learn/introduction',
    'learn/glossary',
    {
      'type': 'html',
      'value': '<hr/>',
    },
    {
      'type': 'html',
      'value': '<span class=\'menu__link\'><b><small> TON Concepts </small></b></span>',
    },
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

        {
          type: 'link',
          label: 'TON Compared to Other L1s',
          href: 'https://ton.org/analysis',
        },
        {
          type: 'link',
          label: 'Open-Source and Decentralization in TON',
          href: 'https://defi.org/ton/',
        },
      ],
    },
    {
      type: 'category',
      label: 'TON Whitepapers',
      items: [
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
      ],
    },
  ],
  develop: [

    'develop/overview',
    {
      type: 'doc',
      label: 'Get Started with TON',
      id: 'develop/get-started-with-ton',
    },
    {
      type: 'category',
      label: 'TON Hello World',
      items: [
        {
          type: 'link',
          label: 'Working with your wallet',
          href: 'https://ton-community.github.io/tutorials/01-wallet',
        },
        {
          type: 'link',
          label: 'Writing first smart contract',
          href: 'https://ton-community.github.io/tutorials/02-contract',
        },
        {
          type: 'link',
          label: 'Building first web client',
          href: 'https://ton-community.github.io/tutorials/03-client',
        },
        {
          type: 'link',
          label: 'Testing your smart contract',
          href: 'https://ton-community.github.io/tutorials/04-testing',
        },
      ],
    },
    {
      'type': 'html',
      'value': '<hr/>',
    },
    {
      'type': 'html',
      'value': '<span class=\'menu__link\'><b><small> Development </small></b></span>',
    },
    {
      type: 'category',
      label: 'APIs and SDKs',
      items: [
        'develop/dapps/apis/README',
        'develop/dapps/apis/toncenter',
        'develop/dapps/apis/adnl',
        'develop/dapps/apis/sdk'
      ],
    },
    {
      type: 'category',
      label: 'Develop Smart Contracts',
      items: [
        'develop/smart-contracts/README',
        {
          type: 'category',
          label: 'Learn',
          items: [

           // 'develop/smart-contracts/learn/deployment',
             {
                 type: 'category',
                 label: 'Deploying Contract',
                 items: [
                   {
                     type: 'link',
                     label: 'Using TypeScript',
                     href: 'https://ton-community.github.io/tutorials/02-contract/',
                   },
                   {
                     type: 'link',
                     label: 'Using toncli',
                     href: 'https://github.com/romanovichim/TonFunClessons_Eng/blob/main/1lesson/firstlesson.md',
                   },
                 ],
               },
            {
              type: 'category',
              label: 'Testing & Debugging',
              items: [
                'develop/smart-contracts/testing/tonstarter',
                'develop/smart-contracts/testing/toncli',
              ],
            },
            {
              type: 'category',
              label: 'Tutorials & Examples',
              items: [
                'develop/smart-contracts/tutorials/multisig',
                'develop/smart-contracts/tutorials/multisig-js',
                'develop/smart-contracts/tutorials/wallet',
                'develop/smart-contracts/examples'
              ],
            },
          ],
       },
       {
         type: 'category',
         label: 'Guidelines',
         items: [
         'develop/smart-contracts/guidelines',
         'develop/smart-contracts/compile/README',
        {
        type: 'category',
        label: 'Messages',
          items: [
          'develop/smart-contracts/messages',
          'develop/smart-contracts/guidelines/internal-messages',
          'develop/smart-contracts/guidelines/external-messages',
          'develop/smart-contracts/guidelines/non-bouncable-messages',
          'develop/smart-contracts/guidelines/message-delivery-guarantees',
          ],
          },
          {
          type: 'category',
          label: 'Fees',
            items: [
            'develop/smart-contracts/fees',
            'develop/howto/fees-low-level',
            'develop/smart-contracts/guidelines/accept',
            'develop/smart-contracts/guidelines/processing',
            ],
            },
           'develop/smart-contracts/guidelines/get-methods',
           {
             type: 'category',
             label: 'Security Rules',
             items: [
               'develop/smart-contracts/security/README',
               'develop/smart-contracts/security/ton-hack-challenge-1',
               'develop/smart-contracts/guidelines/random-number-generation',
               'develop/smart-contracts/security/random',
             ],
           },
           {
               type: 'category',
               label: 'Design and Architecture',
               items: [
                     {
                       type: 'link',
                       label: 'How to shard your TON smart contract and why',
                       href: 'https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons',
                     },
               ],
             },
         ],
       },
       {
            type: 'category',
            label: 'Core Contracts',
            items: [
                'develop/smart-contracts/governance',
                'develop/howto/config-params',
                'develop/research-and-development/minter-flow',
            ]
        },
        {
          type: 'category',
          label: 'Environment',
          items: [
            'develop/smart-contracts/environment/installation',
            'develop/smart-contracts/environment/ide-plugins',
            'develop/smart-contracts/environment/testnet',

            {
              type: 'category',
              label: 'Choose Your SDK',
              items: [
                'develop/smart-contracts/sdk/javascript',
                'develop/smart-contracts/sdk/toncli',
              ],
            },
          ],
        },

      ],
    },

    {
      type: 'category',
      label: 'Develop Apps',
      items: [
        'develop/dapps/README',
        {
          type: 'category',
          label: 'Learn',
          items: [
            'develop/dapps/tutorials/overview',
            'develop/dapps/tutorials/collection-minting',
            'develop/dapps/tutorials/jetton-minter',
            {
              type: 'category',
              label: 'Telegram bots',
              items: [
                'develop/dapps/tutorials/accept-payments-in-a-telegram-bot',
                'develop/dapps/tutorials/accept-payments-in-a-telegram-bot-2',
                'develop/dapps/tutorials/accept-payments-in-a-telegram-bot-js',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Guidelines',
          items: [
            'develop/dapps/asset-processing/README',
            'develop/dapps/asset-processing/jettons',
            'develop/dapps/asset-processing/nfts',
            'develop/dapps/asset-processing/metadata',
          ],
        },

        {
          type: 'category',
          label: 'DeFi Development',
          items: [
            'develop/dapps/defi/coins',
            'develop/dapps/defi/tokens',
            'develop/dapps/defi/ton-payments',
            'develop/dapps/defi/subscriptions',
          ],
        },
        'develop/dapps/examples',
      ]
    },
    {
      type: 'category',
      label: 'Integrate with TON',
      items: [
        'develop/dapps/ton-connect/overview',
        {
              type: 'category',
              label: 'TON Connect',
              items: [
        'develop/dapps/ton-connect/README',
        {
          type: 'category',
          label: 'Learn',
          items: [
            'develop/dapps/ton-connect/integration',
            'develop/dapps/ton-connect/tg-bot-integration',
            'develop/dapps/ton-connect/transactions',
          ],
        },
        {
          type: 'category',
          label: 'Guidelines',
          items: [
            'develop/dapps/ton-connect/developers',
            'develop/dapps/ton-connect/wallet-guidelines',
            'develop/dapps/ton-connect/workflow',
          ],
        },

        {
          type: 'category',
          label: 'Business',
          items: [
            'develop/dapps/ton-connect/business',
            'develop/dapps/ton-connect/security',
            'develop/dapps/ton-connect/comparison',
          ],
        },
        ]
        },
        'develop/howto/subresolvers',
      ],
    },
    {
      'type': 'html',
      'value': '<hr/>',
    },
    {
      'type': 'html',
      'value': '<span class=\'menu__link\'><b><small> References & Documentation </small></b></span>',
    },
    'develop/howto/faq',
    'develop/howto/blockchain-configs',
    'develop/howto/network-configs',
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
      ]
    },

    {
      type: 'category',
      label: 'TON Virtual Machine (TVM)',
      items: [
        'learn/tvm-instructions/tvm-overview',
        'learn/tvm-instructions/tvm-initialization',
        'learn/tvm-instructions/tvm-exit-codes',
        'learn/tvm-instructions/instructions',
        'learn/tvm-instructions/tvm-upgrade-2023-07',
      ],
    },
    {
      type: 'category',
      label: 'Data Formats',
      items: [
        {
          type: 'category',
          label: 'TL-B',
          items: [
            'develop/data-formats/cell-boc',
            'develop/data-formats/tl-b-language',
            'develop/data-formats/tl-b-types',
            'develop/research-and-development/boc',
            'develop/data-formats/msg-tlb',
            'develop/data-formats/block-layout',
            'develop/data-formats/transaction-layout',
            'develop/data-formats/crc32',
            'develop/data-formats/tlb-ide'
          ]
        },
        'develop/data-formats/tl',
      ]
    },
    {
      type: 'category',
      label: 'Network Protocols',
      items: [
        'develop/network/adnl-tcp',
        'develop/network/adnl-udp',
        'develop/network/dht',
        'develop/network/rldp',
        'develop/network/overlay'
      ]
    },
    {
      type: 'category',
      label: 'Compile from Sources',
      items: [

        {
          type: 'doc',
          label: 'Compilation Instructions',
          id: 'develop/howto/compile',
        },
        {
          type: 'doc',
          label: 'Instructions for low-memory machines',
          id: 'develop/howto/compile-swap',
        },
      ],
    },
    {
      type: 'category',
      label: 'Archived',
      items: [
        'develop/archive/pow-givers',
        'develop/archive/mining',
      ],
    },
    {
      'type': 'html',
      'value': '<hr/>',
    },
    {
      'type': 'html',
      'value': '<span class=\'menu__link\'><b><small>Quality Assurance & Outsource</small></b></span>',
    },
    'develop/companies/auditors',
    'develop/companies/outsource',
],
  participate: [
    'participate/README',
    {
      'type': 'html',
      'value': '<hr/>',
    },
    {
      'type': 'html',
      'value': '<span class=\'menu__link\'><b><small> Infrastructure </small></b></span>',
    },
        {
        type: 'category',
        label: 'Main Components',
        items: [
        'participate/explorers',
        {
          type: 'category',
          label: 'Wallets in TON',
          items: [
            'participate/wallets/apps',
            'participate/wallets/contracts',
          ],
        },
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
    ]},
    {
      type: 'category',
      label: 'Blockchain Nodes',
      items: [
          {
              type: 'category',
              label: 'Run a Node',
              items: [
                  'participate/nodes/node-types',
                  'participate/run-nodes/full-node',
                  'participate/run-nodes/liteserver',
                  'participate/run-nodes/archive-node',
                  'participate/run-nodes/local-ton',
                    {
                      type: 'link',
                      label: 'Become a Validator',
                      href: 'https://ton.org/validator',
                    },
              ],
          },
          {
              type: 'category',
              label: 'Nodes Infrastructure',
              items: [
                'participate/nodes/lite-client',
                'participate/nodes/full-node',
                'participate/nodes/validator',
                'participate/nodes/node-maintenance-and-security',
              ],
          },
      ],
    },
    {
      type: 'category',
      label: 'Network Maintenance',
      items: [
        'participate/network-maintenance/staking-incentives',
        'participate/network-maintenance/nominators',
        'participate/network-maintenance/persistent-states',
        'participate/nodes/collators',
      ],
    },
    {
      type: 'doc',
      label: 'NFT Use Cases in TON',
      id: 'participate/nft',
    },
    {
      'type': 'html',
      'value': '<hr/>',
    },
    {
      'type': 'html',
      'value': '<span class=\'menu__link\'><b><small> Web3 </small></b></span>',
    },
    'participate/web3/overview',
    {
      'type': 'category',
      'label': 'TON DNS',
      'items': [
        'participate/web3/dns',
      ],
    },
    {
      'type': 'category',
      'label': 'TON Proxy & Sites',
      'items': [
        'participate/web3/setting-proxy',
        'participate/web3/how-to-open-any-ton-site',
        'participate/web3/sites-and-proxy',
        'develop/dapps/tutorials/how-to-run-ton-site',
        'participate/web3/site-management',
      ],
    },
    {
      'type': 'category',
      'label': 'TON Storage',
      'items': [
        'participate/ton-storage/storage-daemon',
        'participate/ton-storage/storage-provider',
        'participate/ton-storage/storage-faq',
      ],
    },
  ],
  contribute: [
       'contribute/README',
     {
       'type': 'category',
       'label': 'Common Rules',
       'items': [
         'contribute/contribution-rules',
         'contribute/participate',
         'contribute/maintainers',
       ],
     },
    {
      'type': 'category',
      'label': 'Documentation',
      'items': [
            'contribute/docs/guidelines',
      ],
    },
    {
      'type': 'category',
      'label': 'Tutorials',
      'items': [
        'contribute/tutorials/guidelines',
        'contribute/tutorials/principles-of-a-good-tutorial',
        'contribute/tutorials/sample-tutorial',
      ],
    },
    {
      'type': 'category',
      'label': 'Archive',
      'items': [
        {
          'type': 'category',
          'label': 'Hacktoberfest 2022',
          'items': [
            'contribute/archive/hacktoberfest-2022/README',
            'contribute/archive/hacktoberfest-2022/as-contributor',
            'contribute/archive/hacktoberfest-2022/as-maintainer',
          ],
        },
      ],
    },
  ],

}

module.exports = sidebars
