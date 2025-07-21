const {
  defineConfig,
  globalIgnores,
} = require("eslint/config");

const globals = require("globals");
const tsParser = require("@typescript-eslint/parser");

module.exports = defineConfig([
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {},
    },
    files: [
      '**/*.js',
      '**/*.jsx',
      '**/*.ts',
      '**/*.tsx',
    ],
    rules: {
      indent: ["error", 2],
    },
  },
  globalIgnores([
    "./.docusaurus", "./build", "./node_modules"
  ]),
]);