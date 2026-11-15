# Site image intake

Place images of the compared locations in `earth/`, `moon/`, or `mars/`. Use the site's stable ID from the atlas, followed by a two-digit image number:

`<SITE_ID>-<NN>.<extension>`

Use `01` for the main image and `02`, `03`, etc. for additional views. Keep the image's actual extension (`jpg`, `jpeg`, `png`, or `webp`); do not rename a PNG to `.jpg`. Use uppercase IDs, digits, and the hyphen exactly as shown. For example:

- `web/public/site-images/earth/E01-01.jpg` — first image of Haughton Site A / Locale 7.
- `web/public/site-images/moon/L02-01.png` — first image of Marius Hills Pit.
- `web/public/site-images/mars/M02-01.jpg` — first image of the Jezero western delta.

The matching public URLs start with `/site-images/`, for example `/site-images/earth/E01-01.jpg`. One site can appear in multiple comparisons; name its image for the site ID, not for a pair ID.

## Site IDs

Earth (`earth/`):

- `E01` — Haughton Site A / Locale 7 rocky carbonate ridge
- `E02` — Mauna Ulu volcanic formation
- `E03` — Fagradalsfjall 2021 vent 5b
- `E04` — Skull Cave collapse trench / lava-tube entrance
- `E05` — Lake Salda carbonate-rich shoreline / terrace candidate
- `E06` — San Pedro River delta at Salar de Atacama
- `E07` — Copper Canyon alluvial fan
- `E08` — Lake Untersee ice-covered lake

Moon (`moon/`):

- `L01` — Shackleton–de Gerlache ridge rim NAC view
- `L02` — Marius Hills Pit

Mars (`mars/`):

- `M01` — Jezero western carbonate-bearing crater margin
- `M02` — Jezero western delta sediment exposures
- `M03` — Peace Vallis alluvial fan deposit
- `M04` — hypothesized ancient Gale ice-covered lake system

## Information to send with each image

Provide the original image or a permitted copy, the source page or product URL, the required credit, reuse/license terms, the acquisition date if known, and what area the image actually shows. Include the image scale or resolution if published; otherwise say `scale unknown`. State whether the view covers the selected feature or only a wider context region. A file name alone does not verify that an image depicts the selected feature.

All 14 compared sites now have a main image. Their original URLs, source pages, credits, use notes, view scopes and scale notes are in `data/site-images.json`. The atlas builder checks each declared file and publishes the image metadata to the website and PDF. Several views show a larger region than the selected feature; those are labeled **Wider context view**. Keep global planet textures in `web/public/textures/` separate from site evidence images.
