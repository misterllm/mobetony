/* ============================================
   MAIN.JS — Hlavní JavaScript
   Navigace (hamburger menu) a další interakce
   ============================================ */

// Počkáme, až se načte celý HTML dokument
document.addEventListener('DOMContentLoaded', function () {

  // --- Hamburger menu (mobilní navigace) ---
  // Najdeme tlačítko hamburgeru a menu
  const hamburger = document.getElementById('navHamburger');
  const navMenu = document.getElementById('navMenu');

  // Po kliknutí na hamburger přepneme třídu "is-open" na menu
  // Třída "is-open" v CSS změní display z "none" na "flex"
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      navMenu.classList.toggle('is-open');
      // Přepneme i aria atribut pro přístupnost
      const isOpen = navMenu.classList.contains('is-open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Zavřeme menu po kliknutí na odkaz (aby se menu nezůstalo otevřené)
    navMenu.querySelectorAll('.navbar__link').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

});
