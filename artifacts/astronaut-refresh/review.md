# Local astronaut and workspace refresh

Preview: http://127.0.0.1:5173/

This update is local, uncommitted and unpushed for review.

## Changes

- Original, lightweight SVG chibi astronauts in cyan, off-white and lilac drift through the existing galaxy. Decorative artwork ignores pointer events and is hidden from screen readers. Mobile uses two crew members instead of four to keep the background quiet.
- Shared astronaut loading indicators cover actual atlas requests and globe-texture loading on Home and world/comparison viewers. Texture failures leave an explicit unavailable state; software globe loading also completes correctly. No artificial loading delay was added.
- A consistent header and Home brand label appear across every route. Explore and Method use fluid desktop/mobile gutters and a wider workspace. World globe and details cards stretch together.
- Accessible SVG back controls replace text arrows. Button feedback, route/site/comparison/tab changes and method criteria navigation have short transitions. View Transitions is progressive enhancement; unsupported browsers retain working state changes. Reduced-motion preferences disable animations.
- Method criteria are organized into dataset-driven category tabs with a criterion pager, review rules, units, readiness and a decorative contour motif inspired by the reference. All 16 criteria remain reachable and unchanged. Unrecognized future criteria remain accessible in Other criteria.
- Rating guidance, imagery attribution and the source register use the same translucent card colors as Explore. Source IDs remain on one line, including narrow screens.

## Passed verification

- `npm run build` (includes TypeScript check).
- `npm --prefix web test`: 6 tests, including complete criteria grouping and scientific-role preservation.
- `web/tests/astronaut-refresh.browser.cjs`: matching header heights and no horizontal overflow on Home, Earth and Method at 320/390/768/1440px; wide content gutters; icon back links; reduced-motion behavior; data-request astronaut loader; category keyboard navigation and access to all 16 criterion IDs; animated route/site/comparison/evidence/close transitions; Home texture loaders; operation without the View Transitions API; software globe loading and zoom/reset.
- `web/tests/overview-regions.browser.cjs`: real comparison from Earth and Moon at 390/768/1440px, source fallbacks, equal region cards, fixed image frames, independently scrolling details, evidence/close behavior, test-only valid/broken imagery and pair-scoped state resets.
- `git diff --check`.

Screenshots: `390-home.png`, `390-earth.png`, `390-method.png`, and equivalent `1440-*` files. The existing region-card regression screenshots were refreshed as well.

No scientific records, rubric rules, exporter code, report content or deployment configuration were changed. Vite retains its advisory warning for the existing Three.js bundle size. Full-page screenshots capture the fixed sky differently below the initial viewport; during normal scrolling the sky remains fixed behind the content.
