import React, { ChangeEvent, KeyboardEvent, useCallback, useMemo, useState } from 'react';
import { Alias, Instruction } from './types';
import styles from './InstructionSearch.module.css';
import { useDebounce } from '@site/src/hooks';
import { InstructionGroups } from './InstructionGroups';

type InstructionSearchProps = {
  instructions: Instruction[];
  aliases?: Alias[];
}

export function InstructionSearch({ instructions, aliases }: InstructionSearchProps) {
  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebounce(inputValue, 500);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur();
    }
  }, []);

  return (
    <div style={{ margin: '0 calc((105% - 100vw)/2)' }}>
      <input
        className={styles.searchField}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        value={inputValue}
        type="text"
        placeholder={'Search'}
      />
      <InstructionGroups instructions={instructions} aliases={aliases ?? []} search={debouncedValue} />
    </div>
  );
}
