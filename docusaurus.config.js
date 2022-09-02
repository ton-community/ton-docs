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
    '@saucelabs/theme-github-codeblock',
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
          lastVersion: '1.0.0',
          versions: {
            current: {
              path: 'next',
              banner: 'none',
              badge: false,
            },
            '1.0.0': {
              path: '/',
              banner: 'none',
              badge: false,
            }
          }
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/swiftadviser/ton-docs/tree/main/',
        },
        theme: {
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

      // announcementBar: {
      //   id: 'contribute/hacktoberfest',
      //   content:
      //     '🎃 <b>Hacktoberfest starts soon! <a target="_blank" rel="noopener noreferrer" href="/next/contribute/hacktoberfest">Read more</a> about prizes and prepare 🎃</b>',
      //   backgroundColor: '#f4f0e1',
      //   textColor: 'rgba(181,58,37,1)',
      //   isCloseable: false,
      // },

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
            label: 'Learn',
          },
          {
            type: 'doc',
            docId: 'develop/getting-started',
            position: 'left',
            label: 'Build',
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
            label: 'Participate',
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
            href: 'https://t.me/TonDev_eng',
            label: 'Chat',
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
                href: 'https://ton.org/wallets',
              },
              {
                label: 'Toncoin',
                href: 'https://ton.org/toncoin',
              },
              {
                label: 'Stake',
                href: 'https://tonvalidators.org/',
              },
              {
                label: 'Apps & Services',
                href: 'https://ton.app/',
              },
              {
                label: 'Bridge',
                href: 'https://ton.org/bridge/',
              },
              {
                label: 'Domains',
                href: 'https://dns.ton.org/',
              },
            ],
          },
          {
            title: 'Developers',
            items: [
              {
                label: 'Documentation',
                href: 'https://ton.org/docs',
              },
              {
                label: 'Explorers',
                href: 'https://ton.app/explorers',
              },
              {
                label: 'Bug Bounty',
                href: 'https://github.com/ton-blockchain/bug-bounty',
              },
              {
                label: 'Blockchain Analysis',
                href: 'https://ton.org/analysis',
              },
              {
                label: 'Validators',
                href: 'https://ton.org/validator',
              },
              {
                label: 'Roadmap',
                href: 'https://ton.org/roadmap',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/ton?tab=Newest',
              },
              {
                label: 'Dev Community',
                href: 'https://t.me/tondev_eng',
              },
              {
                label: 'Events & Contests',
                href: 'https://ton.org/events',
              },
              {
                label: 'Sponsorships',
                href: 'https://ton.org/sponsorships',
              },
              {
                label: 'Grants',
                href: 'https://ton.org/grants',
              },
              {
                label: 'Careers',
                href: 'https://jobs.ton.org/',
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
