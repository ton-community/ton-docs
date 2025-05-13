# TON documentation 📚

<img align="left" width="300px" src="static\img\readme\about.png">

This is the official repository for The Open Network documentation.

Latest documentation release: [docs.ton.org](https://docs.ton.org).

Contribution guidelines: [How to contribute](https://docs.ton.org/v3/contribute).

TON Documentation is entirely open source. Community enthusiasts and early TON contributors have played a key role in creating this open-source TON documentation by turning their notes into detailed pages.

It was initially written by TON [contributors](/v3/contribute/maintainers/) and supported by [TON Studio](https://tonstudio.io/).

---



## Join TON Docs Club 💎

<img align="right" width="300px" src="static\img\readme\contribute.png">

TON is an actively growing ecosystem, and every day many devs contribute to its development. 

You can participate in TON by helping organize knowledge, making Pull Requests and creating tutorials to help other developers. 

Feedback, lectures, technical articles, tutorials, and examples. All this can help the developers community grow even faster!

Join TON Docs Club chat in Telegram to join contributors party:
* https://t.me/+c-0fVO4XHQsyOWM8

---

<img align="left" width="300px" src="static\img\readme\how.png">

## How to contribute? 🦄

— Have an issue? [Prepare a solution with TON Docs Wizard](https://t.me/ton_docs_bot).  

— Have an idea? [Submit a Feature Request](https://github.com/ton-community/ton-docs/issues/new/choose).  

— Want to contribute? [How to contribute](https://docs.ton.org/v3/contribute).

— Want to translate? [Localization](https://docs.ton.org/v3/contribute/localization-program/how-to-contribute).

— Have a question? [Documentation development chat](https://t.me/+c-0fVO4XHQsyOWM8).



---

## Set up your environment ☁️

If you're changing the sidebar or adding media-files, links, please make sure that your submission won't break production.

You can do this in two ways:

### Cloud

Use Gitpod for contributing. It'll launch a workspace with a single click:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/ton-community/ton-docs)

### Local

1. Download repository from GitHub with its submodules

    ```
    git clone --recursive https://github.com/ton-community/ton-docs.git 
    ```

2. Install last version [NodeJS LTS](https://nodejs.org/en/download/) to run local build
3. Open Terminal in project directory
4. Install dependencies with command:

    ```
    npm install
    ```
5. Run project with command:

    ```
    npm run start
    ```
6. Build with multiple locales and run it locally

    ```
    npm run build
    npm run serve
    ```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Install recursive module

If you cloned the repository from GitHub without step 1, you'll need to install the submodules to enable local execution.
  ```
  git submodule update --init --recursive
  ```

## Contributors wall
<a href="https://github.com/ton-community/ton-docs/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ton-community/ton-docs&max=204" />
</a>

<p align="right" style="font-size: 14px; color: #555; margin-top: 20px;">
  <a href="#readme-top" style="text-decoration: none; color: blue; font-weight: bold;">
    ↑ Back to Top ↑
  </a>
</p>
## License

[GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/)


