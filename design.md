# TerraTwin interface design

Status: P01-only CSV preview on `codex/csv-dimensions-one-pair`; imagery, the remaining CSV pairs and broader discovery remain pending.

## Visual direction

Use a dark navy planetary atlas with cyan accents for navigation and evidence, restrained orange for weak matches, and clear typography. The landing page introduces Earth, Moon, and Mars and opens the atlas for a selected planetary body. The current planet illustration is CSS only; it is not terrain evidence.

## Atlas flow

- Offer Planet → Earth and Earth → Planet search, with body, target, Earth site, and practice-objective controls as applicable.
- Show a result list, an Earth locator map, and the selected pair's evidence on the same page. Reviewed results follow the versioned terrain-first order. Sourced candidates remain visibly outside that ranking.
- The Earth locator supports flat and globe projection. Its points are regional locators, not surveyed feature footprints. The bundled Natural Earth land layer works without a basemap account or API key and carries attribution.
- Keep the selected comparison and map marker synchronized. Enable the two-Earth-site selector only when a planetary target has at least two comparison records; each side reuses its own evidence and PDF.
- Keep responsive controls and evidence cards usable on narrow screens. Loading, failed-data, empty-filter, and unavailable-map states must explain what remains usable.

## Comparison evidence

- Name both reviewed features and their source locators. Show the CSV's C01 Named landform and subfeatures and C02 Surface material / deposit classes as Strong, Moderate, Weak, or Not rated, with cited evidence, differences, and missing-review reasons. The Method page lists the remaining CSV criteria with readiness and does not treat unavailable metrics as scores.
- Show evidence coverage as a percentage and keep the qualitative dimension bands in the expandable evidence section. An analog match percentage requires normalized measurements and a documented formula in the input CSV; coverage is not similarity or confidence.
- Show sourced practice possibilities separately from ratings, followed by analogy limits. Practice filters do not alter the rating.
- Show Earth and planetary image cards with credit, source link, and published scale information. Until rights, files, and georeferencing are checked, show explicit image-pending cards. Never imply that unmatched source images share a displayed scale.
- Include a PDF download for the selected pair. Generate its content from the same validated record as the page.

## Current dataset boundary

P01 is the only imported pair: the CSV's dated Haughton Locale 7 ↔ Shackleton rim desk screening gives terrain Moderate, geology Weak, overall Weak. The HMP research station is a context marker, not a Locale 7 point. The preview shows two pair-specific similarity statements and three possible practice uses from the evidence CSV, each with sources and limitations. Mars search is empty in this preview. No route safety or permanent-base suitability follows from P01. Image assets will be supplied later.

## Follow-on design work

Add source-permitted georeferenced terrain imagery and scale bars after the images arrive. Expand to more reviewed sites, a reproducible bounded candidate search, and a usable two-Earth-site comparison when the underlying evidence exists. Detailed planetary globes, animations, and numeric similarity bars from the earlier reference design are outside the current qualitative scope.
