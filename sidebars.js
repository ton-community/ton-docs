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
    'learn/overviews/TON_blockchain_overview',
    // 'learn/new-to-ton',
    {
      'type': 'html',
      'value': '<hr/>',
    },
    {
      'type': 'html',
      'value': '<span class=\'menu__link\'><b><small> Essentials </small></b></span>',
    },
    'learn/overviews/Cells',
    'learn/overviews/TL-B',
    'develop/smart-contracts/tvm_overview',
    {
      type: 'category',
      label: 'Whitepapers',
      items: [
        {
          type: 'doc',
          label: 'Overview',
          id: 'learn/docs',
        },
        {
          type: 'link',
          label: 'TON',
          href: 'https://ton-blockchain.github.io/docs/ton.pdf',
        },
        {
          type: 'link',
          label: 'TON Virtual Machine',
          href: 'https://ton-blockchain.github.io/docs/tvm.pdf',
        },
        {
          type: 'link',
          label: 'TON Blockchain',
          href: 'https://ton-blockchain.github.io/docs/tblkch.pdf',
        },
        {
          type: 'link',
          label: 'Catchain Consensus Protocol',
          href: 'https://ton-blockchain.github.io/docs/catchain.pdf',
        },

      ],
    },
  ],
  develop: [
    'develop/getting-started',
    {
      'type': 'html',
      'value': '<hr/>',
    },
    {
      'type': 'html',
      'value': '<span class=\'menu__link\'><b><small> Deep Dive </small></b></span>',
    },
    {
      type: 'category',
      label: 'Smart Contracts',
      items: [
        'develop/smart-contracts/README',
        'develop/smart-contracts/getting-started',
        'develop/smart-contracts/simple-task/README',

        'develop/smart-contracts/messages',
        'develop/smart-contracts/fees',
        'develop/smart-contracts/tips',
        {
          type: 'category',
          label: 'Guidelines',
          items: [
            'develop/smart-contracts/guidelines',
          ],
        },
        {
          type: 'category',
          label: 'Examples',
          items: [
            'develop/smart-contracts/governance',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'TON Virtual Machine (TVM)',
      items: [
        'develop/smart-contracts/tvm_overview',
        'develop/smart-contracts/tvm_exit_codes',
        'develop/smart-contracts/tvm-instructions/instructions',
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
          type: 'link',
          label: 'FunC Cheat Sheet',
          href: 'https://mybinder.org/v2/gh/atomex-me/xeus-fift/binder?filepath=func_cheat_sheet.ipynb',
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
            'develop/func/FAQ',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Low Level',
      items: [
        'develop/howto/step-by-step',
        'develop/howto/ton-sites',
        'develop/howto/config-params',
        'develop/howto/pow-givers',
      ],
    },
    {
      type: 'category',
      label: 'Nodes',
      items: [
        'develop/nodes/node-types',
        'develop/nodes/run-node',
        'develop/nodes/node-maintenance-and-security',
        'develop/nodes/local-ton',
      ],
    },
    {
      type: 'category',
      label: 'Web3',
      items: [
        'develop/web3/dns',
        {
          'type': 'html',
          'value': '<span class=\'menu__link\'>TON Proxy [2022 Q3]</span>',
        },
        {
          'type': 'html',
          'value': '<span class=\'menu__link\'>TON Sites [2022 Q3]</span>',
        },
        {
          'type': 'html',
          'value': '<span class=\'menu__link\'>TON Storage [2022 Q4]</span>',
        },
      ],
    },
    {
      type: 'category',
      label: 'Payment Processing',
      items: [
        'develop/howto/payment-processing',
        'develop/payment-processing/common',
        'develop/payment-processing/deposits-single-wallet',
        'develop/payment-processing/deposits-multi-wallet',
        'develop/payment-processing/withdrawals',
      ],
    },
    {
      type: 'category',
      label: 'Support',
      items: [
        'develop/howto/wallets',
      ],
    },
    'develop/compile',
  ],
  tools: [
    'tools/README',
    'tools/testnet/README',
    'tools/apis/README',
    {
      type: 'category',
      label: 'Wallets',
      items: [
        {
          type: 'link',
          label: 'TONkeeper',
          href: 'example.com',
        },
        {
          type: 'link',
          label: '@wallet',
          href: 'example.com',
        },
        {
          type: 'link',
          label: 'Tonhub',
          href: 'example.com',
        },
        {
          type: 'link',
          label: 'Chrome plugin',
          href: 'example.com',
        },
      ],
    },
    {
      type: 'category',
      label: 'Explorers',
      items: [
        {
          type: 'link',
          label: '[testnet] tonscan',
          href: 'https://testnet.tonscan.org/',
        },
        {
          type: 'link',
          label: '[testnet] ton.sh',
          href: 'https://testnet.ton.sh/',
        },
        {
          type: 'link',
          label: 'Whales Explorer',
          href: 'https://tonwhales.com/explorer/',
        },
      ],
    },
    {
      type: 'category',
      label: 'Network Configs',
      items: [
        {
          type: 'link',
          label: 'Mainnet config',
          href: 'https://ton.org/global-config.json',
        },
        {
          type: 'link',
          label: 'Testnet config',
          href: 'https://ton-blockchain.github.io/testnet-global.config.json',
        },
      ]
    }
  ],
  validate: [
    'validate/README',
    'develop/nodes/run-node',
  ],
  integrate: [],
  contribute: [
    {
      'type': 'category',
      'label': 'Become a Contributor',
      'items': [
        'contribute/README',
        'contribute/maintainers',
      ],
    },
  ],

}

module.exports = sidebars
