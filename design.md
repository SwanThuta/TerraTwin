# Product and interface design

## Direction

Present a scientific explorer that helps users find Earth locations for Moon or Mars field practice. Lead with terrain evidence, then geology and visual impact. Use a dark navy canvas, light readable text, cyan for Earth interactions, pale silver for Moon, and warm orange for Mars. Treat this palette as a starting point and verify contrast in the implementation.

Use a system sans-serif font, clear labels, restrained borders, and consistent spacing. Keep scientific caveats beside the claims they qualify. Use text and icons alongside color.

## Desktop layout

```text
Header: TerraTwin | Explore | Method & sources
Search direction: Find Earth analogs / Explore planetary matches
Planet selector: Moon / Mars       Site selector: fixed sourced list
------------------------------------------------------------------
Results list       | Earth map / globe          | Selected comparison
Match + coverage   | 2D / Globe toggle          | Why it matches
Curated/candidate  | Earth markers              | Evidence and scores
Evidence gaps      | Selected-site highlight    | Differences and use
Practice tags      | Two-site highlight         | Terrain images / PDF
                   |                           | How calculated
------------------------------------------------------------------
Status: dataset version | scoring method | search boundary
```

The diagram describes information placement, not a fixed pixel layout. Use a flexible center map, approximately 280px results column, and approximately 360px comparison column on wide screens. Collapse details into a panel or tabbed workspace when space is limited.

## Search behavior

In “Find Earth analogs,” select Moon or Mars and a fixed planetary target. Rank Earth matches with comparable terrain and geology, and select the first ranked match when one exists. Show insufficient-evidence records separately with their coverage.

In “Explore planetary matches,” select an Earth site. Show relevant lunar and Martian targets with profile labels, keeping scores from different profiles in separate groups. The Earth marker remains selected while planetary cards change.

Switching direction should preserve a valid selected pair when possible. Switching body clears an incompatible target and selects a valid one. Update results and explanations together so text never describes a previously selected pair.

In the Moon/Mars-first direction, “Compare another Earth site” lets users choose one additional result for the same target. Keep the primary and second Earth sites highlighted on the map and show both comparison cards. Changing target or direction clears an invalid second site; flat/globe switching keeps both. In Earth-first search, use one Earth site at a time.

When a practice tag filters results, keep selected sites that remain in the filtered list. If the primary site is filtered out, select the first remaining result; clear a filtered-out second site. If nothing matches, show the empty state and a way to clear the tag.

## Map and globe

Both views show Earth. The toggle changes projection using the same data and selection; it does not imply detailed 3D terrain. Planetary targets appear in the controls and comparison panel with sourced imagery when available.

Differentiate curated sites and automatically surfaced candidates through marker shapes and labels. Clicking a marker or result card opens the same comparison. Keep a visible legend and attribution. Avoid constant globe rotation; respect reduced-motion preferences.

If tiles fail, retain markers on a plain background and keep the results list usable. If WebGL fails, explain that the map is unavailable and offer the complete list/comparison workflow. Keep projection selection available only when supported.

## Comparison content

1. Earth name, planetary target, and curated/candidate review status.
2. Heuristic similarity score, evidence coverage, and profile label.
3. Terrain and geology values with units, score, source, scale, and quality notes; show any thermal observation as unscored context.
4. Generated explanation: why it matches, where it differs, possible field-practice use, and evidence gaps.
5. “How this comparison was made”: source product and link, retrieval date, input values, extraction method, scale, tolerance/category table, weights, and score calculation; include search boundary for candidates.
6. “Download report (PDF)” for the selected pair, including insufficient-evidence and unreviewed candidate states.
7. Sourced Earth and planetary terrain images with scale or field of view, acquisition date when known, attribution, and a clear note when their scales differ.
8. Evidence-backed practice objective tags; selecting a tag filters results without changing their scores.

A score may appear as “Heuristic terrain and geology similarity: 74/100; evidence: 2/2 dimensions.” This is example interface copy, not a research result. Show “Insufficient comparable evidence” when either scored dimension is unavailable. Never display a coverage percentage as confidence.

Use compact horizontal bars with numerical labels for criterion scores. Avoid charts that hide missing values or imply precision beyond the evidence. Keep explanatory text close to the relevant comparison.

Keep the method section readable without a download. Update its contents and PDF link together whenever the selected pair changes. On mobile, place both in the Comparison tab; keep the download keyboard accessible and name the pair in its accessible label.

For a two-site comparison, show the same fields for each Earth–planetary pair, including its own method section and PDF link. Use side-by-side cards on wide screens and stacked cards on small screens. Do not display a new score comparing the two Earth sites directly. If a terrain image is missing, show a labeled placeholder and retain the data comparison.

## Explanations

Initial badge: “Generated from comparison data.” Build text from verified structured evidence. Include linked evidence references and explicit gaps. If a model API is added later, label that mode and retain the template fallback.

Do not show an idle chat box, API setup prompts, or technical provider details in the main exploration flow. Configuration belongs in developer documentation.

## Candidate discovery

Provide a visible “Search candidates” results group, with region/pool, method, run version, and review status. Users can inspect candidates like curated sites while seeing that their analog interpretation needs review. Do not label the section “new discoveries” without supporting research.

## Responsive and accessible behavior

On small screens, use Results / Map / Comparison tabs with persistent search controls. Preserve the selected pair across tabs. Never make hovering, map dragging, or color the only route to information.

All selectors, cards, tabs, and map controls need keyboard focus and accessible names. Announce result changes and loading failures appropriately. Use visible focus states, semantic headings, readable text sizing, and touch-friendly controls.

## States to design

| State | Behavior |
| --- | --- |
| Loading data | Explain what is loading; keep layout stable |
| No qualifying matches | Show evidence gaps and offer another fixed target |
| Missing observation | Show “No comparable data” and the reason |
| Partial coverage | Label coverage clearly and show outside the ranked results |
| Candidate unreviewed | Show a review badge and search provenance |
| Tiles unavailable | Plain map background plus working list and details |
| Optional explanation API unavailable later | Use evidence-template explanation |
| Invalid data | Exclude invalid result and provide a useful error state |
| Report unavailable | Explain the download failure while keeping the comparison and method visible |
| Terrain image unavailable | Show source/availability note and keep measurements and source links usable |
| Practice tag has no matches | Show an empty-results message and a clear way to remove the filter |
| Only one Earth site available | Disable the second-site control with an explanation |

## Demo story

Begin with a Moon or Mars field-practice question. Select a target, inspect its strongest Earth comparison and sourced terrain images, then select a practice tag and compare a second Earth site. Open each source-to-score method and PDF, explain a meaningful difference, switch between flat map and globe, then show an unexpected candidate and how the bounded search identified it. Finish with the analogy's limits.
