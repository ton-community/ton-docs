import React from 'react';
import { InstructionHead } from '@site/src/components/Instructions/InstructionHead';
import { InstructionRow } from '@site/src/components/Instructions/InstructionRow';
import { Instruction } from '@site/src/components/Instructions/types';

type InstructionTableProps = {
  instructions: Instruction[];
}

export function InstructionTable({ instructions }: InstructionTableProps) {
  return (
    <table>
      <thead>
        <InstructionHead/>
      </thead>
      <tbody>
        {instructions.map(instruction => <InstructionRow instruction={instruction}/>)}
      </tbody>
    </table>
  );
}

