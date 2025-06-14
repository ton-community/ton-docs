import Feedback from '@site/src/components/Feedback';

# TON Connect for security

TON Connect는 사용자가 공유하는 데이터를 명시적으로 제어할 수 있도록 보장하여, 앱과 지갑 전송 중에 데이터가 유출되지 않도록 합니다. 이러한 설계를 강화하기 위해 지갑과 앱은 함께 작동하는 강력한 암호화 인증 시스템을 사용합니다.

## 사용자 데이터 및 자금 보안

- On TON Connect, user data is end-to-end encrypted when transmitted to wallets via bridges. This allows apps and wallets to employ third-party bridge servers that decrease the possibility of data theft and manipulation, dramatically increasing data integrity and safety.
- Through TON Connect, security parameters are implemented to allow users' data to be directly authenticated with their wallet address. This will enable users to use multiple wallets and choose which one is used within a particular app.
- The TON Connect protocol allows for sharing personal data items (such as contact details and KYC info, etc.), meaning the user explicitly confirms sharing such data.

Specific details and related code examples about TON Connect and its underlying security-focused design can be found via [TON Connect GitHub](https://github.com/ton-connect/).

<Feedback />

