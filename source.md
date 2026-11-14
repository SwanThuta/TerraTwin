# TerraTwin: dimensions, eight analog pairs, and source plan

Research review date: 2026-11-14.

Status: research shortlist and implementation plan. Public sources support the facts and interpretations identified below; they do not establish eight measured terrain matches. This document supplies research inputs for `spec.md`, not a replacement scoring profile. No similarity percentages, approved footprints, or completed retrievals are claimed here.

## Selected dimensions

| Dimension | First implementation | Evidence required |
| --- | --- | --- |
| Terrain and topography | Primary scored dimension: slope, local relief for interpretation, and/or one explicitly defined roughness metric | Comparable DEM-derived measurements, study footprints, physical scales, units, quality masks, and processing versions |
| Geology and surface materials | Second scored dimension: documented geological units and material classes | Geological maps or published observations for the selected footprint; a reviewed, versioned compatibility table |
| Geological processes | Qualitative explanation: impacts, lava emplacement, erosion, sediment transport and deposition | Published evidence connecting a process to each selected feature; distinguish observations from interpretations |
| Exploration activities | Evidence-backed practice tags, not another score | A cited reason the selected evidence could support sampling, mapping, instrument trials or terrain-navigation research |

Mineralogy can support geology when measured or published; it is not inferred from image color. Terrain includes landform shape, but a crater, cave or fan label alone is not a numeric terrain measurement. Local relief describes elevation differences within a footprint; absolute elevation against different planetary datums is not a direct similarity criterion.

Temperature/illumination, water/ice, biology/habitability, and cave geometry remain optional context or specialized evidence. They do not affect the first score. In particular, a surface DEM does not measure underground passage dimensions or the bottom of a water-covered lake. Earth does not reproduce lunar or Martian gravity, atmosphere/vacuum, or radiation.

### Scoring contract

Follow `spec.md`: fixed heuristic weights are 2/3 terrain and 1/3 geology. Both dimensions must be comparable before ranking; otherwise coverage is below 1, the overall score is `null`, and the record appears as insufficient evidence. Missing evidence is never zero. Disclose missing slope/roughness subcriteria even when a terrain dimension is available. Do not add relief, process or practice-tag weights without changing and reviewing the scoring contract.

A numeric criterion uses the specification's documented tolerance rule. Tolerances and geological category compatibility are heuristic choices requiring justification and versioning. Do not turn descriptions such as "basaltic" or "impact crater" into invented similarity percentages. Practice filters do not change scores. Use the same validated record and provenance for the website and PDF.

## Four planetary targets and eight Earth sites

Moon targets: Shackleton crater and Marius Hills. Mars targets: Jezero crater and Gale crater. These are exploration/research targets, not approved permanent-base locations.

The requested Earth regions are represented by Haughton, Death Valley, Antarctica, Atacama, Iceland and Hawaii. The two additional Earth sites are Lava Beds National Monument and Lake Salda. "Houton" is interpreted as Haughton Crater on Devon Island, Canada.

| Pair ID | Planetary feature | Earth location | Relationship supported by sources | Initial assessment |
| --- | --- | --- | --- | --- |
| P01 | Shackleton: impact terrain and traverse context | Haughton Crater, Devon Island, Canada | Directly documented Shackleton-relevant analog relationship [S01] | Terrain candidate; materials and morphology require explicit comparison |
| P02 | Marius Hills: volcanic surfaces | Mauna Ulu lava-flow area, Kilauea, Hawaii | Documented lava-tube development and broader lunar volcanic analog work [S02, S03] | Proposed specific Marius pairing; terrain/geology candidate |
| P03 | Marius Hills: volcanic surfaces and vents | Fagradalsfjall lava-flow terrain, Iceland | NASA studies these flows/vents for lunar and Martian comparisons [S04] | Proposed specific Marius pairing; terrain/geology candidate |
| P04 | Marius Hills pit region: volcanic cave exploration | Lava Beds National Monument, California, USA | Lunar cave-detection research near Medicine Lake Volcano and documented lava tubes [S03, S05] | Proposed specific Marius pairing; feature/process evidence first |
| P05 | Jezero: carbonate-bearing margin and sedimentary features | Lake Salda, Turkiye | Explicit Jezero comparison involving carbonates and sediment deposition [S06] | Strong geological/process lead; exposed terrain footprint still needed |
| P06 | Jezero: deltaic deposits | San Pedro River delta, Salar de Atacama, Chile | Earth delta documented by USGS [S07]; Jezero delta documented by NASA [S08] | Proposed comparison, not a source-validated exact pair |
| P07 | Gale: river-fan deposits | Death Valley alluvial-fan terrain, California, USA | Explicit Death Valley-Gale comparison by a Curiosity scientist [S09] | Priority terrain/geology candidate; choose one named fan footprint |
| P08 | Gale: possible ancient ice-covered lake conditions | Lake Untersee, Antarctica | Explicit published Antarctic analogy for ancient Gale lakes [S10] | Context/process case; not currently eligible for terrain ranking |

The distribution is intentionally one Earth site for Shackleton, three for Marius Hills, two for Jezero, and two for Gale. Eight Earth sites do not imply two equally strong or rankable sites for every target. The two-Earth-site UI should operate where two eligible records actually exist; it must not manufacture a second ranked match.

## Pair evidence and limits

### P01: Haughton - Shackleton

NASA's 2011 technical report explicitly identifies Haughton's crater scale, impact features and outpost/traverse relevance to Shackleton. See Table 3, PDF page 27 [S01]. The report also identifies substantial material differences; it is not evidence of equivalent rock composition or all crater morphology. Haughton is a modified terrestrial complex impact structure, so whole-crater similarity must not be assumed.

Select a mapped rim, terrace or traverse segment on each body before extracting slope/roughness. Review impact breccias and target-rock evidence separately. Candidate practice tags: impact-landform observation, geological sampling procedures and robotic mapping research. These need selected-feature evidence before use in the app.

Limits: terrestrial weathering, geology, atmosphere and lighting; no recreation of Shackleton's permanent shadow, vacuum or thermal environment. Analog outpost research does not establish actual base suitability.

### P02: Mauna Ulu, Hawaii - Marius Hills

USGS documents lava-tube development in the Mauna Ulu eruption field [S02]. NASA describes Kilauea as a lunar volcanic fieldwork analog, but its gallery example uses Hadley Rille rather than validating a Marius Hills match [S03]. Assigning Mauna Ulu to Marius Hills is TerraTwin's proposed process comparison, supported by the lunar volcanic/pit interpretation in [S11].

Select a dated, mapped flow surface. Compare surface slope and roughness at a defensible common scale, then review mapped materials. Candidate practice tags: lava-surface mapping and geological observation. Do not infer equivalent cave dimensions from the surrounding surface.

Limits: eruption age, weathering, material details, gravity and flow-emplacement conditions. An Earth flow is not a replica of the entire Marius volcanic complex.

### P03: Fagradalsfjall, Iceland - Marius Hills

NASA's GIFT fieldwork account describes study of Fagradalsfjall vents and lava flows for comparison with volcanic features on Mars and the Moon [S04]. That supports a volcanic-process analog, not an independently established Marius-specific match.

Choose a particular eruption/flow footprint with an acquisition date. Use surface volcanic terrain for the first comparison; do not substitute Vatnajokull glacier topography or treat Iceland as one site. Candidate practice tags: volcanic-landform mapping and instrument characterization, supported by the fieldwork description.

Limits: fresh Earth lava can differ strongly from ancient lunar surfaces in weathering, cover and preservation. The selected DEM must postdate the flow being assessed; mosaic dates require checking.

### P04: Lava Beds - Marius Hills pit

NPS documents lava flows and lava tubes at Lava Beds [S05]. NASA documents lunar cave-detection research near Medicine Lake Volcano [S03]. These establish relevant feature/process research; the specific Marius pairing remains proposed, and the exact NASA field site must not be assumed to coincide with a chosen park cave without checking its locator.

Select a documented cave and surrounding surface footprint. A surface DEM can support a surface-only terrain comparison. Interior geometry requires a cave survey, lidar or other suitable measurements. Candidate practice tags: cave-detection instrument research and geological observation, conditional on source/site verification.

Limits: the Marius Hills interpretation does not provide complete underground geometry [S11]. No roof stability, habitat suitability, passage-size or safety equivalence is established.

### P05: Lake Salda - Jezero

NASA directly compares Lake Salda with Jezero, including carbonate deposits, alluvial fans and sedimentary processes [S06]. This is a documented geological/process analog, not a claim that either all minerals or all surface forms are identical.

Choose exposed shoreline, terrace or fan deposits rather than the whole lake. Pair each with an explicitly selected Jezero feature. Candidate practice tags: sedimentary observation and sample-site selection research. Add mineral categories only at the level supported by published evidence.

Limits: lake-water surfaces do not supply lakebed terrain measurements, and Earth microbialites do not establish Martian life. Do not compare Salda's current climate with ancient Jezero as though both were simultaneous observations.

### P06: San Pedro delta, Atacama - Jezero

USGS describes the San Pedro River delta and ephemeral water delivery at Salar de Atacama [S07]. NASA documents Jezero's ancient delta and sedimentary rocks [S08]. Those sources support a hypothesis to test; neither alone establishes compatibility between the two specific footprints.

Select depositional features, identify their geological setting, exclude mining infrastructure and artificial surfaces, and assess whether terrain scale and processes are comparable. Candidate practice tag: depositional-landform interpretation, after review. Aridity can be sourced context, not evidence of matching delta geology.

Limits: salt-flat chemistry, episodic flows, depositional history and preservation may differ. Do not label the entire Atacama Desert a Jezero delta analog.

### P07: Death Valley fans - Gale

NASA/JPL explicitly compares Death Valley alluvial fans with fan deposits at Gale, explaining channels, erosion and sediment transport [S09]. This is the recommended first complete comparison because the intended process and landform are identified on both bodies.

Use the source imagery/transcript to identify one Earth fan and the corresponding Gale study area; record the locator rather than guessing the fan name. Review selected deposits, derive comparable terrain measurements, and document scale limitations. Candidate practice tags: channel/fan mapping, sedimentary observation and terrain-navigation research.

Limits: Earth rainfall and sediment transport do not reproduce current Martian conditions; a fan is not automatically a delta or lakebed. Quantitative mobility claims require finer terrain and surface-property evidence than broad topography alone.

### P08: Lake Untersee - ancient Gale lake

The NASA-hosted research abstract explicitly discusses Lake Untersee in a cold-climate hypothesis for ancient Gale lakes [S10]. This supports studying how liquid water could persist beneath ice under specified model conditions.

Keep this pair as an unranked process/context case unless compatible terrain and geology are obtained independently. Cite the model assumptions in the explanation. Lake-ice or hydrological observations cannot replace the two required scoring dimensions.

Limits: this is a hypothesis about ancient environmental conditions, not proof that Gale's lake was ice-covered or that modern surfaces match. A DEM over lake ice does not measure the submerged sedimentary surface.

## Data products: retrieval leads, not downloaded inputs

| Use | Starting product/source | Required checks |
| --- | --- | --- |
| Earth terrain within SRTM coverage | [SRTMGL1 V003 search](https://search.earthdata.nasa.gov/search?q=SRTMGL1) | Version/granules, source flags, acquisition epoch, datum, void filling and footprint. Grid spacing is 1 arc-second, approximately 30 m, not uniform 30 m ground spacing. |
| Haughton and Iceland terrain | [ArcticDEM](https://www.pgc.umn.edu/data/arcticdem/) | Exact strip/tile coverage, acquisition dates, mosaic time range, artifacts, quality masks, height reference and terms. Haughton is outside SRTM's northern limit. |
| Antarctic surface terrain | [REMA](https://www.pgc.umn.edu/data/rema/) | Surface versus lakebed interpretation, footprint, time range, quality and height reference. Availability alone does not make P08 rankable. |
| Lunar terrain | [LOLA GDR documentation](https://ode.rsl.wustl.edu/moon/pagehelp/content/Missions_Instruments/LRO/LOLA/GDR/Intro.htm) | Product type, detached labels, scaling/offset, lunar coordinate convention, projection, effective resolution and sampling |
| Broad Martian terrain | [MOLA MEGDR](https://pds-geosciences.wustl.edu/missions/mgs/megdr.html) | Scale suitability: 128 pixels/degree is coarse regional context, not a rover-scale terrain survey. Select local orbital stereo DTMs if finer analysis is required. |
| Geological evidence | Maps and publications cited for the selected feature | Map scale, unit descriptions, exact locator, uncertainty, material interpretation and reuse terms |

SRTM coverage is approximately 60 degrees N to 56 degrees S; it cannot cover Haughton, Iceland or Antarctica. ArcticDEM and REMA are digital surface models, so the measured surface and acquisition time must be recorded. Do not upsample a coarse DEM and describe the output as newly measured fine terrain.

For planetary data, use body-appropriate coordinates/projections. Recompute slope/roughness consistently on comparable physical supports; a shared metric name or output pixel size does not establish equivalent spatial resolution. Retain no-data and quality masks, and record the valid-data fraction.

## Manual collection and review workflow

1. Start with P07, then a volcanic surface pair. Choose one bounded feature on each body, its coordinate convention, physical area and geological objective. Approve footprints before deriving values.
2. Follow the product catalog to the covering granules/tiles. For SRTM, use Earthdata Login if required by the provider; this does not add a login flow to TerraTwin. Download the data and associated labels/metadata. Record an actual successful retrieval before marking access verified.
3. Inspect rasters in GIS software: body, projection, units, scale factors, date, no-data, quality masks, footprint coverage and effective resolution. Planetary layers must not be assigned an Earth coordinate system.
4. Select a common defensible analysis scale and one terrain method. Keep source resolution, resampling method, output spacing and roughness neighborhood explicit. Mask invalid data and account for edge effects. Choose a higher-resolution source or leave the result unscored when scale is inadequate.
5. Identify mapped geology or published interpretation at the selected footprint. Record the exact page, figure, map unit or table. Review category compatibility and document both similarities and mismatches.
6. Save provenance: source/product IDs and versions, URLs, access and acquisition dates, checksum, coordinate reference, units, footprint, processing settings/version, quality notes, license and attribution. Keep large rasters outside Git; commit permitted manifests and reproducible processing instructions.
7. Populate observations without invented values. Use null plus a reason for absent/incompatible evidence. Apply the specification's coverage rules before generating rankings, explanations or PDFs.
8. Review imagery separately: acquisition date, spatial scale/field of view, license and credits. Mark scale mismatches; illustrative photos are not numeric measurements.
9. Generate web/PDF output from the same validated comparison. Show evidence gaps, proposed versus documented relationships, and why a record is unranked. Review practice tags for evidence and avoid implying training approval or safety.

## Source index and claim boundaries

These are primary agency/research sources reviewed in the conversation on 2026-11-14. Source existence and readable text are distinct from successful raster downloads, redistribution permission or quantitative validation. Old publications support the stated historical research, not current mission schedules or operational approvals.

- **S01 - NASA technical report (2011):** [Evaluation of Robotic Systems to Carry Out Traverse Execution, Opportunistic Science, and Landing Site Evaluation Tasks](https://ntrs.nasa.gov/api/citations/20110011887/downloads/20110011887.pdf?attachment=true), NASA/TM-2011-216157. Table 3 supports Haughton-Shackleton relevance and documents limits. It does not establish identical geology or modern base suitability.
- **S02 - USGS publication record (1994):** [Development of lava tubes in the light of observations at Mauna Ulu, Kilauea Volcano, Hawaii](https://pubs.usgs.gov/publication/70017657). Supports Earth lava-tube development, not a measured Marius match.
- **S03 - NASA:** [Planetary Analog Explorer](https://science.nasa.gov/solar-system/analog-explorer/). Supports Medicine Lake lunar cave research and Kilauea lunar volcanic fieldwork. Its Kilauea illustration uses Hadley Rille; do not cite it as direct validation of Marius Hills.
- **S04 - NASA:** [Fieldwork Spotlight: Iceland](https://science.nasa.gov/solar-system/planetary-analogs/nasas-goddard-instrument-field-team-iceland-2025/). Supports Fagradalsfjall volcanic vent/flow research for planetary comparison, not an exact validated Marius pair.
- **S05 - NPS:** [Geology - Lava Beds National Monument](https://home.nps.gov/labe/learn/nature/geology.htm). Supports the Earth volcanic setting and lava tubes, not lunar cave geometry.
- **S06 - NASA Earth Observatory (2021):** [What a Lake in Turkey Can Tell Us about Mars](https://science.nasa.gov/blogs/earth-matters/2021/02/17/what-a-lake-in-turkey-can-tell-us-about-mars/). Direct Lake Salda-Jezero carbonate and depositional comparison; no proof of Martian life or identical terrain.
- **S07 - USGS EROS:** [Salar de Atacama, Chile](https://eros.usgs.gov/earthshots/salar-de-atacama-chile). Documents the San Pedro River delta and basin setting; not direct validation against Jezero.
- **S08 - NASA:** [Perseverance Explores the Jezero Crater Delta](https://science.nasa.gov/resource/perseverance-explores-the-jezero-crater-delta/). Supports the Martian delta/sedimentary interpretation and imagery context.
- **S09 - NASA/JPL (2012):** [River Fans on Earth and Mars](https://www.jpl.nasa.gov/videos/river-fans-on-earth-and-mars/). Direct Death Valley-Gale alluvial-fan comparison; use the transcript and visual locator to choose the footprint.
- **S10 - NASA NTRS research abstract:** [The Antarctic Analogy for Ancient Lakes at Gale Crater, Mars](https://ntrs.nasa.gov/search.jsp?R=20190025827). Direct Lake Untersee process/model analogy; no confirmation of an ice-covered Gale lake or terrain equivalence.
- **S11 - NASA APOD (2017):** [Marius Hills: Holes in the Moon](https://science.nasa.gov/image-article/apod-2017-october-25-marius-hills-holes-in-the-moon/). Supports the pit/lava-tube interpretation, not complete measured underground geometry or verified habitation conditions.

## Ready-to-score checklist

- [ ] Both study footprints are selected, sourced and reviewed.
- [ ] Actual input files/records are retrieved and identifiable by product version and checksum where applicable.
- [ ] Terrain units, method, effective scale and quality are comparable.
- [ ] Geological evidence applies to the selected features; category compatibility has been reviewed.
- [ ] Tolerances, profile, processing and category-table versions are recorded.
- [ ] Both scoring dimensions are available; otherwise the result is null and unranked.
- [ ] Explanation, practice tags, imagery and PDF preserve evidence references and limitations.

All checklist items are pending. The eight curated pairs do not satisfy the separate bounded automated-discovery milestone in `spec.md`; that requires additional candidate inputs and a reproducible search beyond this list.
