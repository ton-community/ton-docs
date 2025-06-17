import Feedback from '@site/src/components/Feedback';

# 优秀教程的原则

:::danger
This page is outdated and will be updated soon.
See the [How to contribute](/v3/contribute/).
:::

这些原则最初由 [talkol](https://github.com/talkol) 提出：

- [TON Footstep #7 上的原始评论](https://github.com/ton-society/ton-footsteps/issues/7#issuecomment-1187581181)

以下是这些要点的总结，供新贡献者参考。

## 原则

1. The full flow should run on the user's client. There shouldn't be any third-party services involved. You need to do everything so that the user can simply clone the repository and immediately run it.

2. The README should be VERY detailed. Do not assume the users know anything. If the tutorial requires it, it should also explain how to install the FunC compiler or Lite-client on your device. You can copy these parts from other tutorials in this documentation.

3. 如果可以，库应该包含用于合约的全部源代码，以便用户可以对标准代码进行小的更改。例如，Jetton 智能合约允许用户尝试自定义行为。 For example, the Jetton smart contract allows users to experiment with custom behavior.

4. If it is possible, create a user-friendly interface that will allow users to deploy or run the project without having to download the code or configure anything. Notice that this should still be standalone and served from GitHub Pages to run 100% client-side on the user's device. Example: https://minter.ton.org/

5. 向用户解释每个字段选择的含义，并用最佳的例子来进行解释。

6. Explain everything there is to know about security. 解释所有需要了解的关于安全的知识。你必须解释足够多，以便创作者不会犯错误并创建危险的智能合约/机器人/网站——你正在教他们最佳的安全实践。

7. 理想情况下，库应该包含编写好的测试，向读者展示如何在你的教程背景下最好地实现它们。

8. The repository should have its own easy-to-understand compilation/deployment scripts. 库应该有易于理解的编译/部署脚本。用户能够只要输入 `npm install` 就能使用它们。

9. 有时一个 GitHub 库就足够了，不需要写一篇完整的文章。只需一个 README，里面包含了库中你需要的所有代码。在这种情况下，代码应该有良好的注释，以便用户可以轻松阅读和理解它。 Just a README with all the code you need in the repository. In this case, the code should be well-commented so that the user can easily read and understand it.
  <Feedback />

