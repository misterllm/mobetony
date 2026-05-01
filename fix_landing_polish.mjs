// Final polish: drobné variace v og:title (Přerov ↔ Prostějov páry) +
// diferenciace Schema Service descriptions per město.
// Cíl: žádný 100% identical word set napříč LPs.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));

// === OG:TITLE diferenciace (jen Přerov + Prostějov páry s problémem) ===
const OG_TITLE = {
  "lesteny-beton-prerov":
    "Leštěný beton Přerov — průmyslový region, dílny i haly | MO Betony",
  "lesteny-beton-prostejov":
    "Leštěný beton Prostějov — pro RD, garáže, výrobu | MO Betony",
  "prumyslove-podlahy-prerov":
    "Průmyslové podlahy Přerov — drátkobeton pro haly Meopta, logistika | MO Betony",
  "prumyslove-podlahy-prostejov":
    "Průmyslové podlahy Prostějov — beton pro PCO, areály D46 | MO Betony",
  "betonove-podlahy-prerov":
    "Betonové podlahy Přerov — beton pro průmysl, dílny i RD | MO Betony",
  "betonove-podlahy-prostejov":
    "Betonové podlahy Prostějov — beton pro RD a moderní výstavbu | MO Betony",
};

// === SCHEMA SERVICE DESCRIPTION (line ~99) — diferenciace per město ===
// Format: stará → nová.
const SCHEMA_SERVICE = {
  // Lesteny-beton — už refokusované, jen mírně diferencovat per město
  "lesteny-beton-olomouc":
    "Realizace leštěného betonu v Olomouci a okolí — sídlo Kaštanová, 500+ projektů přímo v Olomouckém kraji. Hlazený beton se vsypem (Fortedur) i broušený do matu nebo vysokého lesku pro garáže RD, dílny, sklady, výrobní haly i interiéry rodinných domů.",
  "lesteny-beton-prerov":
    "Realizace leštěného betonu v Přerově a okolním průmyslovém regionu — dojezd 25 km z naší pobočky v Olomouci. Hlazený beton se vsypem (Fortedur) i broušený do lesku pro garáže RD, dílny, sklady, výrobní haly v okolí Meopta i Olympus.",
  "lesteny-beton-prostejov":
    "Realizace leštěného betonu v Prostějově (Drozdovice, Hloučela i okolní obce) — dojezd 30 minut z Olomouce. Hlazený beton se vsypem (Fortedur) i broušený do lesku pro garáže RD, dílny, sklady, haly i designové interiéry rodinných domů.",

  // Prumyslove
  "prumyslove-podlahy-olomouc":
    "Realizace průmyslových podlah v Olomouci a Olomouckém kraji — sídlo Kaštanová, 500+ projektů přímo v regionu. Drátkobetonové haly se vsypem (Fortedur, Panbex), pancéřové i hlazené plochy pro výrobny, sklady, logistiku. Až 1 000 m²/den.",
  "prumyslove-podlahy-prerov":
    "Realizace průmyslových podlah v Přerově a okolí — průmyslový region s tradicí strojírenství (Meopta, Olympus) a chemie (Precheza). Drátkobeton se vsypem, pancéřové podlahy pro nosnosti 30–60 t/m², chemicky odolné systémy, výkon až 1 500 m²/den u logistiky.",
  "prumyslove-podlahy-prostejov":
    "Realizace průmyslových podlah v Prostějově — areály PCO Prostějov, zóna u D46, středně velké výrobce (Mubea, Toray, Sigma). Drátkobeton se vsypem, FF35–FF50 rovinnost pro VZV provoz a automatizované sklady. Dojezd 25 minut z Olomouce.",

  // Anhydrit
  "anhydritove-podlahy-olomouc":
    "Lití anhydritových podlah v Olomouci a okolí — sídlo Kaštanová, 500+ projektů. Lité potěry pro podlahové topení v RD, bytech i veřejných budovách, pevnostní třídy CA-C20 až CA-C30, tloušťky 35–65 mm, výkon 600 m²/den.",
  "anhydritove-podlahy-prerov":
    "Lití anhydritových potěrů v Přerově a okolí — pro novostavby RD, byty i veřejné budovy. Ideální nosič podlahového topení (CA-C20 / CA-C30), nízká tloušťka od 35 mm nad trubkami dle ČSN 74 4505. Dojezd 25 km z Olomouce.",
  "anhydritove-podlahy-prostejov":
    "Lití anhydritových podlah v Prostějově (Drozdovice, Hloučela, okolní obce) — pro moderní RD a novostavby s podlahovým topením. Samonivelační, schne 21–28 dní, pod plovoucí podlahy, dlažbu i vinyl. Dojezd 30 minut z Olomouce.",

  // Betonove
  "betonove-podlahy-olomouc":
    "Realizace betonových podlah v Olomouci a Olomouckém kraji — sídlo Kaštanová, 500+ projektů. Hlazený beton pro RD a garáže, drátkobeton pro haly, leštěný beton pro showroomy, podkladní desky pro novostavby. Materiály z Cemexu a Českomoravského betonu.",
  "betonove-podlahy-prerov":
    "Realizace betonových podlah v Přerově a okolí — průmyslový region s chemií (Precheza), strojírenstvím (Meopta) a logistikou. Hlazený beton pro garáže a dílny, drátkobeton pro výrobní haly, podkladní desky pro novostavby, kombinace s epoxidy.",
  "betonove-podlahy-prostejov":
    "Realizace betonových podlah v Prostějově (Drozdovice, Hloučela, okolní obce) — pro RD, garáže, dílny, výrobní haly i průmyslové areály PCO. Hlazený beton, drátkobeton, leštěné varianty pro moderní interiéry, podkladní desky. Dojezd 25 minut z Olomouce.",
};

const OG_TITLE_RE = /<meta property="og:title" content="([^"]+)"\s*\/?>/;

function processFile(slug, apply) {
  const path = join(ROOT, slug, "index.html");
  if (!existsSync(path)) return { error: "not found" };

  const orig = readFileSync(path, "utf8");
  let txt = orig;
  let stats = {};

  // og:title
  const newOgTitle = OG_TITLE[slug];
  if (newOgTitle && OG_TITLE_RE.test(txt)) {
    txt = txt.replace(
      OG_TITLE_RE,
      `<meta property="og:title" content="${newOgTitle}" />`
    );
    stats.og_title = 1;
  }

  // Schema Service description — najdeme druhý "description" v <script type="application/ld+json">
  // a nahradíme. Pro robustnost: hledáme `"areaServed":` JSON klíč bezprostředně před nebo po
  // "description" v Service schema bloku.
  const newSchema = SCHEMA_SERVICE[slug];
  if (newSchema) {
    // Najdeme schema Service blok (obsahuje "areaServed": {"@type": "City"})
    // a v něm description property
    const serviceBlockRE = /("@type":\s*"Service"[\s\S]*?)"description":\s*"([^"]+)"/;
    const m = txt.match(serviceBlockRE);
    if (m) {
      const replaced = m[0].replace(
        /"description":\s*"[^"]+"/,
        `"description": "${newSchema}"`
      );
      txt = txt.replace(serviceBlockRE, replaced);
      stats.schema_service = 1;
    } else {
      // Fallback: bere druhý výskyt description (Organization je první)
      const allDescIdx = [];
      const re = /"description":\s*"([^"]+)"/g;
      let match;
      while ((match = re.exec(orig)) !== null) {
        allDescIdx.push({ start: match.index, end: re.lastIndex, full: match[0] });
      }
      if (allDescIdx.length >= 2) {
        const target = allDescIdx[1];
        const before = txt.slice(0, target.start);
        const after = txt.slice(target.end);
        txt = before + `"description": "${newSchema}"` + after;
        stats.schema_service = 1;
      }
    }
  }

  if (apply && txt !== orig) {
    writeFileSync(path, txt, "utf8");
  }
  return { stats, modified: txt !== orig };
}

function main() {
  const apply = process.argv.includes("--apply");
  console.log(`Mode: ${apply ? "APPLY" : "DRY RUN (use --apply to write)"}\n`);

  // Process všech 12 LPs (i ty co mají jen Schema fix)
  const allSlugs = Object.keys(SCHEMA_SERVICE);
  for (const slug of allSlugs) {
    const r = processFile(slug, apply);
    if (r.error) {
      console.log(`  ❌ ${slug}: ${r.error}`);
      continue;
    }
    const sum = Object.values(r.stats).reduce((a, b) => a + b, 0);
    const detail = Object.entries(r.stats)
      .map(([k, v]) => `${k}=${v}`)
      .join(" ");
    const status = apply ? (r.modified ? "✅" : "(no change)") : "(would write)";
    console.log(`  [${sum} edits] ${slug}: ${detail || "(nothing)"} ${status}`);
  }
  if (!apply) console.log("\n→ Re-run with --apply to write changes.");
}

main();
