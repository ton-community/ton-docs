module.exports = {
  settings: {
    bullet: '-',
    emphasis: '_',
    rule: '-'
  },
  plugins: [
    'remark-frontmatter',
    'remark-lint-rule-style',
    'remark-gfm',
    ['remark-lint-unordered-list-marker-style', '-'],
    'remark-lint-docusaurus-empty-lines-around-admonition-content'
  ],
};
