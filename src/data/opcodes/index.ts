import opcodes from './opcodes.json';

type Opcode = {
  name: string;
  alias_of: string;
  tlb: string;
  doc_category: string;
  doc_opcode: string | number;
  doc_fift: string;
  doc_stack: string;
  doc_gas: number;
  doc_description: string;
}

export { opcodes, Opcode };
