import Feedback from '@site/src/components/Feedback';

# TON에서 스마트 컨트랙트 컴파일 및 빌드하기

스마트 컨트랙트를 빌드하기 위한 라이브러리 및 리포지토리 목록은 다음과 같습니다.

**TLDR:**

- 대부분의 경우 블루프린트 SDK를 사용하는 것으로 충분합니다.
- 보다 낮은 수준의 접근 방식이 필요한 경우 톤 컴파일러 또는 func-js를 사용할 수 있습니다.

## 블루프린트

### 개요

스마트 컨트랙트 작성, 테스트, 배포를 위한 TON 블록체인 개발 환경입니다. 자세한 내용은 [블루프린트 git 저장소](https://github.com/ton-community/blueprint)에서 확인하세요.

### 설치

터미널에서 다음을 실행하여 새 프로젝트를 만들고 화면의 지시를 따릅니다:

```bash
npm create ton@latest
```

&nbsp;

### 특징

- 스마트 컨트랙트 구축, 테스트 및 배포를 위한 간소화된 워크플로
- 선호하는 지갑(예: 톤키퍼)을 사용하여 메인넷/테스트넷에 간단하게 배포할 수 있습니다.
- 프로세스 중에 실행되는 격리된 블록체인에서 여러 스마트 컨트랙트를 매우 빠르게 테스트합니다.

### 기술 스택

1. https://github.com/ton-community/func-js(CLI 없음)로 FunC 컴파일하기
2. https://github.com/ton-community/sandbox 으로 스마트 컨트랙트 테스트
3. 톤 커넥트 2](https://github.com/ton-connect), [톤허브 지갑](https://tonhub.com/) 또는 `ton://` 디플링크로 스마트 컨트랙트 배포하기

### 요구 사항

- [Node.js](https://nodejs.org)를 v18과 같은 최신 버전으로, `node -v`로 버전을 확인합니다.
- Visual Studio Code](https://code.visualstudio.com/), [FunC 플러그인](https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode)과 같은 타입스크립트 및 FunC를 지원하는 IDE

### 어떻게 사용하나요?

- [블루프린트 작업 데모가 포함된 도라핵스 프레젠테이션 보기](https://www.youtube.com/watch?v=5ROXVM-Fojo).
- 자세한 설명은 [블루프린트 리포지토리](https://github.com/ton-community/blueprint#create-a-new-project)를 참고하세요.

## 톤 컴파일러

### 개요

TON 스마트 컨트랙트를 위한 패키지 FunC 컴파일러:

- 깃허브: [톤 커뮤니티/톤 컴파일러](https://github.com/ton-community/ton-compiler)
- NPM: [톤 컴파일러](https://www.npmjs.com/package/ton-compiler)

### 설치

```bash npm2yarn
npm install ton-compiler
```

### 특징

- 여러 FunC 컴파일러 버전
- TON을 설치 및 컴파일할 필요가 없습니다.
- 프로그래매틱 및 CLI 인터페이스
- 유닛 테스트에 바로 사용 가능

### 사용 방법

이 패키지는 프로젝트에 '톤 컴파일러' 바이너리를 추가합니다.

FunC 컴파일은 여러 단계로 이루어지는 프로세스입니다. 첫 번째 단계는 Func를 Fift 코드로 컴파일한 다음 바이너리 표현으로 컴파일하는 것입니다. Fift 컴파일러에는 이미 Asm.fif가 번들로 제공됩니다.

FunC stdlib는 번들로 제공되지만 런타임에 비활성화할 수 있습니다.

#### 콘솔 사용

```bash
# Compile to binary form (for contract creation)
ton-compiler --input ./wallet.fc --output ./wallet.cell

# Compile to fift (useful for debugging)
ton-compiler --input ./wallet.fc --output-fift ./wallet.fif

# Compile to binary form and fift
ton-compiler --input ./wallet.fc --output ./wallet.cell --output-fift ./wallet.fif

# Disable stdlib
ton-compiler --no-stdlib --input ./wallet.fc --output ./wallet.cell --output-fift ./wallet.fif

# Pick version
ton-compiler --version "legacy" --input ./wallet.fc --output ./wallet.cell --output-fift ./wallet.fif
```

#### 프로그램 사용

```javascript
import { compileContract } from "ton-compiler";
let result = await compileContract({ code: 'source code', stdlib: true, version: 'latest' });
if (result.ok) {
  console.log(result.fift); // Compiled Fift assembler
  console.log(result.cell); // Compiled cell Buffer
} else {
  console.warn(result.logs); // Output logs
}
```

## func-js

### 개요

TON FunC 컴파일러를 위한 _크로스 플랫폼_ 바인딩.

톤 컴파일러보다 더 낮은 수준이므로 톤 컴파일러가 작동하지 않는 경우에만 사용하세요.

- 깃허브 [ton-community/func-js](https://github.com/ton-community/func-js)
- NPM: [@ton-community/func-js](https://www.npmjs.com/package/@ton-community/func-js)

### 설치

```bash npm2yarn
npm install @ton-community/func-js
```

### 특징

- FunC 바이너리를 다운로드하여 컴파일할 필요가 없습니다.
- Node.js 및 **WEB**에서 모두 작동합니다(WASM 지원 필요).
- 코드 Cell을 사용하여 BOC로 바로 컴파일
- 디버깅 목적으로 어셈블리가 반환됩니다.
- 파일 시스템에 의존하지 않음

### 사용 방법

내부적으로 이 패키지는 FunC 컴파일러와 Fift 인터프리터를 모두 사용하여 WASM으로 컴파일된 단일 라이브러리에 결합합니다.

간단한 스키마:

```bash
(your code) -> WASM(FunC -> Fift -> BOC)
```

내부 라이브러리의 소스는 [여기](https://github.com/ton-blockchain/ton/tree/testnet/crypto/funcfiftlib)에서 찾을 수 있습니다.

### 사용 예

```javascript
import {compileFunc, compilerVersion} from '@ton-community/func-js';
import {Cell} from 'ton';

async function main() {
    // You can get compiler version 
    let version = await compilerVersion();
    
    let result = await compileFunc({
        // Entry points of your project
        entryPoints: ['main.fc'],
        // Sources
        sources: {
            "stdlib.fc": "<stdlibCode>",
            "main.fc": "<contractCode>",
            // Rest of the files which are included in main.fc if some
        }
    });

    if (result.status === 'error') {
        console.error(result.message)
        return;
    }

    // result.codeBoc contains base64 encoded BOC with code cell 
    let codeCell = Cell.fromBoc(Buffer.from(result.codeBoc, "base64"))[0];
    
    // result.fiftCode contains assembly version of your code (for debug purposes)
    console.log(result.fiftCode)
}
```

프로젝트에 사용된 모든 FunC 소스 파일 콘텐츠는 `sources`로 전달되어야 합니다:

- 진입 지점
- stdlib.fc(사용하는 경우)
- 엔트리 포인트에 포함된 모든 파일

### TON 커뮤니티에서 검증

- [톤 커뮤니티/톤 컴파일러](https://github.com/ton-community/ton-compiler) - 바로 사용 가능한 TON 스마트 컨트랙트용 FunC 컴파일러입니다.
- [ton-community/func-js](https://github.com/ton-community/func-js) - TON FunC 컴파일러를 위한 크로스 플랫폼 바인딩.

### 타사 기여자

- [grozzzny/ton-compiler-groz](https://github.com/grozzzny/ton-compiler-groz) - TON FunC 스마트 컨트랙트 컴파일러.
- [Termina1/tonc](https://github.com/Termina1/tonc) - TONC(TON 컴파일러). WASM을 사용하므로 Linux에 적합합니다.

## 기타

- [disintar/toncli](https://github.com/disintar/toncli) - 가장 널리 사용되는 접근 방식 중 하나입니다. Docker와 함께 사용할 수도 있습니다.
- [톤문/톤](https://github.com/tonthemoon/ton) - _(클로즈 베타)_ 한 줄 TON 바이너리 설치 프로그램입니다.
- [delab-team/tlbcrc](https://github.com/delab-team/tlbcrc) - TL-B 체계로 옵코드를 생성하기 위한 패키지 및 CLI

<Feedback />

