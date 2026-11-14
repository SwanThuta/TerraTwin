# TerraTwin: evidence for qualitative analog ratings

Research review date: 2026-11-14.

Status: research shortlist for eight proposed pairs. This file records what each source supports, what needs review, and the limits of each proposed analogy. It does not claim that any pair has been reviewed or rated. The first product uses sourced qualitative ratings; DEM-derived similarity percentages are outside its scope.

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

| Pair ID | Planetary feature | Earth location | Relationship supported by sources | Initial assessment |
| --- | --- | --- | --- | --- |
| P01 | Shackleton: impact terrain and traverse context | Haughton Crater, Devon Island, Canada | Directly documented Shackleton-relevant analog relationship [S01] | Terrain candidate; materials and morphology require explicit comparison |
| P02 | Marius Hills: volcanic surfaces | Mauna Ulu lava-flow area, Kilauea, Hawaii | Documented lava-tube development and broader lunar volcanic analog work [S02, S03] | Proposed specific Marius pairing; terrain/geology candidate |
| P03 | Marius Hills: volcanic surfaces and vents | Fagradalsfjall lava-flow terrain, Iceland | NASA studies these flows/vents for lunar and Martian comparisons [S04] | Proposed specific Marius pairing; terrain/geology candidate |
| P04 | Marius Hills pit region: volcanic cave exploration | Lava Beds National Monument, California, USA | Lunar cave-detection research near Medicine Lake Volcano and documented lava tubes [S03, S05] | Proposed specific Marius pairing; feature/process evidence first |
| P05 | Jezero: carbonate-bearing margin and sedimentary features | Lake Salda, Turkiye | Explicit Jezero comparison involving carbonates and sediment deposition [S06] | Well-documented geological/process lead; identify matching exposed features |
| P06 | Jezero: deltaic deposits | San Pedro River delta, Salar de Atacama, Chile | Earth delta documented by USGS [S07]; Jezero delta documented by NASA [S08] | Proposed comparison, not a source-validated exact pair |
| P07 | Gale: Peace Vallis alluvial fan | Copper Canyon fan, Death Valley, California, USA | Published Death Valley-Gale fan analogy [S09]; Copper Canyon-Peace Vallis is TerraTwin's proposed specific pairing | Priority qualitative candidate; compare cited fan features and scale differences |
| P08 | Gale: possible ancient ice-covered lake conditions | Lake Untersee, Antarctica | Explicit published Antarctic analogy for ancient Gale lakes [S10] | Context/process case; not currently eligible for terrain ranking |

The distribution is intentionally one Earth site for Shackleton, three for Marius Hills, two for Jezero, and two for Gale. Eight Earth sites do not imply two equally strong or rankable sites for every target. The two-Earth-site UI should operate where two eligible records actually exist; it must not manufacture a second ranked match.

## Pair evidence and limits

### P01: Haughton - Shackleton

**Proposed feature scope:** compare rim-area field observation and traverse planning, using Haughton's *Site A* on its northwestern rim and the Shackleton rim at its intersection with the Shackleton-de Gerlache ridge. These are research locators, not paired equal-area polygons or approved traverse routes. NASA's report identifies Site A in Figure 13 (PDF page 40) as a roughly 9-km-wide scene crossed by the Haughton rim's linear-faulted zone. Its Table 3 (PDF page 27) explicitly relates Haughton's impact features, approximate crater scale and rim-area field operations to Shackleton [S01]. LROC identifies a 750-m-wide rim image at **89.684°S, 196.739°E** (positive-east lunar longitude), where mapped blocks and small impact features can be inspected [S19]. The two cited image widths differ; they are not an equal-scale terrain comparison.

**Terrain evidence to review:** both locators are crater-rim terrain with impact-related structures and potential obstacles. Site A supported NASA's remote-science target investigations; Table 16 (PDF page 70, printed page 59) lists five geolocated boulder/rubble targets near 75.45°N, 89.89°W, while the larger valley-head target has no coordinates in that table [S01]. These point locations describe experiment targets, not the boundary of Site A. LROC's 1:8,000 geomorphic map covers the Shackleton-de Gerlache ridge and adjacent rim; its selected rim image shows blocks, and the map documents small craters, ejecta and slope textures [S19]. The corresponding small-scale morphology and navigable ground still need a side-by-side feature review. Shackleton is described as a well-preserved **simple** crater by LOLA research [S21]; Haughton's broader impact-structure landforms include central uplift, faults and down-faulted terraces [S01]. Do not transfer those particular Haughton features to Shackleton or infer slope equivalence from the shared word “rim.”

**Geology evidence to review:** Table 3 describes exposed Haughton impact breccias, shocked rocks and target rocks, including sedimentary carbonates and excavated crystalline basement [S01]. LROC interprets the selected Shackleton rim blocks as *likely* impact ejecta that *might* expose lunar crust; the image alone does not establish their composition [S19]. A source-backed material/unit identification for the specific Haughton Site A and lunar rim footprint is still needed before a reviewed geology label. The broad impact origin supports a process analogy, not equal rock composition or equivalent regolith.

**Visual and optional terrain leads:** NASA report Figure 13 provides Site A context with a stated scene width of about 9 km; its Figure 10 is a 30-km-wide Landsat 7 near-true-color view of the full Haughton structure [S01]. The LROC Shackleton rim detail has a stated 750-m image width and credit NASA/GSFC/Arizona State University [S19]. Record exact crop/scale and reuse terms before publishing either image. LROC lists **NAC_DTM_ESALL_SR12**, a 2 m/pixel Shackleton rim stereo DTM with orthomosaics and a confidence map [S20]. Its catalog latitude/longitude bounds include the selected lunar locator, but valid pixel coverage, height reference and alignment have not been checked. ArcticDEM is an Earth elevation lead; no Haughton strip or tile is selected. DEM retrieval is optional for the qualitative rating.

**Practice use and limits:** NASA actually tested remote science-target characterization and robotic traverse/landing-site planning at Haughton [S01]; the lunar rim map was prepared for traverse planning and landscape interpretation [S19]. These support candidate tags for impact-landform observation and robotic mapping/traverse research. Geological sampling remains conditional on a feature-level material review. Terrestrial erosion, glaciation, permafrost, sedimentary target rocks, atmosphere and summer daylight differ from lunar regolith, vacuum, polar illumination and permanently shadowed terrain [S01, S21]. The analog exercise does not establish outpost or landing-site suitability.

**Review state:** unreviewed candidate; terrain label `null`, geology label `null`, overall label `null`. The feature locators and source leads above make P01 ready for a human side-by-side qualitative review, but neither rubric dimension has a reviewed rationale or reviewer/date yet. Keep it outside ranked results.

### P02: Mauna Ulu, Hawaii - Marius Hills

USGS documents lava-tube development in the Mauna Ulu eruption field [S02]. NASA describes Kilauea as a lunar volcanic fieldwork analog, but its gallery example uses Hadley Rille rather than validating a Marius Hills match [S03]. Assigning Mauna Ulu to Marius Hills is TerraTwin's proposed process comparison, supported by the lunar volcanic/pit interpretation in [S11].

Identify a dated, mapped flow surface and a corresponding lunar volcanic feature. Compare documented surface form and material interpretations, including their age and scale limits. Candidate practice tags: lava-surface mapping and geological observation. Do not infer equivalent cave dimensions from the surrounding surface.

Limits: eruption age, weathering, material details, gravity and flow-emplacement conditions. An Earth flow is not a replica of the entire Marius volcanic complex.

### P03: Fagradalsfjall, Iceland - Marius Hills

NASA's GIFT fieldwork account describes study of Fagradalsfjall vents and lava flows for comparison with volcanic features on Mars and the Moon [S04]. That supports a volcanic-process analog, not an independently established Marius-specific match.

Choose a particular eruption/flow footprint with an acquisition date. Use surface volcanic terrain for the first comparison; do not substitute Vatnajokull glacier topography or treat Iceland as one site. Candidate practice tags: volcanic-landform mapping and instrument characterization, supported by the fieldwork description.

Limits: fresh Earth lava can differ strongly from ancient lunar surfaces in weathering, cover and preservation. If a DEM is used later, its acquisition date must postdate the flow being assessed; mosaic dates require checking.

### P04: Lava Beds - Marius Hills pit

NPS documents lava flows and lava tubes at Lava Beds [S05]. NASA documents lunar cave-detection research near Medicine Lake Volcano [S03]. These establish relevant feature/process research; the specific Marius pairing remains proposed, and the exact NASA field site must not be assumed to coincide with a chosen park cave without checking its locator.

Identify a documented cave and surrounding surface feature. Rate only the visible/sourced surface and process evidence; do not rate underground geometry without cave surveys or equivalent evidence. Candidate practice tags: cave-detection instrument research and geological observation, conditional on source/site verification.

Limits: the Marius Hills interpretation does not provide complete underground geometry [S11]. No roof stability, habitat suitability, passage-size or safety equivalence is established.

### P05: Lake Salda - Jezero

NASA directly compares Lake Salda with Jezero, including carbonate deposits, alluvial fans and sedimentary processes [S06]. This is a documented geological/process analog, not a claim that either all minerals or all surface forms are identical.

Choose exposed shoreline, terrace or fan deposits rather than the whole lake. Pair each with an explicitly selected Jezero feature. Candidate practice tags: sedimentary observation and sample-site selection research. Add mineral categories only at the level supported by published evidence.

Limits: lake-water surfaces do not supply lakebed terrain measurements, and Earth microbialites do not establish Martian life. Do not compare Salda's current climate with ancient Jezero as though both were simultaneous observations.

### P06: San Pedro delta, Atacama - Jezero

USGS describes the San Pedro River delta and ephemeral water delivery at Salar de Atacama [S07]. NASA documents Jezero's ancient delta and sedimentary rocks [S08]. Those sources support a hypothesis to test; neither alone establishes compatibility between the two specific footprints.

Select depositional features, identify their geological setting, exclude mining infrastructure and artificial surfaces, and assess whether terrain scale and processes are comparable. Candidate practice tag: depositional-landform interpretation, after review. Aridity can be sourced context, not evidence of matching delta geology.

Limits: salt-flat chemistry, episodic flows, depositional history and preservation may differ. Do not label the entire Atacama Desert a Jezero delta analog.

### P07: Copper Canyon fan - Peace Vallis fan

NASA/JPL explicitly compares Death Valley alluvial fans with fan deposits at Gale, explaining channels, erosion and sediment transport [S09]. Copper Canyon-Peace Vallis is TerraTwin's proposed specific pairing, not a published assessment of these two named fans together. This remains the recommended first comparison because the intended process and landform are documented on both bodies.

The USGS identifies Copper Canyon as an alluvial fan with radial drainage and downslope sediment grading [S12]. Its regional study describes the fan and its sediment sources [S13]. Palucis et al. map the Peace Vallis fan and report approximately 80 km2 total area, comprising 49 km2 upper and 31 km2 lower fan [S14]. The USGS estimates the entire Copper Canyon fan at about 2 square miles (approximately 5.2 km2) [S13]. These whole-fan area estimates show a meaningful scale difference; they are context, not rating inputs that produce a percentage.

Qualitative review plan: use the named Copper Canyon and Peace Vallis fan deposits as the feature scope, citing the USGS image/study and Palucis et al.'s mapped fan. Distinguish fan deposits from their source channels and adjacent terrain. Record fan form, radial/channel features, deposit classes, the large whole-fan scale difference, and uncertainty. Candidate practice tags: channel/fan mapping, sedimentary observation and terrain-navigation research; attach only after selected-feature evidence review.

Optional elevation leads for a later quantitative study are NASA's SRTMGL1 tile **N36W117.SRTMGL1.hgt** [S16] and the USGS **MSL_Gale_DEM_Mosaic_1m_v3** [S17]. Neither raster has been retrieved or checked at a selected fan window. The previously proposed HiRISE DTM **DTEED_062963_1760_062172_1760_A01** is described as **channel** terrain [S15, S18], so it is not confirmed fan-deposit coverage. None of these DEM checks is needed for the first qualitative review.

Visual leads: the USGS Copper Canyon fan image states a 1:48,000 source scale and public-domain use [S12]. Palucis et al., Figure 2, identifies CTX image P22_009571_1756_XI_04S222W at 6 m/pixel [S14]. Those source scales are not calibrated scale bars for a displayed thumbnail. Verify image coverage, georeferencing and reuse terms before cropping or publishing; label differing display scales.

P07 rating checks: confirm the cited terrain and geology evidence applies to both named fan deposits, record corresponding features and meaningful differences, then assign the two rubric labels and overall label with reviewer/date and references. Use the same record for web/PDF provenance. Until this review is recorded, show P07 as a sourced candidate without a ranked rating.

Limits: Earth rainfall and sediment transport do not reproduce current Martian conditions; a fan is not automatically a delta or lakebed. Quantitative mobility claims require finer terrain and surface-property evidence than broad topography alone.

### P08: Lake Untersee - ancient Gale lake

The NASA-hosted research abstract explicitly discusses Lake Untersee in a cold-climate hypothesis for ancient Gale lakes [S10]. This supports studying how liquid water could persist beneath ice under specified model conditions.

Keep this pair as an unranked process/context case unless the named terrain and geology features on both bodies can be identified and reviewed independently. Cite the model assumptions in the explanation. Lake-ice or hydrological observations cannot replace the two required rating dimensions.

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

These are primary agency/research sources reviewed in the conversation on 2026-11-14. Source existence and readable text are distinct from successful raster downloads, redistribution permission or quantitative validation. Old publications support the stated historical research, not current mission schedules or operational approvals.

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

## Ready-to-rate checklist

- [ ] Both named features have source-backed locators and a recorded review.
- [ ] Terrain/landform evidence applies to both features; similarities, differences and scale limits are stated.
- [ ] Geological evidence applies to both features; corresponding deposit/material classes and uncertainty are stated.
- [ ] Both dimension labels cite evidence, give rationale and use the versioned rubric; missing labels have null reasons.
- [ ] The overall label and terrain-first order follow the rubric; unreviewed and insufficient-evidence records stay outside ranked results.
- [ ] Explanation, practice tags, imagery and PDF preserve evidence references and limitations.

All checklist items are pending. The eight curated pairs do not satisfy the separate bounded automated-discovery milestone in `spec.md`; that requires additional candidate inputs and a reproducible search beyond this list.
