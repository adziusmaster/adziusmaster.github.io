# prospects/

Pitch builds for real businesses, hosted here so they can be shared as a link
before the client owns anything.

```
prospects/<client-slug>/
  index.html
  assets/
  README.md      ← deploy notes for that build
  QUESTIONS.md   ← what the client still needs to supply
```

## Rules for anything in here

**Every build is self-contained.** No shared CSS, no shared JS, no imports from
the parent site. A prospect folder can be copied out and dropped onto the
client's own hosting with nothing left behind. That duplication is the point —
these are handover packages, not parts of lechdigital.nl.

**All internal links are relative.** That is what lets the same folder serve
from `/prospects/<slug>/` here and from `/` on the client's domain without a
single edit.

**Everything is `noindex`.** A prospect mirrors a real business's content. Left
indexable it would compete with that business for its own brand terms, which is
the opposite of the favour being done. Enforced twice: a `robots` meta on every
page, and `Disallow: /prospects/` in the site-wide `robots.txt`. Prospects are
also kept out of `sitemap.xml`.

**Absolute URLs point here, not at the client.** Canonical, `og:url` and
`og:image` use the `lechdigital.nl/prospects/…` path so the link previews
correctly when it is shared over WhatsApp or email. Each build's own README
lists what to change on handover.

**They are unlisted, not secret.** Nothing links to `/prospects/` from
lechdigital.nl, and crawlers are told to stay out — but anyone with the URL can
open it, including the `README.md` and `QUESTIONS.md` inside. Don't put anything
in a prospect folder that would be awkward for the client to read.

## Current

| Slug | Business | Live at |
|---|---|---|
| `offroad-kielce` | Offroad Kielce — 4×4 experiences, Kielce | [/prospects/offroad-kielce/](https://lechdigital.nl/prospects/offroad-kielce/) |
| `zalawie` | Agroturystyka Załawie — farm stays, Brudzów | [/prospects/zalawie/](https://lechdigital.nl/prospects/zalawie/) |

Those two share an owner, a phone number and the amber `#F9B321` taken off
his logo — and nothing else. Each folder still stands alone: no shared CSS,
no shared JS, no imports. The family resemblance is a design decision that
happens to be repeated in two places, not a dependency.
