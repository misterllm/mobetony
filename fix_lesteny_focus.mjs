// Batch script: REFOCUS lesteny-beton LP z "showroomy/kanceláře" na REÁLNÝ trh ČR.
// Marty's correction: leštěný beton se v ČR dělá hlavně pro garáže RD, dílny,
// sklady, výrobní haly. Showroomy/kanceláře jsou výjimka, ne pravidlo.
//
// Mění: title, meta description, og:title, og:description, hero subtitle,
// lokální sekce H2 + 4 paragraphs (jen Přerov + Prostějov, Olomouc nemá lokální sekci).
//
// Usage:
//   node fix_lesteny_focus.mjs           (dry run)
//   node fix_lesteny_focus.mjs --apply   (zápis)

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));

// ====== HEAD META (title, desc, og) ======
const META = {
  "lesteny-beton-olomouc": {
    title: "Leštěný beton Olomouc — pro garáže, dílny, haly i RD od 800 Kč/m² | MO Betony",
    desc: "Leštěný beton v Olomouci od 800 Kč/m² (2026). Pro garáže rodinných domů, dílny, sklady, výrobní haly i interiéry RD. Hlazený se vsypem (Fortedur) i broušený do matu nebo vysokého lesku. Sídlo Olomouc, kalkulace do 48 h.",
    og_title: "Leštěný beton Olomouc — pro garáže, dílny, haly i RD | MO Betony",
    og_desc: "Praktický a designový leštěný beton pro garáže RD, dílny, sklady, výrobní haly i interiéry. Olomouc, od 800 Kč/m², nabídka do 48 hodin.",
  },
  "lesteny-beton-prerov": {
    title: "Leštěný beton Přerov — pro garáže, dílny, sklady i haly | MO Betony",
    desc: "Leštěný beton v Přerově pro garáže rodinných domů, dílny, sklady, výrobní haly i interiéry RD. Hlazený se vsypem (Fortedur) i broušený, od 800 Kč/m². Dojezd 25 km z Olomouce, kalkulace do 48 h.",
    og_title: "Leštěný beton Přerov — pro garáže RD, dílny, haly | MO Betony",
    og_desc: "Leštěný beton v Přerově pro garáže, dílny, sklady, haly i interiéry RD. Hlazený i broušený, od 800 Kč/m².",
  },
  "lesteny-beton-prostejov": {
    title: "Leštěný beton Prostějov — pro RD, garáže, dílny i haly | MO Betony",
    desc: "Leštěný beton v Prostějově pro rodinné domy (interiéry, garáže), dílny, sklady i průmyslové haly. Hlazený se vsypem i broušený, od 800 Kč/m². Dojezd 30 minut z Olomouce.",
    og_title: "Leštěný beton Prostějov — pro RD, garáže, dílny i haly | MO Betony",
    og_desc: "Leštěný beton v Prostějově pro RD, garáže, dílny, sklady i výrobní haly. Hlazený i broušený, od 800 Kč/m².",
  },
};

// ====== HERO SUBTITLE ======
const SUBS = {
  "lesteny-beton-olomouc":
    'Realizujeme <strong>leštěný beton v Olomouci a okolí</strong> — pro <strong>garáže rodinných domů, dílny, sklady, výrobní haly</strong> i interiéry RD. Hlazený se vsypem (Fortedur, finalizováno hned po betonáži do matu/podlesku) i broušený do středního a vysokého lesku. <strong>500+ projektů přímo v Olomouckém kraji</strong>, sídlo Kaštanová.',
  "lesteny-beton-prerov":
    'Leštěný beton <strong>pro Přerov a okolní průmyslový region</strong> — <strong>garáže rodinných domů, dílny, sklady, výrobní haly</strong> i interiéry RD. Hlazený se vsypem (Fortedur — odolný proti otěru i agresivním médiím) nebo broušený do středního lesku. Dojezd 25 km z Olomouce, kompletní servis včetně impregnace.',
  "lesteny-beton-prostejov":
    'Leštěný beton <strong>pro Prostějov a okolí</strong> — <strong>garáže rodinných domů, dílny, sklady, výrobní haly</strong> i interiéry RD v Drozdovicích, Hloučele a okolních obcích. Hlazený se vsypem (Fortedur) i broušený do polomatu, kombinace s podlahovým topením. Dojezd 30 minut z Olomouce.',
};

// ====== LOKÁLNÍ SEKCE — H2 + 4 paragraphs (Přerov + Prostějov) ======
// Olomouc nemá lokální sekci, jen meta/sub.
const LOCAL = {
  "lesteny-beton-prerov": {
    h2: 'Leštěný beton pro <span class="orange">garáže, dílny a haly</span> v Přerově',
    paragraphs: [
      `<strong style="color: var(--white);">Přerov je průmyslové město a tomu odpovídá i typická poptávka.</strong> Drtivá většina našich realizací leštěného betonu v Přerově jsou <strong style="color: var(--white);">garáže rodinných domů, dílny, sklady a výrobní haly</strong> — Meopta, Olympus, areály v okolí Prechezy, sklady u železničního uzlu. Standard je hlazený beton se vsypem (Fortedur — odolnost proti otěru i lehkým chemikáliím), finalizovaný hned po betonáži do lehkého matu/podlesku. Cena 800 Kč/m² (matný) až 1 500 Kč/m² (vysoký lesk).`,
      `<strong style="color: var(--white);">Garáže RD = nejčastější realizace.</strong> V garáži snese leštěný beton nejen váhu auta, ale i únik provozních kapalin (oleje, palivo, brzdová), skvrny od pneumatik a soli ze zimní vozovky. Při běžné údržbě (mop pH neutral) vydrží 20+ let bez výrazného opotřebení. V Přerově realizujeme garáže RD typicky 25–80 m², dílny 60–200 m². V kombinaci s vsypovým hlazením je to bezúdržbová varianta na celý život domu.`,
      `<strong style="color: var(--white);">Sklady, výrobny, haly.</strong> Pro logistická a výrobní zařízení v Přerově (Olomouc-Prostějov-Přerov logistický trojúhelník) realizujeme leštěné drátkobetonové haly o ploše 500–5 000 m². Hlazený beton se vsypem zde nahrazuje epoxid — výhoda: žádné odlupování při bodovém zatížení regálů, snadná oprava bodových vad bez výměny celého povrchu, životnost 25+ let. Pro speciální chemické provozy doplňujeme epoxidovou nebo polyuretan-cementovou nadstavbu.`,
      `<strong style="color: var(--white);">Občas i interiér RD a komerční showroom.</strong> Méně častou variantou je broušený leštěný beton do interiéru rodinného domu (typicky 80–180 m², plovoucí design styl s podlahovým topením) nebo do showroomu/prodejny. Tyto realizace děláme jako designové projekty s probarvením a vyšším leskem (1 200–1 500 Kč/m²). Doprava z Olomouce 25 km, servis a re-impregnace po 2–3 letech.`,
    ],
  },
  "lesteny-beton-prostejov": {
    h2: 'Leštěný beton pro <span class="orange">RD, garáže a haly</span> v Prostějově',
    paragraphs: [
      `<strong style="color: var(--white);">V Prostějově realizujeme leštěný beton hlavně pro praktické použití</strong> — <strong style="color: var(--white);">garáže rodinných domů</strong> v Drozdovicích, Hloučele a okolních obcích, <strong style="color: var(--white);">dílny, sklady a výrobní haly</strong> v PCO Prostějov, areálech u D46 a okolních obcí. Občas také jako <strong style="color: var(--white);">designový interiér RD</strong> (obytné prostory nebo zádveří). Hlazený se vsypem (Fortedur) i broušený, ceny 800 Kč/m² (mat) až 1 500 Kč/m² (zrcadlový lesk).`,
      `<strong style="color: var(--white);">Garáže RD = nejčastější zakázka.</strong> Standard pro novostavby i rekonstrukce v Drozdovicích, Hloučele, Vrahovicích — typicky 25–60 m², hlazený beton se vsypem (matný/lehký podlesk). V garáži vydrží zatížení autem, agresivní solanku ze zimní vozovky i úniky paliv a olejů. Údržba: pravidelný mop pH neutral. Životnost 20+ let bez výměny.`,
      `<strong style="color: var(--white);">Dílny, sklady a výrobní haly.</strong> Pro průmyslové areály v Prostějově (PCO Prostějov, areály u D46, středně velké výrobce typu Mubea, Toray, Sigma) realizujeme drátkobetonové haly se vsypovým leštěním. Plochy 500–5 000 m², nosnost 30–60 t/m², životnost 25+ let. Pro VZV provoz a paletové stojany ideální alternativa k epoxidovým podlahám — žádné odlupování, snadná lokální oprava, nízké nároky na údržbu.`,
      `<strong style="color: var(--white);">Občas i interiér RD a komerce.</strong> Méně častou variantou je broušený leštěný beton v interiéru novostaveb RD (kombinace s podlahovým topením, plovoucí design styl, 80–180 m², střední až vysoký lesk) nebo v menších showroomech a prodejnách v centru. Tyto designové realizace děláme s probarvením a vyšším leskem (1 200–1 500 Kč/m²). Dojezd z Olomouce 30 minut, servis a re-impregnace po 2–3 letech.`,
    ],
  },
};

// ====== Regex patterns ======
const TITLE_RE = /<title>[^<]+<\/title>/;
const DESC_RE = /<meta name="description" content="[^"]+"\s*\/?>/;
const OG_TITLE_RE = /<meta property="og:title" content="[^"]+"\s*\/?>/;
const OG_DESC_RE = /<meta property="og:description" content="[^"]+"\s*\/?>/;
const SUB_RE = /<p class="lp-hero-sub">[\s\S]+?<\/p>/;

// Lokální sekce: <section>...</section> blok začínající "<!-- ========== UNIKÁTNÍ LOKÁLNÍ KONTEXT ========== -->"
const LOCAL_BLOCK_RE =
  /<!-- ========== UNIK[ÁA]TN[ÍI] LOK[ÁA]LN[ÍI] KONTEXT ========== -->\s*<section[^>]*>[\s\S]*?<\/section>/;

function buildLocalBlock(slug) {
  const data = LOCAL[slug];
  if (!data) return null;
  const cityLabel = slug.endsWith("-prerov")
    ? "Přerov · Olomoucký kraj"
    : "Prostějov · Olomoucký kraj";

  const paras = data.paragraphs
    .map((p, i) => {
      const margin = i === data.paragraphs.length - 1 ? "" : ' style="margin-bottom: 1.25rem;"';
      return `        <p${margin}>${p}</p>`;
    })
    .join("\n");

  return `<!-- ========== UNIKÁTNÍ LOKÁLNÍ KONTEXT ========== -->
  <section style="background: var(--bg2); padding: 4rem 2rem; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);">
    <div style="max-width: 800px; margin: 0 auto;">
      <div class="section-label fade-in" style="color: var(--orange);">${cityLabel}</div>
      <h2 class="section-title fade-in" style="margin-top: 0.5rem;">${data.h2}</h2>
      <div style="margin-top: 2rem; color: var(--gray); line-height: 1.85; font-size: 1.05rem;">
${paras}
      </div>
    </div>
  </section>`;
}

function processFile(slug, apply) {
  const path = join(ROOT, slug, "index.html");
  if (!existsSync(path)) return { error: "not found" };

  const orig = readFileSync(path, "utf8");
  let txt = orig;
  const stats = {};

  // 1. Meta
  const meta = META[slug];
  if (meta) {
    if (TITLE_RE.test(txt)) {
      txt = txt.replace(TITLE_RE, `<title>${meta.title}</title>`);
      stats.title = 1;
    }
    if (DESC_RE.test(txt)) {
      txt = txt.replace(DESC_RE, `<meta name="description" content="${meta.desc}" />`);
      stats.desc = 1;
    }
    if (OG_TITLE_RE.test(txt)) {
      txt = txt.replace(OG_TITLE_RE, `<meta property="og:title" content="${meta.og_title}" />`);
      stats.og_title = 1;
    }
    if (OG_DESC_RE.test(txt)) {
      txt = txt.replace(OG_DESC_RE, `<meta property="og:description" content="${meta.og_desc}" />`);
      stats.og_desc = 1;
    }
  }

  // 2. Hero subtitle
  if (SUBS[slug] && SUB_RE.test(txt)) {
    txt = txt.replace(SUB_RE, `<p class="lp-hero-sub">${SUBS[slug]}</p>`);
    stats.hero_sub = 1;
  }

  // 3. Lokální sekce
  if (LOCAL[slug]) {
    const newBlock = buildLocalBlock(slug);
    if (LOCAL_BLOCK_RE.test(txt)) {
      txt = txt.replace(LOCAL_BLOCK_RE, newBlock);
      stats.local_section = 1;
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

  const slugs = ["lesteny-beton-olomouc", "lesteny-beton-prerov", "lesteny-beton-prostejov"];
  for (const slug of slugs) {
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
    console.log(`  [${sum} edits] ${slug}: ${detail} ${status}`);
  }
  if (!apply) console.log("\n→ Re-run with --apply to write changes.");
}

main();
