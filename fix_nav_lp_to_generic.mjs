// fix_nav_lp_to_generic.mjs
//
// Hromadny replace LP odkazu (anhydritove-podlahy-olomouc, lesteny-beton-olomouc,
// prumyslove-podlahy-olomouc) za generic service page URL napric vsemi non-LP soubory.
//
// Strategie:
// - Skip 12 LP slozek (anhydritove/betonove/lesteny/prumyslove × olomouc/prerov/prostejov)
//   -> tam zustava lokalni cluster linking (Olomouc<->Prerov<->Prostejov)
// - V ostatnich souborech (homepage, blog, generic service pages, faq, kontakt, atd.)
//   replace href patterns na generic
// - /betonove-podlahy-olomouc zachovat (fallback - generic page neexistuje,
//   per skill mobetony-dev §17a Pattern 6)
//
// Spusteni:
//   node fix_nav_lp_to_generic.mjs            // naostro
//   node fix_nav_lp_to_generic.mjs --dry-run  // bez zapisu, jen seznam zmen

import { readFile, writeFile } from 'node:fs/promises';
import { glob } from 'node:fs/promises';
import { dirname, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPL = [
  ['href="/anhydritove-podlahy-olomouc"',  'href="/anhydritova-podlaha"'],
  ['href="/lesteny-beton-olomouc"',        'href="/lesteny-beton"'],
  ['href="/prumyslove-podlahy-olomouc"',   'href="/prumyslova-podlaha"'],
  ['href="/anhydritove-podlahy-olomouc/"', 'href="/anhydritova-podlaha"'],
  ['href="/lesteny-beton-olomouc/"',       'href="/lesteny-beton"'],
  ['href="/prumyslove-podlahy-olomouc/"',  'href="/prumyslova-podlaha"'],
];

const SKIP_DIRS = new Set([
  'anhydritove-podlahy-olomouc', 'anhydritove-podlahy-prerov', 'anhydritove-podlahy-prostejov',
  'betonove-podlahy-olomouc',    'betonove-podlahy-prerov',    'betonove-podlahy-prostejov',
  'lesteny-beton-olomouc',       'lesteny-beton-prerov',       'lesteny-beton-prostejov',
  'prumyslove-podlahy-olomouc',  'prumyslove-podlahy-prerov',  'prumyslove-podlahy-prostejov',
]);

const dryRun = process.argv.includes('--dry-run');
const ROOT = dirname(fileURLToPath(import.meta.url));

console.log(`${dryRun ? '[DRY-RUN MODE] ' : ''}Scanning ${ROOT}...\n`);

let changed = 0;
let totalRepl = 0;
let skipped = 0;
let unchanged = 0;

const files = [];
for await (const file of glob('**/*.html', { cwd: ROOT })) {
  files.push(file);
}
files.sort();

for (const rel of files) {
  const parentName = basename(dirname(rel));
  if (SKIP_DIRS.has(parentName)) {
    skipped++;
    continue;
  }
  const fullPath = `${ROOT}/${rel}`;
  let text = await readFile(fullPath, 'utf-8');
  const orig = text;
  let fileRepl = 0;
  for (const [oldStr, newStr] of REPL) {
    const cnt = (text.match(new RegExp(oldStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    if (cnt > 0) {
      text = text.split(oldStr).join(newStr);
      fileRepl += cnt;
    }
  }
  if (text !== orig) {
    if (!dryRun) {
      await writeFile(fullPath, text, 'utf-8');
    }
    changed++;
    totalRepl += fileRepl;
    console.log(`  ${dryRun ? '[DRY] ' : ''}OK ${rel.replace(/\\/g, '/')}: ${fileRepl} repl`);
  } else {
    unchanged++;
  }
}

console.log();
console.log(`${dryRun ? '[DRY-RUN] ' : ''}Summary:`);
console.log(`  Files changed:         ${changed}`);
console.log(`  Total replacements:    ${totalRepl}`);
console.log(`  LP files skipped:      ${skipped}`);
console.log(`  Files without LP refs: ${unchanged}`);
console.log(`  TOTAL HTML files:      ${changed + skipped + unchanged}`);
