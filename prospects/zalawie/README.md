# Agroturystyka Załawie — pitch build

Rebuild of [zalawie.pl](https://zalawie.pl/). Same owner as the Offroad Kielce
build in the folder next door — the two businesses share a phone number, and
his own site names Offroad Kielce as the partner who runs the off-road trips.

Live at <https://lechdigital.nl/prospects/zalawie/>.

## The content rule

**Everything on these pages traces back to the original zalawie.pl. The wording
is new throughout; no fact, number, price or claim was invented.** Where a
section needed something the original does not say, there is a `TODO` comment
in the HTML pointing at a numbered section of `QUESTIONS.md`, and a yellow
`<mark class="todo">` where a visitor would see the gap. Never filler.

Two things worth knowing before editing:

- **The cottages have two names each on his own site.** The homepage calls them
  *Chłopska chata* and *Stodoła*; the amenities page calls them *Wiejski Domek*
  and *Kamienna Stodoła*. The build uses the short forms the gallery headings
  use — **Chata** and **Stodoła** — because those are the only names that appear
  in both places. Section 1 of `QUESTIONS.md`.
- **The 5-day off-road inclusion is quoted, not inferred.** It is stated on the
  original. It carries the band under the hero and is the only outbound link on
  the index, so if he retracts it, the band goes.

## Handover

The folder is self-contained — every internal link is relative, so it runs from
a domain root unchanged. Three things to undo:

```sh
# 1. Point absolute URLs back at the client's domain
grep -rl 'lechdigital.nl/prospects/zalawie/' *.html \
  | xargs sed -i '' 's|https://lechdigital.nl/prospects/zalawie/|https://zalawie.pl/|g'

# 2. Let search engines in
sed -i '' '/^<meta name="robots" content="noindex, nofollow">$/d' \
  index.html domki.html imprezy.html atrakcje.html galeria.html
```

3. **Repoint the two Offroad links.** `index.html` (the band) and `imprezy.html`
   both link to `https://lechdigital.nl/prospects/offroad-kielce/`, which is the
   *pitch* build. That is deliberate while this is being shown — it is the good
   version of the other site — but on handover they must go to whatever Offroad
   Kielce is actually serving at that point, `offroadkielce.pl` or the rebuild.

Then upload everything except `README.md` and `QUESTIONS.md`.

## Layout

```
index.html              the place, the two lets, prices, gallery, enquiry form
domki.html              both cottages in detail
imprezy.html            events
atrakcje.html           what is in the area
galeria.html            all 21 photographs, grouped
polityka-prywatnosci.html
assets/                 css, js, images — shared with nothing outside this folder
```

The old site served its pages from directories (`/udogodnienia/`, `/galeria/`).
If those URLs have any traffic, keep them alive with redirects rather than
letting them 404.

## Design

The Offroad build is *"nocny rajd"*: one unbroken dark field, amber on wet soil,
a headlight sweeping the hero. This is the same hand at noon. Ink on linen, sun
instead of headlamp, a woven texture instead of dust — and **the identical amber,
`#F9B321`**, because it comes off the same owner's logo. That single shared hex
is what makes the two read as a pair without either imitating the other.

Three rules carry across, inverted where they need to be:

- **Nothing casts black.** There the shadows bloom out of darkness; here they are
  sun through a window — warm clay and amber, never neutral grey.
- **Two fixed decorative layers** on `body::before` / `body::after`. Section
  backgrounds stay transparent so they show through; an opaque section background
  breaks the effect.
- **One thing moves, slowly** — the sun drifting across the hero, an 18-second
  pass. Nothing else loops.

Type is Fraunces (display) and Inter (body), both via Google Fonts, both
carrying `latin-ext` for Polish diacritics. Offroad is industrial condensed;
this is a warm modern serif. Machine and home.

Polish for anything a visitor reads. English for everything else — class names,
ids, custom properties, JS, comments.

## The enquiry form

`index.html` has `<form id="form" data-endpoint="">`.

- **Empty `data-endpoint` (current):** composes the message and opens the
  visitor's mail client via `mailto:`. Works on any host with zero setup.
- **With an endpoint:** POSTs `FormData` and expects a 2xx. Set a Formspree URL
  on the form and nothing else needs changing.

Sending requires the acknowledgement box — an acknowledgement rather than a
consent on purpose, because section 3 of `polityka-prywatnosci.html` gives
art. 6(1)(b) RODO as the basis for answering an enquiry. Nothing stores the
tick; it travels with the enquiry as `Polityka prywatności: przyjęta do
wiadomości`.

### The controls that draw themselves

A `<select>` popup and the calendar of an `<input type="date">` are browser
chrome; no stylesheet reaches either. `site.js` draws its own dropdown, calendar
and number stepper over the native controls, which stay in the markup, keep
their `name`, and are what actually submits. With JS off the visitor gets the
plain native controls.

The departure field carries `data-after="arrival"`, so its floor follows the
arrival date and an impossible stay cannot be submitted.

Every rule that hides a native affordance is scoped under `.form[data-enhanced]`,
an attribute only `site.js` sets. Keep them scoped, or a visitor without JS
loses the control entirely.

## Known weak spots

- **Photographs are 600×450**, every one of them except the two page headers
  (1920×701 and 1920×700, which is why those two carry the hero and the subpage
  headers). Soft on a large display. Originals requested in `QUESTIONS.md`.
- The originals were exported badly — 3.2 MB of PNG for one header photograph,
  and up to 780 KB for a single 600×450 interior. Everything here was converted
  once with `sips` to JPEG, taking the set from about 15 MB to under 5 MB. That
  is a one-off conversion committed to the repo, not a build step; if he sends
  new originals, convert them the same way before committing.
- **No photograph exists for several attractions** — Jaskinia Raj, Chęciny,
  the Leonardo da Vinci centre, Tokarnia, paintball and the stables are
  text-only cards. That is honest, but a picture each would do more.
- `imprezy.html` is the thinnest page, because the original says almost nothing
  concrete about events. Most of section 4 of `QUESTIONS.md` exists to fix it.

## Open threads

- `QUESTIONS.md` is written *to the owner*, in casual Polish, first person
  singular. Keep that voice if editing it.
- He uses a Gmail address while owning `zalawie.pl`. A domain mailbox was
  proposed (section 8). If it happens, the address appears in all six HTML files
  plus `CONTACT_EMAIL` in `assets/js/site.js`.
- The privacy policy needs company name, address and NIP — the same three fields
  the Offroad build is waiting on. One answer unblocks both.
