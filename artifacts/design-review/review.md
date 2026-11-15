# Real-data Design review

The last pulled repository revision `55f2c03` defines the research data and product behavior. The deployed design-reference site supplies only visual inspiration and decorative global imagery. Its demo volcanic sites, shortlists, numeric score profile, comparison workflow and site photographs have been removed from the active project.

## Data audit

- Runtime path: `TerraTwin_Earth_Moon_Mars_Analog_Data_2026-11-14/` → `pipeline/csv_loader.py` → `pipeline/models.py` → `pipeline/build.py` → `web/public/data/atlas.json` and the selected comparison PDF.
- The CSV package has eight research pairs, but the pre-design generator imports P01 only. This review preserves that published boundary; other pairs require their own integration/review.
- Published dataset: `csv-2026-11-14-p01`, two site records, one comparison, five referenced sources, sixteen criteria, two pair-specific similarity observations, and three possible practice objectives.
- Real P01: Haughton Site A / Locale 7 rocky carbonate ridge ↔ Shackleton–de Gerlache ridge rim NAC view. Terrain Moderate; geology Weak; overall Weak. The qualitative review/ordering profiles remain unchanged.
- Terrain and geology source IDs are R02/R03, resolved through the repository source register. Field-practice uses retain their evidence and limitations.
- The Earth marker is the HMP research station context reference, not a verified Locale 7 point. No lunar pin or exact footprint is fabricated. The PDF uses the same validated comparison.
- Site photos are unavailable in this dataset and remain explicitly pending. Landing NASA globe textures are visual orientation only.
- Mars has no published comparison in the current generator; the UI explicitly shows that empty state. Legacy `data/sites.json` is restored unchanged and remains unused by the CSV generator.
- Research CSVs, `data/`, `pipeline/`, `tests/`, generated public atlas JSON and the existing PDF match the pulled revision. No scientific data, ratings or tests were replaced to fit the visual reference.

## UI changes

- New responsive landing with all three independently rotatable globes, keyboard world navigation, rotation pause/play, navy/cyan galaxy styling, dataset-derived availability and a real-data featured pair.
- Original atlas workflow and Natural Earth / MapLibre map retained: both search directions, flat/globe controls, practice filters, synchronized comparison selection, sourced evidence, review notes and PDF.
- Result selection moves keyboard focus to the evidence. Missing-data and retry states are explicit. Map initialization/layer failure preserves real context coordinates and evidence.
- MapLibre loads on entering the atlas. Decorative Three.js is the only added rendering dependency; the scientific stack is unchanged.

## Verification

- `npm run build`: passed, including strict TypeScript. Vite retains large globe/map bundle warnings.
- `PYTHONPATH=/tmp/terratwin-python python3 -m pytest -q`: 14 passed, using the original science tests unchanged.
- `PYTHONPATH=/tmp/terratwin-python python3 -m unittest discover -s tests`: completed; zero tests discovered because the repository uses pytest functions.
- `git diff --check`: passed.
- Browser: desktop 1440×1000, mobile 390×844, and narrow 320×800; no page overflow or JavaScript exceptions in exercised flows.
- Both directions, practice filtering, flat/globe toggles, real P01 labels, Mars empty state/recovery, result-to-evidence focus, method/credits and successful PDF fetch passed.
- Forced no-WebGL: all three landing globes use the canvas fallback; keyboard Earth entry, coordinate map fallback, real evidence and PDF remain usable.
- Simulated atlas fetch failure: all three availability cards report unavailable data and Retry restores the real featured pair.
- Screenshots in this directory show the revised landing, original-style atlas and failure fallback. Previous dummy-data review captures are not included.

Local `Design` work only: no commit, push or deployment. Checks used Chrome software WebGL, Node 22.18.0 and Python 3.12. Physical touch and other browser/GPU combinations remain untested. No full similarity percentage, extra imported pair, or research image was invented for the redesign.

## Map visibility regression fixed

MapLibre’s lazily loaded stylesheet changed the old shared `.map-canvas.maplibregl-map` container to `position: relative`, giving it zero height. Chrome reproduced that zero-height layout. The map now owns a dedicated full-size child inside the absolute layout host, with a ResizeObserver and guarded initialization/cleanup. The original Natural Earth land style and actual CSV station coordinates remain unchanged.

The same bundled Natural Earth geometry is also rendered directly as an SVG map while the interactive renderer loads or if WebGL/workers fail. It supports real site selection, zoom, keyboard panning, attribution and interactive-map retry. The fallback does not depend on WebGL or a network basemap.

Verified after the fix: production build/typecheck, whitespace check, three fresh atlas loads, Flat/Globe switching, resizing from desktop to 390px, and forced no-WebGL geography/marker rendering. No JavaScript exceptions in the normal map flow. Research data/pipeline/tests and published evidence artifacts remain identical to the pulled baseline. Screenshots: `map-fixed-desktop.png` and `map-fallback-desktop.png`.
