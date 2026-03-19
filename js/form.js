/* ============================================================
   form.js — Contact form validation and Web3Forms submission
   Also handles the FAQ accordion on how-it-works.html
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ──────────────────────────────────────────────────
     CONTACT FORM (contact.html only)
  ────────────────────────────────────────────────── */
  const form = document.querySelector('.contact-form');

  if (form) {

    /* ── Validation helpers ── */
    function isNotEmpty(v) { return v.trim().length > 0; }
    function isEmail(v)    { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }
    function isPhone(v)    { return v.replace(/\D/g, '').length >= 7; }

    /* ── Show / clear error on a .field wrapper ── */
    function showError(input) {
      const group = input.closest('.field');
      if (group) group.classList.add('error');
    }

    function clearError(input) {
      const group = input.closest('.field');
      if (group) group.classList.remove('error');
    }

    /* ── Validate a single field ── */
    function validateField(input) {
      const name  = input.name;
      const value = input.value;
      let valid   = true;

      if (name === 'full_name'    && !isNotEmpty(value)) valid = false;
      if (name === 'company'      && !isNotEmpty(value)) valid = false;
      if (name === 'email'        && !isEmail(value))    valid = false;
      if (name === 'phone'        && (!isNotEmpty(value) || !isPhone(value))) valid = false;
      if (name === 'service_type' && !isNotEmpty(value)) valid = false;
      if (name === 'cargo_type'   && !isNotEmpty(value)) valid = false;

      if (!valid) {
        showError(input);
      } else {
        clearError(input);
      }

      return valid;
    }

    /* ── Real-time: clear error on focus; validate on blur ── */
    form.querySelectorAll('input, select, textarea').forEach(function (input) {
      input.addEventListener('focus', function () { clearError(this); });
      input.addEventListener('blur',  function () { validateField(this); });
    });

    /* ── Full form validation ── */
    function validateAll() {
      const required = form.querySelectorAll('[required]');
      let allValid = true;
      required.forEach(function (input) {
        if (!validateField(input)) allValid = false;
      });
      return allValid;
    }

    /* ── Submit handler — Web3Forms ── */
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      if (!validateAll()) {
        // Scroll to first error
        const firstErr = form.querySelector('.field.error input, .field.error select, .field.error textarea');
        if (firstErr) {
          firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstErr.focus();
        }
        return;
      }

      // Show sending state
      const submitBtn = form.querySelector('.form-submit-btn');
      const origText  = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.innerHTML  = 'Sending…';
        submitBtn.disabled   = true;
      }

      try {
        const formData = new FormData(form);
        const data     = Object.fromEntries(formData.entries());

        const response = await fetch('https://api.web3forms.com/submit', {
          method:  'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept':        'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
          // Hide form, show success message
          form.style.display = 'none';
          const card = document.querySelector('.form-card');
          if (card) {
            const h2 = card.querySelector('h2');
            const p  = card.querySelector('p');
            if (h2) h2.style.display = 'none';
            if (p)  p.style.display  = 'none';
          }
          const successEl = document.getElementById('formSuccess');
          if (successEl) successEl.classList.add('visible');
        } else {
          throw new Error(result.message || 'Submission failed.');
        }

      } catch (err) {
        if (submitBtn) {
          submitBtn.innerHTML = origText;
          submitBtn.disabled  = false;
        }
        alert('Something went wrong. Please try again or contact us directly by phone or email.');
        console.error('Web3Forms error:', err);
      }
    });
  }


  /* ──────────────────────────────────────────────────
     FAQ ACCORDION
     Works on how-it-works.html
     Question button class: .faq-item__q
     Toggle button class: .faq-toggle
  ────────────────────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-item__q');
    if (!question) return;

    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Close all (accordion behaviour)
      faqItems.forEach(function (other) {
        other.classList.remove('open');
      });

      // Toggle clicked one
      if (!isOpen) item.classList.add('open');
    });
  });

});
