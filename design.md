# TerraTwin interface design

Status: the atlas contains all eight CSV-backed comparisons. P01 and P05-P07 have two rated dimensions and are rank-eligible; P03 is Weak terrain with geology not rated; P02, P04, and P08 are unscored and unranked. P02-P08 are AI source desk-screens, not independent expert reviews. Imagery, verified raster measurements, and broader candidate discovery remain pending.

## Visual direction

Use a dark navy planetary atlas with cyan accents for navigation and evidence, restrained orange for weak matches, and clear typography. The landing page introduces Earth, Moon, and Mars and opens the atlas for a selected planetary body. The current planet illustration is CSS only; it is not terrain evidence.

## Atlas flow

- Offer Planet → Earth and Earth → Planet search, with body, target, Earth site, and practice-objective controls as applicable.
- Show a result list, an Earth locator map, and the selected pair's evidence on the same page. Reviewed results follow the versioned terrain-first order. Sourced candidates remain visibly outside that ranking.
- The Earth locator supports flat and globe projection. Each point's tooltip identifies source-located versus approximate reference coordinates; approximate points are never presented as surveyed feature footprints. The bundled Natural Earth land layer works without a basemap account or API key and carries attribution.
- Keep the selected comparison and map marker synchronized. Enable the two-Earth-site selector only when a planetary target has at least two comparison records; each side reuses its own evidence and PDF.
- Keep responsive controls and evidence cards usable on narrow screens. Loading, failed-data, empty-filter, and unavailable-map states must explain what remains usable.

## Comparison evidence

- Name both reviewed features and their source locators. Show the CSV's C01 Named landform and subfeatures and C02 Surface material / deposit classes as Strong, Moderate, Weak, or Not rated, with cited evidence, differences, and missing-review reasons. The Method page lists the remaining CSV criteria with readiness and does not treat unavailable metrics as scores.
- Show the fixed overall qualitative label, evidence completeness as a count of supported dimensions, review state, versioned method, and explanation source links. A count is not a similarity percentage or confidence estimate.
- Show sourced practice possibilities separately from ratings, followed by analogy limits. Practice filters do not alter the rating.
- Show Earth and planetary image cards with credit, source link, and published scale information. Until rights, files, and georeferencing are checked, show explicit image-pending cards. Never imply that unmatched source images share a displayed scale.
- Include a PDF download for the selected pair. Generate its content from the same validated record as the page.

## Current dataset boundary

All eight proposed pairs are imported. The CSV's dated Haughton Locale 7 ↔ Shackleton rim screening remains Moderate terrain / Weak geology / Weak overall; the HMP research station is a context marker, not a Locale 7 point. The new AI desk-screen layer rates P05-P07 Moderate/Moderate, gives P03 a Weak terrain rating with geology unscored, and leaves P02/P04/P08 unscored where evidence is insufficient. Pair-specific evidence and possible practice uses appear with sources and limitations. No route safety or permanent-base suitability follows from these comparisons. Image assets and independent expert review remain pending.

## Follow-on design work

Add source-permitted georeferenced terrain imagery and scale bars after the images arrive. Obtain independent expert review and feature-specific evidence for currently unscored dimensions; add a reproducible bounded candidate search and verify the two-Earth-site interaction against the underlying evidence. Detailed planetary globes, animations, and numeric similarity bars from the earlier reference design are outside the current qualitative scope.
