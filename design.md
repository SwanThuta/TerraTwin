# Product and interface design

## Direction

Present a scientific explorer that feels approachable during a live demonstration. Lead with evidence, then visual impact. Use a dark navy canvas, light readable text, cyan for Earth interactions, pale silver for Moon, and warm orange for Mars. Treat this palette as a starting point and verify contrast in the implementation.

Use a system sans-serif font, clear labels, restrained borders, and consistent spacing. Keep scientific caveats beside the claims they qualify. Use text and icons alongside color.

## Desktop layout

```text
Header: AstroCoders | Explore | Method & sources
Search direction: Find Earth analogs / Explore planetary matches
Planet selector: Moon / Mars       Site selector: fixed sourced list
------------------------------------------------------------------
Results list       | Earth map / globe          | Selected comparison
Match + coverage   | 2D / Globe toggle          | Why it matches
Curated/candidate  | Earth markers              | Evidence and scores
Evidence gaps      | Selected-site highlight    | Differences and use
                   |                           | Source links
------------------------------------------------------------------
Status: dataset version | scoring method | search boundary
```

The diagram describes information placement, not a fixed pixel layout. Use a flexible center map, approximately 280px results column, and approximately 360px comparison column on wide screens. Collapse details into a panel or tabbed workspace when space is limited.

## Search behavior

In “Find Earth analogs,” select Moon or Mars and a fixed planetary target. Rank eligible Earth matches, group by evidence coverage, and select the first full-coverage match when one exists. Show insufficient-evidence records separately.

In “Explore planetary matches,” select an Earth site. Show relevant lunar and Martian targets with profile labels, keeping scores from different profiles in separate groups. The Earth marker remains selected while planetary cards change.

Switching direction should preserve a valid selected pair when possible. Switching body clears an incompatible target and selects a valid one. Update results and explanations together so text never describes a previously selected pair.

## Map and globe

Both views show Earth. The toggle changes projection using the same data and selection; it does not imply detailed 3D terrain. Planetary targets appear in the controls and comparison panel with sourced imagery when available.

Differentiate curated sites and automatically surfaced candidates through marker shapes and labels. Clicking a marker or result card opens the same comparison. Keep a visible legend and attribution. Avoid constant globe rotation; respect reduced-motion preferences.

If tiles fail, retain markers on a plain background and keep the results list usable. If WebGL fails, explain that the map is unavailable and offer the complete list/comparison workflow. Keep projection selection available only when supported.

## Comparison content

1. Earth name, planetary target, and curated/candidate review status.
2. Heuristic similarity score, evidence coverage, and profile label.
3. Per-dimension values with units, score, source, scale, and quality notes.
4. Generated explanation: why it matches, where it differs, exploration use, and evidence gaps.
5. Method details: profile/tolerance version, search boundary when applicable, and original sources.

A score may appear as “Heuristic similarity: 74/100; evidence: 3/3 dimensions.” This is example interface copy, not a research result. Show “Insufficient comparable evidence” when the ranking threshold is not met. Never display a coverage percentage as confidence.

Use compact horizontal bars with numerical labels for criterion scores. Avoid charts that hide missing values or imply precision beyond the evidence. Keep explanatory text close to the relevant comparison.

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
| Partial coverage | Label coverage clearly and keep its ranking group separate |
| Candidate unreviewed | Show a review badge and search provenance |
| Tiles unavailable | Plain map background plus working list and details |
| Optional explanation API unavailable later | Use evidence-template explanation |
| Invalid data | Exclude invalid result and provide a useful error state |

## Demo story

Begin with a planetary exploration question. Select a target, inspect its strongest Earth comparison, explain a meaningful difference, switch between flat map and globe, then show an unexpected candidate and how the bounded search identified it. Finish by showing evidence and practical exploration use.
