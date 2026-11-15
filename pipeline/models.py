"""Validated qualitative evidence records and fixed ordinal rating rules."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, model_validator


Rating = Literal["Strong", "Moderate", "Weak"]
Overall = Literal["Strong", "Moderate", "Weak", "Insufficient evidence"]

RUBRIC_VERSION = "terrain-geology-qual-v1"
ORDERING_VERSION = "terrain-first-v1"
RANK = {"Strong": 0, "Moderate": 1, "Weak": 2}


class Source(BaseModel):
    id: str
    provider: str
    title: str
    url: str
    locator: str
    accessDate: str | None = None


class Criterion(BaseModel):
    id: str
    key: str
    role: str
    title: str
    question: str
    unitOrRating: str
    rule: str
    readiness: str


class Site(BaseModel):
    id: str
    name: str
    body: Literal["earth", "moon", "mars"]
    region: str
    feature: str
    locator: str
    mapPoint: tuple[float, float] | None
    mapPointKind: str
    mapPointSourceId: str
    coordinateNote: str = ""
    coordinateConvention: str = ""


class Dimension(BaseModel):
    rating: Rating | None
    evidence: str
    difference: str
    sourceIds: list[str] = Field(min_length=1)
    missingReason: str | None

    @model_validator(mode="after")
    def consistent_missing_state(self) -> Dimension:
        if (self.rating is None) != (self.missingReason is not None):
            raise ValueError("null ratings require a missing reason; rated dimensions must not have one")
        return self


class SimilarityEvidence(BaseModel):
    id: str
    dimension: Literal["terrain", "geology"]
    earthFeature: str
    planetaryFeature: str
    sharedObservation: str
    limitation: str
    earthLocator: str
    planetaryLocator: str
    scaleNote: str
    sourceIds: list[str] = Field(min_length=1)
    reviewStatus: str


class Practice(BaseModel):
    id: str
    label: str
    reason: str
    sourceIds: list[str] = Field(min_length=1)
    status: Literal["possible", "not_supported"]
    limitations: str


class Visual(BaseModel):
    localPath: str | None
    sourceId: str
    scale: str
    credit: str
    missingReason: str | None

    @model_validator(mode="after")
    def consistent_image_state(self) -> Visual:
        if (self.localPath is None) != (self.missingReason is not None):
            raise ValueError("missing images require a reason; imported images must not have one")
        return self


class VisualPair(BaseModel):
    earth: Visual
    target: Visual


class Comparison(BaseModel):
    id: str
    earthId: str
    targetId: str
    status: Literal["reviewed", "sourced-candidate"]
    reviewer: str | None
    reviewDate: str | None
    relationship: str
    relationshipSourceIds: list[str] = Field(min_length=1)
    similaritySummary: str
    terrain: Dimension
    geology: Dimension
    similarities: list[SimilarityEvidence] = Field(min_length=1)
    practice: list[Practice]
    limits: list[str] = Field(min_length=1)
    limitSourceIds: list[str] = Field(min_length=1)
    visuals: VisualPair
    reviewNotes: str
    reviewStatus: str = ""

    @model_validator(mode="after")
    def reviewed_requires_attribution(self) -> Comparison:
        if self.status == "reviewed" and (not self.reviewer or not self.reviewDate):
            raise ValueError("reviewed comparisons need reviewer and date")
        if self.status != "reviewed" and (self.reviewer or self.reviewDate):
            raise ValueError("unreviewed candidates cannot have review attribution")
        return self


class Dataset(BaseModel):
    datasetVersion: str
    reviewProfile: str
    orderingProfile: str
    sources: list[Source]
    criteria: list[Criterion] = Field(default_factory=list)
    sites: list[Site]
    comparisons: list[Comparison]

    @model_validator(mode="after")
    def check_references(self) -> Dataset:
        if self.reviewProfile != RUBRIC_VERSION or self.orderingProfile != ORDERING_VERSION:
            raise ValueError("unknown rating or ordering profile")
        sources = {source.id for source in self.sources}
        sites = {site.id: site for site in self.sites}
        if len(sources) != len(self.sources) or len(sites) != len(self.sites):
            raise ValueError("source and site IDs must be unique")
        if len({item.id for item in self.comparisons}) != len(self.comparisons):
            raise ValueError("comparison IDs must be unique")
        if self.criteria and {item.key for item in self.criteria if item.role == "primary_qualitative"} != {"terrain", "geology"}:
            raise ValueError("CSV primary criteria must be terrain and geology")
        for site in self.sites:
            if site.mapPointSourceId not in sources:
                raise ValueError(f"unknown coordinate source for {site.id}")
            if site.body != "earth" and site.mapPoint is not None:
                raise ValueError("planetary sites must not have Earth map points")
        for item in self.comparisons:
            if item.earthId not in sites or sites[item.earthId].body != "earth":
                raise ValueError(f"invalid Earth site in {item.id}")
            if item.targetId not in sites or sites[item.targetId].body == "earth":
                raise ValueError(f"invalid planetary site in {item.id}")
            references = (
                item.relationshipSourceIds
                + item.terrain.sourceIds
                + item.geology.sourceIds
                + [source for similarity in item.similarities for source in similarity.sourceIds]
                + [source for tag in item.practice for source in tag.sourceIds]
                + item.limitSourceIds
                + [item.visuals.earth.sourceId, item.visuals.target.sourceId]
            )
            unknown = set(references) - sources
            if unknown:
                raise ValueError(f"unknown sources in {item.id}: {sorted(unknown)}")
        return self


def overall_rating(terrain: Rating | None, geology: Rating | None) -> Overall:
    if terrain is None or geology is None:
        return "Insufficient evidence"
    if terrain == "Weak" or geology == "Weak":
        return "Weak"
    if terrain == "Strong" and geology == "Strong":
        return "Strong"
    return "Moderate"


def coverage(item: Comparison) -> int:
    return int(item.terrain.rating is not None) + int(item.geology.rating is not None)


def rank_key(item: Comparison) -> tuple[int, int, str]:
    if item.status != "reviewed" or coverage(item) != 2:
        raise ValueError("only fully reviewed comparisons may be ranked")
    assert item.terrain.rating is not None and item.geology.rating is not None
    return (RANK[item.terrain.rating], RANK[item.geology.rating], item.earthId)


def explanation(item: Comparison) -> str:
    dimensions = []
    for label, dimension in (("Terrain", item.terrain), ("Geology", item.geology)):
        if dimension.rating is None:
            dimensions.append(f"{label} is not rated: {dimension.missingReason}")
        else:
            dimensions.append(f"{label} is rated {dimension.rating}: {dimension.evidence}")
    practice = (
        f"A possible use to assess is {item.practice[0].label.lower()}."
        if item.practice else "No evidence-backed practice activity is assigned."
    )
    status = (
        "This desk-reviewed comparison remains outside ranked results because one or both dimensions lack sufficient evidence."
        if item.status == "reviewed" and coverage(item) < 2
        else "This sourced candidate remains outside ranked results pending review."
        if item.status != "reviewed"
        else ""
    )
    return " ".join(
        part for part in (
            *dimensions,
            f"Evidence context: {item.similarities[0].sharedObservation}" if item.similarities else "",
            practice,
            f"Important differences: {item.terrain.difference} {item.geology.difference}",
            status,
        )
        if part
    )


def publishable(dataset: Dataset) -> dict:
    """Produce one validated record used by both the website and PDF generator."""
    result = dataset.model_dump(mode="json")
    for item in result["comparisons"]:
        original = next(row for row in dataset.comparisons if row.id == item["id"])
        item["overall"] = overall_rating(original.terrain.rating, original.geology.rating)
        item["coverage"] = coverage(original)
        item["rankEligible"] = original.status == "reviewed" and coverage(original) == 2
        item["rankOrder"] = None
        item["explanation"] = explanation(original)
        item["explanationSourceIds"] = sorted(set(
            original.relationshipSourceIds + original.terrain.sourceIds + original.geology.sourceIds
            + [source for similarity in original.similarities for source in similarity.sourceIds]
            + original.limitSourceIds
            + [source for tag in original.practice for source in tag.sourceIds]
        ))
        item["reportPath"] = f"/reports/{original.id}-{dataset.datasetVersion}.pdf"
    for target_id in {item.targetId for item in dataset.comparisons}:
        ranked = sorted(
            (item for item in dataset.comparisons if item.targetId == target_id and item.status == "reviewed" and coverage(item) == 2),
            key=rank_key,
        )
        for position, item in enumerate(ranked, start=1):
            next(row for row in result["comparisons"] if row["id"] == item.id)["rankOrder"] = position
    return result
