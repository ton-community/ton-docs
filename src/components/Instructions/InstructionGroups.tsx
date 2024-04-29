import React, { ChangeEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Instruction } from './types';
import { InstructionTable } from './InstructionTable';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import styles from './InstructionGroups.module.css';
import { useDebounce } from '@site/src/hooks';

type InstructionGroupsProps = {
  instructions: Instruction[];
}

const sections = [
  { label: 'Overview', types: null, value: 'all' },
  { label: 'Stack Manipulation', types: ['stack_basic', 'stack_complex'], value: 'stack' },
  { label: 'Tuple, List and Null', types: ['tuple'], value: 'tuple' },
  { label: 'Constants and Literals', types: ['const_int', 'const_data'], value: 'const' },
  {
    label: 'Arithmetic Operations',
    types: ['arithm_basic', 'arithm_div', 'arithm_logical', 'arithm_quiet'],
    value: 'arithm',
  },
  { label: 'Data Comparison', types: ['compare_int', 'compare_other'], value: 'compare' },
  { label: 'Cell Manipulation', types: ['cell_build', 'cell_parse'], value: 'cell' },
  {
    label: 'Continuation and Control Flow',
    types: ['cont_basic', 'cont_conditional', 'cont_create', 'cont_dict', 'cont_loops', 'cont_registers', 'cont_stack'],
    value: 'cont',
  },
  { label: 'Exception Generation and Handling', types: ['exceptions'], value: 'exception' },
  {
    label: 'Dictionary Manipulation',
    types: ['dict_create', 'dict_serial', 'dict_get', 'dict_set', 'dict_set_builder', 'dict_delete', 'dict_mayberef', 'dict_prefix', 'dict_next', 'dict_min', 'dict_special', 'dict_sub'],
    value: 'dict',
  },
  {
    label: 'Application-specific Primitives',
    types: ['app_gas', 'app_rnd', 'app_config', 'app_global', 'app_crypto', 'app_misc', 'app_currency', 'app_addr', 'app_actions'],
    value: 'app',
  },
  { label: 'Miscellaneous', types: ['debug', 'codepage'], value: 'miscellaneous' },
];

export function InstructionGroups({ instructions }: InstructionGroupsProps) {
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebounce(inputValue, 500);
  const [filteredInstructions, setFilteredInstructions] = useState(instructions);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur();
    }
  }, []);

  useEffect(() => {
    const searchValue = debouncedValue.toLowerCase();

    const dataByValues = instructions.filter(
      (item) =>
        item.doc?.opcode?.toLowerCase()?.includes(searchValue) ||
        item.doc?.fift?.toLowerCase()?.includes(searchValue) ||
        item?.doc?.description?.toLowerCase()?.includes(searchValue),
    );

    setFilteredInstructions(dataByValues);
  }, [instructions, debouncedValue]);

  useEffect(() => () => {
    clearTimeout(timeout.current);
  }, [timeout.current]);

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
      <Tabs>
        {sections.map(({ label, types, value }) => {
          const tabInstructions = types ? filteredInstructions.filter(instruction => types.includes(instruction.doc.category)) : filteredInstructions;
          return (tabInstructions?.length ?
            <TabItem label={label} value={value} key={value}>
              <InstructionTable
                instructions={tabInstructions}/>
            </TabItem> : null);
        },
        )}
      </Tabs>
    </div>
  );
}
