// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'The Open Network',
  tagline: 'Mass adoption. Massive distribution',
  url: 'https://docs.ton.org',
  staticDirectories: ['public', 'static'],
  baseUrl: '/',
  themes: [
    '@docusaurus/theme-live-codeblock',
    // [
    //   require.resolve('@easyops-cn/docusaurus-search-local'),
    //   {
    //     // ... Your options.
    //     // `hashed` is recommended as long-term-cache of index file is possible.
    //     hashed: true,
    //     indexPages: true,
    //     indexBlog: false,
    //     searchBarShortcutHint: false,
    //     // For Docs using Chinese, The `language` is recommended to set to:
    //     // ```
    //     // language: ["en", "zh"],
    //     // ```
    //   },
    // ],
  ],
  plugins: [
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
            to: '/learn/tvm-instructions/tvm-overview',
            from: '/learn/tvm-instructions/tvm_overview',
          },
          {
            to: '/learn/overviews/ton-blockchain',
            from: '/learn/overviews/TON_Blockchain_overview',
          },
          {
            to: '/learn/overviews/tl-b-language',
            from: '/learn/overviews/TL-B_Language',
          },


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

          {
            to: '/develop/dapps/tutorials/accept-payments-in-a-telegram-bot',
            from: '/develop/dapps/payment-processing/accept-payments-in-a-telegram-bot',
          },
          {
            to: '/develop/dapps/tutorials/accept-payments-in-a-telegram-bot-2',
            from: '/develop/dapps/payment-processing/accept-payments-in-a-telegram-bot-2',
          },
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
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko'],
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
          showLastUpdateAuthor: false,
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
            [require('@docusaurus/remark-plugin-npm2yarn'), {sync: true}],
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
      //   id: 'contribute/hacktoberfest',
      //   content:
      //     '<a rel="noopener noreferrer" href="/hacktonberfest"><span>The HACKTOBERFEST event has already started!  Read more about the event and rewards! </span> <span class="mobile-view">Read more about The HACKTOBERFEST</span></a>',
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
            type: 'doc',
            docId: 'learn/introduction',
            position: 'left',
            label: 'Learn',
          },
          {
            type: 'doc',
            docId: 'develop/getting-started',
            position: 'left',
            label: 'Develop',
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
          {
            type: 'dropdown',
            label: 'Community',
            position: 'left',
            items: [
              {
                to: 'contribute',
                label: 'Contribute to Docs',
              },
              {
                to: 'https://answers.ton.org/',
                label: 'TON Overflow',
              },
              {
                to: 'https://t.me/TonDev_eng',
                label: 'TON Developers Chat',
              },
              {
                to: 'https://github.com/ton-blockchain/TEPs',
                label: 'Standards Discussion (TEPs)',
              },
            ],
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
            to: 'https://ton-blockchain.github.io/docs/#/',
            label: 'V 1.0',
            position: 'right',
          },
          {
            href: 'https://github.com/ton-community/ton-docs',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
          // {
          //   type: 'localeDropdown',
          //   position: 'right',
          // },
          //
        ],
      },
      footer: {
        // style: 'dark',
        links: [
          {
            items: [
              {
                html: `<!DOCTYPE html><html lang="en"> <head> <meta charSet="utf-8"/> <meta name="viewport" content="width=device-width"/> <meta name="next-head-count" content="2"/> </head><body class="preload"><div id="__next" data-reactroot=""> <footer class="Container Footer Footer--with-offset size--default"> <div class="Container__inner"> <div class="Footer__inner"> <div class="Footer__links"> <div class="HideByMediaBlock" style="--xsVisible:block;--preSVisible:block;--sVisible:block;--mVisible:block;--lVisible:none;--xlVisible:none;--xxlVisible:none"> <div class="Footer__col Footer__col--logo"> <a class="Logo Logo--dark" href="https://ton.org"> <div class="Logo__inner Logo__inner--large"> <svg width="100" height="32" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M45.0781 23.7138V12.2761H40.6758V9.21094H53.2862V12.2761H48.8838V23.7138H45.0781Z" fill="currentColor"></path> <path d="M53.6484 16.4518C53.6484 14.9432 53.9429 13.6335 54.533 12.5227C55.1225 11.3981 55.9659 10.5272 57.0633 9.91009C58.16 9.29295 59.456 8.98438 60.9513 8.98438C62.4594 8.98438 63.7625 9.29295 64.8599 9.91009C65.9566 10.5272 66.8 11.3981 67.3902 12.5227C67.9932 13.6335 68.2953 14.9432 68.2953 16.4518C68.2953 17.9466 67.9932 19.2564 67.3902 20.3809C66.8 21.5055 65.9566 22.3833 64.8599 23.0141C63.7625 23.6312 62.4594 23.9398 60.9513 23.9398C59.456 23.9398 58.16 23.6312 57.0633 23.0141C55.9794 22.3833 55.136 21.5055 54.533 20.3809C53.9429 19.2564 53.6484 17.9466 53.6484 16.4518ZM57.6187 16.4518C57.6187 17.3569 57.7422 18.1318 57.989 18.7764C58.2359 19.421 58.5991 19.9147 59.0793 20.2575C59.573 20.6004 60.1966 20.7718 60.9513 20.7718C62.0757 20.7718 62.9191 20.3946 63.4816 19.6404C64.0434 18.8724 64.325 17.8095 64.325 16.4518C64.325 15.5467 64.2016 14.7718 63.9547 14.1272C63.7079 13.4826 63.3305 12.9958 62.8233 12.6667C62.3296 12.3238 61.7054 12.1524 60.9513 12.1524C59.8263 12.1524 58.9899 12.5295 58.4416 13.2838C57.8926 14.0244 57.6187 15.0804 57.6187 16.4518Z" fill="currentColor"></path> <path d="M70.5742 23.7138V9.21094H73.3719L80.7159 18.3241H80.1194V9.21094H83.6371V23.7138H80.8394L73.5365 14.6007H74.1331V23.7138H70.5742Z" fill="currentColor"></path> <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#0088CC"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5489 10.5703H20.5228C20.8403 10.5703 21.1576 10.6169 21.4891 10.7715C21.8865 10.9567 22.0973 11.2488 22.2449 11.4647C22.2564 11.4815 22.2672 11.4988 22.2771 11.5165C22.4507 11.8256 22.5402 12.1592 22.5402 12.5181C22.5402 12.8592 22.459 13.2307 22.2771 13.5545C22.2754 13.5576 22.2736 13.5607 22.2718 13.5638L16.6022 23.3029C16.4772 23.5177 16.2471 23.6495 15.9986 23.6486C15.7501 23.6477 15.5209 23.5143 15.3974 23.2987L9.8319 13.5803C9.8303 13.5777 9.8287 13.575 9.8271 13.5724C9.69973 13.3625 9.50276 13.0379 9.4683 12.619C9.43664 12.2339 9.52321 11.8479 9.71676 11.5133C9.9103 11.1786 10.2017 10.9111 10.5521 10.7473C10.9279 10.5717 11.3087 10.5703 11.5489 10.5703ZM15.3054 11.9616H11.5489C11.3021 11.9616 11.2073 11.9768 11.1411 12.0078C11.0495 12.0505 10.9726 12.1208 10.9212 12.2098C10.8697 12.2988 10.8465 12.4019 10.8549 12.505C10.8598 12.5642 10.8839 12.6319 11.0261 12.8664C11.0291 12.8713 11.032 12.8763 11.0349 12.8813L15.3054 20.3384V11.9616ZM16.6967 11.9616V20.3752L21.0661 12.8695C21.1154 12.7799 21.1489 12.6504 21.1489 12.5181C21.1489 12.4109 21.1266 12.3177 21.0769 12.2217C21.0248 12.1467 20.993 12.107 20.9664 12.0798C20.9436 12.0565 20.9261 12.0441 20.9013 12.0325C20.798 11.9844 20.6922 11.9616 20.5228 11.9616H16.6967Z" fill="white"></path> </svg> </div><div class="Logo__inner Logo__inner--small"> <svg width="100" height="28" viewBox="0 0 100 28" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M40.433 19.6538V10.463H36.8955V8H47.0286V10.463H43.4911V19.6538H40.433Z" fill="currentColor"></path> <path d="M47.3193 14.0005C47.3193 12.7882 47.5559 11.7358 48.0301 10.8432C48.5038 9.93956 49.1816 9.23977 50.0634 8.74386C50.9446 8.24795 51.986 8 53.1876 8C54.3994 8 55.4465 8.24795 56.3283 8.74386C57.2096 9.23977 57.8873 9.93956 58.3615 10.8432C58.8461 11.7358 59.0889 12.7882 59.0889 14.0005C59.0889 15.2017 58.8461 16.2541 58.3615 17.1577C57.8873 18.0614 57.2096 18.7667 56.3283 19.2736C55.4465 19.7695 54.3994 20.0175 53.1876 20.0175C51.986 20.0175 50.9446 19.7695 50.0634 19.2736C49.1924 18.7667 48.5147 18.0614 48.0301 17.1577C47.5559 16.2541 47.3193 15.2017 47.3193 14.0005ZM50.5097 14.0005C50.5097 14.7278 50.6089 15.3504 50.8072 15.8684C51.0056 16.3864 51.2974 16.7831 51.6833 17.0586C52.08 17.3341 52.5811 17.4718 53.1876 17.4718C54.091 17.4718 54.7688 17.1687 55.2208 16.5627C55.6723 15.9455 55.8985 15.0915 55.8985 14.0005C55.8985 13.2731 55.7993 12.6505 55.601 12.1326C55.4026 11.6146 55.0994 11.2234 54.6918 10.9589C54.2951 10.6834 53.7935 10.5457 53.1876 10.5457C52.2836 10.5457 51.6115 10.8487 51.1709 11.4548C50.7297 12.0499 50.5097 12.8985 50.5097 14.0005Z" fill="currentColor"></path> <path d="M60.9209 19.6538V8H63.169L69.0703 15.3229H68.5909V8H71.4176V19.6538H69.1695L63.3013 12.3309H63.7806V19.6538H60.9209Z" fill="currentColor"></path> <path d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28Z" fill="#0088CC"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M10.1054 9.25H17.9576C18.2354 9.25 18.513 9.2908 18.8031 9.42605C19.1508 9.5881 19.3352 9.84365 19.4644 10.0326C19.4745 10.0473 19.4839 10.0625 19.4926 10.078C19.6445 10.3484 19.7228 10.6403 19.7228 10.9544C19.7228 11.2528 19.6518 11.5779 19.4926 11.8612C19.4911 11.8639 19.4895 11.8666 19.488 11.8693L14.5271 20.391C14.4177 20.5789 14.2163 20.6943 13.9989 20.6935C13.7814 20.6927 13.5809 20.576 13.4728 20.3873L8.60303 11.8837C8.60163 11.8815 8.60023 11.8791 8.59883 11.8768C8.48738 11.6932 8.31503 11.4092 8.28488 11.0426C8.25718 10.7056 8.33293 10.3679 8.50228 10.0751C8.67163 9.78225 8.92658 9.54815 9.23323 9.40485C9.56203 9.2512 9.89523 9.25 10.1054 9.25ZM13.3923 10.4674H10.1054C9.88943 10.4674 9.80653 10.4807 9.74858 10.5078C9.66843 10.5452 9.60113 10.6067 9.55613 10.6846C9.51113 10.7624 9.49078 10.8526 9.49818 10.9428C9.50243 10.9947 9.52353 11.0538 9.64798 11.2591C9.65058 11.2634 9.65313 11.2678 9.65563 11.2721L13.3923 17.797V10.4674ZM14.6097 10.4674V17.8293L18.433 11.2617C18.4761 11.1834 18.5054 11.0701 18.5054 10.9544C18.5054 10.8605 18.4859 10.779 18.4424 10.6949C18.3968 10.6294 18.369 10.5946 18.3457 10.5708C18.3258 10.5505 18.3104 10.5396 18.2887 10.5295C18.1983 10.4873 18.1058 10.4674 17.9576 10.4674H14.6097Z" fill="white"></path> </svg> </div></a> </div></div><div class="Footer__col"> <div class="Title Title--l-1 Title--t-footer Footer__col_header">Use TON</div><div class="Footer__col_links"> <div class="Footer__col_link_wrap"> <a class="Footer__col_link" href="https://ton.org/wallets"> <div class="Text Text--l-1 Text--t-default">Wallets</div></a> </div><div class="Footer__col_link_wrap"> <a class="Footer__col_link" href="https://ton.org/toncoin"> <div class="Text Text--l-1 Text--t-default">Toncoin</div></a> </div><div class="Footer__col_link_wrap"> <a class="Footer__col_link" target="_blank" rel="noreferrer noopener" href="https://tonvalidators.org"> <div class="Text Text--l-1 Text--t-default">Stake</div></a> </div><div class="Footer__col_link_wrap"> <a class="Footer__col_link" target="_blank" rel="noreferrer noopener" href="https://ton.app/"> <div class="Text Text--l-1 Text--t-default">Apps &amp; Services</div></a> </div><div class="Footer__col_link_wrap"> <a class="Footer__col_link" target="_blank" rel="noreferrer noopener" href="https://ton.org/bridge/"> <div class="Text Text--l-1 Text--t-default">Bridge</div></a> </div><div class="Footer__col_link_wrap"> <a class="Footer__col_link" target="_blank" rel="noreferrer noopener" href="https://dns.ton.org/"> <div class="Text Text--l-1 Text--t-default">Domains</div></a> </div></div></div><div class="Footer__col"> <div class="Title Title--l-1 Title--t-footer Footer__col_header">Learn</div><div class="Footer__col_links"> <div class="Footer__col_link_wrap"> <a class="Footer__col_link" href="https://ton.org/whitepaper.pdf"> <div class="Text Text--l-1 Text--t-default">White paper</div></a> </div><div class="Footer__col_link_wrap"> <a class="Footer__col_link" href="https://ton.org/analysis"> <div class="Text Text--l-1 Text--t-default">Blockchain analysis</div></a> </div><div class="Footer__col_link_wrap"> <a class="Footer__col_link" href="https://ton.org/validator"> <div class="Text Text--l-1 Text--t-default">Validators</div></a> </div><div class="Footer__col_link_wrap"> <a class="Footer__col_link" href="https://ton.org/mining"> <div class="Text Text--l-1 Text--t-default">Mining &amp; Givers</div></a> </div><div class="Footer__col_link_wrap"> <a class="Footer__col_link" href="https://ton.org/roadmap"> <div class="Text Text--l-1 Text--t-default">Roadmap</div></a> </div></div></div><div class="Footer__col"> <div class="Title Title--l-1 Title--t-footer Footer__col_header">Developers</div><div class="Footer__col_links"> <div class="Footer__col_link_wrap"> <a class="Footer__col_link" target="_blank" rel="noreferrer noopener" href="https://ton.org/dev"> <div class="Text Text--l-1 Text--t-default">Getting started</div></a> </div><div class="Footer__col_link_wrap"> <a class="Footer__col_link" target="_blank" rel="noreferrer noopener" href="https://ton.org/docs"> <div class="Text Text--l-1 Text--t-default">Documentation</div></a> </div><div class="Footer__col_link_wrap"> <a class="Footer__col_link" target="_blank" rel="noreferrer noopener" href="https://github.com/ton-blockchain"> <div class="Text Text--l-1 Text--t-default">GitHub</div></a> </div><div class="Footer__col_link_wrap"> <a class="Footer__col_link" target="_blank" rel="noreferrer noopener" href="https://t.me/tondev_eng"> <div class="Text Text--l-1 Text--t-default">Dev community</div></a> </div><div class="Footer__col_link_wrap"> <a class="Footer__col_link" target="_blank" rel="noreferrer noopener" href="https://github.com/ton-blockchain/bug-bounty"> <div class="Text Text--l-1 Text--t-default">Bug Bounty</div></a> </div></div></div><div class="Footer__col"> <div class="Title Title--l-1 Title--t-footer Footer__col_header">Community</div><div class="Footer__col_links"> <div class="Footer__col_link_wrap"> <a class="Footer__col_link" href="https://blog.ton.org"> <div class="Text Text--l-1 Text--t-default">Blog</div></a> </div <div class="Footer__col_link_wrap"> <a class="Footer__col_link" href="https://ton.org/community"> <div class="Text Text--l-1 Text--t-default">Join community</div></a> </div><div class="Footer__col_link_wrap"> <a class="Footer__col_link" href="https://ton.org/grants"> <div class="Text Text--l-1 Text--t-default">Grants</div></a> </div><div class="Footer__col_link_wrap"> <a class="Footer__col_link" href="https://ton.org/sponsorships"> <div class="Text Text--l-1 Text--t-default">Sponsorships</div></a> </div><div class="Footer__col_link_wrap"> <a class="Footer__col_link" target="_blank" rel="noreferrer noopener" href="https://jobs.ton.org"> <div class="Text Text--l-1 Text--t-default">Careers</div></a> </div><div class="Footer__col_link_wrap"> <a class="Footer__col_link" href="https://ton.org/events"> <div class="Text Text--l-1 Text--t-default">Events</div></a> </div></div><div class="Footer__col"> <div class="Title Title--l-1 Title--t-footer Footer__col_header">Tools</div><div class="Footer__col_links"> <div class="Footer__col_link_wrap"> <a class="Footer__col_link" target="_blank" rel="noreferrer noopener" href="https://tonmon.xyz/?orgId=1&amp;refresh=5m"> <div class="Text Text--l-1 Text--t-default">Network status</div></a> </div><div class="Footer__col_link_wrap"> <a class="Footer__col_link" target="_blank" rel="noreferrer noopener" href="https://ton.app/explorers"> <div class="Text Text--l-1 Text--t-default">Explorers</div></a> </div></div></div><div class="Footer__col"> <div class="Title Title--l-1 Title--t-footer Footer__col_header">Other</div><div class="Footer__col_links"> <div class="Footer__col_link_wrap"> <a class="Footer__col_link" target="_blank" rel="noreferrer noopener" href="https://t.me/ton_help_bot"> <div class="Text Text--l-1 Text--t-default">Support</div></a> </div><div class="Footer__col_link_wrap"> <a class="Footer__col_link" target="_blank" rel="noreferrer noopener" href="https://t.me/TonOrgBot"> <div class="Text Text--l-1 Text--t-default">Site feedback</div></a> </div><div class="Footer__col_link_wrap"> <a class="Footer__col_link" href="https://ton.org/brand-assets"> <div class="Text Text--l-1 Text--t-default">Brand assets</div></a> </div></div></div></div></div><div class="Footer__copyrights"> <div class="HideByMediaBlock" style="--xsVisible:none;--preSVisible:none;--sVisible:none;--mVisible:none;--lVisible:block;--xlVisible:block;--xxlVisible:block"> <a class="Logo Logo--dark" href="https://ton.org"> <div class="Logo__inner Logo__inner--large"> <svg width="100" height="32" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M45.0781 23.7138V12.2761H40.6758V9.21094H53.2862V12.2761H48.8838V23.7138H45.0781Z" fill="currentColor"></path> <path d="M53.6484 16.4518C53.6484 14.9432 53.9429 13.6335 54.533 12.5227C55.1225 11.3981 55.9659 10.5272 57.0633 9.91009C58.16 9.29295 59.456 8.98438 60.9513 8.98438C62.4594 8.98438 63.7625 9.29295 64.8599 9.91009C65.9566 10.5272 66.8 11.3981 67.3902 12.5227C67.9932 13.6335 68.2953 14.9432 68.2953 16.4518C68.2953 17.9466 67.9932 19.2564 67.3902 20.3809C66.8 21.5055 65.9566 22.3833 64.8599 23.0141C63.7625 23.6312 62.4594 23.9398 60.9513 23.9398C59.456 23.9398 58.16 23.6312 57.0633 23.0141C55.9794 22.3833 55.136 21.5055 54.533 20.3809C53.9429 19.2564 53.6484 17.9466 53.6484 16.4518ZM57.6187 16.4518C57.6187 17.3569 57.7422 18.1318 57.989 18.7764C58.2359 19.421 58.5991 19.9147 59.0793 20.2575C59.573 20.6004 60.1966 20.7718 60.9513 20.7718C62.0757 20.7718 62.9191 20.3946 63.4816 19.6404C64.0434 18.8724 64.325 17.8095 64.325 16.4518C64.325 15.5467 64.2016 14.7718 63.9547 14.1272C63.7079 13.4826 63.3305 12.9958 62.8233 12.6667C62.3296 12.3238 61.7054 12.1524 60.9513 12.1524C59.8263 12.1524 58.9899 12.5295 58.4416 13.2838C57.8926 14.0244 57.6187 15.0804 57.6187 16.4518Z" fill="currentColor"></path> <path d="M70.5742 23.7138V9.21094H73.3719L80.7159 18.3241H80.1194V9.21094H83.6371V23.7138H80.8394L73.5365 14.6007H74.1331V23.7138H70.5742Z" fill="currentColor"></path> <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#0088CC"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5489 10.5703H20.5228C20.8403 10.5703 21.1576 10.6169 21.4891 10.7715C21.8865 10.9567 22.0973 11.2488 22.2449 11.4647C22.2564 11.4815 22.2672 11.4988 22.2771 11.5165C22.4507 11.8256 22.5402 12.1592 22.5402 12.5181C22.5402 12.8592 22.459 13.2307 22.2771 13.5545C22.2754 13.5576 22.2736 13.5607 22.2718 13.5638L16.6022 23.3029C16.4772 23.5177 16.2471 23.6495 15.9986 23.6486C15.7501 23.6477 15.5209 23.5143 15.3974 23.2987L9.8319 13.5803C9.8303 13.5777 9.8287 13.575 9.8271 13.5724C9.69973 13.3625 9.50276 13.0379 9.4683 12.619C9.43664 12.2339 9.52321 11.8479 9.71676 11.5133C9.9103 11.1786 10.2017 10.9111 10.5521 10.7473C10.9279 10.5717 11.3087 10.5703 11.5489 10.5703ZM15.3054 11.9616H11.5489C11.3021 11.9616 11.2073 11.9768 11.1411 12.0078C11.0495 12.0505 10.9726 12.1208 10.9212 12.2098C10.8697 12.2988 10.8465 12.4019 10.8549 12.505C10.8598 12.5642 10.8839 12.6319 11.0261 12.8664C11.0291 12.8713 11.032 12.8763 11.0349 12.8813L15.3054 20.3384V11.9616ZM16.6967 11.9616V20.3752L21.0661 12.8695C21.1154 12.7799 21.1489 12.6504 21.1489 12.5181C21.1489 12.4109 21.1266 12.3177 21.0769 12.2217C21.0248 12.1467 20.993 12.107 20.9664 12.0798C20.9436 12.0565 20.9261 12.0441 20.9013 12.0325C20.798 11.9844 20.6922 11.9616 20.5228 11.9616H16.6967Z" fill="white"></path> </svg> </div><div class="Logo__inner Logo__inner--small"> <svg width="100" height="28" viewBox="0 0 100 28" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M40.433 19.6538V10.463H36.8955V8H47.0286V10.463H43.4911V19.6538H40.433Z" fill="currentColor"></path> <path d="M47.3193 14.0005C47.3193 12.7882 47.5559 11.7358 48.0301 10.8432C48.5038 9.93956 49.1816 9.23977 50.0634 8.74386C50.9446 8.24795 51.986 8 53.1876 8C54.3994 8 55.4465 8.24795 56.3283 8.74386C57.2096 9.23977 57.8873 9.93956 58.3615 10.8432C58.8461 11.7358 59.0889 12.7882 59.0889 14.0005C59.0889 15.2017 58.8461 16.2541 58.3615 17.1577C57.8873 18.0614 57.2096 18.7667 56.3283 19.2736C55.4465 19.7695 54.3994 20.0175 53.1876 20.0175C51.986 20.0175 50.9446 19.7695 50.0634 19.2736C49.1924 18.7667 48.5147 18.0614 48.0301 17.1577C47.5559 16.2541 47.3193 15.2017 47.3193 14.0005ZM50.5097 14.0005C50.5097 14.7278 50.6089 15.3504 50.8072 15.8684C51.0056 16.3864 51.2974 16.7831 51.6833 17.0586C52.08 17.3341 52.5811 17.4718 53.1876 17.4718C54.091 17.4718 54.7688 17.1687 55.2208 16.5627C55.6723 15.9455 55.8985 15.0915 55.8985 14.0005C55.8985 13.2731 55.7993 12.6505 55.601 12.1326C55.4026 11.6146 55.0994 11.2234 54.6918 10.9589C54.2951 10.6834 53.7935 10.5457 53.1876 10.5457C52.2836 10.5457 51.6115 10.8487 51.1709 11.4548C50.7297 12.0499 50.5097 12.8985 50.5097 14.0005Z" fill="currentColor"></path> <path d="M60.9209 19.6538V8H63.169L69.0703 15.3229H68.5909V8H71.4176V19.6538H69.1695L63.3013 12.3309H63.7806V19.6538H60.9209Z" fill="currentColor"></path> <path d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28Z" fill="#0088CC"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M10.1054 9.25H17.9576C18.2354 9.25 18.513 9.2908 18.8031 9.42605C19.1508 9.5881 19.3352 9.84365 19.4644 10.0326C19.4745 10.0473 19.4839 10.0625 19.4926 10.078C19.6445 10.3484 19.7228 10.6403 19.7228 10.9544C19.7228 11.2528 19.6518 11.5779 19.4926 11.8612C19.4911 11.8639 19.4895 11.8666 19.488 11.8693L14.5271 20.391C14.4177 20.5789 14.2163 20.6943 13.9989 20.6935C13.7814 20.6927 13.5809 20.576 13.4728 20.3873L8.60303 11.8837C8.60163 11.8815 8.60023 11.8791 8.59883 11.8768C8.48738 11.6932 8.31503 11.4092 8.28488 11.0426C8.25718 10.7056 8.33293 10.3679 8.50228 10.0751C8.67163 9.78225 8.92658 9.54815 9.23323 9.40485C9.56203 9.2512 9.89523 9.25 10.1054 9.25ZM13.3923 10.4674H10.1054C9.88943 10.4674 9.80653 10.4807 9.74858 10.5078C9.66843 10.5452 9.60113 10.6067 9.55613 10.6846C9.51113 10.7624 9.49078 10.8526 9.49818 10.9428C9.50243 10.9947 9.52353 11.0538 9.64798 11.2591C9.65058 11.2634 9.65313 11.2678 9.65563 11.2721L13.3923 17.797V10.4674ZM14.6097 10.4674V17.8293L18.433 11.2617C18.4761 11.1834 18.5054 11.0701 18.5054 10.9544C18.5054 10.8605 18.4859 10.779 18.4424 10.6949C18.3968 10.6294 18.369 10.5946 18.3457 10.5708C18.3258 10.5505 18.3104 10.5396 18.2887 10.5295C18.1983 10.4873 18.1058 10.4674 17.9576 10.4674H14.6097Z" fill="white"></path> </svg> </div></a> </div><div class="Caption Caption--l-1 Caption--t-footer Footer__copyrights_left"> <div class="Footer__copyrights_year">© 2022 TON Foundation</div></div><div class="Footer__copyrights_right"> <div class="Footer__networks"> <a href="https://www.linkedin.com/company/ton-blockchain/" class="Footer__network" target="_blank" rel="noreferrer noopener"> <div class="NetworkIcon NetworkIcon--large"> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C9.51472 3 7.26472 4.00736 5.63604 5.63604C4.00736 7.26472 3 9.51472 3 12C3 14.4853 4.00736 16.7353 5.63604 18.364C7.26472 19.9926 9.51472 21 12 21C14.4853 21 16.7353 19.9926 18.364 18.364C19.9926 16.7353 21 14.4853 21 12C21 9.51472 19.9926 7.26472 18.364 5.63604C16.7353 4.00736 14.4853 3 12 3ZM9.54314 15.8517V10.0479H7.61404V15.8517H9.54314V15.8517ZM8.57858 9.25543C9.2513 9.25543 9.67001 8.80975 9.67001 8.25279C9.65747 7.68329 9.2513 7.24998 8.59134 7.24998C7.93145 7.24998 7.5 7.68329 7.5 8.25279C7.5 8.80975 7.91862 9.25543 8.56601 9.25543H8.57855H8.57858ZM10.6094 15.8518H12.5385V12.6107C12.5385 12.4372 12.551 12.2639 12.6019 12.1399C12.7414 11.7933 13.0588 11.4344 13.5917 11.4344C14.2898 11.4344 14.569 11.9666 14.569 12.7469V15.8518H16.498V12.5239C16.498 10.7412 15.5462 9.91172 14.277 9.91172C13.2363 9.91172 12.7795 10.4934 12.5256 10.8896H12.5385V10.0479H10.6094C10.6347 10.5925 10.6094 15.8518 10.6094 15.8518H10.6094Z" fill="#C0D1D9"></path> </svg> </div></a> <a href="https://t.me/toncoin" class="Footer__network" target="_blank" rel="noreferrer noopener"> <div class="NetworkIcon NetworkIcon--large"> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect width="24" height="24" rx="12" fill="#98B2BF"></rect> <path d="M5.39368 11.7355C8.88334 10.1831 11.2103 9.15973 12.3746 8.66527C15.699 7.2535 16.3897 7.00826 16.84 7.00008C16.939 6.99838 17.1604 7.02344 17.3038 7.14226C17.4249 7.2426 17.4583 7.37813 17.4742 7.47325C17.4901 7.56838 17.51 7.78508 17.4942 7.9544C17.3141 9.88701 16.5346 14.5769 16.138 16.7415C15.9702 17.6574 15.6398 17.9645 15.3199 17.9945C14.6248 18.0599 14.0969 17.5255 13.4236 17.0749C12.3701 16.3697 11.7749 15.9308 10.7522 15.2427C9.57034 14.4475 10.3365 14.0104 11.01 13.2962C11.1863 13.1092 14.2492 10.2648 14.3084 10.0067C14.3159 9.97446 14.3227 9.85417 14.2527 9.79065C14.1828 9.72713 14.0794 9.74885 14.0049 9.76612C13.8992 9.79061 12.2162 10.9264 8.95566 13.1736C8.47792 13.5086 8.04521 13.6718 7.6575 13.6632C7.23009 13.6538 6.40793 13.4165 5.79673 13.2136C5.04708 12.9648 4.45127 12.8333 4.50315 12.4107C4.53017 12.1906 4.82702 11.9656 5.39368 11.7355Z" fill="white"></path> </svg> </div></a> <a href="https://github.com/ton-blockchain" class="Footer__network" target="_blank" rel="noreferrer noopener"> <div class="NetworkIcon NetworkIcon--large"> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect width="24" height="24" rx="12" fill="#98B2BF"></rect> <path fill-rule="evenodd" clip-rule="evenodd" d="M15.7112 23.4144C14.5424 23.7945 13.295 24 12 24C10.704 24 9.45585 23.7943 8.28636 23.4136C8.82659 23.4784 9.02622 23.1266 9.02622 22.8229C9.02622 22.6907 9.02396 22.4575 9.02094 22.1456C9.01745 21.7846 9.01294 21.3182 9.00972 20.7808C5.67147 21.5065 4.96722 19.1709 4.96722 19.1709C4.42197 17.784 3.63522 17.4147 3.63522 17.4147C2.54547 16.6694 3.71772 16.6846 3.71772 16.6846C4.92147 16.7694 5.55522 17.9221 5.55522 17.9221C6.62622 19.7572 8.36397 19.2274 9.04797 18.9196C9.15672 18.1436 9.46722 17.6143 9.80997 17.3142C7.14522 17.0111 4.34397 15.9813 4.34397 11.3799C4.34397 10.0687 4.81122 8.99704 5.57922 8.15715C5.45547 7.85327 5.04372 6.63288 5.69622 4.97947C5.69622 4.97947 6.70422 4.65671 8.99622 6.21032C9.95397 5.94382 10.98 5.81113 12.0007 5.80571C13.02 5.81094 14.0467 5.94382 15.0052 6.21032C17.2957 4.65671 18.3015 4.97947 18.3015 4.97947C18.9562 6.63288 18.5445 7.85327 18.4207 8.15715C19.1902 8.99704 19.6545 10.0687 19.6545 11.3799C19.6545 15.9925 16.8487 17.0081 14.1757 17.3052C14.6062 17.676 14.9902 18.4084 14.9902 19.529C14.9902 20.6025 14.9835 21.537 14.9791 22.1563C14.9769 22.4631 14.9752 22.6925 14.9752 22.8231C14.9752 23.1282 15.17 23.4807 15.7112 23.4144Z" fill="white"></path> </svg> </div></a> <a href="https://twitter.com/ton_blockchain" class="Footer__network" target="_blank" rel="noreferrer noopener"> <div class="NetworkIcon NetworkIcon--large"> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect width="24" height="24" rx="12" fill="#98B2BF"></rect> <path d="M17.8812 9.40625C17.8812 9.5375 17.8812 9.66875 17.8812 9.78125C17.8812 13.6625 14.9187 18.1437 9.51875 18.1437C7.85 18.1437 6.3125 17.6562 5 16.8312C5.225 16.85 5.46875 16.8687 5.69375 16.8687C7.0625 16.8687 8.3375 16.4 9.35 15.6125C8.05625 15.5937 6.96875 14.7312 6.6125 13.5687C6.8 13.6062 6.96875 13.625 7.175 13.625C7.4375 13.625 7.7 13.5875 7.94375 13.5125C6.59375 13.25 5.58125 12.0687 5.58125 10.6437C5.58125 10.625 5.58125 10.625 5.58125 10.6062C5.975 10.8312 6.425 10.9625 6.9125 10.9812C6.125 10.4562 5.6 9.55625 5.6 8.525C5.6 7.98125 5.75 7.475 5.99375 7.04375C7.4375 8.825 9.6125 9.9875 12.05 10.1187C11.9937 9.9125 11.975 9.66875 11.975 9.44375C11.975 7.8125 13.2875 6.5 14.9187 6.5C15.7625 6.5 16.5312 6.85625 17.0562 7.41875C17.7312 7.2875 18.35 7.04375 18.9312 6.70625C18.7062 7.4 18.2375 7.9625 17.6375 8.3375C18.2375 8.2625 18.8 8.1125 19.325 7.86875C18.95 8.46875 18.4625 8.99375 17.8812 9.40625Z" fill="white"></path> </svg> </div></a> <a href="mailto:press@ton.org" class="Footer__network" target="_blank" rel="noreferrer noopener"> <div class="NetworkIcon NetworkIcon--large"> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="12" cy="12" r="12" fill="#98B2BF"></circle> <path d="M12.0033 11.3576L17.409 8.18617C17.0931 7.71875 16.5675 7.43669 16.0033 7.43188H8.00332C7.4362 7.43164 6.90566 7.71188 6.58618 8.18046L12.0033 11.3576Z" fill="white"></path> <path d="M12.5748 12.3404C12.4012 12.4411 12.2041 12.4944 12.0033 12.4947C11.8031 12.4961 11.6061 12.4449 11.4319 12.3461L6.28906 9.33472V14.8604C6.28906 15.8072 7.05657 16.5747 8.00335 16.5747H16.0033C16.9501 16.5747 17.7176 15.8072 17.7176 14.8604V9.33472L12.5748 12.3404Z" fill="white"></path> </svg> </div></a> </div></div></div></div></div></footer></div></body><style>.Footer{padding-top:24px}@media(max-width:833px){.Footer{padding-top:20px}}.Footer--with-offset{margin-top:100px}@media(max-width:1279px){.Footer--with-offset{margin-top:78px}}@media(max-width:833px){.Footer--with-offset{margin-top:52px}}.Footer--with-small-offset{margin-top:46px}@media(max-width:1439px){.Footer--with-small-offset{margin-top:26px}}@media(max-width:833px){.Footer--with-small-offset{margin-top:16px}}.Footer .Logo{margin-top:-3px}@media(max-width:733px){.Footer .Logo{margin-top:0;margin-left:2px}}@media(max-width:413px){.Footer .Logo{margin-left:-2px}}.Footer .Logo__inner--large{display:block}@media(max-width:1023px){.Footer .Logo__inner--large{display:none}}.Footer .Logo__inner--small{display:none}@media(max-width:1023px){.Footer .Logo__inner--small{display:block}}.Footer__links{position:relative;display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;padding-bottom:38px}@media(max-width:1439px){.Footer__links{padding-bottom:22px}}@media(max-width:1279px){.Footer__links{padding-bottom:24px}}@media(max-width:733px){.Footer__links{justify-content:space-between;margin:0 0 -24px;padding-top:50px}}.Footer__col{box-sizing:border-box;width:13.0666666667%}@media(max-width:1279px){.Footer__col{width:14.1666666667%}}@media(max-width:733px){.Footer__col{width:48%;margin-bottom:24px;padding:0}.Footer__col--logo{position:absolute;top:0;left:0}}.Footer__col_header{font-weight:700;font-size:18px}@media(max-width:1279px){.Footer__col_header{font-size:16px}}.Footer__col_link_wrap{margin-top:2px}@media(max-width:1279px){.Footer__col_link_wrap{margin-top:4px}}@media(max-width:733px){.Footer__col_link_wrap{margin-top:8px}}.Footer__col_link{color:var(--text_light_secondary)}.Footer__col_link .Text{font-size:15px}@media(max-width:1023px){.Footer__col_link .Text{font-size:14px}}@media(max-width:733px){.Footer__col_link .Text{font-size:16px}}.Footer__copyrights{display:flex;align-items:center;justify-content:space-between;padding:24px 0 40px;border-top:1px solid var(--separator_light)}@media(max-width:1279px){.Footer__copyrights{padding:26px 0 46px}}@media(max-width:1023px){.Footer__copyrights{padding:16px 0 36px}}@media(max-width:733px){.Footer__copyrights{flex-direction:row;align-items:flex-start;padding-top:24px}}.Footer__copyrights_left{display:flex;align-items:center;margin-top:-3px}.Footer__copyrights_left,.Footer__copyrights_left a{color:var(--text_light_secondary)}.Footer__networks{display:flex;align-items:flex-start;margin:0 -6px}@media(max-width:1279px){.Footer__networks{margin:0 -6px}}@media(max-width:733px){.Footer__networks{margin:0 -4px}}.Footer__network{margin:0 6px;color:var(--icon_light_thirdly)}@media(max-width:1279px){.Footer__network{margin:0 6px}}@media(max-width:733px){.Footer__network{margin:0 4px}}.Footer__col_link,.Footer__copyrights_link{cursor:pointer;transition:color .2s ease-in-out,background-color .2s ease-in-out,opacity .2s ease-in-out}@media screen and (min-width:1000px){.Footer__col_link:hover,.Footer__copyrights_link:hover{color:var(--button_light_primary)}}.Footer__network{cursor:pointer;transition:color .2s ease-in-out,background-color .2s ease-in-out,opacity .2s ease-in-out}@media screen and (min-width:1000px){.Footer__network:hover{color:var(--ton_blue)}}.Button{box-sizing:border-box;display:inline-block;padding:0;border:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;text-align:center;cursor:pointer;background:none;transform:translateZ(0);overflow:hidden;max-width:100%;text-overflow:ellipsis;white-space:nowrap}.Button:disabled{pointer-events:none}.Button--round{border-radius:40px}.Button--m-primary{padding:16px 32px}@media(max-width:1279px){.Button--m-primary{padding:16px 24px}}@media(max-width:733px){.Button--m-primary{padding:12px 16px}}.Button--m-primary.Button--s-light{color:var(--default_white);background-color:var(--button_dark_primary);cursor:pointer;transition:color .2s ease-in-out,background-color .2s ease-in-out,opacity .2s ease-in-out}@media screen and (min-width:1000px){.Button--m-primary.Button--s-light:hover{background-color:var(--button_light_primary_hover)}.Button--m-primary.Button--s-light:active{background-color:var(--button_light_primary_pressed)}.Button--m-primary.Button--s-light:disabled{opacity:.2}}.Button--m-primary.Button--s-dark{color:var(--default_white);background-color:var(--button_dark_primary);cursor:pointer;transition:color .2s ease-in-out,background-color .2s ease-in-out,opacity .2s ease-in-out}@media screen and (min-width:1000px){.Button--m-primary.Button--s-dark:hover{background-color:var(--button_dark_primary_hover)}.Button--m-primary.Button--s-dark:active{background-color:var(--button_dark_primary_pressed)}.Button--m-primary.Button--s-dark:disabled{opacity:.5}}.Button--size-small{padding:1px 12px;border-radius:24px;line-height:24px;font-weight:500;font-size:16px}@media(max-width:1279px){.Button--size-small{padding:2px 12px}}.Button--m-primary.Button--size-small{background:var(--button_light_primary_small)}.Button--m-primary.Button--size-small.Button--s-light{color:var(--button_light_primary);background-color:var(--button_light_primary_small);cursor:pointer;transition:color .2s ease-in-out,background-color .2s ease-in-out,opacity .2s ease-in-out}@media screen and (min-width:1000px){.Button--m-primary.Button--size-small.Button--s-light:hover{background-color:var(--button_light_primary_small_hover)}.Button--m-primary.Button--size-small.Button--s-light:active{background-color:var(--button_light_primary_small_pressed)}.Button--m-primary.Button--size-small.Button--s-light:disabled{opacity:.2}}.Button--m-secondary:disabled{opacity:.5}.Button--m-secondary.Button--s-light{padding:8px 20px;color:var(--ton_blue);background-color:var(--background_light_main);cursor:pointer;transition:color .2s ease-in-out,background-color .2s ease-in-out,opacity .2s ease-in-out}@media screen and (min-width:1000px){.Button--m-secondary.Button--s-light:hover{background-color:var(--background_light_main)}.Button--m-secondary.Button--s-light:active{color:var(--button_dark_text);background-color:var(--button_light_secondary_pressed)}}.Button--m-secondary.Button--s-dark{padding:16px 32px;color:var(--default_white);background-color:var(--button_dark_secondary);cursor:pointer;transition:color .2s ease-in-out,background-color .2s ease-in-out,opacity .2s ease-in-out}@media(max-width:1279px){.Button--m-secondary.Button--s-dark{padding:16px 24px}}@media(max-width:733px){.Button--m-secondary.Button--s-dark{padding:12px 16px}}@media screen and (min-width:1000px){.Button--m-secondary.Button--s-dark:hover{background-color:var(--button_dark_secondary_hover)}.Button--m-secondary.Button--s-dark:active{background-color:var(--button_dark_secondary_pressed)}}.Button--m-secondary-long:disabled{opacity:.5}.Button--m-secondary-long.Button--s-light{padding:16px 32px;color:var(--ton_blue);background-color:var(--background_light_main);cursor:pointer;transition:color .2s ease-in-out,background-color .2s ease-in-out,opacity .2s ease-in-out}@media screen and (min-width:1000px){.Button--m-secondary-long.Button--s-light:hover{opacity:.72}}@media(max-width:1279px){.Button--m-secondary-long.Button--s-light{padding:16px 24px}}@media(max-width:733px){.Button--m-secondary-long.Button--s-light{padding:12px 16px}}@media screen and (min-width:1000px){.Button--m-secondary-long.Button--s-light:hover{background-color:var(--background_light_main)}.Button--m-secondary-long.Button--s-light:active{color:var(--button_dark_text);background-color:var(--button_light_secondary_pressed)}}.Button--m-secondary-long.Button--s-dark{padding:16px 32px;color:var(--default_white);background-color:var(--button_dark_secondary);cursor:pointer;transition:color .2s ease-in-out,background-color .2s ease-in-out,opacity .2s ease-in-out}@media(max-width:1279px){.Button--m-secondary-long.Button--s-dark{padding:16px 24px}}@media(max-width:733px){.Button--m-secondary-long.Button--s-dark{padding:12px 16px}}@media screen and (min-width:1000px){.Button--m-secondary-long.Button--s-dark:hover{background-color:var(--button_dark_secondary_hover)}.Button--m-secondary-long.Button--s-dark:active{background-color:var(--button_dark_secondary_pressed)}}.Button--m-secondary-long-long{padding:16px 32px}.Button--m-secondary-text{border-radius:0}.Button--m-secondary-text.Button--s-light{color:var(--button_light_primary);cursor:pointer;transition:color .2s ease-in-out,background-color .2s ease-in-out,opacity .2s ease-in-out}@media screen and (min-width:1000px){.Button--m-secondary-text.Button--s-light:hover{color:var(--button_light_primary_hover)}.Button--m-secondary-text.Button--s-light:active{color:var(--button_light_primary_pressed)}.Button--m-secondary-text.Button--s-light:disabled{opacity:.2}}.Button--m-secondary-text.Button--s-dark{color:var(--button_dark_text);cursor:pointer;transition:color .2s ease-in-out,background-color .2s ease-in-out,opacity .2s ease-in-out}@media screen and (min-width:1000px){.Button--m-secondary-text.Button--s-dark:hover{color:var(--button_dark_secondary_text_hover)}.Button--m-secondary-text.Button--s-dark:active{color:var(--button_dark_secondary_text_pressed)}.Button--m-secondary-text.Button--s-dark:disabled{opacity:.5}}.Button--m-secondary-text-overlay{border-radius:0}.Button--m-secondary-text-overlay.Button--s-dark{color:var(--default_white);cursor:pointer;transition:color .2s ease-in-out,background-color .2s ease-in-out,opacity .2s ease-in-out}@media screen and (min-width:1000px){.Button--m-secondary-text-overlay.Button--s-dark:hover{opacity:.72}.Button--m-secondary-text-overlay.Button--s-dark:active{opacity:.64}}.Button--m-secondary-outline:disabled,.Button--m-secondary-text-overlay.Button--s-dark:disabled{opacity:.5}.Button--m-secondary-outline.Button--s-light{color:var(--default_white);background-color:transparent;cursor:pointer;transition:color .2s ease-in-out,background-color .2s ease-in-out,opacity .2s ease-in-out}@media screen and (min-width:1000px){.Button--m-secondary-outline.Button--s-light:hover{background-color:transparent;opacity:.7}}.Button--m-menu{border-radius:0}.Button--m-menu.Button--s-dark{color:var(--black);cursor:pointer;transition:color .2s ease-in-out,background-color .2s ease-in-out,opacity .2s ease-in-out}@media screen and (min-width:1000px){.Button--m-menu.Button--s-dark:hover{color:var(--button_light_primary_hover)}.Button--m-menu.Button--s-dark:active{color:var(--button_light_primary_pressed)}.Button--m-menu.Button--s-dark:disabled{opacity:.2}}.Button__inner{display:flex;align-items:center;justify-content:center;width:100%}.Button__before{margin-right:8px}.Button__before--arrow{margin:0}.Button__after{margin-left:5px}.Button__after--arrow{margin:0}a.Button{display:inline-flex}.Title{font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;font-weight:800}.Title--l-1{font-size:72px;line-height:88px}@media(max-width:1279px){.Title--l-1{font-size:48px;line-height:56px}}@media(max-width:833px){.Title--l-1{font-size:34px;line-height:44px}}.Title--l-2{font-size:56px;line-height:64px}@media(max-width:1023px){.Title--l-2{font-size:40px;line-height:48px}}@media(max-width:733px){.Title--l-2{font-size:32px;line-height:40px}}.Title--l-3{font-size:48px;line-height:56px}@media(max-width:1279px){.Title--l-3{font-size:36px;line-height:40px}}@media(max-width:833px){.Title--l-3{font-size:28px;line-height:36px}}.Title--l-4{font-size:28px;line-height:38px}@media(max-width:1439px){.Title--l-4{line-height:36px}}@media(max-width:1279px){.Title--l-4{font-size:24px;line-height:32px}}@media(max-width:833px){.Title--l-4{font-size:20px}}@media(max-width:733px){.Title--l-4{font-size:18px}}@media(max-width:413px){.Title--l-4{font-size:16px;line-height:24px}}.Title--l-5{font-size:24px;line-height:32px}@media(max-width:1279px){.Title--l-5{font-size:20px;line-height:28px}}@media(max-width:833px){.Title--l-5{font-size:18px}}.Title--l-6{font-size:20px;line-height:30px}@media(max-width:733px){.Title--l-6{font-size:14px}}.Title--t-alternative.Title--l-3{font-size:48px;line-height:56px}@media(max-width:1023px){.Title--t-alternative.Title--l-3{font-size:36px;line-height:40px}}@media(max-width:733px){.Title--t-alternative.Title--l-3{font-size:28px;line-height:36px}}.Title--t-footer{font-size:18px;font-weight:700;line-height:28px}@media(max-width:1279px){.Title--t-footer{font-size:16px;line-height:24px}}.Title--t-developer{font-weight:700;font-family:IBMPlexMono,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif}.Text{font-weight:400}.Text--l-1{font-size:20px;line-height:30px}@media(max-width:1279px){.Text--l-1{font-size:16px;line-height:24px}}.Text--l-2{font-size:16px;line-height:24px}@media(max-width:833px){.Text--l-2{line-height:20px}}.Text--t-default{font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif}.Text--t-developer{font-family:IBMPlexMono,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif}.Text--t-secondary{color:var(--text_light_secondary)}.Text__fluid{width:100%}.Text__bold{font-weight:700}.Headline--l-1{font-size:24px;font-weight:800;line-height:32px}@media(max-width:1279px){.Headline--l-1{font-size:20px;line-height:28px}}@media(max-width:833px){.Headline--l-1{font-size:18px}}.Headline--l-2{font-size:20px;font-weight:800;line-height:30px}@media(max-width:1279px){.Headline--l-2{font-size:18px;line-height:28px}}@media(max-width:833px){.Headline--l-2{font-size:16px;line-height:24px}}.Headline--l-2.Headline--t-developer{font-size:28px;font-weight:700;line-height:36px}@media(max-width:833px){.Headline--l-2.Headline--t-developer{font-size:18px;line-height:28px}}.Headline--t-default{font-family:Mulish,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif}.Headline--t-developer{font-family:IBMPlexMono,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif}.Caption{font-family:Mulish,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif}.Caption--l-1{font-weight:500;font-size:14px;line-height:20px}@media(max-width:833px){.Caption--l-1{font-size:10px;line-height:14px}}.Caption--t-footer{font-size:14px;line-height:24px}@media(max-width:1023px){.Caption--t-footer{font-size:12px}}@media(max-width:733px){.Caption--t-footer{line-height:20px}}.Caption--t-secondary{color:var(--text_light_secondary)}.BigNumbers{font-family:Mulish,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;font-weight:700;font-size:40px;line-height:56px}@media(max-width:1279px){.BigNumbers{font-size:28px;line-height:38px}}@media(max-width:833px){.BigNumbers{font-size:28px;line-height:36px}}.ButtonText.ellipsis{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.ButtonText--l-1{font-size:18px;line-height:32px;font-weight:800}@media(max-width:1279px){.ButtonText--l-1{font-size:15px;line-height:24px}}@media(max-width:833px){.ButtonText--l-1{font-size:14px}}.ButtonText--l-2{font-size:18px;line-height:28px;font-weight:700}@media(max-width:833px){.ButtonText--l-2{font-size:14px}}.ButtonText--t-default,.ButtonText--t-menu{font-family:Mulish,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;font-weight:700}.ButtonText--t-menu.ButtonText--l-1{font-size:18px;line-height:32px}@media(max-width:833px){.ButtonText--t-menu.ButtonText--l-1{line-height:28px}}.ButtonText--t-menu.ButtonText--l-2{font-size:18px;line-height:24px}@media(max-width:833px){.ButtonText--t-menu.ButtonText--l-2{font-size:16px;line-height:22px}}.ButtonText--t-developer{font-family:IBMPlexMono,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;font-weight:700}.ButtonText--t-badge{font-weight:700}.Badge__inner{font-size:18px;font-weight:500;line-height:20px;box-sizing:border-box;display:inline-block;margin-bottom:16px;padding:3px 11px;text-align:center;text-transform:uppercase;color:var(--text_light_secondary);border:1px solid var(--text_light_secondary);border-radius:8px}@media(max-width:1023px){.Badge__inner{font-size:16px;margin-bottom:8px;padding:1px 10px}}@media(max-width:833px){.Badge__inner{margin-bottom:4px}}@media(max-width:733px){.Badge__inner{margin-bottom:16px;margin-bottom:8px}}.Container,.Container__inner{box-sizing:border-box;width:100%}.Container__inner{max-width:calc(100% - 32px);min-width:calc(100% - 32px);margin:0 auto}@media(min-width:734px){.Container__inner{max-width:calc(100% - 80px);min-width:calc(100% - 80px)}}@media(min-width:1024px){.Container__inner{max-width:936px;min-width:936px}}@media(min-width:1280px){.Container__inner{max-width:1120px;min-width:1120px}}.Container.size--small .Container__inner{max-width:calc(100% - 32px);min-width:calc(100% - 32px)}@media(min-width:734px){.Container.size--small .Container__inner{max-width:calc(100% - 80px - 64px - (100% - 80px - 176px)/12*4);min-width:calc(100% - 80px - 64px - (100% - 80px - 176px)/12*4)}}@media(min-width:1024px){.Container.size--small .Container__inner{max-width:616px;min-width:616px}}@media(min-width:1280px){.Container.size--small .Container__inner{max-width:736px;min-width:736px}}.Note{position:relative;margin:48px 0;padding:10px 45px 10px 24px;color:var(--text_light_secondary);background-color:var(--background_light_main)}@media(max-width:1023px){.Note{margin:32px 0;padding:8px 24px}}@media(max-width:833px){.Note{margin:24px 0;padding:10px 16px}}.Note:before{position:absolute;top:0;left:0;display:block;width:4px;height:100%;content:"";border-radius:10px;background-color:var(--ton_blue)}.Note--m-lastBlock{margin:48px 0 0}@media(max-width:1023px){.Note--m-lastBlock{margin:32px 0 0}}@media(max-width:833px){.Note--m-lastBlock{margin:24px 0 0}}.TabsItem{position:relative;display:inline-block;padding-bottom:11px;text-align:center;margin-bottom:-2px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;transition:color .2s ease-in-out,background-color .2s ease-in-out,opacity .2s ease-in-out}.TabsItem:before{position:absolute;bottom:0;left:0;display:block;width:100%;height:3px;content:"";border-radius:10px;background-color:transparent;transition:background-color .2s ease-in-out}.TabsItem+.TabsItem{margin-left:40px}@media(max-width:1023px){.TabsItem+.TabsItem{margin-left:16px}}.TabsItem--active:before{background-color:var(--button_dark_text)}.TabsItem--light{color:var(--text_light_secondary)}.TabsItem--light.TabsItem--active{color:var(--text_light_primary)}.TabsItem--dark{color:var(--text_dark_secondary)}.TabsItem--dark.TabsItem--active{color:var(--text_dark_primary)}@media screen and (min-width:1000px){.TabsItem:not(.TabsItem--active):active:before,.TabsItem:not(.TabsItem--active):hover:before{background-color:var(--button_dark_secondary_hover)}}@media(max-width:1279px){.NetworkIcon--large{display:none}}.NetworkIcon--small{display:none}@media(max-width:1279px){.NetworkIcon--small{display:block}}.Logo{position:relative;cursor:pointer;transition:color .2s ease-in-out}.Logo,.Logo__inner{display:block}@media(max-width:1279px){.Logo__inner--large{display:none}}.Logo__inner--small{display:none}@media(max-width:1279px){.Logo__inner--small{display:block}}.Logo--dark{color:var(--default_black)}.Logo--light{color:var(--default_white)}@-webkit-keyframes shine-lines{0%{background-position:-400px}to{background-position:440px}}@keyframes shine-lines{0%{background-position:-400px}to{background-position:440px}}.HideByMediaBlock{display:var(--xxlVisible)}@media(max-width:1439px){.HideByMediaBlock{display:var(--xxlVisible)}}@media(max-width:1279px){.HideByMediaBlock{display:var(--xlVisible)}}@media(max-width:1023px){.HideByMediaBlock{display:var(--lVisible)}}@media(max-width:833px){.HideByMediaBlock{display:var(--mVisible)}}@media(max-width:733px){.HideByMediaBlock{display:var(--sVisible)}}@media(max-width:568px){.HideByMediaBlock{display:var(--preSVisible)}}@media(max-width:413px){.HideByMediaBlock{display:var(--xsVisible)}}@-webkit-keyframes shine-lines{0%{background-position:-400px}to{background-position:440px}}@keyframes shine-lines{0%{background-position:-400px}to{background-position:440px}}.TooltipContainer{position:absolute;top:0;left:0;right:0;bottom:0}.tooltipItem{position:absolute;top:0;left:0;min-width:100px;min-height:40px;width:-webkit-max-content;width:-moz-max-content;width:max-content;height:-webkit-max-content;height:-moz-max-content;height:max-content;z-index:10000000;box-sizing:border-box;transition:opacity .2s ease-in-out,transform .2s ease-in-out,visibility .2s ease-in-out}.tooltipItem__inner{padding:12px;border-radius:14px;position:relative;background:var(--default_white)}@media(max-width:833px){.tooltipItem__inner{font-size:12px}}.tooltipItem__inner--default{padding:12px;background:var(--modal_tooltip);box-shadow:0 0 2px rgba(0,0,0,.08),0 2px 24px rgba(0,0,0,.08)}.tooltipItem.showArrow .tooltipItem__inner--comics:after{content:""}.tooltipItem__inner--comics{padding:16px;max-width:400px;border-radius:16px;background:var(--default_white);box-shadow:0 4px 24px rgba(0,0,0,.08);border:1px solid rgba(114,138,150,.12);box-sizing:border-box}@media(max-width:733px){.tooltipItem__inner--comics{max-width:200px}}.tooltipItem__inner--comics:after{position:absolute;left:calc(100% - 7px);top:calc(var(--comics-height)/2 - 6px);transform:rotate(45deg);background:#fff;border-color:rgba(114,138,150,.12) rgba(114,138,150,.12) #fff #fff;border-style:solid;border-width:1px;height:12px;width:12px;border-radius:0 2px 0 0;z-index:2}.tooltipItem--hor-right-after .tooltipItem__inner--comics:after{left:-7px;border-color:#fff #fff rgba(114,138,150,.12) rgba(114,138,150,.12);border-style:solid;border-width:1px;border-radius:0 0 0 2px}.tooltipItem--hor-center.tooltipItem--ver-top .tooltipItem__inner--comics:after{left:50%;top:calc(100% - 7px);border-color:#fff rgba(114,138,150,.12) rgba(114,138,150,.12) #fff;border-style:solid;border-width:1px;border-radius:0 0 2px 0}.tooltipItemContainer{width:16px;display:inline-flex;height:16px;position:relative;padding:0 0 0 2px}.tooltipItemContainer button{position:absolute;bottom:-2px}@-webkit-keyframes inAnimation{0%{opacity:0}to{opacity:1}}@-webkit-keyframes outAnimation{0%{opacity:1}to{opacity:0}}.modalContainer{right:0;bottom:0}.modalContainer,.modalItem{position:absolute;top:0;left:0}.modalItem{min-width:100px;min-height:40px;width:-webkit-max-content;width:-moz-max-content;width:max-content;height:-webkit-max-content;height:-moz-max-content;height:max-content;z-index:10000000;box-sizing:border-box;transition:opacity .2s ease-in-out,transform .2s ease-in-out,visibility .2s ease-in-out}.modalItem__inner{padding:12px;border-radius:14px;position:relative;background:var(--default_white)}@media(max-width:833px){.modalItem__inner{font-size:12px}}.modalItem__inner--full-screen{background:#3f3f43;padding:0 40px 40px;border-radius:24px;box-shadow:0 4px 24px rgba(0,0,0,.08);border:1px solid rgba(114,138,150,.12);box-sizing:border-box;width:var(--full-screen-modal-width);max-height:var(--full-screen-modal-height);overflow-y:scroll}@media(max-width:1279px){.modalItem__inner--full-screen{padding:0 30px 32px}}@media(max-width:833px){.modalItem__inner--full-screen{padding:0 24px 24px}}.modalShadowBg{width:100%;height:100%;position:absolute;left:0;background:rgba(35,35,40,.8);z-index:10}.modalItem__head{position:-webkit-sticky;position:sticky;top:0;display:flex;justify-content:space-between;align-items:center;margin-bottom:32px;background:#3f3f43;padding-top:40px;z-index:10;transition:padding .2s ease-in-out}.modalItem__head--m-scrolled{padding-top:24px;padding-bottom:24px}@media(max-width:1279px){.modalItem__head--m-scrolled{padding-top:32px}}@media(max-width:833px){.modalItem__head--m-scrolled{padding-top:24px}}@media(max-width:1279px){.modalItem__head{padding-top:32px}}@media(max-width:833px){.modalItem__head{padding-top:24px}}@media(max-width:1279px){.modalItem__head{margin-bottom:24px}}.modalExitIcon{width:24px;height:24px;cursor:pointer}@media(max-width:1279px){.modalExitIcon{top:34px;right:30px}}@media(max-width:833px){.modalExitIcon{top:26px;right:24px}}.modalExitIcon .ButtonText{color:var(--default_white);transition:color .2s ease-in-out}@media screen and (min-width:1000px){.modalExitIcon:hover .ButtonText{color:var(--button_dark_secondary_hover)}}@keyframes inAnimation{0%{opacity:0}to{opacity:1}}@keyframes outAnimation{0%{opacity:1}to{opacity:0}}.preload *{-webkit-transition:none!important;-moz-transition:none!important;-ms-transition:none!important;-o-transition:none!important}body{display:flex;flex-direction:column}a{text-decoration:none}svg{display:block}button{font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;font-style:normal;-webkit-appearance:none;-moz-appearance:none;appearance:none;margin:0;padding:0;border:none;background:none;outline:none}::selection{background:var(--icon_light_secondary)}::-moz-selection{background:var(--icon_light_secondary)}.row{display:flex}.visually-hidden{position:absolute;width:1px;height:1px;margin:-1px;border:0;padding:0;white-space:nowrap;-webkit-clip-path:inset(100%);clip-path:inset(100%);clip:rect(0 0 0 0);overflow:hidden}.between{justify-content:space-between}.textLeft{text-align:left}.layoutUnderArr{z-index:-1!important}.Text .Markdown__link{color:inherit!important;border-bottom-color:inherit;cursor:pointer;transition:color .2s ease-in-out,background-color .2s ease-in-out,opacity .2s ease-in-out}@media screen and (min-width:1000px){.Text .Markdown__link:hover{color:var(--hovered_link)!important;border-bottom-color:var(--hovered_link);opacity:.8}}.hiddenBlock{overflow:hidden;height:0;z-index:-1;transition:height .2s ease-in-out}.hiddenBlock--m-expanded{height:auto;z-index:1}.AccordionAnchorElement{position:relative;top:-100px}@font-face{font-family:Inter;font-style:normal;font-weight:800;font-display:block;src:url(/_next/static/media/Mulish-ExtraBold.49add491.woff2) format("woff2")}@font-face{font-family:Mulish;font-style:normal;font-weight:700;font-display:block;src:url(/_next/static/media/Mulish-Bold.50defa2a.woff2) format("woff2")}@font-face{font-family:Mulish;font-style:normal;font-weight:500;font-display:block;src:url(/_next/static/media/Mulish-Medium.36e04c25.woff2) format("woff2")}@font-face{font-family:Mulish;font-style:normal;font-weight:400;font-display:block;src:url(/_next/static/media/Mulish-Regular.f4910cec.woff2) format("woff2")}@font-face{font-family:IBMPlexMono;font-style:normal;font-weight:700;font-display:block;src:url(/_next/static/media/IBMPlexMono-Bold.d6705808.woff2) format("woff2")}@font-face{font-family:IBMPlexMono;font-style:normal;font-weight:400;font-display:block;src:url(/_next/static/media/IBMPlexMono-Regular.9d49d570.woff2) format("woff2")}body{--ton_blue:#08c;--ton_dark_blue:#019be9;--default_white:#fff;--default_black:#161c28;--toncoin_header:#353538;--toncoin_gradient:linear-gradient(297.97deg,#232328 9.93%,#343437 76.88%)}body,body[data-theme=light]{--background_light_main:#f7f9fb;--background_light_gradient:linear-gradient(180deg,#f7f9fb,rgba(238,242,245,0.8) 116.16%);--background_light_icon:rgba(0,136,204,0.06);--background_light_blue:rgba(0,136,204,0.1);--background_dark_main:#232328;--background_dark_gradient:linear-gradient(0deg,#232328,#343437 101.47%);--background_dark_secondary:hsla(0,0%,100%,0.03);--background_gradient_light:linear-gradient(180deg,#fff,#f7f9fb 134.8%);--background_green_light:#829a94;--background_black_mini_opacity:rgb(0,0,0,0.24);--background_loading_gradient_light:linear-gradient(90deg,#f7f9fb -9.69%,#f2f5f8 -9.68%,#fff 52.19%,#f2f5f8 106.56%);--button_light_primary:#08c;--button_light_primary_hover:#0197e2;--button_light_primary_pressed:#0082c2;--button_light_secondary:rgba(246,248,251,0.8);--button_light_secondary_hover:#f4f7fa;--button_light_secondary_pressed:#f4f7fa;--button_dark_primary:#08c;--button_dark_primary_hover:#00a1f1;--button_dark_primary_pressed:#076c9f;--button_dark_secondary:hsla(0,0%,100%,0.06);--button_dark_secondary_hover:hsla(0,0%,100%,0.12);--button_dark_secondary_pressed:hsla(0,0%,100%,0.03);--button_dark_text:#07a0ec;--button_dark_secondary_text_hover:#5bc8ff;--button_dark_secondary_text_pressed:#0186c9;--button_light_primary_small:rgba(0,136,204,0.06);--button_light_primary_small_hover:rgba(0,136,204,0.3);--button_light_primary_small_pressed:rgba(0,136,204,0.03);--text_light_primary:#161c28;--text_light_secondary:#728a96;--text_dark_primary:#fff;--text_dark_secondary:hsla(0,0%,100%,0.7);--text_dark_gradient:linear-gradient(89.92deg,#06a1ef 28.51%,#69cdff 85.79%);--icon_light_primary:#08c;--icon_light_secondary:rgba(236,240,243,0.8);--icon_light_thirdly:#98b2bf;--icon_dark_primary:#02a8fb;--separator_light:rgba(123,148,160,0.2);--separator_dark:hsla(0,0%,100%,0.06);--black:#000;--covers_light_green:#caefd9;--hovered_link:#08c;--light_border:rgba(114,138,150,0.24)}</style></html>`,
              },
            ],
          },
        ],
        // copyright: `Copyright © ${new Date().getFullYear()} TON Foundation`,
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
