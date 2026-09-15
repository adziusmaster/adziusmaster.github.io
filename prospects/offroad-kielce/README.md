# Offroad Kielce — static site

A drop-in replacement for the site at `offroadkielce.pl`. No build step, no
framework, no package manager. Upload the folder and it works.

## Where this currently lives

Hosted as a pitch build at
**<https://lechdigital.nl/prospects/offroad-kielce/>**, served from
`prospects/offroad-kielce/` in the `lechdigital.nl` repo. See
[`../README.md`](../README.md) for the conventions applying to everything under
`prospects/`.

Every page carries `noindex, nofollow`, and `/prospects/` is disallowed in the
site-wide `robots.txt`, so this demo never competes with the client's own site
for their brand terms. Absolute URLs (canonical, `og:url`, `og:image`) point at
the `lechdigital.nl` path so link previews render when the URL is shared.

## Handing it over

The folder is self-contained — all internal links are relative, so it runs from
a domain root unchanged. Three things to undo, two of them mechanical:

```sh
# 1. Point absolute URLs back at the client's domain
grep -rl 'lechdigital.nl/prospects/offroad-kielce/' *.html \
  | xargs sed -i '' 's|https://lechdigital.nl/prospects/offroad-kielce/|https://www.offroadkielce.pl/|g'

# 2. Let search engines in — but NOT flota.html and faq.html,
#    which stay noindex until their placeholders are filled
sed -i '' '/^<meta name="robots" content="noindex, nofollow">$/d' \
  index.html vouchery.html imprezy-i-integracje.html eventy-firmowe.html
```

3. Remove the `Strona: Lech Digital` line from each footer if the client would
   rather not carry the credit.

Then upload everything except `README.md` and `QUESTIONS.md`.

## Deploying

Copy everything except `QUESTIONS.md`, `README.md` and `.superpowers/` to the
web root:

```
index.html
vouchery.html
imprezy-i-integracje.html
eventy-firmowe.html
polityka-prywatnosci.html
assets/
```

`flota.html` and `faq.html` are **unfinished** — see below. They are linked from
the nav, so holding them back means pulling those two links out of all seven
pages as well.

The old site served the privacy policy from `/polityka-prywatnosci/`. Keep that
URL alive with a redirect to `/polityka-prywatnosci.html`, or the existing link
will 404 for anyone who bookmarked it.

## Before it goes live

Blocking:

- **`polityka-prywatnosci.html`** contains three placeholders — `[NAZWA FIRMY]`,
  `[ADRES]`, `[NIP]` — rendered as yellow highlights so they are impossible to
  miss. The page is not legally complete until they are filled in.
- **The claim "cena za auto, nie za osobę"** (the yellow band under the hero, and
  repeated on every subpage) is an *inference* from the original site's
  "Cennik za **auto** terenowe" plus "Auto mogą również prowadzić osoby
  towarzyszące". It is the strongest selling point on the page, but the owner
  must confirm it. If it is wrong, remove `.factband` from `index.html` and the
  `railcard__note` lines from the subpages.

Worth doing:

- Fill in the `LocalBusiness` JSON-LD block in `index.html` (address, hours).
- See `QUESTIONS.md` — the question list written for the owner, in Polish.

## The two unfinished pages

`flota.html` and `faq.html` are in the nav and reachable like any other page,
but their content is not done. Each one:

- carries `<meta name="robots" content="noindex, nofollow">` — as every page in
  this folder does, so this is not a mark of the page being unfinished
- marks every unknown with a yellow `<mark class="todo">[PLACEHOLDER]</mark>`

`flota.html` is the emptier of the two: it is a layout around vehicle details
that don't exist yet — no marque, model, year or engine has been supplied.

`faq.html` is a mix: answers without a yellow highlight come from the original
site and are safe to publish as-is. The highlighted ones are guesses waiting to
be replaced.

**To finish either page:** fill the placeholders. Nothing else is needed — the
nav links are in place and the `.draft` banner is gone. The banner's CSS is
still in `styles.css`, unused, for the next page that starts as scaffolding.

For `faq.html`, add `FAQPage` JSON-LD at that point, but only covering questions
whose answers are real. Structured data that doesn't match the visible page is
worse than none.

## Later

The business uses a Gmail address while owning `offroadkielce.pl`. A domain
mailbox (`kontakt@offroadkielce.pl`) forwarding into the existing Gmail would
cost nothing in day-to-day workflow and reads far better on a quote sent to a
company booking a team event. Raised as section 8 of `QUESTIONS.md`. If it
happens, update the address in: `index.html` (contact block, footer, JSON-LD),
all three offer subpages, `faq.html`, `flota.html`, `polityka-prywatnosci.html`,
and `CONTACT_EMAIL` in `assets/js/site.js`.

## Content rule

Everything visible on the site traces back to the original `offroadkielce.pl`.
Wording was rewritten; **no fact, number, or claim was invented**. Where a
section would benefit from information that does not exist yet, there is a
`TODO` comment in the HTML pointing at the relevant section of `QUESTIONS.md`
rather than placeholder prose.

## The enquiry form

`index.html` has `<form id="form" data-endpoint="">`.

- **Empty `data-endpoint` (current):** the form composes the message and opens
  the visitor's mail client via `mailto:`. Works on any host with zero setup,
  but loses people who have no mail client configured.
- **With an endpoint:** the form POSTs `FormData` and expects a JSON-ish 2xx.
  Sign up at Formspree (free tier is enough for this volume), then set:

  ```html
  <form class="form" id="form" data-endpoint="https://formspree.io/f/XXXXXXX" novalidate>
  ```

  No other change is needed — `assets/js/site.js` already handles success,
  failure, and the disabled-button state.

## The hero clip

`assets/video/header.mp4` is 8.8 MB for about five seconds, so it is treated as
decoration, not content. `assets/js/site.js` loads it **only** when all of these
hold:

- viewport wider than 720px
- `prefers-reduced-motion` is not `reduce`
- `navigator.connection.saveData` is off
- `effectiveType` is not `2g` / `slow-2g`

Otherwise `assets/images/offroad.jpg` stays as the poster, which is no loss.
If the file is ever re-encoded smaller (a 5-second 1080p loop should be well
under 2 MB), these guards can be relaxed.

## Known weak spots

- **Gallery images are 600×450.** They are soft on a large display. The only
  full-resolution photograph is `offroad.jpg` (1600×1066), which is why it holds
  the hero and the large gallery tile. Originals would make a visible difference.
- **No photograph exists for Agroturystyka**, so that card is text-only and
  links out to `zalawie.pl`.
- **The logo artwork has black lettering**, so it cannot sit directly on the dark
  bar. It is placed on a sand-coloured plate (`.brand`). A version with light
  lettering would let that plate go away.

## Structure

```
assets/css/styles.css   one stylesheet, tokens at the top
assets/js/site.js       progressive enhancement only — the page works without it
assets/images/          photographs pulled from the original site
assets/video/header.mp4 the hero clip
```

Identifiers, tokens, and comments are in English; everything the visitor reads
is in Polish.

## Design notes

Dark throughout — the page is meant to read as one continuous night, so section
backgrounds are transparent and the fixed contour/dust layers on `body::before`
and `body::after` run behind everything. Opaque section backgrounds would break
that, which is why there are none.

- `--amber: #F9B321` is taken from the existing logo and is the only signal colour.
- Shadows are light, never darkness: elements bloom amber instead of casting black.
- One thing animates on a loop — `.hero__beam`, the headlight bloom. Everything
  else moves only in response to a pointer.
- Type: Saira (display) and Space Grotesk (body), both with `latin-ext` for
  Polish diacritics.
