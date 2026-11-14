# TerraTwin specification

Status: agreed product direction; implementation has not started.

## Purpose

Build an interactive web app that helps teams find Earth locations with terrain comparable to Moon and Mars exploration sites, so they can identify places for relevant field practice before a mission. Geological evidence helps explain the terrain match. Explain the evidence for each analogy, which field tasks it might support, and where the analogy breaks down. Priorities, in order: scientific credibility, terrain relevance for practice, visual impact, discovering unexpected locations, ease of use.

The team has six beginner-to-intermediate software developers familiar with React/Next.js, JavaScript/TypeScript, and Python. The hackathon lasts a little over 24 hours. The scope and quantities below are proposed implementation defaults, not verified scientific findings.

## Core experience

1. Choose Moon or Mars, then a target from a fixed list; see ranked Earth analogs.
2. Alternatively, choose an Earth site and see relevant Moon and Mars targets.
3. Explore Earth results in a 2D map or 3D globe, preserving selection when switching.
4. Open a comparison with measurements, criterion scores, source links, missing data, limitations, and evidence-grounded field-practice uses.
5. Read an explanation generated from structured comparison evidence. Connect a model API later; explanations must work without it.
6. Inspect a small set of additional Earth candidates identified through an automated, reproducible search within a bounded region or candidate pool.

Users do not adjust scoring weights. No chatbot or downloadable report is required. The app has no user accounts or sign-in flow. Paid services and API keys are deferred.

## Delivery boundaries

The curated comparison workflow is the first milestone. Aim for 8–12 Earth sites, two lunar targets, and two Martian targets; reduce counts if source verification requires more time. Keep automated candidate search as a required second milestone, bounded enough to finish during the hackathon. Do not describe a finite candidate search as global discovery.

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
| Optional NumPy, if needed | 2.5.4 |
| Optional Pandas, if needed | 3.1.1 |
| Later FastAPI service, if added | 0.162.6 |

The runtime versions are recorded in `.nvmrc` and `.python-version`. When scaffolding, put exact package versions in `web/package.json` (no `^`, `~`, or `latest`) and commit `web/package-lock.json`. Put exact Python dependencies in the pipeline's dependency file; if transitive Python dependencies are used, commit a reproducible lockfile too. Use `npm ci` for installs after the lockfile exists. Member 1 owns frontend dependency changes; member 4 owns Python dependency changes. Coordinate upgrades through one reviewed change that updates this table, the manifests, and lockfiles together. Do not silently change versions on individual branches.

Version references: [Node.js 24.22.3](https://nodejs.org/en/blog/release/v24.22.3/), [Python 3.14.10](https://www.python.org/downloads/release/python-31410/), [npm React](https://www.npmjs.com/package/react), [npm React DOM](https://www.npmjs.com/package/react-dom), [npm TypeScript](https://www.npmjs.com/package/typescript), [npm Vite](https://www.npmjs.com/package/vite), [npm React plugin](https://www.npmjs.com/package/%40vitejs/plugin-react), [npm MapLibre](https://www.npmjs.com/package/maplibre-gl), [PyPI Pydantic](https://pypi.org/project/pydantic/), [PyPI Pytest](https://pypi.org/project/pytest/), [PyPI NumPy](https://pypi.org/project/numpy/), [PyPI Pandas](https://pypi.org/project/pandas/), [PyPI FastAPI](https://pypi.org/project/fastapi/).

A runtime Python server is not required for the first demo. Precompute comparisons in Python and serve results to the frontend, keeping one authoritative scoring implementation. Do not add Next.js alongside Vite.

Verify that the selected MapLibre release supports the intended projection switching before committing the map implementation. The initial globe represents Earth; show Moon and Mars targets in a selector and comparison panel. Separate planetary globes and detailed 3D terrain are outside the first version. Basemap imagery is a separate service dependency: verify terms, attribution, quotas, and key requirements. Provide markers on a plain background and a usable results list if tiles fail.

## Scientific comparison

The first scoring profile has two dimensions: terrain (slope and/or roughness at comparable scales) and geology/surface materials. Terrain is the primary match for field practice; geology helps distinguish surfaces that may look similar but have different material evidence. Show thermal conditions, water/ice, and dryness as contextual observations when sourced, without adding them to the first score. Gravity, atmosphere/vacuum, and radiation are analogy limits, not Earth-terrain scoring criteria.

Do not force unlike measurements into the same score. Slope and roughness require comparable spatial scales. If temperature is shown as context, distinguish surface from air temperature. Absolute elevation relative to different planetary datums is not a direct similarity measure. Store units, acquisition period, spatial resolution, processing method, and uncertainty or quality notes.

For a numeric criterion with justified comparison tolerance `t > 0`, use `s = max(0, 1 - abs(earth - target) / t)`. Define and cite the tolerance or label it as a heuristic. Terrain may combine separately documented slope and roughness scores. For geology, use an explicit evidence-backed category compatibility table; do not invent percentages from descriptive text.

For the first profile, use fixed heuristic weights of 2/3 for terrain and 1/3 for geology. This prioritizes terrain for field practice; the weights are a product choice, not a validated scientific finding. Version every profile, tolerance, compatibility table, and algorithm. Describe the resulting score as heuristic terrain-and-geology similarity, never probability, scientific validation, or base suitability.

For missing or incompatible criteria, record a missing score, not zero. Compute `coverage = available weight / total profile weight`. Rank only records with both terrain and geology comparable (coverage = 1); set the overall score to null otherwise and show those records separately as insufficient evidence. Sort eligible results by score, then stable site ID. Show coverage beside the score. Coverage measures completeness, not confidence or correctness; also disclose missing slope or roughness subcriteria within an otherwise available terrain dimension.

For reverse search, rank compatible planetary targets for the selected Earth site and show the profile used. Separate target profiles if their dimensions or tolerances differ; their overall scores are not automatically comparable.

Present terrain evidence first, then geology and other sourced context. Suggest practice tasks only when the selected comparison supports them, such as terrain traversal, geological observation, sampling procedures, or instrument trials. These are possibilities to assess, not approved training plans. Always explain relevant analogy limits: gravity, atmosphere/vacuum, radiation, biology, scale, and seasonality as applicable. A terrain or geological match does not establish thermal suitability or safety for a permanent base.

## Data contract

- `Site`: stable ID, name, body (`earth`, `moon`, `mars`), latitude/longitude, coordinate convention, study footprint/scale, description, evidence IDs, curated/candidate status, review status.
- `Observation`: ID, site ID, metric, numeric or categorical value, unit, time range, spatial resolution, method, uncertainty/quality note, source ID. Missing values are explicit nulls with a reason.
- `Source`: ID, agency/provider, title, original URL, dataset/product identifier and version when available, access date, license/attribution, and retrieval/access notes.
- `Comparison`: Earth ID, planetary target ID, profile/algorithm version, per-criterion values and scores, missing reasons, coverage, overall score or null, rank eligibility, limitations, potential field-practice uses, and evidence references.
- `Explanation`: comparison ID, text, evidence references, generation mode (`template` or later `model`), and generation version.
- `SearchRun`: region/candidate-pool definition, input dataset versions, extraction method, filters, scoring version, output IDs, run time, and review notes.

GeoJSON Earth coordinates use `[longitude, latitude]`. Planetary coordinates must explicitly identify body, longitude direction/range, and latitude convention. Never place planetary coordinates on the Earth map.

## Generated explanations

First implementation: deterministic text assembled from comparison values, strong/weak dimensions, missing evidence, limitations, and linked sources. Explanations update when the selected pair changes. A useful structure is: why it matches, where it differs, a possible field-practice use, and evidence gaps.

Later integration: a server-side model adapter accepts the same structured evidence and returns grounded text. It cannot set scores, invent measurements, or silently add claims. Validate referenced evidence IDs, retain the template fallback, and label the generation mode. Never send secrets to browser code.

## Bounded automated search

Choose one accessible source and a limited region or finite pool of candidate footprints. Extract or load actual documented features, filter for a declared environment, and score against one planetary target using the same comparison engine. Save inputs, method, and generated candidate records so the demo is reproducible without a live provider.

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
- Every displayed measurement has traceable evidence, units, and scale notes.
- Fixed scores are reproducible, disclose coverage, and handle missing/incompatible data as specified.
- Comparisons show strong matches, differences, and a concrete, evidence-grounded field-practice use.
- Generated explanations work without API credentials and identify their evidence.
- A reproducible bounded search produces candidates beyond the curated list.
- Loading, empty results, unavailable tiles, and insufficient evidence have useful states.
- Keyboard users can select sites and read comparisons without interacting with the map.
- The frontend builds, scientific logic checks pass, and the demo workflow has been rehearsed.
