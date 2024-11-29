// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

require("dotenv").config();

const getEnvLangConfig = () => {
  const defaultLocale = process.env.DEFAULT_LOCALE || "en";

  const langArray = process.env.TARGET_LANGS
    ? process.env.TARGET_LANGS.split(",")
    : ["mandarin"];
  // : ["mandarin", "ru", "ko", "pl", "uk", "ja"];

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
function getCurrentYear() {
  const now = new Date();
  return now.getFullYear();
}

// show current year in text
const currentYear = getCurrentYear();

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'The Open Network',
  tagline: 'Mass adoption. Massive distribution',
  url: 'https://docs.ton.org',
  staticDirectories: ['public', 'static'],
  baseUrl: '/',
  themes: [
    '@docusaurus/theme-live-codeblock',
    ],
  plugins: [
    ['docusaurus-plugin-sass', {}],
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: require('./redirects'),
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
      // announcementBar: {
      //   // id: 'contribute/hacktoberfest',
      //   content: '<a rel="noopener noreferrer" target="_blank" href="https://society.ton.org/hack-ton-berfest-2023?utm_source=tondocs&utm_medium=top_banner&utm_campaign=promo"><span>The <b>HACK-TON-BERFEST 2023</b> event is near! Double-merch, NFT rewards and more!</span> <span class="mobile-view">Double-merch, NFT reward and more!</span></a>',
      //   textColor: '#F3F3F7',
      //   isCloseable: false,
      // },
      algolia: {
        // The application ID provided by Algolia
        appId: '3HQ0XHWRM0',
        // Public API key: it is safe to commit it
        apiKey: '7a0094aa048fd537a70a0aa90d86cdc8',
        indexName: 'ton',
        // Optional: see doc section below
        contextualSearch: true,

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',

        debug: false
      },

      image: 'img/snippet.png',
      navbar: require('./navbar'),
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
};

module.exports = config;
