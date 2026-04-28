# fix-nav.ps1 — nahradí nav HTML + přidá dropdown CSS + JS ve všech article bez navDropdown
# Spustit z: C:\Projects\mobetony

$blogDir = "C:\Projects\mobetony\blog"
$enc = [System.Text.Encoding]::UTF8

# ─── TARGET NAV HTML ───────────────────────────────────────────────────────────
$newNav = @'
<nav>
  <a href="/" class="nav-logo">
    <img src="/android-chrome-512x512.png" alt="MO Betony logo" class="nav-logo-badge">
    <div class="nav-logo-text">
      <span class="nav-logo-name">MO Betony</span>
      <span class="nav-logo-sub">BETONOVÉ PODLAHY</span>
    </div>
  </a>
  <ul class="nav-links">
    <li class="nav-dropdown" id="navDropdown">
      <button class="nav-dropdown-toggle" aria-haspopup="true" aria-expanded="false">
        Služby
        <svg class="chevron" viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="nav-dropdown-panel" role="menu">
        <div class="nav-dropdown-grid">
          <a href="/anhydritove-podlahy-olomouc" class="nav-dropdown-item">
            <svg class="nav-dropdown-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17l9-12 9 12H3z"/><path d="M7 17v3M12 17v3M17 17v3"/><path d="M9 12.5h6"/></svg>
            <div class="nav-dropdown-text">
              <span class="nav-dropdown-title">Anhydritové podlahy</span>
              <span class="nav-dropdown-desc">Lité potěry pro RD a podlahové topení</span>
            </div>
          </a>
          <a href="/lesteny-beton-olomouc" class="nav-dropdown-item">
            <svg class="nav-dropdown-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 9.5c1-2 3-3 5.5-2.5"/><circle cx="12" cy="12" r="3.5"/></svg>
            <div class="nav-dropdown-text">
              <span class="nav-dropdown-title">Leštěný beton</span>
              <span class="nav-dropdown-desc">Hlazený a broušený beton, RD i showroomy</span>
            </div>
          </a>
          <a href="/prumyslove-podlahy-olomouc" class="nav-dropdown-item">
            <svg class="nav-dropdown-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21V10l5 3V10l5 3V10l5 3v8z"/><path d="M3 21h18"/><path d="M8 17h2M13 17h2M18 17h.01"/></svg>
            <div class="nav-dropdown-text">
              <span class="nav-dropdown-title">Průmyslové podlahy</span>
              <span class="nav-dropdown-desc">Drátkobeton, vsypy, pancéřové pro haly</span>
            </div>
          </a>
          <a href="/betonove-podlahy-olomouc" class="nav-dropdown-item">
            <svg class="nav-dropdown-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="14" width="18" height="6" rx="0.5"/><path d="M3 14l3-4h12l3 4"/><path d="M9 10V6h6v4"/><path d="M7 17h.01M11 17h.01M15 17h.01M19 17h.01"/></svg>
            <div class="nav-dropdown-text">
              <span class="nav-dropdown-title">Betonové podlahy</span>
              <span class="nav-dropdown-desc">Hlazený beton, podkladní desky, kompletní řešení</span>
            </div>
          </a>
        </div>
        <div class="nav-dropdown-footer">
          <a href="/typy-podlah">
            Zobrazit všechny typy podlah
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>
      </div>
    </li>
    <li><a href="/cenik">Ceník</a></li>
    <li><a href="/vsechny-projekty">Naše realizace</a></li>
    <li><a href="/o-nas">O nás</a></li>
    <li><a href="/blog">Blog <span class="badge-new">Nové</span></a></li>
    <li><a href="/#kontakt">Kontakt</a></li>
  </ul>
  <a href="tel:+420774611154" class="btn-call" onclick="return gtag_report_phone_conversion(this.href);">
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
    <span>Volejte</span>
  </a>
  <button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
</nav>
'@

# ─── TARGET MOBILE NAV HTML ────────────────────────────────────────────────────
$newNavMobile = @'
<div class="nav-mobile" id="navMobile">
  <div class="nav-mobile-dropdown" id="navMobileDropdown">
    <button class="nav-mobile-dropdown-toggle" aria-expanded="false">
      <span>Služby</span>
      <svg class="chevron" viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
    </button>
    <div class="nav-mobile-dropdown-list">
      <a href="/anhydritove-podlahy-olomouc"><svg viewBox="0 0 24 24"><path d="M3 17l9-12 9 12H3z"/><path d="M7 17v3M12 17v3M17 17v3"/><path d="M9 12.5h6"/></svg>Anhydritové podlahy</a>
      <a href="/lesteny-beton-olomouc"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 9.5c1-2 3-3 5.5-2.5"/><circle cx="12" cy="12" r="3.5"/></svg>Leštěný beton</a>
      <a href="/prumyslove-podlahy-olomouc"><svg viewBox="0 0 24 24"><path d="M3 21V10l5 3V10l5 3V10l5 3v8z"/><path d="M3 21h18"/><path d="M8 17h2M13 17h2M18 17h.01"/></svg>Průmyslové podlahy</a>
      <a href="/betonove-podlahy-olomouc"><svg viewBox="0 0 24 24"><rect x="3" y="14" width="18" height="6" rx="0.5"/><path d="M3 14l3-4h12l3 4"/><path d="M9 10V6h6v4"/></svg>Betonové podlahy</a>
    </div>
  </div>
  <a href="/cenik">Ceník</a>
  <a href="/vsechny-projekty">Naše realizace</a>
  <a href="/o-nas">O nás</a>
  <a href="/blog">Blog <span class="badge-new">Nové</span></a>
  <a href="/#kontakt">Kontakt</a>
  <a href="tel:+420774611154" style="color:#f97316;font-weight:600;" onclick="return gtag_report_phone_conversion(this.href);">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:6px;" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>Volejte nám: +420 774 611 154
  </a>
</div>
'@

# ─── DROPDOWN CSS (injected before </head>) ────────────────────────────────────
$navDropdownCss = @'
<style>
/* === NAV DROPDOWN — 2026 === */
.nav-dropdown{position:relative}
.nav-dropdown-toggle{cursor:pointer;background:none;border:none;font-family:inherit;font-size:15px;color:#9ca3af;padding:0 0 4px 0;display:flex;align-items:center;gap:6px;transition:color .3s,text-shadow .3s;position:relative}
.nav-dropdown-toggle::after{content:'';position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:0;height:2px;background:#f97316;border-radius:1px;transition:width .25s ease}
.nav-dropdown:hover .nav-dropdown-toggle,.nav-dropdown.open .nav-dropdown-toggle{color:#f97316;text-shadow:0 0 8px rgba(249,115,22,0.4)}
.nav-dropdown:hover .nav-dropdown-toggle::after,.nav-dropdown.open .nav-dropdown-toggle::after{width:60%}
.nav-dropdown-toggle .chevron{width:12px;height:12px;transition:transform .25s ease;stroke:currentColor;stroke-width:2.5;fill:none;stroke-linecap:round;stroke-linejoin:round}
.nav-dropdown:hover .chevron,.nav-dropdown.open .chevron{transform:rotate(180deg)}
.nav-dropdown-panel{position:absolute;top:calc(100% + 14px);left:50%;transform:translateX(-50%) translateY(-8px);width:620px;background:rgba(20,20,20,0.98);backdrop-filter:blur(16px);border:1px solid #2a2a2a;border-radius:16px;padding:18px;opacity:0;visibility:hidden;transition:opacity .25s ease,transform .25s ease,visibility .25s;box-shadow:0 12px 48px rgba(0,0,0,0.6),0 0 1px rgba(249,115,22,0.15)}
.nav-dropdown:hover .nav-dropdown-panel,.nav-dropdown.open .nav-dropdown-panel{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0)}
.nav-dropdown-panel::before{content:'';position:absolute;top:-14px;left:0;right:0;height:14px}
.nav-dropdown-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.nav-dropdown-item{display:flex;align-items:flex-start;gap:12px;padding:12px 14px;background:#1a1a1a;border-radius:8px;border-left:3px solid #f97316;transition:background .2s ease,transform .2s ease;text-decoration:none}
.nav-dropdown-item:hover{background:#222222;transform:translateX(2px)}
.nav-dropdown-item::after{display:none!important}
.nav-dropdown-icon{width:22px;height:22px;flex-shrink:0;margin-top:1px;stroke:#f97316;stroke-width:1.8;fill:none;stroke-linecap:round;stroke-linejoin:round}
.nav-dropdown-text{display:flex;flex-direction:column;gap:3px}
.nav-dropdown-title{color:#fff;font-weight:600;font-size:14px;line-height:1.2}
.nav-dropdown-desc{color:#9ca3af;font-size:12px;line-height:1.4}
.nav-dropdown-footer{margin-top:14px;padding-top:14px;border-top:1px solid #2a2a2a;text-align:center}
.nav-dropdown-footer a{color:#f97316;font-size:13px;font-weight:600;padding-bottom:0;display:inline-flex;gap:6px}
.nav-dropdown-footer a::after{display:none}
.nav-dropdown-footer a:hover{color:#ea6b0e}
.nav-mobile-dropdown{display:flex;flex-direction:column}
.nav-mobile-dropdown-toggle{background:none;border:none;font-family:inherit;font-size:16px;color:#fff;padding:.25rem 0;cursor:pointer;display:flex;align-items:center;justify-content:space-between;width:100%}
.nav-mobile-dropdown-toggle .chevron{width:14px;height:14px;stroke:currentColor;stroke-width:2.5;fill:none;stroke-linecap:round;stroke-linejoin:round;transition:transform .25s ease}
.nav-mobile-dropdown.open .nav-mobile-dropdown-toggle .chevron{transform:rotate(180deg)}
.nav-mobile-dropdown-list{display:none;flex-direction:column;gap:.85rem;padding:.85rem 0 .5rem 1.25rem;border-left:2px solid #2a2a2a;margin-left:4px}
.nav-mobile-dropdown.open .nav-mobile-dropdown-list{display:flex}
.nav-mobile-dropdown-list a{font-size:15px;color:#9ca3af;padding:0;display:flex;align-items:center;gap:10px}
.nav-mobile-dropdown-list a:hover{color:#f97316}
.nav-mobile-dropdown-list a svg{width:16px;height:16px;stroke:#f97316;stroke-width:1.8;fill:none;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}
.btn-cta{color:#000!important}
.article-cta .btn-cta,.article-cta a.btn-cta{color:#000!important}
</style>
'@

# ─── NAV JS (injected before </body>) ──────────────────────────────────────────
$navJs = @'
<script>
/* NAV JS */
(function(){
  var navToggle=document.getElementById('navToggle');
  var navMobile=document.getElementById('navMobile');
  if(navToggle&&navMobile){
    navToggle.addEventListener('click',function(){
      var isOpen=navMobile.classList.toggle('open');
      navToggle.setAttribute('aria-expanded',isOpen?'true':'false');
    });
    navMobile.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){
        navMobile.classList.remove('open');
        navToggle.setAttribute('aria-expanded','false');
      });
    });
  }
  var mobDropdown=document.getElementById('navMobileDropdown');
  if(mobDropdown){
    var mobToggle=mobDropdown.querySelector('.nav-mobile-dropdown-toggle');
    if(mobToggle){
      mobToggle.addEventListener('click',function(e){
        e.stopPropagation();
        var isOpen=mobDropdown.classList.toggle('open');
        mobToggle.setAttribute('aria-expanded',isOpen?'true':'false');
      });
    }
  }
  var dropdown=document.getElementById('navDropdown');
  if(dropdown){
    var dropToggle=dropdown.querySelector('.nav-dropdown-toggle');
    if(dropToggle){
      dropToggle.addEventListener('click',function(e){
        e.stopPropagation();
        var isOpen=dropdown.classList.toggle('open');
        dropToggle.setAttribute('aria-expanded',isOpen?'true':'false');
      });
    }
    document.addEventListener('click',function(e){
      if(!dropdown.contains(e.target)){
        dropdown.classList.remove('open');
        if(dropToggle)dropToggle.setAttribute('aria-expanded','false');
      }
    });
  }
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'||e.key==='Esc'){
      if(dropdown)dropdown.classList.remove('open');
      if(mobDropdown)mobDropdown.classList.remove('open');
      if(navMobile){navMobile.classList.remove('open');if(navToggle)navToggle.setAttribute('aria-expanded','false');}
    }
  });
})();
</script>
'@

# ─── PROCESS FILES ─────────────────────────────────────────────────────────────
$articles = Get-ChildItem "$blogDir\*\index.html"
$fixed = 0
$skipped = 0

foreach ($file in $articles) {
    $content = [System.IO.File]::ReadAllText($file.FullName, $enc)

    # Skip if already has JS nav
    if ($content -match 'navDropdown') {
        $skipped++
        continue
    }

    # 1. Replace <nav>...</nav>
    $content = [regex]::Replace($content, '(?s)<nav>.*?</nav>', $newNav.Trim())

    # 2. Replace mobile nav div (id="navMobile") — matches any attribute order
    $content = [regex]::Replace($content, '(?s)<div[^>]*id="navMobile"[^>]*>.*?</div>', $newNavMobile.Trim())

    # Also replace old <!-- Mobilní menu --> comment if present (cosmetic cleanup)
    $content = $content -replace '<!--\s*Mobilní menu\s*-->\s*', ''

    # 3. Inject dropdown CSS before </head> (only if not already there)
    if ($content -notmatch 'nav-dropdown-panel') {
        $content = $content -replace '</head>', "$navDropdownCss</head>"
    }

    # 4. Inject nav JS before </body> (only if not already there)
    if ($content -notmatch 'NAV JS') {
        $content = $content -replace '</body>', "$navJs</body>"
    }

    [System.IO.File]::WriteAllText($file.FullName, $content, $enc)
    $fixed++
    Write-Host "FIXED: $($file.Directory.Name)"
}

Write-Host "`nHotovo: $fixed opraveno, $skipped preskoceno (uz maji JS nav)"
