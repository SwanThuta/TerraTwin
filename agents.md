# Coding-agent instructions

## Context and source of truth

Read `spec.md`, `design.md`, and `todo.md` before implementation. TerraTwin is a six-person hackathon project with a little over 24 hours and beginner-to-intermediate developers. The product uses research comparisons to find Earth analogs for Moon and Mars field practice. The official repository is `https://github.com/SwanThuta/TerraTwin`.

Follow explicit user instructions first. Treat `spec.md` as the product and scientific contract, `design.md` as the interface contract, and `todo.md` as the delivery checklist. Keep all affected documents consistent when scope changes. Avoid adding unrequested features.

## Work style

- Complete authorized tasks without repeatedly asking for routine implementation approval.
- Explain meaningful changes briefly: what changed, why, and how it was verified. Use approachable language and explain unfamiliar concepts when relevant.
- Ask for clarification only when an unresolved decision materially changes scope, evidence, or behavior; otherwise state a reasonable assumption and proceed.
- Inspect existing files before editing, preserve teammates' work, and coordinate ownership before touching shared contracts.
- Use focused changes and simple functions. Keep scoring, source retrieval, explanation generation, and rendering separate.
- Do not claim work, tests, data access, or deployments succeeded without evidence.

## Implementation boundaries

- Use the recommended stack in `spec.md` unless the user changes it or a concrete incompatibility requires an adjustment.
- Establish a small working end-to-end comparison before expanding the dataset.
- Implement both search directions, Earth flat/globe views, fixed scoring, generated explanations, and bounded candidate discovery.
- The app has no user accounts or sign-in flow. Keep the first demo usable without model API keys. Use deterministic evidence templates now; add model-provider integration later.
- Do not add a chatbot, downloadable reports, weight sliders, authentication, a database, or a second frontend framework without a product requirement.
- Use a single Python scoring implementation and generated JSON outputs initially. Avoid parallel scoring implementations that can disagree.
- Keep API credentials server-side when providers are added. Document configuration variable names with empty placeholders, never actual secrets.
- Verify map provider attribution and product licensing before distributing assets. Cache only where terms allow.

## Scientific integrity

- Every scientific measurement and factual site claim needs a traceable source. Separate measured values, published interpretations, heuristic assumptions, and illustrative fixtures.
- Never invent coordinates, measurements, citations, similarity percentages, data availability, or discovery claims.
- Clearly label demonstration fixtures; exclude them from scientific rankings and research claims.
- Preserve units, coordinate conventions, scale, time range, processing method, and quality notes. Missing evidence is null with a reason, never an implicit zero.
- Follow the scoring/coverage/ranking rules in `spec.md`. Version profiles, category tables, tolerances, and algorithms.
- Prioritize comparable terrain for field practice; keep geology as the second scored dimension and thermal observations as context. Treat gravity, atmosphere, and radiation as analogy limits, not terrain scores. Expose weak matches and missing evidence. Similarity does not establish permanent-base suitability.
- Generate explanations from the selected comparison evidence. A future model may explain results but must not author scores or unsupported claims.
- Candidate discovery must use documented inputs and produce results beyond the curated list. Label bounded searches, unreviewed candidates, and uncertainty honestly.

## Verification and completion

Test the high-impact scientific behavior: identical numeric values, tolerance boundaries, missing/incompatible observations, coverage eligibility, deterministic ranking, and explanation references. Verify the two search directions and projection switching through a focused interaction check.

Run available typecheck/build and relevant tests after implementation changes. If tools or dependencies prevent a check, report the limitation accurately. Do not add tests that merely repeat low-impact markup.

Update `todo.md` only when an item actually passes its completion check. Update `readme.md` with commands that have been run successfully. Before handing off, summarize changed files, verification results, and remaining gaps. Publishing and external account setup are separate from preparing a reviewable local build.

## Filename discovery

This file is intentionally named `agents.md` as requested. If an agent requires `AGENTS.md` on a case-sensitive filesystem, configure or rename the entry file before relying on automatic loading. Do not maintain divergent instruction copies.
