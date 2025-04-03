# Составляйте и создавайте смарт-контракты на TON

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Вот список библиотек и репозиториев для создания Вашего смарт-контракта.

**TLDR:**

- В большинстве случаев достаточно использовать Blueprint SDK.
- Если Вам нужен более низкоуровневый подход, Вы можете использовать ton-compiler или func-js.

## Blueprint

### Обзор

Среда разработки для блокчейна TON, предназначенная для написания, тестирования и развертывания смарт-контрактов. Подробнее читайте в [Git репозитории Blueprint](https://github.com/ton-community/blueprint).

### Установка

Выполните следующую команду в терминале, чтобы создать новый проект, и следуйте инструкциям на экране:

```bash
npm create ton@latest
```

&nbsp;

### Особенности

- Оптимизированный рабочий процесс для создания, тестирования и развертывания смарт-контрактов
- Очень простое развертывание в mainnet/testnet с помощью Вашего любимого кошелька (например, Tonkeeper)
- Удивительно быстрое тестирование нескольких смарт-контрактов в изолированном блокчейне, работающем в процессе

### Технологический стек

1. Компиляция FunC с помощью https://github.com/ton-community/func-js (без CLI)
2. Тестирование смарт-контрактов с помощью https://github.com/ton-community/sandbox
3. Развертывание смарт-контрактов с помощью [TON Connect 2](https://github.com/ton-connect), [Tonhub wallet](https://tonhub.com/) или диплинк `ton://`

### Требования

- [Node.js](https://nodejs.org) последней версии, например, v18, проверьте версию с помощью `node -v`
- IDE с поддержкой TypeScript и FunC, например [Visual Studio Code](https://code.visualstudio.com/) с [плагином FunC](https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode)

### Как использовать?

- [Посмотрите презентацию DoraHacks с демонстрацией работы с blueprint](https://www.youtube.com/watch?v=5ROXVM-Fojo).
- Прочитайте подробное объяснение в [репозитории Blueprint](https://github.com/ton-community/blueprint#create-a-new-project).

## ton-compiler

### Обзор

Упакованный компилятор FunC для смарт-контрактов TON:

- GitHub: [ton-community/ton-compiler](https://github.com/ton-community/ton-compiler)
- NPM: [ton-compiler](https://www.npmjs.com/package/ton-compiler)

### Установка

```bash npm2yarn
npm install ton-compiler
```

### Особенности

- Несколько версий компилятора FunC
- Не нужно устанавливать и компилировать TON
- Программные и CLI-интерфейсы
- Готовность к использованию в модульном тестировании

### Как использовать

Этот пакет добавляет бинарные файлы `ton-compiler` в проект.

Компиляция FunC - это многоступенчатый процесс. Один из них - компиляция Func в код Fift, который затем компилируется в двоичное представление. Компилятор Fift уже содержит Asm.fif.

FunC stdlib входит в комплект поставки, но может быть отключен во время выполнения.

#### Использование консоли

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

#### Программное использование

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

### Обзор

*Кроссплатформенные* привязки для компилятора TON FunC.

Он более низкоуровневый, чем ton-compiler, поэтому используйте его только в том случае, если ton-compiler Вам не подходит.

- GitHub: [ton-community/func-js](https://github.com/ton-community/func-js)
- NPM: [@ton-community/func-js](https://www.npmjs.com/package/@ton-community/func-js)

### Установка

```bash npm2yarn
npm install @ton-community/func-js
```

### Особенности

- Нет необходимости компилировать или загружать двоичные файлы FunC
- Работает как в Node.js, так и в **WEB** (требуется поддержка WASM)
- Компилируется прямо в BOC с кодом Cell
- Сборка возвращается для отладки
- Не зависит от файловой системы

### Как использовать

Внутри этот пакет использует компилятор FunC и интерпретатор Fift, объединенные в одну lib, скомпилированную в WASM.

Простая схема:

```bash
(your code) -> WASM(FunC -> Fift -> BOC)
```

Исходники внутреннего lib можно найти [здесь](https://github.com/ton-blockchain/ton/tree/testnet/crypto/funcfiftlib).

### Пример использования

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

Обратите внимание, что все содержимое исходных файлов FunC, используемое в Вашем проекте, должно быть передано в `sources`, включая:

- точки входа
- stdlib.fc (если Вы его используете)
- все файлы, включенные в точки входа

### Проверено сообществом TON

- [ton-community/ton-compiler](https://github.com/ton-community/ton-compiler) - готовый к использованию компилятор FunC для смарт-контрактов TON.
- [ton-community/func-js](https://github.com/ton-community/func-js) - кроссплатформенные привязки для компилятора TON FunC.

### Сторонние контрибьюторы

- [grozzzny/ton-compiler-groz](https://github.com/grozzzny/ton-compiler-groz) - компилятор смарт-контрактов TON FunC.
- [Termina1/tonc](https://github.com/Termina1/tonc) - TONC (компилятор TON). Использует WASM, поэтому идеально подходит для Linux.

## Другие

- [disintar/toncli](https://github.com/disintar/toncli) - один из самых популярных подходов. Вы даже можете использовать его с Docker.
- [tonthemoon/ton](https://github.com/tonthemoon/ton) - *(закрытая бета)* однострочный установщик бинарных файлов TON.
- [delab-team/tlbcrc](https://github.com/delab-team/tlbcrc) - Пакет и CLI для генерации опкодов по схеме TL-B
