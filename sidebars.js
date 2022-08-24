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
    {
      'type': 'html',
      'value': '<hr/>',
    },
    {
      'type': 'html',
      'value': '<span class=\'menu__link\'><b><small> Basic concepts </small></b></span>',
    },
    'learn/overviews/TON_blockchain_overview',
    'learn/overviews/Cells',
    {
      type: 'category',
      label: 'TON Virtual Machine (TVM)',
      items: [
        'learn/tvm-instructions/tvm_overview',
        'learn/tvm-instructions/tvm_exit_codes',
        'learn/tvm-instructions/instructions',
      ],
    },
    {
      type: 'category',
      label: 'Typed Language - Binary',
      items: [
        'learn/overviews/TL-B',
        'learn/overviews/TL-B_language',
      ],
    },
    'learn/overviews/ADNL',
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
          href: 'https://ton-blockchain.github.io/ton.pdf',
        },
        {
          type: 'link',
          label: 'TON Virtual Machine',
          href: 'https://ton-blockchain.github.io/tvm.pdf',
        },
        {
          type: 'link',
          label: 'TON Blockchain',
          href: 'https://ton-blockchain.github.io/tblkch.pdf',
        },
        {
          type: 'link',
          label: 'Catchain Consensus Protocol',
          href: 'https://ton-blockchain.github.io/catchain.pdf',
        },

      ],
    },
  ],
  develop: [

    'develop/getting-started',
    'develop/installation',
    {
      'type': 'html',
      'value': '<hr/>',
    },
    {
      'type': 'html',
      'value': '<span class=\'menu__link\'><b><small> Essentials </small></b></span>',
    },
    {
      type: 'category',
      label: 'Smart Contracts',
      items: [
        'develop/smart-contracts/README',
        'develop/smart-contracts/messages',
        'develop/smart-contracts/fees',
        {
          type: 'category',
          label: 'Testing & Debugging',
          items: [
            'develop/smart-contracts/testing/tonstarter',
            'develop/smart-contracts/testing/toncli',
          ],
        },
        // 'develop/smart-contracts/governance',
        {
          type: 'category',
          label: 'Best Practices',
          items: [
            'develop/smart-contracts/guidelines',
            'develop/smart-contracts/guidelines/internal-messages',
            'develop/smart-contracts/guidelines/external-messages',
            'develop/smart-contracts/guidelines/non-bouncable-messages',
            'develop/smart-contracts/guidelines/get-methods',
            'develop/smart-contracts/guidelines/accept',
            'develop/smart-contracts/guidelines/processing',
            'develop/smart-contracts/guidelines/tips',
            {
              type: 'link',
              label: 'How to shard your TON smart contract and why',
              href: 'https://society.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-theanatomy-of-tons-jettons',
            },
          ],
        },
        {
          type: 'category',
          label: 'Deploying Contracts',
          items: [
            {
              type: 'link',
              label: 'Using tonstarter-contracts',
              href: 'https://github.com/ton-defi-org/tonstarter-contracts',
            },
            {
              type: 'link',
              label: 'Using Online IDE',
              href: 'https://glitch.com/edit/#!/remix/clone-from-repo?&REPO_URL=https%3A%2F%2Fgithub.com%2Fton-defi-org%2Ftonstarter-contracts.git',
            },
            {
              type: 'link',
              label: 'Using toncli',
              href: 'https://github.com/disintar/toncli',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Tools & SDK',
      items: [
        'develop/tools/README',
        'develop/tools/ide-plugins',
        'develop/tools/apis/README',
        // {
        //   type: 'category',
        //   label: 'TON SDK',
        //   items: [
        //     {
        //       type: 'link',
        //       label: 'tonweb',
        //       href: 'https://github.com/toncenter/tonweb',
        //     },
        //     {
        //       type: 'link',
        //       label: 'ton-js',
        //       href: 'https://github.com/tonwhales/ton',
        //     },
        //     {
        //       type: 'link',
        //       label: 'TON kotlin',
        //       href: 'https://github.com/andreypfau/ton-kotlin',
        //     },
        //     {
        //       type: 'link',
        //       label: 'tonutils-go',
        //       href: 'https://github.com/xssnick/tonutils-go',
        //     },
        //   ],
        // },
        'develop/tools/testnet/README',
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
        // {
        //   type: 'link',
        //   label: 'FunC Cheat Sheet',
        //   href: 'https://mybinder.org/v2/gh/atomex-me/xeus-fift/binder?filepath=func_cheat_sheet.ipynb',
        // },
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
            // 'develop/func/FAQ',
          ],
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

    // {
    //   type: 'category',
    //   label: 'Support',
    //   items: [
    //     'develop/howto/wallets',
    //   ],
    // },
    // 'develop/compile',
  ],
  validate: [
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
  ],
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
