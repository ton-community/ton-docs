import React, {
  ChangeEvent,
  KeyboardEvent,
  HTMLAttributes,
  useCallback,
  useEffect,
  useState,
  useRef
} from 'react';
import styles from './SearchField.module.css';
import Markdown from "markdown-to-jsx";

type DataKey<Key> = {
  key: Key;
  name: string;
  hasMarkdown?: boolean;
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
  /**
   * Decides which keys will be shown in the results
   * */
  showKeys: DataKey<keyof DataItem>[];
} & HTMLAttributes<HTMLInputElement>;

const uniq = <T,>(data: T[]): T[] => Array.from(new Set(data));

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500)

    return () => {
      clearTimeout(timeout);
    }
  }, [inputValue])

  useEffect(() => {
    const searchValue = debouncedValue.toLowerCase();
    
    const dataByKey = data.filter((item) => item[searchBy].toString().toLowerCase().includes(searchValue));
    const dataByValues = data.filter((item) => JSON.stringify(Object.values(item)).toLowerCase().includes(searchValue));

    setFilteredData(uniq<T>([...dataByKey, ...dataByValues]));
  }, [data, debouncedValue, searchBy])

  useEffect(() => () => {
    clearTimeout(timeout.current);
  }, [timeout.current])

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

      <table>
        <thead>
          <tr>
            {showKeys.map((keyEntity) => (
              <th style={{textAlign: "left"}} key={keyEntity.name}>{keyEntity.name}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {debouncedValue.length === 0 && (
            <tr>
              <td colSpan={showKeys.length}>
                Please enter a search query
              </td>
            </tr>
          )}

          {filteredData.length === 0 && (
            <tr>
              <td colSpan={showKeys.length}>
                No results found
              </td>
            </tr>
          )}

          {filteredData.length !== 0 && filteredData.map((item, index) => (
            <tr key={index}>
              {showKeys.map((keyEntity) => {
                const value = item[keyEntity.key];

                return (
                  <td key={keyEntity.name}>
                    {keyEntity.hasMarkdown ? <Markdown>{value}</Markdown> : <code>{value}</code>}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

    </>
  )
}
