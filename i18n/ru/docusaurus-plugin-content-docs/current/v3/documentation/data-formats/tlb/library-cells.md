import Feedback from '@site/src/components/Feedback';

# Библиотечные ячейки

## Введение

Одной из характерных особенностей того, как TON хранит данные в ячейках, является дедупликация: в хранилище сообщения, блоки, транзакции и т. д. дублирующиеся ячейки сохраняются только один раз. Это значительно уменьшает размер сериализованных данных и позволяет эффективно хранить поэтапно обновляемые данные.

As a result, many data structures in TON are rich in information and optimized for performance. For example, the block structure may contain the same message in multiple places—such as in the message queue, the list of transactions, and Merkle updates. Since duplication carries no overhead, data can be stored redundantly wherever it is needed without impacting efficiency.

Библиотечные ячейки используют механизм дедупликации в цепочке, что позволяет интегрировать эту технологию в пользовательские смарт-контракты.

:::info
:::info
Если вы храните код jetton-wallet в виде библиотечной ячейки (1 ячейка и 256+8 бит вместо ~20 ячеек и 6000 бит), например, то сборы за пересылку сообщения, содержащего `init_code`, будут снижены с 0,011 до 0,003 TON.
:::

## General info

Рассмотрим шаг бейсчейна от блока 1'000'000 до блока 1'000'001. Хотя каждый блок содержит небольшой объем данных (обычно менее 1000 транзакций), все состояние бейсчейна содержит миллионы учетных записей, и поскольку блокчейн должен поддерживать целостность данных (в частности, для фиксации хэша корня Меркла всего состояния в блоке), все дерево состояния должно быть обновлено. Since the blockchain must maintain data integrity—particularly by committing the Merkle root hash of the entire state into the block—the entire state tree must be updated.

Для блокчейнов предыдущих поколений это означает, что обычно вы отслеживаете только последние состояния, поскольку хранение отдельных состояний цепи для каждого блока потребует слишком много места. Но в блокчейне TON из-за дедупликации для каждого блока вы добавляете в хранилище только новые ячейки. Это не только ускоряет обработку, но и позволяет эффективно работать с историей: проверять балансы, состояния и даже запускать методы get для любой точки истории без особых накладных расходов!

В случае, когда у нас есть семейство похожих контрактов (например, jetton-wallets), узел сохраняет дублирующие данные (одинаковый код каждого jetton-wallet) только один раз. Библиотечные ячейки позволяют использовать механизм дедупликации для таких контрактов, чтобы уменьшить плату за хранение и пересылку.

:::info Высокоуровневая аналогия
Вы можете рассматривать библиотечную ячейку как указатель C++: одна маленькая ячейка, которая указывает на большую ячейку с (возможно) большим количеством ссылок. Ссылочная ячейка (ячейка, на которую указывает библиотечная ячейка) должна существовать и быть зарегистрирована в публичном контексте (_"published"_).
:::

## Структура библиотечных ячеек

Библиотечная ячейка - это [экзотическая ячейка](/v3/documentation/data-formats/tlb/exotic-cells), которая содержит ссылку на некоторую другую статическую ячейку. В частности, она содержит 256 бит хеша указанной ячейки.

**Behavior in TVM**
In the TON Virtual Machine (TVM), library cells operate as follows:

Для TVM библиотечные ячейки работают следующим образом: всякий раз, когда TVM получает команду открыть ячейку для фрагмента (инструкция TVM: `CTOS`, функциональный метод: `.begin_parse()`), он выполняет поиск ячейки с соответствующим хэшем из библиотечной ячейки в контексте библиотеки мастерчейна. If so, the TVM searches for a cell that matches the stored hash in the MasterChain library context. Если она найдена, она открывает указанную ячейку и возвращает ее срез.

Opening a library cell incurs the exact computational cost of opening an ordinary cell. Therefore, library cells serve as a transparent, space-efficient substitute for static cells, reducing storage and forwarding fees.

В качестве альтернативы вы можете создать библиотечную ячейку полностью на уровне ts в Blueprint с помощью библиотеки `@ton/ton`:

Обратите внимание, что можно создать библиотечную ячейку, которая ссылается на другую библиотечную ячейк, которая, в свою очередь, ссылается на другую, и так далее. В таком случае `.begin_parse()` вызовет исключение. Однако такая библиотека может быть развернута пошагово с помощью opcode `XLOAD`.

**Immutability**

Another key characteristic of library cells is immutability. Since the cell stores only the hash of the referenced cell, it refers to static, unchangeable data. Once a library cell is created, it cannot be updated to point to a different Cell.

**Publishing a library cell**

Чтобы быть найденной в контексте библиотеки мастерчейна и, следовательно, на которую ссылается библиотечная ячейка, исходная ячейка должна быть опубликована в мастерчейне. Это означает, что смарт-контракт, существующий в мастерчейне, должен добавить эту ячейку в свое состояние с флагом `public=true`. Это можно сделать с opcode `SETLIBCODE`.

## Использование в смарт-контрактах

Поскольку библиотечная ячейка ведет себя так же, как и обычная ячейка, на которую она ссылается, во всех контекстах, за исключением расчета платы, вы можете просто использовать ее вместо любой ячейки со статическими данными.

**Example**

Давайте рассмотрим пример хранения кода jetton-wallet в виде библиотечной ячейки для уменьшения комиссий. Usually, the code occupies around 20 Cells (~6000 bits). However, when stored as a library cell, it fits into a single cell with 256 + 8 bits, significantly reducing storage usage and forwarding fees.
В частности, комиссии за пересылку сообщения `internal_transfer`, содержащего `init_code`, будут снижены с 0,011 до 0,003 TON.

### Хранение данных в библиотечной ячейке

Let's walk through the process using the `jetton-wallet` code as an example.

1. Сначала нам нужно скомпилировать jetton-wallet в обычную ячейку, содержащую его код.
2. Затем вам нужно создать библиотечную ячейку со ссылкой на обычную ячейку.
  - Библиотечная ячейка содержит 8-битный тег библиотеки `0x02`, за которым следует 256-битный хэш указанной ячейки.
  - the 256-bit hash of the compiled code cell.

### Использование в Fift

You can manually create a library cell in Fift by writing its tag and hash to a builder and closing it as an exotic cell.

Это можно сделать в конструкции Fift-asm, как [эта](https://github.com/ton-blockchain/multisig-contract-v2/blob/master/contracts/auto/order_code.func), пример компиляции некоторого контракта непосредственно в библиотечную ячейку [здесь](https://github.com/ton-blockchain/multisig-contract-v2/blob/master/wrappers/Order.compile.ts).

```fift
;; https://docs.ton.org/tvm.pdf, page 30
;; Library reference cell — Always has level 0, and contains 8+256 data bits, including its 8-bit type integer 2 
;; and the representation hash Hash(c) of the library cell being referred to. When loaded, a library
;; reference cell may be transparently replaced by the cell it refers to, if found in the current library context.

cell order_code() asm "<b 2 8 u, 0x6305a8061c856c2ccf05dcb0df5815c71475870567cab5f049e340bcf59251f3 256 u, b>spec PUSHREF";
```

### Использование в @тонн/тонн

You can construct a library cell entirely in TypeScript using the `@ton/ton` library without Fift. Here’s how to do it in a Blueprint project:

```ts
import { Cell, beginCell } from '@ton/core';

let lib_prep = beginCell().storeUint(2,8).storeBuffer(jwallet_code_raw.hash()).endCell();
jwallet_code = new Cell({ exotic:true, bits: lib_prep.bits, refs:lib_prep.refs});
```

- Изучите исходный код [здесь](https://github.com/ton-blockchain/stablecoin-contract/blob/de08b905214eb253d27009db6a124fd1feadbf72/sandbox_tests/JettonWallet.spec.ts#L104C1-L105C90).

### Публикация обычной ячейки в контексте библиотеки мастерчейна

Обратите внимание, что текущая версия blueprint (`@ton/blueprint:0.19.0`) не обновляет автоматически контекст библиотеки, если какой-либо контракт во время эмуляции публикует новую библиотеку, вам нужно сделать это вручную.

The core of this contract is the line: `set_lib_code(lib_to_publish, 2);`. Ядром этого контракта является `set_lib_code(lib_to_publish, 2);` - он принимает в качестве входных данных обычную ячейку, которую нужно опубликовать, и flag=2 (означает, что все могут ее использовать).

**Note:** the contract that publishes the cell is responsible for paying its and MasterChain's storage fees. Storage costs in the MasterChain are approximately 1000 times higher than in the BaseChain. Таким образом, использование библиотечной ячейки эффективно только для контрактов, используемых тысячами пользователей.

### Тестирование в Blueprint

Чтобы проверить, как контракт, который использует библиотечные ячейки, работает в blueprint, вам нужно вручную добавить ссылочные ячейки в контекст библиотеки эмулятора blueprint. Это можно сделать следующим образом:

1. вам нужно создать словарь контекста библиотеки (Hashmap) `uint256->Cell`, где `uint256` - это хэш соответствующей ячейки.
2. установите контекст библиотеки в настройках эмулятора.

Пример того, как это можно сделать, показан [здесь](https://github.com/ton-blockchain/stablecoin-contract/blob/de08b905214eb253d27009db6a124fd1feadbf72/sandbox_tests/JettonWallet.spec.ts#L100C9-L103C32).

:::info
As of version `@ton/blueprint:0.19.0`, Blueprint does not automatically update the library context if a contract publishes a new library during emulation. You must update it manually.
This behavior is current as of April 2024 and is expected to be improved in a future release.
:::

### Get Методы для контрактов на основе библиотечных ячеек

У вас есть jetton-кошелек, код которого хранится в библиотечной ячейке, и вы хотите проверить баланс. To do so, you must execute a get method in the code. Это включает в себя:

- доступ к библиотечной ячейке
- извлечение хеша указанной ячейки
- поиск ячейки с этим хешем в коллекции библиотеки мастерчейна
- выполнение кода оттуда.

В многоуровневых решениях (LS) все эти процессы происходят за кулисами, и пользователю не нужно знать о конкретном методе хранения кода.

Однако при локальной работе все по-другому. Например, если вы используете проводник или кошелек, вы можете взять состояние учетной записи и попытаться определить ее тип — будь то NFT, кошелек, токен или аукцион.

Для обычных контрактов вы можете посмотреть доступные get методы, т. е. интерфейс, чтобы понять его. Или вы можете "забрать" состояние учетной записи в локальной псевдосети и выполнить методы там.

Для библиотечной ячейки это невозможно, поскольку она сама по себе не содержит данных. Вы должны вручную обнаружить и извлечь необходимые ячейки из контекста. Это можно сделать через LS (хотя привязки пока не поддерживают это) или через DTon.

#### Получение библиотечной ячейки с помощью Liteserver

Liteserver при запуске get методов автоматически устанавливает правильный контекст библиотеки. Если вы хотите определить тип контракта с помощью get методов или запустить get методы локально, вам нужно загрузить соответствующие ячейки с помощью метода LS [liteServer.getLibraries](https://github.com/ton-blockchain/ton/blob/4cfe1d1a96acf956e28e2bbc696a143489e23631/tl/generate/scheme/lite_api.tl#L96).

#### Получение библиотечной ячейки с помощью DTon

Вы также можете получить библиотеку с [dton.io/graphql](https://dton.io/graphql):

```
{
  get_lib(
    lib_hash: "<HASH>"
  )
}
```

а также список библиотек для определенного блока мастерчейна:

```
{
  blocks{
    libs_publishers
    libs_hash
  }
}
```

## См. также

- [Экзотические ячейки](/v3/documentation/data-formats/tlb/exotic-cells)
- [Инструкции TVM](/v3/documentation/tvm/instructions)

<Feedback />

