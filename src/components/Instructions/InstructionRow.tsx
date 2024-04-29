import { Instruction } from './types';
import React from 'react';
import Markdown from 'markdown-to-jsx';

type InstructionRowProps = {
  instruction: Instruction;
}

export function InstructionRow({ instruction }: InstructionRowProps) {
  return (
    <tr>
      <td><code>{instruction.doc.opcode ?? ''}</code></td>
      <td><code>{instruction.doc.fift}</code></td>
      <td><code>{instruction.doc.stack ?? ''}</code></td>
      <td><Markdown>{instruction.doc.description}</Markdown></td>
      <td><code>{instruction.doc.gas}</code></td>
    </tr>
  );
}
