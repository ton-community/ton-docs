const {
  defineConfig,
  globalIgnores,
} = require("eslint/config");

const mdx = require('eslint-plugin-mdx');

module.exports = defineConfig([
  {
    ...mdx.flat,
    files: [
      '**/*.md',
      '**/*.mdx',
    ],
    processor: mdx.createRemarkProcessor({
      lintCodeBlocks: false,
    }),
  },
  globalIgnores([
    "./.docusaurus", "./build", "./node_modules",
    "./i18n",
    "./src/components/MDXPage/index.js", // matched by *.mdx
  ]),
]);