import Feedback from '@site/src/components/Feedback';

# IDE プラグイン

Select the IDE or editor in the table of contents on the right and install the relevant plugin for your language of choice.

Using the [TON Web IDE](https://ide.ton.org/), you can try FunC or Tact online without installing anything locally.

## IntelliJ IDEs

### FunC

![](/img/docs/ton-jetbrains-plugin.png)

:::info
このプラグインはどのJetBrains製品でも使用できます。
(IntelliJ IDEA, WebStorm, PyCharm, Clion, etc.
(IntelliJ IDEA, WebStorm, PyCharm, CLion, etc.)
:::

There are several ways to install a plugin:

- 「**TON**」キーワードのIDEプラグインセクションでプラグインを直接検索します
- format@@0(https://plugins.jetbrains.com/plugin/23382-ton)
- [GitHub repository](https://github.com/ton-blockchain/intellij-ton)

### Tact

There are several ways to install a plugin:

- Find the plugin directly in the IDE plugins section with "**Tact**" keywords
- [Marketplace link](https://plugins.jetbrains.com/plugin/27290-tact)
- [GitHub repository](https://github.com/tact-lang/intelli-tact)

## VS Code

Visual Studio Code は、開発者に人気の無料の IDE です。

### FunC

- format@@0(https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode)
- [GitHub repository](https://github.com/ton-foundation/vscode-func)

### Tact

- [Marketplace link](https://marketplace.visualstudio.com/items?itemName=tonstudio.vscode-tact)
- [Open VSX registry link](https://open-vsx.org/extension/tonstudio/vscode-tact)
- [GitHub repository](https://github.com/tact-lang/tact-language-server)

## Sublime Text

### FunC

- [GitHub repository](https://github.com/savva425/func_plugin_sublimetext3)

### Tact

- [Package Control link](https://packagecontrol.io/packages/Tact)
- [GitHub repository](https://github.com/tact-lang/tact-sublime)

## Vim

All-in-one Vim 8+ plugin for Tact language.

- [GitHub repository](https://github.com/tact-lang/tact.vim)

## Neovim

Neovimでシンタックスハイライトを有効にするには、[nvim-treesitter quickstart guide](https://github.com/nvim-treesitter/nvim-treesitter#quickstart)のインストール手順に従ってください。

To make sure `.tact` extension is properly recognized, install the [tact.vim](https://github.com/tact-lang/tact.vim) plugin.

## Helix

To enable support of the Tact language, refer to the following instructions:

1. For latest syntax highlighting, setup [tree-sitter-tact](https://github.com/tact-lang/tree-sitter-tact#helix)
2. For editor intelligence, setup [tact-language-server](https://github.com/tact-lang/tact-language-server#other-editors)

<Feedback />

