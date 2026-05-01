// /typy-podlah FIX FÁZE A: Internal linking — dual buttons per floor section.
//
// Pillar page strategy:
//   "Detail info →"            = primary button → service page / informační blog
//   "Realizace v Olomouci →"   = secondary button → lokální landing / projekty
//
// Plus:
//   - Replace 📖 emoji v "Čtěte také:" za SVG (book icon)
//   - Replace 📞 emoji v CTA section za SVG (phone icon)
//
// Usage:
//   node fix_typy_podlah.mjs           (dry run)
//   node fix_typy_podlah.mjs --apply   (zápis)

import { readFileSync, writeFileSync } from "node:fs";

const PATH = "typy-podlah.html";

// SVG icons
const SVG_BOOK =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;margin-right:4px;" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>';

const SVG_PHONE =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:6px;" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>';

// Mapping per floor section: [old single btn-lp link, new primary, new secondary, secondary label]
const REPLACEMENTS = [
  {
    old: '<a href="/betonove-podlahy-olomouc/" class="btn-lp">Detailní stránka →</a>',
    new: '<a href="/blog/betonova-podlaha-cena/" class="btn-lp">Detail info & cena →</a>\n        <a href="/betonove-podlahy-olomouc/" class="btn-lp btn-lp-geo">Realizace v Olomouci →</a>',
  },
  {
    old: '<a href="/anhydritove-podlahy-olomouc/" class="btn-lp">Detailní stránka →</a>',
    new: '<a href="/anhydritova-podlaha" class="btn-lp">Detail info & cena →</a>\n        <a href="/anhydritove-podlahy-olomouc/" class="btn-lp btn-lp-geo">Realizace v Olomouci →</a>',
  },
  {
    old: '<a href="/lesteny-beton-olomouc/" class="btn-lp">Detailní stránka →</a>',
    new: '<a href="/lesteny-beton" class="btn-lp">Detail info & cena →</a>\n        <a href="/lesteny-beton-olomouc/" class="btn-lp btn-lp-geo">Realizace v Olomouci →</a>',
  },
  {
    old: '<a href="/prumyslove-podlahy-olomouc/" class="btn-lp">Detailní stránka →</a>',
    new: '<a href="/prumyslova-podlaha" class="btn-lp">Detail info & cena →</a>\n        <a href="/prumyslove-podlahy-olomouc/" class="btn-lp btn-lp-geo">Realizace v Olomouci →</a>',
  },
];

// Pro 3 floor sections BEZ existing btn-lp (cementové, podkladní, základové) —
// musíme je najít specifickým markerem a INSERT buttons.
// Najdeme `<h2 class="floor-name">{NAME}</h2>` a po `</div></div>` (close floor-uses) insert buttons.

const NEW_BUTTONS_FOR = {
  "Cementové potěry": {
    primary: { href: "/cementovy-poter", label: "Detail info & cena →" },
    secondary: { href: "/blog/cementovy-poter-olomouc/", label: "Realizace v Olomouci →" },
  },
  "Podkladní betony": {
    primary: { href: "/blog/skladba-podlahy-novostavba/", label: "Detail info →" },
    secondary: { href: "/vsechny-projekty", label: "Naše realizace →" },
  },
  "Základové desky": {
    primary: { href: "/blog/skladba-podlahy-novostavba/", label: "Detail info →" },
    secondary: { href: "/vsechny-projekty", label: "Naše realizace →" },
  },
};

// Emoji → SVG (book icon v "Čtěte také:")
const EMOJI_BOOK_OLD = "📖 Čtěte také:";
const EMOJI_BOOK_NEW = `${SVG_BOOK}Čtěte také:`;

// Emoji → SVG (phone v CTA section)
const EMOJI_PHONE_OLD = '">📞 +420 774 611 154</a>';
const EMOJI_PHONE_NEW = `">${SVG_PHONE}+420 774 611 154</a>`;

function processFile(apply) {
  const orig = readFileSync(PATH, "utf8");
  let txt = orig;
  const stats = {};

  // 1. Replace 4 existing btn-lp single buttons → dual
  let dualBtnCount = 0;
  for (const r of REPLACEMENTS) {
    if (txt.includes(r.old)) {
      txt = txt.replace(r.old, r.new);
      dualBtnCount++;
    }
  }
  stats.dual_buttons = dualBtnCount;

  // 2. Insert buttons po floor-uses div pro 3 sekce bez btn-lp
  // Pattern: hledáme <h2 class="floor-name">{NAME}</h2>...<div class="floor-uses">...</div>
  // a po close </div> floor-uses insert buttons + Čtěte také link.
  // Šetrnější: hledáme `<a href="/kontakt" class="btn-cta">Nezávazná poptávka →</a>` v rámci konkrétní floor section
  // pro typy bez btn-lp.
  let insertedCount = 0;
  for (const [floorName, btns] of Object.entries(NEW_BUTTONS_FOR)) {
    const headingRe = new RegExp(
      `(<h2 class="floor-name">${floorName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</h2>[\\s\\S]*?<a href="/kontakt" class="btn-cta">Nezávazná poptávka →</a>)([\\s\\S]*?)(</div>\\s*<div class="floor-visual">)`
    );

    const m = txt.match(headingRe);
    if (!m) continue;
    // Zjisti, jestli už tam buttons jsou (idempotence)
    if (m[2].includes('class="btn-lp"')) continue;

    const newButtons = `\n        <a href="${btns.primary.href}" class="btn-lp">${btns.primary.label}</a>\n        <a href="${btns.secondary.href}" class="btn-lp btn-lp-geo">${btns.secondary.label}</a>`;
    txt = txt.replace(headingRe, `$1${newButtons}$2$3`);
    insertedCount++;
  }
  stats.inserted_buttons = insertedCount;

  // 3. Emoji book → SVG
  let bookCount = 0;
  while (txt.includes(EMOJI_BOOK_OLD)) {
    txt = txt.replace(EMOJI_BOOK_OLD, EMOJI_BOOK_NEW);
    bookCount++;
  }
  stats.emoji_book = bookCount;

  // 4. Emoji phone → SVG
  let phoneCount = 0;
  while (txt.includes(EMOJI_PHONE_OLD)) {
    txt = txt.replace(EMOJI_PHONE_OLD, EMOJI_PHONE_NEW);
    phoneCount++;
  }
  stats.emoji_phone = phoneCount;

  if (apply && txt !== orig) {
    writeFileSync(PATH, txt, "utf8");
  }

  return { stats, modified: txt !== orig, chars_diff: txt.length - orig.length };
}

function main() {
  const apply = process.argv.includes("--apply");
  console.log(`Mode: ${apply ? "APPLY" : "DRY RUN (use --apply to write)"}\n`);
  const r = processFile(apply);
  console.log(`  stats:`, r.stats);
  console.log(`  modified: ${r.modified}, chars diff: ${r.chars_diff}`);
  if (!apply) console.log("\n→ Re-run with --apply to write changes.");
}

main();
