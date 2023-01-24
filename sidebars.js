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
          label: 'TON Virtual Machine (TVM)',
          items: [
            'learn/tvm-instructions/tvm-overview',
            'learn/tvm-instructions/tvm-exit-codes',
            'learn/tvm-instructions/instructions',
          ],
        },
        {
          type: 'category',
          label: 'TL-B Language',
          items: [
            'learn/overviews/TL-B',
            'learn/overviews/tl-b-language',
          ],
        },
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
      label: 'TON Services',
      items: [
        'learn/services/payments',
        {
          type: 'doc',
          label: 'TON DNS',
          id: 'learn/services/dns',
        },
        {
          type: 'doc',
          label: 'TON Sites, WWW, and Proxy',
          id: 'learn/services/sites-www-proxy',
        },
        {
          'type': 'html',
          'value': '<span class=\'menu__link\'>TON Storage [2022 Q4]</span>',
        },
        {
          'type': 'html',
          'value': '<span class=\'menu__link\'>Bitcoin & EVM Crosschain</span>',
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
          href: 'https://ton.org/docs/ton.pdf',
        },
        {
          type: 'link',
          label: 'TON Virtual Machine',
          href: 'https://ton.org/docs/tvm.pdf',
        },
        {
          type: 'link',
          label: 'TON Blockchain',
          href: 'https://ton.org/docs/tblkch.pdf',
        },
        {
          type: 'link',
          label: 'Catchain Consensus Protocol',
          href: 'https://ton.org/docs/catchain.pdf',
        },
      ],
    },
  ],
  develop: [

    'develop/getting-started',
    {
      type: 'link',
      label: 'TON Hello World',
      href: 'https://blog.ton.org/step-by-step-guide-for-writing-your-first-smart-contract-in-func',
    },
    {
      type: 'doc',
      label: 'Become a TVM Developer',
      id: 'develop/onboarding-challenge',
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
      label: 'Develop Smart Contracts',
      items: [
        'develop/smart-contracts/README',
        {
          type: 'category',
          label: 'Environment',
          items: [
            'develop/smart-contracts/environment/installation',
            'develop/smart-contracts/environment/ide-plugins',
            'develop/smart-contracts/environment/testnet',
          ],
        },
        {
          type: 'category',
          label: 'Choose Your SDK',
          items: [
            'develop/smart-contracts/sdk/javascript',
            'develop/smart-contracts/sdk/toncli',
          ],
        },
        {
          type: 'category',
          label: 'Testing & Debugging',
          items: [
            'develop/smart-contracts/testing/tonstarter',
            'develop/smart-contracts/testing/toncli',
            {
              type: 'link',
              label: 'PyTVM',
              href: 'https://github.com/disintar/PyTVM',
            }
          ],
        },
        'develop/smart-contracts/compile/README',
        {
          type: 'category',
          label: 'Deploying Contract',
          items: [
            {
              type: 'link',
              label: 'Using tonstarter-contracts',
              href: 'https://github.com/ton-defi-org/tonstarter-contracts',
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
          label: 'Security Rules',
          items: [
            'develop/smart-contracts/security/README',
            'develop/smart-contracts/security/ton-hack-challenge-1',
          ],
        },
        {
          type: 'category',
          label: 'Best Practices',
          items: [
            'develop/smart-contracts/guidelines',
            'develop/smart-contracts/fees',
            'develop/smart-contracts/messages',
            {
              type: 'link',
              label: 'Coming from Solidity',
              href: '/learn/introduction#ethereum-to-ton',
            },
            'develop/smart-contracts/guidelines/internal-messages',
            'develop/smart-contracts/guidelines/external-messages',
            'develop/smart-contracts/guidelines/non-bouncable-messages',
            'develop/smart-contracts/guidelines/message-delivery-guarantees',
            'develop/smart-contracts/guidelines/get-methods',
            'develop/smart-contracts/guidelines/accept',
            'develop/smart-contracts/guidelines/processing',
            'develop/smart-contracts/governance',
            'develop/smart-contracts/guidelines/tips',
            {
              type: 'link',
              label: 'How to shard your TON smart contract and why',
              href: 'https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons',
            },
          ],
        },
        {
          type: 'category',
          label: 'Tutorials & Examples',
          items: [
            'develop/smart-contracts/tutorials/multisig'
          ]
        },
        {
          type: 'link',
          label: 'Discover FunC language',
          href: '/develop/func/overview',
        },
      ],
    },
    {
      type: 'category',
      label: 'Develop dApps & Bots',
      items: [
        'develop/dapps/README',
        {
          type: 'category',
          label: 'API & SDK',
          items: [
            'develop/dapps/apis/README',
            'develop/dapps/apis/toncenter',
            'develop/dapps/apis/adnl',
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
        {
          type: 'category',
          label: 'TON Connect',
          items: [
            'develop/dapps/ton-connect/README',
            'develop/dapps/ton-connect/integration',
            'develop/dapps/ton-connect/business',
            'develop/dapps/ton-connect/developers',
            'develop/dapps/ton-connect/security',
            'develop/dapps/ton-connect/comparison',
          ],
        },
        {
          type: 'category',
          label: 'Payment Processing',
          items: [
            'develop/dapps/asset-processing/README',
            {
              type: 'link',
              label: 'Create a key pair and a wallet',
              href: 'https://github.com/toncenter/examples/blob/main/common.js',
            },
            {
              type: 'link',
              label: 'Accepting deposits to a single wallet',
              href: 'https://github.com/toncenter/examples/blob/main/deposits-single-wallet.js',
            },
            {
              type: 'link',
              label: 'Accepting deposits to multiple wallets',
              href: 'https://github.com/toncenter/examples/blob/main/deposits-multi-wallet.js',
            },
            {
              type: 'link',
              label: 'Withdrawal processing',
              href: 'https://github.com/toncenter/examples/blob/main/withdrawals.js',
            }
          ],
        },

        {
          type: 'category',
          label: 'Tutorials & Examples',
          items: [
            'develop/dapps/tutorials/overview',
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
            'develop/dapps/tutorials/how-to-run-ton-site'
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
      'value': '<span class=\'menu__link\'><b><small> References & Documentation </small></b></span>',
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
            'develop/func/stdlib',
          ],
        },
        'develop/smart-contracts/libraries',
      ],
    },
    'develop/fift-and-tvm-assembly',
    'develop/fift-deep-dive',
    'develop/howto/network-configs',
    {
      type: 'category',
      label: 'Low Level Internals',
      items: [
        'develop/howto/README',
        'develop/howto/step-by-step',
        'develop/howto/config-params',
        'develop/howto/fees-low-level',
        'develop/howto/full-node',
        'develop/howto/validator',
        {
          type: 'category',
          label: 'Archived',
          items: [
            'develop/archive/pow-givers',
            'develop/archive/mining',
          ]
        },
      ],
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
      type: 'link',
      label: 'TON Whitepapers',
      href: '/learn/docs',
    },
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
      ]
    },
    {
      type: 'category',
      label: 'Run a Node',
      items: [
        'participate/nodes/node-types',
        'participate/nodes/local-ton',
        'participate/nodes/node-maintenance-and-security',
        'participate/nodes/run-node',
        'participate/nodes/collators',
        {
          type: 'link',
          label: 'Run a Validator Node',
          href: 'https://ton.org/validator',
        },
      ],
    },
    {
      type: 'category',
      label: 'Blockchain Details',
      items: [
        'participate/own-blockchain-software/random',
      ],
    },
    {
      type: 'doc',
      label: 'NFT Use Cases in TON',
      id: 'participate/nft',
    },
    {
      type: 'doc',
      label: 'Stake with Nominator Pools',
      id: 'participate/nominators',
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
        'participate/web3/dns'
      ],
    },
    {
      'type': 'category',
      'label': 'TON Proxy & Sites',
      'items': [
        'participate/web3/setting-proxy',
        'participate/web3/how-to-open-any-ton-site',
        'participate/web3/sites-and-proxy',
        'participate/web3/site-management'
      ],
    },
    {
      'type': 'category',
      'label': 'TON Storage',
      'items': [
        'participate/ton-storage/storage-daemon',
        'participate/ton-storage/storage-provider',
        'participate/ton-storage/storage-faq'
      ],
    },
  ],
  contribute: [
    {
      'type': 'category',
      'label': 'Become a Contributor',
      'items': [
        'contribute/README',
        'contribute/maintainers',
        'contribute/guidelines',
        'contribute/principles-of-a-good-tutorial',
        'contribute/sample-tutorial',
      ],
    },
    {
      'type': 'category',
      'label': 'Hacktoberfest 2022',
      'items': [
        'contribute/hacktoberfest/README',
        'contribute/hacktoberfest/as-contributor',
        'contribute/hacktoberfest/as-maintainer',
      ],
    },
  ],

}

module.exports = sidebars
