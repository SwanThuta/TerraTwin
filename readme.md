# TerraTwin

This branch builds the CSV-backed atlas from the research package in [TerraTwin_Earth_Moon_Mars_Analog_Data_2026-11-14/README.md](TerraTwin_Earth_Moon_Mars_Analog_Data_2026-11-14/README.md). It reads the proposed pairs, review overrides, locations, sources, comparison criteria, workflows, comparison evidence, and practice objectives. `source.md` is supporting research documentation, not a build input; legacy `data/sites.json` is also unused. `pipeline/models.py` is the single source of truth for ratings, evidence coverage, and ranking.

## Current review coverage

All eight proposed comparisons are included in the generated atlas and have matching PDF reports. The separate [pair_review_overrides.csv](TerraTwin_Earth_Moon_Mars_Analog_Data_2026-11-14/pair_review_overrides.csv) preserves the original proposed-pair rows and records the AI source desk-screen:

| Pair(s) | Dimension ratings | Overall | Ranking |
| --- | --- | --- | --- |
| P01 | Moderate terrain / Weak geology | Weak | Eligible |
| P05-P07 | Moderate / Moderate | Moderate | Eligible |
| P03 | Weak terrain / geology not rated | Insufficient evidence | Not eligible |
| P02, P04, P08 | Neither dimension rated | Insufficient evidence | Not eligible |

These are AI source desk-screens, not independent expert or field reviews. No comparison meets the Strong threshold. Null means missing or insufficient evidence, never a zero score. Missing images, matched feature footprints, and validated raster measurements remain explicit gaps; P08 is process context rather than a scored terrain comparison.

## Approximate map points

The research package now fills ten previously blank feature-coordinate pairs with clearly labeled approximate references. They reuse source-located camp, parking, lake, river, canyon, image, valley, crater, or DTM points; the Haughton Locale 7 estimate is calculated from the reported roughly 2 km northwest offset using an assumed bearing. These are useful for map orientation only and do not establish feature boundaries, rover routes, or DEM footprints. See `feature_coordinates_status` and `coordinate_note` in [locations.csv](TerraTwin_Earth_Moon_Mars_Analog_Data_2026-11-14/locations.csv); the map labels approximate points accordingly.

## Run locally

The existing workspace virtual environment was used successfully for the Python build and tests:

```powershell
& .\.venv\Scripts\python.exe -m pipeline.build
& .\.venv\Scripts\python.exe -m pytest -q -p no:cacheprovider
& .\.venv\Scripts\python.exe TerraTwin_Earth_Moon_Mars_Analog_Data_2026-11-14\validate.py
```

From `web/`, run the frontend:

```powershell
npm.cmd run dev -- --host 127.0.0.1
npm.cmd run build
```

The Python build generates `data/processed/atlas.json`, `web/public/data/atlas.json`, and one evidence report per comparison under `web/public/reports/`. The website and PDFs consume the same validated dataset records. The package CSV validator, Python test suite, and frontend production build/typecheck passed in the current workspace. This workspace uses Python 3.13.0 and Node.js 24.19.0 (npm 11.17.0); the exact versions pinned in `spec.md` have not been verified here. Vite reports an existing large MapLibre bundle warning.

## Project files

- [spec.md](spec.md): product and scientific contract.
- [design.md](design.md): interface contract.
- [todo.md](todo.md): delivery checklist and remaining work.
- [source.md](source.md): source review, pair rationale, evidence gaps, and boundaries.
- [pipeline/csv_loader.py](pipeline/csv_loader.py): CSV joins, review overrides, and coordinate handling.
- [pipeline/models.py](pipeline/models.py): validation, rating, coverage, and ranking rules.
- [pipeline/build.py](pipeline/build.py): atlas and PDF generation.
- [tests/test_science.py](tests/test_science.py): scientific rules and generated-artifact consistency checks.
- [web/src/App.tsx](web/src/App.tsx): search and comparison interface.

Remaining work includes independent expert review, imagery with verified scale and attribution, stronger feature-specific evidence for unscored dimensions, bounded candidate discovery, and focused UI interaction/accessibility checks. Read [agents.md](agents.md) before changing product or scientific behavior.
