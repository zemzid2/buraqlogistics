/* ============================================================
   form.js — Contact form validation and submission logic
   Handles: field validation, error messages, and success state
   Only active on the contact.html page
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Get the form element (only runs on contact.html) ── */
  const form = document.querySelector('.inquiry-form');
  if (!form) return; // Exit if no form found on this page


  /* ──────────────────────────────────────────────────
     1. VALIDATION HELPERS
     Functions to check individual field rules
  ────────────────────────────────────────────────── */

  /* Check that a text field is not empty */
  function isNotEmpty(value) {
    return value.trim().length > 0;
  }

  /* Basic email format check */
  function isValidEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
  }

  /* Phone: at least 7 digits, allows spaces, dashes, parentheses */
  function isValidPhone(value) {
    const digits = value.replace(/\D/g, '');
    return digits.length >= 7;
  }


  /* ──────────────────────────────────────────────────
     2. SHOW / HIDE ERROR ON A FIELD
     Adds or removes the 'error' class on a .form-group
     and sets the error message text
  ────────────────────────────────────────────────── */

  function showError(field, message) {
    const group = field.closest('.form-group');
    group.classList.add('error');
    const errorEl = group.querySelector('.form-error');
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(field) {
    const group = field.closest('.form-group');
    group.classList.remove('error');
  }


  /* ──────────────────────────────────────────────────
     3. REAL-TIME INLINE VALIDATION
     Clears the error when the user starts fixing a field
  ────────────────────────────────────────────────── */
  const allInputs = form.querySelectorAll('input, select, textarea');

  allInputs.forEach(function (input) {
    // On focus: clear error so the field feels fresh
    input.addEventListener('focus', function () {
      clearError(this);
    });

    // On blur (leaving the field): validate immediately
    input.addEventListener('blur', function () {
      validateField(this);
    });
  });


  /* ──────────────────────────────────────────────────
     4. SINGLE FIELD VALIDATION FUNCTION
     Validates one field and shows/hides its error
  ────────────────────────────────────────────────── */
  function validateField(field) {
    const name  = field.name;
    const value = field.value;
    let valid = true;

    if (name === 'full_name') {
      if (!isNotEmpty(value)) {
        showError(field, 'Please enter your full name.');
        valid = false;
      }
    }

    if (name === 'company') {
      if (!isNotEmpty(value)) {
        showError(field, 'Please enter your company name.');
        valid = false;
      }
    }

    if (name === 'email') {
      if (!isValidEmail(value)) {
        showError(field, 'Please enter a valid email address.');
        valid = false;
      }
    }

    if (name === 'phone') {
      if (!isNotEmpty(value)) {
        showError(field, 'Please enter a phone number.');
        valid = false;
      } else if (!isValidPhone(value)) {
        showError(field, 'Please enter a valid phone number.');
        valid = false;
      }
    }

    if (name === 'service_type') {
      if (!isNotEmpty(value)) {
        showError(field, 'Please select a service type.');
        valid = false;
      }
    }

    if (name === 'cargo_type') {
      if (!isNotEmpty(value)) {
        showError(field, 'Please describe your cargo.');
        valid = false;
      }
    }

    return valid;
  }


  /* ──────────────────────────────────────────────────
     5. FULL FORM VALIDATION
     Validates all required fields at once, returns
     true only if everything passes
  ────────────────────────────────────────────────── */
  function validateForm() {
    // Select only fields that are marked required
    const requiredFields = form.querySelectorAll('[required]');
    let allValid = true;

    requiredFields.forEach(function (field) {
      const fieldValid = validateField(field);
      if (!fieldValid) {
        allValid = false;
      }
    });

    return allValid;
  }


  /* ──────────────────────────────────────────────────
     6. FORM SUBMIT HANDLER
     Validates the form, then shows a success message.
     In production, replace the success block with an
     actual fetch() call to your backend or form service.
  ────────────────────────────────────────────────── */
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent actual page reload

    // Run full validation
    const isValid = validateForm();
    if (!isValid) {
      // Scroll to the first error field
      const firstError = form.querySelector('.form-group.error input, .form-group.error select, .form-group.error textarea');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    /* ── SUCCESS STATE ──
       Hide the form and show the success message.
       Replace this block with your actual form submission
       logic (e.g., fetch to a backend endpoint or service
       like Formspree / EmailJS).
    ── */
    const formWrap   = document.querySelector('.contact-form-wrap');
    const successMsg = document.querySelector('.form-success');

    if (formWrap && successMsg) {
      form.style.display         = 'none';
      formWrap.querySelector('h2').style.display = 'none';
      formWrap.querySelector('p').style.display  = 'none';
      successMsg.classList.add('visible');
    }
  });


  /* ──────────────────────────────────────────────────
     7. FAQ ACCORDION (on how-it-works.html)
     Clicking a question expands/collapses its answer.
     Also runs here since it's a simple toggle behaviour.
  ────────────────────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-item__question');
    if (!question) return;

    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Close all other open items first (accordion behaviour)
      faqItems.forEach(function (other) {
        other.classList.remove('open');
      });

      // Toggle the clicked item
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

});
