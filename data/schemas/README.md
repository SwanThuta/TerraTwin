# First-slice data contract

The editable record is [`data/sites.json`](../sites.json). [`pipeline/models.py`](../../pipeline/models.py) is its executable schema and the only implementation of the qualitative rating and ranking rules. Run `python -m pipeline.build` after editing the record; the generated atlas in `data/processed/` and `web/public/data/` must agree.

- `sources` gives stable IDs, original links, providers, precise locators, and access dates. Claims cite those IDs. The research notes in [`source.md`](../../source.md) hold the longer claim boundaries and rights notes.
- `sites` names the bounded reviewed feature and source locator. Earth `mapPoint` uses `[longitude, latitude]` for orientation only, with a `mapPointKind` and coordinate source. Planetary `mapPoint` is null because it is never placed on the Earth map.
- `comparisons` holds pair-specific terrain and geology evidence, differences, ratings or null plus missing reason, sources, review metadata, practice tags, limits, and image metadata. P01 is reviewed; P07 is an unreviewed candidate.
- `visuals` uses `localPath: null` and a reason until an image is cleared and imported. A future local path must be within the web public directory and must retain its source ID, credit, and scale. Published source-image scale is not automatically a display scale bar.
- Generated fields include `overall`, `coverage`, `rankEligible`, `rankOrder`, `explanation`, `explanationSourceIds`, and a dataset-versioned `reportPath`. Do not edit generated files by hand.

The first slice contains no numeric observations or automated search runs. When those are added, extend this schema with units, measurement method and quality notes, or bounded search inputs and output IDs, before presenting the results as scientific evidence.
