/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarConfig}
 */
module.exports = [
  'v3/contribute/README',
  {
    'type': 'category',
    'label': 'Contribute guidelines',
    'items': [
      'v3/contribute/style-guide',
      'v3/contribute/content-standardization',
      'v3/contribute/typography',
    ],
  },
  // {
  //   'type': 'category',
  //   'label': 'Documentation',
  //   'items': [
  //     'v3/contribute/docs/guidelines',
  //     'v3/contribute/docs/schemes-guidelines',
  //   ],
  // },
  // {
  //   'type': 'category',
  //   'label': 'Tutorials',
  //   'items': [
  //     'v3/contribute/tutorials/guidelines',
  //     'v3/contribute/tutorials/principles-of-a-good-tutorial',
  //     'v3/contribute/tutorials/sample-tutorial',
  //   ],
  // },
  {
    type: 'category',
    label: 'Localization program',
    items: [
      {
        type: 'doc',
        label: 'Overview',
        id: 'v3/contribute/localization-program/overview',
      },
      {
        type: 'doc',
        label: 'How it works',
        id: 'v3/contribute/localization-program/how-it-works',
      },
      {
        type: 'doc',
        label: 'How to contribute',
        id: 'v3/contribute/localization-program/how-to-contribute',
      },
      {
        type: 'doc',
        label: 'Translation style guide',
        id: 'v3/contribute/localization-program/translation-style-guide',
      },
    ],
  },
  'v3/contribute/maintainers',
];
