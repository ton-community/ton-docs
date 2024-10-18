/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarConfig}
 */
module.exports = [
  'v3/guidelines/overview',
  'develop/get-started-with-ton',
  {
    type: 'category',
    label: 'TON Hello World series',
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
    'value': '<span class=\'menu__link\'><b><small> Smart Contracts Guidelines </small></b></span>',
  },
  'develop/smart-contracts/guidelines',
  'develop/smart-contracts/guidelines/get-methods',
  {
    type: 'doc',
    label: 'Transaction fees calculation',
    id: 'develop/smart-contracts/fee-calculation',
  },
  {
    type: 'category',
    label: 'Security Measures',
    items: [
      'develop/smart-contracts/security/README',
      'develop/smart-contracts/security/secure-programming',
      'develop/smart-contracts/security/things-to-focus',
      'develop/smart-contracts/security/ton-hack-challenge-1',
      'develop/smart-contracts/guidelines/random-number-generation',
      'develop/smart-contracts/security/random',
    ],
  },
  {
    type: 'category',
    label: 'How to',
    items: [
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
      'develop/smart-contracts/tutorials/multisig',
      'develop/smart-contracts/tutorials/multisig-js',
      'develop/smart-contracts/tutorials/airdrop-claim-best-practice',
      'develop/smart-contracts/tutorials/shard-optimization',
      'develop/smart-contracts/tutorials/wallet',
      {
        type: 'link',
        label: 'How to shard your TON smart contract and why',
        href: 'https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons',
      },
    ],
  },
  {
    'type': 'html',
    'value': '<hr/>',
  },
  {
    'type': 'html',
    'value': '<span class=\'menu__link\'><b><small> DApps Guidelines </small></b></span>',
  },
  'develop/dapps/README',
  'develop/dapps/cookbook',
  {
    type: 'category',
    label: 'APIs and SDKs',
    items: [
      'develop/dapps/apis/sdk',
      'v3/guidelines/dapps/apis-sdks/api-types',
      'v3/guidelines/dapps/apis-sdks/ton-http-apis',
      'v3/guidelines/dapps/apis-sdks/ton-adnl-apis',
      'v3/guidelines/dapps/apis-sdks/api-keys'
    ],
  },
  {
    type: 'category',
    label: 'Tutorials & Examples',
    items: [
      {
        type: 'doc',
        id: 'develop/dapps/tutorials/collection-minting',
        label: 'NFT Minting Guide',
      },
      {
        type: 'doc',
        id: 'develop/dapps/tutorials/jetton-minter',
        label: 'Mint Your First Token',
      },
      {
        type: 'doc',
        id: 'develop/dapps/tutorials/simple-zk-on-ton',
        label: 'Zero-Knowledge Proofs',
      },
      {
        type: 'doc',
        id: 'develop/dapps/tutorials/building-web3-game',
        label: 'Web3 Game Example',
      },
      {
        type: 'category',
        label: 'Telegram Bot Examples',
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
    label: 'Telegram Mini Apps',
    items: [
      'develop/dapps/telegram-apps/README',
      {
        type: 'category',
        label: 'Guidelines',
        items: [
          'develop/dapps/telegram-apps/testing-apps',
          'develop/dapps/telegram-apps/publishing',
          'develop/dapps/telegram-apps/monetization',
          'develop/dapps/telegram-apps/tips-and-tricks',
        ],
      },
      {
        type: 'category',
        label: 'Tutorials & Examples',
        items: [
          'develop/dapps/telegram-apps/step-by-step-guide',
          'develop/dapps/telegram-apps/app-examples',
          'develop/dapps/telegram-apps/design-guidelines',
        ],
      },
      'develop/dapps/telegram-apps/notcoin',
      'develop/dapps/telegram-apps/grants',
    ],
  },
  {
    type: 'category',
    label: 'Advanced Asset Processing',
    items: [
      'develop/dapps/asset-processing/README', // TODO: divide
      'develop/dapps/asset-processing/jettons', // TODO: divide
      'develop/dapps/asset-processing/mintless-jettons', // TODO: divide
      'develop/dapps/asset-processing/mass-mint-tools',
      {
        type: 'category',
        label: 'NFT Processing',
        items: [
          'develop/dapps/asset-processing/nfts', // TODO: divide
          'develop/dapps/asset-processing/metadata',
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
    'value': '<span class=\'menu__link\'><b><small> MyTonCtrl & Blockchain Nodes Guidelines </small></b></span>',
  },
  'v3/guidelines/nodes/overview',
  {
    type: 'category',
    label: 'Running Nodes',
    items: [
      'v3/guidelines/nodes/running-nodes/archive-node',
      'participate/run-nodes/full-node',
      'v3/guidelines/nodes/running-nodes/liteserver-node',
      'v3/guidelines/nodes/running-nodes/validator-node',
      'v3/guidelines/nodes/running-nodes/staking-with-nominator-pools',
      'v3/guidelines/nodes/running-nodes/run-mytonctrl-docker',
      'v3/guidelines/nodes/running-nodes/running-a-local-ton',
      'v3/guidelines/nodes/running-nodes/secure-guidelines',
    ],
  },
  'v3/guidelines/nodes/custom-overlays',
  'v3/guidelines/nodes/nodes-troubleshooting',
  'v3/guidelines/nodes/node-maintenance-and-security',
  'v3/guidelines/nodes/persistent-states',
  'v3/guidelines/nodes/faq',
  {
    'type': 'html',
    'value': '<hr/>',
  },
  {
    'type': 'html',
    'value': '<span class=\'menu__link\'><b><small> Integrate with TON </small></b></span>',
  },
  'develop/dapps/ton-connect/overview',
  {
    type: 'doc',
    id: 'develop/dapps/ton-connect/wallet',
  },
  {
    type: 'category',
    label: 'Frameworks',
    items: [
      {
        type: 'doc',
        id: 'develop/dapps/ton-connect/react',
        label: 'React Apps',
      },
      {
        type: 'doc',
        id: 'v3/guidelines/ton-connect/frameworks/vue',
        label: 'Vue Apps',
      },
      {
        type: 'doc',
        id: 'develop/dapps/ton-connect/web',
        label: 'HTML/JS Apps',
      },
    ],
  },
  {
    type: 'category',
    label: 'Guidelines',
    items: [
      'v3/guidelines/ton-connect/guidelines/how-ton-connect-works',
      'develop/dapps/ton-connect/developers',
      'v3/guidelines/ton-connect/guidelines/creating-manifest',
      'v3/guidelines/ton-connect/guidelines/preparing-messages',
      'v3/guidelines/ton-connect/guidelines/sending-messages',
      'v3/guidelines/ton-connect/guidelines/verifying-signed-in-users',
      'v3/guidelines/ton-connect/guidelines/integration-with-javascript-sdk',
    ],
  },
  {
    type: 'category',
    label: 'Advanced',
    items: [
      {
        type: 'link',
        label: 'Protocol specification',
        href: 'https://github.com/ton-blockchain/ton-connect',
      },
      {
        type: 'link',
        label: 'Wallets List',
        href: 'https://github.com/ton-blockchain/wallets-list',
      },
    ],
  },
  {
    type: 'category',
    label: 'Business',
    items: [
      'v3/guidelines/ton-connect/business/ton-connect-for-business',
      'v3/guidelines/ton-connect/business/ton-connect-for-security',
      'v3/guidelines/ton-connect/business/ton-connect-comparison',
    ],
  },
  {
    'type': 'html',
    'value': '<hr/>',
  },
  {
    'type': 'html',
    'value': '<span class=\'menu__link\'><b><small> Web3 Guidelines </small></b></span>',
  },
  'v3/guidelines/web3/overview',
  {
    'type': 'category',
    'label': 'TON DNS',
    'items': [
      'v3/guidelines/web3/ton-dns/dns',
      'v3/guidelines/web3/ton-dns/subresolvers',
    ],
  },
  {
    'type': 'category',
    'label': 'TON Proxy & Sites',
    'items': [
      'develop/dapps/tutorials/how-to-run-ton-site',
      'v3/guidelines/web3/ton-proxy-sites/ton-sites-for-applications',
      'v3/guidelines/web3/ton-proxy-sites/connect-with-ton-proxy',
      'v3/guidelines/web3/ton-proxy-sites/how-to-open-any-ton-site',
      'v3/guidelines/web3/ton-proxy-sites/site-and-domain-management',
      'v3/guidelines/web3/ton-proxy-sites/running-your-own-ton-proxy',
    ],
  },
  {
    'type': 'category',
    'label': 'TON Storage',
    'items': [
      'v3/guidelines/web3/ton-storage/storage-daemon',
      'v3/guidelines/web3/ton-storage/storage-provider',
      'v3/guidelines/web3/ton-storage/storage-faq',
    ],
  },
];
