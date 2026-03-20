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


  /* ──────────────────────────────────────────────────
     6. SCROLL REVEAL — IntersectionObserver
     Adds .revealed class when elements enter viewport.
     Elements start invisible via CSS, animate in on scroll.
  ────────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-stagger > *'
  );

  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target); // animate once only
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(function (el, i) {
      // Staggered delay for sibling elements
      if (el.closest('.reveal-stagger')) {
        el.style.transitionDelay = (i % 6) * 0.1 + 's';
      }
      revealObserver.observe(el);
    });
  }


  /* ──────────────────────────────────────────────────
     7. STATS COUNT-UP ANIMATION
     Targets elements with data-count attribute.
     Counts from 0 to the target number on scroll.
  ────────────────────────────────────────────────── */
  const countEls = document.querySelectorAll('[data-count]');

  if (countEls.length > 0) {
    const countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el      = entry.target;
        const target  = parseInt(el.getAttribute('data-count'), 10);
        const suffix  = el.getAttribute('data-suffix') || '';
        const dur     = 1800; // ms
        const step    = 16;   // ~60fps
        const inc     = target / (dur / step);
        let current   = 0;

        const timer = setInterval(function () {
          current += inc;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current) + suffix;
        }, step);

        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    countEls.forEach(function (el) { countObserver.observe(el); });
  }


  /* ──────────────────────────────────────────────────
     8. NAVBAR SCROLL SHADOW
     Adds stronger shadow when page is scrolled down.
  ────────────────────────────────────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }



  /* ──────────────────────────────────────────────────
     9. SCROLL TRAIN PROGRESS
     Moves the locomotive SVG left→right based on
     how far the user has scrolled down the page.
  ────────────────────────────────────────────────── */
  const loco       = document.getElementById('scrollLoco');
  const trackFill  = document.getElementById('scrollFill');
  const trackLabel = document.getElementById('scrollLabel');
  const track      = document.querySelector('.scroll-track');

  if (loco && track) {
    function updateTrain() {
      const scrollTop  = window.scrollY || window.pageYOffset;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const progress   = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      const trackW     = track.offsetWidth;
      const locoW      = loco.offsetWidth;
      const maxLeft    = trackW - locoW - 56; /* 56px padding from right edge */
      const leftPx     = Math.max(0, progress * maxLeft);

      loco.style.left = leftPx + 'px';

      if (trackFill)  trackFill.style.width  = (progress * 100) + '%';
      if (trackLabel) trackLabel.textContent  = Math.round(progress * 100) + '%';
    }

    window.addEventListener('scroll', updateTrain, { passive: true });
    window.addEventListener('resize', updateTrain, { passive: true });
    updateTrain(); // run once on load
  }



  /* ──────────────────────────────────────────────────
     10. WHATSAPP POPUP — shows after 20 seconds
     Uses sessionStorage so it only fires once per session.
     User can dismiss it — won't show again until new session.
  ────────────────────────────────────────────────── */
  (function () {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem('waDismissed')) return;

    const overlay = document.getElementById('waPopupOverlay');
    if (!overlay) return;

    function showPopup() {
      overlay.classList.add('visible');
    }

    function hidePopup() {
      overlay.classList.remove('visible');
      sessionStorage.setItem('waDismissed', '1');
    }

    // Show after 20 seconds
    setTimeout(showPopup, 20000);

    // Close button (X)
    const closeBtn = document.getElementById('waPopupClose');
    if (closeBtn) closeBtn.addEventListener('click', hidePopup);

    // "Maybe later" link
    const dismissBtn = document.getElementById('waPopupDismiss');
    if (dismissBtn) dismissBtn.addEventListener('click', hidePopup);

    // Click outside the card to close
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) hidePopup();
    });

    // Also hide when they click the chat button (they're going to WhatsApp)
    const chatBtn = document.getElementById('waPopupChat');
    if (chatBtn) chatBtn.addEventListener('click', hidePopup);
  })();

