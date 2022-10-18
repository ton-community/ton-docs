// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'The Open Network',
  tagline: 'Mass adoption. Massive distribution',
  url: 'https://tonspace.co',
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
        // For Docs using Chinese, The `language` is recommended to set to:
        // ```
        // language: ["en", "zh"],
        // ```
      },
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          // services
          {
            to: '/learn/services/dns',
            from: '/develop/services/dns',
          },
          {
            to: '/learn/services/payments',
            from: '/develop/services/payments',
          },
          {
            to: '/learn/networking/low-level-adnl',
            from: '/learn/overviews/adnl',
          },

          // payment processing
          {
            to: '/develop/dapps/payment-processing/common',
            from: '/develop/payment-processing/common',
          },
          {
            to: '/develop/dapps/payment-processing/overview',
            from: '/develop/payment-processing/overview',
          },
          {
            to: '/develop/dapps/payment-processing/withdrawals',
            from: '/develop/payment-processing/withdrawals',
          },
          {
            to: '/develop/dapps/payment-processing/withdrawals',
            from: '/develop/payment-processing/withdrawals',
          },
          {
            to: '/develop/dapps/payment-processing/deposits-single-wallet',
            from: '/develop/payment-processing/deposits-single-wallet',
          },
          {
            to: '/develop/dapps/payment-processing/deposits-multi-wallet',
            from: '/develop/payment-processing/deposits-multi-wallet',
          },
        ],
      },
    ],
  ],
  stylesheets: [
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&family=Mulish:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap',
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
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        gtag: {
          trackingID: 'G-TCDDYEJE8H',
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
            'https://github.com/swiftadviser/ton-docs/tree/main/',
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
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/swiftadviser/ton-docs/tree/main/',
        },
        theme:
          {
            customCss: require.resolve('./src/css/custom.css'),
          },
      }),
    ],
  ],

  themeConfig:
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // algolia: {
      //   // The application ID provided by Algolia
      //   appId: 'EQK8VZ6CS7',
      //
      //   // Public API key: it is safe to commit it
      //   apiKey: '7b6c50af331e4e34d47f8b930a986ca1',
      //
      //   indexName: 'ton_docs',
      //
      //   // Optional: see doc section below
      //   contextualSearch: true,
      //
      //   // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
      //   // externalUrlRegex: 'external\\.com|domain\\.com',
      //
      //   // Optional: Algolia search parameters
      //   searchParameters: {},
      //
      //   // Optional: path for search page that enabled by default (`false` to disable it)
      //   searchPagePath: 'search',
      //
      //   //... other Algolia params
      // },

      announcementBar: {
        id: 'contribute/hacktoberfest',
        content:
          '🎃 <b>The HACKTOBERFEST event has already started! <a rel="noopener noreferrer" href="/hacktonberfest">Read more</a> about the event and rewards! 🎃</b>',
        backgroundColor: '#f4f0e1',
        textColor: 'rgba(181,58,37,1)',
        isCloseable: false,
      },

      image: 'img/preview.jpg',
      navbar: {
        title: '',
        logo: {
          alt: 'TON',
          src: 'img/ton_logo_light_background.svg',
          srcDark: 'img/ton_logo_dark_background.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'learn/introduction',
            position: 'left',
            label: '📚 Learn',
          },
          {
            type: 'doc',
            docId: 'develop/getting-started',
            position: 'left',
            label: '🛠 Develop',
          },
          // {
          //   type: 'doc',
          //   docId: 'develop/nodes/node-types',
          //   position: 'left',
          //   label: 'Integrate',
          // },
          {
            type: 'doc',
            docId: 'participate/README',
            position: 'left',
            label: '🚀 Participate',
          },
          // {
          //   type: 'doc',
          //   docId: 'intro',
          //   position: 'left',
          //   label: 'Integrate',
          // },

          {
            to: 'contribute',
            label: 'Contribute',
            position: 'right',
          },
          {
            to: 'https://answers.ton.org/',
            label: 'Q&A',
            position: 'right',
          },
          {
            to: 'https://t.me/TonDev_eng',
            label: 'Dev Chat',
            position: 'right',
          },
          {
            href: 'https://github.com/swiftadviser/ton-docs',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Use TON',
            items: [
              {
                label: 'Wallets',
                to: 'https://ton.org/wallets',
              },
              {
                label: 'Toncoin',
                to: 'https://ton.org/toncoin',
              },
              {
                label: 'Stake',
                to: 'https://tonvalidators.org/',
              },
              {
                label: 'Apps & Services',
                to: 'https://ton.app/',
              },
              {
                label: 'Bridge',
                to: 'https://ton.org/bridge/',
              },
              {
                label: 'Domains',
                to: 'https://dns.ton.org/',
              },
            ],
          },
          {
            title: 'Developers',
            items: [
              {
                label: 'Documentation',
                to: 'https://ton.org/docs',
              },
              {
                label: 'Explorers',
                to: 'https://ton.app/explorers',
              },
              {
                label: 'Bug Bounty',
                to: 'https://github.com/ton-blockchain/bug-bounty',
              },
              {
                label: 'Blockchain Analysis',
                to: 'https://ton.org/analysis',
              },
              {
                label: 'Validators',
                to: 'https://ton.org/validator',
              },
              {
                label: 'Roadmap',
                to: 'https://ton.org/roadmap',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'TON Overflow',
                to: 'https://answers.ton.org/',
              },
              {
                label: 'Dev Community Hub',
                to: 'https://t.me/tondev_eng',
              },
              {
                label: 'Events & Contests',
                to: 'https://ton.org/events',
              },
              {
                label: 'Sponsorships',
                to: 'https://ton.org/sponsorships',
              },
              {
                label: 'Grants',
                to: 'https://ton.org/grants',
              },
              {
                label: 'Careers',
                to: 'https://jobs.ton.org/',
              },
            ],
          },
        ],
      },
      prism: {
        // theme: darkCodeTheme,
        // darkTheme: darkCodeTheme,
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
          hideable: true,
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
