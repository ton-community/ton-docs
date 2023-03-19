import React, {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef
} from 'react';
import styles from './SearchField.module.css';
import Markdown from "markdown-to-jsx";

type DataKey<Key> = {
  key: Key;
  name: string;
  isGrouped?: boolean;
}

type Props<DataItem> = {
  /**
   * An array of entities that will be filtered during the search
   * */
  data: DataItem[];
  /**
   * Property that determines a key that will be used for searching
   * */
  searchBy: keyof DataItem;
  showKeys: DataKey<keyof DataItem>[];
} & HTMLAttributes<HTMLInputElement>

export const SearchField = <T extends Record<string, string>>({ data, searchBy, showKeys, ...props }: Props<T>) => {
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState(inputValue);
  const [filteredData, setFilteredData] = useState<T[]>([]);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }, [])

  const handleKeyUp = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur();
    }
  }, [])

  const handleCopy = useCallback((value: string | number) => (event: MouseEvent<HTMLSpanElement>) => {
    navigator.clipboard.writeText(String(value)).then(() => {
      const element = event.target;

      if (element instanceof HTMLSpanElement) {
        timeout.current = null;
        element.style.opacity = '1';

        timeout.current = setTimeout(() => {
          element.style.opacity = '0';
        }, 1000)
      }
    });
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500)

    return () => {
      clearTimeout(timeout);
    }
  }, [inputValue])

  useEffect(() => {
    setFilteredData(data.filter((item) => String(item[searchBy]).includes(debouncedValue)))
  }, [data, debouncedValue, searchBy])

  useEffect(() => () => {
    clearTimeout(timeout.current);
  }, [timeout.current])

  const groupedKeys = useMemo(() => showKeys.filter((key) => key.isGrouped), [showKeys]);
  const separateKeys = useMemo(() => showKeys.filter((key) => !key.isGrouped), [showKeys])

  return (
    <>
      <input
        className={styles.searchField}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        value={inputValue}
        type="text"
        {...props}
      />

      {debouncedValue.length !== 0 && filteredData.map((item, index) => (
        <div key={index} className={styles.card}>
          {groupedKeys.length > 0 && (
            <div className={styles.keyContainer}>
              {groupedKeys.map((keyEntity) => String(item[keyEntity.key]).length > 0 && (
                <div className={styles.groupedKey} key={keyEntity.name}>
                  <span>{keyEntity.name}:</span> <code>{item[keyEntity.key]}</code>

                  <span className={styles.copiedState} onClick={handleCopy(item[keyEntity.key])}>
                    Copied!
                  </span>
                </div>
              ))}
            </div>
          )}

          {separateKeys.map((keyEntity) => (
            <div className={styles.separateKey} key={keyEntity.name}>
              <strong>{keyEntity.name}:</strong> <Markdown>{item[keyEntity.key]}</Markdown>
            </div>
          ))}
        </div>
      ))}
    </>
  )
}
