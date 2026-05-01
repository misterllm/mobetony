// REAL REFERENCES: nahrazuje placeholder reference karty v 8 ne-Olomouc LP
// reálnými realizacemi z fotek v /img/landing/.
//
// Data mapping níže (CARDS) — vychází z Marty's seznamu fotek + popisků.
// "vsude pouzivame 'leštěný beton' (CZ verze), nikdy 'broušený'"
//
// Usage:
//   node fix_landing_real_refs.mjs           (dry run)
//   node fix_landing_real_refs.mjs --apply   (zápis)

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));

// Card data: 8 ne-Olomouc LP × 2 cards = 16 reference karet
const CARDS = {
  // ========== LEŠTĚNÝ BETON ==========
  "lesteny-beton-prerov": [
    {
      img: "lesteny-beton-prerov-sklad-agro-objekt.webp",
      alt: "Leštěný beton v zemědělském skladu Přerov, 420 m² hlazený beton se vsypem Fortedur",
      loc: "Přerov · Zemědělský sklad",
      h3: "Zemědělský sklad — Přerov",
      meta: ["420 m²", "Hlazený beton", "Vsyp Fortedur", "Lehký podlesk"],
      p: "Leštěná podlaha v zemědělském skladu (420 m²) — hlazený beton se vsypem Fortedur, finalizovaný hned po betonáži do lehkého podlesku. Odolný proti otěru zemědělské techniky, prachu, vlhkosti i agresivním látkám z hnojiv. Snadná údržba, životnost 25+ let.",
    },
    {
      img: "lesteny-beton-prerov-garaz-rekonstrukce-autoservis.webp",
      alt: "Leštěný beton po rekonstrukci garáže autoservisu Přerov, hlazený beton se vsypem",
      loc: "Přerov · Autoservis",
      h3: "Rekonstrukce garáže autoservisu",
      meta: ["Hlazený beton", "Vsyp Fortedur", "Rekonstrukce", "Heavy-duty"],
      p: "Rekonstrukce podlahy v garáži autoservisu — leštěný beton se vsypem Fortedur, odolnost proti olejům, brzdové kapalině, palivu i mechanickému namáhání zvedáků a manipulační techniky. Životnost 25+ let bez výměny.",
    },
  ],
  "lesteny-beton-prostejov": [
    {
      img: "lesteny-beton-prostejov-prodejna.webp",
      alt: "Leštěný beton v prodejně Prostějov, 210 m² hlazený beton se vsypem Fortedur",
      loc: "Prostějov · Prodejna",
      h3: "Prodejna — Prostějov",
      meta: ["210 m²", "Hlazený beton", "Vsyp Fortedur", "Polomatný lesk"],
      p: "Leštěná podlaha v prodejně (210 m²) — hlazený beton se vsypem Fortedur, finalizovaný do polomatného lesku. Odolný proti vysokému provozu zákazníků, vozíků, prachu i běžným čisticím prostředkům. Vzhled doplňuje moderní design prodejny.",
    },
    {
      img: "lesteny-beton-prostejov-prumyslova-zona.webp",
      alt: "Leštěný beton v průmyslové zóně Prostějov, 380 m² drátkobeton se vsypem Fortedur",
      loc: "Prostějov · Průmyslová zóna",
      h3: "Průmyslová zóna — Prostějov",
      meta: ["380 m²", "Drátkobeton", "Vsyp Fortedur", "Matný lesk"],
      p: "Drátkobetonová podlaha v průmyslové zóně Prostějova (380 m²) s vsypovým hlazením. Odolnost vůči VZV provozu, paletovým stojanům i bodovému zatížení. Životnost 25+ let bez výměny — dlouhodobá alternativa k epoxidovým systémům, bez rizika odlupování.",
    },
  ],

  // ========== PRŮMYSLOVÉ PODLAHY ==========
  "prumyslove-podlahy-prerov": [
    {
      img: "prumyslova-podlaha-prerov-dratkobeton.webp",
      alt: "Drátkobetonová průmyslová podlaha Přerov, 800 m² strojně hlazená s vsypem Fortedur",
      loc: "Přerov · Drátkobetonová hala",
      h3: "Drátkobetonová hala — Přerov",
      meta: ["800 m²", "Drátkobeton", "Vsyp Fortedur", "Strojně hlazené"],
      p: "Drátkobetonová průmyslová podlaha (800 m²) v Přerově — strojně hlazené plochy s vsypovým systémem Fortedur. Vyztužení ocelovými drátky 25–30 kg/m³, bez kari sítí. Nosnost 30–60 t/m², životnost 25+ let, výkon až 1 000 m² za den.",
    },
    {
      img: "prumyslova-podlaha-prerov-montazni-dilna.webp",
      alt: "Průmyslová podlaha v montážní dílně Přerov, 550 m² hlazený drátkobeton se vsypem",
      loc: "Přerov · Montážní dílna",
      h3: "Montážní dílna — Přerov",
      meta: ["550 m²", "Drátkobeton", "Vsyp Fortedur", "Hlazený"],
      p: "Hlazená drátkobetonová podlaha v montážní dílně (550 m²) — vsyp Fortedur pro odolnost vůči otěru, mechanickému namáhání, mastnotám i únikům technologických kapalin. Snadná lokální oprava bodových vad bez nutnosti výměny celého povrchu.",
    },
  ],
  "prumyslove-podlahy-prostejov": [
    {
      img: "prumyslova-podlaha-prostejov-sklad-soucastek.webp",
      alt: "Průmyslová podlaha ve skladu součástek Prostějov, 550 m² drátkobeton se vsypem",
      loc: "Prostějov · Sklad součástek",
      h3: "Sklad součástek — Prostějov",
      meta: ["550 m²", "Drátkobeton", "Vsyp Fortedur", "Vysoká rovinnost"],
      p: "Drátkobetonová podlaha ve skladu součástek (550 m²) Prostějov — vsyp Fortedur, vysoká rovinnost FF35+ pro VZV provoz a paletové stojany. Bezprašnost, snadná údržba, nosnost 30–50 t/m², životnost 25+ let.",
    },
    {
      img: "prumyslova-podlaha-prostejov-hala.webp",
      alt: "Venkovní manipulační plocha před průmyslovou halou Prostějov, 415 m² drátkobeton",
      loc: "Prostějov · Venkovní plocha",
      h3: "Venkovní plocha před halou — Prostějov",
      meta: ["415 m²", "Drátkobeton", "Exteriér", "Manipulační plocha"],
      p: "Venkovní manipulační plocha před průmyslovou halou (415 m²) — drátkobeton s vyšší pevnostní třídou pro mrazovou odolnost, expoziční dilatace a drsný protiskluzový povrch pro VZV provoz a kamionovou dopravu.",
    },
  ],

  // ========== ANHYDRITOVÉ PODLAHY ==========
  "anhydritove-podlahy-prerov": [
    {
      img: "anhydrit-prerov-bytovy-dum.webp",
      alt: "Anhydritová litá podlaha v bytovém domě Přerov, 8 bytů s podlahovým topením",
      loc: "Přerov · Bytový dům",
      h3: "Bytový dům 8 bytů — Přerov",
      meta: ["8 bytů", "Anhydrit", "S podlahovým topením", "CA-C20"],
      p: "Lití anhydritových podlah v bytovém domě (8 bytů) — kompletní realizace včetně přípravy podkladu, izolací, podlahového topení a CA-C20 anhydritu. Tloušťka 55–65 mm nad teplovodními trubkami, výkon 600 m²/den, schne 21–28 dní.",
    },
    {
      img: "anhydrit-prerov-rodinny-dum-1.webp",
      alt: "Anhydritová podlaha v rodinném domě Přerov, 220 m² lité potěry s podlahovým topením",
      loc: "Přerov · Rodinný dům",
      h3: "Rodinný dům — Přerov",
      meta: ["220 m²", "Anhydrit", "S podlahovým topením", "CA-C20"],
      p: "Lití anhydritového potěru v rodinném domě (220 m²) — ideální nosič podlahového topení, samonivelační, bez prasklin při dodržení dilatačních polí. Tloušťka 55–70 mm nad teplovodními trubkami, schne 21–28 dní, kompatibilní se všemi finálními krytinami.",
    },
  ],
  "anhydritove-podlahy-prostejov": [
    {
      img: "bytovy-komplex.webp",
      alt: "Anhydritová podlaha v bytovém komplexu Prostějov, 24 bytů s podlahovým topením",
      loc: "Prostějov · Bytový komplex",
      h3: "Bytový komplex 24 bytů — Prostějov",
      meta: ["24 bytů", "Anhydrit", "S podlahovým topením", "CA-C20"],
      p: "Lití anhydritových podlah v bytovém komplexu (24 bytů) Prostějov — kompletní realizace včetně podlahového topení a izolací. CA-C20, tloušťka 55–65 mm nad trubkami, výkon 600 m²/den. Bezešvý povrch ideální pro plovoucí podlahy, dlažbu i vinyl.",
    },
    {
      img: "anhydrit-prostejov-rodinny-dum-kojetinska.webp",
      alt: "Anhydritová podlaha v rodinném domě Prostějov Kojetínská, lité potěry s podlahovým topením",
      loc: "Prostějov · Kojetínská",
      h3: "Rodinný dům — Kojetínská",
      meta: ["Anhydrit", "CA-C20", "S podlahovým topením", "Novostavba"],
      p: "Lití anhydritového potěru v rodinném domě v ulici Kojetínská — ideální nosič podlahového topení, samonivelační povrch s minimálním šlemem při správné technologii. Schne 21–28 dní, kompatibilní s plovoucí podlahou, dlažbou i vinylem.",
    },
  ],

  // ========== BETONOVÉ PODLAHY ==========
  "betonove-podlahy-prerov": [
    {
      img: "betonova-podlaha-prerov-rekonstrukce-stredisko.webp",
      alt: "Rekonstrukce betonové podlahy ve středisku Přerov, hlazený beton se vsypem",
      loc: "Přerov · Rekonstrukce střediska",
      h3: "Rekonstrukce střediska — Přerov",
      meta: ["Hlazený beton", "Rekonstrukce", "Vsyp Fortedur", "Heavy-duty"],
      p: "Kompletní rekonstrukce betonové podlahy ve středisku Přerov — odstranění původního povrchu, příprava podkladu, nový hlazený beton se vsypem Fortedur. Rychlá realizace s minimálním omezením provozu, životnost dalších 25+ let.",
    },
    {
      img: "betonova-podlaha-prerov-otevreny-prostor.webp",
      alt: "Betonová podlaha v otevřeném prostoru Přerov, drátkobeton hlazený s dilatací",
      loc: "Přerov · Otevřený prostor",
      h3: "Otevřený prostor — Přerov",
      meta: ["Drátkobeton", "Hlazený", "Velkoplošný", "Dilatace"],
      p: "Velkoplošná betonová podlaha v otevřeném prostoru — drátkobeton hlazený s důrazem na rovinnost a správné dilatace pro velké plochy. Vhodné pro výrobní haly, sklady i manipulační prostory. Odolnost mechanickému namáhání i přechodům VZV.",
    },
  ],
  "betonove-podlahy-prostejov": [
    {
      img: "betonova-podlaha-penzion-prostejov.webp",
      alt: "Betonová podlaha s drátky v penzionu Prostějov, hlazený beton komerční prostor",
      loc: "Prostějov · Penzion",
      h3: "Penzion — Prostějov",
      meta: ["Drátkobeton", "Hlazený", "Komerční prostor", "Bezprašnost"],
      p: "Drátkobetonová podlaha v penzionu Prostějov — hlazený beton vyztužený ocelovými drátky pro vysokou nosnost a životnost. Odolný proti zatížení nábytkem, kufry, vozíky i intenzivnímu provozu hostů. Snadná údržba, dlouhodobá investice.",
    },
    {
      img: "betonova-podlaha-prostejov-garaz-dum.webp",
      alt: "Betonová podlaha v garáži rodinného domu Prostějov, 120 m² hlazený beton se vsypem",
      loc: "Prostějov · Garáž RD",
      h3: "Garáž v rodinném domě — Prostějov",
      meta: ["120 m²", "Hlazený beton", "Vsyp Fortedur", "Lehký podlesk"],
      p: "Hlazená betonová podlaha v garáži rodinného domu (120 m²) Prostějov — hlazený beton se vsypem Fortedur pro odolnost proti olejům, palivům i solance ze zimní vozovky. Životnost 20+ let bez nutnosti výměny.",
    },
  ],
};

// Generuje HTML pro 1 reference card
function buildCard(card) {
  const metaSpans = card.meta
    .map((m, i) => (i === 0 ? `<span>${m}</span>` : `<span>· ${m}</span>`))
    .join("");
  return `      <div class="lp-ref-card">
        <div class="lp-ref-img">
          <img src="/img/landing/${card.img}"
               alt="${card.alt}"
               width="800" height="500" loading="lazy">
          <div class="lp-ref-location">${card.loc}</div>
        </div>
        <div class="lp-ref-body">
          <h3>${card.h3}</h3>
          <div class="lp-ref-meta">
            ${metaSpans}
          </div>
          <p>${card.p}</p>
        </div>
      </div>`;
}

// Najde v souboru rozsah od prvního <div class="lp-ref-card"> po balanced konec posledního cards.
// Vrací { startIdx, endIdx, cardCount }
function findRefCardsRange(text) {
  const startMarker = '      <div class="lp-ref-card">';
  let firstStart = text.indexOf(startMarker);
  if (firstStart === -1) return null;

  // Najdi všechny start positions
  const starts = [];
  let pos = 0;
  while ((pos = text.indexOf(startMarker, pos)) !== -1) {
    starts.push(pos);
    pos += startMarker.length;
  }

  // Najdi end pro POSLEDNÍ card pomocí balanced traversal
  function findEnd(startPos) {
    let i = text.indexOf(">", startPos) + 1;
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

  const lastEnd = findEnd(starts[starts.length - 1]);
  if (lastEnd === -1) return null;

  return { startIdx: firstStart, endIdx: lastEnd, cardCount: starts.length };
}

function processFile(slug, apply) {
  const path = join(ROOT, slug, "index.html");
  if (!existsSync(path)) return { error: "not found" };
  const cards = CARDS[slug];
  if (!cards) return { error: "no card data defined" };

  const orig = readFileSync(path, "utf8");
  const range = findRefCardsRange(orig);
  if (!range) return { error: "no reference cards found" };

  // Sestavíme nové 2 cards
  const newCards = cards.map(buildCard).join("\n\n");
  const newText =
    orig.slice(0, range.startIdx) + newCards + orig.slice(range.endIdx);

  if (apply && newText !== orig) {
    writeFileSync(path, newText, "utf8");
  }

  return {
    cardCountBefore: range.cardCount,
    cardCountAfter: cards.length,
    modified: newText !== orig,
    chars_diff: newText.length - orig.length,
  };
}

function main() {
  const apply = process.argv.includes("--apply");
  console.log(`Mode: ${apply ? "APPLY" : "DRY RUN (use --apply to write)"}\n`);

  for (const slug of Object.keys(CARDS)) {
    const r = processFile(slug, apply);
    if (r.error) {
      console.log(`  ❌ ${slug}: ${r.error}`);
      continue;
    }
    const status = apply ? (r.modified ? "✅" : "(no change)") : "(would write)";
    console.log(
      `  ${slug}: ${r.cardCountBefore} → ${r.cardCountAfter} cards, ${
        r.chars_diff > 0 ? "+" : ""
      }${r.chars_diff} chars ${status}`
    );
  }
  if (!apply) console.log("\n→ Re-run with --apply to write changes.");
}

main();
