/* Offroad Kielce — progressive enhancement only.
   Everything on the page is readable and usable with JavaScript disabled. */

(function () {
  'use strict';

  var CONTACT_EMAIL = 'offroadkielce@gmail.com';

  /* --- Footer year ------------------------------------------------------- */

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* --- Mobile navigation ------------------------------------------------- */

  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  var topbar = document.querySelector('.topbar');

  function closeNav() {
    if (!burger || !nav) return;
    burger.setAttribute('aria-expanded', 'false');
    nav.removeAttribute('data-open');
    if (topbar) topbar.removeAttribute('data-open');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      if (open) {
        nav.removeAttribute('data-open');
        if (topbar) topbar.removeAttribute('data-open');
      } else {
        nav.setAttribute('data-open', 'true');
        if (topbar) topbar.setAttribute('data-open', 'true');
      }
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeNav();
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeNav();
  });

  /* --- Solid top bar once the hero has scrolled away --------------------- */

  if (topbar) {
    var onScroll = function () {
      topbar.setAttribute('data-stuck', String(window.scrollY > 60));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- Gallery lightbox -------------------------------------------------- */

  var lightbox = document.getElementById('lightbox');
  var lightboxImage = document.getElementById('lightbox-image');
  var lightboxClose = document.getElementById('lightbox-close');
  var mosaic = document.getElementById('mosaic');

  if (lightbox && lightboxImage && mosaic && typeof lightbox.showModal === 'function') {
    mosaic.addEventListener('click', function (event) {
      var tile = event.target.closest('.tile');
      if (!tile) return;
      var image = tile.querySelector('img');
      lightboxImage.src = tile.getAttribute('data-src') || (image && image.src) || '';
      lightboxImage.alt = (image && image.alt) || '';
      lightbox.showModal();
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', function () { lightbox.close(); });
    }

    // Clicking the backdrop closes it; clicking the picture does not.
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) lightbox.close();
    });

    lightbox.addEventListener('close', function () {
      lightboxImage.src = '';
    });
  }

  /* --- Hero clip ---------------------------------------------------------
     A silent five-second loop behind the headline. It is a decoration, so it
     only loads where it costs nothing worth having: wide screens, motion
     allowed, and a connection that hasn't asked us to go easy. Everywhere
     else the poster photograph stays, which is no loss.                   */

  var heroVideo = document.getElementById('hero-video');

  function shouldLoadHeroVideo() {
    if (!heroVideo) return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    if (window.matchMedia('(max-width: 720px)').matches) return false;

    var connection = navigator.connection ||
      navigator.mozConnection || navigator.webkitConnection;

    if (connection) {
      if (connection.saveData) return false;
      if (/(^|-)(2g|slow-2g)$/.test(connection.effectiveType || '')) return false;
    }
    return true;
  }

  if (heroVideo && shouldLoadHeroVideo()) {
    var clip = heroVideo.getAttribute('data-src');
    if (clip) {
      // Only reveal it once there are frames to show, so the photo never
      // flashes to black while the file is still arriving.
      heroVideo.addEventListener('canplay', function () {
        heroVideo.setAttribute('data-ready', 'true');
      }, { once: true });

      heroVideo.preload = 'auto';
      heroVideo.src = clip;

      var attempt = heroVideo.play();
      if (attempt && typeof attempt.catch === 'function') {
        // Autoplay refused (some power-saving modes): leave the poster up.
        attempt.catch(function () {
          heroVideo.removeAttribute('data-ready');
        });
      }
    }
  }

  /* --- Enquiry form ------------------------------------------------------
     With a data-endpoint set, the form POSTs there (Formspree and similar).
     Without one, it falls back to composing a mail in the visitor's client,
     so the form is never a dead end on a plain static host.             */

  var form = document.getElementById('form');
  var status = document.getElementById('form-status');

  function setStatus(message, state) {
    if (!status) return;
    status.textContent = message;
    if (state) {
      status.setAttribute('data-state', state);
    } else {
      status.removeAttribute('data-state');
    }
  }

  function validate(fields) {
    var missing = [];
    if (!fields.name) missing.push('imię');
    if (!fields.phone) missing.push('telefon');
    return missing;
  }

  function readFields() {
    var data = new FormData(form);
    var fields = {};
    data.forEach(function (value, key) {
      fields[key] = String(value).trim();
    });
    return fields;
  }

  function buildMessage(fields) {
    var labels = {
      name: 'Imię i nazwisko',
      phone: 'Telefon',
      email: 'E-mail',
      type: 'Rodzaj wydarzenia',
      people: 'Liczba osób',
      date: 'Planowany termin',
      message: 'Wiadomość'
    };

    return Object.keys(labels)
      .filter(function (key) { return fields[key]; })
      .map(function (key) { return labels[key] + ': ' + fields[key]; })
      .join('\n');
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var fields = readFields();
      var missing = validate(fields);

      if (missing.length) {
        setStatus('Uzupełnij: ' + missing.join(' i ') + '.', 'error');
        var firstMissing = form.querySelector('[name="' + (fields.name ? 'phone' : 'name') + '"]');
        if (firstMissing) firstMissing.focus();
        return;
      }

      var endpoint = form.getAttribute('data-endpoint');

      if (!endpoint) {
        var subject = 'Zapytanie ze strony — ' + (fields.type || 'Offroad Kielce');
        window.location.href = 'mailto:' + CONTACT_EMAIL +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(buildMessage(fields));
        setStatus('Otwieramy Twój program pocztowy. Jeśli się nie otworzył, napisz na ' + CONTACT_EMAIL + '.');
        return;
      }

      var button = form.querySelector('button[type="submit"]');
      if (button) button.disabled = true;
      setStatus('Wysyłamy…');

      fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Request failed: ' + response.status);
          form.reset();
          setStatus('Dziękujemy. Odezwiemy się najszybciej, jak to możliwe.', 'ok');
        })
        .catch(function () {
          setStatus('Nie udało się wysłać. Zadzwoń na 696 477 646 lub napisz na ' + CONTACT_EMAIL + '.', 'error');
        })
        .then(function () {
          if (button) button.disabled = false;
        });
    });
  }
})();
