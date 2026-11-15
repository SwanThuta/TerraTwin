"""Build the reviewed comparison dataset from the research CSVs."""

from __future__ import annotations

import csv
import json
from pathlib import Path

from pipeline.models import Comparison, Dataset, coverage, overall_rating


ROOT = Path(__file__).resolve().parents[1]
CSV_DIR = ROOT / "TerraTwin_Earth_Moon_Mars_Analog_Data_2026-11-14"
PAIR_ID = "P01"


def rows(filename: str) -> list[dict[str, str]]:
    with (CSV_DIR / filename).open(encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def ids(value: str) -> list[str]:
    return [part.strip() for part in value.split(";") if part.strip()]


def site(row: dict[str, str]) -> dict:
    source_ids = ids(row["coordinate_source_id"])
    if not source_ids:
        raise ValueError(f"{row['feature_id']} lacks a coordinate source")
    is_earth = row["body"].lower() == "earth"
    anchor = (
        [float(row["map_anchor_lon_deg"]), float(row["map_anchor_lat_deg"])]
        if is_earth and row["map_anchor_lon_deg"] and row["map_anchor_lat_deg"]
        else None
    )
    feature_point = (
        [float(row["feature_lon_deg"]), float(row["feature_lat_deg"])]
        if is_earth and row["feature_lon_deg"] and row["feature_lat_deg"]
        else None
    )
    coordinate_status = row["feature_coordinates_status"]
    if feature_point and coordinate_status == "source_coordinate":
        map_point = feature_point
        point_kind = f"Source-located point ({coordinate_status}): {row['coordinate_note']}"
    else:
        map_point = anchor
        point_kind = f"Context reference: {row['anchor_represents']} ({row['anchor_quality']}); not a verified feature point"
        if coordinate_status.startswith("approximate_"):
            point_kind += "; approximate feature proxy is not plotted"
    return {
        "id": row["feature_id"],
        "name": row["feature_name"],
        "body": row["body"].lower(),
        "region": row["country_or_region"],
        "feature": row["feature_name"],
        "locator": f"{row['host_target']}; {row['coordinate_note']} Footprint: {row['footprint_status']}.",
        "mapPoint": map_point,
        "mapPointKind": point_kind,
        "mapPointSourceId": source_ids[0],
        "coordinateNote": row["coordinate_note"],
        "coordinateConvention": f"{row['longitude_convention']}; {row['latitude_convention']}",
    }


def load_dataset() -> Dataset:
    pairs = rows("analog_pairs.csv")
    overrides = {row["pair_id"]: row for row in rows("pair_review_overrides.csv")}
    locations = {row["feature_id"]: row for row in rows("locations.csv")}
    source_rows = rows("sources.csv")
    source_ids = {row["source_id"] for row in source_rows}
    image_rows = json.loads((ROOT / "data" / "site-images.json").read_text(encoding="utf-8"))
    images = {row["siteId"]: row for row in image_rows}
    if len(images) != len(image_rows):
        raise ValueError("site image manifest contains duplicate site IDs")

    def image_for(feature_id: str, fallback_source_id: str) -> dict:
        if feature_id not in images:
            return {"localPath": None, "sourceId": fallback_source_id, "scale": "No imported image scale",
                    "credit": "See cited source", "missingReason": "No verified site image has been imported for this location."}
        entry = images[feature_id]
        body = {"E": "earth", "L": "moon", "M": "mars"}[feature_id[0]]
        files = list((ROOT / "web" / "public" / "site-images" / body).glob(f"{feature_id}-01.*"))
        if len(files) != 1:
            raise ValueError(f"{feature_id} requires exactly one imported main image")
        for field in ("title", "provider", "pageUrl", "imageUrl", "scope", "caption", "scale", "credit", "usage", "acquired"):
            if not entry.get(field):
                raise ValueError(f"{feature_id} image lacks {field}")
        if entry["scope"] not in ("Feature view", "Wider context view"):
            raise ValueError(f"{feature_id} has unknown image scope")
        return {"localPath": f"/site-images/{body}/{files[0].name}", "sourceId": f"IMG_{feature_id}",
                "scale": entry["scale"], "credit": entry["credit"], "scope": entry["scope"],
                "caption": entry["caption"], "usage": entry["usage"], "acquired": entry["acquired"], "missingReason": None}
    evidence_by_pair: dict[str, list[dict[str, str]]] = {}
    for row in rows("comparison_evidence.csv"):
        evidence_by_pair.setdefault(row["pair_id"], []).append(row)
    practice_by_pair: dict[str, list[dict[str, str]]] = {}
    for row in rows("practice_objectives.csv"):
        practice_by_pair.setdefault(row["pair_id"], []).append(row)
    workflow_by_pair: dict[str, dict[int, dict[str, str]]] = {}
    for row in rows("location_workflows.csv"):
        workflow_by_pair.setdefault(row["pair_id"], {})[int(row["step_number"])] = row

    criteria = [
        {
            "id": row["criterion_id"], "key": row["criterion_key"],
            "role": row["role"], "title": row["title"],
            "question": row["measure_or_question"],
            "unitOrRating": row["unit_or_rating"],
            "rule": row["rule_or_formula"], "readiness": row["readiness"],
        }
        for row in rows("comparison_criteria.csv")
    ]
    comparisons = []
    referenced = set()
    pair_sites = set()
    for original in pairs:
        pair = {**original, **overrides.get(original["pair_id"], {})}
        pair_id = pair["pair_id"]
        earth = locations[pair["earth_feature_id"]]
        target = locations[pair["planetary_feature_id"]]
        pair_sites.update((earth["feature_id"], target["feature_id"]))
        terrain_sources = ids(pair["terrain_evidence"])
        geology_sources = ids(pair["geology_evidence"])
        similarity_rows = evidence_by_pair.get(pair_id, [])
        if {row["dimension"] for row in similarity_rows} != {"terrain", "geology"}:
            raise ValueError(f"{pair_id} requires one terrain and one geology evidence row")
        if not terrain_sources or not geology_sources:
            raise ValueError(f"{pair_id} requires source IDs for both dimensions")
        workflow = workflow_by_pair.get(pair_id, {})
        if set(workflow) != set(range(1, 7)):
            raise ValueError(f"{pair_id} requires all six source workflow steps")
        if pair["rubric_version"] != "terrain-geology-qual-v1" or pair["sort_version"] != "terrain-first-v1":
            raise ValueError(f"{pair_id} uses an unsupported rubric or ordering version")

        practice_rows = practice_by_pair.get(pair_id, [])
        similarities = [
            {
                "id": row["evidence_id"], "dimension": row["dimension"],
                "earthFeature": row["earth_feature"], "planetaryFeature": row["planetary_feature"],
                "sharedObservation": row["shared_observation"], "limitation": row["limitation"],
                "earthLocator": row["earth_locator"], "planetaryLocator": row["planetary_locator"],
                "scaleNote": row["scale_note"], "sourceIds": ids(row["source_ids"]),
                "reviewStatus": row["review_status"],
            }
            for row in similarity_rows
        ]
        practice = [
            {
                "id": row["objective_id"], "label": row["label"], "reason": row["support_reason"],
                "sourceIds": ids(row["evidence_ids"]), "status": row["status"],
                "limitations": row["limitations"],
            }
            for row in practice_rows
        ]
        terrain_row = next(row for row in similarity_rows if row["dimension"] == "terrain")
        geology_row = next(row for row in similarity_rows if row["dimension"] == "geology")
        reviewed = pair["review_status"] == "reviewed_source_desk_screening"
        reviewer = pair["reviewer"] if reviewed else None
        review_date = pair["review_date"] if reviewed else None
        terrain_rating = pair["terrain_rating"] or None
        geology_rating = pair["geology_rating"] or None
        missing_reason = pair["missing_evidence_reason"] or None
        evidence_sources = sorted(set(terrain_sources + geology_sources))
        referenced.update(evidence_sources)
        referenced.update(ids(earth["coordinate_source_id"]) + ids(target["coordinate_source_id"]))
        referenced.update(source for row in similarity_rows for source in ids(row["source_ids"]))
        referenced.update(source for row in practice_rows for source in ids(row["evidence_ids"]))

        record = {
            "id": pair_id, "earthId": earth["feature_id"], "targetId": target["feature_id"],
            "status": "reviewed" if reviewed else "sourced-candidate", "reviewStatus": pair["review_status"],
            "reviewer": reviewer, "reviewDate": review_date,
            "relationship": f"{pair['relationship_status']}. Theme: {pair['analog_theme']}.",
            "relationshipSourceIds": evidence_sources,
            "terrain": {
                "rating": terrain_rating, "evidence": terrain_row["shared_observation"],
                "difference": pair["critical_difference"],
                "sourceIds": terrain_sources, "missingReason": missing_reason if terrain_rating is None else None,
            },
            "geology": {
                "rating": geology_rating, "evidence": geology_row["shared_observation"],
                "difference": pair["material_difference"],
                "sourceIds": geology_sources, "missingReason": missing_reason if geology_rating is None else None,
            },
            "similaritySummary": " ".join(row["shared_observation"] for row in similarity_rows),
            "similarities": similarities,
            "practice": practice,
            "limits": [pair["critical_difference"], pair["material_difference"],
                       earth["surface_cave_or_ice_warning"], target["surface_cave_or_ice_warning"]],
            "limitSourceIds": evidence_sources,
            "visuals": {
                "earth": image_for(earth["feature_id"], terrain_sources[0]),
                "target": image_for(target["feature_id"], terrain_sources[-1]),
            },
            "reviewNotes": f"{pair['review_scope_note']} Next validation: {pair['next_validation']}",
        }
        comparisons.append(record)
        comparison = Comparison.model_validate(record)

        if (
            overall_rating(comparison.terrain.rating, comparison.geology.rating) != pair["overall_rating"]
            or coverage(comparison) != int(pair["supported_dimensions_count"])
            or (reviewed and coverage(comparison) == 2) != (pair["rank_eligible"].lower() == "true")
        ):
            raise ValueError(f"{pair_id} derived columns disagree with the authoritative Python rating rule")

    unknown = referenced - source_ids
    if not set(images) <= pair_sites:
        raise ValueError(f"site image manifest has unused locations: {sorted(set(images) - pair_sites)}")
    if unknown:
        raise ValueError(f"unknown CSV source IDs: {sorted(unknown)}")
    if not any(row["pair_id"] == PAIR_ID for row in pairs):
        raise ValueError(f"required comparison {PAIR_ID} is missing")

    dataset = Dataset.model_validate({
        "datasetVersion": "csv-2026-11-15-p01-p08-site-images",
        "reviewProfile": pair["rubric_version"], "orderingProfile": pair["sort_version"],
        "sources": [
            {"id": row["source_id"], "provider": row["provider"],
             "title": row["title"], "url": row["url"],
             "locator": row["exact_locator"], "accessDate": None}
            for row in source_rows if row["source_id"] in referenced
        ] + [
            {"id": f"IMG_{row['siteId']}", "provider": row["provider"], "title": row["title"],
             "url": row["pageUrl"], "locator": f"{row['caption']} {row['scale']} Acquired: {row['acquired']}. Usage: {row['usage']}",
             "accessDate": None}
            for row in image_rows if row["siteId"] in pair_sites
        ],
        "criteria": criteria,
        "sites": [site(locations[feature_id]) for feature_id in sorted(pair_sites)],
        "comparisons": comparisons,
    })
    return dataset


def load_p01() -> Dataset:
    """Keep the original single-comparison loader available to existing callers."""
    dataset = load_dataset()
    comparison = next(item for item in dataset.comparisons if item.id == PAIR_ID)
    site_ids = {comparison.earthId, comparison.targetId}
    return Dataset.model_validate({
        **dataset.model_dump(mode="python"),
        "sites": [site for site in dataset.sites if site.id in site_ids],
        "comparisons": [comparison.model_dump(mode="python")],
    })
