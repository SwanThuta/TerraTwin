# TerraTwin interface design

Status: P01/P07 first slice implemented on `codex/build-p01-p07`; imagery and broader discovery remain pending.

## Visual direction

Use a dark navy planetary atlas with cyan accents for navigation and evidence, restrained orange for weak matches, and clear typography. The landing page introduces Earth, Moon, and Mars and opens the atlas for a selected planetary body. The current planet illustration is CSS only; it is not terrain evidence.

## Atlas flow

- Offer Planet → Earth and Earth → Planet search, with body, target, Earth site, and practice-objective controls as applicable.
- Show a result list, an Earth locator map, and the selected pair's evidence on the same page. Reviewed results follow the versioned terrain-first order. Sourced candidates remain visibly outside that ranking.
- The Earth locator supports flat and globe projection. Its points are regional locators, not surveyed feature footprints. The bundled Natural Earth land layer works without a basemap account or API key and carries attribution.
- Keep the selected comparison and map marker synchronized. Enable the two-Earth-site selector only when a planetary target has at least two comparison records; each side reuses its own evidence and PDF.
- Keep responsive controls and evidence cards usable on narrow screens. Loading, failed-data, empty-filter, and unavailable-map states must explain what remains usable.

## Comparison evidence

- Name both reviewed features and their source locators. Show terrain and geology as Strong, Moderate, Weak, or Not rated, with cited evidence, differences, and missing-review reasons.
- Show the fixed overall qualitative label, evidence completeness as a count of supported dimensions, review state, versioned method, and explanation source links. A count is not a similarity percentage or confidence estimate.
- Show sourced practice possibilities separately from ratings, followed by analogy limits. Practice filters do not alter the rating.
- Show Earth and planetary image cards with credit, source link, and published scale information. Until rights, files, and georeferencing are checked, show explicit image-pending cards. Never imply that unmatched source images share a displayed scale.
- Include a PDF download for the selected pair. Generate its content from the same validated record as the page.

## Current dataset boundary

P01 is a reviewed Haughton Locale 7 ↔ Shackleton rim desk screening: terrain Moderate, geology Weak, overall Weak. P07 is a sourced Copper Canyon Fan ↔ Peace Vallis Fan candidate: both dimensions are unrated and the overall status is Insufficient evidence. Neither record supports route safety or permanent-base suitability. Image assets will be supplied later.

## Follow-on design work

Add source-permitted georeferenced terrain imagery and scale bars after the images arrive. Expand to more reviewed sites, a reproducible bounded candidate search, and a usable two-Earth-site comparison when the underlying evidence exists. Detailed planetary globes, animations, and numeric similarity bars from the earlier reference design are outside the current qualitative scope.
