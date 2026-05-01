// HERO IMAGE FIX: nahrazuje placeholder hero image filenames v 8 ne-Olomouc LP
// existujícími fotkami z /img/landing/. Updatuje:
//   - <link rel="preload" as="image" href="...">
//   - <img src="..." alt="..."> v .lp-hero-image
//   - <meta property="og:image" content="...">
//
// Strategy: vyberou se reálné fotky pro každou LP (často reuse z reference cards).

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));

const HERO = {
  "lesteny-beton-prerov": {
    file: "lesteny-beton-prerov-sklad-agro-objekt.webp",
    alt: "Leštěný beton v zemědělském skladu Přerov, 420 m² hlazený beton se vsypem Fortedur",
  },
  "lesteny-beton-prostejov": {
    file: "lesteny-beton-prostejov-prumyslova-zona.webp",
    alt: "Leštěný beton v průmyslové zóně Prostějov, 380 m² drátkobeton se vsypem",
  },
  "prumyslove-podlahy-prerov": {
    file: "prumyslova-podlaha-prerov-dratkobeton.webp",
    alt: "Drátkobetonová průmyslová podlaha Přerov, 800 m² strojně hlazená s vsypem",
  },
  "prumyslove-podlahy-prostejov": {
    file: "prumyslova-podlaha-prostejov-sklad-soucastek.webp",
    alt: "Průmyslová podlaha ve skladu součástek Prostějov, 550 m² drátkobeton se vsypem",
  },
  "anhydritove-podlahy-prerov": {
    file: "anhydrit-prerov-rodinny-dum-1.webp",
    alt: "Anhydritová podlaha v rodinném domě Přerov, 220 m² lité potěry s podlahovým topením",
  },
  "anhydritove-podlahy-prostejov": {
    file: "bytovy-komplex.webp",
    alt: "Anhydritová podlaha v bytovém komplexu Prostějov, 24 bytů s podlahovým topením",
  },
  "betonove-podlahy-prerov": {
    file: "betonova-podlaha-prerov-rekonstrukce-stredisko.webp",
    alt: "Rekonstrukce betonové podlahy ve středisku Přerov, hlazený beton se vsypem",
  },
  "betonove-podlahy-prostejov": {
    file: "betonova-podlaha-prostejov-garaz-dum.webp",
    alt: "Betonová podlaha v garáži rodinného domu Prostějov, 120 m² hlazený beton se vsypem",
  },
};

function processFile(slug, apply) {
  const path = join(ROOT, slug, "index.html");
  if (!existsSync(path)) return { error: "not found" };
  const cfg = HERO[slug];
  if (!cfg) return { error: "no hero defined" };

  // Ověř že fotka existuje
  const imgPath = join(ROOT, "img", "landing", cfg.file);
  if (!existsSync(imgPath)) return { error: `image ${cfg.file} not found` };

  const orig = readFileSync(path, "utf8");
  let txt = orig;
  const stats = {};

  const newPath = `/img/landing/${cfg.file}`;
  const newOgPath = `https://mobetony.cz${newPath}`;

  // 1. <link rel="preload" as="image" href="...">
  const preloadRe = /<link rel="preload" as="image" href="\/img\/landing\/[^"]+\.webp" fetchpriority="high">/;
  if (preloadRe.test(txt)) {
    txt = txt.replace(
      preloadRe,
      `<link rel="preload" as="image" href="${newPath}" fetchpriority="high">`
    );
    stats.preload = 1;
  }

  // 2. <img src=...> v .lp-hero-image (najdeme blok)
  const heroImgRe =
    /(<div class="lp-hero-image fade-in">\s*<img src=")\/img\/landing\/[^"]+\.webp("\s*\n?\s*alt=")[^"]+(")/;
  if (heroImgRe.test(txt)) {
    txt = txt.replace(heroImgRe, `$1${newPath}$2${cfg.alt}$3`);
    stats.hero_img_alt = 1;
  }

  // 3. <meta property="og:image" content="...">
  const ogImgRe = /<meta property="og:image" content="https:\/\/mobetony\.cz\/img\/landing\/[^"]+\.webp"\s*\/?>/;
  if (ogImgRe.test(txt)) {
    txt = txt.replace(
      ogImgRe,
      `<meta property="og:image" content="${newOgPath}" />`
    );
    stats.og_image = 1;
  }

  if (apply && txt !== orig) {
    writeFileSync(path, txt, "utf8");
  }

  return { stats, modified: txt !== orig };
}

function main() {
  const apply = process.argv.includes("--apply");
  console.log(`Mode: ${apply ? "APPLY" : "DRY RUN (use --apply to write)"}\n`);

  for (const slug of Object.keys(HERO)) {
    const r = processFile(slug, apply);
    if (r.error) {
      console.log(`  ❌ ${slug}: ${r.error}`);
      continue;
    }
    const sum = Object.values(r.stats).reduce((a, b) => a + b, 0);
    const detail = Object.entries(r.stats).map(([k, v]) => `${k}=${v}`).join(" ");
    const status = apply ? (r.modified ? "✅" : "(no change)") : "(would write)";
    console.log(`  [${sum}/3] ${slug}: ${detail} ${status}`);
  }
  if (!apply) console.log("\n→ Re-run with --apply to write changes.");
}

main();
