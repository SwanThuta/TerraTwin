# Hackathon delivery checklist

Status: documentation prepared; implementation tasks below are pending. Times are relative to the team's development start. Owner numbers are suggested roles; assign member names at kickoff.

## Ownership

| Member | Primary responsibility | Main files / handoff |
| --- | --- | --- |
| 1 | Frontend shell and integration | `web/` app shell, shared state, build configuration |
| 2 | Map and globe | `web/` map components, marker interactions, projection prototype |
| 3 | Scientific source research | Evidence records, source manifests, target/site review |
| 4 | Data pipeline and scoring | `pipeline/`, schemas, generated comparisons, scientific tests |
| 5 | Comparison UI and explanations | Comparison panels, template explanations, evidence display |
| 6 | Candidate discovery and demo validation | Search pipeline, reproducibility notes, accessibility and demo rehearsal |

Member 4 coordinates schema changes; member 1 coordinates frontend integration. Member 6 and member 4 agree on shared pipeline interfaces before editing. These are human team roles, not instructions to launch automated sub-agents.

## Hours 0–2: contracts and feasibility

- [ ] Assign members and agree on a shared branch/integration workflow.
- [ ] Confirm proposed site counts, named planetary targets, and first data products.
- [ ] Define schema, sample records, profile version, and missing-data representation.
- [ ] Verify actual product retrieval, licensing, units, resolution, and temperature type.
- [ ] Scaffold React/TypeScript/Vite and minimal Python pipeline.
- [ ] Prototype MapLibre flat/globe switching and check basemap access requirements.
- [ ] Choose a bounded search region or finite candidate pool with accessible real inputs.

Gate: a sourced comparison record can be loaded by the frontend; both map projections render; candidate-search inputs are feasible.

## Hours 2–8: working vertical slice

- [ ] Implement data validation and numeric/category scoring with documented heuristics.
- [ ] Implement coverage grouping, eligibility, and deterministic ranking.
- [ ] Build body/target/Earth selectors and both search directions.
- [ ] Show markers and synchronize list, selection, and comparison panel.
- [ ] Generate evidence-based explanation text for one comparison.
- [ ] Display source links, units, scale, missing evidence, and limitations.
- [ ] Confirm end-to-end slice works without a runtime model API.

Gate: one Earth-to-planet and planet-to-Earth workflow succeeds with traceable evidence.

## Hours 8–16: breadth and discovery

- [ ] Expand curated data toward 8–12 Earth sites and two targets per planetary body, subject to verification.
- [ ] Review all evidence and exclude unsupported or incompatible measurements from scoring.
- [ ] Run bounded automated search and save its inputs, methods, and outputs.
- [ ] Surface at least one candidate beyond the curated list, labeled for review.
- [ ] Add search-method and profile details to the UI.
- [ ] Preserve selection across 2D/globe changes and search-direction changes.
- [ ] Add responsive layouts, loading, empty, tile-failure, and insufficient-evidence states.

Gate: both bodies have useful sourced comparisons, and bounded discovery is reproducible.

## Hours 16–21: verify and integrate

- [ ] Test numeric boundaries, missing values, categorical compatibility, coverage, and tie ordering.
- [ ] Verify explanation evidence references and absence of unsupported claims.
- [ ] Run frontend typecheck and production build.
- [ ] Exercise both search directions and flat/globe switching.
- [ ] Check keyboard controls, text contrast, mobile layout, and map/list parity.
- [ ] Simulate missing tiles and unavailable optional providers.
- [ ] Verify source attribution and distinguish heuristic scores from confidence.
- [ ] Document actual install, preprocessing, development, test, and build commands.

## Hours 21–24+: stabilize and rehearse

- [ ] Freeze features and resolve demo-blocking defects.
- [ ] Prepare a production build and small local demonstration dataset.
- [ ] Rehearse: choose a Mars target, inspect an Earth match, reverse the search, switch map views, and explain a newly surfaced candidate.
- [ ] Prepare a lunar example and clearly state the limits of Earth analogs.
- [ ] Record methodology, evidence gaps, and bounded-search limits for judge questions.
- [ ] Prepare hosting configuration; publish only when deployment is requested or authorized.

## Later

- [ ] Add a server-side model API adapter with timeouts, grounded prompts, reference validation, and template fallback.
- [ ] Add external data APIs after verifying authentication, quotas, and product access.
- [ ] Expand candidate coverage and validate scoring against documented analog cases.
- [ ] Consider accounts or persistence only if a real workflow requires them.

If time gets tight, reduce the number of sites and visual polish first. Keep source traceability, honest scores, both search directions, both Earth map views, generated explanations, and the smallest reproducible candidate-search demonstration.
