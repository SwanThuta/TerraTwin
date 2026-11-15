# Exact-reference frontend port

Reference source: `/tmp/terratwin-reference/.sites-checkout`, commit `19ce48affaf49194359a6b57a36b0d91f8882999`, retrieved through the connected Sites account for https://terratwin-field-explorer.dryhill3.chatgpt.site.

Destination: `/home/dell/Desktop/TerraTwin`. Local preview: http://127.0.0.1:5173/.

## Implementation

The active route tree is copied from the reference: `main.tsx`, `ReviewedAtlas.tsx`, `Globe.tsx`, `Space.tsx`, `bodies.ts`, `softwareGlobe.ts`, and `style.css`. The entry point, supporting render files, favicon, galaxy images and all global/detail textures are retained byte-for-byte; the globe's type-only import points to `globeTypes.ts` to avoid colliding with the destination loader. Reference CSS is preserved in full, with only small multi-match selector rules appended. No source hosting manifest, deployment configuration, reference dataset or demo site photos were imported.

`ReviewedAtlas.tsx` adapts the reference UI to the typed destination loader, stable-ID matching, one action per counterpart world, complete deduplicated citations, optional-field handling, safe report URLs and a compact multi-match picker. The one-pair layout omits the picker. Scientific labels, ratings, reviewed coverage, locators and practices remain destination data.

## Data publication

The destination endpoint is `/data/atlas.json`, configurable through `VITE_ATLAS_URL`. The destination's current CSV exporter, research inputs and rating implementation were not changed by this port. Add fully reviewed and validated records through the existing CSV workflow, regenerate JSON/PDF with a new `ATLAS_DATASET_VERSION`, then rebuild/deploy `web/dist`. No frontend source edit is required for new valid records. See `readme.md` for commands.

## Verification

- Production build and typecheck passed; Vite retains an advisory large-bundle warning.
- Five frontend data tests passed, including explicit backend ordering, stable fallback, both relationship directions, multiple worlds, null visuals, partial metadata, unreviewed exclusion and broken references.
- Sixteen Python scientific/export tests passed.
- Reference and destination were run side by side locally. Equivalent paused states were captured at 390/768/1440px: Home, world overview, selected site, Overview, Evidence, Field practice, Sources, and Method & sources. `layout-results.json` records identical sampled geometry, font, text/background colors and border radii for all 24 states. No horizontal overflow was detected in those views.
- For the comparison captures, reference JSON requests were intercepted with the destination's actual payload. This isolates appearance from differences in research-release text without editing either dataset. `pixel-results.json` contains pixel-level measurements: 19 of 24 pairs are pixel-identical, with a maximum mean channel difference of 0.001101 out of 255 in the remaining pairs. Paired screenshots are named by width, state and reference/destination.
- Chrome interaction checks passed: both carousel directions and 2.5-second timing, stable body slots, globe click-through, zoom fill/reset, one-pair controls, both real search directions, close preserving site selection, keyboard tabs, empty Mars, touch selection, synthetic multi-match switching, one Earth site linked to both Moon and Mars, missing evidence/imagery/report, software globe fallback, keyboard marker preview, retry after HTTP 503 and a zero-record payload.

## Remaining differences and limits

The scientific content comes from the destination export, so longer evidence text may differ from the live reference's release. Multi-match controls appear only when additional published matches exist. Missing-source and missing-field messages appear only for incomplete records. Some screenshot pairs show tiny background rasterization differences despite identical measured layouts; the pixel-results file quantifies them. No layout, typography or control-placement mismatch was observed in the sampled one-pair states.

The comparison globes retain the reference's own responsive grid behavior, including its compact two-column mobile globe row; the wider world/details grid stacks at the reference breakpoint. This was deliberately preserved instead of introducing a new layout.

Global detail textures are not street/building maps or scientific terrain measurements. Current pair images remain unavailable. Lunar scene coordinates remain in source disclosures; no verified feature coordinate or feature polygon was fabricated. Physical-device pinch testing was not performed; the original reference pinch implementation is retained. The reference preview server is temporary and is stopped after comparisons; the destination development server remains available.
