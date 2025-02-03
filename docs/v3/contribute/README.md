# How to Contribute

## Contribute Rules

### Who can submit content to docs.ton.org

TON Documentation is entirely open source. Community enthusiasts and early TON contributors have played a key role in creating our open source TON Documentation by turning their personal notes into detailed pages.

It is originally written by TON [contributors](/v3/contribute/maintainers) and supported by [TON Studio](https://tonstudio.io/).
We aim to educate users about TON through clear, easily searchable content that appeals to both technical experts and casual readers.


### How to contribute

1. Develop your idea according [Style guide](/v3/contribute/style-guide/) and open a related issue.
2. Define your audience and determine the nature of your article (concepts, guidelines, or documentation).
3. Familiarize yourself with [Content standardization](/v3/contribute/content-standardization/) and [Typography](/v3/contribute/typography/).
4. Open a pull request with a clear description and concise updates according to the template.

#### Pool request template:

```md

## Description

Please provide a brief description of the changes introduced in this PR. Include any relevant issue numbers or links.

## Checklist

- [ ] I have created an issue.
- [ ] I am working on content that aligns with the Style Guide.
- [ ] I have reviewed and formatted the content according to Content Standardization.
- [ ] I have reviewed and formatted the text in the article according to Typography.

```
5. Ensure you complete and verify each milestone in the description checklist before submitting your pull request.

:::info
Please read the contribution guidelines on the Style Guide, Content Standardization, and Typography before contributing to avoid unnecessary rework. Don't worry about minor issues—maintainers will help you fix them during the review process.
:::

## Identify area for contribution

There are several ways to identify the area where you can contribute to TON Docs:

- Join [TON Docs Club chat](https://t.me/+c-0fVO4XHQsyOWM8) in Telegram and get the latest tasks from maintainers.
- If you have a specific contribution in mind but are unsure about it, confirm whether
  the contribution is appropriate by contacting one of the [Docs maintainers](/v3/contribute/maintainers) directly.
- Get familiar with the most frequently asked questions in the [TON Developers](https://t.me/tondev_eng) chats.
- Please read over the [issues](https://github.com/ton-community/ton-docs/issues) in the GitHub repository.
- Learn available [footsteps](https://github.com/ton-society/ton-footsteps/issues?q=documentation) for the documentation.

## TL;DR

- If you need to add or edit something in TON Docs, create a pull request 
  against the `main` branch.
- The documentation team will review the pull request or reach out as needed.
- Repository: https://github.com/ton-community/ton-docs

## Development

### Online one-click contribution setup

You can use Gitpod (a free, online, VS code-like IDE) for contributing. It will launch a workspace with a single click and will automatically:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/ton-community/ton-docs)

### Code Conventions

- **Most important**: look around. Match the overall style of the project. This includes formatting, naming files, naming objects in code, naming things in documentation, and so on.
- **For documentation**: When editing documentation, do not wrap lines at 80 characters; instead, configure your editor to soft-wrap.
- **Grammar**: `cpell` will check the spelling and suggest corrections in case of mistakes automatically before creating new commit. Feel free to add specific `words` to `cspell.json` config to include them in the verification dictionary.

Don't worry too much about styles in general; the maintainers will help you fix them as they review your code.

### Pull Requests

So you have decided to contribute code back to upstream by opening a pull request. You've put in a lot of effort, and we appreciate it. We will do our best to work with you and get the pull request reviewed. 

When submitting a pull request, please ensure the following:

1. **Keep your pull request small**. Smaller pull requests (~300 lines of diff) are easier to review and more likely to get merged. Make sure the pull request does only one thing, otherwise please split it.
2. **Use descriptive titles**. It is recommended to follow the commit message style.
3. **Test your changes**. Describe your test plan in your pull request description.

All pull requests should be opened against the `main` branch.

## What Happens Next?

The TON Docs team will be monitoring pull requests. Please help us by following the guidelines above to keep the pull requests consistent.
