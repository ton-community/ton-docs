/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarConfig}
 */
module.exports = [
  'v3/contribute/README',
  {
    'type': 'category',
    'label': 'Common Rules',
    'items': [
      'v3/contribute/contribution-rules',
      'v3/contribute/participate',
      'v3/contribute/maintainers',
    ],
  },
  {
    'type': 'category',
    'label': 'Documentation',
    'items': [
      'v3/contribute/docs/guidelines',
      'v3/contribute/docs/schemes-guidelines',
    ],
  },
  {
    'type': 'category',
    'label': 'Tutorials',
    'items': [
      'v3/contribute/tutorials/guidelines',
      'v3/contribute/tutorials/principles-of-a-good-tutorial',
      'v3/contribute/tutorials/sample-tutorial',
    ],
  },
  {
    type: 'category',
    label: 'Localization Program',
    items: [
      {
        type: 'doc',
        label: 'Overview',
        id: 'v3/contribute/localization-program/overview',
      },
      {
        type: 'doc',
        label: 'How It Works',
        id: 'v3/contribute/localization-program/how-it-works',
      },
      {
        type: 'doc',
        label: 'How To Contribute',
        id: 'v3/contribute/localization-program/how-to-contribute',
      },
      {
        type: 'doc',
        label: 'Translation Style Guide',
        id: 'v3/contribute/localization-program/translation-style-guide',
      },
    ],
  },
];
