"""Build the P01 review slice directly from the supplied research CSVs."""

from __future__ import annotations

import csv
from pathlib import Path

from pipeline.models import Dataset, coverage, overall_rating


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
    return {
        "id": row["feature_id"],
        "name": row["feature_name"],
        "body": row["body"].lower(),
        "region": row["country_or_region"],
        "feature": row["feature_name"],
        "locator": f"{row['host_target']}; {row['coordinate_note']} Footprint: {row['footprint_status']}.",
        "mapPoint": anchor,
        "mapPointKind": f"Context reference: {row['anchor_represents']} ({row['anchor_quality']}); not a verified feature point",
        "mapPointSourceId": source_ids[0],
        "coordinateNote": row["coordinate_note"],
        "coordinateConvention": f"{row['longitude_convention']}; {row['latitude_convention']}",
    }


def load_p01() -> Dataset:
    pair = next(row for row in rows("analog_pairs.csv") if row["pair_id"] == PAIR_ID)
    locations = {row["feature_id"]: row for row in rows("locations.csv")}
    workflow = {
        int(row["step_number"]): row
        for row in rows("location_workflows.csv")
        if row["pair_id"] == PAIR_ID
    }
    similarity_rows = [row for row in rows("comparison_evidence.csv") if row["pair_id"] == PAIR_ID]
    practice_rows = [row for row in rows("practice_objectives.csv") if row["pair_id"] == PAIR_ID]
    if {row["dimension"] for row in similarity_rows} != {"terrain", "geology"}:
        raise ValueError("P01 requires one terrain and one geology similarity evidence row")
    if not practice_rows:
        raise ValueError("P01 requires at least one practice objective row")
    if set(workflow) != set(range(1, 7)):
        raise ValueError("P01 requires all six source workflow steps")
    if pair["rubric_version"] != "terrain-geology-qual-v1" or pair["sort_version"] != "terrain-first-v1":
        raise ValueError("unsupported CSV rubric or ordering version")
    earth = locations[pair["earth_feature_id"]]
    target = locations[pair["planetary_feature_id"]]
    terrain_sources = ids(pair["terrain_evidence"])
    geology_sources = ids(pair["geology_evidence"])
    if not terrain_sources or not geology_sources:
        raise ValueError("P01 requires evidence IDs for both dimensions")
    source_rows = rows("sources.csv")
    source_ids = {row["source_id"] for row in source_rows}
    referenced = set(
        terrain_sources + geology_sources + ids(earth["coordinate_source_id"])
        + ids(target["coordinate_source_id"])
        + [source for step in workflow.values() for source in ids(step["source_ids"])]
        + [source for row in similarity_rows for source in ids(row["source_ids"])]
        + [source for row in practice_rows for source in ids(row["evidence_ids"])]
    )
    if referenced - source_ids:
        raise ValueError(f"unknown CSV source IDs: {sorted(referenced - source_ids)}")
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
    if pair["review_status"] != "reviewed_source_desk_screening":
        raise ValueError("P01 is no longer the supplied reviewed desk screening")
    if pair["terrain_rating"] not in {"Strong", "Moderate", "Weak"} or pair["geology_rating"] not in {"Strong", "Moderate", "Weak"}:
        raise ValueError("P01 must have both CSV ratings")
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
    record = {
        "id": PAIR_ID, "earthId": earth["feature_id"], "targetId": target["feature_id"],
        "status": "reviewed", "reviewStatus": pair["review_status"],
        "reviewer": pair["reviewer"], "reviewDate": pair["review_date"],
        "relationship": f"{pair['relationship_status']}. Theme: {pair['analog_theme']}.",
        "relationshipSourceIds": sorted(set(terrain_sources + geology_sources)),
        "terrain": {
            "rating": pair["terrain_rating"], "evidence": workflow[3]["precise_instruction"],
            "difference": pair["critical_difference"],
            "sourceIds": terrain_sources, "missingReason": None,
        },
        "geology": {
            "rating": pair["geology_rating"], "evidence": workflow[4]["precise_instruction"],
            "difference": pair["material_difference"],
            "sourceIds": geology_sources, "missingReason": None,
        },
        "similaritySummary": " ".join(row["shared_observation"] for row in similarity_rows),
        "similarities": similarities,
        "practice": practice,
        "limits": [pair["critical_difference"], pair["material_difference"],
                   earth["surface_cave_or_ice_warning"], target["surface_cave_or_ice_warning"]],
        "limitSourceIds": sorted(set(terrain_sources + geology_sources)),
        "visuals": {
            "earth": {"localPath": None, "sourceId": terrain_sources[0], "scale": "No imported image scale", "credit": "NASA NTRS", "missingReason": "CSV package supplies citations but no redistributable terrain image."},
            "target": {"localPath": None, "sourceId": terrain_sources[-1], "scale": "750 m NAC scene cited in CSV workflow; no image imported", "credit": "LROC / NASA GSFC / ASU", "missingReason": "CSV package supplies an image locator but no imported image."},
        },
        "reviewNotes": f"{pair['review_scope_note']} Next validation: {pair['next_validation']}",
    }
    dataset = Dataset.model_validate({
        "datasetVersion": "csv-2026-11-14-p01",
        "reviewProfile": pair["rubric_version"], "orderingProfile": pair["sort_version"],
        "sources": [
            {"id": row["source_id"], "provider": row["provider"],
             "title": row["title"], "url": row["url"],
             "locator": row["exact_locator"], "accessDate": None}
            for row in source_rows if row["source_id"] in referenced
        ],
        "criteria": criteria,
        "sites": [site(earth), site(target)],
        "comparisons": [record],
    })
    comparison = dataset.comparisons[0]
    if (
        overall_rating(comparison.terrain.rating, comparison.geology.rating) != pair["overall_rating"]
        or coverage(comparison) != int(pair["supported_dimensions_count"])
        or pair["rank_eligible"].lower() != "true"
    ):
        raise ValueError("P01 CSV derived columns disagree with the authoritative Python rating rule")
    return dataset
