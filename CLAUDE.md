# mobetony.cz — CLAUDE.md

## O projektu
Firemní web **MO Betony s.r.o.** — prezentace služeb v oblasti betonových podlah.
Majitel webu se učí web development, proto píšeme vlastní kód (žádný WordPress, žádné frameworky).
Cíl: funkční, krásný, SEO-optimalizovaný firemní one-page web.

## DŮLEŽITÉ — Architektura webu
- Web je **ONE-PAGER** — vše je v jediném souboru `index.html`
- **Žádné separátní stránky** (žádné podlahy.html, kontakt.html apod.)
- **Žádné CSS frameworky** (Tailwind, Bootstrap) — veškeré styly jsou přímo v index.html v tagu `<style>`
- **Žádné JS frameworky** — vanilla JavaScript přímo v index.html v tagu `<script>`
- **Žádný build process** — žádný npm, webpack, vite apod.

## Struktura projektu
```
index.html    ← JEDINÝ soubor webu, obsahuje HTML + CSS + JS
img/          ← fotky a obrázky
CLAUDE.md     ← tento soubor
README.md     ← popis projektu pro GitHub
```

## Technologie
- **HTML5 + CSS3 + vanilla JavaScript** — vše v jednom souboru
- Font: **Barlow Condensed** (nadpisy) + **Barlow** (text) z Google Fonts
- Formulář: **Formspree** (action="https://formspree.io/f/TVUJ_KOD")
- Deploy: **Vercel** (propojeno přes GitHub)
- Doména: **mobetony.cz** (registrovaná přes Vedos.cz)

## Design systém
### Barvy (CSS proměnné v :root)
```css
--bg:      #0d0d0d   /* hlavní pozadí */
--bg2:     #141414   /* footer */
--bg3:     #1a1a1a   /* karty */
--bg4:     #222222   /* vstupy formuláře */
--orange:  #f97316   /* primární akcent */
--orange2: #ea6b0e   /* hover stav oranžové */
--cyan:    #06b6d4   /* badge "Nové", Vodo-Topo */
--white:   #ffffff
--gray:    #9ca3af   /* sekundární text */
--gray2:   #6b7280   /* méně důležitý text */
--border:  #2a2a2a   /* jemné okraje */
--border2: #333333   /* silnější okraje */
```

### Typografie
- Nadpisy: `font-family: 'Barlow Condensed'`, weight 900, uppercase
- Tělo: `font-family: 'Barlow'`, weight 400–600
- Hero nadpis: `clamp(56px, 9vw, 96px)`
- Nadpisy sekcí: `clamp(40px, 5vw, 56px)`
- Popisky sekcí: 11px, uppercase, letter-spacing 1.5px, oranžová barva

### Klíčové komponenty
- Navigace: `position: fixed`, `backdrop-filter: blur(12px)`, výška 64px
- Logo: oranžový čtverec 36×36px s "MO" + název firmy vedle
- Tlačítka: `.btn-primary` (bílé), `.btn-secondary` (outline), `.btn-call` (oranžové), `.btn-cyan`
- Karty: `background: var(--bg3)`, `border: 1px solid var(--border)`, `border-radius: 16px`
- Karty hover: `border-color: var(--border2)`, `transform: translateY(-2px)`
- Animace: třída `.fade-in` + IntersectionObserver → přidá `.visible`

## Sekce webu (v tomto pořadí v index.html)
1. `<nav>` — navigace s hamburger menu pro mobil
2. `#hero` — hero sekce (WhatsApp badge, nadpis, CTA tlačítka, 4 statistiky)
3. `#podlahy` — typy podlah (3 velké karty + 2 menší)
4. `#proces` + `#vodo-topo` — banner Vodo-Topo + 4 kroky spolupráce
5. `#reference` — grid 6 referenčních projektů
6. `#faq` — accordion s otázkami
7. `#cta` — CTA sekce s gradientem (tmavě hnědá)
8. `#kontakt` — kontaktní formulář (Formspree) + kontaktní info
9. `<footer>` — logo, seznam služeb, firemní links, copyright

## Obsah — Služby firmy
- **Anhydritové podlahy** — samonivelační litý potěr, ideální pro podlahové topení, pochůznost 48h
- **Leštěné betonové podlahy** — designový povrch, showroomy, lofty, zrcadlový lesk
- **Průmyslové podlahy** — drátobetonové, sklady/haly, zátěž až 50t/m²
- **Opravy a sanace** — praskliny, výtluky, renovace
- **Ochranné nátěry** — epoxidové a polyuretanové systémy
- **Vodo-Topo** — podlahové topení jako komplexní řešení s anhydritem

## Kontaktní údaje (DOPLNIT reálné hodnoty)
- Firma: MO Betony s.r.o.
- Adresa: [DOPLNIT]
- Telefon: [DOPLNIT] — hledej "+420 XXX XXX XXX" v index.html
- WhatsApp: [DOPLNIT] — hledej "WA: +420 XXX XXX XXX"
- Email: info@mobetony.cz
- Provozní doba: Po–Pá: 7:00–17:00
- Formspree endpoint: [DOPLNIT] — hledej "TVUJ_KOD" v action atributu formuláře

## SEO (každá úprava musí zachovat)
- `<title>` — "MO Betony s.r.o. – Betonové podlahy pro váš projekt"
- `<meta name="description">` — krátký popis firmy s klíčovými slovy
- Správná hierarchie nadpisů: H1 pouze jednou (hero), H2 pro sekce, H3 pro karty
- Alt texty u všech obrázků které přibydou do img/

## Pravidla pro úpravy
- **Komentuj změny česky** — majitel se učí, musí rozumět co a proč
- **Vysvětluj rozhodnutí** — nejen jak, ale proč
- **Neměň architekturu** — vše zůstává v jednom index.html
- **Mobile-first** — každá změna musí fungovat i na mobilu (otestuj breakpoint 768px)
- **Neinstaluj npm balíčky** — žádný build process
- Žádné inline styly přidané mimo existující `<style>` blok