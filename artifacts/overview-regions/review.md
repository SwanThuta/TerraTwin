# Overview region-card verification

Changed production files: `web/src/ReviewedAtlas.tsx` and `web/src/style.css`. The default Overview tab now renders two cards before Documented similarity. They reuse the ordered comparison sites and bind visuals through the active pair's Earth/target IDs. Keys include both pair and site IDs.

The current `/data/atlas.json` P01 export has no image files: Earth imagery cites R02 (NASA NTRS), and target imagery cites R03 (LROC). Both cards retain a fixed frame with “Site imagery unavailable” and a link to the corresponding cited source. Full source credit, scale, coordinate notes, conventions and citations remain expandable.

Passed:
- Production build, TypeScript check and all five frontend data tests.
- Chrome at 390/768/1440px, starting from both Earth and the Moon: default Overview, correct site/visual/source order, equal card/frame dimensions, mobile stacking, no horizontal overflow, fixed imagery during details scrolling, Evidence availability, and close returning to selected site details.
- Browser-only fixtures: real image decoding from temporary SVG responses, `object-fit: contain`, reversed world/image order, HTTP 404 image fallback, synchronized match switching, and image-error/disclosure resets even when the Earth site ID stays the same between pairs.

Browser regression script: `web/tests/overview-regions.browser.cjs`. The paired Earth/Moon screenshots use the real missing-image dataset; `image-present-test-only.png` is explicitly synthetic test imagery. No images, scientific data, reports, exporter code or backend contract were modified.

Cards are 360px high with 160px image frames; the details area alone scrolls and uses a thin themed scrollbar. The existing 660px grid breakpoint controls mobile stacking. The original globes, ratings, tab navigation, evidence, practice, source register and close behavior remain intact.
