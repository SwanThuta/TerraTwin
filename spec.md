# AstroCoders specification

Status: agreed product direction; implementation has not started.

## Purpose

Build a website and research tool that compares Earth locations with Moon and Mars exploration sites. Explain the evidence for each analogy, where it breaks down, and how it could support exploration. Priorities, in order: scientific credibility, visual impact, discovering unexpected locations, ease of use.

The team has six beginner-to-intermediate software developers familiar with React/Next.js, JavaScript/TypeScript, and Python. The hackathon lasts a little over 24 hours. The scope and quantities below are proposed implementation defaults, not verified scientific findings.

## Core experience

1. Choose Moon or Mars, then a target from a fixed list; see ranked Earth analogs.
2. Alternatively, choose an Earth site and see relevant Moon and Mars targets.
3. Explore Earth results in a 2D map or 3D globe, preserving selection when switching.
4. Open a comparison with measurements, criterion scores, source links, missing data, limitations, and exploration applications.
5. Read an explanation generated from structured comparison evidence. Connect a model API later; explanations must work without it.
6. Inspect a small set of additional Earth candidates identified through an automated, reproducible search within a bounded region or candidate pool.

Users do not adjust scoring weights. No chatbot or downloadable report is required. User accounts, paid services, and API keys are deferred.

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

Choose compatible stable package versions at implementation time and commit lockfiles. A runtime Python server is not required for the first demo. Precompute comparisons in Python and serve results to the frontend, keeping one authoritative scoring implementation. Do not add Next.js alongside Vite.

Verify that the selected MapLibre release supports the intended projection switching before committing the map implementation. The initial globe represents Earth; show Moon and Mars targets in a selector and comparison panel. Separate planetary globes and detailed 3D terrain are outside the first version. Basemap imagery is a separate service dependency: verify terms, attribution, quotas, and key requirements. Provide markers on a plain background and a usable results list if tiles fail.

## Scientific comparison

Default evidence dimensions are terrain (slope/roughness), geology and surface materials, and thermal conditions. Water/ice can be a target-specific supplementary dimension when comparable evidence is available. Dryness and atmosphere belong in context unless an explicit comparable metric is justified.

Do not force unlike measurements into the same score. Surface temperature cannot silently substitute for air temperature; slope and roughness require comparable spatial scales. Absolute elevation relative to different planetary datums is not a direct similarity measure. Store units, acquisition period, spatial resolution, processing method, and uncertainty or quality notes.

For a numeric criterion with justified comparison tolerance `t > 0`, use `s = max(0, 1 - abs(earth - target) / t)`. Define and cite the tolerance or label it as a heuristic. Terrain may combine separately documented slope and roughness scores. For geology, use an explicit evidence-backed category compatibility table; do not invent percentages from descriptive text.

Use fixed equal weights across the three default dimensions initially. Version every profile, tolerance, compatibility table, and algorithm. Describe the resulting score as heuristic similarity, never probability, scientific validation, or base suitability.

For missing or incompatible criteria, record a missing score, not zero. Compute `coverage = available weight / total profile weight`; compute the available-data score using only available weights. Rank only records with at least two comparable dimensions and coverage >= 2/3. Keep partial-coverage results separate from full-coverage results, sorting within each group by score, then coverage, then stable site ID. Show coverage beside the score and display unranked records as insufficient evidence. Coverage measures completeness, not confidence or correctness.

For reverse search, rank compatible planetary targets for the selected Earth site and show the profile used. Separate target profiles if their dimensions or tolerances differ; their overall scores are not automatically comparable.

Always explain relevant analogy limits: gravity, atmosphere/vacuum, radiation, biology, scale, and seasonality as applicable. A geological match does not establish thermal suitability or safety for a permanent base.

## Data contract

- `Site`: stable ID, name, body (`earth`, `moon`, `mars`), latitude/longitude, coordinate convention, study footprint/scale, description, evidence IDs, curated/candidate status, review status.
- `Observation`: ID, site ID, metric, numeric or categorical value, unit, time range, spatial resolution, method, uncertainty/quality note, source ID. Missing values are explicit nulls with a reason.
- `Source`: ID, agency/provider, title, original URL, dataset/product identifier and version when available, access date, license/attribution, and retrieval/access notes.
- `Comparison`: Earth ID, planetary target ID, profile/algorithm version, per-criterion values and scores, missing reasons, coverage, overall score or null, rank eligibility, limitations, exploration uses, and evidence references.
- `Explanation`: comparison ID, text, evidence references, generation mode (`template` or later `model`), and generation version.
- `SearchRun`: region/candidate-pool definition, input dataset versions, extraction method, filters, scoring version, output IDs, run time, and review notes.

GeoJSON Earth coordinates use `[longitude, latitude]`. Planetary coordinates must explicitly identify body, longitude direction/range, and latitude convention. Never place planetary coordinates on the Earth map.

## Generated explanations

First implementation: deterministic text assembled from comparison values, strong/weak dimensions, missing evidence, limitations, and linked sources. Explanations update when the selected pair changes. A useful structure is: why it matches, where it differs, exploration use, and evidence gaps.

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

Technical references: [Vite](https://vite.dev/guide/), [MapLibre](https://maplibre.org/maplibre-gl-js/docs/), [FastAPI](https://fastapi.tiangolo.com/).

## Acceptance criteria

- Both search directions work for curated Earth, Moon, and Mars records.
- 2D/globe switching preserves the selected Earth site and result list.
- Every displayed measurement has traceable evidence, units, and scale notes.
- Fixed scores are reproducible, disclose coverage, and handle missing/incompatible data as specified.
- Comparisons show strong matches, differences, and a concrete exploration application.
- Generated explanations work without API credentials and identify their evidence.
- A reproducible bounded search produces candidates beyond the curated list.
- Loading, empty results, unavailable tiles, and insufficient evidence have useful states.
- Keyboard users can select sites and read comparisons without interacting with the map.
- The frontend builds, scientific logic checks pass, and the demo workflow has been rehearsed.
