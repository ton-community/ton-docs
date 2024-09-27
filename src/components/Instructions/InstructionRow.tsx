import React from 'react';
import Markdown from 'markdown-to-jsx';
import { DisplayableInstruction } from './DisplayableInstruction';

type InstructionRowProps = {
  instruction: DisplayableInstruction;
}

export function InstructionRow({ instruction }: InstructionRowProps) {
  return (
    <tr>
      <td><code>{instruction.opcode ?? ''}</code></td>
      <td><code>{instruction.fift}</code></td>
      <td><code>{instruction.stack ?? ''}</code></td>
      <td><Markdown>{instruction.description ?? ''}</Markdown></td>
      <td><code>{instruction.gas ?? ''}</code></td>
    </tr>
  );
}
