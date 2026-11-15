# TerraTwin: evidence for qualitative analog ratings

Research review dates: 2026-11-14 (P01 source record); 2026-11-15 (P02-P08 AI desk screens).

Status: all eight proposed pairs now have source-based desk screens in `pair_review_overrides.csv`. P01 remains Moderate/Weak; P05, P06, and P07 are Moderate/Moderate; P03 has Weak terrain with geology not rated; P02, P04, and P08 have neither scored dimension. P01 and P05-P07 are rank-eligible; all others remain outside rankings. No pair meets the Strong threshold. The override file preserves the original proposed-pair rows and clearly identifies these as AI desk screenings, not independent expert or field reviews. DEM-derived similarity percentages are outside scope.

The generated atlas and PDFs now include all eight desk-screen records from the same validated dataset. P02, P04, and P08 remain unranked with explicit gaps; P03 is 1/2 dimensions supported. The only fully rated additional records are P05-P07, and their Moderate labels do not imply matched measurements, safety, or independent approval.

Source-access note: R07's publisher page returned HTTP 406; the R09 PDF was returned as binary and could not be text-inspected; R10 returned HTTP 403; R15 timed out; and publisher pages R22/R23 returned HTTP 403. The Crossref abstract for R22, NASA pages R41/R42, USGS page R06, R40's map catalog, and the NASA NTRS R25 record were readable. Findings that depend on blocked documents remain explicitly limited; no inaccessible source is treated as a new measurement.

## Selected dimensions

| Dimension | First implementation | Evidence required |
| --- | --- | --- |
| Terrain and topography | Primary qualitative rating: named landform, visible subfeatures, and scale relevant to field practice; optional slope/roughness context | Sources and locators for both selected features, image/map scales when known, and documented similarities and differences |
| Geology and surface materials | Second qualitative rating: documented deposit/material classes and uncertainty | Geological maps or published observations applying to both selected features |
| Geological processes | Qualitative explanation: impacts, lava emplacement, erosion, sediment transport and deposition | Published evidence connecting a process to each selected feature; distinguish observations from interpretations |
| Exploration activities | Evidence-backed practice tags, not another rating dimension | A cited reason the selected evidence could support sampling, mapping, instrument trials or terrain-navigation research |

Mineralogy can support geology when measured or published; it is not inferred from image color. Terrain includes landform shape, but a shared crater, cave or fan label alone cannot justify a Strong rating. Local relief describes elevation differences within a footprint; absolute elevation against different planetary datums is not a direct similarity criterion.

Temperature/illumination, water/ice, biology/habitability, and cave geometry remain optional context or specialized evidence. They do not affect the first rating. In particular, a surface DEM does not measure underground passage dimensions or the bottom of a water-covered lake. Earth does not reproduce lunar or Martian gravity, atmosphere/vacuum, or radiation.

### Rating method: `terrain-geology-qual-v1`

For each pair, review one identifiable Earth feature and one Moon/Mars feature. Rate **terrain/landform** and **geology/surface materials** separately, with a source reference, short rationale and meaningful difference for each. Use the same labels and rules as `spec.md`:

- **Strong:** specific cited features have closely corresponding landforms and subfeatures, or corresponding deposit/material classes, at a meaningful scale for the proposed practice use.
- **Moderate:** sources support a shared broad landform or material/process family, but details, interpretation or scale differ or remain uncertain.
- **Weak:** both features are identified, but sourced differences materially limit the analogy.
- **Insufficient evidence:** one feature or its applicable evidence is missing. Store a null dimension rating and reason, not Weak.

Overall: both Strong gives Strong; both at least Moderate with one Moderate gives Moderate; any Weak gives Weak when both dimensions are rated; a null dimension gives Insufficient evidence. Reviewed pairs with both dimensions rated are ordered by terrain label, then geology label, then stable ID (`terrain-first-v1`). Unreviewed candidates and insufficient-evidence pairs stay outside ranked results. Show `0/2`, `1/2`, or `2/2 dimensions supported` separately from review status; it is not a confidence estimate.

Do not turn descriptions such as "basaltic" or "impact crater" into invented similarity percentages. A broad regional analogy alone does not validate a specific pair. Exact equal-area polygons, DEM retrieval and numerical terrain processing are optional follow-up. Practice filters do not change ratings. Use the same reviewed evidence record for the website and PDF.

For each pair, record: the two named features and their source-backed locators; terrain label, cited evidence, rationale and differences; geology label, cited evidence, rationale and differences; overall label or missing-evidence reason; proposed practice tags with citations; review status, reviewer and date; image scale/credits; and rubric/ordering versions. Published measurements may be included as context with units and scale, but they do not need to be collected to complete this record.

## Four planetary targets and eight Earth sites

Moon targets: Shackleton crater and Marius Hills. Mars targets: Jezero crater and Gale crater. These are exploration/research targets, not approved permanent-base locations.

The requested Earth regions are represented by Haughton, Death Valley, Antarctica, Atacama, Iceland and Hawaii. The two additional Earth sites are Lava Beds National Monument and Lake Salda. "Houton" is interpreted as Haughton Crater on Devon Island, Canada.

| Pair ID | Planetary feature | Earth location | Relationship supported by sources | Initial assessment | Branch desk-screen result |
|---|---|---|---|---|---|
| P01 | Shackleton: impact terrain and traverse context | Haughton Crater, Devon Island, Canada | Directly documented Shackleton-relevant analog relationship [S01]; selected rim-area evidence [S19, S22] | Supplied review: terrain Moderate, geology Weak, overall Weak | Existing P01 record; unchanged |
| P02 | Marius Hills: volcanic surfaces | Mauna Ulu lava-flow area, Kilauea, Hawaii | USGS documents multiple Mauna Ulu tube-forming processes [R06]; Moon map is regional only [R40] | Source-screened; selected flow footprint and lunar material remain unresolved | 0/2 dimensions; Insufficient evidence |
| P03 | Marius Hills: volcanic surfaces and vents | Fagradalsfjall 2021 vent 5b, Iceland | Published vent locator [R07], NASA field methods [R41], and LROC pit morphology [R04] | AI source desk-screen | Terrain Weak; geology null; Insufficient evidence |
| P04 | Marius Hills pit region: volcanic cave exploration | Skull Cave, Lava Beds National Monument, California, USA | Cave/parking locator and possible lunar skylight sources [R04, R09, R10] | AI source desk-screen; source text access limited | 0/2 dimensions; Insufficient evidence |
| P05 | Jezero: carbonate-bearing margin and sedimentary features | Lake Salda, Turkiye | NASA directly describes Salda carbonates/shorelines and possible Jezero carbonates [R11-R13] | AI source desk-screen | Terrain Moderate; geology Moderate; overall Moderate |
| P06 | Jezero: deltaic deposits | San Pedro River delta, Salar de Atacama, Chile | USGS identifies the northern San Pedro delta [R16]; NASA documents Jezero delta outcrops [R42] | AI source desk-screen | Terrain Moderate; geology Moderate; overall Moderate |
| P07 | Gale: Peace Vallis alluvial fan | Copper Canyon fan, Death Valley, California, USA | USGS fan description [R18-R19]; Peace Vallis paper/abstract [R22] | AI source desk-screen | Terrain Moderate; geology Moderate; overall Moderate |
| P08 | Gale: possible ancient ice-covered lake conditions | Lake Untersee, Antarctica | Modern lake observations [R24, R36]; NASA-hosted Gale model hypothesis [R25] | AI source desk-screen; process context only | 0/2 dimensions; Insufficient evidence |

The distribution is intentionally one Earth site for Shackleton, three for Marius Hills, two for Jezero, and two for Gale. Eight Earth sites do not imply two equally strong or rankable sites for every target. The two-Earth-site UI should operate where two eligible records actually exist; it must not manufacture a second ranked match.

## Pair evidence and limits

### P01: Haughton - Shackleton

**Selected scope and locators:** Haughton *Site A, Locale 7* on the northwestern crater rim, identified by the NASA robotic follow-up map (Figure 22) and field photographs (Figure 28); the paper places Locale 7 about 2 km northwest of HMP base camp [S22]. The map now uses **75.44605°N, 89.91728°W** as an approximate point, calculated 2 km along an assumed 315° northwest bearing from the HMP reference coordinate [S01]. NASA does not publish an exact Locale 7 GPS or bearing; the HMP base coordinate remains separately recorded as a context anchor. Its broader Site A context is Figure 13 (PDF page 40) in [S01]. On the Moon, use the **750-m-wide LROC rim image** at the intersection with the Shackleton-de Gerlache ridge, **89.684°S, 196.739°E** (positive-east longitude) [S19]. These locators define a field-practice comparison, not matched polygons or approved routes. NASA explicitly identifies the Haughton-Shackleton analog relationship at the whole-crater and operations levels in Table 3 (PDF page 27) [S01].

**Terrain — Moderate (`terrain-geology-qual-v1`):** the Haughton Locale 7 field record describes a rocky ridge, a broad lower shelf and a heavily bouldered section that complicated K10 rover access (Figure 28 and printed page 20) [S22]. The selected Shackleton rim image shows blocks, small craters and a relatively flat observation area; the linked 1:8,000 geomorphic map documents impact-related textures and slope features across the ridge and adjacent rim [S19]. This is a useful broad comparison for observing rim obstacles and planning a route from imagery. The sources do not establish matching slopes, block sizes/distributions or a trafficable lunar route. Haughton is a modified terrestrial complex impact structure with faults and terraces [S01]; LOLA describes Shackleton as a well-preserved simple crater [S21]. These morphology and observation-scale differences prevent a Strong terrain label.

**Geology — Weak (`terrain-geology-qual-v1`):** the selected Haughton Site A investigation identified marker beds in **host carbonate stratigraphy**; Locale 7 specifically investigated carbonate layers and blocks in the ridge (Figure 29 and printed pages 19–21) [S22]. The LROC map identifies an impact-modified lunar upper-regolith surface, and its selected rim blocks are interpreted as *likely* Shackleton ejecta that *might* expose lunar crust; their composition is not measured in this source [S19]. Both sites are within impact structures, but the documented carbonate host-rock setting at Locale 7 is materially different from the lunar regolith/ejecta interpretation. Whole-crater Haughton impact breccias in [S01] must not be substituted for the selected Locale 7 material. This specific difference limits a geological-material analogy even though impact-field observation procedures remain relevant.

**Overall — Weak:** both dimensions have cited, feature-applicable evidence (`2/2 dimensions supported`). The overall label follows the fixed rule in `spec.md`: a Weak dimension makes the overall label Weak. This is an ordinal screening judgment, not a measured percentage or a claim of safe access. Review status: **reviewed, source-based desk screening**; reviewer: **Codex**; review date: **2026-11-14**; ordering rule: `terrain-first-v1`. The selected areas and labels should be revisited if higher-resolution geologic mapping or a different field-practice objective changes the feature scope.

**Practice use and limits:** supported tags are **impact-landform observation** and **robotic mapping/traverse planning**: NASA tested field mapping and rover access at Site A [S22], and LROC prepared the lunar map for traverse planning and landscape interpretation [S19]. A geology-observation exercise can compare how rock and regolith interpretations are made, while recording their material differences. The sources do not validate a Shackleton sampling procedure or route. Terrestrial erosion, glaciation, permafrost, carbonates, atmosphere and summer daylight differ from lunar regolith, vacuum, polar illumination and permanently shadowed terrain [S01, S21]. No outpost or landing-site suitability follows from this review.

**Images and optional terrain data:** NASA [S22] Figure 22 maps Site A and Figure 28 photographs Locale 7; Figure 28 was directly inspected. Its field photos have no calibrated ground width or scale bar. NASA [S01] Figure 13 is an approximately 9-km-wide Site A context scene. The LROC rim detail was directly inspected on its source page; it is 750 m wide and has a published 0–300 m scale bar. Credit NASA/GSFC/Arizona State University [S19]. These are not equal-scale image views. **No image assets are imported into the repository yet.** When importing them, keep visible credits, source links, separate scale labels and the scale-mismatch notice. The NASA report's NTRS record marks it **Public Use Permitted** [S24]; NASA's site-wide terms caution that embedded third-party material can carry separate rights [S25]. No separate restriction was found for Figure 28. LROC permits educational use of its featured images with attribution but retains copyright; commercial use needs permission, while PDS-delivered products are public domain [S23]. LROC catalogs **NAC_DTM_ESALL_SR12** at 2 m/pixel with orthoimages and a confidence map [S20]; its bounds include the lunar locator, but valid pixels and height reference remain unverified. No Haughton ArcticDEM strip/tile is selected. Neither DEM is required for this rating.

### P02: Mauna Ulu, Hawaii - Marius Hills

USGS documents four tube-forming processes observed during the 1969–1974 Mauna Ulu eruption, including crusted channels and pahoehoe lobes fed by distributary networks [R06]. This is stronger Earth-side process evidence than a generic Kilauea analogy. The Marius Hills atlas identifies a specific pit in a sinuous rille but does not establish an open or continuous tube or local wall composition [R04]. The USGS Maunaulu GNIS point is a named-formation reference, not the particular flow/tube footprint [R05]. The USGS Unified Geologic Map gives only regional lunar context at 1:5,000,000 scale [R40].

**AI source-desk decision — Insufficient evidence overall (0/2).** The Earth source describes a multi-flow tube system without selecting a bounded Mauna Ulu flow; the lunar source is a pit-scale feature. The broad tube-forming process does not establish a matched surface landform. Regional map context also does not characterize the Marius pit wall. Both dimensions therefore remain null rather than receiving a forced Weak label.

Next evidence: select one dated Mauna Ulu flow/tube feature, record a source-backed map or image footprint, and compare it with the specific LROC pit at compatible physical scale. Do not infer equivalent cave dimensions, local lunar composition, or a tube interior from the regional surface records. P02 is present in the generated atlas/PDF as a reviewed but unscored record.

Limits: eruption age, weathering, material details, gravity and flow-emplacement conditions. An Earth flow is not a replica of the entire Marius volcanic complex.

### P03: Fagradalsfjall, Iceland - Marius Hills

NASA's 2025 Team Lava report adds field-method evidence from Fagradalsfjall: drone-derived topographic models, thermal mapping, rock descriptions/sampling and observation of vent rockslide scars [R41]. It does not show that the team sampled the specific 2021 vent 5b in this pair. The source record identifies vent 5b, while the lunar feature is the LROC pit in a sinuous rille ([CSV source R07](https://link.springer.com/article/10.1007/s11069-022-05798-7), [NASA R41](https://science.nasa.gov/solar-system/planetary-analogs/nasas-goddard-instrument-field-team-iceland-2025/team-lava/), [LROC R04](https://lroc.im-ldi.com/atlases/pits/1)).

**Terrain — Weak (desk-screening result):** the selected Earth feature is an eruptive vent, while the lunar feature is a pit in a sinuous rille that is interpreted as a possible lava-tube skylight. The shared volcanic context does not make these the same landform, and the Earth flow footprint and lunar comparison window are not matched. This is a material limitation for a feature-level terrain analogy.

**Geology — Not rated; insufficient evidence.** The Earth vent 5b record does not provide an accessible, feature-specific material analysis, and neither the lunar pit atlas nor the regional 1:5M lunar map establishes pit-wall composition [R04, R07, R40]. NASA's 2025 observations are from the region but do not validate materials at vent 5b [R41]. A shared volcanic setting is not sufficient to infer matching surface-material classes. P03 remains **Insufficient evidence overall** and is not rank-eligible.

The generated record retains the Weak terrain judgment and null geology. A published-source map of the 2021 flow/vent and feature-specific material evidence would be required to complete the comparison. NASA's broader drone, thermal and rock-sampling work supports possible field-method context, not a P03 geology rating.

Limits: fresh Earth lava can differ strongly from ancient lunar surfaces in weathering, cover and preservation. If a DEM is used later, its acquisition date must postdate the flow being assessed; mosaic dates require checking.

### P04: Lava Beds - Marius Hills pit

NPS documents lava flows and lava tubes at Lava Beds [S05]. NASA documents lunar cave-detection research near Medicine Lake Volcano [S03]. The cited USGS guide coordinate is for Skull Cave parking, not a surveyed cave entrance; the Marius Hills atlas identifies a pit but does not establish an accessible or continuous subsurface tube ([CSV sources R09](https://pubs.usgs.gov/sir/2017/5022/k1/sir20175022k1.pdf), [R10](https://home.nps.gov/labe/learn/nature/geology.htm), [R04](https://lroc.im-ldi.com/atlases/pits/1)).

**AI source-desk decision — Insufficient evidence overall (0/2).** The supplied Earth coordinate is Skull Cave parking, not a surveyed cave entrance, and the USGS guide's PDF text and NPS page could not be verified through the available readers. The lunar pit atlas does not establish an accessible or continuous subsurface tube. The pair is recorded as reviewed with both dimensions null, not as a Weak comparison; cave-detection research remains process/practice context only.

Identify a documented cave and surrounding surface feature. Rate only the visible/sourced surface and process evidence; do not rate underground geometry without cave surveys or equivalent evidence. Candidate practice tags: cave-detection instrument research and geological observation, conditional on source/site verification.

Limits: the Marius Hills interpretation does not provide complete underground geometry [S11]. No roof stability, habitat suitability, passage-size or safety equivalence is established.

### P05: Lake Salda - Jezero

NASA directly compares Lake Salda with Jezero, including carbonate deposits, shoreline and terrace sediments, alluvial fans and sedimentary processes [S06]. The comparison is a documented geological/process analog, not a claim that all minerals, landforms or surface conditions are identical.

**Selected scope and locators:** On Earth, use an exposed Lake Salda shoreline deposit or terrace rather than the whole lake. NASA's source identifies beach sediments along the northeastern shore, a shallow hydromagnesite carbonate bench extending about 40 m offshore, an exposed microbialite island, alluvial-fan delta deposits, an ancient-stream outcrop and a terrace deposit on the southwest peninsula [S06]. On Mars, use a named Jezero shoreline/delta feature with a source-backed locator. NASA identifies carbonate-bearing material along the western crater margins as possible ancient-shoreline deposits [S06] and identifies the delta's fan-shaped sedimentary setting, layered outcrops, Hogwallow Flats and Skinner Ridge in the Perseverance panorama and transcript [S08]. These are source-backed feature leads, not matched polygons, rover routes or proof that a Salda deposit is equivalent to a selected Jezero outcrop.

**Terrain/landform — Moderate (desk-screening result):** NASA documents Salda's exposed northeastern beach, carbonate bench and shoreline/terrace deposits, and describes possible ancient-shoreline deposits along Jezero's western margin [S06, CSV sources R12 and R13]. This supports a broad shoreline/depositional-form comparison. The specific footprints, matched scales, and terrain measurements are not established, so Strong is not supported.

**Geology/materials — Moderate (desk-screening result):** NASA reports hydromagnesite-rich Salda beach/bench deposits and possible carbonate-bearing material at Jezero's western margin [S06, CSV source R12]. This supports a broad carbonate-category comparison, but the Martian identification is tentative and does not establish the same mineral species, microbial origin, grain size, or depositional history. Strong is not supported.

**Overall — Moderate and rank-eligible.** The fixed rule yields Moderate from two Moderate dimensions. P05 is now included in the generated comparison record and PDF; the source-preserving proposed-pair row remains unchanged, and the decision is stored in `pair_review_overrides.csv`. The coordinates remain lake/crater context anchors, not points on the selected deposits. This AI desk screen does not imply exact footprints, quantitative similarity, independent review, or an approved field site.

**Remaining P05 validation for higher-resolution or independent review:**

| Dimension | Lake Salda evidence | Jezero evidence | Review requirement |
| --- | --- | --- | --- |
| Terrain/landform | Select one exposed shoreline, terrace, alluvial-fan delta or stream-deposit feature from the locators in [S06] | Select one named shoreline or delta/outcrop feature from [S06, S08] | Record feature locators, physical scale, depositional form, meaningful differences and scale uncertainty; do not use open water as terrain |
| Geology/materials | Hydromagnesite/carbonate sediments, microbialite-related deposits or documented sediment layers [S06] | Possible carbonate-bearing western-margin deposits and layered/fine-grained delta sediments [S06, S08] | Compare only source-supported material categories; do not infer life, identical minerals or unmeasured composition |
| Practice context (unscored) | Shoreline/fan/terrace observations and sample-site selection research [S06] | Perseverance delta observation, abrasion and core-sampling context [S08] | Justify each tag from evidence and state that Earth activities do not approve Mars operations |

**Optional follow-up steps:**

1. For a production comparison, choose one bounded exposed Lake Salda feature and one bounded Jezero feature; record source page, figure, caption, panorama region or map locator for each.
2. Refine terrain and geology claims separately with exact locators, similarities, differences and uncertainties. Keep climate, biology and water/ice as context rather than terrain-score inputs.
3. Keep the Moderate/Moderate label while source evidence remains at broad shoreline/carbonate-family scope; revise only when additional feature-specific sources support a different judgment.
4. Select Earth and Mars visual assets only when coverage, attribution, reuse terms and scale/field of view are known. Label different or unknown display scales.
5. The validated P05 record and matching PDF are generated from the same CSV inputs. Rebuild them after any source or review update.

**Practice use and limits:** possible tags are **sedimentary observation**, **shoreline/fan mapping** and **sample-site selection research**, subject to selected-feature review. Lake Salda's microbialites can inform questions about carbonate deposition and biosignature search locations, but Earth microbialites do not establish Martian life. Lake-water surfaces do not supply lakebed terrain measurements. Salda's current hydrology, climate, biology, gravity and atmosphere differ from ancient Jezero conditions; the analogy does not establish habitability, safety or permanent-base suitability.

**Images and optional terrain data:** [S06] supplies NASA Earth Observatory photographs of Salda shoreline sediments, the carbonate bench, microbialites, alluvial-fan deposits and a terrace; [S08] supplies a NASA/JPL/Caltech/ASU/MSSS Jezero panorama/video context assembled from Mastcam-Z images acquired on June 12, 13, 16, 17 and 20, 2022. These source pages provide attribution, but image reuse terms and calibrated display scales must be checked before importing assets. Do not present a panorama or lake photograph as a measured terrain product. No DEM is required for the first qualitative review; numerical terrain work would require selected-window coverage, units, datum, quality masks and comparable physical scales.

### P06: San Pedro delta, Atacama - Jezero

USGS explicitly identifies the San Pedro River delta in the northern Salar de Atacama basin, describes it as an ephemeral stream, and notes that flows form alluvial fans around the salt-pan margins [R16]. The EarthShots source includes Landsat scenes from 1991, 2006, and 2025 (path/row 233/76). NASA's Perseverance resource describes the Jezero delta front using a Mastcam-Z panorama assembled from 1,118 images acquired on June 12, 13, 16, 17, and 20, 2022; it identifies Hogwallow Flats and Skinner Ridge [R42]. The transcript describes a roughly 32-ft layered cliff, fine-grained delta sediments, mud and sand from the former river, and core-sampling at Skinner Ridge.

**Terrain/landform — Moderate:** both are source-identified river-fed delta/fan depositional settings. Source windows, channel shapes, physical scales, and elevation products are not matched, and the Earth feature is an ephemeral river delta entering a saline salar while Jezero's ancient delta entered a crater lake. This supports a broad landform comparison, not Strong terrain similarity.

**Geology/materials — Moderate:** the sources support broad sedimentary/alluvial deposit classes on both sides. They do not establish matched mineralogy or grain-size distributions; the salar's saline/evaporitic setting differs from Jezero's ancient lake/delta sediments. Do not substitute Salar brine, salt crust, or mining ponds for the river delta.

**Overall — Moderate and rank-eligible.** P06's source-based AI desk screen is included in the generated comparison and PDF. The Earth river gazetteer coordinate remains a context reference, not a delta coordinate; the planetary panorama is a view of named outcrops, not a georeferenced polygon or route. No similarity percentage or safety conclusion is implied.

**Practice context and limits:** possible uses are delta/depositional-landform mapping and sedimentary outcrop observation, with the evidence and caveats in the practice CSV. Keep salinity, episodic flows, basin geometry, age, material chemistry, and Martian preservation differences visible. Aridity alone is not evidence of a delta match.

### P07: Copper Canyon fan - Peace Vallis fan

NASA/JPL explicitly compares Death Valley alluvial fans with fan deposits at Gale, explaining channels, erosion and sediment transport [S09]. Copper Canyon-Peace Vallis is TerraTwin's proposed specific pairing, not a published assessment of these two named fans together. This remains the recommended first comparison because the intended process and landform are documented on both bodies.

The USGS identifies Copper Canyon as an alluvial fan with radial drainage and downslope sediment grading [S12]. Its regional study describes the fan and its sediment sources [S13]. Palucis et al. map the Peace Vallis fan and report approximately 80 km2 total area, comprising 49 km2 upper and 31 km2 lower fan [S14]. The USGS estimates the entire Copper Canyon fan at about 2 square miles (approximately 5.2 km2) [S13]. These whole-fan area estimates show a meaningful scale difference; they are context, not rating inputs that produce a percentage.

The website's Earth map uses a **Copper Canyon valley-mouth regional locator** from a secondary presentation of the USGS GNIS record [S27]. It is not a surveyed fan centroid, boundary or field access point. The National Park Service currently lists Copper Canyon as closed to the public [S28]; a possible field-practice use is not an access recommendation.

**Terrain/landform — Moderate (desk-screening result):** the USGS documents Copper Canyon's radial drainage and coarse-to-fine fan deposits [S12, S13], while Palucis et al. map upper/lower Peace Vallis fan units and associated channels [S14]. These are feature-applicable sources for a broad alluvial-fan comparison. The reported whole-fan areas differ substantially (about 5.2 km² vs. 80 km²), and matched subareas, relief, slopes, and image scales are not established, so Strong is not supported.

**Geology/materials — Moderate (desk-screening result):** the sources support comparison at the broad alluvial-fan sediment/deposit-class level [S13, S14], but do not establish matching source lithology or mineralogy for the selected windows. This unresolved provenance and scale difference prevents Strong; it does not by itself justify Weak without feature-specific evidence of a material mismatch.

**Overall — Moderate and rank-eligible.** The rubric yields Moderate from two Moderate dimensions. P07 is included in the generated comparison and PDF with an AI desk-screen attribution; the original proposed-pair row is preserved and the review is recorded in `pair_review_overrides.csv`. The fan-center coordinates remain context-only. No matched terrain measurements, access recommendation, or independent expert review is claimed.

**Current implementation: qualitative heuristic comparison.** Apply `terrain-geology-qual-v1` from `spec.md`; no elevation raster, DEM download, slope/roughness calculation or equal-area polygon is required. The local `data/raw/earth/` and `data/raw/mars/` download folders were removed at the user's request because they are not required for this profile. The inspected Earth tile did not establish Copper Canyon fan coverage, and the Gale HRSC `.part` file was incomplete. Neither was used to derive observations or ratings. Research documents and metadata elsewhere in `data/raw/` are retained.

The following checks remain useful for a higher-resolution or independent P07 review:

| Dimension | Copper Canyon evidence | Peace Vallis evidence | Review requirement |
| --- | --- | --- | --- |
| Terrain/landform | Named fan locator, radial drainage and depositional form [S12, S13] | Mapped fan units and channel-related features [S14, Figures 2 and 5] | Describe corresponding features, scale and preservation differences; do not infer matching slope or roughness without measurements |
| Geology/materials | Published fan deposits and sediment-source descriptions [S13] | Published deposit/material interpretations at the selected fan units [S14] | Compare the supported deposit classes and uncertainty; a common fan label does not establish identical rocks or minerals |
| Practice context (unscored) | Selected feature evidence above | Selected feature evidence above | Justify each proposed mapping/observation tag and its limits; do not infer traversability or training approval |

Completion steps for the current profile:

1. Record source-backed locators for both named fan deposits, using cited maps, figures or image footprints. Distinguish fan deposits from source channels and adjacent terrain; exact GIS polygons are optional.
2. Record each terrain/geology claim with its source ID and exact page, figure, map unit or caption. State similarities, meaningful differences and unresolved evidence.
3. If new evidence changes either dimension, record the source and rationale, reviewer and date, and reapply the overall-label and `terrain-first-v1` ordering rules from `spec.md`. Downloading a raster alone does not establish a rating.
4. Select sourced images with known feature coverage, attribution, reuse terms and scale/field of view when available. Clearly label mismatched or unknown display scales.
5. The current P07 comparison and PDF are generated from the same validated dataset record. Rebuild them after any source or rating changes.

No similarity percentage is required or implied.

Optional future quantitative work: NASA's SRTMGL1 tile **N36W117.SRTMGL1.hgt** [S16] and the USGS **MSL_Gale_DEM_Mosaic_1m_v3** [S17] remain retrieval leads; neither has verified terrain at a selected fan window. The previously proposed HiRISE DTM **DTEED_062963_1760_062172_1760_A01** is described as **channel** terrain [S15, S18], so it is not confirmed fan-deposit coverage. Reintroduce raster collection only for a separately scoped numerical analysis with checked coverage, units, quality and comparable physical scales.

Visual leads: the USGS Copper Canyon fan image states a 1:48,000 source scale and public-domain use [S12]. Palucis et al., Figure 2, identifies CTX image P22_009571_1756_XI_04S222W at 6 m/pixel [S14]. Those source scales are not calibrated scale bars for a displayed thumbnail. Verify image coverage, georeferencing and reuse terms before cropping or publishing; label differing display scales.

P07's Moderate labels are AI source desk-screening judgments, not independent review. Exact feature windows and georeferenced fan polygons remain future validation work; these do not turn the existing broad evidence into a Strong score.

Limits: Earth rainfall and sediment transport do not reproduce current Martian conditions; a fan is not automatically a delta or lakebed. Quantitative mobility claims require finer terrain and surface-property evidence than broad topography alone.

### P08: Lake Untersee - ancient Gale lake

The NASA-hosted research abstract explicitly discusses Lake Untersee in a cold-climate hypothesis for ancient Gale lakes [S10, CSV source R25]. The hypothesis tests how a body of water might persist beneath ice under specified conditions; the NASA record identifies it as an abstract/model, not a field observation of ice-covered Gale.

**Desk-review decision — process context only; no terrain/geology ratings.** The Earth source describes a modern ice-covered lake with submerged microbial mats [CSV source R24], while the Mars source is a model hypothesis and does not locate a corresponding Gale lake deposit or confirm ice cover. These records do not support either C01 terrain or C02 geology for a named feature pair. Keep P08 outside the scored-comparison catalog; do not assign Strong, Moderate, or Weak to force a result.

Limits: this is a hypothesis about ancient environmental conditions, not proof that Gale's lake was ice-covered or that modern surfaces match. A DEM over lake ice does not measure the submerged sedimentary surface.

## Optional terrain data products: retrieval leads, not downloaded inputs

| Use | Starting product/source | Required checks |
| --- | --- | --- |
| Earth terrain within SRTM coverage | [SRTMGL1 V003 search](https://search.earthdata.nasa.gov/search?q=SRTMGL1) | Version/granules, source flags, acquisition epoch, datum, void filling and footprint. Grid spacing is 1 arc-second, approximately 30 m, not uniform 30 m ground spacing. |
| Haughton and Iceland terrain | [ArcticDEM](https://www.pgc.umn.edu/data/arcticdem/) | Exact strip/tile coverage, acquisition dates, mosaic time range, artifacts, quality masks, height reference and terms. Haughton is outside SRTM's northern limit. |
| Antarctic surface terrain | [REMA](https://www.pgc.umn.edu/data/rema/) | Surface versus lakebed interpretation, footprint, time range, quality and height reference. Availability alone does not make P08 rankable. |
| Lunar terrain | [LOLA GDR documentation](https://ode.rsl.wustl.edu/moon/pagehelp/content/Missions_Instruments/LRO/LOLA/GDR/Intro.htm) | Product type, detached labels, scaling/offset, lunar coordinate convention, projection, effective resolution and sampling |
| Broad Martian terrain | [MOLA MEGDR](https://pds-geosciences.wustl.edu/missions/mgs/megdr.html) | Scale suitability: 128 pixels/degree is coarse regional context, not a rover-scale terrain survey. Select local orbital stereo DTMs if finer analysis is required. |
| Geological evidence | Maps and publications cited for the selected feature | Map scale, unit descriptions, exact locator, uncertainty, material interpretation and reuse terms |

SRTM coverage is approximately 60 degrees N to 56 degrees S; it cannot cover Haughton, Iceland or Antarctica. ArcticDEM and REMA are digital surface models, so the measured surface and acquisition time must be recorded. Do not upsample a coarse DEM and describe the output as newly measured fine terrain.

For optional numerical terrain work, use body-appropriate coordinates/projections. Recompute slope/roughness consistently on comparable physical supports; a shared metric name or output pixel size does not establish equivalent spatial resolution. Retain no-data and quality masks, and record the valid-data fraction. These products are not required for the first qualitative rating.

## Manual qualitative collection and review workflow

1. Start with P07, then a volcanic surface pair. Name one bounded feature on each body and record a source-backed locator, such as a map unit, figure or image footprint. State the proposed field-practice use.
2. Collect primary geology and terrain/landform evidence for each feature. Record exact pages, figures, units or image IDs, source URLs, publication dates, scale/field of view when known, and attribution.
3. For each dimension, write the corresponding evidence, meaningful differences and uncertainty. Apply the Strong/Moderate/Weak/Insufficient rubric in `spec.md`; use null plus a reason when evidence is absent. Record reviewer and review date.
4. Apply the overall-label and terrain-first ordering rules only to reviewed records with both dimensions rated. Keep unreviewed candidates and insufficient-evidence records separate. Do not use inferred percentages or treat a regional analogy as validation of a selected pair.
5. Review imagery separately: acquisition date, spatial scale/field of view, license and credits. Mark scale mismatches. If an image contributes to a terrain judgment, its location and scale must be known.
6. Generate web/PDF output from the same validated comparison. Show feature locators, evidence gaps, proposed versus documented relationships, practice-tag support, and why a record is unranked when applicable.
7. If numerical terrain work is added later, follow the product catalog to exact tiles and retrieve the rasters. Inspect coordinates, projection, units, no-data, local source resolution and quality; choose comparable physical scales before computing values. Record successful retrieval and processing provenance. Keep large rasters outside Git.

## Source index and claim boundaries

These are mostly primary agency/research sources reviewed in the conversation on 2026-11-14; S27 is a secondary GNIS coordinate lead. Source existence and readable text are distinct from successful raster downloads, redistribution permission or quantitative validation. Old publications support the stated historical research, not current mission schedules or operational approvals.

- **S01 - NASA technical report (2011):** [Evaluation of Robotic Systems to Carry Out Traverse Execution, Opportunistic Science, and Landing Site Evaluation Tasks](https://ntrs.nasa.gov/api/citations/20110011887/downloads/20110011887.pdf?attachment=true), NASA/TM-2011-216157. Table 3 supports Haughton-Shackleton relevance and documents limits. It does not establish identical geology or modern base suitability.
- **S02 - USGS publication record (1994):** [Development of lava tubes in the light of observations at Mauna Ulu, Kilauea Volcano, Hawaii](https://pubs.usgs.gov/publication/70017657). Supports Earth lava-tube development, not a measured Marius match.
- **S03 - NASA:** [Planetary Analog Explorer](https://science.nasa.gov/solar-system/analog-explorer/). Supports Medicine Lake lunar cave research and Kilauea lunar volcanic fieldwork. Its Kilauea illustration uses Hadley Rille; do not cite it as direct validation of Marius Hills.
- **S04 - NASA:** [Fieldwork Spotlight: Iceland](https://science.nasa.gov/solar-system/planetary-analogs/nasas-goddard-instrument-field-team-iceland-2025/). Supports Fagradalsfjall volcanic vent/flow research for planetary comparison, not an exact validated Marius pair.
- **S05 - NPS:** [Geology - Lava Beds National Monument](https://home.nps.gov/labe/learn/nature/geology.htm). Supports the Earth volcanic setting and lava tubes, not lunar cave geometry.
- **S06 - NASA Earth Observatory (2021):** [What a Lake in Turkey Can Tell Us about Mars](https://science.nasa.gov/blogs/earth-matters/2021/02/17/what-a-lake-in-turkey-can-tell-us-about-mars/). Direct Lake Salda-Jezero carbonate and depositional comparison; no proof of Martian life or identical terrain.
- **S07 - USGS EROS:** [Salar de Atacama, Chile](https://eros.usgs.gov/earthshots/salar-de-atacama-chile). Documents the San Pedro River delta and basin setting; not direct validation against Jezero.
- **S08 - NASA:** [Perseverance Explores the Jezero Crater Delta](https://science.nasa.gov/resource/perseverance-explores-the-jezero-crater-delta/). Supports the Martian delta/sedimentary interpretation and imagery context.
- **S09 - NASA/JPL (2012):** [River Fans on Earth and Mars](https://www.jpl.nasa.gov/videos/river-fans-on-earth-and-mars/). Direct Death Valley-Gale alluvial-fan comparison; does not validate the specific Copper Canyon-Peace Vallis pair.
- **S10 - NASA NTRS research abstract:** [The Antarctic Analogy for Ancient Lakes at Gale Crater, Mars](https://ntrs.nasa.gov/search.jsp?R=20190025827). Direct Lake Untersee process/model analogy; no confirmation of an ice-covered Gale lake or terrain equivalence.
- **S11 - NASA APOD (2017):** [Marius Hills: Holes in the Moon](https://science.nasa.gov/image-article/apod-2017-october-25-marius-hills-holes-in-the-moon/). Supports the pit/lava-tube interpretation, not complete measured underground geometry or verified habitation conditions.
- **S12 - USGS:** [Copper Canyon Fan](https://www.usgs.gov/media/images/copper-canyon-fan). Describes fan morphology, drainage and sediment grading; supplies source-image scale and use status, not a measured Mars match.
- **S13 - USGS (1965):** [Alluvial Fans in the Death Valley Region, California and Nevada](https://pubs.usgs.gov/pp/0466/report.pdf), Professional Paper 466. Describes Copper Canyon fan geology and estimates its total area at about 2 square miles; use the mapped fan rather than assuming adjacent canyon terrain is part of the deposit.
- **S14 - Palucis et al. (2014):** [The origin and evolution of the Peace Vallis fan system that drains to the Curiosity landing area, Gale Crater, Mars](https://agupubs.onlinelibrary.wiley.com/doi/full/10.1002/2013JE004583), Journal of Geophysical Research: Planets. Table 2 gives whole-fan areas; Figure 2 identifies CTX imagery, and Figure 5 maps upper/lower fan units.
- **S15 - HiRISE:** [Peace Vallis in Gale Crater stereo DTM catalog entry](https://www.uahirise.org/dtm/ESP_062963_1760). Lists DTEED_062963_1760_062172_1760_A01 and its center/map scale; these do not establish fan coverage.
- **S16 - NASA LP DAAC:** [SRTMGL1 v003 Earthdata granule search](https://search.earthdata.nasa.gov/search/granules?p=C2763266360-LPCLOUD&pg[0][v]=f&pg[0][id]=*N36W117*&pg[0][gsk]=-start_date&q=SRTMGL1) returns N36W117.SRTMGL1.hgt; the [SRTM Collection User Guide](https://lpdaac.usgs.gov/documents/179/SRTM_User_Guide_V3.pdf) defines tile naming, posting, units and EGM96 reference. Catalog presence is not a successful download or pixel-validity check.
- **S17 - USGS Astrogeology:** [Mars MSL Gale Merged DEM 1m, version 3](https://astrogeology.usgs.gov/search/map/mars_msl_gale_merged_dem_1m). Catalog gives bounds, coordinate convention, grid spacing, units, source mix and lower-resolution fallback. Its broad bounds do not establish selected-window coverage or local effective resolution.
- **S18 - HiRISE:** [April 2020 DTM release summary](https://www.uahirise.org/dtm/summaries/HIRISE_DTM_PDS_April_2020.pdf). Labels the ESP_062963_1760 DTM as Peace Vallis channel terrain, not verified fan deposits.
- **S19 - LROC/Arizona State University (2022):** [Traversing the Shackleton-de Gerlache Ridge](https://lroc.im-ldi.com/images/1247). Identifies a specific Shackleton rim image at 89.684°S, 196.739°E (positive-east), 750 m wide; describes its mapped blocks as *likely* ejecta and links the 1:8,000 geomorphic map. The image does not establish rock composition or a safe route. Credit: NASA/GSFC/Arizona State University.
- **S20 - LROC RDR catalog:** [Shackleton Crater Rim Potential Landing Site for ESA Lunar Lander DTM](https://data.lroc.im-ldi.com/lroc/view_rdr_product/NAC_DTM_ESALL_SR12). Lists NAC_DTM_ESALL_SR12 at 2 m/pixel and bounding coordinates; the [product group](https://data.lroc.im-ldi.com/lroc/view_rdr/NAC_DTM_ESALL_SR12) offers orthoimages, confidence map and readme. Catalog bounds are not a valid-pixel or vertical-reference check.
- **S21 - Zuber et al. (2012):** [Constraints on the volatile distribution within Shackleton crater at the lunar south pole](https://ntrs.nasa.gov/api/citations/20120013758/downloads/20120013758.pdf), Nature research letter, Figure 1 and pages 1–2. LOLA observations describe Shackleton as a well-preserved simple crater, with rim/wall/floor differences and permanently shadowed interior; crater-wide observations do not prove the material class or slope of the selected LROC rim footprint.
- **S22 - Fong et al., NASA/AIAA:** [Robotic Follow-up for Human Exploration](https://ntrs.nasa.gov/api/citations/20110008151/downloads/20110008151.pdf), Figures 21–22 and 28–29, printed pages 16–21. Maps Haughton Site A and Locale 7, documents the bouldered shelf and rover access difficulty, and reports host carbonate marker beds and field mapping. Locale 7 is approximately 2 km northwest of HMP base camp; this relative locator is not a surveyed footprint or pixel-scale image width. The CSV retains an approximate offset based on an assumed 315° bearing for research context. The app plots the HMP station as a labeled context anchor rather than plotting that proxy as Locale 7. The source's Site B breccia observations do not describe Locale 7.
- **S23 - LROC/Arizona State University:** [Terms of Use & Citation Policy](https://lroc.im-ldi.com/about/terms). Featured-site images are copyrighted but permitted for educational use with NASA/GSFC/Arizona State University credit; commercial use needs permission. PDS-delivered LROC data products are public domain. This does not clear rights for NASA report figures or other providers' image layers.
- **S24 - NASA NTRS:** [Record for *Robotic Follow-up for Human Exploration*](https://ntrs.nasa.gov/citations/20110008151), document 20110008151. Its copyright metadata states “Public Use Permitted.” This supports use of the report and its Figure 28; it does not assert that every embedded item is public domain.
- **S25 - NASA STI:** [Disclaimers, Copyright Notice, and Terms and Conditions of Use](https://sti.nasa.gov/disclaimers/). NASA explains that an available report may contain separately copyrighted material and asks that NASA be acknowledged as a source. No separately marked rights restriction was found on Figure 28.
- **S26 - NASA NTRS:** [TRIDENT Drill Validation at Mars and Lunar Analog Field Sites](https://ntrs.nasa.gov/citations/20240000585). Gives Haughton crater's regional center as 75°22′N, 89°41′W. This point is only for map orientation and does not locate Site A or Locale 7.
- **S27 - AnyplaceAmerica, citing USGS GNIS:** [Copper Canyon, Inyo County, California](https://www.anyplaceamerica.com/directory/ca/inyo-county-06027/valleys/copper-canyon-240905/). Presents GNIS valley-mouth point 36.1285645°N, 116.7536577°W. This secondary coordinate lead orients the map; it does not identify the fan polygon or a field access location. Verify against the direct GNIS record before scientific georeferencing.
- **S28 - National Park Service:** [Death Valley National Park rules and regulations](https://www.nps.gov/deva/learn/management/rules-and-regulations.htm). Lists Copper Canyon as closed to the public. Access status may change; this source cannot establish a safe or permitted practice site.

The expanded CSV source register also includes **R40**, the USGS Unified Geologic Map of the Moon (1:5M regional map; not pit-wall evidence); **R41**, NASA's 2025 Team Lava fieldwork report; and **R42**, NASA's Perseverance Jezero-delta panorama and transcript. R42 documents named outcrops and sediment observations. These additions are included in [sources.csv](TerraTwin_Earth_Moon_Mars_Analog_Data_2026-11-14/sources.csv) and referenced from the pair evidence records.

## Ready-to-rate checklist

- [ ] Both named features have source-backed locators and a recorded review.
- [ ] Terrain/landform evidence applies to both features; similarities, differences and scale limits are stated.
- [ ] Geological evidence applies to both features; corresponding deposit/material classes and uncertainty are stated.
- [ ] Both dimension labels cite evidence, give rationale and use the versioned rubric; missing labels have null reasons.
- [ ] The overall label and terrain-first order follow the rubric; unreviewed and insufficient-evidence records stay outside ranked results.
- [ ] Explanation, practice tags, imagery and PDF preserve evidence references and limitations.

This checklist is project-wide. The current branch publishes all eight AI desk-screen records and matching PDFs. P01 and P05-P07 have two rated dimensions and are ranked; P03 has only a Weak terrain judgment; P02, P04, and P08 have null dimensions and remain unranked. All terrain images remain pending. The eight curated pairs do not satisfy the separate bounded automated-discovery milestone in `spec.md`; that requires additional candidate inputs and a reproducible search beyond this list.
