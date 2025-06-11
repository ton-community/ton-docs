import Feedback from '@site/src/components/Feedback';

# IDE 플러그인

Select the IDE or editor in the table of contents on the right and install the relevant plugin for your language of choice.

Using the [TON Web IDE](https://ide.ton.org/), you can try FunC or Tact online without installing anything locally.

## IntelliJ IDEs

### FunC

![](/img/docs/ton-jetbrains-plugin.png)

:::info
이 플러그인은 모든 JetBrains 제품에서 사용할 수 있습니다.
(IntelliJ IDEA, WebStorm, PyCharm, CLion 등)
:::

There are several ways to install a plugin:

- IDE 플러그인 섹션에서 "**TON**" 키워드로 직접 플러그인 찾기
- [마켓플레이스 링크](https://plugins.jetbrains.com/plugin/23382-ton)
- [GitHub 저장소](https://github.com/ton-blockchain/intellij-ton)

### Tact

There are several ways to install a plugin:

- Find the plugin directly in the IDE plugins section with "**Tact**" keywords
- [Marketplace link](https://plugins.jetbrains.com/plugin/27290-tact)
- [GitHub repository](https://github.com/tact-lang/intelli-tact)

## VS Code

Visual Studio Code는 개발자를 위한 무료이면서 인기 있는 IDE입니다.

### FunC

- [마켓플레이스 링크](https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode)
- [GitHub 저장소](https://github.com/ton-foundation/vscode-func)

### Tact

- [Marketplace link](https://marketplace.visualstudio.com/items?itemName=tonstudio.vscode-tact)
- [Open VSX registry link](https://open-vsx.org/extension/tonstudio/vscode-tact)
- [GitHub repository](https://github.com/tact-lang/tact-language-server)

## Sublime Text

### FunC

- [GitHub 저장소](https://github.com/savva425/func_plugin_sublimetext3)

### Tact

- [Package Control link](https://packagecontrol.io/packages/Tact)
- [GitHub repository](https://github.com/tact-lang/tact-sublime)

## Vim

All-in-one Vim 8+ plugin for Tact language.

- [GitHub repository](https://github.com/tact-lang/tact.vim)

## Neovim

Neovim에서 구문 강조를 활성화하려면 [nvim-treesitter 퀵스타트 가이드](https://github.com/nvim-treesitter/nvim-treesitter#quickstart)의 설치 지침을 따르세요.

To make sure `.tact` extension is properly recognized, install the [tact.vim](https://github.com/tact-lang/tact.vim) plugin.

## Helix

To enable support of the Tact language, refer to the following instructions:

1. For latest syntax highlighting, setup [tree-sitter-tact](https://github.com/tact-lang/tree-sitter-tact#helix)
2. For editor intelligence, setup [tact-language-server](https://github.com/tact-lang/tact-language-server#other-editors)

<Feedback />

