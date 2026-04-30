# 📋 Plán nových stránek mobetony.cz

**Vytvořeno:** 2026-04-30
**Kontext:** Po fázi title/meta optimalizace 21 stránek (CTR fix). Další růst = nové stránky.

---

## 🎯 Stav webu k 2026-04-30

**Existující struktura:**
- **Service pages (root):** anhydritova-podlaha, lesteny-beton, prumyslova-podlaha, typy-podlah
- **Lokální landingy:** anhydritove-podlahy-olomouc, betonove-podlahy-olomouc, lesteny-beton-olomouc, prumyslove-podlahy-olomouc
- **Trust:** o-nas, kontakt, vsechny-projekty, technicke-prace, cenik
- **Blog:** 63 článků (saturace, riziko kanibalizace u dalších)

**Strategie dál:** Nové **stránky** (různý search intent) > nové blog články.

---

## 🥇 TIER 1 — Must have (priority TENTO MĚSÍC)

### **1. FAQ stránka — komplet** ⭐⭐⭐
- **Cíl:** AI Overviews citation (ChatGPT, Perplexity, Google AI), voice search, FAQPage Schema rich results
- **URL:** `/faq/` nebo `/casto-kladene-otazky/`
- **Obsah:** 50+ Q&A v 6 sekcích — Anhydrit / Beton / Cena / Realizace / Záruka / Materiály
- **Schema:** FAQPage (povinné)
- **Effort:** ~3 hodiny
- **ROI:** ⭐⭐⭐⭐⭐ — AI Overviews jsou 2026 game changer

### **2. Reference / Realizace s detail page** ⭐⭐⭐
- **Cíl:** E-E-A-T (Google trust signal), social proof pro CRO (+30 % konverze)
- **URL:** `/reference/[nazev-projektu]/`
- **Obsah:** 5–10 reálných projektů. Každý: foto před/během/po, plocha, materiál, doba realizace, citace klienta
- **Schema:** CreativeWork + ImageObject + Review (pokud lze)
- **Příklady:** "Anhydrit Hotel Prokop Olomouc 1 200 m² — 3 dny", "Leštěný beton showroom Brno 350 m²"
- **Effort:** ~30 min/projekt + landing page (4 hodiny celkem)
- **Pozn.:** Aktuální `/vsechny-projekty` upgradovat na index, doplnit detail pages

### **3. Cementový potěr — service page** ⭐⭐⭐
- **Cíl:** SEO vakum (GSC: "cementové podlahy" 24 imp **pos 48.54**, "cementový potěr cena" 16 imp)
- **URL:** `/cementovy-poter/` nebo `/cementova-podlaha/`
- **Obsah:** Co je, kdy zvolit (vs anhydrit), pevnostní třídy, ceny, schnutí, použití
- **Pozn.:** Existující blog `cementovy-poter-olomouc` nechat (je lokální), tohle = generic pillar
- **Effort:** ~2 hodiny

### **4. Lokální landingy mimo Olomouc** ⭐⭐⭐
- **Cíl:** Geografická expanze v Olomouckém kraji
- **Template:** Klonovat `anhydritove-podlahy-olomouc` strukturu
- **Priorita měst:**
  1. **Prostějov** (50 tis. obyvatel, 17 km, průmyslová zóna)
  2. **Přerov** (40 tis., 25 km, průmyslová oblast)
  3. **Šumperk** (25 tis., 50 km)
  4. **Hranice** (18 tis.)
  5. **Zlín** (75 tis., 60 km — sousední kraj, GSC ukazuje slabou pozici)
- **Per město 4 landingy** (anhydritove-podlahy-XY, betonove-podlahy-XY, lesteny-beton-XY, prumyslove-podlahy-XY)
- **Effort:** ~30 min/landing s templatem
- **Začít s:** Prostějov + Přerov (anhydrit + průmyslové)

---

## 🥈 TIER 2 — Should have (1–2 měsíce)

### **5. Cenový kalkulátor** ⭐⭐
- **Cíl:** Lead magnet, dwell time, competitive advantage (konkurenti nemají)
- **URL:** `/kalkulator/` nebo `/orientacni-cena/`
- **Funkce:** Input (typ podlahy, plocha, doplňky) → Output (orientační cena + email capture pro detail)
- **Tech:** Vanilla JS (nepotřebujeme React)
- **Effort:** ~1 den

### **6. Drátkobetonová podlaha — service page** ⭐⭐
- **Cíl:** Specifický B2B keyword cluster (~30 imp/měsíc, vlastní intent)
- **URL:** `/dratkobetonova-podlaha/`
- **Obsah:** Skladba, dávkování (kg/m³), tloušťky, kdy vs kari síť, cena
- **Pozn.:** Existující blog `dratkobeton-typy-betonu` (pos 8.71) doplní

### **7. Mikrocement — service page** ⭐⭐
- **Cíl:** Rostoucí trend (luxus byty, koupelny), nízká konkurence v ČR
- **URL:** `/mikrocement/`
- **Obsah:** Co je, použití (koupelna, kuchyň, stěny), tloušťky, barvy, cena, údržba
- **Pozn.:** Existující blog `mikrocement-podlaha-cena` (pos 8.68) jen informační, service = transakční

### **8. Pro architekty / B2B sekce** ⭐⭐
- **Cíl:** B2B audience awareness (architekti = větší projekty, vyšší LTV)
- **URL:** `/pro-architekty/` + `/pro-developery/`
- **Obsah:** Datasheety PDF, technické listy materiálů, "specifikace pro projekt", segmentové CTA
- **Pozn.:** Pomáhá i SEO ("anhydrit specifikace", "datasheet drátkobeton")

---

## 🥉 TIER 3 — Nice to have (až bude čas)

### **9. Recenze / Hodnocení klientů** ⭐
- **URL:** `/recenze/`
- **Schema:** Review (5* hvězdičky v SERP = obrovský CTR boost)
- **Source:** Google Business Profile reviews → embed

### **10. Jak to funguje / Process page** ⭐
- **URL:** `/jak-to-funguje/`
- **Obsah:** Krok 1: Poptávka → 2: Konzultace → 3: Cenová nabídka → 4: Realizace → 5: Předání + záruka
- **Cíl:** Snížit friction u váhajících klientů

### **11. Broušený beton — samostatná service** ⭐
- **URL:** `/brouseny-beton/`
- **Cíl:** Diferenciace od leštěného (jiný produkt, ~30 imp/měsíc)

### **12. Pohledový beton — service page** ⭐
- **URL:** `/pohledovy-beton/`
- **Cíl:** Designový trend, B2B + interier (architekti, designéři)

---

## 📊 Workflow doporučení

**Sprint 1 (max ROI týden):**
- [ ] FAQ stránka (#1) — schema + AI Overviews
- [ ] Lokální landing Prostějov + Přerov pro anhydrit (#4) — 2 stránky
- [ ] Cementový potěr service page (#3)

**Sprint 2:**
- [ ] Reference index + 5 case study detail pages (#2)
- [ ] Lokální landing Prostějov + Přerov pro průmyslové (#4) — 2 stránky

**Sprint 3:**
- [ ] Cenový kalkulátor (#5)
- [ ] Drátkobetonová podlaha service (#6)
- [ ] Mikrocement service (#7)

**Sprint 4:**
- [ ] Šumperk + Zlín lokál landingy (#4)
- [ ] Pro architekty B2B (#8)

---

## 🚨 Co NEDĚLAT

- ❌ **Nepsat další blog články o tématu, které už máme** — kanibalizace je real (zvlášť cluster leštěný beton 8 článků, garáž 3 články, anhydrit vs 3 články)
- ❌ **Nezakládat lokální landing pro každou vesnici** — focus na města 15 tis.+ obyvatel
- ❌ **Nepřidávat service page pro každý produkt** — fokus na ty s GSC poptávkou
- ❌ **Nedělat redesign existujících stránek "jen tak"** — ROI je v nových stránkách

---

## 🔗 Související

- [memory MEMORY.md](../../../../Users/Marty/.claude/projects/C--Projects-mobetony/memory/MEMORY.md) — preferences a feedback
- Skill `mobetony-dev` — design system + struktura
- Skill `seo-web` — SEO konvence
- Skill `mobetony-deploy` — deploy workflow
- Skill `blog-article-writer` — pro blog (pokud někdy budeš psát)

---

**Last review:** 2026-04-30
**Next review:** po Sprintu 1 (zhodnotit GSC dopad nových stránek)
