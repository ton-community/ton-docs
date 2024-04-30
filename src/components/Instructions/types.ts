/**
 * How instruction is named in [original TVM implementation](https://github.com/ton-blockchain/ton/blob/master/crypto/vm). Not necessarily unique (currently only DEBUG is not unique).
 */
export type InstructionName = string
/**
 * Global version (ConfigParam 8) which enables this instruction. Version 9999 means that instruction has no global version and currently unavailable in mainnet.
 */
export type SinceGlobalVersion = number
/**
 * Free-form bytecode format description.
 */
export type OpcodeFormatDocumentation = string
/**
 * Free-form description of stack inputs and outputs. Usually the form is `[inputs] - [outputs]` where `[inputs]` are consumed stack values and `outputs` are produced stack values (top of stack is the last value).
 */
export type StackUsageDescription = string
export type CategoryOfInstruction = string
/**
 * Free-form markdown description of instruction.
 */
export type InstructionDescription = string
/**
 * Free-form description of gas amount used by instruction.
 */
export type GasUsageInfo = string
/**
 * Free-form fift usage description.
 */
export type FiftUsageDoc = string
export type FiftSnippet = string
export type ExampleDescription = string
/**
 * TL-b bytecode format description.
 */
export type TLBSchema = string
/**
 * Prefix to determine next instruction to parse. It is a hex bitstring as in TL-b (suffixed with `_` if bit length is not divisible by 4, trailing `'1' + '0' * x` must be removed).
 */
export type InstructionPrefix = string
/**
 * Static instruction parameter serialized to bytecode.
 */
export type Operand =
  | {
  name: VariableName
  type: "uint"
  display_hints: DisplayHints
  size: IntegerSizeBits
  max_value: MaximumIntegerValue
  min_value: MinimumIntegerValue
}
  | {
  name: VariableName
  type: "int"
  display_hints: DisplayHints
  size: IntegerSizeBits1
  max_value: MaximumIntegerValue1
  min_value: MinimumIntegerValue1
}
  | {
  name: VariableName
  type: "pushint_long"
}
  | {
  name: VariableName
  type: "ref"
  display_hints: DisplayHints
}
  | {
  name: VariableName
  type: "subslice"
  display_hints: DisplayHints
  bits_length_var_size: SizeOfBitLengthOperand
  bits_padding: ConstantIntegerValueToAddToLengthOfBitstringToLoad
  refs_length_var_size?: SizeOfRefCountOperand
  refs_add?: ConstantIntegerValueToAddToRefCount
  completion_tag: CompletionTagFlag
  max_bits: MaxBitSize
  min_bits: MinBitSize
  max_refs: MaxRefSize
  min_refs: MinRefSize
}
/**
 * Allowed chars are `a-zA-Z0-9_`, must not begin with digit or underscore and must not end with underscore.
 */
export type VariableName = string
/**
 * Hint for converting operands between raw values and Asm.fif display format
 */
export type DisplayHint =
  | {
  type: "continuation"
}
  | {
  type: "dictionary"
  size_var: VariableName
}
  | {
  type: "add"
  value: number
}
  | {
  type: "stack"
}
  | {
  type: "register"
}
  | {
  type: "pushint4"
}
  | {
  type: "optional_nargs"
}
  | {
  type: "plduz"
}
/**
 * Set of hints to convert between Asm.fif representation and raw bytecode
 */
export type DisplayHints = DisplayHint[]
export type IntegerSizeBits = number
export type MaximumIntegerValue = number
export type MinimumIntegerValue = number
export type IntegerSizeBits1 = number
export type MaximumIntegerValue1 = number
export type MinimumIntegerValue1 = number
export type SizeOfBitLengthOperand = number
export type ConstantIntegerValueToAddToLengthOfBitstringToLoad = number
/**
 * Optional, no refs in this operand in case of absence.
 */
export type SizeOfRefCountOperand = number
export type ConstantIntegerValueToAddToRefCount = number
/**
 * Determines completion tag presense: trailing `'1' + '0' * x` in bitstring
 */
export type CompletionTagFlag = boolean
/**
 * Hint for maximum bits available to store for this operand
 */
export type MaxBitSize = number
/**
 * Hint for minimum bits available to store for this operand
 */
export type MinBitSize = number
/**
 * Hint for maximum refs available to store for this operand
 */
export type MaxRefSize = number
/**
 * Hint for minimum refs available to store for this operand
 */
export type MinRefSize = number
/**
 * Describes how to parse operands. Order of objects in this array represents the actual order of operands in instruction.
 */
export type InstructionOperands = Operand[]
/**
 * Representation of stack entry or group of stack entries
 */
export type StackEntry =
  | {
  type: "simple"
  name: VariableName
  value_types?: PossibleValueTypes
}
  | {
  type: "const"
  value_type: ConstantType
  value: ConstantValue
}
  | {
  type: "conditional"
  name: VariableName1
  match: MatchArm[]
  else?: StackValues
}
  | {
  type: "array"
  name: VariableName
  length_var: VariableName2
  array_entry: ArraySingleEntryDefinition
}
export type PossibleValueTypes = (
  | "Integer"
  | "Cell"
  | "Builder"
  | "Slice"
  | "Tuple"
  | "Continuation"
  | "Null"
  )[]
export type ConstantType = "Integer" | "Null"
export type ConstantValue = number | null
/**
 * Allowed chars are `a-zA-Z0-9_`, must not begin with digit or underscore and must not end with underscore.
 */
export type VariableName1 = string
export type ArmValue = number
/**
 * Allowed chars are `a-zA-Z0-9_`, must not begin with digit or underscore and must not end with underscore.
 */
export type VariableName2 = string
/**
 * Array is a structure like `x1 y1 z1 x2 y2 z2 ... x_n y_n z_n n` which contains `n` entries of `x_i y_i z_i`. This property defines the structure of a single entry.
 */
export type ArraySingleEntryDefinition = StackValues
/**
 * Stack constraints. Top of stack is the last value.
 */
export type StackValues = StackEntry[]
/**
 * Represents read/write access to a register
 */
export type Register =
  | {
  type: "constant"
  index: number
}
  | {
  type: "variable"
  var_name: VariableName
}
  | {
  type: "special"
  name: "gas" | "cstate"
}
export type RegisterValues = Register[]
/**
 * Description of a continuation with static savelist
 */
export type Continuation =
  | {
  type: "cc"
  save?: ContinuationSavelist
}
  | {
  type: "variable"
  var_name: VariableName3
  save?: ContinuationSavelist
}
  | {
  type: "register"
  index: RegisterNumber03
  save?: ContinuationSavelist
}
  | {
  type: "special"
  name: "until"
  args: {
    body: Continuation
    after: Continuation
  }
}
  | {
  type: "special"
  name: "while"
  args: {
    cond: Continuation
    body: Continuation
    after: Continuation
  }
}
  | {
  type: "special"
  name: "again"
  args: {
    body: Continuation
  }
}
  | {
  type: "special"
  name: "repeat"
  args: {
    count: VariableName4
    body: Continuation
    after: Continuation
  }
}
  | {
  type: "special"
  name: "pushint"
  args: {
    value: IntegerToPushToStack
    next: Continuation
  }
}
/**
 * Allowed chars are `a-zA-Z0-9_`, must not begin with digit or underscore and must not end with underscore.
 */
export type VariableName3 = string
export type RegisterNumber03 = number
/**
 * Allowed chars are `a-zA-Z0-9_`, must not begin with digit or underscore and must not end with underscore.
 */
export type VariableName4 = string
export type IntegerToPushToStack = number
/**
 * Array of current continuation possible values after current instruction execution
 */
export type PossibleBranchesOfAnInstruction = Continuation[]
/**
 * Can this instruction not perform any of specified branches in certain cases (do not modify cc)?
 */
export type NoBranchPossibility = boolean
export type AliasName = string
export type MnemonicOfAliasedInstruction = string
/**
 * Free-form fift usage description.
 */
export type FiftUsageDoc1 = string
/**
 * Free-form description of stack inputs and outputs. Usually the form is `[inputs] - [outputs]` where `[inputs]` are consumed stack values and `outputs` are produced stack values (top of stack is the last value).
 */
export type StackUsageDescription1 = string
/**
 * Free-form markdown description of alias.
 */
export type AliasDescription = string

export interface Instruction {
  mnemonic: InstructionName
  since_version: SinceGlobalVersion
  doc: Documentation
  bytecode: BytecodeFormat
  value_flow: ValueFlowOfInstruction
  control_flow: ControlFlowOfInstruction
}
/**
 * Free-form human-friendly information which should be used for documentation purposes only.
 */
export interface Documentation {
  opcode?: OpcodeFormatDocumentation
  stack?: StackUsageDescription
  category: CategoryOfInstruction
  description: InstructionDescription
  gas: GasUsageInfo
  fift: FiftUsageDoc
  fift_examples: {
    fift: FiftSnippet
    description: ExampleDescription
  }[]
}
/**
 * Information related to bytecode format of an instruction. Assuming that each instruction has format `prefix || operand_1 || operand_2 || ...` (also some operands may be refs, not bitstring part).
 */
export interface BytecodeFormat {
  tlb: TLBSchema
  prefix: InstructionPrefix
  operands_range_check?: OperandsRangeCheck
  operands: InstructionOperands
}
/**
 * In TVM, it is possible for instructions to have overlapping prefixes, so to determine actual instruction it is required to read next `length` bits after prefix as uint `i` and check `from <= i <= to`. Optional, there is no operands check in case of absence.
 */
export interface OperandsRangeCheck {
  length: number
  from: number
  to: number
}
/**
 * Information related to usage of stack and registers by instruction.
 */
export interface ValueFlowOfInstruction {
  inputs: InstructionInputs
  outputs: InstructionOutputs
}
/**
 * Incoming values constraints.
 */
export interface InstructionInputs {
  stack?: StackValues
  registers: RegisterValues
}
export interface MatchArm {
  value: ArmValue
  stack: StackValues
}
/**
 * Outgoing values constraints.
 */
export interface InstructionOutputs {
  stack?: StackValues
  registers: RegisterValues
}
/**
 * Information related to current cc modification by instruction
 */
export interface ControlFlowOfInstruction {
  branches: PossibleBranchesOfAnInstruction
  nobranch: NoBranchPossibility
}
/**
 * Values of saved control flow registers c0-c3
 */
export interface ContinuationSavelist {
  c0?: Continuation
  c1?: Continuation
  c2?: Continuation
  c3?: Continuation
}
export interface Alias {
  mnemonic: AliasName
  alias_of: MnemonicOfAliasedInstruction
  doc_fift?: FiftUsageDoc1
  doc_stack?: StackUsageDescription1
  description?: AliasDescription
  operands: FixedOperandsOfAlias
}
/**
 * Values of original instruction operands which are fixed in this alias. Currently it can be integer or slice without references which is represented by string of '0' and '1's. Type should be inferred from original instruction operand loaders.
 */
export interface FixedOperandsOfAlias {
  [k: string]: unknown
}
