"""Build the static atlas and reports from the supplied CSVs."""

from __future__ import annotations

import json
import os
from html import escape
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate

from pipeline.csv_loader import load_dataset
from pipeline.models import publishable


ROOT = Path(__file__).resolve().parents[1]
PROCESSED = ROOT / "data" / "processed" / "atlas.json"
PUBLIC = ROOT / "web" / "public" / "data" / "atlas.json"
REPORTS = ROOT / "web" / "public" / "reports"


def _paragraph(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(escape(text), style)


def write_report(record: dict, dataset: dict, path: Path) -> None:
    sites = {site["id"]: site for site in dataset["sites"]}
    sources = {source["id"]: source for source in dataset["sources"]}
    criteria = {criterion["key"]: criterion for criterion in dataset["criteria"]}
    earth, target = sites[record["earthId"]], sites[record["targetId"]]
    styles = getSampleStyleSheet()
    title = ParagraphStyle("TTTitle", parent=styles["Title"], fontSize=18, leading=22, textColor=colors.HexColor("#142a43"), spaceAfter=10)
    heading = ParagraphStyle("TTHeading", parent=styles["Heading2"], textColor=colors.HexColor("#15586a"), spaceBefore=13, spaceAfter=5)
    body = ParagraphStyle("TTBody", parent=styles["BodyText"], leading=13, spaceAfter=5, alignment=TA_LEFT)
    note = ParagraphStyle("TTNote", parent=body, textColor=colors.HexColor("#41536b"), fontSize=9, leading=12)
    story: list = [
        _paragraph(f"TerraTwin evidence report - {record['id']}", title),
        _paragraph(f"{earth['name']} and {target['name']}", heading),
        _paragraph(f"Status: {record['status']} | Overall: {record['overall']} | Evidence: {record['coverage']}/2 dimensions supported", body),
        _paragraph(f"Dataset {dataset['datasetVersion']} | Rubric {dataset['reviewProfile']} | Order {dataset['orderingProfile']}", note),
        _paragraph("Qualitative screening judgment; no similarity percentage or route-safety assessment.", note),
        _paragraph("Feature scope", heading),
        _paragraph(f"Earth: {earth['feature']}. Locator: {earth['locator']}", body),
        _paragraph(f"Earth map marker: {earth['mapPointKind']}. Coordinate note: {earth['coordinateNote']}. Convention: {earth['coordinateConvention']}", note),
        _paragraph(f"{target['body'].title()}: {target['feature']}. Locator: {target['locator']}", body),
        _paragraph(f"Planetary coordinate convention: {target['coordinateConvention']}. {target['coordinateNote']}", note),
        _paragraph(f"Relationship: {record['relationship']} [{', '.join(record['relationshipSourceIds'])}]", body),
    ]
    for key in ("terrain", "geology"):
        dimension = record[key]
        criterion = criteria[key]
        story += [
            _paragraph(f"{criterion['id']} - {criterion['title']}", heading),
            _paragraph(f"Question: {criterion['question']} | Readiness: {criterion['readiness']}", note),
            _paragraph(f"Rating: {dimension['rating'] or 'Insufficient evidence'} | Sources: {', '.join(dimension['sourceIds'])}", body),
            _paragraph(f"Evidence: {dimension['evidence']}", body),
            _paragraph(f"Difference: {dimension['difference']}", body),
        ]
        if dimension["missingReason"]:
            story.append(_paragraph(f"Missing review: {dimension['missingReason']}", note))
    story += [_paragraph("Documented similarity", heading), _paragraph(record["similaritySummary"], body)]
    for similarity in record["similarities"]:
        story.append(_paragraph(
            f"{similarity['id']} · {similarity['dimension'].title()} similarity: {similarity['sharedObservation']} "
            f"Limitation: {similarity['limitation']} "
            f"Earth locator: {similarity['earthLocator']} Planetary locator: {similarity['planetaryLocator']} "
            f"Scale: {similarity['scaleNote']} Sources: {', '.join(similarity['sourceIds'])}", body
        ))
    story += [_paragraph("Explanation and practice", heading), _paragraph(record["explanation"], body)]
    if record["practice"]:
        for tag in record["practice"]:
            story.append(_paragraph(f"{tag['label']} ({tag['status']}): {tag['reason']} Limitations: {tag['limitations']} [{', '.join(tag['sourceIds'])}]", body))
    else:
        story.append(_paragraph("No evidence-backed practice tag is assigned to this comparison.", note))
    story.append(_paragraph("Limits and missing imagery", heading))
    for limit in record["limits"]:
        story.append(_paragraph(f"- {limit}", body))
    story.append(_paragraph(f"Limit sources: {', '.join(record['limitSourceIds'])}", note))
    for side, name in (("earth", "Earth"), ("target", "Planetary")):
        visual = record["visuals"][side]
        story.append(_paragraph(f"{name} image: {visual['missingReason'] or visual['localPath']} Scale: {visual['scale']}. Credit: {visual['credit']}. [{visual['sourceId']}]", note))
    story += [
        _paragraph("Method and source register", heading),
        _paragraph(record["reviewNotes"], body),
        _paragraph(f"Review: {record['reviewStatus']} | {record['reviewer'] or 'pending'} | Date: {record['reviewDate'] or 'pending'} | Rank eligible: {'yes' if record['rankEligible'] else 'no'}", body),
    ]
    used = set(record["relationshipSourceIds"] + record["terrain"]["sourceIds"] + record["geology"]["sourceIds"] + record["limitSourceIds"])
    used.update(source for similarity in record["similarities"] for source in similarity["sourceIds"])
    used.update(source for tag in record["practice"] for source in tag["sourceIds"])
    used.update([earth["mapPointSourceId"], target["mapPointSourceId"], record["visuals"]["earth"]["sourceId"], record["visuals"]["target"]["sourceId"]])
    for source_id in sorted(used):
        source = sources[source_id]
        story.append(_paragraph(f"{source_id} | {source['provider']} | {source['title']} | {source['locator']}", note))
        story.append(Paragraph(f'<link href="{escape(source["url"], quote=True)}" color="#176b87">{escape(source["url"])}</link>', note))
    path.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(path), pagesize=(8.5 * inch, 11 * inch), rightMargin=0.65 * inch, leftMargin=0.65 * inch, topMargin=0.65 * inch, bottomMargin=0.65 * inch, title=f"TerraTwin {record['id']} evidence report", pageCompression=0)
    doc.build(story)


def build() -> dict:
    dataset = load_dataset()
    dataset.datasetVersion = os.environ.get("ATLAS_DATASET_VERSION", dataset.datasetVersion)
    output = publishable(dataset)
    serialized = json.dumps(output, indent=2, ensure_ascii=False) + "\n"
    PROCESSED.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC.parent.mkdir(parents=True, exist_ok=True)
    PROCESSED.write_text(serialized, encoding="utf-8")
    PUBLIC.write_text(serialized, encoding="utf-8")
    for record in output["comparisons"]:
        write_report(record, output, REPORTS / Path(record["reportPath"]).name)
    return output


if __name__ == "__main__":
    result = build()
    print(f"Built {len(result['comparisons'])} comparison records and PDFs from the research CSVs")
