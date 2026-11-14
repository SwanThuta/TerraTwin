# TerraTwin

TerraTwin is an Earth analog explorer for Moon and Mars field-practice research. This branch contains a working P01/P07 first slice with qualitative evidence, an offline Earth locator, and matching evidence PDFs. It has no user accounts, database, or model API requirement.

## Current evidence

- **P01:** Haughton Crater Locale 7 ↔ Shackleton rim. Reviewed desk screening: terrain Moderate, geology Weak, overall Weak.
- **P07:** Copper Canyon Fan ↔ Peace Vallis Fan. Sourced candidate with no completed pair review: terrain and geology unrated, overall Insufficient evidence, excluded from ranking.
- Earth markers are regional locators, not verified feature polygons. Terrain images have not been imported; the app shows source links, published scale information, credit, and a missing-image reason.

These are heuristic research labels, not measured similarity percentages, route-safety findings, or field-access approvals.

## Run locally

The team version baseline is recorded in [.nvmrc](.nvmrc), [.python-version](.python-version), and [spec.md](spec.md). The build was verified here with Node.js 24.19.0 and Python 3.12.4; exact pinned runtimes 24.22.3 and 3.14.10 remain to be checked.

From the repository root in PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r pipeline\requirements.txt
.\.venv\Scripts\python.exe -m pipeline.build
.\.venv\Scripts\python.exe -m pytest -q
```

From `web/`:

```powershell
npm ci
npm run dev -- --host 127.0.0.1
npm run build
```

The generator validates [data/sites.json](data/sites.json) and writes the same JSON to `data/processed/atlas.json` and `web/public/data/atlas.json`, plus one PDF per comparison in `web/public/reports/`. Run it after changing source data. The web app consumes only those generated public files. The Natural Earth land layer is bundled in `web/public/maps/` with attribution; no basemap key is needed.

## Repository guide

- [spec.md](spec.md): product, science, data, and acceptance contract.
- [design.md](design.md): current qualitative atlas interface contract.
- [source.md](source.md): P01/P07 research notes and source register.
- [todo.md](todo.md): team ownership and verified work checklist.
- [pipeline/models.py](pipeline/models.py): validated records, rating rule, coverage, ranking, and explanations.
- [pipeline/build.py](pipeline/build.py): static atlas and PDF generation.
- [web/src/App.tsx](web/src/App.tsx): search and comparison interface.
- [web/src/MapPanel.tsx](web/src/MapPanel.tsx): flat/globe Earth locator.
- [tests/test_science.py](tests/test_science.py): high-impact scientific behavior checks.

The first slice still needs permitted and georeferenced image imports, a reviewed P07 rating, more sites for two-Earth comparison, and a reproducible bounded candidate search. Large rasters stay outside Git. Read [agents.md](agents.md) before changing product or scientific behavior.
