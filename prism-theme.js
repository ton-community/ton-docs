// Based on palenight, default code highlighting theme of Docusaurus
// See: https://github.com/FormidableLabs/prism-react-renderer/blob/master/packages/prism-react-renderer/src/themes/palenight.ts

const theme = {
  plain: {
    color: "#bfc7d5",
    backgroundColor: "#292d3e",
  },
  styles: [
    {
      types: ["comment"],
      style: {
        color: "rgb(105, 112, 152)",
        fontStyle: "italic",
      },
    },
    {
      types: ["string", "inserted", "char"],
      style: {
        color: "rgb(195, 232, 141)",
      },
    },
    {
      types: ["number"],
      style: {
        color: "rgb(247, 140, 108)",
      },
    },
    {
      types: ["self"],
      style: {
        color: "rgb(191, 199, 213)",
        fontWeight: 'bold',
      },
    },
    {
      types: ["type-hint"],
      style: {
        color: "rgb(243,63,148)",
      },
    },
    {
      types: ["builtin", "function"],
      style: {
        color: "rgb(130, 170, 255)",
      },
    },
    {
      types: ["variable"],
      style: {
        color: "rgb(191, 199, 213)",
      },
    },
    {
      types: ["class-name", "attr-name"],
      style: {
        color: "rgb(255, 203, 107)",
      },
    },
    {
      types: ["tag", "deleted"],
      style: {
        color: "rgb(255, 85, 114)",
      },
    },
    {
      types: ["operator"],
      style: {
        color: "rgb(137, 221, 255)",
      },
    },
    {
      types: ["boolean"],
      style: {
        color: "rgb(235, 88, 116)",
      },
    },
    {
      types: ["constant"],
      style: {
        color: "rgb(245, 110, 88)",
      },
    },
    {
      types: ["keyword"],
      style: {
        color: "rgb(199, 146, 234)",
      },
    },
    {
      types: ["doctype"],
      style: {
        color: "rgb(199, 146, 234)",
        fontStyle: "italic",
      },
    },
    {
      types: ["namespace", "punctuation", "selector"],
      style: {
        color: "rgb(178, 204, 214)",
      },
    },
    {
      types: ["url"],
      style: {
        color: "rgb(221, 221, 221)",
      },
    },
  ],
}

// CommonJS format, DON'T convert to ESM
module.exports = theme;
