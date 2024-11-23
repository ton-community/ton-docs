import React from 'react';
import Markdown from 'markdown-to-jsx';
import { DisplayableInstruction } from './DisplayableInstruction';
import styles from './InstructionRow.module.css';

type InstructionRowProps = {
  instruction: DisplayableInstruction;
}

export function InstructionRow({ instruction }: InstructionRowProps) {
  return (
    <tr className={styles.anchorWithStickyNavbar} id={instruction.opcode}>
      <td><code>{instruction.opcode ?? ''}</code></td>
      <td className={styles.anchorWithStickyNavbar} id={instruction.fift}><code>{instruction.fift}</code></td>
      <td><code>{instruction.stack ?? ''}</code></td>
      <td><Markdown>{instruction.description ?? ''}</Markdown></td>
      <td><code>{instruction.gas ?? ''}</code></td>
    </tr>
  );
}
