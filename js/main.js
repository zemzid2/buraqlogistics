/* ============================================================
   main.js — Shared JavaScript for ALL pages
   Handles: mobile navbar toggle, active nav link highlighting,
   and smooth scroll for anchor links
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ──────────────────────────────────────────────────
     1. MOBILE NAVBAR TOGGLE
     Opens and closes the mobile nav menu when the
     hamburger button is clicked
  ────────────────────────────────────────────────── */
  const hamburger    = document.querySelector('.navbar__hamburger');
  const mobileMenu   = document.querySelector('.navbar__mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      // Toggle the 'open' class which shows/hides the menu
      const isOpen = mobileMenu.classList.toggle('open');

      // Update aria-expanded for accessibility
      hamburger.setAttribute('aria-expanded', isOpen);

      // Animate hamburger into an X when open
      const bars = hamburger.querySelectorAll('span');
      if (isOpen) {
        bars[0].style.transform = 'translateY(8px) rotate(45deg)';
        bars[1].style.opacity   = '0';
        bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
      } else {
        bars[0].style.transform = '';
        bars[1].style.opacity   = '';
        bars[2].style.transform = '';
      }
    });

    // Close mobile menu if user clicks anywhere outside of it
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        const bars = hamburger.querySelectorAll('span');
        bars[0].style.transform = '';
        bars[1].style.opacity   = '';
        bars[2].style.transform = '';
      }
    });
  }


  /* ──────────────────────────────────────────────────
     2. ACTIVE NAV LINK HIGHLIGHTING
     Compares the current page URL to each nav link's
     href and adds the 'active' class to the matching link
  ────────────────────────────────────────────────── */
  const navLinks = document.querySelectorAll('.navbar__links a, .navbar__mobile-menu a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(function (link) {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });


  /* ──────────────────────────────────────────────────
     3. SMOOTH SCROLL FOR IN-PAGE ANCHOR LINKS
     When a link points to an #id on the same page,
     scroll smoothly to it and account for the sticky nav
  ────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return; // Skip empty anchors

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      // Get the navbar height so we don't scroll under it
      const navHeight = document.querySelector('.navbar')
        ? document.querySelector('.navbar').offsetHeight
        : 0;

      const targetTop = targetEl.getBoundingClientRect().top
        + window.pageYOffset
        - navHeight
        - 16; // 16px extra breathing room

      window.scrollTo({ top: targetTop, behavior: 'smooth' });

      // Close mobile menu if it's open after clicking a link
      if (mobileMenu) {
        mobileMenu.classList.remove('open');
      }
    });
  });


  /* ──────────────────────────────────────────────────
     4. CURRENT YEAR IN FOOTER
     Automatically updates the copyright year in the footer
  ────────────────────────────────────────────────── */
  const yearEl = document.querySelector('.footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
