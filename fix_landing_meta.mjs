// Batch script: diferencuje title, meta description, og:title, og:description
// napříč 12 landing pages (4 služby × 3 města) — eliminuje duplicit content signal.
//
// Strategy:
//   Olomouc   = HOME BASE → cena v title, "sídlo Olomouc"
//   Přerov    = secondary industriální → dostupnost, Meopta/Olympus kontext
//   Prostějov = secondary residenční → bytová výstavba, novostavby
//
// Usage:
//   node fix_landing_meta.mjs           (dry run — print diffs)
//   node fix_landing_meta.mjs --apply   (zápis)

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));

// MAPA: pro každou landing page nové title/meta/og hodnoty.
// Klíče: slug souboru. Hodnoty: { title, desc, og_title, og_desc }
const META = {
  // ========== LEŠTĚNÝ BETON ==========
  "lesteny-beton-olomouc": {
    title: "Leštěný beton Olomouc — designová podlaha od 800 Kč/m² | MO Betony",
    desc: "Leštěný beton v Olomouci od 800 Kč/m² (2026). Hlazený beton se vsypem (český standard) i broušený do matu, polomatu i zrcadlového lesku. RD, showroomy, kanceláře. Sídlo Olomouc, kalkulace do 48 h.",
    og_title: "Leštěný beton Olomouc — od 800 Kč/m² | MO Betony",
    og_desc: "Designová leštěná podlaha pro RD, showroomy a kanceláře v Olomouci. Hlazený i broušený beton od 800 Kč/m². Nabídka do 48 hodin zdarma.",
  },
  "lesteny-beton-prerov": {
    title: "Leštěný beton Přerov — broušený beton pro showroomy a kanceláře | MO Betony",
    desc: "Realizujeme leštěný beton v Přerově — bezespárová designová podlaha pro showroomy, kanceláře, výrobny a RD. Polomatný i vysoký lesk od 800 Kč/m². Dojezd 25 km z Olomouce, kalkulace do 48 h.",
    og_title: "Leštěný beton Přerov — pro showroomy, kanceláře, RD | MO Betony",
    og_desc: "Bezespárový leštěný beton v Přerově pro showroomy automotive, kanceláře v centru i moderní RD. Od 800 Kč/m², nabídka do 48 hodin.",
  },
  "lesteny-beton-prostejov": {
    title: "Leštěný beton Prostějov — designový beton pro RD a interiéry | MO Betony",
    desc: "Leštěný beton v Prostějově pro novostavby RD, moderní interiéry, showroomy a komerční prostory. Hlazený se vsypem i broušený do lesku, od 800 Kč/m². Dojezd 30 min z Olomouce.",
    og_title: "Leštěný beton Prostějov — pro RD a moderní interiéry | MO Betony",
    og_desc: "Leštěný beton v Prostějově — designová podlaha pro novostavby a rekonstrukce. Hlazený i broušený, od 800 Kč/m².",
  },

  // ========== PRŮMYSLOVÉ PODLAHY ==========
  "prumyslove-podlahy-olomouc": {
    title: "Průmyslové podlahy Olomouc — drátkobeton od 550 Kč/m² | MO Betony",
    desc: "Průmyslová podlaha v Olomouci od 550 Kč/m² (2026). Drátkobeton se vsypem Fortedur a Panbex pro výrobní haly, sklady, logistická centra. Až 1 000 m²/den, sídlo Olomouc, 500+ projektů.",
    og_title: "Průmyslové podlahy Olomouc — od 550 Kč/m² | MO Betony",
    og_desc: "Drátkobetonová podlaha se vsypem pro haly v Olomouci. Až 1 000 m²/den, materiály z Cemexu, kalkulace do 48 h.",
  },
  "prumyslove-podlahy-prerov": {
    title: "Průmyslové podlahy Přerov — pancéřové podlahy pro výrobní haly | MO Betony",
    desc: "Průmyslové podlahy v Přerově — drátkobeton se vsypem, pancéřové i hlazené plochy pro výrobní haly, sklady a logistická centra. Až 1 000 m²/den, dostupnost po celém Olomouckém i Moravskoslezském kraji.",
    og_title: "Průmyslové podlahy Přerov — pro haly, sklady, logistiku | MO Betony",
    og_desc: "Drátkobeton se vsypem, pancéřové podlahy a hlazený beton pro haly v Přerově a okolí. Až 1 000 m²/den.",
  },
  "prumyslove-podlahy-prostejov": {
    title: "Průmyslové podlahy Prostějov — beton pro výrobní haly a sklady | MO Betony",
    desc: "Průmyslové podlahy v Prostějově pro výrobní haly, sklady, logistická centra a dílny. Drátkobeton se vsypem od 550 Kč/m². Velké plochy nad 1 000 m² s výhodnou cenou.",
    og_title: "Průmyslové podlahy Prostějov — pro výrobu a logistiku | MO Betony",
    og_desc: "Drátkobeton, vsypy a hlazený beton pro haly v Prostějově. Velké plochy se slevou, kalkulace do 48 h.",
  },

  // ========== ANHYDRITOVÉ PODLAHY ==========
  "anhydritove-podlahy-olomouc": {
    title: "Anhydritové podlahy Olomouc — lité potěry od 320 Kč/m² | MO Betony",
    desc: "Anhydritové podlahy v Olomouci od 320 Kč/m² (2026). Lité potěry pro podlahové topení v RD, bytech i veřejných budovách. Až 600 m²/den, sídlo Olomouc, kalkulace zdarma do 48 h.",
    og_title: "Anhydritové podlahy Olomouc — od 320 Kč/m² | MO Betony",
    og_desc: "Lité anhydritové potěry pro podlahové topení v Olomouci. Až 600 m²/den, sídlo Olomouc, nabídka do 48 hodin.",
  },
  "anhydritove-podlahy-prerov": {
    title: "Anhydritové podlahy Přerov — lité potěry pro RD a podlahové topení | MO Betony",
    desc: "Anhydritové potěry v Přerově pro novostavby RD, byty a veřejné budovy. Ideální nosič podlahového topení (CA-C20 / CA-C30). Až 600 m²/den, dojezd 25 km z Olomouce, kalkulace do 48 h.",
    og_title: "Anhydritové podlahy Přerov — pro RD a podlahové topení | MO Betony",
    og_desc: "Lité anhydritové potěry pro podlahové topení v Přerově. Pro novostavby RD i rekonstrukce.",
  },
  "anhydritove-podlahy-prostejov": {
    title: "Anhydritové podlahy Prostějov — anhydrit s podlahovým topením | MO Betony",
    desc: "Anhydritové podlahy v Prostějově pro novostavby a rekonstrukce. Ideální nosič podlahového topení v rodinných domech i bytech. Od 320 Kč/m², 600 m²/den, kalkulace zdarma do 48 h.",
    og_title: "Anhydritové podlahy Prostějov — anhydrit pro topení | MO Betony",
    og_desc: "Lité anhydritové potěry v Prostějově — ideální pro podlahové topení v RD a novostavbách. Od 320 Kč/m².",
  },

  // ========== BETONOVÉ PODLAHY ==========
  "betonove-podlahy-olomouc": {
    title: "Betonové podlahy Olomouc — od 260 Kč/m² pro RD i haly | MO Betony",
    desc: "Betonová podlaha v Olomouci od 260 Kč/m² (2026). Hlazený beton, drátkobeton, leštěný beton, podkladní desky. RD, garáže, dílny, výrobní haly. Sídlo Olomouc, nabídka do 48 h.",
    og_title: "Betonové podlahy Olomouc — od 260 Kč/m² | MO Betony",
    og_desc: "Hlazený, drátkobetonový i leštěný beton v Olomouci. Pro RD, garáže, dílny i průmyslové haly.",
  },
  "betonove-podlahy-prerov": {
    title: "Betonové podlahy Přerov — hlazený a drátkobetonový pro haly i RD | MO Betony",
    desc: "Betonové podlahy v Přerově — hlazený beton pro garáže a dílny, drátkobeton pro výrobní haly, podkladní desky pro novostavby. Od 260 Kč/m². Dostupné v celém Olomouckém kraji.",
    og_title: "Betonové podlahy Přerov — pro haly, dílny, RD | MO Betony",
    og_desc: "Hlazený beton, drátkobeton a podkladní desky pro Přerov a okolí. Od 260 Kč/m², kalkulace do 48 h.",
  },
  "betonove-podlahy-prostejov": {
    title: "Betonové podlahy Prostějov — beton pro RD, garáže a haly | MO Betony",
    desc: "Betonové podlahy v Prostějově pro RD, garáže, dílny i průmyslové haly. Hlazený beton, drátkobeton i leštěné varianty. Od 260 Kč/m², kalkulace zdarma do 48 h.",
    og_title: "Betonové podlahy Prostějov — beton pro RD a haly | MO Betony",
    og_desc: "Hlazený a drátkobetonový beton pro Prostějov — RD, garáže, dílny i výrobní haly. Od 260 Kč/m².",
  },
};

// Regex patterns pro substituci v <head>
const TITLE_RE = /<title>[^<]+<\/title>/;
const DESC_RE = /<meta name="description" content="[^"]+"\s*\/?>/;
const OG_TITLE_RE = /<meta property="og:title" content="[^"]+"\s*\/?>/;
const OG_DESC_RE = /<meta property="og:description" content="[^"]+"\s*\/?>/;

function processFile(slug, apply) {
  const path = join(ROOT, slug, "index.html");
  if (!existsSync(path)) return { error: "not found" };
  const meta = META[slug];
  if (!meta) return { error: "no meta defined" };

  const orig = readFileSync(path, "utf8");
  let txt = orig;

  const replacements = [
    { re: TITLE_RE, new: `<title>${meta.title}</title>`, label: "title" },
    {
      re: DESC_RE,
      new: `<meta name="description" content="${meta.desc}" />`,
      label: "desc",
    },
    {
      re: OG_TITLE_RE,
      new: `<meta property="og:title" content="${meta.og_title}" />`,
      label: "og_title",
    },
    {
      re: OG_DESC_RE,
      new: `<meta property="og:description" content="${meta.og_desc}" />`,
      label: "og_desc",
    },
  ];

  const stats = {};
  for (const r of replacements) {
    const matched = orig.match(r.re);
    stats[r.label] = matched ? 1 : 0;
    if (matched) txt = txt.replace(r.re, r.new);
  }

  if (apply && txt !== orig) {
    writeFileSync(path, txt, "utf8");
  }

  return { stats, modified: txt !== orig };
}

function main() {
  const apply = process.argv.includes("--apply");
  console.log(`Mode: ${apply ? "APPLY" : "DRY RUN (use --apply to write)"}\n`);

  let total = 0;
  for (const slug of Object.keys(META)) {
    const r = processFile(slug, apply);
    if (r.error) {
      console.log(`  SKIP ${slug}: ${r.error}`);
      continue;
    }
    const sum = Object.values(r.stats).reduce((a, b) => a + b, 0);
    total += sum;
    const detail = Object.entries(r.stats)
      .map(([k, v]) => `${k}=${v}`)
      .join(" ");
    console.log(`  [${sum}/4] ${slug}: ${detail}`);
  }
  console.log(`\nTotal: ${total} replacements across ${Object.keys(META).length} pages.`);
  if (!apply) console.log("\n→ Re-run with --apply to write changes.");
}

main();
