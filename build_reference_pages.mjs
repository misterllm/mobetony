// build_reference_pages.mjs
//
// Generuje 5 reference detail pages z configs (z Martyho txt + dovymýšleno per podlahy-komplet).
// Run: node build_reference_pages.mjs

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));

// =================================================================
// CONFIGS — 5 real projects
// =================================================================
const PROJECTS = [
  {
    slug: 'anhydrit-bytovy-dum-prostejov',
    type: 'anhydrit',
    serviceUrl: '/anhydritova-podlaha',
    serviceName: 'Anhydritové podlahy',
    title: 'Anhydritová podlaha — bytový dům Prostějov 1 400 m² | MO Betony',
    metaDescription: 'Případová studie: 1 400 m² anhydritové podlahy ANHYLEVEL CA-C25 v novostavbě bytového domu Prostějov, 24 bytů s podlahovým topením. 3 dny realizace, červen 2025.',
    h1Main: 'Anhydritová podlaha',
    h1Highlight: 'bytový dům Prostějov',
    badge: 'Anhydritová podlaha · Realizace 06/2025',
    lokace: 'Prostějov',
    plocha: '1 400 m²',
    plochaNum: '1 400',
    doba: '3 dny',
    rok: '2025',
    datum: 'Červen 2025',
    material: 'Anhydrit ANHYLEVEL CA-C25',
    tloustka: '60 mm',
    pevnost: 'CA-C25-F5',
    perex: 'Realizace anhydritových podlah v <strong>nově postaveném bytovém domě v Prostějově</strong> s 24 byty. <strong>1 400 m² za 3 pracovní dny</strong>, kompletní příprava včetně podlahového topení, materiál Cemex ANHYLEVEL CA-C25 v tloušťce 60 mm. Klíčový požadavek: dokonalá rovinatost pro pokládku finálních krytin a perfektní spolupráce s podlahovým topením ve všech 24 bytech.',
    heroImage: '/img/reference/anhydrit-bytovy-dum-prostejov/final.webp',
    heroAlt: 'Anhydritová podlaha bytový dům Prostějov 1 400 m² — realizace MO Betony',
    heroCaption: 'Bytový dům · Prostějov',
    stats: [
      { num: '1 400 m²', label: 'Plocha podlahy' },
      { num: '3 dny', label: 'Realizace' },
      { num: '24', label: 'Bytů s topením' },
      { num: '±2 mm', label: 'Rovinatost / 2 m' }
    ],
    story: [
      {
        eyebrow: 'Zadání projektu',
        h2: 'Novostavba <span>24 bytů</span> s podlahovým topením',
        body: '<p>Investor stavěl <strong>nový bytový dům s 24 byty</strong> v Prostějově. Kompletní dodávka podlah včetně přípravy podlahového topení, finální podlaha pro pokládku vinylové krytiny a dlažby v koupelnách. Klíčový požadavek byl <strong>splnit harmonogram</strong> — sádrokartonáři měli začínat za 5 dní od dokončení podlahy.</p><p>Druhý kritický požadavek: <strong>dokonalá rovinatost</strong> ±2 mm na 2 m pro pokládku vinylu, a optimální tepelná vodivost pro <strong>podlahové topení ve všech 24 bytech</strong>.</p>'
      },
      {
        eyebrow: 'Naše řešení',
        h2: 'Anhydrit <span>ANHYLEVEL CA-C25</span> v tloušťce 60 mm',
        body: '<p>Zvolili jsme <strong>litý anhydritový potěr Cemex ANHYLEVEL CA-C25</strong> v tloušťce 60 mm nad rozvody podlahového topení. Důvody:</p><ul><li><strong>Tepelná vodivost λ = 2,0 W/mK</strong> — ideál pro podlahové topení, výrazně lepší než cementový potěr</li><li><strong>Samonivelační materiál</strong> — rovinatost ±2 mm bez nutnosti ručního hlazení</li><li><strong>Pochůznost už za 48 hodin</strong> — sádrokartonáři navázali přesně dle harmonogramu</li><li><strong>Tenčí vrstva</strong> než cement (60 vs 75 mm) — méně zatížení železobetonové konstrukce</li></ul><p>Materiál jsme dováželi přímo z betonárny Cemex Olomouc, čerpali šnekovou pumpou postupně do všech bytů. Tým <strong>4 podlaháři + strojník</strong> zvládli ~470 m² za den.</p>'
      },
      {
        eyebrow: 'Výsledek',
        h2: '1 400 m² <span>za 3 dny</span> — bez zdržení stavby',
        body: '<p>Po 28 dnech jsme provedli CM měření vlhkosti — všech 24 bytů pod limit 0,5 % CM. <strong>Pokládka krytin proběhla přesně dle plánu</strong>, žádné reklamace ani praskliny. Investor předává byty novým majitelům s 5letou zárukou na podlahy.</p>'
      }
    ],
    gallery: [
      { src: '/img/reference/anhydrit-bytovy-dum-prostejov/priprava.webp', alt: 'Příprava podkladu — podlahové topení a separační fólie před litím anhydritu', stage: 'pred', caption: 'Příprava podlahového topení' },
      { src: '/img/reference/anhydrit-bytovy-dum-prostejov/proces.webp', alt: 'Strojní lití anhydritového potěru ANHYLEVEL CA-C25 v bytě', stage: 'behem', caption: 'Strojní lití anhydritu' },
      { src: '/img/reference/anhydrit-bytovy-dum-prostejov/final.webp', alt: 'Hotová anhydritová podlaha v bytě po vyschnutí', stage: 'po', caption: 'Hotová podlaha v bytě' }
    ],
    specs: [
      { th: 'Materiál', td: '<span class="val">Cemex ANHYLEVEL CA-C25</span> (anhydritový potěr CA-C25-F5)' },
      { th: 'Tloušťka', td: '<span class="val">60 mm</span> nad trubkami podlahového topení' },
      { th: 'Plocha', td: '<span class="val">1 400 m²</span> celkem ve 24 bytech' },
      { th: 'Pevnostní třída', td: '<span class="val">CA-C25-F5</span> (pevnost v tlaku 25 MPa)' },
      { th: 'Dilatace', td: 'Obvodová PE páska 10 mm, oddělení mezi byty' },
      { th: 'Doba realizace', td: '<span class="val">3 dny</span> (3× ~470 m²/den, tým 5 lidí)' },
      { th: 'Pochůznost', td: '48 hodin po lití' },
      { th: 'Vlhkost při pokládce krytiny', td: 'Pod 0,5 % CM, naměřeno po 28 dnech' },
      { th: 'Záruka', td: '5 let na vady díla' }
    ],
    timeline: [
      { day: 'Den 1 · červen 2025', text: '<strong>Příprava + lití 1. patra</strong> — kontrola podlahového topení, obvodové PE pásky, separační fólie. Lití ~470 m² (8 bytů).' },
      { day: 'Den 2 · červen 2025', text: '<strong>Lití 2. patra</strong> (~470 m², 8 bytů). Strojní čerpání anhydritu šnekovou pumpou Putzmeister.' },
      { day: 'Den 3 · červen 2025', text: '<strong>Lití 3. patra + finalizace</strong> (~460 m², 8 bytů). Předání stavbyvedoucímu, instrukce ohledně větrání.' },
      { day: 'Po 28 dnech', text: '<strong>CM měření vlhkosti</strong> ve všech 24 bytech — pod limit 0,5 %. <strong>Pokládka vinylu</strong> mohla začít.' }
    ]
  },

  {
    slug: 'prumyslova-podlaha-cnc-vyrobna-zlin',
    type: 'prumyslova',
    serviceUrl: '/prumyslova-podlaha',
    serviceName: 'Průmyslové podlahy',
    title: 'Průmyslová drátkobetonová podlaha — CNC výrobna Zlín 830 m² | MO Betony',
    metaDescription: 'Případová studie: rekonstrukce výrobny CNC strojů Zlín. Drátkobetonová podlaha 830 m², beton C20/25, tloušťka 200 mm, drátky 30 kg/m³. 2 dny realizace, 2025.',
    h1Main: 'Drátkobetonová podlaha',
    h1Highlight: 'CNC výrobna Zlín',
    badge: 'Průmyslová podlaha · Rekonstrukce 2025',
    lokace: 'Zlín',
    plocha: '830 m²',
    plochaNum: '830',
    doba: '2 dny',
    rok: '2025',
    datum: '2025',
    material: 'Beton C20/25 + drátky 30 kg/m³',
    tloustka: '200 mm',
    pevnost: 'C20/25',
    perex: 'Rekonstrukce výrobny CNC strojů ve Zlíně — <strong>830 m² drátkobetonové průmyslové podlahy</strong> pro vysoké statické a dynamické zatížení od těžkých CNC obráběcích center. Beton C20/25 v tloušťce <strong>200 mm s rozptýlenou výztuží 30 kg/m³</strong>, strojně hlazený se vsypem (mat #4). Realizace za 2 pracovní dny.',
    heroImage: '/img/reference/prumyslova-podlaha-cnc-vyrobna-zlin/final.webp',
    heroAlt: 'Drátkobetonová průmyslová podlaha v CNC výrobně Zlín 830 m² — realizace MO Betony',
    heroCaption: 'CNC výrobna · Zlín',
    stats: [
      { num: '830 m²', label: 'Plocha podlahy' },
      { num: '2 dny', label: 'Realizace' },
      { num: '200 mm', label: 'Tloušťka desky' },
      { num: '30 kg/m³', label: 'Drátky v betonu' }
    ],
    story: [
      {
        eyebrow: 'Zadání projektu',
        h2: 'Rekonstrukce výrobny pro <span>CNC obráběcí stroje</span>',
        body: '<p>Klient rekonstruoval výrobní halu pro <strong>nasazení nových CNC obráběcích center</strong>. Stávající podlaha nestačila — rovnost v desetinách milimetru je u CNC strojů kritická pro přesnost obrábění, navíc stroje vibrují a koncentrují vysoké bodové zatížení (přes 5 t na patku).</p><p>Hlavní požadavky: <strong>vysoká pevnost v tlaku</strong> kvůli statickému zatížení od strojů, <strong>odolnost vůči vibracím</strong> bez prasklin, <strong>rovinatost</strong> pro správnou montáž CNC, a <strong>krátká doba realizace</strong> kvůli omezení výroby.</p>'
      },
      {
        eyebrow: 'Naše řešení',
        h2: 'Drátkobeton C20/25 v tloušťce <span>200 mm</span> + vsyp',
        body: '<p>Navrhli jsme <strong>drátkobetonovou podlahu C20/25 v tloušťce 200 mm</strong> s rozptýlenou výztuží <strong>30 kg/m³ ocelových drátků</strong> (Dramix, délka 50 mm). Důvody volby drátkobetonu místo klasické KARI sítě:</p><ul><li><strong>Rovnoměrná výztuž v celém objemu</strong> — drátky působí proti smršťování a vibracím v 3D, ne jen ve 2 rovinách jako síť</li><li><strong>Vyšší odolnost proti dynamickému zatížení</strong> od vibrujících CNC strojů</li><li><strong>Žádné slabé spoje sítě</strong> — riziko prasklin sníženo o ~70 %</li><li><strong>Rychlejší realizace</strong> — žádné rozkládání + vázání kari sítě</li></ul><p>Po nalití následovalo <strong>strojní hlazení</strong> a aplikace <strong>pevnostního vsypu</strong> (mat #4) pro maximální odolnost povrchu vůči abrazi a olejům, které jsou v CNC provozu nevyhnutelné.</p>'
      },
      {
        eyebrow: 'Výsledek',
        h2: '830 m² <span>za 2 dny</span> — provoz minimálně narušen',
        body: '<p>Klient získal <strong>vysoce zátěžovou podlahu</strong> s předpokládanou životností 50+ let, schopnou unést stávající i budoucí CNC stroje včetně dynamických rázů. Hladký vsypový povrch je <strong>snadno čistitelný od olejů a třísek</strong>, žádné spáry kde by se kontaminace držela. Po 28 dnech zrání přebraly CNC stroje provoz — bez problémů.</p>'
      }
    ],
    gallery: [
      { src: '/img/reference/prumyslova-podlaha-cnc-vyrobna-zlin/priprava.webp', alt: 'Příprava plochy CNC výrobny — odstranění staré podlahy, výztuž', stage: 'pred', caption: 'Příprava + odstranění staré desky' },
      { src: '/img/reference/prumyslova-podlaha-cnc-vyrobna-zlin/proces.webp', alt: 'Lití drátkobetonu C20/25 v CNC výrobně Zlín — strojní hlazení', stage: 'behem', caption: 'Lití + strojní hlazení' },
      { src: '/img/reference/prumyslova-podlaha-cnc-vyrobna-zlin/final.webp', alt: 'Hotová drátkobetonová průmyslová podlaha s pevnostním vsypem', stage: 'po', caption: 'Hotový vsypový povrch' }
    ],
    specs: [
      { th: 'Materiál', td: '<span class="val">Beton C20/25</span> + ocelové drátky Dramix (l = 50 mm)' },
      { th: 'Drátky', td: '<span class="val">30 kg/m³</span> rozptýlené výztuže (rovnoměrně v celém objemu)' },
      { th: 'Tloušťka', td: '<span class="val">200 mm</span> drátkobetonová deska' },
      { th: 'Plocha', td: '<span class="val">830 m²</span> CNC výrobna' },
      { th: 'Povrch', td: 'Strojně hlazený + pevnostní vsyp (mat #4)' },
      { th: 'Dilatace', td: 'Pole ~6×6 m, řezané spáry do hloubky 1/3 desky' },
      { th: 'Doba realizace', td: '<span class="val">2 dny</span> (lití + strojní hlazení)' },
      { th: 'Pochůznost', td: '24 hodin' },
      { th: 'Plné zatížení', td: 'Po 28 dnech (CNC stroje)' },
      { th: 'Záruka', td: '5 let na vady díla' }
    ],
    timeline: [
      { day: 'Den 1 · 2025', text: '<strong>Lití + strojní hlazení 1. části</strong> (~415 m²). Beton C20/25 s drátky dovezený z betonárny, čerpán autočerpadlem.' },
      { day: 'Den 2 · 2025', text: '<strong>Lití + hlazení 2. části</strong> (~415 m²). Aplikace pevnostního vsypu (mat #4) za vlhka pro maximální vazbu.' },
      { day: 'Po 7 dnech', text: '<strong>Řezání dilatačních spár</strong> do hloubky 1/3 tloušťky desky. Plně chráněný povrch.' },
      { day: 'Po 28 dnech', text: '<strong>Plné zatížení</strong> — CNC stroje přebírají provoz. Bez problémů, bez prasklin.' }
    ]
  },

  {
    slug: 'lesteny-beton-rodinny-dum-ostrava',
    type: 'lesteny',
    serviceUrl: '/lesteny-beton',
    serviceName: 'Leštěný beton',
    title: 'Leštěný beton — rodinný dům Ostrava 140 m² | MO Betony',
    metaDescription: 'Případová studie: leštěný beton jako finální podlaha v rodinném domě Ostrava. 140 m², C20/25, drátky 20 kg/m³, industriální styl, lehký lesk Level 1-2. Září 2025.',
    h1Main: 'Leštěný beton',
    h1Highlight: 'rodinný dům Ostrava',
    badge: 'Leštěný beton · Realizace 09/2025',
    lokace: 'Ostrava',
    plocha: '140 m²',
    plochaNum: '140',
    doba: '4 dny',
    rok: '2025',
    datum: 'Září 2025',
    material: 'Beton C20/25 + drátky 20 kg/m³',
    tloustka: '120 mm',
    pevnost: 'C20/25',
    perex: 'Leštěný beton jako <strong>finální podlaha v rodinném domě v Ostravě</strong>. <strong>140 m²</strong> drátkobetonové podlahy C20/25 v tloušťce 120 mm, 20 kg/m³ drátků, strojně hlazená a leštěná do <strong>industriálního lehkého lesku</strong> (Level 1-2). Klient ušetřil za vinyl/dlažbu — leštěný beton je sám finálem.',
    heroImage: '/img/reference/lesteny-beton-rodinny-dum-ostrava/main.webp',
    heroAlt: 'Leštěný beton v rodinném domě Ostrava 140 m² — industriální styl, realizace MO Betony',
    heroCaption: 'Rodinný dům · Ostrava',
    stats: [
      { num: '140 m²', label: 'Plocha podlahy' },
      { num: '120 mm', label: 'Tloušťka' },
      { num: '20 kg/m³', label: 'Drátky' },
      { num: 'Level 1-2', label: 'Stupeň lesku' }
    ],
    story: [
      {
        eyebrow: 'Zadání projektu',
        h2: 'Industriální styl + <span>finální povrch bez krytiny</span>',
        body: '<p>Investor stavěl rodinný dům v Ostravě a chtěl <strong>industriální / průmyslový styl</strong> v interiéru. Důvod nebyl jen estetický — chtěl <strong>finální podlahu, kterou už nepřekrývá vinyl, dlažba ani parkety</strong>. Argument klienta: "Už nikdy nebudu platit za další podlahovou krytinu. Leštěný beton vydrží 50+ let a v podstatě stárne jen lépe."</p><p>Požadavky: <strong>lehký lesk</strong> (ne zrcadlový — ten je do showroomu), <strong>kompatibilita s podlahovým topením</strong> v obytné části, a estetika tmavého industriálního povrchu.</p>'
      },
      {
        eyebrow: 'Naše řešení',
        h2: 'Drátkobeton C20/25 + leštění do <span>Level 1-2</span>',
        body: '<p>Realizovali jsme <strong>drátkobetonovou desku C20/25 v tloušťce 120 mm</strong> s rozptýlenou výztuží <strong>20 kg/m³ drátků</strong>. Drátkobeton volíme i v RD, protože:</p><ul><li><strong>Stejnoměrná výztuž</strong> v celém objemu = méně mikroprasklin po vyzrání</li><li><strong>Vyšší odolnost</strong> v případě, že na podlahu spadne těžký předmět (typicky v dílně/garáži v RD)</li><li><strong>Lepší podklad pro leštění</strong> — drátky jsou pod povrchem, neovlivňují finální vzhled</li></ul><p>Po vyzrání jsme provedli <strong>strojní broušení diamantovými segmenty</strong> postupně přes čísla #50, #100, #200, #400 a finální leštění do Level 1-2 (industriální mat až lehký polesk). Aplikace impregnace pro odpudivost vůči olejům a kapalinám.</p>'
      },
      {
        eyebrow: 'Výsledek',
        h2: 'Klient ušetřil za <span>krytinu na 50+ let</span>',
        body: '<p>Klient získal <strong>finální podlahu v industriálním stylu</strong> v celém přízemí (140 m²) — obývací pokoj, kuchyň, chodby, technická místnost. <strong>Žádný vinyl, žádná dlažba, žádné parkety</strong> nebudou potřeba. V kombinaci s podlahovým topením a stěnami z pohledového betonu vznikl konzistentní industriální styl. <strong>Údržba</strong>: jen běžný vlhký mop + obnova impregnace každé 2-3 roky.</p>'
      }
    ],
    gallery: [
      { src: '/img/reference/lesteny-beton-rodinny-dum-ostrava/main.webp', alt: 'Leštěný beton v rodinném domě Ostrava — industriální styl, lehký lesk Level 1-2', stage: 'po', caption: 'Hotová leštěná podlaha v RD' }
    ],
    specs: [
      { th: 'Materiál', td: '<span class="val">Beton C20/25</span> + drátky 20 kg/m³ (rovnoměrná výztuž)' },
      { th: 'Tloušťka', td: '<span class="val">120 mm</span> drátkobetonová deska' },
      { th: 'Plocha', td: '<span class="val">140 m²</span> přízemí RD' },
      { th: 'Stupeň lesku', td: '<span class="val">Level 1-2</span> (industriální mat až lehký polesk)' },
      { th: 'Broušení', td: 'Postupně diamanty #50 → #100 → #200 → #400' },
      { th: 'Impregnace', td: 'Lithium silikát (penetrace) + topcoat proti olejům' },
      { th: 'Podlahové topení', td: 'Ano, kompatibilní (beton dobře vede teplo)' },
      { th: 'Životnost', td: '50+ let bez výměny krytiny' },
      { th: 'Údržba', td: 'Vlhký mop + obnova topcoatu každé 2-3 roky' },
      { th: 'Záruka', td: '5 let na vady díla' }
    ],
    timeline: [
      { day: 'Týden 1 · 09/2025', text: '<strong>Lití drátkobetonové desky</strong> (140 m², C20/25, 120 mm, 20 kg/m³ drátků). Strojní hlazení.' },
      { day: 'Týden 2-4', text: '<strong>Vyzrávání betonu</strong> (28 dní). Pravidelné vlhčení v prvních 7 dnech, kontrola CM vlhkosti.' },
      { day: 'Týden 5 · 09/2025', text: '<strong>Postupné broušení</strong> diamanty (#50, #100, #200, #400). Aplikace lithium silikátu.' },
      { day: 'Týden 6 · 09/2025', text: '<strong>Finální leštění</strong> do Level 1-2 + topcoat impregnace. Předání klientovi.' }
    ]
  },

  {
    slug: 'lesteny-beton-autoservis-prerov',
    type: 'lesteny',
    serviceUrl: '/lesteny-beton',
    serviceName: 'Leštěný beton',
    title: 'Leštěný beton — autoservis Přerov 320 m² | MO Betony',
    metaDescription: 'Případová studie: rekonstrukce autoservisu/pneuservisu Přerov. Leštěný beton 320 m², beton C30/37, tloušťka 180 mm, drátky 35 kg/m³. Listopad 2025.',
    h1Main: 'Leštěný beton',
    h1Highlight: 'autoservis Přerov',
    badge: 'Leštěný beton · Rekonstrukce 11/2025',
    lokace: 'Přerov',
    plocha: '320 m²',
    plochaNum: '320',
    doba: '2 dny',
    rok: '2025',
    datum: 'Listopad 2025',
    material: 'Beton C30/37 + drátky 35 kg/m³',
    tloustka: '180 mm',
    pevnost: 'C30/37',
    perex: 'Rekonstrukce autoservisu a pneuservisu v Přerově. <strong>320 m² leštěné drátkobetonové podlahy</strong> z betonu třídy C30/37 v tloušťce 180 mm, výztuž <strong>35 kg/m³</strong> ocelových drátků. Hladký bezprašný povrch <strong>odolný vůči olejům, brzdové kapalině, soli a chemikáliím</strong>. Snadné čištění, dlouhá životnost.',
    heroImage: '/img/landing/lesteny-beton-prerov-garaz-rekonstrukce-autoservis.webp',
    heroAlt: 'Leštěný beton autoservis Přerov 320 m² — drátkobetonová podlaha C30/37, realizace MO Betony',
    heroCaption: 'Autoservis · Přerov',
    stats: [
      { num: '320 m²', label: 'Plocha podlahy' },
      { num: 'C30/37', label: 'Pevnost betonu' },
      { num: '180 mm', label: 'Tloušťka desky' },
      { num: '35 kg/m³', label: 'Drátky' }
    ],
    story: [
      {
        eyebrow: 'Zadání projektu',
        h2: 'Rekonstrukce <span>autoservisu/pneuservisu</span>',
        body: '<p>Klient rekonstruoval autoservis a pneuservis — <strong>původní podlaha byla popraskaná</strong>, prašná, nasáklá olejem. Provoz vyžaduje hydraulické zvedáky (4 sloupové i 2 sloupové), pojezd vozidel až do hmotnosti 3,5 t, padání nářadí a každodenní kontakt s <strong>oleji, brzdovou kapalinou, AdBlue, posypovou solí</strong> v zimě.</p><p>Požadavky: <strong>vysoká pevnost</strong> kvůli zvedákům + provozu, <strong>chemická odolnost</strong> vůči ropným látkám, <strong>snadné čištění</strong> (žádné spáry kde by se hromadila špína), a <strong>bezprašnost</strong> kvůli návštěvníkům servisu.</p>'
      },
      {
        eyebrow: 'Naše řešení',
        h2: 'Vyšší pevnost <span>C30/37 + drátky 35 kg/m³</span>',
        body: '<p>Pro autoservis jsme zvolili <strong>vyšší pevnostní třídu betonu C30/37</strong> (běžné průmyslovky stačí C25/30) — důvod je <strong>vyšší koncentrace bodových zátěží</strong> od zvedáků a možné rázové zatížení od pádů nářadí. Tloušťka desky <strong>180 mm</strong> + výztuž <strong>35 kg/m³ drátků</strong> (vyšší než standard 25-30 kg/m³).</p><ul><li><strong>C30/37</strong> = pevnost 37 MPa v tlaku, dvojnásobek odolnosti proti zatížení vs C20/25</li><li><strong>35 kg/m³ drátků</strong> = maximální odolnost proti vibracím od zvedáků a tahu při pohybu vozidel</li><li><strong>Leštění</strong> + impregnace povrchu chrání před nasáknutím oleji a chemikáliemi</li></ul><p>Po vyzrání jsme realizovali <strong>strojní broušení a leštění do Level 2</strong> (saténový mat), aplikace <strong>chemicky odolného topcoatu</strong> proti ropným látkám.</p>'
      },
      {
        eyebrow: 'Výsledek',
        h2: 'Bezprašný hladký povrch <span>odolný vůči chemikáliím</span>',
        body: '<p>Klient získal <strong>bezprašný hladký povrch</strong> snadno čistitelný od olejů, brzdové kapaliny i solí v zimě. Žádné spáry kde by se zachytávaly nečistoty. Estetický posun: ze starého popraskaného servisu vznikl <strong>moderní profesionální autoservis</strong>, který návštěvníci hodnotí pozitivně už při prvním pohledu. Životnost desky 50+ let, povrchu (topcoat) 5-7 let, pak obnovit.</p>'
      }
    ],
    gallery: [
      { src: '/img/landing/lesteny-beton-prerov-garaz-rekonstrukce-autoservis.webp', alt: 'Leštěný beton autoservis Přerov — drátkobetonová podlaha C30/37 po rekonstrukci', stage: 'po', caption: 'Hotový autoservis po rekonstrukci' }
    ],
    specs: [
      { th: 'Materiál', td: '<span class="val">Beton C30/37</span> + ocelové drátky' },
      { th: 'Drátky', td: '<span class="val">35 kg/m³</span> (vyšší než standard kvůli zvedákům)' },
      { th: 'Tloušťka', td: '<span class="val">180 mm</span> drátkobetonová deska' },
      { th: 'Plocha', td: '<span class="val">320 m²</span> autoservis + pneuservis' },
      { th: 'Stupeň lesku', td: '<span class="val">Level 2</span> (saténový mat)' },
      { th: 'Topcoat', td: 'Chemicky odolný (oleje, brzdová kapalina, AdBlue, sůl)' },
      { th: 'Doba realizace', td: '<span class="val">2 dny</span> lití + ~5 dní leštění' },
      { th: 'Použití', td: 'Hydraulické zvedáky, vozidla do 3,5 t, ropné látky' },
      { th: 'Životnost desky', td: '50+ let' },
      { th: 'Záruka', td: '5 let na vady díla' }
    ]
  },

  {
    slug: 'lesteny-beton-zemedelska-hala-prerov',
    type: 'lesteny',
    serviceUrl: '/lesteny-beton',
    serviceName: 'Leštěný beton',
    title: 'Leštěný beton — zemědělská hala Přerov 620 m² | MO Betony',
    metaDescription: 'Případová studie: nová hala pro sklad zemědělské techniky Přerov. Leštěný beton 620 m², C30/37, 200 mm + drátky 35 kg/m³ + vsyp Fortedur. 3 dny realizace, 2025.',
    h1Main: 'Leštěný beton',
    h1Highlight: 'zemědělská hala Přerov',
    badge: 'Leštěný beton · Novostavba 2025',
    lokace: 'Přerov',
    plocha: '620 m²',
    plochaNum: '620',
    doba: '3 dny',
    rok: '2025',
    datum: '2025',
    material: 'Beton C30/37 + drátky 35 kg/m³ + vsyp Fortedur 6 kg/m²',
    tloustka: '200 mm',
    pevnost: 'C30/37',
    perex: 'Nová hala pro <strong>sklad zemědělské techniky a traktorů</strong> v Přerově. <strong>620 m² leštěné drátkobetonové podlahy</strong> C30/37 v tloušťce 200 mm + 35 kg/m³ drátků + leštění se <strong>vsypem Fortedur 6 kg/m²</strong> pro extrémní abrazivní odolnost. Vysoká bodová zátěž od traktorů a zemědělské techniky, požadovaná životnost 30+ let.',
    heroImage: '/img/landing/lesteny-beton-prerov-sklad-agro-objekt.webp',
    heroAlt: 'Leštěný beton sklad zemědělské techniky Přerov 620 m² — drátkobeton + vsyp Fortedur, MO Betony',
    heroCaption: 'Zemědělská hala · Přerov',
    stats: [
      { num: '620 m²', label: 'Plocha podlahy' },
      { num: '3 dny', label: 'Realizace' },
      { num: '200 mm', label: 'Tloušťka desky' },
      { num: 'Fortedur', label: 'Vsyp 6 kg/m²' }
    ],
    story: [
      {
        eyebrow: 'Zadání projektu',
        h2: 'Nová hala pro <span>traktory a zemědělskou techniku</span>',
        body: '<p>Klient stavěl <strong>novou halu pro sklad zemědělské techniky</strong> — traktory, vlečky, sečky, nářadí. Vysoké bodové zatížení (jeden traktor ~5-15 t s nákladem), velmi <strong>abrazivní pneumatiky</strong> (zemědělské vzorky způsobují extreme opotřebení), <strong>kontakt s naftou</strong>, oleji, hnojivy, slámou, špínou.</p><p>Požadavky: <strong>maximální nosnost</strong> pro traktory s vlečkou, <strong>extrémní abrazivní odolnost</strong> (10× horší podmínky než běžná průmyslovka), životnost 30+ let bez nutnosti renovace, snadné mechanické čištění (zametací stroj).</p>'
      },
      {
        eyebrow: 'Naše řešení',
        h2: 'Drátkobeton C30/37 + <span>vsyp Fortedur 6 kg/m²</span>',
        body: '<p>Pro extrémně náročný provoz jsme zvolili <strong>plnou kombinaci nejvyšších parametrů</strong>:</p><ul><li><strong>Beton C30/37</strong> v tloušťce 200 mm — vyšší pevnost pro traktory s vlečkou</li><li><strong>35 kg/m³ ocelových drátků</strong> — maximální odolnost proti rázům a vibracím</li><li><strong>Vsyp Fortedur 6 kg/m²</strong> aplikovaný za vlhka při strojním hlazení</li></ul><p><strong>Fortedur</strong> je pevnostní vsyp na bázi <strong>tvrdých minerálních zrn (korund + křemík)</strong>, který se zatře do horní vrstvy betonu a vytvoří <strong>2-3 mm extrémně odolnou povrchovou vrstvu</strong>. Odolnost proti abrazi je ~10× vyšší než u nepudlovaného betonu. Po vsypu následovalo <strong>postupné leštění do Level 1</strong> (industriální mat) pro snadné čištění.</p>'
      },
      {
        eyebrow: 'Výsledek',
        h2: 'Hala s nosností <span>nad požadavkem</span> + 30+ let životnost',
        body: '<p>Klient získal podlahu, která <strong>přesahuje požadavky pro plánovaný provoz</strong>. Traktory s plně naloženými vlečkami se pohybují bez problémů, pneumatiky nezpůsobují viditelné opotřebení po 6 měsících provozu. Olej a nafta nezatékají do povrchu (Fortedur + leštění). Údržba: <strong>strojní zametání 1× týdně</strong>, žádné mokré mytí potřeba. Předpokládaná životnost <strong>30+ let bez renovace povrchu</strong>.</p>'
      }
    ],
    gallery: [
      { src: '/img/landing/lesteny-beton-prerov-sklad-agro-objekt.webp', alt: 'Leštěný beton sklad zemědělské techniky Přerov — drátkobeton C30/37 + vsyp Fortedur', stage: 'po', caption: 'Hotová hala se vsypem Fortedur' }
    ],
    specs: [
      { th: 'Materiál', td: '<span class="val">Beton C30/37</span> + ocelové drátky + vsyp Fortedur' },
      { th: 'Drátky', td: '<span class="val">35 kg/m³</span> rozptýlená výztuž' },
      { th: 'Vsyp', td: '<span class="val">Fortedur 6 kg/m²</span> (korund + křemík, abrazivní odolnost)' },
      { th: 'Tloušťka desky', td: '<span class="val">200 mm</span> drátkobetonová deska' },
      { th: 'Plocha', td: '<span class="val">620 m²</span> zemědělská hala' },
      { th: 'Stupeň lesku', td: '<span class="val">Level 1</span> (industriální mat)' },
      { th: 'Provoz', td: 'Traktory + vlečky až 15 t, abrazivní zemědělské pneumatiky' },
      { th: 'Doba realizace', td: '<span class="val">3 dny</span> (lití + hlazení + vsyp + leštění)' },
      { th: 'Životnost povrchu', td: '30+ let bez renovace (Fortedur)' },
      { th: 'Záruka', td: '5 let na vady díla' }
    ],
    timeline: [
      { day: 'Den 1 · 2025', text: '<strong>Lití drátkobetonové desky</strong> (~210 m², C30/37, 200 mm, 35 kg/m³ drátků). Strojní hlazení.' },
      { day: 'Den 2 · 2025', text: '<strong>Lití zbylých 410 m²</strong>. Aplikace vsypu Fortedur 6 kg/m² za vlhka.' },
      { day: 'Den 3 · 2025', text: '<strong>Strojní leštění</strong> všech 620 m² do Level 1 (mat). Předání klientovi.' },
      { day: 'Po 28 dnech', text: '<strong>Plné zatížení</strong> — traktory přebírají skladování. Bez problémů.' }
    ]
  }
];

// =================================================================
// HTML TEMPLATE GENERATOR
// =================================================================
function renderPage(p) {
  const galleryHtml = renderGallery(p.gallery);
  const galleryGridClass = p.gallery.length === 1 ? 'gallery-grid-1' : (p.gallery.length === 2 ? 'gallery-grid-2' : 'gallery-grid-3');
  const statsHtml = p.stats.map(s => `      <div class="ref-stat">
        <div class="ref-stat-num">${s.num}</div>
        <div class="ref-stat-label">${s.label}</div>
      </div>`).join('\n');
  const storyHtml = p.story.map(s => `    <div class="ref-story-section">
      <div class="ref-story-eyebrow">${s.eyebrow}</div>
      <h2>${s.h2}</h2>
      ${s.body}
    </div>`).join('\n\n');
  const specsHtml = p.specs.map(s => `      <tr><th>${s.th}</th><td>${s.td}</td></tr>`).join('\n');
  const timelineHtml = (p.timeline || []).map(t => `      <li class="timeline-item">
        <div class="timeline-day">${t.day}</div>
        <div class="timeline-text">${t.text}</div>
      </li>`).join('\n');
  const showTimeline = p.timeline && p.timeline.length > 0;

  return `<!DOCTYPE html>
<html lang="cs">
<head>
  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">

  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=AW-11264011068"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'AW-11264011068');
    gtag('config', 'G-7Z9R2TW5ER');
  </script>
  <script>
    function gtag_report_phone_conversion(url) {
      var callback = function () { if (typeof(url) != 'undefined') { window.location = url; } };
      gtag('event', 'conversion', { 'send_to': 'AW-11264011068/bnGJCJaW05AcELzWjPsp', 'value': 200.0, 'currency': 'CZK', 'event_callback': callback });
      return false;
    }
  </script>

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.title}</title>
  <meta name="description" content="${p.metaDescription}">
  <link rel="canonical" href="https://mobetony.cz/reference/${p.slug}/">

  <meta property="og:title" content="${p.title}">
  <meta property="og:description" content="${p.metaDescription}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://mobetony.cz/reference/${p.slug}/">
  <meta property="og:site_name" content="MO Betony">
  <meta property="og:locale" content="cs_CZ">
  <meta property="og:image" content="https://mobetony.cz${p.heroImage}">
  <meta name="twitter:card" content="summary_large_image">

  <!-- Schema: BreadcrumbList -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "Úvod", "item": "https://mobetony.cz/"},
      {"@type": "ListItem", "position": 2, "name": "Realizace", "item": "https://mobetony.cz/vsechny-projekty"},
      {"@type": "ListItem", "position": 3, "name": "${escJson(p.h1Main + ' — ' + p.h1Highlight)}", "item": "https://mobetony.cz/reference/${p.slug}/"}
    ]
  }
  </script>

  <!-- Schema: CreativeWork (case study) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "${escJson(p.h1Main + ' — ' + p.h1Highlight)}",
    "description": "${escJson(p.metaDescription)}",
    "creator": {"@type": "Organization", "@id": "https://mobetony.cz/#business", "name": "MO Betony s.r.o."},
    "datePublished": "${p.rok}-12-31",
    "locationCreated": {"@type": "Place", "name": "${p.lokace}", "address": {"@type": "PostalAddress", "addressLocality": "${p.lokace}", "addressCountry": "CZ"}},
    "image": "https://mobetony.cz${p.heroImage}",
    "about": {"@type": "Service", "name": "${p.serviceName}", "url": "https://mobetony.cz${p.serviceUrl}"}
  }
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@700;800;900&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@700;800;900&display=swap" rel="stylesheet"></noscript>

  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0d0d0d; --bg2: #141414; --bg3: #1a1a1a; --bg4: #222222;
      --orange: #f97316; --orange2: #ea6b0e; --cyan: #06b6d4;
      --white: #fff; --gray: #9ca3af; --gray2: #6b7280;
      --border: #2a2a2a; --border2: #333;
      --font-head: 'Barlow Condensed', sans-serif;
      --font-body: 'Barlow', sans-serif;
      --radius: 16px; --radius-sm: 8px;
    }
    body { font-family: var(--font-body); background: var(--bg); color: var(--white); line-height: 1.6; font-weight: 400; }
    a { color: inherit; text-decoration: none; }
    img { max-width: 100%; display: block; }

    /* NAV */
    nav { position: fixed; top: 0; width: 100%; z-index: 100; background: rgba(13,13,13,0.85); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); padding: 14px clamp(16px, 4vw, 48px); display: flex; align-items: center; justify-content: space-between; }
    .nav-logo { display: flex; align-items: center; gap: 10px; }
    .nav-logo-badge { width: 36px; height: 36px; background: var(--orange); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-family: var(--font-head); font-weight: 900; font-size: 14px; color: var(--white); }
    .nav-logo-text { display: flex; flex-direction: column; line-height: 1; }
    .nav-logo-name { font-family: var(--font-head); font-weight: 800; font-size: 18px; }
    .nav-logo-sub { font-size: 10px; color: var(--gray); letter-spacing: 1.5px; }
    .nav-links { display: flex; gap: 28px; list-style: none; }
    .nav-links a { color: var(--white); font-size: 14px; font-weight: 500; transition: color .2s; }
    .nav-links a:hover { color: var(--orange); }
    .btn-call { background: var(--orange); color: var(--white); padding: 8px 18px; border-radius: var(--radius-sm); font-weight: 600; font-size: 14px; }
    .btn-call:hover { background: var(--orange2); }
    @media (max-width: 880px) { .nav-links { display: none; } }

    /* BREADCRUMB */
    .breadcrumb-bar { max-width: 1200px; margin: 0 auto; padding: 90px clamp(16px, 4vw, 48px) 0; }
    .breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--gray2); flex-wrap: wrap; }
    .breadcrumb a { color: var(--orange); }
    .breadcrumb .sep { color: var(--gray2); }
    .breadcrumb .current { color: var(--gray); }

    /* HERO */
    .ref-hero { padding: 36px clamp(16px, 4vw, 48px) 60px; max-width: 1200px; margin: 0 auto; position: relative; }
    .ref-hero::before { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 90%; max-width: 1000px; height: 400px; background: radial-gradient(circle at 30% 40%, rgba(249,115,22,0.10), transparent 60%); pointer-events: none; z-index: 0; }
    .ref-hero-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 3rem; align-items: center; position: relative; z-index: 1; }
    .hero-badge { display: inline-block; font-size: 12px; font-weight: 700; color: var(--orange); background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.25); border-radius: 20px; padding: 5px 14px; margin-bottom: 18px; letter-spacing: 1px; text-transform: uppercase; }
    .ref-hero h1 { font-family: var(--font-head); font-size: clamp(32px, 5vw, 56px); font-weight: 900; line-height: 1.05; margin-bottom: 16px; text-transform: uppercase; }
    .ref-hero h1 span { color: var(--orange); }
    .ref-meta { display: flex; flex-wrap: wrap; gap: 18px; margin-bottom: 24px; }
    .ref-meta-item { display: flex; align-items: center; gap: 6px; font-size: 14px; color: var(--gray); }
    .ref-meta-item svg { width: 16px; height: 16px; stroke: var(--orange); fill: none; stroke-width: 2; flex-shrink: 0; stroke-linecap: round; stroke-linejoin: round; }
    .ref-meta-item strong { color: var(--white); font-weight: 600; }
    .ref-perex { font-size: clamp(15px, 1.8vw, 17px); color: var(--gray); line-height: 1.6; margin-bottom: 28px; max-width: 540px; }
    .ref-perex strong { color: var(--white); font-weight: 600; }
    .hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }
    .btn-orange { background: var(--orange); color: var(--white); padding: 13px 26px; border-radius: var(--radius-sm); font-weight: 700; font-size: 15px; transition: background .2s, transform .15s; }
    .btn-orange:hover { background: var(--orange2); transform: translateY(-1px); }
    .btn-ghost { border: 1px solid var(--border2); color: var(--white); padding: 13px 26px; border-radius: var(--radius-sm); font-weight: 600; font-size: 15px; transition: border-color .2s, color .2s; }
    .btn-ghost:hover { border-color: var(--orange); color: var(--orange); }
    .ref-hero-image { position: relative; border-radius: var(--radius); overflow: hidden; aspect-ratio: 4/3; border: 1px solid var(--border); }
    .ref-hero-image img { width: 100%; height: 100%; object-fit: cover; }
    .ref-hero-image-caption { position: absolute; bottom: 14px; left: 14px; background: rgba(13,13,13,0.88); backdrop-filter: blur(8px); padding: 8px 14px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 500; border: 1px solid var(--border2); }
    @media (max-width: 880px) {
      .ref-hero-grid { grid-template-columns: 1fr; gap: 2rem; }
      .ref-perex { max-width: none; }
    }

    /* STATS BAR */
    .ref-stats { background: var(--bg2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 36px clamp(16px, 4vw, 48px); }
    .ref-stats-grid { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
    .ref-stat { text-align: left; }
    .ref-stat-num { font-family: var(--font-head); font-weight: 900; font-size: clamp(26px, 3vw, 38px); color: var(--orange); line-height: 1; margin-bottom: 6px; }
    .ref-stat-label { font-size: 12px; color: var(--gray); text-transform: uppercase; letter-spacing: 1.2px; }
    @media (max-width: 600px) { .ref-stats-grid { grid-template-columns: repeat(2, 1fr); } }

    /* STORY */
    .ref-story { padding: 80px clamp(16px, 4vw, 48px); max-width: 800px; margin: 0 auto; }
    .ref-story-section { margin-bottom: 3rem; }
    .ref-story-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: var(--orange); text-transform: uppercase; margin-bottom: 12px; }
    .ref-story h2 { font-family: var(--font-head); font-size: clamp(24px, 3vw, 36px); font-weight: 800; margin-bottom: 16px; text-transform: uppercase; line-height: 1.1; }
    .ref-story h2 span { color: var(--orange); }
    .ref-story p { font-size: 16px; color: var(--gray); line-height: 1.7; margin-bottom: 14px; }
    .ref-story p strong { color: var(--white); font-weight: 600; }
    .ref-story ul { color: var(--gray); padding-left: 24px; line-height: 1.7; margin-bottom: 14px; }
    .ref-story ul li::marker { color: var(--orange); }
    .ref-story ul li strong { color: var(--white); font-weight: 600; }

    /* GALLERY */
    .ref-gallery { padding: 60px clamp(16px, 4vw, 48px); max-width: 1200px; margin: 0 auto; }
    .ref-gallery h2 { font-family: var(--font-head); font-size: clamp(28px, 3.5vw, 40px); font-weight: 800; text-transform: uppercase; margin-bottom: 28px; line-height: 1.1; }
    .ref-gallery h2 span { color: var(--orange); }
    .gallery-grid { display: grid; gap: 16px; }
    .gallery-grid-3 { grid-template-columns: repeat(3, 1fr); }
    .gallery-grid-2 { grid-template-columns: repeat(2, 1fr); }
    .gallery-grid-1 { grid-template-columns: 1fr; max-width: 900px; margin: 0 auto; }
    .gallery-figure { margin: 0; border-radius: var(--radius-sm); overflow: hidden; background: var(--bg3); border: 1px solid var(--border); transition: border-color .2s, transform .2s; }
    .gallery-figure:hover { border-color: var(--orange); transform: translateY(-2px); }
    .gallery-figure img { width: 100%; height: 240px; object-fit: cover; display: block; }
    .gallery-grid-1 .gallery-figure img { height: 480px; }
    .gallery-figure figcaption { padding: 10px 14px; font-size: 13px; color: var(--gray); display: flex; align-items: center; gap: 8px; }
    .gallery-stage { font-size: 10px; font-weight: 800; letter-spacing: 0.6px; text-transform: uppercase; padding: 2px 8px; border-radius: 100px; flex-shrink: 0; }
    .stage-pred { background: rgba(156,163,175,0.15); color: var(--gray); }
    .stage-behem { background: rgba(234,179,8,0.18); color: #fde047; }
    .stage-po { background: rgba(34,197,94,0.18); color: #86efac; }
    @media (max-width: 800px) { .gallery-grid-3, .gallery-grid-2 { grid-template-columns: 1fr; } .gallery-grid-1 .gallery-figure img { height: 280px; } }

    /* SPECS */
    .ref-specs { padding: 60px clamp(16px, 4vw, 48px); max-width: 800px; margin: 0 auto; }
    .ref-specs h2 { font-family: var(--font-head); font-size: clamp(24px, 3vw, 36px); font-weight: 800; text-transform: uppercase; margin-bottom: 24px; line-height: 1.1; }
    .ref-specs h2 span { color: var(--orange); }
    .spec-table { width: 100%; border-collapse: collapse; background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
    .spec-table tr { border-bottom: 1px solid var(--border); }
    .spec-table tr:last-child { border-bottom: none; }
    .spec-table th { text-align: left; padding: 14px 18px; background: var(--bg3); font-family: var(--font-head); font-weight: 700; font-size: 14px; color: var(--white); width: 40%; vertical-align: top; }
    .spec-table td { padding: 14px 18px; color: var(--gray); font-size: 14px; }
    .spec-table .val { color: var(--orange); font-weight: 600; }

    /* TIMELINE */
    .ref-timeline { padding: 60px clamp(16px, 4vw, 48px); max-width: 800px; margin: 0 auto; }
    .ref-timeline h2 { font-family: var(--font-head); font-size: clamp(24px, 3vw, 36px); font-weight: 800; text-transform: uppercase; margin-bottom: 32px; line-height: 1.1; }
    .ref-timeline h2 span { color: var(--orange); }
    .timeline-list { list-style: none; position: relative; padding-left: 32px; }
    .timeline-list::before { content: ''; position: absolute; left: 11px; top: 8px; bottom: 8px; width: 2px; background: var(--border2); }
    .timeline-item { position: relative; padding-bottom: 24px; }
    .timeline-item::before { content: ''; position: absolute; left: -28px; top: 4px; width: 12px; height: 12px; border-radius: 50%; background: var(--orange); box-shadow: 0 0 0 4px var(--bg); }
    .timeline-item:last-child { padding-bottom: 0; }
    .timeline-day { font-family: var(--font-head); font-weight: 800; font-size: 14px; letter-spacing: 1px; color: var(--orange); text-transform: uppercase; margin-bottom: 4px; }
    .timeline-text { color: var(--gray); font-size: 15px; line-height: 1.6; }
    .timeline-text strong { color: var(--white); font-weight: 600; }

    /* CROSS-LINK */
    .ref-cross { padding: 60px clamp(16px, 4vw, 48px); max-width: 1100px; margin: 0 auto; }
    .ref-cross h2 { font-family: var(--font-head); font-size: clamp(24px, 3vw, 36px); font-weight: 800; text-transform: uppercase; margin-bottom: 24px; line-height: 1.1; }
    .ref-cross h2 span { color: var(--orange); }
    .cross-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .cross-card { background: var(--bg3); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 20px 22px; transition: border-color .2s, transform .2s; }
    .cross-card:hover { border-color: var(--orange); transform: translateY(-2px); }
    .cross-card-title { font-family: var(--font-head); font-weight: 800; font-size: 18px; text-transform: uppercase; margin-bottom: 6px; }
    .cross-card-desc { font-size: 14px; color: var(--gray); line-height: 1.5; margin-bottom: 12px; }
    .cross-card-arrow { color: var(--orange); font-weight: 700; font-size: 14px; }
    @media (max-width: 800px) { .cross-grid { grid-template-columns: 1fr; } }

    /* CTA */
    .ref-back-cta { padding: 80px clamp(16px, 4vw, 48px); max-width: 900px; margin: 0 auto; text-align: center; }
    .cta-banner { background: linear-gradient(135deg, var(--bg3) 0%, #1f1008 100%); border: 1px solid rgba(249,115,22,0.25); border-radius: var(--radius); padding: 56px clamp(24px, 4vw, 48px); }
    .cta-banner h2 { font-family: var(--font-head); font-size: clamp(28px, 3.5vw, 40px); font-weight: 900; line-height: 1.1; margin-bottom: 14px; }
    .cta-banner h2 span { color: var(--orange); }
    .cta-banner p { color: var(--gray); font-size: 16px; margin-bottom: 28px; }
    .cta-banner-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

    /* FOOTER */
    footer { background: var(--bg2); border-top: 1px solid var(--border); padding: 36px clamp(16px, 4vw, 48px); margin-top: 60px; text-align: center; color: var(--gray2); font-size: 13px; }
    footer a { color: var(--orange); }
  </style>
</head>
<body>

  <nav>
    <a href="/" class="nav-logo">
      <div class="nav-logo-badge">MO</div>
      <div class="nav-logo-text">
        <span class="nav-logo-name">MO Betony</span>
        <span class="nav-logo-sub">S.R.O.</span>
      </div>
    </a>
    <ul class="nav-links">
      <li><a href="/typy-podlah">Typy podlah</a></li>
      <li><a href="/vsechny-projekty">Realizace</a></li>
      <li><a href="/cenik">Ceník</a></li>
      <li><a href="/kontakt">Kontakt</a></li>
    </ul>
    <a href="tel:+420774611154" class="btn-call" onclick="return gtag_report_phone_conversion(this.href);">+420 774 611 154</a>
  </nav>

  <div class="breadcrumb-bar">
    <div class="breadcrumb" role="navigation" aria-label="Breadcrumb">
      <a href="/">Úvod</a>
      <span class="sep">›</span>
      <a href="/vsechny-projekty">Realizace</a>
      <span class="sep">›</span>
      <span class="current">${p.h1Main} — ${p.h1Highlight}</span>
    </div>
  </div>

  <section class="ref-hero">
    <div class="ref-hero-grid">
      <div class="ref-hero-content">
        <span class="hero-badge">${p.badge}</span>
        <h1>${p.h1Main} <span>${p.h1Highlight}</span></h1>
        <div class="ref-meta">
          <span class="ref-meta-item">
            <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span><strong>${p.lokace}</strong></span>
          </span>
          <span class="ref-meta-item">
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            <span><strong>${p.plocha}</strong> podlahy</span>
          </span>
          <span class="ref-meta-item">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 15 14"/></svg>
            <span><strong>${p.doba}</strong> realizace</span>
          </span>
          <span class="ref-meta-item">
            <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>${p.datum}</span>
          </span>
        </div>
        <p class="ref-perex">${p.perex}</p>
        <div class="hero-btns">
          <a href="/kontakt" class="btn-orange">Chci podobnou realizaci →</a>
          <a href="tel:+420774611154" class="btn-ghost" onclick="return gtag_report_phone_conversion(this.href);">Zavolat přímo</a>
        </div>
      </div>
      <div class="ref-hero-image">
        <img src="${p.heroImage}" alt="${p.heroAlt}" width="1280" height="960" fetchpriority="high">
        <div class="ref-hero-image-caption">${p.heroCaption}</div>
      </div>
    </div>
  </section>

  <section class="ref-stats">
    <div class="ref-stats-grid">
${statsHtml}
    </div>
  </section>

  <section class="ref-story">
${storyHtml}
  </section>

  <section class="ref-gallery">
    <h2>Foto<span>galerie</span></h2>
    <div class="gallery-grid ${galleryGridClass}">
${galleryHtml}
    </div>
  </section>

  <section class="ref-specs">
    <h2>Technické <span>parametry</span></h2>
    <table class="spec-table">
${specsHtml}
    </table>
  </section>

${showTimeline ? `  <section class="ref-timeline">
    <h2>Průběh <span>realizace</span></h2>
    <ol class="timeline-list">
${timelineHtml}
    </ol>
  </section>

` : ''}  <section class="ref-cross">
    <h2>Hodí se i pro <span>vás</span>?</h2>
    <div class="cross-grid">
      <a href="${p.serviceUrl}" class="cross-card">
        <div class="cross-card-title">${p.serviceName}</div>
        <div class="cross-card-desc">Detail služby, ceny, technické parametry, kdy zvolit.</div>
        <span class="cross-card-arrow">Zobrazit službu →</span>
      </a>
      <a href="/typy-podlah" class="cross-card">
        <div class="cross-card-title">Všechny typy podlah</div>
        <div class="cross-card-desc">Přehled betonových a litých podlah od 250 Kč/m². Která je pro vás?</div>
        <span class="cross-card-arrow">Zobrazit srovnání →</span>
      </a>
      <a href="/vsechny-projekty" class="cross-card">
        <div class="cross-card-title">Další realizace</div>
        <div class="cross-card-desc">500+ dokončených projektů — anhydrit, beton, leštěný, průmyslový.</div>
        <span class="cross-card-arrow">Zobrazit galerii →</span>
      </a>
    </div>
  </section>

  <section class="ref-back-cta">
    <div class="cta-banner">
      <h2>Chcete <span>podobnou realizaci</span>?</h2>
      <p>Nezávazná kalkulace zdarma do 24 hodin. Realizujeme po Olomouckém, Jihomoravském, Moravskoslezském a Zlínském kraji.</p>
      <div class="cta-banner-btns">
        <a href="/kontakt" class="btn-orange">Nezávazná poptávka →</a>
        <a href="tel:+420774611154" class="btn-ghost" onclick="return gtag_report_phone_conversion(this.href);">+420 774 611 154</a>
      </div>
    </div>
  </section>

  <footer>
    © 2026 <a href="/">MO Betony s.r.o.</a> · Realizace anhydritových, leštěných, průmyslových a betonových podlah · <a href="/vsechny-projekty">← Zpět na všechny realizace</a>
  </footer>

</body>
</html>
`;
}

function renderGallery(items) {
  return items.map(g => `      <figure class="gallery-figure">
        <img src="${g.src}" alt="${g.alt}" loading="lazy">
        <figcaption>
          <span class="gallery-stage stage-${g.stage}">${stageLabel(g.stage)}</span>
          ${g.caption}
        </figcaption>
      </figure>`).join('\n');
}

function stageLabel(stage) {
  return ({ pred: 'Před', behem: 'Realizace', po: 'Hotovo' })[stage] || 'Realizace';
}

function escJson(s) {
  return s.replace(/"/g, '\\"');
}

// =================================================================
// BUILD
// =================================================================
let count = 0;
for (const p of PROJECTS) {
  const dir = `${ROOT}/reference/${p.slug}`;
  await mkdir(dir, { recursive: true });
  const html = renderPage(p);
  await writeFile(`${dir}/index.html`, html, 'utf-8');
  console.log(`OK   reference/${p.slug}/index.html (${(html.length / 1024).toFixed(1)} KB)`);
  count++;
}

console.log();
console.log(`Built ${count} reference detail pages.`);
