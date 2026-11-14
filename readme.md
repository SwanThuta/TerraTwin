# TerraTwin

An interactive Earth analog explorer for Moon and Mars field preparation. Find Earth sites with comparable terrain, supported by geological evidence, where teams could practice relevant field tasks. View sourced terrain imagery, filter by practice objective, compare two Earth sites, and inspect the evidence and limits through a 2D map and 3D globe.

Official repository: [SwanThuta/TerraTwin](https://github.com/SwanThuta/TerraTwin).

**Project status:** project documentation and directory structure are in place. Application code, datasets, dependencies, and run commands have not been created yet.

## Documents

- [spec.md](spec.md): scope, recommended stack, data contracts, scoring, resources, and acceptance criteria.
- [design.md](design.md): interface, visual direction, and interaction behavior.
- [todo.md](todo.md): six-person ownership, delivery sequence, and completion checklist.
- [agents.md](agents.md): shared coding-agent instructions and scientific integrity rules.
- [claude.md](claude.md): Claude entry instructions referencing the shared rules.

## Planned technology

React, TypeScript, and Vite for the frontend; MapLibre GL JS for Earth maps and globe view; Python for data preparation, scoring, and per-comparison PDF reports; versioned JSON/GeoJSON for the first demo. Add a FastAPI service when integrating external APIs later. See the specification for rationale and constraints.

The team version baseline is in [spec.md](spec.md#shared-toolchain-and-package-versions). `.nvmrc` pins Node.js 24.22.3 and `.python-version` pins Python 3.14.10. Dependency manifests and lockfiles will be committed when the application is scaffolded.

## Repository layout

```text
web/                 React application
pipeline/            Python preprocessing, scoring, candidate search, and PDF generation
data/raw/            Small permitted source extracts and retrieval manifests
data/processed/      Validated sites, observations, comparisons, and search runs
data/schemas/        Documented JSON data contracts
tests/               Scientific logic and pipeline checks
```

These directories currently contain placeholder files so Git tracks the agreed structure. Add implementation files within the existing directories as each team member begins work.

`tests/` will hold Python checks for scoring, missing evidence, ranking, and generated explanations. Frontend interaction checks can live alongside the React code in `web/`; both search directions and the map projection switch need a focused check. The placeholder in `tests/` is not a test suite yet.

Large source rasters stay outside version control; commit retrieval instructions and small reproducible extracts where licensing allows. The implementation should export processed assets into the frontend's public data directory through one documented command.

## Getting started

Read the specification and select a role in the task list. The first implementation milestone establishes the shared schema, one sourced comparison, the frontend scaffold, and the map projection prototype. Once those exist, replace this section with verified prerequisites, installation, data-generation, development, test, and build commands.

## Research approach

Similarity is an explainable heuristic that prioritizes comparable terrain and uses geology as supporting evidence. Each selected comparison shows where its values came from, how they were processed and scored, and a downloadable PDF with the same evidence. Sourced terrain images show scale and attribution; evidence-backed practice tags filter results without changing scores. Users can inspect two Earth sites against one planetary target, each with its own method and PDF. Thermal observations can add context but do not affect the first score. Earth sites do not reproduce lunar or Martian gravity, atmosphere, or radiation. Initial explanations are generated from evidence templates; a model API can be added later. The app has no account or sign-in flow, and the first demo needs no model key. External basemaps may still require connectivity or a provider configuration.

## Agent instruction filenames

Files use the lowercase names requested by the team. Agent tools may look for case-sensitive conventional names such as `AGENTS.md` or `CLAUDE.md`; on such systems, configure the tool to read these files or rename them to its expected casing before relying on automatic discovery.
