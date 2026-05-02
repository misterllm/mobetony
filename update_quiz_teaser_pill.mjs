// update_quiz_teaser_pill.mjs
//
// Master design update: "Spustit kviz" text+arrow → solid orange pill button
// Aplikuje na všechny stránky s standard quiz teaser widget.
//
// Run: node update_quiz_teaser_pill.mjs

import { readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));

const CSS_REPLACEMENTS = [
  // .quiz-teaser-cta — wrap as solid orange pill button
  {
    from: `.quiz-teaser-cta { display: flex; align-items: center; gap: .55rem; padding-left: 1rem; position: relative; z-index: 1; flex-shrink: 0; }`,
    to: `.quiz-teaser-cta { display: inline-flex; align-items: center; gap: 10px; padding: 13px 22px; background: var(--orange); border-radius: 100px; box-shadow: 0 4px 16px rgba(249,115,22,0.40); transition: background .25s ease, transform .25s ease, box-shadow .25s ease; flex-shrink: 0; position: relative; z-index: 1; }
    .quiz-teaser:hover .quiz-teaser-cta { background: #fb923c; box-shadow: 0 6px 22px rgba(249,115,22,0.55); transform: scale(1.03); }`
  },
  // .quiz-teaser-btn — uppercase, white, weight 800
  {
    from: `.quiz-teaser-btn { font-weight: 700; font-size: 15px; color: var(--orange); white-space: nowrap; }`,
    to: `.quiz-teaser-btn { font-size: 15px; font-weight: 800; color: white; white-space: nowrap; text-transform: uppercase; letter-spacing: .6px; }`
  },
  // .quiz-teaser-arrow — white stroke (was orange)
  {
    from: `.quiz-teaser-arrow { width: 22px; height: 22px; fill: none; stroke: var(--orange); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; transition: transform .3s ease; }`,
    to: `.quiz-teaser-arrow { width: 18px; height: 18px; fill: none; stroke: white; stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; transition: transform .25s ease; }`
  },
  // mobile responsive — clean pill on mobile (no border-top dashed)
  {
    from: `.quiz-teaser-cta { grid-column: 1 / -1; padding-left: 0; padding-top: .35rem; justify-content: flex-end; border-top: 1px dashed rgba(249,115,22,0.25); margin-top: .5rem; }`,
    to: `.quiz-teaser-cta { grid-column: 1 / -1; justify-content: center; padding: 11px 18px; margin-top: .5rem; }`
  }
];

const HTML_REPLACEMENTS = [
  // diakritika fix
  { from: '<span class="quiz-teaser-btn">Spustit kviz</span>', to: '<span class="quiz-teaser-btn">Spustit kvíz</span>' }
];

const TARGETS = [
  'anhydritova-podlaha.html',
  'lesteny-beton.html',
  'prumyslova-podlaha.html',
  'blog/betonova-podlaha-cena/index.html',
  'blog/cena-anhydritove-podlahy/index.html',
  'blog/cena-prumyslove-podlahy/index.html',
  'blog/cena-lite-podlahy/index.html',
  'blog/lesteny-beton-cena/index.html',
  'blog/podlaha-do-garaze/index.html',
  'blog/prumyslove-podlahy-pruvodce/index.html',
  'blog/skladba-podlahy/index.html',
  'blog/vysychani-anhydritu/index.html'
];

let totalCss = 0;
let totalHtml = 0;
let touched = 0;

for (const file of TARGETS) {
  const path = `${ROOT}/${file}`;
  let text;
  try {
    text = await readFile(path, 'utf-8');
  } catch (err) {
    console.log(`SKIP ${file}: cannot read - ${err.message}`);
    continue;
  }

  let cssChanges = 0;
  let htmlChanges = 0;

  for (const { from, to } of CSS_REPLACEMENTS) {
    if (text.includes(from)) {
      text = text.split(from).join(to);
      cssChanges++;
    }
  }

  for (const { from, to } of HTML_REPLACEMENTS) {
    if (text.includes(from)) {
      text = text.split(from).join(to);
      htmlChanges++;
    }
  }

  if (cssChanges + htmlChanges > 0) {
    await writeFile(path, text, 'utf-8');
    console.log(`OK   ${file}: ${cssChanges} CSS, ${htmlChanges} HTML`);
    totalCss += cssChanges;
    totalHtml += htmlChanges;
    touched++;
  } else {
    console.log(`--   ${file}: no match (already updated or different format)`);
  }
}

console.log();
console.log(`Summary: ${touched} files touched, ${totalCss} CSS replacements, ${totalHtml} HTML replacements`);
