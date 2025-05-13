import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Button from '@site/src/components/button'

# Предварительно скомпилированные бинарные файлы

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::caution важно
С Blueprint SDK вам больше не нужно вручную устанавливать бинарные файлы.
:::

Все бинарные файлы для разработки и тестирования предоставляются вместе с Blueprint SDK.

<Button href="/v3/documentation/smart-contracts/getting-started/javascript"
colorType="primary" sizeType={'sm'}>

Переход на Blueprint SDK

</Button>

## Предварительно скомпилированные бинарные файлы

Если вы не используете Blueprint SDK для разработки смарт-контрактов, вы можете использовать предварительно скомпилированные бинарные файлы, соответствующие вашей операционной системе и выбранным инструментам.

### Необходимые компоненты

Для локальной разработки смарт-контрактов TON *без Javascript*, необходимо подготовить бинарные файлы `func`, `fift` и `lite client` на вашем устройстве.

Вы можете скачать и настроить их ниже или изучить эту статью от TON Society:

- [Настройка среды разработки TON](https://blog.ton.org/setting-up-a-ton-development-environment)

### 1. Загрузка

Скачайте бинарные файлы из таблицы ниже. Убедитесь, что выбрали правильную версию для вашей операционной системы и установили все дополнительные зависимости:

| ОС                                 | Бинарные файлы TON                                                                             | fift                                                                                        | func                                                                                        | lite-client                                                                                        | Дополнительные зависимости                                                                                      |
| ---------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| MacOS x86-64                       | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/ton-mac-x86-64.zip)   | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/fift-mac-x86-64)   | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/func-mac-x86-64)   | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/lite-client-mac-x86-64)   |                                                                                                                 |
| MacOS arm64                        | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/ton-mac-arm64.zip)    |                                                                                             |                                                                                             |                                                                                                    | `brew install openssl ninja libmicrohttpd pkg-config`                                                           |
| Windows x86-64                     | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/ton-win-x86-64.zip)   | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/fift.exe)          | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/func.exe)          | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/lite-client.exe)          | Установите [OpenSSL 1.1.1](/ton-binaries/windows/Win64OpenSSL_Light-1_1_1q.msi) |
| Linux  x86_64 | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/ton-linux-x86_64.zip) | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/fift-linux-x86_64) | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/func-linux-x86_64) | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/lite-client-linux-x86_64) |                                                                                                                 |
| Linux  arm64                       | [скачать](https://github.com/ton-blockchain/ton/releases/latest/download/ton-linux-arm64.zip)  |                                                                                             |                                                                                             |                                                                                                    | `sudo apt install libatomic1 libssl-dev`                                                                        |

### 2. Настройка бинарных файлов

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

1. После загрузки необходимо `создать` новую папку. Например: **`C:/Users/%USERNAME%/ton/bin`** и переместить туда установленные файлы.

2. Чтобы открыть переменные среды Windows, нажмите клавиши <Highlight color="#1877F2">Win + R</Highlight> на клавиатуре, введите `sysdm.cpl` и нажмите Enter.

3. На вкладке "*Advanced*" нажмите кнопку <Highlight color="#1877F2">"Environment Variables..."</Highlight>.

4. В разделе *"User variables"* выберите переменную "*Path*" и нажмите <Highlight color="#1877F2">"Edit"</Highlight> (это обычно необходимо).

5. Чтобы добавить новое значение `(path)` к системной переменной в следующем окне, нажмите кнопку <Highlight color="#1877F2">"New"</Highlight>.
  В новом поле необходимо указать путь к папке, где хранятся ранее установленные файлы:

```
C:\Users\%USERNAME%\ton\bin\
```

6. Чтобы проверить, все ли было установлено правильно, запустите в терминале (*cmd.exe*):

```bash
fift -V -and func -V -and lite-client -V
```

7. Если вы планируете использовать fift, вам понадобиться переменная среды `FIFTPATH` с необходимыми импортами:

  1. Скачайте [fiftlib.zip](/ton-binaries/windows/fiftlib.zip)
  2. Распакуйте архив в какую-либо директорию на вашем компьютере (например, **`C:/Users/%USERNAME%/ton/lib/fiftlib`**)
  3. Создайте новую (нажмите кнопку <Highlight color="#1877F2">"New"</Highlight>) переменную среды `FIFTPATH` в разделе "*User variables*".
  4. В поле "*Variable value*" укажите путь к файлам: **`/%USERNAME%/ton/lib/fiftlib`** и нажмите <Highlight color="#1877F2">OK</Highlight>. Готово.

:::caution важно
Вместо `%USERNAME%` вам нужно вставить свой `username`.\
:::

</TabItem>
<TabItem value="mac" label="Linux / MacOS">

1. После загрузки убедитесь, что загруженные бинарные файлы могут быть выполнены, изменив их разрешения.

```bash
chmod +x func
chmod +x fift
chmod +x lite-client
```

2. Также полезно добавить эти бинарные файлы в путь (или скопировать их в `/usr/local/bin`), чтобы вы могли запускать их из любой директории.

```bash
cp ./func /usr/local/bin/func
cp ./fift /usr/local/bin/fift
cp ./lite-client /usr/local/bin/lite-client
```

3. Чтобы убедиться, что всё установлено правильно, выполните следующую команду в терминале.

```bash
fift -V && func -V && lite-client -V
```

4. Если вы планируете `использовать fift`, скачайте также [fiftlib.zip](/ton-binaries/windows/fiftlib.zip), распакуйте архив в директорию на вашем устройстве (например, `/usr/local/lib/fiftlib`) и задайте переменную среды `FIFTPATH`, указывающую на эту директорию.

```
unzip fiftlib.zip
mkdir -p /usr/local/lib/fiftlib
cp fiftlib/* /usr/local/lib/fiftlib
```

:::info Вы почти закончили :)
Не забудьте задать [переменную среды](https://stackoverflow.com/questions/14637979/how-to-permanently-set-path-on-linux-unix) `FIFTPATH`, указывающую на эту директорию.
:::

  </TabItem>
</Tabs>

## Сборка из исходного кода

Если вы не хотите использовать предварительно скомпилированные бинарные файлы и предпочитаете собрать их самостоятельно, следуйте [официальным инструкциям](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions).

Ниже приведены основные инструкции, готовые к использованию:

### Linux (Ubuntu / Debian)

```bash
sudo apt update
sudo apt install git make cmake g++ libssl-dev zlib1g-dev wget
cd ~ && git clone https://github.com/ton-blockchain/ton.git
cd ~/ton && git submodule update --init
mkdir ~/ton/build && cd ~/ton/build && cmake .. -DCMAKE_BUILD_TYPE=Release && make -j 4
```

## Другие источники для бинарных файлов

Основная команда предоставляет автоматические сборки для нескольких операционных систем через [GitHub Actions](https://github.com/ton-blockchain/ton/releases/latest).

Перейдите по указанной выше ссылке, выберите слева рабочий процесс, соответствующий вашей операционной системе, нажмите на последнее успешное выполнение (зелёная отметка), и скачайте `ton-binaries` в разделе "Artifacts".
