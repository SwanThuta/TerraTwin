"""Checks for the CSV-backed P01 screening and its published artifacts."""

import json
from pathlib import Path

import pytest
from pydantic import ValidationError

from pipeline.build import build
from pipeline.csv_loader import load_p01, rows
from pipeline.models import Dataset, coverage, overall_rating, publishable, rank_key


@pytest.mark.parametrize(
    ("terrain", "geology", "expected"),
    [
        ("Strong", "Strong", "Strong"),
        ("Strong", "Moderate", "Moderate"),
        ("Moderate", "Strong", "Moderate"),
        ("Moderate", "Moderate", "Moderate"),
        ("Weak", "Strong", "Weak"),
        ("Strong", "Weak", "Weak"),
        ("Weak", "Moderate", "Weak"),
        ("Moderate", "Weak", "Weak"),
        (None, "Strong", "Insufficient evidence"),
        ("Moderate", None, "Insufficient evidence"),
    ],
)
def test_fixed_overall_rule(terrain, geology, expected):
    assert overall_rating(terrain, geology) == expected


def test_p01_uses_csv_review_and_criteria_only():
    source_pair = next(row for row in rows("analog_pairs.csv") if row["pair_id"] == "P01")
    dataset = load_p01()
    item = dataset.comparisons[0]
    assert len(dataset.comparisons) == 1
    assert (item.terrain.rating, item.geology.rating) == (
        source_pair["terrain_rating"], source_pair["geology_rating"]
    )
    assert item.terrain.sourceIds == source_pair["terrain_evidence"].split(";")
    assert item.geology.sourceIds == source_pair["geology_evidence"].split(";")
    assert {criterion.key for criterion in dataset.criteria if criterion.role == "primary_qualitative"} == {"terrain", "geology"}
    assert len(dataset.criteria) == len(rows("comparison_criteria.csv"))
    assert coverage(item) == 2
    assert publishable(dataset)["comparisons"][0]["overall"] == source_pair["overall_rating"]
    assert rank_key(item) == (1, 2, "E01")


def test_research_station_is_context_not_locale_7():
    earth, moon = load_p01().sites
    assert earth.mapPoint == (-89.86666666666666, 75.43333333333334)
    assert "not a verified feature point" in earth.mapPointKind
    assert "No exact Locale 7 GPS found" in earth.coordinateNote
    assert moon.mapPoint is None
    assert "positive East" in moon.coordinateConvention


def test_missing_evidence_and_unknown_sources_are_rejected():
    raw = load_p01().model_dump(mode="json")
    raw["comparisons"][0]["terrain"]["rating"] = None
    with pytest.raises(ValidationError, match="missing reason"):
        Dataset.model_validate(raw)
    raw = load_p01().model_dump(mode="json")
    raw["comparisons"][0]["geology"]["sourceIds"] = ["made-up"]
    with pytest.raises(ValidationError, match="unknown sources"):
        Dataset.model_validate(raw)


def test_explanation_and_report_reuse_selected_csv_record():
    output = build()
    root = Path(__file__).resolve().parents[1]
    web = json.loads((root / "web/public/data/atlas.json").read_text(encoding="utf-8"))
    assert web == output
    item = web["comparisons"][0]
    assert item["rankEligible"] is True and item["rankOrder"] == 1
    assert set(item["terrain"]["sourceIds"] + item["geology"]["sourceIds"]).issubset(item["explanationSourceIds"])
    pdf = root / "web/public" / item["reportPath"].lstrip("/")
    body = pdf.read_bytes()
    assert body.startswith(b"%PDF")
    for expected in (item["id"], item["overall"], item["reviewStatus"], item["terrain"]["rating"],
                     item["geology"]["rating"], output["reviewProfile"], "C01", "C02",
                     "HMP research station", *item["terrain"]["sourceIds"]):
        assert expected.encode() in body
