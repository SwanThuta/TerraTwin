# Criteria visuals, sliding highlights and equation formatting

This update remains local, uncommitted and unpushed. Preview: http://127.0.0.1:5173/#/method.

Implemented:
- A reusable, continuous 720ms highlight follows hover, keyboard focus and clicked selection in category tabs, comparison tabs and header navigation. Hover only previews the highlight; it never changes the selected scientific content. Leaving restores the selected tab. Actual keyboard focus is immediate. Reduced motion disables the travel animation.
- Each of the 16 current criterion keys has a distinct original SVG concept diagram. Landform, slope, roughness, relief, material layers, geologic processes, mapped area, channel network, obstacle coverage, illumination, subsurface context, planetary conditions, raster resolution, observation mask, reference frames and field practice each have their own visual. Illustrations are labeled concept diagrams and do not claim site observations or measurements. Unknown future keys retain a neutral review-record diagram.
- Copy and the related diagram share the desktop card; mobile stacks them without horizontal page overflow. The previous/next group is on the LEFT of the criterion footer, following the user's corrected instruction.
- The six arithmetic rules in the current payload render as native MathML, with roots, fractions, powers, summation and inverse tangent. Original source text is expandable. Rendering is display-only: no evaluation, scoring, data edits or scientific claims were added. Descriptive/unsupported rules remain text.

Verification:
- Production build and TypeScript check passed.
- Eight frontend tests passed, including formula structure/operator precedence, prose/invalid-formula fallbacks, all criterion visual mappings, and unknown-key fallback.
- `web/tests/criteria-polish.browser.cjs` passed in Chrome: intermediate highlight positions (not just endpoints), hover return, clicked selection, MathML namespace and fraction/root/power elements, source-formula provenance, left pager placement, 16 distinct diagrams and accessible criterion IDs, responsive layouts at 320/390/768/1440px, reduced-motion movement, comparison tab keyboard control and close behavior.
- `git diff --check` passed.

Screenshots: `1440-slope.png`, `1440-roughness.png`, `1440-equation.png`, `390-equation.png`.

Main files: `SlidingTabs.tsx`, `CriterionVisual.tsx`, `criterionVisuals.ts`, `Equation.tsx`, `formula.ts`, `mathml.d.ts`, and their integration in `ReviewedAtlas.tsx`, `main.tsx` and `style.css`. No dependencies or backend files changed. The existing Vite bundle-size advisory remains.
