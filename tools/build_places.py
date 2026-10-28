#!/usr/bin/env python3
"""Build the offline place gazetteer for Daily Bodh from GeoNames.

GeoNames publishes a per-country dump of every populated place with
coordinates. India's is about 558,000 entries - village level, which is what
makes a birth chart's latitude and longitude usable rather than a guess.

Licence: GeoNames is CC BY 4.0. The attribution is rendered on the site's
source page; keep it there.

Why the data is split
---------------------
Uttar Pradesh alone is 4.4 MB of JSON. A phone cannot load that to find one
village. So each state is split by name prefix, recursively, until a file is
under the size cap. The manifest maps every prefix to its file, and the browser
loads exactly one file for whatever the user typed.

Build-time only: CI fetches the dump, this writes docs/data/places/. Nothing is
fetched at runtime, so the site and the app stay fully offline.
"""
import argparse, collections, io, json, os, re, urllib.request, zipfile

SRC_URL = "https://download.geonames.org/export/dump/IN.zip"
ADMIN_URL = "https://download.geonames.org/export/dump/admin1CodesASCII.txt"
UA = {"User-Agent": "DailyBodh/1.0 (offline astrology app)"}
CAP = 200 * 1024          # bytes of JSON per emitted file
MAX_DEPTH = 4             # prefix length to split on, at most


def _alpha(c):
    return c if re.match(r"[a-z]", c) else "_"


def _blob(rows):
    return json.dumps(rows, ensure_ascii=False, separators=(",", ":")).encode()


def split_state(rows, prefix, depth, out, stats):
    """Recursively split `rows` by name prefix until each file is under CAP."""
    blob = _blob(rows)
    if len(blob) <= CAP or depth >= MAX_DEPTH:
        out.append((prefix, rows, len(blob)))
        return
    buckets = collections.defaultdict(list)
    for r in rows:
        c = r[0][depth].lower() if len(r[0]) > depth else "_"
        buckets[_alpha(c)].append(r)
    if len(buckets) == 1:                       # cannot split further
        out.append((prefix, rows, len(blob)))
        return
    for k in sorted(buckets):
        split_state(buckets[k], prefix + k, depth + 1, out, stats)


def load_from_zip(path_or_url):
    if os.path.exists(path_or_url):
        raw = open(path_or_url, "rb").read()
    else:
        raw = urllib.request.urlopen(
            urllib.request.Request(path_or_url, headers=UA), timeout=600).read()
    zf = zipfile.ZipFile(io.BytesIO(raw))
    # GeoNames ships readme.txt next to the data file. Never take the readme.
    cand = [n for n in zf.namelist() if n.endswith(".txt") and "readme" not in n.lower()]
    if len(cand) != 1:
        raise SystemExit(f"expected one data file in the archive, found {cand}")
    return zf, cand[0]


def state_names():
    try:
        txt = urllib.request.urlopen(
            urllib.request.Request(ADMIN_URL, headers=UA), timeout=120).read().decode("utf-8")
    except Exception:
        return {}
    names = {}
    for line in txt.splitlines():
        p = line.split("\t")
        if p[0].startswith("IN.") and len(p) > 1:
            names[p[0].split(".")[1]] = p[1]
    return names


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True, help="docs/data/places")
    ap.add_argument("--src", default=SRC_URL, help="IN.zip path or URL")
    ap.add_argument("--from-dir", help="local dir of state-*.json + manifest.json (skip the zip)")
    a = ap.parse_args()

    by_state = collections.defaultdict(list)
    if a.from_dir:
        man = json.load(open(os.path.join(a.from_dir, "manifest.json")))
        for st in man:
            for r in json.load(open(os.path.join(a.from_dir, st["file"]))):
                by_state[st["code"]].append(r)
        names = {st["code"]: st["name"] for st in man}
    else:
        zf, member = load_from_zip(a.src)
        names = state_names()
        with zf.open(member) as f:
            for line in io.TextIOWrapper(f, encoding="utf-8"):
                p = line.rstrip("\n").split("\t")
                if len(p) < 19 or p[6] != "P":       # P = populated place
                    continue
                try:
                    lat, lon = round(float(p[4]), 3), round(float(p[5]), 3)
                except ValueError:
                    continue
                by_state[p[10]].append([p[1], lat, lon])

    os.makedirs(a.out, exist_ok=True)
    manifest = {"source": "GeoNames (CC BY 4.0)", "total": 0, "states": {}}
    written = 0
    biggest = (0, "")

    for code in sorted(by_state):
        rows = by_state[code]
        rows.sort(key=lambda r: r[0].lower())
        chunks = []
        buckets = collections.defaultdict(list)
        for r in rows:
            buckets[_alpha(r[0][0].lower() if r[0] else "_")].append(r)
        for k in sorted(buckets):
            split_state(buckets[k], k, 1, chunks, None)
        entries = []
        for prefix, chunk_rows, size in chunks:
            fn = f"{code}-{prefix}.json"
            with open(os.path.join(a.out, fn), "w", encoding="utf-8") as f:
                json.dump(chunk_rows, f, ensure_ascii=False, separators=(",", ":"))
            entries.append({"p": prefix, "f": fn, "n": len(chunk_rows)})
            written += 1
            if size > biggest[0]:
                biggest = (size, fn)
        manifest["states"][code] = {"name": names.get(code, code), "count": len(rows),
                                    "chunks": entries}
        manifest["total"] += len(rows)

    with open(os.path.join(a.out, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, separators=(",", ":"))

    print(f"places: {manifest['total']:,} in {len(manifest['states'])} states")
    print(f"files written: {written}")
    print(f"largest chunk: {biggest[1]} at {biggest[0]/1024:.0f} KB")


if __name__ == "__main__":
    main()
