// update_quiz_teaser_v2.mjs
//
// Batch update existing quiz teaser texts: "3 otázky" → "5 otázek (lze přeskočit)".
// Run: node update_quiz_teaser_v2.mjs

import { readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));

const REPLACEMENTS = [
  // aria-label
  {
    from: 'aria-label="Spustit 10sekundový kviz na výběr podlahy"',
    to:   'aria-label="Spustit krátký kviz na výběr podlahy"'
  },
  // badge
  {
    from: '10 s · 3 otázky',
    to:   '10 s · 5 otázek'
  },
  // sub text
  {
    from: 'Odpovězte na <strong>3 rychlé otázky</strong> a doporučíme vám <strong>1–2 typy podlah</strong> ideální pro váš projekt.',
    to:   'Odpovězte na <strong>5 otázek</strong> (lze přeskočit) a doporučíme vám <strong>nejvhodnější typ podlahy</strong> pro váš projekt.'
  },
  // cementovy-poter has different text format
  {
    from: '<strong>interaktivní rozhodovací nástroj</strong>: 3 otázky → doporučíme 1–2 typy podlah pro váš projekt. Trvá 30 sekund.',
    to:   '<strong>interaktivní rozhodovací nástroj</strong>: 5 otázek (lze přeskočit) → doporučíme typ podlahy na míru. Trvá 10–15 sekund.'
  }
];

const TARGETS = [
  'index.html',
  'anhydritova-podlaha.html',
  'lesteny-beton.html',
  'prumyslova-podlaha.html',
  'cementovy-poter.html',
  'blog/betonova-podlaha-cena/index.html',
  'blog/lesteny-beton-cena/index.html',
  'blog/cena-anhydritove-podlahy/index.html',
  'blog/cena-prumyslove-podlahy/index.html',
  'blog/cena-lite-podlahy/index.html',
  'blog/vysychani-anhydritu/index.html',
  'blog/skladba-podlahy/index.html',
  'blog/prumyslove-podlahy-pruvodce/index.html',
  'blog/podlaha-do-garaze/index.html'
];

let totalChanges = 0;
let touchedFiles = 0;

for (const file of TARGETS) {
  const path = `${ROOT}/${file}`;
  let text;
  try {
    text = await readFile(path, 'utf-8');
  } catch (err) {
    console.log(`SKIP ${file}: cannot read - ${err.message}`);
    continue;
  }

  let fileChanges = 0;
  for (const { from, to } of REPLACEMENTS) {
    if (text.includes(from)) {
      text = text.split(from).join(to);
      fileChanges++;
    }
  }

  if (fileChanges > 0) {
    await writeFile(path, text, 'utf-8');
    console.log(`OK   ${file}: ${fileChanges} replacement(s)`);
    totalChanges += fileChanges;
    touchedFiles++;
  } else {
    console.log(`--   ${file}: no match (already updated or different format)`);
  }
}

console.log();
console.log(`Summary: ${touchedFiles} files touched, ${totalChanges} total replacements`);
