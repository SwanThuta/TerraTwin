# TerraTwin specification

Status: agreed product direction; implementation has not started.

## Purpose

Build an interactive web app that helps teams find Earth locations with terrain comparable to Moon and Mars exploration sites, so they can identify places for relevant field practice before a mission. Geological evidence helps explain the terrain match. Explain the evidence for each analogy, which field tasks it might support, and where the analogy breaks down. Priorities, in order: scientific credibility, terrain relevance for practice, visual impact, discovering unexpected locations, ease of use.

The team has six beginner-to-intermediate software developers familiar with React/Next.js, JavaScript/TypeScript, and Python. The hackathon lasts a little over 24 hours. The scope and quantities below are proposed implementation defaults, not verified scientific findings.

## Core experience

1. Choose Moon or Mars, then a target from a fixed list; see ranked Earth analogs.
2. Alternatively, choose an Earth site and see relevant Moon and Mars targets.
3. Explore Earth results in a 2D map or 3D globe, preserving selection when switching.
4. Open a comparison with a qualitative terrain-and-geology rating, source links, missing evidence, limitations, and evidence-grounded field-practice uses.
5. Inspect how the selected rating was made: the reviewed site features, source evidence, rubric decisions, and method version. Download a PDF report for that selected Earth–planetary pair.
6. Read an explanation generated from structured comparison evidence. Connect a model API later; explanations must work without it.
7. Inspect a small set of additional Earth candidates identified through an automated, reproducible search within a bounded region or candidate pool.
8. View sourced Earth and planetary terrain images together, explore evidence-backed practice objective tags, and compare two Earth sites against the same planetary target.

Users do not adjust the rating rubric. No chatbot is required. The app has no user accounts or sign-in flow. Paid services and API keys are deferred.

## Delivery boundaries

The curated comparison workflow is the first milestone. Aim for 8–12 Earth sites, two lunar targets, and two Martian targets; reduce counts if source and image verification require more time. Get one sourced pair working first, then add a second Earth site for the same target to prove the two-site view. Keep automated candidate search as a required second milestone, bounded enough to finish during the hackathon. Do not describe a finite candidate search as global discovery.

Example research leads include Atacama, Haughton Crater, volcanic fields, polar terrain, and less familiar arid regions. Possible planetary leads include lunar south-polar regions and Martian crater or volcanic environments. Validate specific targets and measurements before adding them. Known analogs provide reference cases; additional candidates are hypotheses requiring review.

## Recommended architecture

| Area | Decision | Reason |
| --- | --- | --- |
| Frontend | React + TypeScript + Vite | Familiar tools and a static deployment path |
| Styling | CSS with shared variables and simple components | Keep styling easy to understand and coordinate |
| Maps | MapLibre GL JS, with flat and globe projections | Share one mapping engine and selection state |
| Data preparation | Python scripts; add NumPy/Pandas when useful | Prepare measurements and comparisons before the demo |
| Storage | Versioned JSON/GeoJSON with a documented schema | Small, inspectable data; no database setup |
| Validation | Pydantic during Python preprocessing | Reject inconsistent records before publishing assets |
| Tests | Pytest for scientific logic; frontend typecheck/build and focused interaction checks | Verify the parts that can undermine the result |
| Reports | Python-generated PDF for each comparison | Download the selected pair's evidence and method without a runtime API |
| Optional API | FastAPI when external model or data integration begins | Keep credentials and provider calls on the server |

### Shared toolchain and package versions

Use this baseline for the first implementation. These are exact versions, checked against the publishers' release pages on 2026-11-14; they are a team agreement, not a claim that the stack has been installed or tested in this repository.

| Role | Version |
| --- | --- |
| Node.js runtime | 24.22.3 LTS |
| npm package manager | 11.17.0 |
| Python runtime | 3.14.10 |
| React and React DOM | 19.3.1 each |
| TypeScript | 7.0.2 |
| Vite | 8.3.8 |
| `@vitejs/plugin-react` | 6.3.0 |
| MapLibre GL JS (`maplibre-gl`) | 6.16.0 |
| Pydantic | 2.14.3 |
| Pytest | 9.2.0 |
| ReportLab (PDF generation) | 5.1.0 |
| Optional NumPy, if needed | 2.5.4 |
| Optional Pandas, if needed | 3.1.1 |
| Later FastAPI service, if added | 0.162.6 |

The runtime versions are recorded in `.nvmrc` and `.python-version`. When scaffolding, put exact package versions in `web/package.json` (no `^`, `~`, or `latest`) and commit `web/package-lock.json`. Put exact Python dependencies in the pipeline's dependency file; if transitive Python dependencies are used, commit a reproducible lockfile too. Use `npm ci` for installs after the lockfile exists. Member 1 owns frontend dependency changes; member 4 owns Python dependency changes. Coordinate upgrades through one reviewed change that updates this table, the manifests, and lockfiles together. Do not silently change versions on individual branches.

Version references: [Node.js 24.22.3](https://nodejs.org/en/blog/release/v24.22.3/), [Python 3.14.10](https://www.python.org/downloads/release/python-31410/), [npm React](https://www.npmjs.com/package/react), [npm React DOM](https://www.npmjs.com/package/react-dom), [npm TypeScript](https://www.npmjs.com/package/typescript), [npm Vite](https://www.npmjs.com/package/vite), [npm React plugin](https://www.npmjs.com/package/%40vitejs/plugin-react), [npm MapLibre](https://www.npmjs.com/package/maplibre-gl), [PyPI Pydantic](https://pypi.org/project/pydantic/), [PyPI Pytest](https://pypi.org/project/pytest/), [PyPI ReportLab](https://pypi.org/project/reportlab/), [PyPI NumPy](https://pypi.org/project/numpy/), [PyPI Pandas](https://pypi.org/project/pandas/), [PyPI FastAPI](https://pypi.org/project/fastapi/).

A runtime Python server is not required for the first demo. Precompute comparisons and their PDFs in Python and serve both as static assets to the frontend, keeping one authoritative rating implementation. Do not add Next.js alongside Vite.

Verify that the selected MapLibre release supports the intended projection switching before committing the map implementation. The initial globe represents Earth; show Moon and Mars targets in a selector and comparison panel. Separate planetary globes and detailed 3D terrain are outside the first version. Basemap imagery is a separate service dependency: verify terms, attribution, quotas, and key requirements. Provide markers on a plain background and a usable results list if tiles fail.

## Scientific comparison

The first rating profile has two dimensions: terrain/landform and geology/surface materials. Terrain is the primary match for field practice; geology helps distinguish surfaces that may look similar but have different material evidence. Show thermal conditions, water/ice, and dryness as contextual observations when sourced, without using them to set the rating. Gravity, atmosphere/vacuum, and radiation are analogy limits, not rating criteria.

Rate a named, bounded feature on each body rather than an entire region. Record a locator (coordinates, map unit, image footprint, or a cited figure) that lets another reviewer identify the feature. Exact equal-area polygons and DEM downloads are optional for this qualitative profile. If numeric observations such as slope or roughness are available, show their units, acquisition period, spatial resolution, processing method, and quality notes, but use them in a rating only when their scales and meanings are comparable. If temperature is shown as context, distinguish surface from air temperature. Absolute elevation against different planetary datums is not a direct similarity measure.

Use rubric **`terrain-geology-qual-v1`** for **each** dimension. This is a team screening judgment, not a measured percentage:

- **Strong:** specific features on both bodies are identified and cited; sources document closely corresponding landforms and visible subfeatures (terrain), or corresponding deposit/material classes (geology), at a scale meaningful for the stated field-practice use. Relevant differences are recorded.
- **Moderate:** sources document the same broad landform or material/process family on both bodies, but feature details, material interpretation, or scale differ or remain uncertain. Record the uncertainty.
- **Weak:** both features are identified, but sourced differences materially limit the proposed terrain or geology analogy. State the differences.
- **Insufficient evidence:** one feature is not identified at the stated scope, the supporting sources do not apply to it, or available evidence cannot support a comparison. Store a null dimension rating and the reason; do not turn missing evidence into Weak.

The overall rating is **Strong** only when both dimensions are Strong; **Moderate** when both are at least Moderate and at least one is Moderate; **Weak** when both dimensions are rated and either is Weak; and **Insufficient evidence** when either dimension is null. This is an explicit ordinal rule, not a weighted average. Display terrain and geology ratings with their evidence and rationale, so the overall label does not hide a weak dimension. Do not invent similarity percentages from descriptive text.

Only reviewed comparisons with both dimensions rated enter ranked results. Sort first by terrain rating (Strong, Moderate, Weak), then geology rating in the same order, then stable site ID. This **`terrain-first-v1`** ordering is a product choice and may place two comparisons with the same overall label in a documented order. Show insufficient-evidence and unreviewed candidates separately. Display evidence completeness as `0/2`, `1/2`, or `2/2 dimensions supported`; it measures coverage of the rubric, not confidence or correctness. Keep the review status separate from this count. Version the rubric, review criteria, and ordering rule.

For reverse search, order compatible planetary targets for the selected Earth site and show the rubric version used. Separate targets when their feature scope or rating profile differs; their labels are not automatically equivalent.

Present terrain evidence first, then geology and other sourced context. Suggest practice tasks only when the selected comparison supports them, such as terrain traversal, geological observation, sampling procedures, or instrument trials. These are possibilities to assess, not approved training plans. Always explain relevant analogy limits: gravity, atmosphere/vacuum, radiation, biology, scale, and seasonality as applicable. A terrain or geological match does not establish thermal suitability or safety for a permanent base.

## Data contract

- `Site`: stable ID, name, body (`earth`, `moon`, `mars`), latitude/longitude, coordinate convention, study footprint/scale, description, evidence IDs, curated/candidate status, review status.
- `Observation`: ID, site ID, observed feature or optional numeric/categorical value, unit when applicable, time range, spatial resolution or map scale when known, method, input record/file locator, uncertainty/quality note, source ID. Missing values are explicit nulls with a reason.
- `Source`: ID, agency/provider, title, original URL, dataset/product identifier and version when available, access date, license/attribution, retrieval/query notes, and local input checksum when applicable.
- `VisualAsset`: stable ID, site ID, image type, original URL or permitted local path, source ID, footprint or field of view, spatial resolution/display scale, acquisition date when known, processing notes, and license/attribution.
- `Comparison`: stable ID, Earth ID, planetary target ID, rubric/ordering version, reviewed feature locators, terrain and geology ratings or null with evidence references and rationale, missing reasons, evidence completeness, overall rating, review/rank eligibility, limitations, evidence-backed practice objective IDs and supporting evidence references, visual asset IDs, and report asset path.
- `Explanation`: comparison ID, text, evidence references, generation mode (`template` or later `model`), and generation version.
- `SearchRun`: region/candidate-pool definition, input source versions, extraction method, filters, screening/rubric version, output IDs, run time, and review notes.

GeoJSON Earth coordinates use `[longitude, latitude]`. Planetary coordinates must explicitly identify body, longitude direction/range, and latitude convention. Never place planetary coordinates on the Earth map.

## Comparison provenance and PDF report

For each selected pair, show a readable “How this comparison was made” section. Identify the two reviewed features and trace each terrain/geology judgment to its source URL, exact page/figure/map unit or product when available, scale, and stated differences. Show the rubric version, the two dimension ratings, evidence completeness, and how the overall label and terrain-first order follow from the rules. Label heuristic assumptions and missing or incompatible observations explicitly. Link to original sources and include license/attribution and access date. For candidates, also show the bounded `SearchRun` inputs, filters, and unreviewed status.

Generate one PDF per comparison from the same validated comparison and provenance records used by the website. Include the selected sites, dimension and overall ratings or insufficient-evidence status, cited feature evidence, rubric version, sources, practice use, limitations, and candidate-search boundary when relevant. Include optional measurements with units and methods when used. The download must follow the currently selected pair in either search direction. A source that cannot be redistributed is linked and described rather than copied into the PDF. Keep the report asset path/version tied to its comparison data so a stale report cannot be served with a newer rating.

## Terrain visuals and practice planning

Show an Earth terrain image beside a Moon or Mars terrain image for the selected pair. Use sourced imagery with a visible scale bar or field of view, acquisition date when known, and attribution. Match displayed spatial scales when the source data supports it; otherwise label the scale difference prominently and do not imply that similar appearance proves comparable terrain. If a licensed or adequately documented image is unavailable, keep the evidence-based comparison usable and explain why the visual is missing. Images can support a documented terrain judgment when their locations and scales are known; appearance alone does not establish a match.

Use a small versioned catalog of practice objective tags, such as terrain traversal, geological observation, and sampling procedures. Attach a tag to a comparison only when its evidence supports that possible use, and show the supporting evidence and caveats. Selecting a tag filters the result list without changing ratings or order among remaining results. These tags suggest activities to evaluate, not approved training plans.

In the Moon/Mars-first workflow, allow the user to select a second Earth site for the same planetary target. Show both existing comparisons side by side: terrain and geology evidence, ratings and completeness, imagery, practice tags, limitations, method details, and each pair's PDF download. Do not calculate a new head-to-head rating. Keep both Earth selections through flat/globe switching; changing the target or switching to Earth-first search clears the second selection when it is no longer valid. On narrow screens, stack the two comparisons while preserving the same information.

## Generated explanations

First implementation: deterministic text assembled from comparison values, strong/weak dimensions, missing evidence, limitations, and linked sources. Explanations update when the selected pair changes. A useful structure is: why it matches, where it differs, a possible field-practice use, and evidence gaps.

Later integration: a server-side model adapter accepts the same structured evidence and returns grounded text. It cannot set ratings, invent measurements, or silently add claims. Validate referenced evidence IDs, retain the template fallback, and label the generation mode. Never send secrets to browser code.

## Bounded automated search

Choose one accessible source and a limited region or finite pool of candidate features. Extract or load actual documented features and filter for a declared environment and planetary target using published feature descriptors. Save inputs, method, and generated candidate records so the demo is reproducible without a live provider. Review the evidence and apply the same rubric before assigning ratings; automated candidates remain unreviewed and outside the ranked results until then.

Demonstrate at least one newly surfaced candidate, explain why the algorithm selected it, and mark it unreviewed until checked. Reordering the curated sites alone does not meet this milestone. If using a finite preselected pool, disclose that boundary. Never claim a site is previously unknown without a literature review.

## Resource register

The pasted challenge named resources but did not preserve original hyperlink targets. These official entry points were located separately. Public page checks do not establish download/API availability for every product.

| Resource | Entry point | Current check / intended use |
| --- | --- | --- |
| Earthdata Search | https://search.earthdata.nasa.gov/ | Page responds; JavaScript UI; verify product access |
| Worldview | https://worldview.earthdata.nasa.gov/ | Page responds; JavaScript UI; imagery exploration |
| NASA PDS | https://pds.nasa.gov/ | Readable archive entry point for planetary products |
| NASA LRO | https://science.nasa.gov/mission/lro/ | Readable mission information; follow instrument archives |
| Diviner | https://www.diviner.ucla.edu/data | Readable global/polar temperature product links |
| RADARSAT-1 | https://data.asc-csa.gc.ca/dataset/radarsat1 | Search listing found; direct fetch timed out |
| RCM access | https://www.asc-csa.gc.ca/eng/satellites/radarsat/faq.asp | Access restrictions apply; optional source |
| CSA SAR tutorial | https://github.com/asc-csa/EO-Visualization-and-Search-Tutorial | Readable related official tutorial; exact pasted tutorial URL unavailable |
| Copernicus | https://dataspace.copernicus.eu/ | Readable catalog and documentation entry point |
| ESA Open Science | https://opensciencedata.esa.int/ | Responds; browser extraction returned no readable content |
| JAXA G-Portal | https://www.gportal.jaxa.jp/?lang=en | Readable public portal; product access untested |

Select a small subset based on actual data availability. Record failed requests and avoid making the demo depend on an unverified source.

Technical references: [Vite](https://vite.dev/guide/), [MapLibre](https://maplibre.org/maplibre-gl-js/docs/), [FastAPI](https://fastapi.tiangolo.com/). Field-practice context: [NASA planetary analogs](https://science.nasa.gov/solar-system/planetary-analogs/), [ESA PANGAEA geological training](https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/CAVES_and_Pangaea/What_is_PANGAEA).

## Acceptance criteria

- Both search directions work for curated Earth, Moon, and Mars records.
- 2D/globe switching preserves the selected Earth site and result list.
- Every displayed measurement has traceable evidence, units, and scale notes; qualitative judgments cite the features they describe.
- A selected comparison shows its source-to-rating steps, and its downloadable PDF matches the on-screen pair, ratings, evidence, rubric version, and missing-evidence status.
- Selected Earth and planetary terrain visuals show source, scale, date when known, and attribution; missing visuals do not hide the evidence-based comparison.
- Practice objective tags have supporting evidence, filter results without changing ratings, and communicate limitations.
- A user can compare two Earth sites for one planetary target, see each pair's evidence and PDF, and retain both selections when switching the Earth map projection.
- Fixed rubric ratings and ordering are reproducible, disclose evidence completeness, and handle missing/incompatible evidence as specified; no similarity percentages are displayed.
- Comparisons show strong matches, differences, and a concrete, evidence-grounded field-practice use.
- Generated explanations work without API credentials and identify their evidence.
- A reproducible bounded search produces candidates beyond the curated list.
- Loading, empty results, unavailable tiles, and insufficient evidence have useful states.
- Keyboard users can select sites and read comparisons without interacting with the map.
- The frontend builds, scientific logic checks pass, and the demo workflow has been rehearsed.
