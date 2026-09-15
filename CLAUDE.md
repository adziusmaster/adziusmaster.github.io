# lechdigital.nl

Personal site of Andrzej Lech, plus client pitch builds. Hand-written static
HTML/CSS. **No build step, no framework, no package manager, no npm.** Don't
introduce one.

## Deploying

GitHub Pages, from `main` of `adziusmaster/adziusmaster.github.io`, served at
`lechdigital.nl` via `CNAME`. **Pushing to `main` deploys.** A build takes
roughly 30 seconds. `.nojekyll` is present, so Jekyll never processes anything.

There is no staging. Verify locally first:

```sh
python3 -m http.server 8822   # then http://localhost:8822/
```

## Layout

```
index.html              the personal site
projects/<slug>/        write-ups of personal projects — listed in sitemap.xml
prospects/<slug>/       client pitch builds — NOT listed, NOT indexed
assets/css/site.css     styles for the personal site only
assets/fonts/           self-hosted woff2 (Barlow Condensed, Archivo, Space Mono)
```

`assets/` belongs to the personal site. **Prospects never use it** — see below.

## The personal site's design language

Tokens live at the top of `assets/css/site.css`. The rules that matter:

- Dark ground `#0F0A0D`, paper `#F2E8DC`, and a warm ramp — amber `#FFC46B`
  → orange `#FF7A2F` → magenta `#D8447F` → violet `#8B3CBE`.
- **Shadows are light, not darkness.** Nothing on the site casts black; things
  bloom instead. Keep it that way.
- One thing moves, slowly: the sun disc in the hero. Don't add scroll
  animations or per-card entrance effects.
- Fixed decorative layers on `body::before` (engineering grid) and
  `body::after` (film grain). Section backgrounds are transparent so those
  layers show through — an opaque section background breaks the effect.

## prospects/ — read before touching anything in there

Pitch builds for real businesses, hosted so they can be shared as a link before
the client owns anything. Full conventions in `prospects/README.md`. The short
version:

- **Self-contained.** Each prospect has its own CSS/JS/assets and shares
  *nothing* with the parent site. The duplication is deliberate — the folder
  must lift out and drop onto the client's hosting untouched.
- **Relative internal links only.** That's what lets the same folder serve from
  `/prospects/<slug>/` here and from `/` on the client's domain.
- **`noindex` everywhere**, `Disallow: /prospects/` in `robots.txt`, absent
  from `sitemap.xml`, and not linked from any page. A prospect mirrors a real
  business's content; indexed, it would compete with them for their own brand
  terms.
- **Unlisted ≠ private.** Anyone with the URL can read everything in the
  folder, `README.md` and `QUESTIONS.md` included. Don't write anything there
  that would embarrass the client.
- Absolute URLs (canonical, `og:*`) point at the `lechdigital.nl` path so link
  previews render when shared. Each build's README has the commands to reverse
  that on handover.

Each prospect has its own visual identity. **Do not make a prospect look like
lechdigital.nl** — no shared palette, no shared typefaces. The client credit in
the footer is the only connection.

---

## prospects/offroad-kielce

Rebuild of `offroadkielce.pl` — 4×4 experience days near Kielce. Built as a
favour for a friend of Andrzej's; not yet handed over.

Live: <https://lechdigital.nl/prospects/offroad-kielce/>

### The content rule — the most important thing here

**Everything on those pages traces back to the original offroadkielce.pl.
Wording was rewritten freely; no fact, number, price or claim was invented.**

Where a section needs information that doesn't exist yet, there is a `TODO`
comment in the HTML pointing at a section of `QUESTIONS.md` — never invented
filler. Keep working this way. If asked to add content, either source it from
the original site, get it from the owner, or add it as a marked placeholder.

### Two things block handover

1. `polityka-prywatnosci.html` has `[NAZWA FIRMY]`, `[ADRES]`, `[NIP]` as
   yellow `<mark class="todo">` placeholders. The page isn't legally complete
   without them. (The original site's privacy policy described a *different*
   business — Załawie.pl — which is why it was rewritten from scratch.)
2. **"Cena za auto, nie za osobę"** — the yellow band under the hero, repeated
   on every subpage — is an *inference*, not a quote. It comes from the
   original's heading "Cennik za **auto** terenowe" plus "Auto mogą również
   prowadzić osoby towarzyszące". It's the strongest selling point on the site
   and the owner hasn't confirmed it yet. If he says no, it comes out.

### Pages

| File | State |
|---|---|
| `index.html` | done |
| `vouchery.html`, `imprezy-i-integracje.html`, `eventy-firmowe.html` | done |
| `polityka-prywatnosci.html` | done bar the three placeholders |
| `flota.html`, `faq.html` | **drafts** — `noindex`, unlinked, `.draft` banner, `[PLACEHOLDER]` marks |

`faq.html` is deliberately mixed: answers *without* a yellow highlight come from
the original site and are safe. Highlighted ones await the owner.

To publish a draft page: fill the placeholders, delete the `<p class="draft">`
banner and its `robots` meta, then add a nav link **in every HTML file** — the
nav markup is duplicated per page, there is no templating.

### Conventions in this build

- **Polish for anything a visitor reads. English for everything else** —
  class names, ids, CSS custom properties, JS, comments. Asked for explicitly.
- Design concept is "nocny rajd": one continuous dark field, no light sections.
  Fixed contour-ring and dust layers on `body::before`/`body::after`, so section
  backgrounds stay transparent.
- `--amber: #F9B321` is taken from the client's existing logo and is the only
  signal colour. Shadows glow, never black.
- One looping animation: `.hero__beam`, the headlight bloom. Nothing else loops.
- Type: Saira (display) + Space Grotesk (body), Google Fonts, both `latin-ext`
  for Polish diacritics.
- `assets/js/site.js` is progressive enhancement only — every page works with
  JS disabled.
- The logo PNG has black lettering, so it sits on a sand plate (`.brand`). A
  light-lettering version would let that plate go.

### Known weak spots

- Gallery images are **600×450** — soft on a large display. Only `offroad.jpg`
  (1600×1066) is full resolution, which is why it holds the hero and the large
  gallery tile. Originals were requested in `QUESTIONS.md`.
- `assets/video/header.mp4` is **8.8 MB for ~5 seconds**. It autoplays muted
  behind the hero, but `site.js` loads it only on viewports > 720px, with
  motion allowed, no `saveData`, and not on 2G. Phones keep the poster image.
  If it's ever re-encoded (a 5s loop should be under 2 MB) those guards can relax.
- No photograph exists for Agroturystyka, so that card is text-only and links
  out to `zalawie.pl`.

### Open threads

- `QUESTIONS.md` is written *to the owner*, in casual Polish, first person
  singular. Keep that voice if editing it.
- The owner uses a Gmail address while owning `offroadkielce.pl`. A domain
  mailbox was proposed (section 8 of `QUESTIONS.md`). If it happens, the
  address appears in all seven HTML files plus `CONTACT_EMAIL` in `site.js`.
- The enquiry form falls back to `mailto:`. Setting `data-endpoint` on
  `<form id="form">` to a Formspree URL is the only change needed to post
  directly.
- `zalawie.pl` — same owner, another tired site. Possible next prospect.
