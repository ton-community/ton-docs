// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'The Open Network',
  tagline: 'Mass adoption. Massive distribution',
  url: 'https://tonspace.co',
  staticDirectories: ['public', 'static'],
  baseUrl: '/',
  themes: ["@saucelabs/theme-github-codeblock"],
  stylesheets: [
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&family=Mulish:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap'
  ],
  onBrokenLinks: "warn", // for PRODUCTION
  onBrokenMarkdownLinks: "warn", //for PRODUCTION
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
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          breadcrumbs: false,
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
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
      algolia: {
        // The application ID provided by Algolia
        appId: 'YOUR_APP_ID',

        // Public API key: it is safe to commit it
        apiKey: 'YOUR_SEARCH_API_KEY',

        indexName: 'YOUR_INDEX_NAME',

        // Optional: see doc section below
        contextualSearch: true,

        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        externalUrlRegex: 'external\\.com|domain\\.com',

        // Optional: Algolia search parameters
        searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',

        //... other Algolia params
      },

      navbar: {
        title: '',
        logo: {
          alt: 'TON',
          src: 'img/ton_logo_light_background.svg',
          srcDark: 'img/ton_logo_dark_background.svg'
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
          {
            type: 'doc',
            docId: 'tools/README',
            position: 'left',
            label: 'Tools',
          },
          {
            type: 'doc',
            docId: 'validate/README',
            position: 'left',
            label: 'Validate',
          },
          {
            type: 'doc',
            docId: 'integrate/README',
            position: 'left',
            label: 'Integrate',
          },
          // {
          //   type: 'doc',
          //   docId: 'intro',
          //   position: 'left',
          //   label: 'Integrate',
          // },

          {
            to: 'docs/contribute',
            label: 'Contribute to Docs',
            position: 'right',
          },
          {
            href: 'https://t.me/TonDev_eng',
            label: 'Chat',
            position: 'right',
          },
          {
            href: 'https://github.com/facebook/docusaurus',
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
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/docusaurus',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/facebook/docusaurus',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} TON Foundation.`,
      },
      prism: {
        // theme: darkCodeTheme,
        // darkTheme: darkCodeTheme,
        additionalLanguages: [
          "java",
          "python",
          "go",
          "typescript",
        ],
      },
      docs: {
        sidebar: {
          hideable: true,
        }
      },
      colorMode: {
        defaultMode: 'light',
        // respectPrefersColorScheme: true,
        // disableSwitch: true,
      }
    }),
};

module.exports = config;
