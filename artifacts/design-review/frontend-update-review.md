# Frontend update verification — 2026-11-15

The existing local checkout was updated without publishing or changing the unreviewed research leads into reviewed claims.

Passed:
- Production build and TypeScript checks.
- 16 Python tests, including adding a reviewed CSV pair through the exporter and publishing zero reviewed records.
- 3 frontend normalization/relationship tests with test-only synthetic data.
- Chrome: real pair from Moon and Earth, empty Mars, close preserves the starting site, carousel arrows, evidence tab navigation, 320/390/768/1440px layouts without page overflow.
- Chrome synthetic response interception: two Earth matches for one target, Earth linked to Moon and Mars, unmapped site, missing evidence/imagery/report, synchronized next-match switching and touch selection.
- Chrome with WebGL disabled: software globe, keyboard marker preview constrained to the viewport, zoom/reset and keyboard tab selection.

Screenshots: `comparison-updated-desktop.png`, `comparison-updated-mobile.png`.

Data source: `/data/atlas.json`, configurable with `VITE_ATLAS_URL`. New fully reviewed CSV pairs pass through `load_reviewed()` and the existing JSON/PDF build with no frontend edit. Release/version instructions are in `readme.md`.

Limits: global display textures cannot provide street/building detail; current pair-specific images are missing. Lunar scene coordinates remain in the evidence rather than being invented as a verified feature pin. No geographic feature boundary is synthesized. Pinch handling is implemented but was not exercised on physical touch hardware. Home transition duration and wrapping are implemented in CSS; the browser checks exercised arrow behavior with reduced motion enabled, not frame-by-frame animation analysis. Vite emits an advisory bundle-size warning.

Local development server: http://127.0.0.1:5173/
