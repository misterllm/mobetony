// Batch script: diferencuje hero subtitle text napříč 12 landing pages.
// Cíl: každé město má unikátní úhel/value prop v hero, ne jen jméno města.
//
// Strategy:
//   Olomouc   = sídlo Olomouc, velký počet realizací PŘÍMO V REGIONU
//   Přerov    = dostupnost, industriální mix (Meopta, Olympus, logistika)
//   Prostějov = bytová výstavba, novostavby, moderní RD
//
// Usage:
//   node fix_landing_subs.mjs           (dry run)
//   node fix_landing_subs.mjs --apply   (zápis)

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));

const SUBS = {
  // ========== LEŠTĚNÝ BETON ==========
  "lesteny-beton-olomouc":
    'Realizujeme <strong>leštěný beton v Olomouci a okolí</strong> — hlazený beton se vsypem (český standard, finalizováno do lehkého matu/podlesku hned po betonáži) i klasické broušení diamanty pro showroomy. <strong>500+ projektů přímo v Olomouckém kraji</strong>, sídlo Kaštanová. Nabídka do 48 hodin zdarma.',
  "lesteny-beton-prerov":
    'Leštěný beton <strong>pro Přerov a okolní průmyslový region</strong> — hlazený se vsypem (Fortedur) i broušený do polomatu nebo zrcadlového lesku. Realizujeme <strong>showroomy, kanceláře, výrobny i moderní RD</strong>. Dojezd 25 km z Olomouce, kompletní servis včetně impregnace. Nabídka do 48 h.',
  "lesteny-beton-prostejov":
    'Designový leštěný beton <strong>pro novostavby a interiéry v Prostějově</strong> — bezespárová podlaha pro RD v moderních čtvrtích, kanceláře, prodejny i komerční prostory. <strong>Hlazený se vsypem i broušený do lesku</strong>, kombinace s podlahovým topením. Dojezd 30 minut z Olomouce.',

  // ========== PRŮMYSLOVÉ PODLAHY ==========
  "prumyslove-podlahy-olomouc":
    'Realizujeme <strong>průmyslové podlahy v Olomouci a Olomouckém kraji</strong> — drátkobetonové haly se vsypy (Fortedur, Panbex), hlazený beton, pancéřové plochy pro výrobny, sklady a logistiku. <strong>Až 1 000 m² za den</strong>, materiály z Cemexu, sídlo Olomouc, 500+ projektů.',
  "prumyslove-podlahy-prerov":
    'Průmyslové podlahy <strong>pro přerovské haly, výrobny a logistiku</strong> — drátkobeton se vsypem, pancéřové podlahy pro vysoké zatížení (30–60 t/m²), chemicky odolné systémy pro provozy v okolí Prechezy. <strong>Železniční uzel Přerov = velké logistické zakázky</strong>, výkon až 1 500 m²/den.',
  "prumyslove-podlahy-prostejov":
    'Průmyslové podlahy <strong>pro výrobní haly a logistická centra v Prostějově</strong> — drátkobeton se vsypem, hlazený beton, podkladní desky pro PCO Prostějov, areály u D46 i středně velké výrobce. <strong>Specializace na FF35–FF50 rovinnost</strong> pro VZV provoz a automatizované sklady.',

  // ========== ANHYDRITOVÉ PODLAHY ==========
  "anhydritove-podlahy-olomouc":
    'Realizujeme <strong>anhydritové podlahy v Olomouci a okolí</strong> — lité potěry pro podlahové topení v RD, bytech i veřejných budovách. Pevnostní třídy CA-C20 až CA-C30, tloušťky 35–65 mm. <strong>Až 600 m² za den</strong>, sídlo Olomouc, kompletní servis včetně CM měření vlhkosti.',
  "anhydritove-podlahy-prerov":
    'Anhydritové potěry <strong>pro novostavby a rekonstrukce v Přerově</strong> — ideální nosič podlahového topení pro RD, byty i komerční stavby. Rychlá pokládka (600 m²/den), nízká pracovní výška od <strong>35 mm nad trubkami</strong> dle ČSN 74 4505. Dojezd 25 km z Olomouce.',
  "anhydritove-podlahy-prostejov":
    'Anhydritové podlahy <strong>pro moderní RD a novostavby v Prostějově</strong> — lité potěry s podlahovým topením v Drozdovicích, Hloučele i okolních obcích. <strong>Samonivelační, schne 21–28 dní</strong>, ideální pod plovoucí podlahy, dlažbu i vinyl. Kompletní servis včetně protokolu prvního topení.',

  // ========== BETONOVÉ PODLAHY ==========
  "betonove-podlahy-olomouc":
    'Realizujeme <strong>betonové podlahy v Olomouci a okolí</strong> — hlazený beton pro RD a garáže, drátkobeton pro haly, leštěný beton pro showroomy, podkladní desky pro novostavby. <strong>500+ realizací v regionu</strong>, sídlo Kaštanová, materiály z Cemexu a Českomoravského betonu.',
  "betonove-podlahy-prerov":
    'Betonové podlahy <strong>pro Přerov a celý průmyslový region</strong> — hlazený beton pro garáže a dílny, drátkobeton pro výrobní haly, podkladní desky pro novostavby. <strong>Speciality pro chemický průmysl</strong> (Precheza okolí), kombinace s epoxidovými stěrkami. Dostupné po celém Olomouckém kraji.',
  "betonove-podlahy-prostejov":
    'Betonové podlahy <strong>pro Prostějov — RD, dílny i průmyslové haly</strong>. Hlazený beton pro garáže, drátkobeton pro výrobny, leštěné varianty pro moderní interiéry, podkladní desky pro novostavby. <strong>Dojezd 25 minut z Olomouce</strong>, technika i materiál na velké zakázky 1 000+ m².',
};

// Regex: <p class="lp-hero-sub">…</p>
const SUB_RE = /<p class="lp-hero-sub">[\s\S]+?<\/p>/;

function processFile(slug, apply) {
  const path = join(ROOT, slug, "index.html");
  if (!existsSync(path)) return { error: "not found" };
  const newSub = SUBS[slug];
  if (!newSub) return { error: "no sub defined" };

  const orig = readFileSync(path, "utf8");
  const matched = orig.match(SUB_RE);
  if (!matched) return { error: "no lp-hero-sub found" };

  const replacement = `<p class="lp-hero-sub">${newSub}</p>`;
  const txt = orig.replace(SUB_RE, replacement);

  if (apply && txt !== orig) {
    writeFileSync(path, txt, "utf8");
  }
  return { modified: txt !== orig, matched_len: matched[0].length, new_len: replacement.length };
}

function main() {
  const apply = process.argv.includes("--apply");
  console.log(`Mode: ${apply ? "APPLY" : "DRY RUN (use --apply to write)"}\n`);

  for (const slug of Object.keys(SUBS)) {
    const r = processFile(slug, apply);
    if (r.error) {
      console.log(`  ❌ ${slug}: ${r.error}`);
      continue;
    }
    const status = apply ? (r.modified ? "✅" : "(no change)") : "(would write)";
    console.log(
      `  ${slug}: ${r.matched_len} → ${r.new_len} chars ${status}`
    );
  }
  if (!apply) console.log("\n→ Re-run with --apply to write changes.");
}

main();
