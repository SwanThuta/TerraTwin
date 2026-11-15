"""Download the source-backed site images declared in data/site-images.json."""

from __future__ import annotations

import json
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "data" / "site-images.json"
DEST = ROOT / "web" / "public" / "site-images"


def fetch(entry: dict[str, str]) -> str:
    site_id = entry["siteId"]
    body = {"E": "earth", "L": "moon", "M": "mars"}[site_id[0]]
    request = urllib.request.Request(entry["imageUrl"], headers={"User-Agent": "TerraTwin educational image catalog/1.0"})
    with urllib.request.urlopen(request, timeout=90) as response:
        content = response.read()
        content_type = response.headers.get("Content-Type", "")
    if content.startswith(b"\xff\xd8\xff"):
        extension = "jpg"
    elif content.startswith(b"\x89PNG\r\n\x1a\n"):
        extension = "png"
    elif content.startswith(b"RIFF") and content[8:12] == b"WEBP":
        extension = "webp"
    else:
        raise ValueError(f"{site_id}: unknown image format ({content_type}; {content[:30]!r})")
    if len(content) < 1_000:
        raise ValueError(f"{site_id}: image unexpectedly small ({len(content)} bytes)")
    path = DEST / body / f"{site_id}-01.{extension}"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(content)
    return f"{site_id}: {path.relative_to(ROOT)} ({len(content):,} bytes)"


def main() -> None:
    entries = json.loads(MANIFEST.read_text(encoding="utf-8"))
    with ThreadPoolExecutor(max_workers=6) as pool:
        pending = {pool.submit(fetch, entry): entry["siteId"] for entry in entries}
        for future in as_completed(pending):
            try:
                print(future.result(), flush=True)
            except Exception as exc:
                print(f"FAILED {pending[future]}: {exc}", flush=True)


if __name__ == "__main__":
    main()
