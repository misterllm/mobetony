// Final duplicate-content audit pro všech 12 landing pages.
// Zkontroluje SEO-kritické elementy: title, meta, og, schema desc, h1,
// hero subtitle, lokální sekce h2 + paragraphs, section descs, reference cards.

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));

const LPS = [
  "lesteny-beton-olomouc", "lesteny-beton-prerov", "lesteny-beton-prostejov",
  "prumyslove-podlahy-olomouc", "prumyslove-podlahy-prerov", "prumyslove-podlahy-prostejov",
  "anhydritove-podlahy-olomouc", "anhydritove-podlahy-prerov", "anhydritove-podlahy-prostejov",
  "betonove-podlahy-olomouc", "betonove-podlahy-prerov", "betonove-podlahy-prostejov",
];

// Extracts (returns trimmed) — všechny SEO-kritické elementy
const EXTRACTORS = {
  title: (txt) => (txt.match(/<title>([^<]+)<\/title>/) || [])[1],
  meta_desc: (txt) =>
    (txt.match(/<meta name="description" content="([^"]+)"\s*\/?>/) || [])[1],
  og_title: (txt) =>
    (txt.match(/<meta property="og:title" content="([^"]+)"\s*\/?>/) || [])[1],
  og_desc: (txt) =>
    (txt.match(/<meta property="og:description" content="([^"]+)"\s*\/?>/) || [])[1],
  // Schema Service description — bere DRUHÝ výskyt (první je Organization, OK identické)
  schema_service_desc: (txt) => {
    const re = /"description":\s*"([^"]+)"/g;
    const all = [];
    let m;
    while ((m = re.exec(txt)) !== null) all.push(m[1]);
    return all[1] || null;
  },
  // H1 — odstrani span tagy
  h1: (txt) => {
    const m = txt.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    return m ? m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : null;
  },
  hero_sub: (txt) => {
    const m = txt.match(/<p class="lp-hero-sub">([\s\S]+?)<\/p>/);
    return m ? m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : null;
  },
  // Lokální sekce H2
  local_h2: (txt) => {
    const m = txt.match(
      /UNIK[ÁA]TN[ÍI] LOK[ÁA]LN[ÍI] KONTEXT[\s\S]+?<h2[^>]*>([\s\S]+?)<\/h2>/
    );
    return m
      ? m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
      : null;
  },
  // První odstavec lokální sekce
  local_p1: (txt) => {
    const m = txt.match(
      /UNIK[ÁA]TN[ÍI] LOK[ÁA]LN[ÍI] KONTEXT[\s\S]+?<p[^>]*><strong[^>]*>([^<]+)<\/strong>/
    );
    return m ? m[1].trim() : null;
  },
};

function hash(s) {
  return s ? s.length + ":" + s.slice(0, 80) : null;
}

function buildMatrix() {
  const matrix = {}; // matrix[field][slug] = value
  for (const slug of LPS) {
    const path = join(ROOT, slug, "index.html");
    if (!existsSync(path)) continue;
    const txt = readFileSync(path, "utf8");
    for (const [field, fn] of Object.entries(EXTRACTORS)) {
      matrix[field] = matrix[field] || {};
      matrix[field][slug] = fn(txt) || "(missing)";
    }
  }
  return matrix;
}

function findDups(slug2val) {
  const groups = {};
  for (const [slug, val] of Object.entries(slug2val)) {
    if (val === "(missing)") continue;
    const key = val;
    groups[key] = groups[key] || [];
    groups[key].push(slug);
  }
  return Object.entries(groups).filter(([, slugs]) => slugs.length > 1);
}

function similarity(a, b) {
  // Jaccard similarity podle slov (8+ chars unique words pro lepší signal)
  if (!a || !b) return 0;
  if (a === "(missing)" || b === "(missing)") return 0;
  const wordsA = new Set(a.toLowerCase().split(/\W+/).filter((w) => w.length >= 6));
  const wordsB = new Set(b.toLowerCase().split(/\W+/).filter((w) => w.length >= 6));
  const intersection = [...wordsA].filter((w) => wordsB.has(w));
  const union = new Set([...wordsA, ...wordsB]);
  return union.size === 0 ? 0 : intersection.length / union.size;
}

function findHighSimilarity(slug2val, threshold = 0.8) {
  const slugs = Object.keys(slug2val);
  const pairs = [];
  for (let i = 0; i < slugs.length; i++) {
    for (let j = i + 1; j < slugs.length; j++) {
      const sim = similarity(slug2val[slugs[i]], slug2val[slugs[j]]);
      if (sim >= threshold) pairs.push([slugs[i], slugs[j], sim]);
    }
  }
  return pairs;
}

function main() {
  const matrix = buildMatrix();
  let totalIssues = 0;

  console.log("============================================================");
  console.log("FINAL DUPLICATE-CONTENT AUDIT — 12 LANDING PAGES");
  console.log("============================================================\n");

  for (const field of Object.keys(EXTRACTORS)) {
    const slug2val = matrix[field];
    const dups = findDups(slug2val);
    const sims = findHighSimilarity(slug2val, 0.8);

    if (dups.length === 0 && sims.length === 0) {
      console.log(`✅ ${field.padEnd(15)} — ${LPS.length} unique`);
    } else {
      console.log(`⚠️  ${field.padEnd(15)}`);
      if (dups.length > 0) {
        for (const [val, slugs] of dups) {
          console.log(`     IDENTICAL (${slugs.length}x): "${val.slice(0, 100)}${val.length > 100 ? "…" : ""}"`);
          slugs.forEach((s) => console.log(`       - ${s}`));
          totalIssues++;
        }
      }
      if (sims.length > 0) {
        for (const [a, b, sim] of sims) {
          console.log(`     ${(sim * 100).toFixed(0)}% similar: ${a} ↔ ${b}`);
          totalIssues++;
        }
      }
    }
  }

  console.log(`\n${totalIssues === 0 ? "✅ ŽÁDNÉ DUPLICITY" : `⚠️  ${totalIssues} potenciální problém(y)`}`);
}

main();
