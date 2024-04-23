import React from 'react';
import { Instruction } from '@site/src/components/Instructions/types';
import { InstructionTable } from '@site/src/components/Instructions/InstructionTable';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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
  return (
    <div style={{ margin: '0 -25%' }}>
      <Tabs className="all-len">
        {sections.map(({ label, types, value }) => (
          <TabItem label={label} value={value}>
            <InstructionTable
              instructions={types ? instructions.filter(instruction => types.includes(instruction.doc.category)) : instructions}/>
          </TabItem>
        ))}
      </Tabs>
    </div>
  );
}
