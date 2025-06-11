import Feedback from '@site/src/components/Feedback';

'@theme/Tabs'에서 탭 가져오기;
'@theme/TabItem'에서 탭 항목 가져오기;
'@site/src/components/button'에서 버튼 가져오기

# 미리 컴파일된 바이너리

:::caution 중요
더 이상 블루프린트 SDK를 사용하여 바이너리를 수동으로 설치할 필요가 없습니다.
:::

개발 및 테스트를 위한 모든 바이너리는 블루프린트 SDK와 함께 제공됩니다.

<버튼 href="/v3/documentation/smart-contacts/getting-started/javascript"
colorType="primary" sizeType={'sm'}>

블루프린트 SDK로 마이그레이션

</Button>

## 미리 컴파일된 바이너리

스마트 컨트랙트 개발에 블루프린트 SDK를 사용하지 않는 경우, 운영 체제 및 선택한 도구에 맞게 미리 컴파일된 바이너리를 사용할 수 있습니다.

### 전제 조건

자바스크립트 없이 TON 스마트 컨트랙트를 로컬에서 개발하려면 'func', 'five', '라이트 클라이언트'의 바이너리를 디바이스에서 준비해야 합니다.

아래에서 다운로드하여 설정하거나 TON 소사이어티에서 이 글을 읽어보세요:

- [TON 개발 환경 설정](https://blog.ton.org/setting-up-a-ton-development-environment)

### 1. 다운로드

아래 표에서 바이너리를 다운로드하세요.  운영 체제에 맞는 버전을 선택하고 추가 종속성을 설치해야 합니다:

| OS                                | TON 바이너리                                                                                    | fift                                                                                     | func                                                                                     | 라이트 클라이언트                                                                                       | 추가 종속성                                                                                                                                                                                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MacOS x86-64                      | [다운로드](https://github.com/ton-blockchain/ton/releases/latest/download/ton-mac-x86-64.zip)   | [다운로드](https://github.com/ton-blockchain/ton/releases/latest/download/fift-mac-x86-64)   | [다운로드](https://github.com/ton-blockchain/ton/releases/latest/download/func-mac-x86-64)   | [다운로드](https://github.com/ton-blockchain/ton/releases/latest/download/lite-client-mac-x86-64)   |                                                                                                                                                                                                                                                         |
| MacOS arm64                       | [다운로드](https://github.com/ton-blockchain/ton/releases/latest/download/ton-mac-arm64.zip)    |                                                                                          |                                                                                          |                                                                                                 | `brew install openssl 닌자 libmicrohttpd pkg-config`                                                                                                                                                                                                      |
| Windows x86-64                    | [다운로드](https://github.com/ton-blockchain/ton/releases/latest/download/ton-win-x86-64.zip)   | [다운로드](https://github.com/ton-blockchain/ton/releases/latest/download/fift.exe)          | [다운로드](https://github.com/ton-blockchain/ton/releases/latest/download/func.exe)          | [다운로드](https://github.com/ton-blockchain/ton/releases/latest/download/lite-client.exe)          | OpenSSL 1.1.1](/ton-binaries/windows/Win64OpenSSL_Light-1_1_1q.msi)을 설치합니다. |
| Linux x86_64 | [다운로드](https://github.com/ton-blockchain/ton/releases/latest/download/ton-linux-x86_64.zip) | [다운로드](https://github.com/ton-blockchain/ton/releases/latest/download/fift-linux-x86_64) | [다운로드](https://github.com/ton-blockchain/ton/releases/latest/download/func-linux-x86_64) | [다운로드](https://github.com/ton-blockchain/ton/releases/latest/download/lite-client-linux-x86_64) |                                                                                                                                                                                                                                                         |
| Linux arm64                       | [다운로드](https://github.com/ton-blockchain/ton/releases/latest/download/ton-linux-arm64.zip)  |                                                                                          |                                                                                          |                                                                                                 | `수도 apt 설치 libatomic1 libssl-dev`                                                                                                                                                                                                                       |

### 2. 바이너리 설정

export const Highlight = ({children, color}) => (
<span
style={{
backgroundColor: color,
borderRadius: '2px',
color: '#fff',
padding: '0.2rem',
}}>
{children} </span>
);

<Tabs groupId="operating-systems">
  <TabItem value="win" label="Windows">

1. 다운로드 후 새 폴더를 '생성'해야 합니다. 예를 들어 \*\*`C:/사용자/%USERNAME%/ton/bin`\*\*을 생성하고 설치된 파일을 이 폴더로 옮깁니다.

2. Windows 환경 변수를 열려면 키보드에서 <Highlight color="#1877F2">Win + R</Highlight> 버튼을 누르고 `sysdm.cpl`을 입력한 다음 Enter 키를 누릅니다.

3. "_고급_" 탭에서 <Highlight color="#1877F2">"환경 변수..."</Highlight> 버튼을 클릭합니다.

4. "사용자 변수"_ 섹션에서 "_Path_" 변수를 선택하고 <Highlight color="#1877F2">"편집"</Highlight> 을 클릭합니다(일반적으로 필수).

5. 다음 창에서 시스템 변수에 새 값 `(경로)`를 추가하려면 <Highlight color="#1877F2">"새로</Highlight> 만들기" 버튼을 클릭합니다.
  새 필드에 이전에 설치한 파일이 저장된 폴더의 경로를 지정해야 합니다:

  ```
  C:\Users\%USERNAME%\ton\bin\
  ```

6. 모든 것이 올바르게 설치되었는지 확인하려면 터미널(_cmd.exe_)에서 실행하세요:

  ```bash
  fift -V -and func -V -and lite-client -V
  ```

7. 파이프를 사용하려면 필요한 가져오기가 있는 `FIFTPATH` 환경 변수가 필요합니다:

  1. fiftlib.zip](/ton-binaries/windows/fiftlib.zip) 다운로드
  2. 컴퓨터의 특정 디렉토리(예: **`C:/사용자/%USERNAME%/ton/lib/fiftlib`**)에서 zip 파일을 엽니다.
  3. "_사용자 변수_" 섹션에서 환경 변수 `FIFTPATH`를 새로 생성( <Highlight color="#1877F2">"새로</Highlight> 만들기" 버튼 클릭)합니다.
  4. "_변수 값_" 필드에 파일 경로를 지정합니다: \*\*`/%USERNAME%/ton/lib/fiftlib`\*\*를 입력하고 <Highlight color="#1877F2">확인을</Highlight> 클릭합니다. 완료되었습니다.

:::caution 중요
Instead of the `%USERNAME%` keyword, you must insert your own `username`.\
%USERNAME%`키워드 대신 자신의`사용자 이름\\`을 입력해야 합니다.\
:::</TabItem> <TabItem value="mac" label="Linux / MacOS">1. After downloading, make sure the downloaded binaries are executable by changing their permissions.```bash
chmod +x func
chmod +x fift
chmod +x lite-client
```2. It's also useful to add these binaries to your path (or copy them to `/usr/local/bin`) so you can access them from anywhere.
  이 바이너리를 경로에 추가(또는 `/usr/local/bin`에 복사)하여 어디서나 액세스할 수 있도록 하는 것도 유용합니다.`bash
  cp ./func /usr/local/bin/func
  cp ./fift /usr/local/bin/fift
  cp ./lite-client /usr/local/bin/lite-client
  `3. 모든 것이 올바르게 설치되었는지 확인하려면 터미널에서 실행합니다.\`\`\`bash
  fift -V && func -V && lite-client -V````4. To check that everything was installed correctly, run in terminal.
   ```bash
   fift -V && func -V && lite-client -V
````4. fift를 `사용`하려는 경우, [fiftlib.zip](/ton-binaries/windows/fiftlib.zip)을 다운로드하여 기기의 특정 디렉토리(예: `/usr/local/lib/fiftlib`)에서 zip을 열고 환경 변수 `FIFTPATH`를 이 디렉토리를 가리키도록 설정합니다.unzip fiftlib.zip
  mkdir -p /usr/local/lib/fiftlib
  cp fiftlib/\* /usr/local/lib/fiftlib\`\`\````
unzip fiftlib.zip
mkdir -p /usr/local/lib/fiftlib
cp fiftlib/* /usr/local/lib/fiftlib
```:::info Hey, you're almost finished :)
Remember to set the [environment variable](https://stackoverflow.com/questions/14637979/how-to-permanently-set-path-on-linux-unix) `FIFTPATH` to point to this directory.
:::

</TabItem>
<TabItem value="mac" label="Linux / MacOS">

1. After downloading, make sure the downloaded binaries are executable by changing their permissions.

   ```bash
   chmod +x func
   chmod +x fift
   chmod +x lite-client
   ```

2. 이러한 바이너리를 경로에 추가하거나 `/usr/local/bin`에 복사하여 어디서나 액세스할 수 있도록 하는 것도 유용합니다.

   ```bash
   cp ./func /usr/local/bin/func
   cp ./fift /usr/local/bin/fift
   cp ./lite-client /usr/local/bin/lite-client
   ```

3. 모든 것이 올바르게 설치되었는지 확인하려면 터미널에서 실행합니다.

   ```bash
   fift -V && func -V && lite-client -V
   ```

4. fift`를 사용하려는 경우, [fiftlib.zip](/ton-binaries/windows/fiftlib.zip)을 다운로드하고 장치의 특정 디렉토리(예: `/usr/local/lib/fiftlib`)에서 zip을 열고 환경 변수 `FIFTPATH\\`가 이 디렉토리를 가리키도록 설정하세요.

   ```
   unzip fiftlib.zip
   mkdir -p /usr/local/lib/fiftlib
   cp fiftlib/* /usr/local/lib/fiftlib
   ```

:::정보 거의 다 끝났어요 :)
환경 변수](https://stackoverflow.com/questions/14637979/how-to-permanently-set-path-on-linux-unix) `FIFTPATH`가 이 디렉터리를 가리키도록 설정하는 것을 잊지 마세요.
:::

  </TabItem>
</Tabs>

## 소스에서 빌드

미리 컴파일된 바이너리에 의존하고 싶지 않고 직접 바이너리를 컴파일하는 것을 선호하는 경우 [공식 지침](/v3/guidelines/smart-contacts/howto/com파일/컴파일 지침)을 따를 수 있습니다.

바로 사용할 수 있는 요점 지침은 아래에 나와 있습니다:

### Linux(우분투/데비안)

```bash
sudo apt update
sudo apt install git make cmake g++ libssl-dev zlib1g-dev wget
cd ~ && git clone https://github.com/ton-blockchain/ton.git
cd ~/ton && git submodule update --init
mkdir ~/ton/build && cd ~/ton/build && cmake .. -DCMAKE_BUILD_TYPE=Release && make -j 4
```

## 바이너리에 대한 기타 소스

코어 팀은 여러 운영 체제에 대한 자동 빌드를 [GitHub 액션](https://github.com/ton-blockchain/ton/releases/latest)으로 제공합니다.

위의 링크를 클릭하고 왼쪽에서 운영 체제에 맞는 워크플로를 선택한 다음 최근 녹색 통과 빌드를 클릭하고 '아티팩트'에서 '톤 바이너리'를 다운로드하세요.

<Feedback />

