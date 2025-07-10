#!/usr/bin/env node
// cspell:disable

const fs   = require('fs');
const path = require('path');

/* ---------------------------------------------------------------
   Regenerates all category JSON slices in  src/data/opcodes/
   from 3rd/tvm-spec/cp0.json   (new schema with `doc.*`)
---------------------------------------------------------------- */

// ---------- paths ------------------------------------------------
const SRC = path.join(__dirname, '3rd/tvm-spec/cp0.json');
const OUT = path.join(__dirname, 'src/data/opcodes');

// ---------- root token → slice filename --------------------------
const ROOT_TO_FILE = {
  app        : 'app_specific.json',
  const      : 'constant.json',
  arithm     : 'arithmetic.json',
  cell       : 'cell_manipulation.json',
  compare    : 'comparison.json',
  cont       : 'continuation.json',
  dict       : 'dictionaries.json',
  exception  : 'exceptions.json',
  exceptions : 'exceptions.json',         // plural form
  stack      : 'stack_manipulation.json',
  tuple      : 'tuple.json',
};

// ---------- fields to keep & helper ------------------------------
const FIELDS = [
  'name', 'alias_of', 'tlb', 'doc_category',
  'doc_opcode', 'doc_fift', 'doc_stack', 'doc_gas', 'doc_description',
];
const pick = o => Object.fromEntries(FIELDS.map(k => [k, o[k] ?? '']));
const rootToken = cat => (cat || '').split('_')[0].toLowerCase();

// ---------- load source ------------------------------------------
function loadSource() {
  if (!fs.existsSync(SRC)) {
    console.error(`❌  Source not found: ${SRC}`);
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(SRC, 'utf8'));
  return Array.isArray(raw)
    ? raw
    : Array.isArray(raw.instructions) ? raw.instructions
    : [];
}

// ---------- transform: instruction → flat object -----------------
function instToFlat(inst) {
  const doc = inst.doc ?? {};
  return {
    name            : (inst.name && inst.name.trim()) ? inst.name : inst.mnemonic,
    alias_of        : inst.alias_of ?? '',
    tlb             : inst.bytecode?.tlb ?? '',
    doc_category    : doc.category ?? '',
    doc_opcode      : doc.opcode   ?? '',
    doc_fift        : doc.fift     ?? '',
    doc_stack       : doc.stack    ?? '',
    doc_gas         : doc.gas !== null && doc.gas !== undefined ? Number(doc.gas) : '',
    doc_description : doc.description ?? '',
  };
}

// ---------- main --------------------------------------------------
function main() {
  const instructions = loadSource();
  if (!instructions.length) {
    console.error('❌  No instructions array in cp0.json'); process.exit(1);
  }

  fs.mkdirSync(OUT, { recursive: true });

  /* full opcodes.json */
  fs.writeFileSync(
    path.join(OUT, 'opcodes.json'),
    JSON.stringify(instructions.map(instToFlat).map(pick), null, 2)
  );
  console.log('→ opcodes.json');

  /* bucketed slices */
  const buckets = {};
  for (const inst of instructions) {
    const flat  = instToFlat(inst);
    const fname = ROOT_TO_FILE[rootToken(flat.doc_category)] || 'miscellaneous.json';
    (buckets[fname] = buckets[fname] || []).push(pick(flat));
  }

  let grandTotal = 0;
  const summary  = [];

  for (const [file, list] of Object.entries(buckets).sort()) {
    fs.writeFileSync(
      path.join(OUT, file),
      JSON.stringify(list, null, 2)
    );
    grandTotal += list.length;
    summary.push(`• ${file.padEnd(25)} : ${list.length}`);
  }

  /* pretty summary */
  console.log('\n=== Summary ===');
  summary.forEach(l => console.log(l));
  console.log(`Total opcodes          : ${grandTotal}`);
  console.log('✅  All slices regenerated.\n');
}

main();
