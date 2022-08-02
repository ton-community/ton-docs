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
    'learn/new-to-ton',
    {
      "type": "html",
      "value": "<hr/>"
    },
    {
      "type": "html",
      "value": "<span class='menu__link'><b><small> Basic Concepts </small></b></span>"
    },
    'learn/overviews/Cells',
    'learn/overviews/TL-B',
    'learn/overviews/TON_blockchain_overview',
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
      "type": "html",
      "value": "<hr/>"
    },
    {
      "type": "html",
      "value": "<span class='menu__link'><b><small> Deep Dive </small></b></span>"
    },
    {
      type: 'category',
      label: 'Smart Contracts',
      items: [
        'develop/smart-contracts/README',
        'develop/smart-contracts/getting-started',
        'develop/smart-contracts/fees',
        'develop/smart-contracts/tips',
        {
          type: 'category',
          label: 'Examples',
          items: [
            'develop/smart-contracts/governance',
          ]
        }
      ],
    },
    {
      type: 'category',
      label: 'FunC',
      items: [
        {
          type: 'doc',
          id: 'develop/func-task/README',
        },
        {
          type: 'link',
          label: 'FunC Cheat Sheet',
          href: 'https://mybinder.org/v2/gh/atomex-me/xeus-fift/binder?filepath=func_cheat_sheet.ipynb'
        }
      ],
    }
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
          href: 'example.com'
        },
        {
          type: 'link',
          label: '@wallet',
          href: 'example.com'
        },
        {
          type: 'link',
          label: 'Tonhub',
          href: 'example.com'
        },
        {
          type: 'link',
          label: 'Chrome plugin',
          href: 'example.com'
        }
      ],
    },
    {
      type: 'category',
      label: 'Explorers',
      items: [
        {
          type: 'link',
          label: '[testnet] tonscan',
          href: 'https://testnet.tonscan.org/'
        },
        {
          type: 'link',
          label: '[testnet] ton.sh',
          href: 'https://testnet.ton.sh/'
        },
        {
          type: 'link',
          label: 'Whales Explorer',
          href: 'https://tonwhales.com/explorer/'
        }
      ]
    }
  ],
  validate: [
  ],
  integrate: [
  ],
  contribute: [
    {
      "type": "category",
      "label": "Become a Contributor",
      "items": [
        'contribute/README',
        'contribute/maintainers',
      ]
    }
  ],

};

module.exports = sidebars;
