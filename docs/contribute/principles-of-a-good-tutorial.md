# Principles of a Good Tutorial

Original comment with these principles by [talkol](https://github.com/talkol):

https://github.com/ton-society/ton-footsteps/issues/7#issuecomment-1187581181

I've just summarized these points specifically for new contributors here.

## Principles

1. The full flow should run on the user's client. There shouldn't be any third-party services involved. You need to do everything so that the user can simply clone the repository and immediately run it.

2. The README should be VERY detailed. Do not assume the users know anything. Ideally, it should even explain how to install the FunC compiler or Lite-client on your machine if it is required in the tutorial. You can copy these parts from other tutorials in this documentation.

3. It will be good if the repository include the full sources with used contracts code, so user can make small changes to the standard code. For example: Jetton smart contract so that user can try to add custom behavior in it.

4. If it is possible for your tutorial, create a user-friendly interface that will allow users to deploy/run the project without having to download the code and configure anything. Notice that this should still be standalone and be served from GitHub Pages to run 100% client-side on the user's machine. Example: https://jetton.live

5. Explain to users what every field choice means and explain best practices.

6. Explain a lot about security. You must explain enough that creators don't make mistakes and create dangerous smart contracts/bots/websites - you are teaching them the best security practices.

7. Ideally, the repository should contain well-written tests so that the reader can see how best to implement them in the context of your tutorial.

8. The repository should have its own easy to understand compilation/deployment scripts. A user should be able to just `npm install` and use them.

9. Sometimes a GitHub repository is enough and there is no need to write a full article. Just a README with all the code you need in the repository. In this case, the code should be well-commented so the user can easily read and understand it.