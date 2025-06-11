import Feedback from '@site/src/components/Feedback';

# اصول یک آموزش خوب

:::danger
This page is outdated and will be updated soon.
See the [How to contribute](/v3/contribute/).
:::

نظر اصلی با این اصول توسط [talkol](https://github.com/talkol):

- [نظر اصلی درباره TON Footstep #۷](https://github.com/ton-society/ton-footsteps/issues/7#issuecomment-1187581181)

در اینجا خلاصه‌ای از این نکات برای همکاران جدید آمده است.

## اصول

1. The full flow should run on the user's client. There shouldn't be any third-party services involved. You need to do everything so that the user can simply clone the repository and immediately run it.

2. The README should be VERY detailed. Do not assume the users know anything. If the tutorial requires it, it should also explain how to install the FunC compiler or Lite-client on your device. You can copy these parts from other tutorials in this documentation.

3. It would be good if the repository included the whole source code for the contracts used, so that users could make minor changes to the standard code. For example, the Jetton smart contract allows users to experiment with custom behavior.

4. If it is possible, create a user-friendly interface that will allow users to deploy or run the project without having to download the code or configure anything. Notice that this should still be standalone and served from GitHub Pages to run 100% client-side on the user's device. Example: https://minter.ton.org/

5. به کاربران معنای هر فیلد انتخابی و بهترین شیوه‌ها را توضیح دهید.

6. Explain everything there is to know about security. You must explain enough that creators do not make mistakes and create dangerous smart contracts/bots/websites—you are teaching them the best security practices.

7. در صورت ممکن، مخزن باید تست‌های خوب نوشته شده‌ای را شامل شود که به خواننده نشان دهد چگونه بهترین روش‌ها را در زمینه آموزش شما پیاده کند.

8. The repository should have its own easy-to-understand compilation/deployment scripts. A user should be able to just `npm install` and use them.

9. Sometimes a GitHub repository is enough and there is no need to write a full article. Just a README with all the code you need in the repository. In this case, the code should be well-commented so that the user can easily read and understand it.
  <Feedback />

