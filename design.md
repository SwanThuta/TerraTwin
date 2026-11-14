# TerraTwin — final UI implementation prompt

Implement or restore TerraTwin’s **Planetary Field Atlas** exactly as it appears in the deployed reference below. Use the existing React, TypeScript, Vite and Three.js implementation and its local assets for visual parity. Keep the canvas renderer as the fallback. Treat this document as the UI brief, and use the pinned reference source to resolve exact copy, assets, breakpoints, computed styles and interaction details.

- Live visual reference: https://terratwin-field-explorer.dryhill3.chatgpt.site
- Reference source revision: `d69e3d155daa68df0448328d0515f8ca7528cafa`
- Source of visual truth: `web/src/style.css`, `main.tsx`, `Space.tsx`, `Globe.tsx`, `softwareGlobe.ts`, `WorldAtlas.tsx` and `bodies.ts` under `web/src/`.
- Source of scientific truth: `web/public/data/atlas.json` generated from `data/sites.json` and `pipeline/build.py`. Preserve its measurements, source links, imagery credits, documented gaps and comparison logic.
- Match baseline and motion at the same viewport, zoom, rotation and animation phase. For exact imagery, copy the reference assets byte-for-byte. Use the source revision alongside this brief when recreating the design elsewhere.

## App shell and visual language

- Keep the full-height, dark navy shell. Use the Inter, Geist, system-ui, sans-serif stack and dark color scheme. Use foreground `#eaf1fa`, muted text `#a8b8cc` / `#b8c4dc`, Earth cyan `#55d6e8`, Moon silver `#cbd5e1` and Mars orange `#ff9d66`.
- Set the main content width to `min(1370px, calc(100% - 96px))`, with 48px total gutters at the intermediate breakpoint in the stylesheet and 32px at 760px and below. Use the 74px masthead on desktop and 62px on mobile. Place the existing `favicon.svg` and TerraTwin logotype at left, with “Twin” in cyan. Keep the masthead brand-only.
- Keep the footer brand, “Planetary field atlas” and “Imagery credits ↗” link. Maintain hash navigation for `#/`, `#/world/earth`, `#/world/moon`, `#/world/mars` and `#/method`, plus existing direct `#/atlas` routes. `← All worlds` returns to the landing page. Preserve the method and sources page and the direct explorer’s existing results, map and comparison layouts.
- Apply the route reveal over .38s, from opacity 0 and 7px below its final position. Preserve the cyan keyboard focus indicator. Scroll to the top when navigating between routes.

## Galaxy background

Mount one fixed, decorative backdrop behind all routes, with pointer events disabled. Use the original blue nebula over `#020817`. Use `/space/nebula-mobile.webp` (1920 × 1200) below 1200px and `/space/nebula.webp` (3840 × 2400) from 1200px. Center and cover the layer, overscan by 7%, and animate alternately over 85s with ease-in-out. Drift from `translate(-2%, 1%) scale(1)` to `translate(3%, -2%) scale(1.08)`.

Overlay the same 110 deterministic stars from `Space.tsx`. Dots are 1–2.75px, star white `#d9eeff` with a soft pale blue glow. Use staggered 2.8–7s twinkle cycles. Opacity runs from .18 to .96 and back, with scale .85 → 1.2 → .85. Add the two subtle shooting stars with 110 × 2px blue-white gradient trails. Start them at 31%/11% and 66%/27% with 19s and 27s cycles and delays of −4s and −12s. Let each travel diagonally down and right at 32°, visible briefly during the first 10% of its cycle. Respect reduced motion for the backdrop, transitions and initial globe spin.

## Landing page

- Show “Planetary atlas” and “Explore the surfaces of Earth, the Moon and Mars.” Use `clamp(38px, 5.2vw, 74px)` for the main title and 15px for the subtitle.
- Present a single open scene on the nebula, with overlapping Earth, Moon and Mars globes in that initial left-to-right order. Keep the larger Moon in front. Use stage x positions 25%, 50%, 75%, side y at 52% and center y at 48%. Side globes use `min(39cqw, 86cqh)` and the center uses `min(46cqw, 99cqh)`. Maintain square globe bounds, side brightness .94 and full center brightness. Scene height is `clamp(400px, 43vw, 590px)` on desktop and `clamp(245px, 56vw, 420px)` at 760px and below.
- Center the planet name below each globe on a compact dark translucent label. Use the existing small horizontal zoom controls below each sphere and above its name. Put translucent ‹ and › controls on the outer edges at 46% scene height, with a thin pale border and blur. Use 42 × 54px desktop controls and 32 × 42px on mobile.
- › moves the rightmost globe to the left and moves the others one slot right. ‹ reverses it. Arrow keys act on the focused carousel. Ease position, size and brightness over 1.15s. The wrapping globe passes behind the center along an elevated path, reaching scale .77 and opacity .73 halfway through. Dragging a globe turns its surface in its own slot. Clicking the globe or name opens that world’s atlas.
- Keep “Use the arrows to change worlds · Select a globe to explore” and the global “Pause rotation” / “Play rotation” control under the scene.

## Globe rendering and controls

- Reuse `/textures/earth_daymap.jpg`, `/textures/moon.jpg` and `/textures/mars.jpg` with their NASA / NASA-JPL-USGS credits. Render textured spheres with a gently shaded terminator and a blue atmospheric rim on Earth. Preserve the shipped lighting: Three.js ambient `0xbccde5` at intensity .68, directional light at 2.6 from `(-1.65, 4.3, 2.05)`, ACES tone mapping and exposure 1.16. Keep the software fallback’s corresponding softer shading.
- Start auto-rotation on the landing and world views unless reduced motion applies. Drag and pinch temporarily suspend spinning. Hover or keyboard focus on a region pin temporarily pauses its globe and displays the preview. Clicking a pin or selecting a region stops auto-rotation and centers the chosen coordinates. The user can resume with the visible control.
- Support mouse-wheel, two-finger pinch, visible +/− buttons, and +, − and 0 keyboard controls. Zoom the sphere and marker projection together over 1×–3×. Rotate with drag or the arrow keys on the focused globe. Hide pins on the far side and outside the viewport. Use vertical 34 × 32px zoom controls at the upper right in world and comparison views. Landing controls use 29 × 27px buttons.

## World view and region details

- Open with `← All worlds`, a small uppercase world kind in its accent, then the world name in `clamp(46px, 8vw, 100px)`. Place the globe at left and details card at right. Use columns `minmax(0, 1.75fr) minmax(245px, 1fr)`, 20px gap and equal height `clamp(390px, 45vw, 650px)`. Use translucent navy `#071125e8`, 16px card radius and `#8199be36` borders.
- Begin with no region selected. The card shows “About Earth”, “About the Moon” or “About Mars”, the existing description, Diameter / Gravity / Solar day, then “Surface and terrain”, “Water and ice” and “Explore the dataset”. Preserve the 12 Earth, 2 Moon and 2 Mars regions and their names.
- Place “Pause rotation” / “Auto-rotate”, the accessible region selector, and the short interaction legend beneath the globe. Pins are 16px blue circles with pale borders and a soft cyan halo. Candidate pins are square with rounded corners. Selected pins are 21px, with a bright ice-cyan center, white border and the strongest glow. Secondary matched pins use a softer cyan glow.
- Position the hover preview above the pin. Use the 248px maximum panel, 12px radius, translucent navy, 49px square image (35px at 480px and below), bold name and a three-line geology summary. Clamp the preview inside the globe width. Hover leaves the full details and comparison selection intact.
- On selection show the original full image and credit above the region text. Keep the image and action footer fixed within the card, and make only the details text scroll when it overflows. Include region type, name, location, historical landing information when available, coordinates and convention, geology, footprint and expandable evidence links. Keep NASA touchdown records labeled as historical.
- Use a 7px gap and equal-width columns for the action row. On Earth use “Overview”, “↔ Moon”, “↔ Mars”. On Moon/Mars use “Overview” and “Compare with Earth”. Buttons stay on one row, minimum height 38px, 9px radius, with compact labels, dark blue borders and blue-teal gradient comparison buttons.

## Comparison view

- Clicking a comparison action opens a dedicated state within the world view. Use the heading “Earth ↔ Moon”, “Earth ↔ Mars” or the reverse order corresponding to the entry point. Replace the single-globe layout and its side card with a full-width navy panel containing two equal globe columns. Keep the two selectors, rotation control and “Close comparison”.
- Use the selected region and the strongest available precomputed comparison, in the order implemented by `WorldAtlas.tsx`: overall similarity, geology, coverage and stable dataset order. When a Moon/Mars region anchors the comparison, filter Earth pins and the Earth selector to sites with positive documented evidence. Gusev Plains and Hadley–Apennine each yield 10 Earth sites in the reference data. Jezero Crater Floor yields zero and shows the matching evidence gap. Keep the planet region anchored when the user chooses a different eligible Earth site.
- Below the globe panel place “Region comparison” and the two region cards, with matching height `clamp(370px, 39vw, 480px)` and a 2px top border in each body’s accent. Preserve the 20px column gap. Keep imagery and credits outside the independently scrollable text. Use a thin scrollbar with thumb `#42769b` and track `#101d31`.
- Follow with “Scientific evidence”. Show the eligibility status and weighted evidence coverage as a prominent percentage with an 8px blue-to-cyan meter. Use a two-column grid for Terrain, Geology, Possible field practice and Analogy limits. Show the terrain and geology weights (⅔ and ⅓). Use numeric score and bar where available and amber “No comparable data” where absent. Preserve the wording of the evidence gaps, dataset/profile provenance and expandable “Candidate search and scoring method”. Coverage represents completeness, and an overall similarity score requires comparable terrain and geology.
- Finish with “World conditions” for the displayed pair. Order the cards Temperature, Surface appearance, Geological features, Water and ice. Use the original shared temperature scale of −180 to 140 °C, with the Earth mean as a point and the Moon/Mars values drawn as ranges. Label these as planet-wide context and retain the original NASA source links.

## Responsive behavior and acceptance

- At 760px and below stack the single globe and detail card, stack the region cards and world-condition cards, and keep the two comparison globes side by side. The single globe and detail card use `clamp(385px, 84vw, 520px)`; each region comparison card is 385px high. At 480px and below collapse the evidence overview and criterion grid to one column.
- Preserve loading and retry states, no-match states, and accessible keyboard and touch routes to content. Respect the reference’s original credits and source disclosures.
- Compare desktop and mobile baseline screenshots at the same viewport and animation phase. Check the initial carousel and both arrow directions, keyboard and pointer region previews, click-to-pause, zoom and marker alignment, equal card heights with fixed images, and filtered comparison in both search directions. Run `npm run build` and `python -m unittest discover -s tests`.
