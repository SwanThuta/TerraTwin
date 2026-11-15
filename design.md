# TerraTwin interface design

## Current UI contract

The active frontend reproduces the supplied TerraTwin Sites source at commit `19ce48affaf49194359a6b57a36b0d91f8882999`. The reference checkout used is `/tmp/terratwin-reference/.sites-checkout`; the destination is `/home/dell/Desktop/TerraTwin`. This source port supersedes the earlier locally recreated landing and explorer layouts.

`web/src/main.tsx` owns the reference shell, hash routes and Home planetarium. `ReviewedAtlas.tsx` owns the world, selected-site, comparison and Method & sources screens. `Globe.tsx`, `Space.tsx`, `bodies.ts`, `softwareGlobe.ts` and the original reference CSS control the rendered appearance. The reference's favicon, galaxy images, global planet textures and higher-resolution zoom layers are copied at their original quality. Inactive older map components are not part of the route tree.

## Home

Preserve the reference header label and navigation, logo, footer, line breaks, cyan action, vertical hero centering, desktop proportions and centered mobile composition. The carousel preserves the same overlapping globes, stable world identities, 2.5-second slide/wrap animations, depth/scale changes, arrows, play/pause control, drag rotation and reduced-motion behavior. Clicking a globe opens its world. Home has no zoom controls.

## Worlds and sites

Retain the reference world title, globe card, overlay zoom/reset controls and adjacent overview/details card. Use the original renderer and software fallback, including the full-width zoom behavior and bundled detail layers. Populate the reference site-list items and pins from the destination export. Plot only valid mapped points, preserve source-defined locator meaning and keep sites without points selectable from the list.

Site selection pauses automatic rotation and opens the original details/imagery/source treatment. Comparison actions are grouped by counterpart world: one action each for Moon or Mars from Earth, and Earth from either planetary world. Sites with no eligible pairs have an explicit empty state. All three worlds remain available.

## Comparisons

Preserve the reference two-globe layout, original starting side, close/back controls, VS headline, qualitative rating/coverage blocks, conditional report action and four tabs: Overview, Evidence, Field practice, Sources. The chosen pair ID supplies every scientific field and both globe highlights. Closing preserves the starting site selection.

A single eligible pair renders the reference layout with the Overview region-card addition described below. Multiple matches add only a compact selector and previous/next buttons styled with the existing comparison controls; pins and selector changes use the same pair state. Explicit backend rank is honored in its target scope; otherwise dataset order is stable. No scientific rating is computed in the frontend.

## Data and method

The destination's existing `/data/atlas.json` export is authoritative, loaded and normalized by `web/src/atlas.ts`; `VITE_ATLAS_URL` can configure a different deployment endpoint. Read criteria, metadata, publication counts and source register from that payload. Preserve credits separately from pair evidence. Missing optional fields use the reference placeholders and disclosures; malformed joins are excluded locally without breaking other records. Unreviewed candidates are not promoted.

The current P01 record remains Moderate terrain, Weak geology, Weak overall and two reviewed dimensions. The HMP research-station marker remains a context locator. Lunar scene coordinates are not invented as a verified feature point. Pair imagery remains explicitly unavailable until sourced files are supplied. Detailed street imagery and scientific feature polygons are not synthesized from the globe textures.

## Verification

Matching source/destination screenshots and layout measurements for 390/768/1440px states are saved in `artifacts/reference-port/`. Static comparisons pause motion and use the same destination scientific payload in both apps. Browser interaction checks also exercise synthetic additional records without writing them to production data. See the review report there for concrete results and limitations.

## Overview region-card addition

The default comparison Overview now starts with two source-backed region cards above Documented similarity, in the same order as the comparison globes. Each uses the original card palette, typography and 660px grid breakpoint. Cards have equal 360px heights, 160px fixed image frames using `object-fit: contain`, and independently scrolling details with thin themed scrollbars. Mobile cards stack in the same reading order.

Sites resolve from the active pair's `earthId` and `targetId`; image visuals bind by those IDs regardless of the display order. Each card is keyed by pair ID and site ID so loading-error and disclosure state cannot carry between pairs. Missing/broken images keep the frame and a cited imagery-source link when supplied. Location notes, credit, scale and citations are available in the Location and imagery sources disclosure. This is an intentional extension of the reference port; historical pixel-parity captures predate these cards.
