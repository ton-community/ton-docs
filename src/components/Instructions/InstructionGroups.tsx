import React, { useMemo } from 'react';
import { Alias, Instruction } from './types';
import { InstructionTable } from './InstructionTable';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

type InstructionGroupsProps = {
  instructions: Instruction[];
  aliases?: Alias[];
  search?: string;
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
  { label: 'Aliases', types: null, value: 'alias' },
];

export const InstructionGroups = React.memo(({ instructions, aliases, search }: InstructionGroupsProps) => {
  const aliasesWithInstructions = useMemo(() => {
    const instructionsByMnemonic = instructions.reduce((acc, instruction) => {
      acc[instruction.mnemonic] = instruction;
      return acc;
    }, {});
    return aliases.map((alias) => ({ ...alias, instruction: instructionsByMnemonic[alias.alias_of] }));
  }, [instructions]);

  const searchValue = search.toLowerCase();

  const filteredInstructions = useMemo(() => instructions.filter(
    (item) =>
      item.doc?.opcode?.toLowerCase()?.includes(searchValue) ||
      item.doc?.fift?.toLowerCase()?.includes(searchValue) ||
      item?.doc?.description?.toLowerCase()?.includes(searchValue),
  ), [searchValue]);

  const filteredAliases = useMemo(() => aliasesWithInstructions.filter(
    (item) =>
      item.mnemonic?.toLowerCase()?.includes(searchValue) ||
      item.description?.toLowerCase()?.includes(searchValue) ||
      item.doc_fift?.toLowerCase()?.includes(searchValue),
  ), [searchValue]);

  return <Tabs>
    {
      sections.map(({ label, types, value }) => {
        if (value === 'alias') {
          return filteredAliases?.length ? <TabItem label={label} value={value} key={value}>
            <InstructionTable instructions={filteredAliases.map((alias) => ({
              opcode: alias.instruction?.doc?.opcode,
              fift: alias.doc_fift,
              gas: alias.instruction?.doc?.gas,
              description: alias.description,
              stack: alias.doc_stack,
            }))}/>
          </TabItem> : null;
        }

        const tabInstructions = types ? filteredInstructions.filter(instruction => types.includes(instruction.doc.category)) : filteredInstructions;
        return (tabInstructions?.length ?
          <TabItem label={label} value={value} key={value}>
            <InstructionTable
              instructions={tabInstructions.map(instruction => ({
                opcode: instruction.doc?.opcode,
                fift: instruction.doc?.fift,
                gas: instruction.doc?.gas,
                description: instruction?.doc.description,
                stack: instruction.doc?.stack,
              }))}/>
          </TabItem> : null);
      })
    }
  </Tabs>;
});
