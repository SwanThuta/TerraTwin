"""Checks for high-impact qualitative rating and provenance behavior."""

import json
from pathlib import Path

import pytest
from pydantic import ValidationError

from pipeline.build import INPUT, build
from pipeline.models import Dataset, coverage, explanation, overall_rating, publishable, rank_key


def dataset() -> Dataset:
    return Dataset.model_validate_json(INPUT.read_text(encoding="utf-8"))


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


def test_candidate_is_not_ranked_or_treated_as_weak():
    records = {item.id: item for item in dataset().comparisons}
    assert coverage(records["P01"]) == 2
    assert coverage(records["P07"]) == 0
    assert overall_rating(records["P07"].terrain.rating, records["P07"].geology.rating) == "Insufficient evidence"
    with pytest.raises(ValueError, match="fully reviewed"):
        rank_key(records["P07"])


def test_rank_is_terrain_first_then_geology_then_stable_site_id():
    first = dataset().comparisons[0]
    strong_geology = first.model_copy(deep=True)
    strong_geology.geology.rating = "Strong"
    strong_geology.earthId = "earth-z"
    assert rank_key(strong_geology) < rank_key(first)
    stable_tie = first.model_copy(deep=True)
    stable_tie.earthId = "earth-a"
    assert rank_key(stable_tie) < rank_key(first)


def test_missing_reason_and_unknown_sources_are_rejected():
    raw = json.loads(INPUT.read_text(encoding="utf-8"))
    raw["comparisons"][1]["terrain"]["missingReason"] = None
    with pytest.raises(ValidationError, match="missing reason"):
        Dataset.model_validate(raw)
    raw = json.loads(INPUT.read_text(encoding="utf-8"))
    raw["comparisons"][0]["geology"]["sourceIds"] = ["made-up"]
    with pytest.raises(ValidationError, match="unknown sources"):
        Dataset.model_validate(raw)


def test_explanations_have_source_references_and_review_status():
    data = dataset()
    output = {item["id"]: item for item in publishable(data)["comparisons"]}
    assert "carbonate" in explanation(data.comparisons[0]).lower()
    assert set(data.comparisons[0].terrain.sourceIds).issubset(output["P01"]["explanationSourceIds"])
    assert set(data.comparisons[0].geology.sourceIds).issubset(output["P01"]["explanationSourceIds"])
    assert output["P01"]["rankEligible"] is True
    assert output["P01"]["rankOrder"] == 1
    assert output["P07"]["rankEligible"] is False
    assert output["P07"]["rankOrder"] is None
    assert "unranked" in output["P07"]["explanation"]


def test_generated_pdf_and_web_record_share_ratings_and_references():
    output = build()
    root = Path(__file__).resolve().parents[1]
    web = json.loads((root / "web/public/data/atlas.json").read_text(encoding="utf-8"))
    assert web == output
    for item in web["comparisons"]:
        pdf = root / "web/public" / item["reportPath"].lstrip("/")
        body = pdf.read_bytes()
        assert body.startswith(b"%PDF")
        assert item["id"].encode() in body
        assert output["reviewProfile"].encode() in body
        assert item["status"].encode() in body
        for source_id in item["terrain"]["sourceIds"] + item["geology"]["sourceIds"]:
            assert source_id.encode() in body
        assert item["overall"].encode() in body
        for dimension in (item["terrain"], item["geology"]):
            if dimension["missingReason"]:
                assert dimension["missingReason"].encode() in body
