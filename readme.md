# TerraTwin

This branch is a one-pair preview of the new CSV-backed atlas. The build reads `analog_pairs.csv`, `locations.csv`, `sources.csv`, `comparison_criteria.csv`, `location_workflows.csv`, `comparison_evidence.csv`, and `practice_objectives.csv` from [the new research package](TerraTwin_Earth_Moon_Mars_Analog_Data_2026-11-14/README.md). `source.md` and the legacy `data/sites.json` are not build inputs. The supplied package also contains reference scoring scripts; the app uses only `pipeline/models.py` to calculate its rating and ranking.

## Preview boundary

Only **P01**, Haughton Site A / Locale 7 ↔ Shackleton rim, is published in this slice. The CSV's dated desk screening rates terrain **Moderate** and geology **Weak**, giving an overall **Weak** qualitative label. C01 (named landform and subfeatures) and C02 (surface material / deposit classes) are the two scored dimensions. The other CSV criteria are shown on the Method & sources page with their readiness; they are not silently turned into scores. In particular, no validated raster measurements are supplied. The HMP research station marker is explicitly a context reference, not a Locale 7 feature point.

The new evidence CSV gives P01 two documented similarity statements and three possible practice objectives, each with source IDs and limitations. These additions make the comparison explainable without changing its Moderate terrain / Weak geology ratings. Images are pending. The other seven pairs are not imported yet, and Mars search has an empty state.

## Run locally

The existing `.venv` in this workspace points at a removed Python installation. The following build and test commands were run successfully here with the bundled Python 3.12.14 and the existing `.venv` packages:

```powershell
& 'C:\Users\User\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m pipeline.build
$env:PYTHONPATH=(Resolve-Path '.venv\Lib\site-packages').Path
& 'C:\Users\User\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m pytest -q -p no:cacheprovider
```

For a fresh environment, use the versions in `.python-version` and `pipeline/requirements.txt`, then run `python -m pipeline.build` and `python -m pytest -q`. This branch has not yet been checked with the exact pinned Python runtime.

From `web/`:

```powershell
npm.cmd run dev -- --host 127.0.0.1
npm.cmd run build
```

The generator writes `data/processed/atlas.json`, `web/public/data/atlas.json`, and the matching P01 PDF in `web/public/reports/`. The website and PDF use the same validated comparison record. The frontend build passed with Node.js 24.19.0 and npm 11.17.0; exact pinned Node.js 24.22.3 remains to be checked. Vite reported its existing large MapLibre bundle warning.

The supplied package's `validate.py` also passed its 18-location, eight-pair, 48-workflow-step cross-check. That check does not mean the other seven pairs are reviewed or imported into this preview.

## Project files

- [spec.md](spec.md): product and scientific contract, with this preview boundary.
- [design.md](design.md): interface contract.
- [todo.md](todo.md): delivery checklist.
- [pipeline/csv_loader.py](pipeline/csv_loader.py): P01 CSV joins and coordinate handling.
- [TerraTwin_Earth_Moon_Mars_Analog_Data_2026-11-14/comparison_evidence.csv](TerraTwin_Earth_Moon_Mars_Analog_Data_2026-11-14/comparison_evidence.csv): pair-specific similarity statements and limits.
- [TerraTwin_Earth_Moon_Mars_Analog_Data_2026-11-14/practice_objectives.csv](TerraTwin_Earth_Moon_Mars_Analog_Data_2026-11-14/practice_objectives.csv): possible practice uses with evidence and caveats.
- [pipeline/models.py](pipeline/models.py): validation and ordinal rating.
- [pipeline/build.py](pipeline/build.py): atlas and PDF generation.
- [web/src/App.tsx](web/src/App.tsx): search and comparison interface.
- [tests/test_science.py](tests/test_science.py): scientific and artifact checks.

The remaining CSV pairs, per-tag evidence, source-permitted terrain imagery, and bounded candidate discovery remain to be integrated. Read [agents.md](agents.md) before changing product or scientific behavior.
