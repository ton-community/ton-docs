import opcodes from './opcodes.json';
import appSpecificOpcodes from './app_specific.json';
import arithmeticOpcodes from './arithmetic.json';
import cellManipulationOpcodes from './cell_manipulation.json';
import comparisonOpcodes from './comparison.json';
import constantOpcodes from './constant.json';
import continuationOpcodes from './continuation.json';
import dictionaryManipulationOpcodes from './dictionaries.json';
import exceptionOpcodes from './exceptions.json';
import miscellaneousOpcodes from './miscellaneous.json';
import stackManipulationOpcodes from './stack_manipulation.json';
import tupleOpcodes from './tuple.json';
import cp0 from '../../../3rd/tvm-spec/cp0.json';

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

export {
  opcodes,
  appSpecificOpcodes,
  arithmeticOpcodes,
  cellManipulationOpcodes,
  comparisonOpcodes,
  constantOpcodes,
  continuationOpcodes,
  dictionaryManipulationOpcodes,
  exceptionOpcodes,
  miscellaneousOpcodes,
  stackManipulationOpcodes,
  tupleOpcodes,
  Opcode,
  cp0
};
