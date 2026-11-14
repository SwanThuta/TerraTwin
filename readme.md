# AstroCoders

An Earth analog explorer for Moon and Mars research. Find comparable Earth environments, inspect the evidence and limitations, and explore candidates through a 2D map and 3D globe.

**Project status:** project documentation and Git repository configuration. Application code, datasets, dependencies, and run commands have not been created yet.

## Documents

- [spec.md](spec.md): scope, recommended stack, data contracts, scoring, resources, and acceptance criteria.
- [design.md](design.md): interface, visual direction, and interaction behavior.
- [todo.md](todo.md): six-person ownership, delivery sequence, and completion checklist.
- [agents.md](agents.md): shared coding-agent instructions and scientific integrity rules.
- [claude.md](claude.md): Claude entry instructions referencing the shared rules.

## Planned technology

React, TypeScript, and Vite for the frontend; MapLibre GL JS for Earth maps and globe view; Python for data preparation and scoring; versioned JSON/GeoJSON for the first demo. Add a FastAPI service when integrating external APIs later. See the specification for rationale and constraints.

## Planned repository layout

```text
web/                 React application
pipeline/            Python preprocessing, scoring, and candidate search
data/raw/            Small permitted source extracts and retrieval manifests
data/processed/      Validated sites, observations, comparisons, and search runs
data/schemas/        Documented JSON data contracts
tests/               Scientific logic and pipeline checks
```

Large source rasters stay outside version control; commit retrieval instructions and small reproducible extracts where licensing allows. The implementation should export processed assets into the frontend's public data directory through one documented command.

## Getting started

Read the specification and select a role in the task list. The first implementation milestone establishes the shared schema, one sourced comparison, the frontend scaffold, and the map projection prototype. Once those exist, replace this section with verified prerequisites, installation, data-generation, development, test, and build commands.

## Research approach

Similarity is an explainable heuristic based on comparable terrain, geological, and thermal evidence. Each result includes source links and analogy limits. Initial explanations are generated from evidence templates; a model API can be added later. No account or model key is required for the planned initial workflow. External basemaps may still require connectivity or a provider configuration.

## Agent instruction filenames

Files use the lowercase names requested by the team. Agent tools may look for case-sensitive conventional names such as `AGENTS.md` or `CLAUDE.md`; on such systems, configure the tool to read these files or rename them to its expected casing before relying on automatic discovery.
