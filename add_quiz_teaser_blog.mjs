// add_quiz_teaser_blog.mjs
//
// Hromadny insert quiz teaser widget do top GSC blog articles.
// Detekuje duplikaty (skip pokud quiz-teaser-wrap uz existuje).
//
// Spusteni: node add_quiz_teaser_blog.mjs

import { readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));

const CSS_BLOCK = `
    /* ========== QUIZ TEASER (10s) ========== */
    .quiz-teaser-wrap { max-width: 1100px; margin: 0 auto; padding: clamp(1.5rem, 3vw, 2.5rem) clamp(16px, 4vw, 48px); }
    .quiz-teaser { display: grid; grid-template-columns: auto 1fr auto; gap: 1.5rem; align-items: center; padding: clamp(1.25rem, 2.5vw, 1.75rem) clamp(1.25rem, 3vw, 2.25rem); background: linear-gradient(135deg, rgba(249,115,22,0.14) 0%, rgba(249,115,22,0.04) 100%); border: 1px solid rgba(249,115,22,0.3); border-radius: 16px; transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease; position: relative; overflow: hidden; color: inherit; text-decoration: none; }
    .quiz-teaser::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, transparent 0%, rgba(249,115,22,0.10) 50%, transparent 100%); opacity: 0; transition: opacity .35s ease; pointer-events: none; }
    .quiz-teaser:hover { border-color: var(--orange); transform: translateY(-2px); box-shadow: 0 12px 30px rgba(249,115,22,0.18); }
    .quiz-teaser:hover::before { opacity: 1; }
    .quiz-teaser-icon { width: 56px; height: 56px; border-radius: 14px; background: linear-gradient(135deg, var(--orange) 0%, var(--orange2, #ea6b0e) 100%); display: flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative; z-index: 1; box-shadow: 0 6px 18px rgba(249,115,22,0.35); }
    .quiz-teaser-icon svg { width: 28px; height: 28px; fill: none; stroke: white; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; animation: quizTeaserPulse 2.4s ease-in-out infinite; }
    @keyframes quizTeaserPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.10); } }
    .quiz-teaser-content { position: relative; z-index: 1; min-width: 0; }
    .quiz-teaser-eyebrow { display: flex; gap: .65rem; align-items: center; margin-bottom: .4rem; flex-wrap: wrap; }
    .quiz-teaser-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 11px; background: var(--orange); color: white; border-radius: 100px; font-size: 11px; font-weight: 800; letter-spacing: .6px; text-transform: uppercase; line-height: 1; }
    .quiz-teaser-badge svg { width: 11px; height: 11px; fill: none; stroke: white; stroke-width: 2.5; }
    .quiz-teaser-label { font-size: 11px; color: var(--text-secondary, #a3a3a3); text-transform: uppercase; letter-spacing: .5px; font-weight: 600; }
    .quiz-teaser-title { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: clamp(20px, 2.4vw, 26px); color: var(--text-primary, #e5e5e5); text-transform: uppercase; margin: 0 0 .35rem; line-height: 1.15; letter-spacing: -.3px; }
    .quiz-teaser-sub { font-size: 14px; color: var(--text-secondary, #a3a3a3); margin: 0; line-height: 1.5; }
    .quiz-teaser-sub strong { color: var(--text-primary, #e5e5e5); font-weight: 700; }
    .quiz-teaser-cta { display: inline-flex; align-items: center; gap: 10px; padding: 13px 22px; background: var(--orange); border-radius: 100px; box-shadow: 0 4px 16px rgba(249,115,22,0.40); transition: background .25s ease, transform .25s ease, box-shadow .25s ease; flex-shrink: 0; position: relative; z-index: 1; }
    .quiz-teaser:hover .quiz-teaser-cta { background: #fb923c; box-shadow: 0 6px 22px rgba(249,115,22,0.55); transform: scale(1.03); }
    .quiz-teaser-btn { font-size: 15px; font-weight: 800; color: white; white-space: nowrap; text-transform: uppercase; letter-spacing: .6px; }
    .quiz-teaser-arrow { width: 18px; height: 18px; fill: none; stroke: white; stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; transition: transform .25s ease; }
    .quiz-teaser:hover .quiz-teaser-arrow { transform: translateX(4px); }
    @media (max-width: 768px) {
      .quiz-teaser { grid-template-columns: auto 1fr; gap: 1rem; padding: 1.1rem 1.1rem 1.25rem; }
      .quiz-teaser-icon { width: 48px; height: 48px; border-radius: 12px; }
      .quiz-teaser-icon svg { width: 24px; height: 24px; }
      .quiz-teaser-cta { grid-column: 1 / -1; justify-content: center; padding: 11px 18px; margin-top: .5rem; }
      .quiz-teaser-title { font-size: 18px; }
      .quiz-teaser-sub { font-size: 13px; }
    }
`;

function buildHtmlBlock(title, indent = '') {
  return `${indent}<!-- ===== QUIZ TEASER (10s) ===== -->
${indent}<div class="quiz-teaser-wrap">
${indent}  <a href="/typy-podlah#quiz" class="quiz-teaser" aria-label="Spustit krátký kviz na výběr podlahy">
${indent}    <div class="quiz-teaser-icon" aria-hidden="true">
${indent}      <svg viewBox="0 0 24 24"><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/><circle cx="12" cy="12" r="10"/></svg>
${indent}    </div>
${indent}    <div class="quiz-teaser-content">
${indent}      <div class="quiz-teaser-eyebrow">
${indent}        <span class="quiz-teaser-badge">
${indent}          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 15 14"/></svg>
${indent}          10 s · 5 otázek
${indent}        </span>
${indent}        <span class="quiz-teaser-label">Interaktivní průvodce</span>
${indent}      </div>
${indent}      <h3 class="quiz-teaser-title">${title}</h3>
${indent}      <p class="quiz-teaser-sub">Odpovězte na <strong>5 otázek</strong> (lze přeskočit) a doporučíme vám <strong>nejvhodnější typ podlahy</strong> pro váš projekt.</p>
${indent}    </div>
${indent}    <div class="quiz-teaser-cta">
${indent}      <span class="quiz-teaser-btn">Spustit kvíz</span>
${indent}      <svg class="quiz-teaser-arrow" viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
${indent}    </div>
${indent}  </a>
${indent}</div>

`;
}

// Regex anchors (handle CRLF + LF + variable whitespace)
const CSS_ANCHOR_RE = /@media\(max-width:480px\)\{\.btn-call\{padding:8px 12px;\}\}(\r?\n)\s*<\/style>(\r?\n)<\/head>/;
const HTML_ANCHOR_NEW_RE = /<\/header>(\r?\n)+<article class="article-content">/;
const HTML_ANCHOR_OLD_RE = /<div class="article-content fade-in">/;

const TARGETS = [
  { file: 'blog/betonova-podlaha-cena/index.html', title: 'Nevíte jakou betonovou podlahu zvolit? Zjistěte za 10 sekund.', template: 'new' },
  { file: 'blog/lesteny-beton-cena/index.html', title: 'Není leštěný beton to pravé? Zjistěte za 10 sekund.', template: 'new' },
  { file: 'blog/vysychani-anhydritu/index.html', title: 'Není anhydrit to pravé? Zjistěte za 10 sekund.', template: 'new' },
  { file: 'blog/cena-prumyslove-podlahy/index.html', title: 'Nevíte jakou průmyslovou podlahu? Zjistěte za 10 sekund.', template: 'new' },
  { file: 'blog/skladba-podlahy/index.html', title: 'Nevíte jakou skladbu podlahy zvolit? Zjistěte za 10 sekund.', template: 'new' },
  { file: 'blog/prumyslove-podlahy-pruvodce/index.html', title: 'Nevíte jakou průmyslovou podlahu? Zjistěte za 10 sekund.', template: 'old' },
];

let inserted = 0;
let skipped = 0;
let failed = 0;

for (const target of TARGETS) {
  const fullPath = `${ROOT}/${target.file}`;
  let text;
  try {
    text = await readFile(fullPath, 'utf-8');
  } catch (err) {
    console.log(`FAIL ${target.file}: cannot read - ${err.message}`);
    failed++;
    continue;
  }

  if (text.includes('quiz-teaser-wrap')) {
    console.log(`SKIP ${target.file}: already has quiz teaser`);
    skipped++;
    continue;
  }

  // Detect line ending (preserve original)
  const eol = text.includes('\r\n') ? '\r\n' : '\n';

  // Insert CSS before </style></head>
  if (!CSS_ANCHOR_RE.test(text)) {
    console.log(`FAIL ${target.file}: CSS anchor not found`);
    failed++;
    continue;
  }
  text = text.replace(
    CSS_ANCHOR_RE,
    `@media(max-width:480px){.btn-call{padding:8px 12px;}}${eol}${CSS_BLOCK.replace(/\n/g, eol)}    </style>${eol}</head>`
  );

  // Insert HTML
  if (target.template === 'new') {
    if (!HTML_ANCHOR_NEW_RE.test(text)) {
      console.log(`FAIL ${target.file}: HTML anchor (new template) not found`);
      failed++;
      continue;
    }
    const html = buildHtmlBlock(target.title, '').replace(/\n/g, eol);
    text = text.replace(
      HTML_ANCHOR_NEW_RE,
      `</header>${eol}${eol}${html}<article class="article-content">`
    );
  } else {
    if (!HTML_ANCHOR_OLD_RE.test(text)) {
      console.log(`FAIL ${target.file}: HTML anchor (old template) not found`);
      failed++;
      continue;
    }
    const html = buildHtmlBlock(target.title, '    ').replace(/\n/g, eol);
    text = text.replace(
      HTML_ANCHOR_OLD_RE,
      `${html}    <div class="article-content fade-in">`
    );
  }

  await writeFile(fullPath, text, 'utf-8');
  console.log(`OK   ${target.file}: inserted`);
  inserted++;
}

console.log();
console.log(`Summary:`);
console.log(`  Inserted: ${inserted}`);
console.log(`  Skipped:  ${skipped}`);
console.log(`  Failed:   ${failed}`);
