"""New CSV rows publish without frontend edits; unreviewed rows stay unranked."""

from copy import deepcopy

from pipeline import csv_loader
from pipeline.models import publishable


TABLES = (
    "analog_pairs.csv", "pair_review_overrides.csv", "locations.csv",
    "location_workflows.csv", "comparison_evidence.csv",
    "practice_objectives.csv", "sources.csv", "comparison_criteria.csv",
)


def copied_tables():
    return {name: csv_loader.rows(name) for name in TABLES}


def test_new_reviewed_pair_is_published_without_frontend_changes(monkeypatch):
    tables = copied_tables()
    pair = deepcopy(next(row for row in tables["analog_pairs.csv"] if row["pair_id"] == "P01"))
    pair["pair_id"] = "TEST-P09"
    pair["earth_feature_id"] = "TEST-E09"
    tables["analog_pairs.csv"].append(pair)
    earth = deepcopy(next(row for row in tables["locations.csv"] if row["feature_id"] == "E01"))
    earth["feature_id"] = "TEST-E09"
    tables["locations.csv"].append(earth)
    for name in ("location_workflows.csv", "comparison_evidence.csv", "practice_objectives.csv"):
        for row in list(tables[name]):
            if row["pair_id"] == "P01":
                copy = deepcopy(row)
                copy["pair_id"] = "TEST-P09"
                tables[name].append(copy)

    monkeypatch.setattr(csv_loader, "rows", lambda name: tables[name])
    output = publishable(csv_loader.load_dataset())
    assert {pair["id"] for pair in output["comparisons"]} == {
        *(f"P{number:02}" for number in range(1, 9)), "TEST-P09",
    }
    assert len(output["sites"]) == 15
    assert [pair["rankOrder"] for pair in output["comparisons"] if pair["targetId"] == "L01"] == [1, 2]
    assert len({source["id"] for source in output["sources"]}) == len(output["sources"])


def test_unreviewed_pair_stays_outside_rankings(monkeypatch):
    tables = copied_tables()
    pair = next(row for row in tables["analog_pairs.csv"] if row["pair_id"] == "P01")
    pair.update({
        "review_status": "candidate_unreviewed", "reviewer": "", "review_date": "",
        "terrain_rating": "", "geology_rating": "", "supported_dimensions_count": "0",
        "overall_rating": "Insufficient evidence", "rank_eligible": "False",
        "missing_evidence_reason": "Awaiting source review",
    })
    monkeypatch.setattr(csv_loader, "rows", lambda name: tables[name])
    output = publishable(csv_loader.load_dataset())
    candidate = next(item for item in output["comparisons"] if item["id"] == "P01")
    assert candidate["status"] == "sourced-candidate"
    assert candidate["coverage"] == 0
    assert candidate["rankEligible"] is False
    assert candidate["rankOrder"] is None
