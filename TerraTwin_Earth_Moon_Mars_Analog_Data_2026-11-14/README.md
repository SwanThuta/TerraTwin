# TerraTwin sourced analog research dataset — 2026-11-14

## What is included

This source-preserving release covers **8 proposed Earth–Moon/Mars pairs (P01–P08)** from the supplied research shortlist, **8 Earth sites**, **6 planetary subfeature scopes**, and **4 planetary host/region references**. The companion `webapp_flat_pairs.csv` makes initial UI ingestion easy. The normalized CSVs allow more accurate scientific and evidence tracking.

**Warning: Do not interpret the number of decimal digits as geodetic accuracy.** `locations.csv` distinguishes source-located points from `approximate_*` reference proxies in `feature_coordinates_status`; every approximate point has a limitation in `coordinate_note`. `map_anchor_*` remains the separately recorded context point, which may be a base camp, parking lot, image center, host crater or adjacent named valley. A proxy is for approximate map orientation only: it is not a surveyed feature coordinate, feature boundary, or DEM footprint. Rows still marked `not_source_verified` keep empty feature-coordinate cells. No complete georeferenced study polygons or actual DEM raster measurements have been downloaded or validated in this package.

The `longitude_convention` for planetary records is positive-east **0–360** degrees; for terrestrial records Earth WGS84-style signed degrees are shown (the Mauna Ulu USGS record explicitly quotes NAD83, so datum metadata must be preserved at higher accuracy). The label `latitude_convention` is a reminder to consult each planetary product's PDS label before GIS raster operations. Never load Moon/Mars coordinates onto an Earth base map.

## Files

| File | Meaning and joining key |
|---|---|
| `locations.csv` | 18 locations; `feature_id` is unique; 8 Earth (E01-E08), 6 planetary scoped sites (L01/L02/M01-M04), 4 host records (H_*). |
| `analog_pairs.csv` | 8 comparisons; join `earth_feature_id` and `planetary_feature_id` to `locations.feature_id`. |
| `pair_review_overrides.csv` | Branch-local AI source desk-screen decisions for P02-P08; leaves the original proposed-pair rows intact. Missing dimensions stay blank with a reason. |
| `webapp_flat_pairs.csv` | Flat 8-row frontend import view, including feature-vs-anchor distinction and review states. |
| `sources.csv` | Research source metadata; semicolon-delimited source IDs are references to these rows. |
| `comparison_criteria.csv` | First-release scored and unscored dimensions plus future numerical-quality requirements. |
| `location_workflows.csv` | Ordered 6-step collection/review instructions for EACH P01–P08 pair. |
| `formulas.csv` | Registry of formulas and conditions, including source-based ordinal rubric and optional metrics. |
| `published_observations.csv` | Published whole-site measurements/context only; not newly computed digital elevation or analog scores. |
| `metric_measurements_template.csv` | Empty measurement slots; **do not populate without raster footprint, units, quality and provenance**. |
| `data_products.csv` | Candidate NASA/USGS/PGC datasets. All catalog entries show `downloaded_and_checked=False`. |
| `nasa_haughton_ops_points.csv` | 8 NASA historical TRPF route waypoints, 4 2010 imagery-footprint corners, plus field-station coordinates extracted from the attached NASA PDF; these are NOT Locale 7 locations. |
| `scoring.py` | Python qualitative methods, DEM metric formulas, disabled-by-default experimental similarity and historical NASA traffic zoning. |
| `scoring.mjs` | ES-module JavaScript equivalents for a browser / Next.js app, including safe feature-vs-context pin selection. |
| `validate.py` | Run locally to verify foreign keys, source IDs, coordinate validity, ratings and workflows. |

## First-release (mandatory) rubric: terrain-geology-qual-v1

**Rate separately:** (1) terrain and landforms (primary), (2) geology/surface materials. Supported options: `Strong`, `Moderate`, `Weak`, and **missing / Insufficient evidence**. A null rating is not `Weak`.

- `Strong`: cited feature-level corresponding subfeatures or material/deposit classes at meaningful study scale.
- `Moderate`: matching broad landform or material/process family, but important differences or unknowns.
- `Weak`: supported material/landform differences materially limit analogy, with sources present for both features.
- Null: missing source-applicable evidence / a feature not precisely selected.

**Overall:** if both rated and reviewed, any `Weak` gives `Weak`; two `Strong` give `Strong`; otherwise `Moderate`. Any missing dimension gives `Insufficient evidence`. A desk-reviewed record may have null dimensions; review status and evidence coverage are separate. Rankings contain *only reviewed, fully rated pairs*, sorted by terrain label (`Strong` before `Moderate` before `Weak`), then geology label, then stable pair ID (`terrain-first-v1`). `supported_dimensions_count` is 0/2, 1/2 or 2/2 **not a percentage confidence**. P01 retains the supplied research's dated desk review: terrain Moderate, geology Weak, overall Weak. The new AI desk-screen overlay rates P05-P07 Moderate/Moderate; P03 has Weak terrain and null geology; P02/P04/P08 have no scored dimensions. P05-P07 are rank-eligible; all P02-P08 screens require independent expert review. No pair is rated Strong. Published NASA general analog studies must not be treated as validation of every *specific* pair.

**Do not manufacture quantitative similarity percentages.** Surface shape, mineral chemistry, gravity, radiation, atmosphere, ice/water and cave geometry are not interchangeable. A DEM cannot measure a cave interior or a submerged lakebed. The `experimental_metric_similarity` helper is an optional new research proposal disabled without `authorized=True`, validated equal-unit/equal-support evidence, and explicitly chosen weights/tolerances. It is **not NASA's formula**, and must not replace the first-release qualitative rubric.

## Step-by-step app ingestion

1. Read `sources.csv` into a source dictionary by `source_id`; treat external URLs as citations, not automatic proof of local DEM raster coverage.
2. Read `locations.csv`; use `feature_coordinates_status` to distinguish sourced feature points from approximate reference proxies. Label approximate pins as approximate, and label `map_anchor_*` explicitly as **context reference** when it differs from the selected feature.
3. Read `analog_pairs.csv`, join to locations, then apply `pair_review_overrides.csv` by `pair_id`; show `relationship_status`, `critical_difference`, `review_status` and independent terrain/geology evidence IDs.
4. P01 remains `Moderate / Weak -> Weak`; P05-P07 are `Moderate / Moderate`; P03 has `Weak / null -> Insufficient evidence`; P02/P04/P08 remain `null / null`. Do not rank a pair with a missing dimension or rank P08 based on process context.
5. Show a per-pair “evidence required” checklist from `location_workflows.csv` ordered by `step_number`. Use this as actual field-collection workflow.
6. If a researcher enters measurements, keep each row's product, epoch, horizontal/vertical coordinate reference, support window, effective ground sample distance, masks, uncertainty, source and reviewer in `metric_measurements_template.csv`.
7. If and ONLY if a separately scoped numerical study is approved, obtain the validated DEMs and deposit polygons, compare equivalent physical windows, calculate metrics with the specified methods, and record review. **Do not calculate height difference across different planetary datums.**

## Site-by-site source coordinates and precision

| Pair | Earth feature/reference | Planetary feature/reference | Limitation |
|---|---|---|---|
| P01 | Approximate Locale 7 point **75.44605,-89.91728**, calculated 2 km on assumed 315° NW bearing from HMP station **75.433333,-89.866667** (NASA reports only roughly 2 km NW; no exact bearing/GPS) | LROC Shackleton rim **-89.684,196.739 E** (750m-wide image) | Locale 7 estimate is not a surveyed point; HMP remains the separate map anchor. LROC image site is not mapped terrain polygon. |
| P02 | USGS Maunaulu named formation GNIS **19.3678716,-155.2024267** (NAD83) | LROC Marius Hills Pit **14.0917,303.2299 E** | Maunaulu center is not selected basaltic tube/flow unit. |
| P03 | Fagradalsfjall **2021 vent 5b 63.8906,-22.2691** | Marius Hills Pit **14.0917,303.2299 E** | Fresh eruptive vent vs lunar collapse pit, not necessarily analogous shape. |
| P04 | Approximate Skull Cave locator **41.7311667,-121.5106667** uses USGS Stop 14 parking, not cave entrance | Marius Hills Pit **14.0917,303.2299 E** | Cave-mouth position remains unverified; subsurface geometry is not implied. |
| P05 | Approximate Lake Salda locator **37.5525,29.6813889** is the IUGS whole-lake reference, not the selected carbonate bench | Approximate Jezero locator **18.41,77.69 E** is the IAU crater center, not western carbonate margin | Need exposed deposits on both sites. |
| P06 | Approximate San Pedro delta-region locator **-23.30461,-68.21839** is the Rio San Pedro gazetteer point, not the delta outlet | Approximate Jezero delta locator **18.449,77.436 E** is a THEMIS image center, not a delta outcrop | Map both actual deposits, exclude industrial ponds. |
| P07 | Approximate Copper Canyon fan locator **36.1285645,-116.7536577** is a canyon reference, not fan centroid | Approximate Peace Vallis fan locator **-4.21,137.23 E** is the named-valley point, not fan center | Map full fans from USGS/Palucis before numeric work. |
| P08 | Lake Untersee study site **-71.3456,13.4640333** | Approximate Gale locator **-5.44,137.70 E** is crater center; no proven ancient ice-covered lake point | Process hypothesis only, cannot rank terrain/geology. |

### Source-backed measurements versus new calculations

Palucis et al. reports Peace Vallis whole-fan area **80 km²** (upper 49, lower 31). USGS estimates Copper Canyon entire fan about **2 square miles ≈5.2 km²**. The ratio `80/5.2 ≈ 15.38` represents a **whole-fan scale difference**, not geological similarity. LROC Pit Atlas gives Marius pit depth 40m from stereo modeling, with estimated measurement uncertainty and interpretation separate from tube access. Published measurements appear in `published_observations.csv`; blank template fields are not manufactured DEM outcomes.

### Source boundaries and intellectual property

The source catalog includes NASA, USGS, IAU, NPS, IUGS, peer-reviewed articles and one clearly labeled non-primary context gazetteer. URL existence does not mean a raster has been downloaded, validated for valid pixels, or licensed for unrestricted use. Check image credits, acquisition epoch and licensing before embedding imagery in a public-facing app. An image or research paper containing a coordinate may still only localize a view or reference rather than a geologic sampling location.

### Historic NASA operational thresholds (not a current spacecraft standard)

NASA TM-2011-216157 (2010 Haughton analog field trials, Table 6 printed p19) includes a historical rover terrain-zone classification using slope and obstacle coverage; the hypothetical route restriction was below 15 degrees in Table 7 discussion, and an assumed >61cm rock obstructed their hypothetical convoy. `scoring.py: historical_traffic_zone()` implements the report's broad zone prioritization as **context only**. It cannot certify rover or lander safety and is **not** part of terrain/geology analog rating.

## Minimal JavaScript web-app integration

After parsing CSV files with a standards-compliant CSV parser (for example, a CSV parser in your Next.js data import layer), use:

```js
import { rankPairs, overallRating, getFeaturePin } from './scoring.mjs';

const ranked = rankPairs(parsedAnalogPairs);  // P01 only as of this release
const rating = overallRating(pair.terrain_rating, pair.geology_rating, pair.review_status);
const featurePoint = getFeaturePin(location);  // null if only regional context exists
const contextPoint = getFeaturePin(location, { allowContext: true });
// contextPoint.type === 'context_reference_NOT_feature' must be visibly labeled
```

The CSV files use a UTF-8 BOM for Microsoft Excel compatibility. Empty fields are null/missing, not zero; booleans from a CSV parser may initially be strings `True`/`False`, so coerce them for your UI if needed. Columns ending in `_id` or `_ids` are stable source/feature references, not coordinates.

## Historical NASA PDF waypoints (separate experiment, not analog feature footprints)

The attached NASA TM-2011-216157, **Table 7 (printed page 23)** gives the 2010 traverse planning waypoints A–H with latitude, longitude, reported elevations and leg distances. **Table 5 (printed p18)** gives four high-resolution imagery corners, and **printed p5** gives HMP Research Station coordinates. These are transcribed in `nasa_haughton_ops_points.csv` and not substituted for Locale 7. The same NASA report **printed p21** notes ~15-meter Google Earth layer registration offsets at Devon Island during the 2010 tests. Coordinate decimal precision thus does not prove 2010 raster registration or field GPS accuracy.
