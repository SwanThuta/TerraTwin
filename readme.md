# TerraTwin

A planetary field atlas for exploring Earth, the Moon and Mars and reading source-backed comparisons of Earth analogs with planetary targets.

## Criteria visuals and sliding highlights

The Method card now uses a distinct vector concept diagram for every published criterion, occupying the right desktop column and stacking below the text on mobile. Previous/next controls are grouped on the left as requested. Six source rules render as native MathML with fractions, roots, powers, sums and inverse tangent; their original text remains available in an expandable disclosure. No frontend scoring or formula evaluation was added.

A continuous 720ms highlight follows hover, keyboard focus and selection in the criteria tabs, comparison tabs and header navigation. Pointer preview never changes the selected content; actual focus/selection stays responsive. Reduced motion moves the highlight immediately.

Verification and screenshots are in `artifacts/criteria-polish/`; the focused regression is `web/tests/criteria-polish.browser.cjs`. These additions originated on `ui_method_sources` and are integrated on `codex/ui-method-sources-update`.

The combined branch passed `npm --prefix web test`, `npm --prefix web run build`, and the `astronaut-refresh.browser.cjs`, `criteria-polish.browser.cjs`, `overview-regions.browser.cjs` and `multi-pair.browser.cjs` checks in Chrome. Python tests were not rerun for this merge because `pytest` is not installed in the current runtime; the Python files are unchanged from `main`.

## Local visual refresh

The visual refresh from `ui_method_sources` is integrated with the current `main` on `codex/ui-method-sources-update`. A shared header now has the same dimensions on Home, Explore and Method, and the workspace uses the viewport with responsive gutters. Small original SVG astronauts drift behind the content and appear while atlas data or globe textures load. State changes use short View Transitions where supported, with CSS entry/interaction feedback and reduced-motion support.

Method & sources now presents dataset criteria in category tabs with a paginated criterion deck, followed by the ordinal rating guide, imagery attribution and source cards. All criteria remain dataset-driven; grouping is presentational and does not change ratings or review roles. Card transparency is shared with the explorer. Back navigation uses accessible SVG icons.

Screenshots and verification notes: `artifacts/astronaut-refresh/`. The focused browser regression is `web/tests/astronaut-refresh.browser.cjs`; the frontend test suite includes criteria-group coverage.

## Frontend reference

The original frontend baseline was ported directly from the Sites source revision `19ce48affaf49194359a6b57a36b0d91f8882999`, the version of [TerraTwin Field Explorer](https://terratwin-field-explorer.dryhill3.chatgpt.site) specified in the frontend brief.

- Reference checkout used: `/tmp/terratwin-reference/.sites-checkout`.
- Destination: `/home/dell/Desktop/TerraTwin`.
- Entry point: `web/src/main.tsx`; active world/comparison/method screens: `web/src/ReviewedAtlas.tsx`.
- Directly retained: header/footer, Home composition, three-globe 2.5-second carousel, galaxy background, globe renderer and software fallback, full-width zoom, higher-resolution textures, typography, breakpoints and reference CSS.
- Integration changes: typed destination JSON loading, stable-ID relationships, one action per counterpart world, a compact selector only for multiple matches, and local handling of incomplete optional data. The single-pair layout has no match selector.

Older `MapPanel.tsx` and `LocatorFallback.tsx` files are retained but are not in the active route tree. The previous `App.tsx` and `Landing.tsx` route implementation has been replaced.

## Overview region cards

Comparisons now show both regions' images and details immediately in Overview, above Documented similarity. The cards follow globe order, use equal fixed image frames and scrolling details, and stack at the existing mobile breakpoint. The Evidence tab keeps the terrain and geology observations, scale notes and citations without repeating those photos. All 14 compared sites have source-backed photos or orbital views. A visible **Wider context view** label marks images that do not identify the exact selected feature. Captions, scale notes, credits and use terms come from `data/site-images.json`; the same validated visual record is used by the website and PDF. This is an intentional addition after the original reference-port comparison captures.

Targeted browser checks and screenshots are in `artifacts/overview-regions/`. To rerun with the local server running:

```bash
PLAYWRIGHT_CORE=/tmp/terratwin-browser/node_modules/playwright-core node web/tests/overview-regions.browser.cjs
```

The script uses real data for both directions and image loading, then test-only intercepted image/data responses for failed image loads and comparison-state resets. It does not change production data.

The current eight-pair export was also checked in Chrome with `web/tests/multi-pair.browser.cjs`. It opens the three Marius Hills comparisons, checks ranked and incomplete states from both search directions, and verifies each selected PDF is served. On Windows PowerShell with the local Vite server running:

```powershell
$env:PLAYWRIGHT_CORE='C:\Users\User\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\playwright-core'
$env:CHROME_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'
node web/tests/multi-pair.browser.cjs
```

## Run and verify

Root scripts forward to the existing Vite application in `web/`. Keep the versions in `.nvmrc`, `.python-version` and the dependency manifests. No framework or deployment configuration was replaced for this port.

```bash
npm --prefix web ci
npm run dev -- --host 127.0.0.1
npm run typecheck
npm --prefix web test
npm run build
```

The local app is served at `http://127.0.0.1:5173/`; the production build writes `web/dist/`. Routes are `#/`, `#/atlas`, `#/world/earth`, `#/world/moon`, `#/world/mars` and `#/method`. The reference also supports `#/atlas/<world>` aliases.

Python checks in this session use the pinned dependencies installed in `/tmp/terratwin-python`:

```bash
PYTHONPATH=/tmp/terratwin-python python3 -m pytest -q
```

For a fresh environment, install `pipeline/requirements.txt` into a virtual environment and run `python -m pytest -q` there. The existing obsolete `.venv` should not be relied on.

The current integration passed 19 Python tests with the bundled Python runtime and a temporary pytest installation, plus `npm --prefix web test`, `npm run build`, and the Chrome interaction script above. The temporary pytest files are not part of the repository.

## Backend and publishing data

This port preserves the destination backend, CSV research inputs, scientific rules, exporter, reports and deployment setup. It does not import the reference's demo datasets or terrain photographs.

The authoritative frontend endpoint in this checkout is **`/data/atlas.json`**. The reference used `/data/reviewed-atlas.json`; the destination uses its own existing export through `web/src/atlas.ts`. `VITE_ATLAS_URL` can select a different JSON endpoint at build time; external endpoints must allow the frontend origin through CORS.

Add stable feature IDs to `TerraTwin_Earth_Moon_Mars_Analog_Data_2026-11-14/locations.csv` and complete the related source, workflow, comparison-evidence and practice rows. The `load_dataset()` exporter joins `analog_pairs.csv` with the separate `pair_review_overrides.csv`, validates the two-dimension profile, source references and six workflow steps, and publishes reviewed records with their missing evidence intact. Unreviewed candidates remain outside the active frontend and rankings.

```bash
ATLAS_DATASET_VERSION=your-reviewed-release python3 -m pipeline.build
npm run build
```

Run that command in the Python environment described above. The exporter writes `data/processed/atlas.json`, `web/public/data/atlas.json` and the matching reports under `web/public/reports/`. Change the dataset version when updating published evidence. Deploy `web/dist/` through the existing deployment process after regeneration. New valid published records require **zero frontend source edits**.

The current release publishes P01–P08 from the supplied CSVs. P01 and P05–P07 have two rated dimensions and appear in rankings; P02–P04 and P08 retain missing dimensions and are unranked. P02–P08 are AI source desk screens requiring independent expert review. Both Moon and Mars worlds now have comparisons. The HMP research-station marker and other nearby or derived coordinates are shown only as labeled context anchors, not verified feature points; scene coordinates and conventions remain in the evidence. The ordinal scientific rules remain in `pipeline/models.py`.

For location image provenance and naming, see `data/site-images.json` and `web/public/site-images/README.md`. The images can be refreshed with `python -m pipeline.fetch_site_images` when network access is available. On this machine, the atlas was regenerated with `& 'C:\Users\User\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m pipeline.build`, then checked with 20 Python tests, `npm --prefix web test`, `npm --prefix web run build`, and the focused `overview-regions.browser.cjs` and `multi-pair.browser.cjs` browser checks. Each of the eight generated PDFs was checked for two embedded images and matching image source IDs.

## Reference comparison and interaction checks

Verification artifacts and reproducible Chrome scripts are in `artifacts/reference-port/`. Both apps were run locally using compatible installed runtime dependencies. Reference data requests were intercepted with the destination payload for the visual comparisons, separating UI differences from scientific release-content differences. Neither server's published data was changed by those comparisons.

The checks cover Home, world overview, selected site, all four comparison tabs and Method & sources at matching 390/768/1440px viewports. Source asset checksums, layout measurements, paired screenshots and pixel-comparison results are saved there. Interaction checks cover the real pair in both directions, carousel directions and 2.5-second timing, zoom/reset, keyboard tabs, empty Mars, test-only multiple matches and both counterpart worlds, missing optional data, software rendering and retryable fetch failure. Synthetic records remain in tests or intercepted browser responses.

Run the browser scripts with Chrome installed and `PLAYWRIGHT_CORE` pointing to an installed `playwright-core` module. For `compare.cjs`, serve the exact reference at port 5174 and the destination at 5173. The optional tooling used in this session lives in `/tmp/terratwin-browser` and is not a new application dependency.

## Current limits

Global textures and their higher-resolution layers provide orientation, not street/building coverage or verified terrain measurements. The 14 site images are visual context, not measurements or proof of a terrain match; the source manifest identifies feature and wider context views. No feature boundary is inferred from a context pin. Image rights should be reviewed for any commercial use, especially curated LROC imagery. The broader research leads still need expert review before publication. Vite emits an advisory warning for the Three.js bundle size.

See `agents.md`, `spec.md`, `design.md` and `todo.md` for the project contract and scientific delivery checklist.
