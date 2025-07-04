module.exports = {
  settings: {
    bullet: '-',
    emphasis: '_',
    rule: '-'
  },
  plugins: [
    'remark-frontmatter',
    // ['remark-admonitions', {}],
    'remark-lint-rule-style',
    'remark-gfm',
    // 'remark-directive',
    ['remark-lint-unordered-list-marker-style', '-'],
  ],
};
