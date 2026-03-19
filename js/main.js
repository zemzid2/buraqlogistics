/* ============================================================
   main.js — Shared JavaScript for ALL pages
   Handles: mobile navbar toggle, active nav link, smooth scroll,
   footer year, services sticky nav highlighting
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ──────────────────────────────────────────────────
     1. MOBILE NAVBAR TOGGLE
  ────────────────────────────────────────────────── */
  const hamburger  = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.querySelector('.navbar__mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);

      // Animate bars into an X
      const bars = hamburger.querySelectorAll('span');
      if (isOpen) {
        bars[0].style.transform = 'translateY(9px) rotate(45deg)';
        bars[1].style.opacity   = '0';
        bars[2].style.transform = 'translateY(-9px) rotate(-45deg)';
      } else {
        bars[0].style.transform = '';
        bars[1].style.opacity   = '';
        bars[2].style.transform = '';
      }
    });

    // Close menu on outside click
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
  ────────────────────────────────────────────────── */
  const navLinks  = document.querySelectorAll('.navbar__links a, .navbar__mobile-menu a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(function (link) {
    const href = link.getAttribute('href') || '';
    const linkPage = href.split('/').pop().split('#')[0];
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });


  /* ──────────────────────────────────────────────────
     3. SMOOTH SCROLL FOR ANCHOR LINKS
     Accounts for the sticky navbar height
  ────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const navEl     = document.querySelector('.navbar');
      const svcNavEl  = document.querySelector('.svc-nav');
      const offset    = (navEl ? navEl.offsetHeight : 0)
                      + (svcNavEl ? svcNavEl.offsetHeight : 0)
                      + 16;

      window.scrollTo({
        top: targetEl.getBoundingClientRect().top + window.pageYOffset - offset,
        behavior: 'smooth'
      });

      // Close mobile menu after click
      if (mobileMenu) mobileMenu.classList.remove('open');
    });
  });


  /* ──────────────────────────────────────────────────
     4. AUTO COPYRIGHT YEAR
  ────────────────────────────────────────────────── */
  const yearEl = document.querySelector('.footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ──────────────────────────────────────────────────
     5. SERVICES STICKY NAV — highlight active tab on scroll
     Only runs on services.html
  ────────────────────────────────────────────────── */
  const svcNavTabs = document.querySelectorAll('.svc-nav__tab');

  if (svcNavTabs.length > 0) {
    const sections = document.querySelectorAll('.svc-detail');

    const observerOptions = {
      root: null,
      rootMargin: '-120px 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          svcNavTabs.forEach(function (tab) {
            tab.classList.remove('active');
            if (tab.getAttribute('href') === '#' + id) {
              tab.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

});
