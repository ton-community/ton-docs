/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarConfig}
 */
module.exports = [
  'contribute/README',
  {
    'type': 'category',
    'label': 'Common Rules',
    'items': [
      'contribute/contribution-rules',
      'contribute/participate',
      'contribute/maintainers',
    ],
  },
  {
    'type': 'category',
    'label': 'Documentation',
    'items': [
      'contribute/docs/guidelines',
      'contribute/docs/schemes-guidelines',
    ],
  },
  {
    'type': 'category',
    'label': 'Tutorials',
    'items': [
      'contribute/tutorials/guidelines',
      'contribute/tutorials/principles-of-a-good-tutorial',
      'contribute/tutorials/sample-tutorial',
    ],
  },
  {
    'type': 'category',
    'label': 'Archive',
    'items': [
      {
        'type': 'category',
        'label': 'Hacktoberfest 2022',
        'items': [
          'contribute/archive/hacktoberfest-2022/README',
          'contribute/archive/hacktoberfest-2022/as-contributor',
          'contribute/archive/hacktoberfest-2022/as-maintainer',
        ],
      },
    ],
  },
  {
    type: 'category',
    label: 'Localization Program',
    items: [
      {
        type: 'doc',
        label: 'Overview',
        id: 'contribute/localization-program/overview',
      },
      {
        type: 'doc',
        label: 'How It Works',
        id: 'contribute/localization-program/how-it-works',
      },
      {
        type: 'doc',
        label: 'How To Contribute',
        id: 'contribute/localization-program/how-to-contribute',
      },
      {
        type: 'doc',
        label: 'Translation Style Guide',
        id: 'contribute/localization-program/translation-style-guide',
      },
    ],
  },
];
