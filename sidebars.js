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
      'value': '<span class=\'menu__link\'><b><small> TON Concepts </small></b></span>',
    },
    {
      type: 'category',
      label: 'TON Blockchain',
      items: [
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
          label: 'TL-B Language',
          items: [
            'learn/overviews/TL-B',
            'learn/overviews/TL-B_language',
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
        'learn/services/dns',
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
          href: 'https://ton.org/ton.pdf',
        },
        {
          type: 'link',
          label: 'TON Virtual Machine',
          href: 'https://ton.org/tvm.pdf',
        },
        {
          type: 'link',
          label: 'TON Blockchain',
          href: 'https://ton.org/tblkch.pdf',
        },
        {
          type: 'link',
          label: 'Catchain Consensus Protocol',
          href: 'https://ton.org/catchain.pdf',
        },

      ],
    },
    {
      'type': 'html',
      'value': '<hr/>',
    },
    {
      'type': 'html',
      'value': '<span class=\'menu__link\'><b><small> Decentralized Finance (DeFi) </small></b></span>',
    },
    'learn/defi/coins',
    'learn/defi/subscriptions',
    'learn/defi/tokens',
    'learn/defi/ton-payments',


  ],
  develop: [

    'develop/getting-started',
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
            'develop/smart-contracts/sdk/tonstarter',
            'develop/smart-contracts/sdk/toncli',
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
              label: 'Using Online IDE',
              href: 'https://glitch.com/edit/#!/remix/clone-from-repo?&REPO_URL=https%3A%2F%2Fgithub.com%2Fton-defi-org%2Ftonstarter-contracts.git',
            },
            {
              type: 'link',
              label: 'Using toncli',
              href: 'https://github.com/disintar/toncli',
            },
            {
              type: 'link',
              label: 'Using NFT Minter',
              href: '/develop/getting-started#nft-minters--non-fungible-tokens',
            },
            {
              type: 'link',
              label: 'Using Jetton Deployer',
              href: '/develop/getting-started#jetton-deployer--fungible-tokens',
            },

          ],
        },
        {
          type: 'category',
          label: 'Best Practices',
          items: [
            'develop/smart-contracts/guidelines',
            'develop/smart-contracts/fees',
            'develop/smart-contracts/messages',
            'develop/smart-contracts/guidelines/internal-messages',
            'develop/smart-contracts/guidelines/external-messages',
            'develop/smart-contracts/guidelines/non-bouncable-messages',
            'develop/smart-contracts/guidelines/get-methods',
            'develop/smart-contracts/guidelines/accept',
            'develop/smart-contracts/guidelines/processing',
            'develop/smart-contracts/governance',
            'develop/smart-contracts/guidelines/tips',
            {
              type: 'link',
              label: 'How to shard your TON smart contract and why',
              href: 'https://society.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-theanatomy-of-tons-jettons',
            },
          ],
        },
        {
          type: 'link',
          label: 'Coming from ETH and Solidity',
          href: '/learn/introduction#ethereum-to-ton',
        },
      ],
    },
    {
      type: 'category',
      label: 'Develop Web Apps & Bots',
      items: [
        'develop/tools/README',
        {
          type: 'category',
          label: 'API Types',
          items: [
            'develop/tools/apis/README',
            'develop/tools/apis/toncenter',
            'develop/tools/apis/adnl',
          ],
        },
        {
          type: 'category',
          label: 'Best Practices',
          items: [
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
      type: 'link',
      label: 'TON Concepts',
      href: '/learn/introduction',
    },
    {
      type: 'link',
      label: 'TON Services',
      href: '/learn/services/dns',
    },
    {
      type: 'link',
      label: 'TON Whitepapers',
      href: '/learn/docs',
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
          href: 'https://ton.org/testnet-global.config.json',
        },
      ],
    },

    {
      type: 'category',
      label: 'Low Level Internals',
      items: [
        'develop/howto/fees_low_level',
        'develop/howto/step-by-step',
        'develop/howto/ton-sites',
        'develop/howto/config-params',
        'develop/howto/pow-givers',
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

    // {
    //   type: 'category',
    //   label: 'Support',
    //   items: [
    //     'develop/howto/wallets',
    //   ],
    // },
    // 'develop/compile',
  ],
  participate: [
    'participate/README',
    {
      'type': 'html',
      'value': '<hr/>',
    },
    {
      'type': 'html',
      'value': '<span class=\'menu__link\'><b><small> Participate in TON Ecosystem </small></b></span>',
    },
    'participate/explorers',
    {
      type: 'category',
      label: 'Setup Your Wallet',
      items: [
        'participate/wallets/apps',
        'participate/wallets/contracts',
        {
          type: 'link',
          label: 'Wallet Contract Versions',
          href: 'https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md',
        },
      ],
    },
    {
      type: 'doc',
      label: 'Use Cross-chain Bridges',
      id: 'participate/crosschain-bridges',
    },
    {
      type: 'doc',
      label: 'Stake with Nominator Pools',
      id: 'participate/nominators',
    },
    {
      type: 'category',
      label: 'Run a Node',
      items: [
        'participate/nodes/node-types',
        'participate/nodes/local-ton',
        'participate/nodes/node-maintenance-and-security',
        'participate/nodes/run-node',
        {
          type: 'link',
          label: 'Run a Validator Node',
          href: 'https://ton.org/validator',
        },
      ],
    },
    {
      type: 'link',
      label: 'Standards Discussion (TEPs)',
      href: 'https://github.com/ton-blockchain/TEPs',
    },
    {
      type: 'link',
      label: 'Ask a Question about TON',
      href: 'https://answers.ton.org/',
      className: 'noIcons',
    },
    {
      'type': 'html',
      'value': '<hr/>',
    },
    {
      'type': 'html',
      'value': '<span class=\'menu__link\'><b><small> Participate in Web3 </small></b></span>',
    },
    'participate/web3/overview',
    'participate/web3/dns',
    'participate/web3/setting-proxy',
    'participate/web3/site-management',
  ],
  contribute: [
    {
      'type': 'category',
      'label': 'Become a Contributor',
      'items': [
        'contribute/README',
        'contribute/maintainers',
        'contribute/guidelines',
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
