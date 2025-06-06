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
  }, [instructions, aliases]);

  const searchValue = search.toLowerCase();

  const filteredInstructions = useMemo(() => instructions.filter(
    (item) =>
      item.doc?.opcode?.toLowerCase()?.includes(searchValue) ||
      item.doc?.fift?.toLowerCase()?.includes(searchValue) ||
      item?.doc?.description?.toLowerCase()?.includes(searchValue),
  ), [instructions, searchValue]);

  const filteredAliases = useMemo(() => aliasesWithInstructions.filter(
    (item) =>
      item.mnemonic?.toLowerCase()?.includes(searchValue) ||
      item.description?.toLowerCase()?.includes(searchValue) ||
      item.doc_fift?.toLowerCase()?.includes(searchValue),
  ), [aliasesWithInstructions, searchValue]);

  const activeTab = useMemo(() => {
    if (filteredAliases.length > 0 && filteredInstructions.length === 0) {
      return 'alias';
    }
    return 'all';
  }, [filteredAliases, filteredInstructions]);

  return (
    <Tabs key={activeTab} defaultValue={activeTab}>
      {sections.map(({ label, types, value }) => {
        if (value === 'alias') {
          if (!filteredAliases.length) return null;
          return (
            <TabItem label={label} value={value} key={value}>
              <InstructionTable
                instructions={filteredAliases.map((alias) => ({
                  opcode: alias.instruction?.doc.opcode,
                  fift: alias.doc_fift,
                  gas: alias.instruction?.doc.gas,
                  description: alias.description,
                  stack: alias.doc_stack,
                }))}
              />
            </TabItem>
          );
        }

        const tabInstructions = types
          ? filteredInstructions.filter((inst) => types.includes(inst.doc.category))
          : filteredInstructions;

        if (!tabInstructions.length) return null;
        return (
          <TabItem label={label} value={value} key={value}>
            <InstructionTable
              instructions={tabInstructions.map((inst) => ({
                opcode: inst.doc.opcode,
                fift: inst.doc.fift,
                gas: inst.doc.gas,
                description: inst.doc.description,
                stack: inst.doc.stack,
              }))}
            />
          </TabItem>
        );
      })}
    </Tabs>
  );
});
