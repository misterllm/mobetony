// add_ga4_tag.mjs
//
// Batch install GA4 tag (G-7Z9R2TW5ER) napříč všemi HTML soubory.
// Přidá gtag('config', 'G-...') na řádek ZA existující gtag('config', 'AW-...').
//
// Detekuje 2 formáty:
//   1. Multi-line:  gtag('config', 'AW-11264011068');
//   2. Single-line: gtag('config','AW-11264011068');
//
// Idempotent: pokud G-7Z9R2TW5ER už v souboru je, skipne.
//
// Run: node add_ga4_tag.mjs

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'node:fs/promises';

const ROOT = dirname(fileURLToPath(import.meta.url));
const GA4_ID = 'G-7Z9R2TW5ER';

const PATTERNS = [
  // Format 1 — multi-line, s mezerami (různé indentace)
  {
    regex: /(\s*)gtag\('config', 'AW-11264011068'\);/g,
    replace: (match, indent) => `${match}\n${indent}gtag('config', '${GA4_ID}');`
  },
  // Format 2 — single-line, kompakt bez mezer
  {
    regex: /gtag\('config','AW-11264011068'\);/g,
    replace: (match) => `${match}gtag('config','${GA4_ID}');`
  }
];

let touched = 0;
let skipped = 0;
let scanned = 0;

// Find all HTML files
async function* walk(dir) {
  const fs = await import('node:fs/promises');
  for await (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === '_claude-upload') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.name.endsWith('.html')) yield full;
  }
}

for await (const file of walk(ROOT)) {
  scanned++;
  const rel = relative(ROOT, file);
  let text = await readFile(file, 'utf-8');

  if (text.includes(GA4_ID)) {
    console.log(`SKIP ${rel}: GA4 ID already present`);
    skipped++;
    continue;
  }

  let modified = false;
  for (const { regex, replace } of PATTERNS) {
    const before = text;
    text = text.replace(regex, replace);
    if (text !== before) modified = true;
  }

  if (modified) {
    await writeFile(file, text, 'utf-8');
    console.log(`OK   ${rel}`);
    touched++;
  } else {
    console.log(`--   ${rel}: no AW- gtag config found`);
  }
}

console.log();
console.log(`Summary: ${scanned} HTML files scanned`);
console.log(`         ${touched} files updated with GA4 tag`);
console.log(`         ${skipped} files skipped (already have GA4)`);
console.log(`         GA4 ID installed: ${GA4_ID}`);
