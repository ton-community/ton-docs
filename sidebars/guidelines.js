/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarConfig}
 */
module.exports = [
  {
    type: 'category',
    label: `Quick start`,
    items: [
      'v3/guidelines/quick-start/getting-started',
      {
        type: 'category',
        label: 'Blockchain interaction',
        items: [
          'v3/guidelines/quick-start/blockchain-interaction/reading-from-network',
          'v3/guidelines/quick-start/blockchain-interaction/writing-to-network',
        ],
      },
      {
        type: 'category',
        label: 'Developing smart contracts',
        items: [
          'v3/guidelines/quick-start/developing-smart-contracts/setup-environment',
          'v3/guidelines/quick-start/developing-smart-contracts/blueprint-sdk-overview',
          'v3/guidelines/quick-start/developing-smart-contracts/storage-and-get-methods',
          'v3/guidelines/quick-start/developing-smart-contracts/processing-messages',
          'v3/guidelines/quick-start/developing-smart-contracts/tact-implementation',
          'v3/guidelines/quick-start/developing-smart-contracts/deploying-to-network'
        ],
      }
    ]
  },
  'v3/guidelines/get-started-with-ton',
  {
    type: 'category',
    label: 'TON Hello World series',
    items: [
      {
        type: 'link',
        label: 'Working with your wallet',
        href: 'https://helloworld.tonstudio.io/01-wallet',
      },
      {
        type: 'link',
        label: 'Writing first smart contract',
        href: 'https://helloworld.tonstudio.io/02-contract',
      },
      {
        type: 'link',
        label: 'Building first web client',
        href: 'https://helloworld.tonstudio.io/03-client',
      },
      {
        type: 'link',
        label: 'Testing your smart contract',
        href: 'https://helloworld.tonstudio.io/04-testing',
      },
    ],
  },
  {
    type: 'category',
    label: ' Smart contracts guidelines',
    items: [
      'v3/guidelines/smart-contracts/guidelines',
      'v3/guidelines/smart-contracts/get-methods',
      {
        type: 'doc',
        label: 'Transaction fees calculation',
        id: 'v3/guidelines/smart-contracts/fee-calculation',
      },
      {
        type: 'category',
        label: 'Testing',
        items: [
          'v3/guidelines/smart-contracts/testing/overview',
          'v3/guidelines/smart-contracts/testing/writing-test-examples',
        ],
      },
      {
        type: 'category',
        label: 'Security measures',
        items: [
          'v3/guidelines/smart-contracts/security/overview',
          'v3/guidelines/smart-contracts/security/secure-programming',
          'v3/guidelines/smart-contracts/security/things-to-focus',
          'v3/guidelines/smart-contracts/security/ton-hack-challenge-1',
          'v3/guidelines/smart-contracts/security/random-number-generation',
          'v3/guidelines/smart-contracts/security/random',
        ],
      },
      {
        type: 'category',
        label: 'How to',
        items: [
          {
            type: 'category',
            label: 'Compile from sources',
            items: [
              {
                type: 'doc',
                label: 'Compilation instructions',
                id: 'v3/guidelines/smart-contracts/howto/compile/compilation-instructions',
              },
              {
                type: 'doc',
                label: 'Instructions for low-memory machines',
                id: 'v3/guidelines/smart-contracts/howto/compile/instructions-low-memory',
              },
            ],
          },
          'v3/guidelines/smart-contracts/howto/multisig',
          'v3/guidelines/smart-contracts/howto/multisig-js',
          'v3/guidelines/smart-contracts/howto/airdrop-claim-best-practice',
          'v3/guidelines/smart-contracts/howto/shard-optimization',
          'v3/guidelines/smart-contracts/howto/wallet',
          'v3/guidelines/smart-contracts/howto/nominator-pool',
          'v3/guidelines/smart-contracts/howto/single-nominator-pool',
          {
            type: 'link',
            label: 'How to shard your TON smart contract and why',
            href: 'https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons',
          },
        ],
      },
    ]
  },
  {
    type: 'category',
    label: ' DApps guidelines',
    items: [
      'v3/guidelines/dapps/overview',
      'v3/guidelines/dapps/cookbook',
      {
        type: 'category',
        label: 'APIs and SDKs',
        items: [
          'v3/guidelines/dapps/apis-sdks/overview',
          'v3/guidelines/dapps/apis-sdks/sdk',
          'v3/guidelines/dapps/apis-sdks/api-types',
          'v3/guidelines/dapps/apis-sdks/ton-http-apis',
          'v3/guidelines/dapps/apis-sdks/ton-adnl-apis',
        ],
      },
      {
        type: 'category',
        label: 'Tutorials & examples',
        items: [
          {
            type: 'doc',
            id: 'v3/guidelines/dapps/tutorials/jetton-airdrop',
            label: 'How to launch a jetton airdrop',
          },
          'v3/guidelines/dapps/apis-sdks/api-keys',
          'v3/guidelines/dapps/apis-sdks/getblock-ton-api',
          {
            type: 'doc',
            id: 'v3/guidelines/dapps/tutorials/nft-minting-guide',
            label: 'NFT minting guide',
          },
          {
            type: 'doc',
            id: 'v3/guidelines/dapps/tutorials/mint-your-first-token',
            label: 'Mint your first token',
          },
          {
            type: 'doc',
            id: 'v3/guidelines/dapps/tutorials/zero-knowledge-proofs',
            label: 'Zero-Knowledge proofs',
          },
          {
            type: 'doc',
            id: 'v3/guidelines/dapps/tutorials/web3-game-example',
            label: 'Web3 game example',
          },
          {
            type: 'category',
            label: 'Telegram bot examples',
            items: [
              'v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot',
              'v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-2',
              'v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-js',
            ],
          },
        ],
      },
      {
        type: 'category',
        label: 'Telegram Mini Apps',
        items: [
          'v3/guidelines/dapps/tma/overview',
          {
            type: 'category',
            label: 'Guidelines',
            items: [
              'v3/guidelines/dapps/tma/guidelines/testing-apps',
              'v3/guidelines/dapps/tma/guidelines/publishing',
              'v3/guidelines/dapps/tma/guidelines/monetization',
              'v3/guidelines/dapps/tma/guidelines/tips-and-tricks',
            ],
          },
          {
            type: 'category',
            label: 'Tutorials & examples',
            items: [
              'v3/guidelines/dapps/tma/tutorials/step-by-step-guide',
              'v3/guidelines/dapps/tma/tutorials/app-examples',
              'v3/guidelines/dapps/tma/tutorials/design-guidelines',
            ],
          },
          'v3/guidelines/dapps/tma/notcoin',
          'v3/guidelines/dapps/tma/grants',
        ],
      },
      {
        type: 'category',
        label: 'Advanced asset processing',
        items: [
          'v3/guidelines/dapps/asset-processing/payments-processing',
          'v3/guidelines/dapps/asset-processing/jettons',
          'v3/guidelines/dapps/asset-processing/mintless-jettons',
          'v3/guidelines/dapps/asset-processing/compressed-nfts',
          'v3/guidelines/dapps/asset-processing/mass-mint-tools',
          {
            type: 'category',
            label: 'NFT processing',
            items: [
              'v3/guidelines/dapps/asset-processing/nft-processing/nfts',
              'v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing',
            ],
          },
        ],
      },
    ]
  },
  {
    type: 'category',
    label: 'Blockchain nodes guidelines',
    items: [
      'v3/guidelines/nodes/overview',
      {
        type: 'category',
        label: 'Running nodes',
        items: [
          'v3/guidelines/nodes/running-nodes/archive-node',
          'v3/guidelines/nodes/running-nodes/full-node',
          'v3/guidelines/nodes/running-nodes/liteserver-node',
          'v3/guidelines/nodes/running-nodes/validator-node',
          'v3/guidelines/nodes/running-nodes/staking-with-nominator-pools',
          'v3/guidelines/nodes/running-nodes/run-mytonctrl-docker',
          'v3/guidelines/nodes/running-nodes/running-a-local-ton',
          'v3/guidelines/nodes/running-nodes/secure-guidelines',
        ],
      },
      {
        type: 'category',
        label: 'Maintenance guidelines',
        items: [
          'v3/guidelines/nodes/maintenance-guidelines/mytonctrl-backup-restore',
          'v3/guidelines/nodes/maintenance-guidelines/mytonctrl-validator-standby',
          'v3/guidelines/nodes/maintenance-guidelines/mytonctrl-private-alerting',
          'v3/guidelines/nodes/maintenance-guidelines/mytonctrl-prometheus',
          'v3/guidelines/nodes/maintenance-guidelines/mytonctrl-remote-controller'
        ],
      },
      'v3/guidelines/nodes/custom-overlays',
      'v3/guidelines/nodes/nodes-troubleshooting',
      'v3/guidelines/nodes/node-maintenance-and-security',
      'v3/guidelines/nodes/monitoring/performance-monitoring',
      'v3/guidelines/nodes/persistent-states',
      'v3/guidelines/nodes/faq',
    ]
  },
  {
    items: [
      'v3/guidelines/ton-connect/overview',
      {
        type: 'category',
        label: 'Integrate a DApp',
        items: [
          'v3/guidelines/ton-connect/guidelines/how-ton-connect-works',
          'v3/guidelines/ton-connect/guidelines/creating-manifest',
          {
            type: 'category',
            label: 'Install TON Connect',
            items: [
              {
                type: 'doc',
                id: 'v3/guidelines/ton-connect/frameworks/react',
                label: 'React Apps',
              },
              {
                type: 'doc',
                id: 'v3/guidelines/ton-connect/frameworks/vue',
                label: 'Vue Apps',
              },
              {
                type: 'doc',
                id: 'v3/guidelines/ton-connect/frameworks/web',
                label: 'HTML/JS Apps',
              },
            ],
          },
          'v3/guidelines/ton-connect/guidelines/preparing-messages',
          'v3/guidelines/ton-connect/guidelines/sending-messages',
          'v3/guidelines/ton-connect/guidelines/verifying-signed-in-users',
        ],
      },
      {
        type: 'doc',
        label: 'Integrate a wallet',
        id: 'v3/guidelines/ton-connect/wallet',
      },
      'v3/guidelines/ton-connect/guidelines/developers',
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
            label: 'Wallets list',
            href: 'https://github.com/ton-blockchain/wallets-list',
          },
        ],
      },
      {
        type: 'category',
        label: 'Business',
        items: [
          'v3/guidelines/ton-connect/business/ton-connect-for-business',
          'v3/guidelines/ton-connect/business/ton-connect-for-security'
        ],
      }
    ],
    label: 'Integrate with TON',
    type: 'category'
  },

  {
    'type': 'category',
    'label': 'Web3 guidelines',
    'items': [
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
        'label': 'Proxy & sites',
        'items': [
          'v3/guidelines/web3/ton-proxy-sites/how-to-run-ton-site',
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
    ]
  },
];
