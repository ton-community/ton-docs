import React from 'react';
import { InstructionHead } from './InstructionHead';
import { InstructionRow } from './InstructionRow';
import { DisplayableInstruction } from './DisplayableInstruction';

type InstructionTableProps = {
  instructions: DisplayableInstruction[];
}

export function InstructionTable({ instructions }: InstructionTableProps) {
  return (
    <table>
      <thead>
        <InstructionHead/>
      </thead>
      <tbody>
        {instructions.map(instruction => <InstructionRow instruction={instruction} key={instruction.opcode + instruction.fift}/>)}
      </tbody>
    </table>
  );
}

