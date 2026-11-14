# Hackathon delivery checklist

Status: P01/P07 first slice built locally. Checked items below have been verified; dataset expansion, imagery, candidate discovery, and team assignment remain open. Times are relative to the team's development start. Owner numbers are suggested roles; assign member names at kickoff.

## Ownership

| Member | Primary responsibility | Main files / handoff |
| --- | --- | --- |
| 1 | Frontend shell and integration | `web/` app shell, shared state, build configuration |
| 2 | Map and globe | `web/` map components, marker interactions, projection prototype, two-site highlighting |
| 3 | Scientific source research | Evidence records, source manifests, terrain image provenance/licensing, target/site review |
| 4 | Data pipeline and rating | `pipeline/`, schemas, generated comparisons, PDF reports, rubric tests |
| 5 | Comparison UI and explanations | Comparison panels, two-site view, practice tags, template explanations, provenance and report download |
| 6 | Candidate discovery and demo validation | Search pipeline, reproducibility notes, accessibility and demo rehearsal |

Member 4 coordinates schema changes; member 1 coordinates frontend integration. Member 6 and member 4 agree on shared pipeline interfaces before editing. These are human team roles, not instructions to launch automated sub-agents.

## Hours 0–2: contracts and feasibility

- [ ] Assign members and agree on a shared branch/integration workflow.
- [ ] Confirm proposed site counts, named planetary targets, and first data products.
- [x] Define schema, sample records, profile version, and missing-data representation.
- [x] Define feature locators, evidence references, rubric version, and source-to-rating provenance fields for on-page method details and PDFs.
- [ ] Define visual-asset metadata and the versioned practice objective tag catalog with evidence references.
- [ ] Verify cited source access, figure/map locators, image licensing/scale, and feature applicability; verify optional measurements and temperature type if displayed.
- [x] Scaffold React/TypeScript/Vite and minimal Python pipeline.
- [ ] Apply the exact versions in `spec.md` to dependency manifests, commit the npm lockfile and any Python lockfile, and verify clean installs with the pinned runtimes.
- [x] Prototype MapLibre flat/globe switching and check basemap access requirements.
- [ ] Choose a bounded search region or finite candidate pool with accessible real inputs.

Gate: a sourced comparison record can be loaded by the frontend; both map projections render; candidate-search inputs are feasible.

## Hours 2–8: working vertical slice

- [x] Implement data validation and the versioned Strong/Moderate/Weak qualitative rubric with cited rationales.
- [x] Implement overall-label rule, evidence completeness, review eligibility, and deterministic terrain-first ordering.
- [x] Build body/target/Earth selectors and both search directions.
- [x] Show markers and synchronize list, selection, and comparison panel.
- [x] Generate evidence-based explanation text for one comparison.
- [x] Display source links, feature locators, scale, missing evidence, limitations, and an evidence-grounded field-practice use; show units for any optional measurements.
- [ ] Show sourced Earth/planetary terrain images with scale, date when known, attribution, and a missing-image state.
- [x] Show how the selected pair's evidence was reviewed and rated; generate and download a matching PDF report.
- [x] Confirm end-to-end slice works without a runtime model API.

Gate: one Earth-to-planet and planet-to-Earth workflow succeeds with traceable evidence.

## Hours 8–16: breadth and discovery

- [ ] Expand curated data toward 8–12 Earth sites and two targets per planetary body, subject to verification.
- [ ] Review both rating dimensions for each pair; keep unsupported claims and unreviewed candidates outside ranked results.
- [ ] Run bounded automated search and save its inputs, methods, and outputs.
- [ ] Surface at least one candidate beyond the curated list, labeled for review.
- [ ] Add search-method and profile details to the UI.
- [x] Add practice objective tag filtering without changing ratings or result ordering.
- [ ] Compare two Earth sites for one planetary target using their existing comparisons, method details, and individual PDFs.
- [ ] Preserve selection across 2D/globe changes and search-direction changes.
- [x] Add responsive layouts, loading, empty, map-layer-failure, and insufficient-evidence states.

Gate: both bodies have useful sourced comparisons, and bounded discovery is reproducible.

## Hours 16–21: verify and integrate

- [x] Test each rubric combination, null evidence, review eligibility, terrain-first ordering, and stable ties.
- [ ] Verify explanation evidence references and absence of unsupported claims.
- [x] Check each PDF against its selected comparison ratings, evidence references, rubric version, and missing-evidence status.
- [ ] Verify image scale/attribution, tag evidence references, unchanged ratings under filters, and two-site selection through projection switching.
- [x] Run frontend typecheck and production build.
- [x] Exercise both search directions and flat/globe switching.
- [ ] Check keyboard controls, text contrast, mobile layout, and map/list parity.
- [ ] Simulate missing tiles and unavailable optional providers.
- [ ] Verify source attribution and distinguish heuristic ratings and evidence completeness from scientific confidence.
- [x] Document actual install, preprocessing, development, test, and build commands.

## Hours 21–24+: stabilize and rehearse

- [ ] Freeze features and resolve demo-blocking defects.
- [ ] Prepare a production build and small local demonstration dataset.
- [ ] Rehearse: choose a Mars target, inspect sourced terrain visuals and a practice tag, compare two Earth sites and their PDFs, reverse the search, switch map views, and explain a newly surfaced candidate.
- [ ] Prepare a lunar example and clearly state the limits of Earth analogs.
- [ ] Record methodology, evidence gaps, and bounded-search limits for judge questions.
- [ ] Prepare hosting configuration; publish only when deployment is requested or authorized.

## Later

- [ ] Add a server-side model API adapter with timeouts, grounded prompts, reference validation, and template fallback.
- [ ] Add external data APIs after verifying authentication, quotas, and product access.
- [ ] Expand candidate coverage and review rubric decisions against documented analog cases.

If time gets tight, reduce the number of sites and visual polish first. Keep source traceability, honest ratings, both search directions, both Earth map views, sourced terrain visuals, evidence-backed practice tags, two-site comparison, generated explanations, matching downloadable PDFs, and the smallest reproducible candidate-search demonstration.
