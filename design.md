# TerraTwin interface design

## Current UI contract

The frontend builds on the supplied TerraTwin Sites source at commit `19ce48affaf49194359a6b57a36b0d91f8882999`. The reference checkout used is `/tmp/terratwin-reference/.sites-checkout`; the destination is `/home/dell/Desktop/TerraTwin`. This source port supersedes the earlier locally recreated landing and explorer layouts.

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

The current release includes P01–P08. P01 remains Moderate terrain, Weak geology and Weak overall. P05–P07 are fully rated Moderate comparisons; P02–P04 and P08 have missing dimensions and stay unranked. The latter seven records come from an AI source desk screen and still need independent expert review. The world lists show ranked/total comparison counts, and the match selector and comparison heading distinguish ranked from incomplete evidence.

The HMP research-station marker and other approximate proxies remain context locators; derived or nearby coordinates are not presented as verified feature points. Planetary scene coordinates are not placed on the Earth map. Each compared site now has a sourced photo or orbital image; images that show a broader region carry a visible **Wider context view** label and caption explaining the scope. Detailed street imagery and scientific feature polygons are not synthesized from the globe textures.

## Verification

Matching source/destination screenshots and layout measurements for 390/768/1440px states are saved in `artifacts/reference-port/`. Static comparisons pause motion and use the same destination scientific payload in both apps. Browser interaction checks also exercise synthetic additional records without writing them to production data. See the review report there for concrete results and limitations.

## Overview region-card addition

The default comparison Overview now starts with two source-backed region cards above Documented similarity, in the same order as the comparison globes. Each uses the original card palette, typography and 660px grid breakpoint. Cards have equal 430px heights and 190px image frames. The full source image uses `object-fit: contain` over a soft, darkened fill from the same image, so portrait and panoramic sources retain their complete view without empty side bands. Details have roomier padding and independently scroll with thin themed scrollbars. Mobile cards stack in the same reading order.

The Evidence tab presents terrain and geology ratings, observations, scale notes and citations without repeating the Overview photos.

Sites resolve from the active pair's `earthId` and `targetId`; image visuals bind by those IDs regardless of the display order. Each card is keyed by pair ID and site ID so loading-error and disclosure state cannot carry between pairs. Missing/broken images keep the frame and a cited imagery-source link when supplied. The image scope and caption are visible on each card; the long locator appears once in the Location and imagery sources disclosure, alongside credit, scale, usage and citations. This is an intentional extension of the reference port; historical pixel-parity captures predate these cards.

## Local astronaut, layout and Method refresh

The current local design intentionally extends the reference port. All routes use one shared header with the Home brand label and consistent responsive dimensions. Explore and Method have fluid 24px desktop / 14px mobile gutters instead of a narrow content cap. World viewers stretch their existing globe/details cards to use the workspace. Back controls are labeled SVG icons.

Small original chibi astronaut SVGs drift through the background in cyan, off-white and lilac. They are decorative, have no pointer targets, and remain hidden from assistive technology. The same artwork appears in actual atlas-data and globe-texture loading states. Reduced-motion preferences stop the drift, waving, loader and interface animations.

Routes, site selection, comparison selection, evidence tabs and criteria navigation cross-fade through the View Transitions API where available. Unsupported browsers use immediate state updates with CSS entry/interaction feedback. No artificial loading delay is introduced.

Method presents every dataset criterion once in presentation categories: Terrain, Geology, Environment, Data quality, Field practice, and an Other fallback for new unclassified records. Category tabs and the criterion pager are accessible by keyboard. The source role, review rule, units/rating scale and readiness remain visible and unaltered. A subtle decorative contour motif echoes the supplied design reference while retaining the navy/cyan palette. Rating guidance, image credits and source registers share the explorer's translucent card treatment.

These updates originated on `ui_method_sources` and are integrated with the current photo-backed `main` on `codex/ui-method-sources-update`.

## Criteria illustrations, equation typography and sliding selection

Method criteria now use a two-column copy/illustration layout on desktop and stack at the mobile breakpoint. Every current criterion key has a distinct original SVG concept diagram appropriate to its subject; new unrecognized criteria receive a neutral evidence-record illustration. These are explicitly concept illustrations, not measurements or site evidence. The repeated contour decoration is removed from the active card.

The shared `SlidingTabs` indicator follows hover/focus/click through a 720ms transform and size transition. Pointer departure restores the selected tab, without changing scientific content on hover. Category and comparison tabs keep immediate semantic selection and CSS content entry; keyboard focus remains immediate. Reduced motion disables the indicator animation. Header navigation reuses the same component with a quieter underline treatment.

Previous/next navigation is grouped on the **left** of the criterion footer, with the category description on the other side. Source arithmetic rules are parsed for display into native MathML; fractions, roots, superscripts, sums and inverse tangent are typeset without evaluation. Original source text remains expandable. Unsupported or descriptive rules remain plain text. Neither scientific definitions nor ratings are modified.
