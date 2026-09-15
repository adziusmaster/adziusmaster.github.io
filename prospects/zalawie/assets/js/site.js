/* Agroturystyka Załawie — progressive enhancement only.
   Everything on the page is readable and usable with JavaScript disabled.

   This file deliberately repeats work from the Offroad Kielce build rather
   than sharing it. A prospect folder has to lift out and drop onto the
   client's own hosting with nothing left behind, so the duplication is the
   point. See ../README.md. */

(function () {
  'use strict';

  var CONTACT_EMAIL = 'agroturystyka.zalawie@gmail.com';

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
  // The gallery page groups its photographs under three headings, so there is
  // more than one grid to listen to.
  var mosaics = document.querySelectorAll('.mosaic');

  if (lightbox && lightboxImage && mosaics.length && typeof lightbox.showModal === 'function') {
    Array.prototype.forEach.call(mosaics, function (mosaic) {
      mosaic.addEventListener('click', function (event) {
        var tile = event.target.closest('.tile');
        if (!tile) return;
        var image = tile.querySelector('img');
        lightboxImage.src = tile.getAttribute('data-src') || (image && image.src) || '';
        lightboxImage.alt = (image && image.alt) || '';
        lightbox.showModal();
      });
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

  var consent = document.getElementById('consent');

  // Nothing stores the tick. It rides along in the message so the owner can
  // show the visitor was told what the data is for, and that is the whole of
  // its job.
  function consentGiven() {
    if (!consent) return true;
    if (consent.checked) {
      consent.removeAttribute('aria-invalid');
      return true;
    }
    consent.setAttribute('aria-invalid', 'true');
    return false;
  }

  if (consent) {
    consent.addEventListener('change', function () {
      if (consent.checked) consent.removeAttribute('aria-invalid');
    });
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
      object: 'Obiekt',
      arrival: 'Przyjazd',
      departure: 'Wyjazd',
      people: 'Liczba osób',
      message: 'Wiadomość',
      consent: 'Polityka prywatności'
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

      if (!consentGiven()) {
        setStatus('Zaznacz potwierdzenie, żebyśmy mogli oddzwonić.', 'error');
        consent.focus();
        return;
      }

      var endpoint = form.getAttribute('data-endpoint');

      if (!endpoint) {
        var subject = 'Zapytanie ze strony — ' + (fields.object || 'Załawie');
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

  /* --- Form controls the browser draws for itself ------------------------
     The dropdown list and the calendar are chrome, not page: no stylesheet
     reaches either, so they arrive grey and square in the middle of a warm
     linen form. The native controls stay in the markup — they hold the value
     and they are what submits — and these draw a matching control over the
     top. With JS off, the natives are what the visitor gets, untouched and
     perfectly usable.                                                    */

  var openPopup = null;

  function closePopup() {
    if (openPopup) openPopup();
    openPopup = null;
  }

  document.addEventListener('click', function (event) {
    if (openPopup && !event.target.closest('.combo, .picker')) closePopup();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closePopup();
  });

  /* --- Dropdown ---------------------------------------------------------- */

  function enhanceSelect(select) {
    var combo = document.createElement('div');
    combo.className = 'combo';
    combo.setAttribute('data-open', 'false');
    select.parentNode.insertBefore(combo, select);
    combo.appendChild(select);
    select.className = 'combo__native';
    select.setAttribute('tabindex', '-1');
    select.setAttribute('aria-hidden', 'true');

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'combo__button';
    button.id = select.id + '-button';
    button.setAttribute('aria-haspopup', 'listbox');
    button.setAttribute('aria-expanded', 'false');

    var list = document.createElement('ul');
    list.className = 'pop combo__list';
    list.id = select.id + '-list';
    list.setAttribute('role', 'listbox');
    list.setAttribute('tabindex', '-1');
    list.hidden = true;
    button.setAttribute('aria-controls', list.id);

    var label = document.querySelector('label[for="' + select.id + '"]');
    if (label) {
      label.setAttribute('for', button.id);
      list.setAttribute('aria-label', label.textContent.trim());
    }

    var options = [];
    Array.prototype.forEach.call(select.options, function (option, index) {
      var item = document.createElement('li');
      item.className = 'combo__option';
      item.id = select.id + '-option-' + index;
      item.setAttribute('role', 'option');
      item.textContent = option.textContent;
      list.appendChild(item);
      options.push(item);
    });

    combo.appendChild(button);
    combo.appendChild(list);

    var active = select.selectedIndex < 0 ? 0 : select.selectedIndex;

    function paint() {
      button.textContent = select.options[select.selectedIndex].textContent;
      options.forEach(function (item, index) {
        item.setAttribute('aria-selected', String(index === select.selectedIndex));
        if (index === active) {
          item.setAttribute('data-active', 'true');
          list.setAttribute('aria-activedescendant', item.id);
        } else {
          item.removeAttribute('data-active');
        }
      });
    }

    function close(focusButton) {
      list.hidden = true;
      combo.setAttribute('data-open', 'false');
      button.setAttribute('aria-expanded', 'false');
      if (focusButton) button.focus();
    }

    function open() {
      closePopup();
      list.hidden = false;
      combo.setAttribute('data-open', 'true');
      button.setAttribute('aria-expanded', 'true');
      active = select.selectedIndex;
      paint();
      list.focus();
      openPopup = function () { close(false); };
    }

    function choose(index) {
      select.selectedIndex = index;
      active = index;
      paint();
      close(true);
    }

    function move(delta) {
      active = Math.min(options.length - 1, Math.max(0, active + delta));
      paint();
    }

    button.addEventListener('click', function () {
      if (list.hidden) { open(); } else { close(true); }
    });

    button.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });

    list.addEventListener('click', function (event) {
      var item = event.target.closest('.combo__option');
      if (item) choose(options.indexOf(item));
    });

    list.addEventListener('mousemove', function (event) {
      var item = event.target.closest('.combo__option');
      if (item && options.indexOf(item) !== active) {
        active = options.indexOf(item);
        paint();
      }
    });

    var typed = '';
    var typedAt = 0;

    list.addEventListener('keydown', function (event) {
      switch (event.key) {
        case 'ArrowDown': event.preventDefault(); move(1); return;
        case 'ArrowUp':   event.preventDefault(); move(-1); return;
        case 'Home':      event.preventDefault(); active = 0; paint(); return;
        case 'End':       event.preventDefault(); active = options.length - 1; paint(); return;
        case 'Enter':
        case ' ':         event.preventDefault(); choose(active); return;
        case 'Escape':
        case 'Tab':       close(true); return;
      }

      if (event.key.length !== 1) return;

      // Type-ahead, the way a native list behaves: keys struck in quick
      // succession spell a prefix, a pause starts a new one.
      var now = Date.now();
      typed = (now - typedAt < 900 ? typed : '') + event.key.toLowerCase();
      typedAt = now;

      for (var i = 0; i < options.length; i++) {
        if (options[i].textContent.trim().toLowerCase().indexOf(typed) === 0) {
          active = i;
          paint();
          return;
        }
      }
    });

    paint();
  }

  /* --- Number stepper ----------------------------------------------------- */

  function enhanceNumber(input) {
    var stepper = document.createElement('div');
    stepper.className = 'stepper';
    input.parentNode.insertBefore(stepper, input);

    var floor = parseInt(input.getAttribute('min'), 10);
    if (isNaN(floor)) floor = 1;

    function button(sign, glyph, description) {
      var element = document.createElement('button');
      element.type = 'button';
      element.className = 'stepper__btn';
      element.textContent = glyph;
      element.setAttribute('aria-label', description);
      element.addEventListener('click', function () {
        var current = parseInt(input.value, 10);
        input.value = isNaN(current) ? floor : Math.max(floor, current + sign);
        sync();
        input.focus();
      });
      return element;
    }

    var down = button(-1, '−', 'Mniej osób');
    var up = button(1, '+', 'Więcej osób');

    stepper.appendChild(down);
    stepper.appendChild(input);
    stepper.appendChild(up);

    function sync() {
      var current = parseInt(input.value, 10);
      down.disabled = !isNaN(current) && current <= floor;
    }

    input.addEventListener('input', sync);
    sync();
  }

  /* --- Calendar ----------------------------------------------------------- */

  var MONTHS = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
  var DAYS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];

  function iso(date) {
    var month = String(date.getMonth() + 1);
    var day = String(date.getDate());
    return date.getFullYear() + '-' +
      (month.length < 2 ? '0' + month : month) + '-' +
      (day.length < 2 ? '0' + day : day);
  }

  function parseISO(value) {
    var parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
    if (!parts) return null;
    var date = new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
    return isNaN(date.getTime()) ? null : date;
  }

  function enhanceDate(input) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    // A departure cannot come before the arrival, so the field can be told to
    // take its floor from another one rather than from today.
    var afterField = input.getAttribute('data-after');

    function floor() {
      if (afterField) {
        var other = parseISO((document.getElementById(afterField) || {}).value);
        if (other && other > today) return other;
      }
      return today;
    }

    input.min = iso(floor());

    var picker = document.createElement('div');
    picker.className = 'picker';
    input.parentNode.insertBefore(picker, input);
    picker.appendChild(input);

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'picker__toggle';
    toggle.setAttribute('aria-haspopup', 'dialog');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Wybierz datę z kalendarza');
    toggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M7 2v2H5.5A2.5 2.5 0 0 0 3 6.5v13A2.5 2.5 0 0 0 5.5 22h13a2.5 2.5 0 0 0 ' +
      '2.5-2.5v-13A2.5 2.5 0 0 0 18.5 4H17V2h-2v2H9V2H7Zm12 8v9.5a.5.5 0 0 1-.5.5h-13a.5.5 ' +
      '0 0 1-.5-.5V10h14Z"/></svg>';

    var panel = document.createElement('div');
    panel.className = 'pop picker__panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Kalendarz');
    panel.hidden = true;

    picker.appendChild(toggle);
    picker.appendChild(panel);

    // The day the grid is built around: what is chosen, else the floor.
    var cursor = new Date(floor());

    function close(focusToggle) {
      panel.hidden = true;
      picker.setAttribute('data-open', 'false');
      toggle.setAttribute('aria-expanded', 'false');
      if (focusToggle) toggle.focus();
    }

    function render(focusDay) {
      panel.textContent = '';
      var earliest = floor();

      var head = document.createElement('div');
      head.className = 'cal__head';

      function nav(step, glyph, description) {
        var element = document.createElement('button');
        element.type = 'button';
        element.className = 'cal__nav';
        element.textContent = glyph;
        element.setAttribute('aria-label', description);
        element.addEventListener('click', function () {
          cursor = new Date(cursor.getFullYear(), cursor.getMonth() + step, 1);
          render(false);
        });
        return element;
      }

      var title = document.createElement('span');
      title.className = 'cal__title';
      title.setAttribute('aria-live', 'polite');
      title.textContent = MONTHS[cursor.getMonth()] + ' ' + cursor.getFullYear();

      head.appendChild(nav(-1, '‹', 'Poprzedni miesiąc'));
      head.appendChild(title);
      head.appendChild(nav(1, '›', 'Następny miesiąc'));
      panel.appendChild(head);

      var grid = document.createElement('div');
      grid.className = 'cal__grid';

      DAYS.forEach(function (day) {
        var cell = document.createElement('span');
        cell.className = 'cal__dow';
        cell.textContent = day;
        grid.appendChild(cell);
      });

      var first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
      // getDay() counts from Sunday; the week here starts on Monday.
      var lead = (first.getDay() + 6) % 7;
      var length = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
      var chosen = parseISO(input.value);
      var wanted = null;

      for (var blank = 0; blank < lead; blank++) {
        var filler = document.createElement('span');
        filler.className = 'cal__empty';
        grid.appendChild(filler);
      }

      for (var number = 1; number <= length; number++) {
        (function (day) {
          var date = new Date(cursor.getFullYear(), cursor.getMonth(), day);
          var cell = document.createElement('button');
          cell.type = 'button';
          cell.className = 'cal__day';
          cell.textContent = String(day);
          cell.disabled = date < earliest;
          if (iso(date) === iso(today)) cell.setAttribute('data-today', 'true');
          cell.setAttribute('aria-pressed', String(!!chosen && iso(date) === iso(chosen)));
          if (day === cursor.getDate()) wanted = cell;
          cell.addEventListener('click', function () {
            input.value = iso(date);
            input.dispatchEvent(new Event('change', { bubbles: true }));
            close(true);
          });
          grid.appendChild(cell);
        }(number));
      }

      grid.addEventListener('keydown', onGridKey);
      panel.appendChild(grid);

      if (focusDay && wanted && !wanted.disabled) wanted.focus();
    }

    function onGridKey(event) {
      var steps = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
      var months = { PageUp: -1, PageDown: 1 };
      var earliest = floor();

      if (steps[event.key]) {
        event.preventDefault();
        cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + steps[event.key]);
        if (cursor < earliest) cursor = new Date(earliest);
        render(true);
      } else if (months[event.key]) {
        event.preventDefault();
        cursor = new Date(cursor.getFullYear(), cursor.getMonth() + months[event.key], cursor.getDate());
        if (cursor < earliest) cursor = new Date(earliest);
        render(true);
      } else if (event.key === 'Escape') {
        close(true);
      }
    }

    toggle.addEventListener('click', function () {
      if (panel.hidden) {
        closePopup();
        input.min = iso(floor());
        cursor = parseISO(input.value) || new Date(floor());
        panel.hidden = false;
        picker.setAttribute('data-open', 'true');
        toggle.setAttribute('aria-expanded', 'true');
        render(true);
        openPopup = function () { close(false); };
      } else {
        close(true);
      }
    });

    // Moving the arrival past the departure would leave an impossible stay on
    // screen, so the later field gives way.
    if (afterField) {
      var earlier = document.getElementById(afterField);
      if (earlier) {
        earlier.addEventListener('change', function () {
          var limit = floor();
          input.min = iso(limit);
          var current = parseISO(input.value);
          if (current && current < limit) input.value = '';
        });
      }
    }
  }

  if (form) {
    var object = document.getElementById('object');
    var people = document.getElementById('people');

    if (object) enhanceSelect(object);
    if (people) enhanceNumber(people);
    Array.prototype.forEach.call(
      form.querySelectorAll('input[type="date"]'), enhanceDate);

    // Only now do the styles that assume these controls exist come into play.
    form.setAttribute('data-enhanced', 'true');
  }
})();
