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
      {
        type: 'doc',
        label: 'Translation style guide',
        id: 'v3/contribute/localization-program/translation-style-guide',
      },
    ],

  },
  'v3/contribute/maintainers',
];
