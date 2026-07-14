# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Landing page + writings section for Felipe Caro Díaz, a clinical psychologist in San Antonio, Chile. Vite + React 18 SPA, deployed as static files to GitHub Pages. There is no real backend — this is client-only.

## Commands

```bash
npm run dev      # start dev server (vite)
npm run build    # production build to dist/
npm run preview  # preview the production build locally
npm run deploy   # build + push dist/ to the gh-pages branch (manual publish)
```

No test suite and no lint script are configured.

## Architecture

**Routing**: `react-router-dom` with `HashRouter` (not `BrowserRouter`) — required because GitHub Pages is pure static hosting with no server-side rewrite to `index.html` on refresh. `base: '/psycho-preview/'` in `vite.config.js` matches the repo name (GitHub Pages project site, not a user/org site).

Routes (`src/App.jsx`): `/` (Landing), `/escritos` (Escritos), `*` (NotFound). All wrapped in `PublicLayout` (header/footer/mobile nav/Lenis smooth scroll/floating WhatsApp button).

**No backend, but a CMS-shaped content layer**: `src/api/endpoints.js`'s `publicAPI.getContent()` is a fake async call that always resolves `{ data: [] }`. Real content comes from `src/pages/public/fallbacks.js`'s `FALLBACKS` object, merged via `mergeContentBlocks()` (per-`sectionKey`, real block wins if present, else fallback). Landing.jsx fetches through `useQuery` for this shape to be swappable for a real backend later without touching component code. Most `FALLBACKS` sections are `{ title, body }` where `body` is a `\n`-delimited string parsed per-section (see `parseApproachItems`/`parseEvidenceItems` for the `"Título — texto"` sub-format used by several sections). `services` is the one exception: it's `{ title, items: [{ name, price, description }] }` (a real array, not a delimited string) because pricing needed a structured field the string format couldn't express.

**Escritos content is separately scalable on purpose**: `src/pages/public/escritosContent.js` exports `ESCRITOS_CONTENT` (an object keyed by category) and `ESCRITOS_CATEGORY_LABELS`. `Escritos.jsx` derives its category tabs from `Object.keys(ESCRITOS_CONTENT)` — adding a new writing category means adding a key to that one file, not touching the component. Items currently have `comingSoon: true` placeholders; real writings replace them item-by-item.

**Contact flow is WhatsApp-only, no booking/calendar system**: there used to be a full booking wizard (calendar, session types, availability) — it was removed at the client's request. All CTAs funnel to either the floating `WhatsAppButton` (`src/components/ui/WhatsAppButton.jsx`, direct wa.me link) or the name-capture form `WhatsAppCTA` (`src/pages/public/components/WhatsAppCTA.jsx`) embedded in Landing's `#contacto` section, which composes a wa.me message from the visitor's name plus an optional pre-selected service (see `selectedService` state in `Landing.jsx`, set when a Servicios card's "Agendar" link is clicked — the service name rides silently into the WhatsApp message).

**In-page anchor navigation quirk**: anchors like `#servicios`/`#contacto` are scrolled to via `src/lib/scrollToAnchor.js` (calls `scrollIntoView`, works with Lenis) rather than native `<a href>` jumps. Critically, after consuming a hash on mount, `Landing.jsx`'s hash-effect replaces the URL to strip it (`navigate(location.pathname, { replace: true })`) — without this, a cross-route anchor click (e.g. from `/escritos` to `/#sobre-mi`) permanently pollutes the URL (`.../#/#sobre-mi`) and every future reload re-triggers the scroll. `src/main.jsx` also sets `history.scrollRestoration = 'manual'` so a reload doesn't restore the browser's remembered scroll offset either — both fixes address the same symptom ("page jumps away from the top on load") from two different causes.

**Color palette is locked, not themeable**: there used to be a `ThemeContext`/`ThemeSwitcher` letting you compare 7 palettes and 5 logo variants live (a client-review prototype). Both were deleted once the client picked "azul de medianoche y ocre" (navy + ochre) as final. `src/index.css`'s `:root` now hardcodes that one palette directly as CSS custom properties (`--color-primary-*`, `--color-accent-*`, etc.), consumed by `tailwind.config.js` via a `withOpacity()` helper so classes like `bg-primary-600` or `text-accent-500/70` still work. Do not reintroduce a `stone`/`line` Tailwind color remap or `darkMode: 'class'` without also defining the corresponding CSS variables — that pairing was part of the abandoned dark-mode branch and half-adopting it silently breaks all neutral text/border colors (they'd resolve to undefined CSS vars).

**Brand mark**: `src/components/ui/BrandMark.jsx` renders a tesseract (cube-in-cube) wireframe logo with framer-motion stroke-draw-in animation, using colors matched to a design the client provided directly (`#BBD9F2`/`#EEC0DE`/`#BFAEEC`, stroke `#5B8FC7`) — these are intentionally NOT tied to the site's navy/ochre palette variables; it's the client's personal mark, kept faithful to what they approved rather than reskinned to match. There's a `tiny` fallback (<24px) that draws only the front face, since the full tesseract detail is illegible at favicon/small-icon sizes.

**Header is a fixed solid navy band always** (not transparent-over-hero or scroll-conditional) — a deliberate fix for it blending into page content and looking muddy/translucent over the also-dark `#psicoanalisis`/`#contacto` sections.

**Floating WhatsApp bubble only appears after scrolling past ~60% of the viewport height** (`showWhatsAppBubble` state in `PublicLayout.jsx`), not from mount — on mobile it used to render at the same time as the hero's own WhatsApp CTA button, two identical affordances stacked in the first screen.

## Not yet built: client self-service content editing

Felipe (the client) currently cannot change any text/prices/photos without a code change — everything lives in `fallbacks.js`, `escritosContent.js`, and directly-imported image files. He asked about self-managing without touching code, and about the site being portable to hosting he controls (it currently deploys from this GitHub account, but may move to his own accounts later).

Recommended approach when this gets picked up: a published Google Sheet (edited from Felipe's own Google account, no dev involvement) as the content source, fetched client-side at page load. This fits the existing architecture almost exactly as-is — `publicAPI.getContent()` (`src/api/endpoints.js`) is already a stubbed-out fetch that `mergeContentBlocks()` merges against `FALLBACKS`; swap the stub for a real `fetch()` of the sheet published as CSV/JSON and the existing fallback-merge logic keeps working unchanged. Because the fetch happens in the visitor's browser (not at build time), this works regardless of where the static files end up hosted — no dependency on this repo's GitHub Actions or GitHub Pages specifically.

Scope it to what actually churns: service names/prices and Escritos entries (already isolated in their own files for exactly this reason) and possibly photo URLs (via public Google Drive/Photos links referenced from the same sheet). Don't route the rest of the copy (bio, "El enfoque", evidence stats, etc.) through this — it changes rarely and isn't worth the added indirection.
