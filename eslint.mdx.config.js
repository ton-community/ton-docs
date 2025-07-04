const {
  defineConfig,
  globalIgnores,
} = require("eslint/config");

const mdx = require('eslint-plugin-mdx');
const anyParser = require('any-eslint-parser');
const regexRules = require('eslint-plugin-regex');

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
  {
    languageOptions: {
      parser: anyParser,
    },
    plugins: {
      'regex': regexRules,
    },
    files: [
      'docs/**/*.md',
      'src/pages/**/*.md',
    ],
    rules: {
      "regex/invalid": [
        "error", [{
          "message": "plain .md files are not allowed, rename it with .mdx extension",
          "regex": ".*",
          flags: 'su'
        }]
      ],
    }
  },
  globalIgnores([
    "./.docusaurus", "./build", "./node_modules",
    "./src/components/MDXPage/index.js", // matched by *.mdx
  ]),
]);