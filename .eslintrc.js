// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },

  rules: {
    indent: ["error", 2]
  },

  settings: {
    "mdx/code-blocks": true,
    "mdx/language-mapper": {}
  },

  extends: [
    "plugin:@docusaurus/recommended",
    "plugin:mdx/recommended"
  ],

  overrides: [
    {
      files: ["*.md", "*.mdx"],
      parser: "eslint-mdx",
      extends: ["plugin:mdx/recommended"],
      rules: {
        "indent": "off"
      },
      settings: {
        "mdx/code-blocks": true
      }
    }
  ]
};
