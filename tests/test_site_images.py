"""Keep the published photos tied to the documented site and source."""

import json
from pathlib import Path

from pipeline.csv_loader import ROOT, load_dataset
from pipeline.models import publishable


def test_all_compared_sites_have_sourced_images() -> None:
    manifest = {row["siteId"]: row for row in json.loads((ROOT / "data/site-images.json").read_text(encoding="utf-8"))}
    atlas = publishable(load_dataset())
    assert set(manifest) == {site["id"] for site in atlas["sites"]}
    sources = {source["id"]: source for source in atlas["sources"]}

    for pair in atlas["comparisons"]:
        for site_id, visual in ((pair["earthId"], pair["visuals"]["earth"]),
                                (pair["targetId"], pair["visuals"]["target"])):
            entry = manifest[site_id]
            assert visual["localPath"] and visual["missingReason"] is None
            assert visual["sourceId"] == f"IMG_{site_id}"
            assert sources[visual["sourceId"]]["url"] == entry["pageUrl"]
            assert visual["scope"] == entry["scope"]
            assert visual["caption"] == entry["caption"]
            assert visual["credit"] == entry["credit"]
            assert visual["acquired"] == entry["acquired"]
            path = ROOT / "web/public" / visual["localPath"].lstrip("/")
            image = path.read_bytes()
            assert image.startswith((b"\xff\xd8\xff", b"\x89PNG\r\n\x1a\n"))
            assert len(image) > 1_000
