// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

require("dotenv").config();

const getEnvLangConfig = () => {
  const defaultLocale = process.env.DEFAULT_LOCALE || "en";

  const langArray = process.env.TARGET_LANGS
    ? process.env.TARGET_LANGS.split(",")
    : ["mandarin", "ru", "ko", "pl", "uk", "ja"];

  const locales = Array.from(new Set([defaultLocale, ...langArray]));

  return {
    defaultLocale,
    locales,
    localeConfigs: {
      en: {
        label: "English",
      },
      'mandarin': {
        label: '简体中文',
        path: "zh-CN",
      },
    },
  };
};

// function to get current year
function getCurrentYear () {
  const now = new Date()
  return now.getFullYear()
}

// show current year in text
const currentYear = getCurrentYear()

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'The Open Network',
  tagline: 'Mass adoption. Massive distribution',
  url: 'https://docs.ton.org',
  staticDirectories: ['public', 'static'],
  baseUrl: '/',
  themes: [
    '@docusaurus/theme-live-codeblock',
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        // ... Your options.
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,
        indexPages: true,
        indexBlog: false,
        searchBarShortcutHint: false,
        // For Docs using Chinese, The `language` is recommended to set to:
        // ```
        language: ["en", "zh"],
        // ```
      },
    ],
  ],
  plugins: [
    ['docusaurus-plugin-sass', {}],
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          // CamelCase to kebab-case
          {
            to: '/learn/tvm-instructions/tvm-exit-codes',
            from: '/learn/tvm-instructions/tvm_exit_codes',
          },
          {
            to: '/develop/dapps/telegram-apps',
            from: '/develop/dapps/twa',
          },
          {
            to: '/learn/tvm-instructions/tvm-overview',
            from: '/learn/tvm-instructions/tvm_overview',
          },
          {
            to: '/learn/overviews/ton-blockchain',
            from: '/learn/overviews/TON_Blockchain_overview',
          },
          {
            to: '/learn/networking/low-level-adnl',
            from: '/learn/overviews/adnl',
          },

          {
            to: '/develop/dapps/tutorials/accept-payments-in-a-telegram-bot',
            from: '/develop/dapps/payment-processing/accept-payments-in-a-telegram-bot',
          },
          {
            to: '/develop/dapps/tutorials/accept-payments-in-a-telegram-bot-2',
            from: '/develop/dapps/payment-processing/accept-payments-in-a-telegram-bot-2',
          },
          {
            to: '/develop/get-started-with-ton',
            from: '/develop/onboarding-challenge',
          },
          {
            to: '/develop/overview',
            from: '/develop/getting-started',
          },
          {
            to: '/develop/data-formats/tl-b-language',
            from: '/develop/data-formats/tl-b',
          },
          {
            to: '/learn/tvm-instructions/tvm-upgrade-2023-07',
            from: '/learn/tvm-instructions/tvm-upgrade',
          },
          {
            to: '/develop/smart-contracts/testing/overview',
            from: '/develop/smart-contracts/testing/tonstarter',
          }
        ],
      },
    ],
  ],
  stylesheets: [
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&family=Inter:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap',
  ],
  onBrokenLinks: 'warn', // for PRODUCTION
  onBrokenMarkdownLinks: 'warn', //for PRODUCTION
  // onBrokenLinks: 'throw',
  // onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon32x32.png',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ton', // Usually your GitHub org/user name.
  projectName: 'ton-docs', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: getEnvLangConfig(),
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        gtag: {
          trackingID: 'G-0PVST6PCG8',
          anonymizeIP: true,
        },
        docs: {
          routeBasePath: '/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          breadcrumbs: false,
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/ton-community/ton-docs/tree/main/',
          // lastVersion: '1.0.0',
          // versions: {
          //   current: {
          //     path: 'next',
          //     banner: 'none',
          //     badge: false,
          //   },
          //   '1.0.0': {
          //     path: '/',
          //     banner: 'none',
          //     badge: false,
          //   }
          // }
          remarkPlugins: [
            [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
          ],
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/ton-community/ton-docs/tree/main/',
        },
        theme:
          {
            customCss: require.resolve('./src/css/custom.css'),
          },
        pages: {
          mdxPageComponent: '@site/src/components/MDXPage'
        }
      }),
    ],
  ],

  themeConfig:
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        // The application ID provided by Algolia
        appId: 'AIQ3FM6W39',

        // Public API key: it is safe to commit it
        apiKey: 'ab02d1c08f877a738f59233af7f5ed6b',

        indexName: 'ton',

        // Optional: see doc section below
        contextualSearch: true,

        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: 'external\\.com|domain\\.com',

        // Optional: Algolia search parameters
        searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',

        //... other Algolia params
      },

      // announcementBar: {
      //   // id: 'contribute/hacktoberfest',
      //   content: '<a rel="noopener noreferrer" target="_blank" href="https://society.ton.org/hack-ton-berfest-2023?utm_source=tondocs&utm_medium=top_banner&utm_campaign=promo"><span>The <b>HACK-TON-BERFEST 2023</b> event is near! Double-merch, NFT rewards and more!</span> <span class="mobile-view">Double-merch, NFT reward and more!</span></a>',
      //   textColor: '#F3F3F7',
      //   isCloseable: false,
      // },

      image: 'img/snippet.png',
      navbar: {
        title: '',
        logo: {
          alt: 'TON',
          src: 'img/ton_logo_light_background.svg',
          srcDark: 'img/ton_logo_dark_background.svg',
        },
        items: [
          {
            type: 'dropdown',
            to: '/learn/introduction',
            position: 'left',
            label: 'Concepts',
            items: [
              {
                to: '/learn/introduction',
                label: 'Introduction to TON',
              },
              {
                to: '/learn/overviews/ton-blockchain',
                label: 'Blockchain of Blockchains',
              },
              {
                to: '/learn/overviews/addresses',
                label: 'Smart Contract Addresses',
              },
              {
                to: '/learn/overviews/cells',
                label: 'Cells as a Data Structure',
              },
              {
                to: '/learn/networking/overview',
                label: 'TON Networking',
              },
              {
                to: '/learn/docs',
                label: 'Whitepapers',
              },

            ],
          },
          {
            type: 'dropdown',
            to: '/develop/overview',
            position: 'left',
            label: 'Get Started',
            items: [
              {
                to: '/develop/overview',
                label: 'Start with Onboarding Tutorials',
              },
              {
                to: '/develop/dapps/tutorials/jetton-minter',
                label: 'Mint your Tokens',
              },
              {
                to: '/develop/dapps/tutorials/collection-minting',
                label: 'Mint your NFTs',
              },
              {
                to: '/develop/dapps/telegram-apps/',
                label: 'Build your first Mini App',
              },
              {
                to: '/develop/dapps',
                label: 'Dive into DApps Development',
              },
            ],
          },
          {
            type: 'dropdown',
            to: 'develop/dapps',
            position: 'left',
            label: 'DApps',
            items: [
              {
                to: 'develop/dapps/apis/sdk',
                label: 'APIs and SDKs',
              },
              {
                to: 'develop/dapps/asset-processing',
                label: 'Asset Processing',
              },
              {
                to: 'develop/dapps/asset-processing/jettons',
                label: 'Jetton Processing',
              },
              {
                to: '/develop/dapps/cookbook',
                label: 'Cookbook',
              },
              {
                to: '/develop/dapps/telegram-apps/',
                label: 'TMA Development',
              },
            ],
          },
          {
            type: 'dropdown',
            to: 'develop/overview',
            position: 'left',
            label: 'Smart Contracts',
            items: [
              {
                to: '/develop/smart-contracts/tutorials/wallet',
                label: 'Understanding Wallets',
              },
              {
                to: 'develop/smart-contracts',
                label: 'Write Smart Contracts',
              },
              {
                to: '/develop/smart-contracts/messages',
                label: 'Sending Messages',
              },
              {
                to: 'develop/smart-contracts/fees',
                label: 'Transaction Fees',
              },
              {
                to: 'develop/smart-contracts/guidelines',
                label: 'Best Practices for Contracts',
              },
              {
                to: 'develop/func/overview',
                label: 'FunC Development Language',
              },
              {
                to: 'develop/func/cookbook',
                label: 'FunC Cookbook',
              },
              {
                to: '/develop/data-formats/cell-boc',
                label: 'Data formats',
              },
              {
                to: 'learn/tvm-instructions/tvm-overview',
                label: 'TON Virtual Machine (TVM)',
              },
            ],
          },
          {
            type: 'dropdown',
            to: 'participate',
            position: 'left',
            label: 'Nodes',
            items: [
              {
                to: 'participate/nodes/node-types',
                label: 'Node Types',
              },
              {
                to: 'https://ton.org/validator',
                label: 'Become a Validator',
              },
              {
                to: 'participate/run-nodes/full-node',
                label: 'Run a Full Node',
              },
              {
                to: 'https://docs.ton.org/participate/run-nodes/full-node#enable-liteserver-mode',
                label: 'Enable Liteserver',
              },
              {
                to: 'participate/run-nodes/archive-node',
                label: 'Run an Archive Node',
              },
              {
                to: '/participate/network-maintenance/single-nominator',
                label: 'Single Nominator Pool',
              },

              {
                to: '/participate/network-maintenance/vesting-contract',
                label: 'Vesting Contract',
              },
            ],
          },
          {
            type: 'dropdown',
            to: 'participate',
            position: 'left',
            label: 'Web3',
            items: [
              {
                to: 'participate/web3/dns',
                label: 'TON DNS & Domains',
              },
              {
                to: 'participate/web3/how-to-open-any-ton-site',
                label: 'Open TON Sites',
              },
              {
                to: 'develop/dapps/tutorials/how-to-run-ton-site',
                label: 'Run TON Sites',
              },
              {
                to: 'participate/ton-storage/storage-daemon',
                label: 'Run a Storage Daemon',
              },
              {
                to: 'participate/ton-storage/storage-provider',
                label: 'Build a Storage Provider',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Community',
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
                to: 'https://t.me/tonsupport_aibot',
                label: 'AI TON Support Agent',
              },
              {
                to: 'https://github.com/ton-blockchain/TEPs',
                label: 'Standards Discussion (TEPs)',
              },
              {
                to: 'contribute',
                label: 'Contribute to Docs',
              },
            ],
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
                href: "/contribute/localization-program/overview",
                label: 'Help Us Translate',
              },
            ],
          },
        ],
      },
      footer: {
        // style: 'dark',
        // copyright: `Copyright © ${new Date().getFullYear()} TON Foundation`,
      },
      prism: {
        theme: require('./prism-theme'),
        darkTheme: require('./prism-theme'),
        additionalLanguages: [
          'java',
          'python',
          'kotlin',
          'go',
          'typescript',
          'cpp',
          'c',
        ],
      },
      docs: {
        sidebar: {
          hideable: false,
        },
      },
      colorMode: {
        defaultMode: 'light',
        // respectPrefersColorScheme: true,
        // disableSwitch: true,
      },
    }),
}

module.exports = config
