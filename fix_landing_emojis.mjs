// Batch script: nahrazuje emoji v landing pages (📍 📞 ✉️) za inline SVG.
// Spustit z root mobetony repa:
//   node fix_landing_emojis.mjs           (dry run)
//   node fix_landing_emojis.mjs --apply   (zápis)

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));

const LANDING_PAGES = [
  "lesteny-beton-olomouc",
  "lesteny-beton-prerov",
  "lesteny-beton-prostejov",
  "prumyslove-podlahy-olomouc",
  "prumyslove-podlahy-prerov",
  "prumyslove-podlahy-prostejov",
  "anhydritove-podlahy-olomouc",
  "anhydritove-podlahy-prerov",
  "anhydritove-podlahy-prostejov",
  "betonove-podlahy-olomouc",
  "betonove-podlahy-prerov",
  "betonove-podlahy-prostejov",
];

const SVG_PIN_INLINE =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:6px;" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';

const SVG_PHONE_INLINE =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:6px;" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>';

const SVG_PIN_KONTAKT =
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';

const SVG_MAIL_KONTAKT =
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>';

// CSS rule: ::before s content '📍 ' -> SVG background-image (white pin pro tmavé pozadí)
const CSS_PIN_OLD = ".lp-ref-location::before { content: '📍 '; }";
const CSS_PIN_NEW = `.lp-ref-location::before {
      content: '';
      width: 12px; height: 12px; margin-right: 4px;
      display: inline-block; vertical-align: -1px;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'/><circle cx='12' cy='10' r='3'/></svg>");
      background-repeat: no-repeat; background-size: contain;
    }`;

const CTA_PHONE_OLD = '">📞 +420 774 611 154</a>';
const CTA_PHONE_NEW = `">${SVG_PHONE_INLINE}+420 774 611 154</a>`;

const STICKY_OLD = '">📞 Zavolat</a>';
const STICKY_NEW = `">${SVG_PHONE_INLINE}Zavolat</a>`;

const KONTAKT_PIN_OLD = '<div class="kontakt-icon">📍</div>';
const KONTAKT_PIN_NEW = `<div class="kontakt-icon">${SVG_PIN_KONTAKT}</div>`;

const KONTAKT_MAIL_OLD = '<div class="kontakt-icon">✉️</div>';
const KONTAKT_MAIL_NEW = `<div class="kontakt-icon">${SVG_MAIL_KONTAKT}</div>`;

const HERO_EYEBROW_RE = /(<div class="lp-hero-eyebrow">)📍 ([^<]+)(<\/div>)/g;

function countOcc(haystack, needle) {
  if (needle === "") return 0;
  let count = 0;
  let pos = 0;
  while ((pos = haystack.indexOf(needle, pos)) !== -1) {
    count++;
    pos += needle.length;
  }
  return count;
}

function processFile(path, apply) {
  const orig = readFileSync(path, "utf8");
  let txt = orig;
  const counts = {
    css_pin: countOcc(txt, CSS_PIN_OLD),
    hero_eyebrow: (txt.match(HERO_EYEBROW_RE) || []).length,
    cta_phone: countOcc(txt, CTA_PHONE_OLD),
    sticky_call: countOcc(txt, STICKY_OLD),
    kontakt_pin: countOcc(txt, KONTAKT_PIN_OLD),
    kontakt_mail: countOcc(txt, KONTAKT_MAIL_OLD),
  };

  if (apply) {
    txt = txt.split(CSS_PIN_OLD).join(CSS_PIN_NEW);
    txt = txt.replace(
      HERO_EYEBROW_RE,
      (_, a, city, c) => `${a}${SVG_PIN_INLINE}${city}${c}`
    );
    txt = txt.split(CTA_PHONE_OLD).join(CTA_PHONE_NEW);
    txt = txt.split(STICKY_OLD).join(STICKY_NEW);
    txt = txt.split(KONTAKT_PIN_OLD).join(KONTAKT_PIN_NEW);
    txt = txt.split(KONTAKT_MAIL_OLD).join(KONTAKT_MAIL_NEW);

    if (txt !== orig) {
      writeFileSync(path, txt, "utf8");
    }
  }

  // Sanity: emoji left
  const remaining = ["📍", "📞", "✉️"].reduce(
    (s, e) => s + countOcc(apply ? txt : orig, e),
    0
  );
  return { counts, remaining, modified: txt !== orig };
}

function main() {
  const apply = process.argv.includes("--apply");
  console.log(`Mode: ${apply ? "APPLY" : "DRY RUN (use --apply to write)"}\n`);

  let totalEdits = 0;
  for (const slug of LANDING_PAGES) {
    const path = join(ROOT, slug, "index.html");
    if (!existsSync(path)) {
      console.log(`  SKIP (not found): ${slug}`);
      continue;
    }

    const { counts, remaining, modified } = processFile(path, apply);
    const sum = Object.values(counts).reduce((a, b) => a + b, 0);
    totalEdits += sum;

    const detail = Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => `${k}=${v}`)
      .join(" ");

    if (apply) {
      const status = remaining > 0 ? `⚠️ ${remaining} emoji zustava` : "✅";
      console.log(
        `  [${sum} edits] ${slug}: ${detail || "(nothing)"} ${status}`
      );
    } else {
      console.log(`  [${sum} edits] ${slug}: ${detail || "(nothing)"}`);
    }
  }

  console.log(
    `\nTotal: ${totalEdits} replacements across ${LANDING_PAGES.length} pages.`
  );
  if (!apply) console.log("\n→ Re-run with --apply to write changes.");
}

main();
