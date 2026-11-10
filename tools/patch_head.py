#!/usr/bin/env python3
"""Patch docs/index.html: shorten the meta description, add the head tags.

Run standalone (python3 tools/patch_head.py) or from a workflow. Keeping it out
of the workflow YAML matters: HTML at column 1 inside a YAML block scalar
terminates the scalar, which silently makes the whole workflow unparseable and
GitHub then reports "Workflow does not have 'workflow_dispatch' trigger".

Idempotent — re-running does nothing once the tags are present.
"""

import json
import pathlib
import re
import sys

DESC = ("Panchang, kundli, matching, numerology and Vastu \u2014 free, no account, "
        "nothing collected. Verified planetary data, works offline.")

BLOCK = """
<link rel="canonical" href="https://devrajai.github.io/daily-bodh/">
<meta name="theme-color" content="#4c1d95">
<link rel="icon" href="icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="icon.svg">
<link rel="manifest" href="manifest.webmanifest">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Daily Bodh">
<meta property="og:title" content="Daily Bodh \u2014 Panchang, Kundli, Numerology">
<meta property="og:description" content="DESC_HERE">
<meta property="og:url" content="https://devrajai.github.io/daily-bodh/">
<meta property="og:image" content="https://devrajai.github.io/daily-bodh/icon.svg">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="Daily Bodh \u2014 Panchang, Kundli, Numerology">
<meta name="twitter:description" content="DESC_HERE">
<meta name="twitter:image" content="https://devrajai.github.io/daily-bodh/icon.svg">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Daily Bodh",
  "url": "https://devrajai.github.io/daily-bodh/",
  "description": "DESC_HERE",
  "inLanguage": "en-IN",
  "isAccessibleForFree": true
}
</script>
"""


def main() -> int:
    p = pathlib.Path("docs/index.html")
    if not p.exists():
        print("docs/index.html not found", file=sys.stderr)
        return 1

    s = p.read_text(encoding="utf-8")
    before = len(s)

    assert 100 <= len(DESC) <= 160, f"description is {len(DESC)} chars"

    s, n = re.subn(
        r'(<meta[^>]*name=["\']description["\'][^>]*content=["\'])(.*?)(["\'])',
        lambda m: m.group(1) + DESC + m.group(3), s, count=1, flags=re.S)
    print(f"meta description replaced: {n}")

    if "og:site_name" in s:
        print("head tags already present")
    else:
        m = re.search(r"</title>", s)
        if not m:
            print("no </title> in index.html", file=sys.stderr)
            return 1
        s = s[:m.end()] + BLOCK.replace("DESC_HERE", DESC) + s[m.end():]
        print("head tags inserted")

    p.write_text(s, encoding="utf-8")
    print(f"index.html {before} -> {len(s)} bytes")

    d = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\'](.*?)["\']', s, re.S)
    assert d and len(d.group(1)) <= 160, "description not shortened"
    for tag in ("canonical", "og:site_name", "og:image", "twitter:card",
                "application/ld+json", "manifest", "theme-color", 'rel="icon"'):
        assert tag in s, f"missing {tag}"
    m = re.search(r'<script type="application/ld\+json">(.*?)</script>', s, re.S)
    json.loads(m.group(1))
    assert s[s.find("<body"):].startswith("<body>"), "body start changed"
    print("verified: all tags present, JSON-LD parses, body clean")
    return 0


if __name__ == "__main__":
    sys.exit(main())
