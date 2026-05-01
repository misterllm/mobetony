// Batch script: snižuje reference karty z 4 na 2 v Přerov + Prostějov landing pages.
// Důvod: Marty má reálně jen ~2 reference per město (zbylé 2 byly fake/random generované).
//
// Postup: najde 3rd a 4th <div class="lp-ref-card"> v každém souboru a smaže je
// (včetně jejich obsahu — balanced div traversal).
//
// Usage:
//   node fix_landing_refs.mjs           (dry run)
//   node fix_landing_refs.mjs --apply   (zápis)

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));

const TARGETS = [
  "lesteny-beton-prerov",
  "lesteny-beton-prostejov",
  "prumyslove-podlahy-prerov",
  "prumyslove-podlahy-prostejov",
  "anhydritove-podlahy-prerov",
  "anhydritove-podlahy-prostejov",
  "betonove-podlahy-prerov",
  "betonove-podlahy-prostejov",
];

const CARD_START = '      <div class="lp-ref-card">';

// Najde všechny startovní pozice lp-ref-card
function findCardStarts(text) {
  const starts = [];
  let pos = 0;
  while ((pos = text.indexOf(CARD_START, pos)) !== -1) {
    starts.push(pos);
    pos += CARD_START.length;
  }
  return starts;
}

// Balanced traversal: najdi konec tohoto <div class="lp-ref-card"> bloku.
// Vrací index POSLEDNÍHO `>` v uzavírajícím </div>.
function findCardEnd(text, startPos) {
  // Skoč za otevírací tag
  let i = text.indexOf(">", startPos);
  if (i === -1) return -1;
  i++;
  let depth = 1;

  while (depth > 0 && i < text.length) {
    const nextOpen = text.indexOf("<div", i);
    const nextClose = text.indexOf("</div>", i);
    if (nextClose === -1) return -1;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      i = text.indexOf(">", nextOpen) + 1;
    } else {
      depth--;
      i = nextClose + "</div>".length;
    }
  }
  return i;
}

function processFile(slug, apply) {
  const path = join(ROOT, slug, "index.html");
  if (!existsSync(path)) return { error: "not found" };

  const orig = readFileSync(path, "utf8");
  const starts = findCardStarts(orig);

  if (starts.length !== 4) {
    return { error: `expected 4 cards, found ${starts.length}`, count: starts.length };
  }

  // Najdi end pozice pro 3rd (index 2) a 4th (index 3) cards
  const card3Start = starts[2];
  const card3End = findCardEnd(orig, card3Start);
  const card4Start = starts[3];
  const card4End = findCardEnd(orig, card4Start);

  if (card3End === -1 || card4End === -1) {
    return { error: "could not find card end" };
  }

  // Smažeme od začátku 3rd cards INCLUDING leading whitespace na předchozí čáře
  // (běžně je tam "\n\n      <div..." takže smažeme \n\n před tím)
  // až po konec 4th card včetně.
  // Strategy: najdi začátek řádku obsahujícího 3rd card start (back up to last \n)
  let deleteFrom = card3Start;
  // Back up přes leading whitespace na řádku
  while (deleteFrom > 0 && orig[deleteFrom - 1] === " ") deleteFrom--;
  // Back up přes případný předchozí \n (oddělovač mezi cards)
  if (deleteFrom > 0 && orig[deleteFrom - 1] === "\n") deleteFrom--;
  if (deleteFrom > 0 && orig[deleteFrom - 1] === "\n") deleteFrom--;

  let deleteTo = card4End;
  // Konzumujeme případný trailing \n
  if (orig[deleteTo] === "\n") deleteTo++;

  const newText = orig.slice(0, deleteFrom) + "\n" + orig.slice(deleteTo);
  const newStarts = findCardStarts(newText);

  if (apply && newText !== orig) {
    writeFileSync(path, newText, "utf8");
  }

  return {
    before: starts.length,
    after: newStarts.length,
    deleted_chars: orig.length - newText.length,
    modified: newText !== orig,
  };
}

function main() {
  const apply = process.argv.includes("--apply");
  console.log(`Mode: ${apply ? "APPLY" : "DRY RUN (use --apply to write)"}\n`);

  for (const slug of TARGETS) {
    const r = processFile(slug, apply);
    if (r.error) {
      console.log(`  ❌ ${slug}: ${r.error}`);
      continue;
    }
    const status = apply ? (r.modified ? "✅" : "(no change)") : "(would write)";
    console.log(
      `  ${slug}: ${r.before} → ${r.after} cards, -${r.deleted_chars} chars ${status}`
    );
  }

  if (!apply) console.log("\n→ Re-run with --apply to write changes.");
}

main();
