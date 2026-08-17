# Lech Digital Site Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking. This plan is executed inline in the authoring session — no subagents.

**Goal:** Build a five-page static personal site for Andrzej Lech in the "Sunburst" visual direction, running locally, with no deployment.

**Architecture:** Hand-written static HTML with one shared stylesheet. No framework, no build step, no JavaScript. Each page is self-contained HTML; the nav and footer are duplicated deliberately rather than introducing a template pipeline for ~30 lines of markup. The home-only sun disc is scoped behind a `.home` class on `<body>`.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, flexbox), self-hosted woff2 fonts (Barlow Condensed 700, Archivo 400/500, Space Mono 400/700).

## Global Constraints

- No JavaScript anywhere in the shipped site.
- No third-party network requests. Fonts are self-hosted; no CDN, no analytics, no cookies.
- No deployment. No `CNAME`, no GitHub Pages config, no git operations.
- Coolblue is described by exactly one sentence, verbatim from the spec: "By day I'm a developer at Coolblue in Rotterdam, building backend services and AI tooling in .NET and TypeScript. Most of that work isn't mine to publish — so this site is about everything else." No team names, system names, metrics, or roadmap anywhere on the site.
- Colour tokens exactly: `--base #0F0A0D`, `--surface #171015`, `--paper #F2E8DC`, `--muted #A1917F`, `--dim #6D5C52`, `--amber #FFC46B`, `--orange #FF7A2F`, `--magenta #D8447F`, `--violet #8B3CBE`.
- Sun disc with concentric rings appears on the home hero only. Every other page inherits grid, grain, colour and type without it.
- Gradient-clipped text always declares a solid `--amber` fallback before the clip.
- No factual claim the repository does not support. Smoke Free is **not** described as released on Google Play and carries **no** source link (its repo is private) until the owner says otherwise.
- Copy avoids "passionate", "innovative", "leverage", "cutting-edge".

---

### Task 1: Foundation — structure, fonts, design tokens

**Files:**
- Create: `assets/fonts/*.woff2`
- Create: `assets/css/site.css`
- Create: `.gitignore`

**Interfaces:**
- Produces: CSS custom properties (colour, spacing, type scale); utility classes `.wrap`, `.telemetry`, `.section-label`, `.rule`, `.grain`, `.grid-overlay`; `@font-face` families `"Barlow Condensed"`, `"Archivo"`, `"Space Mono"`.

- [ ] **Step 1: Create directory tree and download fonts**

```bash
mkdir -p assets/css assets/fonts assets/img projects/{coldstart,smoke-free,meeting-bingo,agentic}
```

Fetch woff2 for Barlow Condensed 700, Archivo 400/500, Space Mono 400/700 from the Google Fonts CSS API using a modern UA (returns woff2 URLs), then curl each font binary into `assets/fonts/`.

- [ ] **Step 2: Verify fonts downloaded**

Run: `ls -la assets/fonts/` — expect 5 non-empty `.woff2` files.
If the network is unavailable, fall back to a documented system stack and record the deviation in the summary. Do not silently ship a CDN link.

- [ ] **Step 3: Write `assets/css/site.css`**

Contains, in order: `@font-face` blocks, `:root` tokens, reset, base typography, `.grid-overlay` and `.grain` decorative layers, nav, section labels, rules, cards, footer, focus states, responsive breakpoints at 720px and 1080px.

- [ ] **Step 4: Verify**

Open a scratch HTML file referencing the stylesheet; confirm fonts load (no fallback metrics), tokens resolve, grid and grain render.

---

### Task 2: Home page — nav, hero, sunburst, off-duty strip

**Files:**
- Create: `index.html`
- Modify: `assets/css/site.css` (hero + sunburst rules)

**Interfaces:**
- Consumes: tokens and utilities from Task 1.
- Produces: `body.home`, `.hero`, `.sun`, `.sun-ring`, `.haze`, `.offduty` — the sunburst assembly other pages must not inherit.

- [ ] **Step 1: Write the document head and nav**

`<html lang="en">`, meta description, `◆ A. LECH` mark, four nav links, `ROTTERDAM 51.92°N 4.48°E`.

- [ ] **Step 2: Build the hero**

`[ 01 ] WHO` label, `<h1>` "I make things that should exist" with the sun-ramp gradient on "should exist" (solid `--amber` fallback first), intro paragraph with the gradient left rule, `[ OFF DUTY ]` strip listing old cars · bass & electric · Europa Universalis · rock + metal.

- [ ] **Step 3: Build the sun disc**

Absolutely positioned disc, radial gradient amber→orange→magenta→transparent, three concentric rings via `border` + `transform: scale()`, violet corner haze, all `aria-hidden="true"`, all behind content via `z-index`.

- [ ] **Step 4: Verify**

Open `index.html` in a browser at 1440px. Disc sits behind the headline, headline is legible over it, grain and grid read at low opacity, no horizontal scroll.

---

### Task 3: Home page — work, garage, about, contact, footer

**Files:**
- Modify: `index.html`
- Modify: `assets/css/site.css` (card grid rules)

**Interfaces:**
- Consumes: `.card`, `.tag`, `.section-label` from Tasks 1–2.
- Produces: the four `/projects/<slug>/` link targets that Tasks 4–5 must satisfy.

- [ ] **Step 1: `[ 02 ] SELECTED WORK`**

Four cards — Coldstart, Smoke Free, Meeting Bingo, Agentic Compiler — each with name, one-line description, status tag, stack row, linking to its detail page.

- [ ] **Step 2: `[ 03 ] ALSO IN THE GARAGE`**

Four compact cards — DBA Shield, NIS2 Prospector, TenderJet, Budgeting Tool — description and stack only, no links (repos are private).

- [ ] **Step 3: `[ 04 ] ABOUT`**

Personal text including the verbatim Coolblue sentence and the values-by-fact paragraph. No political labels; the ethos is carried by what was built and why.

- [ ] **Step 4: `[ 05 ] CONTACT` and footer**

GitHub `adziusmaster`, email `adzius.lech@gmail.com`. Footer carries the Lech Digital line and the year.

- [ ] **Step 5: Verify**

All eight cards render in grid; the four selected cards link to paths that will exist after Task 5; no `href="#"` placeholders remain.

---

### Task 4: Project page template — Coldstart

**Files:**
- Create: `projects/coldstart/index.html`
- Modify: `assets/css/site.css` (project page rules)

**Interfaces:**
- Consumes: all shared CSS.
- Produces: the exact page skeleton Task 5 replicates — `.project-header`, `.project-links`, `[ 01 ] WHY` / `[ 02 ] WHAT'S INTERESTING` / `[ 03 ] STACK`, back link.

- [ ] **Step 1: Write the page**

Header (name, one-liner, `LIVE` tag, link to getcoldstart.nl), WHY (cold outreach is grim work and the first draft is the expensive part; a human approves every send — nothing auto-sends), WHAT'S INTERESTING (deterministic signal scoring plus fingerprint dedup before the LLM ever runs, so the model qualifies and drafts rather than decides), STACK (.NET 10 · Razor Pages · EF Core · PostgreSQL · Stripe · hexagonal), back link.

- [ ] **Step 2: Verify**

Page inherits grid, grain, colour and type. **The sun disc does not appear.** Back link returns to `/index.html`.

---

### Task 5: Remaining project pages

**Files:**
- Create: `projects/smoke-free/index.html`
- Create: `projects/meeting-bingo/index.html`
- Create: `projects/agentic/index.html`

**Interfaces:**
- Consumes: the Task 4 skeleton, replicated exactly.

- [ ] **Step 1: Smoke Free**

WHY — every alternative on the Play Store was paywalled or stuffed with micropayments, so this one is free and offline. WHAT'S INTERESTING — `android.blockedPermissions` removes INTERNET from the manifest, so the privacy claim is verifiable by inspecting the APK rather than trusted; every physiological claim carries a source, and two widely repeated but untraceable claims were deliberately excluded. STACK — Expo SDK 57 · expo-router · SQLite · TypeScript · 102 tests. **No Play Store link. No source link. No release claim.**

- [ ] **Step 2: Meeting Bingo**

WHY — meetings are full of buzzwords; this makes that funny instead of grim. WHAT'S INTERESTING — real-time multiplayer on Firestore with no server of its own, shipped to Google Play as a Trusted Web Activity, so one PWA codebase is both the website and the Android app. STACK — React 18 · TypeScript · Vite · MUI v6 · Firestore · TWA. Links: live app and Google Play (both confirmed in its README).

- [ ] **Step 3: Agentic Compiler**

WHY — a language model that writes code cannot be trusted on its say-so, so make an independent checker the gate: hallucination becomes a build failure. WHAT'S INTERESTING — a 7B 4-bit local model with cascade sampling solved 30/30 benchmark problems, every solution machine-verified, at roughly 1.06× the token cost of a frontier one-shot; four later training runs failed to beat it and that is written down rather than buried. STACK — C# · LoRA fine-tuning · Qwen-Coder 7B · custom verifier. Link: public GitHub repo.

- [ ] **Step 4: Verify**

All four project pages render, none shows the sun disc, all back links work, all external links resolve to real URLs.

---

### Task 6: Responsive, accessibility and final verification

**Files:**
- Modify: `assets/css/site.css`
- Modify: all five HTML files as defects are found

- [ ] **Step 1: Responsive pass**

Check 375px, 768px, 1440px. Single column below 720px; sun disc repositions behind the headline; telemetry strips wrap; no horizontal overflow at any width.

- [ ] **Step 2: Accessibility pass**

One `h1` per page; landmarks present; decorative layers `aria-hidden`; visible amber focus rings; tap targets ≥44px; body text ≥4.5:1 contrast.

- [ ] **Step 3: Third-party request check**

Load each page with devtools open. Expect zero requests to any host other than the local file system.

- [ ] **Step 4: Link audit**

Every internal link resolves; every external link points at a URL confirmed in the source repositories.

---

## Self-Review

**Spec coverage:** Purpose/voice → Task 3 copy. IA → Tasks 2–5. Visual system → Tasks 1–2. Motifs → Tasks 1, 2, 4. Responsive/a11y → Task 6. Tech approach → Task 1. Deployment → excluded by Global Constraints, matching the spec's "out of scope".

**Placeholders:** None. Every task names exact files and exact copy angles.

**Consistency:** Class names (`.home`, `.sun`, `.card`, `.telemetry`, `.section-label`) are introduced in Tasks 1–2 and reused unchanged in Tasks 3–5. Section numbering runs 01–05 on home and 01–03 on project pages, matching the spec.

**Deviation from spec, recorded:** the spec's open item allowed either resolution for Smoke Free; this plan picks the conservative one (no store link, no source link, no release claim) as the default, since the repository does not confirm a Play Store release.
