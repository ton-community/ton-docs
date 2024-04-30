import React from 'react';
import { InstructionHead } from './InstructionHead';
import { InstructionRow } from './InstructionRow';
import { Instruction } from './types';

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

