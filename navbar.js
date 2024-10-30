/** @type {import('@docusaurus/preset-classic').ThemeConfig['navbar']} */
module.exports = {
  title: '',
  logo: {
    alt: 'TON',
    src: 'img/ton_logo_light_background.svg',
    srcDark: 'img/ton_logo_dark_background.svg',
  },
  items: [
    {
      type: 'dropdown',
      to: '/v3/concepts/dive-into-ton/introduction',
      position: 'left',
      label: 'Concepts',
      items: [
        {
          to: '/v3/concepts/dive-into-ton/introduction',
          label: 'Introduction to TON',
        },
        {
          to: '/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps',
          label: 'Wallets',
        },
        {
          to: '/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton',
          label: 'Explorers',
        },
        {
          to: '/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains',
          label: 'Blockchain',
        },
      ],
    },
    // TODO: extract tutorials page!!!
    // {
    //   type: 'dropdown',
    //   to: '/v3/documentation/ton-documentation',
    //   position: 'left',
    //   label: 'Get Started',
    //   items: [
    //     {
    //       to: '/v3/documentation/ton-documentation',
    //       label: 'Start with Onboarding Tutorials',
    //     },
    //   ],
    // },
    {
      type: 'dropdown',
      to: '/v3/guidelines/dapps/overview',
      position: 'left',
      label: 'DApps',
      items: [
        {
          to: '/v3/guidelines/dapps/tma/overview',
          label: 'Telegram Mini Apps (TMAs)',
        },
        {
          to: 'v3/guidelines/dapps/apis-sdks/sdk',
          label: 'APIs and SDKs',
        },
        {
          to: '/v3/guidelines/dapps/asset-processing/payments-processing',
          label: 'Payment Processing',
        },
        {
          to: 'v3/guidelines/dapps/asset-processing/jettons',
          label: 'Jetton Processing',
        },
        {
          to: '/v3/guidelines/dapps/tutorials/mint-your-first-token',
          label: 'Mint your Tokens',
        },
        {
          to: '/v3/guidelines/dapps/tutorials/nft-minting-guide',
          label: 'Mint your NFTs',
        },
        {
          to: '/v3/guidelines/dapps/cookbook',
          label: 'Cookbook',
        },
      ],
    },
    {
      type: 'dropdown',
      to: 'v3/documentation/smart-contracts/overview',
      position: 'left',
      label: 'Smart Contracts',
      items: [
        {
          to: '/v3/documentation/smart-contracts/contracts-specs/wallet-contracts',
          label: 'Wallets',
        },
        {
          to: '/v3/documentation/smart-contracts/message-management/sending-messages',
          label: 'Sending Messages',
        },
        {
          to: 'v3/documentation/smart-contracts/transaction-fees/fees',
          label: 'Transaction Fees',
        },
        {
          to: 'v3/documentation/smart-contracts/func/overview',
          label: 'FunC Development Language',
        },
        {
          to: 'v3/documentation/smart-contracts/func/cookbook',
          label: 'FunC Cookbook',
        },
        {
          to: '/v3/documentation/data-formats/tlb/cell-boc',
          label: 'Data formats',
        },
        {
          to: 'v3/documentation/tvm/tvm-overview',
          label: 'TON Virtual Machine (TVM)',
        },
        {
          to: 'v3/guidelines/smart-contracts/guidelines',
          label: 'Best Practices for Contracts',
        },
      ],
    },
    {
      type: 'dropdown',
      to: 'v3/documentation/infra/nodes/node-types',
      position: 'left',
      label: 'Nodes',
      items: [
        {
          to: '/v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview',
          label: 'Manage Blockchain Nodes',
        },
        {
          to: '/v3/guidelines/nodes/nodes-troubleshooting',
          label: 'Troubleshooting the Node',
        },
        {
          to: '/v3/documentation/smart-contracts/contracts-specs/single-nominator-pool',
          label: 'Single Nominator Pool',
        },
        {
          to: '/v3/documentation/smart-contracts/contracts-specs/nominator-pool',
          label: 'Nominator Pool',
        },
        {
          to: '/v3/guidelines/nodes/running-nodes/archive-node', // TODO: add article
          label: 'Running Nodes',
        },
        {
          to: '/v3/guidelines/nodes/faq',
          label: 'FAQ',
        },
      ],
    },
    {
      type: 'dropdown',
      to: 'v3/guidelines/get-started-with-ton',
      label: 'Guidelines',
      position: 'left',
      items: [
        {
          to: '/v3/guidelines/smart-contracts/guidelines',
          label: 'Smart Contracts',
        },
        {
          to: '/v3/guidelines/dapps/overview',
          label: 'DApps',
        },
        {
          to: 'v3/guidelines/nodes/overview',
          label: 'Nodes'
        },
        {
          to: 'v3/guidelines/ton-connect/overview',
          label: 'Integrate with TON'
        },
        {
          to: 'v3/guidelines/web3/overview',
          label: 'Web3',
        },
      ]
    },
    {
      type: 'dropdown',
      to: '/v3/documentation/ton-documentation',
      label: 'Documentation',
      position: 'left',
      items: [
        {
          to: 'v3/documentation/smart-contracts/overview',
          label: 'Smart Contracts',
        },
        {
          to: 'v3/documentation/tvm/tvm-overview',
          label: 'TON Virtual Machine (TVM)',
        },
        {
          to: 'v3/documentation/infra/nodes/node-types',
          label: 'Nodes'
        },
        {
          to: 'v3/documentation/dapps/defi/coins', // TODO: add page
          label: 'DApps',
        },
        {
          to: '/v3/documentation/data-formats/tlb/cell-boc',
          label: 'Data Formats',
        },
        {
          to: 'v3/documentation/network/protocols/adnl/low-level-adnl',
          label: 'Networking'
        },
        {
          to: 'v3/documentation/whitepapers/overview',
          label: 'Whitepapers',
        },
      ]
    },
    {
      type: 'dropdown',
      label: 'Resources',
      position: 'left',
      items: [
        {
          to: 'https://tonresear.ch/',
          label: 'TON Research',
        },
        {
          to: 'https://t.me/addlist/1r5Vcb8eljk5Yzcy',
          label: 'TON Developers Kit',
        },
        {
          to: 'https://github.com/ton-blockchain/TEPs',
          label: 'Standards Discussion (TEPs)',
        },
      ],
    },
    {
      to: 'v3/contribute',
      position: 'right',
      className: 'header-contribute-link',
      'aria-label': 'Contribute',
    },
    {
      href: 'https://github.com/ton-community/ton-docs',
      position: 'right',
      className: 'header-github-link',
      'aria-label': 'GitHub repository',
    },
    {
      type: 'localeDropdown',
      position: 'right',
      dropdownItemsAfter: [
        {
          type: 'html',
          value: '<hr style="margin: 0.3rem 0;">',
        },
        {
          href: "/v3/contribute/localization-program/overview",
          label: 'Help Us Translate',
        },
      ],
    },
  ],
};
