# Lech Digital — personal site design

**Date:** 2026-08-10
**Status:** Approved
**Owner:** Andrzej Lech

## Purpose

A personal website for Andrzej Lech: a developer who makes things because they should
exist. Not a CV, not an agency pitch, not a funnel. The subject is the person and the
making; Lech Digital (a newly registered side company) is the workshop's name and appears
only as a footer line.

Audience: anyone who finds him — other developers, curious visitors, occasionally a
recruiter. The site should leave them with "this person builds things, and cares how."

### Non-goals

- No services page, no "hire us", no lead capture. The site does not tout for business.
- No blog. An empty writing section ages worse than no writing section.
- No analytics, no third-party scripts, no cookies.
- No deployment in this phase. The site is built and reviewed locally.

## Voice

Plain, specific, slightly dry. Values are conveyed by fact, never by claim:
"free because every alternative wanted a subscription", "the INTERNET permission is
blocked in the manifest". The words "passionate", "innovative" and "leverage" do not
appear.

## Confidentiality constraint (hard requirement)

Coolblue's internal policy requires manager approval for publications about one's work,
and classifies project names, internal service names, repositories, architecture,
metrics, roadmaps and rollout status as non-public. The site therefore carries exactly
one sentence about the day job:

> By day I'm a developer at Coolblue in Rotterdam, building backend services and AI
> tooling in .NET and TypeScript. Most of that work isn't mine to publish — so this
> site is about everything else.

No team names, no system names, no numbers, no roadmap, no screenshots. Any future
expansion of this paragraph requires manager sign-off first.

Separately — and outside this spec's scope — Coolblue requires manager permission for
(co-)ownership of another company. Publishing this site makes Lech Digital visible, so
that conversation should happen before any future deploy.

## Information architecture

```
/                          Home
/projects/coldstart/       Detail page
/projects/smoke-free/      Detail page
/projects/meeting-bingo/   Detail page
/projects/agentic/         Detail page
```

### Home page sections

| # | Section | Content |
|---|---------|---------|
| — | Nav | `◆ A. LECH` · Work / Making / About / Contact · `ROTTERDAM 51.92°N 4.48°E` |
| 01 | Hero | "I make things that should exist" + intro paragraph + `[ OFF DUTY ]` strip |
| 02 | Selected work | 4 cards linking to detail pages: Coldstart, Smoke Free, Meeting Bingo, Agentic Compiler |
| 03 | Also in the garage | 4 compact cards, no detail pages: DBA Shield, NIS2 Prospector, TenderJet, Budgeting Tool |
| 04 | About | Longer personal text incl. the single Coolblue sentence and what he believes, shown through what he builds |
| 05 | Contact | GitHub (`adziusmaster`), email. Footer: Lech Digital. |

The `[ OFF DUTY ]` strip is a monospace telemetry line carrying: old cars · bass &
electric · Europa Universalis · rock + metal. It is what makes the hero about the person
rather than the job.

### Project detail page template

Consistent structure across all four:

1. Header: name, one-line description, status tag, links (live / Play Store / source)
2. `[ 01 ] WHY` — the reason it exists (the strongest content on every page)
3. `[ 02 ] WHAT'S INTERESTING` — the one genuinely non-obvious technical decision
4. `[ 03 ] STACK` — monospace tag row
5. Back link to home

Per-project angle:

- **Smoke Free** — every Play Store alternative was paywalled or full of micropayments,
  so this one is free and offline. INTERNET permission blocked in the manifest; the claim
  is verifiable by inspecting the APK. Medical claims carry sources, and two commonly
  repeated but untraceable claims were deliberately excluded.
- **Agentic Compiler** — a verifier-first language where an independent checker must
  accept LLM-authored code before it runs. Headline: a 7B local model reaching 30/30
  verified at ~1.06× the token cost of a frontier one-shot. Negative results (v13–v16)
  are stated, not hidden.
- **Coldstart** — B2B lead harvesting with AI-drafted outreach; a human approves every
  send. .NET 10, hexagonal, Stripe, live at getcoldstart.nl.
- **Meeting Bingo** — real-time multiplayer buzzword bingo, shipped to Google Play as a
  TWA. The small, silly one, and it is on the site precisely for that reason.

## Visual system — "Sunburst"

Apollo-era engineering structure, Fillmore-poster warmth, a neon-noir violet edge.

### Colour

| Token | Value | Use |
|---|---|---|
| `--base` | `#0F0A0D` | Warm near-black page background |
| `--surface` | `#171015` | Cards, panels |
| `--paper` | `#F2E8DC` | Primary text |
| `--muted` | `#A1917F` | Secondary text (≥4.5:1 on base) |
| `--dim` | `#6D5C52` | Tertiary labels, rules |
| `--amber` | `#FFC46B` | Sun core, accents, links |
| `--orange` | `#FF7A2F` | Gradient midpoint |
| `--magenta` | `#D8447F` | Gradient end |
| `--violet` | `#8B3CBE` | Corner haze only |

Sun ramp: `linear-gradient(96deg, amber, orange 46%, magenta)`. Any gradient-clipped text
declares a solid `--amber` fallback first, so it degrades to a readable colour rather than
transparent.

### Typography

| Role | Family | Weights |
|---|---|---|
| Display caps | Barlow Condensed | 700 |
| Body | Archivo | 400, 500 |
| Telemetry labels | Space Mono | 400, 700 |

Self-hosted `woff2` in `/assets/fonts/`, `font-display: swap`, no CDN. Display type is
uppercase with `line-height: .87`; telemetry labels are uppercase with `.16em`–`.2em`
tracking.

### Motifs

- 34px grid overlay at ~5% opacity, on every page
- `[ 01 ]` bracketed section numbers in amber monospace
- Rotterdam coordinates in the nav
- Hairline rules (`1px`, `--dim` at low alpha) separating sections
- Film grain: repeating linear gradient at low opacity
- **Sun disc with concentric rings: home hero only.** Interior pages inherit grid, grain,
  colour and type but never the disc. The home page is the peak; the rest is the hum.

### Responsive

Single-column below 720px. The sun disc shrinks and shifts behind the headline rather
than beside it. Telemetry strips wrap. Minimum tap target 44px on all links.

### Accessibility

- All body text ≥4.5:1 against its background; large display type ≥3:1
- Gradient text has a solid fallback
- Grain and haze are decorative, `aria-hidden`, and suppressed under
  `prefers-reduced-motion` if they ever animate (they do not, in v1)
- Semantic landmarks: `header`, `nav`, `main`, `section`, `footer`; one `h1` per page
- Focus states are visible and amber, never removed

## Technical approach

Hand-written static HTML and CSS. No framework, no build step, no JavaScript.

Rationale: the design needs no interactivity, so a build pipeline would add maintenance
cost and dependency risk for zero user-visible benefit. Editing the site means editing
one HTML file.

```
lech-digital/
  index.html
  projects/
    coldstart/index.html
    smoke-free/index.html
    meeting-bingo/index.html
    agentic/index.html
  assets/
    css/site.css        # tokens, layout, components — single stylesheet
    fonts/*.woff2
    img/                # project screenshots, if any
  docs/superpowers/     # spec + plan
```

Shared CSS lives in one stylesheet; the sun disc is scoped to a `.home` class on `body`
so interior pages cannot accidentally inherit it. Each page is self-contained HTML —
duplication of the nav and footer across five files is accepted deliberately, as the
alternative is a build step for ~30 lines of markup.

### Verification

No test framework. Verification is:

1. Every page opens locally and renders with fonts, grid, grain and colour correct
2. Every internal link resolves; every external link points at a real URL
3. Zero network requests to third-party hosts (checked in devtools)
4. Contrast checked against the values in the table above
5. Layout inspected at 375px, 768px and 1440px

### Deployment

**Out of scope for this phase.** The site stays local. When it is time, GitHub Pages
serves the repository root, and a `CNAME` file switches it to `lech.digital`. Nothing in
the build assumes a host.

## Open items

- **Smoke Free's repository is private,** and no Play Store listing was found for
  `com.adzius.smokefree`. Its page therefore carries no source link, no store link and no
  release claim. If the repo goes public and/or the app ships, both can be added.
- **Meeting Bingo's Play Store listing 404s.** The repository README links to
  `com.adziusmaster.meetingbingo`, but that URL returns 404 while a control app returns
  200, so the listing is not publicly reachable (unpublished, removed, or in closed
  testing). The site links only to the live web app and the public repo, and describes the
  Trusted Web Activity setup without claiming a store presence. Owner to confirm.
- Project screenshots are optional in v1; cards are typographic and work without images.
- The Coolblue sentence needs manager sign-off before the site is ever published.
