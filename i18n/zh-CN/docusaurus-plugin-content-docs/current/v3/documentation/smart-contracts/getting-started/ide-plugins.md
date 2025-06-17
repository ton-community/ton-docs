import Feedback from '@site/src/components/Feedback';

# IntelliJ IDEs 插件

Select the IDE or editor in the table of contents on the right and install the relevant plugin for your language of choice.

Using the [TON Web IDE](https://ide.ton.org/), you can try FunC or Tact online without installing anything locally.

## IDE 插件

### FunC

![](/img/docs/ton-jetbrains-plugin.png)

:::info
This plugin can be used with any JetBrains product.
(IntelliJ IDEA, WebStorm, PyCharm, CLion, etc.)
:::

有几种安装插件的方法：

- 在 IDE 插件部分直接搜索带有 "**TON**" 关键词的插件
- [Marketplace 链接](https://plugins.jetbrains.com/plugin/23382-ton)
- [GitHub 代码库](https://github.com/ton-blockchain/intellij-ton)

### Tact

There are several ways to install a plugin:

- Find the plugin directly in the IDE plugins section with "**Tact**" keywords
- 此插件可与任何 JetBrains 产品一起使用。
  （IntelliJ IDEA、WebStorm、PyCharm、CLion 等）
- [GitHub repository](https://github.com/tact-lang/intelli-tact)

## VS Code 插件

Visual Studio Code 是开发者的免费且受欢迎的 IDE。

### FunC

- [Marketplace 链接](https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode)
- [GitHub 代码库](https://github.com/ton-foundation/vscode-func)

### Tact

- [Marketplace link](https://marketplace.visualstudio.com/items?itemName=tonstudio.vscode-tact)
- [Open VSX registry link](https://open-vsx.org/extension/tonstudio/vscode-tact)
- [GitHub repository](https://github.com/tact-lang/tact-language-server)

## FunC Sublime Text 插件

### FunC

- [GitHub 代码库](https://github.com/savva425/func_plugin_sublimetext3)

### Tact

- [Package Control link](https://packagecontrol.io/packages/Tact)
- [GitHub repository](https://github.com/tact-lang/tact-sublime)

## Vim

All-in-one Vim 8+ plugin for Tact language.

- [GitHub repository](https://github.com/tact-lang/tact.vim)

## Neovim

要在 Neovim 中启用语法高亮，请按照 [nvim-treesitter 快速入门指南](https://github.com/nvim-treesitter/nvim-treesitter#quickstart) 中的安装说明进行操作。

To make sure `.tact` extension is properly recognized, install the [tact.vim](https://github.com/tact-lang/tact.vim) plugin.

## Helix

To enable support of the Tact language, refer to the following instructions:

1. For latest syntax highlighting, setup [tree-sitter-tact](https://github.com/tact-lang/tree-sitter-tact#helix)
2. For editor intelligence, setup [tact-language-server](https://github.com/tact-lang/tact-language-server#other-editors)

<Feedback />

