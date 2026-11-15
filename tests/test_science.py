"""Checks for the CSV-backed P01 screening and its published artifacts."""

import json
from pathlib import Path

import pytest
from pydantic import ValidationError

from pipeline.build import build
from pipeline.csv_loader import load_dataset, load_p01, rows
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
    assert {similarity.dimension for similarity in item.similarities} == {"terrain", "geology"}
    assert len(item.practice) == 3
    assert all(tag.status == "possible" for tag in item.practice)
    assert publishable(dataset)["comparisons"][0]["overall"] == source_pair["overall_rating"]
    assert rank_key(item) == (1, 2, "E01")


def test_p02_to_p08_reviews_keep_missing_dimensions_out_of_rankings():
    dataset = load_dataset()
    comparisons = {item.id: item for item in dataset.comparisons}
    published = {item["id"]: item for item in publishable(dataset)["comparisons"]}

    assert set(comparisons) == {f"P{number:02}" for number in range(1, 9)}
    assert (comparisons["P05"].terrain.rating, comparisons["P05"].geology.rating) == ("Moderate", "Moderate")
    assert (comparisons["P06"].terrain.rating, comparisons["P06"].geology.rating) == ("Moderate", "Moderate")
    assert (comparisons["P07"].terrain.rating, comparisons["P07"].geology.rating) == ("Moderate", "Moderate")
    assert comparisons["P03"].terrain.rating == "Weak"
    assert comparisons["P03"].geology.rating is None
    assert comparisons["P08"].terrain.rating is None
    assert comparisons["P08"].geology.rating is None
    assert all(comparisons[pair_id].status == "reviewed" for pair_id in comparisons)
    assert {pair_id for pair_id, item in published.items() if item["rankEligible"]} == {"P01", "P05", "P06", "P07"}
    assert published["P03"]["overall"] == "Insufficient evidence"
    assert published["P03"]["coverage"] == 1
    assert published["P08"]["rankEligible"] is False
    assert "Geology is not rated" in published["P03"]["explanation"]


def test_added_sources_and_practice_tags_resolve_in_the_dataset():
    dataset = load_dataset()
    source_ids = {source.id for source in dataset.sources}
    comparisons = {item.id: item for item in dataset.comparisons}

    assert {"R40", "R41", "R42"}.issubset(source_ids)
    assert {source_id for tag in comparisons["P06"].practice for source_id in tag.sourceIds} <= source_ids
    assert comparisons["P06"].practice
    assert not comparisons["P08"].practice


def test_approximate_locale_7_point_is_not_plotted_as_a_feature():
    earth, moon = load_p01().sites
    assert earth.mapPoint == (-89.86666666666666, 75.43333333333334)
    assert earth.mapPointKind.startswith("Context reference:")
    assert "approximate feature proxy is not plotted" in earth.mapPointKind
    assert "assumed 315-degree NW bearing" in earth.coordinateNote
    assert "no Locale 7 GPS" in earth.coordinateNote
    assert moon.mapPoint == pytest.approx((-163.261, -89.684))
    assert moon.mapPointKind.startswith("Source-located point")
    assert "positive East" in moon.coordinateConvention
    assert "signed East" in moon.coordinateConvention


def test_approximate_coordinate_rows_are_filled_and_labeled():
    locations = rows("locations.csv")
    approximate = {
        row["feature_id"]: row for row in locations
        if row["feature_coordinates_status"].startswith("approximate_")
    }
    assert set(approximate) == {"E01", "E04", "E05", "E06", "E07", "M01", "M02", "M03", "M04", "H_L02"}
    for row in approximate.values():
        assert row["feature_lat_deg"] and row["feature_lon_deg"]
        assert "approximate" in row["coordinate_note"].lower()

    sites = {site.id: site for site in load_dataset().sites}
    for feature_id in ("E04", "E05", "E06", "E07"):
        assert sites[feature_id].mapPointKind.startswith("Context reference:")
        assert "approximate feature proxy is not plotted" in sites[feature_id].mapPointKind
    for feature_id in ("M01", "M02", "M03", "M04"):
        assert sites[feature_id].mapPoint is not None
        assert sites[feature_id].mapPointKind.startswith("Context reference:")
        assert "not a verified feature point" in sites[feature_id].mapPointKind


def test_planetary_globe_points_keep_source_scope_and_longitude_convention():
    sites = {site.id: site for site in load_dataset().sites}
    assert sites["L02"].mapPoint == pytest.approx((-56.7701, 14.0917))
    assert sites["L02"].mapPointKind.startswith("Source-located point")
    assert sites["M01"].mapPoint == pytest.approx((77.69, 18.41))
    assert sites["M04"].mapPoint == pytest.approx((137.7, -5.44))
    assert all("signed East" in sites[id].coordinateConvention for id in ("L01", "L02", "M01", "M02", "M03", "M04"))
    raw = load_p01().model_dump(mode="json")
    raw["sites"][1]["mapPoint"] = [196.739, -89.684]
    with pytest.raises(ValidationError, match="invalid globe coordinates"):
        Dataset.model_validate(raw)


def test_missing_evidence_and_unknown_sources_are_rejected():
    raw = load_p01().model_dump(mode="json")
    raw["comparisons"][0]["terrain"]["rating"] = None
    with pytest.raises(ValidationError, match="missing reason"):
        Dataset.model_validate(raw)
    raw = load_p01().model_dump(mode="json")
    raw["comparisons"][0]["geology"]["sourceIds"] = ["made-up"]
    with pytest.raises(ValidationError, match="unknown sources"):
        Dataset.model_validate(raw)


def test_explanations_and_reports_reuse_all_selected_csv_records():
    output = build()
    root = Path(__file__).resolve().parents[1]
    web = json.loads((root / "web/public/data/atlas.json").read_text(encoding="utf-8"))
    assert web == output
    for item in web["comparisons"]:
        dimension_sources = item["terrain"]["sourceIds"] + item["geology"]["sourceIds"]
        similarity_sources = [source for similarity in item["similarities"] for source in similarity["sourceIds"]]
        assert set(dimension_sources + similarity_sources).issubset(item["explanationSourceIds"])
        pdf = root / "web/public" / item["reportPath"].lstrip("/")
        body = pdf.read_bytes()
        assert body.startswith(b"%PDF")
        target = next(site for site in output["sites"] if site["id"] == item["targetId"])
        assert b"Planetary globe marker" in body
        assert target["mapPointSourceId"].encode() in body
        for expected in (
            item["id"], item["overall"], item["reviewStatus"],
            item["terrain"]["rating"] or "Insufficient evidence",
            item["geology"]["rating"] or "Insufficient evidence",
            output["reviewProfile"], "C01", "C02", *dimension_sources,
        ):
            assert expected.encode() in body
